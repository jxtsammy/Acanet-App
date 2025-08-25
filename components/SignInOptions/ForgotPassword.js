"use client"

import React, { useState, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native"
import { ArrowLeft } from "lucide-react-native"
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"

// Importing Firebase services from your external file.
// Adjust the path below to match your project structure.
// NOTE: Make sure your firebaseConfig file also exports FIRESTORE_DB and FIREBASE_APP
import { FIRESTORE_DB, FIREBASE_APP } from "../../firebaseConfig"

// Get the Firebase Auth instance
const FIREBASE_AUTH = getAuth(FIREBASE_APP);

const ForgotPasswordScreen = ({ navigation }) => {
  // Forgot password step state
  const [email, setEmail] = useState("")
  // The state variable name has been updated for clarity
  const [enteredId, setEnteredId] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)

  // Refs for input focus management
  const enteredIdRef = useRef(null)

  const handleBackPress = () => {
    navigation.goBack()
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleForgotPasswordContinue = async () => {
    // Validate inputs
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    if (!enteredId.trim()) {
      Alert.alert("Error", "Please enter your Student ID or Work ID")
      return
    }

    setForgotLoading(true)

    try {
      // Query Firestore for a user document where the email matches the entered email.
      const usersRef = collection(FIRESTORE_DB, "users")
      const q = query(usersRef, where("email", "==", email.toLowerCase()))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        Alert.alert("Error", "User isn't found.")
        return
      }

      // Get the user document and verify the ID based on the user's role
      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data()

      // Log all relevant data for debugging
      console.log("--- Debugging Forgot Password Check ---");
      console.log("Database user data:", userData);
      console.log("Entered email:", email);
      console.log("Entered ID:", enteredId);

      // Normalize the entered ID and database IDs for a reliable comparison
      const normalizedEnteredId = enteredId.trim().toLowerCase();
      const normalizedStudentId = userData.studentId?.trim().toLowerCase();
      const normalizedWorkId = userData.workId?.trim().toLowerCase();

      console.log("Normalized entered ID:", normalizedEnteredId);
      console.log("Normalized student ID from DB:", normalizedStudentId);
      console.log("Normalized work ID from DB:", normalizedWorkId);

      let isIdCorrect = false;
      // Normalize the userRole from the database to ensure case-insensitive matching
      const userRole = userData.userRole?.toLowerCase();

      if (userRole === "student" && normalizedStudentId === normalizedEnteredId) {
        isIdCorrect = true;
      } else if (userRole === "lecturer" && normalizedWorkId === normalizedEnteredId) {
        isIdCorrect = true;
      }

      console.log("Is ID correct?", isIdCorrect);

      if (!isIdCorrect) {
        Alert.alert("Error", "User isn't found.")
        return;
      }

      // If everything is correct, send the password reset email
      await sendPasswordResetEmail(FIREBASE_AUTH, email.toLowerCase())
      Alert.alert("Success", "A password reset link has been sent to your email. Please check your inbox.")

      // Navigate to a success screen or back to the login screen
      navigation.navigate("ResetSuccess")

    } catch (error) {
      console.error("Forgot password error:", error)
      Alert.alert("Error", "Failed to verify your information. Please try again.")
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 10}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.illustrationContainer}>
              {/* Note: The 'require' for local assets is replaced with a placeholder URL
              for this environment. You should change this back in your project. */}
              <Image source={require("../../assets/rsi.png")} style={styles.illustrationImage} resizeMode="contain" />
            </View>

            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and ID to verify your identity and receive a password reset link
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Account Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => enteredIdRef.current?.focus()}
                editable={!forgotLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Student ID / Work ID</Text>
              <TextInput
                ref={enteredIdRef}
                style={styles.input}
                placeholder="Enter your Student ID or Work ID"
                placeholderTextColor="#999"
                value={enteredId}
                onChangeText={setEnteredId}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="done"
                editable={!forgotLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.continueButton, forgotLoading && styles.continueButtonDisabled]}
              onPress={handleForgotPasswordContinue}
              disabled={forgotLoading}
            >
              {forgotLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Platform.OS === "ios" ? 600 : 550,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
    height: 250,
  },
  illustrationImage: {
    width: "90%",
    height: "100%",
    maxWidth: 400,
    maxHeight: 250,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "left",
    width: '100%',
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "left",
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 10,
    width: '100%',
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  continueButton: {
    backgroundColor: "#000",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    width: "100%",
    marginTop: 10,
    marginBottom: 30
  },
  continueButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
})

export default ForgotPasswordScreen
