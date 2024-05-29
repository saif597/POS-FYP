import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
  Animated,
} from 'react-native';

// import beep from '../android/app/src/main/res/raw/beep.mp3';
// import SoundPlayer from 'react-native-sound-player'
// import TrackPlayer from 'react-native-track-player';
import { useCameraDevices, Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { COLORS } from '../assets/theme';
import { useNavigation } from '@react-navigation/native'; 
import Ionic from 'react-native-vector-icons/Ionicons';
import {generateClient} from 'aws-amplify/api';
import { createBill, createBillItem, updateBill, updateBillItem } from '../src/graphql/mutations';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import Sound from 'react-native-sound';
import { useSelector } from 'react-redux';

export default function Scan({route}) {
  const storeID = useSelector((state) => state.user.storeId);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(true);
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [manualEntryModalVisible, setManualEntryModalVisible] = React.useState(false);
  const [manualBarcode, setManualBarcode] = React.useState('');
  const [billModalVisible, setBillModalVisible] = React.useState(false);
  const [currentBillId, setCurrentBillId] = useState(null);
  const [cameraKey, setCameraKey] = useState(1);
  const [zoom, setZoom] = useState(device?.neutralZoom ?? 0);
  const [version, setVersion] = useState(null);
  const devices = useCameraDevices();
  const [existingProduct, setExistingProduct] = useState(null);
  const device = devices.back;
  const client = generateClient();

   const [fadeAnim] = useState(new Animated.Value(0));


   const [quantityModalVisible, setQuantityModalVisible] = useState(false);
   const [quantity, setQuantity] = useState('');
 

   const handleAddQuantity = async () => {
    const quantityToAdd = parseInt(quantity);
    if (!isNaN(quantityToAdd) && quantityToAdd > 0) {
      if (existingProduct) {
        console.log("Existing barcode");
        console.log("Bill item before updating:", existingProduct);

        const updatedProduct = { ...existingProduct };
        updatedProduct.quantity += quantityToAdd;
        updatedProduct.subtotal = updatedProduct.quantity * updatedProduct.price;

        const updatedProducts = scannedProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
        setScannedProducts(updatedProducts);

        try {
          const response = await client.graphql({
            query: updateBillItem,
            variables: {
              input: {
                id: updatedProduct.id,
                quantity: updatedProduct.quantity,
                subtotal: updatedProduct.subtotal,
                _version: updatedProduct._version,
              },
            },
            authMode: 'apiKey',
          });

          updatedProduct._version = response.data.updateBillItem._version;
          console.log("Bill item after updating:", updatedProduct);
          playAnimation();
          Playsound();
        } catch (error) {
          console.error("Error updating bill item:", error);
        }

        setQuantityModalVisible(false);
        setExistingProduct(null);
      }
    } else {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
    }
  };


const zoomIn = () => {
  console.log("Zoming In");
  console.log(zoom);// Decrease zoom by 0.1, down to a min of 0
  // Increment zoom level, respecting the maximum zoom capability of the device
  setZoom((prevZoom) => Math.min(prevZoom + 0.1, device?.maxZoom ?? 1));
};


const zoomOut = () => {
  // Decrement zoom level, ensuring it doesn't go below 1
  console.log("Zoming Out");
  setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1));
};

   const playAnimation = () => {
     Animated.sequence([
       Animated.timing(fadeAnim, {
         toValue: 1,
         duration: 500, 
         useNativeDriver: true,
       }),
       Animated.delay(1000), 
       Animated.timing(fadeAnim, {
         toValue: 0,
         duration: 500,
         useNativeDriver: true,
       }),
     ]).start();
   };
 
   const Playsound = ()=>{
    var beep = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
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

  const navigation = useNavigation();
  const [frameProcessor, barcodes] = useScanBarcodes(
    [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_128,
    ],
    {
      checkInverted: true,
    }
  );

  const ProductByBarcodeAndStoreId = /* GraphQL */ `
  query ProductByBarcodeAndStoreId($barcode: String!, $storeId: ID!) {
    productByBarcode(barcode: $barcode, filter: {storeProductsId: {eq: $storeId}}) {
      items {
        id
        name
        barcode
        price
        manufacturer
        category
        warehouseQuantity
        shelfQuantity
        store {
          id
          name
        }
        _version
      }
    }
  }
`;


  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);


  const toggleScanning = () => {
    setIsScanning((prevState) => !prevState);
  };
  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };
  const refreshCamera = () => {
    setCameraKey(prevKey => prevKey + 1);
  };
  
  const toggleManualEntryModal = () => {
    setManualBarcode('');
    setManualEntryModalVisible(!manualEntryModalVisible);
  };

  const toggleBillModal = () => {
    setBillModalVisible(!billModalVisible);
  };

  const addManualBarcode = async () => {
    if (manualBarcode) {
  
      const manualBarcodeObject = { displayValue: manualBarcode, format: 'MANUAL' };
      await handleBarcodeScanned(manualBarcodeObject); 

      setManualBarcode('');
      toggleManualEntryModal(); 
    }
  };
  
  const showScannedBarcodes = async () => {
toggleBillModal();    
};

  const renderScannedBarcodes = () => {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Scanned Products:</Text>
        {scannedProducts.map((product, index) => (
          <Text key={index} style={styles.scannedText}>
            {`${product.name} (Quantity: ${product.quantity})`}
          </Text>
        ))}
        
        <Text style={styles.scannedText}>Total Bill Amount: PKR {totalBillAmount.toFixed(2)}</Text>
        <TouchableOpacity onPress={toggleBillModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const handleBarcodeScanned = async (barcode) => {
    if (!isScanning && manualBarcode === '') return;
    setIsScanning(false);
  
    try {
      const barcodeValue = barcode.displayValue || manualBarcode;
      console.log("Scanned barcode:", barcodeValue);
  
      const existingProductIndex = scannedProducts.findIndex(p => p.barcode === barcodeValue);
  
      if (existingProductIndex !== -1) {
        const existingProduct = scannedProducts[existingProductIndex];
        const shelfQuantity = existingProduct.shelfQuantity;
        const scannedQuantity = existingProduct.quantity;
  
        if (scannedQuantity >= shelfQuantity) {
        
          Alert.alert("No More Products", "There are no more products available on the shelf.");
        } else {
          setQuantityModalVisible(true);
          setExistingProduct(existingProduct);
        }
      } else {
        console.log("New barcode");
        const productDetailsResponse = await client.graphql({
          query: ProductByBarcodeAndStoreId,
          variables: { barcode: barcodeValue, storeId: storeID },
          authMode: 'apiKey',
        });
  
        if (productDetailsResponse.data.productByBarcode.items.length > 0) {
          const productDetails = productDetailsResponse.data.productByBarcode.items[0];
          console.log("P",productDetails.shelfQuantity);
          if (productDetails.shelfQuantity <=0) {
            Alert.alert("No More Products", "There are no more of this product available on the shelf.");
            return;
          } 
          const billId = await ensureBillCreated();
          const billitemInput = {
            productBillItemsId: productDetails.id,
            quantity: 1,
            productPrice: productDetails.price,
            subtotal: productDetails.price,
            billItemsId: billId,
            manufacturer: productDetails.manufacturer,
            category: productDetails.category,
            productName: productDetails.name,
            storeBillItemsId: storeID
          };
  
          const billItemResponse = await client.graphql({
            query: createBillItem,
            variables: { input: billitemInput },
            authMode: 'apiKey',
          });
  
          console.log("New Bill Item created ", billItemResponse);
          console.log("New Bill Item Created", billitemInput);
          console.log("Bill ID ", billItemResponse.data.createBillItem.bill);
  
          const newProductDetails = {
            productId: productDetails.id,
            price: productDetails.price,
            quantity: 1,
            id: billItemResponse.data.createBillItem.id,
            _version: billItemResponse.data.createBillItem._version,
            subtotal: productDetails.price,
            barcode: barcodeValue,
            _deleted: billItemResponse.data.createBillItem._deleted,
            name: productDetails.name,
            barcode: productDetails.barcode,
            storeBillItemsId: storeID
          };
  
          Playsound();
          playAnimation();
          setScannedProducts([...scannedProducts, newProductDetails]);
        } else {
          console.log("barcode" + barcodeValue + " not found");
          Alert.alert("Product Not Found", "No product found for the scanned barcode. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error handling barcode scan:", error);
    }
  
    if (manualBarcode !== '') setManualBarcode('');
    console.log("Scanned Products:", scannedProducts);
  };
  
  const ensureBillCreated = async () => {
    if (!currentBillId) {
        const userAttributes = await fetchUserAttributes();
        const billResponse = await client.graphql({
            query: createBill,
            variables: {
                input: {
                    cashier: userAttributes.sub,
                    totalAmount: 0,
                    status: 'PENDING',
                    storeBillsId: storeID
                },
            },
            authMode: 'apiKey',
        });
        const newBillId = billResponse.data.createBill.id;
        setCurrentBillId(newBillId);
        setVersion(billResponse.data.createBill._version);
        console.log("New Bill Id",newBillId);
        return newBillId;
        
    }
    return currentBillId;
  };
  
useEffect(() => {
  const total = scannedProducts.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
  setTotalBillAmount(total);
  
}, [scannedProducts]);


const handleConfirmPressed = () => {
  console.log("Accumulated product details:", scannedProducts, "Total Bill Amount:", totalBillAmount);
    if (scannedProducts.length > 0) {
      navigation.navigate('ConfirmBill', {
        scannedProductsList: scannedProducts,
        totalBillAmountValue: totalBillAmount,
        currentBillId: currentBillId,
        version: version,
      });
      setScannedProducts([]);
      setCurrentBillId(null);
    } else {
      Alert.alert('Scan a product first.');
    
  };
};

  
  React.useEffect(() => {
    barcodes.forEach(handleBarcodeScanned);
  }, [barcodes]);

  useEffect(() => {
    if (route.params?.scannedProductsList) {
      setScannedProducts(route.params.scannedProductsList);
    }
  }, []);
  
  const handleRefreshConfirm = () => {
    Alert.alert(
      "Refresh List",
      "Are you sure you want to refresh the scanned products list? This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => refreshScannedProductsList() }
      ],
      { cancelable: false }
    );
  };
  
  const refreshScannedProductsList = () => {
    setScannedProducts([]);
    setCurrentBillId(null);
    console.log("Scanned products list has been refreshed.");
  };

  

  return (
    device != null &&
    hasPermission && (
      <View style={styles.container}>

<Camera
    key={cameraKey}
    style={StyleSheet.absoluteFill}
    device={device}
    isActive={true}
    frameProcessor={frameProcessor}
    frameProcessorFps={5}
    zoom={zoom}
  />
        

        <TouchableOpacity
          onPressIn={startScanning} 
          onPressOut={stopScanning}
          style={[
            styles.scanButton,
            isScanning ? styles.scanButtonPressed : styles.scanButtonNotPressed, 
          ]}
        >
          <Text style={styles.buttonText}>
            {isScanning ? 'Scanning...' : 'Hold to Scan'}
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={toggleManualEntryModal}
          style={styles.showModal}>
          <Ionic size={25} color={'white'} name="create-outline" />
          <Text style={styles.buttonTextShow}>Manual</Text>
        </TouchableOpacity>
        
        <Animated.Text
        style={[
          styles.scannedFeedback,
          {
            opacity: fadeAnim, 
          },
        ]}
      >
        Scanned
      </Animated.Text>
        
        {scannedProducts.length > 0 && (
          <TouchableOpacity onPress={showScannedBarcodes} style={styles.showButton}>
            <Ionic size={25} color={'white'} name="newspaper-outline" />
            <Text style={styles.buttonTextShow}>Bill</Text>
          </TouchableOpacity>
        )}
          {scannedProducts.length > 0 && (
            <TouchableOpacity  style={styles.confirmButton} onPress={handleConfirmPressed}>
              <Ionic size={25} color={'white'} name="print-outline" />
              <Text style={styles.buttonTextShow}>Confirm</Text>
            </TouchableOpacity>
        )}
        {scannedProducts.length > 0 && (
            <TouchableOpacity  style={styles.confirmButton} onPress={handleRefreshConfirm}>
              <Ionic size={25} color={'white'} name="refresh-outline" />
              <Text style={styles.buttonTextShow}>Clear</Text>
            </TouchableOpacity>
        )}
       
        <TouchableOpacity onPress={() => zoomIn()} style={styles.zoomContainer}>
        <Text style={styles.buttonTextShow}>+ </Text>
          <Ionic size={25} color={'white'} name="search-outline" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => zoomOut()}  style={styles.zoomContainer}>
        <Text style={styles.buttonTextShow}>- </Text>
          <Ionic size={25} color={'white'} name="search-outline" />
 
        </TouchableOpacity>

        <TouchableOpacity onPress={refreshCamera} style={styles.confirmButton}>
        <Ionic size={25} color={'white'} name="camera-outline" />
          <Text style={styles.buttonTextShow}>Refresh</Text>
          <Text style={styles.buttonTextShow}>Camera</Text>
        </TouchableOpacity>

       </View>
        <Modal
          visible={manualEntryModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={toggleManualEntryModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Barcode Manually:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter barcode"
              onChangeText={(text) => setManualBarcode(text)}
              value={manualBarcode}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={addManualBarcode} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleManualEntryModal} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <Modal
          visible={billModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={toggleBillModal}
        >
          {renderScannedBarcodes()}
        </Modal>

        <Modal
          visible={quantityModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setQuantityModalVisible(false)}
        >
  <View style={styles.modalContainer}>
    <Text style={styles.modalTitle}>Enter Quantity To Add:</Text>
    <TextInput
      style={styles.input}
      placeholder="Quantity"
      keyboardType="number-pad"
      onChangeText={(text) => setQuantity(text)}
      value={quantity.toString()}
    />

    <View style={styles.modalButtonContainer}>
      <TouchableOpacity onPress={handleAddQuantity} style={styles.modalButton}>
        <Text style={styles.modalButtonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setQuantityModalVisible(false)} style={styles.modalButton}>
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scanButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 30,
    right: 5,
    borderRadius: 10,
  },
  startButton: {
    backgroundColor: COLORS.primary,
  },
  zoomControlsContainer: {
    position: 'absolute',
    bottom: 80, // Adjust position as needed
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
  },
  zoomButtonText: {
    color: 'white',
    fontSize: 20,
  },
  continueButton: {
    backgroundColor: COLORS.secondary,
  },
  continueButtonText: {
    color: COLORS.primary,
  },
  manualCodeEntryButton: {
    backgroundColor: COLORS.SECONDARY, // Updated button color
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, // Rounded button
  },
  buttonContainer:{
    position: 'absolute',
    right: 20,
    top: 10,
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'space-evenly',
    paddingVertical:20,
  },
  buttonContainer2:{
    position: 'absolute',
    right: 20,
    top: 120,
    color:'red',
    borderWidth:2,
    // flexDirection:'column',
    // justifyContent:'space-between',
    // alignItems:'space-evenly',
    paddingVertical:20,
  },
  buttonText: {
    color: 'white',
    top: 2,
    fontFamily: 'Poppins-Regular',
  },
  buttonText2: {
    color: 'white',
    position:'absolute',
    top: 2,
    fontFamily: 'Poppins-Regular',
  },
  showButton: {
    // position: 'absolute',
    // right: 30,
    // top: 50,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:30,
  },
  showModal: {
    // position: 'absolute',
    // right: 20,
    // top: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:30,
  },
  confirmButton: {
    // position: 'absolute',
    // right: 20,
    // top: 200,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:30,
  },

  zoomContainer: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:30,
  },
  scannedFeedback: {
    // position: 'absolute',
    // bottom:'20%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    position: 'absolute',
    right: 120,
    width:150,
    top: 480,
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    color: 'white',
  },
  buttonTextShow: {
    color: 'white',
    top: 2,
    fontFamily: 'Poppins-Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    color: COLORS.primary,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: 200, // Adjust width as needed
  },
  modalButtonContainer: {
    flexDirection: 'row',
  },
  modalButton: {
    backgroundColor: COLORS.SECONDARY, // Updated button color
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, // Rounded button
    margin: 5,
  },
  modalButtonText: {
    color: COLORS.PRIMARY, // Updated text color
    fontFamily: 'Poppins-Regular', // Updated font
  },
  modalText: {
    color: COLORS.primary, // Updated text color
    fontFamily: 'Poppins-Regular', // Updated font
    fontSize: 16,
    marginBottom: 5,
  },
  scannedText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    paddingHorizontal :20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, 
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  scanButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 30,
    right: 5,
    borderRadius: 10,
  },
  scanButtonPressed: {
    backgroundColor: COLORS.secondary, 
  },
  scanButtonNotPressed: {
    backgroundColor: COLORS.primary, 
  },
});
