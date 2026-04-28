# 初始观察

*   **挑战链接:** [https://hackmyvm.eu/challenges/challenge.php?c=007](https://hackmyvm.eu/challenges/challenge.php?c=007)

## 初始观察

访问挑战页面后，展示了以下经过特殊处理的字符串：

![image-20250518101535788](https://7r1UMPH.top/image/20250518101535983.webp)

原始字符串为：
```
=0Xd0ʞƐMOqWMςЯzɘWƖƎƧ
```
该字符串包含反转字符和 Unicode 特殊字符，初步判断需要进行文本反转和字符替换操作。部分字符可能因本地系统字体库不完整而显示异常。

## 探索过程

针对该字符串的特性，我们采取了以下步骤进行分析和解码。

### 1. 字符串反转处理

首先，对原始字符串进行整体反转。可使用在线文本反转工具，例如 `textfixer.com` 提供的工具：

![image-20250518102657623](https://7r1UMPH.top/image/20250518102657806.webp)

[https://www.textfixer.com/tools/reverse-text-generator.php](https://www.textfixer.com/tools/reverse-text-generator.php)

输入原始字符串后，工具输出的反转结果（或手动反转并部分规范化后）如下：

![image-20250518102747809](https://7r1UMPH.top/image/20250518102747978.webp)

```
SEƖWezRςMWqOMƐk0dX0=
```
可以看到，部分易于识别的反转字符（如 `Я` -> `R`, `ʞ` -> `k`）已被工具或初步手动处理还原，但仍存在一些特殊 Unicode 字符（如 `Ɩ`, `ς`, `Ɛ`）需要进一步处理。

### 2. 特殊字符识别与替换

接下来，需要对剩余的特殊字符进行识别，并替换为标准的 ASCII 字符。这一步通常基于字符形状的相似性和在编码中（如 Base64）的常见对应关系进行推断。

原始反转字符串： `SEƖWezRςMWqOMƐk0dX0=`

根据字符形态进行如下替换：
*   `ς` (Greek Small Letter Sigma Symbol) 类似于数字 `2`。替换后：
    `SEƖWezR2MWqOMƐk0dX0=`
*   `Ɛ` (Latin Capital Letter Open E) 类似于数字 `3`。替换后：
    `SEƖWezR2MWqOM3k0dX0=`
*   考虑到 Base64 编码的字符集，以及上下文，`q` 可能对应 `p`，`d` 可能对应 `b`。替换后：
    `SEƖWezR2MWpOM3k0bX0=`
*   `Ɩ` (Latin Letter Iota) 类似于数字 `1`。替换后：
    `SE1WezR2MWpOM3k0bX0=`

经过上述字符替换，得到一个结构更清晰的字符串：
```
SE1WezR2MWpOM3k0bX0=
```
该字符串以 `=` 结尾，且其字符集（大写字母、小写字母、数字）符合 Base64 编码的特征。

### 3. Base64 解码

确认字符串为 Base64 编码后，使用 Base64 解码工具或命令进行解码。
可以使用 `base64` 命令行工具：

执行命令：
```bash
echo "SE1WezR2MWpOM3k0bX0=" | base64 -d
```
解码输出结果为：
```
HMV{4v1jN3y4m}
```
此即为挑战的 Flag。

## Flag

最终获取的 Flag 为：

`HMV{4v1jN3y4m}`