import { StyleSheet,Image, Text, Alert, View, ScrollView, SafeAreaView, TouchableOpacity, TextInput,ActivityIndicator,Keyboard} from 'react-native';
import React, {useEffect, useState } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { createProduct } from '../src/graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { useForm, Controller } from 'react-hook-form';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { listCategories } from '../src/graphql/queries.js';
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get('window');
const AddProduct = ({route}) => {
const client = generateClient();
 const navigation=useNavigation();
 const { handleSubmit, control, formState: { errors }, reset } = useForm(); 
 const [selected, setSelected] = React.useState("");
 const [loading, setLoading] = useState(false);
 const [successMessage, setSuccessMessage] = useState(false);
 const { categoryId, categoryName } = route.params || { categoryId: '', categoryName: '' };
 const [category, setCategory] = useState(route.params?.categoryName || 'Choose Category');
 const storeID = useSelector((state) => state.user.storeId);
const ProductByBarcode = /* GraphQL */ `
query ProductByBarcode($barcode: String!) {
  productByBarcode(barcode: $barcode) {
    items {
      id
      name
      barcode
      price
      manufacturer
      category
      warehouseQuantity
      shelfQuantity
    }
  }
}
`;
 const [productInput, setProductInput] = useState({
    name: '',
    barcode: '',
    price: '',
    manufacturer:'',
    category:'',
    warehouseQuantity: '',
    shelfQuantity:'',
    warehouseInventoryLimit:'',
    shelfInventoryLimit:'',
    storeProductsId: ''
  });

  const ProductByBarcodeAndStoreId = /* GraphQL */ `
  query ProductByBarcodeAndStoreId($barcode: String!, $storeId: ID!) {
    productByBarcode(barcode: $barcode, filter: {storeProductsId: {eq: $storeId}}) {
      items {
        id
        name
        barcode
        price
        manufacturer
        category
        warehouseQuantity
        shelfQuantity
        store {
          id
          name
        }
        _version
      }
    }
  }
`;
  // const fetchCategories = async () => {
  //   try {
  //     const { data } = await client.graphql({
  //       query: listCategories,
  //       variables: {
  //         filter: {
  //             _deleted: {
  //                 ne: true
  //                       }
  //                 }
  //               },
  //         authMode:'apiKey'
  //     });
  //     const { items } = data.listProducts;
  //     console.log("Categories",items);
  //   } catch (error) {
  //     console.error('Error fetching Categoriesas:', error);
  //   }
  // };
  
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    console.log("STore",storeID)
  }, [selectedImage]); 

  // useEffect(() => {
  //   fetchCategories();
  // }, []); 

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

  const uploadImageToS3 = async (imageUri, fileName) => {
    try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
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
              // accessLevel: 'guest',
              // expiresIn: 9000909,
              useAccelerateEndpoint: true, 
          },
      });
      
      console.log('***************************Signed Image :', getUrlResult);
      console.log('***************************Signed Image URL:', getUrlResult.url);
      return getUrlResult.url; // Return the signed URL
  } catch (error) {
      console.error('Error getting image URL:', error);
      throw error;
  }
};

const resetForm = () => {
 reset();
 setSelectedImage(null);
 setCategory('Choose Category');
}

