import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Linking } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';

export const ContactScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Email, Message)');
      return;
    }

    // In a real app, this would send the form data to the backend
    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Subject: ${formData.subject || 'General Inquiry'}

Message:
${formData.message}
    `.trim();

    const email = 'contact@ekions.com';
    const subject = encodeURIComponent(formData.subject || 'Contact Form Submission');
    const body = encodeURIComponent(emailBody);

    if (Platform.OS === 'web') {
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    } else {
      Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`).catch(err => {
        console.error('Error opening email:', err);
        Alert.alert('Error', 'Could not open email client. Please send an email to contact@ekions.com');
      });
    }

    Alert.alert('Success', 'Your message has been prepared. Please send it from your email client.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <View style={styles.container}>
      <SEO
        title="Contact Us - Get in Touch"
        description="Have a question or want to work with us? Get in touch with Ekions. We'd love to hear from you."
        keywords="contact Ekions, get in touch, support, customer service, business inquiry"
      />
      <Navbar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <Text style={styles.title}>Get in Touch</Text>
          <Text style={styles.subtitle}>
            Have a question or want to work with us? We'd love to hear from you.
          </Text>

          <View style={styles.contactGrid}>
            <View style={styles.contactCard}>
              <Text style={styles.contactIcon}>📧</Text>
              <Text style={styles.contactTitle}>Email Us</Text>
              <TouchableOpacity
                onPress={() => {
                  const email = 'contact@ekions.com';
                  if (Platform.OS === 'web') {
                    window.location.href = `mailto:${email}`;
                  } else {
                    Linking.openURL(`mailto:${email}`).catch(err => console.error('Error:', err));
                  }
                }}
              >
                <Text style={styles.contactLink}>contact@ekions.com</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactCard}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactTitle}>Call Us</Text>
              <TouchableOpacity
                onPress={() => {
                  const phone = '+916203802704';
                  if (Platform.OS === 'web') {
                    window.location.href = `tel:${phone}`;
                  } else {
                    Linking.openURL(`tel:${phone}`).catch(err => console.error('Error:', err));
                  }
                }}
              >
                <Text style={styles.contactLink}>+91 6203802704</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactCard}>
              <Text style={styles.contactIcon}>📍</Text>
              <Text style={styles.contactTitle}>Visit Us</Text>
              <Text style={styles.contactText}>D13, Satej Homes</Text>
              <Text style={styles.contactText}>Ahmedabad, Gujarat</Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Send us a Message</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name *"
              placeholderTextColor="#6b7280"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Your Email *"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (Optional)"
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Subject (Optional)"
              placeholderTextColor="#6b7280"
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Your Message *"
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={6}
              value={formData.message}
              onChangeText={(text) => setFormData({ ...formData, message: text })}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Send Message</Text>
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
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '700',
    color: '#111827',
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
  contactGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    marginBottom: 64,
    gap: 24,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    flex: Platform.OS === 'web' ? 1 : undefined,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  contactIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  contactLink: {
    fontSize: 16,
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  formSection: {
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
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

