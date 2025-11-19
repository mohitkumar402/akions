import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Animated, Dimensions, Platform, FlatList } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card } from '../components/Card';
import { Product, BlogPost, Internship } from '../types';

const API_BASE = 'http://localhost:3000/api';

// Create styles function that uses SCREEN_WIDTH and SCREEN_HEIGHT
const createStyles = (screenWidth: number, screenHeight: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  carouselContainer: {
    width: '100%',
    height: Platform.OS === 'web' ? 600 : screenHeight * 0.7,
    minHeight: Platform.OS === 'web' ? 600 : 500,
    backgroundColor: '#000000',
    position: 'relative',
    overflow: 'hidden',
  },
  carouselFlatList: {
    width: '100%',
    height: '100%',
  },
  carouselItem: {
    width: screenWidth,
    height: Platform.OS === 'web' ? 600 : screenHeight * 0.7,
    minHeight: Platform.OS === 'web' ? 600 : 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: screenWidth,
    height: '100%',
  },
  carouselIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#ffffff',
  },
  verticalsSection: {
    paddingVertical: Platform.OS === 'web' ? 80 : 64,
    paddingHorizontal: Platform.OS === 'web' ? 48 : 24,
    width: '100%',
  },
  verticalsContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 1024 ? 40 : screenWidth > 768 ? 36 : 28) : 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 768 ? 18 : 16) : 16,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 48,
    maxWidth: 700,
    lineHeight: 24,
  },
  verticalsGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 24,
    width: '100%',
  },
  verticalsGridMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  cardWrapper: {
    flex: Platform.OS === 'web' ? (screenWidth > 1024 ? 0 : 1) : 1,
    minWidth: Platform.OS === 'web' ? (screenWidth > 1024 ? 320 : '100%') : '100%',
    maxWidth: Platform.OS === 'web' ? (screenWidth > 1024 ? 380 : 500) : '100%',
  },
  cardWrapperTablet: {
    flex: 1,
    minWidth: 280,
    maxWidth: 350,
  },
  cardWrapperMobile: {
    width: '100%',
    maxWidth: '100%',
  },
  verticalCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333333',
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 768 ? 24 : 20) : 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 768 ? 16 : 14) : 14,
    color: '#d1d5db',
    lineHeight: 24,
  },
  footer: {
    backgroundColor: '#000000',
    paddingVertical: 48,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  footerContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: Platform.OS === 'web' ? 'space-around' : 'center',
    marginBottom: 32,
    gap: Platform.OS === 'web' ? 24 : 16,
  },
  footerLink: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 8,
  },
  copyright: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
  },
  previewSection: {
    paddingVertical: Platform.OS === 'web' ? 80 : 64,
    paddingHorizontal: Platform.OS === 'web' ? 48 : 24,
    backgroundColor: '#000000',
  },
  previewContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  previewTitle: {
    fontSize: Platform.OS === 'web' ? 36 : 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  viewAllButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewAllText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  previewGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center',
  },
  previewCard: {
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? '23%' : screenWidth > 768 ? '31%' : '48%') : '100%',
    maxWidth: 300,
  },
  aboutPreview: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 24,
  },
  aboutPreviewText: {
    color: '#d1d5db',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    lineHeight: Platform.OS === 'web' ? 26 : 22,
    marginBottom: 20,
  },
  servicesPreview: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 24,
  },
  servicePreviewItem: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    flex: Platform.OS === 'web' ? (screenWidth > 1024 ? '23%' : screenWidth > 768 ? '31%' : '48%') : 1,
    borderWidth: 1,
    borderColor: '#374151',
  },
  servicePreviewIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  servicePreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  servicePreviewDesc: {
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 20,
  },
});

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
  const styles = createStyles(SCREEN_WIDTH, SCREEN_HEIGHT);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
  const [featuredInternships, setFeaturedInternships] = useState<Internship[]>([]);
  const [imageError, setImageError] = useState(false);

  // Carousel slides with navigation links
  const carouselSlides = [
    {
      id: '1',
      image: require('../../assets/homepage header 1.png'),
      route: 'Internships',
      title: 'Internships',
    },
    {
      id: '2',
      image: require('../../assets/homepage header 1.png'),
      route: 'Blog',
      title: 'Blog',
    },
    {
      id: '3',
      image: require('../../assets/homepage header 1.png'),
      route: 'Marketplace',
      title: 'Marketplace',
    },
    {
      id: '4',
      image: require('../../assets/homepage header 1.png'),
      route: 'Internships',
      title: 'Internships',
    },
  ];

  useEffect(() => {
    // Load featured products and blogs
    loadFeaturedData();
    
    // Auto-scroll carousel
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselSlides.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const loadFeaturedData = async () => {
    try {
      // Load featured products (first 4)
      const productsRes = await fetch(`${API_BASE}/products`);
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setFeaturedProducts(productsData.slice(0, 4));
      }

      // Load latest blogs (first 3)
      const blogsRes = await fetch(`${API_BASE}/blogs`);
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setLatestBlogs(blogsData.slice(0, 3));
      }

      // Load featured internships (first 3)
      const internshipsRes = await fetch(`${API_BASE}/internships`);
      if (internshipsRes.ok) {
        const internshipsData = await internshipsRes.json();
        setFeaturedInternships(internshipsData.slice(0, 3));
      }
    } catch (error) {
      console.error('Load featured data error:', error);
    }
  };

  useEffect(() => {
    // Staggered card animations
    Animated.stagger(200, [
      Animated.spring(card1Anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(card2Anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(card3Anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(footerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderCarouselItem = ({ item }: { item: typeof carouselSlides[0] }) => (
    <TouchableOpacity
      style={styles.carouselItem}
      activeOpacity={0.9}
      onPress={() => navigation.navigate(item.route)}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={item.image}
          style={styles.carouselImage}
          resizeMode="cover"
          onError={() => {
            console.warn('Carousel image failed to load');
            setImageError(true);
          }}
        />
      </View>
    </TouchableOpacity>
  );

  const verticals = [
    {
      icon: '💼',
      title: 'Internships',
      description: 'Connect with talented interns to support your projects and foster new talent.',
      route: 'Internships',
    },
    {
      icon: '🛒',
      title: 'Product Marketplace',
      description: 'Discover innovative products and solutions from our curated marketplace.',
      route: 'Marketplace',
    },
    {
      icon: '🔧',
      title: 'Custom Projects',
      description: 'Collaborate with experts to develop custom solutions tailored to your specific requirements.',
      route: 'CustomProjects',
    },
  ];

  const isTablet = SCREEN_WIDTH >= 768;
  const isMobile = SCREEN_WIDTH < 768;

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {/* Carousel Hero Section */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            nestedScrollEnabled
            data={carouselSlides}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            initialScrollIndex={0}
            scrollEnabled={true}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH}
            snapToAlignment="center"
            scrollEventThrottle={16}
            nestedScrollEnabled={true}
            style={styles.carouselFlatList}
          />
          {/* Carousel Indicators */}
          <View style={styles.carouselIndicators}>
            {carouselSlides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                  setCurrentIndex(index);
                }}
              >
                <View
                  style={[
                    styles.indicator,
                    currentIndex === index && styles.indicatorActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Three Core Verticals */}
        <View style={[styles.verticalsSection, { backgroundColor: '#000000' }]}>
          <View style={styles.verticalsContent}>
            <Text style={styles.sectionTitle}>
              Akions: Three Core Verticals
            </Text>
            <Text style={styles.sectionSubtitle}>
              Akions offers a comprehensive platform with three key areas to meet your business needs.
            </Text>

            <View style={[styles.verticalsGrid, isMobile && styles.verticalsGridMobile]}>
              {verticals.map((vertical, index) => {
                const cardAnim = index === 0 ? card1Anim : index === 1 ? card2Anim : card3Anim;
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.cardWrapper,
                      isTablet && styles.cardWrapperTablet,
                      isMobile && styles.cardWrapperMobile,
                      {
                        opacity: cardAnim,
                        transform: [
                          {
                            scale: cardAnim,
                          },
                          {
                            translateY: cardAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [50, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => navigation.navigate(vertical.route)}
                      style={styles.verticalCard}
                      activeOpacity={0.8}
                    >
                      <View style={styles.iconContainer}>
                        <Text style={styles.iconText}>{vertical.icon}</Text>
                      </View>
                      <Text style={styles.cardTitle}>
                        {vertical.title}
                      </Text>
                      <Text style={styles.cardDescription}>
                        {vertical.description}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Internships Preview Section */}
        <View style={styles.previewSection}>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Featured Internships</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('Internships')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.previewGrid}>
              {featuredInternships.map((internship) => (
                <View key={internship.id} style={styles.previewCard}>
                  <Card
                    title={internship.title}
                    description={`${internship.company} • ${internship.location} • ${internship.stipend}`}
                    image={internship.image}
                    onPress={() => navigation.navigate('Internships')}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Marketplace Preview Section */}
        <View style={styles.previewSection}>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Featured Products</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('Marketplace')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.previewGrid}>
              {featuredProducts.map((product) => (
                <View key={product.id} style={styles.previewCard}>
                  <Card
                    title={product.title}
                    description={product.description}
                    image={product.image}
                    onPress={() => navigation.navigate('Marketplace')}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Blog Preview Section */}
        <View style={styles.previewSection}>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Latest Blog Posts</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('Blog')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.previewGrid}>
              {latestBlogs.map((blog) => (
                <View key={blog.id} style={styles.previewCard}>
                  <Card
                    title={blog.title}
                    description={blog.excerpt}
                    image={blog.image}
                    onPress={() => navigation.navigate('BlogPost', { postId: blog.id })}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* About Preview Section */}
        <View style={styles.previewSection}>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>About Akions</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('About')}
              >
                <Text style={styles.viewAllText}>Learn More</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.aboutPreview}>
              <Text style={styles.aboutPreviewText}>
                Akions was founded in 2020 with a vision to connect talented individuals with exciting opportunities in the tech industry. We've grown into a leading platform for internships, product development, and custom projects.
              </Text>
              <Text style={styles.aboutPreviewText}>
                Our mission is to empower individuals and businesses by providing a seamless platform for collaboration and growth, fostering innovation in the tech landscape.
              </Text>
            </View>
          </View>
        </View>

        {/* Services Preview Section */}
        <View style={styles.previewSection}>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Our Services</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('Services')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.servicesPreview}>
              <View style={styles.servicePreviewItem}>
                <Text style={styles.servicePreviewIcon}>📱</Text>
                <Text style={styles.servicePreviewTitle}>Mobile App Development</Text>
                <Text style={styles.servicePreviewDesc}>Flutter, Android, iOS, React Native</Text>
              </View>
              <View style={styles.servicePreviewItem}>
                <Text style={styles.servicePreviewIcon}>🌐</Text>
                <Text style={styles.servicePreviewTitle}>Web Development</Text>
                <Text style={styles.servicePreviewDesc}>React, Vue.js, Angular, Full-Stack</Text>
              </View>
              <View style={styles.servicePreviewItem}>
                <Text style={styles.servicePreviewIcon}>☁️</Text>
                <Text style={styles.servicePreviewTitle}>Hosting & Infrastructure</Text>
                <Text style={styles.servicePreviewDesc}>AWS, Azure, GCP, DevOps</Text>
              </View>
              <View style={styles.servicePreviewItem}>
                <Text style={styles.servicePreviewIcon}>🎓</Text>
                <Text style={styles.servicePreviewTitle}>Teaching & Training</Text>
                <Text style={styles.servicePreviewDesc}>Courses, Bootcamps, Masterclasses</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Animated.View style={{ opacity: footerAnim }}>
          <Footer navigation={navigation} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};
