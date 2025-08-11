"use client";
import { useState, useEffect } from "react";
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

interface ApiResponse {
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
  const [chartData, setChartData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/chart-data");
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDataTypeChange = (type: "income" | "expense") => {
    setActiveDataType(type);
  };

  if (loading || !chartData) {
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
          incomeTotal={chartData.income.total}
          expenseTotal={chartData.expense.total}
        />
        <Chart
          dataType={activeDataType}
          incomeData={chartData.income.data}
          expenseData={chartData.expense.data}
        />
        <Calendar />
      </div>
    </div>
  );
}
