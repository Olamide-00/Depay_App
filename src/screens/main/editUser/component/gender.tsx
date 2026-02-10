import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GenderSelectorProps {
  label: string;
  value: string;
  onGenderChange: (gender: string) => void;
  placeholder?: string;
}

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
];

const GenderSelector: React.FC<GenderSelectorProps> = ({
  label,
  value,
  onGenderChange,
  placeholder = "Select gender",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (gender: string) => {
    onGenderChange(gender);
    setIsVisible(false);
  };

  const getDisplayValue = () => {
    const selected = genderOptions.find((option) => option.value === value);
    return selected ? selected.label : "";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.inputWrapper}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.input, !value && styles.placeholder]}>
          {getDisplayValue() || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Gender Selection Modal */}
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
                <Text style={styles.bottomSheetTitle}>Select Gender</Text>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionItem,
                      value === option.value && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value === option.value && styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {value === option.value && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#6C2BD9"
                      />
                    )}
                  </TouchableOpacity>
                ))}
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
    color: "#000",
    marginBottom: 8,
    fontWeight: "400",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: {
    fontSize: 15,
    color: "#000",
    flex: 1,
  },
  placeholder: {
    color: "#9CA3AF",
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
    justifyContent: "space-between",
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
  optionText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#6C2BD9",
    fontWeight: "600",
  },
});

export default GenderSelector;
