"use client";
import { useState, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import ProfileIcon from "@/components/ProfileIcon/ProfileIcon";
import WelcomeBack from "@/components/WelcomeBack/WelcomeBack";
import Chart from "@/components/Chart/Chart";
import Calendar from "@/components/Calendar/Calendar";
import { getAugust2025Data } from "@/lib/mockData";

interface ChartDataPoint {
  day: string;
  value: number;
  fullDay: string;
  date?: string;
}

interface WeekData {
  week: number;
  startDate: string;
  endDate: string;
  income: {
    data: ChartDataPoint[];
    total: number;
  };
  expense: {
    data: ChartDataPoint[];
    total: number;
  };
}

export default function Dashboard() {
  const [activeDataType, setActiveDataType] = useState<"income" | "expense">(
    "income"
  );
  const [allWeeksData, setAllWeeksData] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"yearly" | "monthly" | "weekly">(
    "weekly"
  );
  const [monthlyData, setMonthlyData] = useState<any>(null);

  useEffect(() => {
    if (allWeeksData.length > 0) {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD format

      // Find which week contains today's date
      for (const weekData of allWeeksData) {
        const startDate = new Date(weekData.startDate);
        const endDate = new Date(weekData.endDate);

        if (today >= startDate && today <= endDate) {
          // Found the week containing today
          setSelectedWeek(weekData.week);

          // Calculate which day index within this week
          const daysDiff = Math.floor(
            (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          setSelectedDay(daysDiff);
          return;
        }
      }

      // If today is not in any of the August 2025 weeks, default to middle of first week
      setSelectedWeek(1);
      setSelectedDay(3); // Wednesday
    }
  }, [allWeeksData]);

  const fetchAllWeeksData = async () => {
    setLoading(true);
    try {
      const promises = Array.from({ length: 6 }, (_, i) =>
        fetch(`/api/chart-data?week=${i + 1}`).then((res) => res.json())
      );
      const allData = await Promise.all(promises);
      setAllWeeksData(allData);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWeeksData();
  }, []);

  useEffect(() => {
    if (viewMode === "monthly") {
      const august2025Data = getAugust2025Data();
      const monthlyIncomeData = august2025Data.map((day, index) => ({
        day: day.dayOfMonth.toString(),
        value: day.income,
        fullDay: day.fullDayName,
        date: day.date,
      }));
      const monthlyExpenseData = august2025Data.map((day, index) => ({
        day: day.dayOfMonth.toString(),
        value: day.expense,
        fullDay: day.fullDayName,
        date: day.date,
      }));

      setMonthlyData({
        income: { data: monthlyIncomeData },
        expense: { data: monthlyExpenseData },
      });
    }
  }, [viewMode]);

  const handleDataTypeChange = (type: "income" | "expense") => {
    setActiveDataType(type);
  };

  const handleViewModeChange = (mode: "yearly" | "monthly" | "weekly") => {
    setViewMode(mode);
    if (mode === "monthly") {
      // For monthly view, set to current date if available
      const today = new Date();
      const august2025Data = getAugust2025Data();
      const todayStr = today.toISOString().split("T")[0];
      const dayIndex = august2025Data.findIndex(
        (dayData) => dayData.date === todayStr
      );
      setSelectedDay(dayIndex !== -1 ? dayIndex : 15); // Default to middle of month
    } else {
      // For weekly view, keep current selection or default
      if (selectedDay === null) {
        setSelectedDay(3); // Default to Wednesday
      }
    }
  };

  const handleWeekChange = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
  };

  const handleDayChange = (dayIndex: number) => {
    setSelectedDay(dayIndex);
  };

  // Calculate totals based on current view mode
  const currentTotals = useMemo(() => {
    if (viewMode === "monthly") {
      const august2025Data = getAugust2025Data();
      const incomeTotal = august2025Data.reduce(
        (sum, day) => sum + day.income,
        0
      );
      const expenseTotal = august2025Data.reduce(
        (sum, day) => sum + day.expense,
        0
      );
      return { incomeTotal, expenseTotal };
    } else {
      // Weekly view
      const currentWeekData = allWeeksData.find(
        (week) => week.week === selectedWeek
      );
      return currentWeekData
        ? {
            incomeTotal: currentWeekData.income.total,
            expenseTotal: currentWeekData.expense.total,
          }
        : { incomeTotal: 0, expenseTotal: 0 };
    }
  }, [allWeeksData, selectedWeek, viewMode]);

  // Update info display based on view mode
  const currentViewInfo = useMemo(() => {
    if (viewMode === "monthly") {
      return {
        title: "August 2025",
        subtitle: "Monthly View • 31 Days",
      };
    } else {
      const currentWeekData = allWeeksData.find(
        (week) => week.week === selectedWeek
      );
      return currentWeekData
        ? {
            title: `Week ${currentWeekData.week}`,
            subtitle: `${new Date(
              currentWeekData.startDate
            ).toLocaleDateString()} - ${new Date(
              currentWeekData.endDate
            ).toLocaleDateString()}`,
          }
        : { title: "Loading...", subtitle: "" };
    }
  }, [allWeeksData, selectedWeek, viewMode]);

  if (
    loading ||
    (!currentTotals.incomeTotal &&
      !currentTotals.expenseTotal &&
      allWeeksData.length === 0)
  ) {
    return (
      <div className={styles.container}>
        <div className={styles.mobileWrapper}>
          <ProfileIcon />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              color: "#f3f3f3",
              fontSize: "16px",
            }}
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.mobileWrapper}>
        <ProfileIcon />
        <WelcomeBack
          onDataTypeChange={handleDataTypeChange}
          activeDataType={activeDataType}
          incomeTotal={currentTotals.incomeTotal}
          expenseTotal={currentTotals.expenseTotal}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
        <div className={styles.weekInfo}>
          <span>
            {currentViewInfo.title} • {currentViewInfo.subtitle}
          </span>
        </div>
        <Chart
          dataType={activeDataType}
          selectedWeek={selectedWeek}
          allWeeksData={allWeeksData}
          selectedDay={selectedDay}
          onDayChange={handleDayChange}
          viewMode={viewMode}
          monthlyData={monthlyData}
        />
        <Calendar
          onWeekChange={handleWeekChange}
          onDayChange={handleDayChange}
          selectedDay={selectedDay}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}
