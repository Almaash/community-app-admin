import ProjectApiList from "@/app/api/ProjectApiList";
import Header from "@/app/components/Header";
import ApiService from "@/app/utils/axiosInterceptor";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CompletedEventList from "./components/CompletedEventList";
import EventList from "./components/EventList";
import TabButton from "./components/TabButton";
// import { CloudCog } from "lucide-react-native";
// import uploadApi from "@/app/utils/uploadApi"; // use your interceptor instance

export default function EventScreen() {
  const [activeTab, setActiveTab] = useState<"upcomming" | "completed">(
    "upcomming"
  );
  const { api_getEventListings } = ProjectApiList();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch events based on active tab
  const fetchEvents = async (type: "upcomming" | "completed") => {
    try {
      setLoading(true);
      const res = await ApiService.get(`${api_getEventListings}?type=${type}`);
      // console.log(res.data,"res.data====================>")
    if (type === "upcomming") {
      setEvents(res.data?.upcoming || []);
    } else {
      setEvents(res.data?.completed || []);
    }    } catch (error) {
      console.log("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };



  // console.log(events)
  useEffect(() => {
    fetchEvents(activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      {/* Tabs */}
      <View className="px-4 pt-4 pb-6">
        <Text className="text-xl font-semibold text-gray-900 mb-6">
          Events
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          <TabButton
            title="Upcoming Events"
            isActive={activeTab === "upcomming"}
            onPress={() => setActiveTab("upcomming")}
          />
          <TabButton
            title="Events Completed"
            isActive={activeTab === "completed"}
            onPress={() => setActiveTab("completed")}
          />
        </ScrollView>

        {/* Floating Button */}
        <TouchableOpacity
          onPress={() =>
            router.push("/pages/eventsApproval/components/CreateEvent")
          }
          className="absolute bottom-6 right-6 bg-blue-600 rounded-full p-4 shadow-lg"
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        <View className="px-4 pb-8">
          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : activeTab === "upcomming" ? (
            <EventList events={events} />
          ) : (
            <CompletedEventList events={events} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
