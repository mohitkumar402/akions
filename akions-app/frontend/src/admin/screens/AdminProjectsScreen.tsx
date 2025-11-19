import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { FileUpload } from '../../components/FileUpload';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:3000/api';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
  features?: string[];
  technologies?: string[];
}

export const AdminProjectsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    price: 0,
    features: '',
    technologies: '',
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigation.navigate('Home');
      return;
    }
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/projects`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Load projects error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', image: '', category: '', price: 0, features: '', technologies: '' });
    setShowModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      price: project.price || 0,
      features: (project.features || []).join(', '),
      technologies: (project.technologies || []).join(', '),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this project?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!accessToken) return;
          try {
            const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
              loadProjects();
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
      Alert.alert('Error', 'Please login to save projects');
      return;
    }

    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      Alert.alert('Validation Error', 'Please fill in all required fields (Title, Description, Category)');
      return;
    }

    try {
      const url = editingProject
        ? `${API_BASE}/admin/projects/${editingProject.id || editingProject._id}`
        : `${API_BASE}/admin/projects`;
      const method = editingProject ? 'PUT' : 'POST';

      const payload = {
        title: formData.title,
        description: formData.description,
        image: formData.image || '',
        category: formData.category,
        price: parseFloat(String(formData.price)) || 0,
        features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
        technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()).filter(t => t) : [],
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        loadProjects();
        Alert.alert('Success', editingProject ? 'Project updated successfully' : 'Project created successfully');
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Failed to save project' }));
        Alert.alert('Error', errorData.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save project. Please try again.');
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <View style={styles.container}>
      <AdminHeader activeSection="projects" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Manage Projects</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>+ Add New Project</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={styles.loading}>Loading projects...</Text>
          ) : (
            <View style={styles.itemsList}>
              {projects.map((project) => (
                <View key={project.id} style={styles.itemCard}>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{project.title}</Text>
                    <Text style={styles.itemSubtitle} numberOfLines={2}>
                      {project.description}
                    </Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.metaText}>Category: {project.category}</Text>
                      <Text style={styles.metaText}>Price: ₹{project.price || 0}</Text>
                    </View>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(project)}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(project.id || project._id)}>
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
                <Text style={styles.modalTitle}>{editingProject ? 'Edit' : 'Add New'} Project</Text>
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
                    <Text style={styles.formLabel}>Features (comma-separated)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.features}
                      onChangeText={(text) => setFormData({ ...formData, features: text })}
                      placeholder="Enter features separated by commas"
                    />
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Technologies (comma-separated)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.technologies}
                      onChangeText={(text) => setFormData({ ...formData, technologies: text })}
                      placeholder="Enter technologies separated by commas"
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

