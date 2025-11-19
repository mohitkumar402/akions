import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Animated } from 'react-native';
import { useHover } from '../hooks/useHover';

interface ChatbotButtonProps {
  onPress: () => void;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onPress }) => {
  const { isHovered, hoverProps } = useHover();
  
  return (
    <TouchableOpacity
      style={[styles.chatButton, isHovered && styles.chatButtonHovered]}
      onPress={onPress}
      activeOpacity={0.8}
      {...hoverProps}
    >
      <View style={styles.chatButtonContent}>
        <Text style={styles.chatButtonIcon}>💬</Text>
        <Text style={styles.chatButtonText}>Chat</Text>
      </View>
      <View style={styles.pulseIndicator} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 30 : 20,
    right: Platform.OS === 'web' ? 30 : 20,
    zIndex: 1000,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#1e40af',
    transition: Platform.OS === 'web' ? 'all 0.3s ease' : undefined,
  },
  chatButtonHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ scale: 1.1 }],
      backgroundColor: '#1d4ed8',
      shadowOpacity: 0.6,
      shadowRadius: 12,
    }),
  },
  chatButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chatButtonIcon: {
    fontSize: 24,
  },
  chatButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  pulseIndicator: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
    opacity: 0.3,
  },
});

