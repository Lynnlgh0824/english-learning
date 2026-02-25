const puppeteer = require('puppeteer');

const TEST_FILES = [
    'http://localhost:8000/records/2026-02-06-coming-home.html',
    'http://localhost:8000/records/2026-02-06-month-alone-chiang-mai.html',
    'http://localhost:8000/records/2026-02-06-shanghai-starting-over.html'
];

console.log('🧪 TTS 播放功能完整测试\n');

async function testTTSPlayback(url, index) {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    // 监听控制台消息
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('✅') || text.includes('❌') || text.includes('⚠️') || text.includes('📌')) {
            console.log(`  ${text}`);
        }
    });

    try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`测试文件 ${index + 1}/3: ${url.split('/').pop()}`);
        console.log(`${'='.repeat(60)}\n`);

        console.log('第1步: 加载页面');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('\n第2步: 检查 TTS 初始化状态');
        const initState = await page.evaluate(() => {
            const ttsPanel = document.querySelector('.tts-panel');
            const ttsStatus = document.getElementById('ttsStatus');
            const playBtn = document.getElementById('playBtn');
            const voiceSelect = document.getElementById('voiceSelect');

            return {
                ttsPanelExists: !!ttsPanel,
                ttsStatusText: ttsStatus ? ttsStatus.textContent : 'N/A',
                playBtnExists: !!playBtn,
                playBtnDisabled: playBtn ? playBtn.disabled : null,
                voiceSelectExists: !!voiceSelect,
                voiceSelectOptions: voiceSelect ? voiceSelect.options.length : 0,
                windowParagraphs: window.paragraphs ? window.paragraphs.length : 'undefined',
                windowParagraphsElements: window.paragraphsElements ? window.paragraphsElements.length : 'undefined'
            };
        });

        console.log('TTS 面板:');
        console.log(`  存在: ${initState.ttsPanelExists ? '✅' : '❌'}`);
        console.log(`  状态消息: "${initState.ttsStatusText}"`);
        console.log('播放按钮:');
        console.log(`  存在: ${initState.playBtnExists ? '✅' : '❌'}`);
        console.log(`  禁用状态: ${initState.playBtnDisabled === false ? '✅ 可点击' : '❌ 禁用'}`);
        console.log('语音选择器:');
        console.log(`  存在: ${initState.voiceSelectExists ? '✅' : '❌'}`);
        console.log(`  语音数量: ${initState.voiceSelectOptions}`);
        console.log('段落初始化:');
        console.log(`  window.paragraphs: ${initState.windowParagraphs}`);
        console.log(`  window.paragraphsElements: ${initState.windowParagraphsElements}`);

        // 验证段落初始化
        if (initState.windowParagraphs === 0 || initState.windowParagraphs === 'undefined') {
            console.log('\n❌ 严重问题: window.paragraphs 未正确初始化！');
            console.log('   这会导致点击播放按钮时显示"未找到可朗读的内容"\n');
            return { url, success: false, reason: 'paragraphs_not_initialized' };
        } else {
            console.log(`\n✅ 段落初始化正常: ${initState.windowParagraphs} 个段落\n`);
        }

        console.log('第3步: 检查页面内容结构');
        const contentStructure = await page.evaluate(() => {
            const container = document.querySelector('.container');
            const sections = document.querySelectorAll('.section');
            const paragraphs = document.querySelectorAll('p');
            const readableParagraphs = document.querySelectorAll('.readable-paragraph');

            return {
                containerExists: !!container,
                sectionsCount: sections.length,
                paragraphsCount: paragraphs.length,
                readableParagraphsCount: readableParagraphs.length,
                firstParagraphText: paragraphs.length > 0 ? paragraphs[0].textContent.substring(0, 50) + '...' : 'N/A'
            };
        });

        console.log('页面结构:');
        console.log(`  .container 存在: ${contentStructure.containerExists ? '✅' : '❌'}`);
        console.log(`  .section 数量: ${contentStructure.sectionsCount}`);
        console.log(`  <p> 标签数量: ${contentStructure.paragraphsCount}`);
        console.log(`  .readable-paragraph 数量: ${contentStructure.readableParagraphsCount}`);
        console.log(`  第一个段落: "${contentStructure.firstParagraphText}"`);

        console.log('\n第4步: 点击"播放"按钮');
        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 1500));

        const afterPlay = await page.evaluate(() => {
            const ttsStatus = document.getElementById('ttsStatus');
            const playBtn = document.getElementById('playBtn');
            const playIcon = document.getElementById('playIcon');
            const playText = document.getElementById('playText');
            const speakingElement = document.querySelector('.speaking');

            return {
                statusText: ttsStatus ? ttsStatus.textContent : 'N/A',
                playBtnText: playText ? playText.textContent : 'N/A',
                playIconText: playIcon ? playIcon.textContent : 'N/A',
                speakingElementExists: !!speakingElement,
                isPlaying: window.isPlaying,
                isPaused: window.isPaused
            };
        });

        console.log('点击播放后:');
        console.log(`  状态消息: "${afterPlay.statusText}"`);
        console.log(`  按钮文本: "${afterPlay.playBtnText}"`);
        console.log(`  按钮图标: "${afterPlay.playIconText}"`);
        console.log(`  正在朗读: ${afterPlay.speakingElementExists ? '✅' : '❌'}`);
        console.log(`  isPlaying: ${afterPlay.isPlaying}`);
        console.log(`  isPaused: ${afterPlay.isPaused}`);

        // 验证播放是否成功
        let playbackSuccess = false;
        if (afterPlay.statusText.includes('未找到可朗读的内容')) {
            console.log('\n❌ 播放失败: 未找到可朗读的内容');
            playbackSuccess = false;
        } else if (afterPlay.speakingElementExists || afterPlay.statusText.includes('正在朗读')) {
            console.log('\n✅ 播放成功: TTS 正在朗读');
            playbackSuccess = true;
        } else if (afterPlay.isPaused) {
            console.log('\n⚠️ 播放已暂停');
            playbackSuccess = true;
        } else {
            console.log('\n❓ 播放状态未知');
            playbackSuccess = false;
        }

        if (playbackSuccess) {
            console.log('\n第5步: 等待2秒观察朗读进度');
            await new Promise(resolve => setTimeout(resolve, 2000));

            const progress = await page.evaluate(() => {
                const ttsStatus = document.getElementById('ttsStatus');
                const progressBar = document.getElementById('ttsProgressBar');
                const speakingElement = document.querySelector('.speaking');

                return {
                    statusText: ttsStatus ? ttsStatus.textContent : 'N/A',
                    progressWidth: progressBar ? progressBar.style.width : 'N/A',
                    speakingElementTag: speakingElement ? speakingElement.tagName : 'N/A'
                };
            });

            console.log('朗读进度:');
            console.log(`  状态: "${progress.statusText}"`);
            console.log(`  进度条: ${progress.progressWidth}`);
            console.log(`  当前朗读元素: ${progress.speakingElementTag}`);
        }

        console.log('\n第6步: 点击"停止"按钮');
        const stopBtn = await page.$('#stopBtn');
        if (stopBtn) {
            await stopBtn.click();
            await new Promise(resolve => setTimeout(resolve, 500));

            const afterStop = await page.evaluate(() => {
                const ttsStatus = document.getElementById('ttsStatus');
                const speakingElement = document.querySelector('.speaking');

                return {
                    statusText: ttsStatus ? ttsStatus.textContent : 'N/A',
                    speakingElementExists: !!speakingElement,
                    isPlaying: window.isPlaying
                };
            });

            console.log('停止后:');
            console.log(`  状态: "${afterStop.statusText}"`);
            console.log(`  正在朗读: ${afterStop.speakingElementExists ? '❌ 仍在朗读' : '✅ 已停止'}`);
            console.log(`  isPlaying: ${afterStop.isPlaying}`);
        }

        console.log('\n第7步: 保持浏览器打开5秒供您观察');
        await new Promise(resolve => setTimeout(resolve, 5000));

        return { url, success: playbackSuccess };

    } catch (error) {
        console.error(`\n💥 测试出错: ${error.message}`);
        return { url, success: false, error: error.message };
    } finally {
        await browser.close();
        console.log('\n浏览器已关闭\n');
    }
}

