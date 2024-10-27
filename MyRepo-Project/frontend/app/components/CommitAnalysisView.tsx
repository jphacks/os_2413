"use client";

import React, { useState, useEffect } from "react";
import api from "../lib/api/reports";
import { CommitAnalysis } from "../lib/api/reports";

const formatAnalysisText = (text: string) => {
  // 各セクションを配列に分割
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

const CommitAnalysisView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<CommitAnalysis | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.analyzeCommits();
        setAnalysisData(data);
      } catch (err) {
        console.error("API Error:", err);
        setError(
          "GitHubのコミット情報の取得に失敗しました。バックエンドサーバーが起動していることを確認してください。"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
        <div className="text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          分析中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
        <h3 className="text-red-800 font-medium mb-2">エラーが発生しました</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Geminiの分析結果（日報） */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">日報</h2>
        <div className="prose max-w-none space-y-6">
          {analysisData?.analysis &&
            formatAnalysisText(analysisData.analysis).map((section, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium text-lg text-gray-800 mb-2">
                  {section.title}
                </h3>
                <div className="text-gray-600 whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* コミット履歴 */}
      <div className="bg-white rounded-lg border">
        <h2 className="text-xl font-semibold p-6 border-b">コミット履歴</h2>
        <div className="divide-y">
          {analysisData?.commitData.map((commit) => (
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
                      {new Date(commit.commit.author.date).toLocaleString(
                        "ja-JP",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
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
    </div>
  );
};

export default CommitAnalysisView;
