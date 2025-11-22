import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Dimensions, Image } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { teamMembers, values } from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Create styles function for responsive design
const createStyles = (screenWidth: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  hero: {
    backgroundColor: '#0f766e',
    paddingVertical: Platform.OS === 'web' ? 100 : 80,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroInner: {
    maxWidth: 1200,
    width: '100%',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: Platform.OS === 'web' ? 64 : 56,
    marginBottom: 24,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: Platform.OS === 'web' ? 56 : 40,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: '#ccfbf1',
    fontSize: Platform.OS === 'web' ? 20 : 16,
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 28,
  },
  sectionWrapper: {
    backgroundColor: '#000000',
    paddingVertical: Platform.OS === 'web' ? 96 : 64,
    paddingHorizontal: 24,
  },
  sectionInner: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  block: {
    marginBottom: Platform.OS === 'web' ? 96 : 64,
  },
  blockTitle: {
    fontSize: Platform.OS === 'web' ? 40 : 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  blockTitleCenter: {
    textAlign: 'center',
    marginBottom: 48,
  },
  paragraph: {
    color: '#d1d5db',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    lineHeight: Platform.OS === 'web' ? 32 : 26,
    marginBottom: 20,
    maxWidth: 900,
  },
  teamGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Platform.OS === 'web' ? 32 : 24,
    marginTop: 24,
  },
  teamCard: {
    alignItems: 'center',
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? 220 : screenWidth > 768 ? 200 : 180) : '100%',
    maxWidth: 280,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#0f766e',
  },
  avatarEmoji: {
    fontSize: 56,
  },
  teamName: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  teamRole: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '500',
  },
  valuesGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
    marginTop: 24,
  },
  valueColumn: {
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? '23%' : screenWidth > 768 ? '48%' : '100%') : '100%',
    marginBottom: Platform.OS === 'web' ? 0 : 24,
  },
  valueCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#1f2937',
    height: '100%',
    minHeight: 240,
  },
  valueIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#0f766e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  valueIcon: {
    fontSize: 32,
  },
  valueTitle: {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  valueDescription: {
    color: '#9ca3af',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    lineHeight: Platform.OS === 'web' ? 26 : 22,
  },
  statsSection: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: Platform.OS === 'web' ? 64 : 48,
    marginTop: 48,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  statsGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-around',
    gap: Platform.OS === 'web' ? 0 : 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Platform.OS === 'web' ? 48 : 40,
    fontWeight: '700',
    color: '#0f766e',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  contactGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    gap: 24,
    marginTop: 24,
  },
  contactCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    flex: Platform.OS === 'web' ? 1 : undefined,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  contactIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamImage: {
    width: '100%',
    height: Platform.OS === 'web' ? 400 : 300,
    borderRadius: 16,
    marginBottom: 32,
    backgroundColor: '#111827',
    resizeMode: 'cover',
  },
  servicesGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
    marginTop: 24,
  },
  serviceCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 32,
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? '31%' : screenWidth > 768 ? '48%' : '100%') : '100%',
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
  },
  productsGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 24,
  },
  productCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 24,
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? '23%' : screenWidth > 768 ? '48%' : '100%') : '100%',
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
  },
  productIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  productName: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export const AboutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const styles = createStyles(SCREEN_WIDTH);

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroInner}>
            <Text style={styles.heroEmoji}>🚀</Text>
            <Text style={styles.heroTitle}>About Ekions</Text>
            <Text style={styles.heroSubtitle}>
              Learn more about our mission, vision, values, and the team behind Ekions.
            </Text>
          </View>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionInner}>
            {/* About Section */}
            <View style={styles.block}>
              <Text style={styles.blockTitle}>About Us</Text>
              <Text style={styles.paragraph}>
                Ekions started as a startup with a clear vision: to revolutionize the way businesses and individuals connect through technology. We began with a simple yet powerful idea - to bridge the gap between innovative solutions and those who need them.
              </Text>
              <Text style={styles.paragraph}>
                Today, we are a dynamic team of passionate professionals dedicated to delivering excellence in every project. We provide comprehensive services including design, mobile app development, web applications, and much more. Our commitment to quality and innovation has made us a trusted partner for businesses of all sizes.
              </Text>
            </View>

            {/* Our Services */}
            <View style={styles.block}>
              <Text style={[styles.blockTitle, styles.blockTitleCenter]}>What We Provide</Text>
              <View style={styles.servicesGrid}>
                <View style={styles.serviceCard}>
                  <Text style={styles.serviceIcon}>🎨</Text>
                  <Text style={styles.serviceTitle}>Design</Text>
                  <Text style={styles.serviceDescription}>
                    Creative and modern design solutions for web, mobile, and branding that capture your vision.
                  </Text>
                </View>
                <View style={styles.serviceCard}>
                  <Text style={styles.serviceIcon}>📱</Text>
                  <Text style={styles.serviceTitle}>Mobile Apps</Text>
                  <Text style={styles.serviceDescription}>
                    Native and cross-platform mobile applications for iOS and Android with cutting-edge features.
                  </Text>
                </View>
                <View style={styles.serviceCard}>
                  <Text style={styles.serviceIcon}>🌐</Text>
                  <Text style={styles.serviceTitle}>Web Development</Text>
                  <Text style={styles.serviceDescription}>
                    Responsive web applications and websites built with the latest technologies and best practices.
                  </Text>
                </View>
                <View style={styles.serviceCard}>
                  <Text style={styles.serviceIcon}>⚙️</Text>
                  <Text style={styles.serviceTitle}>Backend Solutions</Text>
                  <Text style={styles.serviceDescription}>
                    Robust backend infrastructure, APIs, and cloud solutions to power your applications.
                  </Text>
                </View>
                <View style={styles.serviceCard}>
                  <Text style={styles.serviceIcon}>☁️</Text>
                  <Text style={styles.serviceTitle}>Hosting & Infrastructure</Text>
                  <Text style={styles.serviceDescription}>
                    Reliable hosting services and enterprise-level infrastructure solutions for scalability.
                  </Text>
                </View>
                <View style={styles.serviceCard}>
                  <Text style={styles.serviceIcon}>🚀</Text>
                  <Text style={styles.serviceTitle}>Enterprise Solutions</Text>
                  <Text style={styles.serviceDescription}>
                    Custom enterprise-level solutions tailored to your business needs and requirements.
                  </Text>
                </View>
              </View>
            </View>

            {/* Trusted Products */}
            <View style={styles.block}>
              <Text style={[styles.blockTitle, styles.blockTitleCenter]}>Our Trusted Products</Text>
              <Text style={[styles.paragraph, { textAlign: 'center', marginBottom: 32 }]}>
                We've developed and delivered a wide range of trusted products that have helped businesses grow and succeed.
              </Text>
              <View style={styles.productsGrid}>
                <View style={styles.productCard}>
                  <Text style={styles.productIcon}>💼</Text>
                  <Text style={styles.productName}>Project Management Tools</Text>
                </View>
                <View style={styles.productCard}>
                  <Text style={styles.productIcon}>🛒</Text>
                  <Text style={styles.productName}>E-commerce Platforms</Text>
                </View>
                <View style={styles.productCard}>
                  <Text style={styles.productIcon}>📊</Text>
                  <Text style={styles.productName}>Analytics Dashboards</Text>
                </View>
                <View style={styles.productCard}>
                  <Text style={styles.productIcon}>👥</Text>
                  <Text style={styles.productName}>CRM Systems</Text>
                </View>
                <View style={styles.productCard}>
                  <Text style={styles.productIcon}>📱</Text>
                  <Text style={styles.productName}>Mobile Applications</Text>
                </View>
                <View style={styles.productCard}>
                  <Text style={styles.productIcon}>🌐</Text>
                  <Text style={styles.productName}>Web Applications</Text>
                </View>
              </View>
            </View>

            {/* Our Mission */}
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Our Mission</Text>
              <Text style={styles.paragraph}>
                Our mission is to empower individuals and businesses by providing a seamless platform for collaboration and growth. We strive to create a marketplace where talent meets opportunity, fostering innovation and driving positive change in the tech landscape.
              </Text>
              <Text style={styles.paragraph}>
                Through our comprehensive ecosystem of internships, products, and custom projects, we're building bridges between ambitious professionals and forward-thinking organizations.
              </Text>
            </View>

            {/* Stats Section */}
            <View style={styles.statsSection}>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>500+</Text>
                  <Text style={styles.statLabel}>Active Internships</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1000+</Text>
                  <Text style={styles.statLabel}>Products Delivered</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50+</Text>
                  <Text style={styles.statLabel}>Team Members</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>98%</Text>
                  <Text style={styles.statLabel}>Client Satisfaction</Text>
                </View>
              </View>
            </View>

            {/* Our Team */}
            <View style={styles.block}>
              <Text style={[styles.blockTitle, styles.blockTitleCenter]}>Our Dynamic Team</Text>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop&auto=format',
                }}
                style={styles.teamImage}
                defaultSource={require('../../assets/icon.png')}
                onError={(error) => {
                  console.log('Team image error:', error);
                }}
              />
              <Text style={[styles.paragraph, { textAlign: 'center', marginBottom: 32 }]}>
                Our team is a diverse group of talented professionals who bring creativity, expertise, and passion to every project. Together, we work collaboratively to deliver exceptional results.
              </Text>
              <View style={styles.teamGrid}>
                {teamMembers.map((member) => (
                  <View key={member.id} style={styles.teamCard}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarEmoji}>
                        {member.avatar === 'mohit' ? '👨‍💻' : member.avatar === 'yogesh' ? '👨‍💻' : '👨‍💼'}
                      </Text>
                    </View>
                    <Text style={styles.teamName}>{member.name}</Text>
                    <Text style={styles.teamRole}>{member.role}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Our Values */}
            <View style={styles.block}>
              <Text style={[styles.blockTitle, styles.blockTitleCenter]}>Our Values</Text>
              <View style={styles.valuesGrid}>
                {values.map((value) => (
                  <View key={value.id} style={styles.valueColumn}>
                    <View style={styles.valueCard}>
                      <View style={styles.valueIconWrapper}>
                        <Text style={styles.valueIcon}>
                          {value.icon === 'lightbulb' ? '💡' : value.icon === 'checkmark' ? '✓' : value.icon === 'people' ? '👥' : '❤️'}
                        </Text>
                      </View>
                      <Text style={styles.valueTitle}>{value.title}</Text>
                      <Text style={styles.valueDescription}>{value.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Contact Section */}
            <View style={styles.block}>
              <Text style={[styles.blockTitle, styles.blockTitleCenter]}>Get in Touch</Text>
              <View style={styles.contactGrid}>
                <View style={styles.contactCard}>
                  <Text style={styles.contactIcon}>📧</Text>
                  <Text style={styles.contactTitle}>Email Us</Text>
                  <Text style={styles.contactText}>contact@ekions.com</Text>
                </View>
                <View style={styles.contactCard}>
                  <Text style={styles.contactIcon}>📞</Text>
                  <Text style={styles.contactTitle}>Call Us</Text>
                  <Text style={styles.contactText}>+91 6203802704</Text>
                </View>
                <View style={styles.contactCard}>
                  <Text style={styles.contactIcon}>📍</Text>
                  <Text style={styles.contactTitle}>Visit Us</Text>
                  <Text style={styles.contactText}>D13, Satej Homes</Text>
                  <Text style={styles.contactText}>Ahmedabad, Gujarat</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Footer navigation={navigation} />
      </ScrollView>
    </View>
  );
};

