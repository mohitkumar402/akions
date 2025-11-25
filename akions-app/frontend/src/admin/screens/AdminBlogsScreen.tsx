import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { FileUpload } from '../../components/FileUpload';
import { useAuth } from '../../context/AuthContext';
import { BlogPost } from '../../types';
import { API_URL } from '../../config/api';

const API_BASE = API_URL;

export const AdminBlogsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    publishedDate: new Date().toLocaleDateString(),
    image: '',
    category: '',
    likes: 0,
    shares: 0,
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigation.navigate('Home');
      return;
    }
    loadBlogs();
  }, [user]);

  const loadBlogs = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/blogs`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Load blogs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: user?.name || '',
      publishedDate: new Date().toLocaleDateString(),
      image: '',
      category: '',
      likes: 0,
      shares: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      publishedDate: blog.publishedDate,
      image: blog.image,
      category: blog.category,
      likes: blog.likes || 0,
      shares: blog.shares || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this blog post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!accessToken) return;
          try {
            const res = await fetch(`${API_BASE}/admin/blogs/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
              loadBlogs();
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
      Alert.alert('Error', 'Please login to save blogs');
      return;
    }

    if (!formData.title || !formData.excerpt || !formData.content || !formData.author || !formData.category) {
      Alert.alert('Validation Error', 'Please fill in all required fields (Title, Excerpt, Content, Author, Category)');
      return;
    }

    try {
      const url = editingBlog
        ? `${API_BASE}/admin/blogs/${editingBlog.id || editingBlog._id}`
        : `${API_BASE}/admin/blogs`;
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...formData, comments: editingBlog?.comments || [] }),
      });

      if (res.ok) {
        setShowModal(false);
        loadBlogs();
        Alert.alert('Success', editingBlog ? 'Blog updated successfully' : 'Blog created successfully');
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
      <AdminHeader activeSection="blogs" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Manage Blog Posts</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>+ Add New Blog</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={styles.loading}>Loading blogs...</Text>
          ) : (
            <View style={styles.itemsList}>
              {blogs.map((blog) => (
                <View key={blog.id} style={styles.itemCard}>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{blog.title}</Text>
                    <Text style={styles.itemSubtitle} numberOfLines={2}>
                      {blog.excerpt}
                    </Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.metaText}>Author: {blog.author}</Text>
                      <Text style={styles.metaText}>Category: {blog.category}</Text>
                      <Text style={styles.metaText}>Date: {blog.publishedDate}</Text>
                    </View>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(blog)}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(blog.id || blog._id)}>
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
                <Text style={styles.modalTitle}>{editingBlog ? 'Edit' : 'Add New'} Blog Post</Text>
                <ScrollView style={styles.form}>
                  {['title', 'excerpt', 'content', 'author', 'publishedDate', 'category'].map((field) => (
                    <View key={field} style={styles.formField}>
                      <Text style={styles.formLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                      <TextInput
                        style={[styles.formInput, (field === 'excerpt' || field === 'content') && styles.formInputLarge]}
                        value={String(formData[field as keyof typeof formData] || '')}
                        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                        placeholder={`Enter ${field}`}
                        multiline={field === 'excerpt' || field === 'content'}
                      />
                    </View>
                  ))}
                  
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
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
  cancelButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: '#e5e7eb' },
  cancelButtonText: { color: '#374151', fontWeight: '600' },
  saveButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: '#2563eb' },
  saveButtonText: { color: '#ffffff', fontWeight: '600' },
});

