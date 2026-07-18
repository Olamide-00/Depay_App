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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const H_PADDING = 16;
const COLUMNS = 4;
const GAP = 12;
const ITEM_WIDTH =
  (SCREEN_WIDTH - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
const BOX_SIZE = ITEM_WIDTH * 0.72;
const IMG_SIZE = BOX_SIZE * 0.55;

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";

const byCategory = (cat) => serviceData.filter((s) => s.category === cat);

const allSections = [
  { title: "Airtime", emoji: "📞", data: byCategory("airtime") },
  { title: "Data", emoji: "📶", data: byCategory("data") },
  { title: "Cable TV", emoji: "📺", data: byCategory("tv") },
  { title: "Electricity", emoji: "💡", data: byCategory("electricity") },
  { title: "Education", emoji: "🎓", data: byCategory("education") },
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

  const handlePress = (item: any) => {
    navigation.navigate("StackNav", {
      screen: item.screen,
      params: {
        serviceType: item.serviceType, // "airtime" | "data"
        network: item.network, // "mtn" | "airtel" | "glo" | "9mobile"
        biller: item.biller, // electricity DisCo identifier
      },
    });
  };

  const renderGrid = (services: any[]) => {
    const rows = [];
    for (let i = 0; i < services.length; i += COLUMNS) {
      const rowItems = services.slice(i, i + COLUMNS);
      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {rowItems.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => handlePress(item)}
              activeOpacity={0.65}
            >
              <View style={styles.imageBox}>
                {item.image ? (
                  <Image
                    source={item.image}
                    style={styles.image}
                    resizeMode="contain"
                  />
                ) : (
                  // Monogram fallback — replaced automatically once
                  // an `image` is added to the data entry
                  <View
                    style={[
                      styles.monogram,
                      { backgroundColor: `${item.color || BRAND}15` },
                    ]}
                  >
                    <Text
                      variant="bold"
                      style={[
                        styles.monogramText,
                        { color: item.color || BRAND },
                      ]}
                    >
                      {item.short || item.label.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                size="xs"
                color="#6B7268"
                style={styles.label}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
          {rowItems.length < COLUMNS &&
            [...Array(COLUMNS - rowItems.length)].map((_, j) => (
              <View key={`empty-${j}`} style={styles.item} />
            ))}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Services" />
      <SearchBar
        placeholder="Search services..."
        onSearch={setSearchQuery}
        showFilter={false}
      />

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
                <Text variant="semibold" size="sm" color="#141613">
                  {section.title}
                </Text>
                <View style={styles.sectionLine} />
                <Text size="xs" color="#A8AFA5">
                  {section.data.length}
                </Text>
              </View>

              {/* Floating grid */}
              <View style={styles.grid}>{renderGrid(section.data)}</View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons
                name="magnify-close"
                size={30}
                color={BRAND}
              />
            </View>
            <Text variant="semibold" size="md" color="#141613" center>
              No results for "{searchQuery}"
            </Text>
            <Text size="sm" color="#8A9086" center>
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
    backgroundColor: "#F7F9F6",
  } as any,
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 14,
    paddingBottom: 48,
    gap: 22,
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
    backgroundColor: "#E4EAE1",
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
    borderColor: "#E9EFE6",
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  } as any,
  image: {
    width: IMG_SIZE,
    height: IMG_SIZE,
  } as any,
  monogram: {
    width: IMG_SIZE + 8,
    height: IMG_SIZE + 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  } as any,
  monogramText: {
    fontSize: 13,
    letterSpacing: 0.3,
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
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  } as any,
};
