import ProjectApiList from "@/app/api/ProjectApiList";
import Header from "@/app/components/Header";
import uploadApi from "@/app/utils/axiosInterceptorUpload";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateEventScreen() {
  const { api_postCreateEvents } = ProjectApiList();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [upiId, setUpiId] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState<string | null>(null);
  const [qrcodeImage, setQrcodeImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick Banner Image
  const pickBanner = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Allow access to your media library."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        let localUri = result.assets[0].uri;

        if (Platform.OS === "android" && !localUri.startsWith("file://")) {
          const fileInfo = await FileSystem.getInfoAsync(localUri);
          if (!fileInfo.exists) {
            Alert.alert("Error", "Selected file not found.");
            return;
          }
          localUri = fileInfo.uri;
        }

        setBanner(localUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image.");
    }
  };

  // Pick QR Code Image
  const pickQrCode = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setQrcodeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking QR:", error);
      Alert.alert("Error", "Failed to select QR Code image.");
    }
  };

  // Create Event API Call
  const handleCreateEvent = async () => {
    if (!name || !description || !date || !time || !venue || !upiId) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return;
    }
    if (!banner) {
      Alert.alert("Validation Error", "Please upload a banner image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("venue", venue);
      formData.append("upiId", upiId);

      // Banner Image
      if (banner) {
        const fileType = banner.split(".").pop();
        formData.append("banner", {
          uri: banner,
          name: `banner.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      // QR Code Image
      if (qrcodeImage) {
        const fileType = qrcodeImage.split(".").pop();
        formData.append("qrcodeImage", {
          uri: qrcodeImage,
          name: `qrcode.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }
      // console.log(formData,"formData =============>")

      const res = await uploadApi.post(api_postCreateEvents, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // console.log(res,"res=============>")

      if (res?.data?.status) {
        Alert.alert("Success", "Event created successfully!");
        router.back();
      } else {
        Alert.alert("Error", res?.data?.message || "Failed to create event.");
      }
    } catch (error: any) {
      console.error("Create Event Error:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Create Event" }} />
      <Header />

      <ScrollView className="flex-1 px-6">
        <View>
          {/* Heading */}
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Create Event
          </Text>
          <Text className="text-gray-500 mb-6 leading-5 text-center">
            Fill in the data for Event Creation.{"\n"}
            You only need a few details to launch an Event!!
          </Text>

          {/* Event Name */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">
              Full Name of the Event
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. June 1st Meeting"
              placeholderTextColor="#9ca3af"
              className="text-gray-700"
            />
          </View>

          {/* Date */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">Date</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="e.g. 7th June, 2025"
              placeholderTextColor="#9ca3af"
              className="text-gray-700"
            />
          </View>

          {/* Time */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">Time</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="e.g. 1:00 PM"
              placeholderTextColor="#9ca3af"
              className="text-gray-700"
            />
          </View>

          {/* Venue */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">Venue</Text>
            <TextInput
              value={venue}
              onChangeText={setVenue}
              placeholder="e.g. Community Hall"
              placeholderTextColor="#9ca3af"
              className="text-gray-700"
            />
          </View>

          {/* UPI ID */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">UPI ID</Text>
            <TextInput
              value={upiId}
              onChangeText={setUpiId}
              placeholder="e.g. yourupi@bank"
              placeholderTextColor="#9ca3af"
              className="text-gray-700"
            />
          </View>

          {/* Description */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">
              Description of the Event
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="text-gray-700"
            />
          </View>

          {/* Upload Banner */}
          <Text className="text-sm text-gray-600 mb-1">Upload Event Banner</Text>
          <TouchableOpacity
            onPress={pickBanner}
            className="border border-dashed border-gray-400 rounded-lg h-40 items-center justify-center mb-6 relative"
          >
            {banner ? (
              <>
                <Image
                  source={{ uri: banner }}
                  className="w-full h-full rounded-lg"
                />
                <TouchableOpacity
                  onPress={() => setBanner(null)}
                  className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                  style={{ zIndex: 10 }}
                >
                  <Ionicons name="close" size={20} color="black" />
                </TouchableOpacity>
              </>
            ) : (
              <View className="items-center">
                <Ionicons
                  name="cloud-upload-outline"
                  size={30}
                  color="#9CA3AF"
                />
                <Text className="text-gray-500 mt-1">Upload Banner</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Upload QR Code */}
          <Text className="text-sm text-gray-600 mb-1">Upload QR Code</Text>
          <TouchableOpacity
            onPress={pickQrCode}
            className="border border-dashed border-gray-400 rounded-lg h-40 items-center justify-center mb-8 relative"
          >
            {qrcodeImage ? (
              <>
                <Image
                  source={{ uri: qrcodeImage }}
                  className="w-full h-full rounded-lg"
                />
                <TouchableOpacity
                  onPress={() => setQrcodeImage(null)}
                  className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                  style={{ zIndex: 10 }}
                >
                  <Ionicons name="close" size={20} color="black" />
                </TouchableOpacity>
              </>
            ) : (
              <View className="items-center">
                <Ionicons
                  name="qr-code-outline"
                  size={30}
                  color="#9CA3AF"
                />
                <Text className="text-gray-500 mt-1">Upload QR</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleCreateEvent}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-600"
            } py-4 rounded-lg shadow-md mb-10`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Create Event →
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
