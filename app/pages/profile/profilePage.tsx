import ProjectApiList from "@/app/api/ProjectApiList";
import ProfileHeader from "@/app/components/ProfileHeader";
import ApiService from "@/app/utils/axiosInterceptor";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PaymentType {
  id: string;
  amount: number;
  status: string;
  active: boolean;
  qrImage?: string;
  createdAt: { _seconds: number; _nanoseconds: number };
}

interface UserDataType {
  firstName: string;
  lastName: string;
  banned: boolean;
  businessName: string;
  city: string;
  state: string;
  referralPoints?: number;
  referralCount?: number;
  ownerImage?: string;
  payments?: PaymentType[];
}

const ProfileScreen = () => {
  const { type, id } = useLocalSearchParams();
  const {
    api_getUserData,
    api_getOtherUserData,
    api_getOtherUserDataBan,
    api_getOtherUserDataUnBan,
    api_getOtherUserDataRemoveFeeDefaulter,
    api_getOtherUserDataFeeDefaulter,
  } = ProjectApiList();

  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [amount, setAmount] = useState("");
  const [defaulterImage, setDefaulterImage] = useState<string | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);

  const [banExpanded, setBanExpanded] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  // fetch current user data
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const apiUrl =
        type === "other" ? `${api_getOtherUserData}/${id}` : api_getUserData;
      const res = await ApiService.get(apiUrl);
      setUserData(res?.data?.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [type, id]);

  // Ban / Unban handlers
  const handleBanProfile = async () => {
    try {
      setIsLoading(true);
      await ApiService.post(`${api_getOtherUserDataBan}/${id}`, {});
      setIsBanned(true);
      Alert.alert("Success", "Profile has been banned.");
    } catch (error: any) {
      console.error("Ban Error:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to ban profile."
      );
    } finally {
      setIsLoading(false);
      fetchUserData(); // ✅ Refetch after ban
    }
  };

  const handleUnbanProfile = async () => {
    try {
      setIsLoading(true);
      await ApiService.post(`${api_getOtherUserDataUnBan}/${id}`, {});
      setIsBanned(false);
      Alert.alert("Success", "Profile has been unbanned.");
    } catch (error: any) {
      console.error("Unban Error:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to unban profile."
      );
    } finally {
      setIsLoading(false);
      fetchUserData(); // ✅ Refetch after unban
    }
  };
  // Pick image (no upload yet)
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need camera roll permissions to select an image!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setDefaulterImage(selectedAsset.uri); // keep only in state
    }
  };

  // Remove Fee Defaulter
  const handleRemoveFeeDefaulter = async () => {
    if (!editingPaymentId) {
      Alert.alert("Error", "No payment selected to remove.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await ApiService.post(
        `${api_getOtherUserDataRemoveFeeDefaulter}/${editingPaymentId}`,
        { active: false }
      );

      if (res?.data?.success) {
        setIsOn(false);
        setEditingPaymentId(null);
        Alert.alert("Success", "Profile unmarked as fee defaulter.");
      } else {
        Alert.alert("Error", res?.data?.message || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Remove Defaulter Error:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to remove fee defaulter."
      );
    } finally {
      setIsLoading(false);
      fetchUserData(); // ✅ Refresh data
    }
  };


  // Add / Update Fee Defaulter
  const handleFeeDefaulterToggle = async (newValue: boolean) => {
    if (newValue) {
      if (!amount || !defaulterImage) {
        Alert.alert(
          "Validation Error",
          "Please enter an amount and select an image before marking as defaulter."
        );
        return;
      }
    }

    try {
      setIsLoading(true);

      // build FormData
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("active", newValue ? "true" : "false");

      if (defaulterImage) {
        const uriParts = defaulterImage.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("qrImage", {
          uri: defaulterImage,
          name: `qrImage.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      let apiUrl = `${api_getOtherUserDataFeeDefaulter}/${id}`;
      if (editingPaymentId) {
        apiUrl = `${api_getOtherUserDataFeeDefaulter}/${id}/${editingPaymentId}`;
      }

      const res = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        setIsOn(newValue);
        setEditingPaymentId(null);
        Alert.alert(
          "Success",
          newValue
            ? editingPaymentId
              ? "Payment updated successfully."
              : "Profile marked as fee defaulter."
            : "Profile unmarked as fee defaulter."
        );
      } else {
        Alert.alert("Error", res?.data?.message || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Fee Defaulter Error:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
        "Failed to update fee defaulter status."
      );
    } finally {
      setIsLoading(false);
      fetchUserData(); // ✅ Always refresh data after post/update
    }
  }
  useEffect(() => {
    if (userData) {
      setIsBanned(userData?.banned === true);
    }
  }, [userData]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-2 text-gray-500">Loading profile...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          {/* Profile Section */}
          <View className="px-4 items-center mt-10">
            <View className="relative mb-4">
              <Image
                source={{
                  uri:
                    userData?.ownerImage || "https://via.placeholder.com/150",
                }}
                className="w-32 h-32 rounded-full mb-4"
              />
            </View>

            <View className="mb-6 items-center">
              <Text className="text-xl font-bold text-black mb-1 text-center">
                {userData?.firstName} {userData?.lastName}
              </Text>
              <Text className="text-gray-600 mb-2 text-center">
                <Text className="font-bold">{userData?.businessName}</Text>
                <Text>{` | ${userData?.city} | ${userData?.state}`}</Text>
              </Text>
            </View>
          </View>

          {/* Defaulter Section */}
          <View className="bg-white rounded-xl border border-gray-200 mb-4 mx-2">
            <TouchableOpacity
              className="flex-row justify-between items-center px-4 py-4"
              onPress={() => setExpanded(!expanded)}
            >
              <View>
                <Text className="text-base font-semibold text-gray-900">
                  Fees Defaulter
                </Text>
                <Text className="text-sm text-gray-500">
                  Add a Tag to the profile and mark as defaulter
                </Text>
              </View>
              <Ionicons
                name={expanded ? "chevron-down" : "chevron-forward"}
                size={20}
                color="black"
              />
            </TouchableOpacity>

            {expanded && (
              <View className="px-4 pb-4 space-y-4">
                {/* Amount input */}
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3"
                  placeholder="₹ Enter Amount"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />

                {/* Image Picker */}
                <TouchableOpacity
                  onPress={pickImage}
                  className="w-32 h-32 bg-gray-200 rounded-lg items-center justify-center"
                >
                  {defaulterImage ? (
                    <Image
                      source={{ uri: defaulterImage }}
                      className="w-32 h-32 rounded-lg"
                    />
                  ) : (
                    <Ionicons name="camera" size={28} color="#666" />
                  )}
                </TouchableOpacity>

                {/* Toggle */}
                {/* Post Defaulter Button */}
                <TouchableOpacity
                  onPress={() => handleFeeDefaulterToggle(true)}
                  className="bg-blue-600 rounded-lg px-4 py-3 mt-2"
                >
                  <Text className="text-white font-semibold text-center">
                    {editingPaymentId ? "Update Defaulter" : "Mark as Defaulter"}
                  </Text>
                </TouchableOpacity>

                {/* Remove Defaulter Button (optional if you still want to unmark) */}
                {isOn && (
                  <TouchableOpacity
                    onPress={handleRemoveFeeDefaulter}
                    className="bg-gray-500 rounded-lg px-4 py-3 mt-2"
                  >
                    <Text className="text-white font-semibold text-center">
                      Remove Defaulter
                    </Text>
                  </TouchableOpacity>
                )}



                {/* Existing Payments List */}
                {userData?.payments && userData.payments.length > 0 && (
                  <View className="mt-6 space-y-3">
                    <Text className="text-base font-semibold text-gray-900 mb-2">
                      Previous Records
                    </Text>
                    {userData.payments.map((p) => (
                      <View
                        key={p.id}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <Text className="font-semibold text-black">
                          Amount: ₹{p.amount}
                        </Text>
                        <Text className={`text-sm font-bold ${p.active ? "text-green-600" : "text-red-600"}`}>
                          Active: {p.active ? "Yes" : "No"}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {new Date(p.createdAt._seconds * 1000).toLocaleString()}
                        </Text>


                        {p.qrImage ? (
                          <Image
                            source={{ uri: p.qrImage }}
                            className="w-24 h-24 mt-2 rounded-md"
                            resizeMode="cover"
                          />
                        ) : null}

                        {/* Edit Button */}
                        <TouchableOpacity
                          onPress={() => {
                            setAmount(p.amount.toString());
                            setDefaulterImage(p.qrImage || null);
                            setIsOn(p.active);
                            setEditingPaymentId(p.id);
                            setExpanded(true);
                          }}
                          className="mt-3 bg-blue-500 rounded-lg px-3 py-2"
                        >
                          <Text className="text-white text-center text-sm font-medium">
                            Edit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Ban Section */}
          <View className="bg-white rounded-xl border border-gray-200 mb-4 mx-2">
            <TouchableOpacity
              className="flex-row justify-between items-center px-4 py-4"
              onPress={() => setBanExpanded(!banExpanded)}
            >
              <View>
                <Text className="text-base font-semibold text-gray-900">
                  Ban
                </Text>
                <Text className="text-sm text-gray-500">
                  Stop profile for using the CBA App
                </Text>
              </View>
              <Ionicons
                name={banExpanded ? "chevron-down" : "chevron-forward"}
                size={20}
                color="black"
              />
            </TouchableOpacity>

            {banExpanded && (
              <View className="px-4 pb-4 space-y-4">
                <View className="flex-row items-center px-4 py-2">
                  <Text className="font-semibold text-sm mr-3">
                    BAN PROFILE
                  </Text>
                  <Switch
                    value={isBanned}
                    onValueChange={(newValue) => {
                      if (newValue) {
                        Alert.alert(
                          "Confirm Ban",
                          "Are you sure you want to ban this profile?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Yes, Ban",
                              style: "destructive",
                              onPress: () => handleBanProfile(),
                            },
                          ]
                        );
                      } else {
                        Alert.alert(
                          "Confirm Unban",
                          "Are you sure you want to unban this profile?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Yes, Unban",
                              onPress: () => handleUnbanProfile(),
                            },
                          ]
                        );
                      }
                    }}
                    thumbColor={isBanned ? "#fff" : "#f4f3f4"}
                    trackColor={{ false: "#d1d5db", true: "#ef4444" }}
                    style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default ProfileScreen;
