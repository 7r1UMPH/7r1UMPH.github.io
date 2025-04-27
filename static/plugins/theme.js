// 主题配置和初始化
document.addEventListener('DOMContentLoaded', () => {
    // 基础配置
    const config = {
        mobileBreakpoint: 768,
        api: {
            quote: 'https://www.wniui.com/api/yiyan/index.php'
        }
    };

    // 工具函数
    const utils = {
        isDesktop: () => window.matchMedia(`(min-width: ${config.mobileBreakpoint}px)`).matches,
        isMobile: () => window.matchMedia(`(max-width: ${config.mobileBreakpoint - 1}px)`).matches,
        createStyle: (styles) => {
            const styleTag = document.createElement('style');
            styleTag.textContent = Object.entries(styles)
                .map(([selector, rules]) => `${selector} { ${rules} }`)
                .join('\n');
            document.head.appendChild(styleTag);
        }
    };

    // 移动端优化
    const mobileOptimizer = {
        init() {
            if (!utils.isMobile()) return;
            
            this.createHamburgerMenu();
            this.optimizeArticleReading();
            this.applyMobileStyles();
        },

        createHamburgerMenu() {
            const header = document.getElementById('header');
            if (!header || document.querySelector('.hamburger-menu')) return;

            const hamburger = document.createElement('div');
            hamburger.className = 'hamburger-menu';
            hamburger.innerHTML = '<div class="hamburger-icon"></div>';
            header.appendChild(hamburger);

            const sidebar = document.createElement('div');
            sidebar.className = 'mobile-sidebar';
            sidebar.innerHTML = this.generateSidebarContent();
            document.body.appendChild(sidebar);

            this.setupSidebarEvents(hamburger, sidebar);
        },

        generateSidebarContent() {
            const navItems = document.querySelectorAll('#header a');
            let content = '<div class="sidebar-close">×</div><div class="sidebar-links">';
            
            navItems.forEach(item => {
                if (!item.href.includes('github.com/7r1UMPH/7r1UMPH.github.io/issues')) {
                    content += `<a href="${item.href}">${item.textContent}</a>`;
                }
            });
            
            return content + '</div>';
        },

        setupSidebarEvents(hamburger, sidebar) {
            hamburger.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                document.body.classList.toggle('sidebar-open');
            });

            document.querySelector('.sidebar-close')?.addEventListener('click', () => {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            });

            document.addEventListener('click', (e) => {
                if (sidebar.classList.contains('active') && 
                    !sidebar.contains(e.target) && 
                    !hamburger.contains(e.target)) {
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            });
        },

        optimizeArticleReading() {
            const article = document.querySelector('.markdown-body');
            if (!article) return;

            const backToTop = document.createElement('div');
            backToTop.className = 'back-to-top';
            backToTop.innerHTML = '↑';
            document.body.appendChild(backToTop);

            const progressBar = document.createElement('div');
            progressBar.className = 'reading-progress';
            document.body.appendChild(progressBar);

            window.addEventListener('scroll', () => {
                this.updateReadingProgress(backToTop, progressBar);
            });

            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        updateReadingProgress(backToTop, progressBar) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;
            
            backToTop.classList.toggle('visible', scrollTop > 300);
            
            const readPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
            progressBar.style.width = readPercentage + '%';
        },

        applyMobileStyles() {
            const mobileStyles = {
                'body': `
                    padding: 0 !important;
                    margin: 0 !important;
                    font-size: 16px !important;
                    line-height: 1.5 !important;
                    background: rgba(237, 239, 233, 0.95) !important;
                    overflow-x: hidden !important;
                `,
                '.hamburger-menu': `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    cursor: pointer;
                `,
                '.mobile-sidebar': `
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 80%;
                    height: 100vh;
                    background: rgba(255, 255, 255, 0.95);
                    transition: right 0.3s ease;
                    z-index: 999;
                `,
                '.mobile-sidebar.active': `
                    right: 0;
                `
            };

            utils.createStyle(mobileStyles);
        }
    };

    // 桌面端优化
    const desktopOptimizer = {
        init() {
            if (!utils.isDesktop()) return;
            
            this.applyDesktopStyles();
            this.createStatsSidebar();
            this.updateQuote();
        },

        applyDesktopStyles() {
            const desktopStyles = {
                'body': `
                    min-width: 200px;
                    max-width: 885px;
                    margin: 30px auto;
                    font-size: 20px;
                    line-height: 1.6;
                    background: rgba(237, 239, 233, 0.84);
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                    overflow: auto;
                `,
                '.stats-sidebar': `
                    position: fixed;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.9);
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                `
            };

            utils.createStyle(desktopStyles);
        },

        createStatsSidebar() {
            const sidebar = document.createElement('div');
            sidebar.className = 'stats-sidebar';
            sidebar.innerHTML = `
                <div class="stats-avatar">
                    <img src="https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png" alt="头像">
                </div>
                <div class="stats-item">网站已运行 <span id="runday">197</span> 天</div>
                <div class="stats-item">本站总访问量 <span id="busuanzi_value_site_pv">1485</span> 次</div>
                <div class="stats-item">本站总访客数 <span id="busuanzi_value_site_uv">491</span> 人</div>
                <div class="stats-item">本文总阅读量 <span id="busuanzi_value_page_pv">42</span> 次</div>
            `;
            document.body.appendChild(sidebar);
        },

        async updateQuote() {
            try {
                const response = await fetch(config.api.quote);
                const data = await response.json();
                const quoteDivs = document.querySelectorAll('div[style*="margin-bottom: 16px"]');
                
                quoteDivs.forEach(div => {
                    div.textContent = data.data || "默认文本，API无返回时显示";
                });
            } catch (error) {
                console.error('获取名言API失败:', error);
            }
        }
    };

    // 初始化
    function init() {
        if (utils.isDesktop()) {
            desktopOptimizer.init();
        } else {
            mobileOptimizer.init();
        }

        window.addEventListener('resize', () => {
            const currentIsDesktop = utils.isDesktop();
            const wasDesktop = document.body.classList.contains('desktop-applied');
            
            if ((currentIsDesktop && !wasDesktop) || (!currentIsDesktop && wasDesktop)) {
                location.reload();
            }
        });

        document.body.classList.toggle('desktop-applied', utils.isDesktop());
    }

    // 启动应用
    init();
});

// 加载增强插件
function loadEnhancementPlugins() {
    const plugins = [
        '/plugins/optimizeImages.js',  // 图片优化
        '/plugins/seoOptimizer.js',    // SEO优化
        '/plugins/smoothTransition.js' // 页面过渡
    ];
    
    // 依次加载插件
    plugins.forEach(pluginPath => {
        // 跳过不存在的插件
        if (pluginPath === '/plugins/StatsSidebar.js') return;
        
        const script = document.createElement('script');
        script.src = pluginPath;
        script.async = true;
        document.body.appendChild(script);
    });
}
