// lib/storage/reports.ts
export interface DailyReportData {
  date: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'daily-reports';

export const reportStorage = {
  // 日報を保存
  saveReport(date: string, title: string, content: string): void {
    const reports = this.getAllReports();
    reports[date] = {
      date,
      title,
      content,
      createdAt: reports[date]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  // 特定の日付の日報を取得
  getReport(date: string): DailyReportData | null {
    const reports = this.getAllReports();
    return reports[date] || null;
  },

  // 全ての日報を取得
  getAllReports(): { [date: string]: DailyReportData } {
    const reportsJson = localStorage.getItem(STORAGE_KEY);
    return reportsJson ? JSON.parse(reportsJson) : {};
  },

  // 日報が存在するかチェック
  hasReport(date: string): boolean {
    const reports = this.getAllReports();
    return !!reports[date];
  }
};