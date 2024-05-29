import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import React, {useState,useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { listNotifications } from '../src/graphql/queries';
import { updateNotifications } from '../src/graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { COLORS } from '../assets/theme'
import { refresh } from '@react-native-community/netinfo';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';

const client = generateClient();

const listNotificationsByStoreId = /* GraphQL */ `
  query ListNotificationsByStoreId($storeId: ID!) {
    listNotifications(filter: { 
      storeNotificationsId: { eq: $storeId },
      _deleted: { ne: true },
      isRead:{ne:true}
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

const formatTime = (timestamp) => {
const date = new Date(timestamp);
return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
};
const handleMarkRead = async (notification,unreadNotifications, setUnreadNotifications) => {
const np= {
  _version:notification._version,
  id:notification.id,
  warehousequanity: notification.warehousequanity,
  shelfquantity: notification.shelfquantity, 
  productID: notification.productID,
  productname: notification.productname, 
  isRead: true,
  isWarehouseNotification:notification.isWarehouseNotification , 
  isShelfNotification: notification.isShelfNotification, 
}
try {
  const response = await client.graphql({
    query: updateNotifications,
    variables: {input:np
    } ,
    authMode:'apiKey'
  });
  if (response.data.updateNotifications) {
    const updatedUnreadNotifications = unreadNotifications.filter(
      (n) => n.id !== notification.id
    );
    setUnreadNotifications(updatedUnreadNotifications)
  console.log(response);
  }
} catch (error) {
  console.error('Error marking notification as read:', error);
}

};
const NotificationItem = ({ notification,unreadNotifications,setUnreadNotifications}) => (
<View style={styles.billSection}>
  <View style={styles.billContainer}>
    {notification.isShelfNotification ? (  <Image source={require('../assets/images/shelf.png')} style={styles.notificationImage} />):(  <Image source={require('../assets/images/warehouse.png')} style={styles.notificationImage} />)}
    <View style={styles.billText}>
      <View style={styles.cashierName}>
        <Text style={styles.cashierText}>{notification.productname}</Text>
        <Text style={styles.billTotal}>
          {notification.isWarehouseNotification ? notification.warehousequanity : notification.shelfquantity} Pieces
        </Text>
      </View>
      {notification.isWarehouseNotification && (
          <Text style={[styles.additionalInfo, {fontSize: 10}]}>Warehouse</Text>
        )}
        {notification.isShelfNotification && (
          <Text style={[styles.additionalInfo, {fontSize: 10}]}>Shelf</Text>
        )}
      <View style={styles.billBottomText}>
      <Text style={styles.billTime}>{formatTime(notification.createdAt)}</Text>
        <TouchableOpacity style={styles.billViewButton} onPress={() => handleMarkRead(notification,unreadNotifications,setUnreadNotifications)} >
          <Text style={styles.billViewText}>Noted</Text>
          <View style={styles.mark}>
            <Ionic name="checkmark-outline" size={18} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</View>
);
const Notifications = ({ notifications }) => {
useFocusEffect(
  React.useCallback(() => {
    fetchUnreadNotifications();
  }, [])
);
const navigation = useNavigation();
const storeID = useSelector((state) => state.user.storeId);
const [loading, setLoading] = useState(true);
const [unreadNotifications, setUnreadNotifications] = useState([]);
const fetchUnreadNotifications = async () => {
  setLoading(true);
  try {
    const response = await client.graphql({
      query: listNotificationsByStoreId,
      variables: {  storeId: storeID },
      filter: {
          _deleted: {
              ne: true
          },
          isRead:{
            ne: true
          }
      },
      authMode: 'apiKey',
    });

    const unreadNotificationsData = response.data.listNotifications.items;
    const sortedNotifications = unreadNotificationsData.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setUnreadNotifications(sortedNotifications);
    
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.error('Error fetching unread notifications:', error);
  }
};
useEffect(() => {
  fetchUnreadNotifications();
}, []);
return (
  <View>
  <View style={styles.headerContainer}>
    <View style={styles.headerWrapper}>
      <TouchableOpacity
        style={styles.arrowBackIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionic size={22} color="white" name="chevron-back-outline" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Notifications</Text>
    </View>
  </View>
  <ScrollView style={styles.notificationContainer}>
  {loading ? (
          <View style={{flex:1,justifyContent:'center',paddingHorizontal:25,  borderTopRightRadius:50,
        borderTopLeftRadius:50,width:'100%'}}>
        
       <SkeletonPlaceholder borderRadius={4}>
       
           <View style={{paddingVertical:20}}>
           <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
           <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50}/>
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
       
       ) : unreadNotifications.length > 0 ? (
     <View>
      {unreadNotifications.map((notification, index) => (
        <NotificationItem
         key={index} 
         notification={notification}
          handleMarkRead={(notification) => handleMarkRead(notification, unreadNotifications, setUnreadNotifications)}
            unreadNotifications={unreadNotifications} setUnreadNotifications={setUnreadNotifications} />
      ))}
 </View>
 
       ):(
        
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>No Notifications to Show</Text>
        </View>
        )}  
       </ScrollView>
  
</View>
)
}
export default Notifications

const styles = StyleSheet.create({
  headerContainer:{
      flex:0,
      backgroundColor:COLORS.primary,
  },
  noOrdersContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height:'100%',
    paddingVertical:100,
  },
  noOrdersText: {
    fontSize: 20,
    fontFamily:'Poppins-Medium',
    color: COLORS.primary,
  },
  headerWrapper:{
      paddingVertical:40,
      borderBottomRightRadius:10,
      justifyContent:'center',
      alignItems:'center',
  },
  headerText:{
      fontFamily:'Poppins-Regular',
      fontSize:21,
      color:'white',
      paddingTop:5,
  },
  arrowBackIcon: {
      position: 'absolute',
      left: 8,

  },
  notificationContainer:{
      paddingVertical:10,
      marginBottom:30,
  },
  billSection:{
      paddingHorizontal:11,
      height:100,
      marginHorizontal:20,
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
  
  billContainer:{
    flex:0,
    flexDirection:'row',  
  },
  billText:{
    marginHorizontal:12,
    flex:1,
  },
  cashierName:{
    flex:0,
    flexDirection:'row',
    justifyContent:'space-between',
  
  },
  notificationImage:{
    height:50,
    width:50
  },
  cashierText:{
    fontWeight:'500',
    color:'black',
    fontSize:13,
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
    marginTop:0,
  },
  billTime:{
    color:'gray',
    fontSize:12,
    fontFamily:'Poppins-Regular',
  },
  billViewButton:{
    backgroundColor:'rgba(180, 180, 180,0.5)',
    paddingLeft:14,
    paddingRight:10,
    paddingVertical:5,
    borderRadius:15,
    flexDirection:'row',
    left:5,
  },
  billViewText:{
    fontWeight:'600',
    color:'black',
    fontSize:13,
  },
  logoStyles:{
    height:30,
    width:30,
    marginRight:10,
  },
  mark:{
      marginLeft:5,
  },
  additionalInfo: {
    fontSize: 10,
    color: '#A9A9A9',
    fontFamily: 'Poppins-Regular',
  }
})