"use client"

import { useState } from "react"
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

  const [contacts, setContacts] = useState([
    {
      id: "1",
      name: "John Doe",
      occupation: "Student",
      avatar: "https://i.pravatar.cc/150?u=1",
      bio: "Passionate about learning new technologies and building innovative solutions. Currently exploring AI and machine learning.",
      location: "New York, USA",
      connectionStatus: "connected",
      isOnline: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      occupation: "Lecturer",
      avatar: "https://i.pravatar.cc/150?u=2",
      bio: "Experienced educator with a focus on computer science and data structures. Dedicated to fostering student growth.",
      location: "London, UK",
      connectionStatus: "not_connected",
      isOnline: false,
    },
    {
      id: "3",
      name: "Michael Johnson",
      occupation: "Student",
      avatar: "https://i.pravatar.cc/150?u=3",
      bio: "Aspiring software engineer with a keen interest in mobile app development. Always eager to collaborate on projects.",
      location: "San Francisco, USA",
      connectionStatus: "not_connected",
      isOnline: true,
    },
    {
      id: "4",
      name: "Emily Brown",
      occupation: "Lecturer",
      avatar: "https://i.pravatar.cc/150?u=4",
      bio: "Researcher in artificial intelligence and natural language processing. Committed to advancing the field through teaching and research.",
      location: "Berlin, Germany",
      connectionStatus: "connected",
      isOnline: false,
    },
    {
      id: "5",
      name: "David Williams",
      occupation: "Student",
      avatar: "https://i.pravatar.cc/150?u=5",
      bio: "Creative designer with a passion for user experience. Specializing in UI/UX for web and mobile applications.",
      location: "Sydney, Australia",
      connectionStatus: "not_connected",
      isOnline: true,
    },
    {
      id: "6",
      name: "Sophia Miller",
      occupation: "Lecturer",
      avatar: "https://i.pravatar.cc/150?u=6",
      bio: "Professor of economics with expertise in financial markets and behavioral economics. Author of several acclaimed books.",
      location: "Paris, France",
      connectionStatus: "not_connected",
      isOnline: false,
    },
    {
      id: "7",
      name: "Chris Evans",
      occupation: "Student",
      avatar: "https://i.pravatar.cc/150?u=7",
      bio: "Enthusiastic entrepreneur building a startup in the sustainable energy sector. Believes in technology for good.",
      location: "Austin, USA",
      connectionStatus: "connected",
      isOnline: true,
    },
    {
      id: "8",
      name: "Megan Fox",
      occupation: "Lecturer",
      avatar: "https://i.pravatar.cc/150?u=8",
      bio: "Award-winning journalist and media studies lecturer. Focuses on digital media ethics and investigative reporting.",
      location: "Tokyo, Japan",
      connectionStatus: "not_connected",
      isOnline: false,
    },
    {
      id: "9",
      name: "Mark Ruffalo",
      occupation: "Student",
      avatar: "https://i.pravatar.cc/150?u=9",
      bio: "Environmental activist and aspiring filmmaker. Uses storytelling to raise awareness about climate change.",
      location: "Vancouver, Canada",
      connectionStatus: "not_connected",
      isOnline: true,
    },
    {
      id: "10",
      name: "Scarlett Johansson",
      occupation: "Lecturer",
      avatar: "https://i.pravatar.cc/150?u=10",
      bio: "Renowned astrophysicist and lecturer, specializing in black holes and cosmology. Inspiring the next generation of scientists.",
      location: "Cambridge, USA",
      connectionStatus: "connected",
      isOnline: false,
    },
  ])

  const filterContacts = (text) => {
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(text.toLowerCase()) ||
        contact.occupation.toLowerCase().includes(text.toLowerCase()) ||
        (contact.bio && contact.bio.toLowerCase().includes(text.toLowerCase())) ||
        (contact.location && contact.location.toLowerCase().includes(text.toLowerCase())),
    )
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

  const handleConnect = (contactId) => {
    setContacts((prevContacts) =>
      prevContacts.map((c) => (c.id === contactId ? { ...c, connectionStatus: "pending" } : c)),
    )
    setModalVisible(false) // Close modal on connect press
    showToast("Network Request Sent", `Your request has been sent to ${selectedContact.name}`, "person-add")

    // Simulate request acceptance after a delay
    setTimeout(() => {
      setContacts((prevContacts) =>
        prevContacts.map((c) => (c.id === contactId ? { ...c, connectionStatus: "connected" } : c)),
      )
      // Optionally show a "Request Accepted" toast here if needed
    }, 3000)
  }

  const handleDisconnect = (contactId) => {
    setContacts((prevContacts) =>
      prevContacts.map((c) => (c.id === contactId ? { ...c, connectionStatus: "not_connected" } : c)),
    )
    setModalVisible(false) // Close modal on disconnect press
    showToast("Network Update", `User ${selectedContact.name} has been removed from your network.`, "person-remove")
  }

  const handleMessage = (contact) => {
    setModalVisible(false)
    if (navigation && navigation.navigate) {
      navigation.navigate("ChatInterface", { contact: contact })
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

  const renderContact = ({ item }) => (
    <TouchableOpacity style={styles.contact} onPress={() => openContactDetailsModal(item)}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicatorList} />}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactOccupation}>{item.occupation}</Text>
        {item.location && <Text style={styles.contactLocation}>{item.location}</Text>}
      </View>
      {/* This TouchableOpacity also opens the modal */}
      <TouchableOpacity style={styles.connectionIconContainer} onPress={() => openContactDetailsModal(item)}>
        {item.connectionStatus === "connected" ? (
          <Ionicons name="check" size={30} color="#fff" />
        ) : (
          <Ionicons name="add" size={30} color="#fff" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  )

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
          <Image source={{ uri: "https://i.pravatar.cc/150?u=profile" }} style={styles.profilePicture} />
        </TouchableOpacity>
      </View>
      <Text style={styles.suggestionsHeading}>
        {searchText ? "Related Network" : isSearchActive ? "Recent Searches" : "Suggestions"}
      </Text>
      <FlatList
        data={searchText ? filteredContacts : isSearchActive ? recentSearches : contacts}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            {selectedContact && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalAvatarContainer}>
                    <Image source={{ uri: selectedContact.avatar }} style={styles.modalAvatar} />
                    {selectedContact.isOnline && <View style={styles.onlineIndicatorModal} />}
                  </View>
                  <View style={styles.modalHeaderText}>
                    <Text style={styles.modalName}>{selectedContact.name}</Text>
                    <Text style={styles.modalOccupation}>{selectedContact.occupation}</Text>
                    {selectedContact.location && <Text style={styles.modalLocation}>@{selectedContact.location}</Text>}
                  </View>
                </View>
                <View style={styles.modalButtonsContainer}>
                  {selectedContact.connectionStatus === "connected" ? (
                    <TouchableOpacity
                      style={styles.disconnectButton}
                      onPress={() => handleDisconnect(selectedContact.id)}
                    >
                      <Ionicons name="person-remove" size={20} color="#000" />
                      <Text style={styles.disconnectButtonText}>Disconnect</Text>
                    </TouchableOpacity>
                  ) : selectedContact.connectionStatus === "pending" ? (
                    <TouchableOpacity style={styles.pendingButton} disabled>
                      <Ionicons name="hourglass-empty" size={20} color="#000" />
                      <Text style={styles.pendingButtonText}>Pending</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.connectButton} onPress={() => handleConnect(selectedContact.id)}>
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
    padding: 10
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
    backgroundColor: "#fff", // White background for modal content
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
    backgroundColor: "#E0E0E0", // Light grey for close button background
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
  onlineIndicatorModal: {
    position: "absolute",
    bottom: 0,
    right: 5, // Changed to bottom-right
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
    color: "#000", // Dark text
  },
  modalOccupation: {
    fontSize: 16,
    color: "#111", // Darker grey for clarity
    marginTop: 2,
  },
  modalLocation: {
    fontSize: 14,
    color: "#111", // Darker grey
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
    backgroundColor: "#111", // Dark background for connect button
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
    backgroundColor: "#ccc", // Grey for disconnect, matching image
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
    backgroundColor: "#ccc", // Same as disconnect button
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
    color: "#000", // Dark text
    marginBottom: 10,
  },
  modalBioText: {
    fontSize: 14,
    color: "#333", // Dark text
    lineHeight: 20,
  },
  // Toast Styles (New Design)
  toastContainer: {
     position: 'absolute',
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    overflow: 'hidden',
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
    backgroundColor: "#000", // Black background for icon circle
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
    backgroundColor: "#000", // Black background for check circle
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
