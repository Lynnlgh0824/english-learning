#!/bin/bash

# 快速安全检查 - 扫描硬编码的敏感信息

echo "🔍 扫描可能包含敏感信息的文件..."
echo ""

# 检查敏感关键词
KEYWORDS=(
    "password.*=.*['\"](?!.*\$\{).*['\"]"
    "secret.*=.*['\"](?!.*\$\{).*['\"]"
    "api[_-]key.*=.*['\"](?!.*\$\{).*['\"]"
    "token.*=.*['\"](?!.*\$\{).*['\"]"
    "private[_-]key.*=.*['\"](?!.*\$\{).*['\"]"
)

FOUND_ISSUES=0

for KEYWORD in "${KEYWORDS[@]}"; do
    RESULTS=$(grep -r --include="*.js" --include="*.ts" --include="*.tsx" --include="*.json" -E "$KEYWORD" . 2>/dev/null || true)
    if [ -n "$RESULTS" ]; then
        echo "⚠️  发现可能的硬编码敏感信息:"
        echo "$RESULTS"
        echo ""
        FOUND_ISSUES=1
    fi
done

if [ $FOUND_ISSUES -eq 0 ]; then
    echo "✅ 未发现明显的硬编码敏感信息"
    echo ""
    echo "⚠️  注意：这只是基础检查，请手动审查:"
    echo "  - 配置文件"
    echo "  - 环境变量文件"
    echo "  - 数据库连接字符串"
    echo "  - 第三方 API 凭证"
else
    echo "🚨 发现 $FOUND_ISSUES 个潜在问题，请人工审查！"
fi
