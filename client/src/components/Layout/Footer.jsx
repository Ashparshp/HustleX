import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  const currentYear = new Date().getFullYear();

  const links = [
    { label: "Home", path: isAuthenticated ? "/dashboard" : "/" },
    { label: "About", path: "/about" },
    { label: "Privacy", path: "/privacy" },
    { label: "Terms", path: "/terms" },
  ];

  const socialLinks = [
    {
      icon: <Github size={18} />,
      href: "https://github.com/yourusername",
      label: "GitHub",
    },
    {
      icon: <Twitter size={18} />,
      href: "https://twitter.com/yourusername",
      label: "Twitter",
    },
    {
      icon: <Linkedin size={18} />,
      href: "https://linkedin.com/in/yourusername",
      label: "LinkedIn",
    },
    {
      icon: <Mail size={18} />,
      href: "mailto:contact@example.com",
      label: "Email",
    },
  ];

  return (
    <footer
      className={`border-t ${
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="flex items-center space-x-2">
            <span
              className={`font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              HustleX
            </span>
            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              &copy; {currentYear}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`text-sm ${
                  isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                } transition-colors duration-200`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full ${
                  isDark
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                } transition-colors duration-200`}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Made with love */}
        <div className="mt-4 text-center">
          <p
            className={`text-sm flex items-center justify-center ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Made with
            <Heart size={14} className="mx-1 text-red-500" />
            by YourName
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
