import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../assets/theme/index.js';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';


const Receipt = () => {
  const navigation = useNavigation();
  const viewShotRef = useRef(null);
  const [capturedImageURI, setCapturedImageURI] = useState(null);

 
// Function to share the captured image
const shareImage2 = async () => {
  if (!capturedImageURI) {
    Alert.alert('Error', 'Please capture the receipt first!');
    return;
  }

  try {
    // Use react-native-share to handle the sharing
    await Share.open({
      url: capturedImageURI,
      type: 'image/jpeg', // Specify the content type
    });
  } catch (error) {
    Alert.alert('Error', 'Failed to share the image');
    console.error('Error sharing image:', error);
  }
};


  // Function to capture the view and set the image URI
  const captureView = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      setCapturedImageURI(uri);
      console.log(uri);
    } catch (error) {
      console.error('Error capturing view:', error);
      Alert.alert('Error', 'Failed to capture content');
    }
  };

  // Function to share the captured image
  const shareImage = async () => {
    if (!capturedImageURI) {
      Alert.alert('Error', 'Please capture the receipt first!');
      return;
    }

    try {
      await Share.share({
        message: 'Check out this receipt!',
        url: capturedImageURI,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the image');
      console.error('Error sharing image:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scrollView}>
      <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9, backgroundColor: '#FFFFFF' }}>
          <View style={[styles.headerContainer, { backgroundColor: '#FFFFFF' }]}> 
            <ScrollView style={styles.billContainer}>
              <ScrollView style={styles.wrapper}>
                <View style={styles.logo}>
                  <Image
                    style={styles.logoStyles}
                    source={require('../assets/images/logo7.png')}
                  />
                </View>
                <View style={styles.address}>
                  <Text style={styles.addressText}>
                    Shop 28, Yousuf Colony
                    {'\n'}
                    Chaklala Scheme 3, Rawalpindi
                  </Text>
                </View>
                <View style={styles.dashedLine} />
                <View style={styles.receipt}>
                  <View style={styles.header}>
                    <Text style={styles.headerText}>QTY</Text>
                    <Text style={styles.headerText}>ITEM</Text>
                    <Text style={styles.headerText}>PRICE</Text>
                    <Text style={styles.headerText}>TOTAL</Text>
                  </View>
                  {Array.from({ length: 15 }, (_, index) => (
                    <View style={styles.itemRow} key={index}>
                      <Text style={styles.itemText}>2</Text>
                      <Text style={styles.itemText}>Product A</Text>
                      <Text style={styles.itemText}>$10.00</Text>
                      <Text style={styles.itemText}>$20.00</Text>
                    </View>
                  ))}
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalText, styles.alignRight]}>TOTAL</Text>
                    <Text style={[styles.totalAmount, styles.alignRight]}>$35.00</Text>
                  </View>
                </View>
                <View style={styles.dashedLine} />
              </ScrollView>
            </ScrollView>
          </View>
        </ViewShot>
      </ScrollView>
      <View style={styles.footerContainer}>
        <View style={styles.footerWrapper}>
          <TouchableOpacity style={styles.confirmButton} onPress={captureView}>
            <Text style={styles.confirmText}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.confirmButton, { marginLeft: 10 }]} onPress={shareImage2}>
            <Text style={styles.confirmText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
  },
  footerContainer: {
    position: 'absolute', // Position the footer at the bottom
    bottom: 0, // Align the footer to the bottom
    width: '100%', // Make the footer full width
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 30,
    flex:1,
  
  },
  billContainer: {},
  logo: {
    alignItems: 'center',
  },
  logoStyles: {
    width: 60,
    height: 60,
  },
  address: {
    marginVertical: 10,
    textAlign: 'center',
  },
  addressText: {
    textAlign: 'center',
    color:'black'
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical: 10,
  },
  receipt: { marginVertical: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'black'
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  itemText: {
    flex: 1,
    textAlign: 'center',
    color:'black'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 25,
    marginTop: 10,
  },
  totalText: {
    flex: 0,
    fontWeight: 'bold',
    textAlign: 'right', // Align to the right
    marginRight: 10,
    color:'black'
  },
  totalAmount: {
    flex: 0,
    fontWeight: 'bold',
    textAlign: 'right', // Align to the right
    color:'black'
  },
  alignRight: {
    textAlign: 'right',
  },
  footerWrapper: {
    borderTopWidth: 1,
    borderColor: 'gray',
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    marginHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 10,
  },
  confirmText: {
    fontSize: 19,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    top: 2,
  },
  capturedImageContainer: {
    flex:0,
    width: '100%',
    height: '100%',
    borderWidth:1,
    backgroundColor:'red',
  },
});

export default Receipt;