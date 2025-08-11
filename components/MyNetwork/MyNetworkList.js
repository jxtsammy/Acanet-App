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
} from "react-native"
import Ionicons from "react-native-vector-icons/MaterialIcons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"

const { height, width } = Dimensions.get("window")

const NotificationToast = ({
  message,
  iconName,
  iconBgColor,
  iconColor,
  isVisible,
  progress,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 60,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 70],
  });

  if (!isVisible && slideAnim.__getValue() === -100) {
    return null;
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
  );
};

const initialNetworkData = [
  {
    id: "1",
    firstName: "Athalia",
    lastName: "Putri",
    status: "Last seen yesterday",
    online: false,
    jobTitle: "Software Engineer",
    institution: "@Tech Solutions Inc",
    lastActive: "Last active 1d ago",
    bio: "Passionate software engineer with 5+ years of experience in mobile app development. Specialized in React Native and cross-platform solutions. I love building robust and scalable applications that solve real-world problems. Always eager to learn new technologies and improve my skills. Currently exploring opportunities in AI integration for mobile apps.",
  },
  {
    id: "2",
    firstName: "Erlan",
    lastName: "Sadewa",
    status: "Online",
    online: true,
    jobTitle: "Product Designer",
    institution: "@Creative Studio",
    lastActive: "Active now",
    bio: "Creative product designer focused on user experience and interface design. Love creating intuitive and beautiful digital experiences. My passion lies in understanding user needs and translating them into elegant and functional designs. I have a strong portfolio of successful product launches and enjoy collaborating with cross-functional teams.",
  },
  {
    id: "3",
    firstName: "Midala",
    lastName: "Huera",
    status: "Last seen 3 hours ago",
    online: false,
    jobTitle: "Data Scientist",
    institution: "@Analytics Corp",
    lastActive: "Last active 3h ago",
    bio: "Data scientist with expertise in machine learning and statistical analysis. Passionate about turning data into actionable insights. I specialize in predictive modeling, data visualization, and building robust data pipelines. My goal is to help businesses make data-driven decisions and unlock new opportunities.",
  },
  {
    id: "4",
    firstName: "Nafisa",
    lastName: "Gitari",
    status: "Online",
    online: true,
    jobTitle: "Marketing Manager",
    institution: "@Brand Agency",
    lastActive: "Active now",
    bio: "Strategic marketing professional with a track record of successful campaigns. Specialized in digital marketing and brand development. I excel at creating compelling narratives and executing multi-channel marketing strategies that drive engagement and growth. Always looking for innovative ways to connect with target audiences.",
  },
  {
    id: "5",
    firstName: "Raki",
    lastName: "Devon",
    status: "Online",
    online: true,
    jobTitle: "Full Stack Developer",
    institution: "@DevCorp",
    lastActive: "Active now",
    bio: "Full stack developer with expertise in both frontend and backend technologies. Passionate about building scalable web applications. I enjoy working with modern frameworks like React and Node.js, and I'm always keen on optimizing performance and user experience. My experience spans across various industries, delivering robust and efficient solutions.",
  },
  {
    id: "6",
    firstName: "Salsabila",
    lastName: "Akira",
    status: "Last seen 30 minutes ago",
    online: false,
    jobTitle: "UX Researcher",
    institution: "@Design Lab",
    lastActive: "Last active 30m ago",
    bio: "UX researcher dedicated to understanding user behavior and improving digital experiences through data-driven insights. I conduct user interviews, usability testing, and data analysis to inform design decisions. My work ensures that products are not only aesthetically pleasing but also highly functional and user-centric.",
  },
  {
    id: "7",
    firstName: "Arjun",
    lastName: "Verma",
    status: "Online",
    online: true,
    jobTitle: "DevOps Engineer",
    institution: "@Cloud Systems",
    lastActive: "Active now",
    bio: "DevOps engineer specializing in cloud infrastructure and automation. Experienced in AWS, Docker, and Kubernetes. I focus on streamlining development workflows, ensuring continuous integration and deployment, and maintaining highly available systems. My expertise helps teams deliver software faster and more reliably.",
  },
  {
    id: "8",
    firstName: "Sophia",
    lastName: "Liu",
    status: "Last seen yesterday",
    online: false,
    jobTitle: "Business Analyst",
    institution: "@Consulting Group",
    lastActive: "Last active 1d ago",
    bio: "Business analyst with strong analytical skills and experience in process improvement and strategic planning. I bridge the gap between business needs and technical solutions, ensuring projects align with organizational goals. My approach involves thorough data analysis and effective communication to drive successful outcomes.",
  },
  {
    id: "9",
    firstName: "James",
    lastName: "Smith",
    status: "Last seen 2 hours ago",
    online: false,
    jobTitle: "Project Manager",
    institution: "@Tech Innovations",
    lastActive: "Last active 2h ago",
    bio: "Experienced project manager with a proven track record of delivering complex projects on time and within budget. I lead cross-functional teams, manage stakeholder expectations, and mitigate risks to ensure project success. My focus is on efficient execution and delivering high-quality results.",
  },
  {
    id: "10",
    firstName: "Lila",
    lastName: "Jones",
    status: "Online",
    online: true,
    jobTitle: "Lecturer",
    institution: "@College of Engineering",
    lastActive: "Active now",
    bio: "Experienced professor in engineering and data science. Dedicated to mentoring future leaders in STEM. I teach advanced courses, conduct research, and publish in leading journals. My passion is to inspire the next generation of engineers and scientists to innovate and make a positive impact.",
  },
].sort((a, b) => a.firstName.localeCompare(b.firstName))

const ContactsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("")
  const [allNetworkData, setAllNetworkData] = useState(initialNetworkData)
  const [filteredData, setFilteredData] = useState(initialNetworkData)
  const [selectedContact, setSelectedContact] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalAnimation] = useState(new Animated.Value(0))

  // Toast notification states
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastIconName, setToastIconName] = useState("")
  const [toastIconBgColor, setToastIconBgColor] = useState("")
  const [toastIconColor, setToastIconColor] = useState("")
  const toastProgress = useRef(new Animated.Value(0)).current

  // Calculate total notification count (updates + requests)
  const [totalNotificationCount, setTotalNotificationCount] = useState(8)

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
      // Navigate and pass a clean chatItem object, just like in MapScreen
      navigation.navigate("ChatInterface", {
        chatItem: {
          id: selectedContact.id,
          firstName: selectedContact.firstName,
          lastName: selectedContact.lastName,
          image: `https://i.pravatar.cc/150?u=${selectedContact.id}`, // Re-create the image URL
          isOnline: selectedContact.online, // Use the correct property name from your data
        },
      });
      console.log(`Maps to chat with ${selectedContact?.firstName} ${selectedContact?.lastName}`);
    }
  };

  const handleDisconnect = () => {
    if (selectedContact) {
      const updatedNetwork = allNetworkData.filter((contact) => contact.id !== selectedContact.id)
      setAllNetworkData(updatedNetwork)
      setFilteredData(updatedNetwork)
      closeContactModal()
      showToastNotification(selectedContact.firstName)
      console.log(`Disconnected from ${selectedContact?.firstName} ${selectedContact?.lastName}`)
    }
  }

  const renderContactItem = ({ item }) => {
    const avatarUrl = `https://i.pravatar.cc/150?u=${item.id}`
    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => openContactModal(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: avatarUrl }} style={styles.profileImage} />
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.contactStatus}>{item.status}</Text>
        </View>
        {item.online && <View style={styles.onlineIndicator} />}
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Network</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("Notifications")}>
            <Ionicons name="notifications" size={28} color="#fff" />
            {totalNotificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{totalNotificationCount > 99 ? "99+" : totalNotificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("AddNetwork")}>
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
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("AddNetwork")}>
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
                  <Image
                    source={{ uri: `https://i.pravatar.cc/150?u=${selectedContact?.id}` }}
                    style={styles.modalProfileImage}
                  />
                  <View style={styles.modalContactInfo}>
                    <Text style={styles.modalContactName}>
                      {selectedContact?.firstName} {selectedContact?.lastName}
                    </Text>
                    <Text style={styles.modalJobTitle}>{selectedContact?.jobTitle}</Text>
                    <Text style={styles.modalInstitution}>{selectedContact?.institution}</Text>
                    <Text style={styles.modalLastActive}>{selectedContact?.lastActive}</Text>
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
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  contactStatus: {
    fontSize: 14,
    color: "#888",
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
  modalContactInfo: {
    flex: 1,
  },
  modalContactName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  modalJobTitle: {
    fontSize: 16,
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
    position: 'absolute',
    top: 0,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  toastIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 14,
    color: '#111',
  },
  toastCheckIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
})

export default ContactsScreen