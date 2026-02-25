import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
} from "react-native";
import React, { useState, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Text from "../common/txt";
import { useNavigation } from "@react-navigation/native";
import useAuthStore, { selectUserData } from "../../store/userStore";

const Header = () => {
  const navigation = useNavigation();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const slideAnim = useRef(new Animated.Value(-100)).current;

  // details
  const userData = useAuthStore(selectUserData);
  const name = userData?.name || "User";

  const handleSearchPress = () => {
    if (!showSearchBar) {
      setShowSearchBar(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // If search bar is already showing, focus on it
      // Or you can hide it on second press if you prefer
    }
  };

  const handleSearchCancel = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSearchBar(false);
      setSearchText("");
      Keyboard.dismiss();
    });
  };

  const handleSearchSubmit = () => {
    console.log("Searching for:", searchText);
    // Handle search functionality
  };

  return (
    <View style={styles.container}>
      {/* Original Header */}
      <View style={styles.headerContent}>
        <View style={styles.row1}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={30}
            color="black"
          />
          <Text variant="bold" color="black" size="lg">
            Hi, {name}!
          </Text>
        </View>
        <View style={styles.row2}>
          <TouchableOpacity onPress={handleSearchPress}>
            <MaterialCommunityIcons
              name="account-search"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <MaterialCommunityIcons name="scan-helper" size={24} color="black" />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("StackNav", { screen: "Notification" })
            }
          >
            <MaterialCommunityIcons name="bell" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlay Search Bar - Appears on top */}
      {showSearchBar && (
        <Animated.View
          style={[
            styles.searchOverlay,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={setSearchText}
                autoFocus={true}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
                placeholderTextColor="#999"
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchText("")}
                  style={styles.clearButton}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={18}
                    color="#999"
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={handleSearchCancel}
              style={styles.cancelButton}
            >
              <Text color="black" size="md">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "white",
    marginBottom: hp("-1%"),
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  row2: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("5%"),
  },
  // Search Overlay Styles
  searchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 100,
    elevation: 10, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: wp("3%"),
    paddingHorizontal: wp("3%"),
    marginRight: wp("3%"),
    height: hp("5.5%"),
  },
  searchIcon: {
    marginRight: wp("2%"),
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: hp("1.9%"),
    color: "black",
  },
  clearButton: {
    padding: wp("1%"),
  },
  cancelButton: {
    paddingHorizontal: wp("1%"),
  },
});
