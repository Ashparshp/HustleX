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
