#!/bin/bash

# ============================================
# 🧪 用户自动化测试 - 快速启动脚本
#
# 功能：调用已有的Puppeteer测试脚本
# 测试：完整用户流程 + TTS功能
# ============================================

set -e

PROJECT_ROOT="/Users/yuzhoudeshengyin/Documents/my_project/english-learning"
cd "$PROJECT_ROOT"

echo "========================================"
echo "🧪 用户自动化测试"
echo "========================================"
echo ""

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. 检查Node.js
echo "1️⃣  检查环境..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请安装: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo ""

# 2. 检查测试文件
TEST_USER_FLOW="$PROJECT_ROOT/archives/test-files/test_user_flow.js"
TEST_TTS_AUTO="$PROJECT_ROOT/archives/test-files/tts_automated_test.js"

if [ ! -f "$TEST_USER_FLOW" ]; then
    echo "❌ 找不到测试文件: $TEST_USER_FLOW"
    exit 1
fi
echo -e "${GREEN}✅ 测试文件已就绪${NC}"
echo ""

# 3. 启动HTTP服务器
echo "2️⃣  启动测试服务器..."
find_port() {
    local PORT=8000
    while lsof -ti:$PORT >/dev/null 2>&1; do
        PORT=$((PORT + 1))
    done
    echo $PORT
}

TEST_PORT=$(find_port)
python3 -m http.server $TEST_PORT > /tmp/test-server.log 2>&1 &
SERVER_PID=$!
sleep 2

if ! lsof -ti:$TEST_PORT >/dev/null 2>&1; then
    echo "❌ 服务器启动失败"
    cat /tmp/test-server.log
    exit 1
fi

echo -e "${GREEN}✅ 服务器运行中: http://localhost:$TEST_PORT${NC} (PID: $SERVER_PID)"
echo ""

# 4. 运行用户流程测试
echo "3️⃣  运行用户流程测试 (8步)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if node "$TEST_USER_FLOW" "http://localhost:$TEST_PORT"; then
    echo -e "${GREEN}✅ 用户流程测试通过${NC}"
else
    echo -e "${YELLOW}⚠️  用户流程测试有问题${NC}"
fi
echo ""

# 5. 清理
echo "4️⃣  清理环境..."
kill $SERVER_PID 2>/dev/null || true
echo -e "${GREEN}✅ 服务器已关闭${NC}"
echo ""

echo "========================================"
echo -e "${GREEN}✅ 测试完成！${NC}"
echo "========================================"
