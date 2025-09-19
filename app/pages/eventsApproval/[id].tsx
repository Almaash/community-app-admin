import ProjectApiList from "@/app/api/ProjectApiList";
import ApiService from "@/app/utils/axiosInterceptor";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const formatDateAndTime = (dateStr: string, timeStr: string) => {
  // Parse human-readable date
  const dateParts = new Date(dateStr);

  if (isNaN(dateParts.getTime())) {
    return `${dateStr} | ${timeStr}`; // fallback if parsing fails
  }

  // Parse 12-hour time string like "1:00 pm"
  let [hoursMinutes, meridiem] = timeStr.toLowerCase().split(" ");
  let [hours, minutes] = hoursMinutes.split(":").map(Number);

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  dateParts.setHours(hours);
  dateParts.setMinutes(minutes);

  // Format date
  const formattedDate = dateParts.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time in 12-hour
  const formattedTime = dateParts.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} | ${formattedTime}`;
};

export default function EventScreen() {
  const { api_getEventById, api_getEventRegistrations, api_postEventVerification } =
    ProjectApiList();
  const { id } = useLocalSearchParams(); // ✅ event ID from route

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 150],
    outputRange: [1.2, 1, 1],
  });

  // ✅ Fetch event + registrations
  const fetchEventData = async () => {
    setLoading(true);
    try {
      // 1. Get event details
      const resEvent = await ApiService.get(`${api_getEventById}/${id}`);
      if (resEvent?.data?.success) {
        setEvent(resEvent.data.data);
      }

      // 2. Get registrations
      const resRegs = await ApiService.get(
        `${api_getEventRegistrations}/${id}/registrations`
      );
      if (resRegs?.data?.success) {
        const regs = resRegs.data.data.registrations || [];

        const mapped = regs.map((r: any, index: number) => ({
          id: r.userId || `user-${index}`,
          name: `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || r.userId,
          screenshot: r.paymentScreenshot,
          status: r.verificationStatus, // pending / verified
          registeredAt: r.registeredAt?._seconds
            ? new Date(r.registeredAt._seconds * 1000).toLocaleString()
            : null,
        }));

        setRegistrations(mapped);
      }
    } catch (err) {
      console.error("❌ Failed to fetch event or registrations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEventData();
  }, [id]);

  // ✅ Handle verification
  const handleVerifyUser = async (user: any) => {
    try {
      await ApiService.post(`${api_postEventVerification}/${id}/${user.id}`, {
        status: "verified",
      });

      // update local state
      setRegistrations((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: "verified" } : u
        )
      );

      setSelectedUser(null); // close modal
    } catch (error) {
      console.error("❌ Verification failed", error);
      Alert.alert("Error", "Failed to verify user.");
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-500 text-lg">Loading event...</Text>
      </SafeAreaView>
    );
  }

  // ✅ No event found
  if (!event) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 text-lg">No event found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Banner */}
      <Animated.View style={{ height: 250, overflow: "hidden" }}>
        <Animated.Image
          source={{ uri: event.bannerUrl }}
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
        {/* Event title */}
        <Text className="text-2xl font-bold mb-1">{event.name}</Text>

        {/* Event date, time, venue */}
        <Text className="text-gray-700 text-lg mb-4">
          {formatDateAndTime(event.date, event.time)} | {event.venue}
        </Text>

        {/* Description */}
        <Text className="text-lg font-semibold mb-1">Description</Text>
        <Text className="text-gray-600 text-base mb-6 leading-relaxed">
          {event.description}
        </Text>

        {/* Registrations */}
        <View className="bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-bold mb-3">
            Users Registered ({registrations.length})
          </Text>

          {registrations.map((user) => (
            <TouchableOpacity
              key={user.id}
              onPress={() => setSelectedUser(user)}
              className="flex-row items-center justify-between border-b border-gray-200 py-3"
            >
              {/* User info */}
              <View className="flex-1 mr-3">
                <Text className="font-semibold text-base">{user.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {user.registeredAt || "No date"}
                </Text>
                <Text
                  className={`text-sm font-medium ${
                    user.status === "verified"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {user.status}
                </Text>
              </View>

              {/* Screenshot */}
              {user.screenshot ? (
                <Image
                  source={{ uri: user.screenshot }}
                  style={{ width: 48, height: 48, borderRadius: 6 }}
                />
              ) : (
                <View className="w-12 h-12 bg-gray-200 rounded-md" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Modal for screenshot + verify */}
      <Modal visible={!!selectedUser} transparent animationType="slide">
        <View className="flex-1 bg-black/70 justify-center items-center px-6">
          <View className="bg-white rounded-lg p-4 w-full max-w-md">
            {selectedUser?.screenshot ? (
              <Image
                source={{ uri: selectedUser.screenshot }}
                style={{ width: "100%", height: 300, borderRadius: 8 }}
                resizeMode="contain"
              />
            ) : (
              <View className="w-full h-48 bg-gray-200 rounded-md items-center justify-center">
                <Text>No Screenshot</Text>
              </View>
            )}

            <Text className="text-lg font-semibold mt-4 mb-2 text-center">
              {selectedUser?.name}
            </Text>

            <View className="flex-row justify-around mt-3">
              <TouchableOpacity
                onPress={() => setSelectedUser(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                <Text>Close</Text>
              </TouchableOpacity>

              {selectedUser?.status === "pending" && (
                <TouchableOpacity
                  onPress={() => handleVerifyUser(selectedUser)}
                  className="bg-green-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white">Verify</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
