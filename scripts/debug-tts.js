// ========================================
// TTS 调试脚本 - 在浏览器控制台运行
// ========================================
// 使用方法：复制整个代码块，粘贴到浏览器控制台（按F12打开）

console.log('=== TTS 调诊断开始 ===\n');

// 1. 检查全局变量
console.log('1. 检查全局变量:');
console.log('  - window.synthesis:', window.synthesis ? '✅ 存在' : '❌ 不存在');
console.log('  - window.voices:', window.voices ? `✅ ${window.voices.length}个` : '❌ 不存在');
console.log('  - window.enhancedVoices:', window.enhancedVoices ? `✅ ${window.enhancedVoices.length}个` : '❌ 不存在');
console.log('  - window.paragraphs:', window.paragraphs ? `✅ ${window.paragraphs.length}个段落` : '❌ 不存在');
console.log('  - window.paragraphsElements:', window.paragraphsElements ? `✅ ${window.paragraphsElements.length}个元素` : '❌ 不存在');
console.log('  - window.isPlaying:', window.isPlaying);
console.log('  - window.isPaused:', window.isPaused);
console.log('');

// 2. 检查DOM元素
console.log('2. 检查DOM元素:');
const elements = {
    'playBtn': '播放按钮',
    'voiceSelect': '语音选择器',
    'rateSlider': '语速滑块',
    'ttsStatus': 'TTS状态',
    'readingProgress': '阅读进度条'
};

for (const [id, name] of Object.entries(elements)) {
    const el = document.getElementById(id);
    if (el) {
        console.log(`  ✅ ${name} (#${id}) 存在`);
    } else {
        console.log(`  ❌ ${name} (#${id}) 不存在`);
    }
}
console.log('');

// 3. 检查语音
console.log('3. 检查语音系统:');
const allVoices = window.synthesis.getVoices();
const englishVoices = allVoices.filter(v => v.lang.startsWith('en'));
console.log(`  - 总语音数: ${allVoices.length}`);
console.log(`  - 英文语音数: ${englishVoices.length}`);
if (englishVoices.length > 0) {
    console.log('  - 前3个英文语音:');
    englishVoices.slice(0, 3).forEach((v, i) => {
        console.log(`    ${i + 1}. ${v.name} (${v.lang})`);
    });
} else {
    console.log('  ⚠️ 没有找到英文语音！');
}
console.log('');

// 4. 检查段落
console.log('4. 检查可朗读段落:');
if (window.paragraphs && window.paragraphs.length > 0) {
    console.log(`  ✅ 找到 ${window.paragraphs.length} 个段落`);
    console.log('  前3个段落预览:');
    window.paragraphs.slice(0, 3).forEach((p, i) => {
        const text = p.textContent ? p.textContent.trim() : p.innerText ? p.innerText.trim() : '';
        const preview = text.substring(0, 60);
        console.log(`    ${i + 1}. ${preview}${text.length > 60 ? '...' : ''}`);
    });
} else {
    console.log('  ❌ 没有找到可朗读的段落！');
    console.log('  尝试重新获取...');
    const content = document.querySelector('.container');
    if (content) {
        const allParagraphs = content.querySelectorAll('p, h1, h2, h3, h4, li, blockquote');
        console.log(`    - 容器内找到 ${allParagraphs.length} 个元素`);
    }
}
console.log('');

// 5. 检查TTS状态
console.log('5. 检查TTS状态:');
const ttsStatus = document.getElementById('ttsStatus');
if (ttsStatus) {
    console.log(`  - 状态文字: "${ttsStatus.textContent}"`);
}
const playBtn = document.getElementById('playBtn');
if (playBtn) {
    console.log(`  - 播放按钮文字: "${playBtn.textContent}"`);
}
console.log('');

// 6. 尝试手动触发播放测试
console.log('6. 播放测试:');
console.log('  尝试手动朗读第一段...');
if (window.paragraphs && window.paragraphs.length > 0) {
    const firstParagraph = window.paragraphs[0];
    const text = firstParagraph.textContent ? firstParagraph.textContent.trim() : '';

    if (text.length > 20) {
        console.log(`  - 第一段文本长度: ${text.length} 字符`);
        console.log(`  - 预览: "${text.substring(0, 50)}..."`);

        // 创建测试utterance
        try {
            const testUtterance = new SpeechSynthesisUtterance('Hello, this is a test.');
            testUtterance.onstart = () => console.log('  ✅ 测试语音开始播放');
            testUtterance.onerror = (e) => console.log(`  ❌ 测试语音错误: ${e.error}`);
            testUtterance.onend = () => console.log('  ✅ 测试语音播放完成');

            window.synthesis.speak(testUtterance);
            console.log('  - 测试语音已触发，请检查是否有声音');
        } catch (error) {
            console.log(`  ❌ 创建测试语音失败: ${error.message}`);
        }
    } else {
        console.log('  ⚠️ 第一段文本太短，可能不适合朗读');
    }
} else {
    console.log('  ❌ 没有段落可以测试');
}
console.log('');

// 7. 检查可能的问题
console.log('7. 可能的问题诊断:');
const issues = [];

if (!window.paragraphs || window.paragraphs.length === 0) {
    issues.push('❌ 没有可朗读的段落 - 可能是getReadableParagraphs()函数问题');
}

if (englishVoices.length === 0) {
    issues.push('❌ 没有英文语音 - 请检查浏览器语音设置');
}

if (!document.getElementById('playBtn')) {
    issues.push('❌ 播放按钮不存在 - DOM结构问题');
}

if (issues.length > 0) {
    console.log('  发现的问题:');
    issues.forEach(issue => console.log(`    ${issue}`));
} else {
    console.log('  ✅ 未发现明显问题');
}
console.log('');

console.log('=== 调诊断束 ===');
console.log('');
console.log('💡 提示：如果以上都正常但仍无法播放，请检查：');
console.log('   1. 浏览器是否允许网页播放音频（地址栏左侧可能有静音图标）');
console.log('   2. 系统音量是否开启');
console.log('   3. 浏览器控制台的Console标签是否有其他错误信息');
