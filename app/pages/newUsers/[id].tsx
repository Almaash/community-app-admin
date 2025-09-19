import ProjectApiList from "@/app/api/ProjectApiList";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ApiService from "@/app/utils/axiosInterceptor";

export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { api_getNewUserDataId, api_postApproveUser } = ProjectApiList();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

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
    Alert.alert(
      "Confirm Verification",
      `Are you sure you want to verify ${user?.firstName || "this user"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Verify",
          style: "default",
          onPress: async () => {
            try {
              setVerifying(true);

              // 1️⃣ Call verify API
              await ApiService.post(`${api_postApproveUser}/${id}`, {});

              // 2️⃣ Refetch user details
              await fetchUserDetails();

              Alert.alert("Success", "User verified successfully ✅");
            } catch (error) {
              console.error("Verify error:", error);
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
            {user?.businessName || "N/A"}
          </Text>
          <Text className="text-gray-600">
            {user?.businessCategory || "N/A"}
          </Text>
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
            onPress={handleVerify}
            disabled={verifying || user?.isVerified}
          >
            {verifying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold text-center">
                {user?.isVerified ? "✅ Verified" : "✅ Verify User"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-300 w-full py-3 mt-4 rounded-xl"
            onPress={() => router.back()}
          >
            <Text className="text-black font-medium text-center">⬅ Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
