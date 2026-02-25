#!/bin/bash

# 提交其他项目的 .gitignore 更新
# 使用方法: ./commit-other-projects.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "📤 提交其他项目的 .gitignore 更新"
echo "==========================================${NC}"
echo ""

PROJECTS=(
    "/Users/yuzhoudeshengyin/Documents/my_project/project summary"
    "/Users/yuzhoudeshengyin/Documents/my_project/Chiengmai"
    "/Users/yuzhoudeshengyin/Documents/my_project/aisaasvideo"
    "/Users/yuzhoudeshengyin/Documents/my_project/clawdbot-railway-template"
)

for PROJECT in "${PROJECTS[@]}"; do
    if [ ! -d "$PROJECT/.git" ]; then
        echo -e "${YELLOW}⚠️  跳过（不是 Git 仓库）: $(basename $PROJECT)${NC}"
        continue
    fi

    PROJECT_NAME=$(basename "$PROJECT")
    echo -e "${BLUE}📁 处理: ${PROJECT_NAME}${NC}"

    cd "$PROJECT"

    # 检查是否有变更
    if git diff --quiet .gitignore; then
        echo -e "  ${YELLOW}⚠️  .gitignore 没有变更，跳过${NC}"
        echo ""
        continue
    fi

    # 提交更新
    git add .gitignore
    git commit -m "chore: update .gitignore to professional team standards

应用专业团队标准 .gitignore

新增保护:
- AI 模型文件 (*.gguf, *.bin, *.pt, *.safetensors)
- 完整的环境变量保护
- AI 编辑器本地数据 (.cursor/, .claude/)
- 密钥凭证保护 (credentials.*, private.*)

批量更新时间: 2026-02-25"

    echo -e "  ${GREEN}✅ 已提交${NC}"

    # 询问是否推送
    echo -n "  是否推送到远程? (y/n): "
    read -r answer < /dev/tty
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        git push
        echo -e "  ${GREEN}✅ 已推送${NC}"
    else
        echo -e "  ${YELLOW}⚠️  跳过推送${NC}"
    fi

    echo ""
done

echo -e "${GREEN}=========================================="
echo "✨ 处理完成"
echo "==========================================${NC}"
