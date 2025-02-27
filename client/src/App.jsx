import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

// Context Providers
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// Auth Components
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import EmailVerificationNotice from "./components/Auth/EmailVerificationNotice";
import EmailVerification from "./components/Auth/EmailVerification";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Profile Components
import UserProfile from "./components/Profile/UserProfile";
import ChangePassword from "./components/Profile/ChangePassword";

// App Feature Pages
import WorkingHoursPage from "./pages/WorkingHoursPage";
import SkillsPage from "./pages/SkillsPage";
import SchedulePage from "./pages/SchedulePage";
import TimetablePage from "./pages/TimetablePage";
import LeetCodePage from "./pages/LeetCodePage";
import ContestsPage from "./pages/ContestsPage";

function AppContent() {
  const { isDark } = useTheme();
  const { isAuthenticated, currentUser } = useAuth();

  // Get user theme preference
  useEffect(() => {
    // Set body background and text color based on theme
    if (isDark) {
      document.body.classList.add("bg-black", "text-white");
      document.body.classList.remove("bg-gray-50", "text-gray-900");
    } else {
      document.body.classList.add("bg-white", "text-gray-900");
      document.body.classList.remove("bg-black", "text-white");
    }
  }, [isDark]);

  return (
    <div
      className={`relative min-h-screen flex flex-col ${
        isDark ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(30,41,59,0.5) 0%, rgba(17,24,39,0.5) 100%)"
            : "linear-gradient(135deg, rgba(229,231,235,0.5) 0%, rgba(255,255,255,0.5) 100%)",
          opacity: 0.5,
        }}
      />

      {/* Blurred Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backdropFilter: "blur(75px)",
          WebkitBackdropFilter: "blur(75px)",
          opacity: 0.5,
        }}
      />

      <Navbar />

      <main className="relative">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/working-hours" /> : <LoginForm />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/working-hours" /> : <RegisterForm />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route
            path="/verify-email-notice"
            element={
              isAuthenticated ? (
                <EmailVerificationNotice />
              ) : (
                <Navigate to="/login" />
              )
            }
          />


          {/* Working Hours Feature */}
          <Route
            path="/working-hours"
            element={
              <ProtectedRoute>
                <WorkingHoursPage />
              </ProtectedRoute>
            }
          />

          {/* Skills Feature */}
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <SkillsPage />
              </ProtectedRoute>
            }
          />

          {/* Timetable Feature */}
          <Route
            path="/timetable"
            element={
              <ProtectedRoute>
                <TimetablePage />
              </ProtectedRoute>
            }
          />

          {/* leetcode Feature */}
          <Route
            path="/leetcode"
            element={
              <ProtectedRoute>
                <LeetCodePage />
              </ProtectedRoute>
            }
          />

          {/* Schedule Feature */}
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <SchedulePage />
              </ProtectedRoute>
            }
          />

          {/* User Profile Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contests"
            element={
              <ProtectedRoute>
                <ContestsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to working-hours or login */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/working-hours" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Fallback route for unmatched paths */}
          <Route
            path="*"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10"
              >
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  404: Page Not Found
                </h2>
                <p
                  className={`mb-4 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  The page you're looking for doesn't exist.
                </p>
                <motion.a
                  href={isAuthenticated ? "/working-hours" : "/login"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-block py-2 px-4 rounded-lg transition duration-300 ${
                    isDark
                      ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20"
                      : "bg-indigo-100/50 border border-indigo-300/50 text-indigo-600 hover:bg-indigo-200/70"
                  }`}
                >
                  Go to {isAuthenticated ? "Working Hours" : "Login"}
                </motion.a>
              </motion.div>
            }
          />
        </Routes>
      </main>

      {/* <Footer /> */}

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? "#111827" : "#FFFFFF", // Darker background for dark mode
            color: isDark ? "#F3F4F6" : "#1F2937",
            border: `1px solid ${isDark ? "#1F2937" : "#E5E7EB"}`,
            boxShadow: isDark
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: "0.75rem", // Rounded corners
          },
          success: {
            iconTheme: {
              primary: "#10B981", // Emerald green
              secondary: isDark ? "#111827" : "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444", // Red
              secondary: isDark ? "#111827" : "#FFFFFF",
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
