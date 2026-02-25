# 🧪 英语学习项目 - 用户测试流程

**文档版本**: v1.0
**最后更新**: 2026-02-06
**项目路径**: `/Users/yuzhoudeshengyin/english-learning`

---

## 📋 测试准备

### 启动测试环境

```bash
# 1. 进入项目目录
cd /Users/yuzhoudeshengyin/english-learning

# 2. 停止已有的服务器（如果有）
pkill -f 'http.server 8000'

# 3. 启动HTTP服务器
python3 -m http.server 8000

# 4. 访问项目
# 在浏览器打开: http://localhost:8000
```

### 浏览器准备

- **推荐浏览器**: Chrome 120+, Safari 17+, Firefox 120+
- **开发者工具**: 按F12打开DevTools
- **清除缓存**: Cmd+Shift+R (Chrome), Cmd+Shift+R (Safari)

---

## 第一阶段：核心功能测试 ✅

### 1.1 TTS智能朗读测试

#### 自动化测试脚本

```javascript
// 在浏览器控制台运行
console.log('=== TTS功能测试 ===');

// 1. 语音加载测试
const voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
console.log(`✅ 英文语音数量: ${voices.length}`);
if (voices.length === 0) {
    console.error('❌ 未找到英文语音');
}

// 2. 播放功能测试
const playBtn = document.getElementById('playBtn');
if (playBtn) {
    console.log('✅ 播放按钮存在');

    // 测试点击
    playBtn.click();
    setTimeout(() => {
        console.log(`当前状态: ${document.getElementById('playText').textContent}`);
        console.log(`isPlaying: ${window.isPlaying}`);
    }, 1000);
} else {
    console.error('❌ 播放按钮不存在');
}

// 3. 语音选择器测试
const voiceSelect = document.getElementById('voiceSelect');
if (voiceSelect && voiceSelect.options.length > 0) {
    console.log(`✅ 语音选项: ${voiceSelect.options.length}个`);
    console.log(`默认选择: ${voiceSelect.value}`);
} else {
    console.error('❌ 语音选择器异常');
}

// 4. 语速测试
const rateSlider = document.getElementById('rateSlider');
if (rateSlider) {
    console.log(`✅ 语速范围: ${rateSlider.min} - ${rateSlider.max}`);
    console.log(`当前语速: ${rateSlider.value}x`);
}

// 5. 模式切换测试
['quick', 'standard', 'intensive'].forEach(mode => {
    const btn = document.querySelector(`.mode-btn.${mode}`);
    if (btn) {
        console.log(`✅ ${mode} 模式按钮存在`);
    } else {
        console.error(`❌ ${mode} 模式按钮缺失`);
    }
});
```

#### 手动测试清单

**播放控制**：
- [ ] 点击"播放"按钮，TTS是否开始朗读
- [ ] 按钮文字从"播放"变为"继续"
- [ ] 按钮图标从 ▶️ 变为 ⏸️
- [ ] 段落开始朗读时，是否添加`.speaking`高亮类

**暂停/继续**：
- [ ] 点击"暂停"按钮，朗读是否停止
- [ ] 按钮变为橙色（暂停状态）
- [ ] 点击"继续"按钮，是否从断点恢复
- [ ] 高亮是否恢复到当前朗读段落

**语速切换**：
- [ ] 点击"⚡快速"按钮，语速是否变为1.2x
- [ ] 点击"📚标准"按钮，语速是否变为0.75x
- [ ] 点击"🔥缓慢"按钮，语速是否变为0.5x
- [ ] 切换时当前朗读是否重新开始

**语音选择**：
- [ ] 下拉菜单显示英文语音列表
- [ ] 女声优先显示在最前面
- [ ] 是否有女声/男声分组标签
- [ ] 切换语音时是否实时生效

**划词朗读**：
- [ ] 选中一段英文文本（>5字符）
- [ ] "从划词区域开始"按钮是否激活（不透明）
- [ ] 点击按钮是否朗读选中内容
- [ ] 朗读完成后按钮是否重新禁用

**进度显示**：
- [ ] 进度条是否随朗读进度更新
- [ ] 状态文字显示"正在朗读 X/Y"
- [ ] 高亮段落是否自动滚动到视图中心
- [ ] 朗读完成时显示"✅ 播放完成！"

---

### 1.2 目录导航测试

#### 自动化检查

```javascript
console.log('=== 目录导航测试 ===');

// 1. TOC元素检查
const toc = document.querySelector('.toc');
const toggleBtn = document.getElementById('tocToggleBtn');

console.log('TOC元素:', toc ? '✅ 存在' : '❌ 缺失');
console.log('切换按钮:', toggleBtn ? '✅ 存在' : '❌ 缺失');

// 2. 目录项检查
const tocLinks = document.querySelectorAll('.toc a');
console.log(`目录链接数: ${tocLinks.length}`);
console.log('预期: 6个目录项');

tocLinks.forEach((link, i) => {
    const sectionNumber = link.querySelector('.section-number');
    console.log(`  ${i+1}. ${link.textContent.trim()}`);
});

// 3. 章节对应检查
const sections = document.querySelectorAll('.section[id]');
console.log(`章节总数: ${sections.length}`);
```

