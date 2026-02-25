# 🔧 TTS 调试和测试说明

## 已完成的修复

### 1. 添加详细的调试日志
在 `tts-common.js` 的关键函数中添加了日志输出：
- `getReadableParagraphs()` - 显示找到多少个可朗读段落
- `startSpeech()` - 显示播放状态和段落数量
- `playParagraph()` - 显示播放进度和文本内容
- `DOMContentLoaded` - 显示初始化结果

### 2. 添加错误恢复机制
- 如果 `window.paragraphs` 为空，会自动重新获取
- 如果段落文本为空，会自动跳过该段落
- 所有关键步骤都有错误检查

### 3. 创建了测试页面
位置：`http://localhost:8000/test-tts.html`

---

## 测试步骤

### 方法1：使用测试页面（推荐）

1. **打开测试页面**
   ```
   http://localhost:8000/test-tts.html
   ```

2. **依次点击测试按钮**：
   - ✅ 测试 speechSynthesis API
   - ✅ 测试语音列表
   - ✅ 测试简单朗读（应该能听到声音）
   - ✅ 测试段落获取
   - ✅ 检查容器元素

3. **查看日志输出**，确认所有功能正常

### 方法2：测试实际学习页面

1. **强制刷新页面**（Cmd + Shift + R）

2. **打开开发者工具**（F12），切换到 Console 标签

3. **点击"播放"按钮**

4. **查看控制台输出**，应该看到类似：
   ```
   [DOMContentLoaded] 页面加载完成，开始初始化...
   [getReadableParagraphs] 开始获取可朗读段落...
   [getReadableParagraphs] 容器中找到 XXX 个元素
   [getReadableParagraphs] 找到 XX 个可朗读段落
   [DOMContentLoaded] ✅ 已加载 XX 个可朗读段落
   [startSpeech] 开始播放，状态: {isPaused: false, paragraphsLength: XX, ...}
   [playParagraph] 播放段落: 0 总段落数: XX
   [playParagraph] 文本长度: XXX 预览: ...
   ```

5. **检查是否有声音**

---

## 可能的问题和解决方案

### 问题1：控制台显示"未找到可朗读的段落"

**原因**：`getReadableParagraphs()` 过滤后返回空数组

**解决**：
- 检查页面是否有 `<div class="container">` 元素
- 检查容器内是否有英文内容（>20字符）
- 查看日志中的"容器中找到 X 个元素"

### 问题2：看到"朗读已取消"

**原因**：TTS被立即取消

**解决**：
- 检查 `window.paragraphs` 是否为空
- 检查浏览器是否允许自动播放音频
- 查看详细日志确定取消原因

### 问题3：没有声音

**原因**：浏览器阻止了音频播放

**解决**：
- 检查地址栏左侧是否有静音图标 🔇
- 点击图标允许播放音频
- 确保系统音量已开启

---

## 如果仍然有问题

请把以下信息发给我：

1. **测试页面的日志输出**（test-tts.html）
2. **实际页面的控制台日志**（点击播放后的完整日志）
3. **浏览器型号和版本**
4. **具体的问题描述**（有声音吗？有错误吗？）

我会根据这些信息进一步诊断和修复问题！
