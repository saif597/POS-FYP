import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {COLORS} from '../assets/theme/index';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// const transactionData = [10, 20, 15, 30, 25]; 

const TransactionsBarChart = ({bills}) => {
  const transactionData = Array(5).fill(0);

  const currentTime = new Date();
  bills.forEach(bill => {
    const billTime = new Date(bill.createdAt);
    const timeDiffMinutes = (currentTime - billTime) / (1000 * 60);
    if (timeDiffMinutes >= 0 && timeDiffMinutes < 300) {
      const hourIndex = Math.floor(timeDiffMinutes / 60);
      transactionData[4 - hourIndex] += 1;
    }
  });

  const cardHeight = windowHeight * 0.25; 
  const cardWidth = windowWidth * 0.9; 

  const getTimeLabel = hour => {
    hour=hour+1;
    const amPm = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour} ${amPm}`;
  };

  const labels = [];
  const currentHour = new Date().getHours(); 
  for (let i = currentHour - 5; i < currentHour; i++) {
    const hour = i < 0 ? 24 + i : i; 
    labels.push(getTimeLabel(hour));
  }

  return (
    <View style={styles.container}>
      <View
        style={[styles.chartCard, {height: cardHeight}, {width: cardWidth}]}>
        <View style={styles.chartTitleContainer}>
          <Text style={styles.chartTitle}></Text>
        </View>
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: transactionData,
                  colors: [
                    (opacity = 1) => '#FFD700',
                    (opacity = 1) => '#FFD700',
                    (opacity = 1) => '#FFD700',
                    (opacity = 1) => '#FFD700',
                    (opacity = 1) => '#FFD700',
                    (opacity = 1) => '#FFD700',
                  ],
                },
              ],
            }}
            showBarTops={true}
            width={cardWidth }
            showValuesOnTopOfBars={true}
            fromZero={true}
            withInnerLines={true}
            height={cardHeight - 10}
            withCustomBarColorFromData={true}
            flatColor={true}
            chartConfig={{
              backgroundGradientFrom:COLORS.primary,
              backgroundGradientTo: COLORS.barchart,
              backgroundColor: COLORS.secondary,
              decimalPlaces: 0,
              color: (opacity = 1) => "#686a6c",
              labelColor: (opacity = 1) => "#FFFFFF",
              propsForDots: {
                r: '2',
                strokeWidth: '2',
                stroke: COLORS.secondary,
              },
              propsForLabels:{
                alignmentBaseline:'after-edge',
              },
              propsForVerticalLabels:{
                alignmentBaseline:'after-edge'
              },
              barPercentage:0.45,
            }}
            bezier={true}
          />
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
    borderRadius: 8,
    marginHorizontal: windowWidth * 0.05, 
  },
  chartTitleContainer: {
    alignItems: 'center',
  },
  chartTitle: {
    color: "white", 
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'space-between',
    
  },
});

export default TransactionsBarChart;