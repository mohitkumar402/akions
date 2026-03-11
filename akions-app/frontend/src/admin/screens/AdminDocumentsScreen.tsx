import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { FileUpload } from '../../components/FileUpload';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

const API_BASE = API_URL;

interface Document {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  fileUrl: string;
  category: string;
  type: string;
  size?: number;
}

type ViewMode = 'list' | 'edit' | 'add';

export const AdminDocumentsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    category: '',
    type: 'pdf',
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
    loadDocuments();
  }, [user, authLoading]);

  const loadDocuments = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/documents`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Load documents error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDocument(null);
    setFormData({
      title: '',
      description: '',
      fileUrl: '',
      category: '',
      type: 'pdf',
      sequenceNo: documents.length + 1,
      metaTitle: '',
      metaKeyword: '',
      metaDescription: '',
    });
    setViewMode('add');
  };

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    setFormData({
      title: document.title,
      description: document.description,
      fileUrl: document.fileUrl,
      category: document.category,
      type: document.type || 'pdf',
      sequenceNo: (document as any).sequenceNo || 0,
      metaTitle: (document as any).metaTitle || '',
      metaKeyword: (document as any).metaKeyword || '',
      metaDescription: (document as any).metaDescription || '',
    });
    setViewMode('edit');
  };

  const handleBack = () => {
    setViewMode('list');
    setEditingDocument(null);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this document?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!accessToken) return;
          try {
            const res = await fetch(`${API_BASE}/admin/documents/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
              loadDocuments();
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
      Alert.alert('Error', 'Please login to save documents');
      return;
    }

    if (!formData.title || !formData.category) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const url = editingDocument
        ? `${API_BASE}/admin/documents/${editingDocument.id || editingDocument._id}`
        : `${API_BASE}/admin/documents`;
      const method = editingDocument ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        loadDocuments();
        setViewMode('list');
        Alert.alert('Success', editingDocument ? 'Document updated successfully' : 'Document created successfully');
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Failed to save document' }));
        Alert.alert('Error', errorData.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save document. Please try again.');
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      pdf: { bg: '#fee2e2', text: '#991b1b' },
      doc: { bg: '#dbeafe', text: '#1e40af' },
      video: { bg: '#dcfce7', text: '#166534' },
      image: { bg: '#fef3c7', text: '#92400e' },
    };
    return colors[type?.toLowerCase()] || { bg: '#e5e7eb', text: '#374151' };
  };

  if (user?.role !== 'admin') {
    return null;
  }

  // Edit/Add Form View
  if (viewMode === 'edit' || viewMode === 'add') {
    return (
      <View style={styles.container}>
        <AdminHeader activeSection="documents" />
        <ScrollView style={styles.content}>
          {/* Edit Header */}
          <View style={styles.editHeader}>
            <Text style={styles.editTitle}>{viewMode === 'edit' ? 'EDIT DOCUMENT' : 'ADD DOCUMENT'}</Text>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Row 1: Title, Sequence No */}
            <View style={styles.formRow}>
              <View style={[styles.formField, { flex: 2 }]}>
                <Text style={styles.formLabel}>*Title</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="Enter document title"
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
            </View>

            {/* File Upload */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Document File</Text>
              <FileUpload
                label=""
                accept="both"
                currentUrl={formData.fileUrl}
                onUploadComplete={(url) => setFormData({ ...formData, fileUrl: url })}
              />
              {formData.fileUrl ? (
                <View style={styles.filePreview}>
                  <Text style={styles.filePreviewText}>📄 {formData.fileUrl}</Text>
                </View>
              ) : null}
            </View>

            {/* Row 2: Category, Type */}
            <View style={styles.formRow}>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>*Category</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.category}
                  onChangeText={(text) => setFormData({ ...formData, category: text })}
                  placeholder="e.g., Manual, Guide, Report"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>Type</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.type}
                  onChangeText={(text) => setFormData({ ...formData, type: text })}
                  placeholder="pdf, doc, video, etc."
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.formTextarea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Enter document description..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={6}
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
      <AdminHeader activeSection="documents" />
      <ScrollView style={styles.content}>
        <View style={styles.inner}>
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>DOCUMENTS</Text>
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
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description</Text>
              <Text style={[styles.tableHeaderCell, styles.colCategory]}>Category</Text>
              <Text style={[styles.tableHeaderCell, styles.colType]}>Type</Text>
              <Text style={[styles.tableHeaderCell, styles.colAction]}>Action</Text>
            </View>

            {loading ? (
              <View style={styles.loadingRow}>
                <Text style={styles.loadingText}>Loading documents...</Text>
              </View>
            ) : documents.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No documents found. Click "Add New" to create one.</Text>
              </View>
            ) : (
              documents.map((document, index) => {
                const typeColors = getTypeColor(document.type);
                return (
                  <View key={document.id || document._id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
                    <Text style={[styles.tableCell, styles.colSrNo]}>{index + 1}</Text>
                    <Text style={[styles.tableCell, styles.colTitle]} numberOfLines={2}>{document.title}</Text>
                    <Text style={[styles.tableCell, styles.colDesc]} numberOfLines={2}>{document.description}</Text>
                    <Text style={[styles.tableCell, styles.colCategory]}>{document.category}</Text>
                    <View style={styles.colType}>
                      <View style={[styles.typeBadge, { backgroundColor: typeColors.bg }]}>
                        <Text style={[styles.typeBadgeText, { color: typeColors.text }]}>
                          {document.type?.toUpperCase() || 'N/A'}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.colAction, styles.actionCell]}>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(document)}>
                        <Text style={styles.actionIcon}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(document.id || document._id || '')}>
                        <Text style={styles.actionIcon}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
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
  colDesc: { flex: 2, textAlign: 'left' as any, paddingHorizontal: 8 },
  colCategory: { width: 100 },
  colType: { width: 80, alignItems: 'center' as any },
  colAction: { width: 90 },

  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
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
    minHeight: 150,
    textAlignVertical: 'top',
  },
  formTextareaSmall: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  filePreview: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  filePreviewText: {
    fontSize: 12,
    color: '#374151',
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






