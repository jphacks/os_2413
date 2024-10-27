// app/components/calendar/CalendarHeader.tsx
import { format, addMonths, subMonths } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setSlideDirection: (direction: "left" | "right" | "") => void;
}

export default function CalendarHeader({
  currentDate,
  setCurrentDate,
  setSlideDirection,
}: CalendarHeaderProps) {
  const prevMonth = () => {
    setSlideDirection("right");
    setTimeout(() => {
      setCurrentDate(subMonths(currentDate, 1));
      setSlideDirection("");
    }, 300);
  };

  const nextMonth = () => {
    setSlideDirection("left");
    setTimeout(() => {
      setCurrentDate(addMonths(currentDate, 1));
      setSlideDirection("");
    }, 300);
  };

  return (
    <div className="w-full max-w-6xl flex justify-between items-center mb-8">
      <h1 className="text-3xl font-normal">
        {format(currentDate, "M月 yyyy年", { locale: ja })}
      </h1>

      <div className="flex gap-4">
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
  );
}
