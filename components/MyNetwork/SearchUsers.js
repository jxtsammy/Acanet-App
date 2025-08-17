"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Modal,
  Animated,
  ScrollView,
  Platform,
} from "react-native"
import Ionicons from "react-native-vector-icons/MaterialIcons"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore"
import { FIRESTORE_DB } from "../../firebaseConfig"
import { getAuth, onAuthStateChanged } from "firebase/auth"

const App = ({ navigation }) => {
  const [searchText, setSearchText] = useState("")
  const [filteredContacts, setFilteredContacts] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastIcon, setToastIcon] = useState("")
  const [toastHeading, setToastHeading] = useState("")
  const toastProgress = useState(new Animated.Value(0))[0]

  const [allUsers, setAllUsers] = useState([])
  const [userNetworks, setUserNetworks] = useState([])
  const [sentRequests, setSentRequests] = useState([])

  // State for the currently logged-in user's details
  const [currentUser, setCurrentUser] = useState(null)
  const [currentUserDetails, setCurrentUserDetails] = useState(null)

  // --- Firebase Authentication Listener ---
  useEffect(() => {
    const auth = getAuth()
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return () => unsubscribeAuth()
  }, [])

  // Fetch current user's details from Firestore once auth state is known
  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(FIRESTORE_DB, "users", currentUser.uid)
      const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setCurrentUserDetails({ id: docSnap.id, ...docSnap.data() })
        } else {
          // Handle case where user document doesn't exist (e.g., first login)
          console.log("No user document found for this UID.")
        }
      })
      return () => unsubscribeUser()
    } else {
      setCurrentUserDetails(null)
    }
  }, [currentUser])

  // --- Firestore Real-Time Listeners ---
  useEffect(() => {
    if (!currentUserDetails) return; // Wait for current user details to be loaded

    // Listener for all users in the 'users' collection
    const usersCollection = collection(FIRESTORE_DB, "users")
    const usersListener = onSnapshot(usersCollection, (snapshot) => {
      const usersArray = snapshot.docs
        .filter((doc) => doc.id !== currentUserDetails.id)
        .map((doc) => ({ id: doc.id, ...doc.data() }))
      setAllUsers(usersArray)
    })

    // Listener for the current user's network connections
    const networksCollection = collection(FIRESTORE_DB, "networks")
    const networksQuery = query(networksCollection, where("userId", "==", currentUserDetails.id))
    const networksListener = onSnapshot(networksQuery, (snapshot) => {
      const networksArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setUserNetworks(networksArray)
    })

    // Listener for network requests sent by the current user
    const sentRequestsCollection = collection(FIRESTORE_DB, "networkRequests")
    const sentRequestsQuery = query(sentRequestsCollection, where("fromUserId", "==", currentUserDetails.id))
    const sentRequestsListener = onSnapshot(sentRequestsQuery, (snapshot) => {
      const sentRequestsArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setSentRequests(sentRequestsArray)
    })

    // Cleanup listeners on unmount
    return () => {
      usersListener()
      networksListener()
      sentRequestsListener()
    }
  }, [currentUserDetails])

  // Function to determine connection status based on Firestore data
  const getConnectionStatus = (contactId) => {
    // Check if the user is in our network
    if (userNetworks.find((network) => network.networkMemberId === contactId)) {
      return "connected"
    }

    // Check if a request has been sent to this user and is pending
    if (sentRequests.find((request) => request.toUserId === contactId && request.status === "pending")) {
      return "pending"
    }

    return "not_connected"
  }

  // --- Firestore Functions to Interact with DB ---
  const sendNetworkRequest = async (recipientUserId, senderDetails) => {
    const networkRequestsCollection = collection(FIRESTORE_DB, "networkRequests")
    const requestData = {
      fromUserId: senderDetails.id,
      toUserId: recipientUserId,
      status: "pending",
      timestamp: Date.now(),
      fromUserFirstName: senderDetails.firstName,
      fromUserLastName: senderDetails.lastName,
      fromUserInstitution: senderDetails.institution,
      fromUserRole: senderDetails.userRole,
      fromUserProfileImage: senderDetails.profileImageUrl,
    }
    await addDoc(networkRequestsCollection, requestData)
  }

  const disconnectUser = async (contactId) => {
    const networkQuery1 = query(
      collection(FIRESTORE_DB, "networks"),
      where("userId", "==", currentUserDetails.id),
      where("networkMemberId", "==", contactId),
    )
    const networkQuery2 = query(
      collection(FIRESTORE_DB, "networks"),
      where("userId", "==", contactId),
      where("networkMemberId", "==", currentUserDetails.id),
    )

    const [snapshot1, snapshot2] = await Promise.all([getDocs(networkQuery1), getDocs(networkQuery2)])
    const promises = []

    snapshot1.forEach((doc) => promises.push(deleteDoc(doc.ref)))
    snapshot2.forEach((doc) => promises.push(deleteDoc(doc.ref)))

    await Promise.all(promises)
  }

  // --- Search and UI Logic ---
  const filterContacts = (text) => {
    if (!text) {
      setFilteredContacts([])
      return
    }
    const filtered = allUsers.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase()
      const searchTerm = text.toLowerCase()
      return (
        fullName.includes(searchTerm) ||
        (user.userRole && user.userRole.toLowerCase().includes(searchTerm)) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm)) ||
        (user.location && user.location.toLowerCase().includes(searchTerm))
      )
    })
    setFilteredContacts(filtered)
  }

  const handleSearchTextChange = (text) => {
    setSearchText(text)
    if (text) {
      filterContacts(text)
    } else {
      setFilteredContacts([])
    }
  }

  const handleSearchButtonPress = () => {
    if (searchText && !recentSearches.includes(searchText)) {
      setRecentSearches([searchText, ...recentSearches])
    }
    filterContacts(searchText)
  }

  const handleSearchFocus = () => {
    setIsSearchActive(true)
  }

  const handleSearchBlur = () => {
    setIsSearchActive(false)
  }

  const handleRecentSearchClick = (recentSearch) => {
    setSearchText(recentSearch)
    filterContacts(recentSearch)
  }

  const showToast = (heading, message, icon) => {
    setToastHeading(heading)
    setToastMessage(message)
    setToastIcon(icon)
    setToastVisible(true)

    toastProgress.setValue(0)
    Animated.timing(toastProgress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start()

    setTimeout(() => {
      setToastVisible(false)
    }, 3000)
  }

  const handleConnect = async (contact) => {
    try {
      if (currentUserDetails) {
        await sendNetworkRequest(contact.id, currentUserDetails)
        setModalVisible(false)
        showToast(
          "Network Request Sent",
          `Your request has been sent to ${contact.firstName || "the user"}`,
          "person-add",
        )
      } else {
        showToast("Error", "User details not loaded. Please try again.", "error-outline")
      }
    } catch (error) {
      console.error("Error sending request:", error)
      showToast("Error", "Failed to send network request.", "error-outline")
    }
  }

  const handleDisconnect = async (contactId) => {
    try {
      await disconnectUser(contactId)
      setModalVisible(false)
      const disconnectedUser = allUsers.find((user) => user.id === contactId)
      showToast(
        "Network Update",
        `User ${disconnectedUser?.firstName || "has been removed"} from your network.`,
        "person-remove",
      )
    } catch (error) {
      console.error("Error disconnecting:", error)
      showToast("Error", "Failed to disconnect user.", "error-outline")
    }
  }

  const handleMessage = (contact) => {
    setModalVisible(false)
    if (navigation && navigation.navigate) {
      navigation.navigate("ChatInterface", {
        firstName: contact.firstName,
        lastName: contact.lastName
      })
    } else {
      console.warn("Navigation prop not available. Cannot navigate to ChatInterface.")
    }
  }

  const openContactDetailsModal = (contact) => {
    setSelectedContact(contact)
    setModalVisible(true)
  }

  const renderRecentSearch = ({ item }) => (
    <TouchableOpacity style={styles.recentSearchItem} onPress={() => handleRecentSearchClick(item)}>
      <Ionicons name="history" size={24} color="#fff" />
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  )

  const renderContact = ({ item }) => {
    const connectionStatus = getConnectionStatus(item.id)
    const displayName = `${item.firstName || ""} ${item.lastName || ""}`.trim()
    const displayOccupation = item.userRole
    const displayAvatar = item.profileImageUrl

    // Conditional email display logic with fallback
    const displayEmail = item.userRole === "lecturer" ? (item.workEmail || item.email) : item.email;

    const displayLocation = item.location
    const isOnline = item.isOnline

    return (
      <TouchableOpacity style={styles.contact} onPress={() => openContactDetailsModal(item)}>
        <View style={styles.avatarContainer}>
          {displayAvatar ? (
            <Image source={{ uri: displayAvatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <Ionicons name="person" size={40} color="#000" />
            </View>
          )}
          {isOnline && <View style={styles.onlineIndicatorList} />}
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{displayName || "Name not available"}</Text>
          <Text style={styles.contactOccupation}>{displayOccupation}</Text>
          {displayEmail && <Text style={styles.contactEmail}>{displayEmail}</Text>}
          {displayLocation && <Text style={styles.contactLocation}>{displayLocation}</Text>}
        </View>
        <TouchableOpacity style={styles.connectionIconContainer} onPress={() => openContactDetailsModal(item)}>
          {connectionStatus === "connected" ? (
            <Ionicons name="check" size={30} color="#fff" />
          ) : (
            <Ionicons name="add" size={30} color="#fff" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  const progressBarWidth = toastProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  })

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search network..."
            placeholderTextColor="#aaa"
            onChangeText={handleSearchTextChange}
            value={searchText}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          <TouchableOpacity style={styles.searchIcon} onPress={handleSearchButtonPress}>
            <Ionicons name="search" size={22} color="#000" fontWeight="bold" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.profilePictureContainer}>
          {currentUserDetails?.profileImageUrl ? (
            <Image source={{ uri: currentUserDetails.profileImageUrl }} style={styles.profilePicture} />
          ) : (
            <View style={[styles.profilePicture, styles.defaultProfilePicture]}>
              <Ionicons name="person" size={20} color="#000" />
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.suggestionsHeading}>
        {searchText ? "Related Network" : isSearchActive ? "Recent Searches" : "Suggestions"}
      </Text>
      <FlatList
        data={searchText ? filteredContacts : isSearchActive ? recentSearches : allUsers}
        keyExtractor={(item) => item.id || item}
        renderItem={searchText ? renderContact : isSearchActive ? renderRecentSearch : renderContact}
        ListEmptyComponent={
          searchText && filteredContacts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No related Network</Text>
            </View>
          ) : isSearchActive && recentSearches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Recents</Text>
            </View>
          ) : null
        }
      />

      {/* Contact Details Modal (Bottom Sheet) */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            {selectedContact && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalAvatarContainer}>
                    {selectedContact.profileImageUrl ? (
                      <Image source={{ uri: selectedContact.profileImageUrl }} style={styles.modalAvatar} />
                    ) : (
                      <View style={[styles.modalAvatar, styles.defaultAvatarModal]}>
                        <Ionicons name="person" size={60} color="#000" />
                      </View>
                    )}
                    {selectedContact.isOnline && <View style={styles.onlineIndicatorModal} />}
                  </View>
                  <View style={styles.modalHeaderText}>
                    <Text style={styles.modalName}>{`${selectedContact.firstName || ""} ${selectedContact.lastName || ""}`.trim() || "Name not available"}</Text>
                    <Text style={styles.modalOccupation}>{selectedContact.userRole}</Text>
                    {selectedContact.userRole === "lecturer" ? (
                      selectedContact.workEmail ? (
                        <Text style={styles.modalEmail}>{selectedContact.workEmail}</Text>
                      ) : selectedContact.email ? (
                        <Text style={styles.modalEmail}>{selectedContact.email}</Text>
                      ) : null
                    ) : selectedContact.email ? (
                      <Text style={styles.modalEmail}>{selectedContact.email}</Text>
                    ) : null}
                    {selectedContact.location && <Text style={styles.modalLocation}>@{selectedContact.location}</Text>}
                  </View>
                </View>
                <View style={styles.modalButtonsContainer}>
                  {getConnectionStatus(selectedContact.id) === "connected" ? (
                    <TouchableOpacity
                      style={styles.disconnectButton}
                      onPress={() => handleDisconnect(selectedContact.id)}
                    >
                      <Ionicons name="person-remove" size={20} color="#000" />
                      <Text style={styles.disconnectButtonText}>Disconnect</Text>
                    </TouchableOpacity>
                  ) : getConnectionStatus(selectedContact.id) === "pending" ? (
                    <TouchableOpacity style={styles.pendingButton} disabled>
                      <Ionicons name="hourglass-empty" size={20} color="#000" />
                      <Text style={styles.pendingButtonText}>Pending</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.connectButton} onPress={() => handleConnect(selectedContact)}>
                      <Ionicons name="person-add" size={20} color="#fff" />
                      <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.messageButton} onPress={() => handleMessage(selectedContact)}>
                    <Ionicons name="chat-bubble" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalBioScrollView}>
                  <View style={styles.modalBioContainer}>
                    <Text style={styles.modalBioHeading}>Bio</Text>
                    <Text style={styles.modalBioText}>{selectedContact.bio}</Text>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Custom Toast Notification */}
      {toastVisible && (
        <Animated.View style={styles.toastContainer}>
          <View style={styles.toastContent}>
            <View style={styles.toastIconCircle}>
              <Ionicons name={toastIcon} size={24} color="#fff" />
            </View>
            <View style={styles.toastTextContainer}>
              <Text style={styles.toastHeadingText}>{toastHeading}</Text>
              <Text style={styles.toastMessageText}>{toastMessage}</Text>
            </View>
            <View style={styles.toastCheckCircle}>
              <Ionicons name="check" size={20} color="#fff" />
            </View>
          </View>
          <Animated.View style={[styles.toastProgressBar, { width: progressBarWidth }]} />
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 30,
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  searchIcon: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePictureContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    overflow: "hidden",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  defaultProfilePicture: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionsHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  recentSearchText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
  contact: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    padding: 10,
  },
  avatarContainer: {
    position: "relative",
    width: 55,
    height: 55,
    marginRight: 15,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  defaultAvatar: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicatorList: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 17,
    height: 17,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  contactOccupation: {
    fontSize: 14,
    color: "#777",
  },
  contactEmail: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  contactLocation: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  connectionIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
    fontWeight: "bold",
    marginTop: 200,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 70 : 50,
    width: "100%",
    maxHeight: "80%",
  },
  modalCloseButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    padding: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalAvatarContainer: {
    position: "relative",
    width: 80,
    height: 80,
    marginRight: 15,
  },
  modalAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  defaultAvatarModal: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicatorModal: {
    position: "absolute",
    bottom: 0,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#ffff",
  },
  modalHeaderText: {
    flex: 1,
  },
  modalName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  modalOccupation: {
    fontSize: 16,
    color: "#111",
    marginTop: 2,
  },
  modalEmail: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  modalLocation: {
    fontSize: 14,
    color: "#111",
    marginTop: 2,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 32,
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 60,
    justifyContent: "center",
    flex: 1,
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
  },
  disconnectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 60,
    justifyContent: "center",
    flex: 1,
  },
  disconnectButtonText: {
    color: "#000",
    fontSize: 18,
    marginLeft: 8,
  },
  pendingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 60,
    justifyContent: "center",
    flex: 1,
  },
  pendingButtonText: {
    color: "#11",
    fontSize: 18,
    marginLeft: 8,
  },
  messageButton: {
    width: 90,
    height: 50,
    borderRadius: 60,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBioScrollView: {
    maxHeight: 150,
  },
  modalBioContainer: {
    marginTop: 10,
  },
  modalBioHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  modalBioText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  // Toast Styles (New Design)
  toastContainer: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    marginHorizontal: 20,
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
    width: "100%",
    marginBottom: 5,
  },
  toastIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastHeadingText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  toastMessageText: {
    color: "#555",
    fontSize: 14,
  },
  toastCheckCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  toastProgressBar: {
    height: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
})

export default App