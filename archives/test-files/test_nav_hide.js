const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:8000/records/2026-02-06-month-alone-chiang-mai.html';

console.log('🧪 导航栏自动隐藏功能测试\n');

async function testNavHide() {
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

        console.log('\n第2步: 检查导航栏初始状态');
        const initialCheck = await page.evaluate(() => {
            const panel = document.querySelector('.tts-panel');
            return {
                exists: !!panel,
                position: window.getComputedStyle(panel).position,
                transform: window.getComputedStyle(panel).transform,
                opacity: window.getComputedStyle(panel).opacity,
                hasTransition: window.getComputedStyle(panel).transition !== 'all 0s ease 0s'
            };
        });

        console.log('导航栏初始状态:');
        console.log(`  存在: ${initialCheck.exists ? '✅' : '❌'}`);
        console.log(`  定位: ${initialCheck.position}`);
        console.log(`  Transform: ${initialCheck.transform}`);
        console.log(`  Opacity: ${initialCheck.opacity}`);
        console.log(`  Transition: ${initialCheck.hasTransition ? '✅ 已启用' : '❌ 未启用'}`);

        console.log('\n第3步: 测试向下滚动（导航栏应该隐藏）');

        // 模拟向下滚动
        await page.evaluate(() => {
            window.scrollBy({ top: 300, behavior: 'smooth' });
        });
        await new Promise(resolve => setTimeout(resolve, 500));

        const afterScrollDown = await page.evaluate(() => {
            const panel = document.querySelector('.tts-panel');
            return {
                transform: window.getComputedStyle(panel).transform,
                opacity: window.getComputedStyle(panel).opacity,
                classes: panel.classList.toString()
            };
        });

        console.log(`向下滚动后:`);
        console.log(`  Transform: ${afterScrollDown.transform}`);
        console.log(`  Opacity: ${afterScrollDown.opacity}`);
        console.log(`  Classes: ${afterScrollDown.classes}`);

        if (afterScrollDown.classes.includes('nav-hidden')) {
            console.log('  ✅ 导航栏已隐藏');
        } else {
            console.log('  ⚠️ 导航栏未隐藏（可能需要滚动更多）');
        }

        console.log('\n第4步: 测试向上滚动（导航栏应该显示）');

        await page.evaluate(() => {
            window.scrollBy({ top: -200, behavior: 'smooth' });
        });
        await new Promise(resolve => setTimeout(resolve, 500));

        const afterScrollUp = await page.evaluate(() => {
            const panel = document.querySelector('.tts-panel');
            return {
                transform: window.getComputedStyle(panel).transform,
                opacity: window.getComputedStyle(panel).opacity,
                classes: panel.classList.toString()
            };
        });

        console.log(`向上滚动后:`);
        console.log(`  Transform: ${afterScrollUp.transform}`);
        console.log(`  Opacity: ${afterScrollUp.opacity}`);
        console.log(`  Classes: ${afterScrollUp.classes}`);

        if (afterScrollUp.classes.includes('nav-visible') || !afterScrollUp.classes.includes('nav-hidden')) {
            console.log('  ✅ 导航栏已显示');
        } else {
            console.log('  ⚠️ 导航栏未显示');
        }

        console.log('\n第5步: 测试多次滚动循环');
        for (let i = 1; i <= 3; i++) {
            console.log(`\n循环 ${i}:`);

            // 向下滚动
            await page.evaluate(() => window.scrollBy({ top: 150, behavior: 'smooth' }));
            await new Promise(resolve => setTimeout(resolve, 400));

            const downState = await page.evaluate(() => {
                const panel = document.querySelector('.tts-panel');
                return panel.classList.contains('nav-hidden');
            });
            console.log(`  向下滚动 - 导航栏: ${downState ? '🙈 隐藏' : '👁️ 显示'}`);

            // 向上滚动
            await page.evaluate(() => window.scrollBy({ top: -100, behavior: 'smooth' }));
            await new Promise(resolve => setTimeout(resolve, 400));

            const upState = await page.evaluate(() => {
                const panel = document.querySelector('.tts-panel');
                return panel.classList.contains('nav-hidden');
            });
            console.log(`  向上滚动 - 导航栏: ${upState ? '🙈 隐藏' : '👁️ 显示'}`);
        }

        console.log('\n第6步: 等待1秒测试自动显示功能');
        console.log('（停止滚动1秒后导航栏应该自动显示）');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const finalState = await page.evaluate(() => {
            const panel = document.querySelector('.tts-panel');
            return {
                transform: window.getComputedStyle(panel).transform,
                opacity: window.getComputedStyle(panel).opacity,
                classes: panel.classList.toString()
            };
        });

        console.log('\n最终状态:');
        console.log(`  Classes: ${finalState.classes}`);
        console.log(`  Opacity: ${finalState.opacity}`);

        if (!finalState.classes.includes('nav-hidden')) {
            console.log('  ✅ 导航栏已自动显示');
        }

        console.log('\n第7步: 保持浏览器打开10秒供您手动测试');
        console.log('💡 请尝试上下滚动页面查看导航栏的自动隐藏/显示效果\n');
        await new Promise(resolve => setTimeout(resolve, 10000));

    } catch (error) {
        console.error('错误:', error);
    } finally {
        await browser.close();
        console.log('\n浏览器已关闭');
    }
}

testNavHide()
    .then(() => {
        console.log('\n✅ 测试完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
