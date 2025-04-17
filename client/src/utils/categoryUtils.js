export const getCategoryColor = (category, isDark = false) => {
  const colorMap = {
    Coding: isDark
      ? "bg-blue-500/20 text-blue-300"
      : "bg-blue-100 text-blue-700",
    Learning: isDark
      ? "bg-green-500/20 text-green-300"
      : "bg-green-100 text-green-700",
    "Project Work": isDark
      ? "bg-purple-500/20 text-purple-300"
      : "bg-purple-100 text-purple-700",
    Other: isDark
      ? "bg-gray-500/20 text-gray-300"
      : "bg-gray-100 text-gray-700",
    "MERN Stack": isDark
      ? "bg-emerald-500/20 text-emerald-300"
      : "bg-emerald-100 text-emerald-700",
    "Java & Ecosystem": isDark
      ? "bg-amber-500/20 text-amber-300"
      : "bg-amber-100 text-amber-700",
    DevOps: isDark ? "bg-red-500/20 text-red-300" : "bg-red-100 text-red-700",
    "Data Science & ML": isDark
      ? "bg-indigo-500/20 text-indigo-300"
      : "bg-indigo-100 text-indigo-700",
    "Mobile Development": isDark
      ? "bg-orange-500/20 text-orange-300"
      : "bg-orange-100 text-orange-700",
    "Go Backend": isDark
      ? "bg-cyan-500/20 text-cyan-300"
      : "bg-cyan-100 text-cyan-700",
    DSA: isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700",
    "System Design": isDark
      ? "bg-purple-500/20 text-purple-300"
      : "bg-purple-100 text-purple-700",
    Development: isDark
      ? "bg-green-500/20 text-green-300"
      : "bg-green-100 text-green-700",
    "Problem Solving": isDark
      ? "bg-yellow-500/20 text-yellow-300"
      : "bg-yellow-100 text-yellow-700",
    Career: isDark
      ? "bg-blue-500/20 text-blue-300"
      : "bg-blue-100 text-blue-700",
    Backend: isDark
      ? "bg-emerald-500/20 text-emerald-300"
      : "bg-emerald-100 text-emerald-700",
    Core: isDark ? "bg-red-500/20 text-red-300" : "bg-red-100 text-red-700",
    Frontend: isDark
      ? "bg-orange-500/20 text-orange-300"
      : "bg-orange-100 text-orange-700",
    Mobile: isDark
      ? "bg-purple-500/20 text-purple-300"
      : "bg-purple-100 text-purple-700",
    LeetCode: isDark
      ? "bg-yellow-500/20 text-yellow-300"
      : "bg-yellow-100 text-yellow-700",
    CodeChef: isDark
      ? "bg-blue-500/20 text-blue-300"
      : "bg-blue-100 text-blue-700",
    CodeForces: isDark
      ? "bg-red-500/20 text-red-300"
      : "bg-red-100 text-red-700",
    HackerRank: isDark
      ? "bg-green-500/20 text-green-300"
      : "bg-green-100 text-green-700",
  };

  return (
    colorMap[category] ||
    (isDark ? "bg-gray-500/20 text-gray-300" : "bg-gray-100 text-gray-700")
  );
};

export const getCategoryIcon = (category) => {
  const iconMap = {
    Coding: "code",
    Learning: "book-open",
    "Project Work": "briefcase",
    Other: "more-horizontal",
    "MERN Stack": "server",
    "Java & Ecosystem": "coffee",
    DevOps: "settings",
    "Data Science & ML": "bar-chart-2",
    "Mobile Development": "smartphone",
    "Go Backend": "send",
    DSA: "code",
    "System Design": "git-branch",
    Development: "code-sandbox",
    "Problem Solving": "zap",
    Career: "briefcase",
    Backend: "server",
    Core: "cpu",
    Frontend: "layout",
    Mobile: "smartphone",
    LeetCode: "code",
    CodeChef: "hash",
    CodeForces: "activity",
    HackerRank: "terminal",
  };

  return iconMap[category] || "circle";
};

