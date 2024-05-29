import { StyleSheet, Text, Alert, View, ScrollView, SafeAreaView, TouchableOpacity, TextInput,ActivityIndicator,Keyboard} from 'react-native';
import React, {useEffect, useState } from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../assets/theme/index.js';
import { useNavigation } from '@react-navigation/native';
import { Dimensions,Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadData, getUrl,remove } from 'aws-amplify/storage';
import { deleteProduct,updateProduct,createNotifications } from '../src/graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { useForm, Controller } from 'react-hook-form';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get('window');

const Product = ({ route }) => {

const  product  = route.params.item;

useEffect(() => {

}, [product,startingProductImageUrl]);

const storeCurrency  = useSelector(state => state.currency.value); 
const [startingProductImageUrl, setStartingProductImageUrl] = useState(product.image);
const client = generateClient();
 const navigation=useNavigation();
 const [categoryName, setCategoryName] = useState('');
 const { handleSubmit, control, formState: { errors }, reset } = useForm(); 
 const [selected, setSelected] = React.useState("");
 const [loading, setLoading] = useState(false);
 const [successMessage, setSuccessMessage] = useState(false);
 const [isEditing, setIsEditing] = useState(false);
 const [selectedImage, setSelectedImage] = useState(null);
 const userRole = useSelector((state) => state.user.role);
 const pricePlaceholder = `Price in ${storeCurrency || 'Currency'}`;

 useEffect(() => {
}, [selectedImage]); 
const [originalBarcode, setOriginalBarcode] = useState(product.barcode);

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

const checkBarcodeExists = async (barcode) => {
  try {
    const graphqlResult = await client.graphql({
      query: ProductByBarcode,
      variables: { barcode: barcode },
      authMode: 'apiKey',
    });

    const products = graphqlResult.data.productByBarcode.items;
    return products.length > 0;
  } catch (error) {
    console.error('Error querying product by barcode:', error);
    throw new Error('Failed to check barcode uniqueness');
  }
};
useEffect(() => {
  if (route.params?.item) {
    setOriginalBarcode(product.barcode);
    setProductInput({
      id: product.id,
      name: product.name,
      barcode: product.barcode,
      price: product.price,
      manufacturer: product.manufacturer,
      category: categoryName ? categoryName : product.category,
      warehouseQuantity: product.warehouseQuantity,
      shelfQuantity: product.shelfQuantity,
      shelfInventoryLimit:product.shelfInventoryLimit,
      warehouseInventoryLimit:product.warehouseInventoryLimit,
      image: product.image,
      _version: product._version,
    });
    console.log("Product",productInput);
  }

  if (route.params?.categoryId && route.params?.categoryName) {
    setCategoryName(route.params.categoryName);
  }
}, [route.params]);
const [productInput, setProductInput] = useState({
  id:product.id,
  name: product.name,
  barcode: product.barcode,
  price: product.price,
  manufacturer: product.manufacturer,
  category: categoryName ? categoryName : product.category,
  warehouseQuantity: product.warehouseQuantity,
  shelfQuantity: product.shelfQuantity,
  image: product.image,
  shelfInventoryLimit:product.shelfInventoryLimit,
  warehouseInventoryLimit:product.warehouseInventoryLimit,
  _version:product._version,
  
});
useEffect(() => {
  setCategoryName('');
}, [product,startingProductImageUrl]);

useEffect(() => {
  setProductInput({
    id: product.id,
    name: product.name,
    barcode: product.barcode,
    price: product.price,
    manufacturer: product.manufacturer,
    category:categoryName ? categoryName : product.category,
    warehouseQuantity: product.warehouseQuantity,
    shelfQuantity: product.shelfQuantity,
    shelfInventoryLimit:product.shelfInventoryLimit,
    warehouseInventoryLimit:product.warehouseInventoryLimit,
    image: product.image,
    _version: product._version,
  });
  setOriginalBarcode(product.barcode);
}, [product,startingProductImageUrl]);


  const handleChoosePhoto = () => {
    launchImageLibrary({}, (response) => {
      console.log(response);
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        console.log("local @@@@@@@@"+imageUri);
        setProductInput(prevState => ({
          ...prevState,
          image: imageUri,
        }));
      } else {
        console.log('No image selected or unexpected response structure');
      }
    });
  };
  const extractFilename = (url) => {
    console.log("url product",url);
    const regex = /[\w-]+\.jpeg/;
    const matches = url.match(regex);
    return matches ? matches[0] : null;
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => confirmDelete() },
      ],
      { cancelable: false }
    );
  };
  const confirmDelete = async () => {
    setLoading(true);
    console.log("trying to delete : " + productInput.id);
    const deleteProductInput = {
      id: product.id,
      _version: product._version,
    };

    try {
        await client.graphql({
            query: deleteProduct,
            variables: {input:deleteProductInput},
            authMode:'apiKey'
        });

        console.log('Product deleted successfully.');
        setLoading(false);
        Alert.alert(
          'Deletion Successful',
          'The product is deleted successfully');
        navigation.navigate("ProductsList");
    } catch (error) {
        console.error('Error deleting product:', error);
        setLoading(false);
        Alert.alert(
          'Deletion Unsuccessful',
          'The product deletion failed!')
    }
    try {
      const fileName=extractFilename(productInput.image);
      console.log("xxxx1"+fileName);
      await remove({ key: fileName});
    } catch (error) {
      console.log('Error ', error);
    }
};
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
  
  const handleLoading = () => {
    setLoading(true)
    setSuccessMessage(true);
  }
  const handleSuccessButtonPress= () => {
    setLoading(false)
    setSuccessMessage(false);
    navigation.navigate("ProductsList");

  }

