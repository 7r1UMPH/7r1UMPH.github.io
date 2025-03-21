document.addEventListener('DOMContentLoaded', () => {
    // 设备检测函数（仅桌面生效）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop()) return;

    // 当前路径获取
    const currentPath = window.location.pathname;


    const styleConfig = {
        // 通用样式（全站生效）
        common: {
            body: `
                min-width: 200px;
                max-width: 885px;
                margin: 30px auto;
                font-size: 16px;
                font-family: sans-serif;
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
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);`
        },
        // 首页样式
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
        // 文章页样式
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
            '.markdown-body h1': `
                display: inline-block;
                font-size: 1.3rem;
                background: rgb(239, 112, 96);
                color: #ffffff;
                padding: 3px 10px;
                border-radius: 8px;
                margin: 1.8rem 2px 0 0;`
        },
        // 新增：page*.html 完全复用 common 的样式
        page: {}
    };

    // 让 page 类型直接继承 common 的样式
    styleConfig.page = { ...styleConfig.common };

    // CSS 生成器（将对象转为 CSS 字符串）
    const generateCSS = (styles) => {
        return Object.entries(styles)
            .map(([selector, rules]) => `${selector} { ${rules} }`)
            .join('\n');
    };

    // 页面类型检测（包含 page*.html 的匹配规则）
    const getPageType = () => {
        if (currentPath === '/' || /(\/index\.html)/.test(currentPath)) return 'home';
        if (/\/post\/|link\.html|about\.html/.test(currentPath)) return 'article';
        if (/\/page\d+\.html/.test(currentPath)) return 'page'; // 正则匹配 page1.html, page2.html 等
        return null;
    };

    // 样式应用逻辑
    const applyStyles = () => {
        const pageType = getPageType();
        
        // 默认加载 common 样式
        let styles = [generateCSS(styleConfig.common)];
        
        // 如果页面类型存在，追加对应样式
        if (pageType) {
            styles.push(generateCSS(styleConfig[pageType]));
        }

        // 创建 <style> 标签并注入
        const styleTag = document.createElement('style');
        styleTag.textContent = styles.join('\n');
        document.head.appendChild(styleTag);
    };

    // 背景设置（全站统一）
    const setBackground = () => {
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                html {
                    background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp')
                        no-repeat center center fixed;
                    background-size: cover;
                }
            </style>
        `);
    };

    // 执行主逻辑
    applyStyles();
    setBackground();
});
