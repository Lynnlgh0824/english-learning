# 英语学习 TTS 系统 - 设计系统总览

> **版本**: v1.0
> **更新时间**: 2026-02-27
> **适用于**: 英语学习 TTS 系统

---

## 📖 设计系统定义

### 什么是设计系统

设计系统由**设计原则**、**设计语言**和**组件库**构成，在设计原则的指导下使用设计语言和组件库创建体验一致的用户界面。

```
设计系统
├── 设计原则 - 指导方向
├── 设计语言 - 视觉元素
│   ├── 色彩系统
│   ├── 文字系统（双语优化）
│   ├── 阴影系统
│   ├── 圆角系统
│   └── 间距系统
└── 组件库 - 可复用元素
    ├── 基础组件（播放器、控制器）
    └── 业务组件（学习项目、进度追踪）
```

---

## 🎯 设计原则

### 1. 可读性优先 (Readability First)

英语学习系统的核心是文本阅读，必须确保最佳的可读性。

**应用示例：**
- 使用高对比度配色
- 行高 1.6-1.8 确保舒适阅读
- 字号不小于 16px
- 段落间距充足

### 2. 聚焦学习内容 (Learning Focus)

界面设计应突出学习内容，减少干扰。

**应用示例：**
- 简洁的界面布局
- 当前播放段落高亮
- 无多余装饰元素
- 控制器隐藏式设计

### 3. 操作便捷 (Easy Control)

学习者需要频繁控制播放，操作必须简单直观。

**应用示例：**
- 一键播放/暂停
- 划词即读
- 键盘快捷键
- 速度切换一键操作

### 4. 护眼设计 (Eye Comfort)

长时间阅读学习，界面应减少视觉疲劳。

**应用示例：**
- 暖色调背景
- 柔和的文字颜色
- 避免高饱和度色彩
- 支持自定义主题

---

## 🧬 原子设计理论

### 五个层次

```
原子 → 分子 → 组织 → 模板 → 页面

原子：颜色、文字、图标
分子：播放按钮、进度条
组织：播放器面板、学习项目卡片
模板：学习界面
页面：完整页面
```

---

## 🎨 设计语言构成

### 1. 色彩系统

详见：[COLOR-GUIDELINES.md](COLOR-GUIDELINES.md)

- **主色调**: `#3B82F6` (蓝色) - 沉稳专注
- **强调色**: `#10B981` (绿色) - 播放中状态
- **背景色**: `#FEFCE8` (米黄色) - 护眼暖色
- **文字色**: `#1F2937` (深灰) - 高可读性
- **高亮色**: `#FEF3C7` (浅黄) - 当前播放段落

### 2. 文字系统

详见：[TYPOGRAPHY.md](TYPOGRAPHY.md)

**中英双语优化：**

- **字体**: 系统默认（PingFang SC、Microsoft YaHei）
- **英文字体**: Georgia、Times New Roman（衬线体适合阅读）
- **中文字号**: 16px - 18px
- **英文字号**: 18px - 20px（略大以提升可读性）
- **行高**: 1.6 - 1.8
- **字重**: 400 (Regular), 500 (Medium)

### 3. 阴影系统

| 等级 | 用途 | CSS |
|------|------|-----|
| **sm** | 悬停效果 | `box-shadow: 0 1px 2px rgba(0,0,0,0.05)` |
| **md** | 卡片 | `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` |
| **lg** | 弹窗 | `box-shadow: 0 10px 15px rgba(0,0,0,0.1)` |

### 4. 圆角系统

| 元素 | 圆角 | CSS |
|------|------|-----|
| **按钮** | 6px | `border-radius: 6px` |
| **卡片** | 8px | `border-radius: 8px` |
| **播放器** | 12px | `border-radius: 12px` |

### 5. 间距系统

基于 **8点网格**：

| 名称 | 数值 | 用途 |
|------|------|------|
| **xs** | 4px | 小间距 |
| **sm** | 8px | 按钮内边距 |
| **md** | 16px | 卡片内边距 |
| **lg** | 24px | 区块间距 |
| **xl** | 32px | 页面边距 |

