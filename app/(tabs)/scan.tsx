// @ts-nocheck
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import {
  Camera,
  Camera as FlipCamera,
  ScanLine,
  Upload,
  ChevronLeft,
} from "lucide-react-native";
import { Button, ActivityIndicator, Portal, Dialog } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/context/ThemeContext";

export default function ScanScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const flipCamera = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCameraType((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (cameraRef.current) {
      setScanning(true);

      try {
        // Simulate taking picture and processing
        setTimeout(() => {
          setScanning(false);
          setProcessing(true);

          // Simulate processing completion
          setTimeout(() => {
            setProcessing(false);
            setShowSuccess(true);

            // Navigate after showing success for a moment
            setTimeout(() => {
              setShowSuccess(false);
              router.push("/bill-details");
            }, 1500);
          }, 2000);
        }, 1000);
      } catch (error) {
        console.error("Error taking picture:", error);
        setScanning(false);
      }
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A84FF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#AFAFAF" />
          <Text style={[styles.permissionTitle, isDark && styles.textLight]}>
            Camera Access Required
          </Text>
          <Text style={styles.permissionText}>
            We need camera access to scan your bills and receipts for cashback
            processing.
          </Text>
          <Button
            mode="contained"
            onPress={requestPermission}
            style={styles.permissionButton}
          >
            Grant Camera Permission
          </Button>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.cameraContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Camera */}
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
          enableZoomGesture
        >
          {/* Frame Overlay */}
          <View style={styles.frameOverlay}>
            <View style={styles.frame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />

              {scanning && (
                <View style={styles.scanLineContainer}>
                  <ScanLine size={240} color="#0A84FF" />
                </View>
              )}

              <Text style={styles.frameText}>
                Position the bill within the frame
              </Text>
            </View>
          </View>

          {/* Camera Controls */}
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
              <FlipCamera size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={scanning || processing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton}>
              <Upload size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </CameraView>

        {/* Processing Overlay */}
        {processing && (
          <View style={styles.processingOverlay}>
            <View style={styles.processingCard}>
              <ActivityIndicator size="large" color="#0A84FF" />
              <Text style={styles.processingText}>Processing Bill</Text>
              <Text style={styles.processingSubtext}>
                Hang tight while we analyze your bill
              </Text>
            </View>
          </View>
        )}

        {/* Success Dialog */}
        <Portal>
          <Dialog
            visible={showSuccess}
            dismissable={false}
            style={styles.successDialog}
          >
            <LinearGradient
              colors={["#0A84FF", "#30D158"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.successGradient}
            >
              <View style={styles.successIconContainer}>
                <Text style={styles.successIcon}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Bill Processed!</Text>
              <Text style={styles.successText}>
                We've successfully captured your bill
              </Text>
            </LinearGradient>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  frameOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  frame: {
    width: 280,
    height: 380,
    position: "relative",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#FFFFFF",
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#FFFFFF",
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#FFFFFF",
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "#FFFFFF",
  },
  frameText: {
    color: "#FFFFFF",
    fontFamily: "Inter-Medium",
    fontSize: 16,
    marginBottom: -40,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
  },
  scanLineContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 48 : 24,
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "80%",
  },
  processingText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginTop: 16,
    marginBottom: 8,
  },
  processingSubtext: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
  },
  successDialog: {
    backgroundColor: "transparent",
    elevation: 0,
  },
  successGradient: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 24,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successIcon: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: "#FFFFFF",
  },
  successTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  successText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#0A0A0A",
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#6B6B6B",
    textAlign: "center",
    marginBottom: 24,
  },
  permissionButton: {
    borderRadius: 28,
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 16,
    padding: 8,
  },
  cancelText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A84FF",
  },
  textLight: {
    color: "#FFFFFF",
  },
});
