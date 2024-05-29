import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SelectList } from 'react-native-dropdown-select-list'; // Import SelectList
import { COLORS } from '../assets/theme/index';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const calculateProductSalesData = (bills) => {
  const currentDate = new Date();
  const productSalesData = {};

  bills.forEach(bill => {
    const billDate = new Date(bill.createdAt);
    const dayDifference = Math.floor((currentDate - billDate) / (24 * 60 * 60 * 1000));

    if (dayDifference >= 0 && dayDifference < 5) {
      bill.items.forEach(item => {
        const productName = item.productName;
        const productPrice = parseFloat(item.productPrice);
        const quantity = parseFloat(item.quantity);

        if (!productSalesData[productName]) {
          productSalesData[productName] = Array(5).fill(0);
        }

        const dayIndex = 5 - dayDifference - 1;
        productSalesData[productName][dayIndex] += quantity * productPrice;
      });
    }
  });

  return productSalesData;
};

const LineChartProduct = ({bills}) => {
  const productSalesDatac = calculateProductSalesData(bills);

  const sortedProducts = Object.entries(productSalesDatac)
    .map(([productName, sales]) => ({
      productName,
      totalSales: sales.reduce((a, b) => a + b, 0)
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5)
    .map(entry => entry.productName);

  const [selectedProduct, setSelectedProduct] = useState(sortedProducts[0] || '');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');

  
  const onDataPointClick = ({ value, dataIndex }) => {
    setSelectedPoint(value);
    setSelectedDay(`Day ${dataIndex + 1}`);
    setPopupVisible(true);  

    setTimeout(() => {
      setPopupVisible(false);
    }, 2000);
  };
  useEffect(() => {
    console.log("Sorted Products:", sortedProducts);
    console.log("Selected Product:", selectedProduct);
    console.log("Product Sales Data:", productSalesDatac);
  }, [sortedProducts, selectedProduct, productSalesDatac]);
  
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.chartCard,
          { height: windowHeight * 0.35 * 1.3 },
          { width: windowWidth * 0.9 },
        ]}>
        {/* <View style={styles.chartTitleContainer}>
          <Text style={styles.chartTitle}>Products Sales Graph</Text>
        </View> */}
        <View style={styles.chartContainer}>
          <SelectList
            selected={selectedProduct}
            setSelected={setSelectedProduct}
            data={sortedProducts.map((product) => ({ key: product, value: product }))}
            fontFamily="lato"
            arrowicon={<FontAwesome name="chevron-down" size={12} color={'rgba(270,270,270,0.9)'} />}
            searchicon={<FontAwesome name="search" size={12} color={'black'} />}
            search={false}
            inputStyles={{ fontFamily: 'Poppins-Regular', color: 'rgba(270,270,270,0.9)' }}
            boxStyles={{ borderRadius: 0,marginBottom:6,height:45 }}
            dropdownTextStyles={{fontFamily: 'Poppins-Regular',height:16, color: 'rgba(270,270,270,0.9)' }}
            
            defaultOption={{ key: selectedProduct, value: selectedProduct }}
          />
          <LineChart
            data={{
              labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
              datasets: [{ data: productSalesDatac[selectedProduct] || [] }],
            }}
            fromZero={true}
            yAxisLabel=" $ "
            width={windowWidth * 0.9 - 15}
            height={windowHeight * 0.35 - 30}
            chartConfig={{
              backgroundGradientFrom: COLORS.primary,
              backgroundGradientTo: COLORS.primary,
              backgroundColor: COLORS.primary,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: '2',
                strokeWidth: '2',
                stroke: COLORS.secondary,
              },
            }}
            onDataPointClick={onDataPointClick}
            bezier={true}
          />
          {popupVisible && (
            <View style={styles.popupContainer}>
              <Text style={styles.popupText}>
                {selectedDay} | Sales: ${selectedPoint}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  chartCard: {
    elevation: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: windowHeight * 0.02,
    marginHorizontal: windowWidth * 0.05,
    padding: 10,
  },
  chartTitleContainer: {
    alignItems: 'center',
    marginTop: -6,
    marginBottom: 2,
  },
  chartTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  popupContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 10,
    bottom: 10,
    right: 10,
  },
  popupText: {
    color: 'white',
    fontSize: 14,
  },
});

export default LineChartProduct;
