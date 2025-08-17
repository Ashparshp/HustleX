import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import AnimatedHero from "./AnimatedHero";

const LandingPage = () => {
  const { isDark } = useTheme();

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

  // Define clear colors for light and dark text and backgrounds:
  // - Use the same text colors for main text in light and dark with appropriate contrast
  // - Use mild background colors that keep content distinct and easy on eyes

  const bgColor = isDark ? "bg-gray-900" : "bg-white";
  const textColorMain = isDark ? "text-gray-100" : "text-gray-900";
  const textColorMuted = isDark ? "text-gray-400" : "text-gray-700";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const featureBg = isDark ? "bg-gray-800" : "bg-white";
  const headingColor = isDark ? "text-blue-400" : "text-blue-700";
  const buttonPrimaryBg = isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-700 hover:bg-blue-800";
  const buttonPrimaryText = "text-white";
  const buttonSecondaryBorder = isDark ? "border-gray-600 hover:border-gray-500" : "border-blue-700 hover:border-blue-900";
  const buttonSecondaryText = isDark ? "text-gray-300 hover:text-gray-100" : "text-blue-700 hover:text-blue-900";

  return (
    <div
      className={`min-h-screen ${bgColor} ${textColorMain}`}
      style={{ fontFamily: "'Eugene', serif" }}
    >
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-6 py-20 gap-16">
        <div className="lg:w-1/2 flex justify-center">
          <AnimatedHero />
        </div>
        <div className="lg:w-1/2">
          <h1 className={`text-5xl font-bold mb-6 leading-tight ${headingColor}`}>
            Take Full Control Of Your Time
          </h1>
          <p className={`text-lg mb-10 max-w-lg leading-relaxed ${textColorMuted}`}>
            Empower your productivity with intelligent time tracking, customizable timetables, and insightful progress reports.
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
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className={`text-4xl font-extrabold mb-4 ${headingColor}`}>
            Tools Designed for Your Success
          </h2>
          <p className={`text-xl ${textColorMuted}`}>
            Powerful, simple features crafted to boost your efficiency and clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
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

      {/* CTA Section */}
      <section className={`py-20 text-center ${isDark ? "bg-gray-800" : "bg-blue-50"}`}>
        <h2 className={`text-3xl font-extrabold mb-6 ${headingColor} max-w-3xl mx-auto px-6`}>
          Ready to boost your productivity and change the way you work?
        </h2>
        <p className={`max-w-xl mx-auto mb-10 text-lg px-6 ${textColorMuted}`}>
          Join thousands of users who trust our tools to organize their time and goals.
        </p>
        <Link
          to="/register"
          className={`${buttonPrimaryBg} ${buttonPrimaryText} text-lg font-semibold py-4 px-14 rounded-full shadow-lg transition`}
        >
          Start Your Journey
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