#### 手动测试清单

**初始显示**：
- [ ] 页面加载时，左侧目录是否可见
- [ ] 目录是否显示"📑 学习目录"标题
- [ ] 6个章节链接是否全部显示
- [ ] 章节编号是否正确（1-6）

**自动隐藏**：
- [ ] 加载3秒后，目录是否自动隐藏
- [ ] 隐藏时`toc-hidden`类是否添加
- [ ] 目录切换按钮是否出现

**按钮切换**：
- [ ] 点击目录切换按钮（☰），目录是否显示
- [ ] 再次点击按钮，目录是否隐藏
- [ ] 按钮悬停是否有缩放效果
- [ ] 移动端（<1024px）按钮是否隐藏

**点击跳转**：
- [ ] 点击目录项，是否平滑滚动到对应章节
- [ ] 当前章节是否高亮（紫色背景）
- [ ] 点击后3秒，目录是否自动隐藏

**滚动高亮**：
- [ ] 滚动页面时，当前章节是否自动高亮
- [ ] 高亮切换是否平滑
- [ ] 是否有50%可见时才触发切换

---

### 1.3 页面交互测试

#### 滚动功能

```javascript
// 测试滚动监听
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const progress = document.getElementById('readingProgress');
    const backToTop = document.getElementById('backToTop');
    const backToHome = document.getElementById('backToHome');

    console.log(`滚动位置: ${scrollTop}px`);
    console.log(`进度条宽度: ${progress.style.width}`);
    console.log(`回到顶部按钮: ${backToTop.classList.contains('visible') ? '可见' : '隐藏'}`);
});
```

**测试清单**：
- [ ] 向下滚动，阅读进度条是否从左向右增长
- [ ] 滚动超过300px，"回到顶部"按钮是否淡入
- [ ] "回到首页"按钮是否同时显示
- [ ] 点击"回到顶部"，是否平滑滚动到顶部
- [ ] 点击"回到首页"，是否跳转到`index.html`

#### 卡片交互

**测试清单**：
- [ ] 鼠标悬停在词汇卡片上，阴影是否增强
- [ ] 悬停时是否有轻微上移效果（translateY(-2px)）
- [ ] 表达卡片（橙色）悬停效果是否正常
- [ ] 练习区域（绿色）悬停效果是否正常
- [ ] 提示框（蓝色）悬停效果是否正常

#### 链接交互

**测试清单**：
- [ ] 悬停在链接上，颜色是否变为橙色
- [ ] 是否有下划线出现
- [ ] "返回学习列表"链接是否正确跳转
- [ ] 外部链接（YouTube）是否在新标签打开

---

## 第二阶段：内容完整性验证 📚

### 2.1 自动化内容检查

```javascript
function validateContent() {
    console.log('=== 内容完整性检查 ===');

    const issues = [];

    // 1. 检查核心板块
    const requiredSections = [
        { id: 'section-1', name: '内容总览' },
        { id: 'section-2', name: '核心词汇表' },
        { id: 'section-3', name: '地道表达' },
        { id: 'section-4', name: '句型解析' },
        { id: 'section-5', name: '学习任务' },
        { id: 'section-6', name: '学习建议' }
    ];

    console.log('\n📚 核心板块:');
    requiredSections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
            console.log(`  ✅ ${section.name}`);
        } else {
            console.log(`  ❌ ${section.name} - 缺失`);
            issues.push(`缺少板块: ${section.name}`);
        }
    });

    // 2. 检查词汇卡片数量
    const wordCards = document.querySelectorAll('.word-card');
    console.log(`\n📝 词汇卡片: ${wordCards.length}/20`);
    if (wordCards.length !== 20) {
        issues.push(`词汇卡片数量不正确: ${wordCards.length}/20`);
    }

    // 3. 检查表达卡片数量
    const expressionCards = document.querySelectorAll('.expression-card');
    console.log(`💬 表达卡片: ${expressionCards.length}/15`);
    if (expressionCards.length !== 15) {
        issues.push(`表达卡片数量不正确: ${expressionCards.length}/15`);
    }

    // 4. 检查练习数量
    const practiceSections = document.querySelectorAll('.practice-section');
    console.log(`✍️ 练习区域: ${practiceSections.length}/8`);
    if (practiceSections.length < 8) {
        issues.push(`练习数量不足: ${practiceSections.length}/8`);
    }

    // 5. 检查TTS面板
    const ttsPanel = document.getElementById('ttsPanel');
    if (!ttsPanel) {
        issues.push('TTS控制面板缺失');
    }

    // 6. 检查目录
    const toc = document.querySelector('.toc');
    if (!toc) {
        issues.push('目录导航缺失');
    }

    // 7. 检查标题与内容一致性
    const title = document.querySelector('h1').textContent;
    const firstWord = document.querySelector('.word-card h3 strong');
    if (title.includes('YouTube') && firstWord) {
        console.log(`\n🎯 标题一致性检查:`);
        console.log(`  标题: ${title}`);
        console.log(`  首个词汇: ${firstWord.textContent}`);
        // 应该是YouTube相关词汇，如Subscribers, Niche等
    }

    // 总结
    console.log(`\n${issues.length === 0 ? '✅ 所有检查通过！' : `❌ 发现 ${issues.length} 个问题:`}`);
    issues.forEach(issue => console.log(`  - ${issue}`));

    return issues.length === 0;
}

// 运行验证
validateContent();
```

