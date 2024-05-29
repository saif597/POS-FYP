import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native';
import { generateClient } from 'aws-amplify/api';
import { listUsers } from '../src/graphql/queries.js';
import { SelectList } from 'react-native-dropdown-select-list';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';

const StaffListScreen = () => {
  const [selected, setSelected] = useState('');
  const [value, setValue] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const storeID = useSelector((state) => state.user.storeId);
  const client = generateClient();

  useEffect(() => {
    fetchAllUsers();
  }, [storeID]);

const getUsersByStoreId = /* GraphQL */ `
  query GetUsersByStoreId($storeId: ID!) {
    listUsers(filter: { 
      storeUsersId: { eq: $storeId },
      _deleted: { ne: true } 
    }) {
      items {
        id
        userId
        username
        phonenumber
        image
        role
        idcardimage
        bills
        purchaseOrders
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeUsersId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;


  const fetchAllUsers = async () => {
    try {
      const { data } = await client.graphql({
        query: getUsersByStoreId,
       variables: {  storeId: storeID },
            filter: {
                _deleted: {
                    ne: true
                }
            },
        authMode: 'apiKey',
      });
      setUsers(data.listUsers.items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false); 
    }
  };

  const navigation = useNavigation();
  const handleAddAccount = () => {
    navigation.navigate('AddAccount');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.arrowBack} onPress={() => navigation.goBack()}>
            <Ionic size={25} color='white' name='chevron-back-outline' />
          </TouchableOpacity>
          <Text style={styles.cashierHeading}>Staff List</Text>
        </View>
      </SafeAreaView>
      <View style={styles.listContainer}>
        <View style={styles.selectedContainer}>
        <SelectList
    setSelected={(selectedValue) => {
        setSelected(selectedValue || 'ALL');  // Set to 'ALL' if selectedValue is empty or 'ALL'
        console.log("Selected Role: ", selectedValue);
    }}
    data={[
        { key: '1', value: 'CASHIER' },
        { key: '2', value: 'PURCHASER' },
        { key: '3', value: 'WAREHOUSE_MANAGER' },
        { key: '4', value: 'ALL' }  // Ensure this represents no filtering
    ]}
    search={false}
    onSelect={() => console.log("Selected Role: ", selected)}
    save="value"
    placeholder="Select Role"
    boxStyles={{ borderWidth: 2 }}
    arrowicon={<Ionic style={{ position: 'absolute', right: 10, top: 14 }} size={26} color='rgba(180, 180, 180,4)' name='chevron-down-outline' />}
    inputStyles={{ fontSize: 18.5, top: 1, fontFamily: 'Poppins-Regular', color: 'rgba(140, 140, 140,4)' }}
    dropdownTextStyles={{ color: 'rgba(140, 140, 140,4)' }}
/>

        </View>
        {loading ? (
          <View style={{flex:1,backgroundColor:'white',justifyContent:'center',paddingHorizontal:25}}>
          
     
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
        ) : (
          <ScrollView>
          {users.filter(user => !selected || selected === 'ALL' || user.role === selected).map(user => (
              <TouchableOpacity key={user.id} style={styles.billContainer} onPress={() => navigation.navigate('Profile', { userId: user.userId })}>
                  <Image style={styles.logoStyles} source={user.image ? { uri: user.image } : require("../assets/images/person.jpg")} />
                  <View style={styles.billText}>
                      <View style={styles.intro}>
                          <View style={styles.cashierName}>
                              <Text style={styles.cashierText}>{user.username}</Text>
                              <Text style={styles.billTime}>Joined: {new Date(user.createdAt).toLocaleDateString()}</Text>
                          </View>
                      </View>
                      <View>
                          <View style={styles.billBottomText}>
                              <TouchableOpacity style={styles.billViewButton} onPress={() => navigation.navigate('Profile', { userId: user.userId })}>
                                  <Ionic size={26} color={COLORS.primary} name='chevron-forward-outline' />
                              </TouchableOpacity>
                          </View>
                      </View>
                  </View>
              </TouchableOpacity>
          ))}
      </ScrollView>
  )}
        
        <TouchableOpacity style={styles.confirmButton} onPress={handleAddAccount}>
          <Text style={styles.confirmText}>Add Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.primary,
    },
    safeArea:{
        backgroundColor:COLORS.primary,
        flex:1,
    },
    headerContainer:{
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:50,
        borderBottomLeftRadius:30,
    },
    cashierHeading:{
        color:'white',
        fontSize:24,
        fontFamily:'Poppins-Regular',
    },
    arrowBack:{
        position:'absolute',
        left:10,
    },
    listContainer:{
        flex:4.5,
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
        backgroundColor:'rgba(240, 240, 240,4)',
        justifyContent:'center',
        // alignItems:'center',
        paddingHorizontal:20,
    },
    selectedContainer:{
        flex:0,
        paddingVertical:20,
        width:'100%',
        marginTop:10,
    },
    billContainer:{
        flex:0,
        flexDirection:'row',
       
        // marginVertical:15,
        marginTop:25,
        // marginHorizontal:25,
        paddingVertical:25,
        paddingHorizontal:10,
        backgroundColor:'white',
        elevation: 5, 
        shadowColor: 'black', 
        shadowOffset: {
            width:'100%',
            height: 2, 
        },
    shadowOpacity: 1, 
    shadowRadius: 15, 
    borderRadius: 15, 
      },
      billText:{
        marginLeft:15,
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
      },
      cashierName:{
        flex:2,
        flexDirection:'column',
        justifyContent:'space-around',
      },
      cashierText:{
        fontWeight:'400',
        color:'black',
        fontSize:17,
        fontFamily:'Roboto-Medium',
      },
      billTotal:{
        color:'hsl(0, 100%, 46%)',
        fontWeight:'700',
        fontSize:12.5,
      },
      billBottomText:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        right:2,
      },
      
      billTime:{
        color:'gray',
        fontWeight:'500',
        fontSize:11.5,
      },
      billViewButton:{
        paddingHorizontal:6,
        paddingVertical:5,
        borderRadius:15,
      },
      billViewButton2:{
        paddingHorizontal:6,
        paddingVertical:5,
        borderRadius:15,
      },
      billViewText:{
        fontWeight:'600',
        color:'black',
        fontSize:15,
      },
      logoStyles:{
        height:70,
        width:70,
        borderWidth:1,
        borderColor:COLORS.primary,
        padding:10,
        borderRadius: 50, 
        overflow: 'hidden',
      },
      footerWrapper:{
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:13,
    },
    confirmButton:{
        backgroundColor:COLORS.primary,
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        width:300,
        marginHorizontal:10,
        paddingVertical:8,
        borderRadius:25,
        marginBottom:10,
    },
    confirmText:{
        fontSize:18,
        color:'white',
        fontFamily:'Poppins-Regular',
        top:2,
    },
    addButton:{
        backgroundColor:'white',
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        width:300,
        marginHorizontal:10,
        paddingVertical:8,
        borderRadius:25,
        borderWidth:1,
        borderColor:COLORS.primary,
    },
    addText:{
        fontSize:22,
        color:COLORS.primary,
        fontFamily:'Poppins-Regular',
        top:2,
    }
})
export default StaffListScreen;