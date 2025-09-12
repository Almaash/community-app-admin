import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const users = [
  {
    id: "1",
    name: "Profile Name 1",
    business: "Business Name 1",
    category: "Business Category 1",
    image: "https://via.placeholder.com/100",
  },
  {
    id: "2",
    name: "Profile Name 2",
    business: "Business Name 2",
    category: "Business Category 2",
    image: "https://via.placeholder.com/100",
  },
];

export default function Tab() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-100 rounded-xl mx-4 mt-4 px-3 py-2">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput placeholder="Search" className="flex-1 ml-2 text-base" />
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="gray" />
      </View>

      {/* Title */}
      <Text className="text-lg font-semibold mt-5 mb-3 px-4">
        New User Registration
      </Text>

      {/* User List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            {/* Avatar + Info */}
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-gray-300 mr-3" />
              <View>
                <Text className="font-semibold">{item.name}</Text>
                <Text className="text-sm text-gray-600">{item.business}</Text>
                <Text className="text-sm text-gray-600">{item.category}</Text>
              </View>
            </View>

            {/* Button */}
            <TouchableOpacity
              className="bg-blue-600 px-3 py-2 rounded"
              onPress={() => router.push(`/pages/newUsers/${item?.id}`)}
            >
              <Text className="text-white text-sm font-medium">
                View Details
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
