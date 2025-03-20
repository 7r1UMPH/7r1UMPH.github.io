document.addEventListener('DOMContentLoaded', function() {
    // 创建样式元素
    const bgStyle = document.createElement('style');
    
    // 设置背景样式（替换图片URL为你需要的地址）
    bgStyle.innerHTML = `
    html {    
        background: url('https://7r1umph.github.io/image/20250320201907689.png') no-repeat center center fixed;
        background-size: cover;
    }
    `;

    // 添加到文档头部
    document.head.appendChild(bgStyle);
});
