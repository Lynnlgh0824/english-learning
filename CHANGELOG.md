# 📝 变更日志 (CHANGELOG)

> **English Learning TTS System** - 所有重要变更记录

---

## 🏷️ 版本规范

本项目遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)

```
MAJOR.MINOR.PATCH

MAJOR    - 不兼容的 API 变更
MINOR    - 向后兼容的功能新增
PATCH    - 向后兼容的问题修复
```

---

## [Unreleased]

### 待发布
- 🔄 持续优化中

---

## [1.3.0] - 2026-02-25

### 🆕 新增 (Added)

#### 项目文档系统
- ✅ `PROJECT_RULES.md` - 项目规则和开发规范
- ✅ `PROJECT_CONTEXT.md` - 项目背景和设计理念
- ✅ `PROJECT_STRUCTURE.md` - 完整的项目结构说明
- ✅ `CHANGELOG.md` - 变更日志（本文档）

#### 测试系统增强
- ✅ `unified-test-center.html` - 统一测试中心页面
  - 5 个功能标签页（概览、TTS、页面、E2E、工具）
  - 实时日志显示
  - 测试进度跟踪
  - 项目统计展示
- ✅ `tests/automated-e2e-test.js` - E2E 端到端自动化测试
  - Puppeteer 驱动的浏览器自动化
  - 完整的测试套件（基础、TTS、用户体验）
  - 自动生成测试报告
  - 测试截图保存
- ✅ `tests/e2e-test-runner.html` - E2E 测试 Web 控制台
  - 可视化测试界面
  - 测试配置管理
  - 实时进度显示
  - 测试结果统计

#### 工具脚本
- ✅ `scripts/cleanup-tests.sh` - 测试文件清理脚本
  - 自动识别重复文件
  - 归档旧测试文件
  - 保留核心测试文件

### ♻️ 重构 (Refactored)
- 🔄 整合 34 个测试文件到统一测试中心
- 🔄 合并多个 TTS 测试脚本到单一 E2E 测试套件
- 🔄 优化项目文档结构

### 📝 文档 (Documentation)
- ✅ 更新 `README.md` - 添加新功能说明
- ✅ 完善 `docs/TESTING.md` - 测试指南
- ✅ 新增项目规范文档

---

## [1.2.0] - 2026-02-24

### 🆕 新增 (Added)

#### 学习资源
- ✅ `records/2026-02-24-beginner-tennis-lesson.html`
  - 网球初学者主题学习包
  - 完整转录和翻译
  - TTS 朗读功能

#### 测试工具
- ✅ `test-center.html` - 测试中心页面（旧版）
- ✅ 链接检查功能
- ✅ 快速导航到所有测试页面

---

## [1.1.0] - 2026-02-06

### 🎉 重大更新 - TTS 系统完整重构

#### ✨ 核心功能优化

**TTS 系统优化**
- ✅ 修复 15+ 处变量作用域错误
- ✅ 修复 3 处类型转换错误
- ✅ 优化 API 调用逻辑和错误恢复
- ✅ 添加段落式平滑朗读
- ✅ 实现详细调试日志系统
- ✅ 代码重复率从 85% 降到 5%

**学习资源**
- ✅ 生成 4 个 YouTube 学习包：
  - 🏠 Coming Home (回家主题)
  - 🏝️ Month Alone in Chiang Mai (清迈独居)
  - 🏢 Shanghai Starting Over (上海重新开始)
  - 🎥 YouTube Entrepreneurship (创业主题)
- ✅ 每个包含完整转录、翻译、生词表和 TTS 朗读功能

**项目文档** (14 个)
- ✅ `DEVELOPMENT-PROCESS.md` - 6 步开发流程
- ✅ `TESTING.md` - 完整测试指南
- ✅ `TTS-TEST.md` - TTS 调试和排查
- ✅ `PROJECT-STATUS.md` - 项目状态跟踪
- ✅ `REQUIREMENT-TEMPLATE.md` - 需求模板
- ✅ `BUG-REPORT-TEMPLATE.md` - Bug 报告模板
- ✅ `COMMUNICATION-PROTOCOL.md` - 沟通协议
- ✅ `IMPROVEMENT-GUIDE.md` - 改进指南
- ✅ `PROJECT-LESSONS-LEARNED.md` - 教训总结
- ✅ `QUICK_GUIDE.md` - 快速上手
- ✅ `QUICK-FIX.md` - 常见问题解决
- ✅ `DATE_GROUPING_GUIDE.md` - 内容组织指南
- ✅ `PROJECT-SUMMARY.html` - HTML 版项目总结

