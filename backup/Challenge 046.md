暂时没事干，刷一下挑战

![image-20250621073717593](https://7r1umph.top/image/20250621073717886.webp)

下载

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ unzip 046.zip         
Archive:  046.zip
  inflating: 046.txt                 
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat -A 046.txt 
x=W0oyRmlZMlJsWm1kb2FXcHJiRzF1YjNCeGNuTjBkWFozZUhsNlFVSkRSRVZHUjBoSlNrdE1UVTVQVUZGU1UxUlZWbGRZV1ZvbklDZDZlWGgzZG5WMGMzSnhjRzl1Yld4cm;y=FtbG9aMlpsWkdOaVlWcFpXRmRXVlZSVFVsRlFUMDVOVEV0S1NVaEhSa1ZFUTBKQkp3bz0sIEhWMUR2M1FvQjNFYngyb2V5bTBQXQo=;x+y^M$
^M$
^M$
^M$
^M$
```

目测是base64

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ echo -n "W0oyRmlZMlJsWm1kb2FXcHJiRzF1YjNCeGNuTjBkWFozZUhsNlFVSkRSRVZHUjBoSlNrdE1UVTVQVUZGU1UxUlZWbGRZV1ZvbklDZDZlWGgzZG5WMGMzSnhjRzl1Yld4cm" | wc -c
130
          
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ echo -n "FtbG9aMlpsWkdOaVlWcFpXRmRXVlZSVFVsRlFUMDVOVEV0S1NVaEhSa1ZFUTBKQkp3bz0sIEhWMUR2M1FvQjNFYngyb2V5bTBQXQo=" | wc -c                            
102
 
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ echo -n "W0oyRmlZMlJsWm1kb2FXcHJiRzF1YjNCeGNuTjBkWFozZUhsNlFVSkRSRVZHUjBoSlNrdE1UVTVQVUZGU1UxUlZWbGRZV1ZvbklDZDZlWGgzZG5WMGMzSnhjRzl1Yld4cmFtbG9aMlpsWkdOaVlWcFpXRmRXVlZSVFVsRlFUMDVOVEV0S1NVaEhSa1ZFUTBKQkp3bz0sIEhWMUR2M1FvQjNFYngyb2V5bTBQXQo=" | base64 -d
[J2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonICd6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYVpZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBJwo=, HV1Dv3QoB3Ebx2oeym0P]
  
```

J2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonICd6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYVpZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBJwo=

HV1Dv3QoB3Ebx2oeym0P

先解第一段

```然后有点抽象
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ echo -n "J2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonICd6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYVpZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBJwo=" | base64 -d 
'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' 'zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA'
```

这明显是一个 **字符映射表**，也就是用于 **简单替换加密**的

左边是明文字符集（小写+大写）：

```
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
```

右边是对应的密文字符映射（即：倒序）：

```
zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA
```

换句话说，这是一个 **Atbash Cipher**

那你可以直接拿去CyberChef了

![image-20250621123721248](https://7r1umph.top/image/20250621123721628.webp)

这样就出flag了

```
HMV{recursion}
```

