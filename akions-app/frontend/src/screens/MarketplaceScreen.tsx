import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Dimensions, Modal } from 'react-native';
import { Navbar } from '../components/Navbar';
import { SEO } from '../components/SEO';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { API_URL } from '../config/api';

const API_BASE = API_URL;

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Create styles function that uses SCREEN_WIDTH
const createStyles = (screenWidth: number) => {
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingBottom: 32 },
  inner: { 
    paddingVertical: isMobile ? 16 : 32, 
    paddingHorizontal: isMobile ? 12 : isTablet ? 20 : 24, 
    maxWidth: 1200, 
    alignSelf: 'center', 
    width: '100%' 
  },
  title: { 
    fontSize: isMobile ? 24 : isTablet ? 28 : 32, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: isMobile ? 16 : 24, 
    textAlign: 'center',
    paddingHorizontal: isMobile ? 8 : 0,
  },
  searchFiltersRow: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
    marginBottom: isMobile ? 20 : 32,
    gap: isMobile ? 12 : 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: isMobile ? 12 : 16,
    paddingVertical: isMobile ? 10 : 12,
    flex: isMobile ? 0 : (Platform.OS === 'web' ? 1 : 0),
    width: isMobile ? '100%' : (Platform.OS === 'web' ? 'auto' : '100%'),
    gap: isMobile ? 8 : 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: { color: '#6b7280', fontSize: isMobile ? 16 : 18 },
  searchInput: { flex: 1, fontSize: isMobile ? 14 : 16, color: '#111827' },
  filtersWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: isMobile ? 12 : 0,
    gap: isMobile ? 8 : 12,
    justifyContent: isMobile ? 'flex-start' : 'flex-start',
    width: isMobile ? '100%' : 'auto',
  },
  filterItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterLabel: { color: '#6b7280', fontWeight: '500', fontSize: 14 },
  filterBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: isMobile ? 12 : 16,
    paddingVertical: isMobile ? 8 : 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: isMobile ? 100 : 120,
    flex: isMobile ? 1 : 0,
    maxWidth: isMobile ? '32%' : undefined,
  },
  filterBoxText: {
    color: '#374151',
    fontSize: isMobile ? 12 : 14,
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isMobile ? 'center' : (Platform.OS === 'web' ? 'flex-start' : 'center'),
    gap: isMobile ? 12 : 20,
    marginBottom: isMobile ? 24 : 32,
  },
  productColumn: {
    width: isMobile ? '100%' : (screenWidth > 1024 ? '31%' : screenWidth > 768 ? '48%' : '100%'),
    marginBottom: isMobile ? 16 : 24,
    minHeight: isMobile ? 400 : 450,
    maxWidth: isMobile ? '100%' : (screenWidth > 1024 ? 380 : screenWidth > 768 ? 350 : '100%'),
  },
  cardFooterRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  categoryBadgeText: { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  ratingText: { fontSize: 14, color: '#fbbf24', fontWeight: '600' },
  pagination: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: isMobile ? 24 : 32, 
    gap: isMobile ? 4 : 8,
    flexWrap: 'wrap',
    paddingHorizontal: isMobile ? 8 : 0,
  },
  pageButton: { 
    paddingHorizontal: isMobile ? 8 : 12, 
    paddingVertical: isMobile ? 6 : 8, 
    borderRadius: 8, 
    backgroundColor: '#f3f4f6',
    minWidth: isMobile ? 36 : 44,
    alignItems: 'center',
  },
  pageText: { color: '#6b7280', fontSize: isMobile ? 12 : 14 },
  pageActive: { backgroundColor: '#2563eb' },
  pageActiveText: { color: '#ffffff', fontWeight: '600', fontSize: isMobile ? 12 : 14 },
  buyButton: { 
    backgroundColor: '#2563eb', 
    paddingHorizontal: isMobile ? 16 : 20, 
    paddingVertical: isMobile ? 8 : 10, 
    borderRadius: 8 
  },
  buyButtonText: { color: '#ffffff', fontWeight: '600', fontSize: isMobile ? 13 : 14 },
  loading: { 
    textAlign: 'center', 
    color: '#6b7280', 
    marginTop: isMobile ? 20 : 24, 
    fontSize: isMobile ? 14 : 16 
  },
  priceRow: { 
    marginTop: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: isMobile ? 4 : 0,
  },
  priceText: { fontSize: isMobile ? 16 : 18, fontWeight: '700', color: '#111827' },
  filterBoxActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  clearFiltersButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: isMobile ? 12 : 16,
    paddingVertical: isMobile ? 10 : 12,
    borderRadius: 8,
    marginTop: isMobile ? 12 : 12,
    width: isMobile ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFiltersText: {
    color: '#ffffff',
    fontSize: isMobile ? 13 : 14,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: isMobile ? 40 : 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isMobile ? 16 : 0,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: isMobile ? 16 : 18,
    marginBottom: isMobile ? 20 : 24,
    textAlign: 'center',
    paddingHorizontal: isMobile ? 16 : 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: isMobile ? 20 : 24,
    width: Platform.OS === 'web' ? 400 : (isMobile ? '90%' : '80%'),
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  modalTitle: {
    fontSize: isMobile ? 18 : 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: isMobile ? 12 : 16,
  },
  modalOption: {
    paddingVertical: isMobile ? 10 : 12,
    paddingHorizontal: isMobile ? 14 : 16,
    borderRadius: 8,
    marginBottom: isMobile ? 6 : 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  modalOptionText: {
    color: '#4b5563',
    fontSize: isMobile ? 14 : 16,
  },
  modalOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  // Container boxes for better UI
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isMobile ? 16 : 24,
    marginBottom: isMobile ? 16 : 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isMobile ? 12 : 16,
    marginBottom: isMobile ? 16 : 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isMobile ? 12 : 16,
    marginBottom: isMobile ? 16 : 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  });
};

