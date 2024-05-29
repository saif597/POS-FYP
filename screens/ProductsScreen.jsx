import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  ScrollView,
} from 'react-native';
import { listProducts } from '../src/graphql/queries';
import { generateClient } from 'aws-amplify/api';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { connect, useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ProductsScreen = ({ route }) => {
  const client = generateClient();
  const [productsObj, setProductsObj] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = useSelector((state) => state.user.role);
  const storeID = useSelector((state) => state.user.storeId); 
  const storeName = useSelector((state) => state.user.storeName); 
  const storeCurrency  = useSelector(state => state.currency.value); 
    
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

  const fetchAllProducts = async () => {
    try {
      const { data } = await client.graphql({
        query: getProductsByStoreIdQuery,
        variables: {  storeId: storeID },
            filter: {
                _deleted: {
                    ne: true
                }
            },
        authMode: 'apiKey',
      });
      const { items } = data.listProducts;
      setProductsObj(items);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching products:', error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [storeID]);

  // useEffect(() => {
  //   productsObj.forEach((product) => {
  //     console.log(product);
  //     console.log('\n'); // Add an empty line between each product
  //   });
  //   console.log(
  //     'skrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'
  //   );
  // }, [productsObj]); // Log productsObj whenever it changes

  const navigation = useNavigation();
  const products = productsObj;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    console.log("Store",storeID);
    setFilteredProducts(products);
    const allCategories = Array.from(
      new Set(products.map((product) => product.category))
    );
    setFilteredCategories(allCategories);
  }, [products]);

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.brand?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);

    // Filter categories that have matching products
    const matchingCategories = Array.from(
      new Set(filtered.map((product) => product.category))
    );
    setFilteredCategories(matchingCategories);

    setIsSearchActive(query !== '');
  };

  const handleCancel = () => {
    setSearchQuery('');
    Keyboard.dismiss();
    setFilteredProducts(products);
    setFilteredCategories(
      Array.from(new Set(products.map((product) => product.category)))
    );
    setSelectedCategory('All');
    setIsSearchActive(false);
  };

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.navigate('Product', {
          item: item,
        })
      }
    >
      <View style={styles.productImageContainer}>
        {/* Image */}
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          // onError={(error) => console.log('Image loading error:', error)}
        />
      </View>
      <View style={styles.productDetails}>
        {/* Product Name */}
        <Text style={styles.productName}>{item.name}</Text>
        {/* Product Price */}
        <Text style={styles.productPrice}>{`${storeCurrency || '$'} ${item.price}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
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
      ) : (
        <>
          <View style={styles.searchBar}>
            <Ionicons
              name="search-outline"
              size={24}
              color={COLORS.primary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search here"
              placeholderTextColor={COLORS.primary}
              value={isSearchActive ? searchQuery : ''}
              onChangeText={(query) => {
                handleSearch(query);
                setIsSearchActive(query !== '');
              }}
            />
            {isSearchActive && (
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView style={styles.containerScrollView}>
  {filteredCategories.sort().map((category, index) => {
    
    const categoryProducts = filteredProducts.filter((product) => {
  
      if (category === 'Other') {
        return !product.category || !filteredCategories.includes(product.category);
      }
    
      return product.category === category;
    });

  
    if (categoryProducts.length > 0) {
      return (
        <View key={category + index}>
          <View style={styles.categoryTitleContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>
          </View>
          <View style={styles.categoryRow}>
          <FlatList
            data={categoryProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryCardList}
          />
          </View>
        </View>
      );
    }
    return null;
  })}
</ScrollView>

          <View style={styles.containerButton}>
          {userRole === 'GENERAL_MANAGER' && (
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={handleAddProduct}
            >
              <Text style={styles.buttonText}>Add Product</Text>
            </TouchableOpacity>
          )}
        </View>

        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  containerScrollView: {
    // marginBottom:50,
  },
  categoryRow: {
    backgroundColor: '#F6F6F6', 
    paddingTop: 15, // Vertical padding for the row
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Vertical margin for the row
    marginHorizontal: 13,
    width: '100%',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
  },

  categoryCardList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    textAlign: 'center',
    fontSize: 19,
    color: COLORS.primary,
    marginVertical: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: COLORS.primary,
    fontFamily: 'Poppins-Regular',
    top: 2,
  },
  cancelButton: {
    color: COLORS.primary,
    fontFamily: 'Poppins-SemiBold',
    right: 2,
    top: 1.5,
  },
  productCard: {
    width: 150,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 0,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: 'lightgray',
    elevation: 6,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    marginBottom: 15,
  },
  swipeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  productImageContainer: {
    width: '100%',
    height: '65%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productDetails: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
  },
  productPrice: {
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 5,
    zIndex: 3,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 17,
    top: 1.5,
    fontFamily: 'Poppins-SemiBold',
  },
  containerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
});

export default ProductsScreen;
