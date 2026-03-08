import { View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./style";
import { Ionicons } from "@expo/vector-icons";
import ProfileInfoItem from "./component/item";
import Text from "../../../components/common/txt";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import useAuthStore from "../../../store/userStore";

const User = () => {
  const navigation = useNavigation<any>();
  const userData = useAuthStore((state: any) => state.userData);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate("EditUser");
  };

  return (
    <View style={styles.root}>
      {/* Custom Header with Edit Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={handleEdit}
          style={styles.editButtonContainer}
        >
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          {userData?.profilePicture ? (
            <Image
              source={{ uri: userData.profilePicture }}
              style={styles.profileImage}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.profileImage, styles.placeholderImage]}>
              <Ionicons name="person" size={40} color="#999" />
            </View>
          )}
        </View>

        {/* User Information */}
        <View style={styles.infoContainer}>
          <ProfileInfoItem
            icon="person-outline"
            label="Full Name"
            value={userData?.fullName || userData?.name || "---"}
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="mail-outline"
            label="E-Mail Address"
            value={userData?.email || "---"}
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="call-outline"
            label="Phone Number"
            value={userData?.phoneNumber || "---"}
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="calendar-outline"
            label="Date Of Birth"
            value={
              userData?.dateOfBirth
                ? new Date(userData.dateOfBirth).toLocaleDateString("en-NG")
                : "---"
            }
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="male-female-outline"
            label="Gender"
            value={
              userData?.gender
                ? userData.gender.charAt(0).toUpperCase() +
                  userData.gender.slice(1)
                : "---"
            }
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="shield-checkmark-outline"
            label="KYC Status"
            value={"Verified"}
            iconColor={"#22c55e"}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default User;
