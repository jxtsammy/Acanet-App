"use client"

import { useState, useEffect } from "react"

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  StatusBar,
  ImageBackground,
  Modal,
  Animated,
  Alert,
} from "react-native"

import Icon from "react-native-vector-icons/MaterialIcons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"

const SettingsScreen = ({ navigation, route }) => {
  // User data - in a real app, this would come from your auth/user context
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    profilePicture: "https://i.pravatar.cc/150?img=12",
    firstName: "Alex",
    lastName: "Johnson",
    institution: "University of Technology",
    institutionId: "UT12345",
    bio: "Software developer with a passion for mobile apps and AI.",
  })

  // Update user data if coming back from PersonalInfoScreen
  useEffect(() => {
    if (route.params?.updatedUser) {
      setUser(route.params.updatedUser)
    }
  }, [route.params?.updatedUser])

  // Settings states
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [biometricAuth, setBiometricAuth] = useState(true)
  const [dataSync, setDataSync] = useState(true)

  // Modal states
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [modalAnimation] = useState(new Animated.Value(0))

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Navigate to personal info screen
  const navigateToPersonalInfo = () => {
    navigation.navigate("PersonalInfo", { user })
  }

  // Show delete account modal
  const showDeleteModal = () => {
    setDeleteModalVisible(true)
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start()
  }

  // Hide delete account modal
  const hideDeleteModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDeleteModalVisible(false)
    })
  }

  // Handle account deletion
  const handleDeleteAccount = () => {
    hideDeleteModal()
    // Add a small delay to let the modal close
    setTimeout(() => {
      Alert.alert("Account Deleted", "Your account has been permanently deleted.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ])
    }, 300)
  }

  // Handle logout
  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => navigation.navigate("Login"),
      },
    ])
  }

  // Render a settings item with an icon
  const renderSettingsItem = ({
    icon,
    title,
    subtitle,
    action,
    type = "arrow",
    value,
    onValueChange,
    iconColor = "#fff",
  }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={action} disabled={type === "switch"}>
      <View style={styles.settingsItemIcon}>
        <Icon name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.settingsItemText}>
        <Text style={styles.settingsItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
      </View>
      {type === "arrow" && <Icon name="chevron-right" size={24} color="#fff" />}
      {type === "switch" && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#ccc", true: "#fff" }}
          thumbColor={Platform.OS === "ios" ? "#000" : value ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#ccc"
        />
      )}
    </TouchableOpacity>
  )

  return (
    <ImageBackground
      source={require("../../assets/settingsbg.jpg")}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.95)"]}
        style={styles.overlay}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* User Profile Section */}
          <View style={styles.profileContainer}>
            <View style={styles.profileInfo}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            <TouchableOpacity style={styles.profileImageContainer} onPress={navigateToPersonalInfo}>
              <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
              <View style={styles.editIconContainer}>
                <Icon name="edit" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Account Settings */}
          <BlurView style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Account</Text>
            {renderSettingsItem({
              icon: "person",
              title: "Personal Information",
              subtitle: "Update your personal details",
              action: navigateToPersonalInfo,
            })}
            {renderSettingsItem({
              icon: "delete-forever",
              title: "Delete Account",
              subtitle: "Permanently delete your account",
              action: showDeleteModal,
            })}
            {renderSettingsItem({
              icon: "language",
              title: "Language",
              subtitle: "English (US)",
              action: () => navigation.navigate("LanguageSettings"),
            })}
          </BlurView>

          {/* Preferences */}
          <BlurView style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Preferences</Text>
            {renderSettingsItem({
              icon: "sync",
              title: "Data Synchronization",
              subtitle: "Sync your data across devices",
              type: "switch",
              value: dataSync,
              onValueChange: (value) => setDataSync(value),
            })}
          </BlurView>

          {/* Notifications */}
          <BlurView style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Notifications</Text>
            {renderSettingsItem({
              icon: "notifications",
              title: "Push Notifications",
              subtitle: "Receive push notifications",
              type: "switch",
              value: notifications,
              onValueChange: (value) => setNotifications(value),
            })}
            {renderSettingsItem({
              icon: "email",
              title: "Email Notifications",
              subtitle: "Receive email updates",
              type: "switch",
              value: emailNotifications,
              onValueChange: (value) => setEmailNotifications(value),
            })}
          </BlurView>

          {/* Security */}
          <BlurView style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Security</Text>
            {renderSettingsItem({
              icon: "fingerprint",
              title: "Biometric Authentication",
              subtitle: "Use fingerprint or face ID",
              type: "switch",
              value: biometricAuth,
              onValueChange: (value) => setBiometricAuth(value),
            })}
            {renderSettingsItem({
              icon: "security",
              title: "Privacy Settings",
              subtitle: "Manage your privacy preferences",
              action: () => navigation.navigate("PrivacySettings"),
            })}
          </BlurView>

          {/* Support */}
          <BlurView style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Support</Text>
            {renderSettingsItem({
              icon: "help",
              title: "Help Center",
              subtitle: "Get help with the app",
              action: () => navigation.navigate("HelpCenter"),
            })}
            {renderSettingsItem({
              icon: "feedback",
              title: "Send Feedback",
              subtitle: "Help us improve the app",
              action: () => navigation.navigate("SendFeedback"),
            })}
            {renderSettingsItem({
              icon: "info",
              title: "About",
              subtitle: "App version 1.0.0",
              action: () => navigation.navigate("AboutApp"),
            })}
          </BlurView>

          {/* Logout Section - No category title */}
          <BlurView style={styles.settingsSection}>
            {renderSettingsItem({
              icon: "logout",
              title: "Log Out",
              subtitle: "Sign out of your account",
              action: handleLogout,
            })}
          </BlurView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 Codex Inc.</Text>
            <Text style={styles.footerText}>Terms of Service • Privacy Policy</Text>
          </View>
        </ScrollView>

        {/* Simplified Delete Account Modal */}
        <Modal visible={deleteModalVisible} transparent={true} animationType="none" onRequestClose={hideDeleteModal}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [
                    {
                      translateY: modalAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0],
                      }),
                    },
                    {
                      scale: modalAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                  opacity: modalAnimation,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalIconContainer}>
                  <Icon name="warning" size={32} color="#FF4444" />
                </View>
                <Text style={styles.modalTitle}>Delete Account</Text>
                <Text style={styles.modalSubtitle}>Are you sure you want to delete your account?</Text>
              </View>

              <View style={styles.modalContent}>
                <Text style={styles.modalDescription}>
                  This action is <Text style={styles.irreversibleText}>irreversible</Text>. All your data will be
                  permanently deleted and cannot be recovered.
                </Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={hideDeleteModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                  <Text style={styles.deleteButtonText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
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
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 70 : 40,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#088a6a",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  settingsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    overflow: "hidden",
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    color: "#fff",
  },
  settingsItemSubtitle: {
    fontSize: 12,
    color: "#bbb",
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
  },
  modalContent: {
    marginBottom: 32,
  },
  modalDescription: {
    fontSize: 16,
    color: "#ccc",
    lineHeight: 24,
    textAlign: "center",
  },
  irreversibleText: {
    color: "#FF4444",
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FF4444",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default SettingsScreen