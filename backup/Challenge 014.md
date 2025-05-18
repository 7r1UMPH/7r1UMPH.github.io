# 1. 初步分析

**挑战链接:** https://hackmyvm.eu/challenges/challenge.php?c=014

![挑战图片](https://7r1umph.top//20250518140930918.webp)

## 1. 初步分析

挑战页面非常直接地给出了任务：

```
Find the flag in the domain http://momo.hackmyvm.eu
```

这表明 Flag 隐藏在目标域名 `http://momo.hackmyvm.eu` 的某个位置。对于 Web 类型的挑战，常见的 Flag 隐藏地点包括：
*   HTML 源代码注释
*   特定的页面或文件路径
*   HTTP 响应头
*   `robots.txt` 文件
*   `.htaccess` 或其他服务器配置文件（如果可访问）
*   目录爆破发现的隐藏目录或文件

## 2. 寻找 Flag

根据 Web 安全测试的常见步骤，首先检查 `robots.txt` 文件是一个很好的起点，因为它通常会指示搜索引擎哪些路径不应该被索引，有时会意外泄露敏感信息或线索。

### 2.1 检查 robots.txt

使用 `curl` 命令（或直接在浏览器中访问）来获取 `http://momo.hackmyvm.eu/robots.txt` 的内容：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl http://momo.hackmyvm.eu/robots.txt
HMV{robotized}
```

## 3. 获取 Flag 内容

`curl` 命令的输出直接返回了 Flag。`robots.txt` 文件中包含了 `HMV{robotized}`。

## 4. Flag

最终的 Flag 是：

```
HMV{robotized}
```