async function runAllTests() {
    const results = [];

    for (let i = 0; i < TEST_FILES.length; i++) {
        const result = await testTTSPlayback(TEST_FILES[i], i);
        results.push(result);
    }

    // 打印总结
    console.log('\n' + '='.repeat(60));
    console.log('📊 测试结果总结');
    console.log('='.repeat(60) + '\n');

    results.forEach((result, index) => {
        const filename = result.url.split('/').pop();
        if (result.success) {
            console.log(`${index + 1}. ${filename}`);
            console.log(`   ✅ 测试通过 - TTS 播放功能正常\n`);
        } else {
            console.log(`${index + 1}. ${filename}`);
            console.log(`   ❌ 测试失败`);
            if (result.reason) {
                console.log(`   原因: ${result.reason}`);
            }
            if (result.error) {
                console.log(`   错误: ${result.error}`);
            }
            console.log('');
        }
    });

    const passCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    console.log('='.repeat(60));
    console.log(`总计: ${passCount}/${totalCount} 个文件测试通过`);
    console.log('='.repeat(60));

    if (passCount === totalCount) {
        console.log('\n🎉 所有测试通过！TTS 播放功能完全正常！');
        process.exit(0);
    } else {
        console.log('\n⚠️ 部分测试失败，请检查上述错误信息');
        process.exit(1);
    }
}

runAllTests();
