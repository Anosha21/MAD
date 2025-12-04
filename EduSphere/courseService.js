// Firebase/courseService.js - COMPLETE CORRECT VERSION
import { ref, get, update, set } from 'firebase/database';
import { database } from './firebaseConfig';

// Available courses for enrollment - WITH 'id' FIELD ADDED
export const availableCourses = {
  'CS101': {
    id: 'CS101',
    courseId: 'CS101',
    code: 'CS101',
    name: 'Introduction to Programming',
    credits: 3,
    instructor: 'Dr. Ali Khan',
    schedule: 'Mon/Wed 9:00-10:30 AM',
    room: 'CS-101',
    semester: 1,
    maxStudents: 50,
    description: 'Learn basic programming concepts and problem-solving using Python.'
  },
  'CS102': {
    id: 'CS102',
    courseId: 'CS102',
    code: 'CS102',
    name: 'Discrete Mathematics',
    credits: 3,
    instructor: 'Dr. Sara Ahmed',
    schedule: 'Tue/Thu 11:00-12:30 PM',
    room: 'MATH-202',
    semester: 1,
    maxStudents: 45,
    description: 'Fundamental concepts of discrete mathematics for computer science.'
  },
  'CS201': {
    id: 'CS201',
    courseId: 'CS201',
    code: 'CS201',
    name: 'Data Structures',
    credits: 4,
    instructor: 'Dr. Raza Hassan',
    schedule: 'Mon/Wed 2:00-3:30 PM',
    room: 'CS-301',
    semester: 2,
    maxStudents: 40,
    description: 'Study of fundamental data structures and algorithms.'
  },
  'CS202': {
    id: 'CS202',
    courseId: 'CS202',
    code: 'CS202',
    name: 'Object Oriented Programming',
    credits: 3,
    instructor: 'Dr. Fatima Noor',
    schedule: 'Tue/Thu 9:00-10:30 AM',
    room: 'CS-302',
    semester: 2,
    maxStudents: 40,
    description: 'Principles of object-oriented programming using Java.'
  },
  'CS301': {
    id: 'CS301',
    courseId: 'CS301',
    code: 'CS301',
    name: 'Database Systems',
    credits: 4,
    instructor: 'Dr. Omar Farooq',
    schedule: 'Mon/Wed 11:00-12:30 PM',
    room: 'CS-401',
    semester: 3,
    maxStudents: 35,
    description: 'Introduction to database design and SQL programming.'
  },
  'CS302': {
    id: 'CS302',
    courseId: 'CS302',
    code: 'CS302',
    name: 'Operating Systems',
    credits: 4,
    instructor: 'Dr. Ayesha Malik',
    schedule: 'Tue/Thu 2:00-3:30 PM',
    room: 'CS-402',
    semester: 3,
    maxStudents: 35,
    description: 'Fundamentals of operating systems and process management.'
  },
  'MATH101': {
    id: 'MATH101',
    courseId: 'MATH101',
    code: 'MATH101',
    name: 'Calculus I',
    credits: 4,
    instructor: 'Dr. Imran Shah',
    schedule: 'Mon/Wed 10:00-11:30 AM',
    room: 'MATH-101',
    semester: 1,
    maxStudents: 60,
    description: 'Introduction to differential and integral calculus.'
  },
  'ENG101': {
    id: 'ENG101',
    courseId: 'ENG101',
    code: 'ENG101',
    name: 'English Composition',
    credits: 3,
    instructor: 'Dr. Sarah Johnson',
    schedule: 'Tue/Thu 1:00-2:30 PM',
    room: 'ENG-101',
    semester: 1,
    maxStudents: 55,
    description: 'Developing writing skills for academic and professional purposes.'
  }
};

// Get all available courses
export const getAllCourses = () => {
  try {
    const coursesArray = Object.values(availableCourses);
    console.log('[DEBUG] getAllCourses - Loaded:', coursesArray.map(c => ({id: c.id, name: c.name})));
    return {
      success: true,
      courses: coursesArray,
      count: coursesArray.length
    };
  } catch (error) {
    console.error('Get Courses Error:', error);
    return {
      success: false,
      error: error.message,
      courses: []
    };
  }
};

// Get course by ID
export const getCourseById = (courseId) => {
  const course = availableCourses[courseId];
  return course ? { ...course, id: courseId } : null;
};

