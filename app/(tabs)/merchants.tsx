// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
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
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { mockMerchants } from "@/data/mockData";
import * as Location from "expo-location";

const MAP_HEIGHT = 200;

export default function MerchantsScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const categories = ["All", "Restaurant", "Grocery", "Fashion", "Electronics"];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      // Simulate API call to fetch data
      setTimeout(() => {
        setMerchants(mockMerchants);
        setLoading(false);
      }, 1000);
    })();
  }, []);

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch = merchant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || merchant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            Nearby Merchants
          </Text>
          <TouchableOpacity style={styles.filterButton}>
            <Sliders size={20} color={isDark ? "#FFFFFF" : "#0A0A0A"} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <TextInput
          mode="outlined"
          placeholder="Search merchants"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          outlineStyle={styles.searchInputOutline}
          left={
            <TextInput.Icon icon={() => <Search size={20} color="#0A84FF" />} />
          }
        />

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.selectedCategoryChip,
              ]}
              selectedColor="#0A84FF"
              textStyle={[
                styles.categoryChipText,
                selectedCategory === category &&
                  styles.selectedCategoryChipText,
              ]}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>

        {/* Map View */}
        <Card style={[styles.mapCard, isDark && styles.cardDark]}>
          {locationPermission === false ? (
            <View style={styles.locationPermissionContainer}>
              <MapPin size={32} color="#AFAFAF" />
              <Text
                style={[
                  styles.locationPermissionText,
                  isDark && styles.textLight,
                ]}
              >
                Location access is required to show nearby merchants
              </Text>
              <TouchableOpacity
                style={styles.locationPermissionButton}
                onPress={async () => {
                  const { status } =
                    await Location.requestForegroundPermissionsAsync();
                  setLocationPermission(status === "granted");
                }}
              >
                <Text style={styles.locationPermissionButtonText}>
                  Grant Location Access
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={mapRegion}
              region={mapRegion}
            >
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  pinColor="#0A84FF"
                  title="Your Location"
                />
              )}

              {filteredMerchants.map((merchant) => (
                <Marker
                  key={merchant.id}
                  coordinate={{
                    latitude: merchant.latitude,
                    longitude: merchant.longitude,
                  }}
                  title={merchant.name}
                  description={merchant.category}
                />
              ))}
            </MapView>
          )}
        </Card>

        {/* Merchants List */}
        <View style={styles.merchantsContainer}>
          <View style={styles.merchantsHeader}>
            <Text style={[styles.merchantsTitle, isDark && styles.textLight]}>
              {filteredMerchants.length} Merchants Found
            </Text>
            <TouchableOpacity>
              <Text style={styles.sortText}>Sort by Distance</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0A84FF" />
            </View>
          ) : filteredMerchants.length > 0 ? (
            <View style={styles.merchantsList}>
              {filteredMerchants.map((merchant) => (
                <Card
                  key={merchant.id}
                  style={[styles.merchantCard, isDark && styles.cardDark]}
                  onPress={() => router.push(`/merchants/${merchant.id}`)}
                >
                  <View style={styles.merchantCardContent}>
                    <Image
                      source={{ uri: merchant.image }}
                      style={styles.merchantImage}
                    />
                    <View style={styles.merchantDetails}>
                      <Text
                        style={[
                          styles.merchantName,
                          isDark && styles.textLight,
                        ]}
                      >
                        {merchant.name}
                      </Text>
                      <View style={styles.merchantCategory}>
                        <Text style={styles.merchantCategoryText}>
                          {merchant.category}
                        </Text>
                      </View>
                      <View style={styles.merchantInfo}>
                        <View style={styles.merchantRating}>
                          <Star size={16} color="#FFB800" fill="#FFB800" />
                          <Text style={styles.merchantRatingText}>
                            {merchant.rating}
                          </Text>
                        </View>
                        <View style={styles.merchantDistance}>
                          <MapPin size={14} color="#6B6B6B" />
                          <Text style={styles.merchantDistanceText}>
                            {merchant.distance}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <ChevronRight size={16} color="#AFAFAF" />
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <MapPin size={48} color="#AFAFAF" />
              <Text style={styles.emptyStateText}>
                No merchants found matching your search
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  searchInputOutline: {
    borderRadius: 8,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: "#F0F0F0",
  },
  selectedCategoryChip: {
    backgroundColor: "#EBF6FF",
  },
  categoryChipText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#6B6B6B",
  },
  selectedCategoryChipText: {
    color: "#0A84FF",
  },
  mapCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  map: {
    height: MAP_HEIGHT,
  },
  locationPermissionContainer: {
    height: MAP_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  locationPermissionText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#0A0A0A",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  locationPermissionButton: {
    backgroundColor: "#0A84FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  locationPermissionButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#FFFFFF",
  },
  merchantsContainer: {
    marginBottom: 24,
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
    color: "#0A0A0A",
  },
  sortText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#0A84FF",
  },
  merchantsList: {},
  merchantCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
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
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#F0F0F0",
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
