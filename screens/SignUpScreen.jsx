import { StyleSheet, Text, TouchableOpacity, Alert, View, Image, TextInput,Keyboard} from 'react-native';
import React,{useState} from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { signUp } from 'aws-amplify/auth';
import { createStore } from '../src/graphql/mutations.js';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ScrollView } from 'react-native-gesture-handler';
const SignUpScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(null);
  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
    console.log(showPassword);
  }; 
  const toggleShowPassword2 = () => { 
    setShowPassword2(!showPassword2); 
    console.log(showPassword2);
  }; 
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
 const { handleSubmit, control, formState: { errors }, reset } = useForm(); 
  const onSubmit = async (data) => {
    setLoading(true);
    Keyboard.dismiss();
    console.log('data received:', data);
    if (!data.username || !data.password || !data.confirmPassword || !data.email || !data.phonenumber || !data.storename) {
      console.error('Please fill in all the required fields');
      setLoading(false);
      return;
    }
    if (data.password !== data.confirmPassword) {
      console.error('Password and Confirm Password do not match');
      setLoading(false);
      return;
    }
    console.log('start');
    try {
      console.log('try');
      console.log(data.username)
    
 
      const username=data.username;
      const password=data.password;
      const email=data.email;
      // const phonenumber=data.phonenumber;
      const user = await signUp({
        username,
        password,
      options: {
        userAttributes: {
          email,
        },
      }
      });
      console.log('Sign-up success', user);
      const userId=user.userId;
      // const storeName = data.storeName;
      // const newStore = {
      //   name: storeName,
      // };
      // const createStoreResponse = await client.graphql({
      //   query: createStore,
      //   variables: { input: newStore},
      //   authMode: 'apiKey',
      // });
      // console.log("Store Created",createStoreResponse);
      reset();
      
      if (data && data.username) {
        navigation.navigate('ConfirmSignUp', { username: data.username, phonenumber: data.phonenumber, userId:userId,storename:data.storename });
      } else {
        console.error('Username not found in data:', data);
      }
      setLoading(false);
    } catch (error) {
      console.log('error block');
      Alert.alert('Sign Up Error', error.message);
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
        <KeyboardAvoidingView 
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "margin" }
    keyboardVerticalOffset={Platform.OS === "ios" ? 150 : 500} 
  >
      <SafeAreaView style={{ flex: 1, marginTop: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <TouchableOpacity style={styles.arrowLeftContainer} onPress={() => navigation.goBack()}>
            <Ionic size={24} style={{ right: 5 }} color={COLORS.primary} name="chevron-back-outline" />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.imageContainer}>
          <Image style={styles.imageStyle} source={require('../assets/images/signup.png')} />
        </View> */}
      </SafeAreaView>
      <Animated.View style={styles.formContainer} entering={FadeInDown.duration(1000).springify()}>
        <ScrollView style={styles.form}>
          <Text style={styles.formText}>Username</Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => <TextInput style={styles.formInput} {...field} onChangeText={field.onChange} value={field.value} />}
            name="username"
            defaultValue=""
          />
          {errors.username && <Text style={{ color: 'red' }}>This field is required</Text>}

          <Text style={styles.formText}>Email Address</Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => <TextInput style={styles.formInput} {...field} onChangeText={field.onChange} value={field.value}/>}
            name="email"
            defaultValue=""
          />
          {errors.email && <Text style={{ color: 'red' }}>This field is required</Text>}

          <Text style={styles.formText}>Password</Text>
          <View style={styles.showPassword}>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => <TextInput style={[styles.formInput, styles.passwordInput]} onChangeText={field.onChange} value={field.value}  secureTextEntry={!showPassword}  {...field} />}
            name="password"
            defaultValue=""
          />
          <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword} >
              <Ionic size={24} color='black' name={showPassword ? 'eye-off-outline' : 'eye-outline'} />
            </TouchableOpacity>
            </View>
          {errors.password && <Text style={{ color: 'red' }}>This field is required</Text>}

          <Text style={styles.formText}>Confirm Password</Text>
          <View style={styles.showPassword}>

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => <TextInput style={[styles.formInput, styles.passwordInput]} onChangeText={field.onChange} value={field.value} secureTextEntry={!showPassword2} {...field} />}
            name="confirmPassword"
            defaultValue=""
          />
                    <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword2} >
              <Ionic size={24} color='black' name={showPassword2 ? 'eye-off-outline' : 'eye-outline'} />
            </TouchableOpacity>
            </View>
          {errors.confirmPassword && <Text style={{ color: 'red' }}>This field is required</Text>}
          <Text style={styles.formText}>Phone Number</Text>
