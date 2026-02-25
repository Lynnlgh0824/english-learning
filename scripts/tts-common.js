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

        // 加载保存的语音选择
        const savedVoice = localStorage.getItem('tts-voice');
        if (savedVoice !== null) {
            voiceSelect.value = savedVoice;
        }

        // 添加语音变更监听
        voiceSelect.onchange = handleVoiceChange;

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

        const allParagraphs = content.querySelectorAll('p, h1, h2, h3, h4, li, blockquote');
        console.log('[getReadableParagraphs] 容器中找到', allParagraphs.length, '个元素');

        const readableTexts = [];
        const elements = [];

        allParagraphs.forEach((elem, index) => {
            let text = elem.textContent.trim();
            // 移除表情符号
            text = removeEmojis(text);
            // 过滤掉太短或不含英文的内容
            if (text.length > 20 && /[a-zA-Z]/.test(text)) {
                readableTexts.push(text);
                elements.push(elem);

                // 添加可朗读段落样式和点击事件
                elem.classList.add('readable-paragraph');
                elem.addEventListener('click', () => {
                    playFromParagraph(elements.indexOf(elem));
                });
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
            const selection = window.getSelection();
            const selectedText = selection ? selection.toString().trim() : '';

            if (selectedText.length > 0 && !window.isPlaying) {
                // 获取选中内容的父元素
                const anchorNode = selection.anchorNode;
                if (anchorNode) {
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

        // 先清空队列
        if (window.synthesis.speaking) {
            window.synthesis.cancel();
            console.log('[enqueueAllParagraphs] 已清空之前的队列');
        }

        // 获取语音设置
        const voiceSelect = document.getElementById('voiceSelect');
        const rateSlider = document.getElementById('rateSlider');
        const selectedVoiceIndex = voiceSelect ? parseInt(voiceSelect.value, 10) : 0;
        const rate = rateSlider ? parseFloat(rateSlider.value) : 1;
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

            // 将段落分割成句子
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
            sentences.forEach(sentence => {
                const trimmed = sentence.trim();
                if (trimmed.length > 0) {
                    allSentences.push(trimmed);
                    sentenceToParagraphMap.push(i);
                }
            });
        }

        console.log(`[enqueueAllParagraphs] 共收集 ${allSentences.length} 个句子`);

        // 递归播放句子，每个句子之间停顿1秒
        let sentenceIndex = 0;

        function playNextSentence() {
            if (sentenceIndex >= allSentences.length) {
                console.log('[enqueueAllParagraphs] ✅ 全部播放完成');
                window.isPlaying = false;
                window.currentParagraphIndex = 0;
                updatePlayButton(false);
                updateProgress(window.paragraphs.length, window.paragraphs.length);
                updateStatus('✅ 播放完成！');
                return;
            }

            const sentence = allSentences[sentenceIndex];
            const paragraphIndex = sentenceToParagraphMap[sentenceIndex];

            const utterance = new SpeechSynthesisUtterance(sentence);

            // 设置语音和语速
            if (selectedVoice) utterance.voice = selectedVoice;
            utterance.rate = rate;
            utterance.volume = 1;

            // 第一个句子开始时
            if (sentenceIndex === 0) {
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
                // 后续句子开始时
                utterance.onstart = () => {
                    console.log(`[enqueueAllParagraphs] 句子 ${sentenceIndex + 1} 开始播放`);
                    window.currentParagraphIndex = paragraphIndex;
                    highlightParagraph(paragraphIndex);
                    updateProgress(paragraphIndex, window.paragraphs.length);
                    updateStatus(`🔊 正在朗读 ${paragraphIndex + 1}/${window.paragraphs.length}`);
                };
            }

            // 句子结束后，停顿1秒后播放下一句
            utterance.onend = () => {
                console.log(`[enqueueAllParagraphs] 句子 ${sentenceIndex + 1} 播放结束，停顿1秒`);
                sentenceIndex++;

                // 停顿1秒后播放下一句
                setTimeout(() => {
                    if (window.isPlaying && !window.isPaused) {
                        playNextSentence();
                    }
                }, 1000); // 1秒停顿
            };

            window.synthesis.speak(utterance);
        }

        // 开始播放第一个句子
        playNextSentence();
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
            // 清除之前的定时器
            if (selectionTimer) {
                clearTimeout(selectionTimer);
            }

            // 延迟 50ms 执行，减少触发频率
            selectionTimer = setTimeout(() => {
                try {
                    const selection = window.getSelection();

                    // 安全检查：确保 selection 有效
                    if (!selection || selection.rangeCount === 0) {
                        const selectionBtn = document.getElementById('selectionBtn');
                        if (selectionBtn) {
                            selectionBtn.disabled = true;
                            selectionBtn.style.opacity = '0.5';
                            selectionBtn.style.cursor = 'not-allowed';
                        }
                        return;
                    }

                    const selectedText = selection.toString().trim();
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
                    if (error.name !== 'IndexSizeError') {
                        console.warn('Selection check error:', error.message);
                    }
                }
            }, 50);
        });
    }

    // 播放选中的文本
    function playSelection() {
        try {
            const selection = window.getSelection();

            // 安全检查：确保 selection 有效
            if (!selection || selection.rangeCount === 0) {
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

})();
