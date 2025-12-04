import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import Firebase services
import { getAllCourses, enrollInCourse, getEnrolledCourses, dropCourse } from '../Firebase/courseService';
import { getCurrentUser } from '../Firebase/authService';

const { width, height } = Dimensions.get('window');

const CourseEnrollment = ({ navigation, route }) => {
  const { userEmail, userId } = route.params || {};
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  // Load courses and enrolled courses from Firebase
  useEffect(() => {
    loadCoursesData();
  }, []);

  const loadCoursesData = async () => {
    try {
      setLoading(true);
      
      // Get current user if userId not provided
      const currentUser = getCurrentUser();
      const userUid = userId || currentUser?.uid;
      
      if (!userUid) {
        Alert.alert('Error', 'User not logged in');
        navigation.goBack();
        return;
      }

      // Get all available courses from Firebase
      const coursesResult = await getAllCourses();
      if (coursesResult.success) {
        setAvailableCourses(coursesResult.courses);
        console.log('Available courses:', coursesResult.courses.map(c => ({id: c.id, name: c.name})));
      } else {
        Alert.alert('Error', 'Failed to load courses');
      }

      // Get currently enrolled courses from Firebase
      const enrolledResult = await getEnrolledCourses(userUid);
      if (enrolledResult.success) {
        const enrolledIds = enrolledResult.courses.map(course => course.courseId);
        setEnrolledCourseIds(enrolledIds);
        console.log('Enrolled course IDs:', enrolledIds);
        
        // Start with enrolled courses pre-selected
        setSelectedCourses([...enrolledIds]);
        console.log('Initial selected courses:', [...enrolledIds]);
        
        // Calculate total credits from enrolled courses
        const total = enrolledResult.totalCredits;
        setTotalCredits(total);
      }

    } catch (error) {
      console.error('Error loading courses:', error);
      Alert.alert('Error', 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  // Update total credits when selection changes
  useEffect(() => {
    const credits = selectedCourses.reduce((sum, courseId) => {
      const course = availableCourses.find(c => c.id === courseId);
      return sum + (course?.credits || 0);
    }, 0);
    setTotalCredits(credits);
    console.log('Selected courses updated:', selectedCourses);
    console.log('Total credits:', credits);
  }, [selectedCourses, availableCourses]);

  const toggleCourseSelection = (courseId, credits) => {
    console.log('Toggling course ID:', courseId);
    console.log('Type of courseId:', typeof courseId);
    console.log('Current selected courses:', selectedCourses);
    console.log('Are they equal?', selectedCourses.includes(courseId));
    
    // Find the exact course to ensure we have the right ID
    const course = availableCourses.find(c => {
      console.log('Comparing:', c.id, 'with', courseId, 'result:', c.id === courseId);
      return c.id === courseId;
    });
    
    if (!course) {
      console.log('Course not found with ID:', courseId);
      return;
    }
    
    if (selectedCourses.includes(courseId)) {
      // Remove course from selection
      const newSelected = selectedCourses.filter(id => id !== courseId);
      setSelectedCourses(newSelected);
      console.log('Removed. New selected:', newSelected);
    } else {
      // Add course if within credit limit
      const newTotal = totalCredits + (course?.credits || credits);
      
      if (newTotal > 20) {
        Alert.alert('Credit Limit Exceeded', 'Maximum 20 credit hours allowed!');
        return;
      }
      
      const newSelected = [...selectedCourses, courseId];
      setSelectedCourses(newSelected);
      console.log('Added. New selected:', newSelected);
    }
  };

  const handleEnroll = async () => {
    if (selectedCourses.length === 0) {
      Alert.alert('No Courses Selected', 'Please select at least one course to enroll.');
      return;
    }

    // Get current user
    const currentUser = getCurrentUser();
    const userUid = userId || currentUser?.uid;
    
    if (!userUid) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    setProcessing(true);

    try {
      let successCount = 0;
      let errorMessages = [];

      // 1. Enroll in NEWLY selected courses
      for (const courseId of selectedCourses) {
        if (enrolledCourseIds.includes(courseId)) {
          // Course already enrolled, skip
          successCount++;
          continue;
        }

        // Enroll in new course
        const result = await enrollInCourse(userUid, courseId);
        if (result.success) {
          successCount++;
        } else {
          errorMessages.push(`${courseId}: ${result.error}`);
        }
      }

      // 2. Drop courses that are NO LONGER selected
      for (const courseId of enrolledCourseIds) {
        if (!selectedCourses.includes(courseId)) {
          // Drop course that was previously enrolled but now deselected
          const result = await dropCourse(userUid, courseId);
          if (!result.success) {
            errorMessages.push(`Failed to drop ${courseId}: ${result.error}`);
          } else {
            successCount++;
          }
        }
      }

      if (errorMessages.length === 0) {
        Alert.alert(
          'Success', 
          `${successCount} courses updated successfully!`,
          [
            { 
              text: 'OK', 
              onPress: () => {
                // FIXED: Navigate to TimeTable instead of Profile
                navigation.navigate('TimeTable', {
                  userEmail,
                  userId: userUid
                });
              }
            }
          ]
        );
      } else if (successCount > 0) {
        Alert.alert(
          'Partial Success',
          `${successCount} courses updated. Some errors:\n${errorMessages.join('\n')}`,
          [
            { 
              text: 'OK', 
              onPress: () => {
                // FIXED: Navigate to TimeTable instead of Profile
                navigation.navigate('TimeTable', {
                  userEmail,
                  userId: userUid
                });
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to update courses:\n' + errorMessages.join('\n'));
      }

    } catch (error) {
      console.error('Enrollment error:', error);
      Alert.alert('Error', 'Failed to process enrollment');
    } finally {
      setProcessing(false);
    }
  };

  const isCourseSelected = (courseId) => {
    const result = selectedCourses.includes(courseId);
    console.log(`isCourseSelected(${courseId}): ${result}`);
    return result;
  };

  const getEnrollmentStatus = (courseId) => {
    if (enrolledCourseIds.includes(courseId)) {
      return isCourseSelected(courseId) ? 'Currently Enrolled' : 'Will be Dropped';
    }
    if (isCourseSelected(courseId)) {
      return 'Selected for Enrollment';
    }
    return 'Not Selected';
  };

  if (loading) {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar backgroundColor="#87CEEB" barStyle="dark-content" />
        <LinearGradient
          colors={['#1c6ea0ff', '#6cb5d4ff', '#fc9b90ff']}
          start={{ x: 0.02, y: 0.02 }}
          end={{ x: 0.02, y: 0.8 }}
          style={styles.gradientBackground}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0e456fff" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar backgroundColor="#87CEEB" barStyle="dark-content" />

      {/* Background Gradient */}
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

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <Image 
          source={{ uri: 'https://jrcrs.riphah.edu.pk/wp-content/uploads/2017/05/RIU-logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Screen Title */}
        <Text style={styles.sectionTitle}>Course Enrollment</Text>

        {/* Credit Hours Counter */}
        <View style={styles.creditCounter}>
          <Text style={styles.creditText}>
            Selected Credits: <Text style={styles.creditNumber}>{totalCredits}/20</Text>
          </Text>
          {totalCredits > 20 && (
            <Text style={styles.creditWarning}>⚠️ Exceeds limit!</Text>
          )}
          <Text style={styles.courseCount}>
            {selectedCourses.length} course(s) selected
          </Text>
        </View>

        {/* Course List */}
        <View style={styles.coursesContainer}>
          <Text style={styles.subSectionTitle}>Available Courses ({availableCourses.length})</Text>
          
          {availableCourses.map((course) => {
            const selected = isCourseSelected(course.id);
            const enrolled = enrolledCourseIds.includes(course.id);
            
            console.log(`Course: ${course.name}, ID: ${course.id}, Selected: ${selected}, Enrolled: ${enrolled}`);
            
            return (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseCard,
                  selected && styles.selectedCourseCard,
                  enrolled && styles.currentlyEnrolledCard
                ]}
                onPress={() => toggleCourseSelection(course.id, course.credits)}
                disabled={processing}
                activeOpacity={0.7}
              >
                <View style={styles.courseHeader}>
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox,
                      selected && styles.checkboxSelected
                    ]}>
                      {selected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </View>
                  
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseName}>{course.name}</Text>
                    <Text style={styles.courseCode}>{course.code}</Text>
                    <Text style={styles.courseInstructor}>{course.instructor}</Text>
                  </View>
                  
                  <View style={styles.creditsBadge}>
                    <Text style={styles.creditsText}>{course.credits} CR</Text>
                  </View>
                </View>
                
                <Text style={styles.courseDescription}>{course.description}</Text>
                
                <View style={styles.courseFooter}>
                  <Text style={styles.courseSchedule}>{course.schedule}</Text>
                  <View style={[
                    styles.enrollmentBadge,
                    enrolled ? styles.enrolledBadge : 
                    selected ? styles.selectedBadge : styles.notSelectedBadge
                  ]}>
                    <Text style={styles.enrollmentBadgeText}>
                      {getEnrollmentStatus(course.id)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={processing}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          {processing ? (
            <View style={styles.processingButton}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={[
                styles.enrollButton,
                selectedCourses.length === 0 && styles.enrollButtonDisabled
              ]}
              onPress={handleEnroll}
              disabled={selectedCourses.length === 0 || processing}
            >
              <Text style={styles.enrollButtonText}>
                {selectedCourses.length > 0 ? 
                  `Save Changes (${selectedCourses.length} courses)` : 
                  'Save Enrollment'
                }
              </Text>
            </TouchableOpacity>
          )}
        </View>

        
      </ScrollView>
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
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#0e456fff',
    fontWeight: '600',
  },
  // Back button styles
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#0e456fff',
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e456fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.15,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0e456fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(33, 118, 187, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  creditCounter: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  creditText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0e456fff',
  },
  creditNumber: {
    fontWeight: '700',
    color: '#f1a345ff',
  },
  creditWarning: {
    fontSize: 14,
    color: '#ff6b6b',
    fontWeight: '600',
    marginTop: 5,
  },
  courseCount: {
    fontSize: 14,
    color: '#0e456fff',
    marginTop: 5,
    fontWeight: '600',
  },
  coursesContainer: {
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0e456fff',
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f1a345ff',
    paddingLeft: 10,
  },
  courseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCourseCard: {
    borderColor: '#f1a345ff',
    backgroundColor: 'rgba(241, 163, 69, 0.1)',
  },
  currentlyEnrolledCard: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#82cbebff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#f1a345ff',
    borderColor: '#f1a345ff',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e456fff',
    marginBottom: 2,
  },
  courseCode: {
    fontSize: 14,
    color: '#f1a345ff',
    fontWeight: '600',
  },
  courseInstructor: {
    fontSize: 12,
    color: '#0e456fff',
    marginTop: 2,
  },
  creditsBadge: {
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  creditsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0e456fff',
  },
  courseDescription: {
    fontSize: 13,
    color: '#0e456fff',
    lineHeight: 18,
    marginBottom: 8,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  courseSchedule: {
    fontSize: 12,
    color: '#87a8c7',
    fontWeight: '600',
  },
  enrollmentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  enrolledBadge: {
    backgroundColor: '#4CAF50',
  },
  selectedBadge: {
    backgroundColor: '#f1a345ff',
  },
  notSelectedBadge: {
    backgroundColor: '#cccccc',
  },
  enrollmentBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#0e456fff',
  },
  cancelButtonText: {
    color: '#0e456fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  enrollButton: {
    backgroundColor: '#0e456fff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  enrollButtonDisabled: {
    backgroundColor: '#87a8c7',
    opacity: 0.6,
  },
  enrollButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  processingButton: {
    backgroundColor: '#0e456fff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#82cbebff',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0e456fff',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: '#0e456fff',
    marginBottom: 4,
  },
});

export default CourseEnrollment;