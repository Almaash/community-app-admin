import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Heart, Star, Plus, Minus } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ProjectApiList from "@/app/api/ProjectApiList";
import api from "@/app/utils/axiosInterceptor";

const ProductViewScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // get product ID from route

  const { api_getProductById } = ProjectApiList();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchProductDetails = async () => {
    try {
      const res = await api.get(`${api_getProductById}/${id}`);
      setProduct(res.data?.data);
    } catch (err) {
      console.error("❌ Failed to fetch product", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const StarRating = ({ rating = 4, size = 16 }: any) => (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          color="#FFD700"
          fill={star <= rating ? "#FFD700" : "transparent"}
        />
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007bff" />
        <Text className="text-gray-500 mt-3">Loading product details...</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 font-semibold">Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-md"
          onPress={() =>
            router.push({
              pathname: "/pages/products/components/EditProductScreen",
              params: {
                ...product,
              },
            })
          }
        >
          <Text className="text-white font-semibold">Edit</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-between">
        {/* Product Image */}
        <View className="px-4 mb-8">
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-72 rounded-lg"
            resizeMode="contain"
          />
        </View>

        <ScrollView className="flex-1">
          {/* Product Info */}
          <View className="px-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-3xl font-semibold flex-1">
                {product.name}
              </Text>
              <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
                <Heart
                  size={24}
                  color={isFavorite ? "#FF0000" : "#666"}
                  fill={isFavorite ? "#FF0000" : "transparent"}
                />
              </TouchableOpacity>
            </View>

            {product.discount && (
              <View className="bg-green-100 px-2 py-1 rounded mr-3 mb-2 w-20">
                <Text className="text-green-700 text-sm font-semibold">
                  {product.discount}% OFF
                </Text>
              </View>
            )}

            <View className="flex-row items-center mb-8">
              <StarRating />
              <Text className="text-sm text-gray-600 ml-2">
                4.3 (53 reviews)
              </Text>
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-xl font-semibold mb-2">Description</Text>
              <Text className="text-gray-600 leading-5">
                {product.description}
              </Text>
            </View>

            {/* Quantity */}
            <View className="mb-6 flex-row justify-between items-center">
              <Text className="text-xl font-semibold">Quantity</Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={decrementQuantity}
                  className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center"
                >
                  <Minus size={20} color="#666" />
                </TouchableOpacity>
                <Text className="mx-4 text-lg font-semibold min-w-[30px] text-center">
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={incrementQuantity}
                  className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center"
                >
                  <Plus size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom CTA */}
        <View className="px-4 py-3 border-t border-gray-200 bg-white">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-gray-600 mb-1">TOTAL PRICE</Text>
              <Text className="text-2xl font-bold">
                ₹{Number(product.mrp).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity className="bg-blue-500 px-8 py-3 rounded-lg">
              <Text className="text-white font-semibold text-base">
                Enquire Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductViewScreen;
