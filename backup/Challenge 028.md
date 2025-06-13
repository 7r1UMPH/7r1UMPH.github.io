![](https://7r1umph.top/image/202506121923186.webp)

下载

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ll 028.zip
-rwxr-xr-x 1 kali kali 1967 Jun 12 07:23 028.zip
             
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ unzip 028.zip 
Archive:  028.zip
  inflating: 028.wav                 
                                           
```

听了一下，是摩斯密码

找工具

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ git clone https://github.com/Ling-Ink/MorseAudioDecoder.git
Cloning into 'MorseAudioDecoder'...
remote: Enumerating objects: 28, done.
remote: Counting objects: 100% (28/28), done.
remote: Compressing objects: 100% (22/22), done.
remote: Total 28 (delta 5), reused 27 (delta 4), pack-reused 0 (from 0)
Receiving objects: 100% (28/28), 606.49 KiB | 416.00 KiB/s, done.
Resolving deltas: 100% (5/5), done.
                                                                                         
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cd MorseAudioDecoder 
                                                                                           
┌──(kali㉿kali)-[/mnt/hgfs/gx/MorseAudioDecoder]
└─$ python3 main.py ../028.wav 
_wave_params(nchannels=1, sampwidth=1, framerate=8000, nframes=345520, comptype='NONE', compname='not compressed')
wave avg: 24500
Drawing Morse Image: 100%|████████████████████████████████████████████████████████████████████████████████████████████████████████████| 172760/172760 [00:00<00:00, 3670573.72it/s]
morse block avg: 7.958333333333333
morse blank avg: 4.034722222222222
Morse Result: -/-/-/--/----/-/--/-----/-/-----/--/-/-/--/----/-/-/---/-/--/-/---/----/-/--/-/-/-/--/-/-/--/--/--/-/----/---/-/--/-/----/-/---/--/--/-/---/--/--/-/--/-/-/---/-/----/-/--/-/--/-/-/-/--/-/---/----/-/---/--/--/-/---/--.
Traceback (most recent call last):
  File "/mnt/hgfs/gx/MorseAudioDecoder/main.py", line 120, in <module>
    plain_text += morse_dict[morse]
                  ~~~~~~~~~~^^^^^^^
KeyError: '----'
                                          
```

寄

去其他地方扒拉一下

https://morsecode.world/international/decoder/audio-decoder-adaptive.html

我快滴滴答傻了

![image-20250612210103780](https://7r1umph.top/image/202506122101105.webp)

```
ETTTETEEETTETEEEETTEEEETETTTETEEETTTEETTETTEETEEETTETTTTETTTETETETTEEETEETTETTEEETTEETETETTEETETETTETTTEETTEEETTETTETTTTETTEETEEETTEETETETTEETEE
```

解密

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat tmp.txt                                
ETTTETEEETTETEEEETTEEEETETTTETEEETTTEETTETTEETEEETTETTTTETTTETETETTEEETEETTETTEEETTEETETETTEETETETTETTTEETTEEETTETTETTTTETTEETEEETTEETETETTEETEE
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat tmp.txt | sed 's/E/0/g' | sed 's/T/1/g'
011101000110100001100001011101000111001101100100011011110111010101100010011011000110010101100101011011100110001101101111011001000110010101100100
```

![image-20250612210203140](https://7r1umph.top/image/202506122102548.webp)

```
HMV{thatsdoubleencoded}
```

