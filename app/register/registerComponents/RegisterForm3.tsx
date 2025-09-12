import ProjectApiList from "@/app/api/ProjectApiList";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentScreen() {
  const { api_Register } = ProjectApiList();

  const [image, setImage] = useState<string | null>(null);
  const [step1Data, setStep1Data] = useState<any>(null);
  const [step2Data, setStep2Data] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const form1 = await AsyncStorage.getItem("registerForm1");
        const form2 = await AsyncStorage.getItem("registerForm2");

        if (form1) setStep1Data(JSON.parse(form1));
        if (form2) setStep2Data(JSON.parse(form2));
      } catch (error) {
        console.error("Failed to load form data:", error);
      }
    };

    loadFormData();
  }, []);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Allow access to your media library.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        let localUri = result.assets[0].uri;

        // Android-specific fix for proper file URI
        if (Platform.OS === "android" && !localUri.startsWith("file://")) {
          const fileInfo = await FileSystem.getInfoAsync(localUri);
          if (!fileInfo.exists) {
            Alert.alert("Error", "Selected file not found.");
            return;
          }
          localUri = fileInfo.uri;
        }

        setImage(localUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image.");
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert("Error", "Please upload payment screenshot.");
      return;
    }

    if (!step1Data || !step2Data) {
      Alert.alert("Error", "Form data is incomplete.");
      return;
    }

    Alert.alert(
      "Confirm Submission",
      "Are you sure you want to submit the payment proof?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            setLoading(true);
            const combinedData = {
              ...step1Data,
              ...step2Data,
              role: "business",
            };

            const formData = new FormData();

            Object.entries(combinedData).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                formData.append(key, String(value));
              }
            });

            formData.append("paymentScreenshot", {
              uri: image,
              name: "payment_screenshot.jpg",
              type: "image/jpeg",
            } as any);

            try {
              const response = await axios.post(api_Register, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });

              console.log("✅ Submission Success:", response.data);
              Alert.alert("Success", "Your application has been submitted.");
              router.push("/register/ApprovalPending");
            } catch (error: any) {
              console.error("❌ Submission Error:", error?.response || error);
              Alert.alert("Error", "Failed to submit form. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Submitting...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-10">
      {/* Logo */}
      <View className="items-center mb-5">
        <Image
          source={require("../../../assets/images/Logo.png")}
          style={{ width: 80, height: 80, resizeMode: "contain" }}
        />
      </View>

      {/* Title */}
      <Text className="text-center font-semibold text-2xl text-gray-800">
        PAYMENT OF <Text className="text-black font-bold">₹ 8000</Text>
      </Text>
      <Text className="text-center text-gray-500 text-lg mb-5">
        The Chitransh Business Association
      </Text>

      {/* QR + UPI Box */}
      <View className="border border-gray-300 rounded-lg p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <Image
            source={{
              uri: "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi_id_here",
            }}
            className="w-24 h-24"
          />
          <View>
            <Text className="text-sm text-gray-600 ml-2">OR</Text>
          </View>
          <View className="ml-3 flex-1">
            <View className="flex-row items-center justify-between border border-gray-300 rounded px-3 py-2 bg-gray-50">
              <Text className="text-sm text-gray-800">Princexxxxx702@oksbi</Text>
              <TouchableOpacity
                onPress={async () => {
                  await navigator.clipboard.writeText("Princexxxxx702@oksbi");
                  Alert.alert("Copied", "UPI ID copied to clipboard");
                }}
              >
                <MaterialIcons name="content-copy" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Upload Screenshot */}
      <Text className="text-sm text-gray-600 mb-1">Upload Screenshot of the Payment</Text>
      <TouchableOpacity
        onPress={pickImage}
        className="border border-dashed border-gray-400 rounded-lg h-32 items-center justify-center mb-6 relative"
      >
        {image ? (
          <>
            <Image source={{ uri: image }} className="w-full h-full rounded-lg" />
            <TouchableOpacity
              onPress={() => setImage(null)}
              className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
              style={{ zIndex: 10 }}
            >
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
          </>
        ) : (
          <View className="items-center">
            <Ionicons name="cloud-upload-outline" size={30} color="#9CA3AF" />
            <Text className="text-gray-500 mt-1">Upload Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-blue-600 rounded-lg py-4 items-center mt-4 mb-10"
        onPress={handleSubmit}
      >
        <Text className="text-white text-base font-semibold">Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
