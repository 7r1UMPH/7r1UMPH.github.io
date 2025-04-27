/**
 * 增强的站内搜索功能
 * 支持关键词高亮、结果排序和本地存储搜索历史
 */

// 文章数据缓存
let blogPosts = [];
let searchIndex = {};
let searchHistory = [];

// 初始化搜索功能
function initSearch() {
    // 加载搜索历史
    loadSearchHistory();
    
    // 获取文章列表数据
    fetchBlogData();
    
    // 在页面中插入搜索框
    insertSearchBar();
    
    // 为页面中已有的搜索框添加事件监听
    enhanceExistingSearch();
}

// 获取博客数据
function fetchBlogData() {
    fetch('/postList.json')
        .then(response => response.json())
        .then(data => {
            blogPosts = data;
            buildSearchIndex(data);
        })
        .catch(error => console.error('Error loading blog data:', error));
}

// 构建搜索索引
function buildSearchIndex(posts) {
    posts.forEach(post => {
        // 标题和标签作为关键词添加到索引
        const keywords = [
            post.title.toLowerCase(),
            ...(post.labels || []).map(label => label.toLowerCase())
        ];
        
        // 添加到搜索索引
        keywords.forEach(keyword => {
            if (!searchIndex[keyword]) {
                searchIndex[keyword] = [];
            }
            if (!searchIndex[keyword].includes(post.link)) {
                searchIndex[keyword].push(post.link);
            }
        });
    });
}

// 插入搜索框到页面
function insertSearchBar() {
    // 检查是否是文章页面
    if (window.location.pathname.includes('/post/')) {
        const article = document.querySelector('.markdown-body');
        if (!article) return;
        
        const searchBar = document.createElement('div');
        searchBar.className = 'enhanced-search-bar';
        searchBar.innerHTML = `
            <div class="search-container">
                <input type="search" class="search-input" placeholder="搜索博客内容..." aria-label="搜索">
                <button class="search-button">搜索</button>
            </div>
            <div class="search-results" style="display: none;"></div>
        `;
        
        // 插入到文章前面
        article.parentNode.insertBefore(searchBar, article);
        
        // 添加搜索事件监听
        const input = searchBar.querySelector('.search-input');
        const button = searchBar.querySelector('.search-button');
        const results = searchBar.querySelector('.search-results');
        
        button.addEventListener('click', () => {
            performSearch(input.value, results);
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(input.value, results);
            }
        });
    }
}

// 增强已有的搜索框
function enhanceExistingSearch() {
    // 在标签页增强搜索
    const existingSearch = document.querySelector('.subnav-search-input');
    if (existingSearch) {
        const searchButton = document.querySelector('.subnav-search button');
        if (searchButton) {
            // 替换原有的点击事件
            searchButton.onclick = null;
            searchButton.addEventListener('click', () => {
                const query = existingSearch.value;
                saveToSearchHistory(query);
                // 使用原有的搜索函数
                if (typeof searchShow === 'function') {
                    searchShow();
                } else {
                    performSearchInCurrentPage(query);
                }
            });
        }
        
        // 添加历史记录下拉菜单
        addSearchHistoryDropdown(existingSearch);
    }
}

