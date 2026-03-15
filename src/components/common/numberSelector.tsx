import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContacts } from "../../utils/contactProvider";
import Text from "./txt";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PhoneInputWithContactProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const PhoneInputWithContact: React.FC<PhoneInputWithContactProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "Enter phone number",
}) => {
  const [isContactSheetVisible, setIsContactSheetVisible] = useState(false);
  const { contacts, isLoading, hasPermission, requestContacts } = useContacts();

  // Animation values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animate modal open/close
  useEffect(() => {
    if (isContactSheetVisible) {
      // Opening animation with spring
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 150,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Closing animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isContactSheetVisible]);

  const openContactPicker = async () => {
    // Always open modal immediately
    setIsContactSheetVisible(true);

    // If no permission, request it
    if (!hasPermission) {
      await requestContacts();
    }
  };

  const closeModal = () => {
    // Trigger closing animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Close modal after animation completes
      setIsContactSheetVisible(false);
      // Reset animation values
      slideAnim.setValue(SCREEN_HEIGHT);
      opacityAnim.setValue(0);
    });
  };

  const handleSelectContact = (cleanPhone: string) => {
    onChangeText(cleanPhone);
    closeModal();
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
          <View style={styles.iconContainer}>
            <Ionicons name="call-outline" size={18} color="#000" />
          </View>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={value}
            onChangeText={onChangeText}
            keyboardType="phone-pad"
          />
          <TouchableOpacity
            style={styles.contactButton}
            onPress={openContactPicker}
          >
            <Ionicons name="people-outline" size={20} color="#6C2BD9" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact Picker Bottom Sheet */}
      <Modal
        visible={isContactSheetVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeModal}
          />
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetContent}>
              <View style={styles.sheetHeader}>
                <Text style={styles.bottomSheetTitle}>Select Contact</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#6C2BD9" />
                  <Text style={styles.loadingText}>Loading contacts...</Text>
                </View>
              ) : contacts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={48} color="#999" />
                  <Text style={styles.emptyText}>No contacts found</Text>
                </View>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollView}
                >
                  {contacts.map((contact) => (
                    <TouchableOpacity
                      key={contact.id}
                      style={styles.contactItem}
                      onPress={() => handleSelectContact(contact.cleanPhone)}
                    >
                      <View style={styles.contactAvatar}>
                        <Ionicons name="person" size={20} color="#6C2BD9" />
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{contact.name}</Text>
                        <Text style={styles.contactPhone}>
                          {contact.phoneNumber}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
  },
  contactButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: "80%",
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  bottomSheetContent: {
    paddingHorizontal: 16,
    maxHeight: "90%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  scrollView: {
    maxHeight: 400,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F8F8F8",
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 13,
    color: "#666",
  },
});

export default PhoneInputWithContact;
