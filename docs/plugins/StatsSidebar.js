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
            <a href="https://github.com/7r1UMPH" target="_blank" title="GitHub" class="stats-social-link">
                <i class="stats-icon stats-github"></i>
            </a>
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
        
        .stats-github {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233498db'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.22.66-.48v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.82-2.34 4.66-4.57 4.91.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12c0-5.52-4.48-10-10-10z'/%3E%3C/svg%3E");
        }
        
        .stats-rss {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233498db'%3E%3Cpath d='M6.18 15.64c.8 0 1.44.64 1.44 1.44 0 .79-.64 1.44-1.44 1.44-.79 0-1.44-.65-1.44-1.44 0-.8.65-1.44 1.44-1.44zm-3-6.44v2.03c3.31 0 6.33 1.34 8.51 3.52 2.17 2.17 3.52 5.2 3.52 8.51h2.03c0-7.72-6.34-14.05-14.05-14.05zm0-4v2.02c9.45 0 17.15 7.7 17.15 17.15h2.02c0-10.57-8.6-19.17-19.17-19.17z'/%3E%3C/svg%3E");
        }
        
        .stats-social-link {
            display: inline-flex;
            padding: 10px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
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
                max-width: 600px;
                margin: 30px auto;
                transform: none;
                padding: 20px;
                display: grid;
                grid-template-columns: auto 1fr;
                grid-template-areas: 
                    "avatar name"
                    "avatar subtitle"
                    "divider1 divider1"
                    "stats stats"
                    "divider2 divider2"
                    "social social";
                align-items: center;
                gap: 5px 15px;
            }
            
            .stats-sidebar:hover {
                transform: none;
            }
            
            .stats-avatar-container {
                grid-area: avatar;
                margin-bottom: 0;
                margin-right: 10px;
            }
            
            .stats-avatar {
                width: 80px;
                height: 80px;
            }
            
            .stats-name {
                grid-area: name;
                text-align: left;
                margin-bottom: 0;
            }
            
            .stats-subtitle {
                grid-area: subtitle;
                text-align: left;
                margin-bottom: 0;
            }
            
            .stats-divider:nth-of-type(1) {
                grid-area: divider1;
            }
            
            .stats-divider:nth-of-type(2) {
                grid-area: divider2;
            }
            
            .stats-item:nth-of-type(1),
            .stats-item:nth-of-type(2),
            .stats-item:nth-of-type(3),
            .stats-item:nth-of-type(4) {
                grid-area: stats;
            }
            
            .stats-social {
                grid-area: social;
            }
            
            .stats-item {
                display: inline-flex;
                margin-right: 20px;
                margin-bottom: 8px;
            }
        }
        
        @media (max-width: 768px) {
            .stats-sidebar {
                margin: 20px auto;
                padding: 15px;
                grid-template-columns: 1fr;
                grid-template-areas: 
                    "avatar"
                    "name"
                    "subtitle"
                    "divider1"
                    "stats"
                    "divider2"
                    "social";
                text-align: center;
            }
            
            .stats-avatar-container {
                margin: 0 auto 10px;
            }
            
            .stats-name, .stats-subtitle {
                text-align: center;
                margin-bottom: 5px;
            }
            
            .stats-item {
                font-size: 13px;
                display: block;
                margin: 0 auto 10px;
                justify-content: flex-start;
            }
        }
        
        /* 暗色模式适配 */
        .dark-mode .stats-sidebar {
            background: rgba(40, 44, 52, 0.9);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        
        .dark-mode .stats-name {
            color: #e0e0e0;
        }
        
        .dark-mode .stats-subtitle {
            color: #a0a0a0;
        }
        
        .dark-mode .stats-item {
            color: #d0d0d0;
        }
        
        .dark-mode .stats-social-link {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .dark-mode .stats-social-link:hover {
            background: rgba(97, 218, 251, 0.2);
        }
        
        .dark-mode .stats-divider {
            background: linear-gradient(to right, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.01));
        }
        
        .dark-mode .stats-icon {
            opacity: 0.9;
            filter: brightness(1.2);
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", function() {
    // 检测是否为移动设备
    const isMobile = window.innerWidth < 768;
    
    // 在桌面设备上创建侧边栏
    if (!isMobile || document.querySelector('.markdown-body')) {
        createStatsSidebar();
    }
    
    // 添加访问统计脚本
    var element = document.createElement('script');
    element.setAttribute('async', '');
    element.src = 'https://cn.vercount.one/js';
    element.onload = function() {
        // 等待统计数据加载后显示计数器
        setTimeout(function() {
            document.querySelectorAll('[id^="busuanzi_container_"]').forEach(function(el) {
                el.style.display = 'inline';
            });
        }, 2000);
    };
    document.head.appendChild(element);
});
