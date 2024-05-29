import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index';
import HomeScreen2 from './HomeScreen2';
import History from './HistoryScreen';
import Stats from './Stats';
import Profile from './Profile';
import Scan from './Scan';
import { Text, View } from 'react-native';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    height: 60,
    background: '#fff',
    
  },
        
};

const Dashboard = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="DashboardHome" >
      <Tab.Screen
        name="DashboardHome" 
        component={HomeScreen2}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Ionic
                  name={focused ? 'home' : 'home-outline'}
                  size={24}
                  color={focused ? COLORS.primary : '#111'}
                  
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Ionic
                  name={focused ? 'archive' : 'archive-outline'}
                  size={24}
                  color={focused ? COLORS.primary : '#111'}
                  
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.primary,
                  width: Platform.OS == 'ios' ? 50 : 60,
                  height: Platform.OS == 'ios' ? 50 : 60,
                  top: Platform.OS == 'ios' ? -8 : -18,
                  borderRadius: Platform.OS == 'ios' ? 25 : 30,
                }}>
                <Ionic
                  name={focused ? 'scan' : 'scan-outline'}
                  size={24}
                  color={'#fff'}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Ionic
                  name={focused ? 'settings' : 'settings-outline'}
                  size={24}
                  color={focused ? COLORS.primary : '#111'}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Ionic
                  name={focused ? 'person' : 'person-outline'}
                  size={24}
                  color={focused ? COLORS.primary : '#111'}
                />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Dashboard;
