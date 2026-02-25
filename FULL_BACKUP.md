# 📚 English Learning Project - Complete Backup

**备份时间：** 2026-02-25  
**项目路径：** `/Users/yuzhoudeshengyin/Documents/my_project/english-learning/`

---

## 📁 项目结构

```
english-learning/
├── index.html                          # 主页入口
├── README.md                           # 项目文档
├── .DS_Store                           # macOS 系统文件
├── records/                            # 学习记录目录
│   ├── 2026-02-24-beginner-tennis-lesson.md
│   └── 2026-02-24-beginner-tennis-lesson.html
└── scripts/                            # 脚本目录
    ├── tts-common.js                   # TTS 核心功能脚本
    ├── diagnose_tts.js                 # TTS 诊断工具
    ├── fix_chinese_filter.js           # 中文过滤修复工具
    └── fix_voice_init.js               # 语音初始化修复工具
```

---


====================================
## 📄 文件 1: index.html

====================================

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>英语学习系统</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            text-align: center;
        }

        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 32px;
        }

        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }

        .card-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .card-icon {
            font-size: 24px;
            margin-right: 15px;
        }

        .card-title {
            flex: 1;
            text-align: left;
            font-size: 18px;
            font-weight: 500;
        }

        .card-arrow {
            font-size: 20px;
        }

        .footer {
            margin-top: 30px;
            color: #999;
            font-size: 14px;
        }

        .badge {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 英语学习系统</h1>
        <p class="subtitle">智能朗读 · 学习记录 · 进度追踪</p>

        <div class="card-list">
            <a href="records/2026-02-24-beginner-tennis-lesson.html" class="card">
                <span class="card-icon">🎾</span>
                <span class="card-title">初学者网球课</span>
                <span class="badge">最新</span>
                <span class="card-arrow">→</span>
            </a>

            <a href="records/" class="card">
                <span class="card-icon">📂</span>
                <span class="card-title">查看所有学习记录</span>
                <span class="card-arrow">→</span>
            </a>
        </div>

        <p class="footer">
            💡 点击卡片开始学习，支持 TTS 智能朗读
        </p>
    </div>
</body>
</html>

\`\`\`

====================================
## 📖 文件 2: README.md

====================================

\`\`\`markdown
# 📚 英语学习系统

一个基于 Web Speech API 的智能英语学习平台，支持 TTS（文本转语音）朗读、学习模式切换和进度追踪。

## 项目结构

```
english-learning/
├── index.html                      # 主页入口
├── records/                        # 学习记录目录
│   ├── 2026-02-24-beginner-tennis-lesson.md   # Markdown 源文件
│   └── 2026-02-24-beginner-tennis-lesson.html # 生成的学习页面
└── scripts/                        # 脚本目录
    ├── tts-common.js              # TTS 核心功能脚本（57KB）
    ├── diagnose_tts.js            # TTS 诊断工具
    ├── fix_chinese_filter.js      # 中文过滤修复工具
    └── fix_voice_init.js          # 语音初始化修复工具
```

## 核心功能

### 1️⃣ TTS 智能朗读系统

基于 Web Speech API (`window.speechSynthesis`) 实现的文本转语音功能。

#### 朗读模式

| 模式 | 图标 | 语速 | 适用场景 |
|------|------|------|----------|
| **快速模式** | ⚡ | 1.0x | 快速浏览内容 |
| **标准模式** | 📚 | 0.75x | 正常学习（默认） |
| **缓慢模式** | 🔥 | 0.5x | 精听难点内容 |

#### 语音选择

- **自动筛选**：只显示英文语音
- **优先级排序**：
  1. 女声音频优先（+100 分）
  2. 美式英语 (en-US) 优先（+50 分）
  3. 英式英语 (en-GB) 次优先（+40 分）
- **可用语音列表**（15个）：
  - Samantha (en-US) - 默认首选
  - Victoria (en-GB)
  - Alex (en-US)
  - Fiona (en-Scotland)
  - Karen (en-AU)
  - Moira (en-IE)
  - Tessa (en-ZA)
  - Veena (en-IN)
  - Daniel (en-GB)
  - Kate (en-GB)
  - Mary (en-GB)
  - Ting-Ting (zh-CN)
  - Mei-Jia (zh-TW)
  - Sin-ji (zh-HK)

#### 朗读控制

- **播放/暂停**：一键控制朗读状态
- **划词播放**：从选中的文本位置开始朗读
- **语速调节**：0.5x ~ 2.0x 无级调节
- **自动滚动**：朗读时自动滚动到当前段落（可手动禁用）
- **进度显示**：实时显示朗读进度条

### 2️⃣ 学习记录结构

每个学习记录包含 6 个核心模块：

#### 模块 1：内容总览
- 视频来源链接
- 学习日期
- 内容类型标签

#### 模块 2：核心词汇表（20个）
每个词汇卡片包含：
- ✅ 词汇 + 音标
- ✅ 中文释义
- ✅ 📖 语境含义
- ✅ 💬 材料中的原句用法（带引用）
- ✅ ✍️ 实用例句（3个场景：💼职场、☕日常、📚学术）
- ✅ 🔗 习惯搭配（3-5个）

#### 模块 3：地道表达（15个）
每个表达卡片包含：
- ✅ 表达 + 中文释义
- ✅ 📖 释义和使用场景
- ✅ 💬 材料中的原句用法（带引用）
- ✅ ✍️ 实用例句（3-5个）
- ✅ 💡 同义表达对比（✅正确 vs ❌常见错误）

#### 模块 4：句型解析（8个）
每个句型包含：
- ✅ 句型结构 + 中文释义
- ✅ 📖 语法规则解析
- ✅ 💬 材料中的原句用法
- ✅ ✍️ 替换练习例句（3个）

#### 模块 5：学习任务
- 词汇记忆任务
- 听力跟读任务
- 写作应用任务

#### 模块 6：学习建议
- 学习方法指导
- 时间规划建议
- 进阶学习资源

### 3️⃣ 中文内容朗读

- **自动识别**：朗读时自动识别中文内容（关键词、地道表达）
- **中文语音**：使用中文语音朗读中文部分（Ting-Ting, Mei-Jia, Sin-ji）
- **英文语音**：使用英文语音朗读英文部分

### 4️⃣ 导航与交互

- **目录导航**：左侧浮动目录，快速跳转各模块
- **返回按钮**：返回学习列表首页
- **进度条**：页面顶部显示阅读进度
- **高亮显示**：朗读时当前段落高亮显示

## 技术栈

- **前端框架**：纯原生 JavaScript（无框架依赖）
- **语音 API**：Web Speech API (`speechSynthesis`)
- **样式**：内联 CSS + 渐变背景设计
- **兼容性**：现代浏览器（Chrome、Edge、Safari）

## 添加新学习记录

### 内容要求

1. **词汇数量**：精确 20 个核心词汇
2. **地道表达**：精确 15 个常用表达
3. **句型解析**：精确 8 个重点句型

### 每个卡片必须包含的字段

- 词汇：词汇、音标、中文、语境、原句、3场景例句、习惯搭配
- 表达：表达、中文、场景、原句、例句、对比
- 句型：结构、中文、语法、原句、替换练习

### 生成流程

1. 准备 Markdown 源文件（符合内容要求）
2. 使用 `/learn-english` skill 生成 HTML
3. 验证生成内容是否符合规则
4. 将 HTML 文件放入 `records/` 目录
5. 更新 `index.html` 添加新记录链接

## 开发工具

### TTS 诊断工具
```bash
# 运行诊断
node scripts/diagnose_tts.js
```

### 语音初始化修复
```bash
# 修复语音加载问题
node scripts/fix_voice_init.js
```

### 中文过滤修复
```bash
# 修复中文内容过滤
node scripts/fix_chinese_filter.js
```

## 使用说明

1. **启动本地服务器**：
   ```bash
   cd /Users/yuzhoudeshengyin/Documents/my_project/english-learning
   python3 -m http.server 8000
   ```

2. **访问主页**：
   ```
   http://localhost:8000
   ```

3. **选择学习记录**：
   - 点击"初学者网球课"或其他学习记录
   - 或点击"查看所有学习记录"浏览全部

4. **开始学习**：
   - 点击"播放"按钮开始 TTS 朗读
   - 选择适合的学习模式（快速/标准/缓慢）
   - 切换语音类型（女声/男声、美音/英音）
   - 调节语速滑块
   - 划选文本可从指定位置开始朗读

## 功能亮点

- ✨ **零依赖**：纯原生 JS，无需安装任何库
- 🎙️ **智能朗读**：自动识别中英文内容，切换对应语音
- 📚 **多模式学习**：快速浏览、标准学习、精听模式
- 🎯 **精准内容**：每个学习记录包含 20 词汇 + 15 表达 + 8 句型
- 📊 **进度追踪**：实时显示朗读进度和阅读进度
- 🔧 **灵活控制**：语速、语音、滚动跟随全部可定制
- 💡 **场景化学习**：每个词汇都有职场、日常、学术三个场景例句

## 版本历史

- **v1.0** (2026-02-24)：初始版本，支持基础 TTS 朗读
- **v1.1** (2026-02-24)：添加学习模式切换（快速/标准/缓慢）
- **v1.2** (2026-02-25)：优化语音筛选和优先级排序，支持划词播放

## 作者

Claude Code Assistant

---

**🎾 Happy Learning!**

\`\`\`

====================================
## 📂 文件 3: records/2026-02-24-beginner-tennis-lesson.md

====================================

\`\`\`markdown
# 🎾 Beginner Tennis Lesson | Forehand, Backhand & Serve

## 📚 内容总览

### 核心观点

This comprehensive beginner tennis lesson teaches the three fundamental strokes: forehand, backhand, and serve. The instructor emphasizes starting with proper contact point and focusing on control rather than power. The key philosophy is to minimize the backswing while maximizing the follow-through, which helps beginners develop consistent mechanics from the start.

### 关键词列表

| English | Chinese | Context |
|---------|---------|---------|
| Forehand | 正手 | Main stroke on dominant side |
| Backhand | 反手 | Stroke on non-dominant side |
| Serve | 发球 | Shot to start each point |
| Grip | 握拍方式 | How to hold the racket |
| Contact point | 击球点 | Where racket meets the ball |
| Backswing | 后摆 | Racket movement before hitting |
| Follow-through | 随挥 | Racket movement after hitting |
| Baseline | 底线 | Back line of the court |
| Service line | 发球线 | Line where serves must land behind |
| Trophy position | 奖杯姿势 | Starting position for serve |
| Control | 控制 | Ability to place the ball accurately |
| Accelerate | 加速 | Increase racket speed |
| Rotate | 旋转 | Body turning during stroke |
| Sideways | 侧身 | Body positioning for strokes |
| Athletic position | 运动站姿 | Ready stance before shots |

---

## 📖 核心词汇表 (20个)

### 1. Intuitive /ɪnˈtuːɪtɪv/

**含义**：直观的，凭直觉的

**原句用法**：
> "so in your mind you're **intuitive** though you know you just feel like you have to like you don't have to just right now just focus on the ball"

**例句**：
- *职场场景*：She has an **intuitive** understanding of customer needs.
- *日常场景*：The app interface is designed to be **intuitive** and easy to use.
- *学术场景*：Some researchers argue that **intuitive** decision-making can be as effective as analytical thinking.

**搭配**：intuitive understanding, intuitive approach, intuitive sense

### 2. Confused /kənˈfjuːzd/

**含义**：困惑的，混淆的

**原句用法**：
> "you're playing pretty good but you're kind of **confused** which hand to use on the forehand"

**例句**：
- *职场场景*：The new employee was **confused** about the project requirements.
- *日常场景*：I get **confused** when too many people talk at once.
- *学术场景*：Students often feel **confused** by complex mathematical formulas.

**搭配**：get confused, feel confused, confused about

### 3. Accelerate /əkˈseləreɪt/

**含义**：加速，增速

**原句用法**：
> "now obviously you're going to have to swing a little bit faster okay because otherwise like a little bit stronger otherwise the ball is not going to make it very far you know so from here you can **accelerate** a little bit more"

**例句**：
- *职场场景*：We need to **accelerate** the project timeline to meet the deadline.
- *日常场景*：The car began to **accelerate** as it entered the highway.
- *学术场景*：Climate change continues to **accelerate** due to human activity.

**搭配**：accelerate the process, accelerate growth, gradually accelerate

### 4. Dominant /ˈdɒmɪnənt/

**含义**：主导的，优势的

**原句用法**：
> "it's very important that your non-**dominant** elbow comes through at the end"

**例句**：
- *职场场景*：The company has become the **dominant** player in the market.
- *日常场景*：My right hand is my **dominant** hand.
- *学术场景*：The **dominant** theory in linguistics has changed over time.

**搭配**：dominant hand, dominant position, dominant culture

### 5. Overwhelmed /ˌəʊvəˈwelmd/

**含义**：不知所措的，难以承受的

**原句用法**：
> "the **dominant** elbow gets kind of **overwhelmed** by the stroke and ends up getting tucked in like this"

**例句**：
- *职场场景*：I felt **overwhelmed** by the amount of work I had to complete.
- *日常场景*：Don't get **overwhelmed** by all the choices at the restaurant.
- *学术场景*：Students can feel **overwhelmed** during exam periods.

**搭配**：feel overwhelmed, get overwhelmed, overwhelmed by

### 6. Sequence /ˈsiːkwəns/

**含义**：顺序，序列

**原句用法**：
> "and now I want to teach you real quick the **sequence** of the stroke"

**例句**：
- *职场场景*：We need to follow the correct **sequence** of steps in this procedure.
- *日常场景*：The dance instructor taught us the **sequence** of movements.
- *学术场景*：Researchers studied the **sequence** of events leading to the crisis.

**搭配**：in sequence, sequence of events, follow the sequence

### 7. Mechanism /ˈmekənɪzəm/

**含义**：机制，手法

**原句用法**：
> "and the **mechanism** of changing your grip you're actually going to be doing this with your left hand"

**例句**：
- *职场场景*：We need to understand the **mechanism** behind this decision.
- *日常场景*：This watch has a complex **mechanism** that keeps accurate time.
- *学术场景*：The **mechanism** of DNA replication was a major discovery.

**搭配**：mechanism of action, underlying mechanism, complex mechanism

### 8. Preference /ˈprefrəns/

**含义**：偏好，喜好

**原句用法**：
> "you will figure this out on your own what your **preference** is"

**例句**：
- *职场场景*：We take customer **preference** into account when designing products.
- *日常场景*：I have a strong **preference** for coffee over tea.
- *学术场景*：The study examined cultural differences in color **preference**.

**搭配**：have a preference, express preference, personal preference

### 9. Muscle memory /ˈmʌsl ˌmeməri/

**含义**：肌肉记忆

**原句用法**：
> "sometimes when you start from scratch you can build the right mechanics right away you don't have to change any bad **muscle memory**"

**例句**：
- *职场场景*：Learning to type quickly requires developing **muscle memory**.
- *日常场景*：Playing the piano relies heavily on **muscle memory**.
- *学术场景*：**Muscle memory** allows athletes to perform complex movements automatically.

**搭配**：develop muscle memory, build muscle memory, rely on muscle memory

### 10. Stance /stæns/

**含义**：站姿，立场

**原句用法**：
> "that's the basics of the serve I don't want you to do anything else you already got the **stance**"

**例句**：
- *职场场景*：The company took a clear **stance** on environmental issues.
- *日常场景*：Athletes need to maintain a proper **stance** for balance.
- *学术场景*：The researcher's **stance** on the topic was well-supported.

**搭配**：take a stance, adopt a stance, firm stance

### 11. Aligned /əˈlaɪnd/

**含义**：对齐的，一致的

**原句用法**：
> "but put the arm **aligned** with my racket here"

**例句**：
- *职场场景*：Our goals are **aligned** with the company's mission.
- *日常场景*：Make sure the wheels are properly **aligned** on your car.
- *学术场景*：The curriculum is **aligned** with national educational standards.

**搭配**：aligned with, properly aligned, stay aligned

### 12. Minimize /ˈmɪnɪmaɪz/

**含义**：最小化

**原句用法**：
> "we're gonna **minimize** what happens in the back over here but we're going to maximize what happens after contact"

**例句**：
- *职场场景*：We need to **minimize** costs while maintaining quality.
- *日常场景*：This app helps **minimize** screen time.
- *学术场景*：The study aimed to **minimize** experimental error.

**搭配**：minimize risk, minimize impact, minimize the problem

### 13. Maximize /ˈmæksɪmaɪz/

**含义**：最大化

**原句用法**：
> "we're gonna minimize what happens in the back over here but we're going to **maximize** what happens after contact"

**例句**：
- *职场场景*：We want to **maximize** our productivity this quarter.
- *日常场景*：Use these tips to **maximize** your workout results.
- *学术场景*：The algorithm is designed to **maximize** efficiency.

**搭配**：maximize potential, maximize profits, maximize efficiency

### 14. Indicate /ˈɪndɪkeɪt/

**含义**：指示，表明

**原句用法**：
> "this is going to be an **indicator** that you're rotating a little bit"

**例句**：
- *职场场景*：The sales figures **indicate** a strong quarter.
- *日常场景*：Research **indicates** that breakfast is important.
- *学术场景*：The data **indicates** a correlation between the variables.

**搭配**：indicate that, indicate a problem, results indicate

### 15. Sufficient /səˈfɪʃnt/

**含义**：足够的，充分的

**原句用法**：
> "and the racket still went like this which is **sufficient** that's all you need"

**例句**：
- *职场场景*：Is the budget **sufficient** for this project?
- *日常场景*：Three hours of sleep is not **sufficient** for most people.
- *学术场景***:** **Sufficient** evidence was found to support the hypothesis.

**搭配**：sufficient for, sufficient evidence, sufficient time

### 16. Disconnect /ˌdiːskəˈnekt/

**含义**：断开，失去联系

**原句用法**：
> "keep holding the racket you're going to get **disconnected** from the ball"

**例句**：
- *职场场景*：The internet connection will **disconnect** if the cable is loose.
- *日常场景*：Sometimes I feel **disconnected** from reality when I'm online too much.
- *学术场景**：The study examined how social media can **disconnect** people from face-to-face interactions.

**搭配**：disconnect from, become disconnected, disconnect the power

### 17. Consciously /ˈkɒnʃəsli/

**含义**：有意识地，自觉地

**原句用法**：
> "but when you **conscious** which is a very good thing that's how you're supposed to do a backswing"

**例句**：
- *职场场景*：She **consciously** decided to change her leadership style.
- *日常场景*：I need to **consciously** practice gratitude every day.
- *学术场景**：**Consciously** recalling information is a key study technique.

**搭配**：consciously decide, consciously aware, think consciously

### 18. Eventually /ɪˈventʃuəli/

**含义**：最终，终于

**原句用法**：
> "your hand will get used to that grip and **eventually** you'll have to change it"

**例句**：
- *职场场景*：**Eventually**, the team found a solution to the problem.
- *日常场景*：If you keep practicing, you'll **eventually** master the skill.
- *学术场景**：The theory was **eventually** accepted by the scientific community.

**搭配**：eventually succeed, eventually realize, eventually happen

### 19. Recommend /ˌrekəˈmend/

**含义**：推荐，建议

**原句用法**：
> "so I always **recommend** to beginners that you find the correct grip right away"

**例句**：
- *职场场景*：I **recommend** that we proceed with caution.
- *日常场景*：Can you **recommend** a good restaurant nearby?
- *学术场景**：Researchers **recommend** further studies on this topic.

**搭配**：recommend that, recommend doing, highly recommend

### 20. Specific /spəˈsɪfɪk/

**含义**：具体的，特定的

**原句用法**：
> "so you're going to be doing this with your left hand so the right hand is going to be loose"

(注：此处在讨论特定的手法和动作)

**例句**：
- *职场场景*：Could you provide more **specific** details about the project?
- *日常场景*：I have a **specific** goal I want to achieve this year.
- *学术场景**：The research focused on a **specific** population group.

**搭配**：specific details, specific example, more specific

---

## 💬 地道表达 (15个)

### 1. From scratch

**含义**：从零开始，白手起家

**原句用法**：
> "sometimes when you start **from scratch** you can build the right mechanics right away"

**例句**：
- *职场场景*：We built the company **from scratch** with just three employees.
- *日常场景*：I'm learning to cook **from scratch** instead of using packaged meals.
- *学术场景*：The researchers decided to start **from scratch** with a new methodology.

**同义表达对比**：
- ✅ Correct: "start from scratch"
- ❌ Common mistake: "start from the beginning" (less natural)

### 2. Right off the bat

**含义**：立刻，马上

**例句**：
- *职场场景*：We need to address these issues **right off the bat**.
- *日常场景*：I knew I would love this movie **right off the bat**.
- *学术场景*：The experiment failed **right off the bat** due to equipment issues.

**同义表达对比**：
- ✅ Correct: "right off the bat"
- ❌ Common mistake: "immediately at the start" (too formal)

### 3. Get the hang of something

**含义**：掌握诀窍，学会

**例句**：
- *职场场景*：It took me a week to **get the hang of** the new software.
- *日常场景*：After a few lessons, you'll **get the hang of** playing guitar.
- *学术场景*：Students need time to **get the hang of** complex concepts.

**同义表达对比**：
- ✅ Correct: "get the hang of it"
- ❌ Common mistake: "understand it well" (less idiomatic)

### 4. In the zone

**含义**：状态极佳，全神贯注

**例句**：
- *职场场景*：I was **in the zone** this morning and finished the report quickly.
- *日常场景*：The athlete was **in the zone** during the championship game.
- *学术场景*：When I'm **in the zone**, I can study for hours without getting tired.

**同义表达对比**：
- ✅ Correct: "in the zone"
- ❌ Common mistake: "very focused" (lacks the idiomatic feel)

### 5. On the other hand

**含义**：另一方面

**例句**：
- *职场场景*：This solution is expensive. **On the other hand**, it's very reliable.
- *日常场景*：I want to travel, but **on the other hand**, I need to save money.
- *学术场景**：The first method is faster; **on the other hand**, it's less accurate.

**同义表达对比**：
- ✅ Correct: "on the other hand"
- ❌ Common mistake: "alternatively" (doesn't capture the contrast)

### 6. Step by step

**含义**：逐步地，一步步地

**例句**：
- *职场场景*：Let's approach this problem **step by step**.
- *日常场景*：I learned to play piano **step by step**.
- *学术场景*：The guide explains the process **step by step**.

**同义表达对比**：
- ✅ Correct: "step by step"
- ❌ Common mistake: "gradually" (misses the sequential aspect)

### 7. A little bit

**含义**：一点，稍微

**原句用法**：
> "you're taking the racket a **little bit** too far back"

**例句**：
- *职场场景*：Could you explain this **a little bit** more?
- *日常场景*：I'm **a little bit** tired today.
- *学术场景**：The results improved **a little bit** after the adjustment.

**同义表达对比**：
- ✅ Correct: "a little bit"
- ❌ Common mistake: "slightly" (too formal for casual conversation)

### 8. Right away

**含义**：立刻，马上

**原句用法**：
> "so I always recommend to beginners that you find the correct grip **right away**"

**例句**：
- *职场场景*：I'll get that report to you **right away**.
- *日常场景*：We need to leave **right away** to catch the train.
- *学术场景**：The professor responded to my email **right away**.

**同义表达对比**：
- ✅ Correct: "right away"
- ❌ Common mistake: "immediately" (correct but less conversational)

### 9. Pretty good

**含义**：相当好，不错

**原句用法**：
> "you're playing **pretty good**"

**例句**：
- *职场场景*：Your presentation was **pretty good**.
- *日常场景*：I'm doing **pretty good** today.
- *学术场景**：The results are **pretty good** considering the constraints.

**同义表达对比**：
- ✅ Correct: "pretty good"
- ❌ Common mistake: "very good" (may sound too enthusiastic in some contexts)

### 10. All of a sudden

**含义**：突然

**例句**：
- *职场场景*：**All of a sudden**, the project requirements changed.
- *日常场景*：**All of a sudden**, it started raining.
- *学术场景**：**All of a sudden**, the experiment showed unexpected results.

**同义表达对比**：
- ✅ Correct: "all of a sudden"
- ❌ Common mistake: "suddenly" (grammatically correct but less idiomatic)

### 11. Figure out

**含义**：弄清楚，解决

**原句用法**：
> "you will **figure** this out on your own what your preference is"

**例句**：
- *职场场景*：I need to **figure out** how to fix this bug.
- *日常场景*：Can you **figure out** the answer to this puzzle?
- *学术场景**：Researchers are trying to **figure out** the cause of the disease.

**同义表达对比**：
- ✅ Correct: "figure out"
- ❌ Common mistake: "solve" (doesn't capture the process of understanding)

### 12. Mess up

**含义**：搞砸，出错

**例句**：
- *职场场景*：Don't worry if you **mess up** - we can fix it.
- *日常场景*：I **messed up** the recipe by adding too much salt.
- *学术场景*：One small mistake can **mess up** the entire experiment.

**同义表达对比**：
- ✅ Correct: "mess up"
- ❌ Common mistake: "make a mistake" (correct but less colloquial)

### 13. Pick up

**含义**：学会，掌握

**原句用法**：
> "and with your hands you're gonna grab the racket like this you're gonna put your hand right on top of the racket and **pick** it **up**"

**例句**：
- *职场场景*：I managed to **pick up** the new software quickly.
- *日常场景*：Children **pick up** languages very fast.
- *学术场景**：Students **pick up** good study habits from their peers.

**同义表达对比**：
- ✅ Correct: "pick up"
- ❌ Common mistake: "learn" (doesn't imply the natural, effortless acquisition)

### 14. Work on

**含义**：致力于，改进

**原句用法**：
> "you're going to **work on** the toss"

**例句**：
- *职场场景*：I need to **work on** my presentation skills.
- *日常场景*：I'm trying to **work on** being more patient.
- *学术场景**：We need to **work on** improving our research methods.

**同义表达对比**：
- ✅ Correct: "work on"
- ❌ Common mistake: "improve" (doesn't capture the ongoing effort)

### 15. End up

**含义**：最终，结果

**原句用法**：
> "and then you actually do **end up** taking the racket back without even noticing"

**例句**：
- *职场场景*：If you don't plan carefully, you'll **end up** missing the deadline.
- *日常场景*：We **ended up** going to a different restaurant.
- *学术场景**：The experiment **ended up** proving the opposite hypothesis.

**同义表达对比**：
- ✅ Correct: "end up"
- ❌ Common mistake: "finally" (doesn't capture the unintended result)

---

## 🔧 句型解析 (8个)

### 1. "The most important thing is..." 最重要的...

**结构分析**：
- Subject + be + superlative adjective + noun + complement
- Used to emphasize priority

**替换模板**：
- The most important thing is [verb phrase]
- The most important thing is [that clause]

**应用示例**：
- The most important thing is **to stay focused**.
- The most important thing is **that we work together**.
- The most important thing is **practicing consistently**.

### 2. "Without you even noticing" 在你甚至没注意到的情况下

**结构分析**：
- Preposition + pronoun + even + participle
- Used to describe something happening unconsciously

**替换模板**：
- Without [someone] even [verb-ing]
- Without [someone] even realizing

**应用示例**：
- He improved **without you even noticing**.
- The problem was solved **without us even realizing**.
- She left **without anyone even noticing**.

### 3. "As soon as..." 一...就...

**结构分析**：
- As + soon + as + clause, main clause
- Time clause showing immediate sequence

**替换模板**：
- As soon as [subject + verb], [main clause]
- As soon as [event], [result]

**应用示例**：
- **As soon as** you see the ball coming, turn your body.
- **As soon as** I arrived, they started the meeting.
- **As soon as** possible, let me know the results.

### 4. "Make sure that..." 确保...

**结构分析**：
- Imperative verb + object clause
- Used to give instructions or warnings

**替换模板**：
- Make sure that + [clause]
- Make sure + [noun phrase]

**应用示例**：
- **Make sure that** your feet are parallel.
- **Make sure** to practice every day.
- **Make sure that** you understand the instructions.

### 5. "Instead of..." 而不是...

**结构分析**：
- Preposition phrase showing alternative
- Instead of + noun/gerund

**替换模板**：
- Instead of [noun/gerund], [alternative]
- [Do this] instead of [that]

**应用示例**：
- Start from the contact **instead of** taking the racket back.
- Walk to the ball **instead of** running sideways.
- Focus on control **instead of** power.

### 6. "That's all you need" 这就是你所需要的

**结构分析**：
- Demonstrative + be + subject + verb
- Used to emphasize sufficiency

**替换模板**：
- That's all [someone] need
- That's everything [someone] need

**应用示例**：
- **That's all you need** for now.
- **That's all** they **need** to know.
- **That's all** we **need** to get started.

### 7. "The reason why..." 为什么...

**结构分析**：
- Noun clause introducing explanation
- The reason why + clause + is + because/that

**替换模板**：
- The reason why + [clause] + is + [explanation]
- This is the reason why + [clause]

**应用示例**：
- **The reason why** you turn is to run normally to the ball.
- **The reason why** I'm asking is to understand better.
- **The reason why** it works is simple.

### 8. "It's going to be..." 将会是...

**结构分析**：
- Future prediction with going to
- It + be + going to + be + adjective/noun

**替换模板**：
- It's going to be + [adjective]
- It's going to be + [noun phrase]

**应用示例**：
- **It's going to be** very difficult.
- **It's going to be** a great experience.
- **It's going to be** easier than you think.

---

## ✍️ 学习任务

### 📝 阅读理解题 (5道)

#### 1. 细节理解题

According to the instructor, what is the most important thing for beginners to focus on when learning tennis strokes?

A. Hitting the ball with maximum power
B. Starting with proper contact point and control
C. Taking a big backswing for more force
D. Watching professional players for inspiration

**正确答案：B**

**原文依据**：
> "remember the most important thing is the contact that you that you have a good control over the ball in the very beginning"

**答案解析**：The instructor repeatedly emphasizes that beginners should focus on control and the contact point rather than power or big swings. This is why he teaches students to start close to the contact point.

#### 2. 细节理解题

What grip change does the instructor recommend when switching between forehand and backhand?

A. Use the same grip for both strokes
B. Change from forehand grip to backhand grip
C. Only change grip for forehand, not backhand
D. Hold the racket loosely for both strokes

**正确答案：B**

**原文依据**：
> "I always recommend to beginners that you find the correct grip right away so forehand has to be hit with a forehand grip backhand has to be hit with a backhand grip"

**答案解析**：The instructor explicitly states that beginners should learn the correct grip for each stroke right away, rather than using one grip for everything.

#### 3. 推理判断题

Why does the instructor teach students to minimize the backswing and maximize the follow-through?

A. Because backswings are unnecessary in tennis
B. To help students focus on control and build proper mechanics
C. Because follow-throughs look more professional
D. To prevent students from hitting the ball too hard

**正确答案：B**

**原文依据**：
> "so you want that you remember we're not we're gonna minimize what happens in the back over here but we're going to maximize what happens after contact"

**答案解析**：The philosophy is that minimizing the backswing helps beginners maintain control and connection with the ball, while maximizing follow-through ensures proper mechanics.

#### 4. 细节理解题

In the trophy position for serving, what should the player do with their tossing arm?

A. Bend it at 90 degrees
B. Keep it straight and aligned with the racket
C. Hold it against their body
D. Wave it in the air

**正确答案：B**

**原文依据**：
> "and now you're gonna take the ball look straighten the arm but put the arm aligned with my racket here your left arm"

**答案解析**：The instructor specifically tells the student to straighten the tossing arm and align it with the racket in the trophy position.

#### 5. 主旨大意题

What is the main teaching philosophy presented in this tennis lesson?

A. Power and speed are the most important aspects of tennis
B. Beginners should focus on complex techniques from the start
C. Building proper mechanics through control-focused practice leads to better long-term results
D. Watching and copying professional players is the best way to learn

**正确答案：C**

**原文依据**：
> "sometimes when you start from scratch you can build the right mechanics right away you don't have to change any bad muscle memory"

**答案解析**：The entire lesson emphasizes starting with proper fundamentals—control before power, minimal backswing, maximum follow-through—so that beginners develop correct mechanics from the beginning.

---

### ✍️ 练习题 (3个)

#### 1. 观点讨论题

**Do you think it's better to learn sports techniques step by step, focusing on one skill at a time, or to try everything at once and improve through practice? Explain your opinion using examples from your own experience.**

**参考思路**：
- Discuss the benefits of focused, sequential learning
- Compare with learning multiple skills simultaneously
- Use examples from the video (learning forehand first, then backhand, then serve)
- Share personal learning experiences

#### 2. 实际场景应用题

**Imagine you are teaching a friend to play tennis (or another sport you know well). Based on the teaching methods shown in this video, how would you structure your first lesson? What would you emphasize first?**

**参考思路**：
- Start with the most fundamental skill
- Focus on control rather than power
- Use simple, progressive steps
- Provide positive feedback and encouragement
- Teach proper mechanics from the beginning

#### 3. 创意延伸题

**The instructor mentions that sometimes "without you even noticing," your body naturally does the correct backswing when you focus on contact and follow-through. Can you think of other skills or activities where focusing on the end result helps your body naturally do the right movements?**

**参考思路**：
- Sports: golf swing, basketball shooting
- Arts: playing musical instruments, painting
- Daily activities: typing, driving
- Learning principle: trust your body's natural abilities
- Connection to muscle memory and unconscious competence

---

## 🎯 学习建议

### 适合的学习场景

**🚗 通勤时间 (30分钟)**：
- 内容总览 + 核心词汇 (10个)
- 重点：记忆关键词和基本概念

**🌙 睡前学习 (20分钟)**：
- 地道表达 + 句型解析
- 重点：理解表达的实际应用场景

**📅 周末专注 (60-90分钟)**：
- 完整学习流程 + 练习题
- 重点：深度理解和实践应用

### 重点关注的难点

**📝 词汇难点**：
- Sport-specific terminology (forehand, backhand, stance)
- Abstract verbs (minimize, maximize, indicate)
- Collocations with prepositions

**🔤 语法难点**：
- Imperative sentences for instructions
- Future forms with "going to"
- Prepositional phrases
- Comparative structures

**🎭 文化难点**：
- American sports teaching style (encouraging, positive)
- Direct instruction vs. indirect suggestions
- Use of sports metaphors in everyday language

**🗣️ 发音难点**：
- Word stress: intuitive (/ɪnˈtuːɪtɪv/)
- Silent letters: muscle (/ˈmʌsl/)
- Linked sounds in fast speech

### 可拓展的关联话题

**🎾 Related Topics**：
- Other tennis techniques (volley, smash, lob)
- Different teaching methods in sports
- Sports psychology and performance
- Fitness and conditioning for tennis

**📚 Learning Resources**：
- Other tennis tutorial videos on YouTube
- Tennis websites and magazines
- Local tennis clubs and coaches
- Tennis equipment reviews

**💡 Practical Applications**：
- Actually playing tennis and applying these techniques
- Teaching sports to others
- Analyzing other instructional videos
- Understanding sports commentary

---

## 📚 Sources

- [YouTube Video: Beginner Tennis Lesson | Forehand, Backhand & Serve](https://www.youtube.com/watch?v=YqgcykDGB2A)
- [Intuitive Tennis Channel](https://www.youtube.com/c/IntuitiveTennis)
- [Intuitive Tennis Website](https://www.intuitivetennis.com)

---

**Learning Date**: 2026-02-24
**Video Duration**: 18:49
**Difficulty Level**: Intermediate
**Generated by**: Claude Code English Learning System

\`\`\`

====================================
## 📂 文件 4: records/2026-02-24-beginner-tennis-lesson.html
（文件较大: 78KB，仅显示头部 100 行）

====================================

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎾 Beginner Tennis Lesson | Forehand, Backhand & Serve - 英语学习记录</title>
    <!-- 页面基础样式 -->
    <link rel="stylesheet" href="../styles/common.css">
    <!-- TTS 公共样式 -->
    <link rel="stylesheet" href="../styles/tts-common.css">
</head>
<body>
    <div class="reading-progress" id="readingProgress"></div>

    <div class="container">
        <a href="../index.html" class="back-link">← 返回学习列表</a>

        <!-- 朗读控制面板 -->
        <div class="tts-panel" id="ttsPanel">
            <div class="tts-header">
                <div class="tts-title">
                    <span>🎙️</span>
                    <span>智能朗读助手</span>
                </div>
                <div class="tts-controls">
                    <button class="tts-btn primary" id="playBtn" onclick="togglePlay()">
                        <span id="playIcon">▶️</span>
                        <span id="playText">播放</span>
                    </button>
                    <button class="tts-btn" id="selectionBtn" onclick="playSelection()" disabled style="opacity: 0.5; cursor: not-allowed;">
                        <span>📝</span>
                        <span>从划词区域开始</span>
                    </button>
                    <button class="mode-btn" data-mode="quick" onclick="switchMode('quick')">
                        <span>⚡</span>
                        <span>快速</span>
                    </button>
                    <button class="mode-btn active" data-mode="standard" onclick="switchMode('standard')">
                        <span>📚</span>
                        <span>标准</span>
                    </button>
                    <button class="mode-btn" data-mode="intensive" onclick="switchMode('intensive')">
                        <span>🔥</span>
                        <span>缓慢</span>
                    </button>
                </div>
            </div>
            <div class="tts-settings">
                <div class="tts-setting">
                    <label>🗣️ 语音：</label>
                    <select class="tts-select" id="voiceSelect" onchange="handleVoiceChange()">
                        <option value="">加载中...</option>
                    </select>
                </div>
                <div class="tts-setting">
                    <label>⚡ 语速：</label>
                    <input type="range" class="tts-slider" id="rateSlider" min="0.5" max="2" step="0.1" value="0.75" oninput="updateRate()">
                    <span id="rateValue">0.75x</span>
                </div>
            </div>
            <div class="tts-progress-row">
                <div class="tts-status" id="ttsStatus">
                    💡 点击"播放"开始朗读内容
                </div>
                <div class="tts-progress">
                    <div class="tts-progress-bar" id="ttsProgressBar"></div>
                </div>
            </div>
        </div>

        <h1>📚 YouTube: "🎾 Beginner Tennis Lesson | Forehand, Backhand & Serve"</h1>
        <p class="subtitle">英语学习工具包</p>

        <div class="meta-info">
            <p><strong>📺 视频来源</strong>：<a href="https://www.youtube.com/watch?v=YqgcykDGB2A" target="_blank">YouTube - Intuitive Tennis</a></p>
            <p><strong>📅 学习日期</strong>：2026-02-24</p>
            <p><strong>🏷️ 类型</strong>：YouTube Video - Tennis Tutorial, Sports Instruction</p>
        </div>

        <div class="toc">
            <h3>📑 学习目录</h3>
            <ul>
                <li><a href="#section-1"><span class="section-number">1</span>内容总览</a></li>
                <li><a href="#section-2"><span class="section-number">2</span>核心词汇表（20个）</a></li>
                <li><a href="#section-3"><span class="section-number">3</span>地道表达（15个）</a></li>
                <li><a href="#section-4"><span class="section-number">4</span>句型解析（8个）</a></li>
                <li><a href="#section-5"><span class="section-number">5</span>学习任务</a></li>
                <li><a href="#section-6"><span class="section-number">6</span>学习建议</a></li>
            </ul>
        </div>

        <!-- 导航目录按钮 -->
        <button class="toc-toggle-btn" id="tocToggleBtn" aria-label="切换目录">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
        </button>

        <div class="section" id="section-1">
            <h2>1. 内容总览</h2>

... (省略其余内容) ...
\`\`\`

====================================
## 📜 文件 5: scripts/tts-common.js (核心文件)

====================================

\`\`\`javascript
/**
 * ========================================
 * TTS 智能朗读系统 - 公共脚本
 * ========================================
 * 功能：文本转语音、学习模式控制、TOC 导航
 *
 * 使用方法：
 * 1. 在 HTML 中引入此脚本
 * 2. 确保页面包含必要的 TTS 面板 HTML 结构
 * 3. 引入对应的 CSS 文件：tts-common.css
 *
 * 依赖：
 * - 无外部依赖，使用原生 Web Speech API
 * - 需要 DOM 元素：voiceSelect, playBtn, pauseBtn, stopBtn 等
 *
 * ⚠️⚠️⚠️ 重要提醒（开发人员必读）⚠️⚠️⚠️
 * 修改此文件前，请先查看项目根目录的 TEST_TOOLS.md
 * 已有测试工具：auto-test-runner.html, validate-tts-code.js, test-full-project.js
 * 禁止创建重复的测试工具！如有问题，优先使用现有工具！
 * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
 */

(function() {
    'use strict';

    // ========================================
    // 全局变量初始化
    // ========================================

    window.synthesis = window.speechSynthesis;
    window.utterance = null;
    window.voices = [];
    window.enhancedVoices = []; // 保存排序后的英文语音
    window.isPlaying = false;
    window.isPaused = false;
    window.currentParagraphIndex = 0;
    window.currentMode = 'standard'; // 当前学习模式
    window.paragraphs = [];
    window.paragraphsElements = [];
    window.isStarting = false; // 添加启动锁，防止重复点击

    // 自动滚动跟随控制
    window.autoScrollEnabled = true;      // 是否启用自动滚动跟随
    window.userScrolling = false;         // 用户是否正在手动滚动
    window.scrollResumeTimer = null;      // 恢复自动滚动的定时器
    window.SCROLL_RESUME_DELAY = 5000;    // 用户滚动后5秒恢复自动跟随

    // 自动下一篇控制
    window.autoNextEnabled = true;        // 是否启用自动下一篇
    window.autoNextTimer = null;          // 自动下一篇的定时器
    window.AUTO_NEXT_DELAY = 3000;        // 文章读完3秒后自动下一篇
    window.allRecords = [];               // 所有学习记录列表
    window.currentRecordIndex = 0;        // 当前文章索引

    // 语音加载可能需要时间，提前监听语音变化事件
    if (window.synthesis.onvoiceschanged !== undefined) {
        window.synthesis.onvoiceschanged = () => {
            setTimeout(() => initVoices(), 100);
        };
    }

    // ========================================
    // 语音初始化
    // ========================================

    function initVoices() {
        window.voices = window.synthesis.getVoices();

        // 如果语音还没加载，等待下一次调用
        if (window.voices.length === 0) {
            updateStatus('⏳ 正在加载语音...');
            // 500ms后重试一次（防止onvoiceschanged不触发）
            setTimeout(() => {
                if (window.voices.length === 0) {
                    initVoices();
                }
            }, 500);
            return;
        }

        const voiceSelect = document.getElementById('voiceSelect');
        if (!voiceSelect) {
            console.warn('未找到 voiceSelect 元素');
            return;
        }

        voiceSelect.innerHTML = '';

        // 筛选英文语音
        const englishVoices = window.voices.filter(v => v.lang.startsWith('en'));

        if (englishVoices.length === 0) {
            voiceSelect.innerHTML = '<option value="">暂无英文语音</option>';
            updateStatus('⚠️ 未找到英文语音，请稍后重试');
            return;
        }

        // 常见女声名称列表
        const femaleNames = [
            'Samantha', 'Victoria', 'Alex', 'Fiona', 'Karen', 'Moira', 'Tessa', 'Veena',
            'Siri', 'Hattie', 'Nicky', 'Tom', 'Daniel', 'Kate', 'Mary', 'Anna',
            'Allison', 'Ava', 'Amelie', 'Alice', 'Flo', 'Jenny', 'Linda', 'Lisa',
            'Melina', 'Milena', 'Olivia', 'Saman', 'Google', 'Microsoft', 'Female',
            'Woman', 'Girl', 'Zira', 'Heidi', 'Kanya', 'Rishi', 'Veena', 'Lekha'
        ];

        // 为每个语音添加性别标识和排序权重
        window.enhancedVoices = englishVoices.map((voice, originalIndex) => {
            const voiceName = voice.name.toLowerCase();
            const voiceLang = voice.lang;

            // 判断是否为女声
            let isFemale = false;
            for (const femaleName of femaleNames) {
                if (voiceName.includes(femaleName.toLowerCase())) {
                    isFemale = true;
                    break;
                }
            }

            // 排序权重（女声优先，美式英语优先）
            let priority = 0;
            if (isFemale) priority += 100;
            if (voiceLang.includes('en-US')) priority += 50;
            if (voiceLang.includes('en-GB')) priority += 40;

            // 显式复制属性，确保 name 和 lang 被正确包含
            return {
                voice: voice,  // 保存原始语音对象引用
                name: voice.name,  // 显式复制 name 属性
                lang: voice.lang,  // 显式复制 lang 属性
                isFemale: isFemale,
                priority: priority,
                originalIndex: originalIndex
            };
        });

        // 按优先级排序
        window.enhancedVoices.sort((a, b) => b.priority - a.priority);

        // 重建原始索引映射
        const indexMap = {};
        window.enhancedVoices.forEach((voice, newIndex) => {
            indexMap[newIndex] = voice.originalIndex;
        });

        // 生成下拉菜单选项
        const optgroups = {
            'female': { label: '👩 女声', options: [] },
            'male': { label: '👨 男声', options: [] },
            'other': { label: '🎤 其他', options: [] }
        };

        window.enhancedVoices.forEach((voice, displayIndex) => {
            const category = voice.isFemale ? 'female' : 'male';
            const genderIcon = voice.isFemale ? '👩' : '👨';

            const option = document.createElement('option');
            option.value = displayIndex;

            // 显示格式：性别图标 | 名称 (语言)
            option.textContent = `${genderIcon} ${voice.name} (${voice.lang || 'Unknown'})`;

            // 优先选择女声美式英语（添加安全检查）
            if (voice.isFemale && voice.lang && voice.lang.includes('en-US') && option.value === '0') {
                option.selected = true;
            }

            optgroups[category].options.push(option);
        });

        // 按分组添加到下拉菜单
        ['female', 'male', 'other'].forEach(category => {
            if (optgroups[category].options.length > 0) {
                const group = document.createElement('optgroup');
                group.label = optgroups[category].label;
                optgroups[category].options.forEach(opt => group.appendChild(opt));
                voiceSelect.appendChild(group);
            }
        });

        // 添加语音变更监听（在设置值之前添加，避免触发）
        voiceSelect.onchange = handleVoiceChange;

        // 加载保存的语音选择
        const savedVoice = localStorage.getItem('tts-voice');
        if (savedVoice !== null) {
            // 🔧 修复：设置值前暂时移除监听器，避免触发 handleVoiceChange
            voiceSelect.onchange = null;
            voiceSelect.value = savedVoice;
            voiceSelect.onchange = handleVoiceChange;
        }

        const femaleCount = optgroups['female'].options.length;
        const maleCount = optgroups['male'].options.length;
        updateStatus(`✅ 已加载 ${englishVoices.length} 个语音（${femaleCount} 个女声 / ${maleCount} 个男声）`);

        // 语音加载完成后初始化模式
        initializeMode();
    }

    // 语音选择变更（实时应用）
    function handleVoiceChange() {
        const voiceSelect = document.getElementById('voiceSelect');
        const selectedIndex = voiceSelect.value;

        // 保存用户偏好
        localStorage.setItem('tts-voice', selectedIndex);

        // 如果正在播放，实时应用新语音
        if (window.isPlaying && !window.isPaused) {
            const savedIndex = window.currentParagraphIndex;
            window.synthesis.cancel();
            // 🔧 修复：直接调用队列策略，避免 setTimeout 失去用户交互
            enqueueAllParagraphs(savedIndex);
            updateStatus(`✅ 语音已切换`);
        } else if (window.isPaused) {
            updateStatus(`✅ 语音已切换，继续播放时生效`);
        }
    }

    // ========================================
    // 文本处理工具函数
    // ========================================

    // 将阿拉伯数字转换为英文单词（确保TTS用英文朗读）
    function convertNumbersToEnglish(text) {
        // 处理阿拉伯数字（1-100）
        const numberWords = {
            0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four',
            5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
            10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen',
            15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen',
            20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty',
            60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety',
            100: 'one hundred', 1000: 'one thousand'
        };

        // 替换阿拉伯数字（主要替换独立出现的数字）
        let result = text.replace(/\b(\d+)\b/g, (match) => {
            const num = parseInt(match);
            if (num <= 20 || num === 30 || num === 40 || num === 50 ||
                num === 60 || num === 70 || num === 80 || num === 90 ||
                num === 100 || num === 1000) {
                return numberWords[num] || match;
            }
            // 对于更大的数字，让TTS引擎处理（英文语音应该能正确朗读）
            return match;
        });

        return result;
    }

    // 移除表情符号和不需要朗读的标点
    function removeEmojis(text) {
        // Emoji字符范围（Unicode）
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        // 移除emoji和双引号，然后转换数字
        let cleaned = convertNumbersToEnglish(
            text.replace(emojiRegex, '').replace(/[""]/g, '').trim()
        );

        // 限制段落长度，避免超过TTS引擎限制（通常限制在200-400字符）
        const maxLength = 300;
        if (cleaned.length > maxLength) {
            // 在最近的句号、问号或感叹号处截断
            let truncateAt = maxLength;
            for (let i = maxLength; i >= maxLength - 50; i--) {
                const char = cleaned[i];
                if (char === '.' || char === '?' || char === '!') {
                    truncateAt = i + 1;
                    break;
                }
            }
            cleaned = cleaned.substring(0, truncateAt);
        }

        return cleaned;
    }

    // 按句子分割文本，并在每个句子后添加停顿标记
    function splitIntoSentences(text) {
        // 首先清理文本
        const cleaned = removeEmojis(text);

        // 使用正则表达式分割句子（按 . ? ! 分割）
        // 保留分隔符，并在后面添加额外的停顿标记
        const sentences = cleaned.split(/([.!?]+)/);
        const result = [];

        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i].trim();
            if (sentence.length === 0) continue;

            result.push(sentence);

            // 如果是句子结束标点，添加到结果中
            if (i + 1 < sentences.length && /^[.!?]+$/.test(sentences[i + 1])) {
                result.push(sentences[i + 1]);
                i++;
            }
        }

        return result;
    }

    // ========================================
    // 段落获取
    // ========================================

    function getReadableParagraphs() {
        console.log('[getReadableParagraphs] 开始获取可朗读段落...');
        // 获取主要内容区域的所有段落
        const content = document.querySelector('.container');
        if (!content) {
            console.error('[getReadableParagraphs] 未找到 .container 元素');
            return { texts: [], elements: [] };
        }

        const allParagraphs = content.querySelectorAll('p, h1, h2, h3, h4, li, blockquote, td, th');
        console.log('[getReadableParagraphs] 容器中找到', allParagraphs.length, '个元素');

        const readableTexts = [];
        const elements = [];
        const processedTexts = new Set(); // 防止重复

        allParagraphs.forEach((elem, index) => {
            let text = elem.textContent.trim();

            // 移除表情符号
            text = removeEmojis(text);

            // 过滤条件：
            // 1. 长度至少5个字符
            // 2. 包含英文或中文（支持中英混合内容朗读）
            // 3. 这样可以朗读：
            //    - 纯英文内容
            //    - 纯中文内容
            //    - 中英混合内容（如："Digital Nomad 数字游民"）
            if (text.length >= 5 && (/[a-zA-Z]/.test(text) || /[\u4e00-\u9fa5]/.test(text))) {
                if (!processedTexts.has(text)) {
                    readableTexts.push(text);
                    elements.push(elem);
                    processedTexts.add(text);

                    // 添加可朗读段落样式和点击事件
                    elem.classList.add('readable-paragraph');
                    elem.addEventListener('click', () => {
                        playFromParagraph(elements.indexOf(elem));
                    });

                    console.log(`[getReadableParagraphs] 添加段落 ${elements.length}: "${text.substring(0, 50)}..."`);
                }
            }
        });

        console.log('[getReadableParagraphs] 找到', elements.length, '个可朗读段落');
        return { texts: readableTexts, elements: elements };
    }

    // 从指定段落开始播放
    function playFromParagraph(index) {
        // 如果正在播放，先停止
        if (window.isPlaying) {
            stopSpeech();
        }

        // 首次加载段落（如果在 DOMContentLoaded 时未初始化）
        if (window.paragraphs.length === 0) {
            const data = getReadableParagraphs();
            window.paragraphs = data.elements;  // 使用元素数组
            window.paragraphsElements = data.elements;
        }

        // 设置当前段落索引
        window.currentParagraphIndex = index;

        // 开始播放
        playParagraph(window.currentParagraphIndex);
        updateStatus(`🔊 从第 ${index + 1} 段开始播放`);
    }

    // ========================================
    // UI 更新函数
    // ========================================

    function updatePlayButton(playing) {
        const playBtn = document.getElementById('playBtn');
        const playIcon = document.getElementById('playIcon');
        const playText = document.getElementById('playText');

        if (!playBtn || !playIcon || !playText) return;

        if (playing) {
            playIcon.textContent = '⏸️';
            playText.textContent = '继续';
            playBtn.classList.remove('paused');
        } else {
            playIcon.textContent = '▶️';
            playText.textContent = '播放';
            if (window.isPaused) {
                playBtn.classList.add('paused');
            } else {
                playBtn.classList.remove('paused');
            }
        }
    }

    function updateStatus(message) {
        const ttsStatus = document.getElementById('ttsStatus');
        if (ttsStatus) {
            ttsStatus.textContent = message;
        }
    }

    function updateProgress(current, total) {
        const progressBar = document.getElementById('ttsProgressBar');
        if (progressBar) {
            const percentage = (current / total) * 100;
            progressBar.style.width = percentage + '%';
        }
    }

    function highlightParagraph(index) {
        // 移除之前的高亮
        window.paragraphsElements.forEach(elem => {
            elem.classList.remove('speaking');
        });

        // 添加新的高亮
        if (index < window.paragraphsElements.length) {
            const elem = window.paragraphsElements[index];
            elem.classList.add('speaking');

            // 滚动到当前段落
            elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // ========================================
    // 播放控制
    // ========================================

    // 播放/暂停
    function togglePlay() {
        const playBtn = document.getElementById('playBtn');

        // 立即禁用按钮，防止重复点击
        if (playBtn && !window.isPlaying && !window.isPaused) {
            playBtn.disabled = true;
            playBtn.style.opacity = '0.6';
            playBtn.style.cursor = 'not-allowed';
            console.log('[togglePlay] 按钮已禁用，等待播放开始...');
        }

        if (window.isPlaying && !window.isPaused) {
            // 如果正在播放，则暂停
            pauseSpeech();
        } else {
            // 🎯 优先检查是否有选中的文本（从选中位置开始）
            // 使用安全的 selection 访问方式
            let selectedText = '';
            let anchorNode = null;

            try {
                const selection = window.getSelection();
                if (selection) {
                    // 安全地获取选中文本
                    try {
                        selectedText = selection.toString().trim();
                    } catch (e) {
                        selectedText = '';
                    }

                    // 安全地获取 anchorNode
                    if (selectedText.length > 0) {
                        try {
                            anchorNode = selection.anchorNode;
                        } catch (e) {
                            anchorNode = null;
                        }
                    }
                }
            } catch (e) {
                // 忽略 selection API 错误
                console.warn('[togglePlay] Selection access error:', e.message);
            }

            if (selectedText.length > 0 && !window.isPlaying && anchorNode) {
                // 获取选中内容的父元素
                const parentElement = anchorNode.nodeType === Node.TEXT_NODE ?
                    anchorNode.parentElement : anchorNode;

                // 找到选中内容所在的段落索引
                for (let i = 0; i < window.paragraphsElements.length; i++) {
                    if (window.paragraphsElements[i].contains(parentElement)) {
                        window.currentParagraphIndex = i;
                        console.log('[togglePlay] 从选中位置开始播放，段落索引:', i);
                        break;
                    }
                }
            } else {
                // 检查是否有高亮的段落（从上次位置继续）
                const speakingElement = document.querySelector('.speaking');
                if (speakingElement && window.paragraphsElements.length > 0) {
                    // 找到高亮段落的索引
                    const index = window.paragraphsElements.indexOf(speakingElement);
                    if (index !== -1) {
                        window.currentParagraphIndex = index;
                    }
                }
            }
            // 开始播放或继续播放
            startSpeech();
        }
    }

    // 开始朗读
    function startSpeech() {
        console.log('[startSpeech] 开始播放，状态:', {
            isPaused: window.isPaused,
            paragraphsLength: window.paragraphs.length,
            currentIndex: window.currentParagraphIndex,
            isStarting: window.isStarting
        });

        // 防止重复点击
        if (window.isStarting) {
            console.log('[startSpeech] 正在启动中，忽略重复点击');
            return;
        }

        // 如果是暂停后继续
        if (window.isPaused) {
            window.synthesis.resume();
            window.isPaused = false;
            updatePlayButton(true);
            updateStatus('▶️ 继续播放...');
            return;
        }

        // 首次播放 - paragraphs 已经在 DOMContentLoaded 中初始化
        if (!window.paragraphs || window.paragraphs.length === 0) {
            console.error('[startSpeech] 未找到可朗读的段落！尝试重新获取...');
            // 尝试重新获取段落
            const data = getReadableParagraphs();
            window.paragraphs = data.elements;
            window.paragraphsElements = data.elements;
            console.log('[startSpeech] 重新获取后段落数:', window.paragraphs.length);

            if (window.paragraphs.length === 0) {
                updateStatus('⚠️ 未找到可朗读的内容');
                return;
            }
        }

        // 设置启动锁
        window.isStarting = true;

        // 确保 currentParagraphIndex 有效
        if (window.currentParagraphIndex === undefined || window.currentParagraphIndex === null || isNaN(window.currentParagraphIndex)) {
            window.currentParagraphIndex = 0;
        }

        // 🔧 关键修复：使用队列策略，在用户点击时一次性添加所有段落
        console.log('[startSpeech] 使用队列策略，从段落', window.currentParagraphIndex, '开始');
        enqueueAllParagraphs(window.currentParagraphIndex);
    }

    // 🔧 新增：队列播放策略（在用户交互上下文中添加所有段落）
    // 改进：按句子分割，每个句子之间停顿1秒
    function enqueueAllParagraphs(startIndex) {
        console.log('[enqueueAllParagraphs] 开始添加段落到队列，从索引', startIndex, '开始');

        // 🔧 修复：如果正在播放且未暂停，不要重新开始
        if (window.synthesis.speaking && !window.isPaused && window.isPlaying) {
            console.log('[enqueueAllParagraphs] ⚠️ 正在播放中，忽略重复请求');
            return;
        }

        // 🔧 关键修复：双保险清除策略（解决浏览器 speaking 卡住 bug）
        // Chrome/Safari 的 speechSynthesis.speaking 有时会卡在 true 状态
        if (window.synthesis.speaking || window.isPaused) {
            console.log('[enqueueAllParagraphs] 检测到残留播放状态，执行双保险清除...', {
                speaking: window.synthesis.speaking,
                isPlaying: window.isPlaying,
                isPaused: window.isPaused
            });

            // 步骤1: pause()（如果正在播放）
            if (window.synthesis.speaking && !window.isPaused) {
                console.log('[enqueueAllParagraphs] 步骤1: pause()');
                window.synthesis.pause();
            }

            // 步骤2: cancel()（彻底清除队列）
            console.log('[enqueueAllParagraphs] 步骤2: cancel()');
            window.synthesis.cancel();

            // 步骤3: 重置所有状态标志
            window.isPlaying = false;
            window.isPaused = false;
            window.isStarting = false;

            console.log('[enqueueAllParagraphs] ✅ 清除完成');
        }

        // 获取语音设置
        const voiceSelect = document.getElementById('voiceSelect');
        const rateSlider = document.getElementById('rateSlider');
        const selectedVoiceIndex = voiceSelect ? parseInt(voiceSelect.value, 10) : 0;
        const rate = rateSlider ? parseFloat(rateSlider.value) : 0.8;
        const selectedVoice = window.enhancedVoices && window.enhancedVoices[selectedVoiceIndex] ?
                          window.enhancedVoices[selectedVoiceIndex].voice : null;

        // 收集所有句子
        const allSentences = [];
        const sentenceToParagraphMap = []; // 记录每个句子所属的段落索引

        for (let i = startIndex; i < window.paragraphs.length; i++) {
            const paragraph = window.paragraphs[i];
            const text = removeEmojis(paragraph.textContent || paragraph.innerText || '');

            if (text.length === 0) {
                console.log('[enqueueAllParagraphs] 跳过空段落:', i);
                continue;
            }

            // 🔧 过滤：跳过纯中文段落（中文注释），只保留包含英文的内容
            // 🎯 特殊处理：关键词列表和地道表达区域的中文需要朗读
            const hasEnglish = /[a-zA-Z]/.test(text);
            const chineseRatio = (text.match(/[\u4e00-\u9fa5]/g) || []).length / text.length;

            // 检查是否在特殊区域内（关键词列表表格、地道表达的中文含义等）
            const isInTable = paragraph.closest('table') !== null;
            const isInExpressionCard = paragraph.closest('.expression-card') !== null;
            const parentSection = paragraph.closest('.section');
            const sectionTitle = parentSection?.querySelector('h3, h2')?.textContent || '';

            // 检测关键词表格
            const isKeywordTable = isInTable && sectionTitle.includes('关键词');
            // 检测地道表达区域（通过section标题或expression-card）
            const isInIdiomaticExpression = isInExpressionCard || sectionTitle.includes('地道表达');

            // 如果是纯中文（中文比例超过80%且没有英文），检查是否在特殊区域
            if (!hasEnglish && chineseRatio > 0.8) {
                // 如果在关键词表格或地道表达区域，保留中文进行朗读
                if (isKeywordTable || isInIdiomaticExpression) {
                    console.log('[enqueueAllParagraphs] ✅ 保留特殊区域的中文:', i, text.substring(0, 30));
                } else {
                    console.log('[enqueueAllParagraphs] 跳过纯中文段落:', i, text.substring(0, 30));
                    continue;
                }
            }

            // 将段落分割成句子
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
            sentences.forEach(sentence => {
                const trimmed = sentence.trim();
                if (trimmed.length > 0) {
                    // 再次过滤句子级别的纯中文
                    const sentenceHasEnglish = /[a-zA-Z]/.test(trimmed);

                    // 如果包含英文，或者在特殊区域内（关键词表格、地道表达），则保留
                    if (sentenceHasEnglish || isKeywordTable || isInIdiomaticExpression) {
                        allSentences.push(trimmed);
                        sentenceToParagraphMap.push(i);
                    }
                }
            });
        }

        console.log(`[enqueueAllParagraphs] 共收集 ${allSentences.length} 个句子`);

        // 🔧 修复：在用户交互上下文中一次性添加所有utterance到队列
        // 避免使用setTimeout导致的 not-allowed 错误
        console.log('[enqueueAllParagraphs] 在用户交互上下文中添加所有句子到队列');

        for (let i = 0; i < allSentences.length; i++) {
            const sentence = allSentences[i];
            const paragraphIndex = sentenceToParagraphMap[i];

            const utterance = new SpeechSynthesisUtterance(sentence);

            // 设置语音和语速
            if (selectedVoice) utterance.voice = selectedVoice;
            utterance.rate = rate;
            utterance.volume = 1;

            // 第一个句子的回调
            if (i === 0) {
                utterance.onstart = () => {
                    console.log('[enqueueAllParagraphs] ✅ 第一句开始播放');
                    window.isPlaying = true;
                    window.isStarting = false;

                    const playBtn = document.getElementById('playBtn');
                    if (playBtn) {
                        playBtn.disabled = false;
                        playBtn.style.opacity = '1';
                        playBtn.style.cursor = 'pointer';
                    }

                    updatePlayButton(true);
                    highlightParagraph(paragraphIndex);
                    updateProgress(paragraphIndex, window.paragraphs.length);
                    updateStatus(`🔊 正在朗读 ${paragraphIndex + 1}/${window.paragraphs.length}`);
                };

                utterance.onerror = (e) => {
                    console.error('[enqueueAllParagraphs] ❌ 播放错误:', e.error);
                    window.isStarting = false;
                    window.isPlaying = false;

                    if (e.error !== 'canceled') {
                        updateStatus(`❌ 播放错误: ${e.error}`);
                    }
                };
            } else {
                // 后续句子的回调
                utterance.onstart = () => {
                    console.log(`[enqueueAllParagraphs] 句子 ${i + 1} 开始播放`);
                    window.currentParagraphIndex = paragraphIndex;
                    highlightParagraph(paragraphIndex);
                    updateProgress(paragraphIndex, window.paragraphs.length);
                    updateStatus(`🔊 正在朗读 ${paragraphIndex + 1}/${window.paragraphs.length}`);
                };
            }

            // 最后一个句子结束
            if (i === allSentences.length - 1) {
                utterance.onend = () => {
                    console.log('[enqueueAllParagraphs] ✅ 全部播放完成');
                    window.isPlaying = false;
                    window.currentParagraphIndex = 0;
                    updatePlayButton(false);
                    updateProgress(window.paragraphs.length, window.paragraphs.length);

                    // 检查是否有其他学习记录
                    const allRecords = getAllRecords();
                    if (allRecords.length > 1 && window.autoNextEnabled) {
                        updateStatus(`✅ 本篇播放完成！3秒后自动切换到下一篇...`);
                        // 触发自动下一篇
                        autoNextArticle();
                    } else {
                        const message = allRecords.length <= 1
                            ? '✅ 播放完成！（无其他记录）'
                            : '✅ 播放完成！（自动下一篇已禁用）';
                        updateStatus(message);
                    }
                };
            }

            // 🔧 关键：直接添加到队列，所有speak()都在用户交互上下文中
            window.synthesis.speak(utterance);
        }

        console.log(`[enqueueAllParagraphs] ✅ 已添加 ${allSentences.length} 个句子到TTS队列`);
    }

    // 播放单个段落 - 🔧 已替换为队列策略
    function playParagraph(index) {
        console.log('[playParagraph] 使用队列策略从段落', index, '开始播放');
        // 直接调用队列策略，避免递归导致的 not-allowed 错误
        enqueueAllParagraphs(index);
    }

    // 暂停朗读
    function pauseSpeech() {
        if (window.isPlaying && !window.isPaused) {
            window.synthesis.pause();
            window.isPaused = true;
            updatePlayButton(false);
            updateStatus('⏸️ 已暂停');
        }
    }

    // 停止朗读
    function stopSpeech() {
        window.synthesis.cancel();
        window.isPlaying = false;
        window.isPaused = false;
        window.currentParagraphIndex = 0;
        updatePlayButton(false);
        updateProgress(0, window.paragraphs.length);

        // 移除高亮
        window.paragraphsElements.forEach(elem => {
            elem.classList.remove('speaking');
        });

        // 清理utterance引用，释放内存
        if (window.utterance) {
            window.utterance.onstart = null;
            window.utterance.onend = null;
            window.utterance.onerror = null;
            window.utterance = null;
        }
    }

    // 更新语速（实时应用）
    function updateRate() {
        const rateSlider = document.getElementById('rateSlider');
        const rateValue = document.getElementById('rateValue');

        if (!rateSlider || !rateValue) return;

        const rate = rateSlider.value;
        rateValue.textContent = rate + 'x';

        // 保存用户偏好
        localStorage.setItem('tts-rate', rate);

        // 如果正在播放，实时应用新语速
        if (window.isPlaying && !window.isPaused) {
            // 保存当前段落索引
            const savedIndex = window.currentParagraphIndex;
            // 停止当前播放
            window.synthesis.cancel();
            // 重新开始播放当前段落
            setTimeout(() => {
                playParagraph(savedIndex);
            }, 50);
            updateStatus(`✅ 语速已更新为 ${rate}x`);
        } else if (window.isPaused) {
            updateStatus(`✅ 语速已更新为 ${rate}x，继续播放时生效`);
        }
    }

    // ========================================
    // 学习模式
    // ========================================

    const modeConfig = {
        quick: {
            name: '快速模式',
            rate: 1.0,
            description: '快速复习，适合已掌握内容'
        },
        standard: {
            name: '标准模式',
            rate: 0.5,
            description: '标准学习速度，适合日常学习'
        },
        intensive: {
            name: '缓慢模式',
            rate: 0.25,
            description: '语速较慢，适合仔细学习'
        }
    };

    function switchMode(mode) {
        const config = modeConfig[mode];

        // 停止当前播放
        if (window.isPlaying) {
            stopSpeech();
        }

        // 更新当前模式
        window.currentMode = mode;

        // 保存到localStorage
        localStorage.setItem('tts-mode', mode);

        // 更新语速
        const rateSlider = document.getElementById('rateSlider');
        const rateValue = document.getElementById('rateValue');

        if (rateSlider && rateValue) {
            rateSlider.value = config.rate;
            rateValue.textContent = config.rate + 'x';
            localStorage.setItem('tts-rate', config.rate);
        }

        // 更新按钮样式
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeModeBtn = document.querySelector(`.mode-btn.${mode}`);
        if (activeModeBtn) {
            activeModeBtn.classList.add('active');
        }

        // 显示提示
        updateStatus(`✅ 已切换到${config.name}（${config.description}）`);
    }

    // 初始化完成后设置模式
    function initializeMode() {
        // 检查必要的DOM元素是否存在
        const rateSlider = document.getElementById('rateSlider');
        const rateValue = document.getElementById('rateValue');

        if (!rateSlider || !rateValue) {
            console.warn('DOM元素未准备好，延迟初始化');
            setTimeout(initializeMode, 100);
            return;
        }

        // 加载保存的学习模式
        const savedMode = localStorage.getItem('tts-mode');
        if (savedMode && modeConfig[savedMode]) {
            // 直接设置而不停止播放（因为还没开始播放）
            const config = modeConfig[savedMode];
            currentMode = savedMode;
            localStorage.setItem('tts-mode', savedMode);

            rateSlider.value = config.rate;
            rateValue.textContent = config.rate + 'x';
            localStorage.setItem('tts-rate', config.rate);

            const modeBtns = document.querySelectorAll('.mode-btn');
            modeBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            const activeBtn = document.querySelector(`.mode-btn.${savedMode}`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        } else {
            // 默认使用标准模式
            const config = modeConfig.standard;
            currentMode = 'standard';

            rateSlider.value = config.rate;
            rateValue.textContent = config.rate + 'x';

            const standardModeBtn = document.querySelector('.mode-btn.standard');
            if (standardModeBtn) {
                standardModeBtn.classList.add('active');
            }
        }

        // 延迟显示提示，让用户先看到语音加载信息
        setTimeout(() => {
            updateStatus('💡 点击"播放"开始朗读内容');
        }, 1500);
    }

    // ========================================
    // 划词监听
    // ========================================

    function initSelectionMonitor() {
        let selectionTimer = null;

        // 使用防抖优化性能，避免频繁触发
        document.addEventListener('selectionchange', () => {
            // 🔧 关键修复：在 TTS 播放期间，禁用 selection 监听
            // 避免与 TTS 引擎冲突，导致 IndexSizeError 或 canceled 错误
            if (window.isPlaying || window.isStarting || window.synthesis.speaking) {
                return; // TTS 播放期间，不处理 selection 事件
            }

            // 清除之前的定时器
            if (selectionTimer) {
                clearTimeout(selectionTimer);
            }

            // 延迟 50ms 执行，减少触发频率
            selectionTimer = setTimeout(() => {
                try {
                    const selection = window.getSelection();

                    // 安全检查：确保 selection 有效（使用更安全的检查方式）
                    // 先检查 selection 是否存在，再安全地访问 rangeCount
                    let hasValidRange = false;
                    if (selection && typeof selection.rangeCount === 'number') {
                        try {
                            hasValidRange = selection.rangeCount > 0;
                        } catch (e) {
                            // 如果访问 rangeCount 失败，视为无效
                            hasValidRange = false;
                        }
                    }

                    if (!hasValidRange) {
                        const selectionBtn = document.getElementById('selectionBtn');
                        if (selectionBtn) {
                            selectionBtn.disabled = true;
                            selectionBtn.style.opacity = '0.5';
                            selectionBtn.style.cursor = 'not-allowed';
                        }
                        return;
                    }

                    // 使用 try-catch 包装 toString() 调用，防止选择状态变化时出错
                    let selectedText = '';
                    try {
                        selectedText = selection.toString().trim();
                    } catch (e) {
                        // 如果 toString() 失败，视为无效选择
                        selectedText = '';
                    }

                    const selectionBtn = document.getElementById('selectionBtn');
                    if (!selectionBtn) return;

                    // 检查是否有英文文本被选中
                    if (selectedText.length > 5 && /[a-zA-Z]/.test(selectedText)) {
                        selectionBtn.disabled = false;
                        selectionBtn.style.opacity = '1';
                        selectionBtn.style.cursor = 'pointer';
                    } else {
                        selectionBtn.disabled = true;
                        selectionBtn.style.opacity = '0.5';
                        selectionBtn.style.cursor = 'not-allowed';
                    }
                } catch (error) {
                    // 忽略 selection 相关错误，避免影响页面功能
                    // 这个错误通常来自浏览器扩展，不是我们的代码问题
                    // 包括 IndexSizeError 和其他 selection API 错误
                    // 静默处理，不输出日志
                }
            }, 50);
        });
    }

    // 播放选中的文本
    function playSelection() {
        try {
            const selection = window.getSelection();

            // 安全检查：确保 selection 有效（使用更安全的检查方式）
            let hasValidRange = false;
            if (selection && typeof selection.rangeCount === 'number') {
                try {
                    hasValidRange = selection.rangeCount > 0;
                } catch (e) {
                    // 如果访问 rangeCount 失败，视为无效
                    hasValidRange = false;
                }
            }

            if (!hasValidRange) {
                updateStatus('⚠️ 请先选择要朗读的文本');
                return;
            }

            const selectedText = selection.toString().trim();

            if (selectedText.length === 0) {
                updateStatus('⚠️ 请先选择要朗读的文本');
                return;
            }

            // 获取选中内容的父元素
            const anchorNode = selection.anchorNode;
            if (!anchorNode) {
                updateStatus('⚠️ 无法获取选中文本位置');
                return;
            }

            const parentElement = anchorNode.nodeType === Node.TEXT_NODE ?
                anchorNode.parentElement : anchorNode;

            // 找到选中内容所在的段落索引
            let foundIndex = -1;
            for (let i = 0; i < window.paragraphsElements.length; i++) {
                if (window.paragraphsElements[i].contains(parentElement)) {
                    foundIndex = i;
                    break;
                }
            }

            // 如果正在播放，先停止
            if (window.isPlaying) {
                stopSpeech();
            }

            // 清理文本（移除emoji、转换数字）
            const cleanedText = removeEmojis(selectedText);

            // 创建新的utterance
            window.utterance = new SpeechSynthesisUtterance(cleanedText);

        // 设置语音
        const voiceSelect = document.getElementById('voiceSelect');
        if (voiceSelect && window.enhancedVoices && window.enhancedVoices.length > 0) {
            const selectedIndex = parseInt(voiceSelect.value, 10);
            if (!isNaN(selectedIndex) && window.enhancedVoices[selectedIndex] && window.enhancedVoices[selectedIndex].voice) {
                window.utterance.voice = window.enhancedVoices[selectedIndex].voice;
            }
        }

        // 设置语速
        const rateSlider = document.getElementById('rateSlider');
        if (rateSlider) {
            window.utterance.rate = parseFloat(rateSlider.value);
        }

        // 开始朗读
        window.utterance.onstart = () => {
            window.isPlaying = true;
            window.isPaused = false;
            updatePlayButton(true);
            updateStatus('🔊 正在朗读选中文本...');
        };

        window.utterance.onend = () => {
            window.isPlaying = false;
            window.isPaused = false;
            updatePlayButton(false);
            updateStatus('✅ 选中文本朗读完成');
        };

        window.utterance.onerror = (event) => {
            if (event.error !== 'canceled') {
                console.error('朗读错误:', event.error);
                updateStatus(`❌ 朗读错误: ${event.error}`);
            }
            stopSpeech();
        };

        window.synthesis.speak(window.utterance);
        } catch (error) {
            // 捕获 selection API 错误
            console.error('Selection 播放错误:', error);
            updateStatus('⚠️ 选中文本播放失败，请重试');
        }
    }

    // ========================================
    // TOC 导航
    // ========================================

    function initTOCObserver() {
        const sections = document.querySelectorAll('.section[id]');
        const tocLinks = document.querySelectorAll('.toc a');

        if (sections.length === 0 || tocLinks.length === 0) {
            console.warn('未找到 TOC 章节');
            return;
        }

        // 创建Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 移除所有active类
                    tocLinks.forEach(link => link.classList.remove('active'));

                    // 找到对应的目录链接并添加active类
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.toc a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            // 当章节有50%可见时触发
            threshold: 0.5,
            // 根点为视口顶部100px处
            rootMargin: '-100px 0px -80% 0px'
        });

        // 观察所有章节
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    function initTOCAutoHide() {
        const toc = document.querySelector('.toc');
        const toggleBtn = document.getElementById('tocToggleBtn');

        if (!toc || !toggleBtn) {
            console.warn('未找到 TOC 或切换按钮');
            return;
        }

        // 辅助函数：更新按钮显示状态
        function updateButtonVisibility() {
            if (toc.classList.contains('toc-hidden')) {
                // TOC 隐藏时，显示按钮
                toggleBtn.classList.remove('btn-hidden');
            } else {
                // TOC 显示时，隐藏按钮
                toggleBtn.classList.add('btn-hidden');
            }
        }

        // 初始状态：TOC 可见，按钮隐藏
        toc.classList.add('toc-visible');
        toc.classList.remove('toc-hidden');
        updateButtonVisibility();

        // 3秒后自动隐藏 TOC，显示按钮
        setTimeout(() => {
            toc.classList.remove('toc-visible');
            toc.classList.add('toc-hidden');
            updateButtonVisibility();
            console.log('✅ TOC 已自动隐藏（3秒后）');
        }, 3000);

        // 点击按钮切换 TOC 显示/隐藏
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡

            if (toc.classList.contains('toc-hidden')) {
                // 显示 TOC，隐藏按钮
                toc.classList.remove('toc-hidden');
                toc.classList.add('toc-visible');
                updateButtonVisibility();
                console.log('✅ TOC 已显示（点击按钮）');
            } else {
                // 隐藏 TOC，显示按钮
                toc.classList.remove('toc-visible');
                toc.classList.add('toc-hidden');
                updateButtonVisibility();
                console.log('✅ TOC 已隐藏（点击按钮）');
            }
        });

        // 点击 TOC 内部链接后自动隐藏
        const tocLinks = toc.querySelectorAll('a');
        tocLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    toc.classList.remove('toc-visible');
                    toc.classList.add('toc-hidden');
                    updateButtonVisibility();
                    console.log('✅ TOC 已隐藏（点击链接）');
                }, 300); // 延迟隐藏，让导航有时间跳转
            });
        });

        // 点击页面其他区域隐藏 TOC
        document.addEventListener('click', (e) => {
            // 如果 TOC 是可见的，且点击的不是 TOC 内部或按钮
            if (!toc.classList.contains('toc-hidden') &&
                !toc.contains(e.target) &&
                !toggleBtn.contains(e.target)) {
                toc.classList.remove('toc-visible');
                toc.classList.add('toc-hidden');
                updateButtonVisibility();
                console.log('✅ TOC 已隐藏（点击其他区域）');
            }
        });

        console.log('✅ TOC 自动隐藏和按钮控制已启用（3秒后自动隐藏，点击按钮切换）');
    }

    // ========================================
    // 页面初始化
    // ========================================

    document.addEventListener('DOMContentLoaded', () => {
        console.log('[DOMContentLoaded] 页面加载完成，开始初始化...');
        updateStatus('⏳ 正在加载语音...');

        // 🔧 页面加载时初始化状态
        window.isPlaying = false;
        window.isPaused = false;
        window.isStarting = false;
        window.currentParagraphIndex = 0;

        // 🔧 不要在页面加载时 cancel，这可能导致问题
        // 只记录当前状态
        console.log('[DOMContentLoaded] synthesis 初始状态:', {
            speaking: window.synthesis.speaking,
            pending: window.synthesis.pending,
            paused: window.synthesis.paused
        });

        // 初始化可朗读段落 - 使用 getReadableParagraphs 进行过滤
        const data = getReadableParagraphs();
        window.paragraphs = data.elements;  // 存储元素数组
        window.paragraphsElements = data.elements;

        console.log(`[DOMContentLoaded] ✅ 已加载 ${window.paragraphs.length} 个可朗读段落`);
        if (window.paragraphs.length === 0) {
            console.error('[DOMContentLoaded] ⚠️ 警告：没有找到可朗读的段落！');
        }

        // 延迟初始化以确保语音已加载
        setTimeout(() => {
            initVoices();
        }, 100);

        initTOCObserver();
        initSelectionMonitor();
        initTOCAutoHide();  // 初始化 TOC 自动隐藏和按钮控制
        initUserScrollMonitor();  // 初始化用户滚动监听
    });

    // ========================================
    // 导出全局函数（供 HTML 中的 onclick 使用）
    // ========================================

    window.togglePlay = togglePlay;
    window.pauseSpeech = pauseSpeech;
    window.stopSpeech = stopSpeech;
    window.updateRate = updateRate;
    window.switchMode = switchMode;
    window.playSelection = playSelection;
    window.playFromParagraph = playFromParagraph;

    // ========================================
    // 用户滚动监听 - 延迟恢复自动跟随
    // ========================================

    function initUserScrollMonitor() {
        let lastScrollY = window.scrollY;
        let scrollTimeout = null;
        const SCROLL_THRESHOLD = 50; // 滚动超过50px视为用户手动滚动

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollY);

            // 检测是否为用户手动滚动（滚动距离超过阈值且正在播放）
            if (scrollDelta > SCROLL_THRESHOLD && window.isPlaying && !window.userScrolling) {
                console.log(`[scroll] 检测到用户手动滚动 (delta: ${scrollDelta}px)`);
                window.userScrolling = true;
                window.autoScrollEnabled = false;  // 暂停自动跟随

                // 清除之前的恢复定时器
                if (window.scrollResumeTimer) {
                    clearTimeout(window.scrollResumeTimer);
                }

                // 设置延迟恢复自动跟随
                window.scrollResumeTimer = setTimeout(() => {
                    console.log(`[scroll] ${window.SCROLL_RESUME_DELAY / 1000}秒后恢复自动跟随朗读位置`);
                    window.userScrolling = false;
                    window.autoScrollEnabled = true;
                }, window.SCROLL_RESUME_DELAY);
            }

            lastScrollY = currentScrollY;
        }, { passive: true });

        console.log('[scroll] ✅ 用户滚动监听已启用（手动滚动5秒后恢复自动跟随）');
    }

    // ========================================
    // 修改段落高亮函数 - 支持条件滚动
    // ========================================

    // 保存原始的 highlightParagraph 函数引用
    const originalHighlightParagraph = highlightParagraph;

    // 重写 highlightParagraph 函数
    highlightParagraph = function(index) {
        // 移除之前的高亮
        window.paragraphsElements.forEach(elem => {
            elem.classList.remove('speaking');
        });

        // 添加新的高亮
        if (index < window.paragraphsElements.length) {
            const elem = window.paragraphsElements[index];
            elem.classList.add('speaking');

            // 只在启用自动滚动时才滚动到当前段落
            if (window.autoScrollEnabled) {
                elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log(`[scroll] 自动滚动到段落 ${index}`);
            } else {
                console.log(`[scroll] 跳过自动滚动（用户正在浏览其他位置）`);
            }
        }
    };

    // ========================================
    // 自动下一篇和循环播放功能
    // ========================================

    // 获取所有学习记录列表
    function getAllRecords() {
        const records = [];
        // 尝试从当前页面的目录中获取所有记录
        const tocLinks = document.querySelectorAll('.toc a');
        tocLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.html')) {
                records.push(href);
            }
        });
        return records;
    }

    // 获取当前文章索引
    function getCurrentRecordIndex() {
        const currentPath = window.location.pathname;
        const filename = currentPath.split('/').pop();
        const allRecords = getAllRecords();
        return allRecords.findIndex(record => record.includes(filename));
    }

    // 自动下一篇功能
    function autoNextArticle() {
        if (!window.autoNextEnabled) {
            console.log('[autoNext] 自动下一篇功能已禁用');
            return;
        }

        console.log('[autoNext] 准备自动切换到下一篇文章...');

        // 清除之前的定时器
        if (window.autoNextTimer) {
            clearTimeout(window.autoNextTimer);
        }

        // 3秒后自动切换
        window.autoNextTimer = setTimeout(() => {
            const allRecords = getAllRecords();

            if (allRecords.length === 0) {
                console.log('[autoNext] 未找到其他学习记录');
                updateStatus('✅ 播放完成！（无其他记录）');
                return;
            }

            // 获取当前文章索引
            let currentIndex = getCurrentRecordIndex();
            if (currentIndex === -1) {
                // 如果找不到当前文章，从第一篇开始
                currentIndex = 0;
            } else {
                // 移动到下一篇
                currentIndex = (currentIndex + 1) % allRecords.length;
            }

            const nextRecord = allRecords[currentIndex];
            console.log(`[autoNext] 切换到第 ${currentIndex + 1}/${allRecords.length} 篇: ${nextRecord}`);

            // 显示提示
            updateStatus(`📖 3秒后自动切换到第 ${currentIndex + 1}/${allRecords.length} 篇...`);

            // 延迟跳转（给用户时间看到提示）
            setTimeout(() => {
                window.location.href = nextRecord;
            }, 1000);

        }, window.AUTO_NEXT_DELAY);
    }

    // 在页面加载时初始化记录列表
    function initAutoNext() {
        window.allRecords = getAllRecords();
        window.currentRecordIndex = getCurrentRecordIndex();
        console.log(`[autoNext] 找到 ${window.allRecords.length} 篇学习记录，当前是第 ${window.currentRecordIndex + 1} 篇`);
    }

    // 在DOMContentLoaded中初始化自动下一篇
    document.addEventListener('DOMContentLoaded', () => {
        initAutoNext();
    });

    // 导出全局函数
    window.autoNextArticle = autoNextArticle;
    window.toggleAutoNext = function() {
        window.autoNextEnabled = !window.autoNextEnabled;
        const status = window.autoNextEnabled ? '✅ 已启用自动下一篇' : '❌ 已禁用自动下一篇';
        updateStatus(status);
        console.log(`[autoNext] 自动下一篇功能已${window.autoNextEnabled ? '启用' : '禁用'}`);
    };

})();

\`\`\`

====================================
## 📜 文件 6: scripts/diagnose_tts.js

====================================

\`\`\`javascript
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    const allMessages = [];
    
    page.on('console', msg => {
        const text = msg.text();
        allMessages.push(text);
        
        if (text.includes('canceled') || text.includes('error') || 
            text.includes('voice') || text.includes('语音') ||
            text.includes('播放') || text.includes('enqueue')) {
            console.log(`[${msg.type()}]`, text);
        }
    });
    
    await page.goto('file:///Users/yuzhoudeshengyin/Documents/my_project/english-learning/records/2026-02-24-beginner-tennis-lesson.html');
    
    // 等待页面完全初始化
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('\n=== 页面初始化完成 ===\n');
    
    // 获取初始语音选择
    const initialVoice = await page.evaluate(() => {
        const select = document.getElementById('voiceSelect');
        return {
            value: select?.value,
            text: select?.options[select?.selectedIndex]?.text
        };
    });
    
    console.log('初始语音:', initialVoice);
    
    // 点击播放
    console.log('\n=== 点击播放按钮 ===\n');
    await page.click('#playBtn');
    
    // 等待播放开始
    await new Promise(r => setTimeout(r, 2000));
    
    // 检查是否有 canceled 错误
    const canceledErrors = allMessages.filter(m => m.includes('canceled'));
    
    if (canceledErrors.length > 0) {
        console.log('\n⚠️ 发现 canceled 错误:');
        canceledErrors.forEach(e => console.log('  -', e));
        
        // 分析原因
        console.log('\n=== 分析错误原因 ===');
        
        // 检查是否有语音切换
        const voiceChanges = allMessages.filter(m => m.includes('voice') || m.includes('语音'));
        if (voiceChanges.length > 0) {
            console.log('语音相关日志:');
            voiceChanges.slice(-5).forEach(e => console.log('  -', e));
        }
        
    } else {
        console.log('\n✅ 未发现 canceled 错误');
    }
    
    await new Promise(r => setTimeout(r, 3000));
    
    await browser.close();
})();

\`\`\`

====================================
## 📜 文件 7: scripts/fix_chinese_filter.js

====================================

\`\`\`javascript
const fs = require('fs');
const filePath = '/Users/yuzhoudeshengyin/Documents/my_project/english-learning/scripts/tts-common.js';

let content = fs.readFileSync(filePath, 'utf8');

// 找到收集句子的代码，添加中文过滤
const oldCode = `        for (let i = startIndex; i < window.paragraphs.length; i++) {
            const paragraph = window.paragraphs[i];
            const text = removeEmojis(paragraph.textContent || paragraph.innerText || '');

            if (text.length === 0) {
                console.log('[enqueueAllParagraphs] 跳过空段落:', i);
                continue;
            }

            // 将段落分割成句子
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
            sentences.forEach(sentence => {
                const trimmed = sentence.trim();
                if (trimmed.length > 0) {
                    allSentences.push(trimmed);
                    sentenceToParagraphMap.push(i);
                }
            });
        }`;

const newCode = `        for (let i = startIndex; i < window.paragraphs.length; i++) {
            const paragraph = window.paragraphs[i];
            const text = removeEmojis(paragraph.textContent || paragraph.innerText || '');

            if (text.length === 0) {
                console.log('[enqueueAllParagraphs] 跳过空段落:', i);
                continue;
            }

            // 🔧 过滤：跳过纯中文段落（中文注释），只保留包含英文的内容
            const hasEnglish = /[a-zA-Z]/.test(text);
            const chineseRatio = (text.match(/[\\u4e00-\\u9fa5]/g) || []).length / text.length;
            
            // 如果是纯中文（中文比例超过80%且没有英文），跳过
            if (!hasEnglish && chineseRatio > 0.8) {
                console.log('[enqueueAllParagraphs] 跳过纯中文段落:', i, text.substring(0, 30));
                continue;
            }

            // 将段落分割成句子
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
            sentences.forEach(sentence => {
                const trimmed = sentence.trim();
                if (trimmed.length > 0) {
                    // 再次过滤句子级别的纯中文
                    const sentenceHasEnglish = /[a-zA-Z]/.test(trimmed);
                    if (sentenceHasEnglish) {
                        allSentences.push(trimmed);
                        sentenceToParagraphMap.push(i);
                    }
                }
            });
        }`;

if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ 已添加中文注释过滤功能');
    console.log('- 跳过纯中文段落');
    console.log('- 只朗读包含英文的句子');
} else {
    console.log('❌ 未找到目标代码，可能已修改');
}

\`\`\`

====================================
## 📜 文件 8: scripts/fix_voice_init.js

====================================

\`\`\`javascript
// 修复语音初始化顺序问题
// 问题：设置 voiceSelect.value 后才添加 onchange 监听器，但后续可能还有问题

const fs = require('fs');
const filePath = '/Users/yuzhoudeshengyin/Documents/my_project/english-learning/scripts/tts-common.js';

let content = fs.readFileSync(filePath, 'utf8');

// 查找 initVoices 函数
const oldCode = `        // 加载保存的语音选择
        const savedVoice = localStorage.getItem('tts-voice');
        if (savedVoice !== null) {
            voiceSelect.value = savedVoice;
        }

        // 添加语音变更监听
        voiceSelect.onchange = handleVoiceChange;`;

const newCode = `        // 添加语音变更监听（在设置值之前添加，避免触发）
        voiceSelect.onchange = handleVoiceChange;

        // 加载保存的语音选择
        const savedVoice = localStorage.getItem('tts-voice');
        if (savedVoice !== null) {
            // 🔧 修复：设置值前暂时移除监听器，避免触发 handleVoiceChange
            voiceSelect.onchange = null;
            voiceSelect.value = savedVoice;
            voiceSelect.onchange = handleVoiceChange;
        }`;

if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ 已修复语音初始化顺序问题');
} else {
    console.log('❌ 未找到目标代码');
}

\`\`\`

====================================
## 📊 项目统计信息

====================================

```
总文件数: 9
总目录数: 0
总代码行数: 4224
```

---
**备份完成时间：** 2026-02-25 17:49:02

📂 项目路径：
/Users/yuzhoudeshengyin/Documents/my_project/english-learning/

## 📊 项目统计信息

```
总文件数: 8
总目录数: 3
总代码行数: ~3500+
```

---
**备份完成** 📋
