// @ts-nocheck
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Store,
  Upload,
  Camera,
  Receipt,
  CircleAlert as AlertCircle,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import {
  TextInput,
  Button,
  Card,
  SegmentedButtons,
  Portal,
  Dialog,
} from "react-native-paper";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { theme } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { MerchantSearch } from "@/components/shared/MerchantSearch";

export default function UploadInvoiceScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { user } = useAuth();

  const [invoiceType, setInvoiceType] = useState("merchant");
  const [amount, setAmount] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [error, setError] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const handleImagePick = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCameraLaunch = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      setError("Camera permission is required to take photos");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        setLoading(true);
        // Set the image URI for preview
        setSelectedImage(result.assets[0].uri);

        // The imageUrl will be used when the form is submitted
        setLoading(false);
      }
    } catch (error) {
      console.error("Camera error:", error);
      setError("Failed to take photo. Please try again.");
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "invoice.jpg",
    });
    formData.append("upload_preset", "invoices");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (!selectedImage) {
      setError("Please select an invoice image");
      return;
    }

    if (!amount || isNaN(Number.parseFloat(amount))) {
      setError("Please enter a valid amount");
      return;
    }

    if (invoiceType === "merchant" && !selectedMerchant) {
      setError("Please select a merchant");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(selectedImage);

      // Submit to your API
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/expo/invoices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            isMerchant: invoiceType === "merchant",
            merchantId: selectedMerchant?.id,
            amount: amount,
            imageUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload invoice");
      }

      setShowSuccessDialog(true);

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setShowSuccessDialog(false);
        router.replace("/invoices");
      }, 3000);
    } catch (err) {
      console.error("Error uploading invoice:", err);
      setError(err.message || "Failed to upload invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textLight]}>
          Upload Invoice
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice Type Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Invoice Type
          </Text>
          <SegmentedButtons
            value={invoiceType}
            onValueChange={(value) => {
              setInvoiceType(value);
              setSelectedMerchant(null);
            }}
            buttons={[
              {
                value: "merchant",
                label: "Merchant",
                icon: Store,
              },
              {
                value: "non-merchant",
                label: "Non-Merchant",
                icon: Receipt,
              },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* Merchant Search */}
        {invoiceType === "merchant" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
              Select Merchant
            </Text>
            <MerchantSearch onSelect={setSelectedMerchant} isDark={isDark} />
          </View>
        )}

        {/* Upload Methods */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Upload Method
          </Text>
          <View style={styles.uploadMethods}>
            <TouchableOpacity
              style={[styles.uploadMethod, isDark && styles.uploadMethodDark]}
              onPress={handleCameraLaunch}
            >
              <Camera size={24} color={theme.colors.primary} />
              <Text
                style={[styles.uploadMethodText, isDark && styles.textLight]}
              >
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadMethod, isDark && styles.uploadMethodDark]}
              onPress={handleImagePick}
            >
              <Upload size={24} color={theme.colors.primary} />
              <Text
                style={[styles.uploadMethodText, isDark && styles.textLight]}
              >
                Upload Image
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Image Preview */}
        {selectedImage && (
          <Card style={[styles.imagePreviewCard, isDark && styles.cardDark]}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={handleImagePick}
            >
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Invoice Amount
          </Text>
          <TextInput
            mode="outlined"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />
        </View>

        {/* Non-Merchant Note */}
        {invoiceType === "non-merchant" && (
          <Card style={[styles.noteCard, isDark && styles.cardDark]}>
            <View style={styles.noteContent}>
              <AlertCircle size={20} color="#FF9F0A" />
              <Text style={styles.noteText}>
                Note: Cashback will be processed after uploading 15 non-merchant
                invoices
              </Text>
            </View>
          </Card>
        )}

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={loading}
          disabled={
            !selectedImage ||
            !amount ||
            loading ||
            (invoiceType === "merchant" && !selectedMerchant)
          }
        >
          Upload Invoice
        </Button>
      </ScrollView>

      {/* Success Dialog */}
      <Portal>
        <Dialog
          visible={showSuccessDialog}
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
            <Text style={styles.successTitle}>Invoice Uploaded!</Text>
            <Text style={styles.successText}>
              Your invoice has been successfully uploaded
            </Text>
          </LinearGradient>
        </Dialog>
      </Portal>
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 12,
  },
  segmentedButtons: {
    backgroundColor: "#F0F0F0",
  },
  uploadMethods: {
    flexDirection: "row",
    gap: 12,
  },
  uploadMethod: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  uploadMethodDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#2A2A2A",
  },
  uploadMethodText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#0A0A0A",
  },
  imagePreviewCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  imagePreview: {
    width: "100%",
    height: 200,
  },
  changeImageButton: {
    padding: 12,
    alignItems: "center",
  },
  changeImageText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: theme.colors.primary,
  },
  input: {
    backgroundColor: "#FFFFFF",
  },
  inputOutline: {
    borderRadius: 8,
  },
  noteCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: "#FFF8E1",
  },
  noteContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  noteText: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#FF9F0A",
  },
  errorContainer: {
    backgroundColor: "#FFEEEE",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#FF3B30",
  },
  submitButton: {
    borderRadius: 8,
    marginBottom: 16,
    paddingVertical: 8,
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
  textLight: {
    color: "#FFFFFF",
  },
});
