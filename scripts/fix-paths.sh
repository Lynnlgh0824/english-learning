#!/bin/bash
# 修复文档中的硬编码路径

# 使用相对路径替代绝对路径
find docs scripts . -name "*.md" -type f -exec sed -i '' 's|/Users/yuzhoudeshengyin/english-learning|$(PROJECT_ROOT)|g' {} \;
find docs scripts . -name "*.md" -type f -exec sed -i '' 's|/Users/yuzhoudeshengyin/Documents/my_project/english-learning|$(PROJECT_ROOT)|g' {} \;

echo "✅ 路径已修复为相对变量 $(PROJECT_ROOT)"
