# 📁 项目结构 (PROJECT_STRUCTURE)

> **English Learning TTS System** - 完整的目录组织说明

---

## 🌲 目录树

```
english-learning/
├── 📄 核心文件
│   ├── index.html                   # 🏠 项目主页
│   ├── unified-test-center.html     # 🧪 统一测试中心
│   ├── test-center.html             # 🧪 旧测试中心（兼容）
│   ├── project-log.html             # 📊 项目日志
│   ├── data.json                    # 💾 学习数据
│   └── README.md                    # 📖 项目说明
│
├── 📚 学习记录 (records/)
│   ├── 2026-02-06-coming-home.html              # 🏠 Coming Home
│   ├── 2026-02-06-month-alone-chiang-mai.html   # 🏝️ Month Alone in Chiang Mai
│   ├── 2026-02-06-shanghai-starting-over.html   # 🏢 Shanghai Starting Over
│   └── 2026-02-06-youtube-entrepreneurship.html # 🎥 YouTube Entrepreneurship
│
├── 🔧 核心脚本 (scripts/)
│   ├── tts-common.js                # 🎯 TTS 核心功能（1,133 行）
│   ├── tts-simple.js                # 🎯 简化版 TTS（183 行）
│   ├── debug-tts.js                 # 🔍 TTS 调试工具
│   ├── page-common.js               # 📄 页面公共功能
│   ├── auto-diagnose.js             # 🤖 自动诊断脚本
│   ├── cleanup-tests.sh             # 🧹 测试文件清理脚本
│   └── validate-project.sh          # ✅ 项目验证脚本
│
├── 🧪 测试文件 (tests/)
│   ├── automated-e2e-test.js        # 🤖 E2E 端到端测试
│   ├── e2e-test-runner.html         # 🎮 E2E 测试控制台（Web 界面）
│   └── integration/
│       └── test_tts_playback.js     # 🔊 TTS 集成测试
│
├── 📂 归档文件 (archives/)
│   └── test-files/                  # 🗄️ 历史测试文件（35+ 个）
│       ├── auto-diagnose.html
│       ├── auto-test-runner.html
│       ├── test-debug.html
│       ├── test-tts.html
│       └── ...
│
├── 📖 文档 (docs/)
│   ├── TESTING.md                   # 🧪 测试指南
│   ├── TTS-TEST.md                  # 🔊 TTS 调试指南
│   ├── QUICK_GUIDE.md               # ⚡ 快速上手
│   ├── DEVELOPMENT-PROCESS.md       # 🔄 开发流程
│   ├── PROJECT-STATUS.md            # 📊 项目状态
│   └── ...                          # 其他文档
│
├── 🎨 样式文件 (styles/)
│   ├── common.css                   # 📄 通用样式
│   └── tts-common.css               # 🔊 TTS 样式
│
├── 📜 项目文档（根目录）
│   ├── PROJECT_RULES.md             # 📋 项目规则
│   ├── PROJECT_CONTEXT.md           # 📖 项目上下文
│   ├── PROJECT_STRUCTURE.md         # 📁 项目结构（本文档）
│   ├── STRUCTURE.md                 # 📁 简化结构说明
│   ├── CHANGELOG.md                 # 📝 变更日志
│   └── FULL_BACKUP.md               # 💾 完整备份
│
├── ⚙️ 配置文件
│   ├── .gitignore                   # 🔒 Git 忽略规则
│   ├── server.py                    # 🐍 Python 服务器
│   └── start-server.sh              # 🚀 启动脚本
│
└── 🗑️ 临时/备份文件
    ├── .gitignore.backup.*          # 备份文件
    └── test-diagnose-simple.html    # 简单测试页面
```

---

## 📂 详细说明

### 🏠 根目录文件

#### index.html
**项目主页** - 学习系统的入口
- 显示所有学习项目
- 快速导航功能
- 系统状态概览

#### unified-test-center.html
**统一测试中心** - 所有测试的集中入口
- 5 个标签页：概览、TTS、页面、E2E、工具
- 实时日志显示
- 测试进度跟踪

#### data.json
**学习数据存储**
```json
{
  "projects": [
    {
      "title": "Coming Home",
      "file": "records/2026-02-06-coming-home.html",
      "date": "2026-02-06",
      "topics": ["family", "home"],
      "progress": 0
    }
  ]
}
```

---

### 📚 records/ - 学习记录目录

#### 命名规范
```
YYYY-MM-DD-{title}.html
```

#### 文件结构
每个学习记录 HTML 包含：
- 📝 完整的英文转录
- 🇨🇳 中文翻译
- 🎯 生词表
- 🔊 TTS 朗读功能
- 📋 目录导航
- 🎨 段落样式

#### 现有学习包
| 标题 | 主题 | 字数 | 难度 |
|------|------|------|------|
| Coming Home | 家庭、归属感 | 2,500 | ⭐⭐ |
| Month Alone in Chiang Mai | 独居生活 | 2,300 | ⭐⭐⭐ |
| Shanghai Starting Over | 新的开始 | 2,200 | ⭐⭐⭐⭐ |
| YouTube Entrepreneurship | 创业 | 2,000 | ⭐⭐⭐⭐⭐ |

---

### 🔧 scripts/ - 核心脚本目录

