// @ts-nocheck
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, User, Phone, Camera, Upload } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { TextInput, Button, Portal, Dialog } from "react-native-paper";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { theme } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";

export default function EditProfileScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const uploadToCloudinary = async (uri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "avatar.jpg",
    });
    formData.append("upload_preset", "invoice");

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

  const handleImagePick = async () => {
    setShowImageDialog(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        setLoading(true);
        const imageUrl = await uploadToCloudinary(result.assets[0].uri);
        setAvatar(imageUrl);
      } catch (err) {
        setError("Failed to upload image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCameraLaunch = async () => {
    setShowImageDialog(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setError("Camera permission is required to take photos");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        setLoading(true);
        const imageUrl = await uploadToCloudinary(result.assets[0].uri);
        setAvatar(imageUrl);
      } catch (err) {
        setError("Failed to upload image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/expo/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            avatar,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update user data in SecureStore
      const updatedUser = {
        ...user,
        name,
        avatar,
      };

      await SecureStore.setItemAsync("user", JSON.stringify(updatedUser));

      // Update global auth context
      await SecureStore.getItemAsync("user").then((storedUser) => {
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Update auth context with the latest user data
          useAuth().setUserFromLogin(parsedUser);
        }
      });

      router.back();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={isDark ? "#FFFFFF" : "#0A0A0A"} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDark && styles.textLight]}>
              Edit Profile
            </Text>
            <View style={styles.headerRight} />
          </View>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => setShowImageDialog(true)}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    isDark && styles.avatarPlaceholderDark,
                  ]}
                >
                  <User size={40} color={isDark ? "#FFFFFF" : "#0A0A0A"} />
                </View>
              )}
              <View style={styles.cameraButton}>
                <Camera size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, isDark && styles.textLight]}>
                Full Name
              </Text>
              <TextInput
                mode="outlined"
                value={name}
                onChangeText={setName}
                left={
                  <TextInput.Icon
                    icon={() => <User size={20} color={theme.colors.primary} />}
                  />
                }
                style={styles.input}
                placeholder="Enter your name"
                outlineStyle={styles.inputOutline}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, isDark && styles.textLight]}>
                Phone Number
              </Text>
              <TextInput
                mode="outlined"
                value={user?.phoneNumber}
                editable={false}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Phone size={20} color={theme.colors.primary} />
                    )}
                  />
                }
                style={[styles.input, styles.disabledInput]}
                outlineStyle={styles.inputOutline}
              />
              <Text style={styles.helperText}>
                Contact support to update phone number
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleUpdate}
              style={styles.button}
              loading={loading}
              disabled={
                !name ||
                loading ||
                (name === user?.name && avatar === user?.avatar)
              }
            >
              Update Profile
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Image Selection Dialog */}
      <Portal>
        <Dialog
          visible={showImageDialog}
          onDismiss={() => setShowImageDialog(false)}
          style={[styles.dialog, isDark && styles.dialogDark]}
        >
          <Dialog.Title
            style={[styles.dialogTitle, isDark && styles.textLight]}
          >
            Change Profile Photo
          </Dialog.Title>
          <Dialog.Content>
            <TouchableOpacity
              style={styles.dialogOption}
              onPress={handleCameraLaunch}
            >
              <Camera size={24} color={theme.colors.primary} />
              <Text
                style={[styles.dialogOptionText, isDark && styles.textLight]}
              >
                Take Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dialogOption}
              onPress={handleImagePick}
            >
              <Upload size={24} color={theme.colors.primary} />
              <Text
                style={[styles.dialogOptionText, isDark && styles.textLight]}
              >
                Choose from Library
              </Text>
            </TouchableOpacity>
          </Dialog.Content>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarButton: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderDark: {
    backgroundColor: "#2A2A2A",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    gap: 24,
  },
  errorContainer: {
    backgroundColor: "#FFEEEE",
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#FF3B30",
    textAlign: "center",
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
  },
  input: {
    backgroundColor: "#FFFFFF",
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    opacity: 0.8,
  },
  inputOutline: {
    borderRadius: 8,
  },
  helperText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B6B6B",
    marginTop: 4,
  },
  button: {
    height: 56,
    justifyContent: "center",
    borderRadius: 28,
  },
  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  dialogDark: {
    backgroundColor: "#1E1E1E",
  },
  dialogTitle: {
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
    color: "#0A0A0A",
  },
  dialogOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  dialogOptionText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
  },
  textLight: {
    color: "#FFFFFF",
  },
});
