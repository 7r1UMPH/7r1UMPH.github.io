document.addEventListener('DOMContentLoaded', () => {
    // 增强版设备检测（支持现代浏览器 API）
    const isDesktop = (() => {
        if (typeof navigator === 'undefined') return false;
        const ua = navigator.userAgent;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobileUI = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        return window.matchMedia('(min-width: 992px)').matches && !isTouchDevice && !isMobileUI;
    })();
    if (!isDesktop) return;

    // 统一样式配置（支持嵌套规则）
    const styleConfig = {
        base: `
            body {
                min-width: 200px;
                max-width: 885px;
                margin: 30px auto;
                font-size: 16px;
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.6;
                background: rgba(237, 239, 233, 0.84);
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .SideNav {
                backdrop-filter: blur(8px);
                background: rgba(255, 255, 255, 0.6) !important;
                border-radius: 10px;
            }
            .page-container {
                padding: 2rem;
                margin: 1.5rem 0;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 12px;
                transition: transform 0.2s ease;
            }`,
        home: `
            #header {
                height: 300px;
                background: linear-gradient(135deg, #f6f8f9 0%, #e9ecef 100%);
                border-radius: 10px 10px 0 0;
            }
            .avatar {
                width: 200px;
                height: 200px;
                border: 4px solid #fff;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            }
            .pagination {
                gap: 0.8rem;
                margin: 2rem 0;
            }
            .pagination a {
                padding: 0.5rem 1rem;
                border-radius: 8px;
                transition: all 0.2s ease;
            }`
    };

    // 智能页面识别（支持动态分页）
    const getPageType = (path = window.location.pathname) => {
        const patterns = {
            home: [
                /^\/$/,                         // 根目录
                /\/index\.html?$/i,             // index.html
                /\/page\d*\.html?$/i,           // page[数字].html
                /\/home\/?/i                    // /home/ 路径
            ],
            article: [
                /\/post\//i,                    // /post/ 路径
                /\/\d{4}\/\d{2}\//i             // 日期格式路径
            ]
        };

        return Object.entries(patterns).find(([_, regexList]) => 
            regexList.some(r => r.test(path))
        )?.[0] || 'default';
    };

    // 样式注入器（支持优先级排序）
    const injectStyles = () => {
        const pageType = getPageType();
        const styleTag = document.createElement('style');
        
        // 基础样式
        let css = styleConfig.base;
        
        // 页面类型样式
        if (styleConfig[pageType]) {
            css += styleConfig[pageType];
        }

        // 全局增强样式
        css += `
            @media (prefers-color-scheme: dark) {
                body {
                    background: rgba(34, 39, 46, 0.9);
                    color: #adbac7;
                }
                .SideNav {
                    background: rgba(40, 45, 51, 0.8) !important;
                }
            }
            .markdown-body :where(h1,h2,h3) {
                scroll-margin-top: 2rem;
            }`;

        styleTag.textContent = css;
        document.head.prepend(styleTag); // 确保最高优先级
    };

    // 动态背景系统（支持缓存）
    const setDynamicBackground = () => {
        const bgUrl = 'https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp';
        
        if (!document.getElementById('dynamic-bg')) {
            document.head.insertAdjacentHTML('beforeend', `
                <style id="dynamic-bg">
                    html {
                        background: url('${bgUrl}') no-repeat center/cover fixed;
                        background-attachment: fixed;
                    }
                    @media (max-width: 1199px) {
                        html { background-size: auto 100%; }
                    }
                </style>
            `);
        }
    };

    // 执行入口
    injectStyles();
    setDynamicBackground();

    // 页面特定增强
    if (getPageType() === 'home') {
        // 分页按钮动效
        document.querySelectorAll('.pagination a').forEach(btn => {
            btn.style.transform = 'translateY(0)';
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            });
        });
    }
});
