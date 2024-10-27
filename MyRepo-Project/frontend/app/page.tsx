"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FileText, LogIn, Notebook } from "lucide-react"; // アイコン用
import Calendar from "./components/calendar/Calendar";
import Header from "./components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* アプリタイトルカード */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-teal-100 p-8 flex flex-col items-center justify-center min-h-[200px]">
            <h1 className="text-2xl font-semibold text-gray-800">マイレポ</h1>
          </div>

          {/* 日報作成カード */}
          <Link
            href="/daily-report"
            className="bg-white rounded-lg shadow-sm border-2 border-teal-100 p-8 flex flex-col items-center justify-center min-h-[200px] transition-transform hover:scale-105"
          >
            <div className="mb-3 relative w-16 h-15">
              <Notebook size={48} />
            </div>
            <h2 className="text-xl font-medium te<Notebook size={48} />xt-gray-800">
              日報作成
            </h2>
          </Link>

          {/* ログインカード */}
          <Link
            href="/github-auth"
            className="bg-white rounded-lg shadow-sm border-2 border-teal-100 p-8 flex flex-col items-center justify-center min-h-[200px] transition-transform hover:scale-105"
          >
            <div className="mb-4 text-blue-500">
              <LogIn size={48} />
            </div>
            <h2 className="text-xl font-medium text-gray-800">ログイン</h2>
          </Link>
        </div>

        {/* カレンダー */}
        <div className="mt-8 border-2 ">
          <Calendar />
        </div>
      </main>
    </div>
  );
}
