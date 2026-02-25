# 🛡️ HTML内容一致性防护体系

## 问题背景
之前出现过HTML文件内容与标题不匹配的问题（如：网球文章显示"Coming Home"的内容），这是由于复制模板后忘记替换内容导致的。

---

## ✅ 已实施的防护措施

### 1. 自动化验证脚本
**文件**：`scripts/validate-content.sh`

**功能**：
- ✅ 检查HTML标题是否与data.json匹配
- ✅ 检查是否有词汇内容
- ✅ 检测未替换的模板内容
- ✅ 验证.md源文件是否存在

**使用方法**：
```bash
./scripts/validate-content.sh
```

### 2. 学习记录完整性检查
**文件**：`scripts/validate-project.sh`

**功能**：
- 检查所有公共文件是否存在
- 验证HTML文件结构一致性
- 检测代码重复

---

## 📋 HTML生成标准流程

### 正确的流程（必须遵循）

1. **创建.md源文件**
   ```bash
   # 使用learn-english技能自动生成
   /learn-english [YouTube URL]
   ```

2. **验证.md内容**
   ```bash
   # 检查源文件是否包含完整内容
   head -50 records/YYYY-MM-DD-title.md
   ```

3. **生成HTML文件**
   - 从.md源文件提取内容
   - 使用模板HTML作为基础
   - **必须替换所有内容区域**
   - 保持CSS和JavaScript不变

4. **验证HTML内容**
   ```bash
   ./scripts/validate-content.sh
   ```

5. **更新data.json**
   - 添加记录到records数组
   - 更新byDate统计
   - 更新lastUpdated时间戳

---

## 🚨 绝对禁止的操作

### ❌ 错误做法1：直接复制模板不修改内容
```bash
# 错误！
cp template.html records/new-record.html
# 没有替换内容就提交
```

### ❌ 错误做法2：手动复制HTML部分内容
```bash
# 错误！容易遗漏部分内容
# 应该使用自动化工具从.md生成
```

### ❌ 错误做法3：跳过验证步骤
```bash
# 错误！修改后必须验证
git add records/*.html
git commit -m "add new record"  # ❌ 没有先验证
```

---

## ✅ 正确操作示例

### 方法1：使用learn-english技能（推荐）
```bash
# 自动生成.md和.html
/learn-english https://www.youtube.com/watch?v=VIDEO_ID

# 验证生成的内容
./scripts/validate-content.sh
```

### 方法2：手动从.md生成HTML
如果需要手动生成，必须：

1. **读取.md源文件**，提取所有内容
2. **复制模板HTML**（如coming-home.html）
3. **替换以下部分**：
   - `<title>` 标签
   - `<h1>` 主标题
   - `.meta-info` 元信息
   - 所有 `.section` 内容区域
   - 词汇卡片（20个）
   - 表达卡片（15个）
   - 句型卡片（8个）
   - 学习任务
4. **保持不变**：
   - 所有CSS样式
   - JavaScript代码
   - TTS功能
5. **验证**：运行validate-content.sh

---

## 🔒 Git提交前检查

### Pre-commit Hook（自动验证）

**文件**：`.git/hooks/pre-commit`

```bash
#!/bin/bash

# 每次提交前自动验证内容一致性
echo "🔍 验证学习记录内容..."

if [ -f "scripts/validate-content.sh" ]; then
    ./scripts/validate-content.sh
    if [ $? -ne 0 ]; then
        echo "❌ 验证失败！请修复后再提交。"
        exit 1
    fi
fi

echo "✅ 验证通过，可以提交"
```

**安装方法**：
```bash
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

---

## 📊 问题预防检查清单

### 添加新学习记录时

- [ ] 使用`/learn-english`技能或正确地从.md生成HTML
- [ ] HTML包含正确的标题和元数据
- [ ] 词汇卡片数量正确（默认20个）
- [ ] 表达卡片数量正确（默认15个）
- [ ] 句型卡片数量正确（默认8个）
- [ ] 所有内容与.md源文件一致
- [ ] 运行`./scripts/validate-content.sh`验证
- [ ] 更新data.json
- [ ] Git提交前再次验证

### 修改现有HTML时

- [ ] 确认修改的是正确的文件
- [ ] 备份原文件
- [ ] 运行validate-content.sh
- [ ] 在浏览器中测试显示效果
- [ ] 测试TTS功能是否正常

---

## 🛠️ 故障排除

### 问题1：验证脚本报错
```
❌ 标题不匹配
```

**解决**：
1. 检查data.json中的title字段
2. 检查HTML中的`<h1>`标签
3. 确保两者关键词一致

### 问题2：词汇卡片为空
```
❌ 缺少词汇内容
```

**解决**：
1. 检查HTML是否完整生成
2. 重新从.md源文件生成HTML
3. 确保模板内容被完全替换

### 问题3：检测到未替换的模板内容
```
⚠️ 可能包含未替换的模板内容: Digital Nomad
```

**解决**：
1. 检查HTML内容是否与标题匹配
2. 如果确实不匹配，重新生成HTML
3. 如果标题本身就包含该词，可以忽略

---

## 📚 相关文档

- [TESTING.md](TESTING.md) - 测试流程
- [IMPROVEMENT-GUIDE.md](IMPROVEMENT-GUIDE.md) - 沟通改进指南
- [PROJECT-LESSONS-LEARNED.md](PROJECT-LESSONS-LEARNED.md) - 项目经验总结

---

## 🎯 最佳实践总结

1. **自动化优先**：使用`/learn-english`技能自动生成
2. **验证必做**：修改后必须运行validate-content.sh
3. **源文件为主**：.md源文件是内容权威来源
4. **提交前检查**：Git提交前自动验证
5. **出问题立即修复**：发现问题立即解决，不累积

---

**创建日期**：2026-02-25
**最后更新**：2026-02-25
**维护者**：Claude Code Assistant
