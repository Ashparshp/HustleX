import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const AnimatedHero = () => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const primaryColor = isDark ? "#60A5FA" : "#2563EB";
  const secondaryColor = isDark ? "#34D399" : "#059669";
  const accentColor = isDark ? "#F472B6" : "#EC4899";
  const backgroundGradient = isDark 
    ? "from-gray-800 to-gray-900" 
    : "from-blue-50 to-indigo-100";

  return (
    <div className={`relative w-full max-w-md mx-auto h-96 bg-gradient-to-br ${backgroundGradient} rounded-3xl overflow-hidden shadow-2xl`}>
      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Circles */}
        <div 
          className={`absolute top-8 left-8 w-16 h-16 rounded-full opacity-20 animate-pulse`}
          style={{ backgroundColor: primaryColor }}
        />
        <div 
          className={`absolute top-16 right-12 w-12 h-12 rounded-full opacity-30 animate-bounce`}
          style={{ backgroundColor: secondaryColor, animationDelay: '0.5s' }}
        />
        <div 
          className={`absolute bottom-16 left-12 w-8 h-8 rounded-full opacity-25 animate-ping`}
          style={{ backgroundColor: accentColor, animationDelay: '1s' }}
        />
        
        {/* Floating Geometric Shapes */}
        <div 
          className={`absolute top-24 right-8 transform transition-transform duration-1000 ${isVisible ? 'translate-y-0 rotate-12' : 'translate-y-4 rotate-0'}`}
        >
          <div 
            className="w-10 h-10 transform rotate-45 opacity-40"
            style={{ backgroundColor: accentColor }}
          />
        </div>
        
        <div 
          className={`absolute bottom-24 right-16 transform transition-transform duration-1500 ${isVisible ? 'translate-x-0 rotate-45' : 'translate-x-4 rotate-0'}`}
        >
          <div 
            className="w-6 h-6 rounded-full opacity-50"
            style={{ backgroundColor: secondaryColor }}
          />
        </div>
      </div>

      {/* Central Dashboard Mockup */}
      <div className={`absolute inset-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Header Bar */}
        <div className="h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl flex items-center px-3 gap-1">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
        
        {/* Content Area */}
        <div className="p-4 space-y-3">
          {/* Progress Bars */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transform transition-all duration-2000 ease-out"
                  style={{ 
                    width: isVisible ? '75%' : '0%',
                    transitionDelay: '0.5s'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transform transition-all duration-2000 ease-out"
                  style={{ 
                    width: isVisible ? '60%' : '0%',
                    transitionDelay: '0.8s'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transform transition-all duration-2000 ease-out"
                  style={{ 
                    width: isVisible ? '85%' : '0%',
                    transitionDelay: '1.1s'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div 
              className={`p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
              style={{ transitionDelay: '1.4s' }}
            >
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">Tasks</div>
              <div className="text-lg font-bold text-blue-800 dark:text-blue-200">24</div>
            </div>
            
            <div 
              className={`p-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
              style={{ transitionDelay: '1.6s' }}
            >
              <div className="text-xs font-semibold text-green-700 dark:text-green-300">Hours</div>
              <div className="text-lg font-bold text-green-800 dark:text-green-200">8.5</div>
            </div>
          </div>
          
          {/* Timeline Dots */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500`}
                style={{
                  backgroundColor: isVisible ? primaryColor : '#E5E7EB',
                  transitionDelay: `${1.8 + i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div 
        className={`absolute bottom-4 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transform transition-all duration-1000 hover:scale-110 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          transitionDelay: '2.3s'
        }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>

      {/* Sparkle Effects */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-ping"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        >
          <div 
            className="w-1 h-1 rounded-full opacity-60"
            style={{ backgroundColor: Math.random() > 0.5 ? primaryColor : accentColor }}
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-gray-900/10 pointer-events-none" />
    </div>
  );
};

export default AnimatedHero;
