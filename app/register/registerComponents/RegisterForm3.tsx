import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uploadApi from "@/app/utils/axiosInterceptorUpload";
import { useRouter } from "expo-router";
import ProjectApiList from "@/app/api/ProjectApiList";

const Register3 = () => {
  const { api_Register } = ProjectApiList();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<any>(null);
  const [step2Data, setStep2Data] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const form1 = await AsyncStorage.getItem("registerForm1");
      const form2 = await AsyncStorage.getItem("registerForm2");
      setStep1Data(form1 ? JSON.parse(form1) : null);
      setStep2Data(form2 ? JSON.parse(form2) : null);
    };
    loadData();
  }, []);

  const handleCreateAdmin = async () => {
    if (!step1Data || !step2Data) {
      Alert.alert("Error", "Form data is incomplete.");
      return;
    }

    Alert.alert(
      "Confirm",
      "Are you sure you want to create the admin account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: async () => {
            setLoading(true);

            try {
              const formData = new FormData();

              // Append all step1 fields
              Object.entries(step1Data).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                  formData.append(key, String(value));
                }
              });

              // Append ownerImage if exists
              if (step2Data?.ownerImage) {
                formData.append("ownerImage", {
                  uri: step2Data.ownerImage,
                  name: "owner_image.jpg",
                  type: "image/jpeg",
                } as any);
              }

              // Force role to admin
              formData.set("role", "admin");

              const response = await uploadApi.post(api_Register, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });

              console.log("✅ Admin Created:", response.data);
              Alert.alert("Success", "Admin account created successfully.");
              router.push("/login");
            } catch (error: any) {
              console.error("❌ Submission Error:", error?.response || error);
              Alert.alert("Error", "Failed to create admin account.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
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
          Create Admin
        </Text>

        <TouchableOpacity
          onPress={handleCreateAdmin}
          className="bg-green-600 w-full py-4 rounded-lg mt-2"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Create Admin
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register3;
