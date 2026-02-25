# 英语学习项目结构

## 📁 核心文件
- `index.html` - 主应用入口
- `README.md` - 项目说明

## 📁 目录结构
```
english-learning/
├── index.html          # 主应用
├── README.md           # 项目说明
├── server.py           # Python服务器（可选）
├── start-server.sh     # 启动脚本（可选）
├── quick-start.sh      # 快速启动脚本
├── data/               # 数据文件
├── records/            # 学习记录（HTML格式）
├── scripts/            # 功能脚本
│   ├── tts-*.js       # TTS相关脚本
│   ├── page-common.js # 页面通用脚本
│   └── auto-diagnose.js
├── styles/             # 样式文件
├── tests/              # 测试文件
├── docs/               # 项目文档
└── archives/           # 归档文件
    └── test-files/     # 测试文件归档
```

## 📦 已清理文件（移至 archives/test-files/）
- test-*.html（15个测试页面）
- test-*.js（21个测试脚本）
- tts_*.js（TTS测试脚本）
- diagnose_paragraphs.js
- auto-diagnose.html
- auto-test-runner.html
- verify-fix.html

## 📚 文档（移至 docs/）
- BUG-REPORT-TEMPLATE.md
- COMMUNICATION-PROTOCOL.md
- DEVELOPMENT-PROCESS.md
- IMPROVEMENT-GUIDE.md
- PROJECT-LESSONS-LEARNED.md
- REQUIREMENT-TEMPLATE.md
- TESTING.md
- 其他开发文档

## 🚀 使用方式
1. **桌面快捷方式**: 双击 `📚英语学习.app`
2. **手动启动**: 运行 `start-server.sh` 或 `python3 -m http.server 8000`
3. **访问**: 打开浏览器访问 http://localhost:8000

## 📝 更新日期
2026-02-06 - 合并代码，清理测试文件，重组目录结构
