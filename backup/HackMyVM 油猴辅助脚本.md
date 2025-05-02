## 1. 起因 🤔

最近逛我博客的新朋友好像多了起来，不少人被安利去玩 **HackMyVM** 了。不过，刚上手可能会遇到些小麻烦。

比如我自己玩的时候，就经常因为发呆太久（或者查资料时间长了点）导致会话超时，每次都得重新登录，**挺烦人的**。还有，打 Challenge 的时候，每次提交完 Flag 都得**手动去改 URL 跳到下一个**，点几下也是有点小不爽。

为了解决这两个痛点，我利用 AI 捣鼓了一个油猴脚本，也复制给大家 Todd 大佬的一个脚本，希望能让大家的 HackMyVM 体验**更舒服一点**。👍

---

## 2. 脚本一：保持在线不掉线⏳

### 2.1. 它能干啥？

这个脚本主要就是为了防止你因为长时间没在 HackMyVM 页面上操作而被强制踢下线。它会**悄悄地在后台帮你自动刷新页面**，这样你就可以安心地查资料、写笔记或者暂时离开一下，不用担心回来又要重新登录了。

### 2.2. 它是怎么工作的？

```javascript
// ==UserScript==
// @name         保持hackmyvm的登录状态
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  定时刷新页面，保持登录状态，目前 5 分钟
// @require
// @author       Todd
// @match        https://hackmyvm.eu/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  // 设置一个定时器，每隔 5 分钟（300,000 毫秒）就让它干点事
  setInterval(() => {
    // 干的事就是：刷新一下当前页面
    location.reload();
  }, 1000 * 60 * 5); // 1秒 * 60 * 5 = 5分钟
})();
```

*   `@match https://hackmyvm.eu/*`: 这行是告诉油猴（Tampermonkey），这个脚本只在 HackMyVM 网站 (`https://hackmyvm.eu/`) 下的所有页面生效。
*   `setInterval(() => location.reload(), 1000 * 60 * 5);`: 这是脚本的核心。`setInterval` 会让浏览器**每隔 5 分钟**就执行一次 `location.reload()` 这个命令，也就是刷新当前页面，模拟你还在活跃状态，从而保持登录。

### 2.3. 谁写的？

这个脚本是 **Todd** 大佬写的。膜拜大佬！orz

> **P.S.** 如果想去 Todd 大佬的博客看看，可以点击[**这里**](https://blog.findtodd.com/)，或者去我的友链页面也能找到跳转链接。

### 2.4. 什么情况下用比较好？

**强烈推荐**给需要在 HackMyVM 上查资料、写 Writeup，或者只是挂着页面思考解题思路的朋友们。有了它，麻麻再也不用担心，我动不动就得重新登录了，就算你暂时离开电脑一会儿，也能帮你保住登录状态。

---

## 3. 脚本二：挑战关卡快速跳转🚀

### 3.1. 它能干啥？

打 Challenge 时是不是觉得每次输完 Flag 都要手动改 URL 去下一个有点烦？这个脚本就是来解决这个问题的！

它给 HackMyVM 的挑战页面 (`challenge.php`) 加了个快捷操作：你可以直接 **按鼠标侧键**（通常是“前进”那个按钮，一般是 `Button 4`）或者**键盘的右箭头 `→`**，脚本就会自动帮你跳转到下一个 Challenge 页面，**省事多了**！

### 3.2. 它是怎么工作的？

```javascript
// ==UserScript==
// @name         HackMyVM挑战页面快速导航
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用鼠标侧上键或右箭头快速导航到下一个挑战页面
// @author       AI & YourName (Modify)
// @match        https://hackmyvm.eu/challenges/challenge.php?c=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 封装一个跳转到下一关的动作
    function navigateToNextChallenge() {
        const currentUrl = window.location.href; // 获取当前页面的网址
        // 用正则表达式抓取网址里 c= 后面的数字 (挑战编号)
        const challengeMatch = currentUrl.match(/c=(\d+)/);

        if (challengeMatch && challengeMatch[1]) { // 确保抓到了编号
            // 把抓到的编号字符串转成数字
            const currentChallenge = parseInt(challengeMatch[1], 10);
            // 计算下一个挑战的编号
            const nextChallenge = currentChallenge + 1;
            // HackMyVM 的编号通常是三位数 (如 001, 019)，所以格式化一下，不够三位前面补 0
            const formattedNextChallenge = String(nextChallenge).padStart(3, '0');
            // 把当前网址里的 "c=旧编号" 替换成 "c=新编号"，得到新网址
            const newUrl = currentUrl.replace(/c=\d+/, 'c=' + formattedNextChallenge);
            // 跳转到新网址
            window.location.href = newUrl;
        }
    }

    // 监听鼠标按键抬起事件
    document.addEventListener('mouseup', function(event) {
        // 检查是不是鼠标侧键（前进键，按钮编号通常是 4）
        if (event.button === 4) { // button 4 通常是侧前键
            navigateToNextChallenge(); // 是的话，就执行跳转
        }
    });

    // 监听键盘按键按下事件
    document.addEventListener('keydown', function(event) {
        // 检查是不是按了右箭头键
        if (event.key === 'ArrowRight') {
            navigateToNextChallenge(); // 是的话，也执行跳转
        }
    });

})();
```

*   `@match https://hackmyvm.eu/challenges/challenge.php?c=*`: 这个脚本专门针对**挑战页面**，所以只在网址匹配这个模式 (`challenge.php` 后面跟着 `?c=`) 的时候运行。
*   `navigateToNextChallenge()`: 这是核心的跳转逻辑函数。它会：
    1.  拿到你当前所在挑战页面的 URL。
    2.  用**正则表达式**从 URL 里把挑战编号（比如 `c=005` 里的 `005`）抠出来。
    3.  把编号加 1，得到下一个挑战的编号。
    4.  **特别处理**：因为 HackMyVM 的编号喜欢用**三位数**（像 `001`, `020` 这种），所以脚本会把新的编号也**格式化成三位数**（比如 `6` 会变成 `006`），不足三位前面补 `0`。
    5.  最后，生成一个新的 URL（把旧编号替换成新编号），然后让浏览器跳转过去。
*   `addEventListener('mouseup', ...)`: 这部分是**监听鼠标按键抬起**的动作。如果松开的是鼠标侧前键（`event.button === 4`），就调用上面的跳转函数。
*   `addEventListener('keydown', ...)`: 这部分是**监听键盘按键按下**的动作。如果按的是右箭头（`event.key === 'ArrowRight'`），也调用跳转函数。

### 3.3. 谁写的？

这个脚本主要是 **AI** 编写的。（我就起到了一个 `Ctrl+C` / `Ctrl+V` 😉）。

### 3.4. 什么情况下用比较好？

如果你喜欢**按顺序刷 HackMyVM 的 Challenge**，这个脚本绝对是提升效率的神器！它能帮你省下不少点击和修改 URL 的时间，让刷题过程**更流畅**、**体验更好**。
