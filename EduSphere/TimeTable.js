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
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import Firebase services
import { getStudentTimetable, getEnrolledCourses } from '../Firebase/courseService';
import { getCurrentUser, getStudentProfile } from '../Firebase/authService';

const { width, height } = Dimensions.get('window');

const TimeTable = ({ navigation, route }) => {
  const { userEmail, userId } = route.params || {};
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [generatedTimetable, setGeneratedTimetable] = useState({});
  const [activeDay, setActiveDay] = useState('Monday');

  // Load timetable data from Firebase
  useEffect(() => {
    loadTimetableData();
  }, []);

  // Generate timetable from enrolled courses
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      generateTimetableFromCourses();
    }
  }, [enrolledCourses]);

  const loadTimetableData = async () => {
    try {
      setLoading(true);

      const currentUser = getCurrentUser();
      const userUid = userId || currentUser?.uid;

      if (!userUid) {
        Alert.alert('Error', 'User not logged in');
        navigation.goBack();
        return;
      }

      const profileResult = await getStudentProfile(userUid);
      if (profileResult.success) {
        setStudentData(profileResult.data);
      }

      const coursesResult = await getEnrolledCourses(userUid);
      if (coursesResult.success) {
        setEnrolledCourses(coursesResult.courses);
        setTotalCredits(coursesResult.totalCredits);
      }

      const timetableResult = await getStudentTimetable(userUid);
      if (timetableResult.success) {
        setTimetableData(timetableResult.timetable || {});
      }

    } catch (error) {
      console.error('Error loading timetable:', error);
      Alert.alert('Error', 'Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  };

  const generateTimetableFromCourses = () => {
    const timetable = {};

    enrolledCourses.forEach(course => {
      if (course.schedule) {
        const scheduleParts = course.schedule.split(' ');
        const daysPart = scheduleParts[0];

        if (daysPart.includes('/')) {
          const days = daysPart.split('/');

          days.forEach(day => {
            const fullDayName = getFullDayName(day.trim());
            if (fullDayName) {
              if (!timetable[fullDayName]) {
                timetable[fullDayName] = [];
              }

              const exists = timetable[fullDayName].some(item =>
                item.courseCode === course.code || item.courseId === course.id
              );

              if (!exists) {
                // Extract time from schedule
                const timePart = scheduleParts.slice(1).join(' ');
                timetable[fullDayName].push({
                  courseId: course.id,
                  courseCode: course.code,
                  courseName: course.name,
                  time: timePart, // Just the time part (e.g., "9:00-10:30 AM")
                  fullSchedule: course.schedule, // Keep original for reference
                  room: course.room,
                  instructor: course.instructor,
                  credits: course.credits,
                  day: fullDayName
                });
              }
            }
          });
        }
      }
    });

    // Sort classes by time
    Object.keys(timetable).forEach(day => {
      timetable[day].sort((a, b) => extractTimeValue(a.time) - extractTimeValue(b.time));
    });

    setGeneratedTimetable(timetable);
  };

  const getFullDayName = (shortDay) => {
    const dayMap = {
      'Mon': 'Monday',
      'Tue': 'Tuesday',
      'Wed': 'Wednesday',
      'Thu': 'Thursday',
      'Fri': 'Friday',
      'Sat': 'Saturday',
      'Sun': 'Sunday'
    };
    return dayMap[shortDay] || shortDay;
  };

  const extractTimeValue = (timeString) => {
    const timeMatch = timeString.match(/(\d+):(\d+)\s*([ap]m)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3]?.toLowerCase();

      if (ampm === 'pm' && hours < 12) hours += 12;
      if (ampm === 'am' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    }
    return 0;
  };

  const getSapId = () => {
    if (studentData?.sapId) {
      return studentData.sapId;
    }
    if (userEmail) {
      return userEmail.split('@')[0];
    }
    return 'N/A';
  };

  const getStudentName = () => studentData?.fullName || 'Student';
  const getDepartment = () => studentData?.department || 'Not specified';
  const getSemester = () => studentData?.semester ? `Semester ${studentData.semester}` : '';

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', ];
  const displayTimetable = Object.keys(generatedTimetable).length > 0 ? generatedTimetable : timetableData;

  // Sort days that have classes first
  const sortedDays = [...daysOfWeek].sort((a, b) => {
    const aHasClasses = displayTimetable[a]?.length > 0;
    const bHasClasses = displayTimetable[b]?.length > 0;
    if (aHasClasses && !bHasClasses) return -1;
    if (!aHasClasses && bHasClasses) return 1;
    return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
  });

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
          <Text style={styles.loadingText}>Loading timetable...</Text>
        </View>
      </View>
    );
  }

  const hasTimetable = enrolledCourses.length > 0;

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

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <Image 
          source={{ uri: 'https://jrcrs.riphah.edu.pk/wp-content/uploads/2017/05/RIU-logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.sectionTitle}>Weekly Timetable</Text>

        <View style={styles.studentInfoCard}>
          <View style={styles.studentHeader}>
            <Text style={styles.studentName}>{getStudentName()}</Text>
            <Text style={styles.studentSapId}>SAP ID: {getSapId()}</Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentDetail}>{getDepartment()}</Text>
            <Text style={styles.studentDetail}>{getSemester()}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{enrolledCourses.length}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCredits}</Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Object.keys(displayTimetable).filter(day => displayTimetable[day]?.length > 0).length}
            </Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
        </View>

        {/* Day Selector Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabsContainer}>
          {sortedDays.map(day => {
            const hasClasses = displayTimetable[day]?.length > 0;
            const isActive = activeDay === day;
            
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayTab,
                  isActive && styles.dayTabActive,
                  !hasClasses && styles.dayTabNoClasses
                ]}
                onPress={() => setActiveDay(day)}
              >
                <Text style={[
                  styles.dayTabText,
                  isActive && styles.dayTabTextActive,
                  !hasClasses && styles.dayTabTextNoClasses
                ]}>
                  {day.substring(0, 3)}
                </Text>
                {hasClasses && (
                  <View style={styles.classCountBadge}>
                    <Text style={styles.classCountText}>{displayTimetable[day]?.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Day's Timetable */}
        <View style={styles.selectedDayContainer}>
          <View style={styles.selectedDayHeader}>
            <Text style={styles.selectedDayTitle}>{activeDay}</Text>
            <Text style={styles.selectedDaySubtitle}>
              {displayTimetable[activeDay]?.length || 0} Classes
            </Text>
          </View>

          {displayTimetable[activeDay]?.length > 0 ? (
            <View style={styles.classesContainer}>
              {displayTimetable[activeDay].map((classItem, index) => (
                <View key={index} style={styles.classCard}>
                  {/* Class Header with Time and Code */}
                  <View style={styles.classHeader}>
                    <View style={styles.timeContainer}>
                      <Text style={styles.classTime}>{classItem.time}</Text>
                      <Text style={styles.classDuration}>90 mins</Text>
                    </View>
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeText}>{classItem.courseCode}</Text>
                    </View>
                  </View>

                  {/* Course Name - Prominent */}
                  <Text style={styles.courseName}>{classItem.courseName}</Text>

                  {/* Credits and Instructor in separate rows */}
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoIcon}>📚</Text>
                      <Text style={styles.infoLabel}>{classItem.credits} Credits</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoIcon}>👨‍🏫</Text>
                      <Text style={styles.infoLabel}>{classItem.instructor}</Text>
                    </View>
                  </View>

                  {/* Room - Separate with emphasis */}
                  <View style={styles.roomRow}>
                    <Text style={styles.roomIcon}>📍</Text>
                    <Text style={styles.roomText}>Room: {classItem.room}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noClassesContainer}>
              <Text style={styles.noClassesIcon}>📅</Text>
              <Text style={styles.noClassesTitle}>No Classes</Text>
              <Text style={styles.noClassesText}>
                You have no classes scheduled for {activeDay}
              </Text>
            </View>
          )}
        </View>

        {/* Back to Profile Button */}
        <TouchableOpacity 
          style={styles.backToProfileButton}
          onPress={() => navigation.navigate('Profile', {
            userEmail,
            userId: userId || getCurrentUser()?.uid
          })}
        >
          <Text style={styles.backToProfileButtonText}>← Back to Profile</Text>
        </TouchableOpacity>

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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#0e456fff',
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e456fff',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.15,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0e456fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(33, 118, 187, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  studentInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0e456fff',
  },
  studentSapId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f1a345ff',
    backgroundColor: 'rgba(241, 163, 69, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  studentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studentDetail: {
    fontSize: 14,
    color: '#0e456fff',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1a345ff',
  },
  statLabel: {
    fontSize: 12,
    color: '#0e456fff',
    marginTop: 5,
    fontWeight: '600',
  },
  dayTabsContainer: {
    marginBottom: 25,
  },
  dayTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dayTabActive: {
    backgroundColor: '#0e456fff',
  },
  dayTabNoClasses: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dayTabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0e456fff',
  },
  dayTabTextActive: {
    color: '#FFFFFF',
  },
  dayTabTextNoClasses: {
    color: '#999',
  },
  classCountBadge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  classCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedDayContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e8f4ff',
  },
  selectedDayTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0e456fff',
  },
  selectedDaySubtitle: {
    fontSize: 14,
    color: '#ff6b6b',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  classesContainer: {
    // Container for all class cards
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8f4ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeContainer: {
    alignItems: 'flex-start',
  },
  classTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0e456fff',
    marginBottom: 4,
  },
  classDuration: {
    fontSize: 13,
    color: '#87a8c7',
    fontWeight: '500',
  },
  codeBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  codeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  courseName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0e456fff',
    marginBottom: 20,
    lineHeight: 26,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#0e456fff',
    fontWeight: '600',
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  roomIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#0e456fff',
  },
  roomText: {
    fontSize: 15,
    color: '#0e456fff',
    fontWeight: '600',
  },
  noClassesContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noClassesIcon: {
    fontSize: 50,
    marginBottom: 15,
    opacity: 0.5,
  },
  noClassesTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0e456fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  noClassesText: {
    fontSize: 16,
    color: '#87a8c7',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  backToProfileButton: {
    backgroundColor: '#0e456fff',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backToProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TimeTable;