// 执行搜索
function performSearch(query, resultsContainer) {
    if (!query.trim()) return;
    
    // 保存到搜索历史
    saveToSearchHistory(query);
    
    // 显示结果容器
    resultsContainer.style.display = 'block';
    
    // 构建查询关键词列表
    const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 0);
    
    // 匹配结果和评分
    const results = blogPosts.map(post => {
        const titleScore = keywords.reduce((score, keyword) => {
            return post.title.toLowerCase().includes(keyword) ? score + 3 : score;
        }, 0);
        
        const labelScore = keywords.reduce((score, keyword) => {
            return (post.labels || []).some(label => 
                label.toLowerCase().includes(keyword)
            ) ? score + 2 : score;
        }, 0);
        
        return {
            post,
            score: titleScore + labelScore
        };
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    // 显示结果
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">没有找到相关结果</div>';
    } else {
        const resultHtml = results.map(item => {
            const post = item.post;
            const highlightedTitle = highlightText(post.title, keywords);
            const labels = (post.labels || []).map(label => 
                `<span class="result-label">${highlightText(label, keywords)}</span>`
            ).join('');
            
            return `
                <div class="search-result-item">
                    <a href="${post.link}" class="result-title">${highlightedTitle}</a>
                    <div class="result-meta">
                        <span class="result-date">${post.createdAt.split('T')[0]}</span>
                        ${labels}
                    </div>
                </div>
            `;
        }).join('');
        
        resultsContainer.innerHTML = `
            <div class="results-header">找到 ${results.length} 个结果:</div>
            <div class="results-list">${resultHtml}</div>
        `;
    }
    
    // 添加样式
    addSearchStyles();
}

// 在当前页面执行搜索
function performSearchInCurrentPage(query) {
    // 获取页面中的所有文章项
    const articles = document.querySelectorAll('.SideNav-item');
    if (!articles.length) return;
    
    let foundCount = 0;
    
    // 遍历所有文章
    articles.forEach(article => {
        const title = article.querySelector('.listTitle');
        if (!title) return;
        
        // 检查标题是否包含查询词
        if (title.textContent.toLowerCase().includes(query.toLowerCase())) {
            article.style.display = 'flex';
            foundCount++;
            
            // 高亮标题文本
            const originalText = title.textContent;
            title.innerHTML = originalText.replace(
                new RegExp(`(${query})`, 'gi'),
                '<mark>$1</mark>'
            );
        } else {
            article.style.display = 'none';
        }
    });
    
    // 显示结果数量
    const notFound = document.querySelector('.notFind');
    if (notFound) {
        if (foundCount === 0) {
            notFound.style.display = 'block';
            notFound.textContent = `没有找到与 "${query}" 相关的内容`;
        } else {
            notFound.style.display = 'none';
        }
    }
}

