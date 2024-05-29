import React, {useState, useEffect, useRef} from 'react';
import { TextInput,Animated, StyleSheet, Text, View, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; 
// import RNFetchBlob from 'rn-fetch-blob';
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import { generateClient } from 'aws-amplify/api';
import { deleteBill, deleteBillItem, updateBill, updateProduct,createNotifications, createPurchaseOrder, createPurchaseItem, updatePurchaseOrder } from '../src/graphql/mutations';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getProduct } from '../src/graphql/queries.js';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { DataTable } from 'react-native-paper';

const UploadPurchase = ({route}) => {
    const vendorRef = useRef('');
    const [date, setDate] = useState('');
    const [vendor, setVendor] = useState(route.params?.vendor);
    const [amount, setAmount] = useState('');
    const [scannedProducts, setScannedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [isEmptyField, setIsEmptyField] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const userId= useSelector((state) => state.user.userId);
    const userName = useSelector((state) => state.user.username);
    const [totalAmount, setTotalAmount] = useState(0);
    const storeID = useSelector((state) => state.user.storeId);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const client = generateClient();
    const navigation = useNavigation();
    const storeCurrency  = useSelector(state => state.currency.value); 
    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    
    useEffect(() => {
        console.log("Vendor Received",vendor)
        if (route.params?.vendor) {
            setVendor(route.params.vendor);
        }
    }, [route.params?.vendor]);

    
    const handleScannedProduct = (product) => {
        setScannedProducts([...scannedProducts, product]);
    }
    
    useEffect(() => {
        let calculatedTotalAmount = 0;
        scannedProducts.forEach((product) => {
          calculatedTotalAmount += product.price * product.quantity;
        });
        setTotalAmount(calculatedTotalAmount);
      }, [scannedProducts]);

    const handleLoading = () => {
        setLoading(true)
        setSuccessMessage(true);
      }

      const handleSuccessButtonPress= () => {
        setLoading(false)
        setSuccessMessage(false); 
        setSuccess(false); 
        navigation.navigate('PurchaseHistory');
      }

      const handleErrorButtonPress= () => {
        setLoading(false)
        setError(false); 
      }

      

    const handleChoosePhoto = () => {
        launchImageLibrary({}, (response) => {
          console.log(response);
          if (response.assets && response.assets.length > 0) {
            const imageUri = response.assets[0].uri;
            setSelectedImage(imageUri); 
            setSelectedImageUri(response.assets[0]); 
            console.log(selectedImage);
          } else {
            console.log('No image selected or unexpected response structure');
          }
        });
    };
     
    const printReceipt = async () => {
        setLoading(true);
        try {
            const updateBillInput = {
              id: currentBillId,
              totalAmount: totalAmount,
              status: "PAID",
              _version: version,
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
          await BluetoothEscposPrinter.printText(`Total: ${totalBillAmount.toFixed(2)}\n`, {});
          await BluetoothEscposPrinter.printText("Thank you for your purchase!\n\n\n", {});
        } catch (error) {
          console.error("Failed to print receipt:", error);
        }
        
      };
    
    const handleAddProduct = () => {
        console.log("Vendor before going",vendor);
        navigation.navigate('ScanPurchaseOrder', { vendor:vendor});
    };
    
    useEffect(() => {
        console.log("Products",scannedProducts);
        if (route.params?.scannedProducts) {
            setScannedProducts(route.params.scannedProducts);
        }
    }, [route.params?.scannedProducts]);
    
    
    useEffect(() => {
        console.log("store",storeID);
       
    }, []);
    useEffect(() => {
        console.log("store1",storeID);
       
    }, [storeID]);
    const uploadImageToS3 = async (imageUri, fileName) => {
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            console.log("image ::: "+imageUri);
            console.log("bloob: "+blob);
    
            const uploadResult = await uploadData({
                key: fileName,
                data: blob,
                options: {
                    contentType: 'image/jpeg', 
                    accessLevel :'guest',
                }
            }).result;
            console.log('Upload success:', uploadResult);
            return uploadResult.key; 
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };
    
    const getImageUrlFromS3 = async (fileKey) => {
      try {
          console.log("file key is here: " + fileKey);
          
          // Fetch the signed URL for the uploaded file
          const getUrlResult = await getUrl({
              key: fileKey,
              options: {
                  accessLevel: 'guest',
                  useAccelerateEndpoint: true, 
              },
          });
          
          console.log('***************************Signed Image :', getUrlResult);
          console.log('***************************Signed Image URL:', getUrlResult.url);
          return getUrlResult.url; // Return the signed URL
      } catch (error) {
          console.error('Error getting image URL:', error);
          throw error;
      }
    };
      
    
    const onSubmit = async () => {
        console.log('Product:');
        Keyboard.dismiss();
        setLoading(true);
        try {
            console.log('Scanned Products:', scannedProducts);
            let totalAmount = 0;
            scannedProducts.forEach(product => {
                totalAmount += product.price * product.quantity;
            });
            
            const newPurchaseOrder = await client.graphql({
                query: createPurchaseOrder,
                variables: {
                    input: {
                        purchaser: userId,
                        purchaserName: userName,
                        vendor: vendor,
                        totalAmount: totalAmount,
                        status: 'PENDING',
                        storePurchaseOrderId:storeID
                    }
                },
                authMode: 'apiKey',
            });
    
            console.log("New",newPurchaseOrder);
    
            const createPurchaseItemPromises = scannedProducts.map(async (product) => {
                console.log("Products",product);
                const createPurchaseItemInput = {
                    productName: product.name,
                    productPrice: product.price,
                    quantityOrdered: product.quantity,
                    quantityReceived: 0,
                    purchaseOrderPurchaseItemsId: newPurchaseOrder.data.createPurchaseOrder.id,
                    productPurchaseItemsId: product.id,
                };
    
                console.log("Item Input", createPurchaseItemInput);
    
                return client.graphql({
                    query: createPurchaseItem,
                    variables: { input: {
                        productName: product.name,
                        productPrice: product.price,
                        quantityOrdered: product.quantity,
                        quantityReceived: 0,
                        productPurchaseItemsId: product.id,      
                        purchaseOrderItemsId: newPurchaseOrder.data.createPurchaseOrder.id           
                    } },
                    authMode: 'apiKey',
                });
            });

            const createdPurchaseItems = await Promise.all(createPurchaseItemPromises);
            console.log('Created Purchase Items:', createdPurchaseItems);    
            const updatingPurchaseOrders=await client.graphql({
                query: updatePurchaseOrder,
                variables: { input: {
                    id: newPurchaseOrder.data.createPurchaseOrder.id,
                    totalAmount: totalAmount.toString(), 
                    _version: newPurchaseOrder.data.createPurchaseOrder._version,
                }},
                authMode: 'apiKey',
            });
           
            // console.log('Number of Purchase Items Created:', createdPurchaseItems.length);
            // console.log('Number of Purchase Items Created:',updatingPurchaseOrders);
            setSuccess(true);
            setSuccessMessage(true);
           
            
        } catch (error) {
            setError(true);
            setLoading(false);
            console.error('Error creating purchase order items:', error);
        
        }
    };
    
       
    
    const handleDeleteItem = (index) => {
        const updatedScannedProducts = [...scannedProducts]; // Create a copy of the scannedProducts array
        updatedScannedProducts.splice(index, 1); // Remove the item at the specified index
        setScannedProducts(updatedScannedProducts); // Update the state with the modified array
    };

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
{success &&
                <View style={styles.successMessageContainer}>
                    <Text style={styles.successText}>PO generated successfully!</Text>
                    <TouchableOpacity style={styles.successButton} onPress={handleSuccessButtonPress}>
    <Text style={styles.buttonText}>OK</Text>
</TouchableOpacity>

                </View>
}
            {error && (
                <View style={styles.errorMessageContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                    <TouchableOpacity style={styles.errorButton} onPress={handleErrorButtonPress}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            )}

 </View>
)}
   <View style={styles.header}>
       <TouchableOpacity style={styles.arrowBackIcon}  onPress={()=> navigation.goBack()}>
           <Ionic size={24} color={COLORS.primary} name ='chevron-back-outline'/>
       </TouchableOpacity>
   </View>
   <View style={styles.headContainer2}>
   <View style={styles.headingText}> 
    <Text style={styles.totalBill}>Purchase Order</Text>
    <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmountText}>
            Total Amount: {`${storeCurrency || '$'} ${totalAmount.toFixed(2)}`}
        </Text>
      </View>
    </View>
    <View  style={styles.headerContainer}>
    <View style={styles.vendorComponent}>
        <Text style={styles.totalBill2}>Vendor :</Text>
        <TextInput value={vendor} onChangeText={setVendor} style={styles.formInput} placeholderTextColor='rgba(170, 170, 170,4)' placeholder="Enter Vendor Name"  />
    </View>
                                  
</View>
</View>
   <DataTable style={styles.columnHeadingContainer}>
                <DataTable.Header >
                    <DataTable.Title textStyle={{color: 'white'}} style={{justifyContent:'flex-start',flex:2}} >ITEM</DataTable.Title>
                    <DataTable.Title textStyle={{color: 'white'}} style={{justifyContent:'center'}}>QTYORD</DataTable.Title>
                    <DataTable.Title textStyle={{color: 'white'}}  style={{justifyContent:'center'}}>PRICE</DataTable.Title>
                    {/* <DataTable.Title style={{justifyContent:'center'}}>SUBTOTAL</DataTable.Title> */}
                    {/* <DataTable.Title textStyle={{color: 'white'}}  style={{justifyContent:'center'}}>QTYREC</DataTable.Title> */}
                    <DataTable.Title textStyle={{color: 'white'}}  style={{justifyContent:'center',flex:0.5}}>EDIT</DataTable.Title>
                </DataTable.Header>
                </DataTable>

                <ScrollView style={styles.scrollView}>
    {scannedProducts.map((product, index) => (
        <DataTable key={index}>
            <DataTable.Row key={index}>
                <DataTable.Cell style={{justifyContent:'flex-start',flex:2}} >{product.name}</DataTable.Cell>
                <DataTable.Cell style={{justifyContent:'center'}}>{product.quantity}</DataTable.Cell>
                <DataTable.Cell style={{justifyContent:'center'}}>{product.price}</DataTable.Cell>
                {/* <DataTable.Cell style={{justifyContent:'center'}}></DataTable.Cell> */}
                <DataTable.Cell style={{ justifyContent: 'center', flex: 0.5 }}>
                    <TouchableOpacity style={styles.deleteBill} onPress={() => handleDeleteItem(index)}>
                        <Ionic style={styles.trash} size={21.5} color={'red'} name='trash' />
                    </TouchableOpacity>
                </DataTable.Cell>
            </DataTable.Row>
        </DataTable>
    ))}
</ScrollView>

  
   <View style={styles.footerContainer}>
       <View style={styles.footerWrapper}>
           
           <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
               <Text style={styles.addText}>Add Product</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.confirmButton} onPress={onSubmit}>
               <Text style={styles.confirmText}>Confirm</Text>
           </TouchableOpacity>
       </View>
   </View>
