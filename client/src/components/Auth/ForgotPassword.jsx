import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { forgotPassword } = useAuth();
  const { isDark } = useTheme();

  // Fix for mobile viewport height (adjust for navbar)
  useEffect(() => {
    const setVh = () => {
      // First get the viewport height and multiply it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Set the height initially
    setVh();

    // Add event listener to reset on window resize
    window.addEventListener("resize", setVh);

    // Clean up
    return () => window.removeEventListener("resize", setVh);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Form validation
    if (!email.trim()) {
      setFormError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center px-4 pt-6 pb-6 sm:pb-8
      ${isDark ? "bg-black" : "bg-gray-50"}
      `}
      // Use calculated height instead of min-h-screen
      style={{ minHeight: "calc(100vh - 60px)" }} // Subtract approximate navbar height
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
            Forgot Your Password?
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
              <h3 className="text-lg font-medium mb-2">Check Your Email</h3>
              <p className="mb-4">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions to reset
                your password.
              </p>
              <p className="text-sm mb-4">
                If you don't see the email, please check your spam folder or
                request another reset link.
              </p>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setEmail("");
                    setIsSuccess(false);
                  }}
                  className={`w-full py-2.5 rounded-lg
                    ${
                      isDark
                        ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                        : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-200/70 border border-indigo-300/50"
                    }
                    transition-all duration-300
                  `}
                >
                  Try a Different Email
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/login"
                    className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2
                      ${
                        isDark
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                          : "bg-emerald-100/50 text-emerald-600 hover:bg-emerald-200/70 border border-emerald-300/50"
                      }
                      transition-all duration-300
                    `}
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    Send Reset Link
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
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
