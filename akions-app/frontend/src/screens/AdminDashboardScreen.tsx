import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const API_BASE = API_URL;

interface AdminItem {
  id: string;
  title: string;
  [key: string]: any;
}

export const AdminDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'blogs' | 'projects' | 'internships'>('products');
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigation.navigate('Home');
      return;
    }
    loadItems();
  }, [activeTab, user]);

  const loadItems = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/${activeTab}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Load items error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(getDefaultFormData());
    setShowModal(true);
  };

  const handleEdit = (item: AdminItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE}/admin/${activeTab}/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
              loadItems();
            }
          } catch (error) {
            console.error('Delete error:', error);
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (!accessToken) return;
    try {
      const url = editingItem
        ? `${API_BASE}/admin/${activeTab}/${editingItem.id}`
        : `${API_BASE}/admin/${activeTab}`;
      const method = editingItem ? 'PUT' : 'POST';

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
        loadItems();
      } else {
        const error = await res.json();
        Alert.alert('Error', error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save');
    }
  };

  const getDefaultFormData = () => {
    switch (activeTab) {
      case 'products':
        return { title: '', description: '', image: '', category: '', price: 0, rating: 0 };
      case 'blogs':
        return {
          title: '',
          excerpt: '',
          content: '',
          author: user?.name || '',
          publishedDate: new Date().toLocaleDateString(),
          image: '',
          category: '',
          likes: 0,
          shares: 0,
          comments: [],
        };
      case 'projects':
        return { title: '', description: '', image: '', category: '', price: 0, features: [], technologies: [] };
      case 'internships':
        return {
          title: '',
          company: '',
          location: '',
          type: 'Remote',
          duration: '',
          stipend: '',
          description: '',
          image: '',
        };
      default:
        return {};
    }
  };

  const getFormFields = () => {
    switch (activeTab) {
      case 'products':
        return ['title', 'description', 'image', 'category', 'price', 'rating'];
      case 'blogs':
        return ['title', 'excerpt', 'content', 'author', 'publishedDate', 'image', 'category'];
      case 'projects':
        return ['title', 'description', 'image', 'category', 'price'];
      case 'internships':
        return ['title', 'company', 'location', 'type', 'duration', 'stipend', 'description', 'image'];
      default:
        return [];
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <Text style={styles.title}>Admin Dashboard</Text>

          <View style={styles.tabs}>
            {(['products', 'blogs', 'projects', 'internships'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>+ Add New</Text>
          </TouchableOpacity>

          {loading ? (
            <Text style={styles.loading}>Loading...</Text>
          ) : (
            <View style={styles.itemsList}>
              {items.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSubtitle} numberOfLines={2}>
                      {item.description || item.excerpt || item.company || ''}
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
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
                <Text style={styles.modalTitle}>{editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}</Text>
                <ScrollView style={styles.form}>
                  {getFormFields().map((field) => (
                    <View key={field} style={styles.formField}>
                      <Text style={styles.formLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                      <TextInput
                        style={styles.formInput}
                        value={String(formData[field] || '')}
                        onChangeText={(text) => {
                          const value = field === 'price' || field === 'rating' ? parseFloat(text) || 0 : text;
                          setFormData({ ...formData, [field]: value });
                        }}
                        placeholder={`Enter ${field}`}
                        multiline={field === 'description' || field === 'content' || field === 'excerpt'}
                        keyboardType={field === 'price' || field === 'rating' ? 'numeric' : 'default'}
                      />
                    </View>
                  ))}
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
  inner: { paddingVertical: 32, paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#111827', marginBottom: 24 },
  tabs: { flexDirection: 'row', marginBottom: 24, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#e5e7eb' },
  tabActive: { backgroundColor: '#2563eb' },
  tabText: { color: '#4b5563', fontWeight: '500' },
  tabTextActive: { color: '#ffffff', fontWeight: '600' },
  addButton: { backgroundColor: '#10b981', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginBottom: 24, alignSelf: 'flex-start' },
  addButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  loading: { textAlign: 'center', color: '#6b7280', marginTop: 24 },
  itemsList: { gap: 16 },
  itemCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  itemContent: { marginBottom: 12 },
  itemTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  itemSubtitle: { fontSize: 14, color: '#6b7280' },
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
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
  cancelButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: '#e5e7eb' },
  cancelButtonText: { color: '#374151', fontWeight: '600' },
  saveButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: '#2563eb' },
  saveButtonText: { color: '#ffffff', fontWeight: '600' },
});

