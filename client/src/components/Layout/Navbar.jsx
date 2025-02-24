// src/components/Layout/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Home,
  Clock,
  Award,
  Calendar,
  Target,
  Layout,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll event to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setShowUserMenu(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation links with icons
  const navLinks = [
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: <Home size={16} />,
      authRequired: true,
    },
    {
      text: "Working Hours",
      path: "/working-hours",
      icon: <Clock size={16} />,
      authRequired: true,
    },
    {
      text: "Skills",
      path: "/skills",
      icon: <Award size={16} />,
      authRequired: true,
    },
    {
      text: "Timetable",
      path: "/timetable",
      icon: <Layout size={16} />,
      authRequired: true,
    },
    {
      text: "Goals",
      path: "/goals",
      icon: <Target size={16} />,
      authRequired: true,
    },
    {
      text: "Schedule",
      path: "/schedule",
      icon: <Calendar size={16} />,
      authRequired: true,
    },
  ];

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  const userMenuVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Theme specific styling with added shadow on scroll
  const navbarClass = isDark
    ? `bg-gray-900/90 text-white border-gray-800 backdrop-blur-sm ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`
    : `bg-white/90 text-gray-900 border-gray-200 backdrop-blur-sm ${
        scrolled ? "shadow-lg shadow-black/5" : ""
      }`;

  const linkClass = (active) =>
    isDark
      ? `${
          active
            ? "text-indigo-400 bg-indigo-500/10 font-medium"
            : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/5"
        } transition duration-200 rounded-md flex items-center gap-2`
      : `${
          active
            ? "text-indigo-600 bg-indigo-50 font-medium"
            : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50"
        } transition duration-200 rounded-md flex items-center gap-2`;

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${navbarClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="flex-shrink-0 flex items-center"
            >
              <span
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-indigo-600"
                } transition-colors duration-300`}
              >
                ServiceXchange
                <span
                  className={`ml-1 text-sm font-normal ${
                    isDark ? "text-indigo-400" : "text-indigo-500"
                  }`}
                >
                  Pro
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {isAuthenticated &&
              navLinks
                .filter((link) => link.authRequired === isAuthenticated)
                .map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 ${linkClass(isActive(link.path))}`}
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                ))}
          </div>

          {/* Right side - theme toggle, notifications & user menu */}
          <div className="flex items-center space-x-1">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
              } transition duration-200`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={20} className="text-yellow-300" />
              ) : (
                <Moon size={20} className="text-indigo-600" />
              )}
            </motion.button>

            {/* Notifications button - for authenticated users only */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full relative ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                } transition duration-200`}
              >
                <Bell
                  size={20}
                  className={isDark ? "text-gray-300" : "text-gray-600"}
                />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>
            )}

            {isAuthenticated ? (
              /* User menu (desktop) */
              <div className="hidden md:relative md:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 p-1.5 rounded-full ${
                    isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  } transition duration-200`}
                >
                  <div
                    className={`h-8 w-8 rounded-full grid place-items-center ${
                      isDark
                        ? "bg-indigo-500/20 border border-indigo-500/30"
                        : "bg-indigo-100 border border-indigo-200/50"
                    } transition-colors duration-300`}
                  >
                    <User
                      size={16}
                      className={isDark ? "text-indigo-400" : "text-indigo-600"}
                    />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {currentUser?.name || "User"}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Account
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      showUserMenu ? "rotate-180" : ""
                    } ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={userMenuVariants}
                      className={`absolute right-0 mt-2 w-56 py-2 rounded-lg shadow-lg border ${
                        isDark
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                      onBlur={() => setShowUserMenu(false)}
                    >
                      <div
                        className={`px-4 py-2 mb-1 border-b ${
                          isDark ? "border-gray-800" : "border-gray-100"
                        }`}
                      >
                        <p
                          className={`text-sm font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {currentUser?.name || "User"}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {currentUser?.email || "user@example.com"}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className={`block px-4 py-2 text-sm ${
                          isDark
                            ? "hover:bg-gray-800 text-gray-300"
                            : "hover:bg-gray-50 text-gray-700"
                        } transition-colors duration-200`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>Your Profile</span>
                        </div>
                      </Link>
                      <Link
                        to="/settings"
                        className={`block px-4 py-2 text-sm ${
                          isDark
                            ? "hover:bg-gray-800 text-gray-300"
                            : "hover:bg-gray-50 text-gray-700"
                        } transition-colors duration-200`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Settings size={16} />
                          <span>Settings</span>
                        </div>
                      </Link>

                      <div
                        className={`mt-1 pt-1 border-t ${
                          isDark ? "border-gray-800" : "border-gray-100"
                        }`}
                      >
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            isDark
                              ? "hover:bg-red-900/20 text-red-400"
                              : "hover:bg-red-50 text-red-600"
                          } transition-colors duration-200`}
                        >
                          <div className="flex items-center gap-2">
                            <LogOut size={16} />
                            <span>Sign out</span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login / Register buttons (desktop) */
              <div className="hidden md:flex md:items-center md:space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      isDark
                        ? "text-indigo-400 hover:bg-indigo-900/20 border border-indigo-500/30"
                        : "text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
                    } transition duration-200`}
                  >
                    Sign in
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      isDark
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    } transition duration-200`}
                  >
                    Sign up
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  isDark
                    ? "text-gray-400 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                } focus:outline-none transition duration-200`}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className={`md:hidden overflow-hidden ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
          >
            {/* User info block for mobile (when authenticated) */}
            {isAuthenticated && (
              <motion.div
                variants={linkVariants}
                className={`px-4 py-4 border-b ${
                  isDark ? "border-gray-800" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full grid place-items-center ${
                      isDark
                        ? "bg-indigo-500/20 border border-indigo-500/30"
                        : "bg-indigo-100 border border-indigo-200"
                    }`}
                  >
                    <User
                      size={18}
                      className={isDark ? "text-indigo-400" : "text-indigo-600"}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {currentUser?.name || "User"}
                    </p>
                    <p
                      className={`text-xs truncate ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {currentUser?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="px-3 pt-2 pb-3 space-y-1 sm:px-4">
              {isAuthenticated ? (
                <>
                  {navLinks
                    .filter((link) => link.authRequired === isAuthenticated)
                    .map((link) => (
                      <motion.div key={link.path} variants={linkVariants}>
                        <Link
                          to={link.path}
                          className={`block px-3 py-2.5 ${linkClass(
                            isActive(link.path)
                          )}`}
                          onClick={closeMenu}
                        >
                          {link.icon}
                          <span>{link.text}</span>
                        </Link>
                      </motion.div>
                    ))}

                  <div
                    className={`my-2 border-t ${
                      isDark ? "border-gray-800" : "border-gray-100"
                    }`}
                  ></div>

                  <motion.div variants={linkVariants}>
                    <Link
                      to="/profile"
                      className={`block px-3 py-2.5 ${linkClass(
                        isActive("/profile")
                      )}`}
                      onClick={closeMenu}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={linkVariants}>
                    <Link
                      to="/settings"
                      className={`block px-3 py-2.5 ${linkClass(
                        isActive("/settings")
                      )}`}
                      onClick={closeMenu}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                  </motion.div>

                  <div
                    className={`my-2 border-t ${
                      isDark ? "border-gray-800" : "border-gray-100"
                    }`}
                  ></div>

                  <motion.div variants={linkVariants}>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-md ${
                        isDark
                          ? "text-red-400 hover:bg-red-900/20"
                          : "text-red-600 hover:bg-red-50"
                      } transition-colors duration-200`}
                    >
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={linkVariants} className="py-2">
                    <Link
                      to="/login"
                      className={`flex items-center justify-center py-2.5 px-4 rounded-md font-medium ${
                        isDark
                          ? "text-indigo-400 border border-indigo-500/30 hover:bg-indigo-900/20"
                          : "text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
                      } transition-colors duration-200`}
                      onClick={closeMenu}
                    >
                      Sign in
                    </Link>
                  </motion.div>
                  <motion.div variants={linkVariants} className="py-2">
                    <Link
                      to="/register"
                      className={`flex items-center justify-center py-2.5 px-4 rounded-md font-medium ${
                        isDark
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      } transition-colors duration-200`}
                      onClick={closeMenu}
                    >
                      Create an account
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
