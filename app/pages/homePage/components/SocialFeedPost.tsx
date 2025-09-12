import React from "react";
import { View } from "react-native";
import PostActions from "./PostActions";
import PostContent from "./PostContent";
import PostEngagement from "./PostEngagement";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";

type Post = {
  id: number;
  profileName: string;
  timestamp: string;
  role: string;
  content: string;
  likes: number;
  comments: number;
  hasImage: boolean;
  avatar: string;
  imageUrl?: string;
};

type SocialFeedPostProps = {
  post: Post;
  fetchPosts: () => Promise<void>
};

const SocialFeedPost: React.FC<SocialFeedPostProps> = ({ post,fetchPosts }) => {
  // console.log(post,"==========================================>")
  return (
    <View className="bg-white border-b border-gray-200 pb-4 mb-4">
      <PostHeader
        avatar={post.avatar}
        profileName={post.profileName}
        role={post.role}
        timestamp={post.timestamp}
        id={post.id}
      />
      <PostContent content={post.content} />
      {post.hasImage && post.imageUrl && <PostImage imageUrl={post.imageUrl} />}
      {/* <PostEngagement likes={post.likes} comments={post.comments} /> */}
      <PostActions id={post.id} likes={post.likes} comments={post.comments} fetchPosts={fetchPosts} />
    </View>
  );
};

export default SocialFeedPost;
