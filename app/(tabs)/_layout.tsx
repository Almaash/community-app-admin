// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { Tabs } from "expo-router";

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: "black",
//         tabBarStyle: {
//           height: 90,
//           paddingBottom: 10,
//           paddingTop: 10,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color }) => (
//             <FontAwesome size={28} name="home" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="community"
//         options={{
//           title: "Community",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="people" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="post"
//         options={{
//           title: "Post",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="add-box" size={30} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="events"
//         options={{
//           title: "Events",
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="bell" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="matrimonial"
//         options={{
//           title: "Matrimonial",
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="ring" size={24} color={color} />
//           ),
//         }}
//       />
//         <Tabs.Screen
//         name="profile"
//         options={{
//           href: null, // 👈 This hides it from the tab bar completely
//         }}
//       />
//     </Tabs>
//   );
// }


import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, Stack, Tabs } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function TabLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return ( 
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: "black",
    //     tabBarStyle: {
    //       height: 90,
    //       paddingBottom: 10,
    //       paddingTop: 10,
    //     },
    //     tabBarLabelStyle: {
    //       fontSize: 12,
    //     },
    //   }}
    // >
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: "Home",
    //       tabBarIcon: ({ color }) => (
    //         <FontAwesome size={28} name="home" color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="community"
    //     options={{
    //       title: "Community",
    //       tabBarIcon: ({ color }) => (
    //         <Ionicons name="people" size={24} color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="post"
    //     options={{
    //       title: "Post",
    //       tabBarIcon: ({ color }) => (
    //         <MaterialIcons name="add-box" size={30} color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="chat"
    //     options={{
    //       href: null,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="events"
    //     options={{
    //       title: "Feed Section Approval",
    //       tabBarIcon: ({ color }) => (
    //         <MaterialCommunityIcons name="bell" size={24} color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="matrimonial"
    //     options={{
    //       title: "Matrimonial",
    //       tabBarIcon: ({ color }) => (
    //         <MaterialCommunityIcons name="ring" size={24} color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       href: null, // hidden from tab bar
    //     }}
    //   />
    // </Tabs>
  );
}
