"use client"

import { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, TextInput, Keyboard } from "react-native"
import { router, Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { getAllUsers, type User } from "../../../utils/api/userApi"
import { getOrCreateChat } from "../../../utils/api/chatApi"
import AsyncStorage from "@react-native-async-storage/async-storage"

const UsersListScreen = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [initiatingChat, setInitiatingChat] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>("")

  const currentUserId = userId

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData")
        if (userDataString) {
          const userData = JSON.parse(userDataString)
          setUserId(userData?.id)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      }
    }

    fetchUserId()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await getAllUsers()
        if (response.status) {
          // Filter out current user from the list
          const otherUsers = response.data.filter((user: User) => user.id !== currentUserId)
          setUsers(otherUsers)
          setFilteredUsers(otherUsers)
        } else {
          setError(response.message || "Failed to load users")
        }
      } catch (err) {
        setError("An error occurred while fetching users")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (currentUserId) {
      fetchUsers()
    }
  }, [currentUserId])

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter((user) => {
        const fullName = getUserDisplayName(user).toLowerCase()
        const email = user.email.toLowerCase()
        const username = user.username?.toLowerCase() || ""
        const businessName = user.businessName?.toLowerCase() || ""
        const query = searchQuery.toLowerCase()

        return (
          fullName.includes(query) || email.includes(query) || username.includes(query) || businessName.includes(query)
        )
      })
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.trim()} ${user.lastName.trim()}`.trim()
    }
    if (user.name) {
      return user.name
    }
    if (user.username) {
      return user.username
    }
    return user.email.split("@")[0]
  }

  const getUserInitials = (user: User) => {
    const displayName = getUserDisplayName(user)
    const names = displayName.split(" ")
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
    }
    return displayName.charAt(0).toUpperCase()
  }

  const handleStartChat = async (user: User) => {
    try {
      Keyboard.dismiss()
      setInitiatingChat(user.id)

      // Create or get existing chat
      const response = await getOrCreateChat(currentUserId, user.id)

      if (response.success) {
        const chatId = response.chatId || response.chat?.id

        // Navigate to chat screen
        router.push({
          pathname: "/pages/chat/components/ChatScreen",
          params: {
            chatId: chatId,
            otherUserId: user.id,
            otherUserName: getUserDisplayName(user),
            otherUserImage: user.ownerImage || "", // Pass the user image
          },
        })
      } else {
        setError("Failed to start chat")
      }
    } catch (err) {
      setError("An error occurred while starting chat")
      console.error(err)
    } finally {
      setInitiatingChat(null)
    }
  }

  const renderUserItem = ({ item }: { item: User }) => {
    const displayName = getUserDisplayName(item)
    const isInitiating = initiatingChat === item.id

    return (
      <TouchableOpacity
        className="flex-row p-4 border-b border-gray-100 items-center"
        onPress={() => handleStartChat(item)}
        disabled={isInitiating}
      >
        <View className="relative mr-3">
          {item.ownerImage ? (
            <Image source={{ uri: item.ownerImage }} className="w-12 h-12 rounded-full" />
          ) : (
            <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center">
              <Text className="text-lg font-bold text-gray-600">{getUserInitials(item)}</Text>
            </View>
          )}
          {item.approved && (
            <View className="absolute -bottom-0 -right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
          )}
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={1}>
            {displayName}
          </Text>
          <Text className="text-sm text-gray-600 mb-1" numberOfLines={1}>
            {item.email}
          </Text>
          {item.businessName && (
            <Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>
              {item.businessName}
            </Text>
          )}
          <View className="flex-row items-center">
            <Text className="text-xs text-gray-500 capitalize">{item.role.replace("_", " ")}</Text>
            {item.approved && <Text className="text-xs text-green-600 ml-1">• Verified</Text>}
          </View>
        </View>

        <View className="p-2">
          {isInitiating ? (
            <ActivityIndicator size="small" color="#0084ff" />
          ) : (
            <Ionicons name="chatbubble-outline" size={24} color="#0084ff" />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Start New Chat",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0084ff" />
          <Text className="mt-3 text-base text-gray-600">Loading users...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Start New Chat",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1 bg-white">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-50 mx-4 mt-4 mb-2 px-3 py-2 rounded-lg">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <View className="p-4 bg-red-50 rounded mx-4 mb-2">
            <Text className="text-red-700 text-center">{error}</Text>
          </View>
        )}

        {filteredUsers.length === 0 ? (
          <View className="flex-1 justify-center items-center p-5">
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text className="text-lg font-semibold mt-4 mb-2 text-gray-700">
              {searchQuery ? "No users found" : "No users available"}
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              {searchQuery ? "Try a different search term" : "Check back later for new members"}
            </Text>
          </View>
        ) : (
          <>
            <Text className="px-4 pb-2 text-sm text-gray-600">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
            </Text>
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

export default UsersListScreen
