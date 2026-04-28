## 第一部分：分析 `ezflag` 文件

### 1. 初步文件检查

下载挑战附件，得到名为 `ezflag` 的文件。首先使用 `file` 命令探查其类型：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ file ezflag
ezflag: ASCII text
```

结果显示为 `ASCII text`，这有些出乎意料，因为CTF中的flag相关文件通常是二进制、直接包含flag文本，或者需要特定工具打开的格式。既然是文本文件，我们用 `cat` 命令查看其内容：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat ezflag
$timescale 1 us $end
$var wire 1 ! 0 $end
$var wire 1 " 1 $end
$upscope $end
$enddefinitions $end
#0  1! 0"
#792  0!
#810  1!
#826  0!
#844  1!
#862  0!
#870  1!
#880  0!
#906  1!
#922  0!
#932  1!
#948  0!
#958  1!
#966  0!
#974  1!
#984  0!
#1018  1!
#1036  0!
#1044  1!
#1052  0!
#1062  1!
#1088  0!
#1104  1!
#1122  0!
#1132  1!
#1140  0!
#1148  1!
#1166  0!
#1174  1!
#1210  0!
#1218  1!
#1226  0!
#1236  1!
#1244  0!
#1262  1!
#1296  0!
#1304  1!
#1314  0!
#1356  1!
#1374  0!
#1392  1!
#1400  0!
#1410  1!
#1418  0!
#1426  1!
#1436  0!
#1444  1!
#1470  0!
#1478  1!
#1488  0!
#1496  1!
#1540  0!
#1548  1!
#1556  0!
#1566  1!
#1574  0!
#1600  1!
#1608  0!
#1618  1!
#1636  0!
#1652  1!
#1662  0!
#1678  1!
#1688  0!
#1704  1!
#1730  0!
#1740  1!
#1748  0!
#1756  1!
#1774  0!
#1792  1!
#1808  0!
#1826  1!
#1834  0!
#1844  1!
#1888  0!
#1896  1!
#1904  0!
#1914  1!
#1922  0!
#1940  1!
#1948  0!
#1966  1!
#1992  0!
#2000  1!
#2008  0!
#2018  1!
#2034  0!
#2052  1!
#2070  0!
#2086  1!
#2096  0!
#2122  1!
#2130  0!
#2140  1!
#2156  0!
#2174  1!
#2182  0!
#2192  1!
#2200  0!
#2226  1!
#2244  0!
#2260  1!
#2270  0!
#2278  1!
#2286  0!
#2312  1!
#2330  0!
#2348  1!
#2356  0!
#2364  1!
#2374  0!
#2392  1!
#2426  0!
#2434  1!
#2444  0!
#2452  1!
#2496  0!
#2504  1!
#2512  0!
#2522  1!
#2530  0!
#2548  1!
#2564  0!
#2574  1!
#2590  0!
#2608  1!
#2616  0!
#2660  1!
#2678  0!
#2696  1!
#2704  0!
#2748  1!
#2764  0!
#2782  1!
#2790  0!
#2816  1!
#2826  0!
#2842  1!
#2860  0!
#2868  1!
#2878  0!
#2886  1!
#2930  0!
#2938  1!
#2948  0!
#2956  1!
#2964  0!
#2990  1!
#3000  0!
#3008  1!
#3026  0!
#3042  1!
#3052  0!
#3060  1!
#3086  0!
#3094  1!
#3112  0!
#3130  1!
#3138  0!
#3148  1!
#3190  0!
#3200  1!
#3208  0!
#3216  1!
#3226  0!
#3234  1!
#3242  0!
#3268  1!
#3286  0!
#3304  1!
#3312  0!
#3356  1!
#3372  0!
#3390  1!
#3400  0!
#3416  1!
#3434  0!
#3442  1!
#3460  0!
#3478  1!
#3486  0!
#3494  1!
#3504  0!
#3530  1!
#3546  0!
#3564  1!
#3572  0!
#3582  1!
#3598  0!
#3624  1!
#3642  0!
#3652  1!
#3660  0!
#3668  1!
#3712  0!
#3720  1!
#3730  0!
#3738  1!
#3746  0!
#3772  1!
#3782  0!
#3790  1!
#3808  0!
#3824  1!
#3834  0!
#3850  1!
#3878  0!
#3886  1!
#3904  0!
#3912  1!
#3920  0!
#3946  1!
#3956  0!
#3964  1!
#3982  0!
#3998  1!
#4008  0!
#4016  1!
#4024  0!
#4050  1!
#4068  0!
#4086  1!
#4094  0!
#4102  1!
#4112  0!
#4130  1!
#4164  0!
#4172  1!
#4182  0!
#4190  1!
#4198  0!
#4208  1!
#4216  0!
#4224  1!
#4242  0!
#4260  1!
#4268  0!
#4276  1!
#4286  0!
#4312  1!
#4328  0!
#4346  1!
#4354  0!
#4364  1!
#4372  0!
#4380  1!
#4390  0!
#4398  1!
#4416  0!
#4434  1!
#4442  0!
#4450  1!
#4460  0!
#4494  1!
#4502  0!
#4520  1!
#4528  0!
#4538  1!
#4546  0!
#4554  1!
#4598  0!
#4606  1!
#4616  0!
#4634  1!
#4642  0!
#4650  1!
#4660  0!
#4694  1!
#5654
```

