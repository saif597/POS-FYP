import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Keyboard
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../assets/theme/index';
import { uploadData, getUrl,remove } from 'aws-amplify/storage';
import { SelectList } from 'react-native-dropdown-select-list'
import { useNavigation } from '@react-navigation/native'; 
import {generateClient} from 'aws-amplify/api';
import {getUser} from '../src/graphql/queries';
import { fetchUserAttributes, getCurrentUser, updateUserAttribute } from 'aws-amplify/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import { deleteUser, updateUser } from '../src/graphql/mutations';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useSelector } from 'react-redux';
const Profile = ({route}) => {
  
  const navigation = useNavigation();
  const client = generateClient();
  const userRole = useSelector((state) => state.user.role);
  const [loading, setLoading] = useState(false);
  const [id,setId] = useState('');
  const defaultIdCardImage = require('../assets/images/profile.png');
  const defaultProfileImageUrl = require('../assets/images/profile.png');
  const [originalProfileImage, setOriginalProfileImage] = useState('');
  const [originalIdCardImage, setOriginalIdCardImage] = useState('');
  const [password, setPassword] = useState('password123');
  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [user, setUser] = useState({
    id:'',
    username: '',
    role: '',
    phonenumber: '',
    joined: '',
    idcardimage: [],
    _version:'',
    image:'',
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleUpdateUser = async () => {
    setLoading(true);
    Keyboard.dismiss();
  
    let newProfileImage = user.image;
    let newIdCardImage = user.idcardimage[0];
  
    if (user.image !== originalProfileImage && originalProfileImage) {
      try {
        const fileNameToRemove = extractFileNameFromUrl(originalProfileImage);
        if (fileNameToRemove) {
          await handleImageRemove(originalProfileImage);
        }
        newProfileImage = await handleImageUpload(user.image);
      } catch (error) {
        console.error("Failed to update profile image:", error);
      }
    }
if (user.idcardimage[0] !== originalIdCardImage && originalIdCardImage) {
  try {
    const fileNameToRemove = extractFileNameFromUrl(originalIdCardImage);
    if (fileNameToRemove) {
      await handleImageRemove(originalIdCardImage);
    }
    newIdCardImage = await handleImageUpload(user.idcardimage[0]);
  } catch (error) {
    console.error("Failed to update ID card image:", error);
  }
}

    const userInput = {
      id: user.id,
      username: user.username,
      phonenumber: user.phonenumber,
      role: user.role,
      image: newProfileImage,
      idcardimage: [newIdCardImage],
      _version: user._version,
    };

    try {
      const response = await client.graphql({
        query: updateUser,
        variables: { input: userInput },
        authMode: 'apiKey',
      });
      console.log('User updated:', response.data.updateUser);
      setUser((prevState) => ({
        ...prevState,
        ...response.data.updateUser,
        originalProfileImage: newProfileImage,
        originalIdCardImage: newIdCardImage,
      }));
      Alert.alert('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangeAttributes = async () => {
    const user=id;
    const newAttributes = {
        'name': 'New Name'
    };
    try{
      await updateUserAttribute(user, newAttributes);
    }
    catch(error){
      console.log(error);
    }
    
};

  const handleImageUpload = async (imageUri) => {
    const fileName = `user-${Date.now()}.jpeg`; 
    const fileKey = await uploadImageToS3(imageUri, fileName);
    return await getImageUrlFromS3(fileKey);
  };
  
  const userByIdQuery = /* GraphQL */ `
  query UserById($userId: ID!) {
    userById(userId: $userId) {
      items {
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
          address
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeUsersId
        __typename
      }
    }
  }
`;

  const roles = [
    {key: '1', value: 'CASHIER'},
    {key: '2', value: 'PURCHASER'},
    {key: '3', value: 'WAREHOUSE_MANAGER'},
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
  
      let ide = route?.params?.userId;
      console.log("id1",ide);
    
      if(!ide){
        ide = await fetchUserAttributes();
        setId(ide);
        ide=ide.sub;
        
      }
      if(!ide){
        ide = await getCurrentUser();
        setId(ide);
        ide=ide.sub;
      }
      console.log("ide",ide);
      
      const { data } = await client.graphql({
        query: userByIdQuery,
        variables: { userId: ide },
        authMode: 'apiKey',
    });
    const userItems=data.userById.items;
    console.log("dATA",userItems);
    if (userItems && userItems.length > 0) {
      const userData = userItems[0];
      console.log("user role",userRole);
      setUser({
        id:userData.id,
        username: userData.username,
        role: userData.role,
        phonenumber: userData.phonenumber,
        joined: new Date(userData.createdAt).toLocaleDateString(), 
        idcardimage: userData.idcardimage || [],
        image:userData.image,
        _version:userData._version,
      });
      if(userData.image)
      {
        setOriginalProfileImage(userData.image);
      }else{
        setOriginalProfileImage('../assets/images/profile.png');
      }
      setOriginalIdCardImage(userData.idcardimage);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};
    fetchUserData();
  }, [route?.params?.userId]);

  async function getCurrentUserId() {
    let id = await fetchUserAttributes();
   
    if(!id){
      id = await getCurrentUser();
    }
    id=id.sub;
    console.log("id",id);
    const { data } = await client.graphql({
      query: userByIdQuery,
      variables: { userId: id },
      authMode: 'apiKey',
  });
  }
  useEffect(() => {
    if (selectedRole) {
      setUser((prevState) => ({...prevState, role: selectedRole}));
    }
  }, [selectedRole]);

  const selectImage = (imageType) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        if (imageType === 'profile') {
          handleInputChange('image', source.uri);
        } else if (imageType === 'idcard') {
          handleInputChange('idcardimage', [source.uri]);
        }
      }
    });
  };
  
  const toggleEdit = () => {
    if (editing) {
      handleUpdateUser();
    } else {
      setEditing(true);
    }
  };
  const showConfirmationDialog = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this profile?", 
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel"
        },
        { text: "OK", onPress: () => handleDeleteUser() }
      ],
      { cancelable: false }
    );
  };
  
  
  const handleLoading = () => {
    setLoading(true)
    setSuccessMessage(true);
  }
  const handleSuccessButtonPress= () => {
    setLoading(false)
    setSuccessMessage(false);

  }
  const uploadImageToS3 = async (imageUri, fileName) => {
    try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        console.log("image ::: "+imageUri);
        console.log("bloob: "+blob);


        const uploadResult = await uploadData({
            key: fileName,
            data: blob,
            options: {
                contentType: 'image/jpeg', 
                accessLevel :'guest',
                
            }
        }).result;
        console.log('Upload success:', uploadResult);
        return uploadResult.key; 
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

const getImageUrlFromS3 = async (fileKey) => {
  try {
      console.log("file key is here: " + fileKey);
      const getUrlResult = await getUrl({
          key: fileKey,
          options: {
              accessLevel: 'guest',
            //   expiresIn: 9000909,
              useAccelerateEndpoint: true, 
          },
      });
      
      console.log('***************************Signed Image :', getUrlResult);
      console.log('***************************Signed Image URL:', getUrlResult.url);
      return getUrlResult.url; 
  } catch (error) {
      console.error('Error getting image URL:', error);
      throw error;
  }
};
const extractFileNameFromUrl = (url) => {
  if (!url) return null;
  const urlString = Array.isArray(url) ? url[0] : url;
  console.log("urlString", urlString);
  if (urlString) {
    const regex = /[\w-]+\.jpeg/;
    const matches = urlString.match(regex);
    return matches ? matches[0] : null;
  } else {
    return null;
  }
};



  const handleImageRemove = async (imageUrl) => {
    const fileName = extractFileNameFromUrl(imageUrl);
    await remove({ key: fileName });
  };
  async function uploadImageAndGetUrl(imageUri) {
    const fileName = `user-${Date.now()}`;
    const fileKey = await uploadImageToS3(imageUri, fileName);
    return await getImageUrlFromS3(fileKey);
  }
  async function removeImageFromStorage(imageUrl) {
    const fileName = imageUrl.split('/').pop();
    await remove({ key: fileName });
  }
  
  const handleDeleteUser = async () => {
    console.log("delete received id : ",user.id)
    const deleteUserInput = {
      id: user.id,
      _version: user._version,
    };
  
    try {
      const response = await client.graphql({
        query: deleteUser,
        variables: { input: deleteUserInput },
        authMode: 'apiKey',
      });

      console.log("deleting images");
      if (originalProfileImage) {
        const profileImageFileName = extractFileNameFromUrl(originalProfileImage);
        profileImageFileName && await remove({ key: profileImageFileName });
      }
      console.log("deleting id card images");
      if (originalIdCardImage) {
        const idCardImageFileName = extractFileNameFromUrl(originalIdCardImage);
        idCardImageFileName && await remove({ key: idCardImageFileName });
      }
      console.log('User deleted:', response.data.deleteUser);
      Alert.alert('Profile deleted successfully!');
      navigation.navigate('Staff'); 
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Failed to delete profile.');
    }
    
  };
  
  const handleInputChange = (key, value) => {
    setUser((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    
  };

  return (
    <View style={styles.container}>
      {loading && (
      <View style={styles.loadingContainer}>
      <AnimatedCircularProgress
        size={120}
        width={15}
        fill={100}
        prefill={0} 
        duration={2000} 
        delay={0}
        tintColor={COLORS.secondary}
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#3d5875" />
    <View style={styles.successMessageContainer}>
      <Text style={styles.loadingText}>Updating Profile</Text>
      <TouchableOpacity
        style={styles.successButton}
        onPress={handleSuccessButtonPress}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
      </View>
     )}
      <View style={styles.upperView}>
        <TouchableOpacity style={styles.arrowBackIcon}  onPress={()=> navigation.goBack()}>
            <Ionic size={24} color='white' name ='chevron-back-outline'/>
        </TouchableOpacity>
        <View style={styles.headerData}>
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.role}>{user.role}</Text>
        </View>
      </View>

      <View style={styles.lowerView}>
        {!editing && (
    <View style={styles.profileImageHeader}>
      <Image
        source={user.image ? { uri: user.image } : require("../assets/images/person.jpg")}
        style={styles.profileImage}
      />
    </View>
  )}
       {editing && (
    <TouchableOpacity onPress={() => selectImage('profile')} style={styles.profileImageHeader}>
      <Image
        source={user.image ? { uri: user.image } : require("../assets/images/person.jpg")}
        style={styles.profileImage}
      />
      {/* <Ionic style={styles.iconStyle} name='camera' /> */}
    </TouchableOpacity>
  )}

        <ScrollView style={styles.scrolledView}>
 
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <View style={styles.imageContainer}>
                    <Ionic size={30} color={COLORS.primary} name ='person-outline'/>
                </View>
               
                     <View style={styles.inputContainer}>
                
            <Text style={styles.formInput}>{user.username}</Text>

                
                </View>
            </View>
        </View>
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <View style={styles.imageContainer}>
                    <Ionic size={30} color={COLORS.primary} name ='bag-remove-outline'/>
                </View>
                <View style={styles.inputContainer}>
                    {editing ? (
  <SelectList
  setSelected={setSelectedRole} 
  data={roles}
  search={false}
  save="value" 
  placeholder={user.role || "Select Role"}
  boxStyles={{ borderWidth: 0, left: -16 }}
  arrowicon={<Ionic style={{ position: 'absolute', right: -15, top: 14 }} size={26} color='rgba(180, 180, 180,4)' name='chevron-down-outline'/>}
  inputStyles={{ fontSize: 14.5, top: 1, fontFamily: 'Poppins-Regular', color: 'rgba(140, 140, 140,4)' }}
  dropdownTextStyles={{ fontFamily: 'Poppins-Regular', fontSize: 15, color: 'rgba(180, 180, 180,4)' }}
/>

) : (
  <Text style={styles.formInputRole}>{user.role}</Text>
)}

                </View>
            </View>
        </View>
       
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <View style={styles.imageContainer}>
                    <Ionic size={30} color={COLORS.primary} name ='call-outline'/>
                </View>
                <View style={styles.inputContainer}>
                {editing ? (
                 <TextInput
                 value={user.phonenumber}
                 onChangeText={(text) => handleInputChange('phonenumber', text)}
                 style={styles.formInput}
                 placeholder="Phonenumber"
                 editable={editing}
               />
               
                ) : (
            <Text style={styles.formInput}>{user.phonenumber}</Text>

                )}
                </View>
            </View>
        </View>
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <View style={styles.imageContainer}>
                    <Ionic size={30} color={COLORS.primary} name ='laptop-outline'/>
                </View>
                <View style={styles.inputContainer}>
                {editing ? (
                 <TextInput
                 value={user.joined}
                 onChangeText={(text) => handleInputChange('joined', text)}
                 style={styles.formInput}
                 placeholder="Joined"
                 editable={editing} 
               />
               
                ) : (
            <Text style={styles.formInput}>{user.joined}</Text>

                )}
                </View>
            </View>
        </View>
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
            
               <TouchableOpacity style={styles.imageContainer} onPress={toggleShowPassword}>
                    <Ionic size={30} color={COLORS.primary} name={showPassword ? 'eye-off-outline' : 'eye-outline'}/>
               </TouchableOpacity>
               
                <View style={styles.inputContainer}>
                    {/* <TextInput style={styles.formInput}  placeholder='Product ID'  placeholderTextColor='rgba(170, 170, 170,4)'/> */}
                {/* {editing ? (
                   <TextInput
                   value={password}
                   onChangeText={setPassword}
                   secureTextEntry={!showPassword} 
                   style={styles.input}
                 />
                ) : (
                  
                  <Text style={styles.formInput}>{showPassword ? password : '*********'}</Text>
                )} */}
            
                  <Text style={styles.formInput}>{showPassword ? password : '*********'}</Text>
              
                </View>
            </View>
            
        </View>
        <View style={styles.formInputContainer}>
  <View style={styles.formInputWrapper}>
    <View style={styles.imageContainer}>
      <FontAwesome name="address-card" size={28} color={COLORS.primary} />
    </View>
    
    {editing && (
  <TouchableOpacity onPress={() => selectImage('idcard')} style={styles.idCardImageContainer}>
    {user.idcardimage && user.idcardimage.length > 0 ? (
      <Image source={{ uri: user.idcardimage[0] }} style={styles.idCardImage} />
    ) : (
      <View style={styles.idCardImagePlaceholder}>
        <Text style={styles.idCardImagePlaceholderText}>ID Card Image</Text>
      </View>
    )}
 
  </TouchableOpacity>
)}

  </View>
</View>

        
        </ScrollView>
        </View>
      
        <View style={{
  ...styles.saveWrapper, 
  justifyContent: (userRole === 'GENERAL_MANAGER' && !(editing || user.role !== 'GENERAL_MANAGER')) ? 'flex-start' : 'space-around'
}}>
  {userRole === 'GENERAL_MANAGER' && (
    <>
      <TouchableOpacity style={styles.saveButton} onPress={toggleEdit}>
        <Ionic size={18} color={COLORS.primary} name={editing ? 'save-outline' : 'brush-outline'}/>
        <Text style={styles.saveText}>{editing ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>
      {(editing || user.role !== 'GENERAL_MANAGER') && (
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={editing ? () => setEditing(false) : () => showConfirmationDialog()}
        >
          <Ionic size={18} color='white' name={'trash-outline'}/>
          <Text style={styles.deleteText}>{editing ? 'Cancel' : 'Delete'}</Text>
        </TouchableOpacity>
      )}
    </>
  )}
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
    top:50,
    left:8
},
headerData:{
  // borderWidth:2,
  bottom:20,
  justifyContent:'center',
  alignItems:'center'
},
  lowerView: {
    flex: 2.5,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 65,
  },
  profileImage: {
    zIndex:1,
    position:'absolute',
    left:115,
    top:-70,
    width: 125,
    height: 125,
    borderRadius: 60,
    marginBottom: 10,
    borderColor:'white',
    borderWidth:1,
  },
  profileImageHeader: {
    zIndex:1,
    position:'absolute',
    // left:115,
    // top:-70,
    width: 125,
    height: 125,
    borderRadius: 60,
    marginBottom: 10,
    borderColor:'white',
    borderWidth:1,
  },

  name: {
    fontSize: 22,
    color: 'white',
    fontFamily:'Poppins-Regular',
    // bottom:20,
  },
  role: {
    fontSize: 14,
    color: COLORS.secondary,
    // bottom:24,
    
  },
  scrolledView:{
    top:-15,
    // borderWidth:2,
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
    paddingBottom:20,
    paddingTop:20,
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
  width:'100%',
    flex:0,
    fontSize:16.5,
    top:6,
    right:10,
    fontFamily:'Poppins-Regular',
    justifyContent:'center',
    alignItems:'center',
    color:'rgba(140, 140, 140,4)',
    textAlign:'center',
},
iconStyle:{
  position:"absolute",
  bottom:6,
  right:1,
},
formInputRole:{
  flex:0,
  fontSize:17.5,
  top:1,
  fontFamily:'Poppins-Regular',
  justifyContent:'center',
  alignItems:'center',
  color:'rgba(140, 140, 140,4)',
  textAlign:'center',
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
    // paddingVertical:10,
    // bottom:55,
    // right:20,
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
paddingVertical:10,
flexDirection:'row',
justifyContent:'space-around',
alignItems:'center',
marginLeft:10
},
saveButton:{
  backgroundColor:COLORS.secondary,
  width:100,
  paddingVertical:5,
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

deleteButton:{
  backgroundColor:'red',
  width:100,
  paddingVertical:5,
  borderRadius:30,
  marginRight:10,
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center',
},
deleteText:{
  fontFamily:'Poppins-Regular',
  fontSize:17,
  top:2,
  marginLeft:5,
  color:'white',
  textAlign:'center',

},
idCardImageContainer: {
  flex:1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 10, 
},
idCardImage: {
  width: 100, // Set your desired width
  height: 50, // Set your desired height
  resizeMode: 'cover', // Adjust as needed
},
loadingContainer: {
  ...StyleSheet.absoluteFillObject,
  position:'absolute',
  zIndex:999999,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
loadingText:{
  color:'white',
  fontSize:24,
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

export default Profile;