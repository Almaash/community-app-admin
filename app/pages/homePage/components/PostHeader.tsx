import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type PostHeaderProps = {
  avatar: string;
  profileName: string;
  role: string;
  timestamp: string;
  id: number;
};

const PostHeader: React.FC<PostHeaderProps> = ({
  avatar,
  profileName,
  id,
  timestamp,
}) => {
  const [loading, setLoading] = useState(false);

  const handleViewProfile = () => {
    // setLoading(true);
    // router.push(`/profile?type=other&id=${id}`);
    // setTimeout(() => setLoading(false), 1000); // Optional: simulate delay
  };
  return (
    <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
      <TouchableOpacity onPress={handleViewProfile}>
        <View className="flex-row items-center">
          <Image
            source={{ uri: avatar }}
            className="w-10 h-10 rounded-full bg-gray-300"
          />
          <View className="ml-3">
            <Text className="font-semibold text-gray-900 text-base">
              {profileName}
            </Text>
            <Text className="text-gray-600 text-sm">{timestamp}</Text>
          </View>
          {/* <Text className="text-gray-500 text-sm ml-2">• {timestamp}</Text> */}
        </View>
      </TouchableOpacity>
      <TouchableOpacity className="p-2">
        <Text className="text-gray-400 text-lg font-bold">⋯</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostHeader;
