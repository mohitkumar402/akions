import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Animated, TouchableOpacity, TextInput, Alert, Dimensions, Linking } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { API_URL } from '../config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 200);
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Try to send via backend API first
      const API_BASE = API_URL;
      
      try {
        const response = await fetch(`${API_BASE}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim() || undefined,
            message: message.trim(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          Alert.alert(
            'Message Sent!',
            data.message || 'Thank you for contacting us! We have received your message and will get back to you soon.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                },
              },
            ]
          );
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.log('Backend API not available, using mailto fallback');
      }

      // Fallback to mailto if backend is not available
      const emailSubject = subject.trim() || 'Contact Form Submission from Akions Website';
      const emailBody = `
Hello Akions Team,

You have received a new contact form submission:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${name.trim()}
Email: ${email.trim()}
Subject: ${subject.trim() || 'General Inquiry'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${message.trim()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This message was sent from the Akions website contact form.
Please reply directly to: ${email.trim()}

Best regards,
Akions Website Contact Form
      `.trim();

      const recipientEmail = 'akions@hotmail.com';
      const encodedSubject = encodeURIComponent(emailSubject);
      const encodedBody = encodeURIComponent(emailBody);

      // Open email client with pre-filled details
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;

      if (Platform.OS === 'web') {
        window.location.href = mailtoLink;
        Alert.alert(
          'Email Prepared!',
          'Your email client should open with the message ready to send to akions@hotmail.com. Please review and send the email.',
          [
            {
              text: 'OK',
              onPress: () => {
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
              },
            },
          ]
        );
      } else {
        Linking.openURL(mailtoLink).catch((err) => {
          console.error('Error opening email:', err);
          Alert.alert(
            'Email Details',
            `Please send an email to: akions@hotmail.com\n\nSubject: ${emailSubject}\n\nMessage:\n${emailBody}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                },
              },
            ]
          );
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again or send directly to akions@hotmail.com');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPress = () => {
    // Open email client for internship inquiries
    const mailtoLink = 'mailto:akions@hotmail.com?subject=Internship Inquiry';
    if (Platform.OS === 'web') {
      window.location.href = mailtoLink;
    } else {
      Linking.openURL(mailtoLink).catch((err) => {
        Alert.alert('Email', 'akions@hotmail.com');
      });
    }
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Animated.View style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>
              <Text style={styles.title}>Write to Us</Text>
              <Text style={styles.subtitle}>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</Text>
            </Animated.View>

            {/* Internship Contact Info */}
            <Animated.View style={[
              styles.contactInfoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>
              <Text style={styles.contactTitle}>For Internship Inquiries</Text>
              <TouchableOpacity onPress={handleEmailPress} style={styles.emailContainer}>
                <Text style={styles.emailLabel}>Email:</Text>
                <Text style={styles.emailAddress}>akions@hotmail.com</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              styles.form,
              {
                opacity: formAnim,
                transform: [{
                  scale: formAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                }],
              },
            ]}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Subject</Text>
                <TextInput
                  style={styles.input}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="What is this regarding?"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Message *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Write your message here..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Preparing Email...' : 'Send Message'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH < 768 ? 16 : 24,
    paddingVertical: SCREEN_WIDTH < 768 ? 24 : 48,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: SCREEN_WIDTH < 768 ? 32 : 40,
    fontWeight: '700',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: SCREEN_WIDTH < 768 ? 14 : 16,
    lineHeight: SCREEN_WIDTH < 768 ? 20 : 24,
    paddingHorizontal: SCREEN_WIDTH < 768 ? 8 : 0,
  },
  contactInfoContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#374151',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  emailLabel: {
    fontSize: 16,
    color: '#9ca3af',
    marginRight: 8,
  },
  emailAddress: {
    fontSize: 16,
    color: '#60a5fa',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  form: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: SCREEN_WIDTH < 768 ? 20 : 32,
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#374151',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
