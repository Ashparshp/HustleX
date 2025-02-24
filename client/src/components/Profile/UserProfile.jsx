import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Camera,
  Shield,
  AlertCircle,
  ChevronRight,
  Settings,
  Bell,
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
  const [avatarPreview, setAvatarPreview] = useState(null);
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

  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

    if (!formData.name.trim()) {
      setFormError("Name is required");
      return;
    }

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
      await updateProfile({ ...formData, avatar: avatarPreview });
      setFormSuccess("Profile updated successfully");
      setIsEditing(false);

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
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className="space-y-6"
      >
        {/* Profile Header */}
        <div
          className={`rounded-xl overflow-hidden ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          {/* Cover Photo */}
          <div
            className={`h-32 bg-gradient-to-r ${
              isDark
                ? "from-indigo-900/50 to-purple-900/50"
                : "from-indigo-500/10 to-purple-500/10"
            }`}
          />

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="relative -mt-16 flex items-end space-x-4">
              {/* Avatar */}
              <div className="relative">
                <div
                  className={`h-32 w-32 rounded-full border-4 ${
                    isDark ? "border-gray-800" : "border-white"
                  } overflow-hidden`}
                >
                  {avatarPreview || currentUser?.avatarUrl ? (
                    <img
                      src={avatarPreview || currentUser?.avatarUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`h-full w-full grid place-items-center ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <User
                        size={40}
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`absolute bottom-0 right-0 p-2 rounded-full ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-white hover:bg-gray-50"
                    } shadow-lg transition duration-200`}
                  >
                    <Camera
                      size={16}
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 pt-16">
                <h1
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formData.name || "Your Name"}
                </h1>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {currentUser?.email}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-16 flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } transition duration-200`}
                >
                  {isEditing ? (
                    <>
                      <X size={18} />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} />
                      <span>Edit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        <AnimatePresence>
          {(formError || formSuccess) && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInVariants}
              className="space-y-2"
            >
              {formError && (
                <div
                  className={`p-4 rounded-lg ${
                    isDark
                      ? "bg-red-900/30 text-red-300"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                  </div>
                </div>
              )}

              {formSuccess && (
                <div
                  className={`p-4 rounded-lg ${
                    isDark
                      ? "bg-green-900/30 text-green-300"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Check size={18} />
                    <span>{formSuccess}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Form */}
          <div className="md:col-span-2">
            <motion.div
              className={`rounded-xl p-6 ${
                isDark ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User
                        size={18}
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } border focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone
                        size={18}
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } border focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg ${
                      isDark
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    } transition duration-200`}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                )}
              </form>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Verification Status */}
            <motion.div
              className={`rounded-xl p-6 ${
                isDark ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <h3
                className={`text-lg font-medium mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Verification Status
              </h3>

              <div className="space-y-3">
                {/* Email Status */}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield
                      size={20}
                      className={
                        currentUser?.isEmailVerified
                          ? "text-green-500"
                          : "text-amber-500"
                      }
                    />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      Email
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      currentUser?.isEmailVerified
                        ? isDark
                          ? "text-green-400"
                          : "text-green-600"
                        : isDark
                        ? "text-amber-400"
                        : "text-amber-600"
                    }`}
                  >
                    {currentUser?.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>

                {/* Phone Status */}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isDark ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield
                      size={20}
                      className={
                        currentUser?.isPhoneVerified
                          ? "text-green-500"
                          : "text-amber-500"
                      }
                    />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      Phone
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      currentUser?.isPhoneVerified
                        ? isDark
                          ? "text-green-400"
                          : "text-green-600"
                        : isDark
                        ? "text-amber-400"
                        : "text-amber-600"
                    }`}
                  >
                    {currentUser?.isPhoneVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className={`rounded-xl p-6 ${
                isDark ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <h3
                className={`text-lg font-medium mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Quick Actions
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => {}} // Add navigation to settings
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${
                    isDark
                      ? "hover:bg-gray-700/50 text-gray-300"
                      : "hover:bg-gray-50 text-gray-700"
                  } transition duration-200`}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} />
                    <span>Account Settings</span>
                  </div>
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => {}} // Add navigation to notifications
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${
                    isDark
                      ? "hover:bg-gray-700/50 text-gray-300"
                      : "hover:bg-gray-50 text-gray-700"
                  } transition duration-200`}
                >
                  <div className="flex items-center gap-3">
                    <Bell size={18} />
                    <span>Notifications</span>
                  </div>
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${
                    isDark
                      ? "hover:bg-red-900/20 text-red-400"
                      : "hover:bg-red-50 text-red-600"
                  } transition duration-200`}
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Phone Verification Modal */}
        <AnimatePresence>
          {showVerification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
                isDark ? "bg-black/50" : "bg-gray-600/20"
              }`}
            >
              <div
                className={`w-full max-w-md rounded-xl p-6 ${
                  isDark ? "bg-gray-800" : "bg-white"
                } shadow-xl`}
              >
                <h3
                  className={`text-lg font-medium mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Verify Your Phone Number
                </h3>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className={`w-full px-4 py-2.5 rounded-lg ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    } border focus:ring-2 focus:ring-indigo-500/20 transition duration-200`}
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowVerification(false)}
                      className={`flex-1 py-2.5 rounded-lg ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      } transition duration-200`}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleVerifyPhone}
                      disabled={isVerifying || !verificationCode}
                      className={`flex-1 py-2.5 rounded-lg ${
                        isDark
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      } ${
                        (isVerifying || !verificationCode) &&
                        "opacity-50 cursor-not-allowed"
                      } 
                      transition duration-200`}
                    >
                      {isVerifying ? "Verifying..." : "Verify"}
                    </button>
                  </div>

                  <button
                    onClick={handleResendCode}
                    disabled={isResendingCode}
                    className={`w-full text-sm ${
                      isDark
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-700"
                    } transition duration-200`}
                  >
                    {isResendingCode
                      ? "Sending..."
                      : "Resend verification code"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UserProfile;
