/**
 * ========================================
 * TTS 自动诊断工具
 * ========================================
 * 使用方法：在浏览器控制台粘贴此代码并运行
 *
 * 此脚本会自动检查所有可能导致TTS失败的因素，
 * 并生成详细的诊断报告。
 */

(function autoDiagnose() {
    console.log('🔍 开始自动诊断 TTS 系统...\n');

    const results = {
        pass: [],
        fail: [],
        warn: []
    };

    // 1. 检查 Web Speech API 支持
    console.log('📌 检查1: Web Speech API 支持');
    if ('speechSynthesis' in window) {
        console.log('   ✅ speechSynthesis API 可用');
        results.pass.push('Web Speech API 支持');
    } else {
        console.error('   ❌ speechSynthesis API 不可用');
        results.fail.push('Web Speech API 不支持');
    }

    // 2. 检查语音加载
    console.log('\n📌 检查2: 语音加载状态');
    const allVoices = window.speechSynthesis.getVoices();
    console.log(`   - 总语音数: ${allVoices.length}`);
    const englishVoices = allVoices.filter(v => v.lang.startsWith('en'));
    console.log(`   - 英文语音数: ${englishVoices.length}`);

    if (allVoices.length === 0) {
        console.warn('   ⚠️ 语音未加载，请刷新页面或等待');
        results.warn.push('语音未加载');
    } else if (englishVoices.length === 0) {
        console.warn('   ⚠️ 没有英文语音');
        results.warn.push('无英文语音');
    } else {
        console.log('   ✅ 语音已加载');
        results.pass.push('语音加载正常');
    }

    // 3. 检查全局变量
    console.log('\n📌 检查3: 全局变量状态');
    const globalVars = [
        'window.synthesis',
        'window.voices',
        'window.enhancedVoices',
        'window.isPlaying',
        'window.isPaused',
        'window.paragraphs',
        'window.utterance'
    ];

    globalVars.forEach(varName => {
        const parts = varName.split('.');
        let value = window;
        let exists = true;

        for (const part of parts) {
            if (value && part in value) {
                value = value[part];
            } else {
                exists = false;
                break;
            }
        }

        if (exists) {
            if (Array.isArray(value)) {
                console.log(`   ✅ ${varName}: 数组(${value.length}项)`);
            } else if (value === null) {
                console.log(`   ⚠️ ${varName}: null`);
                results.warn.push(`${varName} 是 null`);
            } else if (value === undefined) {
                console.log(`   ❌ ${varName}: undefined`);
                results.fail.push(`${varName} 未定义`);
            } else {
                console.log(`   ✅ ${varName}: ${typeof value} = ${value}`);
            }
        } else {
            console.log(`   ❌ ${varName}: 不存在`);
            results.fail.push(`${varName} 不存在`);
        }
    });

    // 4. 检查 enhancedVoices 内容
    console.log('\n📌 检查4: enhancedVoices 详细信息');
    if (window.enhancedVoices && window.enhancedVoices.length > 0) {
        console.log(`   ✅ enhancedVoices 有 ${window.enhancedVoices.length} 个语音`);
        console.log('   前3个语音:');
        window.enhancedVoices.slice(0, 3).forEach((voice, i) => {
            const hasVoiceObj = voice.voice !== undefined;
            console.log(`     ${i + 1}. ${voice.name} (${voice.lang}) - voice对象: ${hasVoiceObj ? '✅' : '❌'}`);
            if (!hasVoiceObj) {
                results.fail.push(`enhancedVoices[${i}].voice 不存在`);
            }
        });
        results.pass.push('enhancedVoices 结构正常');
    } else {
        console.error('   ❌ enhancedVoices 为空或不存在');
        results.fail.push('enhancedVoices 未正确初始化');
    }

    // 5. 检查段落
    console.log('\n📌 检查5: 可朗读段落');
    if (window.paragraphs && window.paragraphs.length > 0) {
        console.log(`   ✅ 找到 ${window.paragraphs.length} 个段落`);
        console.log(`   第一个段落预览: "${window.paragraphs[0].textContent.substring(0, 50)}..."`);
        results.pass.push('段落加载正常');
    } else {
        console.error('   ❌ 没有找到可朗读段落');
        results.fail.push('段落未加载');
    }

    // 6. 检查 DOM 元素
    console.log('\n📌 检查6: DOM 元素');
    const elements = {
        'playBtn': '播放按钮',
        'voiceSelect': '语音选择器',
        'rateSlider': '语速滑块',
        'ttsStatus': 'TTS状态'
    };

    for (const [id, name] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            console.log(`   ✅ ${name} (#${id}) 存在`);
        } else {
            console.error(`   ❌ ${name} (#${id}) 不存在`);
            results.fail.push(`缺少 ${name} 元素`);
        }
    }

    // 7. 尝试简单的TTS测试
    console.log('\n📌 检查7: 基础 TTS 测试');
    try {
        const testUtterance = new SpeechSynthesisUtterance('Test');
        testUtterance.onstart = () => {
            console.log('   ✅ 测试语音开始播放（如果有声音说明TTS正常）');
            results.pass.push('基础TTS测试通过');
        };
        testUtterance.onerror = (e) => {
            console.error(`   ❌ 测试语音错误: ${e.error}`);
            results.fail.push(`TTS测试失败: ${e.error}`);
        };
        testUtterance.onend = () => {
            console.log('   ✅ 测试语音播放完成');
        };
        window.speechSynthesis.speak(testUtterance);
        console.log('   - 测试语音已触发，请检查是否有声音...');
    } catch (error) {
        console.error(`   ❌ 创建测试语音失败: ${error.message}`);
        results.fail.push('无法创建测试语音');
    }

    // 8. 生成诊断报告
    console.log('\n' + '='.repeat(60));
    console.log('📊 诊断报告摘要');
    console.log('='.repeat(60));

    console.log(`\n✅ 通过 (${results.pass.length}):`);
    results.pass.forEach(item => console.log(`   - ${item}`));

    if (results.warn.length > 0) {
        console.log(`\n⚠️ 警告 (${results.warn.length}):`);
        results.warn.forEach(item => console.log(`   - ${item}`));
    }

    if (results.fail.length > 0) {
        console.log(`\n❌ 失败 (${results.fail.length}):`);
        results.fail.forEach(item => console.log(`   - ${item}`));
    }

    console.log('\n' + '='.repeat(60));

    // 9. 给出建议
    if (results.fail.length === 0) {
        console.log('\n🎉 诊断结果：所有检查都通过了！');
        console.log('\n💡 建议：');
        console.log('1. 如果还是无法播放，请检查浏览器音频权限');
        console.log('2. 确认系统音量已开启');
        console.log('3. 尝试刷新页面后重试');
    } else {
        console.log('\n🔧 诊断结果：发现问题！');
        console.log('\n💡 建议：');
        console.log('1. 将上述诊断报告发送给开发者');
        console.log('2. 特别是"失败"部分的内容');
        console.log('3. 如果可以，也请提供截图');
    }

    // 10. 生成可复制的报告
    const report = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        results: results,
        systemInfo: {
            synthesis: 'speechSynthesis' in window,
            voicesCount: allVoices.length,
            englishVoicesCount: englishVoices.length,
            paragraphsCount: window.paragraphs ? window.paragraphs.length : 0,
            enhancedVoicesCount: window.enhancedVoices ? window.enhancedVoices.length : 0
        }
    };

    console.log('\n📋 完整诊断报告（JSON格式，可复制）:');
    console.log(JSON.stringify(report, null, 2));

    return report;
})();