const UploadNewImage=async()=>{
  try {
    const fileName = `product-image-${Date.now()}.jpeg`;
    console.log('Uploading new image...');
    const fileKey = await uploadImageToS3(productInput.image, fileName);
    console.log('New image uploaded with key:', fileKey);
    const newImageUrl = await getImageUrlFromS3(fileKey);
  
    console.log("New Image URL:", newImageUrl);
    console.log("New Image URL String ****:", newImageUrl);
    return newImageUrl.toString();
  } catch (error) {
    console.error("An error occurred during the upload process:", error);
}
}
const handleUpdateData = async () => {
  setLoading(true);
  
  const barcodeChanged = productInput.barcode !== originalBarcode;
  const barcodeExists = barcodeChanged && await checkBarcodeExists(productInput.barcode);
  console.log(productInput.barcode);
  console.log(productInput.originalBarcode);
  console.log(barcodeChanged);
  if (barcodeExists) {
    Alert.alert('Barcode already exists', 'The entered barcode is already in use by another product. Please use a different barcode.');
    setLoading(false);
    return;
  }

  if (startingProductImageUrl !== productInput.image) {
    try {
      const fileName=extractFilename(startingProductImageUrl);
      console.log("xxxx1"+fileName);
      await remove({ key: fileName});
    } catch (error) {
      console.log('Error ', error);
    }
    try {
      const newImageFromS3=await UploadNewImage();
      console.log("navi image ********"+newImageFromS3);
      
      console.log("Updated productInput with old image:", productInput.image);
      productInput.image=newImageFromS3;
      setStartingProductImageUrl(newImageFromS3);
       console.log("Updated productInput with new image:", productInput.image);
      
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  }   
  try {
    console.log('Updating product with input:', productInput);
    const updatedProduct = await client.graphql({
      query: updateProduct,
      variables: { input: {
        id:productInput.id,
        name:productInput.name,
        barcode:productInput.barcode,
        price:productInput.price,
        manufacturer:productInput.manufacturer,
        category:categoryName ? categoryName : productInput.category,
        warehouseQuantity:productInput.warehouseQuantity,
        shelfQuantity:productInput.shelfQuantity,
        image:productInput.image,
        _version:productInput._version,
        shelfInventoryLimit:productInput.shelfInventoryLimit,
        warehouseInventoryLimit:productInput.warehouseInventoryLimit,
      }},
      authMode: 'apiKey',
    });
    const up=updatedProduct.data.updateProduct;
    if (up && up.shelfQuantity <= up.shelfInventoryLimit) {
      const notificationInput = {
        input: {
          warehousequanity: up.warehouseQuantity,
          shelfquantity: up.shelfQuantity, 
          productID: up.id,
          productname: up.name, 
          isRead: false,
          isWarehouseNotification: false, 
          isShelfNotification: true, 
        },
        authMode: 'apiKey',
      };
      try {
        const newNotification = await client.graphql({
          query: createNotifications,
          variables: notificationInput,
        });
      
        console.log('New Notification:', newNotification);
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    }
    if (up && up.warehouseQuantity <= up.warehouseInventoryLimit) {
      const notificationInput = {
        input: {
          warehousequanity: up.warehouseQuantity,
          shelfquantity: up.shelfQuantity, 
          productID: up.id,
          productname: up.name, 
          isRead: false,
          isWarehouseNotification: true, 
          isShelfNotification:false, 
        },
        authMode: 'apiKey',
      };
      try {
        const newNotification = await client.graphql({
          query: createNotifications,
          variables: notificationInput,
        });
      
        console.log('New Notification:', newNotification);
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    }
    setOriginalBarcode(productInput.barcode);
    console.log('Updated Product:', updatedProduct);
    setIsEditing(false);
    setSuccessMessage(true);
    
  } catch (error) {
    setLoading(false);
    console.error('Error updating product:', error);
  }
};
  const onSubmit = async (data) => {
    handleUpdateData();
  };
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
        fill={100}
        duration={3000} 
        delay={0}
        tintColor={COLORS.secondary}
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#3d5875" 
      />
    <View style={styles.successMessageContainer}>
      {successMessage ? (  <Text style={styles.loadingText}>Product Updated</Text>):(  <Text style={styles.loadingText}>Updating Product</Text>)}
      {successMessage && <TouchableOpacity
        style={styles.successButton}
        onPress={handleSuccessButtonPress}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>}
    </View>
      </View>
     )}
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.arrowBack}  onPress={()=> navigation.navigate('ProductsList')}>
                    <Ionic size={25} color='white' name ='chevron-back-outline'/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageContainer} onPress={()=>handleLoading()}>
                <Text style={styles.cashierHeading}>{product.name}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        <View style={styles.listContainer}>
            <ScrollView >
            <View style={styles.cameraContainer}>
              {!isEditing && product.image && (
                  <Image source={{ uri: productInput.image }} onError={(error) => console.log("Image loading error:")} style={styles.productImage} />
              )}
        {isEditing && (
          
            <TouchableOpacity style={styles.imageContainer} onPress={handleChoosePhoto}>
                <Image source={{ uri: productInput.image }} onError={(error) => console.log("Image loading error:")} style={styles.productImage} />
                <Ionic style={styles.plusImage} size={38} color={COLORS.primary} name='add-circle' />
            </TouchableOpacity>
        )}
    {isEditing && (
        <TouchableOpacity>
            <Text style={styles.addPictureText}>change Picture</Text>
        </TouchableOpacity>
    )}
