// Frontend/AdminDashboard.js - UPDATED WITHOUT MENU BUTTON
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
import { getAllStudents, getStudentStatistics } from '../Firebase/studentService';

const { width, height } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const studentsResult = await getAllStudents();
      if (studentsResult.success) setStudents(studentsResult.students);

      const statsResult = await getStudentStatistics();
      if (statsResult.success) setStats(statsResult.statistics);

    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
    Alert.alert('Refreshed', 'Data updated');
  };

  const handleViewStudents = () => {
    navigation.navigate('StudentListScreen', { students });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => navigation.replace('Login'), style: 'destructive' }
    ]);
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      Alert.alert('Logout Required', 'You need to logout to go back.');
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const activeStudents = students.filter(s => s.isActive !== false).length;
    let totalCredits = 0;
    students.forEach(student => {
      if (student.enrolledCourses) {
        const courses = Object.values(student.enrolledCourses);
        totalCredits += courses.reduce((sum, course) => sum + (parseInt(course.credits) || 0), 0);
      }
    });
    return { activeStudents, totalCredits };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#1c6ea0ff', '#6cb5d4ff']} style={StyleSheet.absoluteFill} />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading Admin Dashboard...</Text>
      </View>
    );
  }

  const { activeStudents, totalCredits } = calculateStats();
  const departments = stats?.departments || {};

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1c6ea0ff', '#6cb5d4ff', '#fc9b90ff']}
        start={{ x: 0.02, y: 0.02 }}
        end={{ x: 0.02, y: 0.8 }}
        style={styles.gradientBackground}
      />

      <Image
        source={{ uri: 'https://media.istockphoto.com/id/1218737747/vector/learning-online-e-learning-video-call-chat-with-class-distance-education.jpg?s=612x612&w=0&k=20&c=fFFwc3CTP4XtvmruZLiK8EzAbzvAxJL_kw5BsA7z7w8=' }}
        style={styles.educationImage}
        resizeMode="cover"
      />

      {/* Header - WITHOUT MENU BUTTON */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Image 
          source={{ uri: 'https://jrcrs.riphah.edu.pk/wp-content/uploads/2017/05/RIU-logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Empty space where menu button was */}
        <View style={{ width: 45 }} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Administrator Dashboard</Text>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome Admin!</Text>
          <Text style={styles.welcomeText}>
            Monitor all student activities and academic progress in real-time.
            Access student data, view statistics, and manage the system.
          </Text>
        </View>

        {/* Statistics Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={[styles.statCard, { backgroundColor: '#0e456fff' }]}>
              <FontAwesome5 name="users" size={24} color="#fff" />
              <Text style={[styles.statNumber, styles.whiteText]}>{stats?.totalStudents || 0}</Text>
              <Text style={[styles.statLabel, styles.whiteText]}>Total Students</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
              <FontAwesome5 name="user-check" size={24} color="#fff" />
              <Text style={[styles.statNumber, styles.whiteText]}>{activeStudents}</Text>
              <Text style={[styles.statLabel, styles.whiteText]}>Active</Text>
            </View>
          </View>
          
          <View style={styles.statRow}>
            <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
              <MaterialIcons name="book" size={24} color="#fff" />
              <Text style={[styles.statNumber, styles.whiteText]}>{stats?.totalCoursesEnrolled || 0}</Text>
              <Text style={[styles.statLabel, styles.whiteText]}>Courses</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
              <Feather name="book-open" size={24} color="#fff" />
              <Text style={[styles.statNumber, styles.whiteText]}>{totalCredits}</Text>
              <Text style={[styles.statLabel, styles.whiteText]}>Credit Hours</Text>
            </View>
          </View>
        </View>


        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleViewStudents}>
              <View style={[styles.actionIcon, { backgroundColor: '#0e456fff' }]}>
                <Feather name="users" size={24} color="#fff" />
              </View>
              <Text style={styles.actionButtonText}>View All Students</Text>
              <Text style={styles.actionButtonSubtext}>{students.length} records</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleRefresh}>
              <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
                <Feather name="refresh-cw" size={24} color="#fff" />
              </View>
              <Text style={styles.actionButtonText}>Refresh Data</Text>
              <Text style={styles.actionButtonSubtext}>Update information</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LOGOUT BUTTON AT BOTTOM */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Extra padding for bottom */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  educationImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    opacity: 0.12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6ea0ff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  // Header - WITHOUT MENU BUTTON
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: -70,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e456fff',
  },
  logo: {
    width: width * 0.5,
    height: height * 0.15,
  },
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0e456fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e456fff',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  whiteText: {
    color: '#fff',
  },
  departmentSection: {
    marginBottom: 20,
  },
  departmentCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  departmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  deptInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deptIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deptIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deptText: {
    flex: 1,
  },
  deptName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deptCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  viewDeptButton: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  viewDeptText: {
    color: '#0e456fff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewAllButton: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  viewAllText: {
    color: '#0e456fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  // LOGOUT BUTTON STYLES
  logoutButton: {
    backgroundColor: '#ff6b6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AdminDashboard;