// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 移除GitHub跳转按钮，适用于所有设备
    const removeGithubButtons = () => {
        const githubButtons = document.querySelectorAll('a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"]');
        githubButtons.forEach(button => {
            button.style.display = 'none';
        });
    };
    
    // 执行移除GitHub按钮
    removeGithubButtons();
    
    // 检测是否为桌面设备（宽度≥768px）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    // 移动端优化
    const applyMobileOptimization = () => {
        // 检测是否为移动设备
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        
        if (isMobile) {
            // 创建汉堡菜单按钮
            const createHamburgerMenu = () => {
                const header = document.getElementById('header');
                if (!header || document.querySelector('.hamburger-menu')) return;
                
                const hamburger = document.createElement('div');
                hamburger.className = 'hamburger-menu';
                hamburger.innerHTML = `
                    <div class="hamburger-icon">
                    </div>
                `;
                
                header.appendChild(hamburger);
                
                // 创建侧边栏菜单
                const sidebar = document.createElement('div');
                sidebar.className = 'mobile-sidebar';
                
                // 复制顶部导航到侧边栏
                const navItems = document.querySelectorAll('#header a');
                let sidebarContent = '<div class="sidebar-close">×</div><div class="sidebar-links">';
                
                navItems.forEach(item => {
                    if (!item.href.includes('github.com/7r1UMPH/7r1UMPH.github.io/issues')) {
                        sidebarContent += `<a href="${item.href}">${item.textContent}</a>`;
                    }
                });
                
                sidebarContent += '</div>';
                sidebar.innerHTML = sidebarContent;
                document.body.appendChild(sidebar);
                
                // 点击汉堡菜单显示侧边栏
                hamburger.addEventListener('click', () => {
                    sidebar.classList.toggle('active');
                    document.body.classList.toggle('sidebar-open');
                });
                
                // 点击关闭按钮隐藏侧边栏
                const closeBtn = document.querySelector('.sidebar-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        sidebar.classList.remove('active');
                        document.body.classList.remove('sidebar-open');
                    });
                }
                
                // 点击外部区域关闭侧边栏
                document.addEventListener('click', (e) => {
                    if (sidebar.classList.contains('active') && 
                        !sidebar.contains(e.target) && 
                        !hamburger.contains(e.target)) {
                        sidebar.classList.remove('active');
                        document.body.classList.remove('sidebar-open');
                    }
                });
            };
            
            // 优化文章阅读体验
            const optimizeArticleReading = () => {
                const article = document.querySelector('.markdown-body');
                if (!article) return;
                
                // 创建返回顶部按钮
                const backToTop = document.createElement('div');
                backToTop.className = 'back-to-top';
                backToTop.innerHTML = '↑';
                document.body.appendChild(backToTop);
                
                // 监听滚动显示/隐藏返回顶部按钮
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 300) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                });
                
                // 点击返回顶部
                backToTop.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
                
                // 增加阅读进度条
                const progressBar = document.createElement('div');
                progressBar.className = 'reading-progress';
                document.body.appendChild(progressBar);
                
                window.addEventListener('scroll', () => {
                    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
                    const readPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
                    progressBar.style.width = readPercentage + '%';
                });
            };
            
            // 应用移动端特有样式
            const applyMobileStyles = () => {
                const styleTag = document.createElement('style');
                styleTag.textContent = `
                    /* 基础移动端样式 */
                    body {
                        padding: 0 !important;
                        margin: 0 !important;
                        font-size: 16px !important;
                        line-height: 1.5 !important;
                        background: rgba(237, 239, 233, 0.95) !important;
                        overflow-x: hidden !important;
                    }
                    
                    html {
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow-x: hidden !important;
                    }
                    
                    #content {
                        padding: 10px !important;
                        margin: 0 !important;
                    }
                    
                    /* 汉堡菜单样式 */
                    .hamburger-menu {
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        z-index: 1000;
                        cursor: pointer;
                    }
                    
                    .hamburger-icon {
                        width: 30px;
                        height: 24px;
                        position: relative;
                    }
                    
                    .hamburger-icon span {
                        display: block;
                        position: absolute;
                        height: 3px;
                        width: 100%;
                        background: #333;
                        border-radius: 3px;
                        left: 0;
                        transform-origin: center;
                        transition: 0.3s ease-in-out;
                    }
                    
                    .hamburger-icon span:nth-child(1) {
                        top: 0;
                    }
                    
                    .hamburger-icon span:nth-child(2) {
                        top: 10px;
                    }
                    
                    .hamburger-icon span:nth-child(3) {
                        top: 20px;
                    }
                    
                    /* 侧边栏菜单样式 */
                    .mobile-sidebar {
                        position: fixed;
                        top: 0;
                        right: -250px;
                        width: 250px;
                        height: 100%;
                        background: rgba(255, 255, 255, 0.95);
                        z-index: 1001;
                        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
                        transition: right 0.3s ease;
                        overflow-y: auto;
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                    }
                    
                    .mobile-sidebar.active {
                        right: 0;
                        display: block !important;
                    }
                    
                    .sidebar-close {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        font-size: 24px;
                        cursor: pointer;
                        width: 30px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        z-index: 1002;
                    }
                    
                    .sidebar-links {
                        padding: 50px 20px 20px;
                        display: flex;
                        flex-direction: column;
                        position: relative;
                        z-index: 1002;
                    }
                    
                    .sidebar-links a {
                        padding: 12px 5px;
                        color: #333;
                        text-decoration: none;
                        font-size: 18px;
                        border-bottom: 1px solid #eee;
                        display: block;
                        position: relative;
                        z-index: 1002;
                    }
                    
                    .sidebar-links a:hover {
                        background: #f0f0f0;
                        padding-left: 10px;
                    }
                    
                    /* 返回顶部按钮 */
                    .back-to-top {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        width: 40px;
                        height: 40px;
                        background: rgba(0, 0, 0, 0.6);
                        color: #fff;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 37px;
                        font-size: 24px;
                        cursor: pointer;
                        opacity: 0;
                        visibility: hidden;
                        transition: all 0.3s ease;
                        z-index: 999;
                    }
                    
                    .back-to-top.visible {
                        opacity: 1;
                        visibility: visible;
                    }
                    
                    /* 阅读进度条 */
                    .reading-progress {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 0;
                        height: 3px;
                        background: linear-gradient(to right, #4CAF50, #8BC34A);
                        z-index: 9999;
                        transition: width 0.1s linear;
                    }
                    
                    /* 文章样式优化 */
                    .markdown-body {
                        font-size: 16px !important;
                        line-height: 1.6 !important;
                    }
                    
                    .markdown-body h1, 
                    .markdown-body h2, 
                    .markdown-body h3, 
                    .markdown-body h4, 
                    .markdown-body h5, 
                    .markdown-body h6 {
                        margin-top: 1.5em !important;
                        margin-bottom: 0.8em !important;
                        font-weight: 600 !important;
                        line-height: 1.4 !important;
                    }
                    
                    .markdown-body h1 {
                        font-size: 1.8em !important;
                        border-bottom: 1px solid #eaecef;
                        padding-bottom: .3em;
                    }
                    
                    .markdown-body h2 {
                        font-size: 1.6em !important;
                        border-bottom: 1px solid #eaecef;
                        padding-bottom: .3em;
                    }
                    
                    .markdown-body p, 
                    .markdown-body ul, 
                    .markdown-body ol {
                        margin-bottom: 1em !important;
                    }
                    
                    .markdown-body img {
                        border-radius: 6px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                    
                    .markdown-body pre {
                        padding: 12px !important;
                        border-radius: 6px !important;
                        margin-bottom: 1em !important;
                    }
                    
                    /* 文章列表优化 */
                    .postItem {
                        background: rgba(255, 255, 255, 0.6);
                        padding: 15px;
                        margin-bottom: 15px;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }
                    
                    .postItem:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                    }
                    
                    /* 隐藏侧边栏 */
                    .stats-sidebar {
                        display: none !important;
                    }
                    
                    /* 页眉页脚优化 */
                    #header {
                        margin-top: 15px !important;
                        padding-bottom: 10px !important;
                    }
                    
                    #footer {
                        margin-top: 30px !important;
                        padding-top: 10px !important;
                        text-align: center;
                    }
                    
                    /* 标题文本优化 */
                    .postTitle {
                        font-size: 24px !important;
                        line-height: 1.3 !important;
                        margin-right: 30px !important;
                    }
                    
                    /* 隐藏GitHub图标按钮 */
                    a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"] {
                        display: none !important;
                    }
                `;
                document.head.appendChild(styleTag);
            };
            
            // 执行移动端优化
            createHamburgerMenu();
            optimizeArticleReading();
            applyMobileStyles();
        }
    };

    // 桌面样式应用
    if (isDesktop()) {
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
                `,
                // 隐藏GitHub图标按钮
                'a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"]': `
                    display: none !important;
                `
            },
            // 首页专属样式
            home: {
                '#header': `
                    height: 300px; // 头部区域高度
                    position: relative; // 确保定位正确
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                `,
                '#header h1': `
                    position: relative !important;
                    left: 0 !important;
                    transform: none !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    width: 100% !important;
                    z-index: 10 !important;
                `,
                '.avatar': `
                    width: 200px !important;
                    height: 200px !important;
                    display: block !important;
                    margin: 0 auto !important;
                    z-index: 10 !important;
                `,
                '#header h1 a': `
                    margin-top: 30px !important;
                    font-family: fantasy !important;
                    margin-left: unset !important;
                    display: block !important;
                `,
                // 添加统计信息侧边栏样式
                '.stats-sidebar': `
                    position: fixed !important;
                    left: 20px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    background: rgba(255, 255, 255, 0.9) !important;
                    padding: 20px !important;
                    border-radius: 10px !important;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
                    width: 200px !important;
                    z-index: 100 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    gap: 15px !important;
                `,
                '.stats-avatar': `
                    width: 100px !important;
                    height: 100px !important;
                    border-radius: 50% !important;
                    overflow: hidden !important;
                    margin-bottom: 10px !important;
                `,
                '.stats-avatar img': `
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                `,
                '.stats-item': `
                    font-size: 14px !important;
                    color: #333 !important;
                    text-align: center !important;
                    width: 100% !important;
                    padding: 5px 0 !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
                `,
                '.stats-item:last-child': `
                    border-bottom: none !important;
                `,
                '.stats-item span': `
                    color: #0969da !important;
                    font-weight: bold !important;
                `,
                // 确保网页信息栏显示
                '.postTitle': `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    text-align: center !important;
                    margin-top: 20px !important;
                    font-size: 24px !important;
                    color: #333 !important;
                `,
                // 添加网站信息栏样式
                'div[style*="margin-bottom: 16px"]': `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    text-align: center !important;
                    margin: 20px auto !important;
                    padding: 15px !important;
                    background: rgba(255, 255, 255, 0.7) !important;
                    border-radius: 8px !important;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
                    font-size: 18px !important;
                    line-height: 1.6 !important;
                    max-width: 80% !important;
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
                // 添加统计信息侧边栏样式（与首页相同）
                '.stats-sidebar': `
                    position: fixed !important;
                    left: 20px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    background: rgba(255, 255, 255, 0.9) !important;
                    padding: 20px !important;
                    border-radius: 10px !important;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
                    width: 200px !important;
                    z-index: 100 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    gap: 15px !important;
                `,
                '.stats-avatar': `
                    width: 100px !important;
                    height: 100px !important;
                    border-radius: 50% !important;
                    overflow: hidden !important;
                    margin-bottom: 10px !important;
                `,
                '.stats-avatar img': `
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                `,
                '.stats-item': `
                    font-size: 14px !important;
                    color: #333 !important;
                    text-align: center !important;
                    width: 100% !important;
                    padding: 5px 0 !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
                `,
                '.stats-item:last-child': `
                    border-bottom: none !important;
                `,
                '.stats-item span': `
                    color: #0969da !important;
                    font-weight: bold !important;
                `
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
            const pageType = routePatterns.find(p => p.pattern.test(currentPath))?.type;
            console.log('当前路径:', currentPath, '检测到的页面类型:', pageType);
            return pageType;
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
            
            // 创建统计信息侧边栏的函数
            const createStatsSidebar = () => {
                // 检查是否已存在侧边栏，如果存在则移除
                const existingSidebar = document.querySelector('.stats-sidebar');
                if (existingSidebar) {
                    existingSidebar.remove();
                }
                
                const sidebar = document.createElement('div');
                sidebar.className = 'stats-sidebar';
                sidebar.innerHTML = `
                    <div class="stats-avatar">
                        <img src="https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png" alt="头像" onload="localStorage.setItem('blogAvatar', this.src)">
                    </div>
                    <div class="stats-item">网站已运行 <span id="runday">197</span> 天</div>
                    <div class="stats-item">本站总访问量 <span id="busuanzi_value_site_pv">1485</span> 次</div>
                    <div class="stats-item">本站总访客数 <span id="busuanzi_value_site_uv">491</span> 人</div>
                    <div class="stats-item">本文总阅读量 <span id="busuanzi_value_page_pv">42</span> 次</div>
                `;
                document.body.appendChild(sidebar);
            };

            // 在所有页面都创建侧边栏
            setTimeout(createStatsSidebar, 100);
            
            // 确保首页信息栏显示
            if (pageType === 'home') {
                mergedStyles['.postTitle'] = `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    text-align: center !important;
                    margin-top: 20px !important;
                    font-size: 24px !important;
                    color: #333 !important;
                `;
                mergedStyles['#header h1'] = `
                    position: relative !important;
                    left: 0 !important;
                    transform: none !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    width: 100% !important;
                    z-index: 10 !important;
                `;
                mergedStyles['.avatar'] = `
                    width: 200px !important;
                    height: 200px !important;
                    display: block !important;
                    margin: 0 auto !important;
                    z-index: 10 !important;
                `;
                mergedStyles['div[style*="margin-bottom: 16px"]'] = `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    text-align: center !important;
                    margin: 20px auto !important;
                    padding: 15px !important;
                    background: rgba(255, 255, 255, 0.7) !important;
                    border-radius: 8px !important;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
                    font-size: 18px !important;
                    line-height: 1.6 !important;
                    max-width: 80% !important;
                `;
            }

            // 创建并插入样式标签
            const cssString = generateCSS(mergedStyles);
            if (cssString) {
                const styleTag = document.createElement('style');
                styleTag.textContent = cssString;
                document.head.appendChild(styleTag);
                console.log('桌面样式已成功应用');
            }
            
            // 直接操作DOM确保首页信息栏显示
            if (pageType === 'home') {
                setTimeout(() => {
                    const postTitles = document.querySelectorAll('.postTitle');
                    postTitles.forEach(title => {
                        title.style.display = 'block';
                        title.style.visibility = 'visible';
                        title.style.opacity = '1';
                        title.style.textAlign = 'center';
                        title.style.marginTop = '20px';
                        title.style.fontSize = '24px';
                        title.style.color = '#333';
                    });
                    
                    const headerH1 = document.querySelector('#header h1');
                    if (headerH1) {
                        headerH1.style.position = 'relative';
                        headerH1.style.left = '0';
                        headerH1.style.transform = 'none';
                        headerH1.style.display = 'flex';
                        headerH1.style.flexDirection = 'column';
                        headerH1.style.alignItems = 'center';
                        headerH1.style.width = '100%';
                        headerH1.style.zIndex = '10';
                    }
                    
                    const avatar = document.querySelector('.avatar');
                    if (avatar) {
                        avatar.style.width = '200px';
                        avatar.style.height = '200px';
                        avatar.style.display = 'block';
                        avatar.style.margin = '0 auto';
                        avatar.style.zIndex = '10';
                    }
                    
                    // 确保网站信息栏显示
                    const infoBars = document.querySelectorAll('div[style*="margin-bottom: 16px"]');
                    infoBars.forEach(bar => {
                        bar.style.display = 'block';
                        bar.style.visibility = 'visible';
                        bar.style.opacity = '1';
                        bar.style.textAlign = 'center';
                        bar.style.margin = '20px auto';
                        bar.style.padding = '15px';
                        bar.style.background = 'rgba(255, 255, 255, 0.7)';
                        bar.style.borderRadius = '8px';
                        bar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                        bar.style.fontSize = '18px';
                        bar.style.lineHeight = '1.6';
                        bar.style.maxWidth = '80%';
                    });
                }, 100);
            }
        };

        // 执行样式应用
        applyStyles();

        updateQuoteDiv();
    } else {
        // 不是桌面版，应用移动端优化
        applyMobileOptimization();
    }
    
    // 监听窗口大小变化，适应移动端/桌面端切换
    window.addEventListener('resize', () => {
        // 如果窗口大小变化导致设备类型改变，刷新页面以应用对应样式
        const currentIsDesktop = isDesktop();
        const wasDesktop = document.body.classList.contains('desktop-applied');
        
        if ((currentIsDesktop && !wasDesktop) || (!currentIsDesktop && wasDesktop)) {
            location.reload();
        }
    });
    
    // 标记当前设备类型
    document.body.classList.toggle('desktop-applied', isDesktop());
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
