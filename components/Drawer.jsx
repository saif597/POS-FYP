import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../assets/theme';
import { useNavigation } from '@react-navigation/native'; 
import { fetchUserAttributes, signOut } from 'aws-amplify/auth';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserDetails, setUserDetails } from '../store/userSlice';
import { generateClient } from 'aws-amplify/api';

const Drawer = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const client = generateClient();
  const userRole = useSelector((state) => state.user.role);
  const userName=useSelector((state) => state.user.username);
  const [image,setImage]=useState();
  const [role,setRole]=useState();
  const handleSignOut = async () => {
    console.log('Signing out...');

    try {
        props.navigation.closeDrawer();
        setTimeout(async () => {
          await signOut();
          dispatch(clearUserDetails());
          console.log('Signed out');
      }, 300);
    } catch (error) {
        console.log('Error signing out: ', error);
    }
}

const userByIdQuery = /* GraphQL */ `
query UserById($userId: ID!) {
  userById(userId: $userId) {
    items {
      id
      userId
      username
      phonenumber
      image
      role
      idcardimage
      store {
        id
        name
        address
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      storeUsersId
      __typename
    }
  }
}
`;

useEffect(() => {
  const fetchUserDetails = async () => {
    try {
      const attributes = await fetchUserAttributes();
      const userId = attributes.sub;
      if(attributes)
      {
        const { data } = await client.graphql({
          query: userByIdQuery,
          variables: { userId },
          authMode: 'apiKey',
        });
  
        const userDetails = data.userById.items[0]; 
       
        setImage(userDetails.image);
        setRole(userDetails.role);
      }
      
    } catch (error) {
      // console.error('Error fetching user details:', error);
    }
  };

  fetchUserDetails();
}, [dispatch, client]);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: COLORS.primary}}>
          <View style={{backgroundColor:COLORS.primary,paddingHorizontal:20,paddingVertical:35}}>
          <Image
            source={image ? { uri: image } : require("../assets/images/person.jpg")}
            style={{height: 100, width: 100, borderRadius: 40, marginBottom: 10}}
          />
         
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Poppins-Regular',
              top:1,
              marginBottom: 5,
            }}>
            {userName}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Poppins-Regular',
                marginRight: 5,
              }}>
              {userRole}
            </Text>
            <Ionicons name="person-circle-outline" size={18} color={'white'} />
          </View>
          </View>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 15}}>
            <View style={{paddingHorizontal: 20, }}>
            {userRole === "GENERAL_MANAGER" && (
            <TouchableOpacity  onPress={()=> navigation.navigate('Staff')} style={{paddingVertical: 15}} >
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="people-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Staff
                </Text>
            </View>
            </TouchableOpacity>
            )}
            <TouchableOpacity style={{paddingVertical: 15}} onPress={()=> navigation.navigate('Profile')}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="person-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Profile
                </Text>
            </View>
            </TouchableOpacity>
            {userRole === "CASHIER" && (
            <TouchableOpacity style={{paddingVertical: 15}} onPress={()=> navigation.navigate('Scan')}>
             <View style={{flexDirection: 'row'}}>
                <Ionicons name="scan-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Scan
                </Text>
            </View>
            </TouchableOpacity>
            )}
             {userRole === "GENERAL_MANAGER" && (
            <TouchableOpacity style={{paddingVertical: 15}} onPress={()=> navigation.navigate('Reports')}>
             <View style={{flexDirection: 'row'}}>
                <Ionicons name="document-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Reports
                </Text>
            </View>
            </TouchableOpacity>
            )}
               {userRole === "WAREHOUSE_MANAGER" || userRole === "PURCHASER" && (
            <TouchableOpacity  onPress={()=> navigation.navigate('WarehouseQuantity')} style={{paddingVertical: 15}} >
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="cube-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Warehouse Quantity
                </Text>
            </View>
            </TouchableOpacity>
            )}
             {userRole === "WAREHOUSE_MANAGER" && (
            <TouchableOpacity  onPress={()=> navigation.navigate('WarehouseScan')} style={{paddingVertical: 15}} >
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="scan-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Scans List
                </Text>
            </View>
            </TouchableOpacity>
            )}
            <TouchableOpacity style={{paddingVertical: 15}} onPress={()=> navigation.navigate('History')}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="archive-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Bills Generated
                </Text>
            </View>
            </TouchableOpacity>
            {userRole === "GENERAL_MANAGER" && (
            <TouchableOpacity style={{paddingVertical: 15}} onPress={()=> navigation.navigate('Settings')}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="settings-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Settings
                </Text>
            </View>
            </TouchableOpacity>)}
        </View>
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
      <TouchableOpacity onPress={() => {}} style={{paddingVertical: 10}}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="share-social-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                Tell a Friend
                </Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSignOut()} style={{paddingVertical: 10}} >
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="log-out-outline" size={22} color={COLORS.primary} />
                <Text
                style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 12,
                    top:1,
                    color:COLORS.primary ,
                }}>
                    Logout
                </Text>
            </View>
            </TouchableOpacity>
      </View>
    </View>
  );
};

export default Drawer;