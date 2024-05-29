import { StyleSheet, Text,TextInput, View ,Modal,TouchableOpacity,ScrollView,Image, Button} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native'; 
import { generateClient } from 'aws-amplify/api';
import { getPurchaseOrder, listCategories, listPurchaseOrders } from '../src/graphql/queries.js';
import { setCategory } from 'react-native-sound';
import { createCategory } from '../src/graphql/mutations.js';
import { useSelector } from 'react-redux';



const Categories = ({route}) => {
  const navigation=useNavigation();
  const client= generateClient();
  const storeID = useSelector((state) => state.user.storeId);
  const item=route.params.item;
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [category, setCategory] = useState('');
  const listPurchaseOrders = /* GraphQL */ `
  query ListPurchaseOrders(
    $filter: ModelPurchaseOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPurchaseOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        purchaser
        vendor
        amount
        date
        createdAt
        _version
        _deleted
      }
    }
  }
`;


const handleSubmitCategory = async () => {
    // You need to implement a function to create a new category
    // using the entered category name
    try {
      // Add your logic here to create a new category
      console.log("Category Name:", categoryName);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const getCategoriesByStoreId = /* GraphQL */ `
  query GetCategoriesByStoreId($storeId: ID!) {
    listCategories(filter: { 
      storeCategoryId: { eq: $storeId },
      _deleted: { ne: true } 
    }) {
      items {
        id
        name
        description
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeCategoryId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

const fetchCategories = async () => {
    try {
      const { data } = await client.graphql({
        query: getCategoriesByStoreId,
        variables: {  storeId: storeID },
            filter: {
                _deleted: {
                    ne: true
                }
            },
          authMode:'apiKey'
      });
      const { items } = data.listCategories
      console.log("Item Passed",route.params.item);
      console.log("Categories",items);
      setPurchaseOrders(data.listCategories.items);
      setCategory('');
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
  }, [selectedImage]); 

  useEffect(() => {
    fetchCategories();
  }, []); 
//   const  fetchAllPOs=async()=>{
//     try{

    
//     const {data}= await client.graphql({
//       query:listPurchaseOrders,
//       variables: {
//         filter: {
//           _deleted: {
//             ne: true
//           }
//         }
//       },
//       authMode: 'apiKey',
//     })
//     console.log("DATA",data.listPurchaseOrders.items);
//     setPurchaseOrders(data.listPurchaseOrders.items);
//   } catch (error) {
//     console.error('Error fetching bills:', error);
//   }};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  
//   useEffect(()=>{
//     fetchAllPOs();
//   },[])
  
  const handleRefresh = () => {
    fetchCategories();
  };

    
  const handleAddCategory = async () => {
    setIsModalVisible(true);
    console.log("Creating",storeID);
    
    try {
      const newCategory = await client.graphql({
        query: createCategory,
        variables: { input: { name: category,storeCategoryId:storeID } },
        authMode: 'apiKey',
      });
      console.log('New category created:', newCategory.data.createCategory);
      fetchCategories(); 
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating category:', error);
    
    }
  };
  
  return (
    <SafeAreaView style={styles.headContainer}>
    <View style={styles.header}>
        <TouchableOpacity style={styles.arrowBackIcon}  onPress={()=> navigation.goBack()}>
            <Ionic size={22} color={COLORS.primary} name ='chevron-back-outline'/>
        </TouchableOpacity>
        <Text style={styles.settingsText}>Categories</Text>
    </View>
    
    {purchaseOrders.length === 0 ? (
  <View style={styles.noOrdersContainer}>
    <Text style={styles.noOrdersText}>No Categories to Display</Text>
  </View>
) : (
  <ScrollView style={styles.scrollviewContainer}>
    <View style={styles.dateHistoryContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>Categories List</Text>
      </View>
    </View>
    {purchaseOrders.map((po, index) => (
  <TouchableOpacity
    key={po.id}
    style={styles.resetButton}
    onPress={() => {
      if (route.params.source === 'fromProducts') {
        navigation.navigate('Product', { categoryId: po.id, categoryName: po.name, item: item });
      } else if (route.params.source === 'fromAddProduct') {
        navigation.navigate('AddProduct', { categoryId: po.id, categoryName: po.name });
      }
    }}
  >
    <Text style={styles.resetText}>{po.name}</Text>
  </TouchableOpacity>
))}

  </ScrollView>
)}
       <TouchableOpacity style={styles.refreshButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.refreshButtonText}>Add Category</Text>
      </TouchableOpacity>
      <Modal
  visible={isModalVisible}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <Text style={styles.modalTitle}>Enter Category Name:</Text>
    <TextInput
      style={styles.input}
      placeholder="Category Name"
      onChangeText={setCategory}
      value={category}
    />
    <View style={styles.modalButtonContainer}>
      <TouchableOpacity style={styles.modalButton} onPress={handleAddCategory}>
        <Text style={styles.modalButtonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


   </SafeAreaView>
   
  )
}

export default Categories

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
    arrowBackIcon:{
        position:'absolute',
        left:8
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
      // fontWeight:'600',
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
    billTotal:{
      color:'hsl(0, 100%, 46%)',
      fontWeight:'700',
      fontSize:14.5,
      
    },
    billBottomText:{
      flex:1,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginTop:25,
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
    resetButton:{
        backgroundColor:'white',
        width:'100%',
        paddingVertical:15,
        marginVertical:5,
        borderRadius:20,
        borderWidth:1,
        borderColor:COLORS.primary,
    },
    saveText:{
        fontFamily:'Poppins-Regular',
        fontSize:18,
        color:'white',
        textAlign:'center'
    },
    resetText:{
        fontFamily:'Poppins-Regular',
        fontSize:18,
        color:COLORS.primary,
        textAlign:'center'
    },
    logoStyles:{
      height:35,
      width:35,
    },
    refreshButton: {
      backgroundColor: COLORS.primary,
     
      paddingVertical: 10,
      alignItems: 'center',
    },
    addButton: {
        // backgroundColor: COLORS.primary,
        paddingVertical: 10,
        alignItems: 'center',
        borderColor:'red',
        borderWidth:2,
        position:'absolute',
        bottom:10,
      },
      addButtonContainer: {
        // backgroundColor: COLORS.primary,
        // paddingVertical: 10,
        // alignItems: 'center',
        // borderColor:'red',
        // borderWidth:2,
        
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
   
 modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontFamily:'Poppins-Regular',
    marginBottom:5,
    fontSize:18,
    color:'white',
    textAlign:'center',
  },
  input: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
   
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    color: COLORS.primary,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: 200, 
  },
  modalButtonContainer: {
    flexDirection: 'row',
  },
  modalButton: {
    // backgroundColor: COLORS.SECONDARY,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, 
    margin: 5,
  },
  modalButtonText: {
    // color: COLORS.PRIMARY, 
    fontFamily: 'Poppins-Regular', 
  },
  modalText: {
    color: COLORS.primary, 
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginBottom: 5,
  },
  
})
