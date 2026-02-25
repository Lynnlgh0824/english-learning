const puppeteer = require('puppeteer');

const INDEX_URL = 'http://localhost:8000/index.html';

console.log('🎙️ 真实用户行为测试 - 模拟实际点击操作\n');

async function realUserTest() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-cache',  // 禁用缓存
            '--disable-application-cache'
        ],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    // 设置缓存拦截
    await page.setCacheEnabled(false);

    page.on('console', msg => {
        const text = msg.text();
        console.log(`  📌 ${text}`);
    });

    page.on('pageerror', error => {
        console.log(`  🔴 错误: ${error.message}`);
    });

    // 监听所有请求
    page.on('request', request => {
        const url = request.url();
        if (url.includes('.html') || url.includes('data.json')) {
            console.log(`  🌐 请求: ${url.split('/').pop()}`);
        }
    });

    try {
        console.log('第1步: 打开首页（禁用缓存）');
        console.log('='.repeat(60));
        await page.goto(INDEX_URL, {
            waitUntil: 'networkidle2',
            timeout: 15000
        });

        console.log('⏳ 等待首页完全加载...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 检查首页状态
        const indexCheck = await page.evaluate(() => {
            const records = document.querySelectorAll('.record-list-item');
            return {
                recordCount: records.length,
                firstRecordTitle: records[0]?.querySelector('.record-list-title')?.textContent,
                firstRecordFile: records[0]?.onclick?.toString()?.match(/'([^']+)'/)?.[1]
            };
        });

        console.log(`找到 ${indexCheck.recordCount} 条记录`);
        console.log(`第一条: ${indexCheck.firstRecordTitle}`);
        console.log(`文件: ${indexCheck.firstRecordFile}`);

        // 关键：使用真实点击而不是直接跳转
        console.log('\n第2步: 真实点击第一条记录（模拟用户操作）');
        console.log('='.repeat(60));

        // 添加点击监听，记录点击事件
        await page.evaluate(() => {
            window.recordClickTime = new Date().getTime();
            console.log('🖱️ 准备点击记录...');

            // 查找第一条记录并添加点击监听
            const firstRecord = document.querySelector('.record-list-item');
            if (firstRecord) {
                const originalClick = firstRecord.onclick;

                firstRecord.addEventListener('click', (e) => {
                    console.log('✅ 点击事件触发！');
                    console.log('点击时间:', new Date().toISOString());
                }, true);
            }
        });

        // 等待一小段时间
        await new Promise(resolve => setTimeout(resolve, 500));

        // 真实点击
        const clickResult = await page.evaluate(() => {
            const firstRecord = document.querySelector('.record-list-item');
            if (firstRecord) {
                firstRecord.click();
                return { clicked: true, file: firstRecord.onclick?.toString()?.match(/'([^']+)'/)?.[1] };
            }
            return { clicked: false };
        });

        console.log(`点击结果: ${clickResult.clicked ? '✅ 成功' : '❌ 失败'}`);
        if (clickResult.file) {
            console.log(`目标文件: ${clickResult.file}`);
        }

        // 等待页面跳转和加载
        console.log('\n⏳ 等待页面跳转...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 检查当前URL
        const currentUrl = page.url();
        console.log(`当前URL: ${currentUrl}`);

        // 如果URL没有变化，说明跳转失败
        if (!currentUrl.includes('records/')) {
            console.log('❌ 页面未跳转，尝试手动导航...');
            await page.goto(`http://localhost:8000/records/${clickResult.file}`, {
                waitUntil: 'networkidle2',
                timeout: 15000
            });
        }

        console.log('\n第3步: 等待详情页完全加载');
        console.log('='.repeat(60));

        // 等待DOM加载完成
        await page.waitForSelector('#playBtn', { timeout: 10000 });
        console.log('✅ 播放按钮已加载');

        // 额外等待语音初始化
        console.log('⏳ 等待语音初始化（10秒）...');
        await new Promise(resolve => setTimeout(resolve, 10000));

        // 详细检查页面状态
        console.log('\n第4步: 详细检查页面状态');
        console.log('='.repeat(60));

        const pageStatus = await page.evaluate(() => {
            // 检查window对象上的变量
            const windowVars = {
                synthesis: typeof window.synthesis,
                voicesCount: window.voices ? window.voices.length : 'undefined',
                enhancedVoicesCount: window.enhancedVoices ? window.enhancedVoices.length : 'undefined',
                paragraphsCount: window.paragraphs ? window.paragraphs.length : 'undefined',
                isPlaying: window.isPlaying,
                isPaused: window.isPaused,
                currentMode: window.currentMode,
                currentParagraphIndex: window.currentParagraphIndex
            };

            // 检查DOM元素
            const domElements = {
                playBtn: !!document.getElementById('playBtn'),
                playText: document.getElementById('playText')?.textContent,
                playIcon: document.getElementById('playIcon')?.textContent,
                statusText: document.getElementById('ttsStatus')?.textContent,
                speakingElements: document.querySelectorAll('.speaking').length,
                modeButtons: document.querySelectorAll('.mode-btn').length
            };

            // 检查语音选择框
            const voiceSelect = document.getElementById('voiceSelect');
            const voiceOptions = voiceSelect ? voiceSelect.options.length : 0;

            return {
                windowVars,
                domElements,
                voiceOptions
            };
        });

        console.log('\n📊 Window 对象状态:');
        console.log(`  synthesis: ${pageStatus.windowVars.synthesis}`);
        console.log(`  voices.length: ${pageStatus.windowVars.voicesCount}`);
        console.log(`  enhancedVoices.length: ${pageStatus.windowVars.enhancedVoicesCount}`);
        console.log(`  paragraphs.length: ${pageStatus.windowVars.paragraphsCount}`);
        console.log(`  isPlaying: ${pageStatus.windowVars.isPlaying}`);
        console.log(`  isPaused: ${pageStatus.windowVars.isPaused}`);
        console.log(`  currentMode: ${pageStatus.windowVars.currentMode}`);
        console.log(`  currentParagraphIndex: ${pageStatus.windowVars.currentParagraphIndex}`);

        console.log('\n📊 DOM 元素状态:');
        console.log(`  播放按钮: ${pageStatus.domElements.playBtn ? '✅' : '❌'}`);
        console.log(`  按钮文本: ${pageStatus.domElements.playText}`);
        console.log(`  按钮图标: ${pageStatus.domElements.playIcon}`);
        console.log(`  状态文本: ${pageStatus.domElements.statusText}`);
        console.log(`  高亮元素: ${pageStatus.domElements.speakingElements} 个`);
        console.log(`  模式按钮: ${pageStatus.domElements.modeButtons} 个`);
        console.log(`  语音选项: ${pageStatus.voiceOptions} 个`);

        // 检查问题
        const issues = [];

        if (pageStatus.windowVars.paragraphsCount === 0 || pageStatus.windowVars.paragraphsCount === 'undefined') {
            issues.push('❌ paragraphs 未初始化或为空');
        }

        if (pageStatus.windowVars.voicesCount === 0 || pageStatus.windowVars.voicesCount === 'undefined') {
            issues.push('❌ voices 未加载');
        }

        if (pageStatus.windowVars.currentMode === undefined || pageStatus.windowVars.currentMode === null) {
            issues.push('❌ currentMode 未初始化');
        }

        if (pageStatus.windowVars.currentParagraphIndex === undefined || pageStatus.windowVars.currentParagraphIndex === null) {
            issues.push('❌ currentParagraphIndex 未初始化');
        }

        if (pageStatus.domElements.playText !== '播放') {
            issues.push(`⚠️ 按钮文本异常: ${pageStatus.domElements.playText}`);
        }

        if (issues.length > 0) {
            console.log('\n🚨 发现问题:');
            issues.forEach(issue => console.log(`  ${issue}`));

            // 尝试诊断问题
            console.log('\n🔍 诊断信息:');
            const diagnostics = await page.evaluate(() => {
                // 检查 DOMContentLoaded 是否已执行
                const domContentLoaded = window.performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd;

                // 检查是否有其他初始化问题
                return {
                    domContentLoadedTime: domContentLoaded,
                    currentTime: new Date().toISOString(),
                    readyState: document.readyState,
                    localStorage: {
                        ttsMode: localStorage.getItem('tts-mode'),
                        ttsVoice: localStorage.getItem('tts-voice'),
                        ttsRate: localStorage.getItem('tts-rate')
                    }
                };
            });

            console.log(`  DOM加载完成时间: ${diagnostics.domContentLoadedTime}ms`);
            console.log(`  当前时间: ${diagnostics.currentTime}`);
            console.log(`  文档状态: ${diagnostics.readyState}`);
            console.log(`  LocalStorage:`, diagnostics.localStorage);

        } else {
            console.log('\n✅ 所有检查通过！');
        }

        // 尝试播放
        console.log('\n第5步: 尝试播放');
        console.log('='.repeat(60));

        await page.click('#playBtn');
        console.log('✅ 已点击播放按钮');

        await new Promise(resolve => setTimeout(resolve, 3000));

        const playStatus = await page.evaluate(() => {
            return {
                buttonText: document.getElementById('playText').textContent,
                statusText: document.getElementById('ttsStatus').textContent,
                isPlaying: window.isPlaying,
                speakingCount: document.querySelectorAll('.speaking').length
            };
        });

        console.log(`按钮文本: ${playStatus.buttonText}`);
        console.log(`状态文本: ${playStatus.statusText}`);
        console.log(`isPlaying: ${playStatus.isPlaying}`);
        console.log(`高亮元素: ${playStatus.speakingCount} 个`);

        if (!playStatus.isPlaying && playStatus.buttonText === '播放') {
            console.log('\n❌ 播放失败！按钮仍然是"播放"状态');
        } else if (playStatus.isPlaying || playStatus.buttonText === '继续') {
            console.log('\n✅ 播放成功！');
        }

        console.log('\n第6步: 保持浏览器打开15秒供您调试');
        console.log('='.repeat(60));
        console.log('💡 您可以手动操作浏览器查看问题');
        console.log('   - 打开开发者工具 (F12)');
        console.log('   - 查看 Console 面板');
        console.log('   - 在控制台输入: window.paragraphs.length');
        console.log('   - 在控制台输入: window.isPlaying');
        console.log('   - 在控制台输入: window.currentMode\n');

        await new Promise(resolve => setTimeout(resolve, 15000));

    } catch (error) {
        console.error('\n❌ 测试出错:', error.message);
        console.error(error.stack);
    } finally {
        await browser.close();
        console.log('\n浏览器已关闭');
    }
}

realUserTest()
    .then(() => {
        console.log('\n✅ 测试完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
