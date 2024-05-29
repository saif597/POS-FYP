import React, { useState, useEffect } from 'react';
import  {Easing } from 'react-native-reanimated';
import { View, Text, Button, FlatList, TouchableOpacity, Alert, PermissionsAndroid, StyleSheet,SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionic from 'react-native-vector-icons/Ionicons';
import { BluetoothManager, BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import { setConnectedDevice, clearConnectedDevice, selectConnectedDevice } from '../store/bluetoothReducer.js'
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native'; 
import { AnimatedCircularProgress } from 'react-native-circular-progress';
const BluetoothPrinterScreen = () => {
  const [devices, setDevices] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(null);
  const [devicesLoaded, setDevicesLoaded] = useState(false);
  const connectedDevice = useSelector(selectConnectedDevice);
  const navigation=useNavigation();
  useEffect(() => {
    requestBluetoothPermission();
  }, []);

  
  const requestBluetoothPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: "Bluetooth Permission",
          message: "This app needs access to your Bluetooth to discover and connect to printers",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        // Alert.alert("Bluetooth Permission Required", "Kindly Enable Bluetooth and Connect to Printer");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const enableBluetooth = async () => {
    try {
      await BluetoothManager.enableBluetooth().then((r) => {
        const pairedDevices = r.map(device => JSON.parse(device));
        setDevices(pairedDevices);
        setDevicesLoaded(true); // Set devicesLoaded to true when devices are loaded
        Alert.alert("Bluetooth Enabled", "Paired devices loaded \n Now select the printer to be connected");
      });
    } catch (error) {
      Alert.alert("Error Enabling Bluetooth", error.message);
    }
  };
  
const connectToDevice = async (address, name) => { // Modify the function signature to accept both address and name
  setLoading(true);
  console.log("Name", name);
  try {
    await BluetoothManager.connect(address)
      .then(() => {
        dispatch(setConnectedDevice({ address, name })); // Dispatch action with object containing address and name
        console.log(`Connected to device: ${address}`); // Log connectivity details
        setLoading(false);
        Alert.alert("Connected", `Device ${name} connected successfully`); // Use the device name in the alert message
      }, (err) => {
        setLoading(false);
        Alert.alert("Connection Error", `Cannot connect to the device: ${err}`);
      });
  } catch (error) {
    setLoading(false);
    Alert.alert("Connection Failed", error.message);
  }
};
const reloadDevices = async () => {
  setLoading(true);
  setDevicesLoaded(false); // Set devicesLoaded to false before reloading
  try {
    await BluetoothManager.enableBluetooth().then((r) => {
      const pairedDevices = r.map(device => JSON.parse(device));
      setDevices(pairedDevices);
      setDevicesLoaded(true); // Set devicesLoaded to true after reloading
      setLoading(false);
    });
  } catch (error) {
    setLoading(false);
    Alert.alert("Error Reloading Devices", error.message);
  }
};
  const disconnectDevice = async () => {
    // Assuming BluetoothManager has a method to disconnect
    try {
      await BluetoothManager.disconnect(connectedDevice)
        .then(() => {
          dispatch(clearConnectedDevice()); // Clear the connected device in the Redux store
          console.log(`Disconnected device: ${connectedDevice}`); // Log connectivity details
          Alert.alert("Disconnected", "The device has been disconnected");
        });
    } catch (error) {
      Alert.alert("Disconnect Failed", error.message);
    }
  };

  const printTestReceipt = async () => {
    if (!connectedDevice) {
      Alert.alert("Connection Error", "No device connected");
      return;
    }

    try {
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printText("Hello from Us!\n", {});
      await BluetoothEscposPrinter.printText("This is a test print\n\n", {});
      Alert.alert("Print Success", "Check your printer for the receipt");
    } catch (error) {
      Alert.alert("Printing Error", error.message);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingContainer}>
          <AnimatedCircularProgress
            size={120}
            width={15}
            fill={100}
            prefill={0}
            duration={2000}
            delay={0}
            easing={Easing.inOut(Easing.ease)}
            tintColor={COLORS.secondary}
            onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="#3d5875" />
        </View>
      )}

      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.arrowBack} onPress={() => navigation.goBack()}>
              <Ionic size={22} color='white' name='chevron-back-outline' />
            </TouchableOpacity>
            <Text style={styles.cashierHeading}>Bluetooth Connection</Text>
          </View>
        </SafeAreaView>

       
{devices.length === 0 && (
 <View style={styles.noOrdersContainer}>
 <Text style={styles.noOrdersText}>Kindly Enable Bluetooth and Connect to Printer</Text>
 <Ionic size={52} color={COLORS.primary} name ='arrow-down-outline' style={styles.arrowDown}/>
</View>     )}

      {devices.length > 0 && (
        <FlatList
          data={devices}
          style={styles.listDevices}
          keyExtractor={item => item.address}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => connectToDevice(item.address,item.name)} style={styles.listDevicesButton}>
              <Text style={styles.listText}>{item.name} - {item.address}</Text>
            </TouchableOpacity>
          )}
        />
      )}
        <View style={styles.buttonContainer}>
          {!devicesLoaded && (
            <TouchableOpacity style={styles.enableButton} onPress={enableBluetooth} >
              <Text style={styles.enableText}>Enable Bluetooth & Load Paired Devices</Text>
            </TouchableOpacity>
          )}
           {devicesLoaded && ( 
          <TouchableOpacity style={styles.enableButton} onPress={reloadDevices}>
            <Text style={styles.enableText}>Reload the list</Text>
          </TouchableOpacity>
        )}

          <TouchableOpacity style={styles.printButton} onPress={printTestReceipt} >
            <Text style={styles.printText}>Print Test Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',

  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    position:'absolute',
    zIndex:999999,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enableButton:{
    backgroundColor:COLORS.primary,
    height:40,
    paddingHorizontal:15,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:15,
    marginVertical:5,
  },
printButton:{
    backgroundColor:COLORS.secondary,
    height:40,
    paddingHorizontal:15,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:15,
    marginVertical:5,
  },
  arrowDown:{
    top:20,
  },
  enableText: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    top: 2,
  },
  printText: {
    fontSize: 15,
    color: COLORS.primary,
    fontFamily: 'Poppins-Regular',
    top: 2,
  },
  buttonContainer:{
    justifyContent:'center',
    alignItems:'center',
    width:'100%'
  },
  listDevicesButton:{
     padding: 10, marginTop: 10, backgroundColor: 'white',
     color:COLORS.primary 
  },
  listText:{
    color:COLORS.primary
  },
  safeArea:{
    backgroundColor:COLORS.primary,
    width:'100%',
    // height:'10%'
},
headerContainer:{
    flex:0,
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:25,
    borderBottomLeftRadius:30,
},

noOrdersContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
noOrdersText: {
  fontSize: 20,
  fontFamily:'Poppins-Medium',
  color: COLORS.primary,
  textAlign:'center'
},
cashierHeading:{
    color:'white',
    fontSize:20,
    fontFamily:'Poppins-Regular',
    top:1,
},
arrowBack:{
    position:'absolute',
    left:10,
},
});

export default BluetoothPrinterScreen;
