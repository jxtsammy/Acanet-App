"use client"
import { useRef, useState } from "react"
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, Animated, Easing, StatusBar } from "react-native"
import MapView, { Marker } from "react-native-maps"
import Icon from "react-native-vector-icons/MaterialIcons" // Icons
import { useNavigation } from "@react-navigation/native" // Import useNavigation

const MapScreen = () => {
  const navigation = useNavigation() // Initialize useNavigation hook
  const mainUser = {
    coordinate: { latitude: 6.6731, longitude: -1.5646 },
    firstName: "You",
    lastName: "",
    profilePicture: "https://i.pravatar.cc/50?img=25",
    location: "KNUST Library",
    lastActive: "Active now",
    bio: "Lifelong learner. Passionate about tech, innovation, and making a difference. Let's connect and share ideas.",
    isActive: true,
    occupation: "Student",
    isInNetwork: true, // Always true for main user
  }
  const [pins, setPins] = useState([
    {
      id: 1,
      coordinate: { latitude: 6.6735, longitude: -1.565 },
      firstName: "Peasah",
      lastName: "Ernest",
      profilePicture: "https://i.pravatar.cc/100?img=2",
      location: "College of Engineering",
      lastActive: "12h ago",
      bio: "Experienced professor in engineering and data science. Dedicated to mentoring future leaders in STEM.",
      isActive: false,
      occupation: "Lecturer",
      isInNetwork: false, // Not in network
    },
    {
      id: 2,
      coordinate: { latitude: 6.674, longitude: -1.5635 },
      firstName: "Kwame",
      lastName: "Asante",
      profilePicture: "https://i.pravatar.cc/100?img=3",
      location: "Queens Hall",
      lastActive: "Active Now",
      bio: "Entrepreneur. Innovator. Builder of ideas that bring positive positive change to our world. Big dreamer.",
      isActive: true,
      occupation: "Student",
      isInNetwork: true, // Already in network
    },
    {
      id: 3,
      coordinate: { latitude: 6.6725, longitude: -1.566 },
      firstName: "Ama",
      lastName: "Owusu",
      profilePicture: "https://i.pravatar.cc/100?img=4",
      location: "Africa Hall",
      lastActive: "2h ago",
      bio: "Passionate artist and creative thinker. I bring stories to life with vibrant colors and bold strokes.",
      isActive: true,
      occupation: "Student",
      isInNetwork: false, // Not in network
    },
    {
      id: 4,
      coordinate: { latitude: 6.6718, longitude: -1.5625 },
      firstName: "Tswum",
      lastName: "Osei",
      profilePicture: "https://i.pravatar.cc/100?img=5",
      location: "Great Hall",
      lastActive: "15h ago",
      bio: "Seasoned educator with over 30 years of experience. Let's inspire the next generation together.",
      isActive: false,
      occupation: "Lecturer",
      isInNetwork: false, // Not in network
    },
    {
      id: 5,
      coordinate: { latitude: 6.6732, longitude: -1.5638 },
      firstName: "Kwabena",
      lastName: "Bediako",
      profilePicture: "https://i.pravatar.cc/100?img=6",
      location: "CCT Building",
      lastActive: "5h ago",
      bio: "A tech enthusiast with a passion for software development. Always exploring new technologies.",
      isActive: true,
      occupation: "Student",
      isInNetwork: true, // Already in network
    },
    {
      id: 6,
      coordinate: { latitude: 6.6745, longitude: -1.5645 },
      firstName: "Kofi",
      lastName: "Appiah",
      profilePicture: "https://i.pravatar.cc/100?img=7",
      location: "Engineering Block A",
      lastActive: "3h ago",
      bio: "Mechanical engineering student. Learning and applying new skills every day.",
      isActive: true,
      occupation: "Student",
      isInNetwork: false, // Not in network
    },
    {
      id: 7,
      coordinate: { latitude: 6.675, longitude: -1.5652 },
      firstName: "Abena",
      lastName: "Aidoo",
      profilePicture: "https://i.pravatar.cc/100?img=8",
      location: "Student Centre",
      lastActive: "10h ago",
      bio: "Aspiring journalist. Passionate about storytelling, social change, and making an impact.",
      isActive: false,
      occupation: "Student",
      isInNetwork: false, // Not in network
    },
    {
      id: 8,
      coordinate: { latitude: 6.675, longitude: -1.5652 },
      firstName: "Kofi",
      lastName: "Bediako",
      profilePicture: "https://i.pravatar.cc/100?img=60",
      location: "Student Centre",
      lastActive: "10h ago",
      bio: "Aspiring journalist. Passionate about storytelling, social change, and making an impact.",
      isActive: false,
      occupation: "Lecturer",
      isInNetwork: false, // Not in network
    },
    {
      id: 9,
      coordinate: { latitude: 6.6748, longitude: -1.563 },
      firstName: "Yaa",
      lastName: "Ofori",
      profilePicture: "https://i.pravatar.cc/100?img=9",
      location: "Library Extension",
      lastActive: "4h ago",
      bio: "Researcher and student. Focused on sustainable development and environmental studies.",
      isActive: true,
      occupation: "Student",
      isInNetwork: false, // Not in network
    },
    {
      id: 10,
      coordinate: { latitude: 6.6753, longitude: -1.564 },
      firstName: "Kojo",
      lastName: "Dumelo",
      profilePicture: "https://i.pravatar.cc/100?img=10",
      location: "Student Union Building",
      lastActive: "6h ago",
      bio: "Political science major, striving to impact change through activism and leadership.",
      isActive: false,
      occupation: "Lecturer",
      isInNetwork: false, // Not in network
    },
    {
      id: 11,
      coordinate: { latitude: 6.673, longitude: -1.5675 },
      firstName: "Akosua",
      lastName: "Mensah",
      profilePicture: "https://i.pravatar.cc/100?img=11",
      location: "Sports Complex",
      lastActive: "1h ago",
      bio: "Sports enthusiast. Always striving to push limits and stay fit. Join me in sports activities!",
      isActive: true,
      occupation: "Student",
      isInNetwork: true, // Already in network
    },
    {
      id: 12,
      coordinate: { latitude: 6.6715, longitude: -1.5648 },
      firstName: "Ebo",
      lastName: "Nkrumah",
      profilePicture: "https://i.pravatar.cc/100?img=12",
      location: "Science Block",
      lastActive: "8h ago",
      bio: "A passionate biologist. Exploring the wonders of life and nature.",
      isActive: false,
      occupation: "Lecturer",
      isInNetwork: false, // Not in network
    },
  ])
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    userName: "",
  })
  const fadeAnim = useRef(new Animated.Value(1)).current
  const heightAnim = useRef(new Animated.Value(150)).current
  const notificationAnim = useRef(new Animated.Value(0)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  const handleProfilePress = (profile) => {
    setSelectedProfile(profile)
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(heightAnim, {
        toValue: 350,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => setIsExpanded(true))
    })
  }

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: 150,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsExpanded(false)
      setSelectedProfile(null)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })
  }

  const handleNetworkAction = () => {
    if (!selectedProfile || selectedProfile.firstName === "You") return
    if (!selectedProfile.isInNetwork) {
      // Update the pins state to mark user as in network
      setPins((prevPins) =>
        prevPins.map((pin) => (pin.id === selectedProfile.id ? { ...pin, isInNetwork: true } : pin)),
      )
      // Update selected profile
      setSelectedProfile((prev) => ({ ...prev, isInNetwork: true }))
      // Show notification
      const message = `Network request sent to ${selectedProfile.firstName}`
      setNotification({
        visible: true,
        message,
        userName: selectedProfile.firstName,
      })
      // Reset progress animation
      progressAnim.setValue(0)
      // Animate notification in
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        useNativeDriver: true,
      }).start(() => {
        // Start progress bar animation
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start()
        // Auto hide after 5 seconds
        setTimeout(() => {
          Animated.timing(notificationAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }).start(() => {
            setNotification({ visible: false, message: "", userName: "" })
          })
        }, 5000)
      })
    }
  }

  const handleMessagePress = () => {
    if (selectedProfile) {
      navigation.navigate("ChatInterface", {
        chatItem: {
          id: selectedProfile.id,
          firstName: selectedProfile.firstName,
          lastName: selectedProfile.lastName,
          image: selectedProfile.profilePicture,
          isOnline: selectedProfile.isActive,
        },
        // The onMessageUpdate function is not defined in this component.
        // If you need it, you should pass it as a prop from a parent component.
        // onMessageUpdate: updateChatWithMessage,
      });
    }
  };

  const getNetworkIcon = () => {
    if (!selectedProfile || selectedProfile.firstName === "You") return "add"
    return selectedProfile.isInNetwork ? "check" : "add"
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Enhanced Custom Notification */}
      {notification.visible && (
        <Animated.View
          style={[
            styles.notification,
            {
              opacity: notificationAnim,
              transform: [
                {
                  translateY: notificationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-120, 0],
                  }),
                },
                {
                  scale: notificationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
              <View style={styles.iconContainer}>
                <Icon name="person-add" size={24} color="#111" />
              </View>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>Network Request Sent</Text>
                <Text style={styles.notificationSubtitle}>
                  Your request has been sent to <Text style={styles.userName}>{notification.userName}</Text>
                </Text>
              </View>
              <View style={styles.successBadge}>
                <Icon name="check" size={16} color="#000" />
              </View>
            </View>
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      )}
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.6731,
          longitude: -1.5646,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={mainUser.coordinate}>
          <TouchableOpacity onPress={() => handleProfilePress(mainUser)}>
            <Image source={{ uri: mainUser.profilePicture }} style={styles.markerPicture} />
          </TouchableOpacity>
        </Marker>
        {pins.map((pin) => (
          <Marker key={pin.id} coordinate={pin.coordinate}>
            <TouchableOpacity onPress={() => handleProfilePress(pin)}>
              <Image source={{ uri: pin.profilePicture }} style={styles.markerPicture} />
            </TouchableOpacity>
          </Marker>
        ))}
      </MapView>
      {/* Bottom Container */}
      <Animated.View style={[styles.bottomContainer, { height: heightAnim }]}>
        {isExpanded && selectedProfile ? (
          <View style={styles.expandedContent}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: selectedProfile.profilePicture }} style={styles.expandedPicture} />
                {selectedProfile.isActive && <View style={styles.activeDot} />}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.expandedName}>
                  {selectedProfile.firstName} {selectedProfile.lastName}
                </Text>
                <Text style={styles.occupation}>{selectedProfile.occupation}</Text>
                <Text style={styles.location}>@{selectedProfile.location}</Text>
                <Text style={styles.lastActive}>
                  {selectedProfile.isActive ? "Active Now" : `Last active ${selectedProfile.lastActive}`}
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose}>
                <Icon name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, { width: "70%" }]} onPress={handleMessagePress}>
                <Icon name="chat-bubble" size={32} color="#fff" />
                <Text style={styles.actionText}>Message</Text>
              </TouchableOpacity>
              {selectedProfile.firstName !== "You" && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      width: "25%",
                      backgroundColor: selectedProfile.isInNetwork ? "#fff" : "#333",
                    },
                  ]}
                  onPress={handleNetworkAction}
                >
                  <Icon name={getNetworkIcon()} size={32} color={selectedProfile.isInNetwork ? "#111" : "#fff"} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.bioHeading}>Bio</Text>
            <ScrollView style={styles.bioTextContainer}>
              <Text style={styles.bioText}>{selectedProfile.bio}</Text>
            </ScrollView>
          </View>
        ) : (
          <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ opacity: fadeAnim }}>
            {[mainUser, ...pins].map((person, index) => (
              <TouchableOpacity key={index} style={styles.avatarContainer} onPress={() => handleProfilePress(person)}>
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: person.profilePicture }} style={styles.avatar} />
                  {person.isActive && <View style={styles.activeDot} />}
                </View>
                <Text style={styles.avatarName}>{person.firstName}</Text>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Enhanced Notification Styles
  notification: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  notificationCard: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  notificationSubtitle: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 20,
  },
  userName: {
    color: "#60A5FA",
    fontWeight: "600",
  },
  successBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 0,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  // Existing styles
  map: { flex: 1 },
  markerPicture: { width: 55, height: 55, borderRadius: 60 },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
  },
  avatarContainer: { alignItems: "center", marginHorizontal: 10 },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#fff",
    marginTop: 20,
  },
  avatarName: { fontSize: 14, color: "#fff", marginTop: 5 },
  activeDot: {
    position: "absolute",
    bottom: 0,
    right: 5,
    width: 15,
    height: 15,
    borderRadius: 20,
    backgroundColor: "#088a6a",
    borderWidth: 1,
    borderColor: "#fff",
  },
  expandedContent: { flex: 1, justifyContent: "center", marginTop: 10 },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  expandedPicture: { width: 80, height: 80, borderRadius: 40 },
  profileInfo: { marginLeft: 10, flex: 1 },
  expandedName: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  occupation: { fontSize: 14, color: "#ccc" },
  location: { fontSize: 14, color: "#ccc" },
  lastActive: { fontSize: 14, color: "#aaa" },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: { color: "#fff", marginLeft: 10, fontSize: 18 },
  bioHeading: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "left",
    marginHorizontal: 20,
  },
  bioTextContainer: {
    maxHeight: 150,
  },
  bioText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
    marginHorizontal: 20,
  },
})

export default MapScreen