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
        position: fixed; /* 改回固定定位 */
        top: 30px; /* 与视窗顶部距离 */
        left: calc(50% + 560px); /* 1100px/2 + 10px间距 */
        width: 200px;
        background: rgba(237, 239, 233, 0.84);
        border-radius: 10px;
        padding: 10px;
        overflow-y: auto;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        max-height: calc(100vh - 60px); /* 动态计算最大高度 */
    }

    /* 可以移除 #content 的相对定位 */
    #content {
        position: relative;
    }
    
    /* 目录标题样式 */
    .toc-title{
        font-weight: bold; /* 加粗 */
        text-align: center; /* 居中 */
        border-bottom: 1px solid #ddd; /* 底部边框 */
        padding-bottom: 8px; /* 底部内边距 */
    }
    
    /* 返回顶部按钮样式 */
    .toc-end{
        font-weight: bold; /* 加粗 */
        text-align: center; /* 居中 */
        cursor: pointer; /* 手型光标 */
        visibility: hidden; /* 默认隐藏 */
    }  
    
    /* 目录链接样式 */
    .toc a {
        display: block; /* 块级显示 */
        color: var(--color-diff-blob-addition-num-text); /* 文字颜色 */
        text-decoration: none; /* 无下划线 */
        padding: 5px 0; /* 上下内边距 */
        font-size: 14px; /* 字体大小 */
        line-height: 1.5; /* 行高 */
        border-bottom: 1px solid #e1e4e8; /* 底部边框 */
    }
    
    /* 最后一个链接无边框 */
    .toc a:last-child {
        border-bottom: none;
    }
    
    /* 链接悬停效果 */
    .toc a:hover {
        background-color:var(--color-select-menu-tap-focus-bg);
    }

    /* 响应式设计 - 小屏幕适配 */
    @media (max-width: 1249px) 
    {
        .toc{
            position:static; /* 取消固定定位 */
            top:auto;
            left:auto;
            transform:none;
            padding:10px;
            margin-bottom:20px; /* 底部外边距 */
        }
    }`;

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
