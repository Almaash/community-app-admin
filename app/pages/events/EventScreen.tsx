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
import CompletedEventList from "./components/CompletedEventList";
import EventList from "./components/EventList";
import NotificationList from "./components/NotificationList";
import Referrals from "./components/Referrals";
import TabButton from "./components/TabButton";
import ProjectApiList from "@/app/api/ProjectApiList";
import api from "@/app/utils/axiosInterceptor";
import Ionicons from "@expo/vector-icons/Ionicons"; // 👈 for back icon

export default function EventScreen() {
  const [activeTab, setActiveTab] = useState("newPost");

  const notifications = [
    {
      id: "n1",
      title: "New Event Posted",
      message: "Check out the upcoming June 3rd meeting!",
      date: "Today, 10:45 AM",
    },
    {
      id: "n2",
      title: "Event Reminder",
      message: "Don't forget the June 1st meeting at 1:00 PM.",
      date: "Yesterday, 5:30 PM",
    },
    {
      id: "n3",
      title: "Event Completed",
      message: "The May Wrap-up session has been marked complete.",
      date: "3 days ago",
    },
    {
      id: "n4",
      title: "Profile Updated",
      message: "Your profile details were successfully updated.",
      date: "4 days ago",
    },
    {
      id: "n5",
      title: "New Message",
      message: "You’ve received a message from the event coordinator.",
      date: "5 days ago",
    },
    {
      id: "n6",
      title: "Session Feedback",
      message: "Thanks for attending. Share your feedback with us.",
      date: "6 days ago",
    },
    {
      id: "n7",
      title: "Upcoming Webinar",
      message: "Join the live webinar on June 10 at 11:00 AM.",
      date: "1 week ago",
    },
    {
      id: "n8",
      title: "Invitation Accepted",
      message: "Your invitation for June 3rd meeting has been accepted.",
      date: "1 week ago",
    },
    {
      id: "n9",
      title: "New Event Posted",
      message: "A new workshop on communication skills is live now.",
      date: "2 weeks ago",
    },
    {
      id: "n10",
      title: "Event Cancelled",
      message: "The June 5th networking event has been cancelled.",
      date: "2 weeks ago",
    },
  ];

  const { api_getReferrals, api_getupcommingEvents, api_getCompletedEvents } =
    ProjectApiList();

  const [referralsListing, setReferralsListing] = useState<any>(null);
  const [upcommingEvents, setUpcommingEvents] = useState<any>(null);
  const [CompletedEvents, setCompletedEvents] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReferralsList = async () => {
    try {
      const res = await api.get(`${api_getReferrals}`);
      setReferralsListing(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch product", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcommingEvents = async () => {
    try {
      const res = await api.get(`${api_getupcommingEvents}`);
      setUpcommingEvents(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch product", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedEvents = async () => {
    try {
      const res = await api.get(`${api_getCompletedEvents}`);
      setCompletedEvents(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch product", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedEvents();
    fetchUpcommingEvents();
    fetchReferralsList();
  }, [activeTab]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007bff" />
        <Text className="text-gray-500 mt-3">Loading Posts...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* ✅ Custom Back Button */}
      {/* <View className="flex-row items-center px-4 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 p-2 rounded-full bg-gray-200"
        >
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">
          Feed Section Approval
        </Text>
      </View> */}

      {/* ✅ Your Header (Profile + Search + Chat) */}
      <Header />

      {/* Tabs */}
      <View className="px-4 pt-4 pb-6 flex-row items-center justify-between">
        {/* Back Button on Left */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-200 mr-2"
        >
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>

        {/* Tabs on Right */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          <TabButton
            title="New Post"
            isActive={activeTab === "newPost"}
            onPress={() => setActiveTab("newPost")}
          />
          <TabButton
            title="Rejected Post"
            isActive={activeTab === "rejectedPost"}
            onPress={() => setActiveTab("rejectedPost")}
          />
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        <View className="px-4 pb-8">
          {activeTab === "newPost" && (
            <NotificationList notifications={notifications} />
          )}
          {activeTab === "rejectedPost" && (
            <NotificationList notifications={notifications} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
