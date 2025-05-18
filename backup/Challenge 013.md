# Challenge 013

# Challenge 013

**挑战链接:** https://hackmyvm.eu/challenges/challenge.php?c=013

![挑战图片](https://7r1umph.top/image/20250518140039064.webp)

## 1. 初步分析

访问挑战页面，页面上显示了一段被 `<pre>` 标签包裹的文本：

```html
<pre> MXV{BNRNKWPCEUSEX} k:FLAG </pre>
```

这段文本包含两部分：
1.  `MXV{BNRNKWPCEUSEX}`: 这看起来是一个加密后的 Flag 格式，其中 `MXV` 可能是加密文本的前缀，`BNRNKWPCEUSEX` 是密文。
2.  `k:FLAG`: 这强烈暗示了加密所使用的密钥 (key) 是字符串 "FLAG"。

结合常见的 CTF 题目类型，这种形式的密文和密钥提示通常指向古典密码，如凯撒密码、维吉尼亚密码等。考虑到提供了多字符密钥 "FLAG"，维吉尼亚密码 (Vigenère cipher) 是最有可能的加密方式。

## 2. 解密过程

为了获取原始 Flag，我们需要使用识别出的密钥对密文进行维吉尼亚解密。

### 2.1 识别加密类型及密钥

*   **加密类型**: 维吉尼亚密码 (Vigenère cipher)。
*   **密文**: `BNRNKWPCEUSEX` (取自 `MXV{BNRNKWPCEUSEX}` 中的花括号部分)。
*   **密钥**: `FLAG` (根据页面提示 `k:FLAG`)。

### 2.2 使用 CyberChef 进行解密

CyberChef 是一个非常方便的在线编解码工具，非常适合处理此类古典密码。

1.  打开 CyberChef。
2.  将密文 `BNRNKWPCEUSEX` 粘贴到 "Input" 框中。
    *   或者，可以将完整的字符串 `MXV{BNRNKWPCEUSEX}` 输入，然后观察解密结果是否包含可识别的 Flag 格式。根据您的截图，您输入的是完整的 `MXV{BNRNKWPCEUSEX}`。
3.  在 "Operations" 列表中搜索 "Vigenère Decode" 并将其拖拽到 "Recipe" 区域。
4.  在 "Vigenère Decode" 操作的 "Key" 字段中输入密钥 `FLAG`。

CyberChef 的操作界面和解密结果如下所示：

![CyberChef 解密维吉尼亚密码](https://7r1umph.top/image/20250518140633398.webp)

从 CyberChef 的输出可以看到，当输入为 `MXV{BNRNKWPCEUSEX}` 且密钥为 `FLAG` 时，解密结果是 `HMV{HACKTHEPLANET}`。
这意味着原始 Flag 的前缀是 `HMV`，内容是 `HACKTHEPLANET`。

## 3. 获取 Flag 内容

通过 CyberChef 使用维吉尼亚解密，我们成功地将密文 `MXV{BNRNKWPCEUSEX}` 配合密钥 `FLAG` 解密为明文。

## 4. Flag

最终的 Flag 是：

```
HMV{HACKTHEPLANET}
```

---