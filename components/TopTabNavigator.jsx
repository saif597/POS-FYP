import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen2 from './HomeScreen2';
import History from './HistoryScreen';
import Stats from './Stats';
import Profile from './Profile';
import Scan from './Scan';
import SettingsScreen from '../screens/SettingsScreen';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-svg';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  const userRole = useSelector((state) => state.user.role);

  return (
    <Tab.Navigator>
      {userRole === 'PURCHASER' ? (
        <>
          <Tab.Screen name="Scan" component={Scan} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="Profile" component={Profile} />
          
        </>
      ) : (
        <>
          <Tab.Screen name="DashboardHome" component={HomeScreen2} />
          <Tab.Screen name="History" component={History} />
          <Tab.Screen name="Scan" component={Scan} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="Profile" component={Profile} />
        </>
      )}
    </Tab.Navigator>
  );
};

export default TopTabNavigator;
