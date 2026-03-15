import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GAP = 18;
const IMAGE_WIDTH = SCREEN_WIDTH - GAP;

const adImages = [
  require("../../../../../assets/images/ad.png"),
  require("../../../../../assets/images/ad3.png"),
  require("../../../../../assets/images/ad.png"),
];

const Ad = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const isScrolling = useRef(false);
  const currentRef = useRef(0);

  const startAutoSlide = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      if (isScrolling.current) return;
      const next = (currentRef.current + 1) % adImages.length;
      flatListRef.current?.scrollToOffset({
        offset: next * IMAGE_WIDTH, // ← snap by IMAGE_WIDTH not SCREEN_WIDTH
        animated: true,
      });
      currentRef.current = next;
      setCurrentIndex(next);
    }, 3000);
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
    const index = Math.round(e.nativeEvent.contentOffset.x / IMAGE_WIDTH);
    currentRef.current = index;
    setCurrentIndex(index);
    setTimeout(startAutoSlide, 2000);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.92} style={styles.itemContainer}>
      <Image source={item} style={styles.adImage} resizeMode="cover" />
      <View style={styles.imageOverlay} />
      <View style={styles.promoBadge}>
        <View style={styles.promoDot} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={adImages}
        renderItem={renderItem}
        horizontal
        pagingEnabled={false} // ← off, we handle snapping manually
        snapToInterval={IMAGE_WIDTH} // ← snap exactly per image
        snapToAlignment="start"
        disableIntervalMomentum // ← one card per swipe
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        keyExtractor={(_, i) => i.toString()}
      />

      <View style={styles.pagination}>
        {adImages.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, currentIndex === i && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

export default Ad;

const styles = StyleSheet.create({
  container: {},

  itemContainer: {
    width: IMAGE_WIDTH, // item = image width
  },
  adImage: {
    width: IMAGE_WIDTH - GAP, // image = item - right gap → right border radius shows
    height: 110,
    borderRadius: 16,
    backgroundColor: "#EDE1FF",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: IMAGE_WIDTH - GAP,
    height: 50,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  promoBadge: {
    position: "absolute",
    top: 10,
    right: GAP + 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  promoDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#22c55e",
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
    backgroundColor: "#7B3FE4",
  },
});
