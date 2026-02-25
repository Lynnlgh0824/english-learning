const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:8000/records/2026-02-06-coming-home.html';

console.log('🧪 导航栏和TOC自动隐藏功能测试\n');

async function testNavAndTOC() {
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
        console.log('第1步: 加载页面');
        await page.goto(TEST_URL, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log('\n第2步: 检查初始状态');
        const initialCheck = await page.evaluate(() => {
            const panel = document.querySelector('.tts-panel');
            const toc = document.querySelector('.toc');
            return {
                panelExists: !!panel,
                tocExists: !!toc,
                panelTransform: panel ? window.getComputedStyle(panel).transform : null,
                tocTransform: toc ? window.getComputedStyle(toc).transform : null,
                panelOpacity: panel ? window.getComputedStyle(panel).opacity : null,
                tocOpacity: toc ? window.getComputedStyle(toc).opacity : null
            };
        });

        console.log('TTS面板:');
        console.log(`  存在: ${initialCheck.panelExists ? '✅' : '❌'}`);
        console.log(`  Transform: ${initialCheck.panelTransform || 'N/A'}`);
        console.log(`  Opacity: ${initialCheck.panelOpacity || 'N/A'}`);

        console.log('TOC导航:');
        console.log(`  存在: ${initialCheck.tocExists ? '✅' : '❌'}`);
        console.log(`  Transform: ${initialCheck.tocTransform || 'N/A'}`);
        console.log(`  Opacity: ${initialCheck.tocOpacity || 'N/A'}`);

        console.log('\n第3步: 测试向下滚动（两个导航都应该隐藏）');

        await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
        await new Promise(resolve => setTimeout(resolve, 500));

        const afterScrollDown = await page.evaluate(() => {
            const panel = document.querySelector('.tts-panel');
            const toc = document.querySelector('.toc');
            return {
                panelHidden: panel ? panel.classList.contains('nav-hidden') : false,
                tocHidden: toc ? toc.classList.contains('toc-hidden') : false,
                panelClasses: panel ? panel.classList.toString() : '',
                tocClasses: toc ? toc.classList.toString() : ''
            };
        });

        console.log('向下滚动后:');
        console.log(`  TTS面板: ${afterScrollDown.panelHidden ? '🙈 已隐藏' : '👁️ 显示'}`);
        console.log(`  TOC导航: ${afterScrollDown.tocHidden ? '🙈 已隐藏' : '👁️ 显示'}`);

        console.log('\n第4步: 测试向上滚动（两个导航都应该显示）');

        await page.evaluate(() => window.scrollBy({ top: -200, behavior: 'smooth' }));
        await new Promise(resolve => setTimeout(resolve, 500));

        const afterScrollUp = await page.evaluate(() => {
            const panel = document.querySelector('.tts-panel');
            const toc = document.querySelector('.toc');
            return {
                panelVisible: panel ? panel.classList.contains('nav-visible') : false,
                tocVisible: toc ? toc.classList.contains('toc-visible') : false,
                panelClasses: panel ? panel.classList.toString() : '',
                tocClasses: toc ? toc.classList.toString() : ''
            };
        });

        console.log('向上滚动后:');
        console.log(`  TTS面板: ${afterScrollUp.panelVisible ? '👁️ 已显示' : '🙈 隐藏'}`);
        console.log(`  TOC导航: ${afterScrollUp.tocVisible ? '👁️ 已显示' : '🙈 隐藏'}`);

        console.log('\n第5步: 测试多次滚动循环');
        for (let i = 1; i <= 3; i++) {
            console.log(`\n循环 ${i}:`);

            // 向下滚动
            await page.evaluate(() => window.scrollBy({ top: 150, behavior: 'smooth' }));
            await new Promise(resolve => setTimeout(resolve, 400));

            const downState = await page.evaluate(() => {
                const panel = document.querySelector('.tts-panel');
                const toc = document.querySelector('.toc');
                return {
                    panelHidden: panel ? panel.classList.contains('nav-hidden') : false,
                    tocHidden: toc ? toc.classList.contains('toc-hidden') : false
                };
            });

            console.log(`  向下滚动 - TTS: ${downState.panelHidden ? '🙈' : '👁️'} | TOC: ${downState.tocHidden ? '🙈' : '👁️'}`);

            // 向上滚动
            await page.evaluate(() => window.scrollBy({ top: -100, behavior: 'smooth' }));
            await new Promise(resolve => setTimeout(resolve, 400));

            const upState = await page.evaluate(() => {
                const panel = document.querySelector('.tts-panel');
                const toc = document.querySelector('.toc');
                return {
                    panelVisible: panel ? panel.classList.contains('nav-visible') : false,
                    tocVisible: toc ? toc.classList.contains('toc-visible') : false
                };
            });

            console.log(`  向上滚动 - TTS: ${upState.panelVisible ? '👁️' : '🙈'} | TOC: ${upState.tocVisible ? '👁️' : '🙈'}`);
        }

        console.log('\n第6步: 等待2秒测试自动显示功能');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const finalState = await page.evaluate(() => {
            const panel = document.querySelector('.tts-panel');
            const toc = document.querySelector('.toc');
            return {
                panelClasses: panel ? panel.classList.toString() : '',
                tocClasses: toc ? toc.classList.toString() : ''
            };
        });

        console.log('\n最终状态:');
        console.log(`  TTS面板: ${finalState.panelClasses}`);
        console.log(`  TOC导航: ${finalState.tocClasses}`);

        const bothVisible = !finalState.panelClasses.includes('nav-hidden') && !finalState.tocClasses.includes('toc-hidden');
        if (bothVisible) {
            console.log('  ✅ 两个导航都已自动显示');
        }

        console.log('\n第7步: 保持浏览器打开10秒供您手动测试');
        console.log('💡 请尝试上下滚动页面查看两个导航的自动隐藏/显示效果\n');
        await new Promise(resolve => setTimeout(resolve, 10000));

    } catch (error) {
        console.error('错误:', error);
    } finally {
        await browser.close();
        console.log('\n浏览器已关闭');
    }
}

testNavAndTOC()
    .then(() => {
        console.log('\n✅ 测试完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