</View>

                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                             <Text style={styles.productHeading}>Name</Text>
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
                      onChangeText={(text) => setProductInput(prevState => ({ ...prevState, name: text }))}
                      value={productInput.name}
                      editable={isEditing}
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
                        <Text style={styles.productHeading}>Barcode</Text>
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
      onChangeText={(text) => setProductInput(prevState => ({ ...prevState, barcode: text }))}
      value={productInput.barcode}
      editable={isEditing}
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
                        <Text style={styles.productHeading}>Manufacturer</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Controller
  control={control}
  render={({ field }) => (
    <TextInput
      style={styles.formInput}
      placeholder='Manufacturer'
      placeholderTextColor='rgba(170, 170, 170,4)'
      onChangeText={(text) => setProductInput(prevState => ({ ...prevState, manufacturer: text }))}
      value={productInput.manufacturer}
      editable={isEditing}
    />
  )}
  name="manufacturer"
  defaultValue=""
/> 
                        </View>
                    </View>
                </View>{isEditing ? (
                  <View style={styles.formInputContainerSelectedCategory}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                        <Text style={styles.productHeading}>Category</Text>
                        </View>
                        <View style={styles.categoryContainer}>
                        <TouchableOpacity style={styles.categoryTextContainer} onPress={()=>navigation.navigate('Categories', { source: 'fromProducts', item: product })}>
                                                                                                

                        <Text style={[styles.categoryText, { top:1,color: categoryName ? 'black' : 'black' }]}> {categoryName ? categoryName : productInput.category} </Text>

                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
) : (
  <View style={styles.formInputContainerSelected}>
    <View style={styles.formInputWrapper}>
      <View style={styles.imageContainer}>
      <Text style={styles.productHeading}>Category</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.formInput}>
          {productInput.category}
        </Text>
      </View>
    </View>
  </View>
)}


                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                        <Text style={styles.productHeading}>Price</Text>
                        </View>
                        <View style={styles.inputContainer}>
                    <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextInput
                        style={styles.formInput}
                        placeholder={pricePlaceholder}
                        placeholderTextColor='rgba(170, 170, 170,4)'
                        onChangeText={(text) => setProductInput(prevState => ({ ...prevState, price: text }))}
                        value={productInput.price.toString()}
                        editable={isEditing}
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
                             <Text style={styles.productHeading}>Warehouse Quantity</Text>
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
                        onChangeText={(text) => setProductInput(prevState => ({ ...prevState, warehouseQuantity: text }))}
                        value={productInput.warehouseQuantity.toString()}
                        editable={isEditing}
                        />
                    )}
                    name="warehouseQuantity"
                    defaultValue=""
                    />
                    {errors.warehouseQuantity && <Text style={styles.errorText}>Warehouse Quantity is required</Text>}
                        </View>
                    </View>
                </View>
                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                        <Text style={styles.productHeading}>Shelf Quantity</Text>
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
                        onChangeText={(text) => setProductInput(prevState => ({ ...prevState, shelfQuantity: text }))}
                        value={productInput.shelfQuantity.toString()}
                        editable={isEditing}
                        />
                    )}
                    name="shelfQuantity"
                    defaultValue=""
                    />
                    {errors.shelfQuantity && <Text style={styles.errorText}>Shelf Quantity is required</Text>}
                        </View>
                    </View>
                </View>
                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                        <Text style={styles.productHeading}>Shelf Limit</Text>
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
                        onChangeText={(text) => setProductInput(prevState => ({ ...prevState, shelfInventoryLimit: text }))}
                        value={(productInput.shelfInventoryLimit || "").toString()}
                      
                        editable={isEditing}
                        />
                    )}
                    name="shelfInventoryLimit"
                    defaultValue=""
                    />
                    {errors.shelfInventoryLimit && <Text style={styles.errorText}>Shelf Min Quantity is required</Text>}
                        </View>
                    </View>
                </View>
                <View style={styles.formInputContainer}>
                    <View style={styles.formInputWrapper}>
                        <View style={styles.imageContainer}>
                        <Text style={styles.productHeading}>Warehouse Limit</Text>
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
                        onChangeText={(text) => setProductInput(prevState => ({ ...prevState, warehouseInventoryLimit: text }))}
                        
                        value={(productInput.warehouseInventoryLimit || "").toString()} 
                        editable={isEditing}
                        />
                    )}
                    name="warehouseInventoryLimit"
                    defaultValue=""
                    />
                    {errors.warehouseInventoryLimit && <Text style={styles.errorText}>Warehouse Min Quantity is required</Text>}
                        </View>
                    </View>
                </View>
                {userRole === 'GENERAL_MANAGER' && (
    <>
                <View style={styles.saveContainer}>
                    <View style={styles.saveWrapper}>
                    <TouchableOpacity 
                      style={styles.resetButton} 
                      onPress={() => {
                          if (isEditing) {
                              handleUpdateData();
                              
                          } else {
                              setIsEditing(true); 
                          }
                      }}
                    >

    <Text style={styles.resetText}>{isEditing ? 'Save' : 'Edit'}</Text>
</TouchableOpacity>

                        <TouchableOpacity style={styles.saveButton} onPress={handleDelete}>
                         <Text style={styles.saveText}>Delete</Text>
                      </TouchableOpacity>
                     {isEditing &&<TouchableOpacity style={styles.resetButton} onPress={()=>setIsEditing(false)}>
                         <Text style={styles.resetText}>Cancel</Text>
                      </TouchableOpacity> } 
                    </View>
                </View>
                </>)}
            </ScrollView>
        </View>
   </View>
  )
}

