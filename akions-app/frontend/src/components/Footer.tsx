import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking, Dimensions } from 'react-native';
import { useHover } from '../hooks/useHover';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isMobile = SCREEN_WIDTH < 768;
const isAndroid = Platform.OS === 'android';

interface FooterProps {
  navigation: any;
}

// Footer Link Component with Hover
const FooterLink: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.linkItem}
      {...hoverProps}
    >
      <Text style={[styles.linkText, isHovered && styles.linkTextHovered]}>{label}</Text>
    </TouchableOpacity>
  );
};

// Footer Bottom Link Component with Hover
const FooterBottomLink: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => {
  const { isHovered, hoverProps } = useHover();
  return (
    <TouchableOpacity 
      onPress={onPress}
      {...hoverProps}
    >
      <Text style={[styles.footerLink, isHovered && styles.footerLinkHovered]}>{label}</Text>
    </TouchableOpacity>
  );
};

export const Footer: React.FC<FooterProps> = ({ navigation }) => {
  const handleGetToUs = () => {
    // Open email client or navigate to contact
    const email = 'contact@ekions.com';
    const subject = 'Contact from Ekions Website';
    const body = 'Hello, I would like to get in touch with Ekions.';
    
    if (Platform.OS === 'web') {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`).catch(err => {
        console.error('Error opening email:', err);
        // Fallback: navigate to contact if available
        if (navigation) {
          navigation.navigate('Contact');
        }
      });
    }
  };

  const footerLinks = [
    { label: 'About', route: 'About' },
    { label: 'Services', route: 'Services' },
    { label: 'Marketplace', route: 'Marketplace' },
    { label: 'Internships', route: 'Internships' },
    { label: 'Blog', route: 'Blog' },
    { label: 'Custom Projects', route: 'CustomProjects' },
  ];

  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <View style={styles.footerTop}>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Ekions</Text>
            <Text style={styles.footerDescription}>
              Empowering businesses and individuals through innovative technology solutions, internships, and custom projects.
            </Text>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.sectionTitle}>Quick Links</Text>
            <View style={styles.linksColumn}>
              {footerLinks.map((link, index) => (
                <FooterLink
                  key={index}
                  label={link.label}
                  onPress={() => navigation?.navigate(link.route)}
                />
              ))}
            </View>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>
            <FooterLink label="Get to Us" onPress={handleGetToUs} />
            <FooterLink
              label="Call Us"
              onPress={() => {
                const phone = '+916203802704';
                if (Platform.OS === 'web') {
                  window.location.href = `tel:${phone}`;
                } else {
                  Linking.openURL(`tel:${phone}`).catch(err => console.error('Error opening phone:', err));
                }
              }}
            />
            <FooterLink
              label="Email Us"
              onPress={() => {
                const email = 'contact@ekions.com';
                if (Platform.OS === 'web') {
                  window.location.href = `mailto:${email}`;
                } else {
                  Linking.openURL(`mailto:${email}`).catch(err => console.error('Error opening email:', err));
                }
              }}
            />
          </View>
        </View>

        <View style={styles.footerBottom}>
          {isMobile || isAndroid ? (
            <View style={styles.footerLinksColumn}>
              <FooterBottomLink label="Privacy Policy" onPress={() => {}} />
              <FooterBottomLink label="Terms of Service" onPress={() => {}} />
              <FooterBottomLink label="Contact Us" onPress={handleGetToUs} />
            </View>
          ) : (
            <View style={styles.footerLinksRow}>
              <FooterBottomLink label="Privacy Policy" onPress={() => {}} />
              {!isMobile && !isAndroid && <Text style={styles.separator}>|</Text>}
              <FooterBottomLink label="Terms of Service" onPress={() => {}} />
              {!isMobile && !isAndroid && <Text style={styles.separator}>|</Text>}
              <FooterBottomLink label="Contact Us" onPress={handleGetToUs} />
            </View>
          )}
          <Text style={styles.copyright}>
            © 2024 Ekions. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingVertical: isMobile || isAndroid ? 32 : (Platform.OS === 'web' ? 48 : 40),
    paddingHorizontal: isMobile || isAndroid ? 16 : 24,
  },
  footerContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  footerTop: {
    flexDirection: isMobile || isAndroid ? 'column' : (Platform.OS === 'web' ? 'row' : 'column'),
    justifyContent: 'space-between',
    marginBottom: isMobile || isAndroid ? 24 : 32,
    gap: isMobile || isAndroid ? 24 : (Platform.OS === 'web' ? 48 : 32),
  },
  footerSection: {
    flex: (isMobile || isAndroid) ? undefined : (Platform.OS === 'web' ? 1 : undefined),
    marginBottom: (isMobile || isAndroid) ? 20 : (Platform.OS === 'web' ? 0 : 24),
    width: (isMobile || isAndroid) ? '100%' : undefined,
  },
  footerTitle: {
    fontSize: isMobile || isAndroid ? 20 : 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: isMobile || isAndroid ? 10 : 12,
  },
  footerDescription: {
    fontSize: isMobile || isAndroid ? 13 : 14,
    color: '#9ca3af',
    lineHeight: isMobile || isAndroid ? 20 : 22,
    maxWidth: (isMobile || isAndroid) ? '100%' : 300,
  },
  sectionTitle: {
    fontSize: isMobile || isAndroid ? 15 : 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: isMobile || isAndroid ? 12 : 16,
  },
  linksColumn: {
    gap: isMobile || isAndroid ? 10 : 12,
  },
  linkItem: {
    marginBottom: isMobile || isAndroid ? 6 : 8,
  },
  linkText: {
    fontSize: isMobile || isAndroid ? 13 : 14,
    color: '#9ca3af',
    lineHeight: isMobile || isAndroid ? 18 : 20,
  },
  linkTextHovered: {
    ...(Platform.OS === 'web' && {
      color: '#60a5fa',
    }),
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingTop: isMobile || isAndroid ? 20 : 24,
    alignItems: 'center',
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  footerLinksColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
    width: '100%',
  },
  footerLink: {
    fontSize: isMobile || isAndroid ? 13 : 14,
    color: '#9ca3af',
    paddingHorizontal: isMobile || isAndroid ? 0 : 8,
    paddingVertical: isMobile || isAndroid ? 6 : 0,
    textAlign: 'center',
  },
  footerLinkHovered: {
    ...(Platform.OS === 'web' && {
      color: '#60a5fa',
    }),
  },
  separator: {
    color: '#374151',
    fontSize: 14,
  },
  copyright: {
    fontSize: isMobile || isAndroid ? 11 : 12,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: isMobile || isAndroid ? 16 : 0,
    lineHeight: isMobile || isAndroid ? 16 : 18,
  },
});

