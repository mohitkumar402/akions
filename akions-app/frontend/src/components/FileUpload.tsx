import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const API_BASE = API_URL;

interface FileUploadProps {
  onUploadComplete: (url: string, type: 'image' | 'video') => void;
  currentUrl?: string;
  accept?: 'image' | 'video' | 'both';
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  currentUrl,
  accept = 'both',
  label = 'Upload File',
}) => {
  const { accessToken } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = () => {
    if (Platform.OS === 'web') {
      // Create file input for web
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept === 'image' 
        ? 'image/*' 
        : accept === 'video' 
        ? 'video/*' 
        : 'image/*,video/*';
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          await handleUpload(file);
        }
      };
      input.click();
    } else {
      // For React Native, you would use expo-image-picker or react-native-image-picker
      Alert.alert('File Upload', 'File upload from device is currently only supported on web. Please use URL input for mobile.');
    }
  };

  const handleUpload = async (file: File) => {
    if (!accessToken) {
      Alert.alert('Error', 'Please login to upload files');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/upload/file`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      setPreviewUrl(data.url);
      onUploadComplete(data.url, data.type);
      Alert.alert('Success', 'File uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onUploadComplete('', 'image');
  };

  const isImage = previewUrl && (previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) || previewUrl.includes('/images/'));
  const isVideo = previewUrl && (previewUrl.match(/\.(mp4|webm|ogg|mov)$/i) || previewUrl.includes('/videos/'));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {previewUrl && (
        <View style={styles.previewContainer}>
          {isImage ? (
            <Image source={{ uri: previewUrl }} style={styles.previewImage} resizeMode="cover" />
          ) : isVideo ? (
            <View style={styles.videoPreview}>
              <Text style={styles.videoText}>📹 Video</Text>
              <Text style={styles.videoUrl} numberOfLines={1}>{previewUrl}</Text>
            </View>
          ) : null}
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <Text style={styles.removeButtonText}>✕ Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
        onPress={handleFileSelect}
        disabled={uploading}
      >
        {uploading ? (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.uploadButtonText}>Uploading...</Text>
          </View>
        ) : (
          <Text style={styles.uploadButtonText}>
            {previewUrl ? 'Change File' : `📁 ${label}`}
          </Text>
        )}
      </TouchableOpacity>

      {Platform.OS === 'web' && (
        <Text style={styles.hint}>
          {accept === 'image' 
            ? 'Supported: JPEG, PNG, GIF, WEBP (Max 50MB)'
            : accept === 'video'
            ? 'Supported: MP4, WEBM, OGG, MOV (Max 50MB)'
            : 'Supported: Images & Videos (Max 50MB each)'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  previewContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  videoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  videoText: {
    fontSize: 48,
    marginBottom: 8,
  },
  videoUrl: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});






