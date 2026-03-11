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
import { ExploreBlogScreen } from '../screens/ExploreBlogScreen';
import { BlogPostScreen } from '../screens/BlogPostScreen';
import { CustomProjectsScreen } from '../screens/CustomProjectsScreen';
import CompleteScreen from '../screens/CompleteScreen';
import { AdminDashboard } from '../admin/AdminDashboard';
import { InternshipApplicationScreen } from '../screens/InternshipApplicationScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ContactScreen } from '../screens/ContactScreen';
import { CustomProductRequestScreen } from '../screens/CustomProductRequestScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { CategoryProductsScreen } from '../screens/CategoryProductsScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const { user } = useAuth();

  // Configure linking for web URL routing
  const linking = {
    prefixes: ['http://localhost:8081', 'http://localhost:19006', 'akions://'],
    config: {
      screens: {
        Home: {
          path: 'home',
        },
        Services: {
          path: 'services',
          exact: true,
        },
        Marketplace: {
          path: 'marketplace',
          exact: true,
        },
        Internships: {
          path: 'internships',
          exact: true,
        },
        About: {
          path: 'about',
          exact: true,
        },
        Blog: {
          path: 'blog',
          exact: true,
        },
        ExploreBlog: {
          path: 'explore-blog',
          exact: true,
        },
        Contact: {
          path: 'contact',
          exact: true,
        },
        Login: {
          path: 'login',
          exact: true,
        },
        Signup: {
          path: 'signup',
          exact: true,
        },
        AdminLogin: {
          path: 'admin/login',
          exact: true,
        },
        CustomProjects: {
          path: 'custom-projects',
          exact: true,
        },
        CustomProductRequest: {
          path: 'custom-product-request',
          exact: true,
        },
        ProductDetails: {
          path: 'product/:id',
          exact: true,
        },
        CategoryProducts: {
          path: 'category/:slug',
          exact: true,
        },
        InternshipApplication: {
          path: 'internship/apply',
          exact: true,
        },
        Complete: {
          path: 'complete',
          exact: true,
        },
        AdminDashboard: {
          path: 'admin/dashboard',
          exact: true,
        },
        BlogPost: {
          path: 'blog/:id',
          exact: true,
        },
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
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
        <Stack.Screen name="ExploreBlog" component={ExploreBlogScreen} />
        <Stack.Screen name="BlogPost" component={BlogPostScreen} />
        <Stack.Screen name="CustomProjects" component={CustomProjectsScreen} />
        <Stack.Screen name="Services" component={ServicesScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="CustomProductRequest" component={CustomProductRequestScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />

        {/* Auth Routes - Always accessible */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />

        {/* Protected Routes - Always registered; auth guards inside components */}
        <Stack.Screen name="Complete" component={CompleteScreen} />
        <Stack.Screen name="InternshipApplication" component={InternshipApplicationScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
