import ProjectApiList from "@/app/api/ProjectApiList";
import api from "@/app/utils/axiosInterceptor";
import uploadApi from "@/app/utils/axiosInterceptorUpload";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const EditProductScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { api_updateProduct } = ProjectApiList();

  const [productName, setProductName] = useState(
    typeof params.name === "string" ? params.name : ""
  );
  const [description, setDescription] = useState(
    typeof params.description === "string" ? params.description : ""
  );
  const [mrp, setMrp] = useState(
    typeof params.mrp === "string" ? params.mrp : ""
  );
  const [discount, setDiscount] = useState(
    typeof params.discount === "string" ? params.discount : ""
  );
  const [image, setImage] = useState<any>(null);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpdateProduct = async () => {
    if (!productName.trim() || !description.trim() || !mrp.trim()) {
      Alert.alert("Validation", "Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("mrp", mrp);
    if (discount) formData.append("discount", discount);

    if (image) {
      const uri = image.uri;
      const fileType = uri.split(".").pop();

      formData.append("image", {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any); // required in React Native
    }
    try {
      const res = await uploadApi.put(`${api_updateProduct}/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ Product Updated:", res.data);
      Alert.alert("Success", "Product updated successfully.");
      router.back();
    } catch (err: any) {
      console.error("❌ Update failed", err?.response?.data || err);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Something went wrong."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold ml-4">Edit Product</Text>
        </View>

        <View className="p-4">
          {/* Image Preview */}
          <View className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <View className="bg-gray-200 h-32 rounded-lg mb-3 items-center justify-center">
              <Image
                source={{
                  uri:
                    image?.uri ||
                    (typeof params.imageUrl === "string"
                      ? params.imageUrl
                      : ""),
                }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>
            <Text className="text-base font-semibold mb-1">{productName}</Text>
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
              {description}
            </Text>
            <Text className="text-lg font-bold">₹{mrp}+</Text>
          </View>

          {/* Upload Image Button */}
          <View className="mb-4">
            <Text className="text-sm text-gray-700 mb-2">
              Upload Product Image
            </Text>
            <TouchableOpacity
              onPress={handleImagePick}
              className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between"
            >
              <Text className="text-gray-500">Change Image</Text>
              <Upload size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Product Name */}
          <View className="mb-4">
            <Text className="text-sm text-gray-700 mb-2">Product Name</Text>
            <TextInput
              value={productName}
              onChangeText={setProductName}
              className="border border-gray-300 rounded-lg p-3 text-base"
              placeholder="Enter product name"
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-sm text-gray-700 mb-2">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              className="border border-gray-300 rounded-lg p-3 text-base h-24"
              placeholder="Enter product description"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* MRP */}
          <View className="mb-4">
            <Text className="text-sm text-gray-700 mb-2">Product MRP</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg">
              <Text className="px-3 text-base">₹</Text>
              <TextInput
                value={mrp}
                onChangeText={setMrp}
                className="flex-1 p-3 text-base"
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Discount */}
          <View className="mb-6">
            <Text className="text-sm text-gray-700 mb-2">
              Discount (Optional)
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg">
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

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleUpdateProduct}
            className="bg-blue-500 rounded-lg py-3 items-center"
          >
            <Text className="text-white text-base font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProductScreen;
