// 全文搜索功能
const addFullTextSearch = () => {
    // 仅在标签页添加全文搜索
    if (!window.location.pathname.includes('/tag.html')) {
        return;
    }
    
    // 创建搜索框
    const searchContainer = document.createElement('div');
    searchContainer.className = 'full-text-search';
    searchContainer.innerHTML = `
        <div class="search-header">
            <input type="text" id="fullTextSearchInput" placeholder="在所有文章中搜索..." />
            <button id="searchButton">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
        </div>
        <div id="searchResults" class="search-results"></div>
    `;
    
    // 插入到页面
    const mainContent = document.getElementById('content');
    if (mainContent) {
        mainContent.insertBefore(searchContainer, mainContent.firstChild);
    }
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .full-text-search {
            margin-bottom: 25px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
        }
        
        .full-text-search:focus-within {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }
        
        .search-header {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        #fullTextSearchInput {
            flex: 1;
            padding: 12px 15px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.2s ease;
            background: rgba(255, 255, 255, 0.9);
        }
        
        #fullTextSearchInput:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
        
        #searchButton {
            background: #3498db;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 15px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        #searchButton:hover {
            background: #2980b9;
        }
        
        .search-results {
            margin-top: 20px;
            max-height: 400px;
            overflow-y: auto;
            border-radius: 8px;
        }
        
        .search-result-item {
            padding: 15px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
        }
        
        .search-result-item:hover {
            background: rgba(52, 152, 219, 0.05);
        }
        
        .search-result-item a {
            color: #2c3e50;
            font-weight: bold;
            font-size: 18px;
            display: block;
            margin-bottom: 8px;
            text-decoration: none;
        }
        
        .search-result-item a:hover {
            color: #3498db;
        }
        
        .search-result-item p {
            color: #555;
            font-size: 14px;
            margin: 0;
        }
        
        .search-result-item .highlight {
            background: rgba(255, 235, 59, 0.4);
            padding: 0 2px;
            border-radius: 2px;
        }
        
        .dark-mode .full-text-search {
            background: rgba(40, 44, 52, 0.8);
        }
        
        .dark-mode #fullTextSearchInput {
            background: rgba(30, 34, 42, 0.9);
            border-color: rgba(255, 255, 255, 0.1);
            color: #e0e0e0;
        }
        
        .dark-mode .search-result-item {
            border-bottom-color: rgba(255, 255, 255, 0.05);
        }
        
        .dark-mode .search-result-item a {
            color: #e0e0e0;
        }
        
        .dark-mode .search-result-item p {
            color: #bbb;
        }
    `;
    document.head.appendChild(style);
    
    // 加载文章数据
    const fetchPostList = async () => {
        try {
            const response = await fetch('/postList.json');
            if (!response.ok) {
                throw new Error('无法加载文章列表');
            }
            return await response.json();
        } catch (error) {
            console.error('加载文章列表错误:', error);
            return [];
        }
    };
    
    // 执行搜索
    const performSearch = async (query) => {
        if (!query.trim()) {
            return;
        }
        
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '<div class="loading">正在搜索...</div>';
        
        const postList = await fetchPostList();
        const results = [];
        
        // 简单全文搜索
        const searchQuery = query.trim().toLowerCase();
        
        for (const post of postList) {
            // 搜索标题和摘要
            const titleMatch = post.title.toLowerCase().includes(searchQuery);
            const summaryMatch = post.summary && post.summary.toLowerCase().includes(searchQuery);
            
            if (titleMatch || summaryMatch) {
                // 高亮显示匹配内容
                let titleHighlighted = post.title;
                let summaryHighlighted = post.summary || '';
                
                if (titleMatch) {
                    titleHighlighted = highlightText(post.title, searchQuery);
                }
                
                if (summaryMatch) {
                    summaryHighlighted = highlightText(post.summary, searchQuery);
                }
                
                results.push({
                    ...post,
                    titleHighlighted,
                    summaryHighlighted
                });
            }
        }
        
        // 显示结果
        if (results.length > 0) {
            searchResults.innerHTML = results.map(post => `
                <div class="search-result-item">
                    <a href="${post.url}">${post.titleHighlighted}</a>
                    <p>${post.summaryHighlighted.length > 200 ? post.summaryHighlighted.substring(0, 200) + '...' : post.summaryHighlighted}</p>
                </div>
            `).join('');
        } else {
            searchResults.innerHTML = '<div class="not-found">没有找到匹配的内容，请尝试其他关键词。</div>';
        }
    };
    
    // 高亮显示匹配文本
    const highlightText = (text, query) => {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    };
    
    // 绑定事件
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('fullTextSearchInput');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
};

// 相关文章推荐功能
const addRelatedPosts = () => {
    // 仅在文章页添加相关文章
    if (!window.location.pathname.includes('/post/')) {
        return;
    }
    
    // 创建相关文章容器
    const relatedPostsContainer = document.createElement('div');
    relatedPostsContainer.className = 'related-posts';
    relatedPostsContainer.innerHTML = `
        <h3 class="related-posts-title">相关文章推荐</h3>
        <div id="relatedPostsContent" class="related-posts-content">
            <div class="loading">正在加载相关文章...</div>
        </div>
    `;
    
    // 获取当前文章信息
    const currentPath = window.location.pathname;
    const currentTitle = document.querySelector('h1.postTitle')?.textContent || '';
    const currentTags = Array.from(document.querySelectorAll('.Label.LabelName a')).map(el => el.textContent);
    
    // 插入到页面
    const postBody = document.getElementById('postBody');
    if (postBody) {
        postBody.parentNode.insertBefore(relatedPostsContainer, postBody.nextSibling);
    }
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .related-posts {
            margin-top: 40px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .related-posts-title {
            font-size: 20px;
            margin-bottom: 15px;
            color: #2c3e50;
            border-bottom: 2px solid rgba(52, 152, 219, 0.2);
            padding-bottom: 8px;
        }
        
        .related-posts-content {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 15px;
        }
        
        .related-post-item {
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.7);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
            overflow: hidden;
        }
        
        .related-post-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .related-post-link {
            display: block;
            padding: 15px;
            text-decoration: none;
            color: inherit;
        }
        
        .related-post-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
            transition: color 0.2s ease;
        }
        
        .related-post-item:hover .related-post-title {
            color: #3498db;
        }
        
        .dark-mode .related-posts {
            background: rgba(40, 44, 52, 0.8);
        }
        
        .dark-mode .related-posts-title {
            color: #e0e0e0;
            border-bottom-color: rgba(97, 218, 251, 0.2);
        }
        
        .dark-mode .related-post-item {
            background: rgba(40, 44, 52, 0.7);
        }
        
        .dark-mode .related-post-title {
            color: #e0e0e0;
        }
        
        .dark-mode .related-post-item:hover .related-post-title {
            color: #61dafb;
        }
    `;
    document.head.appendChild(style);
    
    // 加载文章数据并找出相关文章
    const loadRelatedPosts = async () => {
        try {
            const response = await fetch('/postList.json');
            if (!response.ok) {
                throw new Error('无法加载文章列表');
            }
            
            const postList = await response.json();
            const relatedPosts = findRelatedPosts(postList, currentPath, currentTitle, currentTags);
            
            // 显示相关文章
            const relatedPostsContent = document.getElementById('relatedPostsContent');
            
            if (relatedPosts.length > 0) {
                relatedPostsContent.innerHTML = relatedPosts.map(post => `
                    <div class="related-post-item">
                        <a href="${post.url}" class="related-post-link">
                            <div class="related-post-title">${post.title}</div>
                            <div class="related-post-meta">发布于 ${post.date}</div>
                        </a>
                    </div>
                `).join('');
            } else {
                relatedPostsContent.innerHTML = '<div class="no-related">没有找到相关文章</div>';
            }
            
        } catch (error) {
            console.error('加载相关文章错误:', error);
            document.getElementById('relatedPostsContent').innerHTML = '<div class="no-related">加载相关文章时出错</div>';
        }
    };
    
    // 查找相关文章
    const findRelatedPosts = (postList, currentPath, currentTitle, currentTags) => {
        // 过滤掉当前文章
        const otherPosts = postList.filter(post => post.url !== currentPath);
        
        // 计算每篇文章与当前文章的相关性
        const relatedPosts = otherPosts.map(post => {
            let similarity = 0;
            
            // 标题相似度（简单匹配关键词）
            const postTitle = post.title.toLowerCase();
            const titleWords = currentTitle.toLowerCase().split(/\s+/).filter(word => word.length > 2);
            
            titleWords.forEach(word => {
                if (postTitle.includes(word)) {
                    similarity += 0.3; // 标题匹配权重较高
                }
            });
            
            // 标签匹配
            const postTags = post.tags || [];
            const commonTags = currentTags.filter(tag => postTags.includes(tag));
            
            similarity += commonTags.length * 0.4; // 每个共同标签增加相关性
            
            return {
                ...post,
                similarity
            };
        });
        
        // 按相关性排序并返回前5个
        return relatedPosts
            .filter(post => post.similarity > 0)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);
    };
    
    // 加载相关文章
    loadRelatedPosts();
};

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 检测是否为桌面设备（宽度≥768px）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    // 如果是移动端则不应用桌面样式
    if (!isDesktop()) {
        console.log('检测到移动端视图，不应用桌面自定义样式');
        return;
    }

    // 添加新功能
    addFullTextSearch();
    addRelatedPosts();

    // 获取当前页面路径
    const currentPath = window.location.pathname;

    // 样式配置对象
    const styleConfig = {
        // 通用样式（适用于所有页面）
        common: {
            // 页面主体样式
            'body': `
                min-width: 200px;  // 最小宽度限制
                max-width: 885px;  // 最大内容宽度
                margin: 30px auto; // 上下边距30px，水平居中
                font-size: 20px;
                line-height: 1.6;
                background: rgba(237, 239, 233, 0.84);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                overflow: auto;
            `,
            // 侧边导航栏样式
            '.SideNav': `
                background: rgba(255, 255, 255, 0.6); // 半透明白色背景
                border-radius: 10px; // 圆角效果
                min-width: unset;    // 重置最小宽度
            `,
            '.SideNav-item': `
                transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out;
            `,
            '.SideNav-item:hover': `
                background-color: #c3e4e3;
                border-radius: 10px;
                transform: scale(1.02);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            `,
            // 特殊文本块样式
            'div[style*="margin-bottom: 16px"]': `
                font-family:
                    '华文行楷',          /* Windows楷体 */
                    'STKaiti',           /* macOS楷体 */
                    'Noto Serif CJK SC', /* Linux楷体替代 */
                    'WenQuanYi Micro Hei',
                    serif;               /* 备用字体 */
                font-size: 1.4em;
                color: rgb(0, 0, 0);
                text-shadow:
                    2px 2px 4px rgba(107, 70, 70, 0.2),
                    -1px -1px 1px rgba(255, 255, 255, 0.5);
                letter-spacing: 0.1em;
                line-height: 1.8;
                margin-bottom: 16px !important;
            `,
            // 代码块样式
            'pre': `
                background: rgba(245, 247, 250, 0.95) !important;
                border-radius: 8px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1) !important;
                border: 1px solid rgba(0, 0, 0, 0.1) !important;
                padding: 15px !important;
                margin: 1.5em 0 !important;
            `,
            'pre code': `
                font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace !important;
                font-size: 15px !important;
                line-height: 1.5 !important;
                color: #333 !important;
            `,
            // 图片样式
            'img': `
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                transition: all 0.2s ease;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                display: block;
                margin: 1.5em auto;
                object-fit: contain;
                background: #fff;
                padding: 5px;
            `,
            'img:hover': `
                transform: scale(1.02);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            `
        },
        // 首页专属样式
        home: {
            '#header': `
                height: 300px; // 头部区域高度
            `,
            '#header h1': `
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
            `,
            '.avatar': `
                width: 200px;
                height: 200px;
            `,
            '#header h1 a': `
                margin-top: 30px;
                font-family: fantasy;
                margin-left: unset;
            `
        },
        // 文章页专属样式
        article: {
            'body': `
                max-width: 1000px;  
                margin: 30px auto;
                font-size: 16px;
                line-height: 1.25;
                background: rgba(237, 239, 233, 0.84);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                overflow: auto;
            `,
            'body .markdown-body': `
                 font-size: 18px !important;  
                line-height: 1.4 !important;
            `,
            // 隐藏issue按钮
            'a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"]': `
                display: none !important;
            `,
            // 文章标题样式（h1-h6）
            'body .markdown-body h1, body .markdown-body h2, body .markdown-body h3, body .markdown-body h4, body .markdown-body h5, body .markdown-body h6, h1.postTitle': `
                font-family: '华文新魏', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif !important;
                margin-top: 1.5em !important;
                margin-bottom: 0.8em !important;
                font-weight: 600 !important;
            `,
        },
        // 分页页样式（暂未实现）
        page: {},
        // 暗黑模式样式
        stylesForDark: {
            'pre': `
                background: rgba(30, 34, 42, 0.95) !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
            `,
            'pre code': `
                color: #e6e6e6 !important;
            `,
            'img': `
                background: #333;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
            `
        }
    };

    const updateQuoteDiv = async () => {
        try {
            const response = await fetch('https://www.wniui.com/api/yiyan/index.php');
            const data = await response.json();
            const quoteDivs = document.querySelectorAll('div[style*="margin-bottom: 16px"]');
            
            quoteDivs.forEach(div => {
                div.textContent = data.data || "默认文本，API无返回时显示";
            });
        } catch (error) {
            console.error('获取名言API失败:', error);
        }
    };

    // 生成CSS字符串的函数
    const generateCSS = (styles) => {
        return Object.entries(styles)
            .map(([selector, rules]) => {
                // 格式化CSS规则：去除空格并确保以分号结尾
                const formattedRules = rules.trim().endsWith(';') 
                    ? rules.trim() 
                    : `${rules.trim()};`;
                return `${selector} { ${formattedRules} }`;
            })
            .join('\n');
    };

    // 检测当前页面类型（首页/文章/分页）
    const getPageType = () => {
        const routePatterns = [
            { type: 'home', pattern: /^(\/|\/index\.html)$/ },    // 首页路由
            { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ }, // 文章路由
            { type: 'page', pattern: /\/page\d+\.html$/ }          // 分页路由
        ];
        return routePatterns.find(p => p.pattern.test(currentPath))?.type;
    };

    // 应用样式的核心函数
    const applyStyles = () => {
        // 获取页面类型
        const pageType = getPageType();
        // 合并通用样式和特定页面样式
        const combinedStyles = {
            ...styleConfig.common,
            ...(styleConfig[pageType] || {})
        };
        
        // 生成CSS
        const css = generateCSS(combinedStyles);
        
        // 创建样式标签并添加到页面
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
        
        // 检查是否为暗黑模式
        const isDarkMode = document.documentElement.getAttribute('data-color-mode') === 'dark';
        if (isDarkMode) {
            // 暗黑模式样式
            const darkStyles = {
                'pre': `
                    background: rgba(30, 34, 42, 0.95) !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                `,
                'pre code': `
                    color: #e6e6e6 !important;
                `,
                'img': `
                    background: #333;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
                `
            };
            
            // 应用暗黑模式样式
            const darkCSS = generateCSS(darkStyles);
            const darkStyleElement = document.createElement('style');
            darkStyleElement.textContent = darkCSS;
            darkStyleElement.className = 'dark-mode-styles';
            document.head.appendChild(darkStyleElement);
        }
        
        // 添加事件监听器，在模式切换时更新样式
        document.addEventListener('colorschemechange', (e) => {
            const isDarkMode = e.detail.colorScheme === 'dark';
            
            // 移除旧的暗黑模式样式
            const oldDarkStyles = document.querySelector('.dark-mode-styles');
            if (oldDarkStyles) {
                oldDarkStyles.remove();
            }
            
            if (isDarkMode) {
                // 暗黑模式样式
                const darkStyles = {
                    'pre': `
                        background: rgba(30, 34, 42, 0.95) !important;
                        border-color: rgba(255, 255, 255, 0.1) !important;
                    `,
                    'pre code': `
                        color: #e6e6e6 !important;
                    `,
                    'img': `
                        background: #333;
                        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
                    `
                };
                
                // 应用暗黑模式样式
                const darkCSS = generateCSS(darkStyles);
                const darkStyleElement = document.createElement('style');
                darkStyleElement.textContent = darkCSS;
                darkStyleElement.className = 'dark-mode-styles';
                document.head.appendChild(darkStyleElement);
            }
        });
    };

    // 执行样式应用
    applyStyles();

    updateQuoteDiv();
});
