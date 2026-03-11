import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { FileUpload } from '../../components/FileUpload';
import { useAuth } from '../../context/AuthContext';
import { Internship } from '../../types';
import { API_URL } from '../../config/api';

const API_BASE = API_URL;

type ViewMode = 'list' | 'edit' | 'add';

export const AdminInternshipsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Remote' as 'Remote' | 'On-site' | 'Hybrid',
    duration: '',
    stipend: '',
    description: '',
    image: '',
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
    loadInternships();
  }, [user, authLoading]);

  const loadInternships = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/internships`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInternships(data);
      }
    } catch (error) {
      console.error('Load internships error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingInternship(null);
    setFormData({
      title: '',
      company: '',
      location: '',
      type: 'Remote',
      duration: '',
      stipend: '',
      description: '',
      image: '',
      sequenceNo: internships.length + 1,
      metaTitle: '',
      metaKeyword: '',
      metaDescription: '',
    });
    setViewMode('add');
  };

  const handleEdit = (internship: Internship) => {
    setEditingInternship(internship);
    setFormData({
      title: internship.title,
      company: internship.company,
      location: internship.location,
      type: internship.type,
      duration: internship.duration,
      stipend: internship.stipend,
      description: internship.description,
      image: internship.image,
      sequenceNo: (internship as any).sequenceNo || 0,
      metaTitle: (internship as any).metaTitle || '',
      metaKeyword: (internship as any).metaKeyword || '',
      metaDescription: (internship as any).metaDescription || '',
    });
    setViewMode('edit');
  };

  const handleBack = () => {
    setViewMode('list');
    setEditingInternship(null);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this internship?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!accessToken) return;
          try {
            const res = await fetch(`${API_BASE}/admin/internships/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
              loadInternships();
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
      Alert.alert('Error', 'Please login to save internships');
      return;
    }

    if (!formData.title || !formData.company || !formData.location || !formData.duration || !formData.stipend || !formData.description) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const url = editingInternship
        ? `${API_BASE}/admin/internships/${editingInternship.id || editingInternship._id}`
        : `${API_BASE}/admin/internships`;
      const method = editingInternship ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        loadInternships();
        setViewMode('list');
        Alert.alert('Success', editingInternship ? 'Internship updated successfully' : 'Internship created successfully');
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
        <AdminHeader activeSection="internships" />
        <ScrollView style={styles.content}>
          {/* Edit Header */}
          <View style={styles.editHeader}>
            <Text style={styles.editTitle}>{viewMode === 'edit' ? 'EDIT INTERNSHIP' : 'ADD INTERNSHIP'}</Text>
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
                  placeholder="Enter internship title"
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

            {/* Row 2: Company, Location, Duration */}
            <View style={styles.formRow}>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>*Company</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.company}
                  onChangeText={(text) => setFormData({ ...formData, company: text })}
                  placeholder="Enter company name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>*Location</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                  placeholder="Enter location"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>*Duration</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.duration}
                  onChangeText={(text) => setFormData({ ...formData, duration: text })}
                  placeholder="e.g., 3 months"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Row 3: Stipend, Type */}
            <View style={styles.formRow}>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>*Stipend</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.stipend}
                  onChangeText={(text) => setFormData({ ...formData, stipend: text })}
                  placeholder="e.g., ₹10,000/month"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={[styles.formField, { flex: 2 }]}>
                <Text style={styles.formLabel}>Type</Text>
                <View style={styles.typeSelector}>
                  {(['Remote', 'On-site', 'Hybrid'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeOption, formData.type === type && styles.typeOptionActive]}
                      onPress={() => setFormData({ ...formData, type })}
                    >
                      <Text style={[styles.typeOptionText, formData.type === type && styles.typeOptionTextActive]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>*Description</Text>
              <TextInput
                style={[styles.formInput, styles.formTextarea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Enter internship description..."
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
      <AdminHeader activeSection="internships" />
      <ScrollView style={styles.content}>
        <View style={styles.inner}>
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>INTERNSHIPS</Text>
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
              <Text style={[styles.tableHeaderCell, styles.colCompany]}>Company</Text>
              <Text style={[styles.tableHeaderCell, styles.colLocation]}>Location</Text>
              <Text style={[styles.tableHeaderCell, styles.colType]}>Type</Text>
              <Text style={[styles.tableHeaderCell, styles.colStipend]}>Stipend</Text>
              <Text style={[styles.tableHeaderCell, styles.colAction]}>Action</Text>
            </View>

            {loading ? (
              <View style={styles.loadingRow}>
                <Text style={styles.loadingText}>Loading internships...</Text>
              </View>
            ) : internships.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No internships found. Click "Add New" to create one.</Text>
              </View>
            ) : (
              internships.map((internship, index) => (
                <View key={internship.id || internship._id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.colSrNo]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, styles.colTitle]} numberOfLines={2}>{internship.title}</Text>
                  <Text style={[styles.tableCell, styles.colCompany]}>{internship.company}</Text>
                  <Text style={[styles.tableCell, styles.colLocation]}>{internship.location}</Text>
                  <View style={styles.colType}>
                    <View style={[styles.typeBadge, 
                      internship.type === 'Remote' && styles.typeBadgeRemote,
                      internship.type === 'On-site' && styles.typeBadgeOnsite,
                      internship.type === 'Hybrid' && styles.typeBadgeHybrid,
                    ]}>
                      <Text style={styles.typeBadgeText}>{internship.type}</Text>
                    </View>
                  </View>
                  <Text style={[styles.tableCell, styles.colStipend]}>{internship.stipend}</Text>
                  <View style={[styles.colAction, styles.actionCell]}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(internship)}>
                      <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(internship.id || internship._id || '')}>
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
  colCompany: { width: 120 },
  colLocation: { width: 100 },
  colType: { width: 90, alignItems: 'center' as any },
  colStipend: { width: 100 },
  colAction: { width: 90 },

  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  typeBadgeRemote: {
    backgroundColor: '#dcfce7',
  },
  typeBadgeOnsite: {
    backgroundColor: '#dbeafe',
  },
  typeBadgeHybrid: {
    backgroundColor: '#fef3c7',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
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
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  typeOptionActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  typeOptionText: {
    color: '#374151',
    fontWeight: '500',
  },
  typeOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
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

