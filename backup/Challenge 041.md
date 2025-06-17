![image-20250617112622882](https://7r1umph.top/image/20250617112623238.webp)

下载

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ ll 041.zip 
-rwxr-xr-x 1 kali kali 1824 Jun 16 23:26 041.zip
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ unzip 041.zip 
Archive:  041.zip
 extracting: Challenge.kdbx          
               
```

**KeePass** 数据库文件

应该是破解密码

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ keepass2john Challenge.kdbx > hash    
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash
Using default input encoding: UTF-8
Loaded 1 password hash (KeePass [SHA256 AES 32/64])
Cost 1 (iteration count) is 2542373 for all loaded hashes
Cost 2 (version) is 2 for all loaded hashes
Cost 3 (algorithm [0=AES 1=TwoFish 2=ChaCha]) is 0 for all loaded hashes
Will run 8 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
amigos           (Challenge)     
1g 0:00:00:51 DONE (2025-06-16 23:29) 0.01944g/s 9.953p/s 9.953c/s 9.953C/s teiubesc..letmein
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
                      
```

按个KeePass客户端

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo apt install keepassxc
```

![image-20250617113119656](https://7r1umph.top/image/20250617113120073.webp)

```
HMV{EasyPeasyMoney}
```

