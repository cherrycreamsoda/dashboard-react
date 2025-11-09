"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import styles from "./Chart.module.css";
import { getCurrentMonthDaysOnly } from "@lib/mockData";
import TimeframeButtons from "./TimeframeButtons";

interface ChartDataPoint {
  day: string;
  value: number;
  fullDay: string;
  date?: string;
}

interface ChartProps {
  dataType: "income" | "expense";
  selectedWeek: number;
  allWeeksData: WeekData[];
  selectedDay?: number | null;
  onDayChange?: (dayIndex: number) => void;
  onChartDateChange?: (date: Date) => void;
  viewMode: "yearly" | "monthly" | "weekly";
  monthlyData?: any;
  onViewModeChange: (mode: "yearly" | "monthly" | "weekly") => void;
  currentViewInfo?: {
    title: string;
    subtitle: string;
  };
  isTransitioning?: boolean;
  selectedDate?: Date | null;
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

interface AnimatedDataPoint {
  day: string;
  startValue: number;
  currentValue: number;
  targetValue: number;
  fullDay: string;
  date?: string;
}

const Chart = memo(function Chart({
  dataType,
  selectedWeek,
  allWeeksData,
  selectedDay,
  onDayChange,
  onChartDateChange,
  viewMode,
  onViewModeChange,
  monthlyData,
  currentViewInfo,
  isTransitioning = false,
  selectedDate,
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(
    selectedDay ?? 4
  );
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [animatedData, setAnimatedData] = useState<AnimatedDataPoint[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousDataRef = useRef<ChartDataPoint[]>([]);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const allIncomeData = useMemo(() => {
    return allWeeksData.flatMap((week) => week.income.data);
  }, [allWeeksData]);

  const allExpenseData = useMemo(() => {
    return allWeeksData.flatMap((week) => week.expense.data);
  }, [allWeeksData]);

  const { minValue, valueRange } = useMemo(() => {
    let allValues: number[] = [];

    if (viewMode === "monthly") {
      // Use monthly data for scaling when in monthly mode
      if (monthlyData) {
        const monthlyIncomeValues = monthlyData.income.data.map(
          (d: ChartDataPoint) => d.value
        );
        const monthlyExpenseValues = monthlyData.expense.data.map(
          (d: ChartDataPoint) => d.value
        );
        allValues = [...monthlyIncomeValues, ...monthlyExpenseValues];
      } else {
        // Fallback to generated monthly data
        const currentMonthData = getCurrentMonthDaysOnly();
        allValues = currentMonthData.flatMap((day) => [
          day.income,
          day.expense,
        ]);
      }
    } else {
      // Use weekly data for scaling when in weekly mode
      allValues = [...allIncomeData, ...allExpenseData].map((d) => d.value);
    }

    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const valueRange = maxValue - minValue || 1;
    return { minValue, valueRange };
  }, [allIncomeData, allExpenseData, viewMode, monthlyData]);

  const getCurrentData = useMemo(() => {
    console.log(
      "[v0] Chart getCurrentData - viewMode:",
      viewMode,
      "selectedWeek:",
      selectedWeek,
      "selectedDay:",
      selectedDay
    );

    if (viewMode === "monthly") {
      if (monthlyData) {
        const data =
          dataType === "income"
            ? monthlyData.income.data
            : monthlyData.expense.data;
        console.log("[v0] Chart using monthlyData, length:", data.length);
        return data;
      }
      const currentMonthData = getCurrentMonthDaysOnly();
      const data = currentMonthData.map((day, index) => ({
        day: day.dayOfMonth.toString(),
        value: dataType === "income" ? day.income : day.expense,
        fullDay: `${day.fullDayName}, ${new Date(day.date).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        )}`,
        date: day.date,
      }));
      console.log(
        "[v0] Chart using generated monthly data, length:",
        data.length
      );
      return data;
    } else {
      const currentWeekData = allWeeksData.find(
        (week) => week.week === selectedWeek
      );
      const data = currentWeekData
        ? dataType === "income"
          ? currentWeekData.income.data
          : currentWeekData.expense.data
        : [];
      console.log(
        "[v0] Chart using weekly data for week:",
        selectedWeek,
        "length:",
        data.length
      );
      return data;
    }
  }, [viewMode, monthlyData, dataType, allWeeksData, selectedWeek]);

  const ANIMATION_DURATION = 1200;

  const easeInOutCubic = useCallback((t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  useEffect(() => {
    if (getCurrentData.length === 0) return;

    if (animatedData.length === 0) {
      const initialData = getCurrentData.map((item) => ({
        day: item.day,
        startValue: item.value,
        currentValue: item.value,
        targetValue: item.value,
        fullDay: item.fullDay,
        date: item.date,
      }));
      setAnimatedData(initialData);
      previousDataRef.current = [...getCurrentData];
      return;
    }

    const hasDataChanged =
      JSON.stringify(previousDataRef.current) !==
      JSON.stringify(getCurrentData);

    if (hasDataChanged) {
      const newAnimatedData = getCurrentData.map((item, index) => {
        const currentAnimatedValue =
          animatedData[index]?.currentValue ?? item.value;
        return {
          day: item.day,
          startValue: currentAnimatedValue,
          currentValue: currentAnimatedValue,
          targetValue: item.value,
          fullDay: item.fullDay,
          date: item.date,
        };
      });

      setAnimatedData(newAnimatedData);
      setIsAnimating(true);
      startTimeRef.current = performance.now();
      previousDataRef.current = [...getCurrentData];

      const animateValues = (currentTime: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = currentTime;
        }

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
        const easedProgress = easeInOutCubic(progress);

        setAnimatedData((prev) => {
          const updated = prev.map((item) => {
            const diff = item.targetValue - item.startValue;
            const newValue = item.startValue + diff * easedProgress;

            return {
              ...item,
              currentValue: newValue,
            };
          });

          return updated;
        });

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateValues);
        } else {
          setIsAnimating(false);
          setAnimatedData((prev) =>
            prev.map((item) => ({
              ...item,
              currentValue: item.targetValue,
              startValue: item.targetValue,
            }))
          );
        }
      };

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animateValues);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [getCurrentData, animatedData.length, viewMode, easeInOutCubic]);

  useEffect(() => {
    console.log(
      "[v0] Chart selectedDay effect - selectedDay:",
      selectedDay,
      "viewMode:",
      viewMode
    );
    if (selectedDay !== null && selectedDay !== undefined) {
      console.log("[v0] Chart setting selectedPoint to:", selectedDay);
      setSelectedPoint(selectedDay);
    }
  }, [selectedDay]);

  useEffect(() => {
    if (isTransitioning) {
      setTransitionProgress(0);
      const startTime = performance.now();
      const duration = 300;

      const animateTransition = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setTransitionProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(animateTransition);
        }
      };

      requestAnimationFrame(animateTransition);
    } else {
      setTransitionProgress(0);
    }
  }, [isTransitioning]);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || animatedData.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const paddingTop = 40;
    const paddingBottom = 60;
    const paddingLeft = 20;
    const paddingRight = 20;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    ctx.clearRect(0, 0, width, height);

    const transitionOffset = isTransitioning ? transitionProgress * 50 : 0;
    const transitionOpacity = isTransitioning
      ? 1 - transitionProgress * 0.7
      : 1;

    ctx.globalAlpha = transitionOpacity;
    ctx.save();
    ctx.translate(0, transitionOffset);

    const dataPoints = animatedData.map((data, index) => ({
      x: paddingLeft + (index * chartWidth) / (animatedData.length - 1),
      y:
        paddingTop +
        chartHeight -
        ((data.currentValue - minValue) / valueRange) * chartHeight,
      value: data.currentValue,
      day: data.day,
      fullDay: data.fullDay,
      date: data.date,
    }));

    ctx.strokeStyle = "rgba(243, 243, 243, 0.2)";
    ctx.lineWidth = 1;
    dataPoints.forEach((point) => {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y + 8);
      ctx.lineTo(point.x, height - 30);
      ctx.stroke();
    });

    const gradient = ctx.createLinearGradient(
      0,
      paddingTop,
      0,
      height - paddingBottom
    );

    if (dataType === "income") {
      gradient.addColorStop(0.0, "rgba(162, 250, 255, 0.45)");
      gradient.addColorStop(0.2, "rgba(162, 250, 255, 0.35)");
      gradient.addColorStop(0.4, "rgba(162, 250, 255, 0.22)");
      gradient.addColorStop(0.6, "rgba(162, 250, 255, 0.12)");
      gradient.addColorStop(0.8, "rgba(162, 250, 255, 0.06)");
      gradient.addColorStop(0.9, "rgba(162, 250, 255, 0.03)");
      gradient.addColorStop(1.0, "rgba(23, 23, 23, 0.01)");
    } else {
      gradient.addColorStop(0.0, "rgba(255, 162, 212, 0.45)");
      gradient.addColorStop(0.2, "rgba(255, 162, 212, 0.35)");
      gradient.addColorStop(0.4, "rgba(255, 162, 212, 0.22)");
      gradient.addColorStop(0.6, "rgba(255, 162, 212, 0.12)");
      gradient.addColorStop(0.8, "rgba(255, 162, 212, 0.06)");
      gradient.addColorStop(0.9, "rgba(255, 162, 212, 0.03)");
      gradient.addColorStop(1.0, "rgba(23, 23, 23, 0.01)");
    }

    ctx.beginPath();
    ctx.moveTo(dataPoints[0].x, height - paddingBottom);

    for (let i = 0; i < dataPoints.length; i++) {
      if (i === 0) {
        ctx.lineTo(dataPoints[i].x, dataPoints[i].y);
      } else {
        const prevPoint = dataPoints[i - 1];
        const currentPoint = dataPoints[i];
        const cpx = (prevPoint.x + currentPoint.x) / 2;
        ctx.quadraticCurveTo(
          prevPoint.x,
          prevPoint.y,
          cpx,
          (prevPoint.y + currentPoint.y) / 2
        );

        if (i === dataPoints.length - 1) {
          ctx.quadraticCurveTo(
            cpx,
            (prevPoint.y + currentPoint.y) / 2,
            currentPoint.x,
            currentPoint.y
          );
        }
      }
    }

    ctx.lineTo(dataPoints[dataPoints.length - 1].x, height - paddingBottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(dataPoints[0].x, dataPoints[0].y);

    for (let i = 1; i < dataPoints.length; i++) {
      const prevPoint = dataPoints[i - 1];
      const currentPoint = dataPoints[i];
      const cpx = (prevPoint.x + currentPoint.x) / 2;
      ctx.quadraticCurveTo(
        prevPoint.x,
        prevPoint.y,
        cpx,
        (prevPoint.y + currentPoint.y) / 2
      );

      if (i === dataPoints.length - 1) {
        ctx.quadraticCurveTo(
          cpx,
          (prevPoint.y + currentPoint.y) / 2,
          currentPoint.x,
          currentPoint.y
        );
      }
    }

    ctx.strokeStyle = dataType === "income" ? "#618d8f" : "#8f617a";
    ctx.lineWidth = 3;
    ctx.stroke();

    dataPoints.forEach((point, index) => {
      ctx.beginPath();

      const baseRadius =
        viewMode === "monthly"
          ? selectedPoint === index
            ? 6
            : 3
          : selectedPoint === index
          ? 8
          : 6;
      const pulseRadius = isAnimating
        ? baseRadius + Math.sin(performance.now() * 0.005) * 0.5
        : baseRadius;

      ctx.arc(point.x, point.y, pulseRadius, 0, 2 * Math.PI);

      if (selectedPoint === index) {
        ctx.fillStyle = "#EDEDED";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = dataType === "income" ? "#618d8f" : "#8f617a";
        ctx.fill();
      }
    });

    ctx.fillStyle = "#f3f3f3";
    ctx.font =
      "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";

    if (viewMode === "monthly") {
      if (selectedPoint !== null && animatedData[selectedPoint]) {
        const selectedData = animatedData[selectedPoint];
        const selectedPointData = dataPoints[selectedPoint];
        ctx.globalAlpha = transitionOpacity;
        ctx.fillText(
          selectedData.date
            ? new Date(selectedData.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : selectedData.day,
          selectedPointData.x,
          height - 10
        );
      }
    } else {
      dataPoints.forEach((point, index) => {
        const opacity =
          selectedPoint === index ? transitionOpacity : transitionOpacity * 0.7;
        ctx.globalAlpha = opacity;
        ctx.fillText(animatedData[index].day, point.x, height - 10);
      });
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }, [
    animatedData,
    selectedPoint,
    isAnimating,
    viewMode,
    minValue,
    valueRange,
    dataType,
    isTransitioning,
    transitionProgress,
  ]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  const handleCanvasClick = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      console.log("[v0] Chart canvas clicked at:", x, y, "viewMode:", viewMode);

      const width = rect.width;
      const height = rect.height;
      const paddingTop = 40;
      const paddingBottom = 60;
      const paddingLeft = 20;
      const paddingRight = 20;
      const chartWidth = width - paddingLeft - paddingRight;
      const chartHeight = height - paddingTop - paddingBottom;

      const dataPoints = animatedData.map((data, index) => ({
        x: paddingLeft + (index * chartWidth) / (animatedData.length - 1),
        y:
          paddingTop +
          chartHeight -
          ((data.currentValue - minValue) / valueRange) * chartHeight,
        data: data,
        index: index,
      }));

      console.log(
        "[v0] Chart data points for click detection:",
        dataPoints.length
      );

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      dataPoints.forEach((point, index) => {
        const distance = Math.sqrt(
          Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)
        );
        if (distance < closestDistance && distance < 30) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestDistance < 30) {
        console.log("[v0] Chart point clicked - closestIndex:", closestIndex);
        console.log(
          "[v0] Chart clicked data point:",
          animatedData[closestIndex]
        );

        setSelectedPoint(closestIndex);

        if (onChartDateChange && animatedData[closestIndex]?.date) {
          const clickedDate = new Date(animatedData[closestIndex].date);
          console.log(
            "[v0] Chart calling onChartDateChange with date:",
            clickedDate
          );
          onChartDateChange(clickedDate);
        } else if (onDayChange) {
          console.log(
            "[v0] Chart calling onDayChange with closestIndex:",
            closestIndex
          );
          onDayChange(closestIndex);
        }
      } else {
        console.log(
          "[v0] Chart click too far from any point, closest distance:",
          closestDistance
        );
      }
    },
    [
      animatedData,
      minValue,
      valueRange,
      onDayChange,
      onChartDateChange,
      viewMode,
    ]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("click", handleCanvasClick);
    return () => canvas.removeEventListener("click", handleCanvasClick);
  }, [handleCanvasClick]);