---

## 📐 布局规范

详见：[LAYOUT.md](LAYOUT.md)

### 响应式设计

- **移动优先**: 从小屏幕开始设计
- **阅读宽度**: 正文最大宽度 800px（最佳阅读体验）
- **响应式断点**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: ≥ 1024px

---

## 🧩 组件库

详见：[COMPONENT-LIBRARY.md](COMPONENT-LIBRARY.md)

### 核心组件

#### 1. 播放控制器 (Playback Controller)

```html
<div class="playback-controls">
  <button class="play-pause-btn">▶</button>
  <div class="progress-bar"></div>
  <div class="speed-selector">
    <button>0.8x</button>
    <button class="active">1.0x</button>
    <button>1.2x</button>
  </div>
</div>
```

#### 2. 学习项目卡片 (Learning Project Card)

```html
<div class="project-card">
  <h3 class="project-title">TED Talk: How to learn a new language</h3>
  <div class="project-meta">
    <span>📅 2024-02-27</span>
    <span>📊 进度 60%</span>
  </div>
</div>
```

#### 3. 文本段落 (Text Paragraph)

```html
<p class="paragraph playing" data-index="0">
  Learning a new language can be challenging, but with the right approach,
  it becomes an enjoyable journey.
</p>
```

---

## 🎵 朗读状态系统

### 播放状态

| 状态 | 颜色 | 动画 | 用途 |
|------|------|------|------|
| **未播放** | 灰色 | 无 | 默认段落 |
| **播放中** | 浅黄背景 | 脉冲动画 | 当前播放 |
| **已播放** | 灰色 | 无 | 已完成 |

### 高亮样式

```css
.paragraph.playing {
  background-color: #FEF3C7;
  border-left: 4px solid #10B981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.9; }
}
```

---

## ⌨️ 键盘快捷键

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Space` | 播放/暂停 | 切换播放状态 |
| `←` | 上一段 | 返回上一段落 |
| `→` | 下一段 | 跳转下一段 |
| `1` / `2` / `3` | 速度切换 | 0.8x / 1.0x / 1.2x |
| `Esc` | 关闭 | 关闭当前窗口 |

---

## 📝 文案规范

### 原则

1. **简洁明了** - 避免冗长说明
2. **双语友好** - 中英文界面清晰
3. **学习导向** - 使用教育场景词汇

### 示例

| 场景 | 中文 | 英文 |
|------|------|------|
| 播放按钮 | "播放" | "Play" |
| 暂停按钮 | "暂停" | "Pause" |
| 速度选择 | "慢速" / "标准" / "快速" | "Slow" / "Normal" / "Fast" |
| 进度显示 | "已学 60%" | "60% Complete" |

---

## 🎯 设计规范使用流程

### 开发者

1. **使用系统字体** - 确保最佳渲染效果
2. **保持阅读宽度** - 正文不超过 800px
3. **高对比度** - 文字与背景对比度 ≥ 7:1
4. **响应式优先** - 移动端体验同等重要

### 设计师

1. **可读性优先** - 一切以阅读体验为重
2. **简洁设计** - 减少视觉干扰
3. **护眼配色** - 使用柔和色调
4. **操作便捷** - 控制器易于使用

---

## 📚 相关文档

- [色彩规范](COLOR-GUIDELINES.md)
- [排版规范](TYPOGRAPHY.md)
- [布局规范](LAYOUT.md)
- [组件库文档](COMPONENT-LIBRARY.md)
- [响应式规范](RESPONSIVE.md)

---

## 🔧 技术栈

- **框架**: 原生 HTML/CSS/JavaScript
- **TTS API**: Web Speech API
- **存储**: LocalStorage + JSON 文件
- **快捷键**: Keyboard Event API

---

## 🔄 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2026-02-27 | 初始版本，建立设计系统框架 |
| | | 护眼配色方案 |
| | | 朗读状态系统 |
| | | 键盘快捷键规范 |

---

**维护者**: 英语学习 TTS 系统开发团队
**反馈**: 如有问题或建议，请提交 Issue 或 PR
