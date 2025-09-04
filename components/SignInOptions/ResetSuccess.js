"use client"

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  Image,
} from "react-native"

const { width, height } = Dimensions.get("window")

const AnimatedSuccessScreen = ({ navigation, route }) => {
  const {
    title = "Success!",
    subtitle = "Check your email for your password reset link to set new password",
    buttonText = "Continue",
    onContinue,
    navigateTo = "Login",
  } = route?.params || {}

  const handleContinue = () => {
    if (onContinue && typeof onContinue === "function") {
      onContinue()
    } else if (navigation) {
      if (navigation.reset) {
        navigation.reset({
          index: 0,
          routes: [{ name: navigateTo }],
        })
      } else {
        navigation.navigate(navigateTo)
      }
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Success Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image source={require("../../assets/fpi.png")} style={styles.successImage} resizeMode="contain" />
          </View>
        </View>

        {/* Success Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
            <Text style={styles.continueButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  successImage: {
    width: 350,
    height: 250,
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 80,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    color: "#666",
    textAlign: "center",
    lineHeight: 26,
    maxWidth: width,
  },
  buttonContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 30,
    left: 20,
    right: 20,
  },
  continueButton: {
    backgroundColor: "#000",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "600",
  },
})

export default AnimatedSuccessScreen
