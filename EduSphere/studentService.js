// Firebase/studentService.js
import { ref, get, query, orderByChild, startAt, endAt } from 'firebase/database';
import { database } from './firebaseConfig';

// Get all registered students (for admin/report)
export const getAllStudents = async () => {
  try {
    console.log('Fetching all students...');
    
    const studentsRef = ref(database, 'students');
    const snapshot = await get(studentsRef);
    
    if (!snapshot.exists()) {
      return { 
        success: true, 
        students: [], 
        count: 0,
        message: 'No students registered yet'
      };
    }
    
    const studentsData = snapshot.val();
    const studentsArray = [];
    
    // Convert object to array
    Object.keys(studentsData).forEach(uid => {
      studentsArray.push({
        uid: uid,
        ...studentsData[uid]
      });
    });
    
    console.log(`Found ${studentsArray.length} students`);
    
    return {
      success: true,
      students: studentsArray,
      count: studentsArray.length
    };
    
  } catch (error) {
    console.error('Get All Students Error:', error);
    return {
      success: false,
      error: error.message,
      students: [],
      count: 0
    };
  }
};

// Get students by department
export const getStudentsByDepartment = async (department) => {
  try {
    const allStudents = await getAllStudents();
    
    if (!allStudents.success) {
      return allStudents;
    }
    
    const filteredStudents = allStudents.students.filter(student => 
      student.department && student.department.toLowerCase().includes(department.toLowerCase())
    );
    
    return {
      success: true,
      students: filteredStudents,
      count: filteredStudents.length,
      department: department
    };
    
  } catch (error) {
    console.error('Get Students by Department Error:', error);
    return {
      success: false,
      error: error.message,
      students: [],
      count: 0
    };
  }
};

// Get students by semester
export const getStudentsBySemester = async (semester) => {
  try {
    const allStudents = await getAllStudents();
    
    if (!allStudents.success) {
      return allStudents;
    }
    
    const filteredStudents = allStudents.students.filter(student => 
      student.semester == semester
    );
    
    return {
      success: true,
      students: filteredStudents,
      count: filteredStudents.length,
      semester: semester
    };
    
  } catch (error) {
    console.error('Get Students by Semester Error:', error);
    return {
      success: false,
      error: error.message,
      students: [],
      count: 0
    };
  }
};

// Get student statistics
export const getStudentStatistics = async () => {
  try {
    const allStudents = await getAllStudents();
    
    if (!allStudents.success) {
      return allStudents;
    }
    
    const statistics = {
      totalStudents: allStudents.count,
      activeStudents: allStudents.students.filter(s => s.isActive !== false).length,
      departments: {},
      semesters: {},
      totalCoursesEnrolled: 0
    };
    
    // Calculate statistics
    allStudents.students.forEach(student => {
      // Department statistics
      const dept = student.department || 'Unknown';
      statistics.departments[dept] = (statistics.departments[dept] || 0) + 1;
      
      // Semester statistics
      const sem = student.semester || 'Unknown';
      statistics.semesters[sem] = (statistics.semesters[sem] || 0) + 1;
      
      // Count enrolled courses
      if (student.enrolledCourses) {
        const courseCount = Object.keys(student.enrolledCourses).length;
        statistics.totalCoursesEnrolled += courseCount;
      }
    });
    
    return {
      success: true,
      statistics: statistics,
      students: allStudents.students
    };
    
  } catch (error) {
    console.error('Get Statistics Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Search student by SAP ID
export const searchStudentBySapId = async (sapId) => {
  try {
    const allStudents = await getAllStudents();
    
    if (!allStudents.success) {
      return allStudents;
    }
    
    const foundStudents = allStudents.students.filter(student => 
      student.sapId && student.sapId.includes(sapId)
    );
    
    return {
      success: true,
      students: foundStudents,
      count: foundStudents.length
    };
    
  } catch (error) {
    console.error('Search Student Error:', error);
    return {
      success: false,
      error: error.message,
      students: [],
      count: 0
    };
  }
};

// Generate student list data for report
export const generateStudentReportData = async () => {
  try {
    const stats = await getStudentStatistics();
    
    if (!stats.success) {
      return stats;
    }
    
    const reportData = {
      generatedAt: new Date().toLocaleString('en-PK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      statistics: stats.statistics,
      students: stats.students.map(student => ({
        sapId: student.sapId || 'N/A',
        name: student.fullName || 'N/A',
        email: student.email || 'N/A',
        department: student.department || 'N/A',
        semester: student.semester || 'N/A',
        coursesEnrolled: student.enrolledCourses ? Object.keys(student.enrolledCourses).length : 0,
        registrationDate: student.createdAt ? 
          new Date(student.createdAt).toLocaleDateString('en-PK') : 'N/A',
        status: student.isActive !== false ? 'Active' : 'Inactive'
      }))
    };
    
    return {
      success: true,
      data: reportData,
      message: `Report generated for ${stats.students.length} students`
    };
    
  } catch (error) {
    console.error('Generate Report Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};