import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Switch,
  Platform,
  Dimensions,
} from 'react-native';
import { AdminHeader } from '../components/AdminHeader';
import { FileUpload } from '../../components/FileUpload';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

const API_BASE = API_URL;

// Cross-platform alert helper
const showAlert = (title: string, message: string, buttons?: Array<{text: string; onPress?: () => void; style?: 'cancel' | 'default' | 'destructive'}>) => {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      // Confirmation dialog
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed) {
        const confirmButton = buttons.find(b => b.style === 'destructive' || b.text !== 'Cancel');
        confirmButton?.onPress?.();
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isMobile = SCREEN_WIDTH < 768;

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonRoute: string;
  isActive: boolean;
  order: number;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  isActive: boolean;
  order: number;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  isActive: boolean;
  order: number;
}

interface SiteSettings {
  theme: {
    mode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    cardBackground: string;
  };
  banners: Banner[];
  bannerAutoPlay: boolean;
  bannerInterval: number;
  sections: {
    heroTitle: string;
    heroSubtitle: string;
    verticalsSection: any;
    internshipsSection: any;
    proficiencySection: any;
    blogSection: any;
    aboutSection: any;
    workWithUsSection: any;
    servicesSection: any;
  };
  services: Service[];
  testimonials: Testimonial[];
  testimonialsVisible: boolean;
  footer: {
    companyName: string;
    companyDescription: string;
    links: any[];
    contactEmail: string;
    contactPhone: string;
    copyrightText: string;
    showSocialLinks: boolean;
    isCompact: boolean;
  };
  seo: {
    siteName: string;
    siteTitle: string;
    siteDescription: string;
    siteKeywords: string;
    ogImage: string;
    twitterHandle: string;
    googleAnalyticsId: string;
    robotsTxt: string;
  };
}

type TabType = 'theme' | 'banners' | 'sections' | 'services' | 'testimonials' | 'footer' | 'seo';

