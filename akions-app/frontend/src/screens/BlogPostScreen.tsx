import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Image, Platform, Dimensions, Animated, ActivityIndicator } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { BlogPost } from '../types';
import { useHover } from '../hooks/useHover';
import { API_URL } from '../config/api';
import { manualBlogs } from '../data/blogData';

const API_BASE = API_URL;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper to parse markdown-like content
const parseContent = (content: string) => {
  const lines = content.split('\n');
  const elements: Array<{ type: string; content: string; level?: number }> = [];
  
  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      elements.push({ type: 'h1', content: line.substring(2) });
    } else if (line.startsWith('## ')) {
      elements.push({ type: 'h2', content: line.substring(3) });
    } else if (line.startsWith('### ')) {
      elements.push({ type: 'h3', content: line.substring(4) });
    } else if (line.startsWith('- **') || line.startsWith('* **')) {
      const text = line.replace(/^[-*]\s*\*\*/, '').replace(/\*\*:/, ':').replace(/\*\*/g, '');
      elements.push({ type: 'list', content: text });
    } else if (line.trim() === '') {
      elements.push({ type: 'spacer', content: '' });
    } else if (line.trim()) {
      elements.push({ type: 'paragraph', content: line });
    }
  });
  
  return elements;
};

export const BlogPostScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadBlogPost();
    loadRelatedPosts();
  }, [postId]);

  useEffect(() => {
    if (post) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
      setLikesCount(post.likes || 0);
    }
  }, [post]);

  const loadBlogPost = async () => {
    try {
      // Try to fetch from backend first
      const res = await fetch(`${API_BASE}/blogs/${postId}`);
      if (res.ok) {
        const data = await res.json();
        // Convert MongoDB _id to id if needed
        if (data._id && !data.id) {
          data.id = data._id;
        }
        setPost(data);
        setLoading(false);
        return;
      }
    } catch (error) {
      // Fallback to manual data
    }
    
    // Fallback to manual blog data
    const foundPost = manualBlogs.find((blog: BlogPost) => blog.id === postId || blog.id === String(postId));
    if (foundPost) {
      setPost(foundPost);
    }
    setLoading(false);
  };

  const loadRelatedPosts = async () => {
    try {
      // Try to fetch from backend first
      const res = await fetch(`${API_BASE}/blogs`);
      if (res.ok) {
        const data = await res.json();
        // Convert MongoDB _id to id and get 3 related posts (excluding current)
        const related = data
          .map((p: any) => ({
            ...p,
            id: p._id || p.id,
          }))
          .filter((p: BlogPost) => p.id !== postId && p.id !== (post?._id || post?.id))
          .slice(0, 3);
        setRelatedPosts(related);
        return;
      }
    } catch (error) {
      // Fallback to manual data
    }
    
    // Fallback to manual blog data
    const related = manualBlogs
      .filter((p: BlogPost) => p.id !== postId && p.id !== String(postId))
      .slice(0, 3) as BlogPost[];
    setRelatedPosts(related);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handlePostComment = () => {
    if (commentText.trim()) {
      // In a real app, this would add the comment to the database
      alert('Comment posted!');
      setCommentText('');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Navbar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading amazing content...</Text>
        </View>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Navbar />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundEmoji}>😕</Text>
          <Text style={styles.notFoundText}>Post not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Blog')}
          >
            <Text style={styles.backButtonText}>Back to Blog</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const contentElements = parseContent(post.content || '');

  return (
    <View style={styles.container}>
      <SEO
        title={post?.metaTitle || post?.title}
        description={post?.metaDescription || post?.excerpt || post?.content?.substring(0, 160)}
        keywords={post?.metaKeyword}
        image={post?.image}
        type="article"
        author={post?.author}
        publishedTime={post?.date}
      />
      <Navbar />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section with Image */}
        <View style={styles.heroSection}>
          {post.image ? (
            <Image
              source={{ uri: post.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroPlaceholderEmoji}>📝</Text>
            </View>
          )}
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <TouchableOpacity
                style={styles.breadcrumb}
                onPress={() => navigation.navigate('Blog')}
              >
                <Text style={styles.breadcrumbText}>← Back to Blog</Text>
              </TouchableOpacity>
              <Animated.View
                style={[
                  styles.heroTextContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{post.category}</Text>
                </View>
                <Text style={styles.heroTitle}>{post.title}</Text>
                <Text style={styles.heroExcerpt}>{post.excerpt}</Text>
                <View style={styles.heroMeta}>
                  <View style={styles.authorInfo}>
                    <View style={styles.authorAvatar}>
                      <Text style={styles.authorAvatarText}>
                        {post.author.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.authorName}>By {post.author}</Text>
                      <Text style={styles.publishDate}>{post.publishedDate}</Text>
                    </View>
                  </View>
                  <View style={styles.socialActions}>
                    <TouchableOpacity
                      style={[styles.socialButton, liked && styles.socialButtonActive]}
                      onPress={handleLike}
                    >
                      <Text style={styles.socialEmoji}>❤️</Text>
                      <Text style={styles.socialCount}>{likesCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                      <Text style={styles.socialEmoji}>💬</Text>
                      <Text style={styles.socialCount}>{post.comments?.length || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                      <Text style={styles.socialEmoji}>↗️</Text>
                      <Text style={styles.socialCount}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.contentSection}>
          <View style={styles.contentWrapper}>
            <Animated.View
              style={[
                styles.articleContent,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {contentElements.map((element, index) => {
                if (element.type === 'h1') {
                  return (
                    <Text key={index} style={styles.h1}>
                      {element.content}
                    </Text>
                  );
                } else if (element.type === 'h2') {
                  return (
                    <Text key={index} style={styles.h2}>
                      {element.content}
                    </Text>
                  );
                } else if (element.type === 'h3') {
                  return (
                    <Text key={index} style={styles.h3}>
                      {element.content}
                    </Text>
                  );
                } else if (element.type === 'list') {
                  return (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.listBullet}>•</Text>
                      <Text style={styles.listText}>{element.content}</Text>
                    </View>
                  );
                } else if (element.type === 'spacer') {
                  return <View key={index} style={styles.spacer} />;
                } else {
                  return (
                    <Text key={index} style={styles.paragraph}>
                      {element.content}
                    </Text>
                  );
                }
              })}
            </Animated.View>

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <View style={styles.tagsSection}>
                <Text style={styles.tagsTitle}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {post.tags.map((tag, index) => (
                    <View key={index} style={styles.tagChip}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <Text style={styles.sectionTitle}>Comments ({post.comments?.length || 0})</Text>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment: any) => (
                  <View key={comment.id} style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>
                          {comment.author.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.commentInfo}>
                        <Text style={styles.commentAuthor}>{comment.author}</Text>
                        <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                      </View>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
              )}
              
              <View style={styles.addCommentCard}>
                <Text style={styles.addCommentTitle}>Leave a Comment</Text>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#6b7280"
                />
                <TouchableOpacity
                  style={styles.postCommentButton}
                  onPress={handlePostComment}
                >
                  <Text style={styles.postCommentButtonText}>Post Comment</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <View style={styles.relatedSection}>
                <Text style={styles.sectionTitle}>Related Posts</Text>
                <View style={styles.relatedGrid}>
                  {relatedPosts.map((relatedPost) => (
                    <RelatedPostCard
                      key={relatedPost.id}
                      post={relatedPost}
                      onPress={() => {
                        navigation.replace('BlogPost', { postId: relatedPost.id });
                      }}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        <Footer navigation={navigation} />
      </ScrollView>
    </View>
  );
};

// Related Post Card Component
const RelatedPostCard: React.FC<{ post: BlogPost; onPress: () => void }> = ({ post, onPress }) => {
  const { isHovered, hoverProps } = useHover();
  
  return (
    <TouchableOpacity
      style={[styles.relatedCard, isHovered && styles.relatedCardHovered]}
      onPress={onPress}
      activeOpacity={0.8}
      {...hoverProps}
    >
      {post.image && (
        <Image
          source={{ uri: post.image }}
          style={styles.relatedImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.relatedContent}>
        <View style={styles.relatedCategoryTag}>
          <Text style={styles.relatedCategoryText}>{post.category}</Text>
        </View>
        <Text style={styles.relatedTitle} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.relatedExcerpt} numberOfLines={2}>
          {post.excerpt}
        </Text>
        <Text style={styles.relatedDate}>{post.publishedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
    fontSize: 16,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 48,
  },
  notFoundEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  notFoundText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  heroSection: {
    width: '100%',
    height: Platform.OS === 'web' ? 600 : 500,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f766e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholderEmoji: {
    fontSize: 120,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Platform.OS === 'web' ? 'transparent' : 'rgba(0,0,0,0.7)',
    ...(Platform.OS === 'web' && {
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
    }),
    paddingTop: 100,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  heroContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  breadcrumb: {
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  breadcrumbText: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '500',
  },
  heroTextContainer: {
    width: '100%',
  },
  categoryBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 56 : 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: Platform.OS === 'web' ? 64 : 44,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroExcerpt: {
    fontSize: Platform.OS === 'web' ? 20 : 16,
    color: '#d1d5db',
    marginBottom: 24,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorAvatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  publishDate: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  socialActions: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  socialButtonActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  socialEmoji: {
    fontSize: 18,
  },
  socialCount: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    backgroundColor: '#000000',
    paddingVertical: Platform.OS === 'web' ? 64 : 48,
    paddingHorizontal: 24,
  },
  contentWrapper: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  articleContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: Platform.OS === 'web' ? 48 : 32,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  h1: {
    fontSize: Platform.OS === 'web' ? 36 : 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 32,
    marginBottom: 16,
    lineHeight: Platform.OS === 'web' ? 44 : 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 32,
    marginBottom: 12,
    lineHeight: Platform.OS === 'web' ? 36 : 32,
  },
  h3: {
    fontSize: Platform.OS === 'web' ? 22 : 20,
    fontWeight: '600',
    color: '#60a5fa',
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#4b5563',
    lineHeight: Platform.OS === 'web' ? 32 : 26,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  listBullet: {
    color: '#2563eb',
    fontSize: 20,
    marginRight: 12,
    fontWeight: '700',
  },
  listText: {
    flex: 1,
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#4b5563',
    lineHeight: Platform.OS === 'web' ? 32 : 26,
  },
  spacer: {
    height: 16,
  },
  tagsSection: {
    marginBottom: 48,
  },
  tagsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tagChip: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  tagText: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '600',
  },
  commentsSection: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  commentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  commentText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
  },
  noComments: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 32,
    fontStyle: 'italic',
  },
  addCommentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  addCommentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  commentInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    color: '#111827',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  postCommentButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  postCommentButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  relatedSection: {
    marginBottom: 48,
  },
  relatedGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 24,
  },
  relatedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    width: Platform.OS === 'web' ? (SCREEN_WIDTH > 1024 ? '31%' : SCREEN_WIDTH > 768 ? '48%' : '100%') : '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    }),
  },
  relatedCardHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ scale: 1.02 }],
      borderColor: '#2563eb',
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
    }),
  },
  relatedImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f3f4f6',
  },
  relatedContent: {
    padding: 20,
  },
  relatedCategoryTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  relatedCategoryText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 26,
  },
  relatedExcerpt: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  relatedDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});
