/**
 * 页面平滑过渡效果
 * 为页面切换添加精美的过渡动画
 */

// 初始化页面过渡效果
function initSmoothTransitions() {
    // 创建过渡动画样式
    createTransitionStyles();
    
    // 添加页面入场动画
    addPageEntranceAnimation();
    
    // 为内部链接添加平滑过渡
    setupLinkTransitions();
    
    // 优化锚点滚动
    enhanceAnchorScrolling();
}

// 创建过渡动画样式
function createTransitionStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 页面入场动画 */
        .content-fade-in {
            animation: contentFadeIn 0.6s ease-out forwards;
        }
        
        @keyframes contentFadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* 页面过渡遮罩 */
        .page-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(76, 175, 80, 0.2);
            backdrop-filter: blur(5px);
            z-index: 9999;
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
            pointer-events: none;
        }
        
        .page-transition-overlay.active {
            visibility: visible;
            opacity: 1;
        }
        
        /* 平滑滚动修饰器 */
        html {
            scroll-behavior: smooth;
        }
        
        /* 滚动指示器 */
        .scroll-indicator {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(to right, #4CAF50, #8BC34A);
            z-index: 1000;
            width: 0%;
            transition: width 0.2s ease;
        }
        
        /* 自定义链接悬停效果 */
        a {
            position: relative;
            transition: color 0.2s ease;
        }
        
        a::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            bottom: 0;
            left: 0;
            background-color: currentColor;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
        }
        
        a:hover::after {
            transform: scaleX(1);
            transform-origin: left;
        }
        
        /* 缓动背景颜色 */
        body {
            transition: background-color 0.5s ease;
        }
    `;
    document.head.appendChild(style);
}

// 添加页面入场动画
function addPageEntranceAnimation() {
    // 获取主要内容元素
    const contentElements = [
        document.getElementById('content'),
        document.querySelector('.markdown-body'),
        document.querySelector('.container-lg')
    ].filter(Boolean);
    
    // 为内容元素添加过渡动画
    contentElements.forEach(element => {
        element.classList.add('content-fade-in');
    });
    
    // 创建滚动指示器
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);
    
    // 监听滚动事件更新指示器
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollIndicator.style.width = scrolled + '%';
    });
}

// 设置链接过渡效果
function setupLinkTransitions() {
    // 创建过渡遮罩元素
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
    
    // 查找所有内部链接
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        // 忽略外部链接、锚点链接和带特殊属性的链接
        if (link.hostname !== window.location.hostname || 
            link.getAttribute('target') === '_blank' ||
            link.getAttribute('download') !== null ||
            link.href.includes('#') ||
            link.onclick !== null) {
            return;
        }
        
        // 添加过渡效果
        link.addEventListener('click', function(event) {
            // 阻止默认行为
            event.preventDefault();
            
            // 获取目标URL
            const targetUrl = this.href;
            
            // 激活过渡遮罩
            overlay.classList.add('active');
            
            // 在短暂延迟后导航到新页面
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 300);
        });
    });
    
    // 处理后退前进按钮
    window.addEventListener('pageshow', event => {
        if (event.persisted) {
            // 从前进/后退缓存中恢复时，确保遮罩已移除
            overlay.classList.remove('active');
        }
    });
}

// 增强锚点链接滚动效果
function enhanceAnchorScrolling() {
    // 获取所有锚点链接
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // 获取目标元素
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            // 如果目标元素存在
            if (targetElement) {
                event.preventDefault();
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetElement.offsetTop - 20, // 留出一点空间
                    behavior: 'smooth'
                });
                
                // 更新URL而不触发页面跳转
                history.pushState(null, null, `#${targetId}`);
                
                // 为目标元素添加短暂高亮
                highlightElement(targetElement);
            }
        });
    });
}

// 高亮显示元素
function highlightElement(element) {
    // 保存原始背景色
    const originalBackground = element.style.backgroundColor;
    const originalTransition = element.style.transition;
    
    // 添加过渡效果
    element.style.transition = 'background-color 1.5s ease';
    
    // 设置高亮背景色
    element.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
    
    // 恢复原始背景色
    setTimeout(() => {
        element.style.backgroundColor = originalBackground;
        
        // 稍后恢复原始过渡设置
        setTimeout(() => {
            element.style.transition = originalTransition;
        }, 1500);
    }, 1000);
}

// 添加页面离开动画
function setupPageExitAnimation() {
    // 监听页面卸载事件
    window.addEventListener('beforeunload', () => {
        // 获取主要内容元素
        const contentElements = [
            document.getElementById('content'),
            document.querySelector('.markdown-body'),
            document.querySelector('.container-lg')
        ].filter(Boolean);
        
        // 为内容元素添加退出动画
        contentElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    });
}

// 提高感知性能的额外视觉效果
function addPerformanceEnhancements() {
    // 为按钮添加点击涟漪效果
    const buttons = document.querySelectorAll('button, .btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            // 创建涟漪元素
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            this.appendChild(ripple);
            
            // 设置涟漪位置和尺寸
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
            
            // 动画结束后移除元素
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });
    
    // 添加涟漪效果样式
    const style = document.createElement('style');
    style.textContent = `
        button, .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化平滑过渡
    initSmoothTransitions();
    
    // 设置页面退出动画
    setupPageExitAnimation();
    
    // 添加额外性能增强
    addPerformanceEnhancements();
}); 