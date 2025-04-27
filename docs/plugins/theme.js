// 当DOM加载完成后执行
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
    
    // 如果是移动端则不应用桌面样式
    if (!isDesktop()) {
        console.log('检测到移动端视图，不应用桌面自定义样式');
        return;
    }

    // 获取当前页面路径
    const currentPath = window.location.pathname;

    // 样式配置对象
    const styleConfig = {
        // 通用样式（适用于所有页面）
        common: {
            // 页面主体样式
            'body': `
                min-width: 200px;  // 最小宽度限制
                max-width: 885px;  // 最大内容宽度
                margin: 30px auto; // 上下边距30px，水平居中
                font-size: 20px;
                line-height: 1.6;
                background: rgba(237, 239, 233, 0.84);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                overflow: auto;
            `,
            // 侧边导航栏样式
            '.SideNav': `
                background: rgba(255, 255, 255, 0.6); // 半透明白色背景
                border-radius: 10px; // 圆角效果
                min-width: unset;    // 重置最小宽度
            `,
            '.SideNav-item': `
                transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out;
            `,
            '.SideNav-item:hover': `
                background-color: #c3e4e3;
                border-radius: 10px;
                transform: scale(1.02);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            `,
            // 特殊文本块样式
            'div[style*="margin-bottom: 16px"]': `
                font-family:
                    '华文行楷',          /* Windows楷体 */
                    'STKaiti',           /* macOS楷体 */
                    'Noto Serif CJK SC', /* Linux楷体替代 */
                    'WenQuanYi Micro Hei',
                    serif;               /* 备用字体 */
                font-size: 1.4em;
                color: rgb(0, 0, 0);
                text-shadow:
                    2px 2px 4px rgba(107, 70, 70, 0.2),
                    -1px -1px 1px rgba(255, 255, 255, 0.5);
                letter-spacing: 0.1em;
                line-height: 1.8;
                margin-bottom: 16px !important;
            `
        },
        // 首页专属样式
        home: {
            '#header': `
                height: 300px; // 头部区域高度
            `,
            '#header h1': `
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
            `,
            '.avatar': `
                width: 200px;
                height: 200px;
            `,
            '#header h1 a': `
                margin-top: 30px;
                font-family: fantasy;
                margin-left: unset;
            `
        },
        // 文章页专属样式
        article: {
            'body': `
                max-width: 1000px;  
                margin: 30px auto;
                font-size: 16px;
                line-height: 1.25;
                background: rgba(237, 239, 233, 0.84);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                overflow: auto;
            `,
            'body .markdown-body': `
                 font-size: 18px !important;  
                line-height: 1.4 !important;
            `,
            // 隐藏issue按钮
            'a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"]': `
                display: none !important;
            `,
            // 文章标题样式（h1-h6）
            'body .markdown-body h1, body .markdown-body h2, body .markdown-body h3, body .markdown-body h4, body .markdown-body h5, body .markdown-body h6, h1.postTitle': `
                font-family: '华文新魏', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif !important;
                margin-top: 1.5em !important;
                margin-bottom: 0.8em !important;
                font-weight: 600 !important;
            `,
        },
        // 分页页样式（暂未实现）
        page: {}
    };

    const updateQuoteDiv = async () => {
        try {
            const response = await fetch('https://www.wniui.com/api/yiyan/index.php');
            const data = await response.json();
            const quoteDivs = document.querySelectorAll('div[style*="margin-bottom: 16px"]');
            
            quoteDivs.forEach(div => {
                div.textContent = data.data || "默认文本，API无返回时显示";
            });
        } catch (error) {
            console.error('获取名言API失败:', error);
        }
    };

    // 生成CSS字符串的函数
    const generateCSS = (styles) => {
        return Object.entries(styles)
            .map(([selector, rules]) => {
                // 格式化CSS规则：去除空格并确保以分号结尾
                const formattedRules = rules.trim().endsWith(';') 
                    ? rules.trim() 
                    : `${rules.trim()};`;
                return `${selector} { ${formattedRules} }`;
            })
            .join('\n');
    };

    // 检测当前页面类型（首页/文章/分页）
    const getPageType = () => {
        const routePatterns = [
            { type: 'home', pattern: /^(\/|\/index\.html)$/ },    // 首页路由
            { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ }, // 文章路由
            { type: 'page', pattern: /\/page\d+\.html$/ }          // 分页路由
        ];
        return routePatterns.find(p => p.pattern.test(currentPath))?.type;
    };

    // 应用样式的核心函数
    const applyStyles = () => {
        const pageType = getPageType();
        console.log(`当前页面类型: ${pageType || '通用'}`);

        // 合并通用样式和页面专属样式
        let mergedStyles = { ...styleConfig.common };
        if (pageType && styleConfig[pageType]) {
            mergedStyles = { ...mergedStyles, ...styleConfig[pageType] };
        }

        // 添加全局背景样式
        mergedStyles['html'] = `
            background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp')
                no-repeat center center fixed;
            background-size: cover;
            scroll-behavior: smooth;
        `;

        // 创建并插入样式标签
        const cssString = generateCSS(mergedStyles);
        if (cssString) {
            const styleTag = document.createElement('style');
            styleTag.textContent = cssString;
            document.head.appendChild(styleTag);
            console.log('桌面样式已成功应用');
        }
    };

    // 执行样式应用
    applyStyles();

    updateQuoteDiv();
});
