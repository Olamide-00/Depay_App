import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../components/common/txt";
import DatePickerModal from "./component/datePicker";
import GenderSelector from "./component/gender";
import PhoneNumberInput from "./component/phoneNumber";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../../store/userStore";
import { useUpdateProfile } from "../../../api/hooks/useAuth";

const EditUser = () => {
  const navigation = useNavigation<any>();
  const userData = useAuthStore((state) => state.userData);

  // Pre-fill from store
  const [fullName, setFullName] = useState(userData?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || "");
  const [dateOfBirth, setDateOfBirth] = useState(userData?.dateOfBirth || "");
  const [gender, setGender] = useState(userData?.gender || "");

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const handleSave = () => {
    if (!userData?.email) return;

    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    updateProfile(
      { email: userData.email, data: updateData },
      {
        onSuccess: (response) => {
          // Sync updated fields back to store
          useAuthStore.getState().setUserData({
            ...useAuthStore.getState().userData!,
            name: response.user?.name || fullName,
            phoneNumber: response.user?.phoneNumber || phoneNumber,
            gender: response.user?.gender || gender,
            dateOfBirth: response.user?.dateOfBirth || dateOfBirth,
          });

          Alert.alert("Success", "Profile updated successfully");
          navigation.goBack();
        },
        onError: (err: any) => {
          Alert.alert(
            "Error",
            err?.response?.data?.message || "Failed to update profile"
          );
        },
      }
    );
  };

  const handleChangeImage = () => {
    console.log("Change profile image");
    // Open image picker
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isPending}
        >
          <Text style={[styles.saveText, isPending && { opacity: 0.5 }]}>
            {isPending ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={
              userData?.profilePicture
                ? { uri: userData.profilePicture }
                : { uri: "https://via.placeholder.com/100" }
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={handleChangeImage}
          >
            <Text style={styles.changeImageText}>Change Image</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Phone Number */}
          <PhoneNumberInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="901 234 5678"
          />

          {/* Date of Birth */}
          <DatePickerModal
            label="Date of birth"
            value={dateOfBirth}
            onDateChange={setDateOfBirth}
            placeholder="01/01/2000"
          />

          {/* Gender */}
          <GenderSelector
            label="Gender*"
            value={gender}
            onGenderChange={setGender}
            placeholder="Select gender"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EditUser;