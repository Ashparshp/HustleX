import { motion } from "framer-motion";
import { AlertCircle, X, RefreshCw } from "lucide-react";

const ErrorAlert = ({ error, onDismiss, onRetry, isDark, className }) => {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 mb-6 rounded-lg flex items-start justify-between ${
        isDark
          ? "bg-red-900/30 text-red-300 border border-red-700/30"
          : "bg-red-100 text-red-700 border border-red-200"
      } ${className || ""}`}
    >
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium">Error</h3>
          <p className="mt-1">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 inline-flex items-center text-sm underline hover:opacity-80"
            >
              <RefreshCw size={14} className="mr-1" />
              Try again
            </button>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-2"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default ErrorAlert;
