import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./style";
import { Ionicons } from "@expo/vector-icons";
import ProfileInfoItem from "./component/item";
import Text from "../../../components/common/txt";
import { useNavigation } from "@react-navigation/native";

const User = () => {
  const navigation = useNavigation();
  const handleBack = () => {
    console.log("Go back");
    // navigation.goBack();
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
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
        </View>

        {/* User Information */}
        <View style={styles.infoContainer}>
          <ProfileInfoItem
            icon="person-outline"
            label="User Name"
            value="Olamide"
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="person-outline"
            label="Full Name"
            value="Olamide Oladele"
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="mail-outline"
            label="E-Mail Address"
            value="Olamide@gmail.com"
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="call-outline"
            label="Phone Number"
            value="09036018013"
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="calendar-outline"
            label="Date Of Birth"
            value="01/01/2000"
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="home-outline"
            label="Residential Address"
            value="House 2 Musa Aminu Street, Surdere, La..."
            iconColor="#6C2BD9"
          />

          <ProfileInfoItem
            icon="male-female-outline"
            label="Gender"
            value="Male"
            iconColor="#6C2BD9"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default User;
