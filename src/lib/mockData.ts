// Mock data for August 2025 - 6 weeks from July 27 to September 6
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
      date: string;
    }>;
    total: number;
  };
}

export const august2025DailyData: DayData[] = [
  // Week 1: July 27 - August 2, 2025
  {
    date: "2025-07-27",
    dayOfWeek: "Sun",
    fullDayName: "Sunday",
    dayOfMonth: 27,
    income: 320,
    expense: 180,
    week: 1,
  },
  {
    date: "2025-07-28",
    dayOfWeek: "Mon",
    fullDayName: "Monday",
    dayOfMonth: 28,
    income: 1250,
    expense: 620,
    week: 1,
  },
  {
    date: "2025-07-29",
    dayOfWeek: "Tue",
    fullDayName: "Tuesday",
    dayOfMonth: 29,
    income: 1180,
    expense: 580,
    week: 1,
  },
  {
    date: "2025-07-30",
    dayOfWeek: "Wed",
    fullDayName: "Wednesday",
    dayOfMonth: 30,
    income: 1320,
    expense: 640,
    week: 1,
  },
  {
    date: "2025-07-31",
    dayOfWeek: "Thu",
    fullDayName: "Thursday",
    dayOfMonth: 31,
    income: 1420,
    expense: 520,
    week: 1,
  },
  {
    date: "2025-08-01",
    dayOfWeek: "Fri",
    fullDayName: "Friday",
    dayOfMonth: 1,
    income: 1380,
    expense: 680,
    week: 1,
  },
  {
    date: "2025-08-02",
    dayOfWeek: "Sat",
    fullDayName: "Saturday",
    dayOfMonth: 2,
    income: 480,
    expense: 420,
    week: 1,
  },

  // Week 2: August 3 - August 9, 2025
  {
    date: "2025-08-03",
    dayOfWeek: "Sun",
    fullDayName: "Sunday",
    dayOfMonth: 3,
    income: 280,
    expense: 320,
    week: 2,
  },
  {
    date: "2025-08-04",
    dayOfWeek: "Mon",
    fullDayName: "Monday",
    dayOfMonth: 4,
    income: 980,
    expense: 720,
    week: 2,
  },
  {
    date: "2025-08-05",
    dayOfWeek: "Tue",
    fullDayName: "Tuesday",
    dayOfMonth: 5,
    income: 1120,
    expense: 680,
    week: 2,
  },
  {
    date: "2025-08-06",
    dayOfWeek: "Wed",
    fullDayName: "Wednesday",
    dayOfMonth: 6,
    income: 1080,
    expense: 740,
    week: 2,
  },
  {
    date: "2025-08-07",
    dayOfWeek: "Thu",
    fullDayName: "Thursday",
    dayOfMonth: 7,
    income: 1240,
    expense: 620,
    week: 2,
  },
  {
    date: "2025-08-08",
    dayOfWeek: "Fri",
    fullDayName: "Friday",
    dayOfMonth: 8,
    income: 1160,
    expense: 780,
    week: 2,
  },
  {
    date: "2025-08-09",
    dayOfWeek: "Sat",
    fullDayName: "Saturday",
    dayOfMonth: 9,
    income: 420,
    expense: 480,
    week: 2,
  },

  // Week 3: August 10 - August 16, 2025
  {
    date: "2025-08-10",
    dayOfWeek: "Sun",
    fullDayName: "Sunday",
    dayOfMonth: 10,
    income: 350,
    expense: 280,
    week: 3,
  },
  {
    date: "2025-08-11",
    dayOfWeek: "Mon",
    fullDayName: "Monday",
    dayOfMonth: 11,
    income: 1320,
    expense: 580,
    week: 3,
  },
  {
    date: "2025-08-12",
    dayOfWeek: "Tue",
    fullDayName: "Tuesday",
    dayOfMonth: 12,
    income: 1280,
    expense: 620,
    week: 3,
  },
  {
    date: "2025-08-13",
    dayOfWeek: "Wed",
    fullDayName: "Wednesday",
    dayOfMonth: 13,
    income: 1350,
    expense: 680,
    week: 3,
  },
  {
    date: "2025-08-14",
    dayOfWeek: "Thu",
    fullDayName: "Thursday",
    dayOfMonth: 14,
    income: 1420,
    expense: 720,
    week: 3,
  },
  {
    date: "2025-08-15",
    dayOfWeek: "Fri",
    fullDayName: "Friday",
    dayOfMonth: 15,
    income: 1480,
    expense: 640,
    week: 3,
  },
  {
    date: "2025-08-16",
    dayOfWeek: "Sat",
    fullDayName: "Saturday",
    dayOfMonth: 16,
    income: 520,
    expense: 380,
    week: 3,
  },

  // Week 4: August 17 - August 23, 2025
  {
    date: "2025-08-17",
    dayOfWeek: "Sun",
    fullDayName: "Sunday",
    dayOfMonth: 17,
    income: 320,
    expense: 240,
    week: 4,
  },
  {
    date: "2025-08-18",
    dayOfWeek: "Mon",
    fullDayName: "Monday",
    dayOfMonth: 18,
    income: 1180,
    expense: 780,
    week: 4,
  },
  {
    date: "2025-08-19",
    dayOfWeek: "Tue",
    fullDayName: "Tuesday",
    dayOfMonth: 19,
    income: 1220,
    expense: 720,
    week: 4,
  },
  {
    date: "2025-08-20",
    dayOfWeek: "Wed",
    fullDayName: "Wednesday",
    dayOfMonth: 20,
    income: 1380,
    expense: 680,
    week: 4,
  },
  {
    date: "2025-08-21",
    dayOfWeek: "Thu",
    fullDayName: "Thursday",
    dayOfMonth: 21,
    income: 1320,
    expense: 740,
    week: 4,
  },
  {
    date: "2025-08-22",
    dayOfWeek: "Fri",
    fullDayName: "Friday",
    dayOfMonth: 22,
    income: 1450,
    expense: 620,
    week: 4,
  },
  {
    date: "2025-08-23",
    dayOfWeek: "Sat",
    fullDayName: "Saturday",
    dayOfMonth: 23,
    income: 480,
    expense: 420,
    week: 4,
  },

  // Week 5: August 24 - August 30, 2025
  {
    date: "2025-08-24",
    dayOfWeek: "Sun",
    fullDayName: "Sunday",
    dayOfMonth: 24,
    income: 380,
    expense: 320,
    week: 5,
  },
  {
    date: "2025-08-25",
    dayOfWeek: "Mon",
    fullDayName: "Monday",
    dayOfMonth: 25,
    income: 1280,
    expense: 680,
    week: 5,
  },
  {
    date: "2025-08-26",
    dayOfWeek: "Tue",
    fullDayName: "Tuesday",
    dayOfMonth: 26,
    income: 1350,
    expense: 720,
    week: 5,
  },
  {
    date: "2025-08-27",
    dayOfWeek: "Wed",
    fullDayName: "Wednesday",
    dayOfMonth: 27,
    income: 1420,
    expense: 640,
    week: 5,
  },
  {
    date: "2025-08-28",
    dayOfWeek: "Thu",
    fullDayName: "Thursday",
    dayOfMonth: 28,
    income: 1480,
    expense: 780,
    week: 5,
  },
  {
    date: "2025-08-29",
    dayOfWeek: "Fri",
    fullDayName: "Friday",
    dayOfMonth: 29,
    income: 1520,
    expense: 680,
    week: 5,
  },
  {
    date: "2025-08-30",
    dayOfWeek: "Sat",
    fullDayName: "Saturday",
    dayOfMonth: 30,
    income: 520,
    expense: 380,
    week: 5,
  },

  // Week 6: August 31 - September 6, 2025
  {
    date: "2025-08-31",
    dayOfWeek: "Sun",
    fullDayName: "Sunday",
    dayOfMonth: 31,
    income: 350,
    expense: 420,
    week: 6,
  },
  {
    date: "2025-09-01",
    dayOfWeek: "Mon",
    fullDayName: "Monday",
    dayOfMonth: 1,
    income: 1120,
    expense: 720,
    week: 6,
  },
  {
    date: "2025-09-02",
    dayOfWeek: "Tue",
    fullDayName: "Tuesday",
    dayOfMonth: 2,
    income: 1280,
    expense: 680,
    week: 6,
  },
  {
    date: "2025-09-03",
    dayOfWeek: "Wed",
    fullDayName: "Wednesday",
    dayOfMonth: 3,
    income: 1180,
    expense: 780,
    week: 6,
  },
  {
    date: "2025-09-04",
    dayOfWeek: "Thu",
    fullDayName: "Thursday",
    dayOfMonth: 4,
    income: 1350,
    expense: 620,
    week: 6,
  },
  {
    date: "2025-09-05",
    dayOfWeek: "Fri",
    fullDayName: "Friday",
    dayOfMonth: 5,
    income: 1420,
    expense: 740,
    week: 6,
  },
  {
    date: "2025-09-06",
    dayOfWeek: "Sat",
    fullDayName: "Saturday",
    dayOfMonth: 6,
    income: 480,
    expense: 520,
    week: 6,
  },
];

export const getAugust2025Data = (): DayData[] => {
  return august2025DailyData.filter((day) => {
    const date = new Date(day.date);
    return date.getMonth() === 7 && date.getFullYear() === 2025; // August = month 7
  });
};

export const getWeeklyDataFromDaily = (
  weekNumber: number
): WeeklyChartData | null => {
  const weekDays = august2025DailyData.filter((day) => day.week === weekNumber);

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

// Helper function to get week number from date
export const getWeekFromDate = (date: Date): number => {
  // August 2025 weeks start from July 27, 2025 (Sunday)
  const startDate = new Date(2025, 6, 27); // July 27, 2025
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

export const august2025Data: WeeklyChartData[] = getAllWeeklyData();
