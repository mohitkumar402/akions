import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

export type AdminSection =
  | 'products'
  | 'blogs'
  | 'projects'
  | 'internships'
  | 'documents'
  | 'chat'
  | 'applications';

interface AdminHeaderProps {
  activeSection: AdminSection;
}

const SECTIONS: { key: AdminSection; label: string; icon: string; route: string }[] = [
  { key: 'products',      label: 'Products',      icon: '🛒', route: 'AdminProducts' },
  { key: 'blogs',         label: 'Blogs',         icon: '📝', route: 'AdminBlogs' },
  { key: 'projects',      label: 'Projects',      icon: '🔧', route: 'AdminProjects' },
  { key: 'internships',   label: 'Internships',   icon: '💼', route: 'AdminInternships' },
  { key: 'applications',  label: 'Applications',  icon: '📋', route: 'AdminApplications' },
  { key: 'documents',     label: 'Documents',     icon: '📄', route: 'AdminDocuments' },
  { key: 'chat',          label: 'Chat',          icon: '💬', route: 'AdminChat' },
];

export const AdminHeader: React.FC<AdminHeaderProps> = ({ activeSection }) => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  return (
    <View style={styles.wrapper}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <View style={styles.brandDot} />
          <View>
            <Text style={styles.brandName}>Ekions Admin</Text>
            <Text style={styles.brandSub}>Content Management System</Text>
          </View>
        </View>

        <View style={styles.topRight}>
          <View style={styles.userChip}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.name?.[0] || 'A').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName} numberOfLines={1}>{user?.name || 'Admin'}</Text>
          </View>

          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.topBtnText}>← Site</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.topBtn, styles.logoutBtn]} onPress={logout}>
            <Text style={[styles.topBtnText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nav tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {SECTIONS.map((s) => {
            const active = activeSection === s.key;
            return (
              <TouchableOpacity
                key={s.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => !active && navigation.navigate(s.route)}
                activeOpacity={0.75}
              >
                <Text style={styles.tabIcon}>{s.icon}</Text>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {s.label}
                </Text>
                {active && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#080f1a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    ...(Platform.OS === 'web' && { position: 'sticky' as any, top: 0, zIndex: 100 }),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  brandName: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSub: {
    color: '#475569',
    fontSize: 11,
    marginTop: 1,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  userName: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 100,
  },
  topBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  topBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#1a0a0a',
    borderColor: '#450a0a',
  },
  logoutText: {
    color: '#f87171',
  },
  tabsWrapper: {
    paddingVertical: 0,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 13,
    position: 'relative',
    borderRadius: 0,
    opacity: 0.65,
  },
  tabActive: {
    opacity: 1,
  },
  tabIcon: {
    fontSize: 14,
  },
  tabLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#f1f5f9',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
});
