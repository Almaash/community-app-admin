import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import ReferralPointModal from "./ReferralPointModal";
import ReferralViewModal from "./ReferralViewModal";
import ProjectApiList from "@/app/api/ProjectApiList";
import api from "@/app/utils/axiosInterceptor";
import { useLocalSearchParams } from "expo-router";

type Referral = {
  id: string;
  fromUserName: string;
  details: string;
  status: string;
};

interface Props {
  referrals: Referral[];
}

const Referrals: React.FC<Props> = ({ referrals }) => {
  const { api_postPoints } = ProjectApiList();
  // const { type, id } = useLocalSearchParams();

  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(
    null
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [pointModalVisible, setPointModalVisible] = useState(false);
  const [referralText, setReferralText] = useState("");
  const [referralName, setReferralName] = useState("");
  const [referralId, setReferralId] = useState("");
  const [referralStatus, setReferralStatus] = useState("");
  const [referralPoints, setReferralPoints] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = (referral: Referral) => {
    setSelectedReferral(referral);
    setReferralName(referral.fromUserName); // ✅ fromUserName as name/title
    setReferralText(referral.details); // ✅ details as message/text
    setReferralId(referral.id); // ✅ details as message/text
    setReferralStatus(referral.status); // ✅ details as message/text
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReferral(null);
    // setReferralId(""); // ✅ details as message/text
    setReferralText("");
    setReferralName("");
    setPointModalVisible(false);
  };

  const confirmReferral = () => {
    closeModal();
    setPointModalVisible(true);
  };

  const handleConfirmPoints = async () => {
    setLoading(true);
    let payload = {
      referralId: referralId,
      pointsEarned: Number(referralPoints),
    };

    try {
      const response = await api.post(api_postPoints, payload);
      console.log("✅ Updated Successfully", response.data);
      Alert.alert("Success", "Details updated successfully.");
      setPointModalVisible(false);
      setReferralPoints("");
      // router.back();
    } catch (error: any) {
      console.log("❌ Error:", error?.response || error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="space-y-3">
      {referrals.map((item) => (
        <View
          key={item.id}
          className={`rounded-xl px-4 py-3 border-t border-gray-200 ${
            item.status === "accepted" ? "bg-gray-100" : "bg-white"
          }`}
        >
          {/* User Name */}
          <Text className="text-base font-semibold text-black">
            {item.fromUserName}
          </Text>

          {/* Referral Details */}
          <Text
            className="text-sm text-gray-500 mt-1"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.details}
          </Text>

          {/* Footer: Button + Seen */}
          <View className="flex-row justify-between items-center mt-3">
            <TouchableOpacity
              className="bg-blue-600 rounded-lg px-4 py-2"
              onPress={() => openModal(item)}
            >
              <Text className="text-white text-sm font-semibold">
                Open Referrals
              </Text>
            </TouchableOpacity>

            {/* Seen Text on Right */}
            {item.status === "accepted" && (
              <Text className="text-blue-700 text-sm font-medium ml-3">
                point sent
              </Text>
            )}
          </View>
        </View>
      ))}

      {/* Modal */}
      <ReferralViewModal
        visible={modalVisible}
        onClose={closeModal}
        onConfirm={confirmReferral}
        referralText={referralText}
        referralName={referralName}
        referralStatus={referralStatus}
      />
      <ReferralPointModal
        visible={pointModalVisible}
        referralId={referralId}
        onClose={() => setPointModalVisible(false)}
        onConfirm={handleConfirmPoints}
        referralPoints={referralPoints}
        setReferralPoints={setReferralPoints}
        loading={loading} // ✅ Pass here
      />
    </View>
  );
};

export default Referrals;
