// 使用更安全的密码验证方案
(function() {
    console.log('文章锁定脚本已加载'); // 调试信息
    
    try {
        // 配置：使用更安全的密码存储方式
        const STORAGE_KEY = 'article_access_token';
        const MASTER_PASSWORD = "abc123456"; // 设置主密码

        // 使用更安全的验证方式
        function validateAccess() {
            console.log('开始验证访问权限...');
            
            try {
                // 检查本地存储的访问令牌
                const storedToken = localStorage.getItem(STORAGE_KEY);
                const urlToken = window.location.hash.slice(1);
                
                console.log('存储的令牌:', storedToken);
                console.log('URL中的令牌:', urlToken);

                // 如果已有有效令牌或URL中的令牌正确
                if (storedToken === MASTER_PASSWORD || urlToken === MASTER_PASSWORD) {
                    console.log('验证通过');
                    if (urlToken === MASTER_PASSWORD) {
                        localStorage.setItem(STORAGE_KEY, MASTER_PASSWORD);
                        window.location.hash = ''; // 清除URL中的密码
                    }
                    return true;
                }

                // 请求密码输入
                const input = prompt("请输入文章密码：");
                if (input === MASTER_PASSWORD) {
                    console.log('密码输入正确');
                    localStorage.setItem(STORAGE_KEY, MASTER_PASSWORD);
                    return true;
                }

                console.warn('密码错误或未输入');
                alert("密码错误或未输入！");
                window.location.href = "/"; // 跳转首页
                return false;
            } catch (e) {
                console.error('验证过程中出错:', e);
                return false;
            }
        }

        // 页面加载时验证
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM已加载，开始验证');
            
            // 获取文章内容容器（根据Gmeek结构调整）
            const articleContent = document.querySelector('.markdown-body') || document.querySelector('#postBody');
            
            if (!articleContent) {
                console.log('非文章页面，跳过验证');
                return;
            }

            // 保存原始内容以便恢复
            const originalContent = articleContent.innerHTML;
            
            if (!validateAccess()) {
                console.log('验证失败，隐藏内容');
                // 只隐藏文章内容区域
                articleContent.innerHTML = `
                    <div style="text-align:center; padding:50px;">
                        <h2>此内容需要密码访问</h2>
                        <p>请刷新页面后输入正确密码</p>
                    </div>
                `;
            } else {
                console.log('验证成功，显示内容');
                articleContent.innerHTML = originalContent;
            }
        });

    } catch (e) {
        console.error('文章锁定脚本初始化错误:', e);
    }
})();
