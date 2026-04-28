![image-20250614100556180](https://7r1umph.top/image/20250614100556493.webp)

找BSSID，先下载

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ll 036.zip                                   
-rwxr-xr-x 1 kali kali 1495216 Jun 13 22:06 036.zip
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ unzip 036.zip 
Archive:  036.zip
 extracting: 036.png                 
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ exiftool 036.png 
ExifTool Version Number         : 13.25
File Name                       : 036.png
Directory                       : .
File Size                       : 1495 kB
File Modification Date/Time     : 2023:08:24 12:20:50-04:00
File Access Date/Time           : 2025:06:13 22:06:26-04:00
File Inode Change Date/Time     : 2023:08:24 12:20:50-04:00
File Permissions                : -rwxr-xr-x
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 1153
Image Height                    : 721
Bit Depth                       : 8
Color Type                      : RGB
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
SRGB Rendering                  : Perceptual
Gamma                           : 2.2
Pixels Per Unit X               : 3779
Pixels Per Unit Y               : 3779
Pixel Units                     : meters
Software                        : Greenshot
Image Size                      : 1153x721
Megapixels                      : 0.831
                
```

看看图

![036](https://7r1umph.top/image/20250614100806952.webp)

google扫街启动

**识别关键标志**

su开头的，然后亚洲肤色，然后

![image-20250614101747240](https://7r1umph.top/image/20250614101747390.webp)

这玩意应该在座的各位大学生都认识吧

阳光在线广场

（给我干的怀疑是在china了）

但是，这里有日文

![image-20250614101905083](https://7r1umph.top/image/20250614101905268.webp)

SunLive（日文：サンリブ）

扫街扫街，一时半会找不到，google搜索一下吧

![image-20250614102419163](https://7r1umph.top/image/20250614102419498.webp)

哈哈，有前辈的wp，我们还是不看了，但是他其他的可能都显示了

![image-20250614103211358](https://7r1umph.top/image/20250614103211803.webp)

大概位置：ココカラファイン薬局もりつね店

找找吧

![image-20250614103315350](https://7r1umph.top/image/20250614103316425.webp)

找到了

![image-20250614103343809](https://7r1umph.top/image/20250614103344081.webp)

这里，然后我们要去找**Wi-Fi数据库**扒拉一下了

用 [wigle.net](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwigle.net%2F)

搜索一下： 1 Chome-11-25 Moritsune, Kokuraminami Ward, Kitakyushu, Fukuoka 802-0972日本
![image-20250614103934917](https://7r1umph.top/image/20250614103935120.webp)

然后需要注册一下，不然啥都用不了

![image-20250614104212731](https://7r1umph.top/image/20250614104212971.webp)

啊这，换个网站

我去，没个可以用的，看看前辈的wp吧

https://sec-fortress.github.io/posts/HackMyVM/posts/036.html

```
HMV{00:3A:9A:7B:5F:40}
```

