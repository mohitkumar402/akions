import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { AdminLoginScreen } from '../screens/AdminLoginScreen';

// Main Screens
import { HomeScreen } from '../screens/HomeScreen';
import { MarketplaceScreen } from '../screens/MarketplaceScreen';
import { InternshipsScreen } from '../screens/InternshipsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { BlogScreen } from '../screens/BlogScreen';
import { BlogPostScreen } from '../screens/BlogPostScreen';
import { CustomProjectsScreen } from '../screens/CustomProjectsScreen';
import CompleteScreen from '../screens/CompleteScreen';
import { AdminDashboard } from '../admin/AdminDashboard';
import { InternshipApplicationScreen } from '../screens/InternshipApplicationScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ContactScreen } from '../screens/ContactScreen';
import { CustomProductRequestScreen } from '../screens/CustomProductRequestScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home"
      >
        {/* Public Routes - Available to everyone */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
        <Stack.Screen name="Internships" component={InternshipsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Blog" component={BlogScreen} />
        <Stack.Screen name="BlogPost" component={BlogPostScreen} />
        <Stack.Screen name="CustomProjects" component={CustomProjectsScreen} />
        <Stack.Screen name="Services" component={ServicesScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="CustomProductRequest" component={CustomProductRequestScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />

        {/* Auth Routes - Always accessible */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />

        {/* Protected Routes - Require authentication */}
        {user && (
          <>
            <Stack.Screen name="Complete" component={CompleteScreen} />
            <Stack.Screen name="InternshipApplication" component={InternshipApplicationScreen} />
            {user.role === 'admin' && (
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
