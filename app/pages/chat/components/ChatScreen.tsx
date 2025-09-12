"use client"
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Image,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, router, Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getMessages, sendMessage } from "@/app/utils/api/chatApi"

const { height: screenHeight } = Dimensions.get("window")

interface FirebaseTimestamp {
  _seconds: number
  _nanoseconds: number
}

interface Sender {
  userId: string
  firstName: string
  ownerImage: string
}

interface Message {
  id: string
  senderId: string
  text: string
  sentAt: FirebaseTimestamp
  sender: Sender
}

interface UserData {
  id: string
  firstName?: string
  lastName?: string
  ownerImage?: string
  email?: string
  username?: string
}

interface MessageWithDate extends Message {
  dateHeader?: string
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<MessageWithDate[]>([])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>("")
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null)
  const [otherUserImageFromMessages, setOtherUserImageFromMessages] = useState<string>("")
  const [chatExists, setChatExists] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  const params = useLocalSearchParams()
  const { chatId, otherUserId, otherUserName, otherUserImage } = params as {
    chatId: string
    otherUserId: string
    otherUserName: string
    otherUserImage?: string
  }

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData")
        if (userDataString) {
          const userData = JSON.parse(userDataString)
          setUserId(userData?.user?.id || userData?.id)
          setCurrentUserData(userData?.user || userData)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        setError("Failed to load user data")
      }
    }
    fetchUserId()
  }, [])

  const currentUserId = userId

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUserId || !chatId) return

      try {
        setLoading(true)
        setError(null)
        const response = await getMessages(chatId)
        if (response.success) {
          const messagesWithDates = addDateHeaders(response.messages || [])
          setMessages(messagesWithDates)
          setChatExists(true)
          // Extract other user's image from messages
          const otherUserMessage = response.messages?.find((msg: any) => msg.senderId !== currentUserId)
          if (otherUserMessage?.sender?.ownerImage) {
            setOtherUserImageFromMessages(otherUserMessage.sender.ownerImage)
          }
        } else {
          // If chat doesn't exist yet, that's okay - we'll create it when first message is sent
          console.log("Chat not found, will be created on first message")
          setMessages([])
          setChatExists(false)
        }
      } catch (err) {
        console.error("Error fetching messages:", err)
        // Don't set error for new chats
        setMessages([])
        setChatExists(false)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [chatId, currentUserId])

  const handleSend = async () => {
    if (!inputText.trim() || !currentUserId) return

    const messageText = inputText.trim()
    setInputText("")
    setError(null)

    try {
      setSending(true)
      // Send the message to the server
      const response = await sendMessage({
        chatId,
        senderId: currentUserId,
        text: messageText,
      })

      if (response.success) {
        setChatExists(true)
        // Fetch updated messages after successful send
        const messagesResponse = await getMessages(chatId)
        if (messagesResponse.success) {
          const messagesWithDates = addDateHeaders(messagesResponse.messages || [])
          setMessages(messagesWithDates)
        }
      } else {
        setError(response.error || "Failed to send message")
        // Restore the input text if sending failed
        setInputText(messageText)
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setError("An error occurred while sending the message")
      // Restore the input text if sending failed
      setInputText(messageText)
    } finally {
      setSending(false)
    }
  }

  const addDateHeaders = (messagesList: Message[]): MessageWithDate[] => {
    if (!messagesList || messagesList.length === 0) return []

    const messagesWithDates: MessageWithDate[] = []
    let lastDate = ""

    messagesList.forEach((message, index) => {
      const messageDate = getDateString(message.sentAt)
      if (messageDate !== lastDate) {
        messagesWithDates.push({
          ...message,
          dateHeader: messageDate,
        })
        lastDate = messageDate
      } else {
        messagesWithDates.push(message)
      }
    })

    return messagesWithDates
  }

  const getDateString = (timestamp: FirebaseTimestamp): string => {
    if (!timestamp || !timestamp._seconds) return ""
    const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

    if (messageDate.getTime() === todayDate.getTime()) {
      return "Today"
    } else if (messageDate.getTime() === yesterdayDate.getTime()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  const getUserImage = (message: MessageWithDate, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      // For current user, use their image from currentUserData
      return currentUserData?.ownerImage
    } else {
      // For other user, use their image from message sender or fallback to otherUserImage
      return message.sender?.ownerImage || otherUserImageFromMessages || otherUserImage
    }
  }

  const getUserInitials = (message: MessageWithDate, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      // For current user
      const firstName = currentUserData?.firstName || ""
      const lastName = currentUserData?.lastName || ""
      if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      }
      return firstName.charAt(0).toUpperCase() || "U"
    } else {
      // For other user
      const firstName = message.sender?.firstName || otherUserName?.split(" ")[0] || ""
      const lastName = otherUserName?.split(" ")[1] || ""
      if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      }
      return firstName.charAt(0).toUpperCase() || "U"
    }
  }

  const renderMessage = ({ item, index }: { item: MessageWithDate; index: number }) => {
    if (item.dateHeader) {
      return (
        <View>
          <View className="items-center my-4">
            <View className="bg-gray-200 px-3 py-1 rounded-full">
              <Text className="text-xs text-gray-600 font-medium">{item.dateHeader}</Text>
            </View>
          </View>
          {renderMessageBubble(item, index)}
        </View>
      )
    }
    return renderMessageBubble(item, index)
  }

  const renderMessageBubble = (item: MessageWithDate, index: number) => {
    const isCurrentUser = item.senderId === currentUserId
    const userImage = getUserImage(item, isCurrentUser)
    const userInitials = getUserInitials(item, isCurrentUser)

    return (
      <View className={`flex-row mb-3 px-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
        {/* Left side avatar for other user */}
        {!isCurrentUser && (
          <View className="w-10 h-10 rounded-full mr-3 mt-1">
            {userImage ? (
              <Image source={{ uri: userImage }} className="w-10 h-10 rounded-full" />
            ) : (
              <View className="w-10 h-10 rounded-full bg-gray-300 justify-center items-center">
                <Text className="text-sm font-bold text-gray-600">{userInitials}</Text>
              </View>
            )}
          </View>
        )}

        {/* Message bubble */}
        <View className={`max-w-[75%] rounded-2xl px-4 py-3 ${isCurrentUser ? "bg-blue-500" : "bg-gray-200"}`}>
          <Text className={`text-base leading-5 ${isCurrentUser ? "text-white" : "text-black"}`}>{item.text}</Text>
        </View>

        {/* Right side avatar for current user */}
        {isCurrentUser && (
          <View className="w-10 h-10 rounded-full ml-3 mt-1">
            {userImage ? (
              <Image source={{ uri: userImage }} className="w-10 h-10 rounded-full" />
            ) : (
              <View className="w-10 h-10 rounded-full bg-blue-300 justify-center items-center">
                <Text className="text-sm font-bold text-white">{userInitials}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages])

  const renderCustomHeader = () => {
    const displayImage = otherUserImageFromMessages || otherUserImage
    const initials = otherUserName
      ?.split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase()

    return (
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-full mr-3">
          {displayImage ? (
            <Image source={{ uri: displayImage }} className="w-8 h-8 rounded-full" />
          ) : (
            <View className="w-8 h-8 rounded-full bg-gray-300 justify-center items-center">
              <Text className="text-xs font-bold text-gray-600">{initials}</Text>
            </View>
          )}
        </View>
        <Text className="text-lg font-semibold text-gray-900">{otherUserName || "Chat"}</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: () => renderCustomHeader(),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss()
                  router.back()
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2 text-gray-500">Loading chat...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => renderCustomHeader(),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss()
                router.back()
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ minHeight: screenHeight * 0.8 }}
      >
        <View className="flex-1 bg-gray-50">
          {error && (
            <View className="p-3 bg-red-50 rounded mx-3 mt-2">
              <Text className="text-red-700 text-center">{error}</Text>
              <TouchableOpacity className="mt-2 bg-red-600 px-4 py-2 rounded" onPress={() => setError(null)}>
                <Text className="text-white text-center text-sm">Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}

          {!chatExists && messages.length === 0 && !loading && (
            <View className="flex-1 justify-center items-center p-4">
              <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
              <Text className="text-lg font-semibold mt-4 mb-2 text-gray-900">Start a conversation</Text>
              <Text className="text-sm text-gray-600 text-center">
                Send a message to {otherUserName} to start chatting
              </Text>
            </View>
          )}

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            className="flex-1"
            contentContainerStyle={{
              paddingVertical: 10,
              flexGrow: 1,
              minHeight: messages.length === 0 ? screenHeight * 0.6 : undefined,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />

          {/* Input area */}
          <View className="bg-white border-t border-gray-200 px-4 py-3">
            <View className="flex-row items-end">
              <TextInput
                className="flex-1 border border-gray-200 rounded-full px-4 py-3 bg-gray-50 mr-3 text-base"
                value={inputText}
                onChangeText={setInputText}
                placeholder={`Message ${otherUserName}...`}
                multiline
                maxLength={1000}
                style={{
                  maxHeight: 100,
                  minHeight: 44,
                  textAlignVertical: "center",
                }}
              />
              <TouchableOpacity
                className={`w-12 h-12 rounded-full justify-center items-center ${
                  inputText.trim() ? "bg-blue-500" : "bg-gray-300"
                }`}
                onPress={handleSend}
                disabled={!inputText.trim() || sending || !currentUserId}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="send" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatScreen
