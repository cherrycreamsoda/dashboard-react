import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Get week parameter from URL search params
  const { searchParams } = new URL(request.url);
  const weekParam = searchParams.get("week");
  const weekNumber = weekParam ? Number.parseInt(weekParam, 10) : 1;

  try {
    const dataPath = path.join(process.cwd(), "data", "weeks.json");
    const jsonData = fs.readFileSync(dataPath, "utf8");
    const { weeks } = JSON.parse(jsonData);

    const weekData = weeks.find((w: any) => w.week === weekNumber);

    if (!weekData) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const fullDayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const transformData = (values: number[], dates: string[]) => {
      return values.map((value, index) => {
        const date = new Date(dates[index]);
        const dayOfWeek = date.getDay();
        return {
          day: dayNames[dayOfWeek],
          value: value,
          fullDay: `${fullDayNames[dayOfWeek]}, ${date.toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            }
          )}`,
          date: dates[index],
        };
      });
    };

    return NextResponse.json({
      week: weekData.week,
      startDate: weekData.startDate,
      endDate: weekData.endDate,
      dates: weekData.dates,
      income: {
        data: transformData(weekData.income.data, weekData.dates),
        total: weekData.income.total,
      },
      expense: {
        data: transformData(weekData.expense.data, weekData.dates),
        total: weekData.expense.total,
      },
    });
  } catch (error) {
    console.error("Error reading week data:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
