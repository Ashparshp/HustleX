import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import SEOHead from "../SEO/SEOHead";
import { PAGE_SEO } from "../../utils/seoConfig";

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

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/verify-email-notice", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();

    window.addEventListener("resize", setVh);

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Please enter a valid email address");
      return false;
    }

    if (
      formData.phoneNumber &&
      !/^\d{10,15}$/.test(formData.phoneNumber.replace(/[^0-9]/g, ""))
    ) {
      setFormError("Please enter a valid phone number");
      return false;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return false;
    }

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
      const { confirmPassword, ...registerData } = formData;

      await register(registerData);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner
          size="large"
          color="indigo"
          text="Setting things up..."
          showText={true}
          fullPage={true}
        />
      </div>
    );
  }

  return (
    <>
      <SEOHead {...PAGE_SEO.register} />
      <div
        className={`flex items-center justify-center px-4 pt-6 pb-6 sm:pb-8 
        ${isDark ? "bg-black" : "bg-gray-50"}
        `}
        style={{ minHeight: "calc(100vh - 60px)" }}
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
                  At least 6 characters
                </p>
              </div>

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
                ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
                transition-all duration-300
              `}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner
                      size="small"
                      color="green"
                      showText={false}
                      fullPage={false}
                    />
                    <span className="ml-2">Creating...</span>
                  </div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

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
    </>
  );
};

export default RegisterForm;