const handleLoading = () => {
    setLoading(true)
    setSuccessMessage(true);
  }
  
  const handleSuccessButtonPress= () => {
    setLoading(false)
    setSuccessMessage(false);
    reset(); 
    navigation.navigate("ProductsList")
  }

  const checkBarcodeExists = async (barcode) => {
    try {
      const graphqlResult = await client.graphql({
        query: ProductByBarcodeAndStoreId,
        variables: { barcode: barcode, storeId:storeID },
        authMode: 'apiKey',
      });
  
      const products = graphqlResult.data.productByBarcode.items;
      return products.length > 0;
    } catch (error) {
      console.error('Error querying product by barcode:', error);
      throw new Error('Failed to check barcode uniqueness');
    }
  };
  
  const onSubmit = async (data) => {
    console.log('Product Input:', data);
    const barcodeExists = await checkBarcodeExists(data.barcode);

  if (barcodeExists) {
    Alert.alert('Barcode already exists', 'The entered barcode is already in use by another product. Please use a different barcode.');
    return;
  }
    console.log('Category',categoryName);
    setLoading(true);
    Keyboard.dismiss();
    console.log(setLoading)
    
    try {
      const fileName = `product-image-${Date.now()}.jpeg`;
      console.log('Here 1');
      const fileKey = await uploadImageToS3(selectedImage, fileName);
      console.log('Here 2');
      // console.log('File uploaded with key:', fileKey);
  
      const imageUrl = await getImageUrlFromS3(fileKey);
    //   console.log('S3 Image URL:', imageUrl);
    // console.log("url bamzi : "+imageUrl.toString());
    // const imageUrl='abc'
      const productWithImage = {
        ...data,
        category: categoryName,
        image: imageUrl,
        storeProductsId: storeID
      };
      console.log("categorryyyyy checkkkk"+productWithImage.category);
      const newProduct = await client.graphql({
        query: createProduct,
        variables: { input: productWithImage },
        authMode: 'apiKey',
      });
      setSuccessMessage(true);
      console.log('New product created:', newProduct.data.createProduct);
      setProductInput({
        name: '',
        barcode: '',
        price: '',
        manufacturer:'',
        category:'',
        warehouseQuantity: '',
        shelfQuantity:'',
        warehouseInventoryLimit:'',
        shelfInventoryLimit:'',
        storeProductsId: ''
      });
      setCategory('Choose Category');
      reset(); 
      setSelectedImage(null);
    } catch (error) {
    setLoading(false);
      console.error('Error creating product:', error);
      Alert.alert('Login Error', error.message);
    }
    
  };
//   setLoading(false);
 const data = [
    {key:'1', value:'Mobiles'},
    {key:'2', value:'Appliances'},
    {key:'3', value:'Cameras'},
    {key:'4', value:'Computers'},
    {key:'5', value:'Vegetables'},
    {key:'6', value:'Diary Products'},
    {key:'7', value:'Drinks'},
]

  return (
    <View style={styles.container}>
    {loading && (
      <View style={styles.loadingContainer}>
      <AnimatedCircularProgress
        size={120}
        width={15}
        duration={2200} 
        fill={100}
        tintColor={COLORS.secondary}
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#3d5875" />
 {!successMessage ? (
    <Text style={styles.loadingText}>Adding Product</Text>
  ) : (
    <View style={styles.successMessageContainer}>
      <Text style={styles.loadingText}>Product Added Successfully</Text>
      <TouchableOpacity
        style={styles.successButton}
        onPress={handleSuccessButtonPress}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  )}
      </View>
     )}
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                {/* <TouchableOpacity style={styles.arrowBack}  onPress={()=> navigation.navigate('ProductsList')}> */}
                <TouchableOpacity style={styles.arrowBack}  onPress={()=> navigation.goBack(null)}>
                    <Ionic size={25} color='white' name ='chevron-back-outline'/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageContainer} onPress={()=>handleLoading()}>
                <Text style={styles.cashierHeading}>Add Product</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        <View style={styles.listContainer}>
            <ScrollView >
            <View style={styles.cameraContainer}>
    <TouchableOpacity style={styles.imageContainer} onPress={()=>handleChoosePhoto()}>
        {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImageStyle} />
            
        ) : (
            <>
                <Ionic style={styles.cameraImage} size={105} color='rgba(200, 200, 200,4)' name='camera-outline'/>
                <Ionic style={styles.plusImage} size={38} color={COLORS.primary} name='add-circle'/>
            </>
        )}
          {/* <Ionic style={styles.plusImage} size={38} color={COLORS.primary} name='add-circle'/> */}
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>handleChoosePhoto()}>
        <Text style={styles.addPictureText}>Add Picture</Text>
    </TouchableOpacity>
</View>

                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                             <Ionic size={32} color='rgba(180, 180, 180,4)' name ='document-outline'/>
                        </View>
                        <View style={styles.inputContainer}>
                         <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextInput
                      style={styles.formInput}
                      placeholder='Name'
                      placeholderTextColor='rgba(170, 170, 170,4)'
                      onChangeText={field.onChange}
                      value={field.value}
                    />
                  )}
                  name="name"
                  defaultValue=""
                />
                {errors.name && <Text style={styles.errorText}>Product Name is required</Text>}
                        </View>
                    </View>
                </View>
                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                             <Ionic size={32} color='rgba(180, 180, 180,4)' name ='pricetags-outline'/>
                        </View>
                        <View style={styles.inputContainer}>
                        <Controller
  control={control}
  rules={{ required: true }}
  render={({ field }) => (
    <TextInput
      style={styles.formInput}
      placeholder='Barcode'
      placeholderTextColor='rgba(170, 170, 170,4)'
      onChangeText={field.onChange}
      value={field.value}
    />
  )}
  name="barcode"
  defaultValue=""