  const tooltipPositionMemo = useMemo(() => {
    if (selectedPoint !== null && animatedData[selectedPoint]) {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const paddingTop = 40;
      const paddingBottom = 60;
      const paddingLeft = 20;
      const paddingRight = 20;
      const chartWidth = width - paddingLeft - paddingRight;
      const chartHeight = height - paddingTop - paddingBottom;

      const x =
        paddingLeft + (selectedPoint * chartWidth) / (animatedData.length - 1);
      const y =
        paddingTop +
        chartHeight -
        ((animatedData[selectedPoint].currentValue - minValue) / valueRange) *
          chartHeight;

      return { x, y };
    }
    return { x: 0, y: 0 };
  }, [selectedPoint, animatedData, minValue, valueRange]);

  useEffect(() => {
    setTooltipPosition(tooltipPositionMemo);
  }, [tooltipPositionMemo]);

  return (
    <div className={styles.chartContainer}>
      <TimeframeButtons
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
      {selectedPoint !== null &&
        animatedData[selectedPoint] &&
        !isTransitioning && (
          <div
            className={styles.tooltip}
            style={{
              left: `${tooltipPosition.x - 30}px`,
              top: `${tooltipPosition.y - 50}px`,
            }}
          >
            ${animatedData[selectedPoint].currentValue.toFixed(2)}
          </div>
        )}
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.weekInfo}>
        <span>
          {currentViewInfo?.title} • {currentViewInfo?.subtitle}
        </span>
      </div>
    </div>
  );
});

export default Chart;
