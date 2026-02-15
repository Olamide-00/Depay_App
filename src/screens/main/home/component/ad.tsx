import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { width: screenWidth } = Dimensions.get("window");

const adImages = [
  require("../../../../../assets/images/ad.png"),
  require("../../../../../assets/images/ad3.png"),
  require("../../../../../assets/images/ad.png"),
];

const Ad = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const timerRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Fixed: Calculate item width with proper spacing
  const ITEM_SPACING = wp("5%"); // Space between items
  const CONTAINER_PADDING = wp("5%"); // Padding on sides
  const itemWidth = screenWidth - CONTAINER_PADDING * 2;

  // Fixed auto slide function
  const startAutoSlide = () => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      // Don't auto slide if user is currently scrolling
      if (isScrollingRef.current) return;

      const nextIndex = (currentIndex + 1) % adImages.length;

      // Fixed: Use scrollToOffset for more reliable scrolling
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * itemWidth,
        animated: true,
      });
      setCurrentIndex(nextIndex);
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
  }, [currentIndex]);

  // Fixed: Add onScrollBeginDrag to track when user starts scrolling
  const handleScrollBeginDrag = () => {
    isScrollingRef.current = true;
    stopAutoSlide();
  };

  // Fixed: Add onScrollEndDrag to track when user stops scrolling
  const handleScrollEndDrag = () => {
    isScrollingRef.current = false;
    setTimeout(() => {
      startAutoSlide();
    }, 2000);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        // Fixed: Use itemWidth instead of screenWidth
        const index = Math.round(offsetX / itemWidth);
        if (index >= 0 && index < adImages.length && index !== currentIndex) {
          setCurrentIndex(index);
        }
      },
    },
  );

  const handleMomentumScrollEnd = () => {
    isScrollingRef.current = false;
    // Fixed: Reduced timeout to 2 seconds for better UX
    setTimeout(() => startAutoSlide(), 2000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => console.log("Ad clicked")}
      >
        <Image source={item} style={styles.adImage} resizeMode="cover" />
      </TouchableOpacity>
    </View>
  );

  // Fixed: Simplified pagination without animations that might conflict
  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {adImages.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, currentIndex === i && styles.activeDot]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={adImages}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          // Fixed: Add these props for better performance
          decelerationRate="fast"
          snapToInterval={itemWidth}
          snapToAlignment="center"
          contentContainerStyle={styles.flatListContent}
          keyExtractor={(_, index) => index.toString()}
        />
        <Pagination />
      </View>
    </View>
  );
};

export default Ad;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp("5%"),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carouselContainer: {
    position: "relative",
  },
  itemContainer: {
    width: screenWidth - wp("5%") * 2,
    paddingHorizontal: 0,
  },
  adImage: {
    width: "90%",
    height: 100,
    borderRadius: 8,
  },
  flatListContent: {
    paddingHorizontal: 0,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("1%"),
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FF6B35",
    width: 20,
  },
});
