# ⚡ 快速参考：HTML内容防护

## 🚀 快速检查

### 一键验证所有内容
```bash
./scripts/validate-content.sh
```

### 检查单个文件
```bash
# 检查HTML结构
grep -c 'class="word-card"' records/2026-02-24-*.html

# 应该显示：15-20个词汇
```

---

## ✅ 添加新记录的标准流程

```bash
# 1. 生成学习记录
/learn-english [YouTube URL]

# 2. 验证内容
./scripts/validate-content.sh

# 3. 在浏览器中测试
open records/2026-02-24-*.html

# 4. 提交（自动验证）
git add .
git commit -m "Add new learning record"
```

---

## ❌ 常见错误速查

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| 标题不匹配 | 复制模板后忘记改标题 | 更新`<h1>`和`<title>` |
| 词汇为空 | HTML生成不完整 | 重新从.md生成HTML |
| 内容错误 | 复制了错误的HTML | 检查.md源文件，重新生成 |
| .md缺失 | 只创建了HTML | 从.md或learn-english重新生成 |

---

## 🔍 诊断命令

```bash
# 查看所有HTML的行数和词汇数
for f in records/*.html; do
  echo "$(basename $f): $(wc -l < $f)行, $(grep -c 'word-card' $f)个词汇"
done

# 查看标题和第一个词汇
grep -E '<h1>|<h3>1\.' records/2026-02-24-*.html

# 验证data.json语法
python3 -m json.tool data.json
```

---

## 🛡️ 自动防护

- ✅ Pre-commit hook：提交前自动验证
- ✅ Validate脚本：手动验证任何时间
- ✅ 结构检查：确保HTML完整性

---

## 📞 遇到问题？

1. 运行 `./scripts/validate-content.sh` 查看详细错误
2. 检查 `docs/CONTENT-VALIDATION-GUIDE.md` 获取详细指南
3. 查看 `docs/PROJECT-LESSONS-LEARNED.md` 了解历史问题

---

**更新**：2026-02-25
**状态**：✅ 防护体系已部署
