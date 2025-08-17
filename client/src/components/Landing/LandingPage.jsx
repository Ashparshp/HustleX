import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import SEOHead from "../SEO/SEOHead";
import { PAGE_SEO } from "../../utils/seoConfig";
import {
  ClockIcon,
  ChartBarIcon,
  CalendarIcon,
  CogIcon,
  StarIcon,
  UserGroupIcon,
  TrophyIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: ClockIcon,
      title: "Smart Time Tracking",
      description:
        "Track your working hours with precision and get insights into your productivity patterns.",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
    },
    {
      icon: ChartBarIcon,
      title: "Skill Development",
      description:
        "Monitor your skill progress and set goals to continuously improve your expertise.",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    },
    {
      icon: CalendarIcon,
      title: "Intelligent Scheduling",
      description:
        "Create optimized schedules that maximize your productivity and work-life balance.",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
    {
      icon: CogIcon,
      title: "Customizable Workflows",
      description:
        "Adapt the platform to your unique workflow and preferences for maximum efficiency.",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: UserGroupIcon },
    { number: "1M+", label: "Hours Tracked", icon: ClockIcon },
    { number: "95%", label: "Productivity Increase", icon: TrophyIcon },
    { number: "24/7", label: "Available", icon: BoltIcon },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/working-hours");
    } else {
      navigate("/register");
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <>
      <SEOHead
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        keywords={PAGE_SEO.home.keywords}
        canonical={PAGE_SEO.home.canonical}
        structuredData={PAGE_SEO.home.structuredData}
      />
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-white"}`}>
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
                isDark ? "bg-purple-500" : "bg-purple-300"
              }`}
              style={{ filter: "blur(40px)" }}
            />
            <div
              className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
                isDark ? "bg-blue-500" : "bg-blue-300"
              }`}
              style={{ filter: "blur(40px)" }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)"
                    : "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                  border: `1px solid ${
                    isDark
                      ? "rgba(99, 102, 241, 0.2)"
                      : "rgba(99, 102, 241, 0.3)"
                  }`,
                }}
              >
                <StarIcon className="w-4 h-4 mr-2 text-yellow-500" />
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Trusted by thousands of professionals
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className={`text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Master Your{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  Hustle
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className={`text-xl sm:text-2xl max-w-3xl mx-auto mb-10 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Transform your productivity with intelligent time tracking,
                skill development, and personalized scheduling. Build the career
                you've always wanted.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  onClick={handleGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                  }}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                </motion.button>

                {!isAuthenticated && (
                  <motion.button
                    onClick={handleSignIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-4 text-lg font-semibold rounded-xl border-2 transition-all duration-300 ${
                      isDark
                        ? "border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Sign In
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className={`py-16 ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div
                      className="p-3 rounded-full"
                      style={{
                        background: isDark
                          ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)"
                          : "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                      }}
                    >
                      <stat.icon className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.number}
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Everything you need to{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  succeed
                </span>
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Powerful tools designed to help you track, analyze, and optimize
                your professional growth journey.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className={`p-8 rounded-2xl transition-all duration-300 ${
                    isDark
                      ? "bg-gray-800 border border-gray-700 hover:border-gray-600"
                      : "bg-white border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className="p-3 rounded-xl mr-6"
                      style={{
                        background: feature.gradient,
                      }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold mb-3 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`text-base leading-relaxed ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className={`py-20 ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
        >
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.h2
              variants={itemVariants}
              className={`text-3xl sm:text-4xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Ready to transform your productivity?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-xl mb-10 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join thousands of professionals who are already maximizing their
              potential with HustleX.
            </motion.p>
            <motion.button
              variants={itemVariants}
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 text-lg font-semibold text-white rounded-xl shadow-lg transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
              }}
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Your Journey"}
            </motion.button>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default LandingPage;
