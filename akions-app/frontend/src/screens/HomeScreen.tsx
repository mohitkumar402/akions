import React, { useEffect, useRef, useState, useMemo, lazy, Suspense } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Animated, Dimensions, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Card } from '../components/Card';
import { Product, BlogPost, Internship } from '../types';
import { API_URL, API_BASE as SERVER_BASE } from '../config/api';
import { useTheme } from '../context/ThemeContext';

const API_BASE = API_URL;

// Create styles function that uses SCREEN_WIDTH and SCREEN_HEIGHT
const createStyles = (screenWidth: number, screenHeight: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  carouselContainer: {
    width: '100%',
    height: Platform.OS === 'web' 
      ? (screenWidth > 1440 ? 600 : screenWidth > 1024 ? 550 : screenWidth > 768 ? 500 : 450)
      : (screenWidth < 480 ? screenHeight * 0.4 : screenWidth < 768 ? screenHeight * 0.45 : screenHeight * 0.5),
    minHeight: Platform.OS === 'web' 
      ? (screenWidth > 1024 ? 550 : screenWidth > 768 ? 450 : 400)
      : (screenWidth < 480 ? 250 : screenWidth < 768 ? 300 : 350),
    maxHeight: Platform.OS === 'web' ? 600 : screenHeight * 0.6,
    backgroundColor: '#000000',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  carouselFlatList: {
    width: '100%',
    height: '100%',
  },
  carouselItem: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageWrapper: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  carouselImage: {
    width: screenWidth,
    height: '100%',
    zIndex: 0,
    backgroundColor: '#1a1a1a',
    flex: 1,
  } as const,
  carouselImagePlaceholder: {
    width: screenWidth,
    height: '100%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: screenWidth < 768 ? 16 : screenWidth < 1024 ? 24 : 32,
    paddingVertical: screenWidth < 768 ? 20 : 32,
    zIndex: 1,
  },
  carouselContent: {
    maxWidth: 1200,
    width: '100%',
    alignItems: screenWidth < 768 ? 'flex-start' : 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: screenWidth < 768 ? 12 : 20,
  },
  carouselTitle: {
    fontSize: screenWidth < 480 ? 28 : screenWidth < 768 ? 32 : screenWidth < 1024 ? 40 : screenWidth > 1440 ? 56 : 48,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: screenWidth < 768 ? 'left' : 'center',
    marginBottom: screenWidth < 768 ? 12 : 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    lineHeight: screenWidth < 768 ? 36 : screenWidth < 1024 ? 48 : 56,
  },
  carouselDescription: {
    fontSize: screenWidth < 480 ? 14 : screenWidth < 768 ? 15 : screenWidth < 1024 ? 16 : 18,
    color: '#ffffff',
    textAlign: screenWidth < 768 ? 'left' : 'center',
    lineHeight: screenWidth < 768 ? 20 : 24,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    maxWidth: screenWidth < 768 ? '100%' : 800,
    backgroundColor: screenWidth < 768 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
    padding: screenWidth < 768 ? 12 : 16,
    borderRadius: screenWidth < 768 ? 8 : 12,
    marginTop: screenWidth < 768 ? 8 : 12,
  },
  carouselIndicators: {
    position: 'absolute',
    bottom: screenWidth < 768 ? 12 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: screenWidth < 768 ? 6 : 8,
    zIndex: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#ffffff',
  },
  scrollDownIndicator: {
    position: 'absolute',
    bottom: screenWidth < 768 ? 50 : 60,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  scrollDownText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scrollDownArrow: {
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#ffffff',
    transform: [{ rotate: '-45deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  verticalsSection: {
    paddingVertical: Platform.OS === 'web' ? 40 : (screenWidth < 768 ? 24 : 32),
    paddingHorizontal: Platform.OS === 'web' ? 32 : (screenWidth < 768 ? 16 : 20),
    width: '100%',
    paddingTop: Platform.OS === 'web' ? 40 : (screenWidth < 768 ? 20 : 28),
    minHeight: Platform.OS === 'web' ? 400 : 380,
  },
  verticalsContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 1024 ? 32 : screenWidth > 768 ? 28 : 24) : 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 768 ? 18 : 16) : 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: screenWidth < 768 ? 24 : 32,
    maxWidth: 700,
    lineHeight: 24,
  },
  verticalsGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 16,
    width: '100%',
  },
  verticalsGridMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  cardWrapper: {
    flex: Platform.OS === 'web' ? (screenWidth > 1024 ? 0 : 1) : 1,
    minWidth: Platform.OS === 'web' ? (screenWidth > 1024 ? 320 : '100%') : '100%',
    maxWidth: Platform.OS === 'web' ? (screenWidth > 1024 ? 380 : 500) : '100%',
  },
  cardWrapperTablet: {
    flex: 1,
    minWidth: 280,
    maxWidth: 350,
  },
  cardWrapperMobile: {
    width: '100%',
    maxWidth: '100%',
  },
  verticalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 768 ? 24 : 20) : 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 768 ? 16 : 14) : 14,
    color: '#6b7280',
    lineHeight: 24,
  },
  allCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 16,
    width: '100%',
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: Platform.OS === 'web' ? 20 : 16,
    minHeight: Platform.OS === 'web' ? 320 : 300,
  },
  allCardsWrapper: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? (screenWidth > 1024 ? 280 : screenWidth > 768 ? 240 : 180) : 160,
    maxWidth: Platform.OS === 'web' ? (screenWidth > 1024 ? 350 : screenWidth > 768 ? 300 : 250) : 250,
    height: Platform.OS === 'web' ? 320 : 300,
    minHeight: Platform.OS === 'web' ? 320 : 300,
  },
  rotatingCardContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  rotatingCardWrapper: {
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? 500 : screenWidth > 768 ? 450 : '85%') : '85%',
    maxWidth: 500,
    height: Platform.OS === 'web' ? 300 : 280,
  },
  rotatingCard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 28 : 20,
    minHeight: Platform.OS === 'web' ? 320 : 300,
  },
  cardColor1: {
    backgroundColor: '#1e3a8a', // Blue for Internships
  },
  cardColor2: {
    backgroundColor: '#7c3aed', // Purple for Product Marketplace
  },
  cardColor3: {
    backgroundColor: '#059669', // Green for Custom Projects
  },
  rotatingCardContent: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  rotatingIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  rotatingIndicatorWrapper: {
    padding: 4,
  },
  rotatingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4b5563',
  },
  rotatingIndicatorActive: {
    width: 24,
    backgroundColor: '#2563eb',
  },
  staticIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  staticIconText: {
    fontSize: 24,
  },
  staticCardTitle: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 768 ? 20 : 18) : 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  staticCardDescription: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 768 ? 14 : 12) : 12,
    color: '#6b7280',
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#000000',
    paddingVertical: 48,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  footerContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: Platform.OS === 'web' ? 'space-around' : 'center',
    marginBottom: 32,
    gap: Platform.OS === 'web' ? 24 : 16,
  },
  footerLink: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 8,
  },
  copyright: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
  },
  previewSection: {
    paddingVertical: Platform.OS === 'web' ? 40 : (screenWidth < 768 ? 24 : 32),
    paddingHorizontal: Platform.OS === 'web' ? 32 : (screenWidth < 768 ? 16 : 20),
    backgroundColor: '#f9fafb',
    paddingTop: Platform.OS === 'web' ? 40 : (screenWidth < 768 ? 20 : 28),
  },
  previewContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenWidth < 768 ? 16 : 24,
  },
  previewTitle: {
    fontSize: Platform.OS === 'web' ? (screenWidth > 1024 ? 32 : screenWidth > 768 ? 28 : 24) : 24,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  viewAllButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewAllText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  previewGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center',
  },
  previewCard: {
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? '23%' : screenWidth > 768 ? '31%' : '48%') : '100%',
    maxWidth: 300,
  },
  aboutPreview: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  aboutPreviewText: {
    color: '#4b5563',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    lineHeight: Platform.OS === 'web' ? 26 : 22,
    marginBottom: 20,
  },
  servicesPreview: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 24,
  },
  servicePreviewItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    ...(Platform.OS === 'web' 
      ? { width: screenWidth > 1024 ? '23%' : screenWidth > 768 ? '31%' : '48%' }
      : { flex: 1 }
    ),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  servicePreviewIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  servicePreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  servicePreviewDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  blogCardContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: Platform.OS === 'web' ? 0 : 24,
    borderWidth: 1,
    borderColor: '#334155',
    width: Platform.OS === 'web' ? (screenWidth > 1024 ? '23%' : screenWidth > 768 ? '48%' : '100%') : '100%',
  },
  blogCardContent: {
    width: '100%',
  },
  blogImageContainer: {
    width: '100%',
    height: Platform.OS === 'web' ? 200 : 180,
    backgroundColor: '#232B38',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  blogCardTextContent: {
    padding: 20,
  },
  blogCardTitle: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 24,
  },
  blogCardExcerpt: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 16,
  },
  blogMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  blogCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  blogStatText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    marginLeft: 4,
  },
  blogStats: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  blogStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productMeta: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#60a5fa',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productRatingText: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: '600',
  },
  imageSection: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    marginTop: screenWidth < 768 ? -8 : 0,
    marginBottom: screenWidth < 768 ? 16 : 24,
  },
  imageSectionImage: {
    width: '100%',
    height: Platform.OS === 'web' 
      ? (screenWidth > 1440 ? 450 : screenWidth > 1024 ? 400 : screenWidth > 768 ? 350 : 300)
      : (screenWidth < 480 ? 200 : screenWidth < 768 ? 250 : 300),
    resizeMode: 'cover',
    backgroundColor: '#1a1a1a',
  },
  aboutUsSection: {
    width: '100%',
    paddingVertical: Platform.OS === 'web' ? 60 : (screenWidth < 768 ? 32 : 48),
    paddingHorizontal: Platform.OS === 'web' ? 32 : (screenWidth < 768 ? 16 : 24),
    backgroundColor: '#f9fafb',
  },
  aboutUsContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: screenWidth < 768 ? 'column' : 'row',
    gap: screenWidth < 768 ? 24 : 32,
    alignItems: screenWidth < 768 ? 'stretch' : 'center',
  },
  aboutUsImageContainer: {
    flex: screenWidth < 768 ? 1 : 0.45,
    width: screenWidth < 768 ? '100%' : '45%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  aboutUsImage: {
    width: '100%',
    height: screenWidth < 768 ? 250 : Platform.OS === 'web' ? 400 : 300,
    resizeMode: 'cover',
  },
  aboutUsTextContainer: {
    flex: screenWidth < 768 ? 1 : 0.55,
    width: screenWidth < 768 ? '100%' : '55%',
    padding: screenWidth < 768 ? 20 : 32,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  aboutUsTitle: {
    fontSize: screenWidth < 768 ? 28 : screenWidth > 1024 ? 36 : 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    lineHeight: screenWidth < 768 ? 36 : 44,
  },
  aboutUsSubtitle: {
    fontSize: screenWidth < 768 ? 18 : 20,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 16,
  },
  aboutUsDescription: {
    fontSize: screenWidth < 768 ? 14 : 16,
    color: '#4b5563',
    lineHeight: screenWidth < 768 ? 22 : 26,
    marginBottom: 24,
  },
  aboutUsButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  aboutUsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageSectionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: screenWidth < 768 ? 16 : 24,
    paddingVertical: screenWidth < 768 ? 20 : 32,
    paddingTop: screenWidth < 768 ? 40 : 60,
    zIndex: 1,
  },
  imageSectionContent: {
    maxWidth: 1200,
    width: '100%',
    alignItems: 'center',
  },
  imageSectionTitle: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  imageSectionButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  imageSectionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  workWithUsSection: {
    width: '100%',
    paddingVertical: Platform.OS === 'web' ? 60 : (screenWidth < 768 ? 32 : 48),
    paddingHorizontal: Platform.OS === 'web' ? 32 : (screenWidth < 768 ? 16 : 24),
    backgroundColor: '#f3f4f6',
  },
  workWithUsContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: screenWidth < 768 ? 'column' : 'row',
    gap: screenWidth < 768 ? 24 : 32,
    alignItems: screenWidth < 768 ? 'stretch' : 'center',
  },
  workWithUsImageContainer: {
    flex: screenWidth < 768 ? 1 : 0.45,
    width: screenWidth < 768 ? '100%' : '45%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  workWithUsImage: {
    width: '100%',
    height: screenWidth < 768 ? 250 : Platform.OS === 'web' ? 400 : 300,
    resizeMode: 'cover',
  },
  workWithUsTextContainer: {
    flex: screenWidth < 768 ? 1 : 0.55,
    width: screenWidth < 768 ? '100%' : '55%',
    padding: screenWidth < 768 ? 20 : 32,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  workWithUsTitle: {
    fontSize: screenWidth < 768 ? 28 : screenWidth > 1024 ? 36 : 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    lineHeight: screenWidth < 768 ? 36 : 44,
  },
  workWithUsSubtitle: {
    fontSize: screenWidth < 768 ? 18 : 20,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 16,
  },
  workWithUsDescription: {
    fontSize: screenWidth < 768 ? 14 : 16,
    color: '#4b5563',
    lineHeight: screenWidth < 768 ? 22 : 26,
    marginBottom: 24,
  },
  workWithUsButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  workWithUsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
  const { theme, siteSettings } = useTheme();
  const styles = createStyles(SCREEN_WIDTH, SCREEN_HEIGHT);
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const scrollDownAnim = useRef(new Animated.Value(0)).current;
  // All products from seedProducts.js
  const manualFeaturedProducts: Product[] = useMemo(() => [
    // Software Products
    {
      id: '1',
      title: 'Project Management Tool',
      description: 'Streamline your projects with this intuitive tool.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      category: 'Productivity',
      price: 2999,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'E-commerce Platform',
      description: 'Launch your online store with this powerful platform.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      category: 'E-commerce',
      price: 4999,
      rating: 4.6,
    },
    {
      id: '3',
      title: 'Customer Relationship Manager',
      description: 'Manage customer interactions effectively.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      category: 'Business',
      price: 3999,
      rating: 4.7,
    },
    {
      id: '4',
      title: 'Data Analytics Dashboard',
      description: 'Visualize and analyze your data with ease.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      category: 'Analytics',
      price: 4499,
      rating: 4.9,
    },
    {
      id: '5',
      title: 'Social Media Scheduler',
      description: 'Schedule and manage your social media posts.',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      category: 'Marketing',
      price: 1999,
      rating: 4.5,
    },
    // Teaching & Training Products
    {
      id: '6',
      title: 'Flutter App Development Course',
      description: 'Complete Flutter development course with hands-on projects and real-world examples.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      category: 'Teaching',
      price: 4999,
      rating: 4.9,
    },
    {
      id: '7',
      title: 'Android Development Masterclass',
      description: 'Learn Android app development from basics to advanced topics with Kotlin and Java.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      category: 'Teaching',
      price: 5999,
      rating: 4.8,
    },
    {
      id: '8',
      title: 'Web Application Development Bootcamp',
      description: 'Full-stack web development course covering React, Node.js, and modern frameworks.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      category: 'Teaching',
      price: 6999,
      rating: 4.9,
    },
    {
      id: '9',
      title: 'Backend Development with Node.js',
      description: 'Master backend development, APIs, databases, and server architecture.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      category: 'Teaching',
      price: 5499,
      rating: 4.7,
    },
    // Software Development Services
    {
      id: '10',
      title: 'Flutter Mobile App Development',
      description: 'Professional Flutter app development for iOS and Android. Cross-platform solutions.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      category: 'Software Development',
      price: 50000,
      rating: 4.9,
    },
    {
      id: '11',
      title: 'Android Native App Development',
      description: 'Custom Android applications built with Kotlin/Java. Enterprise-grade solutions.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      category: 'Software Development',
      price: 60000,
      rating: 4.8,
    },
    {
      id: '12',
      title: 'Web Application Development',
      description: 'Modern web applications with React, Vue, or Angular. Responsive and scalable.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      category: 'Software Development',
      price: 45000,
      rating: 4.9,
    },
    {
      id: '13',
      title: 'Enterprise Backend Development',
      description: 'Scalable backend systems with microservices architecture. Cloud-ready solutions.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      category: 'Software Development',
      price: 100000,
      rating: 5.0,
    },
    // Hosting & Infrastructure
    {
      id: '14',
      title: 'Cloud Hosting & Deployment',
      description: 'Professional hosting setup on AWS, Azure, or GCP. CI/CD pipeline included.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      category: 'Hosting',
      price: 15000,
      rating: 4.8,
    },
    {
      id: '15',
      title: 'Enterprise Server Management',
      description: 'Dedicated server management, monitoring, and maintenance. 24/7 support.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      category: 'Hosting',
      price: 25000,
      rating: 4.9,
    },
    {
      id: '16',
      title: 'DevOps & Infrastructure Setup',
      description: 'Complete DevOps pipeline with Docker, Kubernetes, and automated deployments.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      category: 'Hosting',
      price: 35000,
      rating: 4.9,
    },
    // Enterprise Solutions
    {
      id: '17',
      title: 'Enterprise Software Solutions',
      description: 'Custom enterprise software tailored to your business needs. Scalable and secure.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      category: 'Enterprise',
      price: 200000,
      rating: 5.0,
    },
    {
      id: '18',
      title: 'Enterprise Backend Architecture',
      description: 'Design and implement enterprise-grade backend systems with best practices.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      category: 'Enterprise',
      price: 150000,
      rating: 5.0,
    },
    {
      id: '19',
      title: 'Enterprise Mobile Solutions',
      description: 'Enterprise mobile applications with security, scalability, and compliance.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      category: 'Enterprise',
      price: 120000,
      rating: 4.9,
    },
  ], []);

  const manualLatestBlogs: BlogPost[] = useMemo(() => [
    {
      id: '1',
      title: '10 Mind-Blowing Facts About Artificial Intelligence',
      excerpt: 'Discover fascinating insights about AI that will change how you see technology forever.',
      content: `# 10 Mind-Blowing Facts About Artificial Intelligence

Artificial Intelligence has revolutionized the world in ways we never imagined. Here are some incredible facts that will blow your mind:

## 1. AI Can Learn Faster Than Humans
Modern AI systems can process and learn from millions of data points in seconds, something that would take humans years to accomplish.

## 2. The First AI Program Was Created in 1951
Christopher Strachey wrote the first AI program for the Ferranti Mark I computer at the University of Manchester, creating a checkers-playing program.

## 3. AI Can Create Art
AI-generated art has been sold for over $400,000 at auctions, proving that creativity isn't exclusive to humans.

## 4. Your Phone Uses AI Every Day
From facial recognition to voice assistants, your smartphone uses AI technology constantly without you even realizing it.

## 5. AI Can Predict Diseases
Machine learning algorithms can now predict diseases like cancer and diabetes with higher accuracy than traditional methods.

## 6. The AI Market is Exploding
The global AI market is expected to reach $1.8 trillion by 2030, growing at an unprecedented rate.

## 7. AI Can Write Code
Advanced AI systems like GitHub Copilot can write entire programs, helping developers code faster and more efficiently.

## 8. Self-Driving Cars Use AI
Autonomous vehicles process over 4 terabytes of data per day using AI algorithms to navigate safely.

## 9. AI Can Detect Emotions
Facial recognition AI can now detect human emotions with 90%+ accuracy, revolutionizing marketing and healthcare.

## 10. The Future is AI-Powered
By 2025, it's estimated that 95% of customer interactions will be powered by AI technology.

The future of AI is bright, and we're just scratching the surface of what's possible!`,
      author: 'Ekions Team',
      publishedDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      category: 'Technology',
      likes: 125,
      shares: 45,
      comments: [],
      tags: ['AI', 'Technology', 'Future', 'Innovation'],
    },
    {
      id: '2',
      title: 'The Hidden World of Quantum Computing: 7 Fascinating Facts',
      excerpt: 'Explore the mysterious realm of quantum computing and discover why it\'s the future of computation.',
      content: `# The Hidden World of Quantum Computing: 7 Fascinating Facts

Quantum computing represents one of the most exciting frontiers in technology. Here's what makes it so fascinating:

## 1. Quantum Computers Use Qubits
Unlike classical bits that are either 0 or 1, quantum bits (qubits) can exist in multiple states simultaneously through superposition.

## 2. They Can Solve Problems in Minutes That Would Take Years
A quantum computer could factor large numbers in minutes, a task that would take classical computers thousands of years.

## 3. Quantum Entanglement is Real
Two qubits can be "entangled," meaning the state of one instantly affects the other, regardless of distance - Einstein called this "spooky action at a distance."

## 4. They Need Extreme Cold
Quantum computers operate at temperatures near absolute zero (-273°C) to maintain quantum states.

## 5. Google Achieved Quantum Supremacy
In 2019, Google's quantum computer solved a problem in 200 seconds that would take the world's fastest supercomputer 10,000 years.

## 6. They Could Break Current Encryption
Quantum computers pose a threat to current encryption methods, which is why post-quantum cryptography is being developed.

## 7. The Potential is Limitless
From drug discovery to climate modeling, quantum computing could revolutionize countless industries.

The quantum revolution is just beginning!`,
      author: 'Ekions Team',
      publishedDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
      category: 'Science',
      likes: 98,
      shares: 32,
      comments: [],
      tags: ['Quantum Computing', 'Science', 'Technology', 'Physics'],
    },
    {
      id: '3',
      title: 'React vs Vue vs Angular: Which Framework Should You Choose in 2024?',
      excerpt: 'A comprehensive comparison of the three most popular JavaScript frameworks to help you make the right choice for your next project.',
      content: `# React vs Vue vs Angular: Which Framework Should You Choose in 2024?

Choosing the right JavaScript framework can make or break your project. Here's a detailed comparison:

## React: The Flexible Library
- **Learning Curve**: Moderate
- **Performance**: Excellent with virtual DOM
- **Ecosystem**: Massive community and libraries
- **Best For**: Large-scale applications, component-based architecture

## Vue: The Progressive Framework
- **Learning Curve**: Easy
- **Performance**: Excellent, smaller bundle size
- **Ecosystem**: Growing rapidly
- **Best For**: Small to medium projects, rapid prototyping

## Angular: The Full-Featured Framework
- **Learning Curve**: Steep
- **Performance**: Good, but heavier
- **Ecosystem**: Complete solution out of the box
- **Best For**: Enterprise applications, TypeScript-first projects

Choose based on your team's expertise and project requirements!`,
      author: 'Ekions Team',
      publishedDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      category: 'Technology',
      likes: 156,
      shares: 67,
      comments: [],
      tags: ['React', 'Vue', 'Angular', 'JavaScript', 'Web Development'],
    },
    {
      id: '4',
      title: 'Getting Started with Node.js: A Complete Beginner\'s Guide',
      excerpt: 'Learn the fundamentals of Node.js and start building powerful server-side applications with JavaScript.',
      content: `# Getting Started with Node.js: A Complete Beginner's Guide

Node.js has revolutionized backend development by allowing JavaScript to run on the server. Here's everything you need to know:

## What is Node.js?
Node.js is a JavaScript runtime built on Chrome's V8 engine that enables server-side JavaScript execution.

## Key Features
- **Asynchronous & Event-Driven**: Non-blocking I/O operations
- **NPM Ecosystem**: Access to millions of packages
- **Single Language**: Use JavaScript for both frontend and backend
- **High Performance**: Built on V8 engine for speed

## Getting Started
1. Install Node.js from nodejs.org
2. Create your first server with Express
3. Learn about modules and packages
4. Explore async/await patterns

Start building amazing applications today!`,
      author: 'Ekions Team',
      publishedDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      category: 'Technology',
      likes: 89,
      shares: 28,
      comments: [],
      tags: ['Node.js', 'JavaScript', 'Backend', 'Programming'],
    },
    {
      id: '5',
      title: 'Docker Containers Explained: Simplifying Application Deployment',
      excerpt: 'Understand how Docker containers work and why they\'ve become essential for modern software development and deployment.',
      content: `# Docker Containers Explained: Simplifying Application Deployment

Docker has transformed how we build, ship, and run applications. Here's what you need to know:

## What are Containers?
Containers package your application with all its dependencies, ensuring it runs consistently across different environments.

## Benefits of Docker
- **Consistency**: Works the same on dev, staging, and production
- **Isolation**: Each container runs independently
- **Portability**: Run anywhere Docker is installed
- **Efficiency**: Lightweight compared to virtual machines

## Key Concepts
- **Images**: Blueprints for containers
- **Containers**: Running instances of images
- **Dockerfile**: Instructions to build images
- **Docker Compose**: Orchestrate multiple containers

Start containerizing your applications today!`,
      author: 'Ekions Team',
      publishedDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      category: 'Technology',
      likes: 112,
      shares: 41,
      comments: [],
      tags: ['Docker', 'DevOps', 'Containers', 'Deployment'],
    },
    {
      id: '6',
      title: '5 Incredible Facts About Space That Will Amaze You',
      excerpt: 'Journey through the cosmos and discover mind-bending facts about our universe.',
      content: `# 5 Incredible Facts About Space That Will Amaze You

Space is full of mysteries and wonders. Here are some facts that will leave you in awe:

## 1. There Are More Stars Than Grains of Sand
Scientists estimate there are 10,000 stars for every grain of sand on Earth. That's approximately 1 billion trillion stars!

## 2. A Day on Venus is Longer Than a Year
Venus rotates so slowly that one day on Venus (243 Earth days) is longer than its year (225 Earth days).

## 3. Black Holes Can Sing
In 2003, NASA detected sound waves from a supermassive black hole 250 million light-years away. The note is a B-flat, 57 octaves below middle C.

## 4. There's a Planet Made of Diamond
55 Cancri e is a planet twice the size of Earth, and one-third of it is pure diamond. It's worth more than Earth's entire economy!

## 5. You're Made of Stardust
Every atom in your body (except hydrogen) was forged in the heart of a dying star billions of years ago. You are literally made of stardust!

The universe is more incredible than we can imagine!`,
      author: 'Ekions Team',
      publishedDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
      category: 'Science',
      likes: 203,
      shares: 89,
      comments: [],
      tags: ['Space', 'Astronomy', 'Science', 'Universe'],
    },
    {
      id: '7',
      title: '7 Amazing Facts About the Human Brain',
      excerpt: 'Your brain is more powerful than you think. Discover these incredible facts about the most complex organ.',
      content: `# 7 Amazing Facts About the Human Brain

The human brain is one of the most complex structures in the universe. Here are some mind-blowing facts:

## 1. Your Brain Uses 20% of Your Body's Energy
Despite being only 2% of your body weight, your brain consumes 20% of your total energy and oxygen.

## 2. It Can Store 2.5 Petabytes of Information
That's equivalent to 3 million hours of TV shows or 1 million books!

## 3. The Brain Generates Enough Electricity to Power a Light Bulb
Your brain produces about 12-25 watts of electricity - enough to power a small LED light bulb.

## 4. You Have 86 Billion Neurons
Each neuron can connect to up to 10,000 other neurons, creating trillions of possible connections.

## 5. The Brain Can't Feel Pain
The brain itself has no pain receptors, which is why brain surgery can be performed while patients are awake.

## 6. Your Brain is 60% Fat
The brain is the fattiest organ in your body, with 60% of its dry weight being fat.

## 7. It Processes Information Faster Than Supercomputers
Your brain can process information at speeds that exceed the fastest supercomputers, using just 20 watts of power.

Your brain is truly a marvel of nature!`,
      author: 'Ekions Team',
      publishedDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      category: 'Science',
      likes: 178,
      shares: 72,
      comments: [],
      tags: ['Brain', 'Science', 'Health', 'Neuroscience'],
    },
    {
      id: '8',
      title: 'RESTful API Design Best Practices: Building Scalable APIs',
      excerpt: 'Learn the essential principles and best practices for designing RESTful APIs that are scalable, maintainable, and developer-friendly.',
      content: `# RESTful API Design Best Practices: Building Scalable APIs

Designing great APIs is crucial for building successful applications. Here are the best practices:

## Core Principles
- **Use HTTP Methods Correctly**: GET, POST, PUT, DELETE
- **RESTful URLs**: Use nouns, not verbs
- **Status Codes**: Return appropriate HTTP status codes
- **Versioning**: Include API version in URL or headers

## Best Practices
1. **Consistent Naming**: Use clear, predictable endpoint names
2. **Pagination**: Implement pagination for large datasets
3. **Filtering & Sorting**: Allow clients to filter and sort data
4. **Error Handling**: Provide clear, actionable error messages
5. **Documentation**: Maintain comprehensive API documentation

## Security
- Use HTTPS for all endpoints
- Implement authentication (JWT, OAuth)
- Validate and sanitize all inputs
- Rate limiting to prevent abuse

Build APIs that developers love to use!`,
      author: 'Ekions Team',
      publishedDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      category: 'Technology',
      likes: 134,
      shares: 56,
      comments: [],
      tags: ['API', 'REST', 'Backend', 'Development'],
    },
    {
      id: '9',
      title: 'MongoDB vs PostgreSQL: Choosing the Right Database',
      excerpt: 'Compare MongoDB and PostgreSQL to understand which database solution fits your project needs best.',
      content: `# MongoDB vs PostgreSQL: Choosing the Right Database

Selecting the right database is critical for your application success. Here is a comparison:

## MongoDB (NoSQL)
- **Type**: Document-based database
- **Schema**: Flexible, schema-less
- **Best For**: Rapid development, unstructured data, horizontal scaling
- **Use Cases**: Content management, real-time analytics, IoT

## PostgreSQL (SQL)
- **Type**: Relational database
- **Schema**: Structured, ACID compliant
- **Best For**: Complex queries, transactions, data integrity
- **Use Cases**: Financial systems, e-commerce, enterprise applications

## When to Choose What?
- **MongoDB**: When you need flexibility and rapid iteration
- **PostgreSQL**: When you need complex relationships and transactions

Both are excellent choices - pick based on your requirements!`,
      author: 'Ekions Team',
      publishedDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
      category: 'Technology',
      likes: 167,
      shares: 63,
      comments: [],
      tags: ['MongoDB', 'PostgreSQL', 'Database', 'Backend'],
    },
    {
      id: '10',
      title: 'The Psychology of Color: How Colors Affect Your Mind',
      excerpt: 'Discover the fascinating ways colors influence our emotions, decisions, and behavior.',
      content: `# The Psychology of Color: How Colors Affect Your Mind

Colors have a profound impact on our psychology and behavior. Here is what research reveals:

## 1. Red Increases Heart Rate
Studies show that seeing red can increase your heart rate and make you feel more energetic or aggressive.

## 2. Blue Promotes Calmness
Blue is associated with tranquility and can lower blood pressure. It is why many hospitals use blue in their decor.

## 3. Yellow Stimulates Creativity
Yellow is linked to creativity and optimism, but too much can cause anxiety or eye strain.

## 4. Green Reduces Eye Fatigue
Green is the easiest color for the human eye to process, which is why it is used in operating rooms.

## 5. Purple Represents Luxury
Historically, purple dye was expensive to produce, making it associated with royalty and luxury.

## 6. Orange Encourages Action
Orange combines the energy of red and the happiness of yellow, making it great for call-to-action buttons.

## 7. Black Conveys Sophistication
Black is often associated with elegance, power, and sophistication in Western cultures.

Understanding color psychology can help you make better design and marketing decisions!`,
      author: 'Ekions Team',
      publishedDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800',
      category: 'Psychology',
      likes: 145,
      shares: 58,
      comments: [],
      tags: ['Psychology', 'Design', 'Marketing', 'Colors'],
    },
  ], []);

  // Manual internships data from backend seeding
  const manualFeaturedInternships: Internship[] = [
    {
      id: '1',
      title: 'Full Stack Developer Intern',
      company: 'Ekions',
      location: 'Remote',
      type: 'Remote',
      duration: '6 months',
      stipend: '₹25,000/month',
      description: 'Join our dynamic team and work on cutting-edge web applications. You\'ll gain hands-on experience with React, Node.js, and modern development practices.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express'],
      requirements: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    },
    {
      id: '2',
      title: 'AI/ML Research Intern',
      company: 'Ekions',
      location: 'Hybrid',
      type: 'Hybrid',
      duration: '3 months',
      stipend: '₹30,000/month',
      description: 'Work on exciting AI projects including natural language processing, computer vision, and machine learning model development.',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning'],
      requirements: ['Python', 'TensorFlow', 'PyTorch', 'Data Science'],
    },
    {
      id: '3',
      title: 'UI/UX Design Intern',
      company: 'Ekions',
      location: 'Remote',
      type: 'Remote',
      duration: '4 months',
      stipend: '₹20,000/month',
      description: 'Create beautiful and intuitive user interfaces. Work with our design team to bring ideas to life using Figma, Adobe XD, and modern design principles.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      skills: ['Figma', 'Adobe XD', 'UI/UX Design', 'Prototyping', 'User Research'],
      requirements: ['Figma', 'Adobe XD', 'Design Thinking', 'Prototyping'],
    },
    {
      id: '4',
      title: 'DevOps Engineering Intern',
      company: 'Ekions',
      location: 'Remote',
      type: 'Remote',
      duration: '6 months',
      stipend: '₹28,000/month',
      description: 'Learn cloud infrastructure, CI/CD pipelines, containerization, and automation. Work with AWS, Docker, Kubernetes, and modern DevOps tools.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Jenkins'],
      requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    },
    {
      id: '5',
      title: 'Mobile App Development Intern',
      company: 'Ekions',
      location: 'Remote',
      type: 'Remote',
      duration: '5 months',
      stipend: '₹26,000/month',
      description: 'Build mobile applications for iOS and Android using React Native. Work on real projects that reach thousands of users.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Mobile UI/UX'],
      requirements: ['React Native', 'JavaScript', 'Mobile Development'],
    },
  ];

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(manualFeaturedProducts);
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>(manualLatestBlogs);
  const [featuredInternships, setFeaturedInternships] = useState<Internship[]>(manualFeaturedInternships);
  const [imageError, setImageError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselImageErrors, setCarouselImageErrors] = useState<{ [key: string]: boolean }>({});
  const [currentVerticalIndex, setCurrentVerticalIndex] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef<FlatList>(null);

  // Default carousel slides (fallback)
  const defaultCarouselSlides = [
    {
      id: '1',
      image: require('../../assets/homepage header 1.png'),
      route: 'Home',
      title: 'Welcome to Ekions',
    },
    {
      id: '2',
      image: require('../../assets/about us.png'),
      route: 'About',
      title: 'About Us',
    },
    {
      id: '3',
      image: require('../../assets/work with us.png'),
      route: 'Contact',
      title: 'Work With Us',
    },
  ];

  // Use admin-configured banners if available, otherwise use defaults
  const carouselSlides = useMemo(() => {
    if (siteSettings?.banners && siteSettings.banners.length > 0) {
      const activebanners = siteSettings.banners
        .filter((b: any) => b.isActive)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      
      // Process banners - convert relative paths to absolute URLs
      const processedBanners = activebanners
        .filter((b: any) => b.image)
        .map((b: any) => {
          let imageUrl = b.image;
          // If it's a relative path, prepend the server base URL
          if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
            imageUrl = `${SERVER_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }
          return {
            id: b.id,
            image: imageUrl,
            route: b.buttonRoute || 'Home',
            title: b.title,
            subtitle: b.subtitle,
          };
        });
      
      if (processedBanners.length > 0) {
        return processedBanners;
      }
    }
    return defaultCarouselSlides;
  }, [siteSettings?.banners]);

  // Carousel slides are defined above

  useEffect(() => {
    // Load featured products and blogs
    loadFeaturedData();
    
    // Auto-scroll carousel (use admin interval if set)
    const carouselInterval = siteSettings?.bannerInterval || 4000;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselSlides.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, carouselInterval);

    return () => clearInterval(interval);
  }, [siteSettings?.bannerInterval, carouselSlides.length]);

  // Scroll down indicator bounce animation
  useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scrollDownAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scrollDownAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();
    return () => bounceAnimation.stop();
  }, [scrollDownAnim]);

  const loadFeaturedData = async () => {
    try {
      // Try to load from backend, but use manual data as fallback
      // Load featured products (first 4)
      try {
        const productsRes = await fetch(`${API_BASE}/products`);
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (productsData.length > 0) {
            setFeaturedProducts(productsData.slice(0, 4));
          }
          // Otherwise keep manual data
        }
      } catch (err) {
        // Keep manual data on error
      }

      // Load latest blogs (first 3)
      try {
        const blogsRes = await fetch(`${API_BASE}/blogs`);
        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          if (blogsData.length > 0) {
            setLatestBlogs(blogsData.slice(0, 3));
          }
          // Otherwise keep manual data
        }
      } catch (err) {
        // Keep manual data on error
      }

      // Load featured internships (first 3)
      try {
        const internshipsRes = await fetch(`${API_BASE}/internships`);
        if (internshipsRes.ok) {
          const internshipsData = await internshipsRes.json();
          setFeaturedInternships(internshipsData.slice(0, 3));
        }
      } catch (err) {
        // Keep empty array on error
      }
    } catch (error) {
      // Keep manual data on error
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Static carousel image component - no blinking
  const LazyCarouselImage = React.memo(({ item, hasError }: { item: typeof carouselSlides[0], hasError: boolean }) => {
    if (hasError) {
      return (
        <View style={[styles.carouselImage, { backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 64, color: '#6b7280' }}>📷</Text>
          <Text style={{ color: '#9ca3af', marginTop: 8, fontSize: 14 }}>Image not available</Text>
        </View>
      );
    }
    
    // Handle both require() objects and URL strings from admin settings
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;
    
    return (
        <Image
          source={imageSource}
          style={styles.carouselImage}
          resizeMode="cover"
          progressiveRenderingEnabled={Platform.OS !== 'web'}
          fadeDuration={200}
          onError={() => {
            if (typeof __DEV__ !== 'undefined' && __DEV__) {
              console.warn('Carousel image failed:', item.id, item.title);
            }
            setCarouselImageErrors(prev => ({ ...prev, [item.id]: true }));
          }}
          onLoad={() => setCarouselImageErrors(prev => ({ ...prev, [item.id]: false }))}
          onLoadStart={() => {}}
        />
    );
  });

  const renderCarouselItem = ({ item }: { item: typeof carouselSlides[0] }) => {
    const hasError = carouselImageErrors[item.id] || false;
    
    return (
      <TouchableOpacity
        style={styles.carouselItem}
        activeOpacity={0.9}
        onPress={() => navigation.navigate(item.route)}
      >
        <View style={styles.imageWrapper}>
          <LazyCarouselImage item={item} hasError={hasError} />
        </View>
      </TouchableOpacity>
    );
  };


  useEffect(() => {
    // Staggered card animations
    Animated.stagger(200, [
      Animated.spring(card1Anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(card2Anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(card3Anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(footerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const verticals = [
    {
      icon: '💼',
      title: 'Internships',
      description: 'Connect with talented interns to support your projects and foster new talent.',
      route: 'Internships',
      image: require('../../assets/ekions internships.png'),
    },
    {
      icon: '🛒',
      title: 'Product Marketplace',
      description: 'Discover innovative products and solutions from our curated marketplace.',
      route: 'Marketplace',
      image: require('../../assets/ekions products.png'),
    },
    {
      icon: '🔧',
      title: 'Custom Projects',
      description: 'Collaborate with experts to develop custom solutions tailored to your specific requirements.',
      route: 'CustomProjects',
      image: require('../../assets/custom software development .png'),
    },
  ];

  const isTablet = SCREEN_WIDTH >= 768;
  const isMobile = SCREEN_WIDTH < 768;

  return (
    <View style={styles.container}>
      <SEO
        title={siteSettings?.seo?.siteTitle || siteSettings?.seo?.siteName || 'Ekions - Innovative Tech Solutions'}
        description={siteSettings?.seo?.siteDescription || 'Discover innovative tech solutions, products, internships, and services at Ekions. Your trusted partner for digital transformation.'}
        keywords={siteSettings?.seo?.siteKeywords || 'Ekions, tech solutions, digital products, internships, software services, AI, machine learning, web development'}
        image={siteSettings?.seo?.ogImage}
        siteName={siteSettings?.seo?.siteName || 'Ekions'}
      />
      <Navbar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {/* Carousel Hero Section - 3 Images */}
        <View style={styles.carouselContainer} testID="carousel-container">
          <FlatList
            ref={flatListRef}
            nestedScrollEnabled
            data={carouselSlides}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={SCREEN_WIDTH > 0 ? (data, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            }) : undefined}
            initialScrollIndex={0}
            scrollEnabled={true}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH > 0 ? SCREEN_WIDTH : undefined}
            snapToAlignment="center"
            scrollEventThrottle={16}
            removeClippedSubviews={false}
            maxToRenderPerBatch={3}
            updateCellsBatchingPeriod={50}
            windowSize={5}
            initialNumToRender={3}
            {...(Platform.OS !== 'web' && { nestedScrollEnabled: true })}
            style={styles.carouselFlatList}
          />
          {/* Scroll Down Indicator */}
          <Animated.View 
            style={[
              styles.scrollDownIndicator,
              {
                transform: [
                  {
                    translateY: scrollDownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 10],
                    }),
                  },
                ],
                opacity: scrollDownAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.6, 1],
                }),
              },
            ]}
          >
            <Text style={styles.scrollDownText}>Scroll</Text>
            <View style={styles.scrollDownArrow} />
          </Animated.View>
          {/* Carousel Indicators */}
          <View style={styles.carouselIndicators}>
            {carouselSlides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                  setCurrentIndex(index);
                }}
              >
                <View
                  style={[
                    styles.indicator,
                    currentIndex === index && styles.indicatorActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Three Core Verticals */}
        <View style={[styles.verticalsSection, { backgroundColor: '#ffffff' }]}>
          <View style={styles.verticalsContent}>
            <Text style={styles.sectionTitle}>
              Ekions: Three Core Verticals
            </Text>
            <Text style={styles.sectionSubtitle}>
              Ekions offers a comprehensive platform with three key areas to meet your business needs.
            </Text>

            {/* All Three Cards in One Row */}
            <View style={styles.allCardsContainer}>
              {verticals && verticals.length > 0 ? (
                verticals.map((vertical, index) => {
                  const cardAnim = index === 0 ? card1Anim : index === 1 ? card2Anim : card3Anim;
                  return (
                    <Animated.View
                      key={`vertical-${index}`}
                      style={[
                        styles.allCardsWrapper,
                        {
                          opacity: cardAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                          transform: [
                            {
                              scale: cardAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.9, 1],
                              }),
                            },
                            {
                              translateY: cardAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => navigation.navigate(vertical.route)}
                        style={[
                          styles.rotatingCard,
                          index === 0 && { backgroundColor: theme.primary },
                          index === 1 && { backgroundColor: siteSettings?.theme?.secondaryColor || '#7c3aed' },
                          index === 2 && { backgroundColor: siteSettings?.theme?.accentColor || '#059669' },
                        ]}
                        activeOpacity={0.9}
                      >
                        {/* Content without image background */}
                        <View style={styles.rotatingCardContent}>
                          <View style={styles.staticIconContainer}>
                            <Text style={styles.staticIconText}>{vertical.icon}</Text>
                          </View>
                          <Text style={styles.staticCardTitle}>
                            {vertical.title}
                          </Text>
                          <Text style={styles.staticCardDescription}>
                            {vertical.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })
              ) : (
                <View style={{ padding: 20, alignItems: 'center', width: '100%' }}>
                  <Text style={{ color: '#ffffff', fontSize: 16 }}>Loading cards...</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Featured Internships Section - Two Panel Layout (Same as About Us) */}
        <View style={styles.aboutUsSection}>
          <View style={styles.aboutUsContainer}>
            {/* Left: Text Content */}
            <View style={styles.aboutUsTextContainer}>
              <Text style={styles.aboutUsTitle}>Featured Internships</Text>
              <Text style={styles.aboutUsSubtitle}>Connect with talented interns and foster new talent</Text>
              <Text style={styles.aboutUsDescription}>
                Discover exciting internship opportunities across various domains including software development, marketing, design, and data analysis. Join our program to gain real-world experience and build your career with industry-leading projects.
              </Text>
              <TouchableOpacity
                style={[styles.aboutUsButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('Internships')}
                activeOpacity={0.8}
              >
                <Text style={styles.aboutUsButtonText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {/* Right: Image */}
            <View style={styles.aboutUsImageContainer}>
              <Image
                source={require('../../assets/ekions internships.png')}
                style={styles.aboutUsImage}
                resizeMode="cover"
                onError={() => {}}
              />
            </View>
          </View>
        </View>

        {/* What We Are Proficient In Section - Two Panel Layout (Same as About Us) */}
        <View style={styles.aboutUsSection}>
          <View style={styles.aboutUsContainer}>
            {/* Left: Text Content */}
            <View style={styles.aboutUsTextContainer}>
              <Text style={styles.aboutUsTitle}>What We Are Proficient In</Text>
              <Text style={styles.aboutUsSubtitle}>Expert solutions across multiple technology domains</Text>
              <Text style={styles.aboutUsDescription}>
                We excel in mobile app development, web development, cloud infrastructure, backend systems, and comprehensive training programs. Our expertise spans modern frameworks, cloud platforms, and cutting-edge technologies to deliver scalable and innovative solutions.
              </Text>
              <TouchableOpacity
                style={[styles.aboutUsButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('Marketplace')}
                activeOpacity={0.8}
              >
                <Text style={styles.aboutUsButtonText}>Explore Products</Text>
              </TouchableOpacity>
            </View>
            
            {/* Right: Image */}
            <View style={styles.aboutUsImageContainer}>
              <Image
                source={require('../../assets/ekions products.png')}
                style={styles.aboutUsImage}
                resizeMode="cover"
                fadeDuration={200}
                onError={() => {}}
                onLoad={() => {}}
              />
            </View>
          </View>
        </View>

        {/* Blog Section - Two Panel Layout (Same as About Us) */}
        <View style={styles.aboutUsSection}>
          <View style={styles.aboutUsContainer}>
            {/* Left: Text Content */}
            <View style={styles.aboutUsTextContainer}>
              <Text style={styles.aboutUsTitle}>Latest Blog Posts</Text>
              <Text style={styles.aboutUsSubtitle}>Insights, updates, and stories from the Ekions community</Text>
              <Text style={styles.aboutUsDescription}>
                Discover our latest articles covering technology trends, development insights, and industry best practices. Explore our blog to stay updated with the latest in software development, design, and innovation.
              </Text>
              <TouchableOpacity
                style={[styles.aboutUsButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('ExploreBlog')}
                activeOpacity={0.8}
              >
                <Text style={styles.aboutUsButtonText}>Explore Blogs</Text>
              </TouchableOpacity>
            </View>
            
            {/* Right: Image */}
            <View style={styles.aboutUsImageContainer}>
              <Image
                source={require('../../assets/ekions blogs.png')}
                style={styles.aboutUsImage}
                resizeMode="cover"
                fadeDuration={200}
                onError={() => {}}
                onLoad={() => {}}
              />
            </View>
          </View>
        </View>

        {/* About Us Section - Two Column Layout (Text Left, Image Right) */}
        <View style={styles.aboutUsSection}>
          <View style={styles.aboutUsContainer}>
            {/* Left: Text Content */}
            <View style={styles.aboutUsTextContainer}>
              <Text style={styles.aboutUsTitle}>About Our Vision</Text>
              <Text style={styles.aboutUsSubtitle}>Fostering a culture of collaboration and creativity</Text>
              <Text style={styles.aboutUsDescription}>
                Ekions is dedicated to connecting businesses with top talent and innovative solutions. 
                We believe in fostering a culture of collaboration and creativity, where every project 
                becomes an opportunity for growth and excellence.
              </Text>
              <TouchableOpacity
                style={[styles.aboutUsButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('About')}
                activeOpacity={0.8}
              >
                <Text style={styles.aboutUsButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>
            
            {/* Right: Image */}
            <View style={styles.aboutUsImageContainer}>
              <Image
                source={require('../../assets/about us.png')}
                style={styles.aboutUsImage}
                resizeMode="cover"
                fadeDuration={200}
                onError={() => {}}
                onLoad={() => {}}
              />
            </View>
          </View>
        </View>

        {/* Work With Us Section - Two Column Layout (Image Left, Text Right) - Alternating Layout */}
        <View style={styles.workWithUsSection}>
          <View style={styles.workWithUsContainer}>
            {/* Left: Image */}
            <View style={styles.workWithUsImageContainer}>
              <Image
                source={require('../../assets/work with us.png')}
                style={styles.workWithUsImage}
                resizeMode="cover"
                fadeDuration={200}
                onError={() => {}}
                onLoad={() => {}}
              />
            </View>
            
            {/* Right: Text Content */}
            <View style={styles.workWithUsTextContainer}>
              <Text style={styles.workWithUsTitle}>Work With Us</Text>
              <Text style={styles.workWithUsSubtitle}>Explore exciting career opportunities</Text>
              <Text style={styles.workWithUsDescription}>
                Explore exciting career opportunities and join our innovative team. 
                Discover how you can contribute to cutting-edge projects and grow with us. 
                We're looking for passionate individuals who want to make a difference.
              </Text>
              <TouchableOpacity
                style={[styles.workWithUsButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('Contact')}
                activeOpacity={0.8}
              >
                <Text style={styles.workWithUsButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Services Preview Section */}
        <View style={styles.previewSection}>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Our Services</Text>
              <TouchableOpacity
                style={[styles.viewAllButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('Services')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.servicesPreview}>
              <View style={styles.servicePreviewItem}>
                <Text style={styles.servicePreviewIcon}>📱</Text>
                <Text style={styles.servicePreviewTitle}>Mobile App Development</Text>
                <Text style={styles.servicePreviewDesc}>Flutter, Android, iOS, React Native</Text>
              </View>
              <View style={styles.servicePreviewItem}>
                <Text style={styles.servicePreviewIcon}>🌐</Text>
                <Text style={styles.servicePreviewTitle}>Web Development</Text>
                <Text style={styles.servicePreviewDesc}>React, Vue.js, Angular, Full-Stack</Text>
              </View>
              <View style={styles.servicePreviewItem}>
                <Text style={styles.servicePreviewIcon}>☁️</Text>
                <Text style={styles.servicePreviewTitle}>Hosting & Infrastructure</Text>
                <Text style={styles.servicePreviewDesc}>AWS, Azure, GCP, DevOps</Text>
              </View>
              <View style={styles.servicePreviewItem}>
                <Text style={styles.servicePreviewIcon}>🎓</Text>
                <Text style={styles.servicePreviewTitle}>Teaching & Training</Text>
                <Text style={styles.servicePreviewDesc}>Courses, Bootcamps, Masterclasses</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Animated.View style={{ opacity: footerAnim }}>
          <Footer navigation={navigation} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};
