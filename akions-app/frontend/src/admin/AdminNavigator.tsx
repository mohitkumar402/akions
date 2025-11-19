import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminProductsScreen } from './screens/AdminProductsScreen';
import { AdminBlogsScreen } from './screens/AdminBlogsScreen';
import { AdminProjectsScreen } from './screens/AdminProjectsScreen';
import { AdminInternshipsScreen } from './screens/AdminInternshipsScreen';
import { AdminDocumentsScreen } from './screens/AdminDocumentsScreen';

const Stack = createNativeStackNavigator();

export const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="AdminProducts"
    >
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="AdminBlogs" component={AdminBlogsScreen} />
      <Stack.Screen name="AdminProjects" component={AdminProjectsScreen} />
      <Stack.Screen name="AdminInternships" component={AdminInternshipsScreen} />
      <Stack.Screen name="AdminDocuments" component={AdminDocumentsScreen} />
    </Stack.Navigator>
  );
};

