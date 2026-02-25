# ⚡ 用户自动化测试 - 快速启动

## 🎯 一键运行

```bash
./scripts/run-user-automation.sh
```

**自动完成**：
1. 启动HTTP服务器
2. 运行8步用户流程测试
3. 清理并关闭服务器

---

## 🌐 浏览器可视化测试

```bash
open archives/test-files/auto-test-runner.html
```

**特点**：
- 3秒后自动开始
- 7项自动测试
- 实时显示结果

---

## 📋 已实现的测试

| 测试文件 | 功能 | 位置 |
|---------|------|------|
| **test_user_flow.js** | 8步完整流程 | `archives/test-files/` |
| **tts_automated_test.js** | TTS功能测试 | `archives/test-files/` |
| **auto-test-runner.html** | 浏览器测试器 | `archives/test-files/` |
| **auto-diagnose.html** | 自动诊断工具 | `archives/test-files/` |

---

## 🔍 test_user_flow.js - 8步测试

```
1. 首页 → 详情页
2. 点击播放
3. 滚动3秒
4. 点击暂停
5. 继续滚动3秒
6. 划词朗读
7. 暂停3秒
8. 继续播放
```

---

## 📚 完整文档

查看详细指南：[docs/USER-AUTOMATION-TEST-GUIDE.md](USER-AUTOMATION-TEST-GUIDE.md)

---

**快速命令**：
```bash
# 运行测试
./scripts/run-user-automation.sh

# 浏览器测试
open archives/test-files/auto-test-runner.html

# 手动运行
cd archives/test-files
node test_user_flow.js http://localhost:8000
```
