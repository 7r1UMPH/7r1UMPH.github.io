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
        
        // 添加 Font Awesome
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
        
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
                        <img src="https://7r1UMPH.github.io/image/20250320200605137.png" alt="个人头像" class="avatar">
                        <div class="status-badge"></div>
                    </div>
                    <h1 class="name">Triumph</h1>
                    <p class="title">通信 / 网络安全爱好者</p>
                    <div class="social-links">
                        <a href="https://github.com/7r1UMPH" target="_blank" class="social-link" title="GitHub">
                            <i class="fa-brands fa-github"></i>
                        </a>
                        <a href="mailto:triumph202402@gmail.com" class="social-link" title="Email">
                            <i class="fa-solid fa-envelope"></i>
                        </a>
                    </div>
                    <p class="bio">
                        在通信和网络安全领域学习和探索，记录成长与发现的点滴
                    </p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">关于我</h2>
                    <p>2024年开始记录学习笔记和技术思考，希望能通过这个博客分享所学，也方便自己日后回顾。</p>
                    <div class="skills-container">
                        <div class="skill">
                            <span class="skill-icon">🔐</span>
                            <span>网络安全</span>
                        </div>
                        <div class="skill">
                            <span class="skill-icon">🌐</span>
                            <span>数通</span>
                        </div>
                        <div class="skill">
                            <span class="skill-icon">🚩</span>
                            <span>CTF</span>
                        </div>
                        <div class="skill">
                            <span class="skill-icon">🐧</span>
                            <span>Linux</span>
                        </div>
                        <div class="skill">
                            <span class="skill-icon">🔍</span>
                            <span>渗透测试</span>
                        </div>
                        <div class="skill">
                            <span class="skill-icon">💻</span>
                            <span>编程</span>
                        </div>
                    </div>
                </div>
                
                <div class="quote">
                    <p class="quote-text">学无止境，记录点滴</p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">时间线</h2>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">2024年</div>
                            <div class="timeline-title">博客创建</div>
                            <div class="timeline-description">创建个人博客，记录学习笔记和技术心得</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">学习经历</div>
                            <div class="timeline-title">通信专业</div>
                            <div class="timeline-description">学习通信技术与网络工程相关知识</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">兴趣方向</div>
                            <div class="timeline-title">安全领域探索</div>
                            <div class="timeline-description">对网络安全产生兴趣，自学相关技术</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">博客内容</h2>
                    <p>这里主要分享：</p>
                    <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
                        <li><strong>技术笔记：</strong> 学习过程中的知识点和心得</li>
                        <li><strong>实验记录：</strong> 在安全环境中进行的各种测试和实验</li>
                        <li><strong>问题解决：</strong> 遇到的技术问题和解决方案</li>
                    </ul>
                    
                    <p><strong>免责声明：</strong></p>
                    <p>本博客分享的代码和方法仅供学习参考，请在合法、安全的环境中使用。对于任何因误用导致的问题，本人不承担责任。</p>
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