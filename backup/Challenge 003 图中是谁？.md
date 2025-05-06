### 挑战信息

*   **挑战名称/编号:** Challenge 003
*   **挑战链接:** [https://hackmyvm.eu/challenges/challenge.php?c=003](https://hackmyvm.eu/challenges/challenge.php?c=003)

### 初始观察

![挑战003界面及问题](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250502150751314.png)

访问挑战页面后，页面显示一个问题 "Who is she?"（她是谁？），并附带了一张人物照片。同时，页面给出了 Flag 的格式要求：`HMV{namelastname}`，并举例 `HMV{johnwick}`。这表明我们需要识别出图片中的人物，并将其姓名按照“名姓”（小写，无空格）的格式填入 Flag 中。

图片内容如下：

![挑战003中的人物图片](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250502150641114.jpg)

### 分析与技术说明

该挑战的核心任务是**通过图像识别特定人物**。这是一个典型的**开源情报（Open Source Intelligence, OSINT）**收集场景，特别是在涉及图像信息时。解决此类问题的常用且有效的技术是**反向图像搜索 (Reverse Image Search)**。

**反向图像搜索**是一种允许用户使用图像作为查询条件来搜索互联网的技术。与输入关键词查找相关文本或图像不同，用户上传一张图片或提供图片的 URL，搜索引擎会查找与该图片相同或视觉上相似的图片，并可能提供关于图片来源、内容以及相关网页的信息。

常用的反向图像搜索服务包括：

*   Google Images (谷歌图片搜索)
*   TinEye
*   Bing Visual Search (必应视觉搜索)
*   Yandex Images

### 求解过程

1. **执行反向搜索:** 我们选择使用 **Google Images** 进行反向搜索。访问 Google Images 网站 ([https://images.google.com/](https://images.google.com/))，点击搜索框中的相机图标（Search by image），然后粘贴图片的 URL 或上传已保存的图片文件。
2. **分析结果:** Google Images 的搜索结果迅速识别出了图片中的人物。

   ![Google图片搜索结果](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250502151052521.png)

   搜索结果明确指出该人物是 **Gata Cattana**。

3. **格式化 Flag:** 根据挑战要求的 `HMV{namelastname}` 格式，我们需要将姓名 "Gata Cattana" 转换为小写并去除空格，得到 `gatacattana`。将其放入 `HMV{}` 中。

### 结果：Flag

最终得到的 Flag 是：

```
HMV{gatacattana}
```
