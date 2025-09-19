import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "@/app/components/Header";
import ProjectApiList from "@/app/api/ProjectApiList";
import ApiService from "@/app/utils/axiosInterceptor";

type Product = {
  id: string;
  name: string;
  description: string;
  mrp: number;
  discount?: number;
  imageUrl: string;
  isApproved: boolean;
  createdAt: { _seconds: number; _nanoseconds: number };
};

const ListedProducts = () => {
  const router = useRouter();
  const { api_getAdminProducts } = ProjectApiList();
  const [activeTab, setActiveTab] = useState<"" | "rejected" | "approved">("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from API
  const fetchProducts = async (status: string) => {
    setLoading(true);
    try {
      const res = await ApiService.get(`${api_getAdminProducts}?status=${status}`);
      if (res?.data?.success) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when activeTab changes
  useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab]);

  return (
    <View className="flex-1 bg-white px-5 pt-8">
      <Header />

      {/* Title */}
      <Text className="text-2xl font-bold text-black mb-6 pl-2">
        Product Control
      </Text>

      {/* Tabs */}
      <View className="flex-row gap-1 mb-8">
        <TouchableOpacity
          className={`px-2 py-3 rounded-full border ${activeTab === "" ? "bg-blue-600 border-blue-600" : "border-blue-600"
            }`}
          onPress={() => setActiveTab("")}
        >
          <Text
            className={`text-base font-semibold ${activeTab === "" ? "text-white" : "text-blue-600"
              }`}
          >
            New Products
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-2 py-3 rounded-full border ${activeTab === "approved" ? "bg-blue-600 border-blue-600" : "border-blue-600"
            }`}
          onPress={() => setActiveTab("approved")}
        >
          <Text
            className={`text-base font-semibold ${activeTab === "approved" ? "text-white" : "text-blue-600"
              }`}
          >
            Approved Products
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-6 py-3 rounded-full border ${activeTab === "rejected" ? "bg-blue-600 border-blue-600" : "border-blue-600"
            }`}
          onPress={() => setActiveTab("rejected")}
        >
          <Text
            className={`text-base font-semibold ${activeTab === "rejected" ? "text-white" : "text-blue-600"
              }`}
          >
            Rejected Products
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 70 }}
        >
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              className="flex-row items-center justify-between mb-7"
              onPress={() =>
                router.push({
                  pathname: `/pages/products/components/[id]`,
                  params: { id: product.id }, // ✅ send productId
                })
              }

            >
              {/* Left Side */}
              <View className="flex-row items-start gap-4 flex-1">
                <View className="w-12 h-12 rounded-full bg-gray-300" />
                <View className="flex-1">
                  <Text className="font-bold text-black text-lg">{product.name}</Text>
                  <Text className="text-gray-600 text-sm" numberOfLines={2}>
                    {product.description}
                  </Text>
                  <Text className="text-gray-400 text-sm mt-2">
                    {new Date(product.createdAt._seconds * 1000).toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Right Side */}
              <Image
                source={{ uri: product.imageUrl }}
                className="w-16 h-16 rounded-xl bg-gray-300"
              />
            </TouchableOpacity>
          ))}

          {products.length === 0 && (
            <View className="items-center mt-20">
              <Text className="text-gray-500 text-lg">No products found.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ListedProducts;
