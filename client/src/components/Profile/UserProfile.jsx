import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Save,
  Edit2,
  Key,
  LogOut,
  Check,
  X,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";

const UserProfile = () => {
  const {
    currentUser,
    updateProfile,
    resendPhoneVerification,
    logout,
    verifyPhone,
  } = useAuth();
  const { isDark } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    phoneNumber: currentUser?.phoneNumber || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Form validation
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return;
    }

    // Phone number validation (optional)
    if (
      formData.phoneNumber &&
      !/^\d{10,15}$/.test(formData.phoneNumber.replace(/[^0-9]/g, ""))
    ) {
      setFormError("Please enter a valid phone number");
      return;
    }

    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    try {
      await updateProfile(formData);
      setFormSuccess("Profile updated successfully");
      setIsEditing(false);

      // Check if phone number was changed and needs verification
      if (
        formData.phoneNumber &&
        formData.phoneNumber !== currentUser.phoneNumber
      ) {
        setShowVerification(true);
      }
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (isResendingCode) return;

    setIsResendingCode(true);
    setFormError("");

    try {
      await resendPhoneVerification();
      setFormSuccess("Verification code sent to your phone");
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (isVerifying || !verificationCode) return;

    setIsVerifying(true);
    setFormError("");

    try {
      await verifyPhone(verificationCode);
      setFormSuccess("Phone number verified successfully");
      setShowVerification(false);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        isDark ? "bg-black" : "bg-gray-50"
      }`}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={contentVariants}
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
            className={`text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2
              ${isDark ? "text-white" : "text-gray-900"}
            `}
          >
            <Shield
              className={isDark ? "text-indigo-400" : "text-indigo-600"}
              size={22}
            />
            User Profile
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

          {formSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg mb-4 text-sm text-center
                ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-emerald-100 text-emerald-600 border border-emerald-200"
                }
              `}
            >
              {formSuccess}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <motion.div
              custom={0}
              variants={itemVariants}
              className="group/input"
            >
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
                  value={currentUser?.email || ""}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    transition-all duration-300
                  `}
                  disabled
                />
                {currentUser?.isEmailVerified ? (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full
                        ${
                          isDark
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-emerald-100 text-emerald-600 border border-emerald-200"
                        }
                      `}
                    >
                      Verified
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full
                        ${
                          isDark
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-amber-100 text-amber-600 border border-amber-200"
                        }
                      `}
                    >
                      Unverified
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Name Field */}
            <motion.div
              custom={1}
              variants={itemVariants}
              className="group/input"
            >
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
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    transition-all duration-300
                    ${!isEditing ? "opacity-70" : ""}
                  `}
                  placeholder="John Doe"
                  required
                  disabled={!isEditing}
                />
              </div>
            </motion.div>

            {/* Phone Number Field */}
            <motion.div
              custom={2}
              variants={itemVariants}
              className="group/input"
            >
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
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    transition-all duration-300
                    ${!isEditing ? "opacity-70" : ""}
                  `}
                  placeholder="123-456-7890"
                  disabled={!isEditing}
                />
                {currentUser?.phoneNumber && currentUser?.isPhoneVerified && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full
                        ${
                          isDark
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-emerald-100 text-emerald-600 border border-emerald-200"
                        }
                      `}
                    >
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              custom={3}
              variants={itemVariants}
              className="flex gap-3 pt-2"
            >
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 group
                    ${
                      isDark
                        ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                        : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-200/70 border border-indigo-300/50"
                    }
                    transition-all duration-300
                  `}
                >
                  <Edit2 size={16} />
                  Edit Profile
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 group
                    ${
                      isDark
                        ? "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/30"
                        : "bg-gray-100/50 text-gray-600 hover:bg-gray-200/70 border border-gray-300/50"
                    }
                    transition-all duration-300
                  `}
                >
                  <X size={16} />
                  Cancel
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleLogout}
                className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 group
                  ${
                    isDark
                      ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                      : "bg-red-100/50 text-red-600 hover:bg-red-200/70 border border-red-300/50"
                  }
                  transition-all duration-300
                `}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </motion.div>

            {/* Save button when editing */}
            {isEditing && (
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
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </motion.button>
            )}
          </form>

          {/* Phone Verification Section */}
          {(showVerification ||
            (currentUser?.phoneNumber && !currentUser?.isPhoneVerified)) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`mt-6 p-4 rounded-lg border
                ${
                  isDark
                    ? "bg-indigo-500/5 border-indigo-500/20"
                    : "bg-indigo-50 border-indigo-200/50"
                }
              `}
            >
              <h3
                className={`text-lg font-medium mb-2
                  ${isDark ? "text-indigo-300" : "text-indigo-700"}
                `}
              >
                Verify Your Phone Number
              </h3>
              <p
                className={`mb-4 text-sm
                  ${isDark ? "text-gray-400" : "text-gray-600"}
                `}
              >
                Enter the verification code sent to your phone number.
              </p>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code"
                  className={`flex-1 pl-4 pr-4 py-2.5 rounded-lg border text-sm
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    transition-all duration-300
                  `}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleVerifyPhone}
                  disabled={isVerifying || !verificationCode}
                  className={`py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 group
                    ${
                      isDark
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                        : "bg-emerald-100/50 text-emerald-600 hover:bg-emerald-200/70 border border-emerald-300/50"
                    }
                    ${
                      isVerifying || !verificationCode
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                    transition-all duration-300
                  `}
                >
                  {isVerifying ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
                  ) : (
                    <>
                      <Check size={16} />
                      Verify
                    </>
                  )}
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleResendCode}
                disabled={isResendingCode}
                className={`mt-3 text-sm font-medium inline-flex items-center gap-1
                  ${
                    isDark
                      ? "text-indigo-400 hover:text-indigo-300"
                      : "text-indigo-600 hover:text-indigo-700"
                  }
                  transition duration-200
                `}
              >
                {isResendingCode ? "Sending..." : "Resend verification code"}
                <ArrowRight
                  size={14}
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.button>
            </motion.div>
          )}

          {/* Change Password Link */}
          <div className="text-center mt-6 pt-4 border-t border-indigo-500/10">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/change-password"
              className={`inline-flex items-center gap-1 py-2 px-4 rounded-lg text-sm font-medium
                ${
                  isDark
                    ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                    : "bg-indigo-100/50 text-indigo-600 hover:bg-indigo-200/70 border border-indigo-300/50"
                }
                transition duration-200
              `}
            >
              <Key size={16} />
              Change Password
              <ArrowRight
                size={14}
                className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
