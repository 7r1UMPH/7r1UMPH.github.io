![image-20250613233326180](https://7r1umph.top/image/20250613233326526.webp)

```
Help us to decrypt this message: 'Hx Rgjf. H fo 92gm 9p7 C6lnpb3lrp2ax7 sjcf. R7rt qk 1gtw p87 ha81oqjc: MOO{r2w_sh_qbm_f89_mrs5} 9p3pc xtw oojy 235j 8nw ehxlar2ap9 tx, K ayhe dwmt itjumsgn wik d7ds t83glam6!' Unfortunately we only have one clear text message: 'Hi John. I am from the Administrative team. We have just received your request to change your password, it will reach you in a few minutes. Thank you very much for contacting us, I hope your question has been resolved!'


翻译：
帮助我们解密这条消息：“Hx Rgjf. H fo 92gm 9p7 C6lnpb3lrp2ax7 sjcf. R7rt qk 1gtw p87 ha81oqjc: MOO{r2w_sh_qbm_f89_mrs5} 9p3pc xtw oojy 235j 8nw ehxlar2ap9 tx, K ayhe dwmt itjumsgn wik d7ds t83glam6！” 很遗憾，我们只有一条明文消息：“嗨，约翰。我是管理团队的。我们刚刚收到您更改密码的请求，几分钟后就会回复您。非常感谢您联系我们，希望您的问题已经得到解决！”
```

看着不像简单的凯撒

```
Hx Rgjf. H fo 92gm 9p7 C6lnpb3lrp2ax7 sjcf. R7rt qk 1gtw p87 ha81oqjc: MOO{r2w_sh_qbm_f89_mrs5} 9p3pc xtw oojy 235j 8nw ehxlar2ap9 tx, K ayhe dwmt itjumsgn wik d7ds t83glam6！
Hi John. I am from the Administrative team. We have just received your request to change your password, it will reach you in a few minutes. Thank you very much for contacting us, I hope your question has been resolved!
```

替换密码，多表替换......试试维吉尼亚吧

https://www.dcode.fr/vigenere-cipher

![image-20250614002540728](https://7r1umph.top/image/20250614002540927.webp)

看看

![image-20250614002725142](https://7r1umph.top/image/20250614002725459.webp)

继续看

![image-20250614002746485](https://7r1umph.top/image/20250614002746748.webp)

先确定字符集

实现密文包含**大写字母和数字**，例如 Hx、92gm、C6lnp

这说明它使用的不是标准的26个字母，而是一个**自定义的扩展Alphabet**

所以它有可能是

ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789

ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890

0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ

1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ

然后你就可以丢去给ai了，问它哪个比较可能，让他算密钥流

```
我有一个维吉纳密码的变体，它在加密时不区分大小写（所有字母都按大写处理）。
我现在需要你通过计算来判断，下面的四个字符集中，哪一个才是正确的？
候选字符集:
ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ
1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
已知信息：
密文片段: Hx Rgjf. H fo 92gm 9p7 C6lnpb3lrp2ax7 sjcf
明文片段: Hi John. I am from the Administrative team
```

(AI算这个玩意很容易幻听，建议最好自己验证一遍)

![image-20250614094651088](https://7r1umph.top/image/20250614094651302.webp)

算出的密钥流是1F9S3SZ63TAS，它完美重复了

![image-20250614094821115](https://7r1umph.top/image/20250614094821350.webp)

```
HMV{h0w_d0_y0u_g37_th15}
```

