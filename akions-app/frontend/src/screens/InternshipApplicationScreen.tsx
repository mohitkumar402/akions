import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, Platform, ActivityIndicator } from 'react-native';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Internship } from '../types';

const API_BASE = 'http://localhost:3000/api';

interface InternshipApplicationScreenProps {
  route: {
    params: {
      internship: Internship;
    };
  };
  navigation: any;
}

export const InternshipApplicationScreen: React.FC<InternshipApplicationScreenProps> = ({ route, navigation }) => {
  const { internship } = route.params;
  const { user, accessToken } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    coverLetter: '',
    experience: '',
    skills: '',
    education: '',
    availability: '',
    additionalInfo: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.fullName || !formData.email) {
      Alert.alert('Error', 'Please fill in required fields (Name and Email)');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!accessToken) {
      Alert.alert('Error', 'Please login to apply');
      navigation.navigate('Login');
      return;
    }

    if (!internship || !internship.id) {
      Alert.alert('Error', 'Invalid internship information');
      return;
    }

    setSubmitting(true);
    try {
      console.log('Submitting application...', {
        internshipId: internship.id,
        fullName: formData.fullName,
        email: formData.email,
      });

      const response = await fetch(`${API_BASE}/internships/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          internshipId: internship.id,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || '',
          coverLetter: formData.coverLetter || '',
          experience: formData.experience || '',
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
          education: formData.education || '',
          availability: formData.availability || '',
          additionalInfo: formData.additionalInfo || '',
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert(
          'Application Submitted!',
          'Your application has been submitted successfully. We will contact you via email soon.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  fullName: user?.name || '',
                  email: user?.email || '',
                  phone: '',
                  coverLetter: '',
                  experience: '',
                  skills: '',
                  education: '',
                  availability: '',
                  additionalInfo: '',
                });
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        console.error('Submit error response:', responseData);
        Alert.alert('Error', responseData.error || responseData.message || 'Failed to submit application. Please try again.');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to submit application. Please check your internet connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Apply for {internship.title}</Text>
          <Text style={styles.subtitle}>{internship.company} - {internship.location}</Text>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Education</Text>
              <TextInput
                style={styles.input}
                value={formData.education}
                onChangeText={(text) => setFormData({ ...formData, education: text })}
                placeholder="e.g., B.Tech Computer Science, XYZ University"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Experience</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.experience}
                onChangeText={(text) => setFormData({ ...formData, experience: text })}
                placeholder="Describe your relevant experience"
                multiline
                numberOfLines={4}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Skills (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={formData.skills}
                onChangeText={(text) => setFormData({ ...formData, skills: text })}
                placeholder="e.g., JavaScript, React, Node.js, Python"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Availability</Text>
              <TextInput
                style={styles.input}
                value={formData.availability}
                onChangeText={(text) => setFormData({ ...formData, availability: text })}
                placeholder="e.g., Full-time, 6 months starting January 2024"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Cover Letter</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.coverLetter}
                onChangeText={(text) => setFormData({ ...formData, coverLetter: text })}
                placeholder="Tell us why you're interested in this position"
                multiline
                numberOfLines={6}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Additional Information</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.additionalInfo}
                onChangeText={(text) => setFormData({ ...formData, additionalInfo: text })}
                placeholder="Any additional information you'd like to share"
                multiline
                numberOfLines={4}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <View style={styles.submitButtonContent}>
                  <ActivityIndicator color="#ffffff" size="small" style={{ marginRight: 8 }} />
                  <Text style={styles.submitButtonText}>Submitting...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Submit Application</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { paddingBottom: 32 },
  content: { paddingVertical: 32, paddingHorizontal: 24, maxWidth: 800, alignSelf: 'center', width: '100%' },
  title: { fontSize: 32, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#d1d5db', marginBottom: 32 },
  form: { gap: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#ffffff', marginBottom: 8 },
  input: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333333', borderRadius: 8, padding: 16, fontSize: 16, color: '#ffffff', minHeight: 48 },
  textArea: { minHeight: 120, textAlignVertical: 'top', paddingTop: 16 },
  submitButton: { 
    backgroundColor: '#2563eb', 
    paddingVertical: 16, 
    borderRadius: 8, 
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  submitButtonDisabled: { 
    backgroundColor: '#4b5563', 
    opacity: 0.7,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: '600', 
    textAlign: 'center',
  },
});

