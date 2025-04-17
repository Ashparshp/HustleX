import { useState } from "react";
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

  const getMonthlyData = () => {
    const monthData = {};
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      monthData[i] = { count: 0, participated: 0 };
    }

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

  const getCellColor = (count, participated) => {
    if (count === 0) {
      return isDark ? "bg-gray-800" : "bg-gray-200";
    }

    if (participated > 0) {
      if (count === 1) return isDark ? "bg-purple-700" : "bg-purple-300";
      if (count === 2) return isDark ? "bg-purple-600" : "bg-purple-400";
      return isDark ? "bg-purple-500" : "bg-purple-500";
    } else {
      if (count === 1) return isDark ? "bg-gray-700" : "bg-gray-300";
      if (count === 2) return isDark ? "bg-gray-600" : "bg-gray-400";
      return isDark ? "bg-gray-500" : "bg-gray-500";
    }
  };

  const getCellTextColor = (count) => {
    if (count === 0) return isDark ? "text-gray-200" : "text-gray-800";
    return isDark ? "text-white" : "text-gray-800";
  };

  const generateCalendar = () => {
    const monthData = getMonthlyData();
    const firstDay = new Date(year, selectedMonth, 1).getDay();
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();

    const weeks = [];
    let days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        data: monthData[i],
      });

      if ((firstDay + i) % 7 === 0 || i === daysInMonth) {
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
            <div
              key={day}
              className={`text-center text-xs ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
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
                      <span className={getCellTextColor(day.data.count)}>
                        {day.day}
                      </span>
                      {day.data.count > 0 && (
                        <span
                          className={`text-[8px] ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          } ml-1`}
                        >
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

  const generateYearOverview = () => {
    const annualData = getAnnualSummary();
    const maxCount = Math.max(...annualData, 1);

    return (
      <div className="mt-2">
        <h3
          className={`text-lg font-medium mb-2 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Months...
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
                        ? isDark
                          ? "bg-purple-400"
                          : "bg-purple-500"
                        : isDark
                        ? "bg-gray-600"
                        : "bg-gray-400"
                      : count > 0
                      ? isDark
                        ? "bg-purple-600/60"
                        : "bg-purple-300"
                      : "bg-transparent"
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
                <p
                  className={`text-xs mt-1 ${
                    selectedMonth === index
                      ? isDark
                        ? "text-white"
                        : "text-gray-800"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-500"
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
    <div className={`w-full h-full ${isDark ? "" : "bg-white"}`}>
      {/* Header with month/year selector */}
      <div className="flex justify-between items-center mb-4">
        <h3
          className={`text-sm font-semibold flex items-center ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          <Calendar
            className={`mr-2 ${isDark ? "text-purple-400" : "text-purple-600"}`}
            size={20}
          />
          <span className="hidden sm:inline">Contest Activity</span>
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <button
              onClick={prevYear}
              className={`p-1 rounded-full ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            <span
              className={`text-sm font-medium ${
                isDark ? "text-white" : "text-gray-800"
              } mx-1`}
            >
              {year}
            </span>

            <button
              onClick={nextYear}
              className={`p-1 rounded-full ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
              disabled={year >= new Date().getFullYear()}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center">
            <button
              onClick={prevMonth}
              className={`p-1 rounded-full ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            <span
              className={`text-sm font-medium ${
                isDark ? "text-white" : "text-gray-800"
              } mx-1`}
            >
              {months[selectedMonth]}
            </span>

            <button
              onClick={nextMonth}
              className={`p-1 rounded-full ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
        <span
          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          Less
        </span>
        <div
          className={`w-3 h-3 rounded-sm ${
            isDark ? "bg-gray-800" : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`w-3 h-3 rounded-sm ${
            isDark ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`w-3 h-3 rounded-sm ${
            isDark ? "bg-gray-600" : "bg-gray-400"
          }`}
        ></div>
        <div
          className={`w-3 h-3 rounded-sm ${
            isDark ? "bg-gray-500" : "bg-gray-500"
          }`}
        ></div>
        <span
          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          More
        </span>

        <div className="ml-2 flex items-center">
          <div
            className={`w-3 h-3 rounded-sm ${
              isDark ? "bg-purple-600" : "bg-purple-400"
            }`}
          ></div>
          <span
            className={`ml-1 text-xs ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Participated
          </span>
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
          <Calendar
            className={`w-8 h-8 ${isDark ? "text-gray-700" : "text-gray-400"}`}
          />
          <p
            className={`mt-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            } text-sm`}
          >
            No contest data available
          </p>
        </div>
      )}
    </div>
  );
};

export default ContestsHeatmap;
