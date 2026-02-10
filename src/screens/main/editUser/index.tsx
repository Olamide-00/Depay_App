import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../components/common/txt";
import DatePickerModal from "./component/datePicker";
import GenderSelector from "./component/gender";
import PhoneNumberInput from "./component/phoneNumber";

const EditUser = () => {
  const [userName, setUserName] = useState("Sebi");
  const [fullName, setFullName] = useState("Sebi Raheem");
  const [email, setEmail] = useState("sebiraheem@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("901 234 5678");
  const [dateOfBirth, setDateOfBirth] = useState("01/01/2000");
  const [address, setAddress] = useState(
    "House 2 Musa Aminu street, Surdere, Lagos",
  );
  const [gender, setGender] = useState("male");

  const handleBack = () => {
    console.log("Go back");
    // navigation.goBack();
  };

  const handleSave = () => {
    console.log("Save profile");
    // Save profile data
  };

  const handleChangeImage = () => {
    console.log("Change profile image");
    // Open image picker
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
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
          {/* User Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>User Name</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Enter user name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

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

          {/* Email Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
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

          {/* Residential Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Residential Address</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={2}
            />
          </View>

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
