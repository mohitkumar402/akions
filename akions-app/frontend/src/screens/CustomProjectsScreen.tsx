import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Navbar } from '../components/Navbar';

export const CustomProjectsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Custom Projects</Text>
          <Text style={styles.subtitle}>
            Collaborate with experts to develop custom solutions tailored to your specific requirements.
          </Text>

          <View style={styles.inner}>
            {/* Description */}
            <View style={[styles.card, styles.mb32]}>
              <Text style={styles.cardTitle}>What We Offer</Text>
              <Text style={styles.paragraph}>
                Our custom projects service connects you with experienced developers, designers, and consultants who can
                bring your vision to life. Whether you need a custom web application, mobile app, or enterprise solution,
                we have the expertise to deliver.
              </Text>
              <Text style={styles.paragraph}>
                We work closely with you throughout the entire project lifecycle, from initial planning and design to
                development and deployment, ensuring your project meets your exact specifications and business goals.
              </Text>
            </View>

            {/* Process */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Our Process</Text>

              <View style={styles.steps}>
                <View style={styles.stepRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Discovery</Text>
                    <Text style={styles.stepText}>We start by understanding your requirements, goals, and constraints.</Text>
                  </View>
                </View>

                <View style={styles.stepRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Planning</Text>
                    <Text style={styles.stepText}>We create a detailed project plan with timelines, milestones, and deliverables.</Text>
                  </View>
                </View>

                <View style={styles.stepRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Development</Text>
                    <Text style={styles.stepText}>Our team builds your solution using best practices and modern technologies.</Text>
                  </View>
                </View>

                <View style={[styles.stepRow, styles.mb0]}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>4</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Delivery</Text>
                    <Text style={styles.stepText}>We deploy your project and provide ongoing support and maintenance.</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  wrapper: { paddingVertical: 32, paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#111827', marginBottom: 16 },
  subtitle: { color: '#4b5563', marginBottom: 32 },
  inner: { width: '100%', maxWidth: 1024, alignSelf: 'center' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  mb32: { marginBottom: 32 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 16 },
  paragraph: { color: '#374151', lineHeight: 24, marginBottom: 16 },
  steps: { marginTop: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  mb0: { marginBottom: 0 },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepBadgeText: { color: '#ffffff', fontWeight: '700' },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  stepText: { color: '#4b5563' },
});
