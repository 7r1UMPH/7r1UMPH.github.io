document.addEventListener('DOMContentLoaded', () => {
    // 设备检测函数（仅桌面生效）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop()) return;
    
    // 缓存常用DOM元素和值
    const currentPath = window.location.pathname;
    const head = document.head;
    
    // 预编译正则表达式
    const pagePatterns = {
        home: /^(\/|\/index\.html)$/,
        article: /\/post\/|link\.html|about\.html/,
        page: /\/page\d+\.html/
    };
    
    // 样式配置 - 使用更结构化的方式定义
    const baseStyles = {
        body: `min-width:200px;max-width:885px;margin:30px auto;font-family:'Courier New',monospace;font-size:16px;line-height:1.5;background:rgba(10,15,20,0.9);color:#0f0;border:1px solid #333;box-shadow:0 0 15px rgba(0,255,0,0.3);padding:20px;`,
        nav: `background:rgba(20,25,30,0.8);border:1px solid #333;`,
        '.SideNav-item': `transition:0.2s;color:#0f0 !important;`,
        '.SideNav-item:hover': `background-color:rgba(0,100,0,0.3) !important;transform:scale(1.02);text-shadow:0 0 5px #0f0;`,
        'div[style*="margin-bottom: 16px"]': `font-family:'Courier New',monospace;font-size:1.2em;color:#0f0;text-shadow:0 0 5px #0f0;border-bottom:1px dashed #333;padding-bottom:10px;margin-bottom:20px !important;`,
        a: `color:#0af !important;text-decoration:none;`,
        'a:hover': `color:#0f0 !important;text-shadow:0 0 5px #0f0;`
    };
    
    const styleConfig = {
        common: {
            body: baseStyles.body,
            '.SideNav': baseStyles.nav,
            '.SideNav-item': `transition:0.2s;color:#0f0 !important;`,
            '.SideNav-item:hover': `background-color:rgba(0,100,0,0.3) !important;transform:scale(1.02);text-shadow:0 0 5px #0f0;`,
            'div[style*="margin-bottom: 16px"]': `font-family:'Courier New',monospace;font-size:1.2em;color:#0f0;text-shadow:0 0 5px #0f0;border-bottom:1px dashed #333;padding-bottom:10px;margin-bottom:20px !important;`,
            a: `color:#0af !important;text-decoration:none;`,
            'a:hover': `color:#0f0 !important;text-shadow:0 0 5px #0f0;`
        },
        home: {
            '#header': `background:rgba(10,15,20,0.7);border:1px solid #333;height:250px;text-align:center;`,
            '#header h1': `color:#0f0;text-shadow:0 0 10px #0f0;font-size:2.5em;`,
            '.avatar': `border:2px solid #0f0;box-shadow:0 0 10px #0f0;`
        },
        article: {
            '.markdown-body': `color:#ccc;`,
            '.markdown-body h1, .markdown-body h2': `color:#0f0;border-bottom:1px dashed #333;padding-bottom:5px;`,
            '.markdown-body img': `border:1px solid #333;box-shadow:0 0 10px rgba(0,255,0,0.3);`,
            '.markdown-body pre': `background:rgba(20,25,30,0.8) !important;border:1px solid #0f0;color:#0f0;box-shadow:0 0 10px rgba(0,255,0,0.3);`,
            '.markdown-body code': `background:rgba(0,50,0,0.3) !important;color:#0f0;`,
            '.markdown-body blockquote': `border-left:3px solid #0f0;background:rgba(0,50,0,0.1);`,
            '.markdown-alert': `border:1px solid #333;background:rgba(20,25,30,0.8);`,
            '.markdown-body h1': `display:inline-block;font-size:1.3rem;background:rgba(0,80,0,0.5);color:#0f0;padding:3px 10px;border-radius:0;margin:1.8rem 2px 0 0;`
        },
        page: {} // page*.html 复用 common 样式
    };
    
    // 让 page 类型直接继承 common 的样式
    styleConfig.page = { ...styleConfig.common };
    
    // CSS 生成器
    const generateCSS = (() => {
        const cache = new Map();
        return (styles) => {
            const cacheKey = JSON.stringify(styles);
            if (cache.has(cacheKey)) return cache.get(cacheKey);
            
            const css = Object.entries(styles)
                .map(([selector, rules]) => `${selector}{${rules}}`)
                .join('');
            
            cache.set(cacheKey, css);
            return css;
        };
    })();
    
    // 页面类型检测
    const getPageType = () => {
        for (const [type, pattern] of Object.entries(pagePatterns)) {
            if (pattern.test(currentPath)) return type;
        }
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
        styleTag.textContent = styles.join('');
        head.appendChild(styleTag);
    };
    
    // 背景设置
    const setBackground = () => {
        head.insertAdjacentHTML('beforeend', 
            `<style>html{background:url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp') no-repeat center center fixed;background-size:cover;}</style>`
        );
    };
    
    // 执行主逻辑
    applyStyles();
    setBackground();
});
