import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";
import BackendUrl from "@/libs/BackendUrl";

const uploadApi = axios.create({
  baseURL: BackendUrl,
  // Do not set default Content-Type here (FormData sets it automatically)
});

uploadApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const sanitizedToken = token.replace(/^"(.*)"$/, "$1");
      config.headers.Authorization = `Bearer ${sanitizedToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

uploadApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      await AsyncStorage.removeItem("token");
      Alert.alert("Session expired", "Please log in again.");
      router.replace("/");
    } else if (!error.response) {
      Alert.alert("Network error", "Check your internet connection.");
    }

    return Promise.reject(error);
  }
);

export default uploadApi;
