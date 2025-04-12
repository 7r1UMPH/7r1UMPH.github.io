(function() {
    // 配置：预设密码和哈希算法（示例使用简单哈希，实际可用 bcryptjs）
    const MASTER_PASSWORD = "abc123456"; // 设置主密码
    const HASH_SEED = "gmeek_salt"; // 增加随机盐值

    // 生成密码哈希（简化版，实际建议用 Web Crypto API 或 bcryptjs）
    function generateHash(password) {
        return btoa(password + HASH_SEED); // Base64 编码示例
    }

    // 验证 URL 中的哈希
    function validateHash() {
        const storedHash = window.location.hash.slice(1); // 获取 URL 哈希
        if (!storedHash) {
            const input = prompt("请输入文章密码：");
            if (input) {
                const hash = generateHash(input);
                if (hash === generateHash(MASTER_PASSWORD)) {
                    window.location.hash = hash; // 验证通过，存入 URL
                    return;
                }
            }
            alert("密码错误或未输入！");
            window.location.href = "/"; // 跳转首页
        } else if (storedHash !== generateHash(MASTER_PASSWORD)) {
            window.location.href = "/"; // 哈希不匹配则跳转
        }
    }

    // 页面加载时验证
    window.onload = validateHash;
})();
