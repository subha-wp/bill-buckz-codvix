// @ts-nocheck
import { useState } from "react";
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { Tabs } from "expo-router";
import {
  Wallet,
  Leaf,
  Store,
  Chrome as Home,
  QrCode,
} from "lucide-react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/context/ThemeContext";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Portal, Modal } from "react-native-paper";
import QRScanner from "@/components/shared/QRScanner";

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getTabBarIcon = (
    routeName: string,
    focused: boolean,
    color: string
  ) => {
    const iconSize = 22;
    const iconColor = focused
      ? theme.colors.primary
      : isDark
      ? "#AFAFAF"
      : "#6B6B6B";

    switch (routeName) {
      case "index":
        return <Home size={iconSize} color={iconColor} />;
      case "nearby":
        return <Store size={iconSize} color={iconColor} />;
      case "green-impact":
        return <Leaf size={iconSize} color={iconColor} />;
      case "wallet":
        return <Wallet size={iconSize} color={iconColor} />;
      default:
        return null;
    }
  };

  const handleQRScan = async (data: string) => {
    try {
      setIsLoading(true);
      setShowScanner(false);

      // Parse QR data
      const qrData = JSON.parse(data);

      // Search merchant by phone number from QR
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/expo/merchants/search?q=${qrData.phone}`
      );
      const result = await response.json();

      if (result.merchants?.[0]) {
        // Navigate to upload invoice with merchant data
        router.push({
          pathname: "/upload-invoice",
          params: { merchantData: JSON.stringify(result.merchants[0]) },
        });
      } else {
        // Navigate to upload invoice without merchant data
        router.push("/upload-invoice");
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      router.push("/upload-invoice");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color }) =>
            getTabBarIcon(route.name, focused, color),
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: isDark ? "#AFAFAF" : "#6B6B6B",
          tabBarStyle: {
            height: 80,
            paddingTop: 8,
            paddingBottom: Platform.OS === "ios" ? 24 : 8,
            backgroundColor: isDark ? "#121212" : "#FFFFFF",
            borderTopColor: isDark ? "#2A2A2A" : "#E5E5E5",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          tabBarLabelStyle: {
            fontFamily: "Inter-Medium",
            fontSize: 12,
          },
          tabBarBackground: () =>
            Platform.OS === "ios" ? (
              <BlurView
                intensity={isDark ? 40 : 60}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            ) : null,
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="nearby"
          options={{
            title: "Products",
          }}
        />

        {/* Scan Button */}
        <Tabs.Screen
          name="scan"
          options={{
            title: "",
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                style={styles.scanButton}
                onPress={() => setShowScanner(true)}
              >
                <View
                  style={[
                    styles.scanButtonInner,
                    isDark && styles.scanButtonInnerDark,
                  ]}
                >
                  <QrCode size={24} color={theme.colors.primary} />
                </View>
              </TouchableOpacity>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setShowScanner(true);
            },
          }}
        />

        <Tabs.Screen
          name="green-impact"
          options={{
            title: "Green",
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Wallet",
          }}
        />
      </Tabs>

      <Portal>
        <Modal
          visible={showScanner}
          onDismiss={() => setShowScanner(false)}
          contentContainerStyle={{ flex: 1 }}
        >
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowScanner(false)}
          />
        </Modal>

        {/* Loading Modal */}
        <Modal
          visible={isLoading}
          dismissable={false}
          contentContainerStyle={styles.loadingModalContent}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              style={[styles.loadingText, isDark && styles.loadingTextDark]}
            >
              Processing QR code...
            </Text>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanButtonInnerDark: {
    backgroundColor: "#2A2A2A",
  },
  loadingModalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingContainer: {
    padding: 24,
    borderRadius: 12,
    backgroundColor:
      Platform.OS === "ios" ? "rgba(255, 255, 255, 0.8)" : "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#000000",
  },
  loadingTextDark: {
    color: "#FFFFFF",
  },
});
