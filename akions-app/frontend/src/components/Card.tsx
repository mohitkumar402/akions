import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useHover } from '../hooks/useHover';

interface CardProps {
  title: string;
  description?: string;
  image?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  onPress,
  children,
}) => {
  const [imageError, setImageError] = useState(false);
  const { isHovered, hoverProps } = useHover();

  const CardContent = () => (
    <View style={[styles.card, isHovered && styles.cardHovered]}>
      {image && (
        <View style={styles.imageContainer}>
          {!imageError ? (
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>📷</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
        {children}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.7}
        {...hoverProps}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    transition: Platform.OS === 'web' ? 'all 0.3s ease' : undefined,
  },
  cardHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ scale: 1.02 }],
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    }),
  },
  imageContainer: {
    width: '100%',
    height: 192,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  imagePlaceholderText: {
    fontSize: 48,
    color: '#9ca3af',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },
});
