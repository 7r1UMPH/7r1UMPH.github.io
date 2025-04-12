// 使用更安全的密码验证方案
(function() {
    // 配置：使用更安全的密码存储方式
    const STORAGE_KEY = 'article_access_token';
    const MASTER_PASSWORD = "abc123456"; // 设置主密码

    // 使用更安全的验证方式
    function validateAccess() {
        // 检查本地存储的访问令牌
        const storedToken = localStorage.getItem(STORAGE_KEY);
        const urlToken = window.location.hash.slice(1);
        
        // 如果已有有效令牌或URL中的令牌正确
        if (storedToken === MASTER_PASSWORD || urlToken === MASTER_PASSWORD) {
            if (urlToken === MASTER_PASSWORD) {
                localStorage.setItem(STORAGE_KEY, MASTER_PASSWORD);
                window.location.hash = ''; // 清除URL中的密码
            }
            return true;
        }

        // 请求密码输入
        const input = prompt("请输入文章密码：");
        if (input === MASTER_PASSWORD) {
            localStorage.setItem(STORAGE_KEY, MASTER_PASSWORD);
            return true;
        }

        alert("密码错误或未输入！");
        window.location.href = "/"; // 跳转首页
        return false;
    }

    // 页面加载时验证
    document.addEventListener('DOMContentLoaded', () => {
        if (!validateAccess()) {
            // 密码验证失败，隐藏文章内容
            document.body.innerHTML = `
                <div style="text-align:center; padding:50px;">
                    <h2>此内容需要密码访问</h2>
                    <p>请刷新页面后输入正确密码</p>
                </div>
            `;
        }
    });
})();
