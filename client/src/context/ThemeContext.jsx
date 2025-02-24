import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const theme = {
    colors: {
      primary: isDark
        ? {
            light: "#818cf8",
            DEFAULT: "#6366f1",
            dark: "#4f46e5",
          }
        : {
            light: "#a5b4fc",
            DEFAULT: "#6366f1",
            dark: "#4338ca",
          },
    },
    card: `rounded-lg border ${
      isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`,
    button: {
      primary: `px-4 py-2 rounded-lg font-medium transition-colors duration-200 
        ${
          isDark
            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
            : "bg-indigo-500 hover:bg-indigo-600 text-white"
        }`,
      secondary: `px-4 py-2 rounded-lg font-medium transition-colors duration-200 
        ${
          isDark
            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
        }`,
    },
    input: `w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200
      ${
        isDark
          ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
          : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
      }`,
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
