import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, SafeAreaView,
  TouchableOpacity, ActivityIndicator, Modal,Alert
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native';
import { generateClient } from 'aws-amplify/api';
import { listBillItems, listBills, listProducts, listPurchaseOrders, listWarehouseScans } from '../src/graphql/queries.js';
import { DataTable } from 'react-native-paper';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';
import { useSelector } from 'react-redux';
import { Image } from 'react-native-svg';

const Reports = () => {
  const storeID = useSelector((state) => state.user.storeId);
  const [loading, setLoading] = useState(true);
  const [allBillItems, setAllBillItems] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topHours, setTopHours] = useState([]);
  const [purchasersList,  setPurchasersList]=useState([]);
  const [isProductsModalVisible, setIsProductsModalVisible] = useState(false);
  const [isHoursModalVisible, setIsHoursModalVisible] = useState(false);
  const [cashiersList, setCashiersList] = useState([]);
  const [isCashiersModalVisible, setIsCashiersModalVisible] = useState(false);
  const [isPurchasersModalVisible, setIsPurchasersModalVisible] = useState(false);
  const [productsNeedingRestock, setProductsNeedingRestock] = useState([]);
  const [isRestockModalVisible, setIsRestockModalVisible] = useState(false);
  const [warehouseScansSummary, setWarehouseScansSummary] = useState([]);
  const [isWarehouseScansModalVisible, setIsWarehouseScansModalVisible] = useState(false);
  const [categorySalesSummary, setCategorySalesSummary] = useState([]);
  const [isCategorySalesModalVisible, setIsCategorySalesModalVisible] = useState(false);
  const [capturedImageURI, setCapturedImageURI] = useState('');
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [revenueByWeek, setRevenueByWeek] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [isRevenueModalVisible, setIsRevenueModalVisible] = useState(false);
  const storeCurrency  = useSelector(state => state.currency.value);  

  const viewShotRef = useRef(null);
  const navigation = useNavigation();
  const client = generateClient();

  
const captureView = async () => {
    try {
        const uri = await viewShotRef.current.capture();
        setCapturedImageURI(uri);
        shareImage(uri);
    } catch (error) {
        // console.error('Error capturing view:', error);
        // Alert.alert('Error', 'Failed to capture content');
    }
};

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

const listBillItemsByStoreId = /* GraphQL */ `
  query ListBillItemsByStoreId(
    $storeId: ID!,
    $limit: Int,
    $nextToken: String
  ) {
    listBillItems(
      filter: {
        storeBillItemsId: { eq: $storeId },
        _deleted: { ne: true }
      },
      limit: $limit,
      nextToken: $nextToken
    ) {
      items {
        id
        productName
        quantity
        productPrice
        subtotal
        category
        manufacturer
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeBillItemsId
        productBillItemsId
        billItemsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;


const shareImage = async (uri) => {
    try {
        let imagePath = null;
        const fileName = 'purchase_order.jpg';
        const newPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
        await RNFS.copyFile(uri, newPath);
        imagePath = `file://${newPath}`;

        const shareResponse = await Share.open({ url: imagePath });
        console.log('Share Response:', shareResponse);
    } catch (error) {
        // Alert.alert('Error', 'Failed to share the image');
        // console.error('Error sharing image:', error);
    }
};

