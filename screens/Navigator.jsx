import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../assets/theme/index.js';

const Navigator = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.buttonText}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Staff')}
      >
        <Text style={styles.buttonText}>Staff</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
     
     
      <View>
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('ConfirmBill')}>
          <Text style={styles.buttonText}>Confirm Bill</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('Receipt')}>
          <Text style={styles.buttonText}>Receipt</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('About')}>
          <Text style={styles.buttonText}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('Products List')}>
          <Text style={styles.buttonText}>Products List</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('Home2')}>
          <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('Stats')}>
          <Text style={styles.buttonText}>Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('Product')}>
          <Text style={styles.buttonText}>Product</Text>
      </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.primary, 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  historyButton: {
    backgroundColor: COLORS.primary // A different pleasing color
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Navigator;
