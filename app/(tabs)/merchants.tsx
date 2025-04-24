// @ts-nocheck
"use client";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  MapPin,
  Star,
  ChevronRight,
  FileSliders as Sliders,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";
import { TextInput, Card, Chip, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { theme } from "@/constants/theme";

const LIMIT = 5; // Limit to 5 merchants per request for faster loading

export default function MerchantsScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [merchants, setMerchants] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const categories = ["All", "Restaurant", "Grocery", "Fashion", "Electronics"];

  // Function to fetch merchants from API
  const fetchMerchants = useCallback(
    async (pageNum = 1, refresh = false) => {
      if (!location) {
        setLoading(false);
        return;
      }

      try {
        const { latitude, longitude } = location.coords;
        let url = `${process.env.EXPO_PUBLIC_REST_API}/api/merchants/nearby?lat=${latitude}&lng=${longitude}&limit=${LIMIT}&page=${pageNum}`;
        if (searchQuery) {
          url += `&q=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch merchants");
        }

        const data = await response.json();

        if (refresh || pageNum === 1) {
          setMerchants(data.merchants);
        } else {
          setMerchants((prev) => [...prev, ...data.merchants]);
        }

        setHasMore(data.hasMore);
        return data.merchants;
      } catch (error) {
        console.error("Error fetching merchants:", error);
        return [];
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [location, searchQuery]
  );

  // Initial location and data fetch
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === "granted");

        if (status === "granted") {
          try {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            setLocation(location);
            // Initial fetch after getting location
            await fetchMerchants(1, true);
          } catch (error) {
            console.error("Error getting location:", error);
            setLocationError(
              "Could not get your current location. Please try again."
            );
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error requesting location permission:", error);
        setLocationError("Error accessing location services");
        setLoading(false);
      }
    })();
  }, []);

  // Refetch when search query changes
  useEffect(() => {
    if (location) {
      setPage(1);
      setLoading(true);
      fetchMerchants(1, true);
    }
  }, [searchQuery]);

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await fetchMerchants(1, true);
  }, [fetchMerchants]);

  // Load more merchants when reaching end of list
  const loadMore = useCallback(async () => {
    if (hasMore && !loadingMore && !loading) {
      setLoadingMore(true);
      const nextPage = page + 1;
      await fetchMerchants(nextPage);
      setPage(nextPage);
    }
  }, [hasMore, loadingMore, loading, page, fetchMerchants]);

  // Filter merchants by category if needed
  const filteredMerchants = merchants.filter((merchant) => {
    return selectedCategory === "All" || merchant.category === selectedCategory;
  });

  // Render footer for list (loading indicator when loading more)
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color="#0A84FF" />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            Nearby Merchants
          </Text>
        </View>

        {/* Search Input */}
        {/* <TextInput
          mode="outlined"
          placeholder="Search merchants"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          outlineStyle={styles.searchInputOutline}
          left={
            <TextInput.Icon
              icon={() => <Search size={20} color={theme.colors.primary} />}
            />
          }
        /> */}

        {/* Categories */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ height: 40 }}
          contentContainerStyle={styles.categoriesContainer}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item: category }) => (
            <Chip
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.selectedCategoryChip,
              ]}
              selectedColor={theme.colors.primary}
              textStyle={[
                styles.categoryChipText,
                selectedCategory === category &&
                  styles.selectedCategoryChipText,
              ]}
            >
              {category}
            </Chip>
          )}
        />

        {/* Location Status Card */}
        <Card style={[styles.statusCard, isDark && styles.cardDark]}>
          <View style={styles.locationStatusContainer}>
            <MapPin size={20} color={theme.colors.primary} />
            <Text
              style={[styles.locationStatusText, isDark && styles.textLight]}
            >
              {locationPermission === false
                ? "Location access is required to find nearby merchants"
                : locationError
                ? locationError
                : location
                ? `Using your location: ${location.coords.latitude.toFixed(
                    4
                  )}, ${location.coords.longitude.toFixed(4)}`
                : "Getting your location..."}
            </Text>
            {locationPermission === false && (
              <TouchableOpacity
                style={styles.locationPermissionButton}
                onPress={async () => {
                  const { status } =
                    await Location.requestForegroundPermissionsAsync();
                  setLocationPermission(status === "granted");
                  if (status === "granted") {
                    try {
                      const location = await Location.getCurrentPositionAsync(
                        {}
                      );
                      setLocation(location);
                      fetchMerchants(1, true);
                    } catch (error) {
                      setLocationError(
                        "Could not get your location. Please try again."
                      );
                    }
                  }
                }}
              >
                <Text style={styles.locationPermissionButtonText}>
                  Grant Access
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* Merchants List */}
        <View style={styles.merchantsContainer}>
          <View style={styles.merchantsHeader}>
            <Text style={[styles.merchantsTitle, isDark && styles.textLight]}>
              {filteredMerchants.length} Merchants Found
            </Text>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0A84FF" />
            </View>
          ) : filteredMerchants.length > 0 ? (
            <FlatList
              data={filteredMerchants}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item: merchant }) => (
                <Card
                  style={[styles.merchantCard, isDark && styles.cardDark]}
                  onPress={() => router.push(`/merchants/${merchant.id}`)}
                >
                  <View style={styles.merchantCardContent}>
                    <Image
                      source={
                        merchant.image
                          ? { uri: merchant.image }
                          : require("@/assets/images/adaptive-icon.png") // update path as needed
                      }
                      style={styles.merchantImage}
                    />

                    <View style={styles.merchantDetails}>
                      <Text
                        style={[
                          styles.merchantName,
                          isDark && styles.textLight,
                        ]}
                        numberOfLines={1}
                      >
                        {String(merchant.name)}
                      </Text>

                      <View style={styles.merchantCategory}>
                        <Text style={styles.merchantCategoryText}>
                          {String(merchant.category || "Uncategorized")}
                        </Text>
                      </View>

                      <View style={styles.merchantInfo}>
                        {merchant.rating != null && (
                          <View style={styles.merchantRating}>
                            <Star size={16} color="#FFB800" fill="#FFB800" />
                            <Text style={styles.merchantRatingText}>
                              {String(merchant.rating)}
                            </Text>
                          </View>
                        )}

                        <View style={styles.merchantDistance}>
                          <MapPin size={14} color="#6B6B6B" />
                          <Text style={styles.merchantDistanceText}>
                            {merchant.distance != null
                              ? `${merchant.distance.toFixed(1)} km`
                              : "N/A"}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <ChevronRight size={16} color="#AFAFAF" />
                  </View>
                </Card>
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#0A84FF"]}
                />
              }
              contentContainerStyle={styles.merchantsList}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <MapPin size={48} color={theme.colors.primary} />
              <Text style={styles.emptyStateText}>
                {locationPermission === false
                  ? "Location access is required to find nearby merchants"
                  : "No merchants found matching your search"}
              </Text>
            </View>
          )}
        </View>
      </View>
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
  mainContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
  },
  searchInput: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  searchInputOutline: {
    borderRadius: 8,
  },
  categoriesContainer: {
    padding: 4,
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: theme.colors.secondaryContainer,
    justifyContent: "center",
    height: 32,
  },
  selectedCategoryChip: {
    backgroundColor: theme.colors.primaryContainer,
  },
  categoryChipText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: theme.colors.primary,
  },
  selectedCategoryChipText: {
    color: theme.colors.primary,
  },
  statusCard: {
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: theme.colors.primaryContainer,
  },
  locationStatusContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  locationStatusText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 8,
    flex: 1,
  },
  locationPermissionButton: {
    backgroundColor: theme.colors.primaryContainer,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  locationPermissionButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#FFFFFF",
  },
  merchantsContainer: {
    // flex: 1,
  },
  merchantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  merchantsTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: theme.colors.secondary,
  },
  merchantsList: {
    paddingBottom: 20,
  },
  merchantCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.secondaryContainer,
    elevation: 2,
  },
  merchantCardContent: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  merchantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: theme.colors.primaryContainer,
  },
  merchantDetails: {
    flex: 1,
  },
  merchantName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  merchantCategory: {
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  merchantCategoryText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#6B6B6B",
  },
  merchantInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  merchantRating: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  merchantRatingText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#6B6B6B",
    marginLeft: 4,
  },
  merchantDistance: {
    flexDirection: "row",
    alignItems: "center",
  },
  merchantDistanceText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#6B6B6B",
    marginLeft: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingMoreContainer: {
    padding: 10,
    alignItems: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 12,
  },
  emptyStateText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#6B6B6B",
    marginTop: 12,
    textAlign: "center",
  },
  textLight: {
    color: "#FFFFFF",
  },
});
