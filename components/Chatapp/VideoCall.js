"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  ImageBackground,
} from "react-native"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import Ionicons from "react-native-vector-icons/Ionicons"

const { width, height } = Dimensions.get("window")

const VideoCallScreen = ({ route, navigation }) => {
  const { chatItem } = route.params || {
    firstName: "Alex",
    lastName: "Morgan",
    image: "https://i.pravatar.cc/300?img=12",
  }

  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [callStatus, setCallStatus] = useState("Calling...")
  const [isCallAccepted, setIsCallAccepted] = useState(false)

  // Animation values
  const controlsOpacity = useRef(new Animated.Value(1)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const floatingButtonScale = useRef(new Animated.Value(1)).current

  // Timer for call duration
  useEffect(() => {
    // Simulate call connection
    const connectionTimeout = setTimeout(() => {
      setCallStatus("Connected")
      setIsCallAccepted(true)

      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(timer)
    }, 3000) // 3 seconds to simulate call being accepted

    return () => clearTimeout(connectionTimeout)
  }, [])

  // Pulse animation for active call
  useEffect(() => {
    if (isCallAccepted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    }
  }, [isCallAccepted])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const showControlsFunc = () => {
    setShowControls(true)
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowControls(false)
    })
  }

  const toggleControls = () => {
    if (showControls) {
      hideControls()
    } else {
      showControlsFunc()
    }
  }

  const endCall = () => {
    navigation.goBack()
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // Animate button
    Animated.sequence([
      Animated.timing(floatingButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(floatingButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    Animated.sequence([
      Animated.timing(floatingButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(floatingButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
    Animated.sequence([
      Animated.timing(floatingButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(floatingButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Main Video Background */}
      <ImageBackground
        source={{ uri: chatItem?.image || "https://i.pravatar.cc/800?img=12" }}
        style={styles.mainVideoBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.6)"]}
          style={styles.videoOverlay}
        />
      </ImageBackground>

      {/* Top Info Bar */}
      <TouchableOpacity style={styles.topInfoContainer} onPress={toggleControls} activeOpacity={1}>
        <View style={styles.topInfoBlur}>
          <View style={styles.topInfoGradient}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-down" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.callInfo}>
              <Text style={styles.callerName}>
                {chatItem ? `${chatItem.firstName} ${chatItem.lastName}` : "Alex Morgan"}
              </Text>
              <View style={styles.statusRow}>
                <Text style={styles.callDuration}>{isCallAccepted ? formatDuration(callDuration) : callStatus}</Text>
                {isCallAccepted && (
                  <Animated.View style={[styles.callIndicator, { transform: [{ scale: pulseAnim }] }]}>
                    <View style={styles.recordingDot} />
                  </Animated.View>
                )}
              </View>
            </View>

            <View style={styles.headerSpacer} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Self Video (Picture-in-Picture) - Moved to bottom right */}
      <View style={styles.selfVideoContainer}>
        <ImageBackground
          source={{ uri: "https://i.pravatar.cc/200?img=1" }}
          style={styles.selfVideo}
          resizeMode="cover"
        >
          {isVideoOff && (
            <BlurView intensity={20} tint="dark" style={styles.videoOffOverlay}>
              <Ionicons name="videocam-off" size={32} color="white" />
            </BlurView>
          )}
        </ImageBackground>
      </View>

      {/* Call Controls */}
      <Animated.View
        style={[styles.controlsContainer, { opacity: controlsOpacity }]}
        pointerEvents={showControls ? "auto" : "none"}
      >
        <BlurView intensity={30} tint="dark" style={styles.controlsBlur}>
          <LinearGradient colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.3)"]} style={styles.controlsGradient}>
            <View style={styles.controlsRow}>
              {/* Mute Button */}
              <Animated.View style={{ transform: [{ scale: floatingButtonScale }] }}>
                <TouchableOpacity
                  style={[styles.controlButton, isMuted && styles.activeControlButton]}
                  onPress={toggleMute}
                >
                  <LinearGradient
                    colors={isMuted ? ["#ffffff", "#ffffff"] : ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                    style={styles.controlButtonGradient}
                  >
                    <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color={isMuted ? "#000000" : "white"} />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Video Button */}
              <Animated.View style={{ transform: [{ scale: floatingButtonScale }] }}>
                <TouchableOpacity
                  style={[styles.controlButton, isVideoOff && styles.activeControlButton]}
                  onPress={toggleVideo}
                >
                  <LinearGradient
                    colors={isVideoOff ? ["#ffffff", "#ffffff"] : ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                    style={styles.controlButtonGradient}
                  >
                    <Ionicons
                      name={isVideoOff ? "videocam-off" : "videocam"}
                      size={24}
                      color={isVideoOff ? "#000000" : "white"}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* End Call Button */}
              <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
                <LinearGradient colors={["#FF6B6B", "#FF4757"]} style={styles.endCallGradient}>
                  <Ionicons name="call" size={28} color="white" />
                </LinearGradient>
              </TouchableOpacity>

              {/* Speaker Button */}
              <Animated.View style={{ transform: [{ scale: floatingButtonScale }] }}>
                <TouchableOpacity
                  style={[styles.controlButton, isSpeakerOn && styles.activeControlButton]}
                  onPress={toggleSpeaker}
                >
                  <LinearGradient
                    colors={isSpeakerOn ? ["#ffffff", "#ffffff"] : ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                    style={styles.controlButtonGradient}
                  >
                    <Ionicons
                      name={isSpeakerOn ? "volume-high" : "volume-medium"}
                      size={24}
                      color={isSpeakerOn ? "#000000" : "white"}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mainVideoBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    flex: 1,
  },
  selfVideoContainer: {
    position: "absolute",
    bottom: 180,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  selfVideo: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  videoOffOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  topInfoContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    height: 80,
  },
  topInfoBlur: {
    flex: 1,
  },
  topInfoGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 0,
  },
  backButton: {
    padding: 8,
  },
  callInfo: {
    flex: 1,
    alignItems: "center",
  },
  callerName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  callDuration: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    marginRight: 8,
  },
  callIndicator: {
    marginLeft: 4,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  headerSpacer: {
    width: 44,
  },
  controlsContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    height: 120,
  },
  controlsBlur: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: "hidden",
  },
  controlsGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginHorizontal: 15,
  },
  activeControlButton: {
    transform: [{ scale: 1.1 }],
  },
  controlButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 36,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  endCallGradient: {
    width: 56,
    height: 56,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "135deg" }],
  },
})

export default VideoCallScreen;