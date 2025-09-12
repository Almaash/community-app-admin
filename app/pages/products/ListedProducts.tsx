import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProjectApiList from "@/app/api/ProjectApiList";
import api from "@/app/utils/axiosInterceptor";

type Product = {
  id: number;
  name: string;
  description: string;
  mrp: number;
  discount?: number;
  imageUrl: string;
};

const screenWidth = Dimensions.get("window").width;

const ListedProducts = () => {
  const { type, id } = useLocalSearchParams();
  const router = useRouter();
  const { api_getProduct, api_getOthersProduct } = ProjectApiList();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!type) return;
    try {
      const apiUrl =
        type === "other" ? `${api_getOthersProduct}/${id}` : api_getProduct;

      const res = await api.get(apiUrl);
      const raw = res.data?.data || [];

      const formatted = raw.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        mrp: item.mrp,
        discount: item.discount,
        imageUrl: item.imageUrl || "https://via.placeholder.com/150",
      }));

      setProducts(formatted);
    } catch (error) {
      console.error("❌ Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <View className="mx-5 mb-2 flex-row justify-between items-center">
        <View>
          <Text className="text-black mb-1 text-2xl font-bold">
            Listed Products
          </Text>
          <View className="flex-row items-center space-x-1 mb-1">
            <Text className="text-gray-500 text-sm">
              {products.length} Products
            </Text>
            <Ionicons name="cube" size={16} color="#666" />
          </View>
        </View>
        {type != "other" && (
          <Ionicons
            name="add-circle"
            size={45}
            color="#0066ff"
            onPress={() =>
              router.push("/pages/products/components/AddProductScreen")
            }
          />
        )}
      </View>

      {loading ? (
        <View className="items-center justify-center mt-10">
          <ActivityIndicator size="large" color="#0066ff" />
          <Text className="text-gray-500 mt-2">Loading products...</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
        >
          <View className="flex-row gap-3">
            {products.map((product) => (
              <View
                key={product.id}
                style={{ width: screenWidth / 2 - 24 }}
                className="bg-white border border-gray-200 rounded-lg p-3"
              >
                <Image
                  source={{ uri: product.imageUrl }}
                  className="w-full h-24 rounded mb-3"
                  resizeMode="cover"
                />
                <Text className="font-medium text-black mb-1">
                  {product.name}
                </Text>
                <Text className="text-xs text-gray-500 mb-2" numberOfLines={2}>
                  {product.description}
                </Text>
                <View className="flex-row items-center gap-2 mb-3">
                  <Text className="font-bold text-black">₹{product.mrp}</Text>
                  {product.discount && (
                    <View className="bg-green-100 px-2 py-1 rounded">
                      <Text className="text-green-700 text-xs font-medium">
                        {product.discount}% OFF
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/pages/products/components/[id]",
                      params: { id: product.id.toString() },
                    })
                  }
                  className="bg-green-600 py-2 rounded"
                >
                  <Text className="text-white text-center font-medium text-sm">
                    View
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default ListedProducts;
