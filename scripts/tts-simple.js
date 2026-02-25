/**
 * ========================================
 * TTS 极简版 - 只保留核心功能
 * ========================================
 */

// 全局变量（最少化）
const synthesis = window.speechSynthesis;
let currentUtterance = null;
let isPlaying = false;

// 获取可朗读段落
function getParagraphs() {
    const container = document.querySelector('.container');
    if (!container) return [];

    const paragraphs = container.querySelectorAll('p, h1, h2, h3, li, blockquote');
    const readable = [];

    paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (text.length > 20 && /[a-zA-Z]/.test(text)) {
            readable.push(p);
        }
    });

    return readable;
}

// 播放单个段落
function playParagraph(paragraph, voice = null, rate = 1) {
    // 只在正在播放时才停止
    if (isPlaying) {
        synthesis.cancel();
        // 等待一小段时间让 cancel 完成
        setTimeout(() => speakParagraph(paragraph, voice, rate), 50);
        return;
    }

    speakParagraph(paragraph, voice, rate);
}

// 内部函数：真正执行播放
function speakParagraph(paragraph, voice = null, rate = 1) {
    // 获取文本
    const text = paragraph.textContent.trim();
    if (!text) return;

    // 创建utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // 设置语音和语速
    if (voice) utterance.voice = voice;
    utterance.rate = rate;

    // 事件处理
    utterance.onstart = () => {
        isPlaying = true;
        console.log('🔊 开始播放');
        paragraph.classList.add('speaking');
    };

    utterance.onend = () => {
        isPlaying = false;
        console.log('✅ 播放结束');
        paragraph.classList.remove('speaking');
    };

    utterance.onerror = (e) => {
        isPlaying = false;
        console.error('❌ 播放错误:', e.error);
        paragraph.classList.remove('speaking');
    };

    // 播放
    currentUtterance = utterance;
    synthesis.speak(utterance);
    console.log('✅ speak() 已调用');
}

// 初始化语音列表
function initVoiceSelect() {
    const voiceSelect = document.getElementById('voiceSelect');
    if (!voiceSelect) return;

    const voices = synthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));

    if (englishVoices.length === 0) {
        voiceSelect.innerHTML = '<option>无英文语音</option>';
        return;
    }

    voiceSelect.innerHTML = '';
    englishVoices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });

    console.log(`✅ 已加载 ${englishVoices.length} 个英文语音`);
}

// 播放/暂停按钮
function setupPlayButton() {
    const playBtn = document.getElementById('playBtn');
    if (!playBtn) {
        console.error('❌ 找不到播放按钮');
        return;
    }

    playBtn.addEventListener('click', () => {
        console.log('🎯 点击了播放按钮，isPlaying =', isPlaying);

        if (isPlaying) {
            // 暂停
            synthesis.pause();
            isPlaying = false;
            console.log('⏸️ 已暂停');
        } else {
            // 播放
            console.log('🔊 开始播放流程...');

            const paragraphs = getParagraphs();
            console.log('📝 段落数量:', paragraphs.length);

            if (paragraphs.length === 0) {
                console.error('❌ 没有可朗读段落');
                return;
            }

            // 获取选中的语音
            const voiceSelect = document.getElementById('voiceSelect');
            const voices = synthesis.getVoices();
            console.log('🎤 总语音数:', voices.length);

            const englishVoices = voices.filter(v => v.lang.startsWith('en'));
            console.log('🎤 英文语音数:', englishVoices.length);

            if (!voiceSelect) {
                console.error('❌ 找不到 voiceSelect');
                return;
            }

            const selectedIndex = parseInt(voiceSelect.value, 10);
            console.log('🔢 选中的索引:', selectedIndex, '类型:', typeof selectedIndex);

            const voice = englishVoices[selectedIndex];
            console.log('✅ 选中的语音:', voice ? voice.name : 'undefined');

            // 播放第一段
            console.log('▶️ 准备调用 playParagraph...');
            playParagraph(paragraphs[0], voice, 1.0);
        }
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 TTS 极简版初始化...');

    // 加载段落
    const paragraphs = getParagraphs();
    console.log(`✅ 找到 ${paragraphs.length} 个段落`);

    // 初始化语音（延迟等待加载）
    setTimeout(() => {
        initVoiceSelect();
    }, 100);

    // 设置按钮
    setupPlayButton();

    console.log('✅ 初始化完成');
});

// 监听语音变化
if (synthesis.onvoiceschanged !== undefined) {
    synthesis.onvoiceschanged = initVoiceSelect;
}

console.log('📦 TTS 极简版已加载');
