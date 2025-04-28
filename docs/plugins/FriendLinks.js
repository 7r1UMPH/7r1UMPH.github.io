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
                <h2>我的小伙伴们</h2>
                <p>欢迎交换友链！请通过评论或提交issue告诉我你的信息。</p>
                <div class="friends-container"></div>
            `;
            friendsContainer = postBody.querySelector('.friends-container');
            
            // 添加友链样式
            const styleTag = document.createElement('style');
            styleTag.textContent = `
                .friends-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-top: 20px;
                }
                
                .friend-card {
                    width: 280px;
                    border: 1px solid var(--color-border-default);
                    border-radius: 8px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .friend-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                .friend-card-header {
                    padding: 15px;
                    border-bottom: 1px solid var(--color-border-muted);
                    display: flex;
                    align-items: center;
                }
                
                .friend-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 15px;
                    object-fit: cover;
                }
                
                .friend-name {
                    font-weight: bold;
                    font-size: 18px;
                }
                
                .friend-card-body {
                    padding: 15px;
                }
                
                .friend-description {
                    color: var(--color-fg-muted);
                    margin-bottom: 15px;
                    font-size: 14px;
                }
                
                .friend-link {
                    display: inline-block;
                    text-decoration: none;
                    color: var(--color-accent-fg);
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
                url: 'https://blog.findtodd.com/'
            },
            {
                name: 'MazeSec靶场',
                avatar: 'https://maze-sec.com/static/image/logo.png',
                fallbackIcon: 'https://maze-sec.com/favicon.ico',
                description: '群内大佬运维的靶场。专为攻防而生的靶机世界。',
                url: 'https://maze-sec.com/'
            },
            {
                name: 'hyh',
                avatar: 'https://www.hyhforever.top/wp-content/uploads/2023/08/cropped-cropped-头像-150x150.jpg',
                fallbackIcon: 'https://www.hyhforever.top/favicon.ico',
                description: '想念的终究会相遇吧',
                url: 'https://www.hyhforever.top/'
            },
            {
                name: 'll104567',
                avatar: 'https://i1.hdslb.com/bfs/face/d42b53e8bd6c92295bdc3cb8ebacda77513a0f9a.jpg',
                description: '认识的人越多，我就越喜欢狗。',
                url: 'https://space.bilibili.com/20805349'
            },
            {
                name: 'ta0',
                avatar: 'https://tao0845.github.io/123.jpg',
                description: '真正的大师永远都怀一颗学徒的心',
                url: 'https://tao0845.github.io/'
            }
        ];
        
        // 清空现有友链
        friendsContainer.innerHTML = '';
        
        // 添加友链
        friendLinks.forEach(friend => {
            const card = document.createElement('div');
            card.className = 'friend-card';
            
            const cardHeader = document.createElement('div');
            cardHeader.className = 'friend-card-header';
            
            const avatar = document.createElement('img');
            avatar.className = 'friend-avatar';
            avatar.src = friend.avatar;
            avatar.alt = friend.name;
            if (friend.fallbackIcon) {
                avatar.onerror = `this.src='${friend.fallbackIcon}';this.onerror=null;`;
            } else {
                avatar.onerror = "this.style.display='none';";
            }
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'friend-name';
            nameDiv.textContent = friend.name;
            
            cardHeader.appendChild(avatar);
            cardHeader.appendChild(nameDiv);
            
            const cardBody = document.createElement('div');
            cardBody.className = 'friend-card-body';
            
            const description = document.createElement('p');
            description.className = 'friend-description';
            description.textContent = friend.description;
            
            const link = document.createElement('a');
            link.className = 'friend-link';
            link.href = friend.url;
            link.target = '_blank';
            link.textContent = friend.url.includes('bilibili') ? '前往B站 →' : '前往博客 →';
            
            cardBody.appendChild(description);
            cardBody.appendChild(link);
            
            card.appendChild(cardHeader);
            card.appendChild(cardBody);
            
            friendsContainer.appendChild(card);
        });
    }
}); 