### 2.2 内容质量检查

#### 词汇卡片验证

**检查前5个词汇卡片**：
```javascript
const wordCards = document.querySelectorAll('.word-card');
wordCards.forEach((card, index) => {
    if (index >= 5) return; // 只检查前5个

    console.log(`\n词汇 ${index + 1}:`);

    // 检查必需元素
    const h3 = card.querySelector('h3');
    const strong = h3?.querySelector('strong');
    const code = h3?.querySelector('code');
    const p = card.querySelectorAll('p');
    const blockquote = card.querySelector('blockquote');
    const ul = card.querySelector('ul');

    console.log(`  单词: ${strong?.textContent || '❌ 缺失'}`);
    console.log(`  音标: ${code?.textContent || '❌ 缺失'}`);
    console.log(`  释义: ${p[0]?.textContent.substring(0, 50) || '❌ 缺失'}`);
    console.log(`  例句: ${blockquote ? '✅' : '❌ 缺失'}`);
    console.log(`  搭配: ${ul ? '✅' : '❌ 缺失'}`);
});
```

**验证清单**：
- [ ] 每个词汇卡片包含单词（strong标签）
- [ ] 包含音标（code标签，格式如`/səbˈskraɪbərz/`）
- [ ] 包含中文释义
- [ ] 包含"📖 语境含义"部分
- [ ] 包含"💬 材料中的原句用法"（blockquote）
- [ ] 包含"✍️ 实用例句"（3个场景）
- [ ] 包含场景标记：💼职场、☕日常、📚学术
- [ ] 包含"🔗 习惯搭配"列表

#### 表达卡片验证

```javascript
const expressionCards = document.querySelectorAll('.expression-card');
expressionCards.forEach((card, index) => {
    if (index >= 3) return;

    console.log(`\n表达 ${index + 1}:`);

    const h3 = card.querySelector('h3');
    const strong = h3?.querySelector('strong');

    console.log(`  表达: ${strong?.textContent || '❌'}`);

    // 检查是否有解释、例句、对比
    const content = card.innerHTML;
    console.log(`  📖 释义: ${content.includes('📖 释义') ? '✅' : '❌'}`);
    console.log(`  ✍️ 例句: ${content.includes('✍️ 实用例句') ? '✅' : '❌'}`);
    console.log(`  💡 对比: ${content.includes('💡 同义表达') ? '✅' : '❌'}`);
});
```

**验证清单**：
- [ ] 包含表达和含义
- [ ] 包含"📖 释义"和说明
- [ ] 包含"✍️ 实用例句"（3-5个）
- [ ] 包含"💡 同义表达对比"
- [ ] 橙色渐变背景是否正确

#### 练习题验证

```javascript
const quizzes = document.querySelectorAll('.practice-section');
quizzes.forEach((quiz, index) => {
    const title = quiz.querySelector('h4')?.textContent;
    const hasOptions = quiz.querySelector('ol[type="A"]');
    const hasAnswer = quiz.innerHTML.includes('✅ 正确答案');
    const hasAnalysis = quiz.innerHTML.includes('💡 解析');

    console.log(`题目 ${index + 1}: ${title}`);
    console.log(`  选项: ${hasOptions ? '✅' : '❌'}`);
    console.log(`  答案: ${hasAnswer ? '✅' : '❌'}`);
    console.log(`  解析: ${hasAnalysis ? '✅' : '❌'}`);
});
```

**验证清单**：
- [ ] 阅读理解题有5道
- [ ] 每题有A/B/C/D四个选项
- [ ] 包含正确答案（✅ 正确答案：X）
- [ ] 包含答案解析（💡 解析）
- [ ] 写作练习有3个
- [ ] 练习有提示和参考思路

### 2.3 四个学习记录对比验证

