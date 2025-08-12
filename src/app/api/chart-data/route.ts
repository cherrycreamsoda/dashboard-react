import { type NextRequest, NextResponse } from "next/server"
import { getWeekData } from "@/lib/mockData"

export async function GET(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Get week parameter from URL search params
  const { searchParams } = new URL(request.url)
  const weekParam = searchParams.get("week")
  const weekNumber = weekParam ? Number.parseInt(weekParam, 10) : 1

  const weekData = getWeekData(weekNumber)

  if (!weekData) {
    return NextResponse.json({ error: "Week not found" }, { status: 404 })
  }

  return NextResponse.json({
    week: weekData.week,
    startDate: weekData.startDate,
    endDate: weekData.endDate,
    income: {
      data: weekData.income.data,
      total: weekData.income.total,
    },
    expense: {
      data: weekData.expense.data,
      total: weekData.expense.total,
    },
  })
}
