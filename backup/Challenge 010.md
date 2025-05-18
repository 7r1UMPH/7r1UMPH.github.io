# 1. 初步分析

**挑战链接:** https://hackmyvm.eu/challenges/challenge.php?c=010

![挑战图片](https://7r1UMPH.top/image/20250518105910057.webp)

## 1. 初步分析

挑战页面直接显示了一串看起来经过编码的字符串：

```
853-3GB.eOG[ko/A7oS$FF=
```

这串字符包含了大小写字母、数字以及一些特殊符号 (`-`, `.`, `[`, `]`, `/`, `$`, `=`)。这种字符集通常暗示了某种 Base 编码，特别是字符种类比 Base64 更广，因此可以初步怀疑是 Base85 或其变种。

## 2. 解码过程

为了解开这个字符串，我们需要识别其编码方式并使用相应的工具进行解码。

### 2.1 编码分析与工具选择

观察字符串 `853-3GB.eOG[ko/A7oS$FF=` 的特征：
*   包含数字 (0-9)
*   包含大写字母 (A-Z)
*   包含小写字母 (a-z)
*   包含特殊符号 (`-`, `.`, `[`, `]`, `/`, `$`, `=`)

这种广泛的字符集，尤其是特殊符号的出现，强烈指向了 Base85 (也称为 Ascii85) 编码。

CyberChef 是一个非常强大的在线编解码工具，支持多种编码格式，非常适合用于尝试解码此类字符串。

### 2.2 使用 CyberChef 进行解码

我们将字符串粘贴到 CyberChef 中，并应用 "From Base85" 操作。

1.  打开 CyberChef。
2.  将输入字符串 `853-3GB.eOG[ko/A7oS$FF=` 粘贴到 "Input" 框中。
3.  在 "Operations" 列表中搜索 "From Base85" 并将其拖拽到 "Recipe" 区域。

CyberChef 的操作界面和结果如下：

![CyberChef 解码 Base85](https://7r1UMPH.top/image/20250518105917695.webp)

解码后的输出即为 Flag。

## 3. Flag

从 CyberChef 的解码结果中，我们获得了最终的 Flag：

```
HMV{wrtzxcvfdghyt}
```


标签: hackmyvm靶场
