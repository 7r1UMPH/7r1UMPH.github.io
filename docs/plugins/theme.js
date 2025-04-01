document.addEventListener('DOMContentLoaded', () => {
    // 设备检测函数（仅桌面生效）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop()) return;

    // 样式配置（使用解构和模板字符串优化）
    const styleConfig = (() => {
        // 恢复公共样式结构
        const baseStyles = {
            body: `
                min-width: 200px;
                max-width: 680px;
                margin: 30px auto;
                font-size: 16px;
                font-family: 
                    'Microsoft YaHei', 
                    'PingFang SC',
                    'Noto Sans CJK SC',
                    'WenQuanYi Micro Hei', 
                    sans-serif;
                line-height: 1.6;
                background: rgba(237, 239, 233, 0.84);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                overflow: auto;`.replace(/^\s+/gm, ''),
                
            '.SideNav': `
                background: rgba(255, 255, 255, 0.6);
                border-radius: 10px;
                min-width: unset;`
        };

        return {
            common: baseStyles,
            home: { 
                '#header': `height: 300px;`,
                '#header h1': `
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;`,
                '.avatar': `width: 200px; height: 200px;`,
                '#header h1 a': `
                    margin-top: 30px;
                    font-family: fantasy;
                    margin-left: unset;`
            },
            article: {
                '.markdown-body img': `
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.78);`,
                '.markdown-alert': `border-radius: 8px;`,
                '.markdown-body pre': `
                    background-color: rgba(243, 244, 243, 0.967);
                    box-shadow: 0 10px 30px 0 rgba(222, 217, 217, 0.4);
                    padding-top: 20px;
                    border-radius: 8px;`,
                '.markdown-body code, .markdown-body tt': `
                    background-color: #c9daf8;`,
                '.markdown-body h1, .markdown-body h2, .markdown-body h3': `
                    font-family: 'KaiTi', 'STKaiti', 'WenQuanYi Micro Hei', cursive;`,
                '.markdown-body h1': `
                    display: inline-block;
                    font-size: 1.3rem;
                    background: rgb(239, 112, 96);
                    color: #ffffff;
                    padding: 3px 10px;
                    border-radius: 8px;
                    margin: 1.8rem 2px 0 0;`,
                '.markdown-body h2': `font-size: 1.2rem;`,
                '.markdown-body h3': `font-size: 1.1rem;`
            },
            page: baseStyles // 直接引用基础样式
        };
    })();

    // 优化后的CSS生成器（使用Map缓存优化性能）
    const createStyleGenerator = () => {
        const cache = new Map();
        return styles => {
            // 恢复简单缓存键生成方式
            const cacheKey = JSON.stringify(styles);
            if (cache.has(cacheKey)) return cache.get(cacheKey);
            
            const css = Object.entries(styles)
                .map(([selector, rules]) => {
                    // 保留格式修正逻辑
                    const formatted = `${rules}`.replace(/([^;])\s*$/, '$1;');
                    return `${selector} { ${formatted} }`;
                }).join('\n');
            
            cache.set(cacheKey, css);
            return css;
        };
    };

    const styleManager = (() => {
        const generateCSS = createStyleGenerator();
        let styleElement = null;
        
        return {
            apply() {
                const pageType = getPageType();
                // 恢复正确的样式合并方式
                const mergedStyles = { 
                    ...styleConfig.common, 
                    ...(styleConfig[pageType] || {})
                };
                
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = 'theme-styles';
                    document.head.appendChild(styleElement);
                }
                styleElement.textContent = generateCSS(mergedStyles);
            }
        };
    })();

    // 初始化入口
    const initialize = () => {
        styleManager.apply();
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

    initialize();
});
