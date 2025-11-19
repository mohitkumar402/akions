import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showGlow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showGlow = true }) => {
  const sizeStyles = {
    small: { fontSize: 18, letterSpacing: 1 },
    medium: { fontSize: 24, letterSpacing: 2 },
    large: { fontSize: 32, letterSpacing: 3 },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.logoText,
          currentSize,
          showGlow && Platform.OS === 'web' && styles.glowEffect,
        ]}
      >
        Akions
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#ffffff',
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : 'System',
    textTransform: 'uppercase',
    ...(Platform.OS === 'web' && {
      textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(59, 130, 246, 0.3)',
    }),
  },
  glowEffect: {
    ...(Platform.OS === 'web' && {
      textShadow: `
        0 0 5px rgba(255, 255, 255, 0.5),
        0 0 10px rgba(59, 130, 246, 0.4),
        0 0 15px rgba(59, 130, 246, 0.3),
        0 0 20px rgba(147, 51, 234, 0.2)
      `,
    }),
  },
});





