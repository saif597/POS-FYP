import React, {useState, useEffect, useRef} from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import { generateClient } from 'aws-amplify/api';
import { deleteBill, deleteBillItem, updateBill, updateProduct,createNotifications } from '../src/graphql/mutations';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getProduct, getStore } from '../src/graphql/queries.js';
import { useSelector } from 'react-redux';
import Sound from 'react-native-sound';
import notifee from '@notifee/react-native';

const { width, height } = Dimensions.get('window');


const ConfirmBill = ({route}) => {
    const navigation=useNavigation();
    const storeID = useSelector((state) => state.user.storeId);
    const { scannedProductsList, totalBillAmountValue, currentBillId, version } = route.params;
    const [loading, setLoading] = useState(false);
    const [scannedProducts, setScannedProducts] = useState(scannedProductsList || []);
    const [totalBillAmount, setTotalBillAmount] = useState(totalBillAmountValue||0);
    const userName = useSelector((state) => state.user.username);
    const storeName = useSelector((state) => state.user.storename);
    const client = generateClient();
    const handleAddProduct = () => {
        navigation.navigate('Scan', { scannedProductsList: scannedProducts });
    };
    const [billStatus, setBillStatus] = useState('UNPAID'); 
    const storeCurrency = useSelector(state => state.currency.value); 
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [storeDetails, setStoreDetails] = useState({address: ''});
    useEffect(() => {
      const fetchStoreDetails = async () => {
          try {
              const response = await client.graphql({
                  query: getStore,
                  variables: { id: storeID },
                  authMode: 'apiKey',
              });
              if (response.data.getStore) {
                  setStoreDetails({
                      address: response.data.getStore.address,
                  });
              }
          } catch (error) {
              console.error('Error fetching store details:', error);
          }
      };

      fetchStoreDetails();
  }, [storeID, client]);

    useEffect(() => {
      if (billStatus === 'PAID') {
        
        Animated.timing(fadeAnim, {
          toValue: 1, 
          duration: 1900, 
          useNativeDriver: true,
        }).start();
      }
    }, [billStatus]);
  
    const showPopupNotification = async (productName,productQuantity) => {
      console.log("Notification on its way");
      try {
        await notifee.requestPermission();
    
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
          notifee.displayNotification({
            title: 'Low Shelf Quantity Alert',
            body: `${productName} | Shelf quantity: ${productQuantity}`,
            android: {
              channelId,
              pressAction: {
                id: 'default',
              },
            },
          });
          Playsound();  
          setPopupVisible(true);
        
      } catch (error) {
        console.log('Error displaying notification:', error);
      }
    };
    
    const Playsound = ()=>{
      var beep = new Sound('paid.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        console.log('duration in seconds: ' + beep.getDuration() + 'number of channels: ' + beep.getNumberOfChannels());
        beep.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
    }
    
const printReceipt = async () => {
        setLoading(true);
        try {
            const updateBillInput = {
              id: currentBillId,
              totalAmount: totalBillAmount,
              status: "PAID",
              _version: version,
              cashierName: userName,
              storeBillsId: storeID
            };
      
            await client.graphql({
              query: updateBill,
              variables: { input: updateBillInput },
              authMode: 'apiKey',
            });
      
            console.log("Bill Finalized Successfully");
            await updateProductShelfQuantity();
            console.log("Shelf Quantity Updated Successfully");
            setLoading(false);
            setBillStatus('PAID');
            setScannedProducts([]);
          } catch (error) {
            setLoading(false);
            console.error("Error finalizing the bill:", error);
          }
        console.log("Printing ",scannedProducts);
        try {
          await BluetoothEscposPrinter.printerInit();
          await BluetoothEscposPrinter.printerLeftSpace(0);
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText(`${storeName || 'Storename'}\n`, {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 3,
            heigthtimes: 3,
            fonttype: 1
        });
      
        await BluetoothEscposPrinter.printText(`${storeDetails.address || 'Store Address'}\n\n`, {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 2,
          heigthtimes: 2,
          fonttype: 1
        });
      
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
          await BluetoothEscposPrinter.printText(`Cashier: ${userName}\n`, {});
          await BluetoothEscposPrinter.printText("--------------------------------\n", {});

          await BluetoothEscposPrinter.printText("PRODUCT NAME        QTY      PRICE      SUBTOTAL\n", {});

          scannedProducts.forEach(async (item) => {
            let itemName = item.name.padEnd(20); 
            let itemLine = `${itemName} ${item.quantity.toString().padEnd(7)} ${item.price.toString().padEnd(10)} ${item.subtotal.toFixed(2)}\n`;
            await BluetoothEscposPrinter.printText(itemLine, {});
          });
        
          await BluetoothEscposPrinter.printText("--------------------------------\n", {});
          await BluetoothEscposPrinter.printText(`Total: ${storeCurrency || '$'}${totalBillAmount.toFixed(2)}\n`, {});
          await BluetoothEscposPrinter.printText("Thank you for your purchase!\n\n\n", {});
        } catch (error) {
          console.error("Failed to print receipt:", error);
        }
        
      };

      const updateProductShelfQuantity = async () => {
        try {
          for (const product of scannedProducts) {
            const currentProductDetails = await client.graphql({
              query: getProduct, 
              variables: { id: product.productId },
              authMode: 'apiKey',
            });
          const currentShelfQuantity = currentProductDetails.data.getProduct.shelfQuantity;
          const newShelfQuantity = currentShelfQuantity - product.quantity;
          const updatedProduct= await client.graphql({
              query: updateProduct,
              variables: {
                input: {
                  id: currentProductDetails.data.getProduct.id,
                  shelfQuantity: newShelfQuantity,
                  _version:currentProductDetails.data.getProduct._version,
                },
              },
              authMode: 'apiKey',
            });
            console.log("Updated Product",updatedProduct.data.updateProduct);
            const up=updatedProduct.data.updateProduct;
            if (up && up.shelfQuantity <= up.shelfInventoryLimit) {
              const notificationInput = {
                input: {
                  warehousequanity: up.warehouseQuantity,
                  shelfquantity: up.shelfQuantity, 
                  productID: up.id,
                  productname: up.name, 
                  isRead: false,
                  isWarehouseNotification: false, 
                  isShelfNotification: true, 
                },
                authMode: 'apiKey',
              };
              try {
                const newNotification = await client.graphql({
                  query: createNotifications,
                  variables: { input: {
                    warehousequanity: up.warehouseQuantity,
                    shelfquantity: up.shelfQuantity, 
                    productID: up.id,
                    productname: up.name, 
                    isRead: false,
                    isWarehouseNotification: false, 
                    isShelfNotification: true,
                    storeNotificationsId:storeID, 
                  }},
                  authMode: 'apiKey',
                });
                showPopupNotification(up.name,up.shelfQuantity);
                console.log('New Notification:', newNotification);
              } catch (error) {
                console.error('Error creating notification:', error);
              }
            }
      
            console.log(`Updated product ${product.name} with new shelf quantity: ${newShelfQuantity}`);
          }
        } catch (error) {
          console.error("Error updating product shelf quantity:", error);
        }
      };
      
      const deleteBillItemFunction = async (id,billItemVersion) => {
        try {
            console.log("Bill item about to be deleted", id, billItemVersion);
            console.log("Product to be deleted", scannedProducts.find(product => product.id === id));
            console.log("All bill items before deletion", scannedProducts);
            await client.graphql({
                query: deleteBillItem, 
                variables: { input: { id: id,_version:billItemVersion } },
                authMode: 'apiKey',
            });
            console.log("Bill item deleted successfully");
            const updatedProducts = scannedProducts.filter(product => product.id !== id && !product._deleted);
            console.log("Updated Products",updatedProducts);
            setScannedProducts(updatedProducts);    
        } catch (error) {
            console.error("Error deleting bill item:", error);
        }
    };
 

    useEffect(() => {
        if (route.params?.scannedProductsList) {
            const filteredProducts = route.params.scannedProductsList.filter(product => !product._deleted);
            setScannedProducts(filteredProducts);
        }
    }, [route.params?.scannedProductsList]);
    

    useEffect(() => {
        const total = scannedProducts.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
        setTotalBillAmount(total);
    }, [scannedProducts]);


  return (
    
    <SafeAreaView style={styles.headContainer}>
         {loading && (
      <View style={styles.loadingContainer}>
      <AnimatedCircularProgress
        size={120}
        width={15}
        duration={2200} 
        delay={10}
        fill={100}
        tintColor={COLORS.secondary}
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#3d5875" 
    />
      </View>
     )}
        <View style={styles.header}>
            <TouchableOpacity style={styles.arrowBackIcon}  onPress={()=> navigation.goBack()}>
                <Ionic size={24} color={COLORS.primary} name ='chevron-back-outline'/>
            </TouchableOpacity>
        </View>
        <View style={styles.mainLogo}>
            <Ionic style={styles.logo}  size={90} color={'black'} name ='logo-behance'/>
        </View>
        <View style={styles.mainLogo}>
    <Text style={styles.totalBill}>{`${storeCurrency || '$'}${totalBillAmount.toFixed(2)}`}</Text>
  </View>

        <View style={styles.columnHeadingContainer}>
            <View  style={styles.columnHeading}>
                <Text style={styles.headingText1}>ITEM</Text>
                <Text style={styles.headingText}>QTY</Text>
                <Text style={styles.headingText}>PRICE</Text>
                <Text style={styles.headingText}>TOTAL</Text>
                <Text  style={styles.headingText}>DEL</Text>
            </View>
        </View>
        

        <ScrollView  style={styles.scrollView}>
        {scannedProducts.map((product, index) => (
            <View  key={`${product.id}_${index}`} style={styles.billsContainer}>
                <View style={styles.billValuesContainer}>
                    <View style={styles.itemText}>
                        <Text style={styles.billValues1}>
                            {product.name}
                        </Text>
                    </View>
                    <View style={styles.valueQty}>
                        <Text style={styles.billValues}>
                            {product.quantity}
                        </Text>                  
                    </View>
                    <View style={styles.valuePrice}>
                        <Text style={styles.billValues}>
                            {product.price}
                        </Text>
                    </View>  
                    <View style={styles.valuePrice}>
                        <Text style={styles.billValues}>
                            {product.subtotal}
                        </Text>
                    </View>    
                    <TouchableOpacity style={styles.deleteBill} onPress={() => deleteBillItemFunction(product.id,product._version)}>
                        <Ionic style={styles.trash}  size={21.5} color={'red'} name ='trash'/>
                    </TouchableOpacity>
                </View>
            </View>
             ))}
        </ScrollView>
        {billStatus === 'PAID' && (
        
        <Animated.View style={[styles.paidContainer, {opacity: fadeAnim}]}>
          <Text style={styles.paidText}>PAID</Text>
        </Animated.View>
      )}
        <View style={styles.footerContainer}>
            <View style={styles.footerWrapper}>
                <TouchableOpacity style={styles.confirmButton} onPress={printReceipt}>
                    <Text style={styles.confirmText}>Confirm Bill</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.confirmButton} onPress={convertImageToBase64}>
            <Text style={styles.confirmText}>Convert Image to Base64</Text>
          </TouchableOpacity> */}

                <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
                    <Text style={styles.addText}>Add Product</Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default ConfirmBill

const styles = StyleSheet.create({
    headContainer:{ 
        flex:1,
        backgroundColor:'white',
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        position:'absolute',
        zIndex:999999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
    header:{
       marginTop:25,
        flex:0,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        height:30
    },
    settingsText:{
        fontSize:24,
        color:COLORS.primary,
        top:2,
        fontFamily:'Poppins-Regular',
    },
    arrowBackIcon:{
        position:'absolute',
        left:8
    },
    mainLogo:{
        flex:0,
        justifyContent:'center',
        alignItems:'center'
    },
    totalBill:{
        color:COLORS.primary,
        fontSize:30,
        fontFamily:'Poppins-SemiBold',
        marginTop:15,

    },
    columnHeadingContainer:{
        flex:0,
        backgroundColor:COLORS.primary,
        height:50,
        justifyContent:'center',
        marginTop:22,
        marginHorizontal:10,
        borderRadius:15,

    },
    columnHeading:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        color:'white',
        paddingRight:2,
    },
    headingText1:{
        color:'white',
        fontSize:15,
        flex:0.8,
        left:5,
    },
    headingText:{
        color:'white',
        fontSize:15,

    },
    billValuesContainer:{
        flex:1,
        height:50,
        marginTop:8,
        marginHorizontal:10,
        borderBottomWidth:1,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
        color:'white',
        paddingHorizontal:12,
        borderColor:'rgba(180, 180, 180,4)',
    },
    billValuesContainer1:{
        flex:0,
        height:50,
        marginTop:8,
        marginHorizontal:10,
       borderBottomWidth:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        color:'white',
        paddingHorizontal:12,
        borderColor:'rgba(180, 180, 180,4)'
        
    },
    billValues:{
        fontSize:15,
        right:3,
        color:'gray',

    },
    paidContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
      },
      paidText: {
        fontSize: 50, 
        fontWeight: 'bold',
        color: 'green',
      },
    billValues1:{
        fontSize:16,
        color:'gray',
    },
    valueQty:{
        flex:0.2,flexDirection:'row',justifyContent:'center',alignItems:'center',right:3, 
  
    },
    valuePrice:{
        flex:0.5,flexDirection:'row',justifyContent:'center',alignItems:'center',
    },
  
    itemText:{
        flex:1.5,
        paddingLeft:4,        
    },
    footerWrapper:{
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:13,
    },
    confirmButton:{
        backgroundColor:COLORS.primary,
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        width:300,
        marginHorizontal:10,
        paddingVertical:8,
        borderRadius:25,
        marginBottom:10,
    },
    confirmText:{
        fontSize:18,
        color:'white',
        fontFamily:'Poppins-Regular',
        top:2,
    },
    addButton:{
        backgroundColor:'white',
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        width:300,
        marginHorizontal:10,
        paddingVertical:8,
        borderRadius:25,
        borderWidth:1,
        borderColor:COLORS.primary,
    },
    addText:{
        fontSize:18,
        color:COLORS.primary,
        fontFamily:'Poppins-Regular',
        top:2,
    }
})