/**
 * 本地缓存策略 - 为Triumph Blog定制
 * 用于减少对CDN的依赖，提高加载速度
 */

// 定义缓存前缀和有效期（默认为7天）
const CACHE_PREFIX = 'triumph_blog_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7天，单位毫秒

/**
 * 初始化本地缓存系统
 */
document.addEventListener('DOMContentLoaded', function() {
    // 清理过期缓存
    cleanExpiredCache();
    
    // 缓存常用资源
    cacheCommonResources();
    
    // 开始资源预加载
    prefetchResources();
});

/**
 * 清理过期缓存
 */
function cleanExpiredCache() {
    const now = Date.now();
    
    // 遍历localStorage查找过期缓存
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // 只处理我们的缓存项
        if (key && key.startsWith(CACHE_PREFIX)) {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (item && item.expiry && item.expiry < now) {
                    // 缓存已过期，删除它
                    localStorage.removeItem(key);
                    console.log('已清理过期缓存: ', key);
                }
            } catch (e) {
                // 解析错误，删除可能损坏的缓存项
                localStorage.removeItem(key);
            }
        }
    }
}

/**
 * 获取缓存的资源
 * @param {string} key - 缓存键名
 * @returns {any|null} - 返回缓存内容或null（如果不存在或已过期）
 */
function getCachedResource(key) {
    const fullKey = CACHE_PREFIX + key;
    const cached = localStorage.getItem(fullKey);
    
    if (!cached) return null;
    
    try {
        const item = JSON.parse(cached);
        const now = Date.now();
        
        // 检查是否过期
        if (item.expiry && item.expiry < now) {
            // 已过期，删除并返回null
            localStorage.removeItem(fullKey);
            return null;
        }
        
        // 返回缓存内容
        return item.data;
    } catch (e) {
        // 解析错误，删除可能损坏的缓存
        localStorage.removeItem(fullKey);
        return null;
    }
}

/**
 * 设置缓存
 * @param {string} key - 缓存键名
 * @param {any} data - 要缓存的数据
 * @param {number} [ttl] - 缓存有效期（毫秒），默认为CACHE_EXPIRY
 */
function setCachedResource(key, data, ttl) {
    const expiry = Date.now() + (ttl || CACHE_EXPIRY);
    const fullKey = CACHE_PREFIX + key;
    
    try {
        // 存储带有过期时间的数据
        const item = {
            data: data,
            expiry: expiry
        };
        
        localStorage.setItem(fullKey, JSON.stringify(item));
    } catch (e) {
        // 存储失败（可能是localStorage已满）
        // 清理一些旧缓存后重试
        clearOldestCache();
        try {
            const item = {
                data: data,
                expiry: expiry
            };
            localStorage.setItem(fullKey, JSON.stringify(item));
        } catch (e2) {
            console.error('缓存失败:', e2);
        }
    }
}

/**
 * 清理最旧的缓存项
 */
function clearOldestCache() {
    let oldest = null;
    let oldestKey = null;
    
    // 查找最旧的缓存项
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (item && item.expiry && (!oldest || item.expiry < oldest)) {
                    oldest = item.expiry;
                    oldestKey = key;
                }
            } catch (e) {
                // 忽略解析错误
            }
        }
    }
    
    // 删除最旧的缓存项
    if (oldestKey) {
        localStorage.removeItem(oldestKey);
        console.log('已清理最旧缓存: ', oldestKey);
    }
}

/**
 * 缓存常用资源
 */
function cacheCommonResources() {
    // 缓存头像和图标
    cacheImage('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png', 'avatar');
    cacheImage('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200557660.ico', 'favicon');
    
    // 缓存CSS资源
    // 注意：这里只缓存图片等资源，不缓存脚本和样式表
    // 因为这些会自动由浏览器缓存，并且直接替换可能导致问题
}

/**
 * 缓存图片资源
 * @param {string} url - 图片URL
 * @param {string} key - 缓存键名
 */
function cacheImage(url, key) {
    // 检查是否已经有缓存
    const cachedImage = getCachedResource('img_' + key);
    if (cachedImage) {
        // 已有缓存，无需重新获取
        return;
    }
    
    // 使用fetch API获取图片并转为Base64
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        })
        .then(base64data => {
            // 缓存Base64格式的图片数据
            setCachedResource('img_' + key, base64data);
        })
        .catch(error => {
            console.error('缓存图片失败:', url, error);
        });
}

/**
 * 资源预加载
 */
function prefetchResources() {
    // 创建一个空闲回调，在浏览器空闲时预加载资源
    if ('requestIdleCallback' in window) {
        requestIdleCallback(function() {
            // 预加载首页可能需要的图片
            document.querySelectorAll('.SideNav-item img').forEach(function(img) {
                if (img.src) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = img.src;
                    document.head.appendChild(link);
                }
            });
        });
    }
}

/**
 * 替换页面上的资源链接为缓存版本
 */
window.addEventListener('load', function() {
    // 替换头像
    const avatarCache = getCachedResource('img_avatar');
    if (avatarCache) {
        const avatarImg = document.getElementById('avatarImg');
        if (avatarImg) {
            avatarImg.src = avatarCache;
        }
    }
    
    // 注意：这里我们不替换脚本和CSS文件，因为那可能导致功能问题
}); 