import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
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

  const features = [
    {
      title: "Track Working Hours",
      description:
        "Accurately record how your time is spent with detailed logs and insightful analytics.",
    },
    {
      title: "Create Timetables",
      description:
        "Plan your days and weeks with customizable, easy-to-manage timetables.",
    },
    {
      title: "Weekly Activity Reports",
      description:
        "Review your productivity trends every week to stay on track towards your goals.",
    },
    {
      title: "Beautiful Todo Lists",
      description:
        "Organize your tasks in an elegant interface that motivates you to complete them.",
    },
    {
      title: "Skills Progress Tracking",
      description:
        "Visualize your skill improvements with clear progress markers over time.",
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
        <div className="lg:w-1/2 flex justify-center">
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className={`text-4xl font-extrabold mb-4 ${headingColor}`}>
            Tools Designed for Your Success
          </h2>
          <p className={`text-xl ${textColorMuted}`}>
            Powerful, simple features crafted to boost your efficiency and
            clarity.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-14 p-6 rounded-3xl ${featureBg}`}
          style={{ backdropFilter: isDark ? "blur(6px)" : "none" }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              className={`p-8 border rounded-2xl shadow-sm hover:shadow-lg transition ${borderColor} ${featureBg}`}
            >
              <h3 className={`text-2xl font-semibold mb-4 ${headingColor}`}>
                {feature.title}
              </h3>
              <p className={`leading-relaxed ${textColorMuted}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
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
