import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Header from "@/app/components/Header";
import { Stack } from "expo-router";
import CompletedEventList from "./components/CompletedEventList";
import EventList from "./components/EventList";
import TabButton from "./components/TabButton";

// Import static JSON
// import eventsData from "./events.json";

export default function EventScreen() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const eventsData = {
    upcoming: [
      {
        id: "1",
        name: "Tech Conference 2025",
        date: "2025-09-01",
        time: "10:00 AM",
        bannerUrl:
          "https://via.placeholder.com/400x200.png?text=Tech+Conference",
        title: "Future of AI",
      },
      {
        id: "2",
        name: "Startup Meetup",
        date: "2025-09-05",
        time: "6:00 PM",
        bannerUrl:
          "https://via.placeholder.com/400x200.png?text=Startup+Meetup",
        title: "Networking Night",
      },
    ],
    completed: [
      {
        id: "3",
        name: "Blockchain Workshop",
        date: "2025-08-10",
        time: "2:00 PM",
        bannerUrl: "https://via.placeholder.com/400x200.png?text=Blockchain",
        title: "Crypto Basics",
      },
      {
        id: "4",
        name: "Design Thinking",
        date: "2025-08-01",
        time: "4:00 PM",
        bannerUrl:
          "https://via.placeholder.com/400x200.png?text=Design+Thinking",
        title: "Innovation Workshop",
      },
    ],
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      {/* Tabs */}
      <View className="px-4 pt-4 pb-6">
        <Text className="text-xl font-semibold text-gray-900 mb-6">
          Notifications
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          <TabButton
            title="Upcoming Events"
            isActive={activeTab === "upcoming"}
            onPress={() => setActiveTab("upcoming")}
          />
          <TabButton
            title="Events Complete"
            isActive={activeTab === "complete"}
            onPress={() => setActiveTab("complete")}
          />
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        <View className="px-4 pb-8">
          {activeTab === "upcoming" && (
            <EventList events={eventsData.upcoming} />
          )}
          {activeTab === "complete" && (
            <CompletedEventList events={eventsData.completed} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
