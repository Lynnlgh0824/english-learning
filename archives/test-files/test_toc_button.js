const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:8000/records/2026-02-06-coming-home.html';

console.log('🧪 TOC 自动隐藏和按钮控制功能测试\n');

async function testTOCButton() {
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
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('\n第2步: 检查初始状态');
        const initialState = await page.evaluate(() => {
            const toc = document.querySelector('.toc');
            const toggleBtn = document.getElementById('tocToggleBtn');
            const ttsPanel = document.querySelector('.tts-panel');

            return {
                tocExists: !!toc,
                tocClasses: toc ? toc.className : 'N/A',
                tocVisible: toc ? toc.classList.contains('toc-visible') : false,
                tocHidden: toc ? toc.classList.contains('toc-hidden') : false,
                toggleBtnExists: !!toggleBtn,
                ttsPanelExists: !!ttsPanel,
                ttsPanelClasses: ttsPanel ? ttsPanel.className : 'N/A',
                ttsPanelHasNavHidden: ttsPanel ? ttsPanel.classList.contains('nav-hidden') : false
            };
        });

        console.log('TOC 初始状态:');
        console.log(`  存在: ${initialState.tocExists ? '✅' : '❌'}`);
        console.log(`  类名: ${initialState.tocClasses}`);
        console.log(`  toc-visible: ${initialState.tocVisible ? '✅' : '❌'}`);
        console.log(`  toc-hidden: ${initialState.tocHidden ? '✅' : '❌'}`);
        console.log('切换按钮:');
        console.log(`  存在: ${initialState.toggleBtnExists ? '✅' : '❌'}`);
        console.log('TTS 面板:');
        console.log(`  存在: ${initialState.ttsPanelExists ? '✅' : '❌'}`);
        console.log(`  类名: ${initialState.ttsPanelClasses}`);
        console.log(`  nav-hidden: ${initialState.ttsPanelHasNavHidden ? '❌ 不应该有' : '✅ 正常（无隐藏功能）'}`);

        console.log('\n第3步: 等待4秒（测试3秒后自动隐藏）');
        await new Promise(resolve => setTimeout(resolve, 4000));

        const afterAutoHide = await page.evaluate(() => {
            const toc = document.querySelector('.toc');
            return {
                tocClasses: toc.className,
                tocVisible: toc.classList.contains('toc-visible'),
                tocHidden: toc.classList.contains('toc-hidden'),
                toggleBtnVisible: document.getElementById('tocToggleBtn') ?
                    window.getComputedStyle(document.getElementById('tocToggleBtn')).visibility !== 'hidden' : false
            };
        });

        console.log('3秒后 TOC 状态:');
        console.log(`  toc-visible: ${afterAutoHide.tocVisible ? '❌ 应该隐藏' : '✅ 已隐藏'}`);
        console.log(`  toc-hidden: ${afterAutoHide.tocHidden ? '✅' : '❌'}`);
        console.log(`  按钮可见: ${afterAutoHide.toggleBtnVisible ? '✅' : '❌'}`);

        console.log('\n第4步: 点击按钮显示 TOC');
        await page.click('#tocToggleBtn');
        await new Promise(resolve => setTimeout(resolve, 500));

        const afterClickShow = await page.evaluate(() => {
            const toc = document.querySelector('.toc');
            return {
                tocClasses: toc.className,
                tocVisible: toc.classList.contains('toc-visible'),
                tocHidden: toc.classList.contains('toc-hidden')
            };
        });

        console.log('点击按钮后 TOC 状态:');
        console.log(`  toc-visible: ${afterClickShow.tocVisible ? '✅' : '❌'}`);
        console.log(`  toc-hidden: ${afterClickShow.tocHidden ? '❌ 应该显示' : '✅'}`);

        console.log('\n第5步: 再次点击按钮隐藏 TOC');
        await page.click('#tocToggleBtn');
        await new Promise(resolve => setTimeout(resolve, 500));

        const afterClickHide = await page.evaluate(() => {
            const toc = document.querySelector('.toc');
            return {
                tocClasses: toc.className,
                tocVisible: toc.classList.contains('toc-visible'),
                tocHidden: toc.classList.contains('toc-hidden')
            };
        });

        console.log('再次点击按钮后 TOC 状态:');
        console.log(`  toc-visible: ${afterClickHide.tocVisible ? '❌ 应该隐藏' : '✅'}`);
        console.log(`  toc-hidden: ${afterClickHide.tocHidden ? '✅' : '❌'}`);

        console.log('\n第6步: 点击按钮显示 TOC，然后点击其他区域测试自动隐藏');
        await page.click('#tocToggleBtn');
        await new Promise(resolve => setTimeout(resolve, 500));

        const beforeClickOutside = await page.evaluate(() => {
            const toc = document.querySelector('.toc');
            return toc.classList.contains('toc-visible');
        });

        console.log(`TOC 显示状态: ${beforeClickOutside ? '✅' : '❌'}`);

        // 点击页面其他区域（使用 evaluate 点击）
        await page.evaluate(() => {
            document.querySelector('.section').click();
        });
        await new Promise(resolve => setTimeout(resolve, 500));

        const afterClickOutside = await page.evaluate(() => {
            const toc = document.querySelector('.toc');
            return {
                tocClasses: toc.className,
                tocVisible: toc.classList.contains('toc-visible'),
                tocHidden: toc.classList.contains('toc-hidden')
            };
        });

        console.log('点击其他区域后 TOC 状态:');
        console.log(`  toc-visible: ${afterClickOutside.tocVisible ? '❌ 应该隐藏' : '✅'}`);
        console.log(`  toc-hidden: ${afterClickOutside.tocHidden ? '✅' : '❌'}`);

        console.log('\n第7步: 测试滚动行为（TTS 面板应该保持显示）');
        await page.evaluate(() => {
            window.scrollBy({ top: 300, behavior: 'smooth' });
        });
        await new Promise(resolve => setTimeout(resolve, 1000));

        const afterScroll = await page.evaluate(() => {
            const ttsPanel = document.querySelector('.tts-panel');
            return {
                scrollY: window.scrollY,
                ttsPanelClasses: ttsPanel.className,
                ttsPanelHasNavHidden: ttsPanel.classList.contains('nav-hidden')
            };
        });

        console.log('滚动后状态:');
        console.log(`  滚动位置: ${afterScroll.scrollY}px`);
        console.log(`  TTS 面板 nav-hidden: ${afterScroll.ttsPanelHasNavHidden ? '❌ 不应该隐藏' : '✅ 保持显示'}`);

        console.log('\n第8步: 保持浏览器打开10秒供您手动测试');
        console.log('💡 请尝试点击导航按钮、点击目录链接、点击其他区域等功能\n');
        await new Promise(resolve => setTimeout(resolve, 10000));

        console.log('\n✅ 所有测试完成！');

    } catch (error) {
        console.error('错误:', error);
    } finally {
        await browser.close();
        console.log('\n浏览器已关闭');
    }
}

testTOCButton()
    .then(() => {
        console.log('\n✅ 测试完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
