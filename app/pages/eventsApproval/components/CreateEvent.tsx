import ProjectApiList from "@/app/api/ProjectApiList";
import Header from "@/app/components/Header";
import uploadApi from "@/app/utils/axiosInterceptorUpload";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
  Modal,
} from "react-native";

type FormData = {
  name: string;
  date: string;
  time: string;
  venue: string;
  upiId: string;
  description: string;
};

export default function CreateEventScreen() {
  const { api_postCreateEvents } = ProjectApiList();
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      date: "",
      time: "",
      venue: "",
      upiId: "boism-8340407179@boi",
      description: "",
    }
  });

  const [banner, setBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  const watchedDate = watch("date");
  const watchedTime = watch("time");

  // Handle date selection
  const handleDateConfirm = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const formattedDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}`;
      setValue("date", formattedDate);
      setDateModalVisible(false);
    } else {
      Alert.alert("Error", "Please select day, month, and year");
    }
  };

  // Handle time selection
  const handleTimeConfirm = () => {
    if (selectedHour && selectedMinute) {
      const formattedTime = `${selectedHour}:${selectedMinute.padStart(2, '0')} ${selectedPeriod}`;
      setValue("time", formattedTime);
      setTimeModalVisible(false);
    } else {
      Alert.alert("Error", "Please select hour and minute");
    }
  };
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

  // Create Event API Call
  const onSubmit = async (data: FormData) => {
    if (!banner) {
      Alert.alert("Validation Error", "Please upload a banner image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("time", data.time);
      formData.append("venue", data.venue);
      formData.append("upiId", data.upiId);

      if (banner) {
        const fileType = banner.split(".").pop();
        formData.append("banner", {
          uri: banner,
          name: `banner.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const res = await uploadApi.post(api_postCreateEvents, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
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
            <Controller
              control={control}
              name="name"
              rules={{ required: "Event name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. June 1st Meeting"
                  placeholderTextColor="#9ca3af"
                  className="text-gray-700"
                />
              )}
            />
            {errors.name && <Text className="text-red-500 text-sm mt-1">{errors.name.message}</Text>}
          </View>

          {/* Date */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">Date</Text>
            <TouchableOpacity onPress={() => setDateModalVisible(true)}>
              <View className="py-2">
                <Text className={watchedDate ? "text-gray-700" : "text-gray-400"}>
                  {watchedDate || "Select date (DD/MM/YYYY)"}
                </Text>
              </View>
            </TouchableOpacity>
            {errors.date && <Text className="text-red-500 text-sm mt-1">{errors.date.message}</Text>}
          </View>

          {/* Time */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">Time</Text>
            <TouchableOpacity onPress={() => setTimeModalVisible(true)}>
              <View className="py-2">
                <Text className={watchedTime ? "text-gray-700" : "text-gray-400"}>
                  {watchedTime || "Select time"}
                </Text>
              </View>
            </TouchableOpacity>
            {errors.time && <Text className="text-red-500 text-sm mt-1">{errors.time.message}</Text>}
          </View>

          {/* Venue */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">Venue</Text>
            <Controller
              control={control}
              name="venue"
              rules={{ required: "Venue is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. Community Hall"
                  placeholderTextColor="#9ca3af"
                  className="text-gray-700"
                />
              )}
            />
            {errors.venue && <Text className="text-red-500 text-sm mt-1">{errors.venue.message}</Text>}
          </View>

          {/* UPI ID */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">UPI ID</Text>
            <Controller
              control={control}
              name="upiId"
              rules={{ required: "UPI ID is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. yourupi@bank"
                  placeholderTextColor="#9ca3af"
                  className="text-gray-700"
                  editable={false}
                  style={{ backgroundColor: '#f9fafb' }}
                />
              )}
            />
          </View>

          {/* Description */}
          <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
            <Text className="text-gray-800 font-medium mb-1">
              Description of the Event
            </Text>
            <Controller
              control={control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter description"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  className="text-gray-700"
                />
              )}
            />
            {errors.description && <Text className="text-red-500 text-sm mt-1">{errors.description.message}</Text>}
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

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className={`${loading ? "bg-gray-400" : "bg-blue-600"
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

      {/* Date Modal */}
      <Modal visible={dateModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-xl p-6">
            <Text className="text-lg font-semibold mb-4">Select Date</Text>
            
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm text-gray-600 mb-1">Day</Text>
                <TextInput
                  value={selectedDay}
                  onChangeText={setSelectedDay}
                  placeholder="DD"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={2}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-center"
                  style={{ color: '#374151' }}
                />
              </View>
              <View className="flex-1 mx-1">
                <Text className="text-sm text-gray-600 mb-1">Month</Text>
                <TextInput
                  value={selectedMonth}
                  onChangeText={setSelectedMonth}
                  placeholder="MM"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={2}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-center"
                  style={{ color: '#374151' }}
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-1">Year</Text>
                <TextInput
                  value={selectedYear}
                  onChangeText={setSelectedYear}
                  placeholder="YYYY"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={4}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-center"
                  style={{ color: '#374151' }}
                />
              </View>
            </View>
            
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setDateModalVisible(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDateConfirm}
                className="px-4 py-2 bg-blue-600 rounded-lg ml-2"
              >
                <Text className="text-white">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Modal */}
      <Modal visible={timeModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-xl p-6">
            <Text className="text-lg font-semibold mb-4">Select Time</Text>
            
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm text-gray-600 mb-1">Hour</Text>
                <TextInput
                  value={selectedHour}
                  onChangeText={setSelectedHour}
                  placeholder="12"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={2}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-center"
                  style={{ color: '#374151' }}
                />
              </View>
              <View className="flex-1 mx-1">
                <Text className="text-sm text-gray-600 mb-1">Minute</Text>
                <TextInput
                  value={selectedMinute}
                  onChangeText={setSelectedMinute}
                  placeholder="00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={2}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-center"
                  style={{ color: '#374151' }}
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-1">Period</Text>
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => setSelectedPeriod("AM")}
                    className={`flex-1 py-2 rounded-l-lg border ${selectedPeriod === "AM" ? "bg-blue-600 border-blue-600" : "bg-gray-100 border-gray-300"}`}
                  >
                    <Text className={`text-center ${selectedPeriod === "AM" ? "text-white" : "text-gray-700"}`}>AM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedPeriod("PM")}
                    className={`flex-1 py-2 rounded-r-lg border ${selectedPeriod === "PM" ? "bg-blue-600 border-blue-600" : "bg-gray-100 border-gray-300"}`}
                  >
                    <Text className={`text-center ${selectedPeriod === "PM" ? "text-white" : "text-gray-700"}`}>PM</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setTimeModalVisible(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleTimeConfirm}
                className="px-4 py-2 bg-blue-600 rounded-lg ml-2"
              >
                <Text className="text-white">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
