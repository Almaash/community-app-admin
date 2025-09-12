import ProjectApiList from "@/app/api/ProjectApiList";
import api from "@/app/utils/axiosInterceptor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FormData = {
  cbaId: string;
  businessType: string;
  businessDescription: string;
  email: string;
  dob: string;
  bloodGroup: string;
  phoneNumber: string;
  fatherName: string;
  motherName: string;
  fatherOccupation: string;
  spouse: string;
};

export default function EditDetailsForm() {
  const { api_updateUser } = ProjectApiList();
  const { data } = useLocalSearchParams();
  const parsedData = data ? JSON.parse(data as string) : null;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      cbaId: parsedData?.cbaId || "",
      businessType: parsedData?.businessType || "",
      businessDescription: parsedData?.businessDescription || "",
      email: parsedData?.email || "",
      dob: parsedData?.dob || "",
      bloodGroup: parsedData?.bloodGroup || "",
      phoneNumber: parsedData?.phoneNumber || "",
      fatherName: parsedData?.fatherName || "",
      motherName: parsedData?.motherName || "",
      fatherOccupation: parsedData?.fatherOccupation || "",
      spouse: parsedData?.spouse || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await api.post(api_updateUser, data);
      console.log("✅ Updated Successfully", response.data);
      Alert.alert("Success", "Details updated successfully.");
      router.back();
    } catch (error: any) {
      console.log("❌ Error:", error?.response || error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const screenHeight = Dimensions.get("window").height;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const InputField = <TName extends keyof FormData>({
    label,
    name,
    multiline = false,
    keyboardType = "default",
  }: {
    label: string;
    name: TName;
    multiline?: boolean;
    keyboardType?: "default" | "email-address" | "phone-pad";
  }) => (
    <View className="mb-4">
      <Text className="text-sm text-gray-700 mb-1">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            className={`border border-gray-300 rounded-md px-4 py-2 text-gray-900 bg-white ${
              multiline ? "h-24 text-top" : ""
            }`}
            placeholder={label}
            value={value}
            onChangeText={onChange}
            multiline={multiline}
            keyboardType={keyboardType}
          />
        )}
      />
    </View>
  );

  return (
    <Animated.View
      style={{ transform: [{ translateY: slideAnim }], flex: 1 }}
      className="bg-white"
    >
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={30} color="#3a4045" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold pl-5">Edit Details</Text>
        </View>

        <ScrollView className="flex-1 px-4 pt-6">
          {/* Section 1 */}
          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <InputField label="CBA ID" name="cbaId" />
            <InputField label="Type Of Business" name="businessType" />
            <InputField label="Business Description" name="businessDescription" multiline />
            <InputField label="Email" name="email" keyboardType="email-address" />
          </View>

          {/* Section 2 */}
          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <InputField label="DOB" name="dob" />
            <InputField label="Blood Group" name="bloodGroup" />
            <InputField label="Phone Number" name="phoneNumber" keyboardType="phone-pad" />
          </View>

          {/* Section 3 */}
          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <InputField label="Father Name" name="fatherName" />
            <InputField label="Mother Name" name="motherName" />
            <InputField label="Father’s Occupation" name="fatherOccupation" />
            <InputField label="Spouse" name="spouse" />
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="bg-white border border-gray-200 rounded-xl mt-2 mx-3">
          <TouchableOpacity
            onPress={() => setShowConfirmModal(true)}
            className="bg-blue-600 px-4 py-4 rounded-md items-center"
          >
            <Text className="text-white font-semibold">Save</Text>
          </TouchableOpacity>
        </View>

        {/* Confirmation Modal */}
        <Modal
          transparent
          visible={showConfirmModal}
          animationType="fade"
          onRequestClose={() => setShowConfirmModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white p-6 rounded-xl w-[80%] shadow-lg">
              <Text className="text-lg font-semibold mb-8 text-center">
                Are you sure you want to submit?
              </Text>

              <View className="flex-row justify-between space-x-4 gap-8">
                <TouchableOpacity
                  onPress={() => setShowConfirmModal(false)}
                  className="flex-1 px-3 py-2 rounded-md items-center bg-gray-200"
                >
                  <Text className="text-black font-medium">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  className={`flex-1 px-4 py-2 rounded-md items-center ${
                    loading ? "bg-blue-400" : "bg-blue-600"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-semibold">Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Animated.View>
  );
}
