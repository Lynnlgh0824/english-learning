# 📋 项目规则 (PROJECT_RULES)

> **English Learning TTS System** - 开发规范与工作流程

---

## 🎯 代码规范

### 文件命名约定

#### HTML 文件
- **学习记录**: `records/YYYY-MM-DD-{title}.html`
  - 示例: `2026-02-06-coming-home.html`
  - 使用小写字母，单词用连字符 `-` 连接

- **测试页面**: `test-{name}.html` 或 `{name}-test.html`
  - 示例: `test-tts.html`, `audio-test.html`

- **工具页面**: `{tool-name}.html`
  - 示例: `index.html`, `viewer.html`

#### JavaScript 文件
- **脚本**: `{name}.js` 或 `{name}-{purpose}.js`
  - 示例: `tts-common.js`, `debug-tts.js`

- **测试**: `test_{feature}.js` 或 `{feature}_test.js`
  - 示例: `test_tts_playback.js`, `tts_automated_test.js`

#### Markdown 文件
- **文档**: `{TOPIC}.md` 或 `{TOPIC}-GUIDE.md`
  - 使用大写字母表示重要文档
  - 示例: `README.md`, `TESTING.md`, `TTS-TEST.md`

---

## 🔄 Git 工作流

### 分支策略
```
main (主分支)
  ├── production-ready code
  ├── stable releases
  └── tags: v1.0.0, v1.1.0

feature/* (功能分支)
  ├── 新功能开发
  ├── Bug 修复
  └── 实验性功能
```

### 提交信息规范

#### 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关

#### 示例
```bash
feat(tts): add sentence-level pause control
- Implement smart sentence boundary detection
- Add configurable pause duration (1s default)
- Update UI with pause slider

Fixes #123

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

### 分支操作
```bash
# 创建功能分支
git checkout -b feature/tts-enhancement

# 开发完成后
git add .
git commit -m "feat(tts): add new feature"
git push origin feature/tts-enhancement

# 合并到主分支
git checkout main
git merge feature/tts-enhancement
```

---

## 📁 文件组织规范

### 目录结构
```
english-learning/
├── records/              # 学习记录（按日期分组）
├── scripts/              # 核心功能脚本
│   ├── tts-common.js    # TTS 主要功能
│   ├── tts-simple.js    # 简化版 TTS
│   └── debug-tts.js     # 调试工具
├── tests/                # 测试文件
│   ├── integration/     # 集成测试
│   └── e2e/             # 端到端测试
├── docs/                 # 项目文档
├── styles/               # 样式文件
├── archives/             # 归档文件
│   └── test-files/      # 历史测试文件
└── data.json            # 数据文件
```

### 文件职责
- **tts-common.js**: 核心 TTS 功能，所有页面共享
- **tts-simple.js**: 简化版本，用于快速测试
- **page-common.js**: 页面公共功能（导航、UI 等）
- **debug-tts.js**: TTS 调试专用工具

---

## 🎨 前端开发规范

### HTML 规范
```html
<!-- ✅ 推荐：语义化标签 -->
<article class="readable-paragraph">
  <p>Content here...</p>
</article>

<!-- ❌ 避免：过度嵌套 div -->
<div>
  <div>
    <div>
      <span>Content</span>
    </div>
  </div>
</div>
```

### CSS 规范
```css
/* ✅ 推荐：BEM 命名 */
.tts-panel { }
.tts-panel__header { }
.tts-panel__button { }
.tts-panel__button--primary { }

/* ✅ 推荐：有意义的类名 */
.readable-paragraph { }
.speaking { }

/* ❌ 避免：过于简短 */
.p1 { }
.red { }
```

### JavaScript 规范
```javascript
// ✅ 推荐：使用 const/let
const synthesis = window.speechSynthesis;
let currentParagraph = 0;

// ✅ 推荐：函数命名清晰
function playParagraph(index) { }
function pauseSpeech() { }

// ❌ 避免：全局变量污染
window.var1 = '';
window.var2 = '';

// ✅ 推荐：使用 IIFE 或模块
(function() {
  'use strict';
  // 私有作用域
})();
```

---

## 🧪 测试规范

### 测试优先级
1. **E2E 测试** - 完整用户流程
2. **集成测试** - TTS 功能测试
3. **单元测试** - 单个函数测试

### 测试文件命名
- `test_{feature}.js` - 功能测试
- `{feature}_test.js` - 备选命名
- `automated-e2e-test.js` - E2E 测试套件

### 测试覆盖
- ✅ 所有核心 TTS 功能
- ✅ 用户交互场景
- ✅ 错误处理
- ✅ 边界情况

---

## 📝 文档规范

### 文档类型
1. **README.md** - 项目主页
2. **TESTING.md** - 测试指南
3. **TTS-TEST.md** - TTS 调试指南
4. **PROJECT_RULES.md** - 本文档
5. **PROJECT_CONTEXT.md** - 项目上下文
6. **PROJECT_STRUCTURE.md** - 结构说明
7. **CHANGELOG.md** - 变更日志

### 文档编写
- 使用清晰的标题层级
- 提供代码示例
- 包含使用场景
- 及时更新维护

---

## 🔒 安全规范

### 敏感信息
- ❌ **绝不提交**:
  - API 密钥
  - 个人凭据
  - 环境变量 (.env)
  - 个人路径 (如 /Users/yourname/...)

- ✅ **应该提交**:
  - .env.example (模板文件)
  - 配置示例
  - 公开资源

### .gitignore
```gitignore
# 环境变量
.env
.env.local

# 个人文件
.DS_Store
*.swp
.*~

# 依赖
node_modules/
venv/

# IDE
.idea/
.vscode/
.claude/
```

---

## 🎯 代码审查清单

### 提交前检查
- [ ] 代码符合命名规范
- [ ] 添加必要的注释
- [ ] 移除调试代码
- [ ] 测试通过
- [ ] 更新相关文档
- [ ] 提交信息清晰
- [ ] 无敏感信息

### 功能检查
- [ ] TTS 播放正常
- [ ] 页面加载正常
- [ ] 响应式布局
- [ ] 错误处理完善
- [ ] 控制台无错误

---

## 📊 性能优化

### 关键指标
- **页面加载** < 2s
- **TTS 响应** < 100ms
- **语音加载** < 1s

### 优化策略
- 按需加载语音列表
- 防抖/节流用户操作
- 优化 DOM 操作
- 减少重排重绘

---

## 🤝 协作规范

### 沟通渠道
- **Issue** - Bug 报告和功能请求
- **PR** - 代码审查
- **Wiki** - 知识分享

### 代码审查
- 保持友好和建设性
- 提供具体改进建议
- 讨论技术方案
- 学习彼此优点

---

## 🔄 持续改进

### 定期审查
- 每月回顾代码质量
- 更新过时文档
- 清理冗余代码
- 优化项目结构

### 学习分享
- 记录重要决策
- 分享技术经验
- 维护知识库

---

**最后更新**: 2026-02-25
**维护者**: Project Team
