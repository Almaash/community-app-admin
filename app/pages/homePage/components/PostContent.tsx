import React from "react";
import { View, Text } from "react-native";

type PostContentProps = {
  content: string;
};

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  if (!content) return null;
  return (
    <View className="px-4 pb-3">
      <Text className="text-gray-800 text-base leading-5">{content}</Text>
    </View>
  );
};

export default PostContent;
