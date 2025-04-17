import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowLeft, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const { changePassword } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!currentPassword) {
      setFormError("Current password is required");
      return;
    }

    if (newPassword.length < 6) {
      setFormError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("New passwords do not match");
      return;
    }

    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    try {
      await changePassword({ currentPassword, newPassword });
      setFormSuccess("Password changed successfully");

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
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
          <div className="text-center mb-8">
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Change Password
            </h2>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Update your account password
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

          {formSuccess && (
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
              {formSuccess}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password Field */}
            <div className="group/input">
              <label
                htmlFor="currentPassword"
                className={`block mb-2 text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Current Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  ${isDark ? "text-indigo-400" : "text-indigo-600"}
                  transition-transform duration-300 group-hover/input:scale-110
                `}
                />
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    transition-all duration-300
                  `}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                    transition-transform duration-300 hover:scale-110"
                >
                  {showCurrentPassword ? (
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

            {/* New Password Field */}
            <div className="group/input">
              <label
                htmlFor="newPassword"
                className={`block mb-2 text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
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
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    transition-all duration-300
                  `}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                    transition-transform duration-300 hover:scale-110"
                >
                  {showNewPassword ? (
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
                className={`mt-1 text-xs ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                Password must be at least 6 characters
              </p>
            </div>

            {/* Confirm New Password Field */}
            <div className="group/input">
              <label
                htmlFor="confirmPassword"
                className={`block mb-2 text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  ${isDark ? "text-indigo-400" : "text-indigo-600"}
                  transition-transform duration-300 group-hover/input:scale-110
                `}
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm
                    ${
                      isDark
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 placeholder-indigo-500/70"
                        : "bg-indigo-100/50 border-indigo-300/50 text-indigo-600 placeholder-indigo-600/50"
                    }
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    transition-all duration-300
                  `}
                  required
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
                  <Save size={18} />
                  Change Password
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
                  to="/profile"
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
                  Back to Profile
                </Link>
              </motion.div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
