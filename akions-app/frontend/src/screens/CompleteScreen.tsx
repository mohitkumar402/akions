import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { internships } from '../data/mockData';

export const CompleteScreen: React.FC = () => {
  const { user, applyForInternship, myApplications, reloadApplications } = useAuth();

  useEffect(() => {
    reloadApplications();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Navbar />
        <View style={styles.center}>
          <Text style={styles.title}>Welcome to Akions Demo</Text>
          <Text style={styles.subtitle}>Log in or sign up to access internships and custom project features.</Text>
        </View>
      </View>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Dashboard</Text>
        <View style={styles.metaCard}>
          <Text style={styles.metaText}>Name: {user.name}</Text>
          <Text style={styles.metaText}>Email: {user.email}</Text>
          <Text style={styles.metaText}>Role: {user.role}</Text>
          {user.lastLoginAt && (
            <Text style={styles.metaText}>Last Login: {new Date(user.lastLoginAt).toLocaleString()}</Text>
          )}
          {user.lastLoginIp && <Text style={styles.metaText}>IP: {user.lastLoginIp}</Text>}
        </View>

        <Text style={styles.sectionTitle}>Internships</Text>
        <View style={styles.internshipList}>
          {internships.map((intern) => {
            const applied = myApplications.includes(intern.id);
            return (
              <View key={intern.id} style={styles.internshipCard}>
                <Text style={styles.internshipTitle}>{intern.title}</Text>
                <Text style={styles.internshipCompany}>
                  {intern.company} • {intern.location} • {intern.duration}
                </Text>
                <Text style={styles.internshipStipend}>{intern.stipend}</Text>
                <TouchableOpacity
                  disabled={applied}
                  style={[styles.applyButton, applied && styles.applyButtonDisabled]}
                  onPress={() => applyForInternship(intern.id)}
                >
                  <Text style={styles.applyButtonText}>{applied ? 'Applied' : 'Apply'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {isAdmin && (
          <View style={styles.adminSection}>
            <Text style={styles.sectionTitle}>Admin Tools</Text>
            <Text style={styles.adminNote}>Future: manage users, roles, and applications here.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#111827', marginBottom: 16, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#4b5563', textAlign: 'center', lineHeight: 22 },
  scrollContent: { padding: 24 },
  header: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 24 },
  metaCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginBottom: 32, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  metaText: { color: '#374151', marginBottom: 6 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 16 },
  internshipList: {},
  internshipCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  internshipTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  internshipCompany: { fontSize: 12, color: '#4b5563', marginTop: 4 },
  internshipStipend: { fontSize: 12, color: '#1d4ed8', marginTop: 4 },
  applyButton: { marginTop: 12, backgroundColor: '#2563eb', paddingVertical: 10, borderRadius: 10 },
  applyButtonDisabled: { backgroundColor: '#9ca3af' },
  applyButtonText: { color: '#ffffff', textAlign: 'center', fontWeight: '600' },
  adminSection: { marginTop: 32, padding: 16, backgroundColor: '#111827', borderRadius: 16 },
  adminNote: { color: '#9ca3af' }
});

export default CompleteScreen;
