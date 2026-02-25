/**
 * ========================================
 * E2E 自动化测试套件
 * ========================================
 * 功能：端到端测试整个英语学习系统
 *
 * 依赖：
 * - puppeteer: npm install puppeteer
 * - 启动服务器: python server.py 或 ./start-server.sh
 *
 * 运行：
 * node tests/automated-e2e-test.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ========================================
// 配置
// ========================================

const CONFIG = {
    BASE_URL: 'http://localhost:8000',
    TIMEOUT: 30000,
    HEADLESS: false, // 显示浏览器窗口以便调试
    SCREENSHOT_DIR: 'test-screenshots',
    REPORT_DIR: 'test-reports'
};

// 测试页面列表
const TEST_PAGES = [
    { name: 'Coming Home', url: '/records/2026-02-06-coming-home.html' },
    { name: 'Month Alone Chiang Mai', url: '/records/2026-02-06-month-alone-chiang-mai.html' },
    { name: 'Shanghai Starting Over', url: '/records/2026-02-06-shanghai-starting-over.html' },
    { name: 'YouTube Entrepreneurship', url: '/records/2026-02-06-youtube-entrepreneurship.html' }
];

// ========================================
// 测试结果记录
// ========================================

const testResults = {
    startTime: new Date(),
    suites: [],
    summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
    }
};

// ========================================
// 工具函数
// ========================================

function log(message, type = 'info') {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        error: '❌',
        warning: '⚠️',
        test: '🧪'
    };
    console.log(`${icons[type]} ${message}`);
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function screenshot(page, name) {
    const dir = path.join(CONFIG.SCREENSHOT_DIR);
    ensureDir(dir);
    const filepath = path.join(dir, `${name}.png`);
    await page.screenshot({ path: filepath, fullPage: true });
    log(`截图已保存: ${filepath}`, 'info');
}

// ========================================
// 测试套件
// ========================================

class TestSuite {
    constructor(name, browser) {
        this.name = name;
        this.browser = browser;
        this.page = null;
        this.results = {
            passed: [],
            failed: [],
            warnings: []
        };
    }

    async setup() {
        this.page = await this.browser.newPage();
        this.page.setDefaultTimeout(CONFIG.TIMEOUT);

        // 监听控制台消息
        this.page.on('console', msg => {
            const text = msg.text();
            if (text.includes('❌') || text.includes('Error')) {
                log(`  控制台: ${text}`, 'warning');
            }
        });

        // 监听页面错误
        this.page.on('pageerror', error => {
            this.recordFailure('页面错误', error.message);
        });

        log(`\n🧪 测试套件: ${this.name}`, 'test');
    }

    async cleanup() {
        if (this.page) {
            await this.page.close();
        }
    }

    recordSuccess(name, message) {
        this.results.passed.push({ name, message });
        log(`  ✓ ${name}`, 'success');
    }

    recordFailure(name, message) {
        this.results.failed.push({ name, message });
        log(`  ✗ ${name}: ${message}`, 'error');
    }

    recordWarning(name, message) {
        this.results.warnings.push({ name, message });
        log(`  ⚠ ${name}: ${message}`, 'warning');
    }

    getResults() {
        return {
            name: this.name,
            ...this.results,
            total: this.results.passed.length + this.results.failed.length
        };
    }
}

// ========================================
// 页面基础测试
// ========================================

async function testPageBasic(suite, url, name) {
    await suite.setup();

    try {
        log(`\n  测试页面: ${name}`, 'info');

        // 1. 访问页面
        await suite.page.goto(`${CONFIG.BASE_URL}${url}`, {
            waitUntil: 'networkidle2'
        });
        suite.recordSuccess('页面加载', `成功加载 ${url}`);

        // 2. 检查标题
        const title = await suite.page.title();
        if (title && title.length > 0) {
            suite.recordSuccess('页面标题', title);
        } else {
            suite.recordFailure('页面标题', '标题为空');
        }

        // 3. 检查主要内容区域
        const mainContent = await suite.page.$('.container');
        if (mainContent) {
            suite.recordSuccess('内容区域', '找到 .container 元素');
        } else {
            suite.recordFailure('内容区域', '未找到 .container 元素');
        }

        // 4. 检查 TTS 面板
        const ttsPanel = await suite.page.$('.tts-panel');
        if (ttsPanel) {
            suite.recordSuccess('TTS面板', '找到 .tts-panel 元素');
        } else {
            suite.recordWarning('TTS面板', '未找到 .tts-panel 元素');
        }

        // 5. 截图
        await screenshot(suite.page, `${name.replace(/\s+/g, '-')}`);

    } catch (error) {
        suite.recordFailure('页面测试', error.message);
    } finally {
        await suite.cleanup();
    }
}

// ========================================
// TTS 功能测试
// ========================================

async function testTTSFeatures(suite, url, name) {
    await suite.setup();

    try {
        log(`\n  测试 TTS 功能: ${name}`, 'info');

        await suite.page.goto(`${CONFIG.BASE_URL}${url}`, {
            waitUntil: 'networkidle2'
        });

        // 等待语音加载
        await suite.page.waitForTimeout(2000);

        // 1. 检查语音API支持
        const speechSynthesisSupported = await suite.page.evaluate(() => {
            return 'speechSynthesis' in window;
        });

        if (speechSynthesisSupported) {
            suite.recordSuccess('API支持', 'speechSynthesis 可用');
        } else {
            suite.recordFailure('API支持', 'speechSynthesis 不可用');
        }

        // 2. 检查语音列表
        const voiceCount = await suite.page.evaluate(() => {
            const voices = window.speechSynthesis.getVoices();
            return voices.filter(v => v.lang.startsWith('en')).length;
        });

        if (voiceCount > 0) {
            suite.recordSuccess('语音列表', `找到 ${voiceCount} 个英文语音`);
        } else {
            suite.recordFailure('语音列表', '未找到英文语音');
        }

        // 3. 检查播放按钮
        const playBtn = await suite.page.$('#playBtn');
        if (playBtn) {
            suite.recordSuccess('播放按钮', '找到 #playBtn 元素');
        } else {
            suite.recordFailure('播放按钮', '未找到 #playBtn 元素');
        }

        // 4. 检查可朗读段落
        const paragraphCount = await suite.page.evaluate(() => {
            const paragraphs = document.querySelectorAll('.readable-paragraph');
            return paragraphs.length;
        });

        if (paragraphCount > 0) {
            suite.recordSuccess('可朗读段落', `找到 ${paragraphCount} 个可朗读段落`);
        } else {
            suite.recordWarning('可朗读段落', '未找到可朗读段落');
        }

        await screenshot(suite.page, `${name.replace(/\s+/g, '-')}-tts`);

    } catch (error) {
        suite.recordFailure('TTS测试', error.message);
    } finally {
        await suite.cleanup();
    }
}

// ========================================
// 用户体验测试
// ========================================

async function testUserExperience(suite, url, name) {
    await suite.setup();

    try {
        log(`\n  测试用户体验: ${name}`, 'info');

        await suite.page.goto(`${CONFIG.BASE_URL}${url}`, {
            waitUntil: 'networkidle2'
        });

        await suite.page.waitForTimeout(1000);

        // 1. 测试页面响应性
        const isResponsive = await suite.page.evaluate(() => {
            const container = document.querySelector('.container');
            if (!container) return false;
            const width = container.offsetWidth;
            return width > 0 && width <= window.innerWidth;
        });

        if (isResponsive) {
            suite.recordSuccess('响应式布局', '页面布局正常');
        } else {
            suite.recordFailure('响应式布局', '页面布局异常');
        }

        // 2. 测试可访问性
        const hasAccessibility = await suite.page.evaluate(() => {
            // 检查是否有适当的语义化标签
            const hasHeadings = document.querySelectorAll('h1, h2, h3').length > 0;
            const hasAltText = Array.from(document.querySelectorAll('img'))
                .filter(img => img.alt && img.alt.length > 0).length;
            return hasHeadings && hasAltText;
        });

        if (hasAccessibility) {
            suite.recordSuccess('可访问性', '页面有良好的可访问性');
        } else {
            suite.recordWarning('可访问性', '可访问性需要改进');
        }

        // 3. 测试页面性能
        const metrics = await suite.page.metrics();
        if (metrics.LayoutDuration < 100) {
            suite.recordSuccess('页面性能', `布局时间: ${metrics.LayoutDuration.toFixed(2)}ms`);
        } else {
            suite.recordWarning('页面性能', `布局时间较长: ${metrics.LayoutDuration.toFixed(2)}ms`);
        }

    } catch (error) {
        suite.recordFailure('用户体验测试', error.message);
    } finally {
        await suite.cleanup();
    }
}

// ========================================
// 主测试流程
// ========================================

async function runAllTests() {
    log('🚀 开始 E2E 自动化测试...\n', 'test');

    ensureDir(CONFIG.SCREENSHOT_DIR);
    ensureDir(CONFIG.REPORT_DIR);

    const browser = await puppeteer.launch({
        headless: CONFIG.HEADLESS,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        // 测试所有页面
        for (const page of TEST_PAGES) {
            log(`\n${'='.repeat(60)}`, 'info');
            log(`测试页面: ${page.name}`, 'test');

            // 1. 基础测试
            const basicSuite = new TestSuite(`${page.name} - 基础`, browser);
            await testPageBasic(basicSuite, page.url, page.name);
            testResults.suites.push(basicSuite.getResults());

            // 2. TTS功能测试
            const ttsSuite = new TestSuite(`${page.name} - TTS`, browser);
            await testTTSFeatures(ttsSuite, page.url, page.name);
            testResults.suites.push(ttsSuite.getResults());

            // 3. 用户体验测试
            const uxSuite = new TestSuite(`${page.name} - 体验`, browser);
            await testUserExperience(uxSuite, page.url, page.name);
            testResults.suites.push(uxSuite.getResults());
        }

        // 计算汇总
        testResults.suites.forEach(suite => {
            testResults.summary.total += suite.total;
            testResults.summary.passed += suite.passed.length;
            testResults.summary.failed += suite.failed.length;
        });

        testResults.endTime = new Date();
        testResults.duration = (testResults.endTime - testResults.startTime) / 1000;

    } finally {
        await browser.close();
    }
}

// ========================================
// 生成测试报告
// ========================================

function generateReport() {
    log('\n' + '='.repeat(60), 'test');
    log('📊 测试报告', 'test');
    log('='.repeat(60) + '\n', 'info');

    // 汇总统计
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│                     测试汇总                          │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log(`│  总计: ${testResults.summary.total.toString().padStart(4)} │ 通过: ${testResults.summary.passed.toString().padStart(4)} │ 失败: ${testResults.summary.failed.toString().padStart(4)} │`);
    console.log('└─────────────────────────────────────────────────────┘');

    // 详细结果
    console.log('\n详细结果:\n');
    testResults.suites.forEach(suite => {
        console.log(`\n${suite.name}:`);
        console.log(`  总计: ${suite.total}`);
        suite.passed.forEach(t => console.log(`    ✅ ${t.name}: ${t.message}`));
        suite.failed.forEach(t => console.log(`    ❌ ${t.name}: ${t.message}`));
        suite.warnings.forEach(t => console.log(`    ⚠️  ${t.name}: ${t.message}`));
    });

    // 保存JSON报告
    const reportPath = path.join(CONFIG.REPORT_DIR, `e2e-report-${Date.now()}.json`);
    ensureDir(CONFIG.REPORT_DIR);
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
    log(`\n📄 报告已保存: ${reportPath}`, 'info');
}

// ========================================
// 入口
// ========================================

(async () => {
    try {
        await runAllTests();
        generateReport();

        // 返回退出码
        const exitCode = testResults.summary.failed > 0 ? 1 : 0;
        process.exit(exitCode);

    } catch (error) {
        log(`\n❌ 测试运行失败: ${error.message}`, 'error');
        console.error(error);
        process.exit(1);
    }
})();

module.exports = { runAllTests, TestSuite };
