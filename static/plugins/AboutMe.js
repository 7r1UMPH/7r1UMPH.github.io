/**
 * AboutMe.js
 * 一个美化关于页面的插件
 * 适用于Gmeek博客系统
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否为关于页面
    if (window.location.pathname.endsWith('about.html')) {
        // 获取内容容器
        const postBody = document.getElementById('postBody');
        if (!postBody) return;
        
        // 添加样式
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            .about-container {
                position: relative;
                padding: 20px;
            }
            
            .profile-header {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 40px;
                text-align: center;
                position: relative;
            }
            
            .avatar-container {
                position: relative;
                margin-bottom: 25px;
            }
            
            .avatar {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                object-fit: cover;
                border: 4px solid var(--color-accent-fg);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }
            
            .avatar:hover {
                transform: scale(1.05);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
            }
            
            .status-badge {
                position: absolute;
                bottom: 5px;
                right: 5px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #4CAF50;
                border: 3px solid white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .name {
                font-size: 2.5em;
                font-weight: bold;
                margin-bottom: 5px;
                color: var(--color-fg-default);
                text-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            
            .title {
                font-size: 1.3em;
                color: var(--color-fg-muted);
                margin-bottom: 15px;
            }
            
            .social-links {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .social-link {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--color-canvas-subtle);
                color: var(--color-fg-default);
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            .social-link:hover {
                transform: translateY(-3px);
                background-color: var(--color-accent-fg);
                color: white;
            }
            
            .bio {
                font-size: 1.1em;
                line-height: 1.6;
                margin-bottom: 30px;
                color: var(--color-fg-muted);
                text-align: center;
                max-width: 700px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .section {
                margin-bottom: 40px;
                padding: 30px;
                border-radius: 12px;
                background-color: var(--color-canvas-subtle);
                box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                transition: all 0.3s ease;
            }
            
            .section:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            }
            
            .section-title {
                font-size: 1.8em;
                margin-bottom: 20px;
                color: var(--color-accent-fg);
                border-left: 4px solid var(--color-accent-fg);
                padding-left: 15px;
            }
            
            .skills-container {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-top: 20px;
            }
            
            .skill {
                background-color: var(--color-canvas-default);
                padding: 10px 18px;
                border-radius: 20px;
                font-weight: 500;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }
            
            .skill:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                background-color: var(--color-accent-subtle);
            }
            
            .skill-icon {
                font-size: 1.2em;
            }
            
            .timeline {
                position: relative;
                margin-top: 30px;
            }
            
            .timeline::before {
                content: '';
                position: absolute;
                top: 0;
                left: 20px;
                height: 100%;
                width: 2px;
                background-color: var(--color-border-default);
            }
            
            .timeline-item {
                position: relative;
                padding-left: 50px;
                margin-bottom: 30px;
            }
            
            .timeline-item:last-child {
                margin-bottom: 0;
            }
            
            .timeline-dot {
                position: absolute;
                left: 15px;
                top: 5px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: var(--color-accent-fg);
                border: 2px solid var(--color-canvas-subtle);
            }
            
            .timeline-date {
                font-weight: bold;
                color: var(--color-accent-fg);
                margin-bottom: 5px;
            }
            
            .timeline-title {
                font-weight: 600;
                margin-bottom: 5px;
            }
            
            .timeline-description {
                color: var(--color-fg-muted);
                line-height: 1.5;
            }
            
            .quote {
                padding: 30px;
                border-radius: 12px;
                background-color: var(--color-accent-subtle);
                margin: 40px 0;
                position: relative;
                text-align: center;
            }
            
            .quote::before {
                content: '"';
                font-size: 5em;
                position: absolute;
                top: -20px;
                left: 20px;
                color: rgba(0,0,0,0.1);
                font-family: serif;
            }
            
            .quote-text {
                font-size: 1.3em;
                line-height: 1.6;
                font-style: italic;
                position: relative;
                z-index: 1;
            }
            
            .quote-author {
                margin-top: 15px;
                font-weight: 600;
                color: var(--color-accent-fg);
            }
            
            .contact-button {
                display: inline-block;
                padding: 12px 30px;
                background-color: var(--color-accent-fg);
                color: white;
                border-radius: 30px;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s ease;
                margin-top: 20px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .contact-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                background-color: var(--color-accent-emphasis);
            }
            
            @media (max-width: 768px) {
                .section {
                    padding: 20px;
                }
                
                .name {
                    font-size: 2em;
                }
                
                .avatar {
                    width: 120px;
                    height: 120px;
                }
            }
        `;
        document.head.appendChild(styleTag);
        
        // 替换原始内容
        postBody.innerHTML = `
            <div class="about-container">
                <div class="profile-header">
                    <div class="avatar-container">
                        <img src="https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320200605137.png" alt="个人头像" class="avatar">
                        <div class="status-badge"></div>
                    </div>
                    <h1 class="name">Triumph</h1>
                    <p class="title">📡 通信工程师 × 网络安全探索者</p>
                    <div class="social-links">
                        <a href="https://github.com/7r1UMPH" target="_blank" class="social-link" title="GitHub">
                            <i class="fa-brands fa-github"></i>
                        </a>
                        <a href="mailto:contact@example.com" class="social-link" title="Email">
                            <i class="fa-solid fa-envelope"></i>
                        </a>
                    </div>
                    <p class="bio">
                        一名在通信领域摸爬滚打了五年的工程师，也是个在网络安全的浩瀚世界里持续探索的学习者
                        （尤其在夜深人静时，偶尔会"小试牛刀"）。
                    </p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">关于我</h2>
                    <p>故事始于2024年的某个深夜，当我在技术群里畅聊（或者说，吹水）时，灵光一闪：是时候为这些想法和实践找一个更正式（也更方便日后回顾）的"舞台"了。于是，这个博客诞生了。</p>
                    <div class="skills-container">
                        <div class="skill">
                            <span class="skill-icon">🔐</span>
                            <span>网络安全</span>
                        </div>
                        <div class="skill">
                            <span class="skill-icon">🌐</span>
                            <span>数通工程</span>
                        </div>
                        <div class="skill">
                            <span class="skill-icon">🚩</span>
                            <span>CTF爱好者</span>
                        </div>
                        <div class="skill">
                            <span class="skill-icon">🐧</span>
                            <span>Linux</span>
                        </div>
                        <div class="skill">
                            <span class="skill-icon">🔍</span>
                            <span>漏洞挖掘</span>
                        </div>
                        <div class="skill">
                            <span class="skill-icon">🔄</span>
                            <span>渗透测试</span>
                        </div>
                    </div>
                </div>
                
                <div class="quote">
                    <p class="quote-text">日常 BGM：清脆的键盘敲击声与交换机风扇的稳定嗡鸣</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">我的足迹</h2>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">2024年至今</div>
                            <div class="timeline-title">开始记录学习笔记</div>
                            <div class="timeline-description">开始将平时的安全学习心得和经验分享到博客，记录成长之路。</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">过去五年</div>
                            <div class="timeline-title">通信工程师</div>
                            <div class="timeline-description">在通信领域摸爬滚打，积累了丰富的通信与网络工程经验。</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">业余时间</div>
                            <div class="timeline-title">网络安全探索</div>
                            <div class="timeline-description">利用业余时间钻研网络安全，参与CTF比赛，研究漏洞挖掘和渗透测试。</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">关于本站</h2>
                    <p><strong>你会在这里看到：</strong></p>
                    <p>🔹 <strong>安全"踩坑"实录：</strong> 那些我用 Kali Linux 进行的（有时成功，有时"翻车"的）安全实验与思考。</p>
                    <p><strong>重要提醒（免责声明）：</strong></p>
                    <p>本博客分享的实验代码可能暗藏 BUG，强烈建议在虚拟机或隔离环境中"把玩"。若因模仿文中操作，不幸在真实环境中触发了"生产事故"——那么，恭喜你，提前解锁了宝贵的"真实职场 Debug 经验包"！</p>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <a href="https://github.com/7r1UMPH/7r1UMPH.github.io/issues" target="_blank" class="contact-button">
                        <i class="fa-solid fa-comment-dots"></i> 联系我
                    </a>
                </div>
            </div>
        `;
    }
}); 