export default Product

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
        zIndex:-1,
        paddingHorizontal:10,
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
        right:-36,
        bottom:6,
        backgroundColor:'white'
    },
    addPictureText:{
        fontSize:14,
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
    formInputContainerSelected:{
        borderBottomWidth:1,
        borderColor:'lightgray',
        paddingVertical:24,
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
    formInputWrapper:{
        flex:1,
        flexDirection:'row',
        paddingHorizontal:10,
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
    alignItems:'flex-end',
    
},
categoryText:{
  fontFamily:'Poppins-Regular',
  fontSize:18.5,
  color:'black',
  textAlign:'center'
},
    formInput:{
        flex:1,
        fontSize:18.5,
        top:6,
        fontFamily:'Poppins-Regular',
        justifyContent:'center',
        alignItems:'center',
        textAlign:'right',
        color:'black',
       
    },
    formInputSize:{
        flex:1,
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
    productHeading:{
      color:'rgba(180, 180, 180,4)',
      fontSize:18.5,
      fontFamily:'Poppins-Regular',
      top:4,
      justifyContent:'center',
      alignItems:'center',
    },
    productImage: {
      width: 130,
      height: 130,
      borderRadius: 65, // Half of the width/height
      alignSelf: 'center',
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
        width:110,
        paddingVertical:8,
        borderRadius:30,
    },
    resetButton:{
        backgroundColor:'white',
        width:110,
        paddingVertical:8,
        borderRadius:30,
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