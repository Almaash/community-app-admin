import React from "react";
import { View, Image } from "react-native";

type PostImageProps = {
  imageUrl: string;
};

const PostImage: React.FC<PostImageProps> = ({ imageUrl }) => {
  if (!imageUrl) return null;
  return (
    <View className="px-4 pb-3">
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-48 bg-gray-300 rounded-lg"
        resizeMode="cover"
      />
    </View>
  );
};

export default PostImage;