// Enroll student in a course
export const enrollInCourse = async (userId, courseId) => {
  try {
    console.log(`[DEBUG] Enrolling user ${userId} in course ${courseId}`);
    
    // 1. Get student data
    const studentRef = ref(database, `students/${userId}`);
    const studentSnapshot = await get(studentRef);
    
    if (!studentSnapshot.exists()) {
      throw new Error('Student not found');
    }
    
    const studentData = studentSnapshot.val();
    const enrolledCourses = studentData.enrolledCourses || {};
    
    // 2. Get course details
    const course = availableCourses[courseId];
    if (!course) {
      throw new Error('Course not found');
    }
    
    // 3. Check if already enrolled
    if (enrolledCourses[courseId]) {
      throw new Error('Already enrolled in this course');
    }
    
    // 4. Calculate total credits
    let totalCredits = 0;
    Object.values(enrolledCourses).forEach(course => {
      totalCredits += course.credits || 0;
    });
    
    const newTotal = totalCredits + course.credits;
    
    // 5. Check credit limit (20)
    if (newTotal > 20) {
      throw new Error(`Credit limit exceeded! Maximum: 20, You will have: ${newTotal}`);
    }
    
    // 6. Add course to enrolled courses WITH 'id' FIELD
    const courseData = {
      ...course,
      id: courseId, // Ensure 'id' field is present
      enrolledDate: new Date().toISOString(),
      status: 'enrolled'
    };
    
    // 7. Update database
    await update(ref(database, `students/${userId}/enrolledCourses`), {
      [courseId]: courseData
    });
    
    // 8. Update timetable
    await updateTimetable(userId, courseData);
    
    console.log('[DEBUG] Course enrollment successful for', courseId);
    return {
      success: true,
      message: `Successfully enrolled in ${course.name}`,
      course: courseData,
      totalCredits: newTotal
    };
    
  } catch (error) {
    console.error('Enroll Course Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Drop a course
export const dropCourse = async (userId, courseId) => {
  try {
    console.log(`[DEBUG] Dropping course ${courseId} for user ${userId}`);
    
    // 1. Get student data
    const studentRef = ref(database, `students/${userId}`);
    const studentSnapshot = await get(studentRef);
    
    if (!studentSnapshot.exists()) {
      throw new Error('Student not found');
    }
    
    const studentData = studentSnapshot.val();
    const enrolledCourses = studentData.enrolledCourses || {};
    
    // 2. Check if course exists in enrolled courses
    if (!enrolledCourses[courseId]) {
      throw new Error('Course not found in your enrolled courses');
    }
    
    // 3. Remove course from enrolled courses
    const updatedCourses = { ...enrolledCourses };
    delete updatedCourses[courseId];
    
    // 4. Update database
    await update(ref(database, `students/${userId}`), {
      enrolledCourses: updatedCourses
    });
    
    // 5. Remove from timetable
    await removeFromTimetable(userId, courseId);
    
    // 6. Calculate new total credits
    let newTotal = 0;
    Object.values(updatedCourses).forEach(course => {
      newTotal += course.credits || 0;
    });
    
    console.log('[DEBUG] Course dropped successfully:', courseId);
    return {
      success: true,
      message: `Course dropped successfully`,
      totalCredits: newTotal
    };
    
  } catch (error) {
    console.error('Drop Course Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get enrolled courses for a student
export const getEnrolledCourses = async (userId) => {
  try {
    console.log(`[DEBUG] Getting enrolled courses for user: ${userId}`);
    
    const studentRef = ref(database, `students/${userId}`);
    const studentSnapshot = await get(studentRef);
    
    if (!studentSnapshot.exists()) {
      console.log('[DEBUG] Student not found:', userId);
      return { 
        success: false, 
        error: 'Student not found', 
        courses: [], 
        totalCredits: 0 
      };
    }
    
    const studentData = studentSnapshot.val();
    const enrolledCourses = studentData.enrolledCourses || {};
    
    // Convert object to array and ensure each has 'id' field
    const coursesArray = Object.values(enrolledCourses).map(course => ({
      ...course,
      id: course.courseId || course.id || course.code // Multiple fallbacks for 'id'
    }));
    
    // Calculate total credits
    let totalCredits = 0;
    coursesArray.forEach(course => {
      totalCredits += course.credits || 0;
    });
    
    console.log('[DEBUG] Enrolled courses found:', coursesArray.map(c => ({id: c.id, name: c.name})));
    
    return {
      success: true,
      courses: coursesArray,
      totalCredits: totalCredits,
      count: coursesArray.length
    };
    
  } catch (error) {
    console.error('Get Enrolled Courses Error:', error);
    return {
      success: false,
      error: error.message,
      courses: [],
      totalCredits: 0
    };
  }
};

// Update timetable when enrolling in course
const updateTimetable = async (userId, course) => {
  try {
    console.log(`[DEBUG] Updating timetable for ${userId}, course: ${course.code}`);
    
    // Extract day from schedule (e.g., "Mon/Wed" -> ["Mon", "Wed"])
    const days = course.schedule.split('/').map(day => day.trim());
    
    // Get current timetable
    const studentRef = ref(database, `students/${userId}`);
    const studentSnapshot = await get(studentRef);
    
    if (studentSnapshot.exists()) {
      const studentData = studentSnapshot.val();
      const timetable = studentData.timetable || {};
      
      // Add course to each day in the schedule
      days.forEach(day => {
        // Initialize day array if not exists
        if (!timetable[day]) {
          timetable[day] = [];
        }
        
        // Check if course already exists in timetable for this day
        const exists = timetable[day].some(item => 
          item.courseCode === course.code && item.day === day
        );
        
        if (!exists) {
          // Add course to timetable
          timetable[day].push({
            courseId: course.id,
            courseCode: course.code,
            courseName: course.name,
            time: course.schedule,
            room: course.room,
            instructor: course.instructor,
            day: day
          });
        }
      });
      
      // Update database
      await update(ref(database, `students/${userId}`), {
        timetable: timetable
      });
      
      console.log('[DEBUG] Timetable updated for days:', days);
    }
  } catch (error) {
    console.error('Update Timetable Error:', error);
  }
};

// Remove from timetable when dropping course
const removeFromTimetable = async (userId, courseId) => {
  try {
    console.log(`[DEBUG] Removing course ${courseId} from timetable for ${userId}`);
    
    const studentRef = ref(database, `students/${userId}`);
    const studentSnapshot = await get(studentRef);
    
    if (studentSnapshot.exists()) {
      const studentData = studentSnapshot.val();
      const timetable = studentData.timetable || {};
      const course = availableCourses[courseId];
      
      if (course) {
        // Extract days from schedule
        const days = course.schedule.split('/').map(day => day.trim());
        
        // Remove course from all days
        days.forEach(day => {
          if (timetable[day]) {
            // Filter out the course
            timetable[day] = timetable[day].filter(item => 
              item.courseId !== courseId && item.courseCode !== course.code
            );
            
            // Remove day if empty
            if (timetable[day].length === 0) {
              delete timetable[day];
            }
          }
        });
        
        // Update database
        await update(ref(database, `students/${userId}`), {
          timetable: timetable
        });
        
        console.log('[DEBUG] Course removed from timetable:', courseId);
      }
    }
  } catch (error) {
    console.error('Remove from Timetable Error:', error);
  }
};

// Get student timetable
export const getStudentTimetable = async (userId) => {
  try {
    console.log(`[DEBUG] Getting timetable for user: ${userId}`);
    
    const studentRef = ref(database, `students/${userId}`);
    const studentSnapshot = await get(studentRef);
    
    if (!studentSnapshot.exists()) {
      return { 
        success: false, 
        error: 'Student not found', 
        timetable: {} 
      };
    }
    
    const studentData = studentSnapshot.val();
    const timetable = studentData.timetable || {};
    
    return {
      success: true,
      timetable: timetable
    };
    
  } catch (error) {
    console.error('Get Timetable Error:', error);
    return {
      success: false,
      error: error.message,
      timetable: {}
    };
  }
};

// Check if student can enroll in more courses (credit limit check)
export const checkCreditLimit = async (userId, additionalCredits = 0) => {
  try {
    const enrolled = await getEnrolledCourses(userId);
    
    if (!enrolled.success) {
      return {
        success: false,
        error: enrolled.error,
        canEnroll: false
      };
    }
    
    const totalAfter = enrolled.totalCredits + additionalCredits;
    const canEnroll = totalAfter <= 20;
    
    return {
      success: true,
      currentCredits: enrolled.totalCredits,
      proposedCredits: totalAfter,
      canEnroll: canEnroll,
      message: canEnroll ? 
        `You can enroll (${totalAfter}/20 credits)` : 
        `Credit limit exceeded! (${totalAfter}/20 credits)`
    };
    
  } catch (error) {
    console.error('Check Credit Limit Error:', error);
    return {
      success: false,
      error: error.message,
      canEnroll: false
    };
  }
};

// Get course enrollment status
export const getCourseEnrollmentStatus = async (userId, courseId) => {
  try {
    const enrolled = await getEnrolledCourses(userId);
    
    if (!enrolled.success) {
      return {
        success: false,
        error: enrolled.error,
        isEnrolled: false
      };
    }
    
    const isEnrolled = enrolled.courses.some(course => 
      course.id === courseId || course.courseId === courseId || course.code === courseId
    );
    
    return {
      success: true,
      isEnrolled: isEnrolled,
      course: isEnrolled ? enrolled.courses.find(c => 
        c.id === courseId || c.courseId === courseId || c.code === courseId
      ) : null
    };
    
  } catch (error) {
    console.error('Get Course Enrollment Status Error:', error);
    return {
      success: false,
      error: error.message,
      isEnrolled: false
    };
  }
};