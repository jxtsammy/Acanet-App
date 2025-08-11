import React, { useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  PanResponder,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const GetSignedUp = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Navigation Container */}
        <View style={styles.navContainer}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigation.navigate('LecturerRegisterInfo')}
            activeOpacity={0.7}
          >
            <Text style={styles.nextText}>Lecturer Signup</Text>
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../assets/studentImg.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Register as Student</Text>
            <Text style={styles.subtitle}>
              Sign up and join our network and get connected to lecturers and other students all around the world.
            </Text>
          </View>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('StudentRegistration')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Student SignUp</Text>
            <View style={styles.arrowContainer}>
              <ArrowRight size={20} color="#000" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    paddingBottom: 10,
    zIndex: 1,
  },
  navButton: {
    padding: 12,
    borderRadius: 8,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 40 : 10,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: height * 0.4,
    width: '100%',
  },
  illustration: {
    width: width * 3,
    height: '100%',
    maxHeight: 300,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 28 : 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: Platform.OS === 'ios' ? 16 : 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c4c4c4',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'ios' ? 16 : 17,
    paddingHorizontal: 32,
    borderRadius: 50,
    minWidth: width * 0.8,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    marginBottom: Platform.OS === 'ios' ? 10 : 35
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  arrowContainer: {
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
  },
});

export default GetSignedUp;