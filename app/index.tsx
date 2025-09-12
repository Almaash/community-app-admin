import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StatusBar, Text, View } from "react-native";
import { useAuth } from "./context/AuthContext";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

export default function SplashScreen() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }, 2000); // 2 seconds splash

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white relative overflow-hidden">
      <StatusBar backgroundColor="#0066cc" barStyle="light-content" />

      {/* Main content */}
      <View className="flex-1 items-center justify-center px-8">
        <View className="flex-row items-center space-x-4 mb-80">
          {/* SVG logo */}
          <Image
            source={require("../assets/images/Logo.png")}
            style={{ width: 150, height: 150, resizeMode: "contain" }}
          />

          <View className="flex-col justify-center items-start mt-8">
            <Text className="text-black text-xl font-bold">CHITRANSH</Text>
            <Text className="text-black text-xl font-bold">BUSINESS</Text>
            <Text className="text-black text-xl font-bold">ASSOCIATION</Text>
          </View>
        </View>
      </View>

      {/* Curved bottom shape */}
      <View className="absolute bottom-0 left-0 right-0 h-[40%] bg-blue-600">
        <Svg
          className="absolute bottom-0 left-0 w-full h-20"
          viewBox="0 0 400 80"
          preserveAspectRatio="none"
          style={{ transform: [{ scaleY: -1 }] }} // Flip vertically
        >
          {/* Changed Q200,40 → Q200,65 to reduce curve depth */}
          <Path d="M0,80 Q200,65 400,80 L400,80 L0,80 Z" fill="#ffffff" />
        </Svg>
      </View>
    </View>
  );
}
