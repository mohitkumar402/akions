import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { FileUpload } from '../../components/FileUpload';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

const API_BASE = 'http://localhost:3000/api';

export const AdminProductsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    price: 0,
    rating: 0,
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigation.navigate('Home');
      return;
    }
    loadProducts();
  }, [user]);

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

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ title: '', description: '', image: '', category: '', price: 0, rating: 0 });
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      image: product.image,
      category: product.category,
      price: product.price || 0,
      rating: product.rating || 0,
    });
    setShowModal(true);
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
    if (!accessToken) {
      Alert.alert('Error', 'Please login to save products');
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      Alert.alert('Validation Error', 'Please fill in all required fields (Title, Description, Category)');
      return;
    }

    try {
      const url = editingProduct
        ? `${API_BASE}/admin/products/${editingProduct.id || editingProduct._id}`
        : `${API_BASE}/admin/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        loadProducts();
        Alert.alert('Success', editingProduct ? 'Product updated successfully' : 'Product created successfully');
      } else {
        const error = await res.json();
        Alert.alert('Error', error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save');
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <View style={styles.container}>
      <AdminHeader activeSection="products" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Manage Products</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>+ Add New Product</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={styles.loading}>Loading products...</Text>
          ) : (
            <View style={styles.itemsList}>
              {products.map((product) => (
                <View key={product.id} style={styles.itemCard}>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{product.title}</Text>
                    <Text style={styles.itemSubtitle} numberOfLines={2}>
                      {product.description}
                    </Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.metaText}>Category: {product.category}</Text>
                      <Text style={styles.metaText}>Price: ₹{product.price || 0}</Text>
                      <Text style={styles.metaText}>Rating: {product.rating || 0}⭐</Text>
                    </View>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(product)}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(product.id || product._id)}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Modal visible={showModal} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{editingProduct ? 'Edit' : 'Add New'} Product</Text>
                <ScrollView style={styles.form}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Title</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.title}
                      onChangeText={(text) => setFormData({ ...formData, title: text })}
                      placeholder="Enter title"
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Description</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputLarge]}
                      value={formData.description}
                      onChangeText={(text) => setFormData({ ...formData, description: text })}
                      placeholder="Enter description"
                      multiline
                    />
                  </View>

                  <View style={styles.formField}>
                    <FileUpload
                      label="Image/Video"
                      accept="both"
                      currentUrl={formData.image}
                      onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                    />
                    <Text style={styles.orText}>OR</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.image}
                      onChangeText={(text) => setFormData({ ...formData, image: text })}
                      placeholder="Enter image/video URL"
                    />
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Category</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.category}
                      onChangeText={(text) => setFormData({ ...formData, category: text })}
                      placeholder="Enter category"
                    />
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Price</Text>
                    <TextInput
                      style={styles.formInput}
                      value={String(formData.price)}
                      onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
                      placeholder="Enter price"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Rating</Text>
                    <TextInput
                      style={styles.formInput}
                      value={String(formData.rating)}
                      onChangeText={(text) => setFormData({ ...formData, rating: parseFloat(text) || 0 })}
                      placeholder="Enter rating (0-5)"
                      keyboardType="numeric"
                    />
                  </View>
                </ScrollView>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { paddingBottom: 32 },
  inner: { paddingVertical: 24, paddingHorizontal: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  addButton: { backgroundColor: '#10b981', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  addButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  loading: { textAlign: 'center', color: '#6b7280', marginTop: 24, fontSize: 16 },
  itemsList: { gap: 16 },
  itemCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  itemContent: { marginBottom: 12 },
  itemTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  itemSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  itemMeta: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  metaText: { fontSize: 12, color: '#4b5563' },
  itemActions: { flexDirection: 'row', gap: 8 },
  editButton: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  editButtonText: { color: '#ffffff', fontWeight: '500' },
  deleteButton: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  deleteButtonText: { color: '#ffffff', fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#ffffff', borderRadius: 12, padding: 24, width: '90%', maxWidth: 600, maxHeight: '80%' },
  modalTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 24 },
  form: { maxHeight: 400 },
  formField: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  formInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16, minHeight: 44 },
  formInputLarge: { minHeight: 100 },
  orText: { textAlign: 'center', color: '#6b7280', marginVertical: 8, fontSize: 12, fontWeight: '600' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
  cancelButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: '#e5e7eb' },
  cancelButtonText: { color: '#374151', fontWeight: '600' },
  saveButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: '#2563eb' },
  saveButtonText: { color: '#ffffff', fontWeight: '600' },
});

