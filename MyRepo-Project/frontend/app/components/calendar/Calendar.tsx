// app/components/calendar/Calendar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

// 仮のデータ（実際にはpropsで渡すか、APIから取得）
export const mockReports = [
  "2024-10-22",
  "2024-10-23",
  "2024-10-24",
  "2024-10-25",
];

export const holidays = {
  "2024-01-01": "元日",
  "2024-01-08": "成人の日",
};

export default function Calendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | "">(
    ""
  );

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        setSlideDirection={setSlideDirection}
      />
      <CalendarGrid
        currentDate={currentDate}
        slideDirection={slideDirection}
        onDateClick={(date) => {
          const formattedDate = format(date, "yyyy-MM-dd");
          router.push(`/daily-report/${formattedDate}`);
        }}
      />
    </div>
  );
}
