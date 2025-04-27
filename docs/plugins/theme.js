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
    
    // 添加移动端优化函数
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
                        <span></span>
                        <span></span>
                        <span></span>
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
                        padding: 10px !important;
                        font-size: 16px !important;
                        line-height: 1.5 !important;
                        background: rgba(237, 239, 233, 0.95) !important;
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
                    }
                    
                    .sidebar-links {
                        padding: 50px 20px 20px;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .sidebar-links a {
                        padding: 12px 5px;
                        color: #333;
                        text-decoration: none;
                        font-size: 18px;
                        border-bottom: 1px solid #eee;
                        transition: all 0.2s ease;
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
            
        } else {
            // 桌面版样式
            applyDesktopStyles();
        }
    };
    
    // 桌面版样式
    const applyDesktopStyles = () => {
        // 获取当前页面路径
        const currentPath = window.location.pathname;

        // 样式配置对象
        const styleConfig = {
            // 通用样式（适用于所有页面）
            common: {
                // 页面主体样式
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
                    transition: all 0.3s ease;
                `,
                // 侧边导航栏样式
                '.SideNav': `
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 10px;
                    min-width: unset;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                `,
                '.SideNav-item': `
                    transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out;
                    border-radius: 6px;
                    margin: 5px 0;
                `,
                '.SideNav-item:hover': `
                    background-color: #c3e4e3;
                    border-radius: 6px;
                    transform: scale(1.02);
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                `,
                // 特殊文本块样式
                'div[style*="margin-bottom: 16px"]': `
                    font-family:
                        '华文行楷',
                        'STKaiti',
                        'Noto Serif CJK SC',
                        'WenQuanYi Micro Hei',
                        serif;
                    font-size: 1.4em;
                    color: rgb(0, 0, 0);
                    text-shadow:
                        2px 2px 4px rgba(107, 70, 70, 0.2),
                        -1px -1px 1px rgba(255, 255, 255, 0.5);
                    letter-spacing: 0.1em;
                    line-height: 1.8;
                    margin-bottom: 16px !important;
                `,
                // 添加卡片式设计
                '.Box': `
                    border-radius: 8px !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
                    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                    overflow: hidden !important;
                `,
                '.Box:hover': `
                    transform: translateY(-3px) !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
                `,
                // 按钮美化
                '.btn': `
                    border-radius: 6px !important;
                    transition: all 0.2s ease !important;
                    font-weight: 500 !important;
                `,
                '.btn:hover': `
                    transform: translateY(-1px) !important;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
                `,
                // 隐藏GitHub跳转按钮
                'a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"]': `
                    display: none !important;
                `
            },
            // 首页专属样式
            home: {
                '#header': `
                    height: 300px;
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
                    border-radius: 50%;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                `,
                '.avatar:hover': `
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
                `,
                '#header h1 a': `
                    margin-top: 30px;
                    font-family: fantasy;
                    margin-left: unset;
                    transition: all 0.3s ease;
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
                // 文章标题样式（h1-h6）
                'body .markdown-body h1, body .markdown-body h2, body .markdown-body h3, body .markdown-body h4, body .markdown-body h5, body .markdown-body h6, h1.postTitle': `
                    font-family: '华文新魏', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif !important;
                    margin-top: 1.5em !important;
                    margin-bottom: 0.8em !important;
                    font-weight: 600 !important;
                `,
                // 美化代码块
                'pre.notranslate': `
                    border-radius: 8px !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                    margin: 16px 0 !important;
                `,
                // 美化图片
                '.markdown-body img': `
                    border-radius: 8px !important;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1) !important;
                    transition: transform 0.3s ease !important;
                `,
                '.markdown-body img:hover': `
                    transform: scale(1.02) !important;
                `
            },
            // 分页页样式
            page: {
                '.pagination-container': `
                    display: flex;
                    justify-content: center;
                    margin: 20px 0;
                `,
                '.pagination-item': `
                    border-radius: 6px;
                    margin: 0 4px;
                    transition: all 0.2s ease;
                `,
                '.pagination-item:hover': `
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                `
            }
        };

        // 生成CSS字符串的函数
        const generateCSS = (styles) => {
            return Object.entries(styles)
                .map(([selector, rules]) => {
                    // 格式化CSS规则
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
                { type: 'home', pattern: /^(\/|\/index\.html)$/ },
                { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ },
                { type: 'page', pattern: /\/page\d+\.html$/ }
            ];
            return routePatterns.find(p => p.pattern.test(currentPath))?.type;
        };

        // 合并通用样式和页面专属样式
        let mergedStyles = { ...styleConfig.common };
        const pageType = getPageType();
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

        // 添加桌面特有功能
        const addDesktopFeatures = () => {
            // 添加返回顶部按钮
            const backToTop = document.createElement('div');
            backToTop.className = 'back-to-top desktop';
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
            
            // 桌面版返回顶部按钮样式
            const topBtnStyle = document.createElement('style');
            topBtnStyle.textContent = `
                .back-to-top.desktop {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background: rgba(0, 0, 0, 0.7);
                    color: #fff;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 45px;
                    font-size: 28px;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    z-index: 999;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                }
                
                .back-to-top.desktop.visible {
                    opacity: 1;
                    visibility: visible;
                }
                
                .back-to-top.desktop:hover {
                    background: rgba(0, 0, 0, 0.85);
                    transform: translateY(-3px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
            `;
            document.head.appendChild(topBtnStyle);
        };
        
        // 创建并插入样式标签
        const cssString = generateCSS(mergedStyles);
        if (cssString) {
            const styleTag = document.createElement('style');
            styleTag.textContent = cssString;
            document.head.appendChild(styleTag);
        }
        
        // 添加桌面特有功能
        addDesktopFeatures();
        
        // 尝试更新引用文本
        updateQuoteDiv();
    };
    
    // 更新引用文本
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
    
    // 根据屏幕大小应用不同样式
    const applyResponsiveStyles = () => {
        applyMobileOptimization();
        
        // 监听窗口大小变化，动态调整样式
        window.addEventListener('resize', () => {
            applyMobileOptimization();
        });
    };
    
    // 执行响应式样式应用
    applyResponsiveStyles();
});
