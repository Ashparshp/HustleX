import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const { resetPassword } = useAuth();
  const { isDark } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setFormError("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Form validation
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await resetPassword(token, password);
      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setFormError(error.message);
      setIsTokenValid(false);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="text-center mb-8">
            <h2
              className={`text-2xl font-bold 
              ${isDark ? "text-white" : "text-gray-900"}
            `}
            >
              Reset Your Password
            </h2>
            <p
              className={`mt-1 
              ${isDark ? "text-gray-400" : "text-gray-600"}
            `}
            >
              Create a new secure password
            </p>
          </div>

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

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-4 text-center
                ${
                  isDark
                    ? "bg-green-500/10 text-green-400 border border-green-500/30"
                    : "bg-green-100 text-green-600 border border-green-200"
                }
              `}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Check className="text-green-500" size={20} />
                <h3 className="text-lg font-medium">
                  Password Reset Successfully
                </h3>
              </div>
              <p className="mb-4">
                Your password has been reset successfully. You will be
                redirected to the login page shortly.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/login"
                  className={`inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg
                    ${
                      isDark
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                        : "bg-emerald-100/50 text-emerald-600 hover:bg-emerald-200/70 border border-emerald-300/50"
                    }
                    transition-all duration-300
                  `}
                >
                  <ArrowLeft size={16} />
                  Go to Login Page
                </Link>
              </motion.div>
            </motion.div>
          ) : isTokenValid ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Field */}
              <div className="group/input">
                <label
                  className={`block mb-2 text-sm font-medium
                  ${isDark ? "text-gray-300" : "text-gray-700"}
                `}
                >
                  New Password
                </label>
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
                    minLength={6}
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
                        className={
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }
                      />
                    ) : (
                      <Eye
                        size={18}
                        className={
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }
                      />
                    )}
                  </button>
                </div>
                <p
                  className={`text-xs mt-1 
                  ${isDark ? "text-gray-500" : "text-gray-600"}
                `}
                >
                  Password must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="group/input">
                <label
                  className={`block mb-2 text-sm font-medium
                  ${isDark ? "text-gray-300" : "text-gray-700"}
                `}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                    ${isDark ? "text-indigo-400" : "text-indigo-600"}
                    transition-transform duration-300 group-hover/input:scale-110
                  `}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                      transition-transform duration-300 hover:scale-110"
                  >
                    {showConfirmPassword ? (
                      <EyeOff
                        size={18}
                        className={
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }
                      />
                    ) : (
                      <Eye
                        size={18}
                        className={
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }
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
                className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2
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
                    Reset Password
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>

              <div className="text-center mt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link
                    to="/login"
                    className={`inline-flex items-center text-sm
                      ${
                        isDark
                          ? "text-indigo-400 hover:text-indigo-300"
                          : "text-indigo-600 hover:text-indigo-700"
                      }
                      transition-colors duration-300
                    `}
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Login
                  </Link>
                </motion.div>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-4 
                ${
                  isDark
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-amber-100 text-amber-700 border border-amber-200"
                }
                text-center
              `}
            >
              <h3 className="text-lg font-medium mb-2">
                Invalid or Expired Token
              </h3>
              <p className="mb-4">
                The password reset link is invalid or has expired. Please
                request a new password reset link.
              </p>
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/forgot-password"
                    className={`inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg w-full
                      ${
                        isDark
                          ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                          : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-200/70 border border-indigo-300/50"
                      }
                      transition-all duration-300
                    `}
                  >
                    Request New Reset Link
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/login"
                    className={`inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg w-full
                      ${
                        isDark
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                          : "bg-emerald-100/50 text-emerald-600 hover:bg-emerald-200/70 border border-emerald-300/50"
                      }
                      transition-all duration-300
                    `}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Login
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
