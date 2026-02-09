import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Option {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface BottomSheetSelectorProps {
  icon?: keyof typeof Ionicons.glyphMap;
  options: Option[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  sheetTitle?: string;
  variant?: "inline" | "field"; // New prop for styling variant
}

const BottomSheetSelector: React.FC<BottomSheetSelectorProps> = ({
  icon = "chevron-down",
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  sheetTitle = "Select Option",
  variant = "inline", // Default to inline (like the network selector)
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsVisible(false);
  };

  return (
    <>
      {variant === "inline" ? (
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setIsVisible(true)}
        >
          <Ionicons name={icon} size={16} color="#6C2BD9" />
          <Text style={styles.selectorText}>{displayText}</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#6C2BD9"
            style={styles.chevronIcon}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.fieldButton}
          onPress={() => setIsVisible(true)}
        >
          <Text
            style={[
              styles.fieldText,
              !selectedOption && styles.fieldPlaceholder,
            ]}
          >
            {displayText}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#999" />
        </TouchableOpacity>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.bottomSheetContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.bottomSheetHandle} />
              <View style={styles.bottomSheetContent}>
                <Text style={styles.bottomSheetTitle}>{sheetTitle}</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionItem,
                        selectedValue === option.value && styles.selectedOption,
                      ]}
                      onPress={() => handleSelect(option.value)}
                    >
                      {option.icon && (
                        <Ionicons
                          name={option.icon}
                          size={20}
                          color={
                            selectedValue === option.value ? "#6C2BD9" : "#666"
                          }
                          style={styles.optionIcon}
                        />
                      )}
                      <Text
                        style={[
                          styles.optionText,
                          selectedValue === option.value &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {selectedValue === option.value && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#6C2BD9"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  selectorText: {
    fontSize: 14,
    color: "#6C2BD9",
    marginLeft: 6,
    fontWeight: "500",
  },
  chevronIcon: {
    marginLeft: 4,
  },
  fieldButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  fieldText: {
    fontSize: 15,
    color: "#000",
  },
  fieldPlaceholder: {
    color: "#999",
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
    maxHeight: "70%",
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
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F8F8F8",
  },
  selectedOption: {
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#6C2BD9",
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#6C2BD9",
    fontWeight: "600",
  },
});

export default BottomSheetSelector;
