import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";

interface ReferralModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  referralText: string;
  referralName: string;
  referralStatus: string;
}

const ReferralViewModal: React.FC<ReferralModalProps> = ({
  visible,
  onClose,
  onConfirm,
  referralText,
  referralName,
  referralStatus,
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
                {/* You can place an 'X' icon or leave empty */}
              </TouchableOpacity>
            </View>

            {/* Subheader */}
            <Text className="text-sm text-gray-600 mb-4">{referralName}</Text>

            {/* Read-only Text */}
            <View className="border border-gray-200 bg-gray-50 rounded-lg p-3 h-48 overflow-auto">
              <Text className="text-sm text-gray-800 leading-relaxed">
                {referralText}
              </Text>
            </View>

            {/* Buttons */}
            <View className="mt-6">
              {referralStatus == "pending" && (
                <TouchableOpacity
                  onPress={onConfirm}
                  className="bg-blue-600 rounded-lg py-3 mb-2 items-center"
                >
                  <Text className="text-white font-semibold text-sm">
                    Confirm
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={onClose}
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

export default ReferralViewModal;
