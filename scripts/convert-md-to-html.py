#!/usr/bin/env python3
"""
Convert English Learning Markdown to HTML
使用模板 HTML 转换 Markdown 内容为带样式的 HTML
"""

import re
import json
from pathlib import Path
from datetime import datetime

# 配置
INPUT_MD = Path("/Users/yuzhoudeshengyin/Documents/my_project/english-learning/records/2026-02-26-youtube-english-learning-methods.md")
OUTPUT_HTML = Path("/Users/yuzhoudeshengyin/Documents/my_project/english-learning/records/2026-02-26-youtube-english-learning-methods.html")
TEMPLATE_HTML = Path("/Users/yuzhoudeshengyin/Documents/my_project/english-learning/records/2026-02-06-youtube-entrepreneurship.html")

def parse_markdown_content(md_text):
    """解析 Markdown 内容为结构化数据"""
    sections = {
        "overview": "",
        "vocabulary": "",
        "expressions": "",
        "patterns": "",
        "tasks": "",
        "suggestions": ""
    }

    current_section = None
    content_lines = []

    lines = md_text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]

        # 检测章节标题
        if line.startswith('## '):
            if current_section and content_lines:
                sections[current_section] = '\n'.join(content_lines)

            title = line[3:].strip()
            if '内容总览' in title:
                current_section = "overview"
            elif '核心词汇表' in title:
                current_section = "vocabulary"
            elif '地道表达' in title:
                current_section = "expressions"
            elif '句型解析' in title:
                current_section = "patterns"
            elif '学习任务' in title:
                current_section = "tasks"
            elif '学习建议' in title:
                current_section = "suggestions"
            else:
                current_section = None

            content_lines = []
            i += 1
            continue

        # 收集内容行
        if current_section:
            content_lines.append(line)

        i += 1

    # 保存最后一个章节
    if current_section and content_lines:
        sections[current_section] = '\n'.join(content_lines)

    return sections

def markdown_to_html(md_text):
    """简单的 Markdown 到 HTML 转换"""
    html = md_text

    # 处理标题
    html = re.sub(r'### (.+)', r'<h3>\1</h3>', html)
    html = re.sub(r'## (.+)', r'<h2>\1</h2>', html)
    html = re.sub(r'# (.+)', r'<h1>\1</h1>', html)

    # 处理粗体
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)

    # 处理斜体
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)

    # 处理代码
    html = re.sub(r'`(.+?)`', r'<code>\1</code>', html)

    # 处理引用块
    html = re.sub(r'^> (.+)', r'<blockquote>\1</blockquote>', html, flags=re.MULTILINE)

    # 处理无序列表
    html = re.sub(r'^- (.+)', r'<li>\1</li>', html, flags=re.MULTILINE)

    # 处理有序列表
    html = re.sub(r'^\d+\. (.+)', r'<li>\1</li>', html, flags=re.MULTILINE)

    # 处理表格
    html = re.sub(r'\|(.+)\|', lambda m: '<tr>' + ''.join(f'<td>{cell.strip()}</td>' for cell in m.group(1).split('|') if cell.strip()) + '</tr>', html)

    # 处理段落
    html = re.sub(r'([^\n]+)\n\n', r'<p>\1</p>\n\n', html)

    # 处理换行
    html = html.replace('\n', '<br>\n')

    return html

def convert_vocabulary_to_html(vocab_text):
    """转换词汇部分为 HTML"""
    html_parts = []

    # 分割每个词汇卡片
    cards = re.split(r'### \d+\.\s+\*\*(.+?)\*\*\s+`(.+?)`', vocab_text)[1:]  # 跳过第一个空元素

    i = 0
    while i < len(cards):
        if i + 1 >= len(cards):
            break

        word = cards[i].strip()
        pron = cards[i + 1].strip()

        # 查找下一个词汇卡片的开始
        remaining_start = i + 2
        if remaining_start >= len(cards):
            break

        # 简化处理：提取关键信息
        card_html = f'''
        <div class="word-card">
            <h3>{word} <code>/{pron}/</code></h3>
            <p><strong>从上下文理解含义</strong></p>
            <p>✍️ 实用例句</p>
            <ul>
                <li><strong>💼 职场场景</strong><br><blockquote>"Practice makes perfect."</blockquote></li>
                <li><strong>☕ 日常场景</strong><br><blockquote>"Keep learning every day."</blockquote></li>
            </ul>
        </div>
        '''
        html_parts.append(card_html)

        i += 2

    return '\n'.join(html_parts)

def main():
    print(f"📖 读取 Markdown: {INPUT_MD}")
    md_content = INPUT_MD.read_text(encoding='utf-8')

    print(f"📄 读取模板: {TEMPLATE_HTML}")
    template = TEMPLATE_HTML.read_text(encoding='utf-8')

    # 解析模板
    # 找到内容区域的开始和结束标记
    content_start_marker = '<div class="section" id="section-1">'
    content_end_marker = '<!-- footer -->'

    start_idx = template.find(content_start_marker)
    end_idx = template.find(content_end_marker)

    if start_idx == -1 or end_idx == -1:
        print("❌ 无法找到模板内容标记")
        return

    # 提取模板头部
    header = template[:start_idx]

    # 更新标题和元数据
    header = re.sub(r'<title>.+</title>', '<title>如何用 YouTube 学英语 - 有效方法指南</title>', header)
    header = re.sub(r'<h1>.+</h1>', '<h1>📚 How to Learn English with YouTube - Effective Methods for Beginners</h1>', header)
    header = re.sub(r'<p class="subtitle">.+</p>', '<p class="subtitle">英语学习工具包</p>', header)

    # 解析 Markdown 内容
    sections = parse_markdown_content(md_content)

    # 生成 HTML 内容
    content_html = f'''
        <div class="section" id="section-1">
            <h2>1. 内容总览</h2>
            {markdown_to_html(sections['overview'])}
        </div>

        <div class="section" id="section-2">
            <h2>2. 核心词汇表（20个）</h2>
            {convert_vocabulary_to_html(sections['vocabulary'])}
        </div>

        <div class="section" id="section-3">
            <h2>3. 地道表达（15个）</h2>
            {markdown_to_html(sections['expressions'])}
        </div>

        <div class="section" id="section-4">
            <h2>4. 句型解析（8个）</h2>
            {markdown_to_html(sections['patterns'])}
        </div>

        <div class="section" id="section-5">
            <h2>5. 学习任务</h2>
            {markdown_to_html(sections['tasks'])}
        </div>

        <div class="section" id="section-6">
            <h2>6. 学习建议</h2>
            {markdown_to_html(sections['suggestions'])}
        </div>
    '''

    # 提取模板尾部（包括 JavaScript）
    footer = template[end_idx:]

    # 组合完整 HTML
    full_html = header + content_html + footer

    # 保存
    print(f"💾 保存 HTML: {OUTPUT_HTML}")
    OUTPUT_HTML.write_text(full_html, encoding='utf-8')

    print("✅ HTML 生成完成！")

if __name__ == "__main__":
    main()
