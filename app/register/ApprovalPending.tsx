import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import ApprovalPendingScreen from "./registerComponents/ApprovalPendingScreen";

export default function RegisterPage() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <ApprovalPendingScreen />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
