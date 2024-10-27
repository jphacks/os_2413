// commits-pull.go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
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

func main() {
	// .envファイルの読み込み
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// 環境変数からトークンを取得
	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		fmt.Println("GitHubトークンが設定されていません。")
		return
	}

	owner := "fukai0116"  // GitHubユーザー名
	repo := "github-repo" // リポジトリ名
	apiURL := fmt.Sprintf("https://api.github.com/repos/%s/%s/commits", owner, repo)

	client := &http.Client{}
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		fmt.Println("リクエスト作成エラー:", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("リクエストエラー:", err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("レスポンス読み込みエラー:", err)
		return
	}

	// レスポンス内容を表示（デバッグ用）
	fmt.Println("レスポンス内容:", string(body))

	// JSONをパース
	var commits []Commit
	if err = json.Unmarshal(body, &commits); err != nil {
		fmt.Println("JSONパースエラー:", err)
		return
	}

	// 結果をファイルに保存
	file, err := os.Create("commits.json")
	if err != nil {
		fmt.Println("ファイル作成エラー:", err)
		return
	}
	defer file.Close()

	data, err := json.MarshalIndent(commits, "", "  ")
	if err != nil {
		fmt.Println("JSON生成エラー:", err)
		return
	}
	file.Write(data)

	fmt.Println("コミットデータがcommits.jsonに保存されました。")
}
