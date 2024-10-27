// app/components/calendar/CalendarGrid.tsx
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import CalendarCell from "./CalendarCell";

interface CalendarGridProps {
  currentDate: Date;
  slideDirection: string;
  onDateClick: (date: Date) => void;
}

export default function CalendarGrid({
  currentDate,
  slideDirection,
  onDateClick,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div
      className={`w-full max-w-6xl transition-transform duration-300 ease-in-out ${
        slideDirection === "right"
          ? "translate-x-[-100%] opacity-0"
          : slideDirection === "left"
          ? "translate-x-[100%] opacity-0"
          : "translate-x-0 opacity-100"
      }`}
    >
      <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-center font-normal text-red-500">日曜日</th>
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

                  return (
                    <CalendarCell
                      key={dayIndex}
                      date={date}
                      dayIndex={dayIndex}
                      currentDate={currentDate}
                      onClick={() => onDateClick(date)}
                    />
                  );
                })}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
