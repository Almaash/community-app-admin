import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Register2 = () => {
  const router = useRouter();
  const [ownerImage, setOwnerImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setOwnerImage(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!ownerImage) {
      Alert.alert("Error", "Please upload an owner image.");
      return;
    }

    const step2Data = { ownerImage };

    try {
      await AsyncStorage.setItem("registerForm2", JSON.stringify(step2Data));
      router.push("/register/register3");
    } catch (error) {
      console.error("Failed to save step 2 data:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 30,
        }}
      >
        <Text className="text-2xl font-bold text-center mb-8 text-gray-800">
       Upload Owner Image
        </Text>

        {ownerImage ? (
          <Image
            source={{ uri: ownerImage }}
            className="w-48 h-48 rounded-full mb-6"
          />
        ) : (
          <TouchableOpacity
            onPress={pickImage}
            className="w-48 h-48 bg-gray-200 rounded-full items-center justify-center mb-6"
          >
            <Text className="text-gray-600 text-sm">Select Owner Image</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleNext}
          className="bg-blue-600 w-full py-3 rounded-lg mt-2"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Next
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register2;
