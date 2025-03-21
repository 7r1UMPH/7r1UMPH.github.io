document.addEventListener('DOMContentLoaded', () => {
    // 精准设备检测（仅桌面端）
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop) return;

    // 样式配置（专注主页优化）
    const styleConfig = {
        base: `
            body {
                min-width: 200px;
                max-width: 885px;
                margin: 30px auto;
                font-size: 16px;
                font-family: sans-serif;
                background: rgba(237, 239, 233, 0.84);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .SideNav {
                background: rgba(255, 255, 255, 0.6);
                border-radius: 10px;
            }`,
        home: `
            #header {
                height: 300px;
                background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
            }
            .avatar {
                width: 200px;
                height: 200px;
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            /* 统一分页按钮样式 */
            .pagination a {
                min-width: 36px;
                padding: 6px 12px;
                border-radius: 8px;
                transition: transform 0.2s;
            }
            .pagination a:hover {
                transform: translateY(-2px);
                background: #f1f3f5;
            }`
    };

    // 主页路径识别（支持多种格式）
    const isHomePage = (() => {
        const path = window.location.pathname;
        return (
            path === '/' || 
            /(\/index\.html|\/page\d*\.html)/.test(path) || 
            /\/page\/\d+\/?$/.test(path)
        );
    })();

    // 样式注入（单次操作优化性能）
    const injectStyles = () => {
        const styleTag = document.createElement('style');
        styleTag.textContent = styleConfig.base + (isHomePage ? styleConfig.home : '');
        document.head.appendChild(styleTag);
    };

    // 固定背景设置
    const setBackground = () => {
        const bgStyle = document.createElement('style');
        bgStyle.textContent = `
            html {
                background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp')
                    no-repeat center center fixed;
                background-size: cover;
            }`;
        document.head.appendChild(bgStyle);
    };

    // 执行逻辑
    if (isHomePage) {
        injectStyles();
        setBackground();
    }
});
