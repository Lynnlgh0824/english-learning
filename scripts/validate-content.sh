#!/bin/bash

# ============================================
# 学习记录内容一致性验证脚本
# 用途：检查HTML文件内容是否与标题匹配
# ============================================

PROJECT_ROOT="/Users/yuzhoudeshengyin/Documents/my_project/english-learning"
RECORDS_DIR="$PROJECT_ROOT/records"
DATA_JSON="$PROJECT_ROOT/data.json"

echo "🔍 开始验证学习记录内容一致性..."
echo ""

# 错误计数
ERROR_COUNT=0
WARNING_COUNT=0

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_html_content() {
    local html_file="$1"
    local expected_title="$2"
    local record_id="$3"

    echo "检查: $record_id"

    # 提取HTML中的h1标题
    local html_title=$(grep -o '<h1>.*</h1>' "$html_file" | sed 's/<[^>]*>//g' | head -1)

    # 检查标题是否包含关键词
    if [[ ! "$html_title" == *"$expected_title"* ]]; then
        echo -e "${RED}  ❌ 标题不匹配${NC}"
        echo "     预期: $expected_title"
        echo "     实际: $html_title"
        ((ERROR_COUNT++))
        return 1
    fi

    # 提取第一个词汇卡片
    local first_vocab=$(grep -A 2 '<h3>1\.' "$html_file" | grep '<strong>' | sed 's/<[^>]*>//g' | xargs)

    # 检查是否有词汇内容
    if [[ -z "$first_vocab" ]]; then
        echo -e "${RED}  ❌ 缺少词汇内容${NC}"
        ((ERROR_COUNT++))
        return 1
    fi

    # 检查是否有通用的占位内容（说明复制模板后忘记替换）
    local placeholder_keywords=("Digital Nomad" "Coming Home" "placeholder" "Lorem Ipsum")
    for keyword in "${placeholder_keywords[@]}"; do
        # 如果标题不相关但内容包含这些词，说明内容错误
        if [[ ! "$html_title" == *"$keyword"* ]]; then
            # 检查第一个词汇是否是占位符
            if [[ "$first_vocab" == "$keyword" ]]; then
                echo -e "${YELLOW}  ⚠️  可能包含未替换的模板内容: $keyword${NC}"
                ((WARNING_COUNT++))
            fi
        fi
    done

    echo -e "${GREEN}  ✅ 通过${NC}"
    return 0
}

# 从data.json读取所有记录
echo "📋 从 data.json 读取学习记录..."
echo ""

# 使用jq或grep解析JSON
if command -v jq &> /dev/null; then
    # 如果有jq，使用jq解析
    records=$(jq -r '.records[] | @json' "$DATA_JSON")
else
    # 否则使用grep解析
    records=$(grep -A 10 '"id":' "$DATA_JSON" | grep -v '^--$')
fi

# 遍历每个记录
echo "$records" | while IFS= read -r record; do
    # 提取字段（简单的JSON解析）
    id=$(echo "$record" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    title=$(echo "$record" | grep -o '"title":"[^"]*"' | cut -d'"' -f4)
    file=$(echo "$record" | grep -o '"file":"[^"]*"' | cut -d'"' -f4)

    if [[ -n "$id" && -n "$title" && -n "$file" ]]; then
        html_file="$PROJECT_ROOT/$file"

        if [[ -f "$html_file" ]]; then
            check_html_content "$html_file" "$title" "$id"
        else
            echo -e "${RED}❌ 文件不存在: $html_file${NC}"
            ((ERROR_COUNT++))
        fi
    fi

    echo ""
done

# 检查.md源文件是否存在
echo ""
echo "📄 检查 Markdown 源文件..."
echo ""

for html_file in "$RECORDS_DIR"/*.html; do
    if [[ -f "$html_file" ]]; then
        basename=$(basename "$html_file" .html)
        md_file="$RECORDS_DIR/${basename}.md"

        if [[ ! -f "$md_file" ]]; then
            echo -e "${YELLOW}⚠️  缺少源文件: $md_file${NC}"
            ((WARNING_COUNT++))
        fi
    fi
done

# 输出总结
echo ""
echo "==================================="
echo "📊 验证总结"
echo "==================================="
echo -e "错误数: ${RED}$ERROR_COUNT${NC}"
echo -e "警告数: ${YELLOW}$WARNING_COUNT${NC}"

if [[ $ERROR_COUNT -eq 0 && $WARNING_COUNT -eq 0 ]]; then
    echo -e "${GREEN}✅ 所有检查通过！${NC}"
    exit 0
elif [[ $ERROR_COUNT -eq 0 ]]; then
    echo -e "${YELLOW}⚠️  存在警告，请检查${NC}"
    exit 1
else
    echo -e "${RED}❌ 存在错误，必须修复${NC}"
    exit 2
fi
