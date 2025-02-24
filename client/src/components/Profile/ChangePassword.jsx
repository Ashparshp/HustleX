// src/components/Profile/ChangePassword.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const { changePassword } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Form validation
    if (!currentPassword) {
      setFormError('Current password is required');
      return;
    }
    
    if (newPassword.length < 6) {
      setFormError('New password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setFormError('New passwords do not match');
      return;
    }
    
    setFormError('');
    setFormSuccess('');
    setIsSubmitting(true);
    
    try {
      await changePassword({ currentPassword, newPassword });
      setFormSuccess('Password changed successfully');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  // Styling variables for theme consistency
  const inputBaseClasses = `w-full py-2.5 px-4 rounded-lg border ${
    isDark 
      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-600'
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
    isDark ? 'focus:ring-indigo-500/30' : 'focus:ring-indigo-600/20'
  } transition duration-200`;
  
  const buttonClasses = `w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium ${
    isDark
      ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500/50'
      : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-600/50'
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-200 ${
    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
  }`;
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={contentVariants}
      className={`max-w-md w-full mx-auto p-6 rounded-xl shadow-lg ${
        isDark ? 'bg-gray-800 shadow-black/20' : 'bg-white shadow-gray-200/50'
      }`}
    >
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Change Password
        </h2>
        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Update your account password
        </p>
      </div>
      
      {formError && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
        }`}>
          {formError}
        </div>
      )}
      
      {formSuccess && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
        }`}>
          {formSuccess}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password Field */}
        <div>
          <label 
            htmlFor="currentPassword" 
            className={`block mb-1 text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputBaseClasses} pl-10 pr-10`}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showCurrentPassword ? (
                <EyeOff size={18} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              ) : (
                <Eye size={18} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              )}
            </button>
          </div>
        </div>
        
        {/* New Password Field */}
        <div>
          <label 
            htmlFor="newPassword" 
            className={`block mb-1 text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputBaseClasses} pl-10 pr-10`}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showNewPassword ? (
                <EyeOff size={18} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              ) : (
                <Eye size={18} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              )}
            </button>
          </div>
          <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Password must be at least 6 characters
          </p>
        </div>
        
        {/* Confirm New Password Field */}
        <div>
          <label 
            htmlFor="confirmPassword" 
            className={`block mb-1 text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputBaseClasses} pl-10 pr-10`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              ) : (
                <Eye size={18} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              )}
            </button>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className={buttonClasses}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Save size={18} />
          )}
          {isSubmitting ? 'Changing Password...' : 'Change Password'}
        </button>
        
        <div className="text-center mt-4">
          <Link 
            to="/profile" 
            className={`inline-flex items-center text-sm ${
              isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
            } transition duration-200`}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Profile
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default ChangePassword;