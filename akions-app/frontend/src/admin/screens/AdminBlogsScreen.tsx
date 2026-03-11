import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Image, Platform } from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { FileUpload } from '../../components/FileUpload';
import { useAuth } from '../../context/AuthContext';
import { BlogPost } from '../../types';
import { API_URL } from '../../config/api';

const API_BASE = API_URL;

type ViewMode = 'list' | 'edit' | 'add';

export const AdminBlogsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    publishedDate: new Date().toLocaleDateString(),
    image: '',
    category: '',
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
    loadBlogs();
  }, [user, authLoading]);

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
      sequenceNo: blogs.length + 1,
      metaTitle: '',
      metaKeyword: '',
      metaDescription: '',
    });
    setViewMode('add');
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
      sequenceNo: (blog as any).sequenceNo || 0,
      metaTitle: (blog as any).metaTitle || '',
      metaKeyword: (blog as any).metaKeyword || '',
      metaDescription: (blog as any).metaDescription || '',
    });
    setViewMode('edit');
  };

  const handleBack = () => {
    setViewMode('list');
    setEditingBlog(null);
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
      Alert.alert('Validation Error', 'Please fill in all required fields');
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
        loadBlogs();
        setViewMode('list');
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

  // Edit/Add Form View
  if (viewMode === 'edit' || viewMode === 'add') {
    return (
      <View style={styles.container}>
        <AdminHeader activeSection="blogs" />
        <ScrollView style={styles.content}>
          {/* Edit Header */}
          <View style={styles.editHeader}>
            <Text style={styles.editTitle}>{viewMode === 'edit' ? 'EDIT BLOG' : 'ADD BLOG'}</Text>
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
                  placeholder="Enter blog title"
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

            {/* Row 2: Category, Author, Date */}
            <View style={styles.formRow}>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>*Category</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.category}
                  onChangeText={(text) => setFormData({ ...formData, category: text })}
                  placeholder="Enter category"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>*Author</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.author}
                  onChangeText={(text) => setFormData({ ...formData, author: text })}
                  placeholder="Enter author name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>Published Date</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.publishedDate}
                  onChangeText={(text) => setFormData({ ...formData, publishedDate: text })}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Description/Content */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>*Description</Text>
              <TextInput
                style={[styles.formInput, styles.formTextarea]}
                value={formData.content}
                onChangeText={(text) => setFormData({ ...formData, content: text })}
                placeholder="Enter full blog content..."
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

            {/* Excerpt */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>*Excerpt (Short Summary)</Text>
              <TextInput
                style={[styles.formInput, styles.formTextareaSmall]}
                value={formData.excerpt}
                onChangeText={(text) => setFormData({ ...formData, excerpt: text })}
                placeholder="Brief summary of the blog post"
                placeholderTextColor="#9ca3af"
                multiline
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.updateButton} onPress={handleSave}>
                <Text style={styles.updateButtonText}>{viewMode === 'edit' ? 'Update' : 'Create'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
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
      <AdminHeader activeSection="blogs" />
      <ScrollView style={styles.content}>
        <View style={styles.inner}>
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>BLOGS</Text>
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
              <Text style={[styles.tableHeaderCell, styles.colSeq]}>Sequence No</Text>
              <Text style={[styles.tableHeaderCell, styles.colAction]}>Action</Text>
            </View>

            {loading ? (
              <View style={styles.loadingRow}>
                <Text style={styles.loadingText}>Loading blogs...</Text>
              </View>
            ) : blogs.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No blogs found. Click "Add New" to create one.</Text>
              </View>
            ) : (
              blogs.map((blog, index) => (
                <View key={blog.id || blog._id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.colSrNo]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, styles.colTitle]} numberOfLines={2}>{blog.title}</Text>
                  <View style={styles.colPhoto}>
                    {blog.image ? (
                      <Image source={{ uri: blog.image }} style={styles.thumbnail} resizeMode="cover" />
                    ) : (
                      <View style={styles.noImage}>
                        <Text style={styles.noImageText}>No Image</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.tableCell, styles.colDesc]} numberOfLines={2}>{blog.excerpt}</Text>
                  <Text style={[styles.tableCell, styles.colSeq]}>{(blog as any).sequenceNo || index + 1}</Text>
                  <View style={[styles.colAction, styles.actionCell]}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(blog)}>
                      <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Text style={styles.actionIcon}>🖼️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(blog.id || blog._id || '')}>
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
  colSrNo: { width: 60 },
  colTitle: { flex: 2, textAlign: 'left' as any, paddingHorizontal: 8 },
  colPhoto: { width: 80, alignItems: 'center' as any, justifyContent: 'center' as any },
  colDesc: { flex: 2, textAlign: 'left' as any, paddingHorizontal: 8 },
  colSeq: { width: 100 },
  colAction: { width: 120 },

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
});

