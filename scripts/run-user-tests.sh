#!/bin/bash

# ============================================
# 🧪 用户自动化测试 - 完整测试套件
# 用途：模拟真实用户操作，测试完整学习流程
# ============================================

set -e  # 遇到错误立即退出

PROJECT_ROOT="/Users/yuzhoudeshengyin/Documents/my_project/english-learning"
cd "$PROJECT_ROOT"

echo "========================================"
echo "🧪 用户自动化测试套件"
echo "========================================"
echo ""
echo "测试时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查依赖
echo "🔍 1. 检查测试依赖..."
echo "────────────────────────────────"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 版本: $(node --version)${NC}"
echo -e "${GREEN}✅ npm 版本: $(npm --version)${NC}"
echo ""

# 安装Puppeteer（如果未安装）
echo "📦 2. 检查 Puppeteer..."
echo "────────────────────────────────"

if [ ! -d "node_modules/puppeteer" ]; then
    echo "安装 Puppeteer..."
    npm install puppeteer --save-dev
fi

echo -e "${GREEN}✅ Puppeteer 已就绪${NC}"
echo ""

# 启动HTTP服务器
echo "🚀 3. 启动测试服务器..."
echo "────────────────────────────────"

# 查找可用端口
find_port() {
    local PORT=8000
    while lsof -ti:$PORT >/dev/null 2>&1; do
        PORT=$((PORT + 1))
    done
    echo $PORT
}

TEST_PORT=$(find_port)
echo "使用端口: $TEST_PORT"

# 启动服务器（后台）
python3 -m http.server $TEST_PORT > /tmp/test-server.log 2>&1 &
SERVER_PID=$!
echo "服务器 PID: $SERVER_PID"

# 等待服务器启动
sleep 2

# 检查服务器是否启动成功
if ! lsof -ti:$TEST_PORT >/dev/null 2>&1; then
    echo -e "${RED}❌ 服务器启动失败${NC}"
    cat /tmp/test-server.log
    exit 1
fi

echo -e "${GREEN}✅ 服务器已启动: http://localhost:$TEST_PORT${NC}"
echo ""

# 运行测试
echo "🧪 4. 运行用户流程测试..."
echo "────────────────────────────────"

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试1: 完整用户流程
echo ""
echo "📝 测试 1: 完整用户学习流程"
echo "────────────────────────────────"

node "$PROJECT_ROOT/tests/integration/test_user_flow.js" "http://localhost:$TEST_PORT" 2>&1 | tee /tmp/test-output.log

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo -e "${GREEN}✅ 测试 1 通过${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}❌ 测试 1 失败${NC}"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# 测试2: TTS功能测试
echo ""
echo "📝 测试 2: TTS功能测试"
echo "────────────────────────────────"

if [ -f "$PROJECT_ROOT/tests/integration/tts_automated_test.js" ]; then
    node "$PROJECT_ROOT/tests/integration/tts_automated_test.js" "http://localhost:$TEST_PORT" 2>&1 | tee -a /tmp/test-output.log

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo -e "${GREEN}✅ 测试 2 通过${NC}"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}❌ 测试 2 失败${NC}"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
else
    echo -e "${YELLOW}⚠️  测试 2 文件不存在，跳过${NC}"
fi

# 测试3: 链接完整性测试
echo ""
echo "📝 测试 3: 链接完整性测试"
echo "────────────────────────────────"

node -e "
const Puppeteer = require('puppeteer');

(async () => {
    const browser = await Puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:$TEST_PORT', { waitUntil: 'networkidle0' });

        // 获取所有链接
        const links = await page.evaluate(() => {
            const elements = document.querySelectorAll('a[href]');
            return Array.from(elements).map(a => ({
                href: a.href,
                text: a.textContent.trim().substring(0, 50)
            }));
        });

        console.log('找到 ' + links.length + ' 个链接');

        let brokenLinks = 0;
        for (const link of links) {
            if (link.href.includes('records/') && link.href.endsWith('.html')) {
                try {
                    const response = await page.goto(link.href, { waitUntil: 'networkidle0' });
                    if (response.status() === 404) {
                        console.log('❌ 断链: ' + link.text);
                        brokenLinks++;
                    }
                } catch (e) {
                    console.log('❌ 错误: ' + link.href);
                    brokenLinks++;
                }
            }
        }

        if (brokenLinks === 0) {
            console.log('✅ 所有学习记录链接正常');
            process.exit(0);
        } else {
            console.log('❌ 发现 ' + brokenLinks + ' 个断链');
            process.exit(1);
        }
    } finally {
        await browser.close();
    }
})();
" 2>&1 | tee -a /tmp/test-output.log

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 测试 3 通过${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}❌ 测试 3 失败${NC}"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# 清理：关闭服务器
echo ""
echo "🧹 5. 清理测试环境..."
echo "────────────────────────────────"

kill $SERVER_PID 2>/dev/null || true
echo -e "${GREEN}✅ 测试服务器已关闭${NC}"

# 生成测试报告
echo ""
echo "📊 6. 测试报告"
echo "────────────────────────────────"
echo ""
echo "测试时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "测试端口: $TEST_PORT"
echo "总测试数: $TOTAL_TESTS"
echo -e "通过: ${GREEN}$PASSED_TESTS${NC}"
echo -e "失败: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ 所有测试通过！${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "📝 详细日志已保存到: /tmp/test-output.log"
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ 部分测试失败${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "📝 查看详细日志: cat /tmp/test-output.log"
    exit 1
fi