```bash
# 在终端运行
cd /Users/yuzhoudeshengyin/english-learning/records

echo "=== 四个学习记录对比检查 ==="
echo ""

for file in 2026-02-06-*.html; do
    echo "📄 $(basename $file)"

    # 提取标题
    title=$(grep '<h1>' "$file" | sed 's/<[^>]*>//g' | head -1)
    echo "  标题: $title"

    # 统计词汇
    words=$(grep -c '<h3>[0-9]\+\. <strong>' "$file")
    echo "  词汇: $words 个"

    # 统计表达
    expressions=$(grep -c 'expression-card' "$file")
    echo "  表达: $expressions 个"

    # 统计练习
    practices=$(grep -c 'practice-section' "$file")
    echo "  练习: $practices 个"

    # 检查公共资源引用
    css_refs=$(grep -c 'common.css\|tts-common.css' "$file")
    js_refs=$(grep -c 'tts-common.js\|page-common.js' "$file")
    echo "  公共CSS: $css_refs 个"
    echo "  公共JS: $js_refs 个"

    # 检查文件大小
    size=$(wc -l < "$file")
    echo "  总行数: $size 行"

    # 验证标准
    if [ $words -eq 20 ] && [ $expressions -eq 15 ] && [ $css_refs -eq 2 ] && [ $js_refs -eq 2 ]; then
        echo "  ✅ 符合标准"
    else
        echo "  ❌ 需要检查"
    fi

    echo ""
done
```

**验证清单**：
- [ ] 4个文件的词汇数都是20
- [ ] 4个文件的表达数都是15
- [ ] 4个文件都有8个练习
- [ ] 4个文件都引用了2个CSS文件
- [ ] 4个文件都引用了2个JS文件
- [ ] 4个文件的行数相近（<2000行优化后）

---

## 第三阶段：兼容性测试 🌐

### 3.1 浏览器兼容性测试

#### 多浏览器启动

```bash
# macOS 快速测试
cd /Users/yuzhoudeshengyin/english-learning

echo "启动多浏览器测试..."
open -a "Google Chrome" http://localhost:8000
open -a "Safari" http://localhost:8000
open -a "Firefox" http://localhost:8000 2>/dev/null || echo "Firefox未安装"
```

#### 浏览器测试矩阵

| 浏览器 | 版本要求 | 测试重点 | 状态 |
|-------|---------|---------|------|
| **Chrome** | 120+ | 全功能 | [ ] |
| **Safari** | 17+ | TTS、动画 | [ ] |
| **Firefox** | 120+ | 语音合成 | [ ] |
| **Edge** | 120+ | 兼容性 | [ ] |

**各浏览器测试要点**：

**Chrome**：
- [ ] TTS语音列表是否正确
- [ ] 语音选择是否生效
- [ ] CSS Grid布局是否正常
- [ ] 渐变动画是否流畅

**Safari**：
- [ ] 语音合成API是否支持
- [ ] 滚动动画是否平滑
- [ ] 字体渲染是否清晰
- [ ] Flexbox布局是否正确

**Firefox**：
- [ ] CSS变量是否正确解析
- [ ] Intersection Observer是否工作
- [ ] 语音合成是否可用
- [ ] 表情符号是否显示

**Edge**：
- [ ] 所有Chrome功能是否兼容
- [ ] 性能是否良好

### 3.2 响应式设计测试

#### 设备模拟测试

```javascript
// Chrome DevTools设备模拟
const devices = [
    { name: 'iPhone SE', width: 375, height: 667, userAgent: 'iPhone' },
    { name: 'iPad Pro', width: 1024, height: 1366, userAgent: 'iPad' },
    { name: 'Desktop 1920', width: 1920, height: 1080, userAgent: 'Desktop' },
    { name: 'Desktop 2560', width: 2560, height: 1440, userAgent: 'Desktop' }
];

console.log('=== 响应式测试建议 ===');
devices.forEach(device => {
    console.log(`\n📱 ${device.name} (${device.width}x${device.height})`);

    if (device.width < 768) {
        console.log('  - TOC应该隐藏');
        console.log('  - 字号适当缩小');
        console.log('  - 间距减小');
    } else if (device.width < 1024) {
        console.log('  - 平板布局');
        console.log('  - TOC可选显示');
    } else {
        console.log('  - 桌面布局');
        console.log('  - TOC应该显示');
    }
});
```

**手动测试清单**：

**移动端（<768px）**：
- [ ] TOC目录完全隐藏
- [ ] 目录切换按钮隐藏
- [ ] 容器padding减小到40px 20px
- [ ] 卡片padding适配
- [ ] 文字大小可读
- [ ] 按钮足够大，易于点击
- [ ] 无横向滚动条

**平板端（768-1024px）**：
- [ ] TOC目录隐藏
- [ ] 布局居中适配
- [ ] 卡片间距合理

**桌面端（>1024px）**：
- [ ] TOC目录显示
- [ ] 最大宽度840px居中
- [ ] 间距舒适
- [ ] 悬停效果流畅

**横屏测试**：
- [ ] 旋转设备时布局是否自适应
- [ ] 横屏时TOC是否正确显示/隐藏

---

## 第四阶段：性能测试 ⚡

### 4.1 加载性能测试

