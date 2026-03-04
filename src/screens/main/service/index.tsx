import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import SearchBar from "../../../components/common/searchBar";
import { services as serviceData } from "../../../constants/service";

const Service = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const allSections = [
    { title: "Top Services", data: serviceData.slice(0, 4) },
    { title: "Airtime & Data", data: serviceData.slice(4, 8) },
    { title: "Betting", data: serviceData.slice(8, 16) },
    { title: "Cable", data: serviceData.slice(16, 20) },
    { title: "Others", data: serviceData.slice(20) },
  ];

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return allSections;
    }

    const query = searchQuery.toLowerCase().trim();

    return allSections
      .map((section) => ({
        ...section,
        data: section.data.filter((service) =>
          service.label.toLowerCase().includes(query),
        ),
      }))
      .filter((section) => section.data.length > 0);
  }, [searchQuery]);

  const renderServiceGrid = (services) => {
    const rows = [];
    for (let i = 0; i < services.length; i += 4) {
      const rowItems = services.slice(i, i + 4);
      rows.push(
        <View key={`row-${i}`} style={styles.servicesRow}>
          {rowItems.map((item, index) => (
            <TouchableOpacity
              key={`${item.label}-${index}`}
              style={styles.serviceItem}
              onPress={() =>
                navigation.navigate("StackNav", {
                  screen: item.screen,
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.serviceIconContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={item.image}
                    style={styles.serviceImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <Text style={styles.serviceLabel} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>,
      );
    }
    return rows;
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Services" back />
      <SearchBar placeholder="Search services..." onSearch={setSearchQuery} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesContainer}
      >
        {filteredSections.length > 0 ? (
          filteredSections.map((section, sectionIndex) => (
            <View key={`section-${sectionIndex}`}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              {renderServiceGrid(section.data)}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No services found for "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Service;
