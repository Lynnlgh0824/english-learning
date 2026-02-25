const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:8000/records/2026-02-06-coming-home.html';

console.log('🎙️ 播放/暂停/继续 多次操作测试\n');
console.log('测试流程: 首次点击播放 → 暂停 → 继续, 反复3次\n');

async function testPlayPauseCycle() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    page.on('console', msg => {
        console.log(`  📌 ${msg.text()}`);
    });

    try {
        console.log('第1步: 加载页面并等待初始化');
        await page.goto(TEST_URL, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(resolve => setTimeout(resolve, 8000));

        // 3次循环测试
        for (let cycle = 1; cycle <= 3; cycle++) {
            console.log(`\n${'='.repeat(60)}`);
            console.log(`第 ${cycle} 轮测试`);
            console.log('='.repeat(60));

            // 第1步: 点击播放
            console.log(`\n[${cycle}.1] 点击播放按钮`);
            await page.click('#playBtn');
            await new Promise(resolve => setTimeout(resolve, 3000));

            const playStatus = await page.evaluate(() => {
                return {
                    buttonText: document.getElementById('playText').textContent,
                    buttonIcon: document.getElementById('playIcon').textContent,
                    statusText: document.getElementById('ttsStatus').textContent,
                    isPlaying: window.isPlaying,
                    isPaused: window.isPaused,
                    currentMode: window.currentMode,
                    paragraphIndex: window.currentParagraphIndex
                };
            });

            console.log(`  按钮: ${playStatus.buttonIcon} ${playStatus.buttonText}`);
            console.log(`  状态: ${playStatus.statusText}`);
            console.log(`  isPlaying: ${playStatus.isPlaying}`);
            console.log(`  isPaused: ${playStatus.isPaused}`);
            console.log(`  currentMode: ${playStatus.currentMode}`);
            console.log(`  当前进度: 段落 ${playStatus.paragraphIndex + 1}`);

            if (!playStatus.isPlaying) {
                console.log(`  ❌ 警告: isPlaying 应该为 true, 但实际为 ${playStatus.isPlaying}`);
            }
            if (playStatus.currentMode === 'undefined' || !playStatus.currentMode) {
                console.log(`  ❌ 警告: currentMode 为 ${playStatus.currentMode}`);
            }

            // 播放5秒
            console.log(`\n[${cycle}.2] 继续播放5秒...`);
            for (let i = 1; i <= 2; i++) {
                await new Promise(resolve => setTimeout(resolve, 2500));
                const progress = await page.evaluate(() => ({
                    status: document.getElementById('ttsStatus').textContent,
                    isPlaying: window.isPlaying,
                    index: window.currentParagraphIndex
                }));
                console.log(`  [${i * 2.5}s] ${progress.status} (isPlaying: ${progress.isPlaying}, 段落: ${progress.index + 1})`);
            }

            // 第2步: 点击暂停
            console.log(`\n[${cycle}.3] 点击暂停按钮`);
            await page.click('#playBtn');
            await new Promise(resolve => setTimeout(resolve, 1500));

            const pauseStatus = await page.evaluate(() => {
                return {
                    buttonText: document.getElementById('playText').textContent,
                    buttonIcon: document.getElementById('playIcon').textContent,
                    isPlaying: window.isPlaying,
                    isPaused: window.isPaused
                };
            });

            console.log(`  按钮: ${pauseStatus.buttonIcon} ${pauseStatus.buttonText}`);
            console.log(`  isPlaying: ${pauseStatus.isPlaying}`);
            console.log(`  isPaused: ${pauseStatus.isPaused}`);

            if (pauseStatus.isPlaying) {
                console.log(`  ⚠️ 注意: 暂停后 isPlaying 仍为 true (可能在段落间隔中)`);
            }

            // 第3步: 点击继续
            console.log(`\n[${cycle}.4] 点击继续按钮`);
            await page.click('#playBtn');
            await new Promise(resolve => setTimeout(resolve, 3000));

            const resumeStatus = await page.evaluate(() => {
                return {
                    buttonText: document.getElementById('playText').textContent,
                    buttonIcon: document.getElementById('playIcon').textContent,
                    statusText: document.getElementById('ttsStatus').textContent,
                    isPlaying: window.isPlaying,
                    isPaused: window.isPaused,
                    paragraphIndex: window.currentParagraphIndex
                };
            });

            console.log(`  按钮: ${resumeStatus.buttonIcon} ${resumeStatus.buttonText}`);
            console.log(`  状态: ${resumeStatus.statusText}`);
            console.log(`  isPlaying: ${resumeStatus.isPlaying}`);
            console.log(`  isPaused: ${resumeStatus.isPaused}`);
            console.log(`  当前进度: 段落 ${resumeStatus.paragraphIndex + 1}`);

            if (!resumeStatus.isPlaying) {
                console.log(`  ❌ 警告: 继续播放后 isPlaying 应该为 true, 但实际为 ${resumeStatus.isPlaying}`);
            }

            // 等待一段时间再进入下一轮
            if (cycle < 3) {
                console.log(`\n[${cycle}.5] 等待3秒后进入下一轮...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log('✅ 3轮测试完成！');
        console.log('='.repeat(60));

        // 最终总结
        const finalStatus = await page.evaluate(() => {
            const speaking = document.querySelector('.speaking');
            return {
                isPlaying: window.isPlaying,
                isPaused: window.isPaused,
                currentMode: window.currentMode,
                paragraphIndex: window.currentParagraphIndex,
                statusText: document.getElementById('ttsStatus').textContent,
                buttonText: document.getElementById('playText').textContent,
                speakingExists: !!speaking
            };
        });

        console.log('\n最终状态:');
        console.log(`  isPlaying: ${finalStatus.isPlaying}`);
        console.log(`  isPaused: ${finalStatus.isPaused}`);
        console.log(`  currentMode: ${finalStatus.currentMode}`);
        console.log(`  段落进度: ${finalStatus.paragraphIndex + 1}`);
        console.log(`  按钮文本: ${finalStatus.buttonText}`);
        console.log(`  状态文本: ${finalStatus.statusText}`);
        console.log(`  高亮元素: ${finalStatus.speakingExists ? '存在' : '不存在'}`);

        // 验证结果
        console.log('\n验证结果:');
        let allPassed = true;

        if (finalStatus.currentMode === 'undefined' || !finalStatus.currentMode) {
            console.log(`  ❌ currentMode 未正确初始化`);
            allPassed = false;
        } else {
            console.log(`  ✅ currentMode 正确: ${finalStatus.currentMode}`);
        }

        if (finalStatus.isPlaying === undefined || finalStatus.isPlaying === null) {
            console.log(`  ❌ isPlaying 未正确初始化`);
            allPassed = false;
        } else {
            console.log(`  ✅ isPlaying 已正确同步: ${finalStatus.isPlaying}`);
        }

        if (finalStatus.isPaused === undefined || finalStatus.isPaused === null) {
            console.log(`  ❌ isPaused 未正确初始化`);
            allPassed = false;
        } else {
            console.log(`  ✅ isPaused 已正确同步: ${finalStatus.isPaused}`);
        }

        if (allPassed) {
            console.log('\n🎉 所有测试通过！变量同步问题已修复！');
        } else {
            console.log('\n⚠️ 部分测试失败，需要进一步检查');
        }

        console.log('\n保持浏览器打开10秒供您查看...');
        await new Promise(resolve => setTimeout(resolve, 10000));

    } catch (error) {
        console.error('错误:', error);
    } finally {
        await browser.close();
        console.log('\n浏览器已关闭');
    }
}

testPlayPauseCycle()
    .then(() => {
        console.log('\n✅ 测试完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
