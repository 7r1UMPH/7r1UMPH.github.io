### 挑战信息

*   **挑战名称/编号:** Challenge 005
*   **挑战链接:** [https://hackmyvm.eu/challenges/challenge.php?c=005](https://hackmyvm.eu/challenges/challenge.php?c=005)

### 初始观察

![image-20250502152010221](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250502152010304.png)

访问挑战页面后，描述告知我们获取了一个目标机器的 `/etc/shadow` 文件，但无法破解其中的 `root` 用户密码。挑战要求我们找出 `root` 用户的密码，并以 `HMV{rootpassword}` 的格式提交 Flag。

页面提供了一个名为 `shadow.txt` 的文件供下载。

### 分析与技术说明

**1. `/etc/shadow` 文件:**
在 Linux 和类 Unix 系统中，`/etc/shadow` 文件用于安全地存储用户的密码信息。与早期的 `/etc/passwd` 文件（所有用户可读）不同，`/etc/shadow` 文件通常只有 `root` 用户有读取权限，这大大提高了密码安全性。该文件存储的是用户密码的**哈希值 (Hash)**，而非明文密码。

一个典型的 `/etc/shadow` 文件条目格式如下：
`username:password_hash:last_password_change:min_days:max_days:warn_days:inactive_days:expire_date:reserved`

我们关心的主要是第二个字段：`password_hash`。

**2. 密码哈希:**
密码哈希是一种单向函数处理过程，它将任意长度的密码转换为一个固定长度的、看起来随机的字符串（哈希值）。关键在于这个过程是**不可逆的**，即无法从哈希值直接计算出原始密码。当用户登录时，系统会将其输入的密码进行相同的哈希运算，然后比较计算出的哈希值与存储在 `/etc/shadow` 中的哈希值是否一致。

常见的 Linux 密码哈希算法包括 MD5crypt (`$1$`)、SHA256crypt (`$5$`) 和 SHA512crypt (`$6$`) 等。哈希值字符串开头的 `$id$` 部分标识了所使用的算法。

**3. 密码破解 - 字典攻击:**
由于无法从哈希直接反推密码，破解密码哈希的常用方法之一是**字典攻击 (Dictionary Attack)**。这种方法依赖于一个包含大量常用密码、单词、短语等的列表（称为**字典文件**或**词典**，Wordlist）。破解工具会逐一读取字典中的词语，使用与目标哈希相同的算法计算该词语的哈希值，然后与目标哈希进行比较。如果匹配成功，就意味着找到了原始密码。

**John the Ripper (John)** 是一个非常流行的开源密码破解工具，支持多种哈希类型和攻击模式。`rockyou.txt` 是一个极其著名且庞大的密码字典文件，包含了数百万个从真实数据泄露事件中收集的常用密码，常用于密码安全审计和 CTF 比赛。

### 求解过程

1.  **下载文件:** 从挑战页面下载 `shadow.txt` 文件。
2.  **准备工具和字典:** 确保系统中安装了 `john` (John the Ripper)。同时，需要 `rockyou.txt` 字典文件。在 Kali Linux 等渗透测试发行版中，它通常位于 `/usr/share/wordlists/rockyou.txt.gz`，可能需要先使用 `gzip -d /usr/share/wordlists/rockyou.txt.gz` 命令解压缩。
3.  **执行破解:** 打开终端，使用 `john` 命令进行字典攻击。命令格式如下：
    ```bash
    john --wordlist=<字典文件路径> <shadow文件路径>
    ```
    具体到本例，命令为：
    ```bash
    john --wordlist=/usr/share/wordlists/rockyou.txt shadow.txt
    ```

4.  **分析输出:** `john` 会开始尝试字典中的密码。当找到匹配的密码时，会显示出来。根据提供的解题过程截图，`john` 的输出显示：

    ```
    ┌──(kali㉿kali)-[/mnt/hgfs/gx/test]
    └─$ john --wordlist=/usr/share/wordlists/rockyou.txt shadow.txt
    Created directory: /home/kali/.john
    Using default input encoding: UTF-8
    Loaded 1 password hash (sha512crypt, crypt(3) $6$ [SHA512 512/512 AVX512BW 8x]) 
    Cost 1 (iteration count) is 5000 for all loaded hashes
    Will run 8 OpenMP threads
    Press 'q' or Ctrl-C to abort, almost any other key for status
    reddragon        (root)      # <--- 成功破解！root 用户的密码是 reddragon
    1g 0:00:00:00 DONE (2025-05-02 03:18) 2.439g/s 24975p/s 24975c/s 24975C/s total90..1asshole
    Use the "--show" option to display all of the cracked passwords reliably
    Session completed.
    ```
    输出明确显示 `root` 用户的密码已被破解，为 `reddragon`。

5.  **格式化 Flag:** 根据挑战要求的 `HMV{rootpassword}` 格式，将破解得到的密码填入。

### 结果：Flag

成功破解得到的 `root` 密码为 `reddragon`，因此 Flag 是：

```
HMV{reddragon}
```
