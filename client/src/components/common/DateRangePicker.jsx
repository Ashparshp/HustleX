import ReactDatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  const { isDark } = useTheme();

  return (
    <div className="relative group">
      <div
        className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-30 
                    group-hover:opacity-50 transition duration-300"
      />

      <div className="relative">
        <Calendar
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 w-4 h-4
            ${isDark ? "text-indigo-400" : "text-indigo-600"}`}
        />
        <ReactDatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={onChange}
          dateFormat="MMM dd, yyyy"
          className={`w-full pl-10 pr-4 py-2 rounded-lg border backdrop-blur-sm transition-all duration-300
            ${
              isDark
                ? "bg-black border-indigo-500/30 text-white placeholder-gray-500 focus:border-indigo-400"
                : "bg-white border-indigo-300/50 text-gray-900 placeholder-gray-400 focus:border-indigo-500"
            }`}
          placeholderText="Select date range"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
