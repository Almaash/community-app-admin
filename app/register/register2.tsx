import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import RegisterForm2 from "./registerComponents/RegisterForm2";

export default function RegisterPage() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <RegisterForm2 />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
