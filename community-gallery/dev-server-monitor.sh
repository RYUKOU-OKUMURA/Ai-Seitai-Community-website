#!/bin/bash

# Next.js開発サーバー監視スクリプト
# 使用方法: ./dev-server-monitor.sh

LOG_FILE="next-dev-server.log"
PID_FILE="next-dev-server.pid"
PORT=3000

# 色付きの出力
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# プロセスが実行中かチェック
check_process() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            return 0
        fi
    fi
    return 1
}

# サーバーを起動
start_server() {
    echo -e "${YELLOW}Starting Next.js development server...${NC}"
    
    # 既存のプロセスをクリーンアップ
    if check_process; then
        echo -e "${YELLOW}Stopping existing server...${NC}"
        stop_server
    fi
    
    # ポートが使用中かチェック
    if lsof -i :$PORT >/dev/null 2>&1; then
        echo -e "${RED}Port $PORT is already in use!${NC}"
        echo "Killing process on port $PORT..."
        kill $(lsof -t -i:$PORT) 2>/dev/null
        sleep 2
    fi
    
    # サーバーを起動
    nohup npm run dev >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    
    # 起動を待つ
    echo -n "Waiting for server to start"
    for i in {1..30}; do
        if curl -s -o /dev/null http://localhost:$PORT; then
            echo -e "\n${GREEN}Server started successfully!${NC}"
            echo -e "${GREEN}Access at: http://localhost:$PORT${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    
    echo -e "\n${RED}Server failed to start. Check $LOG_FILE for details.${NC}"
    return 1
}

# サーバーを停止
stop_server() {
    if check_process; then
        PID=$(cat "$PID_FILE")
        echo -e "${YELLOW}Stopping server (PID: $PID)...${NC}"
        kill "$PID" 2>/dev/null
        rm -f "$PID_FILE"
        echo -e "${GREEN}Server stopped.${NC}"
    else
        echo -e "${YELLOW}Server is not running.${NC}"
    fi
}

# サーバーの状態を確認
status_server() {
    if check_process; then
        PID=$(cat "$PID_FILE")
        echo -e "${GREEN}Server is running (PID: $PID)${NC}"
        echo -e "Port $PORT status:"
        lsof -i :$PORT | grep LISTEN
    else
        echo -e "${RED}Server is not running.${NC}"
    fi
}

# ログを表示
show_logs() {
    if [ -f "$LOG_FILE" ]; then
        echo -e "${YELLOW}Recent logs:${NC}"
        tail -n 50 "$LOG_FILE"
    else
        echo -e "${YELLOW}No log file found.${NC}"
    fi
}

# メインメニュー
case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        sleep 2
        start_server
        ;;
    status)
        status_server
        ;;
    logs)
        show_logs
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac