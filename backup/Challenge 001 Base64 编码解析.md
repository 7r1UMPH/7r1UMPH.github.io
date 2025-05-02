### 挑战信息

*   **挑战名称/编号:** Challenge 001
*   **挑战链接:** [https://hackmyvm.eu/challenges/challenge.php?c=001](https://hackmyvm.eu/challenges/challenge.php?c=001)

### 初始观察

![挑战001界面](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250502145552213.png)

访问挑战页面后，我们看到页面上给出了一个字符串：

```
aG12e2Jhc2U2NGRlY29kZXJ9
```


任务显然是需要对这个字符串进行解码或解释，以获取 Flag。

### 分析与技术说明

给出的字符串 `aG12e2Jhc2U2NGRlY29kZXJ9` 具有 **Base64 编码**的典型特征：

1.  **字符集:** 它完全由大写字母 (`A-Z`)、小写字母 (`a-z`) 和数字 (`0-9`) 组成。完整的 Base64 字符集还包括 `+` 和 `/` 字符，并使用 `=` 作为填充符，不过这些特殊字符并未出现在本例的字符串中。
2.  **用途:** 需要明确的是，Base64 是一种**编码（Encoding）**方案，而不是**加密（Encryption）**方法。它的主要目的是将**二进制数据**（例如图片、可执行文件或任意字节序列）转换为**纯文本**格式，以便在只支持文本传输的媒介上传输。这对于像电子邮件（MIME 协议）、XML 或 JSON 等基于文本的格式中嵌入二进制数据至关重要。
3.  **原理简述:** Base64 的工作原理是将输入的**每 3 个字节（24 比特）**的数据转换为 **4 个 Base64 字符**。每个 Base64 字符代表原始数据中的 6 个比特（因为 2 的 6 次方等于 64，对应 Base64 的 64 个基本字符）。如果输入数据的字节数不是 3 的倍数，通常会在编码结果的末尾添加一个或两个 `=` 填充符，用来指示原始数据的精确长度。本例中字符串末尾没有 `=`，这表示原始数据的字节数恰好是 3 的倍数。

### 解码过程

我们可以使用多种工具来解码 Base64 字符串。**CyberChef** 是一个功能强大且广受欢迎的选择：

1.  **访问** CyberChef 网站: [https://gchq.github.io/CyberChef/](https://gchq.github.io/CyberChef/)
2.  **输入 (Input):** 将字符串 `aG12e2Jhc2U2NGRlY29kZXJ9` 粘贴到“Input”输入框中。
3.  **选择操作 (Operations):** 在左侧的操作列表中搜索 "From Base64"，然后将其拖拽到“Recipe”区域。
4.  **输出 (Output):** “Output”区域将自动显示解码后的结果。

当然，也可以使用命令行工具：

*   在 Linux/macOS 系统下：
    ```bash
    echo "aG12e2Jhc2U2NGRlY29kZXJ9" | base64 -d
    ```
* 执行解码操作后，我们得到以下明文字符串：

```
hmv{base64decoder}
```

### 结果：Flag

解码后的字符串即为本挑战的 Flag。

```
hmv{base64decoder}
```
