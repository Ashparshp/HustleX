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
