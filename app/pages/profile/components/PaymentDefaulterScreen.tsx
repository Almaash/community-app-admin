import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import logo from "@/assets/images/ava.png";

const PaymentDefaulterScreen = () => {
  const [comments, setComments] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setScreenshot(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200 ">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingHorizontal: 1 }}
        >
          <Ionicons name="arrow-back" size={30} color="#3a4045" />
        </TouchableOpacity>
        <View>
          <Text className="text-2xl font-semibold pl-5">Payment</Text>
        </View>
      </View>
      <ScrollView className="flex-1 bg-white px-4 py-6">
        {/* Logo */}
        <View className="items-center mb-4">
          <Image
            source={logo}
            className="h-16 w-16 mb-2"
            resizeMode="contain"
          />
          <Text className="text-lg font-bold text-center">
            PAYMENT OF DEFAULTER
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            The Chitransh Business Association
          </Text>
        </View>

        {/* QR and UPI ID */}
        <View className="flex-row border border-gray-300 rounded-xl overflow-hidden mb-4">
          <View className="flex-[0.7] items-start justify-center p-4 border-r border-gray-300 w-[20%]">
            <Image
              source={{
                uri: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi_id",
              }}
              className="h-32 w-32"
            />
          </View>
          <View className="flex-1 justify-center px-4">
            <Text className="text-xs text-gray-400 mb-1 text-center">OR</Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
              <Text className="text-sm text-gray-700 flex-1">
                Princexxxxx702@oksbi
              </Text>
              <TouchableOpacity>
                <Ionicons name="copy-outline" size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Comment Field */}
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Enter Comments
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 h-44 text-gray-800 text-sm mb-4"
          multiline
          placeholder="Add your comment..."
          value={comments}
          onChangeText={setComments}
        />

        {/* Upload Field */}
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Upload Screenshot of the Payment
        </Text>
        {!screenshot ? (
          <TouchableOpacity
            onPress={pickImage}
            className="flex-row items-center justify-between border border-gray-300 rounded-md px-3 py-3 mb-6"
          >
            <Text className="text-sm text-gray-600">Upload Photo</Text>
            <Ionicons name="cloud-upload-outline" size={20} color="#666" />
          </TouchableOpacity>
        ) : (
          <View className="mb-6">
            <Image
              source={{ uri: screenshot }}
              className="w-full h-64 rounded-lg mb-2"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setScreenshot(null)}
              className="self-end px-4 py-2 bg-red-500 rounded-md"
            >
              <Text className="text-white text-sm font-semibold">Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {/* Submit Button */}
      <TouchableOpacity className="bg-blue-600 py-4 rounded-lg items-cente mx-4 text-center">
        <Text className="text-white font-bold text-base text-center">
          Submit
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PaymentDefaulterScreen;
