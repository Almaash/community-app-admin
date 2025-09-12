import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { useAuth } from "../context/AuthContext";
import ProjectApiList from "@/app/api/ProjectApiList";
import { useAuth } from "@/app/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

export default function LoginForm() {
  const { login } = useAuth();
  const { api_Login } = ProjectApiList();
  const router = useRouter();

  const [email, setEmail] = useState("kaushalkantmishra127@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(api_Login, {
        email,
        password,
      });

      const { token, user } = response.data.data;

      await AsyncStorage.setItem("userData", JSON.stringify(user));
      await AsyncStorage.setItem("token", JSON.stringify(token));

      // console.log(token,"---------->")
      // alert("Login successful");
      login();
    } catch (error: any) {
      console.error("Login failed:", error?.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // stop loading in both success and failure
    }
  };

  return (
    <View className="flex-1 justify-between">
      <View className="pt-14 bg-white px-6">
        {/* Logo */}
        <View className="items-center mb-6">
          <Image
            source={require("../../../assets/images/Logo.png")}
            style={{ width: 80, height: 80, resizeMode: "contain" }}
          />
        </View>

        {/* Heading */}
        <Text className="text-4xl font-bold text-center">Get Started now</Text>
        <Text className="text-sm text-gray-500 text-center mb-6 px-16 pt-3">
          Sign in to access the Admin Dashboard
        </Text>

        <Text className="text-2xl font-bold text-center mb-6">Admin Login</Text>

        {/* Form */}
        <View className="mx-2">
          <Text className="mb-1 text-gray-600">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-5 mb-4"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="mb-1 text-gray-600">Password</Text>
          <View className="relative">
            <TextInput
              className="border color-black border-gray-300 rounded-xl px-4 py-5 pr-12 mb-2"
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={{
                fontSize: 16, // Ensure font size is set
                lineHeight: 22, // Optional: adjust to match font size
                fontFamily: Platform.OS === "android" ? "monospace" : undefined, // Use a font that supports bullets
              }}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-5"
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Login + Register */}
      <View className="px-6 pb-10 bg-white">
        {/* <TouchableOpacity
          onPress={login}
          className="bg-blue-600 rounded-xl py-3 items-center mb-4"
        >
          <Text className="text-white text-lg font-semibold">Login</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-600 rounded-xl py-3 items-center mb-4"
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => router.push("/register/register")}>
          <Text className="text-center text-blue-600 font-medium">
            Don’t have an account? Register
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
