// Navigation/AppNavigator.js - UPDATED WITH NEW SCREENS
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { checkAuthStatus } from '../Firebase/authService';

// Import Screens
import SplashScreen from '../Frontend/SplashScreen';
import LoginScreen from '../Frontend/LoginScreen';
import ProfileScreen from '../Frontend/ProfileScreen';
import CourseEnrollment from '../Frontend/CourseEnrollment';
import TimeTable from '../Frontend/TimeTable';
import MotivationalQuotes from '../Frontend/MotivationalQuotes';

// Import Admin Screens
import AdminDashboard from '../Frontend/AdminDashboard';
import StudentListScreen from '../Frontend/StudentListScreen';
import StudentDetailScreen from '../Frontend/StudentDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Splash');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await checkAuthStatus();
      
      if (currentUser) {
        const userEmail = currentUser.email || '';
        
        // Check if admin is logged in
        if (userEmail === 'Admin123@admins.riphah.edu.pk') {
          setInitialRoute('AdminDashboard');
          console.log('Admin logged in:', userEmail);
        } else {
          // Regular student logged in
          setInitialRoute('Profile');
          console.log('Student logged in:', userEmail);
        }
      } else {
        // No user logged in
        setInitialRoute('Splash');
        console.log('No user logged in');
      }
    } catch (error) {
      console.log('Auth check error:', error);
      setInitialRoute('Splash');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0e456fff" />
        <Text style={styles.loadingText}>Loading student portal...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#2589b1ff' }
      }}
      initialRouteName={initialRoute}
    >
      {/* Student Screens */}
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen}
        options={{ gestureEnabled: false }}
      />
      
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ gestureEnabled: false }}
      />
      
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ gestureEnabled: false }}
      />
      
      <Stack.Screen 
        name="CourseEnrollment" 
        component={CourseEnrollment}
      />
      
      <Stack.Screen 
        name="TimeTable" 
        component={TimeTable}
      />
      
      <Stack.Screen 
        name="MotivationalQuotes" 
        component={MotivationalQuotes}
      />
      
      {/* Admin Screens */}
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboard}
        options={{ gestureEnabled: false }}
      />
      
      <Stack.Screen 
        name="StudentListScreen" 
        component={StudentListScreen}
        options={{
          gestureEnabled: true,
          cardStyle: { backgroundColor: '#2589b1ff' }
        }}
      />
      
      <Stack.Screen 
        name="StudentDetailScreen" 
        component={StudentDetailScreen}
        options={{
          gestureEnabled: true,
          cardStyle: { backgroundColor: '#2589b1ff' }
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2589b1ff',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppNavigator;