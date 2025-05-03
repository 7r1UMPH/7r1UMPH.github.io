// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 检测是否为桌面设备（宽度≥768px）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

    // 无论设备类型如何，始终隐藏 GitHub Issue 按钮
    const hideIssueButtonRule = `
        a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"] {
            display: none !important;
        }
    `;
    const issueButtonStyleTag = document.createElement('style');
    issueButtonStyleTag.textContent = hideIssueButtonRule;
    document.head.appendChild(issueButtonStyleTag);
    console.log('GitHub Issue 按钮隐藏规则已全局应用');

    // 获取当前页面路径
    const currentPath = window.location.pathname;

    // 桌面端样式配置对象
    const desktopStyleConfig = {
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
                padding: 4px a8px;
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

    // 手机端样式配置对象
    const mobileStyleConfig = {
        // 通用样式（适用于所有页面）
        common: {
            // 页面主体样式
            'body': `
                min-width: unset;      // 移除最小宽度限制
                max-width: 100%;       // 最大宽度100%以适应屏幕
                margin: 15px 10px;     // 减小边距
                padding: 15px;         // 内边距
                font-size: 16px;       // 缩小字体
                line-height: 1.5;
                background: rgba(250, 250, 250, 0.92);
                border-radius: 12px;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                overflow: auto;
            `,
            // 侧边导航栏样式 - 优化手机端显示
            '.SideNav': `
                background: rgba(255, 255, 255, 0.8);
                border-radius: 8px;
                margin-bottom: 12px;
                padding: 1px; 
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.18);
                transition: all 0.3s ease;
                box-sizing: border-box;
                width: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            `,
            // 处理 border 类与 SideNav 的组合
            '.SideNav.border': `
                border: 1px solid rgba(0, 0, 0, 0.06) !important;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
            `,
            '.SideNav-item': `
                padding: 8px 8px;
                font-size: 15px;
                margin: 2px 3px;
                border-radius: 6px;
                transition: all 0.2s ease-in-out;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: block;
            `,
            '.SideNav-item:hover': `
                background-color: rgba(195, 228, 227, 0.5);
                transform: translateX(3px);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            `,
            // 特殊文本块样式
            'div[style*="margin-bottom: 16px"]': `
                font-family:
                    '华文行楷',
                    'STKaiti',
                    'Noto Serif CJK SC',
                    'WenQuanYi Micro Hei',
                    serif;
                font-size: 1.2em;
                color: rgb(0, 0, 0);
                text-shadow:
                    1px 1px 2px rgba(107, 70, 70, 0.2),
                    -1px -1px 1px rgba(255, 255, 255, 0.5);
                letter-spacing: 0.08em;
                line-height: 1.6;
                margin-bottom: 12px !important;
                padding: 10px 12px;
                background: rgba(255, 255, 255, 0.55);
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                border-left: 3px solid #0366d6;
            `,
            // 全局调整内边距
            '.container-lg': `
                padding-left: 12px !important;
                padding-right: 12px !important;
            `,
            // 适应性调整图片
            'img': `
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                transition: transform 0.2s ease;
            `,
            'img:hover': `
                transform: scale(1.02);
            `,
            // 标签样式优化
            '.Label': `
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 12px;
                margin-right: 4px;
                display: inline-block;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease;
            `,
            '.Label:hover': `
                transform: scale(1.05);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
            `,
            // 文章列表优化
            '.listTitle': `
                font-weight: 500;
                margin-bottom: 2px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                transition: color 0.2s ease;
            `,
            '.SideNav-item:hover .listTitle': `
                color: #0366d6;
            `,
            // 链接样式美化
            'a': `
                transition: all 0.2s ease;
                text-decoration: none;
            `,
            'a:hover': `
                text-decoration: underline;
                color: #0969da;
            `,
            // 头部和尾部优化
            '#header': `
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-bottom: 12px;
                margin-bottom: 16px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            `,
            '#footer': `
                margin-top: 40px;
                padding: 12px 8px;
                font-size: 12px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                text-align: center;
            `,
            '#footer a': `
                color: #0366d6;
                font-weight: 500;
            `
        },
        // 首页专属样式
        home: {
            '#header': `
                height: auto; // 自适应高度
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 15px 0 20px;
                margin-bottom: a5px;
            `,
            '#header h1': `
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 15px;
            `,
            '#header .avatar': ` // 更精确的选择器，只隐藏首页头部的头像
                width: 120px;  // 缩小头像
                height: 120px;
                border-radius: 50%;
                object-fit: cover;
                display: none; // 在手机端首页隐藏头像
                margin: 0 auto 15px auto;
                border: 3px solid rgba(255, 255, 255, 0.7);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            `,
            '#header h1 a': `
                margin-top: 10px;
                font-family: fantasy;
                margin-left: unset;
                font-size: 32px;
                background: linear-gradient(45deg, #0366d6, #8250df);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            `
        },
        // 文章页专属样式
        article: {
            'body': `
                max-width: 100%;
                margin: 15px 10px;
                font-size: 16px;
                line-height: 1.25;
                background: rgba(250, 250, 250, 0.92);
                border-radius: 12px;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                overflow: auto;
                padding: 15px;
            `,
            'body .markdown-body': `
                font-size: 16px !important;  
                line-height: 1.5 !important;
                color: #24292f;
            `,
            // 文章标题样式（h1-h6）
            'body .markdown-body h1, body .markdown-body h2, body .markdown-body h3, body .markdown-body h4, body .markdown-body h5, body .markdown-body h6, h1.postTitle': `
                font-family: '华文新魏', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif !important;
                margin-top: 1.2em !important;
                margin-bottom: 0.7em !important;
                font-weight: 600 !important;
                line-height: 1.3 !important;
                color: #24292f;
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                padding-bottom: 0.3em;
            `,
            // 文章内容优化
            'body .markdown-body p': `
                margin-bottom: 0.8em !important;
                text-align: justify;
            `,
            // 代码块优化
            'body .markdown-body pre': `
                border-radius: 6px;
                margin-bottom: 1em !important;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
                font-size: 14px !important;
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
            // 内联代码
            'body .markdown-body code': `
                background-color: rgba(175, 184, 193, 0.2);
                border-radius: 4px;
                padding: 2px 5px;
            `,
            // 表格优化
            'body .markdown-body table': `
                display: block;
                width: 100%;
                overflow-x: auto;
                border-radius: 6px;
                margin-bottom: 1em !important;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
                border-collapse: separate;
                border-spacing: 0;
            `,
            'body .markdown-body table th, body .markdown-body table td': `
                padding: 8px 10px;
                border: 1px solid #e1e4e8;
            `,
            // 图片优化
            'body .markdown-body img': `
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                display: block;
                margin: 14px auto;
                max-width: 100%;
                transition: transform 0.2s ease;
            `,
            'body .markdown-body img:hover': `
                transform: scale(1.01);
            `,
            // 文章页面头像
            '.postTitle': `
                font-size: 22px !important;
                line-height: 1.3;
                word-break: break-word;
                padding-right: 10px;
                margin-bottom: 20px !important;
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
                background-color: #0969da;
                border-color: #0969da;
                box-shadow: 0 3px 8px rgba(3, 102, 214, 0.4);
            `
        },
        // 分页页样式
        page: {}
    };

    const updateQuoteDiv = async () => {
        try {
            const response = await fetch('https://www.wniui.com/api/yiyan/index.php');
            const data = await response.json();
            const quoteDivs = document.querySelectorAll('div[style*="margin-bottom: 16px"]');
            
            quoteDivs.forEach(div => {
                div.textContent = data.data || "默认文本，API无返回时显示";
            });
        } catch (error) {
            console.error('获取名言API失败:', error);
        }
    };

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
        const routePatterns = [
            { type: 'home', pattern: /^(\/|\/index\.html)$/ },    // 首页路由
            { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ }, // 文章路由
            { type: 'page', pattern: /\/page\d+\.html$/ }          // 分页路由
        ];
        return routePatterns.find(p => p.pattern.test(currentPath))?.type;
    };

    // 应用样式的核心函数
    const applyStyles = () => {
        const pageType = getPageType();
        console.log(`当前页面类型: ${pageType || '通用'}`);
        
        // 基于设备类型选择样式配置
        const styleConfig = isDesktop() ? desktopStyleConfig : mobileStyleConfig;
        console.log(`应用${isDesktop() ? '桌面端' : '手机端'}样式`);

        // 合并通用样式和页面专属样式
        let mergedStyles = { ...styleConfig.common };
        if (pageType && styleConfig[pageType]) {
            mergedStyles = { ...mergedStyles, ...styleConfig[pageType] };
        }

        // 添加全局背景样式
        mergedStyles['html'] = `
            background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp')
                no-repeat center center fixed;
            background-size: cover;
            scroll-behavior: smooth;
        `;

        // 创建并插入样式标签
        const cssString = generateCSS(mergedStyles);
        if (cssString) {
            const styleTag = document.createElement('style');
            styleTag.textContent = cssString;
            document.head.appendChild(styleTag);
            console.log(`${isDesktop() ? '桌面端' : '手机端'}样式已成功应用`);
        }
    };

    // 执行样式应用
    applyStyles();

    // 窗口大小变化时重新应用样式
    window.addEventListener('resize', () => {
        // 移除之前的样式
        const oldStyleTags = document.querySelectorAll('style:not([id])');
        // 保留第一个样式标签（GitHub Issue 按钮隐藏规则）
        for (let i = 1; i < oldStyleTags.length; i++) {
            oldStyleTags[i].remove();
        }
        // 重新应用样式
        applyStyles();
    });

    updateQuoteDiv();
});
