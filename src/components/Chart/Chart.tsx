"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./Chart.module.css";

interface ChartData {
  day: string;
  value: number;
  fullDay: string;
}

interface ChartProps {
  dataType: "income" | "expense";
  incomeData: ChartData[];
  expenseData: ChartData[];
}

interface AnimatedDataPoint {
  day: string;
  startValue: number;
  currentValue: number;
  targetValue: number;
  fullDay: string;
}

export default function Chart({
  dataType,
  incomeData,
  expenseData,
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const [selectedPoint, setSelectedPoint] = useState<number | null>(4);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [animatedData, setAnimatedData] = useState<AnimatedDataPoint[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentData = dataType === "income" ? incomeData : expenseData;
  const ANIMATION_DURATION = 1200; // 1.2 seconds for smooth animation

  // Easing function - cubic ease-in-out for smooth start and end
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Initialize animated data
  useEffect(() => {
    if (currentData.length > 0 && animatedData.length === 0) {
      setAnimatedData(
        currentData.map((item) => ({
          day: item.day,
          startValue: item.value,
          currentValue: item.value,
          targetValue: item.value,
          fullDay: item.fullDay,
        }))
      );
    }
  }, [currentData, animatedData.length]);

  // Animate data changes with smooth easing
  useEffect(() => {
    if (animatedData.length === 0) return;

    // Set new targets and start values for animation
    const newTargets = currentData.map((item, index) => {
      const existingItem = animatedData[index];
      return {
        day: item.day,
        startValue: existingItem ? existingItem.currentValue : item.value,
        currentValue: existingItem ? existingItem.currentValue : item.value,
        targetValue: item.value,
        fullDay: item.fullDay,
      };
    });

    setAnimatedData(newTargets);
    setIsAnimating(true);
    startTimeRef.current = performance.now();

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
        // Ensure final values are exactly the target values
        setAnimatedData((prev) =>
          prev.map((item) => ({
            ...item,
            currentValue: item.targetValue,
            startValue: item.targetValue,
          }))
        );
      }
    };

    animationRef.current = requestAnimationFrame(animateValues);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentData]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || animatedData.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
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

    // Use a consistent range for smoother animations
    const allValues = [...incomeData, ...expenseData].map((d) => d.value);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const valueRange = maxValue - minValue || 1;

    const dataPoints = animatedData.map((data, index) => ({
      x: paddingLeft + (index * chartWidth) / (animatedData.length - 1),
      y:
        paddingTop +
        chartHeight -
        ((data.currentValue - minValue) / valueRange) * chartHeight,
      value: data.currentValue,
      day: data.day,
      fullDay: data.fullDay,
    }));

    // Draw vertical lines
    ctx.strokeStyle = "rgba(243, 243, 243, 0.2)";
    ctx.lineWidth = 1;
    dataPoints.forEach((point) => {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y + 8);
      ctx.lineTo(point.x, height - 30);
      ctx.stroke();
    });

    // Create gradient
    const gradient = ctx.createLinearGradient(
      0,
      paddingTop,
      0,
      height - paddingBottom
    );
    gradient.addColorStop(0, "rgba(147, 51, 234, 0.9)");
    gradient.addColorStop(0.3, "rgba(147, 51, 234, 0.6)");
    gradient.addColorStop(0.7, "rgba(120, 120, 120, 0.3)");
    gradient.addColorStop(1, "rgba(100, 100, 100, 0.1)");

    // Draw filled area with smooth curves
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

    // Draw line with smooth curves
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

    ctx.strokeStyle = "#9333ea";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw data points with subtle animation scaling
    dataPoints.forEach((point, index) => {
      ctx.beginPath();

      // Add subtle pulse effect during animation
      const baseRadius = selectedPoint === index ? 8 : 6;
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
        setTooltipPosition({ x: point.x, y: point.y });
      } else {
        ctx.fillStyle = "#9333ea";
        ctx.fill();
      }
    });

    // Draw day labels
    ctx.fillStyle = "#f3f3f3";
    ctx.font =
      "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    dataPoints.forEach((point, index) => {
      const opacity = selectedPoint === index ? 1 : 0.7;
      ctx.globalAlpha = opacity;
      ctx.fillText(animatedData[index].day, point.x, height - 10);
    });
    ctx.globalAlpha = 1;
  };

  // Draw chart when animated data changes
  useEffect(() => {
    drawChart();
  }, [animatedData, selectedPoint, isAnimating]);

  // Handle canvas click
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const width = rect.width;
      const height = rect.height;
      const paddingTop = 40;
      const paddingBottom = 60;
      const paddingLeft = 20;
      const paddingRight = 20;
      const chartWidth = width - paddingLeft - paddingRight;
      const chartHeight = height - paddingTop - paddingBottom;

      const allValues = [...incomeData, ...expenseData].map((d) => d.value);
      const maxValue = Math.max(...allValues);
      const minValue = Math.min(...allValues);
      const valueRange = maxValue - minValue || 1;

      const dataPoints = animatedData.map((data, index) => ({
        x: paddingLeft + (index * chartWidth) / (animatedData.length - 1),
        y:
          paddingTop +
          chartHeight -
          ((data.currentValue - minValue) / valueRange) * chartHeight,
      }));

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
        setSelectedPoint(closestIndex);
      }
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [animatedData, incomeData, expenseData]);

  return (
    <div className={styles.chartContainer}>
      {selectedPoint !== null && animatedData[selectedPoint] && (
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
    </div>
  );
}
