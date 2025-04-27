/**
 * 图片懒加载功能 - 为Triumph Blog定制
 * 只有当图片滚动到可视区域内才加载图片
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化懒加载功能
    initLazyLoad();
});

/**
 * 初始化懒加载功能
 */
function initLazyLoad() {
    // 在内容加载完成时执行图片转换
    convertImagesToLazyLoad();
    
    // 监听内容变化，以支持动态加载的内容
    const contentObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查是否新添加了图片元素
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素节点
                        const newImages = node.querySelectorAll('img:not(.lazy)');
                        if (newImages.length > 0) {
                            convertImagesToLazyLoad();
                        }
                    }
                });
            }
        });
    });
    
    // 监视文档内容变化
    const content = document.querySelector('#content');
    if (content) {
        contentObserver.observe(content, { childList: true, subtree: true });
    }
    
    // 启动懒加载监听
    startLazyLoadObserver();
}

/**
 * 将页面中的所有图片转换为懒加载格式
 */
function convertImagesToLazyLoad() {
    // 获取所有博客文章内容中的图片，排除已经有lazy类的图片
    const contentImages = document.querySelectorAll('.markdown-body img:not(.lazy)');
    
    contentImages.forEach(function(img) {
        // 如果图片没有src或已经处理过，则跳过
        if (!img.src || img.classList.contains('lazy')) return;
        
        // 创建一个占位元素
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.height = img.height > 0 ? img.height + 'px' : '200px';
        placeholder.style.width = img.width > 0 ? img.width + 'px' : '100%';
        
        // 保存原始src
        const originalSrc = img.src;
        
        // 将原始src移动到data-src
        img.setAttribute('data-src', originalSrc);
        
        // 添加懒加载标记类
        img.classList.add('lazy');
        
        // 设置一个占位符图片
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
        
        // 将占位元素插入到图片前面
        img.parentNode.insertBefore(placeholder, img);
        
        // 设置图片加载事件
        img.onload = function() {
            if (this.src !== this.getAttribute('data-src')) return;
            this.classList.add('loaded');
            // 图片加载完成后移除占位元素
            if (this.previousElementSibling && this.previousElementSibling.classList.contains('image-placeholder')) {
                this.previousElementSibling.remove();
            }
        };
    });
}

/**
 * 启动懒加载监听器
 */
function startLazyLoadObserver() {
    // 获取所有需要懒加载的图片
    let lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
    
    // 如果浏览器支持 IntersectionObserver API
    if ('IntersectionObserver' in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    // 将 data-src 的值赋给 src
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        // 图片加载完成事件在onload中处理
                        observer.unobserve(lazyImage);
                    }
                }
            });
        }, {
            rootMargin: '200px 0px' // 提前200px开始加载
        });

        // 对每个懒加载图片进行观察
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // 回退方案: 如果浏览器不支持 IntersectionObserver
        // 简单的滚动事件监听器
        let active = false;

        const lazyLoad = function() {
            if (active === false) {
                active = true;
                
                setTimeout(function() {
                    lazyImages.forEach(function(lazyImage) {
                        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight + 200 && 
                            lazyImage.getBoundingClientRect().bottom >= 0) && 
                            getComputedStyle(lazyImage).display !== 'none') {
                            
                            if (lazyImage.dataset.src) {
                                lazyImage.src = lazyImage.dataset.src;
                                // 图片加载完成事件在onload中处理
                            }

                            lazyImages = lazyImages.filter(function(image) {
                                return image !== lazyImage;
                            });

                            if (lazyImages.length === 0) {
                                document.removeEventListener('scroll', lazyLoad);
                                window.removeEventListener('resize', lazyLoad);
                                window.removeEventListener('orientationchange', lazyLoad);
                            }
                        }
                    });
                    
                    active = false;
                }, 200);
            }
        };

        // 添加事件监听器
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
        lazyLoad(); // 初始加载
    }
    
    // 每5秒钟检查一次新图片
    setInterval(function() {
        // 重新获取所有带lazy类但未加载的图片
        let newLazyImages = [].slice.call(document.querySelectorAll('img.lazy:not(.loaded)'));
        if (newLazyImages.length > 0 && newLazyImages.length !== lazyImages.length) {
            // 重新初始化懒加载
            lazyImages = newLazyImages;
            startLazyLoadObserver();
        }
    }, 5000);
} 