import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  Switch,
  Platform,
  Dimensions,
} from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { FileUpload } from '../../components/FileUpload';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

const API_BASE = API_URL;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isMobile = SCREEN_WIDTH < 768;

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory: { _id: string; name: string; slug: string } | null;
  description: string;
  content: string;
  headerContent: string;
  image: string;
  headerImage: string;
  icon: string;
  sequenceNo: number;
  isActive: boolean;
  showInMenu: boolean;
  showInFooter: boolean;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  productCount?: number;
  createdAt: string;
}

type ViewMode = 'list' | 'edit' | 'add';

export const AdminCategoriesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    parentCategory: '',
    description: '',
    content: '',
    headerContent: '',
    image: '',
    headerImage: '',
    icon: '📦',
    sequenceNo: 0,
    isActive: true,
    showInMenu: true,
    showInFooter: false,
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigation.replace('AdminLogin');
    }
  }, [user, authLoading, navigation]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadCategories();
      loadParentCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories/admin/all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Load categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadParentCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories/parents`);
      if (res.ok) {
        const data = await res.json();
        setParentCategories(data);
      }
    } catch (error) {
      console.error('Load parent categories error:', error);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      parentCategory: '',
      description: '',
      content: '',
      headerContent: '',
      image: '',
      headerImage: '',
      icon: '📦',
      sequenceNo: categories.length > 0 ? Math.max(...categories.map(c => c.sequenceNo)) + 1 : 1,
      isActive: true,
      showInMenu: true,
      showInFooter: false,
      metaTitle: '',
      metaKeywords: '',
      metaDescription: '',
    });
    setViewMode('add');
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parentCategory: category.parentCategory?._id || '',
      description: category.description || '',
      content: category.content || '',
      headerContent: category.headerContent || '',
      image: category.image || '',
      headerImage: category.headerImage || '',
      icon: category.icon || '📦',
      sequenceNo: category.sequenceNo || 0,
      isActive: category.isActive !== false,
      showInMenu: category.showInMenu !== false,
      showInFooter: category.showInFooter || false,
      metaTitle: category.metaTitle || '',
      metaKeywords: category.metaKeywords || '',
      metaDescription: category.metaDescription || '',
    });
    setViewMode('edit');
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Category name is required');
      return;
    }

    try {
      const payload = {
        ...formData,
        parentCategory: formData.parentCategory || null,
      };

      const url = editingCategory 
        ? `${API_BASE}/categories/${editingCategory._id}`
        : `${API_BASE}/categories`;
      
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Alert.alert('Success', `Category ${editingCategory ? 'updated' : 'created'} successfully`);
        loadCategories();
        loadParentCategories();
        setViewMode('list');
      } else {
        const error = await res.json();
        Alert.alert('Error', error.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Save category error:', error);
      Alert.alert('Error', 'Failed to save category');
    }
  };

  const handleDelete = async (category: Category) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE}/categories/${category._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              if (res.ok) {
                Alert.alert('Success', 'Category deleted successfully');
                loadCategories();
                loadParentCategories();
              } else {
                const error = await res.json();
                Alert.alert('Error', error.message || 'Failed to delete category');
              }
            } catch (error) {
              console.error('Delete category error:', error);
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ]
    );
  };

  const handleImageUpload = (url: string, field: 'image' | 'headerImage') => {
    setFormData({ ...formData, [field]: url });
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.parentCategory?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <View style={styles.container}>
        <AdminHeader activeSection="categories" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Edit/Add Form View
  if (viewMode === 'edit' || viewMode === 'add') {
    return (
      <View style={styles.container}>
        <AdminHeader activeSection="categories" />
        
        {/* Form Header */}
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {viewMode === 'edit' ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setViewMode('list')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Basic Info Row */}
          <View style={styles.formRow}>
            <View style={[styles.formField, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>*Sequence No</Text>
              <TextInput
                style={styles.input}
                value={String(formData.sequenceNo)}
                onChangeText={(text) => setFormData({ ...formData, sequenceNo: parseInt(text) || 0 })}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={[styles.formField, { flex: 2 }]}>
              <Text style={styles.fieldLabel}>*Category Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter category name"
              />
            </View>
            <View style={[styles.formField, { flex: 2 }]}>
              <Text style={styles.fieldLabel}>Parent Category Name</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={styles.picker}
                  onPress={() => {
                    // Simple dropdown simulation for web
                    if (Platform.OS === 'web') {
                      const options = [
                        { label: '- None (Parent Category) -', value: '' },
                        ...parentCategories
                          .filter(p => p._id !== editingCategory?._id)
                          .map(p => ({ label: p.name, value: p._id }))
                      ];
                      const select = document.createElement('select');
                      select.style.position = 'absolute';
                      select.style.opacity = '0';
                      options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.text = opt.label;
                        if (opt.value === formData.parentCategory) option.selected = true;
                        select.appendChild(option);
                      });
                      select.onchange = (e) => {
                        setFormData({ ...formData, parentCategory: (e.target as HTMLSelectElement).value });
                        document.body.removeChild(select);
                      };
                      select.onblur = () => document.body.removeChild(select);
                      document.body.appendChild(select);
                      select.focus();
                      select.click();
                    }
                  }}
                >
                  <Text style={styles.pickerText}>
                    {formData.parentCategory 
                      ? parentCategories.find(p => p._id === formData.parentCategory)?.name || 'Select Parent'
                      : '- None (Parent Category) -'}
                  </Text>
                  <Text style={styles.pickerArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Photo Upload */}
          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>*Photo</Text>
            <View style={styles.uploadArea}>
              {formData.image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: formData.image }} style={styles.imagePreview} resizeMode="cover" />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setFormData({ ...formData, image: '' })}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FileUpload
                  onUploadComplete={(url) => handleImageUpload(url, 'image')}
                  accept="image/*"
                  label="Choose File"
                />
              )}
            </View>
          </View>

          {/* Header Image Upload */}
          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Header Image</Text>
            <Text style={styles.fieldHelpText}>Upload Images for Header Content</Text>
            <View style={styles.uploadArea}>
              {formData.headerImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: formData.headerImage }} style={styles.headerImagePreview} resizeMode="cover" />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setFormData({ ...formData, headerImage: '' })}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FileUpload
                  onUploadComplete={(url) => handleImageUpload(url, 'headerImage')}
                  accept="image/*"
                  label="Choose Files"
                />
              )}
            </View>
          </View>

          {/* Description */}
          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Short Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Brief description of the category"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Content (Rich Text) */}
          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Content</Text>
            <Text style={styles.fieldHelpText}>Detailed content for category page (supports HTML)</Text>
            <TextInput
              style={[styles.input, styles.richTextArea]}
              value={formData.content}
              onChangeText={(text) => setFormData({ ...formData, content: text })}
              placeholder="Enter detailed category content..."
              multiline
              numberOfLines={10}
            />
          </View>

          {/* Header Content */}
          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Header Content</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.headerContent}
              onChangeText={(text) => setFormData({ ...formData, headerContent: text })}
              placeholder="Content for category header section"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Icon */}
          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Icon (Emoji)</Text>
            <TextInput
              style={[styles.input, { width: 100 }]}
              value={formData.icon}
              onChangeText={(text) => setFormData({ ...formData, icon: text })}
              placeholder="📦"
            />
          </View>

          {/* Toggle Options */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Active</Text>
              <Switch
                value={formData.isActive}
                onValueChange={(value) => setFormData({ ...formData, isActive: value })}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Show in Menu</Text>
              <Switch
                value={formData.showInMenu}
                onValueChange={(value) => setFormData({ ...formData, showInMenu: value })}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Show in Footer</Text>
              <Switch
                value={formData.showInFooter}
                onValueChange={(value) => setFormData({ ...formData, showInFooter: value })}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              />
            </View>
          </View>

          {/* SEO Section */}
          <View style={styles.seoSection}>
            <Text style={styles.sectionTitle}>SEO Settings</Text>
            
            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Meta Title</Text>
              <TextInput
                style={styles.input}
                value={formData.metaTitle}
                onChangeText={(text) => setFormData({ ...formData, metaTitle: text })}
                placeholder="SEO title for search engines"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Meta Keywords</Text>
              <TextInput
                style={styles.input}
                value={formData.metaKeywords}
                onChangeText={(text) => setFormData({ ...formData, metaKeywords: text })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Meta Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.metaDescription}
                onChangeText={(text) => setFormData({ ...formData, metaDescription: text })}
                placeholder="SEO description (150-160 characters recommended)"
                multiline
                numberOfLines={3}
              />
              <Text style={styles.charCount}>{formData.metaDescription.length}/160</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setViewMode('list')}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {viewMode === 'edit' ? 'Update Category' : 'Create Category'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>
      </View>
    );
  }

  // List View
  return (
    <View style={styles.container}>
      <AdminHeader activeSection="categories" />
      
      {/* Header Actions */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Categories ({categories.length})</Text>
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>+ Add Category</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table */}
      <ScrollView style={styles.tableContainer} horizontal={isMobile}>
        <View style={[styles.table, isMobile && { minWidth: 900 }]}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: 60 }]}>Sr.No</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Parent Category</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Category Name</Text>
            <Text style={[styles.tableHeaderCell, { width: 80, textAlign: 'center' }]}>Photo</Text>
            <Text style={[styles.tableHeaderCell, { width: 100, textAlign: 'center' }]}>Sequence No</Text>
            <Text style={[styles.tableHeaderCell, { width: 80, textAlign: 'center' }]}>Products</Text>
            <Text style={[styles.tableHeaderCell, { width: 100, textAlign: 'center' }]}>Action</Text>
          </View>

          {/* Table Body */}
          <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
            {filteredCategories.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No categories found</Text>
              </View>
            ) : (
              filteredCategories.map((category, index) => (
                <View 
                  key={category._id} 
                  style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
                >
                  <Text style={[styles.tableCell, { width: 60, textAlign: 'center' }]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>
                    {category.parentCategory?.name || '-'}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{category.name}</Text>
                  <View style={[styles.tableCell, { width: 80, alignItems: 'center' }]}>
                    {category.image ? (
                      <Image 
                        source={{ uri: category.image }} 
                        style={styles.thumbnailImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.noImage}>{category.icon || '📦'}</Text>
                    )}
                  </View>
                  <Text style={[styles.tableCell, { width: 100, textAlign: 'center' }]}>
                    {category.sequenceNo}
                  </Text>
                  <Text style={[styles.tableCell, { width: 80, textAlign: 'center' }]}>
                    {category.productCount || 0}
                  </Text>
                  <View style={[styles.tableCell, { width: 100, flexDirection: 'row', justifyContent: 'center', gap: 8 }]}>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => handleEdit(category)}
                    >
                      <Text style={styles.actionIconText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => {
                        // View category - could navigate to frontend
                      }}
                    >
                      <Text style={styles.actionIconText}>🖼️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => handleDelete(category)}
                    >
                      <Text style={styles.actionIconText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },

  // List Header
  listHeader: {
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'stretch' : 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    minWidth: 250,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Table Styles
  tableContainer: {
    flex: 1,
    padding: 16,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2c3e50',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    paddingHorizontal: 8,
  },
  tableBody: {
    maxHeight: Platform.OS === 'web' ? 'calc(100vh - 280px)' : 500,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    fontSize: 14,
    color: '#374151',
    paddingHorizontal: 8,
  },
  thumbnailImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  noImage: {
    fontSize: 24,
  },
  emptyRow: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  actionIcon: {
    padding: 4,
  },
  actionIconText: {
    fontSize: 16,
  },

  // Form Styles
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  backButton: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formRow: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 16,
    marginBottom: 20,
  },
  formField: {
    minWidth: isMobile ? '100%' : 150,
  },
  formSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2563eb',
    marginBottom: 6,
  },
  fieldHelpText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  richTextArea: {
    minHeight: 200,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'right',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    overflow: 'hidden',
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 14,
    color: '#1f2937',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Image Upload
  uploadArea: {
    marginTop: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerImagePreview: {
    width: 300,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Toggle Section
  toggleSection: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 24,
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  // SEO Section
  seoSection: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
