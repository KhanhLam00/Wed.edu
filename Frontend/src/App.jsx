import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AppToast from './components/Common/AppToast';

// Import các trang từ thư mục Auth
import AuthChoice from './pages/Auth/AuthChoice';
import Login from "./pages/Auth/Login";
import Register from './pages/Auth/Register';
import RoleSelection from './pages/Auth/RoleSelection';

// Import các trang từ thư mục Learning & Landing
import LandingPage from './pages/Learning/LandingPage';
import LessonDetail from './pages/Learning/LessonDetail';
import WritingTutorial from './pages/Learning/WritingTutorial';

// Import các trang dành cho Học sinh
import StudentDashboard from './pages/Student/StudentDashboard';
import GradeSelect from './pages/Student/GradeSelection';
import ClassRoom from './pages/Student/ClassRoom';
import MoreOptions from './pages/Student/MoreOptions';
import AIPowered from './pages/Student/AIPowered';
import AssignedExercises from './pages/Student/AssignedExercises';
import DoAssignedExercise from './pages/Student/DoAssignedExercise';
import JoinClass from './pages/Student/JoinClass';

// Import các trang dành cho Giáo viên
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import AIGenerateExercise from './pages/Teacher/AIGenerateExercise';
import TeacherSavedExercises from './pages/Teacher/TeacherSavedExercises';
import TeacherExerciseDetail from './pages/Teacher/TeacherExerciseDetail';
import TeacherExerciseSubmissions from './pages/Teacher/TeacherExerciseSubmissions';
import TeacherClasses from './pages/Teacher/TeacherClasses';
import TeacherSubmissionDetail from './pages/Teacher/TeacherSubmissionDetail';
import TeacherMore from './pages/Teacher/TeacherMore';

// Import trang làm toán
import MathPlus from './pages/Math/MathPlus';

function ProtectedRoute({ children, allowedRole }) {
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  if (!userId || !token) {
    return <Navigate to="/auth-choice" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/auth-choice" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth-choice" element={<AuthChoice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/role-selection" element={<RoleSelection />} />

        {/* Học sinh */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/select-grade"
          element={
            <ProtectedRoute allowedRole="student">
              <GradeSelect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grade-selection"
          element={
            <ProtectedRoute allowedRole="student">
              <GradeSelect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/class"
          element={
            <ProtectedRoute allowedRole="student">
              <ClassRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-powered"
          element={
            <ProtectedRoute allowedRole="student">
              <AIPowered />
            </ProtectedRoute>
          }
        />
        <Route
          path="/more"
          element={
            <ProtectedRoute allowedRole="student">
              <MoreOptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assigned-exercises"
          element={
            <ProtectedRoute allowedRole="student">
              <AssignedExercises />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assigned-exercise/:id"
          element={
            <ProtectedRoute allowedRole="student">
              <DoAssignedExercise />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <ProtectedRoute allowedRole="student">
              <LessonDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:id"
          element={
            <ProtectedRoute allowedRole="student">
              <WritingTutorial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:lessonId"
          element={
            <ProtectedRoute allowedRole="student">
              <MathPlus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/join-class"
          element={
            <ProtectedRoute allowedRole="student">
              <JoinClass />
            </ProtectedRoute>
          }
        />
        


        {/* Giáo viên */}
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-ai-exercise"
          element={
            <ProtectedRoute allowedRole="teacher">
              <AIGenerateExercise />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-saved-exercises"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherSavedExercises />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-exercise-detail/:id"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherExerciseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-exercise-submissions/:id"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherExerciseSubmissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-submission-detail/:id"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherSubmissionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-classes"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-more"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherMore />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/auth-choice" replace />} />
         
      </Routes>

            <AppToast />

    </Router>
  );
}

export default App;