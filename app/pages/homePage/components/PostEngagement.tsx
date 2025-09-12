import React from "react";
import { View, Text } from "react-native";

type PostEngagementProps = {
  likes: number;
  comments: number;
};

const PostEngagement: React.FC<PostEngagementProps> = ({ likes, comments }) => {
  if (likes === 0 && comments === 0) return null;

  return (
    <View className="px-4 pb-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {likes > 0 && (
            <View className="flex-row items-center">
              <View className="w-5 h-5 flex items-center justify-center">
                <Text className="text-white text-xs">👍</Text>
              </View>
              <Text className="text-gray-600 text-sm ml-2">{likes}</Text>
            </View>
          )}
        </View>
        {comments > 0 && (
          <Text className="text-gray-600 text-sm">{comments} comments</Text>
        )}
      </View>
    </View>
  );
};

export default PostEngagement;
