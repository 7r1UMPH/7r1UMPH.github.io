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
                margin-bottom: 60px;
                text-align: center;
                position: relative;
                background: linear-gradient(to bottom, rgba(var(--color-canvas-default-rgb), 0.8), rgba(var(--color-canvas-default-rgb), 0.6));
                padding: 40px 20px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            }
            
            .avatar-container {
                position: relative;
                margin-bottom: 40px;
                width: 220px;
                height: 220px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .avatar {
                width: 160px;
                height: 160px;
                border-radius: 50%;
                object-fit: cover;
                border: 5px solid var(--color-accent-fg);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
                z-index: 5;
            }
            
            .avatar:hover {
                transform: scale(1.08);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            }
            
            .status-badge {
                position: absolute;
                bottom: 15px;
                right: 15px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #4CAF50;
                border: 3px solid white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                animation: pulse 2s infinite;
                z-index: 6;
            }
            
            .skills-orbit {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none; /* Allow clicks to pass through to avatar */
            }
            
            .skill-orbit {
                position: absolute;
                width: 55px;
                height: 55px;
                border-radius: 50%;
                background-color: var(--color-canvas-default);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                cursor: pointer;
                border: 2px solid transparent;
                z-index: 3;
                pointer-events: auto; /* Enable pointer events for icons */
            }
            
            .skill-orbit:nth-child(1) {
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                animation: float 6s infinite ease-in-out;
            }
            
            .skill-orbit:nth-child(2) {
                top: 25%;
                right: -25px;
                animation: float 7s infinite ease-in-out 0.5s;
            }
            
            .skill-orbit:nth-child(3) {
                bottom: -25px;
                right: 25%;
                animation: float 5s infinite ease-in-out 1s;
            }
            
            .skill-orbit:nth-child(4) {
                bottom: -25px;
                left: 25%;
                animation: float 8s infinite ease-in-out 1.5s;
            }
            
            .skill-orbit:nth-child(5) {
                top: 25%;
                left: -25px;
                animation: float 6s infinite ease-in-out 2s;
            }
            
            .skill-orbit:nth-child(6) {
                top: 5%;
                right: 5%;
                animation: float 7s infinite ease-in-out 2.5s;
            }
            
            @keyframes float {
                0% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-10px);
                }
                100% {
                    transform: translateY(0);
                }
            }
            
            .skill-orbit:hover {
                transform: scale(1.15);
                box-shadow: 0 8px 15px rgba(0,0,0,0.15);
                border-color: var(--color-accent-fg);
                background-color: var(--color-accent-subtle);
                z-index: 10;
            }
            
            .skill-orbit-icon {
                font-size: 1.6em;
                color: var(--color-accent-fg);
            }
            
            .skill-tooltip {
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%) scale(0);
                background-color: var(--color-accent-fg);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 0.8em;
                white-space: nowrap;
                opacity: 0;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                pointer-events: none;
            }
            
            .skill-orbit:hover .skill-tooltip {
                transform: translateX(-50%) scale(1);
                opacity: 1;
                bottom: -35px;
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
                        <div class="skills-orbit">
                            <div class="skill-orbit">
                                <i class="skill-orbit-icon fa-solid fa-shield-halved"></i>
                                <span class="skill-tooltip">网络安全</span>
                            </div>
                            <div class="skill-orbit">
                                <i class="skill-orbit-icon fa-solid fa-network-wired"></i>
                                <span class="skill-tooltip">数据通信</span>
                            </div>
                            <div class="skill-orbit">
                                <i class="skill-orbit-icon fa-solid fa-diagram-project"></i>
                                <span class="skill-tooltip">ENSP</span>
                            </div>
                            <div class="skill-orbit">
                                <i class="skill-orbit-icon fa-brands fa-linux"></i>
                                <span class="skill-tooltip">Linux</span>
                            </div>
                            <div class="skill-orbit">
                                <i class="skill-orbit-icon fa-solid fa-code"></i>
                                <span class="skill-tooltip">编程</span>
                            </div>
                            <div class="skill-orbit">
                                <i class="skill-orbit-icon fa-solid fa-comments"></i>
                                <span class="skill-tooltip">吹水</span>
                            </div>
                        </div>
                    </div>
                    <h1 class="name">Triumph</h1>
                    <p class="title">NPC</p>
                    <div class="social-links">
                        <a href="mailto:triumph202402@gmail.com" class="social-link" title="Email">
                            <i class="fa-solid fa-envelope" style="font-size: 20px;"></i>
                        </a>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">时间线</h2>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">2024年</div>
                            <div class="timeline-title">博客启程</div>
                            <div class="timeline-description">创建个人博客，开始记录学习笔记与技术心得体会。</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">学习经历</div>
                            <div class="timeline-title">通信工程专业</div>
                            <div class="timeline-description">系统学习通信技术与网络工程基础知识。</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">兴趣方向</div>
                            <div class="timeline-title">渗透测试</div>
                            <div class="timeline-description">对渗透测试拥有浓厚兴趣，开始自学相关技术与知识。</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2 class="section-title">博客内容</h2>
                    <p>本博客主要涵盖以下内容：</p>
                    <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.6;">
                        <li><strong>技术笔记：</strong> 学习过程中的知识点和心得总结</li>
                        <li><strong>实验记录：</strong> 在安全环境中进行的各种测试和探索</li>
                        <li><strong>问题解决：</strong> 遇到的技术问题和解决方案</li>
                    </ul>
                    
                    <p><strong>免责声明：</strong></p>
                    <p>本博客分享的代码和方法仅供学习参考，请在合法、安全的环境中使用。对于任何因误用导致的问题，本人不承担责任。</p>
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