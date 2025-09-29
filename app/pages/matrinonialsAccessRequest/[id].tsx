import ProjectApiList from "@/app/api/ProjectApiList";
import ApiService from "@/app/utils/axiosInterceptor";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { api_getNewUserDataId, api_postApproveMatrimonial } = ProjectApiList();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  // 🖼️ Image preview state
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 💰 Amount modal state
  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [amount, setAmount] = useState("");

  const openPreview = (uri: string) => {
    setPreviewImage(uri);
    setPreviewVisible(true);
  };

  // ✅ Fetch user details
  const fetchUserDetails = async () => {
    try {
      const res = await ApiService.get(`${api_getNewUserDataId}/${id}`);
      if (res.data?.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUserDetails();
  }, [id]);

  // ✅ Handle verification
 const handleVerify = () => {
  if (!amount) {
    Alert.alert("Validation", "Please enter a valid amount.");
    return;
  }

  Alert.alert(
    "Confirm Verification",
    `Are you sure you want to verify ${user?.firstName || "this user"} with amount ₹${amount}?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Verify",
        style: "default",
        onPress: async () => {
          try {
            setVerifying(true);

            // 👇 capture API response
            const res = await ApiService.post(`${api_postApproveMatrimonial}/${id}`, { amount });
            console.log("Verify API Response:", res.data);

            await fetchUserDetails();
            setAmountModalVisible(false);
            setAmount("");
            Alert.alert("Success", "User verified successfully ✅");
          } catch (error: any) {
            console.error("Verify error:", error?.response?.data || error);
            Alert.alert("Error", "Something went wrong while verifying user");
          } finally {
            setVerifying(false);
          }
        },
      },
    ]
  );
};


  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg">User not found</Text>
        <TouchableOpacity
          className="bg-gray-300 px-4 py-2 mt-4 rounded-lg"
          onPress={() => router.back()}
        >
          <Text>⬅ Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: "User Details" }} />
      <ScrollView>
        {/* Profile Section */}
        <View className="bg-gray-100 p-6 items-center">
          {user?.ownerImage ? (
            <Image
              source={{ uri: user.ownerImage }}
              className="w-40 h-40 rounded-full border-4 border-white shadow"
            />
          ) : (
            <View className="w-40 h-40 rounded-full bg-gray-300 border-4 border-white shadow" />
          )}
          <Text className="text-2xl font-bold mt-4">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-gray-600 mt-1">
            Business Name : {user?.businessName || "N/A"}
          </Text>
          <Text className="text-gray-600">
            Business Category : {user?.businessCategory || "N/A"}
          </Text>
        </View>

        {/* 🏢 Extra Images Section */}
        <View className="px-6 mt-6 space-y-6">
          {/* Office Image */}
          {/* <View>
            <Text className="text-lg font-semibold mb-2">🏢 Office Image</Text>
            {user?.officeImage ? (
              <>
              <TouchableOpacity onPress={() => openPreview(user.officeImage)}>
                <Image
                  source={{ uri: user.officeImage }}
                  className="w-full h-48 rounded-lg border border-gray-300"
                  resizeMode="cover"
                  />
              </TouchableOpacity>
                  </>
            ) : (
              <Text className="text-gray-500">No office image uploaded</Text>
            )}
          </View> */}

          {/* Payment Screenshot */}
          <View>
            <Text className="text-lg font-semibold mb-2">💳 Payment Screenshot</Text>
            {user?.paymentScreenshot ? (
              <TouchableOpacity
                onPress={() => openPreview(user.paymentScreenshot)}
              >
                <Image
                  source={{ uri: user.paymentScreenshot }}
                  className="w-full h-48 rounded-lg border border-gray-300"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : (
              <Text className="text-gray-500">
                No payment screenshot uploaded
              </Text>
            )}
          </View>
        </View>

        {/* Info Section */}
        <View className="px-6 mt-6">
          {user?.city || user?.state ? (
            <Text className="text-lg mb-2">
              📍 {user?.city || ""} {user?.state || ""}
            </Text>
          ) : null}
          {user?.phoneNumber ? (
            <Text className="text-lg mb-2">📞 {user.phoneNumber}</Text>
          ) : null}
          {user?.email ? (
            <Text className="text-lg mb-2">📧 {user.email}</Text>
          ) : null}
          {user?.username ? (
            <Text className="text-lg mb-2">👤 Username: {user.username}</Text>
          ) : null}
        </View>

        {/* Verify Section */}
        <View className="flex-1 justify-center items-center px-6 mt-10">
          <TouchableOpacity
            className={`w-full py-4 rounded-xl shadow ${user?.isVerified ? "bg-gray-400" : "bg-green-600"
              }`}
            onPress={() => setAmountModalVisible(true)}
            disabled={verifying || user?.isVerified}
          >
            {verifying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold text-center">
                {user?.isVerified ? "✅ Access Given" : "✅ Give Access "}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-300 w-full py-3 mt-4 rounded-x mb-5"
            onPress={() => router.back()}
          >
            <Text className="text-black font-medium text-center">⬅ Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🔍 Fullscreen Image Preview Modal */}
      <Modal visible={previewVisible} transparent={true}>
        <View className="flex-1 bg-black justify-center items-center">
          {/* Header with Back button */}
          <View className="absolute top-10 left-5 flex-row space-x-4 z-10">
            <TouchableOpacity
              className="bg-white px-4 py-2 rounded-full"
              onPress={() => setPreviewVisible(false)}
            >
              <Text className="text-black font-bold">⬅ Back</Text>
            </TouchableOpacity>
          </View>

          {previewImage && (
            <Image
              source={{ uri: previewImage }}
              className="w-full h-full"
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* 💰 Amount Input Modal */}
      <Modal visible={amountModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white w-full rounded-xl p-6">
            <Text className="text-lg font-semibold mb-4">Enter Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onPress={() => {
                  setAmount("");
                  setAmountModalVisible(false);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-green-600 px-4 py-2 rounded-lg"
                onPress={handleVerify}
              >
                <Text className="text-white font-semibold">Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
