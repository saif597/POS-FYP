import React, { useEffect, useState } from "react"; 
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import Animated, { FadeIn, Easing, FadeInDown, FadeInUp } from 'react-native-reanimated';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import Navigator from '../screens/Navigator';
import StaffListScreen from '../screens/StaffListScreen';
import AddProduct from '../screens/AddProduct';
import ConfirmBill from '../screens/ConfirmBill';
import Receipt from '../screens/Receipt';
import ImageViewScreen from '../screens/ImageViewScreen';
import AboutScreen from '../screens/AboutScreen';
import ProductsScreen from '../screens/ProductsScreen';
import Dashboard from '../screens/Dashboard';
import { signOut } from 'aws-amplify/auth';
import Profile from '../screens/Profile';
import Stats from '../screens/Stats';
import Product from '../screens/Product';
import Scan from '../screens/Scan';
import Scan2 from '../screens/Scan2';
import CustomDrawer from '../components/Drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen2 from '../screens/HomeScreen2';
import { COLORS } from '../assets/theme/index.js';
import TopTabNavigator from '../screens/TopTabNavigator';
import UploadPurchase from '../screens/UploadPurchase';
import PurchaseHistory from '../screens/PurchaseHistory';
import Notifications from '../screens/Notifications';
import ConfirmSignUp from '../screens/ConfirmSignUp';
import { Hub } from '@aws-amplify/core';
import { getCurrentUser } from "aws-amplify/auth";
import {View, ActivityIndicator} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AddAccount from "../screens/AddAccount";
import BluetoothConnectivity from "../screens/BluetoothConnectivity";
import BluetoothConnectivity2 from "../screens/BluetoothConnectivity2";
import ConfirmSignUp2 from "../screens/ConfirmSignUp2";
import { useSelector } from "react-redux";
import PurchaseOrder from "../screens/PurchaseOrder";
import WMHome from "../screens/WMHome";
import GMHome from "../screens/GMHome";
import CashierHome from "../screens/CashierHome";
import POHome from "../screens/POHome";
import TopTabNavigator2 from "../screens/TopTabNavigator2";
import TopTabNavigator3 from "../screens/TopTabNavigator3";
import Categories from "../screens/Categories";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Loading from "../screens/Loading";
import ShowBill from "../screens/ShowBill";
import ScanPurchaseOrder from "../screens/ScanPurchaseOrder";
import WarehouseScanHistory from "../screens/WarehouseScanHistory";
import Reports from "../screens/Reports";
import WarehouseQuantity from "../screens/WarehouseQuantity";
import Store from "../screens/Store";
import ResetPassword from "../screens/ResetPassword";
import ShelfQuantity from "../screens/ShelfQuantity";
const Drawer = createDrawerNavigator();
const GeneralManagerStack = createStackNavigator();
const WarehouseManagerStack = createStackNavigator();
const CashierStack = createStackNavigator();
const PurchaserStack = createStackNavigator();


function GeneralManagerStackNavigator() {
  return (
    <GeneralManagerStack.Navigator screenOptions={{ headerShown: false }}>
      <GeneralManagerStack.Screen name="Home" component={TopTabNavigator3} />
      <GeneralManagerStack.Screen name="Reports" component={Reports} />
      <GeneralManagerStack.Screen name="Staff" component={StaffListScreen} />
      <GeneralManagerStack.Screen name="AddProduct" component={AddProduct} />
      <GeneralManagerStack.Screen name="History" component={HistoryScreen} />
      <GeneralManagerStack.Screen name="About" component={AboutScreen} />
      <GeneralManagerStack.Screen name="ProductsList" component={ProductsScreen} />
      <GeneralManagerStack.Screen name="Profile" component={Profile} />
      <GeneralManagerStack.Screen name="Stats" component={Stats} />
      <GeneralManagerStack.Screen name="Product" component={Product} />
      <GeneralManagerStack.Screen name="Notifications" component={Notifications} />
      <GeneralManagerStack.Screen name="PurchaseHistory" component={PurchaseHistory} />
      <GeneralManagerStack.Screen name="PurchaseOrder" component={PurchaseOrder} />
      <GeneralManagerStack.Screen name="AddAccount" component={AddAccount} />
      <GeneralManagerStack.Screen name="ConfirmSignUp2" component={ConfirmSignUp2} />
      <GeneralManagerStack.Screen name="Categories" component={Categories} />
      <GeneralManagerStack.Screen name="ShowBill" component={ShowBill} />
      <GeneralManagerStack.Screen name="WarehouseScan" component={WarehouseScanHistory} />
      <GeneralManagerStack.Screen name="Store" component={Store} />
      <GeneralManagerStack.Screen name="Settings" component={SettingsScreen} />
      <GeneralManagerStack.Screen name="Bluetooth" component={BluetoothConnectivity} />
    </GeneralManagerStack.Navigator>
  );
}



