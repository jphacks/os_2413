// app/daily-report/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Download,
  Share2,
  Pencil,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "../components/Header";
import { format, addDays, subDays, startOfWeek, isSameDay } from "date-fns";
import { ja } from "date-fns/locale";
import api from "../lib/api/reports";
import { CommitAnalysis } from "../lib/api/reports";
import DailyReportEditor from "../components/DailyReportEditor";
import { reportStorage } from "../lib/storage/reports"; // 追加

import { FileEdit } from "lucide-react"; // 日報作成アイコン用

// 仮のユーザーデータ
const user = {
  name: "日本 円",
  username: "@madoka",
  avatar: "/api/placeholder/48/48",
  createdAt: "2024 / 10 / 25",
  updatedAt: "2024 / 10 / 24",
};

// 日報のセクションタイトル
const formatAnalysisText = (text: string) => {
  const sections = text.split(/[①②③④⑤]/).filter(Boolean);
  const titles = [
    "今日の目標",
    "今日の業務内容",
    "今日の成果",
    "今日の良かった点",
    "今日の反省点",
  ];

  return sections.map((content, index) => ({
    title: titles[index],
    content: content.trim(),
  }));
};

export default function DailyReport() {
  const [isEditing, setIsEditing] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<CommitAnalysis | null>(null);

  // 追加: 日付が変更されたときに日報データを読み込む
  useEffect(() => {
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    const savedReport = reportStorage.getReport(formattedDate);

    if (savedReport) {
      setReportContent(savedReport.content);
      setReportTitle(savedReport.title);
    } else {
      setReportContent("");
      setReportTitle("無題の日報");
    }
  }, [currentDate]);

  // 修正: 日報生成ハンドラー
  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeCommits();
      setAnalysisData(data);
      if (data.analysis) {
        const sections = formatAnalysisText(data.analysis);
        const formattedContent = sections
          .map((section) => `${section.title}\n${section.content}\n`)
          .join("\n");

        // 追加: 日報を保存
        const formattedDate = format(currentDate, "yyyy-MM-dd");
        reportStorage.saveReport(formattedDate, "日報", formattedContent);

        setReportContent(formattedContent);
        setReportTitle("日報");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("GitHubのコミット情報の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 修正: 保存ハンドラー
  const handleSave = () => {
    // 追加: ローカルストレージに保存
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    reportStorage.saveReport(formattedDate, reportTitle, reportContent);
    setIsEditing(false);
  };
  // 今週の日付を計算
  const startOfCurrentWeek = startOfWeek(currentDate, { locale: ja });
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(startOfCurrentWeek, index);
    return {
      day: format(date, "E", { locale: ja }),
      date: format(date, "d"),
      fullDate: date,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl">日報</h1>
        </div>

        <div className="flex gap-8">
          {/* 日報エディターコンポーネント */}
          <DailyReportEditor
            currentDate={currentDate}
            isEditing={isEditing}
            loading={loading}
            error={error}
            reportContent={reportContent}
            reportTitle={reportTitle}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onContentChange={(content) => setReportContent(content)}
            onGenerateReport={handleGenerateReport}
          />

          {/* 右側: ユーザー情報と週間カレンダー */}
          <div className="w-5/12 flex flex-col gap-6">
            {/* ユーザー情報 */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="rounded-full"
                />
                <div>
                  <h2 className="font-medium">{user.name}</h2>
                  <p className="text-gray-500 text-sm">{user.username}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>作成日：{user.createdAt}</p>
                <p>更新日：{user.updatedAt}</p>
              </div>
            </div>

            {/* 週間カレンダー */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-center pb-4">
                <button
                  onClick={() => setCurrentDate((prev) => subDays(prev, 7))}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="grid grid-cols-7 w-full text-center">
                  {weekDays.map((day) => (
                    <div
                      key={day.date}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => setCurrentDate(day.fullDate)}
                    >
                      <span className="text-sm text-gray-500">{day.day}</span>
                      <span
                        className={`
                          w-8 h-8 flex items-center justify-center rounded-full mt-1
                          hover:bg-gray-200 transition-colors hover:text-black
                          ${
                            isSameDay(day.fullDate, currentDate)
                              ? "bg-blue-500 text-white"
                              : ""
                          }
                          ${
                            // 追加: 日報が存在する日付は青い枠線で表示
                            reportStorage.hasReport(
                              format(day.fullDate, "yyyy-MM-dd")
                            ) && !isSameDay(day.fullDate, currentDate)
                              ? "border-2 border-blue-500"
                              : ""
                          }
                        `}
                      >
                        {day.date}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentDate((prev) => addDays(prev, 7))}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              {/* コミット履歴 */}
              {analysisData?.commitData && (
                <div className="bg-white rounded-lg border h-[calc(100vh-430px)] overflow-y-auto p-4">
                  <h2 className="text-xl font-semibold border-b">
                    コミット履歴
                  </h2>
                  <div className="divide-y">
                    {analysisData.commitData.map((commit) => (
                      <div
                        key={commit.sha}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {commit.commit.message}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                              <span>{commit.commit.author.name}</span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  commit.commit.author.date
                                ).toLocaleString("ja-JP", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                          <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {commit.sha.slice(0, 7)}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
