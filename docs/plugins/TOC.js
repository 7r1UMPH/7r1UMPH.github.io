function createTOC() {
    // 如果已存在TOC则不再创建
    if (document.getElementById('toc')) {
        return;
    }
    
    var tocElement = document.createElement('div');
    tocElement.className = 'toc';
    tocElement.id = 'toc';
    
    var contentContainer = document.getElementById('content');
    if (!contentContainer) return;
    
    const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length < 3) {
        return; // 如果标题太少，不创建目录
    }
    
    // 添加TOC标题栏，包括标题和折叠按钮
    const tocHeader = document.createElement('div');
    tocHeader.className = 'toc-header';
    tocHeader.innerHTML = `
        <div class="toc-title">文章目录</div>
        <button class="toc-toggle" title="折叠/展开目录">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
    `;
    tocElement.appendChild(tocHeader);
    
    // 创建目录内容容器
    const tocContent = document.createElement('div');
    tocContent.className = 'toc-content';
    tocElement.appendChild(tocContent);
    
    // 创建TOC项目
    let minLevel = 6; // 初始化为最大可能值
    headings.forEach(heading => {
        // 为没有ID的标题生成ID
        if (!heading.id) {
            const id = heading.textContent.trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
            heading.id = id || `heading-${Math.random().toString(36).substr(2, 9)}`;
        }
        
        // 计算最小标题级别，用于缩进计算
        const level = parseInt(heading.tagName.charAt(1));
        minLevel = Math.min(minLevel, level);
        
        // 创建目录项
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.className = 'toc-link toc-level-' + level;
        link.dataset.level = level;
        
        // 计算缩进
        const indent = (level - minLevel) * 12;
        link.style.paddingLeft = `${indent}px`;
        
        // 添加到目录内容
        tocContent.appendChild(link);
        
        // 为标题添加返回目录按钮
        heading.innerHTML += `<a href="#toc" class="heading-anchor" title="返回目录">#</a>`;
    });
    
    // 添加回到顶部按钮
    const backToTop = document.createElement('a');
    backToTop.className = 'toc-top';
    backToTop.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        <span>回到顶部</span>
    `;
    backToTop.onclick = function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    tocElement.appendChild(backToTop);
    
    // 添加目录到内容区域前
    contentContainer.insertBefore(tocElement, contentContainer.firstChild);
    
    // 添加折叠/展开功能
    const tocToggle = tocElement.querySelector('.toc-toggle');
    tocToggle.addEventListener('click', function() {
        tocElement.classList.toggle('toc-collapsed');
        localStorage.setItem('tocCollapsed', tocElement.classList.contains('toc-collapsed'));
    });
    
    // 检查本地存储的目录状态
    if (localStorage.getItem('tocCollapsed') === 'true') {
        tocElement.classList.add('toc-collapsed');
    }
    
    // 添加平滑滚动和激活状态
    setupTOCScrolling(tocElement);
}

function setupTOCScrolling(tocElement) {
    const tocLinks = tocElement.querySelectorAll('.toc-link');
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    // 为目录链接添加平滑滚动
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
                
                // 更新URL，但不滚动
                history.pushState(null, null, '#' + targetId);
            }
        });
    });
    
    // 更新激活状态
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        // 找到当前可见的标题
        let currentHeading = null;
        for (let i = 0; i < headings.length; i++) {
            if (headings[i].offsetTop <= scrollPosition) {
                currentHeading = headings[i];
            } else {
                break;
            }
        }
        
        // 更新激活的目录链接
        if (currentHeading) {
            tocLinks.forEach(link => {
                link.classList.remove('active');
                
                const href = link.getAttribute('href');
                if (href === '#' + currentHeading.id) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // 监听滚动更新激活状态
    window.addEventListener('scroll', debounce(updateActiveLink, 100));
    updateActiveLink(); // 初始化时执行一次
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

document.addEventListener("DOMContentLoaded", function() {
    const isDesktop = window.innerWidth >= 768;
    const isArticlePage = document.querySelector('.markdown-body');
    
    // 仅在文章页面创建目录
    if (isArticlePage) {
        createTOC();
        
        // 文章页添加阅读进度条
        addReadingProgressBar();
        
        // 文章页添加代码块复制按钮
        addCodeCopyButtons();
    }
    
    // 添加CSS样式
    var css = `
    /* TOC 样式 */
    .toc {
        position: fixed;
        top: 30px;
        left: calc(50% + 510px);
        width: 250px;
        background: rgba(250, 250, 250, 0.92);
        border-radius: 12px;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        max-height: calc(100vh - 60px);
        z-index: 100;
        transition: all 0.3s ease;
    }
    
    .toc-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        background: rgba(52, 152, 219, 0.08);
    }
    
    .toc-title {
        font-weight: bold;
        color: #2c3e50;
        font-size: 15px;
    }
    
    .toc-toggle {
        background: none;
        border: none;
        cursor: pointer;
        color: #3498db;
        padding: 5px;
        margin: 0;
        border-radius: 4px;
        line-height: 0;
        transition: all 0.2s ease;
    }
    
    .toc-toggle:hover {
        background: rgba(52, 152, 219, 0.1);
    }
    
    .toc-content {
        padding: 10px 0;
        overflow-y: auto;
        max-height: calc(100vh - 130px);
        scrollbar-width: thin;
        scrollbar-color: #c1c1c1 #f8f9fa;
    }
    
    /* 自定义滚动条 */
    .toc-content::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    .toc-content::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }
    
    .toc-content::-webkit-scrollbar-track {
        background: #f8f9fa;
        border-radius: 3px;
    }
    
    .toc-link {
        display: block;
        padding: 6px 15px 6px 15px;
        color: #4a4a4a;
        text-decoration: none;
        font-size: 14px;
        line-height: 1.5;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: all 0.2s ease;
        border-left: 3px solid transparent;
    }
    
    .toc-link:hover {
        background-color: rgba(52, 152, 219, 0.05);
        color: #3498db;
    }
    
    .toc-link.active {
        background-color: rgba(52, 152, 219, 0.08);
        color: #3498db;
        border-left: 3px solid #3498db;
        font-weight: 500;
    }
    
    .toc-top {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        color: #3498db;
        text-decoration: none;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
        background: rgba(52, 152, 219, 0.05);
        cursor: pointer;
    }
    
    .toc-top svg {
        margin-right: 6px;
    }
    
    .toc-top:hover {
        background: rgba(52, 152, 219, 0.1);
    }
    
    /* 目录折叠状态 */
    .toc.toc-collapsed .toc-content {
        display: none;
    }
    
    .toc.toc-collapsed .toc-toggle svg {
        transform: rotate(180deg);
    }
    
    .toc.toc-collapsed {
        width: auto;
        background: rgba(250, 250, 250, 0.8);
    }
    
    /* 标题锚点 */
    .heading-anchor {
        opacity: 0;
        font-size: 0.8em;
        margin-left: 0.5em;
        text-decoration: none;
        color: rgba(52, 152, 219, 0.8);
        transition: opacity 0.2s;
    }
    
    h1:hover .heading-anchor,
    h2:hover .heading-anchor,
    h3:hover .heading-anchor,
    h4:hover .heading-anchor,
    h5:hover .heading-anchor,
    h6:hover .heading-anchor {
        opacity: 1;
    }
    
    /* 阅读进度条 */
    .reading-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(to right, #3498db, #9b59b6);
        z-index: 9999;
        width: 0;
        transition: width 0.1s;
    }
    
    /* 代码复制按钮 */
    .code-copy-button {
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 3px 8px;
        font-size: 12px;
        color: #aaa;
        background: rgba(0, 0, 0, 0.07);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s, background 0.2s;
    }
    
    pre:hover .code-copy-button {
        opacity: 1;
    }
    
    .code-copy-button:hover {
        background: rgba(0, 0, 0, 0.12);
        color: #fff;
    }
    
    .code-copy-button.copied {
        background: #27ae60;
        color: white;
    }
    
    /* 响应式布局 */
    @media (max-width: 1299px) {
        .toc {
            position: static;
            width: auto;
            max-width: 100%;
            margin: 0 0 30px 0;
            max-height: 400px;
        }
        
        .toc-content {
            max-height: 300px;
        }
    }
    
    @media (max-width: 768px) {
        .toc {
            margin: 0 0 20px 0;
            max-height: 300px;
        }
        
        .toc-content {
            max-height: 200px;
        }
        
        .toc-link {
            padding: 5px 12px 5px 12px;
            font-size: 13px;
        }
    }`;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
});

// 添加阅读进度条
function addReadingProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    document.body.appendChild(progressBar);
    
    // 更新进度条
    function updateProgressBar() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const readableHeight = scrollHeight - clientHeight;
        const progress = (scrollTop / readableHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
    
    window.addEventListener('scroll', updateProgressBar);
    window.addEventListener('resize', updateProgressBar);
    updateProgressBar(); // 初始加载时更新一次
}

// 为代码块添加复制按钮
function addCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(function(codeBlock) {
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-button';
        copyButton.textContent = '复制';
        
        codeBlock.style.position = 'relative';
        codeBlock.appendChild(copyButton);
        
        copyButton.addEventListener('click', function() {
            // 找到代码块中的代码
            const code = codeBlock.querySelector('code') 
                ? codeBlock.querySelector('code').innerText 
                : codeBlock.innerText;
            
            // 复制到剪贴板
            navigator.clipboard.writeText(code).then(function() {
                copyButton.textContent = '已复制!';
                copyButton.classList.add('copied');
                
                setTimeout(function() {
                    copyButton.textContent = '复制';
                    copyButton.classList.remove('copied');
                }, 2000);
            })
            .catch(function(err) {
                console.error('无法复制代码:', err);
                copyButton.textContent = '复制失败';
                
                setTimeout(function() {
                    copyButton.textContent = '复制';
                }, 2000);
            });
        });
    });
}

