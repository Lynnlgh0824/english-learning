#!/bin/bash

# 批量更新所有项目的 .gitignore
# 使用方法: ./update-all-gitignores.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================="
echo "🔒 批量更新 .gitignore"
echo "==========================================${NC}"
echo ""

# 标准模板
STANDARD_GITIGNORE="#################################################
# 🔒 核心安全：环境变量（绝对禁止提交）
#################################################

.env
.env.*
.env.local
.env.development
.env.production
.env.test

*.env

#################################################
# 🔒 密钥与凭证（最高优先级）
#################################################

*.pem
*.key
*.p12
*.pfx
*.crt
*.csr

credentials.json
secrets/

#################################################
# 🔒 AI 编辑器本地数据
#################################################

.cursor/
.cursor/*
.cursor-cache/

.claude/
.claude/*

#################################################
# 编辑器
#################################################

.vscode/
.idea/
*.swp
*.swo
*~

#################################################
# macOS 系统文件
#################################################

.DS_Store
.AppleDouble
.LSOverride
._*
.Spotlight-V100
.Trashes

#################################################
# 日志文件
#################################################

*.log
logs/

#################################################
# Node.js
#################################################

node_modules/
.npm/

#################################################
# 构建输出
#################################################

dist/
build/
out/
.cache/

#################################################
# 数据库文件
#################################################

*.sqlite
*.sqlite3
*.db

#################################################
# 临时文件
#################################################

tmp/
temp/
*.tmp
*.backup
*.bak

#################################################
# Python
#################################################

__pycache__/
*.pyc
*.pyo
venv/
.venv/

#################################################
# 本地配置文件
#################################################

config.local.json

#################################################
# 压缩文件
#################################################

*.zip
*.tar
*.gz
*.rar

#################################################
# 保留模板
#################################################

!.env.example
!.env.template

#################################################
# Gitignore itself
#################################################

!.gitignore
"

# 项目列表
PROJECTS=(
    "/Users/yuzhoudeshengyin/Documents/my_project/project summary"
    "/Users/yuzhoudeshengyin/Documents/my_project/Chiengmai"
    "/Users/yuzhoudeshengyin/Documents/my_project/aisaasvideo"
    "/Users/yuzhoudeshengyin/Documents/my_project/clawdbot-railway-template"
)

UPDATED=0
SKIPPED=0
ERRORS=0

for PROJECT in "${PROJECTS[@]}"; do
    if [ ! -d "$PROJECT" ]; then
        echo -e "${YELLOW}⚠️  跳过不存在: $PROJECT${NC}"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    PROJECT_NAME=$(basename "$PROJECT")
    echo -e "${BLUE}📁 处理项目: ${PROJECT_NAME}${NC}"

    cd "$PROJECT" || {
        echo -e "${RED}❌ 无法进入目录${NC}"
        ERRORS=$((ERRORS + 1))
        continue
    }

    # 备份现有 .gitignore
    if [ -f ".gitignore" ]; then
        cp .gitignore .gitignore.backup.$(date +%Y%m%d_%H%M%S)
        echo -e "  ${YELLOW}📦 已备份现有 .gitignore${NC}"
    fi

    # 写入标准模板
    echo "$STANDARD_GITIGNORE" > .gitignore

    # 添加项目特定规则
    if [ -f "package.json" ]; then
        # Node.js 项目
        cat >> .gitignore << 'EOF'

#################################################
# Node.js 特定
#################################################

package-lock.json
yarn-error.log
.pnpm-store/
EOF
    fi

    if [ -f "requirements.txt" ] || [ -f "setup.py" ]; then
        # Python 项目
        cat >> .gitignore << 'EOF'

#################################################
# Python 特定
#################################################

*.egg-info/
.eggs/
.pytest_cache/
.coverage
htmlcov/
EOF
    fi

    echo -e "  ${GREEN}✅ .gitignore 已更新${NC}"
    UPDATED=$((UPDATED + 1))
    echo ""
done

echo -e "${GREEN}=========================================="
echo "✨ 更新完成"
echo "==========================================${NC}"
echo ""
echo -e "统计:"
echo -e "  ${GREEN}✅ 已更新: $UPDATED${NC}"
echo -e "  ${YELLOW}⚠️  已跳过: $SKIPPED${NC}"
echo -e "  ${RED}❌ 错误: $ERRORS${NC}"
echo ""
echo -e "${BLUE}💡 提示:${NC}"
echo "  1. 检查每个项目的 .gitignore.backup.* 文件"
echo "  2. 确认没有遗漏重要规则"
echo "  3. 运行 'git status' 检查是否还有敏感文件"
echo ""
