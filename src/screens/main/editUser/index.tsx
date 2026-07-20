import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../components/common/txt";
import DatePickerModal from "./component/datePicker";
import GenderSelector from "./component/gender";
import PhoneNumberInput from "./component/phoneNumber";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthStore from "../../../store/userStore";
import { useUpdateProfile } from "../../../api/hooks/useAuth";

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const ACCENT_GREEN = "#A9D99B";
const INK = "#141613";
const MUTED = "#6B7268";
const BORDER = "#ECEFEA";

const EditUser = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const userData = useAuthStore((state) => state.userData);

  const [fullName, setFullName] = useState(userData?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || "");
  const [dateOfBirth, setDateOfBirth] = useState(userData?.dateOfBirth || "");
  const [gender, setGender] = useState(userData?.gender || "");
  const [avatarUri, setAvatarUri] = useState(userData?.profilePicture || "");
  const [imageFailed, setImageFailed] = useState(false);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const initial = (fullName || userData?.name || "U").charAt(0).toUpperCase();
  const showImage = !!avatarUri && !imageFailed;

  const handleSave = () => {
    if (!userData?.email) return;

    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (avatarUri && avatarUri !== userData?.profilePicture) {
      updateData.profilePicture = avatarUri;
    }

    updateProfile(
      { email: userData.email, data: updateData },
      {
        onSuccess: (response) => {
          useAuthStore.getState().setUserData({
            ...useAuthStore.getState().userData!,
            name: response.user?.name || fullName,
            phoneNumber: response.user?.phoneNumber || phoneNumber,
            gender: response.user?.gender || gender,
            dateOfBirth: response.user?.dateOfBirth || dateOfBirth,
            profilePicture: response.user?.profilePicture || avatarUri,
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

  const handleChangeImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo library access to change your profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      setImageFailed(false);
      // ⏳ NOTE: this stores the local URI. If your backend expects a
      // hosted URL, upload to Cloudinary here first (see the bondmaker
      // profile-picture flow for the getSignature → uploadToCloudinary
      // pattern) and setAvatarUri(secure_url) instead.
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={INK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isPending} hitSlop={8}>
          <Text style={[styles.saveText, isPending && styles.saveTextDisabled]}>
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
          {showImage ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.profileImage}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text variant="bold" size="xl" color={ACCENT_GREEN}>
                {initial}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={handleChangeImage}
          >
            <Text style={styles.changeImageText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor="#A8AFA5"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />
          </View>

          <PhoneNumberInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="901 234 5678"
          />

          <DatePickerModal
            label="Date of birth"
            value={dateOfBirth}
            onDateChange={setDateOfBirth}
            placeholder="01/01/2000"
          />

          <GenderSelector
            label="Gender"
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: INK,
  },
  saveText: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: BRAND,
  },
  saveTextDisabled: {
    opacity: 0.4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  profileImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  avatarFallback: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
  },
  changeImageButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: LIGHT_GREEN,
  },
  changeImageText: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: BRAND,
  },
  formContainer: {},
  inputContainer: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: INK,
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: "#FAFBF9",
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: INK,
  },
});
