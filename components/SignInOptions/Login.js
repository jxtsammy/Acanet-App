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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window")

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.")
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Simulate successful login
      const loginSuccess = true // Change to false to test error handling

      if (loginSuccess) {
        navigation.navigate("Home")
      } else {
        alert("Login failed. Please check your credentials.")
      }
    }, 2000) // Simulate 2-second login process
  }

  const isButtonDisabled = isLoading || !email.trim() || !password.trim()

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar barStyle="light-content" />

      {/* Background Image and Blur Overlay */}
      <ImageBackground
        source={require("../../assets/globe.jpg")} // Replace with your actual image path
        style={styles.backgroundImage}
      >
        <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        {/* Replaced ScrollView with a View */}
        <View
          style={styles.contentWrapper} // New style for the main content wrapper
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Title */}
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
          {/* Form Section - now touches sides */}
          <View style={styles.formSection}>
            {/* Content inside form section now has padding */}
            <View style={styles.formContentWrapper}>
              {/* Email Input */}
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

              {/* Password Input */}
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

              {/* Remember Me & Forgot Password */}
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

              {/* Sign In Button */}
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

              {/* Terms */}
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
    backgroundColor: "#1a1a2e", // Fallback background color
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentWrapper: {
    // New style for the main content wrapper
    flexGrow: 1,
    justifyContent: "space-between", // Distribute space between header and form
  },
  headerSection: {
    paddingTop: Platform.OS === "ios" ? 230 : 240, // Adjusted padding for non-scrolling
    paddingHorizontal: 24,
    paddingBottom: 5,
    flexGrow:1
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingBottom: 30,
    // flex: 1, // Removed flex:1 here as contentWrapper now handles flex
  },
  formContentWrapper: {
    paddingHorizontal: 24,
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
    backgroundColor: "#000",
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  termsContainer: {
    alignItems: "center",
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
    paddingBottom: Platform.OS === "ios" ? 0 : 40,
  },
  termsLink: {
    color: "#000",
    fontWeight: "600",
  },
})

export default SignInScreen;