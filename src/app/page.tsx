"use client";
import { useState, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import ProfileIcon from "@/components/ProfileIcon/ProfileIcon";
import WelcomeBack from "@/components/WelcomeBack/WelcomeBack";
import Chart from "@/components/Chart/Chart";
import Calendar from "@/components/Calendar/Calendar";

interface ChartDataPoint {
  day: string;
  value: number;
  fullDay: string;
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

  const handleDataTypeChange = (type: "income" | "expense") => {
    setActiveDataType(type);
  };

  const handleWeekChange = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
  };

  const currentWeekInfo = useMemo(() => {
    const currentWeekData = allWeeksData.find(
      (week) => week.week === selectedWeek
    );
    return currentWeekData
      ? {
          week: currentWeekData.week,
          startDate: currentWeekData.startDate,
          endDate: currentWeekData.endDate,
          incomeTotal: currentWeekData.income.total,
          expenseTotal: currentWeekData.expense.total,
        }
      : null;
  }, [allWeeksData, selectedWeek]);

  if (loading || !currentWeekInfo) {
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
          incomeTotal={currentWeekInfo.incomeTotal}
          expenseTotal={currentWeekInfo.expenseTotal}
        />
        <div className={styles.weekInfo}>
          <span>
            Week {currentWeekInfo.week} •{" "}
            {new Date(currentWeekInfo.startDate).toLocaleDateString()} -{" "}
            {new Date(currentWeekInfo.endDate).toLocaleDateString()}
          </span>
        </div>
        <Chart
          dataType={activeDataType}
          selectedWeek={selectedWeek}
          allWeeksData={allWeeksData}
        />
        <Calendar onWeekChange={handleWeekChange} />
      </div>
    </div>
  );
}
