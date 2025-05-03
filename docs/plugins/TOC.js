/**
 * TOC.js
 * 自动生成文章目录（Table of Contents）
 * 支持桌面端固定侧边栏和移动端弹出式菜单。
 * 适用于Gmeek博客系统。
 */

document.addEventListener("DOMContentLoaded", function() {
    const contentContainer = document.getElementById('content'); // 缓存内容容器
    const tocStyleId = 'toc-style'; // 样式标签ID
    const desktopMinWidth = 768; // 区分桌面和移动端的宽度阈值

    // 如果没有内容容器，则不执行任何操作
    if (!contentContainer) {
        console.warn('TOC.js: 未找到 #content 元素。');
        return;
    }

    // --- 辅助函数 ---

    /**
     * 为标题元素生成唯一的 ID (如果不存在)
     * @param {HTMLElement} heading - 标题元素 (h1-h6)
     * @returns {string} - 生成或已有的 ID
     */
    function generateHeadingId(heading) {
        if (heading.id) return heading.id;
        // 生成 ID：使用文本内容，替换空格为连字符，转小写，并添加前缀避免潜在冲突
        let id = 'toc-' + (heading.textContent || '').trim().replace(/\s+/g, '-').toLowerCase();
        // 移除或替换可能无效的字符 (例如，保留字母、数字、连字符、下划线)
        id = id.replace(/[^a-z0-9\-_]/g, '-');
        // 确保 ID 唯一
        let counter = 1;
        let uniqueId = id;
        while (document.getElementById(uniqueId)) {
            uniqueId = `${id}-${counter++}`;
        }
        heading.id = uniqueId;
        return uniqueId;
    }

    /**
     * 注入目录所需的 CSS 样式
     */
    function injectStyles() {
        if (document.getElementById(tocStyleId)) return;

        const css = `
            /* --- 通用 TOC 基础样式 --- */
            .toc-link, .mobile-toc-link {
                display: block;
                text-decoration: none;
                transition: all 0.2s ease;
                line-height: 1.6;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            /* --- 桌面端 TOC 样式 --- */
            @media (min-width: ${desktopMinWidth}px) {
                .toc-container {
                    position: fixed;
                    /* left 计算方式同 StatsSidebar.js，确保在内容右侧 */
                    left: calc(50% + 442.5px + 20px); /* 假设通用内容宽度为 885px */
                    /* 针对文章页调整 (max-width: 1000px) */
                    body.is-article & { 
                         left: calc(50% + 500px + 20px); /* 文章页内容宽度 1000px / 2 = 500px */
                    }
                    top: 50px; /* 顶部距离 */
                    width: 230px;
                    max-height: calc(100vh - 100px); /* 限制最大高度，留出上下边距 */
                    background: rgba(248, 250, 252, 0.85);
                    border-radius: 10px;
                    padding: 15px 10px; /* 内边距 */
                    overflow-y: auto;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0,0,0,0.2) rgba(0,0,0,0.05);
                    z-index: 995; /* 比 stats-sidebar 高一点？ */
                    transition: left 0.3s ease;
                }

                .toc-container::-webkit-scrollbar {
                    width: 6px;
                }

                .toc-container::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.2);
                    border-radius: 3px;
                }

                .toc-container::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 0 10px 10px 0;
                }

                .toc-title {
                    font-weight: bold;
                    text-align: center;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                    font-size: 1.1em;
                    color: var(--color-fg-default);
                }

                .toc-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .toc-item {
                    margin-bottom: 2px; /* 项目间距 */
                }
                
                .toc-link {
                    color: var(--color-fg-muted); /* 默认颜色 */
                    padding: 6px 10px; /* 内边距 */
                    font-size: 14px;
                    border-radius: 5px;
                }
                
                .toc-link:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                    color: var(--color-accent-fg);
                }
                /* 根据标题级别添加缩进 */
                .toc-link.level-1 { padding-left: 10px; }
                .toc-link.level-2 { padding-left: 20px; }
                .toc-link.level-3 { padding-left: 30px; }
                .toc-link.level-4 { padding-left: 40px; }
                .toc-link.level-5 { padding-left: 50px; }
                .toc-link.level-6 { padding-left: 60px; }

                .toc-top-link {
                    display: block;
                    text-align: center;
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                    font-size: 14px;
                    color: var(--color-accent-fg);
                    cursor: pointer;
                    font-weight: 500;
                }
                .toc-top-link:hover {
                    text-decoration: underline;
                }
            }

            /* --- 移动端 TOC 样式 --- */
            @media (max-width: ${desktopMinWidth - 1}px) {
                .mobile-toc-float-button {
                    position: fixed;
                    bottom: 85px; /* 调整位置，避免和返回顶部重叠 */
                    right: 15px;
                    width: 48px;
                    height: 48px;
                    background-color: var(--color-accent-emphasis, #0366d6);
                    border-radius: 50%;
                    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.3s ease;
                    border: 2px solid white;
                }

                .mobile-toc-float-button:hover {
                    background-color: var(--color-accent-fg, #0969da);
                    transform: scale(1.05);
                }

                .hamburger {
                    width: 22px;
                    height: 18px;
                    position: relative;
                }

                .hamburger span {
                    display: block;
                    position: absolute;
                    height: 3px; /* 加粗线条 */
                    width: 100%;
                    background: white;
                    border-radius: 3px;
                    left: 0;
                    transition: all 0.3s ease;
                }
                .hamburger span:nth-child(1) { top: 0; }
                .hamburger span:nth-child(2) { top: 7px; }
                .hamburger span:nth-child(3) { top: 14px; }
                
                /* 目录打开时的按钮动画 */
                .mobile-toc-float-button.active .hamburger span:nth-child(1) {
                    top: 7px;
                    transform: rotate(45deg);
                }
                 .mobile-toc-float-button.active .hamburger span:nth-child(2) {
                    opacity: 0;
                }
                 .mobile-toc-float-button.active .hamburger span:nth-child(3) {
                    top: 7px;
                    transform: rotate(-45deg);
                }

                .mobile-top-button {
                    position: fixed;
                    bottom: 25px;
                    right: 15px;
                    width: 48px;
                    height: 48px;
                    background-color: rgba(0, 0, 0, 0.4);
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s, visibility 0.3s, background-color 0.3s;
                    border: 2px solid white;
                }
                .mobile-top-button.active {
                    opacity: 1;
                    visibility: visible;
                }
                .mobile-top-button svg {
                    width: 24px;
                    height: 24px;
                    stroke: white;
                    stroke-width: 2.5;
                }
                .mobile-top-button:hover {
                     background-color: rgba(0, 0, 0, 0.6);
                }

                .mobile-toc-container {
                    position: fixed;
                    top: 0;
                    left: -100%; /* 初始隐藏在左侧 */
                    width: 85%;
                    max-width: 300px;
                    height: 100%;
                    background-color: #fff;
                    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
                    z-index: 1001; /* 比按钮高 */
                    transition: left 0.3s ease-in-out;
                    display: flex;
                    flex-direction: column;
                }

                .mobile-toc-container.active {
                    left: 0;
                }
                
                /* 遮罩层 */
                .mobile-toc-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s, visibility 0.3s;
                }
                .mobile-toc-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }

                .mobile-toc-header {
                    padding: 15px;
                    font-size: 1.2em;
                    font-weight: bold;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: var(--color-fg-default);
                }

                .mobile-toc-close {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #888;
                    cursor: pointer;
                    padding: 5px 10px;
                }
                .mobile-toc-close:hover {
                    color: #333;
                }

                .mobile-toc-content {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 10px 0;
                }
                
                .mobile-toc-link {
                    color: #333;
                    padding: 10px 15px;
                    font-size: 1em;
                    border-bottom: 1px solid #f0f0f0;
                }
                .mobile-toc-link:last-child {
                     border-bottom: none;
                }

                .mobile-toc-link:hover {
                    background-color: #f5f5f5;
                    color: var(--color-accent-fg);
                }
                /* 根据标题级别添加缩进 */
                .mobile-toc-link.level-1 { padding-left: 15px; }
                .mobile-toc-link.level-2 { padding-left: 25px; }
                .mobile-toc-link.level-3 { padding-left: 35px; }
                .mobile-toc-link.level-4 { padding-left: 45px; }
                .mobile-toc-link.level-5 { padding-left: 55px; }
                .mobile-toc-link.level-6 { padding-left: 65px; }

                .mobile-toc-empty {
                    padding: 20px;
                    text-align: center;
                    color: #888;
                }
            }
        `;

        const styleTag = document.createElement('style');
        styleTag.id = tocStyleId;
        styleTag.textContent = css;
        document.head.appendChild(styleTag);
    }

    /**
     * 创建桌面端 TOC
     * @param {NodeListOf<Element>} headings - 页面中的标题元素
     */
    function createDesktopTOC(headings) {
        if (headings.length === 0) return; // 没有标题则不创建
        if (document.querySelector('.toc-container')) return; // 防止重复创建

        // 添加标记到 body，用于样式区分 (例如文章页的 left 值调整)
        if (window.location.pathname.includes('/post/')) {
             document.body.classList.add('is-article');
        } else {
             document.body.classList.remove('is-article');
        }

        const tocContainer = document.createElement('div');
        tocContainer.className = 'toc-container';

        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach(heading => {
            const id = generateHeadingId(heading);
            const level = parseInt(heading.tagName.charAt(1));

            const listItem = document.createElement('li');
            listItem.className = 'toc-item';

            const link = document.createElement('a');
            link.href = '#' + id;
            link.textContent = heading.textContent || '';
            link.className = `toc-link level-${level}`;
            link.title = heading.textContent || ''; // 添加 title 属性

            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });

        // 添加标题和返回顶部链接
        tocContainer.innerHTML = '<div class="toc-title">文章目录</div>';
        tocContainer.appendChild(tocList);
        
        const topLink = document.createElement('a');
        topLink.textContent = '返回顶部';
        topLink.className = 'toc-top-link';
        topLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
        tocContainer.appendChild(topLink);

        // 将TOC添加到body，而不是content内部，避免随内容滚动
        document.body.appendChild(tocContainer);
        console.log(`TOC.js: 桌面端目录已创建，包含 ${headings.length} 个项目。`);
    }

    /**
     * 创建移动端 TOC
     * @param {NodeListOf<Element>} headings - 页面中的标题元素
     */
    function createMobileTOC(headings) {
        if (document.querySelector('.mobile-toc-float-button')) return; // 防止重复创建

        // 1. 创建浮动菜单按钮
        const floatButton = document.createElement('div');
        floatButton.className = 'mobile-toc-float-button';
        floatButton.title = '目录';
        floatButton.innerHTML = '<div class="hamburger"><span></span><span></span><span></span></div>';
        document.body.appendChild(floatButton);

        // 2. 创建回到顶部按钮
        const topButton = document.createElement('div');
        topButton.className = 'mobile-top-button';
        topButton.title = '回到顶部';
        topButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        topButton.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
        document.body.appendChild(topButton);

        // 3. 创建目录容器 (初始隐藏)
        const mobileTocContainer = document.createElement('div');
        mobileTocContainer.className = 'mobile-toc-container';
        mobileTocContainer.innerHTML = `
            <div class="mobile-toc-header">文章目录<span class="mobile-toc-close" title="关闭">×</span></div>
            <div class="mobile-toc-content"></div>
        `;
        document.body.appendChild(mobileTocContainer);
        const tocContentElement = mobileTocContainer.querySelector('.mobile-toc-content');

        // 4. 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'mobile-toc-overlay';
        document.body.appendChild(overlay);

        // 5. 填充目录内容
        if (headings.length > 0) {
            headings.forEach(heading => {
                const id = generateHeadingId(heading);
                const level = parseInt(heading.tagName.charAt(1));

                const link = document.createElement('a');
                link.href = '#' + id;
                link.textContent = heading.textContent || '';
                link.className = `mobile-toc-link level-${level}`;
                link.title = heading.textContent || '';
                
                // 点击链接后关闭目录
                link.addEventListener('click', closeMobileToc);

                tocContentElement.appendChild(link);
            });
            console.log(`TOC.js: 移动端目录已创建，包含 ${headings.length} 个项目。`);
        } else {
            tocContentElement.innerHTML = '<div class="mobile-toc-empty">当前页面无目录</div>';
            console.log('TOC.js: 移动端目录内容为空。');
        }

        // --- 事件处理 ---
        function openMobileToc() {
            mobileTocContainer.classList.add('active');
            overlay.classList.add('active');
            floatButton.classList.add('active'); // 按钮动画
        }

        function closeMobileToc() {
            mobileTocContainer.classList.remove('active');
            overlay.classList.remove('active');
            floatButton.classList.remove('active'); // 按钮动画恢复
        }
        
        floatButton.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止事件冒泡
            if (mobileTocContainer.classList.contains('active')) {
                closeMobileToc();
            } else {
                openMobileToc();
            }
        });

        mobileTocContainer.querySelector('.mobile-toc-close').addEventListener('click', closeMobileToc);
        overlay.addEventListener('click', closeMobileToc); // 点击遮罩层关闭

        // 监听滚动显示/隐藏回到顶部按钮
        let lastScrollY = window.scrollY;
        let ticking = false;
        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (lastScrollY > 300) {
                        topButton.classList.add('active');
                    } else {
                        topButton.classList.remove('active');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // --- 初始化逻辑 ---

    injectStyles(); // 无论如何都先注入样式

    // 获取所有标题 (h1-h6)
    const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');

    // 根据屏幕宽度决定初始化哪个版本的TOC
    if (window.innerWidth >= desktopMinWidth) {
        console.log('TOC.js: 检测到桌面环境。');
        createDesktopTOC(headings);
    } else {
        console.log('TOC.js: 检测到移动环境。');
        createMobileTOC(headings);
    }

    // 可选：添加 resize 事件监听器以在调整大小时切换模式
    // 注意：这可能会导致重复创建或需要更复杂的清理逻辑
    /*
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const isDesktop = window.innerWidth >= desktopMinWidth;
            const desktopTocExists = document.querySelector('.toc-container');
            const mobileTocExists = document.querySelector('.mobile-toc-float-button');

            if (isDesktop && !desktopTocExists) {
                 // 从移动端切换到桌面端，移除移动端元素，创建桌面端
                 document.querySelector('.mobile-toc-float-button')?.remove();
                 document.querySelector('.mobile-top-button')?.remove();
                 document.querySelector('.mobile-toc-container')?.remove();
                 document.querySelector('.mobile-toc-overlay')?.remove();
                 createDesktopTOC(headings);
                 console.log('TOC.js: 切换到桌面模式');
            } else if (!isDesktop && !mobileTocExists) {
                 // 从桌面端切换到移动端，移除桌面端元素，创建移动端
                 document.querySelector('.toc-container')?.remove();
                 createMobileTOC(headings);
                 console.log('TOC.js: 切换到移动模式');
            }
        }, 250); // debounce
    });
    */
});

