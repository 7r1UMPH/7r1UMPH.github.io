/**
 * 阅读进度保存和页面交互改进
 * 功能：记住上次阅读位置、页面过渡动画、平滑滚动
 */

// 初始化
function initReadingProgress() {
    // 检查是否是文章页面
    if (!isArticlePage()) return;
    
    // 为文章页添加滚动处理
    handleArticleScroll();
    
    // 回到上次阅读位置
    restoreReadingPosition();
    
    // 添加页面过渡效果
    addPageTransitions();
    
    // 增强图片预览
    enhanceImageViewing();
    
    // 添加页面分享功能
    addSharingButtons();
}

// 检查是否是文章页面
function isArticlePage() {
    return window.location.pathname.includes('/post/');
}

// 处理文章滚动逻辑
function handleArticleScroll() {
    const article = document.querySelector('.markdown-body');
    if (!article) return;
    
    // 监听滚动事件，保存滚动位置
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPos = window.scrollY;
            const path = window.location.pathname;
            saveReadingPosition(path, scrollPos);
        }, 200);
    });
}

// 保存阅读位置
function saveReadingPosition(path, position) {
    try {
        // 获取现有的阅读记录
        let readingPositions = JSON.parse(localStorage.getItem('readingPositions')) || {};
        
        // 更新当前页面的阅读位置
        readingPositions[path] = {
            position,
            timestamp: Date.now()
        };
        
        // 清理过期记录（30天过期）
        const now = Date.now();
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30天
        
        Object.keys(readingPositions).forEach(key => {
            if (now - readingPositions[key].timestamp > maxAge) {
                delete readingPositions[key];
            }
        });
        
        // 保存回本地存储
        localStorage.setItem('readingPositions', JSON.stringify(readingPositions));
    } catch (e) {
        console.error('Error saving reading position:', e);
    }
}

// 恢复阅读位置
function restoreReadingPosition() {
    try {
        const path = window.location.pathname;
        const readingPositions = JSON.parse(localStorage.getItem('readingPositions')) || {};
        
        if (readingPositions[path]) {
            const position = readingPositions[path].position;
            
            // 首先让页面完全加载，然后滚动到上次位置
            setTimeout(() => {
                window.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
                
                // 添加提示
                showPositionIndicator(position);
            }, 300);
        }
    } catch (e) {
        console.error('Error restoring reading position:', e);
    }
}

