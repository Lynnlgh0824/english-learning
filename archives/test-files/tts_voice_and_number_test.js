const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:8000/records/2026-02-06-coming-home.html';

console.log('🎙️ 语音下拉框和数字朗读测试\n');

async function testVoiceAndNumbers() {
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
        console.log('第1步: 加载页面并等待语音初始化');
        await page.goto(TEST_URL, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(resolve => setTimeout(resolve, 8000));

        // 检查语音下拉框选项
        console.log('\n第2步: 检查语音下拉框选项');
        console.log('=' .repeat(60));

        const voiceOptions = await page.evaluate(() => {
            const select = document.getElementById('voiceSelect');
            if (!select) return { error: '语音下拉框不存在' };

            const options = Array.from(select.options).map(opt => ({
                value: opt.value,
                text: opt.text,
                selected: opt.selected
            }));

            const groups = Array.from(select.querySelectorAll('optgroup')).map(group => ({
                label: group.label,
                optionCount: group.querySelectorAll('option').length
            }));

            return {
                totalOptions: options.length,
                firstOptions: options.slice(0, 5),
                groups: groups,
                selectedOption: options.find(opt => opt.selected)
            };
        });

        if (voiceOptions.error) {
            console.log(`❌ ${voiceOptions.error}`);
        } else {
            console.log(`✅ 语音下拉框正常`);
            console.log(`总选项数: ${voiceOptions.totalOptions}`);
            console.log(`\n分组信息:`);
            voiceOptions.groups.forEach(group => {
                console.log(`  - ${group.label}: ${group.optionCount} 个选项`);
            });

            console.log(`\n前5个选项:`);
            voiceOptions.firstOptions.forEach((opt, i) => {
                const selected = opt.selected ? ' [已选]' : '';
                console.log(`  ${i + 1}. "${opt.text}"${selected}`);
            });

            console.log(`\n当前选中:`);
            if (voiceOptions.selectedOption) {
                console.log(`  "${voiceOptions.selectedOption.text}"`);
            } else {
                console.log(`  无`);
            }
        }

        // 检查是否还有 "undefined" 显示
        console.log('\n第3步: 检查是否有 undefined 显示');
        console.log('=' .repeat(60));

        const hasUndefined = await page.evaluate(() => {
            const select = document.getElementById('voiceSelect');
            const options = Array.from(select.options);
            const undefinedOptions = options.filter(opt =>
                opt.text.includes('undefined') || opt.text.includes('Unknown')
            );
            return {
                hasUndefined: undefinedOptions.length > 0,
                undefinedCount: undefinedOptions.length,
                undefinedOptions: undefinedOptions.map(opt => opt.text)
            };
        });

        if (hasUndefined.hasUndefined) {
            console.log(`❌ 发现 ${hasUndefined.undefinedCount} 个包含 undefined/Unknown 的选项:`);
            hasUndefined.undefinedOptions.forEach(opt => {
                console.log(`  - ${opt}`);
            });
        } else {
            console.log(`✅ 没有发现 undefined 或 Unknown 显示`);
        }

        // 测试数字朗读
        console.log('\n第4步: 测试数字朗读功能');
        console.log('=' .repeat(60));
        console.log('准备播放包含中文数字(一二三)和阿拉伯数字(123)的段落...');

        // 查找包含数字的段落
        const numberParagraphs = await page.evaluate(() => {
            const allParagraphs = Array.from(paragraphs);
            const results = [];

            for (let i = 0; i < Math.min(20, allParagraphs.length); i++) {
                const p = allParagraphs[i];
                const text = p.textContent || p.innerText || '';
                // 查找包含中文数字或阿拉伯数字的段落
                if (text.match(/[\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341]/) || text.match(/\d+/)) {
                    results.push({
                        index: i,
                        text: text.substring(0, 100)
                    });
                    if (results.length >= 5) break;
                }
            }

            return results;
        });

        if (numberParagraphs.length > 0) {
            console.log(`找到 ${numberParagraphs.length} 个包含数字的段落:`);
            numberParagraphs.forEach(p => {
                console.log(`  [段落 ${p.index + 1}] ${p.text}...`);
            });

            // 播放第一个包含数字的段落
            const targetIndex = numberParagraphs[0].index;
            console.log(`\n播放段落 ${targetIndex + 1}...`);
            await page.evaluate((index) => {
                window.currentParagraphIndex = index;
                startSpeech();
            }, targetIndex);

            console.log('请聆听:');
            console.log('  - 中文数字(一二三)应该读中文');
            console.log('  - 阿拉伯数字(123)应该读英文\n');

            await new Promise(resolve => setTimeout(resolve, 8000));
        } else {
            console.log('⚠️ 未找到包含数字的段落');
        }

        console.log('\n第5步: 保持浏览器打开15秒供您手动测试');
        console.log('=' .repeat(60));
        console.log('建议手动测试:');
        console.log('  1. 检查语音下拉框是否正确显示语音名称');
        console.log('  2. 切换不同的语音');
        console.log('  3. 播放包含中文数字和阿拉伯数字的段落');
        console.log('  4. 验证中文数字读中文,阿拉伯数字读英文\n');

        await new Promise(resolve => setTimeout(resolve, 15000));

    } catch (error) {
        console.error('错误:', error);
    } finally {
        await browser.close();
        console.log('\n浏览器已关闭');
    }
}

testVoiceAndNumbers()
    .then(() => {
        console.log('\n✅ 测试完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