</SafeAreaView>
)
}

 
export default UploadPurchase;

const styles = StyleSheet.create({
    headerContainer:{
        flex:0,
        backgroundColor:COLORS.primary,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    headerWrapper:{
        paddingVertical:45,
        borderBottomRightRadius:10,
        justifyContent:'center',
        alignItems:'center',
    },
    headerContainer:{
        borderBottomRightRadius:10,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row'
    },
    headerText:{
        fontFamily:'Poppins-Regular',
        fontSize:21,
        color:'white'
    },
    label:{
        fontFamily:'Poppins-Regular',
        color:COLORS.primary,
        fontSize:18.5,
        top:5,
    },
  formInputContainer:{
    borderBottomWidth:1,
    borderColor:'lightgray',
    paddingRight:20,
    paddingLeft:17,
    paddingBottom:20,
    paddingTop:20,
    width:'100%',

},
formInputContainerSelected:{
    borderBottomWidth:1,
    borderColor:'lightgray',
    paddingVertical:10,
    paddingRight:20,
    paddingLeft:17,
},

formInputWrapper:{
    flex:0,
    flexDirection:'row',
    paddingHorizontal:10,
},
formInput:{
    flex:0,
    width:'100%',
    width:300,
    height:50,
    fontSize:17,
    fontFamily:'Poppins-Regular',
    justifyContent:'center',
    alignItems:'center',
    color:'rgba(0, 0, 0,0.6)',
    borderBottomWidth:0.5,
},
formInputSize:{
    flex:0,
    fontSize:19,
    top:6,
    fontFamily:'Poppins-Regular',
    justifyContent:'center',
    alignItems:'center',
    color:'black'
},
imageContainer:{
    flex:0,
    justifyContent:'center',
    alignItems:'center',
    // paddingVertical:10,
},

inputContainer:{
    flex:1,
    paddingLeft:20,
    justifyContent:'center',
    alignItems:'center',
},
saveContainer:{
    paddingVertical:20,
    paddingHorizontal:15,
},
saveWrapper:{
    flex:0,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
},
uploadContainer:{
    paddingVertical:5,
},
uploadWrapper:{
    flex:0,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
},
saveButton:{
    backgroundColor:COLORS.primary,
    width:150,
    paddingVertical:8,
    borderRadius:30,
},
resetButton:{
    backgroundColor:'white',
    width:250,
    paddingVertical:8,
    borderRadius:30,
    borderWidth:1.5,
    borderColor:COLORS.primary,
    
},
saveText:{
    fontFamily:'Poppins-Regular',
    fontSize:18,
    color:'white',
    textAlign:'center'
},
resetText:{
    fontFamily:'Poppins-Regular',
    fontSize:18,
    color:COLORS.primary,
    textAlign:'center'
},
uploadText:{
    fontFamily:'Poppins-Regular',
    fontSize:18,
    color:COLORS.primary,
    textAlign:'center',

},
selectedImage:{
    height:170,
    resizeMode: 'cover',
    borderRadius:30,
    borderColor:COLORS.primary,
},

loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    position:'absolute',
    zIndex:999999,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText:{
    color:'white',
    fontSize:24,
    fontFamily:'Poppins-Regular',
    top:15,
  },
  successMessageContainer:{
    flex:0,
   alignItems:'center'
  },
  successButton: {
    backgroundColor: COLORS.secondary,
    width: 150,
    paddingVertical: 8,
    borderRadius: 30,
    top:20,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.primary,
    textAlign: 'center',
    top:1,
  },
  loadingText:{
    color:'white',
    fontSize:24,
    fontFamily:'Poppins-Regular',
    top:15,
  },
  loadingTextSubtitle:{
    color:'white',
    fontSize:20,
    fontFamily:'Poppins-Regular',
    top:15,
  },
  successMessageContainer:{
    flex:0,
   alignItems:'center'
  },
  successButton: {
    backgroundColor: COLORS.secondary,
    width: 150,
    paddingVertical: 8,
    borderRadius: 30,
    top:20,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.primary,
    textAlign: 'center',
    top:1,
  },
  headContainer:{ 
   flex:1,
},
headContainer2:{ 
    minHeight:100,
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
    fontSize:22,
    fontFamily:'Poppins-SemiBold',
    marginTop:15,
},
totalBill2:{
    color:COLORS.primary,
    fontSize:20,
    fontFamily:'Poppins-SemiBold',
    marginTop:15,
},
vendorComponent:{
    paddingHorizontal:10,
    margin:10,
},
totalAmountText:{
    color:COLORS.primary,
    fontFamily:'Poppins-Regular',
},
columnHeadingContainer:{
    backgroundColor:COLORS.primary,
    height:50,
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
    fontSize:12,
    flex:0.8,
    left:5,
},
headingText:{
    justifyContent:'center',
    alignItems:'center'
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
    borderWidth:2,borderColor:'green' 
},
billValues:{
    fontSize:15,
    right:3,
    color:'gray',
    borderWidth:2,borderColor:'red' 

},
successText:{
    color:'white',
    fontSize:20,
    fontFamily:'Poppins-Regular',
    top:10,
  },
valueQty:{
    flexDirection:'row',justifyContent:'center',alignItems:'center',right:3,
  

},
valuePrice:{
    flexDirection:'row',justifyContent:'center',alignItems:'center',
   
},

itemText:{
    
    paddingLeft:4,        
},
footerWrapper:{

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
    marginVertical:10,
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