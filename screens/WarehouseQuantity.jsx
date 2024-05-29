import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { listProducts, listWarehouseScans } from '../src/graphql/queries.js';
import { COLORS } from '../assets/theme/index.js';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

const  WarehouseQuantity = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const storeID = useSelector((state) => state.user.storeId);
  const client = generateClient();
  const getProductsByStoreIdQuery = /* GraphQL */ `
  query GetProductsByStoreId($storeId: ID!) {
    listProducts(filter: { 
      storeProductsId: { eq: $storeId },
      _deleted: { ne: true } 
    }) {
      items {
        id
        name
        barcode
        image
        price
        manufacturer
        category
        warehouseQuantity
        shelfQuantity
        warehouseInventoryLimit
        shelfInventoryLimit
        store {
          id
          name
        }
        createdAt
        updatedAt
        _version
        _deleted
        categoryProductId
      }
    }
  }
`;

const isFocused = useIsFocused();

useEffect(() => {
  if (isFocused) {
    fetchAllProducts();
  }
}, [isFocused,storeID]);

const fetchAllProducts = async () => {
  setLoading(true);
  try {
    const { data } = await client.graphql({
      query: getProductsByStoreIdQuery,
      variables: { storeId: storeID },
      filter: {
        _deleted: {
            ne: true
        }
      },
      authMode: 'apiKey',
    });

    const sortedProducts = data.listProducts.items.sort((a, b) => a.warehouseQuantity - b.warehouseQuantity);

    setProducts(sortedProducts);
  } catch (error) {
    console.log('Error fetching products:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAllProducts();
  }, [storeID]);

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
    <View style={styles.headerWrapper}>
      <Text style={styles.headerText}>Warehouse Quantity</Text>
    </View>
  </View>
      {loading ? (
         <View style={{flex:1,backgroundColor:COLORS.primary,justifyContent:'center',paddingHorizontal:25}}>
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
        
        
        <ScrollView contentContainerStyle={styles.scrollView}>
          {products.map((product, index) => (
            <View key={index} style={styles.productContainer}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.warehouseQuantity}>Warehouse Quantity: {product.warehouseQuantity}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  headerContainer:{
    flex:0,
    backgroundColor:COLORS.primary,
},
headerWrapper:{
    paddingVertical:10,
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
  scrollView: {
    padding: 20,
    alignItems: 'center',
  },
  productContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productName: {
    fontSize: 18,
    color: COLORS.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  warehouseQuantity: {
    fontSize: 16,
    color: 'gray',
    fontFamily: 'Poppins-Regular',
  },
});

export default WarehouseQuantity;
