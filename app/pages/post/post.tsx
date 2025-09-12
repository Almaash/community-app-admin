import ProjectApiList from "@/app/api/ProjectApiList";
import api from "@/app/utils/axiosInterceptor";
import uploadApi from "@/app/utils/axiosInterceptorUpload";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function PostCreationScreen() {
  const { api_postFeed } = ProjectApiList();

  const [postText, setPostText] = useState("");
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleMediaPick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Allow access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets[0]);
    }
  };

  const removeMedia = () => {
    setMedia(null);
  };

const onSubmit = async () => {
  if (!postText.trim()) {
    Alert.alert("Validation", "Please enter a description.");
    return;
  }

  if (!media) {
    Alert.alert("Validation", "Media file is required.");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("description", postText);

    const originalUri = media.uri;
    const fileName = media.fileName || originalUri.split("/").pop() || "upload.jpg";
    const mimeType = media.type === "video" ? "video/mp4" : "image/jpeg";

    let fileUri = originalUri;

    // ✅ Android: Resolve file info using FileSystem
    if (Platform.OS === "android") {
      const fileInfo = await FileSystem.getInfoAsync(originalUri);
      if (!fileInfo.exists) {
        throw new Error("Selected file not found.");
      }
      fileUri = fileInfo.uri;
    }

    formData.append("media", {
      uri: fileUri,
      type: mimeType,
      name: fileName,
    } as any);

    const res = await uploadApi.post(api_postFeed, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Success:", res.data);
    Alert.alert("Success", "Post submitted successfully!");
    router.back();
  } catch (err: any) {
    console.error("❌ Error:", err?.message || err);
    Alert.alert("Error", err?.response?.data?.message || "Upload failed. Please try again.");
  } finally {
    setLoading(false);
  }
};




  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />

        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {/* Header */}
          <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={() => router.back()} className="px-1">
              <Ionicons name="close" size={30} color="#3a4045" />
            </TouchableOpacity>
            <Text className="text-2xl font-semibold pl-5">Post</Text>
          </View>

          {/* Main Input */}
          <View className="px-4 pt-6 bg-white">
            <View className="flex-row items-center mb-4">
              <View className="w-14 h-14 bg-gray-300 rounded-full mr-3" />
              <View>
                <Text className="text-xl font-semibold text-gray-900">Profile Name</Text>
                <Text className="text-base text-gray-500">Business Owner</Text>
              </View>
            </View>

            <TextInput
              className="text-xl text-gray-700 mb-4 pl-2 pt-2 bg-gray-100 rounded"
              placeholder="What do you want to talk about?"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
              value={postText}
              onChangeText={setPostText}
              style={{ padding: 0, textAlignVertical: "top", minHeight: 250 }}
            />

            {/* Show Selected Media Preview */}
            {media && (
              <View className="relative mt-2">
                {media.type === "image" ? (
                  <Image
                    source={{ uri: media.uri }}
                    style={{ width: "100%", height: 200, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-40 rounded-md bg-gray-200 justify-center items-center">
                    <Text className="text-gray-600 text-lg">📹 Video selected</Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={removeMedia}
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                >
                  <Ionicons name="close" size={20} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Media Picker */}
          <View className="px-6 pt-6">
            <TouchableOpacity onPress={handleMediaPick} className="flex-row items-center mb-4">
              <Ionicons name="image" size={24} color="gray" />
              <Text className="text-lg text-gray-700 pl-3">Add a photo or video</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <View className="px-6 mt-4 mb-10">
            <TouchableOpacity
              className="bg-blue-600 rounded-full py-3 px-6 flex-row items-center justify-center"
              onPress={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-base">Send for Approval</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
