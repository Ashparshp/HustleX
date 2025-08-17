import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react";
import AnimatedHero from "./AnimatedHero";
import QuickStatsPreview from "./QuickStatsPreview";

const LandingPage = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();

  // Custom SVG Icons for features
  const FeatureIcons = {
    Calendar: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          ry="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="16"
          y1="2"
          x2="16"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="8"
          y1="2"
          x2="8"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="3"
          y1="10"
          x2="21"
          y2="10"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="8" cy="14" r="1" fill="currentColor" />
        <circle cx="12" cy="14" r="1" fill="currentColor" />
        <circle cx="16" cy="14" r="1" fill="currentColor" />
        <circle cx="8" cy="18" r="1" fill="currentColor" />
        <circle cx="12" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
    Clock: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <polyline
          points="12,6 12,12 16,14"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <path d="M12 2 L13 4 L11 4 Z" fill="currentColor" />
        <path d="M22 12 L20 13 L20 11 Z" fill="currentColor" />
        <path d="M12 22 L11 20 L13 20 Z" fill="currentColor" />
        <path d="M2 12 L4 11 L4 13 Z" fill="currentColor" />
      </svg>
    ),
    Target: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M12 2 L12 6" stroke="currentColor" strokeWidth="2" />
        <path d="M12 18 L12 22" stroke="currentColor" strokeWidth="2" />
        <path d="M2 12 L6 12" stroke="currentColor" strokeWidth="2" />
        <path d="M18 12 L22 12" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    Schedule: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          ry="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M9 9h6v2H9zM9 13h6v2H9zM9 17h4v2H9z" fill="currentColor" />
        <circle cx="7" cy="10" r="1" fill="currentColor" />
        <circle cx="7" cy="14" r="1" fill="currentColor" />
        <circle cx="7" cy="18" r="1" fill="currentColor" />
        <path d="M3 7 L21 7" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    Analytics: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" />
        <path
          d="M7 16 L11 12 L15 16 L21 10"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="7" cy="16" r="2" fill="currentColor" />
        <circle cx="11" cy="12" r="2" fill="currentColor" />
        <circle cx="15" cy="16" r="2" fill="currentColor" />
        <circle cx="21" cy="10" r="2" fill="currentColor" />
        <rect
          x="6"
          y="18"
          width="2"
          height="3"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="10"
          y="14"
          width="2"
          height="7"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="14"
          y="16"
          width="2"
          height="5"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="18"
          y="12"
          width="2"
          height="9"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
    ),
  };

  // Features for the ecosystem section
  const features = [
    {
      title: "Smart Timetables",
      description:
        "Create and manage weekly schedules with intelligent time blocking and automatic conflict detection.",
      icon: FeatureIcons.Calendar,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      title: "Time Tracking",
      description:
        "Monitor your working hours with precision. Track productivity patterns and optimize your workflow.",
      icon: FeatureIcons.Clock,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Skills Development",
      description:
        "Set learning goals, track progress, and build expertise in areas that matter to your growth.",
      icon: FeatureIcons.Target,
      gradient: "from-cyan-500 to-emerald-500",
    },
    {
      title: "Schedule Management",
      description:
        "Organize activities, set priorities, and maintain perfect work-life balance with smart scheduling.",
      icon: FeatureIcons.Schedule,
      gradient: "from-emerald-500 to-green-500",
    },
    {
      title: "Progress Analytics",
      description:
        "Gain insights into your productivity patterns with detailed reports and actionable recommendations.",
      icon: FeatureIcons.Analytics,
      gradient: "from-green-500 to-lime-500",
    },
  ];

  // Quick action items for logged-in users
  const quickActions = [
    {
      title: "View Timetables",
      description: "Check your weekly schedules",
      icon: Calendar,
      link: "/timetable",
      color: "indigo",
    },
    {
      title: "Track Working Hours",
      description: "Log your productive time",
      icon: Clock,
      link: "/working-hours",
      color: "blue",
    },
    {
      title: "Skills Progress",
      description: "Monitor your development",
      icon: TrendingUp,
      link: "/skills",
      color: "emerald",
    },
    {
      title: "Schedule Management",
      description: "Organize your activities",
      icon: Target,
      link: "/schedule",
      color: "purple",
    },
  ];

  const containerStyle = isDark
    ? {
        background: "linear-gradient(180deg, #000000 0%, #121212 100%)",
        color: "white",
        fontFamily: "'Eugene', serif",
        minHeight: "100vh",
      }
    : {
        background:
          "radial-gradient(ellipse 70% 60% at 35% 10%, #d0d8f7 0%, #e9edf9 60%, #fefefe 90%)",
        color: "#1a202c",
        fontFamily: "'Eugene', serif",
        minHeight: "100vh",
      };

  const textColorMain = isDark ? "text-gray-100" : "text-gray-900";
  const textColorMuted = isDark ? "text-gray-400" : "text-gray-700";
  const borderColor = isDark ? "border-gray-800" : "border-gray-300";
  const featureBg = isDark
    ? "bg-gray-900/95 backdrop-blur-sm shadow-lg"
    : "bg-white/90";
  const headingColor = isDark ? "text-indigo-300" : "text-indigo-700";

  const buttonPrimaryBg = isDark
    ? "bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:from-gray-900 hover:via-black hover:to-black"
    : "bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-600 hover:via-indigo-700 hover:to-indigo-800";

  const buttonPrimaryText = "text-white";

  const buttonSecondaryBorder = isDark
    ? "border-gray-700 hover:border-gray-600"
    : "border-indigo-700 hover:border-indigo-900";

  const buttonSecondaryText = isDark
    ? "text-gray-300 hover:text-white"
    : "text-indigo-700 hover:text-indigo-900";

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-6 py-20 gap-16">
        <div className="w-full lg:w-1/2 flex justify-center">
          <AnimatedHero />
        </div>
        <div className="lg:w-1/2">
          {isAuthenticated ? (
            // Content for authenticated users
            <>
              <div className="mb-4">
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                >
                  Welcome back!
                </span>
              </div>
              <h1
                className={`text-5xl font-bold mb-6 leading-tight ${headingColor}`}
              >
                {currentUser?.name
                  ? `Hi ${currentUser.name.split(" ")[0]}!`
                  : "Ready to Hustle?"}
              </h1>
              <p
                className={`text-lg mb-10 max-w-lg leading-relaxed ${textColorMuted}`}
              >
                Jump back into your productivity journey. Check your timetables,
                track your hours, or continue developing your skills.
              </p>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  const colorClasses = {
                    indigo: isDark
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      : "bg-indigo-50 text-indigo-600 border-indigo-200",
                    blue: isDark
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-blue-50 text-blue-600 border-blue-200",
                    emerald: isDark
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-emerald-50 text-emerald-600 border-emerald-200",
                    purple: isDark
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : "bg-purple-50 text-purple-600 border-purple-200",
                  };

                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-md ${
                        colorClasses[action.color]
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <h3 className="font-semibold text-sm mb-1">
                        {action.title}
                      </h3>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {action.description}
                      </p>
                    </Link>
                  );
                })}
              </div>

              {/* Primary CTA */}
              <div className="flex gap-4">
                <Link
                  to="/timetable"
                  className={`${buttonPrimaryBg} ${buttonPrimaryText} font-semibold py-3 px-8 rounded-xl shadow-md transition flex items-center gap-2`}
                >
                  <Zap className="w-5 h-5" />
                  Continue Journey
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/working-hours"
                  className={`border-2 py-3 px-8 rounded-xl font-semibold transition ${buttonSecondaryBorder} ${buttonSecondaryText} flex items-center gap-2`}
                >
                  <BarChart3 className="w-4 h-4" />
                  View Progress
                </Link>
              </div>

              {/* Quick Stats Preview or Welcome Message */}
              <QuickStatsPreview isDark={isDark} showWelcomeInstead={false} />
            </>
          ) : (
            // Content for non-authenticated users
            <>
              <h1
                className={`text-5xl font-bold mb-6 leading-tight ${headingColor}`}
              >
                Take Full Control Of Your Time
              </h1>
              <p
                className={`text-lg mb-10 max-w-lg leading-relaxed ${textColorMuted}`}
              >
                Empower your productivity with intelligent time tracking,
                customizable timetables, and insightful progress reports.
              </p>
              <div className="flex gap-6">
                <Link
                  to="/register"
                  className={`${buttonPrimaryBg} ${buttonPrimaryText} font-semibold py-3 px-10 rounded-xl shadow-md transition`}
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className={`border-2 py-3 px-10 rounded-xl font-semibold transition ${buttonSecondaryBorder} ${buttonSecondaryText}`}
                >
                  Login
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section - Simple Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-4xl font-bold mb-6 ${headingColor}`}>
            Everything You Need to Stay Productive
          </h2>
          <p className={`text-lg ${textColorMuted} leading-relaxed`}>
            Simple tools that work together to help you manage your time and
            track your progress
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  isDark
                    ? "bg-gray-900/50 border-gray-700/50 hover:border-gray-600"
                    : "bg-white/70 border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Icon */}
                <div className="text-center mb-4">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}
                  >
                    <IconComponent />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${textColorMuted}`}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isDark
                ? "bg-indigo-500/10 text-indigo-400"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              All features work seamlessly together
            </span>
          </div>
        </motion.div>
      </section>

      {/* Footer CTA Section */}
      <section
        className="py-20 px-4 text-center relative"
        style={{
          background: isDark
            ? "#000000"
            : "radial-gradient(ellipse 70% 50% at 50% 10%, #c7d5ff 0%, #e3ebff 65%, #fefeff 100%)",
        }}
      >
        <div className="max-w-xl mx-auto">
          {isAuthenticated ? (
            // Content for authenticated users
            <>
              <h2
                className={`text-3xl font-bold mb-6 ${
                  isDark ? "text-indigo-300" : "text-indigo-700"
                }`}
                style={{ fontFamily: "'Eugene', serif" }}
              >
                Your Productivity Hub Awaits
              </h2>
              <p
                className={`mb-10 text-lg leading-relaxed ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Everything you need to stay organized and productive is just a
                click away. Track your time, manage your schedule, and watch
                your progress unfold.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/timetable"
                  className={`bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 hover:from-indigo-800 hover:to-indigo-900 text-white text-lg font-semibold py-4 px-10 rounded-full shadow-md transition flex items-center gap-2`}
                >
                  <Calendar className="w-5 h-5" />
                  View Timetables
                </Link>
                <Link
                  to="/working-hours"
                  className={`border-2 ${buttonSecondaryBorder} ${buttonSecondaryText} text-lg font-semibold py-4 px-10 rounded-full shadow-md transition flex items-center gap-2`}
                >
                  <Clock className="w-5 h-5" />
                  Track Hours
                </Link>
              </div>
            </>
          ) : (
            // Content for non-authenticated users
            <>
              <h2
                className={`text-3xl font-bold mb-6 ${
                  isDark ? "text-indigo-300" : "text-indigo-700"
                }`}
                style={{ fontFamily: "'Eugene', serif" }}
              >
                Pause. Reflect. Thrive.
              </h2>
              <p
                className={`mb-10 text-lg leading-relaxed ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Take a quiet moment for yourself. Set your intentions, track
                your growth, and enjoy the feeling of progress every single day.
              </p>
              <Link
                to="/register"
                className={`inline-block bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 hover:from-indigo-800 hover:to-indigo-900 text-white text-lg font-semibold py-4 px-14 rounded-full shadow-md transition`}
              >
                Begin Your Journey
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
