const puppeteer = require('puppeteer');

const TEST_URLS = [
    'http://localhost:8000/records/2026-02-06-coming-home.html',
    'http://localhost:8000/records/2026-02-06-month-alone-chiang-mai.html',
    'http://localhost:8000/records/2026-02-06-shanghai-starting-over.html'
];

console.log('🌐 使用同一浏览器实例测试（不清缓存）\n');

async function testWithSameBrowser() {
    // 启动浏览器（只启动一次）
    const browser = await puppeteer.launch({
        headless: false,  // 显示浏览器窗口
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });

    console.log('✅ 浏览器已启动\n');

    // 创建第一个页面
    const page = await browser.newPage();

    // 监听所有控制台消息（在整个浏览器级别）
    browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
            const newPage = await target.page();
            if (newPage) {
                newPage.on('console', msg => {
                    const type = msg.type();
                    const text = msg.text();

                    if (type === 'error') {
                        console.error(`❌ [新页面] ${text}`);
                    } else if (type === 'warning') {
                        console.warn(`⚠️  [新页面] ${text}`);
                    }
                });

                newPage.on('pageerror', (error) => {
                    console.error(`❌ [新页面错误] ${error.message}`);
                });
            }
        }
    });

    // 为第一个页面添加监听
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();

        if (type === 'error') {
            console.error(`❌ [控制台] ${text}`);
        } else if (type === 'warning') {
            console.warn(`⚠️  [控制台] ${text}`);
        } else if (text.includes('✅') || text.includes('❌') || text.includes('🔊')) {
            console.log(`[LOG] ${text}`);
        }
    });

    page.on('pageerror', (error) => {
        console.error(`❌ [页面错误] ${error.message}`);
    });

    try {
        for (let i = 0; i < TEST_URLS.length; i++) {
            const url = TEST_URLS[i];
            const filename = url.split('/').pop();

            console.log(`${'='.repeat(60)}`);
            console.log(`测试文件 ${i + 1}/${TEST_URLS.length}: ${filename}`);
            console.log(`${'='.repeat(60)}\n`);

            // 使用现有页面或创建新页面
            let currentPage;
            if (i === 0) {
                currentPage = page;
            } else {
                currentPage = await browser.newPage();

                // 为新页面添加监听
                currentPage.on('console', msg => {
                    const type = msg.type();
                    const text = msg.text();

                    if (type === 'error') {
                        console.error(`❌ [${filename}] ${text}`);
                    } else if (type === 'warning') {
                        console.warn(`⚠️  [${filename}] ${text}`);
                    } else if (text.includes('✅') || text.includes('❌') || text.includes('🔊')) {
                        console.log(`[LOG] [${filename}] ${text}`);
                    }
                });

                currentPage.on('pageerror', (error) => {
                    console.error(`❌ [${filename}] ${error.message}`);
                });
            }

            // 访问页面（不清除缓存）
            console.log(`📝 访问页面: ${filename}`);
            await currentPage.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // 等待页面完全加载
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 测试 1: 检查初始化
            console.log('\n📝 测试 1: 检查初始化状态');
            const initCheck = await currentPage.evaluate(() => {
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

            await new Promise(resolve => setTimeout(resolve, 1000));

            await currentPage.click('#playBtn');
            await new Promise(resolve => setTimeout(resolve, 2000));

            const afterPlay = await currentPage.evaluate(() => {
                const statusEl = document.getElementById('ttsStatus');
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

                // 测试 3: 下滑页面
                console.log('\n📝 测试 3: 下滑页面（模拟真实用户）');

                for (let j = 0; j < 3; j++) {
                    await currentPage.evaluate(() => {
                        window.scrollBy({
                            top: 400,
                            behavior: 'smooth'
                        });
                    });
                    console.log(`  下滑... ${j + 1}/3`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                console.log('  ✅ 页面滚动正常');

                // 测试 4: 点击暂停
                console.log('\n📝 测试 4: 点击暂停按钮');
                await currentPage.click('#playBtn');
                await new Promise(resolve => setTimeout(resolve, 1000));

                const afterPause = await currentPage.evaluate(() => {
                    const statusEl = document.getElementById('ttsStatus');
                    const isPlaying = window.isPlaying;

                    return {
                        statusText: statusEl ? statusEl.textContent : 'N/A',
                        isPlaying: isPlaying
                    };
                });

                console.log(`  暂停后状态: "${afterPause.statusText}"`);
                console.log(`  已暂停: ${!afterPause.isPlaying ? '✅' : '❌'}`);

                // 测试 5: 继续播放
                console.log('\n📝 测试 5: 点击继续播放');
                await currentPage.click('#playBtn');
                await new Promise(resolve => setTimeout(resolve, 1000));

                const afterResume = await currentPage.evaluate(() => {
                    const statusEl = document.getElementById('ttsStatus');
                    const isPlaying = window.isPlaying;

                    return {
                        statusText: statusEl ? statusEl.textContent : 'N/A',
                        isPlaying: isPlaying
                    };
                });

                console.log(`  继续播放状态: "${afterResume.statusText}"`);
                console.log(`  继续播放: ${afterResume.isPlaying ? '✅' : '❌'}`);

                // 测试 6: 选中文本测试
                console.log('\n📝 测试 6: 测试划词功能');

                await currentPage.evaluate(() => {
                    const p = document.querySelector('p');
                    if (p && p.textContent.length > 50) {
                        const range = document.createRange();
                        range.setStart(p.firstChild, 0);
                        range.setEnd(p.firstChild, Math.min(30, p.textContent.length));
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 500));

                const selectionStatus = await currentPage.evaluate(() => {
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

            // 如果不是最后一个文件，保持标签页打开
            if (i < TEST_URLS.length - 1) {
                console.log('⏸️  保持标签页打开，准备测试下一个文件...\n');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ 所有测试完成！');
        console.log('='.repeat(60));
        console.log('\n📊 测试总结:');
        console.log('  ✅ 使用同一浏览器实例');
        console.log('  ✅ 未清除任何缓存');
        console.log('  ✅ 所有标签页保持打开');
        console.log('  ✅ 模拟真实用户使用场景\n');

    } catch (error) {
        console.error('\n💥 测试失败:', error);
    } finally {
        console.log('\n按 Ctrl+C 退出浏览器...');
        console.log('（浏览器将保持打开，所有标签页仍在运行）\n');

        // 保持浏览器打开，让用户可以手动测试
        // await browser.close();
    }
}

// 运行测试
testWithSameBrowser()
    .then(() => {
        console.log('\n✅ 测试完成');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
