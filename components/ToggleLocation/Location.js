import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';


const LocationPermissionScreen = ({navigation}) => {

 const enableLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status == 'granted') {
      let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    navigation.navigate('Login')
    }else{
      alert('Please turn on location or skip')
    }
     
  }

  return (
    <SafeAreaView style={styles.container}>
            <View style={styles.illustrationContainer}>
        <Image
          source={require('../../assets/istockphoto-1390124452-612x612-removebg-preview.png')} // Replace with your actual iage path
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.title}>Our App would like to access your location for user discovery</Text>
      </View>

      <TouchableOpacity
        style={styles.getStartedButton} onPress={enableLocation}>
        <Text style={styles.getStartedText} >Allow Location</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.skip}>Skip for now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWrap: 1,
    textAlign: 'center',
    color: '#333',
    marginBottom: 100,
    marginTop: 20,
    fontWeight:'bold'
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 1000,
    height: 350,
  },
  getStartedButton: {
    width: '90%',
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
  },
  skip:{
    marginTop: 10,
    marginBottom: 30,
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold'
  }
});

export default LocationPermissionScreen;