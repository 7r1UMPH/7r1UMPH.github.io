function runTheme() {
    // --- 配置 ---

    // 样式配置对象
    const styleConfig = {
        // 通用样式（适用于所有页面）
        common: {
            // 页面主体样式
            'body': `
                min-width: 200px;  // 最小宽度限制
                max-width: 885px;  // 最大内容宽度
                margin: 30px auto; // 上下边距30px，水平居中
                font-size: 20px;
                line-height: 1.6;
                background: rgba(250, 250, 250, 0.92);
                border-radius: 16px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                overflow: auto;
                transition: all 0.3s ease;
                position: relative;
                z-index: 1;
            `,
            // Matrix Rain Canvas 样式
            '#matrixRain': `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                background-color: rgba(0, 0, 0, 0.85);
            `,
            // 侧边导航栏样式
            '.SideNav': `
                background: rgba(255, 255, 255, 0.75); // 半透明白色背景
                border-radius: 12px; // 圆角效果
                min-width: unset;    // 重置最小宽度
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.18);
                overflow: hidden;
                margin-bottom: 24px;
            `,
            '.SideNav-item': `
                transition: all 0.2s ease-in-out;
                margin: 5px 8px;
                border-radius: 8px;
                overflow: hidden;
            `,
            '.SideNav-item:hover': `
                background-color: rgba(195, 228, 227, 0.5);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            `,
            // 标签样式
            '.Label': `
                padding: 4px 8px;
                border-radius: 12px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                transition: all 0.2s ease;
                margin-left: 6px;
            `,
            '.Label:hover': `
                transform: scale(1.05);
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
            `,
            // 特殊文本块样式
            'div[style*="margin-bottom: 16px"]': `
                font-family:
                    '华文行楷',          /* Windows楷体 */
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
                background: rgba(255, 255, 255, 0.5);
                padding: 16px;
                border-radius: 12px;
                border-left: 4px solid #0366d6;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            `,
            // 链接样式美化
            'a': `
                transition: all 0.2s ease;
                text-decoration: none;
            `,
            'a:hover': `
                text-decoration: underline;
                text-decoration-thickness: 2px;
                text-underline-offset: 2px;
                color: #0969da;
            `,
            // 美化页脚
            '#footer': `
                padding: 20px 0;
                opacity: 0.8;
                transition: opacity 0.3s ease;
                font-size: 14px;
                border-top: 1px solid rgba(0, 0, 0, 0.05);
                margin-top: 40px;
            `,
            '#footer:hover': `
                opacity: 1;
            `,
            '#footer a': `
                color: #0366d6;
                font-weight: 500;
            `
        },
        // 首页专属样式
        home: {
            '#header': `
                height: 300px; // 头部区域高度
                margin-bottom: 30px;
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
                width: 160px;
                height: 160px;
                border-radius: 50%;
                object-fit: cover;
                border: 5px solid rgba(255, 255, 255, 0.7);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
            `,
            '.avatar:hover': `
                transform: scale(1.05) rotate(5deg);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            `,
            '#header h1 a': `
                margin-top: 30px;
                font-family: fantasy;
                margin-left: unset;
                font-size: 42px;
                background: linear-gradient(45deg, #0366d6, #8250df);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            `
        },
        // 文章页专属样式
        article: {
            'body': `
                max-width: 1000px;
                margin: 30px auto;
                font-size: 16px;
                line-height: 1.25;
                background: rgba(250, 250, 250, 0.92);
                border-radius: 16px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                overflow: auto;
                padding: 30px;
            `,
            'body .markdown-body': `
                 font-size: 18px !important;
                line-height: 1.6 !important;
                color: #24292f;
            `,
            // 文章标题样式（h1-h6）
            'body .markdown-body h1, body .markdown-body h2, body .markdown-body h3, body .markdown-body h4, body .markdown-body h5, body .markdown-body h6, h1.postTitle': `
                font-family: '华文新魏', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif !important;
                margin-top: 1.5em !important;
                margin-bottom: 0.8em !important;
                font-weight: 600 !important;
                color: #24292f;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                padding-bottom: 0.3em;
            `,
            // 代码块美化
            'body .markdown-body pre': `
                border-radius: 8px;
                margin: 16px 0;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                position: relative !important; /* 为绝对定位的复制按钮提供定位上下文 */
                padding-right: 40px !important; /* 为复制按钮预留空间 */
            `,
            // 复制按钮修复
            '.snippet-clipboard-content': `
                position: relative !important;
                overflow: visible !important;
            `,
            '.clipboard-container': `
                position: absolute !important;
                top: 5px !important;
                right: 5px !important;
                z-index: 10 !important;
            `,
            '.ClipboardButton': `
                background-color: rgba(255, 255, 255, 0.8) !important;
                border: 1px solid rgba(0, 0, 0, 0.1) !important;
                border-radius: 4px !important;
                padding: 4px !important;
                margin: 4px !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            `,
            // 文章内容段落
            'body .markdown-body p': `
                margin-bottom: 1em;
                text-align: justify;
            `,
            // 文章中的图片
            'body .markdown-body img': `
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                display: block;
                margin: 20px auto;
                max-width: 100%;
            `,
            'body .markdown-body img:hover': `
                transform: scale(1.02);
            `,
            // 表格样式
            'body .markdown-body table': `
                border-collapse: separate;
                border-spacing: 0;
                width: 100%;
                margin: 16px 0;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            `,
            'body .markdown-body table th, body .markdown-body table td': `
                padding: 12px 16px;
                border: 1px solid #e1e4e8;
            `,
            'body .markdown-body table tr:nth-child(2n)': `
                background-color: rgba(246, 248, 250, 0.7);
            `,
            // 文章页面标题
            '.postTitle': `
                margin-bottom: 24px !important;
                font-size: 2.2em !important;
                letter-spacing: -0.5px;
                line-height: 1.3;
                border-bottom: none !important;
                padding-bottom: 0 !important;
            `,
            // 评论按钮美化
            '#cmButton': `
                border-radius: 8px;
                font-size: 16px;
                transition: all 0.3s ease;
                background-color: #0366d6;
                border-color: #0366d6;
                box-shadow: 0 2px 6px rgba(3, 102, 214, 0.3);
            `,
            '#cmButton:hover': `
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(3, 102, 214, 0.4);
                background-color: #0969da;
                border-color: #0969da;
            `
        },
        // 分页页样式
        page: {}
    };

    // --- 辅助函数 ---

    // 检测是否为桌面设备（宽度≥768px）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

    // 生成CSS字符串的函数
    const generateCSS = (styles) => {
        return Object.entries(styles)
            .map(([selector, rules]) => {
                // 格式化CSS规则：去除空格并确保以分号结尾
                const formattedRules = rules.trim().endsWith(';')
                    ? rules.trim()
                    : `${rules.trim()};`;
                return `${selector} { ${formattedRules} }`;
            })
            .join('\n');
    };

    // 检测当前页面类型（首页/文章/分页）
    const getPageType = () => {
        const currentPath = window.location.pathname;
        const routePatterns = [
            { type: 'home', pattern: /^(\/|\/index\.html)$/ },    // 首页路由
            { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ }, // 文章路由
            { type: 'page', pattern: /\/page\d+\.html$/ }          // 分页路由
        ];
        return routePatterns.find(p => p.pattern.test(currentPath))?.type;
    };

    // 应用样式的核心函数
    const applyStyles = () => {
        // 如果不是桌面设备，直接返回，不应用任何样式
        if (!isDesktop()) {
            console.log('当前为不是桌面设备，使用默认样式');
            return;
        }

        const pageType = getPageType();
        console.log(`当前页面类型: ${pageType || '通用'}`);
        
        // 合并通用样式和页面专属样式
        let mergedStyles = { ...styleConfig.common };
        if (pageType && styleConfig[pageType]) {
            mergedStyles = { ...mergedStyles, ...styleConfig[pageType] };
        }

        // 创建并插入样式标签
        const cssString = generateCSS(mergedStyles);
        if (cssString) {
            // 给动态样式标签添加一个特定属性，以便在resize时区分
            const styleTag = document.createElement('style');
            styleTag.setAttribute('data-dynamic-theme-style', 'true'); 
            styleTag.textContent = cssString;
            document.head.appendChild(styleTag);
            console.log('桌面端样式已成功应用');
        }
    };

    // --- Matrix Rain Animation ---
    function setupMatrixRain() {
        // 创建 canvas 元素
        const canvas = document.createElement('canvas');
        canvas.id = 'matrixRain';
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');

        // 设置 canvas 尺寸为窗口大小
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 字符集（包含中文字符）
        const chars = '日月水木金火土天地人ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        
        // 每一列的当前位置
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        // 绘制数字雨
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // 添加发光效果
                ctx.shadowColor = '#0F0';
                ctx.shadowBlur = 5;
                ctx.fillText(text, x, y);
                ctx.shadowBlur = 0;

                // 随机改变字符颜色
                if (Math.random() > 0.95) {
                    ctx.fillStyle = '#FFF';
                } else {
                    ctx.fillStyle = '#0F0';
                }

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        // 动画循环
        setInterval(draw, 33);
    }

    // --- 执行逻辑 ---

    // 初始隐藏 GitHub Issue 按钮 (保留在最前面，因为它需要立即生效)
    const hideIssueButtonRule = `
        a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"] {
            display: none !important;
        }
    `;
    const issueButtonStyleTag = document.createElement('style');
    issueButtonStyleTag.id = 'hide-issue-button-style'; // 添加ID以便识别
    issueButtonStyleTag.textContent = hideIssueButtonRule;
    document.head.appendChild(issueButtonStyleTag);

    // 初始应用样式
    applyStyles();
    
    // 初始化数字雨动画
    setupMatrixRain();

    // 窗口大小变化时重新应用样式
    window.addEventListener('resize', () => {
        // 移除之前的动态样式
        const oldStyleTags = document.querySelectorAll('style[data-dynamic-theme-style="true"]');
        oldStyleTags.forEach(tag => tag.remove());
        
        // 重新应用样式
        applyStyles();
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTheme);
} else {
    runTheme();
}
