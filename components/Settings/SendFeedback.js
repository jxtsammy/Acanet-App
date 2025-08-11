"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import * as ImagePicker from "expo-image-picker"
import { Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")

const FeedbackScreen = ({ navigation }) => {
  const [feedbackType, setFeedbackType] = useState("suggestion")
  const [feedbackText, setFeedbackText] = useState("")
  const [attachments, setAttachments] = useState([])
  const [rating, setRating] = useState(0)

  const pickImage = async () => {
    try {
      // Request permissions
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to attach images.")
          return
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      })

      if (!result.canceled) {
        // Limit to 3 attachments
        if (attachments.length >= 3) {
          Alert.alert("Limit Reached", "You can only attach up to 3 images.")
          return
        }
        setAttachments([...attachments, result.assets[0].uri])
      }
    } catch (error) {
      console.log("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image. Please try again.")
    }
  }

  const removeAttachment = (index) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
  }

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      Alert.alert("Error", "Please enter your feedback before submitting.")
      return
    }

    // In a real app, you would send the feedback to your backend
    // For this example, we'll just show a success message
    Alert.alert("Thank You!", "Your feedback has been submitted successfully. We appreciate your input!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ])
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Your Feedback</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.description}>
              We value your input. Your feedback helps us improve our service and provide a better experience.
            </Text>

            {/* Feedback Type Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What type of feedback do you have?</Text>
              <View style={styles.feedbackTypeOptions}>
                <TouchableOpacity
                  style={[styles.feedbackTypeButton, feedbackType === "suggestion" && styles.selectedFeedbackType]}
                  onPress={() => setFeedbackType("suggestion")}
                >
                  <Icon
                    name="lightbulb"
                    size={24}
                    color={feedbackType === "suggestion" ? "#fff" : "#000"}
                    style={styles.feedbackTypeIcon}
                  />
                  <Text
                    style={[styles.feedbackTypeText, feedbackType === "suggestion" && styles.selectedFeedbackTypeText]}
                  >
                    Suggestion
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.feedbackTypeButton, feedbackType === "bug" && styles.selectedFeedbackType]}
                  onPress={() => setFeedbackType("bug")}
                >
                  <Icon
                    name="bug-report"
                    size={24}
                    color={feedbackType === "bug" ? "#fff" : "#000"}
                    style={styles.feedbackTypeIcon}
                  />
                  <Text style={[styles.feedbackTypeText, feedbackType === "bug" && styles.selectedFeedbackTypeText]}>
                    Bug Report
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.feedbackTypeButton, feedbackType === "other" && styles.selectedFeedbackType]}
                  onPress={() => setFeedbackType("other")}
                >
                  <Icon
                    name="feedback"
                    size={24}
                    color={feedbackType === "other" ? "#fff" : "#000"}
                    style={styles.feedbackTypeIcon}
                  />
                  <Text style={[styles.feedbackTypeText, feedbackType === "other" && styles.selectedFeedbackTypeText]}>
                    Other
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rating */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How would you rate your experience?</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starButton}>
                    <Icon
                      name={rating >= star ? "star" : "star-outline"}
                      size={36}
                      color={rating >= star ? "#000" : "#aaa"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingText}>
                {rating === 0
                  ? "Tap to rate"
                  : rating === 1
                    ? "Poor"
                    : rating === 2
                      ? "Fair"
                      : rating === 3
                        ? "Good"
                        : rating === 4
                          ? "Very Good"
                          : "Excellent"}
              </Text>
            </View>

            {/* Feedback Text */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tell us more</Text>
              <View style={styles.textInputWrapper}>
                <TextInput
                  style={styles.feedbackTextInput}
                  placeholder={
                    feedbackType === "suggestion"
                      ? "Share your ideas on how we can improve..."
                      : feedbackType === "bug"
                        ? "Describe the issue you encountered..."
                        : "Tell us what's on your mind..."
                  }
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                />
              </View>
            </View>

            {/* Attachments */}
            <View style={styles.section}>
              <View style={styles.attachmentsHeader}>
                <Text style={styles.sectionTitle}>Add Screenshots</Text>
                <Text style={styles.attachmentsLimit}>{attachments.length}/3 images</Text>
              </View>

              <View style={styles.attachmentsList}>
                {attachments.map((uri, index) => (
                  <View key={index} style={styles.attachmentItem}>
                    <Image source={{ uri }} style={styles.attachmentImage} />
                    <TouchableOpacity style={styles.removeAttachmentButton} onPress={() => removeAttachment(index)}>
                      <Icon name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}

                {attachments.length < 3 && (
                  <TouchableOpacity style={styles.addAttachmentButton} onPress={pickImage}>
                    <Icon name="add-photo-alternate" size={28} color="#000" />
                    <Text style={styles.addAttachmentText}>Add Image</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>SUBMIT FEEDBACK</Text>
            </TouchableOpacity>

            <View style={styles.privacyNote}>
              <Icon name="lock" size={16} color="#666" />
              <Text style={styles.privacyNoteText}>
                Your feedback is anonymous unless you include personal information in your message.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 70 : 40,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  feedbackTypeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feedbackTypeButton: {
    width: width / 3.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedFeedbackType: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  feedbackTypeIcon: {
    marginBottom: 8,
  },
  feedbackTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
  selectedFeedbackTypeText: {
    color: "#fff",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  starButton: {
    padding: 8,
  },
  ratingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  textInputWrapper: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  feedbackTextInput: {
    fontSize: 16,
    color: "#000",
    padding: 16,
    minHeight: 150,
  },
  attachmentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  attachmentsLimit: {
    fontSize: 14,
    color: "#666",
  },
  attachmentsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  attachmentItem: {
    position: "relative",
    width: width / 3.5,
    height: width / 3.5,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  attachmentImage: {
    width: "100%",
    height: "100%",
  },
  removeAttachmentButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  addAttachmentButton: {
    width: width / 3.5,
    height: width / 3.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  addAttachmentText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  privacyNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  privacyNoteText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    textAlign: "center",
  },
})

export default FeedbackScreen