### 2. 理解文件内容与格式识别

文件内容包含以 `$` 开头的声明和以 `#` 开头的时间戳及信号值变化。这强烈暗示了一种记录数字电路仿真或逻辑分析仪捕获数据的格式。

#### 头部信息：

-   `$timescale 1 us $end`: 定义时间单位为 1 微秒 (µs)。
-   `$var wire 1 ! 0 $end`: 定义一个名为 `0` 的1位 `wire` (导线) 信号，其内部标识符为 `!`。
-   `$var wire 1 " 1 $end`: 定义一个名为 `1` (注意前面有空格) 的1位 `wire` 信号，其内部标识符为 `"`。
-   `$upscope $end` 和 `$enddefinitions $end`: VCD 文件的标准结构。

#### 信号数据：

-   `#<时间戳>`: 表示在该时间点发生信号变化。
-   例如，`#0 1! 0"`: 在时间 0µs，信号 `!` (即信号 `0`) 变为 `1`，信号 `"` (即信号 `1`) 变为 `0`。
-   后续如 `#792 0!` 表示信号 `!` (信号 `0`) 变为 `0`，信号 `"` (信号 `1`) 状态保持不变，直到下一次显式更新。

通过这些特征，可以判断该文件是 **VCD (Value Change Dump)** 格式。这种文件常用于记录数字逻辑信号随时间变化的情况。

### 3. 使用 PulseView 解码

对于 VCD 文件，可以使用逻辑分析软件 PulseView (sigrok 套件的一部分) 进行可视化分析和解码。

#### 步骤一：导入数据到 PulseView

1.  启动 PulseView。
2.  通过 "File" -> "Open" (或拖拽) 打开 `ezflag` 文件。PulseView 通常能自动识别 VCD 格式。如果遇到识别问题，可尝试将文件后缀改为 `.vcd`。

#### 步骤二：分析波形并添加 UART 解码器

