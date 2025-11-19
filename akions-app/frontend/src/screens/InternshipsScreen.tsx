import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Platform, Modal } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Internship } from '../types';

const API_BASE = 'http://localhost:3000/api';

export const InternshipsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken, applyForInternship, myApplications } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedStipend, setSelectedStipend] = useState('All');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    loadInternships();
    // Check for search query from navigation
    const searchParam = navigation.getState()?.routes?.find(r => r.name === 'Internships')?.params?.searchQuery;
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [navigation]);

  const loadInternships = async () => {
    try {
      const res = await fetch(`${API_BASE}/internships`);
      if (res.ok) {
        const data = await res.json();
        setInternships(data);
      }
    } catch (error) {
      console.error('Load internships error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique filter options from internships
  const filterOptions = useMemo(() => {
    const locations = Array.from(new Set(internships.map(i => i.location))).sort();
    const durations = Array.from(new Set(internships.map(i => i.duration))).sort();
    const allSkills = internships.flatMap(i => (i as any).skills || []).filter(Boolean);
    const skills = Array.from(new Set(allSkills)).sort();
    const stipends = Array.from(new Set(internships.map(i => i.stipend))).sort();
    
    return { locations, durations, skills, stipends };
  }, [internships]);

  const filteredInternships = internships.filter((internship) => {
    // Search filter
    const matchesSearch = !searchQuery || 
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Location filter
    const matchesLocation = selectedLocation === 'All' || internship.location === selectedLocation;
    
    // Duration filter
    const matchesDuration = selectedDuration === 'All' || internship.duration === selectedDuration;
    
    // Skills filter
    const internshipSkills = (internship as any).skills || [];
    const matchesSkill = selectedSkill === 'All' || 
      internshipSkills.some((skill: string) => 
        skill.toLowerCase().includes(selectedSkill.toLowerCase())
      );
    
    // Stipend filter
    const matchesStipend = selectedStipend === 'All' || internship.stipend === selectedStipend;
    
    return matchesSearch && matchesLocation && matchesDuration && matchesSkill && matchesStipend;
  });

  const handleFilterSelect = (filterType: string, value: string) => {
    switch (filterType) {
      case 'location':
        setSelectedLocation(value);
        break;
      case 'duration':
        setSelectedDuration(value);
        break;
      case 'skills':
        setSelectedSkill(value);
        break;
      case 'stipend':
        setSelectedStipend(value);
        break;
    }
    setActiveFilter(null);
  };

  const getFilterButtonText = (type: string) => {
    switch (type) {
      case 'location':
        return selectedLocation === 'All' ? 'Location' : selectedLocation;
      case 'duration':
        return selectedDuration === 'All' ? 'Duration' : selectedDuration;
      case 'skills':
        return selectedSkill === 'All' ? 'Skills' : selectedSkill;
      case 'stipend':
        return selectedStipend === 'All' ? 'Stipend' : selectedStipend;
      default:
        return '';
    }
  };

  const getFilterOptions = (type: string) => {
    switch (type) {
      case 'location':
        return ['All', ...filterOptions.locations];
      case 'duration':
        return ['All', ...filterOptions.durations];
      case 'skills':
        return ['All', ...filterOptions.skills];
      case 'stipend':
        return ['All', ...filterOptions.stipends];
      default:
        return [];
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <Text style={styles.title}>Internships</Text>
          <Text style={styles.subtitle}>Explore internships from leading companies.</Text>

          {/* Search and Filters Row */}
          <View style={styles.searchFiltersRow}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.filtersWrapper}>
              <TouchableOpacity 
                style={[styles.filterButton, selectedLocation !== 'All' && styles.filterButtonActive]}
                onPress={() => setActiveFilter(activeFilter === 'location' ? null : 'location')}
              >
                <Text style={styles.filterButtonText}>{getFilterButtonText('location')}</Text>
                <Text style={styles.filterArrow}>▼</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedDuration !== 'All' && styles.filterButtonActive]}
                onPress={() => setActiveFilter(activeFilter === 'duration' ? null : 'duration')}
              >
                <Text style={styles.filterButtonText}>{getFilterButtonText('duration')}</Text>
                <Text style={styles.filterArrow}>▼</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedSkill !== 'All' && styles.filterButtonActive]}
                onPress={() => setActiveFilter(activeFilter === 'skills' ? null : 'skills')}
              >
                <Text style={styles.filterButtonText}>{getFilterButtonText('skills')}</Text>
                <Text style={styles.filterArrow}>▼</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, selectedStipend !== 'All' && styles.filterButtonActive]}
                onPress={() => setActiveFilter(activeFilter === 'stipend' ? null : 'stipend')}
              >
                <Text style={styles.filterButtonText}>{getFilterButtonText('stipend')}</Text>
                <Text style={styles.filterArrow}>▼</Text>
              </TouchableOpacity>
              {(selectedLocation !== 'All' || selectedDuration !== 'All' || selectedSkill !== 'All' || selectedStipend !== 'All') && (
                <TouchableOpacity 
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSelectedLocation('All');
                    setSelectedDuration('All');
                    setSelectedSkill('All');
                    setSelectedStipend('All');
                  }}
                >
                  <Text style={styles.clearFiltersText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Dropdown Modal */}
            {activeFilter && (
              <Modal
                visible={!!activeFilter}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setActiveFilter(null)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setActiveFilter(null)}
                >
                  <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                        Select {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
                      </Text>
                      <TouchableOpacity onPress={() => setActiveFilter(null)}>
                        <Text style={styles.modalClose}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalOptions}>
                      {getFilterOptions(activeFilter).map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.modalOption,
                            ((activeFilter === 'location' && selectedLocation === option) ||
                             (activeFilter === 'duration' && selectedDuration === option) ||
                             (activeFilter === 'skills' && selectedSkill === option) ||
                             (activeFilter === 'stipend' && selectedStipend === option)) && styles.modalOptionSelected
                          ]}
                          onPress={() => handleFilterSelect(activeFilter, option)}
                        >
                          <Text style={[
                            styles.modalOptionText,
                            ((activeFilter === 'location' && selectedLocation === option) ||
                             (activeFilter === 'duration' && selectedDuration === option) ||
                             (activeFilter === 'skills' && selectedSkill === option) ||
                             (activeFilter === 'stipend' && selectedStipend === option)) && styles.modalOptionTextSelected
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
          </View>

          {/* Internship Listings */}
          {loading ? (
            <Text style={styles.loading}>Loading internships...</Text>
          ) : (
            filteredInternships.map((internship) => {
              const hasApplied = myApplications.includes(internship.id);
              return (
                <View key={internship.id} style={styles.internshipCard}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.typeLabel}>{internship.type}</Text>
                      <Text style={styles.cardTitle}>{internship.title}</Text>
                      <Text style={styles.cardMeta}>
                        {internship.company} | {internship.location} | {internship.stipend}
                      </Text>
                      <TouchableOpacity
                        style={[styles.viewDetailsButton, hasApplied && styles.appliedButton]}
                        onPress={() => {
                          if (hasApplied) return;
                          if (!user) {
                            navigation.navigate('Login');
                            return;
                          }
                          navigation.navigate('InternshipApplication', { internship });
                        }}
                        disabled={hasApplied}
                      >
                        <Text style={styles.viewDetailsText}>
                          {hasApplied ? 'Applied' : user ? 'View Details' : 'Login to Apply'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.cardRight}>
                      {internship.image ? (
                        <Image
                          source={{ uri: internship.image }}
                          style={styles.cardImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <Text style={styles.imagePlaceholderText}>📷</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}

          {/* Pagination */}
          <View style={styles.pagination}>
            <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>←</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.pageButton, styles.pageActive]}><Text style={styles.pageActiveText}>1</Text></TouchableOpacity>
            <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>2</Text></TouchableOpacity>
            <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>3</Text></TouchableOpacity>
            <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>4</Text></TouchableOpacity>
            <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>5</Text></TouchableOpacity>
            <TouchableOpacity style={styles.pageButton}><Text style={styles.pageText}>→</Text></TouchableOpacity>
          </View>

          <Footer navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { paddingBottom: 32 },
  inner: { paddingVertical: 32, paddingHorizontal: 24, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  title: { fontSize: 40, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#9ca3af', marginBottom: 32 },
  searchFiltersRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: Platform.OS === 'web' ? 1 : undefined,
    width: Platform.OS === 'web' ? 'auto' : '100%',
    gap: 8,
  },
  searchIcon: { fontSize: 16, color: '#9ca3af' },
  searchInput: { flex: 1, fontSize: 16, color: '#ffffff', padding: 0 },
  filtersWrapper: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  filterButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
  filterArrow: { color: '#9ca3af', fontSize: 12 },
  clearFiltersButton: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#991b1b',
  },
  clearFiltersText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111827',
    borderRadius: 12,
    width: Platform.OS === 'web' ? 400 : '90%',
    maxHeight: Platform.OS === 'web' ? 500 : '70%',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalClose: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: '300',
  },
  modalOptions: {
    maxHeight: Platform.OS === 'web' ? 400 : 300,
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  modalOptionSelected: {
    backgroundColor: '#1e3a8a',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#d1d5db',
  },
  modalOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  internshipCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'stretch',
  },
  cardLeft: {
    flex: 1,
    padding: 24,
  },
  typeLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  cardMeta: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  viewDetailsButton: {
    backgroundColor: '#1f2937',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  appliedButton: {
    backgroundColor: '#10b981',
    opacity: 0.8,
  },
  cardRight: {
    width: Platform.OS === 'web' ? 300 : '100%',
    height: Platform.OS === 'web' ? 'auto' : 200,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    minHeight: 200,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    minHeight: 200,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 48,
    color: '#4b5563',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1f2937',
  },
  pageText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  pageActive: {
    backgroundColor: '#2563eb',
  },
  pageActiveText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  loading: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 24,
    fontSize: 16,
  },
});
