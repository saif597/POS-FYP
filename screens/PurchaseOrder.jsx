import React, {useState, useEffect, useRef} from 'react';
import { TextInput, StyleSheet, Text, View, TouchableOpacity, ScrollView, Keyboard, Picker, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn, Easing, FadeInDown, FadeInUp } from 'react-native-reanimated';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import { generateClient } from 'aws-amplify/api';
import { deleteBill, deleteBillItem, updateBill, updateProduct,createNotifications, createPurchaseOrder, createPurchaseItem, updatePurchaseOrder, updatePurchaseItem } from '../src/graphql/mutations';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { DataTable } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';

const PurchaseOrder = ({route}) => {
    const viewShotRef = useRef(null);
    const [capturedImageURI, setCapturedImageURI] = useState('');
    const purchaseOrderId = route.params.purchaseOrderId;
    const purchaseStatus = route.params.purchaseStatus;
    const [status, setStatus] = useState(route.params.purchaseStatus);
    const [purchaseOrderItems, setPurchaseOrderItems] = useState([]);
    const purchaseOrderVendor = route.params.purchaseOrderVendor;
    const purchaseOrderAmount = route.params.purchaseOrderAmount;
    const purchaserName = route.params.purchaserName;
    const dateCreated = route.params.dateCreated;
    const dateUpdated = route.params.dateUpdated;
    const purchaseOrderVersion = route.params.purchaseOrderVersion;
    const [vendorName, setVendorName] = useState(route.params.purchaseOrderVendor);
    // const [vendor, setVendor] = useState(route.params.purchaseOrderVendor);
    const [scannedProducts, setScannedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const userId= useSelector((state) => state.user.userId);
    const userName = useSelector((state) => state.user.username);
    const userRole = useSelector((state) => state.user.role);
    const [totalAmount, setTotalAmount] = useState(0);
    const storeCurrency  = useSelector(state => state.currency.value); 

    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setIsTyping(true);
        }
      );
  
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setIsTyping(false);
        }
      );
  
      // Clean up listeners
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);
  

const captureView = async () => {
    try {
        const uri = await viewShotRef.current.capture();
        setCapturedImageURI(uri);
        shareImage(uri);
    } catch (error) {
        console.error('Error capturing view:', error);
        Alert.alert('Error', 'Failed to capture content');
    }
};


const shareImage = async (uri) => {
    try {
        let imagePath = null;
        const fileName = 'purchase_order.jpg';
        const newPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
        await RNFS.copyFile(uri, newPath);
        imagePath = `file://${newPath}`;

        const shareResponse = await Share.open({ url: imagePath });
        console.log('Share Response:', shareResponse);
    } catch (error) {
        Alert.alert('Error', 'Failed to share the image');
        console.error('Error sharing image:', error);
    }
};

    const getPurchaseItemsByPurchaseOrderIdQuery = /* GraphQL */ `
    query GetPurchaseItemsByPurchaseOrderId($purchaseOrderId: ID!) {
      listPurchaseItems(filter: { 
        purchaseOrderItemsId: { eq: $purchaseOrderId },
        _deleted: { ne: true } 
      }) {
        items {
          id
          productName
          quantityOrdered
          quantityReceived
          productPrice
          createdAt
          updatedAt
          _version
          _deleted
        }
      }
    }
  `;
  
  const [editingQuantityReceived, setEditingQuantityReceived] = useState(false);
  

  const toggleQuantityReceivedEditing = () => {
      setEditingQuantityReceived(!editingQuantityReceived);
  };

  const handleQuantityReceivedChange = (index, value) => {
    const updatedItems = [...purchaseOrderItems];
    updatedItems[index].quantityReceived = parseInt(value) || 0;
    setPurchaseOrderItems(updatedItems);
};


const handleStatusChange = (value) => {
    setStatus(value); 
};

