"use client"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ImageBackground,
  Easing,
  Modal,
  ScrollView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Ionicons from "react-native-vector-icons/Ionicons"
import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from "expo-document-picker"
import { Audio } from "expo-av"

const { width, height } = Dimensions.get("window")
const SWIPE_THRESHOLD = -80

// Enhanced Emoji data with more categories
const EMOJI_CATEGORIES = {
  Recent: [],
  Smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "🤣",
    "😂",
    "🙂",
    "🙃",
    "😉",
    "😊",
    "😇",
    "🥰",
    "😍",
    "🤩",
    "😘",
    "😗",
    "😚",
    "😙",
    "😋",
    "😛",
    "😜",
    "🤪",
    "😝",
    "🤑",
    "🤗",
    "🤭",
    "🤫",
    "🤔",
    "🤐",
    "🤨",
    "😐",
    "😑",
    "😶",
    "😏",
    "😒",
    "🙄",
    "😬",
    "🤥",
    "😔",
    "😪",
    "🤤",
    "😴",
    "😷",
    "🤒",
    "🤕",
    "🤢",
    "🤮",
    "🤧",
    "🥵",
    "🥶",
    "🥴",
    "😵",
    "🤯",
    "🤠",
    "🥳",
    "😎",
    "🤓",
    "🧐",
  ],
  Gestures: [
    "👋",
    "🤚",
    "🖐",
    "✋",
    "🖖",
    "👌",
    "🤏",
    "✌",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝",
    "👍",
    "👎",
    "👊",
    "✊",
    "🤛",
    "🤜",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🤝",
    "🙏",
  ],
  Fruits: [
    "🍎",
    "🍏",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶",
    "🫑",
    "🌽",
    "🥕",
    "🫒",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥯",
    "🍞",
    "🥖",
    "🥨",
    "🧀",
    "🥚",
    "🍳",
    "🧈",
    "🥞",
    "🧇",
    "🥓",
    "🥩",
    "🍗",
    "🍖",
    "🦴",
    "🌭",
    "🍔",
    "🍟",
    "🍕",
  ],
  Places: [
    "🏠",
    "🏡",
    "🏘",
    "🏚",
    "🏗",
    "🏭",
    "🏢",
    "🏬",
    "🏣",
    "🏤",
    "🏥",
    "🏦",
    "🏨",
    "🏪",
    "🏫",
    "🏩",
    "💒",
    "🏛",
    "⛪",
    "🕌",
    "🕍",
    "🛕",
    "🕋",
    "⛩",
    "🛤",
    "🛣",
    "🗾",
    "🏞",
    "🌅",
    "🌄",
    "🏜",
    "🏖",
    "🏝",
    "🌊",
    "🌋",
    "⛰",
    "🏔",
    "🗻",
    "🏕",
    "⛺",
    "🛖",
    "🏰",
    "🏯",
    "🏟",
    "🎡",
    "🎢",
    "🎠",
    "⛲",
    "⛱",
    "🏖",
    "🏝",
    "🛶",
    "⛵",
    "🚤",
    "🛳",
    "⛴",
    "🚢",
  ],
  Events: [
    "🎉",
    "🎊",
    "🎈",
    "🎂",
    "🍰",
    "🧁",
    "🥳",
    "🎁",
    "🎀",
    "🎗",
    "🎟",
    "🎫",
    "🎖",
    "🏆",
    "🏅",
    "🥇",
    "🥈",
    "🥉",
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🪃",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛼",
    "🛷",
    "⛸",
    "🥌",
    "🎿",
    "⛷",
    "🏂",
  ],
  Nature: [
    "🌱",
    "🌿",
    "☘",
    "🍀",
    "🎍",
    "🎋",
    "🍃",
    "🍂",
    "🍁",
    "🍄",
    "🐚",
    "🌾",
    "💐",
    "🌷",
    "🌹",
    "🥀",
    "🌺",
    "🌸",
    "🌼",
    "🌻",
    "🌞",
    "🌝",
    "🌛",
    "🌜",
    "🌚",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🌑",
    "🌒",
    "🌓",
    "🌔",
    "🌙",
    "🌎",
    "🌍",
    "🌏",
    "🪐",
    "💫",
    "⭐",
    "🌟",
    "✨",
    "⚡",
    "☄",
    "💥",
    "🔥",
    "🌪",
    "🌈",
    "☀",
    "🌤",
    "⛅",
    "🌦",
    "🌧",
    "⛈",
    "🌩",
    "🌨",
    "❄",
    "☃",
    "⛄",
    "🌬",
    "💨",
    "💧",
    "💦",
    "☔",
    "☂",
    "🌊",
    "🌫",
  ],
  Symbols: [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮",
    "✝",
    "☪",
    "🕉",
    "☸",
    "✡",
    "🔯",
    "🕎",
    "☯",
    "☦",
    "🛐",
    "⛎",
    "♈",
    "♉",
    "♊",
    "♋",
    "♌",
    "♍",
    "♎",
    "♏",
    "♐",
    "♑",
    "♒",
    "♓",
    "🆔",
    "⚛",
    "🉑",
    "☢",
    "☣",
    "📴",
    "📳",
    "🈶",
    "🈚",
    "🈸",
    "🈺",
    "🈷",
    "✴",
    "🆚",
    "💮",
    "🉐",
    "㊙",
    "㊗",
    "🈴",
    "🈵",
    "🈹",
    "🈲",
    "🅰",
    "🅱",
    "🆎",
    "🆑",
    "🅾",
    "🆘",
    "❌",
    "⭕",
    "🛑",
    "⛔",
    "📛",
    "🚫",
    "💯",
    "💢",
    "♨",
    "🚷",
    "🚯",
    "🚳",
    "🚱",
    "🔞",
    "📵",
    "🚭",
  ],
  Flags: [
    "🏁",
    "🚩",
    "🎌",
    "🏴",
    "🏳️",
    "🏳️‍🌈",
    "🏳️‍⚧️",
    "🏴‍☠️",
    "🇦🇫",
    "🇦🇽",
    "🇦🇱",
    "🇩🇿",
    "🇦🇸",
    "🇦🇩",
    "🇦🇴",
    "🇦🇮",
    "🇦🇶",
    "🇦🇬",
    "🇦🇷",
    "🇦🇲",
    "🇦🇼",
    "🇦🇺",
    "🇦🇹",
    "🇦🇿",
    "🇧🇸",
    "🇧🇭",
    "🇧🇩",
    "🇧🇧",
    "🇧🇾",
    "🇧🇪",
    "🇧🇿",
    "🇧🇯",
    "🇧🇲",
    "🇧🇹",
    "🇧🇴",
    "🇧🇦",
    "🇧🇼",
    "🇧🇷",
    "🇮🇴",
    "🇻🇬",
    "🇧🇳",
    "🇧🇬",
    "🇧🇫",
    "🇧🇮",
    "🇰🇭",
    "🇨🇲",
    "🇨🇦",
    "🇮🇨",
    "🇨🇻",
    "🇧🇶",
    "🇰🇾",
    "🇨🇫",
    "🇹🇩",
    "🇨🇱",
    "🇨🇳",
    "🇨🇽",
    "🇨🇨",
    "🇨🇴",
    "🇰🇲",
    "🇨🇬",
    "🇨🇩",
    "🇨🇰",
    "🇨🇷",
    "🇨🇮",
    "🇭🇷",
    "🇨🇺",
    "🇨🇼",
    "🇨🇾",
    "🇨🇿",
    "🇩🇰",
    "🇩🇯",
    "🇩🇲",
    "🇩🇴",
    "🇪🇨",
    "🇪🇬",
    "🇸🇻",
    "🇬🇶",
    "🇪🇷",
    "🇪🇪",
    "🇪🇹",
    "🇪🇺",
    "🇫🇰",
    "🇫🇴",
    "🇫🇯",
    "🇫🇮",
    "🇫🇷",
    "🇬🇫",
    "🇵🇫",
    "🇹🇫",
    "🇬🇦",
    "🇬🇲",
    "🇬🇪",
    "🇩🇪",
    "🇬🇭",
    "🇬🇮",
    "🇬🇷",
    "🇬🇱",
    "🇬🇩",
    "🇬🇵",
    "🇬🇺",
    "🇬🇹",
    "🇬🇬",
    "🇬🇳",
    "🇬🇼",
    "🇬🇾",
    "🇭🇹",
    "🇭🇳",
    "🇭🇰",
    "🇭🇺",
    "🇮🇸",
    "🇮🇳",
    "🇮🇩",
    "🇮🇷",
    "🇮🇶",
    "🇮🇪",
    "🇮🇲",
    "🇮🇱",
    "🇮🇹",
    "🇯🇲",
    "🇯🇵",
    "🇯🇪",
    "🇯🇴",
    "🇰🇿",
    "🇰🇪",
    "🇰🇮",
    "🇽🇰",
    "🇰🇼",
    "🇰🇬",
    "🇱🇦",
    "🇱🇻",
    "🇱🇧",
    "🇱🇸",
    "🇱🇷",
    "🇱🇾",
    "🇱🇮",
    "🇱🇹",
    "🇱🇺",
    "🇲🇴",
    "🇲🇰",
    "🇲🇬",
    "🇲🇼",
    "🇲🇾",
    "🇲🇻",
    "🇲🇱",
    "🇲🇹",
    "🇲🇭",
    "🇲🇶",
    "🇲🇷",
    "🇲🇺",
    "🇾🇹",
    "🇲🇽",
    "🇫🇲",
    "🇲🇩",
    "🇲🇨",
    "🇲🇳",
    "🇲🇪",
    "🇲🇸",
    "🇲🇦",
    "🇲🇿",
    "🇲🇲",
    "🇳🇦",
    "🇳🇷",
    "🇳🇵",
    "🇳🇱",
    "🇳🇨",
    "🇳🇿",
    "🇳🇮",
    "🇳🇪",
    "🇳🇬",
    "🇳🇺",
    "🇳🇫",
    "🇰🇵",
    "🇲🇵",
    "🇳🇴",
    "🇴🇲",
    "🇵🇰",
    "🇵🇼",
    "🇵🇸",
    "🇵🇦",
    "🇵🇬",
    "🇵🇾",
    "🇵🇪",
    "🇵🇭",
    "🇵🇳",
    "🇵🇱",
    "🇵🇹",
    "🇵🇷",
    "🇶🇦",
    "🇷🇪",
    "🇷🇴",
    "🇷🇺",
    "🇷🇼",
    "🇼🇸",
    "🇸🇲",
    "🇸🇹",
    "🇸🇦",
    "🇸🇳",
    "🇷🇸",
    "🇸🇨",
    "🇸🇱",
    "🇸🇬",
    "🇸🇽",
    "🇸🇰",
    "🇸🇮",
    "🇬🇸",
    "🇸🇧",
    "🇸🇴",
    "🇿🇦",
    "🇰🇷",
    "🇸🇸",
    "🇪🇸",
    "🇱🇰",
    "🇧🇱",
    "🇸🇭",
    "🇰🇳",
    "🇱🇨",
    "🇲🇫",
    "🇵🇲",
    "🇻🇨",
    "🇸🇩",
    "🇸🇷",
    "🇸🇿",
    "🇸🇪",
    "🇨🇭",
    "🇸🇾",
    "🇹🇼",
    "🇹🇯",
    "🇹🇿",
    "🇹🇭",
    "🇹🇱",
    "🇹🇬",
    "🇹🇰",
    "🇹🇴",
    "🇹🇹",
    "🇹🇳",
    "🇹🇷",
    "🇹🇲",
    "🇹🇨",
    "🇹🇻",
    "🇻🇮",
    "🇺🇬",
    "🇺🇦",
    "🇦🇪",
    "🇬🇧",
    "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    "🇺🇸",
    "🇺🇾",
    "🇺🇿",
    "🇻🇺",
    "🇻🇦",
    "🇻🇪",
    "🇻🇳",
    "🇼🇫",
    "🇪🇭",
    "🇾🇪",
    "🇿🇲",
    "🇿🇼",
  ],
}

