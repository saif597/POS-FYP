import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native';
import { listBills, userById } from '../src/graphql/queries.js';
import { generateClient } from 'aws-amplify/api';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';

const HistoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const client = generateClient();
  const [formattedBills, setFormattedBills] = useState([]);
  const storeID = useSelector((state) => state.user.storeId);
  const [loading, setLoading] = useState(true);
  const storeCurrency = useSelector((state) => state.user.currency);

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
      console.log("Bills are coming");
      console.log("Bills", data.listBills.items);
      console.log("Bills are gone");
      const billsData = data.listBills.items;
      const formattedData = formatBillsData(billsData);
      console.log("Formatted Bills",formattedData);
      setFormattedBills(formattedData);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching bills:', error);
      setLoading(false);  
    }
  };

  const formatBillsData = (bills) => {
    let groupedByDate = bills.reduce((acc, bill) => {
      const billDate = new Date(bill.createdAt);
      const formattedDate = formatDateToDDMMYYYY(bill.createdAt);
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push({
        ...bill,
        rawDate: billDate // Storing raw date for sorting
      });
      return acc;
    }, {});
  
    // Sort bills by date in descending order, considering year, month, and day
    let formattedBills = Object.entries(groupedByDate)
      .sort((a, b) => {
        // Split the date strings to compare year, month, and day individually
        const datePartsA = a[0].split('-').map(part => parseInt(part, 10));
        const datePartsB = b[0].split('-').map(part => parseInt(part, 10));
        // Compare year, month, and day in that order
        if (datePartsB[2] !== datePartsA[2]) return datePartsB[2] - datePartsA[2]; // Year comparison
        if (datePartsB[1] !== datePartsA[1]) return datePartsB[1] - datePartsA[1]; // Month comparison
        return datePartsB[0] - datePartsA[0]; // Day comparison
      })
      .map(([date, bills]) => {
        // Sort bills within the same date by time in descending order
        const sortedBills = bills.sort((a, b) => b.rawDate - a.rawDate);
        return {
          date,
          items: sortedBills.map(bill => ({
            cashier: bill.cashierName,
            total: bill.totalAmount,
            id: bill.id,
            version: bill._version,
            time: formatTime(bill.rawDate)
          }))
        };
      });
  
    return formattedBills;
  };
  
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };
  
  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Adjust hour for AM/PM
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };
  
  useEffect(() => {
    if (route.params?.bills) {
      const formattedData = formatBillsData(route.params.bills);
      setFormattedBills(formattedData);
    } else {
      fetchAllBills();
    }
  }, [storeID]);
   
  const getMonthName = (monthIndex) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[monthIndex];
  };

  const handleViewPress = (bill, item) => {
    console.log("Passing", item);
    navigation.navigate('ShowBill', { billId: item.id, billVersion:item.version, billcashier: item.cashier,billdate:item.date,billtime:item.time,billtotal:item.total});
  };
  
  const handleRefresh = () => {
    
    fetchAllBills();
  };

  return (
    <SafeAreaView style={styles.headContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowBackIcon} onPress={() => navigation.goBack()}>
          <Ionic size={22} color={COLORS.primary} name='chevron-back-outline' />
        </TouchableOpacity>
        <Text style={styles.settingsText}>Billing History</Text>
      </View>

      <ScrollView style={styles.scrollviewContainer}>
      <View style={styles.downloadContainer}>
        <TouchableOpacity style={styles.downloadButton}  onPress={handleRefresh}>
          <Text style={styles.downloadText}>Refresh</Text>
          <Ionic style={styles.dowloadIcon}  size={20} color={'rgb(73,204,148)'} name ='refresh-outline'/>
        </TouchableOpacity>
      </View>
        {loading ? (
         <View style={{flex:1,backgroundColor:'white',justifyContent:'center',paddingHorizontal:25}}>
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
        ) : (
          formattedBills.map((bill, index) => (
            <View key={index}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{bill.date}</Text>
              </View>
              {bill.items.map((item, itemIndex) => (
                <View style={styles.billSection} key={itemIndex}>
                  <View style={styles.billContainer}>
                    <Image style={styles.logoStyles} source={require("../assets/images/logo1.png")} />
                    <View style={styles.billText}>
                      <View style={styles.cashierName}>
                        <Text style={styles.cashierText}>Cashier: {item.cashier}</Text>
                        
                        <Text style={styles.billTotal}>{storeCurrency || '$'}{item.total}</Text>
                      </View>
                      <View style={styles.billBottomText}>
                        <Text style={styles.billTime}>{item.time}</Text>
                       
                       <TouchableOpacity
    style={styles.billViewButton}
    onPress={() => handleViewPress(bill, item)}
  >
    <Text style={styles.billViewText}>View</Text>
  </TouchableOpacity>


                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default HistoryScreen;

const styles = StyleSheet.create({
    headContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        marginTop: 25,
        marginBottom: 20,
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsText: {
        fontSize: 21,
        color: COLORS.primary,
        top: 4,
        fontFamily: 'Poppins-Regular',
    },
    arrowBackIcon: {
        position: 'absolute',
        left: 8,
        padding:20,
    },
    accountText: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.primary,
    },
    scrollviewContainer: {
        paddingHorizontal: 12,
        marginTop: 20,
        backgroundColor: 'rgba(180, 180, 180,0.25)',
    },

    dateContainer: {
        marginVertical: 20,
        left: 2,
    },
    dateText: {
        fontSize: 13,
        color: COLORS.primary,
        fontFamily: 'Poppins-SemiBold',
    },
    billSection: {
        paddingHorizontal: 11,
        paddingVertical: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    billContainer: {
        flexDirection: 'row',
    },
    billText: {
        marginHorizontal: 12,
        flex: 1,
    },
    cashierName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: 2,
    },
    cashierText: {
        fontWeight: '500',
        color: 'black',
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
    },
    billTotal: {
        color: 'hsl(0, 100%, 46%)',
        fontWeight: '700',
        fontSize: 14.5,
    },
    billBottomText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 25,
    },
    billTime: {
        color: 'gray',
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
        fontSize: 12.5,
    },
    billViewButton: {
        backgroundColor: 'rgba(180, 180, 180,0.5)',
        paddingHorizontal: 18,
        paddingVertical: 5,
        borderRadius: 15,
    },
    billViewText: {
        fontWeight: '600',
        color: 'black',
        fontSize: 13,
    },
    logoStyles: {
        height: 45,
        width: 35,
    },
    optionContainer: {
        paddingHorizontal: 12,
        flexDirection: 'row',
        paddingVertical: 8,
        backgroundColor: 'rgba(180, 180, 180,0.124)',
    },
    optionText: {
        fontSize: 19,
        fontWeight: '500',
        color: COLORS.primary,
        marginLeft: 50,
    },
    
 
  downloadContainer:{
    flex:0,
    justifyContent:'center',
    alignItems:'center',
    
    backgroundColor:'white',
    marginVertical:15,
},
downloadButton:{
  flex:0,
  flexDirection:'row',
  width:'100%',
  justifyContent:'center',
  paddingVertical:13,
},
downloadText:{
  color:'rgb(73,204,148)',
  // fontWeight:'600',
  fontSize:15,
  marginRight:5,
  fontFamily:'Poppins-Medium',
},
});
