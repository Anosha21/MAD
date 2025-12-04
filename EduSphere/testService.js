// Firebase/testService.js
import { auth, database } from './firebaseConfig';
import { registerStudent, loginStudent } from './authService';
import { enrollInCourse, getEnrolledCourses } from './courseService';
import { getAllStudents, getStudentStatistics } from './studentService';

// Test Firebase connection
export const testFirebaseConnection = async () => {
  console.log('========== FIREBASE CONNECTION TEST ==========');
  
  try {
    // Test 1: Check if Firebase is initialized
    console.log('1. Firebase Initialization:');
    console.log('   Auth:', auth ? '✅ Initialized' : '❌ Not initialized');
    console.log('   Database:', database ? '✅ Initialized' : '❌ Not initialized');
    
    // Test 2: Check current user
    const currentUser = auth.currentUser;
    console.log('2. Current User:', currentUser ? `✅ ${currentUser.email}` : '❌ No user logged in');
    
    // Test 3: Test database connection by reading
    console.log('3. Testing Database Read...');
    const students = await getAllStudents();
    console.log('   Database Read:', students.success ? '✅ Success' : '❌ Failed');
    console.log(`   Total Students: ${students.count}`);
    
    // Test 4: Get statistics
    const stats = await getStudentStatistics();
    if (stats.success) {
      console.log('4. Statistics:', '✅ Retrieved');
      console.log('   Departments:', stats.statistics.departments);
    }
    
    console.log('========== TEST COMPLETE ==========');
    return true;
    
  } catch (error) {
    console.error('Firebase Test Error:', error);
    console.log('========== TEST FAILED ==========');
    return false;
  }
};

// Test student registration
export const testStudentRegistration = async () => {
  console.log('========== STUDENT REGISTRATION TEST ==========');
  
  const testEmail = `test${Date.now()}@students.riphah.edu.pk`;
  const testPassword = 'test123456';
  
  try {
    const result = await registerStudent(
      testEmail,
      testPassword,
      {
        fullName: 'Test Student',
        department: 'Computer Science',
        semester: '3'
      }
    );
    
    console.log('Registration Test:', result.success ? '✅ Success' : '❌ Failed');
    console.log('Message:', result.message);
    
    if (result.success) {
      // Test login with same credentials
      const loginResult = await loginStudent(testEmail, testPassword);
      console.log('Login Test:', loginResult.success ? '✅ Success' : '❌ Failed');
      
      // Test course enrollment
      if (loginResult.success) {
        const userId = loginResult.user.uid;
        const enrollResult = await enrollInCourse(userId, 'CS101');
        console.log('Course Enrollment Test:', enrollResult.success ? '✅ Success' : '❌ Failed');
        
        // Test get enrolled courses
        const coursesResult = await getEnrolledCourses(userId);
        console.log('Get Courses Test:', coursesResult.success ? '✅ Success' : '❌ Failed');
        console.log('Enrolled Courses:', coursesResult.courses.length);
      }
    }
    
    console.log('========== REGISTRATION TEST COMPLETE ==========');
    return result.success;
    
  } catch (error) {
    console.error('Registration Test Error:', error);
    return false;
  }
};