import { useTheme } from "../../context/ThemeContext";

const LoadingSkillsSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <section className={`py-20 relative ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Background Gradients */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? "from-indigo-900/10 via-black to-black"
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

      <div className="mx-auto px-4 max-w-6xl relative z-10">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div
            className={`h-8 w-64 rounded-lg ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            } animate-pulse`}
          ></div>
          <div className="flex gap-2">
            <div
              className={`h-10 w-32 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              } animate-pulse`}
            ></div>
            <div
              className={`h-10 w-32 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-200"
              } animate-pulse`}
            ></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`p-6 rounded-lg border animate-pulse ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <div
                    className={`h-4 w-20 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-8 w-16 rounded mt-2 ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`h-10 w-10 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Sections Skeleton */}
        {[...Array(3)].map((_, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <div
              className={`p-6 rounded-lg border animate-pulse mb-4 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div
                  className={`h-6 w-40 rounded ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  } animate-pulse`}
                ></div>
                <div
                  className={`h-6 w-6 rounded-full ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  } animate-pulse`}
                ></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, cardIndex) => (
                  <div
                    key={`${categoryIndex}-${cardIndex}`}
                    className={`p-4 rounded-lg border animate-pulse ${
                      isDark
                        ? "bg-gray-800/70 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                    style={{
                      height: "180px",
                      animationDelay: `${
                        (categoryIndex * 3 + cardIndex) * 0.1
                      }s`,
                    }}
                  >
                    <div className="flex justify-between mb-2">
                      <div
                        className={`h-5 w-20 rounded ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`h-5 w-16 rounded ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                    <div
                      className={`h-6 w-full rounded mb-4 ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-3 w-full rounded-full mb-1 ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-8 w-full rounded mt-4 ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LoadingSkillsSkeleton;
