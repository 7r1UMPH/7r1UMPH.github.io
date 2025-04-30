document.addEventListener('DOMContentLoaded', () => {
    // --- 配置 --- 
    // 密码 ('7r1um9h888') 的 Base64 编码形式，稍微隐藏一下
    const correctPasswordHash = 'N3IxdW05aDg4OA==';
    // ----------------

    const body = document.body;
    let originalBodyOverflow = body.style.overflow;
    let originalBodyContent = body.innerHTML; // 保存原始内容

    function showPasswordPrompt() {
        // 隐藏原始内容，但保留 body 结构
        body.innerHTML = ''; 
        body.style.overflow = 'hidden'; // 防止滚动
        body.style.display = 'flex';
        body.style.justifyContent = 'center';
        body.style.alignItems = 'center';
        body.style.minHeight = '100vh';
        body.style.backgroundColor = '#f0f2f5';
        body.style.margin = '0';
        body.style.padding = '20px';
        body.style.boxSizing = 'border-box';

        const container = document.createElement('div');
        container.style.background = 'white';
        container.style.padding = '40px';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        container.style.textAlign = 'center';
        container.style.maxWidth = '400px';
        container.style.width = '100%';
        container.setAttribute('id', 'password-prompt-container');

        container.innerHTML = `
            <h2 style="color: #1a73e8; margin-bottom: 25px;">内容受保护</h2>
            <p style="color: #5f6368; margin-bottom: 20px; font-size: 1rem;">请输入密码访问此文章：</p>
            <div style="display: flex; margin-bottom: 20px;">
                <input type="password" id="passwordInput" placeholder="访问密码" aria-label="访问密码" style="flex-grow: 1; padding: 12px; border: 1px solid #dadce0; border-radius: 6px 0 0 6px; font-size: 1rem; transition: border-color 0.2s; box-sizing: border-box;">
                <button id="submitPassword" style="padding: 12px 20px; background: #1a73e8; color: white; border: none; border-radius: 0 6px 6px 0; font-size: 1rem; cursor: pointer; transition: background-color 0.2s; margin-left: -1px; box-sizing: border-box;">访问</button>
            </div>
            <p id="errorMessage" style="color: #d93025; margin-top: 15px; font-size: 0.9em; min-height: 1.2em; visibility: hidden;">密码错误！</p>
        `;

        body.appendChild(container);

        const passwordInput = document.getElementById('passwordInput');
        const submitButton = document.getElementById('submitPassword');
        const errorMessage = document.getElementById('errorMessage');

        const attemptUnlock = () => {
            const enteredPassword = passwordInput.value;
            if (enteredPassword === atob(correctPasswordHash)) {
                // 密码正确，恢复原始内容
                body.innerHTML = originalBodyContent;
                // 恢复 body 样式
                body.style.overflow = originalBodyOverflow;
                body.style.display = '';
                body.style.justifyContent = '';
                body.style.alignItems = '';
                body.style.minHeight = '';
                body.style.backgroundColor = '';
                body.style.margin = '';
                body.style.padding = '';
                body.style.boxSizing = '';
                 // 可能需要重新执行 Gmeek 或主题的某些初始化脚本？
                 // 这取决于主题如何加载 JS。如果需要，可以在这里触发。
                 // 例如： if (typeof window.initializeTheme === 'function') { window.initializeTheme(); }
            } else {
                errorMessage.textContent = '密码错误！请重试。';
                errorMessage.style.visibility = 'visible';
                passwordInput.value = '';
                passwordInput.focus();
            }
        };

        submitButton.addEventListener('click', attemptUnlock);
        passwordInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault();
                attemptUnlock();
            }
        });

        // 页面加载后自动聚焦
        passwordInput.focus();
    }

    // 执行密码保护逻辑
    showPasswordPrompt();
}); 