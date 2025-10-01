import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";
import ApiService from "@/app/utils/axiosInterceptor";
import ProjectApiList from "@/app/api/ProjectApiList";

export default function PostApprovalScreen() {
  const { id } = useLocalSearchParams();
  const { api_updatePostStatus, api_getPostByID } = ProjectApiList();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  // image loading state
  const [imageLoading, setImageLoading] = useState(false);

  // Fetch post by ID
  const fetchPost = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await ApiService.get(`${api_getPostByID}/${id}`);
      setPost(res.data?.data || null);
    } catch (err) {
      console.error("❌ Failed to fetch post", err);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // Open modal for reject
  const openModal = (type: "approve" | "reject") => {
    setActionType(type);
    setShowModal(true);
  };

  // Approve or reject post
  const handleConfirm = async () => {
    if (actionType === "reject" && !reason) {
      alert("Please enter a reason for rejection");
      return;
    }

    const payload =
      actionType === "approve"
        ? { status: "approved" }
        : { status: "rejected", remark: reason };

    try {
      await ApiService.post(`${api_updatePostStatus}/${id}/update-status`, payload);
      setShowModal(false);
      setReason("");
      fetchPost(); // refresh data
    } catch (err) {
      console.error("❌ Failed to update post", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-500">Loading post...</Text>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Post not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-600">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="h-56 bg-gray-200 relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-14 left-4 bg-white/80 rounded-full p-2"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="absolute -bottom-12 left-4">
            <Image
              source={{ uri: post?.userImage }}
              className="w-36 h-36 rounded-full border-4 border-white"
            />
          </View>
        </View>

        {/* User Info */}
        <View className="mt-16 px-8 border-b border-gray-200 pb-4">
          <Text className="text-xl font-bold">{post?.username}</Text>
          <Text className="text-base text-gray-600 mt-1">Type: {post?.postType}</Text>
          <Text className="text-base text-gray-600 mt-1">Status: {post?.status}</Text>
        </View>

        {/* Post Content */}
        <View className="px-8 py-8">
          <Text className="text-lg font-semibold mb-2">Post Media & Description</Text>
          <Text className="text-base text-gray-600 mt-1 mb-1">{post?.description}</Text>
          {post?.mediaUrl ? (
            <View className="w-full h-48 rounded-lg bg-gray-300 items-center justify-center">
              {imageLoading && <ActivityIndicator size="large" color="#3B82F6" />}
              <Image
                source={{ uri: post.mediaUrl }}
                className="w-full h-48 rounded-lg"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
            </View>
          ) : (
            <Text className="text-gray-500">No media available</Text>
          )}
        </View>

        {/* Buttons */}
        {post.status !== "approved" && post.status !== "rejected" && (
          <View className="flex-row justify-between px-4 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={() => openModal("approve")}
              className="flex-1 ml-2 bg-blue-600 py-4 rounded-lg items-center"
            >
              <Text className="text-lg text-white font-medium">Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openModal("reject")}
              className="flex-1 ml-2 bg-red-600 py-4 rounded-lg items-center"
            >
              <Text className="text-white font-medium">Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal */}
        <Modal visible={showModal} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <BlurView intensity={100} tint="dark" className="flex-1 justify-center items-center px-6">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="bg-white w-full rounded-xl p-6">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold">Post Action</Text>
                    <TouchableOpacity onPress={() => setShowModal(false)}>
                      <Ionicons name="close" size={22} color="gray" />
                    </TouchableOpacity>
                  </View>

                  {post.status === "approved" || post.status === "rejected" ? (
                    <TouchableOpacity
                      onPress={() => setShowModal(false)}
                      className="mt-2 border border-gray-300 py-3 rounded-lg items-center"
                    >
                      <Text className="text-gray-700 font-medium">Back</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      {actionType === "reject" && (
                        <>
                          <Text className="text-gray-600 mb-2">
                            Enter Detailed Reason for rejection
                          </Text>
                          <TextInput
                            multiline
                            value={reason}
                            onChangeText={setReason}
                            placeholder="Write your reason here..."
                            className="border border-gray-300 rounded-lg p-3 text-gray-700 h-32 mb-4"
                          />
                        </>
                      )}
                      <TouchableOpacity
                        onPress={handleConfirm}
                        className="mt-2 bg-blue-600 py-3 rounded-lg items-center"
                      >
                        <Text className="text-white font-semibold">
                          {actionType === "approve" ? "Approve" : "Submit Rejection"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setShowModal(false)}
                        className="mt-2 border border-gray-300 py-3 rounded-lg items-center"
                      >
                        <Text className="text-gray-700 font-medium">Back</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </BlurView>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
