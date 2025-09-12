import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/app/context/AuthContext"; // adjust path if needed
import { Text } from "react-native";

export default function ProfileHeader() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("token");
    logout();
  };

  const confirmLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: handleLogout },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-2 bg-white border-b border-gray-200 gap-5">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="#444" />
      </TouchableOpacity>

      {/* Search Input */}
      <View className="flex-1 mx-3 border-b border-gray-400 flex-row items-center pb-1">
        <FontAwesome name="search" size={18} color="#444" />
        <TextInput
          placeholder="PROFILE NAME"
          placeholderTextColor="#444"
          className="ml-5 text-xl text-black"
          style={{ padding: 0, flex: 1 }}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity onPress={confirmLogout}>
        <Text>
          <Ionicons name="log-out-outline" size={24} color="#d00" />
        </Text>
      </TouchableOpacity>
    </View>
  );
}
