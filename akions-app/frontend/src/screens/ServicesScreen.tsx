import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Navbar } from '../components/Navbar';
import { useHover } from '../hooks/useHover';

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
    paddingVertical: screenWidth < 768 ? 32 : 48,
    paddingHorizontal: screenWidth < 768 ? 16 : 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: screenWidth < 768 ? 28 : screenWidth < 1024 ? 40 : 48,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: screenWidth < 768 ? 12 : 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: screenWidth < 768 ? 14 : screenWidth < 1024 ? 16 : 18,
    color: '#9ca3af',
    marginBottom: screenWidth < 768 ? 32 : 48,
    textAlign: 'center',
    lineHeight: screenWidth < 768 ? 20 : 24,
    paddingHorizontal: screenWidth < 768 ? 8 : 0,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: screenWidth < 768 ? 'center' : 'space-between',
    gap: screenWidth < 768 ? 12 : 16,
    marginBottom: 48,
  },
  serviceCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: screenWidth < 768 ? 16 : 20,
    width: screenWidth < 768 ? '100%' : screenWidth < 1024 ? '48%' : '48%',
    maxWidth: screenWidth < 768 ? '100%' : 480,
    borderWidth: 1,
    borderColor: '#1f2937',
    minHeight: screenWidth < 768 ? 180 : 220,
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    }),
  },
  serviceCardHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#1a2332',
      borderColor: '#2563eb',
      borderWidth: 2,
      transform: [{ translateY: -8 }, { scale: 1.03 }],
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 12,
    }),
  },
  iconContainer: {
    width: screenWidth < 768 ? 52 : 64,
    height: screenWidth < 768 ? 52 : 64,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenWidth < 768 ? 12 : 16,
    position: 'relative',
    ...(Platform.OS === 'web' && {
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    }),
  },
  iconContainerHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#2563eb',
      transform: [{ scale: 1.15 }, { rotate: '8deg' }],
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
    }),
  },
  iconText: {
    fontSize: screenWidth < 768 ? 26 : 32,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    }),
  },
  serviceTitle: {
    fontSize: screenWidth < 768 ? 18 : 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: screenWidth < 768 ? 8 : 10,
    lineHeight: screenWidth < 768 ? 24 : 28,
    ...(Platform.OS === 'web' && {
      transition: 'color 0.3s ease',
    }),
  },
  serviceTitleHovered: {
    ...(Platform.OS === 'web' && {
      color: '#60a5fa',
    }),
  },
  serviceDescription: {
    fontSize: screenWidth < 768 ? 13 : 14,
    color: '#9ca3af',
    marginBottom: screenWidth < 768 ? 12 : 14,
    lineHeight: screenWidth < 768 ? 18 : 20,
  },
  servicesList: {
    marginBottom: screenWidth < 768 ? 12 : 16,
    flex: 1,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: screenWidth < 768 ? 5 : 6,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s ease',
    }),
  },
  serviceItemHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ translateX: 4 }],
    }),
  },
  serviceBullet: {
    color: '#2563eb',
    fontSize: screenWidth < 768 ? 14 : 16,
    marginRight: 8,
    marginTop: 2,
    fontWeight: '700',
  },
  serviceItemText: {
    flex: 1,
    fontSize: screenWidth < 768 ? 12 : 13,
    color: '#d1d5db',
    lineHeight: screenWidth < 768 ? 18 : 20,
    ...(Platform.OS === 'web' && {
      transition: 'color 0.2s ease',
    }),
  },
  serviceItemTextHovered: {
    ...(Platform.OS === 'web' && {
      color: '#ffffff',
    }),
  },
  exploreButton: {
    backgroundColor: '#2563eb',
    paddingVertical: screenWidth < 768 ? 10 : 12,
    paddingHorizontal: screenWidth < 768 ? 16 : 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 'auto',
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    }),
  },
  exploreButtonHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#1d4ed8',
      transform: [{ scale: 1.08 }, { translateY: -2 }],
      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
    }),
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: screenWidth < 768 ? 13 : 14,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: screenWidth < 768 ? 'center' : 'space-between',
    gap: screenWidth < 768 ? 12 : 16,
  },
  infoCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: screenWidth < 768 ? 16 : 20,
    width: screenWidth < 768 ? '100%' : screenWidth < 1024 ? '48%' : '48%',
    maxWidth: screenWidth < 768 ? '100%' : 480,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f2937',
    minHeight: screenWidth < 768 ? 160 : 180,
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    }),
  },
  infoCardHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#1a2332',
      borderColor: '#2563eb',
      borderWidth: 2,
      transform: [{ translateY: -6 }, { scale: 1.03 }],
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 12,
    }),
  },
  infoIcon: {
    fontSize: screenWidth < 768 ? 32 : 40,
    marginBottom: screenWidth < 768 ? 12 : 16,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    }),
  },
  infoIconHovered: {
    ...(Platform.OS === 'web' && {
      transform: [{ scale: 1.2 }, { rotate: '10deg' }],
    }),
  },
  infoCardTitle: {
    fontSize: screenWidth < 768 ? 16 : 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: screenWidth < 768 ? 6 : 8,
    textAlign: 'center',
  },
  infoCardText: {
    fontSize: screenWidth < 768 ? 12 : 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: screenWidth < 768 ? 18 : 20,
    paddingHorizontal: screenWidth < 768 ? 8 : 0,
  },
  customProductButton: {
    backgroundColor: '#2563eb',
    paddingVertical: screenWidth < 768 ? 12 : 16,
    paddingHorizontal: screenWidth < 768 ? 24 : 32,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: screenWidth < 768 ? 24 : 32,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    }),
  },
  customProductButtonHovered: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#1d4ed8',
      transform: [{ scale: 1.05 }],
      boxShadow: '0 8px 16px rgba(37, 99, 235, 0.4)',
    }),
  },
  customProductButtonText: {
    color: '#ffffff',
    fontSize: screenWidth < 768 ? 14 : 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

// Service Card Component with Enhanced Hover Effect
const ServiceCard: React.FC<{ service: any; navigation: any; styles: any }> = ({ service, navigation, styles }) => {
  const { isHovered, hoverProps } = useHover();
  const { isHovered: iconHovered, hoverProps: iconHoverProps } = useHover();
  const { isHovered: buttonHovered, hoverProps: buttonHoverProps } = useHover();

  return (
    <TouchableOpacity
      style={[
        styles.serviceCard,
        isHovered && styles.serviceCardHovered,
      ]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate(service.route)}
      {...hoverProps}
    >
      <View
        style={[
          styles.iconContainer,
          (iconHovered || isHovered) && styles.iconContainerHovered,
        ]}
        {...iconHoverProps}
      >
        <Text style={styles.iconText}>{service.icon}</Text>
      </View>
      <Text style={[
        styles.serviceTitle,
        isHovered && styles.serviceTitleHovered,
      ]}>
        {service.title}
      </Text>
      <Text style={styles.serviceDescription}>{service.description}</Text>
      <View style={styles.servicesList}>
        {service.services.map((item: string, index: number) => (
          <View 
            key={index} 
            style={[
              styles.serviceItem,
              isHovered && styles.serviceItemHovered,
            ]}
          >
            <Text style={styles.serviceBullet}>•</Text>
            <Text style={[
              styles.serviceItemText,
              isHovered && styles.serviceItemTextHovered,
            ]}>
              {item}
            </Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.exploreButton,
          (buttonHovered || isHovered) && styles.exploreButtonHovered,
        ]}
        onPress={() => navigation.navigate(service.route)}
        activeOpacity={0.8}
        {...buttonHoverProps}
      >
        <Text style={styles.exploreButtonText}>Explore Services</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Info Card Component with Hover Effect
const InfoCard: React.FC<{ info: any; styles: any }> = ({ info, styles }) => {
  const { isHovered, hoverProps } = useHover();
  const { isHovered: iconHovered, hoverProps: iconHoverProps } = useHover();

  return (
    <View
      style={[
        styles.infoCard,
        isHovered && styles.infoCardHovered,
      ]}
      {...hoverProps}
    >
      <Text
        style={[
          styles.infoIcon,
          iconHovered && styles.infoIconHovered,
        ]}
        {...iconHoverProps}
      >
        {info.icon}
      </Text>
      <Text style={styles.infoCardTitle}>{info.title}</Text>
      <Text style={styles.infoCardText}>{info.text}</Text>
    </View>
  );
};

export const ServicesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const styles = createStyles(SCREEN_WIDTH);
  const { isHovered, hoverProps } = useHover();
  
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
            style={[
              styles.customProductButton,
              isHovered && styles.customProductButtonHovered,
            ]}
            onPress={() => navigation.navigate('CustomProductRequest')}
            activeOpacity={0.8}
            {...hoverProps}
          >
            <Text style={styles.customProductButtonText}>Need Custom Product? Reach to Us</Text>
          </TouchableOpacity>

          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                navigation={navigation}
                styles={styles}
              />
            ))}
          </View>

          {/* Additional Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Why Choose Ekions?</Text>
            <View style={styles.infoGrid}>
              {[
                { icon: '🚀', title: 'Expert Team', text: 'Experienced developers with expertise in modern technologies' },
                { icon: '⚡', title: 'Fast Delivery', text: 'Agile development process ensuring timely project completion' },
                { icon: '🔒', title: 'Secure & Scalable', text: 'Enterprise-grade security and scalable architecture' },
                { icon: '💼', title: 'Enterprise Ready', text: 'Solutions designed for enterprise-level requirements' },
              ].map((info, index) => (
                <InfoCard key={index} info={info} styles={styles} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