// Category icons for tabs
const CATEGORY_ICONS = {
  Recent: "🕒",
  Smileys: "😀",
  Gestures: "👋",
  Fruits: "🍎",
  Places: "🏠",
  Events: "🎉",
  Nature: "🌱",
  Symbols: "❤️",
  Flags: "🏁",
}

const ChatScreen = ({ route, navigation }) => {
  const { chatItem } = route.params || {
    firstName: "Alex",
    lastName: "Morgan",
    image: "https://i.pravatar.cc/300?img=12",
    isOnline: true,
  }

  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [selectedMessages, setSelectedMessages] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState("Recent")
  const [recentEmojis, setRecentEmojis] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(null)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  // Audio recording states - ENHANCED
  const [recording, setRecording] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [audioUri, setAudioUri] = useState(null)
  const [recordingStarted, setRecordingStarted] = useState(false)

  // Media preview states (removed for images, kept for documents/audio if needed)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [previewCaption, setPreviewCaption] = useState("")
  // const [showMediaPreview, setShowMediaPreview] = useState(false) // Removed for images

  // Image modal states
  const [selectedImage, setSelectedImage] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // ENHANCED Audio playback states with finished tracking
  const [soundObjects, setSoundObjects] = useState({})
  const [isPlaying, setIsPlaying] = useState({})
  const [playbackPosition, setPlaybackPosition] = useState({})
  const [playbackDuration, setPlaybackDuration] = useState({})
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null)
  const [audioFinished, setAudioFinished] = useState({}) // NEW: Track finished audio

  // Scroll to bottom states
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)

  // Animation values
  const typingDots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ]
  const recordingPulse = useRef(new Animated.Value(1)).current
  const attachmentScale = useRef(new Animated.Value(0)).current
  const emojiScale = useRef(new Animated.Value(0)).current
  const deleteModalScale = useRef(new Animated.Value(0)).current
  const scrollButtonScale = useRef(new Animated.Value(0)).current

  const durationTimer = useRef(null)
  const scrollViewRef = useRef()

  // NEW: Text input ref for focus management
  const textInputRef = useRef(null)

  // ENHANCED Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height)
      setIsKeyboardVisible(true)
      // Close emoji picker when keyboard shows
      if (showEmojiPicker) {
        setShowEmojiPicker(false)
      }
    })
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0)
      setIsKeyboardVisible(false)
    })

    return () => {
      keyboardDidShowListener?.remove()
      keyboardDidHideListener?.remove()
    }
  }, [showEmojiPicker])

  // Enhanced typing detection
  const handleTextChange = (text) => {
    setInputText(text)

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set user as typing
    if (!isUserTyping && text.length > 0) {
      setIsUserTyping(true)
      setIsTyping(true)
      setTypingUser("user")
    }

    // Set timeout to stop typing indicator
    const timeout = setTimeout(() => {
      setIsUserTyping(false)
      setIsTyping(false)
      setTypingUser(null)
    }, 1000)
    setTypingTimeout(timeout)
  }

  // ENHANCED Emoji button handler
  const handleEmojiButtonPress = () => {
    if (isRecording) return // Don't allow emoji picker during recording

    // IMPROVEMENT 1: Close attachment options when opening emoji picker
    if (showAttachmentOptions) {
      setShowAttachmentOptions(false)
    }

    // Always show emoji picker and push input container up
    setShowEmojiPicker(true)

    // If keyboard is visible, dismiss it first
    if (isKeyboardVisible) {
      Keyboard.dismiss()
    }
  }

  // ENHANCED Keyboard button handler (when emoji picker is open)
  const handleKeyboardButtonPress = () => {
    setShowEmojiPicker(false)
    // Focus on text input to show keyboard
    setTimeout(() => {
      textInputRef.current?.focus()
    }, 100)
  }

  // ENHANCEMENT: Handle attachment button press
  const handleAttachmentButtonPress = () => {
    // IMPROVEMENT 1: Close emoji picker when opening attachment options
    if (showEmojiPicker) {
      setShowEmojiPicker(false)
    }
    setShowAttachmentOptions(!showAttachmentOptions)
  }

  // Generate enhanced waveform data - IMPROVEMENT: More consistent pattern
  function generateEnhancedWaveform(count) {
    const baseHeights = [0.3, 0.6, 0.9, 0.7, 0.4, 0.2, 0.5, 0.8, 0.6, 0.3] // A repeating pattern
    return Array(count)
      .fill(0)
      .map((_, i) => ({
        height: baseHeights[i % baseHeights.length], // Use modulo to repeat the pattern
      }))
  }

  // Create message with animation properties
  const createMessageWithAnimation = (messageData) => {
    return {
      ...messageData,
      slideAnim: new Animated.Value(0),
      scaleAnim: new Animated.Value(0),
      opacityAnim: new Animated.Value(0),
    }
  }

  // Handle scroll events to show/hide scroll button
  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
    const isScrolledToBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50
    setIsAtBottom(isScrolledToBottom)
    // The scroll button visibility is now handled by a separate useEffect
  }

  // Scroll to bottom function
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }

  // IMPROVEMENT 2: Auto-scroll to bottom on component mount and new messages
  // IMPROVEMENT: Pre-load audio for faster playback
  useEffect(() => {
    const initialMessages = [
      {
        id: "1",
        text: "Hey there! How's your day going? 😊",
        time: "7:46 PM",
        isUser: false,
        isRead: true,
        type: "text",
      },
      {
        id: "2",
        text: "Pretty good, just finished that project we talked about. It was quite challenging but I'm happy with the results!",
        time: "7:47 PM",
        isUser: true,
        isRead: true,
        type: "text",
      },
      {
        id: "3",
        time: "8:05 PM",
        isUser: true,
        isRead: true,
        type: "audio",
        waveform: generateEnhancedWaveform(35),
        audioUri: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      },
      {
        id: "4",
        time: "8:14 PM",
        isUser: false,
        isRead: true,
        type: "audio",
        waveform: generateEnhancedWaveform(35),
        audioUri: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      },
      {
        id: "5",
        text: "That sounds amazing! 🎉",
        time: "8:15 PM",
        isUser: false,
        isRead: true,
        type: "text",
      },
      {
        id: "6",
        text: "I'll send you the details tomorrow morning",
        time: "8:16 PM",
        isUser: true,
        isRead: true,
        type: "text",
      },
      {
        id: "7",
        text: "Looking forward to seeing the final results! Can't wait to review everything.",
        time: "11:31 PM",
        isUser: false,
        isRead: true,
        type: "text",
      },
      {
        id: "8",
        time: "11:31 PM",
        isUser: false,
        isRead: false,
        type: "image",
        imageUrl: "https://picsum.photos/400/600?random=1",
      },
    ]

    const messagesWithAnimations = initialMessages.map(createMessageWithAnimation)
    setMessages(messagesWithAnimations)

    // Animate messages in
    messagesWithAnimations.forEach((message, index) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(message.scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.timing(message.opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start()
      }, index * 100)

      // IMPROVEMENT: Pre-load audio for all audio messages
      if (message.type === "audio" && message.audioUri) {
        const loadAudio = async () => {
          try {
            const { sound: newSound } = await Audio.Sound.createAsync(
              { uri: message.audioUri },
              { shouldPlay: false },
              (status) => onPlaybackStatusUpdate(message.id, status),
            )
            setSoundObjects((prev) => ({ ...prev, [message.id]: newSound }))
            // Get initial duration
            const status = await newSound.getStatusAsync()
            if (status.isLoaded) {
              setPlaybackDuration((prev) => ({ ...prev, [message.id]: status.durationMillis / 1000 }))
            }
          } catch (error) {
            console.error("Error pre-loading audio:", message.audioUri, error)
          }
        }
        loadAudio()
      }
    })

    // IMPROVEMENT 2: Auto-scroll to bottom when component loads
    setTimeout(() => {
      scrollToBottom()
    }, 500)

    setupAudio()

    return () => {
      cleanupAudio()
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [])

  // IMPROVEMENT 2: Auto-scroll when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }, [messages.length])

  // NEW: Effect to control scroll button visibility
  useEffect(() => {
    if (!isAtBottom && messages.length > 5) {
      // Only show if not at bottom and enough messages
      Animated.spring(scrollButtonScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(scrollButtonScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [isAtBottom, messages.length])

  // Setup audio configuration
  const setupAudio = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== "granted") {
        alert("Permission to access microphone is required!")
        return
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      })
    } catch (error) {
      console.log("Audio setup error:", error)
    }
  }

  // Clean up all audio resources
  const cleanupAudio = async () => {
    try {
      for (const soundId in soundObjects) {
        const sound = soundObjects[soundId]
        if (sound) {
          await sound.unloadAsync()
        }
      }
      setSoundObjects({})
      if (recording) {
        await recording.stopAndUnloadAsync()
        setRecording(null)
      }
      if (durationTimer.current) {
        clearInterval(durationTimer.current)
      }
    } catch (error) {
      console.log("Cleanup error:", error)
    }
  }

  // Enhanced typing animation
  useEffect(() => {
    if (isTyping) {
      animateTypingDots()
    } else {
      typingDots.forEach((dot) => {
        dot.stopAnimation()
        dot.setValue(0)
      })
    }
  }, [isTyping])

  const animateTypingDots = () => {
    typingDots.forEach((dot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 600,
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
            useNativeDriver: true,
          }),
        ]),
      ).start()
    })
  }

  // Enhanced recording pulse animation
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingPulse, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(recordingPulse, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      recordingPulse.setValue(1)
    }
  }, [isRecording])

  // Attachment options animation
  useEffect(() => {
    if (showAttachmentOptions) {
      Animated.spring(attachmentScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(attachmentScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [showAttachmentOptions])

  // ENHANCED Emoji picker animation
  useEffect(() => {
    if (showEmojiPicker) {
      Animated.spring(emojiScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(emojiScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [showEmojiPicker])

  // Delete modal animation
  useEffect(() => {
    if (showDeleteModal) {
      Animated.spring(deleteModalScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(deleteModalScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [showDeleteModal])

  // Function to handle swipe to reply
  const handleSwipe = (message, gestureState) => {
    if (gestureState.dx < SWIPE_THRESHOLD) {
      setReplyingTo(message)
      Animated.spring(message.slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
      return true
    }
    return false
  }

  // Create pan responder for each message
  const createPanResponder = (message) => {
    if (!message.slideAnim) {
      message.slideAnim = new Animated.Value(0)
    }
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          message.slideAnim.setValue(Math.max(gestureState.dx, -120))
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!handleSwipe(message, gestureState)) {
          Animated.spring(message.slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  }

  // Apply pan responders to messages
  useEffect(() => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (!message.slideAnim) {
          message.slideAnim = new Animated.Value(0)
        }
        return {
          ...message,
          panResponder: createPanResponder(message),
        }
      }),
    )
  }, [messages.length])

  // Toggle message selection
  const toggleMessageSelection = (messageId) => {
    if (selectedMessages.includes(messageId)) {
      const newSelection = selectedMessages.filter((id) => id !== messageId)
      setSelectedMessages(newSelection)
      if (newSelection.length === 0) {
        setIsSelectionMode(false)
      }
    } else {
      setSelectedMessages([...selectedMessages, messageId])
      if (!isSelectionMode) {
        setIsSelectionMode(true)
      }
    }
  }

  const handleLongPress = (messageId) => {
    toggleMessageSelection(messageId)
  }

  const cancelSelection = () => {
    setSelectedMessages([])
    setIsSelectionMode(false)
  }

  const cancelReply = () => {
    setReplyingTo(null)
  }

  const handleImagePress = (imageUrl, messageId) => {
    setSelectedImage({ url: imageUrl, id: messageId })
    setShowImageModal(true)
    setIsFavorite(false)
  }

  const closeImageModal = () => {
    setShowImageModal(false)
    setSelectedImage(null)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setInputText((prev) => prev + emoji)
    // Add to recent emojis
    setRecentEmojis((prev) => {
      const filtered = prev.filter((e) => e !== emoji)
      return [emoji, ...filtered].slice(0, 20)
    })
    // Update the Recent category
    EMOJI_CATEGORIES.Recent = recentEmojis
  }

  // Handle voice call
  const handleVoiceCall = () => {
    navigation.navigate("VoiceCall", { chatItem })
  }

  // Handle video call
  const handleVideoCall = () => {
    navigation.navigate("VideoCall", { chatItem })
  }

  // Handle delete messages
  const handleDeleteMessages = () => {
    setShowDeleteModal(true)
  }

  const confirmDeleteMessages = (deleteType) => {
    if (deleteType === "cancel") {
      setShowDeleteModal(false)
      return
    }
    if (deleteType === "forMe") {
      setMessages((prevMessages) => prevMessages.filter((message) => !selectedMessages.includes(message.id)))
    } else if (deleteType === "forEveryone") {
      setMessages((prevMessages) => prevMessages.filter((message) => !selectedMessages.includes(message.id)))
    }
    setShowDeleteModal(false)
    cancelSelection()
  }

  // Handle favorite messages
  const handleFavoriteMessages = () => {
    Alert.alert("Favorite", "Messages added to favorites!")
    cancelSelection()
  }

  // Handle reply to selected message
  const handleReplyToSelected = () => {
    if (selectedMessages.length === 1) {
      const messageToReply = messages.find((msg) => msg.id === selectedMessages[0])
      setReplyingTo(messageToReply)
      cancelSelection()
    }
  }

  // Check if reply should be shown (only for single selection)
  const shouldShowReply = () => {
    return selectedMessages.length === 1
  }

  // ENHANCED Start recording audio - single press
  const startRecording = async () => {
    try {
      await stopAllAudio()
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      setRecording(recording)
      setIsRecording(true)
      setRecordingStarted(true)
      setRecordingDuration(0)
      durationTimer.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Failed to start recording", err)
      Alert.alert("Failed to start recording.", "Please check microphone permissions.")
    }
  }

  // ENHANCED Stop recording
  const stopRecording = async () => {
    if (!recording) return
    try {
      await recording.stopAndUnloadAsync()
      clearInterval(durationTimer.current)
      const uri = recording.getURI()
      setAudioUri(uri)
      // Auto-send the recording
      sendMediaMessage({ type: "audio", uri: uri, duration: formatDuration(recordingDuration) })
      // Reset recording states
      setRecording(null)
      setIsRecording(false)
      setRecordingStarted(false)
      setRecordingDuration(0)
    } catch (err) {
      console.error("Failed to stop recording", err)
    }
  }

  // ENHANCED Cancel recording
  const cancelRecording = async () => {
    if (!recording) return
    try {
      await recording.stopAndUnloadAsync()
      clearInterval(durationTimer.current)
      // Reset recording states
      setRecording(null)
      setIsRecording(false)
      setRecordingStarted(false)
      setRecordingDuration(0)
      setAudioUri(null)
    } catch (err) {
      console.error("Failed to cancel recording", err)
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  const stopAllAudio = async () => {
    try {
      for (const soundId in soundObjects) {
        const sound = soundObjects[soundId]
        if (sound && isPlaying[soundId]) {
          await sound.pauseAsync()
        }
      }
      setIsPlaying({})
      setCurrentlyPlayingId(null)
    } catch (error) {
      console.log("Error stopping audio:", error)
    }
  }

  // IMPROVEMENT 3: Enhanced audio playback with auto-restart for finished audio
  // RESTORED: Voice note playing animation to previous state
  const playAudio = async (messageId, uri) => {
    try {
      if (isPlaying[messageId]) {
        const sound = soundObjects[messageId]
        if (sound) {
          await sound.pauseAsync()
          setIsPlaying((prev) => ({ ...prev, [messageId]: false }))
          setCurrentlyPlayingId(null)
        }
        return
      }

      await stopAllAudio()

      let sound = soundObjects[messageId]
      // IMPROVEMENT 3: If audio was finished, reset to beginning
      if (audioFinished[messageId]) {
        if (sound) {
          await sound.setPositionAsync(0)
        }
        setAudioFinished((prev) => ({ ...prev, [messageId]: false }))
        setPlaybackPosition((prev) => ({ ...prev, [messageId]: 0 }))
      }

      if (!sound) {
        if (!uri) {
          console.log("No audio URI provided for message:", messageId)
          return
        }
        // IMPROVEMENT: Audio is now pre-loaded, so this block should ideally not be hit often
        const { sound: newSound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: false }, (status) =>
          onPlaybackStatusUpdate(messageId, status),
        )
        sound = newSound
        setSoundObjects((prev) => ({ ...prev, [messageId]: sound }))
      }

      await sound.playAsync()
      setIsPlaying((prev) => ({ ...prev, [messageId]: true }))
      setCurrentlyPlayingId(messageId)
    } catch (err) {
      console.error("Failed to play audio:", err)
      Alert.alert("Failed to play audio.", "The audio file might be corrupted or unavailable.")
    }
  }

  // Enhanced audio scrubbing function
  const seekAudio = async (messageId, position) => {
    try {
      const sound = soundObjects[messageId]
      const duration = playbackDuration[messageId]
      if (sound && duration) {
        const seekPosition = position * duration * 1000
        await sound.setPositionAsync(seekPosition)
        setPlaybackPosition((prev) => ({
          ...prev,
          [messageId]: position * duration,
        }))
      }
    } catch (error) {
      console.log("Error seeking audio:", error)
    }
  }

  // IMPROVEMENT 3: Enhanced playback status update with finished tracking
  // RESTORED: Voice note playing animation to previous state
  const onPlaybackStatusUpdate = (messageId, status) => {
    if (status.isLoaded) {
      const position = status.positionMillis / 1000
      const duration = status.durationMillis / 1000
      setPlaybackPosition((prev) => ({
        ...prev,
        [messageId]: position,
      }))
      setPlaybackDuration((prev) => ({
        ...prev,
        [messageId]: duration,
      }))

      if (status.didJustFinish) {
        setIsPlaying((prev) => ({ ...prev, [messageId]: false }))
        setPlaybackPosition((prev) => ({ ...prev, [messageId]: 0 }))
        // IMPROVEMENT 3: Mark audio as finished
        setAudioFinished((prev) => ({ ...prev, [messageId]: true }))
        if (currentlyPlayingId === messageId) {
          setCurrentlyPlayingId(null)
        }
        const sound = soundObjects[messageId]
        if (sound) {
          sound.setPositionAsync(0)
        }
      }
    } else if (status.error) {
      console.error("Audio playback error:", status.error)
      setIsPlaying((prev) => ({ ...prev, [messageId]: false }))
    }
  }

  // IMPROVEMENT: Auto-send image after selection, remove preview modal
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      })

      if (!result.canceled) {
        // Directly send the image message without a preview modal
        sendMediaMessage({
          type: "image",
          uri: result.assets[0].uri,
          caption: "", // No caption for direct send
        })
      }
    } catch (error) {
      console.log("Image picker error:", error)
    }
    setShowAttachmentOptions(false) // Close attachment options after picking
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      })

      if (result.type === "success") {
        setMediaPreview({
          type: "document",
          uri: result.uri,
          name: result.name,
        })
        // setShowMediaPreview(true) // Keep for documents if a preview is desired
      }
    } catch (error) {
      console.log("Document picker error:", error)
    }
    setShowAttachmentOptions(false)
  }

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      })

      if (result.type === "success") {
        setMediaPreview({
          type: "audio",
          uri: result.uri,
          name: result.name,
          duration: "0:30",
        })
        // setShowMediaPreview(true) // Keep for audio if a preview is desired
      }
    } catch (error) {
      console.log("Audio picker error:", error)
    }
    setShowAttachmentOptions(false)
  }

  // IMPROVEMENT 1: Enhanced outside press handler
  const handleOutsidePress = () => {
    if (showAttachmentOptions) {
      setShowAttachmentOptions(false)
    }
    if (showEmojiPicker) {
      setShowEmojiPicker(false)
    }
  }

  const sendMessage = () => {
    if (inputText.trim() === "") return

    const newMessage = createMessageWithAnimation({
      id: Date.now().toString(),
      text: inputText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUser: true,
      isRead: false,
      type: "text",
      replyTo: replyingTo,
    })

    setMessages((prevMessages) => [...prevMessages, newMessage])

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(newMessage.scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(newMessage.opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }, 50)

    setInputText("")
    setReplyingTo(null)
    setIsUserTyping(false)
    setIsTyping(false)
    setTypingUser(null)
    setShowEmojiPicker(false)
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  // Refactored to be more generic for direct sends
  const sendMediaMessage = ({ type, uri, caption, duration, name }) => {
    const newMessage = createMessageWithAnimation({
      id: Date.now().toString(),
      text: caption || undefined,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUser: true,
      isRead: false,
      type: type,
      replyTo: replyingTo,
    })

    if (type === "image") {
      newMessage.imageUrl = uri
    } else if (type === "audio") {
      newMessage.audioUri = uri
      newMessage.duration = duration
      newMessage.waveform = generateEnhancedWaveform(35)
    } else if (type === "document") {
      newMessage.documentUri = uri
      newMessage.documentName = name
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(newMessage.scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(newMessage.opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }, 50)

    // setShowMediaPreview(false) // No longer needed for images
    setMediaPreview(null)
    setPreviewCaption("")
    setReplyingTo(null)
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const getPlaybackTime = (messageId) => {
    const position = playbackPosition[messageId] || 0
    const duration = playbackDuration[messageId]
    if (isPlaying[messageId] && duration) {
      return formatDuration(Math.floor(position))
    }
    const message = messages.find((m) => m.id === messageId)
    return message?.duration || "0:00"
  }

  // Enhanced message bubble render
  const renderMessageBubble = (item) => {
    const isSelected = selectedMessages.includes(item.id)
    if (!item.slideAnim) {
      item.slideAnim = new Animated.Value(0)
    }
    if (!item.scaleAnim) {
      item.scaleAnim = new Animated.Value(1)
    }
    if (!item.opacityAnim) {
      item.opacityAnim = new Animated.Value(1)
    }

    const panHandlers = !isSelectionMode && item.panResponder ? item.panResponder.panHandlers : {}

    return (
      <Animated.View
        style={[
          styles.messageWrapper,
          {
            transform: [{ translateX: item.slideAnim }, { scale: item.scaleAnim }],
            opacity: item.opacityAnim,
          },
        ]}
        {...panHandlers}
      >
        {/* IMPROVEMENT 4: WhatsApp-style selection background */}
        {isSelected && (
          <View
            style={[
              styles.selectionBackground,
              {
                position: "absolute",
                top: -8,
                left: -16,
                right: -16,
                bottom: -8,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 12,
                zIndex: 0,
              },
            ]}
          />
        )}
        <View
          style={[
            styles.messageContainer,
            item.isUser ? styles.userMessageContainer : styles.receivedMessageContainer,
            // IMPROVEMENT 4: Remove the old selection styling
            // isSelected && styles.selectedMessage, // REMOVED
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={() => handleLongPress(item.id)}
            onPress={() => isSelectionMode && toggleMessageSelection(item.id)}
            delayLongPress={200}
            style={styles.messageTouchable}
          >
            {/* Enhanced Reply Preview */}
            {item.replyTo && (
              <View style={styles.replyPreview}>
                <LinearGradient
                  // MODIFIED: Reply preview container to be white
                  colors={["#FFFFFF", "#F5F5F5"]}
                  style={styles.replyGradient}
                >
                  {/* MODIFIED: Reply preview bar to be black */}
                  <View style={[styles.replyPreviewBar, { backgroundColor: "#1e1e1e" }]} />
                  <View style={styles.replyPreviewContent}>
                    <Text
                      style={[
                        styles.replyPreviewName,
                        {
                          // MODIFIED: Reply preview name text to be black
                          color: "#1e1e1e",
                        },
                      ]}
                    >
                      {item.replyTo.isUser ? "You" : `${chatItem?.firstName || "Contact"}`}
                    </Text>
                    <Text
                      style={[
                        styles.replyPreviewText,
                        {
                          // MODIFIED: Reply preview text to be black
                          color: "#1e1e1e",
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {item.replyTo.type === "text"
                        ? item.replyTo.text
                        : item.replyTo.type === "audio"
                          ? "🎵 Voice message"
                          : item.replyTo.type === "image"
                            ? "📷 Photo"
                            : "📄 Document"}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}
            {/* Message content */}
            {item.type === "text" && (
              <Text style={[styles.messageText, item.isUser ? styles.userMessageText : styles.receivedMessageText]}>
                {item.text}
              </Text>
            )}
            {/* Enhanced Audio Message */}
            {item.type === "audio" && (
              <View style={styles.audioContainer}>
                <TouchableOpacity
                  style={[
                    styles.playButton,
                    item.isUser ? styles.userPlayButton : styles.receivedPlayButton,
                    isPlaying[item.id] && styles.playButtonActive,
                  ]}
                  onPress={() => playAudio(item.id, item.audioUri)}
                >
                  <LinearGradient
                    colors={
                      isPlaying[item.id]
                        ? ["#FF6B6B", "#FF8E8E"]
                        : item.isUser
                          ? ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]
                          : ["#1e1e1e", "#2a2a2a"]
                    }
                    style={styles.playButtonGradient}
                  >
                    <Ionicons
                      name={isPlaying[item.id] ? "pause" : "play"}
                      size={18}
                      color={isPlaying[item.id] ? "#fff" : item.isUser ? "#1e1e1e" : "#fff"}
                    />
                  </LinearGradient>
                </TouchableOpacity>
                <View style={styles.audioContent}>
                  <View style={styles.waveformContainer}>
                    <TouchableOpacity
                      style={styles.waveform}
                      onPress={(event) => {
                        const { locationX } = event.nativeEvent
                        const waveformWidth = 200
                        const position = locationX / waveformWidth
                        seekAudio(item.id, Math.max(0, Math.min(1, position)))
                      }}
                    >
                      {item.waveform &&
                        item.waveform.slice(0, 30).map((bar, i) => {
                          const progress = playbackDuration[item.id]
                            ? (playbackPosition[item.id] || 0) / playbackDuration[item.id]
                            : 0
                          const isPlayed = i < progress * 30
                          return (
                            <View
                              key={i}
                              style={[
                                styles.waveformBar,
                                {
                                  height: `${Math.max(20, bar.height * 100)}%`, // Restored to direct height calculation
                                  backgroundColor: isPlayed
                                    ? item.isUser
                                      ? "#fff"
                                      : "#1e1e1e"
                                    : item.isUser
                                      ? "rgba(255, 255, 255, 0.3)"
                                      : "rgba(30, 30, 30, 0.3)",
                                  shadowColor: isPlayed ? (item.isUser ? "#fff" : "#1e1e1e") : "transparent",
                                  shadowOffset: { width: 0, height: 0 },
                                  shadowOpacity: 0.5,
                                  shadowRadius: 2,
                                  elevation: isPlayed ? 2 : 0,
                                },
                              ]}
                            />
                          )
                        })}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.audioTimeRow}>
                    <Text style={[styles.audioDuration, item.isUser ? styles.userAudioText : styles.receivedAudioText]}>
                      {item.duration}
                    </Text>
                    <Text
                      style={[styles.audioCurrentTime, item.isUser ? styles.userAudioText : styles.receivedAudioText]}
                    >
                      {getPlaybackTime(item.id)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            {/* Enhanced Image Message */}
            {item.type === "image" && (
              <View style={styles.imageMessageWrapper}>
                <TouchableOpacity
                  style={styles.imageMessageContainer}
                  onPress={() => handleImagePress(item.imageUrl, item.id)}
                  activeOpacity={0.9}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.messageImage} resizeMode="cover" />
                  <LinearGradient colors={["transparent", "rgba(0,0,0,0.3)"]} style={styles.imageOverlay} />
                </TouchableOpacity>
              </View>
            )}
            {/* Enhanced Document Message */}
            {item.type === "document" && (
              <View style={styles.documentContainer}>
                <View
                  style={[
                    styles.documentIcon,
                    {
                      backgroundColor: item.isUser ? "rgba(255,255,255,0.2)" : "rgba(30,30,30,0.2)",
                    },
                  ]}
                >
                  <Ionicons name="document-text" size={24} color={item.isUser ? "#111" : "#1e1e1e"} />
                </View>
                <View style={styles.documentInfo}>
                  <Text
                    style={[styles.documentName, item.isUser ? styles.userDocumentText : styles.receivedDocumentText]}
                    numberOfLines={1}
                  >
                    {item.documentName}
                  </Text>
                </View>
              </View>
            )}
            {/* Enhanced Message Footer */}
            <View style={styles.messageFooter}>
              <Text style={[styles.messageTime, item.isUser ? styles.userMessageTime : styles.receivedMessageTime]}>
                {item.time}
              </Text>
              {item.isUser && (
                <View style={styles.readStatusContainer}>
                  <Ionicons
                    name={item.isRead ? "checkmark-done" : "checkmark"}
                    size={20}
                    color={item.isRead ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.8)"}
                    style={styles.readStatus}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
          {/* Enhanced Reply Icon */}
          <Animated.View
            style={[
              styles.replyIconContainer,
              {
                opacity: item.slideAnim
                  ? item.slideAnim.interpolate({
                      inputRange: [-120, -80, 0],
                      outputRange: [1, 0.5, 0],
                      extrapolate: "clamp",
                    })
                  : 0,
              },
            ]}
          >
            <LinearGradient colors={["#1e1e1e", "#2a2a2a"]} style={styles.replyIconGradient}>
              <Ionicons name="arrow-undo" size={18} color="#fff" />
            </LinearGradient>
          </Animated.View>
        </View>
      </Animated.View>
    )
  }

  // Enhanced typing indicator
  const renderTypingIndicator = () => {
    if (!isTyping || !typingUser) return null

    const isUserTypingIndicator = typingUser === "user"

    return (
      <Animated.View
        style={[
          styles.messageWrapper,
          { opacity: 1, transform: [{ scale: 1 }] },
          isUserTypingIndicator ? { alignSelf: "flex-end" } : {},
        ]}
      >
        <View
          style={[
            styles.messageContainer,
            isUserTypingIndicator ? styles.userMessageContainer : styles.receivedMessageContainer,
            styles.typingContainer,
          ]}
        >
          <View style={styles.typingDots}>
            {typingDots.map((dot, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.typingDot,
                  {
                    backgroundColor: isUserTypingIndicator ? "#fff" : "#1e1e1e",
                    transform: [
                      {
                        translateY: dot.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -10],
                        }),
                      },
                      {
                        scale: dot.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
          <Text
            style={[
              styles.typingText,
              {
                color: isUserTypingIndicator ? "rgba(255,255,255,0.8)" : "rgba(30,30,30,0.8)",
              },
            ]}
          >
            typing...
          </Text>
        </View>
      </Animated.View>
    )
  }

  // ENHANCED emoji picker - appears below input container and pushes it up
  const renderEmojiPicker = () => {
    if (!showEmojiPicker) return null

    const currentEmojis =
      selectedEmojiCategory === "Recent" ? recentEmojis : EMOJI_CATEGORIES[selectedEmojiCategory] || []

    // Calculate emoji picker height and position
    const emojiPickerHeight = isKeyboardVisible ? keyboardHeight : 350
    const emojiPickerBottom = isKeyboardVisible ? 0 : 80

    return (
      <View style={[styles.emojiPickerOverlay, { bottom: emojiPickerBottom }]}>
        <Animated.View
          style={[
            styles.emojiPickerContainer,
            {
              transform: [{ scale: emojiScale }],
              height: emojiPickerHeight,
            },
          ]}
        >
          <View style={[styles.emojiBlur, { backgroundColor: "#111" }]}>
            <View style={styles.emojiHeader}>
              <Text style={styles.emojiTitle}>Emojis</Text>
              <TouchableOpacity onPress={() => setShowEmojiPicker(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Category Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryTabs}
              contentContainerStyle={styles.categoryTabsContent}
            >
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryTab, selectedEmojiCategory === category && styles.activeCategoryTab]}
                  onPress={() => setSelectedEmojiCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryTabEmoji,
                      selectedEmojiCategory === category && styles.activeCategoryTabEmoji,
                    ]}
                  >
                    {CATEGORY_ICONS[category]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Emoji Grid */}
            <ScrollView style={styles.emojiScrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.emojiGrid}>
                {currentEmojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={`${selectedEmojiCategory}-${index}`}
                    style={styles.emojiButton}
                    onPress={() => handleEmojiSelect(emoji)}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    )
  }

  // Enhanced delete confirmation modal
  const renderDeleteModal = () => {
    if (!showDeleteModal) return null

    return (
      <Modal visible={showDeleteModal} transparent={true} animationType="none">
        <View style={styles.deleteModalOverlay}>
          <Animated.View style={[styles.deleteModalContainer, { transform: [{ scale: deleteModalScale }] }]}>
            <View style={[styles.deleteModalBlur, { backgroundColor: "#111" }]}>
              <View style={styles.deleteModalContent}>
                <Ionicons name="trash" size={48} color="#FF6B6B" />
                <Text style={styles.deleteModalTitle}>Delete Messages</Text>
                <Text style={styles.deleteModalText}>
                  Are you sure you want to delete {selectedMessages.length} message
                  {selectedMessages.length > 1 ? "s" : ""}?
                </Text>
                <View style={styles.deleteModalButtons}>
                  <TouchableOpacity style={styles.deleteModalButton} onPress={() => confirmDeleteMessages("forMe")}>
                    <LinearGradient colors={["#FF6B6B", "#FF4757"]} style={styles.deleteModalButtonGradient}>
                      <Text style={styles.deleteModalButtonText}>Delete for me</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteModalButton}
                    onPress={() => confirmDeleteMessages("forEveryone")}
                  >
                    <LinearGradient colors={["#FF6B6B", "#FF4757"]} style={styles.deleteModalButtonGradient}>
                      <Text style={styles.deleteModalButtonText}>Delete for everyone</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteModalCancelButton}
                    onPress={() => confirmDeleteMessages("cancel")}
                  >
                    <Text style={styles.deleteModalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    )
  }

  // ENHANCED attachment options with white icons
  const renderAttachmentOptions = () => {
    if (!showAttachmentOptions) return null

    const attachmentItems = [
      {
        icon: "document-text",
        color: "#1e1e1e",
        label: "Document",
        onPress: pickDocument,
      },
      { icon: "image", color: "#FF6B6B", label: "Gallery", onPress: pickImage },
      { icon: "camera", color: "#4ECDC4", label: "Camera", onPress: () => {} },
      {
        icon: "musical-notes",
        color: "#FFD166",
        label: "Audio",
        onPress: pickAudio,
      },
    ]

    return (
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.attachmentOptionsOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.attachmentOptionsContainer, { transform: [{ scale: attachmentScale }] }]}>
              <View style={[styles.attachmentBlur, { backgroundColor: "#111" }]}>
                <View style={styles.attachmentGrid}>
                  {attachmentItems.map((item, index) => (
                    <Animated.View
                      key={item.label}
                      style={[
                        styles.attachmentOption,
                        {
                          transform: [
                            {
                              scale: attachmentScale.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <TouchableOpacity onPress={item.onPress} style={styles.attachmentButton}>
                        <LinearGradient colors={[item.color, `${item.color}CC`]} style={styles.attachmentIconContainer}>
                          <Ionicons name={item.icon} size={24} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.attachmentText}>{item.label}</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  // ENHANCED recording UI - shows in input container
  const renderRecordingUI = () => {
    if (!isRecording) return null

    return (
      <View style={styles.recordingInputContainer}>
        <View style={styles.recordingContent}>
          <Animated.View style={[styles.recordingIndicator, { transform: [{ scale: recordingPulse }] }]}>
            <LinearGradient colors={["#FF6B6B", "#FF8E8E"]} style={styles.recordingIndicatorGradient}>
              <Ionicons name="mic" size={20} color="#fff" />
            </LinearGradient>
          </Animated.View>
          <View style={styles.recordingWaveform}>
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.recordingBar,
                    {
                      height: 4 + Math.random() * 16,
                      backgroundColor: "#FF6B6B",
                    },
                  ]}
                />
              ))}
          </View>
          <Text style={styles.recordingTimer}>{formatDuration(recordingDuration)}</Text>
        </View>
      </View>
    )
  }

  // Enhanced image modal
  const renderImageModal = () => {
    if (!showImageModal || !selectedImage) return null

    return (
      <Modal visible={showImageModal} transparent={true} animationType="fade" onRequestClose={closeImageModal}>
        <View style={styles.imageModalContainer}>
          <LinearGradient
            colors={["rgba(0,0,0,0.95)", "rgba(0,0,0,0.95)", "rgba(0,0,0,0.95)"]}
            style={styles.imageModalOverlay}
          >
            {/* Enhanced Modal Header */}
            <View style={[styles.imageModalHeader, { backgroundColor: "rgba(255,255,255,0)" }]}>
              <TouchableOpacity onPress={closeImageModal} style={styles.modalBackButton}>
                <LinearGradient
                  colors={["rgba(255,255,255,1)", "rgba(255,255,255,1)"]}
                  style={styles.modalButtonGradient}
                >
                  <Ionicons name="arrow-back" size={24} color="#111" />
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.imageModalActions}>
                <TouchableOpacity onPress={toggleFavorite} style={styles.modalActionButton}></TouchableOpacity>
                {/* REMOVED: Delete button from image modal */}
                {/* <TouchableOpacity onPress={deleteImage} style={styles.modalActionButton}>
                  <LinearGradient
                    colors={["rgba(255,107,107,0.7)", "rgba(255,107,107,0.7)"]}
                    style={styles.modalButtonGradient}
                  >
                    <Ionicons name="trash-outline" size={24} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity> */}
              </View>
            </View>

            {/* Enhanced Image Display */}
            <View style={styles.imageModalContent}>
              <Image source={{ uri: selectedImage.url }} style={styles.modalImage} resizeMode="contain" />
            </View>
          </LinearGradient>
        </View>
      </Modal>
    )
  }

  // REMOVED: Media Preview Modal (for images)
  // const renderMediaPreviewModal = () => {
  //   if (!showMediaPreview || !mediaPreview) return null

  //   return (
  //     <Modal
  //       visible={showMediaPreview}
  //       transparent={true}
  //       animationType="slide"
  //       onRequestClose={() => setShowMediaPreview(false)}
  //     >
  //       <View style={styles.mediaPreviewContainer}>
  //         <LinearGradient colors={["rgba(30,30,30,0.95)", "rgba(30,30,30,0.9)"]} style={styles.mediaPreviewOverlay}>
  //           {/* Header */}
  //           <View style={[styles.mediaPreviewHeader, { backgroundColor: "rgba(255,255,255,0.9)" }]}>
  //             <TouchableOpacity onPress={() => setShowMediaPreview(false)} style={styles.modalBackButton}>
  //               <LinearGradient
  //                 colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
  //                 style={styles.modalButtonGradient}
  //               >
  //                 <Ionicons name="arrow-back" size={24} color="#111" />
  //               </LinearGradient>
  //             </TouchableOpacity>
  //             <Text style={styles.mediaPreviewTitle}>Send {mediaPreview.type}</Text>
  //             <View style={{ width: 44 }} />
  //           </View>

  //           {/* Media Content */}
  //           <View style={styles.mediaPreviewContent}>
  //             {mediaPreview.type === "image" && (
  //               <Image source={{ uri: mediaPreview.uri }} style={styles.previewImage} resizeMode="contain" />
  //             )}
  //             {mediaPreview.type === "audio" && (
  //               <View style={styles.previewAudioContainer}>
  //                 <LinearGradient colors={["#FFD166", "#FFB74D"]} style={styles.previewAudioIcon}>
  //                   <Ionicons name="musical-notes" size={48} color="#111" />
  //                 </LinearGradient>
  //                 <Text style={styles.previewAudioName}>{mediaPreview.name || "Audio File"}</Text>
  //                 <Text style={styles.previewAudioDuration}>{mediaPreview.duration}</Text>
  //               </View>
  //             )}
  //             {mediaPreview.type === "document" && (
  //               <View style={styles.previewDocumentContainer}>
  //                 <LinearGradient colors={["#1e1e1e", "#2a2a2a"]} style={styles.previewDocumentIcon}>
  //                   <Ionicons name="document-text" size={48} color="#111" />
  //                 </LinearGradient>
  //                 <Text style={styles.previewDocumentName}>{mediaPreview.name}</Text>
  //                 <Text style={styles.previewDocumentType}>Document</Text>
  //               </View>
  //             )}
  //           </View>

  //           {/* Caption Input */}
  //           <View style={styles.captionContainer}>
  //             <View style={[styles.captionBlur, { backgroundColor: "#111" }]}>
  //               <TextInput
  //                 style={styles.captionInput}
  //                 placeholder="Add a caption..."
  //                 placeholderTextColor="rgba(30, 30, 30, 0.5)"
  //                 value={previewCaption}
  //                 onChangeText={setPreviewCaption}
  //                 multiline
  //               />
  //             </View>
  //           </View>

  //           {/* Send Button */}
  //           <View style={styles.mediaPreviewFooter}>
  //             <TouchableOpacity style={styles.mediaSendButton} onPress={sendMediaMessage}>
  //               <LinearGradient colors={["#1e1e1e", "#2a2a2a"]} style={styles.mediaSendGradient}>
  //                 <Ionicons name="send" size={24} color="#111" />
  //               </LinearGradient>
  //             </TouchableOpacity>
  //           </View>
  //         </LinearGradient>
  //       </View>
  //     </Modal>
  //   )
  // }

  // Encryption notice component
  const renderEncryptionNotice = () => {
    return (
      <View style={styles.encryptionNotice}>
        <View style={styles.encryptionBlur}>
          <View style={styles.encryptionGradient}>
            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={styles.encryptionText}>
              Messages are end-to-end encrypted. Only you and {chatItem?.firstName || "this contact"} can read them.
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? -320 : -270}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Full Screen Background */}
        <ImageBackground
          source={require("../../assets/808bc6634f052134029221e7d7b8e5d7.jpg")}
          style={styles.fullScreenBackground}
          resizeMode="cover"
        >
          {/* Dark Overlay */}
          <LinearGradient colors={["rgba(30,30,30,0.7)", "rgba(30,30,30,0.7)"]} style={styles.darkOverlay} />

          {/* Enhanced Chat Header with Selection Mode */}
          <View style={[styles.header, { backgroundColor: "black" }]}>
            <View style={styles.headerContent}>
              {isSelectionMode ? (
                // Selection Mode Header
                <>
                  <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={cancelSelection} style={styles.backButton}>
                      <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.selectionCount}>{selectedMessages.length}</Text>
                  </View>
                  <View style={styles.headerRight}>
                    {shouldShowReply() && (
                      <TouchableOpacity style={styles.headerButton} onPress={handleReplyToSelected}>
                        <Ionicons name="arrow-undo" size={20} color="#fff" />
                      </TouchableOpacity>
                    )}
                    {/* Removed Favorite Button */}
                    {/* <TouchableOpacity style={styles.headerButton} onPress={handleFavoriteMessages}>
                      <Ionicons name="heart" size={20} color="#fff" />
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.headerButton} onPress={handleDeleteMessages}>
                      <Ionicons name="trash" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                // Normal Header
                <>
                  <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                      <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{
                          uri: chatItem?.image || "https://i.pravatar.cc/50",
                        }}
                        style={styles.headerAvatar}
                      />
                      {chatItem?.isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <View style={styles.headerInfo}>
                      <Text style={styles.headerName}>
                        {chatItem ? `${chatItem.firstName} ${chatItem.lastName}` : "Alex Morgan"}
                      </Text>
                      <Text style={styles.headerStatus}>
                        {chatItem?.isOnline ? "Online" : "Last seen today at 12:30 PM"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerButton} onPress={handleVideoCall}>
                      <Ionicons name="videocam" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton} onPress={handleVoiceCall}>
                      <Ionicons name="call" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Enhanced Messages List */}
          <FlatList
            ref={scrollViewRef}
            data={messages}
            renderItem={({ item }) => renderMessageBubble(item)}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderEncryptionNotice}
            contentContainerStyle={[
              styles.messagesContainer,
              {
                paddingBottom: showEmojiPicker && !isKeyboardVisible ? 370 : keyboardHeight > 0 ? 10 : 15,
              },
            ]}
            showsVerticalScrollIndicator={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
            ListFooterComponent={renderTypingIndicator}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

          {/* Scroll to Bottom Button */}
          {showScrollButton && (
            <Animated.View
              style={[
                styles.scrollToBottomButton,
                {
                  transform: [{ scale: scrollButtonScale }],
                  // Adjust bottom position based on keyboard/emoji picker
                  bottom:
                    showEmojiPicker && !isKeyboardVisible ? 350 + 20 : keyboardHeight > 0 ? keyboardHeight + 20 : 20,
                },
              ]}
            >
              <TouchableOpacity onPress={scrollToBottom} style={styles.scrollButtonTouchable}>
                <LinearGradient colors={["#ffffff", "#f5f5f5"]} style={styles.scrollButtonGradient}>
                  <Ionicons name="chevron-down" size={24} color="#1e1e1e" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Enhanced Reply Preview */}
          {replyingTo && (
            <Animated.View style={styles.replyContainer}>
              <View style={styles.replyBlur}>
                <LinearGradient colors={["rgba(30,30,30,0.3)", "rgba(30,30,30,0.3)"]} style={styles.replyGradient}>
                  <View style={styles.replyContent}>
                    <View style={styles.replyBar} />
                    <View style={styles.replyDetails}>
                      <Text style={styles.replyName}>
                        {replyingTo.isUser ? "You" : `${chatItem?.firstName || "Contact"}`}
                      </Text>
                      <Text style={styles.replyText} numberOfLines={2}>
                        {replyingTo.type === "text"
                          ? replyingTo.text
                          : replyingTo.type === "audio"
                            ? "🎵 Voice message"
                            : replyingTo.type === "image"
                              ? "📷 Photo"
                              : "📄 Document"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={cancelReply} style={styles.replyCloseButton}>
                    <LinearGradient
                      colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)"]}
                      style={styles.replyCloseGradient}
                    >
                      <Ionicons name="close" size={18} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </Animated.View>
          )}

          {/* ENHANCED Input Area - pushed up when emoji picker is active */}
          <View
            style={[
              styles.inputContainer,
              {
                marginBottom: keyboardHeight > 0 ? keyboardHeight - 20 : 0,
              },
            ]}
          >
            <View style={[styles.inputBlur, { backgroundColor: "#111" }]}>
              <LinearGradient colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.8)"]} style={styles.inputGradient}>
                <View style={styles.inputRow}>
                  {/* ENHANCED Emoji/Keyboard Button */}
                  {!isRecording && (
                    <TouchableOpacity
                      style={styles.emojiButton}
                      onPress={showEmojiPicker ? handleKeyboardButtonPress : handleEmojiButtonPress}
                    >
                      <LinearGradient
                        colors={["rgba(30,30,30,0.1)", "rgba(30,30,30,0.05)"]}
                        style={styles.inputButtonGradient}
                      >
                        <Ionicons name={showEmojiPicker ? "keypad" : "happy"} size={22} color="#1e1e1e" />
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  {/* ENHANCED Delete Button (when recording) */}
                  {isRecording && (
                    <TouchableOpacity style={styles.emojiButton} onPress={cancelRecording}>
                      <LinearGradient
                        colors={["rgba(255,107,107,0.2)", "rgba(255,107,107,0.1)"]}
                        style={styles.inputButtonGradient}
                      >
                        <Ionicons name="trash" size={22} color="#FF6B6B" />
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  {/* ENHANCED Text Input Container - Hidden during recording */}
                  {!isRecording && (
                    <View style={styles.textInputContainer}>
                      <TextInput
                        ref={textInputRef}
                        style={styles.textInput}
                        placeholder="Type a message..."
                        placeholderTextColor="rgba(30, 30, 30, 0.5)"
                        value={inputText}
                        onChangeText={handleTextChange}
                        multiline
                      />
                    </View>
                  )}

                  {/* ENHANCED Recording UI in Input Container */}
                  {isRecording && renderRecordingUI()}

                  {/* ENHANCED Attach Button - Hidden during recording */}
                  {!isRecording && (
                    <TouchableOpacity style={styles.attachButton} onPress={handleAttachmentButtonPress}>
                      <LinearGradient
                        colors={["rgba(30,30,30,0.1)", "rgba(30,30,30,0.05)"]}
                        style={styles.inputButtonGradient}
                      >
                        <Ionicons name="attach" size={22} color="#1e1e1e" />
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  {/* ENHANCED Mic/Send Button */}
                  {inputText.trim() === "" && !isRecording ? (
                    <TouchableOpacity style={styles.micButton} onPress={startRecording}>
                      <LinearGradient colors={["#1e1e1e", "#2a2a2a"]} style={styles.micButtonGradient}>
                        <Ionicons name="mic" size={22} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : inputText.trim() !== "" && !isRecording ? (
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                      <LinearGradient colors={["#1e1e1e", "#2a2a2a"]} style={styles.sendButtonGradient}>
                        <Ionicons name="send" size={18} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : isRecording ? (
                    <TouchableOpacity style={styles.sendButton} onPress={stopRecording}>
                      <LinearGradient colors={["#4CAF50", "#45a049"]} style={styles.sendButtonGradient}>
                        <Ionicons name="send" size={18} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* ENHANCED Emoji Picker - appears below input container */}
          {showEmojiPicker && renderEmojiPicker()}

          {/* Attachment Options */}
          {renderAttachmentOptions()}
        </ImageBackground>

        {/* Delete Modal */}
        {renderDeleteModal()}

        {/* Image Modal */}
        {renderImageModal()}

        {/* Media Preview Modal (removed for images, but can be re-added for documents/audio if needed) */}
        {/* {renderMediaPreviewModal()} */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  fullScreenBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderBottomWidth: Platform.OS === "android" ? 0.5 : 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 4 : 2 },
    shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.2,
    shadowRadius: Platform.OS === "ios" ? 8 : 4,
    elevation: Platform.OS === "android" ? 8 : 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: Platform.OS === "android" ? 20 : 0,
    backgroundColor: Platform.OS === "android" ? "rgba(255,255,255,0.1)" : "transparent",
  },
  selectionCount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 8,
  },
  avatarContainer: {
    position: "relative",
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: Platform.OS === "ios" ? 2 : 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: Platform.OS === "ios" ? 2 : 1.5,
    borderColor: "white",
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  headerName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
  headerStatus: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: Platform.OS === "android" ? 20 : 0,
    backgroundColor: Platform.OS === "android" ? "rgba(255,255,255,0.1)" : "transparent",
  },
  // Encryption notice styles
  encryptionNotice: {
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  encryptionBlur: {
    borderRadius: 12,
  },
  encryptionGradient: {
    backgroundColor: "white",
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
  },
  encryptionText: {
    textAlign: "center",
    marginLeft: 8,
    fontSize: 12,
    color: "#666",
  },
  messagesContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 15,
  },
  messageWrapper: {
    marginVertical: 4,
  },
  messageContainer: {
    maxWidth: "85%",
    borderRadius: Platform.OS === "ios" ? 20 : 18,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 2 : 1 },
    shadowOpacity: Platform.OS === "ios" ? 0.15 : 0.1,
    shadowRadius: Platform.OS === "ios" ? 4 : 2,
    elevation: Platform.OS === "android" ? 3 : 0,
    position: "relative",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#1e1e1e",
    borderBottomRightRadius: Platform.OS === "ios" ? 6 : 4,
  },
  receivedMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomLeftRadius: Platform.OS === "ios" ? 6 : 4,
  },
  // IMPROVEMENT 4: Remove old selection styling
  // selectedMessage: {
  //   backgroundColor: "#2a2a2a",
  //   borderWidth: 2,
  //   borderColor: "#4ECDC4",
  // },
  messageTouchable: {
    width: "100%",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  userMessageText: {
    color: "#fff",
  },
  receivedMessageText: {
    color: "#1e1e1e",
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  messageTime: {
    fontSize: 11,
    marginRight: 4,
    fontWeight: "500",
  },
  userMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  receivedMessageTime: {
    color: "rgba(30, 30, 30, 0.6)",
  },
  readStatusContainer: {
    marginLeft: 4,
  },
  readStatus: {
    marginLeft: 2,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: 240,
  },
  audioContent: {
    flex: 1,
    marginLeft: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 2 : 1 },
    shadowOpacity: Platform.OS === "ios" ? 0.2 : 0.15,
    shadowRadius: Platform.OS === "ios" ? 4 : 2,
    elevation: Platform.OS === "android" ? 3 : 0,
  },
  playButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  userPlayButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  receivedPlayButton: {
    backgroundColor: "rgba(30,30,30,0.2)",
  },
  playButtonActive: {
    transform: [{ scale: 0.95 }],
  },
  waveformContainer: {
    height: 35,
    justifyContent: "center",
    marginBottom: 6,
    paddingHorizontal: 4,
    overflow: "hidden",
  },
  waveform: {
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  waveformBar: {
    width: 2.5,
    borderRadius: Platform.OS === "ios" ? 2 : 1,
    marginHorizontal: 0.5,
  },
  audioTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  audioDuration: {
    fontSize: 11,
    fontWeight: "600",
  },
  audioCurrentTime: {
    fontSize: 11,
    fontWeight: "700",
  },
  userAudioText: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  receivedAudioText: {
    color: "rgba(30, 30, 30, 0.7)",
  },
  imageMessageWrapper: {
    position: "relative",
  },
  imageMessageContainer: {
    width: 220,
    height: 280,
    borderRadius: Platform.OS === "ios" ? 16 : 12,
    overflow: "hidden",
    position: "relative",
  },
  messageImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
  },
  userDocumentText: {
    color: "white",
  },
  receivedDocumentText: {
    color: "#1e1e1e",
  },
  // Reply container styles
  replyContainer: {
    marginHorizontal: 12,
    marginBottom: 4,
    borderRadius: Platform.OS === "ios" ? 16 : 12,
    overflow: "hidden",
  },
  replyBlur: {
    padding: 0,
    borderRadius: Platform.OS === "ios" ? 16 : 12,
  },
  replyGradient: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Platform.OS === "ios" ? 16 : 12,
  },
  replyContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  replyBar: {
    width: 4,
    height: 40,
    backgroundColor: "#1e1e1e",
    borderRadius: Platform.OS === "ios" ? 2 : 1,
    marginRight: 12,
  },
  replyDetails: {
    flex: 1,
  },
  replyName: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 13,
  },
  replyText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 2,
  },
  replyCloseButton: {
    marginLeft: 12,
  },
  replyCloseGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  replyPreview: {
    marginBottom: 8,
    borderRadius: Platform.OS === "ios" ? 12 : 8,
    overflow: "hidden",
  },
  replyPreviewBar: {
    width: 3,
    height: 30,
    backgroundColor: "#1e1e1e",
    borderRadius: Platform.OS === "ios" ? 2 : 1,
    marginRight: 8,
  },
  replyPreviewContent: {
    flex: 1,
  },
  replyPreviewName: {
    fontSize: 12,
    fontWeight: "700",
  },
  replyPreviewText: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  // Input container styles
  inputContainer: {
    padding: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 15,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  inputBlur: {
    borderRadius: Platform.OS === "ios" ? 24 : 20,
    overflow: "hidden",
  },
  inputGradient: {
    borderRadius: Platform.OS === "ios" ? 24 : 20,
    borderWidth: Platform.OS === "android" ? 1 : 0,
    borderColor: "rgba(30,30,30,0.2)",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  emojiButton: {
    marginRight: 6,
  },
  inputButtonGradient: {
    width: 32,
    height: 34,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: "rgba(30,30,30,0.05)",
    borderRadius: Platform.OS === "ios" ? 18 : 14,
    paddingHorizontal: 19,
    marginHorizontal: 6,
    minHeight: 40,
    justifyContent: "center",
    borderWidth: Platform.OS === "android" ? 1 : 0,
    borderColor: "rgba(30,30,30,0.1)",
  },
  textInput: {
    maxHeight: 80,
    minHeight: 36,
    fontSize: 15,
    color: "#1e1e1e",
    textAlignVertical: "center",
    fontWeight: "400",
  },
  attachButton: {
    marginLeft: 6,
  },
  micButton: {
    marginLeft: 6,
  },
  micButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1e1e1e",
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 2 : 1 },
    shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.2,
    shadowRadius: Platform.OS === "ios" ? 4 : 2,
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  sendButton: {
    marginLeft: 6,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1e1e1e",
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 2 : 1 },
    shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.2,
    shadowRadius: Platform.OS === "ios" ? 4 : 2,
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  // ENHANCED Recording UI styles - in input container
  recordingInputContainer: {
    flex: 1,
    backgroundColor: "rgba(255,107,107,0.1)",
    borderRadius: Platform.OS === "ios" ? 18 : 14,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    minHeight: 40,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },
  recordingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recordingIndicator: {
    marginRight: 8,
  },
  recordingIndicatorGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  recordingWaveform: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 20,
    marginHorizontal: 8,
  },
  recordingBar: {
    width: 2,
    borderRadius: 1,
    marginHorizontal: 1,
  },
  recordingTimer: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
    minWidth: 40,
    textAlign: "right",
  },
  // ENHANCED Emoji picker styles - appears below input container
  emojiPickerOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "flex-end",
  },
  emojiPickerContainer: {
    marginHorizontal: 12,
    borderRadius: Platform.OS === "ios" ? 20 : 16,
    overflow: "hidden",
    paddingBottom: 10,
  },
  emojiBlur: {
    flex: 1,
    padding: 0,
    borderRadius: Platform.OS === "ios" ? 20 : 16,
  },
  emojiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  emojiTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  categoryTabs: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: Platform.OS === "ios" ? 20 : 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  activeCategoryTab: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  categoryTabEmoji: {
    fontSize: 20,
  },
  activeCategoryTabEmoji: {
    transform: [{ scale: 1.2 }],
  },
  emojiScrollView: {
    flex: 1,
    padding: 16,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emojiText: {
    fontSize: 24,
  },
  // Attachment options styles
  attachmentOptionsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    paddingBottom: 80,
  },
  attachmentOptionsContainer: {
    marginHorizontal: 12,
    borderRadius: Platform.OS === "ios" ? 20 : 16,
    overflow: "hidden",
  },
  attachmentBlur: {
    padding: 20,
    borderRadius: Platform.OS === "ios" ? 20 : 16,
  },
  attachmentGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  attachmentOption: {
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 2 : 1 },
    shadowOpacity: Platform.OS === "ios" ? 0.2 : 0.15,
    shadowRadius: Platform.OS === "ios" ? 4 : 2,
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  attachmentText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  typingContainer: {
    padding: 16,
    marginBottom: 5,
    maxWidth: "60%",
    flexDirection: "row",
    alignItems: "center",
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: "500",
  },
  replyIconContainer: {
    position: "absolute",
    right: -50,
    top: "50%",
    marginTop: -20,
  },
  replyIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1e1e1e",
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 2 : 1 },
    shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.2,
    shadowRadius: Platform.OS === "ios" ? 4 : 2,
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  // Scroll to bottom button styles
  scrollToBottomButton: {
    position: "absolute",
    right: 16,
    zIndex: 100,
  },
  scrollButtonTouchable: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 4 : 2 },
    shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.2,
    shadowRadius: Platform.OS === "ios" ? 8 : 4,
    elevation: Platform.OS === "android" ? 8 : 0,
  },
  scrollButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  // Delete Modal Styles
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModalContainer: {
    width: width * 0.85,
    borderRadius: Platform.OS === "ios" ? 20 : 16,
    overflow: "hidden",
  },
  deleteModalBlur: {
    padding: 0,
    borderRadius: Platform.OS === "ios" ? 20 : 16,
  },
  deleteModalContent: {
    padding: 24,
    alignItems: "center",
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  deleteModalText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  deleteModalButtons: {
    width: "100%",
    gap: 12,
  },
  deleteModalButton: {
    borderRadius: Platform.OS === "ios" ? 12 : 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  deleteModalButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteModalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteModalCancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: Platform.OS === "ios" ? 12 : 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteModalCancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Image Modal Styles
  imageModalContainer: {
    flex: 1,
  },
  imageModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalHeader: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
    borderRadius: 0,
    overflow: "hidden",
  },
  modalBackButton: {
    padding: 4,
  },
  modalButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalActions: {
    flexDirection: "row",
  },
  modalActionButton: {
    marginLeft: 12,
    padding: 4,
  },
  imageModalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalImage: {
    width: width,
    height: height,
  },
  selectionBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 12,
    zIndex: 0,
  },
})

export default ChatScreen