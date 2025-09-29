import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  ScrollView,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ProjectApiList from "@/app/api/ProjectApiList";
import ApiService from "@/app/utils/axiosInterceptor";

type ProfileCardProps = {
  profileName?: string;
  points?: number;
  referrals?: number;
  profileImageUrl?: string;
  id?: string; // userId
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  profileName,
  points = 0,
  referrals = 0,
  profileImageUrl,
}) => {
  const { api_givePoints } = ProjectApiList();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // ✅ Store API response
  const [awardData, setAwardData] = useState<any>(null);

  // ✅ Initial Form State
  const initialForm = {
    userId: id || "",
    meetingAttended: false,
    meetingOnTime: false,
    attendedInFormals: false,
    colabVisit: false,
    faceToFaceMeeting: false,
    attendedWithGuest: false,
    referBusiness: "",
    referMembers: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleConfirmSubmit = () => {
    Alert.alert(
      "Confirm Submission",
      `Are you sure you want to give points to ${profileName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => handleSubmit() },
      ]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        referBusiness: Number(form.referBusiness) || 0,
        referMembers: Number(form.referMembers) || 0,
      };

      const res = await ApiService.post(api_givePoints, payload);

      // ✅ Save API response for success modal
      setAwardData(res.data.data);

      // Close form modal
      setModalVisible(false);

      // Open success modal
      setSuccessModalVisible(true);

      // Reset form
      setForm(initialForm);
    } catch (err: any) {
      console.error("❌ Error giving points:", err?.response || err);
      Alert.alert("Error", "Failed to give points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white rounded-2xl p-5 m-2 shadow-sm border border-gray-200 w-[95%] self-center">
      {/* Avatar */}
      <View className="w-16 h-16 rounded-full mb-4 items-center justify-center self-center shadow-sm overflow-hidden bg-gray-100">
        {profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            style={{ width: 64, height: 64, borderRadius: 32 }}
            resizeMode="cover"
          />
        ) : (
          <FontAwesome name="user" size={30} color="#4B5563" />
        )}
      </View>

      {/* Profile Name */}
      <Text className="text-center text-gray-900 font-semibold text-lg mb-1">
        {profileName || "Unknown"}
      </Text>

      {/* Points and Referrals */}
      <View className="flex justify-center items-center gap-x-2 mb-4">
        <View className="bg-blue-50 px-3 rounded-full flex-row items-center">
          <FontAwesome name="star" size={15} color="#2563EB" />
          <Text className="text-blue-600 ml-1 text-md font-medium">
            {points} pts
          </Text>
        </View>

        <View className="px-3 py-1 rounded-full flex-row items-center">
          <FontAwesome name="users" size={12} color="#10B981" />
          <Text className="text-green-600 ml-1 text-sm font-medium">
            {referrals} referral{referrals !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Give Points Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={loading}
        className="bg-blue-500 rounded-xl py-2.5 px-4 flex-row justify-center items-center shadow-sm"
        onPress={() => setModalVisible(true)}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white font-medium ml-2 text-sm">
            Give Points
          </Text>
        )}
      </TouchableOpacity>

      {/* 🔹 Modal for Form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center bg-black/40">
          <View className="bg-white mx-5 rounded-2xl p-5">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-lg font-semibold mb-4 text-gray-900">
                Give Points to {profileName}
              </Text>

              {/* Toggles */}
              {[
                "meetingAttended",
                "meetingOnTime",
                "attendedInFormals",
                "colabVisit",
                "faceToFaceMeeting",
                "attendedWithGuest",
              ].map((field) => (
                <View
                  key={field}
                  className="flex-row justify-between items-center py-2"
                >
                  <Text className="text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </Text>
                  <Switch
                    value={(form as any)[field]}
                    onValueChange={(val) =>
                      setForm((prev) => ({ ...prev, [field]: val }))
                    }
                  />
                </View>
              ))}

              {/* Input fields */}
              {/* <TextInput
                placeholder="Refer Business"
                keyboardType="numeric"
                value={form.referBusiness}
                onChangeText={(val) =>
                  setForm((prev) => ({ ...prev, referBusiness: val }))
                }
                className="border border-gray-300 rounded-lg px-4 py-2 mt-3"
              /> */}

              <TextInput
                placeholder="Refer Members"
                keyboardType="numeric"
                value={form.referMembers}
                onChangeText={(val) =>
                  setForm((prev) => ({ ...prev, referMembers: val }))
                }
                className="border border-gray-300 rounded-lg px-4 py-2 mt-3"
              />

              {/* Buttons */}
              <View className="flex-row justify-end mt-5 space-x-3">
                <TouchableOpacity
                  className="px-4 py-2 rounded-lg bg-gray-200"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-4 py-2 ml-2 rounded-lg bg-blue-600"
                  onPress={handleConfirmSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white">Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 🔹 Success Modal */}
      <Modal
        visible={successModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View className="flex-1 justify-center bg-black/40">
          <View className="bg-white mx-5 rounded-2xl p-5 max-h-[70%]">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-bold text-green-600 mb-3">
                🎉 Success!
              </Text>
              <Text className="text-gray-700 mb-2">
                Successfully awarded{" "}
                <Text className="font-semibold">{awardData?.pointsAwarded}</Text>{" "}
                points to {profileName}.
              </Text>

              {awardData?.activities?.map((activity: any, index: number) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center border-b border-gray-200 py-2"
                >
                  <Text className="text-gray-700">{activity.description}</Text>
                  <Text className="text-blue-600 font-medium">
                    +{activity.points}
                  </Text>
                </View>
              ))}

              <TouchableOpacity
                className="mt-5 bg-blue-600 px-4 py-3 rounded-lg"
                onPress={() => setSuccessModalVisible(false)}
              >
                <Text className="text-white text-center font-medium">
                  Close
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileCard;
