/**
 * FriendLinks.js
 * 一个自动添加友链的插件
 * 适用于Gmeek博客系统
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否为友链页面
    if (window.location.pathname.endsWith('link.html')) {
        // 获取友链容器
        const postBody = document.getElementById('postBody');
        if (!postBody) return;
        
        // 检查是否已有友链容器，如果没有则创建
        let friendsContainer = postBody.querySelector('.friends-container');
        if (!friendsContainer) {
            // 添加标题和说明
            postBody.innerHTML = `
                <p>欢迎各路大佬前来交换友链！留下你的足迹，让我们共同成长。</p>
                <div class="friends-container"></div>
            `;
            friendsContainer = postBody.querySelector('.friends-container');
            
            // 添加友链样式
            const styleTag = document.createElement('style');
            styleTag.textContent = `
                .friends-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 25px;
                    margin-top: 30px;
                    justify-content: center;
                }
                
                .friend-card {
                    width: calc(33% - 20px);
                    min-width: 250px;
                    max-width: 320px;
                    border: 1px solid var(--color-border-default);
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                    background-color: var(--color-canvas-subtle, #f6f8fa);
                    margin-bottom: 5px;
                    text-align: center;
                }
                
                .friend-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
                    border-color: var(--color-accent-muted, #58a6ff);
                }
                
                .friend-card-header {
                    padding: 25px 18px 15px;
                    border-bottom: 1px solid var(--color-border-muted);
                    background-color: var(--color-canvas-default, #ffffff);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .friend-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid var(--color-border-default);
                    margin-bottom: 15px;
                    transition: transform 0.3s ease;
                }
                
                .friend-card:hover .friend-avatar {
                    transform: rotate(360deg);
                    border-color: var(--color-accent-fg);
                }
                
                .friend-name {
                    font-weight: bold;
                    font-size: 20px;
                    color: var(--color-fg-default);
                }
                
                .friend-card-body {
                    padding: 18px;
                }
                
                .friend-description {
                    color: var(--color-fg-muted);
                    margin-bottom: 20px;
                    font-size: 15px;
                    line-height: 1.5;
                }
                
                .friend-link {
                    display: inline-block;
                    text-decoration: none;
                    color: var(--color-accent-fg);
                    font-weight: 500;
                    padding: 8px 15px;
                    border: 1px solid var(--color-accent-muted);
                    border-radius: 20px;
                    transition: all 0.2s ease;
                }

                .friend-link:hover {
                    background-color: var(--color-accent-fg);
                    color: white;
                    transform: translateY(-2px);
                }
                
                @media (max-width: 768px) {
                    .friends-container {
                        justify-content: center;
                    }
                    .friend-card {
                        width: calc(50% - 20px);
                    }
                }
                
                @media (max-width: 576px) {
                    .friend-card {
                        width: 100%;
                    }
                }
            `;
            document.head.appendChild(styleTag);
        }
        
        // 友链列表
        const friendLinks = [
            {
                name: 'Todd',
                avatar: 'https://blog.findtodd.com/images/avatar.png',
                description: '把生命浪费在美好的事物上。',
                url: 'https://blog.findtodd.com/',
                type: 'blog'
            },
            {
                name: 'MazeSec靶场',
                avatar: 'https://maze-sec.com/img/favicon_logo/logo.jpg',
                fallbackIcon: 'https://maze-sec.com/favicon.ico',
                description: '群内大佬运维的靶场。专为攻防而生的靶机世界。',
                url: 'https://maze-sec.com/',
                type: 'target'
            },
            {
                name: 'hyh',
                avatar: 'https://www.hyhforever.top/img/avartar_hu10624327954905931295.webp',
                fallbackIcon: 'https://www.hyhforever.top/favicon.ico',
                description: '想念的终究会相遇吧',
                url: 'https://www.hyhforever.top/',
                type: 'blog'
            },
            {
                name: 'll104567',
                avatar: 'https://avatars.githubusercontent.com/u/12579219?v=4',
                description: '认识的人越多，我就越喜欢狗。',
                url: 'https://space.bilibili.com/20805349',
                type: 'bilibili'
            },
            {
                name: 'ta0',
                avatar: 'https://tao0845.github.io/123.jpg',
                description: '真正的大师永远都怀一颗学徒的心',
                url: 'https://tao0845.github.io/',
                type: 'blog'
            },
            {
                name: '小白',
                avatar: 'https://hgbe02.github.io/assets/img/hgbe02.jpg',
                description: "hgbe02's blog",
                url: 'https://hgbe02.github.io/',
                type: 'blog'
            }
        ];
        
        // 添加友链卡片
        friendLinks.forEach(friend => {
            const card = document.createElement('div');
            card.className = 'friend-card';
            
            const header = document.createElement('div');
            header.className = 'friend-card-header';
            
            const avatar = document.createElement('img');
            avatar.className = 'friend-avatar';
            avatar.src = friend.avatar;
            avatar.alt = friend.name;
            if (friend.fallbackIcon) {
                avatar.onerror = function() {
                    this.src = friend.fallbackIcon;
                    this.onerror = null;
                };
            }
            
            const name = document.createElement('div');
            name.className = 'friend-name';
            name.textContent = friend.name;
            
            const body = document.createElement('div');
            body.className = 'friend-card-body';
            
            const description = document.createElement('p');
            description.className = 'friend-description';
            description.textContent = friend.description;
            
            const link = document.createElement('a');
            link.className = 'friend-link';
            link.href = friend.url;
            link.target = '_blank';
            
            // 根据类型显示不同的链接文本
            if (friend.type === 'bilibili') {
                link.textContent = '前往B站 →';
            } else if (friend.type === 'target') {
                link.textContent = '前往靶场 →';
            } else {
                link.textContent = '前往博客 →';
            }
            
            header.appendChild(avatar);
            header.appendChild(name);
            body.appendChild(description);
            body.appendChild(link);
            card.appendChild(header);
            card.appendChild(body);
            friendsContainer.appendChild(card);
        });
    }
}); 