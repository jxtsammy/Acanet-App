"use client"
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native"
import Ionicons from "react-native-vector-icons/MaterialIcons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig"
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  runTransaction,
} from "firebase/firestore"

const { height, width } = Dimensions.get("window")

const NotificationToast = ({
  message,
  iconName,
  iconBgColor,
  iconColor,
  isVisible,
  progress,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 60,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible, slideAnim])

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 70],
  })

  if (!isVisible && slideAnim.__getValue() === -100) {
    return null
  }

  return (
    <Animated.View style={[styles.toastContainer, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.toastContent}>
        <View style={[styles.toastIconWrapper, { backgroundColor: iconBgColor }]}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.toastTextContainer}>
          <Text style={styles.toastTitle}>Network Update</Text>
          <Text style={styles.toastMessage}>{message}</Text>
        </View>
        <View style={[styles.toastCheckIconWrapper, { backgroundColor: iconBgColor }]}>
          <Ionicons name="check" size={20} color={iconColor} />
        </View>
      </View>
      <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
    </Animated.View>
  )
}

const ContactsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("")
  const [allNetworkData, setAllNetworkData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalAnimation] = useState(new Animated.Value(0))
  const [isLoading, setIsLoading] = useState(true)

  // Toast notification states
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastIconName, setToastIconName] = useState("")
  const [toastIconBgColor, setToastIconBgColor] = useState("")
  const [toastIconColor, setToastIconColor] = useState("")
  const toastProgress = useRef(new Animated.Value(0)).current

  // Notification count states
  const [totalNotificationCount, setTotalNotificationCount] = useState(0)

  useEffect(() => {
    const currentUser = FIREBASE_AUTH.currentUser
    if (!currentUser) return

    setIsLoading(true)

    // Listener for Network List
    const networkQuery = query(
      collection(FIRESTORE_DB, "networks"),
      where("userId", "==", currentUser.uid),
    )
    const unsubscribeNetwork = onSnapshot(networkQuery, async (snapshot) => {
      // Rebuild the entire list from the snapshot to ensure it's always up-to-date
      const networkMembersPromises = snapshot.docs.map(async (docRef) => {
        const networkMemberId = docRef.data().networkMemberId
        const userDocRef = doc(FIRESTORE_DB, "users", networkMemberId)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          return {
            id: userDocSnap.id,
            // In a real app, you would fetch the email from the user profile document like this:
            // email: userDocSnap.data().email,
            // For now, we'll hardcode a dummy email to demonstrate functionality.
            email: "network.member@example.com",
            ...userDocSnap.data(),
          }
        }
        return null
      })

      const newNetworkData = (await Promise.all(networkMembersPromises)).filter(
        (item) => item !== null,
      )

      newNetworkData.sort((a, b) => a.firstName.localeCompare(b.firstName))
      setAllNetworkData(newNetworkData)
      setFilteredData(newNetworkData)
      setIsLoading(false)
    })

    // Listener for Notification Count
    const updatesQuery = collection(FIRESTORE_DB, "updates")
    const requestsQuery = query(
      collection(FIRESTORE_DB, "networkRequests"),
      where("toUserId", "==", currentUser.uid),
    )

    const unsubscribeUpdates = onSnapshot(updatesQuery, (updatesSnapshot) => {
      const unreadUpdates = updatesSnapshot.docs.filter((doc) => !doc.data().read).length
      setTotalNotificationCount((prev) => unreadUpdates + prev - (prev % 100)) // Reset requests count
    })

    const unsubscribeRequests = onSnapshot(requestsQuery, (requestsSnapshot) => {
      const unreadRequests = requestsSnapshot.docs.length
      setTotalNotificationCount((prev) => prev - (prev % 100) + unreadRequests) // Reset updates count
    })

    return () => {
      unsubscribeNetwork()
      unsubscribeUpdates()
      unsubscribeRequests()
    }
  }, [])

  const handleSearch = (text) => {
    setSearchText(text)
    if (text.trim() === "") {
      setFilteredData(allNetworkData)
    } else {
      const filtered = allNetworkData.filter(
        (item) =>
          item.firstName.toLowerCase().includes(text.toLowerCase()) ||
          item.lastName.toLowerCase().includes(text.toLowerCase()),
      )
      setFilteredData(filtered)
    }
  }

  const openContactModal = (contact) => {
    setSelectedContact(contact)
    setModalVisible(true)
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start()
  }

  const closeContactModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false)
      setSelectedContact(null)
    })
  }

  const showToastNotification = (userName) => {
    setToastMessage(`User ${userName} has been removed from your network.`)
    setToastIconName("person-remove")
    setToastIconBgColor("#333")
    setToastIconColor("#fff")
    setToastVisible(true)
    toastProgress.setValue(0)

    Animated.timing(toastProgress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      setToastVisible(false)
    })
  }

  const handleChat = () => {
    closeContactModal()
    if (selectedContact) {
      navigation.navigate("ChatInterface", {
        chatItem: {
          id: selectedContact.id,
          firstName: selectedContact.firstName,
          lastName: selectedContact.lastName,
          image: selectedContact.profileImageUrl,
          isOnline: selectedContact.online,
        },
      })
      console.log(`Navigating to chat with ${selectedContact?.firstName} ${selectedContact?.lastName}`)
    }
  }

  const handleDisconnect = async () => {
    const currentUser = FIREBASE_AUTH.currentUser
    if (!currentUser || !selectedContact) return

    try {
      await runTransaction(FIRESTORE_DB, async (transaction) => {
        const networkRef1 = doc(
          FIRESTORE_DB,
          "networks",
          `${currentUser.uid}_${selectedContact.id}`,
        )
        const networkRef2 = doc(
          FIRESTORE_DB,
          "networks",
          `${selectedContact.id}_${currentUser.uid}`,
        )

        transaction.delete(networkRef1)
        transaction.delete(networkRef2)
      })

      closeContactModal()
      showToastNotification(selectedContact.firstName)
      console.log(`Disconnected from ${selectedContact?.firstName} ${selectedContact?.lastName}`)
    } catch (error) {
      console.error("Error disconnecting:", error)
      alert("Failed to disconnect from user. Please try again.")
    }
  }

  const renderContactItem = ({ item }) => {
    const avatar = item.profileImageUrl
      ? { uri: item.profileImageUrl }
      : null
    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => openContactModal(item)}
        activeOpacity={0.7}
      >
        {avatar ? (
          <Image source={avatar} style={styles.profileImage} />
        ) : (
          <View style={styles.defaultProfileImage}>
            <Ionicons name="person" size={30} color="#000" />
          </View>
        )}
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.contactUserRole}>{item.userRole}</Text>
          <Text style={styles.contactInstitution}>{item.institution}</Text>
        </View>
        {item.online && <View style={styles.onlineIndicator} />}
      </TouchableOpacity>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading network...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Network</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons name="notifications" size={28} color="#fff" />
            {totalNotificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>
                  {totalNotificationCount > 99 ? "99+" : totalNotificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("AddNetwork")}
          >
            <Ionicons name="person-add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#666"
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      {filteredData.length === 0 ? (
        <View style={styles.noNetworksContainer}>
          <Text style={styles.noNetworksText}>No Networks</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.listContent}
          extraData={filteredData}
        />
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("AddNetwork")}
      >
        <Ionicons name="person-add" size={30} color="#000" />
      </TouchableOpacity>

      {/* Custom Notification Toast */}
      <NotificationToast
        message={toastMessage}
        iconName={toastIconName}
        iconBgColor={toastIconBgColor}
        iconColor={toastIconColor}
        isVisible={toastVisible}
        progress={toastProgress}
      />

      {/* Contact Details Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeContactModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  {
                    translateY: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, 0],
                    }),
                  },
                ],
                opacity: modalAnimation,
              },
            ]}
          >
            <LinearGradient
              colors={["#ffff", "#ffffff"]}
              style={styles.modalGradient}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                  {selectedContact?.profileImageUrl ? (
                    <Image
                      source={{ uri: selectedContact.profileImageUrl }}
                      style={styles.modalProfileImage}
                    />
                  ) : (
                    <View style={styles.defaultModalProfileImage}>
                      <Ionicons name="person" size={40} color="#000" />
                    </View>
                  )}
                  <View style={styles.modalContactInfo}>
                    <Text style={styles.modalContactName}>
                      {selectedContact?.firstName} {selectedContact?.lastName}
                    </Text>
                    <Text style={styles.modalUserRole}>
                      {selectedContact?.userRole}
                    </Text>
                    <Text style={styles.modalEmail}>
                      {selectedContact?.email}
                    </Text>
                    <Text style={styles.modalInstitution}>
                      {selectedContact?.institution}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={closeContactModal}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
                  <Ionicons name="person-remove" size={26} color="#000" />
                  <Text style={styles.disconnectButtonText}>Disconnect</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
                  <Ionicons name="chat-bubble" size={26} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Bio Section */}
              <ScrollView style={styles.bioSection}>
                <Text style={styles.bioTitle}>Bio</Text>
                <Text style={styles.bioText}>{selectedContact?.bio}</Text>
              </ScrollView>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 10,
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#121212",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 30,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 14,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    padding: 10,
    borderRadius: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  defaultProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  contactUserRole: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  contactInstitution: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  onlineIndicator: {
    width: 15,
    height: 15,
    borderRadius: 30,
    backgroundColor: "#fff",
    position: "absolute",
    left: 40,
    top: 45,
    borderWidth: 2,
    borderColor: "#121212",
  },
  noNetworksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noNetworksText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: height * 0.55,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  modalGradient: {
    flex: 1,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  modalHeaderContent: {
    flexDirection: "row",
    flex: 1,
  },
  modalProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  defaultModalProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modalContactInfo: {
    flex: 1,
  },
  modalContactName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  modalUserRole: {
    fontSize: 16,
    color: "#000",
    marginBottom: 2,
  },
  modalEmail: {
    fontSize: 14,
    color: "#000",
    marginBottom: 2,
  },
  modalInstitution: {
    fontSize: 14,
    color: "#000",
    marginBottom: 4,
  },
  modalLastActive: {
    fontSize: 12,
    color: "#000",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  disconnectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 60,
    gap: 8,
  },
  disconnectButtonText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "600",
  },
  chatButton: {
    width: 90,
    height: 50,
    borderRadius: 60,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  bioSection: {
    flex: 1,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: "#111",
    lineHeight: 24,
  },
  // Styles for NotificationToast (moved here)
  toastContainer: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    overflow: "hidden",
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  toastIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 14,
    color: "#111",
  },
  toastCheckIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
})

export default ContactsScreen