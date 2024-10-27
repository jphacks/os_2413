// app/history/pegp.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { ja } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

// 仮の日報データ（実際にはAPIから取得など）
const mockReports = [
  "2024-10-01",
  "2024-10-02",
  "2024-10-04",
  "2024-10-05",
  "2024-10-06",
  "2024-10-07",
  "2024-10-08",
  "2024-10-11",
  "2024-10-12",
];

// 祝日データ（実際にはAPIから取得など）
const holidays = {
  "2024-01-01": "元日",
  "2024-01-08": "成人の日",
};

export default function History() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | "">(
    ""
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 前月へ
  const prevMonth = () => {
    setSlideDirection("right");
    setTimeout(() => {
      setCurrentDate(subMonths(currentDate, 1));
      setSlideDirection("");
    }, 300);
  };

  // 次月へ
  const nextMonth = () => {
    setSlideDirection("left");
    setTimeout(() => {
      setCurrentDate(addMonths(currentDate, 1));
      setSlideDirection("");
    }, 300);
  };

  // 日報画面への遷移
  const handleDateClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    router.push(`/daily-report/${formattedDate}`);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
      {/* ヘッダー部分 */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-normal">
          {format(currentDate, "M月 yyyy年", { locale: ja })}
        </h1>

        <div className="flex gap-4">
          {/* 年切り替えボタン */}
          <div className="relative">
            <button
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="px-4 py-2 border rounded-lg flex items-center gap-2 bg-white"
            >
              {format(currentDate, "yyyy年")}
              <ChevronDown size={20} />
            </button>
          </div>

          {/* 月表示切り替え */}
          <div className="flex items-center gap-2 border rounded-lg bg-white">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`w-full max-w-6xl transition-transform duration-300 ease-in-out ${
          slideDirection === "right"
            ? "translate-x-[-100%] opacity-0"
            : slideDirection === "left"
            ? "translate-x-[100%] opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        {/* カレンダーグリッド */}
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-center font-normal text-red-500">
                日曜日
              </th>
              <th className="p-4 text-center font-normal">月曜日</th>
              <th className="p-4 text-center font-normal">火曜日</th>
              <th className="p-4 text-center font-normal">水曜日</th>
              <th className="p-4 text-center font-normal">木曜日</th>
              <th className="p-4 text-center font-normal">金曜日</th>
              <th className="p-4 text-center font-normal text-blue-500">
                土曜日
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }).map(
              (_, weekIndex) => (
                <tr key={weekIndex} className="border-b">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dayNumber = weekIndex * 7 + dayIndex;
                    const date = days[dayNumber];

                    if (!date)
                      return <td key={dayIndex} className="p-4 border" />;

                    const formattedDate = format(date, "yyyy-MM-dd");
                    const isToday = isSameDay(date, new Date());
                    const hasReport = mockReports.includes(formattedDate);
                    const holiday = holidays[formattedDate];
                    const isCurrentMonth = isSameMonth(date, currentDate);

                    return (
                      <td
                        key={dayIndex}
                        className="p-4 border relative min-h-[120px] align-top hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`
                        ${!isCurrentMonth ? "text-gray-400" : ""}
                        ${dayIndex === 0 ? "text-red-500" : ""}
                        ${dayIndex === 6 ? "text-blue-500" : ""}
                        ${isToday ? "text-blue-600 font-bold" : ""}
                      `}
                        >
                          {format(date, "d")}
                        </div>

                        {holiday && (
                          <div className="text-red-500 text-sm mt-1">
                            {holiday}
                          </div>
                        )}

                        {hasReport && (
                          <div
                            onClick={() => handleDateClick(date)}
                            className="mt-2 flex items-center gap-1 cursor-pointer group"
                          >
                            <CheckCircle
                              className="text-green-500 transition-transform group-hover:scale-110"
                              size={16}
                            />
                            <span className="text-sm bg-pink-100 px-2 py-1 rounded transition-all group-hover:bg-pink-200">
                              日報
                            </span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
