const puppeteer = require('puppeteer');

const TEST_PAGES = [
    'http://localhost:8000/records/2026-02-06-coming-home.html',
    'http://localhost:8000/records/2026-02-06-month-alone-chiang-mai.html',
    'http://localhost:8000/records/2026-02-06-shanghai-starting-over.html'
];

console.log('🧪 测试所有三个页面的导航自动隐藏功能\n');

async function testPage(url, index) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    try {
        console.log(`测试页面 ${index + 1}: ${url.split('/').pop()}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 检查初始状态
        const initial = await page.evaluate(() => {
            const ttsPanel = document.querySelector('.tts-panel');
            const toc = document.querySelector('.toc');
            return {
                ttsPanelExists: !!ttsPanel,
                tocExists: !!toc,
                scrollY: window.scrollY
            };
        });

        if (!initial.ttsPanelExists || !initial.tocExists) {
            console.log(`  ❌ 导航元素不存在`);
            return false;
        }

        // 向下滚动
        await page.evaluate(() => {
            window.scrollBy({ top: 300, behavior: 'smooth' });
        });
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 检查隐藏状态
        const afterScrollDown = await page.evaluate(() => {
            const ttsPanel = document.querySelector('.tts-panel');
            const toc = document.querySelector('.toc');
            return {
                ttsPanelHidden: ttsPanel.classList.contains('nav-hidden'),
                tocHidden: toc.classList.contains('toc-hidden'),
                scrollY: window.scrollY
            };
        });

        if (afterScrollDown.ttsPanelHidden && afterScrollDown.tocHidden) {
            console.log(`  ✅ 向下滚动后两个导航都已隐藏`);

            // 向上滚动测试
            await page.evaluate(() => {
                window.scrollBy({ top: -200, behavior: 'smooth' });
            });
            await new Promise(resolve => setTimeout(resolve, 1000));

            const afterScrollUp = await page.evaluate(() => {
                const ttsPanel = document.querySelector('.tts-panel');
                const toc = document.querySelector('.toc');
                return {
                    ttsPanelHidden: ttsPanel.classList.contains('nav-hidden'),
                    tocHidden: toc.classList.contains('toc-hidden')
                };
            });

            if (!afterScrollUp.ttsPanelHidden && !afterScrollUp.tocHidden) {
                console.log(`  ✅ 向上滚动后两个导航都已显示`);
                return true;
            } else {
                console.log(`  ⚠️ 向上滚动后导航仍然是隐藏状态`);
                return false;
            }
        } else {
            console.log(`  ❌ 向下滚动后导航未隐藏`);
            console.log(`     TTS隐藏: ${afterScrollDown.ttsPanelHidden}, TOC隐藏: ${afterScrollDown.tocHidden}`);
            return false;
        }

    } catch (error) {
        console.log(`  💥 错误: ${error.message}`);
        return false;
    } finally {
        await browser.close();
    }
}

async function testAllPages() {
    let allPassed = true;

    for (let i = 0; i < TEST_PAGES.length; i++) {
        const passed = await testPage(TEST_PAGES[i], i);
        if (!passed) {
            allPassed = false;
        }
        console.log();
    }

    if (allPassed) {
        console.log('✅ 所有页面的导航自动隐藏功能测试通过！');
        process.exit(0);
    } else {
        console.log('❌ 部分页面测试失败');
        process.exit(1);
    }
}

testAllPages().catch(error => {
    console.error('💥 测试失败:', error);
    process.exit(1);
});
