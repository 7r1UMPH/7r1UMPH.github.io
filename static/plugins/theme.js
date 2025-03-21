document.addEventListener('DOMContentLoaded', () => {
    // 设备检测函数（仅桌面生效）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop()) return;

    // 样式配置
    const currentPath = window.location.pathname;
    const styleConfig = {
        common: {
            // 全站基础样式
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
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);`,
            // 新增：特定文字美化样式
            'div[style*="margin-bottom: 16px"]': `
                font-family: '华文行楷', '方正清刻本悦宋', cursive;
                font-size: 1.4em;
                color:rgb(0, 0, 0);
                text-shadow: 
                    2px 2px 4px rgba(107,70,70,0.2),
                    -1px -1px 1px rgba(255,255,255,0.5);
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
    '.markdown-body h1': `
        display: block;
        font-size: 1.6rem;
        color: #2c3e50;
        font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
        padding-left: 15px;
        margin: 1.8rem 0 0 0;
        border-left: 4px solid #2980b9;
        border-radius: 20px 0 0 20px;`, // 深蓝色圆竖条
    '.markdown-body': `
        font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
        color: rgba(44, 62, 80, 0.85);` // 设置柔和的淡黑色字体
},




        page: {} // page*.html 复用 common 样式
    };

    // 让 page 类型直接继承 common 的样式
    styleConfig.page = { ...styleConfig.common };

    // CSS 生成器
    const generateCSS = (styles) => {
        return Object.entries(styles)
            .map(([selector, rules]) => `${selector} { ${rules} }`)
            .join('\n');
    };

    // 页面类型检测
    const getPageType = () => {
        if (currentPath === '/' || /(\/index\.html)/.test(currentPath)) return 'home';
        if (/\/post\/|link\.html|about\.html/.test(currentPath)) return 'article';
        if (/\/page\d+\.html/.test(currentPath)) return 'page';
        return null;
    };

    // 样式应用逻辑
    const applyStyles = () => {
        const pageType = getPageType();
        const styles = [
            generateCSS(styleConfig.common),
            pageType && generateCSS(styleConfig[pageType])
        ].filter(Boolean);

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