const updatePurchaseOrderStatus = async (vendorName) => {
    console.log("Status",status);
    try {
        const updatePurchaseOrderInput = {
            id: purchaseOrderId,
            status: status,
            vendor:vendorName,
            _version:route.params.purchaseOrderVersion,
        };

        await client.graphql({
            query: updatePurchaseOrder,
            variables: { input: updatePurchaseOrderInput },
            authMode: 'apiKey',
        });

        console.log('Purchase order status updated successfully');
    } catch (error) {
        console.error('Error updating purchase order status:', error);
    }
};
const updateProductQuantityInShelf = async (productName, quantityChange) => {
    try {
        const productData = await client.graphql({
            query: getProductByName,
            variables: { name: productName },
            authMode: 'apiKey',
        });

        if (!productData || !productData.data || !productData.data.productByName || !productData.data.productByName.items) {
            console.error("Product data or items not found");
            return;
        }

        const items = productData.data.productByName.items;
        if (items.length === 0) {
            console.error("No items found for the product");
            return;
        }

        const productItem = items[0];
        console.log("Old quantity",productItem.warehouseQuantity);
        const newWarehouseQuantity = productItem.warehouseQuantity + quantityChange;
        console.log("New quantity",newWarehouseQuantity);
        const updateProductResponse = await client.graphql({
            query: updateProduct,
            variables: {
                input: {
                    id: productItem.id,
                    warehouseQuantity: newWarehouseQuantity,
                    _version: productItem._version,
                },
            },
            authMode: 'apiKey',
        });

        console.log("Input", productItem.id,
        newWarehouseQuantity,
       productItem._version,);
        console.log("Product quantity in shelf updated successfully", updateProductResponse);
    } catch (error) {
        console.error("Error updating product quantity in shelf:", error);
    }
};

const updateQuantityReceived = async (itemId, quantityReceived, version,productName) => {
    try {
        console.log(`Updating quantity received for item ${itemId} to ${quantityReceived}`);
        const updatePurchaseItemInput = {
            id: itemId,
            quantityReceived: quantityReceived,
            _version: version, 
        };

        await client.graphql({
            query: updatePurchaseItem,
            variables: { input: updatePurchaseItemInput },
            authMode: 'apiKey',
        });
        await updateProductQuantityInShelf(productName,quantityReceived);

        console.log(`Quantity received updated successfully for item ${itemId}`);
    } catch (error) {
        console.error(`Error updating quantity received for item ${itemId}:`, error);
    }
};


const getProductByName = /* GraphQL */ `
query GetProductByName($name: String!) {
  productByName(name: $name) {
    items {
      id
      name
      barcode
      price
      manufacturer
      category
      warehouseQuantity
      shelfQuantity
      _version
    }
  }
}
`;