export const AdminSettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, accessToken, isLoading: authLoading, refreshAccessToken } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('theme');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'banner' | 'service' | 'testimonial' | 'section'>('banner');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== 'admin') {
      navigation.navigate('AdminLogin');
      return;
    }
    loadSettings();
  }, [user, authLoading]);

  const loadSettings = async () => {
    if (!accessToken) {
      console.log('No access token, skipping loadSettings');
      return;
    }
    setLoading(true);
    try {
      console.log('Loading settings from:', `${API_BASE}/admin/settings`);
      const res = await fetch(`${API_BASE}/admin/settings`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Settings loaded:', data);
        setSettings(data);
      } else {
        const errorText = await res.text();
        console.error('Load settings failed:', res.status, errorText);
      }
    } catch (error) {
      console.error('Load settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updates: Partial<SiteSettings>) => {
    if (!accessToken) {
      console.error('No access token available');
      showAlert('Error', 'Not authenticated. Please login again.');
      return;
    }
    
    const makeRequest = async (token: string) => {
      return fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
    };
    
    try {
      console.log('Saving settings to:', `${API_BASE}/admin/settings`);
      console.log('Updates:', JSON.stringify(updates));
      let res = await makeRequest(accessToken);
      
      // If token expired, try to refresh and retry
      if (res.status === 401 || res.status === 403) {
        console.log('Token expired, attempting refresh...');
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await makeRequest(newToken);
        } else {
          showAlert('Session Expired', 'Please login again.');
          navigation.navigate('AdminLogin');
          return;
        }
      }
      
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        showAlert('Success', 'Settings saved successfully');
      } else {
        const errorData = await res.text();
        console.error('Save settings failed:', res.status, errorData);
        showAlert('Error', `Failed to save settings: ${res.status} - ${errorData || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Save settings error:', error);
      showAlert('Error', `Failed to save settings: ${error}`);
    }
  };

  // Banner CRUD
  const handleAddBanner = () => {
    setModalType('banner');
    setEditingItem(null);
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      buttonText: 'Learn More',
      buttonRoute: 'Home',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setModalType('banner');
    setEditingItem(banner);
    setFormData({ ...banner });
    setShowModal(true);
  };

  const handleSaveBanner = async () => {
    if (!accessToken || !formData.title || !formData.image) {
      showAlert('Error', 'Title and Image are required');
      return;
    }
    try {
      const url = editingItem
        ? `${API_BASE}/admin/settings/banners/${editingItem.id}`
        : `${API_BASE}/admin/settings/banners`;
      const method = editingItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setShowModal(false);
        showAlert('Success', `Banner ${editingItem ? 'updated' : 'added'} successfully`);
      }
    } catch (error) {
      console.error('Save banner error:', error);
      showAlert('Error', 'Failed to save banner');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    showAlert('Confirm Delete', 'Are you sure you want to delete this banner?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE}/admin/settings/banners/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
              const data = await res.json();
              setSettings(data);
            }
          } catch (error) {
            console.error('Delete banner error:', error);
          }
        },
      },
    ]);
  };

  // Service CRUD
  const handleAddService = () => {
    setModalType('service');
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      icon: '📱',
      image: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditService = (service: Service) => {
    setModalType('service');
    setEditingItem(service);
    setFormData({ ...service });
    setShowModal(true);
  };

  const handleSaveService = async () => {
    if (!accessToken || !formData.title || !formData.description) {
      showAlert('Error', 'Title and Description are required');
      return;
    }
    try {
      const url = editingItem
        ? `${API_BASE}/admin/settings/services/${editingItem.id}`
        : `${API_BASE}/admin/settings/services`;
      const method = editingItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setShowModal(false);
        showAlert('Success', `Service ${editingItem ? 'updated' : 'added'} successfully`);
      }
    } catch (error) {
      console.error('Save service error:', error);
      showAlert('Error', 'Failed to save service');
    }
  };

  const handleDeleteService = async (id: string) => {
    showAlert('Confirm Delete', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE}/admin/settings/services/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
              const data = await res.json();
              setSettings(data);
            }
          } catch (error) {
            console.error('Delete service error:', error);
          }
        },
      },
    ]);
  };

  // Testimonial CRUD
  const handleAddTestimonial = () => {
    setModalType('testimonial');
    setEditingItem(null);
    setFormData({
      name: '',
      role: '',
      company: '',
      content: '',
      avatar: '',
      rating: 5,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setModalType('testimonial');
    setEditingItem(testimonial);
    setFormData({ ...testimonial });
    setShowModal(true);
  };

  const handleSaveTestimonial = async () => {
    if (!accessToken || !formData.name || !formData.content) {
      showAlert('Error', 'Name and Content are required');
      return;
    }
    try {
      const url = editingItem
        ? `${API_BASE}/admin/settings/testimonials/${editingItem.id}`
        : `${API_BASE}/admin/settings/testimonials`;
      const method = editingItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setShowModal(false);
        showAlert('Success', `Testimonial ${editingItem ? 'updated' : 'added'} successfully`);
      }
    } catch (error) {
      console.error('Save testimonial error:', error);
      showAlert('Error', 'Failed to save testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    showAlert('Confirm Delete', 'Are you sure you want to delete this testimonial?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE}/admin/settings/testimonials/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
              const data = await res.json();
              setSettings(data);
            }
          } catch (error) {
            console.error('Delete testimonial error:', error);
          }
        },
      },
    ]);
  };

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.tabsContainer}
      contentContainerStyle={styles.tabsContentContainer}
    >
      {(['theme', 'banners', 'sections', 'services', 'testimonials', 'footer', 'seo'] as TabType[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderThemeSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Theme Settings</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Theme Mode</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Light</Text>
          <Switch
            value={settings?.theme?.mode === 'dark'}
            onValueChange={(value) => {
              const newSettings = {
                ...settings,
                theme: { ...settings?.theme, mode: value ? 'dark' : 'light' },
              };
              setSettings(newSettings as SiteSettings);
            }}
          />
          <Text style={styles.switchLabel}>Dark</Text>
        </View>
      </View>

      <View style={styles.colorRow}>
        <View style={styles.colorItem}>
          <Text style={styles.label}>Primary Color</Text>
          <TextInput
            style={styles.colorInput}
            value={settings?.theme?.primaryColor || '#2563eb'}
            onChangeText={(text) => {
              const newSettings = {
                ...settings,
                theme: { ...settings?.theme, primaryColor: text },
              };
              setSettings(newSettings as SiteSettings);
            }}
            placeholder="#2563eb"
          />
        </View>
        <View style={styles.colorItem}>
          <Text style={styles.label}>Background Color</Text>
          <TextInput
            style={styles.colorInput}
            value={settings?.theme?.backgroundColor || '#ffffff'}
            onChangeText={(text) => {
              const newSettings = {
                ...settings,
                theme: { ...settings?.theme, backgroundColor: text },
              };
              setSettings(newSettings as SiteSettings);
            }}
            placeholder="#ffffff"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => saveSettings({ theme: settings?.theme })}
      >
        <Text style={styles.saveButtonText}>Save Theme Settings</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBannersSettings = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Banner / Carousel Images</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBanner}>
          <Text style={styles.addButtonText}>+ Add Banner</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Auto Play</Text>
        <Switch
          value={settings?.bannerAutoPlay}
          onValueChange={(value) => {
            const newSettings = { ...settings, bannerAutoPlay: value };
            setSettings(newSettings as SiteSettings);
            saveSettings({ bannerAutoPlay: value });
          }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Interval (ms)</Text>
        <TextInput
          style={styles.input}
          value={String(settings?.bannerInterval || 4000)}
          onChangeText={(text) => {
            const value = parseInt(text) || 4000;
            const newSettings = { ...settings, bannerInterval: value };
            setSettings(newSettings as SiteSettings);
          }}
          keyboardType="numeric"
        />
      </View>

      {settings?.banners?.map((banner, index) => (
        <View key={banner.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{banner.title}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEditBanner(banner)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteBanner(banner.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.itemSubtitle}>{banner.subtitle}</Text>
          <Text style={styles.itemMeta}>Route: {banner.buttonRoute} | Active: {banner.isActive ? 'Yes' : 'No'}</Text>
        </View>
      ))}
    </View>
  );

  const renderSectionsSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Section Settings</Text>
      <Text style={styles.sectionSubtitle}>Configure visibility and content for each homepage section</Text>

      {settings?.sections && Object.entries(settings.sections).map(([key, value]) => {
        if (key === 'heroTitle' || key === 'heroSubtitle') {
          return (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>{key === 'heroTitle' ? 'Hero Title' : 'Hero Subtitle'}</Text>
              <TextInput
                style={styles.input}
                value={value as string}
                onChangeText={(text) => {
                  const newSettings = {
                    ...settings,
                    sections: { ...settings.sections, [key]: text },
                  };
                  setSettings(newSettings as SiteSettings);
                }}
              />
            </View>
          );
        }
        if (typeof value === 'object' && value !== null) {
          return (
            <View key={key} style={styles.sectionCard}>
              <View style={styles.sectionCardHeader}>
                <Text style={styles.sectionCardTitle}>
                  {key.replace('Section', '').replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Switch
                  value={(value as any).isVisible !== false}
                  onValueChange={(isVisible) => {
                    const newSettings = {
                      ...settings,
                      sections: {
                        ...settings.sections,
                        [key]: { ...value, isVisible },
                      },
                    };
                    setSettings(newSettings as SiteSettings);
                  }}
                />
              </View>
              <TextInput
                style={styles.input}
                value={(value as any).title || ''}
                onChangeText={(text) => {
                  const newSettings = {
                    ...settings,
                    sections: {
                      ...settings.sections,
                      [key]: { ...value, title: text },
                    },
                  };
                  setSettings(newSettings as SiteSettings);
                }}
                placeholder="Section Title"
              />
              <TextInput
                style={styles.input}
                value={(value as any).subtitle || ''}
                onChangeText={(text) => {
                  const newSettings = {
                    ...settings,
                    sections: {
                      ...settings.sections,
                      [key]: { ...value, subtitle: text },
                    },
                  };
                  setSettings(newSettings as SiteSettings);
                }}
                placeholder="Section Subtitle"
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={(value as any).description || ''}
                onChangeText={(text) => {
                  const newSettings = {
                    ...settings,
                    sections: {
                      ...settings.sections,
                      [key]: { ...value, description: text },
                    },
                  };
                  setSettings(newSettings as SiteSettings);
                }}
                placeholder="Section Description"
                multiline
                numberOfLines={3}
              />
            </View>
          );
        }
        return null;
      })}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => saveSettings({ sections: settings?.sections })}
      >
        <Text style={styles.saveButtonText}>Save Section Settings</Text>
      </TouchableOpacity>
    </View>
  );

  const renderServicesSettings = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Services</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
          <Text style={styles.addButtonText}>+ Add Service</Text>
        </TouchableOpacity>
      </View>

      {settings?.services?.map((service) => (
        <View key={service.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.serviceIcon}>{service.icon}</Text>
              <Text style={styles.itemTitle}>{service.title}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEditService(service)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteService(service.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.itemSubtitle}>{service.description}</Text>
          <Text style={styles.itemMeta}>Active: {service.isActive ? 'Yes' : 'No'}</Text>
        </View>
      ))}
    </View>
  );

  const renderTestimonialsSettings = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Testimonials</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Show Testimonials</Text>
            <Switch
              value={settings?.testimonialsVisible}
              onValueChange={(value) => {
                const newSettings = { ...settings, testimonialsVisible: value };
                setSettings(newSettings as SiteSettings);
                saveSettings({ testimonialsVisible: value });
              }}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTestimonial}>
          <Text style={styles.addButtonText}>+ Add Testimonial</Text>
        </TouchableOpacity>
      </View>

      {settings?.testimonials?.map((testimonial) => (
        <View key={testimonial.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{testimonial.name}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEditTestimonial(testimonial)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTestimonial(testimonial.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.itemSubtitle}>{testimonial.role} at {testimonial.company}</Text>
          <Text style={styles.itemContent}>"{testimonial.content}"</Text>
          <Text style={styles.itemMeta}>Rating: {'⭐'.repeat(testimonial.rating)} | Active: {testimonial.isActive ? 'Yes' : 'No'}</Text>
        </View>
      ))}
    </View>
  );

  const renderFooterSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Footer Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          value={settings?.footer?.companyName || ''}
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              footer: { ...settings?.footer, companyName: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Company Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={settings?.footer?.companyDescription || ''}
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              footer: { ...settings?.footer, companyDescription: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Contact Email</Text>
        <TextInput
          style={styles.input}
          value={settings?.footer?.contactEmail || ''}
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              footer: { ...settings?.footer, contactEmail: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Contact Phone</Text>
        <TextInput
          style={styles.input}
          value={settings?.footer?.contactPhone || ''}
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              footer: { ...settings?.footer, contactPhone: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Copyright Text</Text>
        <TextInput
          style={styles.input}
          value={settings?.footer?.copyrightText || ''}
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              footer: { ...settings?.footer, copyrightText: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Compact Footer</Text>
        <Switch
          value={settings?.footer?.isCompact}
          onValueChange={(value) => {
            const newSettings = {
              ...settings,
              footer: { ...settings?.footer, isCompact: value },
            };
            setSettings(newSettings as SiteSettings);
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => saveSettings({ footer: settings?.footer })}
      >
        <Text style={styles.saveButtonText}>Save Footer Settings</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSEOSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SEO Settings (Search Engine Optimization)</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Site Name</Text>
        <TextInput
          style={styles.input}
          value={settings?.seo?.siteName || ''}
          placeholder="e.g., Ekions"
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              seo: { ...settings?.seo, siteName: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Default Page Title</Text>
        <TextInput
          style={styles.input}
          value={settings?.seo?.siteTitle || ''}
          placeholder="e.g., Ekions - Innovative Tech Solutions"
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              seo: { ...settings?.seo, siteTitle: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
        />
        <Text style={styles.helpText}>This appears in search results as the main title</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Meta Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={settings?.seo?.siteDescription || ''}
          placeholder="A brief description of your site (150-160 characters recommended)"
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              seo: { ...settings?.seo, siteDescription: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
          multiline
          numberOfLines={3}
        />
        <Text style={styles.helpText}>
          {(settings?.seo?.siteDescription?.length || 0)}/160 characters
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Meta Keywords</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={settings?.seo?.siteKeywords || ''}
          placeholder="comma, separated, keywords"
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              seo: { ...settings?.seo, siteKeywords: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
          multiline
          numberOfLines={2}
        />
        <Text style={styles.helpText}>Separate keywords with commas</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Open Graph Image URL</Text>
        <TextInput
          style={styles.input}
          value={settings?.seo?.ogImage || ''}
          placeholder="https://example.com/og-image.png"
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              seo: { ...settings?.seo, ogImage: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
        />
        <Text style={styles.helpText}>Image shown when shared on social media (1200x630px recommended)</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Twitter Handle</Text>
        <TextInput
          style={styles.input}
          value={settings?.seo?.twitterHandle || ''}
          placeholder="@yourusername"
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              seo: { ...settings?.seo, twitterHandle: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Google Analytics ID</Text>
        <TextInput
          style={styles.input}
          value={settings?.seo?.googleAnalyticsId || ''}
          placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              seo: { ...settings?.seo, googleAnalyticsId: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>robots.txt Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={settings?.seo?.robotsTxt || ''}
          placeholder="User-agent: *\nAllow: /"
          onChangeText={(text) => {
            const newSettings = {
              ...settings,
              seo: { ...settings?.seo, robotsTxt: text },
            };
            setSettings(newSettings as SiteSettings);
          }}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => saveSettings({ seo: settings?.seo })}
      >
        <Text style={styles.saveButtonText}>Save SEO Settings</Text>
      </TouchableOpacity>
    </View>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </Text>

              {modalType === 'banner' && (
                <>
                  <TextInput
                    style={styles.input}
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                    placeholder="Banner Title"
                    placeholderTextColor="#9ca3af"
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.subtitle}
                    onChangeText={(text) => setFormData({ ...formData, subtitle: text })}
                    placeholder="Banner Subtitle"
                    placeholderTextColor="#9ca3af"
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.image}
                    onChangeText={(text) => setFormData({ ...formData, image: text })}
                    placeholder="Image URL"
                    placeholderTextColor="#9ca3af"
                  />
                  <FileUpload
                    onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                    currentUrl={formData.image}
                    label="Upload Banner Image"
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.buttonText}
                    onChangeText={(text) => setFormData({ ...formData, buttonText: text })}
                    placeholder="Button Text"
                    placeholderTextColor="#9ca3af"
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.buttonRoute}
                    onChangeText={(text) => setFormData({ ...formData, buttonRoute: text })}
                    placeholder="Button Route (e.g., Home, About, Contact)"
                    placeholderTextColor="#9ca3af"
                  />
                  <View style={styles.switchRow}>
                    <Text style={styles.label}>Active</Text>
                    <Switch
                      value={formData.isActive}
                      onValueChange={(value) => setFormData({ ...formData, isActive: value })}
                    />
                  </View>
                </>
              )}

              {modalType === 'service' && (
                <>
                  <TextInput
                    style={styles.input}
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                    placeholder="Service Title"
                    placeholderTextColor="#9ca3af"
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    placeholder="Service Description"
                    placeholderTextColor="#9ca3af"
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.icon}
                    onChangeText={(text) => setFormData({ ...formData, icon: text })}
                    placeholder="Icon (emoji, e.g., 📱)"
                    placeholderTextColor="#9ca3af"
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.image}
                    onChangeText={(text) => setFormData({ ...formData, image: text })}
                    placeholder="Image URL (optional)"
                    placeholderTextColor="#9ca3af"
                  />
                  <FileUpload
                    onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                    currentUrl={formData.image}
                    label="Upload Service Image"
                  />
                  <View style={styles.switchRow}>
                    <Text style={styles.label}>Active</Text>
                    <Switch
                      value={formData.isActive}
                      onValueChange={(value) => setFormData({ ...formData, isActive: value })}
                    />
                  </View>
                </>
              )}

              {modalType === 'testimonial' && (
                <>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Name"
                    placeholderTextColor="#9ca3af"
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.role}
                    onChangeText={(text) => setFormData({ ...formData, role: text })}
                    placeholder="Role/Position"
                    placeholderTextColor="#9ca3af"
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.company}
                    onChangeText={(text) => setFormData({ ...formData, company: text })}
                    placeholder="Company"
                    placeholderTextColor="#9ca3af"
                  />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.content}
                    onChangeText={(text) => setFormData({ ...formData, content: text })}
                    placeholder="Testimonial Content"
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={4}
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.avatar}
                    onChangeText={(text) => setFormData({ ...formData, avatar: text })}
                    placeholder="Avatar URL (optional)"
                    placeholderTextColor="#9ca3af"
                  />
                  <View style={styles.row}>
                    <Text style={styles.label}>Rating (1-5)</Text>
                    <TextInput
                      style={[styles.input, { width: 80 }]}
                      value={String(formData.rating)}
                      onChangeText={(text) => {
                        const rating = Math.min(5, Math.max(1, parseInt(text) || 1));
                        setFormData({ ...formData, rating });
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.switchRow}>
                    <Text style={styles.label}>Active</Text>
                    <Switch
                      value={formData.isActive}
                      onValueChange={(value) => setFormData({ ...formData, isActive: value })}
                    />
                  </View>
                </>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={() => {
                    if (modalType === 'banner') handleSaveBanner();
                    else if (modalType === 'service') handleSaveService();
                    else if (modalType === 'testimonial') handleSaveTestimonial();
                  }}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (!settings && loading) {
    return (
      <View style={styles.container}>
        <AdminHeader activeSection="settings" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdminHeader activeSection="settings" />
      {renderTabs()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'theme' && renderThemeSettings()}
        {activeTab === 'banners' && renderBannersSettings()}
        {activeTab === 'sections' && renderSectionsSettings()}
        {activeTab === 'services' && renderServicesSettings()}
        {activeTab === 'testimonials' && renderTestimonialsSettings()}
        {activeTab === 'footer' && renderFooterSettings()}
        {activeTab === 'seo' && renderSEOSettings()}
      </ScrollView>
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    maxHeight: 60,
  },
  tabsContentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  activeTab: {
    backgroundColor: '#2c3e50',
    borderColor: '#2c3e50',
  },
  tabText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 12,
    color: '#1f2937',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: -8,
    marginBottom: 12,
  },
  colorRow: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 16,
    marginBottom: 16,
  },
  colorItem: {
    flex: 1,
  },
  colorInput: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 12,
    color: '#1f2937',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  switchLabel: {
    color: '#374151',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#1f2937',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  itemCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  serviceIcon: {
    fontSize: 20,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  itemContent: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    marginVertical: 8,
  },
  itemMeta: {
    fontSize: 12,
    color: '#9ca3af',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
});
