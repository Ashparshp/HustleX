import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const LoadingSpinner = ({ size = 'md', className = '', text = '' }) => {
  const { isDark } = useTheme();
  
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  };
  
  const spinnerClass = `inline-block rounded-full ${sizeClasses[size] || sizeClasses.md} ${
    isDark 
      ? 'border-indigo-500/30 border-t-indigo-500' 
      : 'border-indigo-200 border-t-indigo-600'
  }`;
  
  const containerClass = text 
    ? 'flex flex-col items-center justify-center gap-3' 
    : 'inline-block';
  
  return (
    <div className={`${containerClass} ${className}`}>
      <motion.div
        className={spinnerClass}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        aria-label="Loading"
      />
      {text && (
        <p className={`text-sm font-medium ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;