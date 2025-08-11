import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const App = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../../assets/blob-removebg-preview.png')} // Replace with your image path
          style={styles.illustration}
        />
      </View>

      {/* Heading */}
      <Text style={styles.heading}>
        Get connected with Lectures and other students around the world
      </Text>

      {/* Terms & Privacy */}
      <Text style={styles.termsText}>Terms & Privacy Policy</Text>

      {/* Start Messaging Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FindInfo')}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  illustrationContainer: {
    marginBottom: 20,
  },
  illustration: {
    width: 300, 
    resizeMode: 'contain',
    bottom: 40
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 30,
    marginHorizontal: 15,
    bottom: 80
  },
  termsText: {
    fontSize: 16,
    color: '#777777',
    marginBottom: 20,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    width: '90%',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems:'center'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;