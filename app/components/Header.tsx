import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header({ setSearchQuery, searchQuery }: any) {
  const [user, setUser] = useState<{ ownerImage?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView className="bg-white"> 
      {/* <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.push(`/profile?type=self`)}>
          {user?.ownerImage ? (
            <Image
              source={{ uri: user.ownerImage }}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <View className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
          )}
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-blue-100 px-3 py-3 rounded-xl">
          <FontAwesome name="search" size={14} color="#6B7280" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
            placeholderTextColor="#6B7280"
            className="ml-2 text-sm text-gray-700"
            style={{ flex: 1, padding: 0 }}
          />
        </View>

        <TouchableOpacity className="ml-3" onPress={() => router.push("/chat")}>
          <Ionicons name="chatbubble-ellipses" size={30} color="#4B5563" />
        </TouchableOpacity>
      </View> */}
      <View className="flex-row items-center px-2 py-3">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#444" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