export const MarketplaceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const styles = createStyles(SCREEN_WIDTH);
  const { user, accessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    loadProducts();
    // Check for search query from navigation
    const searchParam = navigation.getState()?.routes?.find((r: { name?: string }) => r.name === 'Marketplace')?.params?.searchQuery;
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    // Load Razorpay script for web
    if (Platform.OS === 'web' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [navigation]);

  // All products from seedProducts.js
  const manualProducts: Product[] = [
    // Software Products
    { id: '1', title: 'Project Management Tool', description: 'Streamline your projects with this intuitive tool.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', category: 'Productivity', price: 2999, rating: 4.8 },
    { id: '2', title: 'E-commerce Platform', description: 'Launch your online store with this powerful platform.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', category: 'E-commerce', price: 4999, rating: 4.6 },
    { id: '3', title: 'Customer Relationship Manager', description: 'Manage customer interactions effectively.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', category: 'Business', price: 3999, rating: 4.7 },
    { id: '4', title: 'Data Analytics Dashboard', description: 'Visualize and analyze your data with ease.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', category: 'Analytics', price: 4499, rating: 4.9 },
    { id: '5', title: 'Social Media Scheduler', description: 'Schedule and manage your social media posts.', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', category: 'Marketing', price: 1999, rating: 4.5 },
    // Teaching & Training Products
    { id: '6', title: 'Flutter App Development Course', description: 'Complete Flutter development course with hands-on projects and real-world examples.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', category: 'Teaching', price: 4999, rating: 4.9 },
    { id: '7', title: 'Android Development Masterclass', description: 'Learn Android app development from basics to advanced topics with Kotlin and Java.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', category: 'Teaching', price: 5999, rating: 4.8 },
    { id: '8', title: 'Web Application Development Bootcamp', description: 'Full-stack web development course covering React, Node.js, and modern frameworks.', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', category: 'Teaching', price: 6999, rating: 4.9 },
    { id: '9', title: 'Backend Development with Node.js', description: 'Master backend development, APIs, databases, and server architecture.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', category: 'Teaching', price: 5499, rating: 4.7 },
    // Software Development Services
    { id: '10', title: 'Flutter Mobile App Development', description: 'Professional Flutter app development for iOS and Android. Cross-platform solutions.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', category: 'Software Development', price: 50000, rating: 4.9 },
    { id: '11', title: 'Android Native App Development', description: 'Custom Android applications built with Kotlin/Java. Enterprise-grade solutions.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', category: 'Software Development', price: 60000, rating: 4.8 },
    { id: '12', title: 'Web Application Development', description: 'Modern web applications with React, Vue, or Angular. Responsive and scalable.', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', category: 'Software Development', price: 45000, rating: 4.9 },
    { id: '13', title: 'Enterprise Backend Development', description: 'Scalable backend systems with microservices architecture. Cloud-ready solutions.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', category: 'Software Development', price: 100000, rating: 5.0 },
    // Hosting & Infrastructure
    { id: '14', title: 'Cloud Hosting & Deployment', description: 'Professional hosting setup on AWS, Azure, or GCP. CI/CD pipeline included.', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', category: 'Hosting', price: 15000, rating: 4.8 },
    { id: '15', title: 'Enterprise Server Management', description: 'Dedicated server management, monitoring, and maintenance. 24/7 support.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', category: 'Hosting', price: 25000, rating: 4.9 },
    { id: '16', title: 'DevOps & Infrastructure Setup', description: 'Complete DevOps pipeline with Docker, Kubernetes, and automated deployments.', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', category: 'Hosting', price: 35000, rating: 4.9 },
    // Enterprise Solutions
    { id: '17', title: 'Enterprise Software Solutions', description: 'Custom enterprise software tailored to your business needs. Scalable and secure.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', category: 'Enterprise', price: 200000, rating: 5.0 },
    { id: '18', title: 'Enterprise Backend Architecture', description: 'Design and implement enterprise-grade backend systems with best practices.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', category: 'Enterprise', price: 150000, rating: 5.0 },
    { id: '19', title: 'Enterprise Mobile Solutions', description: 'Enterprise mobile applications with security, scalability, and compliance.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', category: 'Enterprise', price: 120000, rating: 4.9 },
  ];

  const loadProducts = async () => {
    try {
      // Try to fetch from backend first
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setProducts(data);
          setLoading(false);
          return;
        }
      }
      // Fallback to manual data
      setProducts(manualProducts);
    } catch (error) {
      console.error('Load products error:', error);
      // Fallback to manual data on error
      setProducts(manualProducts);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  const ratings = ['All', '4.5+ Stars', '4+ Stars', '3.5+ Stars', '3+ Stars'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
      // Rating filter
      let matchesRating = true;
      if (selectedRating !== 'All') {
        const rating = product.rating || 0;
        switch (selectedRating) {
          case '4.5+ Stars':
            matchesRating = rating >= 4.5;
            break;
          case '4+ Stars':
            matchesRating = rating >= 4.0;
            break;
          case '3.5+ Stars':
            matchesRating = rating >= 3.5;
            break;
          case '3+ Stars':
            matchesRating = rating >= 3.0;
            break;
        }
      }
      
      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [products, searchQuery, selectedCategory, selectedRating]);

  const handlePayment = async (product: Product) => {
    if (!user || !accessToken) {
      Alert.alert('Login Required', 'Please login to purchase products');
      navigation.navigate('Login');
      return;
    }

    try {
      // Create order
      const orderRes = await fetch(`${API_BASE}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId: product.id,
          productType: 'product',
          amount: product.price || 0,
        }),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderRes.json();

      if (Platform.OS === 'web' && window.Razorpay) {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Ekions',
          description: product.title,
          order_id: orderData.orderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch(`${API_BASE}/payment/verify-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  paymentId: orderData.paymentId,
                }),
              });

              if (verifyRes.ok) {
                Alert.alert('Success', 'Payment successful!');
              } else {
                Alert.alert('Error', 'Payment verification failed');
              }
            } catch (error) {
              console.error('Verify payment error:', error);
              Alert.alert('Error', 'Payment verification failed');
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#2563eb',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        Alert.alert('Payment', `Payment of ₹${product.price} for ${product.title}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to initiate payment');
    }
  };

  return (
    <View style={styles.container}>
      <SEO
        title="Marketplace - Ready-Made Software Products"
        description="Browse and purchase ready-made software products. Find the perfect solution for your business needs at our digital marketplace."
        keywords="software marketplace, digital products, ready-made software, buy software, tech products"
      />
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          {/* Title Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>Ready-Made Software Products</Text>
          </View>

          {/* Search Section */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search products"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Filters Section */}
          <View style={styles.filtersContainer}>
            <View style={styles.filtersWrapper}>
              <TouchableOpacity 
                style={[styles.filterBox, selectedCategory !== 'All' && styles.filterBoxActive]}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={styles.filterBoxText}>
                  {selectedCategory === 'All' ? 'Category' : selectedCategory} ▼
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterBox, selectedRating !== 'All' && styles.filterBoxActive]}
                onPress={() => setShowRatingModal(true)}
              >
                <Text style={styles.filterBoxText}>
                  {selectedRating === 'All' ? 'Rating' : selectedRating} ▼
                </Text>
              </TouchableOpacity>
            </View>
            {(selectedCategory !== 'All' || selectedRating !== 'All') && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSelectedCategory('All');
                  setSelectedRating('All');
                }}
              >
                <Text style={styles.clearFiltersText}>Clear All Filters</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Products Section */}
          <View style={styles.sectionContainer}>
            {loading ? (
              <Text style={styles.loading}>Loading products...</Text>
            ) : filteredProducts.slice(0, 5).length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products found matching your filters</Text>
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSelectedCategory('All');
                    setSelectedRating('All');
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.clearFiltersText}>Clear All Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.productsGrid}>
              {filteredProducts.slice(0, 5).map((product) => (
                <View key={product.id} style={styles.productColumn}>
                  <Card
                    title={product.title}
                    description={product.description}
                    image={product.image}
                    onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
                  >
                    <View style={styles.cardFooterRow}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{product.category}</Text>
                      </View>
                      {product.rating && (
                        <Text style={styles.ratingText}>⭐ {product.rating.toFixed(1)}</Text>
                      )}
                    </View>
                    <View style={styles.priceRow}>
                      <TouchableOpacity
                        style={styles.buyButton}
                        onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
                      >
                        <Text style={styles.buyButtonText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                </View>
              ))}
              </View>
            )}
          </View>

          {/* Category Filter Modal */}
          <Modal
            visible={showCategoryModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowCategoryModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowCategoryModal(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Category</Text>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.modalOption,
                      selectedCategory === category && styles.modalOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedCategory(category);
                      setShowCategoryModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedCategory === category && styles.modalOptionTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Rating Filter Modal */}
          <Modal
            visible={showRatingModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowRatingModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowRatingModal(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Minimum Rating</Text>
                {ratings.map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.modalOption,
                      selectedRating === rating && styles.modalOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedRating(rating);
                      setShowRatingModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedRating === rating && styles.modalOptionTextSelected,
                      ]}
                    >
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Pagination Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.pagination}>
              <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>←</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.pageButton, styles.pageActive]}><Text style={styles.pageActiveText}>1</Text></TouchableOpacity>
              <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>2</Text></TouchableOpacity>
              <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>3</Text></TouchableOpacity>
              <Text style={styles.pageText}>...</Text>
              <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>10</Text></TouchableOpacity>
              <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>→</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
