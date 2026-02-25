const puppeteer = require('puppeteer');

async function test() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    
    await page.goto('http://localhost:8000/records/2026-02-06-coming-home.html');
    await new Promise(r => setTimeout(r, 8000));
    
    await page.click('#playBtn');
    await new Promise(r => setTimeout(r, 5000));
    
    const status = await page.evaluate(() => ({
        isPlaying: window.isPlaying,
        currentParagraphIndex: window.currentParagraphIndex,
        buttonText: document.getElementById('playText').textContent
    }));
    
    console.log('✅ 状态:', status);
    
    await new Promise(r => setTimeout(r, 10000));
    await browser.close();
}

test();
