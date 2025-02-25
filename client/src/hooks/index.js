// src/hooks/index.js
// Auth hook
export { useAuth } from "../context/AuthContext";

// Data management hooks
export { default as useTimetable } from "./useTimetable";
export { default as useWorkingHours } from "./useWorkingHours";
export { default as useSkills } from "./useSkills";
export { default as useGoals } from "./useGoals"; // Previously useContests
export { default as useSchedule } from "./useSchedule";
export { default as useLeetCode } from "./useLeetCode";
export { default as useCategories } from "./useCategories";
export { default as useTimeTracking } from "./useTimeTracking";

// Theme hook
export { useTheme } from "../context/ThemeContext";
