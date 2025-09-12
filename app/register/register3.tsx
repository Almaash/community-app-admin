import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import RegisterForm3 from "./registerComponents/RegisterForm3";

export default function RegisterPage() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <RegisterForm3 />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
