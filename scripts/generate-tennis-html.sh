#!/bin/bash

# 网球HTML完整生成脚本
TEMPLATE="/Users/yuzhoudeshengyin/Documents/my_project/english-learning/records/2026-02-06-coming-home.html"
OUTPUT="/Users/yuzhoudeshengyin/Documents/my_project/english-learning/records/2026-02-24-beginner-tennis-lesson.html"
MD_SOURCE="/Users/yuzhoudeshengyin/Documents/my_project/english-learning/records/2026-02-24-beginner-tennis-lesson.md"

# ⚠️ 弃用声明（2026-07-29）
# 本脚本为历史一次性生成器，已被 skills/learn-english/scripts/generate_pack.py 取代。
# records/ 下的富卡片页为人工精修版本（含双语摘要、修正链接等），重跑会覆盖这些修正。
# 日常新增学习包请用 generate_pack.py；如需基于模板重建某页，必须显式传入 --force。

# 安全检查：避免覆盖已精修页面（仅 --force 允许重建）
if [ -f "$OUTPUT" ] && [ "${1:-}" != "--force" ]; then
  echo "❌ 拒绝覆盖已存在的 $OUTPUT" >&2
  echo "   该页面为人工精修版本（双语摘要/修正链接等）。如需用本脚本重建，请显式传入 --force。" >&2
  exit 1
fi

echo "开始生成网球HTML..."

# 从模板读取头部（到内容区域前）
head -988 "$TEMPLATE" > "$OUTPUT"

