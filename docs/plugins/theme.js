document.addEventListener('DOMContentLoaded', () => {
    // 设备检测函数（仅桌面生效）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop()) return;

    // 样式配置
    const currentPath = window.location.pathname;
    // 优化后的样式配置（使用动态继承）
    const styleConfig = {
        common: {
            // 全站基础样式
            body: `
                min-width: 200px;
                max-width: 885px;
                margin: 30px auto;
                font-size: 16px;
                font-family: 
                    'Microsoft YaHei',   /* Windows 优选 */
                    'PingFang SC',      /* macOS 苹方 */
                    'Noto Sans CJK SC', /* Linux/Android 思源黑体 */
                    'WenQuanYi Micro Hei', 
                    sans-serif;         /* 最终回退 */
                line-height: 1.25;
                background: rgba(237, 239, 233, 0.84);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                overflow: auto;`,
            '.SideNav': `
                background: rgba(255, 255, 255, 0.6);
                border-radius: 10px;
                min-width: unset;`,
            '.SideNav-item': `
                transition: 0.1s;`,
            '.SideNav-item:hover': `
                background-color: #c3e4e3;
                border-radius: 10px;
                transform: scale(1.02);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);`,
            // 新增：特定文字美化样式
            'div[style*="margin-bottom: 16px"]': `
                font-family: 
                    'KaiTi',                  /* Windows 楷体 */
                    'STKaiti',                /* macOS 楷体 */
                    'Noto Serif CJK SC',      /* Linux 思源宋体 */
                    'WenQuanYi Micro Hei',    /* 文泉驿微米黑 */
                    serif;                    /* 最终回退 */
                font-size: 1.4em;
                color: rgb(0, 0, 0);
                text-shadow: 
                    2px 2px 4px rgba(107, 70, 70, 0.2),
                    -1px -1px 1px rgba(255, 255, 255, 0.5);
                letter-spacing: 0.1em;
                line-height: 1.8;
                margin-bottom: 16px !important;`
            },
        home: {
            '#header': `
                height: 300px;`,
            '#header h1': `
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;`,
            '.avatar': `
                width: 200px;
                height: 200px;`,
            '#header h1 a': `
                margin-top: 30px;
                font-family: fantasy;
                margin-left: unset;`
        },
        article: {
            '.markdown-body img': `
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.78);`,
            '.markdown-alert': `
                border-radius: 8px;`,
            '.markdown-body pre': `
                background-color: rgba(243, 244, 243, 0.967);
                box-shadow: 0 10px 30px 0 rgba(222, 217, 217, 0.4);
                padding-top: 20px;
                border-radius: 8px;`,
            '.markdown-body code, .markdown-body tt': `
                background-color: #c9daf8;`,
            '.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6': `
                font-family: 'KaiTi', 'STKaiti', 'WenQuanYi Micro Hei', cursive;`,
            
            '.markdown-body h1': `
                display: inline-block;
                font-size: 1.3rem;
                background: rgb(239, 112, 96);
                color: #ffffff;
                padding: 3px 10px;
                border-radius: 8px;
                margin: 1.8rem 2px 0 0;`,
            // 新增其他标题的字体继承
            '.markdown-body h2': `font-size: 1.2rem;`,
            '.markdown-body h3': `font-size: 1.1rem;`,
            // ... 可根据需要添加更多标题样式 ...
        },
        page: {} // page*.html 复用 common 样式
    };

    // 让 page 类型直接继承 common 的样式
    styleConfig.page = { ...styleConfig.common };

    // CSS 生成器
    // 改进的 CSS 生成器（自动补全分号）
    const generateCSS = (styles) => {
        return Object.entries(styles)
            .map(([selector, rules]) => {
                const formatted = rules.replace(/([^;])$/, '$1;'); // 自动补全最后的分号
                return `${selector} { ${formatted} }`;
            })
            .join('\n');
    };

    // 增强的页面类型检测（更清晰的匹配逻辑）
    const getPageType = () => {
        const routePatterns = [
            { type: 'home', pattern: /(\/|\/index\.html)$/ },
            { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ },
            { type: 'page', pattern: /\/page\d+\.html/ }
        ];
        return routePatterns.find(p => p.pattern.test(currentPath))?.type;
    };

    // 优化的样式应用逻辑（动态合并公共样式）
    const applyStyles = () => {
        const pageType = getPageType();
        const mergedStyles = {
            ...styleConfig.common,
            ...(pageType ? styleConfig[pageType] : {})
        };

        const styleTag = document.createElement('style');
        styleTag.textContent = generateCSS(mergedStyles);
        document.head.appendChild(styleTag);
    };

    // 改进的背景设置（使用更高效的创建方式）
    const setBackground = () => {
        const bgStyle = document.createElement('style');
        bgStyle.textContent = `html {
            background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp')
                no-repeat center center fixed;
            background-size: cover;
        }`;
        document.head.appendChild(bgStyle);
    };

    // 执行主逻辑
    applyStyles();
    setBackground();
});