**工具脚本**
- ✅ `tts-common.js` - 核心 TTS 功能（1,133 行）
- ✅ `tts-simple.js` - 简化版 TTS（183 行）
- ✅ `auto-diagnose.js` - 自动诊断工具（215 行）
- ✅ `debug-tts.js` - TTS 调试工具（148 行）
- ✅ `page-common.js` - 页面公共功能（117 行）
- ✅ `validate-project.sh` - 项目验证脚本（266 行）

**测试系统**
- ✅ 集成测试：`test_tts_playback.js`
- ✅ 归档 34 个测试文件

**首页重构**
- ✅ 更新 `README.md` 为完整系统说明
- ✅ 优化 `index.html` 首页布局
- ✅ 删除旧的中文页面文件

### 📊 统计数据
- 修复 bug: 18 处
- 删除重复代码: 903 行
- 新增 JavaScript: ~1,800 行
- 新增文档: 14 个（~4,000 行）
- 学习记录: 4 个（~2,600 行）
- 总计新增: ~16,400 行

---

## [1.0.0] - 2026-02-05

### 🎉 首次正式发布

#### ✨ 核心功能

**TTS 智能朗读系统**
- ✅ 队列策略 - 解决浏览器自动播放策略限制
- ✅ 划词朗读 - 选中任意文本即可开始播放
- ✅ 句子间停顿 - 智能识别句子边界，添加自然停顿
- ✅ 三种学习模式 - 快速/标准/缓慢
- ✅ 段落高亮 - 自动高亮当前朗读的段落
- ✅ 自动滚动 - 平滑滚动到当前播放位置
- ✅ 女声优先 - 自动筛选并优先推荐女声语音

**学习管理**
- ✅ 多项目支持 - 管理多个学习项目
- ✅ 学习进度跟踪 - 记录每个段落的学习状态
- ✅ 快捷操作 - 键盘快捷键控制播放

**学习资源管理**
- ✅ 自动生成学习工具包 - 支持 TED、YouTube、英文文章
- ✅ H5 查看器 - 浏览所有学习记录
- ✅ 搜索和统计 - 快速查找学习内容
- ✅ 桌面快捷方式 - 一键打开学习系统

#### 🛠️ 技术实现
- HTML5 + CSS3 + 原生 JavaScript
- Web Speech API (speechSynthesis)
- localStorage 本地存储
- 零依赖，即开即用

#### 📚 初始文档
- ✅ `README.md` - 项目说明
- ✅ `STRUCTURE.md` - 项目结构
- ✅ `TTS_TROUBLESHOOTING.md` - TTS 故障排除

---

## 📊 版本历史总览

```
Version    Date          Description
────────────────────────────────────────────
[1.3.0]    2026-02-25    项目文档系统 + 统一测试中心
[1.2.0]    2026-02-24    新增网球主题学习包
[1.1.0]    2026-02-06    TTS 系统完整重构 (重大更新)
[1.0.0]    2026-02-05    首次正式发布
```

---

## 🔄 变更类型说明

| 图标 | 类型 | 说明 |
|------|------|------|
| ✨ | Added | 新增功能 |
| 🔧 | Fixed | Bug 修复 |
| ♻️ | Changed | 功能变更 |
| ⚠️ | Deprecated | 即将废弃 |
| ❌ | Removed | 删除功能 |
| 🛠️ | Security | 安全相关 |
| 📝 | Docs | 文档更新 |
| 🎨 | Styles | 样式更新 |
| ♻️ | Refactored | 代码重构 |
| ⚡ | Performance | 性能优化 |
| 🧪 | Tests | 测试相关 |

---

## 📅 计划中的功能

### [1.4.0] - 计划中
- 🔄 生词本功能
- 🔄 学习进度统计图表
- 🔄 单词复习提醒

### [2.0.0] - 远期计划
- 🌟 PWA 应用支持
- 🌟 跨平台桌面应用
- 🌟 社区分享功能
- 🌟 AI 学习助手
- 🌟 多语言支持

---

## 🤝 贡献指南

查看完整贡献指南：
- [PROJECT_RULES.md](./PROJECT_RULES.md) - 开发规范
- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) - 项目背景
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 项目结构

---

## 📞 反馈与支持

- **GitHub Issues**: https://github.com/Lynnlgh0824/english-learning/issues
- **更新日期**: 2026-02-25
- **维护者**: Project Team

---

**注意**: 本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范进行版本管理。
