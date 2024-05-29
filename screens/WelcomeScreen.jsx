import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const customFont = Platform.select({
  ios: 'Poppins', // The font name for iOS (without .ttf)
  android: 'Poppins-Regular', // The file name for Android (with .ttf)
});
const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Let's Get Started !</Text>
      </View>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../assets/images/welcome.png')} style={styles.welcomeImage} />
        
      </View>
      <View style={styles.welcomeButtonView}>
        <TouchableOpacity style={styles.welcomeButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.welcomeButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.welcomeAlreadyText}>
          <Text style={{ color: 'white', paddingRight: 2, fontFamily:'Poppins-Regular' }}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#FFD700', fontFamily:'Poppins-Regular' }}> Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#044244',
    paddingBottom: 30,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 33,
    // fontWeight: 'bold',
    color: 'white',
    fontFamily:'Poppins-Medium'
  },
  welcomeImage: {
    height: 330,
    width: 330,
  },
  welcomeButtonView: {
    paddingTop: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#FFD700',
    width: '83%',
    marginHorizontal:20,
    borderRadius: 13,
    marginBottom:10,
  },
  welcomeButtonText: {
    fontSize: 18,
    top:1.5,
    color: '#044244',
    fontFamily:'Poppins-Medium',
  },
  welcomeAlreadyText: {
    flexDirection: 'row',
    // marginTop: 9,
    fontFamily:'Poppins-Medium',
  },
});
