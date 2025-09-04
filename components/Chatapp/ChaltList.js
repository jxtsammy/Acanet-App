"use client"

import { useState, useRef, useEffect, useMemo } from "react"

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Alert,
  Dimensions,
  Platform,
  TextInput,
  SafeAreaView,
  ImageBackground,
} from "react-native"

import Icon from "react-native-vector-icons/MaterialIcons"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

const ChatListScreen = ({ navigation }) => {
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current
  const selectionHeaderAnim = useRef(new Animated.Value(0)).current
  const normalHeaderAnim = useRef(new Animated.Value(1)).current

  // State management
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [chats, setChats] = useState([
    {
      id: "1",
      firstName: "Leonard",
      lastName: "Miebo",
      message: "How are you today?",
      time: "2 min ago",
      unread: 3,
      image: null, // Changed to null to show default avatar
      isSelected: false,
      isMuted: false,
      isPinned: false,
      isOnline: true,
      isSent: false,
      isTyping: false,
      isFavorite: false,
      isArchived: false,
      lastMessageTime: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      messageType: "text",
    },
    {
      id: "2",
      firstName: "James",
      lastName: "Asante",
      message: "Don't miss the meeting.",
      time: "5 min ago",
      unread: 0,
      image: null,
      isSelected: false,
      isMuted: false,
      isPinned: false,
      isOnline: false,
      isSent: true,
      isTyping: false,
      isFavorite: false,
      isArchived: false,
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      messageType: "text",
    },
    {
      id: "3",
      firstName: "Nasser",
      lastName: "Jagawada",
      message: "Can you join the meeting?",
      time: "10 min ago",
      unread: 1,
      image: null, // Changed to null to show default avatar
      isSelected: false,
      isMuted: false,
      isPinned: false,
      isOnline: true,
      isSent: false,
      isTyping: true,
      isFavorite: false,
      isArchived: false,
      lastMessageTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      messageType: "text",
    },
    {
      id: "4",
      firstName: "Sabila",
      lastName: "Sayma",
      message: "How are you today?",
      time: "20 min ago",
      unread: 0,
      image: null,
      isSelected: false,
      isMuted: false,
      isPinned: false,
      isOnline: true,
      isSent: false,
      isTyping: false,
      isFavorite: false,
      isArchived: false,
      lastMessageTime: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      messageType: "text",
    },
    {
      id: "5",
      firstName: "Bernard",
      lastName: "Adjei",
      message: "Have a good day 🌸",
      time: "30 min ago",
      unread: 0,
      image: null, // Changed to null to show default avatar
      isSelected: false,
      isMuted: false,
      isPinned: false,
      isOnline: true,
      isSent: false,
      isTyping: false,
      isFavorite: false,
      isArchived: false,
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      messageType: "text",
    },
    {
      id: "6",
      firstName: "Sophia",
      lastName: "Willows",
      message: "Let me know when you're free!",
      time: "1 hr ago",
      unread: 0,
      image: null,
      isSelected: false,
      isMuted: false,
      isPinned: false,
      isOnline: true,
      isSent: false,
      isTyping: false,
      isFavorite: false,
      isArchived: false,
      lastMessageTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      messageType: "text",
    },
    // Additional chat items
    {
      id: "7",
      firstName: "Emmanuel",
      lastName: "Offei",
      message: "Thanks for the help yesterday!",
      time: "2 hrs ago",
      unread: 2,
      image: null, // Changed to null to show default avatar
      isSelected: false,
      isMuted: false,
      isPinned: false,
      isOnline: false,
      isSent: false,
      isTyping: false,
      isFavorite: true,
      isArchived: false,
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      messageType: "text",
    },
    {
      id: "8",
      firstName: "Roger",
      lastName: "Adu",
      message: "Great job on the presentation!",
      time: "5 hrs ago",
      unread: 0,
      image: null,
      isSelected: false,
      isMuted: false,
      isPinned: true,
      isOnline: true,
      isSent: false,
      isTyping: false,
      isFavorite: true,
      isArchived: false,
      lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      messageType: "text",
    },
    {
      id: "9",
      firstName: "Lisa",
      lastName: "Anderson",
      message: "Can we reschedule our meeting?",
      time: "6 hrs ago",
      unread: 0,
      image: null, // Changed to null to show default avatar
      isSelected: false,
      isMuted: false,
      isPinned: false,
      isOnline: false,
      isSent: false,
      isTyping: false,
      isFavorite: false,
      isArchived: false,
      lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      messageType: "text",
    },
    {
      id: "10",
      firstName: "Robert",
      lastName: "Brown",
      message: "Happy birthday! 🎉",
      time: "1 day ago",
      unread: 0,
      image: null,
      isSelected: false,
      isMuted: false,
      isPinned: false,
      isOnline: true,
      isSent: false,
      isTyping: false,
      isFavorite: false,
      isArchived: false,
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      messageType: "text",
    },
  ])

  // Helper functions
  const getSelectedCount = () => chats.filter((chat) => chat.isSelected).length
  const getSelectedChat = () => {
    const selected = chats.filter((chat) => chat.isSelected)
    return selected.length === 1 ? selected[0] : null
  }

  // Check if selected chats have mixed pin states
  const getSelectedChats = () => chats.filter((chat) => chat.isSelected)
  const hasMixedPinStates = () => {
    const selected = getSelectedChats()
    if (selected.length <= 1) return false
    const pinnedCount = selected.filter((chat) => chat.isPinned).length
    return pinnedCount > 0 && pinnedCount < selected.length
  }

  // Format time for display
  const formatTime = (date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return "now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hr ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 7) return `${diffInDays} days ago`

    return date.toLocaleDateString()
  }

  // Get message preview based on type
  const getMessagePreview = (message, messageType, caption) => {
    if (caption && caption.trim()) {
      return caption
    }

    switch (messageType) {
      case "image":
        return "📷 Photo"
      case "audio":
        return "🎵 Voice message"
      case "document":
        return "📄 Document"
      case "video":
        return "🎥 Video"
      default:
        return message
    }
  }

  // Update chat with new message
  const updateChatWithMessage = (chatId, newMessage) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            message: getMessagePreview(newMessage.text, newMessage.type, newMessage.caption),
            messageType: newMessage.type,
            time: formatTime(new Date()),
            lastMessageTime: new Date(),
            unread: chat.unread + (newMessage.isUser ? 0 : 1), // Don't increment for user's own messages
            isSent: newMessage.isUser,
          }
        }
        return chat
      })

      // Sort by most recent message
      return updatedChats.sort((a, b) => {
        // Pinned chats first
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        // Then by most recent message
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      })
    })
  }

  // Filter chats based on active filter and search
  const filteredChats = useMemo(() => {
    let filtered = [...chats]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (chat) =>
          `${chat.firstName} ${chat.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.message.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    switch (activeFilter) {
      case "Unread":
        filtered = filtered.filter((chat) => chat.unread > 0 && !chat.isArchived)
        break
      case "Read":
        filtered = filtered.filter((chat) => chat.unread === 0 && !chat.isArchived)
        break
      case "Favorites":
        filtered = filtered.filter((chat) => chat.isFavorite && !chat.isArchived)
        break
      case "Archived":
        filtered = filtered.filter((chat) => chat.isArchived)
        break
      default:
        // 'All' - show only non-archived chats
        filtered = filtered.filter((chat) => !chat.isArchived)
        break
    }

    // Sort: pinned first, then by time (only for non-archived)
    if (activeFilter !== "Archived") {
      return filtered.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        }
        return a.isPinned ? -1 : 1
      })
    }

    return filtered
  }, [chats, activeFilter, searchQuery])

  // Animation effects
  useEffect(() => {
    const selectedCount = getSelectedCount()

    if (selectedCount > 0) {
      Animated.parallel([
        Animated.timing(normalHeaderAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(selectionHeaderAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(normalHeaderAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(selectionHeaderAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [chats])

  // Action handlers
  const toggleChatSelection = (chatId) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === chatId ? { ...chat, isSelected: !chat.isSelected } : chat)),
    )
  }

  const resetSelection = () => {
    setChats((prevChats) => prevChats.map((chat) => ({ ...chat, isSelected: false })))
  }

  // Mark chat as read
  const markChatAsRead = (chatId) => {
    setChats((prevChats) => prevChats.map((chat) => (chat.id === chatId ? { ...chat, unread: 0 } : chat)))
  }

  // Handle chat press - UPDATED to navigate to ChatScreen
  const handleChatPress = (item) => {
    if (getSelectedCount() > 0) {
      toggleChatSelection(item.id)
    } else {
      // Mark chat as read when opening it
      if (item.unread > 0) {
        markChatAsRead(item.id)
      }

      // Navigate to ChatScreen with chat data and callback
      navigation.navigate("ChatInterface", {
        chatItem: {
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          image: item.image,
          isOnline: item.isOnline,
        },
        onMessageUpdate: updateChatWithMessage, // Callback for message updates
      })
    }
  }

  const handleFavorite = () => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.isSelected ? { ...chat, isFavorite: !chat.isFavorite } : chat)),
    )
  }

  const handleMute = () => {
    setChats((prevChats) => prevChats.map((chat) => (chat.isSelected ? { ...chat, isMuted: !chat.isMuted } : chat)))
  }

  const handlePin = () => {
    const selectedChats = getSelectedChats()
    const allPinned = selectedChats.every((chat) => chat.isPinned)

    setChats((prevChats) => prevChats.map((chat) => (chat.isSelected ? { ...chat, isPinned: !allPinned } : chat)))
  }

  const handleArchive = () => {
    const selectedCount = getSelectedCount()
    const selectedChats = getSelectedChats()
    const allArchived = selectedChats.every((chat) => chat.isArchived)

    const action = allArchived ? "unarchive" : "archive"
    const actionText = allArchived ? "Unarchive" : "Archive"

    Alert.alert(`${actionText} Chats`, `Are you sure you want to ${action} ${selectedCount} chat(s)?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: actionText,
        onPress: () => {
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.isSelected ? { ...chat, isArchived: !allArchived, isSelected: false } : chat,
            ),
          )
        },
      },
    ])
  }

  const handleDelete = () => {
    Alert.alert("Delete Chats", `Are you sure you want to delete ${getSelectedCount()} chat(s)?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setChats((prevChats) => prevChats.filter((chat) => !chat.isSelected))
        },
      },
    ])
  }

  // Get pin icon based on selection state
  const getPinIcon = () => {
    if (hasMixedPinStates()) return null

    const selectedChats = getSelectedChats()
    if (selectedChats.length === 0) return "push-pin"

    return "push-pin"
  }

  const getPinIconRotation = () => {
    const selectedChats = getSelectedChats()
    if (selectedChats.length === 0) return "0deg"

    const allPinned = selectedChats.every((chat) => chat.isPinned)
    return allPinned ? "45deg" : "0deg"
  }

  // Get archive icon based on selection state
  const getArchiveIcon = () => {
    const selectedChats = getSelectedChats()
    if (selectedChats.length === 0) return "archive"

    const allArchived = selectedChats.every((chat) => chat.isArchived)
    return allArchived ? "unarchive" : "archive"
  }

  // Render chat item with default avatar support
  const renderChatItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.chatItem,
        item.isPinned && styles.pinnedChat,
        item.isSelected && styles.selectedChat,
        item.isArchived && styles.archivedChat,
      ]}
      onPress={() => handleChatPress(item)}
      onLongPress={() => toggleChatSelection(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.defaultAvatar]}>
            <Icon name="person" size={32} color="#000" />
          </View>
        )}
        {item.isOnline && <View style={styles.onlineIndicator} />}
        {item.isSelected && (
          <View style={styles.selectionIndicator}>
            <Icon name="check" size={16} color="white" />
          </View>
        )}
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.chatName}>
              {item.firstName} {item.lastName}
            </Text>
            {item.isPinned && (
              <Icon name="push-pin" size={14} color="rgba(255, 255, 255, 0.6)" style={styles.pinnedIcon} />
            )}
            {item.isArchived && (
              <Icon name="archive" size={14} color="rgba(255, 255, 255, 0.6)" style={styles.archivedIcon} />
            )}
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.chatTime}>{item.time}</Text>
            {item.isFavorite && <Icon name="star" size={16} color="#FFD700" style={styles.favoriteIcon} />}
          </View>
        </View>
        <View style={styles.messageRow}>
          <View style={styles.messageContainer}>
            {item.isSent && <Icon name="done-all" size={16} color="#4FC3F7" style={styles.sentIcon} />}
            {item.isTyping ? (
              <Text style={styles.typingText}>typing...</Text>
            ) : (
              <Text style={[styles.messageText, item.unread > 0 && styles.unreadMessage]} numberOfLines={1}>
                {item.message}
              </Text>
            )}
          </View>

          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground
        source={require("../../assets/808bc6634f052134029221e7d7b8e5d7.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.75)", "rgba(0,0,0,0.9)", "rgba(0,0,0,90)"]}
          style={styles.gradientOverlay}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Normal Header */}
            <Animated.View
              style={[
                styles.normalHeader,
                {
                  opacity: normalHeaderAnim,
                  transform: [
                    {
                      translateY: normalHeaderAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-60, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.headerTitle}>{activeFilter === "Archived" ? "Archived Chats" : "Chats"}</Text>
              <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("Home", { screen: "Settings" })}>
                <View style={styles.profileImage}>
                  <Icon name="person" size={24} color="#000" />
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Selection Header */}
            <Animated.View
              style={[
                styles.selectionHeader,
                {
                  opacity: selectionHeaderAnim,
                  transform: [
                    {
                      translateY: selectionHeaderAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-60, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.selectionLeft}>
                <TouchableOpacity style={styles.headerButton} onPress={resetSelection}>
                  <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.selectionCount}>{getSelectedCount()}</Text>
              </View>
              <View style={styles.selectionActions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
                  <Icon
                    name={getSelectedCount() === 1 && getSelectedChat()?.isFavorite ? "star" : "star-border"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleMute}>
                  <Icon
                    name={getSelectedCount() === 1 && getSelectedChat()?.isMuted ? "volume-up" : "volume-off"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>

                {!hasMixedPinStates() && (
                  <TouchableOpacity style={styles.actionButton} onPress={handlePin}>
                    <Icon
                      name={getPinIcon()}
                      size={24}
                      color="white"
                      style={{
                        transform: [{ rotate: getPinIconRotation() }],
                      }}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.actionButton} onPress={handleArchive}>
                  <Icon name={getArchiveIcon()} size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                  <Icon name="delete" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Content Container */}
            <View style={styles.contentContainer}>
              {/* Chat List */}
              <View style={styles.chatListContainer}>
                <ScrollView
                  style={styles.chatList}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.chatListContent}
                >
                  {/* Section Title */}
                  <Text style={styles.sectionTitle}>
                    {activeFilter === "Archived" ? "Archived Chats" : "Recent Chats"}
                  </Text>

                  {/* Search Bar */}
                  <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#fff" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search chats..."
                      placeholderTextColor="#fff"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Icon name="close" size={20} color="#9E9E9E" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Filter Tabs */}
                  <View style={styles.filterContainer}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filterContent}
                    >
                      {["All", "Unread", "Read", "Favorites", "Archived"].map((filter) => (
                        <TouchableOpacity
                          key={filter}
                          style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]}
                          onPress={() => setActiveFilter(filter)}
                        >
                          <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
                            {filter}
                          </Text>
                          {filter === "Archived" && (
                            <Icon
                              name="archive"
                              size={16}
                              color={activeFilter === filter ? "#1a1a1a" : "rgba(255, 255, 255, 0.7)"}
                              style={styles.filterIcon}
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  {filteredChats.map(renderChatItem)}
                  {filteredChats.length === 0 && (
                    <View style={styles.emptyState}>
                      <Icon
                        name={activeFilter === "Archived" ? "archive" : "chat"}
                        size={48}
                        color="rgba(255, 255, 255, 0.3)"
                        style={styles.emptyIcon}
                      />
                      <Text style={styles.emptyText}>
                        {activeFilter === "Archived" ? "No archived chats" : "No chats found"}
                      </Text>
                      <Text style={styles.emptySubtext}>
                        {activeFilter === "Archived"
                          ? "Archived chats will appear here"
                          : activeFilter !== "All"
                          ? `No ${activeFilter.toLowerCase()} chats`
                          : "Try adjusting your search"}
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("Acassist")}>
              <Icon name="android" size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
  normalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  selectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: "absolute",
    top: Platform.OS === "ios" ? 44 : StatusBar.currentHeight + 10,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  profileButton: {
    marginLeft: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectionCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 16,
  },
  selectionActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 12,
  },
  contentContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 100 : StatusBar.currentHeight + 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    height: 50,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "white",
    fontSize: 16,
  },
  filterContainer: {
    maxHeight: 60,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginRight: 12,
    minWidth: 60,
  },
  activeFilterTab: {
    backgroundColor: "white",
  },
  filterText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#1a1a1a",
    fontWeight: "600",
  },
  filterIcon: {
    marginLeft: 6,
  },
  chatListContainer: {
    flex: 1,
    // paddingTop: 16,  <--- Removed this as we're moving items into the ScrollView
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    marginBottom: 16,
    paddingTop: 16, // Add padding here since it's now in the ScrollView
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  pinnedChat: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderLeftWidth: 3,
    borderLeftColor: "rgba(255, 255, 255, 0.3)",
  },
  selectedChat: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
  },
  archivedChat: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderLeftWidth: 3,
    borderLeftColor: "rgba(255, 193, 7, 0.4)",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  defaultAvatar: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#00D26A",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.8)",
  },
  selectionIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.8)",
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chatName: {
    fontSize: 17,
    fontWeight: "600",
    color: "white",
  },
  pinnedIcon: {
    marginLeft: 6,
    transform: [{ rotate: "45deg" }],
  },
  archivedIcon: {
    marginLeft: 6,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatTime: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    marginRight: 4,
  },
  favoriteIcon: {
    marginLeft: 4,
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sentIcon: {
    marginRight: 4,
  },
  messageText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    flex: 1,
  },
  unreadMessage: {
    color: "white",
    fontWeight: "500",
  },
  typingText: {
    fontSize: 15,
    color: "#fff",
    fontStyle: "italic",
  },
  unreadBadge: {
    backgroundColor: "white",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: "#1a1a1a",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
})

export default ChatListScreen