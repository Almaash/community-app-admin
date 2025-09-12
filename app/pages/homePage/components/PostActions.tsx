import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import api from "@/app/utils/axiosInterceptor";
import ProjectApiList from "@/app/api/ProjectApiList";
// import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import { Platform, Share as NativeShare } from "react-native";

const PostActions = ({ id, fetchPosts, likes, comments }: any) => {
  const { api_postFeed } = ProjectApiList();
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmPoints = async () => {
    try {
      const response = await api.post(`${api_postFeed}/${id}/like`, {});
      fetchPosts();
      console.log("✅ Like updated", response.data);
    } catch (error: any) {
      console.log("❌ Error:", error?.response || error);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${api_postFeed}/${id}/comments`);
      fetchPosts();
      setCommentList(res?.data?.data || []);
    } catch (error) {
      console.log("❌ Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) fetchComments();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`${api_postFeed}/${id}/comment`, { text: newComment });

      setNewComment("");
      fetchPosts();
      fetchComments(); // Refresh comments
    } catch (error) {
      console.log("❌ Error adding comment:", error);
    }
  };

  const handleShare = async () => {
    const message = `Check out this post! https://yourapp.com/post/${id}`;

    try {
      if (Platform.OS === "web") {
        await Linking.openURL(
          `https://wa.me/?text=${encodeURIComponent(message)}`
        );
      } else {
        await NativeShare.share({ message });
      }
    } catch (error) {
      console.error("❌ Share error:", error);
    }
  };
  return (
    <View className="border-t border-gray-200 pt-2 mx-4">
      <View className="flex-row justify-between px-4">
        {/* Left side: Like and Comment */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={handleConfirmPoints}
            className="flex-row items-center justify-center py-2 mr-4"
          >
            <Text className="text-gray-600 text-sm mr-1">👍{likes}</Text>
            <Text className="text-gray-600 text-sm font-medium">Like</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToggleComments}
            className="flex-row items-center justify-center py-2"
          >
            <Text className="text-gray-600 text-sm mr-1">💬</Text>
            <Text className="text-gray-600 text-sm font-medium">
              Comment {comments}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Right side: Share */}
        <TouchableOpacity
          onPress={handleShare}
          className="flex-row items-center justify-center py-2"
        >
          <Text className="text-gray-600 text-sm mr-1">↗️</Text>
          <Text className="text-gray-600 text-sm font-medium">Share</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View className="mt-2">
          <ScrollView className="max-h-64 px-2" nestedScrollEnabled>
            {loading ? (
              <Text className="text-gray-500 text-center my-2">
                Loading comments...
              </Text>
            ) : commentList.length === 0 ? (
              <Text className="text-gray-500 text-center my-2">
                No comments yet.
              </Text>
            ) : (
              commentList.map((comment: any, idx: number) => (
                <View key={idx} className="border-b border-gray-200 py-2">
                  <Text className="font-semibold text-gray-800">
                    {comment.username || "User"}
                  </Text>
                  <Text className="text-gray-600">{comment.text}</Text>
                </View>
              ))
            )}
          </ScrollView>

          <View className="flex-row items-center border-t mt-2 pt-2 px-2">
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 px-3 py-2 rounded-full mr-2"
            />
            <TouchableOpacity onPress={handleAddComment}>
              <Text className="text-blue-600 font-medium">Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default PostActions;
