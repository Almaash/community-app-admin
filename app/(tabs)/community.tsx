import { SafeAreaView } from "react-native-safe-area-context";
import CommunityScreen from "../pages/community/communityScreen";

export default function Tab() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CommunityScreen />
    </SafeAreaView>
  );
}
