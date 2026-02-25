#!/bin/bash

# 启动所有项目的本地服务器
# 使用方法: ./scripts/start-all-servers.sh

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "🚀 启动所有项目的本地服务器"
echo "==========================================${NC}"
echo ""

echo -e "${YELLOW}🔍 检查并停止现有服务器...${NC}"
for PORT in 8000 8001 8002 8003 8004; do
    PID=$(lsof -ti:$PORT 2>/dev/null || true)
    if [ -n "$PID" ]; then
        echo "  停止端口 $PORT 的服务 (PID: $PID)"
        kill $PID 2>/dev/null || true
    fi
done

sleep 1

echo ""
echo -e "${GREEN}🚀 启动服务器...${NC}"
echo ""

# english-learning - 端口 8000
PROJECT_PATH="/Users/yuzhoudeshengyin/Documents/my_project/english-learning"
if [ -d "$PROJECT_PATH" ]; then
    cd "$PROJECT_PATH"
    python3 -m http.server 8000 > /tmp/english-learning-server.log 2>&1 &
    SERVER_PID=$!
    sleep 1
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} english-learning"
        echo "   端口: ${BLUE}http://localhost:8000${NC}"
        echo "   PID: $SERVER_PID"
        PIDS="$PIDS $SERVER_PID"
    fi
    echo ""
fi

# project summary - 端口 8001
PROJECT_PATH="/Users/yuzhoudeshengyin/Documents/my_project/project summary"
if [ -d "$PROJECT_PATH" ]; then
    cd "$PROJECT_PATH"
    python3 -m http.server 8001 > /tmp/project-summary-server.log 2>&1 &
    SERVER_PID=$!
    sleep 1
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} project summary"
        echo "   端口: ${BLUE}http://localhost:8001${NC}"
        echo "   PID: $SERVER_PID"
        PIDS="$PIDS $SERVER_PID"
    fi
    echo ""
fi

# Chiengmai - 端口 8002
PROJECT_PATH="/Users/yuzhoudeshengyin/Documents/my_project/Chiengmai"
if [ -d "$PROJECT_PATH" ]; then
    cd "$PROJECT_PATH"
    python3 -m http.server 8002 > /tmp/chiengmai-server.log 2>&1 &
    SERVER_PID=$!
    sleep 1
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} Chiengmai"
        echo "   端口: ${BLUE}http://localhost:8002${NC}"
        echo "   PID: $SERVER_PID"
        PIDS="$PIDS $SERVER_PID"
    fi
    echo ""
fi

# aisaasvideo - 端口 8003
PROJECT_PATH="/Users/yuzhoudeshengyin/Documents/my_project/aisaasvideo"
if [ -d "$PROJECT_PATH" ]; then
    cd "$PROJECT_PATH"
    python3 -m http.server 8003 > /tmp/aisaasvideo-server.log 2>&1 &
    SERVER_PID=$!
    sleep 1
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} aisaasvideo"
        echo "   端口: ${BLUE}http://localhost:8003${NC}"
        echo "   PID: $SERVER_PID"
        PIDS="$PIDS $SERVER_PID"
    fi
    echo ""
fi

# clawdbot-railway-template - 端口 8004
PROJECT_PATH="/Users/yuzhoudeshengyin/Documents/my_project/clawdbot-railway-template"
if [ -d "$PROJECT_PATH" ]; then
    cd "$PROJECT_PATH"
    python3 -m http.server 8004 > /tmp/clawdbot-server.log 2>&1 &
    SERVER_PID=$!
    sleep 1
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} clawdbot-railway-template"
        echo "   端口: ${BLUE}http://localhost:8004${NC}"
        echo "   PID: $SERVER_PID"
        PIDS="$PIDS $SERVER_PID"
    fi
    echo ""
fi

echo -e "${GREEN}=========================================="
echo "✨ 所有服务器已启动"
echo "==========================================${NC}"
echo ""

echo -e "${BLUE}📋 访问地址:${NC}"
echo -e "  ${GREEN}1. english-learning${NC}     ${BLUE}http://localhost:8000${NC}"
echo -e "  ${GREEN}2. project summary${NC}      ${BLUE}http://localhost:8001${NC}"
echo -e "  ${GREEN}3. Chiengmai${NC}           ${BLUE}http://localhost:8002${NC}"
echo -e "  ${GREEN}4. aisaasvideo${NC}         ${BLUE}http://localhost:8003${NC}"
echo -e "  ${GREEN}5. clawdbot-railway${NC}    ${BLUE}http://localhost:8004${NC}"
echo ""

echo -e "${YELLOW}💡 停止所有服务器:${NC}"
echo "  $PIDS"
echo ""

# 保存 PID
echo "$PIDS" > /tmp/project-servers-pids.txt
echo -e "${BLUE}📝 PID 已保存到: /tmp/project-servers-pids.txt${NC}"
echo ""
echo -e "${GREEN}✨ 完成！${NC}"
