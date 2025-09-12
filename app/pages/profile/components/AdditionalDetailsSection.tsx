import ProjectApiList from "@/app/api/ProjectApiList";
import ApiService from "@/app/utils/axiosInterceptor";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";

const AdditionalDetailsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const { api_get_user_data } = ProjectApiList();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const profileId: any = 1;

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await ApiService.get(api_get_user_data);
      setProfileData(res.data?.data);
    } catch (err) {
      console.error("❌ GET failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (isVisible && !profileData) {
      getProfile();
    }
  }, [isVisible]);

  // 👇 Refetch profileData every time screen regains focus
  useFocusEffect(
    useCallback(() => {
      if (isVisible) {
        getProfile();
      }
    }, [isVisible])
  );

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 830],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsVisible(!isVisible)}
        className="flex-row items-center justify-between py-4 border-t border-gray-200"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-3 w-3/4">
          <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
            <Ionicons name="person-outline" size={16} color="#666" />
          </View>
          <View>
            <Text className="font-medium text-black">Additional Details</Text>
            <Text className="text-sm text-gray-500">
              Details about personal and other relevant information
            </Text>
          </View>
        </View>
        <Ionicons
          name={isVisible ? "chevron-up" : "chevron-forward"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {/* Animated View */}
      <Animated.View style={{ overflow: "hidden", maxHeight, opacity }}>
        {loading ? (
          <View className="p-6 items-center">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="mt-2 text-gray-600">Loading...</Text>
          </View>
        ) : (
          profileData && (
            <>
              <View className="bg-white border border-gray-200 rounded-xl mt-2 divide-y divide-gray-200">
                <DetailRow label="CBA ID" value={profileData.cbaId || "—"} />
                <DetailRow label="Type Of Business" value={profileData.businessType || "—"} />
                <DetailRow label="Business Description" value={profileData.businessDescription || "—"} />
                <DetailRow label="Email" value={profileData.email || "—"} />
              </View>

              <View className="bg-white border border-gray-200 rounded-xl mt-2 divide-y divide-gray-200">
                <DetailRow label="DOB" value={profileData.dob || "—"} />
                <DetailRow label="Blood Group" value={profileData.bloodGroup || "—"} />
                <DetailRow label="Phone Number" value={profileData.phoneNumber || "—"} />
              </View>

              <View className="bg-white border border-gray-200 rounded-xl mt-2 divide-y divide-gray-200">
                <DetailRow label="Father Name" value={profileData.fatherName || "—"} />
                <DetailRow label="Mother’s Name" value={profileData.motherName || "—"} />
                <DetailRow label="Father’s Occupation" value={profileData.fatherOccupation || "—"} />
                <DetailRow label="Spouse" value={profileData.spouse || "—"} />
              </View>

              <View className="bg-white border border-gray-200 rounded-xl mt-2">
                <TouchableOpacity
                  className="bg-blue-600 px-4 py-3 rounded-md items-center"
                  onPress={() =>
                    router.push({
                      pathname: "/pages/profile/components/[id]",
                      params: {
                        id: profileId.toString(),
                        data: JSON.stringify(profileData),
                      },
                    })
                  }
                >
                  <Text className="text-white font-semibold">Edit</Text>
                </TouchableOpacity>
              </View>
            </>
          )
        )}
      </Animated.View>
    </View>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View className="p-4">
    <Text className="font-semibold text-gray-800">{label}</Text>
    <Text className="text-gray-600 mt-1">{value}</Text>
  </View>
);

export default AdditionalDetailsSection;
