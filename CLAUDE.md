# CLAUDE.md - English Learning TTS System

> **项目**: English Learning TTS System
> **状态**: 活跃维护中

---

## 项目身份

**项目名称**: English Learning TTS System
**一句话描述**: 智能文本转语音系统，支持多种学习模式、划词朗读、句子间停顿

Claude 必须 **NEVER** 引用其他项目的文件、代码或上下文。
Claude 必须 **ONLY** 在本目录内操作：`/Users/yuzhoudeshengyin/Documents/my_project/english-learning/`

---

## 核心文档（必读）

| 文档 | 内容 |
|------|------|
| [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) | 项目背景、愿景、设计理念 |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | 完整目录结构 |
| [PROJECT_RULES.md](PROJECT_RULES.md) | 代码规范、命名约定 |
| [README.md](README.md) | 功能说明、快速开始 |

---

## 核心功能

### TTS 智能朗读
- **队列策略** - 解决浏览器自动播放策略限制
- **划词朗读** - 选中任意文本即可开始播放
- **句子间停顿** - 智能识别句子边界，添加自然停顿
- **三种学习模式** - 快速模式 (1.2x) / 标准模式 (1.0x) / 缓慢模式 (0.8x)
- **段落高亮** - 自动高亮当前朗读的段落
- **自动滚动** - 平滑滚动到当前播放位置

---

## 技术栈

- **前端**: HTML5 + CSS3 + 原生 JavaScript
- **后端**: Python (可选，用于本地服务器)
- **数据**: localStorage + JSON 文件
- **测试**: Playwright

---

## 项目结构

```
english-learning/
├── index.html              # 主学习页面
├── project-log.html        # 项目日志
├── test-center.html        # 测试中心
├── server.py               # Python 服务器
├── data.json               # 学习数据
├── records/                # 学习记录
├── docs/                   # 文档
├── memory/                 # 项目记忆
├── learnings/              # 学习资源
├── scripts/                # 自动化脚本
└── tests/                  # 测试文件
```

---

## 常用命令

```bash
# 启动学习系统
open index.html

# 启动本地服务器
./start-server.sh

# 运行测试
pnpm test
```

---

## 学习模式

| 模式 | 速度 | 适用场景 |
|------|------|----------|
| 快速模式 | 1.2x | 快速复习已掌握内容 |
| 标准模式 | 1.0x | 日常学习，保持原速 |
| 缓慢模式 | 0.8x | 仔细学习，理解细节 |

---

## 架构约束

Claude 必须 **NOT**:
- 未经允许修改目录结构
- 未经允许重命名文件
- 未经允许移动文件
- 未经允许删除文件

Claude 必须:
- 保持现有结构
- 遵循既定模式
- 不破坏结构的前提下扩展代码

---

## 工作流程

每个任务必须遵循:

1. **理解** - 复述需求，确认理解
2. **设计** - 分析方案，识别风险
3. **确认** - 展示完整计划，等待批准
4. **执行** - 按计划执行，验证每步

---

## 安全规则

- 永远不暴露密钥
- 不提交 `.env`
- 不提交私钥

---

**Last Updated**: 2026-04-14
