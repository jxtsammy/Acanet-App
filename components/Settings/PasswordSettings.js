"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  ImageBackground,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { LinearGradient } from "expo-linear-gradient"
import { FIREBASE_AUTH } from "../../firebaseConfig"
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: false,
  })

  // Check password strength and requirements
  useEffect(() => {
    if (newPassword) {
      // Check requirements
      const hasLength = newPassword.length >= 8
      const hasUppercase = /[A-Z]/.test(newPassword)
      const hasLowercase = /[a-z]/.test(newPassword)
      const hasNumber = /[0-9]/.test(newPassword)
      const doPasswordsMatch = newPassword === confirmPassword && newPassword !== ""

      setRequirements({
        length: hasLength,
        uppercase: hasUppercase,
        lowercase: hasLowercase,
        number: hasNumber,
        match: doPasswordsMatch,
      })

      // Calculate strength (0-3)
      let strength = 0
      if (hasLength) strength++
      if (hasUppercase && hasLowercase) strength++
      if (hasNumber) strength++

      setPasswordStrength(strength)
    } else {
      setPasswordStrength(0)
      setRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        match: false,
      })
    }
  }, [newPassword, confirmPassword])

  const changePassword = async () => {
    // Validate current password
    if (!currentPassword) {
      Alert.alert("Error", "Please enter your current password.")
      return
    }

    // Check if new password meets requirements
    if (passwordStrength < 2) {
      Alert.alert("Weak Password", "Please create a stronger password that meets all requirements.")
      return
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords Don't Match", "Your new password and confirmation do not match.")
      return
    }

    setIsLoading(true)

    try {
      const user = FIREBASE_AUTH.currentUser

      if (!user || !user.email) {
        Alert.alert("Error", "No user is currently logged in.")
        setIsLoading(false)
        return
      }

      // Create credential for reauthentication
      const credential = EmailAuthProvider.credential(user.email, currentPassword)

      // Reauthenticate user with current password
      await reauthenticateWithCredential(user, credential)

      // If reauthentication successful, update password
      await updatePassword(user, newPassword)

      Alert.alert("Password Changed", "Your password has been updated successfully.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error("Password change error:", error)

      let errorMessage = "An error occurred while changing your password."

      if (error.code === "auth/wrong-password") {
        errorMessage = "Your current password is incorrect."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "The new password is too weak."
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please log out and log back in before changing your password."
      }

      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Get strength label and color
  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return { label: "Very Weak", color: "#FF3B30" }
      case 1:
        return { label: "Weak", color: "#FF9500" }
      case 2:
        return { label: "Medium", color: "#FFCC00" }
      case 3:
        return { label: "Strong", color: "#34C759" }
      default:
        return { label: "Very Weak", color: "#FF3B30" }
    }
  }

  // Render a requirement item
  const renderRequirement = (text, met) => (
    <View style={styles.requirementItem}>
      <Icon name={met ? "check-circle" : "cancel"} size={16} color={met ? "#34C759" : "#FF3B30"} />
      <Text style={[styles.requirementText, { color: met ? "#34C759" : "#FF3B30" }]}>{text}</Text>
    </View>
  )

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
            <Text style={styles.headerText}>Change Password</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Security Icon */}
            <View style={styles.securityIconContainer}>
              <Icon name="security" size={60} color="#fff" />
              <Text style={styles.securityText}>Create a strong password to protect your account</Text>
            </View>

            {/* Password Form */}
            <View style={styles.formContainer}>
              {/* Current Password */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <View style={styles.passwordInputContainer}>
                  <Icon name="lock" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your current password"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <Icon
                      name={showCurrentPassword ? "visibility-off" : "visibility"}
                      size={20}
                      color="rgba(255,255,255,0.7)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <Icon name="lock" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your new password"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Icon
                      name={showNewPassword ? "visibility-off" : "visibility"}
                      size={20}
                      color="rgba(255,255,255,0.7)"
                    />
                  </TouchableOpacity>
                </View>

                {/* Password Strength Indicator */}
                {newPassword.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <Text style={styles.strengthLabel}>
                      Strength: <Text style={{ color: getStrengthLabel().color }}>{getStrengthLabel().label}</Text>
                    </Text>
                    <View style={styles.strengthBar}>
                      <View
                        style={[
                          styles.strengthFill,
                          {
                            width: `${(passwordStrength / 3) * 100}%`,
                            backgroundColor: getStrengthLabel().color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.passwordInputContainer}>
                  <Icon name="lock" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your new password"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Icon
                      name={showConfirmPassword ? "visibility-off" : "visibility"}
                      size={20}
                      color="rgba(255,255,255,0.7)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <View style={styles.requirementsList}>
                  {renderRequirement("At least 8 characters", requirements.length)}
                  {renderRequirement("At least one uppercase letter", requirements.uppercase)}
                  {renderRequirement("At least one lowercase letter", requirements.lowercase)}
                  {renderRequirement("At least one number", requirements.number)}
                  {renderRequirement("Passwords match", requirements.match)}
                </View>
              </View>
            </View>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { opacity: passwordStrength >= 2 && requirements.match && !isLoading ? 1 : 0.7 },
                ]}
                onPress={changePassword}
                disabled={passwordStrength < 2 || !requirements.match || isLoading}
              >
                <Text style={styles.saveButtonText}>{isLoading ? "Updating Password..." : "Update Password"}</Text>
              </TouchableOpacity>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() => Alert.alert("Forgot Password", "A password reset link will be sent to your email.")}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot your current password?</Text>
            </TouchableOpacity>
          </ScrollView>
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
  securityIconContainer: {
    alignItems: "center",
    marginVertical: 30,
    paddingHorizontal: 40,
  },
  securityText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
  },
  formContainer: {
    paddingHorizontal: 20,
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
  passwordInputContainer: {
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
  strengthContainer: {
    marginTop: 10,
  },
  strengthLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  strengthBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 3,
  },
  requirementsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  requirementsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  requirementsList: {
    marginTop: 5,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
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
  forgotPasswordLink: {
    alignItems: "center",
    marginTop: 20,
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
})

export default ChangePasswordScreen