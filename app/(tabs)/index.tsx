import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AdminDashboard from "../pages/homePage/AdminDashboard";

export default function index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <AdminDashboard />
    </SafeAreaView>
  );
}
