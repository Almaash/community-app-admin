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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { BlurView } from "expo-blur";

export default function PostApprovalScreen() {
  // ✅ Demo JSON data
  const demoPost = {
    id: "1",
    profileName: "PROFILE NAME",
    profileImage:
      "https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,g_face/sample.jpg",
    businessName: "Business Name",
    city: "City",
    state: "State",
    points: 2900,
    referrals: 4,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Nisi ut aliquip ex ea commodo consequat.",
    imageUrl: "https://via.placeholder.com/300x150.png?text=Post+Image",
  };

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setPost(demoPost);
      setLoading(false);
    }, 800);
  }, []);

  const handleApprove = () => {
    setShowModal(true); // ✅ open modal instead of alert
  };

  const handleConfirm = () => {
    console.log("Approved with reason:", reason);
    setShowModal(false);
    router.back();
  };
  const handleReject = () => {
    console.log("Rejjected with reason:", reason);
    setShowModal(false);
    router.back();
  };

  const handleCancel = () => {
    setShowModal(false);
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-500">Loading post...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header background */}
      <View className="h-56 bg-gray-200 relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-14 left-4 bg-white/80 rounded-full p-2"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Profile Image */}
        <View className="absolute -bottom-12 left-4">
          <Image
            source={{ uri: post?.profileImage }}
            className="w-36 h-36 rounded-full border-4 border-white"
          />
        </View>
      </View>

      {/* Profile Section */}
      <View className="mt-16 px-8 border-b border-gray-200 pb-4">
        <Text className="text-xl font-bold">{post?.profileName}</Text>
        <Text className="text-base text-gray-600">
          {post?.businessName} • {post?.city}, {post?.state}
        </Text>
        <Text className="text-base text-blue-600 mt-1">
          {post?.points.toLocaleString()} Points • {post?.referrals} Referral
        </Text>
      </View>

      {/* Post Details */}
      <View className="px-8 py-8 flex-1">
        <Text className="text-lg font-semibold mb-2">Post Details</Text>
        <Text className="text-base text-gray-700 mb-3 leading-relaxed">
          {post?.description}
        </Text>
        {post?.imageUrl && (
          <Image
            source={{ uri: post?.imageUrl }}
            className="w-full h-48 rounded-lg bg-gray-300"
          />
        )}
      </View>

      {/* Buttons */}
      <View className="flex-row justify-between px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleCancel}
          className="flex-1 mr-2 border border-gray-400 py-4 rounded-lg items-center"
        >
          <Text className="text-lg text-gray-700 font-medium">Cancel Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleApprove}
          className="flex-1 ml-2 bg-blue-600 py-4 rounded-lg items-center"
        >
          <Text className="text-lg text-white font-medium">Approve</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Modal */}

      <Modal visible={showModal} transparent animationType="fade">
        {/* Background Blur */}
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <BlurView
            intensity={100}
            tint="dark"
            className="flex-1 justify-center items-center px-6"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="bg-white w-full rounded-xl p-6">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold">Post Details</Text>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Ionicons name="close" size={22} color="gray" />
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-600 mb-2">
                  Enter Detailed Reason for rejecting the Post
                </Text>

                <Text className="text-sm font-medium mb-2">Enter Details</Text>
                <TextInput
                  multiline
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Write your reason here..."
                  className="border border-gray-300 rounded-lg p-3 text-gray-700 h-32"
                />

                {/* Buttons */}
                <TouchableOpacity
                  onPress={handleConfirm} // ✅ approve handler
                  className="mt-4 bg-blue-600 py-3 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold">Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleReject} // ✅ separate reject handler
                  className="mt-4 bg-red-600 py-3 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold">Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  className="mt-2 border border-gray-300 py-3 rounded-lg items-center"
                >
                  <Text className="text-gray-700 font-medium">Back</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}
