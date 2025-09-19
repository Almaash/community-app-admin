import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import {
  LayoutAnimation,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  search: string;
  setSearch: (val: string) => void;
};

const CommunityFilter = ({ search, setSearch }: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

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
          Search Community
        </Text>
        <FontAwesome
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={16}
          color="#0b64f4"
        />
      </TouchableOpacity>

      {/* Expandable Search Section */}
      {isExpanded && (
        <View className="px-4 pb-4">
          <View className="flex-row items-center border border-gray-300 px-3 py-1 mb-3 rounded-xl">
            <FontAwesome name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search by name"
              value={search}
              onChangeText={setSearch}
              className="ml-2 flex-1 text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CommunityFilter;
