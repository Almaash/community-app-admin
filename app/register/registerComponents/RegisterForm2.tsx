import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { Platform, Image, ScrollView, Text, TextInput, TextInputProps, TouchableOpacity, View, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [ownerImage, setownerImage] = useState<string | null>(null);
  const [officeImage, setofficeImage] = useState<string | null>(null);
  const [agree, setAgree] = useState(true);

  const [open, setOpen] = useState(false);
  const [businessType, setBusinessType] = useState(null);
  const [types, setTypes] = useState([
    { label: "Product/Service", value: "product" },
    { label: "Consulting", value: "consulting" },
    { label: "Retail", value: "retail" },
  ]);

  const handleNext = async () => {
    const step2Data = {
      businessName,
      businessLocation,
      businessType,
      businessCategory,
      ownerImage,
      officeImage,
      agree,
    };

    try {
      await AsyncStorage.setItem("registerForm2", JSON.stringify(step2Data));
      router.push("/register/register3");
    } catch (error) {
      console.error("Failed to save step 2 data:", error);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white px-4 pt-10"
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    >
      <Text className="text-3xl font-bold text-center mb-1">Welcome</Text>
      <Text className="text-sm text-gray-500 text-center mb-5 px-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam duis vitae curabitur amet, fermentum lorem.
      </Text>

      <View className="gap-5 mx-2">
        <Field
          label="Business Name *"
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Your business name"
        />

        <Field
          label="Office/Shop Location *"
          value={businessLocation}
          onChangeText={setBusinessLocation}
          placeholder="Shop or Office Address"
        />

        <View style={{ zIndex: 2000 }}>
          <Text className="text-sm text-gray-600 mb-1">Type of Business *</Text>
          <DropDownPicker
            open={open}
            value={businessType}
            items={types}
            setOpen={setOpen}
            setValue={setBusinessType}
            setItems={setTypes}
            placeholder="Select type"
            style={{
              borderColor: "#d1d5db",
              borderRadius: 8,
              height: 45,
              paddingHorizontal: 10,
            }}
            dropDownContainerStyle={{
              borderColor: "#d1d5db",
            }}
            textStyle={{ fontSize: 14 }}
          />
        </View>

        <Field
          label="Business Category *"
          value={businessCategory}
          onChangeText={setBusinessCategory}
          placeholder="Ex: Generic Drug Distributor"
        />

        <UploadField label="Upload Owner Photo *" image={ownerImage} onImageSelect={setownerImage} />
        <UploadField label="Upload Office/Shop Photo" image={officeImage} onImageSelect={setofficeImage} />

        <View className="flex-row items-start gap-2 mt-10">
          <Checkbox
            value={agree}
            onValueChange={setAgree}
            color={agree ? "#2563EB" : undefined}
          />
          <Text className="text-xs text-gray-600 flex-1 leading-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
            <Text className="font-semibold">Gravida eget ultricies</Text> pharetra scelerisque duis cursus.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-blue-600 rounded-lg py-4 items-center mt-4 mb-10"
        >
          <Text className="text-white text-base font-semibold">Next Page</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
      <Text className="text-sm text-gray-600 mb-1">{label}</Text>
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

function UploadField({
  label,
  image,
  onImageSelect,
}: {
  label: string;
  image: string | null;
  onImageSelect: (uri: string | null) => void;
}) {
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Allow access to your media library.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        let localUri = result.assets[0].uri;

        if (Platform.OS === "android" && !localUri.startsWith("file://")) {
          const fileInfo = await FileSystem.getInfoAsync(localUri);
          if (!fileInfo.exists) {
            Alert.alert("Error", "File not found.");
            return;
          }
          localUri = fileInfo.uri;
        }

        console.log("✅ Selected image URI:", localUri);
        onImageSelect(localUri);
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert("Error", "Something went wrong while selecting the image.");
    }
  };

  return (
    <View>
      <Text className="text-sm text-gray-600 mb-1">{label}</Text>
      <TouchableOpacity
        onPress={pickImage}
        className="border border-dashed border-gray-400 rounded-lg h-32 items-center justify-center relative"
      >
        {image ? (
          <>
            <Image
              source={{ uri: image }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onImageSelect(null)}
              className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 z-10"
            >
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
          </>
        ) : (
          <View className="items-center">
            <Ionicons name="cloud-upload-outline" size={30} color="#9CA3AF" />
            <Text className="text-gray-500 mt-1">Upload Photo</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
