# 英语学习 TTS 系统 - 代码规范

> **版本**: v1.0
> **更新时间**: 2026-02-27
> **适用于**: 英语学习 TTS 系统

---

## 📖 规范概述

本规范参考 [Hango 代码规范](https://hango-io.github.io/developer-guide/code/coding-guide/)，结合原生 JavaScript 项目实际情况制定。

---

## 🎯 核心原则

### 1. 原生 JavaScript 优先

使用现代 ES6+ 特性，避免依赖重型框架。

### 2. 渐进增强

确保核心功能在不支持某些 API 的浏览器中也能降级运行。

### 3. 可访问性

TTS 系统应支持键盘操作和屏幕阅读器。

---

## 📝 命名规范

### 变量和函数

```javascript
// ✅ 推荐：小驼峰，语义明确
const currentParagraph = 0;
const isPlaying = false;
function playParagraph(index) { }
function pausePlayback() { }

// ❌ 避免：无意义命名
const x = 0;
const flag = false;
function doIt() { }
```

**命名建议：**
- **播放状态**: is/has 开头 `isPlaying`, `hasAudio`
- **播放控制**: 动词开头 `play()`, `pause()`, `stop()`, `skip()`
- **数据获取**: fetch/get 开头 `fetchText()`, `getSettings()`

### 常量

```javascript
// ✅ 推荐：全大写下划线
const DEFAULT_SPEED = 1.0;
const STORAGE_KEY = 'english_learning_data';
const SUPPORTED_LANGUAGES = ['en-US', 'en-GB'];

// ❌ 避免
const defaultSpeed = 1.0;
const storageKey = '...';
```

### 类和模块

```javascript
// ✅ 推荐：大驼峰
class TextToSpeech { }
class LearningProject { }

// 模块文件名：TextToSpeech.js, LearningProject.js
```

---

## 🧩 函数规范

### 1. 拒绝超大函数

**规则**: 函数不超过 50 行

```javascript
// ❌ 避免：超大函数
function initializeApp() {
  // 100+ 行代码...
}

// ✅ 推荐：拆分为小函数
function initializeApp() {
  loadSettings();
  setupEventListeners();
  initializeTTS();
  renderProjects();
}

function loadSettings() { }
function setupEventListeners() { }
function initializeTTS() { }
function renderProjects() { }
```

### 2. 控制圈复杂度

**规则**: 圈复杂度不超过 15

```javascript
// ❌ 避免：高圈复杂度
function getVoiceSpeed(user, text, project) {
  if (user.isPremium) {
    if (text.length > 1000) {
      if (project.difficulty === 'advanced') {
        // 更多嵌套...
      }
    }
  }
}

// ✅ 推荐：提前返回
function getVoiceSpeed(user, text, project) {
  if (!user || !text) return DEFAULT_SPEED;
  if (user.isPremium && text.length > 1000) return getAdvancedSpeed(project);
  return getNormalSpeed(project);
}
```

### 3. 减少函数入参

**规则**: 参数不超过 5 个

```javascript
// ❌ 避免：参数过多
function createProject(title, content, language, speed, pitch, volume) { }

// ✅ 推荐：使用对象参数
function createProject({ title, content, language, speed, pitch, volume }) { }

// 调用更清晰
createProject({
  title: 'TED Talk',
  content: '...',
  language: 'en-US',
  speed: 1.0,
  pitch: 1.0,
  volume: 1.0
});
```

### 4. API 检测与降级

```javascript
// ✅ 推荐：功能检测，优雅降级
function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  } else {
    // 降级方案：显示文本或提示
    showUnsupportedMessage('您的浏览器不支持语音合成');
  }
}

// ❌ 避免：假设 API 存在
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text); // 可能报错
  speechSynthesis.speak(utterance);
}
```

---

## 💾 数据管理规范

### LocalStorage 使用

```javascript
// ✅ 推荐：封装存储操作
const Storage = {
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('读取失败:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('保存失败:', e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  }
};

// 使用
const projects = Storage.get(STORAGE_KEY.PROJECTS, []);
Storage.set(STORAGE_KEY.PROJECTS, projects);
```

### 数据结构

```javascript
// ✅ 推荐：统一数据结构
const projectData = {
  version: '1.0',
  created: '2024-02-27',
  updated: '2024-02-27',
  projects: [
    {
      id: '1',
      title: 'TED Talk: How to learn a language',
      content: '...',
      language: 'en-US',
      voice: 'Google US English',
      speed: 1.0,
      pitch: 1.0,
      currentIndex: 0,
      status: 'in_progress',
      tags: ['ted', 'education'],
      createdAt: '2024-02-27',
      lastPlayedAt: '2024-02-27'
    }
  ]
};
```

---

## 🎵 Web Speech API 规范

### 语音合成

```javascript
// ✅ 推荐：封装 TTS 操作
class TextToSpeech {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.voices = [];
    this.loadVoices();
  }

  loadVoices() {
    // voiceschanged 事件确保语音列表加载完成
    this.synthesis.onvoiceschanged = () => {
      this.voices = this.synthesis.getVoices();
    };
  }

  speak(text, options = {}) {
    // 停止当前播放
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.getVoice(options.voiceURI);
    utterance.rate = options.speed || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.lang = options.language || 'en-US';

    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => options.onEnd?.();
    utterance.onerror = (e) => options.onError?.(e);

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  pause() {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  stop() {
    this.synthesis.cancel();
  }

  getVoice(voiceURI) {
    return this.voices.find(voice => voice.voiceURI === voiceURI)
      || this.voices.find(voice => voice.lang.startsWith('en'))
      || this.voices[0];
  }
}

// 使用
const tts = new TextToSpeech();
tts.speak('Hello world', {
  voiceURI: 'Google US English',
  speed: 1.0,
  onStart: () => console.log('开始播放'),
  onEnd: () => console.log('播放结束')
});
```

---

## ⌨️ 键盘事件规范

```javascript
// ✅ 推荐：统一键盘快捷键管理
const KeyboardShortcuts = {
  SHORTCUTS: {
    ' ': 'togglePlayPause',
    'ArrowLeft': 'previousParagraph',
    'ArrowRight': 'nextParagraph',
    'Digit1': () => setSpeed(0.8),
    'Digit2': () => setSpeed(1.0),
    'Digit3': () => setSpeed(1.2),
    'Escape': 'closeModal'
  },

  init() {
    document.addEventListener('keydown', (e) => {
      // 忽略输入框中的按键
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const action = this.SHORTCUTS[e.key];
      if (action) {
        e.preventDefault();
        if (typeof action === 'function') {
          action();
        } else {
          this[action]?.();
        }
      }
    });
  }
};
```

---

## 🎨 DOM 操作规范

```javascript
// ✅ 推荐：使用事件委托
document.querySelector('.paragraphs-container').addEventListener('click', (e) => {
  const paragraph = e.target.closest('.paragraph');
  if (paragraph) {
    const index = parseInt(paragraph.dataset.index);
    playParagraph(index);
  }
});

// ❌ 避免：为每个元素单独绑定事件
paragraphs.forEach((p, index) => {
  p.addEventListener('click', () => playParagraph(index));
});
```

---

## 💬 注释规范

### JSDoc 风格

```javascript
// ✅ 推荐：JSDoc 注释
/**
 * 播放指定段落
 * @param {number} index - 段落索引
 * @param {Object} options - 播放选项
 * @param {number} [options.speed=1.0] - 播放速度
 * @param {string} [options.voice] - 语音 URI
 * @returns {boolean} 是否开始播放
 */
function playParagraph(index, options = {}) {
  if (index < 0 || index >= paragraphs.length) {
    return false;
  }
  // ...
  return true;
}
```

---

## 📐 代码格式

### 基本规则

| 规则 | 示例 |
|------|------|
| **每行 ≤ 120 字符** | 超出时换行 |
| **保留字与括号加空格** | `if (condition)` |
| **括号内无空格** | `func(a, b)` |
| **使用单引号** | `const name = 'John';` |
| **模板字符串** | `const msg = `Hello ${name}`;` |

---

## 🧪 测试建议

```javascript
// 简单的功能测试示例
function testTTS() {
  console.log('测试 TTS 功能...');

  const tts = new TextToSpeech();
  const testPassed = tts.speak('Test', {
    onEnd: () => console.log('✓ TTS 测试通过')
  });

  if (!testPassed) {
    console.error('✗ TTS 测试失败');
  }
}

// 在开发时运行
if (window.location.hostname === 'localhost') {
  testTTS();
}
```

---

## 📋 代码审查清单

提交代码前，请确认：

- [ ] 函数不超过 50 行
- [ ] 圈复杂度不超过 15
- [ ] 函数参数不超过 5 个
- [ ] API 使用前进行功能检测
- [ ] LocalStorage 操作有 try-catch 保护
- [ ] 事件处理使用委托模式
- [ ] 键盘快捷键不与输入框冲突
- [ ] 注释清晰有效，无过时注释
- [ ] 数据结构统一

---

## 🔄 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2026-02-27 | 初始版本 |
| | | 参考 Hango 代码规范 |
| | | Web Speech API 最佳实践 |
| | | 键盘快捷键规范 |

---

**维护者**: 英语学习 TTS 系统开发团队
**反馈**: 如有问题或建议，请提交 Issue 或 PR
