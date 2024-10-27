import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Copy, Download, Share2, Pencil, Save, FileEdit } from "lucide-react";

interface DailyReportEditorProps {
  currentDate: Date;
  isEditing: boolean;
  loading: boolean;
  error: string | null;
  reportContent: string;
  reportTitle: string;
  onEdit: () => void;
  onSave: () => void;
  onContentChange: (content: string) => void;
  onGenerateReport: () => void;
}

const DailyReportEditor: React.FC<DailyReportEditorProps> = ({
  currentDate,
  isEditing,
  loading,
  error,
  reportContent,
  reportTitle,
  onEdit,
  onSave,
  onContentChange,
  onGenerateReport,
}) => {
  return (
    <div className="w-100 bg-white rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="font-medium">
              {reportTitle || "無題の日報"}
              <div className="text-gray-600">
                {format(currentDate, "yyyy年MM月dd日 (E)", { locale: ja })}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Copy size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Download size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 size={20} />
            </button>
            <button
              onClick={() => (isEditing ? onSave() : onEdit())}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                isEditing
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {isEditing ? (
                <>
                  <Save size={16} className="mr-2" />
                  保存
                </>
              ) : (
                <>
                  <Pencil size={16} className="mr-2" />
                  編集
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-300px)] overflow-y-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">日報を作成中です...</p>
            <p className="text-sm text-gray-500 mt-2">
              GitHubのコミット履歴を分析しています
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500">
            <p>{error}</p>
            <button
              onClick={onGenerateReport}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
            >
              再試行
            </button>
          </div>
        ) : isEditing ? (
          <textarea
            className="w-full h-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={reportContent}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="日報を入力してください..."
          />
        ) : reportContent ? (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{reportContent}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="mb-4">
              日報を作成するには、上部の「日報を作成」ボタンをクリックしてください
            </p>
            <button
              onClick={onGenerateReport}
              className="px-4 py-2 text-white bg-blue-400 hover:bg-blue-600 rounded-md transition-colors"
            >
              日報を作成する
            </button>
          </div>
        )}
      </div>

      {reportContent && (
        <div className="flex justify-end space-x-4 p-4 border-t">
          <button
            onClick={onGenerateReport}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            <FileEdit size={16} className="mr-2" />
            再作成
          </button>
          <button
            onClick={onSave}
            className="flex items-center px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
          >
            <Save size={16} className="mr-2" />
            保存
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyReportEditor;
