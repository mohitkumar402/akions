import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Platform, Modal } from 'react-native';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { Internship } from '../types';
import { API_URL } from '../config/api';

const API_BASE = API_URL;

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

  // Manual internships data from seedInternships.js
  const manualInternships: Internship[] = [
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

  const loadInternships = async () => {
    try {
      // Try to fetch from backend first
      const res = await fetch(`${API_BASE}/internships`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setInternships(data);
          setLoading(false);
          return;
        }
      }
      // Fallback to manual data
      setInternships(manualInternships);
    } catch (error) {
      console.error('Load internships error:', error);
      // Fallback to manual data on error
      setInternships(manualInternships);
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
      <SEO
        title="Internships - Find Your Dream Internship"
        description="Explore exciting internship opportunities at Ekions. Gain hands-on experience in Full Stack Development, AI/ML, UI/UX Design, DevOps, and Mobile App Development."
        keywords="internships, tech internships, remote internships, full stack developer internship, ai internship, machine learning internship, design internship"
      />
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
            filteredInternships.slice(0, 5).map((internship) => {
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
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingBottom: 32 },
  inner: { paddingVertical: 32, paddingHorizontal: 24, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  title: { fontSize: 40, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 32 },
  searchFiltersRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: Platform.OS === 'web' ? 1 : undefined,
    width: Platform.OS === 'web' ? 'auto' : '100%',
    gap: 8,
  },
  searchIcon: { fontSize: 16, color: '#6b7280' },
  searchInput: { flex: 1, fontSize: 16, color: '#111827', padding: 0 },
  filtersWrapper: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  filterButtonText: { color: '#374151', fontSize: 14, fontWeight: '500' },
  filterArrow: { color: '#6b7280', fontSize: 12 },
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: Platform.OS === 'web' ? 400 : '90%',
    maxHeight: Platform.OS === 'web' ? 500 : '70%',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
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
    borderBottomColor: '#f3f4f6',
  },
  modalOptionSelected: {
    backgroundColor: '#eff6ff',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#4b5563',
  },
  modalOptionTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  internshipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
    color: '#2563eb',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  cardMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  viewDetailsButton: {
    backgroundColor: '#2563eb',
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
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 48,
    color: '#9ca3af',
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
    backgroundColor: '#f3f4f6',
  },
  pageText: {
    color: '#6b7280',
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