function CashierStackNavigator() {
  return (
    <CashierStack.Navigator screenOptions={{ headerShown: false }}>
      <CashierStack.Screen name="Home2" component={TopTabNavigator} />
      <CashierStack.Screen name="History" component={HistoryScreen} />
      <CashierStack.Screen name="About" component={AboutScreen} />
      <CashierStack.Screen name="ProductsList" component={ProductsScreen} />
      <CashierStack.Screen name="Profile" component={Profile} />
      <CashierStack.Screen name="Product" component={Product} />
      <CashierStack.Screen name="Categories" component={Categories} />
      <CashierStack.Screen name="ShowBill" component={ShowBill} />
      <CashierStack.Screen name="Bluetooth" component={BluetoothConnectivity} />
      <CashierStack.Screen name="Scan" component={Scan} />
      <CashierStack.Screen name="Settings" component={SettingsScreen} />
      <CashierStack.Screen name= "ConfirmBill" component={ConfirmBill} />
      <CashierStack.Screen name="ShelfQuantity" component={ShelfQuantity} />
    </CashierStack.Navigator>
  );
}



function WarehouseManagerStackNavigator() {
  return (
    <WarehouseManagerStack.Navigator screenOptions={{ headerShown: false }}>
      <WarehouseManagerStack.Screen name="Home3" component={TopTabNavigator2} />
      <WarehouseManagerStack.Screen name="History" component={HistoryScreen} />
      <WarehouseManagerStack.Screen name="About" component={AboutScreen} />
      <WarehouseManagerStack.Screen name="ProductsList" component={ProductsScreen} />
      <WarehouseManagerStack.Screen name="Profile" component={Profile} />
      <WarehouseManagerStack.Screen name="Product" component={Product} />
      <WarehouseManagerStack.Screen name="Notifications" component={Notifications} />
      <WarehouseManagerStack.Screen name="Scan2" component={Scan2} />
      <WarehouseManagerStack.Screen name="PurchaseHistory" component={PurchaseHistory} />
      <WarehouseManagerStack.Screen name="ShowBill" component={ShowBill} />
      <WarehouseManagerStack.Screen name="WarehouseScan" component={WarehouseScanHistory} />
      <WarehouseManagerStack.Screen name="Settings" component={SettingsScreen} />
      <WarehouseManagerStack.Screen name="WarehouseQuantity" component={WarehouseQuantity} />
      <WarehouseManagerStack.Screen name="ShelfQuantity" component={ShelfQuantity} />

    </WarehouseManagerStack.Navigator>
  );
}



function PurchaserStackNavigator() {
  return (
    <PurchaserStack.Navigator screenOptions={{ headerShown: false }}>
      <PurchaserStack.Screen name="Home4" component={POHome} />
      <PurchaserStack.Screen name="Settings" component={SettingsScreen} />
      <PurchaserStack.Screen name="History" component={HistoryScreen} />
      <PurchaserStack.Screen name="About" component={AboutScreen} />
      <PurchaserStack.Screen name="ProductsList" component={ProductsScreen} />
      <PurchaserStack.Screen name="Profile" component={Profile} />
      <PurchaserStack.Screen name="Upload" component={UploadPurchase} />
      <PurchaserStack.Screen name="Notifications" component={Notifications} />
      <PurchaserStack.Screen name="PurchaseHistory" component={PurchaseHistory} />
      <PurchaserStack.Screen name="Product" component={Product} />
      <PurchaserStack.Screen name="UploadPurchase" component={UploadPurchase} />
      <PurchaserStack.Screen name="PurchaseOrder" component={PurchaseOrder} />
      <PurchaserStack.Screen name="ScanPurchaseOrder" component={ScanPurchaseOrder} />
      <PurchaserStack.Screen name="WarehouseQuantity" component={WarehouseQuantity} />
      <PurchaserStack.Screen name="Bluetooth" component={BluetoothConnectivity} />
    </PurchaserStack.Navigator>
  );
}


