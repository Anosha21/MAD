// Firebase/authService.js
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get, update, remove } from 'firebase/database';
import { auth, database } from './firebaseConfig';

// Check if email is valid Riphah format
export const isValidRiphahEmail = (email) => {
  const pattern = /^\d+@students\.riphah\.edu\.pk$/;
  return pattern.test(email);
};

// Extract SAP ID from email
export const extractSapId = (email) => {
  return email.split('@')[0];
};

// ============ STUDENT REGISTRATION ============
export const registerStudent = async (email, password, studentData) => {
  try {
    console.log('Starting registration for:', email);
    
    // 1. Validate Riphah email format
    if (!isValidRiphahEmail(email)) {
      throw new Error('Please use format: 12345@students.riphah.edu.pk');
    }

    // 2. Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const sapId = extractSapId(email);
    
    console.log('User created with UID:', user.uid);

    // 3. Create student profile in Realtime Database
    const studentProfile = {
      sapId: sapId,
      email: email,
      fullName: studentData.fullName || '',
      phone: studentData.phone || '',
      department: studentData.department || 'Computer Science',
      semester: parseInt(studentData.semester) || 1,
      enrolledCourses: {},  // Empty object for courses
      timetable: {},       // Empty object for timetable
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      profileComplete: false
    };

    // Save to database: students/UID
    await set(ref(database, `students/${user.uid}`), studentProfile);
    
    console.log('Student profile saved to database');

    return {
      success: true,
      user: user,
      sapId: sapId,
      message: 'Registration successful! You can now login.'
    };

  } catch (error) {
    console.error('Registration Error:', error.code, error.message);
    
    let errorMessage = 'Registration failed. ';
    
    // Handle common Firebase errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered. Please login.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email format. Use: 12345@students.riphah.edu.pk';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Check your internet connection.';
        break;
      default:
        errorMessage += error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage,
      errorCode: error.code 
    };
  }
};

// ============ STUDENT LOGIN ============
export const loginStudent = async (email, password) => {
  try {
    console.log('Login attempt for:', email);
    
    // Validate email format
    if (!isValidRiphahEmail(email)) {
      throw new Error('Please use valid Riphah student email format');
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const sapId = extractSapId(email);
    
    console.log('Login successful for UID:', user.uid);

    // Update last login timestamp
    await update(ref(database, `students/${user.uid}`), {
      lastLogin: new Date().toISOString()
    });

    return {
      success: true,
      user: user,
      sapId: sapId,
      message: `Welcome ${sapId}!`
    };

  } catch (error) {
    console.error('Login Error:', error.code, error.message);
    
    let errorMessage = 'Login failed. ';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Student not found. Please register first.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Try again later.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Check your internet connection.';
        break;
      default:
        errorMessage += error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage,
      errorCode: error.code 
    };
  }
};

// ============ STUDENT LOGOUT ============
export const logoutStudent = async () => {
  try {
    await signOut(auth);
    return { 
      success: true, 
      message: 'Logged out successfully' 
    };
  } catch (error) {
    console.error('Logout Error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// ============ GET STUDENT PROFILE ============
export const getStudentProfile = async (userId) => {
  try {
    console.log('Fetching profile for UID:', userId);
    
    const snapshot = await get(ref(database, `students/${userId}`));
    
    if (snapshot.exists()) {
      const profileData = snapshot.val();
      console.log('Profile found:', profileData);
      
      return {
        success: true,
        data: {
          id: userId,
          ...profileData
        }
      };
    } else {
      console.log('Profile not found in database');
      return { 
        success: false, 
        error: 'Student profile not found' 
      };
    }
  } catch (error) {
    console.error('Get Profile Error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// ============ UPDATE STUDENT PROFILE ============
export const updateStudentProfile = async (userId, updateData) => {
  try {
    await update(ref(database, `students/${userId}`), updateData);
    return { 
      success: true, 
      message: 'Profile updated successfully' 
    };
  } catch (error) {
    console.error('Update Profile Error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// ============ GET CURRENT USER ============
export const getCurrentUser = () => {
  return auth.currentUser;
};

// ============ AUTH STATE LISTENER ============
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ============ CHECK AUTH STATUS ============
export const checkAuthStatus = async () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// ============ DELETE STUDENT ACCOUNT ============
export const deleteStudentAccount = async (userId) => {
  try {
    // Remove from Realtime Database
    await remove(ref(database, `students/${userId}`));
    
    // Note: To delete auth account, need re-authentication
    return { 
      success: true, 
      message: 'Account data removed' 
    };
  } catch (error) {
    console.error('Delete Account Error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};