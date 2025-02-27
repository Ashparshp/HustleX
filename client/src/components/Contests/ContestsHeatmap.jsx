// src/components/Contests/ContestsHeatmap.jsx
import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ContestsHeatmap = ({ data = [] }) => {
  const { isDark } = useTheme();
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get contest data for the current month
  const getMonthlyData = () => {
    const monthData = {};

    // Initialize the data structure with all days of the month
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      monthData[i] = { count: 0, participated: 0 };
    }

    // Fill with contest data
    data.forEach((contest) => {
      const contestDate = new Date(contest.date);
      if (
        contestDate.getFullYear() === year &&
        contestDate.getMonth() === selectedMonth
      ) {
        const day = contestDate.getDate();
        if (monthData[day]) {
          monthData[day].count += 1;
          if (contest.participated) {
            monthData[day].participated += 1;
          }
        }
      }
    });

    return monthData;
  };

  // Get monthly contest count summary
  const getAnnualSummary = () => {
    const summary = Array(12).fill(0);

    data.forEach((contest) => {
      const contestDate = new Date(contest.date);
      if (contestDate.getFullYear() === year) {
        const month = contestDate.getMonth();
        summary[month] += 1;
      }
    });

    return summary;
  };

  // Get cell color based on contest data
  const getCellColor = (count, participated) => {
    if (count === 0) return "bg-gray-800";

    if (participated > 0) {
      if (count === 1) return "bg-purple-700";
      if (count === 2) return "bg-purple-600";
      return "bg-purple-500";
    } else {
      if (count === 1) return "bg-gray-700";
      if (count === 2) return "bg-gray-600";
      return "bg-gray-500";
    }
  };

  // Generate calendar for current month
  const generateCalendar = () => {
    const monthData = getMonthlyData();
    const firstDay = new Date(year, selectedMonth, 1).getDay();
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();

    // Create array for calendar weeks
    const weeks = [];
    let days = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        data: monthData[i],
      });

      // Start a new week
      if ((firstDay + i) % 7 === 0 || i === daysInMonth) {
        // Fill the rest of the last week with empty cells
        while (days.length % 7 !== 0) {
          days.push(null);
        }
        weeks.push([...days]);
        days = [];
      }
    }

    return (
      <div className="mt-4">
        <div className="grid grid-cols-7 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-xs text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`
                    h-12 flex items-center justify-center rounded-sm text-xs
                    ${
                      day
                        ? getCellColor(day.data.count, day.data.participated)
                        : "bg-transparent"
                    }
                  `}
                  title={
                    day
                      ? `${day.data.count} contest(s), ${day.data.participated} participated`
                      : ""
                  }
                >
                  {day && (
                    <div className="flex items-center">
                      <span className="text-white">{day.day}</span>
                      {day.data.count > 0 && (
                        <span className="text-[8px] text-gray-300 ml-1">
                          ({day.data.count})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Generate year overview chart
  const generateYearOverview = () => {
    const annualData = getAnnualSummary();
    const maxCount = Math.max(...annualData, 1);

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2 text-white">
          Contest Distribution by Month
        </h3>
        <div className="grid grid-cols-12 gap-1 h-16">
          {annualData.map((count, index) => {
            const height = count > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div
                key={months[index]}
                className="flex flex-col items-center justify-end cursor-pointer"
                onClick={() => setSelectedMonth(index)}
              >
                <div
                  className={`w-full rounded-t-sm ${
                    selectedMonth === index
                      ? count > 0
                        ? "bg-purple-400"
                        : "bg-gray-600"
                      : count > 0
                      ? "bg-purple-600/60"
                      : "bg-transparent"
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
                <p
                  className={`text-xs mt-1 ${
                    selectedMonth === index ? "text-white" : "text-gray-400"
                  }`}
                >
                  {months[index]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Navigation handlers
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setYear(year - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setYear(year + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const prevYear = () => {
    setYear(year - 1);
  };

  const nextYear = () => {
    const currentYear = new Date().getFullYear();
    if (year < currentYear) {
      setYear(year + 1);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Header with month/year selector */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold flex items-center text-white">
          <Calendar className="mr-2 text-purple-400" size={20} />
          <span className="hidden sm:inline">Contest Activity</span>
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <button
              onClick={prevYear}
              className="p-1 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm font-medium text-white mx-1">{year}</span>

            <button
              onClick={nextYear}
              className="p-1 rounded-full hover:bg-gray-800 text-gray-400"
              disabled={year >= new Date().getFullYear()}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center">
            <button
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm font-medium text-white mx-1">
              {months[selectedMonth]}
            </span>

            <button
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
        <span className="text-xs text-gray-400">Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-800"></div>
        <div className="w-3 h-3 rounded-sm bg-gray-700"></div>
        <div className="w-3 h-3 rounded-sm bg-gray-600"></div>
        <div className="w-3 h-3 rounded-sm bg-gray-500"></div>
        <span className="text-xs text-gray-400">More</span>

        <div className="ml-2 flex items-center">
          <div className="w-3 h-3 rounded-sm bg-purple-600"></div>
          <span className="ml-1 text-xs text-gray-400">Participated</span>
        </div>
      </div>

      {/* Calendar */}
      {data.length > 0 ? (
        <>
          {generateCalendar()}
          {generateYearOverview()}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          <Calendar className="w-8 h-8 text-gray-700" />
          <p className="mt-2 text-gray-400 text-sm">
            No contest data available
          </p>
        </div>
      )}
    </div>
  );
};

export default ContestsHeatmap;
