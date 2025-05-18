# Challenge 015

# Challenge 015

**挑战链接:** https://hackmyvm.eu/challenges/challenge.php?c=015

![挑战图片](https://7r1umph.top//image/20250518141943225.webp)

## 1. 初步分析

挑战页面显示了一段被 `<pre>` 标签包裹的文本：

```html
<pre> push 7d616579 push 74696874 push 726f7773 push 696d7361 push 7b766d68 </pre>
```

该文本包含一系列 `push` 指令，后跟十六进制数值。`push` 操作通常用于将数据压入栈中，而栈是后进先出 (LIFO) 的数据结构。这意味着最后压入的数据会最先被取出。
这些十六进制数值 `7d616579`, `74696874`, `726f7773`, `696d7361`, `7b766d68` 组合起来构成了 Flag 的某种编码形式。

## 2. 解密过程

为了得到原始 Flag，我们需要将这些十六进制数值转换为 ASCII 字符，并考虑到栈的 LIFO 特性以及数据在内存中的存储方式（通常是小端序，即字节序反转）。

### 2.1 使用 CyberChef 进行快速解码

CyberChef 提供了一种非常便捷的方式来处理这种转换。可以使用以下步骤：

1.  **准备输入数据:**
    将页面上给出的十六进制数值按照它们 `push` 的原始顺序列出，并用空格分隔：
    `7d616579 74696874 726f7773 696d7361 7b766d68`

2.  **在 CyberChef 中配置操作:**
    *   **Input:** 将上述准备好的十六进制字符串粘贴到输入框。
    *   **Recipe:**
        1.  `From Hex` (Delimiter: `Auto`)：此操作会将十六进制字符串转换为对应的字节序列（ASCII 字符）。
        2.  `Reverse` (By: `Character`)：由于栈是 LIFO 的，并且每个 `push` 的多字节数据（如 dword）在内存中通常是小端存储（字节反序），将整个转换后的字符串反转可以一次性处理这两个反转需求。

    CyberChef 的操作界面和结果如下所示：
    
    ![image-20250518142527284](https://7r1umph.top//image/20250518142527578.webp)

    *   **Input:** `7d616579 74696874 726f7773 696d7361 7b766d68`
    *   **Step 1 (From Hex):** 这一步会将输入的十六进制字符串转换为其对应的 ASCII 字符。例如，`7d` 变为 `}`，`61` 变为 `a`，以此类推。由于输入中有空格，CyberChef (Delimiter: Auto) 会将它们视为分隔符，正确处理每个十六进制数。
        中间结果（逻辑上的，CyberChef直接处理）：`yea}thitsworasmihmv{` (注意，这已经是考虑了每个4字节块内部小端序后的结果，但顺序还是原始push的顺序)
    *   **Step 2 (Reverse by Character):** 将上一步得到的整个字符串进行反转。
        `yea}thitsworasmihmv{` 反转后得到 `hmv{asmisworthityea}`

    **Output:** `hmv{asmisworthityea}`

## 3. Flag

最终的 Flag 是：
```
HMV{asmisworthityea}
```
