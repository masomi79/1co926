/**
 * Reusable Button Component
 * Example component for the components folder
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false,
  variant = 'primary' 
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled || loading) return '#999';
    switch (variant) {
      case 'primary':
        return '#007AFF';
      case 'secondary':
        return '#5856D6';
      case 'danger':
        return '#FF3B30';
      default:
        return '#007AFF';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getBackgroundColor() }]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
