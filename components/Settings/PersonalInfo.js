"use client"

import { useState, useEffect } from "react"
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
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { LinearGradient } from "expo-linear-gradient"
import * as ImagePicker from "expo-image-picker"
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_STORAGE } from "../../firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

const PersonalInfoScreen = ({ navigation, route }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [institution, setInstitution] = useState("")
  const [institutionId, setInstitutionId] = useState("")
  const [bio, setBio] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [workEmail, setWorkEmail] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser)
        await loadUserData(firebaseUser)
      }
    })

    return () => unsubscribe()
  }, [])

  const loadUserData = async (user) => {
    try {
      console.log("Loading user data for UID:", user.uid)

      // Check lecturers collection first
      const lecturerDoc = await getDoc(doc(FIRESTORE_DB, "lecturers", user.uid))

      if (lecturerDoc.exists()) {
        const userData = lecturerDoc.data()
        console.log("Found lecturer data:", userData)

        setUserType("lecturer")
        setFirstName(userData.firstName || "")
        setLastName(userData.lastName || "")
        setEmail(userData.workEmail || userData.email || "")
        setInstitution(userData.institution || "")
        setInstitutionId(userData.workId || "")
        setBio(userData.bio || "")
        setProfilePicture(userData.profileImageUrl || "")
        setWorkEmail(userData.workEmail || "")
        return
      }

      // Check students collection
      const studentDoc = await getDoc(doc(FIRESTORE_DB, "students", user.uid))

      if (studentDoc.exists()) {
        const userData = studentDoc.data()
        console.log("Found student data:", userData)

        setUserType("student")
        setFirstName(userData.firstName || "")
        setLastName(userData.lastName || "")
        setEmail(userData.email || "")
        setInstitution(userData.institution || "")
        setInstitutionId(userData.studentId || "")
        setBio(userData.bio || "")
        setProfilePicture(userData.profileImageUrl || "")
        setWorkEmail("")
      } else {
        console.log("No user data found in either collection")
        Alert.alert("Error", "User data not found")
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      Alert.alert("Error", "Failed to load user data")
    }
  }

  // Request permission for accessing the photo library
  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to change your profile picture.")
        }
      }
    })()
  }, [])

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to select an image.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePicture(result.assets[0].uri)
    }
  }

  const uploadProfilePicture = async (uri) => {
    if (!uri || !currentUser) return null

    try {
      const response = await fetch(uri)
      const blob = await response.blob()

      const storageRef = ref(FIREBASE_STORAGE, `profile_pictures/${currentUser.uid}`)
      await uploadBytes(storageRef, blob)

      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      throw error
    }
  }

  const saveChanges = async () => {
    if (!firstName || !lastName || !email || !institution || !institutionId || !bio) {
      Alert.alert("Missing Information", "Please fill out all required fields.")
      return
    }

    if (!currentUser || !userType) {
      Alert.alert("Error", "User authentication error. Please try again.")
      return
    }

    setLoading(true)

    try {
      let profileImageUrl = profilePicture

      // Upload new profile picture if it's a local URI
      if (profilePicture && profilePicture.startsWith("file://")) {
        profileImageUrl = await uploadProfilePicture(profilePicture)
      }

      // Prepare update data based on user type
      const updateData = {
        firstName,
        lastName,
        institution,
        bio,
        profileImageUrl,
      }

      // Add type-specific fields
      if (userType === "student") {
        updateData.studentId = institutionId
        updateData.email = email
      } else if (userType === "lecturer") {
        updateData.workId = institutionId
        updateData.workEmail = email
        updateData.email = email // Keep both for compatibility
      }

      // Update the appropriate collection
      const collectionName = userType === "lecturer" ? "lecturers" : "students"
      await updateDoc(doc(FIRESTORE_DB, collectionName, currentUser.uid), updateData)

      // Navigate back to settings
      navigation.goBack()

      // Show success message
      Alert.alert("Success", "Your personal information has been updated.")
    } catch (error) {
      console.error("Error saving user data:", error)
      Alert.alert("Error", "Failed to save changes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground source={require("../../assets/globe.jpg")} style={styles.backgroundImage}>
      <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Personal Information</Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
                    <Icon name="person-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
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
                    <Icon name="person-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
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
                  <Text style={styles.inputLabel}>{userType === "lecturer" ? "Work Email" : "Email"}</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="mail-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={userType === "lecturer" ? "Enter your work email" : "Enter your email"}
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
                    <Icon name="business" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
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
                  <Text style={styles.inputLabel}>{userType === "lecturer" ? "Work ID" : "Student ID"}</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="badge" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={`Enter your ${userType === "lecturer" ? "work" : "student"} ID`}
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
                <TouchableOpacity
                  style={[styles.saveButton, loading && { opacity: 0.7 }]}
                  onPress={saveChanges}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save Profile"}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  )
}

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
    paddingTop: Platform.OS === "ios" ? 20 : 40,
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
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
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
})

export default PersonalInfoScreen
