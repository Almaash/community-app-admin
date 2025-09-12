"use client"

import { useEffect, useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Keyboard, Image } from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import Header from "../../components/Header"
import { getUserChats } from "../../utils/api/chatApi"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface Participant {
  userId: string
  firstName: string
  lastName: string
  businessName: string
  ownerImage: string
}

interface FirebaseTimestamp {
  _seconds: number
  _nanoseconds: number
}

interface ChatItem {
  id: string
  members: string[]
  lastMessage: string
  lastUpdated: FirebaseTimestamp
  participants: Participant[]
}

const ChatListScreen = () => {
  const [chats, setChats] = useState<ChatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>("")

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

  const currentUserId = userId

  useFocusEffect(
    useCallback(() => {
      if (!userId) return

      const fetchChats = async () => {
        try {
          setLoading(true)
          const response = await getUserChats(userId)
          if (response.success) {
            setChats(response.chats)
          } else {
            setError("Failed to load chats")
          }
        } catch (err) {
          setError("An error occurred while fetching chats")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      fetchChats()
    }, [userId]),
  )

  const getOtherUserId = (members: string[]) => {
    return members.find((id) => id !== currentUserId) || ""
  }

  // Get participant data for the other user
  const getOtherUserData = (participants: Participant[], otherUserId: string) => {
    return participants.find((participant) => participant.userId === otherUserId)
  }

  const formatTime = (timestamp: FirebaseTimestamp) => {
    if (!timestamp || !timestamp._seconds) return "recently"

    // Convert Firebase timestamp to JavaScript Date
    const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
    const now = new Date()
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60)
    const diffInHours = diffInMinutes / 60
    const diffInDays = diffInHours / 24

    if (diffInMinutes < 1) return "now"
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m`
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`
    if (diffInDays < 7) return `${Math.floor(diffInDays)}d`

    // For older messages, show actual date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const renderChatItem = ({ item }: { item: ChatItem }) => {
    const otherUserId = getOtherUserId(item.members)
    const otherUserData = getOtherUserData(item.participants, otherUserId)

    // Construct full name
    const userName = otherUserData
      ? `${otherUserData.firstName} ${otherUserData.lastName}`.trim()
      : `User ${otherUserId.substring(0, 5)}`

    const userImage = otherUserData?.ownerImage
    const formattedTime = formatTime(item.lastUpdated)

    return (
      <TouchableOpacity
        className="flex-row p-4 border-b border-gray-100 items-center"
        onPress={() => {
          Keyboard.dismiss()
          router.push({
            pathname: "/pages/chat/components/ChatScreen",
            params: {
              chatId: item.id,
              otherUserId,
              otherUserName: userName,
            },
          })
        }}
      >
        <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-3 overflow-hidden">
          {userImage ? (
            <Image
              source={{ uri: userImage }}
              className="w-12 h-12 rounded-full"
              onError={() => {
                console.log("Failed to load user image")
              }}
            />
          ) : (
            <Text className="text-lg font-bold text-gray-600">
              {userName
                .split(" ")
                .map((name) => name.charAt(0))
                .join("")
                .substring(0, 2)}
            </Text>
          )}
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between mb-1">
            <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
              {userName}
            </Text>
            <Text className="text-xs text-gray-500 ml-2">{formattedTime}</Text>
          </View>
          <Text className="text-sm text-gray-600" numberOfLines={1}>
            {item.lastMessage || "No messages yet"}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white pt-0">
        <Stack.Screen options={{ headerShown: false }} />
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white pt-0">
        <Stack.Screen options={{ headerShown: false }} />
        <Header />
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-base">{error}</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-0">
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Messages</Text>
          <TouchableOpacity
            className="p-2"
            onPress={() => {
              Keyboard.dismiss()
              router.push("/pages/chat/components/UsersListScreen")
            }}
          >
            <Ionicons name="add" size={24} color="#0084ff" />
          </TouchableOpacity>
        </View>

        {chats.length === 0 ? (
          <View className="flex-1 justify-center items-center p-5">
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <Text className="text-lg font-semibold mt-4 mb-2 text-gray-900">No conversations yet</Text>
            <Text className="text-sm text-gray-600 text-center mb-5">Start chatting with community members</Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-full"
              onPress={() => router.push("/pages/chat/components/UsersListScreen")}
            >
              <Text className="text-white text-base font-semibold">Start New Chat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList data={chats} keyExtractor={(item) => item.id} renderItem={renderChatItem} className="flex-1" />
        )}
      </View>
    </SafeAreaView>
  )
}

export default ChatListScreen
