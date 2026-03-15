// Service.tsx
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import CommonHeader from "../../../components/ui/commonHeader";
import SearchBar from "../../../components/common/searchBar";
import { services as serviceData } from "../../../constants/service";
import Text from "../../../components/common/txt";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const H_PADDING = 16;
const COLUMNS = 4;
const GAP = 12;
const ITEM_WIDTH =
  (SCREEN_WIDTH - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
const BOX_SIZE = ITEM_WIDTH * 0.72;
const IMG_SIZE = BOX_SIZE * 0.55;

const allSections = [
  { title: "Top Services", emoji: "⚡", data: serviceData.slice(0, 4) },
  { title: "Airtime & Data", emoji: "📶", data: serviceData.slice(4, 8) },
  { title: "Betting", emoji: "🎯", data: serviceData.slice(8, 16) },
  { title: "Cable TV", emoji: "📺", data: serviceData.slice(16, 20) },
  { title: "Others", emoji: "🔧", data: serviceData.slice(20) },
];

const Service = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return allSections;
    const q = searchQuery.toLowerCase().trim();
    return allSections
      .map((s) => ({
        ...s,
        data: s.data.filter((item) => item.label.toLowerCase().includes(q)),
      }))
      .filter((s) => s.data.length > 0);
  }, [searchQuery]);

  const renderGrid = (services: any[]) => {
    const rows = [];
    for (let i = 0; i < services.length; i += COLUMNS) {
      const rowItems = services.slice(i, i + COLUMNS);
      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {rowItems.map((item: any, idx: number) => (
            <TouchableOpacity
              key={`${item.label}-${idx}`}
              style={styles.item}
              onPress={() =>
                navigation.navigate("StackNav", { screen: item.screen })
              }
              activeOpacity={0.65}
            >
              <View style={styles.imageBox}>
                <Image
                  source={item.image}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              <Text
                size="xs"
                color="#6B6B72"
                style={styles.label}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
          {rowItems.length < COLUMNS &&
            [...Array(COLUMNS - rowItems.length)].map((_, i) => (
              <View key={`empty-${i}`} style={styles.item} />
            ))}
        </View>,
      );
    }
    return rows;
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Services" />
      <SearchBar placeholder="Search services..." onSearch={setSearchQuery} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredSections.length > 0 ? (
          filteredSections.map((section, i) => (
            <View key={`section-${i}`} style={styles.section}>
              {/* Section header */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>{section.emoji}</Text>
                <Text variant="semibold" size="sm" color="#1A1A1E">
                  {section.title}
                </Text>
                <View style={styles.sectionLine} />
              </View>

              {/* Floating grid */}
              <View style={styles.grid}>{renderGrid(section.data)}</View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="magnify-close"
              size={44}
              color="rgba(108,43,217,0.15)"
            />
            <Text variant="semibold" size="md" color="#9CA3AF" center>
              No results for "{searchQuery}"
            </Text>
            <Text size="sm" color="#C4C4CC" center>
              Try a different keyword
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Service;

const styles = {
  root: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  } as any,
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 14,
    paddingBottom: 48,
    gap: 20,
  } as any,

  // ── Section ───────────────────────────────────
  section: {
    gap: 12,
  } as any,
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  } as any,
  sectionEmoji: {
    fontSize: 12,
  } as any,
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E4E4EB",
  } as any,

  // ── Grid ──────────────────────────────────────
  grid: {
    gap: 14,
  } as any,
  row: {
    flexDirection: "row",
    gap: GAP,
  } as any,

  // ── Item ──────────────────────────────────────
  item: {
    width: ITEM_WIDTH,
    alignItems: "center",
    gap: 6,
  } as any,
  imageBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDEDF2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  } as any,
  image: {
    width: IMG_SIZE,
    height: IMG_SIZE,
  } as any,
  label: {
    textAlign: "center",
    fontSize: 10,
    letterSpacing: 0.1,
  } as any,

  // ── Empty ─────────────────────────────────────
  emptyState: {
    alignItems: "center",
    paddingVertical: 64,
    gap: 10,
  } as any,
};
