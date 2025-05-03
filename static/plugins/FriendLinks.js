/**
 * FriendLinks.js
 * 一个自动添加友链的插件
 * 适用于Gmeek博客系统
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否为友链页面
    if (window.location.pathname.endsWith('link.html')) {
        const postBody = document.getElementById('postBody');
        if (!postBody) {
            console.warn('FriendLinks.js: 未找到 #postBody 元素。');
            return;
        }

        // 友链数据 (建议: 为了方便维护，可以将此数据移到单独的JSON文件或配置中)
        const friendLinks = [
            {
                name: 'Todd',
                avatar: 'https://blog.findtodd.com/images/avatar.png',
                description: '把生命浪费在美好的事物上。',
                url: 'https://blog.findtodd.com/',
                type: 'blog' // type 用于区分链接类型，如 blog, target, bilibili等
            },
            {
                name: 'MazeSec靶场',
                avatar: 'https://maze-sec.com/img/favicon_logo/logo.jpg',
                fallbackIcon: 'https://maze-sec.com/favicon.ico', // 头像加载失败时的备用图标
                description: '群内大佬运维的靶场。专为攻防而生的靶机世界。',
                url: 'https://maze-sec.com/',
                type: 'target'
            },
            {
                name: 'hyh',
                avatar: 'https://www.hyhforever.top/images/avartar.webp',
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
            }
            // 在这里添加更多友链...
        ];

        // --- 辅助函数 ---

        /**
         * 创建单个友链卡片的 DOM 元素
         * @param {object} friend - 友链数据对象
         * @returns {HTMLElement} - 创建好的卡片元素
         */
        function createFriendCard(friend) {
            const card = document.createElement('div');
            card.className = 'friend-card';

            const header = document.createElement('div');
            header.className = 'friend-card-header';

            const avatar = document.createElement('img');
            avatar.className = 'friend-avatar';
            avatar.src = friend.avatar;
            avatar.alt = friend.name;
            avatar.loading = 'lazy'; // 添加图片懒加载属性
            // 设置备用图标逻辑
            if (friend.fallbackIcon) {
                avatar.onerror = function() {
                    console.warn(`FriendLinks.js: 头像加载失败 ${friend.avatar}, 尝试备用图标 ${friend.fallbackIcon}`);
                    this.src = friend.fallbackIcon;
                    this.onerror = null; // 防止备用图标也失败导致无限循环
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
            link.target = '_blank'; // 在新标签页打开链接
            link.rel = 'noopener noreferrer'; // 安全性考虑

            // 根据类型设置链接文本
            switch (friend.type) {
                case 'bilibili':
                    link.textContent = '前往B站 →';
                    break;
                case 'target':
                    link.textContent = '前往靶场 →';
                    break;
                default:
                    link.textContent = '前往博客 →';
            }

            header.appendChild(avatar);
            header.appendChild(name);
            body.appendChild(description);
            body.appendChild(link);
            card.appendChild(header);
            card.appendChild(body);

            return card;
        }

        /**
         * 注入友链卡片的样式到页面头部
         */
        function injectStyles() {
            if (document.getElementById('friend-links-style')) return; // 防止重复注入

            const styleTag = document.createElement('style');
            styleTag.id = 'friend-links-style';
            styleTag.textContent = `
                .friends-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 25px; /* 卡片间距 */
                    margin-top: 30px;
                    justify-content: center; /* 居中对齐卡片 */
                    padding: 10px 0; /* 上下留白 */
                }

                .friend-card {
                    width: calc(33.333% - 25px); /* 响应式宽度，考虑间距 */
                    min-width: 260px; /* 最小宽度 */
                    max-width: 320px; /* 最大宽度 */
                    border: 1px solid var(--color-border-default, #d0d7de);
                    border-radius: 12px;
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
                    background-color: var(--color-canvas-subtle, #f6f8fa);
                    text-align: center;
                    display: flex; /* 使用flex布局 */
                    flex-direction: column; /* 垂直排列 */
                }

                .friend-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
                    border-color: var(--color-accent-muted, #58a6ff);
                }

                .friend-card-header {
                    padding: 25px 18px 15px;
                    border-bottom: 1px solid var(--color-border-muted, #d8dee4);
                    background-color: var(--color-canvas-default, #ffffff);
                }

                .friend-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid var(--color-border-default, #d0d7de);
                    margin: 0 auto 15px auto; /* 水平居中 */
                    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* 添加回弹效果 */
                }

                .friend-card:hover .friend-avatar {
                    transform: rotate(360deg) scale(1.05);
                    border-color: var(--color-accent-fg, #0969da);
                }

                .friend-name {
                    font-weight: bold;
                    font-size: 1.25em; /* 使用em相对单位 */
                    color: var(--color-fg-default, #24292f);
                    margin-bottom: 5px;
                }

                .friend-card-body {
                    padding: 18px;
                    flex-grow: 1; /* 让body部分占据剩余空间 */
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between; /* 内容垂直分布 */
                }

                .friend-description {
                    color: var(--color-fg-muted, #57606a);
                    margin-bottom: 20px;
                    font-size: 0.95em; /* 调整字体大小 */
                    line-height: 1.5;
                    flex-grow: 1; /* 让描述占据更多空间 */
                }

                .friend-link {
                    display: inline-block;
                    text-decoration: none;
                    color: var(--color-accent-fg, #0969da);
                    font-weight: 500;
                    padding: 8px 18px;
                    border: 1px solid var(--color-accent-muted, #9ecbff);
                    border-radius: 20px;
                    transition: all 0.2s ease;
                    margin-top: auto; /* 将按钮推到底部 */
                }

                .friend-link:hover {
                    background-color: var(--color-accent-fg, #0969da);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(9, 105, 218, 0.2);
                }

                /* 响应式设计 */
                @media (max-width: 992px) {
                    .friend-card {
                        width: calc(50% - 20px); /* 中等屏幕显示两列 */
                    }
                }

                @media (max-width: 600px) {
                    .friends-container {
                        gap: 15px; /* 移动端减小间距 */
                    }
                    .friend-card {
                        width: 100%; /* 小屏幕显示一列 */
                        min-width: unset;
                    }
                }
            `;
            document.head.appendChild(styleTag);
        }

        // --- 初始化逻辑 ---

        // 注入样式
        injectStyles();

        // 查找或创建友链容器
        let friendsContainer = postBody.querySelector('.friends-container');
        if (!friendsContainer) {
            // 如果没有现成的容器，清空postBody并创建基本结构
            postBody.innerHTML = `
                <p>欢迎各路大佬前来交换友链！🤝 留下你的足迹，让我们共同成长。</p>
                <!-- 友链将在此处动态加载 -->
                <div class="friends-container"></div>
            `;
            friendsContainer = postBody.querySelector('.friends-container');
            console.log('FriendLinks.js: 创建了新的 .friends-container');
        } else {
            // 如果容器已存在，可能需要清空旧内容或选择追加，这里选择清空以保证一致性
            friendsContainer.innerHTML = '';
            console.log('FriendLinks.js: 清空了已有的 .friends-container');
        }

        // 渲染友链列表
        if (friendLinks.length > 0) {
            friendLinks.forEach(friend => {
                const cardElement = createFriendCard(friend);
                friendsContainer.appendChild(cardElement);
            });
            console.log(`FriendLinks.js: 成功渲染了 ${friendLinks.length} 个友链卡片。`);
        } else {
            friendsContainer.innerHTML = '<p>暂无友链。</p>';
            console.log('FriendLinks.js: 友链列表为空。');
        }
    }
}); 