const AppNavigation = () => {
  const [user, setUser] = useState(undefined);
  const userRole = useSelector((state) => state.user.role);
    const checkUser = async () => {
      try {
        const authUser = await getCurrentUser({bypassCache: true});
        setUser(authUser);
      } catch (e) {
        setUser(null);
      }
    };
    useEffect(() => {
    checkUser();
}, []);
useEffect(() => {
    const listener = (data) => {
      if (data.payload.event === 'signedIn' || data.payload.event === 'signedOut') {
        checkUser();
      }
      // console.log("data payload",data.payload.event)
      // console.log(checkUser());
    };

    Hub.listen('auth', listener);

  
    const authListenerCancel = Hub.listen('auth', (data) => {
      console.log('Listening for auth messages: ', data.payload.data);
    });
    
   
    authListenerCancel(); 
  }, []);

  if (user === undefined) {
    return (
      <View style={{flex:1,backgroundColor:'white',borderWidth:1,justifyContent:'center',paddingHorizontal:25}}>
       <SkeletonPlaceholder borderRadius={4}>
       <SkeletonPlaceholder.Item width={100} height={20} />
        <View style={{paddingVertical:20}}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
        <SkeletonPlaceholder.Item marginLeft={20}>
          <SkeletonPlaceholder.Item width={200} height={20} />
          <SkeletonPlaceholder.Item marginTop={6} width={200} height={20} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
        </View>      
    </SkeletonPlaceholder>
    <SkeletonPlaceholder borderRadius={4}>
    
        <View style={{paddingVertical:20}}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
        <SkeletonPlaceholder.Item marginLeft={20}>
          <SkeletonPlaceholder.Item width={200} height={20} />
          <SkeletonPlaceholder.Item marginTop={6} width={200} height={20} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
        </View>
     
      
    </SkeletonPlaceholder>
    <SkeletonPlaceholder borderRadius={4}>
    <SkeletonPlaceholder.Item width={100} height={20} marginTop={20}/>
        <View style={{paddingVertical:20}}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
        <SkeletonPlaceholder.Item marginLeft={20}>
          <SkeletonPlaceholder.Item width={200} height={20} />
          <SkeletonPlaceholder.Item marginTop={6} width={200} height={20} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
        </View>
     
      
    </SkeletonPlaceholder>
    <SkeletonPlaceholder borderRadius={4}>
    <SkeletonPlaceholder.Item width={100} height={20} marginTop={20}/>
        <View style={{paddingVertical:20}}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
        <SkeletonPlaceholder.Item marginLeft={20}>
          <SkeletonPlaceholder.Item width={200} height={20} />
          <SkeletonPlaceholder.Item marginTop={6} width={200} height={20} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
        </View>
     
      
    </SkeletonPlaceholder>
    <SkeletonPlaceholder borderRadius={4}>
    <SkeletonPlaceholder.Item width={100} height={20} marginTop={20}/>
        <View style={{paddingVertical:20}}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
        <SkeletonPlaceholder.Item marginLeft={20}>
          <SkeletonPlaceholder.Item width={200} height={20} />
          <SkeletonPlaceholder.Item marginTop={6} width={200} height={20} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
        </View>
     
      
    </SkeletonPlaceholder>

    </View>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{ headerShown: false, swipeEnabled:false }} >
        {user ? (
          <>
        {userRole === 'GENERAL_MANAGER' ? (
              <Drawer.Screen name="GMHome" component={GeneralManagerStackNavigator} />
            ) : userRole === 'CASHIER' ? (
              <Drawer.Screen name="CashierHome" component={CashierStackNavigator} />
            ) : userRole === 'WAREHOUSE_MANAGER' ? (
              <Drawer.Screen name="WMHome" component={WarehouseManagerStackNavigator} />
            ) :  userRole === 'PURCHASER' ?(
              <Drawer.Screen name="PurchaserHome" component={PurchaserStackNavigator} />
            ):(
              <Drawer.Screen name="Loading" component={Loading} />
            )}
          </>
        ) : (
          <>
            <Drawer.Screen name="Welcome" component={WelcomeScreen} />
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen name="SignUp" component={SignUpScreen} />
            <Drawer.Screen name="ConfirmSignUp" component={ConfirmSignUp} />
            <Drawer.Screen name="ResetPassword" component={ResetPassword} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
