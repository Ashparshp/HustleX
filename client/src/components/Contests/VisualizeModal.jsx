// src/components/Contests/VisualizeModal.jsx
import { useState } from "react";
import { Calendar, PieChart } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ContestsHeatmap from "./ContestsHeatmap";
import PlatformDistribution from "./PlatformDistribution";

const VisualizeModal = ({ isOpen, onClose, contests, stats }) => {
  const { isDark } = useTheme();
  const [activeVisualization, setActiveVisualization] = useState("heatmap");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-2xl lg:max-w-4xl p-4 md:p-6 rounded-lg shadow-lg ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-lg md:text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Contest Visualization
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>✕</span>
          </button>
        </div>

        {/* Visualization Toggle */}
        <div className={`inline-flex rounded-lg p-1 ${
          isDark 
            ? "bg-gray-800 border border-gray-700" 
            : "bg-gray-100 border border-gray-200"
        } text-xs md:text-sm mb-4`}>
          {[
            {
              key: "heatmap",
              icon: Calendar,
              label: "Activity",
            },
            {
              key: "platform",
              icon: PieChart,
              label: "Platforms",
            },
          ].map((viz) => (
            <button
              key={viz.key}
              onClick={() => setActiveVisualization(viz.key)}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-lg transition-all duration-300 ${
                activeVisualization === viz.key
                  ? isDark 
                    ? "bg-purple-500/20 text-white"
                    : "bg-purple-100 text-purple-800"
                  : isDark
                    ? "text-gray-400 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <viz.icon className="w-3 h-3 md:w-4 md:h-4" />
              <span>{viz.label}</span>
            </button>
          ))}
        </div>

        {/* Visualization Content */}
        <div className={`${
          isDark ? "bg-black" : "bg-gray-50"
        } p-4 rounded-lg border ${
          isDark ? "border-purple-500/30" : "border-purple-200"
        } h-[500px]`}>
          {activeVisualization === "heatmap" ? (
            <ContestsHeatmap data={contests} />
          ) : (
            <PlatformDistribution data={stats?.platforms || {}} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizeModal;