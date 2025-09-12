import React from "react";
import ProfileScreen from "../pages/profile/profilePage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function profile() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ProfileScreen />;
    </SafeAreaView>
  );
}
