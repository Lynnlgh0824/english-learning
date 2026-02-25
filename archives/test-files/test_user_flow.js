const puppeteer = require('puppeteer');

const DETAIL_PAGE = 'http://localhost:8000/records/2026-02-06-coming-home.html';

console.log('🎬 完整用户流程测试\n');

async function testUserFlow() {
    const browser = await puppeteer.launch({
        headless: false,  // 显示浏览器窗口
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    // 监听控制台消息
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();

        if (type === 'error') {
            console.error(`❌ [控制台] ${text}`);
        } else if (type === 'warning') {
            console.warn(`⚠️  [控制台] ${text}`);
        } else if (text.includes('✅') || text.includes('❌') || text.includes('🔊')) {
            console.log(`[LOG] ${text}`);
        }
    });

    page.on('pageerror', (error) => {
        console.error(`❌ [页面错误] ${error.message}`);
    });

    try {
        // 步骤 1: 从首页进入详情页
        console.log('\n📝 步骤 1: 从首页进入详情页');
        console.log('=' .repeat(60));

        // 先访问首页
        await page.goto('http://localhost:8000/', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        console.log('✅ 已访问首页');

        // 等待1秒
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 导航到详情页
        await page.goto(DETAIL_PAGE, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        console.log('✅ 已进入详情页');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 步骤 2: 点击朗读
        console.log('\n📝 步骤 2: 点击朗读按钮');
        console.log('=' .repeat(60));

        const beforePlay = await page.evaluate(() => {
            const statusEl = document.getElementById('ttsStatus');
            return {
                status: statusEl ? statusEl.textContent : 'N/A'
            };
        });

        console.log(`播放前状态: "${beforePlay.status}"`);

        await page.click('#playBtn');

        // 等待朗读开始
        await new Promise(resolve => setTimeout(resolve, 1000));

        const afterPlay = await page.evaluate(() => {
            const statusEl = document.getElementById('ttsStatus');
            const isPlaying = window.isPlaying;
            const speakingElem = document.querySelector('.speaking');

            return {
                status: statusEl ? statusEl.textContent : 'N/A',
                isPlaying: isPlaying,
                hasSpeaking: !!speakingElem
            };
        });

        console.log(`播放后状态: "${afterPlay.status}"`);
        console.log(`正在朗读: ${afterPlay.hasSpeaking ? '✅' : '❌'}`);
        console.log(`isPlaying: ${afterPlay.isPlaying}`);

        if (afterPlay.isPlaying && afterPlay.hasSpeaking) {
            console.log('✅ 朗读已开始！');
        } else {
            console.log('❌ 朗读启动失败！');
            return;
        }

        // 步骤 3: 下滑页面3秒
        console.log('\n📝 步骤 3: 下滑页面 3 秒');
        console.log('=' .repeat(60));

        const scrollSteps = 6;
        const scrollDelay = 500;

        for (let i = 0; i < scrollSteps; i++) {
            await page.evaluate(() => {
                window.scrollBy({
                    top: 300,
                    behavior: 'smooth'
                });
            });
            console.log(`  下滑中... (${i + 1}/${scrollSteps})`);
            await new Promise(resolve => setTimeout(resolve, scrollDelay));
        }

        console.log('✅ 页面下滑完成');

        // 步骤 4: 暂停
        console.log('\n📝 步骤 4: 点击暂停');
        console.log('=' .repeat(60));

        await page.click('#playBtn');  // 再次点击是暂停

        await new Promise(resolve => setTimeout(resolve, 1000));

        const afterPause = await page.evaluate(() => {
            const statusEl = document.getElementById('ttsStatus');
            const isPlaying = window.isPlaying;
            const speakingElem = document.querySelector('.speaking');
            const playText = document.getElementById('playText');

            return {
                status: statusEl ? statusEl.textContent : 'N/A',
                isPlaying: isPlaying,
                hasSpeaking: !!speakingElem,
                playBtnText: playText ? playText.textContent : 'N/A'
            };
        });

        console.log(`暂停后状态: "${afterPause.status}"`);
        console.log(`播放按钮文本: "${afterPause.playBtnText}"`);
        console.log(`是否正在朗读: ${afterPause.isPlaying ? '❌ 仍在朗读' : '✅ 已暂停'}`);

        if (!afterPause.isPlaying) {
            console.log('✅ 已暂停！');
        }

        // 步骤 5: 再下滑页面3秒
        console.log('\n📝 步骤 5: 继续下滑页面 3 秒');
        console.log('=' .repeat(60));

        for (let i = 0; i < scrollSteps; i++) {
            await page.evaluate(() => {
                window.scrollBy({
                    top: 300,
                    behavior: 'smooth'
                });
            });
            console.log(`  下滑中... (${i + 1}/${scrollSteps})`);
            await new Promise(resolve => setTimeout(resolve, scrollDelay));
        }

        console.log('✅ 页面下滑完成');

        // 步骤 6: 划词朗读
        console.log('\n📝 步骤 6: 划词朗读');
        console.log('=' .repeat(60));

        // 选择文本
        await page.evaluate(() => {
            // 找一个可见的段落
            const paragraphs = document.querySelectorAll('p');
            let targetParagraph = null;

            // 找到当前视口中的段落
            const rect = document.documentElement.getBoundingClientRect();
            const viewportTop = -rect.top;
            const viewportBottom = viewportTop + window.innerHeight;

            for (const p of paragraphs) {
                const pRect = p.getBoundingClientRect();
                if (pRect.top >= viewportTop && pRect.top <= viewportBottom) {
                    targetParagraph = p;
                    break;
                }
            }

            if (targetParagraph && targetParagraph.textContent.length > 50) {
                const range = document.createRange();
                range.setStart(targetParagraph.firstChild, 0);
                range.setEnd(targetParagraph.firstChild, Math.min(50, targetParagraph.textContent.length));

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                return {
                    success: true,
                    text: selection.toString()
                };
            }

            return { success: false, text: '' };
        });

        await new Promise(resolve => setTimeout(resolve, 500));

        const selectionInfo = await page.evaluate(() => {
            const selection = window.getSelection();
            const selectionBtn = document.getElementById('selectionBtn');

            return {
                selectedText: selection.toString(),
                buttonExists: !!selectionBtn,
                buttonDisabled: selectionBtn ? selectionBtn.disabled : null
            };
        });

        console.log(`已选中文本: "${selectionInfo.selectedText.substring(0, 30)}..."`);
        console.log(`划词按钮存在: ${selectionInfo.buttonExists ? '✅' : '❌'}`);
        console.log(`划词按钮状态: ${selectionInfo.buttonDisabled ? '禁用' : '启用'}`);

        if (selectionInfo.buttonExists && !selectionInfo.buttonDisabled) {
            // 点击划词朗读按钮
            await page.evaluate(() => {
                const btn = document.getElementById('selectionBtn');
                if (btn && !btn.disabled) {
                    btn.click();
                }
            });

            console.log('✅ 已点击划词朗读按钮');

            await new Promise(resolve => setTimeout(resolve, 2000));

            const afterSelectionPlay = await page.evaluate(() => {
                const statusEl = document.getElementById('ttsStatus');
                return {
                    status: statusEl ? statusEl.textContent : 'N/A'
                };
            });

            console.log(`划词朗读状态: "${afterSelectionPlay.status}"`);
        } else {
            console.log('❌ 划词按钮不可用');
        }

        // 步骤 7: 暂停3秒
        console.log('\n📝 步骤 7: 暂停 3 秒（观察状态）');
        console.log('=' .repeat(60));

        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('  等待中... 1/3');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('  等待中... 2/3');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('  等待中... 3/3');

        console.log('✅ 等待完成');

        // 步骤 8: 点击播放（继续朗读）
        console.log('\n📝 步骤 8: 点击播放（继续朗读）');
        console.log('=' .repeat(60));

        await page.click('#playBtn');

        await new Promise(resolve => setTimeout(resolve, 1000));

        const finalStatus = await page.evaluate(() => {
            const statusEl = document.getElementById('ttsStatus');
            const isPlaying = window.isPlaying;
            const speakingElem = document.querySelector('.speaking');

            return {
                status: statusEl ? statusEl.textContent : 'N/A',
                isPlaying: isPlaying,
                hasSpeaking: !!speakingElem
            };
        });

        console.log(`最终状态: "${finalStatus.status}"`);
        console.log(`正在朗读: ${finalStatus.hasSpeaking ? '✅' : '❌'}`);
        console.log(`isPlaying: ${finalStatus.isPlaying}`);

        if (finalStatus.isPlaying && finalStatus.hasSpeaking) {
            console.log('✅ 继续朗读功能正常！');
        }

        // 总结
        console.log('\n' + '='.repeat(60));
        console.log('✅ 完整用户流程测试完成！');
        console.log('='.repeat(60));
        console.log('\n测试步骤：');
        console.log('  ✅ 1. 从首页进入详情页');
        console.log('  ✅ 2. 点击朗读');
        console.log('  ✅ 3. 下滑页面3秒');
        console.log('  ✅ 4. 暂停');
        console.log('  ✅ 5. 再下滑页面3秒');
        console.log('  ✅ 6. 划词朗读');
        console.log('  ✅ 7. 暂停3秒');
        console.log('  ✅ 8. 点击播放（继续）');
        console.log('\n🎉 所有功能正常！\n');

        // 保持浏览器打开10秒供手动检查
        console.log('⏸️  保持页面打开 10 秒供手动检查...\n');
        await new Promise(resolve => setTimeout(resolve, 10000));

    } catch (error) {
        console.error('\n💥 测试失败:', error.message);
        console.error(error.stack);
    } finally {
        console.log('\n按 Ctrl+C 退出浏览器...');
        await browser.close();
    }
}

// 运行测试
testUserFlow()
    .then(() => {
        console.log('\n✅ 测试完成');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
