import { StyleSheet, Text, View ,TouchableOpacity,ScrollView,Image, Button} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { useIsFocused, useNavigation } from '@react-navigation/native'; 
import { generateClient } from 'aws-amplify/api';
import { getPurchaseOrder, listPurchaseOrders } from '../src/graphql/queries.js';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';
import { SelectList } from 'react-native-dropdown-select-list';


const PurchaseHistory = () => {
  const navigation=useNavigation();
  const client= generateClient();
  const [loading, setLoading] = useState(true);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const storeID = useSelector((state) => state.user.storeId);
  const storeCurrency  = useSelector(state => state.currency.value);  
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null); // State to store the selected filter
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchAllPOs();
    }
  }, [isFocused,storeID]);


  const getPurchaseOrdersByStoreId = /* GraphQL */ `
  query GetPurchaseOrdersByStoreId($storeId: ID!) {
    listPurchaseOrders(filter: { 
      storePurchaseOrderId: { eq: $storeId },
      _deleted: { ne: true } 
    }) {
      items {
        id
        purchaser
        purchaserName
        vendor
        totalAmount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storePurchaseOrderId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;





const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};


  
  useEffect(() => {
    fetchAllPOs();
  }, [storeID]);

  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };
  
  const formatPurchaseOrders = (orders) => {
    const groupedByDate = orders.reduce((acc, order) => {
      const orderDate = formatDate(order.createdAt);
      if (!acc[orderDate]) acc[orderDate] = [];
      acc[orderDate].push({
        ...order,
        formattedDate: orderDate,
        formattedTime: formatTime(order.createdAt)
      });
      return acc;
    }, {});
  
    const sortedDates = Object.entries(groupedByDate).sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateB - dateA;
    });
  
    return sortedDates.map(([date, orders]) => ({
      date,
      items: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }));
  };
  
  
  const fetchAllPOs = async () => {
    setLoading(true);
    try {
      const { data } = await client.graphql({
        query: getPurchaseOrdersByStoreId, 
        variables: { storeId: storeID },
        authMode: 'apiKey',
      });
      const formattedData = formatPurchaseOrders(data.listPurchaseOrders.items);
     
      setPurchaseOrders(formattedData);
      setFilteredPurchaseOrders(formattedData);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate2 = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };
  
  const handleRefresh = () => {
    fetchAllPOs();
  };

  const applyFilter = () => {
    if (selectedFilter === 'ALL' || !selectedFilter ) {
      setFilteredPurchaseOrders(purchaseOrders);
    } else {
      const filteredOrders = purchaseOrders.flatMap(day => ({
        date: day.date,
        items: day.items.filter(po => po.status === selectedFilter)
      })).filter(day => day.items.length > 0);
  
      setFilteredPurchaseOrders(filteredOrders);
    }
  };
  
  useEffect(() => {
    applyFilter();
  }, [selectedFilter]);

  
  return (
    <View  style={{flex:1,backgroundColor:'white'}}>
    {loading ? 
    ( 
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
  ): purchaseOrders.length === 0 ? 
  (
 
    <SafeAreaView style={styles.headContainer}>
      <View style={styles.header}>
          <TouchableOpacity style={styles.arrowBackIcon}  onPress={()=> navigation.goBack()}>
              <Ionic size={22} color={COLORS.primary} name ='chevron-back-outline'/>
          </TouchableOpacity>
          <Text style={styles.settingsText}>Purchase History</Text>
      </View>
     
    <View style={styles.noOrdersContainer}>
      <Text style={styles.noOrdersText}>No Purchase Orders</Text>
    </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.headContainer}>
      <View style={styles.header}>
          <TouchableOpacity style={styles.arrowBackIcon}  onPress={()=> navigation.goBack()}>
              <Ionic size={22} color={COLORS.primary} name ='chevron-back-outline'/>
          </TouchableOpacity>
          <Text style={styles.settingsText}>Purchase History</Text>
      </View>
      <View style={styles.selectedContainer}>
        <SelectList
          setSelected={(selectedValue) => {
            setSelectedFilter(selectedValue);
          }}
          data={[
            { key: '1', value: 'PENDING' },
            { key: '2', value: 'RECEIVED' },
            { key: '3', value: 'ALL' },
          ]}
          search={false}
          save="value"
          placeholder="Select Status"
          boxStyles={{ borderWidth: 2 ,marginHorizontal:30}}
          arrowicon={<Ionic style={{ position: 'absolute', right: 10, top: 14 }} size={26} color='rgba(180, 180, 180,4)' name='chevron-down-outline' />}
          inputStyles={{ fontSize: 18.5, top: 1, fontFamily: 'Poppins-Regular', color: 'rgba(140, 140, 140,4)' }}
          dropdownTextStyles={{ width:'80%',color: 'rgba(140, 140, 140,4)' }}
          dropdownStyles={{marginHorizontal:30}}
        />
    </View>
      <ScrollView style={styles.scrollviewContainer}>
      {filteredPurchaseOrders.map((day, index) => (
       
        <View key={index}>
          <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate2(day.date)}</Text> 
          </View>
          {day.items.map((po, idx) => (
            <View key={idx} style={styles.billSection}>
              <View style={styles.billContainer}>
                <Image style={styles.logoStyles} source={require("../assets/images/logo1.png")} />
                <View style={styles.billText}>
                  <View style={styles.cashierName}>
                    <Text style={styles.cashierText}>Vendor: {po.vendor}</Text>
                    <Text style={styles.billTotal}>{`${storeCurrency || '$'}${po.totalAmount}`}</Text>
                  </View>

                  <View style={styles.cashierName2}>
                    <Text style={styles.cashierText2}>{po.formattedTime}</Text>
                   
                  </View>
                  
                  <View style={styles.billBottomText}>
                    {/* <Text style={[styles.billTime, { color: po.status === 'PENDING' ? 'orange' : 'green' }]}>{po.formattedTime}</Text> */}
                    <Text style={[styles.billTime, { color: po.status === 'PENDING' ? 'orange' : 'green' }]}>{po.status}</Text>
                    <TouchableOpacity 
  style={styles.billViewButton} 
  onPress={() => navigation.navigate('PurchaseOrder', {
    purchaseOrderId: po.id,
    purchaseOrderAmount: po.totalAmount,
    purchaseOrderVendor: po.vendor,
    purchaseOrderVersion: po._version,
    purchaserName: po.purchaserName,
    purchaseStatus: po.status,
    dateCreated: po.createdAt,
    dateUpdated: po.updatedAt
  })} 
>
  <Text style={styles.billViewText}>View</Text>
</TouchableOpacity>

                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
       <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
   </SafeAreaView>
   )
    }

   
  </View>
  )}

export default PurchaseHistory

const styles = StyleSheet.create({
    headContainer:{ 
        flex:1,
        backgroundColor:'white',
    },
    header:{
       marginTop:25,
       marginBottom:20,
        flex:0,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        
    },
    settingsText:{
        fontSize:21,
        color:COLORS.primary,
        top:4,
        fontFamily:'Poppins-Regular'
    },
    selectedContainer:{
      flex:0,
      flexDirection:'column',

  },
    arrowBackIcon:{
        position:'absolute',
        left:8,
        padding:20,
    },
    accountText:{
        fontSize:20,
        fontWeight:'900',
        color:COLORS.primary,
    },
    scrollviewContainer:{
      paddingHorizontal:12,
      
      marginTop:20,
      backgroundColor:'rgba(180, 180, 180,0.25)',
    },
    

  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0,0.2)',
  },
  noOrdersText: {
    fontSize: 20,
    fontFamily:'Poppins-Medium',
    color: COLORS.primary,
  },
    downloadContainer:{
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:14,
        backgroundColor:'white',
        marginVertical:15,
    },

    downloadButton:{
      flex:0,
      flexDirection:'row'
    },
    downloadText:{
      color:'rgb(73,204,148)',
      fontSize:14,
      marginRight:5,
      fontFamily:'Poppins-Medium',
    },
    dateHistoryContainer:{
    },
    dateContainer:{
      marginVertical:20,
      left:2,
    },
    dateText:{
      // fontWeight:'700',
      fontSize:13,
      color:COLORS.primary,
      fontFamily:'Poppins-SemiBold',
    },
    billSection:{
        paddingHorizontal:11,
        paddingVertical:20,
        backgroundColor:'white',
        borderWidth:0.3,
        borderColor:COLORS.primary,
    },
    billContainer:{
      flex:0,
      flexDirection:'row'
    },
    billText:{
      marginHorizontal:12,
      flex:1,
      
    },
    cashierName:{
      flex:0,
      flexDirection:'row',
      justifyContent:'space-between',
      top:2,
    },
    cashierText:{
      fontWeight:'500',
      color:'black',
      fontSize:13,
      fontFamily:'Poppins-Regular',
    },
    cashierName2:{
      flex:0,
      flexDirection:'row',
      justifyContent:'space-between',
      top:2,
    },
    cashierText2:{
      fontWeight:'500',
      color:'black',
      fontSize:10,
      left:1,
      fontFamily:'Poppins-Regular',
    },
    billTotal:{
      color:'hsl(0, 100%, 46%)',
      fontWeight:'700',
      fontSize:14.5,
      right:2,
    },
    billBottomText:{
      flex:1,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginTop:5,
    },
    billTime:{
      color:'gray',
      fontWeight:'500',
      fontFamily:'Poppins-Regular',
      fontSize:12.5,
    },
    billViewButton:{
      backgroundColor:'rgba(180, 180, 180,0.5)',
      paddingHorizontal:18,
      paddingVertical:5,
      borderRadius:15,
    },
    billViewText:{
      fontWeight:'600',
      color:'black',
      fontSize:13,
    },
    logoStyles:{
      height:45,
      width:35,
    },
    refreshButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 10,
      alignItems: 'center',
    },
    refreshButtonText: {
      fontSize: 18,
      color: 'white',
      fontFamily: 'Poppins-Regular',
    },
    optionContainer:{
        paddingHorizontal:12,
        flex:0,
        flexDirection:'row',
        paddingVertical:8,
        backgroundColor:'rgba(180, 180, 180,0.124)',
    },
    optionText:{
        fontSize:19,
        fontWeight:'500',
        color:COLORS.primary,
        marginLeft:50
    },
   
 

  
})
