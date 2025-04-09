// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 设备检测函数（仅桌面生效）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    // 如果是移动设备，不应用桌面样式
    if (!isDesktop()) {
        console.log('检测到移动端视图，不应用自定义桌面样式');
        return;
    }

    // --- 配置部分 ---

    // 获取当前页面路径
    const currentPath = window.location.pathname;

    // 样式配置对象（考虑使用CSS变量来管理重复值）
    const styleConfig = {
        // 通用样式（在所有桌面页面应用）
        common: {
            // 基础body样式
            'body': `
                --primary-color: rgb(239, 112, 96);
                --text-color: rgb(0, 0, 0);
                --shadow-color: rgba(0, 0, 0, 0.5);
                --border-radius: 10px;
                --bg-color: rgba(237, 239, 233, 0.84);
                --code-bg-color: #c9daf8;
                min-width: 200px;
                max-width: 885px;
                margin: 30px auto;
                font-size: 16px;
                font-family:
                    'Microsoft YaHei', 
                    'PingFang SC',
                    'Noto Sans CJK SC',
                    'WenQuanYi Micro Hei',
                    sans-serif;
                line-height: 1.25;
                background: var(--bg-color);
                border-radius: var(--border-radius);
                box-shadow: 0 0 10px var(--shadow-color);
                overflow: auto;
            `,
            // 侧边导航栏样式
            '.SideNav': `
                background: rgba(255, 255, 255, 0.6);
                border-radius: 10px;
                min-width: unset; /* 显式覆盖默认值 */
            `,
            // 侧边导航项样式
            '.SideNav-item': `
                transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out;
            `,
            // 侧边导航项悬停效果
            '.SideNav-item:hover': `
                background-color: #c3e4e3;
                border-radius: 10px;
                transform: scale(1.02);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            `,
            // 特殊文本块样式（警告：基于内联样式的选择器不推荐）
            'div[style*="margin-bottom: 16px"]': `
                font-family:
                    'KaiTi',             /* Windows */
                    'STKaiti',           /* macOS */
                    'Noto Serif CJK SC', /* Linux */
                    'WenQuanYi Micro Hei',
                    serif;               /* 后备字体 */
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
                height: 300px; /* 考虑使用min-height以适应内容变化 */
            `,
            '#header h1': `
                position: absolute; /* 注意绝对定位的影响 */
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
                font-family: fantasy; /* 确保字体可用或提供后备 */
                margin-left: unset; /* 显式覆盖默认值 */
            `
        },
        // 文章页特定样式
        article: {
            // 覆盖文章页面的body样式
            'body': `
                max-width: 1100px; /* 仅文章页面使用更宽的1100px */
            `,
            '.markdown-body img': `
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.78);
                display: block; /* 通常对图片有益 */
                max-width: 100%; /* 响应式图片 */
                height: auto;   /* 保持宽高比 */
            `,
            '.markdown-alert': `
                border-radius: 8px;
            `,
            '.markdown-body pre': `
                background-color: rgba(243, 244, 243, 0.967);
                box-shadow: 0 10px 30px 0 rgba(222, 217, 217, 0.4);
                padding: 15px 20px;
                border-radius: 8px;
                overflow-x: auto; /* 防止代码破坏布局 */
            `,
            // 代码样式
            '.markdown-body code, .markdown-body tt': `
                background-color: #c9daf8; /* 检查对比度以确保可访问性 */
                padding: 0.2em 0.4em;
                margin: 0;
                font-size: 85%;
                border-radius: 3px;
            `,
            // 标题字体统一
            '.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6': `
                font-family: 'KaiTi', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif;
                margin-top: 1.5em; /* 标准标题间距 */
                margin-bottom: 0.8em;
                font-weight: 600; /* 典型标题粗细 */
            `,
            // 一级标题特殊样式
            '.markdown-body h1': `
                display: inline-block;
                font-size: 1.8em; /* 使用相对单位 */
                background: rgb(239, 112, 96);
                color: #ffffff;
                padding: 5px 12px;
                border-radius: 8px;
            `,
            // 其他标题大小
            '.markdown-body h2': `font-size: 1.5em;`,
            '.markdown-body h3': `font-size: 1.3em;`,
            '.markdown-body h4': `font-size: 1.1em;`,
        },
        // 分页页特定样式
        page: {
            // 示例: '.pagination': 'margin-top: 2em;'
        }
    };

    // --- 辅助函数 ---

    /**
     * 从样式配置对象生成CSS字符串
     * 确保每条规则以分号结尾
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
            // 匹配'/'或'/index.html'
            { type: 'home', pattern: /^(\/|\/index\.html)$/ },
            // 匹配'/post/'、'link.html'或'about.html'
            { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ },
            // 匹配'/page'后跟数字并以'.html'结尾
            { type: 'page', pattern: /\/page\d+\.html$/ }
        ];
        // 查找第一个匹配当前路径的模式
        const match = routePatterns.find(p => p.pattern.test(currentPath));
        return match?.type; // 找到则返回类型，否则返回undefined
    };

    // --- 主逻辑 ---

    /**
     * 根据页面类型应用适当的CSS样式
     * 合并通用样式和页面特定样式，并添加全局背景
     */
    const applyStyles = () => {
        const pageType = getPageType();
        console.log(`检测到页面类型: ${pageType || 'common'}`);

        // 从通用样式开始
        let mergedStyles = { ...styleConfig.common };

        // 如果检测到类型且在配置中存在，添加页面特定样式
        if (pageType && styleConfig[pageType]) {
            mergedStyles = { ...mergedStyles, ...styleConfig[pageType] };
        }

        // 添加全局HTML背景样式
        // 在DOMContentLoaded开始时添加
        const BG_IMAGE_URL = 'https://hub.gitmirror.com/https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250320210716585.webp';
        
        // 预加载背景图片
        const preloadImage = new Image();
        preloadImage.src = BG_IMAGE_URL;
        
        // 修改背景样式引用
        mergedStyles['html'] = `
            background: url('${BG_IMAGE_URL}') no-repeat center center fixed;
            background-size: cover;
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
