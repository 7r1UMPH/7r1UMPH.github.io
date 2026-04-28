![image-20250617122237188](https://7r1umph.top/image/20250617122237544.webp)

下载

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ll 045.zip                     
-rwxr-xr-x 1 kali kali 83848 Jun 17 00:22 045.zip
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ unzip 045.zip 
Archive:  045.zip
  inflating: image.png               
     
```

![image](https://7r1umph.top/image/20250617122346695.webp)

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ 7z x 045.zip 

7-Zip 24.09 (x64) : Copyright (c) 1999-2024 Igor Pavlov : 2024-11-29
 64-bit locale=en_US.UTF-8 Threads:128 OPEN_MAX:1024, ASM

Scanning the drive for archives:
1 file, 83848 bytes (82 KiB)

Extracting archive: 045.zip
--
Path = 045.zip
Type = zip
Physical Size = 83848

    
Would you like to replace the existing file:
  Path:     ./image.png
  Size:     79263 bytes (78 KiB)
  Modified: 2023-12-15 11:59:40
with the file from archive:
  Path:     image.png
  Size:     79263 bytes (78 KiB)
  Modified: 2023-12-15 11:59:39
? (Y)es / (N)o / (A)lways / (S)kip all / A(u)to rename all / (Q)uit? Y

Everything is Ok

Size:       79263
Compressed: 83848
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ file 045.zip                                                                                                        
045.zip: Zip archive data, made by v6.3 UNIX, extract using at least v2.0, last modified Dec 15 2023 10:59:40, uncompressed size 79263, method=deflate
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ file image.png  
image.png: PNG image data, 304 x 481, 8-bit/color RGBA, non-interlaced
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ exiftool image.png 
ExifTool Version Number         : 13.25
File Name                       : image.png
Directory                       : .
File Size                       : 79 kB
File Modification Date/Time     : 2023:12:15 10:59:39-05:00
File Access Date/Time           : 2025:06:17 00:24:11-04:00
File Inode Change Date/Time     : 2023:12:15 10:59:39-05:00
File Permissions                : -rwxr-xr-x
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 304
Image Height                    : 481
Bit Depth                       : 8
Color Type                      : RGB with Alpha
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Pixels Per Unit X               : 3780
Pixels Per Unit Y               : 3780
Pixel Units                     : meters
Image Size                      : 304x481
Megapixels                      : 0.146
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ stegseek image.png 
StegSeek 0.6 - https://github.com/RickdeJager/StegSeek

[!] error: the file format of the file "image.png" is not supported.
                                   
```

strings瞄了一下

并且拿binwalk验证一下

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ binwalk 045.zip

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             Zip archive data, at least v2.0 to extract, compressed size: 79069, uncompressed size: 79263, name: image.png
79108         0x13504         PNG image, 400 x 300, 8-bit/color RGBA, non-interlaced
79644         0x1371C         Zlib compressed data, best compression
83826         0x14772         End of Zip archive, footer length: 22

           
```

它塞了点东西

试了一下binwalk不行
```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ binwalk --extract 045.zip

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             Zip archive data, at least v2.0 to extract, compressed size: 79069, uncompressed size: 79263, name: image.png
79644         0x1371C         Zlib compressed data, best compression

WARNING: One or more files failed to extract: either no utility was found or it's unimplemented

                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cd _045.zip.extracted 
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx/_045.zip.extracted]
└─$ ls -al
total 650
drwxr-xr-x 1 kali kali      0 Jun 17 00:44 .
drwxr-xr-x 1 kali kali  16384 Jun 17 00:44 ..
-rwxr-xr-x 1 kali kali  83848 Jun 17 00:44 0.zip
-rwxr-xr-x 1 kali kali 480300 Jun 17 00:44 1371C
-rwxr-xr-x 1 kali kali   4204 Jun 17 00:44 1371C.zlib
-rwxr-xr-x 1 kali kali  79263 Dec 15  2023 image.png
                                      
```

那拿foremost试一下

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ foremost 045.zip       
Processing: 045.zip
���2��HȠm�I��R��u���2k��,��h�2���6m�}:�g�10d����^ܰьo��M�������׶���y�s�y����so�{M�{��(IHH�(��&!!����7�O�R|��;�A���i������D��k�Of�M���
              +)���d���n�+����W�����
*|
           
```

???

重新下一遍

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ foremost 045.zip
ERROR: /mnt/hgfs/gx/output is not empty
        Please specify another directory or run with -T.
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ rm -rf /mnt/hgfs/gx/output
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ foremost 045.zip          
Processing: 045.zip
���2��HȠm�I��R��u���2k��,��h�2���6m�}:�g�10d����^ܰьo��M�������׶���y�s�y����so�{M�{��(IHH�(��&!!����7�O�R|��;�A���i������D��k�Of�M���
              +)���d���n�+����W�����
*|
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cd output 
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx/output]
└─$ ls -al
total 21
drwxr-xr-x 1 kali kali  4096 Jun 17 00:47 .
drwxr-xr-x 1 kali kali 16384 Jun 17 00:47 ..
-rwxr-xr-x 1 kali kali   719 Jun 17 00:47 audit.txt
drwxr-xr-x 1 kali kali     0 Jun 17 00:47 png
drwxr-xr-x 1 kali kali     0 Jun 17 00:47 zip
                                   
```

ok，是我显示的问题

```
┌──(kali㉿kali)-[/mnt/hgfs/gx/output]
└─$ cd png       
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx/output/png]
└─$ ls -al
total 9
drwxr-xr-x 1 kali kali    0 Jun 17 00:47 .
drwxr-xr-x 1 kali kali 4096 Jun 17 00:47 ..
-rwxr-xr-x 1 kali kali 4618 Jun 17 00:47 00000154.png
                                   
```

![00000154](https://7r1umph.top/image/20250617125120923.webp)

```
HMV{undercover}
```

