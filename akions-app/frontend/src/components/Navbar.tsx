import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, TextInput, Alert, Dimensions, Modal, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useHover } from '../hooks/useHover';
import { Logo } from './Logo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isMobile = SCREEN_WIDTH < 768;
const isTablet = SCREEN_WIDTH >= 768 && SCREEN_WIDTH < 1024;
const isDesktop = SCREEN_WIDTH >= 1024;

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
const NavItem: React.FC<{ item: { name: string; route: string }; isActive: boolean; onPress: () => void; fontSize?: number }> = ({ item, isActive, onPress, fontSize }) => {
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
      <Text style={[styles.navText, isActive && styles.navTextActive, fontSize && { fontSize }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

// SearchButton Component
const SearchButton: React.FC<{ onPress: () => void; fontSize?: number; paddingHorizontal?: number; paddingVertical?: number }> = ({ onPress, fontSize, paddingHorizontal, paddingVertical }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.searchButton, 
        isHovered && styles.searchButtonHovered,
        paddingHorizontal !== undefined && { paddingHorizontal },
        paddingVertical !== undefined && { paddingVertical },
      ]}
      {...hoverProps}
    >
      <Text style={[styles.searchButtonText, fontSize && { fontSize }]}>Search</Text>
    </TouchableOpacity>
  );
};

// AdminButton Component
const AdminButton: React.FC<{ onPress: () => void; fontSize?: number; paddingHorizontal?: number; paddingVertical?: number }> = ({ onPress, fontSize, paddingHorizontal, paddingVertical }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.adminButton, 
        isHovered && styles.adminButtonHovered,
        paddingHorizontal !== undefined && { paddingHorizontal },
        paddingVertical !== undefined && { paddingVertical },
      ]}
      {...hoverProps}
    >
      <Text style={[styles.adminButtonText, fontSize && { fontSize }]}>Admin</Text>
    </TouchableOpacity>
  );
};

// LogoutButton Component
const LogoutButton: React.FC<{ onPress: () => void; fontSize?: number; paddingHorizontal?: number; paddingVertical?: number }> = ({ onPress, fontSize, paddingHorizontal, paddingVertical }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.logoutButton, 
        isHovered && styles.logoutButtonHovered,
        paddingHorizontal !== undefined && { paddingHorizontal },
        paddingVertical !== undefined && { paddingVertical },
      ]}
      {...hoverProps}
    >
      <Text style={[styles.logoutText, fontSize && { fontSize }]}>Logout</Text>
    </TouchableOpacity>
  );
};

// GetStartedButton Component
const GetStartedButton: React.FC<{ onPress: () => void; fontSize?: number; paddingHorizontal?: number; paddingVertical?: number }> = ({ onPress, fontSize, paddingHorizontal, paddingVertical }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.getStartedButton, 
        isHovered && styles.getStartedButtonHovered,
        paddingHorizontal !== undefined && { paddingHorizontal },
        paddingVertical !== undefined && { paddingVertical },
      ]}
      {...hoverProps}
    >
      <Text style={[styles.getStartedText, fontSize && { fontSize }]}>Get Started</Text>
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

// Hamburger Menu Button Component
const HamburgerButton: React.FC<{ onPress: () => void; isOpen: boolean }> = ({ onPress, isOpen }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.hamburgerButton}
      activeOpacity={0.7}
    >
      <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen1]} />
      <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen2]} />
      <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen3]} />
    </TouchableOpacity>
  );
};

