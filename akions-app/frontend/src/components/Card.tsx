import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useHover } from '../hooks/useHover';
import { useTheme } from '../context/ThemeContext';
import { API_BASE } from '../config/api';

interface CardProps {
  title: string;
  description?: string;
  image?: string | any;
  onPress?: () => void;
  children?: React.ReactNode;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  badge?: string;
  badgeColor?: string;
  rating?: number;
  category?: string;
  price?: number | string;
  tags?: string[];
}

const getImageSource = (image: any, apiBase: string) => {
  if (!image) return null;
  if (typeof image === 'number' || (typeof image === 'object' && image.uri === undefined)) {
    return image;
  }
  if (typeof image === 'string') {
    let url = image;
    if (url.includes('unsplash.com') && !url.includes('?w=')) {
      url = url.includes('?') ? `${url}&w=600&q=85&auto=format&fit=crop` : `${url}?w=600&q=85&auto=format&fit=crop`;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) return { uri: url };
    if (url.startsWith('/')) return { uri: `${apiBase}${url}` };
    return { uri: `${apiBase}/${url}` };
  }
  if (typeof image === 'object' && image.uri) {
    let uri = image.uri;
    if (uri.includes('unsplash.com') && !uri.includes('?w=')) {
      uri = uri.includes('?') ? `${uri}&w=600&q=85&auto=format&fit=crop` : `${uri}?w=600&q=85&auto=format&fit=crop`;
    }
    return { ...image, uri };
  }
  return null;
};

const RatingStars: React.FC<{ rating: number; color: string }> = ({ rating, color }) => {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('★');
    else if (i === full && half) stars.push('½');
    else stars.push('☆');
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Text style={{ color: '#f59e0b', fontSize: 13, letterSpacing: 1 }}>{stars.join('')}</Text>
      <Text style={{ color, fontSize: 12, marginLeft: 4, fontWeight: '600' }}>{rating.toFixed(1)}</Text>
    </View>
  );
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  onPress,
  children,
  variant = 'default',
  badge,
  badgeColor,
  rating,
  category,
  price,
  tags,
}) => {
  const { theme, isDark } = useTheme();
  const [imageError, setImageError] = useState(false);
  const { isHovered, hoverProps } = useHover();
  const imageSource = getImageSource(image, API_BASE);

  const isHorizontal = variant === 'horizontal';
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  const imageHeight = isFeatured ? 220 : isCompact ? 0 : 192;

  const cardStyle = [
    styles.card,
    {
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      borderColor: isHovered
        ? theme.primary
        : isDark
        ? '#1e293b'
        : '#e2e8f0',
      shadowColor: isHovered ? theme.primary : '#000',
    },
    isHorizontal && styles.cardHorizontal,
    isCompact && styles.cardCompact,
    isHovered && styles.cardHovered,
  ];

  const CardContent = () => (
    <View style={cardStyle}>
      {/* Badge */}
      {badge && (
        <View
          style={[
            styles.badge,
            { backgroundColor: badgeColor || '#ef4444' },
            isHorizontal && styles.badgeHorizontal,
          ]}
        >
          <Text style={styles.badgeText}>{badge.toUpperCase()}</Text>
        </View>
      )}

      {/* Image section */}
      {imageSource && !isCompact && (
        <View
          style={[
            styles.imageContainer,
            { height: imageHeight, backgroundColor: isDark ? '#1e293b' : '#f1f5f9' },
            isHorizontal && styles.imageContainerHorizontal,
          ]}
        >
          {!imageError ? (
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="cover"
              progressiveRenderingEnabled={Platform.OS !== 'web'}
              fadeDuration={200}
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <Text style={styles.imagePlaceholderText}>📷</Text>
            </View>
          )}

          {/* Gradient overlay for featured */}
          {isFeatured && (
            <View style={styles.featuredGradient} pointerEvents="none" />
          )}
        </View>
      )}

      {/* Content */}
      <View
        style={[
          styles.content,
          isCompact && styles.contentCompact,
          isHorizontal && styles.contentHorizontal,
        ]}
      >
        {/* Category + Rating row */}
        {(category || rating !== undefined) && (
          <View style={styles.metaRow}>
            {category && (
              <View style={[styles.categoryBadge, { backgroundColor: isDark ? '#1e3a8a' : '#dbeafe' }]}>
                <Text style={[styles.categoryText, { color: isDark ? '#60a5fa' : '#1d4ed8' }]}>
                  {category}
                </Text>
              </View>
            )}
            {rating !== undefined && <RatingStars rating={rating} color={theme.textSecondary} />}
          </View>
        )}

        <Text
          style={[styles.title, { color: theme.text }]}
          numberOfLines={isFeatured ? 3 : 2}
        >
          {title}
        </Text>

        {description && !isCompact && (
          <Text
            style={[styles.description, { color: theme.textSecondary }]}
            numberOfLines={isFeatured ? 3 : 2}
          >
            {description}
          </Text>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.slice(0, 3).map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', borderColor: isDark ? '#374151' : '#e5e7eb' }]}>
                <Text style={[styles.tagText, { color: theme.textSecondary }]}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Price */}
        {price !== undefined && (
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>
              {typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : price}
            </Text>
          </View>
        )}

        {children}
      </View>

      {/* Hover glow border (web only) */}
      {Platform.OS === 'web' && isHovered && (
        <View style={[styles.glowBorder, { borderColor: theme.primary }]} pointerEvents="none" />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} {...hoverProps}>
        <CardContent />
      </TouchableOpacity>
    );
  }
  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    ...(Platform.OS === 'web' && {
      transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
    } as any),
  },
  cardHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ translateY: -4 }],
      shadowOpacity: 0.25,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
    } as any),
  },
  cardHorizontal: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  cardCompact: {
    borderRadius: 12,
  },
  imageContainer: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainerHorizontal: {
    width: 130,
    height: '100%',
    minHeight: 120,
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
  },
  imagePlaceholderText: {
    fontSize: 40,
    color: '#6b7280',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    padding: 16,
    gap: 8,
    flex: 1,
  },
  contentCompact: {
    padding: 12,
    gap: 6,
  },
  contentHorizontal: {
    flex: 1,
    padding: 14,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeHorizontal: {
    top: 8,
    right: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  priceRow: {
    marginTop: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: -0.5,
  },
  glowBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    opacity: 0.6,
  },
});
