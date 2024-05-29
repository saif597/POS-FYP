import React, { useEffect, useState } from 'react';
import { Modal, View, Text,TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { COLORS } from '../assets/theme/index.js';
import { SelectList } from 'react-native-dropdown-select-list';
import Ionic from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { getStore } from '../src/graphql/queries.js';
import { updateCurrency } from '../store/currencySlice.js';
import { generateClient } from 'aws-amplify/api';
import { updateStore } from '../src/graphql/mutations.js';

const ThemeModal = ({ visible, onClose, type, currency  }) => {
  const client = generateClient();
  const dispatch = useDispatch();
  const [saveStatus, setSaveStatus] = useState('idle'); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isBillCompletionNotificationEnabled, setIsBillCompletionNotificationEnabled] = useState(false);
  const [storeVersion, setStoreVersion] = useState('');
  const storeID = useSelector((state) => state.user.storeId);
  const storeCurrency  = useSelector(state => state.currency.value); 
  const [currencyInput, setCurrencyInput] = useState(currency);
  
  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
          const response = await client.graphql({
              query: getStore,
              variables: { id: storeID },
              authMode: 'apiKey',
          });
          setStoreVersion(response.data.getStore._version);
          setCurrencyInput(response.data.getStore.currency);
          console.log("Version",response.data.getStore._version);
      } catch (error) {
          // console.error('Error fetching store details:', error);
          // Alert.alert('Error', 'Failed to fetch store details.');
      }
  };
      fetchStoreDetails();
    }, [storeID]);
 
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const toggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  const toggleBillCompletionNotification = () => {
    setIsBillCompletionNotificationEnabled(!isBillCompletionNotificationEnabled);
  };
  
  const updateStoreCurrency = async (currencyInput, storeVersion) => {
    try {
      setSaveStatus('loading');
      const updateResponse = await client.graphql({
        query: updateStore,
        variables: {
          input: {
            id: storeID,
            currency: currencyInput,
            _version: storeVersion,
          },
        },
        authMode: 'apiKey',
      });
      console.log("Currency updated successfully", updateResponse);
      dispatch(updateCurrency(currencyInput));
      setSaveStatus('saved');
      setTimeout(() => {
        onClose(); 
      }, 1500);

    } catch (error) {
      console.error("Error updating store currency:", error);
      setSaveStatus('idle');
    }
  };

  const handleSaveCurrency = () => {
    updateStoreCurrency(currencyInput, storeVersion);
  };

  const renderContent = () => {
    if (type === 'theme') {
      return (
        <View>
          <Text style={styles.modalTitle}>Select Theme</Text>
          <View style={styles.themeOption}>
            <Text style={styles.themeText}>
              {isDarkMode ? 'Dark Theme' : 'Light Theme'}
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              thumbColor={COLORS.primary}
              trackColor={{ false: 'lightgray', true: COLORS.primary }}
            />
          </View>
        </View>
      );
    } else if (type === 'currency') {
      return (
        <View>
          <Text style={styles.modalTitle}>Currency</Text>
          <TextInput
            style={styles.currencyInput}
            value={currencyInput}
            onChangeText={setCurrencyInput}
            placeholder="Enter currency symbol"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveCurrency}>
          <Text style={styles.saveButtonText}>
              {saveStatus === 'idle' ? 'Save' : saveStatus === 'loading' ? 'Loading...' : 'Saved'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (type === 'notifications') {
      return (
        <View>
          <Text style={styles.modalTitle}>Notification Settings</Text>
          <View style={styles.notificationOption}>
            <Text style={styles.notificationText}>Enable Notifications</Text>
            <Switch
              value={isNotificationsEnabled}
              onValueChange={toggleNotifications}
              thumbColor={COLORS.primary}
              trackColor={{ false: 'lightgray', true: COLORS.primary }}
            />
          </View>
          <View style={styles.notificationOption}>
            <Text style={styles.notificationText}>Bill Completion Notifications</Text>
            <Switch
              value={isBillCompletionNotificationEnabled}
              onValueChange={toggleBillCompletionNotification}
              thumbColor={COLORS.primary}
              trackColor={{ false: 'lightgray', true: COLORS.primary }}
            />
          </View>
        </View>
      );
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {renderContent()}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 17,
    top: 1,
    marginBottom: 20,
    color: COLORS.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  themeText: {
    fontSize: 16,
    top: 1,
    color: COLORS.primary,
    fontFamily: 'Poppins-Regular',
  },
  currencyInput: {
    // Style for the currency input field
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  saveButton: {
    // Style for the save button
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    textAlign: 'center',
    top:1,
    fontFamily: 'Poppins-Regular',
    color: 'white',
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 16,
    top: 1,
    color: COLORS.primary,
    fontFamily: 'Poppins-Regular',
  },
  picker: {
    height: 50,
  },
  closeButton: {
    marginTop:13,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    top: 1,
  },
});

export default ThemeModal;
