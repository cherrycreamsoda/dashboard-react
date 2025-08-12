"use client";
import { useState, useRef, useEffect } from "react";
import { getWeekFromDate } from "@/lib/mockData"; // Updated import to use getAugust2025Data
import styles from "./Calendar.module.css";

interface CalendarEvent {
  date: string;
  title: string;
}

interface CalendarProps {
  onWeekChange?: (weekNumber: number) => void;
  onDayChange?: (dayIndex: number) => void;
  selectedDay?: number | null;
  viewMode?: "yearly" | "monthly" | "weekly";
}

export default function Calendar({
  onWeekChange,
  onDayChange,
  selectedDay,
  viewMode = "weekly",
}: CalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [events] = useState<CalendarEvent[]>([
    { date: "2025-08-05", title: "Meeting" },
    { date: "2025-08-15", title: "Event" },
  ]);

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
  }, []);

  const actualToday = new Date();
  const todayDay = actualToday.getDate();
  const todayMonth = actualToday.getMonth();
  const todayYear = actualToday.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const hasEvent = (day: number, month: number, year: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return events.some((event) => event.date === dateStr);
  };

  const isToday = (day: number, month: number, year: number) => {
    return day === todayDay && month === todayMonth && year === todayYear;
  };

  const isSelected = (day: number, month: number, year: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day: number, month: number, year: number) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);

    if (viewMode === "weekly") {
      const weekNumber = getWeekFromDate(clickedDate);
      if (onWeekChange) {
        onWeekChange(weekNumber);
      }

      if (onDayChange) {
        const dayOfWeek = clickedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        onDayChange(dayOfWeek);
      }
    } else if (viewMode === "monthly") {
      // For monthly view, we need to map the calendar day to the correct chart index
      if (month === 7 && year === 2025) {
        // August 2025
        // For August days (1-31), the chart index should be day - 1
        const chartIndex = day - 1; // Convert 1-based day to 0-based index
        if (chartIndex >= 0 && chartIndex < 31 && onDayChange) {
          onDayChange(chartIndex);
        }
      }
    }
  };

  const handleMonthNavigation = (direction: "prev" | "next") => {
    const newDate = new Date(currentViewDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentViewDate(newDate);
  };

  const renderMonth = (month: number, year: number, isCurrentMonth = false) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const daysInPrevMonth = getDaysInMonth(month - 1, year);

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;

      days.push(
        <div
          key={`prev-${day}`}
          className={styles.dayInactive}
          onClick={() => handleDateClick(day, prevMonth, prevYear)}
        >
          {day}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayClasses = [styles.day];

      if (isToday(day, month, year)) {
        dayClasses.push(styles.today);
      }

      if (isSelected(day, month, year)) {
        dayClasses.push(styles.selected);
      }

      days.push(
        <div
          key={day}
          className={dayClasses.join(" ")}
          onClick={() => handleDateClick(day, month, year)}
        >
          {day}
          {hasEvent(day, month, year) && (
            <div className={styles.eventDot}></div>
          )}
        </div>
      );
    }

    // Next month days to fill the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className={styles.dayInactive}
          onClick={() => handleDateClick(day, nextMonth, nextYear)}
        >
          {day}
        </div>
      );
    }

    return (
      <div key={`${year}-${month}`} className={styles.monthContainer}>
        <div className={styles.monthHeader}>
          <h3 className={styles.monthTitle}>
            {monthNames[month]} {year}
          </h3>
          {!isExpanded && (
            <div className={styles.monthNavigation}>
              <button
                className={styles.navButton}
                onClick={() => handleMonthNavigation("prev")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className={styles.navButton}
                onClick={() => handleMonthNavigation("next")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className={styles.weekDays}>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div key={index} className={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>
        <div className={styles.monthGrid}>{days}</div>
      </div>
    );
  };

  const renderExpandedCalendar = () => {
    const months = [];
    const baseMonth = actualToday.getMonth();
    const baseYear = actualToday.getFullYear();
    const startMonth = baseMonth - 6;
    const endMonth = baseMonth + 12;

    for (let i = startMonth; i <= endMonth; i++) {
      const month = ((i % 12) + 12) % 12;
      const year = baseYear + Math.floor(i / 12);
      months.push(renderMonth(month, year, i === baseMonth));
    }

    return months;
  };

  // Infinite scroll effect
  useEffect(() => {
    if (!isExpanded || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      // Load more months when near bottom
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        console.log("Load more months");
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);

  return (
    <div className={styles.calendarContainer}>
      <div
        className={`${styles.calendarContent} ${
          isExpanded ? styles.expanded : ""
        }`}
      >
        {isExpanded ? (
          <div ref={scrollContainerRef} className={styles.infiniteScroll}>
            {renderExpandedCalendar()}
          </div>
        ) : (
          renderMonth(
            currentViewDate.getMonth(),
            currentViewDate.getFullYear(),
            true
          )
        )}
      </div>

      <button
        className={styles.expandButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d={isExpanded ? "M18 12H6" : "M12 6v12m6-6H6"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
