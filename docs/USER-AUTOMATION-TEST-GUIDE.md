# 🧪 用户自动化测试完整指南

## 📚 测试功能说明

本项目已实现**完整的用户自动化测试系统**，使用 Puppeteer 调取真实浏览器，模拟用户实际操作流程。

### 核心测试文件

| 文件 | 功能 | 位置 |
|------|------|------|
| `test_user_flow.js` | 8步完整用户流程 | `archives/test-files/` |
| `tts_automated_test.js` | TTS功能自动化测试 | `archives/test-files/` |
| `auto-test-runner.html` | 浏览器内自动测试运行器 | `archives/test-files/` |
| `auto-diagnose.html` | 自动诊断工具 | `archives/test-files/` |

---

## 🚀 快速开始

### 方法1：一键运行所有测试 ⭐

```bash
# 赋予执行权限
chmod +x scripts/run-user-automation.sh

# 运行测试
./scripts/run-user-automation.sh
```

**自动完成**：
1. ✅ 检查Node.js环境
2. ✅ 启动HTTP服务器
3. ✅ 运行8步用户流程测试
4. ✅ 自动清理并关闭服务器

---

### 方法2：在浏览器中运行可视化测试

```bash
# 打开自动测试运行器
open archives/test-files/auto-test-runner.html
```

**特点**：
- 📊 实时显示测试进度
- 🎨 可视化测试结果
- 📝 自动生成测试报告
- ⏱️ 3秒后自动开始测试

---

### 方法3：手动运行单个测试

#### 测试1：完整用户流程（8步）

```bash
cd archives/test-files

# 启动服务器
python3 -m http.server 8000 &

# 运行测试（另一个终端）
node test_user_flow.js http://localhost:8000
```

**8步测试内容**：
1. 从首页到详情页
2. 点击播放按钮
3. 向下滚动3秒
4. 点击暂停
5. 继续向下滚动3秒
6. 选择文本并朗读
7. 暂停3秒
8. 点击播放继续

#### 测试2：TTS自动化测试

```bash
node tts_automated_test.js http://localhost:8000
```

**TTS测试内容**：
- 语音加载测试
- 播放/暂停测试
- 语速调节测试
- 学习模式切换测试
- 划词朗读测试

---

## 📊 测试覆盖范围

### 功能测试

| 功能 | 测试方法 | 状态 |
|------|---------|------|
| 首页加载 | Puppeteer打开 | ✅ 已实现 |
| 学习记录显示 | 检查DOM元素 | ✅ 已实现 |
| 详情页跳转 | 点击导航 | ✅ 已实现 |
| TTS播放控制 | 点击按钮验证 | ✅ 已实现 |
| 划词朗读 | 选文本+播放 | ✅ 已实现 |
| 学习模式切换 | 切换active状态 | ✅ 已实现 |
| 进度显示 | 检查进度条 | ✅ 已实现 |
| 语音选择 | 切换下拉选项 | ✅ 已实现 |

### 自动化程度

- 🤖 **100%自动**：无需人工干预
- 🎯 **真实浏览器**：使用Chrome/Chromium
- 📸 **截图留存**：自动保存测试截图
- 📝 **日志记录**：详细的测试日志

---

## 🔧 测试脚本说明

### test_user_flow.js - 核心脚本

```javascript
// 测试流程
async function testRealBrowser() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Step 1: 首页 → 详情页
    await page.goto('http://localhost:8000');
    await page.click('.record-card:first-child');

    // Step 2: 点击播放
    await page.click('#playBtn');

    // Step 3-8: 完整用户交互...
}
```

### auto-test-runner.html - 浏览器测试器

**功能**：
- 🚀 自动启动7项测试
- 📊 实时进度条
- ✅/❌ 结果显示
- 🔄 一键重新测试

**使用**：
1. 在浏览器中打开 `auto-test-runner.html`
2. 等待3秒自动开始
3. 查看测试结果

---

## 📋 完整测试清单

### 每次代码修改后

- [ ] 运行用户流程测试
- [ ] 运行TTS自动化测试
- [ ] 在浏览器中手动验证

### 发布新版本前

- [ ] 运行所有自动化测试
- [ ] 检查测试覆盖率
- [ ] 验证所有学习记录可访问
- [ ] 测试跨浏览器兼容性

### 每周例行检查

- [ ] 运行完整测试套件
- [ ] 检查测试通过率
- [ ] 更新测试用例
- [ ] 审查测试日志

---

## 🐛 故障排除

### 问题1：测试失败 - "找不到元素"

**原因**：页面加载未完成

**解决**：
```javascript
// 增加等待时间
await page.waitForSelector('.record-card', { timeout: 10000 });
```

### 问题2：TTS无法播放

**原因**：浏览器权限或音频上下文

**解决**：
```bash
# 使用非headless模式运行
HEADLESS=false node test_user_flow.js
```

### 问题3：端口已被占用

**解决**：
```bash
# 查找占用端口的进程
lsof -ti:8000 | xargs kill -9

# 或使用其他端口
python3 -m http.server 8001
```

---

## 📈 测试报告示例

```
========================================
🧪 用户自动化测试报告
========================================

测试时间: 2026-02-25 22:00:00
测试URL: http://localhost:8000

测试结果:
  ✅ 测试1: 首页加载 - 通过
  ✅ 测试2: 详情页跳转 - 通过
  ✅ 测试3: TTS播放 - 通过
  ✅ 测试4: 播放控制 - 通过
  ✅ 测试5: 划词朗读 - 通过
  ✅ 测试6: 模式切换 - 通过
  ✅ 测试7: 进度显示 - 通过
  ✅ 测试8: 返回首页 - 通过

总计: 8/8 通过 (100%)
```

---

## 🎯 最佳实践

1. **提交代码前**：始终运行测试
2. **修改TTS后**：运行TTS专项测试
3. **新增记录后**：验证新记录可访问
4. **定期维护**：更新测试用例

---

## 📚 相关文档

- [TESTING.md](TESTING.md) - 完整测试流程
- [CONTENT-VALIDATION-GUIDE.md](CONTENT-VALIDATION-GUIDE.md) - 内容验证指南
- [QUICK-REF-CHECK.md](QUICK-REF-CHECK.md) - 快速检查参考

---

**更新时间**: 2026-02-25
**维护者**: Claude Code Assistant
**测试覆盖**: 用户流程 + TTS功能 + 链接完整性
