#!/bin/bash

# 英语学习方法 HTML 生成脚本
# 基于模板生成完整的 HTML 文件

TEMPLATE="/Users/yuzhoudeshengyin/Documents/my_project/english-learning/records/2026-02-06-youtube-entrepreneurship.html"
OUTPUT="/Users/yuzhoudeshengyin/Documents/my_project/english-learning/records/2026-02-26-youtube-english-learning-methods.html"
MD_SOURCE="/Users/yuzhoudeshengyin/Documents/my_project/english-learning/records/2026-02-26-youtube-english-learning-methods.md"

echo "开始生成英语学习方法HTML..."

# 提取模板头部（前98行到内容开始前）
head -98 "$TEMPLATE" > "$OUTPUT"

# 添加新的内容
cat >> "$OUTPUT" << 'HTMLEOF'

        <div class="section" id="section-1">
            <h2>1. 内容总览</h2>

            <h3>核心观点总结</h3>
            <p>This comprehensive guide explores the most effective methods for learning English through YouTube in 2026. The content emphasizes a <strong>six-step progressive approach</strong> starting from 5-minute daily immersion to building full fluency through consistent listening and speaking practice. The methodology focuses on <strong>habit formation rather than grammar memorization</strong>, encouraging learners to start with content they genuinely enjoy—animations, food programs, and trending videos. The key principle is <strong>immersion through interest</strong>, making learning feel natural and sustainable rather than forced.</p>

            <h3>关键词列表</h3>
            <table>
                <thead>
                    <tr>
                        <th>英文</th>
                        <th>中文</th>
                        <th>语境提示</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><strong>Immersion</strong></td><td>沉浸式学习</td><td>完全置身于英语环境</td></tr>
                    <tr><td><strong>Fluency</strong></td><td>流利度</td><td>语言表达的流畅程度</td></tr>
                    <tr><td><strong>Comprehension</strong></td><td>理解能力</td><td>听力和阅读理解水平</td></tr>
                    <tr><td><strong>Pronunciation</strong></td><td>发音</td><td>语音语调的正确性</td></tr>
                    <tr><td><strong>Consistent</strong></td><td>持续的</td><td>保持规律的学习习惯</td></tr>
                    <tr><td><strong>Authentic</strong></td><td>真实的</td><td>地道的母语者内容</td></tr>
                    <tr><td><strong>Sustainable</strong></td><td>可持续的</td><td>能够长期坚持的方法</td></tr>
                </tbody>
            </table>
        </div>

        <div class="section" id="section-2">
            <h2>2. 核心词汇表（20个）</h2>

            <div class="word-card">
                <h3>1. <strong>Immersion</strong> <code>/ɪˈmɜːrʒn/</code></h3>
                <p><strong>沉浸；全身心投入</strong></p>

                <p><strong>📖 语境含义</strong><br>The act of involving oneself deeply in a particular activity or environment; in language learning, surrounding yourself completely with the target language.</p>

                <p><strong>💬 材料中的原句用法</strong></p>
                <blockquote>"Start with 5 minutes daily in English <strong>immersion</strong> - switch your browsing to English learning mode."</blockquote>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><strong>💼 职场场景</strong><br><blockquote>"Language <strong>immersion</strong> programs accelerate professional development."</blockquote></li>
                    <li><strong>☕ 日常场景</strong><br><blockquote>"Total <strong>immersion</strong> in English content changed my speaking ability."</blockquote></li>
                    <li><strong>📚 学术场景</strong><br><blockquote>"Studies show <strong>immersion</strong> students outperform traditional learners."</blockquote></li>
                </ul>

                <p><strong>🔗 习惯搭配</strong></p>
                <ul>
                    <li>language immersion - 语言沉浸</li>
                    <li>cultural immersion - 文化沉浸</li>
                    <li>total immersion - 完全沉浸</li>
                </ul>
            </div>

            <div class="word-card">
                <h3>2. <strong>Fluency</strong> <code>/ˈfluːənsi/</code></h3>
                <p><strong>流利；流畅</strong></p>

                <p><strong>📖 语境含义</strong><br>The ability to speak or write a language easily, smoothly, and with proper expression.</p>

                <p><strong>💬 材料中的原句用法</strong></p>
                <blockquote>"The fastest way to build English <strong>fluency</strong> includes 10 minutes of listening + 10 minutes of speaking daily."</blockquote>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><strong>💼 职场场景</strong><br><blockquote>"Her <strong>fluency</strong> in three languages helped her secure the international position."</blockquote></li>
                    <li><strong>☕ 日常场景</strong><br><blockquote>"Practice speaking daily to improve your <strong>fluency</strong> and confidence."</blockquote></li>
                    <li><strong>📚 学术场景</strong><br><blockquote>"Language <strong>fluency</strong> requires consistent exposure and active usage."</blockquote></li>
                </ul>

                <p><strong>🔗 习惯搭配</strong></p>
                <ul>
                    <li>speak with fluency - 流利地说</li>
                    <li>achieve fluency - 达到流利</li>
                    <li>fluency level - 流利程度</li>
                </ul>
            </div>

            <div class="word-card">
                <h3>3. <strong>Comprehension</strong> <code>/ˌkɒmprɪˈhenʃn/</code></h3>
                <p><strong>理解；理解力</strong></p>

                <p><strong>📖 语境含义</strong><br>The ability to understand something; includes listening and reading comprehension.</p>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><strong>💼 职场场景</strong><br><blockquote>"Listening <strong>comprehension</strong> is crucial for business communication."</blockquote></li>
                    <li><strong>☕ 日常场景</strong><br><blockquote>"Watching movies improved my English <strong>comprehension</strong> significantly."</blockquote></li>
                    <li><strong>📚 学术场景</strong><br><blockquote>"Reading <strong>comprehension</strong> tests assess understanding of complex texts."</blockquote></li>
                </ul>
            </div>

            <div class="word-card">
                <h3>4. <strong>Retention</strong> <code>/rɪˈtenʃn/</code></h3>
                <p><strong>保持；记忆保持</strong></p>

                <p><strong>📖 语境含义</strong><br>The ability to remember information over time.</p>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><strong>💼 职场场景</strong><br><blockquote>"Spaced repetition improves vocabulary <strong>retention</strong>."</blockquote></li>
                    <li><strong>☕ 日常场景</strong><br><blockquote>"Daily practice leads to better <strong>retention</strong> than cramming."</blockquote></li>
                    <li><strong>📚 学术场景</strong><br><blockquote>"Active recall is effective for information <strong>retention</strong>.</blockquote></li>
                </ul>
            </div>

            <div class="word-card">
                <h3>5. <strong>Pronunciation</strong> <code>/prəˌnʌnsiˈeɪʃn/</code></h3>
                <p><strong>发音；读音</strong></p>

                <p><strong>💬 材料中的原句用法</strong></p>
                <blockquote>"Subscribe to teaching channels focusing on <strong>pronunciation</strong>, idioms, and grammar."</blockquote>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><strong>💼 职场场景</strong><br><blockquote>"Clear <strong>pronunciation</strong> is essential for presentations."</blockquote></li>
                    <li><strong>☕ 日常场景</strong><br><blockquote>"Mimicking native speakers helps improve <strong>pronunciation</strong>.</blockquote></li>
                    <li><strong>📚 学术场景</strong><br><blockquote>"Phonetics classes focus on English <strong>pronunciation</strong>.</blockquote></li>
                </ul>
            </div>
        </div>

        <div class="section" id="section-3">
            <h2>3. 地道表达（15个）</h2>

            <div class="expression-card">
                <h3>1. "Start from scratch"</h3>
                <p><strong>含义</strong>：从零开始；完全从头开始</p>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><blockquote>"I learned English <strong>from scratch</strong> using YouTube videos."</blockquote></li>
                    <li><blockquote>"Don't be afraid to <strong>start from scratch</strong>—everyone begins at zero."</blockquote></li>
                    <li><blockquote>"The course is for beginners <strong>starting from scratch</strong>.</blockquote></li>
                </ul>

                <p><strong>💡 同义表达对比</strong></p>
                <ul>
                    <li>✅ 正确："Start from scratch" - 从零开始</li>
                    <li>❌ 错误："Start from zero" - 不地道</li>
                </ul>
            </div>

            <div class="expression-card">
                <h3>2. "Pick up" (a language)</h3>
                <p><strong>含义</strong>：偶然学会；自然习得</p>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><blockquote>"Children <strong>pick up</strong> languages quickly through immersion."</blockquote></li>
                    <li><blockquote>"I <strong>picked up</strong> some Spanish while traveling."</blockquote></li>
                    <li><blockquote>"Watching movies helped me <strong>pick up</strong> natural expressions."</blockquote></li>
                </ul>
            </div>

            <div class="expression-card">
                <h3>3. "Get the hang of"</h3>
                <p><strong>含义</strong>：掌握窍门；熟悉</p>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><blockquote>"After practice, I started to <strong>get the hang of</strong> English pronunciation."</blockquote></li>
                    <li><blockquote>"It takes time to <strong>get the hang of</strong> grammar rules."</blockquote></li>
                    <li><blockquote>"You'll <strong>get the hang of</strong> it with practice."</blockquote></li>
                </ul>
            </div>
        </div>

        <div class="section" id="section-4">
            <h2>4. 句型解析（8个）</h2>

            <div class="word-card">
                <h3>1. "The key to... is..."</h3>
                <p><strong>中文</strong>：...的关键是...</p>

                <p><strong>📝 句型结构分析</strong></p>
                <blockquote>The + key + to + [noun/gerund] + is + [noun]</blockquote>

                <p><strong>✍️ 替换练习模板</strong></p>
                <ul>
                    <li><blockquote>"<strong>The key to</strong> learning English <strong>is</strong> consistent practice."</blockquote></li>
                    <li><blockquote>"<strong>The key to</strong> fluency <strong>is</strong> immersion in authentic content."</blockquote></li>
                    <li><blockquote>"<strong>The key to</strong> success <strong>is</strong> finding methods you enjoy."</blockquote></li>
                </ul>
            </div>

            <div class="word-card">
                <h3>2. "It takes [time] to..."</h3>
                <p><strong>中文</strong>：需要...时间才能...</p>

                <p><strong>📝 句型结构分析</strong></p>
                <blockquote>It + takes + [time] + to + [verb]</blockquote>

                <p><strong>✍️ 替换练习模板</strong></p>
                <ul>
                    <li><blockquote>"<strong>It takes</strong> time <strong>to</strong> build English fluency."</blockquote></li>
                    <li><blockquote>"<strong>It takes</strong> consistent effort <strong>to</strong> master pronunciation."</blockquote></li>
                    <li><blockquote>"<strong>It takes</strong> about 6 months <strong>to</strong> reach conversational level."</blockquote></li>
                </ul>
            </div>
        </div>

        <div class="section" id="section-5">
            <h2>5. 学习任务</h2>

            <div class="practice-section">
                <h3>📖 阅读理解题（5道）</h3>
                <p><strong>题目 1：细节理解题</strong><br>What is the recommended starting duration for daily English immersion?</p>
                <ul>
                    <li>A) 30 minutes per day</li>
                    <li>B) 5 minutes per day ✅</li>
                    <li>C) 1 hour per day</li>
                    <li>D) 15 minutes per day</li>
                </ul>
                <p><strong>原文依据</strong>：Start with 5 minutes daily in English immersion.</p>
            </div>

            <div class="practice-section">
                <h3>✍️ 口语/写作练习（3个）</h3>
                <p><strong>练习 1：观点讨论题</strong></p>
                <p>Write about your opinion: Is living in an English-speaking country the best way to learn English?</p>
                <p><strong>练习 2：实际场景应用</strong></p>
                <p>Create a one-week beginner's plan for a friend who wants to start learning English.</p>
                <p><strong>练习 3：创意延伸</strong></p>
                <p>Design your own YouTube channel concept for teaching English.</p>
            </div>
        </div>

        <div class="section" id="section-6">
            <h2>6. 学习建议</h2>

            <div class="tip-box">
                <h3>💡 适合的学习场景</h3>
                <ul>
                    <li><strong>🚌 通勤时间（20-30分钟）</strong>：内容总览 + 核心词汇</li>
                    <li><strong>🌙 睡前学习（15-20分钟）</strong>：地道表达 + 句型解析</li>
                    <li><strong>☕ 周末专注（60-90分钟）</strong>：完整学习流程 + 练习</li>
                </ul>
            </div>

            <div class="tip-box">
                <h3>🎯 推荐资源</h3>
                <table>
                    <thead>
                        <tr>
                            <th>频道</th>
                            <th>特点</th>
                            <th>适合人群</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>BBC Learning English</td><td>权威、系统</td><td>初-中级</td></tr>
                        <tr><td>VOA Learning English</td><td>语速慢、词汇简单</td><td>初学者</td></tr>
                        <tr><td>Rachel's English</td><td>发音专精</td><td>想改善发音者</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

HTMLEOF

# 添加模板尾部（从第1199行开始，包含 JavaScript）
tail -n +1199 "$TEMPLATE" >> "$OUTPUT"

# 更新标题
sed -i '' 's/<title>.\+<\/title>/<title>如何用 YouTube 学英语 - 有效方法指南<\/title>/' "$OUTPUT"
sed -i '' 's/<h1>.\+<\/h1>/<h1>📚 How to Learn English with YouTube - Effective Methods for Beginners<\/h1>/' "$OUTPUT"

# 更新元数据
sed -i '' 's/<p><strong>📅 学习日期<\/strong>：.\+<\/p>/<p><strong>📅 学习日期<\/strong>：2026-02-26<\/p>/' "$OUTPUT"
sed -i '' 's/<p><strong>🏷️ 类型<\/strong>：.\+<\/p>/<p><strong>🏷️ 类型<\/strong>：YouTube 英语学习方法 - 教学指南、学习策略<\/p>/' "$OUTPUT"

echo "✅ 英语学习方法HTML生成完成！"
echo "文件：$OUTPUT"
