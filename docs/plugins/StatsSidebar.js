function createVercount() {
    var postBody = document.getElementById('postBody');
    if (postBody){
        postBody.insertAdjacentHTML('afterend','<div id="busuanzi_container_page_pv" style="display:none;float:left;margin-top:8px;font-size:small;">本文浏览量<span id="busuanzi_value_page_pv"></span>次</div>');
    }
    var runday = document.getElementById('runday');
    runday.insertAdjacentHTML('afterend', '<span id="busuanzi_container_site_pv" style="display:none">总浏览量<span id="busuanzi_value_site_pv"></span>次 • </span>');
}

function createStatsSidebar() {
    // 移动端不显示侧边统计栏
    if (window.innerWidth < 768) {
        createMobileStats();
        return;
    }
    
    const sidebar = document.createElement('div');
    sidebar.className = 'stats-sidebar';
    
    const cachedAvatar = localStorage.getItem('blogAvatar');
    const avatarUrl = cachedAvatar || 'https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png';
    
    const isArticlePage = window.location.pathname.includes('/post/');
    
    const startDate = new Date('2024-10-12');
    const today = new Date();
    const runDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    sidebar.innerHTML = `
        <div class="stats-avatar">
            <img src="${avatarUrl}" alt="头像" onload="localStorage.setItem('blogAvatar', this.src)">
        </div>
        <div class="stats-item">网站已运行 <span id="runday">${runDays}</span> 天</div>
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
            left: calc(50% - 510px - 180px - 10px);
            top: 50%;
            transform: translateY(-50%);
            width: 180px;
            background: rgba(237, 239, 233, 0.84);
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            transition: all 0.3s ease;
        }
        .stats-sidebar:hover {
            transform: translateY(-50%) scale(1.02);
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
        }
        .stats-avatar img {
            width: 100%;
            border-radius: 50%;
            margin-bottom: 15px;
            transition: transform 0.3s ease;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        .stats-avatar img:hover {
            transform: rotate(5deg) scale(1.05);
        }
        .stats-item {
            font-size: 14px;
            margin-bottom: 10px;
            line-height: 1.4;
<<<<<<< HEAD
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 6px;
            transition: all 0.2s ease;
            border-left: 3px solid rgba(76, 175, 80, 0.6);
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .stats-item span {
            margin-left: 5px;
            font-weight: 500;
=======
            padding: 8px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 6px;
            transition: all 0.2s ease;
>>>>>>> parent of 42c04eb (Merge branch 'main' of https://github.com/7r1UMPH/7r1UMPH.github.io)
        }
        .stats-item:hover {
            background: rgba(255, 255, 255, 0.8);
            transform: translateX(5px);
        }
        @media (max-width: 1249px) {
            .stats-sidebar {
                position: static;
                width: auto;
                margin: 20px auto;
                transform: none;
                max-width: 500px;
            }
            .stats-sidebar:hover {
                transform: scale(1.02);
            }
        }
    `;
    document.head.appendChild(style);
}

// 创建移动端统计信息
function createMobileStats() {
    const footer = document.getElementById('footer');
    if (!footer) return;
    
    const statsContainer = document.createElement('div');
    statsContainer.className = 'mobile-stats';
    
    const startDate = new Date('2024-10-12');
    const today = new Date();
    const runDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    statsContainer.innerHTML = `
        <div class="stats-row">
            <div class="stats-cell">运行<span id="runday">${runDays}</span>天</div>
            <div class="stats-cell">访问<span id="busuanzi_value_site_pv"></span>次</div>
            <div class="stats-cell">访客<span id="busuanzi_value_site_uv"></span>人</div>
        </div>
    `;
    
    // 添加到footer前面
    if (footer.parentNode) {
        footer.parentNode.insertBefore(statsContainer, footer);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        .mobile-stats {
            margin: 20px auto 10px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            max-width: 90%;
        }
        .stats-row {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }
        .stats-cell {
            font-size: 14px;
            padding: 5px 10px;
            text-align: center;
            border-radius: 4px;
            background: rgba(237, 239, 233, 0.5);
            margin: 5px;
            min-width: 70px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", function() {
    // 移除GitHub跳转按钮
    const removeGithubButtons = () => {
        const githubButtons = document.querySelectorAll('a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"]');
        githubButtons.forEach(button => {
            button.style.display = 'none';
        });
    };
    
    // 执行移除GitHub按钮
    removeGithubButtons();
    
    createStatsSidebar();
    
    var element = document.createElement('script');
    element.src = 'https://cn.vercount.one/js';
    document.head.appendChild(element);
});
