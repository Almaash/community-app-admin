import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import ProjectApiList from "@/app/api/ProjectApiList";
import { useAuth } from "@/app/context/AuthContext";
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";

export default function LoginForm() {
  const { login, logout } = useAuth();
  const { api_Login } = ProjectApiList();
  const router = useRouter();

  const [message, showMessage] = useState('');
  const [defaultTkn, setDefaultTkn] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: '483558689899-orv1amuafr6umd8gv2skihhoups2oe59.apps.googleusercontent.com',
      webClientId: '483558689899-cm5rbfc963948ohq80lkg80sqj6i3tl0.apps.googleusercontent.com',
      profileImageSize: 150
    })
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        
        if (idToken) {
          // setDefaultTkn(idToken)
          try {
            const apiResponse = await axios.post(api_Login, { idToken });
            const { token, user: userData } = apiResponse.data.data || {};
            setDefaultTkn(token)

            if (userData?.role === "admin") {
              // Admin login allowed
              await AsyncStorage.setItem("userData", JSON.stringify(userData));
              await AsyncStorage.setItem("token", token);
              login();
              // router.replace("/profile");
            } else {
              // Not an admin → show alert and then logout
              Alert.alert(
                "Access Denied",
                "You are not an admin",
                [
                  {
                    text: "OK",
                    onPress: async () => {
                      // Clear local storage
                      await AsyncStorage.removeItem("userData");
                      await AsyncStorage.removeItem("token");

                      // Sign out from Google
                      try {
                        await GoogleSignin.signOut();
                      } catch (error) {
                        console.log("Google Signout Error:", error);
                      }

                      // Call your logout logic
                      logout();

                      // Redirect to login page
                      router.replace("/login");
                    },
                  },
                ],
                { cancelable: false }
              );
            }
          } catch (apiErr: any) {
            const errorMessage = apiErr.response?.data?.message || "Login failed";
            Alert.alert("Error", errorMessage);
          }
        } else {
          Alert.alert("Error", "Google sign-in failed: no token found");
        }
      } else {
        Alert.alert("Info", "Google Signin was cancelled");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Info", "Google Signin is in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Error", "Play services are not available");
            break;
          default:
            Alert.alert("Error", error.code);
        }
      } else {
        Alert.alert("Error", "An error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(defaultTkn,"-------------->")



  return (
    <View className="flex-1 justify-center bg-white px-6">
      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={require("../../../assets/images/Logo.png")}
          style={{ width: 100, height: 100, resizeMode: "contain" }}
        />
      </View>

      <Text className="text-4xl font-bold text-center mb-4">Welcome Back</Text>
      <Text className="text-4xl font-bold text-center mb-4">Admin</Text>
      <Text className="text-sm text-gray-500 text-center mb-12 px-8">
        Sign in with your Google account to continue
      </Text>

      {/* Google Login Button */}
      <TouchableOpacity
        disabled={isSubmitting}
        onPress={handleGoogleSignIn}
        className={`flex-row items-center justify-center border border-gray-300 rounded-xl py-4 px-6 mb-6 ${isSubmitting ? "opacity-50" : ""
          }`}
      >
        <FontAwesome name="google" size={24} color="#DB4437" />
        <Text className="ml-3 text-lg font-medium text-gray-700">
          {isSubmitting ? "Signing in..." : "Continue with Google"}
        </Text>
      </TouchableOpacity>

      {message ? (
        <Text className="text-center text-red-500 mb-4">{message}</Text>
      ) : null}

      <TouchableOpacity onPress={() => router.push("/register/register")}>
        <Text className="text-center text-blue-600 font-medium">
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}