import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 18;
const CARD_WIDTH = SCREEN_WIDTH - GAP;

const BRAND = "#1B3710";
const BRAND_DEEP = "#122808";
const INK = "#141613";
const MUTED = "#6B7268";

type PromoCard = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Spine + accent color for this offer */
  tint: string;
  screen?: string;
};

const PROMOS: PromoCard[] = [
  {
    id: "refer",
    eyebrow: "EARN WITH DEPAY",
    title: "Invite friends, get rewarded",
    subtitle: "Earn a bonus for every friend who joins and transacts.",
    cta: "Refer now",
    icon: "gift-outline",
    tint: "#E8862E", // warm amber
    screen: "Refer",
  },
  {
    id: "data",
    eyebrow: "SAVE MORE",
    title: "Cheaper data, every network",
    subtitle: "MTN, Airtel, Glo & 9mobile at the best rates.",
    cta: "Buy data",
    icon: "wifi",
    tint: "#2E7CE8", // blue
    screen: "Airtime",
  },
  {
    id: "bills",
    eyebrow: "NEVER GO DARK",
    title: "Pay electricity in seconds",
    subtitle: "All DisCos supported. Token delivered instantly.",
    cta: "Pay a bill",
    icon: "lightning-bolt",
    tint: BRAND, // brand green stays on one card as an accent only
    screen: "Electricity",
  },
];

const Ad = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<PromoCard>>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isScrolling = useRef(false);
  const currentRef = useRef(0);

  const startAutoSlide = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      if (isScrolling.current) return;
      const next = (currentRef.current + 1) % PROMOS.length;
      flatListRef.current?.scrollToOffset({
        offset: next * CARD_WIDTH,
        animated: true,
      });
      currentRef.current = next;
      setCurrentIndex(next);
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const handleScrollBeginDrag = () => {
    isScrolling.current = true;
    stopAutoSlide();
  };

  const handleMomentumScrollEnd = (e: any) => {
    isScrolling.current = false;
    const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    currentRef.current = index;
    setCurrentIndex(index);
    setTimeout(startAutoSlide, 2000);
  };

  const handlePress = (promo: PromoCard) => {
    if (promo.screen) {
      navigation.navigate("StackNav", { screen: promo.screen });
    }
  };

  const renderItem = ({ item }: { item: PromoCard }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handlePress(item)}
        style={styles.card}
      >
        {/* COLORED SPINE */}
        <View style={[styles.spine, { backgroundColor: item.tint }]} />

        {/* ICON */}
        <View style={[styles.iconBox, { backgroundColor: `${item.tint}14` }]}>
          <MaterialCommunityIcons
            name={item.icon}
            size={24}
            color={item.tint}
          />
        </View>

        {/* TEXT */}
        <View style={styles.textBlock}>
          <Text style={[styles.eyebrow, { color: item.tint }]}>
            {item.eyebrow}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>
        </View>

        {/* DOTTED DIVIDER + CTA */}
        <View style={styles.ctaColumn}>
          <View style={styles.dottedDivider} />
          <View style={styles.ctaBlock}>
            <View style={[styles.ctaCircle, { backgroundColor: item.tint }]}>
              <MaterialCommunityIcons
                name="arrow-right"
                size={16}
                color="#FFFFFF"
              />
            </View>
            <Text style={[styles.ctaText, { color: item.tint }]}>
              {item.cta}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={PROMOS}
        renderItem={renderItem}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH}
        snapToAlignment="start"
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
      />

      <View style={styles.pagination}>
        {PROMOS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentIndex === i && [
                styles.dotActive,
                { backgroundColor: PROMOS[i].tint },
              ],
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Ad;

const styles = StyleSheet.create({
  itemContainer: {
    width: CARD_WIDTH,
  },
  card: {
    width: CARD_WIDTH - GAP,
    minHeight: 108,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECEFEA",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 14,
    overflow: "hidden",
    shadowColor: BRAND_DEEP,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  spine: {
    width: 5,
    alignSelf: "stretch",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 13,
  },
  textBlock: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 14,
  },
  eyebrow: {
    fontSize: 9.5,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 3,
  },
  title: {
    fontSize: 14.5,
    fontWeight: "800",
    color: INK,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 11.5,
    lineHeight: 15,
    color: MUTED,
  },
  ctaColumn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  dottedDivider: {
    width: 1,
    alignSelf: "stretch",
    marginVertical: 14,
    marginRight: 12,
    borderLeftWidth: 1,
    borderColor: "#DDE3DA",
    borderStyle: "dashed",
  },
  ctaBlock: {
    alignItems: "center",
    gap: 5,
    width: 58,
  },
  ctaCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 10.5,
    fontWeight: "700",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#DCDCE0",
  },
  dotActive: {
    width: 22,
    height: 6,
    borderRadius: 3,
  },
});
