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
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('❌') || text.includes('Error')) {
            console.log(`  📌 ${text}`);
        }
    });

    page.on('pageerror', error => {
        console.log(`  🔴 ${error.message}`);
        testResults.failed.push({ name: '页面错误', message: error.message });
    });

    try {
        console.log('📋 测试 1: 页面加载');
        await page.goto(TEST_URL, { waitUntil: 'networkidle2', timeout: 10000 });
        logTest('页面加载', true, '页面已加载');

        console.log('\n📋 测试 2: 等待语音加载');
        await new Promise(resolve => setTimeout(resolve, 5000));

        const statusText = await page.$eval('#ttsStatus', el => el.textContent);
        console.log(`  状态: ${statusText}`);
        logTest('语音加载', statusText.includes('已加载'), statusText);

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

            results['可朗读段落'] = document.querySelectorAll('.word-card p, .word-card blockquote, .section p, .section blockquote, .expression-card p, .expression-card blockquote, .pattern-card p, .pattern-card blockquote').length > 0;

            return results;
        });

        Object.entries(elementChecks).forEach(([name, exists]) => {
            logTest(`DOM - ${name}`, exists, exists ? '已找到' : '未找到');
        });

        console.log('\n📋 测试 4: 学习模式按钮');
        const modeButtons = await page.evaluate(() => {
            const buttons = document.querySelectorAll('.mode-btn');
            return Array.from(buttons).map(btn => ({
                mode: btn.getAttribute('data-mode'),
                hasActive: btn.classList.contains('active')
            }));
        });

        logTest('模式按钮数量', modeButtons.length === 3, `找到 ${modeButtons.length} 个`);
        modeButtons.forEach(btn => {
            logTest(`模式按钮 - ${btn.mode}`, true, `激活: ${btn.hasActive}`);
        });

        console.log('\n📋 测试 5: 播放功能');
        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const playStatus = await page.evaluate(() => {
            return {
                buttonText: document.getElementById('playText').textContent,
                statusText: document.getElementById('ttsStatus').textContent,
                speakingElement: document.querySelector('.speaking') !== null
            };
        });

        console.log(`  播放状态: ${JSON.stringify(playStatus)}`);
        logTest('播放按钮点击', true, '已点击');
        logTest('按钮文案', playStatus.buttonText === '继续', `显示: ${playStatus.buttonText}`);
        logTest('高亮段落', playStatus.speakingElement, '有段落高亮');

        console.log('\n📋 测试 6: 暂停功能');
        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pauseStatus = await page.evaluate(() => {
            return {
                buttonText: document.getElementById('playText').textContent
            };
        });

        console.log(`  暂停状态: ${pauseStatus.buttonText}`);
        logTest('暂停功能', pauseStatus.buttonText === '播放', `按钮文案: ${pauseStatus.buttonText}`);

        console.log('\n📋 测试 7: 模式切换');
        // 先停止播放，否则模式切换会中断播放导致元素选择失败
        const isPlaying2 = await page.evaluate(() => window.isPlaying);
        if (isPlaying2) {
            await page.click('#playBtn'); // 停止播放
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        await page.click('.mode-btn.quick');
        await new Promise(resolve => setTimeout(resolve, 500));

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
            return document.querySelectorAll('.word-card p, .word-card blockquote, .section p, .section blockquote, .expression-card p, .expression-card blockquote, .pattern-card p, .pattern-card blockquote').length;
        });

        logTest('可朗读段落数量', paragraphCount > 10, `找到 ${paragraphCount} 个段落`);
        if (paragraphCount < 10) {
            logWarning('段落数量', '段落数量较少');
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

        const screenshotPath = '/tmp/tts_test_screenshot.png';
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`\n📸 截图已保存: ${screenshotPath}`);

    } catch (error) {
        console.error(`\n❌ 测试出错: ${error.message}`);
        testResults.failed.push({ name: '测试执行', message: error.message });
    } finally {
        await browser.close();
    }

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

    fs.writeFileSync('/tmp/tts_test_results.json', JSON.stringify(testResults, null, 2));
    console.log('\n💾 测试结果已保存到: /tmp/tts_test_results.json');

    return testResults;
}

runTests()
    .then(results => {
        const passRate = (results.passed.length / (results.passed.length + results.failed.length) * 100).toFixed(1);
        console.log(`\n🎯 通过率: ${passRate}%`);

        if (results.failed.length === 0) {
            console.log('\n🎉 所有测试通过！');
            process.exit(0);
        } else {
            console.log('\n⚠️ 部分测试失败，请查看详细信息');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n💥 测试执行失败:', error);
        process.exit(1);
    });
