import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Check, X, ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const { verifyEmail } = useAuth();
  const { isDark } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationStatus("error");
        setErrorMessage("No verification token provided");
        return;
      }

      try {
        await verifyEmail(token);
        setVerificationStatus("success");

        // Redirect to login after successful verification
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } catch (error) {
        setVerificationStatus("error");
        setErrorMessage(error.message || "Verification failed");
      }
    };

    verifyToken();
  }, [token, verifyEmail, navigate]);

  // Content based on verification status
  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="animate-spin h-12 w-12 border-4 border-current rounded-full border-t-transparent"></div>
            </div>
            <h2
              className={`text-2xl font-bold mb-2 
              ${isDark ? "text-white" : "text-gray-900"}
            `}
            >
              Verifying Your Email
            </h2>
            <p
              className={`
              ${isDark ? "text-gray-400" : "text-gray-600"}
            `}
            >
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div
                className={`h-20 w-20 rounded-full grid place-items-center 
                ${isDark ? "bg-green-500/10" : "bg-green-100"}
              `}
              >
                <Check
                  size={40}
                  className={isDark ? "text-green-400" : "text-green-600"}
                />
              </div>
            </div>
            <h2
              className={`text-2xl font-bold mb-2 
              ${isDark ? "text-white" : "text-gray-900"}
            `}
            >
              Email Verified Successfully
            </h2>
            <p
              className={`mb-6 
              ${isDark ? "text-gray-400" : "text-gray-600"}
            `}
            >
              Thank you for verifying your email address. You can now log in to
              your account.
            </p>
            <p
              className={`text-sm mb-6 
              ${isDark ? "text-gray-500" : "text-gray-600"}
            `}
            >
              You will be redirected to the login page in a few seconds...
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                <ArrowLeft size={18} />
                Go to Login
              </Link>
            </motion.div>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div
                className={`h-20 w-20 rounded-full grid place-items-center 
                ${isDark ? "bg-red-500/10" : "bg-red-100"}
              `}
              >
                <X
                  size={40}
                  className={isDark ? "text-red-400" : "text-red-600"}
                />
              </div>
            </div>
            <h2
              className={`text-2xl font-bold mb-2 
              ${isDark ? "text-white" : "text-gray-900"}
            `}
            >
              Verification Failed
            </h2>
            <p
              className={`mb-6 
              ${isDark ? "text-gray-400" : "text-gray-600"}
            `}
            >
              {errorMessage ||
                "We were unable to verify your email address. The verification link may be invalid or expired."}
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </motion.div>
          </div>
        );

      default:
        return null;
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
          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";

