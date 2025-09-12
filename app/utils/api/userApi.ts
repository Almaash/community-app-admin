import axios from "axios"
import ProjectApiList from "@/app/api/ProjectApiList";
 const { api_get_all_users } = ProjectApiList();
// Replace with your actual API URL
// const API_URL = "http://172.20.10.3:3000/api"

export interface User {
  ownerImage: string;
  businessName: any;
  id: string
  firstName?: string
  lastName?: string
  name?: string
  username?: string
  email: string
  role: string
  profileImage?: string
  approved: boolean
  createdAt: {
    _seconds: number
    _nanoseconds: number
  }
}

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(api_get_all_users)
    console.log(response,"=================>>")
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    return { status: false, message: "Failed to fetch users", data: [] }
  }
}
