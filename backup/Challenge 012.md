# Challenge 012

# Challenge 012

**挑战链接:** https://hackmyvm.eu/challenges/challenge.php?c=012

![挑战图片](https://7r1UMPH.top/image/20250518110545680.webp)

## 1. 初步分析

下载文件

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ll 012.zip 012.mp3 
-rwxr-xr-x 1 kali kali 17286 Mar  6  2022 012.mp3
-rwxr-xr-x 1 kali kali 16978 May 17 23:06 012.zip
```
首先尝试直接解压 `012.zip` 文件，解压出`012.mp3`
### 2 音频内容分析

通过播放 `012.mp3` 文件并仔细听取其内容。音频中说出的英文短语是：

"I love languages"

## 4. Flag

最终的 Flag 是：

```
HMV{Ilovelanguages}
```


标签: hackmyvm靶场
