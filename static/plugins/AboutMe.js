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
                background: linear-gradient(to bottom, rgba(var(--color-canvas-default-rgb), 0.8), rgba(var(--color-canvas-default-rgb), 0.6));
                padding: 40px 20px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            }
            
            .avatar-container {
                position: relative;
                margin-bottom: 25px;
            }
            
            .avatar {
                width: 160px;
                height: 160px;
                border-radius: 50%;
                object-fit: cover;
                border: 5px solid var(--color-accent-fg);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .avatar:hover {
                transform: scale(1.08) rotate(5deg);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
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
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
                }
                70% {
                    transform: scale(1.1);
                    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
                }
                100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
                }
            }
            
            .name {
                font-size: 2.5em;
                font-weight: bold;
                margin-bottom: 5px;
                color: var(--color-fg-default);
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                letter-spacing: 1px;
            }
            
            .title {
                font-size: 1.5em;
                font-weight: 500;
                color: var(--color-accent-fg);
                margin-bottom: 20px;
                letter-spacing: 1px;
                background: linear-gradient(to right, var(--color-accent-fg), var(--color-accent-emphasis));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-fill-color: transparent;
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
                padding: 12px 20px;
                border-radius: 50px;
                font-weight: 500;
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid transparent;
            }
            
            .skill:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 15px rgba(0,0,0,0.1);
                background-color: var(--color-accent-subtle);
                border-color: var(--color-accent-fg);
            }
            
            .skill-icon {
                font-size: 1.4em;
                width: 24px;
                text-align: center;
                margin-right: 10px;
                color: var(--color-accent-fg);
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
                padding-left: 60px;
                margin-bottom: 40px;
                transition: all 0.3s ease;
            }
            
            .timeline-item:hover {
                transform: translateX(5px);
            }
            
            .timeline-item:last-child {
                margin-bottom: 0;
            }
            
            .timeline-dot {
                position: absolute;
                left: 15px;
                top: 5px;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-color: var(--color-accent-fg);
                border: 3px solid var(--color-canvas-subtle);
                transition: all 0.3s ease;
            }
            
            .timeline-item:hover .timeline-dot {
                transform: scale(1.2);
                box-shadow: 0 0 0 5px rgba(var(--color-accent-fg-rgb), 0.2);
            }
            
            .timeline-date {
                font-weight: bold;
                color: var(--color-accent-fg);
                margin-bottom: 8px;
                letter-spacing: 0.5px;
            }
            
            .timeline-title {
                font-weight: 600;
                margin-bottom: 8px;
                font-size: 1.1em;
                color: var(--color-fg-default);
            }
            
            .timeline-description {
                color: var(--color-fg-muted);
                line-height: 1.6;
                font-size: 0.95em;
            }
            
            .quote {
                padding: 40px;
                border-radius: 16px;
                background: linear-gradient(135deg, var(--color-accent-subtle) 0%, rgba(255,255,255,0.8) 100%);
                margin: 50px 0;
                position: relative;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                border-left: 5px solid var(--color-accent-fg);
                overflow: hidden;
            }
            
            .quote::before, .quote::after {
                content: '"';
                font-size: 8em;
                font-family: Georgia, serif;
                position: absolute;
                opacity: 0.1;
            }
            
            .quote::before {
                top: -30px;
                left: 20px;
                color: var(--color-accent-fg);
            }
            
            .quote::after {
                bottom: -80px;
                right: 20px;
                color: var(--color-accent-fg);
                transform: rotate(180deg);
            }
            
            .quote-text {
                font-size: 1.6em;
                line-height: 1.6;
                font-weight: 500;
                font-style: italic;
                position: relative;
                z-index: 1;
                color: var(--color-fg-default);
                text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
                margin: 0;
                padding: 0 30px;
            }
            
            .quote-author {
                margin-top: 20px;
                font-weight: 600;
                color: var(--color-accent-fg);
                position: relative;
                z-index: 1;
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
                display: inline-flex;
                align-items: center;
                gap: 8px;
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
                    <p class="title">NPC</p>
                    <div class="social-links">
                           <a href="mailto:triumph202402@gmail.com" class="social-link" title="Email">
                            <i class="fa-solid fa-envelope" style="font-size: 20px;"></i>
                        </a>
                    </div>
                    <p class="bio">
                        热衷于探索数字世界的奥秘，不断学习成长的技术爱好者。在这个快速变化的时代，记录所思所想，分享技术心得。
                    </p>
                </div>
                
                <div class="section">
                    <h2 class="section-title">关于我</h2>
                    <p>2024年初，我创建了这个小天地，作为记录学习历程和技术思考的数字园地。这里承载着我对技术的探索热情，也是我与志同道合朋友交流的平台。每一篇文章都是一段独特的旅程，记录着发现与成长的点滴。</p>
                    <div class="skills-container">
                        <div class="skill">
                            <i class="skill-icon fa-solid fa-shield-halved"></i>
                            <span>网络安全</span>
                        </div>
                        <div class="skill">
                            <i class="skill-icon fa-solid fa-network-wired"></i>
                            <span>数据通信</span>
                        </div>
                        <div class="skill">
                            <i class="skill-icon fa-solid fa-diagram-project"></i>
                            <span>ENSP</span>
                        </div>
                        <div class="skill">
                            <i class="skill-icon fa-brands fa-linux"></i>
                            <span>Linux</span>
                        </div>
                        <div class="skill">
                            <i class="skill-icon fa-solid fa-code"></i>
                            <span>编程</span>
                        </div>
                        <div class="skill">
                            <i class="skill-icon fa-solid fa-comments"></i>
                            <span>吹水</span>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">时间线</h2>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">2024年</div>
                            <div class="timeline-title">博客启程</div>
                            <div class="timeline-description">怀着分享与记录的初心，创建了这个个人小站。这里不仅是知识的聚集地，更是思想的交汇点，见证着每一步的技术成长。</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">学习经历</div>
                            <div class="timeline-title">通信工程专业</div>
                            <div class="timeline-description">专注于通信技术与网络工程领域的学习，从理论到实践，一点一滴构建专业知识体系，为技术探索打下坚实基础。</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">兴趣方向</div>
                            <div class="timeline-title">渗透测试</div>
                            <div class="timeline-description">循着好奇心的指引，深入研究渗透测试技术，在黑白领域间探索，以安全视角理解系统构建，不断挑战技术边界。</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">博客内容</h2>
                    <p>这个小天地主要聚焦于以下几个方面的内容分享与探讨：</p>
                    <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
                        <li><strong>技术笔记：</strong> 深入浅出的学习心得与知识总结，记录那些值得铭记的技术发现</li>
                        <li><strong>实验记录：</strong> 在安全可控环境中进行的各类技术尝试与实验，分享过程与结果</li>
                        <li><strong>问题解决：</strong> 记录技术难题的思考过程与解决方案，以期帮助遇到类似问题的同路人</li>
                    </ul>
                    
                    <p><strong>免责声明：</strong></p>
                    <p>本博客分享的所有内容仅供技术学习与研究参考，请务必在合法、合规的环境中应用。任何技术的使用都应当遵循道德与法律准则，对于因误用导致的任何问题，本人不承担相关责任。</p>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <a href="https://github.com/7r1UMPH/7r1UMPH.github.io/issues" target="_blank" class="contact-button">
                        <i class="fa-solid fa-paper-plane"></i> 联系我
                    </a>
                </div>
            </div>
        `;
    }
}); 