/**
 * SEO优化工具
 * 添加结构化数据、元数据改进和链接优化
 */

// 初始化SEO优化
function initSEOOptimizer() {
    // 添加结构化数据
    addStructuredData();
    
    // 优化页面元数据
    optimizeMetadata();
    
    // 处理外部链接
    enhanceExternalLinks();
    
    // 添加面包屑导航（仅文章页）
    if (isArticlePage()) {
        addBreadcrumbNavigation();
    }
}

// 检查是否是文章页
function isArticlePage() {
    return window.location.pathname.includes('/post/');
}

// 添加结构化数据
function addStructuredData() {
    // 检查页面类型
    if (isArticlePage()) {
        // 文章页结构化数据
        addArticleStructuredData();
    } else if (window.location.pathname === '/' || window.location.pathname.includes('/index.html')) {
        // 首页结构化数据
        addWebsiteStructuredData();
    }
}

// 添加文章结构化数据
function addArticleStructuredData() {
    // 获取文章信息
    const article = document.querySelector('.markdown-body');
    if (!article) return;
    
    const title = document.title;
    const description = getMetaContent('description') || '';
    const url = window.location.href;
    const datePublished = getArticleDate();
    const imageUrl = getArticleImage();
    const author = {
        "@type": "Person",
        "name": "Triumph",
        "url": "https://7r1UMPH.github.io"
    };
    
    // 创建Article结构化数据
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": imageUrl,
        "author": author,
        "publisher": {
            "@type": "Organization",
            "name": "Triumph Blog",
            "logo": {
                "@type": "ImageObject",
                "url": "https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png"
            }
        },
        "datePublished": datePublished,
        "dateModified": datePublished,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        }
    };
    
    // 添加面包屑结构化数据
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "首页",
                "item": "https://7r1UMPH.github.io"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": title,
                "item": url
            }
        ]
    };
    
    // 插入结构化数据
    insertStructuredData(articleSchema);
    insertStructuredData(breadcrumbSchema);
}

// 添加网站结构化数据
function addWebsiteStructuredData() {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Triumph Blog",
        "url": "https://7r1UMPH.github.io",
        "description": getMetaContent('description') || "Triumph的个人博客",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://7r1UMPH.github.io/tag.html#{search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };
    
    // 插入结构化数据
    insertStructuredData(websiteSchema);
}

// 插入结构化数据到页面
function insertStructuredData(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
}

// 获取文章发布日期
function getArticleDate() {
    // 尝试从页面获取日期信息
    const dateElement = document.querySelector('.Label.LabelTime');
    if (dateElement) {
        return dateElement.textContent;
    }
    
    // 默认返回当前日期
    return new Date().toISOString().split('T')[0];
}

// 获取文章首图
function getArticleImage() {
    // 尝试从文章内容获取第一张图片
    const article = document.querySelector('.markdown-body');
    if (article) {
        const firstImage = article.querySelector('img');
        if (firstImage) {
            return firstImage.src;
        }
    }
    
    // 返回默认图片
    return 'https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png';
}

// 优化页面元数据
function optimizeMetadata() {
    // 检查是否存在描述元标签
    if (!getMetaContent('description')) {
        // 生成描述
        const description = generateDescription();
        if (description) {
            addMetaTag('description', description);
        }
    }
    
    // 添加Open Graph元标签
    addOpenGraphTags();
    
    // 添加Twitter Cards元标签
    addTwitterCardTags();
    
    // 添加规范链接
    addCanonicalLink();
}

// 获取元标签内容
function getMetaContent(name) {
    const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return meta ? meta.getAttribute('content') : null;
}

// 添加元标签
function addMetaTag(name, content) {
    const meta = document.createElement('meta');
    if (name.includes(':')) {
        meta.setAttribute('property', name);
    } else {
        meta.setAttribute('name', name);
    }
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
}

// 生成页面描述
function generateDescription() {
    // 如果是文章页面，从文章内容生成描述
    if (isArticlePage()) {
        const article = document.querySelector('.markdown-body');
        if (article) {
            // 获取文章前几个段落的文本
            const paragraphs = article.querySelectorAll('p');
            let text = '';
            let count = 0;
            
            // 合并前3个段落或最多150个字符
            for (let i = 0; i < paragraphs.length && count < 3; i++) {
                const p = paragraphs[i];
                if (p.textContent.trim()) {
                    text += p.textContent.trim() + ' ';
                    count++;
                }
            }
            
            // 截断为适当长度
            if (text) {
                return text.substring(0, 150) + (text.length > 150 ? '...' : '');
            }
        }
    }
    
    // 默认描述
    return 'Triumph的个人博客 - 分享技术和生活';
}

// 添加Open Graph元标签
function addOpenGraphTags() {
    const title = document.title;
    const description = getMetaContent('description') || generateDescription();
    const url = window.location.href;
    const image = isArticlePage() ? getArticleImage() : 'https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png';
    
    // 添加基本OG标签
    addMetaTag('og:title', title);
    addMetaTag('og:description', description);
    addMetaTag('og:url', url);
    addMetaTag('og:image', image);
    addMetaTag('og:type', isArticlePage() ? 'article' : 'website');
    addMetaTag('og:site_name', 'Triumph Blog');
}

// 添加Twitter Cards元标签
function addTwitterCardTags() {
    const title = document.title;
    const description = getMetaContent('description') || generateDescription();
    const image = isArticlePage() ? getArticleImage() : 'https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png';
    
    // 添加Twitter Card标签
    addMetaTag('twitter:card', 'summary_large_image');
    addMetaTag('twitter:title', title);
    addMetaTag('twitter:description', description);
    addMetaTag('twitter:image', image);
}

// 添加规范链接
function addCanonicalLink() {
    // 检查是否已有规范链接
    if (!document.querySelector('link[rel="canonical"]')) {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = window.location.href.split('#')[0].split('?')[0]; // 去除片段和查询参数
        document.head.appendChild(link);
    }
}

// 增强外部链接
function enhanceExternalLinks() {
    // 获取所有链接
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        // 检查是否是外部链接
        if (link.hostname !== window.location.hostname && 
            !link.getAttribute('rel')) {
            // 为外部链接添加rel属性
            link.setAttribute('rel', 'noopener noreferrer');
            
            // 为外部链接添加打开方式（如果没有指定）
            if (!link.getAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
            
            // 添加外部链接指示器样式
            if (!link.querySelector('.external-link-icon')) {
                const icon = document.createElement('span');
                icon.className = 'external-link-icon';
                icon.innerHTML = ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
                link.appendChild(icon);
            }
        }
    });
    
    // 添加外部链接图标样式
    const style = document.createElement('style');
    style.textContent = `
        .external-link-icon {
            display: inline-block;
            opacity: 0.6;
            transition: opacity 0.2s ease;
            vertical-align: middle;
            margin-left: 3px;
        }
        
        a:hover .external-link-icon {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// 添加面包屑导航
function addBreadcrumbNavigation() {
    // 仅在文章页添加面包屑
    if (!isArticlePage()) return;
    
    // 创建面包屑元素
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'page-breadcrumb';
    breadcrumb.innerHTML = `
        <a href="/" class="breadcrumb-item">首页</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">${document.title}</span>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .page-breadcrumb {
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
        }
        
        .breadcrumb-item {
            color: #0366d6;
            text-decoration: none;
        }
        
        .breadcrumb-item:hover {
            text-decoration: underline;
        }
        
        .breadcrumb-separator {
            margin: 0 8px;
            color: #999;
        }
        
        .breadcrumb-current {
            color: #333;
            font-weight: 500;
            max-width: 50%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            vertical-align: middle;
        }
    `;
    document.head.appendChild(style);
    
    // 插入到文章前面
    const article = document.querySelector('.markdown-body');
    if (article) {
        article.parentNode.insertBefore(breadcrumb, article);
    }
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initSEOOptimizer); 