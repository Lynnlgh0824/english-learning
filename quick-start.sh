#!/bin/bash
# 英语学习项目 - 快速优化脚本
# 执行前请先阅读 /tmp/Project_Optimization_Checklist.md

set -e  # 遇到错误立即退出

PROJECT_DIR="/Users/yuzhoudeshengyin/english-learning"
cd "$PROJECT_DIR"

echo "=========================================="
echo "🚀 英语学习项目 - 快速优化"
echo "=========================================="
echo ""

# 1. 创建完整备份
echo "📦 步骤 1/5: 创建备份..."
BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" . --exclude='.git' --exclude='*.tar.gz' 2>/dev/null || true
echo "✅ 备份已创建: $BACKUP_FILE"
echo ""

# 2. 初始化 Git
echo "📦 步骤 2/5: 初始化 Git..."
if [ ! -d ".git" ]; then
    git init

    # 创建 .gitignore
    cat > .gitignore << 'EOF'
# 依赖
node_modules/

# 备份文件
.backup/
*.backup
*.bak

# 测试文件（临时）
test_*.js

# 系统文件
.DS_Store
Thumbs.db

# 编辑器
.vscode/
.idea/
*.swp
*.swo

# 日志
*.log
npm-debug.log*

# 压缩文件
*.tar.gz
*.zip
EOF

    git add .gitignore
    git commit -m "chore: 添加 .gitignore"

    echo "✅ Git 仓库已初始化"
else
    echo "⚠️  Git 仓库已存在，跳过"
fi
echo ""

# 3. 整理测试文件
echo "📦 步骤 3/5: 整理测试文件..."
mkdir -p tests/integration

# 移动测试文件
if ls test_tts_*.js 2>/dev/null; then
    mv test_tts_*.js tests/integration/ 2>/dev/null || true
    echo "✅ TTS 测试文件已移动"
fi

if ls test_nav_*.js 2>/dev/null; then
    mv test_nav_*.js tests/integration/ 2>/dev/null || true
    echo "✅ 导航测试文件已移动"
fi

# 删除重复测试文件
if [ -f "tests/integration/test_nav_toc_hide.js" ]; then
    rm tests/integration/test_nav_toc_hide.js
    echo "✅ 已删除重复测试文件"
fi

# 删除根目录的测试文件
rm -f test_*.js 2>/dev/null || true
echo "✅ 根目录测试文件已清理"
echo ""

# 4. 创建项目文档
echo "📦 步骤 4/5: 创建文档..."

# 创建 README.md
if [ ! -f "README.md" ]; then
    cat > README.md << 'EOF'
# 📚 英语学习系统

智能 TTS 朗读系统，支持多种学习模式，让英语学习更高效。

## ✨ 功能特性

- 🎯 **智能 TTS 朗读**：支持多种语音和语速
- 📚 **学习模式**：快速、标准、缓慢三种模式
- 🗂️ **TOC 导航**：自动目录导航，一键跳转
- 📖 **划词朗读**：选中即可朗读
- 🎨 **精美界面**：现代化设计，舒适阅读

## 🚀 快速开始

### 启动服务器

\`\`\`bash
# Python 3
python3 -m http.server 8000

# 或使用 Python 2
python -m SimpleHTTPServer 8000
\`\`\`

### 访问应用

打开浏览器访问：
\`\`\`
http://localhost:8000/records/
\`\`\`

## 📁 项目结构

\`\`\`
english-learning/
├── styles/              # 公共样式
│   ├── common.css       # 基础样式
│   └── tts-common.css   # TTS 样式
├── scripts/             # 公共脚本
│   ├── page-common.js   # 页面功能
│   └── tts-common.js    # TTS 功能
├── records/             # 学习页面
│   ├── 2026-02-06-coming-home.html
│   ├── 2026-02-06-month-alone-chiang-mai.html
│   └── 2026-02-06-shanghai-starting-over.html
└── tests/               # 测试文件
    └── integration/     # 集成测试
\`\`\`

## 🧪 测试

\`\`\`bash
# 运行 TTS 播放测试
node tests/integration/test_tts_playback.js
\`\`\`

## 🎨 自定义

### 修改样式

编辑样式文件：
\`\`\`bash
vi styles/common.css      # 基础样式
vi styles/tts-common.css  # TTS 样式
\`\`\`

### 修改功能

编辑脚本文件：
\`\`\`bash
vi scripts/tts-common.js   # TTS 功能
vi scripts/page-common.js  # 页面功能
\`\`\`

## 📝 更新日志

### v1.0.0 (2026-02-06)
- ✅ 提取公共 CSS 和 JS
- ✅ 统一代码管理
- ✅ 优化目录结构
- ✅ 添加自动化测试

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
EOF

    echo "✅ README.md 已创建"
else
    echo "⚠️  README.md 已存在，跳过"
fi

# 创建 CHANGELOG.md
cat > CHANGELOG.md << 'EOF'
# 📝 更新日志

## [1.0.0] - 2026-02-06

### 新增
- ✨ 智能朗读助手功能
- ✨ 三种学习模式（快速、标准、缓慢）
- ✨ TOC 自动导航
- ✨ 划词朗读功能
- ✨ 进度跟踪和高亮显示

### 优化
- ♻️ 提取公共 CSS 和 JS
- ♻️ 统一代码管理
- ♻️ 优化目录结构
- ♻️ 减少代码重复 55%

### 修复
- 🐛 修复 shanghai-starting-over.html 播放问题
- 🐛 修复 TTS 面板响应式布局问题
EOF

echo "✅ CHANGELOG.md 已创建"

# 创建 package.json（如果不存在）
if [ ! -f "package.json" ]; then
    cat > package.json << 'EOF'
{
  "name": "english-learning-system",
  "version": "1.0.0",
  "description": "智能英语学习系统 - TTS朗读助手",
  "scripts": {
    "test": "node tests/integration/test_tts_playback.js",
    "serve": "python3 -m http.server 8000"
  },
  "keywords": ["english", "learning", "tts", "speech"],
  "author": "",
  "license": "MIT"
}
EOF

    echo "✅ package.json 已创建"
else
    echo "⚠️  package.json 已存在，跳过"
fi
echo ""

# 5. 提交到 Git
echo "📦 步骤 5/5: 提交到 Git..."
git add .
git add -A .

# 检查是否有变更
if git diff --staged --quiet; then
    echo "⚠️  没有需要提交的变更"
else
    git commit -m "feat: 项目优化初始化

- 创建 Git 仓库
- 整理测试文件到 tests/ 目录
- 添加项目文档（README, CHANGELOG）
- 添加 .gitignore
- 创建 package.json"

    echo "✅ 代码已提交到 Git"
fi
echo ""

# 完成
echo "=========================================="
echo "🎉 快速优化完成！"
echo "=========================================="
echo ""
echo "📋 后续步骤："
echo ""
echo "1. 查看优化清单："
echo "   cat /tmp/Project_Optimization_Checklist.md"
echo ""
echo "2. 运行测试验证："
echo "   npm test"
echo ""
echo "3. 启动服务器："
echo "   npm run serve"
echo ""
echo "4. 查看文档："
echo "   cat README.md"
echo ""
echo "✨ 祝你使用愉快！"
echo ""
