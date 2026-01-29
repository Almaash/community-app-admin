import ProjectApiList from "@/app/api/ProjectApiList";
import Header from "@/app/components/Header";
import ApiService from "@/app/utils/axiosInterceptor";
import { useFocusEffect } from "@react-navigation/native";
import { Stack } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import CommunityFilter from "./components/CommunityFilter";
import ProfileCard from "./components/ProfileCard";

interface UserType {
  firstName: string;
  lastName?: string;
  referralPoints?: number;
  referralCount?: number;
  ownerImage?: string;
  id?: string;
  role?: string;
  matrimonialAccess?: boolean;
}

const CommunityScreen = () => {
  const { api_getAllUser } = ProjectApiList();
  const [userList, setUserList] = useState<UserType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // 🔎 search state
  const [search, setSearch] = useState("");

  const fetchUserData = async () => {
    try {
      let url = api_getAllUser;
      if (search) {
        // append query param correctly
        url += `?name=${encodeURIComponent(search)}`;
      }

      const res = await ApiService.get(url);
      setUserList(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [api_getAllUser, search])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      {/* Search Filter */}
      <CommunityFilter search={search} setSearch={setSearch} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Description */}
        <View className="px-4 py-5 bg-white border-b border-gray-200">
          <Text className="text-gray-700 text-base leading-6">
            Connect with top contributors in the community. Use the search box
            to find users.
          </Text>
        </View>

        {/* Profile Grid */}
        <View className="flex-row flex-wrap justify-between mt-2 mx-2">
          {userList.map((data, index) => (
            <View key={index} className="w-1/2">
              <ProfileCard
                id={data.id}
                role={data.role}
                profileName={data.firstName}
                points={data.referralPoints}
                referrals={data.referralCount}
                profileImageUrl={data.ownerImage}
                matrimonialAccess={data.matrimonialAccess}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommunityScreen;
