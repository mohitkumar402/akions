import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { API_URL } from '../config/api';

const API_BASE = API_URL;

export const CustomProductRequestScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    productType: '',
    description: '',
    budget: '',
    timeline: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.description) {
      Alert.alert('Validation Error', 'Please fill in all required fields (Name, Email, Description)');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/custom-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        Alert.alert(
          'Request Submitted!',
          'Thank you for your interest. Our team will reach out to you soon via email/phone.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  company: '',
                  productType: '',
                  description: '',
                  budget: '',
                  timeline: '',
                });
                navigation.navigate('Home');
              },
            },
          ]
        );
      } else {
        const errorData = await res.json();
        Alert.alert('Error', errorData.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit request. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <Text style={styles.title}>Custom Product Request</Text>
          <Text style={styles.subtitle}>
            Tell us about your custom product needs and we'll get back to you
          </Text>

          <View style={styles.form}>
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter your full name"
                  placeholderTextColor="#6b7280"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#6b7280"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="+91 1234567890"
                  keyboardType="phone-pad"
                  placeholderTextColor="#6b7280"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Company/Organization</Text>
                <TextInput
                  style={styles.input}
                  value={formData.company}
                  onChangeText={(text) => setFormData({ ...formData, company: text })}
                  placeholder="Your company name"
                  placeholderTextColor="#6b7280"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Product Type</Text>
              <TextInput
                style={styles.input}
                value={formData.productType}
                onChangeText={(text) => setFormData({ ...formData, productType: text })}
                placeholder="e.g., Mobile App, Web Application, Backend System"
                placeholderTextColor="#6b7280"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Project Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Describe your custom product requirements in detail..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="#6b7280"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.label}>Budget Range</Text>
                <TextInput
                  style={styles.input}
                  value={formData.budget}
                  onChangeText={(text) => setFormData({ ...formData, budget: text })}
                  placeholder="e.g., ₹50,000 - ₹1,00,000"
                  placeholderTextColor="#6b7280"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Timeline</Text>
                <TextInput
                  style={styles.input}
                  value={formData.timeline}
                  onChangeText={(text) => setFormData({ ...formData, timeline: text })}
                  placeholder="e.g., 2-3 months"
                  placeholderTextColor="#6b7280"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Footer navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  inner: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 42 : 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#6b7280',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  formRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
    marginBottom: 16,
  },
  formField: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    minHeight: 44,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    }),
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