```javascript
// 在页面加载后运行
window.addEventListener('load', () => {
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];

        console.log('=== 加载性能报告 ===');
        console.log(`⏱️ DNS查询: ${(perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(0)}ms`);
        console.log(`🔌 TCP连接: ${(perfData.connectEnd - perfData.connectStart).toFixed(0)}ms`);
        console.log(`📡 请求响应: ${(perfData.responseEnd - perfData.requestStart).toFixed(0)}ms`);
        console.log(`📄 DOM解析: ${(perfData.domComplete - perfData.domInteractive).toFixed(0)}ms`);
        console.log(`🚀 页面加载: ${(perfData.loadEventEnd - perfData.fetchStart).toFixed(0)}ms`);

        // 资源加载
        const resources = performance.getEntriesByType('resource');
        console.log(`\n📦 资源统计:`);
        console.log(`  总资源数: ${resources.length}`);

        let totalSize = 0;
        resources.forEach(r => totalSize += r.transferSize);
        console.log(`  总大小: ${(totalSize / 1024).toFixed(2)} KB`);

        // 分类统计
        const cssResources = resources.filter(r => r.name.endsWith('.css'));
        const jsResources = resources.filter(r => r.name.endsWith('.js'));

        console.log(`\n  CSS文件: ${cssResources.length} 个`);
        cssResources.forEach(r => {
            console.log(`    - ${r.name.split('/').pop()}: ${(r.transferSize / 1024).toFixed(2)} KB`);
        });

        console.log(`\n  JS文件: ${jsResources.length} 个`);
        jsResources.forEach(r => {
            console.log(`    - ${r.name.split('/').pop()}: ${(r.transferSize / 1024).toFixed(2)} KB`);
        });

        // 性能评估
        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
        console.log(`\n${loadTime < 2000 ? '✅ 优秀' : loadTime < 3000 ? '⚠️ 良好' : '❌ 需优化'}`);
    }, 1000);
});
```

**性能基准**：
- [ ] 首次内容绘制 (FCP) < 1.5秒
- [ ] 最大内容绘制 (LCP) < 2.5秒
- [ ] 首次输入延迟 (FID) < 100ms
- [ ] 累积布局偏移 (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3.5秒

### 4.2 资源大小检查

```bash
# 资源大小统计
cd /Users/yuzhoudeshengyin/english-learning

echo "=== 资源大小统计 ==="
echo ""

echo "📨 CSS文件:"
ls -lh styles/*.css | awk '{printf "  %-30s %s\n", $9, $5}'

echo ""
echo "📜 JS文件:"
ls -lh scripts/*.js | awk '{printf "  %-30s %s\n", $9, $5}'

echo ""
echo "📄 HTML文件:"
ls -lh records/*.html | awk '{
    size = $5
    gsub(/K/, " KB", size)
    printf "  %-30s %s\n", $9, size
}'

echo ""
echo "📊 总大小:"
du -sh styles/ scripts/ records/

echo ""
echo "=== 优化目标 ==="
echo "CSS文件: < 15KB"
echo "JS文件: < 50KB"
echo "单个HTML: < 100KB"
```

**检查清单**：
- [ ] common.css < 15KB
- [ ] tts-common.css < 15KB
- [ ] tts-common.js < 50KB
- [ ] page-common.js < 10KB
- [ ] 单个HTML文件 < 100KB（优化后）

---

### 4.3 TTS性能测试

```javascript
// TTS性能检查
function testTTSPerformance() {
    console.log('=== TTS性能测试 ===');

    // 1. 语音加载速度
    const startTime = Date.now();
    const voices = speechSynthesis.getVoices();
    const loadTime = Date.now() - startTime;
    console.log(`语音加载时间: ${loadTime}ms`);

    // 2. 播放延迟测试
    const testBtn = document.getElementById('playBtn');
    if (testBtn && !window.isPlaying) {
        const startPlay = Date.now();
        testBtn.click();

        // 等待播放开始
        const checkInterval = setInterval(() => {
            if (window.isPlaying) {
                clearInterval(checkInterval);
                const playDelay = Date.now() - startPlay;
                console.log(`播放延迟: ${playDelay}ms`);
                console.log(playDelay < 500 ? '✅ 优秀' : '⚠️ 需优化');
            }
        }, 100);

        // 10秒后停止检查
        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    // 3. 语音切换延迟
    const voiceSelect = document.getElementById('voiceSelect');
    if (voiceSelect) {
        const switchStart = Date.now();
        voiceSelect.selectedIndex = 1;
        voiceSelect.dispatchEvent(new Event('change'));
        const switchTime = Date.now() - switchStart;
        console.log(`语音切换延迟: ${switchTime}ms`);
    }
}

testTTSPerformance();
```

**性能指标**：
- [ ] 语音加载 < 100ms
- [ ] 播放延迟 < 500ms
- [ ] 语音切换 < 100ms
- [ ] 段落切换延迟 < 100ms

---

## 第五阶段：用户体验测试 😊

### 5.1 新用户首次访问测试

#### 场景1：完全新用户

```
测试步骤:
1. 打开 http://localhost:8000
   ✅ 期望: 页面在3秒内完全加载
   ✅ 期望: 看到4个学习卡片，排列整齐
   ✅ 期望: 每个卡片显示标题、预览、统计信息

2. 将鼠标悬停在卡片上
   ✅ 期望: 卡片有hover效果（阴影增强、轻微上移）
   ✅ 期望: 光标变为手型指针

3. 点击第一个学习记录
   ✅ 期望: 新页面平滑打开
   ✅ 期望: URL变为 /records/2026-02-06-month-alone-chiang-mai.html
   ✅ 期望: 顶部有"返回学习列表"链接

4. 观察TTS面板
   ✅ 期望: TTS面板固定在顶部
   ✅ 期望: 看到"🎙️ 智能朗读助手"标题
   ✅ 期望: "播放"按钮清晰可见（绿色背景）
   ✅ 期望: 状态文字显示"💡 点击"播放"开始朗读内容"

5. 点击"播放"按钮
   ✅ 期望: 按钮变为"继续"（⏸️图标）
   ✅ 期望: 开始朗读第一段
   ✅ 期望: 当前段落高亮（黄色背景）
   ✅ 期望: 进度条开始增长

6. 听取10秒
   ✅ 期望: 语音清晰，速度适中
   ✅ 期望: 高亮跟随朗读进度
   ✅ 期望: 自动滚动到可见区域

7. 点击"暂停"
   ✅ 期望: 朗读立即停止
   ✅ 期望: 按钮变为橙色（暂停状态）

8. 点击"继续"
   ✅ 期望: 从断点恢复朗读
   ✅ 期望: 按钮恢复绿色

9. 观察目录
   ✅ 期望: 左侧显示6个章节
   ✅ 期望: 3秒后自动隐藏
   ✅ 期望: 出现目录切换按钮

10. 点击目录切换按钮
    ✅ 期望: 目录重新显示
    ✅ 期望: 当前章节高亮（紫色背景）

11. 点击目录中的"2. 核心词汇表"
    ✅ 期望: 页面平滑滚动到词汇部分
    ✅ 期望: 3秒后目录自动隐藏

12. 向下滚动页面
    ✅ 期望: 顶部进度条随滚动增长
    ✅ 期望: 滚动超过300px后，出现"回到顶部"按钮

13. 点击"回到顶部"
    ✅ 期望: 平滑滚动到页面顶部
    ✅ 期望: 按钮消失

14. 观察词汇卡片
    ✅ 期望: 卡片有白色背景和紫色左边框
    ✅ 期望: 悬停时有阴影增强效果
    ✅ 期望: 布局整洁，间距合理

15. 阅读第一个词汇
    ✅ 期望: 单词、音标、释义清晰
    ✅ 期望: 例句有场景标记（💼职场、☕日常、📚学术）
    ✅ 期望: 有习惯搭配列表

16. 向下滚动到表达部分
    ✅ 期望: 表达卡片为橙色渐变背景
    ✅ 期望: 与词汇卡片视觉区分明显

17. 点击"快速"模式
    ✅ 期望: 按钮变为绿色（激活状态）
    ✅ 期望: 语速变为1.2x

18. 点击"缓慢"模式
    ✅ 期望: 按钮变为红色（激活状态）
    ✅ 期望: 语速变为0.5x，明显变慢

19. 选中一段文本
    ✅ 期望: "从划词区域开始"按钮变为可用状态
    ✅ 期望: 点击后朗读选中内容

20. 点击"返回学习列表"
    ✅ 期望: 返回首页
    ✅ 期望: 浏览器历史记录正常
```

#### 场景2：移动端用户

```
测试步骤（使用iPhone模拟器或真实设备）:
1. 手机浏览器访问 http://localhost:8000
   ✅ 期望: 页面适配小屏幕
   ✅ 期望: 卡片单列显示
   ✅ 期望: 文字大小适合阅读

2. 点击学习记录
   ✅ 期望: 页面正常打开
   ✅ 期望: TOC目录不显示
   ✅ 期望: TTS面板适配屏幕宽度

3. 点击"播放"
   ✅ 期望: TTS正常工作
   ✅ 期望: 按钮大小适合触摸（>44px）

4. 触摸滚动
   ✅ 期望: 滚动流畅
   ✅ 期望: 无横向滚动条

5. 旋转设备（横屏）
   ✅ 期望: 布局自适应
   ✅ 期望: 内容无遮挡
```

### 5.2 可访问性测试

```javascript
function checkAccessibility() {
    console.log('=== 可访问性检查 ===');

    // 1. 键盘导航
    const focusableElements = document.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select'
    );
    console.log(`\n⌨️ 可聚焦元素: ${focusableElements.length}`);

    // 2. 按钮可访问性
    const buttons = document.querySelectorAll('button');
    let buttonIssues = 0;
    buttons.forEach(btn => {
        const text = btn.textContent.trim();
        const ariaLabel = btn.getAttribute('aria-label');
        if (!text && !ariaLabel) {
            console.warn(`❌ 按钮缺少文本或aria-label:`, btn);
            buttonIssues++;
        }
    });
    console.log(`按钮可访问性: ${buttons.length - buttonIssues}/${buttons.length} 通过`);

    // 3. 颜色对比度
    const bodyStyles = window.getComputedStyle(document.body);
    const bgColor = bodyStyles.backgroundColor;
    const textColor = bodyStyles.color;
    console.log(`\n🎨 颜色信息:`);
    console.log(`  背景色: ${bgColor}`);
    console.log(`  文字色: ${textColor}`);

    // 4. 语义化HTML
    const hasH1 = document.querySelector('h1');
    const h2s = document.querySelectorAll('h2');
    const hasMain = document.querySelector('main') || document.querySelector('.container');
    console.log(`\n📝 语义化标签:`);
    console.log(`  H1标题: ${hasH1 ? '✅' : '❌'}`);
    console.log(`  H2标题: ${h2s.length}个`);
    console.log(`  主容器: ${hasMain ? '✅' : '❌'}`);

    // 5. ARIA属性
    const ariaElements = document.querySelectorAll('[aria-label], [aria-hidden]');
    console.log(`\n♿ ARIA元素: ${ariaElements.length}个`);

    return buttonIssues === 0;
}

checkAccessibility();
```

**可访问性清单**：
- [ ] 所有交互功能可通过键盘访问（Tab键）
- [ ] 焦点状态清晰可见（outline样式）
- [ ] 颜色对比度≥4.5:1（WCAG AA标准）
- [ ] 按钮有清晰的文字标签或aria-label
- [ ] 链接有下划线或颜色区分
- [ ] 图片有alt属性（如果有图片）
- [ ] 语义化HTML标签（h1, h2, nav, main等）
- [ ] 表单元素有label（如果有表单）

---

## 第六阶段：回归测试 🔄

### 6.1 更新后验证流程

**每次代码更新后必须执行**：

```bash
#!/bin/bash
# 回归测试脚本

echo "=== 回归测试 ==="

# 1. 清理并重启服务器
pkill -f 'http.server 8000'
sleep 1
cd /Users/yuzhoudeshengyin/english-learning
python3 -m http.server 8000 &
SERVER_PID=$!
echo "✅ 服务器已启动 (PID: $SERVER_PID)"

# 2. 等待服务器就绪
sleep 2

# 3. 检查文件完整性
echo ""
echo "📁 文件检查:"
for file in records/2026-02-06-*.html; do
    if [ -f "$file" ]; then
        size=$(wc -l < "$file")
        echo "  ✅ $(basename $file): $size 行"
    else
        echo "  ❌ $(basename $file): 文件不存在"
    fi
done

# 4. 检查公共资源
echo ""
echo "📦 公共资源:"
for resource in styles/common.css styles/tts-common.css scripts/tts-common.js scripts/page-common.js; do
    if [ -f "$resource" ]; then
        echo "  ✅ $(basename $resource)"
    else
        echo "  ❌ $(basename $resource) 缺失"
    fi
done

# 5. 检查data.json
echo ""
echo "📊 data.json检查:"
RECORD_COUNT=$(jq '.records | length' data.json)
echo "  记录数: $RECORD_COUNT"
if [ "$RECORD_COUNT" -eq 4 ]; then
    echo "  ✅ 记录数正确"
else
    echo "  ❌ 记录数不正确，应为4"
fi

echo ""
echo "=== 测试说明 ==="
echo "1. 在浏览器打开 http://localhost:8000"
echo "2. 在每个学习记录页面运行快速测试脚本"
echo "3. 验证TTS、导航、内容完整性"
echo ""
echo "停止服务器: kill $SERVER_PID"
echo ""
```

### 6.2 自动化回归测试

```javascript
/**
 * 快速回归测试脚本
 * 在每个学习记录页面的控制台运行
 */
function runRegressionTests() {
    console.log('🧪 开始回归测试...\n');

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    function test(name, condition) {
        const passed = !!condition;
        results.passed += passed ? 1 : 0;
        results.failed += passed ? 0 : 1;
        results.tests.push({ name, passed });
        console.log(`${passed ? '✅' : '❌'} ${name}`);
    }

    // 基础结构
    console.log('\n1️⃣ 基础结构');
    test('TTS面板存在', document.getElementById('ttsPanel'));
    test('播放按钮存在', document.getElementById('playBtn'));
    test('进度条存在', document.getElementById('readingProgress'));
    test('目录存在', document.querySelector('.toc'));
    test('目录切换按钮存在', document.getElementById('tocToggleBtn'));

    // 内容数量
    console.log('\n2️⃣ 内容数量');
    const wordCards = document.querySelectorAll('.word-card');
    test(`词汇卡片 (20)`, wordCards.length === 20);

    const expressionCards = document.querySelectorAll('.expression-card');
    test(`表达卡片 (15)`, expressionCards.length === 15);

    const practiceSections = document.querySelectorAll('.practice-section');
    test(`练习区域 (≥8)`, practiceSections.length >= 8);

    const sections = document.querySelectorAll('.section[id]');
    test(`章节板块 (6)`, sections.length === 6);

    // 公共资源
    console.log('\n3️⃣ 公共资源');
    const hasCommonCSS = document.querySelector('link[href*="common.css"]');
    test('基础CSS引用', hasCommonCSS);

    const hasTTSCSS = document.querySelector('link[href*="tts-common.css"]');
    test('TTS CSS引用', hasTTSCSS);

    const hasTTSJS = document.querySelector('script[src*="tts-common.js"]');
    test('TTS JS引用', hasTTSJS);

    const hasPageJS = document.querySelector('script[src*="page-common.js"]');
    test('页面JS引用', hasPageJS);

    // TTS状态
    console.log('\n4️⃣ TTS状态');
    test('isPlaying变量存在', typeof window.isPlaying !== 'undefined');
    test('isPaused变量存在', typeof window.isPaused !== 'undefined');
    test('currentMode变量存在', typeof window.currentMode !== 'undefined');

    // 导航元素
    console.log('\n5️⃣ 导航元素');
    const backLink = document.querySelector('.back-link');
    test('返回链接存在', backLink);

    const backToTop = document.getElementById('backToTop');
    test('回到顶部按钮存在', backToTop);

    const backToHome = document.getElementById('backToHome');
    test('回到首页按钮存在', backToHome);

    // 总结
    console.log('\n' + '='.repeat(50));
    console.log(`总计: ${results.tests.length} 个测试`);
    console.log(`通过: ${results.passed} (${(results.passed/results.tests.length*100).toFixed(1)}%)`);
    console.log(`失败: ${results.failed}`);

    if (results.failed > 0) {
        console.log('\n❌ 失败的测试:');
        results.tests.filter(t => !t.passed).forEach(t => {
            console.log(`  - ${t.name}`);
        });
    } else {
        console.log('\n✅ 所有测试通过！');
    }

    return results.failed === 0;
}

// 运行测试
runRegressionTests();
```

---

## 📊 测试报告模板

```markdown
# 英语学习项目测试报告

**测试日期**: YYYY-MM-DD
**测试人员**: [姓名]
**测试环境**: macOS, Chrome 120+, http://localhost:8000

---

## 一、测试结果概览

| 模块 | 测试用例 | 通过 | 失败 | 通过率 |
|-----|---------|------|------|--------|
| TTS功能 | 8 | 8 | 0 | 100% |
| 导航功能 | 7 | 7 | 0 | 100% |
| 内容完整性 | 6 | 5 | 1 | 83% |
| 性能 | 4 | 4 | 0 | 100% |
| 兼容性 | 4 | 3 | 1 | 75% |
| 可访问性 | 5 | 4 | 1 | 80% |
| **总计** | **34** | **31** | **3** | **91%** |

---

## 二、发现的问题

### 问题 1: [问题标题]
- **严重程度**: 高/中/低
- **影响范围**: 具体模块或页面
- **复现步骤**:
  1. 步骤1
  2. 步骤2
  3. 步骤3
- **预期结果**: 应该发生什么
- **实际结果**: 实际发生了什么
- **截图/日志**: [如有]
- **建议修复**: [修复建议]

---

## 三、性能指标

| 指标 | 目标值 | 实际值 | 状态 |
|-----|--------|--------|------|
| 首次内容绘制 (FCP) | <1.5s | 1.2s | ✅ |
| 最大内容绘制 (LCP) | <2.5s | 2.1s | ✅ |
| 首次输入延迟 (FID) | <100ms | 85ms | ✅ |
| 累积布局偏移 (CLS) | <0.1 | 0.05 | ✅ |
| 页面加载时间 | <3s | 2.5s | ✅ |

---

## 四、改进建议

### 高优先级
1. [建议1]
2. [建议2]

### 中优先级
1. [建议3]
2. [建议4]

### 低优先级
1. [建议5]

---

## 五、总体评价

**综合评分**: 优秀/良好/需改进

**优点**:
- [优点1]
- [优点2]

**待改进**:
- [不足1]
- [不足2]

**建议下次测试重点**:
- [测试重点1]
- [测试重点2]

---

## 附录：测试环境

- **操作系统**: macOS 14.x
- **浏览器**: Chrome 120.x, Safari 17.x
- **屏幕分辨率**: 1920x1080, 375x667 (移动)
- **网络状况**: 本地 (localhost)
- **特殊配置**: [如有]
```

---

## ✅ 快速测试命令汇总

```bash
# 1. 启动服务器
cd /Users/yuzhoudeshengyin/english-learning
python3 -m http.server 8000

# 2. 检查文件完整性
ls -lh styles/ scripts/ records/

# 3. 统计代码行数
wc -l styles/*.css scripts/*.js records/*.html

# 4. 查找错误（如果有）
grep -r "ERROR\|FIXME\|BUG" records/ styles/ scripts/

# 5. 停止服务器
pkill -f 'http.server 8000'

# 6. 在浏览器打开
open http://localhost:8000
```

---

**文档维护**: 本文档应在每次功能更新后同步更新。
**问题反馈**: 发现问题请记录在测试报告的"发现的问题"部分。
