import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const { isDark } = useTheme();

  const features = [
    {
      icon: "⏰",
      title: "Track Your Working Hours",
      description: "See how your time is working for you with detailed time tracking and analytics."
    },
    {
      icon: "📅",
      title: "Create Timetables",
      description: "Design and manage different timetables for various activities and schedules."
    },
    {
      icon: "📊",
      title: "Track Weekly Activity",
      description: "Monitor your weekly progress and stay on top of your goals."
    },
    {
      icon: "✅",
      title: "Beautiful Todo Lists",
      description: "Create stunning todo lists and enjoy completing tasks with style."
    },
    {
      icon: "🎯",
      title: "Skills Progress",
      description: "Track your skill development and see your progress over time."
    }
  ];

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      style={
        !isDark
          ? {
              background:
                "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
            }
          : {}
      }
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-4xl sm:text-6xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-6`}>
              Track Your Working Hours
            </h1>
            <p className={`text-xl sm:text-2xl ${isDark ? "text-gray-300" : "text-gray-600"} mb-8 max-w-3xl mx-auto`}>
              See how your time is working for you. Create timetables, track weekly activity, and monitor your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className={`${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-50 text-gray-900"} px-8 py-3 rounded-lg font-semibold border transition-colors`}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
              Everything You Need to Stay Productive
            </h2>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto`}>
              Powerful tools to help you manage your time, track your progress, and achieve your goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl ${
                  isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                } border shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {feature.title}
                </h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDark ? "bg-gray-800/50" : "bg-white/60"}`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-6`}>
            Ready to Transform Your Productivity?
          </h2>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} mb-8`}>
            Join thousands of users who are already tracking their time and achieving their goals.
          </p>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Start Your Journey Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
