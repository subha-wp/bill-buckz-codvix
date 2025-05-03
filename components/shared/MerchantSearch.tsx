//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { TextInput, Card } from "react-native-paper";
import { Search, QrCode } from "lucide-react-native";
import { theme } from "@/constants/theme";
import QRScanner from "./QRScanner";

interface Merchant {
  id: string;
  name: string;
  category: string;
  rating: string;
  distance: string;
  image: string;
}

interface MerchantSearchProps {
  onSelect: (merchant: Merchant) => void;
  isDark?: boolean;
  initialMerchant?: Merchant | null;
}

export function MerchantSearch({
  onSelect,
  isDark,
  initialMerchant,
}: MerchantSearchProps) {
  const [query, setQuery] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    initialMerchant || null
  );
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (initialMerchant) {
      setSelectedMerchant(initialMerchant);
      setQuery(initialMerchant.name);
    }
  }, [initialMerchant]);

  useEffect(() => {
    const searchMerchants = async () => {
      if (query.length < 2) {
        setMerchants([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${
            process.env.EXPO_PUBLIC_REST_API
          }/api/expo/merchants/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        const merchantsArray = Array.isArray(data?.merchants)
          ? data.merchants
          : Array.isArray(data)
          ? data
          : [];
        setMerchants(merchantsArray);
      } catch (error) {
        console.error("Error searching merchants:", error);
        setMerchants([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchMerchants, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setQuery(merchant.name);
    setMerchants([]);
    onSelect(merchant);
  };

  const handleQRScan = async (data: string) => {
    try {
      setShowScanner(false);
      setLoading(true);

      // Parse QR data
      const qrData = JSON.parse(data);

      // Search merchant by phone number from QR
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/expo/merchants/search?q=${qrData.phone}`
      );
      const result = await response.json();

      if (result.merchants?.[0]) {
        handleSelect(result.merchants[0]);
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          value={query}
          onChangeText={setQuery}
          placeholder="Search for merchant"
          left={
            <TextInput.Icon
              icon={() => <Search size={20} color={theme.colors.primary} />}
            />
          }
          style={styles.input}
          outlineStyle={styles.inputOutline}
        />
        <TouchableOpacity
          style={[styles.scanButton, isDark && styles.scanButtonDark]}
          onPress={() => setShowScanner(true)}
        >
          <QrCode size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}

      {merchants.length > 0 && !selectedMerchant && (
        <Card style={[styles.resultsCard, isDark && styles.cardDark]}>
          {merchants.map((merchant) => (
            <TouchableOpacity
              key={merchant.id}
              style={styles.merchantItem}
              onPress={() => handleSelect(merchant)}
            >
              <Image
                source={
                  merchant.image
                    ? { uri: merchant.image }
                    : require("@/assets/images/adaptive-icon.png")
                }
                style={styles.merchantImage}
              />

              <View style={styles.merchantInfo}>
                <Text
                  style={[styles.merchantName, isDark && styles.textLight]}
                  numberOfLines={1}
                >
                  {merchant.name}
                </Text>
                <View style={styles.merchantDetails}>
                  <View style={styles.distanceContainer}>
                    <Text style={styles.distanceText}>{merchant.category}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      )}

      {selectedMerchant && (
        <Card style={[styles.selectedCard, isDark && styles.cardDark]}>
          <View style={styles.selectedMerchant}>
            <Image
              source={
                selectedMerchant.image
                  ? { uri: selectedMerchant.image }
                  : require("@/assets/images/adaptive-icon.png")
              }
              style={styles.selectedImage}
            />

            <View style={styles.selectedInfo}>
              <Text
                style={[styles.selectedName, isDark && styles.textLight]}
                numberOfLines={1}
              >
                {selectedMerchant.name}
              </Text>
              <Text style={styles.selectedCategory}>
                {selectedMerchant.category}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => {
                setSelectedMerchant(null);
                setQuery("");
                onSelect(null);
              }}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  inputOutline: {
    borderRadius: 8,
  },
  scanButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonDark: {
    backgroundColor: "#2A2A2A",
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
  },
  resultsCard: {
    marginTop: 8,
    borderRadius: 12,
    maxHeight: 300,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  merchantItem: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  merchantImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  merchantDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#6B6B6B",
    marginLeft: 4,
  },
  selectedCard: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  selectedMerchant: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  selectedImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  selectedCategory: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 16,
  },
  changeButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: theme.colors.primary,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
