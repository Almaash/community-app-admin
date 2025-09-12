"use client";
import ProjectApiList from "@/app/api/ProjectApiList";
import ProfileHeader from "@/app/components/ProfileHeader";
import IDCardModal from "@/app/components/profileCard";
import ApiService from "@/app/utils/axiosInterceptor";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  Switch,
  View,
} from "react-native";
import ListedProducts from "../products/ListedProducts";
import AdditionalDetailsSection from "./components/AdditionalDetailsSection";
import ReferralModal from "./components/ReferralModal";
import api from "@/app/utils/axiosInterceptor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrCreateChat } from "@/app/utils/api/chatApi";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshControl } from "react-native";

interface UserDataType {
  firstName: string;
  lastName: string;
  businessName: string;
  city: string;
  state: string;
  referralPoints?: number;
  referralCount?: number;
  ownerImage?: string;
}

const ProfileScreen = () => {
  const { type, id } = useLocalSearchParams();
  const { api_getUserData, api_getOtherUserData, api_postReferrals } =
    ProjectApiList();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [referralText, setReferralText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [amount, setAmount] = useState("");

  const [banExpanded, setBanExpanded] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString) {
          const currentUserData = JSON.parse(userDataString);
          setCurrentUserId(currentUserData?.id || currentUserData?.user?.id);
        }
      } catch (error) {
        console.error("Failed to fetch current user data:", error);
      }
    };
    fetchCurrentUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!type) return;
      const fetchUserData = async () => {
        try {
          setIsLoading(true);
          const apiUrl =
            type === "other"
              ? `${api_getOtherUserData}/${id}`
              : api_getUserData;
          const res = await ApiService.get(apiUrl);
          setUserData(res?.data?.data);
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserData();
    }, [type, id])
  );

  const handleMessagePress = async () => {
    if (!currentUserId || !id || !userData) {
      Alert.alert("Error", "Unable to start chat. Please try again.");
      return;
    }

    // Prevent messaging yourself
    if (currentUserId === id) {
      Alert.alert("Error", "You cannot message yourself.");
      return;
    }

    try {
      setMessageLoading(true);

      console.log("Creating chat between:", currentUserId, "and", id);

      const chatResponse = await getOrCreateChat(currentUserId, id as string);

      console.log("Chat response:", chatResponse);

      if (chatResponse.success) {
        const chatId = chatResponse.chatId || chatResponse.chat?.id;

        if (!chatId) {
          Alert.alert("Error", "Failed to get chat ID. Please try again.");
          return;
        }

        router.push({
          pathname: "/pages/chat/components/ChatScreen",
          params: {
            chatId: chatId,
            otherUserId: id as string,
            otherUserName: `${userData.firstName} ${userData.lastName}`.trim(),
            otherUserImage: userData.ownerImage || "",
          },
        });
      } else {
        Alert.alert(
          "Error",
          chatResponse.error || "Failed to create chat. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating/finding chat:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setMessageLoading(false);
    }
  };

  const sendReferral = async () => {
    setLoading(true);
    const payload = {
      toUserId: id,
      details: referralText,
    };
    try {
      const response = await api.post(api_postReferrals, payload);
      if (response.data?.success) {
        const { message } = response.data;
        setShowModal(false);
        setReferralText("");
        Alert.alert("Success", message || "Referral Sent Successfully.");
        router.back();
      } else {
        Alert.alert(
          "Error",
          response?.data?.message || "Something went wrong."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const apiUrl =
        type === "other" ? `${api_getOtherUserData}/${id}` : api_getUserData;
      const res = await ApiService.get(apiUrl);
      setUserData(res?.data?.data);
    } catch (err) {
      console.error("Refresh failed:", err);
      Alert.alert("Error", "Could not refresh profile data.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    // <ScrollView
    //   className="flex-1"
    //   refreshControl={
    //     <RefreshControl
    //       refreshing={refreshing}
    //       onRefresh={onRefresh}
    //       colors={["#2563EB"]}
    //     />
    //   }
    // >
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-2 text-gray-500">Loading profile...</Text>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1">
            {/* Header */}
            <View className="bg-slate-300 h-32 relative">
              <TouchableOpacity className="absolute top-4 right-4 bg-white rounded-full p-2">
                <Ionicons name="pencil" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View className="px-4 -mt-16">
              <View className="relative mb-4">
                <Image
                  source={{
                    uri:
                      userData?.ownerImage || "https://via.placeholder.com/150",
                  }}
                  className="w-32 h-32 rounded-full mb-4"
                />
                <TouchableOpacity className="absolute bottom-4 left-24 bg-white rounded-full p-1 border border-gray-300">
                  <Ionicons name="add" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="mb-6">
                <Text className="text-xl font-bold text-black mb-1">
                  {userData?.firstName} {userData?.lastName}
                </Text>
                <Text className="text-gray-600 mb-2">
                  <Text className="font-bold">{userData?.businessName}</Text>
                  <Text>{` | ${userData?.businessName} | ${userData?.state}`}</Text>
                </Text>

                {(userData?.referralPoints != null ||
                  userData?.referralCount != null) && (
                  <Text className="text-blue-600 font-medium mb-4">
                    {userData?.referralPoints != null &&
                      `${userData.referralPoints} Points`}
                    {userData?.referralPoints != null &&
                      userData?.referralCount != null &&
                      " • "}
                    {userData?.referralCount != null &&
                      `${userData.referralCount} Referral`}
                  </Text>
                )}

                {/* {type === "other" ? (
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                      className={`px-6 py-2 rounded-full flex-1 ${messageLoading ? "bg-gray-400" : "bg-blue-600"}`}
                      onPress={handleMessagePress}
                      disabled={messageLoading}
                    >
                      {messageLoading ? (
                        <View className="flex-row items-center justify-center">
                          <ActivityIndicator size="small" color="#ffffff" />
                          <Text className="text-white text-center font-medium ml-2">Starting...</Text>
                        </View>
                      ) : (
                        <Text className="text-white text-center font-medium">
                          Message
                        </Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="border border-gray-300 px-6 py-2 rounded-full flex-1"
                      onPress={() => setShowModal(true)}
                    >
                      <Text className="text-gray-700 text-center font-medium">
                        Referral
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2">
                      <MaterialIcons name="more-horiz" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-3 mt-3">
                    <TouchableOpacity
                      className="bg-blue-600 px-6 py-2 rounded-full flex-1"
                      onPress={() => setIsModalVisible(true)}
                    >
                      <Text className="text-white text-center font-medium">
                        View Profile Card
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2">
                      <MaterialIcons name="more-horiz" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                )} */}
              </View>
            </View>

            {/* Defaulter Section */}
            <View className="bg-white rounded-xl border border-gray-200 mb-4 mx-2">
              {/* Header */}
              <TouchableOpacity
                className="flex-row justify-between items-center px-4 py-4"
                onPress={() => setExpanded(!expanded)}
              >
                <View>
                  <Text className="text-base font-semibold text-gray-900">
                    Fees Defaulter
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Add a Tag to the profile and mark as defaulter
                  </Text>
                </View>
                <Ionicons
                  name={expanded ? "chevron-down" : "chevron-forward"}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>

              {/* Expanded Content */}
              {expanded && (
                <View className="px-4 pb-4 space-y-4">
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="₹ Enter Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                  />

                  <View className="flex-row items-center space-x-4">
                    <Text className="text-sm font-medium">ON</Text>
                    <Switch
                      value={isOn}
                      onValueChange={setIsOn}
                      thumbColor={isOn ? "#10B981" : "#f4f3f4"}
                      trackColor={{ false: "#d1d5db", true: "#34D399" }}
                    />
                    <Text className="text-sm font-medium">OFF</Text>
                  </View>
                </View>
              )}
            </View>
            {/* Ban Section */}
            <View className="bg-white rounded-xl border border-gray-200 mb-4 mx-2">
              {/* Header */}
              <TouchableOpacity
                className="flex-row justify-between items-center px-4 py-4"
                onPress={() => setBanExpanded(!banExpanded)}
              >
                <View>
                  <Text className="text-base font-semibold text-gray-900">
                    Ban
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Stop profile for using the CBA App
                  </Text>
                </View>
                <Ionicons
                  name={banExpanded ? "chevron-down" : "chevron-forward"}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>

              {/* Expanded Content */}
              {banExpanded && (
                <View className="px-4 pb-4 space-y-4">
                  {/* Ban Button */}
                  <View className="flex-row items-center px-4 py-2">
                    <Text className="font-semibold text-sm mr-3">
                      BAN PROFILE
                    </Text>
                    <Switch
                      value={isBanned}
                      onValueChange={setIsBanned}
                      thumbColor={isBanned ? "#fff" : "#f4f3f4"}
                      trackColor={{ false: "#d1d5db", true: "#ef4444" }}
                      style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }} // 👈 bigger switch
                    />
                  </View>

                  {/* Re-open Button */}
                  <View className="flex-row items-center px-4 py-2">
                    <Text className="font-semibold text-sm mr-3">
                      RE-OPEN PROFILE
                    </Text>
                    <Switch
                      value={!isBanned}
                      onValueChange={() => setIsBanned(false)}
                      thumbColor={!isBanned ? "#fff" : "#f4f3f4"}
                      trackColor={{ false: "#d1d5db", true: "#10B981" }}
                      style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }} // 👈 bigger switch
                    />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
      </>
    // </ScrollView>
  );
};

export default ProfileScreen;
