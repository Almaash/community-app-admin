import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/app/context/AuthContext";
import ApiService from "@/app/utils/axiosInterceptor";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import ProjectApiList from "@/app/api/ProjectApiList";


const AdminDashboard = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { api_getAdminDashboard } =
    ProjectApiList();

  const [counts, setCounts] = useState({
    pendingFeeds: 0,
    pendingEventRegistrations: 0,
    pendingUsers: 0,
    pendingProducts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

const handleLogout = () => {
  const router = useRouter();

  Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        try {
          // Clear local storage
          await AsyncStorage.removeItem("userData");
          await AsyncStorage.removeItem("token");

          // Sign out from Google if logged in
          try {
            await GoogleSignin.signOut();
          } catch (error) {
            console.log("Google Signout Error:", error);
          }

          // Your app logout logic
          logout();

          // Redirect to login
          router.replace("/login");
        } catch (err) {
          console.log("Logout Error:", err);
        }
      },
    },
  ]);
};

  const fetchDashboardCounts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await ApiService.get(
        api_getAdminDashboard,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success && res.data.data) {
        setCounts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Section */}
      <View className="bg-black rounded-b-3xl pb-6">
        <Text className="text-white text-xs text-center pt-2">
          Chitransh Business Association Trust
        </Text>
        <Text className="text-white text-2xl font-bold text-center mt-1">
          Admin Control Dashboard
        </Text>

        {/* Illustration */}
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
            {counts.pendingFeeds} New
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
            {counts.pendingEventRegistrations} New
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
              {counts.pendingUsers} New
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(`/pages/products/ListedProducts`)}
            className="bg-gray-100 shadow p-4 rounded-2xl items-center w-[30%]"
          >
            <Feather name="box" size={30} color="#4088E3" />
            <Text className="text-gray-800 text-sm font-semibold mt-2">
              Products
            </Text>
            <Text className="bg-blue-500 text-white px-3 py-1 rounded-full mt-3">
              {counts.pendingProducts} New
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
              {counts.totalUsers} Total
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messaging Section */}
      <View className="mt-8 px-4 flex-1">
        {/* <TouchableOpacity className="bg-white shadow p-4 rounded-2xl flex-row justify-between items-center">
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
        </TouchableOpacity> */}
      </View>

      {/* Logout at Bottom */}
      <View className="px-4 pb-6">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-blue-500 py-3 rounded-2xl flex-row justify-center items-center"
        >
          <Feather name="log-out" size={20} color="white" />
          <Text className="ml-2 text-white font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminDashboard;