// 高亮文本中的关键词
function highlightText(text, keywords) {
    let result = text;
    keywords.forEach(keyword => {
        if (keyword.length > 0) {
            const regex = new RegExp(`(${keyword})`, 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        }
    });
    return result;
}

// 添加搜索相关样式
function addSearchStyles() {
    // 检查是否已经添加了样式
    if (document.getElementById('search-styles')) return;
    
    const styleTag = document.createElement('style');
    styleTag.id = 'search-styles';
    styleTag.textContent = `
        .enhanced-search-bar {
            margin: 20px 0;
            width: 100%;
        }
        
        .search-container {
            display: flex;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .search-input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-right: none;
            border-radius: 4px 0 0 4px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.3s;
        }
        
        .search-input:focus {
            border-color: #4CAF50;
        }
        
        .search-button {
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .search-button:hover {
            background: #3c9f40;
        }
        
        .search-results {
            max-width: 800px;
            margin: 20px auto;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 15px;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
        }
        
        .results-header {
            font-size: 16px;
            color: #555;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        
        .search-result-item {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .search-result-item:last-child {
            border-bottom: none;
        }
        
        .result-title {
            display: block;
            font-size: 18px;
            color: #0366d6;
            margin-bottom: 5px;
            text-decoration: none;
        }
        
        .result-title:hover {
            text-decoration: underline;
        }
        
        .result-meta {
            font-size: 13px;
            color: #666;
        }
        
        .result-date {
            margin-right: 10px;
        }
        
        .result-label {
            display: inline-block;
            background: rgba(76, 175, 80, 0.1);
            color: #4CAF50;
            border-radius: 3px;
            padding: 2px 6px;
            margin-right: 5px;
            font-size: 12px;
        }
        
        mark {
            background-color: rgba(255, 255, 0, 0.4);
            padding: 0 2px;
            border-radius: 2px;
        }
        
        .no-results {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        
        .search-history-dropdown {
            position: absolute;
            width: calc(100% - 40px);
            max-height: 200px;
            overflow-y: auto;
            background: white;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 4px 4px;
            z-index: 100;
            display: none;
        }
        
        .search-history-item {
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .search-history-item:hover {
            background-color: #f5f5f5;
        }
        
        .search-history-item:last-child {
            border-bottom: none;
        }
        
        .clear-history {
            text-align: center;
            color: #999;
            padding: 8px;
            border-top: 1px solid #eee;
            cursor: pointer;
        }
        
        .clear-history:hover {
            color: #666;
            background-color: #f5f5f5;
        }
    `;
    
    document.head.appendChild(styleTag);
}

// 保存搜索历史
function saveToSearchHistory(query) {
    query = query.trim();
    if (!query) return;
    
    // 从本地存储加载历史记录
    loadSearchHistory();
    
    // 移除已存在的相同查询
    const index = searchHistory.indexOf(query);
    if (index !== -1) {
        searchHistory.splice(index, 1);
    }
    
    // 添加到历史记录开头
    searchHistory.unshift(query);
    
    // 限制历史记录数量
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(0, 10);
    }
    
    // 保存到本地存储
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// 加载搜索历史
function loadSearchHistory() {
    try {
        const history = localStorage.getItem('searchHistory');
        searchHistory = history ? JSON.parse(history) : [];
    } catch (e) {
        searchHistory = [];
        console.error('Error loading search history:', e);
    }
}

// 清除搜索历史
function clearSearchHistory() {
    searchHistory = [];
    localStorage.removeItem('searchHistory');
    
    // 更新所有下拉菜单
    document.querySelectorAll('.search-history-dropdown').forEach(dropdown => {
        dropdown.innerHTML = '<div class="no-history">无搜索历史</div>';
    });
}

// 添加搜索历史下拉菜单
function addSearchHistoryDropdown(searchInput) {
    // 创建下拉容器
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'search-history-dropdown';
    searchInput.parentNode.style.position = 'relative';
    searchInput.parentNode.appendChild(dropdownContainer);
    
    // 添加焦点事件
    searchInput.addEventListener('focus', () => {
        updateHistoryDropdown(dropdownContainer);
        dropdownContainer.style.display = 'block';
    });
    
    // 添加失焦事件（延迟隐藏，以便可以点击历史记录）
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            dropdownContainer.style.display = 'none';
        }, 200);
    });
    
    // 添加输入事件
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            updateHistoryDropdown(dropdownContainer);
            dropdownContainer.style.display = 'block';
        } else {
            dropdownContainer.style.display = 'none';
        }
    });
}

// 更新历史下拉菜单
function updateHistoryDropdown(dropdown) {
    if (searchHistory.length === 0) {
        dropdown.innerHTML = '<div class="search-history-item">无搜索历史</div>';
        return;
    }
    
    let historyHtml = searchHistory.map(query => 
        `<div class="search-history-item" data-query="${query}">${query}</div>`
    ).join('');
    
    historyHtml += '<div class="clear-history">清除搜索历史</div>';
    dropdown.innerHTML = historyHtml;
    
    // 添加点击事件
    dropdown.querySelectorAll('.search-history-item').forEach(item => {
        item.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            if (!query) return;
            
            // 设置搜索框值
            const searchInput = dropdown.parentNode.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.value = query;
                
                // 执行搜索
                const searchButton = dropdown.parentNode.querySelector('button');
                if (searchButton) {
                    searchButton.click();
                }
            }
        });
    });
    
    // 添加清除历史记录事件
    const clearButton = dropdown.querySelector('.clear-history');
    if (clearButton) {
        clearButton.addEventListener('click', function(e) {
            e.stopPropagation();
            clearSearchHistory();
            dropdown.style.display = 'none';
        });
    }
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initSearch); 