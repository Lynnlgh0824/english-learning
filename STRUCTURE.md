# 📁 专业团队项目结构

## 目录结构

```
english-learning/
├── src/                    # 源代码目录
├── prompts/                # AI 提示词模板
├── config/                 # 配置文件
│   └── default.json       # 默认配置
├── tests/                  # 测试文件
│   └── integration/       # 集成测试
├── scripts/                # 工具脚本
├── docs/                   # 文档
├── records/                # 学习记录
├── styles/                 # 样式文件
├── archives/               # 归档文件
├── learnings/              # 学习资料
├── .env.example           # 环境变量示例
├── .gitignore             # Git 忽略规则
├── README.md              # 项目说明
└── package.json           # 项目配置（如果有）
```

## 安全原则

### ✅ 应该提交
- src/
- prompts/
- config/
- tests/
- scripts/
- docs/
- .env.example
- .gitignore
- README.md

### ❌ 绝不提交
- .env
- .env.local
- *.pem, *.key
- credentials.json
- secrets/
- models/
- *.gguf, *.bin, *.pt
- node_modules/
- venv/
- .claude/
- .cursor/
