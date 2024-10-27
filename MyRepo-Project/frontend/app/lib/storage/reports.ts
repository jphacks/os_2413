// lib/storage/reports.ts

export interface DailyReportData {
  date: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommitData {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
}

const REPORTS_STORAGE_KEY = 'daily-reports';
const COMMITS_STORAGE_KEY = 'commit-history';

class ReportStorage {
  hasReport(date: string): boolean {
    if (typeof window === 'undefined') return false;
    const reports = this.getAllReports();
    return !!reports[date];
  }

   deleteReport(date: string): void {
    if (typeof window === 'undefined') return;
    const reports = this.getAllReports();
    delete reports[date];
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  }

  saveReport(date: string, title: string, content: string): void {
    if (typeof window === 'undefined') return;
    const reports = this.getAllReports();
    reports[date] = {
      date,
      title,
      content,
      createdAt: reports[date]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  }

  getReport(date: string): DailyReportData | null {
    if (typeof window === 'undefined') return null;
    const reports = this.getAllReports();
    return reports[date] || null;
  }

  getAllReports(): { [date: string]: DailyReportData } {
    if (typeof window === 'undefined') return {};
    const reportsJson = localStorage.getItem(REPORTS_STORAGE_KEY);
    return reportsJson ? JSON.parse(reportsJson) : {};
  }
}

class CommitStorage {
  saveCommits(commits: CommitData[]): void {
    if (typeof window === 'undefined') return;
    
    const commitsByDate = commits.reduce((acc: { [date: string]: CommitData[] }, commit) => {
      const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(commit);
      return acc;
    }, {});

    localStorage.setItem(COMMITS_STORAGE_KEY, JSON.stringify(commitsByDate));
  }

  getCommitsByDate(date: string): CommitData[] {
    if (typeof window === 'undefined') return [];
    const commits = this.getAllCommits();
    return commits[date] || [];
  }

  getAllCommits(): { [date: string]: CommitData[] } {
    if (typeof window === 'undefined') return {};
    const commitsJson = localStorage.getItem(COMMITS_STORAGE_KEY);
    return commitsJson ? JSON.parse(commitsJson) : {};
  }

  hasCommits(date: string): boolean {
    if (typeof window === 'undefined') return false;
    const commits = this.getAllCommits();
    return !!commits[date] && commits[date].length > 0;
  }
}


export const reportStorage = new ReportStorage();
export const commitStorage = new CommitStorage();