"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { ArrowLeft, AlertCircle } from "lucide-react-native";
import { theme } from "@/constants/theme";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation for scanner line
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const scanAreaSize = Math.min(Dimensions.get("window").width * 0.7, 280);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (err) {
        setError("Failed to request camera permission");
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    // Create scanning animation
    const startAnimation = () => {
      scanLineAnim.setValue(0);
      Animated.loop(
        Animated.timing(scanLineAnim, {
          toValue: scanAreaSize,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    };

    if (hasPermission && !scanned && !loading) {
      startAnimation();
    } else {
      scanLineAnim.stopAnimation();
    }

    return () => {
      scanLineAnim.stopAnimation();
    };
  }, [hasPermission, scanned, loading, scanLineAnim, scanAreaSize]);

  const handleBarcodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);

    try {
      // Pass data directly to parent component
      onScan(data);
    } catch (err) {
      console.error("QR scan error:", err);
      setError("Failed to process QR code");
      setScanned(false);
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setScanned(false);
    setError(null);
    setLoading(false);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.statusText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.centered}>
        <AlertCircle size={48} color={theme.colors.error || "#DC2626"} />
        <Text style={styles.errorText}>Camera access denied</Text>
        <Text style={styles.helpText}>
          Please enable camera permissions in your device settings to scan QR
          codes.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Camera View */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
      />

      {/* Overlay with transparent scan area */}
      <View style={styles.overlay}>
        <View style={styles.scanAreaRow}>
          <View style={styles.overlaySection} />
          <View
            style={[
              styles.scanArea,
              { height: scanAreaSize, width: scanAreaSize },
            ]}
          >
            {/* Scan area corners */}
            <View style={[styles.corner, styles.topLeftCorner]} />
            <View style={[styles.corner, styles.topRightCorner]} />
            <View style={[styles.corner, styles.bottomLeftCorner]} />
            <View style={[styles.corner, styles.bottomRightCorner]} />

            {/* Animated scan line */}
            {!scanned && !loading && !error && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanLineAnim }],
                  },
                ]}
              />
            )}
          </View>
          <View style={styles.overlaySection} />
        </View>
        <View style={styles.overlaySection} />
      </View>

      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Merchant QR Code</Text>
        <View style={styles.placeholderButton} />
      </SafeAreaView>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Position the QR code within the frame to scan
        </Text>
      </View>

      {/* Loading state */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Processing QR code...</Text>
        </View>
      )}

      {/* Error state */}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={32} color={theme.colors.error || "#DC2626"} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Scan again button */}
      {scanned && !loading && !error && (
        <View style={styles.scanAgainContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
  },
  closeButton: {
    padding: 8,
  },
  placeholderButton: {
    width: 40,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  scanAreaRow: {
    flexDirection: "row",
    height: "50%",
    width: "100%",
    alignItems: "center",
  },
  overlaySection: {
    flex: 1,
  },
  scanArea: {
    position: "relative",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: theme.colors.primary,
  },
  topLeftCorner: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 12,
  },
  topRightCorner: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 12,
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 12,
  },
  bottomRightCorner: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: "absolute",
    height: 2,
    width: "100%",
    backgroundColor: theme.colors.primary,
    opacity: 0.8,
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionsText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter-Medium",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  errorContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginTop: 8,
    marginBottom: 16,
    textAlign: "center",
  },
  statusText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#333333",
  },
  helpText: {
    color: "#666666",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  scanAgainContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
