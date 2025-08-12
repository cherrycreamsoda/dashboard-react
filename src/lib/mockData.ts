// Mock data for August 2025 - 6 weeks from July 27 to September 6
// Week structure: Sunday to Saturday

export interface WeeklyChartData {
  week: number
  startDate: string
  endDate: string
  income: {
    data: Array<{
      day: string
      value: number
      fullDay: string
      date: string
    }>
    total: number
  }
  expense: {
    data: Array<{
      day: string
      value: number
      fullDay: string
      date: string
    }>
    total: number
  }
}

// August 2025 weekly data with dramatic fluctuations between weeks
export const august2025Data: WeeklyChartData[] = [
  // Week 1: July 27 - August 2, 2025 (High income week)
  {
    week: 1,
    startDate: "2025-07-27",
    endDate: "2025-08-02",
    income: {
      data: [
        { day: "Sun", value: 280, fullDay: "Sunday", date: "2025-07-27" },
        { day: "Mon", value: 1450, fullDay: "Monday", date: "2025-07-28" },
        { day: "Tue", value: 920, fullDay: "Tuesday", date: "2025-07-29" },
        { day: "Wed", value: 1240, fullDay: "Wednesday", date: "2025-07-30" },
        { day: "Thu", value: 1650, fullDay: "Thursday", date: "2025-07-31" },
        { day: "Fri", value: 880, fullDay: "Friday", date: "2025-08-01" },
        { day: "Sat", value: 420, fullDay: "Saturday", date: "2025-08-02" },
      ],
      total: 0,
    },
    expense: {
      data: [
        { day: "Sun", value: 180, fullDay: "Sunday", date: "2025-07-27" },
        { day: "Mon", value: 680, fullDay: "Monday", date: "2025-07-28" },
        { day: "Tue", value: 440, fullDay: "Tuesday", date: "2025-07-29" },
        { day: "Wed", value: 820, fullDay: "Wednesday", date: "2025-07-30" },
        { day: "Thu", value: 390, fullDay: "Thursday", date: "2025-07-31" },
        { day: "Fri", value: 780, fullDay: "Friday", date: "2025-08-01" },
        { day: "Sat", value: 580, fullDay: "Saturday", date: "2025-08-02" },
      ],
      total: 0,
    },
  },

  // Week 2: August 3 - August 9, 2025 (Low income, high expenses)
  {
    week: 2,
    startDate: "2025-08-03",
    endDate: "2025-08-09",
    income: {
      data: [
        { day: "Sun", value: 120, fullDay: "Sunday", date: "2025-08-03" },
        { day: "Mon", value: 560, fullDay: "Monday", date: "2025-08-04" },
        { day: "Tue", value: 380, fullDay: "Tuesday", date: "2025-08-05" },
        { day: "Wed", value: 490, fullDay: "Wednesday", date: "2025-08-06" },
        { day: "Thu", value: 720, fullDay: "Thursday", date: "2025-08-07" },
        { day: "Fri", value: 340, fullDay: "Friday", date: "2025-08-08" },
        { day: "Sat", value: 160, fullDay: "Saturday", date: "2025-08-09" },
      ],
      total: 0,
    },
    expense: {
      data: [
        { day: "Sun", value: 240, fullDay: "Sunday", date: "2025-08-03" },
        { day: "Mon", value: 950, fullDay: "Monday", date: "2025-08-04" },
        { day: "Tue", value: 680, fullDay: "Tuesday", date: "2025-08-05" },
        { day: "Wed", value: 1150, fullDay: "Wednesday", date: "2025-08-06" },
        { day: "Thu", value: 520, fullDay: "Thursday", date: "2025-08-07" },
        { day: "Fri", value: 840, fullDay: "Friday", date: "2025-08-08" },
        { day: "Sat", value: 720, fullDay: "Saturday", date: "2025-08-09" },
      ],
      total: 0,
    },
  },

  // Week 3: August 10 - August 16, 2025 (Moderate with spikes)
  {
    week: 3,
    startDate: "2025-08-10",
    endDate: "2025-08-16",
    income: {
      data: [
        { day: "Sun", value: 350, fullDay: "Sunday", date: "2025-08-10" },
        { day: "Mon", value: 1820, fullDay: "Monday", date: "2025-08-11" },
        { day: "Tue", value: 480, fullDay: "Tuesday", date: "2025-08-12" },
        { day: "Wed", value: 1320, fullDay: "Wednesday", date: "2025-08-13" },
        { day: "Thu", value: 980, fullDay: "Thursday", date: "2025-08-14" },
        { day: "Fri", value: 1560, fullDay: "Friday", date: "2025-08-15" },
        { day: "Sat", value: 290, fullDay: "Saturday", date: "2025-08-16" },
      ],
      total: 0,
    },
    expense: {
      data: [
        { day: "Sun", value: 150, fullDay: "Sunday", date: "2025-08-10" },
        { day: "Mon", value: 420, fullDay: "Monday", date: "2025-08-11" },
        { day: "Tue", value: 280, fullDay: "Tuesday", date: "2025-08-12" },
        { day: "Wed", value: 580, fullDay: "Wednesday", date: "2025-08-13" },
        { day: "Thu", value: 680, fullDay: "Thursday", date: "2025-08-14" },
        { day: "Fri", value: 520, fullDay: "Friday", date: "2025-08-15" },
        { day: "Sat", value: 360, fullDay: "Saturday", date: "2025-08-16" },
      ],
      total: 0,
    },
  },

  // Week 4: August 17 - August 23, 2025 (Volatile week)
  {
    week: 4,
    startDate: "2025-08-17",
    endDate: "2025-08-23",
    income: {
      data: [
        { day: "Sun", value: 90, fullDay: "Sunday", date: "2025-08-17" },
        { day: "Mon", value: 2180, fullDay: "Monday", date: "2025-08-18" },
        { day: "Tue", value: 220, fullDay: "Tuesday", date: "2025-08-19" },
        { day: "Wed", value: 1850, fullDay: "Wednesday", date: "2025-08-20" },
        { day: "Thu", value: 320, fullDay: "Thursday", date: "2025-08-21" },
        { day: "Fri", value: 1290, fullDay: "Friday", date: "2025-08-22" },
        { day: "Sat", value: 180, fullDay: "Saturday", date: "2025-08-23" },
      ],
      total: 0,
    },
    expense: {
      data: [
        { day: "Sun", value: 320, fullDay: "Sunday", date: "2025-08-17" },
        { day: "Mon", value: 1240, fullDay: "Monday", date: "2025-08-18" },
        { day: "Tue", value: 180, fullDay: "Tuesday", date: "2025-08-19" },
        { day: "Wed", value: 920, fullDay: "Wednesday", date: "2025-08-20" },
        { day: "Thu", value: 650, fullDay: "Thursday", date: "2025-08-21" },
        { day: "Fri", value: 480, fullDay: "Friday", date: "2025-08-22" },
        { day: "Sat", value: 890, fullDay: "Saturday", date: "2025-08-23" },
      ],
      total: 0,
    },
  },

  // Week 5: August 24 - August 30, 2025 (Steady growth)
  {
    week: 5,
    startDate: "2025-08-24",
    endDate: "2025-08-30",
    income: {
      data: [
        { day: "Sun", value: 450, fullDay: "Sunday", date: "2025-08-24" },
        { day: "Mon", value: 1260, fullDay: "Monday", date: "2025-08-25" },
        { day: "Tue", value: 1480, fullDay: "Tuesday", date: "2025-08-26" },
        { day: "Wed", value: 1620, fullDay: "Wednesday", date: "2025-08-27" },
        { day: "Thu", value: 1840, fullDay: "Thursday", date: "2025-08-28" },
        { day: "Fri", value: 1920, fullDay: "Friday", date: "2025-08-29" },
        { day: "Sat", value: 680, fullDay: "Saturday", date: "2025-08-30" },
      ],
      total: 0,
    },
    expense: {
      data: [
        { day: "Sun", value: 220, fullDay: "Sunday", date: "2025-08-24" },
        { day: "Mon", value: 540, fullDay: "Monday", date: "2025-08-25" },
        { day: "Tue", value: 620, fullDay: "Tuesday", date: "2025-08-26" },
        { day: "Wed", value: 480, fullDay: "Wednesday", date: "2025-08-27" },
        { day: "Thu", value: 720, fullDay: "Thursday", date: "2025-08-28" },
        { day: "Fri", value: 580, fullDay: "Friday", date: "2025-08-29" },
        { day: "Sat", value: 380, fullDay: "Saturday", date: "2025-08-30" },
      ],
      total: 0,
    },
  },

  // Week 6: August 31 - September 6, 2025 (Mixed patterns)
  {
    week: 6,
    startDate: "2025-08-31",
    endDate: "2025-09-06",
    income: {
      data: [
        { day: "Sun", value: 240, fullDay: "Sunday", date: "2025-08-31" },
        { day: "Mon", value: 780, fullDay: "Monday", date: "2025-09-01" },
        { day: "Tue", value: 1680, fullDay: "Tuesday", date: "2025-09-02" },
        { day: "Wed", value: 420, fullDay: "Wednesday", date: "2025-09-03" },
        { day: "Thu", value: 1960, fullDay: "Thursday", date: "2025-09-04" },
        { day: "Fri", value: 580, fullDay: "Friday", date: "2025-09-05" },
        { day: "Sat", value: 1120, fullDay: "Saturday", date: "2025-09-06" },
      ],
      total: 0,
    },
    expense: {
      data: [
        { day: "Sun", value: 460, fullDay: "Sunday", date: "2025-08-31" },
        { day: "Mon", value: 820, fullDay: "Monday", date: "2025-09-01" },
        { day: "Tue", value: 340, fullDay: "Tuesday", date: "2025-09-02" },
        { day: "Wed", value: 1180, fullDay: "Wednesday", date: "2025-09-03" },
        { day: "Thu", value: 280, fullDay: "Thursday", date: "2025-09-04" },
        { day: "Fri", value: 920, fullDay: "Friday", date: "2025-09-05" },
        { day: "Sat", value: 640, fullDay: "Saturday", date: "2025-09-06" },
      ],
      total: 0,
    },
  },
]

// Calculate totals for each week
august2025Data.forEach((week) => {
  week.income.total = Math.round(week.income.data.reduce((sum, item) => sum + item.value, 0) * 100) / 100
  week.expense.total = Math.round(week.expense.data.reduce((sum, item) => sum + item.value, 0) * 100) / 100
})

// Helper function to get week number from date
export const getWeekFromDate = (date: Date): number => {
  // August 2025 weeks start from July 27, 2025 (Sunday)
  const startDate = new Date(2025, 6, 27) // July 27, 2025
  const diffTime = date.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const weekNumber = Math.floor(diffDays / 7) + 1

  // Clamp to valid week range (1-6)
  return Math.max(1, Math.min(6, weekNumber))
}

// Helper function to get week data by week number
export const getWeekData = (weekNumber: number): WeeklyChartData | null => {
  return august2025Data.find((week) => week.week === weekNumber) || null
}
