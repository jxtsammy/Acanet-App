"use client"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Animated,
  ScrollView,
  Alert,
} from "react-native"
import { BlurView } from "expo-blur"
import * as ImagePicker from "expo-image-picker"
import { ArrowLeft, CheckCircle, Paperclip, Send, ShieldCheck } from "lucide-react-native"
import { generateAcademicResponse, generateAIResponseFromImage, getImageInfo } from "./services/geminiAPI"
import { FIRESTORE_DB, FIREBASE_AUTH, FIREBASE_APP } from '../../firebaseConfig'
import { collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore"

// Typing Indicator Component
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    }

    animateDot(dot1, 0)
    animateDot(dot2, 150)
    animateDot(dot3, 300)
  }, [])

  return (
    <View style={[styles.messageContainer, styles.receivedMessageContainer, { marginBottom: 15 }]}>
      <Image source={require("../../assets/b68d4348592732c5abcd0c9825fa9302.jpg")} style={styles.profilePicture} />
      <View style={[styles.messageBubble, styles.receivedMessage, styles.typingBubble]}>
        <Animated.Text style={[styles.typingDot, { opacity: dot1 }]}>•</Animated.Text>
        <Animated.Text style={[styles.typingDot, { opacity: dot2 }]}>•</Animated.Text>
        <Animated.Text style={[styles.typingDot, { opacity: dot3 }]}>•</Animated.Text>
      </View>
    </View>
  )
}

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [selectedMessages, setSelectedMessages] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showPredefinedMessages, setShowPredefinedMessages] = useState(true)
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const predefinedMessages = [
    "Explain photosynthesis in simple terms.",
    "What is the Pythagorean theorem?",
    "Summarize the plot of 'Romeo and Juliet'.",
    "How does a computer work?",
  ];

  // Fetch conversations from Firestore on component mount
  useEffect(() => {
    const q = query(
      collection(FIRESTORE_DB, "chats"),
      orderBy("time", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      return cameraStatus === "granted" && mediaLibraryStatus === "granted"
    }
    return true
  }

  const showImagePickerOptions = () => {
    Alert.alert("Select Image", "Choose how you want to select an image", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions()
      if (!hasPermission) {
        Alert.alert("Permission Required", "Sorry, we need camera roll permissions to make this work!")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: false,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri
        await handleImageSelection(imageUri)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image. Please try again.")
    }
  }

  const takePhoto = async () => {
    try {
      const hasPermission = await requestPermissions()
      if (!hasPermission) {
        Alert.alert("Permission Required", "Sorry, we need camera permissions to make this work!")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri
        await handleImageSelection(imageUri)
      }
    } catch (error) {
      console.error("Error taking photo:", error)
      Alert.alert("Error", "Failed to take photo. Please try again.")
    }
  }

  const handleImageSelection = async (imageUri) => {
    try {
      const imageInfo = await getImageInfo(imageUri)

      if (!imageInfo || !imageInfo.exists) {
        Alert.alert("Error", "Selected image could not be found.")
        return
      }

      if (!imageInfo.isValidImage) {
        Alert.alert("Invalid Image", "Please select a valid image file.")
        return
      }

      setSelectedImage({
        uri: imageUri,
        info: imageInfo,
      })

      console.log("Image selected and ready to send:", imageUri)
    } catch (error) {
      console.error("Error handling image selection:", error)
      Alert.alert("Error", "Failed to process the selected image.")
    }
  }

  const handleLongPress = (message) => {
    setIsSelectionMode(true)
    setSelectedMessages([message.id])
  }

  const toggleMessageSelection = (message) => {
    if (!isSelectionMode) return
    setSelectedMessages((prevSelected) =>
      prevSelected.includes(message.id)
        ? prevSelected.filter((id) => id !== message.id)
        : [...prevSelected, message.id],
    )
  }

  const deleteSelectedMessages = () => {
    setMessages((prevMessages) => prevMessages.filter((message) => !selectedMessages.includes(message.id)))
    clearSelection()
  }

  const clearSelection = () => {
    setSelectedMessages([])
    setIsSelectionMode(false)
  }

  const handleSend = async () => {
    const hasText = inputText.trim()
    const hasImage = selectedImage

    if (!hasText && !hasImage) {
      return
    }

    const newMessage = {
      text: inputText,
      image: selectedImage?.uri || null,
      imageInfo: selectedImage?.info || null,
      isSent: true,
      time: new Date().toISOString(),
      userId: FIREBASE_AUTH.currentUser?.uid,
    }

    try {
      await addDoc(collection(FIRESTORE_DB, "chats"), newMessage)

      setInputText("")
      setSelectedImage(null)
      setShowPredefinedMessages(false)

      handleBotResponse(inputText, selectedImage?.uri)
    } catch (error) {
      console.error("Error saving message:", error)
      Alert.alert("Error", "Failed to send message. Please try again.")
    }
  }

  const handleBotResponse = async (userMessage = "", imageUri = null) => {
    try {
      setIsAIThinking(true)

      setMessages((prevMessages) => [...prevMessages, { id: "typing", type: "typing" }])

      let aiResponse = ""

      if (imageUri && userMessage) {
        aiResponse = await generateAIResponseFromImage(imageUri, userMessage)
      } else if (imageUri) {
        aiResponse = await generateAIResponseFromImage(
          imageUri,
          "What do you see in this image? Please provide a detailed analysis.",
        )
      } else if (userMessage) {
        aiResponse = await generateAcademicResponse(userMessage)
      } else {
        aiResponse = "Hello! I'm your Academic Assistant. How can I help?"
      }

      const botMessage = {
        text: aiResponse,
        isSent: false,
        time: new Date().toISOString(),
        userId: "bot",
      }

      await addDoc(collection(FIRESTORE_DB, "chats"), botMessage)

      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== "typing"))
      setShowPredefinedMessages(true)
    } catch (error) {
      console.error("Error getting AI response:", error)

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter((msg) => msg.id !== "typing")
        const errorMessage = {
          text: "I apologize, but I'm having trouble processing your request right now. Please try again.",
          isSent: false,
          time: new Date().toISOString(),
        }
        return [...updatedMessages, errorMessage]
      })
      setShowPredefinedMessages(true)
    } finally {
      setIsAIThinking(false)
    }
  }

  const handlePredefinedMessage = async (message) => {
    setInputText(message)
    setShowPredefinedMessages(false)

    const newMessage = {
      text: message,
      isSent: true,
      time: new Date().toISOString(),
      userId: FIREBASE_AUTH.currentUser?.uid,
    }

    try {
      await addDoc(collection(FIRESTORE_DB, "chats"), newMessage)
      handleBotResponse(message)
    } catch (error) {
      console.error("Error saving predefined message:", error)
      Alert.alert("Error", "Failed to send message. Please try again.")
    }
  }

  const renderMessage = ({ item }) => {
    if (item.type === "typing") {
      return <TypingIndicator />
    }

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item)}
        onPress={() => toggleMessageSelection(item)}
        style={[
          styles.messageContainer,
          item.isSent ? styles.sentMessageContainer : styles.receivedMessageContainer,
          selectedMessages.includes(item.id) && styles.selectedMessage,
        ]}
      >
        {isSelectionMode && (
          <View style={styles.selectionIndicator}>
            {selectedMessages.includes(item.id) ? (
              <CheckCircle size={24} color="#088a6a" />
            ) : (
              <View style={styles.unselectedCircle} />
            )}
          </View>
        )}
        {!item.isSent && (
          <Image source={require("../../assets/b68d4348592732c5abcd0c9825fa9302.jpg")} style={styles.profilePicture} />
        )}
        <View
          style={[
            styles.messageBubble,
            item.isSent ? styles.sentMessage : styles.receivedMessage,
            selectedMessages.includes(item.id) && styles.selectedMessageBubble,
          ]}
        >
          {item.image && (
            <View>
              <Image source={{ uri: item.image }} style={styles.sentImage} />
              {item.imageInfo && (
                <Text style={styles.imageInfoText}>
                  {item.imageInfo.extension?.toUpperCase()} • {Math.round(item.imageInfo.size / 1024)}KB
                </Text>
              )}
            </View>
          )}
          {item.text ? <Text style={styles.messageText}>{item.text}</Text> : null}
          <Text style={styles.messageTime}>{new Date(item.time).toLocaleTimeString()}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ImageBackground source={require("../../assets/abg.jpg")} style={styles.background}>
      <StatusBar barStyle="dark-content" />
      <BlurView intensity={90} tint="dark" style={styles.blurOverlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={isSelectionMode ? clearSelection : () => navigation.goBack()}>
              <ArrowLeft size={28} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              {!isSelectionMode ? (
                <>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={require("../../assets/b68d4348592732c5abcd0c9825fa9302.jpg")}
                      style={styles.headerImage}
                    />
                    <View
                      style={[
                        styles.onlineStatus,
                        {
                          backgroundColor: isOnline ? "#00C853" : "#888",
                          borderColor: isOnline ? "#000" : "#666",
                        },
                      ]}
                    />
                  </View>
                  <View>
                    <Text style={styles.headerTitle}>Academic Assistant</Text>
                    <Text style={styles.headerSubtitle}>
                      {isAIThinking ? "Thinking..." : isOnline ? "Online" : "Offline"}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={styles.headerTitle}>{selectedMessages.length} selected</Text>
              )}
            </View>
            {isSelectionMode && (
              <TouchableOpacity onPress={deleteSelectedMessages} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={styles.messageList}
            ListHeaderComponent={() => (
              <View style={styles.infoBox}>
                <ShieldCheck size={16} color="#088a6a" style={styles.infoBoxIcon} />
                <Text style={styles.infoBoxText}>
                  Your Personal Academic assistant powered by AI is here to answer all questions. Ask what's on your
                  mind or share images for analysis.
                </Text>
              </View>
            )}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
            style={styles.keyboardAvoidingContainer}
          >
            <View style={styles.inputAreaWrapper}>
              {showPredefinedMessages && !selectedImage && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.predefinedMessagesContainer}
                >
                  {predefinedMessages.map((msg, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.predefinedMessageTab}
                      onPress={() => handlePredefinedMessage(msg)}
                    >
                      <Text style={styles.predefinedMessageText}>{msg}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {selectedImage && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(null)}>
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                  <Text style={styles.imagePreviewText}>
                    {selectedImage.info?.extension?.toUpperCase()} • {Math.round(selectedImage.info?.size / 1024)}KB
                  </Text>
                </View>
              )}

              <View style={styles.inputRow}>
                <View style={styles.inputFieldContainer}>
                  <TouchableOpacity onPress={showImagePickerOptions}>
                    <Paperclip size={28} color="#888" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.input}
                    placeholder={selectedImage ? "Add a message about this image..." : "Message"}
                    placeholderTextColor="#888"
                    value={inputText}
                    onChangeText={(text) => {
                      setInputText(text)
                      setShowPredefinedMessages(text.length === 0 && !selectedImage)
                    }}
                    multiline
                    maxLength={1000}
                  />
                </View>
                <TouchableOpacity
                  onPress={inputText.trim() || selectedImage ? handleSend : null}
                  style={[styles.sendButton, { opacity: inputText.trim() || selectedImage ? 1 : 0.5 }]}
                  disabled={isAIThinking}
                >
                  <Send size={28} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </BlurView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  blurOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 10,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineStatus: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  headerTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerSubtitle: {
    color: "#555",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 0,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 15,
  },
  infoBoxIcon: {
    marginRight: 8,
  },
  infoBoxText: {
    flex: 1,
    color: "#555",
    fontSize: 13,
    lineHeight: 18,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 8,
  },
  sentMessageContainer: {
    justifyContent: "flex-end",
  },
  receivedMessageContainer: {
    justifyContent: "flex-start",
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    borderTopRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E0E0",
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: "#000",
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    color: "#b1b1b1",
    fontSize: 10,
    textAlign: "right",
    marginTop: 4,
  },
  keyboardAvoidingContainer: {
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputAreaWrapper: {
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 20 : 5,
  },
  imagePreviewContainer: {
    position: "relative",
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4444",
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreviewText: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  inputFieldContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  input: {
    flexGrow: 1,
    color: "#000",
    marginHorizontal: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
  },
  sentImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  imageInfoText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },
  selectedMessage: {
    opacity: 0.8,
  },
  selectedMessageBubble: {
    borderWidth: 2,
    borderColor: "#056162",
  },
  selectionIndicator: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#088a6a",
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  typingDot: {
    fontSize: 24,
    color: "#000",
    marginHorizontal: 2,
  },
  predefinedMessagesContainer: {
    paddingHorizontal: 16,
    marginBottom: 13,
    width: "100%",
  },
  predefinedMessageTab: {
    backgroundColor: "#fff",
    borderRadius: 30,
    height: 36,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  predefinedMessageText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "500",
  },
})

export default ChatScreen