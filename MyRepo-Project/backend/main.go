// main.go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

type Commit struct {
	SHA    string `json:"sha"`
	Commit struct {
		Message string `json:"message"`
		Author  struct {
			Name  string `json:"name"`
			Email string `json:"email"`
			Date  string `json:"date"`
		} `json:"author"`
	} `json:"commit"`
}

type GeminiResponse struct {
	Analysis   string   `json:"analysis"`
	CommitData []Commit `json:"commitData"`
}

func main() {
	// .envファイルの読み込み
	if err := godotenv.Load(); err != nil {
		fmt.Println("Error loading .env file")
		return
	}

	r := gin.Default()

	// CORSの設定
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// GitHubコミット取得とGemini分析のエンドポイント
	r.GET("/api/analyze-commits", handleAnalyzeCommits)

	r.Run(":8080")
}

func getGithubCommits() ([]Commit, error) {
	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		return nil, fmt.Errorf("GitHubトークンが設定されていません")
	}

	owner := "fukai0116"  // GitHubユーザー名
	repo := "github-repo" // リポジトリ名
	apiURL := fmt.Sprintf("https://api.github.com/repos/%s/%s/commits", owner, repo)

	client := &http.Client{}
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("リクエスト作成エラー: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("リクエストエラー: %v", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("レスポンス読み込みエラー: %v", err)
	}

	var commits []Commit
	if err = json.Unmarshal(body, &commits); err != nil {
		return nil, fmt.Errorf("JSONパースエラー: %v", err)
	}

	return commits, nil
}

func analyzeWithGemini(ctx context.Context, commits []Commit) (string, error) {
	client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("GEMINI_APIKEY")))
	if err != nil {
		return "", fmt.Errorf("Geminiクライアントの作成に失敗しました: %v", err)
	}
	defer client.Close()

	// コミットメッセージをまとめて文字列を作成
	var commitSummary string
	for _, commit := range commits {
		commitSummary += fmt.Sprintf("日時: %s\n作者: %s\nコミット: %s\n\n",
			commit.Commit.Author.Date,
			commit.Commit.Author.Name,
			commit.Commit.Message)
	}

	// 日報形式のプロンプトを作成
	prompt := fmt.Sprintf(`以下のgit commitのデータを見て、日報形式でまとめてください：

%s

以下の項目に分けて作成してください：

①今日の目標
②今日の業務内容
③今日の成果
④今日の良かった点
⑤今日の反省点

以下の日報形式を参考にしてください：

今日の目標
納品処理における作業効率のアップを図り、就業時間内に3件終わらせる

今日の業務内容
9:00～11:00　社内にて会議
11:00～12:00　電話とメールの対応
※〇〇社からのシステムトラブルによるクレームが発生
13:00～14:30　～社のトラブル対応
※〇〇社のクレーム対応を終え、システムトラブルの解決
14:30～16:30　3件分の納品処理
16:30～18:00　プロジェクトミーティング

今日の成果
〇〇社によるシステムトラブルが発生したものの、納品処理の作業に慣れてきたことで、目標通り3件分の納品処理ができました。

今日の良かった点
システムトラブルの対応にあたって、素早く解決策について連絡することで、〇〇社にご安心いただけました。トラブル対応にあたって、スピード感と具体的な解決策の提案が重要であることを再認識できました。

今日の反省点
目標であった納品作業件数は達成できましたが、今日のように急なトラブル対応があった際にも、さらにスムーズに納品作業が行えるよう改善していきます。

上記の形式を参考に、提供されたコミットデータに基づいて具体的な日報を作成してください。`, commitSummary)

	model := client.GenerativeModel("gemini-pro")
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", fmt.Errorf("Gemini APIの呼び出しに失敗しました: %v", err)
	}

	var response string
	for _, candidate := range resp.Candidates {
		for _, part := range candidate.Content.Parts {
			response += fmt.Sprintf("%v\n", part)
		}
	}

	return response, nil
}

func handleAnalyzeCommits(c *gin.Context) {
	commits, err := getGithubCommits()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	analysis, err := analyzeWithGemini(context.Background(), commits)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := GeminiResponse{
		Analysis:   analysis,
		CommitData: commits,
	}

	c.JSON(http.StatusOK, response)
}
