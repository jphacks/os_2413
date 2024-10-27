# Dockerfile
FROM golang:1.21

WORKDIR /app

COPY go.mod go.sum ./
RUN export GOPROXY=direct && go mod tidy

COPY . .

# 再度 go mod tidy を実行
RUN export GOPROXY=direct && go mod tidy

RUN go build -o main .

CMD ["./main"]