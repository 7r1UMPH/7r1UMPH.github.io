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
            // 链接样式
            'a': `
                color: #2980b9;
                text-decoration: none;
                transition: color 0.2s ease;
            `,
            'a:hover': `
                color: #3498db;
                text-decoration: underline;
            `,
            // 特殊文本块样式
            'div[style*="margin-bottom: 16px"]': `
                font-family: '华文行楷', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', serif;
                font-size: 1.4em;
                color: #34495e;
                text-shadow: 1px 1px 2px rgba(107, 70, 70, 0.2), -1px -1px 1px rgba(255, 255, 255, 0.5);
                letter-spacing: 0.1em;
                line-height: 1.8;
                margin: 25px auto !important;
                padding: 15px 20px;
                border-left: 4px solid #3498db;
                background: rgba(236, 240, 241, 0.7);
                border-radius: 0 8px 8px 0;
                max-width: 90%;
            `,
            // 代码块样式
            'pre, code': `
                background-color: #f8f9fa !important;
                border-radius: 6px;
                border: 1px solid #e9ecef;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            `,
            // 表格样式
            'table': `
                border-collapse: collapse;
                width: 100%;
                margin: 20px 0;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
            `,
            'th, td': `
                padding: 12px 15px;
                border: 1px solid #e9ecef;
            `,
            'th': `
                background-color: #3498db;
                color: white;
                font-weight: bold;
                text-align: left;
            `,
            'tr:nth-child(even)': `
                background-color: #f8f9fa;
            `,
            'tr:hover': `
                background-color: #eaf6fc;
            `
        },
        // 首页专属样式
        home: {
            '#header': `
                height: 320px;
                background: linear-gradient(160deg, rgba(52, 152, 219, 0.2) 0%, rgba(155, 89, 182, 0.2) 100%);
                border-radius: 12px;
                margin-bottom: 30px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
            `,
            '#header::before': `
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp') center/cover no-repeat;
                opacity: 0.15;
                z-index: 0;
            `,
            '#header h1': `
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 1;
            `,
            '.avatar': `
                width: 180px;
                height: 180px;
                border-radius: 50%;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                border: 4px solid white;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            `,
            '.avatar:hover': `
                transform: scale(1.05);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
            `,
            '#header h1 a': `
                margin-top: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin-left: unset;
                font-size: 1.8em;
                font-weight: bold;
                color: #2c3e50;
                text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
            `,
            // 文章列表样式
            '.Box-row': `
                transition: all 0.2s ease;
                border-radius: 8px;
                margin: 8px 0;
                border-left: 3px solid transparent;
            `,
            '.Box-row:hover': `
                background-color: #f5f9fc !important;
                transform: translateX(5px);
                border-left: 3px solid #3498db;
            `
        },
        // 文章页专属样式
        article: {
            'body': `
                max-width: 1000px;  
                margin: 40px auto;
                font-size: 17px;
                line-height: 1.6;
                background: rgba(250, 250, 250, 0.92);
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                overflow: auto;
                padding: 30px;
            `,
            'body .markdown-body': `
                font-size: 17px !important;  
                line-height: 1.6 !important;
                color: #333;
            `,
            // 隐藏issue按钮
            'a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"]': `
                display: none !important;
            `,
            // 文章标题样式（h1-h6）
            'body .markdown-body h1, body .markdown-body h2, body .markdown-body h3, body .markdown-body h4, body .markdown-body h5, body .markdown-body h6, h1.postTitle': `
                font-family: '华文新魏', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', sans-serif !important;
                margin-top: 1.8em !important;
                margin-bottom: 1em !important;
                font-weight: 600 !important;
                color: #2c3e50;
                padding-bottom: 0.3em;
                border-bottom: 1px solid #eaecef;
            `,
            // 二级标题特殊样式
            'body .markdown-body h2': `
                border-left: 4px solid #3498db;
                padding-left: 10px;
            `,
            // 段落样式
            'body .markdown-body p': `
                margin-bottom: 1.2em;
                text-align: justify;
            `,
            // 代码块样式
            'body .markdown-body pre': `
                background-color: #f6f8fa !important;
                border-radius: 8px;
                border: 1px solid #e1e4e8;
                padding: 16px;
                overflow: auto;
                margin: 16px 0;
                font-size: 14px;
            `,
            // 行内代码样式
            'body .markdown-body code:not([class])': `
                background-color: rgba(27, 31, 35, 0.05);
                border-radius: 3px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                padding: 2px 4px;
                font-size: 0.9em;
            `,
            // 引用块样式
            'body .markdown-body blockquote': `
                padding: 0 1em;
                color: #6a737d;
                border-left: 4px solid #3498db;
                background-color: #f6f8fa;
                border-radius: 0 4px 4px 0;
                margin: 20px 0;
            `,
            // 图片样式
            'body .markdown-body img': `
                max-width: 100%;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                margin: 16px 0;
                transition: transform 0.3s ease;
            `,
            'body .markdown-body img:hover': `
                transform: scale(1.01);
            `,
            // 目录样式
            '#toc': `
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                border-left: 3px solid #3498db;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            `,
            '#toc li': `
                margin: 5px 0;
            `,
            '#toc a': `
                color: #3498db;
                transition: color 0.2s, transform 0.2s;
                display: inline-block;
            `,
            '#toc a:hover': `
                color: #2980b9;
                transform: translateX(3px);
            `
        },
        // 分页页样式
        page: {
            '.paginate-container': `
                margin: 20px 0;
                display: flex;
                justify-content: center;
            `,
            '.paginate-container .pagination': `
                display: inline-flex;
                border-radius: 6px;
                overflow: hidden;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            `,
            '.paginate-container .page-item': `
                transition: all 0.2s ease;
            `,
            '.paginate-container .page-item a': `
                padding: 8px 12px;
                color: #2980b9;
                background-color: white;
                border: 1px solid #eaecef;
            `,
            '.paginate-container .page-item.selected a': `
                background-color: #3498db;
                color: white;
                border-color: #3498db;
            `,
            '.paginate-container .page-item:hover:not(.selected) a': `
                background-color: #f8f9fa;
            `
        }
    };

    const updateQuoteDiv = async () => {
        try {
            const response = await fetch('https://www.wniui.com/api/yiyan/index.php');
            const data = await response.json();
            const quoteDivs = document.querySelectorAll('div[style*="margin-bottom: 16px"]');
            
            quoteDivs.forEach(div => {
                div.textContent = data.data || "默认文本，API无返回时显示";
                // 添加引号装饰
                div.innerHTML = `"${div.textContent}"`;
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

    // 添加平滑滚动效果
    const addSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // 添加回到顶部按钮
    const addBackToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.setAttribute('title', '回到顶部');
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #3498db;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            display: none;
            opacity: 0.7;
            transition: opacity 0.3s, transform 0.3s;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(button);
        
        button.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.opacity = '0.7';
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
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
    addSmoothScrolling();
    addBackToTopButton();
});