/>
{errors.barcode && <Text style={styles.errorText}>Barcode is required</Text>}
                        </View>
                    </View>
                </View>
                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                             <Ionic size={32} color='rgba(180, 180, 180,4)' name ='hammer-outline'/>
                        </View>
                        <View style={styles.inputContainer}>
                            <Controller
  control={control}
  render={({ field }) => (
    <TextInput
      style={styles.formInput}
      placeholder='Manufacturer'
      placeholderTextColor='rgba(170, 170, 170,4)'
      onChangeText={field.onChange}
      value={field.value}
    />
  )}
  name="manufacturer"
  defaultValue=""
/> 
                        </View>
                    </View>
                </View>
                <View style={styles.formInputContainerSelectedCategory}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                             <Ionic size={33} color='rgba(180, 180, 180,4)' name ='list-circle-outline'/>
                        </View>
                        <View style={styles.categoryContainer}>
                        <TouchableOpacity style={styles.categoryTextContainer} onPress={()=>navigation.navigate('Categories', { source: 'fromAddProduct' })}>
                        <Text style={[styles.categoryText, { top:1,color: categoryName ? 'black' : 'rgba(170, 170, 170,4)' }]}> {categoryName ? categoryName : 'Choose Category'} </Text>

                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            
                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                             <Ionic size={32} color='rgba(180, 180, 180,4)' name ='cash-outline'/>
                        </View>
                        <View style={styles.inputContainer}>
                    <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextInput
                        style={styles.formInput}
                        placeholder='Price'
                        placeholderTextColor='rgba(170, 170, 170,4)'
                        onChangeText={field.onChange}
                        value={field.value}
                        />
                    )}
                    name="price"
                    defaultValue=""
                    />
                    {errors.price && <Text style={styles.errorText}>Price is required</Text>}
                        </View>
                    </View>
                </View>
                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                             <Ionic size={32} color='rgba(180, 180, 180,4)' name ='albums-outline'/>
                        </View>
                        <View style={styles.inputContainer}>
                    <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextInput
                        style={styles.formInput}
                        placeholder='Quantity in Warehouse'
                        placeholderTextColor='rgba(170, 170, 170,4)'
                        onChangeText={field.onChange}
                        value={field.value}
                        />
                    )}
                    name="warehouseQuantity"
                    defaultValue=""
                    />
                    {errors.price && <Text style={styles.errorText}>Warehouse Quantity is required</Text>}
                        </View>
                    </View>
                </View>
                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                             <Ionic size={32} color='rgba(180, 180, 180,4)' name ='albums-outline'/>
                        </View>
                        <View style={styles.inputContainer}>
                    <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextInput
                        style={styles.formInput}
                        placeholder='Quantity at Shelf'
                        placeholderTextColor='rgba(170, 170, 170,4)'
                        onChangeText={field.onChange}
                        value={field.value}
                        />
                    )}
                    name="shelfQuantity"
                    defaultValue=""
                    />
                    {errors.price && <Text style={styles.errorText}>Shelf Quantity is required</Text>}
                        </View>
                    </View>
                </View>
                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                             <Ionic size={32} color='rgba(180, 180, 180,4)' name ='stopwatch-outline'/>
                        </View>
                        <View style={styles.inputContainer}>
                    <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextInput
                        style={styles.formInput}
                        placeholder='Warehouse Min Quantity'
                        placeholderTextColor='rgba(170, 170, 170,4)'
                        onChangeText={field.onChange}
                        value={field.value}
                        />
                    )}
                    name="warehouseInventoryLimit"
                    defaultValue=""
                    />
                    {errors.price && <Text style={styles.errorText}>Shelf Quantity is required</Text>}
                        </View>
                    </View>
                </View>
                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                             <Ionic size={32} color='rgba(180, 180, 180,4)' name ='stopwatch-outline'/>
                        </View>
                        <View style={styles.inputContainer}>
                    <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextInput
                        style={styles.formInput}
                        placeholder='Shelf Min Quantity'
                        placeholderTextColor='rgba(170, 170, 170,4)'
                        onChangeText={field.onChange}
                        value={field.value}
                        />
                    )}
                    name="shelfInventoryLimit"
                    defaultValue=""
                    />
                    {errors.price && <Text style={styles.errorText}>Shelf Quantity is required</Text>}
                        </View>
                    </View>
                </View>
                <View style={styles.saveContainer}>
                    <View style={styles.saveWrapper}>
                        <TouchableOpacity style={styles.resetButton}  onPress={()=>resetForm()} >
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton}  onPress={handleSubmit(onSubmit)} >
                            <Text style={styles.saveText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
   </View>
  )
}

