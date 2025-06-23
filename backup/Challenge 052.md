![image-20250622182158981](https://7r1umph.top/image/20250622182159297.webp)

下载

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ unzip 052.zip                                                            
Archive:  052.zip
 extracting: 052.png                 
  inflating: 052.txt                 
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat 052.txt 
Good morning agent X,
You have been selected for another important mission.
You need to locate a persons flight and the airport were he arrived.
We were able to get the date from his cellphone, but it appears encrypted with some sofisticated technique,
Have a great hunt agent X,
Sh4dowExe

RCdgQV4/XVxJO3tGV1Z3UzRRdHIwYG9vSmw3WiInRERCQkFSYWFfdSl5W1p2b3RtM3FTaS9tbGVNaWhhJ2VeY1wiIV9eQFxbVFN3VzlPTk1McEpPSGxGS0RDZypAZD49QjtAPzhcNjU0WDgxNjU0MyxQKilNbm0lSUg1

P.S.
We, also, were able to retrieve this:
6tmc`F^ZgDA8*0&i%-!lFWbX7EZf1:+ELt4F)N1CATVs2%178mA8*/sASl@'+Cf>1DKU&8+Cf>-+D5_'DBNP&EdD:J%16TYAKYf'+C\c$FD5<(+CfG7A7]RoASuU$+Co1/Eb0?5D_;

I’m sure that with your capabilities you can solve it.                                                                                                                                                                                   
```

```
RCdgQV4/XVxJO3tGV1Z3UzRRdHIwYG9vSmw3WiInRERCQkFSYWFfdSl5W1p2b3RtM3FTaS9tbGVNaWhhJ2VeY1wiIV9eQFxbVFN3VzlPTk1McEpPSGxGS0RDZypAZD49QjtAPzhcNjU0WDgxNjU0MyxQKilNbm0lSUg1
```

暂时看不出来是什么，我试了下XOR，无果

然后就尝试附件

```
6tmc`F^ZgDA8*0&i%-!lFWbX7EZf1:+ELt4F)N1CATVs2%178mA8*/sASl@'+Cf>1DKU&8+Cf>-+D5_'DBNP&EdD:J%16TYAKYf'+C\c$FD5<(+CfG7A7]RoASuU$+Co1/Eb0?5D_;
```

是base85

![image-20250622205039316](https://7r1umph.top/image/20250622205039860.webp)

```
在这边，在那边，在那阴森的岩石上，
我看见长着角的魔鬼，手里拿着巨大的鞭子，
在后面残忍地鞭打着他们。
```

这段文字出自但丁的《神曲》中的《地狱篇》，具体是第十八篇的几行诗句。

后面扒拉了很久

然后终于发现了
```
RCdgQV4/XVxJO3tGV1Z3UzRRdHIwYG9vSmw3WiInRERCQkFSYWFfdSl5W1p2b3RtM3FTaS9tbGVNaWhhJ2VeY1wiIV9eQFxbVFN3VzlPTk1McEpPSGxGS0RDZypAZD49QjtAPzhcNjU0WDgxNjU0MyxQKilNbm0lSUg1
```

是base64
解出

```
D'`A^?]\I;{FWVwS4Qtr0`ooJl7Z"'DDBBARaa_u)y[Zvotm3qSi/mleMiha'e^c\"!_^@\[TSwW9ONMLpJOHlFKDCg*@d>=B;@?8\654X816543,P*)Mnm%IH5
```

然后搜索dante's inferno cipher（从附件中得知的信息）

你能找到这篇文章
https://bitvijays.github.io/Series_Capture_The_Flag/LFC-Cryptography.html#esoteric-programming-language
![image-20250622210908861](https://7r1umph.top/image/20250622210909127.webp)

![image-20250622210925792](https://7r1umph.top/image/20250622210926182.webp)

所以我搜索了一下这种编程

https://malbolge.doleczek.pl/

找到这个

一运行

![image-20250622211002462](https://7r1umph.top/image/20250622211002853.webp)

```
10:11:2023:14:00
```

得到一个时间

然后就往前推了，找那个图片的信息

![052](https://7r1umph.top/image/20250622211439549.webp)

勉强恢复了一下

直接google无果

看能不能通过时间反推吧

(尝试了很久，没有结果，暂时搁置)
