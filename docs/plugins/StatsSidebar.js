/**
 * StatsSidebar.js
 * 创建一个侧边栏显示博客统计信息（运行天数、访问量等）
 * 并集成不蒜子统计脚本。
 * 适用于Gmeek博客系统，只在桌面端显示。
 */

document.addEventListener("DOMContentLoaded", function() {
    // --- 配置 ---
    const SIDEBAR_CONFIG = {
        startDate: '2024-10-12', // 博客开始运行日期
        avatarUrl: 'https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png', // 固定头像URL
        desktopMinWidth: 768, // 显示侧边栏的最小桌面宽度
        busuanziScriptUrl: 'https://cn.vercount.one/js' // 不蒜子统计脚本URL
    };

    // --- 辅助函数 ---

    /**
     * 注入侧边栏所需的样式到页面头部
     */
    function injectStyles() {
        if (document.getElementById('stats-sidebar-style')) return; // 防止重复注入

        const style = document.createElement('style');
        style.id = 'stats-sidebar-style';
        style.textContent = `
            .stats-sidebar {
                position: fixed;
                /* 动态计算left值，使其在内容左侧 */
                /* (视口宽度的一半 - 内容区宽度的一半 - 侧边栏宽度 - 间距) */
                /* 注意：这里的 510px 是基于 theme.js 中 article body max-width: 1000px 的一半 + padding 30px - body margin 30px，可能需要根据实际情况调整 */
                /* 885px (通用 body max-width) / 2 = 442.5px */
                /* 1000px (文章页 body max-width) / 2 = 500px */
                /* 这里暂时用一个可能的值，更可靠的方式是JS动态计算或CSS变量 */
                left: calc(50% - 442.5px - 200px - 20px); 
                top: 50%;
                transform: translateY(-50%);
                width: 200px;
                z-index: 990; /* 比 TOC 低一点？ */
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                transition: transform 0.3s ease, left 0.3s ease;
            }
            .stats-sidebar:hover {
                transform: translateY(-50%) scale(1.02);
            }
            .stats-card {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.75), rgba(245, 247, 240, 0.85));
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border-radius: 18px;
                padding: 20px 15px; /* 调整内边距 */
                box-shadow:
                    0 8px 15px rgba(0, 0, 0, 0.08),
                    0 0 0 1px rgba(0, 0, 0, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.2);
                overflow: hidden;
                transition: box-shadow 0.3s ease, background 0.3s ease;
            }
            .stats-card:hover {
                box-shadow:
                    0 12px 20px rgba(0, 0, 0, 0.1),
                    0 0 0 1px rgba(0, 0, 0, 0.04);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 243, 0.9));
            }
            .stats-avatar {
                display: flex;
                justify-content: center;
                margin-bottom: 18px;
            }
            .stats-avatar img {
                width: 80px; /* 缩小一点 */
                height: 80px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid rgba(255, 255, 255, 0.7);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
            }
            .stats-avatar img:hover {
                transform: scale(1.08) rotate(5deg);
                border-color: rgba(255, 255, 255, 0.9);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            }
            .stats-info {
                padding-top: 5px;
            }
            .stats-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px; /* 减小间距 */
                padding: 6px 8px; /* 减小内边距 */
                background: rgba(255, 255, 255, 0.4);
                border-radius: 10px;
                transition: all 0.2s ease;
            }
            .stats-item:last-child {
                margin-bottom: 0;
            }
            .stats-item:hover {
                background: rgba(255, 255, 255, 0.7);
                transform: translateX(4px);
            }
            .stats-icon {
                font-size: 18px; /* 稍微增大图标 */
                margin-right: 10px;
                width: 20px; /* 固定宽度方便对齐 */
                text-align: center;
            }
            .stats-text {
                font-size: 13px; /* 缩小字体 */
                color: #444; /* 加深颜色 */
                flex-grow: 1; /* 占据剩余空间 */
            }
            .stats-value {
                font-weight: bold;
                color: #0d6efd; /* 使用 Bootstrap 蓝色 */
                margin-left: 4px; /* 与文字间距 */
            }

            /* 当屏幕宽度不足以显示侧边栏时，将其隐藏 */
            /* theme.js 中已有媒体查询处理 body 宽度，这里直接隐藏 */
            @media (max-width: ${SIDEBAR_CONFIG.desktopMinWidth - 1}px) {
                 /* 隐藏侧边栏，或者可以考虑移到页面底部 */
                .stats-sidebar {
                    display: none; 
                }
            }
             /* 针对特定宽度的微调，确保不与主要内容重叠 */
             /* 这些值需要根据 theme.js 中的布局来精确调整 */
            @media (min-width: ${SIDEBAR_CONFIG.desktopMinWidth}px) and (max-width: 1350px) {
                .stats-sidebar {
                     /* 在较窄的桌面视图中，可能需要调整 left 值 */
                    left: 15px; /* 或者调整为更合适的边缘距离 */
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 创建并插入侧边栏 DOM 元素
     */
    function createStatsSidebar() {
        if (document.querySelector('.stats-sidebar')) return; // 如果已存在则不创建

        const sidebar = document.createElement('div');
        sidebar.className = 'stats-sidebar';

        // 检查是否为文章页面 (简单判断)
        const isArticlePage = window.location.pathname.includes('/post/');

        // 计算运行天数
        let runDays = 'N/A';
        try {
            const startDate = new Date(SIDEBAR_CONFIG.startDate);
            const today = new Date();
            // 检查日期是否有效
            if (!isNaN(startDate.getTime())) {
                runDays = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));
            } else {
                console.error('StatsSidebar.js: 无效的启动日期配置。');
            }
        } catch (e) {
            console.error('StatsSidebar.js: 计算运行天数时出错。', e);
        }

        // 构建侧边栏内部 HTML
        // 使用 span 标签包裹不蒜子数据，不蒜子脚本会自动填充内容
        sidebar.innerHTML = `
            <div class="stats-card">
                <div class="stats-avatar">
                    <img src="${SIDEBAR_CONFIG.avatarUrl}" alt="博客头像" loading="lazy">
                </div>
                <div class="stats-info">
                    <div class="stats-item">
                        <span class="stats-icon">📅</span>
                        <span class="stats-text">已运行 <span class="stats-value">${runDays}</span> 天</span>
                    </div>
                    <div class="stats-item" id="busuanzi_container_site_pv">
                        <span class="stats-icon">👁️</span>
                        <span class="stats-text">总访问 <span id="busuanzi_value_site_pv" class="stats-value"><i class="loading-icon"></i></span></span>
                    </div>
                    <div class="stats-item" id="busuanzi_container_site_uv">
                        <span class="stats-icon">👤</span>
                        <span class="stats-text">访客数 <span id="busuanzi_value_site_uv" class="stats-value"><i class="loading-icon"></i></span></span>
                    </div>
                    ${isArticlePage ? `
                        <div class="stats-item" id="busuanzi_container_page_pv">
                            <span class="stats-icon">📖</span>
                            <span class="stats-text">阅读量 <span id="busuanzi_value_page_pv" class="stats-value"><i class="loading-icon"></i></span></span>
                        </div>
                    ` : ''}
                </div>
            </div>
            <!-- 可以添加加载中的简单动画样式 -->
            <style>
                .loading-icon {
                    display: inline-block;
                    width: 1em;
                    height: 1em;
                    border: 2px solid currentColor;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: spin 1s linear infinite;
                    opacity: 0.6;
                    vertical-align: middle;
                    margin-left: 3px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;

        document.body.appendChild(sidebar);
        console.log('StatsSidebar.js: 侧边栏已创建。');
    }

    /**
     * 加载不蒜子统计脚本
     */
    function loadBusuanziScript() {
        if (document.querySelector(`script[src="${SIDEBAR_CONFIG.busuanziScriptUrl}"]`)) {
            console.log('StatsSidebar.js: 不蒜子脚本已加载。');
            return; // 防止重复加载
        }
        const script = document.createElement('script');
        script.src = SIDEBAR_CONFIG.busuanziScriptUrl;
        script.async = true; // 异步加载
        script.onerror = () => {
            console.error('StatsSidebar.js: 加载不蒜子脚本失败。');
            // 可以在此处移除加载动画或显示错误信息
            document.querySelectorAll('.loading-icon').forEach(icon => icon.style.display = 'none');
        };
        script.onload = () => {
             console.log('StatsSidebar.js: 不蒜子脚本加载成功。');
             // 不蒜子脚本加载后会自动查找并填充带有特定ID的元素
             // 但有时可能需要手动触发一次计数（如果脚本内部没有自动执行）
             // if (typeof bszCaller !== 'undefined') { bszCaller.fetch(); }
        };
        document.head.appendChild(script);
    }

    // --- 初始化逻辑 ---

    // 仅在桌面端执行
    if (window.innerWidth >= SIDEBAR_CONFIG.desktopMinWidth) {
        console.log('StatsSidebar.js: 检测到桌面环境，开始初始化。');
        injectStyles();
        createStatsSidebar();
        loadBusuanziScript();
    } else {
        console.log('StatsSidebar.js: 检测到移动环境，不加载侧边栏。');
    }

    // 可选：监听窗口大小变化，以便在调整大小时处理侧边栏（例如，从移动端调整到桌面端）
    // 但简单的做法是刷新页面时重新判断
    /*
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth >= SIDEBAR_CONFIG.desktopMinWidth) {
                if (!document.querySelector('.stats-sidebar')) {
                    console.log('StatsSidebar.js: 窗口调整到桌面尺寸，重新初始化。');
                    injectStyles();
                    createStatsSidebar();
                    loadBusuanziScript();
                }
            } else {
                const sidebar = document.querySelector('.stats-sidebar');
                if (sidebar) {
                    console.log('StatsSidebar.js: 窗口调整到移动尺寸，移除侧边栏。');
                    sidebar.remove();
                    // 注意：样式和脚本通常不需要移除
                }
            }
        }, 250); // debounce
    });
    */
});
