# 🧪 自动化测试快速指南

**项目**: english-learning
**服务器**: http://localhost:8000

---

## 🚀 快速开始

### 方法 1：使用自动化测试运行器（推荐）⭐

访问: http://localhost:8000/archives/test-files/auto-test-runner.html

这个页面提供了完整的 TTS 自动化测试界面，可以：
- ✅ 自动测试所有学习页面
- ✅ 实时查看测试日志
- ✅ 显示测试进度和状态
- ✅ 自动生成测试报告

---

### 方法 2：使用 Puppeteer 集成测试

```bash
# 运行 TTS 播放功能测试
cd /Users/yuzhoudeshengyin/Documents/my_project/english-learning
node tests/integration/test_tts_playback.js
```

**测试内容**:
- 📄 自动加载学习页面
- 🔊 测试 TTS 初始化
- ▶️ 测试播放功能
- ⏸️ 测试暂停/继续
- 📊 生成测试报告

---

### 方法 3：浏览器控制台测试

#### 1️⃣ 基础 TTS 功能测试

访问任意学习页面（如 http://localhost:8000/records/2026-02-06-coming-home.html）

打开浏览器控制台（F12），粘贴以下代码：

```javascript
console.log('=== TTS功能测试 ===');

// 1. 语音加载测试
const voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
console.log(`✅ 英文语音数量: ${voices.length}`);

// 2. 播放功能测试
const playBtn = document.getElementById('playBtn');
console.log(`✅ 播放按钮存在: ${!!playBtn}`);

// 3. 语音选择器测试
const voiceSelect = document.getElementById('voiceSelect');
console.log(`✅ 语音选项: ${voiceSelect ? voiceSelect.options.length : 0}个`);

// 4. 段落初始化测试
console.log(`✅ 段落数量: ${window.paragraphs ? window.paragraphs.length : 0}`);
```

#### 2️⃣ 目录导航测试

```javascript
console.log('=== 目录导航测试 ===');

// TOC 检查
const toc = document.querySelector('.toc');
console.log(`✅ TOC 存在: ${!!toc}`);

// 目录项检查
const tocLinks = document.querySelectorAll('.toc a');
console.log(`✅ 目录链接数: ${tocLinks.length}`);

// 切换按钮检查
const toggleBtn = document.getElementById('tocToggleBtn');
console.log(`✅ 切换按钮存在: ${!!toggleBtn}`);
```

#### 3️⃣ 播放控制测试

```javascript
console.log('=== 播放控制测试 ===');

// 点击播放
document.getElementById('playBtn').click();
setTimeout(() => {
    console.log(`当前状态: ${document.getElementById('playText').textContent}`);
    console.log(`播放状态: ${window.isPlaying}`);
}, 1000);
```

---

## 📋 完整测试清单

### ✅ TTS 核心功能

- [x] TTS 面板显示正常
- [x] 播放按钮可点击
- [x] 暂停/继续功能正常
- [x] 语速调节功能正常
- [x] 语音选择功能正常
- [x] 段落高亮显示正常
- [x] 自动滚动功能正常

### ✅ 目录导航

- [x] TOC 显示正常
- [x] 目录链接可点击
- [x] 点击平滑滚动到目标
- [x] 当前章节高亮显示

### ✅ 学习模式

- [x] 快速模式 (1.2x)
- [x] 标准模式 (1.0x)
- [x] 缓慢模式 (0.8x)

---

## 🛠️ 测试工具

### 1. 自动诊断工具

```bash
# 在浏览器控制台运行
# (打开 /Users/yuzhoudeshengyin/Documents/my_project/english-learning/scripts/auto-diagnose.js 的内容)
```

### 2. TTS 调试工具

访问: http://localhost:8000/archives/test-files/test-debug.html

### 3. 音频输出测试

访问: http://localhost:8000/archives/test-files/test-audio-output.html

### 4. 用户手势测试

访问: http://localhost:8000/archives/test-files/test-user-gesture.html

---

## 📊 测试报告模板

```markdown
## TTS 测试报告

**测试时间**: 2026-02-25
**测试环境**: Chrome / macOS
**测试页面**: 所有学习记录

### 测试结果

✅ 通过:
- TTS 初始化
- 播放功能
- 暂停/继续
- 语速调节
- 语音选择

❌ 失败:
- (如果有)

### 问题记录

(如有问题，详细记录)
```

---

## 🔧 常见问题

### Q1: TTS 没有声音
**A**:
1. 检查系统音量
2. 检查浏览器是否允许自动播放
3. 查看控制台是否有错误

### Q2: 段落无法播放
**A**:
1. 运行自动诊断工具
2. 检查 window.paragraphs 是否初始化
3. 查看 TTS 状态信息

### Q3: 测试页面无法加载
**A**:
1. 确保服务器正在运行 (http://localhost:8000)
2. 检查文件路径是否正确
3. 查看浏览器控制台错误

---

## 📝 相关文档

- [TESTING.md](docs/TESTING.md) - 完整测试流程
- [TTS-TEST.md](docs/TTS-TEST.md) - TTS 调试指南
- [tests/integration/test_tts_playback.js](tests/integration/test_tts_playback.js) - 集成测试脚本

---

**更新时间**: 2026-02-25
**测试状态**: ✅ 可用
