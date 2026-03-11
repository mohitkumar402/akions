import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Image, Platform, Dimensions } from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { FileUpload } from '../../components/FileUpload';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';
import { API_URL } from '../../config/api';

const API_BASE = API_URL;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isMobile = SCREEN_WIDTH < 768;

interface Category {
  _id: string;
  name: string;
  parentCategory?: { _id: string; name: string } | null;
}

type ViewMode = 'list' | 'edit' | 'add';

export const AdminProductsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    categoryId: '',
    price: 0,
    rating: 0,
    sequenceNo: 0,
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== 'admin') {
      navigation.navigate('AdminLogin');
      return;
    }
    loadProducts();
    loadCategories();
  }, [user, authLoading]);

  const loadProducts = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/products`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Load categories error:', error);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      category: '',
      categoryId: '',
      price: 0,
      rating: 0,
      sequenceNo: products.length + 1,
      metaTitle: '',
      metaKeyword: '',
      metaDescription: '',
    });
    setViewMode('add');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      image: product.image,
      category: product.category,
      categoryId: (product as any).categoryId || '',
      price: product.price || 0,
      rating: product.rating || 0,
      sequenceNo: (product as any).sequenceNo || 0,
      metaTitle: (product as any).metaTitle || '',
      metaKeyword: (product as any).metaKeyword || '',
      metaDescription: (product as any).metaDescription || '',
    });
    setViewMode('edit');
  };

  const handleBack = () => {
    setViewMode('list');
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!accessToken) return;
          try {
            const res = await fetch(`${API_BASE}/admin/products/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
              loadProducts();
            }
          } catch (error) {
            console.error('Delete error:', error);
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    console.log('[AdminProducts] handleSave called, formData:', formData);
    
    if (!accessToken) {
      Alert.alert('Error', 'Please login to save products');
      console.log('[AdminProducts] No access token');
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      Alert.alert('Validation Error', 'Please fill in all required fields (Title, Description, Category)');
      console.log('[AdminProducts] Validation failed - missing fields');
      return;
    }

    try {
      const url = editingProduct
        ? `${API_BASE}/admin/products/${editingProduct.id || editingProduct._id}`
        : `${API_BASE}/admin/products`;
      const method = editingProduct ? 'PUT' : 'POST';
      
      console.log('[AdminProducts] Sending request to:', url, 'method:', method);

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('[AdminProducts] Response status:', res.status);

      if (res.ok) {
        loadProducts();
        setViewMode('list');
        Alert.alert('Success', editingProduct ? 'Product updated successfully' : 'Product created successfully');
      } else {
        const error = await res.json();
        console.log('[AdminProducts] Error response:', error);
        Alert.alert('Error', error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('[AdminProducts] Save error:', error);
      Alert.alert('Error', 'Failed to save product');
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  // Edit/Add Form View
  if (viewMode === 'edit' || viewMode === 'add') {
    return (
      <View style={styles.container}>
        <AdminHeader activeSection="products" />
        <ScrollView style={styles.content}>
          {/* Edit Header */}
          <View style={styles.editHeader}>
            <Text style={styles.editTitle}>{viewMode === 'edit' ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</Text>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Row 1: Title, Sequence No, Photo */}
            <View style={styles.formRow}>
              <View style={[styles.formField, { flex: 2 }]}>
                <Text style={styles.formLabel}>*Title</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="Enter product title"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={[styles.formField, { width: 150 }]}>
                <Text style={styles.formLabel}>Sequence No</Text>
                <TextInput
                  style={styles.formInput}
                  value={String(formData.sequenceNo)}
                  onChangeText={(text) => setFormData({ ...formData, sequenceNo: parseInt(text) || 0 })}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={[styles.formField, { width: 200 }]}>
                <Text style={styles.formLabel}>Photo</Text>
                <FileUpload
                  label=""
                  accept="image"
                  currentUrl={formData.image}
                  onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                />
              </View>
            </View>

            {/* Image Preview */}
            {formData.image ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: formData.image }} style={styles.previewImage} resizeMode="contain" />
              </View>
            ) : null}

            {/* Row 2: Category, Price, Rating */}
            <View style={styles.formRow}>
              <View style={[styles.formField, { flex: 1.5 }]}>
                <Text style={styles.formLabel}>*Category</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={styles.picker}
                    onPress={() => {
                      if (Platform.OS === 'web') {
                        const select = document.createElement('select');
                        select.style.position = 'absolute';
                        select.style.opacity = '0';
                        
                        // Add "Select Category" option
                        const defaultOpt = document.createElement('option');
                        defaultOpt.value = '';
                        defaultOpt.text = '-- Select Category --';
                        select.appendChild(defaultOpt);
                        
                        // Group categories by parent
                        const parentCats = categories.filter(c => !c.parentCategory);
                        const childCats = categories.filter(c => c.parentCategory);
                        
                        parentCats.forEach(parent => {
                          const opt = document.createElement('option');
                          opt.value = parent._id;
                          opt.text = parent.name;
                          if (parent._id === formData.categoryId) opt.selected = true;
                          select.appendChild(opt);
                          
                          // Add children indented
                          childCats
                            .filter(c => c.parentCategory?._id === parent._id)
                            .forEach(child => {
                              const childOpt = document.createElement('option');
                              childOpt.value = child._id;
                              childOpt.text = `  └ ${child.name}`;
                              if (child._id === formData.categoryId) childOpt.selected = true;
                              select.appendChild(childOpt);
                            });
                        });
                        
                        // Add orphan categories (no parent match)
                        childCats
                          .filter(c => !parentCats.find(p => p._id === c.parentCategory?._id))
                          .forEach(orphan => {
                            const opt = document.createElement('option');
                            opt.value = orphan._id;
                            opt.text = orphan.name;
                            if (orphan._id === formData.categoryId) opt.selected = true;
                            select.appendChild(opt);
                          });
                        
                        select.onchange = (e) => {
                          const selectedId = (e.target as HTMLSelectElement).value;
                          const selectedCat = categories.find(c => c._id === selectedId);
                          setFormData({ 
                            ...formData, 
                            categoryId: selectedId,
                            category: selectedCat?.name || ''
                          });
                          document.body.removeChild(select);
                        };
                        select.onblur = () => document.body.removeChild(select);
                        document.body.appendChild(select);
                        select.focus();
                        select.click();
                      }
                    }}
                  >
                    <Text style={[styles.pickerText, !formData.category && styles.pickerPlaceholder]}>
                      {formData.category || '-- Select Category --'}
                    </Text>
                    <Text style={styles.pickerArrow}>▼</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.helpText}>
                  Select from existing categories or{' '}
                  <Text 
                    style={styles.linkText}
                    onPress={() => navigation.navigate('AdminCategories')}
                  >
                    create a new category
                  </Text>
                </Text>
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>Price (₹)</Text>
                <TextInput
                  style={styles.formInput}
                  value={String(formData.price)}
                  onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
                  placeholder="Enter price"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>Rating (0-5)</Text>
                <TextInput
                  style={styles.formInput}
                  value={String(formData.rating)}
                  onChangeText={(text) => {
                    const val = parseFloat(text) || 0;
                    // Clamp rating between 0 and 5
                    setFormData({ ...formData, rating: Math.min(5, Math.max(0, val)) });
                  }}
                  placeholder="Enter rating (0-5)"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>*Description</Text>
              <TextInput
                style={[styles.formInput, styles.formTextarea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Enter product description..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={8}
              />
            </View>

            {/* Row: Meta Title, Meta Keyword */}
            <View style={styles.formRow}>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>Meta Title</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextareaSmall]}
                  value={formData.metaTitle}
                  onChangeText={(text) => setFormData({ ...formData, metaTitle: text })}
                  placeholder="SEO meta title"
                  placeholderTextColor="#9ca3af"
                  multiline
                />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>Meta Keyword</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextareaSmall]}
                  value={formData.metaKeyword}
                  onChangeText={(text) => setFormData({ ...formData, metaKeyword: text })}
                  placeholder="keyword1, keyword2, keyword3"
                  placeholderTextColor="#9ca3af"
                  multiline
                />
              </View>
            </View>

            {/* Meta Description */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Meta Description</Text>
              <TextInput
                style={[styles.formInput, styles.formTextareaSmall]}
                value={formData.metaDescription}
                onChangeText={(text) => setFormData({ ...formData, metaDescription: text })}
                placeholder="SEO meta description"
                placeholderTextColor="#9ca3af"
                multiline
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.formActions}>
              <TouchableOpacity 
                style={styles.updateButton} 
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Text style={styles.updateButtonText}>{viewMode === 'edit' ? 'Update' : 'Create'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleBack} activeOpacity={0.7}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // List View
  return (
    <View style={styles.container}>
      <AdminHeader activeSection="products" />
      <ScrollView style={styles.content}>
        <View style={styles.inner}>
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>PRODUCTS</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {/* Table Container */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colSrNo]}>Sr.No</Text>
              <Text style={[styles.tableHeaderCell, styles.colTitle]}>Title</Text>
              <Text style={[styles.tableHeaderCell, styles.colPhoto]}>Photo</Text>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description</Text>
              <Text style={[styles.tableHeaderCell, styles.colCategory]}>Category</Text>
              <Text style={[styles.tableHeaderCell, styles.colPrice]}>Price</Text>
              <Text style={[styles.tableHeaderCell, styles.colAction]}>Action</Text>
            </View>

            {loading ? (
              <View style={styles.loadingRow}>
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : products.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No products found. Click "Add New" to create one.</Text>
              </View>
            ) : (
              products.map((product, index) => (
                <View key={product.id || product._id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.colSrNo]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, styles.colTitle]} numberOfLines={2}>{product.title}</Text>
                  <View style={styles.colPhoto}>
                    {product.image ? (
                      <Image source={{ uri: product.image }} style={styles.thumbnail} resizeMode="cover" />
                    ) : (
                      <View style={styles.noImage}>
                        <Text style={styles.noImageText}>No Image</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.tableCell, styles.colDesc]} numberOfLines={2}>{product.description}</Text>
                  <Text style={[styles.tableCell, styles.colCategory]}>{product.category}</Text>
                  <Text style={[styles.tableCell, styles.colPrice]}>₹{product.price || 0}</Text>
                  <View style={[styles.colAction, styles.actionCell]}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(product)}>
                      <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(product.id || product._id || '')}>
                      <Text style={styles.actionIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1 },
  inner: { padding: 24 },
  
  // Page Header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  addButtonIcon: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '600',
  },
  addButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },

  // Table
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2c3e50',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
  },
  
  // Column widths
  colSrNo: { width: 50 },
  colTitle: { flex: 1.5, textAlign: 'left' as any, paddingHorizontal: 8 },
  colPhoto: { width: 70, alignItems: 'center' as any, justifyContent: 'center' as any },
  colDesc: { flex: 2, textAlign: 'left' as any, paddingHorizontal: 8 },
  colCategory: { width: 90 },
  colPrice: { width: 80 },
  colAction: { width: 90 },

  thumbnail: {
    width: 50,
    height: 35,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  noImage: {
    width: 50,
    height: 35,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 8,
    color: '#9ca3af',
  },

  actionCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
  },
  actionIcon: {
    fontSize: 14,
  },

  loadingRow: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
  },
  emptyRow: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },

  // Edit Form Styles
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  formContainer: {
    backgroundColor: '#fff',
    margin: 24,
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#fff',
    minHeight: 44,
  },
  formTextarea: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  formTextareaSmall: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imagePreview: {
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
  },
  previewImage: {
    width: '100%',
    maxWidth: 600,
    height: 300,
    borderRadius: 8,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  updateButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Category Picker Styles
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
  },
  pickerText: {
    fontSize: 14,
    color: '#1f2937',
  },
  pickerPlaceholder: {
    color: '#9ca3af',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#6b7280',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
  },
  linkText: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
});
