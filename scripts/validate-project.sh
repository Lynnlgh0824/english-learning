#!/bin/bash
# ========================================
# 英语学习项目 - 自动化验证脚本
# ========================================
# 基于 TESTING.md 创建的自动化检查工具

set -e  # 遇到错误立即退出

PROJECT_ROOT="/Users/yuzhoudeshengyin/english-learning"
RECORDS_DIR="$PROJECT_ROOT/records"
STYLES_DIR="$PROJECT_ROOT/styles"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 统计变量
total_checks=0
passed_checks=0
failed_checks=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🧪 英语学习项目 - 自动化验证${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ========================================
# 1. 文件结构验证
# ========================================
echo -e "${BLUE}[1/6] 文件结构验证${NC}"

# 1.1 检查公共文件是否存在
check_file() {
    local file=$1
    total_checks=$((total_checks + 1))
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✅${NC} $file"
        passed_checks=$((passed_checks + 1))
        return 0
    else
        echo -e "  ${RED}❌${NC} $file 不存在"
        failed_checks=$((failed_checks + 1))
        return 1
    fi
}

echo "检查公共CSS/JS文件:"
check_file "$STYLES_DIR/common.css"
check_file "$STYLES_DIR/tts-common.css"
check_file "$SCRIPTS_DIR/tts-common.js"
check_file "$SCRIPTS_DIR/page-common.js"
echo ""

# ========================================
# 2. HTML文件一致性检查
# ========================================
echo -e "${BLUE}[2/6] HTML文件一致性检查${NC}"

for html_file in "$RECORDS_DIR"/*.html; do
    if [ -f "$html_file" ]; then
        filename=$(basename "$html_file")
        total_checks=$((total_checks + 3))

        echo "检查 $filename:"

        # 检查 tts-common.js 引用
        if grep -q "tts-common.js" "$html_file"; then
            tts_count=$(grep -c "tts-common.js" "$html_file")
            if [ "$tts_count" -eq 1 ]; then
                echo -e "  ${GREEN}✅${NC} tts-common.js 引用正确 (1个)"
                passed_checks=$((passed_checks + 1))
            else
                echo -e "  ${YELLOW}⚠️${NC} tts-common.js 引用 $tts_count 个 (应该是1个)"
                failed_checks=$((failed_checks + 1))
            fi
        else
            echo -e "  ${RED}❌${NC} 缺少 tts-common.js 引用"
            failed_checks=$((failed_checks + 1))
        fi

        # 检查 page-common.js 引用
        if grep -q "page-common.js" "$html_file"; then
            page_count=$(grep -c "page-common.js" "$html_file")
            if [ "$page_count" -eq 1 ]; then
                echo -e "  ${GREEN}✅${NC} page-common.js 引用正确 (1个)"
                passed_checks=$((passed_checks + 1))
            else
                echo -e "  ${YELLOW}⚠️${NC} page-common.js 引用 $page_count 个 (应该是1个)"
                failed_checks=$((failed_checks + 1))
            fi
        else
            echo -e "  ${RED}❌${NC} 缺少 page-common.js 引用"
            failed_checks=$((failed_checks + 1))
        fi

        # 检查是否有内联 <script> 标签（排除外部引用）
        inline_scripts=$(grep -o '<script>' "$html_file" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$inline_scripts" -eq 0 ]; then
            echo -e "  ${GREEN}✅${NC} 无内联脚本"
            passed_checks=$((passed_checks + 1))
        else
            echo -e "  ${RED}❌${NC} 发现 $inline_scripts 个内联 <script> 标签"
            failed_checks=$((failed_checks + 1))
        fi

        echo ""
    fi
done

# ========================================
# 3. 文件行数检查（检测是否有重复代码）
# ========================================
echo -e "${BLUE}[3/6] 文件大小检查${NC}"

for html_file in "$RECORDS_DIR"/*.html; do
    if [ -f "$html_file" ]; then
        filename=$(basename "$html_file")
        line_count=$(wc -l < "$html_file")
        total_checks=$((total_checks + 1))

        # 正常范围应该是 1200-1500 行
        if [ "$line_count" -lt 1200 ]; then
            echo -e "  ${YELLOW}⚠️${NC} $filename: $line_count 行 (可能内容不完整)"
            failed_checks=$((failed_checks + 1))
        elif [ "$line_count" -gt 1600 ]; then
            echo -e "  ${RED}❌${NC} $filename: $line_count 行 (可能包含重复代码)"
            failed_checks=$((failed_checks + 1))
        else
            echo -e "  ${GREEN}✅${NC} $filename: $line_count 行 (正常)"
            passed_checks=$((passed_checks + 1))
        fi
    fi
done
echo ""

# ========================================
# 4. 必要的DOM元素检查
# ========================================
echo -e "${BLUE}[4/6] DOM元素检查${NC}"

check_dom_element() {
    local html_file=$1
    local element_id=$2
    local element_name=$3

    total_checks=$((total_checks + 1))
    if grep -q "id=\"$element_id\"" "$html_file"; then
        echo -e "  ${GREEN}✅${NC} $element_name (#$element_id)"
        passed_checks=$((passed_checks + 1))
        return 0
    else
        echo -e "  ${RED}❌${NC} 缺少 $element_name (#$element_id)"
        failed_checks=$((failed_checks + 1))
        return 1
    fi
}

for html_file in "$RECORDS_DIR"/*.html; do
    if [ -f "$html_file" ]; then
        filename=$(basename "$html_file")
        echo "检查 $filename 的必要元素:"

        # TTS 必要元素
        check_dom_element "$html_file" "playBtn" "播放按钮"
        check_dom_element "$html_file" "voiceSelect" "语音选择器"
        check_dom_element "$html_file" "rateSlider" "语速滑块"
        check_dom_element "$html_file" "ttsStatus" "TTS状态"

        # 页面必要元素
        check_dom_element "$html_file" "readingProgress" "阅读进度条"
        check_dom_element "$html_file" "backToTop" "回到顶部按钮"

        echo ""
    fi
done

# ========================================
# 5. CSS 引用检查
# ========================================
echo -e "${BLUE}[5/6] CSS引用检查${NC}"

for html_file in "$RECORDS_DIR"/*.html; do
    if [ -f "$html_file" ]; then
        filename=$(basename "$html_file")
        total_checks=$((total_checks + 2))

        echo "检查 $filename:"

        if grep -q "common.css" "$html_file"; then
            echo -e "  ${GREEN}✅${NC} 引用 common.css"
            passed_checks=$((passed_checks + 1))
        else
            echo -e "  ${RED}❌${NC} 缺少 common.css"
            failed_checks=$((failed_checks + 1))
        fi

        if grep -q "tts-common.css" "$html_file"; then
            echo -e "  ${GREEN}✅${NC} 引用 tts-common.css"
            passed_checks=$((passed_checks + 1))
        else
            echo -e "  ${RED}❌${NC} 缺少 tts-common.css"
            failed_checks=$((failed_checks + 1))
        fi

        echo ""
    fi
done

# ========================================
# 6. 代码重复检测
# ========================================
echo -e "${BLUE}[6/6] 代码重复检测${NC}"

total_checks=$((total_checks + 1))
duplicate_count=0

for html_file in "$RECORDS_DIR"/*.html; do
    if [ -f "$html_file" ]; then
        # 检查是否有重复的事件监听器模式
        if grep -q "addEventListener.*scroll" "$html_file"; then
            duplicate_count=$((duplicate_count + 1))
        fi
    fi
done

if [ "$duplicate_count" -eq 0 ]; then
    echo -e "  ${GREEN}✅${NC} 未发现重复的事件监听器"
    passed_checks=$((passed_checks + 1))
else
    echo -e "  ${RED}❌${NC} 发现 $duplicate_count 个文件可能有重复的事件监听器"
    failed_checks=$((failed_checks + 1))
fi
echo ""

# ========================================
# 总结报告
# ========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📊 验证总结${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "总检查数: $total_checks"
echo -e "${GREEN}通过: $passed_checks${NC}"
echo -e "${RED}失败: $failed_checks${NC}"
echo ""

pass_rate=$((passed_checks * 100 / total_checks))
echo -e "通过率: $pass_rate%"

if [ "$pass_rate" -eq 100 ]; then
    echo -e ""
    echo -e "${GREEN}🎉 所有检查通过！项目结构健康。${NC}"
    exit 0
elif [ "$pass_rate" -ge 80 ]; then
    echo -e ""
    echo -e "${YELLOW}⚠️ 大部分检查通过，但仍有少量问题需要修复。${NC}"
    exit 1
else
    echo -e ""
    echo -e "${RED}❌ 项目存在严重问题，需要立即修复！${NC}"
    exit 2
fi
