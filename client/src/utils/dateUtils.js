// src/utils/dateUtils.js

/**
 * Format a date to YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split("T")[0];
};

/**
 * Format a date to display format (e.g. "Mon, Jan 1, 2023")
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Format a time string (HH:MM) to display format (e.g. "1:30 PM")
 * @param {string} timeString - Time string in HH:MM format
 * @returns {string} Formatted time string
 */
export const formatTimeDisplay = (timeString) => {
  if (!timeString) return "";

  try {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeString;
  }
};

/**
 * Format a time range (HH:MM-HH:MM) to display format (e.g. "1:30 PM - 2:30 PM")
 * @param {string} timeRange - Time range string in HH:MM-HH:MM format
 * @returns {string} Formatted time range string
 */
export const formatTimeRange = (timeRange) => {
  if (!timeRange) return "N/A";

  const times = timeRange.split("-");
  if (times.length !== 2) return "Invalid Time";

  return `${formatTimeDisplay(times[0])} - ${formatTimeDisplay(times[1])}`;
};

/**
 * Get the start and end dates for the current week (Monday to Sunday)
 * @returns {Object} Object with startDate and endDate
 */
export const getCurrentWeekDates = () => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate Monday (start of week)
  const monday = new Date(now);
  if (currentDay === 0) {
    // If today is Sunday, go back 6 days to previous Monday
    monday.setDate(now.getDate() - 6);
  } else {
    // Otherwise, go back to Monday of current week
    monday.setDate(now.getDate() - (currentDay - 1));
  }
  monday.setHours(0, 0, 0, 0);

  // Calculate Sunday (end of week)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    startDate: monday,
    endDate: sunday,
  };
};

/**
 * Get the start and end dates for the current month
 * @returns {Object} Object with startDate and endDate
 */
export const getCurrentMonthDates = () => {
  const now = new Date();

  // Start of month
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

  // End of month
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  return { startDate, endDate };
};

/**
 * Get the start and end dates for a specific range
 * @param {string} range - Range type ('day', 'week', 'month', 'year')
 * @returns {Object} Object with startDate and endDate
 */
export const getDateRangeForPeriod = (range) => {
  const now = new Date();
  let startDate, endDate;

  switch (range) {
    case "day":
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "week":
      return getCurrentWeekDates();

    case "month":
      return getCurrentMonthDates();

    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;

    default:
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
  }

  return { startDate, endDate };
};

/**
 * Calculate the difference between two dates in days
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Difference in days
 */
export const getDateDifferenceInDays = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  // Convert to UTC dates to avoid timezone issues
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

  // Calculate difference in days
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

/**
 * Get an array of dates between start and end (inclusive)
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Array} Array of dates
 */
export const getDatesBetween = (startDate, endDate) => {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  const dates = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

/**
 * Check if two dates are the same day
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
export const isSameDay = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Get the day of week name for a date
 * @param {Date|string} date - Date
 * @param {boolean} short - Whether to return short day name
 * @returns {string} Day of week name
 */
export const getDayOfWeek = (date, short = false) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: short ? "short" : "long",
  });
};

/**
 * Get the day of month with suffix (e.g. "1st", "2nd", etc.)
 * @param {Date|string} date - Date
 * @returns {string} Day of month with suffix
 */
export const getDayWithSuffix = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDate();

  const suffix = ["th", "st", "nd", "rd"];
  const v = day % 100;
  return day + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
};
