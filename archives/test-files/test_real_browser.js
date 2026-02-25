const puppeteer = require('puppeteer');

const TEST_URLS = [
    'http://localhost:8000/records/2026-02-06-coming-home.html',
    'http://localhost:8000/records/2026-02-06-month-alone-chiang-mai.html',
    'http://localhost:8000/records/2026-02-06-shanghai-starting-over.html'
];

console.log('🌐 真实浏览器测试（不清理缓存）\n');

async function testRealBrowser() {
    const browser = await puppeteer.launch({
        headless: false,  // 显示浏览器窗口
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });

    // 监听所有控制台消息
    const pages = await browser.pages();
    pages.forEach(page => {
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();

            if (type === 'error') {
                console.error(`❌ [${page.url().split('/').pop()}] ${text}`);
            } else if (type === 'warning') {
                console.warn(`⚠️  [${page.url().split('/').pop()}] ${text}`);
            } else if (text.includes('✅') || text.includes('❌') || text.includes('⚠️')) {
                console.log(`[LOG] [${page.url().split('/').pop()}] ${text}`);
            }
        });

        // 监听页面错误
        page.on('pageerror', (error) => {
            console.error(`❌ [${page.url().split('/').pop()}] Page Error:`, error.message);
        });
    });

    try {
        for (let i = 0; i < TEST_URLS.length; i++) {
            const url = TEST_URLS[i];
            const filename = url.split('/').pop();

            console.log(`\n${'='.repeat(60)}`);
            console.log(`测试文件 ${i + 1}/${TEST_URLS.length}: ${filename}`);
            console.log(`${'='.repeat(60)}\n`);

            const page = await browser.newPage();

            // 不清理缓存，模拟真实用户访问
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // 等待页面完全加载
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 测试 1: 检查初始化
            console.log('📝 测试 1: 检查初始化状态');
            const initCheck = await page.evaluate(() => {
                const ttsPanel = document.querySelector('.tts-panel');
                const playBtn = document.getElementById('playBtn');
                const voiceSelect = document.getElementById('voiceSelect');
                const statusEl = document.getElementById('ttsStatus');

                return {
                    ttsPanelExists: !!ttsPanel,
                    playBtnExists: !!playBtn,
                    voiceSelectExists: !!voiceSelect,
                    voiceSelectOptions: voiceSelect ? voiceSelect.options.length : 0,
                    statusText: statusEl ? statusEl.textContent : 'N/A',
                    paragraphsCount: window.paragraphs ? window.paragraphs.length : 'N/A'
                };
            });

            console.log(`  TTS 面板: ${initCheck.ttsPanelExists ? '✅' : '❌'}`);
            console.log(`  播放按钮: ${initCheck.playBtnExists ? '✅' : '❌'}`);
            console.log(`  语音选择: ${initCheck.voiceSelectExists ? `✅ (${initCheck.voiceSelectOptions} 个)` : '❌'}`);
            console.log(`  段落数量: ${initCheck.paragraphsCount}`);
            console.log(`  当前状态: "${initCheck.statusText}"`);

            // 测试 2: 点击播放按钮
            console.log('\n📝 测试 2: 点击播放按钮');

            // 等待确保页面完全就绪
            await new Promise(resolve => setTimeout(resolve, 1000));

            await page.click('#playBtn');
            await new Promise(resolve => setTimeout(resolve, 2000));

            const afterPlay = await page.evaluate(() => {
                const statusEl = document.getElementById('ttsStatus');
                const playBtn = document.getElementById('playBtn');
                const playText = document.getElementById('playText');
                const speakingElem = document.querySelector('.speaking');
                const isPlaying = window.isPlaying;

                return {
                    statusText: statusEl ? statusEl.textContent : 'N/A',
                    playBtnText: playText ? playText.textContent : 'N/A',
                    hasSpeaking: !!speakingElem,
                    isPlaying: isPlaying
                };
            });

            console.log(`  状态: "${afterPlay.statusText}"`);
            console.log(`  播放按钮: "${afterPlay.playBtnText}"`);
            console.log(`  正在朗读: ${afterPlay.hasSpeaking ? '✅' : '❌'}`);
            console.log(`  isPlaying: ${afterPlay.isPlaying}`);

            if (afterPlay.isPlaying && afterPlay.hasSpeaking) {
                console.log('  ✅ 播放功能正常！');

                // 等待2秒观察朗读
                await new Promise(resolve => setTimeout(resolve, 2000));

                // 测试 3: 测试划词功能
                console.log('\n📝 测试 3: 测试划词功能');

                await page.evaluate(() => {
                    // 选择一些文本
                    const p = document.querySelector('p');
                    if (p) {
                        const range = document.createRange();
                        range.selectNodeContents(p);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 500));

                // 检查是否触发 selectionchange
                const selectionStatus = await page.evaluate(() => {
                    const selectionBtn = document.getElementById('selectionBtn');
                    if (selectionBtn) {
                        return {
                            exists: true,
                            disabled: selectionBtn.disabled
                        };
                    }
                    return { exists: false };
                });

                if (selectionStatus.exists) {
                    console.log(`  划词按钮状态: ${selectionStatus.disabled ? '禁用' : '启用'}`);
                }

            } else {
                console.log('  ❌ 播放功能异常！');
            }

            console.log(`\n✅ ${filename} 测试完成`);

            // 保持页面打开10秒供手动检查
            console.log('⏸️  保持页面打开 10 秒供手动检查...\n');
            await new Promise(resolve => setTimeout(resolve, 10000));

            await page.close();
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ 所有测试完成！');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n💥 测试失败:', error);
    } finally {
        console.log('\n按 Ctrl+C 退出浏览器...');
        // 保持浏览器打开，让用户手动测试
        // await browser.close();
    }
}

// 运行测试
testRealBrowser()
    .then(() => {
        console.log('\n✅ 测试完成');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
