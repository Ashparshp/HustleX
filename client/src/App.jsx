// src/App.jsx
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout Components
import Dashboard from "./components/Dashboard/Dashboard";
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
      document.body.classList.add("bg-gray-50", "text-gray-900");
      document.body.classList.remove("bg-black", "text-white");
    }
  }, [isDark]);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterForm />
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

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

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

          {/* Redirect root to dashboard or login */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Fallback route for unmatched paths */}
          <Route
            path="*"
            element={
              <div className="text-center py-10">
                <h2 className="text-2xl font-bold mb-2">404: Page Not Found</h2>
                <p className="mb-4">
                  The page you're looking for doesn't exist.
                </p>
                <a
                  href={isAuthenticated ? "/dashboard" : "/login"}
                  className={`inline-block py-2 px-4 rounded-lg ${
                    isDark
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  } transition duration-200`}
                >
                  Go to {isAuthenticated ? "Dashboard" : "Login"}
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? "#1F2937" : "#FFFFFF",
            color: isDark ? "#F3F4F6" : "#1F2937",
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: isDark ? "#1F2937" : "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: isDark ? "#1F2937" : "#FFFFFF",
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
