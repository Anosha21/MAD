// Frontend/StudentDetailScreen.js - FULL SCREEN STUDENT DETAILS
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const StudentDetailScreen = ({ navigation, route }) => {
  const { student } = route.params;

  if (!student) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Student data not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBackPress = () => {
    navigation.goBack();
  };

  const calculateStudentStats = () => {
    const courses = student.enrolledCourses ? Object.values(student.enrolledCourses) : [];
    const courseCount = courses.length;
    const totalCredits = courses.reduce((sum, course) => sum + (parseInt(course.credits) || 0), 0);
    const avgCredits = courseCount > 0 ? (totalCredits / courseCount).toFixed(1) : 0;
    
    return { courseCount, totalCredits, avgCredits, courses };
  };

  const { courseCount, totalCredits, avgCredits, courses } = calculateStudentStats();
  const registrationDate = student.createdAt 
    ? new Date(student.createdAt).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Not available';

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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#0e456fff" />
        </TouchableOpacity>

        <Image 
          source={{ uri: 'https://jrcrs.riphah.edu.pk/wp-content/uploads/2017/05/RIU-logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Student Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>
                {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.studentName}>{student.fullName || 'Unknown Student'}</Text>
              <Text style={styles.studentSapId}>SAP ID: {student.sapId || 'N/A'}</Text>
              
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: student.isActive !== false ? '#4CAF50' : '#f44336' }
                ]}>
                  <Text style={styles.statusText}>
                    {student.isActive !== false ? 'Active Student' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                <MaterialIcons name="book" size={20} color="#1976D2" />
              </View>
              <Text style={styles.statNumber}>{courseCount}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <Feather name="book-open" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.statNumber}>{totalCredits}</Text>
              <Text style={styles.statLabel}>Credits</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                <Feather name="trending-up" size={20} color="#FF9800" />
              </View>
              <Text style={styles.statNumber}>{avgCredits}</Text>
              <Text style={styles.statLabel}>Avg/Course</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Feather name="home" size={16} color="#0e456fff" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{student.department || 'Not specified'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Feather name="hash" size={16} color="#0e456fff" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Semester</Text>
                <Text style={styles.infoValue}>{student.semester || 'Not specified'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Feather name="mail" size={16} color="#0e456fff" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {student.email || 'Not available'}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Feather name="calendar" size={16} color="#0e456fff" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Registered</Text>
                <Text style={styles.infoValue}>{registrationDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Enrolled Courses */}
        {courses.length > 0 && (
          <View style={styles.coursesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Enrolled Courses ({courseCount})</Text>
              <Text style={styles.creditsSummary}>{totalCredits} total credits</Text>
            </View>
            
            {courses.map((course, index) => (
              <View key={index} style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <View style={styles.courseCodeBadge}>
                    <Text style={styles.courseCodeText}>{course.code || 'N/A'}</Text>
                  </View>
                  <View style={styles.creditsBadge}>
                    <Text style={styles.creditsBadgeText}>{course.credits || '0'} credits</Text>
                  </View>
                </View>
                
                <Text style={styles.courseName}>{course.name || 'Unnamed Course'}</Text>
                
                {course.instructor && (
                  <View style={styles.courseDetail}>
                    <Feather name="user" size={12} color="#666" />
                    <Text style={styles.courseDetailText}>Instructor: {course.instructor}</Text>
                  </View>
                )}
                
                {course.schedule && (
                  <View style={styles.courseDetail}>
                    <Feather name="clock" size={12} color="#666" />
                    <Text style={styles.courseDetailText}>Schedule: {course.schedule}</Text>
                  </View>
                )}
                
                {course.enrolledDate && (
                  <Text style={styles.courseDate}>
                    Enrolled on {new Date(course.enrolledDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* No Courses Message */}
        {courses.length === 0 && (
          <View style={styles.noCoursesSection}>
            <View style={styles.noCoursesIcon}>
              <Feather name="book-open" size={40} color="#ccc" />
            </View>
            <Text style={styles.noCoursesTitle}>No Courses Enrolled</Text>
            <Text style={styles.noCoursesText}>
              This student hasn't enrolled in any courses yet.
            </Text>
          </View>
        )}

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Feather name="shield" size={14} color="#666" />
          <Text style={styles.footerNoteText}>
            Student information retrieved from Firebase database
          </Text>
        </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6ea0ff',
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
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
    marginTop: -80,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.15,
  },
  headerPlaceholder: {
    width: 45,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // Profile Section
  profileSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0e456fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarLargeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  studentSapId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  // Info Section
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e456fff',
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  // Courses Section
  coursesSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  creditsSummary: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  courseCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0e456fff',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseCodeBadge: {
    backgroundColor: '#0e456fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  courseCodeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  creditsBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  creditsBadgeText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  courseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  courseDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  courseDate: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  // No Courses
  noCoursesSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  noCoursesIcon: {
    marginBottom: 15,
  },
  noCoursesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  noCoursesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  // Footer
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  footerNoteText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});

export default StudentDetailScreen;