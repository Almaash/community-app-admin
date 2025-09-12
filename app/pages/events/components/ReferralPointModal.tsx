import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

interface ReferralPointModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  referralPoints: string;
  referralId: string;
  setReferralPoints: (val: string) => void;
  loading: boolean; // ✅ Add this
}

const ReferralPointModal: React.FC<ReferralPointModalProps> = ({
  visible,
  onClose,
  onConfirm,
  referralPoints,
  setReferralPoints,
  loading,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BlurView
          intensity={50}
          tint="dark"
          className="flex-1 justify-center items-center px-4"
        >
          <View className="w-full max-w-md bg-white rounded-2xl p-6 relative">
            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-4 right-4"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>

            {/* Title */}
            <Text className="text-xl font-bold text-indigo-700 mb-1">
              Are you sure?
            </Text>

            {/* Description */}
            <Text className="text-sm text-gray-500 mb-6">
              Accept to give User Point for Referral.
            </Text>

            {/* Input Field */}
            <View className="mb-8">
              <Text className="text-base text-gray-700 mb-1">Points</Text>
              <TextInput
                value={referralPoints}
                onChangeText={setReferralPoints}
                placeholder="Enter points"
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-2 text-lg text-indigo-700 "
              />
            </View>

            {/* Accept Button */}
            <TouchableOpacity
              onPress={onConfirm}
              className="bg-blue-600 rounded-xl py-3 items-center"
              disabled={loading}
            >
              <Text className="text-white text-base font-medium">
                {loading ? "Accepting..." : "Accept"}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReferralPointModal;
