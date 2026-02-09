import React, { createContext, useContext, useState, useEffect } from "react";
import * as Contacts from "expo-contacts";
import { Alert } from "react-native";

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  cleanPhone: string;
}

interface ContactsContextType {
  contacts: Contact[];
  isLoading: boolean;
  hasPermission: boolean | null;
  requestContacts: () => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined,
);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Load contacts on mount
  useEffect(() => {
    loadContactsInBackground();
  }, []);

  const loadContactsInBackground = async () => {
    try {
      const { status } = await Contacts.getPermissionsAsync();

      if (status === "granted") {
        setHasPermission(true);
        await fetchContacts();
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      console.error("Error checking contact permissions:", error);
      setHasPermission(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
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
            id: contact.id!,
            name: contact.name || "Unknown",
            phoneNumber: contact.phoneNumbers![0].number || "",
            cleanPhone:
              contact.phoneNumbers![0].number?.replace(/[^\d+]/g, "") || "",
          }));

        setContacts(contactsWithPhones);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setIsLoading(false);
    }
  };

  const requestContacts = async () => {
    if (hasPermission) {
      return;
    }

    try {
      setIsLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant contact permissions to select a contact",
        );
        setIsLoading(false);
        return;
      }

      setHasPermission(true);
      await fetchContacts();
    } catch (error) {
      console.error("Error requesting contacts:", error);
      Alert.alert("Error", "Failed to load contacts");
      setIsLoading(false);
    }
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        isLoading,
        hasPermission,
        requestContacts,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }
  return context;
};
