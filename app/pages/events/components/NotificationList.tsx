import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type Notification = {
  id: string;
  username: string;
  description: string;
  userImage?: string; // Optional image URL
};

interface Props {
  notifications: Notification[];
}

const NotificationList: React.FC<Props> = ({ notifications }) => {
  const router = useRouter();

  return (
    <View className="space-y-3">
      {notifications.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => router.push(`/pages/events/${item.id}`)}
          className="bg-white border border-gray-100 rounded-lg px-4 py-3 flex-row items-start gap-3"
        >
          <Image
            source={{
              uri:
                item.userImage,
            }}
            className="w-10 h-10 rounded-full mt-1"
          />
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-900">
              {item.username}
            </Text>
            <Text className="text-sm text-gray-700 mt-1">{item.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NotificationList;
