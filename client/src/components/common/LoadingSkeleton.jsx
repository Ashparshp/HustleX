import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const LoadingSkeleton = () => {
  const { isDark } = useTheme();

  const skeletonClasses = `relative overflow-hidden rounded-lg border backdrop-blur-sm
    ${
      isDark
        ? "bg-black/40 border-indigo-500/30"
        : "bg-white/40 border-indigo-300/50"
    }`;

  const shimmerClasses = `absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]
    bg-gradient-to-r ${
      isDark
        ? "from-black/0 via-indigo-500/10 to-black/0"
        : "from-white/0 via-indigo-400/10 to-white/0"
    }`;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`stat-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={skeletonClasses}
          >
            <div className="p-6 flex justify-between items-start gap-4">
              <div className="space-y-3 flex-1">
                <div className="h-4 w-24 rounded bg-current opacity-10" />
                <div className="h-7 w-32 rounded bg-current opacity-10" />
                <div className="h-4 w-full rounded bg-current opacity-10" />
              </div>
              <div className="w-12 h-12 rounded-lg bg-current opacity-10" />
            </div>
            <div className={shimmerClasses} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={`chart-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className={`${skeletonClasses} h-96`}
          >
            <div className="p-6 space-y-4">
              <div className="h-5 w-36 rounded bg-current opacity-10" />
              <div className="h-full w-full rounded bg-current opacity-5" />
            </div>
            <div className={shimmerClasses} />
          </motion.div>
        ))}
      </div>

      {/* Recent Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`${skeletonClasses}`}
      >
        <div className="p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-current opacity-10" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={`entry-${i}`}
                className="h-24 rounded bg-current opacity-5"
              />
            ))}
          </div>
        </div>
        <div className={shimmerClasses} />
      </motion.div>
    </div>
  );
};

export default LoadingSkeleton;
