import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center h-[500px]"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
  </motion.div>
);

export default LoadingSpinner;
