const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:8000/records/2026-02-06-coming-home.html';

console.log('🎙️ TTS 可视化测试 - 改进版\n');
console.log('将打开浏览器窗口进行实际播放测试...\n');

async function improvedVisualTest() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    // 监听所有控制台消息
    page.on('console', msg => {
        const text = msg.text();
        console.log(`  📌 ${text}`);
    });

    page.on('pageerror', error => {
        if (!error.message.includes('canceled')) {
            console.log(`  🔴 ${error.message}`);
        }
    });

    try {
        console.log('📋 第1步: 加载页面');
        console.log('=' .repeat(60));
        await page.goto(TEST_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        console.log('\n📋 第2步: 等待语音和DOM初始化');
        console.log('=' .repeat(60));
        console.log('⏳ 等待7秒...');
        await new Promise(resolve => setTimeout(resolve, 7000));

        // 检查所有关键元素
        console.log('\n📋 第3步: 检查DOM元素');
        console.log('=' .repeat(60));

        const domCheck = await page.evaluate(() => {
            const results = {};

            // 检查按钮
            results.playBtn = !!document.getElementById('playBtn');
            results.modeBtns = document.querySelectorAll('.mode-btn').length;
            results.quickBtn = !!document.querySelector('.mode-btn[data-mode="quick"]');
            results.standardBtn = !!document.querySelector('.mode-btn[data-mode="standard"]');
            results.intensiveBtn = !!document.querySelector('.mode-btn[data-mode="intensive"]');

            // 检查变量
            results.paragraphs = typeof paragraphs !== 'undefined';
            results.paragraphsLength = paragraphs ? paragraphs.length : 0;
            results.isPlaying = typeof isPlaying !== 'undefined';
            results.currentMode = typeof currentMode !== 'undefined';

            // 检查语音
            const voices = speechSynthesis.getVoices();
            results.voicesCount = voices.length;

            return results;
        });

        console.log(`播放按钮: ${domCheck.playBtn ? '✅' : '❌'}`);
        console.log(`模式按钮: ${domCheck.modeBtns} 个`);
        console.log(`  - 快速: ${domCheck.quickBtn ? '✅' : '❌'}`);
        console.log(`  - 标准: ${domCheck.standardBtn ? '✅' : '❌'}`);
        console.log(`  - 缓慢: ${domCheck.intensiveBtn ? '✅' : '❌'}`);
        console.log(`段落数量: ${domCheck.paragraphsLength}`);
        console.log(`语音数量: ${domCheck.voicesCount}`);

        console.log('\n📋 第4步: 点击播放按钮');
        console.log('=' .repeat(60));

        await page.click('#playBtn');
        console.log('✅ 已点击播放');

        // 等待播放开始
        console.log('⏳ 等待3秒让播放开始...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 详细检查播放状态
        console.log('\n📋 第5步: 检查播放状态');
        console.log('=' .repeat(60));

        const playStatus = await page.evaluate(() => {
            const speaking = document.querySelector('.speaking');

            return {
                buttonText: document.getElementById('playText').textContent,
                buttonIcon: document.getElementById('playIcon').textContent,
                statusText: document.getElementById('ttsStatus').textContent,
                isPlaying: window.isPlaying,
                currentParagraphIndex: window.currentParagraphIndex,
                totalParagraphs: paragraphs ? paragraphs.length : 0,
                speakingExists: !!speaking,
                speakingText: speaking ? speaking.textContent.substring(0, 100) + '...' : 'N/A',
                rateValue: document.getElementById('rateValue').textContent
            };
        });

        console.log(`按钮: ${playStatus.buttonIcon} ${playStatus.buttonText}`);
        console.log(`状态: ${playStatus.statusText}`);
        console.log(`正在播放: ${playStatus.isPlaying ? '是' : '否'}`);
        console.log(`当前段落: ${playStatus.currentParagraphIndex + 1}/${playStatus.totalParagraphs}`);
        console.log(`高亮元素: ${playStatus.speakingExists ? '✅ 存在' : '❌ 不存在'}`);
        console.log(`语速: ${playStatus.rateValue}`);

        if (playStatus.speakingExists) {
            console.log(`\n正在朗读的文本预览:`);
            console.log(`"${playStatus.speakingText}"`);

            // 检查高亮样式
            const speakingStyles = await page.evaluate(() => {
                const speaking = document.querySelector('.speaking');
                const computed = window.getComputedStyle(speaking);

                return {
                    background: computed.background,
                    backgroundColor: computed.backgroundColor,
                    fontSize: computed.fontSize,
                    borderRadius: computed.borderRadius,
                    padding: computed.padding,
                    margin: computed.margin,
                    boxShadow: computed.boxShadow
                };
            });

            console.log(`\n高亮样式:`);
            console.log(`  background: ${speakingStyles.background}`);
            console.log(`  fontSize: ${speakingStyles.fontSize}`);
            console.log(`  borderRadius: ${speakingStyles.borderRadius}`);
            console.log(`  padding: ${speakingStyles.padding}`);
        }

        console.log('\n📋 第6步: 播放12秒并监控进度');
        console.log('=' .repeat(60));
        console.log('🔊 请聆听语音朗读...\n');

        // 每3秒更新一次状态
        for (let i = 1; i <= 4; i++) {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const progress = await page.evaluate(() => {
                return {
                    status: document.getElementById('ttsStatus').textContent,
                    index: window.currentParagraphIndex,
                    total: paragraphs.length,
                    isPlaying: window.isPlaying
                };
            });

            console.log(`[${i * 3}秒] ${progress.status} (${progress.index + 1}/${progress.total})`);

            // 如果播放完成
            if (progress.status.includes('播放完成')) {
                console.log('  ✅ 播放已完成！');
                break;
            }
        }

        console.log('\n📋 第7步: 测试暂停功能');
        console.log('=' .repeat(60));

        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pauseStatus = await page.evaluate(() => {
            return {
                text: document.getElementById('playText').textContent,
                icon: document.getElementById('playIcon').textContent,
                isPaused: window.isPaused
            };
        });

        console.log(`按钮变为: ${pauseStatus.icon} ${pauseStatus.text}`);
        console.log(`已暂停: ${pauseStatus.isPaused ? '是' : '否'}`);

        console.log('\n📋 第8步: 测试模式切换');
        console.log('=' .repeat(60));

        // 检查快速按钮是否可见
        const quickBtnExists = await page.evaluate(() => {
            return !!document.querySelector('.mode-btn[data-mode="quick"]');
        });

        if (quickBtnExists) {
            console.log('✅ 找到快速模式按钮，点击切换...');

            await page.evaluate(() => {
                return new Promise((resolve) => {
                    // 等待一小段时间确保DOM稳定
                    setTimeout(() => {
                        const btn = document.querySelector('.mode-btn[data-mode="quick"]');
                        if (btn) {
                            btn.click();
                        }
                        resolve();
                    }, 500);
                });
            });

            await new Promise(resolve => setTimeout(resolve, 1500));

            const modeStatus = await page.evaluate(() => {
                const quickBtn = document.querySelector('.mode-btn[data-mode="quick"]');
                const standardBtn = document.querySelector('.mode-btn[data-mode="standard"]');
                const rateValue = document.getElementById('rateValue').textContent;
                const statusText = document.getElementById('ttsStatus').textContent;

                return {
                    quickActive: quickBtn ? quickBtn.classList.contains('active') : false,
                    standardActive: standardBtn ? standardBtn.classList.contains('active') : false,
                    rate: rateValue,
                    status: statusText
                };
            });

            console.log(`快速模式激活: ${modeStatus.quickActive ? '✅ 是' : '❌ 否'}`);
            console.log(`标准模式激活: ${modeStatus.standardActive ? '✅ 是' : '❌ 否'}`);
            console.log(`新语速: ${modeStatus.rate}`);
            console.log(`状态提示: ${modeStatus.status}`);
        } else {
            console.log('❌ 未找到快速模式按钮');
        }

        console.log('\n📋 第9步: 继续播放5秒（新模式）');
        console.log('=' .repeat(60));

        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 5000));

        const finalStatus = await page.evaluate(() => {
            return {
                playing: window.isPlaying,
                mode: window.currentMode,
                paragraphIndex: window.currentParagraphIndex,
                status: document.getElementById('ttsStatus').textContent
            };
        });

        console.log(`最终状态:`);
        console.log(`  播放中: ${finalStatus.playing ? '是' : '否'}`);
        console.log(`  当前模式: ${finalStatus.mode}`);
        console.log(`  进度: 段落 ${finalStatus.paragraphIndex + 1}`);
        console.log(`  状态文本: ${finalStatus.status}`);

        // 截图
        const screenshot = '/tmp/tts_visual_test_final.png';
        await page.screenshot({ path: screenshot, fullPage: true });
        console.log(`\n📸 截图已保存: ${screenshot}`);

        console.log('\n📋 第10步: 保持浏览器打开15秒供您查看');
        console.log('=' .repeat(60));
        console.log('👀 您现在可以手动操作页面进行测试');
        console.log('   - 尝试点击不同的模式按钮');
        console.log('   - 调整语速滑块');
        console.log('   - 选择不同的语音');
        console.log('   - 点击段落跳转\n');

        await new Promise(resolve => setTimeout(resolve, 15000));

    } catch (error) {
        console.error('\n❌ 测试出错:', error.message);
        console.error(error.stack);
    } finally {
        await browser.close();
        console.log('\n🔚 浏览器已关闭');
    }
}

improvedVisualTest()
    .then(() => {
        console.log('\n✅ 可视化测试完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
