import React from 'react';
import {View, Text, Image, TouchableOpacity,ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../assets/theme/index';
const AboutScreen = () => {
  return (
    <ScrollView>

    
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 40,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../assets/images/1.png')}
          style={{width: 100, height: 100}}
        />
        <Text
          style={{
            color: COLORS.primary,
            fontWeight: 'bold',
            fontSize: 28,
            marginLeft: 10,
          }}>
          ZAIF
        </Text>
      </View>

      <Text
        style={{
          color: COLORS.primary,
          textAlign: 'center',
          marginTop: 20,
          fontSize: 12.5,
          fontFamily:'Poppins-Regular'
        }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor
        tristique felis, at fermentum ligula cursus id. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Nullam auctor tristique felis, at
        fermentum ligula cursus id. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Nullam auctor tristique felis, at fermentum ligula
        cursus id.
      </Text>

      <View style={{flexDirection: 'column', marginTop: 20}}>
        <View
          style={{
            backgroundColor: '#DEF9FB',
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <Text style={{color: COLORS.primary,fontFamily:'Poppins-Regular',top:1,marginLeft:5}}>Version 1.0.0.0</Text>
        </View>
        <View
          style={{backgroundColor: '#DEF9FB', padding: 10, borderRadius: 10}}>
          <TouchableOpacity>
            <Text style={{color: COLORS.primary,fontFamily:'Poppins-Regular',top:1,marginLeft:5}}>Advertise with us</Text>
          </TouchableOpacity>
        </View>


      <Text
        style={{
          color: COLORS.primary,
          marginTop: 30,
          textAlign: 'left',
          fontSize:19.5,
          color:COLORS.primary,
          fontFamily:'Poppins-SemiBold',
        }}>
        Connect with us
      </Text>

      <View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#DEF9FB',
            padding: 10,
            borderRadius: 10,
            marginVertical: 10,
          }}>
          <Ionicons name="mail-outline" size={30} color={COLORS.primary} />
          <Text style={{color: COLORS.primary, marginLeft: 10,fontFamily:'Poppins-Regular',top:1}}>
            Contact us
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#DEF9FB',
            padding: 10,
            borderRadius: 10,
           marginVertical: 6,
          }}>
          <Ionicons name="logo-facebook" size={30} color={COLORS.primary} />
          <Text style={{color: COLORS.primary, marginLeft: 10,fontFamily:'Poppins-Regular',top:1}}>
            Join us on Facebook
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#DEF9FB',
            padding: 10,
            borderRadius: 10,
            marginVertical: 6,
          }}>
          <Ionicons name="logo-instagram" size={30} color={COLORS.primary} />
          <Text style={{color: COLORS.primary, marginLeft: 10,fontFamily:'Poppins-Regular',top:1}}>
            Join us on Instagram
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#DEF9FB',
            padding: 10,
            borderRadius: 10,
            marginVertical: 6,
          }}>
          <Ionicons name="logo-youtube" size={30} color={COLORS.primary} />
          <Text style={{color: COLORS.primary, marginLeft: 10,fontFamily:'Poppins-Regular',top:1}}>
            Subscribe on YouTube
          </Text>
        </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#DEF9FB',
          padding: 10,
          borderRadius: 10,
          marginTop: 6,
          marginBottom:12,
        }}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'logo-apple' : 'logo-google-playstore'}
          size={30}
          color={COLORS.primary}
        />
        <Text style={{color: COLORS.primary, marginLeft: 10,fontFamily:'Poppins-Regular',top:1}}>
          Rate us on {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}
        </Text>
      </TouchableOpacity>
    </View>
    </View>
    </View>
    </ScrollView>
  );
};

export default AboutScreen;