// 显示位置指示器
function showPositionIndicator(position) {
    const indicator = document.createElement('div');
    indicator.className = 'position-indicator';
    indicator.innerHTML = '<span>上次阅读到这里</span>';
    indicator.style.cssText = `
        position: absolute;
        left: 0;
        background: rgba(76, 175, 80, 0.8);
        color: white;
        padding: 8px 16px;
        border-radius: 0 4px 4px 0;
        font-size: 14px;
        z-index: 100;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    `;
    
    // 添加到文档中
    document.body.appendChild(indicator);
    
    // 计算指示器位置
    indicator.style.top = `${position}px`;
    
    // 显示指示器
    setTimeout(() => {
        indicator.style.transform = 'translateX(0)';
        
        // 几秒后隐藏
        setTimeout(() => {
            indicator.style.transform = 'translateX(-100%)';
            
            // 移除元素
            setTimeout(() => {
                indicator.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// 添加页面过渡效果
function addPageTransitions() {
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .page-transition {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(76, 175, 80, 0.2);
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .page-transition.active {
            opacity: 1;
        }
        
        a {
            transition: color 0.2s ease;
        }
        
        .markdown-body a:hover {
            color: #4CAF50;
        }
    `;
    document.head.appendChild(style);
    
    // 创建过渡元素
    const transitionElement = document.createElement('div');
    transitionElement.className = 'page-transition';
    document.body.appendChild(transitionElement);
    
    // 为所有链接添加过渡效果
    document.querySelectorAll('a').forEach(link => {
        // 排除外部链接和特殊链接
        if (link.hostname === window.location.hostname && 
            !link.getAttribute('target') && 
            !link.getAttribute('download')) {
            
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!href || href.startsWith('#')) return;
                
                e.preventDefault();
                
                // 显示过渡效果
                transitionElement.classList.add('active');
                
                // 延迟导航以显示过渡效果
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        }
    });
}

// 增强图片查看
function enhanceImageViewing() {
    const article = document.querySelector('.markdown-body');
    if (!article) return;
    
    // 为所有图片添加点击放大效果
    article.querySelectorAll('img').forEach(img => {
        // 确保图片加载完成
        if (img.complete) {
            makeImageZoomable(img);
        } else {
            img.onload = () => makeImageZoomable(img);
        }
    });
}

// 使图片可缩放
function makeImageZoomable(img) {
    // 添加缩放样式
    img.style.cursor = 'zoom-in';
    img.style.transition = 'transform 0.3s ease';
    
    // 添加点击事件
    img.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 创建遮罩
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: zoom-out;
        `;
        
        // 创建大图
        const largeImg = document.createElement('img');
        largeImg.src = img.src;
        largeImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            border-radius: 4px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        
        // 组合结构
        overlay.appendChild(largeImg);
        document.body.appendChild(overlay);
        
        // 触发重排，然后添加过渡效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            largeImg.style.transform = 'scale(1)';
        }, 10);
        
        // 点击关闭
        overlay.addEventListener('click', function() {
            overlay.style.opacity = '0';
            largeImg.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                overlay.remove();
            }, 300);
        });
    });
}

// 添加分享按钮
function addSharingButtons() {
    const article = document.querySelector('.markdown-body');
    if (!article) return;
    
    // 创建分享容器
    const shareContainer = document.createElement('div');
    shareContainer.className = 'share-container';
    shareContainer.innerHTML = `
        <div class="share-title">分享此文章：</div>
        <div class="share-buttons">
            <button class="share-btn weibo" title="分享到微博">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M10.096 18.857c-3.882.039-7.026-1.834-7.026-4.345 0-2.51 3.144-4.56 7.026-4.599 3.881-.038 7.024 1.708 7.024 4.22 0 2.511-3.143 4.685-7.024 4.724m1.183-7.268c-2.029-.363-3.583.629-3.464 2.222.117 1.594 1.876 2.595 3.906 2.203 2.025-.394 3.585-1.784 3.469-3.379-.114-1.588-1.884-2.633-3.911-1.046"/>
                </button>
            <button class="share-btn wechat" title="分享到微信">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M9.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM16 12c4.708 0 7-2.596 7-5.5S20.708 1 16 1c-4.486 0-6.827 2.474-7 5.203-1.166-.628-2.387-.96-3.5-.96C2.033 5.243 0 7.43 0 10c0 2.759 2.317 5 5.5 5a7.453 7.453 0 0 0 3.5-.87V17c0 2.5 2 4 4 4s4-1.5 4-4v-5h-1z"/>
                </button>
            <button class="share-btn qq" title="分享到QQ">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325 0 1.735.56 3.15.56 3.15 0 .353-.497.87-1.683 1.82-1.42 1.134-.258 1.793-.258 1.793 4.306 1.41 5.67-2.287 5.67-2.287.37.726.874 1.336 1.433 1.773-.707.24-2.336.725-2.336 3.29 0 3.653 3.857 4.893 6.97 3.646 3.656-1.466 5.23-1.736 4.701-3.932-.264-1.097-3.335-1.125-3.335-1.125.26-1.114 3.026-1.484 3.026 1.56 0 .428.002.865-.037 1.233 3.356-.266 4.477-3.944 4.477-3.944.34-4.714-6.13-4.17-6.13-4.17-1.38-2.82.376-6.763.376-6.763C16.413 7.027 12.003 2 12.003 2z"/>
                </button>
            <button class="share-btn twitter" title="分享到Twitter">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </button>
            <button class="share-btn copy" title="复制链接">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </button>
        </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .share-container {
            margin: 40px 0 20px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
        }
        
        .share-title {
            margin-bottom: 15px;
            font-size: 16px;
            color: #555;
        }
        
        .share-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .share-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: #f5f5f5;
            color: #555;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .share-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .share-btn.weibo:hover {
            background: #e6162d;
            color: white;
        }
        
        .share-btn.wechat:hover {
            background: #07C160;
            color: white;
        }
        
        .share-btn.qq:hover {
            background: #12B7F5;
            color: white;
        }
        
        .share-btn.twitter:hover {
            background: #1DA1F2;
            color: white;
        }
        
        .share-btn.copy:hover {
            background: #4CAF50;
            color: white;
        }
        
        /* 分享提示 */
        .share-tooltip {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .share-tooltip.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // 添加到文章底部
    article.appendChild(shareContainer);
    
    // 添加分享事件
    const pageTitle = document.title;
    const pageUrl = window.location.href;
    
    // 微博分享
    shareContainer.querySelector('.share-btn.weibo').addEventListener('click', () => {
        const url = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}`;
        window.open(url, '_blank');
    });
    
    // 微信分享 (显示二维码)
    shareContainer.querySelector('.share-btn.wechat').addEventListener('click', () => {
        showQRCode(pageUrl);
    });
    
    // QQ分享
    shareContainer.querySelector('.share-btn.qq').addEventListener('click', () => {
        const url = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}`;
        window.open(url, '_blank');
    });
    
    // Twitter分享
    shareContainer.querySelector('.share-btn.twitter').addEventListener('click', () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
        window.open(url, '_blank');
    });
    
    // 复制链接
    shareContainer.querySelector('.share-btn.copy').addEventListener('click', () => {
        navigator.clipboard.writeText(pageUrl).then(() => {
            showTooltip('链接已复制到剪贴板');
        }).catch(err => {
            console.error('无法复制链接:', err);
            showTooltip('复制失败，请手动复制链接');
        });
    });
}

// 显示二维码
function showQRCode(url) {
    // 创建QR容器
    const qrContainer = document.createElement('div');
    qrContainer.className = 'qr-container';
    qrContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // 二维码内容
    qrContainer.innerHTML = `
        <div class="qr-content" style="
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            max-width: 80%;
        ">
            <h3 style="margin-top: 0;">微信扫码分享</h3>
            <div class="qr-code" id="qrcode" style="margin: 15px 0;"></div>
            <p style="margin-bottom: 0; color: #666;">打开微信，扫一扫上方二维码</p>
            <button class="close-btn" style="
                margin-top: 15px;
                padding: 8px 16px;
                background: #f5f5f5;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">关闭</button>
        </div>
    `;
    
    document.body.appendChild(qrContainer);
    
    // 显示动画
    setTimeout(() => {
        qrContainer.style.opacity = '1';
    }, 10);
    
    // 生成二维码 (使用外部库)
    // 注意：这需要先加载QRCode.js库
    loadScript('https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js')
        .then(() => {
            if (typeof QRCode !== 'undefined') {
                new QRCode(document.getElementById('qrcode'), {
                    text: url,
                    width: 200,
                    height: 200,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
            } else {
                document.getElementById('qrcode').innerHTML = '无法加载二维码库';
            }
        })
        .catch(() => {
            document.getElementById('qrcode').innerHTML = '无法加载二维码库';
        });
    
    // 关闭按钮
    qrContainer.querySelector('.close-btn').addEventListener('click', () => {
        qrContainer.style.opacity = '0';
        setTimeout(() => {
            qrContainer.remove();
        }, 300);
    });
    
    // 点击背景关闭
    qrContainer.addEventListener('click', function(e) {
        if (e.target === this) {
            qrContainer.style.opacity = '0';
            setTimeout(() => {
                qrContainer.remove();
            }, 300);
        }
    });
}

// 显示提示
function showTooltip(message) {
    // 移除现有提示
    const existingTooltip = document.querySelector('.share-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    // 创建新提示
    const tooltip = document.createElement('div');
    tooltip.className = 'share-tooltip';
    tooltip.textContent = message;
    document.body.appendChild(tooltip);
    
    // 显示动画
    setTimeout(() => {
        tooltip.classList.add('show');
        
        // 几秒后自动隐藏
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        }, 2000);
    }, 10);
}

// 加载脚本
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // 检查脚本是否已加载
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', initReadingProgress); 