#### tts-common.js (1,133 行)
**TTS 核心功能模块**
```javascript
主要功能：
├── 语音管理
│   ├── initVoices()          # 语音列表初始化
│   ├── loadVoices()          # 异步加载语音
│   └── filterEnglishVoices() # 筛选英文语音
│
├── 播放控制
│   ├── startSpeech()         # 开始播放
│   ├── pauseSpeech()         # 暂停播放
│   ├── stopSpeech()          # 停止播放
│   └── playParagraph()       # 播放指定段落
│
├── 学习模式
│   ├── quick mode (1.2x)     # 快速模式
│   ├── standard mode (1.0x)  # 标准模式
│   └── intensive mode (0.8x) # 缓慢模式
│
├── 划词朗读
│   ├── initSelectionMonitor()# 监听文本选择
│   └── playSelection()       # 播放选中内容
│
└── UI 更新
    ├── updateStatus()        # 更新状态提示
    ├── updateProgress()      # 更新进度条
    └── highlightParagraph()  # 高亮当前段落
```

#### tts-simple.js (183 行)
**简化版 TTS** - 用于快速测试
- 核心播放功能
- 最小化依赖
- 易于调试

#### debug-tts.js (148 行)
**TTS 调试工具**
- 完整的错误日志
- 性能监控
- 状态诊断

---

### 🧪 tests/ - 测试目录

#### automated-e2e-test.js
**端到端自动化测试**
```javascript
测试套件：
├── 页面基础测试
│   ├── 页面加载
│   ├── 元素检查
│   └── 标题验证
│
├── TTS 功能测试
│   ├── API 支持
│   ├── 语音列表
│   ├── 播放按钮
│   └── 可朗读段落
│
└── 用户体验测试
    ├── 响应式布局
    ├── 可访问性
    └── 页面性能
```

#### e2e-test-runner.html
**E2E 测试 Web 控制台**
- 可视化测试界面
- 实时日志显示
- 测试进度跟踪
- 测试报告查看

---

### 📂 archives/ - 归档目录

#### test-files/ (35+ 文件)
**历史测试文件** - 已整合到统一测试中心

保留的核心文件：
- `auto-diagnose.html` - 自动诊断工具
- `auto-test-runner.html` - 自动测试运行器
- `test-debug.html` - TTS 深度调试
- `test-audio-output.html` - 音频输出测试

待归档的文件：
- 15 个 TTS 测试脚本
- 8 个导航测试脚本
- 6 个旧测试页面

---

### 📖 docs/ - 文档目录

#### TESTING.md (1,216 行)
**完整测试指南**
- 测试环境搭建
- 测试用例说明
- 调试技巧
- 常见问题解决

#### TTS-TEST.md
**TTS 调试专用**
- TTS 原理解析
- 常见错误排查
- 浏览器兼容性
- 性能优化建议

#### QUICK_GUIDE.md
**快速上手**
- 5 分钟入门
- 核心功能介绍
- 常用操作说明

---

## 🔄 文件关系图

```
┌─────────────────────────────────────────┐
│           用户界面层                    │
│  ┌──────────┐  ┌─────────────────┐      │
│  │index.html│  │records/*.html   │      │
│  └────┬─────┘  └────────┬────────┘      │
│       │                 │                │
└───────┼─────────────────┼────────────────┘
        │                 │
        ↓                 ↓
┌─────────────────────────────────────────┐
│           脚本层                        │
│  ┌─────────────────────────────────┐   │
│  │scripts/tts-common.js (核心)    │   │
│  │scripts/tts-simple.js (简化)    │   │
│  │scripts/page-common.js (页面)   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
        │                 │
        ↓                 ↓
┌─────────────────────────────────────────┐
│           样式层                        │
│  ┌─────────────────────────────────┐   │
│  │styles/tts-common.css            │   │
│  │styles/common.css                │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
        │                 │
        ↓                 ↓
┌─────────────────────────────────────────┐
│           测试层                        │
│  ┌─────────────────────────────────┐   │
│  │tests/automated-e2e-test.js      │   │
│  │tests/e2e-test-runner.html       │   │
│  │tests/integration/test_tts_*.js  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 📊 文件大小统计

```
类别          文件数    代码行数    大小
─────────────────────────────────────
HTML 文件      25+      8,000+     ~500 KB
JavaScript      15+      3,000+     ~150 KB
CSS              5+      1,500+     ~80 KB
测试文件        35+      4,000+     ~200 KB
文档            20+      8,000+     ~400 KB
─────────────────────────────────────
总计           100+     24,500+    ~1.3 MB
```

---

## 🔍 快速导航

### 我想...

#### 添加新的学习记录
→ 复制 `records/` 中任意文件
→ 按命名规范重命名
→ 修改内容

#### 调试 TTS 问题
→ 打开 `docs/TTS-TEST.md`
→ 使用 `archives/test-files/test-debug.html`
→ 查看 `scripts/debug-tts.js`

#### 运行测试
→ Web 界面: `unified-test-center.html`
→ 命令行: `node tests/automated-e2e-test.js`
→ E2E 控制: `tests/e2e-test-runner.html`

#### 添加新功能
→ 阅读规范: `PROJECT_RULES.md`
→ 了解背景: `PROJECT_CONTEXT.md`
→ 参考结构: `PROJECT_STRUCTURE.md` (本文档)

---

## 🛠️ 维护建议

### 定期清理
- **每周**: 清理临时文件、测试截图
- **每月**: 归档旧测试文件到 `archives/`
- **每季度**: 审查和删除无用文件

### 文件更新
- 修改功能后 → 更新 `CHANGELOG.md`
- 添加新文件 → 更新本文档
- 改进结构 → 同步 `STRUCTURE.md`

---

**文档版本**: v1.0.0
**最后更新**: 2026-02-25
**维护者**: Project Team
