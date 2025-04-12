function createVercount() {
    var postBody = document.getElementById('postBody');
    if (postBody){
        postBody.insertAdjacentHTML('afterend','<div id="busuanzi_container_page_pv" style="display:none;float:left;margin-top:8px;font-size:small;">本文浏览量<span id="busuanzi_value_page_pv"></span>次</div>');
    }
    
}

function createStatsSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'stats-sidebar';
    
    const avatarUrl = 'https://hub.gitmirror.com/https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250320200605137.png';
    const isArticlePage = window.location.pathname.includes('/post/');
    
    sidebar.innerHTML = `
        <div class="stats-avatar">
            <img src="${avatarUrl}" alt="头像">
        </div>
        <div class="stats-item">网站已运行 <span id="runday"></span> 天</div>
        <div class="stats-item">本站总访问量 <span id="busuanzi_value_site_pv"></span> 次</div>
        <div class="stats-item">本站总访客数 <span id="busuanzi_value_site_uv"></span> 人</div>
        ${isArticlePage ? `
            <div class="stats-item">本文总阅读量 <span id="busuanzi_value_page_pv"></span> 次</div>
        ` : ''}
    `;
    
    document.body.appendChild(sidebar);
    
    const style = document.createElement('style');
    style.textContent = `
        .stats-sidebar {
            position: fixed;
            left: 60px;
            top: 50%;
            transform: translateY(-50%);
            width: 180px;
            background: rgba(237, 239, 233, 0.84);
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }
        .stats-avatar img {
            width: 100%;
            border-radius: 50%;
            margin-bottom: 15px;
        }
        .stats-item {
            font-size: 14px;
            margin-bottom: 10px;
            line-height: 1.4;
        }
        @media (max-width: 1249px) {
            .stats-sidebar {
                position: static;
                width: auto;
                margin: 20px auto;
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", function() {
    createStatsSidebar();
    
    var element = document.createElement('script');
    element.src = 'https://vercount.one/js';
    document.head.appendChild(element);
});function createVercount() {
    var postBody = document.getElementById('postBody');
    if (postBody){
        postBody.insertAdjacentHTML('afterend','<div id="busuanzi_container_page_pv" style="display:none;float:left;margin-top:8px;font-size:small;">本文浏览量<span id="busuanzi_value_page_pv"></span>次</div>');
    }
    
}

function createStatsSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'stats-sidebar';
    
    const avatarUrl = 'https://hub.gitmirror.com/https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250320200605137.png';
    const isArticlePage = window.location.pathname.includes('/post/');
    
    sidebar.innerHTML = `
        <div class="stats-avatar">
            <img src="${avatarUrl}" alt="头像">
        </div>
        <div class="stats-item">网站已运行 <span id="runday"></span> 天</div>
        <div class="stats-item">本站总访问量 <span id="busuanzi_value_site_pv"></span> 次</div>
        <div class="stats-item">本站总访客数 <span id="busuanzi_value_site_uv"></span> 人</div>
        ${isArticlePage ? `
            <div class="stats-item">本文总阅读量 <span id="busuanzi_value_page_pv"></span> 次</div>
        ` : ''}
    `;
    
    document.body.appendChild(sidebar);
    
    const style = document.createElement('style');
    style.textContent = `
        .stats-sidebar {
            position: fixed;
            left: 60px;
            top: 50%;
            transform: translateY(-50%);
            width: 180px;
            background: rgba(237, 239, 233, 0.84);
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }
        .stats-avatar img {
            width: 100%;
            border-radius: 50%;
            margin-bottom: 15px;
        }
        .stats-item {
            font-size: 14px;
            margin-bottom: 10px;
            line-height: 1.4;
        }
        @media (max-width: 1249px) {
            .stats-sidebar {
                position: static;
                width: auto;
                margin: 20px auto;
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", function() {
    createStatsSidebar();
    
    var element = document.createElement('script');
    element.src = 'https://vercount.one/js';
    document.head.appendChild(element);
});
