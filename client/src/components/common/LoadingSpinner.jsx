import { motion } from "framer-motion";

const LoadingSpinner = ({
  size = "medium",
  color = "indigo",
  text = "Loading...",
  showText = true,
  fullPage = true,
}) => {
  // Size variants
  const sizeMap = {
    small: { spinner: "h-6 w-6", container: "h-6 w-6", text: "text-sm" },
    medium: { spinner: "h-10 w-10", container: "h-10 w-10", text: "text-base" },
    large: { spinner: "h-16 w-16", container: "h-16 w-16", text: "text-lg" },
  };

  // Color variants
  const colorMap = {
    indigo: "border-indigo-500 text-indigo-700",
    blue: "border-blue-500 text-blue-700",
    green: "border-green-500 text-green-700",
    red: "border-red-500 text-red-700",
    purple: "border-purple-500 text-purple-700",
    pink: "border-pink-500 text-pink-700",
    teal: "border-teal-500 text-teal-700",
  };

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerVariants}
      className={`flex flex-col items-center justify-center gap-4 ${
        fullPage ? "min-h-[500px]" : ""
      }`}
      aria-label="Content is loading"
      role="status"
    >
      <div className="relative">
        {/* Main spinner */}
        <motion.div
          variants={spinnerVariants}
          className={`${
            sizeMap[size].spinner
          } rounded-full border-4 border-t-4 border-gray-200 ${
            colorMap[color].split(" ")[0]
          }`}
        />

        {/* Pulse effect behind the spinner */}
        <motion.div
          variants={pulseVariants}
          className={`absolute inset-0 ${sizeMap[size].spinner} rounded-full border-4 border-gray-100 opacity-30`}
        />
      </div>

      {/* Loading text */}
      {showText && (
        <motion.p
          variants={textVariants}
          className={`${sizeMap[size].text} font-medium ${
            colorMap[color].split(" ")[1]
          }`}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;