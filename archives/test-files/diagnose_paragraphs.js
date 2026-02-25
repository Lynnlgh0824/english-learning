const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:8000/records/2026-02-06-month-alone-chiang-mai.html';

console.log('🔍 段落初始化诊断\n');

async function diagnose() {
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

        console.log('\n第2步: 检查 DOM 状态');
        const domCheck = await page.evaluate(() => {
            // 检查各种选择器
            const selectors = {
                wordCardP: document.querySelectorAll('.word-card p').length,
                wordCardBlockquote: document.querySelectorAll('.word-card blockquote').length,
                sectionP: document.querySelectorAll('.section p').length,
                sectionBlockquote: document.querySelectorAll('.section blockquote').length,
                expressionCardP: document.querySelectorAll('.expression-card p').length,
                expressionCardBlockquote: document.querySelectorAll('.expression-card blockquote').length,
                patternCardP: document.querySelectorAll('.pattern-card p').length,
                patternCardBlockquote: document.querySelectorAll('.pattern-card blockquote').length,
            };

            // 组合选择器
            const combined = document.querySelectorAll('.word-card p, .word-card blockquote, .section p, .section blockquote, .expression-card p, .expression-card blockquote, .pattern-card p, .pattern-card blockquote').length;

            // 检查 window 对象
            const windowState = {
                paragraphsLength: window.paragraphs ? window.paragraphs.length : 'undefined',
                paragraphsElementsLength: window.paragraphsElements ? window.paragraphsElements.length : 'undefined',
                readyState: document.readyState,
                domContentLoaded: window.performance ? window.performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd : 'N/A'
            };

            // 检查主要内容区域
            const mainContent = document.querySelectorAll('main p, main blockquote, article p, article blockquote').length;

            // 检查所有 p 标签
            const allP = document.querySelectorAll('p').length;

            return { selectors, combined, windowState, mainContent, allP };
        });

        console.log('\n选择器结果:');
        console.log(`  .word-card p: ${domCheck.selectors.wordCardP}`);
        console.log(`  .word-card blockquote: ${domCheck.selectors.wordCardBlockquote}`);
        console.log(`  .section p: ${domCheck.selectors.sectionP}`);
        console.log(`  .section blockquote: ${domCheck.selectors.sectionBlockquote}`);
        console.log(`  .expression-card p: ${domCheck.selectors.expressionCardP}`);
        console.log(`  .expression-card blockquote: ${domCheck.selectors.expressionCardBlockquote}`);
        console.log(`  .pattern-card p: ${domCheck.selectors.patternCardP}`);
        console.log(`  .pattern-card blockquote: ${domCheck.selectors.patternCardBlockquote}`);

        console.log(`\n组合选择器: ${domCheck.combined}`);

        console.log(`\n其他检查:`);
        console.log(`  main p/blockquote: ${domCheck.mainContent}`);
        console.log(`  所有 p 标签: ${domCheck.allP}`);

        console.log(`\nWindow 对象:`);
        console.log(`  paragraphs.length: ${domCheck.windowState.paragraphsLength}`);
        console.log(`  paragraphsElements.length: ${domCheck.windowState.paragraphsElementsLength}`);
        console.log(`  readyState: ${domCheck.windowState.readyState}`);
        console.log(`  domContentLoaded: ${domCheck.windowState.domContentLoaded}ms`);

        if (domCheck.windowState.paragraphsLength === 0) {
            console.log('\n❌ 问题确认：window.paragraphs.length 为 0！');
        }

        if (domCheck.combined === 0) {
            console.log('\n⚠️ 组合选择器找到 0 个元素，页面结构可能不同');
        }

        // 尝试找到实际的内容区域
        console.log('\n第3步: 查找实际内容区域');
        const contentSearch = await page.evaluate(() => {
            // 查找可能包含内容的容器
            const containers = [];
            const allDivs = document.querySelectorAll('div[class]');

            for (const div of allDivs) {
                const pCount = div.querySelectorAll('p').length;
                if (pCount > 5) {  // 如果包含超过5个段落
                    containers.push({
                        className: div.className,
                        pCount: pCount
                    });
                }
            }

            // 检查是否有 main, article, content 等区域
            const mainAreas = {
                main: document.querySelector('main'),
                article: document.querySelector('article'),
                content: document.querySelector('[class*="content"]'),
                container: document.querySelector('[class*="container"]')
            };

            return { containers, mainAreas };
        });

        console.log('\n找到的内容容器:');
        if (contentSearch.containers.length > 0) {
            contentSearch.containers.forEach(c => {
                console.log(`  .${c.className}: ${c.pCount} 个段落`);
            });
        } else {
            console.log('  未找到包含大量段落的容器');
        }

        console.log('\n主要区域:');
        console.log(`  main: ${contentSearch.mainAreas.main ? '✅' : '❌'}`);
        console.log(`  article: ${contentSearch.mainAreas.article ? '✅' : '❌'}`);
        console.log(`  content: ${contentSearch.mainAreas.content ? '✅' : '❌'}`);
        console.log(`  container: ${contentSearch.mainAreas.container ? '✅' : '❌'}`);

        // 手动触发初始化测试
        console.log('\n第4步: 手动测试段落选择');
        const manualTest = await page.evaluate(() => {
            // 尝试不同的选择器
            const tests = {
                allP: document.querySelectorAll('p').length,
                mainP: document.querySelectorAll('main p').length,
                articleP: document.querySelectorAll('article p').length,
            };

            // 手动执行初始化
            window.testParagraphs = document.querySelectorAll('.word-card p, .word-card blockquote, .section p, .section blockquote, .expression-card p, .expression-card blockquote, .pattern-card p, .pattern-card blockquote');

            return {
                tests,
                testParagraphsLength: window.testParagraphs.length
            };
        });

        console.log('\n手动测试结果:');
        console.log(`  所有 p: ${manualTest.tests.allP}`);
        console.log(`  main p: ${manualTest.tests.mainP}`);
        console.log(`  article p: ${manualTest.tests.articleP}`);
        console.log(`  testParagraphs.length: ${manualTest.testParagraphsLength}`);

        console.log('\n保持浏览器打开30秒供您调试...');
        await new Promise(resolve => setTimeout(resolve, 30000));

    } catch (error) {
        console.error('错误:', error);
    } finally {
        await browser.close();
    }
}

diagnose()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('失败:', error);
        process.exit(1);
    });
