# 🎧 英语学习 TTS 系统

> **智能文本转语音系统** - 支持多种学习模式、划词朗读、句子间停顿

[![GitHub stars](https://img.shields.io/github/stars/Lynnlgh0824/english-learning?style=social)](https://github.com/Lynnlgh0824/english-learning)
[![GitHub license](https://img.shields.io/github/license/Lynnlgh0824/english-learning)](https://github.com/Lynnlgh0824/english-learning)

---

## ✨ 核心功能

### 🎯 TTS 智能朗读
- ✅ **队列策略** - 解决浏览器自动播放策略限制
- ✅ **划词朗读** - 选中任意文本即可开始播放
- ✅ **句子间停顿** - 智能识别句子边界，添加自然停顿
- ✅ **三种学习模式** - 快速模式 (1.2x) / 标准模式 (1.0x) / 缓慢模式 (0.8x)
- ✅ **段落高亮** - 自动高亮当前朗读的段落
- ✅ **自动滚动** - 平滑滚动到当前播放位置
- ✅ **女声优先** - 自动筛选并优先推荐女声语音

### 📚 学习管理
- ✅ **多项目支持** - 管理多个学习项目
- ✅ **学习进度跟踪** - 记录每个段落的学习状态
- ✅ **快捷操作** - 键盘快捷键控制播放

### 📖 学习资源管理
- ✅ **自动生成学习工具包** - 支持 TED、YouTube、英文文章
- ✅ **H5 查看器** - 浏览所有学习记录
- ✅ **搜索和统计** - 快速查找学习内容
- ✅ **桌面快捷方式** - 一键打开学习系统

---

## 🚀 快速开始

### 方式一：直接打开（推荐）⭐

```bash
# 克隆仓库后，在浏览器中打开 index.html
open index.html

# 或者双击 index.html 文件
```

### 方式二：本地服务器

```bash
# 进入项目目录
cd english-learning

# 启动本地服务器（Python 3）
python3 -m http.server 8000

# 或者使用 Node.js
npx serve

# 然后在浏览器访问
# http://localhost:8000
```

### 方式三：使用 GitHub Pages（在线访问）

直接访问：https://lynnlgh0824.github.io/english-learning/（如果启用）

> 💡 **提示**：推荐使用方式二（本地服务器），可以避免浏览器安全策略限制。

---

## 🎮 TTS 使用指南

### 播放控制

- ▶️ **播放按钮** - 开始朗读或继续播放
- ⏸️ **暂停按钮** - 暂停当前朗读
- ⏹️ **停止按钮** - 停止朗读并重置

### 学习模式

- 🚀 **快速模式** - 1.2倍速，适合快速复习
- 📖 **标准模式** - 正常速度，适合精细学习
- 🐢 **缓慢模式** - 0.8倍速，适合难点理解

### 语音选择

- 自动筛选英文语音
- 女声优先显示在顶部
- 支持手动切换不同语音

### 划词朗读

1. 在页面中选中任意英文文本
2. 点击"播放"按钮
3. 系统自动从选中位置开始朗读

---

## 📂 项目结构

```
english-learning/
├── index.html                    # 主页面（TTS 查看器）
├── data.json                     # 学习记录索引
├── scripts/
│   ├── tts-common.js            # TTS 核心功能（队列策略）
│   ├── page-common.js           # 页面公共功能
│   └── validate-project.sh      # 项目验证脚本
├── styles/
│   ├── tts-common.css           # TTS 样式
│   └── common.css               # 公共样式
├── docs/
│   ├── PROJECT-SUMMARY.html     # 项目经验总结
│   └── README.md                # 文档说明
├── records/                     # 学习记录
│   ├── 2026-02-06-xxx.md        # Markdown 格式
│   └── 2026-02-06-xxx.html      # HTML 格式
└── tests/                       # 测试文件
    └── integration/
        └── test_tts_playback.js
```

---

## 🔧 技术实现

### 核心技术

- **Web Speech API** - 浏览器原生语音合成
- **队列策略** - 解决自动播放策略限制
- **变量作用域优化** - 统一使用 window 全局变量
- **类型转换处理** - parseInt() 处理 DOM 值

### 关键代码

**队列策略实现**：
```javascript
function enqueueAllParagraphs(startIndex) {
    if (window.synthesis.speaking) {
        window.synthesis.cancel();
    }

    // 在用户点击事件循环中一次性添加所有段落
    for (let i = startIndex; i < paragraphs.length; i++) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);  // 直接调用，不使用 setTimeout
    }
}
```

**划词朗读**：
```javascript
const selection = window.getSelection();
const selectedText = selection.toString().trim();

if (selectedText.length > 0) {
    // 找到选中段落索引
    const parentElement = selection.anchorNode.parentElement;
    const index = paragraphsElements.indexOf(parentElement);
    currentParagraphIndex = index;
}
```

---

## 🐛 已知问题与解决方案

### 1. 浏览器自动播放策略
**问题**：`not-allowed` 错误，无法播放音频
**解决**：实现队列策略，在用户点击事件循环中添加所有 utterance

### 2. 变量作用域
**问题**：`enhancedVoices` 未定义
**解决**：统一使用 `window.enhancedVoices`

### 3. 类型转换
**问题**：`voiceSelect.value` 返回字符串，用作数组索引
**解决**：添加 `parseInt(voiceSelect.value, 10)`

---

## 📊 性能优化

- ✅ 删除903行重复代码
- ✅ 提取公共脚本和样式
- ✅ 添加防抖处理
- ✅ 优化语音加载

---

## 🧪 测试

### 自动化测试

```bash
# 运行自动化测试
open /Users/yuzhoudeshengyin/Documents/my_project/english-learning/auto-test-runner.html
```

### 测试覆盖

- ✅ 浏览器 API 支持
- ✅ 语音列表加载
- ✅ 系统音频输出
- ✅ 用户交互播放
- ✅ 连续播放测试
- ✅ 错误处理机制

---

## 📝 开发历程

- **2025-02-06** - TTS 系统优化并推送到 GitHub
  - 实现队列策略
  - 修复变量作用域和类型转换问题
  - 删除重复代码
  - 创建项目经验总结文档

详见：[PROJECT-LOG.md](../PROJECT-LOG.md)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 🔗 相关链接

- **GitHub 仓库**：[https://github.com/Lynnlgh0824/english-learning](https://github.com/Lynnlgh0824/english-learning)
- **项目经验总结**：[docs/PROJECT-SUMMARY.html](docs/PROJECT-SUMMARY.html)
- **开发日志**：[PROJECT-LOG.md](../PROJECT-LOG.md)

---

**享受学习！** 🎧✨

### 方式一：桌面快捷方式（最简单）⭐

**位置**：你的桌面

**使用方法**：
1. 双击桌面上的 **"打开英语学习"** 图标
2. 浏览器会自动打开学习查看器
3. 点击"➕ 添加新学习"按钮查看如何添加学习

**适合**：日常快速查看学习记录

---

### 方式二：命令行快捷方式

**打开查看器**：
```bash
# 在终端运行
open ~/english-learning/index.html
```

**添加新学习**：
```bash
# 在 Claude Code 中运行
/learn-english [任何英语内容URL]
```

**示例**：
```bash
/learn-english https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action
/learn-english https://www.youtube.com/watch?v=66MgD1FAZDA
```

---

### 方式三：使用快捷技能

**运行**：
```
/english-viewer
```

这个技能会：
- ✅ 自动打开查看器
- ✅ 显示学习统计
- ✅ 提供添加新学习的说明

---

## 📱 在手机上查看

### 方法一：本地服务器（推荐）

```bash
# 1. 在电脑上运行
cd ~/english-learning
python3 -m http.server 8000

# 2. 在手机浏览器访问
http://[你的电脑IP]:8000

# 查看电脑IP
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### 方法二：同步到云存储

将 `~/english-learning` 文件夹同步到：
- iCloud Drive
- Dropbox
- Google Drive
- OneDrive

然后在手机上打开 `index.html`

---

## 🎨 查看器功能

### 1. 统计面板 📊
- 学习记录总数
- 累计学习词汇数
- 累计学习小时数

### 2. 搜索功能 🔍
- 实时搜索学习记录
- 支持标题和内容搜索

### 3. 学习卡片 📇
- 显示学习类型（TED/YouTube/文章）
- 预览学习内容
- 显示词汇和表达数量
- 点击查看完整内容

### 4. 添加新学习 ➕
- 点击"添加新学习"按钮
- 查看详细的使用说明
- 支持 TED、YouTube、英文文章

---

## 📂 文件结构

```
~/english-learning/
├── index.html              # H5 查看器主页面
├── data.json               # 学习记录索引
├── README.md               # 使用说明（本文件）
└── records/                # 学习记录文件夹
    ├── 2025-02-05-xxx.md   # Markdown 格式
    └── 2025-02-05-xxx.html # HTML 格式

桌面快捷方式：
└── 打开英语学习.app/       # macOS 应用程序
```

---

## 💡 使用流程示例

### 第一次使用

1. **打开查看器**
   - 双击桌面的"打开英语学习"

2. **添加第一个学习**
   - 在 Claude Code 中运行：
     ```bash
     /learn-english https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action
     ```

3. **等待生成**
   - Claude 会生成完整的学习工具包
   - 自动保存到 `~/english-learning/records/`
   - 自动更新索引

4. **查看学习记录**
   - 刷新浏览器页面
   - 点击卡片查看详细内容

---

### 日常学习流程

1. **找到想学习的内容**
   - TED 演讲
   - YouTube 视频
   - 英文文章

2. **生成学习工具包**
   ```bash
   /learn-english [URL]
   ```

3. **系统学习**
   - 内容总览
   - 核心词汇（20个）
   - 地道表达（15个）
   - 句型解析（8个）
   - 练习题和测验

4. **复习巩固**
   - 打开查看器
   - 搜索关键词
   - 点击卡片复习
   - 完成练习题

---

## 🎯 快捷命令参考

| 命令 | 功能 |
|------|------|
| 双击桌面图标 | 打开学习查看器 |
| `/learn-english [URL]` | 添加新学习 |
| `/english-viewer` | 打开查看器+统计 |
| `open ~/english-learning/index.html` | 命令行打开查看器 |

---

## 📈 学习建议

### 每天30分钟学习计划

**第1-2天**：
- 学习内容总览
- 掌握10个核心词汇

**第3-4天**：
- 学习10个地道表达
- 分析4个句型

**第5天**：
- 完成练习题
- 复习巩固

### 周末复习

1. 打开查看器
2. 回顾本周所有学习记录
3. 重点复习难点词汇和表达
4. 完成未做的练习题

---

## 🔄 自动更新

每次使用 `/learn-english` 后：
- ✅ 自动创建学习记录（MD + HTML）
- ✅ 自动更新索引（data.json）
- ✅ 刷新浏览器即可看到新记录

---

## 🆘 常见问题

### Q: 桌面图标无法打开？
A: 确保有权限：
```bash
chmod +x ~/Desktop/打开英语学习.app/Contents/MacOS/open-english-learning
```

### Q: 查看器显示"还没有学习记录"？
A: 需要先使用 `/learn-english` 添加学习内容

### Q: 如何删除学习记录？
A: 删除 `~/english-learning/records/` 中的文件，然后手动更新 `data.json`

### Q: 如何备份学习记录？
A: 复制整个 `~/english-learning` 文件夹即可

---

## 🎉 开始使用

1. **双击桌面图标** - 打开学习查看器
2. **添加第一个学习** - 使用 `/learn-english`
3. **享受学习过程** - 系统化学习英语

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看本说明文档
2. 检查文件路径是否正确
3. 确保有足够的磁盘空间

---

**祝你学习愉快！** 📚✨
