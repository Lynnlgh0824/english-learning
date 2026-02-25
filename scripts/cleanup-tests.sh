#!/bin/bash

# ========================================
# 测试文件清理脚本
# ========================================
# 功能：整理和归档重复的测试文件
#
# 使用方法：
# chmod +x scripts/cleanup-tests.sh
# ./scripts/cleanup-tests.sh
#

echo "🧹 开始清理测试文件..."
echo ""

# 创建归档目录
ARCHIVE_DIR="archives/old-tests"
mkdir -p "$ARCHIVE_DIR"

# ========================================
# 需要保留的核心文件
# ========================================

KEEP_FILES=(
    # 统一测试中心
    "unified-test-center.html"
    "test-center.html"

    # E2E 测试
    "tests/automated-e2e-test.js"
    "tests/integration/test_tts_playback.js"

    # 核心调试工具
    "archives/test-files/test-debug.html"
    "archives/test-files/auto-diagnose.html"
    "archives/test-files/auto-test-runner.html"

    # 简化测试页面
    "archives/test-files/test-tts-simple.html"
    "archives/test-files/test-audio-output.html"
)

# ========================================
# 需要归档的重复文件
# ========================================

ARCHIVE_FILES=(
    # 旧的 TTS 测试文件（已被 test-debug.html 替代）
    "archives/test-files/test-tts.html"
    "archives/test-files/test-tts-independent.html"

    # 旧的自动化测试脚本（已被 automated-e2e-test.js 替代）
    "archives/test-files/tts_automated_test.js"
    "archives/test-files/tts_from_index_test.js"
    "archives/test-files/tts_play_pause_test.js"
    "archives/test-files/tts_quick_test.js"
    "archives/test-files/tts_real_user_test.js"
    "archives/test-files/tts_simple_test.js"
    "archives/test-files/tts_test.js"
    "archives/test-files/tts_test_auto_fix.js"
    "archives/test-files/tts_visual_improved.js"
    "archives/test-files/tts_visual_test.js"
    "archives/test-files/tts_voice_and_number_test.js"

    # 旧的导航测试脚本（已被整合）
    "archives/test-files/test_all_pages_nav.js"
    "archives/test-files/test_nav_hide.js"
    "archives/test-files/test_nav_toc_hide.js"
    "archives/test-files/test_nav_toc_hide_v2.js"
    "archives/test-files/test_toc_button.js"

    # 旧的流程测试脚本
    "archives/test-files/test_user_flow.js"
    "archives/test-files/test_real_browser.js"
    "archives/test-files/test_same_browser.js"

    # 旧的测试页面
    "archives/test-files/test-auto.html"
    "archives/test-files/test-automation.html"
    "archives/test-files/test-diagnose.html"
    "archives/test-files/test-final.html"
    "archives/test-files/test-and-report.html"
    "archives/test-files/verify-fix.html"

    # 旧的诊断脚本（已被 auto-diagnose.html 替代）
    "archives/test-files/diagnose_paragraphs.js"
)

# ========================================
# 执行清理
# ========================================

echo "📦 归档以下文件到: $ARCHIVE_DIR"
echo ""

moved_count=0
for file in "${ARCHIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        # 获取文件名
        filename=$(basename "$file")
        # 移动到归档目录
        mv "$file" "$ARCHIVE_DIR/$filename"
        echo "  ✓ 已归档: $file"
        ((moved_count++))
    else
        echo "  - 跳过（不存在）: $file"
    fi
done

echo ""
echo "✅ 清理完成！"
echo "   - 归档文件: $moved_count 个"
echo "   - 归档位置: $ARCHIVE_DIR"
echo ""
echo "📋 保留的核心文件："
for file in "${KEEP_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    fi
done

echo ""
echo "💡 提示：如果需要恢复文件，可以从 $ARCHIVE_DIR 中复制回来"
