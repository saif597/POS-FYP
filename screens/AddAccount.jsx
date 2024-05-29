import React,{useState,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../assets/theme/index';
import { SelectList } from 'react-native-dropdown-select-list';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { generateClient } from 'aws-amplify/api';
import { createUser } from '../src/graphql/mutations';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { signUp} from 'aws-amplify/auth';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
const AddAccount = () => {
    const [rank, setRank] = useState('Select Role');
    const [role, setRole] = useState('Select Role');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [idCardNumber, setIdCardNumber] = useState('');
    const [selectedIdCardImage, setSelectedIdCardImage] = useState(null); 
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
  const { control, handleSubmit } = useForm(); 
  const client = generateClient();
  const navigation=useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selected, setSelected] = React.useState('');
  const data = [
    {key:'1', value:'CASHIER'},
    {key:'2', value:'PURCHASER'},
    {key:'3', value:'WAREHOUSE_MANAGER'}
  ];

  
  const handleChoosePhoto = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri); 
      } else {
        console.log('No image selected or unexpected response structure');
      }
    });
  };
  
  

  const handleSuccessButtonPress= () => {
    setLoading(false)
    setLoadingMessage(false)
    setSuccess(false)
    setError(false)
    setErrorMessage('')
  }
  
  const handleChooseIdCardPhoto = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setSelectedIdCardImage(response.assets[0]);
        
      }
    });
  };
  useEffect(() => {
    const fetchLoggedInUserEmail = async () => {
      try {
        const mail = await fetchUserAttributes();
        setUserEmail(mail.email);
        console.log("email retrieved",userEmail);
        setLoggedInUserEmail(userEmail);
      } catch (error) {
        console.error('Error fetching logged-in user email:', error);
      }
    };

    fetchLoggedInUserEmail();
  }, []);
  const onSubmit = async () => {
    console.log("We Have entereed")
    setLoading(true);
    setLoadingMessage(true);
    Keyboard.dismiss();
    try {
      const signUpResponse = await signUp({
        username:name,
        password,
      options: {
        userAttributes: {
          email:userEmail,
        },
      }
      });
      console.log("Sign Up Successful")
      const cognitoUserId = signUpResponse.userId;
      console.log("cognito id",signUpResponse);
      console.log("Into User model");
      navigation.navigate('ConfirmSignUp2', {
        userData: {
          cognitoUserId,
          username:name,
          phonenumber,
          role,
          userEmail,
          profileImageUri: selectedImage,
          selectedIdCardImageUri: selectedIdCardImage?.uri,
        },
      });
  
       setLoadingMessage(false);
       setSuccess(true);
    setName('')
    setPassword('')
    setPhoneNumber('')
    setIdCardNumber('')
    setRole('SelectRole')
      

    } catch (error) {
      console.error('Error creating user:', error);
      setLoadingMessage(false);
      setError(true);
      setErrorMessage(error.message)
    }
  };


  return (
    <View style={styles.container}>
      {/* Upper View */}
      {loading && (
      <View style={styles.loadingContainer}>
      <AnimatedCircularProgress
  size={120}
  width={15}
  duration={2200} 
  delay={0}
  fill={100}
  tintColor={COLORS.secondary}
  onAnimationComplete={() => console.log('onAnimationComplete')}
  backgroundColor="#3d5875" />
{loadingMessage ? (
  <Text style={styles.loadingText}>Creating Account</Text>
) : success ? (
  <View style={styles.successMessageContainer}>
    <Text style={styles.loadingText}>Account Added Successfully</Text>
    <TouchableOpacity
      style={styles.successButton}
      onPress={handleSuccessButtonPress}>
      <Text style={styles.buttonText}>Go Back</Text>
    </TouchableOpacity>
  </View>
) : error ? (
  <View style={styles.successMessageContainer}>
    <Text style={styles.loadingText}>ACCOUNT CREATION FAILED</Text>
    <Text style={styles.loadingTextSubtitle}>{errorMessage}</Text>
    <TouchableOpacity
      style={styles.successButton}
      onPress={handleSuccessButtonPress}>
      <Text style={styles.buttonText}>Go Back</Text>
    </TouchableOpacity>
  </View>
) : null}

      </View>
     )}
      <View style={styles.upperView}>
        {/* <Image
          source={require('../assets/images/profile.png')}
          style={styles.profileImage}
        /> */}
        <TouchableOpacity style={styles.arrowBackIcon}  onPress={()=> navigation.goBack()}>
            <Ionic size={24} color='white' name ='chevron-back-outline'/>
        </TouchableOpacity>
        <Text style={styles.name}>Add Account</Text>
        <Text style={styles.role}>Create New Account</Text>
      </View>

      {/* Lower View */}
      <View style={styles.lowerView}>
      <TouchableOpacity style={styles.profileImageContainer} onPress={handleChoosePhoto}>
  {selectedImage ? (
    <Image source={{ uri: selectedImage }} style={styles.profileImage} />
  ) : (
    <Image source={require('../assets/images/profile1.png')} style={styles.profileImage} />
  )}
  <Ionic style={styles.plusImage} size={38} color={'white'} name='add-circle' />
</TouchableOpacity>

   
        <ScrollView style={styles.scrolledView}>
 
       
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <View style={styles.imageContainer}>
                    <Ionic size={30} color={COLORS.primary} name ='person-outline'/>
                </View>
                <View style={styles.inputContainer}>
                <TextInput
        style={styles.formInput}
        placeholder='Full Name'
        placeholderTextColor='rgba(170, 170, 170,4)'
        onChangeText={(text) => setName(text)} 
        value={name}
      />
              </View>
            </View>
        </View>
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <View style={styles.imageContainer}>
                    <Ionic size={30} color={COLORS.primary} name ='bag-remove-outline'/>
                </View>
                <View style={styles.inputContainer}>
                    {/* <TextInput style={styles.formInput}  placeholder='Product ID'  placeholderTextColor='rgba(170, 170, 170,4)'/> */}
                   <View>
                   {/* <Picker
                     selectedValue={rank}
                     onValueChange={setRank}
                     style={styles.picker}>
                     <Picker.Item label="Senior" value="Senior" />
                     <Picker.Item label="Junior" value="Junior" />
                     <Picker.Item label="Internee" value="Internee" />
                     <Picker.Item label="New Recruit" value="New Recruit" />
                   </Picker> */}
                       <SelectList 
        setSelected={(role) => setRole(role)} 
        data={data} 
        search={false} 
        renderRightIcon={{ size: 30 }}
        save="value"
        placeholder={role} 
        boxStyles={{ borderWidth: 0, left: -16 }} 
        arrowicon={<Ionic style={{ position: 'absolute', right: -15, top: 14 }} size={26} color='rgba(180, 180, 180,4)' name='chevron-down-outline' />}
        inputStyles={{ fontSize: 18.5, top: 1, fontFamily: 'Poppins-Regular', color: 'rgba(140, 140, 140,4)' }}
        dropdownTextStyles={{ fontFamily: 'Poppins-Regular', fontSize: 15, color: 'rgba(180, 180, 180,4)' }}
      />
                 </View>
                </View>
            </View>
        </View>
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <View style={styles.imageContainer}>
               <Ionic size={30} color={COLORS.primary} name ='call-outline'/>
                </View>
                <View style={styles.inputContainer}>
                <TextInput
        style={styles.formInput}
        placeholder='Contact Number'
        placeholderTextColor='rgba(170, 170, 170,4)'
        keyboardType='phone-pad'
        onChangeText={(value) => setPhoneNumber(value)} 
        value={phonenumber} 
      />
              </View>
        </View>
            
        </View>
        

                <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <TouchableOpacity style={styles.imageContainer}>
               <Ionic size={30} color={COLORS.primary} name={showPassword ? 'eye-off-outline' : 'eye-outline'} onPress={() => setShowPassword(!showPassword)}/>
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                <TextInput
        style={styles.formInput}
        placeholder='Password'
        placeholderTextColor='rgba(170, 170, 170,4)'
        secureTextEntry={!showPassword}
        onChangeText={(value) => setPassword(value)} 
        value={password} 
      />
              </View>
            </View>
        </View>
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <View style={styles.imageContainer}>
               <FontAwesome name="address-card" size={28} color={COLORS.primary} />
                </View>
                {/* <View style={styles.inputContainer}> */}
                <TouchableOpacity  style={styles.inputContainer} onPress={handleChooseIdCardPhoto}>
        {selectedIdCardImage ? (
          <Image source={{uri: selectedIdCardImage.uri}} style={styles.idCardImage} />
        ) : (
          <Text style={styles.formInput}>ID Card Image</Text>
        )}
        <Ionic style={styles.plusImage} size={38} color={'white'} name='add-circle' />
      </TouchableOpacity>
              </View>
            {/* </View> */}
        </View>
        
        </ScrollView>
        </View>
          <View style={styles.saveWrapper}>
              <TouchableOpacity style={styles.saveButton} onPress={onSubmit}>
                  <Ionic size={18} color={COLORS.primary} name ='save-outline'/>
                  <Text style={styles.saveText}>Add Account</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
    
  },
  upperView: {
    flex:1.3,
    // height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderBottomEndRadius:50,
    borderBottomStartRadius:50,
    overflow: 'hidden', 
  },
  arrowBackIcon:{
    position:'absolute',
    top:60,
    left:8
},
  lowerView: {
    flex: 2.5,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 65,
  },
  profileImage: {
    zIndex:1,
    borderRadius:100,
    width: 130,
    height: 130,
    
  },
  profileImageContainer:{
    flex:1,
    position:'absolute',
    left:130,
    top:-70,
    justifyContent:'center',
    alignItems:'center',
},
plusImage:{
    position:"absolute",
    bottom:6,
    right:1,
},
  name: {
    fontSize: 25,
    color: 'white',
    fontFamily:'Poppins-Regular',
    bottom:20,
  },
  role: {
    fontSize: 14,
    color: COLORS.secondary,
    bottom:24,
    
  },
  scrolledView:{
    
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  field: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: COLORS.primary,
  },
  value: {
    fontSize: 14,
    color: 'darkgray',
  },
  input: {
    fontSize: 14,
    backgroundColor: 'white',
    color: 'black',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  picker: {
    flex: 1,
    height: 30,
    color: 'black',
    fontSize: 14,
    padding: 0,
    margin: 0,
  },
  dropdownIndicator: {
    fontSize: 16,
    color: COLORS.primary,
  },
  editButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  formInputContainer:{
    borderBottomWidth:1,
    borderColor:'lightgray',
    paddingRight:20,
    paddingLeft:17,
    paddingVertical:15,
    width:'100%',
},
formInputContainerSelected:{
    borderBottomWidth:1,
    borderColor:'lightgray',
    paddingVertical:10,
    paddingRight:20,
    paddingLeft:17,
},

formInputWrapper:{
    flex:0,
    flexDirection:'row',
    paddingHorizontal:10,
},
formInput:{
    flex:0,
    fontSize:18.5,
    top:6,
    right:10,
    fontFamily:'Poppins-Regular',
    justifyContent:'center',
    alignItems:'center',
    color:'rgba(140, 140, 140,4)',
    textAlign:'center',
    width:'100%',
},
formInputSize:{
    flex:0,
    fontSize:19,
    top:6,
    fontFamily:'Poppins-Regular',
    justifyContent:'center',
    alignItems:'center',
    color:'black'
},
imageContainer:{
    flex:0,
    justifyContent:'center',
    alignItems:'center',
},
idCardImageContainer: {
  alignItems: 'center',
  justifyContent: 'center',
},
idCardImage: {
  width: 150, 
  height: 100, 
  resizeMode: 'contain',
},
idCardPlaceholderText: {
  fontSize: 16,
  color: '#999',
},
inputContainer:{
    flex:1,
    paddingLeft:20,
    justifyContent:'center',
    alignItems:'center',
},
saveContainer:{
  paddingVertical:20,
},
saveWrapper:{
  flex:0,
  justifyContent:'center',
  alignItems:'center',
  justifyContent:'flex-end',
  alignItems:'flex-end',
  paddingVertical:15,
},
saveButton:{
  backgroundColor:COLORS.secondary,
  width:'50%',
  paddingVertical:10,
  borderRadius:30,
  marginRight:10,
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center',
},
saveText:{
  fontFamily:'Poppins-Regular',
  fontSize:17,
  top:2,
  marginLeft:5,
  color:COLORS.primary,
  textAlign:'center',

},
loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    position:'absolute',
    zIndex:999999,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText:{
    color:'white',
    fontSize:24,
    fontFamily:'Poppins-Regular',
    top:15,
  },
  loadingTextSubtitle:{
    color:'white',
    fontSize:20,
    fontFamily:'Poppins-Regular',
    top:15,
  },
  successMessageContainer:{
    flex:0,
   alignItems:'center'
  },
  successButton: {
    backgroundColor: COLORS.secondary,
    width: 150,
    paddingVertical: 8,
    borderRadius: 30,
    top:20,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.primary,
    textAlign: 'center',
    top:1,
  },

});

export default AddAccount;