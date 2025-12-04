// Frontend/SplashScreen.js - COMPLETE CORRECT VERSION
import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to Login after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Use REPLACE not navigate
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar 
        backgroundColor="#78caebff" 
        barStyle="dark-content" 
      />

      {/* Smooth Gradient Background */}
      <LinearGradient
        colors={['#1c6ea0ff', '#6cb5d4ff', '#fc9b90ff']}
        start={{ x: 0.02, y: 0.02 }}
        end={{ x: 0.02, y: 0.8 }}
        style={styles.gradientBackground}
      />

      {/* Subtle Educational Background Image */}
      <Image
        source={{ uri: 'https://media.istockphoto.com/id/1218737747/vector/learning-online-e-learning-video-call-chat-with-class-distance-education.jpg?s=612x612&w=0&k=20&c=fFFwc3CTP4XtvmruZLiK8EzAbzvAxJL_kw5BsA7z7w8=' }}
        style={styles.educationImage}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Riphah Logo */}
        <Image 
          source={{ uri: 'https://jrcrs.riphah.edu.pk/wp-content/uploads/2017/05/RIU-logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome</Text>
        
        {/* App Name with Gold Separator */}
        <View style={styles.appNameContainer}>
          <Text style={styles.appName}>EduSphere - Riphah</Text>
          <View style={styles.goldSeparator} />
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color="#0e456fff" 
            style={styles.loadingSpinner}
          />
          <Text style={styles.loadingText}>Loading your student portal...</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#2589b1ff',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  educationImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    opacity: 0.12,
  },
  logo: {
    width: width * 0.9,
    height: height * 0.37,
    marginBottom: 70,
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#0e456fff',
    marginBottom: 0.5,
    fontFamily: 'System',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(33, 118, 187, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  appNameContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0e456fff',
    letterSpacing: 0.5,
    marginBottom: 15,
    fontFamily: 'System',
    textShadowColor: 'rgba(33, 118, 187, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  goldSeparator: {
    width: 160,
    height: 5,
    backgroundColor: '#f1a345ff',
    borderRadius: 3,
    shadowColor: '#000001ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  loadingSpinner: {
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    color: '#0e456fff',
    fontWeight: '600',
    fontFamily: 'System',
    textAlign: 'center',
  },
});

export default SplashScreen;