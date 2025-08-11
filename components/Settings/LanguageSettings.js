"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  Alert,
  Dimensions,
  ScrollView
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")

const LanguageScreen = ({ navigation, route }) => {
  const { onUpdate } = route.params || {}

  // Available languages
  const languages = [
    { id: "en", name: "English (US)", flag: "🇺🇸", region: "North America" },
    { id: "es", name: "Español", flag: "🇪🇸", region: "Europe" },
    { id: "fr", name: "Français", flag: "🇫🇷", region: "Europe" },
    { id: "de", name: "Deutsch", flag: "🇩🇪", region: "Europe" },
    { id: "it", name: "Italiano", flag: "🇮🇹", region: "Europe" },
    { id: "pt", name: "Português", flag: "🇧🇷", region: "South America" },
    { id: "ru", name: "Русский", flag: "🇷🇺", region: "Europe/Asia" },
    { id: "zh", name: "中文", flag: "🇨🇳", region: "Asia" },
    { id: "ja", name: "日本語", flag: "🇯🇵", region: "Asia" },
    { id: "ko", name: "한국어", flag: "🇰🇷", region: "Asia" },
    { id: "ar", name: "العربية", flag: "🇸🇦", region: "Middle East" },
    { id: "hi", name: "हिन्दी", flag: "🇮🇳", region: "Asia" },
  ]

  // Group languages by region
  const groupedLanguages = languages.reduce((groups, language) => {
    const region = language.region
    if (!groups[region]) {
      groups[region] = []
    }
    groups[region].push(language)
    return groups
  }, {})

  // Currently selected language
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const handleLanguageSelect = (languageId) => {
    setSelectedLanguage(languageId)
  }

  const handleSave = () => {
    // Get the selected language name
    const selectedLang = languages.find((lang) => lang.id === selectedLanguage)

    if (onUpdate) {
      onUpdate(selectedLang.name)
    }

    Alert.alert("Language Updated", `App language has been changed to ${selectedLang.name}`, [
      { text: "OK", onPress: () => navigation.goBack() },
    ])
  }

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.languageItem, selectedLanguage === item.id && styles.selectedLanguageItem]}
      onPress={() => handleLanguageSelect(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.languageInfo}>
        <Text style={styles.languageFlag}>{item.flag}</Text>
        <Text style={[styles.languageName, selectedLanguage === item.id && styles.selectedLanguageName]}>
          {item.name}
        </Text>
      </View>
      {selectedLanguage === item.id && (
        <View style={styles.checkmarkContainer}>
          <Icon name="check" size={20} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  )

  const renderSectionHeader = (region) => <Text style={styles.sectionHeader}>{region}</Text>

  return (
    <ImageBackground
      source={require('../../assets/grid.jpg')}
      style={styles.backgroundImage}
    >
      <LinearGradient colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.1)"]} style={styles.gradient}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Language Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.container}>
          <Text style={styles.description}>
            Choose your preferred language. This will change the language throughout the app.
          </Text>

          <ScrollView style={styles.languageListContainer}>
            {Object.keys(groupedLanguages).map((region) => (
              <View key={region} style={styles.sectionContainer}>
                {renderSectionHeader(region)}
                {groupedLanguages[region].map((language) => renderLanguageItem({ item: language }))}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>APPLY CHANGES</Text>
          </TouchableOpacity>
        </View>
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
  gradient: {
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 24,
    lineHeight: 22,
  },
  languageListContainer: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedLanguageItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    fontSize: 16,
    color: "#fff",
  },
  selectedLanguageName: {
    fontWeight: "bold",
  },
  checkmarkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
})

export default LanguageScreen