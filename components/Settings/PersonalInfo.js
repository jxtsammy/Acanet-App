import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const PersonalInfoScreen = ({ navigation, route }) => {
  // Get user data from route params or use default values
  const initialUser = route.params?.user || {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    profilePicture: 'https://i.pravatar.cc/150?img=12',
    firstName: 'Alex',
    lastName: 'Johnson',
    institution: 'University of Technology',
    institutionId: 'UT12345',
    bio: 'Software developer with a passion for mobile apps and AI.',
  };

  const [firstName, setFirstName] = useState(initialUser.firstName);
  const [lastName, setLastName] = useState(initialUser.lastName);
  const [email, setEmail] = useState(initialUser.email);
  const [institution, setInstitution] = useState(initialUser.institution);
  const [institutionId, setInstitutionId] = useState(initialUser.institutionId);
  const [bio, setBio] = useState(initialUser.bio);
  const [profilePicture, setProfilePicture] = useState(initialUser.profilePicture);

  // Request permission for accessing the photo library
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to change your profile picture.');
        }
      }
    })();
  }, []);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to select an image.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  // Function to save changes
  const saveChanges = () => {
    if (!firstName || !lastName || !email || !institution || !institutionId || !bio) {
      Alert.alert("Missing Information", "Please fill out all required fields.");
      return;
    }

    if (!profilePicture) {
      Alert.alert("Add Avatar", "We recommend using a picture of your face.");
      return;
    }

    const updatedUser = {
      name: `${firstName} ${lastName}`,
      email: email,
      profilePicture: profilePicture,
      firstName: firstName,
      lastName: lastName,
      institution: institution,
      institutionId: institutionId,
      bio: bio,
    };
    
    // Pass updated user back to the settings screen
    navigation.navigate('Settings', { updatedUser });
    
    // Show success message
    Alert.alert('Success', 'Your personal information has been updated.');
  };

  return (
    <ImageBackground
      source={require('../../assets/globe.jpg')}
      style={styles.backgroundImage}>
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
        style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Personal Information</Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={styles.scrollContent}>
              
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.profileImageWrapper}>
                  {profilePicture ? (
                    <Image source={{ uri: profilePicture }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.iconPlaceholder}>
                      <Icon name="person" size={50} color="#fff" />
                    </View>
                  )}
                  <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.profileNote}>A picture of your face is recommended</Text>
              </View>

              {/* Form Section */}
              <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                {/* Name Fields */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <View style={styles.inputContainer}>
                    <Icon
                      name="person-outline"
                      size={20}
                      color="rgba(255,255,255,0.7)"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your first name"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <View style={styles.inputContainer}>
                    <Icon
                      name="person-outline"
                      size={20}
                      color="rgba(255,255,255,0.7)"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your last name"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Icon 
                      name="mail-outline" 
                      size={20} 
                      color="rgba(255,255,255,0.7)" 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <Text style={styles.helperText}>This will be used for account verification</Text>
                </View>

                <Text style={styles.sectionTitle}>Professional Information</Text>

                {/* Institution Field */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Institution</Text>
                  <View style={styles.inputContainer}>
                    <Icon
                      name="business"
                      size={20}
                      color="rgba(255,255,255,0.7)"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your institution name"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={institution}
                      onChangeText={setInstitution}
                    />
                  </View>
                </View>

                {/* Institution ID Field */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Institution ID</Text>
                  <View style={styles.inputContainer}>
                    <Icon 
                      name="badge" 
                      size={20} 
                      color="rgba(255,255,255,0.7)" 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your institution ID"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={institutionId}
                      onChangeText={setInstitutionId}
                    />
                  </View>
                </View>

                {/* Bio Field */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Professional Bio</Text>
                  <View style={[styles.inputContainer, { height: 120, alignItems: "flex-start", paddingTop: 12 }]}>
                    <Icon
                      name="description"
                      size={20}
                      color="rgba(255,255,255,0.7)"
                      style={[styles.inputIcon, { marginTop: 0 }]}
                    />
                    <TextInput
                      style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                      placeholder="Share your professional background and expertise"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      multiline
                      value={bio}
                      onChangeText={setBio}
                    />
                  </View>
                  <Text style={styles.helperText}>This will be visible to students and colleagues</Text>
                </View>
              </View>

              {/* Save Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 25,
  },
  profileImageWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iconPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  addButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  addButtonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileNote: {
    marginTop: 15,
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    marginTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    height: 55,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    height: "100%",
  },
  helperText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 5,
    marginLeft: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default PersonalInfoScreen;