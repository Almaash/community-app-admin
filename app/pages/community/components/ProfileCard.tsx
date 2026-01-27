import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ProfileCardProps = {
  profileName?: string;
  points?: number;
  referrals?: number;
  profileImageUrl?: string;
  id?: string;
  role?: string;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  profileName,
  points = 0,
  referrals = 0,
  profileImageUrl,
  role,
}) => {
  const [loading, setLoading] = useState(false);

  // Determine border color based on role
  // Consumer -> Green, Others (Business) -> Yellow
  const borderColor =
    role?.toLowerCase() === "consumer" ? "border-green-500" : "border-yellow-500";

  const handleViewProfile = () => {
    setLoading(true);
    router.push(`/profile?type=other&id=${id}`);
    setTimeout(() => setLoading(false), 1000); // Optional: simulate delay
  };

  return (
    <View
      className={`bg-white rounded-2xl p-5 m-2 shadow-sm border-2 w-[95%] self-center ${borderColor}`}
    >
      {/* Avatar */}
      <View
        className={`w-16 h-16 rounded-full mb-4 items-center justify-center self-center shadow-sm overflow-hidden bg-gray-100 border-2 ${borderColor}`}
      >
        {profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            style={{ width: 64, height: 64, borderRadius: 32 }}
            resizeMode="cover"
          />
        ) : (
          <FontAwesome name="user" size={30} color="#4B5563" />
        )}
      </View>

      {/* Profile Name */}
      <Text className="text-center text-gray-900 font-semibold text-lg mb-1">
        {profileName || "Unknown"}
      </Text>

      {/* Points and Referrals */}
      <View className="flex justify-center items-center gap-x-2 mb-4">
        <View className="bg-blue-50 px-3 rounded-full flex-row items-center">
          <FontAwesome name="star" size={15} color="#2563EB" />
          <Text className="text-blue-600 ml-1 text-md font-medium">
            {points} pts
          </Text>
        </View>

        <View className="px-3 py-1 rounded-full flex-row items-center">
          <FontAwesome name="users" size={12} color="#10B981" />
          <Text className="text-green-600 ml-1 text-sm font-medium">
            {referrals} referral{referrals !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* View Profile Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={loading}
        className="bg-blue-500 rounded-xl py-2.5 px-4 flex-row justify-center items-center shadow-sm"
        onPress={handleViewProfile}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white font-medium ml-2 text-sm">
            View Profile
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProfileCard;
