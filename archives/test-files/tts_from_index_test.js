const puppeteer = require('puppeteer');

const INDEX_URL = 'http://localhost:8000/index.html';

console.log('🎙️ 从首页进入详情页的播放测试\n');

async function testFromIndex() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('朗读') || text.includes('模式') || text.includes('错误') || text.includes('警告')) {
            console.log(`  📌 ${text}`);
        }
    });

    page.on('pageerror', error => {
        if (!error.message.includes('canceled')) {
            console.log(`  🔴 ${error.message}`);
        }
    });

    try {
        console.log('第1步: 打开首页');
        console.log('='.repeat(60));
        await page.goto(INDEX_URL, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 检查首页是否加载成功
        const indexCheck = await page.evaluate(() => {
            const recordsContainer = document.getElementById('recordsContainer');
            const dateGroups = document.querySelectorAll('.record-list-item');
            return {
                hasRecords: dateGroups.length > 0,
                recordCount: dateGroups.length,
                firstRecord: dateGroups.length > 0 ? {
                    title: dateGroups[0].querySelector('.record-list-title')?.textContent,
                    file: dateGroups[0].onclick?.toString()?.match(/'([^']+)'/)?.[1]
                } : null
            };
        });

        console.log(`首页加载: ${indexCheck.hasRecords ? '✅ 成功' : '❌ 失败'}`);
        console.log(`记录数量: ${indexCheck.recordCount}`);

        if (!indexCheck.hasRecords || !indexCheck.firstRecord) {
            console.log('❌ 没有找到学习记录，无法测试');
            await browser.close();
            return;
        }

        console.log(`第一条记录: ${indexCheck.firstRecord.title}`);
        console.log(`文件名: ${indexCheck.firstRecord.file}`);

        // 第2步: 点击第一条记录
        console.log('\n第2步: 点击进入详情页');
        console.log('='.repeat(60));

        const firstRecord = indexCheck.firstRecord;

        // 直接跳转到详情页
        const detailUrl = `http://localhost:8000/records/${firstRecord.file}`;
        console.log(`跳转到: ${detailUrl}`);

        await page.goto(detailUrl, { waitUntil: 'networkidle2', timeout: 15000 });

        console.log('✅ 已跳转到详情页');

        // 等待页面加载和语音初始化
        console.log('\n第3步: 等待页面和语音初始化');
        console.log('='.repeat(60));
        await new Promise(resolve => setTimeout(resolve, 8000));

        // 检查详情页状态
        const detailCheck = await page.evaluate(() => {
            const playBtn = document.getElementById('playBtn');
            const status = document.getElementById('ttsStatus');
            const speaking = document.querySelector('.speaking');

            return {
                hasPlayButton: !!playBtn,
                buttonText: playBtn ? document.getElementById('playText').textContent : null,
                statusText: status ? status.textContent : null,
                speakingExists: !!speaking,
                paragraphsLength: window.paragraphs ? window.paragraphs.length : 0,
                isPlaying: window.isPlaying,
                currentMode: window.currentMode,
                currentParagraphIndex: window.currentParagraphIndex,
                voicesCount: window.voices ? window.voices.length : 0
            };
        });

        console.log(`播放按钮: ${detailCheck.hasPlayButton ? '✅ 存在' : '❌ 不存在'}`);
        console.log(`按钮文本: ${detailCheck.buttonText}`);
        console.log(`状态文本: ${detailCheck.statusText}`);
        console.log(`段落数量: ${detailCheck.paragraphsLength}`);
        console.log(`语音数量: ${detailCheck.voicesCount}`);
        console.log(`isPlaying: ${detailCheck.isPlaying}`);
        console.log(`currentMode: ${detailCheck.currentMode}`);
        console.log(`currentParagraphIndex: ${detailCheck.currentParagraphIndex}`);

        // 检查是否有问题
        const issues = [];
        if (!detailCheck.hasPlayButton) {
            issues.push('❌ 播放按钮不存在');
        }
        if (detailCheck.paragraphsLength === 0) {
            issues.push('❌ 段落未初始化');
        }
        if (detailCheck.voicesCount === 0) {
            issues.push('❌ 语音未加载');
        }
        if (detailCheck.currentMode === undefined || detailCheck.currentMode === null) {
            issues.push('❌ currentMode 未初始化');
        }
        if (detailCheck.currentParagraphIndex === undefined || detailCheck.currentParagraphIndex === null) {
            issues.push('❌ currentParagraphIndex 未初始化');
        }

        if (issues.length > 0) {
            console.log('\n发现问题:');
            issues.forEach(issue => console.log(issue));
        } else {
            console.log('\n✅ 所有检查通过！');
        }

        // 第4步: 测试播放功能
        console.log('\n第4步: 测试播放功能');
        console.log('='.repeat(60));

        await page.click('#playBtn');
        console.log('✅ 已点击播放按钮');

        await new Promise(resolve => setTimeout(resolve, 3000));

        const playStatus = await page.evaluate(() => {
            return {
                buttonText: document.getElementById('playText').textContent,
                buttonIcon: document.getElementById('playIcon').textContent,
                statusText: document.getElementById('ttsStatus').textContent,
                isPlaying: window.isPlaying,
                isPaused: window.isPaused,
                currentParagraphIndex: window.currentParagraphIndex,
                speakingExists: !!document.querySelector('.speaking')
            };
        });

        console.log(`按钮: ${playStatus.buttonIcon} ${playStatus.buttonText}`);
        console.log(`状态: ${playStatus.statusText}`);
        console.log(`isPlaying: ${playStatus.isPlaying}`);
        console.log(`isPaused: ${playStatus.isPaused}`);
        console.log(`当前段落: ${playStatus.currentParagraphIndex + 1}`);
        console.log(`高亮元素: ${playStatus.speakingExists ? '✅ 存在' : '❌ 不存在'}`);

        if (!playStatus.isPlaying && playStatus.statusText.includes('朗读')) {
            console.log('\n⚠️ 警告: 状态显示正在朗读，但 isPlaying 为 false');
        }

        // 第5步: 测试暂停/继续
        console.log('\n第5步: 测试暂停/继续');
        console.log('='.repeat(60));

        await new Promise(resolve => setTimeout(resolve, 3000));

        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pauseStatus = await page.evaluate(() => {
            return {
                buttonText: document.getElementById('playText').textContent,
                isPlaying: window.isPlaying,
                isPaused: window.isPaused
            };
        });

        console.log(`暂停后按钮: ${pauseStatus.buttonText}`);
        console.log(`isPlaying: ${pauseStatus.isPlaying}`);
        console.log(`isPaused: ${pauseStatus.isPaused}`);

        // 再次点击继续
        await page.click('#playBtn');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const resumeStatus = await page.evaluate(() => {
            return {
                buttonText: document.getElementById('playText').textContent,
                statusText: document.getElementById('ttsStatus').textContent,
                isPlaying: window.isPlaying,
                isPaused: window.isPaused
            };
        });

        console.log(`继续后按钮: ${resumeStatus.buttonText}`);
        console.log(`状态: ${resumeStatus.statusText}`);
        console.log(`isPlaying: ${resumeStatus.isPlaying}`);
        console.log(`isPaused: ${resumeStatus.isPaused}`);

        console.log('\n第6步: 保持浏览器打开10秒供您查看');
        console.log('='.repeat(60));
        await new Promise(resolve => setTimeout(resolve, 10000));

    } catch (error) {
        console.error('\n❌ 测试出错:', error.message);
        console.error(error.stack);
    } finally {
        await browser.close();
        console.log('\n浏览器已关闭');
    }
}

testFromIndex()
    .then(() => {
        console.log('\n✅ 测试完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 测试失败:', error);
        process.exit(1);
    });
