// components/SearchBar.tsx
import React from 'react';
import { View, Image, TextInput, Pressable } from 'react-native';
import { icons } from '@/constants/icons';

interface Props {
  placeholder: string;
  // “button mode” (used on Home to navigate)
  onPress?: () => void;
  // “editable mode” (used on Search to type)
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({ placeholder, value, onPress, onChangeText }: Props) => {
  const isButton = !!onPress && !onChangeText; // if we only got onPress, treat as button

  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image source={icons.search} className="size-5" resizeMode="contain" tintColor="#ab8bff" />

      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={!isButton}
        pointerEvents={isButton ? 'none' : 'auto'}
        placeholderTextColor="#a8b5db"
        className="flex-1 ml-2 text-white"
      />

      {isButton && (
        // invisible overlay to capture taps across the whole pill
        <Pressable
          onPress={onPress}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 9999 }}
        />
      )}
    </View>
  );
};

export default SearchBar;
