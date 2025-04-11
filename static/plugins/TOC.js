/**
 * 创建文章目录(TOC)的函数
 */
function createTOC() {
    // 创建目录容器div
    var tocElement = document.createElement('div');
    tocElement.className = 'toc';
    
    // 获取文章内容容器
    var contentContainer = document.getElementById('content');
    
    // 获取所有标题元素(h1-h6)
    const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // 如果没有标题则不创建目录
    if (headings.length === 0) {
        return;
    }
    
    // 添加目录标题
    tocElement.insertAdjacentHTML('afterbegin', '<div class="toc-title">文章目录</div>');
    
    // 遍历所有标题创建目录项
    headings.forEach(heading => {
        // 如果标题没有ID则自动生成
        if (!heading.id) {
            heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
        }
        
        // 创建目录链接
        const link = document.createElement('a');
        link.href = '#' + heading.id; // 设置锚点链接
        link.textContent = heading.textContent; // 使用标题文本
        link.className = 'toc-link';
        
        // 根据标题级别设置缩进 (h1=0px, h2=10px, h3=20px...)
        link.style.paddingLeft = `${(parseInt(heading.tagName.charAt(1)) - 1) * 10}px`;
        
        // 将链接添加到目录容器
        tocElement.appendChild(link);
    });
    
    // 添加返回顶部按钮
    tocElement.insertAdjacentHTML('beforeend', '<a class="toc-end" onclick="window.scrollTo({top:0,behavior: \'smooth\'});">Top</a>');
    
    // 将目录插入到内容容器开头
    contentContainer.prepend(tocElement);
}

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function() {
    // 创建目录
    createTOC();
    
    // 定义目录样式
    var css = `
    /* 目录容器样式 */
    .toc {
        position: absolute; /* 改为绝对定位 */
        top: 0; /* 与内容容器顶部对齐 */
        right: -220px; /* 移动到内容容器右侧 */
        width: 200px;
        background: rgba(237, 239, 233, 0.84);
        border-radius: 10px;
        padding: 10px;
        overflow-y: auto;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        max-height: 70vh;
    }
    
    /* 确保内容容器有相对定位 */
    #content {
        position: relative;
    }

    /* 响应式设计 - 小屏幕适配 */
    @media (max-width: 1249px) 
    {
        .toc{
            position: static;
            right: auto;
            width: auto;
            margin-bottom:20px;
        }
    }
    `;

    // 创建样式标签并添加到head
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // 滚动事件监听 - 控制返回顶部按钮显示/隐藏
    window.onscroll = function() {
        const backToTopButton = document.querySelector('.toc-end');
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style="visibility: visible;"
        } else {
            backToTopButton.style="visibility: hidden;"
        }
    };

    // 控制台输出插件信息
    console.log("\n %c GmeekTOC Plugins https://github.com/Meekdai/Gmeek \n","padding:5px 0;background:#C333D0;color:#fff");
});
