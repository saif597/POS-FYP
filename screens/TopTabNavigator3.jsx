import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionic from 'react-native-vector-icons/Ionicons';
import HomeScreen2 from './HomeScreen2';
import History from './HistoryScreen';
import Stats from './Stats';
import Profile from './Profile';
import Scan2 from './Scan2';
import { COLORS } from '../assets/theme';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import SettingsScreen from './SettingsScreen';
import { useSelector } from 'react-redux'; 
import CashierHome from './CashierHome';
import WMHome from './WMHome';
import GMHome from './GMHome';
import Store from './Store';
import Notifications from './Notifications';
const Tab = createMaterialTopTabNavigator();


const tabIcons = {
  Dashboard: 'home',
  History: 'receipt',
  Scan2: 'notifications',
  Store: 'storefront',
  Profile: 'person',
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const userRole = useSelector((state) => state.user.role);
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' ,backgroundColor:'white',borderTopWidth:1,borderTopColor:'lightgray'}}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isScanTab = route.name === 'Scan2';
        const isFocused = state.index === index;
        const icon = tabIcons[route.name];

        const onPress = () => {
            if (isScanTab) {
                return; 
              }
    
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableWithoutFeedback key={route.key} onPress={onPress}>
            <View
              style={{
                alignItems: 'center',
                padding: 20,
                backgroundColor: isScanTab ? COLORS.primary : 'white',
                borderRadius: isScanTab ? 100 : 0, 
                bottom:isScanTab ? 20 : 0,
              }}
            >
              <Ionic
                name={isFocused ? icon : `${icon}-outline`}
                size={24}
                color={isScanTab ? 'white' : isFocused ? COLORS.primary : '#333'}
              />
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

const TopTabNavigator3 = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      tabBarPosition="bottom"
      screenOptions={{
        tabBarShowLabel: false,
      }}
      
    >
      <Tab.Screen name="Dashboard" component={GMHome} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Scan2" component={Notifications} />
      <Tab.Screen name="Store" component={Store} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TopTabNavigator3;
