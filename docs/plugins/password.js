/**
 * 文章密码保护系统
 * 使用方法：在文章Front-matter中添加password字段
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面上所有密码保护区域
    const protectElements = document.querySelectorAll('[data-password-protect]');
    
    protectElements.forEach(element => {
      const slug = element.dataset.passwordProtect;
      const storedPassword = localStorage.getItem(`password_${slug}`);
      const correctPassword = element.dataset.password;
      const message = element.dataset.message || '请输入密码查看内容';
      
      // 创建密码输入界面
      const passwordHTML = `
        <div class="password-protect-container">
          <h3>🔒 受保护内容</h3>
          <p>${message}</p>
          <div class="password-input-group">
            <input 
              type="password" 
              class="password-input" 
              placeholder="输入密码"
              data-password-input="${slug}">
            <button 
              class="password-submit" 
              data-password-submit="${slug}">验证</button>
          </div>
          <p class="password-error" data-password-error="${slug}" style="display:none">
            密码错误，请重试
          </p>
        </div>
      `;
      
      // 如果密码未存储或错误，显示密码输入界面
      if (!storedPassword || storedPassword !== correctPassword) {
        element.innerHTML = passwordHTML;
        element.style.display = 'block';
        
        // 添加事件监听
        const submitBtn = document.querySelector(`[data-password-submit="${slug}"]`);
        const passwordInput = document.querySelector(`[data-password-input="${slug}"]`);
        const errorMsg = document.querySelector(`[data-password-error="${slug}"]`);
        
        submitBtn.addEventListener('click', () => {
          if (passwordInput.value === correctPassword) {
            localStorage.setItem(`password_${slug}`, passwordInput.value);
            element.innerHTML = element.dataset.protectedContent;
          } else {
            errorMsg.style.display = 'block';
          }
        });
        
        // 支持回车键提交
        passwordInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            submitBtn.click();
          }
        });
      } else {
        // 密码正确，直接显示内容
        element.innerHTML = element.dataset.protectedContent;
      }
    });
  });
