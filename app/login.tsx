import { Redirect } from "expo-router";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginForm from "./components/loginComponents/LoginForm";
import { useAuth } from "./context/AuthContext";


export default function LoginPage() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return <Redirect href="/(tabs)" />;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <LoginForm />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
