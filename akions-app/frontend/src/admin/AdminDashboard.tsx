import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AdminNavigator } from './AdminNavigator';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigation.navigate('AdminLogin');
      return;
    }

    // Navigate to specific section if provided in route params
    const section = route.params?.section;
    if (section) {
      setTimeout(() => {
        switch (section) {
          case 'products':
            navigation.navigate('AdminProducts');
            break;
          case 'blogs':
            navigation.navigate('AdminBlogs');
            break;
          case 'projects':
            navigation.navigate('AdminProjects');
            break;
          case 'internships':
            navigation.navigate('AdminInternships');
            break;
          default:
            navigation.navigate('AdminProducts');
        }
      }, 100);
    }
  }, [user, route.params]);

  if (user?.role !== 'admin') {
    return null;
  }

  return <AdminNavigator />;
};