<Controller
  control={control}
  rules={{ required: true }}
  render={({ field }) => <TextInput style={styles.formInput} {...field} onChangeText={field.onChange} value={field.value} />}
  name="phonenumber"
  defaultValue=""
/>
{errors.phonenumber && <Text style={{ color: 'red' }}>This field is required</Text>}
<Text style={styles.formText}>Store Name</Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => <TextInput style={styles.formInput} {...field} onChangeText={field.onChange} value={field.value}/>}
            name="storename"
            defaultValue=""
          />
          {errors.email && <Text style={{ color: 'red' }}>This field is required</Text>}

        </ScrollView >
       
        <View style={styles.signupButtonContainer}>
          <TouchableOpacity style={styles.signupButton} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.signupText}>{loading ? 'Loading':'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.orContainer}>
          <Text style={styles.orText}>Or</Text>
        </View>
        <View style={styles.logosContainer}>
          <TouchableOpacity style={styles.socialIcons}><Image style={styles.icon} source={require("../assets/icons/google.png")} /></TouchableOpacity>
          <TouchableOpacity style={styles.socialIcons}><Image style={styles.icon} source={require("../assets/icons/apple.png")} /></TouchableOpacity>
          <TouchableOpacity style={styles.socialIcons}><Image style={styles.icon} source={require("../assets/icons/facebook.png")} /></TouchableOpacity>
        </View> */}
        <View style={styles.noAccountContainer}>
          <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: 13 }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#ffc200', marginLeft: 5, fontWeight: '500', fontFamily: 'Poppins-Medium', fontSize: 13 }}>Login</Text></TouchableOpacity>
        </View>
      </Animated.View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#044244',
  },

  imageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    bottom:20,
  },
  arrowLeftContainer: {
    padding: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#FFD700',
  },
  imageStyle: {
    height: 110, width: 110
  },
  formContainer: {
    flex: 0,
    backgroundColor: 'white',
    padding: 8,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50
  },
  form: {
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  formText: {
    color: 'black',
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
    fontSize: 13.5,
  },
  formInput: {
    height: 45,
    backgroundColor: 'rgba(180, 180, 180,0.4)',
    borderRadius: 10,
    marginBottom: 12,
    paddingLeft: 10,
    bottom: 3,
    color: 'black'
  },
  passwordInput: {
    width:'100%'
  },

  signupButtonContainer: {
    flex: 0,
    alignItems: 'center'
  },
  signupButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    backgroundColor: '#FFD700',
    width: '85%',
    marginHorizontal: 20,
    borderRadius: 13,

  },
  signupText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    top: 2,
    color: '#044244',
  },
  orContainer: {
    flex: 0,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 14,
  },
  orText: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: 'black',
  },
  logosContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 14,
  },
  socialIcons: {
    padding: 6,
    backgroundColor: 'rgba(180, 180, 180,0.3)',
    borderRadius: 10,
  },
  icon: {
    height: 36,
    width: 36
  },
  noAccountContainer: {
    marginTop:20,
    flexDirection: 'row',
    justifyContent: 'center',

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: 'yellow',
    padding: 2,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginLeft: 4,
  },
  showPassword: {
    flexDirection:'row',
   },
   showPasswordButton: {
     position:'absolute',
     right:10,
     top:8,
    },
});
