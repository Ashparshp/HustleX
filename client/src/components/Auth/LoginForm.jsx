import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Form validation
    if (!email.trim() || !password) {
      setFormError("Email and password are required");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      // Navigation will happen in the useEffect
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 
      ${isDark ? "bg-black" : "bg-gray-50"}
    `}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group w-full max-w-md"
      >
        <div
          className={`relative p-8 rounded-lg border backdrop-blur-sm
          ${
            isDark
              ? "bg-black/80 border-indigo-500/30 group-hover:border-indigo-400"
              : "bg-white/80 border-indigo-300/50 group-hover:border-indigo-500"
          }
          transition-all duration-300
        `}
        >
          <h2
            className={`text-2xl font-bold mb-6 text-center
            ${isDark ? "text-white" : "text-gray-900"}
          `}
          >
            Welcome Back
          </h2>

          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg mb-4 text-sm text-center
                ${
                  isDark
                    ? "bg-red-500/10 text-red-400 border border-red-500/30"
                    : "bg-red-100 text-red-600 border border-red-200"
                }
              `}
            >
              {formError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="group/input">
              <label
                className={`block mb-2 text-sm font-medium
                ${isDark ? "text-gray-300" : "text-gray-700"}
              `}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  ${isDark ? "text-indigo-400" : "text-indigo-600"}
                  transition-transform duration-300 group-hover/input:scale-110
                `}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    transition-all duration-300
                  `}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group/input">
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`text-sm font-medium
                  ${isDark ? "text-gray-300" : "text-gray-700"}
                `}
                >
                  Password
                </label>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/forgot-password"
                    className={`text-sm font-medium ${
                      isDark
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-800"
                    } transition duration-200 inline-flex items-center gap-1`}
                  >
                    Forgot Password?
                    <ArrowRight size={14} className="inline-block" />
                  </Link>
                </motion.div>
              </div>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  ${isDark ? "text-indigo-400" : "text-indigo-600"}
                  transition-transform duration-300 group-hover/input:scale-110
                `}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    transition-all duration-300
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                    transition-transform duration-300 hover:scale-110"
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      className={isDark ? "text-indigo-400" : "text-indigo-600"}
                    />
                  ) : (
                    <Eye
                      size={18}
                      className={isDark ? "text-indigo-400" : "text-indigo-600"}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 group
                ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                    : "bg-emerald-100/50 text-emerald-600 hover:bg-emerald-200/70 border border-emerald-300/50"
                }
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                transition-all duration-300
              `}
            >
              {isSubmitting ? (
                <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-4">
            <span
              className={`text-sm
              ${isDark ? "text-gray-400" : "text-gray-600"}
            `}
            >
              Don't have an account?{" "}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  to="/register"
                  className={`font-medium transition-colors duration-300 inline-flex items-center gap-1
                    ${
                      isDark
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-700"
                    }
                  `}
                >
                  Create an Account
                  <UserPlus
                    size={16}
                    className="ml-1 inline-block transition-transform duration-300 group-hover:rotate-6"
                  />
                </Link>
              </motion.div>
            </span>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
