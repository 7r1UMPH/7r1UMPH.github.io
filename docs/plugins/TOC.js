function createTOC() {
    var tocElement = document.createElement('div');
    tocElement.className = 'toc';
    
    var contentContainer = document.getElementById('content');
    
    const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
        return;
    }
    
    tocElement.insertAdjacentHTML('afterbegin', '<div class="toc-title">文章目录</div>');
    
    headings.forEach(heading => {
        if (!heading.id) {
            heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
        }
        
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        
        link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
        
        tocElement.appendChild(link);
    });
    
    tocElement.insertAdjacentHTML('beforeend', '<a class="toc-end" onclick="window.scrollTo({top:0,behavior: \'smooth\'});">Top</a>');
    
    contentContainer.prepend(tocElement);
}

document.addEventListener("DOMContentLoaded", function() {
    if (window.innerWidth < 768) {
        return;
    }
    
    createTOC();
    
    var css = `
    .toc {
        position: fixed;
        top: 30px;
        left: calc(50% + 510px);
        width: 230px;
        background: rgba(237, 239, 233, 0.84);
        border-radius: 10px;
        padding: 10px;
        overflow-y: auto;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        max-height: calc(100vh - 60px);
        scrollbar-width: thin;
        scrollbar-color: #c1c1c1 #f0f0f0;
    }

    .toc::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    .toc::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
        border: 1px solid #f0f0f0;
    }

    .toc::-webkit-scrollbar-track {
        background: #f0f0f0;
        border-radius: 0 10px 10px 0;
    }

    #content {
        position: relative;
    }
    
    .toc-title{
        font-weight: bold;
        text-align: center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 8px;
    }
    
    .toc-end{
        font-weight: bold;
        text-align: center;
        cursor: pointer;
        visibility: hidden;
    }  
    
    .toc a {
        display: block;
        color: var(--color-diff-blob-addition-num-text);
        text-decoration: none;
        padding: 5px 0;
        font-size: 14px;
        line-height: 1.5;
        border-bottom: 1px solid #e1e4e8;
    }
    
    .toc a:last-child {
        border-bottom: none;
    }
    
    .toc a:hover {
        background-color:var(--color-select-menu-tap-focus-bg);
    }

    @media (max-width: 1249px) 
    {
        .toc{
            position:static;
            top:auto;
            left:auto;
            transform:none;
            padding:10px;
            margin-bottom:20px;
        }
    }`;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    window.onscroll = function() {
        const backToTopButton = document.querySelector('.toc-end');
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style="visibility: visible;"
        } else {
            backToTopButton.style="visibility: hidden;"
        }
    };
});

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否为文章页面
    const isArticlePage = window.location.pathname.includes('/post/');
    if (!isArticlePage) return;
    
    // 查找Markdown内容
    const markdownBody = document.querySelector('.markdown-body');
    if (!markdownBody) return;
    
    // 查找所有标题元素
    const headings = markdownBody.querySelectorAll('h1, h2, h3, h4');
    if (headings.length < 3) return; // 如果标题少于3个，就不显示目录
    
    // 创建目录容器
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';
    tocContainer.innerHTML = `
        <div class="toc-header">
            <span class="toc-title">文章目录</span>
            <span class="toc-toggle">[-]</span>
        </div>
        <div class="toc-content"></div>
    `;
    
    // 创建目录内容
    const tocContent = tocContainer.querySelector('.toc-content');
    const tocItems = [];
    
    headings.forEach((heading, index) => {
        // 为每个标题添加ID，如果没有的话
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        // 确定标题级别
        const level = parseInt(heading.tagName.charAt(1));
        
        // 创建目录项
        const tocItem = document.createElement('div');
        tocItem.className = `toc-item level-${level}`;
        tocItem.innerHTML = `<a href="#${heading.id}">${heading.textContent}</a>`;
        
        // 根据级别添加缩进
        tocItem.style.paddingLeft = `${(level - 1) * 15}px`;
        
        // 添加到目录内容
        tocContent.appendChild(tocItem);
        tocItems.push(tocItem);
        
        // 为标题添加点击返回目录的功能
        heading.style.cursor = 'pointer';
        heading.addEventListener('click', function() {
            tocContainer.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // 插入到正文开始前
    markdownBody.insertBefore(tocContainer, markdownBody.firstChild);
    
    // 添加目录折叠功能
    const tocHeader = tocContainer.querySelector('.toc-header');
    const tocToggle = tocContainer.querySelector('.toc-toggle');
    
    tocHeader.addEventListener('click', function() {
        tocContent.style.display = tocContent.style.display === 'none' ? 'block' : 'none';
        tocToggle.textContent = tocContent.style.display === 'none' ? '[+]' : '[-]';
    });
    
    // 添加目录固定功能（仅桌面版）
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
        // 在桌面模式下修改为固定侧边栏样式
        let tocFixed = false;
        
        window.addEventListener('scroll', function() {
            const shouldBeFixed = window.scrollY > markdownBody.offsetTop;
            
            if (shouldBeFixed && !tocFixed) {
                tocContainer.classList.add('toc-fixed');
                tocFixed = true;
            } else if (!shouldBeFixed && tocFixed) {
                tocContainer.classList.remove('toc-fixed');
                tocFixed = false;
            }
            
            // 高亮当前阅读的标题
            highlightCurrentHeading();
        });
        
        // 高亮当前标题函数
        function highlightCurrentHeading() {
            const scrollPosition = window.scrollY;
            
            // 找到当前可见的标题
            let currentHeadingIndex = 0;
            
            headings.forEach((heading, index) => {
                if (heading.offsetTop <= scrollPosition + 100) {
                    currentHeadingIndex = index;
                }
            });
            
            // 移除所有高亮
            tocItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // 添加当前高亮
            if (tocItems[currentHeadingIndex]) {
                tocItems[currentHeadingIndex].classList.add('active');
            }
        }
    }
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        /* 基础目录样式 - 适用于所有设备 */
        .toc-container {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            border: 1px solid rgba(230, 230, 230, 0.7);
            transition: all 0.3s ease;
        }
        
        .toc-header {
            padding: 12px 15px;
            background: rgba(240, 240, 240, 0.7);
            border-radius: 8px 8px 0 0;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        
        .toc-title {
            font-size: 16px;
            color: #333;
        }
        
        .toc-toggle {
            color: #666;
            font-family: monospace;
        }
        
        .toc-content {
            padding: 10px 0;
            max-height: 70vh;
            overflow-y: auto;
            scrollbar-width: thin;
        }
        
        .toc-item {
            padding: 6px 15px;
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
        }
        
        .toc-item:hover {
            background-color: rgba(230, 230, 230, 0.7);
            border-left-color: #4caf50;
        }
        
        .toc-item.active {
            background-color: rgba(220, 240, 220, 0.7);
            border-left-color: #2e7d32;
        }
        
        .toc-item a {
            color: #333;
            text-decoration: none;
            display: block;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        /* 滚动条美化 */
        .toc-content::-webkit-scrollbar {
            width: 5px;
        }
        
        .toc-content::-webkit-scrollbar-track {
            background: rgba(240, 240, 240, 0.5);
        }
        
        .toc-content::-webkit-scrollbar-thumb {
            background: rgba(180, 180, 180, 0.7);
            border-radius: 5px;
        }
        
        /* 桌面版固定样式 */
        @media (min-width: 768px) {
            .toc-fixed {
                position: fixed;
                top: 20px;
                width: 280px;
                max-width: 20%;
                right: 20px;
                z-index: 100;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
            }
            
            .toc-fixed .toc-content {
                flex: 1;
                overflow-y: auto;
            }
        }
        
        /* 移动端特定样式 */
        @media (max-width: 767px) {
            .toc-container {
                margin: 0 -10px 20px;
                border-radius: 0;
            }
            
            .toc-header {
                padding: 10px;
                border-radius: 0;
            }
            
            .toc-content {
                max-height: 50vh;
            }
            
            .toc-item {
                padding: 8px 10px;
            }
            
            .toc-item a {
                font-size: 14px;
            }
        }
    `;
    
    document.head.appendChild(style);
});

