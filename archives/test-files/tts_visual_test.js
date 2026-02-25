const puppeteer = require('puppeteer');
const fs = require('fs');

const TEST_URLS = [
    'http://localhost:8000/records/2026-02-06-coming-home.html',
    'http://localhost:8000/records/2026-02-06-month-alone-chiang-mai.html',
    'http://localhost:8000/records/2026-02-06-shanghai-starting-over.html'
];

console.log('🎙️ 开始 TTS 可视化测试...\n');
console.log('将打开浏览器窗口，播放语音10秒钟...\n');

async function visualTest() {
    // 使用有界面的浏览器
    const browser = await puppeteer.launch({
        headless: false,  // 显示浏览器窗口
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: {
            width: 1280,
            height: 800
        }
    });

    const page = await browser.newPage();

    // 监听控制台消息
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('朗读') || text.includes('模式') || text.includes('切换') || text.includes('错误')) {
            console.log(`  📌 ${text}`);
        }
    });

    // 监听页面错误
    page.on('pageerror', error => {
        if (!error.message.includes('canceled')) {
            console.log(`  🔴 错误: ${error.message}`);
        }
    });

    try {
        // 测试第一个页面
        console.log(`📋 测试页面 1: coming-home.html`);
        console.log('=' .repeat(60));

        await page.goto(TEST_URLS[0], { waitUntil: 'networkidle2', timeout: 10000 });

        // 等待语音加载
        console.log('⏳ 等待语音加载...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 获取当前状态
        const initialStatus = await page.$eval('#ttsStatus', el => el.textContent);
        console.log(`📊 状态: ${initialStatus}`);

        // 检查段落数量
        const paragraphCount = await page.evaluate(() => {
            return document.querySelectorAll('.word-card p, .word-card blockquote, .section p, .section blockquote, .expression-card p, .expression-card blockquote, .pattern-card p, .pattern-card blockquote').length;
        });
        console.log(`📚 找到 ${paragraphCount} 个可朗读段落`);

        // 检查当前模式
        const currentMode = await page.evaluate(() => window.currentMode);
        const currentRate = await page.$eval('#rateValue', el => el.textContent);
        console.log(`🎯 当前模式: ${currentMode} (${currentRate})`);

        // 点击播放
        console.log('\n▶️  点击播放按钮...');
        await page.click('#playBtn');

        // 等待2秒让播放开始
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 检查播放状态
        const playStatus = await page.evaluate(() => {
            return {
                buttonText: document.getElementById('playText').textContent,
                buttonIcon: document.getElementById('playIcon').textContent,
                statusText: document.getElementById('ttsStatus').textContent,
                isPlaying: window.isPlaying,
                currentParagraphIndex: window.currentParagraphIndex,
                speakingElementCount: document.querySelectorAll('.speaking').length,
                rateValue: document.getElementById('rateValue').textContent
            };
        });

        console.log(`\n📊 播放状态:`);
        console.log(`   按钮: ${playStatus.buttonIcon} ${playStatus.buttonText}`);
        console.log(`   状态: ${playStatus.statusText}`);
        console.log(`   正在播放: ${playStatus.isPlaying ? '是' : '否'}`);
        console.log(`   当前段落: ${playStatus.currentParagraphIndex + 1}/${paragraphCount}`);
        console.log(`   高亮元素: ${playStatus.speakingElementCount} 个`);
        console.log(`   语速: ${playStatus.rateValue}`);

        // 检查高亮样式
        const speakingStyle = await page.evaluate(() => {
            const speaking = document.querySelector('.speaking');
            if (!speaking) return null;
            const computed = window.getComputedStyle(speaking);
            return {
                backgroundColor: computed.backgroundColor,
                fontSize: computed.fontSize,
                borderRadius: computed.borderRadius,
                boxShadow: computed.boxShadow
            };
        });

        if (speakingStyle) {
            console.log(`\n🎨 高亮样式:`);
            console.log(`   背景色: ${speakingStyle.backgroundColor}`);
            console.log(`   字体大小: ${speakingStyle.fontSize}`);
            console.log(`   圆角: ${speakingStyle.borderRadius}`);
        }

        // 等待10秒让用户听到语音
        console.log('\n⏰ 播放10秒钟，请聆听效果...');
        console.log('   (您现在应该能听到语音朗读，并看到黄色高亮的段落)\n');

        // 每2秒更新一次状态
        for (let i = 1; i <= 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const liveStatus = await page.evaluate(() => {
                return {
                    progress: document.getElementById('ttsStatus').textContent,
                    currentIndex: window.currentParagraphIndex
                };
            });

            console.log(`   [${i * 2}秒] ${liveStatus.progress}`);

            // 如果播放完成，提前退出
            if (liveStatus.progress.includes('播放完成')) {
                console.log('   ✅ 播放已完成！');
                break;
            }
        }

        // 测试暂停功能
        console.log('\n⏸️  测试暂停功能...');
        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pauseStatus = await page.evaluate(() => {
            return {
                buttonText: document.getElementById('playText').textContent,
                isPaused: window.isPaused
            };
        });

        console.log(`   按钮: ${pauseStatus.buttonText}`);
        console.log(`   已暂停: ${pauseStatus.isPaused ? '是' : '否'}`);

        // 测试模式切换
        console.log('\n⚡ 测试模式切换（快速模式）...');
        await page.click('.mode-btn.quick');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const modeStatus = await page.evaluate(() => {
            const quickBtn = document.querySelector('.mode-btn.quick');
            const standardBtn = document.querySelector('.mode-btn.standard');
            const rateValue = document.getElementById('rateValue').textContent;
            return {
                quickActive: quickBtn ? quickBtn.classList.contains('active') : false,
                standardActive: standardBtn ? standardBtn.classList.contains('active') : false,
                rate: rateValue
            };
        });

        console.log(`   快速模式激活: ${modeStatus.quickActive}`);
        console.log(`   标准模式激活: ${modeStatus.standardActive}`);
        console.log(`   语速: ${modeStatus.rate}`);

        // 继续播放5秒
        console.log('\n▶️  继续播放5秒钟（快速模式）...');
        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 最终状态检查
        const finalStatus = await page.evaluate(() => {
            return {
                isPlaying: window.isPlaying,
                currentParagraph: window.currentParagraphIndex,
                mode: window.currentMode,
                statusText: document.getElementById('ttsStatus').textContent
            };
        });

        console.log(`\n📊 最终状态:`);
        console.log(`   正在播放: ${finalStatus.isPlaying ? '是' : '否'}`);
        console.log(`   当前进度: 段落 ${finalStatus.currentParagraph + 1}`);
        console.log(`   当前模式: ${finalStatus.mode}`);
        console.log(`   状态: ${finalStatus.statusText}`);

        // 检查是否有错误
        const hasErrors = await page.evaluate(() => {
            const errorElements = document.querySelectorAll('[class*="error"]');
            return errorElements.length > 0;
        });

        console.log(`\n✅ 测试完成！`);
        console.log(`   ${hasErrors ? '⚠️  发现错误元素' : '✅ 未发现错误'}`);

        // 保持浏览器打开10秒供用户查看
        console.log('\n👀 浏览器将保持打开10秒供您查看...');
        console.log('   您可以手动操作页面进行测试\n');

        await new Promise(resolve => setTimeout(resolve, 10000));

    } catch (error) {
        console.error('\n❌ 测试出错:', error.message);
    } finally {
        await browser.close();
        console.log('\n🔚 浏览器已关闭');
    }
}

// 运行测试
visualTest()
    .then(() => {
        console.log('\n✅ 可视化测试完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
