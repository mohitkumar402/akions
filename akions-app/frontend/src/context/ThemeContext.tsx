import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config/api';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  card: string;
  input: string;
  button: string;
  buttonText: string;
  header: string;
  footer: string;
}

interface SiteSettings {
  theme?: {
    mode?: 'light' | 'dark';
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    cardBackground?: string;
  };
  banners?: any[];
  sections?: any;
  footer?: any;
  contactInfo?: any;
  seo?: {
    siteName?: string;
    siteTitle?: string;
    siteDescription?: string;
    siteKeywords?: string;
    ogImage?: string;
    twitterHandle?: string;
    googleAnalyticsId?: string;
    robotsTxt?: string;
  };
}

const defaultLightTheme: ThemeColors = {
  background: '#ffffff',
  surface: '#f9fafb',
  primary: '#2563eb',
  secondary: '#10b981',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  card: '#ffffff',
  input: '#ffffff',
  button: '#2563eb',
  buttonText: '#ffffff',
  header: '#ffffff',
  footer: '#1f2937',
};

const defaultDarkTheme: ThemeColors = {
  background: '#111827',
  surface: '#1f2937',
  primary: '#3b82f6',
  secondary: '#10b981',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  border: '#374151',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  card: '#1f2937',
  input: '#374151',
  button: '#3b82f6',
  buttonText: '#ffffff',
  header: '#0f172a',
  footer: '#111827',
};

interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  siteSettings: SiteSettings | null;
  refreshSettings: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@ekions_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [customTheme, setCustomTheme] = useState<Partial<ThemeColors>>({});

  // Fetch site settings from backend
  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) {
        const data = await res.json();
        setSiteSettings(data);
        
        // Apply theme settings from backend
        if (data.theme) {
          const backendTheme = data.theme;
          // Trim color values to handle accidental spaces
          const trimColor = (color: string | undefined) => color?.trim() || undefined;
          setCustomTheme({
            primary: trimColor(backendTheme.primaryColor),
            secondary: trimColor(backendTheme.secondaryColor),
            background: trimColor(backendTheme.backgroundColor),
            text: trimColor(backendTheme.textColor),
            card: trimColor(backendTheme.cardBackground),
            button: trimColor(backendTheme.primaryColor),
          });
          
          // If backend specifies theme mode, use it (unless user has local preference)
          if (backendTheme.mode) {
            const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (!savedMode) {
              setThemeModeState(backendTheme.mode);
              setIsDark(backendTheme.mode === 'dark');
            }
          }
        }
        console.log('[Theme] Loaded settings from backend');
      }
    } catch (error) {
      console.error('[Theme] Failed to fetch settings:', error);
    }
  };

  // Load saved theme preference and fetch backend settings
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto')) {
          setThemeModeState(savedMode as ThemeMode);
        }
      } catch (error) {
        console.error('Load theme error:', error);
      }
    };
    loadTheme();
    fetchSettings();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'auto') {
        setIsDark(colorScheme === 'dark');
      }
    });

    return () => subscription.remove();
  }, [themeMode]);

  // Update theme based on mode
  useEffect(() => {
    if (themeMode === 'auto') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Save theme error:', error);
    }
  };

  // Merge default theme with custom backend colors
  const baseTheme = isDark ? defaultDarkTheme : defaultLightTheme;
  const theme: ThemeColors = { ...baseTheme, ...customTheme };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark, siteSettings, refreshSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};





