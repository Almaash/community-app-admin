import ProjectApiList from "@/app/api/ProjectApiList";
import Header from "@/app/components/Header";
import ApiService from "@/app/utils/axiosInterceptor";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Product = {
  id: string;
  userId: string;
  name: string;
  description: string;
  mrp: number;
  discount?: number;
  imageUrl: string;
  isApproved: boolean;
  isRejected: boolean;
  rejectRemarks?: string;
  createdAt: { _seconds: number; _nanoseconds: number };
};

const ProductViewScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { api_getProductById, api_postProductApprove, api_postProductRejected } =
    ProjectApiList();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // rejection remark modal
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [rejectRemark, setRejectRemark] = useState("");

  // Fetch product by ID
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await ApiService.get(`${api_getProductById}/${id}`);
      if (res?.data?.success) {
        setProduct(res.data.data);
      } else {
        Alert.alert("Error", "Product not found.");
        setProduct(null);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      Alert.alert("Error", "Failed to fetch product.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // Approve Product
  const handleApprove = () => {
    if (!id) return;

    Alert.alert("Confirm Approval", "Approve this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          setActionLoading(true);
          try {
            const res = await ApiService.post(
              `${api_postProductApprove}/${id}`,
              {}
            );
            if (res?.data?.success) {
              Alert.alert("Success", "Product approved.");
              fetchProduct();
            } else {
              Alert.alert(
                "Error",
                res?.data?.message || "Failed to approve product."
              );
            }
          } catch (error) {
            console.error("Approve failed:", error);
            Alert.alert("Error", "Something went wrong.");
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  // Reject Product
  const handleReject = () => {
    if (!id) return;
    setRejectRemark("");
    setRemarkModalVisible(true);
  };

  const confirmReject = async () => {
    if (!id || !rejectRemark.trim()) {
      Alert.alert("Error", "Please enter a remark before rejecting.");
      return;
    }
    setActionLoading(true);
    try {
      const res = await ApiService.post(`${api_postProductRejected}/${id}`, {
        rejectRemarks: rejectRemark,
      });
      if (res?.data?.status) {
        Alert.alert("Rejected", "Product rejected successfully.");
        setRemarkModalVisible(false);
        fetchProduct();
      } else {
        Alert.alert(
          "Error",
          res?.data?.message || "Failed to reject product."
        );
      }
    } catch (error) {
      console.error("Reject failed:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 text-lg">Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow">
        <Header />
      </View>

      <ScrollView className="flex-1">
        {/* Product Image */}
        <View className="px-4 mt-4 mb-6">
          <View className="bg-white shadow-md rounded-xl overflow-hidden">
            <Image
              source={{ uri: product.imageUrl }}
              className="w-full h-64"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Product Info */}
        <View className="px-5">
          <Text className="text-2xl font-bold mb-2">{product.name}</Text>

          {product.discount && (
            <View className="bg-green-100 px-3 py-1 rounded-full self-start mb-3">
              <Text className="text-green-700 font-semibold text-sm">
                {product.discount}% Off
              </Text>
            </View>
          )}

          {/* Status */}
          {product.isApproved && (
            <Text className="text-green-600 font-semibold mb-3">
              ✅ Approved
            </Text>
          )}
          {product.isRejected && (
            <View className="mb-3">
              <Text className="text-red-600 font-semibold">❌ Rejected</Text>
              {product.rejectRemarks ? (
                <Text className="text-gray-600 mt-1">
                  Remark: {product.rejectRemarks}
                </Text>
              ) : null}
            </View>
          )}

          {/* Description */}
          <Text className="text-lg font-semibold mb-2">Description</Text>
          <Text className="text-gray-700 leading-relaxed mb-6">
            {product.description}
          </Text>

          {/* Price */}
          <Text className="text-sm text-gray-500 mb-1">TOTAL PRICE</Text>
          <Text className="text-3xl font-extrabold text-blue-600 mb-6">
            ₹{product.mrp.toFixed(2)}
          </Text>

          {/* Business Profile Button */}
          {/* <TouchableOpacity className="border border-blue-500 rounded-lg py-3 mb-10 flex-row items-center justify-center bg-blue-50">
            <Text className="text-blue-600 font-semibold mr-2">
              View Business Profile
            </Text>
            <Text className="text-blue-600">{">"}</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {!product.isApproved && !product.isRejected && (
        <View className="bg-white px-5 py-4 border-t border-gray-200">
          <TouchableOpacity
            disabled={actionLoading}
            onPress={handleApprove}
            className="bg-blue-600 rounded-lg py-3 mb-3 items-center shadow-md"
          >
            {actionLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">Approve</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            disabled={actionLoading}
            onPress={handleReject}
            className="border border-red-600 rounded-lg py-3 items-center shadow-sm"
          >
            {actionLoading ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Text className="text-red-600 font-semibold text-base">
                Reject Product
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Reject Remark Modal */}
      <Modal
        transparent
        visible={remarkModalVisible}
        animationType="fade"
        onRequestClose={() => setRemarkModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 rounded-2xl p-6 shadow-lg">
            <Text className="text-lg font-semibold mb-4 text-gray-800">
              Rejection Remark
            </Text>
            <TextInput
              value={rejectRemark}
              onChangeText={setRejectRemark}
              placeholder="Enter your remark..."
              multiline
              className="border border-gray-300 rounded-lg p-3 h-28 text-gray-700 bg-gray-50"
            />
            <View className="flex-row justify-end mt-6">
              <TouchableOpacity
                onPress={() => setRemarkModalVisible(false)}
                className="mr-5"
              >
                <Text className="text-gray-500 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={actionLoading}
                onPress={confirmReject}
                className="bg-red-600 px-5 py-2 rounded-lg shadow-md"
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductViewScreen;
