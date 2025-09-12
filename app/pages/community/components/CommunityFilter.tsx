import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FILTERS = ["Name", "Location", "Service", "Product", "CBA ID"];

const CommunityFilter = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Name");

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  };

  return (
    <View className="bg-white border-b border-gray-200 shadow-sm">
      {/* Header */}
      <TouchableOpacity
        className="flex-row items-center justify-between px-4 py-4"
        onPress={toggleExpand}
      >
        <Text className="text-blue-800 text-lg font-semibold">
          Filter Community
        </Text>
        <FontAwesome
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={16}
          color="#0b64f4"
        />
      </TouchableOpacity>

      {/* Expandable Filter Section */}
      {isExpanded && (
        <View className="px-4 pb-4">
          {/* Search Bar */}
          <View className="flex-row items-center border border-gray-300  px-3 py-1 mb-3 rounded-xl">
            <FontAwesome name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search"
              value={search}
              onChangeText={setSearch}
              className="ml-2 flex-1 text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Filter Buttons */}
          <View className="flex-row flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full border ${
                    isActive
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-blue-500"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? "text-white" : "text-blue-600"
                    }`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default CommunityFilter;
