import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

export default function EventScreen() {
  const [upcommingEvent, setUpcommingEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newRegistrations, setNewRegistrations] = useState<any[]>([]);
  const [verifiedRegistrations, setVerifiedRegistrations] = useState<any[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { id } = useLocalSearchParams();

  const eventsMock = [
    {
      id: "1",
      name: "Food Festival",
      description: "Enjoy delicious food and drinks from top restaurants.",
      date: "2025-08-20",
      time: "18:00:00",
      venue: "City Park",
      bannerUrl:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
    },
    {
      id: "2",
      name: "Music Concert",
      description: "Live performance by popular artists and bands.",
      date: "2025-08-25",
      time: "19:00:00",
      venue: "Downtown Arena",
      bannerUrl:
        "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=800&q=80",
    },
  ];

  const usersMock = [
    { id: "u1", name: "Alice Johnson", code: "ALC12345XYZsss" },
    { id: "u2", name: "Bob Smith", code: "BOB98765LMN" },
    { id: "u3", name: "Charlie Brown", code: "CHR45678QWE" },
  ];

  const verifiedusers = [
    { id: "u1", name: "Alice Johnson", code: "ALC12345XYZsss" },
    { id: "u2", name: "Bob Smith", code: "BOB98765LMN" },
    { id: "u3", name: "Charlie Brown", code: "CHR45678QWE" },
  ];

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 150],
    outputRange: [1.2, 1, 1],
  });

  const fetchUpcommingEventsData = async () => {
    setLoading(true);
    try {
      const event = eventsMock.find((e) => e.id === id) || eventsMock[0];
      setUpcommingEvent(event);

      // reset lists
      setNewRegistrations(usersMock);
      setVerifiedRegistrations([]);
    } catch (err) {
      console.error("❌ Failed to fetch event", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcommingEventsData();
  }, []);

  // ✅ move user from new → verified
  const handleVerifyUser = (user: any) => {
    setNewRegistrations((prev) => prev.filter((u) => u.id !== user.id));
    setVerifiedRegistrations((prev) => [...prev, user]);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-500 text-lg">Loading event...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Banner */}
      <Animated.View style={{ height: 250, overflow: "hidden" }}>
        <Animated.Image
          source={{ uri: upcommingEvent?.bannerUrl }}
          style={{
            width: "100%",
            height: "100%",
            transform: [{ scale: imageScale }],
            resizeMode: "cover",
          }}
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-5 left-4 bg-white/80 rounded-full p-2"
        >
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
      </Animated.View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 40,
          paddingTop: 10,
        }}
      >
        <Text className="text-2xl font-bold mb-1">{upcommingEvent?.name}</Text>

        <Text className="text-gray-700 text-lg mb-4">
          {new Date(upcommingEvent?.date).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}{" "}
          |{" "}
          {new Date(`1970-01-01T${upcommingEvent?.time}`).toLocaleTimeString(
            "en-US",
            { hour: "numeric", minute: "2-digit", hour12: true }
          )}{" "}
          | {upcommingEvent?.venue}
        </Text>

        <Text className="text-lg font-semibold mb-1">Description</Text>
        <Text className="text-gray-600 text-base mb-6 leading-relaxed">
          {upcommingEvent?.description}
        </Text>

        {/* ✅ Users Registered Section */}
        <View className="bg-white rounded-lg shadow px-3 py-4">
          <Text className="text-lg font-semibold mb-3">
            Users Registered for Event
          </Text>

          {/* New Registration */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-semibold">New Registration</Text>
            <View className="bg-blue-500 rounded-full px-3 py-1">
              <Text className="text-white text-base font-semibold">
                {newRegistrations.length}
              </Text>
            </View>
          </View>

          {newRegistrations.map((user) => (
            <TouchableOpacity
              key={user.id}
              className="flex-row items-center bg-gray-50 rounded-lg p-3 mb-2"
              onPress={() =>
                router.push({
                  pathname: "/pages/eventsApproval/components/[id]",
                  params: {
                    userId: user.id,
                    name: user.name,
                    code: user.code,
                  },
                })
              }
            >
              <View className="w-12 h-12 rounded-full bg-gray-300 mr-3" />
              <View className="flex-1">
                <Text className="font-semibold text-base">{user.name}</Text>
                <Text className="text-gray-500 text-sm">{user.code}</Text>
              </View>
              <View className="w-9 h-9 bg-gray-300 rounded-md" />
            </TouchableOpacity>
          ))}

          {/* Verified Registration */}
          <View className="flex-row justify-between items-center mt-4 mb-2">
            <Text className="text-base font-semibold">
              Verified Registration
            </Text>
            <View className="bg-blue-500 rounded-full px-3 py-1">
              <Text className="text-white text-base font-semibold">
                {verifiedRegistrations.length}
              </Text>
            </View>
          </View>

          {verifiedusers.map((user) => (
            <View
              key={user.id}
              className="flex-row items-center bg-gray-50 rounded-lg p-3 mb-2"
            >
              <View className="w-12 h-12 rounded-full bg-gray-300 mr-3" />
              <View className="flex-1">
                <Text className="font-semibold text-base">{user.name}</Text>
                <Text className="text-gray-500 text-sm">{user.code}</Text>
              </View>
              <View className="w-9 h-9 bg-gray-300 rounded-md" />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
