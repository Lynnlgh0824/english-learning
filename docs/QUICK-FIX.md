# 🔧 TTS无法播放 - 快速诊断和修复

## 第一步：在浏览器中运行诊断脚本

1. 打开任意一个学习页面（比如 http://localhost:8000/records/2026-02-06-shanghai-starting-over.html）

2. 按F12打开开发者工具，切换到Console标签

3. 复制以下代码并粘贴到控制台，按回车运行：

```javascript
// 快速诊断
console.log('=== TTS快速诊断 ===');
console.log('1. 段落数量:', window.paragraphs ? window.paragraphs.length : 0);
console.log('2. 语音数量:', window.voices ? window.voices.length : 0);
console.log('3. 是否播放中:', window.isPlaying);
console.log('4. 播放按钮:', document.getElementById('playBtn') ? '存在' : '不存在');

// 尝试手动播放
if (window.paragraphs && window.paragraphs.length > 0) {
    console.log('5. 尝试播放第一段...');
    try {
        const text = window.paragraphs[0].textContent || window.paragraphs[0].innerText;
        console.log('   文本长度:', text.length);
        const u = new SpeechSynthesisUtterance('Hello');
        window.speechSynthesis.speak(u);
        console.log('   ✅ 测试语音已触发');
    } catch(e) {
        console.log('   ❌ 错误:', e.message);
    }
} else {
    console.log('❌ 没有可播放的段落！');
}
```

**请把控制台的输出结果发给我！**

---

## 第二步：检查浏览器音频权限

1. 查看地址栏左侧是否有🔇或🔊图标
2. 如果有静音图标，点击它并允许播放音频
3. 刷新页面重试

---

## 第三步：检查系统音量

- 确认Mac系统音量已开启
- 确认浏览器没有被静音

---

## 如果以上都不行，我会恢复到之前的版本

请告诉我诊断脚本的控制台输出，我会根据结果修复问题！
