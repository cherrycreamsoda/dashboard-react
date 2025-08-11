import { NextResponse } from "next/server";

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // More scattered and realistic data with bigger variations
  const incomeData = [
    { day: "Sun", value: 156.75, fullDay: "Sunday" }, // Lower weekend income
    { day: "Mon", value: 892.4, fullDay: "Monday" }, // Big Monday spike
    { day: "Tue", value: 234.85, fullDay: "Tuesday" }, // Drop after Monday
    { day: "Wed", value: 678.2, fullDay: "Wednesday" }, // Mid-week recovery
    { day: "Thu", value: 1247.6, fullDay: "Thursday" }, // Highest peak
    { day: "Fri", value: 445.3, fullDay: "Friday" }, // Friday dip
    { day: "Sat", value: 189.95, fullDay: "Saturday" }, // Weekend low
  ];

  const expenseData = [
    { day: "Sun", value: 89.45, fullDay: "Sunday" }, // Low Sunday expenses
    { day: "Mon", value: 456.8, fullDay: "Monday" }, // Monday shopping
    { day: "Tue", value: 123.25, fullDay: "Tuesday" }, // Quiet Tuesday
    { day: "Wed", value: 789.6, fullDay: "Wednesday" }, // Big expense day
    { day: "Thu", value: 234.15, fullDay: "Thursday" }, // Controlled Thursday
    { day: "Fri", value: 567.9, fullDay: "Friday" }, // Friday night out
    { day: "Sat", value: 345.7, fullDay: "Saturday" }, // Weekend activities
  ];

  const incomeTotal = incomeData.reduce((sum, item) => sum + item.value, 0);
  const expenseTotal = expenseData.reduce((sum, item) => sum + item.value, 0);

  return NextResponse.json({
    income: {
      data: incomeData,
      total: Math.round(incomeTotal * 100) / 100,
    },
    expense: {
      data: expenseData,
      total: Math.round(expenseTotal * 100) / 100,
    },
  });
}
