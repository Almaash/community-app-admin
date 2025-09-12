import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import RegisterForm from "./RegisterForm";
// import RegisterForm from "./registerComponents/RegisterForm";

export default function RegisterPage() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <RegisterForm />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
