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
import { Auth } from 'aws-amplify/auth';
import { confirmResetPassword } from 'aws-amplify/auth';


const ResetPassword = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const client = generateClient();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeCheck, setCodeCheck] = useState(false);
  const [resendCode, setResendCode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { handleSubmit, control, formState: { errors }, reset } = useForm(); 
  const { username } = route.params;
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const UserByUsername = /* GraphQL */ `
  query UserByUsername($username: String!) {
    userByName(username: $username) {
    id
      userId
      username
      phonenumber
      image
      role
      idcardimage
      store {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      bills
      purchaseOrders
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      storeUsersId
      __typename
    }
  }
`;


  const handlePasswordReset = async ({username, code, newPassword}) => {
    setLoading(true);
    try {
    handleConfirmResetPassword({username, code, newPassword});
    //   Alert.alert("Success", "Your password has been reset successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  const updateUser=async()=>{
    try {
        const response = await client.graphql({
          query:UserByUsername,
          variables: { username:username },
          authMode: 'apiKey',
        });
        console.log('User:', response);

      } catch (error) {
        console.error('Error updating user:', error);
      } 

    //   try {
    //     const response = await client.graphql({
    //       query:UserByUsername,
    //       variables: { username:username },
    //       authMode: 'apiKey',
    //     });
    //     console.log('User:', response);

    //   } catch (error) {
    //     console.error('Error updating user:', error);
    //   } 
  }

  async function handleConfirmResetPassword({
    userName, Code, NewPassword
  }) {
    const trimmedUsername = username.trim();
    try {
      await confirmResetPassword({
        username: trimmedUsername,
        confirmationCode: code,
        newPassword:newPassword,
      });

      Alert.alert("Success", "Your password has been reset successfully!");

      setCode('');
      setNewPassword('');
      navigation.navigate('Login');
    } catch (error) {
        Alert.alert("Error", error.message);
        console.log(error);
    }
  }
  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 

  const onResendPress = async (username) => {
    setLoading(true);
    try {
      await Auth.resendSignUpCode(username);
      setModalMessage("New code has been sent to your email.");
      setModalVisible(true);
      setResendCode(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  const onSignInPress = () => {
    navigation.navigate('Login');
  };
  

  const closeModal = () => {
    if (resendCode) {
      setModalVisible(false);
      setConfirmationCode('');
      setResendCode(false);
    } else if (modalMessage === 'Password Updated Successfully') {
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

        <TextInput style={styles.formInput} placeholder="Enter Code" placeholderTextColor='rgba(170, 170, 170,4)' onChangeText={setCode} value={code} />
        <View style={styles.newPassword}>
            <TextInput style={styles.formInput} placeholder="New Password" placeholderTextColor='rgba(170, 170, 170,4)' secureTextEntry={!showPassword} onChangeText={setNewPassword} value={newPassword} />
            <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword} >
            <Ionic size={24} color='black' name={showPassword ? 'eye-off-outline' : 'eye-outline'} />
            </TouchableOpacity>
        </View>
       
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => handlePasswordReset({username, code, newPassword})}>
          <Text style={styles.buttonTextConfirm}>{loading ? 'Loading':'Confirm'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.tertiaryButton]} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Resend Code</Text>
        </TouchableOpacity>
        </View>
       
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

export default ResetPassword;

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
  
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    paddingBottom: 50,
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
    fontFamily: 'Poppins-Medium',
    
  },
  newPassword:{
    width:'100%' 
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
  buttonContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    marginBottom:15,
  },
  showPasswordButton: {
    position:'absolute',
    right:15,
    bottom:30,
    
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
  buttonTextConfirm: {
    fontSize: 18,
    color: COLORS.primary,
    fontFamily: 'Poppins-Medium',
  },
  secondaryButton: {
    backgroundColor: '#FFD700',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    borderWidth:1,
    marginBottom:40,
    borderColor:COLORS.secondary,
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
