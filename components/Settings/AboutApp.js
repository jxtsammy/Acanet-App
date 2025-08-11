"use client"

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  ScrollView,
  Linking,
  Image,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { BlurView } from "expo-blur"

const AboutScreen = ({ navigation }) => {
  // User profile information
  const profile = {
  name: "thegr8kid",
  email: "robertflames001@gmail.com",
  bio: `Hi there! I'm thrilled to introduce you to Acanet — a platform I helped create with one simple goal in mind: to make communication between students and lecturers seamless, fast, and more meaningful.

At its core, Acanet is a real-time chat system built specifically for academic environments. Whether you're trying to ask a quick question about an assignment, clarify a lecture point, or just stay connected, Acanet makes those conversations instant and organized.

But we didn’t stop there.

We know how frustrating it can be to locate a class or find a lecturer’s office, especially on a big campus. That’s why Acanet includes a map search feature — making it easy to navigate your academic world with confidence.

And when you’re looking for general answers — from science facts to historical dates — our built-in AI chat assistant is always ready to help. Think of it like your smart academic buddy, available 24/7.

Acanet isn’t just another app — it’s a tool designed by people who understand the day-to-day struggles of student life and academic workflows. I genuinely believe it has the potential to change the way we connect, learn, and grow in educational spaces.

Thanks for being part of the journey!`
};


  // Social media links
  const socialLinks = [
    { id: "email", icon: "email", label: "Send Email", url: `mailto:${profile.email}` },
    { id: "instagram", icon: "photo-camera", label: "Instagram", url: "https://www.instagram.com/thegr8.kid" },
    { id: "linkedin", icon: "business", label: "LinkedIn", url: "https://linkedin.com/in/sammy-sallo" },
    { id: "github", icon: "code", label: "GitHub", url: "https://github.com/jxtsammy" },
  ]

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Error opening URL:", err))
  }

  return (
    <ImageBackground
      source={require('../../assets/settingsbg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image source={require('../../assets/IMG-20250105-WA0004.jpg')} style={styles.profileImage} />
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
            <Text style={styles.bioTitle}>Bio</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>

          {/* Social Links */}
          <View style={styles.socialLinksContainer}>
            {socialLinks.map((link) => (
              <TouchableOpacity key={link.id} style={styles.socialLinkItem} onPress={() => openLink(link.url)}>
                <BlurView intensity={30} tint="dark" style={styles.socialLinkBlur}>
                  <Icon name={link.icon} size={24} color="#fff" />
                  <Text style={styles.socialLinkText}>{link.label}</Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 70 : 40,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
  },
  bioSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#fff",
  },
  socialLinksContainer: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  socialLinkItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)"
  },
  socialLinkBlur: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  socialLinkText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginLeft: 12,
  },
})

export default AboutScreen