# 添加网球内容
cat >> "$OUTPUT" << 'HTMLEOF'

        <div class="section" id="section-1">
            <h2>1. 内容总览</h2>

            <h3>核心观点总结</h3>
            <p>This comprehensive beginner tennis lesson covers the three fundamental strokes every player needs to master: the forehand, backhand, and serve. The video breaks down each technique into simple, actionable steps, focusing on proper grip, stance, swing mechanics, and follow-through. Whether you're picking up a racket for the first time or looking to refine your basics, this lesson provides a solid foundation for your tennis journey.</p>

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
                    <tr><td><strong>Forehand</strong></td><td>正手</td><td>网球基本击球技术</td></tr>
                    <tr><td><strong>Backhand</strong></td><td>反手</td><td>用球拍背面的击球</td></tr>
                    <tr><td><strong>Serve</strong></td><td>发球</td><td>开始每分的击球</td></tr>
                    <tr><td><strong>Grip</strong></td><td>握拍方式</td><td>如何持球拍</td></tr>
                    <tr><td><strong>Stance</strong></td><td>站姿</td><td>击球时的身体姿势</td></tr>
                    <tr><td><strong>Court</strong></td><td>球场</td><td>网球比赛场地</td></tr>
                    <tr><td><strong>Racket</strong></td><td>球拍</td><td>击球工具</td></tr>
                    <tr><td><strong>Swing</strong></td><td>挥拍</td><td>击球动作</td></tr>
                    <tr><td><strong>Score</strong></td><td>比分</td><td>比赛得分</td></tr>
                    <tr><td><strong>Rally</strong></td><td>连续对打</td><td>双方来回击球</td></tr>
                </tbody>
            </table>
        </div>

        <div class="section" id="section-2">
            <h2>2. 核心词汇表（20个）</h2>

            <div class="word-card">
                <h3>1. <strong>Forehand</strong> <code>/ˈfɔːrhænd/</code></h3>
                <p><strong>正手（网球术语）</strong></p>

                <p><strong>📖 语境含义</strong><br>A shot in tennis made with the palm of the hand facing the player, hitting the ball on the dominant side</p>

                <p><strong>💬 材料中的原句用法</strong></p>
                <blockquote>"The <strong>forehand</strong> is usually the first stroke beginners learn in tennis."</blockquote>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><strong>💼 职场场景</strong><br><blockquote>"She improved her <strong>forehand</strong> technique through consistent practice."</blockquote></li>
                    <li><strong>☕ 日常场景</strong><br><blockquote>"My coach says I have a natural <strong>forehand</strong> swing."</blockquote></li>
                    <li><strong>📚 学术场景</strong><br><blockquote>"The study analyzed <strong>forehand</strong> mechanics in professional tennis players."</blockquote></li>
                </ul>

                <p><strong>🔗 习惯搭配</strong></p>
                <ul>
                    <li>forehand stroke - 正手击球</li>
                    <li>forehand drive - 正手抽球</li>
                    <li>two-handed forehand - 双手正手</li>
                </ul>
            </div>

            <div class="word-card">
                <h3>2. <strong>Backhand</strong> <code>/ˈbækhænd/</code></h3>
                <p><strong>反手（网球术语）</strong></p>

                <p><strong>📖 语境含义</strong><br>A shot in tennis made with the back of the hand facing the player, hitting the ball across the body</p>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><strong>💼 职场场景</strong><br><blockquote>"His <strong>backhand</strong> has improved significantly with practice."</blockquote></li>
                    <li><strong>☕ 日常场景</strong><br><blockquote>"I struggle with my <strong>backhand</strong> when the ball comes fast."</blockquote></li>
                    <li><strong>📚 学术场景</strong><br><blockquote>"Professional players often use a two-handed <strong>backhand</strong> for better control."</blockquote></li>
                </ul>

                <p><strong>🔗 习惯搭配</strong></p>
                <ul>
                    <li>backhand slice - 反手削球</li>
                    <li>backhand drive - 反手抽球</li>
                    <li>double-handed backhand - 双手反手</li>
                </ul>
            </div>

            <div class="word-card">
                <h3>3. <strong>Serve</strong> <code>/sɜːrv/</code></h3>
                <p><strong>发球（网球术语）</strong></p>

                <p><strong>📖 语境含义</strong><br>The stroke that starts each point in tennis</p>

                <p><strong>💬 材料中的原句用法</strong></p>
                <blockquote>"She has a powerful <strong>serve</strong> that scores many aces."</blockquote>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><strong>💼 职场场景</strong><br><blockquote>"A strong <strong>serve</strong> is essential for winning matches."</blockquote></li>
                    <li><strong>☕ 日常场景</strong><br><blockquote>"I'm practicing my <strong>serve</strong> every weekend."</blockquote></li>
                    <li><strong>📚 学术场景</strong><br><blockquote>"The <strong>serve</strong> is one of the most critical shots in tennis."</blockquote></li>
                </ul>

                <p><strong>🔗 习惯搭配</strong></p>
                <ul>
                    <li>first serve - 第一发球</li>
                    <li>second serve - 第二发球</li>
                    <li>serve motion - 发球动作</li>
                </ul>
            </div>

            <div class="word-card">
                <h3>4. <strong>Grip</strong> <code>/ɡrɪp/</code></h3>
                <p><strong>握拍方式</strong></p>

                <p><strong>📖 语境含义</strong><br>The manner in which a player holds the racket</p>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><strong>💼 职场场景</strong><br><blockquote>"The continental <strong>grip</strong> is recommended for beginners."</blockquote></li>
                    <li><strong>☕ 日常场景</strong><br><blockquote>"Changing your <strong>grip</strong> can feel awkward at first."</blockquote></li>
                    <li><strong>📚 学术场景</strong><br><blockquote>"Different <strong>grips</strong> affect ball spin and trajectory."</blockquote></li>
                </ul>

                <p><strong>🔗 习惯搭配</strong></p>
                <ul>
                    <li>continental grip - 大陆式握拍</li>
                    <li>western grip - 西方式握拍</li>
                    <li>eastern grip - 东方式握拍</li>
                </ul>
            </div>

            <div class="word-card">
                <h3>5. <strong>Stance</strong> <code>/stæns/</code></h3>
                <p><strong>站姿</strong></p>

                <p><strong>📖 语境含义</strong><br>The position of the feet and body when preparing to hit the ball</p>

                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><strong>💼 职场场景</strong><br><blockquote>"Keep a wide <strong>stance</strong> for better balance."</blockquote></li>
                    <li><strong>☕ 日常场景</strong><br><blockquote>"Your <strong>stance</strong> determines your reach and stability."</blockquote></li>
                    <li><strong>📚 学术场景</strong><br><blockquote>"Proper <strong>stance</strong> is fundamental to tennis technique."</blockquote></li>
                </ul>

                <p><strong>🔗 习惯搭配</strong></p>
                <ul>
                    <li>ready stance - 准备姿势</li>
                    <li>open stance - 开放站位</li>
                    <li>neutral stance - 中性站位</li>
                </ul>
            </div>
        </div>

        <div class="section" id="section-3">
            <h2>3. 地道表达（15个）</h2>

            <div class="expression-card">
                <h3>1. "Game, set, match"</h3>
                <p><strong>含义</strong>：The game is completely finished</p>
                <p><strong>用法</strong>：宣布比赛完全结束</p>
                
                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><blockquote>"<strong>Game, set, match</strong>! He won in straight sets."</blockquote></li>
                    <li><blockquote>"The referee called '<strong>Game, set, match</strong>' after the final point."</blockquote></li>
                    <li><blockquote>"It's <strong>game, set, match</strong> for the championship!"</blockquote></li>
                </ul>

                <p><strong>💡 同义表达对比</strong></p>
                <ul>
                    <li>✅ 正确："Game, set, match" - 宣布比赛结束</li>
                    <li>❌ 错误："Game over" - 太随意，不正式</li>
                </ul>
            </div>

            <div class="expression-card">
                <h3>2. "Love" (in tennis scoring)</h3>
                <p><strong>含义</strong>：Zero points</p>
                <p><strong>用法</strong>：网球计分中的零分</p>
                
                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><blockquote>"The score is 15-<strong>love</strong>."</blockquote></li>
                    <li><blockquote>"She won the game at <strong>love</strong>."</blockquote></li>
                    <li><blockquote>"<strong>Love</strong>-30 is a difficult score to come back from."</blockquote></li>
                </ul>
            </div>

            <div class="expression-card">
                <h3>3. "Break point"</h3>
                <p><strong>含义</strong>：One point away from winning the opponent's serve game</p>
                <p><strong>用法</strong>：破发点</p>
                
                <p><strong>✍️ 实用例句</strong></p>
                <ul>
                    <li><blockquote>"She saved three <strong>break points</strong> in that game."</blockquote></li>
                    <li><blockquote>"He faced a <strong>break point</strong> at 30-40."</blockquote></li>
                    <li><blockquote>"Converting <strong>break points</strong> is crucial in tennis."</blockquote></li>
                </ul>
            </div>
        </div>

        <div class="section" id="section-4">
            <h2>4. 句型解析（8个）</h2>

            <div class="word-card">
                <h3>1. "Keep your eye on the ball"</h3>
                <p><strong>中文</strong>：盯紧球</p>
                <p><strong>用法</strong>：Focus attention tracking</p>

                <p><strong>📝 句型结构分析</strong></p>
                <blockquote>Keep + your eye + on + the ball</blockquote>
                <p>祈使句结构，表示持续性的动作要求</p>

                <p><strong>✍️ 替换练习模板</strong></p>
                <ul>
                    <li><blockquote>"<strong>Keep your eye on</strong> the target."</blockquote></li>
                    <li><blockquote>"<strong>Keep your eye on</strong> the prize."</blockquote></li>
                    <li><blockquote>"<strong>Keep your eye on</strong> the ball throughout the swing."</blockquote></li>
                </ul>
            </div>

            <div class="word-card">
                <h3>2. "Bend your knees"</h3>
                <p><strong>中文</strong>：屈膝</p>
                <p><strong>用法</strong>：Proper athletic position</p>

                <p><strong>📝 句型结构分析</strong></p>
                <blockquote>Imperative verb + your + body part</blockquote>
                <p>祈使句结构，用于指导动作</p>

                <p><strong>✍️ 替换练习模板</strong></p>
                <ul>
                    <li><blockquote>"<strong>Bend your knees</strong> to get low for the ball."</blockquote></li>
                    <li><blockquote>"<strong>Bend your knees</strong> slightly for balance."</blockquote></li>
                    <li><blockquote>"Remember to <strong>bend your knees</strong> on every shot."</blockquote></li>
                </ul>
            </div>
        </div>

        <div class="section" id="section-5">
            <h2>5. 学习任务</h2>

            <div class="practice-section">
                <h3>Task 1: Basic Strokes (30 minutes)</h3>
                <ul>
                    <li><input type="checkbox"> Practice forehand groundstrokes</li>
                    <li><input type="checkbox"> Practice backhand groundstrokes</li>
                    <li><input type="checkbox"> Practice serve motion</li>
                    <li><input type="checkbox"> Focus on grip and stance</li>
                </ul>
            </div>

            <div class="practice-section">
                <h3>Task 2: Footwork (20 minutes)</h3>
                <ul>
                    <li><input type="checkbox"> Side-to-side movement</li>
                    <li><input type="checkbox"> Forward and backward movement</li>
                    <li><input type="checkbox"> Recover to center after each shot</li>
                    <li><input type="checkbox"> Split step preparation</li>
                </ul>
            </div>

            <div class="practice-section">
                <h3>Task 3: Rally Practice (30 minutes)</h3>
                <ul>
                    <li><input type="checkbox"> Hit forehands back and forth</li>
                    <li><input type="checkbox"> Hit backhands back and forth</li>
                    <li><input type="checkbox"> Maintain a consistent rally</li>
                    <li><input type="checkbox"> Try to keep the ball in play</li>
                </ul>
            </div>
        </div>

        <div class="section" id="section-6">
            <h2>6. 学习建议</h2>

            <div class="tip-box">
                <h3>💡 学习技巧</h3>
                <ol>
                    <li><strong>Start with grip</strong>: Learn the continental grip as it's most versatile</li>
                    <li><strong>Focus on form first</strong>: Don't worry about power initially</li>
                    <li><strong>Practice consistently</strong>: Short daily practice beats long weekly sessions</li>
                    <li><strong>Watch the ball</strong>: Track the ball from your opponent to your racket</li>
                    <li><strong>Stay relaxed</strong>: Tension affects your swing negatively</li>
                    <li><strong>Use your non-dominant hand</strong>: Try playing with your weak hand too</li>
                    <li><strong>Play with better players</strong>: Challenge yourself to improve faster</li>
                    <li><strong>Record yourself</strong>: Video your strokes to analyze your form</li>
                </ol>
            </div>

            <div class="tip-box">
                <h3>🎯 测验 Yourself</h3>
                <p><strong>Questions:</strong></p>
                <ol>
                    <li>What grip is recommended for beginners?</li>
                    <li>What's the difference between a forehand and a backhand?</li>
                    <li>How do you score an ace?</li>
                    <li>What does "40-40" mean in tennis?</li>
                    <li>When should you use a slice shot?</li>
                </ol>

                <p><strong>Answers:</strong></p>
                <ol>
                    <li>Continental grip</li>
                    <li>Forehand: palm facing player; Backhand: back of hand facing player</li>
                    <li>A serve that opponent cannot return</li>
                    <li>Deuce (tied score)</li>
                    <li>On grass courts or for defensive shots</li>
                </ol>
            </div>
        </div>
HTMLEOF

# 添加模板的尾部（从script标签开始）
tail -n +1454 "$TEMPLATE" >> "$OUTPUT"

echo "✅ 网球HTML生成完成！"
echo "文件：$OUTPUT"
