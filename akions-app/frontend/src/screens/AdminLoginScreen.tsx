import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const AdminLoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await adminLogin(email, password);
        // If admin login succeeds, navigate to admin dashboard
                  navigation.replace('AdminDashboard');
      } catch (error: any) {
        const errorMessage = error.message || 'Invalid credentials or access denied';
        setErrors({ email: errorMessage });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Animated.View style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
            <View style={styles.header}>
              <Text style={styles.adminBadge}>🔐 ADMIN</Text>
              <Text style={styles.title}>Admin Portal</Text>
              <Text style={styles.subtitle}>Sign in to access the admin dashboard</Text>
            </View>

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
              <Input
                label="Admin Email"
                value={email}
                onChangeText={setEmail}
                placeholder="admin@ekions.com"
                error={errors.email}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
              />

              <View style={styles.buttonContainer}>
                <Button
                  title="Sign In as Admin"
                  onPress={handleLogin}
                  loading={loading}
                />
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Not an admin? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkText}>User Login</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Text style={styles.backLinkText}>← Back to Home</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  formContainer: {
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  adminBadge: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#94a3b8',
    marginBottom: 32,
    fontSize: 16,
  },
  form: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonContainer: {
    marginTop: 16,
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  linkText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 14,
  },
  backLinkText: {
    color: '#64748b',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

