// Frontend/StudentListScreen.js - FIXED AUTO-LOAD
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
  TextInput,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { getAllStudents } from '../Firebase/studentService';

const { width, height } = Dimensions.get('window');

const StudentListScreen = ({ navigation, route }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  // Get filter department from params
  const filterDepartment = route.params?.filterDepartment;

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const result = await getAllStudents();
      if (result.success) {
        setStudents(result.students);
        setFilteredStudents(result.students);
        
        // Apply department filter if passed from params
        if (filterDepartment) {
          setSelectedDepartment(filterDepartment);
          filterByDepartment(filterDepartment);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => {
        const searchLower = searchQuery.toLowerCase();
        return (
          student.fullName?.toLowerCase().includes(searchLower) ||
          student.sapId?.toLowerCase().includes(searchLower) ||
          student.email?.toLowerCase().includes(searchLower) ||
          student.department?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredStudents(filtered);
    }
  };

  const filterByDepartment = (dept) => {
    if (!dept || dept === 'All') {
      setFilteredStudents(students);
      setSelectedDepartment(null);
    } else {
      const filtered = students.filter(student => 
        student.department?.toLowerCase() === dept.toLowerCase()
      );
      setFilteredStudents(filtered);
      setSelectedDepartment(dept);
    }
    setSearchQuery('');
  };

  const getDepartments = () => {
    const depts = new Set();
    students.forEach(student => {
      if (student.department) depts.add(student.department);
    });
    return Array.from(depts);
  };

  const calculateStudentCredits = (student) => {
    if (!student.enrolledCourses) return 0;
    const courses = Object.values(student.enrolledCourses);
    return courses.reduce((sum, course) => sum + (parseInt(course.credits) || 0), 0);
  };

  const handleStudentPress = (student) => {
    navigation.navigate('StudentDetailScreen', { student });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#1c6ea0ff', '#6cb5d4ff']} style={StyleSheet.absoluteFill} />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  const departments = getDepartments();

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

      {/* Header - WITHOUT REFRESH BUTTON */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image 
            source={{ uri: 'https://jrcrs.riphah.edu.pk/wp-content/uploads/2017/05/RIU-logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Student Database</Text>
        </View>

        {/* Empty space for alignment */}
        <View style={styles.emptySpace} />
      </View>

      <View style={styles.content}>
        {/* Student Count */}
        <View style={styles.countContainer}>
          <Text style={styles.studentCount}>
            Showing: <Text style={styles.countNumber}>{filteredStudents.length}</Text> of {students.length} students
            {selectedDepartment && ` • ${selectedDepartment}`}
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, SAP ID, department..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Department Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.departmentScroll}
        >
          <TouchableOpacity
            style={[
              styles.departmentChip,
              !selectedDepartment && styles.departmentChipActive
            ]}
            onPress={() => filterByDepartment('All')}
          >
            <Text style={[
              styles.departmentChipText,
              !selectedDepartment && styles.departmentChipTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          {departments.map((dept, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.departmentChip,
                selectedDepartment === dept && styles.departmentChipActive
              ]}
              onPress={() => filterByDepartment(dept)}
            >
              <Text style={[
                styles.departmentChipText,
                selectedDepartment === dept && styles.departmentChipTextActive
              ]}>
                {dept}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Student List */}
        <ScrollView 
          style={styles.studentList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.studentListContent}
        >
          {filteredStudents.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="users" size={50} color="#ccc" />
              <Text style={styles.emptyStateText}>No students found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery ? 'Try a different search term' : 'No students in database'}
              </Text>
            </View>
          ) : (
            filteredStudents.map((student, index) => {
              const courseCount = student.enrolledCourses ? Object.keys(student.enrolledCourses).length : 0;
              const totalCredits = calculateStudentCredits(student);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.studentCard}
                  onPress={() => handleStudentPress(student)}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.avatarContainer}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
                        </Text>
                      </View>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: student.isActive !== false ? '#4CAF50' : '#f44336' }
                      ]} />
                    </View>
                    
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName} numberOfLines={1}>
                        {student.fullName || 'Unknown Student'}
                      </Text>
                      <Text style={styles.studentSapId}>{student.sapId || 'N/A'}</Text>
                      <Text style={styles.studentDepartment}>{student.department || 'N/A'}</Text>
                    </View>
                    
                    <View style={styles.courseInfo}>
                      <View style={styles.courseCountBadge}>
                        <Text style={styles.courseCountText}>{courseCount}</Text>
                        <Text style={styles.courseLabel}>courses</Text>
                      </View>
                      {totalCredits > 0 && (
                        <Text style={styles.creditsText}>{totalCredits} credits</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                      <Feather name="mail" size={12} color="#666" />
                      <Text style={styles.footerText} numberOfLines={1}>
                        {student.email || 'No email'}
                      </Text>
                    </View>
                    <View style={styles.footerItem}>
                      <Feather name="hash" size={12} color="#666" />
                      <Text style={styles.footerText}>
                        Sem {student.semester || 'N/A'}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: student.isActive !== false ? '#E8F5E9' : '#FFEBEE' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: student.isActive !== false ? '#4CAF50' : '#f44336' }
                      ]}>
                        {student.isActive !== false ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
          
          {/* Extra padding at bottom for scrolling */}
          <View style={{ height: 50 }} />
        </ScrollView>
      </View>
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
  // Header - UPDATED
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
    marginTop: -105,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e456fff',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0e456fff',
    textAlign: 'center',
    marginTop: 10,
  },
  emptySpace: {
    width: 45,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  countContainer: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: -15,
  },
  studentCount: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  countNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  departmentScroll: {
    marginBottom: 15,
    maxHeight: 40,
  },
  departmentChip: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#d1e3ff',
  },
  departmentChipActive: {
    backgroundColor: '#0e456fff',
    borderColor: '#0e456fff',
  },
  departmentChipText: {
    fontSize: 12,
    color: '#0e456fff',
    fontWeight: '500',
  },
  departmentChipTextActive: {
    color: '#fff',
  },
  studentList: {
    flex: 1,
  },
  studentListContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 15,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 5,
    textAlign: 'center',
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0e456fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  studentSapId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  studentDepartment: {
    fontSize: 12,
    color: '#0e456fff',
    marginTop: 2,
    fontWeight: '500',
  },
  courseInfo: {
    alignItems: 'center',
  },
  courseCountBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 5,
  },
  courseCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  courseLabel: {
    fontSize: 9,
    color: '#1976D2',
    marginTop: 1,
  },
  creditsText: {
    fontSize: 11,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  footerText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 5,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default StudentListScreen;