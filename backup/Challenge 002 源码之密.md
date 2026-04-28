### 挑战信息

*   **挑战名称/编号:** Challenge 002
*   **挑战链接:** [https://hackmyvm.eu/challenges/challenge.php?c=002](https://hackmyvm.eu/challenges/challenge.php?c=002)

### 初始观察

![挑战002初始界面](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250502150050288.png)

访问挑战页面后，页面内容提示我们需要访问另一个特定的 URL 来获取 Flag。同时，页面明确指出**无需进行暴力破解 (No Bruteforce required)**。

提供的目标 URL 为： `http://momo.hackmyvm.eu/ch4ll3ng3002/`

### 分析与技术说明

根据指示，我们访问了目标 URL `http://momo.hackmyvm.eu/ch4ll3ng3002/`。该页面呈现一个简单的 HTML 表单，要求用户输入密码以获取 Flag。

鉴于挑战明确排除了暴力破解的可能性，这强烈暗示所需密码并非通过猜测或字典攻击获得，而是可能以某种非显而易见的方式隐藏在当前页面或其关联资源中。在 Web 安全领域，检查客户端侧资源，特别是 **HTML 源代码**，是发现此类信息的常用技术手段。

Web 浏览器在渲染页面时会解析 HTML 代码，但源代码本身包含了开发者编写的所有标记和注释。开发者有时会在注释中留下调试信息、说明甚至是敏感数据。

### 解码/求解过程

我们在浏览器中对目标页面 `http://momo.hackmyvm.eu/ch4ll3ng3002/` 执行“查看网页源代码”操作。仔细检查源代码后，在 `<form>` 元素内部发现了一段被 `<!--` 和 `-->` 包裹的 **HTML 注释**：

```html
<!doctype html>
<html lang="en">
<title>002</title>
Password to obtain the flag.
    <form class="form-signin" action="passcheck.php" method="post">
      <input type="password" name="password" id="password" placeholder="Password" required>
      <input type="submit" value="Send">
      <!-- isthisthepassword? -->  <!-- 此处发现注释内容 -->
    </form>
  </body>
</html>
```

该注释内容为：

```
isthisthepassword?
```

这段文本极有可能就是寻找的密码。我们将此字符串 `isthisthepassword?` 填入页面的密码输入框，并提交表单。

服务器验证通过后，返回了包含 Flag 的页面。

### 结果：Flag

成功获取的 Flag 为：

```
HMV{thatwasreallyeazy}
```
