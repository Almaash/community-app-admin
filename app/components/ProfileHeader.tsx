import { View, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function ProfileHeader() {
  return (
    <View className="flex-row items-center px-4 py-2 bg-white border-b border-gray-200">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="#444" />
      </TouchableOpacity>
    </View>
  );
}
