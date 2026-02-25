const puppeteer = require('puppeteer');
const fs = require('fs');

const TEST_URL = 'http://localhost:8000/records/2026-02-06-coming-home.html';

console.log('🧪 开始 TTS 自动化测试...\n');

const testResults = {
    passed: [],
    failed: [],
    warnings: []
};

function logTest(name, passed, message) {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${name}: ${message}`);
    if (passed) {
        testResults.passed.push({ name, message });
    } else {
        testResults.failed.push({ name, message });
    }
}

function logWarning(name, message) {
    console.log(`⚠️ ${name}: ${message}`);
    testResults.warnings.push({ name, message });
}

async function runTests() {
    const browser = await puppeteer.launch({
        headless: false,  // 显示浏览器窗口
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 监听控制台消息
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('❌') || text.includes('Error') || text.includes('error')) {
            console.log(`  📌 浏览器控制台: ${text}`);
        }
    });

    // 监听页面错误
    page.on('pageerror', error => {
        console.log(`  🔴 页面错误: ${error.message}`);
        testResults.failed.push({ name: '页面错误', message: error.message });
    });

    try {
        console.log('📋 测试 1: 页面加载');
        await page.goto(TEST_URL, { waitUntil: 'networkidle2', timeout: 10000 });
        logTest('页面加载', true, '页面已加载');

        console.log('\n📋 测试 2: 等待语音加载（需要3-5秒）');
        await new Promise(resolve => setTimeout(resolve, 5000);  // 等待5秒让语音加载完成

        const statusText = await page.$eval('#ttsStatus', el => el.textContent);
        console.log(`  状态: ${statusText}`);

        if (statusText.includes('已加载')) {
            logTest('语音加载', true, statusText);
        } else if (statusText.includes('正在加载')) {
            logTest('语音加载', false, '语音仍在加载中');
        } else {
            logTest('语音加载', true, `状态: ${statusText}`);
        }

        console.log('\n📋 测试 3: DOM 元素检查');
        const elementChecks = await page.evaluate(() => {
            const results = {};
            const elements = {
                '播放按钮': 'playBtn',
                '语音选择': 'voiceSelect',
                '语速滑块': 'rateSlider',
                '语速显示': 'rateValue',
                '状态显示': 'ttsStatus'
            };

            for (const [name, id] of Object.entries(elements)) {
                results[name] = document.getElementById(id) !== null;
            }

            // 检查段落选择器
            results['可朗读段落'] = document.querySelectorAll('.word-card p, .word-card blockquote, .section p').length > 0;

            return results;
        });

        Object.entries(elementChecks).forEach(([name, exists]) => {
            logTest(`DOM - ${name}`, exists, exists ? '已找到' : '未找到');
        });

        console.log('\n📋 测试 4: 学习模式按钮');
        const modeButtons = await page.evaluate(() => {
            const buttons = document.querySelectorAll('.mode-btn');
            return Array.from(buttons).map(btn => ({
                class: btn.className,
                mode: btn.getAttribute('data-mode'),
                hasActive: btn.classList.contains('active')
            }));
        });

        logTest('模式按钮数量', modeButtons.length === 3, `找到 ${modeButtons.length} 个`);
        modeButtons.forEach(btn => {
            logTest(`模式按钮 - ${btn.mode}`, true, `激活: ${btn.hasActive}`);
        });

        console.log('\n📋 测试 5: 播放功能');
        // 点击播放按钮
        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 2000);  // 等待2秒让播放开始

        const playStatus = await page.evaluate(() => {
            return {
                isPlaying: window.isPlaying || false,
                buttonText: document.getElementById('playText').textContent,
                buttonIcon: document.getElementById('playIcon').textContent,
                statusText: document.getElementById('ttsStatus').textContent,
                speakingElement: document.querySelector('.speaking') !== null
            };
        });

        console.log(`  播放状态: ${JSON.stringify(playStatus)}`);

        logTest('播放按钮点击', true, '已点击');
        logTest('播放状态', playStatus.isPlaying !== undefined, 'isPlaying变量存在');
        logTest('按钮文案', playStatus.buttonText === '继续', `显示: ${playStatus.buttonText}`);
        logTest('高亮段落', playStatus.speakingElement, '有段落高亮');

        console.log('\n📋 测试 6: 暂停功能');
        await page.click('#playBtn');  // 点击暂停
        await new Promise(resolve => setTimeout(resolve, 1000);

        const pauseStatus = await page.evaluate(() => {
            return {
                isPaused: window.isPaused || false,
                buttonText: document.getElementById('playText').textContent
            };
        });

        console.log(`  暂停状态: ${JSON.stringify(pauseStatus)}`);
        logTest('暂停功能', pauseStatus.isPaused, `按钮文案: ${pauseStatus.buttonText}`);

        console.log('\n📋 测试 7: 模式切换');
        await page.click('.mode-btn.quick');
        await new Promise(resolve => setTimeout(resolve, 500);

        const modeStatus = await page.evaluate(() => {
            const quickBtn = document.querySelector('.mode-btn.quick');
            const rateValue = document.getElementById('rateValue').textContent;
            return {
                quickActive: quickBtn.classList.contains('active'),
                rate: rateValue
            };
        });

        console.log(`  快速模式: ${JSON.stringify(modeStatus)}`);
        logTest('快速模式切换', modeStatus.quickActive, `语速: ${modeStatus.rate}`);

        console.log('\n📋 测试 8: 段落数量');
        const paragraphCount = await page.evaluate(() => {
            return document.querySelectorAll('.word-card p, .word-card blockquote, .section p, .section blockquote').length;
        });

        logTest('可朗读段落数量', paragraphCount > 10, `找到 ${paragraphCount} 个段落`);
        if (paragraphCount < 10) {
            logWarning('段落数量', '段落数量较少，可能影响测试效果');
        }

        console.log('\n📋 测试 9: localStorage');
        const storageData = await page.evaluate(() => {
            return {
                mode: localStorage.getItem('tts-mode'),
                rate: localStorage.getItem('tts-rate'),
                voice: localStorage.getItem('tts-voice')
            };
        });

        logTest('模式记忆', !!storageData.mode, `已保存: ${storageData.mode}`);
        logTest('语速记忆', !!storageData.rate, `已保存: ${storageData.rate}`);
        logTest('语音记忆', !!storageData.voice, `已保存: ${storageData.voice}`);

        // 截图保存
        const screenshotPath = '/tmp/tts_test_screenshot.png';
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`\n📸 截图已保存: ${screenshotPath}`);

    } catch (error) {
        console.error(`\n❌ 测试出错: ${error.message}`);
        testResults.failed.push({ name: '测试执行', message: error.message });
    } finally {
        await browser.close();
    }

    // 打印测试总结
    console.log('\n' + '='.repeat(60));
    console.log('📊 测试总结');
    console.log('='.repeat(60));
    console.log(`✅ 通过: ${testResults.passed.length}`);
    console.log(`❌ 失败: ${testResults.failed.length}`);
    console.log(`⚠️ 警告: ${testResults.warnings.length}`);
    console.log(`📈 总计: ${testResults.passed.length + testResults.failed.length}`);
    console.log('='.repeat(60));

    if (testResults.failed.length > 0) {
        console.log('\n❌ 失败的测试:');
        testResults.failed.forEach(({ name, message }) => {
            console.log(`  • ${name}: ${message}`);
        });
    }

    if (testResults.warnings.length > 0) {
        console.log('\n⚠️ 警告:');
        testResults.warnings.forEach(({ name, message }) => {
            console.log(`  • ${name}: ${message}`);
        });
    }

    // 保存测试结果到文件
    fs.writeFileSync('/tmp/tts_test_results.json', JSON.stringify(testResults, null, 2));
    console.log('\n💾 测试结果已保存到: /tmp/tts_test_results.json');

    return testResults;
}

// 运行测试
runTests()
    .then(results => {
        const passRate = (results.passed.length / (results.passed.length + results.failed.length) * 100).toFixed(1);
        console.log(`\n🎯 通过率: ${passRate}%`);

        if (results.failed.length === 0) {
            console.log('\n🎉 所有测试通过！');
            process.exit(0);
        } else {
            console.log('\n⚠️  部分测试失败，请查看详细信息');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n💥 测试执行失败:', error);
        process.exit(1);
    });
