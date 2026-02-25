const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:8000/records/2026-02-06-coming-home.html';

console.log('🎙️ 简单可视化测试\n');

async function simpleTest() {
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
        console.log('加载页面...');
        await page.goto(TEST_URL, { waitUntil: 'networkidle2', timeout: 15000 });

        console.log('等待8秒...');
        await new Promise(resolve => setTimeout(resolve, 8000));

        console.log('\n点击播放...');
        await page.click('#playBtn');

        console.log('等待5秒让播放开始...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 多次检查状态
        for (let i = 1; i <= 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const status = await page.evaluate(() => {
                const speaking = document.querySelector('.speaking');
                return {
                    isPlaying: window.isPlaying,
                    currentParagraphIndex: window.currentParagraphIndex,
                    mode: window.currentMode,
                    statusText: document.getElementById('ttsStatus').textContent,
                    buttonText: document.getElementById('playText').textContent,
                    speakingExists: !!speaking,
                    speakingText: speaking ? speaking.textContent.substring(0, 50) : null
                };
            });

            console.log(`\n[${i * 2}秒] 状态:`);
            console.log(`  isPlaying: ${status.isPlaying}`);
            console.log(`  currentParagraphIndex: ${status.currentParagraphIndex}`);
            console.log(`  mode: ${status.mode}`);
            console.log(`  statusText: ${status.statusText}`);
            console.log(`  buttonText: ${status.buttonText}`);
            console.log(`  speakingExists: ${status.speakingExists}`);
        }

        console.log('\n\n保持浏览器打开20秒供您测试...');
        await new Promise(resolve => setTimeout(resolve, 20000));

    } catch (error) {
        console.error('错误:', error);
    } finally {
        await browser.close();
        console.log('\n浏览器已关闭');
    }
}

simpleTest();
