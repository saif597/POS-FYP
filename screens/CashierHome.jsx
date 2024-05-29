import { SafeAreaView, StyleSheet, Image,Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../assets/theme'
import Ionic from 'react-native-vector-icons/Ionicons';
import {productsObj} from '../assets/Products';
import { useNavigation } from '@react-navigation/native'; 
import { useSelector} from 'react-redux'; 
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { useIsFocused } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { listBills,listBillItems,userById  } from '../src/graphql/queries';
import { selectConnectedDevice } from '../store/bluetoothReducer';
const CashierHome = () => {
  const dispatch = useDispatch();
  const client = generateClient();
  const connectedDevice = useSelector(state => selectConnectedDevice(state)?.name);
  const userRole = useSelector((state) => state.user.role);
  const storeID = useSelector((state) => state.user.storeId);
  const [loading, setLoading] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [bills, setBills] = useState([]);
  const [latestBill, setLatestBill] = useState(null); 
  const navigation = useNavigation();
  const storeCurrency  = useSelector(state => state.currency.value); 
  const openDrawer = () => {
    navigation.openDrawer();
  };
  
  // useEffect(() => {
  //   console.log("User role from Redux store:", userRole);
  //   console.log("Connected",connectedDevice);
  // }, [userRole]);

  
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
      // console.log("User",userDetails);
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

const isFocused = useIsFocused();

useEffect(() => {
  if (isFocused) {
    fetchAllBills();
  }
}, [isFocused,storeID]);


const listBillsByStoreAndStatus = /* GraphQL */ `
  query ListBillsByStoreAndStatus($storeId: ID!, $status: BillStatus!, $limit: Int, $nextToken: String) {
    listBills(
      filter: { 
        storeBillsId: { eq: $storeId },
        _deleted: { ne: true },
        status: { eq: $status } 
      },
      limit: $limit,
      nextToken: $nextToken
    ) {
      items {
        id
        cashier
        cashierName
        totalAmount
        status
        store {
          id
          name
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeBillsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

  const fetchAllBills = async () => {
    setIsLoading(true); 
    try {
      const { data } = await client.graphql({
        query: listBillsByStoreAndStatus,
        variables: { 
          storeId: storeID, 
          status: "PAID", 
        },
        filter: {
            _deleted: {
                ne: true
            },
        },     
        authMode: 'apiKey'
      });
  
      const { items } = data.listBills;
      const billsWithDetails = await Promise.all(items.map(async (bill) => {
        // const billItems = await fetchBillItems(bill.id);
        let cashierDetails = { cashierUsername: 'Unknown', cashierRole: 'Unknown' };

        if (bill.cashier) {
          const cashierData = await fetchUserByUserId(bill.cashier);
          if (cashierData) {
            cashierDetails = {
              cashierUsername: cashierData.username || 'Unknown',
              cashierRole: cashierData.role || 'Unknown'
            };
          }
        }
        return { ...bill, ...cashierDetails };
      }));
  
      setBills(billsWithDetails);
    } catch (error) {
      console.log('Error fetching bills:', error);
    }finally {
      setIsLoading(false); 
    }
  };
  const fetchBillItems = async (billId) => {
    // console.log("fetching items for bill:", billId);
    try {
      const { data } = await client.graphql({
        query: listBillItems,
        variables: {
          filter: {
            billItemsId: {
              eq: billId
            }
          }
        },
        authMode: 'apiKey'
      });
  
      // console.log("data:", data); // Log the entire data response for inspection
  
      if (data && data.listBillItems && data.listBillItems.items) {
        return data.listBillItems.items;
      } else {
        console.log("No items found for bill:", billId);
        return [];
      }
    } catch (error) {
      console.log('Error fetching bill items for bill:', error);
      return [];
    }
  };

  const fetchUserByUserId = async (userId) => {
    const { data } = await client.graphql({
      query: userById,
      variables: {
        userId: userId,
        filter: {
          _deleted: {
            ne: true
          }
        }
      },
      authMode: 'apiKey'
    });
  
    // Assuming the first item is the desired user since userId should be unique
    return data.userById.items.length > 0 ? data.userById.items[0] : null;
  };
  const findLatestUpdatedBill = (bills) => {
    let latestBill = null;
    let latestUpdatedAt = 0;
  
    bills.forEach((bill) => {
      const updatedAt = new Date(bill.updatedAt).getTime();
      if (updatedAt > latestUpdatedAt) {
        latestUpdatedAt = updatedAt;
        latestBill = bill;
      }
    });
    // console.log("@#@#@#"+latestBill.id)
    return latestBill;
  };  
  useEffect(() => {
    fetchAllBills();
  }, [storeID]);
  useEffect(() => {
    if (bills.length > 0) {
      const latestBill = findLatestUpdatedBill(bills);
      setLatestBill(latestBill);
    }
  }, [bills]);

  const handleViewPress = (bill) => {
    // console.log("Passing", bill);
    navigation.navigate('ShowBill', { 
        billId: bill.id, 
        billVersion: bill._version,
        billcashier: bill.cashier,
        billCashierUsername: bill.cashierUsername, 
        billCreatedAt: bill.createdAt,
        billdate:bill.date,billtime:bill.time,
        billtotal:bill.totalAmount
    });

};



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
          // onAnimationComplete={() => console.log('onAnimationComplete')}
          backgroundColor="white" 
  />
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
                
               
     <TouchableOpacity style={styles.iconContainer} onPress={() =>navigation.navigate('History',{bills:bills})}>
                     <Ionic name="newspaper-outline" size={25} color={COLORS.primary} style={styles.homeIcon} />
                    <Text style={styles.iconText}>Bills</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.iconContainer} onPress={()=> navigation.navigate('Profile')}>  
                    <Ionic name="person" size={25} color={COLORS.primary} style={styles.homeIcon} />
                    <Text style={styles.iconText}>Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconContainer} onPress={()=> navigation.navigate('ShelfQuantity')}>
                
                  
                <Ionic name="library-outline" size={25} color={COLORS.primary} style={styles.homeIcon} />
                <Text style={styles.iconText}>Shelf</Text>
              </TouchableOpacity>
                </View>
              
                <View style={[styles.icons,styles.lastIcons]}>
        
            
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate('Scan')}
              >
                <Ionic name="scan" size={28} color={COLORS.primary} />
                <Text style={styles.iconText}>Scan</Text>
              </TouchableOpacity>
            
            
                  <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('ProductsList', {
                    productsObj: productsObj,
                  })
                }>
                {/* <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('AddProduct')
                }> */}
                
                    <Ionic name="list" size={28} color={COLORS.primary} style={styles.homeIcon} />
                    <Text style={styles.iconText}>Products</Text>
                  </TouchableOpacity>
                  
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate('Bluetooth')}
              >
                <Ionic name="print" size={28} color={COLORS.primary} />
                <Text style={styles.iconText}>Printer</Text>
              </TouchableOpacity>
        
                </View>
                </View>
                 
                <View style={styles.previousContainer}>
                  <Text style={styles.previousText}>Connected Printer</Text>
                </View>
            
                <View style={styles.bluetoothSection}>
                  <View style={styles.bluetoothContainer}>
                    {/* <Image style={styles.logoStyles} source={require("../assets/images/logo7.png")}/> */}
                    <Ionic size={27} style={{marginLeft:5}}color={COLORS.primary} name ='print-outline'/>
                    <View style={styles.bluetoothText}>
      {connectedDevice ? (
        <View>
          <View style={styles.cashierName}>
            <Text style={styles.cashierText}>
              Device Name:
            </Text>
            <Text style={styles.billTotal}>
              {connectedDevice}
            </Text>
          </View>
          <View style={styles.billBottomText}>
            <Text style={styles.billTime}>
              From: 07:36 PM
            </Text>
            <TouchableOpacity style={styles.billViewButton} onPress={() => navigation.navigate('Bluetooth')}>
              <Text style={styles.billViewText}>
                Connect
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.noDeviceContainer}>
          <Text style={styles.noDeviceText}>No Device Connected</Text>
          <TouchableOpacity style={styles.bluetoothViewButton} onPress={() => navigation.navigate('Bluetooth')}>
              <Text style={styles.billViewText}>
                Change
              </Text>
            </TouchableOpacity>
        </View>
        
      )}
    </View>
                  </View>
                </View>
              
                  <View style={styles.previousContainer}>
                    <Text style={styles.previousText}>Last Bill Generated</Text>
                  </View>
                  
                  {latestBill ? (
  <View style={styles.billSection}>
    <View style={styles.billContainer}>
    
      
      <Image style={styles.logoStyles} source={require("../assets/images/logo1.png")} />
     
      <View style={styles.billText}>
        <View style={styles.cashierName}>
          <Text style={styles.cashierText}>
            {latestBill.cashierUsername}
          </Text>
          <Text style={styles.billTotal}>
          {`${storeCurrency || '$'} ${latestBill.totalAmount}`}
         
          </Text>
        </View>
        <View style={styles.billBottomText}>
          <Text style={styles.billTime}>
            {latestBill && latestBill.updatedAt ? new Date(latestBill.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : ''}
          </Text>
          <TouchableOpacity style={styles.billViewButton} onPress={() => handleViewPress(latestBill)}>
            <Text style={styles.billViewText}>
              View
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
) : (
  <View style={styles.billSection}>
  <View style={styles.billContainer}>
  
    
    <Image style={styles.logoStyles} source={require("../assets/images/logo1.png")} />
   
    <View style={styles.billText}>
      <View style={styles.cashierName}>
        <Text style={styles.cashierText}>{isLoading ? 'Fetching...' : 'No Bills Created'}</Text>
      </View>
      <View style={styles.billBottomText}>
      
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

export default CashierHome

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
    marginBottom:10,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:30,
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
  height:50,
  width:35,
  marginRight:10,
},
})