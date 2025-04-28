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

function createMobileTOC() {
    // 创建浮动菜单按钮
    const floatButton = document.createElement('div');
    floatButton.className = 'mobile-float-button';
    floatButton.innerHTML = '<div class="hamburger"><span></span><span></span><span></span></div>';
    document.body.appendChild(floatButton);

    // 创建回到顶部按钮
    const topButton = document.createElement('div');
    topButton.className = 'mobile-top-button';
    topButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    topButton.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
    document.body.appendChild(topButton);

    // 创建移动端目录容器
    const mobileToc = document.createElement('div');
    mobileToc.className = 'mobile-toc-container';
    mobileToc.innerHTML = '<div class="mobile-toc-header">文章目录<span class="mobile-toc-close">×</span></div><div class="mobile-toc-content"></div>';
    document.body.appendChild(mobileToc);

    // 获取文章标题
    const contentContainer = document.getElementById('content');
    const headings = contentContainer ? contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6') : [];
    const tocContent = mobileToc.querySelector('.mobile-toc-content');

    if (headings.length > 0) {
        headings.forEach(heading => {
            if (!heading.id) {
                heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
            }
            
            const link = document.createElement('a');
            link.href = '#' + heading.id;
            link.textContent = heading.textContent;
            link.className = 'mobile-toc-link';
            
            // 根据标题级别设置缩进
            const level = parseInt(heading.tagName.charAt(1));
            link.style.paddingLeft = `${(level - 1) * 10}px`;
            
            tocContent.appendChild(link);
        });
    } else {
        tocContent.innerHTML = '<div class="mobile-toc-empty">无目录内容</div>';
    }

    // 添加事件监听
    floatButton.addEventListener('click', () => {
        mobileToc.classList.toggle('active');
    });

    mobileToc.querySelector('.mobile-toc-close').addEventListener('click', () => {
        mobileToc.classList.remove('active');
    });

    // 点击链接后关闭目录
    mobileToc.querySelectorAll('.mobile-toc-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToc.classList.remove('active');
        });
    });

    // 监听滚动显示/隐藏回到顶部按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            topButton.classList.add('active');
        } else {
            topButton.classList.remove('active');
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    if (window.innerWidth >= 768) {
        // 桌面端
        createTOC();
    } else {
        // 移动端
        createMobileTOC();
    }
    
    var css = `
    /* 桌面端样式 */
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

    /* 移动端样式 */
    .mobile-float-button {
        position: fixed;
        bottom: 80px;
        right: 15px;
        width: 45px;
        height: 45px;
        background-color: var(--color-accent-emphasis, #0366d6);
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .mobile-float-button:hover {
        background-color: var(--color-accent-fg, #0969da);
    }

    .hamburger {
        width: 20px;
        height: 16px;
        position: relative;
    }

    .hamburger span {
        display: block;
        position: absolute;
        height: 2px;
        width: 100%;
        background: white;
        border-radius: 2px;
        left: 0;
    }

    .hamburger span:nth-child(1) {
        top: 0;
    }

    .hamburger span:nth-child(2) {
        top: 7px;
    }

    .hamburger span:nth-child(3) {
        top: 14px;
    }

    .mobile-top-button {
        position: fixed;
        bottom: 20px;
        right: 15px;
        width: 45px;
        height: 45px;
        background-color: rgba(200, 200, 200, 0.8);
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s, background-color 0.3s;
    }

    .mobile-top-button.active {
        opacity: 1;
        visibility: visible;
    }

    .mobile-top-button:hover {
        background-color: rgba(180, 180, 180, 0.9);
    }

    .mobile-toc-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 80%;
        height: 100%;
        background-color: white;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
        overflow-y: auto;
        max-width: 300px;
    }

    .mobile-toc-container.active {
        transform: translateX(0);
    }

    .mobile-toc-header {
        padding: 15px;
        font-weight: bold;
        font-size: 18px;
        border-bottom: 1px solid #ddd;
        position: sticky;
        top: 0;
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mobile-toc-close {
        font-size: 24px;
        cursor: pointer;
        padding: 0 5px;
    }

    .mobile-toc-content {
        padding: 10px 0;
    }

    .mobile-toc-link {
        display: block;
        padding: 8px 15px;
        text-decoration: none;
        color: var(--color-fg-default, #24292f);
        border-bottom: 1px solid #f1f1f1;
        font-size: 15px;
        line-height: 1.4;
    }

    .mobile-toc-link:hover {
        background-color: #f6f8fa;
    }

    .mobile-toc-empty {
        padding: 15px;
        color: #666;
        text-align: center;
    }

    @media (max-width: 1249px) and (min-width: 768px) {
        .toc{
            position:static;
            top:auto;
            left:auto;
            transform:none;
            padding:10px;
            margin-bottom:20px;
        }
    }

    @media (max-width: 767px) {
        .toc {
            display: none;
        }
    }`;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    window.onscroll = function() {
        const backToTopButton = document.querySelector('.toc-end');
        if (backToTopButton) {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                backToTopButton.style="visibility: visible;"
            } else {
                backToTopButton.style="visibility: hidden;"
            }
        }
    };
});