const formatHourRange = (hour) => {
  hour = typeof hour === 'string' ? parseInt(hour, 10) : hour;

  const startHour = hour % 12 === 0 ? 12 : hour % 12;
  const startAmPm = hour < 12 || hour === 24 ? 'AM' : 'PM';

  let endHour = (hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12;
  let endAmPm = (hour + 1) < 12 || (hour + 1) === 24 ? 'AM' : 'PM';

  if (hour === 23) {
    endHour = 12;
    endAmPm = 'AM';
  }

  return `${startHour}:00 ${startAmPm} - ${endHour}:00 ${endAmPm}`;
};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const billItemsResponse = await client.graphql({
          query: listBillItemsByStoreId,
          variables: {  storeId: storeID },
        filter: {
            _deleted: {
                ne: true
            },
            status: { eq: 'PAID' } 
        },    
          authMode: 'apiKey',
        });
        setAllBillItems(billItemsResponse.data.listBillItems.items);
  
        const purchaseOrdersResponse = await client.graphql({
          query: getPurchaseOrdersByStoreId, 
          variables: {  storeId: storeID },
          filter: {
              _deleted: {
                  ne: true
              },
          },    
          authMode: 'apiKey',
        });
        processPurchaseOrders(purchaseOrdersResponse.data.listPurchaseOrders.items);

        const warehouseScansResponse = await client.graphql({
            query: getWarehouseScansByStoreId,
            variables: {  storeId: storeID },
            filter: {
                _deleted: {
                    ne: true
                },
            },
            authMode: 'apiKey',
          });
        processWarehouseScans(warehouseScansResponse.data.listWarehouseScans.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [storeID]);

  const calculateRevenueOverTime = () => {
    let dailyRevenue = {};
    
    allBillItems.forEach(item => {
      const date = new Date(item.createdAt).toISOString().slice(0, 10);
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = 0;
      }
      dailyRevenue[date] += item.subtotal; 
    });
  
    const sortedDailyRevenue = Object.entries(dailyRevenue)
      .map(([date, totalRevenue]) => ({ date, totalRevenue }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  
    setRevenueByDay(sortedDailyRevenue);
  };
  
  const analyzeCategorySales = () => {
    const salesByCategory = allBillItems.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += item.subtotal; 
      return acc;
    }, {});
  
    const categorySalesArray = Object.entries(salesByCategory)
      .map(([categoryName, totalSales]) => ({ categoryName, totalSales }))
      .sort((a, b) => b.totalSales - a.totalSales);
  
    setCategorySalesSummary(categorySalesArray);
  };
  
  const processWarehouseScans = (warehouseScans) => {
    const scanCounts = warehouseScans.reduce((acc, scan) => {
      if (!acc[scan.productName]) {
        acc[scan.productName] = 0;
      }
      acc[scan.productName]++;
      return acc;
    }, {});
  
    const scansSummaryArray = Object.entries(scanCounts)
      .map(([productName, count]) => ({ productName, count }))
      .sort((a, b) => b.count - a.count);
  
    setWarehouseScansSummary(scansSummaryArray);
  };
  
  const fetchProductsNeedingRestock = async () => {
    setLoading(true);
    try {
      const productsResponse = await client.graphql({
        query: getProductsByStoreIdQuery,
        variables: {  storeId: storeID },
            filter: {
                _deleted: {
                    ne: true
                },
            },
        authMode: 'apiKey',
      });
      const products = productsResponse.data.listProducts.items
  
      const restockNeeded = products.filter(product => {
        const warehouseNeedsRestock = product.warehouseQuantity <= product.warehouseInventoryLimit;
        const shelfNeedsRestock = product.shelfQuantity <= product.shelfInventoryLimit;
        return warehouseNeedsRestock || shelfNeedsRestock;
      });
  
      setProductsNeedingRestock(restockNeeded);
    } catch (error) {
      console.error('Error fetching products needing restock:', error);
    } finally {
      setLoading(false);
    }
    setIsRestockModalVisible(!isRestockModalVisible);
  };

  const processPurchaseOrders = (purchaseOrders) => {
    const ordersByPurchaser = purchaseOrders.reduce((acc, order) => {
      if (!acc[order.purchaser]) {
        acc[order.purchaser] = { purchaserName: order.purchaserName, count: 0 };
      }
      acc[order.purchaser].count += 1;
      return acc;
    }, {});
  
    const sortedPurchasers = Object.entries(ordersByPurchaser)
      .map(([purchaserId, { purchaserName, count }]) => ({
        purchaserId,
        purchaserName,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  
    setPurchasersList(sortedPurchasers);
  };

  
  const analyzeData = () => {
    const salesByProduct = allBillItems.reduce((acc, sale) => {
      if (!acc[sale.productName]) {
        acc[sale.productName] = 0;
      }
      acc[sale.productName] += sale.quantity;
      return acc;
    }, {});
    const topProductsArray = Object.entries(salesByProduct)
      .map(([productName, totalSold]) => ({ productName, totalSold }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);
    setTopProducts(topProductsArray);

    const salesByHour = allBillItems.reduce((acc, sale) => {
      const hour = new Date(sale.createdAt).getUTCHours();
      if (!acc[hour]) {
        acc[hour] = 0;
      }
      acc[hour] += sale.quantity;
      return acc;
    }, {});
    const topHoursArray = Object.entries(salesByHour)
      .map(([hour, totalSold]) => ({ hour, totalSold }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);
    setTopHours(topHoursArray);
  };

  const fetchCashiersWithMostBills = async () => {
    setLoading(true);
    try {
      const response = await client.graphql({
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
      const bills = response.data.listBills.items;
      console.log("Bills",bills);
      const billsByCashier = bills.reduce((acc, bill) => {
        const { cashier, cashierName } = bill;
        if (!acc[cashier]) {
          acc[cashier] = { cashierName, count: 0 };
        }
        acc[cashier].count += 1;
        return acc;
      }, {});

      const sortedCashiers = Object.entries(billsByCashier)
        .map(([cashierId, { cashierName, count }]) => ({
          cashierId,
          cashierName,
          count,
        }))
        .sort((a, b) => b.count - a.count);
  
      setCashiersList(sortedCashiers);
    } catch (error) {
      console.error('Error fetching cashiers with most bills:', error);
    } finally {
      setLoading(false);
    }
    setIsCashiersModalVisible(true);
  };
  

  useEffect(() => {
    if (!loading) {
      analyzeData();
      analyzeCategorySales();
      calculateRevenueOverTime();
    }
  }, [allBillItems, loading,storeID]);

  return (
    <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.arrowBack} onPress={() => navigation.goBack()}>
            <Ionic size={22} color='white' name='chevron-back-outline' />
          </TouchableOpacity>
          <Text style={styles.cashierHeading}>Sales Analysis</Text>
        </View>
      </SafeAreaView>
      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={() => setIsProductsModalVisible(!isProductsModalVisible)}>
          <Text style={styles.confirmText}>Top Sold Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={() => setIsHoursModalVisible(!isHoursModalVisible)}>
          <Text style={styles.confirmText}>Top Sales Hours</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={fetchCashiersWithMostBills}>
            <Text style={styles.confirmText}>Cashiers With Most Bills</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={() => setIsPurchasersModalVisible(true)}>
        <Text style={styles.confirmText}>Purchasers With Most POs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={fetchProductsNeedingRestock}>
            <Text style={styles.confirmText}>Products Needing Restock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={() => setIsWarehouseScansModalVisible(!isWarehouseScansModalVisible)}>
            <Text style={styles.confirmText}>Warehouse Scans Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={() => setIsCategorySalesModalVisible(!isCategorySalesModalVisible)}>
        <   Text style={styles.confirmText}>Category Sales Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={() => setIsRevenueModalVisible(!isRevenueModalVisible)}>
            <Text style={styles.confirmText}>Revenue Over Time</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <>
            <Modal
              animationType="slide"
              transparent={false}
              visible={isProductsModalVisible}
              onRequestClose={() => setIsProductsModalVisible(!isProductsModalVisible)}
            >
              <SafeAreaView style={{flex: 1,}}>
            
              <ViewShot ref={viewShotRef} style={{ backgroundColor:'white',flex:1}} options={{ format: 'jpg', quality: 0.9, backgroundColor: 'white'}}>
              <Text style={styles.modalHeading}>Top Sold Products</Text>
                <ScrollView style={styles.scrollView}>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title>Product Name</DataTable.Title>
                      <DataTable.Title numeric>Total Sold</DataTable.Title>
                    </DataTable.Header>
                    {topProducts.map((product, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell>{product.productName}</DataTable.Cell>
                        <DataTable.Cell numeric>{product.totalSold}</DataTable.Cell>
                      </DataTable.Row>
                    ))}
                  </DataTable>
                </ScrollView>
                </ViewShot>
                <View style={{flex:0,justifyContent:'center',alignItems:'center',marginVertical:10}}>            
                <TouchableOpacity style={styles.addButton} onPress={captureView}>
                            <Text style={styles.addText}>Share</Text>
                    </TouchableOpacity>    
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setIsProductsModalVisible(!isProductsModalVisible)}
                >
                  <Text style={styles.addText}>Close</Text>
                </TouchableOpacity>
                </View>
              </SafeAreaView>
            </Modal>

            <Modal
              animationType="slide"
              transparent={false}
              visible={isHoursModalVisible}
              onRequestClose={() => setIsHoursModalVisible(!isHoursModalVisible)}
            >
              <SafeAreaView style={{flex: 1}}>
              <ViewShot ref={viewShotRef} style={{ backgroundColor:'white',flex:1}} options={{ format: 'jpg', quality: 0.9, backgroundColor: 'white'}}>
              
              <Text style={styles.modalHeading}>Top Hours for Sales</Text>

                <ScrollView style={styles.scrollView}>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title>Hour</DataTable.Title>
                      <DataTable.Title numeric>Total Sales</DataTable.Title>
                    </DataTable.Header>
                    {topHours.map((item, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell>{formatHourRange(item.hour)}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.totalSold}</DataTable.Cell>
                      </DataTable.Row>
                    ))}

                  </DataTable>
                </ScrollView>
                </ViewShot>
                <View style={{flex:0,justifyContent:'center',alignItems:'center',marginVertical:10}}>            
                <TouchableOpacity style={styles.addButton} onPress={captureView}>
                            <Text style={styles.addText}>Share</Text>
                    </TouchableOpacity>    
                   <TouchableOpacity
                    style={styles.addButton}
                  onPress={() => setIsHoursModalVisible(!isHoursModalVisible)}
                >
                   <Text style={styles.addText}>Close</Text>
                </TouchableOpacity>
                </View>
                
             
              </SafeAreaView>
            </Modal>

            <Modal
      animationType="slide"
      transparent={false}
      visible={isCashiersModalVisible}
      onRequestClose={() => setIsCashiersModalVisible(false)}
    >
      <SafeAreaView style={{flex: 1}}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
            <ViewShot ref={viewShotRef} style={{ backgroundColor:'white',flex:1}} options={{ format: 'jpg', quality: 0.9, backgroundColor: 'white'}}>
           
           <Text style={styles.modalHeading}>Cashier With Most Bills</Text>
          <ScrollView style={styles.scrollView}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Cashier Name</DataTable.Title>
                <DataTable.Title numeric>Bills Generated</DataTable.Title>
              </DataTable.Header>
              {cashiersList.map((cashier, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{cashier.cashierName}</DataTable.Cell>
                  <DataTable.Cell numeric>{cashier.count}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
          </ViewShot>
        )}
        <View style={{flex:0,justifyContent:'center',alignItems:'center',marginVertical:10}}> 
                    <TouchableOpacity style={styles.addButton} onPress={captureView}>
                            <Text style={styles.addText}>Share</Text>
                    </TouchableOpacity>           
                    <TouchableOpacity style={styles.addButton} onPress={() => setIsCashiersModalVisible(false)}>
                        <Text style={styles.addText}>Close</Text>
                    </TouchableOpacity>
    </View>
      </SafeAreaView>
    </Modal>

    <Modal
    animationType="slide"
    transparent={false}
    visible={isPurchasersModalVisible}
    onRequestClose={() => setIsPurchasersModalVisible(false)}>
        <SafeAreaView style={{flex: 1}}>
        <ViewShot ref={viewShotRef} style={{ backgroundColor:'white',flex:1}} options={{ format: 'jpg', quality: 0.9, backgroundColor: 'white'}}>
        <Text style={styles.modalHeading}>Purchasers with Most POs</Text>
            <ScrollView style={styles.scrollView}>
            <DataTable>
                <DataTable.Header>
                <DataTable.Title>Purchaser Name</DataTable.Title>
                <DataTable.Title numeric>Orders Created</DataTable.Title>
                </DataTable.Header>
                {purchasersList.map((purchaser, index) => (
                <DataTable.Row key={index}>
                    <DataTable.Cell>{purchaser.purchaserName}</DataTable.Cell>
                    <DataTable.Cell numeric>{purchaser.count}</DataTable.Cell>
                </DataTable.Row>
                ))}
            </DataTable>
            </ScrollView>
            </ViewShot>
            <View style={{flex:0,justifyContent:'center',alignItems:'center',marginVertical:10}}> 
                    <TouchableOpacity style={styles.addButton} onPress={captureView}>
                            <Text style={styles.addText}>Share</Text>
                    </TouchableOpacity>           
                    <TouchableOpacity style={styles.addButton} onPress={() => setIsPurchasersModalVisible(false)}>
                        <Text style={styles.addText}>Close</Text>
                    </TouchableOpacity>
    </View>
        </SafeAreaView>
    </Modal>

    <Modal
    animationType="slide"
    transparent={false}
    visible={isRestockModalVisible}
    onRequestClose={() => setIsRestockModalVisible(false)}
    >
        <SafeAreaView style={{ flex: 1 }}>
        <ViewShot ref={viewShotRef} style={{ backgroundColor:'white',flex:1}} options={{ format: 'jpg', quality: 0.9, backgroundColor: 'white'}}>
        <Text style={styles.modalHeading}>Products Needing Restock</Text>
            <ScrollView style={styles.scrollView}>
            <DataTable>
                <DataTable.Header>
                <DataTable.Title>Product Name</DataTable.Title>
                <DataTable.Title numeric>Warehouse Qty</DataTable.Title>
                <DataTable.Title numeric>Shelf Qty</DataTable.Title>
                </DataTable.Header>
                {productsNeedingRestock.map((product, index) => (
                <DataTable.Row key={index}>
                    <DataTable.Cell>{product.name}</DataTable.Cell>
                    <DataTable.Cell numeric>{product.warehouseQuantity}</DataTable.Cell>
                    <DataTable.Cell numeric>{product.shelfQuantity}</DataTable.Cell>
                </DataTable.Row>
                ))}
            </DataTable>
            </ScrollView>
            </ViewShot>
            <View style={{flex:0,justifyContent:'center',alignItems:'center',marginVertical:10}}> 
                    <TouchableOpacity style={styles.addButton} onPress={captureView}>
                            <Text style={styles.addText}>Share</Text>
                    </TouchableOpacity>           
                    <TouchableOpacity style={styles.addButton} onPress={() => setIsRestockModalVisible(false)}>
                        <Text style={styles.addText}>Close</Text>
                    </TouchableOpacity>
    </View>
        </SafeAreaView>
    </Modal>
    
<Modal
  animationType="slide"
  transparent={false}
  visible={isWarehouseScansModalVisible}
  onRequestClose={() => setIsWarehouseScansModalVisible(false)}
>
    
  <SafeAreaView style={{ flex: 1 }}>
  <ViewShot ref={viewShotRef} style={{ backgroundColor:'white',flex:1}} options={{ format: 'jpg', quality: 0.9, backgroundColor: 'white'}}>
  <Text style={styles.modalHeading}>Most Warehouse Scans</Text>
    <ScrollView style={styles.scrollView}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Product Name</DataTable.Title>
          <DataTable.Title numeric>Scan Count</DataTable.Title>
        </DataTable.Header>
        {warehouseScansSummary.map((item, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{item.productName}</DataTable.Cell>
            <DataTable.Cell numeric>{item.count}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
    </ViewShot>
    <View style={{flex:0,justifyContent:'center',alignItems:'center',marginVertical:10}}> 
                    <TouchableOpacity style={styles.addButton} onPress={captureView}>
                            <Text style={styles.addText}>Share</Text>
                    </TouchableOpacity>           
                    <TouchableOpacity style={styles.addButton} onPress={() => setIsWarehouseScansModalVisible(false)}>
                        <Text style={styles.addText}>Close</Text>
                    </TouchableOpacity>
    </View>
  </SafeAreaView>
</Modal>
<Modal
  animationType="slide"
  transparent={false}
  visible={isCategorySalesModalVisible}
  onRequestClose={() => setIsCategorySalesModalVisible(false)}
>
    
  <SafeAreaView style={{ flex: 1 }}>
  <ViewShot ref={viewShotRef} style={{ backgroundColor:'white',flex:1}} options={{ format: 'jpg', quality: 0.9, backgroundColor: 'white'}}>
  <Text style={styles.modalHeading}>Category with Most Sales</Text>
    <ScrollView style={styles.scrollView}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Category Name</DataTable.Title>
          <DataTable.Title numeric>Total Sales</DataTable.Title>
        </DataTable.Header>
        {categorySalesSummary.map((category, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{category.categoryName}</DataTable.Cell>
            <DataTable.Cell numeric>{`${storeCurrency || '$'} ${category.totalSales.toFixed(2)}`}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
    </ViewShot>
    <View style={{flex:0,justifyContent:'center',alignItems:'center',marginVertical:10}}> 
                    <TouchableOpacity style={styles.addButton} onPress={captureView}>
                            <Text style={styles.addText}>Share</Text>
                    </TouchableOpacity>           
                    <TouchableOpacity style={styles.addButton} onPress={() => setIsCategorySalesModalVisible(false)}>
                        <Text style={styles.addText}>Close</Text>
                    </TouchableOpacity>
    </View>
  </SafeAreaView>
</Modal>
    
<Modal
  animationType="slide"
  transparent={false}
  visible={isRevenueModalVisible}
  onRequestClose={() => setIsRevenueModalVisible(false)}
>
<ViewShot ref={viewShotRef} style={{ backgroundColor:'white',flex:1}} options={{ format: 'jpg', quality: 0.9, backgroundColor: 'white'}}>
<Text style={styles.modalHeading}>Revenue Over Time</Text>
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.scrollView}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title numeric>Total Revenue</DataTable.Title>
        </DataTable.Header>
        {revenueByDay.map(({ date, totalRevenue }, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{date}</DataTable.Cell>
            <DataTable.Cell numeric>{`${storeCurrency || '$'} ${totalRevenue.toFixed(2)}`}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
    
  </SafeAreaView>
  </ViewShot>
  <View style={{flex:0,justifyContent:'center',alignItems:'center',marginVertical:10}}> 
                    <TouchableOpacity style={styles.addButton} onPress={captureView}>
                            <Text style={styles.addText}>Share</Text>
                    </TouchableOpacity>           
                    <TouchableOpacity style={styles.addButton} onPress={() => setIsRevenueModalVisible(false)}>
                        <Text style={styles.addText}>Close</Text>
                    </TouchableOpacity>
            </View>
</Modal>
          </>
        )}
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
        // flex:1,
    },
    headerContainer:{
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:40,
        borderBottomLeftRadius:30,
    },
    cashierHeading:{
        color:'white',
        fontSize:20,
        fontFamily:'Poppins-Regular',
    },
    arrowBack:{
        position:'absolute',
        left:10,
        
    },
    scrollView:{
     flex:0,
    },
    listContainer:{
        flex:4.5,
        borderTopRightRadius:50,
        borderTopLeftRadius:50,
        backgroundColor:'rgba(240, 240, 240,4)',
        paddingHorizontal:20,
        paddingBottom:20,
        paddingVertical:20,
        justifyContent:'center',
        alignItems:'center'
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
   borderWidth:1,
   borderColor:'lightgray',
        // marginVertical:15,
        marginTop:25,
        // marginHorizontal:25,
        paddingVertical:15,
        paddingHorizontal:10,
        width:'100%',
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
        justifyContent:'space-around',
        bottom:1,
      },
      intro:{
        flexDirection:'row'
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
      dateContainer: {
        marginTop:30,
        left: 8,

    },
    dateText: {
        fontSize: 13,
        color: COLORS.primary,
        fontFamily: 'Poppins-SemiBold',
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
        top:4,
    
      },
        quantity:{
        color:'red',
        fontFamily:'Poppins-SemiBold',
        fontSize:20,
       
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
        backgroundColor:'white',
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        width:300,
        marginHorizontal:10,
        paddingVertical:8,
        borderRadius:25,
        marginVertical:10,
        borderWidth:1,
        borderColor:COLORS.primary,
    },
    confirmText:{
        fontSize:18,
        color:COLORS.primary,
        fontFamily:'Poppins-Regular',
        top:2,
    },
    modalHeading:{
        fontSize:20,
        color:COLORS.primary,
        fontFamily:'Poppins-SemiBold',
        top:2,
        textAlign:'center',
        marginVertical:10
    },
    addButton:{
        backgroundColor:COLORS.primary,
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        width:250,
        marginHorizontal:10,
        paddingVertical:8,
        borderRadius:25,
        paddingHorizontal:10,
        marginBottom:10

    },
    addText:{
        fontSize:18,
        color:'white',
        fontFamily:'Poppins-Regular',
        top:2,
    }
})
export default Reports;