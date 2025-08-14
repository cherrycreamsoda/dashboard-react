// Mock data generator for current month - 6 weeks of data
// Restructured to day-based for both weekly and monthly views

export interface DayData {
  date: string; // YYYY-MM-DD format
  dayOfWeek: string; // Sun, Mon, Tue, etc.
  fullDayName: string; // Sunday, Monday, etc.
  dayOfMonth: number; // 1-31
  income: number;
  expense: number;
  week: number; // Which week this day belongs to (1-6)
}

export interface WeeklyChartData {
  week: number;
  startDate: string;
  endDate: string;
  income: {
    data: Array<{
      day: string;
      value: number;
      fullDay: string;
      date: string;
    }>;
    total: number;
  };
  expense: {
    data: Array<{
      day: string;
      value: number;
      fullDay: string;
    }>;
    total: number;
  };
}

const generateDayData = (date: Date, week: number): DayData => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Use date as seed for consistent random values
  const seed = date.getTime();
  const random1 = Math.sin(seed) * 10000;
  const random2 = Math.sin(seed * 2) * 10000;

  // Generate realistic income/expense patterns
  const baseIncome = isWeekend ? 300 + (random1 % 300) : 1000 + (random1 % 500);
  const baseExpense = isWeekend ? 250 + (random2 % 250) : 500 + (random2 % 300);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return {
    date: date.toISOString().split("T")[0],
    dayOfWeek: shortDayNames[dayOfWeek],
    fullDayName: dayNames[dayOfWeek],
    dayOfMonth: date.getDate(),
    income: Math.round(Math.abs(baseIncome)),
    expense: Math.round(Math.abs(baseExpense)),
    week: week,
  };
};

const generateCurrentMonthData = (): DayData[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Find the first day of the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

  // Find the first Sunday before or on the first day of the month
  const firstSunday = new Date(firstDayOfMonth);
  const dayOfWeek = firstDayOfMonth.getDay();
  if (dayOfWeek !== 0) {
    firstSunday.setDate(firstDayOfMonth.getDate() - dayOfWeek);
  }

  const data: DayData[] = [];
  const currentDate = new Date(firstSunday);

  // Generate 6 weeks (42 days) of data
  for (let week = 1; week <= 6; week++) {
    for (let day = 0; day < 7; day++) {
      data.push(generateDayData(new Date(currentDate), week));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return data;
};

let cachedMonthData: DayData[] | null = null;
let cachedMonth: number | null = null;

const getCurrentMonthData = (): DayData[] => {
  const currentMonth = new Date().getMonth();

  // Regenerate data if month has changed or no cached data exists
  if (!cachedMonthData || cachedMonth !== currentMonth) {
    cachedMonthData = generateCurrentMonthData();
    cachedMonth = currentMonth;
  }

  return cachedMonthData;
};

export const getCurrentMonthDaysOnly = (): DayData[] => {
  const allData = getCurrentMonthData();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return allData.filter((day) => {
    const date = new Date(day.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });
};

export const getWeeklyDataFromDaily = (
  weekNumber: number
): WeeklyChartData | null => {
  const allData = getCurrentMonthData();
  const weekDays = allData.filter((day) => day.week === weekNumber);

  if (weekDays.length === 0) return null;

  const startDate = weekDays[0].date;
  const endDate = weekDays[weekDays.length - 1].date;

  return {
    week: weekNumber,
    startDate,
    endDate,
    income: {
      data: weekDays.map((day) => ({
        day: day.dayOfWeek,
        value: day.income,
        fullDay: day.fullDayName,
        date: day.date,
      })),
      total:
        Math.round(weekDays.reduce((sum, day) => sum + day.income, 0) * 100) /
        100,
    },
    expense: {
      data: weekDays.map((day) => ({
        day: day.dayOfWeek,
        value: day.expense,
        fullDay: day.fullDayName,
        date: day.date,
      })),
      total:
        Math.round(weekDays.reduce((sum, day) => sum + day.expense, 0) * 100) /
        100,
    },
  };
};

export const getAllWeeklyData = (): WeeklyChartData[] => {
  const weeks: WeeklyChartData[] = [];
  for (let i = 1; i <= 6; i++) {
    const weekData = getWeeklyDataFromDaily(i);
    if (weekData) weeks.push(weekData);
  }
  return weeks;
};

export const getWeekFromDate = (date: Date): number => {
  const allData = getCurrentMonthData();
  if (allData.length === 0) return 1;

  const startDate = new Date(allData[0].date);
  const diffTime = date.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  // Clamp to valid week range (1-6)
  return Math.max(1, Math.min(6, weekNumber));
};

// Helper function to get week data by week number
export const getWeekData = (weekNumber: number): WeeklyChartData | null => {
  return getWeeklyDataFromDaily(weekNumber);
};

export const currentMonthData: WeeklyChartData[] = getAllWeeklyData();

export const getAugust2025Data = getCurrentMonthDaysOnly;
