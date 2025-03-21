document.addEventListener('DOMContentLoaded', () => {
    // 设备检测函数（仅桌面生效）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop()) return;

    // 样式配置
    const currentPath = window.location.pathname;
    const styleConfig = {
        common: {
            body: `
                min-width: 200px;
                max-width: 900px;
                margin: 30px auto;
                font-size: 16px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #2c3e50;
                background: rgba(245, 245, 245, 0.9);
                border-radius: 10px;
                box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
                overflow: hidden;`,
            '.SideNav': `
                background: rgba(255, 255, 255, 0.75);
                border-radius: 8px;
                padding: 10px;`,
            '.SideNav-item': `
                transition: all 0.3s ease;`,
            '.SideNav-item:hover': `
                background-color: #d6eef0;
                border-radius: 8px;
                transform: scale(1.05);
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);`,
            // 特定文字美化样式
            'div[style*="margin-bottom: 16px"]': `
                font-family: 'Microsoft YaHei', '华文行楷', sans-serif;
                font-size: 1.3em;
                color: #34495e;
                text-shadow: 1px 1px 3px rgba(107, 70, 70, 0.2);
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
                width: 150px;
                height: 150px;
                border-radius: 50%;`,
            '#header h1 a': `
                margin-top: 20px;
                color: #34495e;
                font-family: fantasy;
                font-size: 1.5rem;`
        },
        article: {
            '.markdown-body img': `
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.9);`,
            '.markdown-alert': `
                border-radius: 8px;`,
            '.markdown-body pre': `
                background-color: rgba(245, 245, 245, 0.9);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                padding: 15px;
                border-radius: 6px;`,
            '.markdown-body code, .markdown-body tt': `
                background-color: #eef1f7;
                padding: 3px 5px;
                border-radius: 4px;`,
            '.markdown-body h1': `
                display: block;
                font-size: 1.6rem;
                color: #2c3e50;
                padding-left: 16px;
                margin: 1.8rem 0 0;
                border-left: 4px solid #154360;
                border-radius: 20px 0 0 20px;`
        },
        page: {}
    };

    // 为 page 类型继承 common 样式
    styleConfig.page = { ...styleConfig.common };

    // 生成 CSS
    const generateCSS = (styles) =>
        Object.entries(styles)
            .map(([selector, rules]) => `${selector} { ${rules} }`)
            .join('\n');

    // 检测页面类型
    const getPageType = () => {
        if (currentPath === '/' || /(\/index\.html)/.test(currentPath)) return 'home';
        if (/\/post\/|link\.html|about\.html/.test(currentPath)) return 'article';
        if (/\/page\d+\.html/.test(currentPath)) return 'page';
        return null;
    };

    // 应用样式
    const applyStyles = () => {
        const pageType = getPageType();
        const styles = [
            generateCSS(styleConfig.common),
            pageType ? generateCSS(styleConfig[pageType]) : ''
        ].filter(Boolean);

        const styleTag = document.createElement('style');
        styleTag.textContent = styles.join('\n');
        document.head.appendChild(styleTag);
    };

    // 设置全站背景
    const setBackground = () => {
        const bgStyle = `
            html {
                background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp') 
                    no-repeat center center fixed;
                background-size: cover;
            }`;
        const styleTag = document.createElement('style');
        styleTag.textContent = bgStyle;
        document.head.appendChild(styleTag);
    };

    // 执行主逻辑
    applyStyles();
    setBackground();
});
