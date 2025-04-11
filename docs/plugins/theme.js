document.addEventListener('DOMContentLoaded', () => {
    // 设备检测函数（仅桌面生效）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop()) {
        console.log('检测到移动端视图，不应用桌面自定义样式');
        return;
    }

    // --- 样式配置 ---

    const currentPath = window.location.pathname;

    // 样式配置对象
    const styleConfig = {
        // 桌面端通用样式
        common: {
            // 基础body样式
            'body': `
                min-width: 200px; /* 最小宽度，可根据需要调整 */
                max-width: 885px;
                margin: 30px auto;
                font-size: 16px;
                font-family:
                    'Microsoft YaHei',   /* Windows系统字体 */
                    'PingFang SC',      /* macOS系统字体 */
                    'Noto Sans CJK SC', /* Linux/Android系统字体 */
                    'WenQuanYi Micro Hei',
                    sans-serif;         /* 备用字体 */
                line-height: 1.25;
                background: rgba(237, 239, 233, 0.84);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                overflow: auto;
            `,
            // 侧边导航栏样式
            '.SideNav': `
                background: rgba(255, 255, 255, 0.6);
                border-radius: 10px;
                min-width: unset; /* 显式覆盖可能的默认值 */
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
                    'KaiTi',             /* Windows楷体 */
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
        // 首页特定样式
        home: {
            '#header': `
                height: 300px; /* 头部高度 */
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
        // 文章页特定样式
        article: {
            '.markdown-body img': `
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.78);
                display: block;
                max-width: 100%;
                height: auto;
            `,
            '.markdown-alert': `
                border-radius: 8px;
            `,
            '.markdown-body pre': `
                background-color: rgba(243, 244, 243, 0.967);
                box-shadow: 0 10px 30px 0 rgba(222, 217, 217, 0.4);
                padding: 15px 20px;
                border-radius: 8px;
                overflow-x: auto;
            `,
            '.markdown-body code, .markdown-body tt': `
                background-color: #c9daf8;
                padding: 0.2em 0.4em;
                margin: 0;
                font-size: 85%;
                border-radius: 3px;
            `,
            // 标题通用样式
            '.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6': `
                font-family: 'KaiTi', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif;
                margin-top: 1.5em;
                margin-bottom: 0.8em;
                font-weight: 600;
            `
        },
        // 分页页特定样式
        page: {
            // 示例: '.pagination': 'margin-top: 2em;'
        }
    };

    // --- 辅助函数 ---

    /**
     * 从样式配置对象生成CSS字符串
     * @param {object} styles - 键为选择器，值为CSS规则字符串的对象
     * @returns {string} - 包含所有CSS规则的字符串
     */
    const generateCSS = (styles) => {
        return Object.entries(styles)
            .map(([selector, rules]) => {
                // 去除空白并确保规则块以分号结尾
                const trimmedRules = rules.trim();
                const formattedRules = trimmedRules.endsWith(';') ? trimmedRules : `${trimmedRules};`;
                return `${selector} { ${formattedRules} }`;
            })
            .join('\n');
    };

    /**
     * 根据URL路径检测当前页面类型
     * @returns {string|undefined} - 检测到的页面类型('home', 'article', 'page')，未匹配则返回undefined
     */
    const getPageType = () => {
        // 路由匹配模式
        const routePatterns = [
            // 匹配路径结尾为'/'或'/index.html'
            { type: 'home', pattern: /^(\/|\/index\.html)$/ },
            // 匹配包含'/post/'、'link.html'或'about.html'的路径
            { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ },
            // 匹配以'/page'开头后接数字并以'.html'结尾的路径
            { type: 'page', pattern: /\/page\d+\.html$/ }
        ];
        // 查找第一个匹配当前路径的模式
        const match = routePatterns.find(p => p.pattern.test(currentPath));
        return match?.type;
    };

    // --- 主逻辑 ---

    /**
     * 根据页面类型应用相应的CSS样式
     * 合并通用样式和页面特定样式，并添加全局背景
     */
    const applyStyles = () => {
        const pageType = getPageType();
        console.log(`检测到页面类型: ${pageType || '通用'}`);

        // 从通用样式开始
        let mergedStyles = { ...styleConfig.common };

        // 如果检测到类型且在配置中存在，则添加页面特定样式
        if (pageType && styleConfig[pageType]) {
            mergedStyles = { ...mergedStyles, ...styleConfig[pageType] };
        }

        // 添加全局HTML背景样式
        mergedStyles['html'] = `
            background: url('https://hub.gitmirror.com/https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250320210716585.webp')
                no-repeat center center fixed;
            background-size: cover;
            scroll-behavior: smooth;
        `;

        // 生成最终的CSS字符串
        const cssString = generateCSS(mergedStyles);

        // 创建并添加style标签
        if (cssString) {
            const styleTag = document.createElement('style');
            styleTag.textContent = cssString;
            document.head.appendChild(styleTag);
            console.log('已应用自定义桌面样式');
        } else {
            console.log('没有样式需要应用');
        }
    };

    // 执行主逻辑
    applyStyles();
});
