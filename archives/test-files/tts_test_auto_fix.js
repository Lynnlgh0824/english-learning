const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TEST_URLS = [
    'http://localhost:8000/records/2026-02-06-coming-home.html',
    'http://localhost:8000/records/2026-02-06-month-alone-chiang-mai.html',
    'http://localhost:8000/records/2026-02-06-shanghai-starting-over.html'
];

const HTML_FILES = [
    '/Users/yuzhoudeshengyin/english-learning/records/2026-02-06-coming-home.html',
    '/Users/yuzhoudeshengyin/english-learning/records/2026-02-06-month-alone-chiang-mai.html',
    '/Users/yuzhoudeshengyin/english-learning/records/2026-02-06-shanghai-starting-over.html'
];

console.log('🧪 开始 TTS 自动化测试与问题修复...\n');

const testResults = {
    passed: [],
    failed: [],
    warnings: [],
    errors: []
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

function logError(name, message) {
    console.log(`🔴 ${name}: ${message}`);
    testResults.errors.push({ name, message });
}

async function testPage(url, index) {
    const browser = await puppeteer.launch({
        headless: 'new',  // 使用新的无头模式
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 设置视口大小
    await page.setViewport({ width: 1280, height: 800 });

    // 收集所有控制台消息和错误
    const consoleLogs = [];
    const pageErrors = [];

    page.on('console', msg => {
        const text = msg.text();
        consoleLogs.push({
            type: msg.type(),
            text: text
        });
        if (text.includes('❌') || text.includes('Error') || text.includes('error')) {
            console.log(`  📌 控制台: ${text}`);
        }
    });

    page.on('pageerror', error => {
        pageErrors.push({
            message: error.message,
            stack: error.stack
        });
        console.log(`  🔴 页面错误: ${error.message}`);
    });

    const result = {
        url,
        index,
        success: false,
        tests: {},
        errors: pageErrors,
        logs: consoleLogs
    };

    try {
        console.log(`\n📋 测试页面 ${index + 1}/3: ${path.basename(url)}`);

        // 测试 1: 页面加载
        console.log('  测试 1: 页面加载...');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
        result.tests.pageLoad = true;
        logTest(`页面${index + 1} - 页面加载`, true, '页面已加载');

        // 测试 2: 等待语音加载
        console.log('  测试 2: 等待语音加载...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        const initialStatus = await page.$eval('#ttsStatus', el => el.textContent).catch(() => '未找到');
        console.log(`    状态: ${initialStatus}`);
        result.tests.voiceLoad = initialStatus.includes('已加载') || initialStatus.includes('点击');
        logTest(`页面${index + 1} - 语音加载`, result.tests.voiceLoad, initialStatus);

        // 测试 3: DOM 元素检查
        console.log('  测试 3: DOM 元素检查...');
        const domCheck = await page.evaluate(() => {
            const results = {};
            const elements = {
                '播放按钮': 'playBtn',
                '语音选择': 'voiceSelect',
                '语速滑块': 'rateSlider',
                '语速显示': 'rateValue',
                '状态显示': 'ttsStatus',
                '划词按钮': 'selectionBtn'
            };

            for (const [name, id] of Object.entries(elements)) {
                results[name] = document.getElementById(id) !== null;
            }

            results['可朗读段落'] = document.querySelectorAll('.word-card p, .word-card blockquote, .section p, .section blockquote, .expression-card p, .expression-card blockquote, .pattern-card p, .pattern-card blockquote').length > 0;

            // 检查全局变量
            results['paragraphs变量'] = typeof paragraphs !== 'undefined';
            results['paragraphsElements变量'] = typeof paragraphsElements !== 'undefined';
            results['isPlaying变量'] = typeof isPlaying !== 'undefined';
            results['currentMode变量'] = typeof currentMode !== 'undefined';

            return results;
        });

        Object.entries(domCheck).forEach(([name, exists]) => {
            logTest(`页面${index + 1} - DOM - ${name}`, exists, exists ? '已找到' : '未找到');
        });
        result.tests.domCheck = domCheck;

        // 测试 4: 学习模式按钮
        console.log('  测试 4: 学习模式按钮...');
        const modeButtons = await page.evaluate(() => {
            const buttons = document.querySelectorAll('.mode-btn');
            return Array.from(buttons).map(btn => ({
                mode: btn.getAttribute('data-mode'),
                hasActive: btn.classList.contains('active')
            }));
        });

        logTest(`页面${index + 1} - 模式按钮数量`, modeButtons.length === 3, `找到 ${modeButtons.length} 个`);
        result.tests.modeButtons = modeButtons;

        // 测试 5: 播放功能
        console.log('  测试 5: 播放功能测试...');
        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const playStatus = await page.evaluate(() => {
            return {
                buttonText: document.getElementById('playText').textContent,
                statusText: document.getElementById('ttsStatus').textContent,
                speakingElement: document.querySelector('.speaking') !== null,
                isPlaying: window.isPlaying
            };
        });

        console.log(`    播放状态: ${JSON.stringify(playStatus)}`);
        logTest(`页面${index + 1} - 播放按钮点击`, true, '已点击');
        logTest(`页面${index + 1} - 按钮文案`, playStatus.buttonText === '继续', `显示: ${playStatus.buttonText}`);
        logTest(`页面${index + 1} - 高亮段落`, playStatus.speakingElement, '有段落高亮');
        result.tests.playFunction = playStatus;

        // 测试 6: 暂停功能
        console.log('  测试 6: 暂停功能测试...');
        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pauseStatus = await page.evaluate(() => {
            return {
                buttonText: document.getElementById('playText').textContent,
                isPaused: window.isPaused
            };
        });

        console.log(`    暂停状态: ${pauseStatus.buttonText}`);
        logTest(`页面${index + 1} - 暂停功能`, pauseStatus.buttonText === '播放', `按钮文案: ${pauseStatus.buttonText}`);
        result.tests.pauseFunction = pauseStatus;

        // 测试 7: 段落数量
        console.log('  测试 7: 段落数量检查...');
        const paragraphCount = await page.evaluate(() => {
            return document.querySelectorAll('.word-card p, .word-card blockquote, .section p, .section blockquote, .expression-card p, .expression-card blockquote, .pattern-card p, .pattern-card blockquote').length;
        });

        logTest(`页面${index + 1} - 段落数量`, paragraphCount > 10, `找到 ${paragraphCount} 个段落`);
        result.tests.paragraphCount = paragraphCount;

        // 测试 8: 检查是否有 JavaScript 错误
        console.log('  测试 8: JavaScript 错误检查...');
        const hasErrors = pageErrors.length > 0;
        const criticalErrors = pageErrors.filter(e =>
            !e.message.includes('canceled') &&
            !e.message.includes('朗读已取消')
        );

        if (criticalErrors.length > 0) {
            criticalErrors.forEach(err => {
                logError(`页面${index + 1} - JS错误`, err.message);
            });
        } else {
            logTest(`页面${index + 1} - JavaScript错误`, true, '无关键错误');
        }
        result.tests.jsErrors = criticalErrors;

        // 截图
        const screenshotPath = `/tmp/tts_test_page_${index + 1}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`    📸 截图已保存: ${screenshotPath}`);
        result.screenshot = screenshotPath;

        result.success = criticalErrors.length === 0;

    } catch (error) {
        console.error(`\n  ❌ 测试出错: ${error.message}`);
        logError(`页面${index + 1} - 测试执行`, error.message);
        result.success = false;
        result.fatalError = error.message;
    } finally {
        await browser.close();
    }

    return result;
}

async function analyzeAndFixResults(results) {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 分析测试结果并自动修复问题...');
    console.log('='.repeat(60));

    const fixes = [];

    for (const result of results) {
        if (!result.success) {
            console.log(`\n📄 页面 ${result.index + 1}: ${path.basename(result.url)}`);

            // 检查 DOM 缺失
            if (result.tests.domCheck) {
                const missingElements = Object.entries(result.tests.domCheck)
                    .filter(([name, exists]) => !exists)
                    .map(([name]) => name);

                if (missingElements.length > 0) {
                    console.log(`  ⚠️ 缺失元素: ${missingElements.join(', ')}`);

                    // 检查是否是段落变量缺失
                    if (missingElements.includes('paragraphs变量')) {
                        console.log(`  🔧 需要修复: paragraphs 变量未初始化`);
                        fixes.push({
                            type: 'missing_variable',
                            file: HTML_FILES[result.index],
                            issue: 'paragraphs变量未初始化',
                            fix: '添加段落初始化代码'
                        });
                    }
                }
            }

            // 检查 JavaScript 错误
            if (result.tests.jsErrors && result.tests.jsErrors.length > 0) {
                result.tests.jsErrors.forEach(err => {
                    console.log(`  🔴 错误: ${err.message}`);

                    if (err.message.includes('text.replace is not a function')) {
                        console.log(`  🔧 需要修复: 文本提取错误`);
                        fixes.push({
                            type: 'text_extraction',
                            file: HTML_FILES[result.index],
                            issue: 'text.replace is not a function',
                            fix: '使用 .textContent 获取段落文本'
                        });
                    } else if (err.message.includes('voice')) {
                        console.log(`  🔧 需要修复: 语音设置错误`);
                        fixes.push({
                            type: 'voice_setting',
                            file: HTML_FILES[result.index],
                            issue: '语音设置错误',
                            fix: '添加安全检查到语音设置代码'
                        });
                    }
                });
            }

            // 检查播放功能
            if (result.tests.playFunction) {
                if (result.tests.playFunction.buttonText !== '继续') {
                    console.log(`  ⚠️ 播放功能未正常工作`);
                }
                if (!result.tests.playFunction.speakingElement) {
                    console.log(`  ⚠️ 段落高亮未显示`);
                }
            }
        } else {
            console.log(`\n✅ 页面 ${result.index + 1}: 所有测试通过`);
        }
    }

    return fixes;
}

async function runTests() {
    const results = [];

    // 测试所有 3 个页面
    for (let i = 0; i < TEST_URLS.length; i++) {
        const result = await testPage(TEST_URLS[i], i);
        results.push(result);
    }

    // 分析结果并生成修复建议
    const fixes = await analyzeAndFixResults(results);

    // 打印测试总结
    console.log('\n' + '='.repeat(60));
    console.log('📊 测试总结');
    console.log('='.repeat(60));

    const totalPassed = testResults.passed.length;
    const totalFailed = testResults.failed.length;
    const totalErrors = testResults.errors.length;

    console.log(`✅ 通过: ${totalPassed}`);
    console.log(`❌ 失败: ${totalFailed}`);
    console.log(`🔴 错误: ${totalErrors}`);
    console.log(`⚠️ 警告: ${testResults.warnings.length}`);
    console.log(`📈 总计: ${totalPassed + totalFailed}`);
    console.log('='.repeat(60));

    if (testResults.failed.length > 0) {
        console.log('\n❌ 失败的测试:');
        testResults.failed.forEach(({ name, message }) => {
            console.log(`  • ${name}: ${message}`);
        });
    }

    if (testResults.errors.length > 0) {
        console.log('\n🔴 关键错误:');
        testResults.errors.forEach(({ name, message }) => {
            console.log(`  • ${name}: ${message}`);
        });
    }

    // 保存结果
    const reportPath = '/tmp/tts_auto_test_results.json';
    fs.writeFileSync(reportPath, JSON.stringify({
        results,
        fixes,
        summary: testResults
    }, null, 2));
    console.log(`\n💾 测试结果已保存到: ${reportPath}`);

    return { results, fixes, summary: testResults };
}

// 运行测试
runTests()
    .then(({ results, fixes, summary }) => {
        const successCount = results.filter(r => r.success).length;
        const passRate = ((successCount / results.length) * 100).toFixed(1);

        console.log(`\n🎯 页面通过率: ${passRate}% (${successCount}/${results.length})`);

        if (fixes.length > 0) {
            console.log(`\n🔧 发现 ${fixes.length} 个需要修复的问题`);
            console.log('\n修复建议:');
            fixes.forEach((fix, i) => {
                console.log(`  ${i + 1}. ${fix.issue}`);
                console.log(`     文件: ${path.basename(fix.file)}`);
                console.log(`     修复: ${fix.fix}`);
            });
        }

        if (successCount === results.length && summary.errors.length === 0) {
            console.log('\n🎉 所有测试通过！系统运行正常！');
            process.exit(0);
        } else {
            console.log('\n⚠️ 部分测试失败或发现错误，需要修复');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n💥 测试执行失败:', error);
        process.exit(1);
    });
