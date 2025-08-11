import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  ImageBackground,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const PrivacySettingsScreen = ({ navigation }) => {
  // Privacy settings state
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [dataSharing, setDataSharing] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Function to handle visibility change
  const handleVisibilityChange = (value) => {
    setProfileVisibility(value);
  };

  // Function to save privacy settings
  const saveSettings = () => {
    // Here you would typically save to API or local storage
    Alert.alert(
      "Settings Saved",
      "Your privacy settings have been updated successfully.",
      [{ text: "OK" }]
    );
  };

  // Render a toggle setting item
  const renderToggleSetting = ({ icon, title, description, value, onValueChange }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Icon name={icon} size={24} color="#fff" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: "#ffffff" }}
        thumbColor={value ? "#000000" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  );

  // Render a radio option for visibility
  const renderRadioOption = ({ value, label, currentValue, onSelect }) => (
    <TouchableOpacity 
      style={styles.radioOption} 
      onPress={() => onSelect(value)}
    >
      <View style={styles.radioOuterCircle}>
        {currentValue === value && <View style={styles.radioInnerCircle} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/globe.jpg')}
      style={styles.backgroundImage}>
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
        style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Privacy Settings</Text>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}>
            
            {/* Profile Visibility Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile Visibility</Text>
              <View style={styles.visibilityContainer}>
                {renderRadioOption({
                  value: 'public',
                  label: 'Public - Anyone can view your profile',
                  currentValue: profileVisibility,
                  onSelect: handleVisibilityChange
                })}
                {renderRadioOption({
                  value: 'contacts',
                  label: 'Contacts Only - Only your contacts can view your profile',
                  currentValue: profileVisibility,
                  onSelect: handleVisibilityChange
                })}
                {renderRadioOption({
                  value: 'private',
                  label: 'Private - Only you can view your profile',
                  currentValue: profileVisibility,
                  onSelect: handleVisibilityChange
                })}
              </View>
            </View>

            {/* Data & Privacy Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data & Privacy</Text>
              {renderToggleSetting({
                icon: 'share',
                title: 'Data Sharing',
                description: 'Allow sharing of non-personal data to improve services',
                value: dataSharing,
                onValueChange: setDataSharing
              })}
              {renderToggleSetting({
                icon: 'location-on',
                title: 'Location Tracking',
                description: 'Allow the app to track your location',
                value: locationTracking,
                onValueChange: setLocationTracking
              })}
            </View>

            {/* Account Security Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Security</Text>
              {renderToggleSetting({
                icon: 'verified-user',
                title: 'Two-Factor Authentication',
                description: 'Add an extra layer of security to your account',
                value: twoFactorAuth,
                onValueChange: setTwoFactorAuth
              })}
              <TouchableOpacity 
                style={styles.linkItem}
                onPress={() => navigation.navigate('ChangePassword')}
              >
                <View style={styles.settingIconContainer}>
                  <Icon name="lock" size={24} color="#fff" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Change Password</Text>
                  <Text style={styles.settingDescription}>Update your account password</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.linkItem}
                onPress={() => Alert.alert("Coming Soon", "This feature will be available in a future update.")}
              >
                <View style={styles.settingIconContainer}>
                  <Icon name="block" size={24} color="#fff" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Blocked Accounts</Text>
                  <Text style={styles.settingDescription}>Manage accounts you've blocked</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Communication Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Communication</Text>
              {renderToggleSetting({
                icon: 'email',
                title: 'Email Notifications',
                description: 'Receive updates and alerts via email',
                value: emailNotifications,
                onValueChange: setEmailNotifications
              })}
              {renderToggleSetting({
                icon: 'notifications',
                title: 'Push Notifications',
                description: 'Receive notifications on your device',
                value: pushNotifications,
                onValueChange: setPushNotifications
              })}
              {renderToggleSetting({
                icon: 'visibility',
                title: 'Activity Status',
                description: 'Show when you are active on the platform',
                value: activityStatus,
                onValueChange: setActivityStatus
              })}
            </View>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </TouchableOpacity>
            </View>

            {/* Privacy Policy Link */}
            <TouchableOpacity 
              style={styles.policyLink}
              onPress={() => Alert.alert("Privacy Policy", "The privacy policy will open in a new window.")}
            >
              <Text style={styles.policyLinkText}>View Privacy Policy</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  visibilityContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  radioOuterCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  radioLabel: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  policyLink: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  policyLinkText: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default PrivacySettingsScreen;