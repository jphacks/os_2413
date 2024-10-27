"use client";

// app/page.tsx
import { useEffect } from "react";
import Calendar from "./components/calendar/Calendar";
import Header from "./components/Header";
import Link from "next/link";

export default function Home() {
  useEffect(() => {
    // 必要な初期設定があればここに記述
  }, []);

  return (
    <div>
      <Header />
      <main className="flex flex-col items-center p-8 space-y-6">
        <Link
          href="/daily-report"
          className="p-6 border rounded-lg flex flex-col items-center space-y-2"
        >
          <img src="" alt="日報作成" className="w-12 h-12" />
          <span>日報作成</span>
        </Link>
        <Calendar />
      </main>
    </div>
  );
}
