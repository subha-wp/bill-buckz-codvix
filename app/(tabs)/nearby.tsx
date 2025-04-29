// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";
import { FlashList } from "@shopify/flash-list";
import { Card, Chip, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MapPin,
  Search,
  Store,
  IndianRupee,
  Navigation,
} from "lucide-react-native";
import { theme } from "@/constants/theme";

interface Product {
  id: string;
  name: string;
  price: number;
  merchantName: string;
  distance: number;
  images: string[];
  category: string;
  description: string;
}

interface PaginationInfo {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function NearbyProductsScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  const categories = [
    "All",
    "General",
    "Electronics",
    "Clothing",
    "Food",
    "Beverages",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Sports & Fitness",
    "Books",
    "Toys & Games",
    "Automotive",
    "Health & Wellness",
    "Office Supplies",
    "Pet Supplies",
    "Tools & Home Improvement",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load cached coordinates and fetch products on mount
  useEffect(() => {
    const initializeScreen = async () => {
      try {
        const cachedCoords = await AsyncStorage.getItem("lastKnownLocation");
        if (cachedCoords) {
          const coords = JSON.parse(cachedCoords);
          setCoordinates(coords);
          fetchProducts(1, true, coords);
        }
        // Check location permission and get current location
        checkLocationPermission();
      } catch (error) {
        console.error("Error initializing screen:", error);
        checkLocationPermission(); // Fallback to getting current location
      }
    };

    initializeScreen();
  }, []);

  useEffect(() => {
    if (coordinates) {
      fetchProducts(1, true);
    }
  }, [searchQuery, selectedCategory]);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const newCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCoordinates(newCoords);
        // Cache the coordinates
        await AsyncStorage.setItem(
          "lastKnownLocation",
          JSON.stringify(newCoords)
        );
        // Only fetch products if we didn't have coordinates before
        if (!coordinates) {
          fetchProducts(1, true, newCoords);
        }
      } else {
        setLocationError("Location permission not granted");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationError("Could not get location");
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentLocation = async () => {
    setUpdatingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const newCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCoordinates(newCoords);
        await AsyncStorage.setItem(
          "lastKnownLocation",
          JSON.stringify(newCoords)
        );
        fetchProducts(1, true, newCoords);
      }
    } catch (error) {
      console.error("Error updating location:", error);
    } finally {
      setUpdatingLocation(false);
    }
  };

  const fetchProducts = async (
    page: number = 1,
    refresh: boolean = false,
    coords: Coordinates | null = null
  ) => {
    if (!coords && !coordinates) return;

    const coordsToUse = coords || coordinates;

    try {
      const { latitude, longitude } = coordsToUse;
      let url = `${process.env.EXPO_PUBLIC_PRODUCTS_API}/api/products/nearby?lat=${latitude}&lng=${longitude}&radius=15&page=${page}&limit=10`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      if (selectedCategory !== "All") {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (refresh || page === 1) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }

      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts(1, true);
  };

  const handleLoadMore = () => {
    if (
      !loadingMore &&
      pagination.page < pagination.pages &&
      products.length > 0
    ) {
      setLoadingMore(true);
      fetchProducts(pagination.page + 1);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={[styles.productCard, isDark && styles.cardDark]}>
      <View style={styles.productContent}>
        <Image
          source={
            item.images?.[0]
              ? { uri: item.images[0] }
              : require("@/assets/images/adaptive-icon.png")
          }
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <Text
            style={[styles.productName, isDark && styles.textLight]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.merchantName} numberOfLines={1}>
            {item.merchantName}
          </Text>
          <View style={styles.priceContainer}>
            <IndianRupee size={16} color={theme.colors.primary} />
            <Text style={[styles.productPrice, isDark && styles.textLight]}>
              {item.price.toLocaleString("en-IN")}
            </Text>
          </View>
          <View style={styles.distanceContainer}>
            <MapPin size={14} color="#6B6B6B" />
            <Text style={styles.distanceText}>
              {item.distance.toFixed(1)} km away
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.textLight]}>
          Nearby Products
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.locationButton,
              updatingLocation && styles.locationButtonUpdating,
            ]}
            onPress={updateCurrentLocation}
            disabled={updatingLocation}
          >
            <Navigation size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.storeButton}
            onPress={() => router.push("/merchants")}
          >
            <Store size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        mode="outlined"
        placeholder="Search products"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        outlineStyle={styles.searchInputOutline}
        left={
          <TextInput.Icon
            icon={() => <Search size={20} color={theme.colors.primary} />}
          />
        }
      />

      <View style={styles.categoriesContainer}>
        <FlashList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.selectedCategoryChip,
              ]}
              textStyle={styles.categoryChipText}
            >
              {item}
            </Chip>
          )}
          estimatedItemSize={100}
        />
      </View>

      {locationError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={checkLocationPermission}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : products.length > 0 ? (
        <FlashList
          data={products}
          renderItem={renderProduct}
          estimatedItemSize={200}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Store size={48} color="#AFAFAF" />
          <Text style={styles.emptyText}>No products found nearby</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  locationButtonUpdating: {
    opacity: 0.7,
  },
  storeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  searchInputOutline: {
    borderRadius: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: theme.colors.secondaryContainer,
  },
  selectedCategoryChip: {
    backgroundColor: theme.colors.primaryContainer,
  },
  categoryChipText: {
    color: theme.colors.primary,
  },
  productCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  productContent: {
    flexDirection: "row",
    padding: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  merchantName: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#0A0A0A",
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#6B6B6B",
    marginTop: 12,
  },
  listContent: {
    paddingVertical: 8,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  textLight: {
    color: "#FFFFFF",
  },
});
