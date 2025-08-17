"use client"

import { useState, useEffect } from "react"
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig"
import { signOut, deleteUser, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, deleteDoc } from "firebase/firestore"
import { CommonActions } from "@react-navigation/native"

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
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePicture: null,
    firstName: "",
    lastName: "",
    institution: "",
    institutionId: "",
    bio: "",
    userType: null, // This will be set from the 'userRole' field
    workEmail: "",
    workId: "",
  })

  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser)

        try {
          const userRef = doc(FIRESTORE_DB, "users", firebaseUser.uid)
          const userDoc = await getDoc(userRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()
            console.log("Found user document in 'users' collection:", userData)

            const fullName =
              userData.firstName && userData.lastName
                ? `${userData.firstName} ${userData.lastName}`.trim()
                : userData.firstName || userData.lastName || ""

            setUser({
              name: userData.displayName || fullName || firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              profilePicture: userData.profileImageUrl || firebaseUser.photoURL || null,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              institution: userData.institution || "",
              institutionId: userData.studentId || userData.workId || "",
              bio: userData.bio || "",
              userType: userData.userRole || "", // Corrected: Using 'userRole' field
              workEmail: userData.workEmail || "",
              workId: userData.workId || "",
            })
          } else {
            console.warn("No user data found in 'users' collection for UID:", firebaseUser.uid)
            setUser({
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              profilePicture: firebaseUser.photoURL || null,
              firstName: "",
              lastName: "",
              institution: "",
              institutionId: "",
              bio: "",
              userType: "",
              workEmail: "",
              workId: "",
            })
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          Alert.alert("Error", "Failed to fetch user data. Please check your connection.")
          setUser({
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email || "",
            profilePicture: firebaseUser.photoURL || null,
            firstName: "",
            lastName: "",
            institution: "",
            institutionId: "",
            bio: "",
            userType: "",
            workEmail: "",
            workId: "",
          })
        }
        setLoading(false)
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          }),
        )
      }
    })

    return () => unsubscribe()
  }, [navigation])

  useEffect(() => {
    if (route.params?.updatedUser) {
      setUser(route.params.updatedUser)
    }
  }, [route.params?.updatedUser])

  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [biometricAuth, setBiometricAuth] = useState(true)
  const [dataSync, setDataSync] = useState(true)

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [modalAnimation] = useState(new Animated.Value(0))

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const navigateToPersonalInfo = () => {
    navigation.navigate("PersonalInfo", { user })
  }

  const showDeleteModal = () => {
    setDeleteModalVisible(true)
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start()
  }

  const hideDeleteModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDeleteModalVisible(false)
    })
  }

  const confirmDeleteAccount = async () => {
    hideDeleteModal()

    try {
      if (currentUser) {
        // Delete the user's document from the single 'users' collection
        await deleteDoc(doc(FIRESTORE_DB, "users", currentUser.uid))

        // Delete the user from Firebase Authentication
        await deleteUser(currentUser)

        Alert.alert("Account Deleted", "Your account has been permanently deleted.", [
          {
            text: "OK",
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                }),
              )
            },
          },
        ])
      }
    } catch (error) {
      console.error("Error deleting account:", error)
      Alert.alert("Error", "Failed to delete account. Please try again.")
    }
  }

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(FIREBASE_AUTH)
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }],
              }),
            )
          } catch (error) {
            console.error("Error signing out:", error)
            Alert.alert("Error", "Failed to sign out. Please try again.")
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <ImageBackground source={require("../../assets/settingsbg.jpg")} style={styles.backgroundImage}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.95)"]}
          style={styles.overlay}
        >
          <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
            <Text style={styles.userName}>Loading...</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    )
  }

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
    <ImageBackground source={require("../../assets/settingsbg.jpg")} style={styles.backgroundImage}>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.95)"]}
        style={styles.overlay}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.profileContainer}>
            <View style={styles.profileInfo}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user.name}</Text>
              {user.userType === "lecturer" ? (
                <>
                  <Text style={styles.userEmail}>{user.workEmail || user.email}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </>
              )}
            </View>
            <TouchableOpacity style={styles.profileImageContainer} onPress={navigateToPersonalInfo}>
              {user.profilePicture ? (
                <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImage, styles.defaultProfileIcon]}>
                  <Icon name="person" size={50} color="#fff" />
                </View>
              )}
              <View style={styles.editIconContainer}>
                <Icon name="edit" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

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

        <Modal visible={deleteModalVisible} transparent={true} animationType="none" onRequestClose={hideDeleteModal}>
          <BlurView style={styles.modalOverlay} intensity={20} tint="dark">
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [
                    {
                      scale: modalAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                  opacity: modalAnimation,
                },
              ]}
            >
              <View style={styles.modalContent}>
                <Icon name="warning" size={48} color="#ff4444" style={styles.modalIcon} />
                <Text style={styles.modalTitle}>Delete Account</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to permanently delete your account? This action cannot be undone.
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButtonCancel} onPress={hideDeleteModal}>
                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButtonDelete} onPress={confirmDeleteAccount}>
                    <Text style={styles.modalButtonTextDelete}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </BlurView>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#aaa",
  },
  userInfo: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 2,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  defaultProfileIcon: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  settingsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: "#ccc",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    margin: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    overflow: "hidden",
  },
  modalContent: {
    padding: 30,
    alignItems: "center",
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 15,
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonDelete: {
    flex: 1,
    backgroundColor: "#ff4444",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalButtonTextDelete: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  container: {
    flex: 1,
  },
})

export default SettingsScreen