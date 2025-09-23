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
  Modal,
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
  screenshot?: string;
  description?: string;
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
    api_postApprovePaymentDefaulter
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

  // modal state
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);
  const [approveAmount, setApproveAmount] = useState("");

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
      fetchUserData();
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
      fetchUserData();
    }
  };

  // Pick image
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
      setDefaulterImage(selectedAsset.uri);
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

      if (res?.data?.status) {
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
      fetchUserData();
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

      if (res?.data?.status) {
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
      fetchUserData();
    }
  };

  // Approve Defaulter Payment
  const handleApprovePayment = async () => {
    if (!selectedPayment) return;

    if (!approveAmount) {
      Alert.alert("Validation", "Please enter an amount.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await ApiService.post(
        `${api_postApprovePaymentDefaulter}/${selectedPayment.id}`,
        { amount: Number(approveAmount) }
      );
      console.log(res?.data)

      if (res?.data?.status) {
        Alert.alert("Success", "Payment approved successfully.");
        setSelectedPayment(null);
        fetchUserData();
      } else {
        Alert.alert("Error", res?.data?.message || "Approval failed.");
      }
    } catch (error: any) {
      console.error("Approval Error:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to approve payment."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            <Image
              source={{
                uri: userData?.ownerImage || "https://via.placeholder.com/150",
              }}
              className="w-32 h-32 rounded-full mb-4 border-4 border-blue-100"
            />
            <Text className="text-xl font-bold text-black mb-1 text-center">
              {userData?.firstName} {userData?.lastName}
            </Text>
            <Text className="text-gray-600 mb-2 text-center">
              <Text className="font-bold">{userData?.businessName}</Text>
              <Text>{` | ${userData?.city} | ${userData?.state}`}</Text>
            </Text>
          </View>

          {/* Fees Defaulter Section */}
          <View className="bg-white rounded-xl shadow-md mb-4 mx-3">
            <TouchableOpacity
              className="flex-row justify-between items-center px-4 py-4"
              onPress={() => setExpanded(!expanded)}
            >
              <View>
                <Text className="text-lg font-bold text-gray-900">
                  Fees Defaulter
                </Text>
                <Text className="text-sm text-gray-500">
                  Manage fee defaulter records
                </Text>
              </View>
              <Ionicons
                name={expanded ? "chevron-down" : "chevron-forward"}
                size={20}
                color="black"
              />
            </TouchableOpacity>

            {expanded && (
              <View className="px-4 pb-6 space-y-4">
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3 bg-gray-50"
                  placeholder="₹ Enter Amount"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />

                <TouchableOpacity
                  onPress={pickImage}
                  className="w-32 h-32 bg-gray-100 rounded-lg items-center justify-center border border-gray-200"
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

                <TouchableOpacity
                  onPress={() => handleFeeDefaulterToggle(true)}
                  className="bg-blue-600 rounded-lg px-4 py-3"
                >
                  <Text className="text-white font-semibold text-center">
                    {editingPaymentId ? "Update Defaulter" : "Mark as Defaulter"}
                  </Text>
                </TouchableOpacity>

                {isOn && (
                  <TouchableOpacity
                    onPress={handleRemoveFeeDefaulter}
                    className="bg-gray-500 rounded-lg px-4 py-3"
                  >
                    <Text className="text-white font-semibold text-center">
                      Remove Defaulter
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Previous Records */}
                {userData?.payments && userData.payments.length > 0 && (
                  <View className="mt-6">
                    <Text className="text-base font-bold text-gray-900 mb-3">
                      Previous Records
                    </Text>

                    {userData.payments.map((p) => (
                      <View
                        key={p.id}
                        className="flex-row items-center p-4 border border-gray-200 rounded-lg bg-white mb-3 shadow-sm"
                      >
                        {/* Left: Both Images */}
                        <View className="flex-col mr-4">
                          {p.qrImage && (
                            <Image
                              source={{ uri: p.qrImage }}
                              className="w-20 h-20 rounded-lg border mb-2"
                              resizeMode="cover"
                            />
                          )}
                          {p.screenshot && (
                            <TouchableOpacity onPress={() => setSelectedPayment(p)}>
                              <Image
                                source={{ uri: p.screenshot }}
                                className="w-20 h-20 rounded-lg border"
                                resizeMode="cover"
                              />
                            </TouchableOpacity>
                          )}
                        </View>

                        {/* Right: Payment Details */}
                        <View className="flex-1">
                          {/* Amount + Status */}
                          <View className="flex-row justify-between items-center mb-1">
                            <Text className="font-semibold text-black text-base">
                              ₹{p.amount}
                            </Text>
                            <Text
                              className={`text-xs font-medium px-2 py-1 rounded-lg ${p.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                              {p.status === "approved" ? "Approved" : "Pending"}
                            </Text>
                          </View>

                          {/* Active Status */}
                          <Text
                            className={`text-sm font-semibold mb-1 ${p.active ? "text-green-600" : "text-red-600"
                              }`}
                          >
                            Active: {p.active ? "Yes" : "No"}
                          </Text>

                          {/* Date */}
                          <Text className="text-xs text-gray-500 mb-2">
                            {new Date(p.createdAt._seconds * 1000).toLocaleString()}
                          </Text>

                          {/* Edit Button */}
                          <TouchableOpacity
                            onPress={() => {
                              setAmount(p.amount.toString());
                              setDefaulterImage(p.qrImage || null);
                              setIsOn(p.active);
                              setEditingPaymentId(p.id);
                              setExpanded(true);
                            }}
                            className="bg-blue-500 rounded-lg px-3 py-2"
                          >
                            <Text className="text-white text-center text-sm font-medium">
                              Edit Record
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}



              </View>
            )}
          </View>

          {/* Ban Section */}
          <View className="bg-white rounded-xl shadow-md mb-6 mx-3">
            <TouchableOpacity
              className="flex-row justify-between items-center px-4 py-4"
              onPress={() => setBanExpanded(!banExpanded)}
            >
              <View>
                <Text className="text-lg font-bold text-gray-900">Ban</Text>
                <Text className="text-sm text-gray-500">
                  Restrict this profile from using the app
                </Text>
              </View>
              <Ionicons
                name={banExpanded ? "chevron-down" : "chevron-forward"}
                size={20}
                color="black"
              />
            </TouchableOpacity>

            {banExpanded && (
              <View className="px-4 pb-6">
                <View className="flex-row items-center">
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

      {/* Payment Verification Modal */}
      <Modal
        visible={!!selectedPayment}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPayment(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-11/12 p-6 rounded-xl shadow-xl">
            <Text className="text-lg font-bold mb-4 text-center">
              Verify Payment
            </Text>

            {selectedPayment && (
              <>
                <Text className="text-base font-semibold text-black mb-2">
                  Amount Submitted: ₹{selectedPayment.amount}
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  Status: {selectedPayment.status}
                </Text>

                {selectedPayment.screenshot && (
                  <Image
                    source={{ uri: selectedPayment.screenshot }}
                    className="w-full h-64 rounded-lg mb-4 border"
                    resizeMode="contain"
                  />
                )}

                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3 mb-4 bg-gray-50"
                  placeholder="Enter Approved Amount"
                  value={approveAmount}
                  onChangeText={setApproveAmount}
                  keyboardType="numeric"
                />

                <TouchableOpacity
                  onPress={handleApprovePayment}
                  className="bg-green-600 rounded-lg px-4 py-3 mb-2"
                  disabled={selectedPayment.status === "approved"}
                >
                  <Text className="text-white text-center font-semibold">
                    {selectedPayment.status === "approved"
                      ? "Already Approved"
                      : "Approve Payment"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedPayment(null)}
                  className="bg-gray-500 rounded-lg px-4 py-3"
                >
                  <Text className="text-white text-center font-semibold">
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;
