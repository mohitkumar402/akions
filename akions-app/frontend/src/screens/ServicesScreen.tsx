import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Navbar } from '../components/Navbar';

// Create styles function that uses SCREEN_WIDTH
const createStyles = (screenWidth: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  inner: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#9ca3af',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 24,
  },
  servicesGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 64,
  },
  serviceCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? '31%' : screenWidth > 768 ? '48%' : '100%') : '100%',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 32,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    lineHeight: 20,
  },
  servicesList: {
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceBullet: {
    color: '#2563eb',
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  serviceItemText: {
    flex: 1,
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 32,
    paddingTop: 48,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  infoTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 32,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
  },
  infoCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 24,
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? '23%' : screenWidth > 768 ? '48%' : '100%') : '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  infoIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoCardText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  customProductButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 32,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    }),
  },
  customProductButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export const ServicesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const styles = createStyles(SCREEN_WIDTH);
  
  const services = [
    {
      id: '1',
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications',
      services: [
        'Flutter App Development',
        'Android Native Development',
        'iOS Development',
        'React Native Apps',
      ],
      route: 'Marketplace',
    },
    {
      id: '2',
      icon: '🌐',
      title: 'Web Application Development',
      description: 'Modern, responsive web applications',
      services: [
        'React Web Applications',
        'Vue.js Development',
        'Angular Applications',
        'Full-Stack Solutions',
      ],
      route: 'Marketplace',
    },
    {
      id: '3',
      icon: '⚙️',
      title: 'Backend Development',
      description: 'Scalable backend systems and APIs',
      services: [
        'Node.js Backend',
        'RESTful APIs',
        'GraphQL Services',
        'Microservices Architecture',
      ],
      route: 'Marketplace',
    },
    {
      id: '4',
      icon: '☁️',
      title: 'Hosting & Infrastructure',
      description: 'Cloud hosting and deployment solutions',
      services: [
        'AWS Cloud Hosting',
        'Azure Deployment',
        'GCP Setup',
        'DevOps & CI/CD',
      ],
      route: 'Marketplace',
    },
    {
      id: '5',
      icon: '🏢',
      title: 'Enterprise Solutions',
      description: 'Enterprise-grade software solutions',
      services: [
        'Enterprise Software',
        'Custom Backend Systems',
        'Enterprise Mobile Apps',
        'Scalable Architecture',
      ],
      route: 'Marketplace',
    },
    {
      id: '6',
      icon: '🎓',
      title: 'Teaching & Training',
      description: 'Comprehensive development courses',
      services: [
        'Flutter Development Course',
        'Android Development Masterclass',
        'Web Development Bootcamp',
        'Backend Development Training',
      ],
      route: 'Marketplace',
    },
  ];

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <Text style={styles.title}>Our Services</Text>
          <Text style={styles.subtitle}>
            Comprehensive software development, hosting, and training solutions
          </Text>

          <TouchableOpacity
            style={styles.customProductButton}
            onPress={() => navigation.navigate('CustomProductRequest')}
          >
            <Text style={styles.customProductButtonText}>Need Custom Product? Reach to Us</Text>
          </TouchableOpacity>

          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>{service.icon}</Text>
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <View style={styles.servicesList}>
                  {service.services.map((item, index) => (
                    <View key={index} style={styles.serviceItem}>
                      <Text style={styles.serviceBullet}>•</Text>
                      <Text style={styles.serviceItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={() => navigation.navigate(service.route)}
                >
                  <Text style={styles.exploreButtonText}>Explore Services</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Additional Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Why Choose Ekions?</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>🚀</Text>
                <Text style={styles.infoCardTitle}>Expert Team</Text>
                <Text style={styles.infoCardText}>
                  Experienced developers with expertise in modern technologies
                </Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>⚡</Text>
                <Text style={styles.infoCardTitle}>Fast Delivery</Text>
                <Text style={styles.infoCardText}>
                  Agile development process ensuring timely project completion
                </Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>🔒</Text>
                <Text style={styles.infoCardTitle}>Secure & Scalable</Text>
                <Text style={styles.infoCardText}>
                  Enterprise-grade security and scalable architecture
                </Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>💼</Text>
                <Text style={styles.infoCardTitle}>Enterprise Ready</Text>
                <Text style={styles.infoCardText}>
                  Solutions designed for enterprise-level requirements
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

