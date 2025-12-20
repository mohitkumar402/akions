import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, Platform, Dimensions, TextInput, Modal } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const API_BASE = API_URL;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProductDetailsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { productId } = route.params;
  const { user, accessToken } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        Alert.alert('Error', 'Product not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Load product error:', error);
      Alert.alert('Error', 'Failed to load product');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to purchase this product', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }
    setShowContactForm(true);
  };

  const handleSubmitContact = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert('Validation Error', 'Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      // Send contact request to backend
      const res = await fetch(`${API_BASE}/products/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({
          productId: product?.id || product?._id,
          productName: product?.title,
          ...formData,
        }),
      });

      if (res.ok) {
        Alert.alert(
          'Request Submitted!',
          'Thank you for your interest. Our team will contact you soon via email/phone.',
          [
            {
              text: 'OK',
              onPress: () => {
                setShowContactForm(false);
                setFormData({ name: '', email: '', phone: '', company: '', message: '' });
              },
            },
          ]
        );
      } else {
        const error = await res.json();
        Alert.alert('Error', error.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Submit contact error:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.container}>
        <Navbar />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image || 'https://via.placeholder.com/800x400' }}
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <View style={styles.headerRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{product.category}</Text>
              </View>
              {product.rating && (
                <Text style={styles.ratingText}>⭐ {product.rating.toFixed(1)}</Text>
              )}
            </View>

            <Text style={styles.productTitle}>{product.title}</Text>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>

            {/* Features Section */}
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Key Features</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>Professional quality product</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>Full support and documentation</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>Regular updates and maintenance</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>Customization available</Text>
                </View>
              </View>
            </View>

            {/* Buy Now Button */}
            <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
              <Text style={styles.buyButtonText}>Buy Now - Get Quote</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Footer navigation={navigation} />
      </ScrollView>

      {/* Contact Form Modal */}
      <Modal
        visible={showContactForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContactForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Get Quote for {product.title}</Text>
            <Text style={styles.modalSubtitle}>
              Fill in your details and our team will contact you with a customized solution
            </Text>

            <ScrollView style={styles.formScroll}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Full Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter your full name"
                  placeholderTextColor="#6b7280"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Email *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#6b7280"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="+91 1234567890"
                  keyboardType="phone-pad"
                  placeholderTextColor="#6b7280"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Company/Organization</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.company}
                  onChangeText={(text) => setFormData({ ...formData, company: text })}
                  placeholder="Your company name (optional)"
                  placeholderTextColor="#6b7280"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Additional Message</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={formData.message}
                  onChangeText={(text) => setFormData({ ...formData, message: text })}
                  placeholder="Any specific requirements or questions..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor="#6b7280"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowContactForm(false);
                  setFormData({ name: '', email: '', phone: '', company: '', message: '' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmitContact}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  inner: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: Platform.OS === 'web' ? 500 : 300,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1f2937',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ratingText: {
    fontSize: 16,
    color: '#fbbf24',
    fontWeight: '700',
  },
  productTitle: {
    fontSize: Platform.OS === 'web' ? 36 : 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureBullet: {
    color: '#10b981',
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  buyButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    }),
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    width: Platform.OS === 'web' ? 600 : '100%',
    maxWidth: 600,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  formScroll: {
    maxHeight: Platform.OS === 'web' ? 400 : 300,
  },
  formField: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    minHeight: 44,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});






