![image-20250614105743955](https://7r1umph.top/image/20250614105744262.webp)

还是扫街

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ll 037.zip 
-rwxr-xr-x 1 kali kali 6256698 Jun 13 22:57 037.zip
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ unzip 037.zip 
Archive:  037.zip
  inflating: osint.jpg               
             
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ exiftool osint.jpg 
ExifTool Version Number         : 13.25
File Name                       : osint.jpg
Directory                       : .
File Size                       : 6.3 MB
File Modification Date/Time     : 2023:07:17 21:14:46-04:00
File Access Date/Time           : 2025:06:13 22:58:07-04:00
File Inode Change Date/Time     : 2023:07:17 21:14:46-04:00
File Permissions                : -rwxr-xr-x
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
Exif Byte Order                 : Little-endian (Intel, II)
Make                            : Sony
Camera Model Name               : E5823
Orientation                     : Horizontal (normal)
X Resolution                    : 72
Y Resolution                    : 72
Resolution Unit                 : inches
Software                        : 32.2.A.0.253_0_f500
Modify Date                     : 2016:07:25 20:44:46
Y Cb Cr Positioning             : Centered
Exposure Time                   : 1/2000
F Number                        : 2.0
ISO                             : 40
Exif Version                    : 0220
Date/Time Original              : 2016:07:25 20:44:46
Create Date                     : 2016:07:25 20:44:46
Components Configuration        : Y, Cb, Cr, -
Shutter Speed Value             : 1/1992
Exposure Compensation           : 0
Metering Mode                   : Multi-segment
Light Source                    : Unknown
Flash                           : Off, Did not fire
Focal Length                    : 4.2 mm
Soft Skin Effect                : Off
Face Info Offset                : 94
Sony Date Time                  : 2016:07:25 20:44:46
Sony Image Height               : 4160
Sony Image Width                : 5520
Faces Detected                  : 0
Face Info Length                : 26
Meta Version                    : 
Sub Sec Time                    : 461942
Sub Sec Time Original           : 461942
Sub Sec Time Digitized          : 461942
Flashpix Version                : 0100
Color Space                     : sRGB
Exif Image Width                : 5520
Exif Image Height               : 4140
Interoperability Index          : R98 - DCF basic file (sRGB)
Interoperability Version        : 0100
Custom Rendered                 : Normal
Exposure Mode                   : Auto
White Balance                   : Auto
Digital Zoom Ratio              : 1
Scene Capture Type              : Landscape
Subject Distance Range          : Unknown
GPS Version ID                  : 2.2.0.0
GPS Latitude Ref                : North
GPS Longitude Ref               : East
GPS Altitude Ref                : Above Sea Level
GPS Time Stamp                  : 18:44:29
GPS Status                      : Measurement Active
GPS Map Datum                   : WGS-84
GPS Date Stamp                  : 2016:07:25
Compression                     : JPEG (old-style)
Thumbnail Offset                : 21346
Thumbnail Length                : 3982
Image Width                     : 5520
Image Height                    : 4140
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Aperture                        : 2.0
Image Size                      : 5520x4140
Megapixels                      : 22.9
Shutter Speed                   : 1/2000
Create Date                     : 2016:07:25 20:44:46.461942
Date/Time Original              : 2016:07:25 20:44:46.461942
Modify Date                     : 2016:07:25 20:44:46.461942
Thumbnail Image                 : (Binary data 3982 bytes, use -b option to extract)
GPS Altitude                    : 25 m Above Sea Level
GPS Date/Time                   : 2016:07:25 18:44:29Z
GPS Latitude                    : 58 deg 58' 2.87" N
GPS Longitude                   : 18 deg 18' 59.03" E
Focal Length                    : 4.2 mm
GPS Position                    : 58 deg 58' 2.87" N, 18 deg 18' 59.03" E
Light Value                     : 14.3
                      
```

![osint](https://7r1umph.top/image/20250614110003767.webp)

有GPS信息！

将经纬度转换成十进制

https://www.sunearthtools.com/dp/tools/conversion.php?lang=cn

![image-20250614111103736](https://7r1umph.top/image/20250614111103977.webp)

然后我去试不行

后面我尝试添加一点减少一点才成功

正确的是

```
HMV{58.967463,18.316396}
```

