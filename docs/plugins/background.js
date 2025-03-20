document.addEventListener('DOMContentLoaded', function() {
    // 计数器初始化 ------------------------------------------
    function createVercount() {
        const postBody = document.getElementById('postBody');
        if(postBody) {
            postBody.insertAdjacentHTML('afterend',`
                <div id="busuanzi_container_page_pv" style="float:left;margin-top:8px;font-size:small;">
                    本文浏览量<span id="busuanzi_value_page_pv"></span>次
                </div>`);
        }
        
        const runday = document.getElementById('runday');
        if(runday) {
            runday.insertAdjacentHTML('afterend', `
                <span id="busuanzi_container_site_pv">
                    总浏览量<span id="busuanzi_value_site_pv"></span>次 • 
                </span>`);
        }
    }

    // 加载统计脚本
    const script = document.createElement('script');
    script.src = 'https://vercount.one/js';
    script.async = true;
    document.head.appendChild(script);

    // 主题初始化 ------------------------------------------
    const currentUrl = window.location.pathname;

    // 公共样式
    const commonStyle = `
        html {    
            background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320201907689.png') no-repeat center center fixed;
            background-size: cover;
        }
        body {
            min-width: 200px;
            max-width: 885px;
            margin: 30px auto;
            font-size: 16px;
            background: rgba(237, 239, 233, 0.84); 
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
    `;

    // 主页主题
    if (currentUrl === '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        const style = document.createElement("style");
        style.innerHTML = commonStyle + `
            #header { height: 300px; }
            .avatar { width: 200px; height: 200px; }
            .SideNav {
                background: rgba(255, 255, 255, 0.6);
                border-radius: 10px;
            }
        `;
        document.head.appendChild(style);
        createVercount();  // 初始化计数器
    }

    // 文章页主题
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        const style = document.createElement("style");
        style.innerHTML = commonStyle + `
            .markdown-body img { border-radius: 8px; }
            .markdown-alert { border-radius: 8px; }
            .markdown-body code { background-color: #c9daf8; }
        `;
        document.head.appendChild(style);
        createVercount();  // 初始化计数器
    }

    // 搜索页主题
    else if (currentUrl.includes('/tag')) {
        const style = document.createElement("style");
        style.innerHTML = commonStyle + `
            .subnav-search-input { border-radius: 2em; }
            .SideNav { background: rgba(255, 255, 255, 0.6); }
        `;
        document.head.appendChild(style);
    }

    console.log("%c 主题插件已加载","padding:5px 0;background:#bc4c00;color:#fff");
});
