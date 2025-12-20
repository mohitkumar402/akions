import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Dimensions, Image } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const createStyles = (screenWidth: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  twoPanelContainer: {
    flexDirection: screenWidth < 768 ? 'column' : 'row',
    gap: screenWidth < 768 ? 24 : 32,
    alignItems: screenWidth < 768 ? 'stretch' : 'center',
    marginBottom: Platform.OS === 'web' ? 96 : 64,
  },
  leftPanel: {
    flex: screenWidth < 768 ? 1 : 0.5,
    width: screenWidth < 768 ? '100%' : '50%',
    backgroundColor: '#232B38',
    borderRadius: 16,
    padding: screenWidth < 768 ? 24 : 40,
    borderWidth: 1,
    borderColor: '#374151',
  },
  rightPanel: {
    flex: screenWidth < 768 ? 1 : 0.5,
    width: screenWidth < 768 ? '100%' : '50%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  rightPanelImage: {
    width: '100%',
    height: screenWidth < 768 ? 300 : Platform.OS === 'web' ? 500 : 400,
    resizeMode: 'cover',
  },
  rightPanelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: screenWidth < 768 ? 24 : 40,
  },
  mainTitle: {
    fontSize: screenWidth < 768 ? 32 : screenWidth > 1024 ? 48 : 40,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: screenWidth < 768 ? 40 : 56,
  },
  subtitle: {
    fontSize: screenWidth < 768 ? 18 : 20,
    fontWeight: '600',
    color: '#6495ED',
    marginBottom: 20,
  },
  description: {
    fontSize: screenWidth < 768 ? 14 : 16,
    color: '#d1d5db',
    lineHeight: screenWidth < 768 ? 22 : 26,
    marginBottom: 32,
  },
  learnMoreButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  learnMoreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  overlayTitle: {
    fontSize: screenWidth < 768 ? 32 : screenWidth > 1024 ? 48 : 40,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: screenWidth < 768 ? 40 : 56,
  },
  overlaySubtitle: {
    fontSize: screenWidth < 768 ? 18 : 20,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: screenWidth < 768 ? 26 : 28,
  },
});

export const BlogScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const styles = createStyles(SCREEN_WIDTH);

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionInner}>
            {/* Two-Panel Layout */}
            <View style={styles.twoPanelContainer}>
              {/* Left Panel - Content Box */}
              <View style={styles.leftPanel}>
                <Text style={styles.mainTitle}>About Our Vision</Text>
                <Text style={styles.subtitle}>Fostering a culture of collaboration and creativity</Text>
                <Text style={styles.description}>
                  Ekions is dedicated to connecting businesses with top talent and innovative solutions. We believe in fostering a culture of collaboration and creativity, where every project becomes an opportunity for growth and excellence.
                </Text>
                <TouchableOpacity
                  style={styles.learnMoreButton}
                  onPress={() => navigation.navigate('ExploreBlog')}
                >
                  <Text style={styles.learnMoreButtonText}>Explore Blogs</Text>
                </TouchableOpacity>
              </View>

              {/* Right Panel - Image with Overlay */}
              <View style={styles.rightPanel}>
                <Image
                  source={require('../../assets/ekions blogs.png')}
                  style={styles.rightPanelImage}
                  resizeMode="cover"
                  fadeDuration={200}
                  onError={(error) => {
                    console.error('Blog screen image error:', error);
                  }}
                  onLoad={() => {
                    console.log('✅ Blog screen image loaded');
                  }}
                />
                <View style={styles.rightPanelOverlay}>
                  <Text style={styles.overlayTitle}>About Our Vision.</Text>
                  <Text style={styles.overlaySubtitle}>Fostering a culture of collaboration and creativity.</Text>
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
