import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
                  <div key={link.path}>
                    <Link
                      to={link.path}
                      className={`px-3 py-2 ${linkClass(isActive(link.path))}`}
                    >
                      {link.icon}
                      <span>{link.text}</span>
                    </Link>
                  </div>
                ))}
          </div>

          {/* Right side - theme toggle, notifications & user menu */}
          <div className="flex items-center space-x-1">
            {/* Theme toggle */}
            <button
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
            </button>

            {/* Notifications button - for authenticated users only */}
            {isAuthenticated && (
              <button
                className={`p-2 rounded-full relative ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                } transition duration-200`}
              >
                <Bell
                  size={20}
                  className={isDark ? "text-gray-300" : "text-gray-600"}
                />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {isAuthenticated ? (
              /* User menu (desktop) */
              <div className="hidden md:relative md:block">
                <button
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
                  <div>
                    <ChevronDown
                      size={16}
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                </button>

                {showUserMenu && (
                  <div
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

                    <div>
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
                    </div>

                    <div>
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
                    </div>

                    <div
                      className={`mt-1 pt-1 border-t ${
                        isDark ? "border-gray-800" : "border-gray-100"
                      }`}
                    >
                      <div>
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
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login / Register buttons (desktop) */
              <div className="hidden md:flex md:items-center md:space-x-2">
                <div>
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
                </div>
                <div>
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
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
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
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className={`md:hidden ${isDark ? "bg-gray-900" : "bg-white"}`}>
          {/* User info block for mobile (when authenticated) */}
          {isAuthenticated && (
            <div
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
            </div>
          )}

          <div className="px-3 pt-2 pb-3 space-y-1 sm:px-4">
            {isAuthenticated ? (
              <>
                {navLinks
                  .filter((link) => link.authRequired === isAuthenticated)
                  .map((link) => (
                    <div key={link.path}>
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
                    </div>
                  ))}

                <div
                  className={`my-2 border-t ${
                    isDark ? "border-gray-800" : "border-gray-100"
                  }`}
                ></div>

                <div>
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
                </div>
                <div>
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
                </div>

                <div
                  className={`my-2 border-t ${
                    isDark ? "border-gray-800" : "border-gray-100"
                  }`}
                ></div>

                <div>
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
                </div>
              </>
            ) : (
              <>
                <div className="py-2">
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
                </div>
                <div className="py-2">
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
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
