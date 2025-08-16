"use client";
import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { getWeekFromDate } from "@/lib/mockData";
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
  selectedDate?: Date | null;
  onDateChange?: (date: Date) => void;
}

const Calendar = memo(function Calendar({
  onWeekChange,
  onDayChange,
  selectedDay,
  viewMode = "weekly",
  selectedDate: propSelectedDate,
  onDateChange,
}: CalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const events = useMemo<CalendarEvent[]>(
    () => [
      { date: "2025-08-05", title: "Meeting" },
      { date: "2025-08-15", title: "Event" },
    ],
    []
  );

  useEffect(() => {
    if (propSelectedDate) {
      setSelectedDate(propSelectedDate);
      setCurrentViewDate(
        new Date(propSelectedDate.getFullYear(), propSelectedDate.getMonth(), 1)
      );
    } else {
      const today = new Date();
      setSelectedDate(today);
    }
  }, [propSelectedDate]);

  const { todayDay, todayMonth, todayYear } = useMemo(() => {
    const actualToday = new Date();
    return {
      todayDay: actualToday.getDate(),
      todayMonth: actualToday.getMonth(),
      todayYear: actualToday.getFullYear(),
    };
  }, []);

  const monthNames = useMemo(
    () => [
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
    ],
    []
  );

  const getDaysInMonth = useCallback((month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  }, []);

  const hasEvent = useCallback(
    (day: number, month: number, year: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      return events.some((event) => event.date === dateStr);
    },
    [events]
  );

  const isToday = useCallback(
    (day: number, month: number, year: number) => {
      return day === todayDay && month === todayMonth && year === todayYear;
    },
    [todayDay, todayMonth, todayYear]
  );

  const isSelected = useCallback(
    (day: number, month: number, year: number) => {
      if (!selectedDate) return false;
      return (
        day === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear()
      );
    },
    [selectedDate]
  );

  const handleDateClick = useCallback(
    (day: number, month: number, year: number) => {
      const clickedDate = new Date(year, month, day);
      console.log(
        "DEBUG: Calendar date clicked - day:",
        day,
        "month:",
        month,
        "year:",
        year
      );
      console.log("DEBUG: Created clickedDate:", clickedDate);
      console.log(
        "DEBUG: Date details - getDay():",
        clickedDate.getDay(),
        "getDate():",
        clickedDate.getDate()
      );
      console.log("DEBUG: Is Saturday?", clickedDate.getDay() === 6);
      console.log(
        "DEBUG: Date string:",
        clickedDate.toISOString().split("T")[0]
      );

      setSelectedDate(clickedDate);

      if (onDateChange) {
        console.log("DEBUG: Calling onDateChange with:", clickedDate);
        onDateChange(clickedDate);
      } else {
        console.log("DEBUG: No onDateChange callback, using fallback logic");
        if (viewMode === "weekly") {
          const weekNumber = getWeekFromDate(clickedDate);
          console.log("DEBUG: Calculated week number:", weekNumber);
          if (onWeekChange) {
            onWeekChange(weekNumber);
          }

          if (onDayChange) {
            // Don't use getDay() directly as it returns 0-6 for Sunday-Saturday
            // Instead, we need to find the position of this date within the week's data
            console.log(
              "DEBUG: Weekly fallback - need to calculate proper day index"
            );

            // For fallback, we'll use a simple day-of-week calculation
            // but this should ideally be handled by the onDateChange callback
            const dayOfWeek = clickedDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
            console.log(
              "DEBUG: Weekly fallback - dayOfWeek:",
              dayOfWeek,
              "calling onDayChange"
            );
            onDayChange(dayOfWeek);
          }
        } else if (viewMode === "monthly") {
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          if (month === currentMonth && year === currentYear) {
            const chartIndex = day - 1;
            console.log("DEBUG: Monthly fallback - chartIndex:", chartIndex);
            if (chartIndex >= 0 && chartIndex < 31 && onDayChange) {
              onDayChange(chartIndex);
            }
          }
        }
      }
    },
    [viewMode, onWeekChange, onDayChange, onDateChange]
  );

  const handleMonthNavigation = useCallback((direction: "prev" | "next") => {
    setCurrentViewDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  const renderMonth = useCallback(
    (month: number, year: number, isCurrentMonth = false) => {
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("DEBUG: Previous month day clicked:", day);
              handleDateClick(day, prevMonth, prevYear);
            }}
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

        const isSaturday = new Date(year, month, day).getDay() === 6;

        days.push(
          <div
            key={day}
            className={dayClasses.join(" ")}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(
                "DEBUG: Current month day clicked:",
                day,
                "month:",
                month,
                "year:",
                year
              );
              console.log("DEBUG: Is Saturday?", isSaturday);
              console.log(
                "DEBUG: Day of week will be:",
                new Date(year, month, day).getDay()
              );
              handleDateClick(day, month, year);
            }}
            style={{ cursor: "pointer", userSelect: "none" }}
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("DEBUG: Next month day clicked:", day);
              handleDateClick(day, nextMonth, nextYear);
            }}
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
    },
    [
      getDaysInMonth,
      getFirstDayOfMonth,
      isToday,
      isSelected,
      hasEvent,
      handleDateClick,
      monthNames,
      isExpanded,
      handleMonthNavigation,
    ]
  );

  const renderExpandedCalendar = useCallback(() => {
    const months = [];
    const baseMonth = todayMonth;
    const baseYear = todayYear;
    const startMonth = baseMonth - 6;
    const endMonth = baseMonth + 12;

    for (let i = startMonth; i <= endMonth; i++) {
      const month = ((i % 12) + 12) % 12;
      const year = baseYear + Math.floor(i / 12);
      months.push(renderMonth(month, year, i === baseMonth));
    }

    return months;
  }, [todayMonth, todayYear, renderMonth]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      console.log("Load more months");
    }
  }, []);

  useEffect(() => {
    if (!isExpanded || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isExpanded, handleScroll]);

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
});

export default Calendar;
