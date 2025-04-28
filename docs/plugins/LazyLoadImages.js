/**
 * Triumph 博客自定义图片懒加载插件
 * 专为 https://7r1UMPH.github.io 定制开发
 */
(function() {
    // 配置项
    const config = {
        rootMargin: '100px 0px', // 提前100px加载
        threshold: 0.1,          // 图片显示10%时加载
        placeholderColor: '#f5f5f5', // 占位符颜色
        fadeInDuration: 500      // 图片淡入效果持续时间(毫秒)
    };

    // 存储原始图片URL的数据属性名
    const DATA_SRC = 'data-triumph-src';
    
    // 忽略懒加载的图片选择器
    const IGNORE_SELECTORS = [
        '.avatar', 
        '.SideNav-icon img', 
        '.title-right img',
        '.mobile-float-button img',
        '.mobile-top-button img',
        'img[width="16"]',       // 小图标通常是16px宽
        'img[width="32"]'        // 小图标通常是32px宽
    ];

    // 图片加载完成后的回调
    function onImageLoad(img) {
        // 淡入动画
        img.style.opacity = '1';
        img.classList.add('triumph-lazy-loaded');
    }

    // 图片加载错误的回调
    function onImageError(img, originalSrc) {
        console.error(`Failed to load image: ${originalSrc}`);
        // 可选：设置备用图片或保留占位符
        img.style.opacity = '1';
        img.classList.add('triumph-lazy-error');
    }
    
    // 检查元素是否应该被忽略
    function shouldIgnore(img) {
        // 检查是否匹配任何忽略选择器
        for (const selector of IGNORE_SELECTORS) {
            if (img.matches(selector) || img.closest(selector)) {
                return true;
            }
        }
        
        // 检查图片是否太小（可能是图标）
        const width = img.getAttribute('width');
        const height = img.getAttribute('height');
        if ((width && parseInt(width) < 40) || (height && parseInt(height) < 40)) {
            return true;
        }
        
        return false;
    }

    // 处理图片
    function processImage(img) {
        // 如果图片应该被忽略，直接返回
        if (shouldIgnore(img)) {
            return;
        }
        
        // 获取原始图片地址，优先级：data-canonical-src > src
        const originalSrc = img.dataset.canonicalSrc || img.src;
        
        // 如果已处理过或没有有效的src，则跳过
        if (img.hasAttribute(DATA_SRC) || !originalSrc || 
            originalSrc.startsWith('data:') || originalSrc === '') {
            return;
        }
        
        // 保存原始地址
        img.setAttribute(DATA_SRC, originalSrc);
        
        // 设置内联占位符样式
        img.style.backgroundColor = config.placeholderColor;
        img.style.transition = `opacity ${config.fadeInDuration}ms ease`;
        img.style.opacity = '0';
        
        // 创建一个1x1像素的透明GIF作为占位符
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }

    // 图片加载器
    function loadImage(entry) {
        const img = entry.target;
        
        // 如果元素进入视口且有原始源
        if (entry.isIntersecting && img.hasAttribute(DATA_SRC)) {
            const originalSrc = img.getAttribute(DATA_SRC);
            
            // 移除数据属性，防止重复加载
            img.removeAttribute(DATA_SRC);
            
            // 图片加载
            img.src = originalSrc;
            
            // 恢复data-canonical-src（如果存在）
            if (img.dataset.canonicalSrc) {
                img.dataset.canonicalSrc = originalSrc;
            }
            
            // 设置事件处理程序
            img.onload = function() {
                onImageLoad(img);
            };
            
            img.onerror = function() {
                onImageError(img, originalSrc);
            };
            
            // 停止观察此图片
            observer.unobserve(img);
        }
    }

    // 初始化Intersection Observer
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(loadImage);
        },
        {
            rootMargin: config.rootMargin,
            threshold: config.threshold
        }
    );

    // 初始化函数
    function initialize() {
        // 获取所有图片
        const images = document.querySelectorAll('img');
        
        // 处理每个图片
        images.forEach(img => {
            processImage(img);
            
            // 如果图片已处理（有DATA_SRC属性），则观察它
            if (img.hasAttribute(DATA_SRC)) {
                observer.observe(img);
            }
        });
        
        console.log('Triumph懒加载初始化完成：已处理', document.querySelectorAll(`img[${DATA_SRC}]`).length, '张图片');
    }

    // 在DOM完全加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // 如果DOM已经加载完成，直接初始化
        initialize();
    }

    // 添加用于动态内容的公共API
    window.TriumphLazyLoad = {
        // 刷新所有图片（用于动态添加的内容）
        refresh: function() {
            initialize();
        },
        
        // 手动处理特定容器内的图片
        processContainer: function(container) {
            const images = container.querySelectorAll('img');
            images.forEach(img => {
                processImage(img);
                if (img.hasAttribute(DATA_SRC)) {
                    observer.observe(img);
                }
            });
        }
    };
})(); 