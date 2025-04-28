// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 检测是否为桌面设备（宽度≥768px）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

    // 无论设备类型如何，始终隐藏 GitHub Issue 按钮
    const hideIssueButtonRule = `
        a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"] {
            display: none !important;
        }
    `;
    const issueButtonStyleTag = document.createElement('style');
    issueButtonStyleTag.textContent = hideIssueButtonRule;
    document.head.appendChild(issueButtonStyleTag);
    console.log('GitHub Issue 按钮隐藏规则已全局应用');

    // 获取当前页面路径
    const currentPath = window.location.pathname;

    // 桌面端样式配置对象
    const desktopStyleConfig = {
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

    // 手机端样式配置对象
    const mobileStyleConfig = {
        // 通用样式（适用于所有页面）
        common: {
            // 页面主体样式
            'body': `
                min-width: unset;      // 移除最小宽度限制
                max-width: 100%;       // 最大宽度100%以适应屏幕
                margin: 15px 10px;     // 减小边距
                padding: 10px;         // 内边距
                font-size: 16px;       // 缩小字体
                line-height: 1.5;
                background: rgba(237, 239, 233, 0.9); // 略微增加不透明度
                border-radius: 8px;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
                overflow: auto;
            `,
            // 侧边导航栏样式
            '.SideNav': `
                background: rgba(255, 255, 255, 0.8);
                border-radius: 8px;
                margin-bottom: 15px;
                padding: 5px;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            `,
            '.SideNav-item': `
                padding: 10px 8px;
                font-size: 16px;
                margin-bottom: 5px;
                border-radius: 6px;
                transition: all 0.2s ease-in-out;
            `,
            '.SideNav-item:hover': `
                background-color: #c3e4e3;
                border-radius: 6px;
                transform: scale(1.01);
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
            `,
            // 特殊文本块样式
            'div[style*="margin-bottom: 16px"]': `
                font-family:
                    '华文行楷',
                    'STKaiti',
                    'Noto Serif CJK SC',
                    'WenQuanYi Micro Hei',
                    serif;
                font-size: 1.2em;
                color: rgb(0, 0, 0);
                text-shadow:
                    1px 1px 2px rgba(107, 70, 70, 0.2),
                    -1px -1px 1px rgba(255, 255, 255, 0.5);
                letter-spacing: 0.08em;
                line-height: 1.6;
                margin-bottom: 12px !important;
                padding: 8px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 6px;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.05);
            `,
            // 全局调整内边距
            '.container-lg': `
                padding-left: 10px !important;
                padding-right: 10px !important;
            `,
            // 适应性调整图片
            'img': `
                max-width: 100%;
                height: auto;
                border-radius: 6px;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            `,
            // 标签样式优化
            '.Label': `
                padding: 3px 6px;
                border-radius: 10px;
                font-size: 12px;
                margin-right: 4px;
                display: inline-block;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease;
            `,
            '.Label:hover': `
                transform: scale(1.05);
            `,
            // 文章列表优化
            '.listTitle': `
                font-weight: 500;
                margin-bottom: 2px;
            `,
            // 头部和尾部优化
            '#header': `
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-bottom: 10px;
            `,
            '#footer': `
                margin-top: 40px;
                padding: 10px;
                font-size: 12px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 6px;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.05);
            `
        },
        // 首页专属样式
        home: {
            '#header': `
                height: auto; // 自适应高度
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 15px 0;
            `,
            '#header h1': `
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 15px;
            `,
            '#header .avatar': `
                width: 120px;  // 缩小头像
                height: 120px;
                border-radius: 50%;
                object-fit: cover;
                display: none; // 在手机端首页隐藏头像
                margin: 0 auto 15px auto;
                border: 3px solid rgba(255, 255, 255, 0.7);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            `,
            '#header h1 a': `
                margin-top: 10px;
                font-family: fantasy;
                margin-left: unset;
                font-size: 32px;
            `
        },
        // 文章页专属样式
        article: {
            'body': `
                max-width: 100%;  
                margin: 15px 10px;
                font-size: 16px;
                line-height: 1.25;
                background: rgba(237, 239, 233, 0.9);
                border-radius: 8px;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
                overflow: auto;
                padding: 12px;
            `,
            'body .markdown-body': `
                font-size: 16px !important;  
                line-height: 1.4 !important;
            `,
            // 文章标题样式（h1-h6）
            'body .markdown-body h1, body .markdown-body h2, body .markdown-body h3, body .markdown-body h4, body .markdown-body h5, body .markdown-body h6, h1.postTitle': `
                font-family: '华文新魏', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif !important;
                margin-top: 1.2em !important;
                margin-bottom: 0.7em !important;
                font-weight: 600 !important;
                line-height: 1.3 !important;
            `,
            // 文章内容优化
            'body .markdown-body p': `
                margin-bottom: 0.8em !important;
                text-align: justify;
            `,
            // 代码块优化
            'body .markdown-body pre': `
                border-radius: 6px;
                margin-bottom: 1em !important;
                box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
            `,
            // 表格优化
            'body .markdown-body table': `
                display: block;
                width: 100%;
                overflow-x: auto;
                border-radius: 4px;
                margin-bottom: 1em !important;
            `,
            // 文章页面头像
            '.postTitle': `
                font-size: 24px !important;
                line-height: 1.3;
                word-break: break-word;
                padding-right: 10px;
            `
        },
        // 分页页样式
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
        
        // 基于设备类型选择样式配置
        const styleConfig = isDesktop() ? desktopStyleConfig : mobileStyleConfig;
        console.log(`应用${isDesktop() ? '桌面端' : '手机端'}样式`);

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
            console.log(`${isDesktop() ? '桌面端' : '手机端'}样式已成功应用`);
        }
    };

    // 执行样式应用
    applyStyles();

    // 窗口大小变化时重新应用样式
    window.addEventListener('resize', () => {
        // 移除之前的样式
        const oldStyleTags = document.querySelectorAll('style:not([id])');
        // 保留第一个样式标签（GitHub Issue 按钮隐藏规则）
        for (let i = 1; i < oldStyleTags.length; i++) {
            oldStyleTags[i].remove();
        }
        // 重新应用样式
        applyStyles();
    });

    updateQuoteDiv();

    function initializeLazyLoading() {
        const images = document.querySelectorAll('img');
        const placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // 透明占位符

        images.forEach(img => {
            const originalSrc = img.dataset.canonicalSrc || img.src; // 优先使用 data-canonical-src

            // 检查是否已经是懒加载或者没有有效 src
            if (img.dataset.src || !originalSrc || originalSrc === placeholder || originalSrc.startsWith('data:image')) {
                return;
            }
            
            // 跳过特定的小图标或不需要懒加载的图片 (可选，根据需要调整)
            if (img.closest('.SideNav-icon') || img.closest('.title-right') || img.closest('.mobile-float-button') || img.closest('.mobile-top-button') || img.classList.contains('avatar')) { // 添加 avatar 类排除
                 return;
            }

            img.dataset.src = originalSrc; // 使用获取到的原始 src
            img.src = placeholder; // 设置占位符
            img.classList.add('lozad'); // 添加lozad类
            
            // 添加加载效果 (可选)
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s';
        });

        const observer = lozad('.lozad', {
            loaded: function(el) {
                // 图片加载完成后显示 (可选加载效果)
                el.style.opacity = '1';
                el.classList.add('loaded'); // 添加标记，表示已加载
            }
        });
        observer.observe();
        console.log('Lozad.js initialized for lazy loading.');
    }

    // 在DOM加载后并且样式应用后初始化懒加载
    requestAnimationFrame(initializeLazyLoading);
});