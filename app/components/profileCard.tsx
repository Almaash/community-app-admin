import { useFocusEffect } from "expo-router";
import { Download } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProjectApiList from "../api/ProjectApiList";
import ApiService from "../utils/axiosInterceptor";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

interface IDCardModalProps {
  visible: boolean;
  onClose: () => void;
}

const IDCardModal: React.FC<IDCardModalProps> = ({ visible, onClose }) => {
  const { api_getProfileCardData } = ProjectApiList();
  const [loading, setLoading] = useState(false);
  const [profileCardData, setProfileCardData] = useState<any>(null); // type as needed

  const cardRef = useRef(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useFocusEffect(
    useCallback(() => {
      const fetchProfileCardData = async () => {
        try {
          setLoading(true);
          const res = await ApiService.get(`${api_getProfileCardData}`);
          setProfileCardData(res?.data?.data);
        } catch (err) {
          console.error("Error fetching profile card data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfileCardData();
    }, [api_getProfileCardData])
  );

  const handleSaveToGallery = async () => {
    try {
      // Ask permission if not granted
      if (!permissionResponse?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert(
            "Permission Denied",
            "Cannot save image without permission."
          );
          return;
        }
      }

      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Card saved to gallery!");
    } catch (error) {
      console.error("Error saving to gallery:", error);
      Alert.alert("Error", "Could not save image.");
    }
  };


  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View ref={cardRef} collapsable={false} className="flex-1 bg-black/80 justify-center items-center px-4">
        <SafeAreaView className="bg-white rounded-2xl overflow-hidden w-full max-w-sm shadow-lg">
          {/* Top Pattern */}
          <Image
            source={require("@/assets/images/profiletop.png")}
            className="w-full"
            resizeMode="cover"
          />

          {/* Profile Picture */}
          <Image
            source={{
              uri:
                profileCardData?.ownerImage ||
                "https://via.placeholder.com/150",
            }}
            className="absolute top-20 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-gray-300 border-4 border-white"
            resizeMode="cover"
          />

          {/* Info */}
          <View className="pt-16 px-6">
            <Text className="text-3xl font-bold text-black text-center">
              {profileCardData?.firstName} {profileCardData?.lastName}
            </Text>
            <Text className="text-blue-600 text-center font-medium mb-6 pt-1">
              {profileCardData?.businessName}
            </Text>

            {/* Personal Details */}
            <View className="mb-6 mx-10 space-y-2">
              <View className="flex-row">
                <Text className="font-medium text-gray-800 w-1/2">DOB</Text>
                <Text className="text-gray-700 w-1/2">
                  {profileCardData?.dob}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium text-gray-800 w-1/2">
                  Blood Grp
                </Text>
                <Text className="text-gray-700 w-1/2">
                  {profileCardData?.dob}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium text-gray-800 w-1/2">Phone</Text>
                <Text className="text-gray-700 w-1/2">
                  {profileCardData?.phoneNumber}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="font-medium text-gray-800 w-1/2">E-mail</Text>
                <Text className="text-gray-700 w-1/2">
                  {profileCardData?.email}
                </Text>
              </View>
            </View>

            {/* ID */}
            <Text className="text-center font-bold text-lg text-black mb-6">
              {profileCardData?.cbaId}
            </Text>
          </View>

          {/* Bottom Pattern */}
          <Image
            source={require("@/assets/images/profilebottom.png")}
            className="w-full"
            resizeMode="cover"
          />

          {/* Save + Close */}
          <View className="flex-row justify-between items-center px-6 py-4">
            <TouchableOpacity className="flex-row items-center"  onPress={handleSaveToGallery}>
              <Download size={18} color="#4B5563" />
              <Text className="ml-2 text-sm font-medium text-gray-600">
                Save to gallery
              </Text>
            </TouchableOpacity>
            <Pressable onPress={onClose}>
              <Text className="text-red-500 font-medium text-sm">Close</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default IDCardModal;
