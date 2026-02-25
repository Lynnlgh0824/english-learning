/**
 * ========================================
 * 页面公共功能脚本
 * ========================================
 * 功能：阅读进度条、返回顶部、平滑滚动等
 *
 * 使用方法：在 HTML </body> 前引入
 * <script src="/scripts/page-common.js"></script>
 */

(function() {
    'use strict';

    // ========================================
    // 阅读进度条
    // ========================================

    function initReadingProgress() {
        const progressBar = document.getElementById('readingProgress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = progress + '%';

            // 回到顶部和回到首页按钮显示/隐藏
            const backToTop = document.getElementById('backToTop');
            const backToHome = document.getElementById('backToHome');

            if (backToTop && backToHome) {
                if (scrollTop > 300) {
                    backToTop.classList.add('visible');
                    backToHome.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                    backToHome.classList.remove('visible');
                }
            }

            // TTS 面板固定效果
            const ttsPanel = document.getElementById('ttsPanel');
            const ttsPanelPlaceholder = document.getElementById('ttsPanelPlaceholder');
            if (ttsPanel && ttsPanelPlaceholder) {
                // 检查是否已经固定
                const isFixed = ttsPanel.classList.contains('fixed');

                if (scrollTop > 50 && !isFixed) {
                    // 在固定之前获取高度
                    const panelHeight = ttsPanel.offsetHeight;
                    ttsPanel.classList.add('fixed');
                    ttsPanelPlaceholder.style.display = 'block';
                    ttsPanelPlaceholder.style.height = panelHeight + 'px';
                } else if (scrollTop <= 50 && isFixed) {
                    ttsPanel.classList.remove('fixed');
                    ttsPanelPlaceholder.style.display = 'none';
                }
            }
        });
    }

    // ========================================
    // 回到顶部功能
    // ========================================

    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // 平滑滚动到锚点
    // ========================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // 忽略空链接
                if (href === '#' || href === '') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ========================================
    // 页面初始化
    // ========================================

    document.addEventListener('DOMContentLoaded', () => {
        initReadingProgress();
        initBackToTop();
        initSmoothScroll();
        console.log('✅ 页面公共功能已初始化');
    });

})();
