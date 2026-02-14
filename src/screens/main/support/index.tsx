import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const Support = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I fund my wallet?",
      answer:
        "You can fund your wallet through bank transfer, card payment, or USSD. Go to Wallet > Fund Wallet and choose your preferred method.",
    },
    {
      id: 2,
      question: "How do I reset my password?",
      answer:
        "Go to Settings > Security > Change Password. Enter your current password and create a new one. You can also use 'Forgot Password?' on the login screen.",
    },
    {
      id: 3,
      question: "How to purchase data",
      answer:
        "Navigate to the Data section, select your network provider, choose a data plan, enter the phone number, and complete the payment.",
    },
    {
      id: 4,
      question: "What are the accepted payment methods?",
      answer:
        "We accept bank transfers, debit/credit cards, wallet balance, and USSD payments for all transactions.",
    },
    {
      id: 5,
      question: "Data plan comparisons",
      answer:
        "Compare data plans across different networks in the Data section. We show pricing, validity, and network coverage for each plan.",
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleWhatsApp = () => {
    Linking.openURL("https://wa.me/2349036018013");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:hello@jaaApp.com");
  };

  const handleInstagram = () => {
    Linking.openURL("https://instagram.com/jaaApp");
  };

  const handleCommunity = () => {
    console.log("Join Our Community");
  };

  const handleRateApp = () => {
    console.log("Rate App");
  };

  return (
    <View style={styles.root}>
      {/* Header with Gradient */}
      <LinearGradient colors={["#7C3AED", "#8B5CF6"]} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={styles.placeholder} />

        {/* Chat Bot Section */}
        <View style={styles.chatBotContainer}>
          <View style={styles.chatBotAvatar}>
            <Text style={styles.avatarText}>👋</Text>
          </View>
          <View style={styles.chatBotTextContainer}>
            <Text style={styles.chatBotGreeting}>Hello, Olamide</Text>
            <Text style={styles.chatBotMessage}>
              How can we help to assist you?
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FAQs Section */}
        <View style={styles.faqSection}>
          <View style={styles.faqHeader}>
            <Text style={styles.faqTitle}>FAQs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.faqList}>
            {faqs.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFaq(faq.id)}
                >
                  <Ionicons
                    name={
                      expandedFaq === faq.id
                        ? "chevron-down"
                        : "chevron-forward"
                    }
                    size={18}
                    color="#1F2937"
                  />
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                </TouchableOpacity>

                {expandedFaq === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Contact JARA Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact JARA</Text>

          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              <Text style={styles.contactButtonText}>WhatsApp Us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleEmail}
            >
              <Ionicons name="mail-outline" size={24} color="#7C3AED" />
              <Text style={styles.contactButtonText}>Send Us a mail</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleInstagram}
            >
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
              <Text style={styles.contactButtonText}>Instagram DM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.communityButton}
            onPress={handleCommunity}
          >
            <Ionicons name="people-outline" size={20} color="#10B981" />
            <Text style={styles.communityButtonText}>Join Our Community</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rateButton} onPress={handleRateApp}>
            <Ionicons name="star-outline" size={20} color="#F59E0B" />
            <Text style={styles.rateButtonText}>Rate App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Support;
