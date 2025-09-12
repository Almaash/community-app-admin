import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";

interface ReferralModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  referralText: string;
  setReferralText: (text: string) => void;
  loading: boolean; // 👈 Add this
}

const ReferralModal: React.FC<ReferralModalProps> = ({
  visible,
  onClose,
  onConfirm,
  referralText,
  setReferralText,
  loading,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BlurView
          intensity={50}
          tint="dark"
          className="flex-1 justify-center items-center px-7"
        >
          <View className="w-full bg-white rounded-2xl p-6 shadow-lg max-w-md">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-gray-900">
                Referral
              </Text>
              <TouchableOpacity onPress={onClose}>
                {/* <Text className="text-xl text-gray-500">×</Text> */}
              </TouchableOpacity>
            </View>

            {/* Subheader */}
            <Text className="text-sm text-gray-600 mb-4">
              Enter Details of the referrals
            </Text>

            {/* TextArea */}
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Enter Details
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 h-32 text-gray-800 text-sm"
              multiline
              value={referralText}
              onChangeText={setReferralText}
              placeholder="Enter your referral details..."
            />

            {/* Buttons */}
            <View className="mt-6">
              <TouchableOpacity
                onPress={onConfirm}
                className="bg-blue-600 rounded-lg py-3 mb-2 items-center"
              >
                <Text className="text-white font-semibold text-sm">
                  {loading ? "Sending..." : "Confirm"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onClose(), setReferralText("");
                }}
                className="bg-white border border-gray-300 rounded-lg py-3 items-center"
              >
                <Text className="text-gray-800 font-semibold text-sm">
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReferralModal;
