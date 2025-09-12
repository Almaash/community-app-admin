import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
  title: string;
  isActive: boolean;
  onPress: () => void;
};

export default function TabButton({ title, isActive, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-3 rounded-full border ${
        isActive ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
      }`}
    >
      <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}