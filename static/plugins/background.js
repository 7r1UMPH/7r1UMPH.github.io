document.addEventListener('DOMContentLoaded', function() {
    // 缓存DOM节点
    const head = document.head;
    const currentUrl = window.location.pathname;

    // 页面类型判断函数
    const getPageType = () => {
        if (currentUrl === '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) return 'home';
        if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) return 'post';
        if (currentUrl.includes('/tag')) return 'search';
        return 'other';
    };

    // 创建唯一样式标签
    const style = document.createElement('style');
    let cssVariables = `
        :root {
            --primary-bg: rgba(237, 239, 233, 0.84);
            --sidenav-bg: rgba(255, 255, 255, 0.6);
            --hover-bg: #c3e4e3;
            --img-border: rgba(255, 255, 255, 0.78);
            --code-bg: #c9daf8;
            --radius-sm: 8px;
            --radius-lg: 10px;
        }
    `;

    let dynamicStyles = `
        /* 基础样式 */
        html {
            background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320201907689.png') no-repeat center center fixed;
            background-size: cover;
            min-height: 100vh;
        }

        body {
            min-width: 200px;
            max-width: 885px;
            margin: 30px auto;
            font: 16px/1.25 sans-serif;
            background: var(--primary-bg);
            border-radius: var(--radius-lg);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        /* 通用导航样式 */
        .SideNav {
            background: var(--sidenav-bg);
            border-radius: var(--radius-lg);
            min-width: unset;
        }

        .SideNav-item {
            transition: 0.2s ease-in-out;
            border-radius: var(--radius-sm);
        }
    `;

    // 按页面类型添加样式
    switch(getPageType()) {
        case 'home':
            dynamicStyles += `
                #header {
                    height: 300px;
                    position: relative;
                }
                
                .avatar {
                    width: 200px;
                    height: 200px;
                    margin: 0 auto;
                }

                .SideNav-item:hover {
                    background: var(--hover-bg);
                    transform: scale(1.04);
                }
            `;
            break;

        case 'post':
            dynamicStyles += `
                .markdown-body img {
                    border: 1px solid var(--img-border);
                    border-radius: var(--radius-sm);
                }

                .markdown-body pre {
                    background: rgba(243, 244, 243, 0.97);
                    border-radius: var(--radius-sm);
                    padding: 1rem;
                }

                .markdown-body code {
                    background: var(--code-bg);
                    padding: 0.2em 0.4em;
                }
            `;
            break;

        case 'search':
            dynamicStyles += `
                .subnav-search-input {
                    border-radius: 2em;
                }

                .SideNav-item:hover {
                    background: var(--hover-bg);
                    transform: scale(1.02);
                }
            `;
            break;
    }

    // 合并并注入样式
    style.textContent = cssVariables + dynamicStyles;
    head.appendChild(style);

    // 预加载背景图（性能优化）
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = 'https://blog.freeblock.cn/background.webp';
    head.appendChild(preloadLink);
});
