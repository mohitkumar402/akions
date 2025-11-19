import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useHover } from '../hooks/useHover';

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
    const email = 'contact@akions.com';
    const subject = 'Contact from Akions Website';
    const body = 'Hello, I would like to get in touch with Akions.';
    
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
            <Text style={styles.footerTitle}>Akions</Text>
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
                const email = 'contact@akions.com';
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
          <View style={styles.footerLinksRow}>
            <FooterBottomLink label="Privacy Policy" onPress={() => {}} />
            <Text style={styles.separator}>|</Text>
            <FooterBottomLink label="Terms of Service" onPress={() => {}} />
            <Text style={styles.separator}>|</Text>
            <FooterBottomLink label="Contact Us" onPress={handleGetToUs} />
          </View>
          <Text style={styles.copyright}>
            © 2024 Akions. All rights reserved.
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
    paddingVertical: Platform.OS === 'web' ? 48 : 40,
    paddingHorizontal: 24,
  },
  footerContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  footerTop: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: Platform.OS === 'web' ? 48 : 32,
  },
  footerSection: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    marginBottom: Platform.OS === 'web' ? 0 : 24,
  },
  footerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  footerDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 22,
    maxWidth: 300,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  linksColumn: {
    gap: 12,
  },
  linkItem: {
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    transition: Platform.OS === 'web' ? 'color 0.2s ease' : undefined,
  },
  linkTextHovered: {
    ...(Platform.OS === 'web' && {
      color: '#60a5fa',
    }),
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingTop: 24,
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
  footerLink: {
    fontSize: 14,
    color: '#9ca3af',
    paddingHorizontal: 8,
    transition: Platform.OS === 'web' ? 'color 0.2s ease' : undefined,
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
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

