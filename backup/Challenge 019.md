![image-20250612183423004](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/202506121834338.webp)

下载

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ll 019.zip        
-rwxr-xr-x 1 kali kali 276 Jun 12 06:34 019.zip
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ 7z x 019.zip                 

7-Zip 24.09 (x64) : Copyright (c) 1999-2024 Igor Pavlov : 2024-11-29
 64-bit locale=en_US.UTF-8 Threads:128 OPEN_MAX:1024, ASM

Scanning the drive for archives:
1 file, 276 bytes (1 KiB)

Extracting archive: 019.zip
--
Path = 019.zip
Type = zip
Physical Size = 276

Everything is Ok

Size:       588
Compressed: 276
          
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat 019.txt   
▄▄▄▄▄▄▄ ▄▄  ▄ ▄▄▄▄▄▄▄.█ ▄▄▄ █ ▄▀▄ █ █ ▄▄▄ █.█ ███ █ █▄▄█  █ ███ █.█▄▄▄▄▄█ ▄ ▄ ▄ █▄▄▄▄▄█.▄▄▄▄  ▄ ▄▀█▄▄▄  ▄▄▄ ▄.▀▄▀ ▄ ▄ ▄█▄▀ ▄██▀▀ ▄▄. █▄██▄▄███▀▄▄ ▄█ █▄▀▄.▄▄▄▄▄▄▄ ▀▄█▄▀  ▄█ ▄ ▀.█ ▄▄▄ █  ▄▄ ▀▀  ▀▀█▄▀.█ ███ █ █▀▄███ ▀ ▄▀▀ .█▄▄▄▄▄█ █▀ ▀▀▀█▀▄ ▄ ▀                                                                                                                                                          
```

看着像qr码

找规律，最后都有点，过滤一下

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat 019.txt | tr '.' '\n' 
▄▄▄▄▄▄▄ ▄▄  ▄ ▄▄▄▄▄▄▄
█ ▄▄▄ █ ▄▀▄ █ █ ▄▄▄ █
█ ███ █ █▄▄█  █ ███ █
█▄▄▄▄▄█ ▄ ▄ ▄ █▄▄▄▄▄█
▄▄▄▄  ▄ ▄▀█▄▄▄  ▄▄▄ ▄
▀▄▀ ▄ ▄ ▄█▄▀ ▄██▀▀ ▄▄
 █▄██▄▄███▀▄▄ ▄█ █▄▀▄
▄▄▄▄▄▄▄ ▀▄█▄▀  ▄█ ▄ ▀
█ ▄▄▄ █  ▄▄ ▀▀  ▀▀█▄▀
█ ███ █ █▀▄███ ▀ ▄▀▀ 
█▄▄▄▄▄█ █▀ ▀▀▀█▀▄ ▄ ▀                                                                                                                                                                                    
```

草料解一下https://cli.im/deqr/other

![image-20250612183849873](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/202506121838056.webp)

```
HMV{asciiartt}
```

