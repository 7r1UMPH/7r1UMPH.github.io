// 当DOM加载完成后执行
 document.addEventListener('DOMContentLoaded', () => {
     // 检测是否为桌面设备（宽度≥768px）
     const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
 
     // 如果是移动端则不应用桌面样式
     if (!isDesktop()) {
         console.log('检测到移动端视图，不应用桌面自定义样式');
         return;
     }
 
     // 获取当前页面路径
     const currentPath = window.location.pathname;
 
     // 样式配置对象
     const styleConfig = {
         // 通用样式（适用于所有页面）
         common: {
             // 页面主体样式
             'body': `
                 min-width: 200px;  // 最小宽度限制
                 max-width: 885px;  // 最大内容宽度
                 margin: 30px auto; // 上下边距30px，水平居中
                 min-width: 200px;
                 max-width: 885px;
                 margin: 30px auto;
                 font-size: 20px;
                 line-height: 1.6;
                 background: rgba(237, 239, 233, 0.84);
                 border-radius: 10px;
                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                 overflow: auto;
             `,
             // 侧边导航栏样式
             '.SideNav': `
                 background: rgba(255, 255, 255, 0.6); // 半透明白色背景
                 border-radius: 10px; // 圆角效果
                 min-width: unset;    // 重置最小宽度
                 background: rgba(255, 255, 255, 0.6);
                 border-radius: 10px;
                 min-width: unset;
             `,
             '.SideNav-item': `
                 transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out;
 @@ -43,14 +35,11 @@ document.addEventListener('DOMContentLoaded', () => {
                 transform: scale(1.02);
                 box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
             `,
             // 特殊文本块样式
             'div[style*="margin-bottom: 16px"]': `
                 font-family:
                     '华文行楷',          /* Windows楷体 */
                     'STKaiti',           /* macOS楷体 */
                     'Noto Serif CJK SC', /* Linux楷体替代 */
                     'WenQuanYi Micro Hei',
                     serif;               /* 备用字体 */
                     '华文行楷', 
                     'STXingkai',
                     cursive;
                 font-size: 1.4em;
                 color: rgb(0, 0, 0);
                 text-shadow:
 @@ -61,10 +50,9 @@ document.addEventListener('DOMContentLoaded', () => {
                 margin-bottom: 16px !important;
             `
         },
         // 首页专属样式
         home: {
             '#header': `
                 height: 300px; // 头部区域高度
                 height: 300px;
             `,
             '#header h1': `
                 position: absolute;
 @@ -84,7 +72,6 @@ document.addEventListener('DOMContentLoaded', () => {
                 margin-left: unset;
             `
         },
         // 文章页专属样式
         article: {
             'body': `
                 max-width: 1000px;  
 @@ -100,15 +87,16 @@ document.addEventListener('DOMContentLoaded', () => {
                  font-size: 18px !important;  
                 line-height: 1.4 !important;
             `,
             // 文章标题样式（h1-h6）
             'body .markdown-body h1, body .markdown-body h2, body .markdown-body h3, body .markdown-body h4, body .markdown-body h5, body .markdown-body h6, h1.postTitle': `
                 font-family: '华文新魏', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif !important;
                 font-family: '华文新魏', 'STXinwei', cursive, sans-serif !important;
                 margin-top: 1.5em !important;
                 margin-bottom: 0.8em !important;
                 font-weight: 600 !important;
             `,
             'a[href*="github.com/7r1UMPH/7r1UMPH.github.io/issues"]': `
                 display: none !important;
             `
         },
         // 分页页样式（暂未实现）
         page: {}
     };
 
 @@ -126,11 +114,9 @@ document.addEventListener('DOMContentLoaded', () => {
         }
     };
 
     // 生成CSS字符串的函数
     const generateCSS = (styles) => {
         return Object.entries(styles)
             .map(([selector, rules]) => {
                 // 格式化CSS规则：去除空格并确保以分号结尾
                 const formattedRules = rules.trim().endsWith(';') 
                     ? rules.trim() 
                     : `${rules.trim()};`;
 @@ -139,36 +125,31 @@ document.addEventListener('DOMContentLoaded', () => {
             .join('\n');
     };
 
     // 检测当前页面类型（首页/文章/分页）
     const getPageType = () => {
         const routePatterns = [
             { type: 'home', pattern: /^(\/|\/index\.html)$/ },    // 首页路由
             { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ }, // 文章路由
             { type: 'page', pattern: /\/page\d+\.html$/ }          // 分页路由
             { type: 'home', pattern: /^(\/|\/index\.html)$/ },
             { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ },
             { type: 'page', pattern: /\/page\d+\.html$/ }
         ];
         return routePatterns.find(p => p.pattern.test(currentPath))?.type;
     };
 
     // 应用样式的核心函数
     const applyStyles = () => {
         const pageType = getPageType();
         console.log(`当前页面类型: ${pageType || '通用'}`);
 
         // 合并通用样式和页面专属样式
         let mergedStyles = { ...styleConfig.common };
         if (pageType && styleConfig[pageType]) {
             mergedStyles = { ...mergedStyles, ...styleConfig[pageType] };
         }
 
         // 添加全局背景样式
         mergedStyles['html'] = `
             background: url('https://hub.gitmirror.com/https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250320210716585.webp')
                 no-repeat center center fixed;
             background-size: cover;
             scroll-behavior: smooth;
         `;
 
         // 创建并插入样式标签
         const cssString = generateCSS(mergedStyles);
         if (cssString) {
             const styleTag = document.createElement('style');
 @@ -178,8 +159,6 @@ document.addEventListener('DOMContentLoaded', () => {
         }
     };
 
     // 执行样式应用
     applyStyles();
 
     updateQuoteDiv();
 });
