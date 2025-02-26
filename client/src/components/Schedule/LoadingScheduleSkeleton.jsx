import React from "react";
import {
  Calendar,
  Target,
  Clock,
  Activity,
  Filter,
  Plus,
  ArrowUpDown,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ShimmerEffect = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
);

const LoadingScheduleSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <section className={`py-20 relative ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Background gradients */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-indigo-900/1 via-black to-black"
            : "from-indigo-100/50 via-white to-white"
        }`}
      />
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]"
            : "bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]"
        }`}
      />

      <div className="mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div
              className={`relative h-10 w-80 rounded-lg mb-2 overflow-hidden ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <ShimmerEffect />
            </div>
            <div
              className={`w-24 h-1 relative overflow-hidden rounded-full ${
                isDark ? "bg-gray-800/60" : "bg-gray-200/60"
              }`}
            >
              <ShimmerEffect />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Filter Control */}
            <div className="flex items-center gap-2">
              <Filter
                className={`w-5 h-5 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <div
                className={`relative h-10 w-28 rounded-lg overflow-hidden ${
                  isDark ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <ShimmerEffect />
              </div>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2">
              <ArrowUpDown
                className={`w-5 h-5 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <div
                className={`relative h-10 w-28 rounded-lg overflow-hidden ${
                  isDark ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <ShimmerEffect />
              </div>
            </div>

            {/* Add Button */}
            <div
              className={`relative h-10 w-32 rounded-lg overflow-hidden flex items-center justify-center gap-2 ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <Plus
                className={`w-4 h-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <div className="relative flex-1 h-4 mr-2">
                <ShimmerEffect />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Calendar,
              color: isDark ? "text-indigo-400" : "text-indigo-600",
            },
            {
              icon: Target,
              color: isDark ? "text-emerald-400" : "text-emerald-600",
            },
            { icon: Clock, color: isDark ? "text-blue-400" : "text-blue-600" },
            { icon: Activity, color: isDark ? "text-red-400" : "text-red-600" },
          ].map(({ icon: Icon, color }, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border ${
                isDark
                  ? "bg-black border-indigo-500/30"
                  : "bg-white border-indigo-300/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-gray-800/50" : "bg-gray-100"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="space-y-2 flex-1">
                  <div
                    className={`relative h-4 rounded overflow-hidden ${
                      isDark ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <ShimmerEffect />
                  </div>
                  <div
                    className={`relative h-6 w-16 rounded overflow-hidden ${
                      isDark ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <ShimmerEffect />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Timeline Chart */}
          <div
            className={`p-6 rounded-lg border ${
              isDark
                ? "bg-black border-indigo-500/30"
                : "bg-white border-indigo-300/50"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Schedule Timeline
            </h3>
            <div
              className={`relative h-96 rounded overflow-hidden ${
                isDark ? "bg-gray-800/50" : "bg-gray-100/50"
              }`}
            >
              <ShimmerEffect />
              <div className="absolute inset-0 grid grid-cols-7 gap-4 p-4">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-full rounded ${
                      isDark ? "bg-gray-700/30" : "bg-gray-300/30"
                    }`}
                    style={{
                      animation: `pulse 2s ease-in-out infinite`,
                      animationDelay: `${i * 200}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div
            className={`p-6 rounded-lg border ${
              isDark
                ? "bg-black border-indigo-500/30"
                : "bg-white border-indigo-300/50"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Category Distribution
            </h3>
            <div
              className={`relative h-96 rounded overflow-hidden ${
                isDark ? "bg-gray-800/50" : "bg-gray-100/50"
              }`}
            >
              <ShimmerEffect />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full relative overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="mt-8">
          <div className="mb-8">
            <div
              className={`relative h-10 w-64 rounded-lg mb-2 overflow-hidden ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <ShimmerEffect />
            </div>
            <div
              className={`w-24 h-1 relative overflow-hidden rounded-full ${
                isDark ? "bg-gray-800/60" : "bg-gray-200/60"
              }`}
            >
              <ShimmerEffect />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border ${
                  isDark
                    ? "bg-black border-indigo-500/30"
                    : "bg-white border-indigo-300/50"
                }`}
                style={{
                  animation: `slideUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div
                      className={`relative h-6 w-3/4 rounded overflow-hidden ${
                        isDark ? "bg-gray-800" : "bg-gray-200"
                      }`}
                    >
                      <ShimmerEffect />
                    </div>
                  </div>
                  <div
                    className={`relative h-4 w-1/2 rounded overflow-hidden ${
                      isDark ? "bg-gray-800/60" : "bg-gray-200/60"
                    }`}
                  >
                    <ShimmerEffect />
                  </div>
                  <div className="space-y-2 mt-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`relative h-12 rounded-lg overflow-hidden ${
                          isDark ? "bg-gray-800/40" : "bg-gray-100/40"
                        }`}
                      >
                        <ShimmerEffect />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </section>
  );
};

export default LoadingScheduleSkeleton;
