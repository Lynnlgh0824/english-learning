#!/bin/bash

# 快速运行 TTS 自动化测试
# 使用方法: ./scripts/run-tts-tests.sh

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "🧪 TTS 自动化测试"
echo "==========================================${NC}"
echo ""

# 检查服务器是否运行
if ! lsof -ti:8000 > /dev/null 2>&1; then
    echo -e "${RED}❌ 服务器未运行！${NC}"
    echo ""
    echo "请先启动服务器:"
    echo "  python3 -m http.server 8000"
    echo "  或运行: ./scripts/start-all-servers.sh"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ 服务器正在运行${NC}"
echo ""

echo -e "${BLUE}选择测试方式:${NC}"
echo ""
echo "  1. 打开自动化测试运行器（推荐）⭐"
echo "  2. 运行 Puppeteer 集成测试"
echo "  3. 浏览器控制台测试（手动）"
echo ""
echo -n "请选择 (1-3): "
read -r choice < /dev/tty

case $choice in
    1)
        echo ""
        echo -e "${GREEN}正在打开自动化测试运行器...${NC}"
        open http://localhost:8000/archives/test-files/auto-test-runner.html
        echo -e "${GREEN}✅ 已在浏览器打开测试页面${NC}"
        ;;
    2)
        echo ""
        echo -e "${GREEN}运行 Puppeteer 集成测试...${NC}"
        echo ""

        # 检查是否安装了 puppeteer
        if ! command -v node &> /dev/null; then
            echo -e "${RED}❌ Node.js 未安装${NC}"
            echo "请先安装 Node.js: https://nodejs.org/"
            exit 1
        fi

        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}⚠️  node_modules 不存在，尝试安装依赖...${NC}"
            npm install puppeteer
        fi

        # 运行测试
        node tests/integration/test_tts_playback.js
        ;;
    3)
        echo ""
        echo -e "${BLUE}在浏览器控制台运行以下测试代码:${NC}"
        echo ""
        cat << 'EOF'
// 1. 基础 TTS 功能测试
console.log('=== TTS功能测试 ===');
const voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
console.log(`✅ 英文语音数量: ${voices.length}`);
const playBtn = document.getElementById('playBtn');
console.log(`✅ 播放按钮存在: ${!!playBtn}`);
const voiceSelect = document.getElementById('voiceSelect');
console.log(`✅ 语音选项: ${voiceSelect ? voiceSelect.options.length : 0}个`);
console.log(`✅ 段落数量: ${window.paragraphs ? window.paragraphs.length : 0}`);

// 2. 目录导航测试
console.log('=== 目录导航测试 ===');
const toc = document.querySelector('.toc');
console.log(`✅ TOC 存在: ${!!toc}`);
const tocLinks = document.querySelectorAll('.toc a');
console.log(`✅ 目录链接数: ${tocLinks.length}`);
EOF
        echo ""
        echo -e "${GREEN}1. 打开任意学习页面:${NC}"
        echo "   http://localhost:8000/records/2026-02-06-coming-home.html"
        echo ""
        echo -e "${GREEN}2. 按 F12 打开控制台${NC}"
        echo -e "${GREEN}3. 粘贴上述代码并运行${NC}"
        ;;
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}=========================================="
echo "📚 更多测试工具"
echo "==========================================${NC}"
echo ""
echo "自动化测试页面:"
echo "  📄 http://localhost:8000/archives/test-files/auto-test-runner.html"
echo "  📄 http://localhost:8000/archives/test-files/test-debug.html"
echo "  📄 http://localhost:8000/archives/test-files/test-audio-output.html"
echo ""
echo "测试文档:"
echo "  📖 docs/TEST-QUICK-GUIDE.md"
echo "  📖 docs/TESTING.md"
echo "  📖 docs/TTS-TEST.md"
echo ""
