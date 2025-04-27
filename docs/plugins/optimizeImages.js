/**
 * 图片优化脚本
 * 实现懒加载、渐进式加载和格式优化
 */

// 初始化图片优化
function initImageOptimization() {
    // 为所有图片添加懒加载
    enableLazyLoading();
    
    // 添加图片加载进度效果
    addProgressiveLoading();
}

// 为所有图片启用懒加载
function enableLazyLoading() {
    // 获取所有图片
    const images = document.querySelectorAll('img');
    if (!images.length) return;
    
    // 设置懒加载选项
    const lazyLoadOptions = {
        root: null, // 使用视口作为根
        rootMargin: '100px', // 提前100px开始加载
        threshold: 0.1 // 当10%的图片进入视口时加载
    };
    
    // 创建Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // 获取原始图片源
                const src = img.getAttribute('data-src') || img.getAttribute('src');
                if (!src) return;
                
                // 设置占位符
                if (!img.getAttribute('data-src')) {
                    img.setAttribute('data-src', src);
                    img.src = getPlaceholderImage(img);
                    img.style.filter = 'blur(5px)';
                    img.style.transition = 'filter 0.3s ease';
                }
                
                // 创建新图像预加载
                const newImage = new Image();
                newImage.src = src;
                newImage.onload = function() {
                    img.src = src;
                    img.style.filter = 'blur(0)';
                    img.classList.add('loaded');
                    
                    // 替换为WebP格式（如果浏览器支持）
                    checkWebpSupport().then(supported => {
                        if (supported && !src.endsWith('.svg') && !src.endsWith('.gif')) {
                            convertToWebp(img, src);
                        }
                    });
                };
                
                // 图像加载完毕后停止观察
                observer.unobserve(img);
            }
        });
    }, lazyLoadOptions);
    
    // 开始观察所有图片
    images.forEach(img => {
        // 跳过已经处理过的图片
        if (img.classList.contains('loaded')) return;
        
        imageObserver.observe(img);
    });
}

// 添加渐进式加载效果
function addProgressiveLoading() {
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        img {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease;
        }
        
        img.loaded {
            opacity: 1;
            transform: translateY(0);
        }
        
        .img-placeholder {
            background: #f0f0f0;
            position: relative;
            overflow: hidden;
        }
        
        .img-placeholder::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
            animation: placeholderShimmer 1.5s infinite;
        }
        
        @keyframes placeholderShimmer {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 为已加载的图片添加loaded类
    document.addEventListener('load', function(event) {
        if (event.target.tagName === 'IMG') {
            event.target.classList.add('loaded');
        }
    }, true);
}

// 获取占位符图片
function getPlaceholderImage(img) {
    // 创建占位符元素尺寸
    const width = img.width || 100;
    const height = img.height || 100;
    
    // 占位图SVG
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E`;
}

// 检查浏览器是否支持WebP
function checkWebpSupport() {
    // 使用Promise包装检测
    return new Promise(resolve => {
        const webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        webP.onload = webP.onerror = function () {
            resolve(webP.height === 2);
        };
    });
}

// 将图像转换为WebP格式（如果可能）
function convertToWebp(img, originalSrc) {
    // 只对于来自CDN或特定域名的图片转换
    if (originalSrc.includes('cdn.jsdelivr.net') || 
        originalSrc.includes('7r1UMPH.github.io')) {
        
        // 尝试替换为WebP版本
        const webpSrc = originalSrc.replace(/\.(jpe?g|png)($|\?)/, '.webp$2');
        
        // 检查WebP版本是否存在
        fetch(webpSrc, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    img.src = webpSrc;
                }
            })
            .catch(() => {
                // 如果WebP版本不存在，保持原样
            });
    }
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initImageOptimization); 