export const createCategory = (name, isDark = false) => {
  return {
    name,
    color: getCategoryColor(name, isDark),
    icon: getCategoryIcon(name),
  };
};

export const getHashColor = (str, isDark = false) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    {
      light: "bg-blue-100 text-blue-700",
      dark: "bg-blue-500/20 text-blue-300",
    },
    {
      light: "bg-green-100 text-green-700",
      dark: "bg-green-500/20 text-green-300",
    },
    { light: "bg-red-100 text-red-700", dark: "bg-red-500/20 text-red-300" },
    {
      light: "bg-purple-100 text-purple-700",
      dark: "bg-purple-500/20 text-purple-300",
    },
    {
      light: "bg-yellow-100 text-yellow-700",
      dark: "bg-yellow-500/20 text-yellow-300",
    },
    {
      light: "bg-indigo-100 text-indigo-700",
      dark: "bg-indigo-500/20 text-indigo-300",
    },
    {
      light: "bg-pink-100 text-pink-700",
      dark: "bg-pink-500/20 text-pink-300",
    },
    {
      light: "bg-cyan-100 text-cyan-700",
      dark: "bg-cyan-500/20 text-cyan-300",
    },
    {
      light: "bg-amber-100 text-amber-700",
      dark: "bg-amber-500/20 text-amber-300",
    },
    {
      light: "bg-emerald-100 text-emerald-700",
      dark: "bg-emerald-500/20 text-emerald-300",
    },
    {
      light: "bg-orange-100 text-orange-700",
      dark: "bg-orange-500/20 text-orange-300",
    },
    {
      light: "bg-lime-100 text-lime-700",
      dark: "bg-lime-500/20 text-lime-300",
    },
  ];

  const colorIndex = Math.abs(hash) % colors.length;
  return isDark ? colors[colorIndex].dark : colors[colorIndex].light;
};

export const getDefaultCategories = (type) => {
  const defaultCategories = {
    "working-hours": [
      { name: "Coding", color: "#3498db", icon: "code" },
      { name: "Learning", color: "#2ecc71", icon: "book" },
      { name: "Project Work", color: "#e74c3c", icon: "briefcase" },
      { name: "Other", color: "#95a5a6", icon: "more-horizontal" },
    ],
    skills: [
      { name: "MERN Stack", color: "#3498db", icon: "server" },
      { name: "Java & Ecosystem", color: "#e67e22", icon: "coffee" },
      { name: "DevOps", color: "#9b59b6", icon: "settings" },
      { name: "Data Science & ML", color: "#2ecc71", icon: "bar-chart-2" },
      { name: "Mobile Development", color: "#e74c3c", icon: "smartphone" },
      { name: "Go Backend", color: "#1abc9c", icon: "send" },
    ],
    schedule: [
      { name: "DSA", color: "#3498db", icon: "code" },
      { name: "System Design", color: "#9b59b6", icon: "git-branch" },
      { name: "Development", color: "#2ecc71", icon: "code-sandbox" },
      { name: "Learning", color: "#f39c12", icon: "book-open" },
      { name: "Problem Solving", color: "#e74c3c", icon: "zap" },
      { name: "Other", color: "#95a5a6", icon: "more-horizontal" },
    ],
    timetable: [
      { name: "Career", color: "#3498db", icon: "briefcase" },
      { name: "Backend", color: "#2ecc71", icon: "server" },
      { name: "Core", color: "#e74c3c", icon: "cpu" },
      { name: "Frontend", color: "#f39c12", icon: "layout" },
      { name: "Mobile", color: "#9b59b6", icon: "smartphone" },
    ],
    goals: [
      { name: "LeetCode", color: "#f39c12", icon: "code" },
      { name: "CodeChef", color: "#3498db", icon: "hash" },
      { name: "CodeForces", color: "#e74c3c", icon: "activity" },
      { name: "HackerRank", color: "#2ecc71", icon: "terminal" },
    ],
  };

  return defaultCategories[type] || [];
};
