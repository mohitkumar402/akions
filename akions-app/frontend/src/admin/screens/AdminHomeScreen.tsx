import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

interface StatCard {
  label: string;
  count: number;
  icon: string;
  route: string;
  color: string;
}

export const AdminHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    blogs: 0,
    internships: 0,
    applications: 0,
    projects: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== 'admin') {
      navigation.navigate('AdminLogin');
      return;
    }
    loadStats();
  }, [user, authLoading]);

  const loadStats = async () => {
    if (!accessToken) return;
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      
      const [productsRes, blogsRes, internshipsRes, applicationsRes, projectsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/admin/products`, { headers }).catch(() => null),
        fetch(`${API_URL}/admin/blogs`, { headers }).catch(() => null),
        fetch(`${API_URL}/admin/internships`, { headers }).catch(() => null),
        fetch(`${API_URL}/admin/applications`, { headers }).catch(() => null),
        fetch(`${API_URL}/admin/projects`, { headers }).catch(() => null),
        fetch(`${API_URL}/auth/users`, { headers }).catch(() => null),
      ]);

      const products = productsRes?.ok ? await productsRes.json() : [];
      const blogs = blogsRes?.ok ? await blogsRes.json() : [];
      const internships = internshipsRes?.ok ? await internshipsRes.json() : [];
      const applications = applicationsRes?.ok ? await applicationsRes.json() : [];
      const projects = projectsRes?.ok ? await projectsRes.json() : [];
      const users = usersRes?.ok ? await usersRes.json() : [];

      setStats({
        products: Array.isArray(products) ? products.length : 0,
        blogs: Array.isArray(blogs) ? blogs.length : 0,
        internships: Array.isArray(internships) ? internships.length : 0,
        applications: Array.isArray(applications) ? applications.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        users: Array.isArray(users) ? users.length : 0,
      });
    } catch (error) {
      console.error('Load stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = [
    { label: 'PRODUCTS', count: stats.products, icon: '🛒', route: 'AdminProducts', color: '#2c3e50' },
    { label: 'BLOGS', count: stats.blogs, icon: '📝', route: 'AdminBlogs', color: '#2c3e50' },
    { label: 'INTERNSHIPS', count: stats.internships, icon: '🎓', route: 'AdminInternships', color: '#2c3e50' },
    { label: 'APPLICATIONS', count: stats.applications, icon: '📋', route: 'AdminApplications', color: '#2c3e50' },
    { label: 'PROJECTS', count: stats.projects, icon: '🔧', route: 'AdminProjects', color: '#2c3e50' },
    { label: 'CUSTOMERS', count: stats.users, icon: '👤', route: 'AdminHome', color: '#2c3e50' },
  ];

  return (
    <View style={styles.container}>
      <AdminHeader activeSection="dashboard" />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.pageTitle}>Dashboard</Text>
        
        <View style={styles.statsGrid}>
          {statCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.statCard, { backgroundColor: card.color }]}
              onPress={() => navigation.navigate(card.route)}
              activeOpacity={0.8}
            >
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{card.label}</Text>
                <Text style={styles.statCount}>{loading ? '...' : card.count}</Text>
                <TouchableOpacity 
                  style={styles.viewLink}
                  onPress={() => navigation.navigate(card.route)}
                >
                  <Text style={styles.viewLinkText}>View {card.label.charAt(0) + card.label.slice(1).toLowerCase()}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>{card.icon}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionBtn}
              onPress={() => navigation.navigate('AdminProducts')}
            >
              <Text style={styles.quickActionIcon}>➕</Text>
              <Text style={styles.quickActionText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionBtn}
              onPress={() => navigation.navigate('AdminBlogs')}
            >
              <Text style={styles.quickActionIcon}>📝</Text>
              <Text style={styles.quickActionText}>Add Blog</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionBtn}
              onPress={() => navigation.navigate('AdminInternships')}
            >
              <Text style={styles.quickActionIcon}>🎓</Text>
              <Text style={styles.quickActionText}>Add Internship</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionBtn}
              onPress={() => navigation.navigate('AdminSettings')}
            >
              <Text style={styles.quickActionIcon}>⚙️</Text>
              <Text style={styles.quickActionText}>Site Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Total Content Items</Text>
              <Text style={styles.overviewValue}>
                {stats.products + stats.blogs + stats.internships + stats.projects}
              </Text>
            </View>
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Active Internships</Text>
              <Text style={styles.overviewValue}>{stats.internships}</Text>
            </View>
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Pending Applications</Text>
              <Text style={styles.overviewValue}>{stats.applications}</Text>
            </View>
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Registered Users</Text>
              <Text style={styles.overviewValue}>{stats.users}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    width: Platform.OS === 'web' ? 'calc(25% - 12px)' as any : '47%',
    minWidth: 200,
    borderRadius: 8,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statCount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 12,
  },
  viewLink: {
    marginTop: 4,
  },
  viewLinkText: {
    color: '#81d4fa',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickActionIcon: {
    fontSize: 20,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  overviewLabel: {
    fontSize: 14,
    color: '#666',
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
