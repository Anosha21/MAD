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
  Modal,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';

// Import Firebase services
import { getStudentProfile, logoutStudent, getCurrentUser } from '../Firebase/authService';
import { getEnrolledCourses } from '../Firebase/courseService';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation, route }) => {
  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvFileName, setCvFileName] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showMenu, setShowMenu] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeFooter, setActiveFooter] = useState('home');
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  
  // Get user info from route or Firebase
  const userId = route.params?.userId;
  const userEmail = route.params?.userEmail || '';
  const sapId = userEmail ? userEmail.split('@')[0] : '';

  // Load student data from Firebase
  useEffect(() => {
    loadStudentData();
  }, []);

  // Update enrolledCourses when student data changes
  useEffect(() => {
    if (studentData && studentData.enrolledCourses) {
      const coursesArray = Object.values(studentData.enrolledCourses || {});
      setEnrolledCourses(coursesArray);
    }
  }, [studentData]);

  // Update active footer when section changes
  useEffect(() => {
    if (activeSection === 'dashboard') {
      setActiveFooter('home');
    } else if (activeSection === 'courses') {
      setActiveFooter('courses');
    } else if (activeSection === 'cv') {
      setActiveFooter('cv');
    }
  }, [activeSection]);

  // Load student profile and enrolled courses from Firebase
  const loadStudentData = async () => {
    try {
      setLoading(true);
      
      const currentUser = getCurrentUser();
      if (!currentUser) {
        Alert.alert('Error', 'User not logged in');
        navigation.replace('Login');
        return;
      }

      const userUid = userId || currentUser.uid;
      
      const profileResult = await getStudentProfile(userUid);
      if (profileResult.success) {
        setStudentData(profileResult.data);
      } else {
        console.log('Profile not found:', profileResult.error);
      }

      const coursesResult = await getEnrolledCourses(userUid);
      if (coursesResult.success) {
        setEnrolledCourses(coursesResult.courses);
      }

    } catch (error) {
      console.error('Error loading student data:', error);
      Alert.alert('Error', 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  // CV Upload
  const handleCVUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setCvUploaded(true);
        setCvFileName(result.name);
        Alert.alert('Success', 'CV uploaded successfully!');
        setActiveSection('dashboard');
        setActiveFooter('home');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload CV. Please try again.');
    }
  };

  const handleCVUpdate = () => {
    setCvUploaded(false);
    setCvFileName('');
    handleCVUpload();
  };

  // Navigation functions
  const handleNavigateToCourseEnrollment = () => {
    navigation.navigate('CourseEnrollment', {
      userEmail,
      userId: userId || getCurrentUser()?.uid,
      enrolledCourses
    });
  };

  const handleNavigateToTimetable = () => {
    navigation.navigate('TimeTable', {
      userEmail,
      userId: userId || getCurrentUser()?.uid,
      enrolledCourses
    });
  };

  const handleNavigateToMotivationalQuotes = () => {
    navigation.navigate('MotivationalQuotes');
  };

  // Go back to dashboard
  const handleBackToDashboard = () => {
    setActiveSection('dashboard');
    setActiveFooter('home');
  };

  // Handle home button press
  const handleHomePress = () => {
    setActiveSection('dashboard');
    setActiveFooter('home');
  };

  // Handle logout with Firebase
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              const result = await logoutStudent();
              if (result.success) {
                navigation.replace('Login');
              } else {
                Alert.alert('Logout Failed', result.error || 'Unknown error');
              }
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Handle back button press
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      Alert.alert(
        'Logout Required',
        'You need to logout to go back to login screen.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Logout',
            onPress: handleLogout
          }
        ]
      );
    }
  };

  // Refresh profile data
  const handleRefresh = () => {
    loadStudentData();
    Alert.alert('Refreshed', 'Profile data updated');
  };

  // ----------------------- DASHBOARD -------------------------
  const renderDashboard = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0e456fff" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      );
    }

    const studentName = studentData?.fullName || 'Student Name';
    const studentSapId = studentData?.sapId || sapId || 'N/A';
    const studentDepartment = studentData?.department || 'Not specified';
    const studentSemester = studentData?.semester ? `Semester ${studentData.semester}` : 'Not specified';
    const totalCredits = enrolledCourses.reduce((sum, course) => sum + (course.credits || 0), 0);

    return (
      <View style={styles.dashboardContent}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/8712/8712889.png' }}
            style={styles.studentIcon}
            resizeMode="contain"
          />
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.sapId}>SAP ID: {studentSapId}</Text>
          <Text style={styles.departmentText}>{studentDepartment}</Text>
          <Text style={styles.semesterText}>{studentSemester}</Text>
          
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{enrolledCourses.length}</Text>
            <Text style={styles.statLabel}>Enrolled Courses</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCredits}</Text>
            <Text style={styles.statLabel}>Credit Hours</Text>
          </View>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to EduSphere!</Text>
          <Text style={styles.welcomeMessage}>
            Manage your academic profile, courses, and timetable all in one place.
            {enrolledCourses.length === 0 && " Start by enrolling in courses!"}
          </Text>
          
          {enrolledCourses.length === 0 && (
            <TouchableOpacity 
              style={styles.enrollNowButton} 
              onPress={handleNavigateToCourseEnrollment}
            >
              <Text style={styles.enrollNowText}>Enroll in Courses</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // ----------------------- COURSES -------------------------
  const renderEnrolledCourses = () => (
    <View style={styles.sectionContent}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0e456fff" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      ) : enrolledCourses.length > 0 ? (
        <>
          <Text style={styles.subSectionTitle}>Your Courses ({enrolledCourses.length})</Text>
          <View style={styles.coursesList}>
            {enrolledCourses.map((course, index) => (
              <View key={index} style={styles.courseCard}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.courseCredits}>{course.credits} Credit Hours</Text>
                <Text style={styles.courseInstructor}>Instructor: {course.instructor}</Text>
                <Text style={styles.courseSchedule}>Schedule: {course.schedule}</Text>
                {course.enrolledDate && (
                  <Text style={styles.courseDate}>
                    Enrolled: {new Date(course.enrolledDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.noCoursesContainer}>
          <Text style={styles.noCoursesTitle}>No Courses Enrolled</Text>
          <Text style={styles.noCoursesMessage}>
            You haven't enrolled in any courses yet. Start by enrolling in courses to manage your academic schedule.
          </Text>

          <TouchableOpacity style={styles.enrollNowButton} onPress={handleNavigateToCourseEnrollment}>
            <Text style={styles.enrollNowText}>Enroll in Courses</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.backToDashboardButton} onPress={handleBackToDashboard}>
        <Text style={styles.backToDashboardButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  // ----------------------- CV UPLOAD -------------------------
  const renderCVUpload = () => (
    <View style={styles.sectionContent}>
      {cvUploaded ? (
        <View style={styles.cvUploadedContainer}>
          <Text style={styles.cvSuccessText}>CV uploaded successfully!</Text>
          <Text style={styles.cvFileName}>{cvFileName}</Text>

          <TouchableOpacity style={styles.updateButton} onPress={handleCVUpdate}>
            <Text style={styles.updateButtonText}>Update CV</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={handleCVUpload}>
          <Text style={styles.uploadButtonText}>Upload CV (PDF)</Text>
          <Text style={styles.uploadSubText}>Max file size: 10MB</Text>
          <Text style={styles.uploadNote}>Note: CV storage is offline only</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.backToDashboardButton} onPress={handleBackToDashboard}>
        <Text style={styles.backToDashboardButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  // ----------------------- QUICK ACCESS FOOTER -------------------------
  const renderQuickAccessFooter = () => (
    <View style={styles.footerContainer}>
      {/* Home/Profile Icon */}
<TouchableOpacity 
  style={styles.footerIconButton}
  onPress={handleHomePress}
>
  <View style={[
    styles.iconCircle,
    activeFooter === 'home' && styles.activeIconCircle
  ]}>
    <Image 
      source={{ uri: 'https://cdn-icons-png.flaticon.com/128/456/456283.png' }}
      style={[
        styles.footerIconImage,
        activeFooter === 'home' && styles.activeFooterIconImage
      ]}
      resizeMode="contain"
    />
  </View>
</TouchableOpacity>

     {/* Timetable Icon */}
<TouchableOpacity 
  style={styles.footerIconButton}
  onPress={handleNavigateToTimetable}
>
  <View style={[
    styles.iconCircle,
    activeFooter === 'timetable' && styles.activeIconCircle
  ]}>
    <Image 
      source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1172/1172079.png' }}
      style={[
        styles.footerIconImage,
        activeFooter === 'timetable' && styles.activeFooterIconImage
      ]}
      resizeMode="contain"
    />
  </View>
</TouchableOpacity>

      {/* Quotes Icon */}
<TouchableOpacity 
  style={styles.footerIconButton}
  onPress={handleNavigateToMotivationalQuotes}
>
  <View style={[
    styles.iconCircle,
    activeFooter === 'quotes' && styles.activeIconCircle
  ]}>
    <Image 
      source={{ uri: 'https://cdn-icons-png.flaticon.com/128/18361/18361348.png' }}
      style={[
        styles.footerIconImage,
        activeFooter === 'quotes' && styles.activeFooterIconImage
      ]}
      resizeMode="contain"
    />
  </View>
</TouchableOpacity>
    </View>
  );

  // ----------------------- RETURN UI -------------------------
  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar backgroundColor="#87CEEB" barStyle="dark-content" />

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

      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
        <Text style={styles.menuButtonText}>☰</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        
        <Image 
          source={{ uri: 'https://jrcrs.riphah.edu.pk/wp-content/uploads/2017/05/RIU-logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.sectionTitle}>
          {activeSection === 'dashboard' ? 'Student Dashboard' : 
           activeSection === 'courses' ? 'Enrolled Courses' : 
           'CV Upload'}
        </Text>

        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'courses' && renderEnrolledCourses()}
        {activeSection === 'cv' && renderCVUpload()}
      </ScrollView>

      {renderQuickAccessFooter()}

      <Modal visible={showMenu} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowMenu(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { setActiveSection('dashboard'); setActiveFooter('home'); setShowMenu(false); }}
            >
              <Text style={styles.menuItemText}>📊 Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { setActiveSection('courses'); setActiveFooter('courses'); setShowMenu(false); }}
            >
              <Text style={styles.menuItemText}>📚 Enrolled Courses</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { setShowMenu(false); handleNavigateToTimetable(); }}
            >
              <Text style={styles.menuItemText}>📅 Timetable</Text>
            </TouchableOpacity>

            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { setShowMenu(false); handleNavigateToCourseEnrollment(); }}
            >
              <Text style={styles.menuItemText}>🎓 Course Enrollment</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { setShowMenu(false); handleNavigateToMotivationalQuotes(); }}
            >
              <Text style={styles.menuItemText}>💫 Motivational Quotes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { setShowMenu(false); handleRefresh(); }}
            >
              <Text style={styles.menuItemText}>🔄 Refresh Data</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutMenuItem}
              onPress={() => { setShowMenu(false); handleLogout(); }}
            >
              <Text style={styles.logoutMenuItemText}>🚪 Logout</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>

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
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 100, // Increased for larger footer
  },
  logo: {
    width: width * 0.5,
    height: height * 0.15,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0e456fff',
    textAlign: 'center',
    marginBottom: 20,
  },
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
    fontFamily: 'System',
  },
  menuButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e456fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    width: 250,
    height: '100%',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 15,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e456fff',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e456fff',
  },
  logoutMenuItem: {
    paddingVertical: 15,
    borderTopWidth: 2,
    borderTopColor: '#ff6b6b',
    marginTop: 20,
    backgroundColor: '#fff5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  logoutMenuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
    textAlign: 'center',
  },
  // UPDATED: Quick Access Footer - 3 icons only
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
  },
  footerIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeIconCircle: {
    backgroundColor: '#faf8f8ff',
    borderColor: '#0e456fff',
  },
  footerIcon: {
    fontSize: 28,
    color: '#ffffffff',
  },
  activeFooterIcon: {
    color: '#FFFFFF',
    fontSize: 30,
  },
  footerIconImage: {
  width: 28,
  height: 28,
  tintColor: '#030303ff',
},
activeFooterIconImage: {
  tintColor: '#0e456fff',
  width: 30,
  height: 30,
},
  // Rest of your styles remain the same...
  dashboardContent: { 
    marginBottom: 15 
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  studentIcon: { 
    width: 80, 
    height: 80, 
    marginBottom: 10 
  },
  studentName: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#0e456fff' 
  },
  sapId: { 
    fontSize: 16, 
    color: '#f1a345ff' 
  },
  departmentText: {
    fontSize: 14,
    color: '#0e456fff',
    marginTop: 5,
  },
  semesterText: {
    fontSize: 14,
    color: '#f1a345ff',
    marginTop: 2,
  },
  refreshButton: {
    backgroundColor: '#82cbebff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#0e456fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  statCard: { 
    backgroundColor: 'white', 
    borderRadius: 15, 
    padding: 15, 
    flex: 1, 
    marginHorizontal: 5 
  },
  statNumber: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#f1a345ff' 
  },
  statLabel: { 
    fontSize: 12, 
    color: '#0e456fff' 
  },
  welcomeCard: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 15 
  },
  welcomeTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#0e456fff' 
  },
  welcomeMessage: { 
    fontSize: 12, 
    color: '#0e456fff',
    marginBottom: 10,
  },
  enrollNowButton: {
    backgroundColor: '#0e456fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  enrollNowText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  sectionContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  subSectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#0e456fff', 
    marginBottom: 12 
  },
  noCoursesContainer: { 
    alignItems: 'center', 
    padding: 20 
  },
  noCoursesTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#0e456fff' 
  },
  noCoursesMessage: { 
    fontSize: 12, 
    color: '#0e456fff', 
    marginBottom: 15, 
    textAlign: 'center', 
    lineHeight: 18 
  },
  courseCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#82cbebff',
  },
  courseName: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#0e456fff' 
  },
  courseCode: { 
    fontSize: 12, 
    color: '#f1a345ff' 
  },
  courseCredits: { 
    fontSize: 12, 
    color: '#f1a345ff' 
  },
  courseInstructor: {
    fontSize: 11,
    color: '#0e456fff',
    marginTop: 3,
  },
  courseSchedule: {
    fontSize: 11,
    color: '#0e456fff',
    marginTop: 2,
  },
  courseDate: {
    fontSize: 10,
    color: '#87a8c7',
    marginTop: 2,
    fontStyle: 'italic',
  },
  // Back to Dashboard Button
  backToDashboardButton: {
    backgroundColor: '#82cbebff',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#0e456fff',
  },
  backToDashboardButtonText: { 
    color: '#0e456fff', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  cvUploadedContainer: { 
    alignItems: 'center' 
  },
  cvSuccessText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#4CAF50', 
    marginBottom: 10 
  },
  cvFileName: { 
    fontSize: 14, 
    color: '#0e456fff', 
    marginBottom: 15 
  },
  updateButton: { 
    backgroundColor: '#0e456fff', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 15 
  },
  updateButtonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  uploadButton: { 
    backgroundColor: '#e8f4ff', 
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center' 
  },
  uploadButtonText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#0e456fff' 
  },
  uploadSubText: { 
    fontSize: 12, 
    color: '#87a8c7', 
    marginTop: 5 
  },
  uploadNote: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 5,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0e456fff',
    fontWeight: '600',
  },
});

export default ProfileScreen;
