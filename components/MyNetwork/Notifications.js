"use client"
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Alert,
  ImageBackground,
  Dimensions,
  Modal,
  PanResponder,
} from "react-native"
import Ionicons from "react-native-vector-icons/MaterialIcons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import {
  FIRESTORE_DB,
  FIREBASE_AUTH,
} from "../../firebaseConfig"
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  runTransaction,
  collection,
  onSnapshot,
  addDoc,
} from "firebase/firestore"

const { width } = Dimensions.get("window")

// Custom Toast Notification Component
const CustomToast = ({ visible, message, type, onHide }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()

      const timer = setTimeout(() => {
        hideToast()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [visible])

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide()
    })
  }

  const getToastConfig = () => {
    switch (type) {
      case "accepted":
        return {
          icon: "check-circle",
          iconColor: "#10B981",
          title: "Request Accepted",
          bgColor: ["rgba(16, 185, 129, 0.9)", "rgba(5, 150, 105, 0.9)"],
        }
      case "declined":
        return {
          icon: "cancel",
          iconColor: "#EF4444",
          title: "Request Declined",
          bgColor: ["rgba(239, 68, 68, 0.9)", "rgba(220, 38, 38, 0.9)"],
        }
      default:
        return {
          icon: "notifications",
          iconColor: "#3B82F6",
          title: "Notification",
          bgColor: ["rgba(59, 130, 246, 0.9)", "rgba(37, 99, 235, 0.9)"],
        }
    }
  }

  const config = getToastConfig()

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity onPress={hideToast} activeOpacity={0.9}>
        <LinearGradient colors={config.bgColor} style={styles.toastGradient}>
          <BlurView intensity={20} style={styles.toastBlur}>
            <View style={styles.toastContent}>
              <View style={styles.toastIconContainer}>
                <Ionicons name={config.icon} size={24} color="#fff" />
              </View>
              <View style={styles.toastTextContainer}>
                <Text style={styles.toastTitle}>{config.title}</Text>
                <Text style={styles.toastMessage}>{message}</Text>
              </View>
              <View style={styles.toastCheckContainer}>
                <Ionicons name="check" size={20} color="#fff" />
              </View>
            </View>
          </BlurView>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )
}

const NotificationsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("updates")
  const [updates, setUpdates] = useState([])
  const [requests, setRequests] = useState([])
  const [slideAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(1))
  const [fadeAnim] = useState(new Animated.Value(0))
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [modalAnimation] = useState(new Animated.Value(0))

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("accepted")

  useEffect(() => {
    const currentUser = FIREBASE_AUTH.currentUser
    if (!currentUser) return

    const requestsQuery = collection(FIRESTORE_DB, "networkRequests")
    const requestsListener = onSnapshot(requestsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = { id: change.doc.id, ...change.doc.data() }

        if (data.toUserId !== currentUser.uid) {
          return
        }

        if (change.type === "added") {
          setRequests((prev) => [
            {
              id: data.id,
              ...data,
              user: {
                firstName: data.fromUserFirstName,
                lastName: data.fromUserLastName,
                avatar: data.fromUserProfileImage,
                uid: data.fromUserId,
              },
            },
            ...prev,
          ])
        }

        if (change.type === "removed") {
          setRequests((prev) => prev.filter((item) => item.id !== data.id))
        }
      })
    })

    const updatesQuery = collection(FIRESTORE_DB, "updates")
    const updatesListener = onSnapshot(updatesQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = { id: change.doc.id, ...change.doc.data() }

        if (change.type === "added") {
          setUpdates(prev => [{ ...data, read: false }, ...prev]);
        }
        if (change.type === "modified") {
          setUpdates(prev => prev.map(item => item.id === data.id ? { ...item, ...data } : item));
        }
        if (change.type === "removed") {
          setUpdates(prev => prev.filter(item => item.id !== data.id));
        }
      });
    });

    return () => {
      requestsListener()
      updatesListener()
    }
  }, [])

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return (
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
        Math.abs(gestureState.dx) > 20
      )
    },
    onPanResponderMove: (evt, gestureState) => {},
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        if (activeTab === "requests") {
          handleTabChange("updates")
        }
      } else if (gestureState.dx < -50) {
        if (activeTab === "updates") {
          handleTabChange("requests")
        }
      }
    },
  })

  const showToast = (message, type) => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  const hideToast = () => {
    setToastVisible(false)
  }

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [activeTab])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: tab === "updates" ? 0 : 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
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

  const handleDeleteAllUpdates = () => {
    hideDeleteModal()
    setTimeout(() => {
      setUpdates([])
      showToast("All updates have been deleted", "Cleared Updates")
    }, 300)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "request_sent":
        return {
          name: "send",
          color: "#60A5FA",
          bgColor: "rgba(96, 165, 250, 0.2)",
        }
      case "request_accepted":
        return {
          name: "check-circle",
          color: "#34D399",
          bgColor: "rgba(52, 211, 153, 0.2)",
        }
      case "request_declined_by_you":
        return {
          name: "cancel",
          color: "#F87171",
          bgColor: "rgba(248, 113, 113, 0.2)",
        }
      case "request_accepted_by_you":
        return {
          name: "person-add",
          color: "#A78BFA",
          bgColor: "rgba(167, 139, 250, 0.2)",
        }
      default:
        return {
          name: "notifications",
          color: "#9CA3AF",
          bgColor: "rgba(156, 163, 175, 0.2)",
        }
    }
  }

  const handleAcceptRequest = async (requestId, requestItem) => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser
      if (!currentUser) {
        throw new Error("User not authenticated.")
      }

      const currentUserRef = doc(FIRESTORE_DB, "users", currentUser.uid)
      const currentUserSnap = await getDoc(currentUserRef)

      if (currentUserSnap.empty) {
        throw new Error("Current user profile not found.")
      }
      const currentUserData = currentUserSnap.data()

      const senderData = {
        uid: requestItem.fromUserId,
        firstName: requestItem.fromUserFirstName,
        lastName: requestItem.fromUserLastName,
        userRole: requestItem.fromUserRole,
        profileImageUrl: requestItem.fromUserProfileImage,
      }

      await runTransaction(FIRESTORE_DB, async (transaction) => {
        const requestRef = doc(FIRESTORE_DB, "networkRequests", requestId)
        transaction.delete(requestRef)

        const currentUserNetworkDocRef = doc(
          collection(FIRESTORE_DB, "networks"),
          `${currentUser.uid}_${senderData.uid}`
        )
        transaction.set(currentUserNetworkDocRef, {
          userId: currentUser.uid,
          networkMemberId: senderData.uid,
          firstName: senderData.firstName,
          lastName: senderData.lastName,
          userRole: senderData.userRole,
          profileImageUrl: senderData.profileImageUrl,
          bio: senderData.bio || null,
        })

        const otherUserNetworkDocRef = doc(
          collection(FIRESTORE_DB, "networks"),
          `${senderData.uid}_${currentUser.uid}`
        )
        transaction.set(otherUserNetworkDocRef, {
          userId: senderData.uid,
          networkMemberId: currentUser.uid,
          firstName: currentUserData.firstName,
          lastName: currentUserData.lastName,
          userRole: currentUserData.userRole,
          profileImageUrl: currentUserData.profileImageUrl,
          bio: currentUserData.bio || null,
        })
      })

      // Add new update document to Firestore
      const updatesRef = collection(FIRESTORE_DB, "updates")
      await addDoc(updatesRef, {
        type: "request_accepted_by_you",
        user: {
          uid: senderData.uid,
          firstName: senderData.firstName,
          lastName: senderData.lastName,
          avatar: senderData.profileImageUrl,
        },
        message: `You accepted ${senderData.firstName} ${senderData.lastName}'s network request`,
        timestamp: new Date().toISOString(),
        read: false,
      })

      // We no longer need to manually update the state here.
      // The onSnapshot listener will handle it automatically.

      showToast(`${senderData.firstName} ${senderData.lastName} is now in your network!`, "accepted")
    } catch (error) {
      console.error("Error accepting request:", error)
      showToast("Failed to accept request. Please try again.", "declined")
    }
  }

  const handleDeclineRequest = async (requestId, requestItem) => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser
      if (!currentUser) {
        throw new Error("User not authenticated.")
      }

      const requestRef = doc(FIRESTORE_DB, "networkRequests", requestId)
      await deleteDoc(requestRef)

      // Add new update document to Firestore
      const updatesRef = collection(FIRESTORE_DB, "updates")
      await addDoc(updatesRef, {
        type: "request_declined_by_you",
        user: {
          firstName: requestItem.fromUserFirstName,
          lastName: requestItem.fromUserLastName,
          avatar: requestItem.fromUserProfileImage,
        },
        message: `You declined ${requestItem.fromUserFirstName} ${requestItem.fromUserLastName}'s network request`,
        timestamp: new Date().toISOString(),
        read: false,
      })

      // We no longer need to manually update the state here.
      // The onSnapshot listener will handle it automatically.

      showToast(`Request from ${requestItem.fromUserFirstName} ${requestItem.fromUserLastName} declined`, "declined")
    } catch (error) {
      console.error("Error declining request:", error)
      showToast("Failed to decline request. Please try again.", "declined")
    }
  }

  const renderUpdateItem = ({ item, index }) => {
    const icon = getNotificationIcon(item.type)
    const itemAnim = new Animated.Value(0)
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 600,
      delay: index * 100,
      useNativeDriver: true,
    }).start()

    return (
      <Animated.View
        style={[
          styles.notificationItem,
          {
            opacity: itemAnim,
            transform: [
              {
                translateY: itemAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.notificationContent}>
          <View style={styles.avatarContainer}>
            {item.user.avatar ? (
              <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Ionicons name="person" size={32} color="#000" />
              </View>
            )}
            <View style={[styles.iconBadge, { backgroundColor: "#fff" }]}>
              <Ionicons name={icon.name} size={18} color="#000" />
            </View>
            <View style={[styles.iconGlow, { backgroundColor: icon.bgColor }]} />
          </View>
          <View style={styles.messageContent}>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          {!item.read && (
            <View style={styles.unreadIndicator}>
              <View style={styles.unreadDot} />
              <View style={styles.unreadPulse} />
            </View>
          )}
        </View>
      </Animated.View>
    )
  }

  const renderRequestItem = ({ item, index }) => {
    const itemAnim = new Animated.Value(0)
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 600,
      delay: index * 100,
      useNativeDriver: true,
    }).start()

    return (
      <Animated.View
        style={[
          styles.requestItem,
          {
            opacity: itemAnim,
            transform: [
              {
                translateY: itemAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.requestContent}>
          <View style={styles.requestHeader}>
            <View style={styles.avatarContainer}>
              {item.user.avatar ? (
                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Ionicons name="person" size={32} color="#000" />
                </View>
              )}
              <View style={[styles.iconBadge, { backgroundColor: "#111" }]}>
                <Ionicons name="person-add" size={16} color="#fff" />
              </View>
              <View
                style={[
                  styles.iconGlow,
                  { backgroundColor: "rgba(245, 158, 11, 0.2)" },
                ]}
              />
            </View>
            <View style={styles.requestInfo}>
              <Text style={styles.requestUserName}>
                {item.user.firstName} {item.user.lastName}
              </Text>
              <Text style={styles.requestMessage}>
                wants to connect with you
              </Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            {!item.read && (
              <View style={styles.unreadIndicator}>
                <View style={styles.unreadDot} />
                <View style={styles.unreadPulse} />
              </View>
            )}
          </View>
          <View style={styles.requestActions}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => handleDeclineRequest(item.id, item)}
            >
              <View style={styles.declineButtonContent}>
                <Ionicons name="close" size={16} color="#fff" />
                <Text style={styles.declineButtonText}>Decline</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAcceptRequest(item.id, item)}
            >
              <View style={styles.acceptButtonContent}>
                <Ionicons name="person-add" size={16} color="#000" />
                <Text style={styles.acceptButtonText}>Accept</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    )
  }

  const updatesCount = updates.length
  const requestsCount = requests.length

  return (
    <ImageBackground
      source={require("../../assets/notificationsbg.jpg")}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.85)", "rgba(0,0,0,0.95)"]}
        style={styles.overlay}
      >
        <StatusBar barStyle="light-content" />

        <CustomToast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onHide={hideToast}
        />

        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <BlurView intensity={20} style={styles.backButtonBlur}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </BlurView>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
          {activeTab === "updates" && updates.length > 0 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={showDeleteModal}
            >
              <BlurView intensity={20} style={styles.deleteButtonBlur}>
                <Ionicons name="delete" size={24} color="#EF4444" />
              </BlurView>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Animated.View
          style={[styles.tabContainer, { opacity: fadeAnim }]}
          {...panResponder.panHandlers}
        >
          <BlurView intensity={30} style={styles.tabBlurBackground}>
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
              style={styles.tabGradientOverlay}
            >
              <Animated.View
                style={[
                  styles.tabIndicator,
                  {
                    transform: [
                      {
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [6, (width - 52) / 2],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <TouchableOpacity
                style={styles.tab}
                onPress={() => handleTabChange("updates")}
              >
                <Animated.View
                  style={[styles.tabContent, { transform: [{ scale: scaleAnim }] }]}
                >
                  <Ionicons
                    name="update"
                    size={20}
                    color={activeTab === "updates" ? "#000" : "#fff"}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "updates" && styles.activeTabText,
                    ]}
                  >
                    Updates
                  </Text>
                  {updatesCount > 0 && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{updatesCount}</Text>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => handleTabChange("requests")}
              >
                <Animated.View
                  style={[styles.tabContent, { transform: [{ scale: scaleAnim }] }]}
                >
                  <Ionicons
                    name="person-add"
                    size={20}
                    color={activeTab === "requests" ? "#000" : "#fff"}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "requests" && styles.activeTabText,
                    ]}
                  >
                    Requests
                  </Text>
                  {requestsCount > 0 && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{requestsCount}</Text>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
          <Text style={styles.swipeHint}>← Swipe to switch tabs →</Text>
        </Animated.View>

        <Animated.View
          style={[styles.content, { opacity: fadeAnim }]}
          {...panResponder.panHandlers}
        >
          {activeTab === "updates" ? (
            updates.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-none" size={80} color="#fff" />
                <Text style={styles.emptyStateTitle}>No Updates</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Your network activity updates will appear here
                </Text>
              </View>
            ) : (
              <FlatList
                data={updates}
                keyExtractor={(item) => item.id}
                renderItem={renderUpdateItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            )
          ) : requests.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="person-add-disabled" size={80} color="#fff" />
              <Text style={styles.emptyStateTitle}>No Requests</Text>
              <Text style={styles.emptyStateSubtitle}>
                Network requests from others will appear here
              </Text>
            </View>
          ) : (
            <FlatList
              data={requests}
              keyExtractor={(item) => item.id}
              renderItem={renderRequestItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </Animated.View>

        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="none"
          onRequestClose={hideDeleteModal}
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
              <LinearGradient
                colors={["rgba(30, 30, 30, 0.95)", "rgba(20, 20, 20, 0.98)"]}
                style={styles.modalGradient}
              >
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconContainer}>
                    <Ionicons name="delete-forever" size={32} color="#EF4444" />
                  </View>
                  <Text style={styles.modalTitle}>Delete All Updates</Text>
                  <Text style={styles.modalSubtitle}>
                    Are you sure you want to delete all updates?
                  </Text>
                </View>
                <View style={styles.modalContent}>
                  <Text style={styles.modalDescription}>
                    This action will permanently delete all your network activity
                    updates. This action cannot be undone.
                  </Text>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={hideDeleteModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteConfirmButton}
                    onPress={handleDeleteAllUpdates}
                  >
                    <LinearGradient
                      colors={["#EF4444", "#DC2626"]}
                      style={styles.deleteButtonGradient}
                    >
                      <Text style={styles.deleteConfirmButtonText}>Delete All</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
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
  toastContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastGradient: {
    borderRadius: 16,
    overflow: "hidden",
  },
  toastBlur: {
    borderRadius: 16,
    overflow: "hidden",
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  toastIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  toastCheckContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
  },
  backButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginLeft: 12,
  },
  deleteButton: {
    width: 44,
    height: 44,
  },
  deleteButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  tabContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tabBlurBackground: {
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  tabGradientOverlay: {
    padding: 6,
    flexDirection: "row",
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    top: 6,
    width: (width - 52) / 2 - 6,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 30,
  },
  tab: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#000",
  },
  tabBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  tabBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  swipeHint: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationItem: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  requestItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
  },
  requestContent: {
    padding: 16,
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  defaultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  iconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconGlow: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 28,
    opacity: 0.2,
  },
  messageContent: {
    flex: 1,
  },
  requestInfo: {
    flex: 1,
  },
  requestUserName: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700",
    marginBottom: 2,
  },
  requestMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
    marginBottom: 6,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    fontWeight: "400",
  },
  requestActions: {
    flexDirection: "row",
    gap: 10,
  },
  declineButton: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: "#000",
  },
  declineButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 18,
  },
  acceptButton: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  acceptButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 18,
  },
  declineButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  acceptButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  unreadIndicator: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
  },
  unreadPulse: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#3B82F6",
    opacity: 0.3,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 24,
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  modalGradient: {
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
    backgroundColor: "rgba(239, 68, 68, 0.1)",
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
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
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
  deleteConfirmButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  deleteButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  deleteConfirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default NotificationsScreen