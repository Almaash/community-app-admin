import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import Header from "@/app/components/Header";
import { Stack, router } from "expo-router";
import NotificationList from "./components/NotificationList";
import TabButton from "./components/TabButton";
import ProjectApiList from "@/app/api/ProjectApiList";
import api from "@/app/utils/axiosInterceptor";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PostScreen() {
  const [activeTab, setActiveTab] = useState("pending");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { api_getApprovedPost } = ProjectApiList(); // single endpoint

  const fetchPosts = async (status: string) => {
    setLoading(true);
    try {
      // Send status as query param
      const res = await api.get(`${api_getApprovedPost}?status=${status}`);
      setPosts(res.data?.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch posts", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(activeTab); // fetch posts according to selected tab
  }, [activeTab]);

  // console.log(posts,"posts==============>")

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <Header />

      {/* Tabs */}
      <View className="px-4 pt-4 pb-6 flex-row items-center justify-between">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-200 mr-2"
        >
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          <TabButton
            title="Pending Posts"
            isActive={activeTab === "pending"}
            onPress={() => setActiveTab("pending")}
          />
          <TabButton
            title="Approved Posts"
            isActive={activeTab === "approved"}
            onPress={() => setActiveTab("approved")}
          />
          <TabButton
            title="Rejected Posts"
            isActive={activeTab === "rejected"}
            onPress={() => setActiveTab("rejected")}
          />
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#007bff" />
          <Text className="text-gray-500 mt-3">Loading Data...</Text>
        </SafeAreaView>
      ) : posts.length === 0 ? (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
          <Ionicons name="alert-circle-outline" size={40} color="gray" />
          <Text className="text-gray-500 mt-3">No Post available</Text>
        </SafeAreaView>
      ) : (
        <ScrollView className="flex-1">
          <View className="px-4 pb-8">
            <NotificationList notifications={posts} />
          </View>
        </ScrollView>
      )}

    </SafeAreaView>
  );
}
