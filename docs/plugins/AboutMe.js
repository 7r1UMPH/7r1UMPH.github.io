/**
 * AboutMe.js
 * 美化 "关于我" 页面的插件
 * 通过动态生成内容和样式来增强页面表现。
 * 适用于Gmeek博客系统。
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否为关于页面
    if (window.location.pathname.endsWith('about.html')) {
        const postBody = document.getElementById('postBody');
        if (!postBody) {
            console.warn('AboutMe.js: 未找到 #postBody 元素。');
            return;
        }

        // --- 配置数据 ---
        // (建议: 将此数据移到单独的JSON文件或配置中)
        const profileData = {
            avatar: 'https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png',
            name: '7r1UMPH',
            title: 'Cyber Security Enthusiast | Student',
            statusOnline: true, // 是否显示在线状态徽章
            socialLinks: [
                { icon: 'fab fa-github', url: 'https://github.com/7r1UMPH', label: 'GitHub' },
                { icon: 'fa-solid fa-envelope', url: 'mailto:your-email@example.com', label: 'Email' },
                { icon: 'fa-brands fa-discord', url: 'https://discordapp.com/users/your-discord-id', label: 'Discord' },
                // 添加更多社交链接...
            ],
            bio: '一名热爱网络安全的探索者，目前仍在学习的道路上不断前行。坚信技术的力量，并致力于分享知识与经验。',
            skills: [
                { name: 'Web Security', icon: 'fa-solid fa-shield-halved' },
                { name: 'Penetration Testing', icon: 'fa-solid fa-user-secret' },
                { name: 'Python', icon: 'fab fa-python' },
                { name: 'Linux', icon: 'fab fa-linux' },
                { name: 'CTF', icon: 'fa-solid fa-flag' },
                // 添加更多技能...
            ],
            timeline: [
                { date: '2024年至今', title: '学习网络安全', description: '系统学习Web安全、渗透测试等知识，并积极参与CTF竞赛。' },
                { date: '2023年', title: '开启编程之旅', description: '接触Python语言，开始对计算机科学产生浓厚兴趣。' },
                // 添加更多时间线项目...
            ],
            quote: {
                text: 'Stay hungry, stay foolish.',
                author: 'Steve Jobs'
            }
        };

        // --- 辅助函数 ---

        /**
         * 注入 "关于我" 页面的样式
         */
        function injectStyles() {
            if (document.getElementById('about-me-style')) return;

            // 添加 Font Awesome (如果尚未加载)
            if (!document.querySelector('link[href*="font-awesome"]')) {
                const fontAwesome = document.createElement('link');
                fontAwesome.rel = 'stylesheet';
                fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'; // 使用较新版本
                document.head.appendChild(fontAwesome);
            }

            const styleTag = document.createElement('style');
            styleTag.id = 'about-me-style';
            styleTag.textContent = `
                /* --- 关于我页面专属样式 --- */
                .about-container {
                    padding: 20px 0; /* 调整内边距 */
                    max-width: 900px; /* 限制最大宽度 */
                    margin: 0 auto; /* 居中 */
                }

                /* 头部区域 */
                .profile-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 50px; /* 增加间距 */
                    text-align: center;
                    position: relative;
                    padding: 30px 0;
                    background: rgba(255, 255, 255, 0.5); /* 添加淡背景 */
                    border-radius: 16px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                }

                .avatar-container {
                    position: relative;
                    margin-bottom: 20px;
                }

                .avatar {
                    width: 140px; /* 调整大小 */
                    height: 140px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 5px solid var(--color-accent-fg, #0969da); /* 使用主题色 */
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .avatar:hover {
                    transform: scale(1.07);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
                }

                .status-badge {
                    position: absolute;
                    bottom: 8px; /* 调整位置 */
                    right: 8px;
                    width: 28px; /* 调整大小 */
                    height: 28px;
                    border-radius: 50%;
                    background-color: #4CAF50; /* 绿色表示在线 */
                    border: 3px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    animation: pulse 2s infinite; /* 添加脉冲动画 */
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                }


                .name {
                    font-size: 2.2em; /* 调整大小 */
                    font-weight: 700; /* 加粗 */
                    margin-bottom: 8px;
                    color: var(--color-fg-default, #24292f);
                    text-shadow: 0 1px 1px rgba(0,0,0,0.05);
                }

                .title {
                    font-size: 1.15em; /* 调整大小 */
                    color: var(--color-fg-muted, #57606a);
                    margin-bottom: 20px; /* 增加间距 */
                    font-style: italic;
                }

                /* 社交链接 */
                .social-links {
                    display: flex;
                    flex-wrap: wrap; /* 允许换行 */
                    justify-content: center; /* 居中 */
                    gap: 12px; /* 调整间距 */
                    margin-bottom: 25px;
                }

                .social-link {
                    width: 38px; /* 调整大小 */
                    height: 38px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--color-canvas-subtle, #f6f8fa);
                    color: var(--color-fg-muted, #57606a); /* 默认颜色调暗 */
                    font-size: 1.1em; /* 图标大小 */
                    transition: all 0.25s ease-out;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
                    text-decoration: none;
                }

                .social-link:hover {
                    transform: translateY(-4px) scale(1.1);
                    background-color: var(--color-accent-emphasis, #0366d6); /* 使用主题强调色 */
                    color: white;
                    box-shadow: 0 5px 10px rgba(0,0,0,0.15);
                }

                /* 个人简介 */
                .bio {
                    font-size: 1.05em;
                    line-height: 1.7;
                    margin-bottom: 40px;
                    color: var(--color-fg-default, #24292f); /* 默认字体颜色 */
                    text-align: center;
                    max-width: 650px; /* 限制宽度 */
                    margin-left: auto;
                    margin-right: auto;
                    padding: 0 15px; /* 左右留白 */
                }

                /* 内容区块 */
                .section {
                    margin-bottom: 40px;
                    padding: 25px; /* 调整内边距 */
                    border-radius: 12px;
                    background-color: var(--color-canvas-subtle, #f6f8fa);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: 1px solid var(--color-border-default, #d0d7de);
                }

                .section:hover {
                    /* transform: translateY(-4px); */ /* 悬停效果可选 */
                    box-shadow: 0 7px 20px rgba(0,0,0,0.09);
                }

                .section-title {
                    font-size: 1.6em; /* 调整大小 */
                    font-weight: 600; /* 加粗 */
                    margin-bottom: 25px; /* 增加间距 */
                    color: var(--color-accent-fg, #0969da);
                    border-bottom: 2px solid var(--color-accent-subtle, #cfe2ff); /* 底部边框 */
                    padding-bottom: 10px; /* 标题和边框间距 */
                    display: flex; /* 使用flex对齐图标 */
                    align-items: center;
                    gap: 10px; /* 图标和文字间距 */
                }
                 .section-title i { /* 标题图标样式 */
                     font-size: 0.9em;
                     opacity: 0.8;
                 }

                /* 技能列表 */
                .skills-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px; /* 调整间距 */
                    margin-top: 15px;
                }

                .skill {
                    background-color: var(--color-canvas-default, #ffffff);
                    padding: 8px 15px; /* 调整内边距 */
                    border-radius: 20px;
                    font-weight: 500;
                    font-size: 0.9em; /* 调整字体 */
                    box-shadow: 0 2px 5px rgba(0,0,0,0.07);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.25s ease-out;
                    border: 1px solid var(--color-border-muted, #d8dee4);
                    color: var(--color-fg-default);
                }

                .skill:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                    background-color: var(--color-accent-subtle, #ddf4ff); /* 悬停背景色 */
                    border-color: var(--color-accent-muted, #58a6ff);
                    color: var(--color-accent-fg, #0969da);
                }

                .skill-icon {
                    font-size: 1.1em;
                    width: 16px; /* 固定图标宽度 */
                    text-align: center;
                    opacity: 0.9;
                }

                /* 时间线 */
                .timeline {
                    position: relative;
                    margin-top: 20px; /* 减小上边距 */
                    padding-left: 10px; /* 左侧留白给线条 */
                }

                .timeline::before {
                    content: '';
                    position: absolute;
                    top: 5px; /* 起始位置 */
                    left: 10px; /* 与 .timeline-dot 对齐 */
                    bottom: 5px; /* 结束位置 */
                    width: 3px; /* 线条粗细 */
                    background-color: var(--color-border-default, #d0d7de);
                    border-radius: 2px;
                }

                .timeline-item {
                    position: relative;
                    padding-left: 40px; /* 内容距左侧距离 */
                    margin-bottom: 25px; /* 项目间距 */
                }

                .timeline-item:last-child {
                    margin-bottom: 0;
                }

                .timeline-dot {
                    position: absolute;
                    left: 4px; /* 调整位置，使其在线条上 */
                    top: 5px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: var(--color-accent-fg, #0969da);
                    border: 2px solid var(--color-canvas-subtle, #f6f8fa);
                    z-index: 1; /* 确保在::before之上 */
                }

                .timeline-date {
                    font-weight: 600; /* 加粗 */
                    color: var(--color-accent-fg, #0969da);
                    margin-bottom: 6px; /* 调整间距 */
                    font-size: 0.9em; /* 调整字体 */
                }

                .timeline-title {
                    font-weight: 600;
                    margin-bottom: 6px;
                    color: var(--color-fg-default);
                    font-size: 1.05em;
                }

                .timeline-description {
                    color: var(--color-fg-muted, #57606a);
                    line-height: 1.6;
                    font-size: 0.95em;
                }

                /* 引用区块 */
                .quote-section { /* 重命名以避免冲突 */
                    padding: 30px;
                    border-radius: 12px;
                    background-color: var(--color-accent-subtle, #ddf4ff);
                    margin: 40px 0;
                    position: relative;
                    text-align: center;
                    border: 1px solid var(--color-accent-muted, #58a6ff);
                    overflow: hidden; /* 隐藏溢出的伪元素 */
                }

                .quote-section::before {
                    content: '\f10d'; /* Font Awesome 左引号 */
                    font-family: 'Font Awesome 6 Free';
                    font-weight: 900;
                    font-size: 4em; /* 调整大小 */
                    position: absolute;
                    top: 10px;
                    left: 15px;
                    color: var(--color-accent-muted, #58a6ff);
                    opacity: 0.3;
                    z-index: 0;
                }
                 .quote-section::after { /* 添加右引号 */
                    content: '\f10e'; /* Font Awesome 右引号 */
                    font-family: 'Font Awesome 6 Free';
                    font-weight: 900;
                    font-size: 4em;
                    position: absolute;
                    bottom: -10px; /* 调整位置 */
                    right: 15px;
                    color: var(--color-accent-muted, #58a6ff);
                    opacity: 0.3;
                    z-index: 0;
                }

                .quote-text {
                    font-size: 1.2em; /* 调整大小 */
                    line-height: 1.7; /* 调整行高 */
                    font-style: italic;
                    position: relative;
                    z-index: 1;
                    color: var(--color-fg-default);
                    margin-bottom: 10px; /* 与作者间距 */
                }

                .quote-author {
                    margin-top: 15px;
                    font-weight: 600;
                    color: var(--color-fg-muted);
                    position: relative;
                    z-index: 1;
                }
                .quote-author::before {
                    content: '— ';
                }

                /* 响应式调整 */
                @media (max-width: 768px) {
                    .name { font-size: 2em; }
                    .title { font-size: 1.1em; }
                    .avatar { width: 120px; height: 120px; }
                    .section-title { font-size: 1.5em; }
                    .quote-text { font-size: 1.1em; }
                    .timeline::before { left: 8px; } /* 微调时间线 */
                    .timeline-item { padding-left: 35px; }
                    .timeline-dot { left: 2px; }
                }
                 @media (max-width: 480px) {
                    .about-container { padding: 10px 0; }
                    .profile-header { margin-bottom: 30px; padding: 20px 0; }
                    .avatar { width: 100px; height: 100px; }
                    .name { font-size: 1.8em; }
                    .title { font-size: 1em; }
                    .section { padding: 20px; }
                    .section-title { font-size: 1.4em; margin-bottom: 20px;}
                    .skill { font-size: 0.85em; padding: 6px 12px; }
                    .quote-section { padding: 20px; }
                    .quote-text { font-size: 1em; }
                 }
            `;
            document.head.appendChild(styleTag);
        }

        /**
         * 创建个人信息头部
         * @param {object} data - 包含 avatar, name, title, statusOnline 的对象
         * @returns {string} - HTML 字符串
         */
        function createProfileHeader(data) {
            return `
                <div class="profile-header">
                    <div class="avatar-container">
                        <img src="${data.avatar}" alt="${data.name} Avatar" class="avatar" loading="lazy">
                        ${data.statusOnline ? '<div class="status-badge" title="Online"></div>' : ''}
                    </div>
                    <h1 class="name">${data.name}</h1>
                    <p class="title">${data.title}</p>
                    ${createSocialLinks(data.socialLinks)}
                </div>
            `;
        }

        /**
         * 创建社交链接列表
         * @param {Array} links - 社交链接对象数组
         * @returns {string} - HTML 字符串
         */
        function createSocialLinks(links = []) {
            if (!links || links.length === 0) return '';
            const linksHtml = links.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link" title="${link.label || ''}">
                    <i class="${link.icon}"></i>
                </a>
            `).join('');
            return `<div class="social-links">${linksHtml}</div>`;
        }

        /**
         * 创建内容区块
         * @param {string} title - 区块标题
         * @param {string} contentHtml - 区块内容的HTML字符串
         * @param {string} iconClass - Font Awesome 图标类 (可选)
         * @returns {string} - HTML 字符串
         */
        function createSection(title, contentHtml, iconClass = '') {
            const iconHtml = iconClass ? `<i class="${iconClass}"></i>` : '';
            return `
                <div class="section">
                    <h2 class="section-title">${iconHtml}${title}</h2>
                    ${contentHtml}
                </div>
            `;
        }

        /**
         * 创建技能列表
         * @param {Array} skills - 技能对象数组
         * @returns {string} - HTML 字符串
         */
        function createSkillsList(skills = []) {
            if (!skills || skills.length === 0) return '<p>暂无技能信息。</p>';
            const skillsHtml = skills.map(skill => `
                <span class="skill">
                    ${skill.icon ? `<i class="skill-icon ${skill.icon}"></i>` : ''}
                    ${skill.name}
                </span>
            `).join('');
            return `<div class="skills-container">${skillsHtml}</div>`;
        }

        /**
         * 创建时间线
         * @param {Array} timelineItems - 时间线项目对象数组
         * @returns {string} - HTML 字符串
         */
        function createTimeline(timelineItems = []) {
            if (!timelineItems || timelineItems.length === 0) return '<p>暂无时间线信息。</p>';
            const itemsHtml = timelineItems.map(item => `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">${item.date}</div>
                    <div class="timeline-title">${item.title}</div>
                    <p class="timeline-description">${item.description}</p>
                </div>
            `).join('');
            return `<div class="timeline">${itemsHtml}</div>`;
        }

         /**
         * 创建引用区块
         * @param {object} quote - 包含 text 和 author 的对象
         * @returns {string} - HTML 字符串
         */
        function createQuoteSection(quote) {
            if (!quote || !quote.text) return '';
            return `
                <div class="quote-section">
                    <p class="quote-text">${quote.text}</p>
                    ${quote.author ? `<p class="quote-author">${quote.author}</p>` : ''}
                </div>
            `;
        }


        /**
         * 渲染整个关于页面
         */
        function renderAboutPage() {
            // 注入样式
            injectStyles();

            // 构建页面内容
            let pageHtml = '<div class="about-container">';

            // 1. 头部信息
            pageHtml += createProfileHeader({
                avatar: profileData.avatar,
                name: profileData.name,
                title: profileData.title,
                statusOnline: profileData.statusOnline,
                socialLinks: profileData.socialLinks
            });

            // 2. 个人简介
            if (profileData.bio) {
                pageHtml += `<div class="bio">${profileData.bio}</div>`;
            }

            // 3. 技能区块
            pageHtml += createSection('技能栈', createSkillsList(profileData.skills), 'fa-solid fa-laptop-code');

            // 4. 成长历程 (时间线)
            pageHtml += createSection('成长历程', createTimeline(profileData.timeline), 'fa-solid fa-timeline');

            // 5. 引用区块
            pageHtml += createQuoteSection(profileData.quote);

            pageHtml += '</div>'; // end .about-container

            // 清空并填充 postBody
            postBody.innerHTML = pageHtml;
            console.log('AboutMe.js: 页面已使用动态内容渲染。');
        }

        // --- 执行初始化 ---
        renderAboutPage();
    }
}); 