function createVercount() {
    var postBody = document.getElementById('postBody');
    if (postBody){
        postBody.insertAdjacentHTML('afterend','<div id="busuanzi_container_page_pv" style="display:none;float:left;margin-top:8px;font-size:small;">本文浏览量<span id="busuanzi_value_page_pv"></span>次</div>');
    }
    var runday = document.getElementById('runday');
    runday.insertAdjacentHTML('afterend', '<span id="busuanzi_container_site_pv" style="display:none">总浏览量<span id="busuanzi_value_site_pv"></span>次 • </span>');
}

function createStatsSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'stats-sidebar';
    
    // 博客头像URL
    const avatarUrl = 'https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png';
    
    const isArticlePage = window.location.pathname.includes('/post/');
    
    // 计算博客运行天数
    const startDate = new Date('2024-03-12'); // 确认起始日期是否正确
    const today = new Date();
    const runDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    sidebar.innerHTML = `
        <div class="stats-card">
            <div class="stats-avatar">
                <img src="${avatarUrl}" alt="头像" class="avatar">
            </div>
            <div class="stats-info">
                <div class="stats-item">
                    <i class="stats-icon fa-regular fa-calendar"></i>
                    <span class="stats-text">已运行 <span id="runday" class="stats-value">${runDays}</span> 天</span>
                </div>
                <div class="stats-item">
                    <i class="stats-icon fa-solid fa-eye"></i>
                    <span class="stats-text">总访问 <span id="busuanzi_value_site_pv" class="stats-value"><i class="fa-solid fa-spinner fa-spin loading-spinner"></i></span> 次</span>
                </div>
                <div class="stats-item">
                    <i class="stats-icon fa-solid fa-user"></i>
                    <span class="stats-text">访客数 <span id="busuanzi_value_site_uv" class="stats-value"><i class="fa-solid fa-spinner fa-spin loading-spinner"></i></span> 人</span>
                </div>
                ${isArticlePage ? `
                    <div class="stats-item">
                        <i class="stats-icon fa-solid fa-book-open"></i>
                        <span class="stats-text">阅读量 <span id="busuanzi_value_page_pv" class="stats-value"><i class="fa-solid fa-spinner fa-spin loading-spinner"></i></span> 次</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(sidebar);
    
    const style = document.createElement('style');
    style.textContent = `
        .stats-sidebar {
            position: fixed;
            left: calc(50% - 510px - 200px - 10px);
            top: 50%;
            transform: translateY(-50%);
            width: 200px;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            transition: all 0.3s ease;
        }
        .stats-sidebar:hover {
            transform: translateY(-50%) scale(1.02);
        }
        .stats-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(237, 239, 233, 0.9));
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 18px;
            padding: 20px;
            box-shadow: 
                0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .stats-card:hover {
            box-shadow: 
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04),
                0 0 0 1px rgba(255, 255, 255, 0.15) inset;
        }
        .stats-avatar {
            display: flex;
            justify-content: center;
            margin-bottom: 18px;
        }
        .stats-avatar img {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        .stats-avatar img:hover {
            transform: rotate(360deg) scale(1.05);
            border-color: var(--color-accent-fg, rgba(31, 111, 235, 0.8));
            box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
            transition: all 0.8s ease;
        }
        .stats-info {
            padding-top: 5px;
        }
        .stats-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 12px;
            transition: all 0.3s ease;
        }
        .stats-item:hover {
            background: rgba(255, 255, 255, 0.8);
            transform: translateX(5px);
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
        }
        .stats-icon {
            width: 18px;
            font-size: 16px;
            margin-right: 12px;
            text-align: center;
            color: var(--color-accent-fg, #1a73e8);
        }
        .stats-text {
            font-size: 14px;
            color: #333;
        }
        .stats-value {
            font-weight: bold;
            color: var(--color-accent-fg, #1a73e8);
        }
        .loading-spinner {
            font-size: 14px;
            color: var(--color-accent-fg, #1a73e8);
            opacity: 0.8;
        }
        @media (max-width: 1249px) {
            .stats-sidebar {
                position: static;
                width: 90%;
                max-width: 350px;
                margin: 30px auto;
                transform: none;
            }
            .stats-sidebar:hover {
                transform: none;
            }
            .stats-card {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(237, 239, 233, 0.95));
            }
            .stats-item {
                padding: 10px;
            }
            .stats-item:hover {
                transform: translateX(3px);
            }
            .stats-avatar img:hover {
                transform: rotate(360deg) scale(1.05);
            }
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", function() {
    if (window.innerWidth < 768) {
        return;
    }
    
    createStatsSidebar();
    
    // 加载不蒜子统计脚本
    var bszScript = document.createElement('script');
    bszScript.src = 'https://cn.vercount.one/js';
    document.head.appendChild(bszScript);
    
    // 加载 Font Awesome (如果页面还没有加载)
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
});
