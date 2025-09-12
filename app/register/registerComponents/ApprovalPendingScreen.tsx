import { router } from "expo-router";
import React from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function ApprovalPendingScreen() {
  const handleGoToLogin = () => {
    router.replace("/login"); // Adjust path if your login route differs
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-between px-4 my-36">
      {/* Image */}
      <View>
        <Image
          source={require("../../../assets/images/approval.png")}
          className="w-64 h-64 mb-8"
          resizeMode="contain"
        />
      </View>

      <View className="flex bg-white items-center justify-center px-4">
        {/* Title */}
        <Text className="text-3xl font-bold text-black mb-2">
          Approval Pending
        </Text>

        {/* Description */}
        <Text className="text-center text-gray-600 text-sm leading-relaxed mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.{"\n"}
          Quam duis vitae curabitur amet, fermentum lorem.
        </Text>

        {/* Go to Login Button */}
        <TouchableOpacity
          onPress={handleGoToLogin}
          className="px-6 py-3 rounded-lg"
        >
          <Text className="underline font-semibold text-base">Go to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