const EmailVerificationNotice = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState("");
  const [isResendSuccess, setIsResendSuccess] = useState(false);

  const { currentUser, resendEmailVerification, logout } = useAuth();
  const { isDark } = useTheme();

  const handleResendVerification = async () => {
    if (isResending) return;

    setIsResending(true);
    setResendError("");
    setIsResendSuccess(false);

    try {
      await resendEmailVerification();
      setIsResendSuccess(true);
    } catch (error) {
      setResendError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  const userEmail = currentUser?.email || "your email address";

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
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div
                className={`h-20 w-20 rounded-full grid place-items-center 
                ${isDark ? "bg-indigo-500/10" : "bg-indigo-100"}
              `}
              >
                <Mail
                  size={40}
                  className={isDark ? "text-indigo-400" : "text-indigo-600"}
                />
              </div>
            </div>

            <h2
              className={`text-2xl font-bold 
              ${isDark ? "text-white" : "text-gray-900"}
            `}
            >
              Verify Your Email Address
            </h2>
            <p
              className={`mt-2 
              ${isDark ? "text-gray-400" : "text-gray-600"}
            `}
            >
              We've sent a verification link to <strong>{userEmail}</strong>
            </p>
          </div>

          <div
            className={`p-4 rounded-lg mb-6 
            ${
              isDark
                ? "bg-amber-500/10 text-amber-400"
                : "bg-amber-100 text-amber-700"
            }
          `}
          >
            <p>
              Please check your email and click on the verification link to
              complete your registration. If you don't see the email, please
              check your spam folder.
            </p>
          </div>

          {resendError && (
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
              {resendError}
            </motion.div>
          )}

          {isResendSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg mb-4 text-sm text-center
                ${
                  isDark
                    ? "bg-green-500/10 text-green-400 border border-green-500/30"
                    : "bg-green-100 text-green-600 border border-green-200"
                }
              `}
            >
              Verification email has been resent successfully!
            </motion.div>
          )}

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResendVerification}
              disabled={isResending}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2
                ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                    : "bg-emerald-100/50 text-emerald-600 hover:bg-emerald-200/70 border border-emerald-300/50"
                }
                ${isResending ? "opacity-50 cursor-not-allowed" : ""}
                transition-all duration-300
              `}
            >
              {isResending ? (
                <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
              ) : (
                <>
                  <RefreshCw size={18} />
                  Resend Verification Email
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2
                ${
                  isDark
                    ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                    : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-200/70 border border-indigo-300/50"
                }
                transition-all duration-300
              `}
            >
              <ArrowLeft size={18} />
              Sign Out
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <span
              className={`text-sm
              ${isDark ? "text-gray-400" : "text-gray-600"}
            `}
            >
              Already verified?{" "}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  to="/login"
                  className={`font-medium transition-colors duration-300 inline-flex items-center gap-1
                    ${
                      isDark
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-700"
                    }
                  `}
                >
                  Sign in here
                  <ArrowRight
                    size={16}
                    className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1"
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

export default EmailVerificationNotice;
import { useState } from "react";
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

// src/components/Auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const ProtectedRoute = ({ children, requireVerified = false }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If email verification is required and user is not verified
  if (requireVerified && !currentUser?.isEmailVerified) {
    return <Navigate to="/verify-email-notice" state={{ from: location }} replace />;
  }

  // Render children if authentication checks pass
  return children;
};

export default ProtectedRoute;

// src/components/Auth/RegisterForm.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated, loading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/verify-email-notice", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Please enter a valid email address");
      return false;
    }

    // Phone number validation (optional)
    if (
      formData.phoneNumber &&
      !/^\d{10,15}$/.test(formData.phoneNumber.replace(/[^0-9]/g, ""))
    ) {
      setFormError("Please enter a valid phone number");
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return false;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

    setFormError("");
    setIsSubmitting(true);

    try {
      // Remove confirmPassword before sending to the API
      const { confirmPassword, ...registerData } = formData;

      await register(registerData);
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
            Create an Account
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
            {/* Name Field */}
            <div className="group/input">
              <label
                className={`block mb-2 text-sm font-medium
                ${isDark ? "text-gray-300" : "text-gray-700"}
              `}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  ${isDark ? "text-indigo-400" : "text-indigo-600"}
                  transition-transform duration-300 group-hover/input:scale-110
                `}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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

            {/* Phone Number Field */}
            <div className="group/input">
              <label
                className={`block mb-2 text-sm font-medium
                ${isDark ? "text-gray-300" : "text-gray-700"}
              `}
              >
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  ${isDark ? "text-indigo-400" : "text-indigo-600"}
                  transition-transform duration-300 group-hover/input:scale-110
                `}
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="123-456-7890"
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
              <label
                className={`block mb-2 text-sm font-medium
                ${isDark ? "text-gray-300" : "text-gray-700"}
              `}
              >
                Password
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
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
              <p
                className={`text-xs mt-1 
                ${isDark ? "text-gray-500" : "text-gray-600"}
              `}
              >
                At least 6 characters
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
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
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
                  Create Account
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4">
            <span
              className={`text-sm
              ${isDark ? "text-gray-400" : "text-gray-600"}
            `}
            >
              Already have an account?{" "}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  to="/login"
                  className={`font-medium transition-colors duration-300 inline-flex items-center gap-1
                    ${
                      isDark
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-700"
                    }
                  `}
                >
                  Log In
                  <ArrowRight
                    size={16}
                    className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1"
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

export default RegisterForm;

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
