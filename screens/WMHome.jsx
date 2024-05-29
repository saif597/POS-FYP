import { SafeAreaView, StyleSheet, Image,Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SalesLineChart from '../components/SalesLineChart'
import { COLORS } from '../assets/theme'
import Ionic from 'react-native-vector-icons/Ionicons';
import {productsObj} from '../assets/Products';
import { useIsFocused, useNavigation } from '@react-navigation/native'; 
import { useDispatch, useSelector} from 'react-redux'; 
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { selectConnectedDevice } from '../store/bluetoothReducer';
import { listNotifications, listWarehouseScans } from '../src/graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { setUserDetails } from '../store/userSlice';
import { fetchUserAttributes } from 'aws-amplify/auth';
const WMHome = () => {  
  const [warehouseScanObj,setWarehouseScanObj]=useState(null);
  const dispatch = useDispatch();
  const client = generateClient();
  const storeID = useSelector((state) => state.user.storeId);
  const [latestNotification, setLatestNotification] = useState(null);
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
        const { data } = await client.graphql({
          query: userByIdQuery,
          variables: { userId },
          authMode: 'apiKey',
        });
  
        const userDetails = data.userById.items[0]; 
        if (userDetails) {
          dispatch(setUserDetails({
            userId: userDetails.userId,
            username: userDetails.username,
            role: userDetails.role,
            storeId: userDetails.storeUsersId,
            storeName: userDetails.store.name,
          }));
        }
      } catch (error) {
        console.log('Error fetching user details:', error);
      }
    };
  
    fetchUserDetails();
  }, [dispatch, client]);

  const getWarehouseScansByStoreId = /* GraphQL */ `
  query GetWarehouseScansByStoreId($storeId: ID!) {
    listWarehouseScans(filter: { 
      storeWarehouseScanId: { eq: $storeId },
      _deleted: { ne: true } 
    }) {
      items {
        id
        scannedBy
        scannedByName
        productId
        productName
        productQuantity
        store {
          id
          name
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeWarehouseScanId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

const getNotificationsByStoreId = /* GraphQL */ `
  query GetNotificationsByStoreId($storeId: ID!) {
    listNotifications(filter: { 
      storeNotificationsId: { eq: $storeId },
      _deleted: { ne: true } 
    }) {
      items {
        id
        warehousequanity
        shelfquantity
        productID
        productname
        isRead
        isWarehouseNotification
        isShelfNotification
        store {
          id
          name
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeNotificationsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

const fetchLatestNotification = async () => {
  if (!storeID) return;
  setLoadingNotification(true);
  try {
    const { data } = await client.graphql({
      query: getNotificationsByStoreId, 
      variables: { storeId: storeID },
      authMode: 'apiKey',
    });
    const { items } = data.listNotifications;
    if (items.length > 0) {
      const sortedNotifications = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLatestNotification(sortedNotifications[0]);
      console.log("Latest ",latestNotification);
    }
  } catch (error) {
    console.log('Error fetching latest notification:', error);
  }finally {
    setLoadingNotification(false);
  }
};

  const fetchLatestWarehouseScan = async () => {
    if (!storeID) {
      console.log('storeID:', storeID);
      return;
    }
    setLoadingWarehouseScan(true);
    try {
      console.log('storeID:', storeID);
      const { data } = await client.graphql({
        query: getWarehouseScansByStoreId,
        variables: {  storeId: storeID },
        filter: {
            _deleted: {
                ne: true
            }
        },
        authMode: 'apiKey',
      });
      console.log("WS",data.listWarehouseScans);
      const { items } = data.listWarehouseScans;
      if (items.length > 0) {
        const sortedItems = items.sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
  
        const latestScan = sortedItems[0]; 
        setWarehouseScanObj(latestScan);
      } else {
        console.log('No warehouse scans found.');
      }
    } catch (error) {
      console.log('Error fetching warehouse scans:', error);
    }finally {
      setLoadingWarehouseScan(false); 
    }
  }; 
  
  useEffect(() => {
    fetchLatestWarehouseScan();
    fetchLatestNotification(); 
  }, [storeID]);

  const isFocused = useIsFocused();

useEffect(() => {
  if (isFocused) {
    fetchLatestWarehouseScan();
    fetchLatestNotification();
  }
}, [isFocused,storeID]);

  
const formatUpdatedAt = (updatedAt) => {
  const date = new Date(updatedAt);
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return formattedTime;
};
const connectedDevice = useSelector(state => selectConnectedDevice(state)?.name);
 const userRole = useSelector((state) => state.user.role);
 const [loading, setLoading] = useState(false); 
 const [loadingWarehouseScan, setLoadingWarehouseScan] = useState(true);
 const [loadingNotification, setLoadingNotification] = useState(true);
//const userRole = 'GENERAL_MANAGER';
  const navigation = useNavigation();
  const openDrawer = () => {
    navigation.openDrawer();
  };
  useEffect(() => {
    console.log("User role from Redux store:", userRole);
    console.log("Connected",connectedDevice);
  }, [userRole]);


  return (
    <View style={{flex:1,backgroundColor:COLORS.primary}}>
      {loading && 
      <View style={styles.loadingContainer}>
       <AnimatedCircularProgress
  size={120}
  width={15}
  fill={100}
  prefill={0} 
  delay={10}
  duration={2200} 
  tintColor={COLORS.secondary}
  onAnimationComplete={() => console.log('onAnimationComplete')}
  backgroundColor="white" />
  </View>}
        <View style={styles.wrapper}>
          
  
        <View style={[
  styles.body,
  { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
]}>

               <View style={[
          styles.bodyWrapper,
          {justifyContent:'space-evenly' }
        ]}> 
                <View style={styles.menuContainer}>
         
                <TouchableOpacity style={styles.drawerIcon2} onPress={openDrawer}>
                     <Ionic name="menu-outline" size={30} color={COLORS.primary}  style={styles.drawerIcon2} />
                  </TouchableOpacity>  
                  <Text style={styles.menuText}>Menu</Text>
                </View>
                <View style={styles.iconWrapper}>    
                <View style={styles.icons}>
              <TouchableOpacity style={styles.iconContainer} onPress={()=> navigation.navigate('Profile')}>  
                    <Ionic name="person" size={25} color={COLORS.primary} style={styles.homeIcon} />
                    <Text style={styles.iconText}>Profile</Text>
                  </TouchableOpacity>
                  
     <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('PurchaseHistory')}>
                     <Ionic name="archive" size={25} color={COLORS.primary} style={styles.homeIcon} />
                    <Text style={styles.iconText}>POs List</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconContainer} onPress={()=> navigation.navigate('ShelfQuantity')}>
                
                  
                    <Ionic name="library-outline" size={25} color={COLORS.primary} style={styles.homeIcon} />
                    <Text style={styles.iconText}>Shelf</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={[styles.icons,styles.lastIcons]}>
        
       
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate('Scan2')}
              >
                <Ionic name="scan" size={28} color={COLORS.primary} />
                <Text style={styles.iconText}>Scan</Text>
              </TouchableOpacity>
                  <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('ProductsList', {
                    productsObj: productsObj,
                  })
                }>
                    <Ionic name="list" size={28} color={COLORS.primary} style={styles.homeIcon} />
                    <Text style={styles.iconText}>Products</Text>
                  </TouchableOpacity>
                  
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionic name="notifications" size={28} color={COLORS.primary} />
                <Text style={styles.iconText}>Alerts</Text>
              </TouchableOpacity>
        
                </View>
                </View>
              
                  <View style={styles.previousContainer}>
                    <Text style={styles.previousText}>Last Scanned</Text>
                  </View>
                  {warehouseScanObj ? (
                  <View style={styles.billSection}>
                  <View style={styles.billContainer}>
                    <Image style={styles.logoStyles} source={require("../assets/images/logo1.png")}/>
                    <View style={styles.billText}>
                      <View style={styles.cashierName}>
                        <Text  style={styles.cashierText}>
                          {warehouseScanObj.productName}
                        </Text>
                        <Text  style={styles.billTotal}>
                          {warehouseScanObj.productQuantity+" Piece/s"}
                        </Text>
                      </View>
                      <View  style={styles.billBottomText}>
                        <Text  style={styles.billTime}>
                          {formatUpdatedAt(warehouseScanObj.updatedAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                ) : (
                  <View style={styles.billSection}>
                  <View style={styles.billContainer}>
                    <Image style={styles.logoStyles} source={require("../assets/images/logo1.png")}/>
                    <View style={styles.billText}>
                      <View style={styles.cashierName}>
                        <Text style={styles.cashierText}>{loadingWarehouseScan ? 'Fetching Warehouse Scans...' : 'No Warehouse Scans'}</Text>
                       
                      </View>
                      <View  style={styles.billBottomText}>
                       
                      </View>
                    </View>
                  </View>
                </View>
                )}
                  <View style={styles.previousContainer}>
                    <Text style={styles.previousText}>Recent Notifications</Text>
                  </View>
                  {latestNotification ? (
        <View style={styles.billSection}>
        <View style={styles.billContainer}>
          <Image style={styles.logoStyles} source={require("../assets/images/logo1.png")}/>
          <View style={styles.billText}>
            <View style={styles.cashierName}>
              <Text  style={styles.cashierText}>
                {latestNotification.productname}
              </Text>
              <Text  style={styles.billTotal}>
              {latestNotification.isWarehouseNotification
            ? `${latestNotification.warehousequanity} Piece/s`
            : `${latestNotification.shelfquantity} Piece/s`}
        </Text>
              
            </View>
            <View  style={styles.billBottomText}>
              <Text  style={styles.billTime}>
                {formatUpdatedAt(latestNotification.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      ) : (
        <View style={styles.billSection}>
        <View style={styles.billContainer}>
          <Image style={styles.logoStyles} source={require("../assets/images/logo1.png")}/>
          <View style={styles.billText}>
            <View style={styles.cashierName}>
              <Text style={styles.cashierText}>{loadingNotification ? 'Fetching Notifications ...' : 'No Notifications'}</Text>
             
            </View>
            <View  style={styles.billBottomText}>
             
            </View>
          </View>
        </View>
      </View>    
      )}
              </View>
            </View>
        </View>
     
    </View>
  )
}

export default WMHome

const styles = StyleSheet.create({
  wrapper:{
    flex:1,
    
  },
  sliderWrapper:{
    height:320,
    backgroundColor:COLORS.primary,
    position:'relative',
    top:20,
    
  },
  menuContainer:{
    marginTop:10,
   paddingHorizontal:30,
    marginBottom:10,
    flexDirection:'row',
    alignItems:'center',
  },
  menuText:{
    fontFamily:'Poppins-SemiBold',
    fontSize:17,
    color:'gray',
    top:2,
  },
  previousText:{
    fontFamily:'Poppins-SemiBold',
    fontSize:17,
    color:'gray',
    marginBottom:10,
  },
  safeArea:{
    flex:1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    position:'absolute',
    zIndex:999999,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerIcon:{
    position:'absolute',
    left:10,
    top:10,
  },
  drawerIcon2:{
    // position:'absolute',
    // left:10,
    // top:10,
    marginRight:5,
  },
  body:{
    backgroundColor:'white',
    flex:1.8,
    borderTopRightRadius:40,
    borderTopLeftRadius:40,
    
  },
  bodyWrapper:{
    flex:1,
    paddingVertical:10,
    paddingHorizontal:5,
    
  },
  icons:{
    flex:0,
    flexDirection:'row',
    justifyContent:'space-evenly',
    marginBottom:25,

  },
  lastIcons:{
    marginBottom:15,
  },
  iconText:{
    top:4,
    color:COLORS.primary,
    fontFamily:'Poppins-Light',
    fontSize:13
    
  },
  iconContainer:{
    flex:0,
    backgroundColor:'white',
    height:80,
    width:80,
    justifyContent:'center',
    borderWidth:1,
    borderRadius:20,
    alignItems:'center',
    borderColor:'lightgray',
    elevation: 6, 
        shadowColor: 'black', 
        shadowOffset: {
            width: 0,
            height: 2, 
        },
    shadowOpacity: 1, 
    shadowRadius: 15, 
    borderRadius: 15, 
    
  },
  
  previousContainer:{
    paddingHorizontal:30,
  },
  billSection:{
    paddingHorizontal:11,
    height:100,
    marginHorizontal:26,
    paddingVertical:20,
    marginBottom:10,
    backgroundColor:'white',
    borderWidth:1,
    borderRadius:10,
    borderColor:'lightgray',
    elevation: 4, 
        shadowColor: 'gray', 
        shadowOffset: {
            width: 0,
            height: 2, 
        },
    shadowOpacity: 1, 
    shadowRadius: 10, 
    borderRadius: 15,
    flex:0,
},

bluetoothSection:{
  paddingHorizontal:11,
  height:100,
  marginHorizontal:26,
  paddingVertical:20,
  marginBottom:10,
  backgroundColor:'white',
  borderWidth:1,
  borderRadius:10,
  borderColor:'lightgray',
  elevation: 4, 
      shadowColor: 'gray', 
      shadowOffset: {
          width: 0,
          height: 2, 
      },
  shadowOpacity: 1, 
  shadowRadius: 10, 
  borderRadius: 15,
  flex:0,
},
purchaseSection:{
  paddingHorizontal:11,
  height:100,
  marginHorizontal:26,
  paddingVertical:20,
  marginBottom:10,
  backgroundColor:'white',
  borderWidth:1,
  borderRadius:10,
  borderColor:'lightgray',
  elevation: 4, 
      shadowColor: 'gray', 
      shadowOffset: {
          width: 0,
          height: 2, 
      },
  shadowOpacity: 1, 
  shadowRadius: 10, 
  borderRadius: 15,
  flex:0,
  alignItems:'center',
  justifyContent:'center' 
},
billContainer:{
  flex:0,
  flexDirection:'row',  
},
billContainer1:{
  flex:0,
  flexDirection:'row',  
  justifyContent:'center',
  alignItems:'center',
},
bluetoothContainer:{
  flex:0,
  flexDirection:'row', 
 
},
billText:{
  marginHorizontal:12,
  flex:1,
},
bluetoothText:{
  marginHorizontal:12,
  flex:1,
  
},
cashierName:{
  flex:0,
  flexDirection:'row',
  justifyContent:'space-between',

},
cashierText:{
  fontWeight:'500',
  color:'black',
  fontSize:13,
  fontFamily:'Poppins-Regular',

},
noDeviceContainer:{
  flex:0,
  justifyContent:'center',
  alignItems:'center',
  right:10,
},
noDeviceText:{
  fontWeight:'500',
  color:'black',
  fontSize:15,
  fontFamily:'Poppins-Regular',
  textAlign:'center',
  borderWidth:2,
},
uploadText:{
  fontWeight:'500',
  color:'black',
  fontSize:16,
  fontFamily:'Poppins-Regular',

},
billTotal:{
  color:'hsl(0, 100%, 46%)',
  fontWeight:'700',
  fontSize:13.5,

},
billBottomText:{
  flex:0,
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
  marginTop:10,
},
billTime:{
  color:'gray',
  fontSize:12,
  fontFamily:'Poppins-Regular',
},
billViewButton:{
  backgroundColor:'rgba(180, 180, 180,0.5)',
  paddingHorizontal:16,
  paddingVertical:5,
  borderRadius:15,
},
bluetoothViewButton:{
  backgroundColor:'rgba(180, 180, 180,0.5)',
  paddingHorizontal:16,
  paddingVertical:5,
  borderRadius:15,
  width:'40%',
  justifyContent:'center',
  alignItems:'center',
  marginTop:5,
},

billViewText:{
  fontWeight:'600',
  color:'black',
  fontSize:13,
},
logoStyles:{
  height:40,
  width:30,
  marginRight:10,
},
noDeviceContainer:{
  flex:0,
  justifyContent:'flex-end',
  alignItems:'flex-end',
  right:10,
},
noDeviceText:{
  fontWeight:'500',
  color:'black',
  fontSize:15,
  fontFamily:'Poppins-Regular',
},
})