导入后，会看到两个信号通道，对应 VCD 文件中定义的信号 `0` (标识符 `!`) 和信号 `1` (标识符 `"`）。在 PulseView 中可能显示为 D0, D1 等。

1.  **观察波形特征：**
    仔细观察信号 `!` (在 PulseView 中可能是 D0) 的波形。它在 `#0` 时刻初始值为 `1`，之后随时间发生 `0` 和 `1` 的跳变。这种空闲时高电平 (或低电平)，数据传输时出现一系列电平快速切换的模式，非常符合**异步串行通信 (UART)** 的特征。
    *   根据 `#0 1! 0"`，信号 `!` (我们关注的 D0) 初始为 1，信号 `"` 初始为 0。后续数据主要改变的是 `!` 的状态。因此，信号 `!` 极有可能是 UART 的数据线 (TX/RX)。

2.  **添加 UART 解码器：**
    *   点击 PulseView 工具栏上的 "Add Decoder" 图标。
    *   在解码器列表中搜索并添加 "UART"。

#### 步骤三：配置 UART 解码器

这是解码成功的关键步骤。

1.  **映射信号线：**
    *   将 UART 解码器的 "TX" (或 "RX") 引脚连接到我们认为是数据线的通道，即代表信号 `!` (VCD 文件中的 `0`，PulseView 中的 D0) 的通道。

2.  **确定波特率 (Baud Rate)：**
    *   波特率是 UART 通信的核心参数。可以从常见的波特率开始尝试，如 9600, 19200, 38400, 57600, 115200 bps。
    *   在 PulseView 中修改解码器的波特率设置，解码结果会实时更新。通过观察解码输出是否为可读字符或有意义的数据来判断波特率是否正确。
    *   经过尝试，当波特率设置为 **115200 bps** 时，解码器输出了一串清晰的 ASCII 字符序列，并且没有错误帧。

3.  **其他参数（数据位、校验位、停止位）：**
    *   UART 通信最常见的配置是 **8 个数据位 (Data bits: 8)**，**无校验 (Parity: None)**，**1 个停止位 (Stop bits: 1)**，通常表示为 8N1。
    *   使用 115200 bps 波特率和 8N1 配置，解码结果良好。

#### 步骤四：查看解码结果

正确配置后，PulseView 会在波形下方显示解码出的数据。
![image-20250526134540784](https://7r1umph.top/image/20250526134541010.webp)

将解码字符拼接，得到 Flag：
`flag{y0u_4r3_r3411y_600d_47_1061c_4n41y515!}`

## 第二部分：分析 `ezelectron` 应用

下载并解压 `ezelectron-1.1.0-amd64-linux.zip` 压缩包，解压查看其目录结构：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cd ezelectron
┌──(kali㉿kali)-[/mnt/hgfs/gx/ezelectron]
└─$ ll
total 242645
drwxr-xr-x 1 kali kali      4096 May 26 00:12 .
drwxr-xr-x 1 kali kali     12288 May 26 01:57 ..
-rwxr-xr-x 1 kali kali    147640 May 25 16:22 chrome_100_percent.pak
-rwxr-xr-x 1 kali kali 196984632 May 25 16:22 ezelectron
drwxr-xr-x 1 kali kali      4096 May 26 00:33 resources
```

运行应用，可以看到启动界面：
![1748239128506](https://7r1umph.top/image/20250526135851284.webp)

界面左侧是 Vite.js (前端构建工具) 的 Logo，右侧是 Vue.js (JavaScript 前端框架) 的 Logo。这表明该应用是使用 Electron 框架，并结合 Vite 和 Vue.js 开发的。

### 方法一：通过修改主进程脚本启用开发者工具 (预期解)

对于 Electron 应用，一个常见的调试和分析入口是其内置的开发者工具。我们可以通过修改应用的主进程脚本来默认启动它。

#### 1. 解包 `app.asar`：

Electron 应用的核心逻辑通常打包在 `resources/app.asar` 文件中。`asar` 是一种归档格式。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/ezelectron]
└─$ npm install -g asar
┌──(kali㉿kali)-[/mnt/hgfs/gx/ezelectron]
└─$ cd resources
┌──(kali㉿kali)-[/mnt/hgfs/gx/ezelectron/resources]
└─$ ls -al
total 14348
drwxr-xr-x 1 kali kali        0 May 25 16:22 .
drwxr-xr-x 1 kali kali     4096 May 26 01:59 ..
-rwxr-xr-x 1 kali kali 14687457 May 25 16:22 app.asar
-rwxr-xr-x 1 kali kali       95 May 25 16:22 app-update.yml
┌──(kali㉿kali)-[/mnt/hgfs/gx/ezelectron/resources]
└─$ asar extract app.asar app_unpacked
```

#### 2. 修改主进程脚本：

解包后，在 `app_unpacked` 目录中找到主进程脚本。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/ezelectron/resources]
└─$ cd app_unpacked
┌──(kali㉿kali)-[/mnt/…/gx/ezelectron/resources/app_unpacked]
└─$ ll
total 6
drwxr-xr-x 1 kali kali    0 May 26 02:02 .
drwxr-xr-x 1 kali kali    0 May 26 02:02 ..
drwxr-xr-x 1 kali kali    0 May 26 02:02 dist
- rwxr-xr-x 1 kali kali 1434 May 26 02:02 main.min.js
drwxr-xr-x 1 kali kali 4096 May 26 02:02 node_modules
- rwxr-xr-x 1 kali kali  187 May 26 02:02 package.json
```

使用 `js-beautify`美化 `main.min.js` 以便于阅读和修改：

```bash
┌──(kali㉿kali)-[/mnt/…/gx/ezelectron/resources/app_unpacked]
└─$ js-beautify main.min.js > main.beautified.js
```

编辑 `main.beautified.js`。在窗口显示 (`win.show()`) 之前/之后，添加以下代码以打开开发者工具：

```javascript
win.webContents.openDevTools();
```

![image-20250526140406708](https://7r1umph.top/image/20250526140406895.webp)

保存修改，并将美化后的文件重命名回 `main.min.js` (如果修改的是美化版)。

```bash
┌──(kali㉿kali)-[/mnt/…/gx/ezelectron/resources/app_unpacked]
└─$ mv main.min.js main.min.js.bak
┌──(kali㉿kali)-[/mnt/…/gx/ezelectron/resources/app_unpacked]
└─$ mv main.beautified.js main.min.js
```

#### 3. 重新打包并运行：

返回 `resources` 目录，将修改后的 `app_unpacked` 目录重新打包为 `app.asar`。

```bash
┌──(kali㉿kali)-[/mnt/…/gx/ezelectron/resources/app_unpacked]
└─$ cd .. 
┌──(kali㉿kali)-[/mnt/hgfs/gx/ezelectron/resources]
└─$ mv app.asar app.asar.bak
┌──(kali㉿kali)-[/mnt/hgfs/gx/ezelectron/resources]
└─$ asar pack app_unpacked app.asar
```

现在，返回上层目录并运行修改后的 `ezelectron` 应用：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/ezelectron/resources]
└─$ cd ..
┌──(kali㉿kali)-[/mnt/hgfs/gx/ezelectron]
└─$ ./ezelectron
```

应用启动时，开发者工具会自动打开。在 元素 标签页中检查 HTML 结构。注意到 Vue Logo (`class="logo vue"`) 的 `<img>` 标签，其 `alt` 属性包含 Flag。
![image-20250526140951570](https://7r1umph.top/image/20250526140951753.webp)

Flag: `HMV{h3ll0_fr0m_3l3c7r0n}`

### 方法二：逆向分析渲染进程 JavaScript

此方法不依赖修改主进程，而是直接分析渲染进程加载的 JavaScript 代码。

#### 1. 定位渲染进程脚本：

在之前解包的 `app_unpacked/dist/` 目录下，可以找到 `index.html`。

```bash
┌──(kali㉿kali)-[/mnt/…/ezelectron/resources/app_unpacked/dist]
└─$ cat index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ezelectron</title>
    <script type="module" crossorigin src="./assets/index-CyqsCDPp.js"></script> 
    <link rel="stylesheet" crossorigin href="./assets/index-FMFiDxpK.css">
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

主要的前端逻辑位于 `assets/index-CyqsCDPp.js`。

#### 2. 美化并分析脚本：

该脚本是混淆过的。使用 `js-beautify` 进行美化：

```bash
┌──(kali㉿kali)-[/mnt/…/resources/app_unpacked/dist/assets]
└─$ js-beautify index-CyqsCDPp.js > index.beautified.js
```

打开 `index.beautified.js` 进行分析。

#### 3. 理解代码混淆与定位关键逻辑：

*   **字符串混淆：** 代码中存在一个大型字符串数组和一个解密/引用函数。
*   **变量名混淆：** 变量和函数名被替换为如 `a0_0x...` 或 `_0x...` 的形式。
*   **定位Vue组件：** 寻找 Vue 组件定义，通常是一个包含 `setup` 函数的对象。在本例中，对象 `a0_0x508586` 是一个 Vue 组件。
*   在其 `setup` 函数 (`_0x57c87a`) 中，注意到一个名为 `_0x8d8f10` 的内部函数。此函数接收两个数组 (`_0x1c013b` 和 `_0x76c466`) 作为输入，并进行了一系列操作来生成一个字符串。这个生成的字符串最终被设置为 Vue logo 图片的 `alt` 属性。

#### 4. 逆向 Flag 生成算法：

关键代码段如下:

```javascript
_0x1c013b = [
    省略
];
_0x76c466 = [省略 ];
function _0x8d8f10(_0x3816d4, _0xb6046) { 
    return _0x3816d4.flat() 
        .map((_0x39abff, _0x27f950) => 
            String.fromCharCode(
                (_0x39abff ^ _0xb6046[_0x27f950 % _0xb6046.length]) 
                - (0x1ba * -0x10 + -0xd3f * -0x2 + 0x123) 
            )
        )
        .join(''); 
}
```

#### 5. 计算数组值并编写解密脚本：

首先，计算 `_0x1c013b` 和 `_0x76c466` 的实际数值。可以在浏览器控制台环境中执行这些数学表达式。

```javascript
const _0x1c013b = [
[-0x13 * -0x56 + 0x26ca + -0x2d13, -0x214e + 0x1ed4 + 0x6b * 0x7, -0x1bfc + 0x5 * -0xa1 + 0x1f35, 0x259 * -0xb + -0x203a + 0x1 * 0x3a8a, 0x1d8b + -0x1 * -0x1646 + 0x4b2 * -0xb, 0x1580 + -0x1f67 + -0xa3d * -0x1, 0x125d + 0x1440 + -0x59 * 0x6f, -0x104b * -0x1 + -0x5 * -0x83 + -0x12b5, 0x1ba8 + 0x9 * -0x2a9 + 0x7 * -0x7a, 0x21f * 0x11 + -0x1 * -0x1495 + -0x3847],
[-0x2501 * -0x1 + 0x1 * -0x255d + 0x80, 0x1 * 0x12b6 + -0x5a * 0x18 + -0x9d4, 0x1cf5 + -0x151d * 0x1 + -0x765, 0x11 * -0x143 + 0x6cc + -0x47 * -0x35, 0x2 * 0x900 + 0x23 * 0xf + 0x1 * -0x1402, 0x1 * 0x148b + -0x1b52 + 0x743, -0x8b9 + -0x1060 + -0x11a * -0x17, 0x7 * -0xf1 + 0x854 + -0x1b4, -0x1 * 0x75f + 0x16 * -0x76 + -0x286 * -0x7],
[-0xaee + 0xdc3 + 0x4 * -0xa7, -0x23d4 + -0xb2f + 0x2f34, -0x1 * 0x198e + -0xb64 + 0xcb * 0x2f, -0x22a6 * -0x1 + 0xe5e + -0x3100, 0x893 + 0x1 * 0x779 + 0x1 * -0xfd6]
];
console.log("_0x1c013b:", _0x1c013b);
const _0x76c466 = [0x1fda + -0x82e + 0xd * -0x1cc, 0x8a1 + -0x2 * -0x416 + 0x5 * -0x350, 0xcc * -0x19 + -0x1bf0 + -0x301f * -0x1, 0x1f29 + 0xf50 + -0x173c * 0x2, -0xdea * -0x1 + -0x2316 + 0xd * 0x1a6, -0x1c4c + 0x19dc + 0x1 * 0x2d2, 0x206e + 0x9 * 0x31 + -0xfe * 0x22, -0x1683 + -0x835 + 0x1f00];
console.log("_0x76c466:", _0x76c466);
```

运行此脚本：

```
_0x1c013b:
[
[
25,
115,
20,
125,
43,
86,
6,
37,
97,
93
],
[
36,
114,
115,
12,
11,
124,
61,
9,
39
],
[
57,
49,
83,
4,
54
]
]
_0x76c466:
[
80,
61,
67,
1,
66,
98,
107,
72
]
```

然后解

```
const a = [
    [25, 115, 20, 125, 43, 86, 6, 37, 97, 93],
    [36, 114, 115, 12, 11, 124, 61, 9, 39],
    [57, 49, 83, 4, 54]
];
const b = [80, 61, 67, 1, 66, 98, 107, 72];
const c = a.flat();
function decode(d, e) {
    let f = '';
    for (let g = 0; g < d.length; g++) {
        const h = g % e.length;
        const i = (d[g] ^ e[h]) - 1;
        f += String.fromCharCode(i);
    }
    return f;
}
const flag = decode(c, b);
console.log(flag);
```

![image-20250526141745643](https://7r1umph.top/image/20250526141745824.webp)

Flag: `HMV{h3ll0_fr0m_3l3c7r0n}`

