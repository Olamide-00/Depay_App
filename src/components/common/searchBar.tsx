import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Filter, SearchNormal, CloseCircle } from "iconsax-react-native";
import { COLORS } from "../../constants/Colors";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
}

const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  onFilterPress,
  showFilter = true,
}: SearchBarProps) => {
  const [searchText, setSearchText] = useState("");

  const handleClear = () => {
    setSearchText("");
    onSearch?.("");
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    onSearch?.(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchNormal size={wp("5%")} color={COLORS.gray} variant="Outline" />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={searchText}
          onChangeText={handleTextChange}
          returnKeyType="search"
          clearButtonMode="never"
        />

        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <CloseCircle size={wp("4.5%")} color={COLORS.gray} variant="Bold" />
          </TouchableOpacity>
        )}
      </View>

      {showFilter && (
        <TouchableOpacity
          onPress={onFilterPress}
          style={styles.filterButton}
          activeOpacity={0.7}
        >
          <Filter size={wp("5%")} color={COLORS.brand} variant="Bold" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
    marginHorizontal: wp("4%"),
    marginVertical: hp("1%"),
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    borderRadius: wp("3%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
  },
  input: {
    flex: 1,
    marginLeft: wp("3%"),
    fontSize: wp("4%"),
    color: COLORS.black,
    padding: 0,
    includeFontPadding: false,
  },
  clearButton: {
    padding: wp("1%"),
  },
  filterButton: {
    backgroundColor: COLORS.white,
    width: wp("11%"),
    height: wp("11%"),
    borderRadius: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});
