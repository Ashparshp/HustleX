// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Custom toast configuration
const toastConfig = {
  success: {
    duration: 3000,
    style: {
      background: "#10B981",
      color: "white",
      padding: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
    },
    iconTheme: {
      primary: "white",
      secondary: "#10B981",
    },
  },
  error: {
    duration: 3000,
    style: {
      background: "#EF4444",
      color: "white",
      padding: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
    },
    iconTheme: {
      primary: "white",
      secondary: "#EF4444",
    },
  },
  info: {
    duration: 3000,
    style: {
      background: "#3B82F6",
      color: "white",
      padding: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
    },
    iconTheme: {
      primary: "white",
      secondary: "#3B82F6",
    },
  },
};

// Enhanced toast functions
const showToast = {
  success: (message) => toast.success(message, toastConfig.success),
  error: (message) => toast.error(message, toastConfig.error),
  info: (message) => toast(message, toastConfig.info),
  loading: (message) =>
    toast.loading(message, {
      style: {
        background: "#6B7280",
        color: "white",
        padding: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
    }),
  dismiss: () => toast.dismiss(),
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Check if user is logged in on initial load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const data = await response.json();
        setCurrentUser(data.data);
      } catch (err) {
        console.error("Auth verification error:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [API_URL, token]);

  // Register new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);
      setCurrentUser(data.user);

      showToast.success("Account created! Please verify your email");
      return data;
    } catch (err) {
      setError(err.message);
      showToast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);
      setCurrentUser(data.user);
      showToast.success("Welcome back!");
      return data;
    } catch (err) {
      setError(err.message);
      showToast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setToken(null);
      setCurrentUser(null);
      localStorage.removeItem("token");
      showToast.info("You've been logged out");
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.loading("Processing your request...");

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      toast.dismiss(loadingToast);
      showToast.success("Reset link sent! Check your email inbox");
      return data;
    } catch (err) {
      setError(err.message);
      toast.dismiss(loadingToast);
      showToast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.loading("Resetting your password...");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.dismiss(loadingToast);
      showToast.success("Password reset successful! You can now login");
      return data;
    } catch (err) {
      setError(err.message);
      toast.dismiss(loadingToast);
      showToast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    setLoading(true);
    setError(null);
    const loadingToast = showToast.loading("Verifying your email...");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/verify-email/${token}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify email");
      }

      toast.dismiss(loadingToast);
      showToast.success("Email verified successfully!");
      return data;
    } catch (err) {
      setError(err.message);
      toast.dismiss(loadingToast);
      showToast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    if (!token) {
      showToast.error("You must be logged in");
      return;
    }

    setLoading(true);
    setError(null);
    const loadingToast = showToast.loading("Updating your profile...");

    try {
      const response = await fetch(`${API_URL}/api/auth/update-details`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setCurrentUser({
        ...currentUser,
        ...data.data,
      });

      toast.dismiss(loadingToast);
      showToast.success("Profile updated successfully!");
      return data;
    } catch (err) {
      setError(err.message);
      toast.dismiss(loadingToast);
      showToast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    if (!token) {
      showToast.error("You must be logged in");
      return;
    }

    setLoading(true);
    setError(null);
    const loadingToast = showToast.loading("Changing your password...");

    try {
      const response = await fetch(`${API_URL}/api/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.dismiss(loadingToast);
      showToast.success("Password updated successfully!");
      return data;
    } catch (err) {
      setError(err.message);
      toast.dismiss(loadingToast);
      showToast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify phone
  const verifyPhone = async (verificationCode) => {
    if (!token) {
      showToast.error("You must be logged in");
      return;
    }

    setLoading(true);
    setError(null);
    const loadingToast = showToast.loading("Verifying your phone...");

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify phone");
      }

      // Update user with verified phone
      setCurrentUser({
        ...currentUser,
        isPhoneVerified: true,
      });

      toast.dismiss(loadingToast);
      showToast.success("Phone verified successfully!");
      return data;
    } catch (err) {
      setError(err.message);
      toast.dismiss(loadingToast);
      showToast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend email verification
  const resendEmailVerification = async () => {
    if (!token) {
      showToast.error("You must be logged in");
      return;
    }

    setLoading(true);
    setError(null);
    const loadingToast = showToast.loading("Sending verification email...");

    try {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification email");
      }

      toast.dismiss(loadingToast);
      showToast.success("Verification email sent to your inbox");
      return data;
    } catch (err) {
      setError(err.message);
      toast.dismiss(loadingToast);
      showToast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend phone verification
  const resendPhoneVerification = async () => {
    if (!token) {
      showToast.error("You must be logged in");
      return;
    }

    setLoading(true);
    setError(null);
    const loadingToast = showToast.loading("Sending verification code...");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/resend-phone-verification`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend phone verification");
      }

      toast.dismiss(loadingToast);
      showToast.success("Verification code sent to your phone");
      return data;
    } catch (err) {
      setError(err.message);
      toast.dismiss(loadingToast);
      showToast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateProfile,
    changePassword,
    verifyPhone,
    resendEmailVerification,
    resendPhoneVerification,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
