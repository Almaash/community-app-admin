import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AdminDashboard = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* <ScrollView className="flex-1"> */}
      {/* Header Section */}
      <View className="bg-black rounded-b-3xl pb-6">
        <Text className="text-white text-xs text-center pt-2">
          Chitransh Business Association Trust
        </Text>
        <Text className="text-white text-2xl font-bold text-center mt-1">
          Admin Control Dashboard
        </Text>

        {/* Illustration (Icon instead of Image) */}
        <View className="w-36 h-36 rounded-full bg-gray-700 self-center mt-4 items-center justify-center">
          <Ionicons name="person-circle" size={100} color="white" />
        </View>
      </View>

      {/* Feed & Events */}
      <View className="flex-row justify-around mt-6 px-3">
        <TouchableOpacity
          onPress={() => router.push(`/pages/events/EventScreen`)}
          className="bg-gray-100 shadow p-4 rounded-2xl w-[48%] items-center"
        >
          <Ionicons name="newspaper" size={30} color="black" />
          <Text className="text-lg font-semibold mt-2">Feed Section</Text>
          <Text className="text-gray-500 text-sm">Manage Post & Feeds</Text>
          <Text className="bg-blue-500 text-white px-3 py-1 rounded-full mt-3">
            5 New
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/pages/eventsApproval/EventScreen`)}
          className="bg-gray-100 shadow p-4 rounded-2xl w-[48%] items-center"
        >
          <MaterialIcons name="event" size={30} color="black" />
          <Text className="text-lg font-semibold mt-2">Events</Text>
          <Text className="text-gray-500 text-sm">Payment & Attendance</Text>
          <Text className="bg-blue-500 text-white px-3 py-1 rounded-full mt-3">
            5 New
          </Text>
        </TouchableOpacity>
      </View>

      {/* Other Section */}
      <View className="mt-8 px-4">
        <Text className="text-lg font-bold mb-4">Other Section</Text>

        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => router.push(`/pages/newUsers/newUsers`)}
            className="bg-gray-100 shadow p-4 rounded-2xl items-center w-[30%]"
          >
            <Ionicons name="person-outline" size={30} color="#4088E3" />
            <Text className="text-gray-800 text-sm font-semibold mt-2">
              New User
            </Text>
            <Text className="bg-blue-500 text-white px-3 py-1 rounded-full mt-3">
              5 New
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-100 shadow p-4 rounded-2xl items-center w-[30%]">
            <Feather name="box" size={30} color="#4088E3" />
            <Text className="text-gray-800 text-sm font-semibold mt-2">
              Products
            </Text>
            <Text className="bg-blue-500 text-white px-3 py-1 rounded-full mt-3">
              18 New
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(`/pages/community/communityScreen`)}
            className="bg-gray-100 shadow p-4 rounded-2xl items-center w-[30%]"
          >
            <Ionicons name="cash" size={30} color="#4088E3" />
            <Text className="text-gray-800 text-sm font-semibold mt-2">
              Accounts
            </Text>
            <Text className="bg-blue-500 text-white px-3 py-1 rounded-full mt-3">
              11 New
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messaging Section */}
      <View className="mt-8 px-4">
        <TouchableOpacity className="bg-white shadow p-4 rounded-2xl flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-lg font-semibold">Messaging</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Reach Community Members & Users in a go.
            </Text>
            <Text className="bg-blue-500 text-white px-3 py-1 rounded-full mt-3">
              5 New Messages
            </Text>
          </View>
          <MaterialCommunityIcons
            name="message-text-outline"
            size={30}
            color="#4088E3"
          />
        </TouchableOpacity>
      </View>

      <View className="h-10" />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default AdminDashboard;
