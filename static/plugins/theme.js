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
                background: rgba(40, 44, 52, 0.95) !important;
                border-radius: 8px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2) !important;
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
                border-radius: 8px;
                transition: transform 0.2s ease;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            `,
            'img:hover': `
                transform: scale(1.02);
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
});
