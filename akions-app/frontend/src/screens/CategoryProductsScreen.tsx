import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Navbar } from '../components/Navbar';
import { SEO } from '../components/SEO';
import { Card } from '../components/Card';
import { Footer } from '../components/Footer';
import { Product } from '../types';
import { API_URL } from '../config/api';

const API_BASE = API_URL;

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  headerImage?: string;
  headerContent?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  children?: Category[];
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
      width: '100%',
    },
    
    // Header Section
    headerSection: {
      marginBottom: isMobile ? 24 : 40,
      position: 'relative',
    },
    headerImage: {
      width: '100%',
      height: isMobile ? 200 : 300,
      borderRadius: 16,
      backgroundColor: '#e5e7eb',
    },
    headerOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: isMobile ? 16 : 24,
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
    headerTitle: {
      fontSize: isMobile ? 24 : isTablet ? 32 : 40,
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: 8,
    },
    headerDescription: {
      fontSize: isMobile ? 14 : 16,
      color: '#4b5563',
      lineHeight: isMobile ? 20 : 24,
    },

    // Title Section (when no header image)
    titleSection: {
      marginBottom: isMobile ? 24 : 32,
      paddingHorizontal: isMobile ? 8 : 0,
    },
    title: {
      fontSize: isMobile ? 28 : isTablet ? 36 : 44,
      fontWeight: '700',
      color: '#111827',
      marginBottom: 12,
      textAlign: 'center',
    },
    description: {
      fontSize: isMobile ? 14 : 16,
      color: '#6b7280',
      textAlign: 'center',
      maxWidth: 800,
      alignSelf: 'center',
      lineHeight: isMobile ? 22 : 26,
    },

    // Content Section
    contentSection: {
      backgroundColor: '#f8fafc',
      borderRadius: 16,
      padding: isMobile ? 16 : 24,
      marginBottom: isMobile ? 24 : 32,
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    contentText: {
      fontSize: isMobile ? 14 : 16,
      color: '#4b5563',
      lineHeight: isMobile ? 22 : 26,
    },

    // Subcategories Section
    subcategoriesSection: {
      marginBottom: isMobile ? 24 : 32,
    },
    subcategoriesTitle: {
      fontSize: isMobile ? 18 : 22,
      fontWeight: '600',
      color: '#111827',
      marginBottom: isMobile ? 12 : 16,
    },
    subcategoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: isMobile ? 8 : 12,
    },
    subcategoryChip: {
      backgroundColor: '#ffffff',
      paddingHorizontal: isMobile ? 14 : 18,
      paddingVertical: isMobile ? 8 : 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    subcategoryChipActive: {
      backgroundColor: '#2563eb',
      borderColor: '#3b82f6',
    },
    subcategoryText: {
      color: '#4b5563',
      fontSize: isMobile ? 13 : 14,
      fontWeight: '500',
    },
    subcategoryTextActive: {
      color: '#ffffff',
    },

    // Products Section
    productsSection: {
      marginBottom: isMobile ? 24 : 32,
    },
    sectionTitle: {
      fontSize: isMobile ? 20 : 24,
      fontWeight: '700',
      color: '#111827',
      marginBottom: isMobile ? 16 : 24,
    },
    productsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: isMobile ? 'center' : (Platform.OS === 'web' ? 'flex-start' : 'center'),
      gap: isMobile ? 12 : 20,
    },
    productColumn: {
      width: isMobile ? '100%' : (screenWidth > 1024 ? '31%' : screenWidth > 768 ? '48%' : '100%'),
      marginBottom: isMobile ? 16 : 24,
      minHeight: isMobile ? 400 : 450,
      maxWidth: isMobile ? '100%' : (screenWidth > 1024 ? 380 : screenWidth > 768 ? 350 : '100%'),
    },
    cardFooterRow: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    categoryBadge: {
      backgroundColor: '#f3f4f6',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 8,
    },
    categoryBadgeText: {
      fontSize: 11,
      color: '#6b7280',
      fontWeight: '500',
    },
    ratingText: {
      fontSize: 14,
      color: '#fbbf24',
      fontWeight: '600',
    },
    priceRow: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: isMobile ? 4 : 0,
    },
    priceText: {
      fontSize: isMobile ? 16 : 18,
      fontWeight: '700',
      color: '#111827',
    },
    viewButton: {
      backgroundColor: '#2563eb',
      paddingHorizontal: isMobile ? 16 : 20,
      paddingVertical: isMobile ? 8 : 10,
      borderRadius: 8,
    },
    viewButtonText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: isMobile ? 13 : 14,
    },

    // Empty & Loading States
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 64,
    },
    loadingText: {
      color: '#6b7280',
      fontSize: 16,
      marginTop: 16,
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
      fontSize: 14,
    },

    // Breadcrumb
    breadcrumb: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isMobile ? 16 : 24,
      flexWrap: 'wrap',
    },
    breadcrumbItem: {
      color: '#6b7280',
      fontSize: isMobile ? 12 : 14,
    },
    breadcrumbSeparator: {
      color: '#6b7280',
      marginHorizontal: 8,
      fontSize: isMobile ? 12 : 14,
    },
    breadcrumbActive: {
      color: '#111827',
      fontWeight: '500',
    },
    breadcrumbLink: {
      color: '#3b82f6',
    },

    // Pagination
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: isMobile ? 24 : 32,
      gap: isMobile ? 4 : 8,
      flexWrap: 'wrap',
    },
    pageButton: {
      paddingHorizontal: isMobile ? 8 : 12,
      paddingVertical: isMobile ? 6 : 8,
      borderRadius: 8,
      backgroundColor: '#f3f4f6',
      minWidth: isMobile ? 36 : 44,
      alignItems: 'center',
    },
    pageText: {
      color: '#6b7280',
      fontSize: isMobile ? 12 : 14,
    },
    pageActive: {
      backgroundColor: '#2563eb',
    },
    pageActiveText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: isMobile ? 12 : 14,
    },

    // Product Count
    productCount: {
      color: '#6b7280',
      fontSize: isMobile ? 13 : 14,
      marginBottom: isMobile ? 12 : 16,
    },

    // Error State
    errorContainer: {
      paddingVertical: 64,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      color: '#ef4444',
      fontSize: 18,
      marginBottom: 16,
      textAlign: 'center',
    },
  });
};

