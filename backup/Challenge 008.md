# Challenge 008

# Challenge 008

**挑战链接:** https://hackmyvm.eu/challenges/challenge.php?c=008

![挑战图片](https://7r1UMPH.top/image/20250518104404775.webp)

## 1. 初步分析

挑战提供了一个可下载文件：`008.zip`。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ll 008.zip      
-rwxr-xr-x 1 kali kali 178 May 17 22:44 008.zip
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ unzip 008.zip     
Archive:  008.zip
   skipping: flag.txt                need PK compat. v5.1 (can do v4.6)
```
文件是一个很小的 zip 压缩包（178 字节）。并且它受密码保护，内部包含一个 flag 文件。

## 2. 密码破解

为了破解 zip 文件的密码，我们可以使用 `zip2john` 提取哈希值，然后使用 `john`进行破解。

### 2.1 提取哈希

首先，使用 `zip2john` 将 `008.zip` 文件的哈希值提取并保存到 `hash` 文件中：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ zip2john 008.zip > hash
```

查看 `hash` 文件的内容：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat hash 
008.zip/flag.txt:$zip2$*0*3*0*751e06905814ebe63a63c72e8755d887*d807*e*25e3c7613e997071cd21a2163883*ba4cf18e59493b2515da*$/zip2$:flag.txt:008.zip:008.zip
```
这串字符就是 `john` 可以识别的哈希格式。

### 2.2 使用 John the Ripper 破解哈希

接下来，使用 `john` 和一个常见的密码字典（例如 `rockyou.txt`）来破解这个哈希值：

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash
Using default input encoding: UTF-8
Loaded 1 password hash (ZIP, WinZip [PBKDF2-SHA1 512/512 AVX512BW 16x])
Cost 1 (HMAC size) is 14 for all loaded hashes
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
survivor         (008.zip/flag.txt)     
1g 0:00:00:00 DONE (2025-05-17 22:46) 6.666g/s 218453p/s 218453c/s 218453C/s 123456..eatme1
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```
从输出中可以看到，破解得到的密码是 `survivor`。

## 3. 解压文件并获取 Flag

得到密码后，我们尝试解压 `008.zip` 文件。

标准的 `unzip` 命令可能会因为 PKWARE 版本兼容性问题而失败：
```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ unzip 008.zip     
Archive:  008.zip
   skipping: flag.txt                need PK compat. v5.1 (can do v4.6)
```
提示 `need PK compat. v5.1 (can do v4.6)`，表明当前的 `unzip` 工具版本可能不完全支持该 zip 文件的加密特性。

我们可以改用 `7z` (7-Zip) 命令进行解压，它通常具有更好的兼容性：
```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ 7z x 008.zip

7-Zip 24.09 (x64) : Copyright (c) 1999-2024 Igor Pavlov : 2024-11-29
 64-bit locale=en_US.UTF-8 Threads:128 OPEN_MAX:1024, ASM

Scanning the drive for archives:
1 file, 178 bytes (1 KiB)

Extracting archive: 008.zip
--
Path = 008.zip
Type = zip
Physical Size = 178

Enter password (will not be echoed):
```
此时，输入之前破解得到的密码 `survivor`：
```bash
Enter password (will not be echoed):survivor  # 此处输入密码，终端不回显
Everything is Ok

Size:       14
Compressed: 178
```
解压成功后，会在当前目录下生成 `flag.txt` 文件。查看其内容：
```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat flag.txt 
HMV{cromiphi}
```

## 4. Flag

最终的 Flag 是：
```
HMV{cromiphi}
```

---

标签: hackmyvm靶场
