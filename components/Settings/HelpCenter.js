'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';

const HelpCenterScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // FAQ data
  const faqs = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer:
        'To reset your password, go to the login screen and tap on "Forgot Password". Follow the instructions sent to your email to create a new password.',
    },
    {
      id: '2',
      question: 'How do I update my profile information?',
      answer:
        'You can update your profile information by going to Settings > Personal Information. Tap on the edit icon to make changes to your profile details.',
    },
    {
      id: '3',
      question: 'How do I change notification settings?',
      answer:
        'To change your notification preferences, go to Settings > Notifications. Toggle the switches to enable or disable different types of notifications.',
    },
    {
      id: '4',
      question: 'Is my personal information secure?',
      answer:
        'Yes, we take data security very seriously. All personal information is encrypted and stored securely. You can review our privacy policy for more details on how we protect your data.',
    },
    {
      id: '5',
      question: 'How do I delete my account?',
      answer:
        'To delete your account, go to Settings > Privacy Settings > Data Management. Tap on "Delete My Data" and follow the confirmation steps. Please note that this action is permanent and cannot be undone.',
    },
    {
      id: '6',
      question: 'How do I report a bug or issue?',
      answer:
        'You can report bugs or issues by going to Settings > Send Feedback. Provide details about the problem you encountered, and our team will investigate it.',
    },
  ];

  // Support categories
  const supportCategories = [
    { id: '1', title: 'Account Issues', icon: 'person' },
    { id: '2', title: 'Technical Support', icon: 'build' },
    { id: '3', title: 'Billing & Payments', icon: 'payment' },
    { id: '4', title: 'Feature Requests', icon: 'lightbulb' },
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const renderFaqItem = ({ item }) => (
    <BlurView intensity={80} tint="light" style={styles.faqItemContainer}>
      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => toggleFaq(item.id)}>
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Icon
            name={
              expandedFaq === item.id
                ? 'keyboard-arrow-up'
                : 'keyboard-arrow-down'
            }
            size={24}
            color="#fff"
          />
        </View>
        {expandedFaq === item.id && (
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        )}
      </TouchableOpacity>
    </BlurView>
  );

  const renderCategoryItem = ({ item }) => (
    <BlurView intensity={80} tint="light" style={styles.categoryItemContainer}>
      <TouchableOpacity style={styles.categoryItem}>
        <View style={styles.categoryIcon}>
          <Icon name={item.icon} size={24} color="#fff" />
        </View>
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </TouchableOpacity>
    </BlurView>
  );

  return (
    <ImageBackground
      source={require('../../assets/share.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <BlurView intensity={80} tint="light" style={styles.searchContainer}>
            <Icon
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
          </BlurView>

          {/* Support Categories */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>How can we help you?</Text>
            <FlatList
              data={supportCategories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>

          {/* FAQs */}
          <View style={styles.faqContainer}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => renderFaqItem({ item: faq }))
            ) : (
              <Text style={styles.noResultsText}>
                No results found for "{searchQuery}"
              </Text>
            )}
          </View>

          {/* Contact Support */}
          <View style={styles.contactContainer}>
            <Text style={styles.sectionTitle}>Still need help?</Text>
            <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate('SendFeedback')}>
              <Icon name="chat" size={20} color="#000" />
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
            <BlurView
              intensity={80}
              tint="light"
              style={styles.contactInfoContainer}>
              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <Icon name="email" size={16} color="#fff" />
                  <Text style={styles.contactText}>acanetsupport@codexinc.com</Text>
                </View>
                <View style={styles.contactItem}>
                  <Icon name="phone" size={16} color="#fff" />
                  <Text style={styles.contactText}>+233 (0) 257-256-751</Text>
                </View>
                <View style={styles.contactItem}>
                  <Icon name="schedule" size={16} color="#fff" />
                  <Text style={styles.contactText}>Available 24/7</Text>
                </View>
              </View>
            </BlurView>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Version 1.0.0 • © 2025 Academic Network
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryItemContainer: {
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryItem: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  faqContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  faqItemContainer: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  faqItem: {
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#fff',
    marginTop: 12,
    lineHeight: 20,
  },
  noResultsText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  contactContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  contactButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  contactInfoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactInfo: {
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});

export default HelpCenterScreen;
