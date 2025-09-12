import React from "react";
import { View, Text, Image } from "react-native";

type Props = {
  date: string;
  time: string;
  title: string;
  image: string;
};

export default function EventCard({ date, time, title, image }: Props) {

  const formatDateAndTime = (date: string, time: string) => {
  // Combine date and time to create full Date object
  const fullDate = new Date(`${date}T${time}`);

  // Format date to "Month Day, Year" (e.g., October 11, 2025)
  const formattedDate = fullDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time to 12-hour format (e.g., 10:30 AM)
  const formattedTime = fullDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} | ${formattedTime}`;
};

  return (
    <View className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-4">
      <View className="h-52 relative">
        <Image
          source={{ uri: image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute bottom-2 left-1 bg-black bg-opacity-60 px-2 py-1 rounded">
          <Text className="text-white text-xs font-medium">
            {/* {date} | {time} */}
              {formatDateAndTime(date, time)}
          </Text>
        </View>
      </View>
      <View className="p-3">
        <Text className="text-gray-800 font-medium text-sm">{title}</Text>
      </View>
    </View>
  );
}
