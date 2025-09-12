import axios from "axios"
import ProjectApiList from "@/app/api/ProjectApiList"

const { api_get_user_chats, api_get_user_messages, api_send_message, api_initiate_chat } = ProjectApiList()

// Get all chats for a user
export const getUserChats = async (userId: string) => {
  try {
    const response = await axios.get(`${api_get_user_chats}/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user chats:", error)
    return { success: false, error: "Failed to fetch chats" }
  }
}

// Get messages for a specific chat
export const getMessages = async (chatId: string) => {
  try {
    const response = await axios.get(`${api_get_user_messages}/${chatId}/messages`)
    return response.data
  } catch (error) {
    console.error("Error fetching messages:", error)
    return { success: false, error: "Failed to fetch messages" }
  }
}

// Send a message
export const sendMessage = async ({
  chatId,
  senderId,
  text,
}: {
  chatId: string
  senderId: string
  text: string
}) => {
  try {
    if (!chatId || !senderId || !text.trim()) {
      return { success: false, error: "Missing required fields" }
    }

    const response = await axios.post(api_send_message, {
      chatId,
      senderId,
      text: text.trim(),
    })

    return response.data
  } catch (error: any) {
    console.error("Error sending message:", error)

    // More detailed error handling
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || error.response.data?.error || "Server error",
      }
    } else if (error.request) {
      return { success: false, error: "Network error - please check your connection" }
    } else {
      return { success: false, error: "Failed to send message" }
    }
  }
}

// Create or get a chat between two users
export const getOrCreateChat = async (userId1: string, userId2: string) => {
  try {
    if (!userId1 || !userId2) {
      return { success: false, error: "Missing user IDs" }
    }

    if (userId1 === userId2) {
      return { success: false, error: "Cannot create chat with yourself" }
    }

    const response = await axios.post(api_initiate_chat, {
      userId1,
      userId2,
    })

    return response.data
  } catch (error: any) {
    console.error("Error creating chat:", error)

    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || error.response.data?.error || "Failed to create chat",
      }
    } else if (error.request) {
      return { success: false, error: "Network error - please check your connection" }
    } else {
      return { success: false, error: "Failed to create chat" }
    }
  }
}
