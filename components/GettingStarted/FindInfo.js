import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  ImageBackground,
} from "react-native"
import { ArrowRight } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

const SearchIntro = ({ navigation }) => {
  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../assets/world.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        />
      </ImageBackground>

      {/* Content inside SafeAreaView */}
      <SafeAreaView style={styles.safeAreaContent}>
        <View style={styles.contentContainer}>
          {/* Heading */}
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Get connected with Lecturers and Students All round the world in one App</Text>
          </View>
        </View>
        {/* Bottom Section */}
        <View style={styles.bottomContainer}>
          {/* Terms & Privacy */}
          <TouchableOpacity
            style={styles.termsContainer}
            activeOpacity={0.7}
            onPress={() => {
              // Navigate to terms and privacy screen
              // navigation.navigate('TermsAndPrivacy');
            }}
          >
            <Text style={styles.termsText}>Terms & Privacy Policy</Text>
          </TouchableOpacity>
          {/* Get Started Button */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Location")} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Get Started</Text>
            <View style={styles.arrowContainer}>
              <ArrowRight size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeAreaContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between", // Pushes content to top and bottom
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end", 
  },
  textContainer: {
    alignItems: "flex-start", // Corrected: Use 'flex-start' for left-aligned content
    paddingHorizontal: 5,
  },
  heading: {
    fontSize: 30,
    textAlign: "left",
    color: "#ffffff",
    fontWeight: "bold",
    lineHeight: 30,
    marginHorizontal: 25,
    marginBottom: 80
  },
  bottomContainer: {
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 0 : 30,
  },
  termsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  termsText: {
    fontSize: 16,
    color: "#cccccc",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Platform.OS === "ios" ? 16 : 17,
    paddingHorizontal: 32,
    borderRadius: 50,
    minWidth: width * 0.8,
    position: "relative",
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
    marginBottom: Platform.OS === "ios" ? 10 : 35,
  },
  buttonText: {
    color: "#000",
    fontSize: Platform.OS === "ios" ? 18 : 16,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  arrowContainer: {
    backgroundColor: "#000",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 8,
  },
})

export default SearchIntro