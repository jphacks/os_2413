package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
  "os"
  "fmt"
  "io/ioutil"
  "time"
  "encoding/json"
)

type Commit struct {
  SHA    string `json:"sha"`
  Commit struct {
    Author struct {
      Date string `json:"date"`
    } `json:"author"`
    Message string `json:"message"`
  } `json:"commit"`
}

func GetCommits(c *gin.Context) {
  // GitHub トークンを環境変数から取得
  githubToken := os.Getenv("GITHUB_TOKEN")
  if githubToken == "" {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "GitHub token is missing"})
    return
  }

  // GitHub APIにリクエストを送る
  url := "https://api.github.com/repos/{fukai0116}/{github-repo}/commits"  // 必要に応じてURLを変更
  client := &http.Client{}
  req, err := http.NewRequest("GET", url, nil)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
    return
  }
  req.Header.Set("Authorization", "token "+githubToken)

  resp, err := client.Do(req)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request"})
    return
  }
  defer resp.Body.Close()

  body, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
    return
  }

  var commits []Commit
  if err := json.Unmarshal(body, &commits); err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse response"})
    return
  }

  // 今日の日付を取得
  today := time.Now().Format("2006-01-02")

  // 今日のコミットをフィルタリング
  var todayCommits []Commit
  for _, commit := range commits {
    if commit.Commit.Author.Date[:10] == today {
      todayCommits = append(todayCommits, commit)
    }
  }

  // 今日のコミットをファイルに保存
  file, err := os.Create("today_commits.json")
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create file"})
    return
  }
  defer file.Close()

  if err := json.NewEncoder(file).Encode(todayCommits); err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write to file"})
    return
  }

  c.JSON(http.StatusOK, gin.H{"message": "Today's commits saved successfully"})
}

func main() {
  r := gin.Default()
  r.GET("/commits", GetCommits)
  r.Run()
}