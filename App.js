import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Appnavigation from './navigation/appnavigation';
import { Provider } from 'react-redux';
import { store } from './store'; 
import {Amplify} from 'aws-amplify';
import awsconfig from './src/aws-exports.js';
Amplify.configure(awsconfig);
import {Authenticator} from '@aws-amplify/react-native';
import { View } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  // useEffect(()=>{
  //   getDeviceToken();
  // },[]);
  // const getDeviceToken = async () => {
  //   let token = await messaging().getToken();
  //   console.log("Token",token);
  // }

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // }, []);
  
  return (
    //  <Provider store={store}>
    <Provider store={store}> 
        <Appnavigation />
        </Provider>
    /* // <NavigationContainer> */
    
    /* // </NavigationContainer> */
  // </Provider>
    // <View>
    //   <Authenticator>
    //     <Text>HOME</Text>
    //   </Authenticator>
    // </View>
  );
}
