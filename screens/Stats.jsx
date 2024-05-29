import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PieChartC from '../components/PieChart';
import SalesLineChart from '../components/SalesLineChart';
import TransactionsBarChart from '../components/TransactionsBarChart';
import LineChartProduct from '../components/LineChartProduct';
import {COLORS} from '../assets/theme';

const windowHeight = Dimensions.get('window').height;

const Stats = ({ route }) => {
  const {bills}=route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef(null);

  const chartComponents = [
    {name: 'Monthly Sales Chart', component: <SalesLineChart bills={bills} />},
    {name: 'Transactions in Last 5 hours', component: <TransactionsBarChart bills={bills}/>},
    {name: 'Top Five Selling Products', component: <PieChartC bills={bills}/>},
    // {name: 'Product Sales Graph', component: <LineChartProduct bills={bills}/>,},
  ];

  const filteredComponents = chartComponents.filter(component =>
    component.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const clearSearch = () => {
    setSearchText('');
    searchInputRef.current.focus();
  };

  const handleKeyboardDismiss = () => {
    Keyboard.dismiss();
    clearSearch();
  };

  React.useEffect(() => {
    if (bills) {
      setIsLoading(false);
    }
  }, [bills]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color={COLORS.primary} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor={COLORS.primary}
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          {searchText !== '' && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons
                name="close-circle-outline"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* <Text style={styles.chartHeading}>GRAPHS</Text> */}
      {filteredComponents.map((component, index) => (
        <View
          key={index}
          style={[styles.chartContainer, {marginVertical:10}]}>
           <Text style={styles.chartHeading}>{component.name}</Text>
          {component.component}
        </View>
      ))}
      {searchText !== '' && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleKeyboardDismiss}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingContainer:{
    flex:0,
    justifyContent:'center',
    alignItems:'center'
  },
  chartContainer: {
    width: '100%',
    
  },
  chartHeading: {
    fontFamily:'Poppins-Regular',
    color:'black',
    fontSize:15,

  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    top:2,
    color: COLORS.primary,
    paddingHorizontal: 10,
    width: '100%',
    fontFamily:'Poppins-Regular'
  },
  clearButton: {
    padding: 10, // Increase the padding to make the touchable area larger
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Stats;