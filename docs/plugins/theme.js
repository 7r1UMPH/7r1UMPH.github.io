// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 检测是否为桌面设备（宽度≥768px）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
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
                min-width: 200px;
                max-width: 900px;
                margin: 40px auto;
                font-size: 18px;
                line-height: 1.6;
                background: rgba(250, 250, 250, 0.92);
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                overflow: auto;
                transition: all 0.3s ease;
                padding: 20px;
            `,
            // 侧边导航栏样式
            '.SideNav': `
                background: rgba(255, 255, 255, 0.8);
                border-radius: 12px;
                min-width: unset;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                padding: 10px;
                border-left: 3px solid #3498db;
            `,
            '.SideNav-item': `
                transition: all 0.2s ease-in-out;
                margin: 5px 0;
                border-radius: 8px;
                padding: 8px 12px;
            `,
            '.SideNav-item:hover': `
                background-color: #eaf6fc;
                transform: translateX(5px) scale(1.02);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
                padding: 15px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.5);
            `,
            // 链接样式统一
            'a': `
                transition: all 0.2s ease;
                text-decoration: none;
                color: #3498db;
            `,
            'a:hover': `
                color: #2980b9;
                text-decoration: underline;
            `,
            // 代码块样式
            'pre': `
                background: rgba(245, 247, 250, 0.95) !important;
                border-radius: 8px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1) !important;
                border: 1px solid rgba(0, 0, 0, 0.1) !important;
            `,
            'pre code': `
                font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace !important;
                font-size: 15px !important;
                line-height: 1.5 !important;
                color: #333 !important;
            `,
            // 表格样式
            'table': `
                border-collapse: collapse;
                width: 100%;
                margin: 20px 0;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `,
            'th, td': `
                border: 1px solid #ddd;
                padding: 12px;
            `,
            'th': `
                background-color: #eaf6fc;
                color: #333;
            `,
            'tr:nth-child(even)': `
                background-color: #f9f9f9;
            `,
            // 图片样式
            'img': `
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                transition: all 0.2s ease;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                display: block;
                margin: 1.5em auto;
                object-fit: contain;
                background: #fff;
                padding: 5px;
            `,
            'img:hover': `
                transform: scale(1.02);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            `
        },
        // 首页专属样式
        home: {
            '#header': `
                height: 300px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-bottom: 30px;
            `,
            '#header h1': `
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 20px;
            `,
            '.avatar': `
                width: 180px;
                height: 180px;
                border-radius: 50%;
                border: 5px solid rgba(255, 255, 255, 0.8);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            `,
            '.avatar:hover': `
                transform: scale(1.05);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            `,
            '#header h1 a': `
                margin-top: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 2.2em;
                color: #2c3e50;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            `,
            '.postDesc': `
                background: rgba(255, 255, 255, 0.7);
                border-radius: 8px;
                padding: 10px 15px;
                margin-bottom: 20px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                transition: all 0.2s ease;
            `,
            '.postDesc:hover': `
                background: rgba(255, 255, 255, 0.9);
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
            `
        },
        // 文章页专属样式
        article: {
            'body': `
                max-width: 1000px;  
                margin: 30px auto;
                font-size: 17px;
                line-height: 1.6;
                background: rgba(250, 250, 250, 0.92);
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                overflow: auto;
                padding: 25px;
            `,
            'body .markdown-body': `
                font-size: 18px !important;  
                line-height: 1.5 !important;
            `,
            // 隐藏issue按钮
            'a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"]': `
                display: none !important;
            `,
            // 文章标题样式（h1-h6）
            'body .markdown-body h1, body .markdown-body h2, body .markdown-body h3, body .markdown-body h4, body .markdown-body h5, body .markdown-body h6, h1.postTitle': `
                font-family: '华文新魏', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif !important;
                margin-top: 1.8em !important;
                margin-bottom: 0.9em !important;
                font-weight: 600 !important;
                color: #2c3e50;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                padding-bottom: 0.3em;
            `,
            'h1.postTitle': `
                text-align: center;
                font-size: 2.2em !important;
                margin-bottom: 20px !important;
                color: #2c3e50;
            `,
            // 代码高亮
            '.hljs': `
                padding: 15px !important;
                font-family: 'Consolas', 'Source Code Pro', monospace !important;
                font-size: 0.95em !important;
            `,
            // 引用块样式
            'blockquote': `
                border-left: 4px solid #3498db !important;
                background: rgba(236, 240, 241, 0.5) !important;
                padding: 15px 20px !important;
                margin: 15px 0 !important;
                border-radius: 0 8px 8px 0 !important;
            `
        },
        // 分页页样式
        page: {
            '.pagination': `
                display: flex;
                justify-content: center;
                margin: 30px 0;
            `,
            '.page-item': `
                margin: 0 5px;
                border-radius: 5px;
                overflow: hidden;
            `,
            '.page-link': `
                padding: 8px 15px;
                background: rgba(255, 255, 255, 0.7);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                transition: all 0.2s ease;
            `,
            '.page-link:hover': `
                background: rgba(52, 152, 219, 0.1);
                color: #3498db;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
            `,
            '.active .page-link': `
                background: #3498db;
                color: white;
            `
        },
        // 暗色模式样式
        dark: {
            'body': `
                background: rgba(40, 44, 52, 0.92);
                color: #e0e0e0;
            `,
            'a': `
                color: #61dafb;
            `,
            'a:hover': `
                color: #a2ecff;
            `,
            '.SideNav': `
                background: rgba(45, 50, 60, 0.8);
                border-left: 3px solid #61dafb;
            `,
            '.SideNav-item:hover': `
                background-color: rgba(97, 218, 251, 0.1);
            `,
            'div[style*="margin-bottom: 16px"]': `
                background: rgba(45, 50, 60, 0.5);
                color: #e0e0e0;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            `,
            'th': `
                background-color: #3a3f4b;
                color: #e0e0e0;
            `,
            'tr:nth-child(even)': `
                background-color: #32363f;
            `,
            'td': `
                border-color: #4a4f59;
            `,
            'blockquote': `
                background: rgba(45, 50, 60, 0.5) !important;
            `,
            '.postDesc': `
                background: rgba(45, 50, 60, 0.7);
            `,
            'h1.postTitle, body .markdown-body h1, body .markdown-body h2, body .markdown-body h3, body .markdown-body h4, body .markdown-body h5, body .markdown-body h6': `
                color: #61dafb;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `,
            '.dark-mode pre': `
                background: rgba(40, 44, 52, 0.9) !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
            `,
            '.dark-mode pre code': `
                color: #e6e6e6 !important;
            `,
            '.dark-mode img': `
                background: #333;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
            `
        }
    };

    // 添加平滑滚动功能
    const addSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // 更新URL，但不滚动
                    history.pushState(null, null, this.getAttribute('href'));
                }
            });
        });
    };

    // 添加回到顶部按钮
    const addBackToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
        button.id = 'back-to-top';
        button.title = '回到顶部';
        document.body.appendChild(button);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(52, 152, 219, 0.8);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1000;
            }
            #back-to-top:hover {
                background: rgba(52, 152, 219, 1);
                transform: translateY(-3px);
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
            }
            #back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            .dark-mode #back-to-top {
                background: rgba(97, 218, 251, 0.8);
            }
            .dark-mode #back-to-top:hover {
                background: rgba(97, 218, 251, 1);
            }
        `;
        document.head.appendChild(style);

        // 显示/隐藏按钮
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });

        // 点击事件
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // 暗色模式切换功能
    const addDarkModeToggle = () => {
        // 创建切换按钮
        const darkModeToggle = document.createElement('button');
        darkModeToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
        darkModeToggle.id = 'dark-mode-toggle';
        darkModeToggle.title = '切换暗色/亮色模式';
        document.body.appendChild(darkModeToggle);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #dark-mode-toggle {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(52, 152, 219, 0.8);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 1000;
            }
            #dark-mode-toggle:hover {
                transform: rotate(30deg);
                background: rgba(52, 152, 219, 1);
            }
            .dark-mode {
                background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp') no-repeat center center fixed !important;
                background-size: cover !important;
                filter: brightness(0.8) !important;
            }
            .dark-mode #dark-mode-toggle {
                background: rgba(97, 218, 251, 0.8);
            }
            .dark-mode img {
                filter: brightness(0.9);
            }
        `;
        document.head.appendChild(style);

        // 检查本地存储的暗色模式状态
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        }

        // 点击事件
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            const isDark = document.documentElement.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            
            // 切换图标
            darkModeToggle.innerHTML = isDark ? 
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>` :
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>`;
        });
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

        // 判断是否为暗色模式
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
            // 合并暗色模式样式
            mergedStyles = { ...mergedStyles, ...styleConfig.dark };
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
    
    // 添加功能增强
    addSmoothScrolling();
    addBackToTopButton();
    addDarkModeToggle();
    updateQuoteDiv();

    // 添加全文搜索功能
    const addFullTextSearch = () => {
        // 仅在标签页添加全文搜索
        if (!window.location.pathname.includes('/tag.html')) {
            return;
        }
        
        // 创建搜索框
        const searchContainer = document.createElement('div');
        searchContainer.className = 'full-text-search';
        searchContainer.innerHTML = `
            <div class="search-header">
                <input type="text" id="fullTextSearchInput" placeholder="在所有文章中搜索..." />
                <button id="searchButton">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>
            <div id="searchResults" class="search-results"></div>
        `;
        
        // 插入到页面
        const mainContent = document.getElementById('content');
        if (mainContent) {
            mainContent.insertBefore(searchContainer, mainContent.firstChild);
        }
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .full-text-search {
                margin-bottom: 25px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
            }
            
            .full-text-search:focus-within {
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
            }
            
            .search-header {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            #fullTextSearchInput {
                flex: 1;
                padding: 12px 15px;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                font-size: 16px;
                transition: all 0.2s ease;
                background: rgba(255, 255, 255, 0.9);
            }
            
            #fullTextSearchInput:focus {
                outline: none;
                border-color: #3498db;
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
            }
            
            #searchButton {
                background: #3498db;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 15px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            #searchButton:hover {
                background: #2980b9;
            }
            
            .search-results {
                margin-top: 20px;
                max-height: 400px;
                overflow-y: auto;
                border-radius: 8px;
            }
            
            .search-result-item {
                padding: 15px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                transition: all 0.2s ease;
            }
            
            .search-result-item:hover {
                background: rgba(52, 152, 219, 0.05);
            }
            
            .search-result-item a {
                color: #2c3e50;
                font-weight: bold;
                font-size: 18px;
                display: block;
                margin-bottom: 8px;
                text-decoration: none;
            }
            
            .search-result-item a:hover {
                color: #3498db;
            }
            
            .search-result-item p {
                color: #555;
                font-size: 14px;
                margin: 0;
            }
            
            .search-result-item .highlight {
                background: rgba(255, 235, 59, 0.4);
                padding: 0 2px;
                border-radius: 2px;
            }
            
            .search-result-meta {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 8px;
                font-size: 12px;
                color: #7f8c8d;
            }
            
            .search-result-meta .date {
                background: rgba(52, 152, 219, 0.1);
                padding: 3px 8px;
                border-radius: 4px;
                color: #3498db;
            }
            
            .search-result-meta .tag {
                background: rgba(46, 204, 113, 0.1);
                padding: 3px 8px;
                border-radius: 4px;
                color: #27ae60;
            }
            
            .not-found {
                text-align: center;
                padding: 30px;
                color: #7f8c8d;
            }
            
            /* 暗黑模式 */
            .dark-mode .full-text-search {
                background: rgba(40, 44, 52, 0.8);
            }
            
            .dark-mode #fullTextSearchInput {
                background: rgba(30, 34, 42, 0.9);
                border-color: rgba(255, 255, 255, 0.1);
                color: #e0e0e0;
            }
            
            .dark-mode .search-result-item {
                border-bottom-color: rgba(255, 255, 255, 0.05);
            }
            
            .dark-mode .search-result-item a {
                color: #e0e0e0;
            }
            
            .dark-mode .search-result-item p {
                color: #bbb;
            }
            
            .dark-mode .search-result-meta {
                color: #aaa;
            }
            
            .dark-mode .search-result-meta .date {
                background: rgba(97, 218, 251, 0.1);
                color: #61dafb;
            }
            
            .dark-mode .search-result-meta .tag {
                background: rgba(85, 188, 120, 0.1);
                color: #55bc78;
            }
            
            .dark-mode .not-found {
                color: #aaa;
            }
        `;
        document.head.appendChild(style);
        
        // 加载文章数据
        const fetchPostList = async () => {
            try {
                const response = await fetch('/postList.json');
                if (!response.ok) {
                    throw new Error('无法加载文章列表');
                }
                return await response.json();
            } catch (error) {
                console.error('加载文章列表错误:', error);
                return [];
            }
        };
        
        // 执行搜索
        const performSearch = async (query) => {
            if (!query.trim()) {
                return;
            }
            
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = '<div class="loading">正在搜索...</div>';
            
            const postList = await fetchPostList();
            const results = [];
            
            // 简单全文搜索
            const searchQuery = query.trim().toLowerCase();
            
            for (const post of postList) {
                // 搜索标题和摘要
                const titleMatch = post.title.toLowerCase().includes(searchQuery);
                const summaryMatch = post.summary && post.summary.toLowerCase().includes(searchQuery);
                
                if (titleMatch || summaryMatch) {
                    // 高亮显示匹配内容
                    let titleHighlighted = post.title;
                    let summaryHighlighted = post.summary || '';
                    
                    if (titleMatch) {
                        titleHighlighted = highlightText(post.title, searchQuery);
                    }
                    
                    if (summaryMatch) {
                        summaryHighlighted = highlightText(post.summary, searchQuery);
                    }
                    
                    results.push({
                        ...post,
                        titleHighlighted,
                        summaryHighlighted
                    });
                }
            }
            
            // 显示结果
            if (results.length > 0) {
                searchResults.innerHTML = results.map(post => `
                    <div class="search-result-item">
                        <a href="${post.url}">${post.titleHighlighted}</a>
                        <p>${post.summaryHighlighted.length > 200 ? post.summaryHighlighted.substring(0, 200) + '...' : post.summaryHighlighted}</p>
                        <div class="search-result-meta">
                            <span class="date">${post.date}</span>
                            ${post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                        </div>
                    </div>
                `).join('');
            } else {
                searchResults.innerHTML = '<div class="not-found">没有找到匹配的内容，请尝试其他关键词。</div>';
            }
        };
        
        // 高亮显示匹配文本
        const highlightText = (text, query) => {
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        };
        
        // 绑定事件
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('fullTextSearchInput');
        
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                performSearch(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch(searchInput.value);
                }
            });
            
            // 从URL参数中获取搜索词
            const urlParams = new URLSearchParams(window.location.search);
            const queryParam = urlParams.get('q');
            
            if (queryParam) {
                searchInput.value = queryParam;
                performSearch(queryParam);
            }
        }
    };

    // 添加相关文章推荐功能
    const addRelatedPosts = () => {
        // 仅在文章页添加相关文章
        if (!window.location.pathname.includes('/post/')) {
            return;
        }
        
        // 创建相关文章容器
        const relatedPostsContainer = document.createElement('div');
        relatedPostsContainer.className = 'related-posts';
        relatedPostsContainer.innerHTML = `
            <h3 class="related-posts-title">相关文章推荐</h3>
            <div id="relatedPostsContent" class="related-posts-content">
                <div class="loading">正在加载相关文章...</div>
            </div>
        `;
        
        // 获取当前文章信息
        const currentPath = window.location.pathname;
        const currentTitle = document.querySelector('h1.postTitle')?.textContent || '';
        const currentTags = Array.from(document.querySelectorAll('.Label.LabelName a')).map(el => el.textContent);
        
        // 插入到页面
        const postBody = document.getElementById('postBody');
        if (postBody) {
            postBody.parentNode.insertBefore(relatedPostsContainer, postBody.nextSibling);
        }
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .related-posts {
                margin-top: 40px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            
            .related-posts-title {
                font-size: 20px;
                margin-bottom: 15px;
                color: #2c3e50;
                border-bottom: 2px solid rgba(52, 152, 219, 0.2);
                padding-bottom: 8px;
            }
            
            .related-posts-content {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                gap: 15px;
            }
            
            .related-post-item {
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.7);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                transition: all 0.2s ease;
                overflow: hidden;
            }
            
            .related-post-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .related-post-link {
                display: block;
                padding: 15px;
                text-decoration: none;
                color: inherit;
            }
            
            .related-post-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #2c3e50;
                transition: color 0.2s ease;
            }
            
            .related-post-item:hover .related-post-title {
                color: #3498db;
            }
            
            .related-post-meta {
                display: flex;
                font-size: 12px;
                color: #7f8c8d;
            }
            
            .related-post-date {
                margin-right: 10px;
            }
            
            .loading {
                padding: 20px;
                text-align: center;
                color: #7f8c8d;
            }
            
            .no-related {
                padding: 20px;
                text-align: center;
                color: #7f8c8d;
                grid-column: 1 / -1;
            }
            
            /* 暗黑模式 */
            .dark-mode .related-posts {
                background: rgba(40, 44, 52, 0.8);
            }
            
            .dark-mode .related-posts-title {
                color: #e0e0e0;
                border-bottom-color: rgba(97, 218, 251, 0.2);
            }
            
            .dark-mode .related-post-item {
                background: rgba(40, 44, 52, 0.7);
            }
            
            .dark-mode .related-post-title {
                color: #e0e0e0;
            }
            
            .dark-mode .related-post-item:hover .related-post-title {
                color: #61dafb;
            }
            
            .dark-mode .related-post-meta,
            .dark-mode .loading,
            .dark-mode .no-related {
                color: #aaa;
            }
        `;
        document.head.appendChild(style);
        
        // 加载文章数据并找出相关文章
        const loadRelatedPosts = async () => {
            try {
                const response = await fetch('/postList.json');
                if (!response.ok) {
                    throw new Error('无法加载文章列表');
                }
                
                const postList = await response.json();
                const relatedPosts = findRelatedPosts(postList, currentPath, currentTitle, currentTags);
                
                // 显示相关文章
                const relatedPostsContent = document.getElementById('relatedPostsContent');
                
                if (relatedPosts.length > 0) {
                    relatedPostsContent.innerHTML = relatedPosts.map(post => `
                        <div class="related-post-item">
                            <a href="${post.url}" class="related-post-link">
                                <div class="related-post-title">${post.title}</div>
                                <div class="related-post-meta">
                                    <span class="related-post-date">${post.date}</span>
                                    ${post.similarity ? `<span>相似度: ${Math.round(post.similarity * 100)}%</span>` : ''}
                                </div>
                            </a>
                        </div>
                    `).join('');
                } else {
                    relatedPostsContent.innerHTML = '<div class="no-related">没有找到相关文章</div>';
                }
                
            } catch (error) {
                console.error('加载相关文章错误:', error);
                document.getElementById('relatedPostsContent').innerHTML = '<div class="no-related">加载相关文章时出错</div>';
            }
        };
        
        // 查找相关文章
        const findRelatedPosts = (postList, currentPath, currentTitle, currentTags) => {
            // 过滤掉当前文章
            const otherPosts = postList.filter(post => post.url !== currentPath);
            
            // 计算每篇文章与当前文章的相关性
            const relatedPosts = otherPosts.map(post => {
                let similarity = 0;
                
                // 标题相似度（简单匹配关键词）
                const postTitle = post.title.toLowerCase();
                const titleWords = currentTitle.toLowerCase().split(/\s+/).filter(word => word.length > 2);
                
                titleWords.forEach(word => {
                    if (postTitle.includes(word)) {
                        similarity += 0.3; // 标题匹配权重较高
                    }
                });
                
                // 标签匹配
                const postTags = post.tags || [];
                const commonTags = currentTags.filter(tag => postTags.includes(tag));
                
                similarity += commonTags.length * 0.4; // 每个共同标签增加相关性
                
                return {
                    ...post,
                    similarity
                };
            });
            
            // 按相关性排序并返回前5个
            return relatedPosts
                .filter(post => post.similarity > 0)
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, 5);
        };
        
        // 加载相关文章
        loadRelatedPosts();
    };

    // 添加新功能
    addFullTextSearch();
    addRelatedPosts();
});