export const Navbar: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const currentIsMobile = dimensions.width < 768;
  const currentIsTablet = dimensions.width >= 768 && dimensions.width < 1024;
  const currentIsDesktop = dimensions.width >= 1024;

  // Responsive nav items - shorter labels on smaller screens
  const navItems = currentIsMobile 
    ? [
        { name: 'About', route: 'About' },
        { name: 'Services', route: 'Services' },
        { name: 'Marketplace', route: 'Marketplace' },
        { name: 'Internships', route: 'Internships' },
      ]
    : [
        { name: 'About & Contact', route: 'About' },
        { name: 'Services', route: 'Services' },
        { name: 'Marketplace', route: 'Marketplace' },
        { name: 'Internships', route: 'Internships' },
      ];

  const dynamicStyles = createDynamicStyles(currentIsMobile, currentIsTablet, currentIsDesktop);

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
    if (currentIsMobile) {
      setIsMenuOpen(false);
    }
  };

  const handleNavItemPress = (route: string) => {
    navigation.navigate(route);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <View style={[styles.navbar, dynamicStyles.navbar]}>
        <View style={[styles.content, dynamicStyles.content]}>
          {/* Left: Logo */}
          <View style={[styles.logoWrapper, dynamicStyles.logoWrapper]}>
            <NavbarLogo onPress={() => {
              navigation.navigate('Home');
              setIsMenuOpen(false);
            }} />
          </View>

          {/* Center: Navigation Links - Desktop/Tablet */}
          {!currentIsMobile && (
            <View style={[styles.navItems, dynamicStyles.navItems]}>
              {navItems.map((item) => (
                <NavItem
                  key={item.route}
                  item={item}
                  isActive={isActive(item.route)}
                  onPress={() => navigation.navigate(item.route)}
                  fontSize={currentIsTablet ? 15 : 16}
                />
              ))}
            </View>
          )}

          {/* Search Bar - Always Visible (Mobile, Tablet, Desktop) */}
          <View style={[styles.searchBarContainer, dynamicStyles.searchBarContainer]}>
            <View style={[styles.searchBar, dynamicStyles.searchBar]}>
              <Text style={[styles.searchIcon, dynamicStyles.searchIcon]}>🔍</Text>
              <TextInput
                style={[styles.searchInput, dynamicStyles.searchInput]}
                placeholder={currentIsMobile ? "Search..." : currentIsTablet ? "Search..." : "Search internships, products, blogs..."}
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />
              {!currentIsTablet && !currentIsMobile && (
                <SearchButton 
                  onPress={handleSearch}
                  fontSize={13}
                  paddingHorizontal={16}
                  paddingVertical={6}
                />
              )}
            </View>
          </View>

          {/* Right: Hamburger Menu (Mobile) or Action Buttons */}
          <View style={[styles.rightSection, dynamicStyles.rightSection]}>
            {currentIsMobile ? (
              <HamburgerButton 
                onPress={() => setIsMenuOpen(!isMenuOpen)} 
                isOpen={isMenuOpen}
              />
            ) : (
              <>
                {user ? (
                  <View style={[styles.userSection, dynamicStyles.userSection]}>
                    {user.role === 'admin' && (
                      <AdminButton 
                        onPress={() => navigation.navigate('AdminDashboard')}
                        fontSize={currentIsTablet ? 13 : 14}
                        paddingHorizontal={currentIsTablet ? 12 : 16}
                        paddingVertical={currentIsTablet ? 6 : 8}
                      />
                    )}
                    <LogoutButton 
                      onPress={logout}
                      fontSize={currentIsTablet ? 13 : 14}
                      paddingHorizontal={currentIsTablet ? 12 : 16}
                      paddingVertical={currentIsTablet ? 6 : 8}
                    />
                  </View>
                ) : (
                  <GetStartedButton 
                    onPress={() => navigation.navigate('Login')}
                    fontSize={currentIsTablet ? 13 : 14}
                    paddingHorizontal={currentIsTablet ? 20 : 24}
                    paddingVertical={currentIsTablet ? 8 : 10}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </View>

      {/* Mobile Dropdown Menu */}
      {currentIsMobile && (
        <Modal
          visible={isMenuOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsMenuOpen(false)}
        >
          <View style={styles.mobileMenuOverlay}>
            <View style={styles.mobileMenuContainer}>
              {/* Menu Header */}
              <View style={styles.mobileMenuHeader}>
                <Text style={styles.mobileMenuTitle}>Menu</Text>
                <TouchableOpacity
                  onPress={() => setIsMenuOpen(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.mobileMenuContent} showsVerticalScrollIndicator={false}>
                {/* Navigation Items */}
                <View style={styles.mobileNavItems}>
                  {navItems.map((item) => (
                    <TouchableOpacity
                      key={item.route}
                      style={[
                        styles.mobileNavItem,
                        isActive(item.route) && styles.mobileNavItemActive
                      ]}
                      onPress={() => handleNavItemPress(item.route)}
                    >
                      <Text style={[
                        styles.mobileNavText,
                        isActive(item.route) && styles.mobileNavTextActive
                      ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Divider */}
                <View style={styles.mobileDivider} />

                {/* User Actions */}
                {user ? (
                  <View style={styles.mobileUserSection}>
                    {user.role === 'admin' && (
                      <TouchableOpacity
                        style={styles.mobileActionButton}
                        onPress={() => {
                          navigation.navigate('AdminDashboard');
                          setIsMenuOpen(false);
                        }}
                      >
                        <Text style={styles.mobileActionButtonText}>Admin Dashboard</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.mobileActionButton, styles.mobileLogoutButton]}
                      onPress={handleLogout}
                    >
                      <Text style={[styles.mobileActionButtonText, styles.mobileLogoutButtonText]}>
                        Logout
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.mobileActionButton}
                    onPress={() => {
                      navigation.navigate('Login');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Text style={styles.mobileActionButtonText}>Get Started</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

// Dynamic styles based on screen size
const createDynamicStyles = (isMobile: boolean, isTablet: boolean, isDesktop: boolean) => StyleSheet.create({
  navbar: {
    paddingVertical: isMobile ? 12 : 16,
  },
  content: {
    paddingVertical: isMobile ? 8 : 10,
    paddingHorizontal: isMobile ? 16 : isTablet ? 20 : 24,
    maxWidth: isDesktop ? 1400 : '100%',
    gap: isMobile ? 6 : 10,
  },
  logoWrapper: {
    minWidth: isMobile ? 80 : 100,
    marginRight: isMobile ? 8 : 0,
  },
  navItems: {
    gap: isTablet ? 12 : isDesktop ? 16 : 20,
    marginLeft: isTablet ? 12 : 16,
    marginRight: isTablet ? 12 : 16,
  },
  searchBarContainer: {
    marginRight: isMobile ? 8 : isTablet ? 12 : 16,
    minWidth: isMobile ? 120 : isTablet ? 200 : 280,
    maxWidth: isMobile ? 200 : isTablet ? 280 : 400,
    flex: isMobile ? 1 : 0,
  },
  searchBar: {
    paddingHorizontal: isMobile ? 8 : isTablet ? 10 : 12,
    paddingVertical: isMobile ? 6 : isTablet ? 6 : 8,
    gap: isMobile ? 6 : isTablet ? 6 : 8,
  },
  searchIcon: {
    fontSize: isMobile ? 12 : isTablet ? 14 : 16,
  },
  searchInput: {
    fontSize: isMobile ? 11 : isTablet ? 12 : 13,
  },
  rightSection: {
    gap: isMobile ? 8 : 12,
  },
  userSection: {
    gap: isMobile ? 8 : 12,
  },
});

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#000000',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    position: 'relative',
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    flexWrap: 'nowrap',
  },
  logoWrapper: {
    flexShrink: 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 4,
    borderRadius: 8,
    flexShrink: 0,
  },
  logoContainerHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#1f2937',
      transform: [{ scale: 1.05 }],
    }),
  },
  logo: {
    color: '#ffffff',
    fontSize: isMobile ? 18 : isTablet ? 20 : 24,
    fontWeight: 'bold',
  },
  logoText: {
    color: '#ffffff',
    fontSize: isMobile ? 18 : isTablet ? 20 : 24,
    fontWeight: 'bold',
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  searchBarContainer: {
    flexShrink: 1,
    flex: 0,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexShrink: 0,
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
    gap: isMobile ? 8 : 12,
    marginLeft: 'auto',
    flexShrink: 0,
  },
  getStartedButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    flexShrink: 0,
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
    gap: isMobile ? 8 : 12,
    flexShrink: 0,
  },
  adminButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexShrink: 0,
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
    flexShrink: 0,
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
    minWidth: 0,
    flexShrink: 1,
  },
  searchIcon: {
    fontSize: 16,
    color: '#60a5fa',
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#ffffff',
    padding: 0,
    fontWeight: '400',
    minWidth: 0,
    flexShrink: 1,
  },
  searchButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
  // Hamburger Menu Styles
  hamburgerButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  hamburgerLine: {
    width: 24,
    height: 2,
    backgroundColor: '#ffffff',
    marginVertical: 3,
    borderRadius: 2,
  },
  hamburgerLineOpen1: {
    transform: [{ rotate: '45deg' }, { translateY: 8 }],
  },
  hamburgerLineOpen2: {
    opacity: 0,
  },
  hamburgerLineOpen3: {
    transform: [{ rotate: '-45deg' }, { translateY: -8 }],
  },
  // Mobile Menu Styles
  mobileMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  mobileMenuContainer: {
    backgroundColor: '#000000',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',
    maxHeight: '90%',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  mobileMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  mobileMenuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#1f2937',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  mobileMenuContent: {
    flex: 1,
  },
  mobileSearchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  mobileSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mobileSearchIcon: {
    fontSize: 16,
    color: '#60a5fa',
    marginRight: 8,
  },
  mobileSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    padding: 0,
  },
  mobileSearchButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  mobileSearchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  mobileNavItems: {
    paddingVertical: 8,
  },
  mobileNavItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  mobileNavItemActive: {
    backgroundColor: '#1f2937',
  },
  mobileNavText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  mobileNavTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  mobileDivider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginVertical: 16,
  },
  mobileUserSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  mobileActionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  mobileActionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  mobileLogoutButton: {
    backgroundColor: '#ef4444',
  },
  mobileLogoutButtonText: {
    color: '#ffffff',
  },
});

