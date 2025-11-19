import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Dimensions, Modal } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';

const API_BASE = 'http://localhost:3000/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Create styles function that uses SCREEN_WIDTH
const createStyles = (screenWidth: number) => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { paddingBottom: 32 },
  inner: { paddingVertical: 32, paddingHorizontal: 24, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  title: { fontSize: 32, fontWeight: '700', color: '#ffffff', marginBottom: 24, textAlign: 'center' },
  searchFiltersRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: Platform.OS === 'web' ? 1 : undefined,
    width: Platform.OS === 'web' ? 'auto' : '100%',
    gap: 12,
  },
  searchIcon: { color: '#9ca3af', fontSize: 18 },
  searchInput: { flex: 1, fontSize: 16, color: '#ffffff' },
  filtersWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
    gap: 12,
    justifyContent: 'flex-end',
  },
  filterItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterLabel: { color: '#9ca3af', fontWeight: '500', fontSize: 14 },
  filterBox: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#374151',
    minWidth: 120,
  },
  filterBoxText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center',
    gap: 20,
    marginBottom: 32,
  },
  productColumn: {
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? '18%' : screenWidth > 768 ? '30%' : '48%') : '100%',
    marginBottom: 24,
    minHeight: 450,
  },
  cardFooterRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryBadge: { backgroundColor: '#1f2937', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  categoryBadgeText: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },
  ratingText: { fontSize: 14, color: '#fbbf24', fontWeight: '600' },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32, gap: 8 },
  pageButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#1f2937' },
  pageText: { color: '#9ca3af', fontSize: 14 },
  pageActive: { backgroundColor: '#2563eb' },
  pageActiveText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  buyButton: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buyButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  loading: { textAlign: 'center', color: '#9ca3af', marginTop: 24, fontSize: 16 },
  priceRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceText: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  filterBoxActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  clearFiltersButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  clearFiltersText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 24,
    width: Platform.OS === 'web' ? 400 : '80%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  modalOptionText: {
    color: '#d1d5db',
    fontSize: 16,
  },
  modalOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export const MarketplaceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const styles = createStyles(SCREEN_WIDTH);
  const { user, accessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    loadProducts();
    // Check for search query from navigation
    const searchParam = navigation.getState()?.routes?.find(r => r.name === 'Marketplace')?.params?.searchQuery;
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

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Load products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  const priceRanges = ['All', 'Free', '₹0-₹5,000', '₹5,000-₹10,000', '₹10,000-₹25,000', '₹25,000+'];
  const ratings = ['All', '4.5+ Stars', '4+ Stars', '3.5+ Stars', '3+ Stars'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
      // Price filter
      let matchesPrice = true;
      if (selectedPrice !== 'All') {
        const price = product.price || 0;
        switch (selectedPrice) {
          case 'Free':
            matchesPrice = price === 0;
            break;
          case '₹0-₹5,000':
            matchesPrice = price > 0 && price <= 5000;
            break;
          case '₹5,000-₹10,000':
            matchesPrice = price > 5000 && price <= 10000;
            break;
          case '₹10,000-₹25,000':
            matchesPrice = price > 10000 && price <= 25000;
            break;
          case '₹25,000+':
            matchesPrice = price > 25000;
            break;
        }
      }
      
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
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [products, searchQuery, selectedCategory, selectedPrice, selectedRating]);

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
          name: 'Akions',
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
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <Text style={styles.title}>Ready-Made Software Products</Text>

          <View style={styles.searchFiltersRow}>
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
                style={[styles.filterBox, selectedPrice !== 'All' && styles.filterBoxActive]}
                onPress={() => setShowPriceModal(true)}
              >
                <Text style={styles.filterBoxText}>
                  {selectedPrice === 'All' ? 'Price' : selectedPrice} ▼
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
              {(selectedCategory !== 'All' || selectedPrice !== 'All' || selectedRating !== 'All') && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSelectedCategory('All');
                    setSelectedPrice('All');
                    setSelectedRating('All');
                  }}
                >
                  <Text style={styles.clearFiltersText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {loading ? (
            <Text style={styles.loading}>Loading products...</Text>
          ) : filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found matching your filters</Text>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSelectedCategory('All');
                  setSelectedPrice('All');
                  setSelectedRating('All');
                  setSearchQuery('');
                }}
              >
                <Text style={styles.clearFiltersText}>Clear All Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <View key={product.id} style={styles.productColumn}>
                  <Card
                    title={product.title}
                    description={product.description}
                    image={product.image}
                    onPress={() => navigation.navigate('ProductDetails', { productId: product.id || product._id })}
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
                      <Text style={styles.priceText}>₹{product.price?.toLocaleString() || 0}</Text>
                      <TouchableOpacity
                        style={styles.buyButton}
                        onPress={() => navigation.navigate('ProductDetails', { productId: product.id || product._id })}
                      >
                        <Text style={styles.buyButtonText}>Buy Now</Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                </View>
              ))}
            </View>
          )}

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

          {/* Price Filter Modal */}
          <Modal
            visible={showPriceModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowPriceModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowPriceModal(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Price Range</Text>
                {priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.modalOption,
                      selectedPrice === range && styles.modalOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedPrice(range);
                      setShowPriceModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedPrice === range && styles.modalOptionTextSelected,
                      ]}
                    >
                      {range}
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
      </ScrollView>
    </View>
  );
};
