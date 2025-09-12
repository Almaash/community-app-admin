import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function RegisterForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState("Ranchi");
  const [wardNumber, setwardNumber] = useState("21");
  const [caste, setCaste] = useState("Kayastha");
  const [agree, setAgree] = useState(false);

  // Dropdown for state
  const [open, setOpen] = useState(false);
  const [stateValue, setStateValue] = useState(null);
  const [states, setStates] = useState([
    { label: "Jharkhand", value: "jharkhand" },
    { label: "Bihar", value: "bihar" },
    { label: "UP", value: "up" },
  ]);

  const handleNext = async () => {
    const formData = {
      firstName,
      lastName,
      fatherName,
      email,
      phoneNumber,
      username,
      password,
      state: stateValue,
      city,
      wardNumber,
      caste,
      agree,
      role: "business"
    };

    try {
      await AsyncStorage.setItem("registerForm1", JSON.stringify(formData));
      router.push("/register/register2");
    } catch (error) {
      console.error("Failed to save session data:", error);
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 bg-white px-4 pt-10">
        <Text className="text-3xl font-bold text-center mb-1">Welcome</Text>
        <Text className="text-sm text-gray-500 text-center mb-5 px-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam duis
          vitae curabitur amet, fermentum lorem.
        </Text>

        {/* Form */}
        <View className="gap-2 mx-2">
          <Field
            label="First name *"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Your name"
          />
          <Field
            label="Last name *"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Your name"
          />
          <Field
            label="Father’s Name *"
            value={fatherName}
            onChangeText={setFatherName}
            placeholder="Your father name"
          />
          <Field
            label="Create Username *"
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
          />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          <Field
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setphoneNumber}
            placeholder="phoneNumber"
          />

          <Text className="text-sm text-gray-600">Password *</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-1">
            <TextInput
              className="flex-1 py-2 text-sm color-black"
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-gray-600">State</Text>
          <DropDownPicker
            open={open}
            value={stateValue}
            items={states}
            setOpen={setOpen}
            setValue={setStateValue}
            setItems={setStates}
            placeholder="Select State"
            style={{
              marginBottom: 12,
              zIndex: 1000,
              borderColor: "#d1d5db",
              borderRadius: 8,
              paddingHorizontal: 10,
              height: 40,
            }}
            textStyle={{ fontSize: 14 }}
            dropDownContainerStyle={{
              zIndex: 999,
              borderColor: "#d1d5db",
            }}
          />

          <View className="flex-row gap-2">
            <View className="flex-1">
              <Field label="City" value={city} onChangeText={setCity} />
            </View>
            <View className="flex-1">
              <Field
                label="Ward | Local No"
                value={wardNumber}
                onChangeText={setwardNumber}
              />
            </View>
          </View>

          <Field label="Caste" value={caste} onChangeText={setCaste} />

          <View className="flex-row items-start gap-2 mt-10">
            <Checkbox
              value={agree}
              onValueChange={setAgree}
              color={agree ? "#2563EB" : undefined}
            />
            <Text className="text-xs text-gray-600 flex-1 leading-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
              <Text className="font-semibold">Gravida eget ultricies</Text>{" "}
              pharetra scelerisque duis cursus.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-blue-600 rounded-lg py-4 items-center mt-5 mb-10"
        >
          <Text className="text-white text-base font-semibold">Next Page</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Reusable input field
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
} & TextInputProps) {
  return (
    <View>
      <Text className="text-sm text-gray-600 mb-0.5">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-3 text-sm"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
    </View>
  );
}
