// app/components/calendar/CalendarCell.tsx
import { format, isSameDay, isSameMonth } from "date-fns";
import { CheckCircle } from "lucide-react";
import { mockReports, holidays } from "./Calendar";

interface CalendarCellProps {
  date: Date;
  dayIndex: number;
  currentDate: Date;
  onClick: () => void;
}

export default function CalendarCell({
  date,
  dayIndex,
  currentDate,
  onClick,
}: CalendarCellProps) {
  const formattedDate = format(date, "yyyy-MM-dd");
  const isToday = isSameDay(date, new Date());
  const hasReport = mockReports.includes(formattedDate);
  const holiday = holidays[formattedDate];
  const isCurrentMonth = isSameMonth(date, currentDate);

  return (
    <td className="p-4 border relative min-h-[120px] align-top hover:bg-gray-50 transition-colors">
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

      {holiday && <div className="text-red-500 text-sm mt-1">{holiday}</div>}

      {hasReport && (
        <div
          onClick={onClick}
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
}
