import React from "react";
import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import EventCard from "./EventCard";

type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  bannerUrl: string;
};

interface Props {
  events: Event[];
}

const EventList: React.FC<Props> = ({ events }) => {
  return (
    <View className="flex-row flex-wrap justify-between">
      {events.map((event) => (
        <View key={event.id} className="w-[48%] mb-4">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/pages/eventsApproval/[id]",
                params: { id: event.id }, // ✅ send event ID here
              })
            }
          >
            <EventCard
              date={event.date}
              time={event.time}
              title={event.name}
              image={event.bannerUrl}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default EventList;
