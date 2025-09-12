import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams(); // profile id
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with Back Button */}
      <View className="flex-row items-center p-4 pt-14 border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          {/* <Text className="ml-1 text-base text-black">Back</Text> */}
        </TouchableOpacity>
        {/* <Text className="text-lg font-bold flex-1 text-center">
          Profile Details
        </Text> */}
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {/* Profile Section */}
        <View className="items-center mb-4">
          <View className="w-20 h-20 bg-gray-300 rounded-full mb-2" />
          <Text className="text-xl font-bold">PROFILE NAME</Text>
          <Text className="text-gray-600">Business Name | City | State</Text>
          <Text className="text-blue-600 font-semibold mt-1">
            2,900 Points • 4 Referral
          </Text>
        </View>

        {/* Payment Details */}
        <Text className="text-lg font-semibold mb-2">Payment Details</Text>
        <View className="h-40 bg-gray-200 rounded-lg mb-6" />

        {/* Mark as Verified */}
        <TouchableOpacity
          onPress={() => setShowConfirm(true)}
          className="bg-blue-600 py-3 rounded-lg"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Mark as Verified
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={showConfirm}
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white rounded-xl w-full p-6">
            <View className="flex-row justify-between items-start mb-4">
              <Text className="text-lg font-bold text-blue-600">
                Are you sure?
              </Text>
              <TouchableOpacity onPress={() => setShowConfirm(false)}>
                <Ionicons name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-4">
              Profile will be verified for the followings
            </Text>

            {/* Points & Fees */}
            <View className="flex-row justify-between mb-6">
              <View>
                <Text className="text-gray-500">Points</Text>
                <Text className="text-lg font-bold text-blue-600">XX</Text>
              </View>
              <View>
                <Text className="text-gray-500">Event Fees</Text>
                <Text className="text-lg font-bold text-blue-600">X,XX</Text>
              </View>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              onPress={() => {
                setShowConfirm(false);
                alert("✅ Profile verified successfully!");
              }}
              className="bg-blue-600 py-3 rounded-lg"
            >
              <Text className="text-white text-center text-lg font-semibold">
                Verify
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
