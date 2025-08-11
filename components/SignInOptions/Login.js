"use client"
import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ImageBackground,
} from "react-native"
import { BlurView } from "expo-blur"
import { Eye, EyeOff } from "lucide-react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { FIREBASE_AUTH } from "../../firebaseConfig"

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window")

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const auth = FIREBASE_AUTH

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  const handleSignIn = async () => {
    setErrorMessage(null)
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.")
      return
    }
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigation.navigate("Home")
    } catch (error) {
      console.error("Firebase Sign-In Error:", error.code, error.message)
      switch (error.code) {
        case "auth/invalid-email":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setErrorMessage("Invalid email or password.")
          break
        case "auth/invalid-credential":
          setErrorMessage("Invalid email or password.")
          break
        case "auth/too-many-requests":
          setErrorMessage("Too many login attempts. Please try again later.")
          break
        default:
          setErrorMessage("Login failed. Please try again.")
          break
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isButtonDisabled = isLoading || !email.trim() || !password.trim()

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust offset if needed
    >
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require("../../assets/globe.jpg")} style={styles.backgroundImage}>
        <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
      </ImageBackground>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.contentWrapper}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Sign in to your{"\n"}Account</Text>
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("StudentRegisterInfo")}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.formContentWrapper}>
              {errorMessage && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.signInButton, isButtonDisabled && styles.signInButtonDisabled]}
                onPress={handleSignIn}
                disabled={isButtonDisabled}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By signing in, you agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Data Processing Agreement</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentWrapper: {
    flex: 1, // Takes full height
    justifyContent: "flex-end", // Pushes form to bottom, header to top
  },
  headerSection: {
    flex: 0.4, // Takes 40% of available space
    justifyContent: "flex-end", // Pushes content to the bottom of its flex container
    paddingHorizontal: 24,
    paddingBottom: 20, // Add some padding at the bottom of the header
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 44,
    marginBottom: 16,
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  signUpLink: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  formSection: {
    flex: 0.6, // Takes 60% of available space
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingBottom: 30,
    justifyContent: "space-between", // Distribute content vertically within the form
  },
  formContentWrapper: {
    paddingHorizontal: 24,
    flexGrow: 1, // Allows content to grow and push terms to bottom
    justifyContent: "space-between", // Distribute content vertically
  },
  errorContainer: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF0000",
    alignItems: "center",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 18,
    padding: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  rememberMeText: {
    fontSize: 14,
    color: "#6B7280",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
  },
  signInButton: {
    height: 56,
    borderRadius: 30,
    marginBottom: 32,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  signInButtonDisabled: {
    backgroundColor: "#000", // Keep same color, but opacity might be added by React Native
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  termsContainer: {
    alignItems: "center",
    marginTop: "auto", // Pushes to the bottom of formContentWrapper
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
    paddingBottom: Platform.OS === "ios" ? 0 : 40, // Keep original platform specific padding
  },
  termsLink: {
    color: "#000",
    fontWeight: "600",
  },
})

export default SignInScreen
