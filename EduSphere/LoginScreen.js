import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { registerStudent, loginStudent } from '../Firebase/authService';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('1');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async () => {
    // Validate inputs
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    // Check for ADMIN login
    if (email === 'Admin123@admins.riphah.edu.pk') {
      if (password === '567890') {
        Alert.alert(
          'Welcome Administrator!',
          'Redirecting to Admin Dashboard',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.replace('AdminDashboard');
              }
            }
          ]
        );
        return;
      } else {
        Alert.alert('Invalid Password', 'Please enter correct administrator password');
        return;
      }
    }

    // For STUDENT login/signup
    if (!email.endsWith('@students.riphah.edu.pk')) {
      Alert.alert('Invalid Email', 'Please use Riphah University student email (@students.riphah.edu.pk)');
      return;
    }

    // Student email validation
    const emailPattern = /^\d+@students\.riphah\.edu\.pk$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Invalid Student Email', 'Please use format: 12345@students.riphah.edu.pk');
      return;
    }

    if (!isLogin) {
      // Signup validations (only for students)
      if (!fullName.trim()) {
        Alert.alert('Error', 'Please enter your full name');
        return;
      }
      if (!department.trim()) {
        Alert.alert('Error', 'Please enter your department');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match!');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Error', 'Password should be at least 6 characters');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN with Firebase (STUDENTS ONLY)
        const result = await loginStudent(email, password);
        
        if (result.success) {
          Alert.alert('Success', `Welcome ${result.sapId}!`, [
            { 
              text: 'OK', 
              onPress: () => {
                navigation.replace('Profile', { 
                  userEmail: email,
                  sapId: result.sapId,
                  userId: result.user.uid
                });
              }
            }
          ]);
        } else {
          Alert.alert('Login Failed', result.error);
        }
      } else {
        // REGISTER with Firebase (STUDENTS ONLY)
        const studentData = {
          fullName: fullName.trim(),
          department: department.trim(),
          semester: parseInt(semester)
        };

        const result = await registerStudent(email, password, studentData);
        
        if (result.success) {
          Alert.alert('Success', 'Registration successful! Please login.', [
            { 
              text: 'OK', 
              onPress: () => {
                setIsLogin(true);
                setFullName('');
                setDepartment('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }
            }
          ]);
        } else {
          Alert.alert('Registration Failed', result.error);
        }
      }
    } catch (error) {
      console.error('Auth Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert(
        'Forgot Password',
        'Please enter your email first',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Password Reset',
      `Reset link sent to: ${email}\n\nPlease check your email inbox.`,
      [{ text: 'OK' }]
    );
  };

  const extractSapId = (email) => {
    return email.split('@')[0];
  };

  const handleAdminLoginToggle = () => {
    if (!isAdminLogin) {
      // Switching to Admin - set admin email and clear student form fields
      setEmail('Admin123@admins.riphah.edu.pk');
      setFullName('');
      setDepartment('');
      setSemester('1');
      setConfirmPassword('');
      setIsLogin(true); // Force login mode for admin
    } else {
      // Switching to Student - clear admin email and reset
      setEmail('');
    }
    setIsAdminLogin(!isAdminLogin);
  };

  const handleStudentToggle = () => {
    if (isAdminLogin) {
      // Switching from Admin to Student - clear admin email
      setEmail('');
    }
    setIsAdminLogin(false);
  };

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

      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image 
            source={{ uri: 'https://jrcrs.riphah.edu.pk/wp-content/uploads/2017/05/RIU-logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.welcomeText}>
            {isLogin ? 'EduSphere Portal' : 'Create Account'}
          </Text>

          {/* Admin/Student Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[
                styles.toggleButton,
                !isAdminLogin && styles.toggleButtonActive
              ]}
              onPress={handleStudentToggle}
            >
              <Text style={[
                styles.toggleText,
                !isAdminLogin && styles.toggleTextActive
              ]}>
                Student
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.toggleButton,
                isAdminLogin && styles.toggleButtonActive
              ]}
              onPress={handleAdminLoginToggle}
            >
              <Text style={[
                styles.toggleText,
                isAdminLogin && styles.toggleTextActive
              ]}>
                Administrator
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Type Indicator */}
          <View style={styles.loginTypeIndicator}>
            <Text style={styles.loginTypeText}>
              {isAdminLogin ? 'Admin Login' : (isLogin ? 'Student Login' : 'Student Sign Up')}
            </Text>
            <Text style={styles.loginTypeSubtext}>
              {isAdminLogin 
                ? 'Access administrative dashboard' 
                : (isLogin ? 'Access student dashboard' : 'Create student account')}
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            {/* Show student info only for student signup */}
            {!isLogin && !isAdminLogin && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#87a8c7"
                    value={fullName}
                    onChangeText={setFullName}
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Department</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Computer Science"
                    placeholderTextColor="#87a8c7"
                    value={department}
                    onChangeText={setDepartment}
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Semester</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter semester (1-8)"
                    placeholderTextColor="#87a8c7"
                    value={semester}
                    onChangeText={setSemester}
                    keyboardType="number-pad"
                    editable={!loading}
                  />
                </View>
              </>
            )}

            {/* Email Input - Different placeholder for admin/student */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {isAdminLogin ? 'Admin Email' : 'Email Address'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  isAdminLogin 
                    ? "Admin123@admins.riphah.edu.pk" 
                    : "12345@students.riphah.edu.pk"
                }
                placeholderTextColor="#87a8c7"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              {isAdminLogin && (
                <Text style={styles.hintText}>
                  Admin email is pre-filled. Just enter password.
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder={
                  isLogin 
                    ? "Enter your password" 
                    : "Create password (min. 6 characters)"
                }
                placeholderTextColor="#87a8c7"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Confirm Password (Student signup only) */}
            {!isLogin && !isAdminLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#87a8c7"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  editable={!loading}
                />
              </View>
            )}

            {/* SAP ID Preview (Student only) */}
            {!isAdminLogin && email.includes('@students.riphah.edu.pk') && (
              <View style={styles.sapIdContainer}>
                <Text style={styles.sapIdText}>
                  Your SAP ID: <Text style={styles.sapIdValue}>{extractSapId(email)}</Text>
                </Text>
              </View>
            )}

            {/* Admin Login Note */}
            {isAdminLogin && (
              <View style={styles.adminNoteContainer}>
                <Text style={styles.adminNoteText}>
                  ⚠️ Admin access is restricted to authorized personnel only.
                </Text>
              </View>
            )}

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0e456fff" />
                <Text style={styles.loadingText}>
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </Text>
              </View>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLogin ? 'Login' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>

                {/* Forget Password (Login only) */}
                {isLogin && (
                  <TouchableOpacity 
                    style={styles.forgotPasswordButton}
                    onPress={handleForgotPassword}
                    disabled={loading}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* Switch between Login/Signup (Student only) */}
            {!isAdminLogin && (
              <TouchableOpacity 
                style={styles.switchButton}
                onPress={() => {
                  if (!isLogin) {
                    // Clear form when switching to login
                    setFullName('');
                    setDepartment('');
                    setSemester('1');
                    setConfirmPassword('');
                  }
                  setIsLogin(!isLogin);
                }}
                disabled={loading}
              >
                <Text style={styles.switchButtonText}>
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.17,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0e456fff',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'System',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(33, 118, 187, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // Toggle Container
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 5,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#0e456fff',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  loginTypeIndicator: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginTypeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e456fff',
    marginBottom: 5,
  },
  loginTypeSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: 330,
    marginTop: -10,

  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e456fff',
    marginBottom: 10,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#82cbebff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#0e456fff',
    fontFamily: 'System',
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  sapIdContainer: {
    backgroundColor: '#e8f4ff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f1a345ff',
  },
  sapIdText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0e456fff',
    fontFamily: 'System',
  },
  sapIdValue: {
    fontWeight: '700',
    color: '#f1a345ff',
  },
  adminNoteContainer: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  adminNoteText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '500',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: -5,
    padding: 10,
  },
  forgotPasswordText: {
    color: '#0e456fff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'System',
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: '#0e456fff',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: 1,
  },
  switchButton: {
    marginTop: 10,
    padding: 10,
  },
  switchButtonText: {
    color: '#0e456fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'System',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0e456fff',
    fontWeight: '600',
  },
});

export default LoginScreen;