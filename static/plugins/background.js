document.addEventListener('DOMContentLoaded', function() {    
    const currentUrl = window.location.pathname;

    // 通用背景设置
    const setBackground = () => {
        const bgStyle = document.createElement("style");
        bgStyle.innerHTML = `
            html {    
                background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp') no-repeat center center fixed;
                background-size: cover;
            }
        `;
        document.head.appendChild(bgStyle);
    }

    // 主页主题
    if (currentUrl == '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        const style = document.createElement("style");
        style.innerHTML = `
            .blogTitle { display: unset; }
            #header { height: 300px; }
            #header h1 {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .avatar { width: 200px; height: 200px; }
            #header h1 a {
                margin-top: 30px;
                font-family: fantasy;
                margin-left: unset;
            }
            body {
                min-width: 200px;
                max-width: 885px;
                margin: 30px auto;
                font-size: 16px;
                font-family: sans-serif;
                line-height: 1.25;
                background: rgba(237, 239, 233, 0.84); 
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                overflow: auto;
            }
            .SideNav {
                background: rgba(255, 255, 255, 0.6);
                border-radius: 10px;
                min-width: unset;
            }
            .SideNav-item:hover {
                background-color: #c3e4e3;
                border-radius: 10px;
                transform: scale(1.04);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            }
            .SideNav-item { transition: 0.1s; }`;
        document.head.appendChild(style);
        setBackground();
    }

    // 文章页主题
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                min-width: 200px;
                max-width: 885px;
                margin: 30px auto;
                font-size: 16px;
                font-family: sans-serif;
                line-height: 1.25;
                background: rgba(237, 239, 233, 0.84); 
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
            .markdown-body img {
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.78); 
            }
            .markdown-alert { border-radius: 8px; }
            .markdown-body .highlight pre, .markdown-body pre {
                background-color: rgba(243, 244, 243, 0.967);
                box-shadow: 0 10px 30px 0 rgba(222, 217, 217, 0.4);
                padding-top: 20px; 
                border-radius: 8px;
            }
            .markdown-body code, .markdown-body tt {
                background-color: #c9daf8;
            }
            .markdown-body h1{
                display: inline-block;
                font-size: 1.3rem;
                background: rgb(239, 112, 96);
                color: #ffffff;
                padding: 3px 10px;
                border-radius: 8px;
                margin: 1.8rem 2px 0 0;
            }`;
        document.head.appendChild(style);
        setBackground();
    }

    // 搜索页主题
    else if (currentUrl.includes('/tag')) {
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                min-width: 200px;
                max-width: 885px;
                margin: 30px auto;
                font-size: 16px;
                font-family: sans-serif;
                line-height: 1.25;
                background: rgba(237, 239, 233, 0.84); 
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
            .SideNav {
                background: rgba(255, 255, 255, 0.6);
                border-radius: 10px;
                min-width: unset;
            }
            .SideNav-item:hover {
                background-color: #c3e4e3;
                border-radius: 10px;
                transform: scale(1.02);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            }
            .SideNav-item { transition: 0.1s; }
            .subnav-search-input { border-radius: 2em; }
            .subnav-search { height: 36px; }`;
        document.head.appendChild(style);
        setBackground();
    }
});
