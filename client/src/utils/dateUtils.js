export const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split("T")[0];
};

export const formatDisplayDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

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

export const formatTimeRange = (timeRange) => {
  if (!timeRange) return "N/A";

  const times = timeRange.split("-");
  if (times.length !== 2) return "Invalid Time";

  return `${formatTimeDisplay(times[0])} - ${formatTimeDisplay(times[1])}`;
};

export const getCurrentWeekDates = () => {
  const now = new Date();
  const currentDay = now.getDay();

  const monday = new Date(now);
  if (currentDay === 0) {
    monday.setDate(now.getDate() - 6);
  } else {
    monday.setDate(now.getDate() - (currentDay - 1));
  }
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    startDate: monday,
    endDate: sunday,
  };
};

export const getCurrentMonthDates = () => {
  const now = new Date();

  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

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

export const getDateDifferenceInDays = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

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

export const isSameDay = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const getDayOfWeek = (date, short = false) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: short ? "short" : "long",
  });
};

export const getDayWithSuffix = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDate();

  const suffix = ["th", "st", "nd", "rd"];
  const v = day % 100;
  return day + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
};
