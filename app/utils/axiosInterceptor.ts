import BackendUrl from "@/libs/BackendUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

// Create Axios instance
const api = axios.create({
  baseURL: BackendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Strip quotes if token is stored as stringified JSON
        const sanitizedToken = token.replace(/^"(.*)"$/, "$1");
        config.headers.Authorization = `Bearer ${sanitizedToken}`;
      }
      return config;
    } catch (err) {
      console.error("❌ Error fetching token:", err);
      return config;
    }
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ 401 Unauthorized - removing token & redirecting");
      await AsyncStorage.removeItem("token");
      Alert.alert("Session expired", "Please log in again.");
      router.replace("/");
    } else if (!error.response) {
      Alert.alert("Network error", "Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

// Optional: clean wrappers for GET/POST/PUT/DELETE
const ApiService = {
  get: (url: string, params = {}) => api.get(url, { params }),
  post: (url: string, data: any) => api.post(url, data),
  put: (url: string, data: any) => api.put(url, data),
  delete: (url: string) => api.delete(url),
};

export default ApiService;
