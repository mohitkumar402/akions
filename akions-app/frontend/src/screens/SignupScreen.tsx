import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await signup(name, email, password);
      } catch (error) {
        setErrors({ email: 'Failed to create account' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
        <View style={styles.wrapper}>
          <View style={styles.content}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join Akions and start your journey</Text>
            <View style={styles.formContainer}>
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                error={errors.name}
              />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                error={errors.email}
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
                error={errors.password}
              />
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.confirmPassword}
              />
              <View style={styles.buttonSpacing}>
                <Button
                  title="Sign Up"
                  onPress={handleSignup}
                  loading={loading}
                />
              </View>
              <View style={styles.loginRow}>
                <Text style={styles.loginPrompt}>Already have an account? </Text>
                <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>Log In</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { paddingVertical: 48, paddingHorizontal: 24 },
  wrapper: { flex: 1, justifyContent: 'center' },
  content: { maxWidth: 480, width: '100%', alignSelf: 'center' },
  headerTitle: { fontSize: 32, fontWeight: '700', textAlign: 'center', color: '#111827', marginBottom: 8 },
  headerSubtitle: { textAlign: 'center', color: '#4b5563', marginBottom: 32 },
  formContainer: { backgroundColor: '#ffffff', borderRadius: 24, padding: 32, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  buttonSpacing: { marginTop: 16 },
  loginRow: { marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginPrompt: { color: '#4b5563' },
  loginLink: { color: '#2563eb', fontWeight: '600' }
});
