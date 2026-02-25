const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:8000/records/2026-02-06-coming-home.html';

console.log('🧪 导航栏和TOC自动隐藏功能测试 v2\n');

async function testNavAndTOCHide() {
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
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('\n第2步: 检查初始状态');
        const initialCheck = await page.evaluate(() => {
            const ttsPanel = document.querySelector('.tts-panel');
            const toc = document.querySelector('.toc');

            if (!ttsPanel || !toc) {
                return { error: '导航元素不存在' };
            }

            return {
                ttsPanel: {
                    exists: true,
                    classes: ttsPanel.className,
                    transform: window.getComputedStyle(ttsPanel).transform,
                    opacity: window.getComputedStyle(ttsPanel).opacity
                },
                toc: {
                    exists: true,
                    classes: toc.className,
                    transform: window.getComputedStyle(toc).transform,
                    opacity: window.getComputedStyle(toc).opacity
                },
                scrollY: window.scrollY
            };
        });

        console.log('TTS面板初始状态:');
        console.log(`  Classes: ${initialCheck.ttsPanel.classes}`);
        console.log(`  Transform: ${initialCheck.ttsPanel.transform}`);
        console.log(`  Opacity: ${initialCheck.ttsPanel.opacity}`);
        console.log('TOC初始状态:');
        console.log(`  Classes: ${initialCheck.toc.classes}`);
        console.log(`  Transform: ${initialCheck.toc.transform}`);
        console.log(`  Opacity: ${initialCheck.toc.opacity}`);
        console.log(`当前滚动位置: ${initialCheck.scrollY}px`);

        console.log('\n第3步: 向下滚动300px（超过50px阈值）');
        await page.evaluate(() => {
            window.scrollBy({ top: 300, behavior: 'smooth' });
        });
        await new Promise(resolve => setTimeout(resolve, 1000));

        const afterScrollDown = await page.evaluate(() => {
            const ttsPanel = document.querySelector('.tts-panel');
            const toc = document.querySelector('.toc');

            return {
                ttsPanel: {
                    classes: ttsPanel.className,
                    hasNavHidden: ttsPanel.classList.contains('nav-hidden'),
                    hasNavVisible: ttsPanel.classList.contains('nav-visible'),
                    transform: window.getComputedStyle(ttsPanel).transform,
                    opacity: window.getComputedStyle(ttsPanel).opacity
                },
                toc: {
                    classes: toc.className,
                    hasTocHidden: toc.classList.contains('toc-hidden'),
                    hasTocVisible: toc.classList.contains('toc-visible'),
                    transform: window.getComputedStyle(toc).transform,
                    opacity: window.getComputedStyle(toc).opacity
                },
                scrollY: window.scrollY
            };
        });

        console.log('向下滚动后状态:');
        console.log(`TTS面板:`);
        console.log(`  Classes: ${afterScrollDown.ttsPanel.classes}`);
        console.log(`  nav-hidden: ${afterScrollDown.ttsPanel.hasNavHidden ? '✅' : '❌'}`);
        console.log(`  nav-visible: ${afterScrollDown.ttsPanel.hasNavVisible ? '✅' : '❌'}`);
        console.log(`  Transform: ${afterScrollDown.ttsPanel.transform}`);
        console.log(`  Opacity: ${afterScrollDown.ttsPanel.opacity}`);
        console.log(`TOC:`);
        console.log(`  Classes: ${afterScrollDown.toc.classes}`);
        console.log(`  toc-hidden: ${afterScrollDown.toc.hasTocHidden ? '✅' : '❌'}`);
        console.log(`  toc-visible: ${afterScrollDown.toc.hasTocVisible ? '✅' : '❌'}`);
        console.log(`  Transform: ${afterScrollDown.toc.transform}`);
        console.log(`  Opacity: ${afterScrollDown.toc.opacity}`);
        console.log(`当前滚动位置: ${afterScrollDown.scrollY}px`);

        if (afterScrollDown.ttsPanel.hasNavHidden && afterScrollDown.toc.hasTocHidden) {
            console.log('\n✅ 两个导航都已隐藏！');
        } else {
            console.log('\n❌ 导航未隐藏，可能存在问题');
        }

        console.log('\n第4步: 向上滚动200px');
        await page.evaluate(() => {
            window.scrollBy({ top: -200, behavior: 'smooth' });
        });
        await new Promise(resolve => setTimeout(resolve, 1000));

        const afterScrollUp = await page.evaluate(() => {
            const ttsPanel = document.querySelector('.tts-panel');
            const toc = document.querySelector('.toc');

            return {
                ttsPanel: {
                    classes: ttsPanel.className,
                    hasNavHidden: ttsPanel.classList.contains('nav-hidden'),
                    hasNavVisible: ttsPanel.classList.contains('nav-visible'),
                    transform: window.getComputedStyle(ttsPanel).transform,
                    opacity: window.getComputedStyle(ttsPanel).opacity
                },
                toc: {
                    classes: toc.className,
                    hasTocHidden: toc.classList.contains('toc-hidden'),
                    hasTocVisible: toc.classList.contains('toc-visible'),
                    transform: window.getComputedStyle(toc).transform,
                    opacity: window.getComputedStyle(toc).opacity
                },
                scrollY: window.scrollY
            };
        });

        console.log('向上滚动后状态:');
        console.log(`TTS面板:`);
        console.log(`  nav-hidden: ${afterScrollUp.ttsPanel.hasNavHidden ? '✅' : '❌'}`);
        console.log(`  nav-visible: ${afterScrollUp.ttsPanel.hasNavVisible ? '✅' : '❌'}`);
        console.log(`  Opacity: ${afterScrollUp.ttsPanel.opacity}`);
        console.log(`TOC:`);
        console.log(`  toc-hidden: ${afterScrollUp.toc.hasTocHidden ? '✅' : '❌'}`);
        console.log(`  toc-visible: ${afterScrollUp.toc.hasTocVisible ? '✅' : '❌'}`);
        console.log(`  Opacity: ${afterScrollUp.toc.opacity}`);
        console.log(`当前滚动位置: ${afterScrollUp.scrollY}px`);

        if (!afterScrollUp.ttsPanel.hasNavHidden && !afterScrollUp.toc.hasTocHidden) {
            console.log('\n✅ 两个导航都已显示！');
        } else {
            console.log('\n⚠️ 导航可能仍然是隐藏状态');
        }

        console.log('\n第5步: 等待2秒测试自动显示功能');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const finalState = await page.evaluate(() => {
            const ttsPanel = document.querySelector('.tts-panel');
            const toc = document.querySelector('.toc');

            return {
                ttsPanel: {
                    classes: ttsPanel.className,
                    hasNavHidden: ttsPanel.classList.contains('nav-hidden'),
                    opacity: window.getComputedStyle(ttsPanel).opacity
                },
                toc: {
                    classes: toc.className,
                    hasTocHidden: toc.classList.contains('toc-hidden'),
                    opacity: window.getComputedStyle(toc).opacity
                }
            };
        });

        console.log('最终状态（停止滚动2秒后）:');
        console.log(`TTS面板 nav-hidden: ${finalState.ttsPanel.hasNavHidden ? '✅' : '❌'}`);
        console.log(`TTS面板 Opacity: ${finalState.ttsPanel.opacity}`);
        console.log(`TOC toc-hidden: ${finalState.toc.hasTocHidden ? '✅' : '❌'}`);
        console.log(`TOC Opacity: ${finalState.toc.opacity}`);

        if (!finalState.ttsPanel.hasNavHidden && !finalState.toc.hasTocHidden) {
            console.log('\n✅ 两个导航都已自动显示！');
        }

        console.log('\n第6步: 保持浏览器打开10秒供您手动测试');
        console.log('💡 请尝试上下滚动页面查看导航栏的自动隐藏/显示效果\n');
        await new Promise(resolve => setTimeout(resolve, 10000));

    } catch (error) {
        console.error('错误:', error);
    } finally {
        await browser.close();
        console.log('\n浏览器已关闭');
    }
}

testNavAndTOCHide()
    .then(() => {
        console.log('\n✅ 测试完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
