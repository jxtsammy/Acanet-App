'use client';
import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Check,
  School,
  CreditCard,
  Info,
} from 'lucide-react-native';

// Import Firebase services and functions
import {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIRESTORE_DB,
  FIREBASE_STORAGE
} from '../../../firebaseConfig';

// Import individual Firebase functions
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const RegisterScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [studentId, setStudentId] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'You need to allow access to your photos to select an image.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    // Client-side validation
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !institution.trim() ||
      !studentId.trim() ||
      !bio.trim() ||
      !phoneNumber.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill out all required fields.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Password and Confirm Password do not match.'
      );
      return;
    }

    if (!termsAgreed) {
      Alert.alert(
        'Terms and Conditions',
        'You must agree to the terms and conditions to register.'
      );
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create user with email and password in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;

      // The profileImage state already holds the URI from the device's library.
      // We will simply store this URI directly in Firestore without uploading
      // it to Firebase Storage. This will save money and simplify the process.
      // The user will need to manage image availability on their own device.
      // If profileImage is null, profileImageUrl will be null.
      const profileImageUrl = profileImage;

      // 2. Store additional user data in Firestore
      await setDoc(doc(FIRESTORE_DB, 'students', user.uid), {
        firstName,
        lastName,
        email,
        institution,
        studentId,
        bio,
        phoneNumber,
        profileImageUrl, // Store the local URI or null if no image was selected
        termsAgreed,
        createdAt: new Date(),
      });

      // 3. On successful registration, show success alert and navigate
      Alert.alert(
        'Registration Successful!',
        'Your account has been created.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      // Handle Firebase Auth errors
      let errorMessage = 'Something went wrong. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use!';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      }
      Alert.alert('Registration Failed', errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled =
    isLoading ||
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !institution.trim() ||
    !studentId.trim() ||
    !bio.trim() ||
    !phoneNumber.trim() ||
    !password.trim() ||
    !confirmPassword.trim() ||
    password !== confirmPassword ||
    !termsAgreed;

  return (
    <ImageBackground
      source={require("../../../assets/stbg.jpg")}
      style={styles.backgroundImage}>
      <BlurView intensity={90} tint="dark" style={styles.blurOverlay}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeAreaForBackButton}>
          {/* Top Bar: Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <ArrowLeft size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Header Content: Title, Profile Picture, and Sign In Link */}
        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Student Registration</Text>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={pickImage}>
              <View style={styles.profileImageWrapper}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.smallProfileImage}
                  />
                ) : (
                  <View style={styles.smallIconPlaceholder}>
                    <User size={25} color="#fff" />
                  </View>
                )}
                <View style={styles.smallAddButton}>
                  <Text style={styles.smallAddButtonText}>+</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.signInLinkContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          {/* Form Section - now touches bottom */}
          <View style={styles.formContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              {/* Name Fields Group */}
              <View style={styles.nameFieldsGroup}>
                <View style={styles.inputWrapperHalf}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <View style={styles.inputContainer}>
                    <User size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your first name"
                      placeholderTextColor="#888"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                </View>
                <View style={styles.inputWrapperHalf}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <View style={styles.inputContainer}>
                    <User size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your last name"
                      placeholderTextColor="#888"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>
              </View>

              {/* Student Email Field */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Student Email</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your student email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Academic Information Section */}
              <Text style={styles.sectionTitle}>Academic Information</Text>
              {/* Institution Field */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Institution</Text>
                <View style={styles.inputContainer}>
                  <School size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your institution name"
                    placeholderTextColor="#888"
                    value={institution}
                    onChangeText={setInstitution}
                  />
                </View>
              </View>
              {/* Student ID Field */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Student ID</Text>
                <View style={styles.inputContainer}>
                  <CreditCard size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your student ID"
                    placeholderTextColor="#888"
                    value={studentId}
                    onChangeText={setStudentId}
                  />
                </View>
              </View>
              {/* Bio Field */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Bio</Text>
                <View
                  style={[
                    styles.inputContainer,
                    { height: 120, alignItems: 'flex-start', paddingTop: 12 },
                  ]}>
                  <Info
                    size={20}
                    color="#888"
                    style={[styles.inputIcon, { marginTop: 0 }]}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      { height: 100, textAlignVertical: 'top' },
                    ]}
                    placeholder="Tell us about yourself"
                    placeholderTextColor="#888"
                    multiline
                    value={bio}
                    onChangeText={setBio}
                  />
                </View>
                <Text style={styles.helperText}>
                  This will be visible to other students
                </Text>
              </View>

              {/* Phone Number Field */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Phone size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="(XXX) XXX-XXXX"
                    placeholderTextColor="#888"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Set Password Field */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Set Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="********"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={20} color="#888" />
                    ) : (
                      <Eye size={20} color="#888" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Field */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="********"
                    placeholderTextColor="#888"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#888" />
                    ) : (
                      <Eye size={20} color="#888" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms and Conditions Checkbox */}
              <TouchableOpacity
                style={styles.termsCheckboxContainer}
                onPress={() => setTermsAgreed(!termsAgreed)}>
                <View
                  style={[
                    styles.checkbox,
                    termsAgreed && styles.checkboxChecked,
                  ]}>
                  {termsAgreed && <Check size={16} color="#fff" />}
                </View>
                <Text style={styles.termsText}>
                  By marking this checkbox, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms and Conditions</Text>
                </Text>
              </TouchableOpacity>

              {/* Register Button (now inside ScrollView) */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    isButtonDisabled && styles.registerButtonDisabled,
                  ]}
                  onPress={handleRegister}
                  disabled={isButtonDisabled}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.registerButtonText}>Register</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    flex: 1,
  },
  safeAreaForBackButton: {
    // SafeAreaView now only wraps the topBar
    // It will automatically handle padding for the status bar
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : 60,
  },
  backButton: {
    // No absolute positioning here, part of topBar flex
  },
  profileImageContainer: {
    paddingLeft: 20,
  },
  profileImageWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  smallProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  smallIconPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallAddButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  smallAddButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: Platform.OS === 'ios' ? 15 : StatusBar.currentHeight - 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 36,
    width: '60%',
  },
  signInLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  signInLink: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  nameFieldsGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputWrapperHalf: {
    width: '48%',
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 55,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    height: '100%',
  },
  passwordInput: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    height: '100%',
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    marginLeft: 5,
  },
  termsCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  termsLink: {
    color: '#000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    paddingHorizontal: 0,
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  registerButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonDisabled: {
    backgroundColor: '#000',
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RegisterScreen;
