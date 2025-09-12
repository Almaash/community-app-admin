import { View, Text, TouchableOpacity, Image } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const users = [
  {
    id: "1",
    name: "Profile Name 1",
    business: "Business Name 1",
    category: "Business Category 1",
    image: "https://via.placeholder.com/200",
  },
  {
    id: "2",
    name: "Profile Name 2",
    business: "Business Name 2",
    category: "Business Category 2",
    image: "https://via.placeholder.com/200",
  },
];

export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg">User not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: "User Details" }} />

      {/* Profile Section */}
      <View className="bg-gray-100 p-6 items-center">
        <Image
          source={{ uri: user.image }}
          className="w-40 h-40 rounded-full border-4 border-white shadow"
        />
        <Text className="text-2xl font-bold mt-4">{user.name}</Text>
        <Text className="text-gray-600 mt-1">{user.business}</Text>
        <Text className="text-gray-600">{user.category}</Text>
      </View>

      {/* Verify Section */}
      <View className="flex-1 justify-center items-center px-6">
        <TouchableOpacity
          className="bg-green-600 w-full py-4 rounded-xl shadow"
          onPress={() => alert(`${user.name} verified!`)}
        >
          <Text className="text-white text-lg font-semibold text-center">
            ✅ Verify User
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-300 w-full py-3 mt-4 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-black font-medium text-center">⬅ Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
