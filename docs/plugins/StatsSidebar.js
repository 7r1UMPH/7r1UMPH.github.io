function createVercount() {
    var postBody = document.getElementById('postBody');
    if (postBody){
        postBody.insertAdjacentHTML('afterend','<div id="busuanzi_container_page_pv" style="display:none;float:left;margin-top:8px;font-size:small;">本文浏览量<span id="busuanzi_value_page_pv"></span>次</div>');
    }
    var runday = document.getElementById('runday');
    if (runday) {
        runday.insertAdjacentHTML('afterend', '<span id="busuanzi_container_site_pv" style="display:none">总浏览量<span id="busuanzi_value_site_pv"></span>次 • </span>');
    }
}

function createStatsSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'stats-sidebar';
    
    const cachedAvatar = localStorage.getItem('blogAvatar');
    const avatarUrl = cachedAvatar || 'https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png';
    
    const isArticlePage = window.location.pathname.includes('/post/');
    
    const startDate = new Date('2024-10-12');
    const today = new Date();
    const runDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    sidebar.innerHTML = `
        <div class="stats-avatar-container">
            <img src="${avatarUrl}" alt="头像" loading="lazy" onload="localStorage.setItem('blogAvatar', this.src)" class="stats-avatar">
        </div>
        <div class="stats-name">Triumph Blog</div>
        <div class="stats-subtitle">记录学习点滴，分享技术心得</div>
        <div class="stats-divider"></div>
        <div class="stats-item"><i class="stats-icon stats-calendar"></i>运行时间 <span id="runday">${runDays}</span> 天</div>
        <div class="stats-item"><i class="stats-icon stats-eye"></i>总访问量 <span id="busuanzi_value_site_pv">--</span> 次</div>
        <div class="stats-item"><i class="stats-icon stats-user"></i>总访客数 <span id="busuanzi_value_site_uv">--</span> 人</div>
        ${isArticlePage ? `
            <div class="stats-divider"></div>
            <div class="stats-item"><i class="stats-icon stats-book"></i>本文阅读量 <span id="busuanzi_value_page_pv">--</span> 次</div>
        ` : ''}
        <div class="stats-divider"></div>
        <div class="stats-social">
            <a href="https://7r1UMPH.github.io/rss.xml" target="_blank" title="RSS" class="stats-social-link">
                <i class="stats-icon stats-rss"></i>
            </a>
            <a href="mailto:7r1umph@email.com" title="Email" class="stats-social-link">
                <i class="stats-icon stats-email"></i>
            </a>
        </div>
    `;
    
    document.body.appendChild(sidebar);
    
    const style = document.createElement('style');
    style.textContent = `
        .stats-sidebar {
            position: fixed;
            left: calc(50% - 510px - 180px - 20px);
            top: 50%;
            transform: translateY(-50%);
            width: 180px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 25px 20px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transition: all 0.3s ease;
            font-size: 14px;
            backdrop-filter: blur(5px);
        }
        
        .stats-sidebar:hover {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            transform: translateY(-50%) translateX(5px);
        }
        
        .stats-avatar-container {
            text-align: center;
            margin-bottom: 15px;
            position: relative;
        }
        
        .stats-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            object-fit: cover;
        }
        
        .stats-avatar:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .stats-name {
            text-align: center;
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 18px;
            color: #2c3e50;
        }
        
        .stats-subtitle {
            text-align: center;
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 10px;
        }
        
        .stats-divider {
            height: 1px;
            background: linear-gradient(to right, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.01));
            margin: 15px 0;
        }
        
        .stats-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            line-height: 1.5;
            color: #4a4a4a;
            transition: transform 0.2s ease;
        }
        
        .stats-item:hover {
            transform: translateX(3px);
        }
        
        .stats-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 10px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            opacity: 0.7;
        }
        
        .stats-calendar {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233498db'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z'/%3E%3C/svg%3E");
        }
        
        .stats-eye {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233498db'%3E%3Cpath d='M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z'/%3E%3C/svg%3E");
        }
        
        .stats-user {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233498db'%3E%3Cpath d='M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z'/%3E%3C/svg%3E");
        }
        
        .stats-book {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233498db'%3E%3Cpath d='M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z'/%3E%3C/svg%3E");
        }
        
        .stats-email {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233498db'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E");
        }
        
        .stats-social {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
        }
        
        .stats-rss {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233498db'%3E%3Cpath d='M6.18 15.64c.8 0 1.44.64 1.44 1.44 0 .79-.64 1.44-1.44 1.44-.79 0-1.44-.65-1.44-1.44 0-.8.65-1.44 1.44-1.44zm-3-6.44v2.03c3.31 0 6.33 1.34 8.51 3.52 2.17 2.17 3.52 5.2 3.52 8.51h2.03c0-7.72-6.34-14.05-14.05-14.05zm0-4v2.02c9.45 0 17.15 7.7 17.15 17.15h2.02c0-10.57-8.6-19.17-19.17-19.17z'/%3E%3C/svg%3E");
        }
        
        .stats-social-link {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
        }
        
        .stats-social-link .stats-icon {
            margin: 0;
        }
        
        .stats-social-link:hover {
            background: rgba(52, 152, 219, 0.1);
            transform: translateY(-3px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
        }
        
        /* 响应式布局 */
        @media (max-width: 1399px) {
            .stats-sidebar {
                left: calc(50% - 450px - 180px - 20px);
            }
        }
        
        @media (max-width: 1289px) {
            .stats-sidebar {
                position: static;
                width: auto;
                max-width: 100%;
                margin: 20px auto 40px auto;
                transform: none;
                border-radius: 12px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            }
            
            .stats-sidebar:hover {
                transform: none;
            }
            
            .stats-social {
                margin-bottom: 10px;
            }
            
            .stats-item {
                margin-bottom: 10px;
            }
        }
        
        /* 暗黑模式适配 */
        .dark-mode .stats-sidebar {
            background: rgba(40, 44, 52, 0.9);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        
        .dark-mode .stats-name {
            color: #e0e0e0;
        }
        
        .dark-mode .stats-subtitle {
            color: #aaa;
        }
        
        .dark-mode .stats-item {
            color: #d0d0d0;
        }
        
        .dark-mode .stats-divider {
            background: linear-gradient(to right, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.01));
        }
        
        .dark-mode .stats-social-link {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .dark-mode .stats-social-link:hover {
            background: rgba(97, 218, 251, 0.1);
        }
    `;
    
    document.head.appendChild(style);
    
    // 加载不蒜子统计脚本
    const script = document.createElement('script');
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.async = true;
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth >= 768) {
        createStatsSidebar();
    }
});
