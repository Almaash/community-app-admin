import React from "react";
import { View, Text, Image } from "react-native";

type Props = {
  date: string; // e.g., "22 July 2025"
  time: string; // e.g., "1:00 pm"
  title: string;
  image: string;
};

export default function EventCard({ date, time, title, image }: Props) {

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
