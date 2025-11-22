import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Platform, Dimensions, Image, Animated } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BlogPost } from '../types';
import { useHover } from '../hooks/useHover';

const API_BASE = 'http://localhost:3000/api';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const BlogScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!loading && blogPosts.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, blogPosts]);

  useEffect(() => {
    loadBlogs();
    // Check for search query from navigation
    const searchParam = navigation.getState()?.routes?.find(r => r.name === 'Blog')?.params?.searchQuery;
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [navigation]);

  const loadBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/blogs`);
      if (res.ok) {
        const data = await res.json();
        setBlogPosts(data);
      }
    } catch (error) {
      console.error('Load blogs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Ekions Blog</Text>
            <Text style={styles.subtitle}>Insights, updates, and stories from the Ekions community.</Text>
          </View>
        </View>

        {/* Main Content Container */}
        <View style={styles.mainContainer}>
          <View style={styles.contentWrapper}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search blog posts"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Category Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroller}>
              {categories.map((category) => {
                const selected = selectedCategory === category;
                return (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={[styles.categoryChip, selected ? styles.categoryChipSelected : styles.categoryChipUnselected]}
                  >
                    <Text style={[styles.categoryText, selected ? styles.categoryTextSelected : styles.categoryTextUnselected]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Blog Posts Grid */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loading}>Loading blog posts...</Text>
              </View>
            ) : filteredPosts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No blog posts found</Text>
              </View>
            ) : (
              <Animated.View
                style={[
                  styles.postsGrid,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                {filteredPosts.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    index={index}
                    onPress={() => navigation.navigate('BlogPost', { postId: post.id || post._id })}
                  />
                ))}
              </Animated.View>
            )}
          </View>
        </View>

        <Footer navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    backgroundColor: '#0f766e',
    paddingVertical: Platform.OS === 'web' ? 80 : 60,
    paddingHorizontal: 24,
  },
  headerContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#ccfbf1',
    lineHeight: 26,
  },
  mainContainer: {
    backgroundColor: '#000000',
    paddingVertical: Platform.OS === 'web' ? 48 : 32,
    paddingHorizontal: 24,
  },
  contentWrapper: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  searchBar: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    fontSize: 18,
    color: '#60a5fa',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
  },
  categoriesScroller: {
    marginBottom: 32,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryChipSelected: {
    backgroundColor: '#2563eb',
  },
  categoryChipUnselected: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  categoryTextUnselected: {
    color: '#9ca3af',
  },
  postsGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
  },
  blogCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    overflow: 'hidden',
    width: Platform.OS === 'web' ? (SCREEN_WIDTH > 1024 ? '31%' : SCREEN_WIDTH > 768 ? '48%' : '100%') : '100%',
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: Platform.OS === 'web' ? 0 : 24,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    }),
  },
  blogCardHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ scale: 1.03 }, { translateY: -8 }],
      borderColor: '#2563eb',
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 8,
    }),
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    ...(Platform.OS === 'web' && {
      background: 'linear-gradient(to top, rgba(17,24,39,0.8) 0%, transparent 100%)',
    }),
    backgroundColor: Platform.OS === 'web' ? 'transparent' : 'rgba(17,24,39,0.6)',
  },
  blogImage: {
    width: '100%',
    height: Platform.OS === 'web' ? 200 : 180,
    backgroundColor: '#1f2937',
  },
  blogCardContent: {
    padding: 20,
  },
  categoryTag: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#60a5fa',
    fontWeight: '600',
  },
  blogTitle: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 28,
  },
  blogExcerpt: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#9ca3af',
    lineHeight: 22,
    marginBottom: 16,
  },
  blogMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  author: {
    fontSize: 13,
    color: '#60a5fa',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  readMoreButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s ease',
    }),
  },
  readMoreButtonHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#1d4ed8',
      transform: [{ scale: 1.05 }],
    }),
  },
  readMoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  loading: {
    color: '#9ca3af',
    fontSize: 16,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
});

// Blog Card Component with Hover Effects
const BlogCard: React.FC<{ post: BlogPost; index: number; onPress: () => void }> = ({ post, onPress }) => {
  const { isHovered, hoverProps } = useHover();
  const cardAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity: cardAnim,
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.blogCard, isHovered && styles.blogCardHovered]}
        onPress={onPress}
        activeOpacity={0.8}
        {...hoverProps}
      >
        {post.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: post.image }}
              style={styles.blogImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
          </View>
        )}
        <View style={styles.blogCardContent}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{post.category}</Text>
          </View>
          <Text style={styles.blogTitle} numberOfLines={2}>{post.title}</Text>
          <Text style={styles.blogExcerpt} numberOfLines={3}>{post.excerpt}</Text>
          <View style={styles.blogMeta}>
            <Text style={styles.author}>By {post.author}</Text>
            <Text style={styles.date}>{post.publishedDate}</Text>
          </View>
          <TouchableOpacity
            style={[styles.readMoreButton, isHovered && styles.readMoreButtonHovered]}
            onPress={(e) => {
              e.stopPropagation();
              onPress();
            }}
          >
            <Text style={styles.readMoreText}>Read More →</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
