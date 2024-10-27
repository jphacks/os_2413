// src/api/reports.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Commit {
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

export interface CommitAnalysis {
    analysis: string;
    commitData: Commit[];
}

const api = {
    // GitHubコミットの分析を取得
    analyzeCommits: async (): Promise<CommitAnalysis> => {
        const response = await axios.get(`${API_BASE_URL}/analyze-commits`);
        return response.data;
    }
};

export default api;