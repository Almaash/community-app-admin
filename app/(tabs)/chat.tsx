import { SafeAreaView } from "react-native-safe-area-context";
import ChatListScreen from "../pages/chat/ChatListScreen";

export default function Chat() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ChatListScreen />
    </SafeAreaView>
  );
}
