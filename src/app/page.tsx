"use client";
import { useState, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import ProfileIcon from "@/components/ProfileIcon/ProfileIcon";
import WelcomeBack from "@/components/WelcomeBack/WelcomeBack";
import Chart from "@/components/Chart/Chart";
import Calendar from "@/components/Calendar/Calendar";
import { getCurrentMonthDaysOnly } from "@/lib/mockData";
import IncomeExpenseButtons from "@/components/Chart/IncomeExpenseButtons";
import Toast from "@/components/Toast/Toast";

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
  dates: string[];
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
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"yearly" | "monthly" | "weekly">(
    "weekly"
  );
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (allWeeksData.length > 0) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      for (const weekData of allWeeksData) {
        if (weekData.dates && weekData.dates.includes(todayStr)) {
          setSelectedWeek(weekData.week);
          const dayIndex = weekData.dates.indexOf(todayStr);
          setSelectedDay(dayIndex);
          setSelectedDate(today);
          console.log(
            "Initialized to current date:",
            todayStr,
            "week:",
            weekData.week,
            "dayIndex:",
            dayIndex
          );
          return;
        }
      }

      setSelectedWeek(1);
      setSelectedDay(3);
      const currentWeekData = allWeeksData.find((week) => week.week === 1);
      if (currentWeekData) {
        const startDate = new Date(currentWeekData.startDate);
        const selectedDateInWeek = new Date(startDate);
        selectedDateInWeek.setDate(startDate.getDate() + 3);
        setSelectedDate(selectedDateInWeek);
      }
    }
  }, [allWeeksData]);

  const fetchAllWeeksData = async () => {
    setLoading(true);
    setError(null);

    try {
      const promises = Array.from({ length: 6 }, (_, i) =>
        fetch(`/api/weeks?week=${i + 1}`).then(async (res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          const data = await res.json();
          if (!data || typeof data !== "object") {
            throw new Error("Invalid data format received");
          }
          return data;
        })
      );

      const allData = await Promise.all(promises);

      const validData = allData.filter(
        (weekData) =>
          weekData &&
          weekData.week &&
          weekData.income &&
          weekData.expense &&
          Array.isArray(weekData.income.data) &&
          Array.isArray(weekData.expense.data) &&
          Array.isArray(weekData.dates)
      );

      if (validData.length === 0) {
        throw new Error("No valid data received from API");
      }

      setAllWeeksData(validData);
      setRetryCount(0);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load chart data. Please check your connection.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchAllWeeksData();
  };

  useEffect(() => {
    fetchAllWeeksData();
  }, []);

  useEffect(() => {
    if (viewMode === "monthly") {
      try {
        const currentMonthData = getCurrentMonthDaysOnly();
        const monthlyIncomeData = currentMonthData.map((day, index) => ({
          day: day.dayOfMonth.toString(),
          value: day.income,
          fullDay: day.fullDayName,
          date: day.date,
        }));
        const monthlyExpenseData = currentMonthData.map((day, index) => ({
          day: day.dayOfMonth.toString(),
          value: day.expense,
          fullDay: day.fullDayName,
          date: day.date,
        }));

        setMonthlyData({
          income: { data: monthlyIncomeData },
          expense: { data: monthlyExpenseData },
        });
      } catch (error) {
        console.error("Failed to generate monthly data:", error);
        setError("Failed to load monthly view data");
      }
    }
  }, [viewMode]);

  const handleDataTypeChange = (type: "income" | "expense") => {
    setActiveDataType(type);
  };

  const handleViewModeChange = (mode: "yearly" | "monthly" | "weekly") => {
    setIsTransitioning(true);

    setTimeout(() => {
      setViewMode(mode);

      if (selectedDate) {
        if (mode === "monthly") {
          const dayOfMonth = selectedDate.getDate() - 1;
          setSelectedDay(dayOfMonth);
        } else if (mode === "weekly") {
          const selectedDateStr = selectedDate.toISOString().split("T")[0];
          for (const weekData of allWeeksData) {
            const startDate = new Date(weekData.startDate);
            const endDate = new Date(weekData.endDate);
            if (selectedDate >= startDate && selectedDate <= endDate) {
              setSelectedWeek(weekData.week);
              const daysDiff = Math.floor(
                (selectedDate.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              setSelectedDay(daysDiff);
              break;
            }
          }
        }
      } else {
        if (mode === "monthly") {
          const today = new Date();
          const currentMonthData = getCurrentMonthDaysOnly();
          const todayStr = today.toISOString().split("T")[0];
          const dayIndex = currentMonthData.findIndex(
            (dayData) => dayData.date === todayStr
          );
          setSelectedDay(dayIndex !== -1 ? dayIndex : 15);
          setSelectedDate(today);
        } else {
          if (selectedDay === null) {
            setSelectedDay(3);
            const currentWeekData = allWeeksData.find(
              (week) => week.week === selectedWeek
            );
            if (currentWeekData) {
              const startDate = new Date(currentWeekData.startDate);
              const selectedDateInWeek = new Date(startDate);
              selectedDateInWeek.setDate(startDate.getDate() + 3);
              setSelectedDate(selectedDateInWeek);
            }
          }
        }
      }

      setIsTransitioning(false);
    }, 300);
  };

  const handleDayChange = (dayIndex: number) => {
    console.log("handleDayChange called with dayIndex:", dayIndex);
    console.log("Current viewMode:", viewMode);
    console.log("Current selectedWeek:", selectedWeek);

    setSelectedDay(dayIndex);

    if (viewMode === "monthly") {
      const currentMonthData = getCurrentMonthDaysOnly();
      console.log(
        "Monthly mode - currentMonthData length:",
        currentMonthData.length
      );
      if (dayIndex >= 0 && dayIndex < currentMonthData.length) {
        const selectedDateStr = currentMonthData[dayIndex].date;
        const newDate = new Date(selectedDateStr);
        console.log(
          "Monthly mode - setting date to:",
          newDate,
          "from dateStr:",
          selectedDateStr
        );
        setSelectedDate(newDate);
      }
    } else if (viewMode === "weekly") {
      const currentWeekData = allWeeksData.find(
        (week) => week.week === selectedWeek
      );
      console.log("Weekly mode - currentWeekData:", currentWeekData);

      if (currentWeekData && currentWeekData.dates) {
        console.log("Available dates:", currentWeekData.dates);
        console.log(
          "Looking for dayIndex:",
          dayIndex,
          "in dates array of length:",
          currentWeekData.dates.length
        );

        if (dayIndex >= 0 && dayIndex < currentWeekData.dates.length) {
          const selectedDateStr = currentWeekData.dates[dayIndex];
          const newSelectedDate = new Date(selectedDateStr);
          console.log(
            "Weekly mode - setting date to:",
            newSelectedDate,
            "for dayIndex:",
            dayIndex
          );
          setSelectedDate(newSelectedDate);
        } else {
          console.log(
            "Invalid dayIndex:",
            dayIndex,
            "for dates array length:",
            currentWeekData.dates.length
          );
        }
      }
    }
  };

  const handleChartDateChange = (date: Date) => {
    console.log("handleChartDateChange called with date:", date);
    setSelectedDate(date);

    if (viewMode === "weekly") {
      const dateStr = date.toISOString().split("T")[0];
      console.log("Looking for dateStr:", dateStr, "in weeks data");

      for (const weekData of allWeeksData) {
        if (weekData.dates && weekData.dates.includes(dateStr)) {
          console.log("Found matching week:", weekData.week);
          setSelectedWeek(weekData.week);

          const dayIndex = weekData.dates.indexOf(dateStr);
          console.log(
            "Chart to calendar sync - dayIndex:",
            dayIndex,
            "for date:",
            dateStr
          );
          setSelectedDay(dayIndex);
          break;
        }
      }
    } else if (viewMode === "monthly") {
      const dayOfMonth = date.getDate() - 1;
      console.log("Monthly chart sync - dayOfMonth:", dayOfMonth);
      setSelectedDay(dayOfMonth);
    }
  };

  const handleCalendarDateChange = (date: Date) => {
    console.log("handleCalendarDateChange called with date:", date);
    console.log(
      "Date details - getDay():",
      date.getDay(),
      "getDate():",
      date.getDate()
    );

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    console.log("Corrected dateStr:", dateStr);
    setShowToast(false);

    if (viewMode === "monthly") {
      const currentViewingDate = new Date();
      const currentViewingMonth = currentViewingDate.getMonth();
      const currentViewingYear = currentViewingDate.getFullYear();

      // Check if clicked date is outside the current viewing month
      if (
        date.getMonth() !== currentViewingMonth ||
        date.getFullYear() !== currentViewingYear
      ) {
        console.log("Date outside current viewing month:", dateStr);
        setToastMessage("Data does not exist for given date");
        setShowToast(true);
        return;
      }

      const dayOfMonth = date.getDate() - 1; // Convert to 0-based index for the month
      console.log(
        "Monthly mode - setting selectedDay to dayOfMonth:",
        dayOfMonth
      );
      setSelectedDay(dayOfMonth);
      setSelectedDate(date);
      return;
    }

    console.log("Looking for dateStr:", dateStr, "in weeks data");

    let dateFound = false;
    for (const weekData of allWeeksData) {
      if (weekData.dates && weekData.dates.includes(dateStr)) {
        console.log("Found matching week:", weekData.week);
        setSelectedWeek(weekData.week);
        setSelectedDate(date);

        const dayIndex = weekData.dates.indexOf(dateStr);
        console.log(
          "Calendar to chart sync - dayIndex:",
          dayIndex,
          "for date:",
          dateStr
        );
        setSelectedDay(dayIndex);
        dateFound = true;
        break;
      }
    }

    if (!dateFound) {
      console.log("Date not found in weeks data:", dateStr);
      setToastMessage("Data does not exist for given date");
      setShowToast(true);
    }
  };

  const handleWeekChange = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
    const weekData = allWeeksData.find((week) => week.week === weekNumber);
    if (weekData && selectedDay !== null) {
      const startDate = new Date(weekData.startDate);
      const newSelectedDate = new Date(startDate);
      newSelectedDate.setDate(startDate.getDate() + selectedDay);
      setSelectedDate(newSelectedDate);
    }
  };

  const currentTotals = useMemo(() => {
    try {
      if (viewMode === "monthly") {
        const currentMonthData = getCurrentMonthDaysOnly();
        const incomeTotal = currentMonthData.reduce(
          (sum, day) => sum + day.income,
          0
        );
        const expenseTotal = currentMonthData.reduce(
          (sum, day) => sum + day.expense,
          0
        );
        return { incomeTotal, expenseTotal };
      } else {
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
    } catch (error) {
      console.error("Error calculating totals:", error);
      return { incomeTotal: 0, expenseTotal: 0 };
    }
  }, [allWeeksData, selectedWeek, viewMode]);

  const currentViewInfo = useMemo(() => {
    try {
      if (viewMode === "monthly") {
        const now = new Date();
        const monthName = now.toLocaleDateString("en-US", { month: "long" });
        const year = now.getFullYear();
        const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();

        return {
          title: `${monthName} ${year}`,
          subtitle: `Monthly View • ${daysInMonth} Days`,
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
    } catch (error) {
      console.error("Error generating view info:", error);
      return { title: "Error", subtitle: "Unable to load view information" };
    }
  }, [allWeeksData, selectedWeek, viewMode]);

  const handleToastClose = () => {
    setShowToast(false);
    setToastMessage(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.mobileWrapper}>
          <ProfileIcon />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              color: "#f3f3f3",
              fontSize: "16px",
              gap: "10px",
            }}
          >
            <div>Loading your dashboard...</div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>
              This may take a few moments
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && allWeeksData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.mobileWrapper}>
          <ProfileIcon />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              color: "#f3f3f3",
              fontSize: "16px",
              gap: "15px",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <div style={{ color: "#ff6b6b", fontSize: "18px" }}>⚠️ Error</div>
            <div style={{ fontSize: "14px", lineHeight: "1.4" }}>{error}</div>
            <button
              onClick={handleRetry}
              style={{
                background: "linear-gradient(135deg, #69ff6a, #40ff9f)",
                color: "#000",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Try Again {retryCount > 0 && `(${retryCount + 1})`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Toast
        message={toastMessage || ""}
        isVisible={showToast}
        onClose={handleToastClose}
        duration={5000}
      />

      <div className={styles.mobileWrapper}>
        <ProfileIcon />
        <WelcomeBack />

        {error && allWeeksData.length > 0 && (
          <div
            style={{
              background: "rgba(255, 193, 7, 0.1)",
              border: "1px solid rgba(255, 193, 7, 0.3)",
              borderRadius: "8px",
              padding: "10px",
              margin: "10px 0",
              color: "#ffc107",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            ⚠️ Using offline data - some features may be limited
          </div>
        )}

        <IncomeExpenseButtons
          onDataTypeChange={handleDataTypeChange}
          activeDataType={activeDataType}
          incomeTotal={currentTotals.incomeTotal}
          expenseTotal={currentTotals.expenseTotal}
        />

        <Chart
          dataType={activeDataType}
          selectedWeek={selectedWeek}
          allWeeksData={allWeeksData}
          selectedDay={selectedDay}
          onDayChange={handleDayChange}
          onChartDateChange={handleChartDateChange}
          viewMode={viewMode}
          monthlyData={monthlyData}
          onViewModeChange={handleViewModeChange}
          currentViewInfo={currentViewInfo}
          isTransitioning={isTransitioning}
          selectedDate={selectedDate}
        />
        <Calendar
          onWeekChange={handleWeekChange}
          onDayChange={handleDayChange}
          selectedDay={selectedDay}
          viewMode={viewMode}
          selectedDate={selectedDate}
          onDateChange={handleCalendarDateChange}
        />
      </div>
    </div>
  );
}
