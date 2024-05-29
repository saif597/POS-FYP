import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, View, TextInput, Keyboard, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionic from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../assets/theme/index.js';
import { useForm, Controller,reset } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { generateClient } from 'aws-amplify/api';
import { createStore, createUser } from '../src/graphql/mutations.js';
const ConfirmSignUp = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const client = generateClient();
  const { username,phonenumber,userId,storename } = route.params;
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeCheck, setCodeCheck] = useState(false);
  const [resendCode, setResendCode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { handleSubmit, control, formState: { errors }, reset } = useForm(); 

  const onConfirmPressed = async (username, code) => {
    setCodeCheck(true);
    Keyboard.dismiss();
    setLoading(true);
    
    try {
      const confirmationResponse=await confirmSignUp({ username, confirmationCode: code });
      console.log('User confirmed successfully');
      const storeData={
        name:storename,
      }
      const createStoreResponse = await client.graphql({
        query: createStore,
        variables: { input: storeData },
        authMode: 'apiKey',
      });
      console.log("Creating store in DB",  createStoreResponse.data.createStore.id);
      const userInput = {
        userId: userId,
        username: username,
        phonenumber: phonenumber,
        role: 'GENERAL_MANAGER',
        storeUsersId: createStoreResponse.data.createStore.id
      };
  
      console.log("Creating user in DB", userInput);
      const createUserResponse = await client.graphql({
        query: createUser,
        variables: { input: userInput },
        authMode: 'apiKey',
      });
  
      console.log('User created:', createUserResponse);
      
      // const newStore = {
      //   name: storeName,
      // };
      // const createStoreResponse = await client.graphql({
      //   query: createStore,
      //   variables: { input: newStore},
      //   authMode: 'apiKey',
      // });
      // console.log('Store Created Successfully',createStoreResponse);
      setModalMessage('Account Created Successfully');
      setModalVisible(true);
      setConfirmationCode(null);
      reset();
    } catch (error) {
      console.error('Error confirming sign up', error);
      setModalMessage('Incorrect Code Entered');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const onResendPress = async (username) => {
    try {
      await resendSignUpCode({ username });
      setModalMessage('Code Resent Successfully');
      setModalVisible(true);
      setResendCode(true);
    } catch (error) {
      console.error('Error resending confirmation code', error);
      Alert.alert('Error', error.message);
    }
  };

  const onSignInPress = () => {
    navigation.navigate('Login');
  };

  const closeModal = () => {
    if (resendCode) {
      setModalVisible(false);
      setConfirmationCode('');
      setResendCode(false);
    } else if (modalMessage === 'Account Created Successfully') {
      navigation.navigate('Login');
      setModalVisible(false);
      setConfirmationCode(null);
    } else {
      setModalVisible(false);
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, marginTop: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <TouchableOpacity style={styles.arrowLeftContainer} onPress={() => navigation.goBack()}>
            <Ionic size={24} style={{ right: 5 }} color={COLORS.primary} name="chevron-back-outline" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={styles.content}>
        <Text style={styles.title}>Confirm your email</Text>
        <Text style={styles.subtitle}>Please enter the confirmation code sent to your email.</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Confirmation Code"
          onChangeText={setConfirmationCode}
          value={confirmationCode}
        />
        <TouchableOpacity style={styles.button} onPress={() => onConfirmPressed(username, confirmationCode)}>
          <Text style={styles.confirmButtonText}>{loading ? 'Loading':'Confirm'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => onResendPress(username)}>
          <Text style={styles.buttonText}>Resend code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.tertiaryButton]} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Back to Sign in</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfirmSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#044244',
  },
  arrowLeftContainer: {
    padding: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#FFD700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  formInput: {
    height: 53,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 12,
    paddingLeft: 10,
    bottom: 3,
    color: 'black',
    flex: 0,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  confirmButtonText: {
    fontSize: 18,
    color: COLORS.primary,
    fontFamily: 'Poppins-Medium',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    paddingTop:26,
  },
  modalText: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
    top:1,
  },
  closeButton: {
    backgroundColor:COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Medium',
  },
});