export const CategoryProductsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const styles = createStyles(SCREEN_WIDTH);
  
  const { slug, categoryId } = route.params || {};
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    loadCategoryAndProducts();
  }, [slug, categoryId]);

  const loadCategoryAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const identifier = slug || categoryId;
      if (!identifier) {
        setError('Category not found');
        setLoading(false);
        return;
      }

      // Load category details
      const categoryRes = await fetch(`${API_BASE}/api/categories/${identifier}`);
      if (!categoryRes.ok) {
        throw new Error('Category not found');
      }
      const categoryData = await categoryRes.json();
      setCategory(categoryData);

      // Load products for this category
      const productsRes = await fetch(`${API_BASE}/api/categories/${identifier}/products`);
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }
    } catch (err: any) {
      console.error('Error loading category:', err);
      setError(err.message || 'Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageButton, currentPage === i && styles.pageActive]}
          onPress={() => setCurrentPage(i)}
        >
          <Text style={[styles.pageText, currentPage === i && styles.pageActiveText]}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return <View style={styles.pagination}>{pages}</View>;
  };

  const navigateToProduct = (product: Product) => {
    navigation.navigate('ProductDetails', { id: product._id });
  };

  const navigateToSubcategory = (subCategory: Category) => {
    navigation.push('CategoryProducts', { slug: subCategory.slug });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading category...</Text>
        </View>
      </View>
    );
  }

  if (error || !category) {
    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Category not found'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Marketplace')}>
            <Text style={styles.backButtonText}>Back to Marketplace</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SEO
        title={category.metaTitle || `${category.name} - Akions`}
        description={category.metaDescription || category.description || `Browse ${category.name} products on Akions`}
        keywords={category.metaKeywords || category.name}
      />
      <Navbar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          {/* Breadcrumb */}
          <View style={styles.breadcrumb}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text style={[styles.breadcrumbItem, styles.breadcrumbLink]}>Home</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>›</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Marketplace')}>
              <Text style={[styles.breadcrumbItem, styles.breadcrumbLink]}>Products</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>›</Text>
            <Text style={[styles.breadcrumbItem, styles.breadcrumbActive]}>{category.name}</Text>
          </View>

          {/* Header Section */}
          {category.headerImage ? (
            <View style={styles.headerSection}>
              {Platform.OS === 'web' ? (
                <img
                  src={category.headerImage}
                  alt={category.name}
                  style={{
                    width: '100%',
                    height: SCREEN_WIDTH < 768 ? 200 : 300,
                    objectFit: 'cover',
                    borderRadius: 16,
                  }}
                />
              ) : (
                <View style={styles.headerImage} />
              )}
              <View style={styles.headerOverlay}>
                <Text style={styles.headerTitle}>{category.name}</Text>
                {category.headerContent && (
                  <Text style={styles.headerDescription}>{category.headerContent}</Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.titleSection}>
              <Text style={styles.title}>{category.name}</Text>
              {category.description && (
                <Text style={styles.description}>{category.description}</Text>
              )}
            </View>
          )}

          {/* Content Section */}
          {category.content && (
            <View style={styles.contentSection}>
              <Text style={styles.contentText}>{category.content}</Text>
            </View>
          )}

          {/* Subcategories */}
          {category.children && category.children.length > 0 && (
            <View style={styles.subcategoriesSection}>
              <Text style={styles.subcategoriesTitle}>Subcategories</Text>
              <View style={styles.subcategoriesGrid}>
                {category.children.map((sub) => (
                  <TouchableOpacity
                    key={sub._id}
                    style={styles.subcategoryChip}
                    onPress={() => navigateToSubcategory(sub)}
                  >
                    <Text style={styles.subcategoryText}>{sub.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Products Section */}
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Products</Text>
            <Text style={styles.productCount}>
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </Text>

            {products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products in this category yet.</Text>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate('Marketplace')}
                >
                  <Text style={styles.backButtonText}>Browse All Products</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.productsGrid}>
                  {paginatedProducts.map((product) => (
                    <View key={product._id} style={styles.productColumn}>
                      <Card
                        title={product.name}
                        description={product.description}
                        image={product.images?.[0]}
                        footer={
                          <View>
                            <View style={styles.cardFooterRow}>
                              <View style={styles.categoryBadge}>
                                <Text style={styles.categoryBadgeText}>
                                  {category.name}
                                </Text>
                              </View>
                              <Text style={styles.ratingText}>★ {product.rating || 4.5}</Text>
                            </View>
                            <View style={styles.priceRow}>
                              <Text style={styles.priceText}>₹{product.price?.toLocaleString()}</Text>
                              <TouchableOpacity
                                style={styles.viewButton}
                                onPress={() => navigateToProduct(product)}
                              >
                                <Text style={styles.viewButtonText}>View Details</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        }
                      />
                    </View>
                  ))}
                </View>
                {renderPagination()}
              </>
            )}
          </View>
        </View>
        <Footer navigation={navigation} />
      </ScrollView>
    </View>
  );
};

export default CategoryProductsScreen;