const confirmUpdateQuantityReceived = async () => {
    setLoading(true);
    try {
        for (const item of purchaseOrderItems) {
            console.log("Item",item);
            await updateQuantityReceived(item.id, item.quantityReceived, item._version,item.productName);

        }
         await updatePurchaseOrderStatus(vendorName);
        console.log('All items updated successfully');
        setSuccess(true);
        setEditing(false);
    } catch (error) {
        setError(true);
        
        console.error('Error updating quantity received for all items:', error);
    }
};

    // useEffect(() => {
    //     vendorRef.current = vendor;
    //   }, [vendor]);

      const fetchPurchaseOrderItems = async () => {
        try {
            if (purchaseOrderId) {
                const response = await client.graphql({
                    query: getPurchaseItemsByPurchaseOrderIdQuery,
                    variables: { purchaseOrderId },
                    authMode: 'apiKey',
                });
                const purchaseItems = response.data.listPurchaseItems.items;
                setPurchaseOrderItems(purchaseItems);
                console.log(purchaseOrderItems);
            } else {
                console.error('Purchase Order ID is null');
            }
        } catch (error) {
            console.error('Error fetching purchase order items:', error);
        }
    };
      useEffect(() => {
     
        fetchPurchaseOrderItems();
    }, [purchaseOrderId]);
    useEffect(() => {
        setStatus(route.params.purchaseStatus);
    }, [route.params.purchaseStatus]);


   const getPurchaseItemsByPurchaseOrderId = async (billId) => {
    try {
        const response = await client.graphql({
            query: getPurchaseItemsByPurchaseOrderIdQuery,
            variables: { purchaseOrderId },
            filter: {
                _deleted: {
                    ne: true
                }
            },
            authMode: 'apiKey'
        });
        const billItems = response.data.listBillItems.items;
        console.log("Bill Items",billItems);
        return billItems;
    } catch (error) {
        console.error('Error fetching bill items:', error);
        return [];
    }
};
    const [editing, setEditing] = useState(false);
    
    const client = generateClient();
    const navigation = useNavigation();

    const handleScannedProduct = (product) => {
        setScannedProducts([...scannedProducts, product]);
    }
    
    useEffect(() => {
      let calculatedTotalAmount = 0;
      purchaseOrderItems.forEach((item) => {
          calculatedTotalAmount += item.productPrice * item.quantityOrdered;
      });
      setTotalAmount(calculatedTotalAmount);
  }, [purchaseOrderItems]);
  
    const handleLoading = () => {
        setLoading(true)
        setSuccessMessage(true);
      }

      const handleSuccessButtonPress= () => {
        setLoading(false)
        setSuccessMessage(false); 
      }

     
    const printReceipt = async () => {
        setLoading(true);
        try {
            const updateBillInput = {
              id: currentBillId,
              totalAmount: totalBillAmount,
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
        console.log("Passing",vendor,
            purchaseOrderItems);
 

        navigation.navigate('ScanPurchaseOrder2', {   
            purchaseOrderVendor,
            purchaseOrderItems,
            purchaseOrderId,
            purchaseOrderAmount,
            handleScannedProduct }); 
    };
    
    useEffect(() => {
        const refreshPurchaseOrder = route.params?.refreshPurchaseOrder;
        if (refreshPurchaseOrder) {
            fetchPurchaseOrderItems();   
        }
    }, [route.params?.refreshPurchaseOrder]);

    useEffect(() => {
        if (route.params?.scannedProducts) {
            setScannedProducts(route.params.scannedProducts);
        }
    }, [route.params?.scannedProducts]);
    

    // const onSubmit = async () => {
    //     console.log('Product:');
    //     Keyboard.dismiss();
    //     setLoading(true);
    //     if (!editing) {
    //       setLoading(false);
    //       setSuccessMessage(true);
    //       setEditing(true); 
    //       return;
    //   }
    //     try {
    //         console.log('Scanned Products:', scannedProducts);
    //         let totalAmount = 0;
    //         scannedProducts.forEach(product => {
    //             totalAmount += product.price * product.quantity;
    //         });
    
    //         const newPurchaseOrder = await client.graphql({
    //             query: createPurchaseOrder,
    //             variables: {
    //                 input: {
    //                     purchaser: userId,
    //                     purchaserName: userName,
    //                     vendor: vendor,
    //                     totalAmount: totalAmount,
    //                     status: 'PENDING'
    //                 }
    //             },
    //             authMode: 'apiKey',
    //         });
    
    //         console.log(newPurchaseOrder);
    
    //         const createPurchaseItemPromises = scannedProducts.map(async (product) => {
    //             const createPurchaseItemInput = {
    //                 productName: product.name,
    //                 productPrice: product.price,
    //                 quantityOrdered: product.quantity,
    //                 quantityReceived: 0,
    //                 purchaseOrderPurchaseItemsId: newPurchaseOrder.data.createPurchaseOrder.id,
    //                 productPurchaseItemsId: product.id,
    //             };
    
    //             console.log("Item Input", createPurchaseItemInput);
    
    //             return client.graphql({
    //                 query: createPurchaseItem,
    //                 variables: { input: createPurchaseItemInput },
    //                 authMode: 'apiKey',
    //             });
    //         });
    
    //         // Execute all create purchase item mutations
    //         const createdPurchaseItems = await Promise.all(createPurchaseItemPromises);
    //         console.log('Created Purchase Items:', createdPurchaseItems);
    //         const updatePurchaseOrderInput = {
    //             id: newPurchaseOrder.data.createPurchaseOrder.id,
    //             totalAmount: totalAmount.toString(), // Update total amount here
    //             _version: newPurchaseOrder.data.createPurchaseOrder._version,
    //         };
    
    //         await client.graphql({
    //             query: updatePurchaseOrder,
    //             variables: { input: updatePurchaseOrderInput},
    //             authMode: 'apiKey',
    //         });
    //         // Log the number of created purchase items
    //         console.log('Number of Purchase Items Created:', createdPurchaseItems.length);
    //         setSuccess(true);
    //         setSuccessMessage(true);
    //         setLoading(false);
    //     } catch (error) {
    //         setLoading(false);
    //         console.error('Error creating purchase order items:', error);
    //     }
    // };
    
    const handleDeleteItem = (index) => {
        const updatedScannedProducts = [...scannedProducts]; // Create a copy of the scannedProducts array
        updatedScannedProducts.splice(index, 1); // Remove the item at the specified index
        setScannedProducts(updatedScannedProducts); // Update the state with the modified array
    };

  
const updateQuantityReceivedForPOItem = async (purchaseOrderId, itemId, quantityReceived) => {
    try {
        const response = await client.graphql({
            query: updatePurchaseItem,
            variables: {
                input: {
                    id: itemId,
                    quantityReceived: quantityReceived,
                }
            },
            authMode: 'apiKey',
        });
        console.log(`Quantity received updated for item ${itemId} in PO ${purchaseOrderId} to ${quantityReceived}`);
    } catch (error) {
        console.error(`Error updating quantity received for item ${itemId} in PO ${purchaseOrderId}:`, error);
    }
};


const updateValuesForPO = async (purchaseOrderId, items) => {
    try {
        for (const item of items) {
            await updateQuantityReceivedForPOItem(purchaseOrderId, item.id, item.quantityReceived);
        }
        console.log(`All items updated successfully for PO ${purchaseOrderId}`);
    } catch (error) {
        console.error(`Error updating values for PO ${purchaseOrderId}:`, error);
    }
};

const updateValuesForMultiplePOs = async () => {
    try {
        for (const purchaseOrder of purchaseOrders) {
            await updateValuesForPO(purchaseOrder.id, purchaseOrder.items);
        }
        console.log('All purchase orders updated successfully');
    } catch (error) {
        console.error('Error updating values for multiple purchase orders:', error);
    }
};
const handleUpdatePO = async () => {
    try {
        
        await updateValuesForMultiplePOs();

        await updatePurchaseOrderStatus();

     
        console.log('Purchase order updated successfully');
    } catch (error) {
        console.error('Error updating purchase order:', error);
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
};
    return (
    <SafeAreaView style={styles.headContainer}>
         
         <TouchableOpacity style={styles.arrowBackIcon}  onPress={()=> navigation.navigate('PurchaseHistory')}>
            <Ionic size={24} color={COLORS.primary} name ='chevron-back-outline'/>
        </TouchableOpacity>
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
        {success && (
                <View style={styles.successMessageContainer}>
                    <Text style={styles.successText}>PO Updated successfully!</Text>
                    <TouchableOpacity style={styles.successButton} onPress={handleSuccessButtonPress}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            )}
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

   <ViewShot ref={viewShotRef} style={{ backgroundColor:'white',flex:1}} options={{ format: 'jpg', quality: 0.9, backgroundColor: 'white'}}>
   <View style={styles.headContainer2}>
   <View style={styles.headingText}> 
    <Text style={styles.totalBill}>PurchaseOrder</Text>
    <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmountText}>Total Amount: {storeCurrency || '$'}{purchaseOrderAmount}</Text>
      </View>
      <View style={styles.totalAmountContainer}>
      <Text style={styles.totalAmountText}>Date Created: {formatDate(dateCreated)}</Text>
      </View>
      {status === 'RECEIVED' && (
    <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmountText}>Received At: {formatDate(dateUpdated)}</Text>
    </View>
)}
    </View>

    <View  style={styles.headerContainer}>
            <View style={styles.vendorComponent}>
            <Text style={styles.totalBill}>Status :</Text>
        {editing ? (
          <SelectList
          data={[
              { key: '1', value: 'PENDING' },
              { key: '2', value: 'RECEIVED' },
          ]}
          setSelected={(status) => setStatus(status)} 
         
          search={false} 
          renderRightIcon={{ size: 30 }}
          save="value"
          placeholder={status}
          selected={status}
          boxStyles={styles.formInput3} 
          arrowicon={<Ionic style={{ position: 'absolute', right: 10, top: 14 }} size={0} color='rgba(180, 180, 180,4)' name='chevron-down-outline' />}
          searchicon={<Ionic style={{ position: 'absolute', right: 10, top: 14 }} size={0} color='rgba(180, 180, 180,4)' name='chevron-down-outline' />}
          closeicon={<Ionic style={{ position: 'absolute', right: 10, top: 14 }} size={0} color='rgba(180, 180, 180,4)' name='chevron-down-outline' />}
          inputStyles={{ fontSize: 12.5, top: -1, fontFamily: 'Poppins-Regular', color: 'rgba(140, 140, 140,4)' }} // Adjust the style if needed
          dropdownTextStyles={{ zIndex:999,color: 'rgba(140, 140, 140,4)' }} 
      />
      
        ) : (
            <Text style={styles.formInput}>{status}</Text>
        )}

            </View>
        <View style={styles.vendorComponent}>
        <Text style={styles.totalBill}>Vendor :</Text>
        
        {editing ? (
       
        <TextInput
        style={[{ borderWidth: 1, borderColor: 'rgba(140, 140, 140,4)', marginBottom: 10 }, styles.formInput]}
        value={vendorName}
        onChangeText={setVendorName}
      />
      ) : (
        <Text style={styles.formInput}>{route.params.purchaseOrderVendor}</Text>
      )}
        </View>
                                 
</View>
</View>
    
    <View style={{ backgroundColor:'white'}}>

    {purchaseOrderItems.length > 0 && (
   <DataTable style={styles.columnHeadingContainer}>
                <DataTable.Header >
                    
                    <DataTable.Title textStyle={{color: 'white'}} style={{justifyContent:'flex-start',flex:1.2}} >ITEM</DataTable.Title>
                    <DataTable.Title textStyle={{color: 'white'}} style={{justifyContent:'center'}}>QTYORD</DataTable.Title>
                    <DataTable.Title textStyle={{color: 'white'}}  style={{justifyContent:'center'}}>PRICE</DataTable.Title>
                    
                    {editing && purchaseOrderItems.some(item => item.quantityReceived !== 0) && <DataTable.Title textStyle={{color: 'white'}} style={{justifyContent:'center'}}>QTYREC</DataTable.Title>}
                    {!editing && purchaseOrderItems.some(item => item.quantityReceived !== 0) && <DataTable.Title textStyle={{color: 'white'}} style={{justifyContent:'center'}}>QTYREC</DataTable.Title>}
                </DataTable.Header> 
                </DataTable>
 )}
               <ScrollView  style={{ backgroundColor:'white',flex:0}}>
                {purchaseOrderItems.map((item, index) => (
                    <DataTable key={index}>
                    <DataTable.Row key={index}>
                        <DataTable.Cell style={{ justifyContent: 'flex-start', flex: 1.2 }}>{item.productName}</DataTable.Cell>
                        <DataTable.Cell style={{ justifyContent: 'center' }}>{item.quantityOrdered}</DataTable.Cell>
                        <DataTable.Cell style={{ justifyContent: 'center' }}>{item.productPrice}</DataTable.Cell>
                        {editing && item.quantityReceived !== 0 && (
                            <View style={styles.formInputContainer2}>
                                <TextInput
                                    style={styles.formInput2}
                                    value={item.quantityReceived.toString()}
                                    onChangeText={(text) => handleQuantityReceivedChange(index, text)}
                                />
                            </View>
                        )}
                        {!editing && item.quantityReceived !== 0 && (
                            <DataTable.Cell style={{ justifyContent: 'center' }}>{item.quantityReceived.toString()}</DataTable.Cell>
                        )}
                    </DataTable.Row>
                </DataTable>
                
    ))}

    
</ScrollView>
</View>
{/* </Animated.View> */}
  </ViewShot>
  {!isTyping &&
   <View style={styles.footerContainer}>
       <View style={styles.footerWrapper}>
           {editing &&
           <TouchableOpacity style={styles.addButton} onPress={confirmUpdateQuantityReceived}>
           <Text style={styles.addText}>Update PO</Text>
       </TouchableOpacity>
       
           }
           <TouchableOpacity style={styles.confirmButton} onPress={captureView}>
            <Text style={styles.confirmText}>Share Purchase Order</Text>
        </TouchableOpacity>

           {!editing && (userRole === 'PURCHASER' || userName === purchaserName) && (
            <TouchableOpacity style={styles.confirmButton} onPress={()=>setEditing(true)}>
                <Text style={styles.confirmText}>Update Purchase Order</Text>
            </TouchableOpacity>
            )
        }
           {/* {editing &&
           <TouchableOpacity style={styles.confirmButton} onPress={onSubmit}>
           <Text style={styles.confirmText}>Generate Purchaser Order</Text>
       </TouchableOpacity>
           } */}
             {editing &&
           <TouchableOpacity style={styles.confirmButton}  onPress={()=>setEditing(false)}>
           <Text style={styles.confirmText}>Cancel</Text>
       </TouchableOpacity>
           }
          
       </View>
   </View>
}
</SafeAreaView>
)
}

 
export default PurchaseOrder;

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
    vendorComponent:{
        paddingHorizontal:20,
        width:"50%",
    },
    headerContainer:{
        borderBottomRightRadius:10,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        width:'100%',
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
    height:50,
    fontSize:18,
    fontFamily:'Poppins-Regular',
    justifyContent:'center',
    alignItems:'center',
    color:'rgba(0, 0, 0,0.6)',
    // textAlign:'center',
    // borderWidth:0.5,
    
},
formInput3:{
zIndex:999,
    width:'90%',
    height:40,
    fontSize:12,
    fontFamily:'Poppins-Regular',
    justifyContent:'center',
    alignItems:'center',
    color:'rgba(0, 0, 0,0.6)',
    
},
formInput2:{
    height:'80%',
    width:'100%',
    fontSize:15,
    flex:1,
    alignSelf:'center',
    alignItems:'center',
    alignContent:'center',
    justifyContent:'center',
    fontFamily:'Poppins-Regular',
    top:1,
    color:'black',
    // borderWidth:0.5,
},
formInputContainer2:{
    borderColor:'lightgray',
    width:'18%',
    borderWidth:2,
    flex:0,
    alignItems:'center',
    justifyContent:'center',
    marginVertical:2,
    
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
   backgroundColor:'white'
},
headContainer2:{ 
    minHeight:100,
    backgroundColor:'white'
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
  top:25,
  left:18
},
container: {
    flex: 1,
    backgroundColor: '#044244',
  },
mainLogo:{
    flex:0,
    justifyContent:'center',
    alignItems:'center'
},
totalBill:{
    color:COLORS.primary,
    fontSize:20,
    fontFamily:'Poppins-SemiBold',
    marginTop:15,
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
    marginBottom:15,
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
    marginVertical:10
},
addText:{
    fontSize:18,
    color:COLORS.primary,
    fontFamily:'Poppins-Regular',
    top:2,
}
})