import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useHover } from '../hooks/useHover';
import { Logo } from './Logo';

// NavbarLogo Component
const NavbarLogo: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.logoContainer, isHovered && styles.logoContainerHovered]}
      {...hoverProps}
    >
      <Logo size="medium" showGlow={true} />
    </TouchableOpacity>
  );
};

// NavItem Component
const NavItem: React.FC<{ item: { name: string; route: string }; isActive: boolean; onPress: () => void }> = ({ item, isActive, onPress }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.navItem,
        isActive && styles.navItemActive,
        isHovered && styles.navItemHovered,
      ]}
      {...hoverProps}
    >
      <Text style={[styles.navText, isActive && styles.navTextActive]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

// SearchButton Component
const SearchButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.searchButton, isHovered && styles.searchButtonHovered]}
      {...hoverProps}
    >
      <Text style={styles.searchButtonText}>Search</Text>
    </TouchableOpacity>
  );
};

// AdminButton Component
const AdminButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.adminButton, isHovered && styles.adminButtonHovered]}
      {...hoverProps}
    >
      <Text style={styles.adminButtonText}>Admin</Text>
    </TouchableOpacity>
  );
};

// LogoutButton Component
const LogoutButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.logoutButton, isHovered && styles.logoutButtonHovered]}
      {...hoverProps}
    >
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
};

// GetStartedButton Component
const GetStartedButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.getStartedButton, isHovered && styles.getStartedButtonHovered]}
      {...hoverProps}
    >
      <Text style={styles.getStartedText}>Get Started</Text>
    </TouchableOpacity>
  );
};

// AdminLoginButton Component
const AdminLoginButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.adminLoginButton, isHovered && styles.adminLoginButtonHovered]}
      {...hoverProps}
    >
      <Text style={styles.adminLoginText}>Admin Login</Text>
    </TouchableOpacity>
  );
};

export const Navbar: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { name: 'About & Contact', route: 'About' },
    { name: 'Services', route: 'Services' },
    { name: 'Marketplace', route: 'Marketplace' },
    { name: 'Internships', route: 'Internships' },
  ];

  const isActive = (routeName: string) => route.name === routeName;

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }

    // Navigate to appropriate screen based on search
    // You can enhance this to search across all content types
    const query = searchQuery.toLowerCase();
    
    if (query.includes('internship') || query.includes('intern')) {
      navigation.navigate('Internships', { searchQuery: searchQuery });
    } else if (query.includes('product') || query.includes('marketplace')) {
      navigation.navigate('Marketplace', { searchQuery: searchQuery });
    } else if (query.includes('blog') || query.includes('article')) {
      navigation.navigate('Blog', { searchQuery: searchQuery });
    } else if (query.includes('project')) {
      navigation.navigate('CustomProjects', { searchQuery: searchQuery });
    } else {
      // Default: search in marketplace
      navigation.navigate('Marketplace', { searchQuery: searchQuery });
    }
  };

  const handleSearchSubmit = () => {
    handleSearch();
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.content}>
        {/* Left: Logo */}
        <NavbarLogo onPress={() => navigation.navigate('Home')} />

        {/* Center: Navigation Links */}
        {Platform.OS === 'web' && (
          <View style={styles.navItems}>
            {navItems.map((item) => (
              <NavItem
                key={item.route}
                item={item}
                isActive={isActive(item.route)}
                onPress={() => navigation.navigate(item.route)}
              />
            ))}
          </View>
        )}

        {/* Compact Search Bar in Header */}
        {Platform.OS === 'web' && (
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search internships, products, blogs..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />
              <SearchButton onPress={handleSearch} />
            </View>
          </View>
        )}

        {/* Right: Get Started Button */}
        {Platform.OS === 'web' && (
          <View style={styles.rightSection}>
            {user ? (
              <View style={styles.userSection}>
                {user.role === 'admin' && (
                  <AdminButton onPress={() => navigation.navigate('AdminDashboard')} />
                )}
                <LogoutButton onPress={logout} />
              </View>
            ) : (
              <GetStartedButton onPress={() => navigation.navigate('Login')} />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#000000',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 1400,
    alignSelf: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 4,
    borderRadius: 8,
  },
  logoContainerHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#1f2937',
      transform: [{ scale: 1.05 }],
    }),
  },
  logo: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 32,
    marginRight: 24,
  },
  searchBarContainer: {
    marginRight: 24,
    minWidth: 320,
    maxWidth: 400,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navItemHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#1f2937',
    }),
  },
  navItemActive: {
    backgroundColor: 'transparent',
  },
  navText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginLeft: 'auto',
  },
  getStartedButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  getStartedButtonHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#1d4ed8',
      transform: [{ scale: 1.05 }],
    }),
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminLoginButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  adminLoginButtonHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#b91c1c',
      transform: [{ scale: 1.05 }],
    }),
  },
  adminLoginText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  adminButtonHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#7c3aed',
      transform: [{ scale: 1.05 }],
    }),
  },
  adminButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#dc2626',
      transform: [{ scale: 1.05 }],
    }),
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
    width: '100%',
  },
  searchIcon: {
    fontSize: 16,
    color: '#60a5fa',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#ffffff',
    padding: 0,
    fontWeight: '400',
    minWidth: 0,
  },
  searchButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#1d4ed8',
      transform: [{ scale: 1.05 }],
    }),
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});

