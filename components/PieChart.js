import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { COLORS } from '../assets/theme';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChartScreen = ({ bills }) => {
  const [chartData, setChartData] = useState([]);

  const cardHeight = windowHeight * 0.25; // 25% of window height
  const cardWidth = windowWidth * 0.9; // 90% of window width

  // Function to process bills and calculate top five products
  const calculateTopFiveProducts = (bills) => {
    const productCounts = {};

    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        const { productBillItemsId, productName, quantity } = item;
        if (productCounts[productBillItemsId]) {
          productCounts[productBillItemsId].quantity += quantity;
        } else {
          productCounts[productBillItemsId] = {
            name: productName,
            quantity,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            legendFontColor: '#FFFFF4',
          };
        }
      });
    });

    const sortedProducts = Object.values(productCounts).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    return sortedProducts.map((product) => ({
      name: product.name,
      population: product.quantity,
      color: product.color,
      legendFontColor: product.legendFontColor,
    }));
  };

  useEffect(() => {
    if (bills && bills.length > 0) {
      const topFiveProducts = calculateTopFiveProducts(bills);
      setChartData(topFiveProducts);
      console.log(chartData);
    }
  }, [bills]);

  return (
    <View style={styles.container}>
      <View style={[styles.chartCard, { height: cardHeight, width: cardWidth }]}>
        {/* <View style={styles.chartTitleContainer}>
          <Text style={styles.chartTitle}>Top Five Selling Products</Text>
        </View> */}
        <PieChart
          data={chartData}
          width={cardWidth}
          height={cardHeight}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.5,
            

          }}
          accessor="population"
          backgroundColor="transparent"
        />
      </View>
      {/* Add other components below the chart */}
      <View style={styles.bottomContent}>{/* Other components go here */}</View>
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
    marginBottom: -windowHeight * 0.02,
  },
  chartTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomContent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default ChartScreen;