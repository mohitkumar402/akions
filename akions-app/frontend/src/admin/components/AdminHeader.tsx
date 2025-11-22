import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  activeSection: 'products' | 'blogs' | 'projects' | 'internships' | 'documents';
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ activeSection }) => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  const sections = [
    { key: 'products' as const, label: 'Products', route: 'AdminProducts' },
    { key: 'blogs' as const, label: 'Blogs', route: 'AdminBlogs' },
    { key: 'projects' as const, label: 'Projects', route: 'AdminProjects' },
    { key: 'internships' as const, label: 'Internships', route: 'AdminInternships' },
    { key: 'documents' as const, label: 'Documents', route: 'AdminDocuments' },
  ];

  const handleSectionChange = (section: typeof sections[number]) => {
    if (section.key !== activeSection) {
      navigation.navigate(section.route);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>▲ Ekions Admin</Text>
          <Text style={styles.subtitle}>Content Management System</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.userInfo}>👤 {user?.name}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backButtonText}>Back to Site</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.navTabs}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.key}
            style={[styles.navTab, activeSection === section.key && styles.navTabActive]}
            onPress={() => handleSectionChange(section)}
          >
            <Text style={[styles.navTabText, activeSection === section.key && styles.navTabTextActive]}>
              {section.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0f172a',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    color: '#ffffff',
    fontSize: 14,
  },
  backButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  navTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  navTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  navTabActive: {
    backgroundColor: '#2563eb',
  },
  navTabText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  navTabTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

