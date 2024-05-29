import React, {useState, useEffect, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,Alert
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../assets/theme/index';
import {useNavigation} from '@react-navigation/native';
import {generateClient} from 'aws-amplify/api';
import {getStore} from '../src/graphql/queries'; 
import {useForm} from 'react-hook-form';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useDispatch, useSelector } from 'react-redux';
import { updateStore } from '../src/graphql/mutations';
import { setUserDetails } from '../store/userSlice';
import { updateCurrency } from '../store/currencySlice';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const Store = () => {
        const navigation = useNavigation();
        const client = generateClient();
        const dispatch = useDispatch();
        const storeID = useSelector((state) => state.user.storeId);
        const [loading, setLoading] = useState(false);
        const [loadingMessage, setLoadingMessage] = useState(false);
        const [success, setSuccess] = useState(false);
        const [error, setError] = useState(false);
        const [store, setStore] = useState({
          id: storeID,
          name: '',
          currency: '',
          address: '',
          contact: '',
          _version: 0,
        });
        const [isEditing, setIsEditing] = useState(false);

        useFocusEffect(
          useCallback(() => {
            const fetchStoreDetails = async () => {
              setLoading(true);
              try {
                const response = await client.graphql({
                  query: getStore,
                  variables: { id: storeID },
                  authMode: 'apiKey',
                });
      
                if (response.data.getStore) {
                  setStore(response.data.getStore);
                }
              } catch (error) {
                Alert.alert('Error', 'Failed to fetch store details.');
              }
              setLoading(false);
            };
      
            fetchStoreDetails();
          }, [storeID])
        );
      
        
        const handleEditToggle = () => {
          setIsEditing(!isEditing);
        };
      
        const handleSave = async () => {
            if (!store.name.trim()) {
                Alert.alert('Validation', 'Store name cannot be empty.');
                return;
            }
            setLoading(true);
            try {
                const updateResponse = await client.graphql({
                    query: updateStore,
                    variables: { input: {
                        id: storeID,
                        name: store.name,
                        currency: store.currency,
                        address: store.address,
                        contact: store.contact,
                        _version: store._version
                    } },
                    authMode: 'apiKey',
                });
                console.log("Update",updateResponse.data.updateStore)
                console.log("STore input",storeID,
                store.name,
                store.currency,
                store.address,
                store.contact,
                store._version)
                dispatch(updateCurrency(store.currency));
                setStore(updateResponse.data.updateStore);
                setIsEditing(false);
                Alert.alert('Success', 'Store updated successfully.');
            } catch (error) {
                console.error('Error updating store:', error);
                Alert.alert('Error', 'Failed to update store.');
            }
            setLoading(false);
        };
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{flex:1,backgroundColor:'white',borderWidth:1,justifyContent:'center',paddingHorizontal:25}}>
        <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item width={150} height={20} />
         <View style={{paddingVertical:20}}>
         <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
         <SkeletonPlaceholder.Item marginLeft={20}>
           <SkeletonPlaceholder.Item width={400} height={20} />
           <SkeletonPlaceholder.Item marginTop={6} width={400} height={20} />
         </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder.Item>
         </View>      
     </SkeletonPlaceholder>
     <SkeletonPlaceholder borderRadius={4}>
     
         <View style={{paddingVertical:20}}>
         <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
         <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
         <SkeletonPlaceholder.Item marginLeft={20}>
           <SkeletonPlaceholder.Item width={400} height={20} />
           <SkeletonPlaceholder.Item marginTop={6} width={400} height={20} />
         </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder.Item>
         </View>
      
       
     </SkeletonPlaceholder>
     <SkeletonPlaceholder borderRadius={4}>
     <SkeletonPlaceholder.Item width={100} height={20} marginTop={20}/>
         <View style={{paddingVertical:20}}>
         <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
         <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
         <SkeletonPlaceholder.Item marginLeft={20}>
           <SkeletonPlaceholder.Item width={400} height={20} />
           <SkeletonPlaceholder.Item marginTop={6} width={400} height={20} />
         </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder.Item>
         </View>
      
       
     </SkeletonPlaceholder>
     <SkeletonPlaceholder borderRadius={4}>
     <SkeletonPlaceholder.Item width={100} height={20} marginTop={20}/>
         <View style={{paddingVertical:20}}>
         <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
         <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
         <SkeletonPlaceholder.Item marginLeft={20}>
           <SkeletonPlaceholder.Item width={400} height={20} />
           <SkeletonPlaceholder.Item marginTop={6} width={400} height={20} />
         </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder.Item>
         </View>
      
       
     </SkeletonPlaceholder>
     <SkeletonPlaceholder borderRadius={4}>
     <SkeletonPlaceholder.Item width={100} height={20} marginTop={20}/>
         <View style={{paddingVertical:20}}>
         <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
         <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
         <SkeletonPlaceholder.Item marginLeft={20}>
           <SkeletonPlaceholder.Item width={400} height={20} />
           <SkeletonPlaceholder.Item marginTop={6} width={400} height={20} />
         </SkeletonPlaceholder.Item>
       </SkeletonPlaceholder.Item>
         </View>
      
       
     </SkeletonPlaceholder>
 
     </View>
     ):(
      <>
     
<View style={styles.upperView}>
        <TouchableOpacity style={styles.arrowBackIcon}  onPress={()=> navigation.goBack()}>
            <Ionic size={24} color='white' name ='chevron-back-outline'/>
        </TouchableOpacity>
        <Text style={styles.name}>Store</Text>
      </View>
      <View style={styles.lowerView}>
    

   
        <ScrollView style={styles.scrolledView}>
 
       
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <View style={styles.imageContainer}>
                    <Ionic size={30} color={COLORS.primary} name ='storefront-outline'/>
                </View>
                <View style={styles.inputContainer}>
                {isEditing ? (
            <TextInput
              value={store.name}
              onChangeText={(text) => setStore((prev) => ({ ...prev, name: text }))}
              placeholder="Store Name"
              style={styles.formInput}
            />
          ) : (
            <Text style={styles.formInput1}>{store.name  ? store.name : 'Update Name'}</Text>
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
                {isEditing ? (
            <TextInput
              value={store.contact}
              onChangeText={(text) => setStore((prev) => ({ ...prev, contact: text }))}
              placeholder="Enter Contact"
              style={styles.formInput}
            />
          ) : (
            <Text style={styles.formInput1}>{store.contact  ? store.contact : '- - -' }</Text>
          )}
              </View>
        </View>
            
        </View>
             
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <TouchableOpacity style={styles.imageContainer}>
               <Ionic size={30} color={COLORS.primary} name='cash-outline' />
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                {isEditing ? (
            <TextInput
              value={store.currency}
              onChangeText={(text) => setStore((prev) => ({ ...prev, currency: text }))}
              placeholder="Enter Currency"
              style={styles.formInput}
            />
          ) : (
            <Text style={styles.formInput1}>{store.currency  ? store.currency : '- - -' }</Text>
          )}
              </View>
            </View>
        </View>  
        <View style={styles.formInputContainer}>
            <View style={styles.formInputWrapper}>
               <View style={styles.imageContainer}>
               <Ionic size={30} color={COLORS.primary} name ='location-outline'/>
                </View>
                <View style={styles.inputContainer}>
                {isEditing ? (
            <TextInput
              value={store.address}
              onChangeText={(text) => setStore((prev) => ({ ...prev, address: text }))}
              placeholder="Enter Address"
              style={styles.formInput}
            />
          ) : (
            <Text style={styles.formInput1}>{store.address ? store.address : '- - -' }</Text>
          )}
              </View>
        </View>
            
        </View>
    
        
        </ScrollView>
        </View>
          {isEditing && (
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.editButtonText}>Save</Text>
        </TouchableOpacity>
      )}
      <View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
                        <Text style={styles.editButtonText}>{isEditing ? 'Cancel' : 'Update'}</Text>
            </TouchableOpacity>
      </View>
      </>
     )}
      
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
    
  },
  upperView: {
    flex:1,
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
    top:1,
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
    bottom: 40,
    right: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  saveButton:{
    position: 'absolute',
    bottom: 40,
    left: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  editButtonText:{
    color:COLORS.primary,
    fontFamily:'Poppins-Regular',
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

formInput1:{
    flex:0,
    fontSize:18.5,
    top:6,
    right:10,
    paddingVertical:10,
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

},
saveWrapper:{
  flex:0,
  justifyContent:'center',
  alignItems:'center',
  justifyContent:'flex-end',
  alignItems:'flex-end',
  paddingVertical:15,
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

export default Store;