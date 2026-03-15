import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Text from "../../../../components/common/txt";

interface DatePickerModalProps {
  label: string;
  value: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  label,
  value,
  onDateChange,
  placeholder = "Select date",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (date) {
      setSelectedDate(date);
      if (Platform.OS === "android") {
        const formattedDate = formatDate(date);
        onDateChange(formattedDate);
        setIsVisible(false);
      }
    }
  };

  const handleConfirm = () => {
    const formattedDate = formatDate(selectedDate);
    onDateChange(formattedDate);
    setIsVisible(false);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setShowPicker(false);
  };

  const openPicker = () => {
    setIsVisible(true);
    if (Platform.OS === "android") {
      setShowPicker(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.inputWrapper} onPress={openPicker}>
        <Text style={[styles.input, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* iOS Modal */}
      {Platform.OS === "ios" && (
        <Modal
          visible={isVisible}
          transparent
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCancel}
          >
            <View style={styles.bottomSheetContainer}>
              <TouchableOpacity activeOpacity={1}>
                <View style={styles.bottomSheetHandle} />
                <View style={styles.bottomSheetContent}>
                  <View style={styles.pickerHeader}>
                    <TouchableOpacity onPress={handleCancel}>
                      <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.pickerTitle}>Select Date</Text>
                    <TouchableOpacity onPress={handleConfirm}>
                      <Text style={styles.confirmButton}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    textColor="#000"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Android Picker */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
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
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  cancelButton: {
    fontSize: 16,
    color: "#6B7280",
  },
  confirmButton: {
    fontSize: 16,
    color: "#6C2BD9",
    fontWeight: "600",
  },
});

export default DatePickerModal;