export default AddProduct

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.primary,
        zIndex:-1,
    },
    safeArea:{
        backgroundColor:COLORS.primary,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        zIndex:-1,
    },
    headerContainer:{
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        width:width,
    },
    cashierHeading:{
        color:'white',
        fontSize:24,
        fontFamily:'Poppins-Regular',
        top:2,
    },
    arrowBack:{
        position:'absolute',
        left:10,
    },
    listContainer:{
        flex:5.5,
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
        backgroundColor:'white',  
        zIndex:-1
    },
  
    cameraContainer:{
        // color:'darkgray',
        height:160,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
        borderBottomWidth:1,
        borderColor:'lightgray'
    },
    plusImage:{
        position:"absolute",
        right:-6,
        bottom:1,
        // backgroundColor:'white'
    },
    addPictureText:{
        fontSize:19,
        color:'rgba(180, 180, 180,4)',
        fontFamily:'Poppins-Regular'
    },
    formInputContainer:{
        borderBottomWidth:1,
        borderColor:'lightgray',
        paddingVertical:12,
        paddingRight:20,
        paddingLeft:17,
        
    },
    formInputContainerSelectedCategory:{
      borderBottomWidth:1,
      borderColor:'lightgray',
      paddingVertical:12,
      paddingRight:20,
      paddingLeft:17,
     
  },
    formInputContainerSelected:{
        borderBottomWidth:1,
        borderColor:'lightgray',
        paddingVertical:10,
        paddingRight:20,
        paddingLeft:17,
    },

    formInputWrapper:{
        flex:1,
        flexDirection:'row',
        paddingHorizontal:10,
    },
    formInput:{
        flex:1,
        fontSize:18.5,
        top:6,
        fontFamily:'Poppins-Regular',
        justifyContent:'center',
        alignItems:'center',
        color:'black',
    },
    formInputSize:{
        flex:1,
        fontSize:19,
        top:6,
        fontFamily:'Poppins-Regular',
        justifyContent:'center',
        alignItems:'center',
        color:'black',
        
    },
    imageContainer:{
        flex:0,
        justifyContent:'center',
        alignItems:'center',
        // paddingVertical:10,
    },
    selectedImageStyle: {
      width: 105, // Adjust the width as needed
      height: 105, // Adjust the height as needed
      borderRadius: 10, // Optional: for rounded corners
  },
  
    inputContainer:{
        flex:1,
        paddingLeft:20,
    },
    saveContainer:{
        paddingVertical:20,
        top:10,
    },
    saveWrapper:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    saveButton:{
        backgroundColor:COLORS.primary,
        width:150,
        paddingVertical:8,
        borderRadius:30,
    },
    resetButton:{
        backgroundColor:'white',
        width:150,
        paddingVertical:8,
        borderRadius:30,
        borderWidth:1,
        borderColor:COLORS.primary,
    },
    categoryButton:{
      backgroundColor:'white',
      paddingVertical:8,
      borderWidth:1,
      borderColor:COLORS.primary,
  },
    saveText:{
        fontFamily:'Poppins-Regular',
        fontSize:18,
        color:'white',
        textAlign:'center'
    },
    resetText:{
        fontFamily:'Poppins-Regular',
        fontSize:18,
        color:COLORS.primary,
        textAlign:'center'
    },
    categoryText:{
      fontFamily:'Poppins-Regular',
      fontSize:18.5,
      color:'rgba(170, 170, 170,4)',
      textAlign:'center'
  },
    categoryContainer:{
        paddingVertical:10,
        paddingHorizontal:20,
        flex:1,
        paddingLeft:20,
        alignItems:'flex-start'
    },
    categoryTextContainer:{
      color:'rgba(170, 170, 170,4)',
      width:'100%',
      alignItems:'flex-start',
      
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
    
})