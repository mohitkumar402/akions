import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, ActivityIndicator } from 'react-native';
import { useHover } from '../hooks/useHover';
import { API_BASE } from '../config/api';

interface CardProps {
  title: string;
  description?: string;
  image?: string | any; // Can be URI string or require() object
  onPress?: () => void;
  children?: React.ReactNode;
}

// Static image component - no blinking/flickering
const LazyImage = React.memo(({ imageSource, style, onError, onLoad }: {
  imageSource: any;
  style: any;
  onError: (error: any) => void;
  onLoad: () => void;
}) => {
  return (
    <Image
      source={imageSource}
      style={style}
      resizeMode="cover"
      onError={(error) => {
        onError(error);
      }}
      onLoad={() => {
        onLoad();
      }}
    />
  );
});

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  onPress,
  children,
}) => {
  const [imageError, setImageError] = useState(false);
  const { isHovered, hoverProps } = useHover();

  // Helper function to optimize image URLs and get image source
  const getImageSource = () => {
    if (!image) return null;
    
    // If it's a require() object (local asset)
    if (typeof image === 'number' || (typeof image === 'object' && image.uri === undefined)) {
      return image;
    }
    
    // If it's a string (URI)
    if (typeof image === 'string') {
      let optimizedUrl = image;
      
      // Optimize Unsplash URLs - add size parameters for better performance
      if (image.includes('unsplash.com')) {
        // If URL already has ?w= parameter, keep it; otherwise add optimized size
        if (!image.includes('?w=') && !image.includes('&w=')) {
          optimizedUrl = image.includes('?') 
            ? `${image}&w=400&q=80&auto=format&fit=crop` 
            : `${image}?w=400&q=80&auto=format&fit=crop`;
        } else {
          // Replace existing w= parameter with optimized size
          optimizedUrl = image.replace(/[?&]w=\d+/, '?w=400').replace(/[?&]q=\d+/, '&q=80');
          if (!optimizedUrl.includes('auto=format')) {
            optimizedUrl += (optimizedUrl.includes('?') ? '&' : '?') + 'auto=format&fit=crop';
          }
        }
      }
      
      // If it's already a full URL, use optimized version
      if (optimizedUrl.startsWith('http://') || optimizedUrl.startsWith('https://')) {
        return { uri: optimizedUrl };
      }
      // If it's a relative path, prepend API base URL
      if (optimizedUrl.startsWith('/')) {
        return { uri: `${API_BASE}${optimizedUrl}` };
      }
      // If it's a relative path without leading slash
      return { uri: `${API_BASE}/${optimizedUrl}` };
    }
    
    // If it's already an object with uri
    if (typeof image === 'object' && image.uri) {
      // Optimize if it's an Unsplash URL
      let optimizedUri = image.uri;
      if (image.uri.includes('unsplash.com') && !image.uri.includes('?w=') && !image.uri.includes('&w=')) {
        optimizedUri = image.uri.includes('?') 
          ? `${image.uri}&w=400&q=80&auto=format&fit=crop` 
          : `${image.uri}?w=400&q=80&auto=format&fit=crop`;
      }
      return { 
        ...image, 
        uri: optimizedUri,
      };
    }
    
    return null;
  };

  const imageSource = getImageSource();

  const CardContent = () => (
    <View style={[styles.card, isHovered && styles.cardHovered]}>
      {imageSource && (
        <View style={styles.imageContainer}>
          {!imageError ? (
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="cover"
              progressiveRenderingEnabled={Platform.OS !== 'web'}
              fadeDuration={200}
              onError={(error) => {
                setImageError(true);
              }}
              onLoad={() => setImageError(false)}
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
    backgroundColor: '#111827',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f2937',
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
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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
    backgroundColor: '#1f2937',
  },
  imagePlaceholderText: {
    fontSize: 48,
    color: '#6b7280',
  },
  content: {
    padding: 16,
    backgroundColor: '#111827',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
  },
});
