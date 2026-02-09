import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";

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
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  const openContactPicker = async () => {
    try {
      setIsLoadingContacts(true);
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant contact permissions to select a contact",
        );
        setIsLoadingContacts(false);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const contactsWithPhones = data
          .filter(
            (contact) =>
              contact.phoneNumbers && contact.phoneNumbers.length > 0,
          )
          .map((contact) => ({
            id: contact.id,
            name: contact.name || "Unknown",
            phoneNumber: contact.phoneNumbers![0].number || "",
            cleanPhone:
              contact.phoneNumbers![0].number?.replace(/[^\d+]/g, "") || "",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setContacts(contactsWithPhones);
        setIsContactSheetVisible(true);
      } else {
        Alert.alert("No Contacts", "No contacts found on your device");
      }
      setIsLoadingContacts(false);
    } catch (error) {
      console.error("Error loading contacts:", error);
      Alert.alert("Error", "Failed to load contacts");
      setIsLoadingContacts(false);
    }
  };

  const handleSelectContact = (cleanPhone: string) => {
    onChangeText(cleanPhone);
    setIsContactSheetVisible(false);
  };

  return (
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
          disabled={isLoadingContacts}
        >
          <Ionicons
            name={isLoadingContacts ? "hourglass-outline" : "people-outline"}
            size={20}
            color="#6C2BD9"
          />
        </TouchableOpacity>
      </View>

      {/* Contact Picker Bottom Sheet */}
      <Modal
        visible={isContactSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsContactSheetVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsContactSheetVisible(false)}
        >
          <View style={styles.bottomSheetContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.bottomSheetHandle} />
              <View style={styles.bottomSheetContent}>
                <View style={styles.sheetHeader}>
                  <Text style={styles.bottomSheetTitle}>Select Contact</Text>
                  <TouchableOpacity
                    onPress={() => setIsContactSheetVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
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
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
    flex: 1,
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
