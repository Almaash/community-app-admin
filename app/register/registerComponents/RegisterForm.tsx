import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Register1 = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [city, setCity] = useState("");
  const [wardNumber, setWardNumber] = useState("");
  const [caste, setCaste] = useState("");

  const handleNext = async () => {
    if (!firstName || !username || !email || !phoneNumber) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const formData = {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      fatherName,
      state: stateValue,
      city,
      wardNumber,
      caste,
      role: "business",
    };

    try {
      await AsyncStorage.setItem("registerForm1", JSON.stringify(formData));
      router.push("/register/register2");
    } catch (error) {
      console.error("Failed to save session data:", error);
    }
  };

  const fields = [
    { label: "First Name *", placeholder: "First Name", value: firstName, setter: setFirstName },
    { label: "Last Name", placeholder: "Last Name", value: lastName, setter: setLastName },
    { label: "Username *", placeholder: "Username", value: username, setter: setUsername },
    { label: "Email *", placeholder: "Email", value: email, setter: setEmail },
    { label: "Phone Number *", placeholder: "Phone Number", value: phoneNumber, setter: setPhoneNumber },
    { label: "Father's Name", placeholder: "Father's Name", value: fatherName, setter: setFatherName },
    { label: "State", placeholder: "State", value: stateValue, setter: setStateValue },
    { label: "City", placeholder: "City", value: city, setter: setCity },
    { label: "Ward Number", placeholder: "Ward Number", value: wardNumber, setter: setWardNumber },
    { label: "Caste", placeholder: "Caste", value: caste, setter: setCaste },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 30,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-2xl font-bold text-center mb-8 text-gray-800">
           Personal Details
        </Text>

        {/* Input fields with labels */}
        {fields.map((field, index) => (
          <View key={index} className="mb-4 w-full">
            <Text className="text-gray-700 mb-1">{field.label}</Text>
            <TextInput
              placeholder={field.placeholder}
              value={field.value}
              onChangeText={field.setter}
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        ))}

        {/* Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-blue-600 py-3 rounded-lg mt-2"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Next
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register1;
