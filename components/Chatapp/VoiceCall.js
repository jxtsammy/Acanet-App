"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
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

const VoiceCallScreen = ({ route, navigation }) => {
  const { chatItem } = route.params || {
    firstName: "Alex",
    lastName: "Morgan",
    image: "https://i.pravatar.cc/300?img=12",
  }

  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [callStatus, setCallStatus] = useState("Calling...")
  const [isCallAccepted, setIsCallAccepted] = useState(false)

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current
  const waveAnimations = useRef(
    Array(5).fill(0).map(() => new Animated.Value(0))
  ).current
  const floatingButtonScale = useRef(new Animated.Value(1)).current
  const avatarScale = useRef(new Animated.Value(1)).current

  // Timer for call duration
  useEffect(() => {
    // Simulate call connection
    const connectionTimeout = setTimeout(() => {
      setCallStatus("Connected")
      setIsCallAccepted(true)
      
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)

      return () => clearInterval(timer)
    }, 3000) // 3 seconds to simulate call being accepted

    return () => clearTimeout(connectionTimeout)
  }, [])

  // Pulse animation for avatar
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(avatarScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(avatarScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  // Sound wave animations
  useEffect(() => {
    const animateWaves = () => {
      waveAnimations.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 200),
            Animated.timing(anim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start()
      })
    }

    if (isCallAccepted) {
      animateWaves()
    }
  }, [isCallAccepted])

  // Pulse animation for active call indicator
  useEffect(() => {
    if (isCallAccepted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
  }, [isCallAccepted])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
      
      {/* Background */}
      <ImageBackground
        source={require("../../assets/808bc6634f052134029221e7d7b8e5d7.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(30,30,30,0.9)", "rgba(30,30,30,0.7)", "rgba(30,30,30,0.9)"]}
          style={styles.overlay}
        />
      </ImageBackground>

      {/* Top Section */}
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
            style={styles.backButtonGradient}
          >
            <Ionicons name="chevron-down" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.callStatusContainer}>
          <Text style={styles.callerNameHeader}>
            {chatItem ? `${chatItem.firstName} ${chatItem.lastName}` : "Alex Morgan"}
          </Text>
          <View style={styles.statusRow}>
            <Text style={styles.callStatusText}>
              {isCallAccepted ? formatDuration(callDuration) : callStatus}
            </Text>
            {isCallAccepted && (
              <Animated.View style={[styles.callIndicator, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.recordingDot} />
              </Animated.View>
            )}
          </View>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: avatarScale }] }]}>
            <Image
              source={{ uri: chatItem?.image || "https://i.pravatar.cc/300?img=12" }}
              style={styles.avatar}
            />
            <LinearGradient
              colors={["rgba(255,255,255,0.1)", "transparent"]}
              style={styles.avatarGlow}
            />
          </Animated.View>

          {/* Sound Waves */}
          {isCallAccepted && (
            <View style={styles.soundWaves}>
              {waveAnimations.map((anim, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.soundWave,
                    {
                      transform: [
                        {
                          scaleY: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 1.5],
                          }),
                        },
                      ],
                      opacity: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Call Controls */}
      <View style={styles.controlsContainer}>
        <BlurView intensity={30} tint="dark" style={styles.controlsBlur}>
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.3)"]}
            style={styles.controlsGradient}
          >
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
                    <Ionicons 
                      name={isMuted ? "mic-off" : "mic"} 
                      size={24} 
                      color={isMuted ? "#000000" : "white"} 
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* End Call Button */}
              <TouchableOpacity
                style={styles.endCallButton}
                onPress={endCall}
              >
                <LinearGradient
                  colors={["#FF6B6B", "#FF4757"]}
                  style={styles.endCallGradient}
                >
                  <Ionicons name="call" size={32} color="white" />
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  callStatusContainer: {
    alignItems: "center",
    flex: 1,
  },
  callerNameHeader: {
    fontSize: 18,
    color: "white",
    fontWeight: "700",
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  callStatusText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
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
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 30,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
  },
  soundWaves: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  soundWave: {
    width: 4,
    height: 40,
    backgroundColor: "#ffffff",
    marginHorizontal: 3,
    borderRadius: 2,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  controlsContainer: {
    paddingBottom: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 20,
  },
  controlsBlur: {
    borderRadius: 25,
    overflow: "hidden",
  },
  controlsGradient: {
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
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
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  endCallGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "135deg" }],
  },
})

export default VoiceCallScreen;