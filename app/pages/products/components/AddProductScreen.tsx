import ProjectApiList from "@/app/api/ProjectApiList";
import api from "@/app/utils/axiosInterceptor";
import uploadApi from "@/app/utils/axiosInterceptorUpload";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ArrowLeft, Upload } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddProductScreen = () => {
  const { api_addProduct } = ProjectApiList();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [mrp, setMrp] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

const handleAddProduct = async () => {
  if (!productName.trim() || !description.trim() || !mrp.trim()) {
    Alert.alert("Validation", "Please fill all required fields.");
    return;
  }

  if (!image) {
    Alert.alert("Validation", "Product image is required.");
    return;
  }

  const formData = new FormData();
  formData.append("name", productName);
  formData.append("description", description);
  formData.append("mrp", mrp);
  if (discount) formData.append("discount", discount);

  const uri = image.uri;
  const fileName = image.fileName || uri.split("/").pop() || "upload.jpg";

  formData.append("image", {
    uri,
    type: "image/jpeg", // Static type, no mimeType detection
    name: fileName,
  } as any);

  setLoading(true);
  try {
    const res = await (uploadApi as any).post(api_addProduct, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Product added:", res.data);
    Alert.alert("Success", "Product added successfully!");
    router.back();
  } catch (err: any) {
    console.error("❌ Error:", err?.response?.data || err);
    Alert.alert(
      "Error",
      err?.response?.data?.message ||
        "Something went wrong while adding product."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-4">Add Product</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Upload Image */}
          <Text className="text-sm text-gray-700 mb-2">
            Upload Product Image
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between mb-4"
          >
            <Text className="text-gray-500">
              {image ? "Change Image" : "-Upload Image-"}
            </Text>
            <Upload size={20} color="#666" />
          </TouchableOpacity>

          {image && (
            <View className="mb-4">
              <Image
                source={{ uri: image.uri }}
                className="w-full h-48 rounded-lg mb-2"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setImage(null)}
                className="bg-red-100 rounded-lg py-2 px-4 self-start"
              >
                <Text className="text-red-600 text-sm font-semibold">
                  Remove Image
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Product Name */}
          <Text className="text-sm text-gray-700 mb-2">Product Name</Text>
          <TextInput
            value={productName}
            onChangeText={setProductName}
            className="border border-gray-300 rounded-lg p-3 text-base mb-4"
            placeholder="Enter product name"
          />

          {/* Description */}
          <Text className="text-sm text-gray-700 mb-2">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            className="border border-gray-300 rounded-lg p-3 text-base h-24 mb-4"
            placeholder="Enter product description"
            multiline
            textAlignVertical="top"
          />

          {/* MRP */}
          <Text className="text-sm text-gray-700 mb-2">Product MRP</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg mb-4">
            <Text className="px-3 text-base">₹</Text>
            <TextInput
              value={mrp}
              onChangeText={setMrp}
              className="flex-1 p-3 text-base"
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>

          {/* Discount */}
          <Text className="text-sm text-gray-700 mb-2">
            Discount (Optional)
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg mb-6">
            <Text className="px-3 text-base">%</Text>
            <TextInput
              value={discount}
              onChangeText={setDiscount}
              className="flex-1 p-3 text-base"
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      {/* Add Product Button */}
      <TouchableOpacity
        onPress={handleAddProduct}
        disabled={loading}
        className={`bg-blue-500 rounded-lg py-4 mx-4 items-center mb-4 ${
          loading ? "opacity-50" : ""
        }`}
      >
        <Text className="text-white text-base font-semibold">
          {loading ? "Adding..." : "Add Product"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddProductScreen;
