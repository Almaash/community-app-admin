import ProjectApiList from "@/app/api/ProjectApiList";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native"; // ✅ Import

export default function Tab() {
  const router = useRouter();
  const { api_getNewMatrimonialRequest } = ProjectApiList();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ Fetch users function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(api_getNewMatrimonialRequest);
      const data = await res.json();

      if (Array.isArray(data?.data)) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh API every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const filteredUsers = users.filter((user) =>
    `${user?.firstName || ""} ${user?.lastName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // console.log(filteredUsers)

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-100 rounded-xl mx-4 mt-4 px-3 py-2">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search"
          className="flex-1 ml-2 text-base"
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="gray" />
      </View>

      {/* Title */}
      <Text className="text-lg font-semibold mt-5 mb-3 px-4">
        Matrinonial User Requests
      </Text>

      {/* Loading State */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              {/* Avatar + Info */}
              <View className="flex-row items-center">
                {item?.ownerImage ? (
                  <Image
                    source={{ uri: item.ownerImage }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-gray-300 mr-3" />
                )}

                <View>
                  <Text className="font-semibold">
                    {item?.firstName} {item?.lastName}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Email: {item?.email || "N/A"}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    State: {item?.state || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Button */}
              <TouchableOpacity
                className="bg-blue-600 px-3 py-2 rounded"
                onPress={() => router.push(`/pages/matrinonialsAccessRequest/${item?.id}`)}
              >
                <Text className="text-white text-sm font-medium">
                  View Detailssss
                </Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">
              No Request found
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
